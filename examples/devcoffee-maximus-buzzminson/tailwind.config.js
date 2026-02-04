/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        quality: {
          error: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
          info: '#3b82f6',
        },
        code: {
          background: '#1e1e1e',
          keyword: '#569cd6',
          string: '#ce9178',
          function: '#dcdcaa',
          comment: '#6a9955',
        },
      },
    },
  },
  plugins: [],
};
