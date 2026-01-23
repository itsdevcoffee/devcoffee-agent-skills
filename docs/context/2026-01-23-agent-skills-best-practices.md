# Claude Code Agent Skills: Best Practices Guide

**Version:** 1.0.0
**Last Updated:** 2026-01-23
**Applies to:** Claude Code v2.0.12+

---

## Overview

Agent Skills are reusable instruction sets that extend Claude Code's capabilities for specific tasks. Unlike plugins (which add tools), skills provide domain expertise, workflows, and specialized knowledge that Claude activates on-demand.

**Key Characteristics:**
- ~100 tokens for metadata scan (lightweight activation check)
- <5,000 tokens when fully activated
- Stored as `SKILL.md` files in `.claude/skills/` directories

---

## Skill Structure

### Required: YAML Frontmatter

Every skill must begin with YAML frontmatter containing metadata:

```yaml
---
name: skill-name
description: Clear description of when to use this skill. Include trigger phrases and use cases.
---
```

### Optional Frontmatter Fields

```yaml
---
name: my-skill
version: 1.0.0
last_updated: 2026-01-23
description: Detailed description with trigger examples
# Domain-specific metadata
domain_version: "3.2.1"
msrv: "1.88.0"
sections:
  - Section One
  - Section Two
---
```

### Content Structure

After frontmatter, organize content in clear sections:

1. **Role/Persona** - Who Claude becomes when skill activates
2. **Core Responsibilities** - What the skill does
3. **Process/Workflow** - Step-by-step execution
4. **Rules/Constraints** - Boundaries and limitations
5. **Output Format** - Expected response structure
6. **Examples** - Before/after demonstrations
7. **Edge Cases** - Special handling instructions

---

## Best Practices

### 1. Write Clear Trigger Descriptions

The `description` field determines when Claude activates the skill. Be specific about:
- Trigger phrases users might say
- Use cases and scenarios
- What the skill is NOT for

**Good:**
```yaml
description: Use this skill when the user wants to transform AI-generated text into natural, Reddit-style human writing. Examples include "make this sound more human", "Reddit-ify this", "remove AI tells", "make it less corporate", or when the user wants text that sounds like an actual helpful person on Reddit wrote it.
```

**Bad:**
```yaml
description: Helps with writing.
```

### 2. Define a Clear Persona

Start with who Claude becomes:

```markdown
You are a Reddit writing authenticity expert who specializes in transforming corporate, AI-sounding text into natural, conversational Reddit-style writing that actual humans would post.

Your core expertise is in identifying and eliminating common AI writing patterns while preserving helpfulness and information quality.
```

### 3. Use Structured Workflows

Break complex tasks into numbered steps:

```markdown
## Transformation Process

### Step 1: Analyze the Input

First, determine what text to transform:
- If user provides specific text, use that
- If user references "my last response", use the most recent assistant response
- If unclear, ask what text they want transformed

### Step 2: Identify Patterns

Scan for these common patterns:
...

### Step 3: Apply Rules
...
```

### 4. Provide Concrete Rules with Examples

Don't just describe—demonstrate:

```markdown
**Rule 1: Replace Em Dashes**

- Change to commas, periods, parentheses, or colons
- Before: "This is important—really important"
- After: "This is important. Really important."

**Rule 2: Simplify Vocabulary**

- meticulous → careful
- strategically → planned out
- leverage → use
- utilize → use
```

### 5. Include Tables for Quick Reference

Tables are scannable and efficient:

```markdown
| Filter | Matches |
|--------|---------|
| `With<T>` | Has component T |
| `Without<T>` | Lacks component T |
| `Changed<T>` | T modified this frame |
```

```markdown
| Operation | Code |
|-----------|------|
| Spawn | `commands.spawn((Component1, Component2))` |
| Despawn | `commands.entity(id).despawn()` |
```

### 6. Define Output Format Explicitly

Tell Claude exactly how to structure responses:

```markdown
## Output Format

Present your response in this structure:

### AI Tells Detected
List the main patterns you found:
- Em dashes: [count]
- Five-dollar words: [list examples]

### Transformed Version
[The complete rewritten text]

### Key Changes Made
Briefly explain 3-5 major changes:
- Changed X to Y because...

### Authenticity Score
- Before: [X/10]
- After: [Y/10]
```

### 7. Handle Edge Cases

Anticipate unusual situations:

```markdown
## Edge Cases

- If text is already pretty human, say so and suggest minor tweaks
- If text is impossible to save (pure marketing fluff), recommend starting over
- If user wants specific tone adjustments, adapt accordingly
```

### 8. Include Quality Checklists

Checklists ensure consistency:

```markdown
### Quality Check

Before presenting the final version, verify:
- [ ] No em dashes remain
- [ ] No five-dollar words (unless technically necessary)
- [ ] Corporate phrases removed
- [ ] Contractions used naturally
- [ ] Core information preserved
```

### 9. Provide Fallback Instructions

For technical skills, specify where to get more info:

```markdown
**For detailed API:** Use context7: "bevy 0.17.3 {topic}"
**For issues:** Use WebFetch: https://github.com/project/issues
**For best practices:** Use WebSearch: "library 0.17 {topic}"
```

### 10. Version Your Skills

Include version metadata for maintenance:

```yaml
---
name: bevy-v0-17-3-docs
version: 1.0.0
last_updated: 2025-12-11
bevy_version: 0.17.3
msrv: 1.88.0
---
```

---

## Skill Types & Templates

### Type 1: Transformation Skill

For converting input to output (writing, formatting, translation).

```markdown
---
name: transformer-skill
description: Transforms X into Y when user asks to "convert", "transform", or "make it more Z"
---

You are an expert at transforming [input type] into [output type].

## Core Responsibilities
1. Identify patterns in input
2. Apply transformation rules
3. Preserve essential meaning
4. Explain changes made

## Process

### Step 1: Analyze Input
[What to look for]

### Step 2: Apply Transformations
[Rules and mappings]

### Step 3: Quality Check
[Verification criteria]

## Output Format
[Structure of response]

## Examples
**Before:** [example input]
**After:** [example output]
```

### Type 2: Documentation/Reference Skill

For providing domain expertise and API knowledge.

```markdown
---
name: library-v1-2-3-docs
version: 1.0.0
library_version: 1.2.3
description: Quick reference for Library 1.2.3 with patterns, API, and troubleshooting
sections:
  - Core Concepts
  - Common Patterns
  - API Reference
  - Troubleshooting
---

# Library 1.2.3 Quick Reference

**Version:** 1.2.3 | **Docs:** https://docs.example.com

---

## 1. Core Concepts

### Concept Name
Brief explanation.

| Operation | Code |
|-----------|------|
| Do X | `library.doX()` |

**Example:**
```language
// Code example
```

## 2. Common Patterns

### Pattern Name
```language
// Pattern code
```

## 3. Troubleshooting

### Issue Name
**Cause:** Why it happens
**Fix:** How to resolve

## Quick Reference

| Thing | Syntax |
|-------|--------|
| A | `code` |
| B | `code` |

**For latest:** Use context7: "library 1.2.3 {topic}"
```

### Type 3: Workflow/Process Skill

For multi-step procedures with decision points.

```markdown
---
name: workflow-skill
description: Guides through [process] when user needs to [goal]
---

You guide users through [process] with expertise in [domain].

## Prerequisites
- Requirement 1
- Requirement 2

## Process

### Phase 1: [Name]
**Goal:** What this phase achieves
**Steps:**
1. Step one
2. Step two

**Decision Point:** If [condition], proceed to Phase 2. Otherwise, [alternative].

### Phase 2: [Name]
...

## Checkpoints
- [ ] Phase 1 complete
- [ ] Phase 2 complete

## Common Issues
| Issue | Solution |
|-------|----------|
| Problem | Fix |
```

---

## Anti-Patterns to Avoid

### 1. Vague Descriptions
```yaml
# Bad
description: Helps with code

# Good
description: Reviews Python code for security vulnerabilities, focusing on OWASP Top 10 issues. Activate when user asks for "security review", "vulnerability check", or "audit this code".
```

### 2. Missing Structure
```markdown
# Bad - Wall of text
Just do the thing and make it good. Consider various factors and output something useful.

# Good - Clear structure
## Process
### Step 1: Analyze
### Step 2: Transform
### Step 3: Validate
```

### 3. No Examples
```markdown
# Bad
Apply the transformation rules.

# Good
**Before:** "It is important to note that this approach—while robust—requires attention."
**After:** "This approach works well, but you gotta be careful with the details."
```

### 4. Overly Complex Skills
Keep skills focused. If a skill exceeds 2000 lines, consider splitting into multiple skills.

### 5. Missing Edge Cases
Always document what happens when:
- Input is invalid
- Input is already in desired state
- User wants modifications to the standard output

---

## File Organization

### Personal Skills (Global)
```
~/.claude/skills/
├── my-writing-skill.md
└── my-review-skill.md
```

### Project Skills (Repository)
```
.claude/skills/
├── project-conventions.md
└── domain-knowledge/
    └── SKILL.md
```

### Plugin Skills (Distributed)
```
my-plugin/
└── skills/
    ├── skill-one.md
    └── skill-two.md
```

---

## Testing Your Skills

### Manual Testing Checklist
1. Does the skill activate on expected trigger phrases?
2. Does it produce consistent output format?
3. Are edge cases handled?
4. Is the quality checklist satisfied?
5. Does it fail gracefully on bad input?

### Test Prompts
Create test prompts that cover:
- Happy path (normal use)
- Edge cases (unusual input)
- Boundary conditions (empty input, very long input)
- Ambiguous requests

---

## Example: Well-Written Transformation Skill

```markdown
---
name: le-redditor
description: Use this skill when the user wants to transform AI-generated text into natural, Reddit-style human writing. Examples include "make this sound more human", "Reddit-ify this", "remove AI tells", "make it less corporate", or when the user wants text that sounds like an actual helpful person on Reddit wrote it.
---

You are a Reddit writing authenticity expert who specializes in transforming corporate, AI-sounding text into natural, conversational Reddit-style writing.

## Core Responsibilities

1. **Identify AI Tells**: Detect common AI writing patterns
2. **Transform to Natural Writing**: Rewrite to sound human
3. **Preserve Core Value**: Keep useful information intact
4. **Match Reddit Culture**: Adapt tone appropriately
5. **Explain Changes**: Show what changed and why

## Transformation Process

### Step 1: Analyze the Input
- If user provides specific text, use that
- If user references "my last response", use recent assistant response
- If unclear, ask what text they want transformed

### Step 2: Identify AI Tells

**Major Offenders:**
- Em dashes (—) for emphasis
- Five-dollar words: meticulous, leverage, utilize, facilitate
- Lists of three items (triads)
- Corporate transitions: "Furthermore," "Moreover,"
- No contractions

### Step 3: Apply Transformation Rules

**Rule 1: Replace Em Dashes**
- Before: "This is important—really important"
- After: "This is important. Really important."

**Rule 2: Simplify Vocabulary**
- meticulous → careful
- leverage → use
- utilize → use

### Step 4: Quality Check

- [ ] No em dashes remain
- [ ] No five-dollar words
- [ ] Contractions used naturally
- [ ] Sounds like a helpful Redditor

## Output Format

### AI Tells Detected
- Em dashes: [count]
- Five-dollar words: [list]

### Transformed Version
[Rewritten text]

### Key Changes Made
- Changed X to Y because...

### Authenticity Score
- Before: [X/10]
- After: [Y/10]
```

---

## Example: Well-Written Documentation Skill

```markdown
---
name: bevy-v0-17-3-docs
version: 1.0.0
last_updated: 2025-12-11
description: Bevy 0.17.3 quick reference with ECS patterns, API reference, and migration notes
bevy_version: 0.17.3
msrv: 1.88.0
---

# Bevy 0.17.3 Quick Reference

**Version:** 0.17.3 | **MSRV:** Rust 1.88.0

---

## 1. Core ECS Concepts

### Entity
Unique ID for game objects. No data, just a handle.

| Operation | Code |
|-----------|------|
| Spawn | `commands.spawn((Component1, Component2))` |
| Despawn | `commands.entity(id).despawn()` |

**Example:**
```rust
commands.spawn((
    Player { health: 100.0 },
    Transform::default(),
));
```

## 2. Query Patterns

| Filter | Matches |
|--------|---------|
| `With<T>` | Has component T |
| `Without<T>` | Lacks component T |
| `Changed<T>` | T modified this frame |

## 3. Common Issues

### System Never Runs

| Cause | Fix |
|-------|-----|
| Wrong schedule | Use `Update` not `Startup` |
| Query matches nothing | Check filters, add logging |

**For detailed API:** Use context7: "bevy 0.17.3 {topic}"
```

---

## Resources

- [Official Skills Documentation](https://code.claude.com/docs/en/skills)
- [anthropics/skills](https://github.com/anthropics/skills) - Official examples
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Community collection
- [Claude Code Skills Hub](https://claudecodeplugins.io/) - Marketplace

---

**End of Best Practices Guide**
