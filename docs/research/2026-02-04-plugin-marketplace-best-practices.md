# Claude Code Plugin Marketplace Best Practices Research

**Date:** 2026-02-04
**Research Focus:** Multi-repo vs monorepo for plugins, plugin organization patterns, skills vs plugins, marketplace architecture

## Executive Summary

Based on research of official Anthropic repositories, community examples, and official documentation, here are the key findings:

### Key Takeaways

1. **Skills CAN exist standalone** in `.agents/skills/` or `.claude/skills/` directories without being packaged as plugins
2. **Plugins are distribution mechanisms** - they bundle skills, commands, agents, and hooks for sharing
3. **Marketplaces can reference external repos** using Git URLs or GitHub sources
4. **Single-plugin marketplaces are common** and perfectly acceptable for focused functionality
5. **Multi-plugin marketplaces** are best for curated collections or organizational toolkits

---

## 1. Skills vs Plugins Architecture

### Skills are Standalone

Skills can exist in multiple locations without requiring a plugin wrapper:

**Discovery Locations:**
- `~/.claude/skills/` - Global user skills
- `.claude/skills/` - Project-specific skills
- `project/.claude/skills/` - Nested project skills
- Plugin-provided skills via `skills/` directory
- Built-in skills from Anthropic

**Key Insight:** Claude Code automatically discovers skills from all these locations. You don't need to create a plugin to use a skill - just place it in one of these directories.

**Example from remotion-skill:**
```
/home/maskkiller/projects/remotion-skill/.agents/skills/remotion-best-practices/
├── SKILL.md
└── rules/
    ├── animations.md
    ├── audio.md
    ├── compositions.md
    └── ... (many more)
```

This skill works perfectly without being in a plugin structure.

### When to Create a Plugin

Create a plugin wrapper when you want to:
- **Distribute** your skill to others via marketplace
- **Version control** the skill independently
- **Bundle** multiple related skills together
- **Add components** like hooks, MCP servers, or LSP servers
- **Share with teams** via Git repositories

### Plugin Structure Requirements

Minimal plugin for a skill:
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # Only required file
└── skills/
    └── my-skill/
        └── SKILL.md
```

The `plugin.json` only needs a name:
```json
{
  "name": "my-plugin"
}
```

---

## 2. Multi-Repo vs Monorepo for Marketplaces

### Official Anthropic Pattern: Hybrid Approach

The official `anthropics/claude-plugins-official` marketplace uses a **hybrid model**:

**Internal Plugins** (in repository):
```
claude-plugins-official/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/                    # Anthropic-managed plugins
│   ├── typescript-lsp/
│   ├── pyright-lsp/
│   ├── agent-sdk-dev/
│   └── ... (16+ plugins)
└── external_plugins/           # Third-party copies
    ├── greptile/
    ├── playwright/
    └── ... (13+ plugins)
```

**External Plugins** (referenced by Git URL):
```json
{
  "name": "atlassian",
  "source": {
    "source": "url",
    "url": "https://github.com/atlassian/atlassian-mcp-server.git"
  }
}
```

### Three Valid Organizational Patterns

#### Pattern 1: Single-Plugin Marketplace (Recommended for Focused Tools)

**Example:** `thedotmack/claude-mem`

```
claude-mem/
├── .claude-plugin/
│   └── marketplace.json       # References "./plugin"
├── plugin/                    # All plugin code here
├── src/                       # Source code
├── .mcp.json                  # MCP server definition
└── README.md
```

**marketplace.json:**
```json
{
  "name": "claude-mem",
  "plugins": [
    {
      "name": "claude-mem",
      "source": "./plugin"
    }
  ]
}
```

**Best for:**
- Focused functionality (one main purpose)
- Tight integration of components
- Simpler versioning (plugin version = repo version)
- Single-purpose tools

#### Pattern 2: Multi-Plugin Monorepo (Recommended for Collections)

**Example:** `anthropics/claude-plugins-official`

```
marketplace-repo/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── plugin-a/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/
│   │   └── commands/
│   ├── plugin-b/
│   │   ├── .claude-plugin/plugin.json
│   │   └── agents/
│   └── plugin-c/
└── external_plugins/          # Optional: copies of external plugins
```

**marketplace.json:**
```json
{
  "name": "company-tools",
  "plugins": [
    {
      "name": "plugin-a",
      "source": "./plugins/plugin-a"
    },
    {
      "name": "plugin-b",
      "source": "./plugins/plugin-b"
    }
  ]
}
```

**Best for:**
- Curated collections of related tools
- Organizational toolkits
- Shared infrastructure across plugins
- Central maintenance of multiple plugins

#### Pattern 3: External Reference Marketplace (Recommended for Aggregators)

**Example:** Community marketplace aggregating various sources

```
marketplace-repo/
├── .claude-plugin/
│   └── marketplace.json       # Only this file needed
└── README.md
```

**marketplace.json:**
```json
{
  "name": "community-tools",
  "plugins": [
    {
      "name": "tool-a",
      "source": {
        "source": "github",
        "repo": "org-a/tool-a"
      }
    },
    {
      "name": "tool-b",
      "source": {
        "source": "url",
        "url": "https://gitlab.com/org-b/tool-b.git"
      }
    }
  ]
}
```

**Best for:**
- Curated lists of plugins from various sources
- Discovery/catalog marketplaces
- No plugin code maintenance
- Organizational approved plugins list

---

## 3. Including Plugins from External Repos

### Yes, Marketplaces Can Reference External Repos

Claude Code supports multiple source types for plugins:

#### Source Type 1: Relative Paths (Same Repo)
```json
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

**Limitations:** Only works with Git-based marketplace additions, not URL-based.

#### Source Type 2: GitHub Repository
```json
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",              // Optional: branch or tag
    "sha": "abc123..."            // Optional: specific commit
  }
}
```

#### Source Type 3: Git URL
```json
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git",
    "ref": "main",
    "sha": "abc123..."
  }
}
```

### Pattern Used by Official Marketplace

The `anthropics/claude-plugins-official` marketplace demonstrates all patterns:

**Internal LSP Plugins** (16 plugins):
- typescript-lsp, pyright-lsp, gopls-lsp, rust-analyzer-lsp, etc.
- Source: `"./plugins/{name}"`

**Internal Development Tools** (12+ plugins):
- agent-sdk-dev, pr-review-toolkit, code-simplifier, etc.
- Source: `"./plugins/{name}"`

**Copied External Plugins** (13 plugins):
- greptile, playwright, github, supabase, etc.
- Source: `"./external_plugins/{name}"`
- Tagged with `"tags": ["community-managed"]`

**Referenced External Plugins** (11+ plugins):
- atlassian, figma, notion, sentry, vercel, etc.
- Source: `{"source": "url", "url": "https://github.com/..."}`

---

## 4. Marketplace Organization Best Practices

### Naming Conventions

**Reserved Names (Cannot Use):**
- claude-code-marketplace
- claude-code-plugins
- claude-plugins-official
- anthropic-marketplace
- anthropic-plugins
- agent-skills
- life-sciences
- Names that impersonate official marketplaces

**Recommended Formats:**
- `{org}-tools` - e.g., "acme-tools"
- `{org}-plugins` - e.g., "devcoffee-plugins"
- `{topic}-marketplace` - e.g., "data-science-marketplace"
- Use kebab-case, no spaces

### Marketplace Categories

From official marketplace analysis:

**Common Categories:**
- development - Code quality, LSP, development tools
- productivity - Workflow automation, project management
- testing - Test frameworks, QA tools
- design - UI/UX tools, Figma integration
- deployment - CI/CD, infrastructure
- monitoring - Error tracking, analytics
- database - Data access, queries
- security - Security scanning, compliance
- learning - Documentation, examples

### Version Management

**Semantic Versioning:**
```json
{
  "version": "MAJOR.MINOR.PATCH"
}
```

- MAJOR: Breaking changes
- MINOR: New features (backward-compatible)
- PATCH: Bug fixes (backward-compatible)

**Pin External Plugins:**
```json
{
  "name": "external-plugin",
  "source": {
    "source": "github",
    "repo": "org/plugin",
    "ref": "v2.0.0",              // Pin to stable release
    "sha": "abc123..."            // Optional: exact commit
  }
}
```

### Quality Control Patterns

**Anthropic's Approach:**

1. **Internal plugins** → Direct maintenance, standard PR workflow
2. **External plugins (copied)** → Reviewed copy in `external_plugins/`, tagged as "community-managed"
3. **External plugins (referenced)** → Git URL, no local copy, user installs from source

**Community Approaches:**

1. **Single-plugin repos** → Simple, focused, version = repo version
2. **Curated collections** → Manual review, approval process
3. **Aggregator lists** → Discovery focus, minimal vetting

---

## 5. Case Study: Official Marketplace Structure

### anthropics/claude-plugins-official Analysis

**Repository Stats:**
- 6.4k stars
- 618 forks
- 40+ plugins
- 9 contributors

**Organization:**
```
claude-plugins-official/
├── .claude-plugin/
│   └── marketplace.json        # ~2000 lines, comprehensive
├── .github/workflows/          # CI/CD for validation
├── plugins/                    # 16 LSP + 12 dev tools = 28 internal
│   ├── typescript-lsp/
│   ├── pyright-lsp/
│   ├── agent-sdk-dev/
│   └── ...
└── external_plugins/           # 13 community plugins (copies)
    ├── greptile/
    ├── playwright/
    └── ...
```

**Plugin Distribution:**
- **28 internal plugins** - Anthropic-maintained, relative paths
- **13 copied external** - Community plugins, local copy with "community-managed" tag
- **11+ referenced external** - Git URLs to external repos (Atlassian, Figma, Notion, etc.)

**Key Insights:**

1. **Hybrid approach works** - Mix internal, copied external, and referenced external
2. **Tags indicate ownership** - `"tags": ["community-managed"]` for non-Anthropic plugins
3. **Extended timeouts** - Some LSP servers need `"startupTimeout": 120000`
4. **Comprehensive descriptions** - Each plugin has clear, detailed description
5. **Homepage links** - All plugins include homepage/repository URLs

---

## 6. Decision Framework: Should You Create a New Marketplace?

### Create Separate Marketplace When:

**Factors favoring separate marketplace:**
- ✅ Different domain/purpose from existing marketplace
- ✅ Different versioning/release cadence
- ✅ Different maintainers/ownership
- ✅ Target different user audience
- ✅ Want independent branding
- ✅ Need different quality control process

**Example:** remotion-best-practices skill
- Domain: Video creation with Remotion (specialized)
- Audience: Remotion developers (niche)
- Content: 25+ domain-specific rules
- **Recommendation:** Could be separate marketplace OR added to devcoffee

### Add to Existing Marketplace When:

**Factors favoring existing marketplace:**
- ✅ Same organization/brand
- ✅ Related functionality
- ✅ Shared maintenance team
- ✅ Complementary tools
- ✅ Same target audience
- ✅ Shared infrastructure

**Example:** Adding remotion-best-practices to devcoffee marketplace
- Brand: Both from Dev Coffee
- Audience: Developers using Claude Code
- Maintenance: Same maintainer
- **Recommendation:** Good fit for existing marketplace

---

## 7. Recommendation for remotion-best-practices Skill

### Current State

**Location:** `/home/maskkiller/projects/remotion-skill/.agents/skills/remotion-best-practices/`

**Structure:**
```
.agents/skills/remotion-best-practices/
├── SKILL.md                    # 3.4k, comprehensive with 25+ rule references
└── rules/
    ├── 3d.md
    ├── animations.md
    ├── audio.md
    └── ... (25+ files)
```

**Current Usage:** Standalone skill, works locally in `.agents/` format

### Three Options

#### Option 1: Keep as Standalone Skill (Simplest)

**Pros:**
- Already works perfectly
- No packaging required
- Can be copied to any project's `.claude/skills/` directory
- Immediate use in Remotion projects

**Cons:**
- Not discoverable via marketplace
- Manual distribution (copy/paste)
- No version management
- No update mechanism

**Best for:** Personal use, Remotion-specific projects

#### Option 2: Create Dedicated remotion-tools Marketplace (Most Focused)

**Pros:**
- Clear branding for Remotion ecosystem
- Room to grow (more Remotion plugins/skills)
- Focused user audience
- Independent versioning
- Could attract Remotion community contributions

**Cons:**
- More maintenance (separate repo)
- Smaller discovery (niche audience)
- More overhead for one skill

**Structure:**
```
remotion-tools-marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── remotion-best-practices/
│       ├── .claude-plugin/plugin.json
│       └── skills/
│           └── remotion-best-practices/
│               ├── SKILL.md
│               └── rules/
└── README.md
```

**marketplace.json:**
```json
{
  "name": "remotion-tools",
  "owner": {
    "name": "Dev Coffee"
  },
  "metadata": {
    "description": "Tools and best practices for Remotion video development"
  },
  "plugins": [
    {
      "name": "remotion-best-practices",
      "source": "./plugins/remotion-best-practices",
      "description": "Comprehensive best practices for Remotion - 25+ domain-specific rules covering animations, audio, compositions, and more",
      "version": "1.0.0",
      "keywords": ["remotion", "video", "react", "animation"],
      "category": "development"
    }
  ]
}
```

**Best for:** If planning to add more Remotion tools, or want Remotion community focus

#### Option 3: Add to devcoffee-marketplace (Recommended)

**Pros:**
- Leverages existing marketplace infrastructure
- Broader discovery (devcoffee brand)
- Single maintenance point
- Fits "productivity tools" theme
- Easy to add more domain-specific skills later
- Lower overhead

**Cons:**
- Mixed domains in one marketplace
- Less Remotion-specific branding

**Implementation:**

1. **Convert skill to plugin structure:**
```
devcoffee-agent-skills/
├── .claude-plugin/marketplace.json
├── devcoffee/                          # Existing plugin
└── remotion-best-practices/            # New plugin
    ├── .claude-plugin/
    │   └── plugin.json
    └── skills/
        └── remotion-best-practices/
            ├── SKILL.md
            └── rules/
```

2. **Update marketplace.json:**
```json
{
  "name": "devcoffee-marketplace",
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee",
      "description": "Automated code review cycles...",
      "version": "0.1.0",
      "keywords": ["code-quality", "review", "automation"],
      "category": "development"
    },
    {
      "name": "remotion-best-practices",
      "source": "./remotion-best-practices",
      "description": "Best practices for Remotion video development - 25+ domain-specific rules",
      "version": "1.0.0",
      "keywords": ["remotion", "video", "react", "animation", "best-practices"],
      "category": "development"
    }
  ]
}
```

**Best for:** Most situations, especially if you want to grow devcoffee brand

---

## 8. Implementation Patterns from Community

### Pattern: Skills-Only Plugin

Many successful plugins are skills-only, no commands/agents/hooks:

**Example Structure:**
```
skills-plugin/
├── .claude-plugin/
│   └── plugin.json              # Just name + metadata
└── skills/
    ├── skill-a/
    │   ├── SKILL.md
    │   └── examples/
    └── skill-b/
        └── SKILL.md
```

### Pattern: External Reference Only

Some marketplaces are just curated lists:

**VoltAgent/awesome-agent-skills approach:**
- No plugin code in repo
- Just documentation and references
- Links to 200+ skills from various sources
- Acts as discovery hub

**Potential for devcoffee:**
```json
{
  "name": "devcoffee-marketplace",
  "plugins": [
    {
      "name": "devcoffee",
      "source": "./devcoffee"
    },
    {
      "name": "remotion-best-practices",
      "source": {
        "source": "github",
        "repo": "maskkiller/remotion-tools"
      }
    }
  ]
}
```

---

## 9. Best Practices Summary

### Marketplace Organization

**DO:**
- ✅ Use clear, descriptive marketplace names
- ✅ Provide comprehensive plugin descriptions
- ✅ Include homepage/repository URLs
- ✅ Tag external plugins with "community-managed"
- ✅ Pin external plugin versions with ref/sha
- ✅ Use semantic versioning
- ✅ Organize by category
- ✅ Document installation instructions

**DON'T:**
- ❌ Use reserved marketplace names
- ❌ Mix unrelated functionality without clear organization
- ❌ Forget to validate marketplace.json before publishing
- ❌ Reference unstable/main branches without pinning
- ❌ Skip version numbers

### Plugin Structure

**DO:**
- ✅ Keep plugin.json minimal (just name required)
- ✅ Use `${CLAUDE_PLUGIN_ROOT}` for paths in hooks/MCP
- ✅ Place components at plugin root, not in .claude-plugin/
- ✅ Include README with usage examples
- ✅ Test with `claude plugin validate`

**DON'T:**
- ❌ Put commands/agents/skills inside .claude-plugin/
- ❌ Use absolute paths or path traversal (..)
- ❌ Forget to make scripts executable (chmod +x)
- ❌ Skip the plugin.json file

### Skills

**DO:**
- ✅ Use standalone `.claude/skills/` for personal/project-specific skills
- ✅ Package as plugin when sharing via marketplace
- ✅ Include comprehensive SKILL.md with examples
- ✅ Organize supporting files in skill directory

**DON'T:**
- ❌ Over-engineer simple skills with plugin structure if not sharing
- ❌ Forget frontmatter in SKILL.md
- ❌ Skip description field (Claude uses it for discovery)

---

## 10. Specific Recommendations

### For remotion-best-practices:

**Primary Recommendation: Add to devcoffee-marketplace (Option 3)**

**Rationale:**
1. Same maintainer/brand
2. Complementary audience (Claude Code developers)
3. Lower maintenance overhead
4. Easier to grow collection of domain-specific skills
5. Single marketplace for users to discover

**Alternative: Keep standalone** if:
- Only using in your Remotion projects
- Don't need to share with others
- Want maximum simplicity

### For future skills/plugins:

**Create new marketplace when:**
- Different domain entirely (e.g., data science, DevOps)
- Different maintainer/organization
- Want to build community around specific topic
- 5+ plugins in same domain

**Add to devcoffee-marketplace when:**
- Development productivity focus
- Code quality/automation themes
- Complementary to existing plugins
- Want centralized discovery

---

## Sources

### Official Documentation
- [Create and distribute a plugin marketplace - Claude Code Docs](https://code.claude.com/docs/en/plugin-marketplaces)
- [Plugins reference - Claude Code Docs](https://code.claude.com/docs/en/plugins-reference)
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)

### Official Repositories
- [GitHub - anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)

### Community Examples
- [GitHub - thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [Claude Code Plugin Marketplace](https://claudemarketplaces.com/)
- [GitHub - quemsah/awesome-claude-plugins](https://github.com/quemsah/awesome-claude-plugins)
- [GitHub - Chat2AnyLLM/awesome-claude-plugins](https://github.com/Chat2AnyLLM/awesome-claude-plugins)

### Analysis Articles
- [Understanding Claude Code: Skills vs Commands vs Subagents vs Plugins](https://www.youngleaders.tech/p/claude-skills-commands-subagents-plugins)
- [Understanding Claude Code's Full Stack](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- [Claude Code customization guide](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)

---

## Appendix: Quick Reference

### Skills Discovery Hierarchy

1. Built-in Anthropic skills
2. Plugin-provided skills (enabled plugins)
3. User global skills (`~/.claude/skills/`)
4. Project skills (`.claude/skills/`)
5. Nested project skills (parent directories)

### Plugin Source Types

| Type | Format | Use Case |
|------|--------|----------|
| Relative | `"./path"` | Same repo |
| GitHub | `{"source": "github", "repo": "..."}` | GitHub repos |
| Git URL | `{"source": "url", "url": "..."}` | Any Git host |

### Marketplace Scopes

| Scope | File | Use |
|-------|------|-----|
| user | `~/.claude/settings.json` | Personal |
| project | `.claude/settings.json` | Team (versioned) |
| local | `.claude/settings.local.json` | Local (gitignored) |
| managed | `managed-settings.json` | Organization (read-only) |

### Validation Commands

```bash
# CLI validation
claude plugin validate .

# In Claude Code
/plugin validate .

# Debug loading
claude --debug
```

---

**Document Status:** Complete
**Last Updated:** 2026-02-04
**Maintenance:** Update when new patterns emerge from community or Anthropic
