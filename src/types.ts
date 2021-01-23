import type { } from '@nuxt/types'
import type OneSignal from '../'

declare module '@nuxt/types' {
  interface Context {
    $OneSignal: OneSignal
  }
  interface NuxtAppOptions {
    $OneSignal: OneSignal
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $OneSignal: OneSignal
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line
  interface Store<S> {
    $OneSignal: OneSignal
  }
}
