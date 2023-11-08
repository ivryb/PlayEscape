/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './node_modules/flowbite/**/*.js',
  ],

  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1.5rem',
    },
  },

  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('daisyui'),
  ],

  // daisyui: {
  //   themes: true,
  //   base: true,
  //   styled: true,
  //   utils: true,
  // },
};
