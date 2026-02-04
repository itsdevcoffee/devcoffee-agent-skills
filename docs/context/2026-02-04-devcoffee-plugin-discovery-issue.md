# Devcoffee Plugin Discovery Issue - Context for Troubleshooting

**Date:** 2026-02-04
**Status:** UNRESOLVED - Plugin validates but commands/agents not discoverable
**Repository:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee`

## Goal

Create a working Claude Code plugin called "devcoffee" with:
- **Command:** `/devcoffee:maximus` (or `/maximus`)
- **Agent:** `maximus` - Autonomous code review cycle agent
- **Purpose:** Run code-reviewer in loop → Fix issues → Run code-simplifier → Output formatted summary

## Current Status

### What Works ✅
- Plugin structure is correct according to official docs
- `claude plugin validate ./devcoffee` passes validation
- Plugin files have correct frontmatter format
- Plugin registered in `~/.claude/plugins/installed_plugins.json`
- Plugin enabled in `~/.claude/settings.json`
- `claude plugin list` shows: `devcoffee@local` Version 0.1.0, Status: ✔ enabled

### What Doesn't Work ❌
- **Commands NOT discoverable:** Typing `/dev` or `/devc` in Claude Code autocomplete does NOT show `/devcoffee:maximus`
- **Agent NOT triggerable:** Mentioning "maximus" or "review cycle" does not trigger the agent
- **Using --plugin-dir:** `claude --plugin-dir /path/to/devcoffee` does NOT make commands available

## Plugin Structure (Confirmed Correct)

```
devcoffee/
├── .claude-plugin/
│   └── plugin.json           # Valid manifest
├── agents/
│   └── maximus.md            # Agent definition with correct frontmatter
├── commands/
│   └── maximus.md            # Command definition with correct frontmatter
├── .gitignore
├── LICENSE
└── README.md
```

### plugin.json
```json
{
  "name": "devcoffee",
  "version": "0.1.0",
  "description": "Dev Coffee productivity skills for Claude Code - battle-tested workflows for code quality and development efficiency",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/maskkiller"
  },
  "repository": "https://github.com/maskkiller/devcoffee-agent-skills",
  "keywords": ["code-quality", "review", "automation", "productivity"],
  "license": "MIT"
}
```

### commands/maximus.md (frontmatter)
```yaml
---
description: Full review cycle - runs code-reviewer in a loop until clean, then finishes with code-simplifier
argument-hint: [--pause-reviews] [--pause-simplifier] [--pause-major] [--max-rounds N] [--interactive]
tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion
---
```

**Notes:**
- ✅ NO `name` field (filename becomes command name per docs)
- ✅ Uses `tools` not `allowed-tools`
- ✅ Has `description` (required)

### agents/maximus.md (frontmatter)
```yaml
---
name: maximus
description: Use this agent when the user wants a full code review cycle with automatic fixes and simplification. Trigger when user says "run maximus", "full review cycle", "review and fix my code", "review all my changes", "thorough code review", or after implementing a feature when they want quality assurance.
model: sonnet
color: green
---
```

**Notes:**
- ✅ Has `name: maximus`
- ✅ Has detailed `description` with triggering examples
- ✅ Has `model` and `color`

## Registration Details

### In `~/.claude/plugins/installed_plugins.json`
```json
"devcoffee@local": [
  {
    "scope": "user",
    "installPath": "/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee",
    "version": "0.1.0",
    "installedAt": "2026-01-23T21:06:00.000Z",
    "lastUpdated": "2026-01-23T21:06:00.000Z",
    "gitCommitSha": "",
    "isLocal": true
  }
]
```

### In `~/.claude/settings.json`
```json
{
  "enabledPlugins": {
    "devcoffee@local": true
  }
}
```

### In `~/.claude/plugins/known_marketplaces.json`
- ✅ NO invalid `local` marketplace entry (was causing corruption, removed)
- File is clean with only valid GitHub-based marketplaces

## What We've Tried (All Failed)

### Attempt 1: Symlink Approach
```bash
ln -sf /path/to/devcoffee ~/.claude/plugins/devcoffee
```
**Result:** Plugin not discovered

### Attempt 2: Manual Registration with @local suffix
- Added to `installed_plugins.json` as `devcoffee@local`
- Added to `settings.json` as enabled
**Result:** Shows in `claude plugin list` but commands/agents not discoverable

### Attempt 3: Creating Local Marketplace
- Tried creating a `local` marketplace in `known_marketplaces.json`
- Used `"source": "local"` (invalid - caused corruption)
**Result:** `claude doctor` reported marketplace configuration corruption, had to remove

### Attempt 4: Using --plugin-dir Flag
```bash
cd /tmp
claude --plugin-dir /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee
# Then type /dev<Tab>
```
**Result:** Commands still not discoverable in autocomplete

### Attempt 5: Install Scripts
- Created `install-local-plugin.sh` script
- Properly registers in both JSON files
- Plugin shows as enabled
**Result:** Registration works, but commands/agents still not discoverable

### Attempt 6: Removing name field from commands
- Initially had `name: maximus` in commands/maximus.md
- Removed per official docs (filename becomes name)
**Result:** No change, still not discoverable

### Attempt 7: Changed allowed-tools to tools
- Changed from `allowed-tools:` to `tools:` in commands frontmatter
**Result:** Validation passes, but still not discoverable

## Official Documentation References

### From code.claude.com/docs/en/plugins
- Commands in `commands/` directory are slash commands
- Filename becomes the command name (no `name` field in frontmatter)
- Command frontmatter should have: `description`, `tools`, optional `argument-hint`
- Test locally with: `claude --plugin-dir ./plugin-name`
- Command should be available as `/plugin-name:command-name`

### From GitHub anthropics/claude-code/plugins/README.md
Plugin structure confirmed:
```
plugin-name/
├── .claude-plugin/plugin.json
├── commands/
├── agents/
├── skills/
├── hooks/
└── README.md
```

## Validation Results

```bash
$ claude plugin validate /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee
Validating plugin manifest: /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/.claude-plugin/plugin.json

✔ Validation passed
```

```bash
$ claude plugin list | grep devcoffee
  ❯ devcoffee@local
    Version: 0.1.0
    Scope: user
    Status: ✔ enabled
```

```bash
$ claude doctor
# No plugin errors (after removing corrupted local marketplace)
```

## Observations

1. **Other plugins work:** When typing `/dev`, user sees:
   - `/feature-dev:feature-dev`
   - `/plugin-dev:create-plugin`
   - `/orchestrator`

   But NOT `/devcoffee:maximus`

2. **Plugin is recognized by Claude Code system:**
   - Shows in `claude plugin list`
   - Validation passes
   - Registered in both JSON files

3. **But commands/agents are NOT loaded:**
   - No autocomplete for `/devcoffee:maximus`
   - Agent not triggered by natural language
   - Even with `--plugin-dir` flag

4. **Possible hypothesis:**
   - There may be a silent error during plugin loading that prevents command/agent discovery
   - The `@local` suffix might still be causing issues despite being registered
   - There might be a cache or index that needs rebuilding
   - There might be additional requirements for local plugins vs marketplace plugins

## Questions for Next Investigation

1. **Is --plugin-dir actually supposed to work for command discovery?**
   - Documentation says it should, but maybe it only works for validation?

2. **Is there a plugin cache that needs clearing?**
   - `/home/maskkiller/.claude/plugins/cache/` exists but has no devcoffee entry
   - Should we manually create a cache entry?

3. **Are local plugins treated differently?**
   - All working plugins come from GitHub marketplaces
   - Maybe local plugins need a different registration method?

4. **Is there debug logging we can enable?**
   - How can we see what Claude Code is doing when it tries to load plugins?
   - Are there logs showing why devcoffee commands aren't being discovered?

5. **Should we try a different plugin name?**
   - Maybe "devcoffee" conflicts with something?
   - Try "testplugin" to rule out naming issues?

6. **Do we need to register without @local suffix?**
   - Try registering as just "devcoffee" instead of "devcoffee@local"?

## Files Created During Troubleshooting

- `install-local-plugin.sh` - Script to register local plugins
- `uninstall-local-plugin.sh` - Script to unregister local plugins
- `LOCAL-PLUGIN-DEVELOPMENT.md` - Documentation of local plugin development
- `QUICKSTART.md` - Quick reference guide

## Git Status

```
Current branch: main
M devcoffee/.claude-plugin/plugin.json
M devcoffee/commands/maximus.md
M devcoffee/agents/maximus.md
?? docs/tmp/
?? install-local-plugin.sh
?? uninstall-local-plugin.sh
```

Latest commit: `d214eb8 fix: address validation issues and enhance maximus agent robustness`

## Next Steps to Try

1. **Enable debug logging** - Find out if there's a way to see Claude Code's plugin loading process
2. **Compare with working local plugin** - Check if there are any working local plugins (found `remotion-setup@local` reference)
3. **Try minimal test plugin** - Create the simplest possible plugin to isolate the issue
4. **Check Claude Code version** - Maybe there's a version mismatch or bug in v2.1.19
5. **Search for similar issues** - Look for other users having local plugin discovery issues
6. **Ask in Claude Code community** - Someone might have encountered this before

## Contact/Help Needed

This is a blocking issue for local plugin development. The plugin structure is correct according to all official documentation, validation passes, but commands/agents are simply not being discovered by Claude Code at runtime.

If you're picking up this investigation, please:
1. Try the exact steps above to reproduce
2. Check if there's been any changes to plugin loading in Claude Code v2.1.19
3. Look for any silent errors or logs that might explain why discovery is failing
4. Consider if there's a fundamental misunderstanding about how local plugins should work
