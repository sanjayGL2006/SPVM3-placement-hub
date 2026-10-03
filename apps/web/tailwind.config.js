/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Indigo-500
          600: '#4F46E5', // Indigo-600
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF',
        },
        secondary: {
          500: '#F59E0B',
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        success: {
          500: '#10B981',
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        danger: {
          500: '#EF4444',
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        info: {
          500: '#3B82F6',
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        neutral: {
          900: '#1C1C1C',
          950: '#0F0F0F',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'pinterest': '0 1px 3px rgba(0,0,0,0.05)',
        'pinterest-hover': '0 8px 30px rgba(0,0,0,0.08)',
        'pinterest-dark': '0 1px 3px rgba(0,0,0,0.2)',
        'pinterest-dark-hover': '0 8px 30px rgba(0,0,0,0.4)',
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
