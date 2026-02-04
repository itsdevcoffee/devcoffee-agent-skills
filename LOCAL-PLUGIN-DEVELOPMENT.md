# LOCAL PLUGIN DEVELOPMENT - THE DEFINITIVE GUIDE

This is the **actual, tested method** for developing and testing Claude Code plugins locally.

## Understanding Plugin Loading

Claude Code discovers plugins through TWO files:

1. **`~/.claude/settings.json`** - Contains `enabledPlugins` object with enabled/disabled state
2. **`~/.claude/plugins/installed_plugins.json`** - Contains plugin registry with install paths

**CRITICAL**: A plugin must be in BOTH files to work. The `--plugin-dir` flag is ONLY for validation, NOT for discovery.

## The Problem We Hit

- `--plugin-dir ./devcoffee` validates the plugin but doesn't make commands/agents discoverable
- Adding to `settings.json` alone doesn't work - plugin must also be in `installed_plugins.json`
- Marketplace registration is NOT needed for local development

## The Working Method

### Quick Start

```bash
# Install the plugin
./install-local-plugin.sh devcoffee ./devcoffee

# Test it
claude --help | grep maximus
/maximus

# Make changes to your plugin
# Changes are live - no reinstall needed!

# Uninstall when done
./uninstall-local-plugin.sh devcoffee
```

### What the Install Script Does

1. **Validates** the plugin structure using `claude plugin validate`
2. **Registers** the plugin in `~/.claude/plugins/installed_plugins.json`:
   ```json
   {
     "plugins": {
       "devcoffee@local": [{
         "scope": "user",
         "installPath": "/absolute/path/to/devcoffee",
         "version": "1.0.0",
         "installedAt": "2026-01-23T...",
         "lastUpdated": "2026-01-23T...",
         "gitCommitSha": ""
       }]
     }
   }
   ```
3. **Enables** the plugin in `~/.claude/settings.json`:
   ```json
   {
     "enabledPlugins": {
       "devcoffee@local": true
     }
   }
   ```

### Live Development Workflow

Once installed, changes are **immediately active**:

1. Edit your plugin files (commands, agents, skills, hooks)
2. Start a new Claude session - changes are loaded automatically
3. No reinstall or restart needed (except for plugin.json changes)

### Testing Commands & Agents

```bash
# List all commands (your plugin's should appear)
claude --help

# Test a command
/maximus "review this code"

# Test agent auto-triggering
# Just use Claude normally - agent triggers based on description patterns
```

## Directory Structure

Your local plugin should follow this structure:

```
devcoffee/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── maximus.md          # Slash command definition
├── agents/
│   └── maximus.md          # Agent definition
├── skills/
│   └── some-skill/
│       └── SKILL.md
└── README.md
```

## Plugin Manifest (.claude-plugin/plugin.json)

Minimal valid manifest:

```json
{
  "name": "devcoffee"
}
```

Full manifest with optional fields:

```json
{
  "name": "devcoffee",
  "version": "1.0.0",
  "description": "Dev Coffee agent skills",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
```

## Key Discovery Mechanism

When Claude Code starts:

1. Loads `~/.claude/plugins/installed_plugins.json`
2. For each plugin entry, reads the `installPath`
3. Loads the plugin from that path
4. Checks `~/.claude/settings.json` to see if it's enabled
5. If enabled, makes commands/agents/skills available

## Common Issues & Solutions

### Issue: Command not appearing in `--help`

**Cause**: Plugin not registered in `installed_plugins.json`

**Fix**:
```bash
./install-local-plugin.sh devcoffee ./devcoffee
```

### Issue: Agent not auto-triggering

**Check**:
1. Is the plugin enabled? `claude plugin list`
2. Does the agent's `<when-to-use>` match your query?
3. Is there a more specific agent from another plugin being triggered instead?

### Issue: Changes not taking effect

**Cause**: Need to start a new Claude session

**Fix**: Exit Claude and start a new session (Ctrl+D, then re-run `claude`)

### Issue: Plugin.json changes not loading

**Cause**: Plugin registration cache

**Fix**:
```bash
# Uninstall and reinstall
./uninstall-local-plugin.sh devcoffee
./install-local-plugin.sh devcoffee ./devcoffee
```

## Advanced: Symlink Method (Alternative)

Instead of using the install script, you can manually symlink:

```bash
# Create symlink
ln -s "$(pwd)/devcoffee" ~/.claude/plugins/devcoffee

# Manually edit installed_plugins.json and settings.json
# (See structure above)
```

This is what `remotion-setup@local` uses in your system.

## The Official Method (Future)

Anthropic is working on an official `claude plugin install --local <path>` command.
Until then, this manual method is the working approach.

## Validation

Always validate before testing:

```bash
claude plugin validate ./devcoffee
```

This checks:
- plugin.json syntax and structure
- Command frontmatter format
- Agent definition format
- Skill structure

## Example: Real Working Local Plugin

See `remotion-setup@local` in your `~/.claude/plugins/` directory:
- Registered in `installed_plugins.json` with `installPath: "/home/.../remotion-setup"`
- Enabled in `settings.json` with `"remotion-setup@local": true`
- Commands/agents work immediately

## Summary

**The Definitive Method:**

1. ✅ Create plugin with `.claude-plugin/plugin.json`
2. ✅ Validate: `claude plugin validate ./plugin-dir`
3. ✅ Install: `./install-local-plugin.sh plugin-name ./plugin-dir`
4. ✅ Test: Start new Claude session
5. ✅ Develop: Edit files, restart Claude to test
6. ✅ Uninstall: `./uninstall-local-plugin.sh plugin-name`

**Don't Do:**
- ❌ Use `--plugin-dir` for anything except validation
- ❌ Try to register in a marketplace for local testing
- ❌ Edit settings.json without also updating installed_plugins.json
- ❌ Use relative paths in installed_plugins.json

---

**This is the method that actually works.** Based on analyzing how `remotion-setup@local` is installed in your system.
