# Maximus State Management

## Overview

Maximus uses a state object to track execution across all phases. This state is critical for generating the comprehensive Phase 4 summary report.

## State Structure

### Complete State Object (YOLO Mode)

```javascript
state = {
  // Mode configuration
  mode: "yolo",  // or "review-only"

  // Phase 1: Change Detection
  source: "",  // "uncommitted changes" or "N unpushed commits"
  files: [],   // ["path/to/file1.ts", "path/to/file2.ts"]

  // Phase 2: Review Rounds (YOLO mode only)
  rounds: [
    {
      round_num: 1,
      issues_found: 5,
      issues_fixed: 5,
      by_severity: {
        critical: 1,
        major: 2,
        minor: 2
      },
      fixes_applied: [
        "Fixed null pointer in UserController.ts",
        "Added input validation to login endpoint",
        "Removed unused variable in utils.ts",
        "Fixed async/await error handling",
        "Added missing error boundary"
      ]
    },
    {
      round_num: 2,
      issues_found: 1,
      issues_fixed: 1,
      by_severity: {
        critical: 0,
        major: 1,
        minor: 0
      },
      fixes_applied: [
        "Fixed edge case in date parsing"
      ]
    },
    {
      round_num: 3,
      issues_found: 0,
      issues_fixed: 0,
      by_severity: {
        critical: 0,
        major: 0,
        minor: 0
      },
      fixes_applied: []
    }
  ],

  // Phase 3: Simplification (YOLO mode) or Analysis (review-only)
  simplification: {
    completed: true,
    files_processed: 2,
    improvements: [
      {
        file: "UserController.ts",
        category: "Extract Function",
        description: "Extracted validation logic into validateUser helper",
        impact: "reduced 40 lines, improved testability"
      },
      {
        file: "UserController.ts",
        category: "Reduce Nesting",
        description: "Flattened nested conditionals using early returns",
        impact: "3 levels → 1 level"
      },
      {
        file: "utils.ts",
        category: "Rename Variable",
        description: "Renamed 'x' to 'userPosition'",
        impact: "improved clarity"
      }
    ],
    by_category: {
      "Extract Function": 1,
      "Reduce Nesting": 1,
      "Rename Variable": 1
    }
  },

  // Phase 4: Summary Output
  summary_output: false  // Set to true after outputting
}
```

### State Object (Review-Only Mode)

```javascript
state = {
  // Mode configuration
  mode: "review-only",

  // Phase 1: Change Detection
  source: "uncommitted changes",
  files: ["path/to/file1.ts", "path/to/file2.ts"],

  // Phase 2: Parallel Analysis Results
  review_findings: {
    total_issues: 8,
    by_severity: {
      critical: 2,
      major: 3,
      minor: 3
    },
    issues: [
      {
        file: "UserController.ts",
        line: 42,
        severity: "critical",
        description: "Potential null pointer dereference",
        recommended_fix: "Add null check before accessing user.profile"
      },
      // ... more issues
    ]
  },

  simplification_findings: {
    total_opportunities: 5,
    by_category: {
      "Extract Function": 2,
      "Reduce Nesting": 1,
      "Rename Variable": 1,
      "Consolidate Code": 1
    },
    opportunities: [
      {
        file: "UserController.ts",
        line: 58,
        category: "Extract Function",
        current: "Inline validation logic spanning 40 lines",
        suggested: "Extract into validateUser helper function",
        impact: "Improved testability, reduced duplication"
      },
      // ... more opportunities
    ]
  },

  // Phase 3: Synthesis
  synthesis: {
    overlapping_findings: [
      {
        location: "UserController.ts:42",
        review_finding: "Unused variable 'tempData'",
        simplification_finding: "Remove unnecessary variable 'tempData'",
        resolution: "Remove variable (both agents agree)"
      }
    ],
    conflicts: [
      {
        location: "api.ts:15",
        review_finding: "Add try-catch for error handling",
        simplification_finding: "Remove unnecessary try-catch",
        context: "Existing error handling is at wrong level. Move to middleware instead."
      }
    ]
  },

  // Phase 4: Summary Output
  summary_output: false
}
```

## State Initialization

### Review-Only Mode
```javascript
// At start of execution
state = {
  mode: "review-only",
  source: "",
  files: [],
  review_findings: null,
  simplification_findings: null,
  synthesis: {
    overlapping_findings: [],
    conflicts: []
  },
  summary_output: false
}
```

### YOLO Mode
```javascript
// At start of execution
state = {
  mode: "yolo",
  source: "",
  files: [],
  rounds: [],
  simplification: {
    completed: false,
    files_processed: 0,
    improvements: [],
    by_category: {}
  },
  summary_output: false
}
```

## State Updates by Phase

### Phase 1: Change Detection

```javascript
// After git commands
state.source = "uncommitted changes";  // or "5 unpushed commits"
state.files = ["src/app.ts", "src/utils.ts"];
```

### Phase 2: Review-Fix Loop (YOLO mode)

```javascript
// After each round
const round = {
  round_num: state.rounds.length + 1,
  issues_found: 0,
  issues_fixed: 0,
  by_severity: { critical: 0, major: 0, minor: 0 },
  fixes_applied: []
};

// As issues are found and fixed
round.issues_found++;
round.by_severity[severity]++;
round.issues_fixed++;
round.fixes_applied.push("Description of fix");

// After round completes
state.rounds.push(round);
```

### Phase 2: Parallel Analysis (Review-Only mode)

```javascript
// After code-reviewer completes
state.review_findings = {
  total_issues: 8,
  by_severity: parseReviewerOutput(),
  issues: extractIssues()
};

// After code-simplifier completes
state.simplification_findings = {
  total_opportunities: 5,
  by_category: parseSimplifierOutput(),
  opportunities: extractOpportunities()
};
```

### Phase 3: Simplification (YOLO mode)

```javascript
// As simplifier processes files
state.simplification.files_processed++;

// As improvements are made
state.simplification.improvements.push({
  file: "app.ts",
  category: "Extract Function",
  description: "Extracted helper",
  impact: "reduced 30 lines"
});

// Update category counts
state.simplification.by_category[category]++;

// Mark complete
state.simplification.completed = true;
```

### Phase 3: Synthesis (Review-Only mode)

```javascript
// Identify overlaps
for (const issue of state.review_findings.issues) {
  for (const opp of state.simplification_findings.opportunities) {
    if (isSameLocation(issue, opp)) {
      state.synthesis.overlapping_findings.push({
        location: issue.file + ":" + issue.line,
        review_finding: issue.description,
        simplification_finding: opp.description,
        resolution: determineResolution(issue, opp)
      });
    }
  }
}

// Identify conflicts
state.synthesis.conflicts.push({
  location: "file:line",
  review_finding: "description",
  simplification_finding: "description",
  context: "explanation"
});
```

### Phase 4: Summary Output

```javascript
// After outputting complete summary
state.summary_output = true;
```

## State Validation

Before outputting Phase 4 summary, verify state completeness:

### YOLO Mode Checklist
```javascript
const isValid =
  state.source !== "" &&
  state.files.length > 0 &&
  state.rounds.length > 0 &&
  state.rounds.every(r => r.by_severity !== undefined) &&
  state.simplification.completed === true &&
  state.simplification.improvements.length >= 0;

if (!isValid) {
  // Go back and complete missing phases
}
```

### Review-Only Mode Checklist
```javascript
const isValid =
  state.source !== "" &&
  state.files.length > 0 &&
  state.review_findings !== null &&
  state.simplification_findings !== null &&
  state.synthesis.overlapping_findings !== null;

if (!isValid) {
  // Go back and complete missing phases
}
```

## State Access Patterns

### Calculate Totals (YOLO mode)

```javascript
// Total issues across all rounds
const totalIssuesFound = state.rounds.reduce((sum, r) => sum + r.issues_found, 0);
const totalIssuesFixed = state.rounds.reduce((sum, r) => sum + r.issues_fixed, 0);

// Total by severity
const totalCritical = state.rounds.reduce((sum, r) => sum + r.by_severity.critical, 0);
const totalMajor = state.rounds.reduce((sum, r) => sum + r.by_severity.major, 0);
const totalMinor = state.rounds.reduce((sum, r) => sum + r.by_severity.minor, 0);

// Total improvements
const totalImprovements = state.simplification.improvements.length;
```

### Generate Timeline (YOLO mode)

```javascript
const timeline = [];

// Initial scan
timeline.push(`1. Initial scan → ${state.rounds[0].issues_found} issues`);

// Each round
state.rounds.forEach((round, idx) => {
  if (round.fixes_applied.length > 0) {
    timeline.push(`${idx + 2}. Round ${round.round_num} fixes → ${round.fixes_applied.join(', ')}`);
  }
  if (idx < state.rounds.length - 1) {
    timeline.push(`${idx + 3}. Verification scan → ${state.rounds[idx + 1].issues_found} issues`);
  }
});

// Simplification
const simpIdx = timeline.length + 1;
timeline.push(`${simpIdx}. Simplification Results:`);
state.simplification.improvements.forEach(imp => {
  timeline.push(`   - ${imp.file}: ${imp.description}`);
});
```

## Error State Handling

### Tracking Errors

```javascript
// Add error fields to state
state.errors = [];

// When error occurs
state.errors.push({
  phase: "Phase 2 - Review Round 1",
  error: "code-reviewer subagent failed",
  recovery: "skipped to Phase 3"
});

// In summary
if (state.errors.length > 0) {
  // Mark as NEEDS ATTENTION
  // List errors in Timeline section
}
```

### Partial Results

```javascript
// Track skipped files
state.skipped_files = [
  { file: "locked.ts", reason: "access denied" }
];

// Track unfixed issues (YOLO mode)
state.unfixed_issues = [
  { file: "readonly.ts", issue: "description", reason: "file not writable" }
];
```

## Best Practices

1. **Initialize state early** - At the start of execution
2. **Update state immediately** - After each operation completes
3. **Never skip state updates** - Even if phase fails partially
4. **Validate before Phase 4** - Ensure all required data present
5. **Use state for all metrics** - Don't recalculate, use tracked values
6. **Handle partial results** - Track what was completed vs skipped
7. **Preserve error context** - Record what failed and why
