import { posix as path } from 'path'
import { NuxtOptions } from '@nuxt/types'

export function joinUrl (...args: string[]) {
  return path.join(...args).replace(':/', '://')
}

export function isUrl (url: string) {
  return url.indexOf('http') === 0 || url.indexOf('//') === 0
}

export function getRouteParams (options: NuxtOptions) {
  // routerBase
  const routerBase = options.router.base

  // publicPath
  let publicPath
  if (isUrl(options.build.publicPath)) {
    publicPath = options.build.publicPath
  } else {
    publicPath = joinUrl(routerBase, options.build.publicPath)
  }

  return {
    routerBase,
    publicPath
  }
}

module.exports = {
  joinUrl,
  getRouteParams
}
