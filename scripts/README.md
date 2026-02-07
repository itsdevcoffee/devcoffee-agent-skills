# Scripts Directory

Shell scripts for managing Dev Coffee plugins, marketplace, and development workflows.

## Directory Structure

```
scripts/
├── plugin/          # Plugin installation and management
├── marketplace/     # Marketplace setup and configuration
├── utils/           # Manual registration and debugging utilities
└── README.md        # This file
```

## Plugin Management (`plugin/`)

Scripts for local plugin development and testing.

### `plugin/install.sh`

Install the devcoffee plugin locally for development.

**Usage:**
```bash
./scripts/plugin/install.sh [plugin-name] [plugin-path]
```

**What it does:**
- Validates plugin structure with `claude plugin validate`
- Registers plugin in `~/.claude/plugins/installed_plugins.json`
- Enables plugin in `~/.claude/settings.json`
- Creates backups of both config files
- Uses absolute paths for reliability

**Requirements:**
- `jq` command-line JSON processor
- Plugin must have `.claude-plugin/plugin.json`
- Claude Code must be initialized (`~/.claude` directory exists)

**Example:**
```bash
./scripts/plugin/install.sh devcoffee ./devcoffee
```

**After running:** Restart Claude Code completely (`pkill -f claude && claude`)

---

### `plugin/uninstall.sh`

Remove a local plugin from Claude Code.

**Usage:**
```bash
./scripts/plugin/uninstall.sh [plugin-name]
```

**What it does:**
- Removes plugin entry from `installed_plugins.json`
- Removes plugin from `enabledPlugins` in `settings.json`
- Creates timestamped backups before making changes
- Uses plugin key format: `{plugin-name}@local`

**Example:**
```bash
./scripts/plugin/uninstall.sh devcoffee
```

**After running:** Restart Claude Code

---

### `plugin/reinstall.sh`

Clean reinstall of devcoffee plugin (uninstall + install).

**Usage:**
```bash
./scripts/plugin/reinstall.sh
```

**What it does:**
1. Uninstalls `devcoffee@local` (ignores errors if not found)
2. Validates plugin structure
3. Installs plugin using `claude plugin install`
4. Enables plugin using `claude plugin enable`

**Hardcoded path:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee`

**Note:** Uses official `claude plugin` commands instead of manual JSON manipulation.

---

### `plugin/test-local.sh`

Test plugin locally without installing it.

**Usage:**
```bash
./scripts/plugin/test-local.sh
```

**What it does:**
- Starts Claude Code with `--plugin-dir` flag
- Loads plugin from local directory without installation
- Useful for quick testing during development

**Hardcoded path:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee`

**Commands available:**
- `/devcoffee:maximus`
- `/maximus` (if no conflicts)

**Press Ctrl+C to exit**

---

### `plugin/diagnose.sh`

Comprehensive diagnostics for plugin discovery issues.

**Usage:**
```bash
./scripts/plugin/diagnose.sh
```

**What it checks:**
- Claude Code version
- Plugin structure (tree/find)
- Plugin validation results
- Installed plugins list
- Registration in `installed_plugins.json`
- Enabled status in `settings.json`
- Command file frontmatter
- Agent file frontmatter
- Conflicts with other plugins

**Use when:**
- Commands aren't showing up after installation
- Plugin seems installed but doesn't work
- Debugging discovery issues
- Verifying plugin registration

---

## Marketplace Management (`marketplace/`)

Scripts for setting up and managing the devcoffee marketplace.

### `marketplace/fix-structure.sh`

Fix repository structure to be a proper Claude Code marketplace.

**Usage:**
```bash
./scripts/marketplace/fix-structure.sh
```

**What it does:**
1. Creates `.claude-plugin/` directory at repository root
2. Moves existing `marketplace.json` if found
3. Creates proper `marketplace.json` with metadata
4. Validates marketplace structure
5. Provides instructions for registration

**Creates:**
```
.claude-plugin/
└── marketplace.json    # Marketplace metadata and plugin list
```

**Marketplace structure:**
```json
{
  "name": "devcoffee-marketplace",
  "owner": { ... },
  "metadata": { ... },
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee",
      "description": "...",
      "version": "0.1.0",
      ...
    }
  ]
}
```

**After running:**
1. Clean up old registrations from `~/.claude/settings.json` and `installed_plugins.json`
2. Run in Claude Code: `/plugin marketplace add /path/to/repo`
3. Install: `/plugin install devcoffee@devcoffee-marketplace`

---

### `marketplace/install-devcoffee.sh`

Install devcoffee plugin from local marketplace.

**Usage:**
```bash
./scripts/marketplace/install-devcoffee.sh
```

**What it does:**
1. Cleans up old plugin registrations (`devcoffee`, `devcoffee@local`)
2. Removes entries from both config files
3. Provides instructions for marketplace installation
4. Optionally starts Claude Code interactively

**Next steps (manual):**
```bash
# In Claude Code:
/plugin marketplace add /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills
/plugin install devcoffee@devcoffee-marketplace
/devcoffee:maximus
```

**Interactive mode:** Prompts to start Claude Code if running in terminal

---

### `marketplace/add-remotion.sh`

Add remotion-best-practices plugin to devcoffee marketplace.

**Usage:**
```bash
./scripts/marketplace/add-remotion.sh
```

**What it does:**
1. Creates `remotion-best-practices/` plugin structure
2. Creates `plugin.json` with metadata
3. Copies skill files from source repository
4. Generates comprehensive README.md
5. Updates marketplace.json with new plugin entry

**Source:** `/home/maskkiller/projects/remotion-skill`

**Creates:**
```
remotion-best-practices/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── remotion-best-practices/
└── README.md
```

**After running:**
1. Review changes: `git status`
2. Test locally: `/plugin marketplace update devcoffee-agent-skills`
3. Install: `/plugin install remotion-best-practices@devcoffee-agent-skills`
4. Commit and push

---

## Utilities (`utils/`)

Manual registration and debugging utilities (advanced use only).

### `utils/register-manual.sh`

Manually register local plugin in Claude Code config files.

**Usage:**
```bash
./scripts/utils/register-manual.sh
```

**What it does:**
- Creates backups of config files
- Manually adds entry to `installed_plugins.json` with key `devcoffee@local`
- Enables plugin in `settings.json`
- Uses current timestamp
- Marks as `isLocal: true`

**Hardcoded path:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee`

**Warning:** This is a low-level manual operation. Prefer using `plugin/install.sh` instead.

**After running:** Restart Claude Code completely

---

### `utils/register-no-local-suffix.sh`

Register plugin WITHOUT `@local` suffix (legacy compatibility).

**Usage:**
```bash
./scripts/utils/register-no-local-suffix.sh
```

**What it does:**
1. Removes old `devcoffee@local` registrations
2. Registers plugin with key `devcoffee` (no suffix)
3. Updates both config files
4. Does NOT set `isLocal` flag

**Use when:**
- Debugging suffix-related issues
- Testing different registration formats
- Legacy compatibility testing

**Warning:** This approach may not follow current Claude Code conventions.

---

## Quick Reference

### Common Workflows

**Fresh plugin installation:**
```bash
./scripts/plugin/install.sh devcoffee ./devcoffee
# Restart Claude Code
pkill -f claude && claude
# Test: /devcoffee:maximus
```

**Quick test during development:**
```bash
./scripts/plugin/test-local.sh
# Test changes without installation
```

**Complete reinstall:**
```bash
./scripts/plugin/reinstall.sh
# Full uninstall + install cycle
```

**Marketplace setup:**
```bash
./scripts/marketplace/fix-structure.sh
# Then in Claude Code:
# /plugin marketplace add /path/to/repo
# /plugin install devcoffee@devcoffee-marketplace
```

**Debugging issues:**
```bash
./scripts/plugin/diagnose.sh
# Comprehensive diagnostics output
```

### Dependencies

All scripts require:
- `bash`
- `jq` - JSON processor (`sudo apt-get install jq` or `brew install jq`)
- `claude` - Claude Code CLI

Some scripts also use:
- `tree` - Directory visualization (optional, falls back to `find`)

### File Paths

Scripts reference these Claude Code config files:
- `~/.claude/settings.json` - User settings and enabled plugins
- `~/.claude/plugins/installed_plugins.json` - Plugin registry

**Backups:** Most scripts create timestamped backups before modifying config files.

### Best Practices

1. **Always restart Claude Code** after plugin installation/uninstall
   - `pkill -f claude && claude`

2. **Use absolute paths** when possible
   - Scripts convert relative paths to absolute automatically

3. **Check diagnostics first** if something doesn't work
   - Run `./scripts/plugin/diagnose.sh`

4. **Prefer official commands** over manual JSON editing
   - Use `plugin/reinstall.sh` instead of `utils/register-*.sh`

5. **Test locally first** before publishing
   - Use `plugin/test-local.sh` for quick iteration

---

## Troubleshooting

### Commands not showing up after installation

1. Run diagnostics: `./scripts/plugin/diagnose.sh`
2. Verify plugin is in `installed_plugins.json`
3. Verify plugin is enabled in `settings.json`
4. Ensure Claude Code was completely restarted
5. Try reinstall: `./scripts/plugin/reinstall.sh`

### "Plugin not found" errors

- Check plugin path is correct
- Verify `.claude-plugin/plugin.json` exists
- Run `claude plugin validate /path/to/plugin`

### jq command not found

Install jq:
- Ubuntu/Debian: `sudo apt-get install jq`
- macOS: `brew install jq`
- Fedora: `sudo dnf install jq`

### Permission denied

Make scripts executable:
```bash
chmod +x scripts/**/*.sh
```

---

## Contributing

When adding new scripts:

1. Place in appropriate subdirectory (`plugin/`, `marketplace/`, `utils/`)
2. Use descriptive names (verb-noun format: `install.sh`, `fix-structure.sh`)
3. Include usage comments at top of file
4. Update this README with documentation
5. Make executable: `chmod +x scripts/path/to/script.sh`

**Script template:**
```bash
#!/bin/bash
# Brief description of what this script does
#
# Usage: ./script.sh [arguments]

set -e  # Exit on error

# Script content...
```
