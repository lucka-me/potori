(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["preferences"],{"0152":function(e,t,r){"use strict";r("d222")},"0d7f":function(e){e.exports=JSON.parse('{"version":"1.3.0","build":"1643"}')},"1dec":function(e){e.exports=JSON.parse('{"en":{"header":"General","queryAfterLatest":"Query After Latest","queryAfterLatestDesc":"Query mails received after the latest one"},"zh":{"header":"一般","queryAfterLatest":"仅查询最新邮件","queryAfterLatestDesc":"仅查询在当前最新邮件之后收到的邮件"}}')},"2ea4":function(e){e.exports=JSON.parse('{"en":{"header":"Data","importAction":"Import","exportAction":"Export","clearAction":"Clear","importNominations":"Import Nominations","importNominationsDesc":"Import nominations from JSON ile","importNominationsInform":"Imported {count} nominations","exportNominations":"Export Nominations","exportNominationsDesc":"Export nominations to JSON file","importWayfarer":"Import Wayfarer JSON","importWayfarerDesc":"Import JSON from https://wayfarer.nianticlabs.com/api/v1/vault/manage","importWayfarerPrompt":"Paste Wayfarer JSON","importWayfarerAlertParseError":"Unable to parse the JSON.","importWayfarerAlertDataInvalid":"The data is invalid.","importWayfarerInform":"Updated {count} nominations","clearNominations":"Clear Nominations","clearNominationsDesc":"Clear all nominations from local storage"},"zh":{"header":"数据","importAction":"导入","exportAction":"导出","clearAction":"清空","importNominations":"导入提名","importNominationsDesc":"从JSON文件中导入提名","importNominationsInform":"导入了{count}个提名。","exportNominations":"导出提名","exportNominationsDesc":"将提名导出至JSON文件","importWayfarer":"导入Wayfarer JSON","importWayfarerDesc":"导入来自 https://wayfarer.nianticlabs.com/api/v1/vault/manage 的JSON","importWayfarerPrompt":"粘贴Wayfarer JSON","importWayfarerAlertParseError":"无法解析JSON。","importWayfarerAlertDataInvalid":"数据不正确。","importWayfarerInform":"更新了{count}个提名。","clearNominations":"清空提名","clearNominationsDesc":"从本地存储中清空提名"}}')},"6c31":function(e,t,r){},"78ac":function(e,t,r){},8092:function(e){e.exports=JSON.parse('{"en":{"header":"Google","account":"Account","accountDesc":"Link / unlink Google Account","link":"Link","unlink":"Unlink","sync":"Sync Google Drive","syncDesc":"Sync with Google Drive when refresh","syncNow":"Sync Now","syncNowDesc":"Sync with Google Drive","syncNowAction":"Sync","uploadNow":"Upload Now","uploadNowDesc":"Upload data to Google Drive","uploadNowAction":"Upload","migrate":"Migrate","migrateDesc":"Migrate data from Potori before 0.8.0","loadingGAPI":"Loading Google API"},"zh":{"header":"Google","account":"账号","accountDesc":"连接/取消连接Google账号","link":"连接","unlink":"取消连接","sync":"同步Google硬盘","syncDesc":"刷新时同步Google硬盘","syncNow":"现在同步","syncNowDesc":"现在同步Google硬盘","syncNowAction":"同步","uploadNow":"现在上传","uploadNowDesc":"将数据上传至Google硬盘","uploadNowAction":"上传","migrate":"迁移","migrateDesc":"从0.8.0之前的Potori迁移数据","loadingGAPI":"正在加载Google API"}}')},"81e5":function(e){e.exports=JSON.parse('{"en":{"header":"Brainstorming","importAction":"Import","exportAction":"Export","clearAction":"Clear","autoQueryFirebase":"Automatically Query Firebase","autoQueryFirebaseDesc":"Query Firebase to get locations of nomination after processing mails","importDatabase":"Import Database","importDatabaseDesc":"Import records from JSON file","importDatabaseInform":"Imported {count} records.","exportDatabase":"Export Database","exportDatabaseDesc":"Export records to JSON file","exportDatabaseInform":"Exported {count} records.","clearDatabase":"Clear Database","clearDatabaseDesc":"Clear all records from local storage"},"zh":{"header":"Brainstorming","importAction":"导入","exportAction":"导出","clearAction":"清空","autoQueryFirebase":"自动查询Firebase","autoQueryFirebaseDesc":"处理邮件后自动查询Firebase以获取提名位置","importDatabase":"导入数据库","importDatabaseDesc":"从JSON文件中导入记录","importDatabaseInform":"导入了{count}条记录。","exportDatabase":"导出数据库","exportDatabaseDesc":"将记录导出至JSON文件","exportDatabaseInform":"导出了{count}条记录。","clearDatabase":"清空数据库","clearDatabaseDesc":"从本地存储中清空记录"}}')},"8a13":function(e,t,r){"use strict";r("78ac")},a55d:function(e,t,r){"use strict";r.r(t);var o=r("7a23");const a={class:"preferences"},c=Object(o["h"])("hr",null,null,-1),n=Object(o["h"])("hr",null,null,-1),i=Object(o["h"])("hr",null,null,-1),s=Object(o["h"])("hr",null,null,-1);function l(e,t,r,l,d,b){const p=Object(o["E"])("material-top-app-bar"),u=Object(o["E"])("material-top-app-bar-adjust"),O=Object(o["E"])("general-preferences"),f=Object(o["E"])("google-preferences"),j=Object(o["E"])("data-preferences"),h=Object(o["E"])("brainstorming-preferences"),m=Object(o["E"])("about-preferences");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["k"])(p,{title:e.$t("title"),"navi-back":""},null,8,["title"]),Object(o["k"])(u),Object(o["h"])("main",a,[Object(o["k"])(O),c,Object(o["k"])(f),n,Object(o["k"])(j),i,Object(o["k"])(h),s,Object(o["k"])(m)])],64)}var d=r("9ab4"),b=r("ce1f"),p=r("2281"),u=r("4892");function O(e,t,r,a,c,n){const i=Object(o["E"])("preference-row"),s=Object(o["E"])("material-button");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["h"])("h2",null,Object(o["G"])(e.$t("header")),1),Object(o["k"])(i,{text:e.$t("appVersion"),desc:e.appVersion},null,8,["text","desc"]),Object(o["k"])(i,{text:e.$t("dataVersion"),desc:e.dataVersion},null,8,["text","desc"]),Object(o["k"])(i,{text:e.$t("document")},{default:Object(o["J"])(()=>[Object(o["k"])(s,{onClick:e.openDoc},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("openAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text"]),Object(o["k"])(i,{text:e.$t("privacy")},{default:Object(o["J"])(()=>[Object(o["k"])(s,{onClick:e.openPrivacy},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("openAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text"]),Object(o["k"])(i,{text:e.$t("telegram")},{default:Object(o["J"])(()=>[Object(o["k"])(s,{onClick:e.openTelegram},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("openAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text"]),Object(o["k"])(i,{text:e.$t("repository"),desc:e.$t("repositoryDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(s,{onClick:e.openRepo},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("openAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"]),e.hasErrors?(Object(o["x"])(),Object(o["e"])(i,{key:0,text:e.$t("exportErrors"),desc:e.$t("exportErrorsDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(s,{onClick:e.exportErrors},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("exportErrorsAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0)],64)}var f=r("42b4"),j=r("6022"),h=r("ce89"),m=r("8043"),y=r("0d7f"),g=r("1703");const v={class:"row"},x={class:"text"},k={key:0,class:"desc"},D={key:0,class:"spacer"},w={key:1,class:"action"};function $(e,t,r,a,c,n){return Object(o["x"])(),Object(o["g"])("div",v,[Object(o["h"])("div",x,[Object(o["h"])("span",null,Object(o["G"])(e.text),1),e.desc?(Object(o["x"])(),Object(o["g"])("span",k,Object(o["G"])(e.desc),1)):Object(o["f"])("",!0)]),e.$slots.default?(Object(o["x"])(),Object(o["g"])("div",D)):Object(o["f"])("",!0),e.$slots.default?(Object(o["x"])(),Object(o["g"])("div",w,[Object(o["D"])(e.$slots,"default")])):Object(o["f"])("",!0)])}var N=r("1b40");class E extends N["d"]{}Object(d["c"])([Object(N["c"])(String)],E.prototype,"text",void 0),Object(d["c"])([Object(N["c"])(String)],E.prototype,"desc",void 0);r("e723");E.render=$;var C=E,A=r("b44e");let J=class extends b["b"]{get appVersion(){return`${y.version} (${y.build})`}get dataVersion(){return h["a"].version}get hasErrors(){return j["b"].errors.length>0}openDoc(){window.open(this.$t("documentLink"),"_blank")}openPrivacy(){window.open(this.$t("privacyLink"),"_blank")}openTelegram(){window.open("https://t.me/potori","_blank")}openRepo(){window.open("https://github.com/lucka-me/potori","_blank")}exportErrors(){let e="";for(const t of j["b"].errors){let r=t.message;if("message"in t.error){const e=t.error;r=e.stack||e.message}e+=`[${t.filename}][${t.lineno}:${t.colno}]${r}\n`}m["a"].copy(e),f["a"].inform(this.$t("exportErrorsInform",{count:j["b"].errors.length}))}};J=Object(d["c"])([Object(b["a"])({components:{MaterialButton:g["a"],PreferenceRow:C},i18n:{messages:A}})],J);var _=J;_.render=O;var S=_;function P(e,t,r,a,c,n){const i=Object(o["E"])("material-switch"),s=Object(o["E"])("preference-row"),l=Object(o["E"])("material-button");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["h"])("h2",null,Object(o["G"])(e.$t("header")),1),Object(o["k"])(s,{text:e.$t("autoQueryFirebase"),desc:e.$t("autoQueryFirebaseDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{modelValue:e.autoQueryFirebase,"onUpdate:modelValue":t[0]||(t[0]=t=>e.autoQueryFirebase=t)},null,8,["modelValue"])]),_:1},8,["text","desc"]),Object(o["k"])(s,{text:e.$t("importDatabase"),desc:e.$t("importDatabaseDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(l,{onClick:e.importDatabase},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("importAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"]),Object(o["k"])(s,{text:e.$t("exportDatabase"),desc:e.$t("exportDatabaseDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(l,{onClick:e.exportDatabase},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("exportAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"]),Object(o["k"])(s,{text:e.$t("clearDatabase"),desc:e.$t("clearDatabaseDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(l,{onClick:e.clear},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("clearAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])],64)}var G=r("ad8e"),I=r("b15b");const L=Object(o["i"])('<div class="mdc-switch__track"></div><div class="mdc-switch__handle-track"><div class="mdc-switch__handle"><div class="mdc-switch__shadow"><div class="mdc-elevation-overlay"></div></div><div class="mdc-switch__ripple"></div><div class="mdc-switch__icons"><svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24"><path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"></path></svg><svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24"><path d="M20 13H4v-2h16v2z"></path></svg></div></div></div>',2),W=[L];function V(e,t,r,a,c,n){return Object(o["x"])(),Object(o["g"])("button",{class:"mdc-switch",type:"button",role:"switch",onClick:t[0]||(t[0]=t=>e.changed())},W)}var F,R,M=r("8136"),Q=r("40ff"),B=r("4303");(function(e){e["PROCESSING"]="mdc-switch--processing",e["SELECTED"]="mdc-switch--selected",e["UNSELECTED"]="mdc-switch--unselected"})(F||(F={})),function(e){e["RIPPLE"]=".mdc-switch__ripple"}(R||(R={}));var T=r("6689");
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */function q(e,t,r){var o=z(e,t),a=o.getObservers(t);return a.push(r),function(){a.splice(a.indexOf(r),1)}}var U=new WeakMap;function z(e,t){var r=new Map;U.has(e)||U.set(e,{isEnabled:!0,getObservers:function(e){var t=r.get(e)||[];return r.has(e)||r.set(e,t),t},installedProperties:new Set});var o=U.get(e);if(o.installedProperties.has(t))return o;var a=H(e,t)||{configurable:!0,enumerable:!0,value:e[t],writable:!0},c=Object(d["a"])({},a),n=a.get,i=a.set;if("value"in a){delete c.value,delete c.writable;var s=a.value;n=function(){return s},a.writable&&(i=function(e){s=e})}return n&&(c.get=function(){return n.call(this)}),i&&(c.set=function(e){var r,a,c=n?n.call(this):e;if(i.call(this,e),o.isEnabled&&(!n||e!==c))try{for(var s=Object(d["g"])(o.getObservers(t)),l=s.next();!l.done;l=s.next()){var b=l.value;b(e,c)}}catch(p){r={error:p}}finally{try{l&&!l.done&&(a=s.return)&&a.call(s)}finally{if(r)throw r.error}}}),o.installedProperties.add(t),Object.defineProperty(e,t,c),o}function H(e,t){var r,o=e;while(o){if(r=Object.getOwnPropertyDescriptor(o,t),r)break;o=Object.getPrototypeOf(o)}return r}function K(e,t){var r=U.get(e);r&&(r.isEnabled=t)}
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */var X=function(e){function t(t){var r=e.call(this,t)||this;return r.unobserves=new Set,r}return Object(d["d"])(t,e),t.prototype.destroy=function(){e.prototype.destroy.call(this),this.unobserve()},t.prototype.observe=function(e,t){var r,o,a=this,c=[];try{for(var n=Object(d["g"])(Object.keys(t)),i=n.next();!i.done;i=n.next()){var s=i.value,l=t[s].bind(this);c.push(this.observeProperty(e,s,l))}}catch(p){r={error:p}}finally{try{i&&!i.done&&(o=n.return)&&o.call(n)}finally{if(r)throw r.error}}var b=function(){var e,t;try{for(var r=Object(d["g"])(c),o=r.next();!o.done;o=r.next()){var n=o.value;n()}}catch(i){e={error:i}}finally{try{o&&!o.done&&(t=r.return)&&t.call(r)}finally{if(e)throw e.error}}a.unobserves.delete(b)};return this.unobserves.add(b),b},t.prototype.observeProperty=function(e,t,r){return q(e,t,r)},t.prototype.setObserversEnabled=function(e,t){K(e,t)},t.prototype.unobserve=function(){var e,t;try{for(var r=Object(d["g"])(Object(d["f"])([],Object(d["e"])(this.unobserves))),o=r.next();!o.done;o=r.next()){var a=o.value;a()}}catch(c){e={error:c}}finally{try{o&&!o.done&&(t=r.return)&&t.call(r)}finally{if(e)throw e.error}}},t}(T["a"]),Y=function(e){function t(t){var r=e.call(this,t)||this;return r.handleClick=r.handleClick.bind(r),r}return Object(d["d"])(t,e),t.prototype.init=function(){this.observe(this.adapter.state,{disabled:this.stopProcessingIfDisabled,processing:this.stopProcessingIfDisabled})},t.prototype.handleClick=function(){this.adapter.state.disabled||(this.adapter.state.selected=!this.adapter.state.selected)},t.prototype.stopProcessingIfDisabled=function(){this.adapter.state.disabled&&(this.adapter.state.processing=!1)},t}(X),Z=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return Object(d["d"])(t,e),t.prototype.init=function(){e.prototype.init.call(this),this.observe(this.adapter.state,{disabled:this.onDisabledChange,processing:this.onProcessingChange,selected:this.onSelectedChange})},t.prototype.initFromDOM=function(){this.setObserversEnabled(this.adapter.state,!1),this.adapter.state.selected=this.adapter.hasClass(F.SELECTED),this.onSelectedChange(),this.adapter.state.disabled=this.adapter.isDisabled(),this.adapter.state.processing=this.adapter.hasClass(F.PROCESSING),this.setObserversEnabled(this.adapter.state,!0),this.stopProcessingIfDisabled()},t.prototype.onDisabledChange=function(){this.adapter.setDisabled(this.adapter.state.disabled)},t.prototype.onProcessingChange=function(){this.toggleClass(this.adapter.state.processing,F.PROCESSING)},t.prototype.onSelectedChange=function(){this.adapter.setAriaChecked(String(this.adapter.state.selected)),this.toggleClass(this.adapter.state.selected,F.SELECTED),this.toggleClass(!this.adapter.state.selected,F.UNSELECTED)},t.prototype.toggleClass=function(e,t){e?this.adapter.addClass(t):this.adapter.removeClass(t)},t}(Y),ee=function(e){function t(t,r){var o=e.call(this,t,r)||this;return o.root=t,o}return Object(d["d"])(t,e),t.attachTo=function(e){return new t(e)},t.prototype.initialize=function(){this.ripple=new Q["a"](this.root,this.createRippleFoundation())},t.prototype.initialSyncWithDOM=function(){var e=this.root.querySelector(R.RIPPLE);if(!e)throw new Error("Switch "+R.RIPPLE+" element is required.");this.rippleElement=e,this.root.addEventListener("click",this.foundation.handleClick),this.foundation.initFromDOM()},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.ripple.destroy(),this.root.removeEventListener("click",this.foundation.handleClick)},t.prototype.getDefaultFoundation=function(){return new Z(this.createAdapter())},t.prototype.createAdapter=function(){var e=this;return{addClass:function(t){e.root.classList.add(t)},hasClass:function(t){return e.root.classList.contains(t)},isDisabled:function(){return e.root.disabled},removeClass:function(t){e.root.classList.remove(t)},setAriaChecked:function(t){return e.root.setAttribute("aria-checked",t)},setDisabled:function(t){e.root.disabled=t},state:this}},t.prototype.createRippleFoundation=function(){return new B["a"](this.createRippleAdapter())},t.prototype.createRippleAdapter=function(){var e=this;return Object(d["a"])(Object(d["a"])({},Q["a"].createAdapter(this)),{computeBoundingRect:function(){return e.rippleElement.getBoundingClientRect()},isUnbounded:function(){return!0}})},t}(M["a"]);
/**
 * @license
 * Copyright 2021 Google Inc.
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
 */class te extends N["d"]{onValueChanged(e,t){this.ctrl&&(this.ctrl.selected=e)}mounted(){this.ctrl=ee.attachTo(this.$el),this.ctrl.selected=this.value}unmounted(){var e;null===(e=this.ctrl)||void 0===e||e.destroy()}changed(){this.ctrl&&this.$emit("update:modelValue",!this.ctrl.selected)}}Object(d["c"])([Object(N["a"])("modelValue",{type:Boolean,default:!1})],te.prototype,"value",void 0),Object(d["c"])([Object(N["e"])("value")],te.prototype,"onValueChanged",null);r("0152");te.render=V;var re=te,oe=r("81e5");let ae=class extends b["b"]{get autoQueryFirebase(){return I["a"].brainstorming.autoQueryFirebase()}set autoQueryFirebase(e){I["a"].brainstorming.setAutoQueryFirebase(e)}importDatabase(){return Object(d["b"])(this,void 0,void 0,(function*(){const e=yield G["a"].importDatabase();f["a"].inform(this.$t("importDatabaseInform",{count:e}))}))}exportDatabase(){return Object(d["b"])(this,void 0,void 0,(function*(){const e=yield G["a"].exportDatabase();f["a"].inform(this.$t("exportDatabaseInform",{count:e}))}))}clear(){G["a"].clear()}};ae=Object(d["c"])([Object(b["a"])({components:{MaterialButton:g["a"],MaterialSwitch:re,PreferenceRow:C},i18n:{messages:oe}})],ae);var ce=ae;ce.render=P;var ne=ce;function ie(e,t,r,a,c,n){const i=Object(o["E"])("material-button"),s=Object(o["E"])("preference-row");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["h"])("h2",null,Object(o["G"])(e.$t("header")),1),e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:0,text:e.$t("importNominations"),desc:e.$t("importNominationsDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.importNominations},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("importAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:1,text:e.$t("exportNominations"),desc:e.$t("exportNominationsDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.exportNominations},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("exportAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:2,text:e.$t("importWayfarer"),desc:e.$t("importWayfarerDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.importWayfarerJSON},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("importAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:3,text:e.$t("clearNominations"),desc:e.$t("clearNominationsDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.clearNominations},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("clearAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0)],64)}var se=r("2e5e"),le=r("2ea4");let de=class extends b["b"]{get idle(){return this.$store.state.service.status===j["b"].Status.idle}importNominations(){return Object(d["b"])(this,void 0,void 0,(function*(){const e=yield j["b"].importNominationsFile();f["a"].inform(this.$t("importNominationsInform",{count:e}))}))}exportNominations(){j["b"].exportNominationsFile()}importWayfarerJSON(){return Object(d["b"])(this,void 0,void 0,(function*(){const e=window.prompt(this.$t("importWayfarerPrompt"));if(!e)return;const t=yield j["b"].importWayfarerJSON(e);switch(t){case-1:f["a"].alert(this.$t("importWayfarerAlertParseError"));break;case-2:f["a"].alert(this.$t("importWayfarerAlertDataInvalid"));break;default:f["a"].inform(this.$t("importWayfarerInform",{count:t}));break}}))}clearNominations(){se["a"].clear()}};de=Object(d["c"])([Object(b["a"])({components:{MaterialButton:g["a"],PreferenceRow:C},i18n:{messages:le}})],de);var be=de;be.render=ie;var pe=be;function ue(e,t,r,a,c,n){const i=Object(o["E"])("material-switch"),s=Object(o["E"])("preference-row");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["h"])("h2",null,Object(o["G"])(e.$t("header")),1),Object(o["k"])(s,{text:e.$t("queryAfterLatest"),desc:e.$t("queryAfterLatestDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{modelValue:e.queryAfterLatest,"onUpdate:modelValue":t[0]||(t[0]=t=>e.queryAfterLatest=t)},null,8,["modelValue"])]),_:1},8,["text","desc"])],64)}var Oe=r("1dec");let fe=class extends b["b"]{get queryAfterLatest(){return I["a"].general.queryAfterLatest()}set queryAfterLatest(e){I["a"].general.setQueryAfterLatest(e)}};fe=Object(d["c"])([Object(b["a"])({components:{MaterialSwitch:re,PreferenceRow:C},i18n:{messages:Oe}})],fe);var je=fe;je.render=ue;var he=je;function me(e,t,r,a,c,n){const i=Object(o["E"])("material-button"),s=Object(o["E"])("preference-row"),l=Object(o["E"])("material-switch");return Object(o["x"])(),Object(o["g"])(o["a"],null,[Object(o["h"])("h2",null,Object(o["G"])(e.$t("header")),1),e.loaded?(Object(o["x"])(),Object(o["e"])(s,{key:0,text:e.$t("account"),desc:e.$t("accountDesc")},{default:Object(o["J"])(()=>[e.authed?(Object(o["x"])(),Object(o["e"])(i,{key:0,onClick:e.unlink},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("unlink")),1)]),_:1},8,["onClick"])):(Object(o["x"])(),Object(o["e"])(i,{key:1,onClick:e.link},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("link")),1)]),_:1},8,["onClick"]))]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.authed&&e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:1,text:e.$t("sync"),desc:e.$t("syncDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(l,{modelValue:e.sync,"onUpdate:modelValue":t[0]||(t[0]=t=>e.sync=t)},null,8,["modelValue"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.authed&&e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:2,text:e.$t("syncNow"),desc:e.$t("syncNowDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.doSync},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("syncNowAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.authed&&e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:3,text:e.$t("uploadNow"),desc:e.$t("uploadNowDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.upload},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("uploadNowAction")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.authed&&e.idle?(Object(o["x"])(),Object(o["e"])(s,{key:4,text:e.$t("migrate"),desc:e.$t("migrateDesc")},{default:Object(o["J"])(()=>[Object(o["k"])(i,{onClick:e.migrate},{default:Object(o["J"])(()=>[Object(o["j"])(Object(o["G"])(e.$t("migrate")),1)]),_:1},8,["onClick"])]),_:1},8,["text","desc"])):Object(o["f"])("",!0),e.loaded?Object(o["f"])("",!0):(Object(o["x"])(),Object(o["e"])(s,{key:5,text:e.$t("loadingGAPI")},null,8,["text"]))],64)}var ye=r("8092");let ge=class extends b["b"]{get loaded(){return this.$store.state.google.loaded}get authed(){return this.$store.state.google.authed}get idle(){return this.$store.state.service.status===j["b"].Status.idle}get sync(){return I["a"].google.sync()}set sync(e){I["a"].google.setSync(e)}link(){j["b"].signIn()}unlink(){j["b"].signOut()}doSync(){j["b"].sync()}upload(){j["b"].upload()}migrate(){j["b"].migrate(e=>{f["a"].inform(`Migrated ${e} nominations.`)})}};ge=Object(d["c"])([Object(b["a"])({components:{MaterialButton:g["a"],MaterialSwitch:re,PreferenceRow:C},i18n:{messages:ye}})],ge);var ve=ge;ve.render=me;var xe=ve,ke=r("f540");let De=class extends b["b"]{};De=Object(d["c"])([Object(b["a"])({components:{MaterialTopAppBar:p["a"],MaterialTopAppBarAdjust:u["a"],GeneralPreferences:he,GooglePreferences:xe,BrainstormingPreferences:ne,DataPreferences:pe,AboutPreferences:S},i18n:{messages:ke}})],De);var we=De;r("8a13");we.render=l;t["default"]=we},b44e:function(e){e.exports=JSON.parse('{"en":{"header":"About","openAction":"Open","appVersion":"App Version","dataVersion":"Data Version","document":"Document","documentLink":"/docs","privacy":"Privacy","privacyLink":"/docs/privacy","telegram":"Telegram Channel","repository":"Code Repository","repositoryDesc":"GitHub","exportErrors":"Export Errors","exportErrorsDesc":"Export errors logged in Potori to clipboard","exportErrorsAction":"Export","exportErrorsInform":"Exported {count} errors to clipboard."},"zh":{"header":"关于","openAction":"打开","appVersion":"应用版本","dataVersion":"数据版本","document":"文档","documentLink":"/docs/zh","privacy":"隐私","privacyLink":"/docs/zh/privacy","telegram":"Telegram频道","repository":"代码仓库","repositoryDesc":"GitHub","exportErrors":"导出错误","exportErrorsDesc":"将Potori中记录的错误导出至剪贴板","exportErrorsAction":"导出","exportErrorsInform":"已将{count}个错误导出至剪贴板。"}}')},d222:function(e,t,r){},e723:function(e,t,r){"use strict";r("6c31")},f540:function(e){e.exports=JSON.parse('{"en":{"title":"Preferences"},"zh":{"title":"偏好设置"}}')}}]);
//# sourceMappingURL=preferences.64c8f586.js.map