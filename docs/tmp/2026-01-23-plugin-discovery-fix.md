# Plugin Discovery Fix - Local Plugins Not Loading

## Problem

The `devcoffee@local` plugin was registered in `installed_plugins.json` and validated successfully with `claude plugin validate`, but commands and agents were NOT appearing in Claude Code sessions.

## Root Cause

Debug logs showed:
```
Plugin loading errors: Plugin devcoffee not found in marketplace local
```

Claude Code treats the `@local` suffix in plugin names as a **marketplace identifier**, but there was no `local` marketplace registered in `~/.claude/plugins/known_marketplaces.json`.

Without this marketplace entry, Claude Code couldn't resolve the plugin's location for component discovery, even though the plugin was listed in `installed_plugins.json`.

## Solution

### 1. Add `local` Marketplace Entry

Edit `~/.claude/plugins/known_marketplaces.json` and add:

```json
{
  "local": {
    "source": {
      "source": "local",
      "repo": ""
    },
    "installLocation": "/home/maskkiller/.claude/plugins/cache/local",
    "lastUpdated": "2026-01-23T21:43:00.000Z"
  }
}
```

### 2. Create Marketplace Directory

```bash
mkdir -p ~/.claude/plugins/marketplaces/local
```

### 3. Correct Plugin Installation Path

Local plugins must be installed in the cache with proper structure:

```
~/.claude/plugins/cache/local/devcoffee/0.1.0/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── maximus.md
├── agents/
│   └── maximus.md
├── LICENSE
└── README.md
```

NOT as a symlink in `~/.claude/plugins/devcoffee` (which doesn't work for discovery).

### 4. Update installed_plugins.json

```json
{
  "devcoffee@local": [
    {
      "scope": "user",
      "installPath": "/home/maskkiller/.claude/plugins/cache/local/devcoffee/0.1.0",
      "version": "0.1.0",
      "installedAt": "2026-01-23T21:39:00.000Z",
      "lastUpdated": "2026-01-23T21:39:00.000Z",
      "gitCommitSha": ""
    }
  ]
}
```

## Key Insights

1. **Local plugins can't use symlinks** - They must be copied to the cache directory
2. **The `@local` suffix requires a marketplace entry** - Even for local development
3. **The discovery mechanism relies on marketplace resolution** - Without it, validation passes but discovery fails
4. **Debug logs are critical** - The error "Plugin devcoffee not found in marketplace local" was the smoking gun

## Verification

After applying the fix:

1. `claude plugin list` should show `devcoffee@local` as enabled
2. Debug logs should NOT contain "Plugin devcoffee not found in marketplace local"
3. Commands should appear in fresh Claude sessions as `/devcoffee:maximus`
4. Agents should be available when typing `/maximus` or matching trigger phrases

## Commands to Apply Fix

```bash
# Remove symlink if exists
rm ~/.claude/plugins/devcoffee

# Copy plugin to proper location
mkdir -p ~/.claude/plugins/cache/local/devcoffee/0.1.0
cp -r /path/to/plugin/devcoffee/* ~/.claude/plugins/cache/local/devcoffee/0.1.0/

# Create marketplace directory
mkdir -p ~/.claude/plugins/marketplaces/local

# Add marketplace entry to known_marketplaces.json (manual edit required)
# Add installPath entry to installed_plugins.json (manual edit required)

# Restart Claude to pick up changes
```

## Status

Applied fix at 2026-01-23T21:43:00Z. Waiting for confirmation that commands/agents are now discoverable in fresh Claude sessions.
