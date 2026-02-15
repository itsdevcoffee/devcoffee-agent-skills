# Dev Coffee Agent Skills

## Pre-Commit Checklist (MANDATORY)

**Before committing ANY changes to plugin source files, verify:**

- [ ] **CHANGELOG.md** — Add entries under `[Unreleased]` for user-facing changes
- [ ] **Version bump** — If releasing: update version in `<plugin>/.claude-plugin/plugin.json`, `<plugin>/.claude-plugin/plugin-metadata.json`, and `.claude-plugin/marketplace.json`
- [ ] **Semantic version** — MAJOR (breaking), MINOR (new features), PATCH (bug fixes)

**This applies to changes in:** `devcoffee/`, `video-analysis/`, `remotion-max/`, `maximus-loop/`, `tldr/`, `opentui-dev/`

**Skip only for:** docs-only changes, test updates, CI/build config, internal refactoring with zero user impact.

## Project Overview

**Dev Coffee Agent Skills** is a Claude Code plugin marketplace providing production-ready tools for automated feature development and code quality workflows.

**Plugins:**
- `devcoffee` - buzzminson (feature implementation) + maximus (code review)
- `maximus-loop` - Autonomous task-driven development engine
- `remotion-max` - Remotion video creation toolkit
- `tldr` - Message summarization skill
- `video-analysis` - AI-powered video analysis with Claude vision
- `opentui-dev` - Terminal UI development with @opentui/core

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
├── maximus-loop/                # Autonomous task engine
├── remotion-max/                # Remotion toolkit
├── tldr/                        # Summarization skill
├── video-analysis/              # Video analysis plugin
├── opentui-dev/                 # Terminal UI development
├── scripts/                     # Automation
│   ├── validate-plugins.js      # Metadata validation
│   ├── generate-readme-plugins.js  # README generation
│   └── plugin/                  # Plugin management (install, test, diagnose)
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

# Local plugin testing
./scripts/plugin/test-local.sh <plugin-name>    # Test without installing
./scripts/plugin/install.sh <plugin-name>       # Install plugin locally
./scripts/plugin/diagnose.sh                    # Diagnose plugin issues

# Git workflow
git pull origin main       # Update from remote
git push origin main       # Push changes
git push origin main --tags  # Push with version tags
```

## TLDR Plugin Development

TLDR evaluation and improvement workflows are handled by dedicated skills within the `tldr/` plugin:

- `/tldr:feedback` — Score and log TLDR samples (evaluation data at `tldr/docs/evaluation/`)
- `/tldr:note` — Quick-capture improvement ideas (catalog at `tldr/docs/evaluation/notes.md`)
- `/tldr:review` — Triage and implement pending notes

## CHANGELOG & Versioning

Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) + [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See CONTRIBUTING.md for detailed format, examples, and release process.

**Update CHANGELOG.md for:** new features, behavior changes, bug fixes, deprecations, removals, security fixes.
**Skip for:** internal refactoring, test updates, doc typos, CI/build config.

**Version files to update when releasing:**
- `<plugin>/.claude-plugin/plugin.json` (per-plugin version)
- `.claude-plugin/marketplace.json` (marketplace registry)

**Release flow:** Update CHANGELOG (Unreleased -> [X.Y.Z]) -> bump version files -> commit -> `git tag vX.Y.Z` -> push with tags
