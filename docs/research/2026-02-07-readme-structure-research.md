# README Structure Research: Claude Code Plugin Marketplaces

**Date:** 2026-02-07
**Goal:** Analyze popular Claude Code plugin/skill repositories to identify best practices for structuring multi-feature README files.

---

## Executive Summary

After analyzing 5+ popular Claude Code plugin marketplaces and MCP server repositories, clear patterns emerge:

### Key Findings

1. **Keep main README concise** - Use brief descriptions with links to detailed docs
2. **Flat list over tables** - Most successful repos use simple bullet/link lists, not complex tables
3. **Plugin-first distribution** - Marketplace installation is primary, manual copying is fallback
4. **Minimal frontmatter** - Just name + description in YAML frontmatter
5. **Category-based organization** - Group features by type/domain
6. **Badge-driven credibility** - Stars, forks, contributors, license badges
7. **Two-tier documentation** - Quick start in README, detailed guides externally

---

## Repositories Analyzed

| Repository | Stars | Focus | Key Strength |
|------------|-------|-------|--------------|
| [anthropics/skills](https://github.com/anthropics/skills) | 64.8k | Official skills reference | Clean structure, SKILL.md pattern |
| [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) | N/A | MCP catalog | Alphabetical flat list |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | 78.2k | Official MCP reference | Clear warnings, reference focus |
| [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 41k | Complete config collection | Guides-first approach |
| [claude-market/marketplace](https://github.com/claude-market/marketplace) | 6.8k | Community marketplace | Plugin builder, quality standards |

---

## Common README Structure Pattern

### 1. Header Section

**Elements:**
- Repository name and logo/banner
- Badges (stars, forks, license, languages)
- One-line description
- Key stats (e.g., "41K+ stars | 5K+ forks")

**Example from everything-claude-code:**

```markdown
# Everything Claude Code

[![Stars](https://img.shields.io/github/stars/affaan-m/everything-claude-code?style=flat)](...)
[![Forks](https://img.shields.io/github/forks/affaan-m/everything-claude-code?style=flat)](...)
[![Contributors](https://img.shields.io/github/contributors/affaan-m/everything-claude-code?style=flat)](...)

> **41K+ stars** | **5K+ forks** | **22 contributors** | **6 languages supported**

**The complete collection of Claude Code configs from an Anthropic hackathon winner.**
```

### 2. Quick Start Section

**Elements:**
- Installation command (marketplace add)
- Basic usage example
- "Under 2 minutes" time estimate

**Pattern:**

```markdown
## 🚀 Quick Start

### Step 1: Install the Plugin
```bash
/plugin marketplace add org/repo
/plugin install plugin-name@marketplace-name
```

### Step 2: [Required Setup]
[Any manual steps like rules installation]

### Step 3: Start Using
```bash
/command-example "task description"
```
```

### 3. What's Inside / Available Features

**Two main patterns observed:**

#### Pattern A: Flat List with Links (Most Common)

Used by: wong2/awesome-mcp-servers, anthropics/skills

```markdown
## Available Skills

- **[Skill Name](link)** - Brief description of what it does
- **[Another Skill](link)** - Another brief description
- **[Third Skill](link)** - More description
```

**Advantages:**
- Scannable
- Easy to maintain
- No table formatting issues
- Works well with many items (100+)

#### Pattern B: Category Grouping

Used by: everything-claude-code, claude-market

```markdown
## 📦 What's Inside

```
repo/
├── agents/           # Specialized subagents for delegation
├── skills/           # Workflow definitions
├── commands/         # Slash commands
├── hooks/            # Trigger-based automations
└── mcp-configs/      # External tool integrations
```

### Agents (12+)
- planner.md - Feature implementation planning
- architect.md - System design decisions
- tdd-guide.md - Test-driven development

### Skills (16+)
- coding-standards/ - Code quality patterns
- backend-patterns/ - API design
- frontend-patterns/ - UI development
```

**Advantages:**
- Clear hierarchy
- Grouped by type
- Shows directory structure
- Better for fewer items (10-50)

### 4. Installation Instructions

**Multi-platform pattern:**

```markdown
## Try in Claude Code, Claude.ai, and the API

### Claude Code
```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```

### Claude.ai
Available to paid plans. [Upload via docs](link)

### Claude API
Use via [Skills API Quickstart](link)
```

### 5. Documentation Links

**Pattern: Guides over inline docs**

From everything-claude-code:

```markdown
## The Guides

This repo is the raw code only. The guides explain everything.

| Topic | What You'll Learn |
|-------|-------------------|
| Token Optimization | Model selection, system prompt slimming |
| Memory Persistence | Hooks that save/load context |
| Continuous Learning | Auto-extract patterns from sessions |
```

**Key insight:** Heavy documentation lives externally (Twitter/X threads, blog posts, external docs), README just links.

### 6. Contributing Section

**Standard elements:**
- Prerequisites checklist
- Submission process (fork → PR)
- Quality standards
- Template/scaffold tool reference

From claude-market:

```markdown
## Plugin Quality Standards

### Required
- Clear, comprehensive README with usage examples
- Valid plugin.json with complete metadata
- All components work as documented
- Open source license

### Recommended
- Detailed descriptions for all components
- Examples showing typical usage
- Edge case handling
```

---

## Skill Listing Format Analysis

### ❌ Avoid: Complex Tables

**Why tables fail for multi-feature repos:**

1. **Maintenance burden** - Hard to keep aligned
2. **Mobile unfriendly** - Don't render well on small screens
3. **Limited information** - Can't fit detailed descriptions
4. **Merge conflicts** - Markdown table conflicts are painful

**Example of what NOT to do:**

```markdown
| Skill | Category | Description | Status | Last Updated |
|-------|----------|-------------|--------|--------------|
| PDF | Documents | Extract text from PDFs | Stable | 2025-01 |
| DOCX | Documents | Create Word documents | Beta | 2025-02 |
```

### ✅ Recommended: Flat List with Rich Descriptions

**Best practice from awesome-mcp-servers:**

```markdown
## Official Servers

- **[Aiven](https://github.com/Aiven-Open/mcp-aiven)** - Navigate your Aiven projects and interact with PostgreSQL®, Apache Kafka®, ClickHouse® and OpenSearch® services
- **[Alby Bitcoin Payments](https://github.com/getAlby/mcp/)** - Connect any bitcoin lightning wallet to agents to send and receive payments instantly at low cost
- **[Anthropic Claude](https://github.com/anthropics/skills)** - Official skills for Claude including document creation, PDF manipulation, and creative workflows
```

**Advantages:**
- **Scannable** - Easy to skim
- **Expandable** - Can add details without breaking layout
- **Link-rich** - Multiple links per entry (repo, docs, demo)
- **Icon support** - Can embed small icons inline
- **Copy-paste friendly** - Users can easily copy command names

### ✅ Alternative: Category Sections with Descriptions

**From anthropics/skills approach:**

```markdown
## Document Skills

Self-contained skills for creating and editing documents:

### PDF (`skills/pdf/`)
Extract text, images, and form fields from PDF files. Supports merging, splitting, and metadata extraction.

**Usage:**
```bash
/skill use pdf "Extract form fields from path/to/file.pdf"
```

### DOCX (`skills/docx/`)
Create professional Word documents with your company's brand guidelines.

**Usage:**
```bash
/skill use docx "Create a proposal document"
```
```

**When to use:**
- Fewer features (< 20)
- Need usage examples
- Features need context/setup instructions

---

## Metadata and Frontmatter Patterns

### SKILL.md Structure (Anthropic Standard)

```yaml
---
name: skill-name
description: Complete description of what this skill does and when to use it
---

# Skill Name

[Main instructions that Claude follows]

## Examples
- Example usage 1
- Example usage 2

## Guidelines
- Guideline 1
- Guideline 2
```

**Key insights:**
- **Minimal frontmatter** - Only `name` and `description`
- **No version** - Handled by git/plugin system
- **No author** - Handled by CODEOWNERS
- **No dependencies** - Managed by plugin.json

### plugin.json Structure

```json
{
  "name": "document-skills",
  "version": "1.0.0",
  "description": "Skills for creating and editing documents",
  "author": "Anthropic",
  "license": "Apache-2.0",
  "skills": [
    "skills/pdf/SKILL.md",
    "skills/docx/SKILL.md"
  ]
}
```

---

## Navigation and Discoverability

### GitHub-Native Features

**Used by all successful repos:**

1. **Topics/Tags** - `claude-code`, `mcp`, `skills`, `plugins`
2. **README badges** - Stars, forks, license, CI status
3. **Auto-generated TOC** - GitHub creates from headers
4. **Anchor links** - `#installation`, `#quick-start`

### External Directories

**Two approaches:**

1. **Self-hosted website** (e.g., mcpservers.org, mcp-awesome.com)
2. **Synced with registry** (e.g., MCP Registry, Claude Plugin Directory)

**Pattern:** README focuses on GitHub users, external site focuses on discovery

---

## Best Practices Summary

### DO ✅

1. **Use badges** - Show activity and credibility
2. **Keep main README short** - Link to detailed docs
3. **Use flat lists** - Not tables for many items
4. **Group by category** - If you have natural groupings
5. **Link extensively** - To repos, docs, examples, guides
6. **Show installation first** - Make it copy-paste ready
7. **Include quick start** - "Under 2 minutes"
8. **Provide examples** - Show actual commands/usage
9. **Link to guides** - For complex topics
10. **Auto-generate marketplace.json** - Don't maintain manually

### DON'T ❌

1. **Use complex tables** - Hard to maintain and merge
2. **Inline all documentation** - Keep README concise
3. **Skip installation instructions** - Users need quick path
4. **Forget mobile users** - Keep formatting simple
5. **Over-organize** - Flat is fine for < 50 items
6. **Skip examples** - Show don't tell
7. **Duplicate content** - Link to single source of truth
8. **Version in README** - Let git/releases handle it

---

## Recommended Structure for devcoffee-agent-skills

Based on this research, here's the recommended approach:

### Main README.md

```markdown
# Dev Coffee Agent Skills

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Production-ready Claude Code skills for video analysis, development workflows, and content creation.

## 🚀 Quick Start

```bash
# Add marketplace
/plugin marketplace add dev-coffee/devcoffee-agent-skills

# Install plugin
/plugin install devcoffee-agent-skills@dev-coffee
```

## 📦 Available Skills

### Video Analysis
- **[analyze-video](./skills/analyze-video/)** - Extract insights from video content using vision AI (frames, audio, transcription, scene detection)

### Development Tools
- **[maximus](./skills/maximus/)** - Automated code review with progressive disclosure (review-only default, --yolo for autonomous fixes)
- **[buzzminson](./skills/buzzminson/)** - Bug fix workflow with XML-tagged success criteria

### [Future category]
- **[future-skill](./skills/future-skill/)** - Description

## 📖 Documentation

- [Creating Skills](docs/guides/creating-skills.md)
- [Contributing](CONTRIBUTING.md)
- [Skill Evaluation](docs/tldr-evaluation/EVALUATION.md)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to submit your own skills.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details
```

### Individual Skill READMEs

Each skill gets its own detailed README in `skills/{skill-name}/README.md`:

```markdown
# analyze-video

Extract insights from video content using vision AI.

## Features

- Frame extraction and analysis
- Audio transcription
- Scene detection
- Timestamp-based insights

## Installation

```bash
/plugin install devcoffee-agent-skills@dev-coffee
```

## Usage

```bash
/skill use analyze-video "path/to/video.mp4"
```

## Configuration

[Detailed configuration options]

## Examples

[Detailed examples with expected outputs]

## Limitations

[Known limitations]
```

---

## References

### Primary Sources

- [anthropics/skills](https://github.com/anthropics/skills) - Official Anthropic skills repository
- [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) - Curated list of MCP servers
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Official MCP reference implementations
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Complete Claude Code configuration collection
- [claude-market/marketplace](https://github.com/claude-market/marketplace) - Community plugin marketplace

### Supporting Resources

- [Claude Code Plugin Documentation](https://code.claude.com/docs/en/plugins)
- [Agent Skills Specification](http://agentskills.io)
- [MCP Registry](https://registry.modelcontextprotocol.io/)
- [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide)

### Additional Examples

- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) - Official plugin directory
- [scailetech/openclaude](https://github.com/scailetech/openclaude/) - Comprehensive Claude Code configuration
- [appcypher/awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers) - Alternative MCP server list
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Another MCP server collection

---

## Appendix: Specific Formatting Examples

### Badges

```markdown
[![Stars](https://img.shields.io/github/stars/org/repo?style=flat)](https://github.com/org/repo/stargazers)
[![Forks](https://img.shields.io/github/forks/org/repo?style=flat)](https://github.com/org/repo/network/members)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Language](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
```

### Directory Trees

```markdown
```
project/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── skill-1/
│   │   ├── SKILL.md
│   │   └── README.md
│   └── skill-2/
│       ├── SKILL.md
│       └── README.md
├── docs/
└── README.md
```
```

### Installation Code Blocks

```markdown
### Claude Code
```bash
/plugin marketplace add org/repo
/plugin install plugin-name@marketplace-name
```

### Claude.ai
Available to paid plans. [Learn more](https://support.claude.com)

### Claude API
```python
from anthropic import Anthropic
client = Anthropic()
# ... API example
```
```

### Feature Lists with Icons

```markdown
## Features

- 🎥 **Video Analysis** - Frame extraction and scene detection
- 🔍 **Code Review** - Automated review with progressive disclosure
- 🐛 **Bug Fixing** - XML-tagged success criteria workflow
- 📊 **Metrics** - Track success rates and patterns
```

### Quick Reference Tables (For Guides, Not Features)

```markdown
| Topic | What You'll Learn |
|-------|-------------------|
| Token Optimization | Model selection, prompt engineering |
| Memory Persistence | Context saving and loading |
| Verification | Testing patterns and quality checks |
```

**Note:** Use tables for guides/comparisons, NOT for listing features/skills.
