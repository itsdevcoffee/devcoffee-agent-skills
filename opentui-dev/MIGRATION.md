# OpenTUI Version Migration Guide

This guide helps you migrate between OpenTUI versions when using patterns from this skill.

## Current Compatibility

**Skill Version:** 0.1.0
**Tested With:** @opentui/core v0.1.79
**Compatible:** v0.1.70 - v0.1.x

## Migration Paths

### Migrating from 0.1.70 → 0.1.79 (Current)

**Status:** ✅ All patterns working, no breaking changes

**Timeline API Type Issue (v0.1.75+)**

The `onUpdate` callback was removed from timeline types but still works at runtime:

```diff
// Before (v0.1.70-0.1.74): types included onUpdate
timeline.add(target, {
  value: 100,
  duration: 2000,
  onUpdate: () => { /* ... */ }
})

// After (v0.1.75+): runtime works, types don't include it
+ // @ts-expect-error OpenTUI v0.1.75+ removed onUpdate from types but kept runtime support
timeline.add(target, {
  value: 100,
  duration: 2000,
  onUpdate: () => { /* ... */ }
})
```

**Recommendation:** Use `@ts-expect-error` with explanatory comment instead of `as any` to maintain type safety for other fields.

**No other changes required.** All other patterns from v0.1.70 work unchanged in v0.1.79.

---

### Migrating to 0.2.x (Future)

🚧 **Not yet released.** Breaking changes are expected when OpenTUI reaches 0.2.0.

**What to expect:**
- Potential API changes to core rendering APIs
- Possible changes to component lifecycle
- Timeline/animation API updates
- TypeScript type completions

**When released:**
1. Check OpenTUI 0.2.0 release notes for breaking changes
2. Review updated skill documentation (skill will be updated to v0.2.0)
3. Test your TUI applications with new version
4. Follow migration steps documented here

**ETA:** Unknown (depends on OpenTUI development schedule)

---

### Migrating to 1.0.x (Future Stable)

🎯 **Goal:** OpenTUI reaches stable 1.0 release.

**Expected changes:**
- Framework stabilizes with semantic versioning guarantees
- Complete TypeScript type definitions
- Comprehensive official documentation
- Backward compatibility commitments

**Skill changes:**
- Status: experimental → stable
- Skill version: 0.x → 1.0.0
- Full production-ready designation
- Updated patterns for stable APIs

**When released:**
1. Skill will receive comprehensive update
2. All patterns re-tested and validated
3. Production deployment guidelines added
4. Testing strategies finalized

**ETA:** Unknown (depends on OpenTUI roadmap)

---

## Version-Specific Patterns

### v0.1.70 - v0.1.79 Patterns

All patterns in the skill are tested and working:

✅ **Working Patterns:**
- Dual API (declarative VNodes + imperative Renderables)
- Component factory pattern
- Screen pattern with lifecycle
- Timeline animations (with `@ts-expect-error` for onUpdate)
- Interval animations
- Cascade animations
- Pool-based scrolling
- Theme system (base palette + semantic tokens)
- Cleanup discipline
- RenderContext casting

**No known issues** with these versions.

### v0.1.80+ Patterns

⚠️ **Untested** - Skill not yet validated against v0.1.80+

If you're using v0.1.80 or later:
1. Test the patterns with your version
2. Report any issues: https://github.com/itsdevcoffee/devcoffee-agent-skills/issues
3. Include: OpenTUI version, error message, code snippet

We'll update the skill based on your feedback!

---

## Checking Your OpenTUI Version

```bash
# Check installed version
bun pm ls @opentui/core

# Check latest available version
bun pm show @opentui/core
```

## Updating OpenTUI

```bash
# Update to latest in compatible range
bun update @opentui/core

# Update to specific version
bun add @opentui/core@0.1.79

# Update to latest (may include breaking changes)
bun add @opentui/core@latest
```

**Recommendation:** Pin to tested version in `package.json` for production:

```json
{
  "dependencies": {
    "@opentui/core": "0.1.79"
  }
}
```

## Reporting Compatibility Issues

If you encounter issues with a specific OpenTUI version:

1. **Check CHANGELOG.md** - May already be documented
2. **Search issues** - Someone may have reported it
3. **Open new issue** with:
   - OpenTUI version (from `bun pm ls`)
   - Skill version (from plugin-metadata.json)
   - Error message or unexpected behavior
   - Minimal code snippet reproducing issue

**Issue template:**
```markdown
## Version Compatibility Issue

**OpenTUI Version:** 0.1.85
**Skill Version:** 0.1.0
**Pattern:** Timeline animations

**Issue:**
Timeline onUpdate callback throws runtime error (not just type error)

**Code:**
[paste code snippet]

**Error:**
[paste error message]
```

---

## Quarterly Maintenance Schedule

This skill is reviewed quarterly:

- **Q2 2026 (Apr):** Check for 0.1.x updates, test compatibility
- **Q3 2026 (Jul):** Major version check (0.2.0?), update if needed
- **Q4 2026 (Oct):** Year-end review, plan next year

See [docs/context/2026-02-13-skill-maintenance-strategy.md](../../docs/context/2026-02-13-skill-maintenance-strategy.md) for full maintenance approach.

---

**Last Updated:** 2026-02-13
**Next Review:** Q2 2026 (April)
