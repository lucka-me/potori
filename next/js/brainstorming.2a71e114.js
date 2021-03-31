(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brainstorming"],{1923:function(t){t.exports=JSON.parse('{"en":{"title":"Brainstorming","update":"Update","updating":"Updating Brainstorming","updateInform":"Updated {count} records."},"zh":{"title":"Brainstorming","update":"更新","updating":"正在更新Brainstorming","updateInform":"更新了{count}条记录。"}}')},"2fe3":function(t){t.exports=JSON.parse('{"en":{"title":"Coverage","recorded":"Recorded","notRecorded":"Not Recorded","early":"Early Nomination"},"zh":{"title":"覆盖率","recorded":"有记录","notRecorded":"无记录","early":"早期提名"}}')},"35d9":function(t,e,a){},"7f91":function(t){t.exports=JSON.parse('{"en":{"title":"Reviews by Month"},"zh":{"title":"每月审查次数"}}')},"83d4":function(t){t.exports=JSON.parse('{"en":{"title":"Synch","synched":"Synched","notSynched":"Not Synched"},"zh":{"title":"同步率","synched":"同步","notSynched":"不同步"}}')},"88b2":function(t,e,a){"use strict";a.r(e);var s=a("7a23");const r={key:0,class:"brainstorming"},o={key:0,class:"progress"},i={key:1,class:"grid grid--1-1-1"};function n(t,e,a,n,c,l){const d=Object(s["A"])("material-icon-button"),u=Object(s["A"])("material-top-app-bar"),h=Object(s["A"])("material-top-app-bar-adjust"),b=Object(s["A"])("material-linear-progress"),p=Object(s["A"])("coverage-chart"),O=Object(s["A"])("rates-chart"),f=Object(s["A"])("synch-chart"),g=Object(s["A"])("reviews-by-month-chart");return Object(s["t"])(),Object(s["e"])(s["a"],null,[Object(s["i"])(u,{title:t.$t("title"),"navi-back":""},{default:Object(s["F"])(()=>[t.canUpdate?(Object(s["t"])(),Object(s["e"])(d,{key:0,icon:"redo",title:t.$t("update"),onClick:t.update},null,8,["title","onClick"])):Object(s["f"])("",!0)]),_:1},8,["title"]),Object(s["i"])(h),t.$store.getters.empty?Object(s["f"])("",!0):(Object(s["t"])(),Object(s["e"])("main",r,[t.updating?(Object(s["t"])(),Object(s["e"])("div",o,[Object(s["i"])("div",null,Object(s["C"])(t.$t("updating")),1),Object(s["i"])(b,{progress:t.$store.state.progress.progress,determinate:""},null,8,["progress"])])):Object(s["f"])("",!0),t.idle?(Object(s["t"])(),Object(s["e"])("div",i,[Object(s["i"])(p),Object(s["i"])(O),Object(s["i"])(f)])):Object(s["f"])("",!0),t.idle?(Object(s["t"])(),Object(s["e"])(g,{key:2})):Object(s["f"])("",!0)]))],64)}var c=a("9ab4"),l=a("9b4a"),d=(a("cadc"),a("ce1f")),u=a("6022"),h=a("42b4"),b=a("81dd"),p=a("ea0e"),O=a("2281"),f=a("4892");function g(t,e,a,r,o,i){const n=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-block");return Object(s["t"])(),Object(s["e"])(c,{title:t.title},{default:Object(s["F"])(()=>[Object(s["i"])(n,{"chart-type":"doughnut","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var j,y=a("1b40"),m=a("ad8e"),v=a("2e5e"),C=a("240d"),S=a("6163"),$=a("2fe3");let A=j=class extends y["d"]{constructor(){super(...arguments),this.options={plugins:{legend:{display:!0,position:"right"}}},this.datasets=[],this.rate=0}get title(){const t=this.$t("title");return 0===this.rate?t:`${t} | ${this.rate.toFixed(2)}%`}get labels(){return[this.$t("recorded"),this.$t("notRecorded"),this.$t("early")]}mounted(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield v["a"].getAll(),e=[0,0,0],a=[];for(const r of t){if(m["a"].beforeCreate(r)){e[2]++;continue}const t=m["a"].contains(r).then(t=>{e[t?0:1]++});a.push(t)}yield Promise.allSettled(a);const s={data:e,backgroundColor:j.colors,borderAlign:"inner",borderColor:"rgba(0, 0, 0, 0.2)",hoverBackgroundColor:j.colors,hoverBorderColor:"rgba(0, 0, 0, 0.4)"};this.datasets=[s],e[0]>0||e[1]>0?this.rate=e[0]/(e[0]+e[1]+e[2])*100:this.rate=0}))}};A.colors=["royalblue","gray","orange"],A=j=Object(c["c"])([Object(y["b"])({components:{ChartBlock:C["a"],ChartView:S["a"]},i18n:{messages:$}})],A);var k=A;k.render=g;var w=k;function x(t,e,a,r,o,i){const n=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-block");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(n,{"chart-type":"radar","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var B=a("d475");let N=class extends y["d"]{constructor(){super(...arguments),this.options={elements:{line:{tension:0}},scales:{r:{min:1,max:5,ticks:{stepSize:1}}},plugins:{legend:{display:!1}}},this.datasets=[]}get labels(){return[this.$t("quality"),this.$t("description"),this.$t("cultural"),this.$t("uniqueness"),this.$t("safety"),this.$t("location")]}mounted(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield v["a"].getAll(),e=[];for(let i=0;i<6;++i)e.push({count:0,rate:0});const a=(t,e)=>{if(!t)return;const a=parseInt(t);isNaN(a)||(e.count++,e.rate+=a)},s=[];for(const i of t){const t=m["a"].getFromLocal(i).then(t=>{if(t)for(const[s,r]of Object.entries(t)){if(!s.startsWith("review_"))continue;const t=r;a(t.JSON.quality,e[0]),a(t.JSON.description,e[1]),a(t.JSON.cultural,e[2]),a(t.JSON.uniqueness,e[3]),a(t.JSON.safety,e[4]),a(t.JSON.location,e[5])}});s.push(t)}yield Promise.allSettled(s);const r=e.map(t=>t.rate/t.count),o={data:r,borderColor:"royalblue"};this.datasets=[o]}))}};N=Object(c["c"])([Object(y["b"])({components:{ChartBlock:C["a"],ChartView:S["a"]},i18n:{messages:B}})],N);var R=N;R.render=x;var J=R;function M(t,e,a,r,o,i){const n=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-block");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(n,{"chart-type":"line","chart-datasets":t.datasets,"chart-options":t.options},null,8,["chart-datasets","chart-options"])]),_:1},8,["title"])}var D=a("1315"),F=a("7f91");let q=class extends y["d"]{constructor(){super(...arguments),this.options={scales:{x:{type:"time",time:{unit:"month",tooltipFormat:"yyyy-MM",displayFormats:{month:"yyyy-MM"}}}},plugins:{legend:{display:!1},tooltip:{mode:"x"}}},this.datasets=[]}mounted(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield v["a"].getAll(),e=new Map;if(t.length>0){let a=D["DateTime"].fromMillis(t[0].confirmedTime).startOf("month").valueOf(),s=a;const r=[];for(const o of t){const t=m["a"].getFromLocal(o).then(t=>{var r;if(t)for(const[o,i]of Object.entries(t)){if(!o.startsWith("review_"))continue;const t=i,n=D["DateTime"].fromMillis(t.Timestamp).startOf("month").valueOf();n<a?a=n:n>s&&(s=n),e.set(n,(null!==(r=e.get(n))&&void 0!==r?r:0)+1)}});r.push(t)}yield Promise.allSettled(r),Object(C["b"])(e,a,s)}const a=[];for(const[r,o]of e)a.push({x:r,y:o});a.sort((t,e)=>t.x-e.x);const s={data:a,borderColor:"royalblue",pointBackgroundColor:"royalblue",pointRadius:0,fill:!0};this.datasets=[s]}))}};q=Object(c["c"])([Object(y["b"])({components:{ChartBlock:C["a"],ChartView:S["a"]},i18n:{messages:F}})],q);var _=q;_.render=M;var z=_;function I(t,e,a,r,o,i){const n=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-block");return Object(s["t"])(),Object(s["e"])(c,{title:t.title},{default:Object(s["F"])(()=>[Object(s["i"])(n,{"chart-type":"doughnut","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var P,T=a("ce89"),U=a("83d4");let L=P=class extends y["d"]{constructor(){super(...arguments),this.options={plugins:{legend:{display:!0,position:"right"}}},this.datasets=[],this.rate=0}get title(){const t=this.$t("title");return 0===this.rate?t:`${t} | ${this.rate.toFixed(2)}%`}get labels(){return[this.$t("synched"),this.$t("notSynched")]}mounted(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield v["a"].getAll(),e=[0,0],a=[];for(const r of t){if(r.status===T["a"].StatusCode.Pending)continue;let t=!0,s=!1;r.status===T["a"].StatusCode.Rejected?r.reasons.includes(T["a"].Reason.duplicated)?s=!0:r.reasons.includes(T["a"].Reason.close)&&(t=!1):t=!1;const o=m["a"].getFromLocal(r).then(a=>{if(a)for(const[r,o]of Object.entries(a)){if(!r.startsWith("review_"))continue;const a=o;if("D"===a.stars){e[s?0:1]++;continue}const i=parseInt(a.stars);isNaN(i)||(i<3&&t||i>=3&&!t?e[0]++:e[1]++)}});a.push(o)}yield Promise.allSettled(a);const s={data:e,backgroundColor:P.colors,borderAlign:"inner",borderColor:"rgba(0, 0, 0, 0.2)",hoverBackgroundColor:P.colors,hoverBorderColor:"rgba(0, 0, 0, 0.4)"};this.datasets=[s],e[0]>0||e[1]>0?this.rate=e[0]/(e[0]+e[1])*100:this.rate=0}))}};L.colors=["royalblue","gray"],L=P=Object(c["c"])([Object(y["b"])({components:{ChartBlock:C["a"],ChartView:S["a"]},i18n:{messages:U}})],L);var V=L;V.render=I;var W=V,E=a("1923");let Q=class extends d["b"]{get canUpdate(){return!this.$store.getters.empty&&this.$store.state.service.status===u["b"].Status.idle}created(){l["e"].register(l["a"],l["j"],l["m"],l["f"],l["i"],l["n"],l["o"],l["k"],l["p"],l["g"],l["q"],l["h"]),l["e"].defaults.maintainAspectRatio=!1,l["e"].defaults.plugins.legend.labels.boxWidth=10,l["e"].defaults.plugins.tooltip.intersect=!1,l["e"].defaults.elements.line.tension=.1}get updating(){return this.$store.state.service.status===u["b"].Status.queryingBrainstorming}get idle(){return this.$store.state.service.status===u["b"].Status.idle}update(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield u["b"].updateBrainstorming();h["a"].inform(this.$t("updateInform",{count:t}))}))}};Q=Object(c["c"])([Object(d["a"])({components:{MaterialTopAppBar:O["a"],MaterialTopAppBarAdjust:f["a"],MaterialIconButton:b["a"],MaterialLinearProgress:p["a"],CoverageChart:w,RatesChart:J,SynchChart:W,ReviewsByMonthChart:z},i18n:{messages:E}})],Q);var G=Q;a("d2cc");G.render=n;e["default"]=G},d2cc:function(t,e,a){"use strict";a("35d9")},d475:function(t){t.exports=JSON.parse('{"en":{"title":"Rates","quality":"Quality","description":"Description","cultural":"Cultura","uniqueness":"Uniqueness","safety":"Safety","location":"Location"},"zh":{"title":"评分","quality":"质量","description":"描述","cultural":"文化","uniqueness":"独特","safety":"安全","location":"位置"}}')}}]);
//# sourceMappingURL=brainstorming.2a71e114.js.map