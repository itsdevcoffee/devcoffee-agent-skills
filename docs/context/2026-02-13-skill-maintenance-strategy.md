# Skill Maintenance Strategy for Framework-Dependent Skills

**Date:** 2026-02-13
**Purpose:** Best practices for maintaining skills that depend on evolving external frameworks
**Context:** OpenTUI skill maintenance planning

## Problem Statement

Skills that teach patterns for external frameworks (OpenTUI, Remotion, React, etc.) face maintenance challenges:
- **Framework evolution** - Breaking changes, API shifts, deprecated patterns
- **Compatibility tracking** - Which framework version does the skill target?
- **User expectations** - Is this skill current or outdated?
- **Maintenance burden** - How to keep skills updated sustainably?

## Metadata Strategy

### 1. Extended Plugin Metadata Schema

Extend `.claude-plugin/plugin-metadata.json` with maintenance fields:

```json
{
  "name": "opentui-dev",
  "version": "0.1.0",
  "tagline": "Build production-quality terminal UIs with @opentui/core",
  "category": "development",

  "frameworkDependency": {
    "name": "@opentui/core",
    "testedVersion": "0.1.79",
    "compatibleVersions": "0.1.x",
    "versionConstraint": "^0.1.70",
    "installCommand": "bun add @opentui/core"
  },

  "maintenance": {
    "status": "experimental",
    "lastUpdated": "2026-02-13",
    "lastTestedWith": "@opentui/core@0.1.79",
    "updateFrequency": "quarterly",
    "maintainer": "Dev Coffee Team"
  },

  "compatibility": {
    "runtime": ["bun"],
    "requires": {
      "tty": true,
      "bun": ">=1.0.0"
    },
    "platforms": ["linux", "macos", "windows"]
  },

  "warnings": [
    "OpenTUI is pre-1.0 - expect breaking changes between versions",
    "Bun runtime required - will not work with Node.js",
    "Requires interactive terminal (TTY) - won't work in CI/CD"
  ]
}
```

### 2. Status Lifecycle

Define clear status values for skill maintenance:

| Status | Meaning | Usage |
|--------|---------|-------|
| `experimental` | Pre-1.0 framework, expect changes | OpenTUI, new frameworks |
| `stable` | Framework is stable (1.0+), skill actively maintained | Remotion, React |
| `maintenance` | Framework stable, skill receives bug fixes only | Older but stable frameworks |
| `deprecated` | Framework or patterns obsolete, use alternative | Old approaches |
| `archived` | No longer maintained, historical reference only | Dead frameworks |

### 3. Version Compatibility Matrix

Document tested framework versions in skill frontmatter:

```markdown
---
name: OpenTUI Builder
version: 0.1.0
framework:
  name: "@opentui/core"
  tested: "0.1.79"
  compatible: "0.1.70 - 0.1.x"
  breaking-changes:
    - version: "0.2.0"
      note: "Expected breaking changes when OpenTUI reaches 0.2.0"
last-updated: "2026-02-13"
status: experimental
---

# OpenTUI Builder

> ⚠️ **Pre-1.0 Framework**: OpenTUI is actively evolving. This skill was last tested with v0.1.79.
> Patterns may change as the framework matures. Check [CHANGELOG.md](./CHANGELOG.md) for updates.

...
```

## Documentation Patterns

### 1. In-Skill Version Badges

Add version information prominently:

```markdown
# OpenTUI Builder

**Framework:** @opentui/core v0.1.79 (tested)
**Status:** 🧪 Experimental
**Last Updated:** 2026-02-13
**Bun Only:** ✓ Requires Bun runtime

> ⚠️ **Framework Status**: OpenTUI is pre-1.0. Breaking changes are expected.
> This skill reflects best practices as of v0.1.79. Consult the
> [migration guide](./MIGRATION.md) if using different versions.
```

### 2. Version-Specific Warnings

Flag known compatibility issues:

```markdown
## Known Version Issues

### v0.1.79 (Current)
✅ All patterns tested and working

### v0.1.80+
⚠️ Timeline API changed - see migration guide section 3.2

### v0.2.0+ (Future)
🚧 Expected breaking changes - skill will be updated when released
```

### 3. Migration Guides

Create versioned migration docs:

```
opentui-dev/
├── skills/opentui-builder/
│   ├── SKILL.md
│   ├── MIGRATION.md          # Version migration guide
│   ├── CHANGELOG.md          # Skill changes over time
│   └── references/
│       ├── v0.1.x-patterns.md   # Version-specific docs
│       └── v0.2.x-patterns.md   # Future version patterns
```

**MIGRATION.md structure:**
```markdown
# OpenTUI Version Migration Guide

## Migrating from 0.1.70 → 0.1.79

**Timeline API Changes:**
```diff
- timeline.add(target, { value: 100, onUpdate: fn })
+ timeline.add(target, { value: 100, onUpdate: fn } as any)
```

**Why:** OpenTUI v0.1.75 removed `onUpdate` from types but kept runtime support.

## Migrating to 0.2.x (Future)

🚧 Breaking changes expected. Check back after 0.2.0 release.
```

### 4. Dependency Pinning in Examples

Pin versions in working examples:

```json
// examples/package.json
{
  "name": "opentui-examples",
  "dependencies": {
    "@opentui/core": "0.1.79"  // Exact version that examples work with
  },
  "devDependencies": {
    "bun-types": "latest"
  },
  "engines": {
    "bun": ">=1.0.0"
  }
}
```

## Maintenance Workflow

### 1. Quarterly Review Cycle

Schedule regular maintenance:

**Q1 (Jan-Mar):**
- Check for new framework versions
- Test skill patterns against latest version
- Update compatibility matrix
- Update examples if needed

**Q2 (Apr-Jun):**
- Review user feedback/issues
- Document new patterns discovered
- Update best practices

**Q3 (Jul-Sep):**
- Major version check (did 1.0 release?)
- Update status if framework stabilized
- Comprehensive example testing

**Q4 (Oct-Dec):**
- Year-end review
- Deprecate obsolete patterns
- Plan next year's roadmap

### 2. Version Bump Strategy

**Skill versioning (independent of framework):**

```
OpenTUI v0.1.70 → Skill v0.1.0 (initial)
OpenTUI v0.1.79 → Skill v0.1.1 (patch: updated compatibility info)
OpenTUI v0.2.0  → Skill v0.2.0 (minor: updated patterns, no breaking skill changes)
OpenTUI v1.0.0  → Skill v1.0.0 (major: skill now stable with stable framework)
```

**When to bump skill version:**
- **Patch (0.1.0 → 0.1.1):** Bug fixes, typo corrections, metadata updates
- **Minor (0.1.1 → 0.2.0):** New patterns, updated examples, framework compatibility changes
- **Major (0.2.0 → 1.0.0):** Breaking skill changes, complete rewrites, framework reaches 1.0

### 3. Automated Checks (Optional)

For high-value skills, add CI checks:

```yaml
# .github/workflows/skill-validation.yml
name: Validate OpenTUI Skill

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly on 1st
  workflow_dispatch:

jobs:
  check-framework-version:
    runs-on: ubuntu-latest
    steps:
      - uses: oven-sh/setup-bun@v1
      - run: bun add @opentui/core@latest
      - run: bun run examples/test.ts
      - name: Check version
        run: |
          CURRENT=$(jq -r '.frameworkDependency.testedVersion' .claude-plugin/plugin-metadata.json)
          LATEST=$(bun pm ls @opentui/core --json | jq -r '.[0].version')
          if [ "$CURRENT" != "$LATEST" ]; then
            echo "::warning::OpenTUI updated from $CURRENT to $LATEST - review needed"
          fi
```

## Deprecation Handling

### 1. Deprecation Warnings in Skill

When patterns become obsolete:

```markdown
## Component Factory Pattern

> ⚠️ **Deprecated as of OpenTUI 0.3.0**: Use new `useComponent()` hook instead.
> This pattern still works but is no longer recommended.

<details>
<summary>Legacy Pattern (for OpenTUI <0.3.0)</summary>

```typescript
// Old way (still works, deprecated)
export function createComponent(ctx: RenderContext): ComponentHandle {
  // ...
}
```

</details>

**New Pattern (OpenTUI 0.3.0+):**
```typescript
// New way (recommended)
export function useComponent(ctx: RenderContext): ComponentHandle {
  // ...
}
```
```

### 2. Archival Process

When skill becomes obsolete:

1. **Update status:** `experimental` → `deprecated` → `archived`
2. **Add prominent warning:**
   ```markdown
   # ⚠️ ARCHIVED - OpenTUI Builder

   This skill is no longer maintained. OpenTUI reached 2.0 with breaking changes.

   **Use instead:** [opentui-v2-builder](../opentui-v2-builder/)
   ```
3. **Keep for reference:** Don't delete, preserve for historical reference
4. **Update marketplace:** Mark as archived, suggest alternative

## Specific Recommendations for OpenTUI Skill

### Immediate Actions

**1. Add Metadata Files**

Create `opentui-dev/.claude-plugin/plugin-metadata.json`:
```json
{
  "name": "opentui-dev",
  "version": "0.1.0",
  "description": "Build production-quality terminal UIs with @opentui/core - comprehensive patterns from Maximus Loop TUI POC",
  "tagline": "Production-ready OpenTUI patterns for terminal UI development",
  "category": "development",

  "frameworkDependency": {
    "name": "@opentui/core",
    "testedVersion": "0.1.79",
    "compatibleVersions": "0.1.70 - 0.1.x",
    "versionConstraint": "^0.1.70",
    "installCommand": "bun add @opentui/core"
  },

  "maintenance": {
    "status": "experimental",
    "lastUpdated": "2026-02-13",
    "lastTestedWith": "@opentui/core@0.1.79",
    "updateFrequency": "quarterly",
    "maintainer": "Dev Coffee Team",
    "upstreamReference": "/home/maskkiller/dev-coffee/repos/maximus-loop-tui-poc"
  },

  "compatibility": {
    "runtime": ["bun"],
    "requires": {
      "tty": true,
      "bun": ">=1.0.0"
    },
    "platforms": ["linux", "macos", "windows"]
  },

  "warnings": [
    "OpenTUI is pre-1.0 - expect breaking changes between versions",
    "Bun runtime required - will not work with Node.js",
    "Requires interactive terminal (TTY) - won't work in CI/CD without PTY"
  ],

  "components": {
    "skills": ["opentui-builder"]
  },

  "dependencies": {
    "external": ["bun"]
  },

  "installation": {
    "marketplace": "devcoffee-marketplace",
    "setup": [
      "bun add @opentui/core",
      "Ensure Bun runtime installed: https://bun.sh"
    ]
  },

  "usage": {
    "when": "Building terminal user interfaces with @opentui/core, creating TUI screens, implementing terminal animations, or working with declarative/imperative rendering patterns",
    "examples": [
      "Create an OpenTUI screen with scrolling list",
      "Build animated progress indicator with timeline",
      "Implement theme switching in terminal UI",
      "Add keyboard navigation to TUI component"
    ]
  },

  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills"
}
```

**2. Update Skill Frontmatter**

Add to `SKILL.md`:
```markdown
---
name: OpenTUI Builder
description: [existing description]
version: 0.1.0
framework:
  name: "@opentui/core"
  tested: "0.1.79"
  compatible: "^0.1.70"
status: experimental
last-updated: "2026-02-13"
---

# OpenTUI Builder

**Framework:** @opentui/core v0.1.79 (tested)
**Status:** 🧪 Experimental (Pre-1.0)
**Last Updated:** 2026-02-13
**Runtime:** Bun only

> ⚠️ **Pre-1.0 Framework Notice**
>
> OpenTUI is actively evolving toward 1.0. This skill reflects best practices
> as of v0.1.79. Breaking changes are expected as the framework matures.
>
> **Tested with:** @opentui/core v0.1.79
> **Compatible:** v0.1.70 - v0.1.x
> **Reference:** Maximus Loop TUI POC

[rest of skill content...]
```

**3. Create CHANGELOG.md**

```markdown
# Changelog - OpenTUI Builder Skill

All notable changes to the OpenTUI Builder skill will be documented in this file.

## [0.1.0] - 2026-02-13

### Added
- Initial release of OpenTUI builder skill
- Comprehensive patterns from Maximus Loop TUI POC
- Dual API patterns (declarative VNodes + imperative Renderables)
- Component factory pattern with cleanup discipline
- Screen pattern with lifecycle management
- Animation patterns (timeline, interval, cascade)
- Scrolling pattern with pool-based rendering
- Theme system with semantic tokens
- Type safety guides for pre-1.0 framework
- Performance best practices
- Common pitfalls documentation

### Framework Compatibility
- Tested with @opentui/core v0.1.79
- Compatible with v0.1.70 - v0.1.x
- Based on Maximus Loop TUI POC production usage

### Known Issues
- Timeline `onUpdate` callback not in types, requires `@ts-expect-error`
- Bun runtime required, not compatible with Node.js
- TTY required, won't work in headless environments

## [Unreleased]

### Planned
- Migration guide for OpenTUI 0.2.x when released
- Additional examples: modal dialogs, table views, split panes
- Performance profiling patterns
- Testing strategies for TUI components
```

**4. Add README.md**

```markdown
# OpenTUI Dev - Terminal UI Builder for Claude Code

Build production-quality terminal user interfaces with @opentui/core.

## Status

🧪 **Experimental** - OpenTUI is pre-1.0, expect framework changes

**Tested with:** @opentui/core v0.1.79
**Last Updated:** 2026-02-13
**Category:** Development Tools

## What This Plugin Provides

Comprehensive guide for building terminal UIs with @opentui/core, covering:

- **Dual API Patterns** - When to use declarative vs imperative
- **Component Factories** - Reusable, type-safe TUI components
- **Animation System** - Timeline, interval, and cascade animations
- **Scrolling** - Pool-based rendering for performance
- **Theme System** - Swappable color schemes
- **Cleanup Discipline** - Prevent memory leaks in TUI apps

All patterns battle-tested in [Maximus Loop TUI POC](https://github.com/...).

## Requirements

- **Bun runtime** (>=1.0.0) - OpenTUI requires Bun, not Node.js
- **Interactive terminal** (TTY) - Won't work in background processes
- **@opentui/core** (^0.1.70) - Install with `bun add @opentui/core`

## Installation

```bash
# Install plugin from marketplace
claude plugin install opentui-dev@devcoffee-marketplace

# Install OpenTUI framework
bun add @opentui/core
```

## Usage

```
/opentui-builder
```

Ask Claude to:
- "Create an OpenTUI screen with a scrolling list"
- "Build a progress indicator with timeline animation"
- "Implement theme switching in my TUI"
- "Add keyboard navigation to this component"

## Framework Compatibility

| OpenTUI Version | Skill Version | Status | Notes |
|----------------|---------------|--------|-------|
| 0.1.70 - 0.1.79 | 0.1.0 | ✅ Tested | All patterns working |
| 0.1.80+ | 0.1.0 | ⚠️ Untested | May require updates |
| 0.2.x | TBD | 🚧 Future | Breaking changes expected |

## Examples

See `examples/` directory for working code:
- `scrollable-list.ts` - Pool-based scrolling
- `theme-system.ts` - Runtime theme switching

## Maintenance

**Status:** Experimental (Pre-1.0 framework)
**Update Frequency:** Quarterly
**Maintainer:** Dev Coffee Team

This skill is updated quarterly to track OpenTUI development. Check
[CHANGELOG.md](./CHANGELOG.md) for version compatibility updates.

## Known Limitations

⚠️ **Pre-1.0 Framework**
- Breaking changes expected as OpenTUI matures
- TypeScript types incomplete (use `@ts-expect-error` with comments)
- Limited official documentation

⚠️ **Bun Only**
- Requires Bun runtime (Zig-based native renderer)
- Will not work with Node.js

⚠️ **TTY Required**
- Needs interactive terminal
- Won't work in CI/CD without PTY emulation

## Contributing

Found a pattern that doesn't work with latest OpenTUI? Open an issue or PR:
- Report version incompatibilities
- Submit updated patterns for new versions
- Share production learnings

## License

MIT - See [LICENSE](../../LICENSE.md)

## Credits

Patterns extracted from [Maximus Loop TUI POC](https://github.com/...) by Dev Coffee Team.
```

### Long-Term Strategy

**Quarterly Maintenance Checklist:**

```markdown
# OpenTUI Skill Maintenance Checklist

## Q1 2026 (✅ Complete)
- [x] Initial skill creation from Maximus Loop POC
- [x] Add metadata with framework version tracking
- [x] Create CHANGELOG, README, migration guide structure
- [x] Add to marketplace with experimental status

## Q2 2026 (April)
- [ ] Check OpenTUI releases (currently 0.1.79, check for 0.1.x updates)
- [ ] Test skill patterns against latest version
- [ ] Update compatibility matrix if needed
- [ ] Review GitHub issues for OpenTUI breaking changes
- [ ] Update examples if API changed

## Q3 2026 (July)
- [ ] Check if OpenTUI hit 0.2.0 (breaking changes expected)
- [ ] If 0.2.0 released:
  - [ ] Test all patterns, document breaking changes
  - [ ] Create migration guide section for 0.1.x → 0.2.x
  - [ ] Update skill version to 0.2.0
  - [ ] Update examples
- [ ] If still 0.1.x:
  - [ ] Minor updates only
  - [ ] Continue experimental status

## Q4 2026 (October)
- [ ] Year-end review
- [ ] Check if OpenTUI approaching 1.0
- [ ] If 1.0 imminent, plan major skill update
- [ ] Review usage metrics, decide on continued maintenance
- [ ] Plan 2027 roadmap

## Framework Milestone: OpenTUI 1.0 (Future)
- [ ] Comprehensive skill review and rewrite
- [ ] Update status: experimental → stable
- [ ] Skill version → 1.0.0
- [ ] Comprehensive testing suite
- [ ] Production-ready designation
```

## Best Practices Summary

✅ **DO:**
- Version the skill independently from the framework
- Document tested framework version prominently
- Add status badges (experimental, stable, deprecated)
- Create migration guides for version transitions
- Schedule quarterly reviews for pre-1.0 frameworks
- Pin dependency versions in examples
- Warn users about framework maturity
- Keep deprecated patterns as reference (with warnings)
- Link to upstream reference implementations

❌ **DON'T:**
- Claim framework is stable when it's pre-1.0
- Skip version compatibility documentation
- Remove old patterns without migration guide
- Couple skill version to framework version
- Over-promise maintenance for experimental frameworks
- Hide breaking changes or compatibility issues
- Delete historical skill versions (archive instead)

## References

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Software Bill of Materials (SBOM)](https://www.cisa.gov/sbom)
- [Deprecation Best Practices](https://opensource.google/documentation/reference/thirdparty/deprecation)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-13
**Maintainer:** Dev Coffee Team
