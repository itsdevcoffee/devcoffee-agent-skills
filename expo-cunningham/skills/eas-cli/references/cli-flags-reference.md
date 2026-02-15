# EAS CLI Flags Reference

## Universal Flags

These flags are available across most or all commands:

| Flag | Description |
|------|-------------|
| `--non-interactive` | Prevent stdin prompts. **Always use this flag.** |
| `--json` | Output structured JSON. Use when chaining commands or extracting values. |
| `--platform ios\|android\|all` | Target platform. Defaults vary by command. |

## Update-Specific Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--branch <name>` | update, update:list, update:republish | Target branch |
| `--channel <name>` | update, update:republish | Target channel |
| `--message <msg>` | update, update:republish | Description of update |
| `--rollout-percentage <1-100>` | update, update:edit, update:republish | Gradual rollout |
| `--auto` | update | Use git branch name + commit message automatically |
| `--clear-cache` | update | Clear bundler cache before publishing |
| `--skip-bundler` | update | Skip Expo CLI bundling (use pre-built dist/) |
| `--input-dir <dir>` | update | Bundle directory (default: dist) |
| `--environment <env>` | update | Server-side env vars environment |
| `--runtime-version <ver>` | update:list, update:roll-back-to-embedded | Filter by runtime version |
| `--group <id>` | update:republish, update:revert-update-rollout | Target specific update group |
| `--limit <n>` | update:list | Results per query (max 50) |
| `--offset <n>` | update:list | Pagination offset |
| `--all` | update:list | List across all branches |
| `--private-key-path <path>` | update, update:republish, update:roll-back-to-embedded | Code signing key |

## Build-Specific Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--profile <name>` | build, submit | Build/submit profile from eas.json |
| `--message <msg>` | build | Build description |
| `--clear-cache` | build | Clear build cache |
| `--auto-submit` | build | Auto-submit using same-named submit profile |
| `--auto-submit-with-profile <name>` | build | Auto-submit using specified profile |
| `--what-to-test <text>` | build, submit | TestFlight "What to Test" (iOS only) |
| `--no-wait` | build | Don't wait for build to complete |
| `--local` | build | Run build locally (experimental) |
| `--verbose-logs` | build | Verbose build output |
| `--freeze-credentials` | build | Prevent credential updates during build |
| `--status <status>` | build:list | Filter: new, in-queue, in-progress, errored, finished, canceled |
| `--distribution <type>` | build:list | Filter: store, internal, simulator |
| `--channel <name>` | build:list | Filter by channel |
| `--build-profile <name>` | build:list | Filter by profile |
| `--app-version <ver>` | build:list | Filter by app version |
| `--runtime-version <ver>` | build:list | Filter by runtime version |
| `--fingerprint-hash <hash>` | build:list | Filter by fingerprint |
| `--git-commit-hash <hash>` | build:list | Filter by git commit |

## Submit-Specific Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--latest` | submit | Submit the latest build |
| `--id <build_id>` | submit | Submit a specific build |
| `--path <file>` | submit | Submit a local .ipa/.aab file |
| `--url <url>` | submit | Submit from URL |
| `--groups <group>...` | submit | TestFlight internal groups (iOS only) |
| `--verbose-fastlane` | submit | Verbose submission logs |

## Channel-Specific Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--branch <name>` | channel:edit, channel:pause, channel:resume | Target branch |
| `--action <type>` | channel:rollout | create, edit, end, view |
| `--percent <1-100>` | channel:rollout | Rollout percentage |
| `--outcome <type>` | channel:rollout | End rollout: republish-and-revert, revert |
| `--runtime-version <ver>` | channel:rollout | Target runtime version |

## Environment Variable Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--environment <env>` | env:* | production, preview, development |
| `--name <name>` | env:create, env:get, env:update, env:delete | Variable name |
| `--value <value>` | env:create, env:update | Variable value |
| `--type string\|file` | env:create | Variable type |
| `--scope project\|account` | env:create | Variable scope |
| `--sensitive` | env:create | Write-only variable |
