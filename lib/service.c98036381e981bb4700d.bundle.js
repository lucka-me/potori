(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{0:function(e,t,s){"use strict";s.d(t,"a",(function(){return v}));var n=s(3),i=s(28);class a{constructor(){this.events={authStatusChanged:()=>{},error:()=>{}}}init(){navigator.onLine&&gapi.load("client:auth2",(()=>this.initClient()))}initClient(){gapi.client.init({apiKey:"AIzaSyCqIaS8UizqjWrIKm5zV3_S8EffCWjKR-A",clientId:"361295761775-qshg0f5buh495dhubp4v5bignk7i5dh1.apps.googleusercontent.com",discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest","https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],scope:["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive.appdata"].join(" ")}).then((()=>{gapi.auth2.getAuthInstance().isSignedIn.listen(this.events.authStatusChanged),this.events.authStatusChanged(this.signedIn)}),this.events.error)}get signedIn(){return navigator.onLine&&gapi.auth2.getAuthInstance().isSignedIn.get()}get accessToken(){return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}signIn(){gapi.auth2.getAuthInstance().signIn()}signOut(){gapi.auth2.getAuthInstance().signOut()}}class r{}r.type="application/json",r.nominations="potori.json",r.bsData="bsdata.json";class o{constructor(){this.ids=new Map}download(e,t){const s=n=>{if(n.length<1)return void t(null,!1);const i=n[0].id;gapi.client.drive.files.get({fileId:i,alt:"media"}).then((a=>{if(!t(a.result,!0))return gapi.client.drive.files.delete({fileId:i}),n.splice(0,1),void s(n);this.ids.set(e,i)}))};gapi.client.drive.files.list({q:`name = '${e}'`,pageSize:10,spaces:o.folder,fields:"files(id)"}).then((e=>{const n=e.result.files;n?s(n):t(null,!1)}))}upload(e,t,s,n){let i="",a="";const l={name:e,mimeType:r.type};this.ids.has(e)?(a="PATCH",i=`https://www.googleapis.com/upload/drive/v3/files/${this.ids.get(e)}?uploadType=multipart`):(a="POST",i="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",l.parents=[o.folder]);const c=new FormData;c.append("metadata",new Blob([JSON.stringify(l)],{type:r.type})),c.append("file",t);fetch(i,{method:a,headers:new Headers({Authorization:"Bearer "+s}),body:c}).then((e=>e.json())).then((t=>{t&&t.id?(this.ids.set(e,t.id),n(!0)):n(!1,t.message)})).catch((()=>n(!1)))}}o.folder="appDataFolder";class l{constructor(){this.events={openUI:()=>{},saveUI:()=>{}}}open(e,t){this.events.openUI((s=>{if(!s)return void t(n.a.t("message:service.file.local.openFailed"));const i=new FileReader;i.onload=()=>{e(i.result)},i.readAsText(s)}))}save(e,t){this.events.saveUI(e,URL.createObjectURL(t))}}class c{constructor(){this.local=new l,this.googleDrive=new o}}const u=Date.now();class d{constructor(){this.id="",this.title="",this.image="",this.status=null,this.confirmedTime=0,this.confirmationMailId="",this.resultTime=null,this.resultMailId=null,this.lngLat=null}get imageUrl(){return"https://lh3.googleusercontent.com/"+this.image}get intelUrl(){return`https://intel.ingress.com/intel?ll=${this.lngLat.lat},${this.lngLat.lng}&z=18`}get bsUrl(){return"https://brainstorming.azurewebsites.net/watermeter.html#"+this.id}get restoreTime(){return this.confirmedTime+12096e5}get confirmedDateString(){return new Date(this.confirmedTime).toLocaleDateString()}get resultDateString(){return new Date(this.resultTime).toLocaleDateString()}get intervalString(){const e=this.resultTime?this.resultTime:u;return n.a.t("service.nomination.day",{count:Math.floor((e-this.confirmedTime)/864e5)})}get restoreIntervalString(){return n.a.t("service.nomination.day",{count:Math.floor((this.restoreTime-u)/864e5)})}get json(){let e={id:this.id,title:this.title,image:this.image,status:this.status.code,confirmedTime:this.confirmedTime,confirmationMailId:this.confirmationMailId};return this.resultTime&&(e.resultTime=this.resultTime),this.resultMailId&&(e.resultMailId=this.resultMailId),this.lngLat&&(e.lngLat={lng:this.lngLat.lng,lat:this.lngLat.lat}),e}static parse(e){if(!e.id)throw new Error("message:service.nomination.parseNoId");if(!e.title)throw new Error("message:service.nomination.parseNoTitle");if(!e.image)throw new Error("message:service.nomination.parseNoImage");if(!e.confirmedTime)throw new Error("message:service.nomination.parseNoConfirmedTime");const t=e.image.replace("\r","");if(!/^[a-zA-Z0-9]+$/.test(e.id))throw new Error("message:service.nomination.parseFormatId");if(!/^[0-9a-zA-Z\-\_]+$/.test(t))throw new Error("message:service.nomination.parseFormatImage");const s=new d;return s.id=e.id,s.title=e.title,s.image=t,s.status=v.status.codes.get(e.status),s.confirmedTime=e.confirmedTime,s.confirmationMailId=e.confirmationMailId,e.resultTime&&(s.resultTime=e.resultTime),e.resultMailId&&(s.resultMailId=e.resultMailId),e.lngLat&&(s.lngLat={lng:e.lngLat.lng,lat:e.lngLat.lat}),s}static parseId(e){return e.replace(/[^a-zA-Z0-9]/g,"").slice(-10).toLowerCase()}}class h{static nominations(e){const t={matched:!1,message:"",nominations:[]};try{const s=JSON.parse(e);if(0===s.length)return t.message=n.a.t("message:service.parseEmpty"),t;for(const e of s){const s=d.parse(e);t.nominations.push(s)}t.matched=!0}catch(e){t.nominations=[],t.matched=!1,t.message=n.a.t("message:service.parseNominationsFailed")}return t}static bsData(e){const t={matched:!1,message:"",data:null};try{t.data=new Map(JSON.parse(e)),t.matched=!0}catch(e){t.matched=!1,t.message=n.a.t("message:service.parseBsDataFailed")}return t}}class g{static nominations(e){const t=[];for(const s of e)t.push(s.json);return new Blob([JSON.stringify(t,null,4)],{type:r.type})}static bsData(e){return new Blob([JSON.stringify([...e],null,4)],{type:r.type})}}var m=s(16);class p{static mail(e,t){const s=new d;s.status=v.status.types.get(t.type),"pending"===t.type?(s.confirmedTime=parseInt(e.internalDate),s.confirmationMailId=e.id):(s.resultTime=parseInt(e.internalDate),s.resultMailId=e.id);for(let t=0;t<e.payload.headers.length;t++){const n=e.payload.headers[t];if("Subject"===n.name){const e=n.value,t=e.search(":"),i=e.search("：");s.title=e.slice((i<0?t:t<0||i<t?i:t)+1).trim();break}}for(const n of e.payload.parts){if("1"!==n.partId)continue;const e=this.base64(n.body.data),i=e.match(/googleusercontent\.com\/[0-9a-zA-Z\-\_]+/);i&&(s.image=i[0].replace("googleusercontent.com/",""),s.id=d.parseId(s.image)),"redacted"===t.scanner&&"pending"!==t.type&&(s.lngLat=this.lngLat(e)),"rejected"===t.type&&(s.status=this.reason(e,t.scanner));break}return s}static reason(e,t){const s=e.slice(0,e.search("-NianticOps"));let n=v.status.reasons.get("undeclared"),i=e.length;for(const e of v.status.reasons.values())for(const a of e.keywords.get(t)){const t=s.search(a);if(t>-1&&t<i){n=e,i=t;break}}return n}static lngLat(e){let t=e.slice(e.search("https://www.ingress.com/intel"));t=t.slice(0,t.search('">'));const s=t.slice(t.search("ll=")+3,t.search("&z=18")).split(",");return{lng:parseFloat(s[1]),lat:parseFloat(s[0])}}static base64(e){return unescape(decodeURIComponent(escape(window.atob(e.replace(/\-/g,"+").replace(/\_/g,"/")))))}}class f{constructor(){this.scanners=[],this.types=[],this.ignoreMailIds=[],this.nominations=[],this.progress={list:0,total:0,finished:0},this.events={alert:()=>{},finish:()=>{},buffer:()=>{},progress:()=>{}}}init(){for(const e of v.status.types.keys())this.types.push(e);for(const e of v.status.types.get(this.types[0]).queries.keys())this.scanners.push(e)}start(e){this.nominations=e,this.progress.list=0,this.progress.total=0,this.progress.finished=0,this.ignoreMailIds=[];for(const e of this.nominations)this.ignoreMailIds.push(e.confirmationMailId),e.resultMailId&&this.ignoreMailIds.push(e.resultMailId);for(const e of this.scanners)for(const t of this.types){const s={scanner:e,type:t};f.getListRequest(null,s).execute((e=>{this.handleListRequest(e,s,[])}))}}static getListRequest(e,t){return gapi.client.gmail.users.messages.list({userId:"me",q:v.status.types.get(t.type).queries.get(t.scanner),pageToken:e})}handleListRequest(e,t,s){if(e.result.messages&&s.push(...e.result.messages),e.result.nextPageToken){f.getListRequest(e.result.nextPageToken,t).execute((e=>{this.handleListRequest(e,t,s)}))}else{for(let e=s.length-1;e>=0;e--)for(const t of this.ignoreMailIds)if(s[e].id===t){s.splice(e,1);break}this.progress.list+=1,this.events.buffer(this.progress.list/this.scanners.length),this.processList(t,s)}}processList(e,t){this.progress.total+=t.length;const s=()=>{this.progress.list===this.scanners.length*this.types.length&&this.progress.total===this.progress.finished&&this.events.finish()};s();for(const i of t)gapi.client.gmail.users.messages.get({userId:"me",id:i.id,format:"full",metadataHeaders:"Subject"}).execute((t=>{const i=t.result;try{const t=p.mail(i,e);this.nominations.push(t)}catch(t){let s="";for(let e=0;e<i.payload.headers.length;e++){const t=i.payload.headers[e];if("Subject"===t.name){s=t.value;break}}let a=t;if("message"in t){const e=t;a=e.stack||e.message}this.events.alert(n.a.t("message:service.mari.reportParserError",{subject:s,message:`[${e.scanner}:${e.type}]${a}`}))}this.progress.finished+=1,this.events.progress(this.progress.finished/this.progress.total*(this.progress.list/this.scanners.length)),s()}))}}var v,w=s(11),y=s(17),b=s(26),I=s(9);class T{constructor(){const e=document.URL.includes("lucka.moe");this.string=`${b.a}d${I.version}-${e?"lite":"full"}`,this.full=!e}}!function(e){function t(){e.events.start();const t=[],n=[];for(let s=e.nominations.length-1;s>=0;s--){const i=e.nominations[s];if(i.id.length<1){t.push({target:i,candidates:[]}),e.nominations.splice(s,1);continue}let a=0===i.status.code;for(let t=0;t<s;t++){const n=e.nominations[t];if(i.id===n.id){n.resultMailId?(n.confirmedTime=i.confirmedTime,n.confirmationMailId=i.confirmationMailId,n.lngLat||(n.lngLat=i.lngLat)):(n.status=i.status,n.lngLat=i.lngLat,n.resultTime=i.resultTime,n.resultMailId=i.resultMailId),e.nominations.splice(s,1),a=!0;break}}a&&n.push(i)}for(const e of t)for(const t of n)e.target.title===t.title&&(e.target.resultTime<t.confirmedTime||e.candidates.push(t));s(t)}function s(t){if(t.length<1)return e.nominations.sort(((e,t)=>(e.resultTime?e.resultTime:e.confirmedTime)<(t.resultTime?t.resultTime:t.confirmedTime)?1:-1)),void function(){const t=()=>{e.events.idle()},s=e.nominations.reduce(((e,t)=>(t.lngLat||e.push(t),e)),new Array);if(s.length<1)return void t();let n=0;e.events.progressUpdate(.9);const i=()=>{n+=1,e.events.progressUpdate(.9+n/s.length*.1),n===s.length&&t()};for(const t of s)e.bs.queryLocation(t,(e=>{t.lngLat=e,i()}),i)}();const n=t[0];if(n.candidates.length<1)return t.shift(),void s(t);const i=n.candidates[0];e.events.match(n.target,i,(e=>{if(e){i.status=n.target.status,i.resultTime=n.target.resultTime,i.resultMailId=n.target.resultMailId,t.shift();for(const e of t){const t=e.candidates.indexOf(i);t<0||e.candidates.splice(t,1)}}else n.candidates.shift();s(t)}))}e.auth=new a,e.bs=new m.b,e.file=new c,e.mari=new f,e.status=new w.c,e.version=new T,e.nominations=[],e.errors=[],e.events={authStatusChanged:()=>{},progressUpdate:()=>{},bufferUpdate:()=>{},bsUpdate:()=>{},start:()=>{},idle:()=>{},clear:()=>{},match:()=>{},alert:()=>{},info:()=>{}},e.init=function(){"serviceWorker"in navigator&&window.addEventListener("load",(()=>{navigator.serviceWorker.register("/sw.js")})),n.a.use(i.a).init({fallbackLng:"en-US",keySeparator:!1,resources:y.a,ns:["general","message"],defaultNS:"general"}),e.auth.events.authStatusChanged=t=>{t||(e.nominations.length=0),e.events.authStatusChanged(t),t&&(e.events.clear(),e.events.start(),function(t){let s=!1,n=!1;const i=()=>{s&&n&&t()};e.file.googleDrive.download(r.bsData,((t,s)=>{if(!t)return n=!0,i(),!0;try{e.bs.data=new Map(t)}catch(e){return!s&&(n=!0,i(),!0)}return n=!0,i(),!0})),e.file.googleDrive.download(r.nominations,((t,n)=>{if(!t)return s=!0,i(),!0;try{const s=t;e.nominations.length=0;for(const t of s)try{e.nominations.push(d.parse(t))}catch(e){}}catch(e){return!n&&(s=!0,i(),!0)}return s=!0,i(),!0}))}((()=>{e.mari.start(e.nominations)})))},e.auth.events.error=t=>{e.events.alert(JSON.stringify(t,null,2))},e.auth.init(),e.mari.events.alert=t=>e.events.alert(t),e.mari.events.progress=t=>e.events.progressUpdate(.9*t),e.mari.events.buffer=t=>e.events.bufferUpdate(t),e.mari.events.finish=()=>t(),e.mari.init(),window.addEventListener("error",(t=>{e.errors.push(t)}))},e.open=function(){e.events.clear(),e.file.local.open((s=>{const i=h.nominations(s);if(i.matched)return e.nominations.length=0,e.nominations.push(...i.nominations),void t();const a=h.bsData(s);return a.matched?(e.bs.data=a.data,e.nominations.length>0&&e.events.bsUpdate(),void e.events.info(n.a.t("message:service.loadBsData"))):void 0}),e.events.alert)},e.save=function(){e.nominations.length<1?e.events.alert(n.a.t("message:service.nominationsEmpty")):(e.file.local.save(r.nominations,g.nominations(e.nominations)),window.setTimeout((()=>{e.file.local.save(r.bsData,g.bsData(e.bs.data))}),2e3))},e.upload=function(){let t=!1,s=!1;const i=()=>{t&&s&&e.events.info(n.a.t("message:service.uploaded"))};e.file.googleDrive.upload(r.nominations,g.nominations(e.nominations),e.auth.accessToken,((s,a)=>{t=!0,s||e.events.alert(`${n.a.t("message:service.uploadNominationsError")}${a?"\n"+a:""}`),i()})),e.file.googleDrive.upload(r.bsData,g.bsData(e.bs.data),e.auth.accessToken,((t,a)=>{s=!0,t||e.events.alert(`${n.a.t("message:service.uploadBsDataError")}${a?"\n"+a:""}`),i()}))},e.importJSON=function(t){let s;try{s=JSON.parse(t)}catch(t){return void e.events.alert(n.a.t("message:service.parseError"))}if(!s.result||s.result.length<1)return void e.events.alert(n.a.t("message:service.invalidData"));const i=new Map;for(const t of e.nominations)i.set(t.id,t);let a=0;for(const e of s.result){const t=e.imageUrl.replace("https://lh3.googleusercontent.com/",""),s=d.parseId(t);if(!i.has(s))continue;const n=i.get(s);n.title=e.title,n.lngLat={lng:parseFloat(e.lng),lat:parseFloat(e.lat)},a+=1}e.events.info(n.a.t("message:service.imported",{count:a})),e.events.idle()},e.updateBsData=function(){e.bs.update(e.nominations,(()=>{e.events.bsUpdate(),e.events.info(n.a.t("message:service.bsDataUpdated"))}))},e.clearBsData=function(){e.bs.clear()}}(v||(v={}))},11:function(e,t,s){"use strict";s.d(t,"b",(function(){return a})),s.d(t,"a",(function(){return r})),s.d(t,"c",(function(){return o}));var n=s(9);class i{constructor(e,t,s,n){this.key=e,this.code=t,this.title=s,this.icon=n}}class a extends i{constructor(e,t,s,n,i){super(e,t,s,n),this.queries=i}}class r extends i{constructor(e,t,s,n,i,a){super(e,t,s,n),this.color=i,this.keywords=a}}class o{constructor(){this.version=n.version,this.types=new Map,this.reasons=new Map,this.codes=new Map;for(const e of n.types){const t=new a(e.key,e.code,e.title,e.icon,new Map(e.queries));this.types.set(e.key,t),this.codes.set(e.code,t)}for(const e of n.reasons){const t=new r(e.key,e.code,e.title,e.icon,e.color,new Map(e.keywords));this.reasons.set(e.key,t),this.codes.set(e.code,t)}}typeMatched(e,t){return t<101?e===t:e>100}getTypeByCode(e){return 0===e?"pending":1===e?"accepted":"rejected"}getReasonByCode(e){if(e<100)return null;for(const t of this.reasons.values())if(t.code===e)return t;return null}}},16:function(e,t,s){"use strict";s.d(t,"a",(function(){return a}));var n,i=s(0);!function(e){e.FIREBASE_ERROR="message:service.brainstorming.firebaseError",e.NOT_EXISTS="message:service.brainstorming.notExists",e.EARLY="message:service.brainstorming.early"}(n||(n={}));const a={quality:"service.brainstorming.quality",description:"service.brainstorming.description",cultural:"service.brainstorming.cultural",uniqueness:"service.brainstorming.uniqueness",safety:"service.brainstorming.safety",location:"service.brainstorming.location"};class r{constructor(){this.data=new Map,this.reference=null}query(e,t,s){this.beforeCreate(e)?s(n.EARLY):this.data.has(e.id)?t(this.data.get(e.id)):i.a.version.full?this.queryFirebase(e,t,s):s(n.NOT_EXISTS)}queryLocation(e,t,s){this.query(e,(e=>{t({lng:parseFloat(e.lng),lat:parseFloat(e.lat)})}),s)}update(e,t){const s=[];for(const t of e)this.beforeCreate(t)||s.push(t);let n=s.length;const i=()=>{n--,n<1&&t()};for(const e of s)this.queryFirebase(e,(t=>{this.data.set(e.id,t),i()}),i)}queryFirebase(e,t,i){this.beforeCreate(e)?i(n.EARLY):Promise.all([s.e(0).then(s.bind(null,53)),s.e(0).then(s.bind(null,59))]).then((([s,a])=>{if(!this.reference){const e=s.default.initializeApp({databaseURL:"https://oprbrainstorming.firebaseio.com"});this.reference||(this.reference=e.database().ref("c/reviews/"))}this.reference.child(e.id).once("value",(e=>{const s=e.val();s?t(s):i(n.NOT_EXISTS)}),(()=>i(n.FIREBASE_ERROR)))}))}clear(){this.data.clear()}beforeCreate(e){return e.status.code>0&&e.resultTime<15187968e5}analyse(e){const t={review:0,nomination:0,rate:new Map,reviewTimes:[],synch:{total:0,synched:0}},s=Object.keys(a);for(const e of s)t.rate.set(e,[]);const n=(e,s)=>{e[s]&&t.rate.get(s).push(parseInt(e[s]))};for(const i of e){if(!this.data.has(i.id))continue;const e=this.data.get(i.id),a=[];for(const o of Object.keys(e)){if(!o.startsWith("review"))continue;const l=e[o];if(!l.stars)continue;t.review+=1,a.push(l.stars);const c=l.JSON;for(const e of s)n(c,e);t.reviewTimes.push(l.Timestamp),i.status.code<1||(t.synch.total+=1,r.isSynched(l.stars,i.status.code)&&(t.synch.synched+=1))}a.length<1||(t.nomination+=1)}return t}static isSynched(e,t){const s=i.a.status.reasons;if("D"===e&&t===s.get("duplicated").code)return!0;const n=parseFloat(e);if(isNaN(n))return!1;if(t===i.a.status.types.get("accepted").code||t===s.get("close").code){if(n>=3)return!0}else if(n<3)return!0;return!1}}t.b=r}}]);