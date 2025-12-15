import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Orange Colors
        primary: {
          DEFAULT: '#FF6B35',
          hover: '#E55A24',
          active: '#D84315',
          light: '#FFE4D1',
        },
        // Neutral Colors
        neutral: {
          white: '#FFFFFF',
          'light-gray': '#F5F5F5',
          'medium-gray': '#A9A9A9',
          'dark-gray': '#333333',
          black: '#000000',
        },
        // Semantic Colors
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['12px', { lineHeight: '18px' }],
        base: ['14px', { lineHeight: '22px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['18px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['36px', { lineHeight: '44px' }],
        '4xl': ['48px', { lineHeight: '58px' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '96px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        sm: '0px 1px 3px rgba(0, 0, 0, 0.06)',
        md: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0px 10px 24px rgba(0, 0, 0, 0.12)',
        'primary': '0px 4px 12px rgba(255, 107, 53, 0.2)',
      },
      zIndex: {
        dropdown: '100',
        modal: '1000',
        tooltip: '1100',
        notification: '1200',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode (disabled by default, ready for future)
}
export default config
