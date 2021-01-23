export interface WelcomeNotification {
  disable: boolean
}

export interface ModuleOptionsInit {
  allowLocalhostAsSecureOrigin: boolean
  welcomeNotification: WelcomeNotification
}

export interface ModuleOptions {
  OneSignalSDK: string
  cdn: boolean
  GcmSenderId: string
  importScripts: Array<String>
  init: ModuleOptionsInit
}

export const moduleDefaults: ModuleOptions = {
  OneSignalSDK: undefined,
  cdn: true,
  GcmSenderId: '482941778795',
  importScripts: [
    '/sw.js?' + Date.now()
  ],
  init: {
    allowLocalhostAsSecureOrigin: true,
    welcomeNotification: {
      disable: true
    }
  }
}
