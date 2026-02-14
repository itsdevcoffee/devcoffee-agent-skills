---
name: opentui-builder
description: This skill should be used when the user asks to "create an OpenTUI component", "build a TUI screen", "implement terminal UI", "use @opentui/core", "create renderables", "add OpenTUI animation", "build imperative UI", or mentions OpenTUI framework patterns. Provides comprehensive guidance for building terminal UIs with @opentui/core following established best practices from the Maximus Loop TUI POC.
version: 0.2.0
framework:
  name: "@opentui/core"
  tested: "0.1.79"
  compatible: "^0.1.70"
status: experimental
last-updated: "2026-02-14"
---

# OpenTUI Builder

**Framework:** @opentui/core v0.1.79 (tested)
**Status:** 🧪 Experimental (Pre-1.0)
**Last Updated:** 2026-02-14
**Runtime:** Bun only

> ⚠️ **Pre-1.0 Framework Notice**
>
> OpenTUI is actively evolving toward 1.0. This skill reflects best practices
> as of v0.1.79. Breaking changes are expected as the framework matures.
>
> **Tested with:** @opentui/core v0.1.79
> **Compatible:** v0.1.70 - v0.1.x
> **Reference:** Maximus Loop TUI POC

Build production-quality terminal user interfaces with @opentui/core, a pre-1.0 TUI framework for Bun with Zig-native rendering.

## Core Concepts

### Dual API Patterns

OpenTUI provides both declarative and imperative APIs:

**Declarative (VNodes):** Use `Box()`, `Text()` factories for static layouts
```typescript
const layout = Box(
  { width: "100%", flexDirection: "column" },
  Text({ content: "Hello", fg: "#00ff00" })
)
```

**Imperative (Renderables):** Use `BoxRenderable`, `TextRenderable` for dynamic mutations
```typescript
const text = new TextRenderable(ctx, { id: "status", content: "Loading..." })
// Later:
text.content = "Done!"
text.fg = "#00ff00"
```

**When to use each:**
- Declarative: Static layouts, one-time renders, composing layouts
- Imperative: Live updates, animations, real-time data, progress indicators

**Key insight:** Imperative renderables can be children of declarative VNodes — mix both patterns.

### Component Factory Pattern

Follow this pattern for all reusable components:

```typescript
export interface ComponentHandle {
  container: BoxRenderable | TextRenderable  // Include in parent layout
  destroy(): void                             // Cleanup on unmount
  // ... component-specific methods
}

export function createComponent(
  ctx: RenderContext,
  opts: { id: string; /* options */ }
): ComponentHandle {
  let destroyed = false

  // Create renderables
  const container = new BoxRenderable(ctx, { id: opts.id, ... })

  // Public API
  function destroy() {
    destroyed = true
    // Clear timers, remove listeners, etc.
  }

  return { container, destroy }
}
```

**Benefits:** Consistent API, proper cleanup, type-safe, composable

### Screen Pattern

All screens implement this interface:

```typescript
export interface Screen {
  render(): VNode          // Returns root layout
  unmount(): void          // Cleanup lifecycle
  footerHints: string      // Keyboard shortcuts for footer
}

export function createMyScreen(renderer: CliRenderer, ctx: RenderContext): Screen {
  let cleanupFns: Array<() => void> = []
  let unmounted = false

  function render(): VNode {
    // Clean up previous render
    cleanupFns.forEach(fn => fn())
    cleanupFns = []
    unmounted = false

    // Build UI, register cleanup
    const keyHandler = (key: KeyEvent) => { /* ... */ }
    renderer.keyInput.on("keypress", keyHandler)
    cleanupFns.push(() => renderer.keyInput.off("keypress", keyHandler))

    return Box({ /* layout */ })
  }

  function unmount() {
    unmounted = true
    cleanupFns.forEach(fn => fn())
    cleanupFns = []
  }

  return { render, unmount, footerHints: "[q] quit" }
}
```

### Cleanup Discipline

**Critical:** Track ALL resources for cleanup to prevent memory leaks:

```typescript
let cleanupFns: Array<() => void> = []

// Register everything that needs cleanup
cleanupFns.push(
  () => clearInterval(intervalId),
  () => clearTimeout(timeoutId),
  () => renderer.keyInput.off("keypress", handler),
  () => stream.stop(),
  () => component.destroy(),
  () => { try { renderer.removeFrameCallback(cb) } catch {} }
)
```

**Guard against destroyed state:**
```typescript
let destroyed = false

function update() {
  if (destroyed) return  // Don't mutate destroyed renderables
  try {
    renderable.content = newValue
  } catch {
    // Renderable destroyed between check and mutation
  }
}
```

## Animation Patterns

### Timeline Animations

Use `createTimeline()` for choreographed sequences:

```typescript
import { createTimeline, engine } from "@opentui/core"

engine.attach(renderer)

const animTarget = { value: 0 }

const timeline = createTimeline({
  duration: 2000,
  loop: false,
  onComplete: () => {
    renderer.removeFrameCallback(frameCallback)
    renderer.dropLive()
  },
})

// @ts-expect-error OpenTUI timeline types don't include onUpdate callback
timeline.add(animTarget, {
  value: 100,
  duration: 2000,
  ease: "inOutQuad",
  onUpdate: () => {
    progressBar.setProgress(animTarget.value)
  },
})

renderer.requestLive()
renderer.setFrameCallback(async (_dt: number) => {
  // Runs every frame during animation
})
timeline.play()
```

**Cleanup:**
```typescript
cleanupFns.push(
  () => { try { timeline.pause() } catch {} },
  () => { try { engine.unregister(timeline) } catch {} },
  () => { try { renderer.removeFrameCallback(frameCallback) } catch {} },
  () => { try { renderer.dropLive() } catch {} }
)
```

### Interval Animations

For simple loops (spinners, tickers):

```typescript
const intervalId = setInterval(() => {
  if (destroyed) return
  frameIndex = (frameIndex + 1) % frames.length
  try {
    renderable.content = frames[frameIndex]
  } catch {
    destroy()  // Renderable destroyed
  }
}, 80)

cleanupFns.push(() => clearInterval(intervalId))
```

### Cascade Animations

Triple-nested setTimeout pattern for staggered effects:

```typescript
items.forEach((item, i) => {
  setTimeout(() => {
    if (unmounted) return
    item.backgroundColor = yellow  // Flash 1

    setTimeout(() => {
      if (unmounted) return
      item.backgroundColor = green  // Flash 2

      setTimeout(() => {
        if (unmounted) return
        item.backgroundColor = normal  // Settle
      }, 100)
    }, 100)
  }, i * 300)  // Stagger by 300ms
})
```

## Scrolling Pattern

Pool-based rendering for efficient scrolling:

```typescript
const maxVisibleLines = 20
const rows: TextRenderable[] = []
let scrollOffset = 0  // 0 = bottom (live), positive = scrolled up

// Create fixed pool
for (let i = 0; i < maxVisibleLines; i++) {
  rows.push(new TextRenderable(ctx, { id: `row-${i}`, content: "" }))
}

function renderRows() {
  const total = allEvents.length
  const endIdx = Math.max(0, total - scrollOffset)
  const startIdx = Math.max(0, endIdx - maxVisibleLines)

  for (let i = 0; i < maxVisibleLines; i++) {
    const eventIdx = startIdx + i
    if (eventIdx < endIdx) {
      rows[i].content = formatEvent(allEvents[eventIdx])
    } else {
      rows[i].content = ""
    }
  }
}

// Keyboard: up/down scrolls, f resumes live
switch (key.name) {
  case "up":
    if (scrollOffset < maxOffset) {
      scrollOffset++
      renderRows()
    }
    break
  case "down":
    if (scrollOffset > 0) {
      scrollOffset--
      renderRows()
    }
    break
  case "f":
    scrollOffset = 0  // Jump to bottom (live)
    renderRows()
    break
}
```

## Theme System Pattern

Two-layer theme architecture for swappable color schemes:

### Base Palette
```typescript
// lib/themes/my-theme.ts
export const myThemeColors = {
  bg: "#0f0f0f",
  surface: "#1a1a2e",
  border: "#2a2a4a",
  borderFocus: "#7c3aed",
  text: "#e2e8f0",
  textDim: "#64748b",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  purple: "#7c3aed",
  cyan: "#06b6d4",
} as const
```

### Semantic Tokens
```typescript
// lib/theme.ts
export const theme = {
  colors: activeColors,  // Base palette

  status: {
    completed: activeColors.green,
    running: activeColors.yellow,
    failed: activeColors.red,
  },

  surface: {
    background: activeColors.bg,
    elevated: activeColors.surface,
    border: activeColors.border,
  },

  text: {
    primary: activeColors.text,
    secondary: activeColors.textDim,
  },
}
```

**Components reference semantic tokens:**
```typescript
backgroundColor: theme.surface.elevated  // NOT colors.surface
fg: theme.text.primary                   // NOT colors.text
```

**Swap themes:** Change base palette, semantic mappings update automatically.

## Common Patterns

### Mode Switching

Use mode enums for complex state:

```typescript
type DashboardMode = "normal" | "split" | "detail"
let mode: DashboardMode = "normal"

// Mode-specific key routing
if (mode === "detail") {
  if (key.name === "escape") {
    exitDetailMode()
    return
  }
  // Detail mode keys only
}

// Global keys work across all modes
if (key.name === "c") {
  triggerCascade()
  return
}
```

### Dynamic Layouts

Use imperative containers for add/remove:

```typescript
const mainContainer = new BoxRenderable(ctx, { id: "main" })

// Add child
mainContainer.add(childRenderable)

// Remove child
mainContainer.remove("child-id")

// Swap layouts between modes
if (mode === "split") {
  mainContainer.add(logStream.container)
} else {
  mainContainer.remove("log-stream-id")
}
```

### Live Data Streams

Poll files for new data:

```typescript
class JSONLStream {
  private position = 0
  private watcher: ReturnType<typeof setInterval> | null = null

  async readNew(): Promise<any[]> {
    const file = Bun.file(this.file)
    const size = await file.size

    if (size <= this.position) return []

    const slice = file.slice(this.position, size)
    const text = await slice.text()
    this.position = size

    return text.split('\n').map(line => JSON.parse(line))
  }

  startPolling(intervalMs: number, onEvents: (events: any[]) => void) {
    this.watcher = setInterval(async () => {
      const events = await this.readNew()
      if (events.length > 0) onEvents(events)
    }, intervalMs)
  }

  stop() {
    if (this.watcher) clearInterval(this.watcher)
  }
}
```

## Production Patterns

These patterns were developed across 5 sessions building the Maximus Loop TUI (~5,000 LOC). They address the hardest problems in production TUI development: live data, screen transitions, shared config, and concurrency.

### File Watcher with Debounce + Fallback

`fs.watch` is unreliable — it fires duplicate events, misses events on some filesystems, and crashes without error handlers. This pattern handles all of that:

```typescript
import { watch, type FSWatcher } from "fs"

export type WatchEvent = "plan-changed" | "progress-changed" | "logs-changed"
type Callback = () => void

export class TuiFileWatcher {
  private watchers: FSWatcher[] = []
  private listeners = new Map<WatchEvent, Set<Callback>>()
  private debounceTimers = new Map<WatchEvent, ReturnType<typeof setTimeout>>()
  private fallbackTimer: ReturnType<typeof setInterval> | null = null
  private started = false

  constructor(private config: AppConfig) {
    for (const event of ["plan-changed", "progress-changed", "logs-changed"] as const) {
      this.listeners.set(event, new Set())
    }
  }

  on(event: WatchEvent, callback: Callback): void {
    this.listeners.get(event)?.add(callback)
  }

  off(event: WatchEvent, callback: Callback): void {
    this.listeners.get(event)?.delete(callback)
  }

  private emit(event: WatchEvent): void {
    // Debounce: 50ms window collapses rapid duplicate events
    const existing = this.debounceTimers.get(event)
    if (existing) clearTimeout(existing)

    this.debounceTimers.set(event, setTimeout(() => {
      this.debounceTimers.delete(event)
      for (const cb of this.listeners.get(event) ?? []) {
        try { cb() } catch { /* listener error — don't crash watcher */ }
      }
    }, 50))
  }

  start(): void {
    if (this.started) return
    this.started = true

    // Watch individual files
    try {
      const w = watch(this.config.planPath, (eventType) => {
        if (eventType === "change") this.emit("plan-changed")
      })
      w.on("error", () => { /* CRITICAL: without this, watcher crashes the process */ })
      this.watchers.push(w)
    } catch { /* file may not exist yet — fallback covers it */ }

    // Watch directory for new files
    try {
      const w = watch(this.config.logsDir, (_eventType, filename) => {
        if (filename?.endsWith(".jsonl")) this.emit("logs-changed")
      })
      w.on("error", () => {})
      this.watchers.push(w)
    } catch { /* dir may not exist yet */ }

    // Fallback poll: covers missed events and missing files
    // Only for lightweight checks — skip expensive directory scans
    this.fallbackTimer = setInterval(() => {
      this.emit("plan-changed")
      this.emit("progress-changed")
    }, 5000)
  }

  stop(): void {
    this.started = false
    for (const w of this.watchers) {
      try { w.close() } catch { /* already closed */ }
    }
    this.watchers = []
    for (const timer of this.debounceTimers.values()) clearTimeout(timer)
    this.debounceTimers.clear()
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer)
      this.fallbackTimer = null
    }
  }
}
```

**Key lessons learned:**
- **Always add `.on("error")` to fs.watch** — without it, a watched file being deleted crashes the entire process
- **Debounce at 50ms** — file writes trigger 2-4 events; 50ms collapses them into one
- **Fallback poll at 5s** — fs.watch misses events on some Linux filesystems (NFS, Docker volumes)
- **Don't fallback-poll directories** — directory scans are expensive; only poll individual files
- **try/catch the `watch()` call** — file may not exist yet when watcher starts

**Using the watcher in screens:**
```typescript
export function createMyScreen(
  renderer: CliRenderer,
  ctx: RenderContext,
  config: AppConfig,
  watcher: TuiFileWatcher,  // Passed in from main
): Screen {
  // ...
  const onDataChanged = () => { reloadData() }
  watcher.on("plan-changed", onDataChanged)

  // MUST clean up listener on unmount
  cleanupFns.push(() => watcher.off("plan-changed", onDataChanged))
}
```

### Detail Drilldown Pattern

List-to-detail navigation using container swapping. This was implemented identically in 3 screens:

```typescript
// State
let mode: "list" | "detail" = "list"
let detailContainer: BoxRenderable | null = null
let detailScrollOffset = 0
let detailScrollMax = 0
let detailRenderScroll: (() => void) | null = null

// Wrapper container that swaps between list and detail
const mainBox = new BoxRenderable(ctx, {
  id: "screen-main",
  width: "100%",
  flexGrow: 1,
  flexDirection: "column",
})
mainBox.add(listContainer)

async function enterDetailMode(index: number) {
  if (index < 0 || index >= items.length) return
  mode = "detail"

  // Remove list from main box
  try { mainBox.remove("item-list") } catch { /* not present */ }

  // Load additional data (async — check unmounted after await)
  let extraData: ExtraData | undefined
  try {
    extraData = await loadExtraData(config.dataPath)
    if (unmounted) return  // Screen was unmounted during async load
  } catch { /* continue without extra data */ }
  if (unmounted) return

  // Build detail container with sections
  detailContainer = new BoxRenderable(ctx, {
    id: "detail-view",
    width: "100%",
    flexGrow: 1,
    flexDirection: "column",
    paddingY: 1,
  })

  // Add static content sections...
  detailContainer.add(new TextRenderable(ctx, {
    id: "detail-title",
    content: ` ${items[index].title}`,
    fg: theme.text.primary,
    attributes: TextAttributes.BOLD,
  }))

  // Add scrollable pool for long content
  const scrollItems = buildScrollContent(items[index], extraData)
  const maxVisible = 10
  const pool: TextRenderable[] = []
  detailScrollOffset = 0
  detailScrollMax = Math.max(0, scrollItems.length - maxVisible)

  for (let i = 0; i < maxVisible; i++) {
    const row = new TextRenderable(ctx, { id: `detail-row-${i}`, content: "" })
    pool.push(row)
    detailContainer.add(row)
  }

  function renderScroll() {
    try {
      for (let i = 0; i < maxVisible; i++) {
        const idx = detailScrollOffset + i
        if (idx < scrollItems.length) {
          pool[i].content = scrollItems[idx].text
          pool[i].fg = scrollItems[idx].bold ? theme.text.primary : theme.text.secondary
          pool[i].attributes = scrollItems[idx].bold ? TextAttributes.BOLD : 0
        } else {
          pool[i].content = ""
        }
      }
    } catch { /* destroyed */ }
  }

  detailRenderScroll = renderScroll
  renderScroll()
  mainBox.add(detailContainer)
}

function exitDetailMode() {
  if (!detailContainer) return
  try { mainBox.remove("detail-view") } catch { /* not present */ }
  detailContainer = null
  detailRenderScroll = null
  detailScrollOffset = 0
  detailScrollMax = 0

  mode = "list"
  mainBox.add(listContainer)
  renderRows()
}

// Keyboard routing MUST split by mode
const keyHandler = (key: KeyEvent) => {
  if (unmounted) return

  // Detail mode gets priority — intercepts Esc, Up, Down
  if (mode === "detail") {
    if (key.name === "escape") { exitDetailMode(); return }
    if (key.name === "down" && detailRenderScroll) {
      if (detailScrollOffset < detailScrollMax) {
        detailScrollOffset++
        detailRenderScroll()
      }
      return
    }
    if (key.name === "up" && detailRenderScroll) {
      if (detailScrollOffset > 0) {
        detailScrollOffset--
        detailRenderScroll()
      }
      return
    }
    return  // Swallow all other keys in detail mode
  }

  // List mode keys
  switch (key.name) {
    case "return":
      if (selectedIndex >= 0) enterDetailMode(selectedIndex)
      break
    case "up":
      // ... list navigation
      break
    case "down":
      // ... list navigation
      break
  }
}
```

**Key lessons learned:**
- **Container swapping, not visibility toggling** — remove list from mainBox, add detail. OpenTUI doesn't have a visibility property.
- **Check `unmounted` after every `await`** — user can switch screens during async data loading. Without this guard, you'll mutate destroyed renderables.
- **Detail mode swallows all keys** — the `return` at the end of the detail block prevents keys from leaking to list mode.
- **Update footer hints per mode** — `"[↑↓] navigate [enter] details [esc] back"` tells users what's available.
- **Unified scroll pool** — use a single pool for all scrollable content (criteria, test steps, history). Don't create separate scroll areas.

### Shared Config + Watcher Wiring

Multi-screen apps need centralized config and a shared watcher. This is the production pattern:

```typescript
// lib/app-config.ts
export interface AppConfig {
  dir: string
  planPath: string
  progressPath: string
  logsDir: string
}

// 3-tier priority: explicit > env var > CWD default
export function createConfig(dir?: string): AppConfig {
  const base = dir ?? process.env.APP_DIR ?? `${process.cwd()}/.app`
  return {
    dir: base,
    planPath: `${base}/plan.json`,
    progressPath: `${base}/progress.md`,
    logsDir: `${base}/logs`,
  }
}

// prod-main.ts — wires config + watcher into all screens
const config = createConfig()
const watcher = new TuiFileWatcher(config)

// ALL screens receive config + watcher as constructor args
const screenFactories = [
  createDashboardScreen,
  createOutputScreen,
  createFailuresScreen,
  createPlanViewerScreen,
]

const screens = screenFactories.map(factory =>
  factory(renderer, ctx, config, watcher)
)

// Start watcher AFTER initial render
renderApp()
watcher.start()
```

**Screen factory signature:**
```typescript
export function createMyScreen(
  renderer: CliRenderer,
  ctx: RenderContext,
  config: AppConfig,       // All file paths come from here
  watcher: TuiFileWatcher, // Shared watcher instance
): Screen {
  // Use config.planPath, config.progressPath, config.logsDir
  // Subscribe to watcher events
  // Clean up watcher subscriptions in unmount
}
```

**Key lessons learned:**
- **Config is created once in main, passed everywhere** — no screen reads env vars directly.
- **Watcher is shared** — one watcher instance, multiple screen subscribers. Don't create per-screen watchers.
- **Start watcher after first render** — otherwise watcher events fire before UI is ready.
- **Screens must unsubscribe on unmount** — theme switching destroys and recreates all screens. Without `watcher.off()` in unmount, old callbacks fire on destroyed renderables.

### Reload with Concurrency Guards

When watcher fires during an async reload, you get overlapping reloads that corrupt state:

```typescript
let isReloading = false

async function reloadData() {
  if (unmounted) return
  if (isReloading) return  // Prevent concurrent reloads
  isReloading = true

  try {
    const data = await loadData(config.dataPath)
    if (unmounted) return  // Check again after async

    // Only update UI in list mode — don't clobber detail view
    if (mode === "list") {
      items = data.items
      renderRows()
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    try {
      statusText.content = `Error: ${msg}`
      statusText.fg = theme.status.failed
    } catch { /* destroyed */ }
  } finally {
    isReloading = false
  }
}

// Watcher triggers reload
watcher.on("data-changed", () => { reloadData() })
```

**Key lessons learned:**
- **Guard with `isReloading` flag** — watcher debounce is 50ms, but data loading can take longer. Without the guard, two reloads run simultaneously and race on `items` state.
- **Check mode before UI update** — if user is in detail view when data changes, don't overwrite the detail view. Update the underlying data silently.
- **Wrap in try/finally** — always release the `isReloading` flag, even on error. Otherwise the screen stops updating permanently.

## Type Safety

### RenderContext Cast

OpenTUI's `CliRenderer` implements `RenderContext`. Centralize the cast:

```typescript
// main.ts
const renderer = await createCliRenderer({ exitOnCtrlC: true })
const ctx = renderer as RenderContext

// Pass ctx to all factories
const screen = createMyScreen(renderer, ctx)
```

### Known Type Issues

OpenTUI v0.1.79 has incomplete types. Known gaps:

**1. CliRenderer → RenderContext cast:**
```typescript
// CliRenderer implements RenderContext but types don't reflect it
const renderer = await createCliRenderer({ exitOnCtrlC: true })
const ctx = renderer as RenderContext  // Safe cast — only place this is needed
```
This is the only type workaround in the Maximus Loop TUI (5,000 LOC). Centralize it in your main entry point and pass `ctx` to all factories.

**2. Timeline onUpdate callback (if using timeline animations):**
```typescript
// @ts-expect-error OpenTUI timeline types don't include onUpdate
timeline.add(target, {
  value: 100,
  duration: 2000,
  onUpdate: () => { /* ... */ }
})
```

**Rules:**
- Use `@ts-expect-error` with explanatory comment, not `as any`
- `as any` breaks strict mode — always prefer targeted suppression
- Centralize casts in one location (entry point), not scattered across files

## Performance Best Practices

### Pool-Based Rendering

**Don't:** Create new renderables on every update
```typescript
function render() {
  container.clear()
  for (const item of items) {
    container.add(new TextRenderable(ctx, { content: item }))  // BAD
  }
}
```

**Do:** Reuse fixed pool
```typescript
const rows: TextRenderable[] = []
for (let i = 0; i < maxVisible; i++) {
  rows.push(new TextRenderable(ctx, { id: `row-${i}` }))
}

function render() {
  for (let i = 0; i < maxVisible; i++) {
    rows[i].content = items[i]?.text || ""  // Mutate existing
  }
}
```

### Debounce Expensive Operations

Guard against rapid state changes:

```typescript
let updating = false

function onEvent() {
  if (updating) return
  updating = true

  // Expensive update
  renderAllRows()

  setTimeout(() => { updating = false }, 16)  // ~60fps
}
```

## Common Pitfalls

### Double Cleanup

**Problem:** Screen unmount called twice during transitions
```typescript
function renderApp() {
  screens[activeIndex].unmount()  // Called here
  // ... render
}

keyHandler = (key) => {
  screens[activeIndex].unmount()  // AND here before renderApp()
  renderApp()
}
```

**Solution:** Call unmount only once (in keyHandler, not renderApp)

### Memory Leaks in Theme Switching

**Problem:** Only active screen unmounted
```typescript
screens[activeIndex].unmount()  // Other 6 screens leak
screens = createAllScreensWithNewTheme()
```

**Solution:** Unmount ALL screens
```typescript
screens.forEach(s => s.unmount())
screens = createAllScreensWithNewTheme()
```

### Stale Closure References

**Problem:** Closures capture initial values
```typescript
let count = 0
setTimeout(() => {
  console.log(count)  // Always 0, even if count changed
}, 1000)
```

**Solution:** Use object references
```typescript
const state = { count: 0 }
setTimeout(() => {
  console.log(state.count)  // Sees mutations
}, 1000)
```

## Additional Resources

### Reference Files

For detailed patterns and advanced techniques:
- **`references/advanced-patterns.md`** - Complex layouts, multi-mode screens, performance optimization, error recovery

### Example Files

Working examples in `examples/`:
- **`scrollable-list.ts`** - Pool-based scrolling implementation
- **`theme-system.ts`** - Runtime theme switching with cleanup

## Quick Start

### Basic Screen

```typescript
import { Box, Text } from "@opentui/core"
import type { CliRenderer, RenderContext } from "@opentui/core"

export interface Screen {
  render(): import("@opentui/core").VNode
  unmount(): void
  footerHints: string
}

export function createMyScreen(renderer: CliRenderer, ctx: RenderContext): Screen {
  let cleanupFns: Array<() => void> = []

  function render() {
    cleanupFns.forEach(fn => fn())
    cleanupFns = []

    return Box(
      { width: "100%", height: "100%", backgroundColor: "#0f0f0f" },
      Text({ content: "Hello OpenTUI", fg: "#00ff00" })
    )
  }

  function unmount() {
    cleanupFns.forEach(fn => fn())
    cleanupFns = []
  }

  return { render, unmount, footerHints: "[q] quit" }
}
```

### Basic Component

```typescript
import { TextRenderable } from "@opentui/core"
import type { RenderContext } from "@opentui/core"

export interface SpinnerHandle {
  renderable: TextRenderable
  start(): void
  stop(): void
  destroy(): void
}

export function createSpinner(ctx: RenderContext, opts: { id: string }): SpinnerHandle {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  let frameIndex = 0
  let interval: ReturnType<typeof setInterval> | null = null
  let destroyed = false

  const renderable = new TextRenderable(ctx, {
    id: opts.id,
    content: frames[0],
  })

  function start() {
    if (interval || destroyed) return
    interval = setInterval(() => {
      if (destroyed) return
      frameIndex = (frameIndex + 1) % frames.length
      try {
        renderable.content = frames[frameIndex]
      } catch {
        destroy()
      }
    }, 80)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function destroy() {
    stop()
    destroyed = true
  }

  return { renderable, start, stop, destroy }
}
```

## Framework Constraints

### Pre-1.0 Status

@opentui/core is version 0.1.x (pre-1.0). Expect:
- Incomplete TypeScript types (use `@ts-expect-error` with comments)
- Breaking changes between versions
- Limited documentation (rely on examples from Maximus Loop TUI POC)

### Bun-Only

OpenTUI requires Bun runtime (not Node.js):
- Native Zig renderer compiled for Bun
- Use `Bun.file()` for file I/O
- Use `Bun.Glob()` for file pattern matching

### TTY Requirement

OpenTUI requires interactive terminal (TTY):
- Won't work in background processes
- Won't work in CI/CD without PTY
- Test manually, not via automated headless tests

## Best Practices Summary

✅ **DO:**
- Use factory pattern for components (`create*()` returning `Handle`)
- Track ALL cleanup in `cleanupFns[]` array
- Guard mutations with `if (destroyed) return`
- Use pool-based rendering for lists
- Mix declarative VNodes with imperative Renderables
- Centralize themes with semantic tokens
- Use `@ts-expect-error` for known type gaps (not `as any`)
- Add `.on("error")` handlers to all `fs.watch()` watchers
- Check `unmounted` after every `await` in async functions
- Use concurrency guards (`isReloading` flag) for watcher-triggered reloads
- Create config once in main, pass to all screens
- Unsubscribe from watcher events in `unmount()`

❌ **DON'T:**
- Create new renderables in tight loops
- Forget to clean up intervals, listeners, frame callbacks
- Mutate renderables after unmount
- Use `as any` (breaks strict mode)
- Skip the `destroyed` guard in async callbacks
- Call unmount multiple times
- Create per-screen file watchers (share one watcher instance)
- Update list UI while in detail mode (check `mode` before render)
- Skip the `fs.watch` error handler (crashes the process)
- Fallback-poll directories (too expensive; only poll individual files)

## Getting Help

For detailed implementations, consult:
- **Maximus Loop TUI POC** — Reference implementation at `github.com/itsdevcoffee/maximus-loop` (branch: `tui-poc`, directory: `tui/src/`)
- **`references/advanced-patterns.md`** — Complex patterns from production use
- **`examples/`** — Working code you can copy and adapt
