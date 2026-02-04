# Marketplace vs Local Plugin Development: Research Findings

**Date**: 2026-02-04
**Status**: Complete
**Purpose**: Understand the fundamental difference between marketplace plugins and local plugin development, and why local plugins seem "broken"

## Executive Summary

**The Critical Discovery**: Local plugins are NOT broken - they require a **marketplace wrapper structure** to persist. The `--plugin-dir` flag is ONLY for temporary testing during development, not for permanent registration.

### Key Findings

1. **Marketplace plugins work because they ARE in a marketplace structure**
2. **Local development requires creating a marketplace wrapper**
3. **The `--plugin-dir` flag is temporary testing only**
4. **There is NO way to "permanently register" a standalone plugin without a marketplace**
5. **Issue #17089 confirms this changed in v2.1.x** - previously worked, now requires marketplace

## The Real Answer: Two Completely Different Approaches

### Marketplace Plugins (What Everyone Uses Successfully)

```
my-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace catalog
└── plugins/
    └── my-plugin/
        ├── .claude-plugin/
        │   └── plugin.json       # Plugin manifest
        ├── commands/
        ├── skills/
        └── hooks/
```

**Installation Process:**
```bash
/plugin marketplace add ./my-marketplace
# or
/plugin marketplace add owner/repo
# or
/plugin marketplace add https://github.com/owner/repo.git

# Then install from marketplace
/plugin install my-plugin@my-marketplace
```

**Result**: Plugin persists across sessions, auto-updates, appears in marketplace listings.

### Standalone Local Development (Temporary Testing Only)

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── skills/
└── hooks/
```

**Testing Process:**
```bash
claude --plugin-dir ./my-plugin
```

**Result**: Plugin loads ONLY for that session. Does NOT persist. VSCode extension does NOT support this method.

## Successful Marketplace Plugin Examples

### 1. anthropics/claude-plugins-official

**Repository Structure:**
```
claude-plugins-official/
├── .claude-plugin/
│   └── marketplace.json          # Defines all plugins
├── plugins/                      # Internal plugins
│   ├── typescript-lsp/
│   │   └── README.md
│   ├── pyright-lsp/
│   └── gopls-lsp/
└── external_plugins/             # External references
```

**Marketplace Entry Example (from marketplace.json):**
```json
{
  "name": "typescript-lsp",
  "description": "TypeScript/JavaScript language server",
  "version": "1.0.0",
  "source": "./plugins/typescript-lsp",
  "category": "development",
  "strict": false,
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "extensionToLanguage": {
        ".ts": "typescript",
        ".tsx": "typescriptreact"
      }
    }
  }
}
```

**Note**: Many plugins use `"strict": false`, meaning they don't even have a `plugin.json` file - the marketplace entry IS the complete plugin definition.

**Users Install Via:**
```bash
/plugin install typescript-lsp@claude-code-marketplace
```

### 2. thedotmack/claude-mem

**Repository Structure:**
```
claude-mem/
├── .claude-plugin/
│   └── ??? (404 when trying to access)
├── plugin/                       # Built plugin output
├── src/                          # TypeScript source
├── package.json
└── tsconfig.json
```

**Users Install Via:**
```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Key Insight**: This is a GitHub repository that Claude Code treats as a marketplace because it has the correct structure. The repository itself IS the marketplace.

## The Breaking Change: Version 2.1.x

### GitHub Issue #17089: "Local plugins no longer persist after 2.1.x update"

**What Happened:**
- **Version 2.0.75**: Local plugins installed via `/plugin install /path/to/plugin` persisted
- **Version 2.1.3**: Same plugins no longer load, despite entries in `installed_plugins.json`

**Symptoms:**
- Plugin appears in `~/.claude/plugins/installed_plugins.json` with `"isLocal": true`
- Plugin enabled in `~/.claude/settings.json`
- Plugin files exist in `~/.claude/plugins/cache/`
- **But plugin commands don't work** - plugin not loaded

**Official Workaround:**
> "Create a marketplace wrapper by structuring the plugin inside a marketplace with marketplace.json, registering with `claude plugin marketplace add`, then installing from that marketplace."

**CLI-Only Temporary Workaround:**
```bash
claude --plugin-dir /path/to/plugin
```
⚠️ **Does NOT work with VSCode extension**

## How Marketplace Registration Actually Works

### Method 1: GitHub Repository (Recommended)

**Repository acts as marketplace:**
```
your-repo/
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── your-plugin/
        └── .claude-plugin/
            └── plugin.json
```

**User Installation:**
```bash
/plugin marketplace add owner/repo
/plugin install your-plugin@repo
```

**Where It's Installed:**
```
~/.claude/plugins/marketplaces/owner/
```

### Method 2: Local Marketplace Directory

**Local directory structure:**
```
~/my-claude-marketplaces/
└── my-marketplace/
    ├── .claude-plugin/
    │   └── marketplace.json
    └── plugins/
        └── my-plugin/
            └── .claude-plugin/
                └── plugin.json
```

**User Installation:**
```bash
/plugin marketplace add ~/my-claude-marketplaces/my-marketplace
/plugin install my-plugin@my-marketplace
```

### Method 3: Git URL

**Any git repository:**
```bash
/plugin marketplace add https://gitlab.com/company/plugins.git
/plugin install plugin-name@plugins
```

## The marketplace.json File

### Minimal Example:
```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./plugins/my-plugin",
      "description": "My plugin description"
    }
  ]
}
```

### With External GitHub Plugin:
```json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "local-plugin",
      "source": "./plugins/local-plugin",
      "description": "Local plugin in this repo"
    },
    {
      "name": "external-plugin",
      "source": {
        "source": "github",
        "repo": "other-user/plugin-repo"
      },
      "description": "External GitHub plugin"
    }
  ]
}
```

### Using "strict": false (No plugin.json Required):
```json
{
  "name": "simple-marketplace",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "simple-command",
      "description": "A simple command",
      "version": "1.0.0",
      "source": "./plugins/simple-command",
      "strict": false,
      "commands": ["./commands/"]
    }
  ]
}
```

With `"strict": false`, the plugin directory doesn't need a `plugin.json` - the marketplace entry defines everything.

## Why --plugin-dir Exists (And Its Limitations)

### Purpose: Rapid Development Testing

**Use Case:**
```bash
# Make changes to plugin
vim my-plugin/commands/test.md

# Test immediately
claude --plugin-dir ./my-plugin

# Make more changes
vim my-plugin/skills/test/SKILL.md

# Test again
claude --plugin-dir ./my-plugin
```

### Limitations:

1. **Does NOT persist** - plugin only loaded for that session
2. **Does NOT work with VSCode extension** - VSCode doesn't support this flag
3. **Does NOT auto-update** - no version management
4. **Does NOT appear in marketplace listings** - no discoverability
5. **Must restart Claude Code** to pick up changes

### Official Documentation Quote:
> "The `--plugin-dir` flag is useful for development and testing. When you're ready to share your plugin with others, see Create and distribute a plugin marketplace."

## The Correct Local Development Workflow

### Step 1: Create Marketplace Structure (One Time)

```bash
mkdir -p ~/dev/my-plugins/.claude-plugin
mkdir -p ~/dev/my-plugins/plugins

# Create marketplace.json
cat > ~/dev/my-plugins/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "local-dev",
  "owner": {
    "name": "Developer"
  },
  "plugins": []
}
EOF

# Register marketplace
/plugin marketplace add ~/dev/my-plugins
```

### Step 2: Add Plugin to Marketplace

```bash
# Create plugin directory
mkdir -p ~/dev/my-plugins/plugins/my-plugin/.claude-plugin
mkdir -p ~/dev/my-plugins/plugins/my-plugin/commands

# Create plugin.json
cat > ~/dev/my-plugins/plugins/my-plugin/.claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "description": "My test plugin",
  "version": "1.0.0"
}
EOF

# Add to marketplace.json
jq '.plugins += [{
  "name": "my-plugin",
  "source": "./plugins/my-plugin",
  "description": "My test plugin"
}]' ~/dev/my-plugins/.claude-plugin/marketplace.json > tmp.json
mv tmp.json ~/dev/my-plugins/.claude-plugin/marketplace.json
```

### Step 3: Install from Marketplace

```bash
/plugin marketplace update local-dev
/plugin install my-plugin@local-dev
```

### Step 4: Update and Reinstall

```bash
# Make changes to plugin
vim ~/dev/my-plugins/plugins/my-plugin/commands/test.md

# Update version in plugin.json
jq '.version = "1.0.1"' \
  ~/dev/my-plugins/plugins/my-plugin/.claude-plugin/plugin.json > tmp.json
mv tmp.json ~/dev/my-plugins/plugins/my-plugin/.claude-plugin/plugin.json

# Update marketplace and reinstall
/plugin marketplace update local-dev
/plugin uninstall my-plugin@local-dev
/plugin install my-plugin@local-dev
```

## ~/.claude/plugins/ Directory Structure

### What Gets Created:

```
~/.claude/plugins/
├── cache/                        # Actual plugin files
│   └── [hash]/
│       └── [plugin-files]
├── marketplaces/                 # Marketplace repositories
│   ├── anthropics/
│   │   └── claude-plugins-official/
│   └── thedotmack/
│       └── claude-mem/
└── installed_plugins.json       # Plugin registry
```

### installed_plugins.json Format:

```json
{
  "my-plugin@local-dev": {
    "isLocal": true,
    "version": "1.0.0",
    "installedAt": "2026-02-04T...",
    "marketplace": "local-dev",
    "cachePath": "~/.claude/plugins/cache/abc123/"
  }
}
```

## Comparison: What Works vs What Doesn't

| Approach | Persists | VSCode | Auto-Update | Marketplace Listing | Best For |
|----------|----------|--------|-------------|---------------------|----------|
| **Marketplace + Install** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | Production, Sharing |
| **--plugin-dir** | ❌ No | ❌ No | ❌ No | ❌ No | Quick Testing Only |
| **Direct /plugin install path** | ❌ No (broken in 2.1.x) | ❌ No | ❌ No | ❌ No | Don't Use |

## Related GitHub Issues

### Issue #17089: Local plugins no longer persist
- **Status**: Confirmed behavior change in v2.1.x
- **Workaround**: Use marketplace structure
- **Related**: #14410, #12457, #14929

### Issue #20390: Local scope installation bug
- **Problem**: Can't install same plugin in multiple projects with local scope
- **Impact**: Local development workflow issues

### Issue #664: GitHub Action local plugin support
- **Problem**: Marketplaces and plugins must be in separate repos for GitHub Actions
- **Impact**: Monorepo structures don't work in CI/CD

## Official Documentation References

### Creating Plugins
- URL: https://code.claude.com/docs/en/plugins
- Key Quote: "Use --plugin-dir for development and testing"
- Clear Guidance: Convert to marketplace for sharing

### Plugin Marketplaces
- URL: https://code.claude.com/docs/en/plugin-marketplaces
- Complete Guide: Creating, hosting, distributing marketplaces
- Examples: Local, GitHub, GitLab, private repos

### Discovery and Installation
- URL: https://code.claude.com/docs/en/discover-plugins
- User Perspective: How to add marketplaces and install plugins

## Recommendations for Plugin Developers

### For Active Development:

1. **Create a local marketplace** for your development plugins
2. **Use marketplace + install workflow** for persistent testing
3. **Use --plugin-dir** only for rapid iteration before installing
4. **Version your plugins** properly for update tracking

### For Distribution:

1. **Create GitHub repository** as marketplace
2. **Use relative paths** for plugins in same repo
3. **Use GitHub sources** for external dependencies
4. **Document installation** clearly for users

### For Teams:

1. **Private GitHub repository** for team marketplace
2. **Configure extraKnownMarketplaces** in `.claude/settings.json`
3. **Use strictKnownMarketplaces** in managed settings for security
4. **Version control** marketplace.json changes

## Conclusion: The User Was Right to Be Frustrated

The frustration is valid because:

1. **No clear documentation** that `--plugin-dir` is temporary only
2. **Breaking change in v2.1.x** wasn't well communicated
3. **GitHub issues reference "local plugins"** without clarifying marketplace requirement
4. **Multiple confusing installation methods** that seem like they should work but don't
5. **VSCode extension** doesn't support `--plugin-dir`, making testing harder

### The Real Problem:

There is no "local plugin development mode" that persists. You must:
- Either create a marketplace structure (even for local dev)
- Or use `--plugin-dir` and restart constantly

### What Should Exist (But Doesn't):

A `~/.claude/plugins/development/` directory where plugins auto-load persistently without marketplace structure.

### What Actually Exists:

A marketplace-first architecture where everything must be in a marketplace to persist.

## Sources

- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [Create and distribute a plugin marketplace - Claude Code Docs](https://code.claude.com/docs/en/plugin-marketplaces)
- [GitHub Issue #17089: Local plugins no longer persist](https://github.com/anthropics/claude-code/issues/17089)
- [GitHub: anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [GitHub: thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [Creating Local Claude Code Plugins - Somethinghitme](https://somethinghitme.com/2026/01/31/creating-local-claude-code-plugins/)
- [Discover and install plugins - Claude Code Docs](https://code.claude.com/docs/en/discover-plugins)

---

**Last Updated**: 2026-02-04
**Research Duration**: Comprehensive web search + documentation analysis
**Key Discovery**: Marketplace structure is mandatory for plugin persistence
