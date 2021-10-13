(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brainstorming~dashboard"],{2747:function(t,e,r){"use strict";r("323f")},"323f":function(t,e,r){},"406b":function(t,e,r){},"43e5":function(t,e,r){"use strict";r.d(e,"b",(function(){return a})),r.d(e,"a",(function(){return o}));
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var s={animation:{prefixed:"-webkit-animation",standard:"animation"},transform:{prefixed:"-webkit-transform",standard:"transform"},transition:{prefixed:"-webkit-transition",standard:"transition"}},n={animationend:{cssProperty:"animation",prefixed:"webkitAnimationEnd",standard:"animationend"},animationiteration:{cssProperty:"animation",prefixed:"webkitAnimationIteration",standard:"animationiteration"},animationstart:{cssProperty:"animation",prefixed:"webkitAnimationStart",standard:"animationstart"},transitionend:{cssProperty:"transition",prefixed:"webkitTransitionEnd",standard:"transitionend"}};function i(t){return Boolean(t.document)&&"function"===typeof t.document.createElement}function a(t,e){if(i(t)&&e in s){var r=t.document.createElement("div"),n=s[e],a=n.standard,o=n.prefixed,c=a in r.style;return c?a:o}return e}function o(t,e){if(i(t)&&e in n){var r=t.document.createElement("div"),s=n[e],a=s.standard,o=s.prefixed,c=s.cssProperty,d=c in r.style;return d?a:o}return e}},"4c46":function(t,e,r){"use strict";r("406b")},d43c:function(t,e,r){"use strict";var s=r("7a23");const n={class:"progress"},i={class:"text"},a=Object(s["i"])("div",{class:"spacer"},null,-1),o={key:0};function c(t,e,r,c,d,u){const p=Object(s["A"])("material-linear-progress");return Object(s["t"])(),Object(s["e"])("div",n,[Object(s["i"])("div",i,[Object(s["i"])("span",null,Object(s["C"])(t.text),1),a,t.determinate?(Object(s["t"])(),Object(s["e"])("span",o,Object(s["C"])(t.$store.state.progress.progress)+" / "+Object(s["C"])(t.$store.state.progress.max),1)):Object(s["f"])("",!0)]),Object(s["i"])(p,{progress:t.progress,determinate:t.determinate},null,8,["progress","determinate"])])}var d=r("9ab4"),u=r("1b40");const p={role:"progressbar",class:"mdc-linear-progress","aria-valuemin":"0","aria-valuemax":"1","aria-valuenow":"0"},l=Object(s["g"])('<div class="mdc-linear-progress__buffer"><div class="mdc-linear-progress__buffer-bar"></div><div class="mdc-linear-progress__buffer-dots"></div></div><div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"><span class="mdc-linear-progress__bar-inner"></span></div><div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>',3);function f(t,e,r,n,i,a){return Object(s["t"])(),Object(s["e"])("div",p,[l])}var m=r("8136"),A=r("43e5"),h=r("6689"),b={CLOSED_CLASS:"mdc-linear-progress--closed",CLOSED_ANIMATION_OFF_CLASS:"mdc-linear-progress--closed-animation-off",INDETERMINATE_CLASS:"mdc-linear-progress--indeterminate",REVERSED_CLASS:"mdc-linear-progress--reversed",ANIMATION_READY_CLASS:"mdc-linear-progress--animation-ready"},y={ARIA_HIDDEN:"aria-hidden",ARIA_VALUEMAX:"aria-valuemax",ARIA_VALUEMIN:"aria-valuemin",ARIA_VALUENOW:"aria-valuenow",BUFFER_BAR_SELECTOR:".mdc-linear-progress__buffer-bar",FLEX_BASIS:"flex-basis",PRIMARY_BAR_SELECTOR:".mdc-linear-progress__primary-bar"},g={PRIMARY_HALF:.8367142,PRIMARY_FULL:2.00611057,SECONDARY_QUARTER:.37651913,SECONDARY_HALF:.84386165,SECONDARY_FULL:1.60277782},S=function(t){function e(r){var s=t.call(this,Object(d["a"])(Object(d["a"])({},e.defaultAdapter),r))||this;return s.observer=null,s}return Object(d["d"])(e,t),Object.defineProperty(e,"cssClasses",{get:function(){return b},enumerable:!1,configurable:!0}),Object.defineProperty(e,"strings",{get:function(){return y},enumerable:!1,configurable:!0}),Object.defineProperty(e,"defaultAdapter",{get:function(){return{addClass:function(){},attachResizeObserver:function(){return null},forceLayout:function(){},getWidth:function(){return 0},hasClass:function(){return!1},setBufferBarStyle:function(){return null},setPrimaryBarStyle:function(){return null},setStyle:function(){},removeAttribute:function(){},removeClass:function(){},setAttribute:function(){}}},enumerable:!1,configurable:!0}),e.prototype.init=function(){var t=this;this.determinate=!this.adapter.hasClass(b.INDETERMINATE_CLASS),this.adapter.addClass(b.ANIMATION_READY_CLASS),this.progress=0,this.buffer=1,this.observer=this.adapter.attachResizeObserver((function(e){var r,s;if(!t.determinate)try{for(var n=Object(d["g"])(e),i=n.next();!i.done;i=n.next()){var a=i.value;a.contentRect&&t.calculateAndSetDimensions(a.contentRect.width)}}catch(o){r={error:o}}finally{try{i&&!i.done&&(s=n.return)&&s.call(n)}finally{if(r)throw r.error}}})),!this.determinate&&this.observer&&this.calculateAndSetDimensions(this.adapter.getWidth())},e.prototype.setDeterminate=function(t){if(this.determinate=t,this.determinate)return this.adapter.removeClass(b.INDETERMINATE_CLASS),this.adapter.setAttribute(y.ARIA_VALUENOW,this.progress.toString()),this.adapter.setAttribute(y.ARIA_VALUEMAX,"1"),this.adapter.setAttribute(y.ARIA_VALUEMIN,"0"),this.setPrimaryBarProgress(this.progress),void this.setBufferBarProgress(this.buffer);this.observer&&this.calculateAndSetDimensions(this.adapter.getWidth()),this.adapter.addClass(b.INDETERMINATE_CLASS),this.adapter.removeAttribute(y.ARIA_VALUENOW),this.adapter.removeAttribute(y.ARIA_VALUEMAX),this.adapter.removeAttribute(y.ARIA_VALUEMIN),this.setPrimaryBarProgress(1),this.setBufferBarProgress(1)},e.prototype.isDeterminate=function(){return this.determinate},e.prototype.setProgress=function(t){this.progress=t,this.determinate&&(this.setPrimaryBarProgress(t),this.adapter.setAttribute(y.ARIA_VALUENOW,t.toString()))},e.prototype.getProgress=function(){return this.progress},e.prototype.setBuffer=function(t){this.buffer=t,this.determinate&&this.setBufferBarProgress(t)},e.prototype.getBuffer=function(){return this.buffer},e.prototype.open=function(){this.adapter.removeClass(b.CLOSED_CLASS),this.adapter.removeClass(b.CLOSED_ANIMATION_OFF_CLASS),this.adapter.removeAttribute(y.ARIA_HIDDEN)},e.prototype.close=function(){this.adapter.addClass(b.CLOSED_CLASS),this.adapter.setAttribute(y.ARIA_HIDDEN,"true")},e.prototype.isClosed=function(){return this.adapter.hasClass(b.CLOSED_CLASS)},e.prototype.handleTransitionEnd=function(){this.adapter.hasClass(b.CLOSED_CLASS)&&this.adapter.addClass(b.CLOSED_ANIMATION_OFF_CLASS)},e.prototype.destroy=function(){t.prototype.destroy.call(this),this.observer&&this.observer.disconnect()},e.prototype.restartAnimation=function(){this.adapter.removeClass(b.ANIMATION_READY_CLASS),this.adapter.forceLayout(),this.adapter.addClass(b.ANIMATION_READY_CLASS)},e.prototype.setPrimaryBarProgress=function(t){var e="scaleX("+t+")",r="undefined"!==typeof window?Object(A["b"])(window,"transform"):"transform";this.adapter.setPrimaryBarStyle(r,e)},e.prototype.setBufferBarProgress=function(t){var e=100*t+"%";this.adapter.setBufferBarStyle(y.FLEX_BASIS,e)},e.prototype.calculateAndSetDimensions=function(t){var e=t*g.PRIMARY_HALF,r=t*g.PRIMARY_FULL,s=t*g.SECONDARY_QUARTER,n=t*g.SECONDARY_HALF,i=t*g.SECONDARY_FULL;this.adapter.setStyle("--mdc-linear-progress-primary-half",e+"px"),this.adapter.setStyle("--mdc-linear-progress-primary-half-neg",-e+"px"),this.adapter.setStyle("--mdc-linear-progress-primary-full",r+"px"),this.adapter.setStyle("--mdc-linear-progress-primary-full-neg",-r+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-quarter",s+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-quarter-neg",-s+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-half",n+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-half-neg",-n+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-full",i+"px"),this.adapter.setStyle("--mdc-linear-progress-secondary-full-neg",-i+"px"),this.restartAnimation()},e}(h["a"]),_=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return Object(d["d"])(e,t),e.attachTo=function(t){return new e(t)},Object.defineProperty(e.prototype,"determinate",{set:function(t){this.foundation.setDeterminate(t)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"progress",{set:function(t){this.foundation.setProgress(t)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"buffer",{set:function(t){this.foundation.setBuffer(t)},enumerable:!1,configurable:!0}),e.prototype.open=function(){this.foundation.open()},e.prototype.close=function(){this.foundation.close()},e.prototype.initialSyncWithDOM=function(){var t=this;this.root.addEventListener("transitionend",(function(){t.foundation.handleTransitionEnd()}))},e.prototype.getDefaultFoundation=function(){var t=this,e={addClass:function(e){t.root.classList.add(e)},forceLayout:function(){t.root.getBoundingClientRect()},setBufferBarStyle:function(e,r){var s=t.root.querySelector(S.strings.BUFFER_BAR_SELECTOR);s&&s.style.setProperty(e,r)},setPrimaryBarStyle:function(e,r){var s=t.root.querySelector(S.strings.PRIMARY_BAR_SELECTOR);s&&s.style.setProperty(e,r)},hasClass:function(e){return t.root.classList.contains(e)},removeAttribute:function(e){t.root.removeAttribute(e)},removeClass:function(e){t.root.classList.remove(e)},setAttribute:function(e,r){t.root.setAttribute(e,r)},setStyle:function(e,r){t.root.style.setProperty(e,r)},attachResizeObserver:function(e){var r=window.ResizeObserver;if(r){var s=new r(e);return s.observe(t.root),s}return null},getWidth:function(){return t.root.offsetWidth}};return new S(e)},e}(m["a"]);class v extends u["d"]{onProgressChanged(t,e){this.ctrl&&(this.ctrl.progress=t)}onDeterminateChanged(t,e){this.ctrl&&(this.ctrl.determinate=t)}mounted(){this.ctrl=_.attachTo(this.$el),this.ctrl.progress=this.progress,this.ctrl.determinate=this.determinate}unmounted(){var t,e;null===(t=this.ctrl)||void 0===t||t.close(),null===(e=this.ctrl)||void 0===e||e.destroy()}}Object(d["c"])([Object(u["c"])(Number)],v.prototype,"progress",void 0),Object(d["c"])([Object(u["c"])(Boolean)],v.prototype,"determinate",void 0),Object(d["c"])([Object(u["e"])("progress")],v.prototype,"onProgressChanged",null),Object(d["c"])([Object(u["e"])("determinate")],v.prototype,"onDeterminateChanged",null);r("2747");v.render=f;var O=v;let E=class extends u["d"]{get progress(){return this.$store.state.progress.progress/this.$store.state.progress.max}};Object(d["c"])([Object(u["c"])(String)],E.prototype,"text",void 0),Object(d["c"])([Object(u["c"])(Boolean)],E.prototype,"determinate",void 0),E=Object(d["c"])([Object(u["b"])({components:{MaterialLinearProgress:O}})],E);var C=E;r("4c46");C.render=c;e["a"]=C}}]);
//# sourceMappingURL=brainstorming~dashboard.30e6244c.js.map