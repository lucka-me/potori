(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["charts"],{"0a63":function(t,e,a){},"16f8":function(t){t.exports=JSON.parse('{"en":{"title":"Charts"},"zh":{"title":"图表"}}')},"3fde":function(t){t.exports=JSON.parse('{"en":{"title":"Status"},"zh":{"title":"状态"}}')},6923:function(t,e,a){"use strict";a.r(e);var s=a("7a23");const r={key:0,class:"charts"},o={class:"grid grid--1-2"},n={class:"grid grid--2-1"};function i(t,e,a,i,c,l){const d=Object(s["A"])("material-top-app-bar"),u=Object(s["A"])("material-top-app-bar-adjust"),b=Object(s["A"])("status-chart"),h=Object(s["A"])("reasons-chart"),p=Object(s["A"])("count-by-month-chart"),O=Object(s["A"])("interval-chart"),f=Object(s["A"])("quotas-chart");return Object(s["t"])(),Object(s["e"])(s["a"],null,[Object(s["i"])(d,{title:t.$t("title"),"navi-back":""},null,8,["title"]),Object(s["i"])(u),t.empty?Object(s["f"])("",!0):(Object(s["t"])(),Object(s["e"])("main",r,[Object(s["i"])("div",o,[Object(s["i"])(b),Object(s["i"])(h)]),Object(s["i"])(p),Object(s["i"])("div",n,[Object(s["i"])(O),Object(s["i"])(f)])]))],64)}var c=a("9ab4"),l=a("9b4a"),d=(a("cadc"),a("1b40")),u=a("2e5e"),b=a("2281"),h=a("4892");function p(t,e,a,r,o,n){const i=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-card");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(i,{"chart-type":"line","chart-datasets":t.datasets,"chart-options":t.options},null,8,["chart-datasets","chart-options"])]),_:1},8,["title"])}var O=a("1315"),f=a("53ea"),v=a("84b6"),j=a("7607");let m=class extends d["d"]{constructor(){super(...arguments),this.datasets=[],this.options={scales:{x:{type:"time",time:{unit:"month",tooltipFormat:"yyyy-MM",displayFormats:{month:"yyyy-MM"}}}},plugins:{tooltip:{mode:"x"}}}}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData()}onSaved(){this.updateData()}updateData(){var t,e;return Object(c["b"])(this,void 0,void 0,(function*(){const a=yield u["a"].getAll(),s=new Map,r=new Map;if(a.length>0){let o=O["DateTime"].fromMillis(a[0].confirmedTime).startOf("month").valueOf(),n=o;for(const i of a){if(i.confirmedTime>0){const e=O["DateTime"].fromMillis(i.confirmedTime).startOf("month").valueOf();e<o?o=e:e>n&&(n=e),s.set(e,(null!==(t=s.get(e))&&void 0!==t?t:0)+1)}if(i.resultTime>0){const t=O["DateTime"].fromMillis(i.resultTime).startOf("month").valueOf();t>n&&(n=t),r.set(t,(null!==(e=r.get(t))&&void 0!==e?e:0)+1)}}Object(f["b"])(s,o,n),Object(f["b"])(r,o,n)}const o=[],n=[];for(const[t,e]of s)o.push({x:t,y:e});for(const[t,e]of r)n.push({x:t,y:e});o.sort((t,e)=>t.x-e.x),n.sort((t,e)=>t.x-e.x);const i={label:this.$t("submissions"),data:o,borderColor:"orange",pointBackgroundColor:"orange",pointRadius:0,fill:!1},c={label:this.$t("results"),data:n,borderColor:"royalblue",pointBackgroundColor:"royalblue",pointRadius:0,fill:!1};this.datasets=[i,c]}))}};Object(c["c"])([Object(d["e"])("saveID")],m.prototype,"onSaved",null),m=Object(c["c"])([Object(d["b"])({components:{ChartCard:f["a"],ChartView:v["a"]},i18n:{messages:j}})],m);var g=m;g.render=p;var y=g;function D(t,e,a,r,o,n){const i=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-card");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(i,{"chart-type":"bar","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var C,A=a("ce89"),S=a("8899");let w=C=class extends d["d"]{constructor(){super(...arguments),this.options={plugins:{legend:{display:!1}}},this.labels=[],this.datasets=[]}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData()}onSaved(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield u["a"].getAll(),e=t.reduce((t,e)=>{var a;if(e.status===A["a"].StatusCode.Pending)return t;if(e.confirmedTime<C.timeValid)return t;if(e.resultTime<C.timeValid)return t;if(e.resultTime<e.confirmedTime)return t;const s=Math.floor((e.resultTime-e.confirmedTime)/C.timeDay);return t.set(s,(null!==(a=t.get(s))&&void 0!==a?a:0)+1),t},new Map),a=[];for(const[o,n]of e)a.push({interval:o,count:n});a.sort((t,e)=>t.interval-e.interval);const s=a.map(t=>t.count),r={data:s,backgroundColor:"royalblue",hoverBackgroundColor:"royalblue"};this.labels=a.map(t=>t.interval),this.datasets=[r]}))}};w.timeValid=1325347200,w.timeDay=864e5,Object(c["c"])([Object(d["e"])("saveID")],w.prototype,"onSaved",null),w=C=Object(c["c"])([Object(d["b"])({components:{ChartCard:f["a"],ChartView:v["a"]},i18n:{messages:S}})],w);var x=w;x.render=D;var I=x;function M(t,e,a,r,o,n){const i=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-card");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(i,{"chart-type":"bar","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var T,k=a("a7a0"),$=a("f433");let B=T=class extends d["d"]{constructor(){super(...arguments),this.options={plugins:{legend:{display:!1}}},this.datasets=[]}get labels(){const t=[];for(let e=0;e<14;e++)t.push(e);return t}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData()}onSaved(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield u["a"].getAll(),e=t.map(t=>k["a"].from(t)),a=Date.now(),s=new Array(14).fill(0);for(const o of e){const t=o.restoreTime;t>a&&(s[Math.floor((t-a)/T.timeDay)]+=1)}const r={data:s,backgroundColor:"royalblue",hoverBackgroundColor:"royalblue"};this.datasets=[r]}))}};B.timeDay=864e5,Object(c["c"])([Object(d["e"])("saveID")],B.prototype,"onSaved",null),B=T=Object(c["c"])([Object(d["b"])({components:{ChartCard:f["a"],ChartView:v["a"]},i18n:{messages:$}})],B);var R=B;R.render=M;var F=R;function J(t,e,a,r,o,n){const i=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-card");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(i,{"chart-type":"doughnut","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.opitons},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var V=a("f667");let z=class extends d["d"]{constructor(){super(...arguments),this.opitons={plugins:{legend:{display:!0,position:"right"}}},this.labels=[],this.datasets=[]}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData()}onSaved(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=new Map;for(const[n,i]of A["a"].reason)t.set(n,[i,0]);const e=yield u["a"].getAll(A["a"].status.get(A["a"].StatusCode.Rejected).predicator);e.reduce((t,e)=>{if(e.status!==A["a"].StatusCode.Rejected)return t;if(e.reasons.length>0)for(const a of e.reasons)t.get(a)[1]++;else t.get(A["a"].Reason.undeclared)[1]++;return t},t);const a=[],s=[],r=[];for(const n of t.values())n[1]<1||(a.push(n[0].title),s.push(n[1]),r.push(n[0].color));const o={data:s,backgroundColor:r,borderAlign:"inner",borderColor:"rgba(0, 0, 0, 0.2)",hoverBackgroundColor:r,hoverBorderColor:"rgba(0, 0, 0, 0.4)"};this.labels=a,this.datasets=[o]}))}};Object(c["c"])([Object(d["e"])("saveID")],z.prototype,"onSaved",null),z=Object(c["c"])([Object(d["b"])({components:{ChartCard:f["a"],ChartView:v["a"]},i18n:{messages:V}})],z);var N=z;N.render=J;var _=N;function q(t,e,a,r,o,n){const i=Object(s["A"])("chart-view"),c=Object(s["A"])("chart-card");return Object(s["t"])(),Object(s["e"])(c,{title:t.$t("title")},{default:Object(s["F"])(()=>[Object(s["i"])(i,{"chart-type":"doughnut","chart-datasets":t.datasets,"chart-labels":t.labels,"chart-options":t.options},null,8,["chart-datasets","chart-labels","chart-options"])]),_:1},8,["title"])}var Q,P=a("3fde");let W=Q=class extends d["d"]{constructor(){super(...arguments),this.options={plugins:{legend:{display:!0,position:"right"}}},this.datasets=[]}get labels(){const t=[];for(const e of A["a"].status.values())t.push(e.title);return t}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData()}onSaved(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=new Map;for(const r of A["a"].status.keys())t.set(r,0);const e=yield u["a"].getAll();e.reduce((t,e)=>(t.set(e.status,t.get(e.status)+1),t),t);const a=[];for(const r of t.values())a.push(r);const s={data:a,backgroundColor:Q.colors,borderAlign:"inner",borderColor:"rgba(0, 0, 0, 0.2)",hoverBackgroundColor:Q.colors,hoverBorderColor:"rgba(0, 0, 0, 0.4)"};this.datasets=[s]}))}};W.colors=["#CAAF85","#35C572","#B0373C"],Object(c["c"])([Object(d["e"])("saveID")],W.prototype,"onSaved",null),W=Q=Object(c["c"])([Object(d["b"])({components:{ChartCard:f["a"],ChartView:v["a"]},i18n:{messages:P}})],W);var E=W;E.render=q;var G=E,H=a("16f8");let K=class extends d["d"]{constructor(){super(...arguments),this.empty=!0}get saveID(){return this.$store.state.dia.saveID}created(){this.updateData(),l["e"].register(l["a"],l["c"],l["j"],l["m"],l["b"],l["f"],l["i"],l["d"],l["k"],l["l"],l["p"],l["q"],l["h"]),l["e"].defaults.maintainAspectRatio=!1,l["e"].defaults.plugins.legend.labels.boxWidth=10,l["e"].defaults.plugins.tooltip.intersect=!1,l["e"].defaults.elements.line.tension=.1}onSaved(){this.updateData()}updateData(){return Object(c["b"])(this,void 0,void 0,(function*(){const t=yield u["a"].count();this.empty=t<1}))}};Object(c["c"])([Object(d["e"])("saveID")],K.prototype,"onSaved",null),K=Object(c["c"])([Object(d["b"])({components:{MaterialTopAppBar:b["a"],MaterialTopAppBarAdjust:h["a"],StatusChart:G,ReasonsChart:_,CountByMonthChart:y,IntervalChart:I,QuotasChart:F},i18n:{messages:H}})],K);var L=K;a("7998");L.render=i;e["default"]=L},7607:function(t){t.exports=JSON.parse('{"en":{"title":"Count by Month","submissions":"Submissions","results":"Results"},"zh":{"title":"每月统计","submissions":"提交","results":"结果"}}')},7998:function(t,e,a){"use strict";a("0a63")},8899:function(t){t.exports=JSON.parse('{"en":{"title":"Interval (Days)"},"zh":{"title":"耗时（天）"}}')},f433:function(t){t.exports=JSON.parse('{"en":{"title":"Quotas (Days)"},"zh":{"title":"名额（天）"}}')},f667:function(t){t.exports=JSON.parse('{"en":{"title":"Reasons"},"zh":{"title":"拒绝理由"}}')}}]);
//# sourceMappingURL=charts.f4976e99.js.map