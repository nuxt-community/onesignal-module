export interface WelcomeNotification {
  disable: boolean
}

export interface ModuleOptionsInit {
  allowLocalhostAsSecureOrigin: boolean
  welcomeNotification: WelcomeNotification
}

export interface ModuleManifest {
  name: string
  'short_name': string
  'start_url': string
  display: string
  'gcm_sender_id': string
}

export interface ModuleOptions {
  OneSignalSDK: string
  cdn: boolean
  importScripts: Array<String>
  init: ModuleOptionsInit
  manifest: ModuleManifest,
  workbox: {
    swURL: string
  }
}

export const moduleDefaults: ModuleOptions = {
  OneSignalSDK: undefined,
  cdn: true,
  importScripts: [
    '/sw.js?' + Date.now()
  ],
  manifest: {
    name: '',
    short_name: '',
    start_url: '/',
    display: 'standalone',
    gcm_sender_id: '482941778795'
  },
  init: {
    allowLocalhostAsSecureOrigin: true,
    welcomeNotification: {
      disable: true
    }
  },
  workbox: {
    swURL: 'OneSignalSDKWorker.js'
  }
}
