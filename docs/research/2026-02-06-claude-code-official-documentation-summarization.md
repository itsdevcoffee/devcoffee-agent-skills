# Claude Code Official Documentation: Conversation Summarization & Management

**Date:** 2026-02-06
**Purpose:** Research official Anthropic/Claude Code documentation and recent announcements about plugins, skills, and conversation management features to inform TLDR skill development.

## Executive Summary

Claude Code has robust built-in conversation management and summarization capabilities that overlap significantly with the proposed TLDR skill. Key findings:

1. **Built-in `/compact` command** - Provides conversation summarization natively
2. **Compaction API (Beta)** - Server-side context summarization for "infinite conversations"
3. **Automatic compaction** - Triggers at 75% context window capacity
4. **History access via MCP** - Multiple community MCP servers for accessing `~/.claude/history.jsonl`
5. **No official TLDR-like plugin** identified in the marketplace

## Key Findings

### 1. Built-in Summarization Features

#### `/compact` Command

Claude Code includes a native `/compact` command that:
- Summarizes the entire conversation history
- Creates a new chat session with the summary preloaded as context
- Intelligently retains critical information (files, decisions, task state)
- Discards conversational back-and-forth
- Differs from `/clear` which completely wipes history

**Customization Options:**
- Add "Compact Instructions" section to `CLAUDE.md` to control preservation
- Run `/compact` with focus: `/compact focus on the API changes`
- Provide word count limits or specific instructions

**References:**
- [Claude Code Compaction | Steve Kinney](https://stevekinney.com/courses/ai-development/claude-code-compaction)
- [What is Claude Code Auto Compact | ClaudeLog](https://claudelog.com/faqs/what-is-claude-code-auto-compact/)
- [Compact conversations in Claude Code](https://m.academy/lessons/compact-conversations-claude-code/)
- [What Actually Happens When You Run `/compact` in Claude Code](https://dev.to/rigby_/what-actually-happens-when-you-run-compact-in-claude-code-3kl9)

#### Automatic Compaction

Claude Code automatically compacts conversations:
- Triggers when context window reaches 75% capacity
- Approaches the 200K token limit warning threshold
- Creates summary and replaces older messages
- Enables indefinite session continuation

**Reference:**
- [How Claude Code works - Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works)

### 2. Compaction API (Beta)

Anthropic launched the Compaction API in beta (January 2026) for server-side context summarization:

**Key Features:**
- Server-side context summarization for effectively infinite conversations
- Available on Claude Opus 4.6
- Detects when input tokens exceed configured threshold
- Generates conversation summary automatically
- Creates compaction block containing the summary
- Drops all message blocks prior to compaction block
- Continues conversation from the summary

**Implementation:**
- Include beta header: `compact-2026-01-12` in API requests
- Add `compact_20260112` strategy to `context_management.edits` in Messages API request

**Use Cases:**
- Long-running agent workflows
- Extended conversation scenarios
- Eliminating manual context management
- Avoiding sliding window hacks or truncation strategies

**References:**
- [Compaction - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
- [Claude Opus 4.6 adds adaptive thinking, 128K output, compaction API](https://laravel-news.com/claude-opus-4-6)
- [Automatic context compaction cookbook](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction)

### 3. Conversation History Storage

#### Storage Format
Claude Code saves all conversations locally:
- Location: `~/.claude/history.jsonl` and `~/.claude/projects/[project-hash]/[session-id].jsonl`
- Format: JSONL (JSON Lines)
- Contents: Every message, tool use, and result
- Enables: Rewinding, resuming, and forking sessions

**References:**
- [Claude Code's hidden conversation history](https://kentgigger.com/posts/claude-code-conversation-history)
- [Every Claude Code Session I've Ever Had — Browsable, Searchable, Resumable](https://medium.com/@me_82386/i-lost-47-claude-code-conversations-before-building-this-47995856a283)

#### MCP Servers for History Access

Multiple community-built MCP servers provide access to conversation history:

**1. Claude Code History MCP Server** (`yudppp/claude-code-history-mcp`)
- Reads history files from `~/.claude/projects/`
- Provides tools:
  - `list_projects` - Discover all projects with conversation history
  - `list_sessions` - List conversations with date range filtering
  - `get_conversation_history` - Retrieve paginated history with filtering
  - `search_conversations` - Search across all conversation content by keywords

**2. Claude Historian MCP** (`Vvkmnn/claude-historian-mcp`)
- Surfaces useful Claude Code conversation history
- Enables searching and retrieving relevant past sessions

**3. CC Conversation Search** (`akatz-ai/cc-conversation-search`)
- Find and resume Claude Code conversations using semantic search
- Returns session IDs and project paths
- Enables easy resumption via `claude --resume`

**References:**
- [Claude Code History MCP Server | LobeHub](https://lobehub.com/mcp/yudppp-claude-code-history-mcp)
- [Claude Historian MCP server](https://playbooks.com/mcp/claude-historian)
- [GitHub - akatz-ai/cc-conversation-search](https://github.com/akatz-ai/cc-conversation-search)
- [Claude Code History | Awesome MCP Servers](https://mcpservers.org/servers/yudppp/claude-code-history-mcp)

### 4. Official Plugin Ecosystem

#### Plugin Marketplace
Anthropic maintains an official plugin marketplace with 36 curated plugins (as of December 2025):

**Categories:**
1. **LSP Integrations** - Language Server Protocol plugins for real-time feedback
2. **Internal Workflow Tools** - Productivity and code review automation
3. **Security Tools** - Real-time security linting (SQL injection, XSS, command injection)
4. **Code Review** - Automated review agents specializing in comments, tests, error handling

**Installation:**
- Command: `/plugin install {plugin-name}@claude-plugin-directory`
- Management: `/plugin list`, `/plugin enable`, `/plugin disable`, `/plugin remove`

**References:**
- [GitHub - anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [Claude Code Official Plugin Marketplace: Complete Guide](https://www.petegypps.uk/blog/claude-code-official-plugin-marketplace-complete-guide-36-plugins-december-2025)

#### Cowork Plugins (January 2026)
Anthropic launched 11 open-source Cowork plugins on January 30, 2026:
- Role-specific customization for sales, legal, finance
- Data connections and workflow automation
- Custom slash commands for teams
- Example use cases: drafting marketing texts, checking legal documents, preparing customer answers

**Market Impact:** The launch triggered significant market reaction with $285B wiped off tech stocks in one day.

**References:**
- [Anthropic Rolls Out Plugins for Claude Cowork Workflows](https://www.reworked.co/collaboration-productivity/anthropic-adds-plugins-to-claude-cowork/)
- [Anthropic Launches Cowork Plugins for Role-Specific AI](https://winbuzzer.com/2026/02/01/anthropic-launches-cowork-plugins-role-specific-ai-xcxwbn/)

#### No Official TLDR Plugin
No official plugin or skill for conversation summarization/TLDR was identified in the marketplace, despite the existence of:
- Built-in `/compact` command
- Multiple community MCP servers for history access
- Rich plugin ecosystem

### 5. Skills Architecture

Skills are folders containing instructions, scripts, and resources that Claude loads dynamically:

**Structure:**
- Directory containing `SKILL.md` file
- YAML frontmatter with metadata
- Instructions for task completion
- Optional scripts and resources

**Plugin Structure:**
- Manifest: `.claude-plugin/plugin.json` (name, description, version)
- Skills: `skills/` directory with skill folders
- Can include: agents, hooks, MCP servers

**References:**
- [GitHub - anthropics/skills](https://github.com/anthropics/skills)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)

### 6. Best Practices for Conversation Management

#### Context Window Management
- Critical for large codebases
- Use `/clear` to reset completely
- Use `/init` to rebuild project memory from `CLAUDE.md`
- Scope chats to one project/feature for relevance
- Clear context when switching features

**Reference:**
- [Connect Claude Code to tools via MCP - Claude Code Docs](https://code.claude.com/docs/en/mcp)
- [Optimising MCP Server Context Usage in Claude Code](https://scottspence.com/posts/optimising-mcp-server-context-usage-in-claude-code)

#### MCP Tool Optimization
- Output warning threshold: 10,000 tokens
- Maximum limit: 25,000 tokens (configurable)
- Consider pagination or filtering for large outputs
- MCP servers can consume significant tokens (example: 14,214 tokens for verbose tool descriptions)

**Reference:**
- [Optimising MCP Server Context Usage in Claude Code](https://scottspence.com/posts/optimising-mcp-server-context-usage-in-claude-code)

#### Subagent Delegation
- Use subagents to verify details early in conversations
- Preserves context availability
- Minimal efficiency downside

**Reference:**
- [Enhancing Claude Code with MCP Servers and Subagents](https://dev.to/oikon/enhancing-claude-code-with-mcp-servers-and-subagents-29dd)

#### CLAUDE.md as Project Infrastructure
- Treat as critical project infrastructure
- Update after completing big features or refactors
- Embed comprehensive quality standards
- Add "Compact Instructions" section to control `/compact` behavior

**References:**
- [The Ultimate Guide to Claude Code Context Management | Substratia](https://substratia.io/blog/context-management-guide/)
- [A Guide to Claude Code 2.0](https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents/)

## Implications for TLDR Skill Development

### Overlap with Built-in Features
The proposed TLDR skill has significant overlap with existing functionality:
- `/compact` already provides conversation summarization
- Automatic compaction handles context management
- Multiple MCP servers enable history access

### Differentiation Opportunities
TLDR could differentiate by:
1. **Format-specific summaries** - Bullet points, timeline, executive summary formats
2. **Selective summarization** - Summarize only decisions, action items, or code changes
3. **Cross-session insights** - Summarize patterns across multiple conversations
4. **Export capabilities** - Generate markdown reports for documentation
5. **Configurable detail levels** - Quick overview vs. detailed summary
6. **Team collaboration** - Share summaries with team members

### Technical Considerations
1. **Access method**: Use MCP server for history access (e.g., `claude-code-history-mcp`)
2. **Token efficiency**: Follow MCP optimization best practices (pagination, filtering)
3. **Integration**: Could work alongside `/compact` for specialized use cases
4. **Storage**: Leverage existing `~/.claude/history.jsonl` format

### Recommended Approach
1. **Start minimal**: Focus on formats not provided by `/compact`
2. **Leverage existing MCP servers**: Use `claude-code-history-mcp` for history access
3. **Add value beyond built-ins**: Provide structured outputs, export options, cross-session analysis
4. **Clear positioning**: Market as "specialized summarization" complementing `/compact`

## Community Resources

### Example Plugins and Skills
- [GitHub - affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Complete configuration collection from Anthropic hackathon winner
- [GitHub - travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Curated list of Claude Skills
- [Claude Code Plugins & Agent Skills - Community Registry](https://claude-plugins.dev/) - Community registry with CLI

### Tools and Extensions
- [Claude Code and Codex Assist - Chat History, Code Diffs & Usage](https://marketplace.visualstudio.com/items?itemName=agsoft.claude-history-viewer) - VS Code extension
- [claude-conversation-extractor](https://pypi.org/project/claude-conversation-extractor/) - Extract clean conversation logs

## Recommendations

### For TLDR Skill Development
1. **Review existing `/compact` behavior** - Test and document what it does/doesn't do well
2. **Install and test MCP servers** - Try `claude-code-history-mcp` for history access
3. **Define unique value proposition** - Focus on formats, exports, or cross-session insights not provided by `/compact`
4. **Consider naming** - If too similar to `/compact`, consider alternative names that emphasize differentiation
5. **Leverage Compaction API** - Use beta API features for advanced summarization capabilities

### Next Steps
1. Install `claude-code-history-mcp` and test history access
2. Document `/compact` command behavior and limitations
3. Prototype TLDR skill with differentiated features
4. Create comparison matrix: TLDR vs `/compact` vs MCP history tools
5. Test with real conversation histories to validate use cases

## Sources

### Official Documentation
- [Create plugins - Claude Code Docs](https://code.claude.com/docs/en/plugins)
- [How Claude Code works - Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works)
- [Connect Claude Code to tools via MCP - Claude Code Docs](https://code.claude.com/docs/en/mcp)
- [Compaction - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/compaction)
- [Context editing - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-editing)
- [Automatic context compaction cookbook](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction)
- [GitHub - anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [GitHub - anthropics/skills](https://github.com/anthropics/skills)

### Community Resources
- [Claude Code's hidden conversation history](https://kentgigger.com/posts/claude-code-conversation-history)
- [Claude Code Compaction | Steve Kinney](https://stevekinney.com/courses/ai-development/claude-code-compaction)
- [What is Claude Code Auto Compact | ClaudeLog](https://claudelog.com/faqs/what-is-claude-code-auto-compact/)
- [32 Claude Code Tips: From Basics to Advanced](https://agenticcoding.substack.com/p/32-claude-code-tips-from-basics-to)
- [The Ultimate Claude Code Cheat Sheet](https://medium.com/@tonimaxx/the-ultimate-claude-code-cheat-sheet-your-complete-command-reference-f9796013ea50)
- [Optimising MCP Server Context Usage in Claude Code](https://scottspence.com/posts/optimising-mcp-server-context-usage-in-claude-code)
- [Enhancing Claude Code with MCP Servers and Subagents](https://dev.to/oikon/enhancing-claude-code-with-mcp-servers-and-subagents-29dd)
- [The Ultimate Guide to Claude Code Context Management | Substratia](https://substratia.io/blog/context-management-guide/)

### MCP Servers
- [Claude Code History MCP Server | LobeHub](https://lobehub.com/mcp/yudppp-claude-code-history-mcp)
- [Claude Code History | Awesome MCP Servers](https://mcpservers.org/servers/yudppp/claude-code-history-mcp)
- [GitHub - Vvkmnn/claude-historian-mcp](https://github.com/Vvkmnn/claude-historian-mcp)
- [GitHub - akatz-ai/cc-conversation-search](https://github.com/akatz-ai/cc-conversation-search)

### Recent Announcements
- [Claude Opus 4.6 adds adaptive thinking, 128K output, compaction API](https://laravel-news.com/claude-opus-4-6)
- [Anthropic Rolls Out Plugins for Claude Cowork Workflows](https://www.reworked.co/collaboration-productivity/anthropic-adds-plugins-to-claude-cowork/)
- [Claude Code Official Plugin Marketplace: Complete Guide](https://www.petegypps.uk/blog/claude-code-official-plugin-marketplace-complete-guide-36-plugins-december-2025)
- [Anthropic Release Notes - February 2026 Latest Updates](https://releasebot.io/updates/anthropic)

---

**Document Status:** Complete
**Last Updated:** 2026-02-06
**Next Review:** When TLDR skill implementation begins
