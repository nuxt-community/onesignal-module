# OneSignal Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

OneSignal is a Free, high volume and reliable push notification service for websites and mobile applications. Setting and using this module is a little tricky as OneSignal requires to register its own Service worker.

## Setup

1. Follow steps to install [pwa module](https://pwa.nuxtjs.org)

2. Add `@nuxtjs/onesignal` dependency to your project

```bash
yarn add @nuxtjs/onesignal # or npm install @nuxtjs/onesignal
```

2. Add `@nuxtjs/onesignal` **BEFORE** `@nuxtjs/pwa` to the `modules` section of `nuxt.config`:

```js
modules: [
  '@nuxtjs/onesignal',
  '@nuxtjs/pwa'
]
```

3. Add `oneSignal` options to `nuxt.config`:

```js
// Options
oneSignal: {
  init: {
    appId: 'YOUR_APP_ID',
    allowLocalhostAsSecureOrigin: true,
    welcomeNotification: {
        disable: true
    }
  }
}
```

See references below for all `init` options.

4. Add `OneSignalSDK*` to `.gitignore`

## Async Functions
This module exposes oneSignal as `$OneSignal` everywhere. So you can call it.
Please note that because of async loading of OneSignal SDK script, every action should be pushed into `$OneSignal` stack.

```js
// Inside page components
this.$OneSignal.push(() => {
    this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
    if (isEnabled) {
      console.log('Push notifications are enabled!')
    } else {
      console.log('Push notifications are not enabled yet.')
    }
  })
})

// Using window and array form
window.$OneSignal.push(['addListenerForNotificationOpened', (data) => {
  console.log('Received NotificationOpened:', data )}
]);
```

## Change OneSignal SDK Script URL

By default this modules ships with latest SDK dist.

You can use recommended CDN by using `cdn: true` or changing it to a custom value using `OneSignalSDK`.

```js
oneSignal: {
  // Use CDN
  cdn: true,

  // Use any custom URL
  OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
}
```

## Change Worker Path and Scope

By default OneSignal expects you to put `OneSignalSDKWorker.js` in the root of your website (nuxt static folder). In case you're already using `@nuxt/pwa` with the `workbox` module, you already should have a service worker there. Two workers can't have the same scope.

That is why this module changes the scope of `OneSignalSDKWorker.js` to `/_push_/onesignal/`. You can use options to customize path, scope, and filenames.

```js
oneSignal: {
  filesPath: '', // set to your path if you put worker files into a subdir, for example '/_push_/onesignal/'
  workerFile: 'OneSignalSDKWorker.js',
  updaterFile: 'OneSignalSDKUpdaterWorker.js',
  swParams: {
    scope: '/_push_/onesignal/' // set to an empty string ('') if you want OneSignal to be your main worker
  }
}
```

Be sure to use the same settings in OneSignal. See [Service Worker Customizations (path and scope)](https://documentation.onesignal.com/docs/onesignal-service-worker-faq#sdk-parameter-reference-for-service-workers)

## References

- [Web Push SDK Reference](https://documentation.onesignal.com/docs/web-push-sdk) - Available options and API calls
- [Customize Permission Messages](https://documentation.onesignal.com/docs/customize-permission-messages)
- [Thanks for Subscribing Notifications](https://documentation.onesignal.com/docs/welcome-notifications)
- [Product overview](https://documentation.onesignal.com/docs/product-overview) - More info about OneSignal
- [Web Push SDK Setup](https://documentation.onesignal.com/docs/web-push-sdk-setup-https) - Setup guides for in-depth reading what this modules does.
- [Service Worker Customizations (path and scope)](https://documentation.onesignal.com/docs/onesignal-service-worker-faq#sdk-parameter-reference-for-service-workers)

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/onesignal/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/onesignal

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/onesignal.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/onesignal

[github-actions-ci-src]: https://github.com/nuxt-community/onesignal-module/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-community/onesignal-module/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/onesignal-module.svg
[codecov-href]: https://codecov.io/gh/nuxt-community/onesignal-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/onesignal.svg
[license-href]: https://npmjs.com/package/@nuxtjs/onesignal
