import React from 'react';

/**
 * VS Code Dark Theme color scheme for syntax highlighting
 */
const colors = {
  keyword: '#569CD6', // Blue
  string: '#CE9178', // Orange
  function: '#DCDCAA', // Yellow
  comment: '#6A9955', // Green
  number: '#B5CEA8', // Light green
  operator: '#D4D4D4', // White
  type: '#4EC9B0', // Cyan
  variable: '#9CDCFE', // Light blue
  default: '#D4D4D4', // Default white
};

/**
 * Keywords to highlight in blue
 */
const keywords = [
  'async',
  'await',
  'function',
  'const',
  'let',
  'var',
  'if',
  'else',
  'return',
  'try',
  'catch',
  'throw',
  'new',
  'import',
  'export',
  'default',
  'from',
  'as',
  'interface',
  'type',
  'class',
  'extends',
  'implements',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'null',
  'undefined',
  'true',
  'false',
];

/**
 * Built-in types to highlight in cyan
 */
const types = ['string', 'number', 'boolean', 'void', 'any', 'Error'];

/**
 * Tokenize a line of code and return highlighted JSX
 */
export const highlightCode = (line: string): React.ReactNode => {
  if (!line.trim()) {
    return <span>{line}</span>;
  }

  const tokens: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;

  // Match patterns in order of priority
  const patterns = [
    // Single-line comments
    {
      regex: /\/\/.*/g,
      color: colors.comment,
      type: 'comment',
    },
    // Multi-line comments (partial line)
    {
      regex: /\/\*[\s\S]*?\*\//g,
      color: colors.comment,
      type: 'comment',
    },
    // Template literals (backticks)
    {
      regex: /`[^`]*`/g,
      color: colors.string,
      type: 'string',
    },
    // Strings (double quotes)
    {
      regex: /"[^"]*"/g,
      color: colors.string,
      type: 'string',
    },
    // Strings (single quotes)
    {
      regex: /'[^']*'/g,
      color: colors.string,
      type: 'string',
    },
    // Numbers
    {
      regex: /\b\d+\.?\d*\b/g,
      color: colors.number,
      type: 'number',
    },
  ];

  // Find all matches for all patterns
  const allMatches: Array<{
    start: number;
    end: number;
    text: string;
    color: string;
    type: string;
  }> = [];

  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex);
    while ((match = regex.exec(line)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        color: pattern.color,
        type: pattern.type,
      });
    }
  });

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first)
  const validMatches = allMatches.filter((match, index) => {
    if (index === 0) return true;
    const prevMatch = allMatches[index - 1];
    return match.start >= prevMatch.end;
  });

  // Process the line, adding highlighted spans
  validMatches.forEach((match) => {
    // Add text before this match
    if (currentIndex < match.start) {
      const beforeText = line.substring(currentIndex, match.start);
      tokens.push(
        <React.Fragment key={key++}>
          {highlightPlainText(beforeText)}
        </React.Fragment>
      );
    }

    // Add the highlighted match
    tokens.push(
      <span key={key++} style={{color: match.color}}>
        {match.text}
      </span>
    );

    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < line.length) {
    const remainingText = line.substring(currentIndex);
    tokens.push(
      <React.Fragment key={key++}>
        {highlightPlainText(remainingText)}
      </React.Fragment>
    );
  }

  return <>{tokens}</>;
};

/**
 * Highlight plain text (non-string, non-comment parts)
 * This handles keywords, functions, types, etc.
 */
const highlightPlainText = (text: string): React.ReactNode => {
  const tokens: React.ReactNode[] = [];
  let key = 0;

  // Split by word boundaries
  const parts = text.split(/(\b\w+\b|[^\w\s]+|\s+)/g);

  parts.forEach((part) => {
    if (!part) return;

    // Check if it's a keyword
    if (keywords.includes(part)) {
      tokens.push(
        <span key={key++} style={{color: colors.keyword}}>
          {part}
        </span>
      );
      return;
    }

    // Check if it's a type
    if (types.includes(part)) {
      tokens.push(
        <span key={key++} style={{color: colors.type}}>
          {part}
        </span>
      );
      return;
    }

    // Check if it's a function call (followed by parenthesis)
    const nextCharIndex = parts.indexOf(part) + 1;
    const nextChar = parts[nextCharIndex];
    if (nextChar && nextChar.trim().startsWith('(')) {
      tokens.push(
        <span key={key++} style={{color: colors.function}}>
          {part}
        </span>
      );
      return;
    }

    // Check if it looks like a property access (after a dot)
    const prevCharIndex = parts.indexOf(part) - 1;
    const prevChar = parts[prevCharIndex];
    if (prevChar && prevChar.trim() === '.') {
      tokens.push(
        <span key={key++} style={{color: colors.variable}}>
          {part}
        </span>
      );
      return;
    }

    // Default color for operators and other text
    tokens.push(
      <span key={key++} style={{color: colors.default}}>
        {part}
      </span>
    );
  });

  return <>{tokens}</>;
};

/**
 * Highlight multiple lines of code
 */
export const highlightCodeBlock = (code: string): React.ReactNode[] => {
  const lines = code.split('\n');
  return lines.map((line, index) => (
    <div key={index}>{highlightCode(line)}</div>
  ));
};
