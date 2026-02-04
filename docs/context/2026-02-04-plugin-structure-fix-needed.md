# Plugin Structure Fix Needed

**Date**: 2026-02-04
**Issue**: Repository has marketplace.json but not in correct location
**Status**: Needs correction

## Current Structure (Incorrect)

```
devcoffee-agent-skills/
├── marketplace.json              # ❌ Should be in .claude-plugin/
├── devcoffee/
│   ├── .claude-plugin/
│   │   └── plugin.json          # ✅ Correct
│   ├── commands/
│   └── skills/
└── docs/
```

## Required Structure (Correct)

```
devcoffee-agent-skills/
├── .claude-plugin/
│   └── marketplace.json          # ✅ Must be here
├── devcoffee/                    # Or plugins/devcoffee/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   └── skills/
└── docs/
```

## Marketplace.json Issues

### Current Content:
```json
{
  "name": "devcoffee-marketplace",
  "displayName": "Dev Coffee Marketplace",
  "plugins": [
    {
      "name": "devcoffee",
      "path": "devcoffee",          // ❌ Should be "source"
      ...
    }
  ]
}
```

### Should Be:
```json
{
  "name": "devcoffee-marketplace",
  "owner": {                          // ✅ Required field
    "name": "Dev Coffee"
  },
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee",        // ✅ Correct field name
      "description": "...",
      "version": "0.1.0"
    }
  ]
}
```

## Required Changes

### 1. Move marketplace.json

```bash
mkdir -p .claude-plugin
mv marketplace.json .claude-plugin/marketplace.json
```

### 2. Fix marketplace.json Schema

**Changes needed:**
- Remove `displayName` (not in schema)
- Remove `description` at root (use `metadata.description` if needed)
- Remove `author` at root (use `owner` instead)
- Remove `repository` at root (can add to plugin entry)
- Change `path` to `source` in plugin entry
- Move `author` from root to plugin entry or owner

### 3. Update Plugin Reference

**Current:**
```json
"path": "devcoffee"
```

**Should be:**
```json
"source": "./devcoffee"
```

## Correct marketplace.json

```json
{
  "name": "devcoffee-marketplace",
  "owner": {
    "name": "Dev Coffee",
    "email": "your-email@example.com"
  },
  "metadata": {
    "description": "Productivity tools and automation workflows for Claude Code focused on code quality and development efficiency"
  },
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee",
      "description": "Automated code review cycles with maximus - runs code-reviewer in a loop until clean, then finishes with code-simplifier",
      "version": "0.1.0",
      "author": {
        "name": "Dev Coffee"
      },
      "repository": "https://github.com/maskkiller/devcoffee-agent-skills",
      "keywords": ["code-quality", "review", "automation", "productivity"],
      "category": "Development Tools",
      "license": "MIT"
    }
  ]
}
```

## Testing After Fix

```bash
# Validate structure
claude plugin validate .

# Or from within Claude
/plugin validate .

# Add marketplace
/plugin marketplace add ~/dev-coffee/repos/devcoffee-agent-skills

# Install plugin
/plugin install devcoffee@devcoffee-marketplace

# Test command
/devcoffee:maximus
```

## Impact on Users

### Before Fix:
- Users trying to install would get errors
- Marketplace wouldn't be recognized
- Plugin discovery would fail

### After Fix:
- Clean installation via GitHub
- Proper marketplace registration
- Plugin appears in listings

## Distribution via GitHub

Once fixed, users can install directly:

```bash
# Add marketplace
/plugin marketplace add maskkiller/devcoffee-agent-skills

# Install plugin
/plugin install devcoffee@devcoffee-agent-skills
```

## References

- [Official Schema](https://anthropic.com/claude-code/marketplace.schema.json)
- [Plugin Marketplaces Docs](https://code.claude.com/docs/en/plugin-marketplaces)
- [Research Document](../research/2026-02-04-marketplace-vs-local-plugins-research.md)
