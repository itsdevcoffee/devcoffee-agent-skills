# Remotion Best Practices Skill - Action Plan

**Date:** 2026-02-04
**Status:** CRITICAL - Blocks v1.0 release
**Estimated fix time:** 3-4 hours (P0 only)

---

## The Problem

Real-world test created a 15-second video using remotion-max plugin → **COMPLETE FAILURE**

**Result:**
- First-try success rate: 0%
- Manual fixes required: 5 critical issues
- User experience: "utterly trash", "total dog shit"

**Root cause:** The remotion-best-practices skill has critical content gaps that caused agents to generate broken code.

---

## Critical Gap: tailwind.md

**Current content:** 56 words that say "fetch the docs yourself"

**Missing information that caused failures:**
1. ❌ @remotion/tailwind package requirement → failure #1
2. ❌ enableTailwind() config requirement → failure #2
3. ❌ CSS import requirement → failure #3
4. ❌ AbsoluteFill + flex class gotcha → failure #4
5. ❌ No hardcoded concurrency guidance → failure #5

**Impact:** Agents using this skill generate completely broken code.

---

## P0 Fixes - MUST DO (3-4 hours)

### 1. Rewrite tailwind.md (2 hours)

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/rules/tailwind.md`

**Current:** 56 words
**Target:** 450+ words

**Required content:**
- All 5 setup steps (packages, config, CSS, import, webpack)
- Complete code examples for each step
- AbsoluteFill + flex class pattern
- Animation rules (no CSS animations)
- Common mistakes
- Troubleshooting checklist

**Template:** See `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/tmp/2026-02-04-remotion-best-practices-skill-review.md` section "Critical Issue #1" for complete recommended content.

---

### 2. Create common-mistakes.md (1 hour)

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/rules/common-mistakes.md`

**Content:** Top 10 mistakes with fixes
1. Missing 'flex' on AbsoluteFill
2. Using CSS animations
3. Missing CSS import
4. Hardcoded system values
5. Wrong import sources
6. Referencing real time
7. Missing extrapolateRight
8. No null checks
9. Local file paths
10. No loading states

**Template:** See skill review doc section "Critical Issue #3"

---

### 3. Create troubleshooting.md (1 hour)

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/rules/troubleshooting.md`

**Content:**
- Black screen debugging
- Content not centering
- Tailwind not working
- Build errors (concurrency, missing packages, etc.)
- Animations not working
- TypeScript errors
- Performance issues
- Studio won't start

**Template:** See skill review doc section "Critical Issue #4"

---

### 4. Update SKILL.md (15 min)

**File:** `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/remotion-max/skills/remotion-best-practices/SKILL.md`

Add references to new files:
```markdown
- [rules/tailwind.md](rules/tailwind.md) - Using TailwindCSS in Remotion (UPDATED - complete setup guide)
- [rules/common-mistakes.md](rules/common-mistakes.md) - Top 10 mistakes to avoid when building Remotion videos
- [rules/troubleshooting.md](rules/troubleshooting.md) - Debugging common Remotion issues
```

---

## Validation Test (30 min)

After applying fixes, run this test:

**Test scenario:** Create 15-second explainer video (same as original test)

**Success criteria:**
- [ ] Project setup completes with all Tailwind requirements
- [ ] Components include 'flex' class on AbsoluteFill
- [ ] Build succeeds on first try
- [ ] Video renders correctly (no black screen)
- [ ] Content centers properly
- [ ] **0 manual fixes required**

**If test fails:**
- Document what broke
- Identify which file needs enhancement
- Fix and re-test

---

## P1 Fixes - SHOULD DO (2-3 hours)

### 5. Create configuration-best-practices.md (1 hour)

Document safe configuration patterns, auto-detection, environment variables.

**Template:** See skill review doc section "Critical Issue #5"

---

### 6. Create examples/ directory (2 hours)

Add complete, tested component examples:
- `examples/centered-title-card.tsx`
- `examples/tailwind-gradient-background.tsx`
- `examples/spring-animated-list.tsx`
- `examples/audio-visualization.tsx`
- `examples/README.md`

---

## Quick Reference

### Files to Edit

```
remotion-max/skills/remotion-best-practices/
├── SKILL.md (update - 15 min)
└── rules/
    ├── tailwind.md (rewrite - 2 hours)
    ├── common-mistakes.md (create - 1 hour)
    ├── troubleshooting.md (create - 1 hour)
    └── configuration-best-practices.md (create - 1 hour, P1)
```

### Total Time

**P0 (blocking):** 3-4 hours
**P1 (recommended):** 2-3 additional hours
**Validation:** 30 minutes

**Total for production-ready:** 6-7 hours

---

## Success Metrics

### Before Fixes
- First-try success: 0%
- Manual fixes: 5 required
- Skill quality: Inadequate (1/5 for integration patterns)

### After P0 Fixes (Target)
- First-try success: 90%+
- Manual fixes: 0 required
- Skill quality: Good (4/5)

### After P1 Fixes (Target)
- First-try success: 95%+
- Manual fixes: 0 required
- Skill quality: Excellent (5/5)

---

## Release Blockers

**DO NOT release remotion-max v1.0 until:**
- [ ] P0 fix #1 complete (tailwind.md rewrite)
- [ ] P0 fix #2 complete (common-mistakes.md)
- [ ] P0 fix #3 complete (troubleshooting.md)
- [ ] SKILL.md updated
- [ ] Validation test passes with 0 manual fixes

**Recommended (but not blocking):**
- [ ] P1 fix #5 complete (configuration-best-practices.md)
- [ ] P1 fix #6 complete (examples/ directory)
- [ ] 3 successful validation tests

---

## Next Steps

1. **Review the complete skill review document:**
   `/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/docs/tmp/2026-02-04-remotion-best-practices-skill-review.md`

2. **Copy recommended content** from review doc sections

3. **Apply P0 fixes** in order (1 → 2 → 3 → 4)

4. **Run validation test**

5. **If test passes:** Apply P1 fixes, then release

6. **If test fails:** Debug, enhance, re-test

---

## Key Insight

**The skill has excellent structure but delegates critical information to external docs.**

The phrase "fetch https://www.remotion.dev/docs/tailwind using WebFetch for instructions" in the 56-word tailwind.md is the **opposite of what a skill should do**.

**Skills exist to provide the information directly, not to tell agents to fetch it elsewhere.**

This is the core issue that needs fixing.

---

**Created:** 2026-02-04
**Priority:** P0 - BLOCKING
**Owner:** TBD
**Status:** Ready to implement
