(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["dashboard"],{1449:function(t,e,c){"use strict";c("47b8")},1703:function(t,e,c){"use strict";var a=c("7a23");const s=Object(a["g"])("span",{class:"mdc-button__ripple"},null,-1),n={class:"mdc-button__labbel"};function r(t,e,c,r,o,i){return Object(a["p"])(),Object(a["d"])("button",{class:t.className},[s,Object(a["g"])("span",n,[Object(a["v"])(t.$slots,"default")])],2)}var o=c("9ab4"),i=c("40ff"),l=c("ce1f");let d=class extends l["b"]{get className(){let t="mdc-button";return this.outlined?t+=" mdc-button--outlined":this.raised&&(t+=" mdc-button--raised"),t}mounted(){this.ctrl=i["a"].attachTo(this.$el),this.ctrl.unbounded=!0}updated(){var t;null===(t=this.ctrl)||void 0===t||t.destroy(),this.ctrl=i["a"].attachTo(this.$el),this.ctrl.unbounded=!0}unmounted(){var t;null===(t=this.ctrl)||void 0===t||t.destroy()}};d=Object(o["b"])([Object(l["a"])({props:{outlined:Boolean,raised:Boolean},components:{}})],d);var b=d;c("668a");b.render=r;e["a"]=b},"1b2e":function(t,e,c){},"47b8":function(t,e,c){},"668a":function(t,e,c){"use strict";c("1b2e")},7277:function(t,e,c){"use strict";c.r(e);var a=c("7a23");const s={class:"dashboard"};function n(t,e,c,n,r,o){const i=Object(a["w"])("material-icon-button"),l=Object(a["w"])("material-top-app-bar"),d=Object(a["w"])("material-top-app-bar-adjust"),b=Object(a["w"])("status"),u=Object(a["w"])("highlight"),j=Object(a["w"])("gallery"),O=Object(a["w"])("scanners"),p=Object(a["w"])("reasons");return Object(a["p"])(),Object(a["d"])(a["a"],null,[Object(a["g"])(l,{title:"Dashboard"},{default:Object(a["B"])(()=>[t.canRefresh?(Object(a["p"])(),Object(a["d"])(i,{key:0,icon:"redo",onClick:t.refresh},null,8,["onClick"])):Object(a["e"])("",!0),Object(a["g"])(i,{icon:"cog",onClick:t.openPreference},null,8,["onClick"])]),_:1}),Object(a["g"])(d),Object(a["g"])("main",s,[Object(a["g"])(b),t.$store.getters.empty?Object(a["e"])("",!0):(Object(a["p"])(),Object(a["d"])(u,{key:0})),t.$store.getters.empty?Object(a["e"])("",!0):(Object(a["p"])(),Object(a["d"])(j,{key:1})),t.$store.getters.empty?Object(a["e"])("",!0):(Object(a["p"])(),Object(a["d"])(O,{key:2})),t.$store.getters.empty?Object(a["e"])("",!0):(Object(a["p"])(),Object(a["d"])(p,{key:3}))])],64)}var r=c("9ab4"),o=c("ce1f"),i=c("6022"),l=c("0613"),d=c("81dd"),b=c("2281"),u=c("4892");const j={class:"status"},O={key:0},p={key:1},g=Object(a["f"])("Link Google Account"),h=Object(a["f"])("Manually Match"),m={key:4},f={key:5},v={key:6};function y(t,e,c,s,n,r){const o=Object(a["w"])("material-button");return Object(a["p"])(),Object(a["d"])("div",j,[t.processingMails?(Object(a["p"])(),Object(a["d"])("div",O,"Processing Mails")):t.syncing?(Object(a["p"])(),Object(a["d"])("div",p,"Syncing")):t.gapiLoaded&&!t.authed?(Object(a["p"])(),Object(a["d"])(o,{key:2,outlined:"",onClick:t.link},{default:Object(a["B"])(()=>[g]),_:1},8,["onClick"])):t.requestMatch?(Object(a["p"])(),Object(a["d"])(o,{key:3,outlined:"",onClick:t.match},{default:Object(a["B"])(()=>[h]),_:1},8,["onClick"])):t.gapiLoaded&&t.$store.getters.empty?(Object(a["p"])(),Object(a["d"])("div",m,"Please refresh to get nominations")):!t.gapiLoaded&&t.$store.getters.empty?(Object(a["p"])(),Object(a["d"])("div",f,"Loading Google API")):(Object(a["p"])(),Object(a["d"])("div",v," Latest: XXX "))])}var k=c("1703");let w=class extends o["b"]{get gapiLoaded(){return this.$store.state.gapiLoaded}get authed(){return this.$store.state.gapiAuthed}get idle(){return this.$store.state.status===l["a"].Status.idle}get processingMails(){return this.$store.state.status===l["a"].Status.processingMails}get syncing(){return this.$store.state.status===l["a"].Status.syncing}get requestMatch(){return this.$store.state.status===l["a"].Status.requestMatch}link(){i["a"].signIn()}match(){this.$router.push({path:"/match"})}};w=Object(r["b"])([Object(o["a"])({components:{MaterialButton:k["a"]}})],w);var $=w;$.render=y;var C=$;const M=Object(a["g"])("div",{class:"title"},"Hightlight",-1),B={class:"card-grid"};function S(t,e,c,s,n,r){const o=Object(a["w"])("dashboard-card");return Object(a["p"])(),Object(a["d"])(a["a"],null,[M,Object(a["g"])("div",B,[Object(a["g"])(o,{title:"All",icon:"arrow-up",count:t.$store.state.nominations.length,onClick:t.open},null,8,["count","onClick"]),(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["u"])(t.statuses,e=>(Object(a["p"])(),Object(a["d"])(o,{key:e.code,title:e.title,icon:e.icon,count:t.$store.getters.count(e.predicator),onClick:c=>t.open(e)},null,8,["title","icon","count","onClick"]))),128))])],64)}var _=c("ce89");const x={class:"content"},q={class:"label"},D={class:"title"},L={class:"count"};function A(t,e,c,s,n,r){const o=Object(a["w"])("material-icon"),i=Object(a["w"])("material-card");return Object(a["p"])(),Object(a["d"])(i,{class:"dashboard-card"},{default:Object(a["B"])(()=>[Object(a["g"])("div",x,[Object(a["g"])("div",q,[Object(a["g"])(o,{icon:t.icon,"fixed-width":""},null,8,["icon"]),Object(a["g"])("span",D,Object(a["y"])(t.title),1)]),Object(a["g"])("div",L,Object(a["y"])(t.count),1)])]),_:1})}var I=c("e3a9"),P=c("7e13");let N=class extends o["b"]{};N=Object(r["b"])([Object(o["a"])({props:{icon:String,title:String,count:Number},components:{MaterialCard:I["a"],MaterialIcon:P["a"]}})],N);var T=N;c("c448");T.render=A;var R=T;let G=class extends o["b"]{get statuses(){const t=[];for(const e of _["a"].status.values())t.push(e);return t}open(t){const e={path:"/list"};t&&(e.query={status:t.code}),this.$router.push(e)}};G=Object(r["b"])([Object(o["a"])({components:{DashboardCard:R}})],G);var X=G;X.render=S;var H=X;const J=Object(a["g"])("div",{class:"title"},"Last 30 Days",-1),U={class:"gallery"},W={class:"caption"};function z(t,e,c,s,n,r){const o=Object(a["w"])("material-icon"),i=Object(a["w"])("material-card");return Object(a["p"])(),Object(a["d"])(a["a"],null,[J,Object(a["g"])("div",U,[(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["u"])(t.nominations,e=>(Object(a["p"])(),Object(a["d"])(i,{key:e.id,image:e.imageUrl,"square-image":"",onClick:c=>t.open(e.id)},{default:Object(a["B"])(()=>[Object(a["g"])("div",W,[Object(a["g"])(o,{icon:e.statusData.icon,"fixed-width":""},null,8,["icon"]),Object(a["g"])("span",null,Object(a["y"])(e.title),1)])]),_:2},1032,["image","onClick"]))),128))])],64)}var E,F=c("a7a0");let K=E=class extends o["b"]{get nominations(){return this.$store.state.nominations.filter(E.predicator).sort(F["a"].comparatorByTime)}open(t){this.$router.push({path:"/details",query:{id:t}})}};K.datePast30Days=Date.now()-2592e6,K.predicator=t=>t.confirmedTime>E.datePast30Days||t.resultTime>E.datePast30Days,K=E=Object(r["b"])([Object(o["a"])({components:{MaterialCard:I["a"],MaterialIcon:P["a"]}})],K);var Q=K;c("7d6a");Q.render=z;var V=Q;const Y=Object(a["g"])("div",{class:"title"},"Scanners",-1),Z={class:"card-grid"};function tt(t,e,c,s,n,r){const o=Object(a["w"])("dashboard-card");return Object(a["p"])(),Object(a["d"])(a["a"],null,[Y,Object(a["g"])("div",Z,[(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["u"])(t.scanners,e=>(Object(a["p"])(),Object(a["d"])(o,{key:e.scanner.code,title:e.scanner.title,icon:"mobile-alt",count:e.count,onClick:c=>t.open(e.scanner)},null,8,["title","count","onClick"]))),128))])],64)}let et=class extends o["b"]{get scanners(){const t=[];for(const e of _["a"].scanner.values()){if(e.code===_["a"].ScannerCode.Unknown)continue;const c=this.$store.getters.count(e.predicator);c<1||t.push({scanner:e,count:c})}return t}open(t){this.$router.push({path:"/list",query:{scanner:t.code}})}};et=Object(r["b"])([Object(o["a"])({components:{DashboardCard:R}})],et);var ct=et;ct.render=tt;var at=ct;const st={class:"title title-with-action"},nt=Object(a["g"])("span",null,"Reasons",-1),rt=Object(a["g"])("div",{class:"spacer"},null,-1),ot={class:"card-grid"};function it(t,e,c,s,n,r){const o=Object(a["w"])("material-button"),i=Object(a["w"])("dashboard-card");return Object(a["p"])(),Object(a["d"])(a["a"],null,[Object(a["g"])("div",st,[nt,rt,Object(a["g"])(o,{onClick:t.toggleMore},{default:Object(a["B"])(()=>[Object(a["f"])(Object(a["y"])(t.more?"Less":"More"),1)]),_:1},8,["onClick"])]),Object(a["g"])("div",ot,[(Object(a["p"])(!0),Object(a["d"])(a["a"],null,Object(a["u"])(t.reasons,e=>(Object(a["p"])(),Object(a["d"])(i,{key:e.reason.code,title:e.reason.title,icon:e.reason.icon,count:e.count,onClick:c=>t.open(e.reason)},null,8,["title","icon","count","onClick"]))),128))])],64)}let lt=class extends o["b"]{constructor(){super(...arguments),this.more=!1}get reasons(){const t=[];for(const e of _["a"].reason.values()){const c=this.$store.getters.count(e.predicator);if(!(c<1)&&(t.push({reason:e,count:c}),!this.more&&t.length>3))break}return t}toggleMore(){this.more=!this.more}open(t){this.$router.push({path:"/list",query:{reason:t.code}})}};lt=Object(r["b"])([Object(o["a"])({components:{MaterialButton:k["a"],DashboardCard:R}})],lt);var dt=lt;c("1449");dt.render=it;var bt=dt;let ut=class extends o["b"]{get canRefresh(){return this.$store.state.status===l["a"].Status.idle&&this.$store.state.gapiAuthed}refresh(){i["a"].refresh()}openPreference(){this.$router.push({path:"/preferences"})}};ut=Object(r["b"])([Object(o["a"])({components:{MaterialTopAppBar:b["a"],MaterialTopAppBarAdjust:u["a"],MaterialIconButton:d["a"],Status:C,Highlight:H,Gallery:V,Scanners:at,Reasons:bt}})],ut);var jt=ut;c("cd2e");jt.render=n;e["default"]=jt},"7d6a":function(t,e,c){"use strict";c("8942")},"7e13":function(t,e,c){"use strict";var a=c("7a23");function s(t,e,c,s,n,r){const o=Object(a["w"])("material-icon-raw");return Object(a["p"])(),Object(a["d"])("i",{class:t.className},[Object(a["g"])(o,{icon:t.icon},null,8,["icon"])],2)}var n=c("9ab4"),r=c("ce1f"),o=c("bd16");let i=class extends r["b"]{get className(){let t="fa";return this.fixedWidth&&(t+=" fa-fw"),t}};i=Object(n["b"])([Object(r["a"])({props:{icon:String,fixedWidth:Boolean},components:{MaterialIconRaw:o["a"]}})],i);var l=i;l.render=s;e["a"]=l},8942:function(t,e,c){},9529:function(t,e,c){},be6d:function(t,e,c){"use strict";c("daa4")},c448:function(t,e,c){"use strict";c("9529")},cd2e:function(t,e,c){"use strict";c("e7df")},daa4:function(t,e,c){},e3a9:function(t,e,c){"use strict";var a=c("7a23");const s={class:"mdc-card mdc-card--outlined"},n={class:"mdc-card__primary-action"};function r(t,e,c,r,o,i){return Object(a["p"])(),Object(a["d"])("div",s,[Object(a["g"])("div",n,[t.image?(Object(a["p"])(),Object(a["d"])("div",{key:0,class:t.mediaClassName,style:t.mediaStyle},null,6)):Object(a["e"])("",!0),Object(a["v"])(t.$slots,"default")])])}var o=c("9ab4"),i=c("ce1f");let l=class extends i["b"]{get mediaClassName(){return"mdc-card__media mdc-card__media--"+(this.squareImage?"square":"16-9")}get mediaStyle(){return this.image?`background-image: url("${this.image}")`:""}};l=Object(o["b"])([Object(i["a"])({props:{image:String,squareImage:Boolean},components:{}})],l);var d=l;c("be6d");d.render=r;e["a"]=d},e7df:function(t,e,c){}}]);
//# sourceMappingURL=dashboard.b0f9548e.js.map