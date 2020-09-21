let development = process.env.NODE_ENV !== 'production';
export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'California Fire Watch' || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
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
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/moment',
    '@nuxtjs/fontawesome',
  ],
  fontawesome: {
    icons: {
      solid: ['faFire', 'faTree', 'faMapMarkerAlt', 'faFireExtinguisher', 'faCalendarAlt']
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
  ],
  pwa:{
    icon:{
      source: '/static/icon-color.png',
      fileName: 'icon-color.png'
    },
    manifest:{
      name: 'Fire Watch',
      background_color: '#9B2C2C',
      theme_color: '#9B2C2C'
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
     proxy: true,
  },
  proxy: {
    '/api/': {
      target: 'https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=false',
      pathRewrite: {
        '^/api/': ''
      },
      changeOrigin: true  }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    //analyze: !development
  }
}
