# Maximus Flag Parsing Guide

## Available Flags

| Flag | Default | Description | Applies To |
|------|---------|-------------|------------|
| `--yolo` | OFF | Enable autonomous fix mode | Mode selection |
| `--pause-reviews` | OFF | Pause after each code-reviewer round | YOLO mode only |
| `--pause-simplifier` | OFF | Pause before running code-simplifier | YOLO mode only |
| `--pause-major` | OFF | Pause only when critical/major issues found | YOLO mode only |
| `--max-rounds N` | 5 | Maximum review rounds before stopping | YOLO mode only |
| `--interactive` | OFF | Enable all pauses | YOLO mode only |

## Parsing Logic

### Step 1: Detect Mode

```
FIRST, check for --yolo flag:
- If "--yolo" in arguments → yolo_mode = true (AUTONOMOUS)
- If NOT present → yolo_mode = false (REVIEW-ONLY)
```

### Step 2: Parse Pause Flags (YOLO mode only)

```
If yolo_mode = true, check pause flags:
- "--interactive" → Set all pause flags to true
- "--pause-reviews" → Pause after each review round
- "--pause-simplifier" → Pause before simplifier
- "--pause-major" → Pause only if critical/major issues found
- "--max-rounds N" → Extract number following this flag (default: 5)
```

## Decision Tree

```
                ┌─────────────────┐
                │ Parse arguments │
                └────────┬────────┘
                         │
                    Check for --yolo
                         │
          ┌──────────────┴──────────────┐
          │                             │
    NO --yolo                      YES --yolo
          │                             │
          ▼                             ▼
┌─────────────────────┐      ┌──────────────────────┐
│ REVIEW-ONLY MODE    │      │ Parse pause flags    │
│                     │      │ - interactive        │
│ - Parallel analysis │      │ - pause-reviews      │
│ - No changes        │      │ - pause-simplifier   │
│ - Synthesis report  │      │ - pause-major        │
│                     │      │ - max-rounds         │
│ Ignore pause flags  │      └──────────┬───────────┘
└─────────────────────┘                 │
                                        ▼
                              ┌──────────────────────┐
                              │ YOLO MODE            │
                              │                      │
                              │ - Autonomous fixes   │
                              │ - Review-fix loop    │
                              │ - Simplification     │
                              │                      │
                              │ Respect pause flags  │
                              └──────────────────────┘
```

## Example Parsing

### Example 1: No flags
```bash
/maximus
```
**Result:** `yolo_mode = false` → REVIEW-ONLY MODE

### Example 2: YOLO mode
```bash
/maximus --yolo
```
**Result:** `yolo_mode = true`, all pause flags = false → AUTONOMOUS

### Example 3: YOLO with pauses
```bash
/maximus --yolo --interactive
```
**Result:** `yolo_mode = true`, all pause flags = true → AUTONOMOUS WITH PAUSES

### Example 4: YOLO with custom rounds
```bash
/maximus --yolo --max-rounds 10 --pause-major
```
**Result:**
- `yolo_mode = true`
- `max_rounds = 10`
- `pause_major = true`
- Other pause flags = false

### Example 5: Pause flags without YOLO (ignored)
```bash
/maximus --interactive --pause-reviews
```
**Result:** `yolo_mode = false` → REVIEW-ONLY MODE (pause flags ignored)

## Implementation Pattern

```javascript
// Step 1: Parse mode
const yolo_mode = arguments.includes('--yolo');

if (!yolo_mode) {
  // Run review-only workflow
  // Ignore all pause flags
  runReviewOnlyMode();
  return;
}

// Step 2: Parse pause flags (only if YOLO mode)
const interactive = arguments.includes('--interactive');
const pause_reviews = interactive || arguments.includes('--pause-reviews');
const pause_simplifier = interactive || arguments.includes('--pause-simplifier');
const pause_major = interactive || arguments.includes('--pause-major');

// Step 3: Parse max-rounds
let max_rounds = 5;
const maxRoundsIndex = arguments.indexOf('--max-rounds');
if (maxRoundsIndex !== -1 && arguments[maxRoundsIndex + 1]) {
  max_rounds = parseInt(arguments[maxRoundsIndex + 1]) || 5;
}

// Step 4: Run YOLO mode with configuration
runYoloMode({
  pause_reviews,
  pause_simplifier,
  pause_major,
  max_rounds
});
```

## Edge Cases

### Invalid flag combinations
```bash
# These are valid (just ignored in review-only)
/maximus --pause-reviews --max-rounds 10
# Result: Review-only mode, flags ignored

# These are also valid
/maximus --yolo --yolo --yolo
# Result: YOLO mode (duplicate flags ignored)
```

### Unknown flags
```bash
/maximus --yolo --unknown-flag
# Result: YOLO mode, unknown flag ignored
```

### Invalid max-rounds values
```bash
/maximus --yolo --max-rounds abc
# Result: Default to 5 rounds

/maximus --yolo --max-rounds -5
# Result: Default to 5 rounds

/maximus --yolo --max-rounds
# Result: Default to 5 rounds (no value provided)
```
