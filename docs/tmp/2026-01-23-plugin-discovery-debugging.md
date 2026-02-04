# Plugin Discovery Debugging Session

## Issue
The devcoffee plugin was registered and showed as enabled in `claude plugin list`, but commands and agents were not appearing in autocomplete or being discoverable in Claude sessions.

## Root Causes Identified

### 1. Invalid plugin.json Schema
**Problem**: The `repository` field was an object instead of a string.

```json
// WRONG
"repository": {
  "type": "git",
  "url": "https://github.com/maskkiller/devcoffee-agent-skills"
}

// CORRECT
"repository": "https://github.com/maskkiller/devcoffee-agent-skills"
```

**Fix**: Changed repository to a string value.

**Validation**: Run `claude plugin validate /path/to/plugin` to check for schema errors.

### 2. Command Frontmatter Issues
**Problem**: Commands had incorrect frontmatter fields.

```yaml
# WRONG
---
name: maximus
description: ...
allowed-tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion
---

# CORRECT
---
description: ...
tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion
---
```

**Key differences**:
- Commands should NOT have a `name` field (the filename becomes the command name)
- Use `tools` not `allowed-tools` in frontmatter

### 3. Plugin Component Structure

Correct structure verified from working plugins (e.g., feature-dev):

```
devcoffee/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── agents/
│   └── maximus.md          # Agent definitions (filename = agent name)
├── commands/
│   └── maximus.md          # Slash commands (filename = command name)
├── README.md
└── LICENSE
```

**Agent frontmatter** (from code-reviewer.md):
```yaml
---
name: code-reviewer           # Required: agent name
description: ...              # Required: trigger description
tools: Glob, Grep, Read, ...  # Optional: tool allowlist
model: sonnet                 # Optional: inherit/sonnet/opus/haiku
color: red                    # Optional: terminal color
---
```

**Command frontmatter** (from feature-dev.md):
```yaml
---
description: ...              # Required: command description
argument-hint: ...            # Optional: argument format hint
tools: Task, Read, Edit, ...  # Optional: tool allowlist
---
```

## Plugin Loading Mechanism

### Discovery Process
1. Claude Code reads `~/.claude/plugins/installed_plugins.json`
2. For each enabled plugin, it loads from `installPath`
3. Reads `.claude-plugin/plugin.json` for metadata
4. Auto-discovers components in standard directories:
   - `commands/*.md` → Slash commands
   - `agents/*.md` → Agent definitions
   - `skills/*/SKILL.md` → Skills
   - `hooks/hooks.json` → Hooks

### Caching Behavior
Claude Code likely caches plugin components at:
- Session start
- Plugin installation/enable
- Possibly when the CLI starts

**To force reload**: You may need to restart Claude Code or start a fresh session.

## Fixes Applied

1. Updated `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/.claude-plugin/plugin.json`:
   - Changed `repository` from object to string

2. Updated `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/commands/maximus.md`:
   - Removed `name` field from frontmatter
   - Changed `allowed-tools` to `tools`

3. Re-registered plugin in `~/.claude/plugins/installed_plugins.json`:
   - Removed old entry
   - Added fresh entry with proper structure

## Validation Results

```bash
$ claude plugin validate /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee
✔ Validation passed

$ claude plugin list | grep devcoffee
❯ devcoffee@local
    Version: 0.1.0
    Scope: user
    Status: ✔ enabled
```

## Testing Checklist

To verify the fixes work, test in a **fresh Claude Code session**:

- [ ] Type `/dev` - should show `/devcoffee:maximus` in autocomplete
- [ ] Run `/devcoffee:maximus` - command should execute
- [ ] Type "run maximus" - agent should be triggered based on description
- [ ] Check agent spawning with Task tool using `devcoffee:maximus`

## Key Learnings

1. **Always validate plugin schema**: Use `claude plugin validate <path>` before installing
2. **Check official plugins for reference**: Feature-dev, code-simplifier show correct patterns
3. **Filename = component name**: For commands and agents, the markdown filename becomes the identifier (without .md extension)
4. **Frontmatter is critical**: Wrong field names or structure prevent discovery
5. **Cache invalidation**: Plugin changes may require session restart to take effect

## Commands Reference

```bash
# Validate plugin structure
claude plugin validate /path/to/plugin

# List installed plugins
claude plugin list

# Check plugin registration
cat ~/.claude/plugins/installed_plugins.json | jq '.plugins["devcoffee@local"]'

# Find example plugin structures
ls -la ~/.claude/plugins/cache/claude-plugins-official/feature-dev/*/
```

## Next Steps

1. **Test in fresh session**: Start new Claude Code session to verify components load
2. **Check autocomplete**: Type `/dev` to see if command appears
3. **Test agent triggering**: Say "run maximus" to verify agent description matching works
4. **Document working config**: If successful, create deployment guide for local plugins

## Plugin Installation for Local Development

For local plugin development, the workflow is:

1. Create plugin directory with correct structure
2. Validate: `claude plugin validate /path/to/plugin`
3. Register by manually adding to `installed_plugins.json` OR using marketplace approach
4. Restart Claude Code session to reload plugins
5. Test commands/agents availability

## Related Files

- Plugin manifest: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/.claude-plugin/plugin.json`
- Maximus command: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/commands/maximus.md`
- Maximus agent: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee/agents/maximus.md`
- Plugin registry: `~/.claude/plugins/installed_plugins.json`
