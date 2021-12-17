module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'

  theme: {
    extend: {},
    fontFamily: {
      Kulim_Park_Bold: ["Kulim_Park_Bold"],
      Kulim_Park_Normal: ["Kulim_Park_Normal"],
      Harlow_Solid_Italic: ["Harlow_Solid_Italic"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
