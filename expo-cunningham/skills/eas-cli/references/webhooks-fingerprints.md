# Webhooks & Fingerprints

## Webhooks

Receive HTTP callbacks when EAS events occur (build completed, submission finished, etc.).

### List webhooks

```bash
npx eas webhook:list --non-interactive [--json]
```

### View a specific webhook

```bash
npx eas webhook:view <WEBHOOK_ID> --non-interactive [--json]
```

### Create a webhook (MUTATION)

```bash
npx eas webhook:create --url <endpoint> --event <event_type> --non-interactive [--json]
```

Event types: `BUILD`, `SUBMIT`.

The webhook receives a POST request with a JSON payload containing event details.
A signing secret is provided for verifying webhook authenticity.

### Update a webhook (MUTATION)

```bash
npx eas webhook:update <WEBHOOK_ID> --url <new_url> --non-interactive [--json]
```

### Delete a webhook (MUTATION)

```bash
npx eas webhook:delete <WEBHOOK_ID> --non-interactive [--json]
```

### Webhook payload structure

Build webhooks include: build ID, status, platform, artifacts, project info.
Submit webhooks include: submission ID, status, platform, project info.

Verify webhook signatures using the secret provided at creation time via
the `expo-signature` header (HMAC-SHA1).

## Fingerprints

Compare native project fingerprints to determine if a new native build is required
or if an OTA update is sufficient.

### Generate a fingerprint

```bash
npx eas fingerprint:generate --platform <ios|android> --non-interactive [--json]
```

Generates a fingerprint hash of the current project's native dependencies. This
hash changes when native code changes (new native modules, SDK upgrades, etc.)
but stays stable for JS-only changes.

### Compare fingerprints

```bash
npx eas fingerprint:compare --non-interactive [--json]
```

Compares the current project fingerprint against builds and updates to determine
compatibility.

### Key concept: Runtime Version vs Fingerprint

- **Runtime version**: A string in app.json that declares native compatibility.
  Updates are only delivered to builds with matching runtime versions.
- **Fingerprint hash**: An automatically computed hash of actual native dependencies.
  More precise than manual runtime versioning.

Use fingerprint comparison to answer: "Do I need a new native build, or can I
ship this as an OTA update?"

- Same fingerprint = OTA update is safe
- Different fingerprint = New native build required
