# TLDR - Conversation Summarization for Claude Code

**Version:** 1.0.0
**Command:** `/tldr`

A Claude Code plugin that creates hyper-condensed bullet-point summaries of Claude's messages. Perfect for quickly reviewing what just happened in long conversations.

## Features

- **One command:** `/tldr` - summarizes Claude's last message
- **Smart extraction:** Captures key findings, actions, deliverables, and next steps
- **Concise output:** Max 8 bullets, 1-2 sentences each, focused on "what" not "why"
- **Zero dependencies:** Pure prompt-based, no external APIs or tools
- **Instant:** No API calls, no latency, no cost

## Installation

### Option 1: Install from Repository (Recommended)

```bash
# Clone or download this plugin
cd ~/.claude/plugins/
git clone https://github.com/itsdevcoffee/tldr.git

# Restart Claude Code or reload plugins
```

### Option 2: Manual Installation

1. Copy the `tldr/` directory to `~/.claude/plugins/tldr/`
2. Restart Claude Code
3. The `/tldr` command will be available

## Usage

After Claude provides a long response:

```bash
/tldr
```

### Example

**Claude's message:**
> I've completed the authentication implementation. Created jwt.service.ts with token generation and validation, updated user.controller.ts to use JWT middleware, added 12 passing tests, and deployed to staging. The token expiration is set to 15 minutes with refresh token support. Next steps: test with production data and monitor for issues.

**TLDR output:**
```
**TLDR:**
- Created jwt.service.ts with token generation and validation
- Updated user.controller.ts with JWT middleware
- Added 12 passing tests
- Deployed to staging with 15-minute token expiration
- Next: Test with production data and monitor
```

## How It Works

1. Reads conversation history from `~/.claude/history.jsonl`
2. Extracts Claude's last message
3. Analyzes and identifies:
   - Critical findings or root causes
   - Actions taken or recommended
   - Deliverables created (files, docs, code)
   - Next steps or decisions
4. Formats as concise bullet points (max 8)
5. Validates message length (skips if <100 words)

## Message Handling

- **Long messages (>100 words):** Summarized
- **Short messages (<100 words):** Skipped with note
- **Code-heavy messages:** Extracts file changes and key functions
- **Research summaries:** Highlights findings and recommendations
- **Planning sessions:** Groups by immediate/medium/long-term

## Output Format

**Standard format:**
```
**TLDR:**
- [Key finding or root cause]
- [Action item with context]
- [Decision or recommendation]
- [Deliverable: specific file or artifact]
- [Next step or user choice]
```

## Configuration

No configuration needed! The plugin works out of the box.

**Frontmatter:**
```yaml
---
description: Create hyper-condensed bullet-point summary of the last Claude message
allowed-tools: [Read]
---
```

## Development

### Project Structure

```
tldr/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── commands/
│   └── tldr.md                  # Command implementation
├── docs/
│   ├── evaluation/              # Evaluation system
│   │   ├── EVALUATION.md        # Scoring criteria and workflow
│   │   ├── evaluation-log.md    # Summary of all samples
│   │   └── samples/             # Individual evaluation samples
│   └── design/                  # Design documentation
│       ├── tldr-plugin-design.md
│       └── tldr-implementation-patterns.md
├── README.md                    # This file
└── CLAUDE.md                    # Instructions for Claude Code
```

### Evaluation System

This plugin includes a comprehensive evaluation system to track quality and drive improvements:

- **Scoring criteria:** Completeness, Conciseness, Actionability, Accuracy (0.0-10.0)
- **Sample collection:** Real-world usage data
- **Pattern analysis:** Identify strengths and weaknesses
- **Iterative improvement:** Data-driven v1.1 planning

See `docs/evaluation/EVALUATION.md` for details.

## Roadmap

### v1.0 (Current)
- ✅ Single command: `/tldr`
- ✅ Last message summarization
- ✅ Bullet-point format
- ✅ No dependencies

### v1.1 (Planned)
- Format options: `/tldr actions`, `/tldr timeline`, `/tldr files`
- Better handling of multi-block content
- Improved consistency based on evaluation data

### v1.2 (Future)
- Range selection: `/tldr 3` (last 3 messages)
- Export: `/tldr export` saves to handoff docs
- Session summarization: `/tldr session`

### v2.0 (Future)
- Auto-TLDR integration with output styles
- Session-end summary generation
- Cross-session pattern detection

## Contributing

Contributions welcome! Please see:
- Evaluation system: `docs/evaluation/EVALUATION.md`
- Design documentation: `docs/design/`
- Submit issues and PRs to the repository

## License

MIT License - see LICENSE file for details

## Support

- **Issues:** https://github.com/itsdevcoffee/tldr/issues
- **Documentation:** https://github.com/itsdevcoffee/tldr
- **Dev Coffee:** https://github.com/itsdevcoffee

## Credits

Created by [Dev Coffee](https://github.com/itsdevcoffee) as part of the Claude Code plugin ecosystem.

**Related plugins:**
- [devcoffee](https://github.com/itsdevcoffee/devcoffee-agent-skills) - Feature implementation and code quality tools
