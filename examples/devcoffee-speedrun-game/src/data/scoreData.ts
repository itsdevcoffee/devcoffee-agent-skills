// Score values, combo multipliers, and point calculations

export const SCORE_VALUES = {
  // Collectibles
  question: 100,
  code: 150,
  powerup: 200,

  // Enemies
  smell: 250,
  bug: 150,
  boss: 1000,
  bossBug: 5000,

  // Bonuses
  levelComplete: 500,
  noHit: 1000,
  timeBonus: 50, // Per remaining second
  combo2x: 100,
  combo3x: 300,
  combo4x: 600,
};

export const COMBO_MULTIPLIERS = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
  4: 3.0,
  5: 5.0,
};

export const COMBO_TIMEOUT_FRAMES = 90; // 3 seconds at 30fps

export interface ScoreEvent {
  frame: number;
  type: keyof typeof SCORE_VALUES;
  baseValue: number;
  multiplier: number;
  total: number;
}

export class ScoreTracker {
  private score = 0;
  private combo = 0;
  private lastEventFrame = 0;
  private events: ScoreEvent[] = [];

  addPoints(frame: number, type: keyof typeof SCORE_VALUES): number {
    // Check if combo expired
    if (frame - this.lastEventFrame > COMBO_TIMEOUT_FRAMES) {
      this.combo = 0;
    }

    // Increment combo
    this.combo = Math.min(this.combo + 1, 5);

    const baseValue = SCORE_VALUES[type];
    const multiplier = COMBO_MULTIPLIERS[this.combo as keyof typeof COMBO_MULTIPLIERS] || 1.0;
    const total = Math.floor(baseValue * multiplier);

    this.score += total;
    this.lastEventFrame = frame;

    this.events.push({
      frame,
      type,
      baseValue,
      multiplier,
      total,
    });

    return total;
  }

  getScore(): number {
    return this.score;
  }

  getCombo(): number {
    return this.combo;
  }

  getEvents(): ScoreEvent[] {
    return this.events;
  }

  resetCombo(): void {
    this.combo = 0;
  }
}

// Pre-calculated final scores for victory screen
export const FINAL_SCORES = {
  buzzminsonLevels: 2500,
  maximusPhases: 3000,
  comboBonus: 1800,
  noHitBonus: 1000,
  timeBonus: 700,
  total: 9000,
};
