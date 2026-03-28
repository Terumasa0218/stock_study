import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0a0f1e',
        bgSecondary: '#111827',
        accentCyan: '#06b6d4',
        accentBlue: '#3b82f6',
        signalBuy: '#10b981',
        signalSell: '#ef4444',
        signalNeutral: '#6b7280'
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        mono: ['"Source Code Pro"', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
