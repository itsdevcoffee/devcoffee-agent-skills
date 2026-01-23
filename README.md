# Dev Coffee Agent Skills

A marketplace of productivity tools and automation workflows for Claude Code focused on code quality and development efficiency.

## Installation

Users can install plugins from this marketplace:

```bash
# Install the entire marketplace
/marketplace add https://github.com/maskkiller/devcoffee-agent-skills

# Install specific plugins
/plugin install devcoffee
```

## Available Plugins

### devcoffee

Automated code review cycles with the **maximus** command/agent.

**Features:**
- Autonomous review-fix-simplify cycles
- Detects uncommitted changes or unpushed commits
- Runs code-reviewer in a loop until clean
- Finishes with code-simplifier for final polish
- Formatted summary tables

**Commands:**
- `/devcoffee:maximus` - Run full review cycle

**Agents:**
- `@devcoffee:maximus` - Spawn as subagent

**Dependencies:**
- `feature-dev` plugin (code-reviewer agent)
- `code-simplifier` plugin

[View devcoffee documentation →](./devcoffee/README.md)

## Development

### Adding New Plugins

1. Create plugin directory: `mkdir my-plugin`
2. Add plugin structure:
   ```
   my-plugin/
   ├── .claude-plugin/
   │   └── plugin.json
   ├── commands/
   ├── agents/
   └── README.md
   ```
3. Update `marketplace.json` with new plugin entry
4. Commit and push

### Testing Locally

```bash
# Test a specific plugin
claude --plugin-dir /path/to/devcoffee-agent-skills/devcoffee

# Test the whole marketplace
/marketplace add file:///path/to/devcoffee-agent-skills
```

## License

MIT - See individual plugin directories for details

## Author

Dev Coffee
- GitHub: [@maskkiller](https://github.com/maskkiller)
