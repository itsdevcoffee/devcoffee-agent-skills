#!/bin/bash
# Fix repository to be a proper Claude Code marketplace

set -e

echo "🔧 Fixing devcoffee-agent-skills marketplace structure..."
echo ""

cd "$(dirname "$0")"

# 1. Create .claude-plugin directory
echo "📁 Creating .claude-plugin directory..."
mkdir -p .claude-plugin

# 2. Move marketplace.json if it exists at root
if [ -f "marketplace.json" ]; then
    echo "📦 Moving marketplace.json to .claude-plugin/..."
    mv marketplace.json .claude-plugin/marketplace.json
fi

# 3. Create correct marketplace.json
echo "📝 Creating correct marketplace.json..."
cat > .claude-plugin/marketplace.json << 'EOF'
{
  "name": "devcoffee-marketplace",
  "owner": {
    "name": "Dev Coffee",
    "url": "https://github.com/maskkiller"
  },
  "metadata": {
    "description": "Productivity tools and automation workflows for Claude Code focused on code quality and development efficiency"
  },
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee",
      "description": "Automated code review cycles with maximus - runs code-reviewer in a loop until clean, then finishes with code-simplifier",
      "version": "0.1.0",
      "author": {
        "name": "Dev Coffee",
        "url": "https://github.com/maskkiller"
      },
      "repository": "https://github.com/maskkiller/devcoffee-agent-skills",
      "keywords": ["code-quality", "review", "automation", "productivity"],
      "license": "MIT"
    }
  ]
}
EOF

echo ""
echo "✅ Structure fixed!"
echo ""
echo "📋 New structure:"
tree -L 2 -a .claude-plugin/ devcoffee/.claude-plugin/ 2>/dev/null || {
    echo ".claude-plugin/"
    echo "└── marketplace.json"
    echo ""
    echo "devcoffee/"
    echo "├── .claude-plugin/"
    echo "│   └── plugin.json"
    echo "├── commands/"
    echo "└── agents/"
}
echo ""
echo "🧪 Validating..."
claude plugin validate . || echo "⚠️  Validation check - review output above"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Clean up old registrations:"
echo "   - Remove 'devcoffee' and 'devcoffee@local' from ~/.claude/settings.json"
echo "   - Remove from ~/.claude/plugins/installed_plugins.json"
echo ""
echo "2. Register marketplace:"
echo "   claude"
echo "   > /plugin marketplace add $(pwd)"
echo ""
echo "3. Install plugin:"
echo "   > /plugin install devcoffee@devcoffee-marketplace"
echo ""
echo "4. Test command:"
echo "   > /devcoffee:maximus"
echo ""
echo "🚀 Or run: ./install-from-marketplace.sh"
echo ""
