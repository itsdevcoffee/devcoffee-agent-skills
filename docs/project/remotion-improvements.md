# Remotion Skills - Improvements & Backlog

Tracking improvements, fixes, and feature ideas for the remotion-max plugin and example video projects.

## Legend

- **Status:** `open` | `in-progress` | `done` | `wontfix`
- **Priority:** `P0` (critical) | `P1` (important) | `P2` (nice-to-have) | `P3` (someday)
- **Type:** `fix` | `feature` | `improvement` | `research`

---

## Explainer Video (`examples/devcoffee-maximus-buzzminson/`)

### Done

| # | Type | Priority | Description | Status |
|---|------|----------|-------------|--------|
| 1 | fix | P0 | Add syntax highlighting to CodeEditor and CodeBlock | done |
| 2 | fix | P0 | Fix empty animation gap at 5-10s (IssueReveal not rendering) | done |
| 3 | fix | P1 | Consistent scaling across all scenes (text/icons too small) | done |
| 4 | fix | P1 | Quadrant panels content too small relative to background | done |

### Open

| # | Type | Priority | Description | Status |
|---|------|----------|-------------|--------|
| | | | | |

---

## Remotion-Max Plugin (`remotion-max/`)

### Done

| # | Type | Priority | Description | Status |
|---|------|----------|-------------|--------|
| 1 | fix | P0 | Missing CSS import in remotion-setup entry point template | done |
| 2 | fix | P0 | Missing `flex` class on AbsoluteFill in remotion-builder | done |
| 3 | fix | P0 | Hardcoded setConcurrency(50) in remotion.config.ts | done |

### Open

| # | Type | Priority | Description | Status |
|---|------|----------|-------------|--------|
| 1 | feature | P1 | Create remotion-debugger agent for diagnosing issues | open |
| 2 | improvement | P1 | Expand remotion-builder system prompt (600 → 1500+ words) | open |
| 3 | improvement | P1 | Expand remotion-setup system prompt (195 → 300+ lines) | open |
| 4 | improvement | P1 | Add automated build verification to agents | open |
| 5 | feature | P2 | Add tailwind-remotion-integration.md skill rule | open |
| 6 | feature | P2 | Add troubleshooting.md skill rule | open |
| 7 | feature | P2 | Add tested component template library | open |
| 8 | research | P3 | Visual regression testing for rendered videos | open |

---

## Notes

- See `docs/tmp/2026-02-04-remotion-max-real-world-test-lessons.md` for detailed P0 fix context
- See `docs/tmp/2026-02-04-devcoffee-explainer-proposal.md` for video design spec
- See `examples/devcoffee-maximus-buzzminson/IMPLEMENTATION.md` for video architecture
