# Credentials & Environment Variables

## Credentials Management

Manage signing credentials for iOS and Android builds.

### Interactive credentials setup

```bash
npx eas credentials --platform <ios|android>
```

Opens an interactive flow for managing certificates, provisioning profiles (iOS),
and keystores (Android). This command is inherently interactive — avoid using
`--non-interactive` unless running `credentials:configure-build`.

### Configure build credentials

```bash
npx eas credentials:configure-build --platform <ios|android> --non-interactive
```

Set up credentials specifically for building.

### Key concepts

- **iOS**: Requires distribution certificate + provisioning profile. EAS can manage
  these automatically or use manually provided credentials.
- **Android**: Requires a keystore for signing. EAS can generate and store one.
- Credentials are stored server-side on EAS unless using `--freeze-credentials` during build.

## Environment Variables

Manage server-side environment variables that are injected during builds and updates.

### List environment variables

```bash
npx eas env:list --environment <production|preview|development> --non-interactive [--json]
```

### Get a specific variable

```bash
npx eas env:get --name <VAR_NAME> --environment <env> --non-interactive [--json]
```

### Create a variable (MUTATION)

```bash
npx eas env:create --name <VAR_NAME> --value <value> --environment <env> --non-interactive
```

Flags: `--type string|file`, `--scope project|account`, `--sensitive` (write-only,
cannot be read back).

### Update a variable (MUTATION)

```bash
npx eas env:update --name <VAR_NAME> --value <new_value> --environment <env> --non-interactive
```

### Delete a variable (MUTATION)

```bash
npx eas env:delete --name <VAR_NAME> --environment <env> --non-interactive
```

### Pull env to local .env file

```bash
npx eas env:pull --environment <env> --non-interactive
```

Writes variables to a local `.env` file. Useful for local development.

### Push local .env to EAS

```bash
npx eas env:push --environment <env> --non-interactive
```

Uploads local `.env` file variables to EAS.

### Execute command with env vars

```bash
npx eas env:exec --environment <env> -- <command>
```

Runs a local command with EAS environment variables injected.

### Environments

EAS supports three environments: `production`, `preview`, `development`.
Each has its own set of variables. Variables can be scoped to a project or account-wide.
