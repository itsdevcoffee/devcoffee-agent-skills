/**
 * Real code snippets showing bugs and their fixes for the video
 */

export const beforeCode = `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();

  // Process user data
  const userData = {
    name: data.name,
    email: data.email,
    posts: data.posts.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content
    }))
  };

  return userData;
}`;

export const afterCode = `async function fetchUserData(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    const data = await response.json();

    return {
      name: data.name ?? 'Unknown',
      email: data.email ?? '',
      posts: data.posts?.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content
      })) ?? []
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}`;

export interface Issue {
  line: number;
  type: 'error' | 'warning' | 'security';
  message: string;
  icon: string;
}

export const issues: Issue[] = [
  {
    line: 1,
    type: 'error',
    message: 'Missing type annotations',
    icon: '🔴',
  },
  {
    line: 2,
    type: 'error',
    message: 'No error handling for network request',
    icon: '🔴',
  },
  {
    line: 7,
    type: 'error',
    message: 'Null/undefined not handled',
    icon: '🔴',
  },
  {
    line: 10,
    type: 'security',
    message: 'Potential memory leak in map',
    icon: '🔒',
  },
];

export const fixes = [
  {
    round: 1,
    issuesFound: 3,
    fixes: [
      'Added TypeScript types',
      'Added error handling',
      'Added null checks',
    ],
  },
  {
    round: 2,
    issuesFound: 1,
    fixes: ['Optimized array mapping'],
  },
  {
    round: 3,
    issuesFound: 0,
    fixes: [],
  },
];

export const simplificationMetrics = {
  before: {
    lines: 127,
    complexity: 8,
    issues: 4,
  },
  after: {
    lines: 89,
    complexity: 2,
    issues: 0,
  },
};

// Hidden issues for Act 1
export const hiddenIssues = [
  {
    icon: '💧',
    label: 'Memory Leak',
    description: 'Unclosed connections',
  },
  {
    icon: '⛓️‍💥',
    label: 'Missing Error Handling',
    description: 'No try-catch blocks',
  },
  {
    icon: '🔓',
    label: 'Security Vulnerability',
    description: 'Unvalidated input',
  },
  {
    icon: '🍝',
    label: 'Code Complexity',
    description: 'Nested logic 5 levels deep',
  },
];
