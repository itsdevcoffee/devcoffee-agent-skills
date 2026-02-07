# Scripts Directory

Shell scripts for managing Dev Coffee plugins, marketplace, and development workflows.

## Directory Structure

```
scripts/
├── plugin/                    # Plugin installation and management
├── marketplace/               # Marketplace setup and configuration
├── utils/                     # Manual registration and debugging utilities
├── doctor.sh                  # Health check and diagnostics
├── validate-plugins.js        # Plugin metadata validation (Node.js)
├── generate-readme-plugins.js # README section generation (Node.js)
└── README.md                  # This file
```

## Health Check

### `doctor.sh`

Comprehensive health check for the devcoffee plugin and all its dependencies.

**Usage:**
```bash
./scripts/doctor.sh
```

**What it checks:**

1. **Claude CLI** - Verifies installation and version
2. **Required Plugins** - Checks if feature-dev and code-simplifier are installed (needed by maximus)
3. **Optional Dependencies** - Checks for ffmpeg (video-analysis) and jq (utility scripts)
4. **Plugin Status** - Validates plugin structure and installation
5. **Configuration Health** - Verifies settings.json and installed_plugins.json

**Exit codes:**
- `0` - All checks passed (ready to use)
- `1` - Critical issues found (requires fixes)
- `2` - Warnings only (functional but incomplete)

**Example output:**
```
🏥 Dev Coffee Plugin Health Check
=====================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Claude CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Claude CLI installed: 2.1.34

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. Required Plugins (for maximus)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ feature-dev plugin installed (version: 0.1.0)
✓ code-simplifier plugin installed (version: 0.1.0)
```

**Use when:**
- Initial setup (verify all dependencies)
- Troubleshooting plugin issues
- Before running maximus (ensure required plugins installed)
- Verifying video-analysis setup (ffmpeg check)
- CI/CD health checks

---

## README Automation (Node.js)

Metadata-driven README generation where `plugin.json` files are the single source of truth.

### `validate-plugins.js`

Validates all plugins in the marketplace against metadata requirements.

**Usage:**
```bash
npm run readme:validate

# Or directly:
node scripts/validate-plugins.js
```

**What it checks:**
- **Required fields:** name, version, description, tagline
- **Format validation:**
  - Name must be kebab-case (lowercase, hyphens only)
  - Version must be semantic versioning (X.Y.Z)
  - Description minimum 20 characters
  - Tagline maximum 80 characters
- **Recommended fields:** category, components, dependencies, installation, usage
- **Structure validation:** Components and dependencies must be valid arrays/objects

**Exit codes:**
- `0` - All valid (may have warnings)
- `1` - Validation errors found (must fix)

**Example output:**
```
✅ All plugins valid! (4 plugins checked)

# Or with errors:
✗ Missing required field: tagline
✗ Invalid version format: "1.0" (must be semantic version: X.Y.Z)
⚠ Missing recommended field: category
```

**Use when:**
- Before committing plugin changes
- After adding new plugins
- CI/CD validation checks
- Verifying metadata completeness

---

### `generate-readme-plugins.js`

Generates the "Available Plugins" section for README.md from metadata.

**Usage:**
```bash
npm run readme:generate

# Or directly:
node scripts/generate-readme-plugins.js
```

**What it does:**
1. Reads `.claude-plugin/marketplace.json`
2. For each plugin, loads `plugin.json` with extended metadata
3. Generates formatted markdown sections with:
   - Plugin description
   - Components (agents, commands, skills, hooks)
   - Installation instructions (including dependencies and setup)
   - When to use
   - Usage examples
4. Writes to `.readme-plugins-section.md` for manual review

**Output format:**
```markdown
## Available Plugins

### `plugin-name`
Description here

**Components:**
- **Agents:** `agent1`, `agent2`
- **Commands:** `/plugin:command`

**Installation:**
```bash
/plugin install plugin-name@marketplace
# Dependencies and setup commands...
```

**When to use:** Description

**Examples:**
```bash
/plugin:command example
```
```

**After running:**
1. Review `.readme-plugins-section.md`
2. Manually copy into README.md between HTML markers
3. Commit changes

**Use when:**
- Adding new plugins
- Updating plugin metadata
- Ensuring README consistency
- Generating documentation

---

### Combined Check

Run both validation and generation in sequence:

```bash
npm run readme:check
```

This runs `npm run readme:validate && npm run readme:generate`.

---

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

**Health check (run first):**
```bash
./scripts/doctor.sh
# Comprehensive diagnostics and dependency check
```

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
./scripts/doctor.sh           # Check all dependencies and config
./scripts/plugin/diagnose.sh  # Deep dive into plugin discovery issues
```

### Dependencies

**Required:**
- `bash` - Shell interpreter
- `claude` - Claude Code CLI

**Recommended:**
- `jq` - JSON processor (required by most scripts)
  - Install: `sudo apt-get install jq` or `brew install jq`

**Optional:**
- `ffmpeg` - Video processing (for video-analysis skill)
- `tree` - Directory visualization (diagnostic scripts fall back to `find`)

**Check all dependencies:**
```bash
./scripts/doctor.sh  # Shows what's installed and what's missing
```

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

1. Run health check: `./scripts/doctor.sh`
2. Run diagnostics: `./scripts/plugin/diagnose.sh`
3. Verify plugin is in `installed_plugins.json`
4. Verify plugin is enabled in `settings.json`
5. Ensure Claude Code was completely restarted
6. Try reinstall: `./scripts/plugin/reinstall.sh`

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
