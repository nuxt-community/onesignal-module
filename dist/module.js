'use strict';

const fs = require('fs');
const path = require('path');
const defu2 = require('defu');
const hasha2 = require('hasha');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const defu2__default = /*#__PURE__*/_interopDefaultLegacy(defu2);
const hasha2__default = /*#__PURE__*/_interopDefaultLegacy(hasha2);

const moduleDefaults = {
  OneSignalSDK: void 0,
  cdn: true,
  GcmSenderId: "482941778795",
  importScripts: [
    "/sw.js?" + Date.now()
  ],
  init: {
    allowLocalhostAsSecureOrigin: true,
    welcomeNotification: {
      disable: true
    }
  }
};

function joinUrl(...args) {
  return path.posix.join(...args).replace(":/", "://");
}
function isUrl(url) {
  return url.indexOf("http") === 0 || url.indexOf("//") === 0;
}
function getRouteParams(options) {
  const routerBase = options.router.base;
  let publicPath;
  if (isUrl(options.build.publicPath)) {
    publicPath = options.build.publicPath;
  } else {
    publicPath = joinUrl(routerBase, options.build.publicPath);
  }
  return {
    routerBase,
    publicPath
  };
}
module.exports = {
  joinUrl,
  getRouteParams
};

function oneSignalModule(moduleOptions) {
  const {nuxt} = this;
  const hook = () => {
    addOneSignal.call(this, moduleOptions);
  };
  if (nuxt.options.mode === "spa") {
    return hook();
  }
  nuxt.hook("build:before", hook);
}
function addOneSignal(moduleOptions) {
  const {nuxt, addPlugin} = this;
  const {publicPath} = getRouteParams(nuxt.options);
  const options2 = defu2__default['default'](moduleOptions, nuxt.options.oneSignal, moduleDefaults);
  if (options2.OneSignalSDK === void 0) {
    if (options2.cdn) {
      options2.OneSignalSDK = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
    } else {
      const OneSignalSDKJS = fs.readFileSync(path.resolve(__dirname, "../sdk/OneSignalSDK.js"));
      const OneSignalSDKHash = hasha2__default['default'](OneSignalSDKJS);
      const OneSignalSDKFile = `ons.${OneSignalSDKHash}.js`;
      options2.OneSignalSDK = joinUrl(publicPath, OneSignalSDKFile);
      nuxt.options.build.plugins.push({
        apply(compiler) {
          compiler.hooks.emit.tap("nuxt-pwa-onesignal", (compilation) => {
            compilation.assets[OneSignalSDKFile] = {
              source: () => OneSignalSDKJS,
              size: () => OneSignalSDKJS.length
            };
          });
        }
      });
    }
  }
  if (!nuxt.options.head.script.find((script) => script.hid === "onesignal")) {
    nuxt.options.head.script.push({
      async: true,
      src: options2.OneSignalSDK,
      hid: "onesignal"
    });
  }
  if (!nuxt.options.manifest) {
    nuxt.options.manifest = {};
  }
  nuxt.options.manifest.gcm_sender_id = options2.GcmSenderId;
  if (!nuxt.options.workbox) {
    nuxt.options.workbox = {};
  }
  nuxt.options.workbox.swURL = "OneSignalSDKWorker.js";
  const makeSW = (name, scripts) => {
    const workerScript = `importScripts(${scripts.map((i) => `'${i}'`).join(", ")})\r
`;
    fs.writeFileSync(path.resolve(nuxt.options.srcDir, "static", name), workerScript, "utf-8");
  };
  makeSW("OneSignalSDKWorker.js", [].concat(options2.importScripts || []).concat(options2.OneSignalSDK));
  makeSW("OneSignalSDKUpdaterWorker.js", [options2.OneSignalSDK]);
  addPlugin({
    src: path.resolve(__dirname, "runtime/plugin.js"),
    ssr: false,
    fileName: path.join("onesignal.js"),
    options: options2
  });
}
oneSignalModule.meta = require("../package.json");

module.exports = oneSignalModule;
