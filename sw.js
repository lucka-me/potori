if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise((async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},s=(s,i)=>{Promise.all(s.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(s)};self.define=(s,l,c)=>{i[s]||(i[s]=Promise.resolve().then((()=>{let i={};const n={uri:location.origin+s.slice(1)};return Promise.all(l.map((s=>{switch(s){case"exports":return i;case"module":return n;default:return e(s)}}))).then((e=>{const s=c(...e);return i.default||(i.default=s),i}))})))}}define("./sw.js",["./workbox-22243acd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/assets/fa-solid-900.eot",revision:"8ac3167427b1d5d2967646bd8f7a0587"},{url:"/assets/fa-solid-900.svg",revision:"664de3932dd6291b4b8a8c0ddbcb4c61"},{url:"/assets/fa-solid-900.ttf",revision:"205f07b3883c484f27f40d21a92950d4"},{url:"/assets/fa-solid-900.woff",revision:"4451e1d86df7491dd874f2c41eee1053"},{url:"/assets/fa-solid-900.woff2",revision:"8e1ed89b6ccb8ce41faf5cb672677105"},{url:"/assets/icon_180x180.44eb740c2956fecd1f19e31415b06b4e.png",revision:"44eb740c2956fecd1f19e31415b06b4e"},{url:"/assets/icon_512x512.102c793d8484a674e36778e185b7349c.png",revision:"102c793d8484a674e36778e185b7349c"},{url:"/assets/icon_512x512.ee1897c4e3102c4ecae8775419ad3229.png",revision:"ee1897c4e3102c4ecae8775419ad3229"},{url:"/css/modules-async.9b2b764ac23f9cc44442.css",revision:null},{url:"/css/ui-async.d34dac0f56573c7abee0.css",revision:null},{url:"/css/ui.b4d3519d5e4564ff122f.css",revision:null},{url:"/icon-transparent.png",revision:"e6f1deb8cbab8dc84b045351406ae5d3"},{url:"/index.html",revision:"921673f776d35b3a05f820acc90c0b1d"},{url:"/lib/data.6c6c15c0658ee82f260b.bundle.js",revision:null},{url:"/lib/mdc-async.2879002789318106cad2.bundle.js",revision:null},{url:"/lib/mdc-async.2879002789318106cad2.bundle.js.LICENSE.txt",revision:"433f2527027f9e6a03e4fc5baafac36a"},{url:"/lib/mdc.1f689ba65280165400ba.bundle.js",revision:null},{url:"/lib/mdc.1f689ba65280165400ba.bundle.js.LICENSE.txt",revision:"3869a60dd547f81fbffb56f012a861ec"},{url:"/lib/modules-async.7da21ac72e556146e507.bundle.js",revision:null},{url:"/lib/modules-async.7da21ac72e556146e507.bundle.js.LICENSE.txt",revision:"e6adec8a161f2a83aff99235d3211f0f"},{url:"/lib/modules.2467f1600c0b7b3d2a1a.bundle.js",revision:null},{url:"/lib/modules.2467f1600c0b7b3d2a1a.bundle.js.LICENSE.txt",revision:"7ec01595672f75e83fd81b41f132f4c1"},{url:"/lib/potori.ed6255ac6e2fcc9bdd66.js",revision:null},{url:"/lib/service.76a89809ace9bb20a912.bundle.js",revision:null},{url:"/lib/ui-async.1917adee3049d9bc828a.bundle.js",revision:null},{url:"/lib/ui.03f0dce6cae81ecf48f3.bundle.js",revision:null},{url:"/manifest.webmanifest",revision:"c0f050ade66bb124072bb5c9b21fe93d"},{url:"https://apis.google.com/js/api.js",revision:null},{url:"https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",revision:null}],{}),e.cleanupOutdatedCaches()}));
