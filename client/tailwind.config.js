/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        brutal: '6px 6px 0px #111827',
        brutalSm: '4px 4px 0px #111827'
      },
      borderRadius: {
        brutal: '22px'
      },
      colors: {
        cream: '#FFF7ED',
        paper: '#FFFDF7',
        ink: '#111827',
        mint: '#86EFAC',
        skybubble: '#7DD3FC',
        butter: '#FDE68A',
        blush: '#FDA4AF'
      }
    }
  },
  plugins: []
};
