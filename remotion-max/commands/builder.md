---
description: Generate Remotion video components and animations following best practices
argument-hint: [component-type] [--output path]
tools: Task, Read, Write, Edit, Grep, Glob, Bash, AskUserQuestion
---

# Remotion Builder Command

Generates Remotion components, animations, and video compositions following best practices from the `remotion-best-practices` skill.

## Usage

```bash
# Interactive mode - asks what to build
/remotion-max:builder

# Generate specific component type
/remotion-max:builder text-reveal
/remotion-max:builder fade-transition
/remotion-max:builder video-composition

# Specify output path
/remotion-max:builder --output src/components/MyAnimation.tsx
```

## What This Command Does

1. **Understands the request**: Asks clarifying questions about what you want to build
2. **References best practices**: Consults the `remotion-best-practices` skill for patterns
3. **Generates code**: Creates properly typed TypeScript components
4. **Explains implementation**: Documents timing decisions and usage
5. **Suggests next steps**: How to register and use the component

## Common Component Types

### Animations
- `text-reveal` - Animated text reveals
- `fade-in` - Fade in transitions
- `slide-in` - Slide transitions
- `scale-animation` - Scale effects
- `rotation` - Rotation animations

### Media Components
- `video-player` - Video with controls (trim, speed, volume)
- `audio-sync` - Audio-synchronized animations
- `image-sequence` - Image sequences
- `caption-display` - Caption overlays

### Compositions
- `video-composition` - Full video composition structure
- `scene-sequence` - Multi-scene setup
- `dynamic-composition` - With calculateMetadata

## Examples

### Text Reveal Animation
```bash
/remotion-max:builder text-reveal
```

Generates:
```typescript
import {useCurrentFrame, interpolate, spring} from 'remotion';

export const TextReveal: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = spring({
    frame,
    fps: 30,
    config: {damping: 200}
  });

  return <div style={{opacity}}>{text}</div>;
};
```

### Video Composition
```bash
/remotion-max:builder video-composition
```

Generates complete composition with:
- Intro scene
- Main content
- Outro scene
- Transitions between scenes

## Configuration Options

The command will ask about:
- **Duration**: How long should the animation be?
- **FPS**: Frame rate (default: 30)
- **Dimensions**: Video size (default: 1920x1080)
- **Styling**: Tailwind CSS or inline styles?
- **Assets**: Any media files to include?

## Output

Creates:
- TypeScript component file
- Usage documentation
- Registration code for Root.tsx
- Example props

## Integration with remotion-best-practices

This command automatically:
- ✅ References appropriate rule files from the skill
- ✅ Uses recommended patterns and APIs
- ✅ Follows timing best practices
- ✅ Implements type-safe code
- ✅ Includes performance optimizations

## Tips

- Run in your Remotion project directory
- Have your composition structure ready
- Know your video requirements (duration, size)
- Check existing components first to avoid duplicates

## Next Steps After Generation

1. Review the generated code
2. Add component to Root.tsx
3. Test in Remotion Studio (`npm start`)
4. Adjust timing/styling as needed
5. Render the video (`npm run build`)

---

**Pro tip**: Use `/remotion-max:builder --interactive` to get guided prompts for all configuration options.
