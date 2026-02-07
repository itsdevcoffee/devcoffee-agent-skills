# DevCoffee Speed Run Game

A 45-second retro gaming video showcasing the Buzzminson and Maximus agents in authentic 16-bit SNES/Genesis style.

## Overview

This Remotion project creates an epic arcade-style speed run video that demonstrates:
- **Buzzminson**: Iterative development through 4 platformer levels
- **Maximus**: Bug detection and code simplification through 3 shooter phases
- **Team Victory**: Collaborative success celebration

## Technical Highlights

- **100% CSS-based sprites** - No image assets needed, pure code
- **Authentic retro aesthetic** - CRT scanlines, pixel-perfect rendering, SNES color palette
- **Advanced Remotion techniques** - Nested sequences, spring physics, particle systems
- **Data-driven architecture** - All level layouts, enemy patterns, and scoring in data files

## Project Structure

```
src/
├── compositions/
│   └── GameMain.tsx           # Master timeline (1350 frames)
├── components/
│   ├── GameScene_01_InsertCoin/  # Intro screens (0-150 frames)
│   ├── GameScene_02_Buzzminson/  # Platformer levels (150-750 frames)
│   ├── GameScene_03_Maximus/     # Shooter phases (750-1200 frames)
│   ├── GameScene_04_Victory/     # Victory screen (1200-1350 frames)
│   ├── GameUI/                   # HUD, health bars, score counters
│   ├── RetroEffects/             # CRT, scanlines, transitions
│   └── shared/                   # Reusable components (copied from maximus-buzzminson)
├── data/
│   ├── gameData.ts            # Level layouts, enemy patterns, collectibles
│   ├── spriteData.ts          # Animation frame definitions
│   └── scoreData.ts           # Point values, combo multipliers
└── utils/
    └── retroColors.ts         # SNES color palette
```

## Video Timeline

### Scene 1: INSERT COIN (0-5s / 0-150 frames)
- Insert coin screen with blinking text
- Character select showing Buzzminson + Maximus team-up

### Scene 2: BUZZMINSON LEVELS (5-25s / 150-750 frames)
**Level 1: Clarify Zone** (5s)
- Side-scrolling platformer
- Collect 5 question marks
- Shows requirement gathering phase

**Level 2: Implementation Castle** (5s)
- Dynamic platform building
- Collect code blocks that create platforms
- Demonstrates incremental development

**Level 3: Review Arena** (5s)
- Combat code smell enemies
- Combo system with multipliers
- Shows code review process

**Level 4: Boss Handoff** (5s)
- Boss battle against "Monolith" (3 HP)
- Transition to Maximus
- Handoff animation

### Scene 3: MAXIMUS PHASES (25-40s / 750-1200 frames)
**Phase 1: Bug Detection** (5s)
- Top-down shooter
- Shoot 8 bugs with different movement patterns
- Straight, zigzag, and circle patterns

**Phase 2: Simplification** (5s)
- Break complexity barriers (3 HP each)
- Collect simplification power-ups
- Visual feedback for code cleanup

**Phase 3: Final Cleanup** (5s)
- Boss bug battle (10 HP)
- Intense shooting sequence
- Victory explosion

### Scene 4: VICTORY SCREEN (40-45s / 1200-1350 frames)
- "FLAWLESS VICTORY" banner with zoom
- Score tally with animated counters
- High score entry with typing effect
- Final celebration

## Scripts

```bash
# Start Remotion Studio for development
npm start

# Render final video
npm run build

# Upgrade Remotion to latest version
npm run upgrade
```

## Features

### Retro Visual Effects
- **CRT Scanlines**: Authentic tube TV look with persistent overlay
- **Pixel-Perfect Rendering**: CSS-based `image-rendering: pixelated`
- **Retro Colors**: SNES/Genesis era color palette
- **Screen Shake**: Impact effects on hits and explosions
- **Glow Effects**: CSS drop-shadows for power-ups and special effects

### Animation Techniques
- **Spring Physics**: Natural bounce and zoom effects
- **Frame-Based Interpolation**: Smooth movement along paths
- **Staggered Sequences**: Cascading entrances for UI elements
- **Particle Systems**: Explosions, celebrations, and collectibles

### Game Mechanics (Simulated)
- **Combo System**: Multipliers for consecutive actions
- **Health Tracking**: Visual health bars for player and bosses
- **Score Tallying**: Real-time score display with counters
- **Power-Ups**: Visual feedback for simplification boosts

## CSS Sprite Technique

All game sprites are created using pure CSS divs positioned on a pixel grid. Example:

```tsx
// 32x32 pixel character sprite
<div className="pixel-perfect" style={{width: 32, height: 32}}>
  {/* Head */}
  <div style={{top: 4, left: 12, width: 8, height: 8, backgroundColor: color}} />
  {/* Body */}
  <div style={{top: 12, left: 10, width: 12, height: 8, backgroundColor: color}} />
  {/* Arms & Legs - animated with transforms */}
</div>
```

This approach:
- ✅ No external assets needed
- ✅ Fully customizable colors
- ✅ Easy to animate with CSS transforms
- ✅ Small file size
- ✅ Scales perfectly at any resolution

## Performance Optimizations

1. **Particle Limits**: Max 50 particles per emitter
2. **React.memo**: Wrapped static components (platforms, etc.)
3. **Conditional Rendering**: Early returns for off-screen elements
4. **CSS Transforms**: GPU-accelerated positioning
5. **Pre-calculated Data**: Movement paths stored in data files

## Customization

### Changing Colors
Edit `src/utils/retroColors.ts` to update the color palette.

### Adjusting Difficulty/Timing
Modify values in `src/data/gameData.ts`:
- Platform positions
- Enemy patrol paths
- Collectible locations
- Boss HP values

### Score Values
Update `src/data/scoreData.ts` to change point values and combo multipliers.

### Animation Speed
Adjust frame rates in `src/data/spriteData.ts` for faster/slower animations.

## Technical Requirements

- Node.js 18+
- npm 9+
- Modern browser with CSS Grid support
- 4GB+ RAM for smooth preview

## Render Settings

**Preview Quality** (Fast):
```bash
npm start
```

**Production Quality** (Slow):
```bash
npm run build
```

Output: `out/video.mp4`
- Resolution: 1920x1080
- Frame Rate: 30fps
- Duration: 45 seconds (1350 frames)
- Codec: H.264

## Credits

Built with:
- [Remotion](https://remotion.dev) - Video in React
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- Pure CSS sprites - No external assets

Created for the DevCoffee Agent Skills plugin demonstration.

## License

MIT
