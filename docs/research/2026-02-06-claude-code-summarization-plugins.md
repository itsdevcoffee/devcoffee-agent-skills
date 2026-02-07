# Claude Code Summarization and Condensing Plugins Research

**Date:** 2026-02-06
**Focus:** Plugins, skills, and tools that provide summarization, TLDR, or condensing functionality for Claude Code responses

## Executive Summary

While there is **no dedicated "summarization plugin"** in the Claude Code marketplace, several built-in features and community tools provide response condensing capabilities:

1. **Built-in `/compact` command** - Summarizes conversation history
2. **Output Styles** - Control response formatting and verbosity
3. **TLDR plugin** (Continuous Claude v3) - Code analysis with 95% token reduction
4. **Custom CLAUDE.md configurations** - Enforce concise responses

## Official Claude Code Features

### 1. Built-in `/compact` Command

**Source:** [How to Use Claude Code](https://www.producttalk.org/how-to-use-claude-code-features/)

**Purpose:** Context compression and conversation summarization

**Key Features:**
- Summarizes conversation history while preserving important details
- Triggered automatically when Claude Code reaches 75% context window limit
- Can be used proactively: `/compact`
- Supports optional instructions: `/compact focus on authentication logic`
- Compresses context to ensure higher-quality output
- **Pro tip:** Use before major feature work to free up ~70% more token space

**Usage Pattern:**
```bash
/compact
# Or with focus
/compact focus on authentication logic
```

### 2. Output Styles

**Source:** [Output Styles - Claude Code Docs](https://code.claude.com/docs/en/output-styles)

**Purpose:** Modify response formatting, tone, and structure

**Built-in Styles:**
- **Default**: Concise, efficient software engineering responses
- **Explanatory**: Educational insights with implementation context
- **Learning**: Collaborative mode with TODO(human) markers

**Key Insight:**
> "All output styles exclude instructions for efficient output (such as responding concisely)"

This means custom output styles can enforce brevity by removing verbosity instructions.

**Configuration Methods:**
1. Command: `/output-style` (menu) or `/output-style [name]` (direct)
2. Settings: Edit `.claude/settings.local.json`
3. Custom styles: Create markdown files in `~/.claude/output-styles/` or `.claude/output-styles/`

**Custom Style Example:**
```markdown
---
name: Concise Bullets
description: Ultra-brief responses with bullet points only
---

# Concise Response Guidelines

Respond using ONLY:
- Brief bullet points (max 5 per section)
- Code snippets when necessary
- No elaboration or prose
- Maximum 200 words total per response

## Format
- Use `-` for bullets
- Use `1.` for numbered lists
- Use `##` for section headers
```

**Installation:**
```bash
# Save file to ~/.claude/output-styles/concise-bullets.md
# Then activate:
/output-style concise-bullets
```

### 3. Bullet-Points Output Style

**Source:** [Claude Code Output Styles](https://claude-plugins.dev/skills/@djacobsmeyer/claude-skills-engineering/output-styles-skill)

**Purpose:** Structured bullet-point formatting

**Characteristics:**
- Clean nested lists with dashes and numbers
- Best for action items, documentation, and task tracking
- Focuses on structure and brevity
- Uses compressed information format

**Configuration via Hook:**
```json
{
  "event": "output",
  "command": "apply-style",
  "style": "~/.claude/output-styles/bullet-points.md"
}
```

## Community Tools and Plugins

### 4. TLDR Plugin (Continuous Claude v3)

**Source:** [Continuous Claude v3](https://github.com/parcadei/Continuous-Claude-v3)
**Author:** parcadei
**Status:** Active (2026)

**Purpose:** Token-efficient code analysis through 5-layer abstraction

**Key Features:**
- **95% token reduction**: 23,000 tokens → 1,200 tokens
- 5-layer code analysis system
- Semantic indexing with FAISS
- Natural language codebase queries

**Five Analysis Layers:**

| Layer | Purpose | Token Cost |
|-------|---------|------------|
| 1. AST | Function signatures, class definitions | ~500 |
| 2. Call Graph | Cross-file dependencies | +440 |
| 3. Control Flow | Decision paths and branching | +110 |
| 4. Data Flow | Variable tracking | +130 |
| 5. Program Dependence | Executable slices | +150 |
| **Total** | **Complete structured analysis** | **~1,200** |

**Commands:**

**Structure Analysis:**
- `tldr tree` - File tree visualization
- `tldr structure` - Code structure mapping
- `tldr search` - Search and extraction

**Flow Analysis:**
- `tldr context` - LLM-ready context
- `tldr cfg` - Control flow graphs
- `tldr dfg` - Data flow graphs
- `tldr slice` - Analyze line impact

**Code Quality:**
- `tldr impact` - Find function callers
- `tldr dead` - Unreachable code detection

**Semantic Queries:**
- `tldr daemon semantic` - Natural language queries
  - Example: "find authentication logic"

**Usage Example:**
```bash
# Instead of reading entire file (23,000 tokens)
Read src/auth/handler.js

# Use TLDR (1,200 tokens)
tldr context src/auth/handler.js
# Returns: function signatures, dependencies, flow analysis
```

**Integration:**
- Uses BGE-large-en-v1.5 semantic embeddings
- Auto-reindexes on file changes
- Works with Claude Code Skill tool
- Part of larger Continuous Claude v3 system (30 hooks, 109 skills, 32 agents)

**System Features:**
- Context management across sessions
- Ledgers and handoffs for state persistence
- MCP execution without context pollution
- Isolated context windows for agent orchestration

### 5. Superpowers Plugin

**Source:** [The best way to do agentic development in 2026](https://dev.to/chand1012/the-best-way-to-do-agentic-development-in-2026-14mn)

**Purpose:** Enhanced planning mode with intelligent questioning

**Key Feature:**
- Asks more intelligent questions during planning
- Fleshes out implementation details iteratively
- Makes final implementation more precise
- Works best in Claude Code's planning mode

**Use Case:** Reduces back-and-forth by getting implementation details upfront

## Implementation Approaches

### Approach 1: CLAUDE.md Configuration

**Source:** [CLAUDE.md Optimization](https://smartscope.blog/en/generative-ai/claude/claude-md-concise-agent-optimization-2026/)

**Method:** Add verbosity constraints to project CLAUDE.md

**Example Configuration:**
```markdown
# Response Guidelines

## Conciseness Requirements
- Maximum 200 words for plan explanations
- Maximum 10 lines for code examples
- Use bullet points for lists
- Avoid elaboration unless requested
- No conversational filler

## Output Format
- Use `##` for sections
- Use `-` for bullets
- Use code blocks for all code
- One blank line between sections
```

**Advantages:**
- No plugin required
- Project-specific
- Version controlled
- Team-wide consistency

**Limitations:**
- Claude may still be verbose depending on task complexity
- Not enforced as strictly as output styles

### Approach 2: Custom Output Style + Hook

**Method:** Combine custom output style with automated hook

**Step 1 - Create Output Style:**
```markdown
# ~/.claude/output-styles/ultra-brief.md
---
name: Ultra Brief
description: Minimal responses with max brevity
keep-coding-instructions: true
---

# Ultra Brief Mode

Rules:
1. Maximum 3 sentences of prose per response
2. Prefer bullet points over paragraphs
3. Code speaks louder than words
4. If >100 words needed, ask if user wants details

Format:
- Start with 1-line summary
- Bullet key points (max 5)
- Show code/changes
- End with next step (if applicable)
```

**Step 2 - Create Auto-Apply Hook:**
```json
// .claude/hooks/auto-brief.json
{
  "event": "session_start",
  "command": "set-output-style",
  "style": "ultra-brief"
}
```

**Advantages:**
- Automatically applied
- Consistent across sessions
- Can be toggled off easily

### Approach 3: Slash Command for Summarization

**Method:** Create custom skill for response summarization

**File:** `.claude/skills/summarize.md`

```markdown
---
name: summarize
description: Summarize the previous response into key points
---

# Summarize Skill

When invoked, analyze the previous Claude response and provide:

1. **One-line summary** (max 10 words)
2. **Key points** (3-5 bullets max)
3. **Action items** (if any)
4. **Files changed** (if code was modified)

Format:
```
SUMMARY: [one line]

KEY POINTS:
- [point 1]
- [point 2]
- [point 3]

NEXT: [what to do next, if applicable]
```

Exclude:
- Code blocks (unless user asks)
- Explanations (just facts)
- Conversational text
```

**Usage:**
```bash
# After Claude gives long response
/summarize

# Result:
SUMMARY: Fixed authentication bug in login handler

KEY POINTS:
- Modified src/auth/handler.js (added JWT validation)
- Added unit tests in tests/auth.test.js
- Updated CLAUDE.md with security notes

NEXT: Run tests with npm test
```

## Marketplace Discovery

### Official Marketplaces

**Primary Source:** [Claude Code Plugins Official](https://github.com/anthropics/claude-plugins-official)

**Marketplace Stats (as of 2026-02-06):**
- 43 total marketplaces
- 834 total plugins
- 1,537+ skills available

**Official Repositories:**
1. `anthropics/claude-plugins-official` - Official Anthropic plugins
2. `anthropics/claude-code-plugins` - Demo/example plugins
3. Community marketplaces (see awesome lists below)

**Installation:**
```bash
# Add official marketplace
/plugin marketplace add anthropics/claude-plugins-official

# Install specific plugin
/plugin install {plugin-name}@claude-plugin-directory
```

### Notable Community Resources

**Awesome Lists:**

1. **[awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)**
   - Comprehensive curated list
   - Skills, hooks, slash-commands, agents, plugins
   - 61+ items catalogued

2. **[awesome-claude-plugins](https://github.com/Chat2AnyLLM/awesome-claude-plugins)**
   - Curated marketplace and plugin directory
   - 43 marketplaces tracked
   - 834 plugins indexed

3. **[claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills)**
   - 270+ plugins
   - 739 agent skills
   - 11 Jupyter notebook tutorials
   - CCPI package manager included

4. **[awesome-claude-code-output-styles](https://github.com/hesreallyhim/awesome-claude-code-output-styles-that-i-really-like)**
   - Curated output style collection
   - Community-contributed styles
   - Focus on formatting preferences

5. **[everything-claude-code](https://github.com/affaan-m/everything-claude-code)**
   - Complete configuration collection
   - Anthropic hackathon winner's configs
   - Battle-tested agents, skills, hooks, commands

**Plugin Categories:**
- DevOps automation
- AI/ML engineering
- Testing and QA
- Security and compliance
- Documentation generation
- Architecture and design
- Code intelligence (LSP integration)

### No Dedicated Summary Plugins Found

**Important Finding:** After searching:
- Official plugins repository
- 6 major awesome lists
- Community marketplaces
- GitHub repos (2025-2026)

**Result:** No standalone "summarization" or "TLDR response" plugins exist

**Reason:** Built-in features (`/compact`, output styles) already provide this functionality

## Comparison Matrix

| Feature | Token Savings | Use Case | Complexity | Installation |
|---------|---------------|----------|------------|--------------|
| `/compact` | ~70% | Conversation history | Built-in | None |
| Output Styles | Variable | Response formatting | Low | Built-in |
| TLDR (Continuous Claude) | 95% | Code analysis | High | Plugin install |
| CLAUDE.md config | ~30-50% | Project-wide rules | Low | File creation |
| Custom slash command | N/A | On-demand summary | Medium | Skill creation |

## Recommendations

### For General Response Brevity
**Use:** Custom output style + CLAUDE.md

```bash
# 1. Create output style
cat > ~/.claude/output-styles/brief.md << 'EOF'
---
name: Brief
description: Concise responses with bullet points
---
Respond concisely using bullet points. Max 5 bullets per section.
EOF

# 2. Activate
/output-style brief

# 3. Add to CLAUDE.md
echo "## Response Format: Brief bullets only, max 200 words" >> CLAUDE.md
```

### For Code Analysis Efficiency
**Use:** TLDR plugin from Continuous Claude v3

```bash
# Install Continuous Claude v3
/plugin marketplace add parcadei/Continuous-Claude-v3
/plugin install continuous-claude

# Use TLDR commands
tldr structure src/
tldr daemon semantic "find auth logic"
```

### For Conversation Management
**Use:** Built-in `/compact` command

```bash
# Before starting major work
/compact focus on recent authentication changes

# Automatic at 75% context
# (Claude triggers automatically)
```

### For On-Demand Summaries
**Use:** Custom `/summarize` skill

```bash
# Create skill (see Approach 3 above)
# Then use after any response:
/summarize
```

## User Reception and Popularity

### Most Popular Solutions

**Based on GitHub stars and community adoption:**

1. **Output Styles** (Built-in)
   - Widely adopted
   - Featured in official docs
   - 6.8k+ stars on main repo
   - "Probably the most awesome feature of Claude Code"

2. **TLDR (Continuous Claude v3)**
   - Rising popularity (2026)
   - Featured in "best of 2026" articles
   - Significant token savings appeal
   - Active development

3. **`/compact` Command** (Built-in)
   - Essential for long sessions
   - Recommended in official guides
   - Automatic triggering praised
   - "Game-changer for context management"

### Community Feedback

**Positive:**
- "Output styles completely changed my workflow" - Multiple sources
- "TLDR saves ridiculous amounts of tokens" - Developer reviews
- "/compact is essential for long coding sessions" - Community consensus

**Requests:**
- More granular control over response length
- Per-task output style switching
- Better TLDR integration with native Claude Code

## Technical Implementation Notes

### How Output Styles Work

**From official docs:**
1. Modify Claude Code's system prompt directly
2. Exclude default "efficient output" instructions
3. Custom styles exclude coding instructions (unless `keep-coding-instructions: true`)
4. Custom instructions appended to end of system prompt
5. Reminders triggered during conversation to maintain style

**Key Limitation:**
> "Output styles completely 'turn off' the parts of Claude Code's default system prompt specific to software engineering"

**Solution:** Use `keep-coding-instructions: true` in frontmatter

### Hook Integration

**Output Style Hook Example:**
```json
{
  "event": "output",
  "command": "apply-style",
  "style": "~/.claude/output-styles/bullet-points.md"
}
```

**Session Start Hook:**
```json
{
  "event": "session_start",
  "command": "set-output-style",
  "style": "brief"
}
```

## 2026 Workflow Trends

**Source:** [MCPs, Claude Code, and the 2026 Workflow Shift](https://dev.to/austinwdigital/mcps-claude-code-codex-moltbot-clawdbot-and-the-2026-workflow-shift-in-ai-development-1o04)

**Key Insight:**
> "The 2026 shift isn't 'AI writes code.' It's 'AI runs work.'"

**Implications for Summarization:**
- More emphasis on **context management** over response length
- **Token efficiency** becoming critical for agentic workflows
- **Structured outputs** preferred over conversational responses
- **Plan-first, verbose-second** approach emerging

**Best Practice:**
Use concise planning modes, then expand on request:
```bash
# Step 1: Get brief plan
/plan --brief fix-auth-bug

# Step 2: If details needed
/plan expand step-3
```

## Related Tools

### Not Summarization, But Complementary

**Chain of Draft (CoD) Mode**
- Available in Continuous Claude v3
- "Ultra-concise mode"
- ~80% token reduction for codebase searches
- Optimized for rapid iteration

**Linear Plugin**
- Summarizes tickets
- Creates task breakdowns
- Integrates with project management
- Not for response condensing, but for input summarization

**Semantic Code Search**
- Part of TLDR daemon
- Natural language queries
- Returns focused results
- Reduces need for verbose explanations

## Gaps and Opportunities

### What's Missing

1. **No dedicated "summarize response" plugin**
   - Current workaround: `/compact` or custom skill
   - Opportunity for community plugin

2. **No token counter integration**
   - Can't see token savings in real-time
   - Would help optimize output styles

3. **No A/B comparison for styles**
   - Hard to quantify verbosity reduction
   - Would help choose best style

4. **No automatic style switching**
   - Manual `/output-style` required
   - Could be context-aware (e.g., brief for planning, detailed for debugging)

### Potential Community Plugins

**Idea 1: Auto-Brief Plugin**
```
Automatically detects when response exceeds threshold
Offers: "That was long. Want the TLDR?"
Provides 3-5 bullet summary on request
```

**Idea 2: Token Tracker Plugin**
```
Shows token usage per response
Compares to previous response
Suggests output style optimizations
```

**Idea 3: Response Formatter Plugin**
```
Post-processes Claude responses
Extracts: summary, key points, code changes, next steps
Configurable format templates
```

## Implementation Priority

For DevCoffee Agent Skills project:

### High Priority
1. ✅ Document existing features (`/compact`, output styles)
2. ✅ Create custom "brief" output style
3. ✅ Add CLAUDE.md verbosity guidelines

### Medium Priority
4. Create `/summarize` skill (see Approach 3)
5. Test TLDR plugin integration
6. Document token savings metrics

### Low Priority
7. Develop custom "auto-brief" plugin (if demand exists)
8. Create comparison guide for different approaches
9. Build token tracking integration

## Key Takeaways

1. **No dedicated summarization plugin exists** - Built-in features are sufficient for most use cases

2. **Three main approaches:**
   - `/compact` for conversation history
   - Output styles for response formatting
   - TLDR for code analysis efficiency

3. **Best combination:**
   - Custom output style (formatting)
   - CLAUDE.md rules (project-wide)
   - `/compact` (context management)
   - TLDR (code analysis)

4. **Community consensus:**
   - Output styles are powerful and underutilized
   - TLDR plugin is game-changing for large codebases
   - `/compact` is essential for long sessions

5. **2026 trend:**
   - Focus shifting to **token efficiency** over response length
   - **Structured outputs** preferred
   - **Context management** more important than brevity

## Sources

- [Claude Code Marketplace](https://claudemarketplaces.com/)
- [Official Claude Code Plugins](https://github.com/anthropics/claude-plugins-official)
- [Discover and install plugins - Claude Code Docs](https://code.claude.com/docs/en/discover-plugins)
- [awesome-claude-plugins](https://github.com/Chat2AnyLLM/awesome-claude-plugins)
- [Top 10 Claude Code Plugins to Try in 2026](https://www.firecrawl.dev/blog/best-claude-code-plugins)
- [The best way to do agentic development in 2026](https://dev.to/chand1012/the-best-way-to-do-agentic-development-in-2026-14mn)
- [How to Use Claude Code: Slash Commands, Agents, Skills, Plug-ins](https://www.producttalk.org/how-to-use-claude-code-features/)
- [Output Styles - Claude Code Docs](https://code.claude.com/docs/en/output-styles)
- [CLAUDE.md Optimization Guide 2026](https://smartscope.blog/en/generative-ai/claude/claude-md-concise-agent-optimization-2026/)
- [Continuous Claude v3](https://github.com/parcadei/Continuous-Claude-v3)
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [awesome-claude-code-output-styles](https://github.com/hesreallyhim/awesome-claude-code-output-styles-that-i-really-like)
- [claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills)
- [MCPs, Claude Code, and the 2026 Workflow Shift](https://dev.to/austinwdigital/mcps-claude-code-codex-moltbot-clawdbot-and-the-2026-workflow-shift-in-ai-development-1o04)
- [Output styles-skill - Claude Code Plugins](https://claude-plugins.dev/skills/@djacobsmeyer/claude-skills-engineering/output-styles-skill)
- [A practical guide to output styles in Claude Code](https://www.eesel.ai/blog/output-styles-claude-code)
- [How to Use Claude Code (+ my best tips)](https://www.builder.io/blog/claude-code)
