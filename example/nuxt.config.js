import onesignalModule from '..'

export default {
  modules: [
    onesignalModule,
    '@nuxtjs/pwa'
  ],

  oneSignal: {
    init: {
      appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
    }
  }
}
