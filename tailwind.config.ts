import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wired to the CSS variables in app/globals.css so `primary` follows
        // the active theme. The channel form keeps opacity modifiers working
        // (`bg-primary/10`, `ring-primary/30`, …).
        primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
        'primary-dark': 'var(--primary-dark)',
        'on-primary': 'var(--on-primary)',
        navy: { 900: '#0f172a', 950: '#020617' },
        // Semantic status colours. Light/dark values live on the tokens, so a
        // single class reads correctly in both themes.
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        'on-danger': 'var(--on-danger)',
        info: 'var(--info)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '300',
        medium: '400',
        semibold: '500',
        bold: '600',
        extrabold: '700',
        black: '800',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
};
export default config;
