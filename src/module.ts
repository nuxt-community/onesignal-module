import { writeFileSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import defu from 'defu'
import hasha from 'hasha'
import { ModuleOptions, moduleDefaults } from './options'
import { getRouteParams, joinUrl } from './utils'
import './types'

// https://github.com/OneSignal/OneSignal-Website-SDK
function oneSignalModule (moduleOptions: ModuleOptions) {
  const { nuxt } = this

  const hook = () => {
    addOneSignal.call(this, moduleOptions)
  }

  if (nuxt.options.mode === 'spa') {
    return hook()
  }

  nuxt.hook('build:before', hook)
}

function addOneSignal (moduleOptions: ModuleOptions) {
  const { nuxt, addPlugin } = this
  const { publicPath } = getRouteParams(nuxt.options)

  // Merge all options sources
  const options: ModuleOptions = defu(
    moduleOptions,
    nuxt.options.oneSignal,
    moduleDefaults
  )

  // Define oneSignalSDK usage
  if (options.OneSignalSDK === undefined) {
    if (options.cdn) {
      // Use OneSignalSDK.js from CDN
      options.OneSignalSDK = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    } else {
      // Use OneSignalSDK.js from Sdk
      const OneSignalSDKJS = readFileSync(resolve(__dirname, '../sdk/OneSignalSDK.js'))
      const OneSignalSDKHash = hasha(OneSignalSDKJS)
      const OneSignalSDKFile = `ons.${OneSignalSDKHash}.js`

      options.OneSignalSDK = joinUrl(publicPath, OneSignalSDKFile)

      nuxt.options.build.plugins.push({
        apply (compiler) {
          compiler.hooks.emit.tap('nuxt-pwa-onesignal', (compilation) => {
            compilation.assets[OneSignalSDKFile] = {
              source: () => OneSignalSDKJS,
              size: () => OneSignalSDKJS.length
            }
          })
        }
      })
    }
  }

  // Add the oneSignal SDK script to head
  if (!nuxt.options.head.script.find((script: any) => script.hid === 'onesignal')) {
    nuxt.options.head.script.push({
      async: true,
      src: options.OneSignalSDK,
      hid: 'onesignal'
    })
  }

  // Adjust manifest for oneSignal
  if (!nuxt.options.manifest) {
    nuxt.options.manifest = {}
  }
  nuxt.options.manifest.gcm_sender_id = options.GcmSenderId

  // Adjust swURL option of Workbox for oneSignal
  if (!nuxt.options.workbox) {
    nuxt.options.workbox = {}
  }
  nuxt.options.workbox.swURL = 'OneSignalSDKWorker.js'

  // Provide OneSignalSDKWorker.js and OneSignalSDKUpdaterWorker.js
  const makeSW = (name: string, scripts: Array<String>) => {
    const workerScript = `importScripts(${scripts.map(i => `'${i}'`).join(', ')})\r\n`
    writeFileSync(resolve(nuxt.options.srcDir, 'static', name), workerScript, 'utf-8')
  }

  makeSW('OneSignalSDKWorker.js', [].concat(options.importScripts || []).concat(options.OneSignalSDK))
  makeSW('OneSignalSDKUpdaterWorker.js', [options.OneSignalSDK])

  // Add OneSignal plugin
  addPlugin({
    src: resolve(__dirname, 'runtime/plugin.js'),
    ssr: false,
    fileName: join('onesignal.js'),
    options
  })
}

oneSignalModule.meta = require('../package.json')

export default oneSignalModule
