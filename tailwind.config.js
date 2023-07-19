/** @type {import('tailwindcss').Config} */
module.exports = {
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
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        linkmate: {
          primary: "#0c4c4c",
          secondary: "#93d2d2",
          accent: "#fed7aa",
          neutral: "#c4dfdf",
          "base-100": "#e3f4f4",
          info: "#8ccac1",
          success: "#9cb686",
          warning: "#ffd261",
          error: "#f43f5e",
        },
      },
    ],
  },
};
