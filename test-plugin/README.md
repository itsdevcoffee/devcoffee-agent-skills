# test-plugin

AI-powered unit test generation for Claude Code.

## Overview

`test-plugin` automatically generates comprehensive unit tests for your code using AI analysis. It detects your testing framework, analyzes your code structure, and creates well-structured tests following industry best practices.

## Features

- **Multi-language support:** JavaScript, TypeScript, Python, Go, Java
- **Framework detection:** Automatically detects Jest, Vitest, pytest, testing, JUnit, etc.
- **Comprehensive coverage:** Generates tests for happy paths, edge cases, and error conditions
- **Smart mocking:** Automatically identifies and mocks external dependencies
- **Best practices:** Follows Arrange-Act-Assert pattern with descriptive names

## Installation

```bash
claude plugin install test-plugin@devcoffee-marketplace
```

## Usage

### Generate tests for a specific file

```bash
/test-plugin:test-generator src/utils/calculator.ts
```

This will:
1. Analyze the source file
2. Detect your testing framework
3. Generate a comprehensive test file
4. Save it in the appropriate location

### Get test coverage suggestions

```bash
/test-plugin:test-generator
```

Without arguments, the plugin analyzes your project and suggests which files need tests.

## Examples

### Input: `src/math.ts`

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
```

### Generated: `src/math.test.ts`

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

  it('should throw error on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('should handle decimal results', () => {
    expect(divide(5, 2)).toBe(2.5);
  });
});
```

## Supported Testing Frameworks

| Language | Frameworks |
|----------|------------|
| JavaScript/TypeScript | Jest, Vitest, Mocha, node:test |
| Python | pytest, unittest, nose |
| Go | testing |
| Java | JUnit |

## Test Quality Standards

All generated tests follow:
- **Arrange-Act-Assert (AAA)** pattern
- **Single responsibility** - one behavior per test
- **Descriptive names** - clear test intentions
- **Isolation** - no test dependencies
- **Proper mocking** - external dependencies mocked
- **80%+ coverage** target

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](LICENSE) for details.

## Support

- Issues: https://github.com/itsdevcoffee/devcoffee-agent-skills/issues
- Discussions: https://github.com/itsdevcoffee/devcoffee-agent-skills/discussions
