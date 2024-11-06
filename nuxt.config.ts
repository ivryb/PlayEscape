// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: "2024-11-02",
  vue: {
    propsDestructure: true,
  },

  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],

  css: ["~/assets/css/tailwind.css"],

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
