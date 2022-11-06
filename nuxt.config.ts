import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    target: 'static',
    router: {
        base: '/portfolio/'
      },
    modules: ['@nuxtjs/tailwindcss'],
    components: true,
})
