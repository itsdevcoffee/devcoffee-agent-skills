# TLDR Plugin Implementation Patterns

**Date:** 2026-02-06
**Purpose:** Technical reference for implementing conversation summarization in Claude Code plugins
**Based on:** Community research and existing plugin analysis

## Overview

This document distills implementation patterns from successful Claude Code plugins to guide the development of a conversation summarization (TLDR) plugin. These patterns are extracted from real-world implementations and official Anthropic guidance.

## Core Design Principles

### 1. Respect the Code/Claude Boundary

**Source:** Pierce Lamb's plugin trilogy lessons

**Principle:**
> "Respect the boundary between what should be code and what should be Claude. Deterministic tasks belong in tested scripts. State management belongs in files."

**Applied to TLDR:**
- **Scripts handle:** Parsing JSONL, token counting, file I/O, timestamp calculations
- **Claude handles:** Understanding intent, identifying key decisions, generating natural language summaries
- **Files maintain:** Summary history, user preferences, compaction checkpoints

### 2. Markdown-First Architecture

**Pattern observed across all plugins:**
- Primary interface is markdown with frontmatter
- No build process required
- Human-readable and version-controllable
- Claude naturally understands markdown structure

**For TLDR:**
```markdown
---
name: tldr
description: Generate conversation summaries and manage context
version: 1.0.0
author: DevCoffee
---

# TLDR - Conversation Summarization

Analyzes current conversation and generates structured summaries...
```

### 3. Token-Efficient Design

**Skills design principle:**
- ~100 tokens during metadata scanning
- <5k tokens when fully loaded
- Minimize prompt overhead
- Use external scripts for heavy lifting

**TLDR efficiency strategy:**
- Skill metadata describes capability in <100 tokens
- Scripts handle JSONL parsing offline
- Only pass essential conversation chunks to Haiku
- Cache summaries to avoid regeneration

## Technical Patterns

### Pattern 1: Conversation History Access

**Location:** `~/.claude/projects/[project-hash]/conversations/[conversation-id].jsonl`

**Access pattern:**
```javascript
// scripts/parse-conversation.js
import fs from 'fs';
import path from 'path';
import os from 'os';

function findCurrentConversation() {
  const claudeDir = path.join(os.homedir(), '.claude', 'projects');
  // Read metadata to find current project
  // Parse JSONL for current conversation
  // Return structured conversation data
}

function parseConversation(jsonlPath) {
  const lines = fs.readFileSync(jsonlPath, 'utf-8').split('\n');
  return lines
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}
```

**Message structure:**
```json
{
  "role": "user|assistant",
  "content": "...",
  "timestamp": "ISO-8601",
  "tool_calls": [...],  // Present for assistant messages
  "tool_results": [...]
}
```

### Pattern 2: Haiku Summarization (Based on /insights)

**Anthropic's internal pattern:**
- Use Claude Haiku for cost-effective summarization
- Batch multiple conversations per API call when possible
- Structured prompts for consistent output format

**Implementation:**
```javascript
// scripts/summarize.js
import Anthropic from '@anthropic-ai/sdk';

async function summarizeConversation(messages) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const conversationText = formatMessagesForSummary(messages);

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    temperature: 0.3, // Lower for consistency
    system: `You are analyzing a Claude Code conversation to generate a structured summary.
    Focus on extracting factual information about goals, actions, and outcomes.`,
    messages: [{
      role: 'user',
      content: `Analyze this conversation and provide a structured summary in JSON format:

{
  "goals": ["primary goals discussed"],
  "accomplishments": ["actions taken and completed"],
  "decisions": ["key decisions with rationale"],
  "files_modified": ["file paths and descriptions"],
  "outstanding_tasks": ["incomplete tasks"],
  "next_steps": "brief context for continuation"
}

Conversation:
${conversationText}

Output valid JSON only.`
    }]
  });

  return JSON.parse(response.content[0].text);
}

function formatMessagesForSummary(messages) {
  // Convert JSONL messages to readable format
  // Include tool calls but summarize long outputs
  // Preserve key decisions and user intents
}
```

### Pattern 3: Token Counting

**For context awareness:**
```javascript
// scripts/count-tokens.js
import { encoding_for_model } from 'tiktoken';

function countConversationTokens(messages) {
  const enc = encoding_for_model('claude-4.5');

  let total = 0;
  for (const msg of messages) {
    // Count message content
    total += enc.encode(msg.content).length;

    // Count tool calls if present
    if (msg.tool_calls) {
      total += countToolCallTokens(msg.tool_calls, enc);
    }
  }

  enc.free();
  return total;
}

function estimateRemainingCapacity(currentTokens, modelLimit = 200000) {
  const remaining = modelLimit - currentTokens;
  const percentUsed = (currentTokens / modelLimit) * 100;
  const messagesUntilCompact = estimateMessagesRemaining(remaining);

  return {
    used: currentTokens,
    remaining,
    percentUsed,
    messagesUntilCompact,
    warningLevel: percentUsed > 75 ? 'high' : percentUsed > 50 ? 'medium' : 'low'
  };
}
```

### Pattern 4: Skill Structure with Scripts

**Directory layout:**
```
buzzminson/skills/tldr/
├── SKILL.md                    # Main skill definition
├── scripts/
│   ├── package.json           # Node dependencies
│   ├── parse-conversation.js  # JSONL parsing
│   ├── summarize.js          # Haiku integration
│   ├── count-tokens.js       # Token calculation
│   └── generate-handoff.js   # Document generation
├── templates/
│   ├── summary.md            # Summary output template
│   └── handoff.md           # Handoff doc template
└── .claude/
    └── state.json            # Persistent state
```

**SKILL.md structure:**
```markdown
---
name: tldr
description: Generate conversation summaries with token usage analysis
version: 1.0.0
---

# TLDR - Conversation Summarization

## Purpose
Analyzes the current Claude Code conversation and generates structured summaries,
showing what's been discussed, actions taken, and context for continuation.

## When to Use
- User requests `/tldr` or asks for a conversation summary
- When approaching context limits (>75% token usage)
- Before ending a session to generate handoff documentation
- To preview what would be lost in the next compaction

## How It Works

1. **Parse Conversation History**
   - Reads JSONL from ~/.claude/projects/[project]/conversations/
   - Extracts messages since last summary or session start
   - Identifies user intents, Claude actions, and tool calls

2. **Analyze Context Usage**
   - Counts tokens in current conversation
   - Calculates remaining capacity
   - Warns if approaching compaction threshold

3. **Generate Summary**
   - Uses Claude Haiku for efficient summarization
   - Produces structured markdown output
   - Includes goals, accomplishments, decisions, files modified

4. **Output Results**
   - Displays summary in conversation
   - Optionally saves to docs/handoff/ for persistence
   - Updates state for incremental summaries

## Invocation

The skill is triggered when:
- User types `/tldr` command
- User asks for "conversation summary" or similar
- Context usage exceeds 75% (automatic warning)

## Output Format

```markdown
# Conversation Summary - [Timestamp]

## Status
- Token usage: X / Y (Z%)
- Messages: N
- Files modified: M
- Duration: H hours M minutes

## Goals
- [Primary goal]
- [Secondary goals]

## Accomplishments
- [Action 1 with files]
- [Action 2 with results]

## Key Decisions
- [Decision with rationale]

## Outstanding Tasks
- [ ] Task 1
- [ ] Task 2

## Context for Next Session
[Brief paragraph for handoff]
```

## Scripts

### parse-conversation.js
Reads JSONL conversation history and returns structured data.

**Usage:**
```bash
node scripts/parse-conversation.js [conversation-id]
```

**Output:** JSON with messages, metadata, token count

### summarize.js
Calls Haiku API to generate structured summary.

**Usage:**
```bash
node scripts/summarize.js [conversation-json-file]
```

**Output:** JSON with summary sections

### generate-handoff.js
Creates handoff documentation following DevCoffee conventions.

**Usage:**
```bash
node scripts/generate-handoff.js [summary-json] [output-path]
```

**Output:** Markdown file in docs/handoff/

## Configuration

Create `.claude/tldr-config.json` to customize:

```json
{
  "autoSummaryThreshold": 0.75,
  "includeToolCalls": true,
  "handoffDirectory": "docs/handoff",
  "summaryStyle": "detailed|concise",
  "preserveHistory": true
}
```

## Dependencies

- Node.js ≥ 18
- @anthropic-ai/sdk
- tiktoken
- Environment: ANTHROPIC_API_KEY

## Error Handling

- If conversation file not found: Use current context only
- If Haiku API fails: Generate basic summary from templates
- If token counting fails: Use estimation based on character count
- Always provide output even if partial data available

## Testing

Run test suite:
```bash
cd scripts && npm test
```

Tests verify:
- JSONL parsing accuracy
- Token counting precision
- Summary generation quality
- Handoff doc formatting
```

### Pattern 5: Hook Integration

**hooks/on-session-end.md:**
```markdown
---
trigger: on-session-end
description: Generate handoff summary when session ends
priority: high
---

# Session End Summary Hook

When a conversation session is ending, automatically:

1. Check if any significant work was done (>10 messages or files modified)
2. If yes, invoke TLDR skill to generate summary
3. Save summary to `docs/handoff/YYYY-MM-DD-session-handoff.md`
4. Display brief notification to user about saved handoff

This ensures context is never lost between sessions.

Implementation:
```bash
# Check for significant activity
message_count=$(node scripts/count-messages.js)
files_changed=$(git diff --name-only)

if [ "$message_count" -gt 10 ] || [ -n "$files_changed" ]; then
  node scripts/generate-handoff.js --auto
  echo "📋 Session summary saved to docs/handoff/"
fi
```
```

**hooks/on-compact.md:**
```markdown
---
trigger: on-compact
description: Generate pre-compaction summary
priority: critical
---

# Pre-Compaction Summary Hook

Before Claude Code compacts the conversation (at ~95% token usage):

1. Generate emergency summary of current conversation
2. Highlight critical information that might be lost
3. Save to `.claude/summaries/pre-compact-[timestamp].md`
4. Mark important CLAUDE.md references for preservation

This provides a safety net against losing important context during automatic compaction.

Implementation:
```bash
# Generate pre-compact summary
node scripts/summarize.js --mode=preserve --output=.claude/summaries/

# Extract critical CLAUDE.md references
grep -r "CLAUDE.md" conversations/ > .claude/summaries/claude-md-refs.txt

# Notify user
echo "⚠️  Compaction imminent. Summary saved to .claude/summaries/"
echo "Review if any critical context should be preserved in CLAUDE.md"
```
```

### Pattern 6: Command Implementation

**commands/tldr.md:**
```markdown
---
name: tldr
description: Generate conversation summary with token usage
aliases: [summary, recap]
---

# /tldr Command

Generate a summary of the current conversation.

## Usage

```
/tldr                    # Basic summary
/tldr --detailed         # Include all tool calls
/tldr --handoff          # Save as handoff document
/tldr --tokens           # Show detailed token usage
/tldr --since=timestamp  # Summarize since timestamp
```

## Options

- `--detailed`: Include all tool calls and file changes
- `--handoff`: Save to docs/handoff/ directory
- `--tokens`: Show token usage breakdown by message
- `--since`: Summarize only messages after timestamp
- `--export=PATH`: Save summary to custom location

## Examples

**Basic usage:**
```
/tldr
```
Output: Concise summary of current conversation

**Generate handoff:**
```
/tldr --handoff
```
Output: Summary saved to `docs/handoff/2026-02-06-session-handoff.md`

**Check token usage:**
```
/tldr --tokens
```
Output: Token breakdown with warning if >75% used

## Implementation

When invoked:

1. Verify conversation exists and is accessible
2. Parse options and validate
3. Call parse-conversation.js script
4. If --tokens, run count-tokens.js
5. Call summarize.js with appropriate mode
6. Format output using template
7. If --handoff, save to docs/handoff/
8. Display result to user

## Error Messages

- "No conversation found" - Session just started
- "API key not configured" - Set ANTHROPIC_API_KEY
- "Cannot access conversation history" - Permission issue
- "Token limit exceeded" - Try --since to reduce scope
```

## Integration Patterns

### Pattern 7: State Management

**Persistent state for incremental summaries:**

**.claude/state/tldr-state.json:**
```json
{
  "version": "1.0.0",
  "lastSummaryTimestamp": "2026-02-06T10:30:00Z",
  "lastSummaryMessageIndex": 45,
  "totalSummariesGenerated": 12,
  "preferences": {
    "autoSummaryEnabled": true,
    "summaryThreshold": 0.75,
    "includeToolDetails": false
  },
  "summaryHistory": [
    {
      "timestamp": "2026-02-06T10:30:00Z",
      "messageCount": 45,
      "tokenCount": 23500,
      "summaryPath": "docs/handoff/2026-02-06-morning-session.md"
    }
  ]
}
```

**Update pattern:**
```javascript
function updateState(newSummary) {
  const statePath = path.join(claudeDir, 'state', 'tldr-state.json');
  const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

  state.lastSummaryTimestamp = newSummary.timestamp;
  state.lastSummaryMessageIndex = newSummary.messageIndex;
  state.totalSummariesGenerated++;
  state.summaryHistory.push({
    timestamp: newSummary.timestamp,
    messageCount: newSummary.messageCount,
    tokenCount: newSummary.tokenCount,
    summaryPath: newSummary.outputPath
  });

  // Keep only last 10 summaries in history
  if (state.summaryHistory.length > 10) {
    state.summaryHistory = state.summaryHistory.slice(-10);
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}
```

### Pattern 8: Template System

**templates/summary.md:**
```markdown
# Conversation Summary - {{timestamp}}

## Status
- Token usage: {{tokenUsed}} / {{tokenLimit}} ({{percentUsed}}%)
{{#if warningLevel}}
- ⚠️  Warning: {{warningLevel}} token usage - consider compaction soon
{{/if}}
- Messages: {{messageCount}}
- Files modified: {{filesModified}}
- Duration: {{duration}}

## Goals
{{#each goals}}
- {{this}}
{{/each}}

## Accomplishments
{{#each accomplishments}}
- {{this}}
{{/each}}

## Key Decisions
{{#each decisions}}
- **{{this.title}}**: {{this.rationale}}
{{/each}}

## Files Modified
{{#each files}}
- `{{this.path}}` - {{this.description}}
{{/each}}

## Outstanding Tasks
{{#each tasks}}
- [ ] {{this}}
{{/each}}

## Context for Next Session
{{nextSteps}}

---
*Generated by Buzzminson TLDR v{{version}}*
*Powered by Claude Haiku*
```

**Usage:**
```javascript
import Handlebars from 'handlebars';
import fs from 'fs';

function generateSummaryOutput(summaryData, templatePath) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(template);
  return compiled(summaryData);
}
```

### Pattern 9: Multi-Agent Orchestration

**For complex analysis (based on Superpowers plugin pattern):**

**Spawn specialist subagent:**
```markdown
# In SKILL.md

## Advanced Mode: Deep Analysis

For conversations >100 messages, spawn a specialist subagent:

1. **Analyzer Agent**: Reads full conversation and identifies patterns
2. **Summarizer Agent**: Generates structured summaries per topic
3. **Synthesizer Agent**: Combines summaries into coherent narrative

This ensures quality even for very long conversations.

Trigger: `/tldr --deep` or automatically for conversations >150 messages
```

**Implementation pattern:**
```javascript
async function deepAnalysis(conversationData) {
  // Spawn analyzer subagent
  const analysis = await spawnAgent('analyzer', {
    task: 'Analyze conversation patterns and identify key topics',
    context: conversationData
  });

  // Spawn summarizer for each topic
  const summaries = await Promise.all(
    analysis.topics.map(topic =>
      spawnAgent('summarizer', {
        task: `Summarize discussion about: ${topic.name}`,
        context: filterMessagesByTopic(conversationData, topic)
      })
    )
  );

  // Synthesize final output
  return await spawnAgent('synthesizer', {
    task: 'Create unified summary from topic summaries',
    context: { analysis, summaries }
  });
}
```

## Performance Patterns

### Pattern 10: Caching Strategy

**Avoid redundant API calls:**

```javascript
// Cache summaries in memory for session duration
const summaryCache = new Map();

async function getCachedSummary(conversationId, messageCount) {
  const cacheKey = `${conversationId}-${messageCount}`;

  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey);
  }

  const summary = await generateSummary(conversationId);
  summaryCache.set(cacheKey, summary);

  return summary;
}

// Invalidate cache when new messages arrive
function onNewMessage(conversationId) {
  // Clear cached summaries for this conversation
  for (const key of summaryCache.keys()) {
    if (key.startsWith(conversationId)) {
      summaryCache.delete(key);
    }
  }
}
```

### Pattern 11: Progressive Summarization

**For long conversations, summarize in chunks:**

```javascript
async function progressiveSummary(messages) {
  const CHUNK_SIZE = 50; // messages per chunk
  const chunks = [];

  // Split into chunks
  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    chunks.push(messages.slice(i, i + CHUNK_SIZE));
  }

  // Summarize each chunk
  const chunkSummaries = await Promise.all(
    chunks.map((chunk, index) =>
      summarizeChunk(chunk, index, chunks.length)
    )
  );

  // Synthesize chunk summaries into final summary
  return synthesizeSummaries(chunkSummaries);
}

async function summarizeChunk(messages, chunkIndex, totalChunks) {
  // More concise summaries for middle chunks
  const mode = chunkIndex === totalChunks - 1 ? 'detailed' : 'concise';

  return await callHaiku({
    messages,
    mode,
    context: `This is chunk ${chunkIndex + 1} of ${totalChunks}`
  });
}
```

## Testing Patterns

### Pattern 12: Test Fixtures

**Create realistic test conversations:**

```javascript
// test/fixtures/sample-conversation.jsonl
{"role":"user","content":"Let's build a TLDR plugin for Claude Code","timestamp":"2026-02-06T09:00:00Z"}
{"role":"assistant","content":"Great idea! Let me help you plan the architecture...","timestamp":"2026-02-06T09:00:05Z","tool_calls":[...]}
{"role":"user","content":"Can you create the basic file structure?","timestamp":"2026-02-06T09:05:00Z"}
// ... more messages
```

**Test suite:**
```javascript
// test/summarize.test.js
import { describe, it, expect } from 'vitest';
import { summarizeConversation } from '../scripts/summarize.js';
import sampleConversation from './fixtures/sample-conversation.jsonl';

describe('Conversation Summarization', () => {
  it('should extract goals from conversation', async () => {
    const summary = await summarizeConversation(sampleConversation);
    expect(summary.goals).toContain('build a TLDR plugin');
  });

  it('should identify file modifications', async () => {
    const summary = await summarizeConversation(sampleConversation);
    expect(summary.files_modified).toHaveLength(5);
  });

  it('should count tokens accurately', async () => {
    const summary = await summarizeConversation(sampleConversation);
    expect(summary.tokenCount).toBeGreaterThan(1000);
    expect(summary.tokenCount).toBeLessThan(50000);
  });
});
```

## Error Handling Patterns

### Pattern 13: Graceful Degradation

**Always provide output, even with partial data:**

```javascript
async function robustSummarize(conversationData) {
  let summary = {
    goals: [],
    accomplishments: [],
    decisions: [],
    files_modified: [],
    outstanding_tasks: [],
    next_steps: '',
    warnings: []
  };

  try {
    // Attempt Haiku API call
    summary = await callHaikuAPI(conversationData);
  } catch (apiError) {
    summary.warnings.push('API unavailable, using template-based summary');

    try {
      // Fall back to template-based extraction
      summary = extractFromTemplate(conversationData);
    } catch (templateError) {
      summary.warnings.push('Template extraction failed, using basic summary');

      // Last resort: basic extraction
      summary = basicExtraction(conversationData);
    }
  }

  return summary;
}

function basicExtraction(conversationData) {
  // Extract using simple heuristics
  return {
    goals: extractUserQuestions(conversationData),
    accomplishments: extractToolCalls(conversationData),
    decisions: [],
    files_modified: extractFileOperations(conversationData),
    outstanding_tasks: extractTodoItems(conversationData),
    next_steps: 'Review conversation for next steps'
  };
}
```

## Security Patterns

### Pattern 14: Sensitive Data Handling

**Redact potential secrets before sending to API:**

```javascript
function sanitizeForSummary(conversationText) {
  // Redact common secret patterns
  const patterns = [
    /api[_-]?key["\s:=]+[a-zA-Z0-9_-]+/gi,
    /password["\s:=]+[^\s"]+/gi,
    /token["\s:=]+[a-zA-Z0-9_-]+/gi,
    /Bearer\s+[a-zA-Z0-9_-]+/gi,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi // emails
  ];

  let sanitized = conversationText;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
}

async function secureSummarize(conversationData) {
  const sanitizedText = sanitizeForSummary(
    JSON.stringify(conversationData)
  );

  return await callHaikuAPI(sanitizedText);
}
```

## Documentation Patterns

### Pattern 15: Self-Documenting Output

**Include metadata in every summary:**

```markdown
---
generator: buzzminson-tldr
version: 1.0.0
timestamp: 2026-02-06T10:30:00Z
conversation_id: abc123
message_range: 1-45
token_count: 23500
model: claude-haiku-4-5
---

# Conversation Summary

[Summary content here]

---

## About This Summary

This summary was automatically generated by Buzzminson TLDR v1.0.0.

**Coverage:** Messages 1-45 (total: 23,500 tokens)
**Generated:** 2026-02-06 at 10:30 AM
**Model:** Claude Haiku 4.5
**Conversation ID:** abc123

**Customization:** Edit `.claude/tldr-config.json` to adjust summary style and content.

**Feedback:** Issues or suggestions? Open an issue at github.com/devcoffee/buzzminson-tldr
```

## Checklist for Implementation

- [ ] Create basic skill structure (SKILL.md + scripts directory)
- [ ] Implement JSONL parser for conversation history
- [ ] Add token counting with tiktoken
- [ ] Integrate Haiku API for summarization
- [ ] Create summary and handoff templates
- [ ] Implement /tldr command with options
- [ ] Add hooks for on-session-end and on-compact
- [ ] Set up state management for incremental summaries
- [ ] Add caching to avoid redundant API calls
- [ ] Implement graceful degradation for API failures
- [ ] Add security: sanitize sensitive data before API calls
- [ ] Create test suite with fixtures
- [ ] Write user documentation
- [ ] Add configuration file support
- [ ] Implement progressive summarization for long conversations
- [ ] Add multi-agent support for deep analysis mode

## References

- [Pierce Lamb - Plugin Trilogy Lessons](https://pierce-lamb.medium.com/what-i-learned-while-building-a-trilogy-of-claude-code-plugins-72121823172b)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Haiku Model Documentation](https://docs.anthropic.com/en/docs/about-claude/models)
- [tiktoken - Token Counting Library](https://github.com/openai/tiktoken)
- [Claude Code System Prompts Repository](https://github.com/Piebald-AI/claude-code-system-prompts)

---

**Document Version:** 1.0
**Last Updated:** 2026-02-06
**Maintainer:** DevCoffee Team
