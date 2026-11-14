import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          terracotta: '#D9744A',
          'terracotta-dark': '#C25F37',
          'terracotta-tint': '#FBE8DF',
          dark: '#2B2B2B',
          charcoal: '#121212',
          muted: '#6B6B6B',
          subtle: '#737373',
          placeholder: '#8C8C8C',
          disabled: '#B5B5B5',
          tile: '#F0F0F0',
          'bg-light': '#F5F5F5',
          border: '#EBEBEB',
          'border-dark': '#E2E2E2',
        },
        status: {
          green: '#2A6E37',
          'green-tint': '#DDF1E5',
          blue: '#3F5FA0',
          'blue-tint': '#E4ECFB',
          red: '#C0392B',
          'red-tint': '#FDE3E8',
          amber: '#8A5A00',
          'amber-tint': '#FFF1C7',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'figma-card': '0px 2px 8px 0px rgba(74, 42, 28, 0.06), 0px 8px 24px 0px rgba(74, 42, 28, 0.06)',
        'figma-hover': '0px 4px 12px 0px rgba(74, 42, 28, 0.08), 0px 16px 32px 0px rgba(74, 42, 28, 0.10)',
        'figma-modal': '0px 8px 24px 0px rgba(74, 42, 28, 0.10), 0px 24px 64px 0px rgba(74, 42, 28, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;

