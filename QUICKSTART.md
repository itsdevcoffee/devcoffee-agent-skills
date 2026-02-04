# Quick Start - Local Plugin Development

## TL;DR

```bash
# Install your plugin
./install-local-plugin.sh devcoffee ./devcoffee

# Verify it's installed
claude plugin list | grep devcoffee

# Test in a new Claude session
claude
# Your commands and agents are now available!

# Make changes to your plugin files
# Then restart Claude to test changes

# Uninstall when done
./uninstall-local-plugin.sh devcoffee
```

## What Just Happened?

The install script:
1. Validated your plugin structure
2. Registered it in `~/.claude/plugins/installed_plugins.json` with absolute path
3. Enabled it in `~/.claude/settings.json`
4. Made your commands/agents/skills discoverable

## Development Workflow

```bash
# 1. Install once
./install-local-plugin.sh devcoffee ./devcoffee

# 2. Edit your plugin
vim devcoffee/commands/maximus.md
vim devcoffee/agents/maximus.md

# 3. Test changes (restart Claude)
claude
> /maximus "test this"

# 4. Repeat steps 2-3 until done

# 5. Uninstall when finished
./uninstall-local-plugin.sh devcoffee
```

## Key Facts

1. **Changes are live** - Edit files, restart Claude, changes load immediately
2. **No reinstall needed** - Only reinstall if you change `plugin.json`
3. **Absolute paths used** - Plugin stays linked even if you move directories
4. **`--plugin-dir` is NOT for this** - That flag is validation-only

## Verify Installation

```bash
# Check plugin is registered
claude plugin list

# Should show:
# ❯ devcoffee@local
#     Version: 0.1.0
#     Scope: user
#     Status: ✔ enabled
```

## Troubleshooting

**Command not showing up?**
```bash
# Verify registration
jq '.plugins["devcoffee@local"]' ~/.claude/plugins/installed_plugins.json

# Should show installPath with absolute path
```

**Changes not loading?**
- Exit Claude completely (Ctrl+D)
- Start new session
- Changes should be visible

**Want to reinstall?**
```bash
./uninstall-local-plugin.sh devcoffee
./install-local-plugin.sh devcoffee ./devcoffee
```

## The Two Files That Matter

### ~/.claude/plugins/installed_plugins.json
```json
{
  "plugins": {
    "devcoffee@local": [{
      "installPath": "/absolute/path/to/devcoffee",
      "version": "0.1.0",
      ...
    }]
  }
}
```

### ~/.claude/settings.json
```json
{
  "enabledPlugins": {
    "devcoffee@local": true
  }
}
```

Both must be present for plugin to work.

## Next Steps

See `LOCAL-PLUGIN-DEVELOPMENT.md` for detailed explanation of how this works.
