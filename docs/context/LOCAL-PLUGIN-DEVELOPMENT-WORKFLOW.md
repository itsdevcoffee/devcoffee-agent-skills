# Local Plugin Development: Correct Workflow

**Quick Reference for Plugin Developers**

## The Truth About Local Plugins

❌ **What Doesn't Work:**
- `--plugin-dir` for persistence (temporary testing only)
- Direct `/plugin install /path/to/plugin` (broken in v2.1.x)
- Expecting plugins to "just register" and stay

✅ **What Actually Works:**
- Create a local marketplace structure
- Register the marketplace once
- Install plugins from your marketplace

## Quick Setup (5 Minutes)

### 1. Create Local Marketplace (One Time)

```bash
# Create marketplace structure
mkdir -p ~/dev/my-claude-plugins/.claude-plugin
mkdir -p ~/dev/my-claude-plugins/plugins

# Create marketplace.json
cat > ~/dev/my-claude-plugins/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "local-dev",
  "owner": {
    "name": "Your Name"
  },
  "plugins": []
}
EOF

# Register with Claude Code
claude
> /plugin marketplace add ~/dev/my-claude-plugins
```

### 2. Add Your First Plugin

```bash
# Create plugin directory
PLUGIN_NAME="my-plugin"
mkdir -p ~/dev/my-claude-plugins/plugins/$PLUGIN_NAME/.claude-plugin
mkdir -p ~/dev/my-claude-plugins/plugins/$PLUGIN_NAME/commands

# Create plugin.json
cat > ~/dev/my-claude-plugins/plugins/$PLUGIN_NAME/.claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "description": "My development plugin",
  "version": "1.0.0"
}
EOF

# Add plugin entry to marketplace
jq --arg name "$PLUGIN_NAME" '.plugins += [{
  "name": $name,
  "source": ("./plugins/" + $name),
  "description": "My development plugin"
}]' ~/dev/my-claude-plugins/.claude-plugin/marketplace.json > /tmp/marketplace.json
mv /tmp/marketplace.json ~/dev/my-claude-plugins/.claude-plugin/marketplace.json
```

### 3. Install Plugin

```bash
claude
> /plugin marketplace update local-dev
> /plugin install my-plugin@local-dev
> /my-plugin:test  # Test your command
```

## Development Workflow

### Option A: Full Install/Uninstall Cycle (Recommended)

```bash
# 1. Make changes to plugin files
vim ~/dev/my-claude-plugins/plugins/my-plugin/commands/test.md

# 2. Update version in plugin.json
jq '.version = "1.0.1"' \
  ~/dev/my-claude-plugins/plugins/my-plugin/.claude-plugin/plugin.json > /tmp/plugin.json
mv /tmp/plugin.json ~/dev/my-claude-plugins/plugins/my-plugin/.claude-plugin/plugin.json

# 3. Reinstall
claude
> /plugin marketplace update local-dev
> /plugin uninstall my-plugin@local-dev
> /plugin install my-plugin@local-dev
> /my-plugin:test
```

### Option B: Rapid Testing with --plugin-dir

```bash
# Quick iteration without marketplace updates
claude --plugin-dir ~/dev/my-claude-plugins/plugins/my-plugin

# Make changes and restart Claude to test
# But remember: This does NOT persist!
```

**When to use each:**
- **Option A**: When you want the plugin to persist and work in VSCode
- **Option B**: When doing rapid iteration on a single command/skill

## Directory Structure Reference

### Your Development Marketplace

```
~/dev/my-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json          # Lists all your dev plugins
├── plugins/
│   ├── plugin-one/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── test.md
│   │   └── skills/
│   │       └── test/
│   │           └── SKILL.md
│   └── plugin-two/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       └── hooks/
│           └── hooks.json
└── README.md
```

### Where Claude Installs It

```
~/.claude/plugins/
├── marketplaces/
│   └── [your-marketplace]/
│       └── [marketplace-files]
└── cache/
    └── [hash]/
        └── [plugin-files]
```

## Using "strict": false (Simplified Development)

For simple plugins, skip the plugin.json entirely:

```json
{
  "name": "local-dev",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "quick-command",
      "description": "A quick command for testing",
      "version": "1.0.0",
      "source": "./plugins/quick-command",
      "strict": false,
      "commands": ["./commands/"]
    }
  ]
}
```

Then just create:
```
plugins/quick-command/
└── commands/
    └── test.md
```

No `.claude-plugin/plugin.json` needed!

## Troubleshooting

### Plugin not loading after install

```bash
# Check if marketplace is added
> /plugin marketplace list

# Update marketplace
> /plugin marketplace update local-dev

# Check if plugin is installed
> /plugin list

# Reinstall if needed
> /plugin uninstall my-plugin@local-dev
> /plugin install my-plugin@local-dev
```

### Commands not appearing

```bash
# Verify plugin directory structure
ls -la ~/dev/my-claude-plugins/plugins/my-plugin/

# Should see:
# .claude-plugin/plugin.json
# commands/ or skills/

# Check plugin.json is valid
jq . ~/dev/my-claude-plugins/plugins/my-plugin/.claude-plugin/plugin.json
```

### VSCode extension not showing plugin

The VSCode extension requires proper marketplace installation. `--plugin-dir` does NOT work with VSCode.

```bash
# Must use marketplace + install
> /plugin install my-plugin@local-dev
```

## Quick Commands Reference

```bash
# List marketplaces
/plugin marketplace list

# Update marketplace (after changes)
/plugin marketplace update local-dev

# List installed plugins
/plugin list

# Install plugin
/plugin install my-plugin@local-dev

# Uninstall plugin
/plugin uninstall my-plugin@local-dev

# Check plugin info
/plugin info my-plugin@local-dev
```

## Moving to Production

When ready to share your plugin:

### 1. Create GitHub Repository

```bash
cd ~/dev/my-claude-plugins
git init
git add .
git commit -m "Initial plugin marketplace"
gh repo create my-claude-plugins --public --source=. --push
```

### 2. Users Install Via GitHub

```bash
# They add your marketplace
> /plugin marketplace add yourusername/my-claude-plugins

# And install plugins
> /plugin install my-plugin@my-claude-plugins
```

## Key Takeaways

1. **Always use marketplace structure** - even for local development
2. **--plugin-dir is temporary** - use for quick tests only
3. **Update → Uninstall → Install** - the reliable update workflow
4. **Version your plugins** - helps track changes
5. **Use "strict": false** - for simple plugins without plugin.json

---

**See Also:**
- [Complete Research: Marketplace vs Local Plugins](../research/2026-02-04-marketplace-vs-local-plugins-research.md)
- [Official Documentation: Create Plugins](https://code.claude.com/docs/en/plugins)
- [Official Documentation: Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
