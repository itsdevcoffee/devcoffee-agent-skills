// Game data for all levels - platforms, enemies, collectibles, layouts

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  type: 'question' | 'code' | 'powerup';
  value: number;
  collectFrame?: number; // Frame when collected
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  type: 'smell' | 'bug' | 'boss';
  hp: number;
  patrolStart?: number;
  patrolEnd?: number;
  defeatedFrame?: number;
}

export interface LevelData {
  platforms: Platform[];
  collectibles: Collectible[];
  enemies?: Enemy[];
  playerStart: { x: number; y: number };
  exitX: number;
}

// Level 1: Clarify Zone - Collect question marks
export const level1Data: LevelData = {
  platforms: [
    { x: 0, y: 900, width: 400, height: 100 }, // Ground
    { x: 500, y: 800, width: 200, height: 100 }, // Platform 1
    { x: 800, y: 700, width: 200, height: 100 }, // Platform 2
    { x: 1100, y: 800, width: 200, height: 100 }, // Platform 3
    { x: 1400, y: 900, width: 300, height: 100 }, // Exit platform
  ],
  collectibles: [
    { id: 1, x: 250, y: 700, type: 'question', value: 100 },
    { id: 2, x: 600, y: 650, type: 'question', value: 100 },
    { id: 3, x: 900, y: 550, type: 'question', value: 100 },
    { id: 4, x: 1200, y: 650, type: 'question', value: 100 },
    { id: 5, x: 1500, y: 750, type: 'question', value: 100 },
  ],
  playerStart: { x: 50, y: 800 },
  exitX: 1600,
};

// Level 2: Implementation Castle - Build platforms
export const level2Data: LevelData = {
  platforms: [
    { x: 0, y: 900, width: 300, height: 100 }, // Start ground
    { x: 1400, y: 900, width: 300, height: 100 }, // Exit ground
    // Platforms built dynamically during level
  ],
  collectibles: [
    { id: 1, x: 400, y: 750, type: 'code', value: 150 }, // Triggers platform 1
    { id: 2, x: 700, y: 650, type: 'code', value: 150 }, // Triggers platform 2
    { id: 3, x: 1000, y: 750, type: 'code', value: 150 }, // Triggers platform 3
    { id: 4, x: 1300, y: 800, type: 'code', value: 150 }, // Triggers platform 4
  ],
  playerStart: { x: 50, y: 800 },
  exitX: 1600,
};

// Dynamic platforms for Level 2 (appear when collectibles picked up)
export const level2DynamicPlatforms: Platform[] = [
  { x: 350, y: 800, width: 150, height: 80 }, // Platform 1
  { x: 650, y: 700, width: 150, height: 80 }, // Platform 2
  { x: 950, y: 800, width: 150, height: 80 }, // Platform 3
  { x: 1250, y: 850, width: 150, height: 80 }, // Platform 4
];

// Level 3: Review Arena - Combat with code smells
export const level3Data: LevelData = {
  platforms: [
    { x: 0, y: 900, width: 1920, height: 100 }, // Arena floor
    { x: 400, y: 700, width: 200, height: 80 }, // Left platform
    { x: 1320, y: 700, width: 200, height: 80 }, // Right platform
    { x: 860, y: 600, width: 200, height: 80 }, // Center platform
  ],
  collectibles: [],
  enemies: [
    { id: 1, x: 300, y: 800, type: 'smell', hp: 1, patrolStart: 200, patrolEnd: 500 },
    { id: 2, x: 800, y: 800, type: 'smell', hp: 1, patrolStart: 700, patrolEnd: 1000 },
    { id: 3, x: 1200, y: 800, type: 'smell', hp: 1, patrolStart: 1100, patrolEnd: 1400 },
    { id: 4, x: 1600, y: 800, type: 'smell', hp: 1, patrolStart: 1500, patrolEnd: 1700 },
  ],
  playerStart: { x: 50, y: 800 },
  exitX: 1850,
};

// Level 4: Boss Handoff - Boss battle
export const level4Data: LevelData = {
  platforms: [
    { x: 0, y: 900, width: 1920, height: 100 }, // Boss arena floor
    { x: 300, y: 750, width: 150, height: 60 }, // Left platform
    { x: 1470, y: 750, width: 150, height: 60 }, // Right platform
    { x: 860, y: 650, width: 200, height: 60 }, // Center platform
  ],
  collectibles: [],
  enemies: [
    { id: 1, x: 960, y: 500, type: 'boss', hp: 3 }, // Monolith Boss
  ],
  playerStart: { x: 50, y: 800 },
  exitX: 1850,
};

// Maximus shooter data
export interface WaveData {
  startFrame: number;
  enemies: Array<{
    id: number;
    spawnX: number;
    spawnY: number;
    pattern: 'straight' | 'zigzag' | 'circle';
    hp: number;
  }>;
}

export const maximusWaves: WaveData[] = [
  // Phase 1: Bug Shooting (frames 750-900)
  {
    startFrame: 0,
    enemies: [
      { id: 1, spawnX: 400, spawnY: -50, pattern: 'straight', hp: 1 },
      { id: 2, spawnX: 800, spawnY: -50, pattern: 'zigzag', hp: 1 },
      { id: 3, spawnX: 1200, spawnY: -50, pattern: 'straight', hp: 1 },
      { id: 4, spawnX: 1600, spawnY: -50, pattern: 'zigzag', hp: 1 },
    ],
  },
  {
    startFrame: 40,
    enemies: [
      { id: 5, spawnX: 600, spawnY: -50, pattern: 'circle', hp: 1 },
      { id: 6, spawnX: 1000, spawnY: -50, pattern: 'straight', hp: 1 },
      { id: 7, spawnX: 1400, spawnY: -50, pattern: 'circle', hp: 1 },
    ],
  },
  {
    startFrame: 80,
    enemies: [
      { id: 8, spawnX: 960, spawnY: -50, pattern: 'zigzag', hp: 1 },
    ],
  },
];

// Complexity barriers for Phase 2 (frames 900-1050)
export const complexityBarriers = [
  { id: 1, x: 300, y: 400, width: 100, height: 200, hp: 3 },
  { id: 2, x: 800, y: 300, width: 100, height: 300, hp: 3 },
  { id: 3, x: 1300, y: 400, width: 100, height: 200, hp: 3 },
];

// Power-ups for Phase 2
export const powerUps = [
  { id: 1, x: 400, y: 600, type: 'simplify', appearFrame: 30 },
  { id: 2, x: 900, y: 500, type: 'simplify', appearFrame: 60 },
  { id: 3, x: 1400, y: 600, type: 'simplify', appearFrame: 90 },
];

// Boss bug for Phase 3 (frames 1050-1200)
export const bossBugData = {
  x: 960,
  y: 200,
  hp: 10,
  phases: [
    { hpThreshold: 7, pattern: 'straight' },
    { hpThreshold: 4, pattern: 'circle' },
    { hpThreshold: 0, pattern: 'zigzag' },
  ],
};
