
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  daisyui: {
    themes: [ "light", "dark", "cupcake" ], // TODO: custom themes
  },
  plugins: [
    require('daisyui')
  ]
}
