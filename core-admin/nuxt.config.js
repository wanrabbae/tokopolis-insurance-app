export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/docs/configuration-glossary/configuration-ssr
  */
  ssr: false,
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Tokopolis Admin Panel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/scss/app.scss'
  ],

  router: {
    middleware: 'routing'
  },
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/mixins-global-function.js',
    '~/plugins/global-function.js',
    '~/plugins/axios',
    "~/plugins/vue-lightbox.js",
    { mode: 'client', src: '~/plugins/ckeditor.js' },
    { mode: 'client', src: '~/plugins/simplebar.js' },
    { mode: 'client', src: '~/plugins/vuelidate.js' },
    { mode: 'client', src: '~/plugins/vue-switches.js' },
    { mode: 'client', src: '~/plugins/vue-number-input-spinner.js' },
    { mode: 'client', src: '~/plugins/vue-mask.js' },
    { mode: 'client', src: '~/plugins/vue2-dropzone.js' }
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/ngrok',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    '@nuxtjs/axios',
    'nuxt-session',
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
  ],

  fontawesome: {},
  /*
  ** Server Middleware
  */
  serverMiddleware: {
    '/api': '../api'
  },

  srcDir: 'view/',

  /*
  ** For deployment you might want to edit host and port
  */
  server: {
   port: process.env.NUXT_PORT || 3000, // default: 3000
   host: '0.0.0.0' // default: localhost
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: [],
    extend(config, ctx) {
      config.resolve.alias.vue$ = "vue/dist/vue.esm.js";
    }
  },

  axios: {
    proxy: true
  },

  ngrok: {
    authtoken: process.env.NGROK_AUTHTOKEN
  }
}
