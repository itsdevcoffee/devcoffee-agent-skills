# TLDR Plugin Design

**Date:** 2026-02-06
**Status:** Implemented (v1.0)
**Plugin Name:** `devcoffee:tldr`
**Last Updated:** 2026-02-06 (post-validation fixes)

## Overview

A command that creates hyper-condensed bullet-point summaries of Claude's last message. Focuses on key actions, decisions, and deliverables - no fluff.

**Architecture:** Pure prompt-based implementation. Claude analyzes conversation history directly using Read tool - no external scripts, no API calls.

## User Experience

```bash
# User invokes after Claude's long response
/tldr

# Output
**TLDR:**
- Root cause identified: Priority markers are advisory, not enforceable
- Solution: Use hooks for deterministic enforcement
- Immediate actions: Simplify prompt to <150 lines, add XML tags
- Medium actions: Create PostToolUse hook for validation
- Deliverables: 3 research docs in docs/research/
- Next: Choose A) Templates, B) Hooks, C) Simplify, D) Review
```

## Plugin Structure

```
devcoffee/
├── .claude-plugin/
│   └── plugin.json         # Manifest (no commands array - auto-discovery)
├── commands/
│   └── tldr.md            # Command definition (prompt for Claude)
└── README.md              # Documentation
```

**Note:** Commands are auto-discovered from `commands/` directory. No explicit registration needed in manifest.

## Component Specifications

### 1. .claude-plugin/plugin.json

**Location:** `.claude-plugin/plugin.json` (not root directory)

```json
{
  "name": "devcoffee",
  "version": "0.2.1",
  "description": "Dev Coffee productivity skills for Claude Code - feature implementation with buzzminson and code quality with maximus",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["code-quality", "review", "automation", "productivity"],
  "license": "MIT"
}
```

**Key Points:**
- No `commands` array - Claude Code uses auto-discovery
- Commands in `commands/` directory are automatically registered
- Version follows existing plugin versioning

### 2. commands/tldr.md

**Supported Frontmatter Fields:**
```yaml
---
description: Create hyper-condensed bullet-point summary of the last Claude message
allowed-tools: [Read]
---
```

**Unsupported fields (removed):**
- ❌ `name` - auto-discovered from filename
- ❌ `usage` - inferred automatically
- ❌ `examples` - not used in frontmatter

**Command Body:**
- Pure prompt/instructions for Claude
- No script execution references
- Uses Read tool to access `~/.claude/history.jsonl`
- Claude analyzes the message directly using its reasoning
- No external API calls needed

**Full implementation:** See `devcoffee/commands/tldr.md`

### 3. Implementation Approach

**CHOSEN: Pure Prompt-Based (Option D)**

Commands in Claude Code are **instructions to Claude**, not shell scripts to execute. The correct pattern:

1. **Command markdown file contains:**
   - Frontmatter (metadata only)
   - Instructions for Claude on what to do
   - Examples of expected output
   - Error handling guidelines

2. **Claude executes the instructions by:**
   - Using Read tool to access `~/.claude/history.jsonl`
   - Parsing JSONL format (one JSON object per line)
   - Extracting the last assistant message
   - Analyzing content using its own reasoning
   - Formatting output as bullet points

3. **No external dependencies:**
   - No bash scripts
   - No API calls to Haiku
   - No jq or other CLI tools
   - Claude does all the work directly

**Why this approach:**
- ✅ Correct Claude Code architecture pattern
- ✅ No security vulnerabilities (no command injection)
- ✅ No API costs or rate limits
- ✅ Instant response (no external calls)
- ✅ Portable (no environment dependencies)
- ✅ Simple to maintain

## Integration Points

### Access Conversation History

**Primary location:** `~/.claude/history.jsonl`

**Format:** JSONL (one JSON object per line)
```json
{"role": "user", "content": [{"type": "text", "text": "..."}], "timestamp": "..."}
{"role": "assistant", "content": [{"type": "text", "text": "..."}], "timestamp": "..."}
```

**Access method:** Use Read tool in command prompt
- Claude reads the file directly
- Parses JSONL format
- Extracts last assistant message
- No external tools required

**Note:** Session-specific history is in `~/.claude/projects/[project-hash]/[session-id].jsonl` but using the global `history.jsonl` is simpler and more reliable for MVP.

## Future Enhancements

### Phase 2: Format Options

```bash
/tldr           # Default: bullet points
/tldr timeline  # Chronological timeline
/tldr actions   # Only action items
/tldr files     # Only files created/modified
```

### Phase 3: Range Selection

```bash
/tldr           # Last message
/tldr 3         # Last 3 messages
/tldr session   # Entire session
```

### Phase 4: Export

```bash
/tldr export    # Save to docs/handoff/YYYY-MM-DD-session-summary.md
```

### Phase 5: Auto-TLDR Hook

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": ".*",
      "hooks": [{
        "type": "prompt",
        "prompt": "If your response exceeds 500 words, append a TLDR section"
      }]
    }]
  }
}
```

## Testing Strategy

### Test Cases

1. **Short message (<100 words)** - Should skip summarization
2. **Code-heavy message** - Extract file changes, functions added
3. **Research summary** - Identify findings, recommendations, sources
4. **Multi-phase plan** - Group by immediate/medium/long-term
5. **Error/debug message** - Highlight root cause and fix
6. **Question-heavy message** - List decision points

### Validation

- Compare TLDR to manual summary
- Ensure all critical info preserved
- Check formatting consistency
- Verify token usage (<1000 tokens)

## Dependencies

**None.** This is a pure prompt-based command with no external dependencies.

- No CLI tools required (jq, curl, etc.)
- No API keys needed
- No environment variables
- No bash scripts
- Works out of the box in any Claude Code installation

## Rollout Plan

1. **MVP (v1.0) - ✅ COMPLETED:**
   - Single command: `/tldr`
   - Pure prompt-based implementation
   - Bullet-point format only
   - Last message only
   - No external dependencies

2. **Iteration (v1.1) - PLANNED:**
   - Add format options via arguments: `/tldr actions`, `/tldr timeline`, `/tldr files`
   - Improve prompt for consistency based on user feedback
   - Better handling of multi-block content (code + text)

3. **Enhancement (v1.2) - PLANNED:**
   - Range selection: `/tldr 3` (last 3 messages), `/tldr session` (entire session)
   - Export capability: `/tldr export` saves to `docs/handoff/YYYY-MM-DD-session-summary.md`
   - Integration with handoff workflow

4. **Automation (v2.0) - PLANNED:**
   - Output style integration (auto-TLDR for verbose style)
   - Session-end summary via Stop hook
   - Cross-session insights and pattern detection

## Success Metrics

- **Usage:** >10 invocations per day
- **Quality:** TLDR captures 90%+ of key info (user validation)
- **Performance:** <2s response time (instant since no API calls)
- **Cost:** $0 (no API usage)
- **User feedback:** Positive sentiment, feature requests

## Validation Results

**Plugin Validator:** ❌ FAIL (original design) → ✅ PASS (corrected)
**Implementation Review:** ⚠️ APPROVE WITH REVISIONS → ✅ APPROVED

**Critical fixes applied:**
1. ✅ Moved plugin.json to `.claude-plugin/` directory
2. ✅ Removed unsupported `commands` array from manifest
3. ✅ Fixed command frontmatter (removed unsupported fields)
4. ✅ Changed from script execution to pure prompt-based approach
5. ✅ Removed external dependencies (bash scripts, API calls)
6. ✅ Fixed security vulnerabilities (no command injection, no data leaks)

## Known Limitations (v1.0)

1. **Single message only** - Cannot summarize ranges or full sessions (planned for v1.2)
2. **No format options** - Only bullet points (planned for v1.1)
3. **No caching** - Re-analyzes on each invocation (acceptable for MVP)
4. **Global history only** - Uses `~/.claude/history.jsonl`, not session-specific files
5. **Text content only** - Doesn't describe images or complex tool results

## Next Steps

1. ✅ Create plugin directory structure (DONE)
2. ✅ Implement v1.0 MVP command (DONE)
3. ⏭️ Test on diverse message types
4. ⏭️ Gather user feedback
5. ⏭️ Plan v1.1 enhancements based on usage patterns
