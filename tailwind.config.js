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
        "event-color": "#FDC9C9",
        "active-color": "#FFC700",
        "normal-button-color": "#B2B2B2",
        "category-color": "#CA283F",
        "active-button-color": "#F86E67!important",
        "navigation-button-bg-color": "#FFD0D0",
        "navigation-text-color": "#F04239",
        "product-title-color": "#2E112F",
        "cart-button-color": "#F1433A",
        "border-color": "#e8e8e8",
        "product-image-container-color": "#C4C4C4",
        "cart-background-color": "#f5f5f5",
      },
      fontFamily: {
        Kulim_Park_Bold: ["Kulim_Park_Bold"],
        Kulim_Park_Normal: ["Kulim_Park_Normal"],
        Harlow_Solid_Italic: ["Harlow_Solid_Italic"],
        Haettenschweiler: ["Haettenschweiler"],
      },
      width: {
        "pagination-button-width": "50px",
      },

      height: {
        "pagination-button-height": "50px",
        "product-image-container-height": "660px",
        "product-image-height": "500px",
      },

      border: {
        "border-1": "1px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
