# GitHub MCP Server Installation

## Installation Command

Run this command **outside** of your Claude Code session:

```bash
claude mcp add github --global -- npx -y @modelcontextprotocol/server-github
```

## Environment Setup

Add your GitHub token to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
```

## Verify Installation

After installation, check that the GitHub MCP server is configured:

```bash
cat ~/.mcp.json
```

You should see an entry for the GitHub server.

## Benefits for This Repo

Once installed, Claude can:
- Create and manage issues directly
- Check PR status and reviews
- Automate release workflows (create releases, manage tags)
- Query repository metadata
- Manage GitHub Actions workflows

This pairs well with the release workflow skill to fully automate version releases.

## Token Permissions

Your GitHub token should have these scopes:
- `repo` (full repository access)
- `workflow` (if managing GitHub Actions)

Create a token at: https://github.com/settings/tokens
