module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'

  theme: {
    extend: {
      colors: {
        "white-rgba": "rgba(255,255,255,0.9)",
        "EEE-color": "#EEE",
        "primary-color": "#FF8787",
        "price-color": "#A90000",
      },
    },

    fontFamily: {
      Kulim_Park_Bold: ["Kulim_Park_Bold"],
      Kulim_Park_Normal: ["Kulim_Park_Normal"],
      Harlow_Solid_Italic: ["Harlow_Solid_Italic"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
