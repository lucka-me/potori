(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["preferences"],{"041d":function(e,t,c){},"0d7f":function(e){e.exports=JSON.parse('{"version":"0.9.0","build":"1374"}')},1703:function(e,t,c){"use strict";var n=c("7a23");const r=Object(n["h"])("span",{class:"mdc-button__ripple"},null,-1),o={class:"mdc-button__labbel"};function a(e,t,c,a,i,s){return Object(n["q"])(),Object(n["d"])("button",{class:e.className},[r,Object(n["h"])("span",o,[Object(n["w"])(e.$slots,"default")])],2)}var i=c("9ab4"),s=c("40ff"),l=c("1b40");class d extends l["d"]{get className(){let e="mdc-button";return this.outlined?e+=" mdc-button--outlined":this.raised&&(e+=" mdc-button--raised"),e}mounted(){this.ctrl=s["a"].attachTo(this.$el),this.ctrl.unbounded=!0}updated(){var e;null===(e=this.ctrl)||void 0===e||e.destroy(),this.ctrl=s["a"].attachTo(this.$el),this.ctrl.unbounded=!0}unmounted(){var e;null===(e=this.ctrl)||void 0===e||e.destroy()}}Object(i["b"])([Object(l["c"])(Boolean)],d.prototype,"outlined",void 0),Object(i["b"])([Object(l["c"])(Boolean)],d.prototype,"raised",void 0);c("ddb3");d.render=a;t["a"]=d},7597:function(e,t,c){},a55d:function(e,t,c){"use strict";c.r(t);var n=c("7a23");const r={class:"preferences"},o=Object(n["h"])("hr",null,null,-1),a=Object(n["h"])("hr",null,null,-1),i=Object(n["h"])("hr",null,null,-1);function s(e,t,c,s,l,d){const u=Object(n["x"])("material-top-app-bar"),b=Object(n["x"])("material-top-app-bar-adjust"),O=Object(n["x"])("general-preferences"),j=Object(n["x"])("google-preferences"),h=Object(n["x"])("data-preferences"),p=Object(n["x"])("about-preferences");return Object(n["q"])(),Object(n["d"])(n["a"],null,[Object(n["h"])(u,{title:"Preferences","navi-back":""}),Object(n["h"])(b),Object(n["h"])("main",r,[Object(n["h"])(O),o,Object(n["h"])(j),a,Object(n["h"])(h),i,Object(n["h"])(p)])],64)}var l=c("9ab4"),d=c("ce1f"),u=c("2281"),b=c("4892");const O=Object(n["h"])("h2",null,"About",-1),j=Object(n["g"])("Open"),h=Object(n["g"])("Open"),p=Object(n["g"])("Export");function f(e,t,c,r,o,a){const i=Object(n["x"])("preference-row"),s=Object(n["x"])("material-button");return Object(n["q"])(),Object(n["d"])(n["a"],null,[O,Object(n["h"])(i,{text:"App Version",desc:e.appVersion},null,8,["desc"]),Object(n["h"])(i,{text:"Data Version",desc:e.dataVersion},null,8,["desc"]),Object(n["h"])(i,{text:"Document"},{default:Object(n["C"])(()=>[Object(n["h"])(s,{onClick:e.openDoc},{default:Object(n["C"])(()=>[j]),_:1},8,["onClick"])]),_:1}),Object(n["h"])(i,{text:"Code Repository",desc:"GitHub"},{default:Object(n["C"])(()=>[Object(n["h"])(s,{onClick:e.openRepo},{default:Object(n["C"])(()=>[h]),_:1},8,["onClick"])]),_:1}),e.hasErrors?(Object(n["q"])(),Object(n["d"])(i,{key:0,text:"Export Errors",desc:"Export errors logged by Potori"},{default:Object(n["C"])(()=>[Object(n["h"])(s,{onClick:e.exportErrors},{default:Object(n["C"])(()=>[p]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0)],64)}var C,m=c("6022"),v=c("0d7f"),g=c("eded");(function(e){e.full=document.URL.includes("lucka.moe"),e.text=`${v.version}-${e.full?"lite":"full"} (${v.build})`,e.data=g.version})(C||(C={}));var y=c("1703");const k={class:"row"},_={class:"text"},x={key:0,class:"desc"},w={key:0,class:"spacer"},E={key:1,class:"action"};function A(e,t,c,r,o,a){return Object(n["q"])(),Object(n["d"])("div",k,[Object(n["h"])("div",_,[Object(n["h"])("span",null,Object(n["z"])(e.text),1),e.desc?(Object(n["q"])(),Object(n["d"])("span",x,Object(n["z"])(e.desc),1)):Object(n["e"])("",!0)]),e.$slots.default?(Object(n["q"])(),Object(n["d"])("div",w)):Object(n["e"])("",!0),e.$slots.default?(Object(n["q"])(),Object(n["d"])("div",E,[Object(n["w"])(e.$slots,"default")])):Object(n["e"])("",!0)])}var S=c("1b40");class N extends S["d"]{}Object(l["b"])([Object(S["c"])(String)],N.prototype,"text",void 0),Object(l["b"])([Object(S["c"])(String)],N.prototype,"desc",void 0);c("e723");N.render=A;var q=N;let L=class extends d["b"]{get appVersion(){return C.text}get dataVersion(){return C.data}get hasErrors(){return m["a"].errors.length>0}openDoc(){window.open("/docs","_blank")}openRepo(){window.open("https://github.com/lucka-me/potori","_blank")}exportErrors(){let e="";for(const c of m["a"].errors){let t=c.message;if("message"in c.error){const e=c.error;t=e.stack||e.message}e+=`[${c.filename}][${c.lineno}:${c.colno}]${t}\n`}const t=document.createElement("textarea");t.value=e,t.readOnly=!0,document.body.append(t),t.select(),document.execCommand("copy"),t.remove()}};L=Object(l["b"])([Object(d["a"])({components:{MaterialButton:y["a"],PreferenceRow:q}})],L);var D=L;D.render=f;var R=D;const P=Object(n["h"])("h2",null,"Data",-1),$=Object(n["g"])("Import"),T=Object(n["g"])("Export"),I=Object(n["g"])("Import"),V=Object(n["g"])("Clear");function B(e,t,c,r,o,a){const i=Object(n["x"])("material-button"),s=Object(n["x"])("preference-row");return Object(n["q"])(),Object(n["d"])(n["a"],null,[P,e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:0,text:"Import Nominations",desc:"Import nominations from file"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.importNominations},{default:Object(n["C"])(()=>[$]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:1,text:"Export Nominations",desc:"Export nominations to file"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.exportNominations},{default:Object(n["C"])(()=>[T]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:2,text:"Import Wayfarer JSON",desc:"Export JSON from https://wayfarer.nianticlabs.com/api/v1/vault/manage"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.importWayfarerJSON},{default:Object(n["C"])(()=>[I]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:3,text:"Clear Nominations",desc:"Clear all nominations from local storage"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.clearNominations},{default:Object(n["C"])(()=>[V]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0)],64)}var G=c("0613");let H=class extends d["b"]{get idle(){return this.$store.state.status===G["a"].Status.idle}importNominations(){m["a"].importNominationsFile()}exportNominations(){m["a"].exportNominationsFile()}importWayfarerJSON(){const e=window.prompt("Paste Wayfarer JSON");e&&m["a"].importWayfarerJSON(e)}clearNominations(){m["a"].clearNominations()}};H=Object(l["b"])([Object(d["a"])({components:{MaterialButton:y["a"],PreferenceRow:q}})],H);var M=H;M.render=B;var U=M;const J=Object(n["h"])("h2",null,"General",-1);function W(e,t,c,r,o,a){const i=Object(n["x"])("material-switch"),s=Object(n["x"])("preference-row");return Object(n["q"])(),Object(n["d"])(n["a"],null,[J,Object(n["h"])(s,{text:"Query After Latest",desc:"Query mails received after the latest one"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{modelValue:e.queryAfterLatest,"onUpdate:modelValue":t[1]||(t[1]=t=>e.queryAfterLatest=t)},null,8,["modelValue"])]),_:1})],64)}var F=c("b15b");const K={class:"mdc-switch"},Q=Object(n["h"])("div",{class:"mdc-switch__track"},null,-1),z=Object(n["h"])("div",{class:"mdc-switch__thumb-underlay"},[Object(n["h"])("div",{class:"mdc-switch__thumb"}),Object(n["h"])("input",{type:"checkbox",class:"mdc-switch__native-control",role:"switch"})],-1);function X(e,t,c,r,o,a){return Object(n["q"])(),Object(n["d"])("div",K,[Q,z])}var Y=c("8136"),Z=c("9373"),ee=c("d87f"),te=c("40ff"),ce=c("4303"),ne=c("6689"),re={CHECKED:"mdc-switch--checked",DISABLED:"mdc-switch--disabled"},oe={ARIA_CHECKED_ATTR:"aria-checked",NATIVE_CONTROL_SELECTOR:".mdc-switch__native-control",RIPPLE_SURFACE_SELECTOR:".mdc-switch__thumb-underlay"},ae=function(e){function t(c){return e.call(this,Object(l["a"])(Object(l["a"])({},t.defaultAdapter),c))||this}return Object(l["c"])(t,e),Object.defineProperty(t,"strings",{get:function(){return oe},enumerable:!0,configurable:!0}),Object.defineProperty(t,"cssClasses",{get:function(){return re},enumerable:!0,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},setNativeControlChecked:function(){},setNativeControlDisabled:function(){},setNativeControlAttr:function(){}}},enumerable:!0,configurable:!0}),t.prototype.setChecked=function(e){this.adapter.setNativeControlChecked(e),this.updateAriaChecked_(e),this.updateCheckedStyling_(e)},t.prototype.setDisabled=function(e){this.adapter.setNativeControlDisabled(e),e?this.adapter.addClass(re.DISABLED):this.adapter.removeClass(re.DISABLED)},t.prototype.handleChange=function(e){var t=e.target;this.updateAriaChecked_(t.checked),this.updateCheckedStyling_(t.checked)},t.prototype.updateCheckedStyling_=function(e){e?this.adapter.addClass(re.CHECKED):this.adapter.removeClass(re.CHECKED)},t.prototype.updateAriaChecked_=function(e){this.adapter.setNativeControlAttr(oe.ARIA_CHECKED_ATTR,""+!!e)},t}(ne["a"]),ie=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.ripple_=t.createRipple_(),t}return Object(l["c"])(t,e),t.attachTo=function(e){return new t(e)},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.ripple_.destroy(),this.nativeControl_.removeEventListener("change",this.changeHandler_)},t.prototype.initialSyncWithDOM=function(){var e=this;this.changeHandler_=function(){for(var t,c=[],n=0;n<arguments.length;n++)c[n]=arguments[n];return(t=e.foundation).handleChange.apply(t,Object(l["d"])(c))},this.nativeControl_.addEventListener("change",this.changeHandler_),this.checked=this.checked},t.prototype.getDefaultFoundation=function(){var e=this,t={addClass:function(t){return e.root.classList.add(t)},removeClass:function(t){return e.root.classList.remove(t)},setNativeControlChecked:function(t){return e.nativeControl_.checked=t},setNativeControlDisabled:function(t){return e.nativeControl_.disabled=t},setNativeControlAttr:function(t,c){return e.nativeControl_.setAttribute(t,c)}};return new ae(t)},Object.defineProperty(t.prototype,"ripple",{get:function(){return this.ripple_},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"checked",{get:function(){return this.nativeControl_.checked},set:function(e){this.foundation.setChecked(e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"disabled",{get:function(){return this.nativeControl_.disabled},set:function(e){this.foundation.setDisabled(e)},enumerable:!0,configurable:!0}),t.prototype.createRipple_=function(){var e=this,t=ae.strings.RIPPLE_SURFACE_SELECTOR,c=this.root.querySelector(t),n=Object(l["a"])(Object(l["a"])({},te["a"].createAdapter(this)),{addClass:function(e){return c.classList.add(e)},computeBoundingRect:function(){return c.getBoundingClientRect()},deregisterInteractionHandler:function(t,c){e.nativeControl_.removeEventListener(t,c,Object(Z["a"])())},isSurfaceActive:function(){return Object(ee["c"])(e.nativeControl_,":active")},isUnbounded:function(){return!0},registerInteractionHandler:function(t,c){e.nativeControl_.addEventListener(t,c,Object(Z["a"])())},removeClass:function(e){c.classList.remove(e)},updateCssVariable:function(e,t){c.style.setProperty(e,t)}});return new te["a"](this.root,new ce["a"](n))},Object.defineProperty(t.prototype,"nativeControl_",{get:function(){var e=ae.strings.NATIVE_CONTROL_SELECTOR;return this.root.querySelector(e)},enumerable:!0,configurable:!0}),t}(Y["a"]);class se extends S["d"]{mounted(){this.ctrl=ie.attachTo(this.$el),this.ctrl.checked=this.value,this.ctrl.listen("change",this.changed)}updated(){var e;null===(e=this.ctrl)||void 0===e||e.destroy(),this.ctrl=ie.attachTo(this.$el),this.ctrl.checked=this.value,this.ctrl.listen("change",this.changed)}unmounted(){var e;null===(e=this.ctrl)||void 0===e||e.destroy()}changed(){this.ctrl&&this.$emit("update:modelValue",this.ctrl.checked)}}Object(l["b"])([Object(S["a"])("modelValue",{type:Boolean,default:!1})],se.prototype,"value",void 0);c("e4ce");se.render=X;var le=se;let de=class extends d["b"]{get queryAfterLatest(){return F["a"].general.queryAfterLatest()}set queryAfterLatest(e){F["a"].general.setQueryAfterLatest(e)}};de=Object(l["b"])([Object(d["a"])({components:{MaterialSwitch:le,PreferenceRow:q}})],de);var ue=de;ue.render=W;var be=ue;const Oe=Object(n["h"])("h2",null,"Google",-1),je=Object(n["g"])("Unlink"),he=Object(n["g"])("Link"),pe=Object(n["g"])("Sync"),fe=Object(n["g"])("Upload"),Ce=Object(n["g"])("Migrate");function me(e,t,c,r,o,a){const i=Object(n["x"])("material-button"),s=Object(n["x"])("preference-row"),l=Object(n["x"])("material-switch");return Object(n["q"])(),Object(n["d"])(n["a"],null,[Oe,e.loaded?(Object(n["q"])(),Object(n["d"])(s,{key:0,text:"Account",desc:"Link / unlink Google Account"},{default:Object(n["C"])(()=>[e.authed?(Object(n["q"])(),Object(n["d"])(i,{key:0,onClick:e.unlink},{default:Object(n["C"])(()=>[je]),_:1},8,["onClick"])):(Object(n["q"])(),Object(n["d"])(i,{key:1,onClick:e.link},{default:Object(n["C"])(()=>[he]),_:1},8,["onClick"]))]),_:1})):Object(n["e"])("",!0),e.authed&&e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:1,text:"Sync Google Drive",desc:"Sync with Google Drive when refresh"},{default:Object(n["C"])(()=>[Object(n["h"])(l,{modelValue:e.sync,"onUpdate:modelValue":t[1]||(t[1]=t=>e.sync=t)},null,8,["modelValue"])]),_:1})):Object(n["e"])("",!0),e.authed&&e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:2,text:"Sync Now",desc:"Sync with Google Drive"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.doSync},{default:Object(n["C"])(()=>[pe]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.authed&&e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:3,text:"Upload Now",desc:"Upload data to Google Drive"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.upload},{default:Object(n["C"])(()=>[fe]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.authed&&e.idle?(Object(n["q"])(),Object(n["d"])(s,{key:4,text:"Migrate",desc:"Migrate data from Potori before 0.8.0"},{default:Object(n["C"])(()=>[Object(n["h"])(i,{onClick:e.migrate},{default:Object(n["C"])(()=>[Ce]),_:1},8,["onClick"])]),_:1})):Object(n["e"])("",!0),e.loaded?Object(n["e"])("",!0):(Object(n["q"])(),Object(n["d"])(s,{key:5,text:"Loading Google API"}))],64)}let ve=class extends d["b"]{get loaded(){return this.$store.state.gapiLoaded}get authed(){return this.$store.state.gapiAuthed}get idle(){return this.$store.state.status===G["a"].Status.idle}get sync(){return F["a"].google.sync()}set sync(e){F["a"].google.setSync(e)}link(){m["a"].signIn()}unlink(){m["a"].signOut()}doSync(){m["a"].sync()}upload(){m["a"].upload(()=>{})}migrate(){m["a"].migrate()}};ve=Object(l["b"])([Object(d["a"])({components:{MaterialButton:y["a"],MaterialSwitch:le,PreferenceRow:q}})],ve);var ge=ve;ge.render=me;var ye=ge;let ke=class extends d["b"]{};ke=Object(l["b"])([Object(d["a"])({components:{MaterialTopAppBar:u["a"],MaterialTopAppBarAdjust:b["a"],GeneralPreferences:be,GooglePreferences:ye,DataPreferences:U,AboutPreferences:R}})],ke);var _e=ke;c("f1e8");_e.render=s;t["default"]=_e},ab45:function(e,t,c){},ddb3:function(e,t,c){"use strict";c("7597")},e4ce:function(e,t,c){"use strict";c("041d")},e723:function(e,t,c){"use strict";c("e979")},e979:function(e,t,c){},f1e8:function(e,t,c){"use strict";c("ab45")}}]);
//# sourceMappingURL=preferences.3f1fc0d4.js.map