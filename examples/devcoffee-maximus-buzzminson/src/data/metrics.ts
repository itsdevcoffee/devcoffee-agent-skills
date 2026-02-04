/**
 * Metrics data for visualizations throughout the video
 */

export interface MetricComparison {
  label: string;
  before: number;
  after: number;
  unit: string;
  improvement: number; // percentage
}

export const metricsComparison: MetricComparison[] = [
  {
    label: 'Bugs Found',
    before: 4,
    after: 0,
    unit: 'issues',
    improvement: 100,
  },
  {
    label: 'Lines of Code',
    before: 127,
    after: 89,
    unit: 'lines',
    improvement: 30,
  },
  {
    label: 'Complexity Score',
    before: 8,
    after: 2,
    unit: '/10',
    improvement: 75,
  },
  {
    label: 'Code Coverage',
    before: 45,
    after: 98,
    unit: '%',
    improvement: 118,
  },
];

export const valuePropositions = [
  'Build features faster',
  'Ship with confidence',
  'Zero manual reviews',
];

export const buzzminstonWorkflow = [
  {
    phase: 'Clarify',
    description: 'Ask questions first',
    icon: '❓',
    duration: 3,
  },
  {
    phase: 'Implement',
    description: 'Build it completely',
    icon: '🔨',
    duration: 3,
  },
  {
    phase: 'Review',
    description: 'Iterate until perfect',
    icon: '🔄',
    duration: 3,
  },
  {
    phase: 'Handoff',
    description: 'Pass to Maximus',
    icon: '🤝',
    duration: 3,
  },
];

export const maximusRounds = [
  {
    round: 1,
    issuesFound: 3,
    issuesFixed: 3,
    description: 'Initial scan',
  },
  {
    round: 2,
    issuesFound: 1,
    issuesFixed: 1,
    description: 'Edge cases',
  },
  {
    round: 3,
    issuesFound: 0,
    issuesFixed: 0,
    description: 'Clean scan',
  },
];
