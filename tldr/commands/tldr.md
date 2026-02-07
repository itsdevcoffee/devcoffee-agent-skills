---
description: Create hyper-condensed bullet-point summary of the last Claude message
allowed-tools: [Read]
---

# TLDR Command

Create a concise bullet-point summary of Claude's most recent message in the conversation.

## Task

1. **Access conversation history:**
   - Use Read tool on `~/.claude/history.jsonl`
   - This file contains all conversation messages in JSONL format (one JSON object per line)
   - Each line has: `{"role": "user"|"assistant", "content": [...], "timestamp": ...}`

2. **Extract last assistant message:**
   - Read the file and find the last line where `role == "assistant"`
   - Extract the text content from `content[0].text`
   - If the content array has multiple blocks, concatenate them

3. **Validate message:**
   - If the message has fewer than 100 words: Respond "Last message too short to summarize (N words)."
   - If the message is empty or contains only tool results: Respond "No text content to summarize."
   - If history file doesn't exist: Respond "Conversation history not found. Ensure you're in an active Claude Code session."

4. **Analyze and extract key information:**
   Focus on actionable and factual content:
   - **Critical findings** - Root causes, discoveries, issues identified
   - **Actions recommended** - Categorize by urgency (immediate/medium/long-term)
   - **Decisions made** - Choices, options presented, recommendations
   - **Deliverables created** - Files, documents, code written
   - **Next steps** - User choices, follow-up actions required

5. **Format as bullets:**
   - Maximum 8 bullet points total
   - Each bullet: 1-2 sentences maximum
   - Focus on "what" and "action" - omit explanations of "why"
   - Use **bold** for category headers when grouping (optional)
   - Prioritize: findings → actions → deliverables → next steps

## Output Format

**TLDR:**
- [Key finding or root cause identified]
- [Action item with specific context]
- [Decision or recommendation made]
- [Deliverable: specific file or artifact created]
- [Next step or user choice required]

## Examples

### Example 1: Research Summary
```
**TLDR:**
- Root cause: Priority markers are advisory (level 4), not enforceable
- Claude 4.x prioritizes pragmatic goals over literal formatting rules
- Immediate action: Simplify buzzminson.md to <150 lines, add XML tags
- Medium action: Create PostToolUse hook for validation
- Deliverables: 3 research docs in docs/research/
- Next: Choose A) Templates, B) Hooks, C) Simplify, D) Review
```

### Example 2: Code Implementation
```
**TLDR:**
- Fixed authentication bug in login flow (user.service.ts:45)
- Added JWT token refresh logic with 15-minute expiration
- Created middleware for route protection (auth.middleware.ts)
- Updated tests: 12 passing, 0 failing
- Next: Deploy to staging and test with production data
```

### Example 3: Short Message
```
Last message too short to summarize (43 words).
```

## Error Handling

Handle these cases gracefully:

- **History file missing:** "Conversation history not found at ~/.claude/history.jsonl"
- **Corrupted JSON:** "Unable to parse conversation history. File may be corrupted."
- **No assistant messages:** "No Claude messages found in history."
- **Message too short:** "Last message too short to summarize (N words)."
- **Only tool results:** "Last message contains only tool results, no text to summarize."

## Implementation Notes

- Do NOT execute external scripts - implement the logic directly using your reasoning
- Do NOT call external APIs - analyze the message using your own capabilities
- Use the Read tool to access the history file
- Parse the JSONL format carefully (each line is a separate JSON object)
- Consider message length before attempting summarization
- Be concise - this command exists to save the user time
