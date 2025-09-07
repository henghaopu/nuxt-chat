// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/mdc', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // api secrets
    openaiApiKey: '<NUXT_DEFAULT_OPENAI_API_KEY>',
    // urls
    // db connection
    // auth provider
  },
  mdc: {
    highlight: {
      theme: 'dark-plus',
      langs: ['js', 'ts', 'vue', 'json', 'css', 'html', 'bash', 'markdown'],
    },
  },
})
