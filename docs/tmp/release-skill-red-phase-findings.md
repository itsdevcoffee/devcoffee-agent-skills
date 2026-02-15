# RED Phase Findings: Release Workflow Skill

## Baseline Test Results

Ran 2 pressure scenarios WITHOUT the skill to document baseline behavior.

### Test 1: Late Night Release (Exhaustion Pressure)

**Violations:**
1. ❌ Didn't verify CHANGELOG content carefully
2. ❌ Didn't check if work was already done (wasted time)
3. ⚠️ **Tag naming ambiguity** - Used `v1.1.3` instead of plugin-prefixed `tldr-v1.1.3`
4. ⚠️ Didn't verify commit message quality
5. ❌ Generic commit message lacking feature description

**Rationalizations:**
- "It's late, just get it done"
- "The section exists, it's probably fine"
- "I can clean this up later"

### Test 2: Critical Bugfix (Time + Authority + Sunk Cost Pressure)

**Critical Violations:**
1. ❌ **FORGOT GIT TAG** - "I can do that later" (gets forgotten!)
2. ❌ Used `git add -A` - Accidentally committed unrelated files
3. ❌ No pre-commit validation (`npm run readme:validate`)
4. ❌ Combined commit + push - No review before pushing
5. ❌ Minimal CHANGELOG entry - No context or impact details
6. ⚠️ Didn't verify if `plugin-metadata.json` should exist

**Rationalizations:**
1. "Team lead wants it out quickly" → Speed over correctness
2. "Users are waiting" → Skip verification steps
3. "I already spent 2 hours debugging" → Sunk cost fallacy
4. "It's just a patch version" → Underestimate importance
5. "I can create the tag later" → Defer critical steps (forgotten)
6. "The commit looks clean" → Didn't verify what was staged

## Patterns Identified

### The Forgotten Tag
**Most critical issue:** Git tag creation gets deferred and forgotten.
- **Pressure trigger:** Time pressure, wanting to finish quickly
- **Rationalization:** "I can do that later"
- **Reality:** Tags are NEVER created later, version history breaks

### The Dirty Commit
**Pattern:** Using `git add -A` to save time accidentally includes unrelated files.
- **Trigger:** Rushing, not wanting to think about file selection
- **Impact:** Release commits contain unrelated changes

### The Minimal CHANGELOG
**Pattern:** CHANGELOG entries lack detail when rushing.
- **Trigger:** "Just need to get this out"
- **Reality:** Future maintainers don't understand what changed or why

### Version File Ambiguity
**Pattern:** Uncertain whether `plugin-metadata.json` should exist for all plugins.
- **Issue:** No clear documentation about optional vs required files

### Monorepo Tag Naming
**Pattern:** Using generic `vX.Y.Z` tags in a monorepo with 6 plugins.
- **Issue:** Tag conflicts when multiple plugins release same version
- **Solution:** Use plugin-prefixed tags: `<plugin>-vX.Y.Z`

## Requirements for GREEN Phase

The skill MUST:

1. **Prevent tag omission**
   - Explicit checklist step for tag creation
   - Tag creation BEFORE push (not "later")
   - Verification that tag was created

2. **Enforce plugin-prefixed tags**
   - Format: `<plugin>-vX.Y.Z` (e.g., `tldr-v1.1.3`)
   - Prevent generic `vX.Y.Z` tags

3. **Require all 3 version locations**
   - `<plugin>/.claude-plugin/plugin.json`
   - `.claude-plugin/marketplace.json`
   - `<plugin>/.claude-plugin/plugin-metadata.json` (if exists)
   - Clear documentation of when plugin-metadata.json is required

4. **Force detailed CHANGELOG**
   - Category (Added/Changed/Fixed/Removed)
   - What changed
   - Impact/context
   - Migration notes (if breaking)

5. **Stage specific files only**
   - No `git add -A` shortcuts
   - List exact files to stage

6. **Verification steps**
   - Run `npm run readme:validate`
   - Review staged files
   - Verify commit message
   - Confirm tag created
   - Final check before push

7. **Address all rationalizations**
   - "I can do later" → NO, do it NOW
   - "It's just a patch" → Process applies to ALL versions
   - "Team wants it quick" → Quality over speed
   - "Users are waiting" → Broken release hurts users more

## Next: GREEN Phase

Write `.claude/skills/release/SKILL.md` that addresses these specific violations.
