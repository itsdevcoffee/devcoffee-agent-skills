# README Consistency Research: Multi-Plugin Repository Documentation

**Date:** 2026-02-07
**Research Goal:** Find standardized approaches for maintaining multi-plugin README files with consistency

---

## Executive Summary

After researching 10+ popular multi-plugin/multi-package repositories and documentation tools, the clear pattern is:

1. **Keep root README minimal and high-level** - Don't try to document everything inline
2. **Link to detailed documentation** - Use external sites or dedicated docs folders
3. **Use metadata-driven approaches** - Auto-generate lists from plugin.json or similar
4. **Maintain consistency through templates** - Not through manual duplication

### Recommended Approach for devcoffee-agent-skills

**Hybrid approach:**
- ✅ Keep the current structure (it's actually good!)
- ✅ Add a simple script to auto-generate the "Available Plugins" section from plugin.json files
- ✅ Use consistent templates for the detailed plugin sections
- ✅ Link to individual plugin README files for comprehensive docs

---

## Research Findings

### 1. Popular Repository Patterns

#### Pattern A: External Documentation Site
**Examples:** VueUse, ESLint, Jest, Nuxt Modules

**Approach:**
- Root README is minimal (getting started, quick links)
- Link to external site (vueuse.org, eslint.org, etc.) for full documentation
- Individual package READMEs in subdirectories

**Pros:**
- Keeps README scannable
- Allows advanced features (search, filtering, interactive demos)
- Scales to hundreds of plugins

**Cons:**
- Requires maintaining separate documentation site
- Not suitable for smaller projects

#### Pattern B: Structured Tables
**Examples:** Rollup Plugins

**Approach:**
- Simple markdown tables listing all plugins
- Two columns: Plugin name (linked) + Brief description
- Consistent format for every entry

**Example format:**
```markdown
| Plugin | Description |
|--------|-------------|
| [plugin-name](./plugin-name/) | Brief one-line description |
```

**Pros:**
- Easy to scan
- Consistent presentation
- GitHub renders nicely

**Cons:**
- Still manual maintenance
- Can get long with many plugins

#### Pattern C: Delegated Documentation
**Examples:** Babel, UnJS

**Approach:**
- Root README provides overview and getting started
- Link to `/packages/README.md` or individual package docs
- Focus on architecture and contribution guidelines

**Pros:**
- Separates concerns clearly
- Each plugin owns its documentation
- Reduces root README bloat

**Cons:**
- Users need to navigate to find details
- Can feel fragmented

#### Pattern D: Metadata-Driven
**Examples:** Nuxt Modules

**Approach:**
- Maintain YAML/JSON metadata files for each module
- Auto-generate listings from metadata
- Serve via JSON for programmatic access

**Example structure:**
```yaml
# modules/video-analysis.yml
name: video-analysis
description: AI-powered video analysis
version: 1.0.0
category: media
keywords: [video, analysis, ffmpeg]
```

**Pros:**
- Single source of truth
- Can generate multiple formats (README, JSON API, website)
- Ensures consistency
- Easy to validate

**Cons:**
- Requires build step
- More complex setup

---

### 2. README Generation Tools

#### Option 1: readme-md-generator
**GitHub:** [kefranabg/readme-md-generator](https://www.npmjs.com/package/readme-md-generator)

**Capabilities:**
- CLI-driven interactive README creation
- Reads package.json, git config automatically
- Suggests defaults based on environment
- Generates badges, table of contents, sections

**Best for:** Initial boilerplate generation

#### Option 2: package-json-to-readme
**GitHub:** [zeke/package-json-to-readme](https://github.com/zeke/package-json-to-readme)

**Capabilities:**
- Extracts name, description, scripts, dependencies from package.json
- Generates basic structure automatically
- Minimal configuration

**Best for:** Simple projects with standard structure

#### Option 3: @appnest/readme
**GitHub:** [andreasbm/readme](https://github.com/andreasbm/readme)

**Capabilities:**
- Template-based generation with handlebars
- Auto-generates table of contents
- Supports badges, contributors, license sections
- Can read from multiple sources

**Best for:** Projects needing customization with templates

#### Option 4: Custom Script (Recommended for us)

**Approach:**
- Write simple Node.js/bash script
- Read all `*/.claude-plugin/plugin.json` files
- Extract metadata (name, description, version, keywords)
- Generate consistent sections

**Example implementation:**
```javascript
// scripts/generate-plugin-list.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const plugins = glob.sync('*/.claude-plugin/plugin.json')
  .map(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const dir = path.dirname(path.dirname(file));
    return { ...data, dir };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Generate markdown table
let markdown = '| Plugin | Description | Version |\n';
markdown += '|--------|-------------|----------|\n';

plugins.forEach(p => {
  markdown += `| [\`${p.name}\`](./${p.dir}/) | ${p.description} | ${p.version} |\n`;
});

console.log(markdown);
```

---

### 3. Markdown Table Generators

Several online tools exist for manual table generation:
- [TablesGenerator.com](https://www.tablesgenerator.com/markdown_tables)
- [CodeShack Markdown Table Generator](https://codeshack.io/markdown-table-generator/)
- [MDUtil](https://mdutil.com/tools/markdown-table-generator)

**Use case:** Manual one-off table creation, not for automation

---

### 4. DRY Principles for Documentation

#### Key Principles from Research:

1. **Single Source of Truth**
   - Store metadata once (plugin.json)
   - Generate documentation from that source
   - Don't duplicate information

2. **Template-Based Consistency**
   - Create README templates for plugins
   - Use consistent sections across all plugins
   - Examples: Installation, Usage, Configuration, Troubleshooting

3. **Modular Documentation**
   - Each plugin has its own detailed README
   - Root README provides overview and quick start
   - Link between them for navigation

4. **Automated Validation**
   - Use tools like [monorepolint](https://github.com/monorepolint/monorepolint) to enforce standards
   - Validate metadata schema
   - Check for required sections

5. **Progressive Disclosure**
   - Root README: High-level overview
   - Plugin sections: Key features and quick start
   - Individual READMEs: Comprehensive documentation
   - Docs folder: Deep dives, guides, examples

---

### 5. Best Practices for "Available Plugins" Sections

Based on research of successful repositories:

#### Structure Options:

**Option A: Simple List with Links**
```markdown
## Available Plugins

- **[video-analysis](./video-analysis/)** - AI-powered video feedback and quality analysis
- **[devcoffee](./devcoffee/)** - Automated code quality workflows
- **[remotion-max](./remotion-max/)** - Complete Remotion video creation toolkit
```

**Option B: Table Format**
```markdown
## Available Plugins

| Plugin | Description | Components |
|--------|-------------|------------|
| [video-analysis](./video-analysis/) | AI-powered video feedback | Command, Skill |
| [devcoffee](./devcoffee/) | Code quality workflows | 2 Agents, Command |
| [remotion-max](./remotion-max/) | Remotion toolkit | Skill, 2 Agents, 2 Commands |
```

**Option C: Categorized Groups**
```markdown
## Available Plugins

### Media & Video
- **[video-analysis](./video-analysis/)** - AI-powered video feedback
- **[remotion-max](./remotion-max/)** - Remotion video creation toolkit

### Code Quality
- **[devcoffee](./devcoffee/)** - Automated code quality workflows
```

**Option D: Detailed Cards (Current Approach - Good!)**
```markdown
### `video-analysis`
AI-powered video feedback and quality analysis

**Components:**
- **Command:** `/video-analysis` - Analyze any video file
- **Skill:** `video-analysis` - Auto-activates on video analysis requests

**Installation:**
```bash
/plugin install video-analysis@devcoffee-marketplace
```

**When to use:** Review videos, get UI/UX feedback, check visual quality
```

#### Recommendation:

Our **current approach (Option D)** is actually excellent for a small number of plugins (3-5). It provides:
- Quick installation commands
- Clear component listing
- When to use guidance
- Links to detailed docs

**However**, to maintain consistency:
1. Add metadata validation
2. Use consistent section order
3. Auto-generate from plugin.json where possible

---

## Recommendations for devcoffee-agent-skills

### Current State Analysis

**Strengths:**
- ✅ Clear structure with detailed plugin sections
- ✅ Installation instructions
- ✅ Links to individual plugin READMEs
- ✅ Quick start at the top
- ✅ Usage examples

**Inconsistencies Found:**
1. Plugin sections have slightly different formats
2. Some sections more detailed than others
3. Manual maintenance prone to drift
4. No validation of completeness

### Recommended Solution

**Hybrid approach combining automation + templates:**

#### 1. Create Plugin README Template

Create `/docs/templates/PLUGIN-README-TEMPLATE.md`:

```markdown
# Plugin Name

> One-line tagline

## Overview

Brief description of what this plugin does and when to use it.

## Components

- **Agent:** `agent-name` - What it does
- **Command:** `/command-name` - When to use
- **Skill:** `skill-name` - Auto-activates when...

## Installation

```bash
/plugin install plugin-name@devcoffee-marketplace
```

## Quick Start

Basic usage example

## Documentation

- [Full Documentation](./docs/)
- [Examples](./examples/)
- [Troubleshooting](./docs/troubleshooting.md)

## Configuration

Optional configuration details

## Dependencies

List any dependencies

## License

MIT
```

#### 2. Standardize plugin.json Schema

Extend plugin.json with documentation metadata:

```json
{
  "name": "video-analysis",
  "version": "1.0.0",
  "description": "AI-powered video analysis using FFmpeg frame extraction and Claude vision API",
  "tagline": "Get comprehensive visual feedback on your videos",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "category": "media",
  "keywords": ["video", "analysis", "feedback", "ffmpeg", "vision"],
  "license": "MIT",
  "components": {
    "commands": ["video-analysis"],
    "skills": ["video-analysis"],
    "agents": [],
    "hooks": []
  },
  "dependencies": {
    "external": ["ffmpeg"],
    "plugins": []
  },
  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": ["brew install ffmpeg"]
  }
}
```

#### 3. Create Generation Script

`scripts/generate-readme-plugins.js`:

```javascript
#!/usr/bin/env node

/**
 * Generates the "Available Plugins" section for root README
 * Reads from all plugin.json files and creates consistent entries
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Read all plugin.json files
const pluginPaths = glob.sync('*/.claude-plugin/plugin.json', {
  ignore: 'node_modules/**'
});

const plugins = pluginPaths.map(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const dir = path.dirname(path.dirname(file));
  return { ...data, dir };
}).sort((a, b) => a.name.localeCompare(b.name));

// Generate markdown for each plugin
const sections = plugins.map(plugin => {
  const components = [];

  if (plugin.components?.agents?.length) {
    components.push(`- **Agent:** \`${plugin.components.agents.join('`, `')}\``);
  }
  if (plugin.components?.commands?.length) {
    components.push(`- **Command:** \`/${plugin.components.commands.join('`, `/')}\``);
  }
  if (plugin.components?.skills?.length) {
    components.push(`- **Skill:** \`${plugin.components.skills.join('`, `')}\``);
  }

  const deps = [];
  if (plugin.dependencies?.plugins?.length) {
    deps.push('```bash');
    plugin.dependencies.plugins.forEach(dep => {
      deps.push(`/plugin install ${dep}`);
    });
    deps.push('```');
  }
  if (plugin.dependencies?.external?.length) {
    deps.push(`\n**External dependencies:** ${plugin.dependencies.external.join(', ')}`);
  }

  return `
### \`${plugin.name}\`
${plugin.description}

**Components:**
${components.join('\n')}

**Installation:**
\`\`\`bash
/plugin install ${plugin.name}@${plugin.installation?.marketplace || 'devcoffee-marketplace'}
${plugin.installation?.setup?.join('\n') || ''}
\`\`\`

**When to use:** ${plugin.tagline || 'See documentation for details'}

---
`.trim();
}).join('\n\n');

// Output the generated section
console.log('## Available Plugins\n\n' + sections);

// Optionally write to file or update README in place
```

#### 4. Add Validation Script

`scripts/validate-plugins.js`:

```javascript
#!/usr/bin/env node

/**
 * Validates plugin.json files for consistency
 */

const fs = require('fs');
const glob = require('glob');

const REQUIRED_FIELDS = ['name', 'version', 'description', 'author', 'license'];
const RECOMMENDED_FIELDS = ['tagline', 'category', 'keywords', 'components'];

const pluginPaths = glob.sync('*/.claude-plugin/plugin.json', {
  ignore: 'node_modules/**'
});

let hasErrors = false;

pluginPaths.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const errors = [];
  const warnings = [];

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Check recommended fields
  RECOMMENDED_FIELDS.forEach(field => {
    if (!data[field]) {
      warnings.push(`Missing recommended field: ${field}`);
    }
  });

  // Check README exists
  const dir = path.dirname(path.dirname(file));
  if (!fs.existsSync(path.join(dir, 'README.md'))) {
    warnings.push('Missing README.md');
  }

  if (errors.length || warnings.length) {
    console.log(`\n${file}:`);
    errors.forEach(e => console.error(`  ❌ ${e}`));
    warnings.forEach(w => console.warn(`  ⚠️  ${w}`));

    if (errors.length) hasErrors = true;
  }
});

if (!hasErrors) {
  console.log('\n✅ All plugins valid!');
}

process.exit(hasErrors ? 1 : 0);
```

#### 5. Add npm Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "readme:generate": "node scripts/generate-readme-plugins.js > .readme-plugins-section.md",
    "readme:validate": "node scripts/validate-plugins.js",
    "readme:update": "npm run readme:generate && echo 'Generated section saved to .readme-plugins-section.md. Manually merge into README.md'",
    "precommit": "npm run readme:validate"
  }
}
```

#### 6. Add Pre-commit Hook (Optional)

`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run readme:validate
```

---

## Implementation Roadmap

### Phase 1: Standardization (Now)
1. ✅ Document current state
2. ⬜ Create plugin.json schema
3. ⬜ Update all plugin.json files with extended metadata
4. ⬜ Create plugin README template
5. ⬜ Validate existing READMEs against template

### Phase 2: Automation (Next)
1. ⬜ Write generation script
2. ⬜ Write validation script
3. ⬜ Test on current plugins
4. ⬜ Add npm scripts
5. ⬜ Document workflow in CONTRIBUTING.md

### Phase 3: Enhancement (Future)
1. ⬜ Add category-based grouping
2. ⬜ Generate badges automatically
3. ⬜ Create plugin comparison table
4. ⬜ Build simple static site for browsing (optional)

---

## Comparison: Manual vs Automated

### Current Approach (Manual)
**Pros:**
- Complete control over formatting
- Easy to customize individual entries
- No build step required

**Cons:**
- Prone to inconsistency
- Easy to forget updating sections
- Duplicate information (plugin.json + README)
- No validation

### Recommended Approach (Hybrid)
**Pros:**
- Consistency guaranteed
- Single source of truth (plugin.json)
- Automated validation
- Easy to add new plugins
- Still allows manual override

**Cons:**
- Requires build step
- Initial setup effort
- Need to maintain scripts

---

## Tools We Could Use

### Option 1: Custom Scripts (Recommended)
- Simple Node.js scripts
- Full control
- Easy to modify
- No external dependencies

### Option 2: monorepolint
- Enforces consistency rules
- Validates file structure
- Can auto-fix some issues
- More setup required

### Option 3: readme-md-generator
- Quick setup
- Good for initial generation
- Less flexible for our needs

### Option 4: Template Engine (Handlebars/EJS)
- Powerful templating
- Can generate entire README
- More complex
- Overkill for our use case

---

## Real-World Examples to Study

### Excellent README Examples:
1. [Rollup Plugins](https://github.com/rollup/plugins) - Clean table format
2. [VueUse](https://github.com/vueuse/vueuse) - Minimal with external docs
3. [Nuxt Modules](https://github.com/nuxt/modules) - Metadata-driven
4. [awesome-readme](https://github.com/matiassingers/awesome-readme) - Template collection

### Plugin.json Examples:
1. VSCode extensions - manifest.json
2. ESLint plugins - package.json keywords
3. Babel plugins - package.json metadata
4. Webpack loaders - package.json

---

## Conclusion

### Final Recommendation

For devcoffee-agent-skills, implement a **hybrid approach:**

1. **Keep the current detailed sections** - They work well for 3-5 plugins
2. **Add metadata to plugin.json** - Extend with documentation fields
3. **Create simple generation script** - Auto-generate sections from metadata
4. **Add validation** - Ensure consistency without manual checks
5. **Use templates** - Standardize individual plugin READMEs

This gives us:
- ✅ Consistency through automation
- ✅ Flexibility for special cases
- ✅ Easy maintenance
- ✅ Scalability as we add more plugins
- ✅ Single source of truth
- ✅ Validation and quality checks

---

## References

### Tools
- [readme-md-generator](https://www.npmjs.com/package/readme-md-generator) - CLI README generator
- [package-json-to-readme](https://github.com/zeke/package-json-to-readme) - Generate from package.json
- [@appnest/readme](https://github.com/andreasbm/readme) - Template-based generator
- [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) - Generate docs from JSON Schema
- [monorepolint](https://github.com/monorepolint/monorepolint) - Monorepo consistency tool
- [TablesGenerator.com](https://www.tablesgenerator.com/markdown_tables) - Markdown table generator

### Best Practices
- [GitHub README Best Practices](https://github.com/jehna/readme-best-practices)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [awesome-readme](https://github.com/matiassingers/awesome-readme)
- [README Best Practices - Tilburg Science Hub](https://tilburgsciencehub.com/building-blocks/store-and-document-your-data/document-data/readme-best-practices/)
- [The Ultimate Guide to Building a Monorepo in 2026](https://medium.com/@sanjaytomar717/the-ultimate-guide-to-building-a-monorepo-in-2025-sharing-code-like-the-pros-ee4d6d56abaa)

### Repository Examples
- [Babel Monorepo](https://github.com/babel/babel)
- [Rollup Plugins](https://github.com/rollup/plugins)
- [VueUse](https://github.com/vueuse/vueuse)
- [Jest](https://github.com/facebook/jest)
- [Nuxt Modules](https://github.com/nuxt/modules)
- [UnJS](https://github.com/unjs)

### Articles
- [Monorepo Guide: Manage Repositories & Microservices](https://www.aviator.co/blog/monorepo-a-hands-on-guide-for-managing-repositories-and-microservices/)
- [10 Common monorepo problems](https://digma.ai/10-common-problems-of-working-with-a-monorepo/)
- [Python Monorepo Example](https://www.tweag.io/blog/2023-04-04-python-monorepo-1/)
- [GitHub README Template (2026)](https://rivereditor.com/blogs/write-perfect-readme-github-repo)

---

**Research completed:** 2026-02-07
**Next steps:** Implement Phase 1 - Standardization
