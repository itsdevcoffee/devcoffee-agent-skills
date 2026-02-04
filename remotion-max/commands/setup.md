---
description: Initialize or configure a Remotion project with proper structure and dependencies
argument-hint: [--new-project name] [--add-to-existing]
tools: Bash, Read, Write, Edit, AskUserQuestion
---

# Remotion Setup Command

Initializes a new Remotion project or adds Remotion to an existing React project with proper configuration.

## Usage

```bash
# Create new Remotion project (interactive)
/remotion-max:setup

# Create new project with specific name
/remotion-max:setup --new-project my-video

# Add Remotion to existing project
/remotion-max:setup --add-to-existing

# Quick setup with defaults
/remotion-max:setup --quick
```

## What This Command Does

### For New Projects

1. **Checks environment**: Verifies Node.js and npm versions
2. **Creates project**: Runs `npm init video` or equivalent
3. **Configures tooling**: Sets up TypeScript, ESLint
4. **Installs extras**: Optional packages (Tailwind, Three.js, Lottie)
5. **Sets up structure**: Creates recommended directories

### For Existing Projects

1. **Installs Remotion**: Adds core packages
2. **Adds scripts**: Updates package.json
3. **Creates Root.tsx**: Sets up composition registry
4. **Configures remotion.config.ts**: Basic configuration
5. **Updates tsconfig**: TypeScript settings

## Project Structure Created

```
my-video/
├── src/
│   ├── Root.tsx              # Composition registry
│   ├── compositions/         # Video compositions
│   │   └── Main.tsx
│   ├── components/           # Reusable components
│   ├── utils/               # Helper functions
│   └── assets/              # Media files
│       ├── images/
│       ├── videos/
│       └── audio/
├── public/
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

## Optional Packages

The command can install:

**Essential:**
- `remotion` - Core library
- `@remotion/cli` - Command-line tools
- `react` and `react-dom` - React

**Media:**
- `@remotion/media-utils` - Audio/video utilities
- `@remotion/captions` - Subtitle support

**3D & Animation:**
- `@remotion/three` - Three.js integration
- `@remotion/lottie` - Lottie animations

**Styling:**
- `tailwindcss` - Utility CSS
- `autoprefixer` and `postcss` - CSS processing

**Cloud:**
- `@remotion/lambda` - AWS Lambda rendering

## Configuration Files

### package.json Scripts
```json
{
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render Main out/video.mp4",
    "upgrade": "remotion upgrade",
    "server": "remotion server"
  }
}
```

### remotion.config.ts
```typescript
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(50);
Config.setCodec('h264');
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true
  }
}
```

## Interactive Setup Flow

When run without flags, the command asks:

1. **New or existing project?**
   - Create new
   - Add to existing

2. **Project name?**
   - For new projects

3. **Additional packages?**
   - Tailwind CSS
   - Three.js
   - Lottie
   - Captions

4. **Video defaults?**
   - Resolution (1920x1080, 1280x720, etc.)
   - FPS (30, 60)
   - Duration

## Verification Steps

After setup completes:

1. ✅ Dependencies installed
2. ✅ Scripts available
3. ✅ TypeScript configured
4. ✅ Studio runs: `npm start`
5. ✅ Can render: `npm run build`

## Examples

### New Project with Tailwind
```bash
/remotion-max:setup --new-project social-media-video

# When prompted:
# - Add Tailwind CSS? Yes
# - Add Three.js? No
# - Resolution? 1080x1920 (vertical)
# - FPS? 30
```

### Add to Existing Next.js Project
```bash
/remotion-max:setup --add-to-existing

# Detects Next.js, configures:
# - Adds Remotion packages
# - Creates src/remotion/ directory
# - Updates tsconfig
# - Adds separate Remotion scripts
```

## Troubleshooting

The command handles:
- ❌ Node version too old → Suggests upgrade
- ❌ Port conflict → Uses alternative port
- ❌ TypeScript errors → Fixes tsconfig
- ❌ Missing dependencies → Installs automatically

## After Setup

Run these to verify:
```bash
npm start              # Opens Remotion Studio
npm run build          # Renders test video
```

Then you can:
1. Explore the studio UI
2. Modify compositions
3. Add your own components
4. Start building your video!

---

**Pro tip**: Use `/remotion-max:setup --quick` for instant setup with sensible defaults (1920x1080, 30fps, TypeScript, no extras).
