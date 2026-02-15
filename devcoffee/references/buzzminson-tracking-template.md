# Buzzminson Tracking Document Template

This template should be used for every buzzminson implementation session.

## File Location

`docs/buzzminson/YYYY-MM-DD-descriptive-feature-name.md`

## Template Structure

```markdown
---
feature: [Feature Name]
started: YYYY-MM-DD HH:MM
current_phase: 1
status: Planning
agent: buzzminson
---

# [Feature Name] - Implementation Log

## Summary

[High-level description of what was built - fill this in during the review phase]

Example:
> Implemented user authentication system with JWT tokens, refresh logic, and route protection middleware. Chose JWT over sessions for scalability. Added comprehensive test coverage with 12 passing tests.

## Tasks

### Planned
- [ ] Task 1 description
- [ ] Task 2 description
- [ ] Task 3 description

### Completed
[Move tasks here as they're finished - include timestamp if significant]
- [x] Task 1 description (12:34)
- [x] Task 2 description (12:45)

### Backburner
[Items identified during implementation but deferred to future work]
- Item 1: Why it was deferred
- Item 2: Why it was deferred

## Questions & Clarifications

### Initial Questions

[If you used AskUserQuestion, document what was asked]

Example:
1. **Authentication Method** [CRITICAL]
   - Question: Which authentication approach?
   - Answer: JWT with refresh tokens
   - Rationale: User selected for scalability

2. **User Storage** [IMPORTANT]
   - Question: Where should user data be persisted?
   - Answer: PostgreSQL
   - Rationale: User selected for ACID guarantees

### Key Decisions & Assumptions

[Document choices made during implementation without explicit user guidance]

Example:
- **Token expiration:** Set to 15 minutes (industry standard for JWTs)
- **Refresh token:** Stored in httpOnly cookie for security
- **Password hashing:** Using bcrypt with 12 rounds (recommended)

## Implementation Details

### Changes Made

[List all files created/modified with brief descriptions]

Example:
- `src/auth/auth.service.ts`: JWT token generation and validation logic
- `src/auth/auth.middleware.ts`: Route protection middleware
- `src/auth/refresh.controller.ts`: Token refresh endpoint
- `tests/auth.test.ts`: Comprehensive auth test suite (12 tests)

### Problems & Roadblocks

[Document issues encountered and how they were resolved]

Example:
- **Issue:** JWT library version incompatibility with TypeScript 5
  - **Solution:** Upgraded @types/jsonwebtoken to v9.0.5
  - **Impact:** Required updating tsconfig.json strictness settings

- **Issue:** Refresh token rotation caused race condition
  - **Solution:** Implemented atomic refresh with transaction
  - **Impact:** Added database migration for token versioning

## Testing Instructions

[Simple, step-by-step manual testing guide that anyone can follow]

Example:

### Prerequisites
- Server running on http://localhost:3000
- Database seeded with test user: test@example.com / password123

### Test Flow

1. **Register new user**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"new@example.com","password":"pass123"}'
   ```
   Expected: 201 status, user object with id

2. **Login**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"new@example.com","password":"pass123"}'
   ```
   Expected: 200 status, access token in response

3. **Access protected route**
   ```bash
   curl http://localhost:3000/users/me \
     -H "Authorization: Bearer [ACCESS_TOKEN]"
   ```
   Expected: 200 status, user profile data

4. **Try accessing without token**
   ```bash
   curl http://localhost:3000/users/me
   ```
   Expected: 401 status, "Unauthorized" message

5. **Refresh token**
   ```bash
   curl -X POST http://localhost:3000/auth/refresh \
     -H "Cookie: refreshToken=[REFRESH_TOKEN]"
   ```
   Expected: 200 status, new access token

### Expected Results
- All endpoints return correct status codes
- Protected routes require valid JWT
- Token refresh works without re-login
- Invalid tokens are rejected

## Maximus Review

[This section is populated after maximus runs - leave empty initially]

Example after maximus:
```
**Maximus Review Completed:** YYYY-MM-DD HH:MM

**Issues Found:** 3
- Code style: 2 (formatting inconsistencies)
- Logic: 1 (potential null pointer in refresh logic)

**Fixes Applied:** All issues resolved
- Applied prettier formatting
- Added null checks in refresh.controller.ts
- Simplified token validation logic

**Simplifications:** 2
- Extracted repeated validation logic into helper
- Consolidated error handling in middleware

**Final Status:** ✅ All checks passed
```

## Session Log

<details>
<summary>Detailed Timeline</summary>

[Add timestamps for significant actions throughout the session]

Example:
- **12:00** - Session started, analyzing task
- **12:02** - Created tracking document
- **12:03** - Asked clarification questions (4 questions)
- **12:10** - User answered questions, starting implementation
- **12:15** - Created auth service with JWT generation
- **12:25** - Implemented route protection middleware
- **12:30** - Added refresh token logic
- **12:45** - Wrote test suite (12 tests, all passing)
- **12:50** - Updated documentation
- **12:52** - Completed implementation, status → Review
- **13:00** - User approved, starting maximus review
- **13:15** - Maximus completed, all issues resolved
- **13:18** - Session complete

</details>
```

## Notes

**Status Transitions (update YAML frontmatter `current_phase` and `status` at each transition):**
1. `current_phase: 1`, `status: Planning` - Creating doc, asking questions
2. `current_phase: 2`, `status: Implementation` - Building the feature
3. `current_phase: 3`, `status: Review` - User reviewing and providing feedback
4. `current_phase: 4`, `status: Quality Assurance` - Maximus reviewing code
5. `current_phase: 5`, `status: Complete` - All work done

**Best Practices:**
- Update this document continuously as you work
- Keep the session log updated with major actions
- Be specific in "Changes Made" - include file paths
- Make testing instructions foolproof
- Document assumptions clearly in "Key Decisions"
- Move non-critical items to "Backburner" rather than skipping
