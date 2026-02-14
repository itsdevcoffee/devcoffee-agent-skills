# OpenTUI Dev - Terminal UI Builder for Claude Code

🧪 **Experimental** | Build production-quality terminal user interfaces with @opentui/core

**Framework:** @opentui/core v0.1.79 (tested)
**Status:** Pre-1.0 (expect breaking changes)
**Last Updated:** 2026-02-13
**Category:** Development Tools

## What This Plugin Provides

Comprehensive guide for building terminal UIs with @opentui/core, covering:

- **Dual API Patterns** - When to use declarative VNodes vs imperative Renderables
- **Component Factories** - Reusable, type-safe TUI components with proper cleanup
- **Animation System** - Timeline, interval, and cascade animations
- **Scrolling** - Pool-based rendering for high-performance lists
- **Theme System** - Swappable color schemes with semantic tokens
- **Cleanup Discipline** - Prevent memory leaks in long-running TUI apps
- **Type Safety** - Navigate pre-1.0 TypeScript type gaps
- **Performance** - Best practices for efficient TUI rendering

All patterns battle-tested in **Maximus Loop TUI POC** production usage.

## Status & Compatibility

⚠️ **Pre-1.0 Framework Notice**

OpenTUI is actively evolving toward 1.0. This skill reflects best practices as of v0.1.79. Breaking changes are expected as the framework matures.

### Framework Compatibility Matrix

| OpenTUI Version | Skill Version | Status | Notes |
|----------------|---------------|--------|-------|
| 0.1.70 - 0.1.79 | 0.1.0 | ✅ Tested | All patterns working |
| 0.1.80+ | 0.1.0 | ⚠️ Untested | May require updates |
| 0.2.x | TBD | 🚧 Future | Breaking changes expected |
| 1.0.x | TBD | 🎯 Goal | Skill will graduate to stable |

## Requirements

### Runtime Requirements

- **Bun** (>=1.0.0) - OpenTUI requires Bun runtime, not Node.js
  - Install: https://bun.sh
- **Interactive Terminal** (TTY) - Won't work in background processes or CI/CD without PTY

### Framework Dependency

- **@opentui/core** (^0.1.70)
  - Tested with: v0.1.79
  - Compatible: v0.1.70 - v0.1.x

## Installation

```bash
# Install plugin from marketplace
claude plugin install opentui-dev@devcoffee-marketplace

# Install OpenTUI framework
bun add @opentui/core
```

## Usage

Invoke the skill when building OpenTUI applications:

```bash
/opentui-builder
```

**Example prompts:**
- "Create an OpenTUI screen with a scrolling list"
- "Build an animated progress indicator with timeline"
- "Implement theme switching in my TUI"
- "Add keyboard navigation to this component"
- "Build a live data stream viewer with pool-based rendering"

## What You'll Learn

### Core Patterns

**Dual API Patterns**
```typescript
// Declarative (VNodes) - for static layouts
const layout = Box({ width: "100%" }, Text({ content: "Hello" }))

// Imperative (Renderables) - for dynamic mutations
const text = new TextRenderable(ctx, { id: "status" })
text.content = "Updated!"  // Live mutation
```

**Component Factory Pattern**
```typescript
export interface ComponentHandle {
  container: BoxRenderable    // Include in parent layout
  destroy(): void             // Cleanup on unmount
  update(data): void          // Component-specific methods
}

export function createComponent(ctx, opts): ComponentHandle {
  // Factory returns handle with guaranteed cleanup
}
```

**Screen Pattern**
```typescript
export interface Screen {
  render(): VNode       // Returns root layout
  unmount(): void       // Cleanup lifecycle
  footerHints: string   // Keyboard shortcuts
}
```

### Advanced Topics

- **Timeline Animations** - Choreographed sequences with easing
- **Cascade Animations** - Staggered effects across multiple elements
- **Pool-Based Scrolling** - Efficient rendering for large lists
- **Theme Architecture** - Two-layer system (palette + semantic tokens)
- **Cleanup Discipline** - Track all resources, prevent memory leaks
- **Type Safety** - Navigate pre-1.0 TypeScript gaps with `@ts-expect-error`

## Examples

Working examples in `skills/opentui-builder/examples/`:

```
examples/
├── scrollable-list.ts    # Pool-based scrolling implementation
└── theme-system.ts       # Runtime theme switching
```

Each example includes:
- Tested with @opentui/core v0.1.79
- Inline documentation
- Run instructions: `bun run examples/scrollable-list.ts`

## Known Limitations

### 🚧 Pre-1.0 Framework
- Breaking changes expected as OpenTUI matures
- TypeScript types incomplete (use `@ts-expect-error` with comments)
- Limited official documentation (rely on this skill and examples)

### 🦕 Bun Only
- Requires Bun runtime (Zig-based native renderer)
- Will **not** work with Node.js
- macOS, Linux, Windows supported (where Bun runs)

### 📺 TTY Required
- Needs interactive terminal for rendering
- Won't work in:
  - Background processes
  - CI/CD pipelines (without PTY emulation)
  - Headless environments

## Maintenance

**Status:** Experimental (Pre-1.0 framework)
**Update Frequency:** Quarterly reviews
**Maintainer:** Dev Coffee Team

This skill is updated quarterly to track OpenTUI development. Check [CHANGELOG.md](./CHANGELOG.md) for version compatibility updates.

### Quarterly Review Schedule

- **Q2 2026 (Apr):** Check OpenTUI releases, test compatibility
- **Q3 2026 (Jul):** Major version check (0.2.0?), update if needed
- **Q4 2026 (Oct):** Year-end review, plan next year

See [docs/context/2026-02-13-skill-maintenance-strategy.md](../../docs/context/2026-02-13-skill-maintenance-strategy.md) for full maintenance strategy.

## Migration Guides

See [MIGRATION.md](./MIGRATION.md) for version-specific migration guides:
- OpenTUI 0.1.70 → 0.1.79 (current)
- OpenTUI 0.2.x (future, when released)
- OpenTUI 1.0.x (future stable release)

## Contributing

Found a pattern that doesn't work with latest OpenTUI? Help improve this skill:

- **Report version incompatibilities** - Open issue with OpenTUI version and error
- **Submit updated patterns** - PR with fixes for new versions
- **Share production learnings** - Contribute patterns from your TUI projects

Repository: https://github.com/itsdevcoffee/devcoffee-agent-skills

## Related Plugins

- **devcoffee** - Feature implementation (buzzminson) + code review (maximus)
- **remotion-max** - React-based video creation toolkit
- **video-analysis** - AI-powered video analysis with Claude vision

## License

MIT - See [LICENSE](../../LICENSE.md)

## Credits

Patterns extracted from **Maximus Loop TUI POC** by Dev Coffee Team.

Based on production experience building complex terminal UIs with:
- Multi-screen navigation
- Live data streaming
- Animated progress indicators
- Theme switching
- Keyboard shortcuts
- Pool-based scrolling for performance

---

**Questions?** Check the comprehensive skill documentation with `/opentui-builder` or consult the [advanced patterns reference](./skills/opentui-builder/references/advanced-patterns.md).
