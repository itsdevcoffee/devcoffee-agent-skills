# Contributing to Dev Coffee Agent Skills

Thank you for your interest in contributing to Dev Coffee Agent Skills! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your contribution
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 14+ for automation scripts
- jq for JSON processing
- Claude CLI for testing plugins

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/itsdevcoffee/devcoffee-agent-skills.git
cd devcoffee-agent-skills

# Install npm dependencies (for automation scripts only)
npm install
```

## Adding a New Plugin

We use a metadata-driven approach where `plugin.json` files are the single source of truth for documentation. See the complete [Plugin Development Guide](docs/guides/PLUGIN-DEVELOPMENT.md) for detailed instructions.

### Quick Start Workflow

1. **Create plugin directory structure**
   ```bash
   mkdir -p my-plugin/.claude-plugin
   mkdir -p my-plugin/{agents,commands,skills,hooks}
   ```

2. **Write plugin.json with complete metadata**
   - Copy template from existing plugins
   - Fill in all required fields (name, version, description, tagline)
   - Add recommended fields (category, components, dependencies, installation, usage)
   - See [Plugin Development Guide](docs/guides/PLUGIN-DEVELOPMENT.md) for field reference

3. **Add plugin components**
   - Create agents, commands, skills, or hooks in appropriate directories
   - Follow existing plugin patterns

4. **Add to marketplace.json**
   - Add entry to `.claude-plugin/marketplace.json`

5. **Validate metadata**
   ```bash
   npm run readme:validate
   ```
   - Fix any errors (✗ red) - these are blockers
   - Address warnings (⚠ yellow) - these are recommended

6. **Generate README section**
   ```bash
   npm run readme:generate
   ```
   - Review output in `.readme-plugins-section.md`

7. **Manually merge into README**
   - Copy your plugin section into `README.md` between HTML markers

8. **Test locally**
   ```bash
   ./scripts/plugin/test-local.sh my-plugin
   ```

9. **Commit changes**
   ```bash
   git add my-plugin/ .claude-plugin/marketplace.json README.md
   git commit -m "feat: add my-plugin for [purpose]"
   ```

10. **Submit pull request**

### Metadata Requirements Checklist

**Required (validation errors if missing):**
- [ ] name (kebab-case: lowercase, hyphens only)
- [ ] version (semantic versioning: X.Y.Z)
- [ ] description (minimum 20 characters)
- [ ] tagline (maximum 80 characters)

**Recommended (validation warnings if missing):**
- [ ] category (media, code-quality, automation, development, standalone)
- [ ] components (list all agents, commands, skills, hooks)
- [ ] dependencies (plugins and external tools)
- [ ] installation (marketplace and setup instructions)
- [ ] usage (when to use and examples)

## README Automation

### DO ✅

- **Edit plugin.json files** as the single source of truth
- **Run validation** before committing: `npm run readme:validate`
- **Run generation** to create sections: `npm run readme:generate`
- **Review generated output** in `.readme-plugins-section.md` before merging
- **Manually copy** validated content into README.md between markers
- **Test locally** using scripts in `scripts/plugin/`

### DON'T ❌

- **Don't edit README.md directly** for plugin sections - edit plugin.json instead
- **Don't skip validation** - it catches errors early
- **Don't commit without reviewing** generated output
- **Don't guess metadata fields** - check the schema or existing plugins
- **Don't merge unvalidated content** - always run scripts first

## Testing

### Validation

```bash
# Validate all plugins
npm run readme:validate

# Validate and generate (combined)
npm run readme:check
```

### Local Plugin Testing

```bash
# Test without installing
./scripts/plugin/test-local.sh <plugin-name>

# Install plugin locally
./scripts/plugin/install.sh <plugin-name>

# Diagnose plugin issues
./scripts/plugin/diagnose.sh
```

## Code Style

- Use clear, descriptive names for agents, commands, and skills
- Follow existing patterns in the codebase
- Write concise but complete descriptions
- Include usage examples in metadata

## Commit Messages

Follow conventional commits format:

- `feat: add new plugin/feature`
- `fix: correct bug in plugin`
- `docs: update documentation`
- `chore: update dependencies/scripts`

## Pull Request Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why, not just how
3. **Testing**: Describe how you tested your changes
4. **Validation**: Include validation output showing no errors
5. **Documentation**: Update relevant docs if needed

### PR Checklist

- [ ] Validation passes (`npm run readme:validate`)
- [ ] README section generated and reviewed
- [ ] Tested locally
- [ ] Commit messages follow conventions
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)

## Project Structure

```
devcoffee-agent-skills/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration
├── docs/
│   ├── context/                  # Architecture docs
│   ├── guides/                   # Development guides
│   │   └── PLUGIN-DEVELOPMENT.md # Plugin development guide
│   ├── schemas/                  # JSON schemas
│   │   └── plugin-metadata-schema.json
│   └── templates/                # Templates
│       └── PLUGIN-README-TEMPLATE.md
├── scripts/
│   ├── plugin/                   # Plugin management scripts
│   ├── validate-plugins.js       # Validation automation
│   └── generate-readme-plugins.js # README generation
├── devcoffee/                    # Example plugin
│   ├── .claude-plugin/
│   │   └── plugin.json          # Plugin metadata (source of truth)
│   ├── agents/
│   ├── commands/
│   └── README.md
└── package.json                  # NPM scripts for automation
```

## Getting Help

- **Plugin Development**: See [docs/guides/PLUGIN-DEVELOPMENT.md](docs/guides/PLUGIN-DEVELOPMENT.md)
- **Metadata Schema**: See [docs/schemas/plugin-metadata-schema.json](docs/schemas/plugin-metadata-schema.json)
- **Examples**: Look at existing plugins (devcoffee, video-analysis, remotion-max, tldr)
- **Issues**: Open an issue on GitHub for questions or problems

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
