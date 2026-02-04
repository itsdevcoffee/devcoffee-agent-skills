# Remotion Max Plugin Assessment

**Date:** 2026-02-04
**Plugin:** remotion-max
**Version:** 1.0.0
**Components:** 2 agents, 2 commands, 1 skill (29 rules)

---

## Executive Summary

The remotion-max plugin provides a solid foundation for Remotion development with comprehensive best practices and two specialized agents. However, the agents lack proper trigger examples, have overly brief system prompts, and miss several key workflow automation opportunities.

**Overall Grade:** B- (Functional but needs improvement)

---

## Detailed Analysis

### 1. Agent: remotion-builder

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/agents/remotion-builder.md`

#### Frontmatter Analysis

```yaml
name: remotion-builder
description: Use this agent when the user wants to create Remotion video components...
model: sonnet
color: purple
```

**Issues:**
- ❌ **CRITICAL:** No `<example>` blocks in description (required for reliable triggering)
- ⚠️ Model set to `sonnet` instead of `inherit` (unnecessary override)
- ✅ Color choice (purple) appropriate for creative/transformation work
- ✅ Name follows conventions (lowercase, hyphens)

**Trigger Description Issues:**
- Lists trigger phrases but doesn't show context/examples
- Missing conversational triggering scenarios
- No examples showing WHY agent should trigger

#### System Prompt Analysis

**Length:** ~87 lines (~600 words) - **Too brief** for complex code generation

**Structure:**
- ✅ Clear role definition
- ✅ Capabilities listed
- ✅ Key principles outlined
- ⚠️ Workflow section present but shallow
- ❌ Missing error handling guidance
- ❌ Missing edge case handling
- ❌ Missing quality verification steps
- ❌ No detailed code generation patterns

**Content Gaps:**
1. **No specific code patterns** - References skill but doesn't provide generation templates
2. **Shallow implementation guidance** - "Generate component" without HOW
3. **Missing validation steps** - No self-checking for TypeScript errors, import correctness
4. **No file path conventions** - Where should components be created?
5. **Missing composition registration** - Briefly mentioned, not detailed
6. **No testing guidance** - How to verify generated code works
7. **Incomplete asset handling** - Doesn't explain staticFile() usage deeply

**Strengths:**
- Clear reference to remotion-best-practices skill
- Good example workflow at end
- Mentions common animation types

#### Recommendations

**HIGH PRIORITY:**
1. Add 3-4 `<example>` blocks to description showing different triggering scenarios
2. Expand system prompt to 1500-2000 words with:
   - Detailed code generation patterns
   - Step-by-step implementation workflow
   - Quality verification checklist
   - Error handling strategies
3. Add sections on:
   - File naming conventions
   - Directory structure decisions
   - Import statement patterns
   - Type definition patterns
   - Registration in Root.tsx

**MEDIUM PRIORITY:**
4. Change model to `inherit` unless there's a specific reason for sonnet
5. Add TypeScript error checking instructions
6. Include troubleshooting common issues section

**Enhanced Description Example:**
```markdown
description: |
  Use this agent when the user wants to create Remotion video components, animations,
  or compositions following best practices. Examples:

  <example>
  Context: User is working on a Remotion project and needs a text animation
  user: "Create a text reveal animation that fades in word by word"
  assistant: "I'll use the remotion-builder agent to generate a text reveal component following best practices."
  <commentary>
  The user explicitly requests creating a Remotion component with specific animation requirements.
  This is a clear code generation task that requires knowledge of Remotion APIs and patterns.
  </commentary>
  </example>

  <example>
  Context: User is discussing video composition structure
  user: "I need an intro sequence with a logo that scales up and fades in over 3 seconds"
  assistant: "I'll use the remotion-builder agent to create this intro composition."
  <commentary>
  The user describes a specific animation sequence for a Remotion project. This requires
  generating proper component code with timing, spring animations, and composition setup.
  </commentary>
  </example>

  <example>
  Context: User is building a video with synchronized audio
  user: "How would I make a video component that shows captions synchronized with audio?"
  assistant: "I'll use the remotion-builder agent to create this audio-synchronized caption component."
  <commentary>
  While phrased as a question, this requires generating actual code that demonstrates
  the implementation pattern. The agent can reference best practices and create working code.
  </commentary>
  </example>
```

---

### 2. Agent: remotion-setup

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/agents/remotion-setup.md`

#### Frontmatter Analysis

```yaml
name: remotion-setup
description: Use this agent when the user wants to initialize a new Remotion project...
model: sonnet
color: blue
```

**Issues:**
- ❌ **CRITICAL:** No `<example>` blocks in description
- ⚠️ Model set to `sonnet` instead of `inherit`
- ✅ Color choice (blue) appropriate for setup/configuration
- ✅ Name follows conventions

#### System Prompt Analysis

**Length:** ~195 lines (~1400 words) - **Better but still needs expansion**

**Structure:**
- ✅ Clear role definition
- ✅ Detailed setup processes
- ✅ Good configuration examples
- ✅ Project structure visualization
- ✅ Troubleshooting section
- ⚠️ Missing verification automation
- ⚠️ Missing environment detection logic

**Content Gaps:**
1. **No automated verification** - Lists checks but doesn't say HOW to automate
2. **Missing detection logic** - How to detect existing project types (Next.js, Vite, CRA)
3. **No rollback strategy** - What if setup fails mid-way?
4. **Incomplete package version handling** - Should specify compatible versions?
5. **Missing git integration** - Should offer to commit initial setup?
6. **No template selection** - Different starter templates for different use cases

**Strengths:**
- Comprehensive configuration examples
- Good separation of new vs existing project workflows
- Clear package explanations
- Troubleshooting section

#### Recommendations

**HIGH PRIORITY:**
1. Add 3-4 `<example>` blocks showing different setup scenarios
2. Add automated verification section with actual bash commands
3. Include project type detection logic
4. Add rollback/cleanup procedures

**MEDIUM PRIORITY:**
5. Change model to `inherit`
6. Add template selection logic
7. Include git workflow integration
8. Add compatibility matrix for package versions

**Enhanced Description Example:**
```markdown
description: |
  Use this agent when the user wants to initialize a new Remotion project or
  set up Remotion in an existing project. Examples:

  <example>
  Context: User wants to start a new video project
  user: "I want to create a new Remotion project for making social media videos"
  assistant: "I'll use the remotion-setup agent to initialize a new Remotion project."
  <commentary>
  User explicitly wants to create a new Remotion project. This requires running initialization
  commands, setting up configuration files, and creating project structure.
  </commentary>
  </example>

  <example>
  Context: User has an existing React app
  user: "Can you add Remotion to my existing Next.js project?"
  assistant: "I'll use the remotion-setup agent to integrate Remotion into your Next.js project."
  <commentary>
  User needs to add Remotion to an existing project. This requires detecting the project type,
  installing appropriate packages, and configuring without breaking existing setup.
  </commentary>
  </example>

  <example>
  Context: User mentions setup issues
  user: "My Remotion studio won't start, something about port conflicts"
  assistant: "I'll use the remotion-setup agent to diagnose and fix your Remotion configuration."
  <commentary>
  User has configuration issues. The setup agent can verify installation, check configs,
  and fix common problems like port conflicts.
  </commentary>
  </example>
```

---

## 3. Skill: remotion-best-practices

**Location:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/`

#### Structure Analysis

**Coverage:** 29 rule files covering comprehensive Remotion topics

**Quality:** ✅ Excellent
- Clear, concise rules
- Code examples in every file
- Proper metadata
- Good organization

**Sample Rules Reviewed:**
- `animations.md` - Clear, prescriptive, with code examples
- `timing.md` - Comprehensive coverage of interpolation and spring animations

**Strengths:**
- Comprehensive domain coverage
- Practical code examples
- Clear do's and don'ts (e.g., "CSS transitions FORBIDDEN")
- Well-organized by topic

**No Major Issues Found**

---

## 4. Commands Analysis

### Command: builder

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/commands/builder.md`

**Quality:** Good documentation
- Clear usage examples
- Component type list
- Configuration options explained
- Integration notes

**Minor Issues:**
- Could specify which agent it triggers
- Could add output examples

### Command: setup

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/commands/setup.md`

**Quality:** Excellent documentation
- Very detailed usage
- Clear workflow explanation
- Good examples
- Troubleshooting included

**Minor Issues:**
- Could add time estimates
- Could add screenshot references

---

## Missing Agents & Functionality

### Recommended Additional Agents

#### 1. **remotion-debugger** (HIGH PRIORITY)
**Purpose:** Troubleshoot rendering issues, performance problems, and configuration errors

**Triggers:**
- "My Remotion video won't render"
- "Remotion studio is slow/crashing"
- "Getting errors in Remotion"
- "Video output is wrong"

**Capabilities:**
- Analyze error logs
- Check common configuration issues
- Verify asset paths
- Test composition rendering
- Profile performance bottlenecks
- Suggest fixes

**Color:** Yellow (caution/validation)

---

#### 2. **remotion-optimizer** (MEDIUM PRIORITY)
**Purpose:** Analyze and improve Remotion component performance

**Triggers:**
- "My Remotion video is rendering slowly"
- "Optimize this Remotion component"
- "Remotion preview is laggy"
- "Improve rendering performance"

**Capabilities:**
- Identify expensive operations
- Suggest memoization opportunities
- Recommend asset optimization
- Analyze re-render patterns
- Check bundle size
- Suggest parallel rendering strategies

**Color:** Green (improvement/generation)

---

#### 3. **remotion-compositor** (MEDIUM PRIORITY)
**Purpose:** Build complex multi-scene compositions with proper sequencing

**Triggers:**
- "Create a video composition with multiple scenes"
- "Build a full video structure"
- "Sequence these Remotion components"
- "Create intro/main/outro flow"

**Capabilities:**
- Design scene structure
- Calculate timing between sequences
- Create transition components
- Generate composition registration
- Handle dynamic metadata
- Create scene templates

**Color:** Magenta (creative/transformation)

---

#### 4. **remotion-asset-manager** (LOW PRIORITY)
**Purpose:** Organize, optimize, and manage media assets

**Triggers:**
- "Organize my Remotion assets"
- "Optimize videos for Remotion"
- "Manage my video assets"
- "Import media files into Remotion"

**Capabilities:**
- Organize asset directory structure
- Optimize video/image formats
- Generate asset manifests
- Create import helpers
- Suggest compression strategies
- Validate asset references

**Color:** Blue (organization/setup)

---

#### 5. **remotion-tester** (LOW PRIORITY)
**Purpose:** Create and run tests for Remotion components

**Triggers:**
- "Test my Remotion component"
- "Create tests for video composition"
- "Verify Remotion rendering"
- "Snapshot test this composition"

**Capabilities:**
- Generate component tests
- Create snapshot tests
- Verify timing calculations
- Test rendering output
- Check prop validation
- Integration testing patterns

**Color:** Cyan (analysis/testing)

---

## Interaction Patterns

### Current Patterns

**1. Direct Invocation:**
```
user: "Create a text reveal animation in Remotion"
→ remotion-builder triggers
```

**2. Command-based:**
```
user: "/remotion-max:builder text-reveal"
→ Command document loaded → triggers remotion-builder
```

**Issues with Current Patterns:**
- No examples in agent descriptions = unreliable triggering
- No explicit agent-to-agent handoffs
- No workflow chaining (setup → build → test)

### Recommended Patterns

**1. Multi-Agent Workflow:**
```
setup-project → build-components → test-rendering → optimize
```

Each agent should be able to suggest next agent:
> "Setup complete. Use remotion-builder to create your first component."

**2. Troubleshooting Chain:**
```
user encounters error → remotion-debugger analyzes → suggests remotion-builder or remotion-optimizer
```

**3. Proactive Triggering:**
Agents should recognize context and suggest appropriate next steps:
```
remotion-builder finishes component
→ "Would you like me to test this with remotion-tester?"
```

---

## Tool Usage

### Current Tool Access
Both agents appear to have access to all tools (not restricted in frontmatter).

**Appropriate Tools:**
- ✅ Read - Check existing code
- ✅ Write - Create new files
- ✅ Edit - Modify configs
- ✅ Bash - Run npm commands
- ✅ Glob/Grep - Search codebase

**Potential Issues:**
- No explicit tool strategy in prompts
- No guidance on when to use which tool
- Missing validation steps after tool usage

### Recommendations

**For remotion-builder:**
```yaml
tools: ["Read", "Write", "Edit", "Grep", "Glob", "Bash"]
```

System prompt should include:
1. Always Read existing project structure first
2. Use Grep to check for existing similar components
3. Write new components with proper naming
4. Edit Root.tsx to register compositions
5. Use Bash to verify TypeScript compilation

**For remotion-setup:**
```yaml
tools: ["Read", "Write", "Edit", "Bash"]
```

System prompt should include:
1. Use Bash to check environment (node --version)
2. Read existing package.json if present
3. Write configuration files
4. Use Bash to install packages
5. Verify with Bash commands (npm start)

---

## Scope and Responsibilities

### remotion-builder

**Current Scope:** Component generation

**Issues:**
- Scope slightly too broad (tries to handle setup questions too)
- Overlaps with potential remotion-compositor
- Doesn't clearly define boundaries

**Recommended Scope:**
- **Focus:** Generate individual Remotion components (animations, effects, utilities)
- **Boundaries:**
  - Does NOT handle project setup (→ remotion-setup)
  - Does NOT handle full compositions (→ remotion-compositor)
  - Does NOT debug (→ remotion-debugger)
  - Does NOT optimize (→ remotion-optimizer)

### remotion-setup

**Current Scope:** Project initialization and configuration

**Issues:**
- Slight overlap with troubleshooting (should → remotion-debugger)
- Doesn't define ongoing configuration vs initial setup

**Recommended Scope:**
- **Focus:** Initial project setup and major configuration changes
- **Boundaries:**
  - Does NOT build components (→ remotion-builder)
  - Does NOT debug runtime issues (→ remotion-debugger)
  - Does NOT optimize (→ remotion-optimizer)
  - DOES handle adding new packages/tools

---

## Priority Improvements

### Immediate (Before v1.1)

1. **Add trigger examples to both agents** (CRITICAL)
   - remotion-builder: 3-4 examples
   - remotion-setup: 3-4 examples

2. **Expand remotion-builder system prompt** (HIGH)
   - Target: 1500-2000 words
   - Add detailed code generation patterns
   - Add quality verification steps
   - Add error handling guidance

3. **Change model to inherit** (MEDIUM)
   - Both agents currently override to sonnet
   - Should use inherit unless specific reason

4. **Add verification automation** (HIGH)
   - remotion-setup should automate checks
   - Add bash commands for verification
   - Add rollback procedures

### Short Term (v1.2)

5. **Create remotion-debugger agent** (HIGH)
   - Highest value addition
   - Covers common user pain point

6. **Improve agent handoff patterns** (MEDIUM)
   - Agents suggest next steps
   - Clear workflow chaining

7. **Add project type detection** (MEDIUM)
   - remotion-setup detects Next.js, Vite, etc.
   - Adjusts setup accordingly

### Long Term (v2.0)

8. **Add remotion-optimizer agent** (MEDIUM)
9. **Add remotion-compositor agent** (MEDIUM)
10. **Create agent testing framework** (LOW)
11. **Add remotion-asset-manager agent** (LOW)
12. **Add remotion-tester agent** (LOW)

---

## Specific Code Improvements

### remotion-builder.md

**Current:**
```yaml
name: remotion-builder
description: Use this agent when the user wants to create Remotion video components, animations, or compositions following best practices. Trigger when user says "create a Remotion component", "build a video animation", "generate Remotion code", or when they're working on Remotion projects and need component scaffolding. This agent uses the remotion-best-practices skill to ensure generated code follows established patterns.
model: sonnet
color: purple
```

**Improved:**
```yaml
name: remotion-builder
description: |
  Use this agent when the user wants to create Remotion video components, animations,
  or compositions following best practices. Examples:

  <example>
  Context: User is working on a Remotion project and needs a specific animation
  user: "Create a text reveal animation that fades in word by word"
  assistant: "I'll use the remotion-builder agent to generate this text animation following best practices."
  <commentary>
  The user explicitly requests creating a Remotion component. This requires generating
  TypeScript code with proper Remotion APIs, timing logic, and type safety.
  </commentary>
  </example>

  <example>
  Context: User is discussing video composition
  user: "I need an intro with a logo that scales up over 3 seconds"
  assistant: "I'll use the remotion-builder agent to create this intro composition."
  <commentary>
  The user describes a specific animation sequence. This requires generating a component
  with spring/interpolate animations, proper timing calculations, and registration code.
  </commentary>
  </example>

  <example>
  Context: User asks about implementation patterns
  user: "How would I implement audio-synchronized captions in Remotion?"
  assistant: "I'll use the remotion-builder agent to create a working example component."
  <commentary>
  While phrased as a question, this requires generating actual code demonstrating
  the pattern. The builder agent can reference best practices and create working code.
  </commentary>
  </example>

  <example>
  Context: User is building a video project
  user: "Add a fade transition between these two scenes"
  assistant: "I'll use the remotion-builder agent to create the transition component."
  <commentary>
  User needs a specific component generated. This is a code generation task that
  requires understanding Remotion transitions and sequencing patterns.
  </commentary>
  </example>
model: inherit
color: purple
```

**System Prompt Additions:**

```markdown
## Code Generation Process

Follow this process for every component:

1. **Analyze Requirements**
   - Duration needed?
   - FPS (default: 30)
   - Dimensions (default: 1920x1080)
   - Props/inputs needed?
   - Assets required?

2. **Check Existing Code**
   - Read project structure
   - Check for similar components (Grep)
   - Review Root.tsx registration pattern
   - Identify existing utilities

3. **Select Best Practices**
   - Read relevant rule from skill: `rules/{topic}.md`
   - Choose appropriate animation approach (spring vs interpolate)
   - Determine proper hooks (useCurrentFrame, useVideoConfig, etc.)
   - Plan timing and sequencing

4. **Generate Component Code**

   **File Structure:**
   ```typescript
   // Imports (correct packages)
   import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
   import type {FC} from 'react';

   // Props interface (always define)
   interface MyComponentProps {
     // Props with JSDoc comments
     /** The text to display */
     text: string;
     /** Duration in seconds */
     durationInSeconds?: number;
   }

   // Component (export named)
   export const MyComponent: FC<MyComponentProps> = ({
     text,
     durationInSeconds = 2,
   }) => {
     // Hooks at top
     const frame = useCurrentFrame();
     const {fps} = useVideoConfig();

     // Calculations
     const durationInFrames = durationInSeconds * fps;

     // Animations
     const opacity = spring({
       frame,
       fps,
       config: {damping: 200},
     });

     // Render
     return (
       <div style={{opacity}}>
         {text}
       </div>
     );
   };
   ```

   **Mandatory Patterns:**
   - ✅ Use TypeScript with proper types
   - ✅ Define props interface with JSDoc
   - ✅ Use useCurrentFrame() for all animations
   - ✅ Get fps from useVideoConfig()
   - ✅ Think in seconds, convert to frames
   - ✅ Use spring() for natural motion
   - ✅ Use interpolate() with proper extrapolation
   - ✅ Export named components (not default)
   - ✅ Add inline comments for timing logic

5. **Determine File Location**

   **Directory Structure:**
   ```
   src/
   ├── compositions/       # Full compositions (scenes)
   ├── components/        # Reusable components
   │   ├── animations/   # Animation components
   │   ├── effects/      # Effect components
   │   └── ui/          # UI components
   └── utils/           # Helper functions
   ```

   **Naming Convention:**
   - PascalCase for component name
   - Descriptive: `TextRevealAnimation.tsx`, not `Text.tsx`
   - Match component name to filename

6. **Create File**
   - Use Write tool with correct path
   - Include all necessary imports
   - Add file header comment with description
   - Include usage example in comment

7. **Generate Registration Code**

   Provide code for Root.tsx:
   ```typescript
   import {MyComponent} from './components/MyComponent';

   <Composition
     id="MyComponent"
     component={MyComponent}
     durationInFrames={150}
     fps={30}
     width={1920}
     height={1080}
     defaultProps={{
       text: "Hello World",
     }}
   />
   ```

8. **Verify Code Quality**
   - Check all imports are correct
   - Verify no TypeScript errors (types match)
   - Ensure proper hook usage
   - Confirm timing math is correct
   - Check for performance issues (no re-renders)

9. **Provide Usage Documentation**

   Include:
   - How to use the component
   - Prop descriptions and examples
   - Timing considerations
   - Example compositions
   - Customization suggestions

## Common Component Patterns

### Fade In/Out
```typescript
const fadeIn = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});

const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
  extrapolateLeft: 'clamp',
});

const opacity = Math.min(fadeIn, fadeOut);
```

### Spring Animation with Delay
```typescript
const entrance = spring({
  frame: frame - delay,
  fps,
  config: {damping: 200},
});
```

### Rotation
```typescript
const rotation = interpolate(
  progress, // 0 to 1
  [0, 1],
  [0, 360]
);
<div style={{transform: `rotate(${rotation}deg)`}} />
```

### Scale Animation
```typescript
const scale = spring({
  frame,
  fps,
  config: {damping: 200},
});
<div style={{transform: `scale(${scale})`}} />
```

## Asset Handling

Always use `staticFile()` for assets:

```typescript
import {staticFile, Audio, Video, Img} from 'remotion';

// Images
<Img src={staticFile('logo.png')} />

// Videos
<Video src={staticFile('videos/intro.mp4')} />

// Audio
<Audio src={staticFile('audio/music.mp3')} />
```

## Error Handling

### Common Errors

**"Cannot read property 'fps' of undefined"**
- Missing useVideoConfig()
- Component not rendered in Remotion context

**"Maximum update depth exceeded"**
- useCurrentFrame() called conditionally
- State updates in render

**"Failed to load asset"**
- Wrong path (use staticFile())
- Asset not in public folder
- Wrong file extension

### Prevention

- Always use hooks at top level
- Never call hooks conditionally
- Use staticFile() for all assets
- Verify types with TypeScript

## Quality Checklist

Before finishing, verify:

- [ ] TypeScript compiles without errors
- [ ] All imports are correct
- [ ] Props interface is properly defined
- [ ] useCurrentFrame() is used correctly
- [ ] Timing calculations are in frames
- [ ] Animations use spring() or interpolate()
- [ ] No CSS animations/transitions
- [ ] Component is exported (named export)
- [ ] File location is appropriate
- [ ] Registration code provided
- [ ] Usage documentation included
- [ ] Assets use staticFile()
- [ ] No performance red flags

## When to Reference Skill Rules

Always read the relevant skill rule file BEFORE generating:

- Animations → `rules/animations.md`, `rules/timing.md`
- Text → `rules/text-animations.md`, `rules/measuring-text.md`
- Video → `rules/videos.md`, `rules/trimming.md`
- Audio → `rules/audio.md`, `rules/get-audio-duration.md`
- Transitions → `rules/transitions.md`
- Sequencing → `rules/sequencing.md`
- Assets → `rules/assets.md`
- Captions → `rules/display-captions.md`, `rules/import-srt-captions.md`
- 3D → `rules/3d.md`
- Tailwind → `rules/tailwind.md`

## Agent Boundaries

**This agent handles:**
✅ Generating individual components
✅ Creating animation effects
✅ Building UI elements for videos
✅ Creating utility functions
✅ Providing usage examples

**Hand off to other agents:**
❌ Project setup → use `remotion-setup` agent
❌ Debugging errors → use `remotion-debugger` agent (when available)
❌ Performance optimization → use `remotion-optimizer` agent (when available)
❌ Full composition structure → suggest `remotion-compositor` agent (when available)

After completing your task, suggest relevant next steps to the user.
```

---

### remotion-setup.md

**System Prompt Additions:**

```markdown
## Environment Detection

Before setup, detect the environment:

1. **Check for existing package.json**
   ```bash
   test -f package.json && cat package.json
   ```

2. **Detect project type**
   - Next.js: Check for `next` in dependencies
   - Vite: Check for `vite` in devDependencies
   - Create React App: Check for `react-scripts`
   - Vanilla React: Has `react` but no framework

3. **Check Node version**
   ```bash
   node --version
   ```
   Required: Node 18+

4. **Check package manager**
   - npm: `npm --version`
   - yarn: `yarn --version`
   - pnpm: `pnpm --version`
   Use detected package manager or default to npm

## Setup Verification Automation

After setup, run automated verification:

```bash
# 1. Check dependencies installed
npm list remotion @remotion/cli

# 2. Verify TypeScript compiles
npx tsc --noEmit

# 3. Test studio starts
timeout 10s npm start || echo "Studio start verification"

# 4. Check composition registration
grep -r "Composition" src/Root.tsx

# 5. Verify remotion.config.ts exists
test -f remotion.config.ts && echo "Config present"
```

Report results to user with ✅/❌ for each check.

## Rollback Procedures

If setup fails mid-process:

1. **Backup created files**
   ```bash
   mkdir -p .remotion-setup-backup
   cp package.json .remotion-setup-backup/ 2>/dev/null
   ```

2. **Restore on failure**
   ```bash
   cp .remotion-setup-backup/package.json . 2>/dev/null
   npm install
   ```

3. **Clean up partial installation**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

## Framework-Specific Setup

### Next.js Integration

```typescript
// Create src/remotion/Root.tsx (separate from Next.js)
// Update package.json with separate scripts
{
  "scripts": {
    "next:dev": "next dev",
    "next:build": "next build",
    "remotion:studio": "remotion studio src/remotion",
    "remotion:render": "remotion render"
  }
}
```

### Vite Integration

```typescript
// Update vite.config.ts
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Remotion requires ESM
  build: {
    target: 'es2020',
  },
});
```

## Package Version Strategy

Install specific compatible versions:

```json
{
  "remotion": "^4.0.0",
  "@remotion/cli": "^4.0.0",
  "@remotion/player": "^4.0.0"
}
```

Check for version mismatches after install.

## Agent Boundaries

**This agent handles:**
✅ Initial project creation
✅ Adding Remotion to existing projects
✅ Installing dependencies
✅ Creating configuration files
✅ Setting up directory structure
✅ Verifying installation

**Hand off to other agents:**
❌ Building components → use `remotion-builder` agent
❌ Fixing runtime errors → use `remotion-debugger` agent (when available)
❌ Performance issues → use `remotion-optimizer` agent (when available)

After completing setup, suggest: "Setup complete! Use the remotion-builder agent to create your first component."
```

---

## Summary of Recommendations

### Critical Issues (Block v1.1 release)
1. ❌ No trigger examples in agent descriptions
2. ❌ remotion-builder system prompt too brief

### High Priority (Should fix for v1.1)
3. ⚠️ Add verification automation to remotion-setup
4. ⚠️ Expand error handling guidance
5. ⚠️ Add quality verification checklists

### Medium Priority (v1.2)
6. Create remotion-debugger agent
7. Improve agent handoff patterns
8. Add framework detection to setup
9. Change models to inherit

### Low Priority (v2.0+)
10. Add remotion-optimizer agent
11. Add remotion-compositor agent
12. Add remotion-asset-manager agent
13. Add remotion-tester agent

---

## Conclusion

The remotion-max plugin has a solid foundation with excellent best practices documentation. The primary issues are:

1. **Missing trigger examples** preventing reliable agent activation
2. **Thin system prompts** lacking detailed implementation guidance
3. **Missing agents** for common workflows (debugging, optimization, composition)

With the recommended improvements, especially adding proper trigger examples and expanding the system prompts, this plugin can become a comprehensive Remotion development toolkit.

**Recommended Timeline:**
- Fix critical issues: 2-4 hours
- High priority improvements: 4-8 hours
- Add remotion-debugger: 3-5 hours
- Total to solid v1.1: ~12-15 hours of work

The skill is excellent and doesn't need changes. Focus on improving the agents to better leverage the skill's comprehensive knowledge.
