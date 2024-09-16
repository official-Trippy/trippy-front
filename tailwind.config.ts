import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'md': '800px',
        'sm-700': '700px',  
        'md-850': '850px',
        'md-1000': '1000px'
      },
      colors: {
        'btn-color': '#FB3463',
        'kakao-btn': '#FFE617',
        'naver-btn': '#03C75A',
        'google-btn': '#CFCFCF',
        'custom-pink': '#FB3463',
      },
      keyframes: {
        fall: {
          '0%': { opacity: '0' },
          '3%, 90%': { opacity: '0.9' },
          '100%': {
            transform: 'translateY(97%)',
            opacity: '0',
          },
        },
      },
      animation: {
        fall: 'fall 3.5s linear infinite',
      },
      fontFamily: {
        akira: ['Akira Expanded', 'sans-serif'], // 기본 폰트를 지정합니다.
      },
    },
  },
  plugins: [
    // Tailwind plugins
    require('tailwindcss'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
export default config;
