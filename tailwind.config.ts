import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-down": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
      },
      animation: {
        "slide-in-down": "slide-in-down 0.5s ease-out",
        "slide-out-down": "slide-out-down 0.5s ease-out",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {

        'xs-400': '400px',
        'md': '800px',
        'sm-640': '640px',
        'sm-700': '700px',
        'md-850': '850px',
        'md-1000': '1000px',
        'lg-1550': '1550px'

      },
      colors: {
        "btn-color": "#FB3463",
        "kakao-btn": "#FFE617",
        "naver-btn": "#03C75A",
        "google-btn": "#CFCFCF",
        "custom-pink": "#FB3463",
      },
      // keyframes: {
      //   fall: {
      //     "0%": { opacity: "0" },
      //     "3%, 90%": { opacity: "0.9" },
      //     "100%": {
      //       transform: "translateY(97%)",
      //       opacity: "0",
      //     },
      //   },
      //   slideInout: {
      //     "0%": { transform: "translateX(-100%) translateY(0%)" },
      //     "25%": { transform: "translateX(0%) translateY(-10px)" }, // 왼쪽 끝에서 조금 위로
      //     "50%": { transform: "translateX(100vw) translateY(10px)" }, // 오른쪽 끝으로 이동하면서 아래로
      //     "75%": { transform: "translateX(0%) translateY(5px)" }, // 다시 돌아오면서 위로
      //     "100%": { transform: "translateX(-100%) translateY(0%)" }, // 원래 자리로 돌아오면서 약간 위로
      //   },
      // },
      // animation: {
      //   fall: "fall 3.5s linear infinite",
      //   slideInout: "slideInout 5s linear infinite",
      // },

      fontFamily: {
        akira: ["Akira Expanded", "sans-serif"], // 기본 폰트를 지정합니다.
      },
    },
  },
  plugins: [
    // Tailwind plugins
    require("tailwindcss"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};
export default config;
