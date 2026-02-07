// SNES/Genesis era color palette

export const RETRO_COLORS = {
  // Primary character colors
  buzzminson: {
    primary: '#9370DB', // Purple
    secondary: '#6A5ACD', // Slate blue
    highlight: '#DDA0DD', // Plum
  },
  maximus: {
    primary: '#4169E1', // Royal blue
    secondary: '#1E90FF', // Dodger blue
    highlight: '#87CEEB', // Sky blue
  },

  // UI colors
  ui: {
    red: '#DC143C', // Crimson
    yellow: '#FFD700', // Gold
    green: '#32CD32', // Lime green
    cyan: '#00CED1', // Dark turquoise
    orange: '#FF8C00', // Dark orange
    white: '#F0F0F0', // Off-white
    black: '#0A0A0A', // Near-black
  },

  // Enemies
  enemies: {
    smell: '#8B4513', // Saddle brown
    bug: '#DC143C', // Crimson
    boss: '#2F4F4F', // Dark slate gray
    bossBug: '#8B0000', // Dark red
  },

  // Collectibles
  collectibles: {
    question: '#FFD700', // Gold
    code: '#00CED1', // Dark turquoise
    powerup: '#FF1493', // Deep pink
  },

  // Environment
  environment: {
    sky: '#191970', // Midnight blue
    ground: '#556B2F', // Dark olive green
    platform: '#8B7355', // Burlywood
    wall: '#696969', // Dim gray
  },

  // Effects
  effects: {
    particle: '#FFD700', // Gold
    explosion: '#FF4500', // Orange red
    glow: '#00FF00', // Lime
    shadow: '#000000', // Black
  },
};

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Helper for glow effect
export function getGlowStyle(color: string, intensity: number = 10): string {
  return `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
}
