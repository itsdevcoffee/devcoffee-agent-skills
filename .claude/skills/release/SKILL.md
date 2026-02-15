---
name: release
description: Use when releasing a new plugin version - prevents forgotten tags, version mismatches, dirty commits, and minimal CHANGELOGs under time/authority/exhaustion pressure
---

# Plugin Release Workflow

## Overview

**This workflow prevents the 7 deadly sins of rushed releases:** forgotten tags, version mismatches, dirty commits, minimal CHANGELOGs, skipped validation, unverified commits, and generic commit messages.

**Core principle:** Quality process applies to ALL releases - patches, minors, and majors. No shortcuts.

## When to Use

Use when:
- Releasing a new plugin version
- User says "release", "publish", "bump version", "tag"
- About to update CHANGELOG and version files
- Under ANY pressure (time, authority, exhaustion, sunk cost)

**Use ESPECIALLY when:**
- Team lead says "just get it out quickly"
- Users are waiting for the fix
- It's late and you're tired
- "It's just a patch version"
- "I can do X later"

## The Checklist

**IMPORTANT:** Complete ALL steps in order. NO skipping, NO deferring, NO shortcuts.

### Step 1: Identify Plugin and Version

```markdown
**Plugin:** [name]
**Current version:** [X.Y.Z]
**New version:** [X.Y.Z]
**Version type:** [MAJOR | MINOR | PATCH]
```

**Verify semantic versioning:**
- **MAJOR:** Breaking changes, incompatible API changes
- **MINOR:** New features, backwards-compatible
- **PATCH:** Bug fixes, backwards-compatible

### Step 2: Update CHANGELOG.md

**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/CHANGELOG.md`

**Actions:**
1. Read current `[Unreleased]` section
2. Move ALL entries to new `[<plugin> vX.Y.Z] - YYYY-MM-DD` section
3. Verify entries have proper categories:
   - `### Added` - New features
   - `### Changed` - Changes to existing functionality
   - `### Fixed` - Bug fixes
   - `### Removed` - Removed features
   - `### Deprecated` - Soon-to-be removed features
   - `### Security` - Security fixes
4. **Verify detail quality:**
   - Each entry describes WHAT changed
   - Impact or context included
   - Migration notes if breaking change

**❌ NOT ACCEPTABLE:**
- Generic entries: "Fixed bug"
- One-line summaries without context
- Missing category headers

**✅ GOOD EXAMPLE:**
```markdown
## [tldr v1.1.3] - 2026-02-15

### Fixed
- Fixed evaluation scoring logic to properly weight clarity criteria (was treating all criteria equally, now uses configured weights from EVALUATION.md)
```

### Step 3: Update Version Files

**Update ALL 3 locations (or 2 if plugin-metadata.json doesn't exist):**

1. `<plugin>/.claude-plugin/plugin.json`
2. `.claude-plugin/marketplace.json` (find the plugin's entry)
3. `<plugin>/.claude-plugin/plugin-metadata.json` (if exists)

**For each file:**
- Read current version
- Edit to new version
- Verify change was applied correctly

**Cross-reference check:** After all edits, verify all locations match.

### Step 4: Run Validation

```bash
cd /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills
npm run readme:validate
```

**STOP if validation fails.** Fix issues before continuing.

### Step 5: Stage Specific Files

**NO `git add -A` shortcuts.** List exact files:

```bash
git add CHANGELOG.md
git add <plugin>/.claude-plugin/plugin.json
git add .claude-plugin/marketplace.json
# If exists:
git add <plugin>/.claude-plugin/plugin-metadata.json
```

**Verify staging:**
```bash
git diff --staged
```

**Review:** Ensure ONLY version/CHANGELOG files are staged. No unrelated changes.

### Step 6: Create Commit

**Format (non-negotiable):** `chore(<plugin>): release vX.Y.Z`

**Why this exact format?**
- `chore` type = non-functional change (standard for releases)
- `(<plugin>)` scope = clear ownership in monorepo
- CHANGELOG automation tools expect this pattern

**Body:** Brief summary of changes from CHANGELOG.

**Example:**
```bash
git commit -m "$(cat <<'EOF'
chore(tldr): release v1.1.3

Fixed evaluation scoring logic to properly weight clarity criteria.
EOF
)"
```

**Verify commit:**
```bash
git show --stat
```

### Step 7: Create Git Tag

**CRITICAL:** Do this NOW, not "later".

**Format:** `<plugin>-vX.Y.Z` (plugin-prefixed to avoid conflicts in monorepo)

**Example:**
```bash
git tag tldr-v1.1.3
```

**Verify tag created:**
```bash
git tag -l "*<plugin>*" | tail -5
```

**Confirm:** Tag appears in list.

### Step 8: Final Verification

**REQUIRED:** Copy this checklist and mark each item with ✓:

```
- [ ] CHANGELOG has detailed entry under [<plugin> vX.Y.Z]
- [ ] All version files updated and match
- [ ] Validation passed (npm run readme:validate)
- [ ] Only version/CHANGELOG files staged (no dirty commits)
- [ ] Commit message follows format: chore(<plugin>): release vX.Y.Z
- [ ] Git tag created with plugin prefix (<plugin>-vX.Y.Z)
- [ ] Tag verified in git tag -l output
```

**If you cannot mark ALL items with ✓, STOP and fix it.** No exceptions.

### Step 9: Push Release

**Command (atomic push):**
```bash
git push origin main --tags
```

**Why push commit and tags together?**
- Tag without pushed commit = local-only, invisible to others
- Commit without pushed tag = unversioned code in production
- Both together = atomic release, visible version, rollback-safe

**❌ FORBIDDEN partial pushes:**
- `git push` (without --tags)
- `git push --tags` (without commit)
- Pushing commit and tags in separate operations

**Verify push succeeded:**
```bash
git ls-remote --tags origin | grep <plugin>
```

**Confirm:** Tag appears on remote.

### Step 10: Announce Completion

```markdown
✅ Release complete for <plugin> v<X.Y.Z>

**Released:**
- Version: <X.Y.Z>
- Tag: <plugin>-v<X.Y.Z>
- Commit: [short hash]

**Next steps:**
- Monitor for any issues
- Update documentation if needed
- Communicate release to users
```

## Red Flags - STOP Immediately

These thoughts mean you're rationalizing shortcuts:

| Thought | Reality |
|---------|---------|
| "I can create the tag later" | Tags deferred are tags forgotten. Do it NOW. |
| "It's just a patch version" | Process applies to ALL versions. |
| "Team lead wants it quick" | Broken release hurts users more than delay. |
| "Users are waiting" | Quality over speed. Always. |
| "I already spent 2 hours" | Sunk cost fallacy. Don't compound with rushed release. |
| "The commit looks clean" | Verify what's staged. Don't assume. |
| "CHANGELOG is fine" | Read it. Is it detailed enough? |
| "git add -A is faster" | Fast = dirty commits with unrelated files. |
| "I'll add details to the CHANGELOG later" | CHANGELOG is part of the release. Write it now or don't release. |
| "I did all the steps, skip the checklist" | Verification prevents mistakes. Check ALL items. |

**If you catch yourself rationalizing, STOP. Follow the checklist.**

## Version File Reference

**When plugin-metadata.json exists:**
Check these plugins: `devcoffee`, `video-analysis`, `remotion-max`, `maximus-loop`, `tldr`, `opentui-dev`, `expo-cunningham`

**If missing:** That's normal for some plugins. Just update the 2 required files:
- `<plugin>/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Tag Naming Convention

**Format:** `<plugin>-vX.Y.Z`

**Examples:**
- `tldr-v1.1.3`
- `maximus-loop-v0.3.1`
- `devcoffee-v0.5.2`

**Why plugin prefix?**
- Monorepo with 6+ plugins
- Prevents tag conflicts when multiple plugins release same version number
- Clear ownership in git history

**❌ NEVER use:** `v1.1.3` (ambiguous in monorepo)

## Semantic Versioning Guide

Given a version number `MAJOR.MINOR.PATCH`:

1. **MAJOR:** Incompatible API changes, breaking changes
   - Removing commands/skills/agents
   - Changing skill behavior that breaks existing workflows
   - Requires user action to migrate

2. **MINOR:** New functionality, backwards-compatible
   - Adding new commands/skills/agents
   - Enhancing existing features without breaking changes
   - New optional parameters

3. **PATCH:** Bug fixes, backwards-compatible
   - Fixing broken functionality
   - Documentation updates
   - Performance improvements

**When uncertain:** Prefer higher version (MINOR over PATCH, MAJOR over MINOR).

## Common Mistakes

### Mistake 1: Forgetting the Tag

**Symptom:** Commit and push, but no tag created.

**Fix:** Tags are step 7, BEFORE push (step 9). Never defer.

### Mistake 2: Version Mismatch

**Symptom:** plugin.json says 1.1.3, marketplace.json says 1.1.2.

**Fix:** Cross-reference check in step 3. All locations must match.

### Mistake 3: Dirty Commit

**Symptom:** Release commit includes unrelated file changes.

**Fix:** Stage specific files (step 5), verify with `git diff --staged`.

### Mistake 4: Generic CHANGELOG

**Symptom:** Entry says "Fixed bug" with no context.

**Fix:** Step 2 requires detailed entries with WHAT changed and WHY.

### Mistake 5: Generic Tag Name

**Symptom:** Tag is `v1.1.3` instead of `tldr-v1.1.3`.

**Fix:** Step 7 explicitly requires plugin-prefixed format.

### Mistake 6: Skipped Validation

**Symptom:** Push fails or marketplace has schema errors.

**Fix:** Step 4 runs validation BEFORE commit. Never skip.

## The Bottom Line

**Rushing releases creates debt.** Forgotten tags, dirty commits, minimal CHANGELOGs - these compound over time.

**10 minutes now saves hours later.**

Follow the checklist. Every step. Every time.
