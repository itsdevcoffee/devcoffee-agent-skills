# Workflows & Deploy

## EAS Workflows (CI/CD)

Automated CI/CD pipelines that run on EAS infrastructure. Workflow files are YAML
stored in `.eas/workflows/`.

### Create a workflow file

```bash
npx eas workflow:create
```

Interactive command that scaffolds a new workflow YAML file.

### Validate a workflow

```bash
npx eas workflow:validate <path-to-yaml> --non-interactive
```

Checks YAML syntax and configuration before running.

### Run a workflow (MUTATION)

```bash
npx eas workflow:run <path-to-yaml> --non-interactive
```

Packages the local project directory and uploads it to EAS for execution.
Use `--ref <git-ref>` to run from a specific git reference instead of local files.

### List recent workflow runs

```bash
npx eas workflow:runs --non-interactive [--json]
```

### View workflow run details

```bash
npx eas workflow:view [RUN_ID] --non-interactive [--json]
```

### Check workflow run status

```bash
npx eas workflow:status [RUN_ID] --non-interactive [--json]
```

### View workflow logs

```bash
npx eas workflow:logs [RUN_ID|JOB_ID] --non-interactive
```

Pass a run ID to select a job, or a job ID directly.

### Cancel a workflow run (MUTATION)

```bash
npx eas workflow:cancel [RUN_ID...] --non-interactive
```

Can cancel multiple runs at once.

### Workflow YAML structure

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  submit_ios:
    name: Submit to App Store
    type: submit
    needs: [build_ios]
    params:
      platform: ios
      profile: production
```

Job types: `build`, `submit`, `fingerprint`, and custom steps.

## Deploy (Web)

Deploy Expo Router web builds and API Routes. This is in preview.

### Deploy to production (MUTATION)

```bash
npx eas deploy --prod --non-interactive [--json]
```

### Deploy with custom alias (MUTATION)

```bash
npx eas deploy --alias <name> --non-interactive [--json]
```

### Deploy with custom ID (MUTATION)

```bash
npx eas deploy --id <unique-id> --non-interactive [--json]
```

### Dry run (no upload)

```bash
npx eas deploy --dry-run --non-interactive
```

Outputs a tarball instead of uploading.

### Key flags

- `--export-dir <dir>` — Directory with exported build (default: `dist`)
- `--environment <env>` — Environment for server-side env vars
- `--prod` — Create a production deployment

### Manage deployment aliases

```bash
npx eas deploy:alias <DEPLOYMENT_ID> --alias <name> --non-interactive [--json]
```

### Delete a deployment (MUTATION)

```bash
npx eas deploy:delete <DEPLOYMENT_ID> --non-interactive [--json]
```
