(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["map"],{"131a":function(t){t.exports=JSON.parse('{"en":{"all":"All"},"zh":{"all":"全部"}}')},"2ef7":function(t,e,r){"use strict";r("db9f")},"4af0":function(t,e,r){"use strict";r.r(e);var o=r("7a23");const i=Object(o["i"])("main",{class:"ignore-safe-area nomination-map"},[Object(o["i"])("div",{id:"map-container"})],-1);function n(t,e,r,n,l,a){const c=Object(o["A"])("material-top-app-bar"),s=Object(o["A"])("material-top-app-bar-adjust");return Object(o["t"])(),Object(o["e"])(o["a"],null,[Object(o["i"])(c,{title:t.title,"navi-back":""},null,8,["title"]),Object(o["i"])(s),i],64)}var l=r("9ab4"),a=r("1b40"),c=(r("ac6d"),r("2e5e")),s=r("ce89"),u=r("a7a0"),d=r("2281"),p=r("4892"),h=r("131a");let m=class extends a["d"]{get title(){var t,e;return null!==(e=null===(t=this.commonSense)||void 0===t?void 0:t.title)&&void 0!==e?e:this.$t("all")}get commonSense(){if(this.$route.query.status&&"string"===typeof this.$route.query.status){const t=parseInt(this.$route.query.status);return s["a"].status.get(t)||null}if(this.$route.query.reason&&"string"===typeof this.$route.query.reason){const t=parseInt(this.$route.query.reason);return s["a"].reason.get(t)||null}if(this.$route.query.scanner&&"string"===typeof this.$route.query.scanner){const t=parseInt(this.$route.query.scanner);return s["a"].scanner.get(t)||null}return null}mounted(){r.e("mapbox").then(r.t.bind(null,"e192",7)).then(t=>{this.ctrl=new t.Map({container:"map-container",accessToken:"pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw",style:"mapbox://styles/mapbox/outdoors-v11"}),this.ctrl.addControl(new t.NavigationControl),this.ctrl.addControl(new t.FullscreenControl),this.ctrl.once("idle",()=>{this.ctrl&&(this.ctrl.resize(),this.pourData())})})}pourData(){return Object(l["b"])(this,void 0,void 0,(function*(){if(!this.ctrl)return;const t=yield this.loadNominations(),e={lng:-181,lat:-91},r={lng:181,lat:91},o={type:"FeatureCollection",features:t.map(t=>{const o=t.lngLat;return o.lng>e.lng&&(e.lng=o.lng),o.lng<r.lng&&(r.lng=o.lng),o.lat>e.lat&&(e.lat=o.lat),o.lat<r.lat&&(r.lat=o.lat),{type:"Feature",properties:{title:t.title,color:t.statusData.color},geometry:{type:"Point",coordinates:[o.lng,o.lat]}}})},i="nominations",n=getComputedStyle(document.documentElement).getPropertyValue("--mdc-theme-secondary");this.ctrl.addSource(i,{type:"geojson",data:o,cluster:!0}),this.ctrl.addLayer({id:i+"-cluster",type:"circle",source:i,filter:["has","point_count"],paint:{"circle-color":n,"circle-opacity":.6,"circle-stroke-width":4,"circle-stroke-color":n,"circle-radius":["interpolate",["linear"],["get","point_count"],5,10,50,30,200,50]}}),this.ctrl.addLayer({id:i+"-count",type:"symbol",source:i,filter:["has","point_count"],layout:{"text-field":["get","point_count"],"text-font":["DIN Offc Pro Medium","Arial Unicode MS Bold"],"text-size":12},paint:{"text-color":"#000"}}),this.ctrl.addLayer({id:i+"-unclustered",type:"circle",source:i,filter:["!",["has","point_count"]],paint:{"circle-color":["get","color"],"circle-opacity":.6,"circle-radius":5,"circle-stroke-width":2,"circle-stroke-color":["get","color"]}}),this.ctrl.addLayer({id:i+"-title",type:"symbol",source:i,filter:["has","title"],layout:{"text-field":["get","title"],"text-font":["DIN Offc Pro Medium","Arial Unicode MS Bold"],"text-size":12,"text-anchor":"top","text-offset":[0,.6]},paint:{"text-color":"#FFF","text-halo-color":"#000","text-halo-width":1}}),this.ctrl.on("click",i+"-cluster",t=>{if(!this.ctrl||!t.features)return;const e=t.features[0],r=e.properties.cluster_id;this.ctrl.getSource(i).getClusterExpansionZoom(r,(t,r)=>{this.ctrl&&!t&&this.ctrl.easeTo({center:e.geometry.coordinates,zoom:r})})}),r.lng>-181&&this.ctrl.fitBounds([r,e],{linear:!0,padding:16})}))}loadNominations(){return Object(l["b"])(this,void 0,void 0,(function*(){const t=this.commonSense,e=yield c["a"].getAll(null===t||void 0===t?void 0:t.predicator);return e.filter(t=>t.lngLat).map(t=>u["a"].from(t))}))}};m=Object(l["c"])([Object(a["b"])({components:{MaterialTopAppBar:d["a"],MaterialTopAppBarAdjust:p["a"]},i18n:{messages:h}})],m);var f=m;r("2ef7");f.render=n;e["default"]=f},db9f:function(t,e,r){}}]);
//# sourceMappingURL=map.a555fadb.js.map