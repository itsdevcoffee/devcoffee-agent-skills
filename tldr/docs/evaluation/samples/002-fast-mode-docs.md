# Sample 002: Fast Mode Documentation Summary

**Date:** 2026-02-15
**Type:** Documentation
**Context:** User ran `/tldr https://code.claude.com/docs/en/fast-mode` to summarize the Fast Mode docs page (6.8KB)

## Original Message

*External URL content - not a Claude conversation message. Source: https://code.claude.com/docs/en/fast-mode (6.8KB fetched)*

The /tldr skill fetched the Fast Mode documentation page and produced a summary. Original page content not captured verbatim.

## TLDR Output

- Fast mode makes Claude Opus 4.6 run 2.5x faster at higher cost ($30/$150 MTok, 50% off until Feb 16)
- Same model quality and capabilities, just different API configuration for speed over cost
- Toggle with /fast command or set "fastMode": true in settings file
- Best for interactive work: rapid iteration, live debugging, tight deadlines
- Avoid for long autonomous tasks, batch processing, or cost-sensitive workloads
- Enable at session start, not mid-conversation—switching mid-session charges fast mode price for entire context
- Requires extra usage enabled; Teams/Enterprise need admin approval
- Auto-fallback to standard Opus 4.6 when rate limits hit, then re-enables after cooldown

## Claude's Evaluation

**Overall Score:** 9.5 / 10.0

### Breakdown

**Completeness: 2.3 / 2.5**
- ✅ Core capability (2.5x speed increase)
- ✅ Pricing details ($30/$150 MTok + promo deadline)
- ✅ Same model quality assurance
- ✅ How to enable (command + settings)
- ✅ Best use cases listed
- ✅ Anti-patterns listed
- ✅ Mid-session switching caveat
- ✅ Requirements (extra usage, admin approval)
- ✅ Fallback behavior
- ⚠️ Hard to fully verify against source without re-fetching original page content

**Conciseness: 2.5 / 2.5**
- ✅ 8 bullets (at the limit)
- ✅ Every bullet is tight, no wasted words
- ✅ Parentheticals pack info efficiently ($30/$150, 50% off until Feb 16)
- ✅ Clear structure: capability → quality → setup → use → avoid → caveat → requirements → fallback

**Actionability: 2.4 / 2.5**
- ✅ How to enable: /fast command or settings file
- ✅ When to use: interactive work, rapid iteration, debugging
- ✅ When to avoid: long tasks, batch, cost-sensitive
- ✅ Critical gotcha: mid-session switching charges full context at fast rate
- ✅ Requirements clearly stated
- ⚠️ Could specify the actual settings file path (~/.claude/settings.json)

**Accuracy: 2.3 / 2.5**
- ✅ Specific numbers suggest high accuracy ($30/$150, 2.5x, Feb 16)
- ✅ Model name correct (Claude Opus 4.6)
- ✅ Fallback behavior described plausibly
- ⚠️ Cannot fully verify against original without re-fetching the page

### Analysis

**What Went Well:**
- Excellent logical flow that mirrors how a user would think about the feature
- Mid-session switching caveat is subtle but critical - great to highlight
- Pricing + promo deadline packed into a single bullet is efficient
- "Same model quality" immediately addresses users' #1 concern
- Good balance of "what it is" and "how to use it"

**What Needs Work:**
- Settings file path omitted - "settings file" is vague for users unfamiliar with Claude Code config
- "Different API configuration for speed over cost" in bullet 2 is slightly technical/vague - mechanism isn't what users care about
- No mention of whether fast mode affects tool usage or context window (if the docs covered this)

### Recommendations

**For v1.1 prompt improvements:**
1. When summarizing docs with configuration, include the actual file path or config location
2. Focus on user impact over technical mechanism ("same quality, faster responses" > "different API configuration")
3. For promotional/time-sensitive details, consider flagging with emphasis (the Feb 16 deadline is buried in parentheses)

**Notable Observation:**
This is the first URL-based TLDR evaluation. The skill successfully adapted from summarizing conversational Claude messages to summarizing external reference documentation. This suggests the skill handles documentation pages well, though the format (bullet points) is naturally suited to docs summaries.

## User's Evaluation

**Score:** 9.9 / 10.0
**Feedback:** "It did a great job"
