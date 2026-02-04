# Claude Code Plugin Architecture Best Practices

**Date:** 2026-02-04
**Research Focus:** Agent vs Skill patterns, plugin dependencies, feature implementation agent tools

---

## Executive Summary

This research documents best practices for Claude Code plugin architecture based on official Anthropic repositories, documentation, and community patterns as of February 2026.

### Key Findings

1. **Agent vs Skill Pattern**: Use agents for autonomous multi-step exploration and parallel work; use skills for reusable domain expertise loaded into Claude's context
2. **Plugin Dependencies**: No native dependency management exists; current best practices involve documentation, duplication, or external references via Git URLs
3. **Feature Implementation Tools**: Feature dev agents typically have access to Read, Write, Edit, Grep, Glob, Bash, and Task tools

---

## 1. Agent vs Skill (Command) Patterns

### Core Distinction

**Skills** are reusable instruction sets that extend Claude's capabilities:
- Model-invoked: Claude automatically uses them based on task context
- Loaded into Claude's context window (~100 tokens for metadata, <5,000 when activated)
- Provide domain expertise, workflows, and specialized knowledge
- Stored as `SKILL.md` files in `.claude/skills/` or plugin `skills/` directories

**Agents** are autonomous workers in separate contexts:
- Run in isolated context windows with custom system prompts
- Execute independently and return results
- Can run in parallel (multiple agents simultaneously)
- Can be backgrounded for concurrent work
- Stored as markdown files in `agents/` directories

**Commands** are slash commands that trigger workflows:
- Entry points for invoking specific functionality
- Can spawn agents or activate skills
- Stored as markdown files in `commands/` directories
- Named by filename (e.g., `feature-dev.md` → `/plugin:feature-dev`)

### When to Use Each Pattern

#### Use Skills When:
- ✅ Need reusable domain expertise (API patterns, best practices)
- ✅ Want knowledge available across multiple contexts
- ✅ Information should be progressively loaded (lazy context)
- ✅ Creating documentation references or checklists
- ✅ No need for parallel execution

**Example from research:**
```yaml
---
name: remotion-best-practices
description: Best practices for Remotion video development - 25+ domain-specific rules
---
# Contains rules for animations, audio, compositions, etc.
```

#### Use Agents When:
- ✅ Need autonomous, multi-step exploration
- ✅ Want parallel execution (multiple agents working simultaneously)
- ✅ Require context isolation (keep verbose output separate)
- ✅ Need specific tool restrictions per agent
- ✅ Task produces high-volume output you don't want in main context

**Example from official feature-dev plugin:**
```yaml
---
name: code-explorer
description: Deeply analyzes existing codebase features by tracing execution paths
tools: Read, Grep, Glob, Bash
model: inherit
---
# Traces execution paths and returns architectural insights
```

#### Use Commands When:
- ✅ Creating user-facing slash commands
- ✅ Need to orchestrate multiple phases
- ✅ Want a defined entry point for workflows
- ✅ Combining agents + skills + direct execution

**Example from devcoffee plugin:**
```yaml
---
description: Full review cycle - runs code-reviewer in a loop until clean
tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion
---
# Orchestrates multiple code-reviewer agent invocations
```

### When to Have Both Agent AND Skill

Several patterns support having both for the same functionality:

#### Pattern 1: Skill for Knowledge + Agent for Execution

**Use case:** Complex domain with reusable patterns + autonomous implementation

**Example structure:**
```
remotion-max/
├── skills/
│   └── remotion-best-practices/
│       ├── SKILL.md              # 25+ rules, patterns, examples
│       └── rules/                # Detailed reference docs
└── agents/
    └── remotion-builder.md       # References skill, implements code
```

**Why both:**
- **Skill** provides domain knowledge Claude can reference
- **Agent** executes autonomously with skill context loaded
- Skill content is portable (can be used in main conversation too)
- Agent provides isolation for code generation work

**From remotion-builder agent:**
```markdown
## Your Capabilities
1. **Generate Remotion Components**: Create React components
2. **Follow Best Practices**: Always reference the `remotion-best-practices` skill

## When Building Components
1. **Read the relevant rule files** from `remotion-best-practices` skill
2. **Ask clarifying questions** about duration, timing, media assets
```

#### Pattern 2: Skill for Expertise + Command for Orchestration + Agents for Phases

**Use case:** Multi-phase workflows requiring specialized expertise

**Official example: feature-dev plugin**
```
feature-dev/
├── commands/
│   └── feature-dev.md            # 7-phase orchestration
└── agents/
    ├── code-explorer.md          # Phase 2: codebase analysis
    ├── code-architect.md         # Phase 4: architecture design
    └── code-reviewer.md          # Phase 6: quality review
```

**Why this pattern:**
- **Command** orchestrates the workflow and user interaction
- **Agents** handle specialized exploration in parallel
- Each agent runs independently with focused objectives
- Main conversation synthesizes results and makes decisions

**From feature-dev command (Phase 4 - Architecture Design):**
```markdown
Launch 2-3 code-architect agents in parallel with different focuses:
- **Minimal changes**: Smallest modifications, maximum reuse
- **Clean architecture**: Maintainability, elegant abstractions
- **Pragmatic balance**: Speed + quality

User chooses which approach to implement.
```

#### Pattern 3: Command as Convenience + Agent as Core

**Use case:** Want both direct invocation and subagent delegation

**Example structure:**
```
plugin/
├── commands/
│   └── review.md                 # Slash command wrapper
└── agents/
    └── code-reviewer.md          # Core functionality
```

**Why both:**
- **Command** provides explicit `/plugin:review` invocation
- **Agent** allows Claude to auto-delegate "review my code"
- Agent can be used from other commands/workflows
- Command can pass specific arguments or configuration

### Best Practice Recommendations

1. **Start with Skills** for domain knowledge and patterns
2. **Add Agents** when you need autonomous execution or parallelization
3. **Add Commands** when users need explicit control or multi-phase workflows
4. **Use All Three** for comprehensive workflows (feature-dev pattern)

**Decision Matrix:**

| Need | Solution | Example |
|------|----------|---------|
| Reusable expertise | Skill | API patterns, best practices |
| Autonomous work | Agent | Code exploration, review |
| User-triggered workflow | Command | `/feature-dev`, `/review` |
| Multi-phase orchestration | Command + Agents | feature-dev (7 phases) |
| Knowledge + implementation | Skill + Agent | remotion-max pattern |

---

## 2. Plugin Dependencies

### Current State (2026)

**No native dependency management exists in Claude Code.** Plugins are completely independent units.

### Challenges

From community research:
- File duplication leads to maintenance burden
- One marketplace example showed 32 agents copied across 7 plugins
- Security concerns: malicious plugins can expose dependency management skills that redirect installs
- Active feature request for native dependency support hasn't been implemented

**Source:** [Avoid dependency hell for Claude SKILLs](https://medium.com/@michaelyuan_88928/avoid-dependency-hell-for-claude-skills-62658982ebb4)

### Current Best Practices

#### Option 1: Documentation + Manual Installation (Recommended)

**Best for:** Plugins with optional dependencies

**Implementation:**
```json
{
  "name": "my-plugin",
  "description": "...",
  "dependencies": {
    "recommended": [
      "code-quality-tools - provides advanced linting agents"
    ],
    "optional": [
      "git-workflow - enables advanced git operations"
    ]
  }
}
```

In README.md:
```markdown
## Dependencies

This plugin works best with:
- **code-quality-tools**: Install with `/plugin install code-quality-tools`
- **git-workflow** (optional): For advanced git operations

Without these plugins, some features will be unavailable.
```

**Advantages:**
- ✅ Explicit and transparent
- ✅ User maintains control
- ✅ No duplication
- ✅ Security: user sees what they're installing

**Disadvantages:**
- ❌ Manual installation required
- ❌ No automatic updates
- ❌ Potential version mismatches

#### Option 2: Bundle/Duplicate Functionality

**Best for:** Small, focused dependencies that rarely change

**Implementation:** Copy required agents/skills directly into your plugin

```
my-plugin/
├── .claude-plugin/plugin.json
├── agents/
│   ├── my-agent.md
│   └── shared-reviewer.md        # Copied from another plugin
└── skills/
    └── shared-patterns/          # Copied from another source
```

**Mark in README:**
```markdown
## Bundled Components

This plugin includes:
- `shared-reviewer` agent (from code-quality-tools v1.2.0)
- `shared-patterns` skill (from best-practices-collection)

These are bundled for convenience. Updates require plugin update.
```

**Advantages:**
- ✅ Works immediately (no manual steps)
- ✅ Guaranteed compatibility
- ✅ Self-contained

**Disadvantages:**
- ❌ Code duplication
- ❌ Maintenance burden (must manually sync updates)
- ❌ Larger plugin size

#### Option 3: Reference External Plugins via Marketplace

**Best for:** Organizations maintaining multiple related plugins

**Implementation:** Create a marketplace that references multiple plugins

```json
{
  "name": "company-toolset",
  "plugins": [
    {
      "name": "base-tools",
      "source": "./plugins/base-tools"
    },
    {
      "name": "advanced-features",
      "source": "./plugins/advanced-features",
      "dependencies": ["base-tools"]  // Documentation only
    }
  ]
}
```

**Advantages:**
- ✅ Centralized management
- ✅ Shared installation
- ✅ Version coordination

**Disadvantages:**
- ❌ Requires marketplace distribution
- ❌ Still no enforcement of dependencies
- ❌ More complex setup

#### Option 4: Graceful Degradation

**Best for:** Plugins with truly optional features

**Implementation:** Check for dependency availability at runtime

```markdown
---
name: enhanced-reviewer
description: Code review with optional advanced features
---

## Process

1. Run basic code review checks
2. If code-quality-tools plugin is available:
   - Use advanced static analysis
   - Apply organization-specific rules
3. Otherwise:
   - Skip advanced features
   - Note in output: "Install code-quality-tools for advanced analysis"
```

**In agent code:**
```markdown
## Advanced Features Check

Before using advanced features:
1. Check if `/code-quality:analyze` command exists
2. If yes, delegate advanced analysis to that command
3. If no, proceed with built-in analysis only

Always note which features were used in the output.
```

**Advantages:**
- ✅ Works with or without dependencies
- ✅ Clear communication to users
- ✅ Encourages but doesn't require installation

**Disadvantages:**
- ❌ More complex logic
- ❌ Inconsistent feature availability
- ❌ Testing overhead (with/without deps)

### Official Anthropic Pattern

The official `claude-plugins-official` marketplace demonstrates a hybrid approach:

**Internal plugins** (28 plugins):
- Anthropic-maintained
- No cross-dependencies
- Each plugin is self-contained

**External plugins** (24+ plugins):
- Referenced via Git URLs
- No dependency management
- Users install independently

**Example from marketplace.json:**
```json
{
  "name": "typescript-lsp",
  "source": "./plugins/typescript-lsp",
  "description": "TypeScript language server integration"
},
{
  "name": "agent-sdk-dev",
  "source": "./plugins/agent-sdk-dev",
  "description": "SDK and development tools for building Claude agents"
}
```

**Key insight:** Even Anthropic doesn't implement cross-plugin dependencies. Each plugin is independent.

### Security Considerations

**From security research:** [Marketplace Skills and Dependency Hijack in Claude Code](https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/)

**Risks:**
- Malicious plugins can expose skills that redirect package installs
- Marketplace plugins remain active across sessions
- Skills shape agent behavior persistently

**Mitigation:**
1. **Trust official sources** - Install from anthropics/claude-plugins-official
2. **Review plugin contents** before installation
3. **Use Docker sandboxes** for isolation (Docker Desktop 4.50+)
4. **Audit installed plugins** regularly with `/plugin list`
5. **Remove unused plugins** to reduce attack surface

### Best Practice Recommendations

**For plugin authors:**
1. **Document dependencies clearly** in README
2. **Provide installation instructions** with exact commands
3. **Version pin recommendations** to avoid compatibility issues
4. **Consider bundling** small, stable dependencies
5. **Implement graceful degradation** when possible
6. **Mark bundled components** with source and version

**For plugin users:**
1. **Review dependencies** before installing
2. **Install from trusted sources**
3. **Keep plugins updated** but test before updating
4. **Use Docker sandboxes** for experimental plugins
5. **Audit installed plugins** periodically

**For organizations:**
1. **Create curated marketplaces** with vetted plugins
2. **Bundle related functionality** in meta-plugins
3. **Document standard toolsets** for teams
4. **Maintain internal forks** of critical plugins

---

## 3. Tool Recommendations for Feature Implementation Agents

### Standard Tool Set

Based on analysis of official plugins (feature-dev, code-review, etc.), feature implementation agents typically have access to:

#### Core Tools (Almost Always Included)

**File Operations:**
- `Read` - Read file contents
- `Write` - Create new files
- `Edit` - Modify existing files
- `NotebookRead` - Read Jupyter notebooks (when applicable)

**Search & Discovery:**
- `Grep` - Search file contents
- `Glob` - Find files by pattern
- `LS` - List directory contents (sometimes implied)

**Execution:**
- `Bash` - Execute shell commands (compilation, tests, git operations)

**Orchestration:**
- `Task` - Spawn subagents for parallel work

**Interaction:**
- `AskUserQuestion` - Request clarification from user

#### Optional Tools (Context-Dependent)

**Research:**
- `WebFetch` - Fetch documentation or external resources
- `WebSearch` - Search for solutions or examples

**Process Management:**
- `KillShell` - Terminate hung processes
- `BashOutput` - Capture output without blocking

### Tool Configuration by Agent Type

#### 1. Feature Development Agents

**Full-access pattern (from feature-dev command):**
```yaml
tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion, WebFetch, WebSearch
```

**Why these tools:**
- `Task` - Spawn specialized subagents (explorer, architect, reviewer)
- `Read/Grep/Glob` - Understand existing codebase
- `Edit/Write` - Implement features
- `Bash` - Test changes, run builds
- `AskUserQuestion` - Clarify requirements
- `WebFetch/WebSearch` - Research APIs and patterns

#### 2. Code Exploration Agents

**Read-only pattern (from code-explorer):**
```yaml
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
```

**Why these tools:**
- `Read` - Read source files
- `Grep` - Search for patterns
- `Glob` - Find related files
- `Bash` - Run read-only commands (git log, find, etc.)
- **No Write/Edit** - Prevents accidental modifications

#### 3. Architecture Design Agents

**Analysis + documentation pattern (from code-architect):**
```yaml
tools: Glob, Grep, Read, WebFetch, TodoWrite, WebSearch, Bash
```

**Why these tools:**
- `Read/Grep/Glob` - Analyze existing patterns
- `WebFetch/WebSearch` - Research architectural patterns
- `TodoWrite` - Document decisions and TODOs
- `Bash` - Check dependencies, versions
- **No Edit/Write** - Design phase, no implementation

#### 4. Code Review Agents

**Review-only pattern (from code-reviewer):**
```yaml
tools: Read, Grep, Glob, Bash
disallowedTools: Edit, Write
```

**Why these tools:**
- `Read` - Read code being reviewed
- `Grep` - Search for anti-patterns
- `Glob` - Find related files
- `Bash` - Run linters, check git diff
- **No Edit/Write** - Review only, fixes done by main conversation

#### 5. Implementation Agents

**Full implementation pattern (from remotion-builder):**
```yaml
tools: Task, Read, Write, Edit, Grep, Glob, Bash, AskUserQuestion
```

**Why these tools:**
- `Read/Grep/Glob` - Check existing structure
- `Write` - Create new files
- `Edit` - Modify existing files
- `Bash` - Verify compilation, run tests
- `AskUserQuestion` - Clarify technical details
- `Task` - Spawn review agents after implementation

### Tool Restriction Patterns

#### Pattern 1: Progressive Permissions

Start restrictive, expand as needed:

```markdown
Phase 1: Exploration
  tools: Read, Grep, Glob (read-only)

Phase 2: Design
  tools: Read, Grep, Glob, TodoWrite (+ documentation)

Phase 3: Implementation
  tools: Read, Write, Edit, Bash (full access)

Phase 4: Review
  tools: Read, Grep, Bash (read-only again)
```

#### Pattern 2: Role-Based Restrictions

Different agents, different capabilities:

```yaml
# Researcher agent
tools: Read, Grep, Glob, WebFetch, WebSearch
disallowedTools: Write, Edit, Bash

# Implementer agent
tools: Read, Write, Edit, Bash
disallowedTools: WebFetch, WebSearch  # Focus on local work

# Reviewer agent
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit  # Can't modify, only review
```

#### Pattern 3: Conditional Tools via Hooks

Use PreToolUse hooks for fine-grained control:

```yaml
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-bash-command.sh"
```

**Use cases:**
- Allow Bash but block destructive commands (rm -rf, etc.)
- Allow database access but only SELECT queries
- Allow git commands but block force push

### Model Selection by Agent Type

**From official plugins:**

| Agent Type | Recommended Model | Reasoning |
|------------|------------------|-----------|
| Code Explorer | Haiku | Fast, low-cost, read-only tasks |
| Code Architect | Sonnet | Balanced capability for design |
| Code Reviewer | Sonnet | Quality analysis needs capability |
| Feature Dev (main) | Inherit | Uses user's default model |
| Background Tasks | Haiku | Cost-effective for long-running |
| Complex Reasoning | Opus | Deep architectural decisions |

**Configuration:**
```yaml
# Fast exploration
model: haiku

# Balanced work
model: sonnet

# Complex reasoning
model: opus

# Match parent conversation
model: inherit
```

### Permission Modes by Use Case

**From subagent documentation:**

```yaml
# Standard permissions (prompts user)
permissionMode: default

# Auto-accept file edits (trusted implementation)
permissionMode: acceptEdits

# Auto-deny prompts (read-only)
permissionMode: dontAsk

# Skip all checks (dangerous, testing only)
permissionMode: bypassPermissions

# Plan mode (exploration)
permissionMode: plan
```

### Best Practice Tool Configurations

#### Safe Exploration Agent
```yaml
name: safe-explorer
description: Explores codebase safely without modifications
tools: Read, Grep, Glob
model: haiku
permissionMode: dontAsk
```

#### Trusted Implementation Agent
```yaml
name: trusted-implementer
description: Implements features with pre-approved access
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
permissionMode: acceptEdits
```

#### Balanced Development Agent
```yaml
name: dev-agent
description: Full-featured development with user confirmation
tools: Task, Read, Write, Edit, Bash, Grep, Glob, AskUserQuestion
model: inherit
permissionMode: default
```

#### Specialized Research Agent
```yaml
name: research-agent
description: Researches solutions online and in docs
tools: Read, Grep, WebFetch, WebSearch
disallowedTools: Write, Edit, Bash
model: sonnet
permissionMode: plan
```

### Tool Usage Patterns in Multi-Agent Workflows

**From feature-dev plugin (7-phase workflow):**

```markdown
Phase 1: Discovery (Main Conversation)
  Tools: AskUserQuestion, Read, Grep
  Purpose: Understand requirements

Phase 2: Exploration (code-explorer agents, parallel)
  Tools: Read, Grep, Glob, Bash
  Purpose: Analyze codebase, find patterns

Phase 3: Clarification (Main Conversation)
  Tools: AskUserQuestion
  Purpose: Fill knowledge gaps

Phase 4: Architecture (code-architect agents, parallel)
  Tools: Read, Grep, TodoWrite, WebFetch
  Purpose: Design approaches, no implementation

Phase 5: Implementation (Main Conversation)
  Tools: Read, Write, Edit, Bash
  Purpose: Build the feature

Phase 6: Review (code-reviewer agents, parallel)
  Tools: Read, Grep, Bash
  Purpose: Quality check, find issues

Phase 7: Summary (Main Conversation)
  Tools: TodoWrite (optionally)
  Purpose: Document results
```

**Key insight:** Different phases use different tool sets, matching the phase's goals.

---

## 4. Real-World Examples

### Example 1: Official feature-dev Plugin

**Structure:**
```
feature-dev/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── feature-dev.md           # 7-phase orchestration
└── agents/
    ├── code-explorer.md         # Read-only exploration
    ├── code-architect.md        # Design without implementation
    └── code-reviewer.md         # Review without modification
```

**Pattern:** Command + Multiple Specialized Agents

**Tools by component:**
- **Command**: `Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion`
- **code-explorer**: `Read, Grep, Glob, Bash`
- **code-architect**: `Glob, Grep, Read, WebFetch, TodoWrite, WebSearch, Bash`
- **code-reviewer**: `Read, Grep, Glob, Bash`

**Why this works:**
- Command has full access for implementation phase
- Agents have restricted access matching their roles
- Parallel execution in phases 2, 4, and 6
- Clear separation of concerns

**Dependencies:** None - completely self-contained

### Example 2: devcoffee Plugin

**Structure:**
```
devcoffee/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── maximus.md               # Review cycle orchestrator
└── agents/
    └── maximus.md               # Agent version (not used)
```

**Pattern:** Command with Agent Invocation

**Tools:**
- **Command**: `Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion`

**Why this works:**
- Command orchestrates iterative review-fix loop
- Uses `Task` tool to spawn code-reviewer agents
- Full tool access to apply fixes
- Autonomous operation (minimal user prompts)

**Dependencies:**
- Expects `code-reviewer` agent to be available (from another plugin or user-defined)
- Gracefully degrades if not available

### Example 3: remotion-max Plugin

**Structure:**
```
remotion-max/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── remotion-best-practices/
│       ├── SKILL.md             # 25+ rules
│       └── rules/               # Detailed docs
├── agents/
│   ├── remotion-builder.md     # Implementation agent
│   └── remotion-setup.md       # Setup agent
└── commands/
    ├── builder.md              # Build command
    └── setup.md                # Setup command
```

**Pattern:** Skills + Agents + Commands (All Three)

**Tools by component:**
- **builder command**: `Task, Read, Write, Edit, Grep, Glob, Bash, AskUserQuestion`
- **setup command**: `Bash, Read, Write, Edit, AskUserQuestion`
- **remotion-builder agent**: (inherits from parent)
- **remotion-setup agent**: (inherits from parent)

**Why this works:**
- **Skill** provides domain knowledge (Remotion patterns)
- **Agents** reference skill and execute autonomously
- **Commands** provide explicit user control
- Agent can be auto-invoked or explicitly called via command

**Dependencies:** None - skill provides all domain knowledge

---

## 5. Key Takeaways

### Agent vs Skill Pattern

1. **Skills = Knowledge**, **Agents = Workers**, **Commands = Interfaces**
2. Use all three when building comprehensive workflows
3. Skills can exist without plugins (standalone in `.claude/skills/`)
4. Agents excel at parallel exploration and context isolation
5. Commands orchestrate multi-phase workflows

### Plugin Dependencies

1. **No native support** - document clearly and provide installation instructions
2. **Security first** - review plugins before installation, use official sources
3. **Bundle small dependencies**, document large ones
4. **Graceful degradation** improves user experience
5. **Docker sandboxes** for isolation during development

### Tool Configuration

1. **Least privilege** - start restrictive, expand as needed
2. **Role-based access** - different agents, different tools
3. **Progressive permissions** - expand through workflow phases
4. **Model selection matters** - Haiku for speed, Sonnet for balance, Opus for complexity
5. **Hooks for fine-grained control** - when tool allowlists aren't enough

---

## Sources

### Official Documentation
- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [Create custom subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)

### Official Repositories
- [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code)
- [claude-code/plugins/feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- [claude-code/plugins/feature-dev/agents/code-architect.md](https://github.com/anthropics/claude-code/blob/main/plugins/feature-dev/agents/code-architect.md)
- [GitHub - anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

### Community Analysis
- [Understanding Claude Code: Skills vs Commands vs Subagents vs Plugins](https://www.youngleaders.tech/p/claude-skills-commands-subagents-plugins)
- [When to Use Claude Code Skills vs Commands vs Agents | Daniel Miessler](https://danielmiessler.com/blog/when-to-use-skills-vs-commands-vs-agents)
- [How to Use Claude Code: A Guide to Slash Commands, Agents, Skills, and Plugins](https://www.producttalk.org/how-to-use-claude-code-features/)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)

### Dependency Management
- [Avoid dependency hell for Claude SKILLs](https://medium.com/@michaelyuan_88928/avoid-dependency-hell-for-claude-skills-62658982ebb4)
- [What I learned while building a trilogy of Claude Code Plugins](https://pierce-lamb.medium.com/what-i-learned-while-building-a-trilogy-of-claude-code-plugins-72121823172b)
- [The Deep Trilogy: Claude Code Plugins for Writing Good Software, Fast](https://pierce-lamb.medium.com/the-deep-trilogy-claude-code-plugins-for-writing-good-software-fast-33b76f2a022d)

### Security
- [When Your AI Coding Plugin Starts Picking Your Dependencies: Marketplace Skills and Dependency Hijack in Claude Code](https://www.sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code/)

### Community Resources
- [GitHub - hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [GitHub - jeremylongshore/claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills)
- [GitHub - VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)

---

**Document Status:** Complete
**Last Updated:** 2026-02-04
**Maintenance:** Update when new patterns emerge or Anthropic releases dependency management features
