# DevCoffee Explainer Video - Context & Handoff

**Last updated:** 2026-02-06
**Status:** In progress - iterating on visual quality
**Location:** `examples/devcoffee-maximus-buzzminson/`

---

## What This Is

A 60-second Remotion explainer video that demonstrates the value of the `devcoffee` plugin by visually explaining its two agents - **Maximus** (autonomous code review) and **Buzzminson** (feature implementation) - in layman's terms.

## Project Setup

```bash
cd examples/devcoffee-maximus-buzzminson
npm install
npm start     # Remotion Studio (preview)
npm run build # Render to out/video.mp4
```

**Tech stack:** Remotion 4.0.234, React 18, TypeScript, Tailwind CSS

## Video Structure (5 Acts, 1800 frames @ 30fps)

| Act | Time | Frames | Component(s) | Description |
|-----|------|--------|---------------|-------------|
| 1: The Problem | 0-10s | 0-300 | CodeEditor, IssueReveal, WarningParticles | Dev writes code, 4 hidden bugs revealed with particles |
| 2: Buzzminson | 10-25s | 300-750 | BuzzminstonIntro, WorkflowQuadrants (4 panels) | Moon+Bee intro, 4-quadrant workflow: Clarify → Implement → Review → Handoff |
| 3: Maximus | 25-45s | 750-1350 | MaximusIntro, SplitScreenDiff | Bold intro, split-screen before/after with 3 review rounds |
| 4: The Result | 45-55s | 1350-1650 | BeforeAfterComparison, TransformationEffect, ValueProposition | Metrics comparison (4 bugs→0, 127 lines→89), value statements |
| 5: CTA | 55-60s | 1650-1800 | CallToAction, GitHubReveal, QRCode, CoffeeSteam | GitHub URL, QR code, steam animation |

## Component Architecture

```
src/
├── compositions/Main.tsx              # Master composition with all 5 acts
├── components/
│   ├── Act1_Problem/
│   │   ├── CodeEditor.tsx             # Animated typing with syntax highlighting
│   │   ├── IssueReveal.tsx            # 4 issues in 2x2 grid with staggered reveal
│   │   └── WarningParticles.tsx       # Red/orange particles at issue positions
│   ├── Act2_Buzzminson/
│   │   ├── BuzzminstonIntro.tsx       # Moon 🌚 + Bee 🐝 merge animation
│   │   ├── WorkflowQuadrants.tsx      # 2x2 grid container with purple gradient
│   │   ├── ClarifyPanel.tsx           # ❓ → ✓ animation
│   │   ├── ImplementPanel.tsx         # Code blocks + progress bar
│   │   ├── ReviewPanel.tsx            # Spinning 🔄 + feedback bubble
│   │   └── HandoffPanel.tsx           # 🌚 → 🏃 → 💪 baton pass
│   ├── Act3_Maximus/
│   │   ├── MaximusIntro.tsx           # "MAXIMUS" with green energy pulse
│   │   ├── SplitScreenDiff.tsx        # Before/after code comparison
│   │   ├── IssueCallout.tsx           # Animated issue highlights
│   │   ├── ReviewRound.tsx            # Round status with counters
│   │   ├── SimplificationViz.tsx      # Code compression metrics
│   │   └── MetricsDisplay.tsx         # Animated counters
│   ├── Act4_Result/
│   │   ├── BeforeAfterComparison.tsx  # Side-by-side metrics
│   │   ├── TransformationEffect.tsx   # Morph animation
│   │   └── ValueProposition.tsx       # "Build faster", "Ship with confidence"
│   ├── Act5_CTA/
│   │   ├── CallToAction.tsx           # Main CTA container
│   │   ├── GitHubReveal.tsx           # Character-by-character URL typing
│   │   ├── QRCode.tsx                 # QR code fade-in (256x256)
│   │   └── CoffeeSteam.tsx            # Animated steam particles
│   └── shared/
│       ├── CodeBlock.tsx              # Syntax-highlighted code renderer
│       ├── Counter.tsx                # Animated number counter
│       ├── MetricCard.tsx             # Metric display card
│       ├── ParticleEmitter.tsx        # Reusable particle system
│       └── ProgressBar.tsx            # Animated progress bar
├── data/
│   ├── codeSnippets.ts                # Real code examples (before/after)
│   └── metrics.ts                     # Metric values for visualizations
├── utils/
│   └── syntaxHighlight.tsx            # VS Code dark theme token highlighter
├── index.tsx                          # Entry point (imports style.css)
├── Root.tsx                           # Remotion root with composition registration
└── style.css                          # Tailwind directives
```

## Color Palette

```typescript
// DevCoffee brand (in tailwind.config.js)
coffee: { 50: '#fdf8f6', 700: '#977669', 800: '#846358', 900: '#43302b' }

// Semantic colors
quality.error: '#ef4444'    // Red - bugs/issues
quality.warning: '#f59e0b'  // Orange - warnings
quality.success: '#10b981'  // Green - fixes/clean
quality.info: '#3b82f6'     // Blue - information

// Syntax highlighting (VS Code dark theme)
keyword: '#569CD6', string: '#CE9178', function: '#DCDCAA',
comment: '#6A9955', number: '#B5CEA8', type: '#4EC9B0'
```

## Key Design Decisions

### Scaling
- Went through multiple scaling iterations. Final approach uses **inline `style={{fontSize}}` for sizes beyond Tailwind's `text-9xl` (128px)**
- Quadrant panels (Act 2) settled at **1.6x base size** after testing 1x, 2x, and settling on 80% of 2x
- All other scenes use Tailwind classes with the scaling pass applied (titles `text-5xl`-`text-9xl`, body `text-3xl`-`text-6xl`)

### Syntax Highlighting
- Custom `syntaxHighlight.tsx` utility with regex-based token parsing
- Applied to CodeEditor (progressive highlighting as code types) and CodeBlock (static display)
- Matches VS Code dark theme exactly

### Feedback Bubble (ReviewPanel)
- Originally used `absolute` positioning which caused overlap with text
- Fixed to use **flex layout** with the spinning emoji and bubble side-by-side
- Bubble slides in from right with translateX animation

## Issues Fixed So Far

| # | Issue | Fix | Commit |
|---|-------|-----|--------|
| 1 | No syntax highlighting on code | Created `syntaxHighlight.tsx`, updated CodeEditor + CodeBlock | `d0f7d60` |
| 2 | Empty 5-10s (IssueReveal not rendering) | Fixed frame timing, added 2x2 grid with 4 issues | `d0f7d60` |
| 3 | Inconsistent scaling across scenes | Comprehensive pass on all 16 components | `3f3c2af` |
| 4 | Quadrant content too small vs background | Scaled up to 1.6x with inline fontSize styles | `4b45d4c` |
| 5 | Feedback bubble overlapping text | Changed from absolute to flex layout | `4b45d4c` |

## Known Areas for Improvement

See `docs/project/remotion-improvements.md` for the full backlog. Key items:

- Review remaining scenes for any scaling inconsistencies (Acts 3-5 haven't been reviewed as thoroughly as Act 2)
- Scene transitions could be smoother (currently hard cuts between acts)
- Audio/sound effects not yet added (optional enhancement)
- The video tells the story but individual scenes could have richer animations
- Consider whether 60s is the right length or if a tighter 45s cut would work better

## How to Continue

1. **Render and watch:** `npm run build && open out/video.mp4`
2. **Preview in Studio:** `npm start` (scrub through timeline for precise frame review)
3. **Edit components:** Each act has its own directory under `src/components/`
4. **Log improvements:** Add to `docs/project/remotion-improvements.md`
5. **Design spec:** Full original proposal at `docs/tmp/2026-02-04-devcoffee-explainer-proposal.md`
6. **Implementation docs:** `examples/devcoffee-maximus-buzzminson/IMPLEMENTATION.md`

## Important Patterns

- **Always use `flex` class on `<AbsoluteFill>`** when using `items-center`/`justify-center`
- **Import `style.css` in `index.tsx`** for Tailwind to work
- **Don't hardcode `setConcurrency`** in remotion.config.ts
- **Use `extrapolateRight: 'clamp'`** on all interpolate calls to prevent overshoot
- **Use `spring()` for organic motion**, `interpolate()` for precise timing
- **For sizes beyond `text-9xl`**, use inline `style={{fontSize: N}}`
