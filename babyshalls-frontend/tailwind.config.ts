import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBF5',
          100: '#FFF6EA',
          200: '#F9E0C8',
        },
        line: {
          100: '#F2E4D6',
          200: '#E6D2C0',
        },
        brick: {
          100: '#FBE6D8',
          300: '#EFA27A',
          500: '#C86830',
          600: '#B05A26',
          700: '#8E431A',
        },
        brown: {
          300: '#C9B3A5',
          400: '#9A552A',
          600: '#7A5644',
          900: '#4A2A1C',
        },
        pink: {
          100: '#FDE3E8',
          300: '#FBA6B2',
          500: '#F35766',
          700: '#B83246',
        },
        sunny: {
          100: '#FFF1C7',
          400: '#F7C94B',
          600: '#D89F29',
          800: '#8A5A00',
        },
        mint: {
          100: '#DDF1E5',
          400: '#82BC85',
          700: '#2A6E37',
        },
        teal: {
          100: '#DDF6F9',
          400: '#8DDBE6',
          700: '#1F6B76',
        },
        blue: {
          100: '#E4ECFB',
          400: '#92B2F3',
          600: '#5E82C0',
          700: '#3F5FA0',
        },
        lilac: {
          100: '#F3E6F2',
          400: '#BA7EB8',
          700: '#7E4A84',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        heading: ['var(--font-quicksand)', 'var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 2px 8px 0px rgba(74, 42, 28, 0.06), 0px 8px 24px 0px rgba(74, 42, 28, 0.06)',
        hover: '0px 4px 12px 0px rgba(74, 42, 28, 0.08), 0px 16px 32px 0px rgba(74, 42, 28, 0.10)',
        modal: '0px 8px 24px 0px rgba(74, 42, 28, 0.10), 0px 24px 64px 0px rgba(74, 42, 28, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
