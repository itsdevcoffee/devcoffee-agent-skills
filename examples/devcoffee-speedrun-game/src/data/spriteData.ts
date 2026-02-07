// Sprite animation definitions

export interface AnimationConfig {
  frames: number;
  frameRate: number; // Ticks per frame
}

export interface SpriteAnimations {
  [key: string]: AnimationConfig;
}

// Buzzminson character animations
export const buzzminson: SpriteAnimations = {
  walk: { frames: 4, frameRate: 6 }, // 4 frames, 6 ticks per frame
  jump: { frames: 3, frameRate: 7 },
  idle: { frames: 2, frameRate: 15 },
  attack: { frames: 3, frameRate: 5 },
};

// Maximus ship animations
export const maximus: SpriteAnimations = {
  idle: { frames: 2, frameRate: 10 },
  shoot: { frames: 2, frameRate: 4 },
  power: { frames: 3, frameRate: 6 },
};

// Enemy animations
export const codeSmell: SpriteAnimations = {
  walk: { frames: 2, frameRate: 12 },
  defeated: { frames: 4, frameRate: 5 },
};

export const bug: SpriteAnimations = {
  fly: { frames: 2, frameRate: 8 },
  explode: { frames: 5, frameRate: 4 },
};

export const boss: SpriteAnimations = {
  idle: { frames: 2, frameRate: 20 },
  attack: { frames: 4, frameRate: 6 },
  hurt: { frames: 2, frameRate: 4 },
  defeated: { frames: 6, frameRate: 5 },
};

// Collectible animations
export const collectible: SpriteAnimations = {
  bob: { frames: 2, frameRate: 15 },
  collect: { frames: 5, frameRate: 3 },
};

// UI animations
export const ui: SpriteAnimations = {
  blink: { frames: 2, frameRate: 30 },
  pulse: { frames: 4, frameRate: 8 },
};

// Helper function to get current animation frame
export function getCurrentFrame(
  localFrame: number,
  animation: AnimationConfig
): number {
  const totalTicks = animation.frames * animation.frameRate;
  const currentTick = localFrame % totalTicks;
  return Math.floor(currentTick / animation.frameRate);
}
