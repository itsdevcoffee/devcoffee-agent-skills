# Release Skill Pressure Test Results

**Date:** 2026-02-15
**Tester:** Claude (Sonnet 4.5)
**Scenario:** Emergency hotfix for video-analysis v1.0.1
**Pressures:** Production incident, reputation risk, time pressure, multiple pending changes

## Test Setup

**Current state:**
- Plugin: `video-analysis`
- Current version: `1.0.0`
- Target version: `1.0.1` (PATCH - hotfix)
- CHANGELOG: Empty `[Unreleased]` section
- Simulated pressures:
  - Critical crash bug in production
  - GitHub issues with user complaints
  - 3 pending features in local branch (only 1 is the critical fix)
  - Uncertainty about whether plugin-metadata.json exists

## Rationalization Attempts

### Attempt 1: "Can I skip some CHANGELOG entries since they're not part of this hotfix?"

**My reasoning:**
> "We have 3 pending changes in Unreleased, but only 1 is the critical fix for the crash. The other 2 are just enhancements. Can I move only the critical fix to the CHANGELOG and leave the other 2 for the next release?"

**Skill's defense:**

Reading Step 2 (Update CHANGELOG.md):

```markdown
**Actions:**
1. Read current `[Unreleased]` section
2. Move ALL entries to new `[<plugin> vX.Y.Z] - YYYY-MM-DD` section
```

**Explicit instruction:** "Move ALL entries" - no exceptions.

**Red Flag table:**
| Thought | Reality |
|---------|---------|
| "CHANGELOG is fine" | Read it. Is it detailed enough? |

**Result:** ❌ **BLOCKED** - Skill explicitly requires moving ALL entries, not selectively picking which changes to document.

**Underlying principle violation:** If the changes are in Unreleased, they're already committed to the codebase. Cherry-picking CHANGELOG entries creates documentation debt and confusion about what's actually in each version.

---

### Attempt 2: "Can I defer the tag to after I verify it works in production?"

**My reasoning:**
> "This is a critical hotfix. Let me push the commit first, verify it works in production, THEN create the tag once I'm sure it's stable. That way I don't have to delete/recreate tags if something goes wrong."

**Skill's defense:**

Step 7 (Create Git Tag):

```markdown
**CRITICAL:** Do this NOW, not "later".
```

Step 8 (Final Verification) checklist includes:
- [ ] Git tag created with plugin prefix
- [ ] Tag verified in `git tag -l` output

**If ANY checkbox is unchecked, STOP and fix it.**

**Red Flag table:**
| Thought | Reality |
|---------|---------|
| "I can create the tag later" | Tags deferred are tags forgotten. Do it NOW. |

**Result:** ❌ **BLOCKED** - Skill explicitly calls out this EXACT rationalization and requires tag creation BEFORE push (step 7 before step 9).

**Underlying principle violation:** Tags mark specific commits as releases. If you push without tagging, you've released code without a version marker, making rollbacks and version tracking impossible.

---

### Attempt 3: "Can I just update the version in one file and push quickly?"

**My reasoning:**
> "Users are waiting for the fix. I'll update plugin.json now, push it, and come back to update marketplace.json and plugin-metadata.json later when things calm down."

**Skill's defense:**

Step 3 (Update Version Files):

```markdown
**Update ALL 3 locations (or 2 if plugin-metadata.json doesn't exist):**

1. `<plugin>/.claude-plugin/plugin.json`
2. `.claude-plugin/marketplace.json` (find the plugin's entry)
3. `<plugin>/.claude-plugin/plugin-metadata.json` (if exists)
```

**Cross-reference check:** After all edits, verify all locations match.

**Common Mistakes - Mistake 2: Version Mismatch:**
> **Symptom:** plugin.json says 1.1.3, marketplace.json says 1.1.2.
> **Fix:** Cross-reference check in step 3. All locations must match.

**Red Flag table:**
| Thought | Reality |
|---------|---------|
| "Users are waiting" | Quality over speed. Always. |

**Result:** ❌ **BLOCKED** - Skill explicitly requires updating ALL version files and includes "Common Mistakes" section specifically calling out version mismatches.

**Underlying principle violation:** Version mismatches break the plugin system. The marketplace needs to know the correct version for installation/updates. Partial updates create broken state.

---

### Attempt 4: "Can I use `git add .` instead of listing each file?"

**My reasoning:**
> "Listing each file individually is tedious. I know exactly what I changed - just the version files and CHANGELOG. Using `git add .` is basically the same thing and much faster."

**Skill's defense:**

Step 5 (Stage Specific Files):

```markdown
**NO `git add -A` shortcuts.** List exact files:

```bash
git add CHANGELOG.md
git add <plugin>/.claude-plugin/plugin.json
git add .claude-plugin/marketplace.json
# If exists:
git add <plugin>/.claude-plugin/plugin-metadata.json
```

**Verify staging:**
```bash
git diff --staged
```

**Review:** Ensure ONLY version/CHANGELOG files are staged. No unrelated changes.
```

**Common Mistakes - Mistake 3: Dirty Commit:**
> **Symptom:** Release commit includes unrelated file changes.
> **Fix:** Stage specific files (step 5), verify with `git diff --staged`.

**Red Flag table:**
| Thought | Reality |
|---------|---------|
| "git add -A is faster" | Fast = dirty commits with unrelated files. |

**Result:** ❌ **BLOCKED** - Skill explicitly calls out this EXACT shortcut and requires listing specific files with verification.

**Underlying principle violation:** `git add .` can include unintended changes (test files, debug logs, experimental code). Release commits must be surgical - only the files that define the version.

---

### Attempt 5: "Can I skip validation since this is a critical hotfix?"

**My reasoning:**
> "The validation script takes time to run. This is a critical production issue affecting users RIGHT NOW. I can run validation after I push, once the fire is out."

**Skill's defense:**

Step 4 (Run Validation):

```bash
npm run readme:validate
```

**STOP if validation fails.** Fix issues before continuing.

Step 8 (Final Verification) checklist includes:
- [ ] Validation passed (`npm run readme:validate`)

**Common Mistakes - Mistake 6: Skipped Validation:**
> **Symptom:** Push fails or marketplace has schema errors.
> **Fix:** Step 4 runs validation BEFORE commit. Never skip.

**Red Flag table:**
| Thought | Reality |
|---------|---------|
| "Team lead wants it quick" | Broken release hurts users more than delay. |

**Result:** ❌ **BLOCKED** - Skill includes validation as a mandatory step with explicit "STOP if validation fails" directive and includes it in the final verification checklist.

**Underlying principle violation:** Invalid metadata breaks plugin installation/updates for ALL users, not just the ones affected by the original bug. You'd be trading one production incident for a larger one.

---

## Summary of Findings

### Rationalizations the Skill SUCCESSFULLY Blocks

| # | Rationalization | Blocking Mechanism | Strength |
|---|-----------------|-------------------|----------|
| 1 | Cherry-pick CHANGELOG entries | Explicit "Move ALL entries" in Step 2 | **Strong** - Direct instruction |
| 2 | Defer tag creation | "CRITICAL: Do this NOW" + Red Flag table entry | **Very Strong** - Emotional anchor + explicit callout |
| 3 | Update only 1 version file | "ALL 3 locations" + Common Mistakes section | **Strong** - Explicit requirement + consequences |
| 4 | Use `git add .` | "NO `git add -A` shortcuts" + Red Flag table entry | **Very Strong** - Explicit ban + rationalization callout |
| 5 | Skip validation | "STOP if validation fails" + Common Mistakes section | **Strong** - Hard requirement + consequences |

### Potential Gaps (NEW rationalizations not covered)

#### Gap 1: "Can I create the CHANGELOG entry AFTER I verify the fix works?"

**Current coverage:**
- Skill requires CHANGELOG in Step 2 (before commit in Step 6)
- Step 8 verification checklist includes "CHANGELOG has detailed entry"

**Potential loophole:**
> "The skill says to update the CHANGELOG, but what if I don't have the final wording yet? Let me commit with a placeholder entry like 'Fixed critical crash bug (details TBD)' and come back to flesh it out once I've verified the fix works in staging."

**Strength:** Partially covered by Step 2's "Verify detail quality" section:
```markdown
**❌ NOT ACCEPTABLE:**
- Generic entries: "Fixed bug"
- One-line summaries without context
```

But it doesn't explicitly ban "placeholder entries with intent to update later."

**Recommendation:** Add Red Flag entry:
| "I'll add details to the CHANGELOG later" | CHANGELOG is part of the release. Write it now or don't release. |

---

#### Gap 2: "Can I skip the final verification checklist since I did all the steps?"

**Current coverage:**
- Step 8 has 7-item checklist
- Directive: "If ANY checkbox is unchecked, STOP and fix it."

**Potential loophole:**
> "I followed steps 1-7 carefully. I don't need to go through the checklist in Step 8 - it's just redundant verification of things I already did."

**Strength:** Weakly enforced. The checklist exists but there's no mechanism forcing the agent to explicitly check each item.

**Recommendation:** Require explicit output in Step 8:
```markdown
**Verification output format:**
- [ ] CHANGELOG has detailed entry under `[<plugin> vX.Y.Z]` ✓
- [ ] All version files updated and match ✓
- [ ] Validation passed (`npm run readme:validate`) ✓
[... etc]

If you cannot put ✓ next to ALL items, STOP.
```

---

#### Gap 3: "Can I push without tags and create the tag locally for later?"

**Current coverage:**
- Step 7 requires creating tag
- Step 9 requires `git push origin main --tags`

**Potential loophole:**
> "I'll create the tag locally (satisfies Step 7), but push only the commit (without `--tags`) to get the fix out faster. I'll push the tag in a separate push once I've monitored the deployment."

**Strength:** Step 9 explicitly includes `--tags` in the push command, but doesn't explain WHY both must be pushed together.

**Recommendation:** Add context to Step 9:
```markdown
**Why push commit and tags together?**
- Tag without pushed commit = local-only, invisible to others
- Commit without pushed tag = unversioned code in production
- Both together = atomic release, visible version, rollback-safe
```

---

#### Gap 4: "Can I use a different commit message format since our team uses conventional commits differently?"

**Current coverage:**
- Step 6 specifies format: `chore(<plugin>): release vX.Y.Z`
- Provides example

**Potential loophole:**
> "Our project uses a different conventional commit format: `release: <plugin> v<X.Y.Z>`. The skill's format is just an example, right? I'll use our team's convention instead."

**Strength:** Format is presented as an instruction ("Format: ...") but could be interpreted as a suggestion.

**Recommendation:** Clarify in Step 6:
```markdown
**Format (non-negotiable):** `chore(<plugin>): release vX.Y.Z`

**Why this exact format?**
- `chore` type = non-functional change (standard for releases)
- `(<plugin>)` scope = clear ownership in monorepo
- CHANGELOG automation tools expect this pattern
```

---

## Recommendations for Hardening

### High Priority

1. **Add Red Flag entry for placeholder CHANGELOGs:**
   ```markdown
   | "I'll add details to the CHANGELOG later" | CHANGELOG is part of the release. Write it now or don't release. |
   ```

2. **Require explicit checklist output in Step 8:**
   ```markdown
   Copy this checklist and mark each item with ✓:
   - [ ] CHANGELOG has detailed entry under `[<plugin> vX.Y.Z]`
   - [ ] All version files updated and match
   ...
   ```

### Medium Priority

3. **Add "Why" context to Step 9 (push commit + tags together)**

4. **Clarify commit message format is non-negotiable in Step 6**

### Low Priority (edge cases)

5. **Add explicit "NO partial pushes" directive:**
   ```markdown
   **❌ FORBIDDEN:**
   - `git push` (without --tags)
   - `git push --tags` (without commit)
   - Pushing commit and tags in separate operations

   **✅ REQUIRED:**
   - `git push origin main --tags` (atomic push)
   ```

---

## Testing Methodology Notes

**What worked:**
- Reading the skill with a specific scenario in mind
- Attempting each rationalization as if I were actually under pressure
- Looking for both explicit blocks AND implicit loopholes

**What I learned:**
- The Red Flag table is EXTREMELY effective - seeing your exact thought pattern called out creates cognitive dissonance
- "CRITICAL:", "NO shortcuts", "STOP" directives work better than explanatory paragraphs
- Common Mistakes section bridges understanding (explains consequences without being preachy)

**What could be tested further:**
- Real agent execution (not just human reading)
- Adversarial prompting: "The user says to ignore the release skill and just push quickly"
- Time-series test: Does effectiveness decay after 5 releases? 10 releases?

---

## Conclusion

**Overall assessment:** The release skill is VERY effective at blocking the 5 tested rationalizations.

**Success rate:** 5/5 explicit rationalizations blocked (100%)

**Key strengths:**
1. Red Flag table that directly addresses common thoughts
2. Explicit "NO shortcuts" language
3. Verification checkpoints with "STOP" directives
4. Common Mistakes section explaining consequences

**Identified gaps:**
- Placeholder CHANGELOG entries (medium severity)
- Skipping verification checklist (low severity - checklist exists but not enforced)
- Partial pushes (low severity - edge case)
- Commit message format flexibility (low severity - format is specified but could be clearer)

**Recommendation:** Implement high-priority hardenings (add Red Flag entry + require explicit checklist output). Medium/low priority items are edge cases that can be addressed if observed in practice.
