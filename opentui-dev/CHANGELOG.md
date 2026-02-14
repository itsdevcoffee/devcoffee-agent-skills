# Changelog - OpenTUI Builder Skill

All notable changes to the OpenTUI Builder skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-13

### Added
- Initial release of OpenTUI builder skill
- Comprehensive patterns extracted from Maximus Loop TUI POC production usage
- Dual API patterns documentation (declarative VNodes + imperative Renderables)
- Component factory pattern with cleanup discipline and type-safe handles
- Screen pattern with lifecycle management (render, unmount, footerHints)
- Animation patterns:
  - Timeline animations with easing and choreography
  - Interval animations for spinners and tickers
  - Cascade animations for staggered effects
- Scrolling pattern with pool-based rendering for performance
- Theme system architecture:
  - Two-layer design (base palette + semantic tokens)
  - Runtime theme switching
  - Swappable color schemes
- Cleanup discipline documentation:
  - Resource tracking patterns
  - Memory leak prevention
  - Destroyed state guards
- Type safety guides for pre-1.0 framework:
  - RenderContext casting patterns
  - Known type issues (`@ts-expect-error` usage)
  - Timeline onUpdate type gap workaround
- Performance best practices:
  - Pool-based rendering vs creating new renderables
  - Debouncing expensive operations
  - Avoiding tight loops
- Common pitfalls documentation:
  - Double cleanup prevention
  - Memory leak scenarios
  - Stale closure references
- Working examples:
  - `scrollable-list.ts` - Pool-based scrolling implementation
  - `theme-system.ts` - Runtime theme switching
- Reference documentation:
  - `advanced-patterns.md` - Complex layouts and optimizations

### Framework Compatibility
- Tested with @opentui/core v0.1.79
- Compatible with v0.1.70 - v0.1.x
- Based on Maximus Loop TUI POC production implementation

### Known Issues
- Timeline `onUpdate` callback not included in TypeScript types, requires `@ts-expect-error` annotation
- Bun runtime required - not compatible with Node.js
- TTY (interactive terminal) required - won't work in headless environments or CI/CD without PTY emulation
- Pre-1.0 framework status - breaking changes expected as OpenTUI matures

### Maintenance
- Status: Experimental (Pre-1.0 framework)
- Update frequency: Quarterly
- Next review: Q2 2026 (April)

## [0.1.1] - 2026-02-13

### Fixed
- **Skill name format** - Changed from `OpenTUI Builder` to `opentui-builder` for correct slash command format
  - Before: `/OpenTUI Builder` (autocomplete showed capitalized with space)
  - After: `/opentui-builder` (correct lowercase hyphenated format)
- **Plugin.json author field** - Changed from string to object format required by Claude plugin schema
  - Added repository, keywords, and license fields

## [0.2.0] - 2026-02-14

### Added
- **File Watcher pattern** (SKILL.md + advanced-patterns.md) — Production-grade `TuiFileWatcher` with:
  - 50ms debounce to collapse duplicate fs.watch events
  - `.on("error")` handlers (prevents process crash on deleted files)
  - 5s fallback poll for unreliable filesystems (NFS, Docker volumes)
  - Shared watcher wiring pattern for multi-screen apps
- **Detail Drilldown pattern** (SKILL.md + advanced-patterns.md) — List-to-detail navigation with:
  - Container swapping (mainBox removes list, adds detail)
  - Unified scrollable pool for all detail content sections
  - Keyboard routing split by mode (detail swallows keys)
  - Async data loading with `unmounted` guards after every `await`
- **Shared Config + Watcher Wiring pattern** (SKILL.md) — Multi-screen app infrastructure:
  - `AppConfig` interface with 3-tier priority (explicit > env var > CWD default)
  - Config created once in main, passed to all screen factories
  - Watcher started after first render, shared across all screens
- **Reload with Concurrency Guards pattern** (SKILL.md) — Prevents race conditions:
  - `isReloading` flag prevents overlapping async reloads
  - Mode-aware rendering (don't update list while in detail view)
  - try/finally to always release guard
- **CLI Integration pattern** (advanced-patterns.md) — Zero-dependency CLI command:
  - Env var bridge for TUI config (`await import()` blocks until exit)
  - Replaced fictional `commander` example with actual production pattern

### Changed
- **Known Type Issues** — Updated to reflect current state:
  - Only remaining workaround: `CliRenderer as RenderContext` cast (1 location)
  - Cleaned up stale `@ts-expect-error` / `as any` guidance
- **Best Practices Summary** — Added 5 new DO items and 4 new DON'T items
- **Production Checklist** — Expanded from 12 to 20 items organized by category
- **Additional Resources** — Removed references to nonexistent files (`api-reference.md`, `migration-guide.md`, `live-stream.ts`)

### Fixed
- Removed references to nonexistent skill files in Additional Resources section

## [Unreleased]

### Planned for Future Versions

**When OpenTUI 0.2.x releases:**
- Migration guide for 0.1.x → 0.2.x breaking changes
- Updated patterns for new APIs
- Compatibility updates

**Additional examples (backlog):**
- Modal dialogs with keyboard focus management
- Table views with column resizing
- Split pane layouts with adjustable dividers
- Form components with validation

**Additional patterns (backlog):**
- Performance profiling techniques
- Testing strategies for TUI components
- Debugging patterns for terminal rendering
- Error handling best practices

**When OpenTUI 1.0.0 releases:**
- Comprehensive skill review and update
- Status change: experimental → stable
- Skill version bump to 1.0.0
- Production-ready designation
- Full TypeScript type coverage

---

## Version History Summary

| Version | Release Date | OpenTUI Version | Status | Notes |
|---------|--------------|-----------------|--------|-------|
| 0.1.0 | 2026-02-13 | 0.1.70 - 0.1.79 | 🧪 Experimental | Initial release from Maximus Loop POC |
| 0.2.0 | 2026-02-14 | 0.1.70 - 0.1.79 | 🧪 Experimental | Production patterns: file watcher, detail drilldown, config wiring |
| TBD | TBD | 0.2.x | 🚧 Future | Breaking changes expected |
| TBD | TBD | 1.0.x | 🎯 Goal | Skill graduates to stable |

---

**Maintenance Notes:**

This changelog tracks skill updates, not OpenTUI framework changes. For OpenTUI release notes, see: https://github.com/open-source-labs/OpenTUI/releases

**Quarterly Review Schedule:**
- Q2 2026 (Apr): Check for OpenTUI 0.1.x updates, test compatibility
- Q3 2026 (Jul): Major version check (0.2.0?), update patterns if needed
- Q4 2026 (Oct): Year-end review, plan 2027 roadmap

**Reporting Issues:**

Found a pattern that doesn't work with latest OpenTUI?
- GitHub: https://github.com/itsdevcoffee/devcoffee-agent-skills/issues
- Include: OpenTUI version, skill version, error message, code snippet
