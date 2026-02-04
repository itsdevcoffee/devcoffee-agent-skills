# Remotion Max - Skill Reviewer Report

**Date:** 2026-02-04
**Agent:** plugin-dev:skill-reviewer
**Skill:** remotion-best-practices

---

## Executive Summary

**Status:** Needs Improvement ⚠️

The remotion-best-practices skill has excellent technical content and comprehensive coverage (8,341 words across 29 rule files), but suffers from critical description issues that prevent automatic triggering and lacks proper progressive disclosure structure.

**Strengths:**
- ✅ Comprehensive coverage (29 rule files)
- ✅ High-quality code examples
- ✅ Technical accuracy
- ✅ Consistent structure

**Critical Issues:**
- ❌ Generic description prevents auto-triggering
- ❌ Flat structure without progressive disclosure
- ❌ Inconsistent depth across rule files
- ❌ Broken references

**Rating:** 75% complete - Core content excellent, needs better organization

---

## Critical Issue: Generic Description

**Impact:** CRITICAL - Skill won't trigger automatically

**Current:**
```yaml
description: Best practices for Remotion - Video creation in React
```

**Problem:** This reads like a tagline, not a trigger specification. It lacks:
- Specific trigger phrases users would say
- Context on when to activate
- Example queries
- Concrete scenarios

**Fix:**
```yaml
description: This skill should be used when the user is working with Remotion, the React-based video creation framework. Trigger when user mentions "Remotion animations", "Remotion composition", "video in React", "useCurrentFrame", "interpolate animations", "Remotion audio", "Remotion captions", "spring animations in Remotion", or asks questions like "how do I animate in Remotion?", "how to add audio to Remotion?", "how to create video compositions?", "how to use Three.js with Remotion?". Also trigger when user is working on React video projects that use frame-based rendering.
```

**Additional:** Remove redundant "When to use" section (lines 8-10) from SKILL.md body.

---

## Major Issues

### 1. Broken Reference in charts.md

**File:** `skills/remotion-best-practices/rules/charts.md` (line 20)

**Issue:**
```markdown
See [Bar Chart Example](assets/charts/bar-chart.tsx)
```

**Actual path:**
```
rules/assets/charts-bar-chart.tsx
```

**Fix:**
```markdown
See [Bar Chart Example](assets/charts-bar-chart.tsx)
```

---

### 2. Flat Structure Without Progressive Disclosure

**Current:**
```
remotion-best-practices/
├── SKILL.md (376 words - just a table of contents)
└── rules/ (29 files, 8,341 words - everything)
```

**Problem:** All content in one flat `rules/` directory makes it hard to navigate and doesn't follow progressive disclosure principles.

**Recommended structure:**
```
remotion-best-practices/
├── SKILL.md (400-600 words)
│   ├── What is Remotion? (100-150 words)
│   ├── Core Concepts (150-200 words)
│   └── Pointers to references/rules/examples
│
├── references/  (Conceptual guides)
│   ├── core-concepts.md
│   ├── animation-fundamentals.md
│   ├── media-integration.md
│   ├── advanced-features.md
│   └── troubleshooting.md
│
├── rules/  (Quick reference - keep as-is)
│   └── [29 existing rule files]
│
└── examples/  (Working code)
    ├── basic-text-reveal.tsx
    ├── audio-sync-animation.tsx
    ├── tiktok-captions.tsx
    ├── charts-bar-chart.tsx  (move from rules/assets/)
    └── full-composition/
        ├── Root.tsx
        └── components/
```

**Benefits:**
- Clear entry point (SKILL.md)
- Conceptual overview (references/)
- Quick reference (rules/)
- Complete examples (examples/)

---

### 3. Inconsistent Rule File Depth

**Excellent rules (comprehensive):**
- animations.md - 156 words
- audio.md - 556 words
- timing.md - 562 words
- compositions.md - 312 words

**Weak rules (too brief):**
- transcribe-captions.md - 56 words (just 3 external links)
- can-decode.md - 89 words
- get-audio-duration.md - 78 words
- get-video-duration.md - 78 words
- get-video-dimensions.md - 79 words

**Issue:** Users get inconsistent value - some topics are comprehensive, others are stubs.

**Fix:** Expand minimal rules with:
- Working examples
- Integration patterns
- Common use cases
- Comparison tables

**Example for transcribe-captions.md:**

Currently:
```markdown
Use one of these tools:
1. AssemblyAI - https://assemblyai.com
2. Deepgram - https://deepgram.com
3. Whisper API - https://openai.com/whisper

Choose based on accuracy needs and budget.
```

Should be:
```markdown
## Transcribing Audio for Captions

Generate captions from audio using transcription APIs.

### Options

| Service | Accuracy | Speed | Cost | Best For |
|---------|----------|-------|------|----------|
| AssemblyAI | High | Fast | $$ | Production videos |
| Deepgram | Medium-High | Very Fast | $ | Real-time needs |
| Whisper API | High | Medium | $ | Budget-conscious |

### Integration Example

```typescript
import {transcribe} from '@remotion/captions';

const {captions} = await transcribe({
  audioFile: 'audio.mp3',
  provider: 'assemblyai',
  apiKey: process.env.ASSEMBLYAI_KEY
});

// Use with display-captions.md pattern
```

### Workflow

1. Upload audio to transcription service
2. Receive SRT or JSON output
3. Import with @remotion/captions
4. Display with TikTok-style pages (see display-captions.md)

See also: [display-captions.md](display-captions.md), [import-srt-captions.md](import-srt-captions.md)
```

---

## Content Quality Analysis

### Word Count Statistics

**SKILL.md:** 376 words
**Total rule files:** 8,341 words (29 files)
**Average:** 288 words/file

**Distribution:**
- Largest: extract-frames (585), timing (562), audio (556)
- Smallest: transcribe-captions (56), can-decode (89), get-audio-duration (78)

**Assessment:** Good average, but high variance indicates inconsistency.

---

### Writing Style

**Strengths:**
- ✅ Consistent use of imperative form ("Use", "Set", "Wrap")
- ✅ Clear instructions
- ✅ Minimal fluff
- ✅ Technical accuracy

**Issues:**
- SKILL.md line 10: "Use this skills" (wrong voice, grammatical error)
- Some rules lack introductory context
- No cross-references between related rules

---

### Code Examples

**Strengths:**
- ✅ Present in every rule file
- ✅ Proper TypeScript typing
- ✅ Correct Remotion API usage
- ✅ Real-world patterns
- ✅ Includes comments

**Issues:**
- Only 3 standalone example files (in rules/assets/)
- No complete project examples
- No multi-scene composition examples
- Missing common patterns (split-screen, PiP, complex transitions)

---

### Technical Accuracy

**Assessment:** Excellent ✅

All reviewed code examples:
- Use correct Remotion APIs
- Follow React best practices
- Show proper TypeScript typing
- Handle edge cases appropriately
- Use recommended patterns

**Examples of strong directives:**
- "MUST use useCurrentFrame" (animations.md)
- "FORBIDDEN to use CSS animations" (animations.md)
- "NEVER use relative paths" (assets.md)

---

## Missing Content

### Missing Topics (High Priority)

1. **Performance Optimization**
   - Memoization strategies
   - Avoiding re-renders
   - Bundle size optimization
   - Render time improvements

2. **Error Handling**
   - Common error messages
   - Debugging patterns
   - Validation approaches

3. **Testing**
   - Unit tests for components
   - Snapshot testing
   - Visual regression testing

4. **Deployment & Rendering**
   - Cloud rendering setup
   - Lambda configuration
   - Render optimization
   - CI/CD integration

5. **Project Structure**
   - Recommended file organization
   - Component hierarchy
   - Asset management
   - Configuration patterns

### Missing Topics (Medium Priority)

6. **Custom Hooks**
   - Creating reusable animation hooks
   - State management patterns
   - Context usage

7. **Accessibility**
   - Adding accessibility features
   - Screen reader support
   - Keyboard navigation

8. **Internationalization**
   - Multi-language support
   - Dynamic text
   - RTL layouts

9. **Version Compatibility**
   - Breaking changes between versions
   - Migration guides
   - Deprecation warnings

### Missing Resources

10. **Glossary**
    - frame, fps, durationInFrames
    - composition, still, sequence
    - interpolate, spring, useCurrentFrame
    - premounting, extrapolate

11. **Troubleshooting Guide**
    - Common errors and fixes
    - Performance issues
    - Build problems

12. **FAQ**
    - Common questions
    - Best practice rationale
    - When to use X vs Y

---

## Progressive Disclosure Issues

### Current Problems

1. **SKILL.md is just a table of contents** (lines 12-43)
   - No overview of Remotion
   - No core concepts explanation
   - Just links to rules

2. **No layered information architecture**
   - Everything in rules/ at same level
   - No distinction between basics and advanced
   - No conceptual guides

3. **Examples buried in rules/assets/**
   - Hard to find
   - Not prominent
   - Incomplete coverage

### Recommended Improvements

**Layer 1: SKILL.md (Entry Point)**
```markdown
# Remotion Best Practices

## What is Remotion?

Remotion is a React-based framework for creating videos programmatically...

## Core Concepts

### Frames and Timeline
Video is composed of frames at a specific fps...

### Compositions
Define videos with durationInFrames, fps, dimensions...

### Animations
Use useCurrentFrame, interpolate, and spring...

## How to Use This Skill

- **Quick reference**: See rules/ for specific topics
- **Deep dives**: See references/ for conceptual guides
- **Working examples**: See examples/ for complete code

## Quick Links

[Animation Basics](references/animation-fundamentals.md)
[All Rules](rules/)
[Example Projects](examples/)
```

**Layer 2: references/ (Conceptual Guides)**
- 4-5 comprehensive guides explaining concepts
- 500-1000 words each
- Link to relevant rules
- Show big picture

**Layer 3: rules/ (Quick Reference)**
- Keep existing 29 files
- Expand weak ones
- Add cross-references

**Layer 4: examples/ (Working Code)**
- Complete project examples
- Runnable compositions
- Cover common use cases

---

## Integration with Agents

### Current Integration

Agents reference the skill:
- remotion-builder: "use remotion-best-practices skill" (line 22)
- remotion-setup: Mentions best practices

### Issues

1. **Skill not automatically loaded**
   - Description doesn't trigger properly
   - Agents must explicitly load it

2. **No explicit loading instructions**
   - Agents mention skill but don't load it systematically
   - Missing "Load skill first" step

3. **Redundant content**
   - Agents duplicate skill content instead of referencing
   - Example: "Always use useCurrentFrame" in both agent and skill

4. **No feedback loop**
   - Agents don't explain which rules they're following
   - Users don't learn rule names

### Recommended Improvements

**Agent instructions should:**
```markdown
## Before Starting

1. Load remotion-best-practices skill if not already loaded
2. Read relevant rule files based on user's request
3. Follow patterns from skill exactly

## When Generating Code

Explain which rules you're following:
"I'm using the animation pattern from rules/animations.md which requires..."

## After Generation

Cite relevant rules:
"For more information, see:
- rules/animations.md for animation patterns
- rules/timing.md for interpolation curves"
```

**Skill description must trigger automatically** (see Critical Issue above).

---

## Priority Recommendations

### Priority 1 (CRITICAL - 1 hour)

1. **Fix skill description** to include trigger phrases
   ```yaml
   description: This skill should be used when the user is working with Remotion... [see fix above]
   ```

2. **Remove "When to use" section** from SKILL.md body (lines 8-10)

3. **Fix broken reference** in charts.md (line 20)

### Priority 2 (HIGH - 2-3 hours)

4. **Implement progressive disclosure structure**
   - Create references/ directory
   - Add 4-5 conceptual guides
   - Update SKILL.md to be entry point

5. **Expand weak rule files**
   - transcribe-captions.md (add examples, comparison)
   - get-*-duration/dimensions.md (add integration patterns)
   - can-decode.md (add use cases)

### Priority 3 (MEDIUM - 2-3 hours)

6. **Create examples/ directory**
   - Move existing assets/ examples
   - Add 5-7 complete working examples
   - Include README for each

7. **Add cross-references**
   - "See also" sections in rule files
   - Link related concepts
   - Create rule relationships map

### Priority 4 (LOW - 2-3 hours)

8. **Add missing resources**
   - Glossary
   - Troubleshooting guide
   - FAQ
   - Common pitfalls

9. **Add missing topics**
   - Performance optimization
   - Error handling
   - Testing
   - Deployment

---

## File-Specific Issues

### SKILL.md

**Line 8-10:** Remove this section
```markdown
## When to use

Use this skills whenever you are dealing with Remotion code to obtain the domain-specific knowledge.
```
**Reason:** Wrong voice, grammatical error, redundant with description

**Line 12-43:** Move table of contents to separate file
- Create references/rule-index.md
- Add conceptual overview to SKILL.md instead

### charts.md

**Line 20:** Fix broken reference
```markdown
- See [Bar Chart Example](assets/charts/bar-chart.tsx)
+ See [Bar Chart Example](assets/charts-bar-chart.tsx)
```

### transcribe-captions.md

**Entire file:** Expand from 56 to 200-300 words
- Add comparison table
- Add integration example
- Add workflow steps
- Link to related rules

---

## Positive Aspects

1. **Excellent Technical Content**
   - All code examples are correct
   - Follows Remotion best practices
   - Proper TypeScript usage

2. **Comprehensive Coverage**
   - 29 topics covered
   - 8,341 words total
   - Core features well-documented

3. **Consistent Structure**
   - Uniform frontmatter
   - Consistent naming (kebab-case)
   - Logical grouping

4. **Good Writing**
   - Imperative voice
   - Clear instructions
   - Minimal fluff

5. **Strong Directives**
   - Uses MUST/FORBIDDEN appropriately
   - Clear about critical rules
   - Explains rationale

6. **Real-World Examples**
   - Code shows actual usage
   - Covers common patterns
   - Includes assets

7. **Well-Maintained**
   - Recent content
   - Current Remotion APIs
   - Active development

---

## Conclusion

The remotion-best-practices skill is **75% complete**:

**Core content:** Excellent (29 comprehensive rule files)
**Organization:** Needs work (flat structure, no progressive disclosure)
**Discovery:** Critical issue (description won't trigger automatically)
**Integration:** Needs improvement (better agent integration)

**Estimated effort to bring to "Pass":** 8-10 hours

**Immediate next steps:**
1. Fix description (15 min)
2. Fix broken reference (5 min)
3. Create references/ structure (2 hours)
4. Expand weak rules (2 hours)
5. Create examples/ directory (3 hours)

**Result:** Production-ready skill that automatically triggers, has clear navigation, and provides comprehensive guidance at all levels.

---

**Reviewed by:** plugin-dev:skill-reviewer agent
**Date:** 2026-02-04
