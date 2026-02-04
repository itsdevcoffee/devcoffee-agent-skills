# Dev Coffee Marketplace Explainer Video - Implementation

## Video Specifications
- **Duration:** 15 seconds (450 frames)
- **Frame Rate:** 30 fps
- **Resolution:** 1920x1080 (Full HD)
- **Style:** Coffee-themed with gradient backgrounds

## Component Architecture

### 1. TitleCard.tsx (0-3s, frames 0-90)
**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer/src/components/TitleCard.tsx`

**Features:**
- Fade-in animation using `interpolate()`
- Scale animation using `spring()` for natural bounce effect
- Rotating coffee cup emoji (☕) animation
- Coffee gradient background (coffee-900 to coffee-800)

**Timing:**
- Fade in: frames 0-15
- Spring scale: starts at frame 0
- Cup rotation: frames 0-60 (0° → -10° → 0°)

**Key Implementation:**
```typescript
const scale = spring({
  frame,
  fps,
  config: {
    damping: 100,
    stiffness: 200,
    mass: 0.5,
  },
});
```

### 2. PluginCard.tsx (Reusable Component)
**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer/src/components/PluginCard.tsx`

**Props:**
- `name`: Plugin name
- `features`: Array of feature strings
- `description`: Plugin description
- `direction`: 'left' or 'right' for slide animation

**Features:**
- Slide-in animation using `spring()` (direction-aware)
- Fade-in animation for the entire card
- Staggered fade-in for feature tags

**Usage:**

**Plugin 1 - devcoffee (3-6s, frames 90-180):**
- Slides in from left
- Features: "Maximus", "Buzzminson"
- Description: "Automated Code Review & Feature Implementation"

**Plugin 2 - remotion-max (6-9s, frames 180-270):**
- Slides in from right
- Features: "29+ Best Practices", "Intelligent Agents"
- Description: "Complete Remotion Toolkit"

### 3. FeatureList.tsx (9-12s, frames 270-360)
**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer/src/components/FeatureList.tsx`

**Features:**
- Staggered fade-in for each feature item (10-frame delay between items)
- Vertical slide animation (translateY)
- Three feature items with icons:
  - 🤖 Code review automation
  - ⚡ Component generation
  - 🚀 Project setup

**Timing:**
- Item 1: frames 0-15
- Item 2: frames 10-25
- Item 3: frames 20-35

### 4. CallToAction.tsx (12-15s, frames 360-450)
**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer/src/components/CallToAction.tsx`

**Features:**
- Fade-in and scale animation using `spring()`
- Animated steam effects above coffee cup (☕)
- Three-layer steam animation with staggered timing
- GitHub repository URL in monospace font

**Steam Animation:**
- 3 steam particles (~) with independent timing
- Each particle: translates up 30px while fading out
- Staggered start: 0, 10, 20 frames
- Creates continuous steam effect

### 5. Main.tsx (Composition)
**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer/src/compositions/Main.tsx`

**Structure:**
Uses `<Sequence>` components for precise timing control:

```typescript
<Sequence from={0} durationInFrames={90}>
  <TitleCard />
</Sequence>

<Sequence from={90} durationInFrames={90}>
  <PluginCard name="devcoffee" ... direction="left" />
</Sequence>

<Sequence from={180} durationInFrames={90}>
  <PluginCard name="remotion-max" ... direction="right" />
</Sequence>

<Sequence from={270} durationInFrames={90}>
  <FeatureList />
</Sequence>

<Sequence from={360} durationInFrames={90}>
  <CallToAction />
</Sequence>
```

## Animation Techniques

### Spring Animations
Used for natural, bouncy movements:
- Title card scale
- Plugin card slides
- CTA scale
- Config: damping: 100, stiffness: 200, mass: 0.5

### Interpolate Animations
Used for linear/custom easing:
- Fade-ins (opacity: 0 → 1)
- Translations (x, y positions)
- Rotations (cup rotation)
- Steam effects

### Staggered Animations
Used for sequential reveals:
- Feature tags in PluginCard (5-frame stagger)
- Feature list items (10-frame stagger)
- Steam particles (10-frame stagger)

## Color Palette (Tailwind Coffee Theme)

```javascript
coffee: {
  50: '#fdf8f6',   // Lightest - text
  100: '#f2e8e5',  // Light text
  200: '#eaddd7',  // Subtitle text
  600: '#a18072',  // Borders
  700: '#977669',  // Feature tags
  800: '#846358',  // Card backgrounds
  900: '#43302b',  // Dark gradient
}
```

## Running the Project

### Development
```bash
cd /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/examples/devcoffee-explainer
npm start
```

### Render Video
```bash
npm run build
# Outputs to: out/video.mp4
```

## Best Practices Followed

1. **TypeScript**: All components use proper type definitions
2. **Hooks Usage**: `useCurrentFrame()` and `useVideoConfig()` for frame-based animations
3. **Performance**: No re-renders, all animations calculated per frame
4. **Reusability**: PluginCard component accepts props for different plugins
5. **Timing Control**: `Sequence` components for precise scene timing
6. **Smooth Animations**: Combination of `spring()` and `interpolate()` for professional feel
7. **Extrapolation**: Uses `extrapolateRight: 'clamp'` to prevent animation overshoot
8. **Responsive Design**: Uses Tailwind utility classes for consistent styling

## Frame Timing Reference

| Scene | Start | End | Duration | Component |
|-------|-------|-----|----------|-----------|
| Title Card | 0 | 90 | 3s | TitleCard |
| Plugin 1 | 90 | 180 | 3s | PluginCard (devcoffee) |
| Plugin 2 | 180 | 270 | 3s | PluginCard (remotion-max) |
| Features | 270 | 360 | 3s | FeatureList |
| CTA | 360 | 450 | 3s | CallToAction |

**Total:** 450 frames = 15 seconds @ 30fps
