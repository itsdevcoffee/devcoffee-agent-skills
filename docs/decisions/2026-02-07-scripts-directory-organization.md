# Scripts Directory Organization

**Date:** 2026-02-07
**Status:** Implemented
**Decision:** Organize shell scripts into structured scripts/ directory

## Context

The repository root contained 10 scattered shell scripts related to plugin management, marketplace setup, and development utilities. This made it hard to:
- Find the right script for a specific task
- Understand the purpose of each script
- Maintain consistency across scripts
- Onboard new contributors

## Decision

Organize all shell scripts into a structured `scripts/` directory with three subdirectories based on purpose:

```
scripts/
├── plugin/          # Plugin installation and management
├── marketplace/     # Marketplace setup and configuration
├── utils/           # Manual registration and debugging utilities
├── README.md        # Comprehensive documentation
└── RUN.md          # Quick reference guide
```

## Organization

### Plugin Management (`plugin/`)

Core workflow scripts for local plugin development:

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `install-local-plugin.sh` | `plugin/install.sh` | Install plugin locally |
| `uninstall-local-plugin.sh` | `plugin/uninstall.sh` | Remove plugin |
| `reinstall-plugin.sh` | `plugin/reinstall.sh` | Clean reinstall |
| `test-plugin.sh` | `plugin/test-local.sh` | Test without installing |
| `diagnose-plugin.sh` | `plugin/diagnose.sh` | Debug discovery issues |

### Marketplace Management (`marketplace/`)

Scripts for marketplace setup and publishing:

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `fix-marketplace-structure.sh` | `marketplace/fix-structure.sh` | Create marketplace structure |
| `install-from-marketplace.sh` | `marketplace/install-devcoffee.sh` | Install from marketplace |
| `add-remotion-plugin.sh` | `marketplace/add-remotion.sh` | Add remotion plugin |

### Utilities (`utils/`)

Advanced/manual registration tools:

| Old Name | New Name | Purpose |
|----------|----------|---------|
| `register-local-plugin.sh` | `utils/register-manual.sh` | Manual JSON registration |
| `register-plugin-correct.sh` | `utils/register-no-local-suffix.sh` | Register without @local |

## Benefits

1. **Discoverability** - Clear directory structure makes it obvious where to find scripts
2. **Documentation** - Comprehensive README.md documents all scripts in one place
3. **Naming** - Shorter, clearer names (verb-noun pattern)
4. **Grouping** - Related scripts are together
5. **Onboarding** - New contributors can quickly understand available tools
6. **Maintenance** - Easier to maintain and update related scripts

## Implementation

All scripts were moved with git tracking:
```bash
mkdir -p scripts/{plugin,marketplace,utils}

# Plugin management
mv install-local-plugin.sh scripts/plugin/install.sh
mv uninstall-local-plugin.sh scripts/plugin/uninstall.sh
mv reinstall-plugin.sh scripts/plugin/reinstall.sh
mv diagnose-plugin.sh scripts/plugin/diagnose.sh
mv test-plugin.sh scripts/plugin/test-local.sh

# Marketplace
mv fix-marketplace-structure.sh scripts/marketplace/fix-structure.sh
mv install-from-marketplace.sh scripts/marketplace/install-devcoffee.sh
mv add-remotion-plugin.sh scripts/marketplace/add-remotion.sh

# Utils
mv register-local-plugin.sh scripts/utils/register-manual.sh
mv register-plugin-correct.sh scripts/utils/register-no-local-suffix.sh
```

## Documentation

Created comprehensive documentation:

- **`scripts/README.md`** - Full documentation for all scripts
  - Purpose and usage for each script
  - Command examples
  - Troubleshooting guide
  - Best practices
  - Dependencies and requirements

- **`scripts/RUN.md`** - Quick reference for common commands
  - Common workflows
  - Copy-paste examples
  - Restart reminders

## Migration Guide

For anyone with existing workflows:

**Old:**
```bash
./install-local-plugin.sh devcoffee ./devcoffee
./reinstall-plugin.sh
./diagnose-plugin.sh
```

**New:**
```bash
./scripts/plugin/install.sh devcoffee ./devcoffee
./scripts/plugin/reinstall.sh
./scripts/plugin/diagnose.sh
```

All scripts use absolute paths internally, so they work from any directory.

## Future Considerations

- Consider adding more scripts for common workflows
- Add tests for scripts
- Create wrapper script for common multi-step operations
- Document script templates for contributors
- Consider migrating to a more robust tool (Makefile, task runner)

## Alternatives Considered

1. **Keep scripts in root** - Rejected: clutters root, hard to maintain
2. **Use bin/ directory** - Rejected: these aren't production binaries
3. **Separate repos** - Rejected: too much overhead for small scripts
4. **No organization** - Rejected: current pain point we're solving

## References

- Scripts directory: `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/scripts/`
- Full documentation: `scripts/README.md`
- Quick reference: `scripts/RUN.md`
