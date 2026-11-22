import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#101216',
        },
        surface: {
          DEFAULT: '#191D24',
          elevated: '#202630',
        },
        border: {
          DEFAULT: '#2A303A',
        },
        text: {
          primary: '#F3F4F2',
          secondary: '#A7ADB7',
          muted: '#7D8591',
        },
        accent: {
          DEFAULT: '#A5C96B',
          strong: '#B9D987',
        },
        status: {
          success: '#8CCB9A',
          warning: '#E5B86B',
          danger: '#E18A8A',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
