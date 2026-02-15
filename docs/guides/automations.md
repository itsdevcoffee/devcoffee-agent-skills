# Claude Code Automations Guide

This repo has 6 automations that fire automatically or on demand. Here's what each one does, when it fires, and how to verify it works.

---

## Hooks (Fire Automatically)

Hooks run automatically in response to Claude Code events. You don't invoke them - they just work.

### 1. Marketplace Protection (PreToolUse)

**What it does:** Blocks any Edit or Write to `marketplace.json`. Forces you to use the release skill instead of ad-hoc edits.

**When it fires:** Every time Claude tries to edit or write a file. If the file path contains `marketplace.json`, the hook blocks it.

**How to test:**
```
Ask Claude: "Add a new entry to .claude-plugin/marketplace.json"
Expected: Hook blocks the edit with "⚠️ BLOCK: marketplace.json should only be edited during releases."
```

### 2. Plugin Metadata Validation (PostToolUse)

**What it does:** Automatically runs `node scripts/validate-plugins.js` after any edit to `plugin.json` or `plugin-metadata.json`. Shows validation results inline.

**When it fires:** After Claude edits or writes any file with `plugin.json` or `plugin-metadata.json` in the path.

**How to test:**
```
Ask Claude: "Open devcoffee/.claude-plugin/plugin.json and change the description"
Expected: After the edit, you see validation output ending with "✓ Plugin validation passed"
```

### 3. Version Check Reminder (Stop)

**What it does:** When Claude finishes a turn, checks if plugin source files were modified without version bumps or CHANGELOG updates. Shows a reminder if versioning is incomplete.

**When it fires:** At the end of every Claude response (the `Stop` event).

**How to test:**
```
Ask Claude to edit any plugin file (e.g., "Fix a typo in tldr/skills/tldr/SKILL.md")
Expected: After the edit, you see "Version Check Reminder" if version files weren't also updated
```

### 4. Context Recovery (PreCompact)

**What it does:** Injects recovery instructions when context compaction occurs during long sessions. Tells Claude how to find session state for buzzminson/maximus workflows.

**When it fires:** Automatically when the context window gets full and Claude compresses earlier messages.

**How to test:** This only fires in very long sessions. You'll see "Devcoffee Recovery Context" appear if it triggers.

---

## Skills (On Demand)

Skills are invoked by Claude (or you via slash command if a command exists). These live in `.claude/skills/`.

### 5. Release Workflow

**What it does:** Guides through a 10-step plugin release process:
1. Identify plugin + version type
2. Update CHANGELOG with detailed entries
3. Update all version files (plugin.json + marketplace.json)
4. Run validation
5. Stage specific files (no `git add -A`)
6. Create commit with standard format
7. Create plugin-prefixed git tag
8. Verification checklist
9. Atomic push (commit + tags together)
10. Completion announcement

**Prevents:** Forgotten tags, version mismatches, dirty commits, minimal CHANGELOGs, skipped validation.

**How to invoke:**
```
"Release tldr version 1.2.0"
"I need to publish a new version of maximus-loop"
```
Claude will automatically pick up the `release` skill from its description triggers.

**How to test (dry run):**
```
Ask Claude: "Walk me through what a release of tldr v99.0.0 would look like, but don't actually do it"
Expected: Claude follows the 10-step process, showing each step with the verification checklist
```

### 6. Plugin Scaffolding

**What it does:** Creates a new plugin with 100% correct structure:
- Directory layout (`.claude-plugin/`, `skills/`, `commands/`, `agents/`)
- `plugin.json` with correct metadata
- Skills with only `name` + `description` frontmatter
- Commands as thin wrappers (8 lines, not 62)
- `disable-model-invocation: true` on all commands
- Marketplace registration

**Prevents:** Forbidden frontmatter fields, verbose commands, missing critical fields, workflow descriptions, dispatcher anti-patterns.

**How to invoke:**
```
"Create a new plugin called my-cool-tool"
"Scaffold a plugin for X"
```

**How to test:**
```
Ask Claude: "Scaffold a test plugin called demo-test in a temp directory"
Then verify:
- skills/ uses skills/name/SKILL.md structure (not flat)
- Skill frontmatter has ONLY name + description
- Command file is ~8 lines (thin wrapper)
- Command has disable-model-invocation: true
- Command has NO name field
```

---

## Subagent (Dispatched by Claude)

### 7. Plugin Consistency Checker

**What it does:** Verifies all plugins follow consistent structure. Checks:
- Version consistency across 3 file locations per plugin
- Directory structure compliance
- Frontmatter specification adherence
- Marketplace registration completeness
- Anti-pattern detection

**How to invoke:**
```
"Run the plugin consistency checker"
"Check if all plugins are consistent"
"Verify plugin structure across the marketplace"
```

**How to test:**
```
Ask Claude: "Run the plugin consistency checker on this repo"
Expected: A structured report with ✅ Passing, ⚠️ Warnings, ❌ Critical Issues sections
```

---

## Where Everything Lives

```
.claude/
├── settings.json                          # Hooks (4 hooks configured)
├── settings.local.json                    # Permissions
├── skills/
│   ├── release/SKILL.md                   # Release workflow (10 steps)
│   └── new-plugin/SKILL.md                # Plugin scaffolding
└── agents/
    └── plugin-consistency-checker.md       # Structure verification
```

## Quick Test Checklist

Run these 4 tests to verify everything is wired up:

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Ask Claude to edit `marketplace.json` | Blocked by PreToolUse hook |
| 2 | Ask Claude to edit any `plugin.json` | Validation output appears after edit |
| 3 | Ask Claude to scaffold a test plugin | Correct structure with thin wrappers |
| 4 | Ask Claude to check plugin consistency | Structured report across all plugins |

Tests 1-2 are fully automatic (hooks). Tests 3-4 require asking Claude (skills/subagent).
