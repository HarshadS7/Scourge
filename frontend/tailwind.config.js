/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bauhaus: {
          red:    '#D62828',
          yellow: '#F7B731',
          blue:   '#1A3AFF',
          black:  '#0D0D0D',
          white:  '#F4F1EC',
          gray:   '#E0DDD5',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-ibm-mono)', 'ui-monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      gridTemplateColumns: {
        'bauhaus': 'repeat(12, minmax(0, 1fr))',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'bauhaus': '4px 4px 0px 0px #0D0D0D',
        'bauhaus-lg': '6px 6px 0px 0px #0D0D0D',
        'bauhaus-red': '4px 4px 0px 0px #D62828',
        'bauhaus-blue': '4px 4px 0px 0px #1A3AFF',
        'bauhaus-yellow': '4px 4px 0px 0px #F7B731',
      },
    },
  },
  plugins: [],
};
