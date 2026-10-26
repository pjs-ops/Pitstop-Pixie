/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#FDFBF7',
          100: '#F7F0E8',
          200: '#EFE2D4',
          300: '#E2CDBC',
        },
        blush: {
          light: '#FCEEF3',
          DEFAULT: '#F3C8D8',
          dark: '#E297B1',
        },
        lavender: {
          light: '#F3F0FC',
          DEFAULT: '#DCD5F7',
          dark: '#B0A2E8',
        },
        racing: {
          light: '#F86B7C',
          DEFAULT: '#D94355',
          dark: '#B32435',
        },
        plum: {
          light: '#4E4455',
          DEFAULT: '#332C39',
          dark: '#211B26',
          deep: '#18131D',
        },
        sage: {
          light: '#EEF5EE',
          DEFAULT: '#D5E5D5',
          dark: '#A5C4A5',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'pixie': '0 8px 30px rgba(51, 44, 57, 0.06)',
        'pixie-hover': '0 14px 40px rgba(51, 44, 57, 0.12)',
        'pixie-glow': '0 0 25px rgba(243, 200, 216, 0.45)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
