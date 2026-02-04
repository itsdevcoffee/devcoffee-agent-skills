# Remotion Max

Complete toolkit for [Remotion](https://remotion.dev) video creation in React - combining best practices, intelligent agents, and automation.

## What's Included

### 📚 Comprehensive Skill

29+ detailed guides covering every aspect of Remotion:
- Animations, timing, and interpolation
- Audio integration and synchronization
- Video and image handling
- Captions and subtitles (SRT, TikTok-style)
- 3D content with Three.js
- Lottie animations
- Charts and data visualization
- Font loading and text animations
- Tailwind CSS integration
- Scene transitions and sequencing
- And much more!

### 🤖 Intelligent Agents

**remotion-builder**: Generates Remotion components and animations
- Creates properly typed TypeScript components
- Follows best practices from the skill
- Implements timing and interpolation correctly
- Includes usage documentation

**remotion-setup**: Initializes and configures Remotion projects
- Sets up new projects from scratch
- Adds Remotion to existing React apps
- Configures TypeScript, Tailwind, and other tools
- Creates proper directory structure

### ⚡ Commands

**`/remotion-max:builder`** - Generate components interactively
```bash
/remotion-max:builder text-reveal
/remotion-max:builder video-composition
/remotion-max:builder --output src/components/MyAnimation.tsx
```

**`/remotion-max:setup`** - Initialize projects
```bash
/remotion-max:setup --new-project my-video
/remotion-max:setup --add-to-existing
```

## Installation

```bash
# Add marketplace (if you haven't already)
/plugin marketplace add maskkiller/devcoffee-agent-skills

# Install remotion-max
/plugin install remotion-max@devcoffee-agent-skills
```

## Usage

### Automatic Skill Loading

The `remotion-best-practices` skill loads automatically when you discuss Remotion:

```
You: "How do I create smooth animations in Remotion?"
Claude: [References best practices skill and provides patterns]
```

### Generate Components

Use the builder command or agent:

```bash
# Via command
/remotion-max:builder

# Via natural language
"Use remotion-builder to create a text reveal animation"
```

### Set Up Projects

```bash
# Interactive setup
/remotion-max:setup

# Quick new project
/remotion-max:setup --new-project social-video

# Add to existing project
/remotion-max:setup --add-to-existing
```

## Agent Triggers

Agents activate automatically when you:

**remotion-builder**:
- "Create a Remotion component"
- "Build a video animation"
- "Generate Remotion code"
- Working on Remotion and need components

**remotion-setup**:
- "Set up Remotion"
- "Initialize a Remotion project"
- "Add Remotion to my project"
- Need project configuration help

## License

MIT

---

**Part of the [Dev Coffee Marketplace](https://github.com/maskkiller/devcoffee-agent-skills)** ☕
