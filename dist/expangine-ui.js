!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("expangine-runtime"),require("expangine-runtime-live")):"function"==typeof define&&define.amd?define(["expangine-runtime","expangine-runtime-live"],t):"object"==typeof exports?exports["expangine-ui"]=t(require("expangine-runtime"),require("expangine-runtime-live")):e["expangine-ui"]=t(e["expangine-runtime"],e["expangine-runtime-live"])}(window,(function(e,t){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(t,n){t.exports=e},function(e,n){e.exports=t},function(e,t,n){"use strict";n.r(t),n.d(t,"DEFAULT_SLOT",(function(){return i})),n.d(t,"COMPILER_DEFAULT",(function(){return r})),n.d(t,"COMPILER_DYNAMIC",(function(){return s})),n.d(t,"COMPILER_COMPONENT",(function(){return o})),n.d(t,"DIRECTIVE_IF",(function(){return a})),n.d(t,"DIRECTIVE_SWITCH",(function(){return c})),n.d(t,"DIRECTIVE_FOR",(function(){return u})),n.d(t,"DIRECTIVE_SLOT",(function(){return l})),n.d(t,"compilers",(function(){return U})),n.d(t,"getCompiler",(function(){return T})),n.d(t,"getCompilerName",(function(){return M})),n.d(t,"compile",(function(){return N})),n.d(t,"mount",(function(){return P})),n.d(t,"createIf",(function(){return K})),n.d(t,"createIfElse",(function(){return X})),n.d(t,"createIfs",(function(){return Y})),n.d(t,"createShow",(function(){return Z})),n.d(t,"createHide",(function(){return J})),n.d(t,"createSwitch",(function(){return Q})),n.d(t,"createComponent",(function(){return ee})),n.d(t,"createFor",(function(){return te})),n.d(t,"createSlot",(function(){return ne})),n.d(t,"isStyleElement",(function(){return _})),n.d(t,"getSlots",(function(){return q})),n.d(t,"isNamedSlots",(function(){return $})),n.d(t,"changeElements",(function(){return D})),n.d(t,"createChildNodes",(function(){return F})),n.d(t,"Scope",(function(){return k})),n.d(t,"ComponentInstance",(function(){return L})),n.d(t,"ComponentRegistry",(function(){return A})),n.d(t,"addComponent",(function(){return R})),n.d(t,"extendComponent",(function(){return I}));const i="default",r="*",s=":dynamic",o=":component",a=":if",c=":switch",u=":for",l=":slot";var d=n(0),p=n(1),f={pop:1,push:1,shift:1,unshift:1,reverse:1,splice:1,sort:1},h={concat:1,every:1,fill:1,filter:1,find:1,findIndex:1,forEach:1,includes:1,indexOf:1,join:1,lastIndexOf:1,map:1,reduce:1,reduceRight:1,slice:1,some:1},m=function(){function e(e){this.value=e,this.next=this.prev=this}return e.prototype.forEach=function(e){for(var t=this.next,n=0;t!==this;){var i=t.next;e(t.value,t,n),t=i,n++}return n},e.prototype.toArray=function(){var e=[];return this.forEach((function(t){return e.push(t)})),e},e.prototype.insertAfter=function(e){this.next=e.next,this.prev=e,this.prev.next=this.next.prev=this},e.prototype.push=function(e){e.insertAfter(this.prev)},e.prototype.remove=function(){this.isEmpty()||(this.next.prev=this.prev,this.prev.next=this.next,this.prev=this.next=this)},e.prototype.isEmpty=function(){return this.next===this},e.head=function(){return new e(null)},e}(),b=function(){function e(e){this.observer=e,this.links=m.head()}return e.prototype.notify=function(e){void 0===e&&(e=!1);var t=!1;return this.links.toArray().forEach((function(e){e.watcher.notify(),t=t||e.watcher.deep})),e&&t&&this.observer.parent&&this.observer.parent.notify(e),t},e.prototype.destroy=function(){this.links.forEach((function(e){return e.remove()}))},e}(),g=[],v=function(){function e(e,t,n,i){void 0===t&&(t=!0),void 0===n&&(n=!1),this.expression=e,this.immediate=t,this.deep=n,this.onResult=i,this.dirty=!1,this.paused=!1,this.evaluating=!1,this.links=m.head()}return e.prototype.isWatching=function(){return!this.links.isEmpty()},e.prototype.notify=function(){this.evaluating||(this.dirty=!0,this.immediate&&this.update())},e.prototype.update=function(){this.evaluating=!0,this.off(),g.push(this);try{this.result=this.expression(this)}finally{if(g.pop(),this.dirty=!1,this.onResult)try{this.onResult(this)}finally{this.evaluating=!1}this.evaluating=!1}},e.prototype.off=function(){this.links.forEach((function(e){return e.remove()}))},e.prototype.pause=function(){this.paused||(this.off(),this.paused=!0)},e.prototype.resume=function(){this.paused&&(this.update(),this.paused=!1)},e}(),y=function(){function e(e,t){this.watcher=e,this.dependency=t,this.watcherNode=new m(this),this.dependencyNode=new m(this)}return e.prototype.remove=function(){this.watcherNode.remove(),this.dependencyNode.remove()},e.create=function(t,n){var i=null;return n.links.forEach((function(e){return i=e.watcher===t?e:i})),i||(i=new e(t,n),n.links.push(i.dependencyNode),t.links.push(i.watcherNode)),i},e}(),x={get:function(e,t,n){var i=e[t];if("$obs"===t)return i;var r=e.$obs;if("function"==typeof i){if(e instanceof Array){if(t in f)return function(e,t,n){return function(){for(var i=e.slice(),r=t.apply(e,arguments),s=Math.max(i.length,e.length),o=!1,a=0;a<s;a++)i[a]!==e[a]&&(o=o||n.notify(a)),a>=e.length&&n.remove(a);return e.length!==i.length&&(o=o||n.notify("length")),o&&n.parent&&n.parent.notify(!0),r}}(e,i,r);if(t in h)return function(e,t,n){return function(){for(var i=e.length,r=0;r<i;r++)O(e,r,e[r],n);return O(e,"length",e.length,n),t.apply(e,arguments)}}(e,i,r)}return i}return O(e,t,i,r)},set:function(e,t,n,i){n!==e[t]&&(e[t]=n,e.$obs.notify(t,!0));return!0},deleteProperty:function(e,t){return e.$obs.remove(t),!0}};function O(e,t,n,i){var r=i.dep(t);return g.forEach((function(e){return y.create(e,r)})),E(n)&&!w(n)&&(e[t]=n=j(n,{parent:r})),n}function j(e,t){var n=(void 0===t?{}:t).parent,i=void 0===n?null:n;if(E(e)&&!e.$obs){var r=Proxy.revocable(e,x);e=r.proxy,Object.defineProperty(e,"$obs",{value:new C(r.revoke,i),writable:!1,configurable:!0,enumerable:!1})}return e}function E(e){return!("object"!=typeof e||null===e)}function w(e){return!("object"!=typeof e||null===e||!e.$obs)}var C=function(){function e(e,t){void 0===t&&(t=null),this.revoke=e,this.parent=t,this.deps=Object.create(null)}return e.prototype.dep=function(e){var t=this.deps[e];return t||(this.deps[e]=t=new b(this)),t},e.prototype.notify=function(e,t){void 0===t&&(t=!1);var n=this.deps;return e in n?n[e].notify(t):(t&&this.parent&&this.parent.notify(t),!1)},e.prototype.remove=function(e){var t=this.deps;e in t&&(t[e].destroy(),delete t[e])},e.prototype.destroy=function(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=!0);var i=this.deps;for(var r in i)if(i[r].destroy(),delete i[r],t){var s=e[r];if(w(s))s.$obs.destroy(s,t,n)}n&&this.revoke()},e}();function S(e,t){var n=void 0===t?{}:t,i=n.immediate,r=void 0===i||i,s=n.deep,o=void 0!==s&&s,a=n.onResult,c=new v(e,r,o,a);return c.update(),c}class k{constructor(e=null,t=Object.create(null)){this.parent=e,this.observed=j(t),this.disables=0,this.link=new m(this),this.watchers=m.head()}createChild(e={},t=!0){const n=new k(this,e);return t&&(this.children||(this.children=m.head()),this.children.push(n.link)),n}get(e,t,n=!1){return e in this.observed?this.observed[e]:this.parent&&!n?this.parent.get(e,t):t}has(e,t=!1){return e in this.observed||!(!this.parent||t)&&this.parent.has(e)}set(e,t,n=!1){return!(!(e in this.observed)&&!n&&this.parent&&this.parent.set(e,t))&&(this.observed[e]=t,!0)}remove(e){e in this.observed?delete this.observed[e]:this.parent&&this.parent.remove(e)}setMany(e){for(const t in e)this.set(t,e[t])}watch(e,t,n=!0,i=!1,r=!1){const s=p.LiveRuntime.defs.getExpression(e),o=p.LiveRuntime.getCommand(s);if(!s.isDynamic())return t(o(this)),()=>{};let a,c=!0;const u=e=>{!n&&c||!c&&i&&d.DataTypes.equals(a,e)||t(e),a=i?d.DataTypes.copy(e):e,c=!1},l=S(()=>{const e=o(this);r||u(e)},{onResult:({result:e})=>{r&&u(e)}}),f=new m(l);return this.watchers.push(f),()=>{l.off(),f.remove()}}eval(e,t=[]){if(t.length>0){const n=t.reduce((e,t)=>(e[t]=d.Exprs.const(void 0),e),{}),i=d.Exprs.define(n,p.LiveRuntime.defs.getExpression(e)),r=p.LiveRuntime.eval(i);return e=>{for(const i of t)n[i].value=null==e?void 0:e[i];return r(this)}}{const t=p.LiveRuntime.eval(e);return()=>t(this)}}evalNow(e){return this.eval(e)()}enable(){this.disables>0&&(this.disables--,0===this.disables&&this.watchers.forEach(e=>e.resume()),this.children&&this.children.forEach(e=>e.enable()))}disable(){0===this.disables&&this.watchers.forEach(e=>e.pause()),this.children&&this.children.forEach(e=>e.disable()),this.disables++}setEnabled(e){e?this.enable():this.disable()}destroy(){this.link.remove(),this.disables=Number.MAX_SAFE_INTEGER,this.watchers.forEach(e=>e.off()),this.children&&this.children.forEach(e=>e.destroy()),function(e,t,n){if(void 0===t&&(t=!1),void 0===n&&(n=!0),w(e)){var i=e.$obs;delete e.$obs,i.destroy(e,t,n)}}(this.observed)}static register(){if(!this.registered){const{dataSet:e,dataGet:t,dataHas:n,dataRemove:i}=p.LiveRuntime;p.LiveRuntime.dataGet=(e,n)=>e instanceof k?e.get(n):t(e,n),p.LiveRuntime.dataSet=(t,n,i)=>t instanceof k?t.set(n,i):e(t,n,i),p.LiveRuntime.dataHas=(e,t)=>e instanceof k?e.has(t):n(e,t),p.LiveRuntime.dataRemove=(e,t)=>e instanceof k?e.remove(t):i(e,t),d.DataTypes.addCopier({priority:12,copy:e=>{if(e instanceof Event)return e}}),this.registered=!0}}static isWatchable(e){return p.LiveRuntime.defs.isExpression(e)}}k.registered=!1,k.register();const A=Object.create(null);function R(e,t){return A[t||`${e.collection}/${e.name}`]=e,e}function I(e,t){return{collection:t.collection||e.collection,name:t.name||e.name,attributes:Object.assign(Object.assign({},e.attributes||{}),t.attributes||{}),state:Object.assign(Object.assign({},e.state||{}),t.state||{}),computed:Object.assign(Object.assign({},e.computed||{}),t.computed||{}),events:Object.assign(Object.assign({},e.events||{}),t.events||{}),slots:Object.assign(Object.assign({},e.slots||{}),t.slots||{}),render:t.render||e.render,created:t.created||e.created,updated:t.updated||e.updated,destroyed:t.destroyed||e.destroyed}}class L{constructor(e,t,n,i,r,s){this.component=e,this.attrs=t,this.scope=n,this.outerScope=s||n,this.slots=i,this.parent=r,this.cache=Object.create(null)}call(e,t){const n=this.getAttributeExpression(e);if(n){const e=d.Exprs.define();for(const n in t)e.with(n,d.defs.getExpression(t[n]));return e.run(d.defs.getExpression(n)),e}return d.Exprs.noop()}callable(e){const t=this.getAttributeOptions(e),n=this.getAttributeExpression(e);if(!t||!t.callable||!n)throw new Error(`The ${e} is not callable.`);const i=Object(d.isFunction)(t.callable)?t.callable({}):t.callable,r=Object.keys(i.options.props);return this.scope.eval(n,r)}trigger(e,t){this.scope.observed.emit[e]=t}on(e,t){return this.scope.watch(d.Exprs.get("emit",e),t,!1,!1,!0)}update(){this.component.updated&&this.node&&this.component.updated(this)}render(){this.cache=Object.create(null);const e=N(this.component.render(this),this,this.scope);D(this.node.elements,e.elements),this.node=e}destroy(){this.scope.destroy()}getAttributeOptions(e){var t;const n=null===(t=this.component.attributes)||void 0===t?void 0:t[e];return!!n&&(n instanceof d.Type?{type:n}:n)}getAttributeExpression(e){const t=this.getAttributeOptions(e);return this.attrs[e]||!!t&&t.default}getSlotArrayLength(e=i){const t=this.getSlotOptions(e);if(t&&t.arrayLength)return d.defs.getExpression(t.arrayLength);if(this.slots&&this.slots[e]&&Object(d.isObject)(this.slots[e])){const t=this.slots[e];let n;for(const e in t){const t=parseInt(e);Object(d.isNumber)(t)&&(void 0===n||t>n)&&(n=t)}if(void 0!==n)return d.Exprs.const(n+1)}return d.Exprs.const(0)}getSlotOptions(e="default"){if(this.component.slots){const n=this.component.slots[e];return t=n,Object(d.isObject)(t)&&t.scope instanceof d.Type?n:{scope:n}}var t;return!1}getSlotSize(e="default",t=0){return q(this.slots,e,t).length}hasSlot(e,t,n){return e in this.slots?t:n}whenSlot(e,t,n){return e in this.slots?n():t()}}function T(e){const[t]=e,n=M(t);return U[n]}function M(e){return Object(d.isString)(e)?e in U?e:e in A?o:r:s}function N(e,t,n,i){return T(e)(e,t,n,i)}function P(e,t,n){const i=new k(null,Object.assign(Object.assign({},e),{refs:{}})),r=new L({collection:"expangine",name:"mounted",attributes:{},events:{},slots:{},state:{},computed:{},render:()=>t},{},i),s=N(t,r,i);return n&&D([n],s.elements),r.node=s,r}function _(e){return!!e&&Object(d.isObject)(e.style)}function q(e,t=i,n=0){return e?Object(d.isArray)(e)?e:Object(d.isObject)(e)&&Object(d.isArray)(e[t])?e[t]:Object(d.isObject)(e)&&Object(d.isObject)(e[t])&&Object(d.isArray)(e[t][n])?e[t][n]:[]:[]}function $(e){return"object"==typeof e&&!Array.isArray(e)}function D(e,t){if(0===e.length)e.push(...t);else{const n=e[0].parentNode;if(n){const i=new Set(e);let r=e[0].previousSibling;for(let s=0;s<t.length;s++){const o=t[s],a=r?r.nextSibling:e[s];i.delete(o),a!==o&&(a?n.insertBefore(o,a):!r&&n.firstChild?n.insertBefore(o,n.firstChild):n.appendChild(o)),r=o}for(const e of i)n.removeChild(e)}e.splice(0,e.length,...t)}}function F(e,t,n,i,r=!1){const s=[],o=[];for(const r of e)if(Object(d.isString)(r))s.push(document.createTextNode(r));else if(k.isWatchable(r)){const e=document.createTextNode("");t.watch(r,t=>{e.textContent=t}),s.push(e)}else{const e=N(r,n,t,i);for(const t of e.elements)s.push(t);e.scope!==t&&o.push(e.scope),i.children?i.children.push(e):i.children=[e]}return{elements:s,updateScopes(e){t.setMany(e);for(const t of o)t.setMany(e)},destroy(){r||t.destroy();for(const e of o)e.destroy()}}}const V={prevent:(e,t)=>(t.preventDefault&&t.preventDefault(),!0),stop:(e,t)=>(t.stopPropagation&&t.stopPropagation(),!0),self:(e,t)=>t.target===e};function W(e,t){const n=e.indexOf(t),i=n>=0;return i&&e.splice(n,1),i}function H(e,t){const n=t.split("_"),i=function(e){const t=z[e],n=(i=e,i.replace(/([A-Z])/g,e=>"-"+e.toLowerCase()));var i;if(!t)return{property:!1,attribute:n,tags:!0,stringify:!1};return{property:Object(d.isArray)(t)?e:t.property||e,attribute:Object(d.isArray)(t)?n:t.attribute||n,tags:Object(d.isArray)(t)?t:t.tags||!0,stringify:!Object(d.isArray)(t)&&(t.stringify||!1)}}(n[0]),{tags:r,property:s,attribute:o,stringify:a}=i,c="style"===o.toLowerCase(),u=!0!==r&&(0===r.length||r.includes(e.toLowerCase()));return s&&u?n.length>1?(e,t)=>{const i=n.length-1;let r=e;for(let e=0;e<i;e++){const t=n[e];r[t]||(r[t]={}),r=r[t]}null==t?delete r[n[i]]:r[n[i]]=t}:(e,t)=>{null==t||""===t?e.removeAttribute(o):e[s]=a?B(t,c):t}:(e,t)=>{const n=B(t,c);""===n?e.removeAttribute(o):e.setAttribute(o,n)}}const z={abbr:["th"],accept:["input"],acceptCharset:["form"],accessKey:[],action:["form"],allow:["iframe"],allowdirs:["input"],allowfullscreen:["iframe"],allowPaymentRequest:["iframe"],as:["link"],async:["script"],autocapitalize:["textarea"],autocomplete:["form","input","textarea"],autofocus:["button","input","select","textarea"],autoplay:["audio","media"],alt:["area","img"],caption:["table"],class:{property:"className",stringify:!0},className:[],charset:["script"],cite:["blockquote","q","cite"],contentEditable:[],coords:["area"],color:["basefont"],cols:["textarea"],colSpan:{tags:["th","td"],attribute:"colspan"},content:["meta"],controls:["audio","media"],crossOrigin:{tags:["img","link","audio","media"],attribute:"crossorigin"},csp:["iframe"],currentTime:["audio","media"],data:["object"],dataset:[],decoding:["img"],default:["track"],defaultMuted:["audio","media"],defaultPlaybackRate:["audio","media"],defaultSelected:["option"],defaultValue:["input","output","textarea"],defer:["script"],dirName:{tags:["input"],attribute:"dirname"},dir:[],disabled:["button","fieldset","input","link","optgroup","option","select","style","textarea"],disableRemotePlayback:["audio","media"],download:["a","area"],draggable:[],encoding:["form"],enctype:["form"],face:["basefont"],files:["input"],for:{property:"htmlFor",tags:["label"]},form:["input"],formAction:{tags:["button","input"],attribute:"formaction"},formEnctype:{tags:["button","input"],attribute:"formenctype"},formMethod:{tags:["button","input"],attribute:"formmethod"},formNoValidate:{tags:["button","input"],attribute:"formnovalidate"},formTarget:{tags:["button","input"],attribute:"formtarget"},hash:["a","area"],height:["canvas","embed","iframe","img","object","video"],hidden:[],host:["a","area"],hostname:["a","area"],href:["a","area","base","link"],hreflang:["a","area","link"],httpEquiv:["meta"],id:[],inert:[],innerHTML:[],innerText:[],isMap:{tags:["img"],attribute:"ismap"},label:["optgroup","track"],lang:[],length:["select"],loading:["img"],loop:["audio","media"],kind:["track"],max:["input","progress"],maxLength:{tags:["input","textarea"],attribute:"maxlength"},media:["a","area","link","source","style"],mediaGroup:{tags:["audio","media"],attribute:"mediagroup"},menu:["button"],method:["form"],min:["input"],minLength:{tags:["input","textarea"],attribute:"minlength"},multiple:["input","select"],muted:["audio","media"],name:["button","fieldset","form","iframe","input","map","meta","object","output","param","select","textarea"],noValidate:{tags:["form"],attribute:"novalidate"},noModule:["script"],open:["dialog"],outerHTML:[],password:["a","area"],pathname:["a","area"],pattern:["input"],placeholder:["input","textarea"],playbackRate:["audio","media"],port:["a","area"],poster:["video"],protocol:["a","area"],readOnly:{tags:["input","textarea"],attribute:"readonly"},referrerPolicy:{tags:["iframe","img","link","script"],attribute:"referrerpolicy"},rel:["a","area","link"],returnValue:["dialog"],required:["input","select","textarea"],reversed:["ol"],rows:["textarea"],rowSpan:{tags:["td","th"],attribute:"rowspan"},scrollTop:[],sandbox:["iframe"],scope:["th"],search:["area"],select:["content"],selected:["option"],selectedIndex:["select"],selectionStart:["input","textarea"],selectionEnd:["input","textarea"],selectionDirection:["input","textarea"],shape:["area"],size:["basefont","input","select"],sizes:["img"],src:["embed","iframe","img","media","audio","script","source","track"],srcset:["img"],srcdoc:["iframe"],srclang:["track"],span:["col","colgroup"],start:["ol"],step:["input"],style:{tags:[],stringify:!0},tabIndex:{tags:[],attribute:"tabindex"},target:["a","area","base","form"],textContent:[],text:["a","option","script","title"],title:[],type:["a","area","button","embed","input","link","ol","object","script","source","style"],typeMustMatch:{tags:["object"],attribute:"typemustmatch"},useMap:{tags:["img","object"],attribute:"usemap"},username:["a","area"],volume:["audio","media"],validationMessage:["fieldset"],validity:["fieldset","input"],value:["button","data","input","li","option","output","param","progress","select","textarea"],width:["canvas","embed","iframe","img","object","video"],wrap:["textarea"]};function B(e,t=!1){if(Object(d.isArray)(e))return e.map(e=>B(e)).filter(e=>Boolean(e)).join(t?"; ":" ");if(Object(d.isObject)(e)){const n=[];for(const i in e)(e[i]||t&&0===e[i])&&n.push(t?i+": "+B(e[i]):i);return n.join(t?"; ":" ")}return null==e||!1===e?"":String(e)}const G=(e,t,n,r)=>{const[s,o,,a]=e,c=s.substring(1),u=[document.createComment(c)],l=u.slice(),p={parent:r,component:t,scope:n,elements:l},f=n.createChild();if(!(o&&o.cases&&o.value))throw new Error(`The ${s} directive requires a cases and value attribute.`);{const e=o.mode||"detach",r=d.defs.getExpression(o.value),s=d.Exprs.switch(r,o.isEqual||d.AnyOps.isEqual);for(const e in o.cases)s.case(o.cases[e]).than(e);let c,l;s.default(i),n.watch(s,n=>{const i=q(a,n);if(0===i.length)switch(f.setEnabled(!1),e){case"detach":D(p.elements,u);break;case"destroy":l&&(l.destroy(),l=void 0),D(p.elements,u);break;case"hide":if(l){const e=p.elements.slice();for(let t=0;t<e.length;t++){const n=e[t];_(n)?n.style.display="none":e[t]=document.createComment("")}D(p.elements,e)}}else{if(n!==c||"destroy"===e){l&&(l.destroy(),l=void 0);const e=F(i,f,t,p,!0);D(p.elements,e.elements),l=e,c=n}else if("detach"===e)D(p.elements,l.elements);else{const e=p.elements.slice();for(let t=0;t<e.length;t++){const n=e[t];_(n)?n.style.display="":e[t]=l.elements[t]}D(p.elements,e)}f.setEnabled(!0)}},!0,!0)}return p};const U={[r]:(e,t,n,i)=>{const[r,s,o,a]=e,c=document.createElement(r),u={elements:[c],component:t,scope:n,parent:i};if(Object(d.isObject)(s))for(const e in s){const t=s[e],i=H(r,e);k.isWatchable(t)?n.watch(t,e=>{i(c,e)}):i(c,t)}if(Object(d.isObject)(o))for(const e in o){const t=e.split("."),i=t.shift(),r=o[i],s={once:W(t,"once"),passive:W(t,"passive"),capture:W(t,"capture")},a=Object(d.isFunction)(r)?r:n.eval(r,["nativeEvent","stop","prevent"]);c.addEventListener(i,e=>{for(const n of t)if(n in V&&!V[n](c,e))return;const i={nativeEvent:e,stop:!1,prevent:!1};if(!1===a(i,n))return!1;for(const t in i)if(i[t]&&t in V&&!V[t](c,e))return},s)}const l=q(a);if(l.length>0){const e=F(l,n,t,u);for(const t of e.elements)c.appendChild(t)}return u},[s]:(e,t,n,i)=>{const[r]=e,s={parent:i,component:t,scope:n,elements:[document.createComment("dynamic")]};let o;return n.watch(r,r=>{e[0]=r,o&&o.destroy(),o=n.createChild();const a=N(e,t,o,i);D(s.elements,a.elements)},!0,!0),s},[o]:(e,t,n,i)=>{const[r,s,o,a]=e,c=A[r],u=new k(null,{emit:{},refs:{}}),l=new L(c,s,u,$(a)?a:void 0,t,n),p=null==s?void 0:s.ref;if(p&&delete s.ref,c.attributes)for(const e in c.attributes){const t=l.getAttributeOptions(e);if(!t||t.callable)continue;const i=s&&e in s?s[e]:t.default;if(k.isWatchable(i)){let r=!0;n.watch(i,n=>{u.set(e,n,!0),r&&t.initial?t.initial(n,l):!r&&t.changed&&t.changed(n,l),t.update&&t.update(n,l),!r&&c.updated&&c.updated(l),r=!1})}else u.set(e,i,!0)}if(c.state)for(const e in c.state){const t=c.state[e];u.set(e,u.evalNow(t),!0)}if(c.computed)for(const e in c.computed){const t=c.computed[e];u.watch(t,t=>{u.set(e,t,!0)})}if(Object(d.isObject)(o)&&c.events)for(const e in o){if(!(e in c.events))continue;const t=o[e];if(k.isWatchable(t)){const i=c.events[e],r=Object(d.isFunction)(i)?i({}):i,s=Object.keys(r.options.props),o=n.eval(t,s);l.on(e,o)}}const f=N(c.render(l),l,u,i);return l.node=f,c.created&&c.created(l),p&&t&&(t.scope.observed.refs[p]=u.observed),f},[a]:([e,t,n,i],r,s,o)=>G([e,Object.assign({value:!0,isEqual:d.BooleanOps.isEqual},t),n,i],r,s,o),[l]:(e,t,n,r)=>{const[,s,,o]=e,a={parent:r,component:t,scope:n,elements:[document.createComment("slot")]};if(s){const e=s.name||i,r=s.slotIndex&&n.evalNow(s.slotIndex)||0,c=q(t.slots,e,r),u=c.length>0,l=u?c:q(o,e,r),d=u?t.outerScope.createChild():n.createChild();if(s.slotIndex){const n=t.getSlotOptions(e),i=n&&n.arrayIndexAlias||"slotIndex";d.set(i,r)}if(s.scope)for(const e in s.scope){const t=s.scope[e];k.isWatchable(t)?n.watch(t,t=>{d.set(e,t,!0)}):d.set(e,t,!0)}if(l){const e=F(l,d,t,a);a.elements=e.elements}}return a},[u]:(e,t,n,i)=>{const[,r,,s]=e,o=document.createComment("for"),a={parent:i,component:t,scope:n,elements:[o]},c=q(s);if(r&&r.items){const e=r.item||"item",i=r.index||"index",s=r.key||d.Exprs.get(i),u=n.eval(s,[e,i]),l=new Map;n.watch(r.items,r=>{const s=[],p=new Set;!function(e,t){if(Object(d.isArray)(e))for(let n=0;n<e.length;n++)t(e[n],n);else if(Object(d.isSet)(e)){let n=0;for(const i of e)t(i,n++)}else if(Object(d.isMap)(e))for(const[n,i]of e.entries())t(i,n);else if(Object(d.isObject)(e))for(const n in e)t(e[n],e);else if(Object(d.isNumber)(e))for(let n=0;n<e;n++)t(n,n)}(r,(r,o)=>{const d={[e]:r,[i]:o},f=u(d);let h=l.get(f);if(h)h.updateScopes(d);else{const e=n.createChild(d);h=F(c,e,t,a),l.set(f,h)}p.add(f),s.push(...h.elements)}),0===s.length&&s.push(o),D(a.elements,s),l.forEach((e,t)=>{p.has(t)||(e.destroy(),l.delete(t))})})}return a},[c]:G};function K(e,t,n="detach"){return Y([[e,t]],void 0,n)}function X(e,t,n,i="detach"){return Y([[e,t]],n,i)}function Y(e,t,n="detach"){return[a,{mode:n,cases:e.reduce((e,[t],n)=>(e[n]=t,e),{})},{},Object.assign(Object.assign({},e.reduce((e,[,t],n)=>(e[n]=t,e),{})),{default:t})]}function Z(e,t){return Y([[e,t]],void 0,"hide")}function J(e,t){return Y([[d.Exprs.not(e),t]],void 0,"hide")}function Q(e,t,n,i){return[c,{value:e,cases:t.reduce((e,[t],n)=>(e[n]=t,e),{}),isEqual:i},{},Object.assign(Object.assign({},t.reduce((e,[,t],n)=>(e[n]=t,e),{})),{default:n})]}function ee(e,t={},n={},i={}){return[`${e.collection}/${e.name}`,t,n,i]}function te(e,t,n={}){return[u,Object.assign({items:e},n),{},t]}function ne(e={},t=[]){return[l,e,{},t]}}])}));
//# sourceMappingURL=expangine-ui.js.map