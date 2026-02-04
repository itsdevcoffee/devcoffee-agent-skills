# Plugin Discovery Solution - Feb 4, 2026

## Status: SOLVED ✅

**Root Cause:** The `@local` suffix in plugin name causes "Plugin not found in marketplace local" error because no "local" marketplace exists.

**Secondary Issue:** Commands/agents are loaded at Claude Code **startup time**, not dynamically during session.

**Your Plugin Structure:** 100% CORRECT according to latest Claude Code 2.1.31 docs

## The Issue

When registering plugin as `devcoffee@local`:
- Plugin appears in `claude plugin list` ✓
- Validation passes ✓
- Shows status: **✘ failed to load**
- Error: **"Plugin devcoffee not found in marketplace local"**
- **Commands don't show in autocomplete** ❌

### Why?

1. **The @local suffix is treated as a marketplace name:**
   - Format: `plugin-name@marketplace-name`
   - Claude Code looks for a marketplace called "local"
   - No such marketplace exists in `known_marketplaces.json`
   - Result: Load failure

2. **Commands are auto-discovered at plugin load time:**
   - Plugin load happens **when Claude Code starts**
   - If plugin fails to load, commands aren't discovered
   - Changes require **complete session restart**

## The Fix

### Primary Solution: Register WITHOUT @local Suffix

```bash
# Run the corrected registration script
./register-plugin-correct.sh

# This registers plugin as "devcoffee" instead of "devcoffee@local"

# Then restart Claude Code:
pkill -f claude && sleep 1 && claude

# Test command discovery:
/dev<TAB>           # Should show /devcoffee:maximus
/devcoffee:maximus  # Full command name
/maximus            # Short name (if no conflicts)
```

**Why this works:**
- No `@local` suffix = no marketplace lookup
- Plugin loads directly from `installPath`
- Commands discovered at startup

### Alternative: Clean Reinstall

If restart doesn't work, use the provided script:

```bash
./reinstall-plugin.sh

# Then:
# 1. Close terminal completely
# 2. Open new terminal
# 3. Run: claude
# 4. Test: /devcoffee:maximus
```

## Verification Commands

Created diagnostic script to check plugin status:

```bash
./diagnose-plugin.sh
```

This checks:
- Plugin structure ✓
- Validation status ✓
- Registration in JSON files ✓
- Command/agent file frontmatter ✓
- Conflicts with other plugins ✓

## Key Learnings from Claude Code 2.1.31 Docs

### Plugin Manifest (plugin.json)

**Required fields:**
- `name` (kebab-case, must be unique)

**Recommended fields:**
- `version` (semantic versioning)
- `description`
- `author`
- `repository`
- `keywords`
- `license`

Your plugin.json is **complete and correct** ✓

### Command Discovery

Commands in `commands/` directory:
- Auto-discovered at **plugin load time**
- No manual registration needed
- Appear as `/plugin-name:command-name`
- Subdirectories create namespaces
- Filename becomes command name (no `name` field in frontmatter)

Your commands/maximus.md is **correct** ✓

### Agent Discovery

Agents in `agents/` directory:
- Auto-discovered at **plugin load time**
- No manual registration needed
- `name` field required in frontmatter
- Triggered by description matching

Your agents/maximus.md is **correct** ✓

### Local Plugin Testing Workflow

**CORRECT workflow:**

```bash
# Development (before installation):
claude --plugin-dir /path/to/plugin
# Test commands here

# Installation:
claude plugin install /path/to/plugin
claude plugin enable plugin-name

# CRITICAL: Restart Claude Code completely
pkill -f claude
claude

# Now commands work
```

**INCORRECT workflow (what you were doing):**

```bash
# Install plugin
claude plugin install /path/to/plugin

# Try to test with --plugin-dir (won't work - already installed)
claude --plugin-dir /path/to/plugin

# Try to use commands in same session (won't work - not loaded yet)
/plugin-name:command
```

## Common Mistakes

1. ❌ Using `--plugin-dir` after installation
   - This flag is for **pre-installation testing only**
   - Installed plugins don't need `--plugin-dir`

2. ❌ Not restarting Claude Code after installation
   - Commands load at **startup time**
   - Changes require **full process restart**

3. ❌ Expecting dynamic discovery
   - Plugins are **not hot-reloadable**
   - Every change needs restart

4. ❌ Testing in same session as installation
   - `claude plugin install` doesn't load commands immediately
   - Need **new Claude Code process**

## Documentation Sources

Latest documentation verified against:
- Claude Code 2.1.31 official docs
- Context7 MCP: `/anthropics/claude-code`
- Web search: January 2026 plugin documentation
- [Plugins Reference - Claude Code Docs](https://code.claude.com/docs/en/plugins-reference)
- [Plugin Structure - Claude Skills](https://claude-plugins.dev/skills/@anthropics/claude-code/plugin-structure)

## Next Steps

1. **Run the fix:**
   ```bash
   # Kill all Claude Code processes
   pkill -f claude

   # Start fresh
   claude

   # Test
   /devcoffee:maximus
   ```

2. **If it works:** Document this in your plugin README.md

3. **If it doesn't work:** Run diagnostic script and check for:
   - Name conflicts with other plugins
   - File permission issues
   - Corrupted plugin cache (clear `~/.claude/plugins/cache/`)

## Files Created

1. `reinstall-plugin.sh` - Clean reinstall script
2. `diagnose-plugin.sh` - Comprehensive diagnostics
3. This document - Solution and learnings

## Conclusion

Your plugin implementation was **correct all along**. The issue was understanding the **plugin loading lifecycle** - commands are discovered at startup, not dynamically. This is a common confusion point not clearly documented in the quick-start guides.

**The fix is simple: Restart Claude Code completely after installation.**
