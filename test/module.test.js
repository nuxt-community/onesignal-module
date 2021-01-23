import { setupTest, expectModuleToBeCalledWith, createPage } from '@nuxt/test-utils'

describe('default configuration', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    config: {
      oneSignal: {
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })

  test('should inject plugin', () => {
    expectModuleToBeCalledWith('addPlugin', expect.objectContaining({
      fileName: 'onesignal.js'
    }))
  })
})

describe('spa configuration', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    config: {
      mode: 'spa',
      oneSignal: {
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })
})

describe('default one signal sdk', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    config: {
      mode: 'spa',
      oneSignal: {
        cdn: false,
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })
})

describe('define onesignal script into head section', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    config: {
      head: {
        script: [
          { hid: 'onesignal', name: 'One signal script', src: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js' }
        ]
      },
      oneSignal: {
        cdn: false,
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })
})

describe('define build public path', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    build: {
      publicPath: '/_onesignal/'
    },
    config: {
      oneSignal: {
        cdn: false,
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })
})

describe('define onesignal manifest', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true,
    config: {
      oneSignal: {
        manifest: {
          name: 'Awesome website'
        },
        cdn: false,
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        }
      }
    }
  })
})

describe('browser', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    browser: true
  })

  test('should render index page', async () => {
    const page = await createPage('/')
    const body = await page.innerHTML('body')
    expect(body).toContain('Works!')
  })
})
