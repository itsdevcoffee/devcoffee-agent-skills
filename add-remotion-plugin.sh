#!/bin/bash
# Add remotion-best-practices plugin to devcoffee marketplace

set -e

REMOTION_SOURCE="/home/maskkiller/projects/remotion-skill"
DEVCOFFEE_REPO="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills"

cd "$DEVCOFFEE_REPO"

echo "🎬 Adding remotion-best-practices plugin to devcoffee marketplace..."
echo ""

# 1. Create plugin structure
echo "📁 Creating plugin structure..."
mkdir -p remotion-best-practices/.claude-plugin
mkdir -p remotion-best-practices/skills

# 2. Create plugin.json
echo "📝 Creating plugin.json..."
cat > remotion-best-practices/.claude-plugin/plugin.json << 'EOF'
{
  "name": "remotion-best-practices",
  "version": "1.0.0",
  "description": "Comprehensive best practices and patterns for Remotion video creation in React",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/maskkiller"
  },
  "keywords": ["remotion", "video", "react", "animation", "composition"],
  "license": "MIT"
}
EOF

# 3. Copy skill files
echo "📦 Copying skill files..."
if [ -d "$REMOTION_SOURCE/.agents/skills/remotion-best-practices" ]; then
    cp -r "$REMOTION_SOURCE/.agents/skills/remotion-best-practices" remotion-best-practices/skills/
    echo "   ✓ Copied remotion-best-practices skill"
else
    echo "   ✗ Source skill not found at $REMOTION_SOURCE/.agents/skills/remotion-best-practices"
    exit 1
fi

# 4. Create plugin README
echo "📄 Creating plugin README..."
cat > remotion-best-practices/README.md << 'EOF'
# Remotion Best Practices

Comprehensive best practices, patterns, and code examples for [Remotion](https://remotion.dev) - video creation in React.

## What's Included

A comprehensive skill with 25+ rule files covering:

- **Animations** - Timing, interpolation, spring physics
- **Audio** - Import, trim, volume, speed, pitch control
- **Compositions** - Defining and organizing video compositions
- **Captions** - SRT import, display, TikTok-style word highlighting
- **Charts** - Data visualization patterns
- **Fonts** - Google Fonts and local font loading
- **Images & Videos** - Embedding and controlling media
- **Lottie** - Animated vector graphics
- **3D Content** - Three.js and React Three Fiber integration
- **Tailwind CSS** - Styling with utility classes
- **Text Animations** - Typography effects
- **Transitions** - Scene transitions
- **And much more!**

## Installation

This plugin is part of the Dev Coffee marketplace:

```bash
# If you haven't already
/plugin marketplace add maskkiller/devcoffee-agent-skills

# Install this plugin
/plugin install remotion-best-practices@devcoffee-agent-skills
```

## Usage

The `remotion-best-practices` skill is automatically available when you work with Remotion code. Claude will:

- Reference best practices when you ask about Remotion
- Provide code examples from the rules
- Guide you on proper patterns and techniques

### Manual Invocation

You can also explicitly use the skill:

```
"Use the remotion-best-practices skill to help me create an animated video composition"
"Show me Remotion best practices for audio synchronization"
```

## Skill Contents

The skill includes detailed guides for:

- `rules/3d.md` - 3D content with Three.js
- `rules/animations.md` - Animation fundamentals
- `rules/assets.md` - Asset management
- `rules/audio.md` - Audio integration
- `rules/calculate-metadata.md` - Dynamic metadata
- `rules/charts.md` - Data visualization
- `rules/compositions.md` - Composition structure
- `rules/display-captions.md` - Caption display
- `rules/fonts.md` - Font loading
- `rules/gifs.md` - GIF integration
- `rules/images.md` - Image handling
- `rules/lottie.md` - Lottie animations
- `rules/sequencing.md` - Timing sequences
- `rules/tailwind.md` - Tailwind CSS usage
- `rules/text-animations.md` - Text effects
- `rules/timing.md` - Interpolation curves
- `rules/transitions.md` - Scene transitions
- `rules/videos.md` - Video embedding
- And more!

## When to Use

- Building Remotion video projects
- Creating animations in React
- Working with programmatic video generation
- Implementing dynamic video compositions
- Learning Remotion patterns and best practices

## License

MIT
EOF

# 5. Update marketplace.json
echo "⚙️  Updating marketplace.json..."
jq '.plugins += [{
  "name": "remotion-best-practices",
  "source": "./remotion-best-practices",
  "description": "Comprehensive best practices and patterns for Remotion video creation in React",
  "version": "1.0.0",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/maskkiller"
  },
  "keywords": ["remotion", "video", "react", "animation", "composition"],
  "category": "Development Tools",
  "license": "MIT"
}]' .claude-plugin/marketplace.json > /tmp/marketplace.json

mv /tmp/marketplace.json .claude-plugin/marketplace.json

echo ""
echo "✅ Plugin added successfully!"
echo ""
echo "📋 New structure:"
tree -L 2 remotion-best-practices/ 2>/dev/null || {
    echo "remotion-best-practices/"
    echo "├── .claude-plugin/"
    echo "│   └── plugin.json"
    echo "├── skills/"
    echo "│   └── remotion-best-practices/"
    echo "└── README.md"
}
echo ""
echo "🧪 Next steps:"
echo ""
echo "1. Review the changes:"
echo "   git status"
echo ""
echo "2. Test locally:"
echo "   /plugin marketplace update devcoffee-agent-skills"
echo "   /plugin install remotion-best-practices@devcoffee-agent-skills"
echo ""
echo "3. Commit and push:"
echo "   git add remotion-best-practices/"
echo "   git add .claude-plugin/marketplace.json"
echo "   git commit -m 'feat: add remotion-best-practices plugin'"
echo "   git push"
echo ""
