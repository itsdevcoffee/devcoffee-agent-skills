/**
 * Scrollable List Component - Production Example
 *
 * Pool-based rendering for efficient scrolling through large datasets.
 * Pattern used in: agent-output, failures, plan-viewer screens.
 */

import { BoxRenderable, TextRenderable } from "@opentui/core"
import type { RenderContext, KeyEvent } from "@opentui/core"

export interface ScrollableListHandle {
  container: BoxRenderable
  setData(items: string[]): void
  handleKey(keyName: string): boolean
  destroy(): void
}

export function createScrollableList(
  ctx: RenderContext,
  opts: {
    id: string
    maxVisible: number
    theme: any  // Theme object
  }
): ScrollableListHandle {
  let destroyed = false
  let items: string[] = []
  let selectedIndex = -1  // -1 = no selection
  let scrollOffset = 0    // 0 = bottom (live), positive = scrolled up

  // Fixed pool of rows
  const rows: TextRenderable[] = []
  for (let i = 0; i < opts.maxVisible; i++) {
    rows.push(new TextRenderable(ctx, {
      id: `${opts.id}-row-${i}`,
      content: "",
      fg: opts.theme.text.secondary,
    }))
  }

  const container = new BoxRenderable(ctx, {
    id: opts.id,
    width: "100%",
    flexGrow: 1,
    flexDirection: "column",
    border: true,
    borderColor: opts.theme.surface.border,
  })

  rows.forEach(row => container.add(row))

  function renderRows() {
    if (destroyed) return

    const total = items.length
    const endIdx = Math.max(0, total - scrollOffset)
    const startIdx = Math.max(0, endIdx - opts.maxVisible)

    try {
      for (let i = 0; i < opts.maxVisible; i++) {
        const itemIdx = startIdx + i
        if (itemIdx < endIdx) {
          const isSelected = itemIdx === selectedIndex
          const prefix = isSelected ? "▸ " : "  "
          rows[i].content = prefix + items[itemIdx]
          rows[i].fg = isSelected
            ? opts.theme.interactive.highlight
            : opts.theme.text.primary
        } else {
          rows[i].content = ""
        }
      }
    } catch {
      // Renderables destroyed
    }
  }

  function setData(newItems: string[]) {
    items = newItems
    renderRows()
  }

  function handleKey(keyName: string): boolean {
    if (destroyed) return false

    switch (keyName) {
      case "down":
        if (selectedIndex === -1) {
          selectedIndex = 0
        } else if (selectedIndex < items.length - 1) {
          selectedIndex++
        }
        renderRows()
        return true

      case "up":
        if (selectedIndex === -1) {
          selectedIndex = items.length - 1
        } else if (selectedIndex > 0) {
          selectedIndex--
        }
        renderRows()
        return true

      case "f":
        // Jump to bottom (live mode)
        scrollOffset = 0
        renderRows()
        return true

      default:
        return false
    }
  }

  function destroy() {
    destroyed = true
  }

  return { container, setData, handleKey, destroy }
}
