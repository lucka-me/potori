if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return c[e]||(s=new Promise(async s=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=s}else importScripts(e),s()})),s.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},s=(s,c)=>{Promise.all(s.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(s)};self.define=(s,i,d)=>{c[s]||(c[s]=Promise.resolve().then(()=>{let c={};const b={uri:location.origin+s.slice(1)};return Promise.all(i.map(s=>{switch(s){case"exports":return c;case"module":return b;default:return e(s)}})).then(e=>{const s=d(...e);return c.default||(c.default=s),c})}))}}define("./sw.js",["./workbox-a3b7f982"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/assets/icon_180x180.png",revision:"d38df88b9355ad60f9196b5940bb3ec5"},{url:"/assets/icon_512x512.png",revision:"69e5d687a15896da5e7bb8268f848ae9"},{url:"/css/modules-async.d28db3173de461606bae.css",revision:"0015ec602e8c92416181b97c36096b86"},{url:"/css/ui-async.48fbb41e6b96e10ff558.css",revision:"f798a2b7f2de3c353dd22c09544fe4eb"},{url:"/css/ui.fcb7d24efbae4d06846c.css",revision:"4a68ef1eb8f6cb9bbe5ca3bd13f89d6b"},{url:"/icon.png",revision:"f7a7af2217b5358388f7137959befd45"},{url:"/index.html",revision:"69fc6d63b156acae9298fa3d407cd462"},{url:"/lib/data.b50397d6556e4cac06be.bundle.js",revision:"573a74efdd5dd954ebe972735fa749a3"},{url:"/lib/mdc-async.c2ab0dd94d6af92b5cc6.bundle.js",revision:"47dae4234637c2ff615473cc2093f5f0"},{url:"/lib/mdc-async.c2ab0dd94d6af92b5cc6.bundle.js.LICENSE.txt",revision:"433f2527027f9e6a03e4fc5baafac36a"},{url:"/lib/mdc.b7c9e72eb15d2b6d0e35.bundle.js",revision:"3588010c16210475b1b4a4b15e61923b"},{url:"/lib/mdc.b7c9e72eb15d2b6d0e35.bundle.js.LICENSE.txt",revision:"3869a60dd547f81fbffb56f012a861ec"},{url:"/lib/modules-async.8e9c83cc5377624c0d07.bundle.js",revision:"cbd409969f62c110dd9c45f029089f4e"},{url:"/lib/modules-async.8e9c83cc5377624c0d07.bundle.js.LICENSE.txt",revision:"a3acba3dc9d601aec64b24175de3162d"},{url:"/lib/modules.6279373da8f49f6aaca3.bundle.js",revision:"3368e9b619db211fec46914e9facf75d"},{url:"/lib/modules.6279373da8f49f6aaca3.bundle.js.LICENSE.txt",revision:"7ec01595672f75e83fd81b41f132f4c1"},{url:"/lib/potori.164282a8bf31bed6f14f.js",revision:"73476e7a2ab601b91b9d4efc7fe61a5c"},{url:"/lib/service.e14810963e18197cff20.bundle.js",revision:"6bdb06143568f2c5d205c49ef81d7e61"},{url:"/lib/ui-async.81f951dc65763c6bd73e.bundle.js",revision:"26f6c9084624bebe283093ee244bf332"},{url:"/lib/ui.2140da6fe8a11772fbbf.bundle.js",revision:"11cc2d2e000d41adf915350b476c7dce"},{url:"/manifest.webmanifest",revision:"f649adab17500d96086ae516110a63bb"},{url:"https://apis.google.com/js/api.js",revision:null},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/fontawesome.min.css",revision:"5.15.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/solid.min.css",revision:"5.15.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/webfonts/fa-solid-900.ttf",revision:"5.15.0"},{url:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/webfonts/fa-solid-900.woff2",revision:"5.15.0"},{url:"https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",revision:null}],{}),e.cleanupOutdatedCaches()}));
