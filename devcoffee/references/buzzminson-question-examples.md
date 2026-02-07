# Buzzminson Question Quality Examples

This file demonstrates proper question formatting using the AskUserQuestion tool with priority markers via the `header` field.

## Overview

Buzzminson uses the **AskUserQuestion tool** to present clarification questions with built-in priority markers. The `header` field displays as a visual chip/tag showing priority level.

## Good Question Format

### Example 1: Authentication System

```javascript
AskUserQuestion({
  questions: [
    {
      question: "Which authentication approach should we use? This affects all security decisions downstream.",
      header: "[CRITICAL]",
      options: [
        {
          label: "JWT with refresh tokens",
          description: "Industry standard, stateless, more scalable but harder to revoke"
        },
        {
          label: "Session-based",
          description: "Simpler implementation, requires server state, easier to revoke"
        },
        {
          label: "OAuth2 only",
          description: "External providers only, simpler but less control over auth flow"
        }
      ]
    },
    {
      question: "Where should user data be persisted? Affects performance, scaling, and data integrity.",
      header: "[IMPORTANT]",
      options: [
        {
          label: "PostgreSQL",
          description: "Relational database with ACID guarantees, best for complex queries"
        },
        {
          label: "MongoDB",
          description: "Flexible schema, faster reads, eventual consistency"
        },
        {
          label: "In-memory only",
          description: "Fastest, no persistence - testing/prototyping only"
        }
      ]
    },
    {
      question: "What password complexity rules should we enforce? (I'll use Moderate if skipped)",
      header: "[PREFERENCE]",
      options: [
        {
          label: "Strict",
          description: "Uppercase, lowercase, numbers, symbols, 12+ characters"
        },
        {
          label: "Moderate",
          description: "8+ characters with mixed case and numbers"
        },
        {
          label: "Minimal",
          description: "6+ characters, any characters allowed"
        }
      ]
    }
  ]
})
```

**What the user sees:**
- Each question appears with a visual priority chip: `[CRITICAL]`, `[IMPORTANT]`, `[PREFERENCE]`
- Options are clearly presented with descriptions
- User can select answers or skip

---

### Example 2: Notification System

```javascript
AskUserQuestion({
  questions: [
    {
      question: "What types of notifications should the system support? This determines the core architecture.",
      header: "[CRITICAL]",
      options: [
        {
          label: "Agent completion only",
          description: "Simple - notify when buzzminson/maximus finish"
        },
        {
          label: "All events",
          description: "Comprehensive - completion, errors, progress, milestones (most flexible, more work)"
        },
        {
          label: "Errors only",
          description: "Minimal - critical alerts when things break"
        }
      ]
    },
    {
      question: "Where should notifications be delivered?",
      header: "[IMPORTANT]",
      options: [
        {
          label: "Console only",
          description: "Simplest - text output in terminal, no dependencies"
        },
        {
          label: "Desktop notifications",
          description: "Better UX - OS-level notifications (requires platform integration)"
        },
        {
          label: "Both",
          description: "Most flexible - console + desktop (most work)"
        }
      ]
    },
    {
      question: "How should users configure notifications? (I'll use Both if skipped)",
      header: "[PREFERENCE]",
      options: [
        {
          label: "Config file only",
          description: "Persistent settings in .claude/notifications.json"
        },
        {
          label: "CLI flags only",
          description: "Runtime flags like --notify, --notify-on-error"
        },
        {
          label: "Both",
          description: "Config file for defaults, CLI flags for overrides"
        }
      ]
    }
  ]
})
```

---

### Example 3: API Integration

**[CRITICAL] 1. API Versioning Strategy**
How should we handle API versioning?
- **Context:** Affects backward compatibility and future flexibility
- **Options:**
  - a) URL versioning (/api/v1/users, /api/v2/users)
  - b) Header versioning (Accept: application/vnd.api+json; version=1)
  - c) No versioning (breaking changes in major releases only)
- **Trade-offs:** URL versioning is clearest but creates route duplication; header versioning is RESTful but harder to test

**[IMPORTANT] 2. Error Response Format**
What error format should the API return?
- **Options:**
  - a) RFC 7807 Problem Details (industry standard, verbose)
  - b) Simple {error, message} (minimal, easy to parse)
  - c) Custom format matching existing patterns in codebase
- **Trade-offs:** RFC 7807 provides most detail but adds complexity; simple format is easiest

**[PREFERENCE] 4. Rate Limiting**
Should we implement rate limiting?
- **Options:**
  - a) Yes, strict (100 requests/hour per user)
  - b) Yes, lenient (1000 requests/hour per user)
  - c) No, skip for now (add later if needed)
- **Note:** I'll use option c (skip) if not specified

---

## Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: Missing header field

```javascript
AskUserQuestion({
  questions: [
    {
      question: "Which authentication approach should we use?",
      // Missing header field!
      options: [...]
    }
  ]
})
```

**Problem:** No priority indicator - user doesn't know if this is critical or a preference

---

### ❌ Anti-Pattern 2: Vague question without context

```javascript
{
  question: "What authentication?",
  header: "[CRITICAL]",
  options: [
    { label: "JWT" },  // Missing description!
    { label: "Sessions" }
  ]
}
```

**Problems:**
- Question too vague
- No context about why it matters
- Missing option descriptions with trade-offs

---

### ❌ Anti-Pattern 3: Too Many Questions

```
[CRITICAL] 1. Authentication method?
[CRITICAL] 2. Password requirements?
[CRITICAL] 3. Session duration?
[CRITICAL] 4. Token expiration?
[IMPORTANT] 5. User roles?
[IMPORTANT] 6. Permission model?
[IMPORTANT] 7. Database choice?
[IMPORTANT] 8. Encryption method?
[PREFERENCE] 9. Logging level?
[PREFERENCE] 10. Error messages?
[PREFERENCE] 11. UI framework?
[PREFERENCE] 12. Color scheme?
[PREFERENCE] 13. Font choice?
[PREFERENCE] 14. Icon set?
[PREFERENCE] 15. Animation style?
```

**Problems:**
- Violates 5-7 question limit (15 questions!)
- Creates cognitive overload
- Many questions could be combined or skipped

---

### ❌ Anti-Pattern 4: No Context

**[IMPORTANT] Which database?**
- a) PostgreSQL
- b) MongoDB

**Problems:**
- No explanation of why this matters
- No trade-offs provided
- User can't make informed decision

---

### ❌ Anti-Pattern 5: All Same Priority

```
[CRITICAL] 1. Database choice?
[CRITICAL] 2. UI framework?
[CRITICAL] 3. Logging format?
[CRITICAL] 4. Comment style?
```

**Problem:** Everything can't be critical - use priority markers to help user focus on what truly matters

---

## Question Grouping Examples

### Good: Related Questions Grouped

**For the API layer:**
**[CRITICAL] 1. Authentication & Authorization**
- How should we handle auth?
- Options: a) JWT tokens, b) Session-based, c) OAuth2 only

**[IMPORTANT] 2. Response Format**
- What format for responses?
- Options: a) JSON:API spec, b) Simple JSON, c) GraphQL

### Bad: Scattered Questions

**[CRITICAL] 1. Authentication method?**
(options...)

**[IMPORTANT] 5. Frontend framework?**
(options...)

**[CRITICAL] 2. Response format?**
(options - but this is related to question 1!)

---

## Priority Marker Guidelines

### When to use [CRITICAL]
- **Must have this answer to proceed** (genuine blocker)
- Affects core architecture decisions
- Multiple approaches with vastly different implementations
- Example: "Should this be a CLI tool or a web service?"

### When to use [IMPORTANT]
- **Significantly changes the approach** but not a blocker
- Affects implementation complexity or timeline
- Important trade-offs to consider
- Example: "Should we use TypeScript or JavaScript?"

### When to use [PREFERENCE]
- **Nice to know** but you can decide if skipped
- Subjective choices (styling, naming, etc.)
- Can be changed later without major refactoring
- Example: "Should error messages be terse or verbose?"

---

## Best Practices Summary

1. **Limit to 5-7 questions** - more creates cognitive overload
2. **Use the `header` field for priority** - "[CRITICAL]", "[IMPORTANT]", or "[PREFERENCE]"
3. **Provide context in the question** - explain why this question matters
4. **Offer 2-4 options with descriptions** - clear trade-offs in each option's description
5. **Group related questions** - present them in a single AskUserQuestion call
6. **Mix priorities** - not everything is critical
7. **Be specific** - avoid vague questions that force long responses
8. **Include your default** - for [PREFERENCE] questions, state what you'll do if skipped

## Why AskUserQuestion Works Better

### Structured Format
The tool enforces consistent presentation - the `header` field automatically displays as a visual chip/tag, making priorities immediately clear.

### Built-in Validation
The tool requires proper structure (question text, options with labels and descriptions), preventing vague or poorly formatted questions.

### Better UX
Users see a clean, interactive interface with:
- Visual priority indicators
- Clear option labels
- Detailed descriptions for each choice
- Easy selection mechanism

### Reliable Formatting
Unlike free-form text that agents may format inconsistently, the tool ensures priority markers always appear correctly.
