# Dev Coffee Agent Skills

## Project Overview

**Dev Coffee Agent Skills** is a Claude Code plugin marketplace providing production-ready tools for automated feature development and code quality workflows.

**Plugins:**
- `devcoffee` - buzzminson (feature implementation) + maximus (code review)
- `video-analysis` - AI-powered video analysis with Claude vision
- `remotion-max` - Remotion video creation toolkit
- `tldr` - Message summarization skill

**Repository:** https://github.com/itsdevcoffee/devcoffee-agent-skills

## Quick Start

```bash
# Install devcoffee plugin
claude plugin install devcoffee@devcoffee-marketplace

# Update plugin after pulling changes
git pull origin main
claude plugin update devcoffee@devcoffee-marketplace

# Validate plugin metadata
npm run readme:validate

# Generate README sections from metadata
npm run readme:generate
```

## Architecture

```
devcoffee-agent-skills/          # Plugin marketplace monorepo
├── devcoffee/                   # Main plugin (buzzminson + maximus)
│   ├── agents/                  # Agent definitions (.md)
│   ├── commands/                # Slash commands (.md)
│   ├── skills/                  # Invocable skills (.md)
│   └── references/              # Templates and examples
├── video-analysis/              # Video analysis plugin
├── remotion-max/                # Remotion toolkit
├── tldr/                        # Standalone summarization skill
├── scripts/                     # Automation (validation, generation)
│   ├── validate-plugins.js      # Metadata validation
│   └── generate-readme-plugins.js  # README generation
├── docs/                        # Project documentation
│   ├── buzzminson/              # Implementation logs
│   ├── research/                # Technical research
│   ├── guides/                  # Development guides
│   └── templates/               # Documentation templates
└── examples/                    # Demo projects
```

**Plugin Structure:** Each plugin follows Claude Code conventions with agents/, commands/, skills/, and .claude-plugin/plugin.json

## Development Commands

```bash
# Plugin management
claude plugin install devcoffee@devcoffee-marketplace
claude plugin update devcoffee@devcoffee-marketplace
claude plugin uninstall devcoffee@devcoffee-marketplace

# README automation
npm run readme:validate    # Validate plugin metadata
npm run readme:generate    # Generate README sections
npm run readme:check       # Validate + generate

# Testing
npm test                   # Run validation tests

# Git workflow
git pull origin main       # Update from remote
git push origin main       # Push changes
git push origin main --tags  # Push with version tags
```

## Documentation

Files go in `docs/` except for obvious exceptions: README.md, CLAUDE.md, LICENSE.md, CONTRIBUTING.md, AGENT.md, ... (root only).

**Subdirectories:**

- `context/` - Architecture, domain knowledge, static reference
- `decisions/` - Architecture Decision Records (ADRs)
- `handoff/` - Session state for development continuity
- `project/` - Planning: todos, features, roadmap
- `research/` - Explorations, comparisons, technical analysis
- `tmp/` - Scratch files (safe to delete)

**Naming:** `YYYY-MM-DD-descriptive-name.md` (lowercase, hyphens)

**Rules:**

- Update existing docs before creating new ones
- Use `tmp/` when uncertain, flag for review

## Context7 & Documentation Protocol

- **Trigger:** You MUST use the `context7` MCP tool specifically when I ask for:
  1. Code generation involving 3rd-party libraries.
  2. Installation or setup steps for a library.
  3. The latest API documentation or reference material.
- **Constraint:** Do NOT use this tool for general logic questions, standard language syntax (e.g. vanilla JS/TS), or when I explicitly provide the code context.
- **Action:** When the trigger is met, automatically resolve the library ID and fetch docs without asking for permission first.

## TLDR Command Evaluation

When evaluating TLDR command outputs (user says "rate this tldr" or shares samples), read `docs/tldr-evaluation/EVALUATION.md` first for the complete evaluation system, scoring criteria, and workflow instructions.

**Quick reference:**
- Evaluation system: `docs/tldr-evaluation/EVALUATION.md`
- Summary log: `docs/tldr-evaluation/evaluation-log.md`
- Individual samples: `docs/tldr-evaluation/samples/`

**Scoring criteria:** Completeness, Conciseness, Actionability, Accuracy (0.0-10.0 scale)

## CHANGELOG Maintenance

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Treat agents as versioned software requiring rigorous lifecycle controls.

### When to Update CHANGELOG

**ALWAYS update CHANGELOG.md for:**
- ✅ New features (Added)
- ✅ Changes to existing functionality (Changed)
- ✅ Bug fixes (Fixed)
- ✅ Deprecated features (Deprecated)
- ✅ Removed features (Removed)
- ✅ Security fixes (Security)
- ✅ Breaking changes (highlight in description)

**DO NOT update CHANGELOG for:**
- ❌ Internal refactoring with no user impact
- ❌ Test updates
- ❌ Documentation typos
- ❌ Build/CI configuration changes

### Version Numbering (Semantic Versioning)

**Format:** MAJOR.MINOR.PATCH

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.1.0 → 0.2.0): New features, backward compatible
- **PATCH** (0.1.0 → 0.1.1): Bug fixes, backward compatible

**Examples:**
- New agent added → MINOR bump
- Agent behavior changed (breaking) → MAJOR bump
- Bug fix in existing agent → PATCH bump

### Update Process

**1. Update CHANGELOG.md:**
```markdown
## [Unreleased]

### Added
- New feature description with context

### Changed
- Description of what changed and why

### Fixed
- Bug fix description with impact
```

**2. Update version files when releasing:**
- `devcoffee/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

**3. Move Unreleased to versioned section:**
```markdown
## [0.3.1] - 2026-02-07

### Added
- ...
```

### Entry Format

**Good entries:**
```markdown
### Added
- **Video analysis skill** - AI-powered frame extraction and vision analysis using Claude 4.x
- **Success criteria checkboxes** in buzzminson agent for self-validation at each phase
```

**Bad entries:**
```markdown
### Added
- Added stuff (❌ too vague)
- Fixed bug (❌ no context, wrong category)
```

**For breaking changes, highlight prominently:**
```markdown
## [2.0.0] - 2026-02-07

### Changed
- **BREAKING:** Maximus now runs in review-only mode by default
  - Old: `/devcoffee:maximus` automatically fixes issues
  - New: `/devcoffee:maximus` reviews only, use `--yolo` for auto-fix
  - Migration: Add `--yolo` flag for autonomous fixes

### Migration Guide
[Detailed migration instructions]
```

### Automation Guidelines

**When making commits:**
1. Check if changes are user-facing
2. If yes → add CHANGELOG entry BEFORE committing
3. Group related changes in single version entry
4. Use present tense ("Add feature", not "Added feature")

**When releasing:**
1. Update CHANGELOG: Unreleased → [X.Y.Z]
2. Update version in plugin.json and marketplace.json
3. Commit: `chore: bump version to X.Y.Z`
4. Tag: `git tag vX.Y.Z`
5. Push: `git push origin main --tags`

### Research-Backed Best Practices

**Agent versioning principles:**
- AI agents are production infrastructure requiring CI/CD discipline
- Every change should be tracked, tested, and deployed with confidence
- Tool versioning causes 60% of production agent failures - maintain strict API contracts

**Key insight:** Agents should be treated with the same rigor as traditional software, combining Keep a Changelog and semantic versioning with modern automation workflows.

**Reference:** This section follows industry best practices as documented in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), [Semantic Versioning](https://semver.org/spec/v2.0.0.html), and AI agent lifecycle management research on treating agents as deployable software.
