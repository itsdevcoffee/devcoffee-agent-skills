# README Consistency - Action Plan

**Created:** 2026-02-07
**Status:** Ready for implementation
**Priority:** Medium
**Estimated effort:** 4-6 hours

---

## Quick Summary

After researching 10+ popular repositories (Babel, Rollup, VueUse, Nuxt, etc.) and documentation tools, here's what we should do:

**TL;DR:** Our current README structure is actually good! But we should automate consistency checks and generation from plugin.json metadata to avoid manual drift.

---

## What We Found

### Good News
✅ Our current README structure (detailed plugin sections) is excellent for 3-5 plugins
✅ We're already linking to individual plugin READMEs
✅ Installation examples are clear
✅ Quick start is prominent

### Issues to Fix
❌ Slight formatting inconsistencies between plugin sections
❌ Manual maintenance prone to drift
❌ No validation that all plugins have consistent metadata
❌ Information duplicated between plugin.json and README

---

## Recommended Approach

**Hybrid automation + manual control:**

1. **Extend plugin.json with documentation metadata**
   - Add tagline, category, components list
   - Add dependencies (plugins + external)
   - Single source of truth

2. **Create simple generation script**
   - Read all plugin.json files
   - Generate consistent "Available Plugins" sections
   - Output to temp file for manual review/merge

3. **Add validation script**
   - Check required fields exist
   - Verify READMEs exist
   - Ensure consistent structure

4. **Create plugin README template**
   - Standard sections for all plugins
   - Copy/paste template for new plugins

---

## Implementation Plan

### Phase 1: Standardization (2-3 hours)

**Task 1.1:** Create extended plugin.json schema
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Full description",
  "tagline": "One-line tagline for tables",
  "category": "media|code-quality|automation",
  "components": {
    "agents": ["agent1", "agent2"],
    "commands": ["command1"],
    "skills": ["skill1"],
    "hooks": []
  },
  "dependencies": {
    "plugins": ["plugin@marketplace"],
    "external": ["ffmpeg", "other"]
  },
  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": ["brew install ffmpeg"]
  }
}
```

**Task 1.2:** Update all existing plugin.json files
- [ ] video-analysis
- [ ] devcoffee
- [ ] remotion-max
- [ ] tldr

**Task 1.3:** Create plugin README template
- Location: `/docs/templates/PLUGIN-README-TEMPLATE.md`
- Sections: Overview, Components, Installation, Quick Start, Documentation, Configuration, Dependencies, License

**Task 1.4:** Validate existing plugin READMEs against template
- Check completeness
- Note any missing sections
- Fix inconsistencies

### Phase 2: Automation (1-2 hours)

**Task 2.1:** Write generation script
- File: `/scripts/generate-readme-plugins.js`
- Read all plugin.json files
- Generate markdown sections
- Output to `.readme-plugins-section.md`

**Task 2.2:** Write validation script
- File: `/scripts/validate-plugins.js`
- Check required fields
- Check recommended fields
- Verify READMEs exist
- Exit with error if validation fails

**Task 2.3:** Add npm scripts
```json
{
  "scripts": {
    "readme:generate": "node scripts/generate-readme-plugins.js",
    "readme:validate": "node scripts/validate-plugins.js",
    "precommit": "npm run readme:validate"
  }
}
```

**Task 2.4:** Test scripts
- Run on current plugins
- Verify output matches current README
- Fix any discrepancies

### Phase 3: Documentation (1 hour)

**Task 3.1:** Update CONTRIBUTING.md
- Add section on adding new plugins
- Explain plugin.json schema
- Document README template usage
- Explain generation workflow

**Task 3.2:** Create PLUGIN-DEVELOPMENT.md guide
- How to create a new plugin
- Required metadata
- README structure
- Testing locally

**Task 3.3:** Update root README (optional)
- Add badge for plugin count
- Add link to plugin development guide
- Note that plugin sections are auto-generated

---

## Example: Extended plugin.json

### Before (current):
```json
{
  "name": "video-analysis",
  "version": "1.0.0",
  "description": "AI-powered video analysis using FFmpeg frame extraction and Claude vision API",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee/devcoffee-agent-skills"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "license": "MIT",
  "keywords": ["video", "analysis", "feedback", "ffmpeg", "vision", "quality-review"]
}
```

### After (recommended):
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
      "sudo apt install ffmpeg"
    ]
  },
  "usage": {
    "when": "Review videos, get UI/UX feedback, check visual quality",
    "examples": [
      "/video-analysis path/to/video.mp4",
      "\"Analyze this video\" (attach video file)"
    ]
  }
}
```

---

## Example: Generated Output

Running `npm run readme:generate` would produce:

```markdown
## Available Plugins

### `devcoffee`
Dev Coffee productivity skills for Claude Code - feature implementation with buzzminson and code quality with maximus

**Components:**
- **Agent:** `maximus`, `buzzminson`
- **Command:** `/devcoffee:maximus`

**Installation:**
```bash
/plugin install devcoffee@devcoffee-marketplace
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

**When to use:** After coding, before commit, quality assurance

---

### `remotion-max`
Complete toolkit for Remotion video creation - best practices, agents, and automation

**Components:**
- **Skill:** `remotion-best-practices`
- **Agent:** `remotion-builder`, `remotion-setup`
- **Command:** `/remotion-max:builder`, `/remotion-max:setup`

**Installation:**
```bash
/plugin install remotion-max@devcoffee-marketplace
```

**When to use:** Building Remotion video projects

---

### `video-analysis`
AI-powered video analysis using FFmpeg frame extraction and Claude vision API

**Components:**
- **Command:** `/video-analysis`
- **Skill:** `video-analysis`

**Installation:**
```bash
/plugin install video-analysis@devcoffee-marketplace
# Mac
brew install ffmpeg
# Debian/Ubuntu
sudo apt install ffmpeg
```

**When to use:** Review videos, get UI/UX feedback, check visual quality

---
```

---

## Benefits

### Immediate
- ✅ Consistency guaranteed across all plugins
- ✅ Single source of truth (plugin.json)
- ✅ Automated validation prevents drift
- ✅ Easy to add new plugins

### Long-term
- ✅ Scales as we add more plugins
- ✅ Can generate other formats (JSON API, website)
- ✅ Less manual maintenance
- ✅ Professional appearance

---

## Alternative Approaches Considered

### 1. Full Automation (Generate entire README)
**Rejected because:**
- Loses flexibility for custom sections
- Examples and detailed docs need manual writing
- README is marketing, not just reference

### 2. External Documentation Site
**Rejected because:**
- Overkill for 3-5 plugins
- Requires hosting and maintenance
- GitHub README is sufficient for now

### 3. Manual with Style Guide
**Rejected because:**
- No enforcement mechanism
- Easy to forget or deviate
- Still requires duplicate info

### 4. Use readme-md-generator or similar
**Rejected because:**
- Not flexible enough for our structure
- Designed for single projects, not multi-plugin
- Still need custom sections

---

## Decision

**Go with Hybrid Approach** (recommendation above)

**Rationale:**
- Best balance of automation + control
- Minimal setup effort
- Scales well
- Industry standard (used by Nuxt, others)
- Easy to iterate and improve

---

## Next Steps

1. **Review this plan** - Get feedback/approval
2. **Start Phase 1** - Standardize metadata
3. **Implement Phase 2** - Create scripts
4. **Document Phase 3** - Update guides
5. **Test thoroughly** - Run on all plugins
6. **Commit changes** - Ship it!

---

## Resources

Full research document: [`docs/research/2026-02-07-readme-consistency-research.md`](/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/research/2026-02-07-readme-consistency-research.md)

**Key references:**
- [Rollup Plugins](https://github.com/rollup/plugins) - Table format
- [Nuxt Modules](https://github.com/nuxt/modules) - Metadata-driven
- [VueUse](https://github.com/vueuse/vueuse) - External docs
- [monorepolint](https://github.com/monorepolint/monorepolint) - Consistency tool

---

**Questions? Feedback?**

Open an issue or discuss in PR review.
