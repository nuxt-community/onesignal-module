module.exports = {
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    '@nuxtjs/pwa',
    '../../src/module.ts'
  ],
  oneSignal: {
    init: {
      appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
    }
  }
}
