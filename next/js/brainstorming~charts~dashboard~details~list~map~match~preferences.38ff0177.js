(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["brainstorming~charts~dashboard~details~list~map~match~preferences"],{2281:function(t,e,o){"use strict";var i=o("7a23");const r={class:"mdc-top-app-bar mdc-top-app-bar--fixed"},n={class:"mdc-top-app-bar__row"},a={class:"mdc-top-app-bar__section mdc-top-app-bar__section--align-start"},s={class:"mdc-top-app-bar__title"},c={class:"mdc-top-app-bar__section mdc-top-app-bar__section--align-end",role:"toolbar"};function l(t,e,o,l,p,d){const h=Object(i["A"])("material-icon-button");return Object(i["t"])(),Object(i["e"])("header",r,[Object(i["i"])("div",n,[Object(i["i"])("section",a,[t.naviBack?(Object(i["t"])(),Object(i["e"])(h,{key:0,class:"mdc-top-app-bar__navigation-icon",icon:"arrow-left",onClick:e[1]||(e[1]=e=>t.$router.back())})):Object(i["f"])("",!0),Object(i["i"])("span",s,Object(i["C"])(t.title),1)]),Object(i["i"])("section",c,[Object(i["z"])(t.$slots,"default")])])])}var p=o("9ab4"),d=o("8136"),h=o("40ff"),u={FIXED_CLASS:"mdc-top-app-bar--fixed",FIXED_SCROLLED_CLASS:"mdc-top-app-bar--fixed-scrolled",SHORT_CLASS:"mdc-top-app-bar--short",SHORT_COLLAPSED_CLASS:"mdc-top-app-bar--short-collapsed",SHORT_HAS_ACTION_ITEM_CLASS:"mdc-top-app-bar--short-has-action-item"},f={DEBOUNCE_THROTTLE_RESIZE_TIME_MS:100,MAX_TOP_APP_BAR_HEIGHT:128},S={ACTION_ITEM_SELECTOR:".mdc-top-app-bar__action-item",NAVIGATION_EVENT:"MDCTopAppBar:nav",NAVIGATION_ICON_SELECTOR:".mdc-top-app-bar__navigation-icon",ROOT_SELECTOR:".mdc-top-app-bar",TITLE_SELECTOR:".mdc-top-app-bar__title"},T=o("6689"),b=function(t){function e(o){return t.call(this,Object(p["a"])(Object(p["a"])({},e.defaultAdapter),o))||this}return Object(p["d"])(e,t),Object.defineProperty(e,"strings",{get:function(){return S},enumerable:!1,configurable:!0}),Object.defineProperty(e,"cssClasses",{get:function(){return u},enumerable:!1,configurable:!0}),Object.defineProperty(e,"numbers",{get:function(){return f},enumerable:!1,configurable:!0}),Object.defineProperty(e,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},setStyle:function(){},getTopAppBarHeight:function(){return 0},notifyNavigationIconClicked:function(){},getViewportScrollY:function(){return 0},getTotalActionItems:function(){return 0}}},enumerable:!1,configurable:!0}),e.prototype.handleTargetScroll=function(){},e.prototype.handleWindowResize=function(){},e.prototype.handleNavigationClick=function(){this.adapter.notifyNavigationIconClicked()},e}(T["a"]),O=0,g=function(t){function e(e){var o=t.call(this,e)||this;return o.wasDocked=!0,o.isDockedShowing=!0,o.currentAppBarOffsetTop=0,o.isCurrentlyBeingResized=!1,o.resizeThrottleId=O,o.resizeDebounceId=O,o.lastScrollPosition=o.adapter.getViewportScrollY(),o.topAppBarHeight=o.adapter.getTopAppBarHeight(),o}return Object(p["d"])(e,t),e.prototype.destroy=function(){t.prototype.destroy.call(this),this.adapter.setStyle("top","")},e.prototype.handleTargetScroll=function(){var t=Math.max(this.adapter.getViewportScrollY(),0),e=t-this.lastScrollPosition;this.lastScrollPosition=t,this.isCurrentlyBeingResized||(this.currentAppBarOffsetTop-=e,this.currentAppBarOffsetTop>0?this.currentAppBarOffsetTop=0:Math.abs(this.currentAppBarOffsetTop)>this.topAppBarHeight&&(this.currentAppBarOffsetTop=-this.topAppBarHeight),this.moveTopAppBar())},e.prototype.handleWindowResize=function(){var t=this;this.resizeThrottleId||(this.resizeThrottleId=setTimeout((function(){t.resizeThrottleId=O,t.throttledResizeHandler()}),f.DEBOUNCE_THROTTLE_RESIZE_TIME_MS)),this.isCurrentlyBeingResized=!0,this.resizeDebounceId&&clearTimeout(this.resizeDebounceId),this.resizeDebounceId=setTimeout((function(){t.handleTargetScroll(),t.isCurrentlyBeingResized=!1,t.resizeDebounceId=O}),f.DEBOUNCE_THROTTLE_RESIZE_TIME_MS)},e.prototype.checkForUpdate=function(){var t=-this.topAppBarHeight,e=this.currentAppBarOffsetTop<0,o=this.currentAppBarOffsetTop>t,i=e&&o;if(i)this.wasDocked=!1;else{if(!this.wasDocked)return this.wasDocked=!0,!0;if(this.isDockedShowing!==o)return this.isDockedShowing=o,!0}return i},e.prototype.moveTopAppBar=function(){if(this.checkForUpdate()){var t=this.currentAppBarOffsetTop;Math.abs(t)>=this.topAppBarHeight&&(t=-f.MAX_TOP_APP_BAR_HEIGHT),this.adapter.setStyle("top",t+"px")}},e.prototype.throttledResizeHandler=function(){var t=this.adapter.getTopAppBarHeight();this.topAppBarHeight!==t&&(this.wasDocked=!1,this.currentAppBarOffsetTop-=this.topAppBarHeight-t,this.topAppBarHeight=t),this.handleTargetScroll()},e}(b),_=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.wasScrolled=!1,e}return Object(p["d"])(e,t),e.prototype.handleTargetScroll=function(){var t=this.adapter.getViewportScrollY();t<=0?this.wasScrolled&&(this.adapter.removeClass(u.FIXED_SCROLLED_CLASS),this.wasScrolled=!1):this.wasScrolled||(this.adapter.addClass(u.FIXED_SCROLLED_CLASS),this.wasScrolled=!0)},e}(g),A=function(t){function e(e){var o=t.call(this,e)||this;return o.collapsed=!1,o.isAlwaysCollapsed=!1,o}return Object(p["d"])(e,t),Object.defineProperty(e.prototype,"isCollapsed",{get:function(){return this.collapsed},enumerable:!1,configurable:!0}),e.prototype.init=function(){t.prototype.init.call(this),this.adapter.getTotalActionItems()>0&&this.adapter.addClass(u.SHORT_HAS_ACTION_ITEM_CLASS),this.setAlwaysCollapsed(this.adapter.hasClass(u.SHORT_COLLAPSED_CLASS))},e.prototype.setAlwaysCollapsed=function(t){this.isAlwaysCollapsed=!!t,this.isAlwaysCollapsed?this.collapse():this.maybeCollapseBar()},e.prototype.getAlwaysCollapsed=function(){return this.isAlwaysCollapsed},e.prototype.handleTargetScroll=function(){this.maybeCollapseBar()},e.prototype.maybeCollapseBar=function(){if(!this.isAlwaysCollapsed){var t=this.adapter.getViewportScrollY();t<=0?this.collapsed&&this.uncollapse():this.collapsed||this.collapse()}},e.prototype.uncollapse=function(){this.adapter.removeClass(u.SHORT_COLLAPSED_CLASS),this.collapsed=!1},e.prototype.collapse=function(){this.adapter.addClass(u.SHORT_COLLAPSED_CLASS),this.collapsed=!0},e}(b),C=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return Object(p["d"])(e,t),e.attachTo=function(t){return new e(t)},e.prototype.initialize=function(t){void 0===t&&(t=function(t){return h["a"].attachTo(t)}),this.navIcon=this.root.querySelector(S.NAVIGATION_ICON_SELECTOR);var e=[].slice.call(this.root.querySelectorAll(S.ACTION_ITEM_SELECTOR));this.navIcon&&e.push(this.navIcon),this.iconRipples=e.map((function(e){var o=t(e);return o.unbounded=!0,o})),this.scrollTarget=window},e.prototype.initialSyncWithDOM=function(){this.handleNavigationClick=this.foundation.handleNavigationClick.bind(this.foundation),this.handleWindowResize=this.foundation.handleWindowResize.bind(this.foundation),this.handleTargetScroll=this.foundation.handleTargetScroll.bind(this.foundation),this.scrollTarget.addEventListener("scroll",this.handleTargetScroll),this.navIcon&&this.navIcon.addEventListener("click",this.handleNavigationClick);var t=this.root.classList.contains(u.FIXED_CLASS),e=this.root.classList.contains(u.SHORT_CLASS);e||t||window.addEventListener("resize",this.handleWindowResize)},e.prototype.destroy=function(){var e,o;try{for(var i=Object(p["g"])(this.iconRipples),r=i.next();!r.done;r=i.next()){var n=r.value;n.destroy()}}catch(c){e={error:c}}finally{try{r&&!r.done&&(o=i.return)&&o.call(i)}finally{if(e)throw e.error}}this.scrollTarget.removeEventListener("scroll",this.handleTargetScroll),this.navIcon&&this.navIcon.removeEventListener("click",this.handleNavigationClick);var a=this.root.classList.contains(u.FIXED_CLASS),s=this.root.classList.contains(u.SHORT_CLASS);s||a||window.removeEventListener("resize",this.handleWindowResize),t.prototype.destroy.call(this)},e.prototype.setScrollTarget=function(t){this.scrollTarget.removeEventListener("scroll",this.handleTargetScroll),this.scrollTarget=t,this.handleTargetScroll=this.foundation.handleTargetScroll.bind(this.foundation),this.scrollTarget.addEventListener("scroll",this.handleTargetScroll)},e.prototype.getDefaultFoundation=function(){var t,e=this,o={hasClass:function(t){return e.root.classList.contains(t)},addClass:function(t){return e.root.classList.add(t)},removeClass:function(t){return e.root.classList.remove(t)},setStyle:function(t,o){return e.root.style.setProperty(t,o)},getTopAppBarHeight:function(){return e.root.clientHeight},notifyNavigationIconClicked:function(){return e.emit(S.NAVIGATION_EVENT,{})},getViewportScrollY:function(){var t=e.scrollTarget,o=e.scrollTarget;return void 0!==t.pageYOffset?t.pageYOffset:o.scrollTop},getTotalActionItems:function(){return e.root.querySelectorAll(S.ACTION_ITEM_SELECTOR).length}};return t=this.root.classList.contains(u.SHORT_CLASS)?new A(o):this.root.classList.contains(u.FIXED_CLASS)?new _(o):new g(o),t},e}(d["a"]),y=o("1b40"),v=o("81dd");let E=class extends y["d"]{mounted(){this.ctrl=C.attachTo(this.$el)}updated(){var t;null===(t=this.ctrl)||void 0===t||t.destroy(),this.ctrl=C.attachTo(this.$el)}unmounted(){var t;null===(t=this.ctrl)||void 0===t||t.destroy()}};Object(p["c"])([Object(y["c"])(String)],E.prototype,"title",void 0),Object(p["c"])([Object(y["c"])(Boolean)],E.prototype,"naviBack",void 0),E=Object(p["c"])([Object(y["b"])({components:{MaterialIconButton:v["a"]}})],E);var I=E;o("b53d");I.render=l;e["a"]=I},4892:function(t,e,o){"use strict";var i=o("7a23");const r={class:"mdc-top-app-bar--fixed-adjust"};function n(t,e,o,n,a,s){return Object(i["t"])(),Object(i["e"])("div",r)}var a=o("ce1f");class s extends a["b"]{}o("7460");s.render=n;e["a"]=s},7460:function(t,e,o){"use strict";o("79f2")},"79f2":function(t,e,o){},b53d:function(t,e,o){"use strict";o("dd8b")},dd8b:function(t,e,o){}}]);
//# sourceMappingURL=brainstorming~charts~dashboard~details~list~map~match~preferences.38ff0177.js.map