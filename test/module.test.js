import path from 'path'
import { createBrowser } from 'tib'
import { setup, build } from '@nuxtjs/module-test-utils'
import onesignalModule from '..'

const url = path => `http://localhost:3000${path}`
const testPath = '/__pu__/os/'
const testWorkerFile = 'osw.js'
const testUpdaterFile = 'osu.js'

describe('module', () => {
  let nuxt, browser

  beforeAll(async () => {
    const nuxtConfig = {
      rootDir: path.resolve(__dirname, '..', 'example'),
      modules: [
        onesignalModule,
        '@nuxtjs/pwa'
      ],
      oneSignal: {
        init: {
          appId: 'd867ac26-f7be-4c62-9fdd-b756a33c4a8f'
        },
        filesPath: testPath,
        workerFile: testWorkerFile,
        updaterFile: testUpdaterFile
      }
    }

    nuxt = (await setup(nuxtConfig)).nuxt
    await build(nuxt)
    await nuxt.listen(3000)

    browser = await createBrowser('puppeteer')
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
    await browser.close()
  })

  test('$OneSignal', async () => {
    const page = await browser.page(url('/'))
    const $OneSignal = await page.runScript(() => window.$nuxt.$OneSignal)
    expect($OneSignal).toBeDefined()
    expect($OneSignal.length).toBe(1)
  })

  test('worker\'s path is correctly set in OneSignal', async () => {
    const page = await browser.page(url('/'))
    const workerPath = await page.runScript(() => window.OneSignal.config.userConfig.serviceWorkerPath)
    expect(workerPath).toBe(path.join(testPath, testWorkerFile))
  })
})
