
export default {
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
    title: 'Tokopolis',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap' }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '~assets/scss/piqo.scss',
    'swiper/css/swiper.min.css'
  ],

  /*
  ** Disable bootstrap vue from importing Bootstrap compiled CSS
  */
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: true
  },

  router: {
    middleware: 'routing'
  },

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/mixins-global-function.js',
    '~/plugins/bootstrap-vue.js',
    '~/plugins/vee-validate.js',
    '~/plugins/persistedState.client.js',
    { mode: 'client', src: '~/plugins/axios' },
    { mode: 'client', src: '~/plugins/vue-awesome-swiper.js' },
    { mode: 'client', src:'~/plugins/avatar.js', ssr: false },
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
    // Doc: https://github.com/nuxt-community/eslint-module
    [
      '@nuxtjs/eslint-module', {
        fix: true
      }
    ]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
    'bootstrap-vue/nuxt',
    'nuxt-session',
    'nuxt-fontawesome',
  ],

  fontawesome: {
    component: 'fa',
    imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['fab']
        },

    ],
  },

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
    transpile: [
      "vee-validate/dist/rules",
      'vue-image-crop-upload'
    ],
    extend(config, ctx) {
      // You can extend webpack config here
      config.resolve.alias.vue$ = "vue/dist/vue.esm.js";

      // rule for vue-svg-loader
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        use: ['babel-loader', 'vue-svg-loader'],
      });
    },
  },

  axios: {
    proxy: true
  },

  proxy: {
    '/api/': process.env.API_SERVER_URL
  },

  publicRuntimeConfig: {
    baseAPI: process.env.API_SERVER_URL
  },

  dayjs: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    defaultTimeZone: 'Asia/Jakarta',
    plugins: [
      'utc',
      'timezone'
    ]
  }
}

