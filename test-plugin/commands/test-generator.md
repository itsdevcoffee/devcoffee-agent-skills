---
name: test-generator
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
---

# Generate Unit Tests

This command generates comprehensive unit tests for your code using AI-powered analysis.

## Usage

```bash
# Generate tests for a specific file
/test-plugin:test-generator src/auth/login.ts

# Analyze project and suggest what needs testing
/test-plugin:test-generator
```

## What it does

1. **Analyzes your code** to understand functions, classes, and logic
2. **Detects the testing framework** from your project configuration
3. **Generates comprehensive tests** covering:
   - Happy path scenarios
   - Error conditions
   - Edge cases
   - Proper mocking of dependencies
4. **Creates test files** following your project's conventions

## Supported Languages

- JavaScript/TypeScript (Jest, Vitest, Mocha, node:test)
- Python (pytest, unittest)
- Go (testing package)
- Java (JUnit)

## Test Quality

Generated tests follow industry best practices:
- Arrange-Act-Assert pattern
- Descriptive test names
- Isolated test cases
- Comprehensive coverage (80%+ target)
- Proper mocking and setup/teardown

## Next Steps

After generating tests:
1. Review the generated test file
2. Run tests: `npm test` (or equivalent)
3. Check coverage: `npm run test:coverage`
4. Adjust mocks or add custom test cases as needed

**Arguments received:** $ARGUMENTS
