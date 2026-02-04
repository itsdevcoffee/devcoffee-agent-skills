# Research Summary: Claude Code Marketplace vs Local Plugins

**Date**: 2026-02-04
**Research Question**: How do marketplace plugins work vs local plugins, and why do local plugins seem broken?
**Status**: ✅ Complete - Root cause identified

## Executive Summary

**The answer everyone missed**: Local plugins don't "register permanently" - they require a marketplace structure. The `--plugin-dir` flag is ONLY for temporary testing, not permanent registration. This changed in version 2.1.x and broke everyone's local development workflow.

### Key Discoveries

1. ✅ **Marketplace plugins work because they ARE in a marketplace** - not because of some special registration
2. ✅ **Local plugins must be wrapped in a marketplace structure** to persist
3. ✅ **--plugin-dir is temporary testing only** - it does NOT persist and does NOT work with VSCode
4. ✅ **There is NO ~/.claude/plugins/development/ directory** for auto-loading local plugins
5. ✅ **Version 2.1.x broke direct plugin installation** - confirmed in GitHub Issue #17089

## How Successful Marketplace Plugins Actually Work

### Example 1: anthropics/claude-plugins-official

**Repository Structure:**
```
claude-plugins-official/
├── .claude-plugin/
│   └── marketplace.json          # Lists all plugins
├── plugins/                      # Internal plugins
│   ├── typescript-lsp/
│   ├── pyright-lsp/
│   └── gopls-lsp/
└── external_plugins/             # External references
```

**Key Insight**: The repository IS the marketplace. The `.claude-plugin/marketplace.json` file defines all plugins.

**Installation:**
```bash
# Claude knows this is a marketplace because of .claude-plugin/marketplace.json
/plugin marketplace add anthropics/claude-plugins-official
/plugin install typescript-lsp@claude-plugins-official
```

### Example 2: thedotmack/claude-mem

**Repository Structure:**
```
claude-mem/
├── .claude-plugin/
│   └── plugin.json (likely - 404 when checking)
├── plugin/                       # Built output
├── src/                          # Source code
└── package.json
```

**Installation:**
```bash
# GitHub repo is treated as marketplace
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Key Insight**: Single-plugin repositories can act as marketplaces if they have the correct structure.

## The Breaking Change: Version 2.1.x

### GitHub Issue #17089: "Local plugins no longer persist"

**What Changed:**
- **Version 2.0.75**: Could install local plugins directly with `/plugin install /path/to/plugin`
- **Version 2.1.3**: Same command creates entries but plugin doesn't load

**Symptoms:**
- Plugin appears in `~/.claude/plugins/installed_plugins.json`
- Plugin marked as enabled in `~/.claude/settings.json`
- Plugin files exist in cache
- **Commands don't work - plugin not loaded**

**Official Workaround:**
> "Create a marketplace wrapper by structuring the plugin inside a marketplace with marketplace.json"

This is the answer everyone was looking for!

## The Marketplace-First Architecture

### Required Structure

```
your-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # MUST be in this directory
└── plugins/                      # Or any other name
    └── your-plugin/
        ├── .claude-plugin/
        │   └── plugin.json
        ├── commands/
        ├── skills/
        └── hooks/
```

### Minimal marketplace.json

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
      "description": "My plugin"
    }
  ]
}
```

### Registration and Installation

```bash
# Register marketplace (one time)
/plugin marketplace add ~/path/to/your-marketplace
# or
/plugin marketplace add username/repo

# Install plugin from marketplace
/plugin install my-plugin@my-marketplace

# Plugin now persists across sessions
```

## Why --plugin-dir Exists (And Why It's Not Enough)

### Purpose: Rapid Testing Only

```bash
claude --plugin-dir ./my-plugin
```

**What it does:**
- Loads plugin for current session only
- Good for quick iteration during development
- No installation, no persistence

**What it doesn't do:**
- ❌ Does NOT persist across sessions
- ❌ Does NOT work with VSCode extension
- ❌ Does NOT provide version management
- ❌ Does NOT appear in marketplace listings

### Official Documentation Quote:

> "The `--plugin-dir` flag is useful for development and testing. When you're ready to share your plugin with others, see Create and distribute a plugin marketplace."

The key phrase: "**when you're ready to share**" - implying it's not even for your own persistent use!

## The Correct Local Development Workflow

### One-Time Setup: Create Development Marketplace

```bash
# Create structure
mkdir -p ~/dev/my-claude-plugins/.claude-plugin
mkdir -p ~/dev/my-claude-plugins/plugins

# Create marketplace.json
cat > ~/dev/my-claude-plugins/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "local-dev",
  "owner": {
    "name": "Developer"
  },
  "plugins": []
}
EOF

# Register with Claude Code
/plugin marketplace add ~/dev/my-claude-plugins
```

### Per-Plugin: Add to Marketplace

```bash
# Create plugin
mkdir -p ~/dev/my-claude-plugins/plugins/test-plugin/.claude-plugin
mkdir -p ~/dev/my-claude-plugins/plugins/test-plugin/commands

# Create plugin.json
cat > ~/dev/my-claude-plugins/plugins/test-plugin/.claude-plugin/plugin.json << 'EOF'
{
  "name": "test-plugin",
  "description": "Testing",
  "version": "1.0.0"
}
EOF

# Add to marketplace.json
jq '.plugins += [{
  "name": "test-plugin",
  "source": "./plugins/test-plugin",
  "description": "Testing"
}]' ~/dev/my-claude-plugins/.claude-plugin/marketplace.json > /tmp/mp.json
mv /tmp/mp.json ~/dev/my-claude-plugins/.claude-plugin/marketplace.json

# Install
/plugin marketplace update local-dev
/plugin install test-plugin@local-dev
```

### Development Cycle

```bash
# 1. Make changes
vim ~/dev/my-claude-plugins/plugins/test-plugin/commands/test.md

# 2. Update version
jq '.version = "1.0.1"' \
  ~/dev/my-claude-plugins/plugins/test-plugin/.claude-plugin/plugin.json > /tmp/p.json
mv /tmp/p.json ~/dev/my-claude-plugins/plugins/test-plugin/.claude-plugin/plugin.json

# 3. Reinstall
/plugin marketplace update local-dev
/plugin uninstall test-plugin@local-dev
/plugin install test-plugin@local-dev
```

## Using "strict": false for Simpler Development

For simple plugins, you can skip the plugin.json entirely:

```json
{
  "name": "local-dev",
  "owner": {
    "name": "Developer"
  },
  "plugins": [
    {
      "name": "quick-test",
      "description": "Quick testing",
      "version": "1.0.0",
      "source": "./plugins/quick-test",
      "strict": false,
      "commands": ["./commands/"]
    }
  ]
}
```

Then just create:
```
plugins/quick-test/
└── commands/
    └── test.md
```

No `.claude-plugin/plugin.json` needed!

## Comparison: What Works vs What Doesn't

| Method | Persists | VSCode | Auto-Update | Marketplace Listing | Use For |
|--------|----------|--------|-------------|---------------------|---------|
| **Marketplace + Install** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | Production, Persistent Dev |
| **--plugin-dir** | ❌ No | ❌ No | ❌ No | ❌ No | Quick Tests Only |
| **Direct install path** | ❌ No (2.1.x) | ❌ No | ❌ No | ❌ No | Broken - Don't Use |

## Your Repository: Needs Minor Fixes

### Current Structure:

```
devcoffee-agent-skills/
├── marketplace.json              # ❌ Wrong location
└── devcoffee/
    ├── .claude-plugin/
    │   └── plugin.json          # ✅ Correct
    ├── commands/
    └── skills/
```

### Required Changes:

1. **Move marketplace.json:**
   ```bash
   mkdir -p .claude-plugin
   mv marketplace.json .claude-plugin/marketplace.json
   ```

2. **Fix marketplace.json schema:**
   - Change `"path": "devcoffee"` to `"source": "./devcoffee"`
   - Replace `"author"` at root with `"owner"`
   - See: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/context/2026-02-04-plugin-structure-fix-needed.md`

3. **Test:**
   ```bash
   claude plugin validate .
   /plugin marketplace add ~/dev-coffee/repos/devcoffee-agent-skills
   /plugin install devcoffee@devcoffee-agent-skills
   ```

## Why Your Frustration Was Valid

The frustration is 100% justified because:

1. **No clear documentation** stating `--plugin-dir` is temporary only
2. **Breaking change in v2.1.x** wasn't communicated
3. **Confusing terminology** around "local plugins" vs "local development"
4. **Multiple installation methods** that seem like they should work
5. **VSCode extension** doesn't support `--plugin-dir` at all
6. **No development mode** - must use full marketplace structure even for local testing

### What Should Exist (But Doesn't):

A `~/.claude/plugins/development/` directory where:
- Plugins auto-load without marketplace structure
- Changes are picked up on restart
- No installation ceremony required
- Works with VSCode extension

### What Actually Exists:

A marketplace-first architecture where:
- Everything must be in a marketplace to persist
- Must install/uninstall to see changes
- --plugin-dir is for disposable testing only
- No shortcuts for local development

## Related GitHub Issues

- **#17089**: Local plugins no longer persist after 2.1.x (CONFIRMED ROOT CAUSE)
- **#20390**: Local scope installation bug with multiple projects
- **#14410**: Local plugin hooks match but never execute
- **#12457**: Plugin install succeeds but fails to persist
- **#14929**: Commands from directory-based marketplaces not discovered

## Documentation Quality Issues

The official documentation does explain this, but:

1. **Buried information**: Marketplace requirement not stated upfront
2. **Misleading examples**: Show `--plugin-dir` prominently without clear "temporary only" warning
3. **No migration guide**: For users hit by 2.1.x breaking change
4. **No "local dev" workflow**: Documented workflow for persistent local development
5. **Terminology confusion**: "Local plugin" used for both marketplace-based and --plugin-dir

## Recommendations

### For Your Project:

1. Fix marketplace.json location and schema (see fix document)
2. Document installation clearly for users
3. Consider creating development scripts for easier testing

### For Claude Code Team (Wishlist):

1. Add `~/.claude/plugins/development/` auto-load directory
2. Better error messages when plugins don't load
3. Migration guide for v2.1.x breaking change
4. Clear warnings about --plugin-dir being temporary
5. VSCode extension support for development workflows

## Files Created

1. **Complete Research**: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/research/2026-02-04-marketplace-vs-local-plugins-research.md`
   - Full documentation of findings
   - Examples from successful plugins
   - Complete comparison of methods

2. **Quick Reference**: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/context/LOCAL-PLUGIN-DEVELOPMENT-WORKFLOW.md`
   - Copy-paste commands for setup
   - Development workflow steps
   - Troubleshooting guide

3. **Fix Needed**: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/context/2026-02-04-plugin-structure-fix-needed.md`
   - Specific fixes for your repository
   - Before/after comparison
   - Testing steps

## Sources

- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [Create and distribute a plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
- [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)
- [GitHub Issue #17089](https://github.com/anthropics/claude-code/issues/17089)
- [GitHub: anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [GitHub: thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [Creating Local Claude Code Plugins - Somethinghitme](https://somethinghitme.com/2026/01/31/creating-local-claude-code-plugins/)

---

**Bottom Line**: There is no "local plugin registration" - only marketplace registration. Everything is a marketplace, even if it's just for your local development. The `--plugin-dir` flag is a red herring for persistent use.
