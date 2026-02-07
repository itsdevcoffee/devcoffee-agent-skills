/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          // Primary character colors
          'buzzminson-primary': '#9370DB',
          'buzzminson-secondary': '#6A5ACD',
          'buzzminson-highlight': '#DDA0DD',
          'maximus-primary': '#4169E1',
          'maximus-secondary': '#1E90FF',
          'maximus-highlight': '#87CEEB',

          // UI colors
          'red': '#DC143C',
          'yellow': '#FFD700',
          'green': '#32CD32',
          'cyan': '#00CED1',
          'orange': '#FF8C00',
          'white': '#F0F0F0',
          'black': '#0A0A0A',

          // Enemies
          'smell': '#8B4513',
          'bug': '#DC143C',
          'boss': '#2F4F4F',
          'boss-bug': '#8B0000',

          // Collectibles
          'question': '#FFD700',
          'code': '#00CED1',
          'powerup': '#FF1493',

          // Environment
          'sky': '#191970',
          'ground': '#556B2F',
          'platform': '#8B7355',
          'wall': '#696969',

          // Effects
          'particle': '#FFD700',
          'explosion': '#FF4500',
          'glow': '#00FF00',
        },
      },
      fontFamily: {
        pixel: ['Monaco', 'Menlo', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
