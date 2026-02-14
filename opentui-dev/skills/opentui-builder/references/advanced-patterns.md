# OpenTUI Advanced Patterns

Comprehensive patterns from building the Maximus Loop TUI POC (~4,100 LOC production code).

## Multi-Mode Screen Architecture

Complex screens with multiple views (normal, split, detail):

```typescript
type DashboardMode = "normal" | "split" | "detail"
let mode: DashboardMode = "normal"
let previousMode: DashboardMode = "normal"

// Imperative container for dynamic layout
const mainContainer = new BoxRenderable(ctx, { id: "main" })

function enterDetailMode(taskId: number) {
  previousMode = mode
  mode = "detail"

  // Remove current children
  mainContainer.remove("task-list")
  if (previousMode === "split") {
    mainContainer.remove("log-stream")
  }

  // Add detail view
  const detailView = createDetailView(ctx, taskId)
  mainContainer.add(detailView.container)
}

function exitDetailMode() {
  mainContainer.remove("detail-view")
  mode = previousMode

  // Restore previous layout
  mainContainer.add(taskListContainer)
  if (mode === "split") {
    mainContainer.add(logStreamContainer)
  }
}

// Key routing based on mode
function keyHandler(key: KeyEvent) {
  // Detail mode gets priority
  if (mode === "detail") {
    if (key.name === "escape") {
      exitDetailMode()
      return
    }
    detailView?.handleKey(key.name)
    return
  }

  // Split mode focus routing
  if (mode === "split") {
    if (key.name === "tab") {
      toggleFocus()  // tasks <-> logs
      return
    }
    if (focus === "logs") {
      logStream.handleKey(key.name)
      return
    }
  }

  // Normal mode / task list keys
  if (key.name === "down") {
    selectNext()
  }
}
```

## Selection + Highlight Management

Arrow key navigation with visual feedback:

```typescript
const allRows: BoxRenderable[] = []
let selectedIndex = -1  // -1 = no selection

function applyHighlight(index: number) {
  for (let i = 0; i < allRows.length; i++) {
    try {
      allRows[i].backgroundColor =
        i === index ? theme.interactive.selection : theme.surface.background
    } catch { /* destroyed */ }
  }
}

// Keyboard handler
switch (key.name) {
  case "down":
    if (selectedIndex === -1) {
      selectedIndex = 0  // First press activates
    } else if (selectedIndex < allRows.length - 1) {
      selectedIndex++
    }
    applyHighlight(selectedIndex)
    break

  case "up":
    if (selectedIndex === -1) {
      selectedIndex = allRows.length - 1  // Wrap to bottom
    } else if (selectedIndex > 0) {
      selectedIndex--
    }
    applyHighlight(selectedIndex)
    break

  case "return":
    if (selectedIndex >= 0) {
      handleSelection(selectedIndex)
    }
    break
}
```

## Split Pane with Focus Management

Two panels with tab-switching focus:

```typescript
type SplitFocus = "top" | "bottom"
let splitFocus: SplitFocus = "top"

const topPane = new BoxRenderable(ctx, { id: "top", border: true })
const bottomPane = new BoxRenderable(ctx, { id: "bottom", border: true })

function updateFocusBorders() {
  try {
    topPane.borderColor =
      splitFocus === "top" ? theme.interactive.accent : theme.surface.border
    bottomPane.borderColor =
      splitFocus === "bottom" ? theme.interactive.accent : theme.surface.border
  } catch { /* destroyed */ }
}

// Tab key toggles focus
if (key.name === "tab") {
  splitFocus = splitFocus === "top" ? "bottom" : "top"
  updateFocusBorders()
  return
}

// Route keys to focused pane
if (splitFocus === "top") {
  topPaneHandle.handleKey(key.name)
} else {
  bottomPaneHandle.handleKey(key.name)
}
```

## Event Stream Observer Pattern

Subscriber pattern for live data:

```typescript
type EventCallback = (event: AgentEvent) => void

export interface AgentEventStream {
  onEvent(callback: EventCallback): () => void  // Returns unsubscribe
  getAllEvents(): AgentEvent[]
  getHistory(taskId: number): AgentEvent[]
  start(): void
  stop(): void
}

export function createEventStream(): AgentEventStream {
  const subscribers: EventCallback[] = []
  const events: AgentEvent[] = []
  let intervalId: ReturnType<typeof setTimeout> | null = null

  function onEvent(callback: EventCallback) {
    subscribers.push(callback)
    return () => {
      const index = subscribers.indexOf(callback)
      if (index > -1) subscribers.splice(index, 1)
    }
  }

  function emit(event: AgentEvent) {
    events.push(event)
    subscribers.forEach(cb => cb(event))
  }

  function start() {
    if (intervalId) return
    function tick() {
      const event = generateEvent()
      emit(event)
      intervalId = setTimeout(tick, randomDelay())
    }
    tick()
  }

  function stop() {
    if (intervalId) {
      clearTimeout(intervalId)
      intervalId = null
    }
  }

  return { onEvent, getAllEvents: () => events, getHistory, start, stop }
}
```

**Usage:**
```typescript
const stream = createEventStream()
const unsubscribe = stream.onEvent((event) => {
  allEvents.push(event)
  renderRows()
})

cleanupFns.push(() => unsubscribe())
cleanupFns.push(() => stream.stop())
```

## Detail View Extraction Pattern

Extract large subsections into separate files:

**Before:** 797-line dashboard.ts with inline detail view (265 lines)

**After:**
```typescript
// screens/detail-view.ts
export interface DetailViewHandle {
  container: BoxRenderable
  handleKey(keyName: string): boolean
  destroy(): void
}

export function createDetailView(
  ctx: RenderContext,
  taskId: number,
  eventStream: AgentEventStream,
  tasks: Task[]
): DetailViewHandle {
  // ... 265 lines of implementation
}

// screens/dashboard.ts (now 519 lines)
import { createDetailView } from "./detail-view"
import type { DetailViewHandle } from "./detail-view"

let detailHandle: DetailViewHandle | null = null

function enterDetailMode(index: number) {
  detailHandle = createDetailView(ctx, tasks[index].id, stream, tasks)
  mainContainer.add(detailHandle.container)
}
```

**Benefits:** 35% reduction in dashboard size, detail view is testable in isolation

## Runtime Theme Switching

Make themes swappable at runtime:

```typescript
// theme.ts
let activeColors = getThemePalette("dark")
let theme = createTheme(activeColors)

export function switchTheme(name: ThemeName) {
  activeColors = getThemePalette(name)

  // Rebuild all semantic tokens
  theme.status.completed = activeColors.green
  theme.status.running = activeColors.yellow
  // ... rebuild all tokens
}

export { theme }

// main.ts
function onThemeChange(themeName: ThemeName) {
  // 1. Unmount all screens (cleanup)
  screens.forEach(s => s.unmount())

  // 2. Switch theme
  switchTheme(themeName)

  // 3. Recreate all screens with new theme
  screens = createAllScreens()

  // 4. Re-render
  renderApp()
}
```

**Critical:** Unmount ALL screens, not just active one — prevents memory leaks.

## Dual-Mode Architecture

Separate demo (showcase) from production:

```
src/
├── lib/          (shared)
├── components/   (shared)
├── demo/         (mock data, showcases)
│   └── demo-main.ts
└── production/   (real data, actual app)
    └── prod-main.ts
```

**Benefits:** Keep POC as reference, build production without demo baggage

## File Watching Pattern

For live data updates:

```typescript
import { watch } from "fs"

class FileWatcher {
  private watcher: ReturnType<typeof watch> | null = null

  watch(path: string, onChange: () => void) {
    this.watcher = watch(path, { persistent: false }, (event) => {
      if (event === "change") onChange()
    })
  }

  stop() {
    this.watcher?.close()
  }
}

// Usage
const watcher = new FileWatcher()
watcher.watch(".maximus/plan.json", async () => {
  const plan = await loadPlan(".maximus/plan.json")
  updateUI(plan)
})

cleanupFns.push(() => watcher.stop())
```

## Testing Strategies

### Manual Testing Only

OpenTUI requires interactive TTY — automated tests won't work:

```typescript
// Can't do this:
test("screen renders", () => {
  const screen = createScreen(renderer, ctx)
  expect(screen.render()).toBeDefined()  // Won't work without TTY
})
```

**Instead:**
- Test data parsers in isolation (unit tests work)
- Test component logic without rendering
- Manual testing in real terminal

### Visual Regression Testing

Take screenshots for comparison:

```bash
# Terminal screenshot tool
scrot -u -s screenshot.png

# Or built-in
import { browser_take_screenshot } from "playwright-mcp"
```

## Performance Optimization

### Minimize Re-Renders

```typescript
// BAD: Re-renders on every event
stream.onEvent(() => {
  renderEntireScreen()  // Expensive
})

// GOOD: Update only affected rows
stream.onEvent((event) => {
  const affectedRowIndex = findRowForEvent(event)
  rows[affectedRowIndex].content = formatEvent(event)  // Cheap
})
```

### Debounce File Watchers

```typescript
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watcher.watch(path, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    reloadData()
  }, 100)  // Wait 100ms for file writes to settle
})
```

### Limit Pool Sizes

```typescript
// BAD: Pool size = data size (unbounded)
const rows = events.map(e => new TextRenderable(ctx, { content: e.text }))

// GOOD: Fixed pool (e.g., 20 visible lines)
const maxVisible = 20
const rows = Array.from({ length: maxVisible }, (_, i) =>
  new TextRenderable(ctx, { id: `row-${i}` })
)
```

## Common Error Recovery

### Handle Missing Files Gracefully

```typescript
async function loadData(path: string) {
  try {
    const file = Bun.file(path)
    return await file.json()
  } catch (error) {
    console.error(`Failed to load ${path}:`, error)
    return null  // Don't crash, show error in UI
  }
}
```

### Protect Against Race Conditions

```typescript
let loading = false

async function reload() {
  if (loading) return  // Prevent concurrent reloads
  loading = true

  try {
    const data = await loadData()
    updateUI(data)
  } finally {
    loading = false
  }
}
```

## Integration Points

### CLI Integration

Expose TUI as a CLI command:

```typescript
// cli.ts
import { Command } from "commander"

program
  .command("tui")
  .description("Launch Maximus Loop TUI")
  .option("--demo", "Demo mode with mock data")
  .action(async (opts) => {
    if (opts.demo) {
      await import("./tui/src/demo/demo-main")
    } else {
      await import("./tui/src/production/prod-main")
    }
  })
```

### Data Integration

Point TUI at real data directories:

```typescript
// Parse CLI args
const maximusDir = process.env.MAXIMUS_DIR || "./.maximus"

// Load data
const plan = await loadPlan(`${maximusDir}/plan.json`)
const progress = await loadProgress(`${maximusDir}/progress.md`)
const logs = await findTaskLog(`${maximusDir}/logs`, taskId)
```

## Migration from Other Frameworks

### From Ink (React-based TUI)

| Ink | OpenTUI |
|-----|---------|
| `<Box>` JSX | `Box()` function or `new BoxRenderable()` |
| `<Text>` JSX | `Text()` function or `new TextRenderable()` |
| `useState()` hook | Imperative mutation (`renderable.content = x`) |
| `useEffect()` hook | Cleanup functions in unmount |
| Component tree re-renders | Mutate renderables in-place |

### From Blessed

| Blessed | OpenTUI |
|---------|---------|
| `blessed.box()` | `new BoxRenderable(ctx, {})` |
| `box.setContent()` | `textRenderable.content = "..."` |
| `screen.render()` | Auto-renders on mutation |
| Event emitters | `renderer.keyInput.on("keypress")` |

## Transparency Support

For transparent backgrounds (inherit terminal):

```typescript
const theme = {
  colors: {
    bg: "transparent",      // Inherits terminal background
    surface: "transparent", // Or use semi-transparent: "#1a1f2e99"
    // ... other colors
  }
}
```

**Use cases:**
- Terminals with custom backgrounds (images, gradients)
- Glassmorphic aesthetics
- Minimal interference with IDE underneath

## Streaming Data Patterns

### Append-Only JSONL Logs

```typescript
export class JSONLStream {
  private file: string
  private position: number = 0

  async readNew(): Promise<any[]> {
    const handle = Bun.file(this.file)
    const size = await handle.size

    if (size <= this.position) return []

    const slice = handle.slice(this.position, size)
    const text = await slice.text()
    this.position = size

    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
  }

  startPolling(intervalMs: number, onEvents: (events: any[]) => void) {
    setInterval(async () => {
      const events = await this.readNew()
      if (events.length > 0) onEvents(events)
    }, intervalMs)
  }
}
```

### Live Progress Updates

```typescript
interface ProgressData {
  completed: number
  total: number
  currentTask: string
}

let currentProgress: ProgressData = { completed: 0, total: 0, currentTask: "" }

async function pollProgress() {
  const progress = await loadProgress(".maximus/progress.md")

  if (JSON.stringify(progress) !== JSON.stringify(currentProgress)) {
    currentProgress = progress
    updateProgressBar(progress)
  }
}

setInterval(pollProgress, 2000)  // Poll every 2s
```

## Complex Layout Compositions

### Nested Containers

```typescript
const layout = Box(
  { flexDirection: "column" },

  // Header (fixed height)
  Box({ height: 3, border: true }, headerContent),

  // Body (flexible)
  Box(
    { flexGrow: 1, flexDirection: "row" },

    // Sidebar (fixed width)
    Box({ width: 30, border: true }, sidebar),

    // Main content (flexible)
    Box({ flexGrow: 1 }, mainContent)
  ),

  // Footer (fixed height)
  Box({ height: 3, border: true }, footer)
)
```

### Responsive Padding

```typescript
// Consistent spacing system
const spacing = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
}

Box({
  paddingX: spacing.sm,  // Horizontal
  paddingY: spacing.xs,  // Vertical
  gap: spacing.md,       // Between children
})
```

## Advanced Animations

### Staggered Reveals

```typescript
items.forEach((item, i) => {
  setTimeout(() => {
    if (unmounted) return
    item.opacity = 1  // Fade in
    item.x = 0        // Slide in from left
  }, i * 100)  // 100ms stagger
})
```

### Color Transitions

```typescript
function flashSuccess(renderable: BoxRenderable) {
  const originalColor = renderable.backgroundColor

  renderable.backgroundColor = theme.status.running  // Yellow flash

  setTimeout(() => {
    renderable.backgroundColor = theme.status.completed  // Green flash

    setTimeout(() => {
      renderable.backgroundColor = originalColor  // Settle
    }, 150)
  }, 150)
}
```

### Progress Animation with Timeline

```typescript
const target = { value: 0 }

const timeline = createTimeline({
  duration: 2000,
  loop: false,
  onComplete: () => cleanup()
})

timeline.add(target, {
  value: 100,
  duration: 2000,
  ease: "inOutQuad",
  onUpdate: () => {
    progressBar.setProgress(target.value)
  },
} as any)  // Type workaround

timeline.play()
```

## Error Handling

### Graceful Degradation

```typescript
async function loadAndDisplay(path: string) {
  try {
    const data = await loadData(path)
    displayData(data)
    errorText.content = ""
  } catch (error) {
    errorText.content = `Error loading ${path}: ${error.message}`
    errorText.fg = theme.status.failed
    // Show error in UI, don't crash
  }
}
```

### Retry Logic

```typescript
async function loadWithRetry(path: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadData(path)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## Production Checklist

Before shipping:

- [ ] All timers/intervals tracked in cleanupFns
- [ ] All event listeners removed on unmount
- [ ] All components have destroy() methods
- [ ] No `as any` (use `@ts-expect-error` with comments)
- [ ] Guard all mutations with `if (destroyed) return`
- [ ] Pool-based rendering for large lists
- [ ] File paths configurable (not hardcoded)
- [ ] Error messages shown in UI (not just console)
- [ ] Theme-aware (uses theme.*, not hardcoded colors)
- [ ] TypeScript strict mode passes
- [ ] Tested with all 12 themes
- [ ] Memory leak tested (theme switching, screen switching)
