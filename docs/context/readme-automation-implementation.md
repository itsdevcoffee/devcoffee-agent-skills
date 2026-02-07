# README Automation Implementation - Context Document

**Purpose:** Implement automated README generation and validation for multi-plugin marketplace consistency
**Status:** Ready for Implementation
**Priority:** Medium
**Estimated Effort:** 4-6 hours
**Created:** 2026-02-07

---

## Problem Statement

**Current Issue:**
- Manual README maintenance leads to inconsistencies
- FFmpeg installation instructions missing from some sections
- Information duplicated between plugin.json, marketplace.json, and README
- No validation that all plugins have consistent documentation
- Easy to forget updates when adding new plugins

**Desired State:**
- Single source of truth (plugin.json metadata)
- Auto-generated plugin sections with guaranteed consistency
- Validation prevents drift and missing information
- Easy to add new plugins (just update metadata)
- Professional appearance that scales

---

## Solution Overview

**Hybrid Approach:** Metadata-driven generation + manual control for custom sections

### Components

1. **Extended plugin.json schema** - Add documentation metadata
2. **Generation script** - Auto-generate plugin sections from metadata
3. **Validation script** - Check required fields and consistency
4. **Plugin README template** - Standard structure for all plugins
5. **Documentation** - Guide for maintaining the system

---

## Research Foundation

**Research documents:**
- `docs/research/2026-02-07-readme-consistency-research.md` - Detailed analysis of 10+ repos
- `docs/project/readme-consistency-action-plan.md` - Implementation plan

**Key insights:**
- Industry leaders (Babel, Nuxt, Rollup) use metadata-driven approaches
- Simple markdown tables work better than complex formatting
- Link to detailed docs rather than inline everything
- Validation prevents drift over time

---

## Implementation Plan

### Phase 1: Metadata Standardization (2-3 hours)

#### Task 1.1: Create Extended Schema

**File:** `docs/schemas/plugin-metadata-schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "description"],
  "properties": {
    "name": {"type": "string", "pattern": "^[a-z0-9-]+$"},
    "version": {"type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$"},
    "description": {"type": "string", "minLength": 20},
    "tagline": {"type": "string", "maxLength": 80},
    "category": {"enum": ["media", "code-quality", "automation", "development"]},
    "components": {
      "type": "object",
      "properties": {
        "agents": {"type": "array", "items": {"type": "string"}},
        "commands": {"type": "array", "items": {"type": "string"}},
        "skills": {"type": "array", "items": {"type": "string"}},
        "hooks": {"type": "array", "items": {"type": "string"}}
      }
    },
    "dependencies": {
      "type": "object",
      "properties": {
        "plugins": {"type": "array", "items": {"type": "string"}},
        "external": {"type": "array", "items": {"type": "string"}}
      }
    },
    "installation": {
      "type": "object",
      "properties": {
        "marketplace": {"type": "string"},
        "setup": {"type": "array", "items": {"type": "string"}}
      }
    },
    "usage": {
      "type": "object",
      "properties": {
        "when": {"type": "string"},
        "examples": {"type": "array", "items": {"type": "string"}}
      }
    }
  }
}
```

#### Task 1.2: Update plugin.json Files

**video-analysis/.claude-plugin/plugin.json:**
```json
{
  "name": "video-analysis",
  "version": "1.0.0",
  "description": "AI-powered video analysis using FFmpeg frame extraction and Claude vision API",
  "tagline": "Get comprehensive visual feedback on your videos",
  "category": "media",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee/devcoffee-agent-skills"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "license": "MIT",
  "keywords": ["video", "analysis", "feedback", "ffmpeg", "vision", "quality-review"],
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
    "setup": [
      "# Mac",
      "brew install ffmpeg",
      "# Debian/Ubuntu",
      "sudo apt install ffmpeg",
      "# Fedora/RHEL",
      "sudo dnf install ffmpeg",
      "# Arch Linux",
      "sudo pacman -S ffmpeg",
      "# Windows",
      "https://ffmpeg.org/download.html"
    ]
  },
  "usage": {
    "when": "Review videos, get UI/UX feedback, check visual quality",
    "examples": [
      "/video-analysis path/to/video.mp4",
      "\"Analyze this video\" path/to/video.mp4"
    ]
  }
}
```

**devcoffee/.claude-plugin/plugin.json:**
```json
{
  "name": "devcoffee",
  "version": "0.3.0",
  "description": "Feature implementation and code quality automation - buzzminson for planned development, maximus for autonomous review cycles",
  "tagline": "Automated code quality workflows",
  "category": "code-quality",
  "components": {
    "agents": ["maximus", "buzzminson"],
    "commands": ["maximus"],
    "skills": [],
    "hooks": []
  },
  "dependencies": {
    "plugins": [
      "feature-dev@claude-plugins-official",
      "code-simplifier@claude-plugins-official"
    ],
    "external": []
  },
  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": []
  },
  "usage": {
    "when": "After coding, before commit, quality assurance",
    "examples": [
      "/devcoffee:maximus",
      "/devcoffee:maximus --interactive"
    ]
  }
}
```

**remotion-max/.claude-plugin/plugin.json:**
```json
{
  "name": "remotion-max",
  "version": "1.0.0",
  "description": "Complete toolkit for Remotion video creation - best practices, agents, and automation",
  "tagline": "Build amazing videos with Remotion",
  "category": "development",
  "components": {
    "skills": ["remotion-best-practices"],
    "agents": ["remotion-builder", "remotion-setup"],
    "commands": ["builder", "setup"],
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
    "when": "Building Remotion video projects",
    "examples": [
      "/remotion-max:builder text-reveal",
      "/remotion-max:setup --new-project"
    ]
  }
}
```

#### Task 1.3: Create Plugin README Template

**File:** `docs/templates/PLUGIN-README-TEMPLATE.md`

```markdown
# {PLUGIN_NAME} Plugin

{TAGLINE}

## Installation

\`\`\`bash
# Add marketplace
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills

# Install plugin
/plugin install {PLUGIN_NAME}@devcoffee-marketplace

{EXTERNAL_DEPENDENCIES}
\`\`\`

## Quick Start

{QUICK_START_EXAMPLE}

## Components

{COMPONENTS_LIST}

## Usage Examples

{USAGE_EXAMPLES}

## Documentation

- [Complete Guide](./skills/{SKILL_NAME}/README.md)
- [Quick Test](./skills/{SKILL_NAME}/QUICK-TEST.md)

## Requirements

{REQUIREMENTS_LIST}

## License

MIT
```

---

### Phase 2: Automation Scripts (1-2 hours)

#### Task 2.1: Generation Script

**File:** `scripts/generate-readme-plugins.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read marketplace.json to find all plugins
const marketplacePath = './.claude-plugin/marketplace.json';
const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

// Generate plugin section from metadata
function generatePluginSection(pluginMeta) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(pluginMeta.source, '.claude-plugin/plugin.json'), 'utf8')
  );

  let output = `### \`${manifest.name}\`\n`;
  output += `${manifest.description}\n\n`;

  // Components
  if (manifest.components) {
    output += `**Components:**\n`;
    const comps = manifest.components;
    if (comps.agents?.length) {
      output += `- **Agent:** ${comps.agents.map(a => `\`${a}\``).join(', ')}\n`;
    }
    if (comps.commands?.length) {
      output += `- **Command:** ${comps.commands.map(c => `\`/${manifest.name}:${c}\``).join(', ')}\n`;
    }
    if (comps.skills?.length) {
      output += `- **Skill:** ${comps.skills.map(s => `\`${s}\``).join(', ')}\n`;
    }
    output += '\n';
  }

  // Installation
  output += `**Installation:**\n\`\`\`bash\n`;
  output += `/plugin install ${manifest.name}@${manifest.installation?.marketplace || 'devcoffee-marketplace'}\n`;

  if (manifest.dependencies?.plugins?.length) {
    manifest.dependencies.plugins.forEach(dep => {
      output += `/plugin install ${dep}\n`;
    });
  }

  if (manifest.installation?.setup?.length) {
    output += '\n';
    manifest.installation.setup.forEach(line => {
      output += `${line}\n`;
    });
  }
  output += `\`\`\`\n\n`;

  // When to use
  if (manifest.usage?.when) {
    output += `**When to use:** ${manifest.usage.when}\n\n`;
  }

  output += `---\n\n`;

  return output;
}

// Generate all plugin sections
let pluginSections = '## Available Plugins\n\n';

marketplace.plugins.forEach(plugin => {
  try {
    pluginSections += generatePluginSection(plugin);
  } catch (err) {
    console.error(`Error generating section for ${plugin.name}:`, err.message);
  }
});

// Write to temp file for review
fs.writeFileSync('.readme-plugins-section.md', pluginSections);
console.log('Generated plugin sections → .readme-plugins-section.md');
console.log('Review and manually merge into README.md');
```

**Usage:**
```bash
node scripts/generate-readme-plugins.js
# Review .readme-plugins-section.md
# Copy into README.md between markers
```

#### Task 2.2: Validation Script

**File:** `scripts/validate-plugins.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// Read marketplace
const marketplace = JSON.parse(
  fs.readFileSync('./.claude-plugin/marketplace.json', 'utf8')
);

// Validate each plugin
marketplace.plugins.forEach(plugin => {
  const manifestPath = path.join(plugin.source, '.claude-plugin/plugin.json');

  // Check manifest exists
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${plugin.name}: Missing plugin.json at ${manifestPath}`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Check required fields
  if (!manifest.name) errors.push(`${plugin.name}: Missing 'name' field`);
  if (!manifest.version) errors.push(`${plugin.name}: Missing 'version' field`);
  if (!manifest.description) errors.push(`${plugin.name}: Missing 'description' field`);

  // Check recommended fields
  if (!manifest.tagline) warnings.push(`${plugin.name}: Missing 'tagline' (recommended)`);
  if (!manifest.category) warnings.push(`${plugin.name}: Missing 'category' (recommended)`);
  if (!manifest.components) warnings.push(`${plugin.name}: Missing 'components' (recommended)`);
  if (!manifest.dependencies) warnings.push(`${plugin.name}: Missing 'dependencies' (recommended)`);

  // Check README exists
  const readmePath = path.join(plugin.source, 'README.md');
  if (!fs.existsSync(readmePath)) {
    warnings.push(`${plugin.name}: Missing README.md`);
  }

  // Validate version format
  if (manifest.version && !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    errors.push(`${plugin.name}: Invalid version format '${manifest.version}' (use semver: X.Y.Z)`);
  }
});

// Output results
console.log('\n=== Plugin Validation ===\n');

if (errors.length > 0) {
  console.error('❌ ERRORS:\n');
  errors.forEach(err => console.error(`  - ${err}`));
}

if (warnings.length > 0) {
  console.warn('\n⚠️  WARNINGS:\n');
  warnings.forEach(warn => console.warn(`  - ${warn}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All plugins valid!\n');
}

// Exit with error if validation failed
process.exit(errors.length > 0 ? 1 : 0);
```

**Usage:**
```bash
node scripts/validate-plugins.js
# Returns exit code 1 if errors found
```

#### Task 2.3: Add npm Scripts

**File:** `package.json` (create if doesn't exist)

```json
{
  "name": "devcoffee-agent-skills",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "readme:generate": "node scripts/generate-readme-plugins.js",
    "readme:validate": "node scripts/validate-plugins.js",
    "precommit": "npm run readme:validate"
  },
  "devDependencies": {}
}
```

---

### Phase 3: Documentation (1 hour)

#### Task 3.1: Create Plugin Development Guide

**File:** `docs/guides/PLUGIN-DEVELOPMENT.md`

**Contents:**
- How to create a new plugin
- Required metadata fields
- README template usage
- Local testing instructions
- Validation workflow

#### Task 3.2: Update CONTRIBUTING.md

Add section on adding new plugins:
```markdown
## Adding a New Plugin

1. Create plugin directory: `plugin-name/`
2. Add `.claude-plugin/plugin.json` with complete metadata
3. Copy template: `cp docs/templates/PLUGIN-README-TEMPLATE.md plugin-name/README.md`
4. Fill in plugin-specific details
5. Run validation: `npm run readme:validate`
6. Generate README section: `npm run readme:generate`
7. Manually merge `.readme-plugins-section.md` into main README
8. Commit changes
```

#### Task 3.3: Add README Generation Markers

Update main `README.md` with markers for generated sections:

```markdown
<!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->
<!-- Generated by: npm run readme:generate -->
<!-- Do not edit manually - edit plugin.json files instead -->

## Available Plugins

[Auto-generated content goes here]

<!-- END AUTO-GENERATED PLUGIN SECTIONS -->
```

---

## Extended Metadata Schema

### Required Fields (Already Exist)

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Full description for marketplace listings",
  "author": {...},
  "repository": "...",
  "license": "MIT"
}
```

### New Recommended Fields

```json
{
  "tagline": "One-line summary for tables/listings (max 80 chars)",
  "category": "media|code-quality|automation|development",
  "components": {
    "agents": ["agent-name"],
    "commands": ["command-name"],
    "skills": ["skill-name"],
    "hooks": ["hook-type"]
  },
  "dependencies": {
    "plugins": ["plugin@marketplace"],
    "external": ["ffmpeg", "docker"]
  },
  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": [
      "# Platform-specific setup commands",
      "brew install ffmpeg",
      "sudo apt install ffmpeg"
    ]
  },
  "usage": {
    "when": "When to use this plugin (concise)",
    "examples": [
      "/command-name args",
      "\"Natural language invocation\""
    ]
  }
}
```

---

## Generation Script Logic

### Input Processing

1. Read `.claude-plugin/marketplace.json`
2. For each plugin in `plugins` array:
   - Read `{source}/.claude-plugin/plugin.json`
   - Extract metadata
   - Validate required fields exist

### Output Generation

For each plugin, generate markdown:

```markdown
### `{name}`
{description}

**Components:**
{components_list}

**Installation:**
```bash
/plugin install {name}@{marketplace}
{plugin_dependencies}
{external_dependencies_setup}
```

**When to use:** {usage.when}

---
```

### Template Variables

- `{name}` → `manifest.name`
- `{description}` → `manifest.description`
- `{components_list}` → Generated from `manifest.components`
- `{marketplace}` → `manifest.installation.marketplace`
- `{plugin_dependencies}` → `manifest.dependencies.plugins`
- `{external_dependencies_setup}` → `manifest.installation.setup`
- `{usage.when}` → `manifest.usage.when`

---

## Validation Rules

### Critical (Must Pass)

1. **plugin.json exists** - All plugins have `.claude-plugin/plugin.json`
2. **Required fields** - name, version, description present
3. **Version format** - Semantic versioning (X.Y.Z)
4. **Name format** - Kebab-case, lowercase, no special chars
5. **Marketplace sync** - All plugins in marketplace.json have corresponding directories

### Recommended (Warnings)

1. **README exists** - Each plugin has `README.md`
2. **Extended metadata** - tagline, category, components, dependencies
3. **Installation setup** - External dependencies documented
4. **Usage examples** - At least one example provided
5. **Keywords** - At least 3 keywords for discoverability

---

## Workflow for Adding New Plugin

### Before Automation (Current - Manual)

1. Create plugin directory structure
2. Write plugin.json
3. Write README.md
4. Add to marketplace.json
5. Manually update main README with new section
6. Try to match existing format (error-prone!)

### After Automation (Proposed)

1. Create plugin directory structure
2. Write plugin.json **with complete metadata**
3. Copy README template, fill in specifics
4. Add to marketplace.json
5. Run `npm run readme:validate` (catches missing fields)
6. Run `npm run readme:generate` (auto-generates section)
7. Copy generated section into main README
8. Commit (validation runs automatically)

**Time saved:** ~30 minutes per plugin
**Consistency:** Guaranteed

---

## Success Criteria

### Functional Requirements

- ✅ Generation script produces valid markdown
- ✅ Validation script catches missing required fields
- ✅ Generated sections match current README format
- ✅ All plugins pass validation
- ✅ Documentation explains the system clearly

### Quality Requirements

- ✅ Generated sections are readable and well-formatted
- ✅ No information loss from current README
- ✅ Easier to maintain than manual approach
- ✅ Scales to 10+ plugins without issues

### Process Requirements

- ✅ Adding new plugin takes <30 minutes
- ✅ Validation catches errors before commit
- ✅ Generation is one command (`npm run readme:generate`)
- ✅ Manual review step ensures quality

---

## Testing Plan

### Test Case 1: Generate from Current Plugins

**Input:** Current plugin.json files
**Action:** Run `npm run readme:generate`
**Expected:** Generated sections match current README

### Test Case 2: Add New Plugin

**Input:** New plugin with complete metadata
**Action:** Add to marketplace.json, run generation
**Expected:** New section appears in output

### Test Case 3: Missing Required Field

**Input:** Plugin.json missing "version"
**Action:** Run `npm run readme:validate`
**Expected:** Error message, exit code 1

### Test Case 4: Missing Recommended Field

**Input:** Plugin.json missing "tagline"
**Action:** Run `npm run readme:validate`
**Expected:** Warning message, exit code 0

---

## Migration Strategy

### Step 1: Implement Scripts (Don't Change README Yet)

1. Create generation and validation scripts
2. Test with current plugins
3. Verify output matches current README
4. Fix any discrepancies in scripts

### Step 2: Extend Metadata (Additive Only)

1. Add new fields to plugin.json files
2. Don't remove any existing fields
3. Run validation to check completeness
4. Iterate until all pass

### Step 3: Generate and Merge

1. Run generation script
2. Review generated output
3. Manually merge into README
4. Verify no information lost
5. Commit changes

### Step 4: Document Process

1. Update CONTRIBUTING.md
2. Create PLUGIN-DEVELOPMENT.md
3. Add comments in README about automation
4. Train team on new workflow

---

## Maintenance Going Forward

### When Adding New Plugin

1. Create plugin directory
2. Fill out plugin.json with **all metadata**
3. Run `npm run readme:validate`
4. Fix any errors/warnings
5. Run `npm run readme:generate`
6. Copy generated section into README
7. Commit

### When Updating Existing Plugin

1. Update plugin.json metadata
2. Run `npm run readme:generate`
3. Replace plugin section in README
4. Commit changes

**Key principle:** plugin.json is source of truth, README is generated

---

## Alternatives Considered

### Option A: Full Automation (Generate Entire README)

**Rejected because:**
- Loses flexibility for custom content
- Examples and detailed explanations need manual writing
- README is marketing, not just reference

### Option B: External Documentation Site

**Rejected because:**
- Overkill for 3-5 plugins
- Requires hosting and maintenance
- GitHub README is sufficient for now

### Option C: Manual with Style Guide Only

**Rejected because:**
- No enforcement mechanism
- Easy to forget or deviate
- Still requires duplicate info

### Option D: Use Existing Tools (readme-md-generator)

**Rejected because:**
- Not flexible enough for our structure
- Designed for single projects
- Can't handle multi-plugin complexity

---

## Future Enhancements

### Phase 4 (Optional)

1. **Auto-update marketplace.json from plugin.json files**
   - Single source: plugin.json
   - marketplace.json generated from all plugin.json files

2. **Generate website/JSON API**
   - Parse metadata to create browsable website
   - JSON API for programmatic access
   - Searchable plugin directory

3. **Badge generation**
   - Auto-generate shields.io badges
   - Plugin count, version, status badges
   - Dynamic based on metadata

4. **CI/CD integration**
   - Run validation on every PR
   - Block merge if validation fails
   - Auto-generate README in PR preview

---

## Reference Files

**Research:**
- `docs/research/2026-02-07-readme-consistency-research.md` - Full analysis
- `docs/project/readme-consistency-action-plan.md` - This file

**Templates (to create):**
- `docs/templates/PLUGIN-README-TEMPLATE.md` - Plugin README template
- `docs/schemas/plugin-metadata-schema.json` - JSON schema for validation

**Scripts (to create):**
- `scripts/generate-readme-plugins.js` - Generation script
- `scripts/validate-plugins.js` - Validation script

**Config (to create):**
- `package.json` - npm scripts for automation

---

## Implementation Checklist

### Phase 1: Metadata Standardization
- [ ] Create plugin metadata schema
- [ ] Update video-analysis/plugin.json with extended fields
- [ ] Update devcoffee/plugin.json with extended fields
- [ ] Update remotion-max/plugin.json with extended fields
- [ ] Create plugin README template
- [ ] Validate existing READMEs against template

### Phase 2: Automation
- [ ] Create generate-readme-plugins.js
- [ ] Create validate-plugins.js
- [ ] Add package.json with scripts
- [ ] Test generation with current plugins
- [ ] Verify output matches current README
- [ ] Fix any discrepancies

### Phase 3: Documentation
- [ ] Create PLUGIN-DEVELOPMENT.md guide
- [ ] Update CONTRIBUTING.md with plugin workflow
- [ ] Add README generation markers
- [ ] Document maintenance process

### Phase 4: Migration
- [ ] Run generation script
- [ ] Review generated output
- [ ] Merge into main README
- [ ] Commit all changes
- [ ] Update team on new process

---

## Success Metrics

**Before:**
- Manual README updates (error-prone)
- Inconsistent formatting
- Duplicated information
- No validation
- ~1 hour to add new plugin

**After:**
- Metadata-driven (single source of truth)
- Guaranteed consistency
- DRY principle (no duplication)
- Automated validation
- ~30 minutes to add new plugin

**ROI:** Pays off after 5+ plugins

---

## Questions for Decision

1. **Timing:** Implement now or later?
   - Now: Prevents further drift, establishes standard
   - Later: Works fine with 3 plugins for now

2. **Scope:** Full implementation or minimal?
   - Full: All phases (4-6 hours)
   - Minimal: Just validation (1 hour)

3. **Automation level:** Generate sections or entire README?
   - Sections: Recommended (hybrid approach)
   - Entire: Too rigid, loses flexibility

---

## Recommendation

**For current state (3 plugins):**
- Option 1: **Manual fixes now** (30 minutes) + automation later when we have 5+ plugins
- Option 2: **Implement automation now** (4-6 hours) to prevent future drift

**My recommendation:** Option 1 for pragmatism, Option 2 for long-term quality

---

## Next Steps

1. **Decide:** Automation now or manual for now?
2. **If automation:** Implement Phase 1 (metadata standardization)
3. **If manual:** Continue fixing inconsistencies as we find them

**Ready to implement when you are!**

---

**Created by:** Research agent (ac7f963)
**Based on:** Analysis of 10+ major repositories (Babel, Nuxt, Rollup, VueUse, etc.)
**Status:** Actionable plan ready for execution
