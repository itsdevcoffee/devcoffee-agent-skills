# Remotion Max - Agent Creator Report

**Date:** 2026-02-04
**Agent:** plugin-dev:agent-creator
**Plugin:** remotion-max v1.0.0

---

## Executive Summary

**Status:** Needs Improvement ⚠️

The remotion-max plugin has two well-intentioned agents, but they suffer from critical issues that will prevent reliable automatic triggering and effective code generation. The system prompts are too brief for the complexity of Remotion code generation, and trigger descriptions lack required example blocks.

**Current Agents:**
- remotion-builder (component generation)
- remotion-setup (project initialization)

**Recommended Actions:**
1. Add `<example>` blocks to both agent descriptions (CRITICAL)
2. Expand remotion-builder system prompt from ~600 to 1500-2000 words
3. Add automated verification to remotion-setup
4. Create remotion-debugger agent (high value addition)

---

## Critical Issues

### 1. No Trigger Examples in Agent Descriptions

**Impact:** CRITICAL - Agents won't activate reliably

Both agents lack `<example>` blocks in their descriptions, which are essential for Claude Code's agent discovery system.

**Current remotion-builder.md:**
```yaml
description: Use this agent when the user wants to create Remotion video components, animations, or compositions following best practices. Trigger when user says "create a Remotion component", "build a video animation", "generate Remotion code", or when they're working on Remotion projects and need component scaffolding. This agent uses the remotion-best-practices skill to ensure generated code follows established patterns.
```

**Should be:**
```yaml
description: Use this agent when the user wants to create Remotion video components, animations, or compositions following best practices. Trigger when user says <example>create a Remotion component</example>, <example>build a video animation</example>, <example>generate Remotion code</example>, <example>make a text reveal animation</example>, or when they're working on Remotion projects and need component scaffolding. This agent uses the remotion-best-practices skill to ensure generated code follows established patterns.
```

**Fix for both agents:** Wrap 3-4 concrete user phrases in `<example>` tags.

---

### 2. System Prompts Too Brief for Code Generation

**remotion-builder.md: ~600 words**

**Issue:** For complex code generation tasks, agents need 1500-2000 words of detailed guidance. The current prompt has good structure but lacks:

1. **Detailed code generation patterns** (only generic instructions)
2. **Common code templates** (no boilerplate examples)
3. **Error handling patterns** (missing entirely)
4. **Type definition guidance** (minimal)
5. **Testing instructions** (not mentioned)
6. **Code review checklist** (absent)

**Current structure (good):**
- Capabilities ✓
- Key Principles ✓
- When Building Components ✓
- Common Tasks ✓
- Tools Available ✓
- Example Workflow ✓

**Missing sections:**
- Code templates for common patterns
- TypeScript type definitions
- Import statement patterns
- Error handling
- Performance optimization
- Testing guidance
- Code review checklist

**Recommended expansion:**

```markdown
## Code Generation Patterns

### Component Structure Template
```typescript
import {useCurrentFrame, interpolate, AbsoluteFill} from 'remotion';

export const ComponentName: React.FC<{
  duration: number;
  // Add props
}> = ({duration}) => {
  const frame = useCurrentFrame();

  // Animation calculations
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity}}>
      {/* Content */}
    </AbsoluteFill>
  );
};
```

### Type Definitions
Always include proper TypeScript types:
- Props interface
- Return types
- Generic constraints for reusable components

### Import Patterns
```typescript
// Core Remotion
import {useCurrentFrame, interpolate, spring, Sequence} from 'remotion';

// Components
import {AbsoluteFill, Img, Video, Audio} from 'remotion';

// Utilities (if using)
import {staticFile} from 'remotion';
```

### Error Handling
- Validate props in development: `if (!duration) throw new Error(...)`
- Clamp extrapolation to prevent runtime errors
- Handle missing assets gracefully

### Performance
- Memoize expensive calculations with useMemo
- Use React.memo for child components that don't change
- Avoid creating functions inside render

### Code Review Checklist
Before returning code, verify:
- [ ] Uses useCurrentFrame for all animations
- [ ] Proper TypeScript typing
- [ ] Imports from 'remotion' not 'react'
- [ ] Extrapolation is clamped
- [ ] No CSS animations (use interpolate/spring instead)
- [ ] Props are documented
- [ ] Component is exported
```

---

## Major Gaps

### 3. Missing remotion-debugger Agent

**Impact:** HIGH - No help for troubleshooting

Users will encounter errors and need debugging assistance. Currently, no agent exists to:
- Diagnose common Remotion errors
- Explain error messages
- Suggest fixes
- Validate compositions

**Recommended agent:**

```markdown
---
name: remotion-debugger
description: Use this agent when the user encounters errors, bugs, or issues with Remotion projects. Trigger when user says <example>Remotion error</example>, <example>debug my Remotion code</example>, <example>why isn't this animating</example>, <example>Remotion not rendering</example>, or mentions specific error messages from Remotion.
model: sonnet
color: red
---

# Remotion Debugger Agent

You are a Remotion debugging expert. Help users diagnose and fix issues in their Remotion projects.

## Common Issues

### Animation Not Working
- Check: Is useCurrentFrame being called?
- Check: Is interpolate configured correctly?
- Check: Are frame numbers correct?

### Component Not Rendering
- Check: Is component registered in Root.tsx?
- Check: Are imports correct?
- Check: Is composition ID unique?

### Performance Issues
- Check: Are there unnecessary re-renders?
- Check: Is memoization being used?
- Check: Are assets optimized?

[Continue with detailed debugging patterns...]
```

---

### 4. No Verification Automation in remotion-setup

**remotion-setup.md system prompt: 195 lines**

**Issue:** The setup agent has detailed instructions but doesn't automate verification steps.

**Current workflow:**
1. Install dependencies ✓
2. Create files ✓
3. Configure settings ✓
4. Tell user to run `npm start` ✗ (manual step)

**Should be:**
1. Install dependencies
2. Create files
3. Configure settings
4. **Automatically verify:**
   - Run `npm start` in background
   - Check for errors
   - Validate Studio opens
   - Confirm composition appears
5. Report success/issues

**Recommended addition:**

```markdown
## Automated Verification

After setup completes:

1. **Start Remotion Studio:**
   ```bash
   npm start &
   STUDIO_PID=$!
   sleep 5
   ```

2. **Check process:**
   ```bash
   if ps -p $STUDIO_PID > /dev/null; then
     echo "✓ Studio started successfully"
   else
     echo "✗ Studio failed to start"
     # Show error logs
   fi
   ```

3. **Verify composition:**
   - Check Root.tsx has valid compositions
   - Validate composition IDs are unique
   - Confirm default props are valid

4. **Stop studio:**
   ```bash
   kill $STUDIO_PID
   ```

5. **Report results:**
   - Success: "Setup complete! Run 'npm start' to begin."
   - Failure: "Setup incomplete. Issues found: [list]"
```

---

### 5. Weak Agent Boundaries

**Issue:** No clear handoff patterns between agents

**Scenarios that need handoffs:**
1. User sets up project (remotion-setup) → wants to create component (remotion-builder)
2. User creates component (remotion-builder) → encounters error (needs debugger)
3. User needs optimization → no agent for this

**Current:** Agents work in isolation, user must manually invoke next agent

**Should be:** Agents suggest next steps

**Recommended addition to all agents:**

```markdown
## When to Hand Off

### If you've completed your task successfully:
"Setup is complete! You can now:
- Create components with: 'create a Remotion component'
- Or ask me any questions about your project"

### If you encounter an issue:
"I've encountered [issue]. Let's get help debugging this."
[Automatically suggest using remotion-debugger]

### If user needs different capability:
"That's outside my expertise. You might want to:
- For component generation: Use remotion-builder
- For debugging: Mention the error to get debugging help"
```

---

## Agent-by-Agent Analysis

### remotion-builder Agent

**Strengths:**
- ✅ Good structure
- ✅ Clear capabilities
- ✅ References the skill
- ✅ Provides workflow examples

**Issues:**
- ❌ Missing `<example>` tags in description (CRITICAL)
- ❌ System prompt too brief (~600 words vs needed 1500-2000)
- ❌ No code templates
- ❌ No error handling patterns
- ❌ No testing guidance
- ⚠️ Color "purple" is invalid (should be "magenta")

**Recommendations:**

1. **Fix description** (Priority 1):
   ```yaml
   description: Use this agent when the user wants to create Remotion video components, animations, or compositions following best practices. Trigger when user says <example>create a Remotion component</example>, <example>build a video animation</example>, <example>generate Remotion code</example>, <example>make a text reveal</example>, or when they're working on Remotion projects and need component scaffolding.
   ```

2. **Expand system prompt** (Priority 1):
   - Add code templates section (200 words)
   - Add type definitions guidance (150 words)
   - Add error handling patterns (150 words)
   - Add performance tips (150 words)
   - Add testing guidance (100 words)
   - Add code review checklist (100 words)
   - **Target:** 1500-2000 words total

3. **Fix color** (Priority 2):
   ```yaml
   color: magenta
   ```

4. **Change model** (Priority 3):
   ```yaml
   model: inherit  # Use user's default model
   ```

---

### remotion-setup Agent

**Strengths:**
- ✅ Comprehensive system prompt (195 lines)
- ✅ Detailed configuration examples
- ✅ Good troubleshooting section
- ✅ Clear directory structure
- ✅ Valid color (blue)

**Issues:**
- ❌ Missing `<example>` tags in description (CRITICAL)
- ⚠️ No automated verification
- ⚠️ Doesn't detect existing frameworks (Next.js, Vite, etc.)
- ⚠️ No handoff suggestions after setup

**Recommendations:**

1. **Fix description** (Priority 1):
   ```yaml
   description: Use this agent when the user wants to initialize a new Remotion project or set up Remotion in an existing project. Trigger when user says <example>set up Remotion</example>, <example>create a new Remotion project</example>, <example>initialize Remotion</example>, <example>add Remotion to my app</example>, or needs help with Remotion project configuration.
   ```

2. **Add automated verification** (Priority 1):
   - Run `npm start` in background
   - Check for errors
   - Validate Studio accessibility
   - Report results automatically

3. **Add framework detection** (Priority 2):
   ```markdown
   ## Framework Detection

   Before setup, check for:
   - package.json (existing React project)
   - next.config.js (Next.js)
   - vite.config.ts (Vite)
   - angular.json (Angular)

   Adjust setup instructions based on detected framework.
   ```

4. **Add handoff guidance** (Priority 2):
   ```markdown
   ## After Setup

   "Setup complete! Next steps:
   - Create your first component: 'create a Remotion text reveal'
   - Learn about animations: Ask about Remotion animation patterns
   - Need help? Mention any errors you encounter"
   ```

5. **Change model** (Priority 3):
   ```yaml
   model: inherit
   ```

---

## Missing Agents (Recommendations)

### 1. remotion-debugger (HIGH PRIORITY)

**Purpose:** Diagnose and fix Remotion issues

**Why needed:** Users will encounter errors and need help troubleshooting

**Capabilities:**
- Explain common Remotion error messages
- Diagnose animation issues
- Validate composition setup
- Check for common mistakes
- Suggest fixes

**When to trigger:**
- User mentions an error
- User says "not working" or "broken"
- User asks "why isn't this..."
- User shares error output

---

### 2. remotion-optimizer (MEDIUM PRIORITY)

**Purpose:** Optimize Remotion performance and bundle size

**Why needed:** Performance is critical for video rendering

**Capabilities:**
- Analyze component performance
- Suggest memoization strategies
- Optimize asset loading
- Reduce bundle size
- Improve render times

**When to trigger:**
- User mentions "slow" or "performance"
- User asks about optimization
- User complains about render times

---

### 3. remotion-compositor (MEDIUM PRIORITY)

**Purpose:** Create complex multi-scene compositions

**Why needed:** Builder is good for components, but compositions need orchestration

**Capabilities:**
- Design video structure (intro/main/outro)
- Set up scene transitions
- Coordinate timing across scenes
- Manage dynamic metadata
- Create composition templates

**When to trigger:**
- User wants "full video"
- User mentions "multiple scenes"
- User asks about "video structure"

---

### 4. remotion-asset-manager (LOW PRIORITY)

**Purpose:** Manage media assets (images, videos, audio, fonts)

**Why needed:** Asset management is complex in video projects

**Capabilities:**
- Organize asset directories
- Validate asset formats
- Suggest asset optimizations
- Generate asset type definitions
- Create asset indexes

**When to trigger:**
- User mentions "assets" or "media"
- User asks about images/videos/audio
- User has asset-related errors

---

### 5. remotion-tester (LOW PRIORITY)

**Purpose:** Generate and run tests for Remotion components

**Why needed:** Testing video components is challenging

**Capabilities:**
- Generate snapshot tests
- Create frame comparison tests
- Test animation timing
- Validate prop handling
- Run visual regression tests

**When to trigger:**
- User mentions "test" or "testing"
- User asks about "quality assurance"
- User wants to validate components

---

## Priority Recommendations

### Before v1.1 Release (MUST DO)

1. **Add `<example>` blocks** to both agent descriptions (30 minutes)
2. **Expand remotion-builder system prompt** to 1500-2000 words (2 hours)
3. **Add automated verification** to remotion-setup (1 hour)
4. **Fix invalid color** in remotion-builder (5 minutes)

### For v1.2 (SHOULD DO)

5. **Create remotion-debugger agent** (3 hours)
6. **Add framework detection** to remotion-setup (1 hour)
7. **Add agent handoff suggestions** (30 minutes)

### For v2.0 (NICE TO HAVE)

8. **Create remotion-optimizer agent** (4 hours)
9. **Create remotion-compositor agent** (4 hours)
10. **Create remotion-asset-manager agent** (3 hours)
11. **Create remotion-tester agent** (3 hours)

---

## Code Examples

### Enhanced remotion-builder Description

```yaml
---
name: remotion-builder
description: Use this agent when the user wants to create Remotion video components, animations, or compositions following best practices. Trigger when user says <example>create a Remotion component</example>, <example>build a video animation</example>, <example>generate Remotion code</example>, <example>make a text reveal</example>, <example>create an animation</example>, or when they're working on Remotion projects and need component scaffolding. This agent uses the remotion-best-practices skill to ensure generated code follows established patterns.
model: inherit
color: magenta
---
```

### Enhanced remotion-setup Description

```yaml
---
name: remotion-setup
description: Use this agent when the user wants to initialize a new Remotion project or set up Remotion in an existing project. Trigger when user says <example>set up Remotion</example>, <example>create a new Remotion project</example>, <example>initialize Remotion</example>, <example>add Remotion to my app</example>, <example>start a Remotion project</example>, or needs help with Remotion project configuration. This agent ensures proper project structure and dependency installation.
model: inherit
color: blue
---
```

---

## Conclusion

The remotion-max agents have solid foundations but need critical improvements before they can reliably serve users:

**Critical (Block release):**
- Missing `<example>` blocks prevent automatic triggering
- System prompts too brief for effective code generation

**High value additions:**
- remotion-debugger would fill a major gap
- Automated verification would improve setup reliability

**Future enhancements:**
- Additional specialized agents (optimizer, compositor, etc.)
- Better agent handoff patterns
- Framework-aware setup

**Estimated effort to address critical issues:** 4-5 hours

---

**Reviewed by:** plugin-dev:agent-creator agent
**Date:** 2026-02-04
