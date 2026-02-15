---
name: test-generator
description: >-
  Generate comprehensive unit tests for code files. Use when the user asks to
  create tests, write test cases, add unit tests, or improve test coverage.
  Invoked as "/test-plugin:test-generator [file-path]" to generate tests for
  a specific file, or without arguments to analyze the current context and
  suggest what needs testing.
version: 0.1.0
framework: TDD
status: active
tools:
  - Read
  - Write
  - Grep
  - Glob
tags:
  - testing
  - code-quality
  - automation
---

# test-generator

Generate comprehensive unit tests for code files using best practices and industry-standard testing frameworks.

## Task

### Mode 1: File-specific test generation (`/test-plugin:test-generator [file-path]`)

Generate unit tests for a specific source file.

1. **Read the target file** using the Read tool.
   - Extract all functions, methods, classes, and modules
   - Identify dependencies and imports
   - Analyze edge cases and error conditions

2. **Detect the testing framework:**
   - JavaScript/TypeScript: Jest, Vitest, Mocha, or native node:test
   - Python: pytest, unittest, or nose
   - Go: testing package
   - Java: JUnit
   - Auto-detect from package.json, go.mod, pom.xml, or requirements.txt

3. **Analyze test coverage needs:**
   - Happy path scenarios
   - Error conditions and exceptions
   - Edge cases (null, undefined, empty, boundary values)
   - Integration points and mocks required

4. **Generate comprehensive tests:**
   - Create test file following naming conventions (e.g., `*.test.ts`, `*_test.go`, `test_*.py`)
   - Include setup/teardown as needed
   - Mock external dependencies
   - Cover at least 80% of code paths
   - Add descriptive test names and comments

5. **Write the test file** using the Write tool.
   - Place in conventional location (e.g., `__tests__/`, `tests/`, same directory)
   - Follow project structure conventions if detectable

### Mode 2: Context-aware suggestions (`/test-plugin:test-generator`)

When invoked without arguments, analyze the conversation context to suggest what needs testing.

1. **Scan conversation history** for recently discussed or modified files.

2. **Use Grep/Glob tools** to find files lacking test coverage:
   - Search for source files
   - Cross-reference with existing test files
   - Identify untested modules

3. **Provide actionable recommendations:**
   - List files that need tests
   - Prioritize by complexity and criticality
   - Suggest command to generate tests for each file

## Test Generation Principles

- **Arrange-Act-Assert (AAA) pattern:** Structure tests clearly
- **Single responsibility:** Each test validates one behavior
- **Descriptive names:** Test names should explain what's being tested
- **Isolation:** Tests should not depend on each other
- **Mocking:** Mock external dependencies (APIs, databases, file system)
- **Coverage goals:** Aim for 80%+ line coverage, 100% critical path coverage

## Framework Detection Examples

### JavaScript/TypeScript
```javascript
// Detect from package.json devDependencies
"jest": "^29.0.0" → Use Jest
"vitest": "^1.0.0" → Use Vitest
```

### Python
```python
# Detect from imports or requirements.txt
import pytest → Use pytest
import unittest → Use unittest
```

### Go
```go
// Always use testing package
import "testing"
```

## Output Format

### For file-specific generation:
```
Generated comprehensive unit tests for [file-path]:

✓ Created: [test-file-path]
✓ Test framework: [framework-name]
✓ Test cases: [count]
✓ Coverage areas:
  - Happy path scenarios
  - Error handling
  - Edge cases
  - [Any specific areas]

Next steps:
- Run tests: [command]
- Check coverage: [command]
```

### For context-aware suggestions:
```
Test coverage analysis:

Files needing tests:
1. src/auth/login.ts (0% coverage)
   → /test-plugin:test-generator src/auth/login.ts

2. src/utils/parser.ts (0% coverage)
   → /test-plugin:test-generator src/utils/parser.ts

3. src/api/user-service.ts (partial coverage)
   → /test-plugin:test-generator src/api/user-service.ts

Priority: Start with #1 (critical authentication logic)
```

## Example Test Generation

### Input file (src/math.ts):
```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
```

### Generated test file (src/math.test.ts):
```typescript
import { describe, it, expect } from 'vitest';
import { add, divide } from './math';

describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should add negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});

describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('should throw error on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('should handle decimal results', () => {
    expect(divide(5, 2)).toBe(2.5);
  });
});
```

## Error Handling

- **File not found:** "Could not read [file-path]. Please provide a valid source file path."
- **Unsupported language:** "Test generation for [language] is not yet supported. Supported: JavaScript, TypeScript, Python, Go, Java."
- **No testable code:** "No testable functions or methods found in [file-path]."
- **Test file already exists:** "Test file [test-path] already exists. Overwrite? (yes/no)"

## Implementation Notes

- Analyze existing test files in the project to match style and conventions
- Respect .gitignore and don't test generated/vendor code
- Consider async/await patterns in JavaScript/TypeScript
- Include type assertions for TypeScript
- Generate parametrized tests when appropriate (pytest.mark.parametrize, test.each)
- Add TODOs for complex scenarios that need manual implementation
