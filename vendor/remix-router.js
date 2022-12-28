const self = {
  RemixRouter: {},
};

export default self.RemixRouter;

/**
 * @remix-run/router v1.0.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
!function(e,t){t(e.RemixRouter)}(self,(function(e){"use strict";function t(){return t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},t.apply(this,arguments)}var r;e.Action=void 0,(r=e.Action||(e.Action={})).Pop="POP",r.Push="PUSH",r.Replace="REPLACE";const a="popstate";function n(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}function o(e){return{usr:e.state,key:e.key}}function i(e,r,a,n){return void 0===a&&(a=null),t({pathname:"string"==typeof e?e:e.pathname,search:"",hash:""},"string"==typeof r?l(r):r,{state:a,key:r&&r.key||n||Math.random().toString(36).substr(2,8)})}function s(e){let{pathname:t="/",search:r="",hash:a=""}=e;return r&&"?"!==r&&(t+="?"===r.charAt(0)?r:"?"+r),a&&"#"!==a&&(t+="#"===a.charAt(0)?a:"#"+a),t}function l(e){let t={};if(e){let r=e.indexOf("#");r>=0&&(t.hash=e.substr(r),e=e.substr(0,r));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function c(e){let t="undefined"!=typeof window&&void 0!==window.location&&"null"!==window.location.origin?window.location.origin:"unknown://unknown",r="string"==typeof e?e:s(e);return new URL(r,t)}function d(r,n,l,d){void 0===d&&(d={});let{window:u=document.defaultView,v5Compat:h=!1}=d,f=u.history,p=e.Action.Pop,m=null;function g(){p=e.Action.Pop,m&&m({action:p,location:v.location})}let v={get action(){return p},get location(){return r(u,f)},listen(e){if(m)throw new Error("A history only accepts one active listener");return u.addEventListener(a,g),m=e,()=>{u.removeEventListener(a,g),m=null}},createHref:e=>n(u,e),encodeLocation(e){let r=c(s(e));return t({},e,{pathname:r.pathname,search:r.search,hash:r.hash})},push:function(t,r){p=e.Action.Push;let a=i(v.location,t,r);l&&l(a,t);let n=o(a),s=v.createHref(a);try{f.pushState(n,"",s)}catch(e){u.location.assign(s)}h&&m&&m({action:p,location:v.location})},replace:function(t,r){p=e.Action.Replace;let a=i(v.location,t,r);l&&l(a,t);let n=o(a),s=v.createHref(a);f.replaceState(n,"",s),h&&m&&m({action:p,location:v.location})},go:e=>f.go(e)};return v}let u;function h(e,r,a){return void 0===r&&(r=[]),void 0===a&&(a=new Set),e.map(((e,n)=>{let o=[...r,n],i="string"==typeof e.id?e.id:o.join("-");if(E(!0!==e.index||!e.children,"Cannot specify children on an index route"),E(!a.has(i),'Found a route id collision on id "'+i+"\".  Route id's must be globally unique within Data Router usages"),a.add(i),function(e){return!0===e.index}(e)){return t({},e,{id:i})}return t({},e,{id:i,children:e.children?h(e.children,o,a):void 0})}))}function f(e,t,r){void 0===r&&(r="/");let a=D(("string"==typeof t?l(t):t).pathname||"/",r);if(null==a)return null;let n=p(e);!function(e){e.sort(((e,t)=>e.score!==t.score?t.score-e.score:function(e,t){return e.length===t.length&&e.slice(0,-1).every(((e,r)=>e===t[r]))?e[e.length-1]-t[t.length-1]:0}(e.routesMeta.map((e=>e.childrenIndex)),t.routesMeta.map((e=>e.childrenIndex)))))}(n);let o=null;for(let e=0;null==o&&e<n.length;++e)o=y(n[e],b(a));return o}function p(e,t,r,a){return void 0===t&&(t=[]),void 0===r&&(r=[]),void 0===a&&(a=""),e.forEach(((e,n)=>{let o={relativePath:e.path||"",caseSensitive:!0===e.caseSensitive,childrenIndex:n,route:e};o.relativePath.startsWith("/")&&(E(o.relativePath.startsWith(a),'Absolute route path "'+o.relativePath+'" nested under path "'+a+'" is not valid. An absolute child route path must start with the combined path of all its parent routes.'),o.relativePath=o.relativePath.slice(a.length));let i=S([a,o.relativePath]),s=r.concat(o);e.children&&e.children.length>0&&(E(!0!==e.index,'Index routes must not have child routes. Please remove all child routes from route path "'+i+'".'),p(e.children,t,s,i)),(null!=e.path||e.index)&&t.push({path:i,score:v(i,e.index),routesMeta:s})})),t}!function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"}(u||(u={}));const m=/^:\w+$/,g=e=>"*"===e;function v(e,t){let r=e.split("/"),a=r.length;return r.some(g)&&(a+=-2),t&&(a+=2),r.filter((e=>!g(e))).reduce(((e,t)=>e+(m.test(t)?3:""===t?1:10)),a)}function y(e,t){let{routesMeta:r}=e,a={},n="/",o=[];for(let e=0;e<r.length;++e){let i=r[e],s=e===r.length-1,l="/"===n?t:t.slice(n.length)||"/",c=w({path:i.relativePath,caseSensitive:i.caseSensitive,end:s},l);if(!c)return null;Object.assign(a,c.params);let d=i.route;o.push({params:a,pathname:S([n,c.pathname]),pathnameBase:C(S([n,c.pathnameBase])),route:d}),"/"!==c.pathnameBase&&(n=S([n,c.pathnameBase]))}return o}function w(e,t){"string"==typeof e&&(e={path:e,caseSensitive:!1,end:!0});let[r,a]=function(e,t,r){void 0===t&&(t=!1);void 0===r&&(r=!0);A("*"===e||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were "'+e.replace(/\*$/,"/*")+'" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "'+e.replace(/\*$/,"/*")+'".');let a=[],n="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^$?{}|()[\]]/g,"\\$&").replace(/:(\w+)/g,((e,t)=>(a.push(t),"([^\\/]+)")));e.endsWith("*")?(a.push("*"),n+="*"===e||"/*"===e?"(.*)$":"(?:\\/(.+)|\\/*)$"):r?n+="\\/*$":""!==e&&"/"!==e&&(n+="(?:(?=\\/|$))");return[new RegExp(n,t?void 0:"i"),a]}(e.path,e.caseSensitive,e.end),n=t.match(r);if(!n)return null;let o=n[0],i=o.replace(/(.)\/+$/,"$1"),s=n.slice(1);return{params:a.reduce(((e,t,r)=>{if("*"===t){let e=s[r]||"";i=o.slice(0,o.length-e.length).replace(/(.)\/+$/,"$1")}return e[t]=function(e,t){try{return decodeURIComponent(e)}catch(r){return A(!1,'The value for the URL param "'+t+'" will not be decoded because the string "'+e+'" is a malformed URL segment. This is probably due to a bad percent encoding ('+r+")."),e}}(s[r]||"",t),e}),{}),pathname:o,pathnameBase:i,pattern:e}}function b(e){try{return decodeURI(e)}catch(t){return A(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding ('+t+")."),e}}function D(e,t){if("/"===t)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let r=t.endsWith("/")?t.length-1:t.length,a=e.charAt(r);return a&&"/"!==a?null:e.slice(r)||"/"}function E(e,t){if(!1===e||null==e)throw new Error(t)}function A(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}function R(e,t){void 0===t&&(t="/");let{pathname:r,search:a="",hash:n=""}="string"==typeof e?l(e):e,o=r?r.startsWith("/")?r:function(e,t){let r=t.replace(/\/+$/,"").split("/");return e.split("/").forEach((e=>{".."===e?r.length>1&&r.pop():"."!==e&&r.push(e)})),r.length>1?r.join("/"):"/"}(r,t):t;return{pathname:o,search:T(a),hash:j(n)}}function P(e,t,r,a){return"Cannot include a '"+e+"' character in a manually specified `to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the `to."+r+'` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'}function x(e){return e.filter(((e,t)=>0===t||e.route.path&&e.route.path.length>0))}function M(e,r,a,n){let o;void 0===n&&(n=!1),"string"==typeof e?o=l(e):(o=t({},e),E(!o.pathname||!o.pathname.includes("?"),P("?","pathname","search",o)),E(!o.pathname||!o.pathname.includes("#"),P("#","pathname","hash",o)),E(!o.search||!o.search.includes("#"),P("#","search","hash",o)));let i,s=""===e||""===o.pathname,c=s?"/":o.pathname;if(n||null==c)i=a;else{let e=r.length-1;if(c.startsWith("..")){let t=c.split("/");for(;".."===t[0];)t.shift(),e-=1;o.pathname=t.join("/")}i=e>=0?r[e]:"/"}let d=R(o,i),u=c&&"/"!==c&&c.endsWith("/"),h=(s||"."===c)&&a.endsWith("/");return d.pathname.endsWith("/")||!u&&!h||(d.pathname+="/"),d}const S=e=>e.join("/").replace(/\/\/+/g,"/"),C=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),T=e=>e&&"?"!==e?e.startsWith("?")?e:"?"+e:"",j=e=>e&&"#"!==e?e.startsWith("#")?e:"#"+e:"";class L extends Error{}class O{constructor(e){let t;this.pendingKeys=new Set,this.subscriber=void 0,E(e&&"object"==typeof e&&!Array.isArray(e),"defer() only accepts plain objects"),this.abortPromise=new Promise(((e,r)=>t=r)),this.controller=new AbortController;let r=()=>t(new L("Deferred data aborted"));this.unlistenAbortSignal=()=>this.controller.signal.removeEventListener("abort",r),this.controller.signal.addEventListener("abort",r),this.data=Object.entries(e).reduce(((e,t)=>{let[r,a]=t;return Object.assign(e,{[r]:this.trackPromise(r,a)})}),{})}trackPromise(e,t){if(!(t instanceof Promise))return t;this.pendingKeys.add(e);let r=Promise.race([t,this.abortPromise]).then((t=>this.onSettle(r,e,null,t)),(t=>this.onSettle(r,e,t)));return r.catch((()=>{})),Object.defineProperty(r,"_tracked",{get:()=>!0}),r}onSettle(e,t,r,a){if(this.controller.signal.aborted&&r instanceof L)return this.unlistenAbortSignal(),Object.defineProperty(e,"_error",{get:()=>r}),Promise.reject(r);this.pendingKeys.delete(t),this.done&&this.unlistenAbortSignal();const n=this.subscriber;return r?(Object.defineProperty(e,"_error",{get:()=>r}),n&&n(!1),Promise.reject(r)):(Object.defineProperty(e,"_data",{get:()=>a}),n&&n(!1),a)}subscribe(e){this.subscriber=e}cancel(){this.controller.abort(),this.pendingKeys.forEach(((e,t)=>this.pendingKeys.delete(t)));let e=this.subscriber;e&&e(!0)}async resolveData(e){let t=!1;if(!this.done){let r=()=>this.cancel();e.addEventListener("abort",r),t=await new Promise((t=>{this.subscribe((a=>{e.removeEventListener("abort",r),(a||this.done)&&t(a)}))}))}return t}get done(){return 0===this.pendingKeys.size}get unwrappedData(){return E(null!==this.data&&this.done,"Can only unwrap data on initialized and settled deferreds"),Object.entries(this.data).reduce(((e,t)=>{let[r,a]=t;return Object.assign(e,{[r]:H(a)})}),{})}}function H(e){if(!function(e){return e instanceof Promise&&!0===e._tracked}(e))return e;if(e._error)throw e._error;return e._data}class U{constructor(e,t,r){this.status=e,this.statusText=t||"",this.data=r}}function _(e){return e instanceof U}const k={state:"idle",location:void 0,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0},N={state:"idle",data:void 0,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0},W=!("undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement);const $=new Set(["POST","PUT","PATCH","DELETE"]),q=new Set(["GET","HEAD",...$]);function F(e,t,r){void 0===r&&(r=!1);let a="string"==typeof e?e:s(e);if(!t||!("formMethod"in t)&&!("formData"in t))return{path:a};if(null!=t.formMethod&&"get"!==t.formMethod)return{path:a,submission:{formMethod:t.formMethod,formAction:oe(a),formEncType:t&&t.formEncType||"application/x-www-form-urlencoded",formData:t.formData}};if(!t.formData)return{path:a};let n=l(a);try{let e=V(t.formData);r&&n.search&&he(n.search)&&e.append("index",""),n.search="?"+e}catch(e){return{path:a,error:new U(400,"Bad Request","Cannot submit binary form data using GET")}}return{path:s(n)}}function I(e,t){let{formMethod:r,formAction:a,formEncType:n,formData:o}=e.navigation;return{state:"loading",location:i(e.location,t.location),formMethod:r||void 0,formAction:a||void 0,formEncType:n||void 0,formData:o||void 0}}function B(e,t){let r=e;if(t){let a=e.findIndex((e=>e.route.id===t));a>=0&&(r=e.slice(0,a))}return r}function z(e,t,r,a,n,o,i,s,l,c){let d=l?Object.values(l)[0]:s?Object.values(s)[0]:null,u=B(t,l?Object.keys(l)[0]:void 0).filter(((t,i)=>null!=t.route.loader&&(function(e,t,r){let a=!t||r.route.id!==t.route.id,n=void 0===e[r.route.id];return a||n}(e.loaderData,e.matches[i],t)||o.some((e=>e===t.route.id))||J(e.location,e.matches[i],r,a,t,n,d)))),h=[];return c&&c.forEach(((e,t)=>{let[a,o,s]=e;if(i.includes(t))h.push([t,a,o,s]);else if(n){J(a,o,r,a,o,n,d)&&h.push([t,a,o,s])}})),[u,h]}function K(e,t){let r=e.route.path;return e.pathname!==t.pathname||r&&r.endsWith("*")&&e.params["*"]!==t.params["*"]}function J(e,r,a,n,o,i,s){let l=c(e),d=r.params,u=c(n),h=o.params,f=K(r,o)||l.toString()===u.toString()||l.search!==u.search||i;if(o.route.shouldRevalidate){let e=o.route.shouldRevalidate(t({currentUrl:l,currentParams:d,nextUrl:u,nextParams:h},a,{actionResult:s,defaultShouldRevalidate:f}));if("boolean"==typeof e)return e}return f}async function Y(e,t,r,a,n,o,i){let l,d,h;void 0===o&&(o=!1),void 0===i&&(i=!1);let f=new Promise(((e,t)=>h=t)),p=()=>h();t.signal.addEventListener("abort",p);try{let a=r.route[e];E(a,"Could not find the "+e+' to run on the "'+r.route.id+'" route'),d=await Promise.race([a({request:t,params:r.params}),f])}catch(e){l=u.error,d=e}finally{t.signal.removeEventListener("abort",p)}if(d instanceof Response){let e,h=d.status;if(h>=300&&h<=399){let e=d.headers.get("Location");E(e,"Redirects returned/thrown from loaders/actions must have a Location header");let i=M(e,x(a.slice(0,a.indexOf(r)+1)).map((e=>e.pathnameBase)),c(t.url).pathname);if(E(s(i),"Unable to resolve redirect location: "+d.headers.get("Location")),n){let e=i.pathname;i.pathname="/"===e?n:S([n,e])}if(e=s(i),o)throw d.headers.set("Location",e),d;return{type:u.redirect,status:h,location:e,revalidate:null!==d.headers.get("X-Remix-Revalidate")}}if(i)throw{type:l||u.data,response:d};let f=d.headers.get("Content-Type");return e=f&&f.startsWith("application/json")?await d.json():await d.text(),l===u.error?{type:l,error:new U(h,d.statusText,e),headers:d.headers}:{type:u.data,data:e,statusCode:d.status,headers:d.headers}}return l===u.error?{type:l,error:d}:d instanceof O?{type:u.deferred,deferredData:d}:{type:u.data,data:d}}function G(e,t,r){let a=c(oe(e)).toString(),n={signal:t};if(r){let{formMethod:e,formEncType:t,formData:a}=r;n.method=e.toUpperCase(),n.body="application/x-www-form-urlencoded"===t?V(a):a}return new Request(a,n)}function V(e){let t=new URLSearchParams;for(let[r,a]of e.entries())E("string"==typeof a,'File inputs are not supported with encType "application/x-www-form-urlencoded", please use "multipart/form-data" instead.'),t.append(r,a);return t}function X(e,t,r,a,n){let o,i={},s=null,l=!1,c={};return r.forEach(((r,d)=>{let u=t[d].route.id;if(E(!le(r),"Cannot handle redirect results in processLoaderData"),se(r)){let t=ee(e,u),n=r.error;a&&(n=Object.values(a)[0],a=void 0),s=Object.assign(s||{},{[t.route.id]:n}),l||(l=!0,o=_(r.error)?r.error.status:500),r.headers&&(c[u]=r.headers)}else ie(r)?(n&&n.set(u,r.deferredData),i[u]=r.deferredData.data):(i[u]=r.data,null==r.statusCode||200===r.statusCode||l||(o=r.statusCode),r.headers&&(c[u]=r.headers))})),a&&(s=a),{loaderData:i,errors:s,statusCode:o||200,loaderHeaders:c}}function Q(e,r,a,n,o,i,s,l){let{loaderData:c,errors:d}=X(r,a,n,o,l);for(let r=0;r<i.length;r++){let[a,,n]=i[r];E(void 0!==s&&void 0!==s[r],"Did not find corresponding fetcher result");let o=s[r];if(se(o)){let r=ee(e.matches,n.route.id);d&&d[r.route.id]||(d=t({},d,{[r.route.id]:o.error})),e.fetchers.delete(a)}else{if(le(o))throw new Error("Unhandled fetcher revalidation redirect");if(ie(o))throw new Error("Unhandled fetcher deferred data");{let t={state:"idle",data:o.data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};e.fetchers.set(a,t)}}}return{loaderData:c,errors:d}}function Z(e,r,a){let n=t({},r);return a.forEach((t=>{let a=t.route.id;void 0===r[a]&&void 0!==e[a]&&(n[a]=e[a])})),n}function ee(e,t){return(t?e.slice(0,e.findIndex((e=>e.route.id===t))+1):[...e]).reverse().find((e=>!0===e.route.hasErrorBoundary))||e[0]}function te(e,t,r){let a=e.find((e=>e.index||!e.path||"/"===e.path))||{id:"__shim-"+t+"-route__"};return{matches:[{params:{},pathname:"",pathnameBase:"",route:a}],route:a,error:new U(t,r,null)}}function re(e){return te(e,404,"Not Found")}function ae(e){let t="string"==typeof e?e:s(e);return console.warn("You're trying to submit to a route that does not have an action.  To fix this, please add an `action` function to the route for ["+t+"]"),{type:u.error,error:new U(405,"Method Not Allowed","")}}function ne(e){for(let t=e.length-1;t>=0;t--){let r=e[t];if(le(r))return r}}function oe(e){return s(t({},"string"==typeof e?l(e):e,{hash:""}))}function ie(e){return e.type===u.deferred}function se(e){return e.type===u.error}function le(e){return(e&&e.type)===u.redirect}function ce(e){if(!(e instanceof Response))return!1;let t=e.status,r=e.headers.get("Location");return t>=300&&t<=399&&null!=r}async function de(e,t,r,a,n,o){for(let i=0;i<r.length;i++){let s=r[i],l=t[i],c=e.find((e=>e.route.id===l.route.id)),d=null!=c&&!K(c,l)&&void 0!==(o&&o[l.route.id]);ie(s)&&(n||d)&&await ue(s,a,n).then((e=>{e&&(r[i]=e||r[i])}))}}async function ue(e,t,r){if(void 0===r&&(r=!1),!await e.deferredData.resolveData(t)){if(r)try{return{type:u.data,data:e.deferredData.unwrappedData}}catch(e){return{type:u.error,error:e}}return{type:u.data,data:e.deferredData.data}}}function he(e){return new URLSearchParams(e).getAll("index").some((e=>""===e))}function fe(e,t){let{route:r,pathname:a,params:n}=e;return{id:r.id,pathname:a,params:n,data:t[r.id],handle:r.handle}}function pe(e,t){let r="string"==typeof t?l(t).search:t.search;if(e[e.length-1].route.index&&he(r||""))return e[e.length-1];let a=x(e);return a[a.length-1]}e.AbortedDeferredError=L,e.ErrorResponse=U,e.IDLE_FETCHER=N,e.IDLE_NAVIGATION=k,e.UNSAFE_convertRoutesToDataRoutes=h,e.UNSAFE_getPathContributingMatches=x,e.createBrowserHistory=function(e){return void 0===e&&(e={}),d((function(e,t){let{pathname:r,search:a,hash:n}=e.location;return i("",{pathname:r,search:a,hash:n},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}),(function(e,t){return"string"==typeof t?t:s(t)}),null,e)},e.createHashHistory=function(e){return void 0===e&&(e={}),d((function(e,t){let{pathname:r="/",search:a="",hash:n=""}=l(e.location.hash.substr(1));return i("",{pathname:r,search:a,hash:n},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}),(function(e,t){let r=e.document.querySelector("base"),a="";if(r&&r.getAttribute("href")){let t=e.location.href,r=t.indexOf("#");a=-1===r?t:t.slice(0,r)}return a+"#"+("string"==typeof t?t:s(t))}),(function(e,t){n("/"===e.pathname.charAt(0),"relative pathnames are not supported in hash history.push("+JSON.stringify(t)+")")}),e)},e.createMemoryHistory=function(t){void 0===t&&(t={});let r,{initialEntries:a=["/"],initialIndex:o,v5Compat:l=!1}=t;r=a.map(((e,t)=>p(e,"string"==typeof e?null:e.state,0===t?"default":void 0)));let c=h(null==o?r.length-1:o),d=e.Action.Pop,u=null;function h(e){return Math.min(Math.max(e,0),r.length-1)}function f(){return r[c]}function p(e,t,a){void 0===t&&(t=null);let o=i(r?f().pathname:"/",e,t,a);return n("/"===o.pathname.charAt(0),"relative pathnames are not supported in memory history: "+JSON.stringify(e)),o}return{get index(){return c},get action(){return d},get location(){return f()},createHref:e=>"string"==typeof e?e:s(e),encodeLocation:e=>e,push(t,a){d=e.Action.Push;let n=p(t,a);c+=1,r.splice(c,r.length,n),l&&u&&u({action:d,location:n})},replace(t,a){d=e.Action.Replace;let n=p(t,a);r[c]=n,l&&u&&u({action:d,location:n})},go(t){d=e.Action.Pop,c=h(c+t),u&&u({action:d,location:f()})},listen:e=>(u=e,()=>{u=null})}},e.createPath=s,e.createRouter=function(r){E(r.routes.length>0,"You must provide a non-empty routes array to createRouter");let a=h(r.routes),n=null,o=new Set,s=null,l=null,c=null,d=!1,u=f(a,r.history.location,r.basename),p=null;if(null==u){let{matches:e,route:t,error:r}=re(a);u=e,p={[t.id]:r}}let m,g,v=!u.some((e=>e.route.loader))||null!=r.hydrationData,y={historyAction:r.history.action,location:r.history.location,matches:u,initialized:v,navigation:k,restoreScrollPosition:null,preventScrollReset:!1,revalidation:"idle",loaderData:r.hydrationData&&r.hydrationData.loaderData||{},actionData:r.hydrationData&&r.hydrationData.actionData||null,errors:r.hydrationData&&r.hydrationData.errors||p,fetchers:new Map},w=e.Action.Pop,b=!1,D=!1,A=!1,R=[],P=[],x=new Map,M=0,S=-1,C=new Map,T=new Set,j=new Map,L=new Map;function O(e){y=t({},y,e),o.forEach((e=>e(y)))}function H(a,n){var o;O(t({},null!=y.actionData&&null!=y.navigation.formMethod&&"loading"===y.navigation.state&&(null==(o=y.navigation.formAction)?void 0:o.split("?")[0])===a.pathname?{}:{actionData:null},n,n.loaderData?{loaderData:Z(y.loaderData,n.loaderData,n.matches||[])}:{},{historyAction:w,location:a,initialized:!0,navigation:k,revalidation:"idle",restoreScrollPosition:!y.navigation.formData&&he(a,n.matches||y.matches),preventScrollReset:b})),D||w===e.Action.Pop||(w===e.Action.Push?r.history.push(a,a.state):w===e.Action.Replace&&r.history.replace(a,a.state)),w=e.Action.Pop,b=!1,D=!1,A=!1,R=[],P=[]}async function _(n,o,d){g&&g.abort(),g=null,w=n,D=!0===(d&&d.startUninterruptedRevalidation),function(e,t){if(s&&l&&c){let r=t.map((e=>fe(e,y.loaderData))),a=l(e,r)||e.key;s[a]=c()}}(y.location,y.matches),b=!0===(d&&d.preventScrollReset);let u=d&&d.overrideNavigation,h=f(a,o,r.basename);if(!h){let{matches:e,route:t,error:r}=re(a);return ce(),void H(o,{matches:e,loaderData:{},errors:{[t.id]:r}})}if(p=y.location,v=o,p.pathname===v.pathname&&p.search===v.search&&p.hash!==v.hash)return void H(o,{matches:h});var p,v;g=new AbortController;let C,U,_=G(o,g.signal,d&&d.submission);if(d&&d.pendingError)U={[ee(h).route.id]:d.pendingError};else if(d&&d.submission){let r=await async function(r,a,n,o,s){let l;K(),O({navigation:t({state:"submitting",location:a},n)});let c=pe(o,a);if(c.route.action){if(l=await Y("action",r,c,o,m.basename),r.signal.aborted)return{shortCircuited:!0}}else l=ae(a);if(le(l)){let e=t({state:"loading",location:i(y.location,l.location)},n);return await q(l,e,s&&s.replace),{shortCircuited:!0}}if(se(l)){let t=ee(o,c.route.id);return!0!==(s&&s.replace)&&(w=e.Action.Push),{pendingActionError:{[t.route.id]:l.error}}}if(ie(l))throw new Error("defer() is not supported in actions");return{pendingActionData:{[c.route.id]:l.data}}}(_,o,d.submission,h,{replace:d.replace});if(r.shortCircuited)return;C=r.pendingActionData,U=r.pendingActionError,u=t({state:"loading",location:o},d.submission)}let{shortCircuited:k,loaderData:N,errors:W}=await async function(e,r,a,n,o,i,s,l){let c=n;if(!c){c={state:"loading",location:r,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0}}let[d,u]=z(y,a,o,r,A,R,P,s,l,j);if(ce((e=>!(a&&a.some((t=>t.route.id===e)))||d&&d.some((t=>t.route.id===e)))),0===d.length&&0===u.length)return H(r,{matches:a,loaderData:Z(y.loaderData,{},a),errors:l||null,actionData:s||null}),{shortCircuited:!0};D||(u.forEach((e=>{let[t]=e,r=y.fetchers.get(t),a={state:"loading",data:r&&r.data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};y.fetchers.set(t,a)})),O(t({navigation:c,actionData:s||y.actionData||null},u.length>0?{fetchers:new Map(y.fetchers)}:{})));S=++M,u.forEach((e=>{let[t]=e;return x.set(t,g)}));let{results:h,loaderResults:f,fetcherResults:p}=await B(y.matches,a,d,u,e);if(e.signal.aborted)return{shortCircuited:!0};u.forEach((e=>{let[t]=e;return x.delete(t)}));let m=ne(h);if(m){let e=I(y,m);return await q(m,e,i),{shortCircuited:!0}}let{loaderData:v,errors:w}=Q(y,a,d,f,l,u,p,L);L.forEach(((e,t)=>{e.subscribe((r=>{(r||e.done)&&L.delete(t)}))})),function(){let e=[];for(let t of T){let r=y.fetchers.get(t);E(r,"Expected fetcher: "+t),"loading"===r.state&&(T.delete(t),e.push(t))}te(e)}();let b=oe(S);return t({loaderData:v,errors:w},b||u.length>0?{fetchers:new Map(y.fetchers)}:{})}(_,o,h,u,d&&d.submission,d&&d.replace,C,U);k||(g=null,H(o,{matches:h,loaderData:N,errors:W}))}function $(e){return y.fetchers.get(e)||N}async function q(t,r,a){t.revalidate&&(A=!0),E(r.location,"Expected a location on the redirect navigation"),g=null;let n=!0===a?e.Action.Replace:e.Action.Push;await _(n,r.location,{overrideNavigation:r})}async function B(e,t,r,a,n){let o=await Promise.all([...r.map((e=>Y("loader",n,e,t,m.basename))),...a.map((e=>{let[,t,r,a]=e;return Y("loader",G(t,n.signal),r,a,m.basename)}))]),i=o.slice(0,r.length),s=o.slice(r.length);return await Promise.all([de(e,r,i,n.signal,!1,y.loaderData),de(e,a.map((e=>{let[,,t]=e;return t})),s,n.signal,!0)]),{results:o,loaderResults:i,fetcherResults:s}}function K(){A=!0,R.push(...ce()),j.forEach(((e,t)=>{x.has(t)&&(P.push(t),X(t))}))}function J(e,t,r){let a=ee(y.matches,t);V(e),O({errors:{[a.route.id]:r},fetchers:new Map(y.fetchers)})}function V(e){x.has(e)&&X(e),j.delete(e),C.delete(e),T.delete(e),y.fetchers.delete(e)}function X(e){let t=x.get(e);E(t,"Expected fetch controller: "+e),t.abort(),x.delete(e)}function te(e){for(let t of e){let e={state:"idle",data:$(t).data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};y.fetchers.set(t,e)}}function oe(e){let t=[];for(let[r,a]of C)if(a<e){let e=y.fetchers.get(r);E(e,"Expected fetcher: "+r),"loading"===e.state&&(X(r),C.delete(r),t.push(r))}return te(t),t.length>0}function ce(e){let t=[];return L.forEach(((r,a)=>{e&&!e(a)||(r.cancel(),t.push(a),L.delete(a))})),t}function he(e,t){if(s&&l&&c){let r=t.map((e=>fe(e,y.loaderData))),a=l(e,r)||e.key,n=s[a];if("number"==typeof n)return n}return null}return m={get basename(){return r.basename},get state(){return y},get routes(){return a},initialize:function(){return n=r.history.listen((e=>{let{action:t,location:r}=e;return _(t,r)})),y.initialized||_(e.Action.Pop,y.location),m},subscribe:function(e){return o.add(e),()=>o.delete(e)},enableScrollRestoration:function(e,t,r){if(s=e,c=t,l=r||(e=>e.key),!d&&y.navigation===k){d=!0;let e=he(y.location,y.matches);null!=e&&O({restoreScrollPosition:e})}return()=>{s=null,c=null,l=null}},navigate:async function(t,a){if("number"==typeof t)return void r.history.go(t);let{path:n,submission:o,error:s}=F(t,a),l=i(y.location,n,a&&a.state);l=r.history.encodeLocation(l);let c=!0===(a&&a.replace)||null!=o?e.Action.Replace:e.Action.Push,d=a&&"preventScrollReset"in a?!0===a.preventScrollReset:void 0;return await _(c,l,{submission:o,pendingError:s,preventScrollReset:d,replace:a&&a.replace})},fetch:function(e,n,o,s){if(W)throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");x.has(e)&&X(e);let l=f(a,o,r.basename);if(!l)return void J(e,n,new U(404,"Not Found",null));let{path:c,submission:d}=F(o,s,!0),u=pe(l,c);d?async function(e,n,o,s,l,c){if(K(),j.delete(e),!s.route.action){let{error:t}=ae(o);return void J(e,n,t)}let d=y.fetchers.get(e),u=t({state:"submitting"},c,{data:d&&d.data});y.fetchers.set(e,u),O({fetchers:new Map(y.fetchers)});let h=new AbortController,p=G(o,h.signal,c);x.set(e,h);let v=await Y("action",p,s,l,m.basename);if(p.signal.aborted)return void(x.get(e)===h&&x.delete(e));if(le(v)){x.delete(e),T.add(e);let r=t({state:"loading"},c,{data:void 0});y.fetchers.set(e,r),O({fetchers:new Map(y.fetchers)});let a=t({state:"loading",location:i(y.location,v.location)},c);return void await q(v,a)}if(se(v))return void J(e,n,v.error);ie(v)&&E(!1,"defer() is not supported in actions");let b=y.navigation.location||y.location,D=G(b,h.signal),U="idle"!==y.navigation.state?f(a,y.navigation.location,r.basename):y.matches;E(U,"Didn't find any matches after fetcher action");let _=++M;C.set(e,_);let k=t({state:"loading",data:v.data},c);y.fetchers.set(e,k);let[N,W]=z(y,U,c,b,A,R,P,{[s.route.id]:v.data},void 0,j);W.filter((t=>{let[r]=t;return r!==e})).forEach((e=>{let[t]=e,r=y.fetchers.get(t),a={state:"loading",data:r&&r.data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};y.fetchers.set(t,a),x.set(t,h)})),O({fetchers:new Map(y.fetchers)});let{results:$,loaderResults:F,fetcherResults:V}=await B(y.matches,U,N,W,D);if(h.signal.aborted)return;C.delete(e),x.delete(e),W.forEach((e=>{let[t]=e;return x.delete(t)}));let X=ne($);if(X){let e=I(y,X);return void await q(X,e)}let{loaderData:ee,errors:te}=Q(y,y.matches,N,F,void 0,W,V,L),re={state:"idle",data:v.data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};y.fetchers.set(e,re);let ce=oe(_);"loading"===y.navigation.state&&_>S?(E(w,"Expected pending action"),g&&g.abort(),H(y.navigation.location,{matches:U,loaderData:ee,errors:te,fetchers:new Map(y.fetchers)})):(O(t({errors:te,loaderData:Z(y.loaderData,ee,U)},ce?{fetchers:new Map(y.fetchers)}:{})),A=!1)}(e,n,c,u,l,d):(j.set(e,[c,u,l]),async function(e,t,r,a,n){let o=y.fetchers.get(e),i={state:"loading",formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0,data:o&&o.data};y.fetchers.set(e,i),O({fetchers:new Map(y.fetchers)});let s=new AbortController,l=G(r,s.signal);x.set(e,s);let c=await Y("loader",l,a,n,m.basename);ie(c)&&(c=await ue(c,l.signal,!0)||c);x.get(e)===s&&x.delete(e);if(l.signal.aborted)return;if(le(c)){let e=I(y,c);return void await q(c,e)}if(se(c)){let r=ee(y.matches,t);return y.fetchers.delete(e),void O({fetchers:new Map(y.fetchers),errors:{[r.route.id]:c.error}})}E(!ie(c),"Unhandled fetcher deferred data");let d={state:"idle",data:c.data,formMethod:void 0,formAction:void 0,formEncType:void 0,formData:void 0};y.fetchers.set(e,d),O({fetchers:new Map(y.fetchers)})}(e,n,c,u,l))},revalidate:function(){K(),O({revalidation:"loading"}),"submitting"!==y.navigation.state&&("idle"!==y.navigation.state?_(w||y.historyAction,y.navigation.location,{overrideNavigation:y.navigation}):_(y.historyAction,y.location,{startUninterruptedRevalidation:!0}))},createHref:e=>r.history.createHref(e),getFetcher:$,deleteFetcher:V,dispose:function(){n&&n(),o.clear(),g&&g.abort(),y.fetchers.forEach(((e,t)=>V(t)))},_internalFetchControllers:x,_internalActiveDeferreds:L},m},e.defer=function(e){return new O(e)},e.generatePath=function(e,t){return void 0===t&&(t={}),e.replace(/:(\w+)/g,((e,r)=>(E(null!=t[r],'Missing ":'+r+'" param'),t[r]))).replace(/(\/?)\*/,((e,r,a,n)=>null==t["*"]?"/*"===n?"/":"":""+r+t["*"]))},e.getStaticContextFromError=function(e,r,a){return t({},r,{statusCode:500,errors:{[r._deepestRenderedBoundaryId||e[0].id]:a}})},e.getToPathname=function(e){return""===e||""===e.pathname?"/":"string"==typeof e?l(e).pathname:e.pathname},e.invariant=E,e.isRouteErrorResponse=_,e.joinPaths=S,e.json=function(e,r){void 0===r&&(r={});let a="number"==typeof r?{status:r}:r,n=new Headers(a.headers);return n.has("Content-Type")||n.set("Content-Type","application/json; charset=utf-8"),new Response(JSON.stringify(e),t({},a,{headers:n}))},e.matchPath=w,e.matchRoutes=f,e.normalizePathname=C,e.parsePath=l,e.redirect=function(e,r){void 0===r&&(r=302);let a=r;"number"==typeof a?a={status:a}:void 0===a.status&&(a.status=302);let n=new Headers(a.headers);return n.set("Location",e),new Response(null,t({},a,{headers:n}))},e.resolvePath=R,e.resolveTo=M,e.stripBasename=D,e.unstable_createStaticHandler=function(e){E(e.length>0,"You must provide a non-empty routes array to unstable_createStaticHandler");let r=h(e);async function a(e,r,a,i){E(e.signal,"query()/queryRoute() requests must contain an AbortController signal");try{if($.has(e.method)){let s=await async function(e,r,a,i){let s;if(a.route.action){if(s=await Y("action",e,a,r,void 0,!0,i),e.signal.aborted){throw new Error((i?"queryRoute":"query")+"() call aborted")}}else{if(i)throw o(null,{status:405,statusText:"Method Not Allowed"});s=ae(e.url)}if(le(s))throw new Response(null,{status:s.status,headers:{Location:s.location}});if(ie(s))throw new Error("defer() is not supported in actions");if(i){if(se(s)){return{matches:[a],loaderData:{},actionData:null,errors:{[ee(r,a.route.id).route.id]:s.error},statusCode:500,loaderHeaders:{},actionHeaders:{}}}return{matches:[a],loaderData:{},actionData:{[a.route.id]:s.data},errors:null,statusCode:200,loaderHeaders:{},actionHeaders:{}}}if(se(s)){let o=ee(r,a.route.id);return t({},await n(e,r,void 0,{[o.route.id]:s.error}),{statusCode:_(s.error)?s.error.status:500,actionData:null,actionHeaders:t({},s.headers?{[a.route.id]:s.headers}:{})})}return t({},await n(e,r),s.statusCode?{statusCode:s.statusCode}:{},{actionData:{[a.route.id]:s.data},actionHeaders:t({},s.headers?{[a.route.id]:s.headers}:{})})}(e,a,i||pe(a,r),null!=i);return s}let s=await n(e,a,i);return s instanceof Response?s:t({},s,{actionData:null,actionHeaders:{}})}catch(e){if((s=e)&&s.response instanceof Response&&(s.type===u.data||u.error)){if(e.type===u.error&&!ce(e.response))throw e.response;return e.response}if(ce(e))return e;throw e}var s}async function n(e,r,a,n){let o=null!=a,i=(a?[a]:B(r,Object.keys(n||{})[0])).filter((e=>e.route.loader));if(0===i.length)return{matches:r,loaderData:{},errors:n||null,statusCode:200,loaderHeaders:{}};let s=await Promise.all([...i.map((t=>Y("loader",e,t,r,void 0,!0,o)))]);if(e.signal.aborted){throw new Error((o?"queryRoute":"query")+"() call aborted")}return s.forEach((e=>{ie(e)&&e.deferredData.cancel()})),t({},X(r,i,s,n),{matches:r})}function o(e,r){return new Response(e,t({},r,{headers:t({},r.headers,{"X-Remix-Router-Error":"yes"})}))}return{dataRoutes:r,query:async function(e){let n=i("",s(new URL(e.url)),null,"default"),o=f(r,n);if(!q.has(e.method)){let{matches:e,route:t,error:a}=function(e){return te(e,405,"Method Not Allowed")}(r);return{location:n,matches:e,loaderData:{},actionData:null,errors:{[t.id]:a},statusCode:a.status,loaderHeaders:{},actionHeaders:{}}}if(!o){let{matches:e,route:t,error:a}=re(r);return{location:n,matches:e,loaderData:{},actionData:null,errors:{[t.id]:a},statusCode:a.status,loaderHeaders:{},actionHeaders:{}}}let l=await a(e,n,o);return l instanceof Response?l:t({location:n},l)},queryRoute:async function(e,t){let n=i("",s(new URL(e.url)),null,"default"),l=f(r,n);if(!q.has(e.method))throw o(null,{status:405,statusText:"Method Not Allowed"});if(!l)throw o(null,{status:404,statusText:"Not Found"});let c=t?l.find((e=>e.route.id===t)):pe(l,n);if(!c)throw o(null,{status:404,statusText:"Not Found"});let d=await a(e,n,l,c);if(d instanceof Response)return d;let u=d.errors?Object.values(d.errors)[0]:void 0;if(void 0!==u)throw u;let h=[d.actionData,d.loaderData].find((e=>e));return Object.values(h||{})[0]}}},e.warning=A,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=remix-router.js.map
