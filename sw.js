if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return d[e]||(s=new Promise(async s=>{if("document"in self){const d=document.createElement("script");d.src=e,document.head.appendChild(d),d.onload=s}else importScripts(e),s()})),s.then(()=>{if(!d[e])throw new Error(`Module ${e} didn’t register its module`);return d[e]})},s=(s,d)=>{Promise.all(s.map(e)).then(e=>d(1===e.length?e[0]:e))},d={require:Promise.resolve(s)};self.define=(s,i,c)=>{d[s]||(d[s]=Promise.resolve().then(()=>{let d={};const a={uri:location.origin+s.slice(1)};return Promise.all(i.map(s=>{switch(s){case"exports":return d;case"module":return a;default:return e(s)}})).then(e=>{const s=c(...e);return d.default||(d.default=s),d})}))}}define("./sw.js",["./workbox-a3b7f982"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/assets/icon_180x180.png",revision:"d38df88b9355ad60f9196b5940bb3ec5"},{url:"/assets/icon_512x512.png",revision:"69e5d687a15896da5e7bb8268f848ae9"},{url:"/css/modules-async.d28db3173de461606bae.css",revision:"0015ec602e8c92416181b97c36096b86"},{url:"/css/ui-async.b5fe715c7457682fc083.css",revision:"0c97f4508c799b8fe1fd3c50e523a0d0"},{url:"/css/ui.538ffb0969ef372ea591.css",revision:"073cff139f4735d656f0846a5b54e91c"},{url:"/icon.png",revision:"f7a7af2217b5358388f7137959befd45"},{url:"/index.html",revision:"812b95e5257305a59e7f3982533d75ae"},{url:"/lib/data.4d4c706549e124e65993.bundle.js",revision:"0539d286dfd30593c591ecba5f695656"},{url:"/lib/mdc-async.b589fde49d25dad7dbbe.bundle.js",revision:"fb099ea8872c28927b57f7ef5d3417b0"},{url:"/lib/mdc-async.b589fde49d25dad7dbbe.bundle.js.LICENSE.txt",revision:"433f2527027f9e6a03e4fc5baafac36a"},{url:"/lib/mdc.664525a54dbe55c2cf48.bundle.js",revision:"aa2cd0d16de729dd7c6cd2955d9bf45a"},{url:"/lib/mdc.664525a54dbe55c2cf48.bundle.js.LICENSE.txt",revision:"3869a60dd547f81fbffb56f012a861ec"},{url:"/lib/modules-async.60c626dce0d007433bcd.bundle.js",revision:"ec4aeb0b8b26ae159aaeadf9eef5244b"},{url:"/lib/modules-async.60c626dce0d007433bcd.bundle.js.LICENSE.txt",revision:"a3acba3dc9d601aec64b24175de3162d"},{url:"/lib/modules.0b67648ac9da70ef49ba.bundle.js",revision:"2893201e205a8e2b97f96d65df5dc948"},{url:"/lib/modules.0b67648ac9da70ef49ba.bundle.js.LICENSE.txt",revision:"7ec01595672f75e83fd81b41f132f4c1"},{url:"/lib/potori.f71d6919ee2d41403714.js",revision:"535b8705536f8dbcff4c04289b6ea2cd"},{url:"/lib/service.a24dd8a77aea5b6e64f5.bundle.js",revision:"1305e64fc5f016f8480ffa130f51bab7"},{url:"/lib/ui-async.ae3082c3cbdf06bd499a.bundle.js",revision:"60d9238d8dc89ec1ecddce64ce71d913"},{url:"/lib/ui.4083142a55bb52c966ce.bundle.js",revision:"e944842771930920a191edc603669fc0"},{url:"/manifest.webmanifest",revision:"f649adab17500d96086ae516110a63bb"},{url:"https://apis.google.com/js/api.js",revision:null},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/fontawesome.min.css",revision:"5.14.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/solid.min.css",revision:"5.14.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/webfonts/fa-solid-900.ttf",revision:"5.14.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/webfonts/fa-solid-900.woff2",revision:"5.14.0"},{url:"https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",revision:null}],{}),e.cleanupOutdatedCaches()}));
