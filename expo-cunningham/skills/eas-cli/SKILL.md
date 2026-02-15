---
name: eas-cli
description: >
  This skill should be used when the user asks to "check OTA updates", "list updates",
  "publish an update", "rollback update", "check builds", "list builds", "start a build",
  "cancel build", "submit to app store", "submit to play store", "manage channels",
  "create channel", "pause channel", "manage branches", "create branch", "EAS CLI",
  "npx eas", "check build status", "view update details", "channel rollout",
  "roll back to embedded", "manage credentials", "set environment variables",
  "create webhook", "compare fingerprints", "run workflow", "deploy web app",
  "eas deploy", or any task involving Expo Application Services CLI operations.
---

# EAS CLI Skill

Procedural knowledge for operating the Expo Application Services CLI (`npx eas`) covering
OTA updates, builds, submissions, channels, and branches. All commands run via `npx eas`
in a Bash shell.

## Output Mode Strategy

Apply this output strategy to every command:

| Scenario | Flags | Reason |
|----------|-------|--------|
| Output feeds into another command | `--non-interactive --json` | Extract IDs, hashes, group IDs for chaining |
| Status check / summary for user | `--non-interactive` (no --json) | Clean, scannable, presentable |
| Mutation (publish, delete, rollback) | `--non-interactive` | Human-readable confirmation output |

Always include `--non-interactive` to prevent stdin prompts that block execution.
Exception: The `eas credentials` command requires interactive mode for credential selection flows.

## Permission Model

- **Read/query commands** — Execute freely without asking: `list`, `view`, `status`
- **Mutation commands** — Always confirm with user before executing: `update` (publish), `delete`, `rollback`, `republish`, `channel:edit`, `channel:pause`, `build` (trigger), `submit`, `branch:delete`

## OTA Updates

The most critical command group. Manages over-the-air JavaScript bundle updates.

### List updates on a branch

```bash
npx eas update:list --branch <branch> --limit <n> --non-interactive [--json]
```

Key flags: `--branch` (required unless `--all`), `--all`, `--platform android|ios|all`,
`--runtime-version <ver>`, `--limit` (default: 25, max: 50), `--offset` (pagination).

### View update group details

```bash
npx eas update:view <GROUP_ID> [--json]
```

Takes a group ID (the `group` field in `update:list --json` output).

### Publish an update (MUTATION)

```bash
npx eas update --branch <branch> --message "<msg>" --platform <platform> --non-interactive
```

Key flags: `--branch` or `--channel` (target), `--message` (required description),
`--platform android|ios|all`, `--rollout-percentage <1-100>` (gradual rollout),
`--auto` (uses current git branch + commit message), `--clear-cache`, `--skip-bundler`,
`--environment <env>` (server-side env vars).

### Republish / roll back to previous update (MUTATION)

```bash
npx eas update:republish --group <GROUP_ID> --non-interactive [--json]
```

Rolls back by republishing a previous update group. Can target via `--channel`, `--branch`,
or `--group`. Supports `--destination-branch`/`--destination-channel` for cross-branch republish.
Supports `--rollout-percentage`.

### Roll back to embedded (MUTATION)

```bash
npx eas update:roll-back-to-embedded --branch <branch> --platform <platform> --non-interactive
```

Reverts users to the JS bundle embedded in the native binary. Use when an OTA update
is broken and no previous update is safe.

### Edit update rollout percentage (MUTATION)

```bash
npx eas update:edit <GROUP_ID> --rollout-percentage <1-100> --non-interactive [--json]
```

Adjust the rollout percentage of an existing update group.

### Revert a rollout update (MUTATION)

```bash
npx eas update:revert-update-rollout --group <GROUP_ID> --non-interactive [--json]
```

Reverts a rollout update. Can target via `--channel`, `--branch`, or `--group`.

### Delete an update group (MUTATION)

```bash
npx eas update:delete <GROUP_ID> --non-interactive [--json]
```

Permanently deletes all updates in a group.

## Channels

Channels map to branches and control which updates users receive.

### List all channels

```bash
npx eas channel:list --non-interactive [--json]
```

### View a specific channel

```bash
npx eas channel:view <NAME> --non-interactive [--json]
```

### Create a channel (MUTATION)

```bash
npx eas channel:create <NAME> --non-interactive [--json]
```

### Point channel to a different branch (MUTATION)

```bash
npx eas channel:edit <NAME> --branch <branch> --non-interactive [--json]
```

### Pause / resume a channel (MUTATION)

```bash
npx eas channel:pause <NAME> --non-interactive [--json]
npx eas channel:resume <NAME> --non-interactive [--json]
```

Pausing stops sending updates to users on that channel.

### Channel rollout (MUTATION)

```bash
npx eas channel:rollout <CHANNEL> --action create --branch <branch> --percent <1-100> --non-interactive [--json]
npx eas channel:rollout <CHANNEL> --action edit --percent <new-pct> --non-interactive [--json]
npx eas channel:rollout <CHANNEL> --action end --outcome republish-and-revert|revert --non-interactive [--json]
npx eas channel:rollout <CHANNEL> --action view --non-interactive [--json]
```

Incrementally roll a new branch out on a channel. Actions: `create`, `edit`, `end`, `view`.

### Delete a channel (MUTATION)

```bash
npx eas channel:delete <NAME> --non-interactive [--json]
```

## Branches

Branches hold update groups. Each channel points to one branch.

### List / view / create / rename / delete

```bash
npx eas branch:list --non-interactive [--json]
npx eas branch:view <NAME> --non-interactive [--json]
npx eas branch:create <NAME> --non-interactive [--json]        # MUTATION
npx eas branch:rename --from <old> --to <new> --non-interactive [--json]  # MUTATION
npx eas branch:delete <NAME> --non-interactive [--json]        # MUTATION
```

## Builds

Trigger and monitor native app builds on EAS infrastructure.

### List builds

```bash
npx eas build:list --platform <ios|android|all> --limit <n> --non-interactive [--json]
```

Key filters: `--status` (new|in-queue|in-progress|errored|finished|canceled),
`--distribution` (store|internal|simulator), `--channel`, `--build-profile`,
`--app-version`, `--runtime-version`, `--fingerprint-hash`.

### View a specific build

```bash
npx eas build:view <BUILD_ID> [--json]
```

To extract build log URLs, use `--json` and read the `logFiles` array.

### Trigger a build (MUTATION)

```bash
npx eas build --platform <ios|android|all> --profile <profile> --non-interactive [--json]
```

Key flags: `--profile` (from eas.json, defaults to "production"), `--message`,
`--clear-cache`, `--auto-submit` / `--auto-submit-with-profile`, `--no-wait`,
`--what-to-test` (TestFlight description, iOS only).

### Cancel a build (MUTATION)

```bash
npx eas build:cancel <BUILD_ID> --non-interactive [--json]
```

## Submissions

Submit completed builds to App Store or Google Play.

### Submit a build (MUTATION)

```bash
npx eas submit --platform <ios|android|all> --profile <profile> --non-interactive
```

Key flags: `--latest` (submit latest build), `--id <BUILD_ID>` (specific build),
`--path` (local file), `--url` (archive URL), `--profile` (from eas.json),
`--what-to-test` (TestFlight, iOS only), `--groups` (TestFlight internal groups, iOS only).

## Common Patterns

### Check current OTA status for production

```bash
npx eas update:list --branch production --limit 5 --non-interactive
```

### Publish OTA update to production with gradual rollout

```bash
npx eas update --branch production --message "fix: description" --platform all --rollout-percentage 25 --non-interactive
```

### Emergency rollback

```bash
# Option 1: Republish a known-good previous update
npx eas update:republish --group <GOOD_GROUP_ID> --non-interactive

# Option 2: Roll back to the embedded binary bundle
npx eas update:roll-back-to-embedded --branch production --platform all --non-interactive
```

### Full ship cycle: build, submit, OTA

```bash
# 1. Trigger production build
npx eas build --platform ios --profile production --auto-submit --non-interactive

# 2. After build completes, publish OTA update
npx eas update --branch production --message "v1.x.x release" --platform all --non-interactive
```

## Troubleshooting

### Authentication

If commands fail with authentication errors, verify login status:

```bash
npx eas whoami --non-interactive
```

If not authenticated, run `npx eas login --non-interactive` (requires EXPO_TOKEN env var)
or direct the user to run `npx eas login` interactively.

### Runtime version mismatch

OTA updates only deliver to builds with a matching runtime version. If an update appears
published but users don't receive it, compare the update's runtime version against the
installed build's runtime version.

```bash
# Check update runtime versions
npx eas update:list --branch production --limit 3 --non-interactive --json

# Check build runtime versions
npx eas build:list --platform ios --limit 3 --non-interactive --json
```

The `runtimeVersion` field must match between update and build.

### Fingerprint drift

When native dependencies change (new native modules, SDK upgrade), the fingerprint hash
changes. Use fingerprint comparison to determine if a new native build is required:

```bash
npx eas fingerprint:compare --non-interactive --json
```

Same fingerprint = OTA update is safe. Different fingerprint = new native build required.
See `references/webhooks-fingerprints.md` for details.

### Update not appearing

If an update was published but users don't see it:

1. Verify the update exists: `npx eas update:list --branch production --limit 1 --non-interactive`
2. Check the channel points to the correct branch: `npx eas channel:view production --non-interactive`
3. Verify runtime version matches the installed build
4. Check if the channel is paused: look for `isPaused: true` in channel view output
5. If using rollout, verify the rollout percentage: `npx eas update:view <GROUP_ID> --json`

## Additional Resources

### Reference Files

To handle tasks not covered above, read the relevant reference file before executing:

- **`references/credentials-env-vars.md`** — Credential management and environment variables
- **`references/workflows-deploy.md`** — EAS Workflows (CI/CD) and web deployments
- **`references/webhooks-fingerprints.md`** — Webhook management and fingerprint comparison
- **`references/cli-flags-reference.md`** — Comprehensive flag reference across all commands
