import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    router: {
        base: '/'
      },
    modules: ['@nuxtjs/tailwindcss'],
    components: true,
})
