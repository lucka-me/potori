if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return c[e]||(s=new Promise(async s=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=s}else importScripts(e),s()})),s.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},s=(s,c)=>{Promise.all(s.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(s)};self.define=(s,d,i)=>{c[s]||(c[s]=Promise.resolve().then(()=>{let c={};const a={uri:location.origin+s.slice(1)};return Promise.all(d.map(s=>{switch(s){case"exports":return c;case"module":return a;default:return e(s)}})).then(e=>{const s=i(...e);return c.default||(c.default=s),c})}))}}define("./sw.js",["./workbox-a3b7f982"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/assets/fa-solid-900.eot",revision:"8ac3167427b1d5d2967646bd8f7a0587"},{url:"/assets/fa-solid-900.svg",revision:"664de3932dd6291b4b8a8c0ddbcb4c61"},{url:"/assets/fa-solid-900.ttf",revision:"205f07b3883c484f27f40d21a92950d4"},{url:"/assets/fa-solid-900.woff",revision:"4451e1d86df7491dd874f2c41eee1053"},{url:"/assets/fa-solid-900.woff2",revision:"8e1ed89b6ccb8ce41faf5cb672677105"},{url:"/assets/icon_180x180.44eb740c2956fecd1f19e31415b06b4e.png",revision:"44eb740c2956fecd1f19e31415b06b4e"},{url:"/assets/icon_512x512.102c793d8484a674e36778e185b7349c.png",revision:"102c793d8484a674e36778e185b7349c"},{url:"/assets/icon_512x512.ee1897c4e3102c4ecae8775419ad3229.png",revision:"ee1897c4e3102c4ecae8775419ad3229"},{url:"/css/modules-async.d28db3173de461606bae.css",revision:"0015ec602e8c92416181b97c36096b86"},{url:"/css/ui-async.5ac39ceb42791028d8f2.css",revision:"3c0ac6569a40f69d9c5b7f486505ecc7"},{url:"/css/ui.36e9d68e7d8fd3f9cd11.css",revision:"e4d0831a694952136e85a1c5b5db8f35"},{url:"/icon-transparent.png",revision:"e6f1deb8cbab8dc84b045351406ae5d3"},{url:"/index.html",revision:"f753ed30498d9279d231c8c630dd0a82"},{url:"/lib/data.1c40dccb2b3cfe3fd227.bundle.js",revision:"51fb238fd2f029b9f755cf87fad69ac2"},{url:"/lib/mdc-async.212a610c52086c6a980b.bundle.js",revision:"c45c3ec0213b02c1e049847e7c683036"},{url:"/lib/mdc-async.212a610c52086c6a980b.bundle.js.LICENSE.txt",revision:"433f2527027f9e6a03e4fc5baafac36a"},{url:"/lib/mdc.f4ab1097a7c2f00607f6.bundle.js",revision:"8df9731bfe05da599628d316f898e7b6"},{url:"/lib/mdc.f4ab1097a7c2f00607f6.bundle.js.LICENSE.txt",revision:"3869a60dd547f81fbffb56f012a861ec"},{url:"/lib/modules-async.bc2d0186524590f1fea3.bundle.js",revision:"31cccd7e7f941e55e35cf5cbca9b1077"},{url:"/lib/modules-async.bc2d0186524590f1fea3.bundle.js.LICENSE.txt",revision:"e6adec8a161f2a83aff99235d3211f0f"},{url:"/lib/modules.97b3d1544db6de02839d.bundle.js",revision:"03c3759651e4373eadd2ceb0c34a10b5"},{url:"/lib/modules.97b3d1544db6de02839d.bundle.js.LICENSE.txt",revision:"7ec01595672f75e83fd81b41f132f4c1"},{url:"/lib/potori.9846373d5501dd27efc5.js",revision:"5eec4a579f4d301aa1134a4d82791b8f"},{url:"/lib/service.e7826a179fe1f22fea3c.bundle.js",revision:"3ce61630900ca648f4461e900fdb8f4d"},{url:"/lib/ui-async.d3035d405955c3ea3146.bundle.js",revision:"2b46d7a35e111958c33e971092cfe5cf"},{url:"/lib/ui.a085c71270b6ac482dac.bundle.js",revision:"8c9130c4ebd6bd8370f230e87110aa0a"},{url:"/manifest.webmanifest",revision:"c0f050ade66bb124072bb5c9b21fe93d"},{url:"https://apis.google.com/js/api.js",revision:null},{url:"https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",revision:null}],{}),e.cleanupOutdatedCaches()}));
