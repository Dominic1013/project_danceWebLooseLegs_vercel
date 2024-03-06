/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 自定義顏色名稱和 HEX 值
        "allWhite-color": "#ffffff",
        "subWhite-color": "#EDF2F4",
        "allBlack-color": "#18282F",
        "bgBlack-color": "#2B2D42",
        "textGray-color": "#8D99AE",
        "primaryBrown-color": "#BA5A31",
        "secondaryBrown-color": "#D4A693",
      },
      fontFamily: {
        signika: ["Signika", "sans-serif"], // 全局字體
        kaushan: ["Kaushan Script", "sans-serif"], // 特定用途字體
        montserrat: ["Montserrat", "sans-serif"], // 特定用途字體
        // 'poppins': ['Poppins', 'sans-serif'], // 特定用途字體
      },
    },
  },
  plugins: [
    // require("@tailwindcss/line-clamp"),
    // ...
  ],
};
