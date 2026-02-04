# Current Issue: Plugin Commands Not Discoverable

**TL;DR:** Plugin validates ✅, shows in list ✅, but commands/agents NOT discoverable ❌

## The Problem

```bash
# This works:
$ claude plugin validate ./devcoffee
✔ Validation passed

$ claude plugin list | grep devcoffee
  ❯ devcoffee@local
    Version: 0.1.0
    Status: ✔ enabled

# This doesn't work:
$ claude
> /dev<Tab>
  /feature-dev:feature-dev    # Shows up
  /plugin-dev:create-plugin   # Shows up
  /devcoffee:maximus          # DOES NOT SHOW UP ❌
```

## Plugin Details

- **Path:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee`
- **Structure:** Correct (`.claude-plugin/plugin.json`, `commands/maximus.md`, `agents/maximus.md`)
- **Validation:** Passes
- **Registration:** In both `installed_plugins.json` and `settings.json`
- **Command:** `/devcoffee:maximus` (should work but doesn't)
- **Agent:** `maximus` (should trigger but doesn't)

## What We Know

1. Plugin structure follows official docs exactly
2. Frontmatter format is correct (no `name` in commands, uses `tools` not `allowed-tools`)
3. Plugin shows as enabled in `claude plugin list`
4. Tried `--plugin-dir` flag - doesn't help
5. Tried manual registration - doesn't help
6. Other plugins (feature-dev, plugin-dev) work fine
7. No errors in `claude doctor` (after fixing marketplace corruption)

## The Mystery

**Why do other plugins' commands show up but ours doesn't?**

Possible causes:
- Silent error during plugin loading?
- Cache issue?
- Local plugins treated differently than marketplace plugins?
- Missing some undocumented requirement?

## Full Details

See: `docs/context/2026-02-04-devcoffee-plugin-discovery-issue.md`

## Key Question for Investigation

**How can we debug what Claude Code sees when loading plugins?**
- Is there a log file?
- Can we enable verbose plugin loading?
- Is there a plugin index/cache that needs rebuilding?
