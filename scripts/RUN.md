# Quick Run Guide

Common script commands for quick reference. See [README.md](./README.md) for full documentation.

## Plugin Development

```bash
# Install plugin locally
./scripts/plugin/install.sh devcoffee ./devcoffee

# Test without installing
./scripts/plugin/test-local.sh

# Clean reinstall
./scripts/plugin/reinstall.sh

# Diagnose issues
./scripts/plugin/diagnose.sh

# Uninstall
./scripts/plugin/uninstall.sh devcoffee
```

## Marketplace

```bash
# Fix marketplace structure
./scripts/marketplace/fix-structure.sh

# Install from marketplace
./scripts/marketplace/install-devcoffee.sh

# Add remotion plugin
./scripts/marketplace/add-remotion.sh
```

## After Any Installation

Always restart Claude Code:
```bash
pkill -f claude && claude
```

Then test:
```bash
# In Claude Code:
/devcoffee:maximus
```
