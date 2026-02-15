# Maximus Loop Plugin

Complete autonomous coding workflow for the [Maximus Loop](https://github.com/itsdevcoffee/maximus-loop) engine: interactive plan generation, project initialization, configuration validation, and intelligent run analysis.

## What It Does

The Maximus Loop plugin provides four complementary skills for autonomous task execution:
- **Plan Generation** (`/maximus-plan`) - Design task plans interactively with cost estimates and validation
- **Project Initialization** (`/maximus-init`) - Smart project setup with codebase-aware configuration
- **Config Validation** (`/maximus-validate`) - Deterministic CLI checks plus project-aware advisories
- **Run Analysis** (`/maximus-review`) - Post-execution review and real-time status monitoring

## Installation

```bash
claude plugin install maximus-loop@devcoffee-marketplace
```

Or during project initialization:
```bash
maximus init  # Auto-suggests plugin installation
```

## Skills

The plugin provides four integrated skills:

### /maximus-plan
Generate task plans through interactive conversation. Explores your codebase, asks clarifying questions, proposes a phased approach, and generates a validated `plan.json` with cost estimates.

### /maximus-init
Smart project initialization that reads your codebase to generate tailored configuration instead of generic boilerplate. Detects project structure, test runners, and git conventions.

### /maximus-validate
Validate your project configuration before running the engine. Runs 6 deterministic CLI checks (directory, YAML, schema, plan, progress, gitignore) and provides project-aware advisories like timeout vs project size.

### /maximus-review
Analyze autonomous run results with full review or quick status. Supports `--quick` flag for real-time progress monitoring without the full analysis report.

## Quick Start

1. **Install the plugin:**
   ```bash
   claude plugin install maximus-loop@devcoffee-marketplace
   ```

2. **Initialize your project:**
   ```
   /maximus-init
   ```

3. **Create a task plan:**
   ```
   /maximus-plan
   ```

4. **Run the autonomous engine:**
   ```bash
   maximus run
   ```

5. **Review results:**
   ```
   /maximus-review              # Full analysis
   /maximus-review --quick      # Real-time status
   ```

## Usage

```
/maximus-plan                          # Start interactive plan session
/maximus-plan add user authentication  # Start with a feature description
/maximus-init                          # Initialize project configuration
/maximus-validate                      # Validate config before running
/maximus-review                        # Analyze completed run
/maximus-review --quick                # Quick status check
```

## The Workflow

1. **Initialize** - `/maximus-init` sets up your project configuration
   - Analyzes codebase structure, test runners, and conventions
   - Generates tailored `config.yml` instead of generic boilerplate
   - Uses `maximus validate` for detection and final verification

2. **Validate** - `/maximus-validate` checks your configuration
   - Runs 6 deterministic CLI checks (directory, YAML, schema, plan, progress, gitignore)
   - Provides project-aware advisories (timeout vs size, context files, escalation)

3. **Plan** - `/maximus-plan` designs your task breakdown
   - Explores your codebase and clarifies your goals
   - Proposes phased approach with cost estimates
   - Generates validated `plan.json` after your approval

4. **Execute** - `maximus run` runs the autonomous engine
   - Executes tasks according to your plan
   - Tracks progress and costs in real-time

5. **Review** - `/maximus-review` analyzes results
   - Full analysis: identifies patterns, failures, and recommendations
   - Quick status: real-time progress with `--quick` flag

## Plugin Structure

```
maximus-loop/
├── .claude-plugin/plugin.json              # Plugin manifest
├── agents/
│   ├── maximus-plan.md                     # /maximus-plan auto-trigger agent
│   ├── maximus-init.md                     # /maximus-init auto-trigger agent
│   ├── maximus-validate.md                 # /maximus-validate auto-trigger agent
│   └── maximus-review.md                   # /maximus-review auto-trigger agent
├── commands/
│   ├── maximus-plan.md                     # /maximus-plan slash command
│   ├── maximus-init.md                     # /maximus-init slash command
│   ├── maximus-validate.md                 # /maximus-validate slash command
│   └── maximus-review.md                   # /maximus-review slash command
├── skills/
│   ├── maximus-plan/
│   │   └── SKILL.md                        # Plan generation skill
│   ├── maximus-init/
│   │   └── SKILL.md                        # Project initialization skill
│   ├── maximus-validate/
│   │   ├── SKILL.md                        # Config validation skill
│   │   └── references/
│   │       └── config-schema.md            # Config field reference
│   └── maximus-review/
│       └── SKILL.md                        # Run analysis skill
├── references/
│   ├── plan-schema.md                      # plan.json field reference
│   ├── anti-patterns.md                    # 8 failure patterns to avoid
│   ├── cost-estimation.md                  # Pricing data and estimation formulas
│   ├── task-api.md                         # Task API reference (TaskCreate, TaskUpdate, TaskList)
│   └── run-summary-schema.md               # run-summary.json schema reference
├── examples/
│   ├── minimal-plan.json                   # 2-task example
│   └── full-plan.json                      # 10-task multi-phase example
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
