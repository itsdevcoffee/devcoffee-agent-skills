---
name: eas-cli
description: EAS CLI operations - OTA updates, builds, submissions, channels, branches via npx eas
argument-hint: [query or operation, e.g. "list production updates" or "check latest build"]
tools: Bash, Read, Grep, Glob
---

# EAS CLI Command

Operate the Expo Application Services CLI (`npx eas`) for OTA updates, builds, submissions, channels, and branches.

**Arguments received:** $ARGUMENTS

## Behavior

- If arguments provided: Execute the requested EAS operation
- If no arguments: Show a summary of available operations and ask what to do

## Output Mode Strategy

| Scenario | Flags | Reason |
|----------|-------|--------|
| Output feeds into another command | `--non-interactive --json` | Extract IDs, hashes, group IDs for chaining |
| Status check / summary for user | `--non-interactive` (no --json) | Clean, scannable, presentable |
| Mutation (publish, delete, rollback) | `--non-interactive` | Human-readable confirmation output |

Always include `--non-interactive` to prevent stdin prompts that block execution.
Exception: The `eas credentials` command requires interactive mode.

## Permission Model — CRITICAL

- **Execute freely (no confirmation needed):** Any read/query/inspect/list/view/status command
- **Always ask before executing:** Any command that creates, modifies, or deletes resources — this includes `update` (publish), `update:delete`, `update:republish`, `update:roll-back-to-embedded`, `update:edit`, `update:revert-update-rollout`, `channel:create`, `channel:edit`, `channel:pause`, `channel:resume`, `channel:rollout`, `channel:delete`, `branch:create`, `branch:rename`, `branch:delete`, `build` (trigger), `build:cancel`, `submit`

When asking for confirmation, present the exact command that will be executed.

## Core Commands Quick Reference

### OTA Updates
```bash
npx eas update:list --branch <branch> --limit <n> --non-interactive [--json]
npx eas update:view <GROUP_ID> [--json]
npx eas update --branch <branch> --message "<msg>" --platform <platform> --non-interactive  # MUTATION
npx eas update:republish --group <GROUP_ID> --non-interactive [--json]                       # MUTATION
npx eas update:roll-back-to-embedded --branch <branch> --platform <platform> --non-interactive # MUTATION
npx eas update:edit <GROUP_ID> --rollout-percentage <1-100> --non-interactive [--json]       # MUTATION
npx eas update:delete <GROUP_ID> --non-interactive [--json]                                   # MUTATION
```

### Channels
```bash
npx eas channel:list --non-interactive [--json]
npx eas channel:view <NAME> --non-interactive [--json]
npx eas channel:create <NAME> --non-interactive [--json]                                      # MUTATION
npx eas channel:edit <NAME> --branch <branch> --non-interactive [--json]                      # MUTATION
npx eas channel:pause <NAME> --non-interactive [--json]                                       # MUTATION
npx eas channel:resume <NAME> --non-interactive [--json]                                      # MUTATION
npx eas channel:rollout <CHANNEL> --action <create|edit|end|view> --non-interactive [--json]  # MUTATION (except view)
```

### Branches
```bash
npx eas branch:list --non-interactive [--json]
npx eas branch:view <NAME> --non-interactive [--json]
npx eas branch:create <NAME> --non-interactive [--json]                                       # MUTATION
npx eas branch:rename --from <old> --to <new> --non-interactive [--json]                      # MUTATION
npx eas branch:delete <NAME> --non-interactive [--json]                                       # MUTATION
```

### Builds
```bash
npx eas build:list --platform <ios|android|all> --limit <n> --non-interactive [--json]
npx eas build:view <BUILD_ID> [--json]
npx eas build --platform <ios|android|all> --profile <profile> --non-interactive [--json]     # MUTATION
npx eas build:cancel <BUILD_ID> --non-interactive [--json]                                    # MUTATION
```

### Submissions
```bash
npx eas submit --platform <ios|android|all> --profile <profile> --non-interactive             # MUTATION
```

## Common Patterns

### Check production OTA status
```bash
npx eas update:list --branch production --limit 5 --non-interactive
```

### Gradual rollout
```bash
npx eas update --branch production --message "fix: description" --platform all --rollout-percentage 25 --non-interactive
```

### Emergency rollback
```bash
# Option 1: Republish known-good update
npx eas update:republish --group <GOOD_GROUP_ID> --non-interactive

# Option 2: Roll back to embedded binary
npx eas update:roll-back-to-embedded --branch production --platform all --non-interactive
```

### Full ship cycle
```bash
npx eas build --platform ios --profile production --auto-submit --non-interactive
npx eas update --branch production --message "v1.x.x release" --platform all --non-interactive
```

## Troubleshooting

- **Auth errors:** Run `npx eas whoami --non-interactive` to check login status
- **Update not appearing:** Check channel→branch mapping with `npx eas channel:view production --non-interactive`
- **Runtime version mismatch:** Compare `runtimeVersion` between updates and builds using `--json` output
- **Fingerprint drift:** Run `npx eas fingerprint:compare --non-interactive --json` to check if new native build needed

## Extended Commands

For less common operations (credentials, env vars, workflows, webhooks, fingerprints), consult the reference files in the eas-cli skill:

- `skills/eas-cli/references/credentials-env-vars.md`
- `skills/eas-cli/references/workflows-deploy.md`
- `skills/eas-cli/references/webhooks-fingerprints.md`
- `skills/eas-cli/references/cli-flags-reference.md`

## Usage Examples

```bash
/expo-cunningham:eas-cli list production updates
/expo-cunningham:eas-cli check latest iOS build status
/expo-cunningham:eas-cli show all channels
/expo-cunningham:eas-cli                              # Interactive - asks what to do
```
