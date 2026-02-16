# Arc Plugin Design

**Date:** 2026-02-15
**Status:** Approved
**Plugin:** `arc/` — Standalone Claude Code plugin for Maximus Loop automation

## Problem

The existing `maximus-loop/` plugin's init skill fails in practice because the agent freestyles instead of following steps. The agent explores frameworks, dependencies, and integrations when the skill only needs 3 values from the project.

## Solution

A new standalone plugin (`arc/`) that wraps the `maximus` CLI with imperative step-sequence skills. No reference to or dependency on `maximus-loop/`.

## Architecture: Hybrid Step Machine

- **Skills** use imperative numbered steps (each step = one tool call)
- **Reference docs** hold flexible content (schemas, anti-patterns, cost formulas)
- Skills stay rigid and agent-resistant; reference docs add depth when needed

## Plugin Structure

```
arc/
├── .claude-plugin/
│   ├── plugin.json
│   └── plugin-metadata.json
├── commands/
│   ├── init.md                  # /arc:init
│   ├── validate.md              # /arc:validate
│   ├── plan.md                  # /arc:plan
│   └── review.md                # /arc:review
├── skills/
│   ├── init/
│   │   └── SKILL.md             # 4-phase imperative init
│   ├── validate/
│   │   └── SKILL.md             # CLI validation + advisories
│   ├── plan/
│   │   └── SKILL.md             # Interactive plan generation
│   └── review/
│       └── SKILL.md             # Post-run analysis
├── agents/
│   ├── init.md
│   ├── validate.md
│   ├── plan.md
│   └── review.md
├── references/
│   ├── plan-schema.md
│   ├── config-schema.md
│   ├── anti-patterns.md
│   ├── cost-estimation.md
│   ├── run-summary-schema.md
│   └── task-api.md
├── CHANGELOG.md
└── README.md
```

## Commands (Thin Wrappers)

All commands follow the same pattern:

```yaml
---
description: <user-facing description>
argument-hint: "[args]"
---
Invoke the arc:<skill-name> skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

## Skill: Init (`/arc:init`)

### Overview

4-phase initialization with conditional state handling. Each step is a single tool call — no interpretation, no exploration.

### Phase 1: Detect & Validate

| Step | Action | Tool |
|------|--------|------|
| 1 | TaskCreate: "Detect & validate existing setup" | TaskCreate |
| 2 | TaskUpdate: status → in_progress | TaskUpdate |
| 3 | Run `maximus validate --json` | Bash |
| 4 | Parse JSON → route to State A/B/C | — |

**State routing:**
- **State A** (directory check `status: "fail"`): No .maximus/ exists → Phase 2
- **State B** (directory exists, other checks fail): Show failures → Phase 2 (skip `maximus init` in Phase 3, apply targeted fixes)
- **State C** (`valid: true`): Show config_summary → AskUserQuestion "Change anything?" → if no, skip to Phase 4

### Phase 2: Analyze (3 reads only)

| Step | Action | Tool |
|------|--------|------|
| 5 | TaskCreate: "Analyze project structure" | TaskCreate |
| 6 | TaskUpdate: status → in_progress | TaskUpdate |
| 7 | Read `package.json` → extract `name` field | Read |
| 8 | Run `git log --oneline -10` → detect commit prefix | Bash |
| 9 | Run `find . -type f -not -path '...' \| wc -l` → calculate timeout | Bash |
| 10 | Print summary: Name, Timeout, Commit prefix | — |
| 11 | TaskUpdate: status → completed | TaskUpdate |

**HARD CONSTRAINT:** Steps 7-9 are the ONLY reads. No frameworks, dependencies, README, tsconfig.

**Timeout thresholds:** <100 files → 600s, 100-500 → 900s, >500 → 1200s

### Phase 3: Configure

| Step | Action | Tool |
|------|--------|------|
| 12 | TaskCreate: "Configure Maximus settings" | TaskCreate |
| 13 | TaskUpdate: status → in_progress | TaskUpdate |
| 14 | Run `maximus init` (State A only — skip for State B) | Bash |
| 15 | Read `.maximus/config.yml` | Read |
| 16 | Edit `project_name` → value from Step 7 | Edit |
| 17 | Edit `agent.timeout` → value from Step 9 | Edit |
| 18 | Edit `git.commit_prefix` → value from Step 8 | Edit |
| 19 | Write `.maximus/plan.json` → `{"version":"1.0.0","tasks":[]}` | Write |
| 20 | AskUserQuestion: "Does this config look correct?" (Yes/No) | AskUserQuestion |
| 21 | TaskUpdate: status → completed | TaskUpdate |

**HARD CONSTRAINT:** Only 3 values modified. No other edits. No Write on config.yml.

### Phase 4: Validate & Handoff

| Step | Action | Tool |
|------|--------|------|
| 22 | TaskCreate: "Validate & handoff" | TaskCreate |
| 23 | TaskUpdate: status → in_progress | TaskUpdate |
| 24 | Run `maximus validate --json` | Bash |
| 25 | If valid → print success + next steps | — |
| 26 | If invalid → attempt fix (max 2 retries) | Edit + Bash |
| 27 | TaskUpdate: status → completed | TaskUpdate |

## Skill: Validate (`/arc:validate`)

### Phase 1: CLI Validation
- Run `maximus validate --json`
- Parse checks, categorize pass/fail/warn
- If all pass → Phase 2. If failures → present clearly.

### Phase 2: Project-Aware Advisories (5 checks)
1. Timeout vs file count mismatch
2. Context files existence check
3. Escalation vs complexity_level mismatch
4. Commit prefix vs git log comparison
5. Plan health (completion status)

### Phase 3: Present Findings
- Valid/no advisories: config summary + "Ready to run"
- Valid/with advisories: config summary + advisory list
- Invalid: failure list + "Fix then re-run /arc:validate"

**Constraint:** Read-only by default.

## Skill: Plan (`/arc:plan`)

### 6 Phases with HARD-GATE

1. **Explore** — Read CLAUDE.md, package config, file tree, git log, existing plan
2. **Understand** — Ask clarifying questions (1 per message, multiple choice preferred)
3. **Propose** — Present phased task groupings with cost estimates
4. **Detail** — Task specs with acceptance criteria and complexity
5. **Validate** — Pre-write checklist (silent, only report failures)
6. **Write** — Save plan.json + next steps

**HARD-GATE:** Cannot write plan.json until user explicitly approves.

**Reference docs per phase:**
- Phase 3: `references/cost-estimation.md`
- Phase 4: `references/plan-schema.md`
- Phase 5: `references/anti-patterns.md`

**Existing plan modes:** Extend, Replace, Remove (ask user which)

## Skill: Review (`/arc:review`)

### Full Review Mode (default, 6 phases)
1. Read progress.md metadata
2. Read run-summary.json
3. Analyze patterns (failures, costs, complexity mismatches)
4. Optional code review (ask user)
5. Generate structured report with severity levels (Critical/Warning/Info)
6. Propose follow-up actions

### Quick Status Mode (`--quick`)
- Read progress.md + run-summary.json
- Output: progress %, cost, ETA, warnings
- Concise 5-line terminal output, no Task API

## Reference Docs

| File | Content | Used By |
|------|---------|---------|
| `plan-schema.md` | plan.json fields, task object spec | plan (Phase 4) |
| `config-schema.md` | config.yml fields, valid values | validate (Phase 2), init |
| `anti-patterns.md` | Failure patterns checklist | plan (Phase 5) |
| `cost-estimation.md` | Cost formulas per complexity | plan (Phase 3), review (Phase 3) |
| `run-summary-schema.md` | run-summary.json fields | review (Phase 2) |
| `task-api.md` | TaskCreate/TaskUpdate patterns | all skills |

## Marketplace Registration

Add to `.claude-plugin/marketplace.json`:

```json
{
  "name": "arc",
  "source": "./arc",
  "description": "Automation companion for the Maximus Loop CLI — project initialization, validation, task planning, and run analysis",
  "version": "0.1.0",
  "author": { "name": "Dev Coffee", "url": "https://github.com/itsdevcoffee" },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["maximus-loop", "automation", "planning", "init", "validate", "review"],
  "category": "Automation",
  "license": "MIT"
}
```

## Key Differences from maximus-loop

1. **Imperative steps** — Each step is one tool call, no interpretation
2. **Hard constraints** — "ONLY 3 reads" not "analyze the project"
3. **State routing** — Explicit A/B/C paths in init, not "check and decide"
4. **Reference docs** — Flexible content externalized from rigid skills
5. **Clean namespace** — `/arc:init` not `/maximus-loop:maximus-init`
6. **Standalone** — No imports from or references to maximus-loop plugin
