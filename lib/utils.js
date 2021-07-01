import { posix as path } from 'path'

export function joinUrl (...args) {
  return path.join(...args).replace(':/', '://')
}

export function isUrl (url) {
  return url.indexOf('http') === 0 || url.indexOf('//') === 0
}

export function getRouteParams (options) {
  // routerBase
  const routerBase = options.router.base

  // publicPath
  const publicPath = isUrl(options.build.publicPath) ? options.build.publicPath : joinUrl(routerBase, options.build.publicPath)
  
  return {
    routerBase,
    publicPath
  }
}

module.exports = {
  joinUrl,
  getRouteParams
}
