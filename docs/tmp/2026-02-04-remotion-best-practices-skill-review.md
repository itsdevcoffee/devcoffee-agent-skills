# Skill Review: remotion-best-practices

**Reviewer:** plugin-dev:skill-reviewer
**Date:** 2026-02-04
**Context:** Post-real-world test failure analysis
**Priority:** CRITICAL - Blocking v1.0 release

---

## Executive Summary

The remotion-best-practices skill has excellent structure and comprehensive coverage of Remotion features, BUT contains critical content gaps that directly caused 0% first-try success rate in real-world testing. The skill has 30 rule files with 8,341 total words, but the most critical file (tailwind.md) has only 56 words and essentially says "go fetch the docs yourself" - which is the opposite of what a skill should do.

**Overall Rating:** NEEDS MAJOR REVISION

**Impact:** Agents using this skill generated completely broken code requiring 5 manual fixes:
1. Missing @remotion/tailwind package
2. Missing enableTailwind() config
3. Missing CSS import in entry point
4. Missing 'flex' class on centering utilities
5. Hardcoded concurrency values

**Root Cause:** Critical integration patterns, setup requirements, and common gotchas are missing from skill content.

---

## Summary

### Overall Assessment

**Strengths:**
- ✅ Excellent structure and organization
- ✅ Comprehensive coverage of Remotion APIs (30 rule files)
- ✅ Good examples for most features
- ✅ Clear, concise descriptions
- ✅ Proper frontmatter and metadata

**Critical Weaknesses:**
- ❌ Missing critical integration patterns (Tailwind + Remotion)
- ❌ Missing setup/configuration requirements
- ❌ Missing common mistakes documentation
- ❌ Missing troubleshooting guidance
- ❌ Key rule files delegate to external docs instead of providing actionable content

**Word Counts:**
- SKILL.md: 428 words (good - lean and focused)
- rules/ total: 8,341 words across 30 files
- Average per rule: 278 words
- Smallest: tailwind.md (56 words) - CRITICAL PROBLEM
- Largest: extract-frames.md (585 words)

### Real-World Test Results

**Test:** Create 15-second explainer video using remotion-max plugin (which uses this skill)

**Outcome:** COMPLETE FAILURE
- First-try success rate: 0%
- Manual fixes required: 5 critical issues
- Time wasted debugging: 20-30 minutes
- User satisfaction: "utterly trash", "total dog shit"

**Direct causation:** The skill content gaps directly caused agents to generate broken code.

---

## Description Analysis

### Current Description

```yaml
description: This skill should be used when the user is working with Remotion, the React-based video creation framework. Trigger when user mentions "Remotion animations", "Remotion composition", "video in React", "useCurrentFrame", "interpolate animations", "Remotion audio", "Remotion captions", "spring animations in Remotion", or asks questions like "how do I animate in Remotion?", "how to add audio to Remotion?", "how to create video compositions?", "how to use Three.js with Remotion?". Also trigger when user is working on React video projects that use frame-based rendering.
```

### Assessment

**Strengths:**
- ✅ Third-person phrasing ("This skill should be used when...")
- ✅ Excellent trigger phrases ("Remotion animations", "useCurrentFrame", etc.)
- ✅ Specific user queries included ("how do I animate in Remotion?")
- ✅ Covers main use cases (animations, audio, captions, 3D)
- ✅ Good length (421 characters - not too long)

**Issues:**
- Minor: Could mention Tailwind integration as a trigger
- Minor: Could mention video setup/configuration as trigger

### Recommendations

**Verdict:** Description is EXCELLENT - no changes needed.

Optional enhancement (not required):
```yaml
description: This skill should be used when the user is working with Remotion, the React-based video creation framework. Trigger when user mentions "Remotion animations", "Remotion composition", "Remotion setup", "Tailwind with Remotion", "video in React", "useCurrentFrame", "interpolate animations", "Remotion audio", "Remotion captions", "spring animations in Remotion", or asks questions like "how do I animate in Remotion?", "how to add audio to Remotion?", "how to set up Remotion with Tailwind?", "how to create video compositions?", "how to use Three.js with Remotion?". Also trigger when user is working on React video projects that use frame-based rendering.
```

---

## Content Quality

### SKILL.md Analysis

**Word count:** 428 words
**Assessment:** EXCELLENT - Lean, focused, properly structured

**Structure:**
- ✅ Clear "How to use" section
- ✅ Well-organized list of rule files
- ✅ Descriptive summaries for each rule
- ✅ Easy to scan and navigate

**Writing style:** GOOD - Imperative form, clear descriptions

**Issues:** None with SKILL.md itself

**Recommendation:** SKILL.md is perfect as-is. The issues are in the rule files it references.

---

### Rules Directory Analysis

**Total files:** 30 rule files
**Total words:** 8,341 words (average 278 words per file)
**Quality distribution:**

**Excellent (400+ words, complete content):**
- extract-frames.md (585 words)
- timing.md (562 words)
- audio.md (556 words)
- videos.md (486 words)
- fonts.md (474 words)
- gifs.md (461 words)
- display-captions.md (434 words)
- transitions.md (409 words)
- measuring-text.md (405 words)
- compositions.md (388 words)

**Good (200-400 words):**
- Most other files in this range

**CRITICAL PROBLEM (inadequate content):**
- tailwind.md (56 words) - BLOCKS REAL-WORLD USE

---

### Critical Content Gap: tailwind.md

**Current content (COMPLETE FILE):**
```markdown
---
name: tailwind
description: Using TailwindCSS in Remotion.
metadata:
---

You can and should use TailwindCSS in Remotion, if TailwindCSS is installed in the project.

Don't use `transition-*` or `animate-*` classes - always animate using the `useCurrentFrame()` hook.

Tailwind must be installed and enabled first in a Remotion project - fetch https://www.remotion.dev/docs/tailwind using WebFetch for instructions.
```

**Word count:** 56 words (should be 300-500 words minimum)

**Critical Problems:**

1. **Delegates to external docs instead of providing actionable content**
   - Says "fetch https://www.remotion.dev/docs/tailwind using WebFetch for instructions"
   - This is the OPPOSITE of what a skill should do
   - Skills exist to provide the information directly

2. **Missing critical package requirement**
   - Doesn't mention @remotion/tailwind package
   - Without this package, Tailwind doesn't work AT ALL in Remotion
   - This directly caused real-world test failure #1

3. **Missing critical configuration requirement**
   - Doesn't mention enableTailwind() requirement
   - Without this, Tailwind classes are ignored
   - This directly caused real-world test failure #2

4. **Missing CSS import requirement**
   - Doesn't mention that style.css must be imported in entry point
   - Without this, Tailwind doesn't load
   - This directly caused real-world test failure #3

5. **Missing the #1 most common gotcha**
   - Doesn't mention AbsoluteFill + flex class requirement
   - Using items-center/justify-center without 'flex' class doesn't work
   - This directly caused real-world test failure #4

**Impact:**
This single inadequate file caused 4 out of 5 critical failures in real-world testing.

**Recommendation: COMPLETE REWRITE REQUIRED**

See "Specific Issues" section below for complete replacement content.

---

## Progressive Disclosure

### Current Structure

**SKILL.md:** 428 words ✅
**references/:** 0 files (directory doesn't exist)
**examples/:** 0 files (directory doesn't exist)
**scripts/:** 0 files (directory doesn't exist)
**rules/:** 30 files, 8,341 words

### Assessment

**Structure:** PARTIALLY EFFECTIVE

The skill uses a unique approach:
- SKILL.md is a pure index/navigation file (excellent)
- All content is in rules/ subdirectory (unusual but works)
- No references/ or examples/ directories (missing opportunity)

**What works:**
- ✅ SKILL.md is lean and navigable
- ✅ Rules are modular and focused
- ✅ Easy to find specific topics

**What could be better:**
- ⚠️ No examples/ directory for complete working code
- ⚠️ No references/ for in-depth conceptual docs
- ⚠️ Rules contain code snippets but not complete examples

**Recommendations:**

1. **Add examples/ directory** for complete, working component templates:
   - examples/centered-title-card.tsx
   - examples/tailwind-gradient-background.tsx
   - examples/spring-animated-list.tsx
   - examples/audio-visualization.tsx

2. **Add references/ directory** for integration guides:
   - references/tailwind-integration-complete-guide.md
   - references/troubleshooting.md
   - references/common-mistakes.md
   - references/configuration-best-practices.md

3. **Keep rules/ lean** - move detailed explanations to references/

**Priority:** MEDIUM (nice to have, not blocking)

---

## Specific Issues

### Critical (5 issues - BLOCKS RELEASE)

#### 1. tailwind.md - Inadequate Content (CRITICAL)

**File:** /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/rules/tailwind.md
**Current:** 56 words, delegates to external docs
**Required:** 300-500 words with complete integration instructions

**Impact:** Directly caused 4/5 real-world test failures

**Fix:** Complete rewrite required. Recommended content:

```markdown
---
name: tailwind
description: Using TailwindCSS in Remotion - installation, configuration, and common patterns.
metadata:
  tags: tailwind, css, styling, configuration
---

## Installation and Setup

Remotion requires a special integration package for Tailwind CSS to work correctly.

### Required Packages

```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D @remotion/tailwind
```

**CRITICAL:** The `@remotion/tailwind` package is REQUIRED. Standard Tailwind doesn't work in Remotion without it.

### Configuration Files

**1. tailwind.config.js:**
```javascript
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**2. postcss.config.js:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**3. src/style.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4. remotion.config.ts (CRITICAL):**
```typescript
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';

Config.overrideWebpackConfig((config) => {
  return enableTailwind(config);
});
```

**5. src/index.tsx (CRITICAL):**
```typescript
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';
import './style.css';  // REQUIRED - Tailwind won't work without this

registerRoot(RemotionRoot);
```

ALL 5 configuration steps are required for Tailwind to work in Remotion.

## Common Patterns

### AbsoluteFill with Centering

The #1 most common mistake when using Tailwind with Remotion:

**❌ WRONG - Won't center:**
```tsx
<AbsoluteFill className="items-center justify-center">
```

**✅ CORRECT - Must add 'flex':**
```tsx
<AbsoluteFill className="flex items-center justify-center">
```

**Why:** `items-center` and `justify-center` are flexbox utilities. They require `display: flex` to work. AbsoluteFill defaults to `display: block`, so you must add the `flex` class.

### Complete Centered Layout

```tsx
import {AbsoluteFill} from 'remotion';

export const CenteredCard = () => {
  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
      <h1 className="text-6xl font-bold text-white">Title</h1>
      <p className="text-2xl text-gray-200 mt-4">Subtitle</p>
    </AbsoluteFill>
  );
};
```

**Key elements:**
- `flex` - enables flexbox
- `flex-col` - vertical stacking
- `items-center` - horizontal centering
- `justify-center` - vertical centering
- `bg-gradient-to-br` - background gradient (works without flex)

## Animation Rules

**NEVER use Tailwind animation classes:**
- ❌ Don't use: `transition-*`, `animate-*`, `duration-*`
- ✅ Use instead: `useCurrentFrame()` + `interpolate()` or `spring()`

**Example:**
```tsx
import {useCurrentFrame, interpolate} from 'remotion';

export const FadeIn = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{opacity}} // ✅ Animate with style prop
      className="text-4xl text-white" // ✅ Style with Tailwind
    >
      Hello World
    </div>
  );
};
```

**Rule:** Animations use `style` prop, layout/colors use Tailwind classes.

## Common Mistakes

1. **Missing @remotion/tailwind package** → Classes ignored completely
2. **Missing enableTailwind() in config** → Tailwind not processed
3. **Missing CSS import in entry point** → Styles don't load
4. **Missing 'flex' before centering utilities** → Content appears in top-left
5. **Using Tailwind animations** → Won't render correctly in video

## Troubleshooting

**Tailwind classes not working:**
1. Check @remotion/tailwind is installed
2. Verify enableTailwind() in remotion.config.ts
3. Verify import './style.css' in src/index.tsx
4. Check tailwind.config.js content paths include your files

**Content not centering:**
1. Add 'flex' class to AbsoluteFill
2. Verify 'items-center justify-center' come after 'flex'

**Background colors not showing:**
1. Check CSS import in entry point
2. Verify Tailwind config is correct
3. Try running `npm run build` to see any errors
```

**Word count:** ~450 words
**Improvement:** 56 → 450 words (8x increase in actionable content)

---

#### 2. Missing Rule: tailwind-remotion-integration.md (CRITICAL)

**Location:** Should exist at rules/tailwind-remotion-integration.md
**Status:** MISSING
**Priority:** P0 - BLOCKING

**Why needed:**
- Deep dive into Tailwind + Remotion integration
- Complete setup checklist
- Common gotchas and solutions
- Troubleshooting guide

**Recommended content:** See references/tailwind-integration-complete-guide.md (to be created)

**Fix:** Create as new rule file or expand tailwind.md (recommended: expand tailwind.md as shown above)

---

#### 3. Missing Rule: common-mistakes.md (HIGH)

**Location:** Should exist at rules/common-mistakes.md
**Status:** MISSING
**Priority:** P0 - BLOCKING

**Why needed:**
Preventative documentation that helps agents avoid known pitfalls.

**Recommended content:**

```markdown
---
name: common-mistakes
description: Common mistakes to avoid when building Remotion videos
metadata:
  tags: troubleshooting, mistakes, gotchas, errors
---

## Top 10 Common Mistakes

### 1. Missing 'flex' Class on AbsoluteFill

**Problem:**
```tsx
<AbsoluteFill className="items-center justify-center">
```

**Why it fails:** Flexbox utilities require `display: flex`

**Fix:**
```tsx
<AbsoluteFill className="flex items-center justify-center">
```

### 2. Using CSS Animations

**Problem:**
```tsx
<div className="animate-bounce">
```

**Why it fails:** CSS animations don't synchronize with Remotion timeline

**Fix:**
```tsx
const frame = useCurrentFrame();
const y = Math.sin(frame / 10) * 20;
return <div style={{transform: `translateY(${y}px)`}}>
```

### 3. Missing CSS Import

**Problem:** Tailwind classes don't work even though everything is configured

**Why it fails:** style.css not imported in entry point

**Fix:** Add to src/index.tsx:
```typescript
import './style.css';
```

### 4. Hardcoded System Values

**Problem:**
```typescript
Config.setConcurrency(50);
```

**Why it fails:** System may have fewer than 50 cores

**Fix:**
```typescript
// Omit setConcurrency - auto-detects correctly
```

### 5. Wrong Import Sources

**Problem:**
```tsx
import {useState} from 'react';
import {Img} from 'react';
```

**Why it fails:** Remotion provides specialized components

**Fix:**
```tsx
import {useState} from 'react';
import {Img} from 'remotion'; // ✅ From remotion, not react
```

### 6. Animations That Reference Real Time

**Problem:**
```tsx
const opacity = Date.now() / 1000;
```

**Why it fails:** Each frame renders independently, Date.now() is unpredictable

**Fix:**
```tsx
const frame = useCurrentFrame();
const opacity = frame / 30; // Consistent across renders
```

### 7. Missing extrapolateRight on interpolate

**Problem:**
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1]);
```

**Why it's problematic:** Animation continues beyond frame 30 in unexpected ways

**Fix:**
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp', // Stays at 1 after frame 30
});
```

### 8. Not Checking for null/undefined Props

**Problem:**
```tsx
export const MyComp: React.FC<{data: Data}> = ({data}) => {
  return <div>{data.title}</div>; // Crashes if data is null
};
```

**Fix:**
```tsx
export const MyComp: React.FC<{data?: Data}> = ({data}) => {
  if (!data) return null;
  return <div>{data.title}</div>;
};
```

### 9. Using Local File Paths Directly

**Problem:**
```tsx
<Img src="/Users/me/Desktop/image.png" />
```

**Why it fails:** Paths aren't portable, won't work in CI/CD

**Fix:**
```tsx
import {staticFile} from 'remotion';
<Img src={staticFile('image.png')} /> // Put in public/ folder
```

### 10. Not Handling Loading States

**Problem:**
```tsx
const {data} = useFetch(url);
return <div>{data.title}</div>; // Crashes before data loads
```

**Fix:**
```tsx
const {data, isLoading} = useFetch(url);
if (isLoading) return <div>Loading...</div>;
return <div>{data.title}</div>;
```

## Prevention Checklist

Before generating components:
- [ ] Verify AbsoluteFill centering includes 'flex' class
- [ ] Confirm all animations use useCurrentFrame(), not CSS
- [ ] Check CSS import exists if using Tailwind
- [ ] Ensure no hardcoded system values
- [ ] Verify imports come from correct packages
- [ ] Add extrapolateRight to interpolate() calls
- [ ] Include null checks for optional props
- [ ] Use staticFile() for assets
- [ ] Handle loading states
```

**Word count:** ~400 words
**Priority:** P0 - Add before v1.0 release

---

#### 4. Missing Rule: troubleshooting.md (HIGH)

**Location:** Should exist at rules/troubleshooting.md
**Status:** MISSING
**Priority:** P1 - High priority

**Why needed:**
When things go wrong, agents (and users) need diagnostic guidance.

**Recommended content:**

```markdown
---
name: troubleshooting
description: Troubleshooting common Remotion issues and error messages
metadata:
  tags: debugging, errors, troubleshooting, fixes
---

## Common Issues and Solutions

### Black Screen / No Visual Output

**Symptoms:** Video renders but shows black screen or empty frames

**Common causes:**

1. **Missing CSS import (if using Tailwind)**
   - Check: Does src/index.tsx import './style.css'?
   - Fix: Add `import './style.css';`

2. **Missing enableTailwind() (if using Tailwind)**
   - Check: Does remotion.config.ts call enableTailwind()?
   - Fix: Add webpack override with enableTailwind()

3. **Component returning null**
   - Check: Does component have conditional returns?
   - Fix: Add fallback UI or debug with console.log

4. **Animations start at 0 opacity**
   - Check: Do animations start from 0?
   - Fix: Adjust interpolate ranges or add initial delay

### Content Not Centering

**Symptoms:** Content appears in top-left corner instead of centered

**Common cause:** Missing 'flex' class on AbsoluteFill

**Fix:**
```tsx
// Before (wrong)
<AbsoluteFill className="items-center justify-center">

// After (correct)
<AbsoluteFill className="flex items-center justify-center">
```

### Tailwind Classes Not Working

**Symptoms:** Tailwind classes have no effect, default styling shows

**Diagnostic checklist:**
1. Is @remotion/tailwind installed? `npm list @remotion/tailwind`
2. Is enableTailwind() in remotion.config.ts?
3. Is style.css imported in entry point?
4. Does tailwind.config.js include content paths?
5. Does style.css have @tailwind directives?

**Fix:** Follow all 5 steps in rules/tailwind.md

### Build Errors

#### Error: Maximum for --concurrency is X

**Cause:** setConcurrency() set higher than CPU core count

**Fix:** Remove setConcurrency() from remotion.config.ts (auto-detects)

#### Error: Cannot find module '@remotion/tailwind'

**Cause:** Package not installed

**Fix:** `npm install -D @remotion/tailwind`

#### Error: Module not found: Can't resolve './style.css'

**Cause:** CSS file missing

**Fix:** Create src/style.css with @tailwind directives

### Animations Not Working

**Symptoms:** Content appears static, no movement

**Common causes:**

1. **Using CSS animations/transitions**
   - Check: Are animate-* or transition-* classes used?
   - Fix: Replace with useCurrentFrame() + interpolate()

2. **Not using useCurrentFrame()**
   - Check: Does component call useCurrentFrame()?
   - Fix: Add frame-based animations

3. **Wrong frame range**
   - Check: Is interpolate range too short/long?
   - Fix: Adjust frame values based on fps and duration

### TypeScript Errors

#### Property 'X' does not exist on type 'Y'

**Cause:** Props type mismatch

**Fix:** Add proper TypeScript types to component props

#### Cannot find module 'remotion'

**Cause:** Remotion not installed or wrong import

**Fix:** `npm install remotion` and verify imports

### Performance Issues

**Symptoms:** Slow rendering, high CPU usage, crashes

**Solutions:**

1. **Reduce concurrency:** Let Remotion auto-detect
2. **Lower quality during preview:** Set lower resolution
3. **Optimize heavy computations:** Memoize expensive calculations
4. **Use fewer simultaneous animations:** Stagger animations

### Studio Won't Start

**Diagnostic steps:**

```bash
# 1. Check TypeScript compiles
npx tsc --noEmit

# 2. Check for port conflicts
lsof -i :3000

# 3. Clear cache
rm -rf node_modules/.cache

# 4. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 5. Try starting with verbose logging
npm start -- --verbose
```

## Getting Help

If none of these solutions work:

1. Check Remotion Discord: https://remotion.dev/discord
2. Search GitHub issues: https://github.com/remotion-dev/remotion/issues
3. Review documentation: https://remotion.dev/docs
4. Enable verbose logging for error details
```

**Word count:** ~450 words
**Priority:** P1 - Add for v1.1 release

---

#### 5. Missing Rule: configuration-best-practices.md (MEDIUM)

**Location:** Should exist at rules/configuration-best-practices.md
**Status:** MISSING
**Priority:** P2 - Nice to have

**Why needed:**
Prevent configuration mistakes like hardcoded concurrency.

**Recommended content:**

```markdown
---
name: configuration-best-practices
description: Best practices for remotion.config.ts configuration
metadata:
  tags: configuration, setup, best-practices
---

## remotion.config.ts Best Practices

### Auto-Detection Over Hardcoding

**❌ DON'T hardcode system-dependent values:**
```typescript
Config.setConcurrency(50);  // Fails on systems with <50 cores
Config.setPort(3000);       // May conflict with other services
```

**✅ DO let Remotion auto-detect:**
```typescript
// Omit setConcurrency - auto-detects based on CPU
// Omit setPort - finds available port automatically
```

### Minimal Configuration

Only set what you need to customize:

```typescript
import {Config} from '@remotion/cli/config';

// Universal settings (safe to set)
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');

// System-specific (let auto-detect)
// Config.setConcurrency() - OMIT
// Config.setPort() - OMIT
```

### Webpack Overrides

If using Tailwind or other Webpack customizations:

```typescript
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';

Config.overrideWebpackConfig((config) => {
  // Apply modifications
  let modifiedConfig = enableTailwind(config);

  // Can chain more modifications
  // modifiedConfig = addSomeOtherPlugin(modifiedConfig);

  return modifiedConfig;
});
```

### Environment-Specific Settings

Use environment variables for different environments:

```typescript
import {Config} from '@remotion/cli/config';

if (process.env.NODE_ENV === 'production') {
  Config.setVideoImageFormat('png'); // Higher quality
  Config.setCodec('prores'); // Best quality codec
} else {
  Config.setVideoImageFormat('jpeg'); // Faster preview
  Config.setCodec('h264'); // Faster encoding
}
```

### Safe Defaults

```typescript
import {Config} from '@remotion/cli/config';

// ✅ Safe to set (universal)
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');

// ✅ Safe to set (documented limits)
Config.setImageSequence(false);
Config.setLogLevel('info');

// ⚠️ Use with caution (system-dependent)
// Config.setConcurrency() - prefer auto-detect
// Config.setPort() - prefer auto-detect

// ❌ Avoid (rarely needed)
// Config.setPublicDir() - default is correct
// Config.setEntryPoint() - specified in scripts
```

## Common Configuration Mistakes

1. **Hardcoded concurrency** → Build fails on different systems
2. **Hardcoded ports** → Conflicts with existing services
3. **Wrong codec for use case** → Large files or slow encoding
4. **Not using environment variables** → Same config for dev/prod
5. **Overriding defaults unnecessarily** → Breaks expected behavior
```

**Word count:** ~280 words
**Priority:** P2 - Optional enhancement

---

### Major (0 issues)

No major issues identified. The critical issues are severe enough that there are no "major" tier issues.

---

### Minor (3 issues)

#### 1. No examples/ Directory

**Location:** Should exist at /examples/
**Current:** Directory doesn't exist
**Impact:** Users don't have complete working code to reference

**Recommendation:** Create examples directory with complete, tested components:

```
examples/
  centered-title-card.tsx
  tailwind-gradient-background.tsx
  spring-animated-list.tsx
  audio-visualization.tsx
  video-with-captions.tsx
  README.md (explaining how to use examples)
```

**Priority:** P2 - Nice to have

---

#### 2. No references/ Directory

**Location:** Should exist at /references/
**Current:** Directory doesn't exist
**Impact:** Nowhere to put in-depth conceptual documentation

**Recommendation:** Create references directory for deep-dive content:

```
references/
  tailwind-integration-complete-guide.md
  animation-patterns.md
  performance-optimization.md
  typescript-patterns.md
  README.md
```

**Priority:** P3 - Optional

---

#### 3. Some Rule Files Could Use More Examples

**Files:** Several rule files have good explanations but limited examples

**Examples:**
- sequencing.md - Could use more complex sequencing patterns
- transitions.md - Could show more transition types
- text-animations.md - Could show more animation patterns

**Recommendation:** Gradually enhance rule files with more code examples as patterns emerge from real-world use.

**Priority:** P3 - Ongoing improvement

---

## Positive Aspects

### What's Done Exceptionally Well

1. **Excellent SKILL.md Structure**
   - Lean, focused navigation file
   - Clear descriptions for each rule
   - Easy to scan and find topics
   - Perfect length (428 words)

2. **Comprehensive API Coverage**
   - 30 rule files covering all major Remotion features
   - 3D content, animations, audio, video, captions, etc.
   - Good depth on advanced topics (calculateMetadata, Lottie, etc.)

3. **Good Code Examples**
   - Most rules have clear, working code examples
   - TypeScript throughout
   - Proper imports and types shown

4. **Clear Organization**
   - Logical grouping of related topics
   - Consistent naming conventions
   - Good use of frontmatter metadata

5. **Concise Writing**
   - Clear, direct language
   - Good use of imperative form
   - No unnecessary verbosity

6. **Excellent Description**
   - Perfect trigger phrases
   - Third-person phrasing
   - Specific user queries included
   - Good length and detail

### What This Proves

The skill creator(s) clearly understand:
- ✅ How to structure skills effectively
- ✅ How to write clear descriptions
- ✅ How to organize content logically
- ✅ How to write concise, actionable guidance
- ✅ Remotion API and best practices

**The core competency is excellent.** The issues are gaps in critical integration topics that only became apparent through real-world testing.

---

## Overall Rating

**NEEDS MAJOR REVISION**

**Breakdown:**
- Structure: ✅ EXCELLENT (5/5)
- Description: ✅ EXCELLENT (5/5)
- API Coverage: ✅ EXCELLENT (5/5)
- Code Examples: ✅ GOOD (4/5)
- Integration Patterns: ❌ INADEQUATE (1/5) ← CRITICAL
- Setup/Configuration: ❌ MISSING (0/5) ← CRITICAL
- Common Gotchas: ❌ MISSING (0/5) ← CRITICAL
- Troubleshooting: ❌ MISSING (0/5) ← CRITICAL

**Overall:** 3/5 (would be 5/5 with fixes)

**Blocks v1.0 Release:** YES

**Reason:** The missing integration patterns and setup guidance directly caused 0% first-try success rate in real-world testing. Agents using this skill generate broken code.

---

## Priority Recommendations

### P0 - BLOCKING (Must fix before v1.0)

**Estimated time:** 3-4 hours

1. **Rewrite tailwind.md** (2 hours)
   - Expand from 56 → 450+ words
   - Include all 5 required setup steps
   - Document AbsoluteFill + flex gotcha
   - Add troubleshooting section
   - See complete content above

2. **Create common-mistakes.md** (1 hour)
   - Document top 10 mistakes
   - Include prevention checklist
   - Add code examples for each
   - See complete content above

3. **Create troubleshooting.md** (1 hour)
   - Black screen debugging
   - Tailwind not working
   - Build errors
   - Animation issues
   - See complete content above

**Success criteria:**
- Agents have all information needed to generate working code
- No delegation to external docs for critical setup
- Common mistakes documented and preventable

---

### P1 - HIGH PRIORITY (Should fix for v1.1)

**Estimated time:** 2-3 hours

4. **Create configuration-best-practices.md** (1 hour)
   - Document auto-detection best practices
   - Show safe vs. dangerous config
   - Environment-specific patterns

5. **Add examples/ directory** (2 hours)
   - Create 5-6 complete, tested components
   - Include README explaining usage
   - Cover common patterns

**Success criteria:**
- Agents have working templates to reference
- Configuration mistakes prevented
- Users have copy-paste examples

---

### P2 - MEDIUM PRIORITY (Nice to have for v2.0)

**Estimated time:** 4-5 hours

6. **Create references/ directory** (2 hours)
   - Deep-dive integration guides
   - Conceptual documentation
   - Advanced patterns

7. **Enhance existing rules** (2-3 hours)
   - Add more examples to thin rules
   - Expand common patterns
   - Add edge cases

8. **Add automated testing** (ongoing)
   - Verify code examples compile
   - Test against latest Remotion
   - Catch regressions

**Success criteria:**
- Comprehensive documentation
- All examples tested and working
- No stale/outdated content

---

## Test Plan for Validation

After applying P0 fixes, verify with these tests:

### Test 1: Basic Tailwind Setup
```
User prompt: "Set up a new Remotion project with Tailwind CSS"
Expected: All 5 setup steps completed correctly
Success criteria: Project builds and renders Tailwind classes
```

### Test 2: Centered Component
```
User prompt: "Create a centered title card with a gradient background"
Expected: Component includes 'flex' class on AbsoluteFill
Success criteria: Content actually centers
```

### Test 3: Full Video
```
User prompt: "Create a 15-second explainer video with 3 scenes"
Expected: All components work on first render
Success criteria: No manual fixes required
```

### Test 4: Error Recovery
```
Scenario: Inject a common mistake (remove flex class)
User prompt: "The content isn't centering, help me debug"
Expected: Agent identifies missing flex class
Success criteria: Agent provides specific fix
```

**Success threshold:** 4/4 tests pass with 0 manual interventions

---

## Content Recommendations by File

### rules/tailwind.md

**Current:** 56 words, inadequate
**Recommended:** 450+ words (see complete rewrite in "Specific Issues" section above)

**Key additions:**
- All 5 required setup steps with code
- AbsoluteFill + flex class pattern
- Animation rules (no CSS animations)
- Common mistakes
- Troubleshooting checklist

---

### rules/common-mistakes.md (NEW)

**Status:** Doesn't exist
**Recommended:** 400 words (see complete content in "Specific Issues" section above)

**Structure:**
- Top 10 mistakes with examples
- Why each fails
- How to fix each
- Prevention checklist

---

### rules/troubleshooting.md (NEW)

**Status:** Doesn't exist
**Recommended:** 450 words (see complete content in "Specific Issues" section above)

**Structure:**
- Common symptoms
- Diagnostic steps
- Solutions for each issue
- Getting help resources

---

### rules/configuration-best-practices.md (NEW)

**Status:** Doesn't exist
**Recommended:** 280 words (see complete content in "Specific Issues" section above)

**Structure:**
- Auto-detection over hardcoding
- Minimal configuration approach
- Safe defaults
- Common mistakes

---

## Implementation Checklist

### Phase 1: Critical Fixes (P0)

- [ ] Backup existing tailwind.md
- [ ] Replace tailwind.md with expanded content (450+ words)
- [ ] Create common-mistakes.md (400 words)
- [ ] Create troubleshooting.md (450 words)
- [ ] Update SKILL.md to reference new files
- [ ] Test with remotion-max agents
- [ ] Run real-world test (15-second video)
- [ ] Verify 0 manual fixes required

**Estimated time:** 3-4 hours
**Blocks release:** YES

---

### Phase 2: High Priority (P1)

- [ ] Create configuration-best-practices.md (280 words)
- [ ] Create examples/ directory
- [ ] Add 5 complete component examples
- [ ] Add examples/README.md
- [ ] Update SKILL.md to reference examples
- [ ] Test example components compile
- [ ] Document example usage patterns

**Estimated time:** 2-3 hours
**Release:** v1.1

---

### Phase 3: Enhancements (P2)

- [ ] Create references/ directory
- [ ] Add integration guides
- [ ] Enhance thin rule files
- [ ] Add automated testing
- [ ] Set up CI for example testing
- [ ] Add more edge case documentation

**Estimated time:** 4-5 hours
**Release:** v2.0

---

## Validation Report

After implementing fixes, create validation report:

**File:** docs/tmp/2026-02-04-remotion-best-practices-post-fix-validation.md

**Contents:**
- [ ] All P0 fixes applied
- [ ] Word counts for updated files
- [ ] Real-world test results
- [ ] First-try success rate
- [ ] Manual interventions required (should be 0)
- [ ] Remaining issues (if any)
- [ ] Recommendations for P1/P2

---

## Conclusion

### Summary

The remotion-best-practices skill has **excellent structure and API coverage** but **critical gaps in integration patterns** that caused 100% failure rate in real-world testing.

**What's great:**
- ✅ Perfect SKILL.md structure
- ✅ Excellent description with strong triggers
- ✅ Comprehensive Remotion API coverage
- ✅ Good code examples and organization

**What's broken:**
- ❌ tailwind.md is inadequate (56 words, says "fetch docs yourself")
- ❌ Missing common mistakes documentation
- ❌ Missing troubleshooting guidance
- ❌ Missing configuration best practices
- ❌ Agents generate broken code as a result

### Path Forward

**Immediate (3-4 hours):**
Apply P0 fixes to make skill actually functional:
1. Rewrite tailwind.md with complete integration guide
2. Create common-mistakes.md
3. Create troubleshooting.md

**Result:** Agents can generate working code on first try

**Short-term (2-3 hours):**
Apply P1 enhancements for reliability:
4. Add configuration-best-practices.md
5. Create examples/ directory with working templates

**Result:** Professional-quality skill with complete coverage

**Long-term (4-5 hours):**
Apply P2 enhancements for excellence:
6. Add references/ for deep-dive docs
7. Enhance existing rules
8. Add automated testing

**Result:** Best-in-class skill for Remotion development

### Recommendation

**DO NOT release remotion-max v1.0 until P0 fixes are applied and validated.**

The current skill will cause agents to generate broken code 100% of the time when using Tailwind. This damages user trust and plugin reputation.

**Minimum bar for release:** All P0 fixes applied + 1 successful real-world test with 0 manual interventions.

**Ideal bar for release:** P0 + P1 fixes applied + 3 successful real-world tests.

---

**Review completed:** 2026-02-04
**Reviewer:** plugin-dev:skill-reviewer
**Status:** Major revision required before release
**Next action:** Apply P0 fixes and re-test
