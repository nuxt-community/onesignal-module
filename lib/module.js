import path from 'path'
import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import hasha from 'hasha'
import defu from 'defu'
import { getRouteParams, joinUrl } from './utils'

export default function nuxtOneSignal (oneSignalOptions) {
  const hook = () => {
    addOneSignal.call(this, oneSignalOptions)
  }

  if (this.options.mode === 'spa') {
    return hook()
  }

  this.nuxt.hook('build:before', hook)
}

function addOneSignal (oneSignalOptions) {
  const context = this
  const { publicPath } = getRouteParams(context.options)

  // Merge options
  const defaults = {
    OneSignalSDK: undefined,
    cdn: true,
    GcmSenderId: '482941778795',
    init: {
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    },
    path: '_push_/onesignal/',
    workerFile: 'OneSignalSDKWorker.js',
    updaterFile: 'OneSignalSDKUpdaterWorker.js',
    swParams: {
      scope: '_push_/onesignal/'
    }
  }

  const options = defu({ ...context.options.oneSignal, ...oneSignalOptions }, defaults)

  if (options.OneSignalSDK === undefined) {
    if (options.cdn) {
      // Use OneSignalSDK.js from CDN
      options.OneSignalSDK = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
    } else {
      // Use OneSignalSDK.js from Dist
      const OneSignalSDKJS = readFileSync(path.resolve(__dirname, '../dist/OneSignalSDK.js'))
      const OneSignalSDKHash = hasha(OneSignalSDKJS)
      const OneSignalSDKFile = `ons.${OneSignalSDKHash}.js`

      options.OneSignalSDK = joinUrl(publicPath, OneSignalSDKFile)

      this.options.build.plugins.push({
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
  if (!context.options.head.script.find(s => s.hid === 'onesignal')) {
    context.options.head.script.push({
      async: true,
      src: options.OneSignalSDK,
      hid: 'onesignal'
    })
  }

  // Adjust manifest for oneSignal
  if (!context.options.manifest) {
    context.options.manifest = {}
  }
  context.options.manifest.gcm_sender_id = options.GcmSenderId

  // Provide OneSignalSDKWorker.js and OneSignalSDKUpdaterWorker.js
  const {
    path: workerDir,
    workerFile,
    updaterFile
  } = options

  const staticDir = path.resolve(context.options.srcDir, 'static')

  const writeWorker = (fileName, script) => {
    const workerScript = `importScripts('${script}')\r\n`
    mkdirSync(path.join(staticDir, workerDir), { recursive: true })
    writeFileSync(path.join(staticDir, workerDir, fileName), workerScript, 'utf-8')
  }

  writeWorker(workerFile, options.OneSignalSDK)
  writeWorker(updaterFile, options.OneSignalSDK)

  options.workerPath = path.join(workerDir, workerFile)
  options.updaterPath = path.join(workerDir, updaterFile)

  // Add OneSignal plugin
  context.addPlugin({
    src: path.resolve(__dirname, '../templates/plugin.js'),
    ssr: false,
    fileName: 'onesignal.js',
    options
  })
}
