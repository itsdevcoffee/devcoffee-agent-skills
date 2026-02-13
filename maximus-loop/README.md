# Maximus Loop Plugin

Interactive task plan generation for the [Maximus Loop](https://github.com/itsdevcoffee/maximus-loop) autonomous coding engine.

## What It Does

The `/maximus-plan` skill helps you design task plans through an interactive conversation. It explores your codebase, asks clarifying questions, proposes a phased approach, and generates a validated `plan.json` that the Maximus Loop engine can execute autonomously.

## Installation

```bash
claude plugin install maximus-loop@devcoffee-marketplace
```

Or during project initialization:
```bash
maximus init  # Auto-suggests plugin installation
```

## Usage

```
/maximus-plan                          # Start interactive plan session
/maximus-plan add user authentication  # Start with a feature description
```

## How It Works

1. **Explores** your codebase (CLAUDE.md, dependencies, file tree, git history)
2. **Asks** clarifying questions about what you want to build
3. **Proposes** a phased task breakdown with cost estimates
4. **Details** each task with acceptance criteria and testing steps
5. **Validates** the plan against 13 quality checks
6. **Writes** to `.maximus/plan.json` after your approval

## Plugin Structure

```
maximus-loop/
├── .claude-plugin/plugin.json    # Plugin manifest
├── agents/maximus-plan.md        # Auto-trigger agent definition
├── commands/maximus-plan.md      # /maximus-plan slash command
├── skills/maximus-plan.md        # Core skill (conversation flow + rules)
├── references/
│   ├── plan-schema.md            # plan.json field reference
│   ├── anti-patterns.md          # 8 failure patterns to avoid
│   └── cost-estimation.md        # Pricing data and estimation formulas
├── examples/
│   ├── minimal-plan.json         # 2-task example
│   └── full-plan.json            # 10-task multi-phase example
├── LICENSE
└── README.md
```

## After Plan Generation

```bash
# Review the plan
cat .maximus/plan.json

# IMPORTANT: Commit before running (agents may revert uncommitted changes)
git add .maximus/ && git commit -m "Add task plan"

# Run the engine
maximus run

# Monitor progress
maximus ui
```

## License

MIT
