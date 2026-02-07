# Plugin Development Guide

This guide covers the complete workflow for adding new plugins to the Dev Coffee marketplace with automated README generation.

## Overview

The Dev Coffee plugin system uses metadata-driven documentation generation where `plugin.json` files are the single source of truth. When you add a new plugin, you write complete metadata once and the README sections are automatically generated.

**What this guide covers:**
- Creating new plugins from scratch
- Adding complete metadata to plugin.json
- Running validation and generation scripts
- Testing plugins locally
- Submitting plugins for inclusion

## Prerequisites

- **Node.js 14+** - Check with `node --version`
- **jq** - JSON processor for shell scripts
- **Claude CLI** - For testing plugins locally

## Creating a New Plugin

### Step-by-Step Workflow

#### 1. Create Plugin Directory Structure

```bash
# From repo root
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/agents
mkdir -p my-plugin/commands
mkdir -p my-plugin/skills
mkdir -p my-plugin/hooks
```

#### 2. Create plugin.json with Complete Metadata

Create `my-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Detailed description of what your plugin does (minimum 20 characters)",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/yourusername"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "license": "MIT",
  "tagline": "Short one-liner description (max 80 chars)",
  "category": "development",
  "components": {
    "agents": ["agent-name"],
    "commands": ["command-name"],
    "skills": ["skill-name"],
    "hooks": []
  },
  "dependencies": {
    "plugins": [],
    "external": []
  },
  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": []
  },
  "usage": {
    "when": "When to use this plugin",
    "examples": ["/my-plugin:command-name"]
  }
}
```

**Field reference:**
- **name** (required): Plugin name in kebab-case (lowercase, hyphens only)
- **version** (required): Semantic version (X.Y.Z format)
- **description** (required): Detailed description (minimum 20 characters)
- **tagline** (required): Short one-liner (maximum 80 characters)
- **category** (recommended): One of: `media`, `code-quality`, `automation`, `development`, `standalone`
- **components** (recommended): Lists of agents, commands, skills, and hooks
- **dependencies** (recommended):
  - `plugins`: Claude plugins required (format: `name@marketplace`)
  - `external`: External tools required (e.g., `ffmpeg`, `docker`)
- **installation** (recommended):
  - `marketplace`: Marketplace name (usually `devcoffee-marketplace`)
  - `setup`: Array of shell commands or instructions for additional setup
- **usage** (recommended):
  - `when`: Description of when to use this plugin
  - `examples`: Array of usage examples

#### 3. Add Plugin Components

Create your agents, commands, skills, or hooks in the appropriate directories:

**Example agent** (`agents/my-agent.md`):
```markdown
---
name: my-agent
description: Agent description
tools: [Bash, Read, Write, Grep, Glob]
trigger: When user asks to do something specific
color: blue
---

System prompt for your agent...
```

**Example command** (`commands/my-command.md`):
```markdown
---
name: my-command
description: Command description
args:
  - name: argument
    description: Argument description
    required: true
---

Instructions for executing this command...
```

#### 4. Add to marketplace.json

Add an entry to `.claude-plugin/marketplace.json`:

```json
{
  "name": "my-plugin",
  "source": "./my-plugin",
  "description": "Description from plugin.json",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/yourusername"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["keyword1", "keyword2"],
  "category": "Development Tools",
  "license": "MIT"
}
```

#### 5. Create Plugin README (Optional)

Copy and customize the template:

```bash
cp docs/templates/PLUGIN-README-TEMPLATE.md my-plugin/README.md
```

Edit with your plugin's specific details.

#### 6. Validate Plugin Metadata

Run validation to check for errors:

```bash
npm run readme:validate
```

**Expected output:**
```
✅ All plugins valid! (N plugins checked)
```

**If you see errors:**
- ✗ Red errors = Required fields missing or invalid format (must fix)
- ⚠ Yellow warnings = Recommended fields missing (should fix)

Fix any errors and re-run validation.

#### 7. Generate README Section

Generate the plugin section:

```bash
npm run readme:generate
```

This creates `.readme-plugins-section.md` with all plugin sections.

#### 8. Review Generated Output

```bash
cat .readme-plugins-section.md
```

Check that your plugin section looks correct:
- Description is accurate
- Components are listed correctly
- Installation instructions are complete
- Usage examples are helpful

#### 9. Manually Merge into README

Copy your plugin's section from `.readme-plugins-section.md` and paste it into `README.md` between the HTML markers:

```markdown
<!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->

## Available Plugins

### `my-plugin`
[Your generated content here]

---

<!-- END AUTO-GENERATED PLUGIN SECTIONS -->
```

#### 10. Test Locally

Test your plugin before committing:

```bash
# Using local testing script
./scripts/plugin/test-local.sh my-plugin

# Or install locally
./scripts/plugin/install.sh my-plugin
```

#### 11. Commit Changes

```bash
git add my-plugin/
git add .claude-plugin/marketplace.json
git add README.md
git commit -m "feat: add my-plugin for [purpose]"
```

## Metadata Requirements

### Required Fields (Validation Errors)

- **name**: Must be kebab-case (lowercase letters, numbers, hyphens only)
- **version**: Must be semantic version (X.Y.Z)
- **description**: Minimum 20 characters
- **tagline**: Maximum 80 characters

### Recommended Fields (Validation Warnings)

- **category**: Should be one of the valid categories
- **components**: Should list all agents, commands, skills, hooks
- **dependencies**: Should list plugin and external dependencies
- **installation**: Should include marketplace and setup steps
- **usage**: Should describe when to use and provide examples

## Validation Workflow

### Running Validation

```bash
# Validate only
npm run readme:validate

# Validate and generate (combined)
npm run readme:check
```

### Understanding Validation Output

**Success:**
```
✅ All plugins valid! (4 plugins checked)
```

**Errors (exit code 1):**
```
✗ Missing required field: tagline
✗ Invalid version format: "1.0" (must be semantic version: X.Y.Z)
```

**Warnings (exit code 0):**
```
⚠ Missing recommended field: category
⚠ Description too short: 15 chars (recommended: 20+)
```

### Fixing Common Errors

**"Invalid name format"**
- Use kebab-case: `my-plugin` not `MyPlugin` or `my_plugin`

**"Invalid version format"**
- Use semantic versioning: `1.0.0` not `1.0` or `v1.0.0`

**"Missing required field"**
- Add the field to plugin.json (name, version, description, tagline)

**"Description too short"**
- Expand description to at least 20 characters

## Troubleshooting

### Plugin Not Showing in Generated Output

**Check:**
1. Plugin is listed in `.claude-plugin/marketplace.json`
2. `source` path is correct (usually `./plugin-name`)
3. `plugin.json` exists at `plugin-name/.claude-plugin/plugin.json`
4. No JSON syntax errors in plugin.json

### Validation Fails

**Check:**
1. JSON syntax is valid (use `jq . plugin.json` to validate)
2. All required fields are present
3. Name uses kebab-case
4. Version uses X.Y.Z format

### Generation Script Errors

**Check:**
1. Marketplace.json is valid JSON
2. All plugin.json files are valid JSON
3. File paths are correct relative to repo root

### FFmpeg or External Dependencies

For external dependencies like FFmpeg:

```json
{
  "dependencies": {
    "external": ["ffmpeg"]
  },
  "installation": {
    "setup": [
      "# Mac",
      "brew install ffmpeg",
      "# Debian/Ubuntu",
      "sudo apt install ffmpeg",
      "# Fedora/RHEL",
      "sudo dnf install ffmpeg"
    ]
  }
}
```

### Plugin Dependencies

For Claude plugin dependencies:

```json
{
  "dependencies": {
    "plugins": [
      "feature-dev@claude-plugins-official",
      "code-simplifier@claude-plugins-official"
    ]
  }
}
```

These will show as comments in the installation section.

## Best Practices

### Metadata

- **Be specific**: Clear, actionable descriptions
- **Be concise**: Taglines should be under 60 characters when possible
- **Be complete**: Include all recommended fields
- **Be accurate**: List all components and dependencies

### README Generation

- **Review before merging**: Always check `.readme-plugins-section.md` before copying to README
- **Don't edit README directly**: Edit plugin.json instead, then regenerate
- **Test locally**: Use local testing scripts before committing

### Version Management

- Follow semantic versioning strictly
- Update version in both plugin.json and marketplace.json when releasing
- Document breaking changes in CHANGELOG.md

## Quick Reference

### NPM Scripts

```bash
npm run readme:validate   # Check all plugins for errors
npm run readme:generate   # Generate plugin sections
npm run readme:check      # Validate then generate
```

### Local Testing

```bash
./scripts/plugin/test-local.sh <plugin-name>   # Test without installing
./scripts/plugin/install.sh <plugin-name>       # Install locally
./scripts/plugin/diagnose.sh                     # Diagnose plugin issues
```

### File Locations

- Plugin metadata: `<plugin>/.claude-plugin/plugin.json`
- Marketplace: `.claude-plugin/marketplace.json`
- Schema: `docs/schemas/plugin-metadata-schema.json`
- Template: `docs/templates/PLUGIN-README-TEMPLATE.md`
- Generated output: `.readme-plugins-section.md`

## Contributing

For general contribution guidelines, see [CONTRIBUTING.md](../../CONTRIBUTING.md).

For plugin-specific questions:
- Check existing plugins for examples
- Review the schema: `docs/schemas/plugin-metadata-schema.json`
- Run validation frequently during development

## Resources

- **Plugin Structure**: See existing plugins (devcoffee, video-analysis, remotion-max, tldr)
- **Metadata Schema**: `docs/schemas/plugin-metadata-schema.json`
- **README Template**: `docs/templates/PLUGIN-README-TEMPLATE.md`
- **Main README**: Root README.md for examples
