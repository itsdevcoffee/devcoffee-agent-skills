# TLDR Plugin - Critical Fixes Checklist

**Date:** 2026-02-06
**Status:** Pre-Implementation Blockers
**Full Review:** See `2026-02-06-tldr-design-review.md`

## Must Fix Before Implementation (BLOCKING)

### 1. Command Invocation Pattern ⚠️ CRITICAL

**Current (WRONG):**
```markdown
## Implementation

Execute the TLDR summarization script:

${CLAUDE_PLUGIN_ROOT}/scripts/tldr-summarize.sh
```

**Problem:** Commands are instructions to Claude, not scripts to execute directly.

**Fix Required:**
```markdown
# TLDR Command

When invoked, you should:

1. **Parse conversation history:**
   Use Bash tool to execute: `node ${CLAUDE_PLUGIN_ROOT}/scripts/parse-conversation.js`
   This returns the last assistant message from the current conversation.

2. **Check message length:**
   If the message is less than 500 characters, respond:
   "Last message too short to summarize."

3. **Generate summary:**
   Use Bash tool to execute: `node ${CLAUDE_PLUGIN_ROOT}/scripts/summarize.js`
   Pass the conversation data as input.

4. **Format and display:**
   Present the summary in this format:

   **TLDR:**
   - [Key point 1]
   - [Key point 2]
   - [Key point 3]

   Maximum 8 bullet points, focus on actions and outcomes.
```

**Reference:** buzzminson.md lines 192-199 show correct pattern

---

### 2. Code Injection Vulnerability ⚠️ SECURITY

**Current (UNSAFE):**
```bash
SUMMARY=$(echo "$LAST_MESSAGE" | claude-haiku-summarize)
```

**Problem:** Shell will execute commands in `$LAST_MESSAGE` like `$(rm -rf /)`

**Fix Required:**
```bash
# Use printf or heredoc for safe string passing
printf '%s' "$LAST_MESSAGE" | claude-haiku-summarize

# Or use heredoc (even safer)
claude-haiku-summarize <<EOF
$LAST_MESSAGE
EOF
```

---

### 3. Sensitive Data Exposure ⚠️ SECURITY

**Current:** No sanitization before sending to Haiku API

**Problem:** API keys, passwords, tokens in conversation will be sent to external API

**Fix Required:**
```bash
sanitize_content() {
  local content="$1"

  # Redact common secrets
  content=$(echo "$content" | sed -E 's/api[_-]?key["\s:=]+[a-zA-Z0-9_-]+/[API_KEY_REDACTED]/gi')
  content=$(echo "$content" | sed -E 's/password["\s:=]+[^\s"]+/[PASSWORD_REDACTED]/gi')
  content=$(echo "$content" | sed -E 's/token["\s:=]+[a-zA-Z0-9_-]+/[TOKEN_REDACTED]/gi')
  content=$(echo "$content" | sed -E 's/Bearer\s+[a-zA-Z0-9_-]+/[TOKEN_REDACTED]/gi')
  content=$(echo "$content" | sed -E 's/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/[EMAIL_REDACTED]/gi')

  echo "$content"
}

# Use before API call
SANITIZED_MESSAGE=$(sanitize_content "$LAST_MESSAGE")
```

**This is MANDATORY before any release.**

---

### 4. API Key Validation ⚠️ CRITICAL

**Current:** No validation, will fail silently

**Fix Required:**
```bash
# Add to beginning of script
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ ANTHROPIC_API_KEY not configured"
  echo ""
  echo "To set up:"
  echo "  export ANTHROPIC_API_KEY='your-key-here'"
  echo ""
  echo "Or add to ~/.bashrc or ~/.zshrc for persistence"
  echo ""
  echo "Alternative: Use built-in /compact command for conversation summarization"
  exit 1
fi

# Also check jq is installed
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq not found"
  echo ""
  echo "Install with:"
  echo "  macOS: brew install jq"
  echo "  Ubuntu/Debian: apt-get install jq"
  echo "  Fedora: dnf install jq"
  exit 1
fi
```

---

### 5. Conversation History Path Discovery ⚠️ CRITICAL

**Current (FRAGILE):**
```bash
PROJECT_HASH=$(basename "$(dirname "$(pwd)")")
HISTORY_DIR="$HOME/.claude/projects"

for dir in "$HISTORY_DIR"/*; do
    latest=$(ls -t "$dir"/*.jsonl 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
        HISTORY_FILE="$latest"
        break
    fi
done
```

**Problems:**
1. Assumes CWD is inside project directory
2. Iterates through ALL projects to find one
3. No validation of found path
4. Vulnerable to symlink attacks

**Fix Required:**

**Option A - Use Environment Variables:**
```bash
# Claude Code may provide these
PROJECT_ID="${CLAUDE_PROJECT_ID}"
CONVERSATION_ID="${CLAUDE_CONVERSATION_ID}"

if [ -n "$PROJECT_ID" ] && [ -n "$CONVERSATION_ID" ]; then
  HISTORY_FILE="$HOME/.claude/projects/$PROJECT_ID/conversations/$CONVERSATION_ID.jsonl"
else
  echo "❌ Could not determine current conversation"
  echo "CLAUDE_PROJECT_ID or CLAUDE_CONVERSATION_ID not set"
  exit 1
fi
```

**Option B - Parse Metadata:**
```bash
# Read Claude's current session metadata
METADATA_FILE="$HOME/.claude/current-session.json"

if [ -f "$METADATA_FILE" ]; then
  PROJECT_ID=$(jq -r '.project_id' "$METADATA_FILE")
  CONVERSATION_ID=$(jq -r '.conversation_id' "$METADATA_FILE")
  HISTORY_FILE="$HOME/.claude/projects/$PROJECT_ID/conversations/$CONVERSATION_ID.jsonl"
else
  echo "❌ Could not find session metadata"
  echo "This command must be run within an active Claude Code session"
  exit 1
fi
```

**Option C - Search with Validation:**
```bash
HISTORY_DIR="$HOME/.claude/projects"
HISTORY_FILE=""

# Find most recently modified conversation file
HISTORY_FILE=$(find "$HISTORY_DIR" -name "*.jsonl" -type f -mmin -60 | head -1)

if [ -z "$HISTORY_FILE" ]; then
  echo "❌ No recent conversation found"
  echo "This command summarizes the current active conversation."
  exit 1
fi

# Validate path is within expected directory (security check)
case "$HISTORY_FILE" in
  "$HISTORY_DIR"*)
    # Path is safe
    ;;
  *)
    echo "⚠️  Security: Rejected path outside projects directory"
    exit 1
    ;;
esac
```

**Recommendation:** Use Option C for MVP (doesn't rely on undocumented env vars), investigate Option A for v1.1

---

### 6. Haiku API Error Handling ⚠️ CRITICAL

**Current:** No error handling, will fail silently

**Fix Required:**
```bash
# Call Haiku with error handling
RESPONSE=$(curl -s -w "\n%{http_code}" \
  https://api.anthropic.com/v1/messages \
  -H "anthropic-version: 2023-06-01" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d "{
    \"model\": \"claude-haiku-4-5-20251001\",
    \"max_tokens\": 300,
    \"messages\": [{
      \"role\": \"user\",
      \"content\": \"Summarize as bullet points (max 8): $SANITIZED_MESSAGE\"
    }]
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Haiku API error (HTTP $HTTP_CODE)"

  # Try to extract error message
  ERROR_MSG=$(echo "$BODY" | jq -r '.error.message // "Unknown error"')
  echo "Error: $ERROR_MSG"

  echo ""
  echo "Fallback options:"
  echo "  1. Use built-in /compact for conversation summarization"
  echo "  2. Check ANTHROPIC_API_KEY is valid"
  echo "  3. Try again in a moment (may be rate limited)"
  exit 1
fi

# Extract summary from response
SUMMARY=$(echo "$BODY" | jq -r '.content[0].text')

if [ -z "$SUMMARY" ]; then
  echo "❌ Failed to extract summary from API response"
  exit 1
fi
```

---

## Recommended Quick Wins (High Value, Low Effort)

### 7. Add Export Functionality

**Effort:** 1-2 hours
**Value:** High (integrates with DevCoffee handoff workflow)

```bash
# Add to script after summary generation
if [ "$1" == "--export" ] || [ "$1" == "export" ]; then
  OUTPUT_DIR="docs/handoff"
  OUTPUT_FILE="$OUTPUT_DIR/$(date +%Y-%m-%d)-tldr-summary.md"

  # Create directory if needed
  mkdir -p "$OUTPUT_DIR"

  # Save summary
  cat > "$OUTPUT_FILE" <<EOF
# Conversation Summary - $(date +%Y-%m-%d)

Generated: $(date)

$SUMMARY

---
*Generated by DevCoffee TLDR v1.0*
EOF

  echo "✅ Summary saved to $OUTPUT_FILE"
else
  # Display to console
  echo "$SUMMARY"
fi
```

**Usage:**
```bash
/devcoffee:tldr          # Display in console
/devcoffee:tldr export   # Save to docs/handoff/
```

---

### 8. Improve Multi-Block Content Handling

**Current (WRONG):**
```bash
jq -r 'select(.role == "assistant") | .content[0].text'
```

**Problem:** Only gets first content block, misses rest of message

**Fix:**
```bash
jq -r 'select(.role == "assistant") |
       .content |
       map(select(.type == "text") | .text) |
       join("\n")'
```

This extracts ALL text blocks and concatenates them.

---

### 9. Better Message Length Detection

**Current:**
```bash
WORD_COUNT=$(echo "$LAST_MESSAGE" | wc -w)
if [ "$WORD_COUNT" -lt 100 ]; then
```

**Problem:** `wc -w` is inaccurate for code-heavy content

**Fix:**
```bash
# Use character count (more reliable)
CHAR_COUNT=$(echo "$LAST_MESSAGE" | wc -c)
if [ "$CHAR_COUNT" -lt 500 ]; then
  echo "Last message too short to summarize ($CHAR_COUNT characters)."
  echo "Minimum 500 characters required for meaningful summary."
  exit 0
fi
```

---

## Implementation Priority

**Do these in order:**

1. ✅ Fix command invocation pattern (Issue #1)
2. ✅ Add API key validation (Issue #4)
3. ✅ Implement sanitization (Issue #3)
4. ✅ Fix code injection (Issue #2)
5. ✅ Add error handling (Issue #6)
6. ✅ Fix conversation path discovery (Issue #5)
7. ✅ Add export functionality (Quick Win #7)
8. ✅ Fix multi-block content (Quick Win #8)
9. ✅ Improve length detection (Quick Win #9)

**After these fixes, the design is ready for implementation.**

---

## Testing Checklist

Before considering MVP complete, test:

- [ ] `/tldr` on short message (<500 chars) - Should skip
- [ ] `/tldr` on normal message (500-2000 chars) - Should summarize
- [ ] `/tldr` on long message with code blocks - Should handle gracefully
- [ ] `/tldr` with invalid API key - Should show helpful error
- [ ] `/tldr` with no API key - Should show setup instructions
- [ ] `/tldr export` - Should save to docs/handoff/
- [ ] `/tldr` when conversation contains secrets - Should redact before API call
- [ ] `/tldr` when Haiku API is down - Should show error and suggest /compact
- [ ] `/tldr` on message with multiple content blocks - Should include all
- [ ] Rapid `/tldr` calls - Should not race condition

**All tests must pass before MVP release.**

---

## Architecture Decision Required

**Question:** Should TLDR be a **command** or an **agent**?

**Current design:** Command (simple invocation)

**Considerations:**

**Keep as Command if:**
- Scope stays simple (just last message summarization)
- No complex decision trees needed
- Quick execution is priority

**Convert to Agent if:**
- Adding Phase 2+ features (format options, range selection)
- Need progress tracking for long conversations
- Want integration with buzzminson/maximus workflow

**Recommendation:** Start as command for MVP, consider agent refactor for v2.0 if complexity grows.

**Impact:** Low for MVP, affects future architecture

---

## Next Steps

1. Review this checklist with design author
2. Create implementation tasks from items 1-9
3. Fix blocking issues (#1-6) before writing any code
4. Implement quick wins (#7-9) during MVP development
5. Run testing checklist before release
6. Decide command vs. agent for v2.0 roadmap

**Questions?** See full review in `2026-02-06-tldr-design-review.md`

---

**Checklist version:** 1.0
**Last updated:** 2026-02-06
**Estimated fix time:** 8-12 hours for all critical issues
