/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "bee71aaedd2e3857d98fba357a136758"
  },
  {
    "url": "api/component-injections.html",
    "revision": "ee1e2b1d8c91d0c90a60592fac7a322c"
  },
  {
    "url": "api/options.html",
    "revision": "9fd68db14e51ca7058e650e21fbae3dc"
  },
  {
    "url": "api/route-object.html",
    "revision": "836dd9cc2c36cd10dc569cc99a1f902f"
  },
  {
    "url": "api/router-instance.html",
    "revision": "4561497d79485fba709506e7483c7bd5"
  },
  {
    "url": "api/router-link.html",
    "revision": "911a46d0f8211c2d4675ebb7c2e11053"
  },
  {
    "url": "api/router-view.html",
    "revision": "5a682a45cfc899ed89be4c0c1442edcb"
  },
  {
    "url": "assets/css/46.styles.f7bf332b.css",
    "revision": "81b232861783ed5736b9d17ce244a58d"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/0.3028103b.js",
    "revision": "41015419d5e16a20fa6a13bb16d82f2e"
  },
  {
    "url": "assets/js/1.57050575.js",
    "revision": "86fa39beb79b9ab9b37d029b06a87be6"
  },
  {
    "url": "assets/js/10.f0e09295.js",
    "revision": "1d58d273b9be7b08eb6ada097fb879a3"
  },
  {
    "url": "assets/js/11.80b1d131.js",
    "revision": "a64a358f9424976b1bff37b71265eb30"
  },
  {
    "url": "assets/js/12.81bfd822.js",
    "revision": "5d96334bf19818a33737bfd2017bcc55"
  },
  {
    "url": "assets/js/13.5d7752b0.js",
    "revision": "d66d154cdf662fcb8429256c0056badb"
  },
  {
    "url": "assets/js/14.304b67f1.js",
    "revision": "7e9f31b576a1f6225d01d9cb76babde6"
  },
  {
    "url": "assets/js/15.ffb727f8.js",
    "revision": "fc5c1c28f82d431f5c800fe156cecdbc"
  },
  {
    "url": "assets/js/16.74e83634.js",
    "revision": "852dfca55670b3e59609c5966a2fb50d"
  },
  {
    "url": "assets/js/17.cf5b0129.js",
    "revision": "e1e1c1ff73db39863a1647ef77b7ae78"
  },
  {
    "url": "assets/js/18.8cb980cc.js",
    "revision": "0406a87c499e78d16d88ab6d7f9d71ba"
  },
  {
    "url": "assets/js/19.a2cda62d.js",
    "revision": "620109503ff25ef0c143df96f27e2a3a"
  },
  {
    "url": "assets/js/2.f5a49f3a.js",
    "revision": "ceb8881e1f743172308a8dd510ddaabc"
  },
  {
    "url": "assets/js/20.276b83f1.js",
    "revision": "fbb5009a88e76a092c741447cd0ed49e"
  },
  {
    "url": "assets/js/21.08a08928.js",
    "revision": "f78acde6a5496b56a20726509b9e5785"
  },
  {
    "url": "assets/js/22.f68686b9.js",
    "revision": "27d12cf4bcdd953b94e86813bf6f3de6"
  },
  {
    "url": "assets/js/23.71db9bc5.js",
    "revision": "a97b20744dd9be14ccc0e88f873d6457"
  },
  {
    "url": "assets/js/24.09c707c1.js",
    "revision": "5f05586a6bad65f31c2ef4e8abc2ded9"
  },
  {
    "url": "assets/js/25.9dc6bb36.js",
    "revision": "dfaf22f660a779f533f1834a96fc9208"
  },
  {
    "url": "assets/js/26.04527bf5.js",
    "revision": "184b934bc888379c4ff4a72bcea7e715"
  },
  {
    "url": "assets/js/27.6437f73d.js",
    "revision": "b396ead33e59e12f2c1d556ebb4a191b"
  },
  {
    "url": "assets/js/28.15cd3d6b.js",
    "revision": "7089acc9fa78ad032c0df9cf640e3dd6"
  },
  {
    "url": "assets/js/29.70f41011.js",
    "revision": "8c934a2c159688c8ce633cbf1837bded"
  },
  {
    "url": "assets/js/3.ebfd1333.js",
    "revision": "10ac27fe8cf5ffda22f4945f9310e3b0"
  },
  {
    "url": "assets/js/30.41682606.js",
    "revision": "d079499db58e92b3de60dfd37596ef3e"
  },
  {
    "url": "assets/js/31.c78f8679.js",
    "revision": "ec27e687b2c2792b8834ae30abd6a4c6"
  },
  {
    "url": "assets/js/32.3e88f0da.js",
    "revision": "e259962bb5281711dab6663ce6636bb2"
  },
  {
    "url": "assets/js/33.90414ec1.js",
    "revision": "f3594af03ec8d170f2fb2c403dcd586b"
  },
  {
    "url": "assets/js/34.23cd3cb2.js",
    "revision": "1e44afb1ebc301a4d6d0489fd48fd0e6"
  },
  {
    "url": "assets/js/35.e8e3806c.js",
    "revision": "09603084844b3c109407dbf4cad6d19f"
  },
  {
    "url": "assets/js/36.ea101143.js",
    "revision": "6477ae293c12477d3ed756a240d1b056"
  },
  {
    "url": "assets/js/37.ed086ace.js",
    "revision": "8193c961aa0fc5f4cbc753b569ac1e82"
  },
  {
    "url": "assets/js/38.d3d58f69.js",
    "revision": "623358cce5d81ef82d6d7c18a3868521"
  },
  {
    "url": "assets/js/39.5464bead.js",
    "revision": "4cacfab26a969a0265129253b8eb9eb4"
  },
  {
    "url": "assets/js/4.0e195647.js",
    "revision": "97e400462b5270a9a91fec3c316413f6"
  },
  {
    "url": "assets/js/40.8bb79be3.js",
    "revision": "1a8c829c443a3695882170ae999b0eea"
  },
  {
    "url": "assets/js/41.677c6627.js",
    "revision": "7abe715bba74eb61ba3b266e6eb194bc"
  },
  {
    "url": "assets/js/42.607297de.js",
    "revision": "d551d8b5615c2d07bf0a25995fa450d1"
  },
  {
    "url": "assets/js/43.ab66895e.js",
    "revision": "53d2c2e1c016e342cf3b1f7c102262a7"
  },
  {
    "url": "assets/js/44.7962d8de.js",
    "revision": "5647de053f7e9216d078f7b25b7c7490"
  },
  {
    "url": "assets/js/45.87d7d073.js",
    "revision": "9f48cf8fb06fa3781f9f50784f3497fe"
  },
  {
    "url": "assets/js/5.683e9889.js",
    "revision": "da5fdd8265ed9b6c0ae3d87f1cf2ba08"
  },
  {
    "url": "assets/js/6.0fe50ed4.js",
    "revision": "e2d89e0ce47064b16b4a8a50e577e5ce"
  },
  {
    "url": "assets/js/7.f37d172c.js",
    "revision": "d14ae53375620ba27bffc1f06cabbce7"
  },
  {
    "url": "assets/js/8.8e3c7d9e.js",
    "revision": "11ad6e9deddaa13909bc4bb76dae02b4"
  },
  {
    "url": "assets/js/9.2ccaaf9d.js",
    "revision": "1d8830a9f5f6ed06b80c5ef9edc7184d"
  },
  {
    "url": "assets/js/app.ad2c2e78.js",
    "revision": "3a4a79e8c518d1938b4cc22e87d697a1"
  },
  {
    "url": "guide/advanced/data-fetching.html",
    "revision": "d35ae0bfef56b8b3d9ae88337974bf14"
  },
  {
    "url": "guide/advanced/lazy-loading.html",
    "revision": "ceedf53bd19fcda899e3fa4f6e5b3393"
  },
  {
    "url": "guide/advanced/meta.html",
    "revision": "eac3931a14f043776eaa0d6d082941c7"
  },
  {
    "url": "guide/advanced/navigation-guards.html",
    "revision": "eec26cb7900ba7710e2866c9fd7580d4"
  },
  {
    "url": "guide/advanced/scroll-behavior.html",
    "revision": "82aec4776786e2121ad19dddd0ca12ab"
  },
  {
    "url": "guide/advanced/transitions.html",
    "revision": "650e219ee2d4b30403c43fd5e58d5e5c"
  },
  {
    "url": "guide/essentials/dynamic-matching.html",
    "revision": "c7f7fa434db82f5fedd432e83efb7a80"
  },
  {
    "url": "guide/essentials/getting-started.html",
    "revision": "a7182974058df033ad17339457bb7b6f"
  },
  {
    "url": "guide/essentials/history-mode.html",
    "revision": "78d5a3a099f0be3bdd293e7ca62f2c7e"
  },
  {
    "url": "guide/essentials/named-routes.html",
    "revision": "8ee1d0a2bb42e825f90307fec9fed896"
  },
  {
    "url": "guide/essentials/named-views.html",
    "revision": "e4b9edf52a314a517dd6ac9492520b35"
  },
  {
    "url": "guide/essentials/navigation.html",
    "revision": "3708082d51df7c7e6444f5d26240568d"
  },
  {
    "url": "guide/essentials/nested-routes.html",
    "revision": "f6076f24d74b07f26c69aa3ed9be87a6"
  },
  {
    "url": "guide/essentials/passing-props.html",
    "revision": "d77a940761ae1ce478c0abd46c6e43d3"
  },
  {
    "url": "guide/essentials/redirect-and-alias.html",
    "revision": "b2c665f6fd6369a0099ce3babbe1ba10"
  },
  {
    "url": "index.html",
    "revision": "3f99bfb8ea8b85c2d49478d8aa8ed0e6"
  },
  {
    "url": "installation.html",
    "revision": "f3dcca20bd1b4c15e04e0560611c4045"
  },
  {
    "url": "zh/api/component-injections.html",
    "revision": "70984a57728e5b8372b4d7b146e8e1bb"
  },
  {
    "url": "zh/api/options.html",
    "revision": "85dff131c4d9ac6a6d56a6f478194bc8"
  },
  {
    "url": "zh/api/route-object.html",
    "revision": "ecbf6c838ebb5a81231fcf86e30f5709"
  },
  {
    "url": "zh/api/router-instance.html",
    "revision": "8f0daf4d929cb4b5a309dfc13c3184cb"
  },
  {
    "url": "zh/api/router-link.html",
    "revision": "436b0b9c4593aea72b8ce238f2b3da4f"
  },
  {
    "url": "zh/api/router-view.html",
    "revision": "19f206cf397f066aef60a607f9523bd6"
  },
  {
    "url": "zh/guide/advanced/data-fetching.html",
    "revision": "97e29c0971bef79255f8825b8dc9a8b8"
  },
  {
    "url": "zh/guide/advanced/lazy-loading.html",
    "revision": "1f772ab926d885c714d2a6c46ebce9a2"
  },
  {
    "url": "zh/guide/advanced/meta.html",
    "revision": "6ac7d11e4c82f1e350aa031cbdad8100"
  },
  {
    "url": "zh/guide/advanced/navigation-guards.html",
    "revision": "2bb2462df5de789e09e9a82b68655be9"
  },
  {
    "url": "zh/guide/advanced/scroll-behavior.html",
    "revision": "3948a5cb2146e8b559d4d6a32201068e"
  },
  {
    "url": "zh/guide/advanced/transitions.html",
    "revision": "88fcbcb9cfe1d9d2b29bcdbd169716b3"
  },
  {
    "url": "zh/guide/essentials/dynamic-matching.html",
    "revision": "79a2c24c7d0f3dc4e49e5e1bba35ff76"
  },
  {
    "url": "zh/guide/essentials/getting-started.html",
    "revision": "9777bdf9253a53010735860a4989b369"
  },
  {
    "url": "zh/guide/essentials/history-mode.html",
    "revision": "2386091e7bdb80ebb5357295c4bf321c"
  },
  {
    "url": "zh/guide/essentials/named-routes.html",
    "revision": "64f70c6e1bd1cd4fa76cb0bc1dc42348"
  },
  {
    "url": "zh/guide/essentials/named-views.html",
    "revision": "e3864bd00fef8dde846d55287996d784"
  },
  {
    "url": "zh/guide/essentials/navigation.html",
    "revision": "2f6764cf91e2e4142614d0ff17cc5c24"
  },
  {
    "url": "zh/guide/essentials/nested-routes.html",
    "revision": "37ad81d382d781a94464cc9dc905aab2"
  },
  {
    "url": "zh/guide/essentials/passing-props.html",
    "revision": "f9e440d8199c6c1bd6fc91569b5e407d"
  },
  {
    "url": "zh/guide/essentials/redirect-and-alias.html",
    "revision": "94c560ba124acd107328eb34f5811707"
  },
  {
    "url": "zh/index.html",
    "revision": "b05b0aa0e417e9982c8a9fb9b5a20b2f"
  },
  {
    "url": "zh/installation.html",
    "revision": "f34179b94da4c61cb940c86382b0e5ce"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
