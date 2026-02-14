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

## Detail View Pattern (Complete)

The detail drilldown pattern has two parts: the **container swapping** mechanism and the **scrollable content** within the detail view.

### Container Swapping

```typescript
// mainBox wraps either listContainer or detailContainer — never both
const mainBox = new BoxRenderable(ctx, { id: "main", flexGrow: 1, flexDirection: "column" })
mainBox.add(listContainer)

function enterDetailMode(index: number) {
  mode = "detail"
  try { mainBox.remove("item-list") } catch {}

  detailContainer = new BoxRenderable(ctx, { id: "detail-view", flexGrow: 1 })
  // ... build detail content ...
  mainBox.add(detailContainer)
}

function exitDetailMode() {
  try { mainBox.remove("detail-view") } catch {}
  detailContainer = null
  mode = "list"
  mainBox.add(listContainer)
  renderRows()
}
```

### Scrollable Content in Detail View

Use a single unified pool for all scrollable sections:

```typescript
// Build flat content array with section headers
interface ScrollItem { text: string; bold: boolean }
const scrollContent: ScrollItem[] = []

scrollContent.push({ text: " DESCRIPTION", bold: true })
for (const line of wrapText(item.description, 76)) {
  scrollContent.push({ text: `   ${line}`, bold: false })
}

scrollContent.push({ text: "", bold: false })  // Spacer
scrollContent.push({ text: " ACCEPTANCE CRITERIA", bold: true })
for (const criterion of item.criteria) {
  scrollContent.push({ text: `   ○ ${criterion}`, bold: false })
}

// Create fixed pool
const maxVisible = 10
const pool: TextRenderable[] = []
let scrollOffset = 0
const scrollMax = Math.max(0, scrollContent.length - maxVisible)

for (let i = 0; i < maxVisible; i++) {
  const row = new TextRenderable(ctx, { id: `detail-row-${i}`, content: "" })
  pool.push(row)
  detailContainer.add(row)
}

function renderScroll() {
  try {
    for (let i = 0; i < maxVisible; i++) {
      const idx = scrollOffset + i
      if (idx < scrollContent.length) {
        pool[i].content = scrollContent[idx].text
        pool[i].attributes = scrollContent[idx].bold ? TextAttributes.BOLD : 0
      } else {
        pool[i].content = ""
      }
    }
  } catch { /* destroyed */ }
}
```

### Async Data Loading in Detail Mode

Detail views often need to load additional data (e.g., task context from plan.json):

```typescript
async function enterDetailMode(index: number) {
  mode = "detail"
  try { mainBox.remove("item-list") } catch {}

  // Load extra data — MUST check unmounted after await
  let taskData: Task | undefined
  try {
    const plan = await loadPlan(config.planPath)
    if (unmounted) return  // User switched screens during load
    taskData = plan.tasks.find(t => t.id === items[index].taskId)
  } catch { /* continue without extra data */ }
  if (unmounted) return  // Check again

  // Now build detail view with both item data and task data
  // ...
}
```

### File Extraction for Large Detail Views

When detail view exceeds ~200 lines, extract to its own file:

```typescript
// screens/detail-view.ts
export interface DetailViewHandle {
  container: BoxRenderable
  handleKey(keyName: string): boolean
  destroy(): void
}

export function createDetailView(ctx: RenderContext, data: ItemData): DetailViewHandle {
  // ... extracted implementation
}

// screens/dashboard.ts — 35% smaller
import { createDetailView } from "./detail-view"
let detailHandle: DetailViewHandle | null = null

function enterDetailMode(index: number) {
  detailHandle = createDetailView(ctx, items[index])
  mainContainer.add(detailHandle.container)
}
```

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

## File Watcher Integration (Production Pattern)

The simple `fs.watch` pattern above is **not production-ready**. In production you need:
1. **Debouncing** — file writes trigger 2-4 events; collapse them
2. **Error handlers** — without `.on("error")`, a deleted watched file crashes the process
3. **Fallback polling** — fs.watch misses events on NFS, Docker volumes, some Linux configs
4. **Concurrency guards** — watcher fires during async reload → race condition

See the full `TuiFileWatcher` class in the main SKILL.md under "Production Patterns > File Watcher with Debounce + Fallback".

**Wiring pattern for multi-screen apps:**

```typescript
// prod-main.ts — create once, share everywhere
const config = createConfig()
const watcher = new TuiFileWatcher(config)

const screens = screenFactories.map(factory =>
  factory(renderer, ctx, config, watcher)
)

renderApp()
watcher.start()  // Start AFTER first render

// Each screen subscribes + unsubscribes:
// In render():
const onChanged = () => { reloadData() }
watcher.on("plan-changed", onChanged)
cleanupFns.push(() => watcher.off("plan-changed", onChanged))
```

**Reload function with concurrency guard:**

```typescript
let isReloading = false

async function reloadData() {
  if (unmounted || isReloading) return
  isReloading = true

  try {
    const data = await loadData(config.dataPath)
    if (unmounted) return

    // Only update UI if in list mode
    if (mode === "list") {
      items = data
      renderRows()
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    try {
      statusText.content = `Error: ${msg}`
    } catch { /* destroyed */ }
  } finally {
    isReloading = false  // MUST release — otherwise screen stops updating
  }
}
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

Expose TUI as a CLI command with zero dependencies (no commander needed):

```typescript
// cli/tui.ts — CLI command handler
import { existsSync } from 'fs'
import { resolve } from 'path'

export default async function tui(): Promise<void> {
  const args = process.argv.slice(3) // Skip 'node', 'cli.ts', 'tui'

  // Parse --data-dir flag
  let dataDir: string | undefined
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data-dir') {
      dataDir = args[i + 1]
      i++
    }
  }

  // Resolve directory: explicit > env > CWD default
  const resolvedDir = dataDir
    ? resolve(dataDir)
    : resolve(process.cwd(), '.app-data')

  // Validate directory exists
  if (!existsSync(resolvedDir)) {
    console.error(`Not found: ${resolvedDir}`)
    process.exit(1)
  }

  // Set env var BEFORE import — prod-main.ts reads it via createConfig()
  process.env.APP_DIR = resolvedDir

  // Dynamic import blocks until TUI exits (correct for terminal apps)
  await import('../tui/src/production/prod-main')
}
```

**Key:** The `await import()` blocks until the TUI process exits. This is correct — terminal apps should hold the process. The env var must be set *before* the import because `prod-main.ts` reads it at module scope via `createConfig()`.

### Data Integration

Centralize all paths through config (not scattered env var reads):

```typescript
// lib/app-config.ts
export interface AppConfig {
  dir: string
  planPath: string
  progressPath: string
  logsDir: string
}

export function createConfig(dir?: string): AppConfig {
  // 3-tier priority: explicit arg > env var > CWD default
  const base = dir ?? process.env.APP_DIR ?? `${process.cwd()}/.app-data`
  return {
    dir: base,
    planPath: `${base}/plan.json`,
    progressPath: `${base}/progress.md`,
    logsDir: `${base}/logs`,
  }
}

// Usage in prod-main.ts
const config = createConfig()
// Pass config to all screens — they NEVER read env vars directly
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

// @ts-expect-error OpenTUI timeline types don't include onUpdate callback
timeline.add(target, {
  value: 100,
  duration: 2000,
  ease: "inOutQuad",
  onUpdate: () => {
    progressBar.setProgress(target.value)
  },
})

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

**Cleanup & Memory:**
- [ ] All timers/intervals tracked in cleanupFns
- [ ] All event listeners removed on unmount
- [ ] All components have destroy() methods
- [ ] Guard all mutations with `if (destroyed) return`
- [ ] Memory leak tested (theme switching, screen switching)
- [ ] Watcher subscriptions cleaned up in unmount (`watcher.off()`)

**Type Safety:**
- [ ] No `as any` (use `@ts-expect-error` with comments)
- [ ] TypeScript strict mode passes
- [ ] `CliRenderer as RenderContext` cast centralized in main entry point

**File Watching:**
- [ ] All `fs.watch()` calls have `.on("error")` handler
- [ ] Debounce on watcher events (50ms minimum)
- [ ] Fallback polling for critical files (5s)
- [ ] Concurrency guard (`isReloading`) on all watcher-triggered reloads
- [ ] `unmounted` check after every `await` in reload functions

**UI Patterns:**
- [ ] Pool-based rendering for large lists
- [ ] File paths configurable via config object (not hardcoded)
- [ ] Error messages shown in UI (not just console)
- [ ] Theme-aware (uses `theme.*`, not hardcoded colors)
- [ ] Detail views check mode before reloading list data
- [ ] Footer hints update per mode (list vs detail)
- [ ] Tested with all themes
