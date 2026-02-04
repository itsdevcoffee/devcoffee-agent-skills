# DevCoffee Maximus & Buzzminson Explainer Video

A 60-second advanced Remotion explainer video showcasing Maximus and Buzzminson agents through visual storytelling.

![Duration: 60s](https://img.shields.io/badge/Duration-60s-blue)
![Resolution: 1920x1080](https://img.shields.io/badge/Resolution-1920x1080-green)
![FPS: 30](https://img.shields.io/badge/FPS-30-orange)

## Quick Start

```bash
# Install dependencies
npm install

# Start Remotion Studio
npm start

# Render video
npm run build
```

## What's Inside

This video demonstrates 5 acts in 60 seconds:

1. **The Problem (0-10s)** - Developer writes code, but 4 hidden issues lurk
2. **Buzzminson (10-25s)** - Implementation partner with 4-phase workflow
3. **Maximus (25-45s)** - Autonomous quality with 3-round review cycle
4. **The Result (45-55s)** - Before/after transformation with metrics
5. **Call to Action (55-60s)** - GitHub URL and QR code

## Advanced Techniques

- Particle systems for warnings and celebrations
- Split-screen code diffs with syntax highlighting
- Animated counters with spring physics
- Character-by-character typing effects
- 4-quadrant workflow visualization
- Real code examples showing bugs → fixes

## Project Structure

```
src/
├── compositions/Main.tsx          # Main 60s composition
├── components/
│   ├── Act1_Problem/              # 0-10s: The problem
│   ├── Act2_Buzzminson/           # 10-25s: Buzzminson workflow
│   ├── Act3_Maximus/              # 25-45s: Maximus review cycle
│   ├── Act4_Result/               # 45-55s: Results & value
│   ├── Act5_CTA/                  # 55-60s: Call to action
│   └── shared/                    # Reusable components
├── data/                          # Code snippets & metrics
└── style.css                      # Tailwind styles
```

## Key Features

- Real code snippets showing actual bugs and fixes
- Animated metrics: 4 bugs → 0, 127 lines → 89, complexity 8 → 2
- Particle effects for dramatic emphasis
- Split-screen before/after comparisons
- TypeScript throughout for type safety
- Fully customizable (colors, timing, content)

## Documentation

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for:
- Detailed act-by-act breakdown
- Component architecture
- Animation techniques
- Customization guide
- Performance optimization tips
- Troubleshooting

## Tech Stack

- [Remotion](https://remotion.dev) - Video creation framework
- [React](https://react.dev) - UI library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://typescriptlang.org) - Type safety

## Rendering Options

**Fast render (for preview):**
```bash
npx remotion render src/index.tsx Main out/video.mp4 --concurrency 8
```

**High quality (for production):**
```bash
npx remotion render src/index.tsx Main out/video.mp4 --codec prores --quality 100
```

## Customization

Edit these files to customize:

- `src/data/codeSnippets.ts` - Change code examples
- `src/data/metrics.ts` - Update metrics and values
- `tailwind.config.js` - Modify colors and styles
- `src/compositions/Main.tsx` - Adjust timing and sequences

## License

MIT - See LICENSE for details

## Credits

Created for DevCoffee Agent Skills marketplace to showcase Maximus (autonomous code quality) and Buzzminson (implementation partner) agents.
