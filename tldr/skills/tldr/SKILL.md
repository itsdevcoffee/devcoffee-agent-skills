---
name: TLDR
description: >-
  This skill should be used when the user asks for a TLDR, summary, recap,
  or condensed version of content. Invoked as "/tldr" with no arguments to
  summarize the previous Claude message from conversation context, or as
  "/tldr [topic]" to summarize whatever the user specifies. Handles requests
  like "summarize that", "give me the tldr", "recap what you just said",
  "shorten your last response", or "tldr of the error analysis".
---

# TLDR Command

Create a concise bullet-point summary of content from the current conversation.

## Task

### Mode 1: No arguments (`/tldr`)

Summarize the previous Claude assistant message.

1. **Recall the previous assistant message from conversation context.**
   You already have the full conversation history in your context window.
   Identify the last substantial assistant message — the one immediately
   before the user's `/tldr` invocation. Skip any messages that are only
   tool calls with no text output.

2. **Validate:**
   - If the last assistant message is very short (under 50 words), respond:
     "Last message is only N words — here it is in brief:" followed by a
     one-line summary.
   - If there is no previous assistant message (conversation just started),
     respond: "No previous message to summarize. Use `/tldr [topic]` to
     summarize specific content."

3. **Analyze and extract key information** (see guidelines below).

4. **Format as bullets** (see formatting below).

### Mode 2: With arguments (`/tldr [what to tldr]`)

Summarize whatever the user specifies.

1. **Identify what to summarize.** The user's argument describes or contains
   the content to summarize. This could be:
   - A topic discussed earlier: `/tldr the error analysis`
   - A reference to a specific message: `/tldr your second response`
   - Inline content the user pasted after the command

2. **Locate the relevant content** in the conversation context.

3. **Analyze and extract key information** (see guidelines below).

4. **Format as bullets** (see formatting below).

## Extraction Guidelines

Focus on actionable and factual content:
- **Critical findings** — Root causes, discoveries, issues identified
- **Actions recommended** — Categorize by urgency (immediate/medium/long-term)
- **Decisions made** — Choices, options presented, recommendations
- **Deliverables created** — Files, documents, code written
- **Next steps** — User choices, follow-up actions required

## Formatting Rules

- Maximum 8 bullet points total
- Each bullet: 1-2 sentences maximum
- Focus on "what" and "action" — omit explanations of "why"
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

### Example 3: With Arguments
```
User: /tldr the database migration discussion

**TLDR:**
- Migrating from PostgreSQL 14 to 16 requires pg_dump/pg_restore path
- Three tables need schema changes: users, sessions, audit_log
- Estimated downtime: 15 minutes with blue-green deployment
- Next: Run migration script on staging first
```

## Error Handling

- **No previous message:** "No previous message to summarize. Use `/tldr [topic]` to summarize specific content."
- **Very short message:** Still produce a one-line summary instead of refusing.
- **Ambiguous argument:** "I found multiple discussions about [topic]. Which one? [list options]"
- **Topic not found:** "I don't see a discussion about [topic] in this conversation."

## Implementation Notes

- Do NOT read files to access conversation history — use your context window
- Do NOT call external APIs — analyze using your own capabilities
- Do NOT execute external scripts
- Be concise — this command exists to save the user time
