var IS=Object.defineProperty,NS=Object.defineProperties;var FS=Object.getOwnPropertyDescriptors;var Pm=Object.getOwnPropertySymbols;var US=Object.prototype.hasOwnProperty,OS=Object.prototype.propertyIsEnumerable;var Dm=Math.pow,Lm=(e,t,n)=>t in e?IS(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Nu=(e,t)=>{for(var n in t||(t={}))US.call(t,n)&&Lm(e,n,t[n]);if(Pm)for(var n of Pm(t))OS.call(t,n)&&Lm(e,n,t[n]);return e},Im=(e,t)=>NS(e,FS(t));var Fu=(e,t,n)=>new Promise((i,r)=>{var s=l=>{try{o(n.next(l))}catch(c){r(c)}},a=l=>{try{o(n.throw(l))}catch(c){r(c)}},o=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,a);o((n=n.apply(e,t)).next())});/**
* @vue/shared v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function mp(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return n=>n in t}const de={},ca=[],_i=()=>{},zg=()=>!1,Kf=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),vp=e=>e.startsWith("onUpdate:"),we=Object.assign,_p=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},BS=Object.prototype.hasOwnProperty,ie=(e,t)=>BS.call(e,t),Ht=Array.isArray,fa=e=>el(e)==="[object Map]",Da=e=>el(e)==="[object Set]",Nm=e=>el(e)==="[object Date]",kt=e=>typeof e=="function",Me=e=>typeof e=="string",Zn=e=>typeof e=="symbol",fe=e=>e!==null&&typeof e=="object",Vg=e=>(fe(e)||kt(e))&&kt(e.then)&&kt(e.catch),Gg=Object.prototype.toString,el=e=>Gg.call(e),HS=e=>el(e).slice(8,-1),kg=e=>el(e)==="[object Object]",gp=e=>Me(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,_o=mp(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Zf=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},zS=/-\w/g,Nn=Zf(e=>e.replace(zS,t=>t.slice(1).toUpperCase())),VS=/\B([A-Z])/g,Pr=Zf(e=>e.replace(VS,"-$1").toLowerCase()),Jf=Zf(e=>e.charAt(0).toUpperCase()+e.slice(1)),Uu=Zf(e=>e?`on${Jf(e)}`:""),Tr=(e,t)=>!Object.is(e,t),fc=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},Wg=(e,t,n,i=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:i,value:n})},jf=e=>{const t=parseFloat(e);return isNaN(t)?e:t},GS=e=>{const t=Me(e)?Number(e):NaN;return isNaN(t)?e:t};let Fm;const Qf=()=>Fm||(Fm=typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:typeof global!="undefined"?global:{});function xp(e){if(Ht(e)){const t={};for(let n=0;n<e.length;n++){const i=e[n],r=Me(i)?qS(i):xp(i);if(r)for(const s in r)t[s]=r[s]}return t}else if(Me(e)||fe(e))return e}const kS=/;(?![^(]*\))/g,WS=/:([^]+)/,XS=/\/\*[^]*?\*\//g;function qS(e){const t={};return e.replace(XS,"").split(kS).forEach(n=>{if(n){const i=n.split(WS);i.length>1&&(t[i[0].trim()]=i[1].trim())}}),t}function yp(e){let t="";if(Me(e))t=e;else if(Ht(e))for(let n=0;n<e.length;n++){const i=yp(e[n]);i&&(t+=i+" ")}else if(fe(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const YS="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",$S=mp(YS);function Xg(e){return!!e||e===""}function KS(e,t){if(e.length!==t.length)return!1;let n=!0;for(let i=0;n&&i<e.length;i++)n=bs(e[i],t[i]);return n}function bs(e,t){if(e===t)return!0;let n=Nm(e),i=Nm(t);if(n||i)return n&&i?e.getTime()===t.getTime():!1;if(n=Zn(e),i=Zn(t),n||i)return e===t;if(n=Ht(e),i=Ht(t),n||i)return n&&i?KS(e,t):!1;if(n=fe(e),i=fe(t),n||i){if(!n||!i)return!1;const r=Object.keys(e).length,s=Object.keys(t).length;if(r!==s)return!1;for(const a in e){const o=e.hasOwnProperty(a),l=t.hasOwnProperty(a);if(o&&!l||!o&&l||!bs(e[a],t[a]))return!1}}return String(e)===String(t)}function Sp(e,t){return e.findIndex(n=>bs(n,t))}const qg=e=>!!(e&&e.__v_isRef===!0),ZS=e=>Me(e)?e:e==null?"":Ht(e)||fe(e)&&(e.toString===Gg||!kt(e.toString))?qg(e)?ZS(e.value):JSON.stringify(e,Yg,2):String(e),Yg=(e,t)=>qg(t)?Yg(e,t.value):fa(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[i,r],s)=>(n[Ou(i,s)+" =>"]=r,n),{})}:Da(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>Ou(n))}:Zn(t)?Ou(t):fe(t)&&!Ht(t)&&!kg(t)?String(t):t,Ou=(e,t="")=>{var n;return Zn(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let nn;class JS{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=nn,!t&&nn&&(this.index=(nn.scopes||(nn.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].pause();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].resume();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].resume()}}run(t){if(this._active){const n=nn;try{return nn=this,t()}finally{nn=n}}}on(){++this._on===1&&(this.prevScope=nn,nn=this)}off(){this._on>0&&--this._on===0&&(nn=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function jS(){return nn}let ve;const Bu=new WeakSet;class $g{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,nn&&nn.active&&nn.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Bu.has(this)&&(Bu.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Zg(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Um(this),Jg(this);const t=ve,n=Xn;ve=this,Xn=!0;try{return this.fn()}finally{jg(this),ve=t,Xn=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Tp(t);this.deps=this.depsTail=void 0,Um(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Bu.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ud(this)&&this.run()}get dirty(){return ud(this)}}let Kg=0,go,xo;function Zg(e,t=!1){if(e.flags|=8,t){e.next=xo,xo=e;return}e.next=go,go=e}function Mp(){Kg++}function bp(){if(--Kg>0)return;if(xo){let t=xo;for(xo=void 0;t;){const n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;go;){let t=go;for(go=void 0;t;){const n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(i){e||(e=i)}t=n}}if(e)throw e}function Jg(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function jg(e){let t,n=e.depsTail,i=n;for(;i;){const r=i.prevDep;i.version===-1?(i===n&&(n=r),Tp(i),QS(i)):t=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}e.deps=t,e.depsTail=n}function ud(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Qg(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Qg(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Fo)||(e.globalVersion=Fo,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!ud(e))))return;e.flags|=2;const t=e.dep,n=ve,i=Xn;ve=e,Xn=!0;try{Jg(e);const r=e.fn(e._value);(t.version===0||Tr(r,e._value))&&(e.flags|=128,e._value=r,t.version++)}catch(r){throw t.version++,r}finally{ve=n,Xn=i,jg(e),e.flags&=-3}}function Tp(e,t=!1){const{dep:n,prevSub:i,nextSub:r}=e;if(i&&(i.nextSub=r,e.prevSub=void 0),r&&(r.prevSub=i,e.nextSub=void 0),n.subs===e&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let s=n.computed.deps;s;s=s.nextDep)Tp(s,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function QS(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let Xn=!0;const t0=[];function Zi(){t0.push(Xn),Xn=!1}function Ji(){const e=t0.pop();Xn=e===void 0?!0:e}function Um(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const n=ve;ve=void 0;try{t()}finally{ve=n}}}let Fo=0;class tM{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Ep{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ve||!Xn||ve===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==ve)n=this.activeLink=new tM(ve,this),ve.deps?(n.prevDep=ve.depsTail,ve.depsTail.nextDep=n,ve.depsTail=n):ve.deps=ve.depsTail=n,e0(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=ve.depsTail,n.nextDep=void 0,ve.depsTail.nextDep=n,ve.depsTail=n,ve.deps===n&&(ve.deps=i)}return n}trigger(t){this.version++,Fo++,this.notify(t)}notify(t){Mp();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{bp()}}}function e0(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let i=t.deps;i;i=i.nextDep)e0(i)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const hd=new WeakMap,ms=Symbol(""),dd=Symbol(""),Uo=Symbol("");function Oe(e,t,n){if(Xn&&ve){let i=hd.get(e);i||hd.set(e,i=new Map);let r=i.get(n);r||(i.set(n,r=new Ep),r.map=i,r.key=n),r.track()}}function Xi(e,t,n,i,r,s){const a=hd.get(e);if(!a){Fo++;return}const o=l=>{l&&l.trigger()};if(Mp(),t==="clear")a.forEach(o);else{const l=Ht(e),c=l&&gp(n);if(l&&n==="length"){const f=Number(i);a.forEach((u,h)=>{(h==="length"||h===Uo||!Zn(h)&&h>=f)&&o(u)})}else switch((n!==void 0||a.has(void 0))&&o(a.get(n)),c&&o(a.get(Uo)),t){case"add":l?c&&o(a.get("length")):(o(a.get(ms)),fa(e)&&o(a.get(dd)));break;case"delete":l||(o(a.get(ms)),fa(e)&&o(a.get(dd)));break;case"set":fa(e)&&o(a.get(ms));break}}bp()}function Is(e){const t=te(e);return t===e?t:(Oe(t,"iterate",Uo),Dn(e)?t:t.map(Jn))}function tu(e){return Oe(e=te(e),"iterate",Uo),e}function hr(e,t){return ji(e)?xa(vs(e)?Jn(t):t):Jn(t)}const eM={__proto__:null,[Symbol.iterator](){return Hu(this,Symbol.iterator,e=>hr(this,e))},concat(...e){return Is(this).concat(...e.map(t=>Ht(t)?Is(t):t))},entries(){return Hu(this,"entries",e=>(e[1]=hr(this,e[1]),e))},every(e,t){return Di(this,"every",e,t,void 0,arguments)},filter(e,t){return Di(this,"filter",e,t,n=>n.map(i=>hr(this,i)),arguments)},find(e,t){return Di(this,"find",e,t,n=>hr(this,n),arguments)},findIndex(e,t){return Di(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return Di(this,"findLast",e,t,n=>hr(this,n),arguments)},findLastIndex(e,t){return Di(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return Di(this,"forEach",e,t,void 0,arguments)},includes(...e){return zu(this,"includes",e)},indexOf(...e){return zu(this,"indexOf",e)},join(e){return Is(this).join(e)},lastIndexOf(...e){return zu(this,"lastIndexOf",e)},map(e,t){return Di(this,"map",e,t,void 0,arguments)},pop(){return za(this,"pop")},push(...e){return za(this,"push",e)},reduce(e,...t){return Om(this,"reduce",e,t)},reduceRight(e,...t){return Om(this,"reduceRight",e,t)},shift(){return za(this,"shift")},some(e,t){return Di(this,"some",e,t,void 0,arguments)},splice(...e){return za(this,"splice",e)},toReversed(){return Is(this).toReversed()},toSorted(e){return Is(this).toSorted(e)},toSpliced(...e){return Is(this).toSpliced(...e)},unshift(...e){return za(this,"unshift",e)},values(){return Hu(this,"values",e=>hr(this,e))}};function Hu(e,t,n){const i=tu(e),r=i[t]();return i!==e&&!Dn(e)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=n(s.value)),s}),r}const nM=Array.prototype;function Di(e,t,n,i,r,s){const a=tu(e),o=a!==e&&!Dn(e),l=a[t];if(l!==nM[t]){const u=l.apply(e,s);return o?Jn(u):u}let c=n;a!==e&&(o?c=function(u,h){return n.call(this,hr(e,u),h,e)}:n.length>2&&(c=function(u,h){return n.call(this,u,h,e)}));const f=l.call(a,c,i);return o&&r?r(f):f}function Om(e,t,n,i){const r=tu(e);let s=n;return r!==e&&(Dn(e)?n.length>3&&(s=function(a,o,l){return n.call(this,a,o,l,e)}):s=function(a,o,l){return n.call(this,a,hr(e,o),l,e)}),r[t](s,...i)}function zu(e,t,n){const i=te(e);Oe(i,"iterate",Uo);const r=i[t](...n);return(r===-1||r===!1)&&Rp(n[0])?(n[0]=te(n[0]),i[t](...n)):r}function za(e,t,n=[]){Zi(),Mp();const i=te(e)[t].apply(e,n);return bp(),Ji(),i}const iM=mp("__proto__,__v_isRef,__isVue"),n0=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Zn));function rM(e){Zn(e)||(e=String(e));const t=te(this);return Oe(t,"has",e),t.hasOwnProperty(e)}class i0{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,i){if(n==="__v_skip")return t.__v_skip;const r=this._isReadonly,s=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return s;if(n==="__v_raw")return i===(r?s?pM:o0:s?a0:s0).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(i)?t:void 0;const a=Ht(t);if(!r){let l;if(a&&(l=eM[n]))return l;if(n==="hasOwnProperty")return rM}const o=Reflect.get(t,n,ze(t)?t:i);if((Zn(n)?n0.has(n):iM(n))||(r||Oe(t,"get",n),s))return o;if(ze(o)){const l=a&&gp(n)?o:o.value;return r&&fe(l)?md(l):l}return fe(o)?r?md(o):Ap(o):o}}class r0 extends i0{constructor(t=!1){super(!1,t)}set(t,n,i,r){let s=t[n];const a=Ht(t)&&gp(n);if(!this._isShallow){const c=ji(s);if(!Dn(i)&&!ji(i)&&(s=te(s),i=te(i)),!a&&ze(s)&&!ze(i))return c||(s.value=i),!0}const o=a?Number(n)<t.length:ie(t,n),l=Reflect.set(t,n,i,ze(t)?t:r);return t===te(r)&&(o?Tr(i,s)&&Xi(t,"set",n,i):Xi(t,"add",n,i)),l}deleteProperty(t,n){const i=ie(t,n);t[n];const r=Reflect.deleteProperty(t,n);return r&&i&&Xi(t,"delete",n,void 0),r}has(t,n){const i=Reflect.has(t,n);return(!Zn(n)||!n0.has(n))&&Oe(t,"has",n),i}ownKeys(t){return Oe(t,"iterate",Ht(t)?"length":ms),Reflect.ownKeys(t)}}class sM extends i0{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const aM=new r0,oM=new sM,lM=new r0(!0);const pd=e=>e,ml=e=>Reflect.getPrototypeOf(e);function cM(e,t,n){return function(...i){const r=this.__v_raw,s=te(r),a=fa(s),o=e==="entries"||e===Symbol.iterator&&a,l=e==="keys"&&a,c=r[e](...i),f=n?pd:t?xa:Jn;return!t&&Oe(s,"iterate",l?dd:ms),we(Object.create(c),{next(){const{value:u,done:h}=c.next();return h?{value:u,done:h}:{value:o?[f(u[0]),f(u[1])]:f(u),done:h}}})}}function vl(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function fM(e,t){const n={get(r){const s=this.__v_raw,a=te(s),o=te(r);e||(Tr(r,o)&&Oe(a,"get",r),Oe(a,"get",o));const{has:l}=ml(a),c=t?pd:e?xa:Jn;if(l.call(a,r))return c(s.get(r));if(l.call(a,o))return c(s.get(o));s!==a&&s.get(r)},get size(){const r=this.__v_raw;return!e&&Oe(te(r),"iterate",ms),r.size},has(r){const s=this.__v_raw,a=te(s),o=te(r);return e||(Tr(r,o)&&Oe(a,"has",r),Oe(a,"has",o)),r===o?s.has(r):s.has(r)||s.has(o)},forEach(r,s){const a=this,o=a.__v_raw,l=te(o),c=t?pd:e?xa:Jn;return!e&&Oe(l,"iterate",ms),o.forEach((f,u)=>r.call(s,c(f),c(u),a))}};return we(n,e?{add:vl("add"),set:vl("set"),delete:vl("delete"),clear:vl("clear")}:{add(r){!t&&!Dn(r)&&!ji(r)&&(r=te(r));const s=te(this);return ml(s).has.call(s,r)||(s.add(r),Xi(s,"add",r,r)),this},set(r,s){!t&&!Dn(s)&&!ji(s)&&(s=te(s));const a=te(this),{has:o,get:l}=ml(a);let c=o.call(a,r);c||(r=te(r),c=o.call(a,r));const f=l.call(a,r);return a.set(r,s),c?Tr(s,f)&&Xi(a,"set",r,s):Xi(a,"add",r,s),this},delete(r){const s=te(this),{has:a,get:o}=ml(s);let l=a.call(s,r);l||(r=te(r),l=a.call(s,r)),o&&o.call(s,r);const c=s.delete(r);return l&&Xi(s,"delete",r,void 0),c},clear(){const r=te(this),s=r.size!==0,a=r.clear();return s&&Xi(r,"clear",void 0,void 0),a}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=cM(r,e,t)}),n}function wp(e,t){const n=fM(e,t);return(i,r,s)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_raw"?i:Reflect.get(ie(n,r)&&r in i?n:i,r,s)}const uM={get:wp(!1,!1)},hM={get:wp(!1,!0)},dM={get:wp(!0,!1)};const s0=new WeakMap,a0=new WeakMap,o0=new WeakMap,pM=new WeakMap;function mM(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function vM(e){return e.__v_skip||!Object.isExtensible(e)?0:mM(HS(e))}function Ap(e){return ji(e)?e:Cp(e,!1,aM,uM,s0)}function _M(e){return Cp(e,!1,lM,hM,a0)}function md(e){return Cp(e,!0,oM,dM,o0)}function Cp(e,t,n,i,r){if(!fe(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const s=vM(e);if(s===0)return e;const a=r.get(e);if(a)return a;const o=new Proxy(e,s===2?i:n);return r.set(e,o),o}function vs(e){return ji(e)?vs(e.__v_raw):!!(e&&e.__v_isReactive)}function ji(e){return!!(e&&e.__v_isReadonly)}function Dn(e){return!!(e&&e.__v_isShallow)}function Rp(e){return e?!!e.__v_raw:!1}function te(e){const t=e&&e.__v_raw;return t?te(t):e}function gM(e){return!ie(e,"__v_skip")&&Object.isExtensible(e)&&Wg(e,"__v_skip",!0),e}const Jn=e=>fe(e)?Ap(e):e,xa=e=>fe(e)?md(e):e;function ze(e){return e?e.__v_isRef===!0:!1}function tN(e){return l0(e,!1)}function eN(e){return l0(e,!0)}function l0(e,t){return ze(e)?e:new xM(e,t)}class xM{constructor(t,n){this.dep=new Ep,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:te(t),this._value=n?t:Jn(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){const n=this._rawValue,i=this.__v_isShallow||Dn(t)||ji(t);t=i?t:te(t),Tr(t,n)&&(this._rawValue=t,this._value=i?t:Jn(t),this.dep.trigger())}}function yM(e){return ze(e)?e.value:e}const SM={get:(e,t,n)=>t==="__v_raw"?e:yM(Reflect.get(e,t,n)),set:(e,t,n,i)=>{const r=e[t];return ze(r)&&!ze(n)?(r.value=n,!0):Reflect.set(e,t,n,i)}};function c0(e){return vs(e)?e:new Proxy(e,SM)}class MM{constructor(t,n,i){this.fn=t,this.setter=n,this._value=void 0,this.dep=new Ep(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Fo-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&ve!==this)return Zg(this,!0),!0}get value(){const t=this.dep.track();return Qg(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function bM(e,t,n=!1){let i,r;return kt(e)?i=e:(i=e.get,r=e.set),new MM(i,r,n)}const _l={},Rc=new WeakMap;let os;function TM(e,t=!1,n=os){if(n){let i=Rc.get(n);i||Rc.set(n,i=[]),i.push(e)}}function EM(e,t,n=de){const{immediate:i,deep:r,once:s,scheduler:a,augmentJob:o,call:l}=n,c=S=>r?S:Dn(S)||r===!1||r===0?qi(S,1):qi(S);let f,u,h,d,v=!1,_=!1;if(ze(e)?(u=()=>e.value,v=Dn(e)):vs(e)?(u=()=>c(e),v=!0):Ht(e)?(_=!0,v=e.some(S=>vs(S)||Dn(S)),u=()=>e.map(S=>{if(ze(S))return S.value;if(vs(S))return c(S);if(kt(S))return l?l(S,2):S()})):kt(e)?t?u=l?()=>l(e,2):e:u=()=>{if(h){Zi();try{h()}finally{Ji()}}const S=os;os=f;try{return l?l(e,3,[d]):e(d)}finally{os=S}}:u=_i,t&&r){const S=u,E=r===!0?1/0:r;u=()=>qi(S(),E)}const m=jS(),p=()=>{f.stop(),m&&m.active&&_p(m.effects,f)};if(s&&t){const S=t;t=(...E)=>{S(...E),p()}}let g=_?new Array(e.length).fill(_l):_l;const M=S=>{if(!(!(f.flags&1)||!f.dirty&&!S))if(t){const E=f.run();if(r||v||(_?E.some((T,C)=>Tr(T,g[C])):Tr(E,g))){h&&h();const T=os;os=f;try{const C=[E,g===_l?void 0:_&&g[0]===_l?[]:g,d];g=E,l?l(t,3,C):t(...C)}finally{os=T}}}else f.run()};return o&&o(M),f=new $g(u),f.scheduler=a?()=>a(M,!1):M,d=S=>TM(S,!1,f),h=f.onStop=()=>{const S=Rc.get(f);if(S){if(l)l(S,4);else for(const E of S)E();Rc.delete(f)}},t?i?M(!0):g=f.run():a?a(M.bind(null,!0),!0):f.run(),p.pause=f.pause.bind(f),p.resume=f.resume.bind(f),p.stop=p,p}function qi(e,t=1/0,n){if(t<=0||!fe(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,ze(e))qi(e.value,t,n);else if(Ht(e))for(let i=0;i<e.length;i++)qi(e[i],t,n);else if(Da(e)||fa(e))e.forEach(i=>{qi(i,t,n)});else if(kg(e)){for(const i in e)qi(e[i],t,n);for(const i of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,i)&&qi(e[i],t,n)}return e}/**
* @vue/runtime-core v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function nl(e,t,n,i){try{return i?e(...i):e()}catch(r){eu(r,t,n)}}function jn(e,t,n,i){if(kt(e)){const r=nl(e,t,n,i);return r&&Vg(r)&&r.catch(s=>{eu(s,t,n)}),r}if(Ht(e)){const r=[];for(let s=0;s<e.length;s++)r.push(jn(e[s],t,n,i));return r}}function eu(e,t,n,i=!0){const r=t?t.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:a}=t&&t.appContext.config||de;if(t){let o=t.parent;const l=t.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;o;){const f=o.ec;if(f){for(let u=0;u<f.length;u++)if(f[u](e,l,c)===!1)return}o=o.parent}if(s){Zi(),nl(s,null,10,[e,l,c]),Ji();return}}wM(e,n,r,i,a)}function wM(e,t,n,i=!0,r=!1){if(r)throw e;console.error(e)}const $e=[];let ui=-1;const ua=[];let dr=null,ta=0;const f0=Promise.resolve();let Pc=null;function u0(e){const t=Pc||f0;return e?t.then(this?e.bind(this):e):t}function AM(e){let t=ui+1,n=$e.length;for(;t<n;){const i=t+n>>>1,r=$e[i],s=Oo(r);s<e||s===e&&r.flags&2?t=i+1:n=i}return t}function Pp(e){if(!(e.flags&1)){const t=Oo(e),n=$e[$e.length-1];!n||!(e.flags&2)&&t>=Oo(n)?$e.push(e):$e.splice(AM(t),0,e),e.flags|=1,h0()}}function h0(){Pc||(Pc=f0.then(p0))}function CM(e){Ht(e)?ua.push(...e):dr&&e.id===-1?dr.splice(ta+1,0,e):e.flags&1||(ua.push(e),e.flags|=1),h0()}function Bm(e,t,n=ui+1){for(;n<$e.length;n++){const i=$e[n];if(i&&i.flags&2){if(e&&i.id!==e.uid)continue;$e.splice(n,1),n--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function d0(e){if(ua.length){const t=[...new Set(ua)].sort((n,i)=>Oo(n)-Oo(i));if(ua.length=0,dr){dr.push(...t);return}for(dr=t,ta=0;ta<dr.length;ta++){const n=dr[ta];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}dr=null,ta=0}}const Oo=e=>e.id==null?e.flags&2?-1:1/0:e.id;function p0(e){try{for(ui=0;ui<$e.length;ui++){const t=$e[ui];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),nl(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;ui<$e.length;ui++){const t=$e[ui];t&&(t.flags&=-2)}ui=-1,$e.length=0,d0(),Pc=null,($e.length||ua.length)&&p0()}}let De=null,m0=null;function Lc(e){const t=De;return De=e,m0=e&&e.type.__scopeId||null,t}function RM(e,t=De,n){if(!t||e._n)return e;const i=(...r)=>{i._d&&Nc(-1);const s=Lc(t);let a;try{a=e(...r)}finally{Lc(s),i._d&&Nc(1)}return a};return i._n=!0,i._c=!0,i._d=!0,i}function nN(e,t){if(De===null)return e;const n=au(De),i=e.dirs||(e.dirs=[]);for(let r=0;r<t.length;r++){let[s,a,o,l=de]=t[r];s&&(kt(s)&&(s={mounted:s,updated:s}),s.deep&&qi(a),i.push({dir:s,instance:n,value:a,oldValue:void 0,arg:o,modifiers:l}))}return e}function Ir(e,t,n,i){const r=e.dirs,s=t&&t.dirs;for(let a=0;a<r.length;a++){const o=r[a];s&&(o.oldValue=s[a].value);let l=o.dir[i];l&&(Zi(),jn(l,n,8,[e.el,o,e,t]),Ji())}}function PM(e,t){if(He){let n=He.provides;const i=He.parent&&He.parent.provides;i===n&&(n=He.provides=Object.create(i)),n[e]=t}}function uc(e,t,n=!1){const i=J0();if(i||da){let r=da?da._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&e in r)return r[e];if(arguments.length>1)return n&&kt(t)?t.call(i&&i.proxy):t}}const LM=Symbol.for("v-scx"),DM=()=>uc(LM);function Vu(e,t,n){return v0(e,t,n)}function v0(e,t,n=de){const{immediate:i,deep:r,flush:s,once:a}=n,o=we({},n),l=t&&i||!t&&s!=="post";let c;if(Vo){if(s==="sync"){const d=DM();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=_i,d.resume=_i,d.pause=_i,d}}const f=He;o.call=(d,v,_)=>jn(d,f,v,_);let u=!1;s==="post"?o.scheduler=d=>{qe(d,f&&f.suspense)}:s!=="sync"&&(u=!0,o.scheduler=(d,v)=>{v?d():Pp(d)}),o.augmentJob=d=>{t&&(d.flags|=4),u&&(d.flags|=2,f&&(d.id=f.uid,d.i=f))};const h=EM(e,t,o);return Vo&&(c?c.push(h):l&&h()),h}function IM(e,t,n){const i=this.proxy,r=Me(e)?e.includes(".")?_0(i,e):()=>i[e]:e.bind(i,i);let s;kt(t)?s=t:(s=t.handler,n=t);const a=il(this),o=v0(r,s.bind(i),n);return a(),o}function _0(e,t){const n=t.split(".");return()=>{let i=e;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}const g0=Symbol("_vte"),x0=e=>e.__isTeleport,yo=e=>e&&(e.disabled||e.disabled===""),Hm=e=>e&&(e.defer||e.defer===""),zm=e=>typeof SVGElement!="undefined"&&e instanceof SVGElement,Vm=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,vd=(e,t)=>{const n=e&&e.to;return Me(n)?t?t(n):null:n},y0={name:"Teleport",__isTeleport:!0,process(e,t,n,i,r,s,a,o,l,c){const{mc:f,pc:u,pbc:h,o:{insert:d,querySelector:v,createText:_,createComment:m}}=c,p=yo(t.props);let{shapeFlag:g,children:M,dynamicChildren:S}=t;if(e==null){const E=t.el=_(""),T=t.anchor=_("");d(E,n,i),d(T,n,i);const C=(y,b)=>{g&16&&f(M,y,b,r,s,a,o,l)},L=()=>{const y=t.target=vd(t.props,v),b=S0(y,t,_,d);y&&(a!=="svg"&&zm(y)?a="svg":a!=="mathml"&&Vm(y)&&(a="mathml"),r&&r.isCE&&(r.ce._teleportTargets||(r.ce._teleportTargets=new Set)).add(y),p||(C(y,b),hc(t,!1)))};p&&(C(n,T),hc(t,!0)),Hm(t.props)?(t.el.__isMounted=!1,qe(()=>{L(),delete t.el.__isMounted},s)):L()}else{if(Hm(t.props)&&e.el.__isMounted===!1){qe(()=>{y0.process(e,t,n,i,r,s,a,o,l,c)},s);return}t.el=e.el,t.targetStart=e.targetStart;const E=t.anchor=e.anchor,T=t.target=e.target,C=t.targetAnchor=e.targetAnchor,L=yo(e.props),y=L?n:T,b=L?E:C;if(a==="svg"||zm(T)?a="svg":(a==="mathml"||Vm(T))&&(a="mathml"),S?(h(e.dynamicChildren,S,y,r,s,a,o),Ip(e,t,!0)):l||u(e,t,y,b,r,s,a,o,!1),p)L?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):gl(t,n,E,c,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){const R=t.target=vd(t.props,v);R&&gl(t,R,null,c,0)}else L&&gl(t,T,C,c,1);hc(t,p)}},remove(e,t,n,{um:i,o:{remove:r}},s){const{shapeFlag:a,children:o,anchor:l,targetStart:c,targetAnchor:f,target:u,props:h}=e;if(u&&(r(c),r(f)),s&&r(l),a&16){const d=s||!yo(h);for(let v=0;v<o.length;v++){const _=o[v];i(_,t,n,d,!!_.dynamicChildren)}}},move:gl,hydrate:NM};function gl(e,t,n,{o:{insert:i},m:r},s=2){s===0&&i(e.targetAnchor,t,n);const{el:a,anchor:o,shapeFlag:l,children:c,props:f}=e,u=s===2;if(u&&i(a,t,n),(!u||yo(f))&&l&16)for(let h=0;h<c.length;h++)r(c[h],t,n,2);u&&i(o,t,n)}function NM(e,t,n,i,r,s,{o:{nextSibling:a,parentNode:o,querySelector:l,insert:c,createText:f}},u){function h(_,m,p,g){m.anchor=u(a(_),m,o(_),n,i,r,s),m.targetStart=p,m.targetAnchor=g}const d=t.target=vd(t.props,l),v=yo(t.props);if(d){const _=d._lpa||d.firstChild;if(t.shapeFlag&16)if(v)h(e,t,_,_&&a(_));else{t.anchor=a(e);let m=_;for(;m;){if(m&&m.nodeType===8){if(m.data==="teleport start anchor")t.targetStart=m;else if(m.data==="teleport anchor"){t.targetAnchor=m,d._lpa=t.targetAnchor&&a(t.targetAnchor);break}}m=a(m)}t.targetAnchor||S0(d,t,f,c),u(_&&a(_),t,d,n,i,r,s)}hc(t,v)}else v&&t.shapeFlag&16&&h(e,t,e,a(e));return t.anchor&&a(t.anchor)}const iN=y0;function hc(e,t){const n=e.ctx;if(n&&n.ut){let i,r;for(t?(i=e.el,r=e.anchor):(i=e.targetStart,r=e.targetAnchor);i&&i!==r;)i.nodeType===1&&i.setAttribute("data-v-owner",n.uid),i=i.nextSibling;n.ut()}}function S0(e,t,n,i){const r=t.targetStart=n(""),s=t.targetAnchor=n("");return r[g0]=s,e&&(i(r,e),i(s,e)),s}const Wi=Symbol("_leaveCb"),xl=Symbol("_enterCb");function FM(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return R0(()=>{e.isMounted=!0}),P0(()=>{e.isUnmounting=!0}),e}const Sn=[Function,Array],M0={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:Sn,onEnter:Sn,onAfterEnter:Sn,onEnterCancelled:Sn,onBeforeLeave:Sn,onLeave:Sn,onAfterLeave:Sn,onLeaveCancelled:Sn,onBeforeAppear:Sn,onAppear:Sn,onAfterAppear:Sn,onAppearCancelled:Sn},b0=e=>{const t=e.subTree;return t.component?b0(t.component):t},UM={name:"BaseTransition",props:M0,setup(e,{slots:t}){const n=J0(),i=FM();return()=>{const r=t.default&&w0(t.default(),!0);if(!r||!r.length)return;const s=T0(r),a=te(e),{mode:o}=a;if(i.isLeaving)return Gu(s);const l=Gm(s);if(!l)return Gu(s);let c=_d(l,a,i,n,u=>c=u);l.type!==Be&&Bo(l,c);let f=n.subTree&&Gm(n.subTree);if(f&&f.type!==Be&&!cs(f,l)&&b0(n).type!==Be){let u=_d(f,a,i,n);if(Bo(f,u),o==="out-in"&&l.type!==Be)return i.isLeaving=!0,u.afterLeave=()=>{i.isLeaving=!1,n.job.flags&8||n.update(),delete u.afterLeave,f=void 0},Gu(s);o==="in-out"&&l.type!==Be?u.delayLeave=(h,d,v)=>{const _=E0(i,f);_[String(f.key)]=f,h[Wi]=()=>{d(),h[Wi]=void 0,delete c.delayedLeave,f=void 0},c.delayedLeave=()=>{v(),delete c.delayedLeave,f=void 0}}:f=void 0}else f&&(f=void 0);return s}}};function T0(e){let t=e[0];if(e.length>1){for(const n of e)if(n.type!==Be){t=n;break}}return t}const OM=UM;function E0(e,t){const{leavingVNodes:n}=e;let i=n.get(t.type);return i||(i=Object.create(null),n.set(t.type,i)),i}function _d(e,t,n,i,r){const{appear:s,mode:a,persisted:o=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:f,onEnterCancelled:u,onBeforeLeave:h,onLeave:d,onAfterLeave:v,onLeaveCancelled:_,onBeforeAppear:m,onAppear:p,onAfterAppear:g,onAppearCancelled:M}=t,S=String(e.key),E=E0(n,e),T=(y,b)=>{y&&jn(y,i,9,b)},C=(y,b)=>{const R=b[1];T(y,b),Ht(y)?y.every(I=>I.length<=1)&&R():y.length<=1&&R()},L={mode:a,persisted:o,beforeEnter(y){let b=l;if(!n.isMounted)if(s)b=m||l;else return;y[Wi]&&y[Wi](!0);const R=E[S];R&&cs(e,R)&&R.el[Wi]&&R.el[Wi](),T(b,[y])},enter(y){let b=c,R=f,I=u;if(!n.isMounted)if(s)b=p||c,R=g||f,I=M||u;else return;let F=!1;const O=y[xl]=q=>{F||(F=!0,q?T(I,[y]):T(R,[y]),L.delayedLeave&&L.delayedLeave(),y[xl]=void 0)};b?C(b,[y,O]):O()},leave(y,b){const R=String(e.key);if(y[xl]&&y[xl](!0),n.isUnmounting)return b();T(h,[y]);let I=!1;const F=y[Wi]=O=>{I||(I=!0,b(),O?T(_,[y]):T(v,[y]),y[Wi]=void 0,E[R]===e&&delete E[R])};E[R]=e,d?C(d,[y,F]):F()},clone(y){const b=_d(y,t,n,i,r);return r&&r(b),b}};return L}function Gu(e){if(nu(e))return e=wr(e),e.children=null,e}function Gm(e){if(!nu(e))return x0(e.type)&&e.children?T0(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&kt(n.default))return n.default()}}function Bo(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Bo(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function w0(e,t=!1,n){let i=[],r=0;for(let s=0;s<e.length;s++){let a=e[s];const o=n==null?a.key:String(n)+String(a.key!=null?a.key:s);a.type===rn?(a.patchFlag&128&&r++,i=i.concat(w0(a.children,t,o))):(t||a.type!==Be)&&i.push(o!=null?wr(a,{key:o}):a)}if(r>1)for(let s=0;s<i.length;s++)i[s].patchFlag=-2;return i}function rN(e,t){return kt(e)?we({name:e.name},t,{setup:e}):e}function A0(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const Dc=new WeakMap;function So(e,t,n,i,r=!1){if(Ht(e)){e.forEach((v,_)=>So(v,t&&(Ht(t)?t[_]:t),n,i,r));return}if(ha(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&So(e,t,n,i.component.subTree);return}const s=i.shapeFlag&4?au(i.component):i.el,a=r?null:s,{i:o,r:l}=e,c=t&&t.r,f=o.refs===de?o.refs={}:o.refs,u=o.setupState,h=te(u),d=u===de?zg:v=>ie(h,v);if(c!=null&&c!==l){if(km(t),Me(c))f[c]=null,d(c)&&(u[c]=null);else if(ze(c)){c.value=null;const v=t;v.k&&(f[v.k]=null)}}if(kt(l))nl(l,o,12,[a,f]);else{const v=Me(l),_=ze(l);if(v||_){const m=()=>{if(e.f){const p=v?d(l)?u[l]:f[l]:l.value;if(r)Ht(p)&&_p(p,s);else if(Ht(p))p.includes(s)||p.push(s);else if(v)f[l]=[s],d(l)&&(u[l]=f[l]);else{const g=[s];l.value=g,e.k&&(f[e.k]=g)}}else v?(f[l]=a,d(l)&&(u[l]=a)):_&&(l.value=a,e.k&&(f[e.k]=a))};if(a){const p=()=>{m(),Dc.delete(e)};p.id=-1,Dc.set(e,p),qe(p,n)}else km(e),m()}}}function km(e){const t=Dc.get(e);t&&(t.flags|=8,Dc.delete(e))}Qf().requestIdleCallback;Qf().cancelIdleCallback;const ha=e=>!!e.type.__asyncLoader,nu=e=>e.type.__isKeepAlive;function BM(e,t){C0(e,"a",t)}function HM(e,t){C0(e,"da",t)}function C0(e,t,n=He){const i=e.__wdc||(e.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return e()});if(iu(t,i,n),n){let r=n.parent;for(;r&&r.parent;)nu(r.parent.vnode)&&zM(i,t,n,r),r=r.parent}}function zM(e,t,n,i){const r=iu(t,e,i,!0);L0(()=>{_p(i[t],r)},n)}function iu(e,t,n=He,i=!1){if(n){const r=n[e]||(n[e]=[]),s=t.__weh||(t.__weh=(...a)=>{Zi();const o=il(n),l=jn(t,n,e,a);return o(),Ji(),l});return i?r.unshift(s):r.push(s),s}}const er=e=>(t,n=He)=>{(!Vo||e==="sp")&&iu(e,(...i)=>t(...i),n)},VM=er("bm"),R0=er("m"),GM=er("bu"),kM=er("u"),P0=er("bum"),L0=er("um"),WM=er("sp"),XM=er("rtg"),qM=er("rtc");function YM(e,t=He){iu("ec",e,t)}const $M="components";function sN(e,t){return ZM($M,e,!0,t)||e}const KM=Symbol.for("v-ndc");function ZM(e,t,n=!0,i=!1){const r=De||He;if(r){const s=r.type;{const o=F1(s,!1);if(o&&(o===t||o===Nn(t)||o===Jf(Nn(t))))return s}const a=Wm(r[e]||s[e],t)||Wm(r.appContext[e],t);return!a&&i?s:a}}function Wm(e,t){return e&&(e[t]||e[Nn(t)]||e[Jf(Nn(t))])}function aN(e,t,n,i){let r;const s=n,a=Ht(e);if(a||Me(e)){const o=a&&vs(e);let l=!1,c=!1;o&&(l=!Dn(e),c=ji(e),e=tu(e)),r=new Array(e.length);for(let f=0,u=e.length;f<u;f++)r[f]=t(l?c?xa(Jn(e[f])):Jn(e[f]):e[f],f,void 0,s)}else if(typeof e=="number"){r=new Array(e);for(let o=0;o<e;o++)r[o]=t(o+1,o,void 0,s)}else if(fe(e))if(e[Symbol.iterator])r=Array.from(e,(o,l)=>t(o,l,void 0,s));else{const o=Object.keys(e);r=new Array(o.length);for(let l=0,c=o.length;l<c;l++){const f=o[l];r[l]=t(e[f],f,l,s)}}else r=[];return r}function oN(e,t,n={},i,r){if(De.ce||De.parent&&ha(De.parent)&&De.parent.ce){const c=Object.keys(n).length>0;return Md(),bd(rn,null,[Ze("slot",n,i)],c?-2:64)}let s=e[t];s&&s._c&&(s._d=!1),Md();const a=s&&D0(s(n)),o=n.key||a&&a.key,l=bd(rn,{key:(o&&!Zn(o)?o:`_${t}`)+(!a&&i?"_fb":"")},a||[],a&&e._===1?64:-2);return s&&s._c&&(s._d=!0),l}function D0(e){return e.some(t=>zo(t)?!(t.type===Be||t.type===rn&&!D0(t.children)):!0)?e:null}const gd=e=>e?j0(e)?au(e):gd(e.parent):null,Mo=we(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>gd(e.parent),$root:e=>gd(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>N0(e),$forceUpdate:e=>e.f||(e.f=()=>{Pp(e.update)}),$nextTick:e=>e.n||(e.n=u0.bind(e.proxy)),$watch:e=>IM.bind(e)}),ku=(e,t)=>e!==de&&!e.__isScriptSetup&&ie(e,t),JM={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:n,setupState:i,data:r,props:s,accessCache:a,type:o,appContext:l}=e;if(t[0]!=="$"){const h=a[t];if(h!==void 0)switch(h){case 1:return i[t];case 2:return r[t];case 4:return n[t];case 3:return s[t]}else{if(ku(i,t))return a[t]=1,i[t];if(r!==de&&ie(r,t))return a[t]=2,r[t];if(ie(s,t))return a[t]=3,s[t];if(n!==de&&ie(n,t))return a[t]=4,n[t];xd&&(a[t]=0)}}const c=Mo[t];let f,u;if(c)return t==="$attrs"&&Oe(e.attrs,"get",""),c(e);if((f=o.__cssModules)&&(f=f[t]))return f;if(n!==de&&ie(n,t))return a[t]=4,n[t];if(u=l.config.globalProperties,ie(u,t))return u[t]},set({_:e},t,n){const{data:i,setupState:r,ctx:s}=e;return ku(r,t)?(r[t]=n,!0):i!==de&&ie(i,t)?(i[t]=n,!0):ie(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(s[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:i,appContext:r,props:s,type:a}},o){let l;return!!(n[o]||e!==de&&o[0]!=="$"&&ie(e,o)||ku(t,o)||ie(s,o)||ie(i,o)||ie(Mo,o)||ie(r.config.globalProperties,o)||(l=a.__cssModules)&&l[o])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:ie(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Xm(e){return Ht(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let xd=!0;function jM(e){const t=N0(e),n=e.proxy,i=e.ctx;xd=!1,t.beforeCreate&&qm(t.beforeCreate,e,"bc");const{data:r,computed:s,methods:a,watch:o,provide:l,inject:c,created:f,beforeMount:u,mounted:h,beforeUpdate:d,updated:v,activated:_,deactivated:m,beforeDestroy:p,beforeUnmount:g,destroyed:M,unmounted:S,render:E,renderTracked:T,renderTriggered:C,errorCaptured:L,serverPrefetch:y,expose:b,inheritAttrs:R,components:I,directives:F,filters:O}=t;if(c&&QM(c,i,null),a)for(const z in a){const K=a[z];kt(K)&&(i[z]=K.bind(n))}if(r){const z=r.call(n,n);fe(z)&&(e.data=Ap(z))}if(xd=!0,s)for(const z in s){const K=s[z],dt=kt(K)?K.bind(n,n):kt(K.get)?K.get.bind(n,n):_i,ct=!kt(K)&&kt(K.set)?K.set.bind(n):_i,ht=O1({get:dt,set:ct});Object.defineProperty(i,z,{enumerable:!0,configurable:!0,get:()=>ht.value,set:Rt=>ht.value=Rt})}if(o)for(const z in o)I0(o[z],i,n,z);if(l){const z=kt(l)?l.call(n):l;Reflect.ownKeys(z).forEach(K=>{PM(K,z[K])})}f&&qm(f,e,"c");function V(z,K){Ht(K)?K.forEach(dt=>z(dt.bind(n))):K&&z(K.bind(n))}if(V(VM,u),V(R0,h),V(GM,d),V(kM,v),V(BM,_),V(HM,m),V(YM,L),V(qM,T),V(XM,C),V(P0,g),V(L0,S),V(WM,y),Ht(b))if(b.length){const z=e.exposed||(e.exposed={});b.forEach(K=>{Object.defineProperty(z,K,{get:()=>n[K],set:dt=>n[K]=dt,enumerable:!0})})}else e.exposed||(e.exposed={});E&&e.render===_i&&(e.render=E),R!=null&&(e.inheritAttrs=R),I&&(e.components=I),F&&(e.directives=F),y&&A0(e)}function QM(e,t,n=_i){Ht(e)&&(e=yd(e));for(const i in e){const r=e[i];let s;fe(r)?"default"in r?s=uc(r.from||i,r.default,!0):s=uc(r.from||i):s=uc(r),ze(s)?Object.defineProperty(t,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:a=>s.value=a}):t[i]=s}}function qm(e,t,n){jn(Ht(e)?e.map(i=>i.bind(t.proxy)):e.bind(t.proxy),t,n)}function I0(e,t,n,i){let r=i.includes(".")?_0(n,i):()=>n[i];if(Me(e)){const s=t[e];kt(s)&&Vu(r,s)}else if(kt(e))Vu(r,e.bind(n));else if(fe(e))if(Ht(e))e.forEach(s=>I0(s,t,n,i));else{const s=kt(e.handler)?e.handler.bind(n):t[e.handler];kt(s)&&Vu(r,s,e)}}function N0(e){const t=e.type,{mixins:n,extends:i}=t,{mixins:r,optionsCache:s,config:{optionMergeStrategies:a}}=e.appContext,o=s.get(t);let l;return o?l=o:!r.length&&!n&&!i?l=t:(l={},r.length&&r.forEach(c=>Ic(l,c,a,!0)),Ic(l,t,a)),fe(t)&&s.set(t,l),l}function Ic(e,t,n,i=!1){const{mixins:r,extends:s}=t;s&&Ic(e,s,n,!0),r&&r.forEach(a=>Ic(e,a,n,!0));for(const a in t)if(!(i&&a==="expose")){const o=t1[a]||n&&n[a];e[a]=o?o(e[a],t[a]):t[a]}return e}const t1={data:Ym,props:$m,emits:$m,methods:io,computed:io,beforeCreate:We,created:We,beforeMount:We,mounted:We,beforeUpdate:We,updated:We,beforeDestroy:We,beforeUnmount:We,destroyed:We,unmounted:We,activated:We,deactivated:We,errorCaptured:We,serverPrefetch:We,components:io,directives:io,watch:n1,provide:Ym,inject:e1};function Ym(e,t){return t?e?function(){return we(kt(e)?e.call(this,this):e,kt(t)?t.call(this,this):t)}:t:e}function e1(e,t){return io(yd(e),yd(t))}function yd(e){if(Ht(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function We(e,t){return e?[...new Set([].concat(e,t))]:t}function io(e,t){return e?we(Object.create(null),e,t):t}function $m(e,t){return e?Ht(e)&&Ht(t)?[...new Set([...e,...t])]:we(Object.create(null),Xm(e),Xm(t!=null?t:{})):t}function n1(e,t){if(!e)return t;if(!t)return e;const n=we(Object.create(null),e);for(const i in t)n[i]=We(e[i],t[i]);return n}function F0(){return{app:null,config:{isNativeTag:zg,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let i1=0;function r1(e,t){return function(i,r=null){kt(i)||(i=we({},i)),r!=null&&!fe(r)&&(r=null);const s=F0(),a=new WeakSet,o=[];let l=!1;const c=s.app={_uid:i1++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:H1,get config(){return s.config},set config(f){},use(f,...u){return a.has(f)||(f&&kt(f.install)?(a.add(f),f.install(c,...u)):kt(f)&&(a.add(f),f(c,...u))),c},mixin(f){return s.mixins.includes(f)||s.mixins.push(f),c},component(f,u){return u?(s.components[f]=u,c):s.components[f]},directive(f,u){return u?(s.directives[f]=u,c):s.directives[f]},mount(f,u,h){if(!l){const d=c._ceVNode||Ze(i,r);return d.appContext=s,h===!0?h="svg":h===!1&&(h=void 0),e(d,f,h),l=!0,c._container=f,f.__vue_app__=c,au(d.component)}},onUnmount(f){o.push(f)},unmount(){l&&(jn(o,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(f,u){return s.provides[f]=u,c},runWithContext(f){const u=da;da=c;try{return f()}finally{da=u}}};return c}}let da=null;const s1=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Nn(t)}Modifiers`]||e[`${Pr(t)}Modifiers`];function a1(e,t,...n){if(e.isUnmounted)return;const i=e.vnode.props||de;let r=n;const s=t.startsWith("update:"),a=s&&s1(i,t.slice(7));a&&(a.trim&&(r=n.map(f=>Me(f)?f.trim():f)),a.number&&(r=n.map(jf)));let o,l=i[o=Uu(t)]||i[o=Uu(Nn(t))];!l&&s&&(l=i[o=Uu(Pr(t))]),l&&jn(l,e,6,r);const c=i[o+"Once"];if(c){if(!e.emitted)e.emitted={};else if(e.emitted[o])return;e.emitted[o]=!0,jn(c,e,6,r)}}const o1=new WeakMap;function U0(e,t,n=!1){const i=n?o1:t.emitsCache,r=i.get(e);if(r!==void 0)return r;const s=e.emits;let a={},o=!1;if(!kt(e)){const l=c=>{const f=U0(c,t,!0);f&&(o=!0,we(a,f))};!n&&t.mixins.length&&t.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!o?(fe(e)&&i.set(e,null),null):(Ht(s)?s.forEach(l=>a[l]=null):we(a,s),fe(e)&&i.set(e,a),a)}function ru(e,t){return!e||!Kf(t)?!1:(t=t.slice(2).replace(/Once$/,""),ie(e,t[0].toLowerCase()+t.slice(1))||ie(e,Pr(t))||ie(e,t))}function Km(e){const{type:t,vnode:n,proxy:i,withProxy:r,propsOptions:[s],slots:a,attrs:o,emit:l,render:c,renderCache:f,props:u,data:h,setupState:d,ctx:v,inheritAttrs:_}=e,m=Lc(e);let p,g;try{if(n.shapeFlag&4){const S=r||i,E=S;p=hi(c.call(E,S,f,u,d,h,v)),g=o}else{const S=t;p=hi(S.length>1?S(u,{attrs:o,slots:a,emit:l}):S(u,null)),g=t.props?o:l1(o)}}catch(S){bo.length=0,eu(S,e,1),p=Ze(Be)}let M=p;if(g&&_!==!1){const S=Object.keys(g),{shapeFlag:E}=M;S.length&&E&7&&(s&&S.some(vp)&&(g=c1(g,s)),M=wr(M,g,!1,!0))}return n.dirs&&(M=wr(M,null,!1,!0),M.dirs=M.dirs?M.dirs.concat(n.dirs):n.dirs),n.transition&&Bo(M,n.transition),p=M,Lc(m),p}const l1=e=>{let t;for(const n in e)(n==="class"||n==="style"||Kf(n))&&((t||(t={}))[n]=e[n]);return t},c1=(e,t)=>{const n={};for(const i in e)(!vp(i)||!(i.slice(9)in t))&&(n[i]=e[i]);return n};function f1(e,t,n){const{props:i,children:r,component:s}=e,{props:a,children:o,patchFlag:l}=t,c=s.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?Zm(i,a,c):!!a;if(l&8){const f=t.dynamicProps;for(let u=0;u<f.length;u++){const h=f[u];if(a[h]!==i[h]&&!ru(c,h))return!0}}}else return(r||o)&&(!o||!o.$stable)?!0:i===a?!1:i?a?Zm(i,a,c):!0:!!a;return!1}function Zm(e,t,n){const i=Object.keys(t);if(i.length!==Object.keys(e).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(t[s]!==e[s]&&!ru(n,s))return!0}return!1}function u1({vnode:e,parent:t},n){for(;t;){const i=t.subTree;if(i.suspense&&i.suspense.activeBranch===e&&(i.el=e.el),i===e)(e=t.vnode).el=n,t=t.parent;else break}}const O0={},B0=()=>Object.create(O0),H0=e=>Object.getPrototypeOf(e)===O0;function h1(e,t,n,i=!1){const r={},s=B0();e.propsDefaults=Object.create(null),z0(e,t,r,s);for(const a in e.propsOptions[0])a in r||(r[a]=void 0);n?e.props=i?r:_M(r):e.type.props?e.props=r:e.props=s,e.attrs=s}function d1(e,t,n,i){const{props:r,attrs:s,vnode:{patchFlag:a}}=e,o=te(r),[l]=e.propsOptions;let c=!1;if((i||a>0)&&!(a&16)){if(a&8){const f=e.vnode.dynamicProps;for(let u=0;u<f.length;u++){let h=f[u];if(ru(e.emitsOptions,h))continue;const d=t[h];if(l)if(ie(s,h))d!==s[h]&&(s[h]=d,c=!0);else{const v=Nn(h);r[v]=Sd(l,o,v,d,e,!1)}else d!==s[h]&&(s[h]=d,c=!0)}}}else{z0(e,t,r,s)&&(c=!0);let f;for(const u in o)(!t||!ie(t,u)&&((f=Pr(u))===u||!ie(t,f)))&&(l?n&&(n[u]!==void 0||n[f]!==void 0)&&(r[u]=Sd(l,o,u,void 0,e,!0)):delete r[u]);if(s!==o)for(const u in s)(!t||!ie(t,u))&&(delete s[u],c=!0)}c&&Xi(e.attrs,"set","")}function z0(e,t,n,i){const[r,s]=e.propsOptions;let a=!1,o;if(t)for(let l in t){if(_o(l))continue;const c=t[l];let f;r&&ie(r,f=Nn(l))?!s||!s.includes(f)?n[f]=c:(o||(o={}))[f]=c:ru(e.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,a=!0)}if(s){const l=te(n),c=o||de;for(let f=0;f<s.length;f++){const u=s[f];n[u]=Sd(r,l,u,c[u],e,!ie(c,u))}}return a}function Sd(e,t,n,i,r,s){const a=e[n];if(a!=null){const o=ie(a,"default");if(o&&i===void 0){const l=a.default;if(a.type!==Function&&!a.skipFactory&&kt(l)){const{propsDefaults:c}=r;if(n in c)i=c[n];else{const f=il(r);i=c[n]=l.call(null,t),f()}}else i=l;r.ce&&r.ce._setProp(n,i)}a[0]&&(s&&!o?i=!1:a[1]&&(i===""||i===Pr(n))&&(i=!0))}return i}const p1=new WeakMap;function V0(e,t,n=!1){const i=n?p1:t.propsCache,r=i.get(e);if(r)return r;const s=e.props,a={},o=[];let l=!1;if(!kt(e)){const f=u=>{l=!0;const[h,d]=V0(u,t,!0);we(a,h),d&&o.push(...d)};!n&&t.mixins.length&&t.mixins.forEach(f),e.extends&&f(e.extends),e.mixins&&e.mixins.forEach(f)}if(!s&&!l)return fe(e)&&i.set(e,ca),ca;if(Ht(s))for(let f=0;f<s.length;f++){const u=Nn(s[f]);Jm(u)&&(a[u]=de)}else if(s)for(const f in s){const u=Nn(f);if(Jm(u)){const h=s[f],d=a[u]=Ht(h)||kt(h)?{type:h}:we({},h),v=d.type;let _=!1,m=!0;if(Ht(v))for(let p=0;p<v.length;++p){const g=v[p],M=kt(g)&&g.name;if(M==="Boolean"){_=!0;break}else M==="String"&&(m=!1)}else _=kt(v)&&v.name==="Boolean";d[0]=_,d[1]=m,(_||ie(d,"default"))&&o.push(u)}}const c=[a,o];return fe(e)&&i.set(e,c),c}function Jm(e){return e[0]!=="$"&&!_o(e)}const Lp=e=>e==="_"||e==="_ctx"||e==="$stable",Dp=e=>Ht(e)?e.map(hi):[hi(e)],m1=(e,t,n)=>{if(t._n)return t;const i=RM((...r)=>Dp(t(...r)),n);return i._c=!1,i},G0=(e,t,n)=>{const i=e._ctx;for(const r in e){if(Lp(r))continue;const s=e[r];if(kt(s))t[r]=m1(r,s,i);else if(s!=null){const a=Dp(s);t[r]=()=>a}}},k0=(e,t)=>{const n=Dp(t);e.slots.default=()=>n},W0=(e,t,n)=>{for(const i in t)(n||!Lp(i))&&(e[i]=t[i])},v1=(e,t,n)=>{const i=e.slots=B0();if(e.vnode.shapeFlag&32){const r=t._;r?(W0(i,t,n),n&&Wg(i,"_",r,!0)):G0(t,i)}else t&&k0(e,t)},_1=(e,t,n)=>{const{vnode:i,slots:r}=e;let s=!0,a=de;if(i.shapeFlag&32){const o=t._;o?n&&o===1?s=!1:W0(r,t,n):(s=!t.$stable,G0(t,r)),a=t}else t&&(k0(e,t),a={default:1});if(s)for(const o in r)!Lp(o)&&a[o]==null&&delete r[o]},qe=M1;function g1(e){return x1(e)}function x1(e,t){const n=Qf();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:a,createText:o,createComment:l,setText:c,setElementText:f,parentNode:u,nextSibling:h,setScopeId:d=_i,insertStaticContent:v}=e,_=(D,U,G,et=null,J=null,nt=null,P=void 0,ot=null,rt=!!U.dynamicChildren)=>{if(D===U)return;D&&!cs(D,U)&&(et=it(D),Rt(D,J,nt,!0),D=null),U.patchFlag===-2&&(rt=!1,U.dynamicChildren=null);const{type:tt,ref:st,shapeFlag:w}=U;switch(tt){case su:m(D,U,G,et);break;case Be:p(D,U,G,et);break;case dc:D==null&&g(U,G,et,P);break;case rn:I(D,U,G,et,J,nt,P,ot,rt);break;default:w&1?E(D,U,G,et,J,nt,P,ot,rt):w&6?F(D,U,G,et,J,nt,P,ot,rt):(w&64||w&128)&&tt.process(D,U,G,et,J,nt,P,ot,rt,mt)}st!=null&&J?So(st,D&&D.ref,nt,U||D,!U):st==null&&D&&D.ref!=null&&So(D.ref,null,nt,D,!0)},m=(D,U,G,et)=>{if(D==null)i(U.el=o(U.children),G,et);else{const J=U.el=D.el;U.children!==D.children&&c(J,U.children)}},p=(D,U,G,et)=>{D==null?i(U.el=l(U.children||""),G,et):U.el=D.el},g=(D,U,G,et)=>{[D.el,D.anchor]=v(D.children,U,G,et,D.el,D.anchor)},M=({el:D,anchor:U},G,et)=>{let J;for(;D&&D!==U;)J=h(D),i(D,G,et),D=J;i(U,G,et)},S=({el:D,anchor:U})=>{let G;for(;D&&D!==U;)G=h(D),r(D),D=G;r(U)},E=(D,U,G,et,J,nt,P,ot,rt)=>{if(U.type==="svg"?P="svg":U.type==="math"&&(P="mathml"),D==null)T(U,G,et,J,nt,P,ot,rt);else{const tt=D.el&&D.el._isVueCE?D.el:null;try{tt&&tt._beginPatch(),y(D,U,J,nt,P,ot,rt)}finally{tt&&tt._endPatch()}}},T=(D,U,G,et,J,nt,P,ot)=>{let rt,tt;const{props:st,shapeFlag:w,transition:x,dirs:N}=D;if(rt=D.el=a(D.type,nt,st&&st.is,st),w&8?f(rt,D.children):w&16&&L(D.children,rt,null,et,J,Wu(D,nt),P,ot),N&&Ir(D,null,et,"created"),C(rt,D,D.scopeId,P,et),st){for(const j in st)j!=="value"&&!_o(j)&&s(rt,j,null,st[j],nt,et);"value"in st&&s(rt,"value",null,st.value,nt),(tt=st.onVnodeBeforeMount)&&ri(tt,et,D)}N&&Ir(D,null,et,"beforeMount");const X=y1(J,x);X&&x.beforeEnter(rt),i(rt,U,G),((tt=st&&st.onVnodeMounted)||X||N)&&qe(()=>{tt&&ri(tt,et,D),X&&x.enter(rt),N&&Ir(D,null,et,"mounted")},J)},C=(D,U,G,et,J)=>{if(G&&d(D,G),et)for(let nt=0;nt<et.length;nt++)d(D,et[nt]);if(J){let nt=J.subTree;if(U===nt||Y0(nt.type)&&(nt.ssContent===U||nt.ssFallback===U)){const P=J.vnode;C(D,P,P.scopeId,P.slotScopeIds,J.parent)}}},L=(D,U,G,et,J,nt,P,ot,rt=0)=>{for(let tt=rt;tt<D.length;tt++){const st=D[tt]=ot?pr(D[tt]):hi(D[tt]);_(null,st,U,G,et,J,nt,P,ot)}},y=(D,U,G,et,J,nt,P)=>{const ot=U.el=D.el;let{patchFlag:rt,dynamicChildren:tt,dirs:st}=U;rt|=D.patchFlag&16;const w=D.props||de,x=U.props||de;let N;if(G&&Nr(G,!1),(N=x.onVnodeBeforeUpdate)&&ri(N,G,U,D),st&&Ir(U,D,G,"beforeUpdate"),G&&Nr(G,!0),(w.innerHTML&&x.innerHTML==null||w.textContent&&x.textContent==null)&&f(ot,""),tt?b(D.dynamicChildren,tt,ot,G,et,Wu(U,J),nt):P||K(D,U,ot,null,G,et,Wu(U,J),nt,!1),rt>0){if(rt&16)R(ot,w,x,G,J);else if(rt&2&&w.class!==x.class&&s(ot,"class",null,x.class,J),rt&4&&s(ot,"style",w.style,x.style,J),rt&8){const X=U.dynamicProps;for(let j=0;j<X.length;j++){const W=X[j],Tt=w[W],ft=x[W];(ft!==Tt||W==="value")&&s(ot,W,Tt,ft,J,G)}}rt&1&&D.children!==U.children&&f(ot,U.children)}else!P&&tt==null&&R(ot,w,x,G,J);((N=x.onVnodeUpdated)||st)&&qe(()=>{N&&ri(N,G,U,D),st&&Ir(U,D,G,"updated")},et)},b=(D,U,G,et,J,nt,P)=>{for(let ot=0;ot<U.length;ot++){const rt=D[ot],tt=U[ot],st=rt.el&&(rt.type===rn||!cs(rt,tt)||rt.shapeFlag&198)?u(rt.el):G;_(rt,tt,st,null,et,J,nt,P,!0)}},R=(D,U,G,et,J)=>{if(U!==G){if(U!==de)for(const nt in U)!_o(nt)&&!(nt in G)&&s(D,nt,U[nt],null,J,et);for(const nt in G){if(_o(nt))continue;const P=G[nt],ot=U[nt];P!==ot&&nt!=="value"&&s(D,nt,ot,P,J,et)}"value"in G&&s(D,"value",U.value,G.value,J)}},I=(D,U,G,et,J,nt,P,ot,rt)=>{const tt=U.el=D?D.el:o(""),st=U.anchor=D?D.anchor:o("");let{patchFlag:w,dynamicChildren:x,slotScopeIds:N}=U;N&&(ot=ot?ot.concat(N):N),D==null?(i(tt,G,et),i(st,G,et),L(U.children||[],G,st,J,nt,P,ot,rt)):w>0&&w&64&&x&&D.dynamicChildren&&D.dynamicChildren.length===x.length?(b(D.dynamicChildren,x,G,J,nt,P,ot),(U.key!=null||J&&U===J.subTree)&&Ip(D,U,!0)):K(D,U,G,st,J,nt,P,ot,rt)},F=(D,U,G,et,J,nt,P,ot,rt)=>{U.slotScopeIds=ot,D==null?U.shapeFlag&512?J.ctx.activate(U,G,et,P,rt):O(U,G,et,J,nt,P,rt):q(D,U,rt)},O=(D,U,G,et,J,nt,P)=>{const ot=D.component=P1(D,et,J);if(nu(D)&&(ot.ctx.renderer=mt),L1(ot,!1,P),ot.asyncDep){if(J&&J.registerDep(ot,V,P),!D.el){const rt=ot.subTree=Ze(Be);p(null,rt,U,G),D.placeholder=rt.el}}else V(ot,D,U,G,J,nt,P)},q=(D,U,G)=>{const et=U.component=D.component;if(f1(D,U,G))if(et.asyncDep&&!et.asyncResolved){z(et,U,G);return}else et.next=U,et.update();else U.el=D.el,et.vnode=U},V=(D,U,G,et,J,nt,P)=>{const ot=()=>{if(D.isMounted){let{next:w,bu:x,u:N,parent:X,vnode:j}=D;{const Nt=X0(D);if(Nt){w&&(w.el=j.el,z(D,w,P)),Nt.asyncDep.then(()=>{D.isUnmounted||ot()});return}}let W=w,Tt;Nr(D,!1),w?(w.el=j.el,z(D,w,P)):w=j,x&&fc(x),(Tt=w.props&&w.props.onVnodeBeforeUpdate)&&ri(Tt,X,w,j),Nr(D,!0);const ft=Km(D),At=D.subTree;D.subTree=ft,_(At,ft,u(At.el),it(At),D,J,nt),w.el=ft.el,W===null&&u1(D,ft.el),N&&qe(N,J),(Tt=w.props&&w.props.onVnodeUpdated)&&qe(()=>ri(Tt,X,w,j),J)}else{let w;const{el:x,props:N}=U,{bm:X,m:j,parent:W,root:Tt,type:ft}=D,At=ha(U);Nr(D,!1),X&&fc(X),!At&&(w=N&&N.onVnodeBeforeMount)&&ri(w,W,U),Nr(D,!0);{Tt.ce&&Tt.ce._def.shadowRoot!==!1&&Tt.ce._injectChildStyle(ft);const Nt=D.subTree=Km(D);_(null,Nt,G,et,D,J,nt),U.el=Nt.el}if(j&&qe(j,J),!At&&(w=N&&N.onVnodeMounted)){const Nt=U;qe(()=>ri(w,W,Nt),J)}(U.shapeFlag&256||W&&ha(W.vnode)&&W.vnode.shapeFlag&256)&&D.a&&qe(D.a,J),D.isMounted=!0,U=G=et=null}};D.scope.on();const rt=D.effect=new $g(ot);D.scope.off();const tt=D.update=rt.run.bind(rt),st=D.job=rt.runIfDirty.bind(rt);st.i=D,st.id=D.uid,rt.scheduler=()=>Pp(st),Nr(D,!0),tt()},z=(D,U,G)=>{U.component=D;const et=D.vnode.props;D.vnode=U,D.next=null,d1(D,U.props,et,G),_1(D,U.children,G),Zi(),Bm(D),Ji()},K=(D,U,G,et,J,nt,P,ot,rt=!1)=>{const tt=D&&D.children,st=D?D.shapeFlag:0,w=U.children,{patchFlag:x,shapeFlag:N}=U;if(x>0){if(x&128){ct(tt,w,G,et,J,nt,P,ot,rt);return}else if(x&256){dt(tt,w,G,et,J,nt,P,ot,rt);return}}N&8?(st&16&&Q(tt,J,nt),w!==tt&&f(G,w)):st&16?N&16?ct(tt,w,G,et,J,nt,P,ot,rt):Q(tt,J,nt,!0):(st&8&&f(G,""),N&16&&L(w,G,et,J,nt,P,ot,rt))},dt=(D,U,G,et,J,nt,P,ot,rt)=>{D=D||ca,U=U||ca;const tt=D.length,st=U.length,w=Math.min(tt,st);let x;for(x=0;x<w;x++){const N=U[x]=rt?pr(U[x]):hi(U[x]);_(D[x],N,G,null,J,nt,P,ot,rt)}tt>st?Q(D,J,nt,!0,!1,w):L(U,G,et,J,nt,P,ot,rt,w)},ct=(D,U,G,et,J,nt,P,ot,rt)=>{let tt=0;const st=U.length;let w=D.length-1,x=st-1;for(;tt<=w&&tt<=x;){const N=D[tt],X=U[tt]=rt?pr(U[tt]):hi(U[tt]);if(cs(N,X))_(N,X,G,null,J,nt,P,ot,rt);else break;tt++}for(;tt<=w&&tt<=x;){const N=D[w],X=U[x]=rt?pr(U[x]):hi(U[x]);if(cs(N,X))_(N,X,G,null,J,nt,P,ot,rt);else break;w--,x--}if(tt>w){if(tt<=x){const N=x+1,X=N<st?U[N].el:et;for(;tt<=x;)_(null,U[tt]=rt?pr(U[tt]):hi(U[tt]),G,X,J,nt,P,ot,rt),tt++}}else if(tt>x)for(;tt<=w;)Rt(D[tt],J,nt,!0),tt++;else{const N=tt,X=tt,j=new Map;for(tt=X;tt<=x;tt++){const xt=U[tt]=rt?pr(U[tt]):hi(U[tt]);xt.key!=null&&j.set(xt.key,tt)}let W,Tt=0;const ft=x-X+1;let At=!1,Nt=0;const lt=new Array(ft);for(tt=0;tt<ft;tt++)lt[tt]=0;for(tt=N;tt<=w;tt++){const xt=D[tt];if(Tt>=ft){Rt(xt,J,nt,!0);continue}let Ct;if(xt.key!=null)Ct=j.get(xt.key);else for(W=X;W<=x;W++)if(lt[W-X]===0&&cs(xt,U[W])){Ct=W;break}Ct===void 0?Rt(xt,J,nt,!0):(lt[Ct-X]=tt+1,Ct>=Nt?Nt=Ct:At=!0,_(xt,U[Ct],G,null,J,nt,P,ot,rt),Tt++)}const _t=At?S1(lt):ca;for(W=_t.length-1,tt=ft-1;tt>=0;tt--){const xt=X+tt,Ct=U[xt],vt=U[xt+1],Wt=xt+1<st?vt.el||q0(vt):et;lt[tt]===0?_(null,Ct,G,Wt,J,nt,P,ot,rt):At&&(W<0||tt!==_t[W]?ht(Ct,G,Wt,2):W--)}}},ht=(D,U,G,et,J=null)=>{const{el:nt,type:P,transition:ot,children:rt,shapeFlag:tt}=D;if(tt&6){ht(D.component.subTree,U,G,et);return}if(tt&128){D.suspense.move(U,G,et);return}if(tt&64){P.move(D,U,G,mt);return}if(P===rn){i(nt,U,G);for(let w=0;w<rt.length;w++)ht(rt[w],U,G,et);i(D.anchor,U,G);return}if(P===dc){M(D,U,G);return}if(et!==2&&tt&1&&ot)if(et===0)ot.beforeEnter(nt),i(nt,U,G),qe(()=>ot.enter(nt),J);else{const{leave:w,delayLeave:x,afterLeave:N}=ot,X=()=>{D.ctx.isUnmounted?r(nt):i(nt,U,G)},j=()=>{nt._isLeaving&&nt[Wi](!0),w(nt,()=>{X(),N&&N()})};x?x(nt,X,j):j()}else i(nt,U,G)},Rt=(D,U,G,et=!1,J=!1)=>{const{type:nt,props:P,ref:ot,children:rt,dynamicChildren:tt,shapeFlag:st,patchFlag:w,dirs:x,cacheIndex:N}=D;if(w===-2&&(J=!1),ot!=null&&(Zi(),So(ot,null,G,D,!0),Ji()),N!=null&&(U.renderCache[N]=void 0),st&256){U.ctx.deactivate(D);return}const X=st&1&&x,j=!ha(D);let W;if(j&&(W=P&&P.onVnodeBeforeUnmount)&&ri(W,U,D),st&6)Kt(D.component,G,et);else{if(st&128){D.suspense.unmount(G,et);return}X&&Ir(D,null,U,"beforeUnmount"),st&64?D.type.remove(D,U,G,mt,et):tt&&!tt.hasOnce&&(nt!==rn||w>0&&w&64)?Q(tt,U,G,!1,!0):(nt===rn&&w&384||!J&&st&16)&&Q(rt,U,G),et&&It(D)}(j&&(W=P&&P.onVnodeUnmounted)||X)&&qe(()=>{W&&ri(W,U,D),X&&Ir(D,null,U,"unmounted")},G)},It=D=>{const{type:U,el:G,anchor:et,transition:J}=D;if(U===rn){qt(G,et);return}if(U===dc){S(D);return}const nt=()=>{r(G),J&&!J.persisted&&J.afterLeave&&J.afterLeave()};if(D.shapeFlag&1&&J&&!J.persisted){const{leave:P,delayLeave:ot}=J,rt=()=>P(G,nt);ot?ot(D.el,nt,rt):rt()}else nt()},qt=(D,U)=>{let G;for(;D!==U;)G=h(D),r(D),D=G;r(U)},Kt=(D,U,G)=>{const{bum:et,scope:J,job:nt,subTree:P,um:ot,m:rt,a:tt}=D;jm(rt),jm(tt),et&&fc(et),J.stop(),nt&&(nt.flags|=8,Rt(P,D,U,G)),ot&&qe(ot,U),qe(()=>{D.isUnmounted=!0},U)},Q=(D,U,G,et=!1,J=!1,nt=0)=>{for(let P=nt;P<D.length;P++)Rt(D[P],U,G,et,J)},it=D=>{if(D.shapeFlag&6)return it(D.component.subTree);if(D.shapeFlag&128)return D.suspense.next();const U=h(D.anchor||D.el),G=U&&U[g0];return G?h(G):U};let Mt=!1;const Ut=(D,U,G)=>{let et;D==null?U._vnode&&(Rt(U._vnode,null,null,!0),et=U._vnode.component):_(U._vnode||null,D,U,null,null,null,G),U._vnode=D,Mt||(Mt=!0,Bm(et),d0(),Mt=!1)},mt={p:_,um:Rt,m:ht,r:It,mt:O,mc:L,pc:K,pbc:b,n:it,o:e};return{render:Ut,hydrate:void 0,createApp:r1(Ut)}}function Wu({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Nr({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function y1(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ip(e,t,n=!1){const i=e.children,r=t.children;if(Ht(i)&&Ht(r))for(let s=0;s<i.length;s++){const a=i[s];let o=r[s];o.shapeFlag&1&&!o.dynamicChildren&&((o.patchFlag<=0||o.patchFlag===32)&&(o=r[s]=pr(r[s]),o.el=a.el),!n&&o.patchFlag!==-2&&Ip(a,o)),o.type===su&&(o.patchFlag!==-1?o.el=a.el:o.__elIndex=s+(e.type===rn?1:0)),o.type===Be&&!o.el&&(o.el=a.el)}}function S1(e){const t=e.slice(),n=[0];let i,r,s,a,o;const l=e.length;for(i=0;i<l;i++){const c=e[i];if(c!==0){if(r=n[n.length-1],e[r]<c){t[i]=r,n.push(i);continue}for(s=0,a=n.length-1;s<a;)o=s+a>>1,e[n[o]]<c?s=o+1:a=o;c<e[n[s]]&&(s>0&&(t[i]=n[s-1]),n[s]=i)}}for(s=n.length,a=n[s-1];s-- >0;)n[s]=a,a=t[a];return n}function X0(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:X0(t)}function jm(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function q0(e){if(e.placeholder)return e.placeholder;const t=e.component;return t?q0(t.subTree):null}const Y0=e=>e.__isSuspense;function M1(e,t){t&&t.pendingBranch?Ht(e)?t.effects.push(...e):t.effects.push(e):CM(e)}const rn=Symbol.for("v-fgt"),su=Symbol.for("v-txt"),Be=Symbol.for("v-cmt"),dc=Symbol.for("v-stc"),bo=[];let gn=null;function Md(e=!1){bo.push(gn=e?null:[])}function b1(){bo.pop(),gn=bo[bo.length-1]||null}let Ho=1;function Nc(e,t=!1){Ho+=e,e<0&&gn&&t&&(gn.hasOnce=!0)}function $0(e){return e.dynamicChildren=Ho>0?gn||ca:null,b1(),Ho>0&&gn&&gn.push(e),e}function lN(e,t,n,i,r,s){return $0(Z0(e,t,n,i,r,s,!0))}function bd(e,t,n,i,r){return $0(Ze(e,t,n,i,r,!0))}function zo(e){return e?e.__v_isVNode===!0:!1}function cs(e,t){return e.type===t.type&&e.key===t.key}const K0=({key:e})=>e!=null?e:null,pc=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?Me(e)||ze(e)||kt(e)?{i:De,r:e,k:t,f:!!n}:e:null);function Z0(e,t=null,n=null,i=0,r=null,s=e===rn?0:1,a=!1,o=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&K0(t),ref:t&&pc(t),scopeId:m0,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:De};return o?(Np(l,n),s&128&&e.normalize(l)):n&&(l.shapeFlag|=Me(n)?8:16),Ho>0&&!a&&gn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&gn.push(l),l}const Ze=T1;function T1(e,t=null,n=null,i=0,r=null,s=!1){if((!e||e===KM)&&(e=Be),zo(e)){const o=wr(e,t,!0);return n&&Np(o,n),Ho>0&&!s&&gn&&(o.shapeFlag&6?gn[gn.indexOf(e)]=o:gn.push(o)),o.patchFlag=-2,o}if(U1(e)&&(e=e.__vccOpts),t){t=E1(t);let{class:o,style:l}=t;o&&!Me(o)&&(t.class=yp(o)),fe(l)&&(Rp(l)&&!Ht(l)&&(l=we({},l)),t.style=xp(l))}const a=Me(e)?1:Y0(e)?128:x0(e)?64:fe(e)?4:kt(e)?2:0;return Z0(e,t,n,i,r,a,s,!0)}function E1(e){return e?Rp(e)||H0(e)?we({},e):e:null}function wr(e,t,n=!1,i=!1){const{props:r,ref:s,patchFlag:a,children:o,transition:l}=e,c=t?A1(r||{},t):r,f={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&K0(c),ref:t&&t.ref?n&&s?Ht(s)?s.concat(pc(t)):[s,pc(t)]:pc(t):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:o,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==rn?a===-1?16:a|16:a,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&wr(e.ssContent),ssFallback:e.ssFallback&&wr(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&i&&Bo(f,l.clone(f)),f}function w1(e=" ",t=0){return Ze(su,null,e,t)}function cN(e,t){const n=Ze(dc,null,e);return n.staticCount=t,n}function fN(e="",t=!1){return t?(Md(),bd(Be,null,e)):Ze(Be,null,e)}function hi(e){return e==null||typeof e=="boolean"?Ze(Be):Ht(e)?Ze(rn,null,e.slice()):zo(e)?pr(e):Ze(su,null,String(e))}function pr(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:wr(e)}function Np(e,t){let n=0;const{shapeFlag:i}=e;if(t==null)t=null;else if(Ht(t))n=16;else if(typeof t=="object")if(i&65){const r=t.default;r&&(r._c&&(r._d=!1),Np(e,r()),r._c&&(r._d=!0));return}else{n=32;const r=t._;!r&&!H0(t)?t._ctx=De:r===3&&De&&(De.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else kt(t)?(t={default:t,_ctx:De},n=32):(t=String(t),i&64?(n=16,t=[w1(t)]):n=8);e.children=t,e.shapeFlag|=n}function A1(...e){const t={};for(let n=0;n<e.length;n++){const i=e[n];for(const r in i)if(r==="class")t.class!==i.class&&(t.class=yp([t.class,i.class]));else if(r==="style")t.style=xp([t.style,i.style]);else if(Kf(r)){const s=t[r],a=i[r];a&&s!==a&&!(Ht(s)&&s.includes(a))&&(t[r]=s?[].concat(s,a):a)}else r!==""&&(t[r]=i[r])}return t}function ri(e,t,n,i=null){jn(e,t,7,[n,i])}const C1=F0();let R1=0;function P1(e,t,n){const i=e.type,r=(t?t.appContext:e.appContext)||C1,s={uid:R1++,vnode:e,type:i,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new JS(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:V0(i,r),emitsOptions:U0(i,r),emit:null,emitted:null,propsDefaults:de,inheritAttrs:i.inheritAttrs,ctx:de,data:de,props:de,attrs:de,slots:de,refs:de,setupState:de,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=t?t.root:s,s.emit=a1.bind(null,s),e.ce&&e.ce(s),s}let He=null;const J0=()=>He||De;let Fc,Td;{const e=Qf(),t=(n,i)=>{let r;return(r=e[n])||(r=e[n]=[]),r.push(i),s=>{r.length>1?r.forEach(a=>a(s)):r[0](s)}};Fc=t("__VUE_INSTANCE_SETTERS__",n=>He=n),Td=t("__VUE_SSR_SETTERS__",n=>Vo=n)}const il=e=>{const t=He;return Fc(e),e.scope.on(),()=>{e.scope.off(),Fc(t)}},Qm=()=>{He&&He.scope.off(),Fc(null)};function j0(e){return e.vnode.shapeFlag&4}let Vo=!1;function L1(e,t=!1,n=!1){t&&Td(t);const{props:i,children:r}=e.vnode,s=j0(e);h1(e,i,s,t),v1(e,r,n||t);const a=s?D1(e,t):void 0;return t&&Td(!1),a}function D1(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,JM);const{setup:i}=n;if(i){Zi();const r=e.setupContext=i.length>1?N1(e):null,s=il(e),a=nl(i,e,0,[e.props,r]),o=Vg(a);if(Ji(),s(),(o||e.sp)&&!ha(e)&&A0(e),o){if(a.then(Qm,Qm),t)return a.then(l=>{tv(e,l)}).catch(l=>{eu(l,e,0)});e.asyncDep=a}else tv(e,a)}else Q0(e)}function tv(e,t,n){kt(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:fe(t)&&(e.setupState=c0(t)),Q0(e)}function Q0(e,t,n){const i=e.type;e.render||(e.render=i.render||_i);{const r=il(e);Zi();try{jM(e)}finally{Ji(),r()}}}const I1={get(e,t){return Oe(e,"get",""),e[t]}};function N1(e){const t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,I1),slots:e.slots,emit:e.emit,expose:t}}function au(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(c0(gM(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Mo)return Mo[n](e)},has(t,n){return n in t||n in Mo}})):e.proxy}function F1(e,t=!0){return kt(e)?e.displayName||e.name:e.name||t&&e.__name}function U1(e){return kt(e)&&"__vccOpts"in e}const O1=(e,t)=>bM(e,t,Vo);function B1(e,t,n){try{Nc(-1);const i=arguments.length;return i===2?fe(t)&&!Ht(t)?zo(t)?Ze(e,null,[t]):Ze(e,t):Ze(e,null,t):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&zo(n)&&(n=[n]),Ze(e,t,n))}finally{Nc(1)}}const H1="3.5.27";/**
* @vue/runtime-dom v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ed;const ev=typeof window!="undefined"&&window.trustedTypes;if(ev)try{Ed=ev.createPolicy("vue",{createHTML:e=>e})}catch(e){}const tx=Ed?e=>Ed.createHTML(e):e=>e,z1="http://www.w3.org/2000/svg",V1="http://www.w3.org/1998/Math/MathML",Gi=typeof document!="undefined"?document:null,nv=Gi&&Gi.createElement("template"),G1={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,i)=>{const r=t==="svg"?Gi.createElementNS(z1,e):t==="mathml"?Gi.createElementNS(V1,e):n?Gi.createElement(e,{is:n}):Gi.createElement(e);return e==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:e=>Gi.createTextNode(e),createComment:e=>Gi.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Gi.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,i,r,s){const a=n?n.previousSibling:t.lastChild;if(r&&(r===s||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{nv.innerHTML=tx(i==="svg"?`<svg>${e}</svg>`:i==="mathml"?`<math>${e}</math>`:e);const o=nv.content;if(i==="svg"||i==="mathml"){const l=o.firstChild;for(;l.firstChild;)o.appendChild(l.firstChild);o.removeChild(l)}t.insertBefore(o,n)}return[a?a.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},nr="transition",Va="animation",Go=Symbol("_vtc"),ex={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},k1=we({},M0,ex),W1=e=>(e.displayName="Transition",e.props=k1,e),uN=W1((e,{slots:t})=>B1(OM,X1(e),t)),Fr=(e,t=[])=>{Ht(e)?e.forEach(n=>n(...t)):e&&e(...t)},iv=e=>e?Ht(e)?e.some(t=>t.length>1):e.length>1:!1;function X1(e){const t={};for(const I in e)I in ex||(t[I]=e[I]);if(e.css===!1)return t;const{name:n="v",type:i,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:a=`${n}-enter-active`,enterToClass:o=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:c=a,appearToClass:f=o,leaveFromClass:u=`${n}-leave-from`,leaveActiveClass:h=`${n}-leave-active`,leaveToClass:d=`${n}-leave-to`}=e,v=q1(r),_=v&&v[0],m=v&&v[1],{onBeforeEnter:p,onEnter:g,onEnterCancelled:M,onLeave:S,onLeaveCancelled:E,onBeforeAppear:T=p,onAppear:C=g,onAppearCancelled:L=M}=t,y=(I,F,O,q)=>{I._enterCancelled=q,Ur(I,F?f:o),Ur(I,F?c:a),O&&O()},b=(I,F)=>{I._isLeaving=!1,Ur(I,u),Ur(I,d),Ur(I,h),F&&F()},R=I=>(F,O)=>{const q=I?C:g,V=()=>y(F,I,O);Fr(q,[F,V]),rv(()=>{Ur(F,I?l:s),Ii(F,I?f:o),iv(q)||sv(F,i,_,V)})};return we(t,{onBeforeEnter(I){Fr(p,[I]),Ii(I,s),Ii(I,a)},onBeforeAppear(I){Fr(T,[I]),Ii(I,l),Ii(I,c)},onEnter:R(!1),onAppear:R(!0),onLeave(I,F){I._isLeaving=!0;const O=()=>b(I,F);Ii(I,u),I._enterCancelled?(Ii(I,h),lv(I)):(lv(I),Ii(I,h)),rv(()=>{I._isLeaving&&(Ur(I,u),Ii(I,d),iv(S)||sv(I,i,m,O))}),Fr(S,[I,O])},onEnterCancelled(I){y(I,!1,void 0,!0),Fr(M,[I])},onAppearCancelled(I){y(I,!0,void 0,!0),Fr(L,[I])},onLeaveCancelled(I){b(I),Fr(E,[I])}})}function q1(e){if(e==null)return null;if(fe(e))return[Xu(e.enter),Xu(e.leave)];{const t=Xu(e);return[t,t]}}function Xu(e){return GS(e)}function Ii(e,t){t.split(/\s+/).forEach(n=>n&&e.classList.add(n)),(e[Go]||(e[Go]=new Set)).add(t)}function Ur(e,t){t.split(/\s+/).forEach(i=>i&&e.classList.remove(i));const n=e[Go];n&&(n.delete(t),n.size||(e[Go]=void 0))}function rv(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let Y1=0;function sv(e,t,n,i){const r=e._endId=++Y1,s=()=>{r===e._endId&&i()};if(n!=null)return setTimeout(s,n);const{type:a,timeout:o,propCount:l}=$1(e,t);if(!a)return i();const c=a+"end";let f=0;const u=()=>{e.removeEventListener(c,h),s()},h=d=>{d.target===e&&++f>=l&&u()};setTimeout(()=>{f<l&&u()},o+1),e.addEventListener(c,h)}function $1(e,t){const n=window.getComputedStyle(e),i=v=>(n[v]||"").split(", "),r=i(`${nr}Delay`),s=i(`${nr}Duration`),a=av(r,s),o=i(`${Va}Delay`),l=i(`${Va}Duration`),c=av(o,l);let f=null,u=0,h=0;t===nr?a>0&&(f=nr,u=a,h=s.length):t===Va?c>0&&(f=Va,u=c,h=l.length):(u=Math.max(a,c),f=u>0?a>c?nr:Va:null,h=f?f===nr?s.length:l.length:0);const d=f===nr&&/\b(?:transform|all)(?:,|$)/.test(i(`${nr}Property`).toString());return{type:f,timeout:u,propCount:h,hasTransform:d}}function av(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((n,i)=>ov(n)+ov(e[i])))}function ov(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function lv(e){return(e?e.ownerDocument:document).body.offsetHeight}function K1(e,t,n){const i=e[Go];i&&(t=(t?[t,...i]:[...i]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const Uc=Symbol("_vod"),nx=Symbol("_vsh"),hN={name:"show",beforeMount(e,{value:t},{transition:n}){e[Uc]=e.style.display==="none"?"":e.style.display,n&&t?n.beforeEnter(e):Ga(e,t)},mounted(e,{value:t},{transition:n}){n&&t&&n.enter(e)},updated(e,{value:t,oldValue:n},{transition:i}){!t!=!n&&(i?t?(i.beforeEnter(e),Ga(e,!0),i.enter(e)):i.leave(e,()=>{Ga(e,!1)}):Ga(e,t))},beforeUnmount(e,{value:t}){Ga(e,t)}};function Ga(e,t){e.style.display=t?e[Uc]:"none",e[nx]=!t}const Z1=Symbol(""),J1=/(?:^|;)\s*display\s*:/;function j1(e,t,n){const i=e.style,r=Me(n);let s=!1;if(n&&!r){if(t)if(Me(t))for(const a of t.split(";")){const o=a.slice(0,a.indexOf(":")).trim();n[o]==null&&mc(i,o,"")}else for(const a in t)n[a]==null&&mc(i,a,"");for(const a in n)a==="display"&&(s=!0),mc(i,a,n[a])}else if(r){if(t!==n){const a=i[Z1];a&&(n+=";"+a),i.cssText=n,s=J1.test(n)}}else t&&e.removeAttribute("style");Uc in e&&(e[Uc]=s?i.display:"",e[nx]&&(i.display="none"))}const cv=/\s*!important$/;function mc(e,t,n){if(Ht(n))n.forEach(i=>mc(e,t,i));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const i=Q1(e,t);cv.test(n)?e.setProperty(Pr(i),n.replace(cv,""),"important"):e[i]=n}}const fv=["Webkit","Moz","ms"],qu={};function Q1(e,t){const n=qu[t];if(n)return n;let i=Nn(t);if(i!=="filter"&&i in e)return qu[t]=i;i=Jf(i);for(let r=0;r<fv.length;r++){const s=fv[r]+i;if(s in e)return qu[t]=s}return t}const uv="http://www.w3.org/1999/xlink";function hv(e,t,n,i,r,s=$S(t)){i&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(uv,t.slice(6,t.length)):e.setAttributeNS(uv,t,n):n==null||s&&!Xg(n)?e.removeAttribute(t):e.setAttribute(t,s?"":Zn(n)?String(n):n)}function dv(e,t,n,i,r){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?tx(n):n);return}const s=e.tagName;if(t==="value"&&s!=="PROGRESS"&&!s.includes("-")){const o=s==="OPTION"?e.getAttribute("value")||"":e.value,l=n==null?e.type==="checkbox"?"on":"":String(n);(o!==l||!("_value"in e))&&(e.value=l),n==null&&e.removeAttribute(t),e._value=n;return}let a=!1;if(n===""||n==null){const o=typeof e[t];o==="boolean"?n=Xg(n):n==null&&o==="string"?(n="",a=!0):o==="number"&&(n=0,a=!0)}try{e[t]=n}catch(o){}a&&e.removeAttribute(r||t)}function Yi(e,t,n,i){e.addEventListener(t,n,i)}function tb(e,t,n,i){e.removeEventListener(t,n,i)}const pv=Symbol("_vei");function eb(e,t,n,i,r=null){const s=e[pv]||(e[pv]={}),a=s[t];if(i&&a)a.value=i;else{const[o,l]=nb(t);if(i){const c=s[t]=sb(i,r);Yi(e,o,c,l)}else a&&(tb(e,o,a,l),s[t]=void 0)}}const mv=/(?:Once|Passive|Capture)$/;function nb(e){let t;if(mv.test(e)){t={};let i;for(;i=e.match(mv);)e=e.slice(0,e.length-i[0].length),t[i[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Pr(e.slice(2)),t]}let Yu=0;const ib=Promise.resolve(),rb=()=>Yu||(ib.then(()=>Yu=0),Yu=Date.now());function sb(e,t){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;jn(ab(i,n.value),t,5,[i])};return n.value=e,n.attached=rb(),n}function ab(e,t){if(Ht(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(i=>r=>!r._stopped&&i&&i(r))}else return t}const vv=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,ob=(e,t,n,i,r,s)=>{const a=r==="svg";t==="class"?K1(e,i,a):t==="style"?j1(e,n,i):Kf(t)?vp(t)||eb(e,t,n,i,s):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):lb(e,t,i,a))?(dv(e,t,i),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&hv(e,t,i,a,s,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!Me(i))?dv(e,Nn(t),i,s,t):(t==="true-value"?e._trueValue=i:t==="false-value"&&(e._falseValue=i),hv(e,t,i,a))};function lb(e,t,n,i){if(i)return!!(t==="innerHTML"||t==="textContent"||t in e&&vv(t)&&kt(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const r=e.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return vv(t)&&Me(n)?!1:t in e}const Ar=e=>{const t=e.props["onUpdate:modelValue"]||!1;return Ht(t)?n=>fc(t,n):t};function cb(e){e.target.composing=!0}function _v(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const In=Symbol("_assign");function gv(e,t,n){return t&&(e=e.trim()),n&&(e=jf(e)),e}const dN={created(e,{modifiers:{lazy:t,trim:n,number:i}},r){e[In]=Ar(r);const s=i||r.props&&r.props.type==="number";Yi(e,t?"change":"input",a=>{a.target.composing||e[In](gv(e.value,n,s))}),(n||s)&&Yi(e,"change",()=>{e.value=gv(e.value,n,s)}),t||(Yi(e,"compositionstart",cb),Yi(e,"compositionend",_v),Yi(e,"change",_v))},mounted(e,{value:t}){e.value=t==null?"":t},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:i,trim:r,number:s}},a){if(e[In]=Ar(a),e.composing)return;const o=(s||e.type==="number")&&!/^0\d/.test(e.value)?jf(e.value):e.value,l=t==null?"":t;o!==l&&(document.activeElement===e&&e.type!=="range"&&(i&&t===n||r&&e.value.trim()===l)||(e.value=l))}},pN={deep:!0,created(e,t,n){e[In]=Ar(n),Yi(e,"change",()=>{const i=e._modelValue,r=ya(e),s=e.checked,a=e[In];if(Ht(i)){const o=Sp(i,r),l=o!==-1;if(s&&!l)a(i.concat(r));else if(!s&&l){const c=[...i];c.splice(o,1),a(c)}}else if(Da(i)){const o=new Set(i);s?o.add(r):o.delete(r),a(o)}else a(ix(e,s))})},mounted:xv,beforeUpdate(e,t,n){e[In]=Ar(n),xv(e,t,n)}};function xv(e,{value:t,oldValue:n},i){e._modelValue=t;let r;if(Ht(t))r=Sp(t,i.props.value)>-1;else if(Da(t))r=t.has(i.props.value);else{if(t===n)return;r=bs(t,ix(e,!0))}e.checked!==r&&(e.checked=r)}const mN={created(e,{value:t},n){e.checked=bs(t,n.props.value),e[In]=Ar(n),Yi(e,"change",()=>{e[In](ya(e))})},beforeUpdate(e,{value:t,oldValue:n},i){e[In]=Ar(i),t!==n&&(e.checked=bs(t,i.props.value))}},vN={deep:!0,created(e,{value:t,modifiers:{number:n}},i){const r=Da(t);Yi(e,"change",()=>{const s=Array.prototype.filter.call(e.options,a=>a.selected).map(a=>n?jf(ya(a)):ya(a));e[In](e.multiple?r?new Set(s):s:s[0]),e._assigning=!0,u0(()=>{e._assigning=!1})}),e[In]=Ar(i)},mounted(e,{value:t}){yv(e,t)},beforeUpdate(e,t,n){e[In]=Ar(n)},updated(e,{value:t}){e._assigning||yv(e,t)}};function yv(e,t){const n=e.multiple,i=Ht(t);if(!(n&&!i&&!Da(t))){for(let r=0,s=e.options.length;r<s;r++){const a=e.options[r],o=ya(a);if(n)if(i){const l=typeof o;l==="string"||l==="number"?a.selected=t.some(c=>String(c)===String(o)):a.selected=Sp(t,o)>-1}else a.selected=t.has(o);else if(bs(ya(a),t)){e.selectedIndex!==r&&(e.selectedIndex=r);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function ya(e){return"_value"in e?e._value:e.value}function ix(e,t){const n=t?"_trueValue":"_falseValue";return n in e?e[n]:t}const fb=["ctrl","shift","alt","meta"],ub={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>fb.some(n=>e[`${n}Key`]&&!t.includes(n))},_N=(e,t)=>{const n=e._withMods||(e._withMods={}),i=t.join(".");return n[i]||(n[i]=(r,...s)=>{for(let a=0;a<t.length;a++){const o=ub[t[a]];if(o&&o(r,t))return}return e(r,...s)})},hb={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},gN=(e,t)=>{const n=e._withKeys||(e._withKeys={}),i=t.join(".");return n[i]||(n[i]=r=>{if(!("key"in r))return;const s=Pr(r.key);if(t.some(a=>a===s||hb[a]===s))return e(r)})},db=we({patchProp:ob},G1);let Sv;function pb(){return Sv||(Sv=g1(db))}const xN=(...e)=>{const t=pb().createApp(...e),{mount:n}=t;return t.mount=i=>{const r=vb(i);if(!r)return;const s=t._component;!kt(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const a=n(r,!1,mb(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),a},t};function mb(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function vb(e){return Me(e)?document.querySelector(e):e}function _b(e,t){let n=0;for(let i of e)i!=null&&(i=+i)>=i&&++n;return n}function gb(e,t){let n,i;if(t===void 0)for(const r of e)r!=null&&(n===void 0?r>=r&&(n=i=r):(n>r&&(n=r),i<r&&(i=r)));else{let r=-1;for(let s of e)(s=t(s,++r,e))!=null&&(n===void 0?s>=s&&(n=i=s):(n>s&&(n=s),i<s&&(i=s)))}return[n,i]}const xb=Math.sqrt(50),yb=Math.sqrt(10),Sb=Math.sqrt(2);function Oc(e,t,n){const i=(t-e)/Math.max(0,n),r=Math.floor(Math.log10(i)),s=i/Math.pow(10,r),a=s>=xb?10:s>=yb?5:s>=Sb?2:1;let o,l,c;return r<0?(c=Math.pow(10,-r)/a,o=Math.round(e*c),l=Math.round(t*c),o/c<e&&++o,l/c>t&&--l,c=-c):(c=Math.pow(10,r)*a,o=Math.round(e/c),l=Math.round(t/c),o*c<e&&++o,l*c>t&&--l),l<o&&.5<=n&&n<2?Oc(e,t,n*2):[o,l,c]}function Mb(e,t,n){if(t=+t,e=+e,n=+n,!(n>0))return[];if(e===t)return[e];const i=t<e,[r,s,a]=i?Oc(t,e,n):Oc(e,t,n);if(!(s>=r))return[];const o=s-r+1,l=new Array(o);if(i)if(a<0)for(let c=0;c<o;++c)l[c]=(s-c)/-a;else for(let c=0;c<o;++c)l[c]=(s-c)*a;else if(a<0)for(let c=0;c<o;++c)l[c]=(r+c)/-a;else for(let c=0;c<o;++c)l[c]=(r+c)*a;return l}function bb(e,t,n){return t=+t,e=+e,n=+n,Oc(e,t,n)[2]}function Tb(e,t,n){let i;for(;;){const r=bb(e,t,n);if(r===i||r===0||!isFinite(r))return[e,t];r>0?(e=Math.floor(e/r)*r,t=Math.ceil(t/r)*r):r<0&&(e=Math.ceil(e*r)/r,t=Math.floor(t*r)/r),i=r}}function Eb(e){return Math.max(1,Math.ceil(Math.log(_b(e))/Math.LN2)+1)}function yN(e,t,n){e=+e,t=+t,n=(r=arguments.length)<2?(t=e,e=0,1):r<3?1:+n;for(var i=-1,r=Math.max(0,Math.ceil((t-e)/n))|0,s=new Array(r);++i<r;)s[i]=e+i*n;return s}var wb={value:()=>{}};function rx(){for(var e=0,t=arguments.length,n={},i;e<t;++e){if(!(i=arguments[e]+"")||i in n||/[\s.]/.test(i))throw new Error("illegal type: "+i);n[i]=[]}return new vc(n)}function vc(e){this._=e}function Ab(e,t){return e.trim().split(/^|\s+/).map(function(n){var i="",r=n.indexOf(".");if(r>=0&&(i=n.slice(r+1),n=n.slice(0,r)),n&&!t.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:i}})}vc.prototype=rx.prototype={constructor:vc,on:function(e,t){var n=this._,i=Ab(e+"",n),r,s=-1,a=i.length;if(arguments.length<2){for(;++s<a;)if((r=(e=i[s]).type)&&(r=Cb(n[r],e.name)))return r;return}if(t!=null&&typeof t!="function")throw new Error("invalid callback: "+t);for(;++s<a;)if(r=(e=i[s]).type)n[r]=Mv(n[r],e.name,t);else if(t==null)for(r in n)n[r]=Mv(n[r],e.name,null);return this},copy:function(){var e={},t=this._;for(var n in t)e[n]=t[n].slice();return new vc(e)},call:function(e,t){if((r=arguments.length-2)>0)for(var n=new Array(r),i=0,r,s;i<r;++i)n[i]=arguments[i+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],i=0,r=s.length;i<r;++i)s[i].value.apply(t,n)},apply:function(e,t,n){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var i=this._[e],r=0,s=i.length;r<s;++r)i[r].value.apply(t,n)}};function Cb(e,t){for(var n=0,i=e.length,r;n<i;++n)if((r=e[n]).name===t)return r.value}function Mv(e,t,n){for(var i=0,r=e.length;i<r;++i)if(e[i].name===t){e[i]=wb,e=e.slice(0,i).concat(e.slice(i+1));break}return n!=null&&e.push({name:t,value:n}),e}var wd="http://www.w3.org/1999/xhtml";const bv={svg:"http://www.w3.org/2000/svg",xhtml:wd,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function ou(e){var t=e+="",n=t.indexOf(":");return n>=0&&(t=e.slice(0,n))!=="xmlns"&&(e=e.slice(n+1)),bv.hasOwnProperty(t)?{space:bv[t],local:e}:e}function Rb(e){return function(){var t=this.ownerDocument,n=this.namespaceURI;return n===wd&&t.documentElement.namespaceURI===wd?t.createElement(e):t.createElementNS(n,e)}}function Pb(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function sx(e){var t=ou(e);return(t.local?Pb:Rb)(t)}function Lb(){}function Fp(e){return e==null?Lb:function(){return this.querySelector(e)}}function Db(e){typeof e!="function"&&(e=Fp(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=new Array(a),l,c,f=0;f<a;++f)(l=s[f])&&(c=e.call(l,l.__data__,f,s))&&("__data__"in l&&(c.__data__=l.__data__),o[f]=c);return new Qn(i,this._parents)}function Ib(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function Nb(){return[]}function ax(e){return e==null?Nb:function(){return this.querySelectorAll(e)}}function Fb(e){return function(){return Ib(e.apply(this,arguments))}}function Ub(e){typeof e=="function"?e=Fb(e):e=ax(e);for(var t=this._groups,n=t.length,i=[],r=[],s=0;s<n;++s)for(var a=t[s],o=a.length,l,c=0;c<o;++c)(l=a[c])&&(i.push(e.call(l,l.__data__,c,a)),r.push(l));return new Qn(i,r)}function ox(e){return function(){return this.matches(e)}}function lx(e){return function(t){return t.matches(e)}}var Ob=Array.prototype.find;function Bb(e){return function(){return Ob.call(this.children,e)}}function Hb(){return this.firstElementChild}function zb(e){return this.select(e==null?Hb:Bb(typeof e=="function"?e:lx(e)))}var Vb=Array.prototype.filter;function Gb(){return Array.from(this.children)}function kb(e){return function(){return Vb.call(this.children,e)}}function Wb(e){return this.selectAll(e==null?Gb:kb(typeof e=="function"?e:lx(e)))}function Xb(e){typeof e!="function"&&(e=ox(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=[],l,c=0;c<a;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&o.push(l);return new Qn(i,this._parents)}function cx(e){return new Array(e.length)}function qb(){return new Qn(this._enter||this._groups.map(cx),this._parents)}function Bc(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}Bc.prototype={constructor:Bc,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function Yb(e){return function(){return e}}function $b(e,t,n,i,r,s){for(var a=0,o,l=t.length,c=s.length;a<c;++a)(o=t[a])?(o.__data__=s[a],i[a]=o):n[a]=new Bc(e,s[a]);for(;a<l;++a)(o=t[a])&&(r[a]=o)}function Kb(e,t,n,i,r,s,a){var o,l,c=new Map,f=t.length,u=s.length,h=new Array(f),d;for(o=0;o<f;++o)(l=t[o])&&(h[o]=d=a.call(l,l.__data__,o,t)+"",c.has(d)?r[o]=l:c.set(d,l));for(o=0;o<u;++o)d=a.call(e,s[o],o,s)+"",(l=c.get(d))?(i[o]=l,l.__data__=s[o],c.delete(d)):n[o]=new Bc(e,s[o]);for(o=0;o<f;++o)(l=t[o])&&c.get(h[o])===l&&(r[o]=l)}function Zb(e){return e.__data__}function Jb(e,t){if(!arguments.length)return Array.from(this,Zb);var n=t?Kb:$b,i=this._parents,r=this._groups;typeof e!="function"&&(e=Yb(e));for(var s=r.length,a=new Array(s),o=new Array(s),l=new Array(s),c=0;c<s;++c){var f=i[c],u=r[c],h=u.length,d=jb(e.call(f,f&&f.__data__,c,i)),v=d.length,_=o[c]=new Array(v),m=a[c]=new Array(v),p=l[c]=new Array(h);n(f,u,_,m,p,d,t);for(var g=0,M=0,S,E;g<v;++g)if(S=_[g]){for(g>=M&&(M=g+1);!(E=m[M])&&++M<v;);S._next=E||null}}return a=new Qn(a,i),a._enter=o,a._exit=l,a}function jb(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function Qb(){return new Qn(this._exit||this._groups.map(cx),this._parents)}function tT(e,t,n){var i=this.enter(),r=this,s=this.exit();return typeof e=="function"?(i=e(i),i&&(i=i.selection())):i=i.append(e+""),t!=null&&(r=t(r),r&&(r=r.selection())),n==null?s.remove():n(s),i&&r?i.merge(r).order():r}function eT(e){for(var t=e.selection?e.selection():e,n=this._groups,i=t._groups,r=n.length,s=i.length,a=Math.min(r,s),o=new Array(r),l=0;l<a;++l)for(var c=n[l],f=i[l],u=c.length,h=o[l]=new Array(u),d,v=0;v<u;++v)(d=c[v]||f[v])&&(h[v]=d);for(;l<r;++l)o[l]=n[l];return new Qn(o,this._parents)}function nT(){for(var e=this._groups,t=-1,n=e.length;++t<n;)for(var i=e[t],r=i.length-1,s=i[r],a;--r>=0;)(a=i[r])&&(s&&a.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(a,s),s=a);return this}function iT(e){e||(e=rT);function t(u,h){return u&&h?e(u.__data__,h.__data__):!u-!h}for(var n=this._groups,i=n.length,r=new Array(i),s=0;s<i;++s){for(var a=n[s],o=a.length,l=r[s]=new Array(o),c,f=0;f<o;++f)(c=a[f])&&(l[f]=c);l.sort(t)}return new Qn(r,this._parents).order()}function rT(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function sT(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function aT(){return Array.from(this)}function oT(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var i=e[t],r=0,s=i.length;r<s;++r){var a=i[r];if(a)return a}return null}function lT(){let e=0;for(const t of this)++e;return e}function cT(){return!this.node()}function fT(e){for(var t=this._groups,n=0,i=t.length;n<i;++n)for(var r=t[n],s=0,a=r.length,o;s<a;++s)(o=r[s])&&e.call(o,o.__data__,s,r);return this}function uT(e){return function(){this.removeAttribute(e)}}function hT(e){return function(){this.removeAttributeNS(e.space,e.local)}}function dT(e,t){return function(){this.setAttribute(e,t)}}function pT(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function mT(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttribute(e):this.setAttribute(e,n)}}function vT(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,n)}}function _T(e,t){var n=ou(e);if(arguments.length<2){var i=this.node();return n.local?i.getAttributeNS(n.space,n.local):i.getAttribute(n)}return this.each((t==null?n.local?hT:uT:typeof t=="function"?n.local?vT:mT:n.local?pT:dT)(n,t))}function fx(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function gT(e){return function(){this.style.removeProperty(e)}}function xT(e,t,n){return function(){this.style.setProperty(e,t,n)}}function yT(e,t,n){return function(){var i=t.apply(this,arguments);i==null?this.style.removeProperty(e):this.style.setProperty(e,i,n)}}function ST(e,t,n){return arguments.length>1?this.each((t==null?gT:typeof t=="function"?yT:xT)(e,t,n==null?"":n)):Sa(this.node(),e)}function Sa(e,t){return e.style.getPropertyValue(t)||fx(e).getComputedStyle(e,null).getPropertyValue(t)}function MT(e){return function(){delete this[e]}}function bT(e,t){return function(){this[e]=t}}function TT(e,t){return function(){var n=t.apply(this,arguments);n==null?delete this[e]:this[e]=n}}function ET(e,t){return arguments.length>1?this.each((t==null?MT:typeof t=="function"?TT:bT)(e,t)):this.node()[e]}function ux(e){return e.trim().split(/^|\s+/)}function Up(e){return e.classList||new hx(e)}function hx(e){this._node=e,this._names=ux(e.getAttribute("class")||"")}hx.prototype={add:function(e){var t=this._names.indexOf(e);t<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function dx(e,t){for(var n=Up(e),i=-1,r=t.length;++i<r;)n.add(t[i])}function px(e,t){for(var n=Up(e),i=-1,r=t.length;++i<r;)n.remove(t[i])}function wT(e){return function(){dx(this,e)}}function AT(e){return function(){px(this,e)}}function CT(e,t){return function(){(t.apply(this,arguments)?dx:px)(this,e)}}function RT(e,t){var n=ux(e+"");if(arguments.length<2){for(var i=Up(this.node()),r=-1,s=n.length;++r<s;)if(!i.contains(n[r]))return!1;return!0}return this.each((typeof t=="function"?CT:t?wT:AT)(n,t))}function PT(){this.textContent=""}function LT(e){return function(){this.textContent=e}}function DT(e){return function(){var t=e.apply(this,arguments);this.textContent=t==null?"":t}}function IT(e){return arguments.length?this.each(e==null?PT:(typeof e=="function"?DT:LT)(e)):this.node().textContent}function NT(){this.innerHTML=""}function FT(e){return function(){this.innerHTML=e}}function UT(e){return function(){var t=e.apply(this,arguments);this.innerHTML=t==null?"":t}}function OT(e){return arguments.length?this.each(e==null?NT:(typeof e=="function"?UT:FT)(e)):this.node().innerHTML}function BT(){this.nextSibling&&this.parentNode.appendChild(this)}function HT(){return this.each(BT)}function zT(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function VT(){return this.each(zT)}function GT(e){var t=typeof e=="function"?e:sx(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})}function kT(){return null}function WT(e,t){var n=typeof e=="function"?e:sx(e),i=t==null?kT:typeof t=="function"?t:Fp(t);return this.select(function(){return this.insertBefore(n.apply(this,arguments),i.apply(this,arguments)||null)})}function XT(){var e=this.parentNode;e&&e.removeChild(this)}function qT(){return this.each(XT)}function YT(){var e=this.cloneNode(!1),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function $T(){var e=this.cloneNode(!0),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function KT(e){return this.select(e?$T:YT)}function ZT(e){return arguments.length?this.property("__data__",e):this.node().__data__}function JT(e){return function(t){e.call(this,t,this.__data__)}}function jT(e){return e.trim().split(/^|\s+/).map(function(t){var n="",i=t.indexOf(".");return i>=0&&(n=t.slice(i+1),t=t.slice(0,i)),{type:t,name:n}})}function QT(e){return function(){var t=this.__on;if(t){for(var n=0,i=-1,r=t.length,s;n<r;++n)s=t[n],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):t[++i]=s;++i?t.length=i:delete this.__on}}}function tE(e,t,n){return function(){var i=this.__on,r,s=JT(t);if(i){for(var a=0,o=i.length;a<o;++a)if((r=i[a]).type===e.type&&r.name===e.name){this.removeEventListener(r.type,r.listener,r.options),this.addEventListener(r.type,r.listener=s,r.options=n),r.value=t;return}}this.addEventListener(e.type,s,n),r={type:e.type,name:e.name,value:t,listener:s,options:n},i?i.push(r):this.__on=[r]}}function eE(e,t,n){var i=jT(e+""),r,s=i.length,a;if(arguments.length<2){var o=this.node().__on;if(o){for(var l=0,c=o.length,f;l<c;++l)for(r=0,f=o[l];r<s;++r)if((a=i[r]).type===f.type&&a.name===f.name)return f.value}return}for(o=t?tE:QT,r=0;r<s;++r)this.each(o(i[r],t,n));return this}function mx(e,t,n){var i=fx(e),r=i.CustomEvent;typeof r=="function"?r=new r(t,n):(r=i.document.createEvent("Event"),n?(r.initEvent(t,n.bubbles,n.cancelable),r.detail=n.detail):r.initEvent(t,!1,!1)),e.dispatchEvent(r)}function nE(e,t){return function(){return mx(this,e,t)}}function iE(e,t){return function(){return mx(this,e,t.apply(this,arguments))}}function rE(e,t){return this.each((typeof t=="function"?iE:nE)(e,t))}function*sE(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var i=e[t],r=0,s=i.length,a;r<s;++r)(a=i[r])&&(yield a)}var aE=[null];function Qn(e,t){this._groups=e,this._parents=t}function rl(){return new Qn([[document.documentElement]],aE)}function oE(){return this}Qn.prototype=rl.prototype={constructor:Qn,select:Db,selectAll:Ub,selectChild:zb,selectChildren:Wb,filter:Xb,data:Jb,enter:qb,exit:Qb,join:tT,merge:eT,selection:oE,order:nT,sort:iT,call:sT,nodes:aT,node:oT,size:lT,empty:cT,each:fT,attr:_T,style:ST,property:ET,classed:RT,text:IT,html:OT,raise:HT,lower:VT,append:GT,insert:WT,remove:qT,clone:KT,datum:ZT,on:eE,dispatch:rE,[Symbol.iterator]:sE};function Op(e,t,n){e.prototype=t.prototype=n,n.constructor=e}function vx(e,t){var n=Object.create(e.prototype);for(var i in t)n[i]=t[i];return n}function sl(){}var ko=.7,Hc=1/ko,pa="\\s*([+-]?\\d+)\\s*",Wo="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",gi="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",lE=/^#([0-9a-f]{3,8})$/,cE=new RegExp(`^rgb\\(${pa},${pa},${pa}\\)$`),fE=new RegExp(`^rgb\\(${gi},${gi},${gi}\\)$`),uE=new RegExp(`^rgba\\(${pa},${pa},${pa},${Wo}\\)$`),hE=new RegExp(`^rgba\\(${gi},${gi},${gi},${Wo}\\)$`),dE=new RegExp(`^hsl\\(${Wo},${gi},${gi}\\)$`),pE=new RegExp(`^hsla\\(${Wo},${gi},${gi},${Wo}\\)$`),Tv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Op(sl,Xo,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Ev,formatHex:Ev,formatHex8:mE,formatHsl:vE,formatRgb:wv,toString:wv});function Ev(){return this.rgb().formatHex()}function mE(){return this.rgb().formatHex8()}function vE(){return _x(this).formatHsl()}function wv(){return this.rgb().formatRgb()}function Xo(e){var t,n;return e=(e+"").trim().toLowerCase(),(t=lE.exec(e))?(n=t[1].length,t=parseInt(t[1],16),n===6?Av(t):n===3?new on(t>>8&15|t>>4&240,t>>4&15|t&240,(t&15)<<4|t&15,1):n===8?yl(t>>24&255,t>>16&255,t>>8&255,(t&255)/255):n===4?yl(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|t&240,((t&15)<<4|t&15)/255):null):(t=cE.exec(e))?new on(t[1],t[2],t[3],1):(t=fE.exec(e))?new on(t[1]*255/100,t[2]*255/100,t[3]*255/100,1):(t=uE.exec(e))?yl(t[1],t[2],t[3],t[4]):(t=hE.exec(e))?yl(t[1]*255/100,t[2]*255/100,t[3]*255/100,t[4]):(t=dE.exec(e))?Pv(t[1],t[2]/100,t[3]/100,1):(t=pE.exec(e))?Pv(t[1],t[2]/100,t[3]/100,t[4]):Tv.hasOwnProperty(e)?Av(Tv[e]):e==="transparent"?new on(NaN,NaN,NaN,0):null}function Av(e){return new on(e>>16&255,e>>8&255,e&255,1)}function yl(e,t,n,i){return i<=0&&(e=t=n=NaN),new on(e,t,n,i)}function _E(e){return e instanceof sl||(e=Xo(e)),e?(e=e.rgb(),new on(e.r,e.g,e.b,e.opacity)):new on}function zc(e,t,n,i){return arguments.length===1?_E(e):new on(e,t,n,i==null?1:i)}function on(e,t,n,i){this.r=+e,this.g=+t,this.b=+n,this.opacity=+i}Op(on,zc,vx(sl,{brighter(e){return e=e==null?Hc:Math.pow(Hc,e),new on(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?ko:Math.pow(ko,e),new on(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new on(_s(this.r),_s(this.g),_s(this.b),Vc(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:Cv,formatHex:Cv,formatHex8:gE,formatRgb:Rv,toString:Rv}));function Cv(){return`#${us(this.r)}${us(this.g)}${us(this.b)}`}function gE(){return`#${us(this.r)}${us(this.g)}${us(this.b)}${us((isNaN(this.opacity)?1:this.opacity)*255)}`}function Rv(){const e=Vc(this.opacity);return`${e===1?"rgb(":"rgba("}${_s(this.r)}, ${_s(this.g)}, ${_s(this.b)}${e===1?")":`, ${e})`}`}function Vc(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function _s(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function us(e){return e=_s(e),(e<16?"0":"")+e.toString(16)}function Pv(e,t,n,i){return i<=0?e=t=n=NaN:n<=0||n>=1?e=t=NaN:t<=0&&(e=NaN),new Gn(e,t,n,i)}function _x(e){if(e instanceof Gn)return new Gn(e.h,e.s,e.l,e.opacity);if(e instanceof sl||(e=Xo(e)),!e)return new Gn;if(e instanceof Gn)return e;e=e.rgb();var t=e.r/255,n=e.g/255,i=e.b/255,r=Math.min(t,n,i),s=Math.max(t,n,i),a=NaN,o=s-r,l=(s+r)/2;return o?(t===s?a=(n-i)/o+(n<i)*6:n===s?a=(i-t)/o+2:a=(t-n)/o+4,o/=l<.5?s+r:2-s-r,a*=60):o=l>0&&l<1?0:a,new Gn(a,o,l,e.opacity)}function xE(e,t,n,i){return arguments.length===1?_x(e):new Gn(e,t,n,i==null?1:i)}function Gn(e,t,n,i){this.h=+e,this.s=+t,this.l=+n,this.opacity=+i}Op(Gn,xE,vx(sl,{brighter(e){return e=e==null?Hc:Math.pow(Hc,e),new Gn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?ko:Math.pow(ko,e),new Gn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,t=isNaN(e)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*t,r=2*n-i;return new on($u(e>=240?e-240:e+120,r,i),$u(e,r,i),$u(e<120?e+240:e-120,r,i),this.opacity)},clamp(){return new Gn(Lv(this.h),Sl(this.s),Sl(this.l),Vc(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=Vc(this.opacity);return`${e===1?"hsl(":"hsla("}${Lv(this.h)}, ${Sl(this.s)*100}%, ${Sl(this.l)*100}%${e===1?")":`, ${e})`}`}}));function Lv(e){return e=(e||0)%360,e<0?e+360:e}function Sl(e){return Math.max(0,Math.min(1,e||0))}function $u(e,t,n){return(e<60?t+(n-t)*e/60:e<180?n:e<240?t+(n-t)*(240-e)/60:t)*255}function yE(e,t,n,i,r){var s=e*e,a=s*e;return((1-3*e+3*s-a)*t+(4-6*s+3*a)*n+(1+3*e+3*s-3*a)*i+a*r)/6}function SE(e){var t=e.length-1;return function(n){var i=n<=0?n=0:n>=1?(n=1,t-1):Math.floor(n*t),r=e[i],s=e[i+1],a=i>0?e[i-1]:2*r-s,o=i<t-1?e[i+2]:2*s-r;return yE((n-i/t)*t,a,r,s,o)}}const gx=e=>()=>e;function ME(e,t){return function(n){return e+n*t}}function bE(e,t,n){return e=Math.pow(e,n),t=Math.pow(t,n)-e,n=1/n,function(i){return Math.pow(e+i*t,n)}}function TE(e){return(e=+e)==1?xx:function(t,n){return n-t?bE(t,n,e):gx(isNaN(t)?n:t)}}function xx(e,t){var n=t-e;return n?ME(e,n):gx(isNaN(e)?t:e)}const Dv=function e(t){var n=TE(t);function i(r,s){var a=n((r=zc(r)).r,(s=zc(s)).r),o=n(r.g,s.g),l=n(r.b,s.b),c=xx(r.opacity,s.opacity);return function(f){return r.r=a(f),r.g=o(f),r.b=l(f),r.opacity=c(f),r+""}}return i.gamma=e,i}(1);function EE(e){return function(t){var n=t.length,i=new Array(n),r=new Array(n),s=new Array(n),a,o;for(a=0;a<n;++a)o=zc(t[a]),i[a]=o.r||0,r[a]=o.g||0,s[a]=o.b||0;return i=e(i),r=e(r),s=e(s),o.opacity=1,function(l){return o.r=i(l),o.g=r(l),o.b=s(l),o+""}}}var SN=EE(SE);function mr(e,t){return e=+e,t=+t,function(n){return e*(1-n)+t*n}}var Ad=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Ku=new RegExp(Ad.source,"g");function wE(e){return function(){return e}}function AE(e){return function(t){return e(t)+""}}function CE(e,t){var n=Ad.lastIndex=Ku.lastIndex=0,i,r,s,a=-1,o=[],l=[];for(e=e+"",t=t+"";(i=Ad.exec(e))&&(r=Ku.exec(t));)(s=r.index)>n&&(s=t.slice(n,s),o[a]?o[a]+=s:o[++a]=s),(i=i[0])===(r=r[0])?o[a]?o[a]+=r:o[++a]=r:(o[++a]=null,l.push({i:a,x:mr(i,r)})),n=Ku.lastIndex;return n<t.length&&(s=t.slice(n),o[a]?o[a]+=s:o[++a]=s),o.length<2?l[0]?AE(l[0].x):wE(t):(t=l.length,function(c){for(var f=0,u;f<t;++f)o[(u=l[f]).i]=u.x(c);return o.join("")})}var Iv=180/Math.PI,Cd={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function yx(e,t,n,i,r,s){var a,o,l;return(a=Math.sqrt(e*e+t*t))&&(e/=a,t/=a),(l=e*n+t*i)&&(n-=e*l,i-=t*l),(o=Math.sqrt(n*n+i*i))&&(n/=o,i/=o,l/=o),e*i<t*n&&(e=-e,t=-t,l=-l,a=-a),{translateX:r,translateY:s,rotate:Math.atan2(t,e)*Iv,skewX:Math.atan(l)*Iv,scaleX:a,scaleY:o}}var Ml;function RE(e){const t=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return t.isIdentity?Cd:yx(t.a,t.b,t.c,t.d,t.e,t.f)}function PE(e){return e==null||(Ml||(Ml=document.createElementNS("http://www.w3.org/2000/svg","g")),Ml.setAttribute("transform",e),!(e=Ml.transform.baseVal.consolidate()))?Cd:(e=e.matrix,yx(e.a,e.b,e.c,e.d,e.e,e.f))}function Sx(e,t,n,i){function r(c){return c.length?c.pop()+" ":""}function s(c,f,u,h,d,v){if(c!==u||f!==h){var _=d.push("translate(",null,t,null,n);v.push({i:_-4,x:mr(c,u)},{i:_-2,x:mr(f,h)})}else(u||h)&&d.push("translate("+u+t+h+n)}function a(c,f,u,h){c!==f?(c-f>180?f+=360:f-c>180&&(c+=360),h.push({i:u.push(r(u)+"rotate(",null,i)-2,x:mr(c,f)})):f&&u.push(r(u)+"rotate("+f+i)}function o(c,f,u,h){c!==f?h.push({i:u.push(r(u)+"skewX(",null,i)-2,x:mr(c,f)}):f&&u.push(r(u)+"skewX("+f+i)}function l(c,f,u,h,d,v){if(c!==u||f!==h){var _=d.push(r(d)+"scale(",null,",",null,")");v.push({i:_-4,x:mr(c,u)},{i:_-2,x:mr(f,h)})}else(u!==1||h!==1)&&d.push(r(d)+"scale("+u+","+h+")")}return function(c,f){var u=[],h=[];return c=e(c),f=e(f),s(c.translateX,c.translateY,f.translateX,f.translateY,u,h),a(c.rotate,f.rotate,u,h),o(c.skewX,f.skewX,u,h),l(c.scaleX,c.scaleY,f.scaleX,f.scaleY,u,h),c=f=null,function(d){for(var v=-1,_=h.length,m;++v<_;)u[(m=h[v]).i]=m.x(d);return u.join("")}}}var LE=Sx(RE,"px, ","px)","deg)"),DE=Sx(PE,", ",")",")"),Ma=0,ro=0,ka=0,Mx=1e3,Gc,so,kc=0,Ts=0,lu=0,qo=typeof performance=="object"&&performance.now?performance:Date,bx=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function Bp(){return Ts||(bx(IE),Ts=qo.now()+lu)}function IE(){Ts=0}function Wc(){this._call=this._time=this._next=null}Wc.prototype=Tx.prototype={constructor:Wc,restart:function(e,t,n){if(typeof e!="function")throw new TypeError("callback is not a function");n=(n==null?Bp():+n)+(t==null?0:+t),!this._next&&so!==this&&(so?so._next=this:Gc=this,so=this),this._call=e,this._time=n,Rd()},stop:function(){this._call&&(this._call=null,this._time=1/0,Rd())}};function Tx(e,t,n){var i=new Wc;return i.restart(e,t,n),i}function NE(){Bp(),++Ma;for(var e=Gc,t;e;)(t=Ts-e._time)>=0&&e._call.call(void 0,t),e=e._next;--Ma}function Nv(){Ts=(kc=qo.now())+lu,Ma=ro=0;try{NE()}finally{Ma=0,UE(),Ts=0}}function FE(){var e=qo.now(),t=e-kc;t>Mx&&(lu-=t,kc=e)}function UE(){for(var e,t=Gc,n,i=1/0;t;)t._call?(i>t._time&&(i=t._time),e=t,t=t._next):(n=t._next,t._next=null,t=e?e._next=n:Gc=n);so=e,Rd(i)}function Rd(e){if(!Ma){ro&&(ro=clearTimeout(ro));var t=e-Ts;t>24?(e<1/0&&(ro=setTimeout(Nv,e-qo.now()-lu)),ka&&(ka=clearInterval(ka))):(ka||(kc=qo.now(),ka=setInterval(FE,Mx)),Ma=1,bx(Nv))}}function Fv(e,t,n){var i=new Wc;return t=t==null?0:+t,i.restart(r=>{i.stop(),e(r+t)},t,n),i}var OE=rx("start","end","cancel","interrupt"),BE=[],Ex=0,Uv=1,Pd=2,_c=3,Ov=4,Ld=5,gc=6;function cu(e,t,n,i,r,s){var a=e.__transition;if(!a)e.__transition={};else if(n in a)return;HE(e,n,{name:t,index:i,group:r,on:OE,tween:BE,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Ex})}function Hp(e,t){var n=ni(e,t);if(n.state>Ex)throw new Error("too late; already scheduled");return n}function Ri(e,t){var n=ni(e,t);if(n.state>_c)throw new Error("too late; already running");return n}function ni(e,t){var n=e.__transition;if(!n||!(n=n[t]))throw new Error("transition not found");return n}function HE(e,t,n){var i=e.__transition,r;i[t]=n,n.timer=Tx(s,0,n.time);function s(c){n.state=Uv,n.timer.restart(a,n.delay,n.time),n.delay<=c&&a(c-n.delay)}function a(c){var f,u,h,d;if(n.state!==Uv)return l();for(f in i)if(d=i[f],d.name===n.name){if(d.state===_c)return Fv(a);d.state===Ov?(d.state=gc,d.timer.stop(),d.on.call("interrupt",e,e.__data__,d.index,d.group),delete i[f]):+f<t&&(d.state=gc,d.timer.stop(),d.on.call("cancel",e,e.__data__,d.index,d.group),delete i[f])}if(Fv(function(){n.state===_c&&(n.state=Ov,n.timer.restart(o,n.delay,n.time),o(c))}),n.state=Pd,n.on.call("start",e,e.__data__,n.index,n.group),n.state===Pd){for(n.state=_c,r=new Array(h=n.tween.length),f=0,u=-1;f<h;++f)(d=n.tween[f].value.call(e,e.__data__,n.index,n.group))&&(r[++u]=d);r.length=u+1}}function o(c){for(var f=c<n.duration?n.ease.call(null,c/n.duration):(n.timer.restart(l),n.state=Ld,1),u=-1,h=r.length;++u<h;)r[u].call(e,f);n.state===Ld&&(n.on.call("end",e,e.__data__,n.index,n.group),l())}function l(){n.state=gc,n.timer.stop(),delete i[t];for(var c in i)return;delete e.__transition}}function zE(e,t){var n=e.__transition,i,r,s=!0,a;if(n){t=t==null?null:t+"";for(a in n){if((i=n[a]).name!==t){s=!1;continue}r=i.state>Pd&&i.state<Ld,i.state=gc,i.timer.stop(),i.on.call(r?"interrupt":"cancel",e,e.__data__,i.index,i.group),delete n[a]}s&&delete e.__transition}}function VE(e){return this.each(function(){zE(this,e)})}function GE(e,t){var n,i;return function(){var r=Ri(this,e),s=r.tween;if(s!==n){i=n=s;for(var a=0,o=i.length;a<o;++a)if(i[a].name===t){i=i.slice(),i.splice(a,1);break}}r.tween=i}}function kE(e,t,n){var i,r;if(typeof n!="function")throw new Error;return function(){var s=Ri(this,e),a=s.tween;if(a!==i){r=(i=a).slice();for(var o={name:t,value:n},l=0,c=r.length;l<c;++l)if(r[l].name===t){r[l]=o;break}l===c&&r.push(o)}s.tween=r}}function WE(e,t){var n=this._id;if(e+="",arguments.length<2){for(var i=ni(this.node(),n).tween,r=0,s=i.length,a;r<s;++r)if((a=i[r]).name===e)return a.value;return null}return this.each((t==null?GE:kE)(n,e,t))}function zp(e,t,n){var i=e._id;return e.each(function(){var r=Ri(this,i);(r.value||(r.value={}))[t]=n.apply(this,arguments)}),function(r){return ni(r,i).value[t]}}function Ax(e,t){var n;return(typeof t=="number"?mr:t instanceof Xo?Dv:(n=Xo(t))?(t=n,Dv):CE)(e,t)}function XE(e){return function(){this.removeAttribute(e)}}function qE(e){return function(){this.removeAttributeNS(e.space,e.local)}}function YE(e,t,n){var i,r=n+"",s;return function(){var a=this.getAttribute(e);return a===r?null:a===i?s:s=t(i=a,n)}}function $E(e,t,n){var i,r=n+"",s;return function(){var a=this.getAttributeNS(e.space,e.local);return a===r?null:a===i?s:s=t(i=a,n)}}function KE(e,t,n){var i,r,s;return function(){var a,o=n(this),l;return o==null?void this.removeAttribute(e):(a=this.getAttribute(e),l=o+"",a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o)))}}function ZE(e,t,n){var i,r,s;return function(){var a,o=n(this),l;return o==null?void this.removeAttributeNS(e.space,e.local):(a=this.getAttributeNS(e.space,e.local),l=o+"",a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o)))}}function JE(e,t){var n=ou(e),i=n==="transform"?DE:Ax;return this.attrTween(e,typeof t=="function"?(n.local?ZE:KE)(n,i,zp(this,"attr."+e,t)):t==null?(n.local?qE:XE)(n):(n.local?$E:YE)(n,i,t))}function jE(e,t){return function(n){this.setAttribute(e,t.call(this,n))}}function QE(e,t){return function(n){this.setAttributeNS(e.space,e.local,t.call(this,n))}}function tw(e,t){var n,i;function r(){var s=t.apply(this,arguments);return s!==i&&(n=(i=s)&&QE(e,s)),n}return r._value=t,r}function ew(e,t){var n,i;function r(){var s=t.apply(this,arguments);return s!==i&&(n=(i=s)&&jE(e,s)),n}return r._value=t,r}function nw(e,t){var n="attr."+e;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(t==null)return this.tween(n,null);if(typeof t!="function")throw new Error;var i=ou(e);return this.tween(n,(i.local?tw:ew)(i,t))}function iw(e,t){return function(){Hp(this,e).delay=+t.apply(this,arguments)}}function rw(e,t){return t=+t,function(){Hp(this,e).delay=t}}function sw(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?iw:rw)(t,e)):ni(this.node(),t).delay}function aw(e,t){return function(){Ri(this,e).duration=+t.apply(this,arguments)}}function ow(e,t){return t=+t,function(){Ri(this,e).duration=t}}function lw(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?aw:ow)(t,e)):ni(this.node(),t).duration}function cw(e,t){if(typeof t!="function")throw new Error;return function(){Ri(this,e).ease=t}}function fw(e){var t=this._id;return arguments.length?this.each(cw(t,e)):ni(this.node(),t).ease}function uw(e,t){return function(){var n=t.apply(this,arguments);if(typeof n!="function")throw new Error;Ri(this,e).ease=n}}function hw(e){if(typeof e!="function")throw new Error;return this.each(uw(this._id,e))}function dw(e){typeof e!="function"&&(e=ox(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=[],l,c=0;c<a;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&o.push(l);return new Qi(i,this._parents,this._name,this._id)}function pw(e){if(e._id!==this._id)throw new Error;for(var t=this._groups,n=e._groups,i=t.length,r=n.length,s=Math.min(i,r),a=new Array(i),o=0;o<s;++o)for(var l=t[o],c=n[o],f=l.length,u=a[o]=new Array(f),h,d=0;d<f;++d)(h=l[d]||c[d])&&(u[d]=h);for(;o<i;++o)a[o]=t[o];return new Qi(a,this._parents,this._name,this._id)}function mw(e){return(e+"").trim().split(/^|\s+/).every(function(t){var n=t.indexOf(".");return n>=0&&(t=t.slice(0,n)),!t||t==="start"})}function vw(e,t,n){var i,r,s=mw(t)?Hp:Ri;return function(){var a=s(this,e),o=a.on;o!==i&&(r=(i=o).copy()).on(t,n),a.on=r}}function _w(e,t){var n=this._id;return arguments.length<2?ni(this.node(),n).on.on(e):this.each(vw(n,e,t))}function gw(e){return function(){var t=this.parentNode;for(var n in this.__transition)if(+n!==e)return;t&&t.removeChild(this)}}function xw(){return this.on("end.remove",gw(this._id))}function yw(e){var t=this._name,n=this._id;typeof e!="function"&&(e=Fp(e));for(var i=this._groups,r=i.length,s=new Array(r),a=0;a<r;++a)for(var o=i[a],l=o.length,c=s[a]=new Array(l),f,u,h=0;h<l;++h)(f=o[h])&&(u=e.call(f,f.__data__,h,o))&&("__data__"in f&&(u.__data__=f.__data__),c[h]=u,cu(c[h],t,n,h,c,ni(f,n)));return new Qi(s,this._parents,t,n)}function Sw(e){var t=this._name,n=this._id;typeof e!="function"&&(e=ax(e));for(var i=this._groups,r=i.length,s=[],a=[],o=0;o<r;++o)for(var l=i[o],c=l.length,f,u=0;u<c;++u)if(f=l[u]){for(var h=e.call(f,f.__data__,u,l),d,v=ni(f,n),_=0,m=h.length;_<m;++_)(d=h[_])&&cu(d,t,n,_,h,v);s.push(h),a.push(f)}return new Qi(s,a,t,n)}var Mw=rl.prototype.constructor;function bw(){return new Mw(this._groups,this._parents)}function Tw(e,t){var n,i,r;return function(){var s=Sa(this,e),a=(this.style.removeProperty(e),Sa(this,e));return s===a?null:s===n&&a===i?r:r=t(n=s,i=a)}}function Cx(e){return function(){this.style.removeProperty(e)}}function Ew(e,t,n){var i,r=n+"",s;return function(){var a=Sa(this,e);return a===r?null:a===i?s:s=t(i=a,n)}}function ww(e,t,n){var i,r,s;return function(){var a=Sa(this,e),o=n(this),l=o+"";return o==null&&(l=o=(this.style.removeProperty(e),Sa(this,e))),a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o))}}function Aw(e,t){var n,i,r,s="style."+t,a="end."+s,o;return function(){var l=Ri(this,e),c=l.on,f=l.value[s]==null?o||(o=Cx(t)):void 0;(c!==n||r!==f)&&(i=(n=c).copy()).on(a,r=f),l.on=i}}function Cw(e,t,n){var i=(e+="")=="transform"?LE:Ax;return t==null?this.styleTween(e,Tw(e,i)).on("end.style."+e,Cx(e)):typeof t=="function"?this.styleTween(e,ww(e,i,zp(this,"style."+e,t))).each(Aw(this._id,e)):this.styleTween(e,Ew(e,i,t),n).on("end.style."+e,null)}function Rw(e,t,n){return function(i){this.style.setProperty(e,t.call(this,i),n)}}function Pw(e,t,n){var i,r;function s(){var a=t.apply(this,arguments);return a!==r&&(i=(r=a)&&Rw(e,a,n)),i}return s._value=t,s}function Lw(e,t,n){var i="style."+(e+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(t==null)return this.tween(i,null);if(typeof t!="function")throw new Error;return this.tween(i,Pw(e,t,n==null?"":n))}function Dw(e){return function(){this.textContent=e}}function Iw(e){return function(){var t=e(this);this.textContent=t==null?"":t}}function Nw(e){return this.tween("text",typeof e=="function"?Iw(zp(this,"text",e)):Dw(e==null?"":e+""))}function Fw(e){return function(t){this.textContent=e.call(this,t)}}function Uw(e){var t,n;function i(){var r=e.apply(this,arguments);return r!==n&&(t=(n=r)&&Fw(r)),t}return i._value=e,i}function Ow(e){var t="text";if(arguments.length<1)return(t=this.tween(t))&&t._value;if(e==null)return this.tween(t,null);if(typeof e!="function")throw new Error;return this.tween(t,Uw(e))}function Bw(){for(var e=this._name,t=this._id,n=Rx(),i=this._groups,r=i.length,s=0;s<r;++s)for(var a=i[s],o=a.length,l,c=0;c<o;++c)if(l=a[c]){var f=ni(l,t);cu(l,e,n,c,a,{time:f.time+f.delay+f.duration,delay:0,duration:f.duration,ease:f.ease})}return new Qi(i,this._parents,e,n)}function Hw(){var e,t,n=this,i=n._id,r=n.size();return new Promise(function(s,a){var o={value:a},l={value:function(){--r===0&&s()}};n.each(function(){var c=Ri(this,i),f=c.on;f!==e&&(t=(e=f).copy(),t._.cancel.push(o),t._.interrupt.push(o),t._.end.push(l)),c.on=t}),r===0&&s()})}var zw=0;function Qi(e,t,n,i){this._groups=e,this._parents=t,this._name=n,this._id=i}function Rx(){return++zw}var Ni=rl.prototype;Qi.prototype={constructor:Qi,select:yw,selectAll:Sw,selectChild:Ni.selectChild,selectChildren:Ni.selectChildren,filter:dw,merge:pw,selection:bw,transition:Bw,call:Ni.call,nodes:Ni.nodes,node:Ni.node,size:Ni.size,empty:Ni.empty,each:Ni.each,on:_w,attr:JE,attrTween:nw,style:Cw,styleTween:Lw,text:Nw,textTween:Ow,remove:xw,tween:WE,delay:sw,duration:lw,ease:fw,easeVarying:hw,end:Hw,[Symbol.iterator]:Ni[Symbol.iterator]};function Vw(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var Gw={time:null,delay:0,duration:250,ease:Vw};function kw(e,t){for(var n;!(n=e.__transition)||!(n=n[t]);)if(!(e=e.parentNode))throw new Error(`transition ${t} not found`);return n}function Ww(e){var t,n;e instanceof Qi?(t=e._id,e=e._name):(t=Rx(),(n=Gw).time=Bp(),e=e==null?null:e+"");for(var i=this._groups,r=i.length,s=0;s<r;++s)for(var a=i[s],o=a.length,l,c=0;c<o;++c)(l=a[c])&&cu(l,e,t,c,a,n||kw(l,t));return new Qi(i,this._parents,e,t)}rl.prototype.interrupt=VE;rl.prototype.transition=Ww;var Xw=Array.prototype,qw=Xw.slice;function Yw(e,t){return e-t}function $w(e){for(var t=0,n=e.length,i=e[n-1][1]*e[0][0]-e[n-1][0]*e[0][1];++t<n;)i+=e[t-1][1]*e[t][0]-e[t-1][0]*e[t][1];return i}const Bv=e=>()=>e;function Kw(e,t){for(var n=-1,i=t.length,r;++n<i;)if(r=Zw(e,t[n]))return r;return 0}function Zw(e,t){for(var n=t[0],i=t[1],r=-1,s=0,a=e.length,o=a-1;s<a;o=s++){var l=e[s],c=l[0],f=l[1],u=e[o],h=u[0],d=u[1];if(Jw(l,u,t))return 0;f>i!=d>i&&n<(h-c)*(i-f)/(d-f)+c&&(r=-r)}return r}function Jw(e,t,n){var i;return jw(e,t,n)&&Qw(e[i=+(e[0]===t[0])],n[i],t[i])}function jw(e,t,n){return(t[0]-e[0])*(n[1]-e[1])===(n[0]-e[0])*(t[1]-e[1])}function Qw(e,t,n){return e<=t&&t<=n||n<=t&&t<=e}function tA(){}var Fi=[[],[[[1,1.5],[.5,1]]],[[[1.5,1],[1,1.5]]],[[[1.5,1],[.5,1]]],[[[1,.5],[1.5,1]]],[[[1,1.5],[.5,1]],[[1,.5],[1.5,1]]],[[[1,.5],[1,1.5]]],[[[1,.5],[.5,1]]],[[[.5,1],[1,.5]]],[[[1,1.5],[1,.5]]],[[[.5,1],[1,.5]],[[1.5,1],[1,1.5]]],[[[1.5,1],[1,.5]]],[[[.5,1],[1.5,1]]],[[[1,1.5],[1.5,1]]],[[[.5,1],[1,1.5]]],[]];function MN(){var e=1,t=1,n=Eb,i=l;function r(c){var f=n(c);if(Array.isArray(f))f=f.slice().sort(Yw);else{const u=gb(c,eA);for(f=Mb(...Tb(u[0],u[1],f),f);f[f.length-1]>=u[1];)f.pop();for(;f[1]<u[0];)f.shift()}return f.map(u=>s(c,u))}function s(c,f){const u=f==null?NaN:+f;if(isNaN(u))throw new Error(`invalid value: ${f}`);var h=[],d=[];return a(c,u,function(v){i(v,c,u),$w(v)>0?h.push([v]):d.push(v)}),d.forEach(function(v){for(var _=0,m=h.length,p;_<m;++_)if(Kw((p=h[_])[0],v)!==-1){p.push(v);return}}),{type:"MultiPolygon",value:f,coordinates:h}}function a(c,f,u){var h=new Array,d=new Array,v,_,m,p,g,M;for(v=_=-1,p=Or(c[0],f),Fi[p<<1].forEach(S);++v<e-1;)m=p,p=Or(c[v+1],f),Fi[m|p<<1].forEach(S);for(Fi[p<<0].forEach(S);++_<t-1;){for(v=-1,p=Or(c[_*e+e],f),g=Or(c[_*e],f),Fi[p<<1|g<<2].forEach(S);++v<e-1;)m=p,p=Or(c[_*e+e+v+1],f),M=g,g=Or(c[_*e+v+1],f),Fi[m|p<<1|g<<2|M<<3].forEach(S);Fi[p|g<<3].forEach(S)}for(v=-1,g=c[_*e]>=f,Fi[g<<2].forEach(S);++v<e-1;)M=g,g=Or(c[_*e+v+1],f),Fi[g<<2|M<<3].forEach(S);Fi[g<<3].forEach(S);function S(E){var T=[E[0][0]+v,E[0][1]+_],C=[E[1][0]+v,E[1][1]+_],L=o(T),y=o(C),b,R;(b=d[L])?(R=h[y])?(delete d[b.end],delete h[R.start],b===R?(b.ring.push(C),u(b.ring)):h[b.start]=d[R.end]={start:b.start,end:R.end,ring:b.ring.concat(R.ring)}):(delete d[b.end],b.ring.push(C),d[b.end=y]=b):(b=h[y])?(R=d[L])?(delete h[b.start],delete d[R.end],b===R?(b.ring.push(C),u(b.ring)):h[R.start]=d[b.end]={start:R.start,end:b.end,ring:R.ring.concat(b.ring)}):(delete h[b.start],b.ring.unshift(T),h[b.start=L]=b):h[L]=d[y]={start:L,end:y,ring:[T,C]}}}function o(c){return c[0]*2+c[1]*(e+1)*4}function l(c,f,u){c.forEach(function(h){var d=h[0],v=h[1],_=d|0,m=v|0,p=Zu(f[m*e+_]);d>0&&d<e&&_===d&&(h[0]=Hv(d,Zu(f[m*e+_-1]),p,u)),v>0&&v<t&&m===v&&(h[1]=Hv(v,Zu(f[(m-1)*e+_]),p,u))})}return r.contour=s,r.size=function(c){if(!arguments.length)return[e,t];var f=Math.floor(c[0]),u=Math.floor(c[1]);if(!(f>=0&&u>=0))throw new Error("invalid size");return e=f,t=u,r},r.thresholds=function(c){return arguments.length?(n=typeof c=="function"?c:Array.isArray(c)?Bv(qw.call(c)):Bv(c),r):n},r.smooth=function(c){return arguments.length?(i=c?l:tA,r):i===l},r}function eA(e){return isFinite(e)?e:NaN}function Or(e,t){return e==null?!1:+e>=t}function Zu(e){return e==null||isNaN(e=+e)?-1/0:e}function Hv(e,t,n,i){const r=i-t,s=n-t,a=isFinite(r)||isFinite(s)?r/s:Math.sign(r)/Math.sign(s);return isNaN(a)?e:e+a-.5}function ao(e,t,n){this.k=e,this.x=t,this.y=n}ao.prototype={constructor:ao,scale:function(e){return e===1?this:new ao(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new ao(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};ao.prototype;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Dd=function(e,t){return Dd=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(n[r]=i[r])},Dd(e,t)};function ue(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Dd(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var nA=function(){function e(){this.firefox=!1,this.ie=!1,this.edge=!1,this.newEdge=!1,this.weChat=!1}return e}(),iA=function(){function e(){this.browser=new nA,this.node=!1,this.wxa=!1,this.worker=!1,this.svgSupported=!1,this.touchEventsSupported=!1,this.pointerEventsSupported=!1,this.domSupported=!1,this.transformSupported=!1,this.transform3dSupported=!1,this.hasGlobalWindow=typeof window!="undefined"}return e}(),ge=new iA;typeof wx=="object"&&typeof wx.getSystemInfoSync=="function"?(ge.wxa=!0,ge.touchEventsSupported=!0):typeof document=="undefined"&&typeof self!="undefined"?ge.worker=!0:!ge.hasGlobalWindow||"Deno"in window||typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Node.js")>-1?(ge.node=!0,ge.svgSupported=!0):rA(navigator.userAgent,ge);function rA(e,t){var n=t.browser,i=e.match(/Firefox\/([\d.]+)/),r=e.match(/MSIE\s([\d.]+)/)||e.match(/Trident\/.+?rv:(([\d.]+))/),s=e.match(/Edge?\/([\d.]+)/),a=/micromessenger/i.test(e);i&&(n.firefox=!0,n.version=i[1]),r&&(n.ie=!0,n.version=r[1]),s&&(n.edge=!0,n.version=s[1],n.newEdge=+s[1].split(".")[0]>18),a&&(n.weChat=!0),t.svgSupported=typeof SVGRect!="undefined",t.touchEventsSupported="ontouchstart"in window&&!n.ie&&!n.edge,t.pointerEventsSupported="onpointerdown"in window&&(n.edge||n.ie&&+n.version>=11);var o=t.domSupported=typeof document!="undefined";if(o){var l=document.documentElement.style;t.transform3dSupported=(n.ie&&"transition"in l||n.edge||"WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix||"MozPerspective"in l)&&!("OTransition"in l),t.transformSupported=t.transform3dSupported||n.ie&&+n.version>=9}}var Vp=12,sA="sans-serif",Cr=Vp+"px "+sA,aA=20,oA=100,lA="007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";function cA(e){var t={};if(typeof JSON=="undefined")return t;for(var n=0;n<e.length;n++){var i=String.fromCharCode(n+32),r=(e.charCodeAt(n)-aA)/oA;t[i]=r}return t}var fA=cA(lA),Es={createCanvas:function(){return typeof document!="undefined"&&document.createElement("canvas")},measureText:function(){var e,t;return function(n,i){if(!e){var r=Es.createCanvas();e=r&&r.getContext("2d")}if(e)return t!==i&&(t=e.font=i||Cr),e.measureText(n);n=n||"",i=i||Cr;var s=/((?:\d+)?\.?\d*)px/.exec(i),a=s&&+s[1]||Vp,o=0;if(i.indexOf("mono")>=0)o=a*n.length;else for(var l=0;l<n.length;l++){var c=fA[n[l]];o+=c==null?a:c*a}return{width:o}}}(),loadImage:function(e,t,n){var i=new Image;return i.onload=t,i.onerror=n,i.src=e,i}},Px=uu(["Function","RegExp","Date","Error","CanvasGradient","CanvasPattern","Image","Canvas"],function(e,t){return e["[object "+t+"]"]=!0,e},{}),Lx=uu(["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64"],function(e,t){return e["[object "+t+"Array]"]=!0,e},{}),al=Object.prototype.toString,fu=Array.prototype,uA=fu.forEach,hA=fu.filter,Gp=fu.slice,dA=fu.map,zv=function(){}.constructor,bl=zv?zv.prototype:null,kp="__proto__",pA=2311;function Dx(){return pA++}function Wp(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];typeof console!="undefined"&&console.error.apply(console,e)}function ba(e){if(e==null||typeof e!="object")return e;var t=e,n=al.call(e);if(n==="[object Array]"){if(!To(e)){t=[];for(var i=0,r=e.length;i<r;i++)t[i]=ba(e[i])}}else if(Lx[n]){if(!To(e)){var s=e.constructor;if(s.from)t=s.from(e);else{t=new s(e.length);for(var i=0,r=e.length;i<r;i++)t[i]=e[i]}}}else if(!Px[n]&&!To(e)&&!Id(e)){t={};for(var a in e)e.hasOwnProperty(a)&&a!==kp&&(t[a]=ba(e[a]))}return t}function oo(e,t,n){if(!gr(t)||!gr(e))return n?ba(t):e;for(var i in t)if(t.hasOwnProperty(i)&&i!==kp){var r=e[i],s=t[i];gr(s)&&gr(r)&&!Yo(s)&&!Yo(r)&&!Id(s)&&!Id(r)&&!Gv(s)&&!Gv(r)&&!To(s)&&!To(r)?oo(r,s,n):(n||!(i in e))&&(e[i]=ba(t[i]))}return e}function _e(e,t){if(Object.assign)Object.assign(e,t);else for(var n in t)t.hasOwnProperty(n)&&n!==kp&&(e[n]=t[n]);return e}function Ps(e,t,n){for(var i=xn(t),r=0,s=i.length;r<s;r++){var a=i[r];e[a]==null&&(e[a]=t[a])}return e}function di(e,t){if(e){if(e.indexOf)return e.indexOf(t);for(var n=0,i=e.length;n<i;n++)if(e[n]===t)return n}return-1}function bN(e,t){var n=e.prototype;function i(){}i.prototype=t.prototype,e.prototype=new i;for(var r in n)n.hasOwnProperty(r)&&(e.prototype[r]=n[r]);e.prototype.constructor=e,e.superClass=t}function Ix(e,t,n){if(e="prototype"in e?e.prototype:e,t="prototype"in t?t.prototype:t,Object.getOwnPropertyNames)for(var i=Object.getOwnPropertyNames(t),r=0;r<i.length;r++){var s=i[r];s!=="constructor"&&e[s]==null&&(e[s]=t[s])}else Ps(e,t)}function Ti(e){return!e||typeof e=="string"?!1:typeof e.length=="number"}function ln(e,t,n){if(e&&t)if(e.forEach&&e.forEach===uA)e.forEach(t,n);else if(e.length===+e.length)for(var i=0,r=e.length;i<r;i++)t.call(n,e[i],i,e);else for(var s in e)e.hasOwnProperty(s)&&t.call(n,e[s],s,e)}function Ta(e,t,n){if(!e)return[];if(!t)return Nx(e);if(e.map&&e.map===dA)return e.map(t,n);for(var i=[],r=0,s=e.length;r<s;r++)i.push(t.call(n,e[r],r,e));return i}function uu(e,t,n,i){if(e&&t){for(var r=0,s=e.length;r<s;r++)n=t.call(i,n,e[r],r,e);return n}}function Vv(e,t,n){if(!e)return[];if(!t)return Nx(e);if(e.filter&&e.filter===hA)return e.filter(t,n);for(var i=[],r=0,s=e.length;r<s;r++)t.call(n,e[r],r,e)&&i.push(e[r]);return i}function TN(e,t,n){if(e&&t){for(var i=0,r=e.length;i<r;i++)if(t.call(n,e[i],i,e))return e[i]}}function xn(e){if(!e)return[];if(Object.keys)return Object.keys(e);var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t}function mA(e,t){for(var n=[],i=2;i<arguments.length;i++)n[i-2]=arguments[i];return function(){return e.apply(t,n.concat(Gp.call(arguments)))}}var EN=bl&&gs(bl.bind)?bl.call.bind(bl.bind):mA;function wN(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return function(){return e.apply(this,t.concat(Gp.call(arguments)))}}function Yo(e){return Array.isArray?Array.isArray(e):al.call(e)==="[object Array]"}function gs(e){return typeof e=="function"}function Xc(e){return typeof e=="string"}function AN(e){return al.call(e)==="[object String]"}function xc(e){return typeof e=="number"}function gr(e){var t=typeof e;return t==="function"||!!e&&t==="object"}function Gv(e){return!!Px[al.call(e)]}function vA(e){return!!Lx[al.call(e)]}function Id(e){return typeof e=="object"&&typeof e.nodeType=="number"&&typeof e.ownerDocument=="object"}function hu(e){return e.colorStops!=null}function _A(e){return e.image!=null}function gA(e){return e!==e}function CN(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var n=0,i=e.length;n<i;n++)if(e[n]!=null)return e[n]}function Pn(e,t){return e!=null?e:t}function yc(e,t,n){return e!=null?e:t!=null?t:n}function Nx(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return Gp.apply(e,t)}function xA(e){if(typeof e=="number")return[e,e,e,e];var t=e.length;return t===2?[e[0],e[1],e[0],e[1]]:t===3?[e[0],e[1],e[2],e[1]]:e}function RN(e,t){if(!e)throw new Error(t)}function lo(e){return e==null?null:typeof e.trim=="function"?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}var Fx="__ec_primitive__";function PN(e){e[Fx]=!0}function To(e){return e[Fx]}var yA=function(){function e(){this.data={}}return e.prototype.delete=function(t){var n=this.has(t);return n&&delete this.data[t],n},e.prototype.has=function(t){return this.data.hasOwnProperty(t)},e.prototype.get=function(t){return this.data[t]},e.prototype.set=function(t,n){return this.data[t]=n,this},e.prototype.keys=function(){return xn(this.data)},e.prototype.forEach=function(t){var n=this.data;for(var i in n)n.hasOwnProperty(i)&&t(n[i],i)},e}(),Ux=typeof Map=="function";function SA(){return Ux?new Map:new yA}var MA=function(){function e(t){var n=Yo(t);this.data=SA();var i=this;t instanceof e?t.each(r):t&&ln(t,r);function r(s,a){n?i.set(s,a):i.set(a,s)}}return e.prototype.hasKey=function(t){return this.data.has(t)},e.prototype.get=function(t){return this.data.get(t)},e.prototype.set=function(t,n){return this.data.set(t,n),n},e.prototype.each=function(t,n){this.data.forEach(function(i,r){t.call(n,i,r)})},e.prototype.keys=function(){var t=this.data.keys();return Ux?Array.from(t):t},e.prototype.removeKey=function(t){this.data.delete(t)},e}();function LN(e){return new MA(e)}function DN(e,t){for(var n=new e.constructor(e.length+t.length),i=0;i<e.length;i++)n[i]=e[i];for(var r=e.length,i=0;i<t.length;i++)n[i+r]=t[i];return n}function du(e,t){var n;if(Object.create)n=Object.create(e);else{var i=function(){};i.prototype=e,n=new i}return t&&_e(n,t),n}function Ox(e){var t=e.style;t.webkitUserSelect="none",t.userSelect="none",t.webkitTapHighlightColor="rgba(0,0,0,0)",t["-webkit-touch-callout"]="none"}function IN(e,t){return e.hasOwnProperty(t)}function ma(){}var bA=180/Math.PI;function Ia(e,t){return e==null&&(e=0),t==null&&(t=0),[e,t]}function TA(e){return[e[0],e[1]]}function kv(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}function EA(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e}function wA(e){return Math.sqrt(AA(e))}function AA(e){return e[0]*e[0]+e[1]*e[1]}function Ju(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e}function CA(e,t){var n=wA(t);return n===0?(e[0]=0,e[1]=0):(e[0]=t[0]/n,e[1]=t[1]/n),e}function Nd(e,t){return Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1]))}var RA=Nd;function PA(e,t){return(e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])}var va=PA;function Eo(e,t,n){var i=t[0],r=t[1];return e[0]=n[0]*i+n[2]*r+n[4],e[1]=n[1]*i+n[3]*r+n[5],e}function na(e,t,n){return e[0]=Math.min(t[0],n[0]),e[1]=Math.min(t[1],n[1]),e}function ia(e,t,n){return e[0]=Math.max(t[0],n[0]),e[1]=Math.max(t[1],n[1]),e}var Ns=function(){function e(t,n){this.target=t,this.topTarget=n&&n.topTarget}return e}(),LA=function(){function e(t){this.handler=t,t.on("mousedown",this._dragStart,this),t.on("mousemove",this._drag,this),t.on("mouseup",this._dragEnd,this)}return e.prototype._dragStart=function(t){for(var n=t.target;n&&!n.draggable;)n=n.parent||n.__hostTarget;n&&(this._draggingTarget=n,n.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.handler.dispatchToElement(new Ns(n,t),"dragstart",t.event))},e.prototype._drag=function(t){var n=this._draggingTarget;if(n){var i=t.offsetX,r=t.offsetY,s=i-this._x,a=r-this._y;this._x=i,this._y=r,n.drift(s,a,t),this.handler.dispatchToElement(new Ns(n,t),"drag",t.event);var o=this.handler.findHover(i,r,n).target,l=this._dropTarget;this._dropTarget=o,n!==o&&(l&&o!==l&&this.handler.dispatchToElement(new Ns(l,t),"dragleave",t.event),o&&o!==l&&this.handler.dispatchToElement(new Ns(o,t),"dragenter",t.event))}},e.prototype._dragEnd=function(t){var n=this._draggingTarget;n&&(n.dragging=!1),this.handler.dispatchToElement(new Ns(n,t),"dragend",t.event),this._dropTarget&&this.handler.dispatchToElement(new Ns(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null},e}(),Na=function(){function e(t){t&&(this._$eventProcessor=t)}return e.prototype.on=function(t,n,i,r){this._$handlers||(this._$handlers={});var s=this._$handlers;if(typeof n=="function"&&(r=i,i=n,n=null),!i||!t)return this;var a=this._$eventProcessor;n!=null&&a&&a.normalizeQuery&&(n=a.normalizeQuery(n)),s[t]||(s[t]=[]);for(var o=0;o<s[t].length;o++)if(s[t][o].h===i)return this;var l={h:i,query:n,ctx:r||this,callAtLast:i.zrEventfulCallAtLast},c=s[t].length-1,f=s[t][c];return f&&f.callAtLast?s[t].splice(c,0,l):s[t].push(l),this},e.prototype.isSilent=function(t){var n=this._$handlers;return!n||!n[t]||!n[t].length},e.prototype.off=function(t,n){var i=this._$handlers;if(!i)return this;if(!t)return this._$handlers={},this;if(n){if(i[t]){for(var r=[],s=0,a=i[t].length;s<a;s++)i[t][s].h!==n&&r.push(i[t][s]);i[t]=r}i[t]&&i[t].length===0&&delete i[t]}else delete i[t];return this},e.prototype.trigger=function(t){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];if(!this._$handlers)return this;var r=this._$handlers[t],s=this._$eventProcessor;if(r)for(var a=n.length,o=r.length,l=0;l<o;l++){var c=r[l];if(!(s&&s.filter&&c.query!=null&&!s.filter(t,c.query)))switch(a){case 0:c.h.call(c.ctx);break;case 1:c.h.call(c.ctx,n[0]);break;case 2:c.h.call(c.ctx,n[0],n[1]);break;default:c.h.apply(c.ctx,n);break}}return s&&s.afterTrigger&&s.afterTrigger(t),this},e.prototype.triggerWithContext=function(t){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];if(!this._$handlers)return this;var r=this._$handlers[t],s=this._$eventProcessor;if(r)for(var a=n.length,o=n[a-1],l=r.length,c=0;c<l;c++){var f=r[c];if(!(s&&s.filter&&f.query!=null&&!s.filter(t,f.query)))switch(a){case 0:f.h.call(o);break;case 1:f.h.call(o,n[0]);break;case 2:f.h.call(o,n[0],n[1]);break;default:f.h.apply(o,n.slice(1,a-1));break}}return s&&s.afterTrigger&&s.afterTrigger(t),this},e}(),DA=Math.log(2);function Fd(e,t,n,i,r,s){var a=i+"-"+r,o=e.length;if(s.hasOwnProperty(a))return s[a];if(t===1){var l=Math.round(Math.log((1<<o)-1&~r)/DA);return e[n][l]}for(var c=i|1<<n,f=n+1;i&1<<f;)f++;for(var u=0,h=0,d=0;h<o;h++){var v=1<<h;v&r||(u+=(d%2?-1:1)*e[n][h]*Fd(e,t-1,f,c,r|v,s),d++)}return s[a]=u,u}function Wv(e,t){var n=[[e[0],e[1],1,0,0,0,-t[0]*e[0],-t[0]*e[1]],[0,0,0,e[0],e[1],1,-t[1]*e[0],-t[1]*e[1]],[e[2],e[3],1,0,0,0,-t[2]*e[2],-t[2]*e[3]],[0,0,0,e[2],e[3],1,-t[3]*e[2],-t[3]*e[3]],[e[4],e[5],1,0,0,0,-t[4]*e[4],-t[4]*e[5]],[0,0,0,e[4],e[5],1,-t[5]*e[4],-t[5]*e[5]],[e[6],e[7],1,0,0,0,-t[6]*e[6],-t[6]*e[7]],[0,0,0,e[6],e[7],1,-t[7]*e[6],-t[7]*e[7]]],i={},r=Fd(n,8,0,0,0,i);if(r!==0){for(var s=[],a=0;a<8;a++)for(var o=0;o<8;o++)s[o]==null&&(s[o]=0),s[o]+=((a+o)%2?-1:1)*Fd(n,7,a===0?1:0,1<<a,1<<o,i)/r*t[a];return function(l,c,f){var u=c*s[6]+f*s[7]+1;l[0]=(c*s[0]+f*s[1]+s[2])/u,l[1]=(c*s[3]+f*s[4]+s[5])/u}}}var qc="___zrEVENTSAVED",ju=[];function NN(e,t,n,i,r){return Ud(ju,t,i,r,!0)&&Ud(e,n,ju[0],ju[1])}function FN(e,t){e&&n(e),t&&n(t);function n(i){var r=i[qc];r&&(r.clearMarkers&&r.clearMarkers(),delete i[qc])}}function Ud(e,t,n,i,r){if(t.getBoundingClientRect&&ge.domSupported&&!Bx(t)){var s=t[qc]||(t[qc]={}),a=IA(t,s),o=NA(a,s,r);if(o)return o(e,n,i),!0}return!1}function IA(e,t){var n=t.markers;if(n)return n;n=t.markers=[];for(var i=["left","right"],r=["top","bottom"],s=0;s<4;s++){var a=document.createElement("div"),o=a.style,l=s%2,c=(s>>1)%2;o.cssText=["position: absolute","visibility: hidden","padding: 0","margin: 0","border-width: 0","user-select: none","width:0","height:0",i[l]+":0",r[c]+":0",i[1-l]+":auto",r[1-c]+":auto",""].join("!important;"),e.appendChild(a),n.push(a)}return t.clearMarkers=function(){ln(n,function(f){f.parentNode&&f.parentNode.removeChild(f)})},n}function NA(e,t,n){for(var i=n?"invTrans":"trans",r=t[i],s=t.srcCoords,a=[],o=[],l=!0,c=0;c<4;c++){var f=e[c].getBoundingClientRect(),u=2*c,h=f.left,d=f.top;a.push(h,d),l=l&&s&&h===s[u]&&d===s[u+1],o.push(e[c].offsetLeft,e[c].offsetTop)}return l&&r?r:(t.srcCoords=a,t[i]=n?Wv(o,a):Wv(a,o))}function Bx(e){return e.nodeName.toUpperCase()==="CANVAS"}var FA=/([&<>"'])/g,UA={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function UN(e){return e==null?"":(e+"").replace(FA,function(t,n){return UA[n]})}var OA=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Qu=[],BA=ge.browser.firefox&&+ge.browser.version.split(".")[0]<39;function Od(e,t,n,i){return n=n||{},i?Xv(e,t,n):BA&&t.layerX!=null&&t.layerX!==t.offsetX?(n.zrX=t.layerX,n.zrY=t.layerY):t.offsetX!=null?(n.zrX=t.offsetX,n.zrY=t.offsetY):Xv(e,t,n),n}function Xv(e,t,n){if(ge.domSupported&&e.getBoundingClientRect){var i=t.clientX,r=t.clientY;if(Bx(e)){var s=e.getBoundingClientRect();n.zrX=i-s.left,n.zrY=r-s.top;return}else if(Ud(Qu,e,i,r)){n.zrX=Qu[0],n.zrY=Qu[1];return}}n.zrX=n.zrY=0}function Xp(e){return e||window.event}function Hn(e,t,n){if(t=Xp(t),t.zrX!=null)return t;var i=t.type,r=i&&i.indexOf("touch")>=0;if(r){var a=i!=="touchend"?t.targetTouches[0]:t.changedTouches[0];a&&Od(e,a,t,n)}else{Od(e,t,t,n);var s=HA(t);t.zrDelta=s?s/120:-(t.detail||0)/3}var o=t.button;return t.which==null&&o!==void 0&&OA.test(t.type)&&(t.which=o&1?1:o&2?3:o&4?2:0),t}function HA(e){var t=e.wheelDelta;if(t)return t;var n=e.deltaX,i=e.deltaY;if(n==null||i==null)return t;var r=Math.abs(i!==0?i:n),s=i>0?-1:i<0?1:n>0?-1:1;return 3*r*s}function zA(e,t,n,i){e.addEventListener(t,n,i)}function VA(e,t,n,i){e.removeEventListener(t,n,i)}var GA=function(e){e.preventDefault(),e.stopPropagation(),e.cancelBubble=!0};function ON(e){return e.which===2||e.which===3}var kA=function(){function e(){this._track=[]}return e.prototype.recognize=function(t,n,i){return this._doTrack(t,n,i),this._recognize(t)},e.prototype.clear=function(){return this._track.length=0,this},e.prototype._doTrack=function(t,n,i){var r=t.touches;if(r){for(var s={points:[],touches:[],target:n,event:t},a=0,o=r.length;a<o;a++){var l=r[a],c=Od(i,l,{});s.points.push([c.zrX,c.zrY]),s.touches.push(l)}this._track.push(s)}},e.prototype._recognize=function(t){for(var n in th)if(th.hasOwnProperty(n)){var i=th[n](this._track,t);if(i)return i}},e}();function qv(e){var t=e[1][0]-e[0][0],n=e[1][1]-e[0][1];return Math.sqrt(t*t+n*n)}function WA(e){return[(e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2]}var th={pinch:function(e,t){var n=e.length;if(n){var i=(e[n-1]||{}).points,r=(e[n-2]||{}).points||i;if(r&&r.length>1&&i&&i.length>1){var s=qv(i)/qv(r);!isFinite(s)&&(s=1),t.pinchScale=s;var a=WA(i);return t.pinchX=a[0],t.pinchY=a[1],{type:"pinch",target:e[0].target,event:t}}}}};function wo(){return[1,0,0,1,0,0]}function XA(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e}function qA(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function eh(e,t,n){var i=t[0]*n[0]+t[2]*n[1],r=t[1]*n[0]+t[3]*n[1],s=t[0]*n[2]+t[2]*n[3],a=t[1]*n[2]+t[3]*n[3],o=t[0]*n[4]+t[2]*n[5]+t[4],l=t[1]*n[4]+t[3]*n[5]+t[5];return e[0]=i,e[1]=r,e[2]=s,e[3]=a,e[4]=o,e[5]=l,e}function Yv(e,t,n){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4]+n[0],e[5]=t[5]+n[1],e}function YA(e,t,n,i){i===void 0&&(i=[0,0]);var r=t[0],s=t[2],a=t[4],o=t[1],l=t[3],c=t[5],f=Math.sin(n),u=Math.cos(n);return e[0]=r*u+o*f,e[1]=-r*f+o*u,e[2]=s*u+l*f,e[3]=-s*f+u*l,e[4]=u*(a-i[0])+f*(c-i[1])+i[0],e[5]=u*(c-i[1])-f*(a-i[0])+i[1],e}function $A(e,t,n){var i=n[0],r=n[1];return e[0]=t[0]*i,e[1]=t[1]*r,e[2]=t[2]*i,e[3]=t[3]*r,e[4]=t[4]*i,e[5]=t[5]*r,e}function Hx(e,t){var n=t[0],i=t[2],r=t[4],s=t[1],a=t[3],o=t[5],l=n*a-s*i;return l?(l=1/l,e[0]=a*l,e[1]=-s*l,e[2]=-i*l,e[3]=n*l,e[4]=(i*o-a*r)*l,e[5]=(s*r-n*o)*l,e):null}var be=function(){function e(t,n){this.x=t||0,this.y=n||0}return e.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},e.prototype.clone=function(){return new e(this.x,this.y)},e.prototype.set=function(t,n){return this.x=t,this.y=n,this},e.prototype.equal=function(t){return t.x===this.x&&t.y===this.y},e.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},e.prototype.scale=function(t){this.x*=t,this.y*=t},e.prototype.scaleAndAdd=function(t,n){this.x+=t.x*n,this.y+=t.y*n},e.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},e.prototype.dot=function(t){return this.x*t.x+this.y*t.y},e.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},e.prototype.lenSquare=function(){return this.x*this.x+this.y*this.y},e.prototype.normalize=function(){var t=this.len();return this.x/=t,this.y/=t,this},e.prototype.distance=function(t){var n=this.x-t.x,i=this.y-t.y;return Math.sqrt(n*n+i*i)},e.prototype.distanceSquare=function(t){var n=this.x-t.x,i=this.y-t.y;return n*n+i*i},e.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},e.prototype.transform=function(t){if(t){var n=this.x,i=this.y;return this.x=t[0]*n+t[2]*i+t[4],this.y=t[1]*n+t[3]*i+t[5],this}},e.prototype.toArray=function(t){return t[0]=this.x,t[1]=this.y,t},e.prototype.fromArray=function(t){this.x=t[0],this.y=t[1]},e.set=function(t,n,i){t.x=n,t.y=i},e.copy=function(t,n){t.x=n.x,t.y=n.y},e.len=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},e.lenSquare=function(t){return t.x*t.x+t.y*t.y},e.dot=function(t,n){return t.x*n.x+t.y*n.y},e.add=function(t,n,i){t.x=n.x+i.x,t.y=n.y+i.y},e.sub=function(t,n,i){t.x=n.x-i.x,t.y=n.y-i.y},e.scale=function(t,n,i){t.x=n.x*i,t.y=n.y*i},e.scaleAndAdd=function(t,n,i,r){t.x=n.x+i.x*r,t.y=n.y+i.y*r},e.lerp=function(t,n,i,r){var s=1-r;t.x=s*n.x+r*i.x,t.y=s*n.y+r*i.y},e}(),hs=Math.min,ra=Math.max,Bd=Math.abs,$v=["x","y"],KA=["width","height"],Br=new be,Hr=new be,zr=new be,Vr=new be,pn=zx(),co=pn.minTv,Hd=pn.maxTv,Ao=[0,0],ce=function(){function e(t,n,i,r){e.set(this,t,n,i,r)}return e.set=function(t,n,i,r,s){return r<0&&(n=n+r,r=-r),s<0&&(i=i+s,s=-s),t.x=n,t.y=i,t.width=r,t.height=s,t},e.prototype.union=function(t){var n=hs(t.x,this.x),i=hs(t.y,this.y);isFinite(this.x)&&isFinite(this.width)?this.width=ra(t.x+t.width,this.x+this.width)-n:this.width=t.width,isFinite(this.y)&&isFinite(this.height)?this.height=ra(t.y+t.height,this.y+this.height)-i:this.height=t.height,this.x=n,this.y=i},e.prototype.applyTransform=function(t){e.applyTransform(this,this,t)},e.prototype.calculateTransform=function(t){var n=this,i=t.width/n.width,r=t.height/n.height,s=wo();return Yv(s,s,[-n.x,-n.y]),$A(s,s,[i,r]),Yv(s,s,[t.x,t.y]),s},e.prototype.intersect=function(t,n,i){return e.intersect(this,t,n,i)},e.intersect=function(t,n,i,r){i&&be.set(i,0,0);var s=r&&r.outIntersectRect||null,a=r&&r.clamp;if(s&&(s.x=s.y=s.width=s.height=NaN),!t||!n)return!1;t instanceof e||(t=e.set(ZA,t.x,t.y,t.width,t.height)),n instanceof e||(n=e.set(JA,n.x,n.y,n.width,n.height));var o=!!i;pn.reset(r,o);var l=pn.touchThreshold,c=t.x+l,f=t.x+t.width-l,u=t.y+l,h=t.y+t.height-l,d=n.x+l,v=n.x+n.width-l,_=n.y+l,m=n.y+n.height-l;if(c>f||u>h||d>v||_>m)return!1;var p=!(f<d||v<c||h<_||m<u);return(o||s)&&(Ao[0]=1/0,Ao[1]=0,Kv(c,f,d,v,0,o,s,a),Kv(u,h,_,m,1,o,s,a),o&&be.copy(i,p?pn.useDir?pn.dirMinTv:co:Hd)),p},e.contain=function(t,n,i){return n>=t.x&&n<=t.x+t.width&&i>=t.y&&i<=t.y+t.height},e.prototype.contain=function(t,n){return e.contain(this,t,n)},e.prototype.clone=function(){return new e(this.x,this.y,this.width,this.height)},e.prototype.copy=function(t){e.copy(this,t)},e.prototype.plain=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},e.prototype.isFinite=function(){return isFinite(this.x)&&isFinite(this.y)&&isFinite(this.width)&&isFinite(this.height)},e.prototype.isZero=function(){return this.width===0||this.height===0},e.create=function(t){return new e(t.x,t.y,t.width,t.height)},e.copy=function(t,n){return t.x=n.x,t.y=n.y,t.width=n.width,t.height=n.height,t},e.applyTransform=function(t,n,i){if(!i){t!==n&&e.copy(t,n);return}if(i[1]<1e-5&&i[1]>-1e-5&&i[2]<1e-5&&i[2]>-1e-5){var r=i[0],s=i[3],a=i[4],o=i[5];t.x=n.x*r+a,t.y=n.y*s+o,t.width=n.width*r,t.height=n.height*s,t.width<0&&(t.x+=t.width,t.width=-t.width),t.height<0&&(t.y+=t.height,t.height=-t.height);return}Br.x=zr.x=n.x,Br.y=Vr.y=n.y,Hr.x=Vr.x=n.x+n.width,Hr.y=zr.y=n.y+n.height,Br.transform(i),Vr.transform(i),Hr.transform(i),zr.transform(i),t.x=hs(Br.x,Hr.x,zr.x,Vr.x),t.y=hs(Br.y,Hr.y,zr.y,Vr.y);var l=ra(Br.x,Hr.x,zr.x,Vr.x),c=ra(Br.y,Hr.y,zr.y,Vr.y);t.width=l-t.x,t.height=c-t.y},e}(),ZA=new ce(0,0,0,0),JA=new ce(0,0,0,0);function Kv(e,t,n,i,r,s,a,o){var l=Bd(t-n),c=Bd(i-e),f=hs(l,c),u=$v[r],h=$v[1-r],d=KA[r];t<n||i<e?l<c?(s&&(Hd[u]=-l),o&&(a[u]=t,a[d]=0)):(s&&(Hd[u]=c),o&&(a[u]=e,a[d]=0)):(a&&(a[u]=ra(e,n),a[d]=hs(t,i)-a[u]),s&&(f<Ao[0]||pn.useDir)&&(Ao[0]=hs(f,Ao[0]),(l<c||!pn.bidirectional)&&(co[u]=l,co[h]=0,pn.useDir&&pn.calcDirMTV()),(l>=c||!pn.bidirectional)&&(co[u]=-c,co[h]=0,pn.useDir&&pn.calcDirMTV())))}function zx(){var e=0,t=new be,n=new be,i={minTv:new be,maxTv:new be,useDir:!1,dirMinTv:new be,touchThreshold:0,bidirectional:!0,negativeSize:!1,reset:function(s,a){i.touchThreshold=0,s&&s.touchThreshold!=null&&(i.touchThreshold=ra(0,s.touchThreshold)),i.negativeSize=!1,a&&(i.minTv.set(1/0,1/0),i.maxTv.set(0,0),i.useDir=!1,s&&s.direction!=null&&(i.useDir=!0,i.dirMinTv.copy(i.minTv),n.copy(i.minTv),e=s.direction,i.bidirectional=s.bidirectional==null||!!s.bidirectional,i.bidirectional||t.set(Math.cos(e),Math.sin(e))))},calcDirMTV:function(){var s=i.minTv,a=i.dirMinTv,o=s.y*s.y+s.x*s.x,l=Math.sin(e),c=Math.cos(e),f=l*s.y+c*s.x;if(r(f)){r(s.x)&&r(s.y)&&a.set(0,0);return}if(n.x=o*c/f,n.y=o*l/f,r(n.x)&&r(n.y)){a.set(0,0);return}(i.bidirectional||t.dot(n)>0)&&n.len()<a.len()&&a.copy(n)}};function r(s){return Bd(s)<1e-10}return i}var Vx="silent";function jA(e,t,n){return{type:e,event:n,target:t.target,topTarget:t.topTarget,cancelBubble:!1,offsetX:n.zrX,offsetY:n.zrY,gestureEvent:n.gestureEvent,pinchX:n.pinchX,pinchY:n.pinchY,pinchScale:n.pinchScale,wheelDelta:n.zrDelta,zrByTouch:n.zrByTouch,which:n.which,stop:QA}}function QA(){GA(this.event)}var tC=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.handler=null,n}return t.prototype.dispose=function(){},t.prototype.setCursor=function(){},t}(Na),Wa=function(){function e(t,n){this.x=t,this.y=n}return e}(),eC=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],nh=new ce(0,0,0,0),Gx=function(e){ue(t,e);function t(n,i,r,s,a){var o=e.call(this)||this;return o._hovered=new Wa(0,0),o.storage=n,o.painter=i,o.painterRoot=s,o._pointerSize=a,r=r||new tC,o.proxy=null,o.setHandlerProxy(r),o._draggingMgr=new LA(o),o}return t.prototype.setHandlerProxy=function(n){this.proxy&&this.proxy.dispose(),n&&(ln(eC,function(i){n.on&&n.on(i,this[i],this)},this),n.handler=this),this.proxy=n},t.prototype.mousemove=function(n){var i=n.zrX,r=n.zrY,s=kx(this,i,r),a=this._hovered,o=a.target;o&&!o.__zr&&(a=this.findHover(a.x,a.y),o=a.target);var l=this._hovered=s?new Wa(i,r):this.findHover(i,r),c=l.target,f=this.proxy;f.setCursor&&f.setCursor(c?c.cursor:"default"),o&&c!==o&&this.dispatchToElement(a,"mouseout",n),this.dispatchToElement(l,"mousemove",n),c&&c!==o&&this.dispatchToElement(l,"mouseover",n)},t.prototype.mouseout=function(n){var i=n.zrEventControl;i!=="only_globalout"&&this.dispatchToElement(this._hovered,"mouseout",n),i!=="no_globalout"&&this.trigger("globalout",{type:"globalout",event:n})},t.prototype.resize=function(){this._hovered=new Wa(0,0)},t.prototype.dispatch=function(n,i){var r=this[n];r&&r.call(this,i)},t.prototype.dispose=function(){this.proxy.dispose(),this.storage=null,this.proxy=null,this.painter=null},t.prototype.setCursorStyle=function(n){var i=this.proxy;i.setCursor&&i.setCursor(n)},t.prototype.dispatchToElement=function(n,i,r){n=n||{};var s=n.target;if(!(s&&s.silent)){for(var a="on"+i,o=jA(i,n,r);s&&(s[a]&&(o.cancelBubble=!!s[a].call(s,o)),s.trigger(i,o),s=s.__hostTarget?s.__hostTarget:s.parent,!o.cancelBubble););o.cancelBubble||(this.trigger(i,o),this.painter&&this.painter.eachOtherLayer&&this.painter.eachOtherLayer(function(l){typeof l[a]=="function"&&l[a].call(l,o),l.trigger&&l.trigger(i,o)}))}},t.prototype.findHover=function(n,i,r){var s=this.storage.getDisplayList(),a=new Wa(n,i);if(Zv(s,a,n,i,r),this._pointerSize&&!a.target){for(var o=[],l=this._pointerSize,c=l/2,f=new ce(n-c,i-c,l,l),u=s.length-1;u>=0;u--){var h=s[u];h!==r&&!h.ignore&&!h.ignoreCoarsePointer&&(!h.parent||!h.parent.ignoreCoarsePointer)&&(nh.copy(h.getBoundingRect()),h.transform&&nh.applyTransform(h.transform),nh.intersect(f)&&o.push(h))}if(o.length)for(var d=4,v=Math.PI/12,_=Math.PI*2,m=0;m<c;m+=d)for(var p=0;p<_;p+=v){var g=n+m*Math.cos(p),M=i+m*Math.sin(p);if(Zv(o,a,g,M,r),a.target)return a}}return a},t.prototype.processGesture=function(n,i){this._gestureMgr||(this._gestureMgr=new kA);var r=this._gestureMgr;i==="start"&&r.clear();var s=r.recognize(n,this.findHover(n.zrX,n.zrY,null).target,this.proxy.dom);if(i==="end"&&r.clear(),s){var a=s.type;n.gestureEvent=a;var o=new Wa;o.target=s.target,this.dispatchToElement(o,a,s.event)}},t}(Na);ln(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(e){Gx.prototype[e]=function(t){var n=t.zrX,i=t.zrY,r=kx(this,n,i),s,a;if((e!=="mouseup"||!r)&&(s=this.findHover(n,i),a=s.target),e==="mousedown")this._downEl=a,this._downPoint=[t.zrX,t.zrY],this._upEl=a;else if(e==="mouseup")this._upEl=a;else if(e==="click"){if(this._downEl!==this._upEl||!this._downPoint||RA(this._downPoint,[t.zrX,t.zrY])>4)return;this._downPoint=null}this.dispatchToElement(s,e,t)}});function nC(e,t,n){if(e[e.rectHover?"rectContain":"contain"](t,n)){for(var i=e,r=void 0,s=!1;i;){if(i.ignoreClip&&(s=!0),!s){var a=i.getClipPath();if(a&&!a.contain(t,n))return!1}i.silent&&(r=!0);var o=i.__hostTarget;i=o?i.ignoreHostSilent?null:o:i.parent}return r?Vx:!0}return!1}function Zv(e,t,n,i,r){for(var s=e.length-1;s>=0;s--){var a=e[s],o=void 0;if(a!==r&&!a.ignore&&(o=nC(a,n,i))&&(!t.topTarget&&(t.topTarget=a),o!==Vx)){t.target=a;break}}}function kx(e,t,n){var i=e.painter;return t<0||t>i.getWidth()||n<0||n>i.getHeight()}var Wx=32,Xa=7;function iC(e){for(var t=0;e>=Wx;)t|=e&1,e>>=1;return e+t}function Jv(e,t,n,i){var r=t+1;if(r===n)return 1;if(i(e[r++],e[t])<0){for(;r<n&&i(e[r],e[r-1])<0;)r++;rC(e,t,r)}else for(;r<n&&i(e[r],e[r-1])>=0;)r++;return r-t}function rC(e,t,n){for(n--;t<n;){var i=e[t];e[t++]=e[n],e[n--]=i}}function jv(e,t,n,i,r){for(i===t&&i++;i<n;i++){for(var s=e[i],a=t,o=i,l;a<o;)l=a+o>>>1,r(s,e[l])<0?o=l:a=l+1;var c=i-a;switch(c){case 3:e[a+3]=e[a+2];case 2:e[a+2]=e[a+1];case 1:e[a+1]=e[a];break;default:for(;c>0;)e[a+c]=e[a+c-1],c--}e[a]=s}}function ih(e,t,n,i,r,s){var a=0,o=0,l=1;if(s(e,t[n+r])>0){for(o=i-r;l<o&&s(e,t[n+r+l])>0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o),a+=r,l+=r}else{for(o=r+1;l<o&&s(e,t[n+r-l])<=0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o);var c=a;a=r-l,l=r-c}for(a++;a<l;){var f=a+(l-a>>>1);s(e,t[n+f])>0?a=f+1:l=f}return l}function rh(e,t,n,i,r,s){var a=0,o=0,l=1;if(s(e,t[n+r])<0){for(o=r+1;l<o&&s(e,t[n+r-l])<0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o);var c=a;a=r-l,l=r-c}else{for(o=i-r;l<o&&s(e,t[n+r+l])>=0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o),a+=r,l+=r}for(a++;a<l;){var f=a+(l-a>>>1);s(e,t[n+f])<0?l=f:a=f+1}return l}function sC(e,t){var n=Xa,i,r,s=0,a=[];i=[],r=[];function o(d,v){i[s]=d,r[s]=v,s+=1}function l(){for(;s>1;){var d=s-2;if(d>=1&&r[d-1]<=r[d]+r[d+1]||d>=2&&r[d-2]<=r[d]+r[d-1])r[d-1]<r[d+1]&&d--;else if(r[d]>r[d+1])break;f(d)}}function c(){for(;s>1;){var d=s-2;d>0&&r[d-1]<r[d+1]&&d--,f(d)}}function f(d){var v=i[d],_=r[d],m=i[d+1],p=r[d+1];r[d]=_+p,d===s-3&&(i[d+1]=i[d+2],r[d+1]=r[d+2]),s--;var g=rh(e[m],e,v,_,0,t);v+=g,_-=g,_!==0&&(p=ih(e[v+_-1],e,m,p,p-1,t),p!==0&&(_<=p?u(v,_,m,p):h(v,_,m,p)))}function u(d,v,_,m){var p=0;for(p=0;p<v;p++)a[p]=e[d+p];var g=0,M=_,S=d;if(e[S++]=e[M++],--m===0){for(p=0;p<v;p++)e[S+p]=a[g+p];return}if(v===1){for(p=0;p<m;p++)e[S+p]=e[M+p];e[S+m]=a[g];return}for(var E=n,T,C,L;;){T=0,C=0,L=!1;do if(t(e[M],a[g])<0){if(e[S++]=e[M++],C++,T=0,--m===0){L=!0;break}}else if(e[S++]=a[g++],T++,C=0,--v===1){L=!0;break}while((T|C)<E);if(L)break;do{if(T=rh(e[M],a,g,v,0,t),T!==0){for(p=0;p<T;p++)e[S+p]=a[g+p];if(S+=T,g+=T,v-=T,v<=1){L=!0;break}}if(e[S++]=e[M++],--m===0){L=!0;break}if(C=ih(a[g],e,M,m,0,t),C!==0){for(p=0;p<C;p++)e[S+p]=e[M+p];if(S+=C,M+=C,m-=C,m===0){L=!0;break}}if(e[S++]=a[g++],--v===1){L=!0;break}E--}while(T>=Xa||C>=Xa);if(L)break;E<0&&(E=0),E+=2}if(n=E,n<1&&(n=1),v===1){for(p=0;p<m;p++)e[S+p]=e[M+p];e[S+m]=a[g]}else{if(v===0)throw new Error;for(p=0;p<v;p++)e[S+p]=a[g+p]}}function h(d,v,_,m){var p=0;for(p=0;p<m;p++)a[p]=e[_+p];var g=d+v-1,M=m-1,S=_+m-1,E=0,T=0;if(e[S--]=e[g--],--v===0){for(E=S-(m-1),p=0;p<m;p++)e[E+p]=a[p];return}if(m===1){for(S-=v,g-=v,T=S+1,E=g+1,p=v-1;p>=0;p--)e[T+p]=e[E+p];e[S]=a[M];return}for(var C=n;;){var L=0,y=0,b=!1;do if(t(a[M],e[g])<0){if(e[S--]=e[g--],L++,y=0,--v===0){b=!0;break}}else if(e[S--]=a[M--],y++,L=0,--m===1){b=!0;break}while((L|y)<C);if(b)break;do{if(L=v-rh(a[M],e,d,v,v-1,t),L!==0){for(S-=L,g-=L,v-=L,T=S+1,E=g+1,p=L-1;p>=0;p--)e[T+p]=e[E+p];if(v===0){b=!0;break}}if(e[S--]=a[M--],--m===1){b=!0;break}if(y=m-ih(e[g],a,0,m,m-1,t),y!==0){for(S-=y,M-=y,m-=y,T=S+1,E=M+1,p=0;p<y;p++)e[T+p]=a[E+p];if(m<=1){b=!0;break}}if(e[S--]=e[g--],--v===0){b=!0;break}C--}while(L>=Xa||y>=Xa);if(b)break;C<0&&(C=0),C+=2}if(n=C,n<1&&(n=1),m===1){for(S-=v,g-=v,T=S+1,E=g+1,p=v-1;p>=0;p--)e[T+p]=e[E+p];e[S]=a[M]}else{if(m===0)throw new Error;for(E=S-(m-1),p=0;p<m;p++)e[E+p]=a[p]}}return{mergeRuns:l,forceMergeRuns:c,pushRun:o}}function aC(e,t,n,i){n||(n=0),i||(i=e.length);var r=i-n;if(!(r<2)){var s=0;if(r<Wx){s=Jv(e,n,i,t),jv(e,n,i,n+s,t);return}var a=sC(e,t),o=iC(r);do{if(s=Jv(e,n,i,t),s<o){var l=r;l>o&&(l=o),jv(e,n,n+l,n+s,t),s=l}a.pushRun(n,s),a.mergeRuns(),r-=s,n+=s}while(r!==0);a.forceMergeRuns()}}var vn=1,fo=2,ea=4,Qv=!1;function sh(){Qv||(Qv=!0,console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"))}function t_(e,t){return e.zlevel===t.zlevel?e.z===t.z?e.z2-t.z2:e.z-t.z:e.zlevel-t.zlevel}var oC=function(){function e(){this._roots=[],this._displayList=[],this._displayListLen=0,this.displayableSortFunc=t_}return e.prototype.traverse=function(t,n){for(var i=0;i<this._roots.length;i++)this._roots[i].traverse(t,n)},e.prototype.getDisplayList=function(t,n){n=n||!1;var i=this._displayList;return(t||!i.length)&&this.updateDisplayList(n),i},e.prototype.updateDisplayList=function(t){this._displayListLen=0;for(var n=this._roots,i=this._displayList,r=0,s=n.length;r<s;r++)this._updateAndAddDisplayable(n[r],null,t);i.length=this._displayListLen,aC(i,t_)},e.prototype._updateAndAddDisplayable=function(t,n,i){if(!(t.ignore&&!i)){t.beforeUpdate(),t.update(),t.afterUpdate();var r=t.getClipPath(),s=n&&n.length,a=0,o=t.__clipPaths;if(!t.ignoreClip&&(s||r)){if(o||(o=t.__clipPaths=[]),s)for(var l=0;l<n.length;l++)o[a++]=n[l];for(var c=r,f=t;c;)c.parent=f,c.updateTransform(),o[a++]=c,f=c,c=c.getClipPath()}if(o&&(o.length=a),t.childrenRef){for(var u=t.childrenRef(),h=0;h<u.length;h++){var d=u[h];t.__dirty&&(d.__dirty|=vn),this._updateAndAddDisplayable(d,o,i)}t.__dirty=0}else{var v=t;isNaN(v.z)&&(sh(),v.z=0),isNaN(v.z2)&&(sh(),v.z2=0),isNaN(v.zlevel)&&(sh(),v.zlevel=0),this._displayList[this._displayListLen++]=v}var _=t.getDecalElement&&t.getDecalElement();_&&this._updateAndAddDisplayable(_,o,i);var m=t.getTextGuideLine();m&&this._updateAndAddDisplayable(m,o,i);var p=t.getTextContent();p&&this._updateAndAddDisplayable(p,o,i)}},e.prototype.addRoot=function(t){t.__zr&&t.__zr.storage===this||this._roots.push(t)},e.prototype.delRoot=function(t){if(t instanceof Array){for(var n=0,i=t.length;n<i;n++)this.delRoot(t[n]);return}var r=di(this._roots,t);r>=0&&this._roots.splice(r,1)},e.prototype.delAllRoots=function(){this._roots=[],this._displayList=[],this._displayListLen=0},e.prototype.getRoots=function(){return this._roots},e.prototype.dispose=function(){this._displayList=null,this._roots=null},e}(),Yc;Yc=ge.hasGlobalWindow&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(e){return setTimeout(e,16)};var Co={linear:function(e){return e},quadraticIn:function(e){return e*e},quadraticOut:function(e){return e*(2-e)},quadraticInOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)},cubicIn:function(e){return e*e*e},cubicOut:function(e){return--e*e*e+1},cubicInOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)},quarticIn:function(e){return e*e*e*e},quarticOut:function(e){return 1- --e*e*e*e},quarticInOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)},quinticIn:function(e){return e*e*e*e*e},quinticOut:function(e){return--e*e*e*e*e+1},quinticInOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)},sinusoidalIn:function(e){return 1-Math.cos(e*Math.PI/2)},sinusoidalOut:function(e){return Math.sin(e*Math.PI/2)},sinusoidalInOut:function(e){return .5*(1-Math.cos(Math.PI*e))},exponentialIn:function(e){return e===0?0:Math.pow(1024,e-1)},exponentialOut:function(e){return e===1?1:1-Math.pow(2,-10*e)},exponentialInOut:function(e){return e===0?0:e===1?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(-Math.pow(2,-10*(e-1))+2)},circularIn:function(e){return 1-Math.sqrt(1-e*e)},circularOut:function(e){return Math.sqrt(1- --e*e)},circularInOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)},elasticIn:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),-(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)))},elasticOut:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),n*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/i)+1)},elasticInOut:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),(e*=2)<1?-.5*(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)):n*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)*.5+1)},backIn:function(e){var t=1.70158;return e*e*((t+1)*e-t)},backOut:function(e){var t=1.70158;return--e*e*((t+1)*e+t)+1},backInOut:function(e){var t=2.5949095;return(e*=2)<1?.5*(e*e*((t+1)*e-t)):.5*((e-=2)*e*((t+1)*e+t)+2)},bounceIn:function(e){return 1-Co.bounceOut(1-e)},bounceOut:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},bounceInOut:function(e){return e<.5?Co.bounceIn(e*2)*.5:Co.bounceOut(e*2-1)*.5+.5}},Tl=Math.pow,Er=Math.sqrt,$c=1e-8,Xx=1e-4,e_=Er(3),El=1/3,pi=Ia(),En=Ia(),_a=Ia();function xr(e){return e>-$c&&e<$c}function qx(e){return e>$c||e<-$c}function Ke(e,t,n,i,r){var s=1-r;return s*s*(s*e+3*r*t)+r*r*(r*i+3*s*n)}function n_(e,t,n,i,r){var s=1-r;return 3*(((t-e)*s+2*(n-t)*r)*s+(i-n)*r*r)}function Yx(e,t,n,i,r,s){var a=i+3*(t-n)-e,o=3*(n-t*2+e),l=3*(t-e),c=e-r,f=o*o-3*a*l,u=o*l-9*a*c,h=l*l-3*o*c,d=0;if(xr(f)&&xr(u))if(xr(o))s[0]=0;else{var v=-l/o;v>=0&&v<=1&&(s[d++]=v)}else{var _=u*u-4*f*h;if(xr(_)){var m=u/f,v=-o/a+m,p=-m/2;v>=0&&v<=1&&(s[d++]=v),p>=0&&p<=1&&(s[d++]=p)}else if(_>0){var g=Er(_),M=f*o+1.5*a*(-u+g),S=f*o+1.5*a*(-u-g);M<0?M=-Tl(-M,El):M=Tl(M,El),S<0?S=-Tl(-S,El):S=Tl(S,El);var v=(-o-(M+S))/(3*a);v>=0&&v<=1&&(s[d++]=v)}else{var E=(2*f*o-3*a*u)/(2*Er(f*f*f)),T=Math.acos(E)/3,C=Er(f),L=Math.cos(T),v=(-o-2*C*L)/(3*a),p=(-o+C*(L+e_*Math.sin(T)))/(3*a),y=(-o+C*(L-e_*Math.sin(T)))/(3*a);v>=0&&v<=1&&(s[d++]=v),p>=0&&p<=1&&(s[d++]=p),y>=0&&y<=1&&(s[d++]=y)}}return d}function $x(e,t,n,i,r){var s=6*n-12*t+6*e,a=9*t+3*i-3*e-9*n,o=3*t-3*e,l=0;if(xr(a)){if(qx(s)){var c=-o/s;c>=0&&c<=1&&(r[l++]=c)}}else{var f=s*s-4*a*o;if(xr(f))r[0]=-s/(2*a);else if(f>0){var u=Er(f),c=(-s+u)/(2*a),h=(-s-u)/(2*a);c>=0&&c<=1&&(r[l++]=c),h>=0&&h<=1&&(r[l++]=h)}}return l}function Kc(e,t,n,i,r,s){var a=(t-e)*r+e,o=(n-t)*r+t,l=(i-n)*r+n,c=(o-a)*r+a,f=(l-o)*r+o,u=(f-c)*r+c;s[0]=e,s[1]=a,s[2]=c,s[3]=u,s[4]=u,s[5]=f,s[6]=l,s[7]=i}function lC(e,t,n,i,r,s,a,o,l,c,f){var u,h=.005,d=1/0,v,_,m,p;pi[0]=l,pi[1]=c;for(var g=0;g<1;g+=.05)En[0]=Ke(e,n,r,a,g),En[1]=Ke(t,i,s,o,g),m=va(pi,En),m<d&&(u=g,d=m);d=1/0;for(var M=0;M<32&&!(h<Xx);M++)v=u-h,_=u+h,En[0]=Ke(e,n,r,a,v),En[1]=Ke(t,i,s,o,v),m=va(En,pi),v>=0&&m<d?(u=v,d=m):(_a[0]=Ke(e,n,r,a,_),_a[1]=Ke(t,i,s,o,_),p=va(_a,pi),_<=1&&p<d?(u=_,d=p):h*=.5);return Er(d)}function cC(e,t,n,i,r,s,a,o,l){for(var c=e,f=t,u=0,h=1/l,d=1;d<=l;d++){var v=d*h,_=Ke(e,n,r,a,v),m=Ke(t,i,s,o,v),p=_-c,g=m-f;u+=Math.sqrt(p*p+g*g),c=_,f=m}return u}function sn(e,t,n,i){var r=1-i;return r*(r*e+2*i*t)+i*i*n}function i_(e,t,n,i){return 2*((1-i)*(t-e)+i*(n-t))}function fC(e,t,n,i,r){var s=e-2*t+n,a=2*(t-e),o=e-i,l=0;if(xr(s)){if(qx(a)){var c=-o/a;c>=0&&c<=1&&(r[l++]=c)}}else{var f=a*a-4*s*o;if(xr(f)){var c=-a/(2*s);c>=0&&c<=1&&(r[l++]=c)}else if(f>0){var u=Er(f),c=(-a+u)/(2*s),h=(-a-u)/(2*s);c>=0&&c<=1&&(r[l++]=c),h>=0&&h<=1&&(r[l++]=h)}}return l}function Kx(e,t,n){var i=e+n-2*t;return i===0?.5:(e-t)/i}function Zc(e,t,n,i,r){var s=(t-e)*i+e,a=(n-t)*i+t,o=(a-s)*i+s;r[0]=e,r[1]=s,r[2]=o,r[3]=o,r[4]=a,r[5]=n}function uC(e,t,n,i,r,s,a,o,l){var c,f=.005,u=1/0;pi[0]=a,pi[1]=o;for(var h=0;h<1;h+=.05){En[0]=sn(e,n,r,h),En[1]=sn(t,i,s,h);var d=va(pi,En);d<u&&(c=h,u=d)}u=1/0;for(var v=0;v<32&&!(f<Xx);v++){var _=c-f,m=c+f;En[0]=sn(e,n,r,_),En[1]=sn(t,i,s,_);var d=va(En,pi);if(_>=0&&d<u)c=_,u=d;else{_a[0]=sn(e,n,r,m),_a[1]=sn(t,i,s,m);var p=va(_a,pi);m<=1&&p<u?(c=m,u=p):f*=.5}}return Er(u)}function hC(e,t,n,i,r,s,a){for(var o=e,l=t,c=0,f=1/a,u=1;u<=a;u++){var h=u*f,d=sn(e,n,r,h),v=sn(t,i,s,h),_=d-o,m=v-l;c+=Math.sqrt(_*_+m*m),o=d,l=v}return c}var dC=/cubic-bezier\(([0-9,\.e ]+)\)/;function Zx(e){var t=e&&dC.exec(e);if(t){var n=t[1].split(","),i=+lo(n[0]),r=+lo(n[1]),s=+lo(n[2]),a=+lo(n[3]);if(isNaN(i+r+s+a))return;var o=[];return function(l){return l<=0?0:l>=1?1:Yx(0,i,s,1,l,o)&&Ke(0,r,a,1,o[0])}}}var pC=function(){function e(t){this._inited=!1,this._startTime=0,this._pausedTime=0,this._paused=!1,this._life=t.life||1e3,this._delay=t.delay||0,this.loop=t.loop||!1,this.onframe=t.onframe||ma,this.ondestroy=t.ondestroy||ma,this.onrestart=t.onrestart||ma,t.easing&&this.setEasing(t.easing)}return e.prototype.step=function(t,n){if(this._inited||(this._startTime=t+this._delay,this._inited=!0),this._paused){this._pausedTime+=n;return}var i=this._life,r=t-this._startTime-this._pausedTime,s=r/i;s<0&&(s=0),s=Math.min(s,1);var a=this.easingFunc,o=a?a(s):s;if(this.onframe(o),s===1)if(this.loop){var l=r%i;this._startTime=t-l,this._pausedTime=0,this.onrestart()}else return!0;return!1},e.prototype.pause=function(){this._paused=!0},e.prototype.resume=function(){this._paused=!1},e.prototype.setEasing=function(t){this.easing=t,this.easingFunc=gs(t)?t:Co[t]||Zx(t)},e}(),Jx=function(){function e(t){this.value=t}return e}(),mC=function(){function e(){this._len=0}return e.prototype.insert=function(t){var n=new Jx(t);return this.insertEntry(n),n},e.prototype.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},e.prototype.remove=function(t){var n=t.prev,i=t.next;n?n.next=i:this.head=i,i?i.prev=n:this.tail=n,t.next=t.prev=null,this._len--},e.prototype.len=function(){return this._len},e.prototype.clear=function(){this.head=this.tail=null,this._len=0},e}(),$o=function(){function e(t){this._list=new mC,this._maxSize=10,this._map={},this._maxSize=t}return e.prototype.put=function(t,n){var i=this._list,r=this._map,s=null;if(r[t]==null){var a=i.len(),o=this._lastRemovedEntry;if(a>=this._maxSize&&a>0){var l=i.head;i.remove(l),delete r[l.key],s=l.value,this._lastRemovedEntry=l}o?o.value=n:o=new Jx(n),o.key=t,i.insertEntry(o),r[t]=o}return s},e.prototype.get=function(t){var n=this._map[t],i=this._list;if(n!=null)return n!==i.tail&&(i.remove(n),i.insertEntry(n)),n.value},e.prototype.clear=function(){this._list.clear(),this._map={}},e.prototype.len=function(){return this._list.len()},e}(),r_={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function qn(e){return e=Math.round(e),e<0?0:e>255?255:e}function vC(e){return e=Math.round(e),e<0?0:e>360?360:e}function Ko(e){return e<0?0:e>1?1:e}function ah(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?qn(parseFloat(t)/100*255):qn(parseInt(t,10))}function xs(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?Ko(parseFloat(t)/100):Ko(parseFloat(t))}function oh(e,t,n){return n<0?n+=1:n>1&&(n-=1),n*6<1?e+(t-e)*n*6:n*2<1?t:n*3<2?e+(t-e)*(2/3-n)*6:e}function yr(e,t,n){return e+(t-e)*n}function bn(e,t,n,i,r){return e[0]=t,e[1]=n,e[2]=i,e[3]=r,e}function zd(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}var jx=new $o(20),wl=null;function Fs(e,t){wl&&zd(wl,t),wl=jx.put(e,wl||t.slice())}function xi(e,t){if(e){t=t||[];var n=jx.get(e);if(n)return zd(t,n);e=e+"";var i=e.replace(/ /g,"").toLowerCase();if(i in r_)return zd(t,r_[i]),Fs(e,t),t;var r=i.length;if(i.charAt(0)==="#"){if(r===4||r===5){var s=parseInt(i.slice(1,4),16);if(!(s>=0&&s<=4095)){bn(t,0,0,0,1);return}return bn(t,(s&3840)>>4|(s&3840)>>8,s&240|(s&240)>>4,s&15|(s&15)<<4,r===5?parseInt(i.slice(4),16)/15:1),Fs(e,t),t}else if(r===7||r===9){var s=parseInt(i.slice(1,7),16);if(!(s>=0&&s<=16777215)){bn(t,0,0,0,1);return}return bn(t,(s&16711680)>>16,(s&65280)>>8,s&255,r===9?parseInt(i.slice(7),16)/255:1),Fs(e,t),t}return}var a=i.indexOf("("),o=i.indexOf(")");if(a!==-1&&o+1===r){var l=i.substr(0,a),c=i.substr(a+1,o-(a+1)).split(","),f=1;switch(l){case"rgba":if(c.length!==4)return c.length===3?bn(t,+c[0],+c[1],+c[2],1):bn(t,0,0,0,1);f=xs(c.pop());case"rgb":if(c.length>=3)return bn(t,ah(c[0]),ah(c[1]),ah(c[2]),c.length===3?f:xs(c[3])),Fs(e,t),t;bn(t,0,0,0,1);return;case"hsla":if(c.length!==4){bn(t,0,0,0,1);return}return c[3]=xs(c[3]),Vd(c,t),Fs(e,t),t;case"hsl":if(c.length!==3){bn(t,0,0,0,1);return}return Vd(c,t),Fs(e,t),t;default:return}}bn(t,0,0,0,1)}}function Vd(e,t){var n=(parseFloat(e[0])%360+360)%360/360,i=xs(e[1]),r=xs(e[2]),s=r<=.5?r*(i+1):r+i-r*i,a=r*2-s;return t=t||[],bn(t,qn(oh(a,s,n+1/3)*255),qn(oh(a,s,n)*255),qn(oh(a,s,n-1/3)*255),1),e.length===4&&(t[3]=e[3]),t}function _C(e){if(e){var t=e[0]/255,n=e[1]/255,i=e[2]/255,r=Math.min(t,n,i),s=Math.max(t,n,i),a=s-r,o=(s+r)/2,l,c;if(a===0)l=0,c=0;else{o<.5?c=a/(s+r):c=a/(2-s-r);var f=((s-t)/6+a/2)/a,u=((s-n)/6+a/2)/a,h=((s-i)/6+a/2)/a;t===s?l=h-u:n===s?l=1/3+f-h:i===s&&(l=2/3+u-f),l<0&&(l+=1),l>1&&(l-=1)}var d=[l*360,c,o];return e[3]!=null&&d.push(e[3]),d}}function s_(e,t){var n=xi(e);if(n){for(var i=0;i<3;i++)n[i]=n[i]*(1-t)|0,n[i]>255?n[i]=255:n[i]<0&&(n[i]=0);return ol(n,n.length===4?"rgba":"rgb")}}function BN(e,t,n){if(!(!(t&&t.length)||!(e>=0&&e<=1))){n=n||[];var i=e*(t.length-1),r=Math.floor(i),s=Math.ceil(i),a=t[r],o=t[s],l=i-r;return n[0]=qn(yr(a[0],o[0],l)),n[1]=qn(yr(a[1],o[1],l)),n[2]=qn(yr(a[2],o[2],l)),n[3]=Ko(yr(a[3],o[3],l)),n}}function HN(e,t,n){if(!(!(t&&t.length)||!(e>=0&&e<=1))){var i=e*(t.length-1),r=Math.floor(i),s=Math.ceil(i),a=xi(t[r]),o=xi(t[s]),l=i-r,c=ol([qn(yr(a[0],o[0],l)),qn(yr(a[1],o[1],l)),qn(yr(a[2],o[2],l)),Ko(yr(a[3],o[3],l))],"rgba");return n?{color:c,leftIndex:r,rightIndex:s,value:i}:c}}function zN(e,t,n,i){var r=xi(e);if(e)return r=_C(r),t!=null&&(r[0]=vC(gs(t)?t(r[0]):t)),n!=null&&(r[1]=xs(gs(n)?n(r[1]):n)),i!=null&&(r[2]=xs(gs(i)?i(r[2]):i)),ol(Vd(r),"rgba")}function VN(e,t){var n=xi(e);if(n&&t!=null)return n[3]=Ko(t),ol(n,"rgba")}function ol(e,t){if(!(!e||!e.length)){var n=e[0]+","+e[1]+","+e[2];return(t==="rgba"||t==="hsva"||t==="hsla")&&(n+=","+e[3]),t+"("+n+")"}}function Jc(e,t){var n=xi(e);return n?(.299*n[0]+.587*n[1]+.114*n[2])*n[3]/255+(1-n[3])*t:0}var a_=new $o(100);function GN(e){if(Xc(e)){var t=a_.get(e);return t||(t=s_(e,-.1),a_.put(e,t)),t}else if(hu(e)){var n=_e({},e);return n.colorStops=Ta(e.colorStops,function(i){return{offset:i.offset,color:s_(i.color,-.1)}}),n}return e}function gC(e){return e.type==="linear"}function xC(e){return e.type==="radial"}(function(){return ge.hasGlobalWindow&&gs(window.btoa)?function(e){return window.btoa(unescape(encodeURIComponent(e)))}:typeof Buffer!="undefined"?function(e){return Buffer.from(e).toString("base64")}:function(e){return null}})();var Gd=Array.prototype.slice;function ki(e,t,n){return(t-e)*n+e}function lh(e,t,n,i){for(var r=t.length,s=0;s<r;s++)e[s]=ki(t[s],n[s],i);return e}function yC(e,t,n,i){for(var r=t.length,s=r&&t[0].length,a=0;a<r;a++){e[a]||(e[a]=[]);for(var o=0;o<s;o++)e[a][o]=ki(t[a][o],n[a][o],i)}return e}function Al(e,t,n,i){for(var r=t.length,s=0;s<r;s++)e[s]=t[s]+n[s]*i;return e}function o_(e,t,n,i){for(var r=t.length,s=r&&t[0].length,a=0;a<r;a++){e[a]||(e[a]=[]);for(var o=0;o<s;o++)e[a][o]=t[a][o]+n[a][o]*i}return e}function SC(e,t){for(var n=e.length,i=t.length,r=n>i?t:e,s=Math.min(n,i),a=r[s-1]||{color:[0,0,0,0],offset:0},o=s;o<Math.max(n,i);o++)r.push({offset:a.offset,color:a.color.slice()})}function MC(e,t,n){var i=e,r=t;if(!(!i.push||!r.push)){var s=i.length,a=r.length;if(s!==a){var o=s>a;if(o)i.length=a;else for(var l=s;l<a;l++)i.push(n===1?r[l]:Gd.call(r[l]))}for(var c=i[0]&&i[0].length,l=0;l<i.length;l++)if(n===1)isNaN(i[l])&&(i[l]=r[l]);else for(var f=0;f<c;f++)isNaN(i[l][f])&&(i[l][f]=r[l][f])}}function Sc(e){if(Ti(e)){var t=e.length;if(Ti(e[0])){for(var n=[],i=0;i<t;i++)n.push(Gd.call(e[i]));return n}return Gd.call(e)}return e}function Mc(e){return e[0]=Math.floor(e[0])||0,e[1]=Math.floor(e[1])||0,e[2]=Math.floor(e[2])||0,e[3]=e[3]==null?1:e[3],"rgba("+e.join(",")+")"}function bC(e){return Ti(e&&e[0])?2:1}var Cl=0,bc=1,Qx=2,uo=3,kd=4,Wd=5,l_=6;function c_(e){return e===kd||e===Wd}function Rl(e){return e===bc||e===Qx}var qa=[0,0,0,0],TC=function(){function e(t){this.keyframes=[],this.discrete=!1,this._invalid=!1,this._needsSort=!1,this._lastFr=0,this._lastFrP=0,this.propName=t}return e.prototype.isFinished=function(){return this._finished},e.prototype.setFinished=function(){this._finished=!0,this._additiveTrack&&this._additiveTrack.setFinished()},e.prototype.needsAnimate=function(){return this.keyframes.length>=1},e.prototype.getAdditiveTrack=function(){return this._additiveTrack},e.prototype.addKeyframe=function(t,n,i){this._needsSort=!0;var r=this.keyframes,s=r.length,a=!1,o=l_,l=n;if(Ti(n)){var c=bC(n);o=c,(c===1&&!xc(n[0])||c===2&&!xc(n[0][0]))&&(a=!0)}else if(xc(n)&&!gA(n))o=Cl;else if(Xc(n))if(!isNaN(+n))o=Cl;else{var f=xi(n);f&&(l=f,o=uo)}else if(hu(n)){var u=_e({},l);u.colorStops=Ta(n.colorStops,function(d){return{offset:d.offset,color:xi(d.color)}}),gC(n)?o=kd:xC(n)&&(o=Wd),l=u}s===0?this.valType=o:(o!==this.valType||o===l_)&&(a=!0),this.discrete=this.discrete||a;var h={time:t,value:l,rawValue:n,percent:0};return i&&(h.easing=i,h.easingFunc=gs(i)?i:Co[i]||Zx(i)),r.push(h),h},e.prototype.prepare=function(t,n){var i=this.keyframes;this._needsSort&&i.sort(function(_,m){return _.time-m.time});for(var r=this.valType,s=i.length,a=i[s-1],o=this.discrete,l=Rl(r),c=c_(r),f=0;f<s;f++){var u=i[f],h=u.value,d=a.value;u.percent=u.time/t,o||(l&&f!==s-1?MC(h,d,r):c&&SC(h.colorStops,d.colorStops))}if(!o&&r!==Wd&&n&&this.needsAnimate()&&n.needsAnimate()&&r===n.valType&&!n._finished){this._additiveTrack=n;for(var v=i[0].value,f=0;f<s;f++)r===Cl?i[f].additiveValue=i[f].value-v:r===uo?i[f].additiveValue=Al([],i[f].value,v,-1):Rl(r)&&(i[f].additiveValue=r===bc?Al([],i[f].value,v,-1):o_([],i[f].value,v,-1))}},e.prototype.step=function(t,n){if(!this._finished){this._additiveTrack&&this._additiveTrack._finished&&(this._additiveTrack=null);var i=this._additiveTrack!=null,r=i?"additiveValue":"value",s=this.valType,a=this.keyframes,o=a.length,l=this.propName,c=s===uo,f,u=this._lastFr,h=Math.min,d,v;if(o===1)d=v=a[0];else{if(n<0)f=0;else if(n<this._lastFrP){var _=h(u+1,o-1);for(f=_;f>=0&&!(a[f].percent<=n);f--);f=h(f,o-2)}else{for(f=u;f<o&&!(a[f].percent>n);f++);f=h(f-1,o-2)}v=a[f+1],d=a[f]}if(d&&v){this._lastFr=f,this._lastFrP=n;var m=v.percent-d.percent,p=m===0?1:h((n-d.percent)/m,1);v.easingFunc&&(p=v.easingFunc(p));var g=i?this._additiveValue:c?qa:t[l];if((Rl(s)||c)&&!g&&(g=this._additiveValue=[]),this.discrete)t[l]=p<1?d.rawValue:v.rawValue;else if(Rl(s))s===bc?lh(g,d[r],v[r],p):yC(g,d[r],v[r],p);else if(c_(s)){var M=d[r],S=v[r],E=s===kd;t[l]={type:E?"linear":"radial",x:ki(M.x,S.x,p),y:ki(M.y,S.y,p),colorStops:Ta(M.colorStops,function(C,L){var y=S.colorStops[L];return{offset:ki(C.offset,y.offset,p),color:Mc(lh([],C.color,y.color,p))}}),global:S.global},E?(t[l].x2=ki(M.x2,S.x2,p),t[l].y2=ki(M.y2,S.y2,p)):t[l].r=ki(M.r,S.r,p)}else if(c)lh(g,d[r],v[r],p),i||(t[l]=Mc(g));else{var T=ki(d[r],v[r],p);i?this._additiveValue=T:t[l]=T}i&&this._addToTarget(t)}}},e.prototype._addToTarget=function(t){var n=this.valType,i=this.propName,r=this._additiveValue;n===Cl?t[i]=t[i]+r:n===uo?(xi(t[i],qa),Al(qa,qa,r,1),t[i]=Mc(qa)):n===bc?Al(t[i],t[i],r,1):n===Qx&&o_(t[i],t[i],r,1)},e}(),qp=function(){function e(t,n,i,r){if(this._tracks={},this._trackKeys=[],this._maxTime=0,this._started=0,this._clip=null,this._target=t,this._loop=n,n&&r){Wp("Can' use additive animation on looped animation.");return}this._additiveAnimators=r,this._allowDiscrete=i}return e.prototype.getMaxTime=function(){return this._maxTime},e.prototype.getDelay=function(){return this._delay},e.prototype.getLoop=function(){return this._loop},e.prototype.getTarget=function(){return this._target},e.prototype.changeTarget=function(t){this._target=t},e.prototype.when=function(t,n,i){return this.whenWithKeys(t,n,xn(n),i)},e.prototype.whenWithKeys=function(t,n,i,r){for(var s=this._tracks,a=0;a<i.length;a++){var o=i[a],l=s[o];if(!l){l=s[o]=new TC(o);var c=void 0,f=this._getAdditiveTrack(o);if(f){var u=f.keyframes,h=u[u.length-1];c=h&&h.value,f.valType===uo&&c&&(c=Mc(c))}else c=this._target[o];if(c==null)continue;t>0&&l.addKeyframe(0,Sc(c),r),this._trackKeys.push(o)}l.addKeyframe(t,Sc(n[o]),r)}return this._maxTime=Math.max(this._maxTime,t),this},e.prototype.pause=function(){this._clip.pause(),this._paused=!0},e.prototype.resume=function(){this._clip.resume(),this._paused=!1},e.prototype.isPaused=function(){return!!this._paused},e.prototype.duration=function(t){return this._maxTime=t,this._force=!0,this},e.prototype._doneCallback=function(){this._setTracksFinished(),this._clip=null;var t=this._doneCbs;if(t)for(var n=t.length,i=0;i<n;i++)t[i].call(this)},e.prototype._abortedCallback=function(){this._setTracksFinished();var t=this.animation,n=this._abortedCbs;if(t&&t.removeClip(this._clip),this._clip=null,n)for(var i=0;i<n.length;i++)n[i].call(this)},e.prototype._setTracksFinished=function(){for(var t=this._tracks,n=this._trackKeys,i=0;i<n.length;i++)t[n[i]].setFinished()},e.prototype._getAdditiveTrack=function(t){var n,i=this._additiveAnimators;if(i)for(var r=0;r<i.length;r++){var s=i[r].getTrack(t);s&&(n=s)}return n},e.prototype.start=function(t){if(!(this._started>0)){this._started=1;for(var n=this,i=[],r=this._maxTime||0,s=0;s<this._trackKeys.length;s++){var a=this._trackKeys[s],o=this._tracks[a],l=this._getAdditiveTrack(a),c=o.keyframes,f=c.length;if(o.prepare(r,l),o.needsAnimate())if(!this._allowDiscrete&&o.discrete){var u=c[f-1];u&&(n._target[o.propName]=u.rawValue),o.setFinished()}else i.push(o)}if(i.length||this._force){var h=new pC({life:r,loop:this._loop,delay:this._delay||0,onframe:function(d){n._started=2;var v=n._additiveAnimators;if(v){for(var _=!1,m=0;m<v.length;m++)if(v[m]._clip){_=!0;break}_||(n._additiveAnimators=null)}for(var m=0;m<i.length;m++)i[m].step(n._target,d);var p=n._onframeCbs;if(p)for(var m=0;m<p.length;m++)p[m](n._target,d)},ondestroy:function(){n._doneCallback()}});this._clip=h,this.animation&&this.animation.addClip(h),t&&h.setEasing(t)}else this._doneCallback();return this}},e.prototype.stop=function(t){if(this._clip){var n=this._clip;t&&n.onframe(1),this._abortedCallback()}},e.prototype.delay=function(t){return this._delay=t,this},e.prototype.during=function(t){return t&&(this._onframeCbs||(this._onframeCbs=[]),this._onframeCbs.push(t)),this},e.prototype.done=function(t){return t&&(this._doneCbs||(this._doneCbs=[]),this._doneCbs.push(t)),this},e.prototype.aborted=function(t){return t&&(this._abortedCbs||(this._abortedCbs=[]),this._abortedCbs.push(t)),this},e.prototype.getClip=function(){return this._clip},e.prototype.getTrack=function(t){return this._tracks[t]},e.prototype.getTracks=function(){var t=this;return Ta(this._trackKeys,function(n){return t._tracks[n]})},e.prototype.stopTracks=function(t,n){if(!t.length||!this._clip)return!0;for(var i=this._tracks,r=this._trackKeys,s=0;s<t.length;s++){var a=i[t[s]];a&&!a.isFinished()&&(n?a.step(this._target,1):this._started===1&&a.step(this._target,0),a.setFinished())}for(var o=!0,s=0;s<r.length;s++)if(!i[r[s]].isFinished()){o=!1;break}return o&&this._abortedCallback(),o},e.prototype.saveTo=function(t,n,i){if(t){n=n||this._trackKeys;for(var r=0;r<n.length;r++){var s=n[r],a=this._tracks[s];if(!(!a||a.isFinished())){var o=a.keyframes,l=o[i?0:o.length-1];l&&(t[s]=Sc(l.rawValue))}}}},e.prototype.__changeFinalValue=function(t,n){n=n||xn(t);for(var i=0;i<n.length;i++){var r=n[i],s=this._tracks[r];if(s){var a=s.keyframes;if(a.length>1){var o=a.pop();s.addKeyframe(o.time,t[r]),s.prepare(this._maxTime,s.getAdditiveTrack())}}}},e}();function sa(){return new Date().getTime()}var EC=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i._running=!1,i._time=0,i._pausedTime=0,i._pauseStart=0,i._paused=!1,n=n||{},i.stage=n.stage||{},i}return t.prototype.addClip=function(n){n.animation&&this.removeClip(n),this._head?(this._tail.next=n,n.prev=this._tail,n.next=null,this._tail=n):this._head=this._tail=n,n.animation=this},t.prototype.addAnimator=function(n){n.animation=this;var i=n.getClip();i&&this.addClip(i)},t.prototype.removeClip=function(n){if(n.animation){var i=n.prev,r=n.next;i?i.next=r:this._head=r,r?r.prev=i:this._tail=i,n.next=n.prev=n.animation=null}},t.prototype.removeAnimator=function(n){var i=n.getClip();i&&this.removeClip(i),n.animation=null},t.prototype.update=function(n){for(var i=sa()-this._pausedTime,r=i-this._time,s=this._head;s;){var a=s.next,o=s.step(i,r);o&&(s.ondestroy(),this.removeClip(s)),s=a}this._time=i,n||(this.trigger("frame",r),this.stage.update&&this.stage.update())},t.prototype._startLoop=function(){var n=this;this._running=!0;function i(){n._running&&(Yc(i),!n._paused&&n.update())}Yc(i)},t.prototype.start=function(){this._running||(this._time=sa(),this._pausedTime=0,this._startLoop())},t.prototype.stop=function(){this._running=!1},t.prototype.pause=function(){this._paused||(this._pauseStart=sa(),this._paused=!0)},t.prototype.resume=function(){this._paused&&(this._pausedTime+=sa()-this._pauseStart,this._paused=!1)},t.prototype.clear=function(){for(var n=this._head;n;){var i=n.next;n.prev=n.next=n.animation=null,n=i}this._head=this._tail=null},t.prototype.isFinished=function(){return this._head==null},t.prototype.animate=function(n,i){i=i||{},this.start();var r=new qp(n,i.loop);return this.addAnimator(r),r},t}(Na),wC=300,ch=ge.domSupported,fh=function(){var e=["click","dblclick","mousewheel","wheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],t=["touchstart","touchend","touchmove"],n={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},i=Ta(e,function(r){var s=r.replace("mouse","pointer");return n.hasOwnProperty(s)?s:r});return{mouse:e,touch:t,pointer:i}}(),f_={mouse:["mousemove","mouseup"],pointer:["pointermove","pointerup"]},u_=!1;function Xd(e){var t=e.pointerType;return t==="pen"||t==="touch"}function AC(e){e.touching=!0,e.touchTimer!=null&&(clearTimeout(e.touchTimer),e.touchTimer=null),e.touchTimer=setTimeout(function(){e.touching=!1,e.touchTimer=null},700)}function uh(e){e&&(e.zrByTouch=!0)}function CC(e,t){return Hn(e.dom,new RC(e,t),!0)}function ty(e,t){for(var n=t,i=!1;n&&n.nodeType!==9&&!(i=n.domBelongToZr||n!==t&&n===e.painterRoot);)n=n.parentNode;return i}var RC=function(){function e(t,n){this.stopPropagation=ma,this.stopImmediatePropagation=ma,this.preventDefault=ma,this.type=n.type,this.target=this.currentTarget=t.dom,this.pointerType=n.pointerType,this.clientX=n.clientX,this.clientY=n.clientY}return e}(),zn={mousedown:function(e){e=Hn(this.dom,e),this.__mayPointerCapture=[e.zrX,e.zrY],this.trigger("mousedown",e)},mousemove:function(e){e=Hn(this.dom,e);var t=this.__mayPointerCapture;t&&(e.zrX!==t[0]||e.zrY!==t[1])&&this.__togglePointerCapture(!0),this.trigger("mousemove",e)},mouseup:function(e){e=Hn(this.dom,e),this.__togglePointerCapture(!1),this.trigger("mouseup",e)},mouseout:function(e){e=Hn(this.dom,e);var t=e.toElement||e.relatedTarget;ty(this,t)||(this.__pointerCapturing&&(e.zrEventControl="no_globalout"),this.trigger("mouseout",e))},wheel:function(e){u_=!0,e=Hn(this.dom,e),this.trigger("mousewheel",e)},mousewheel:function(e){u_||(e=Hn(this.dom,e),this.trigger("mousewheel",e))},touchstart:function(e){e=Hn(this.dom,e),uh(e),this.__lastTouchMoment=new Date,this.handler.processGesture(e,"start"),zn.mousemove.call(this,e),zn.mousedown.call(this,e)},touchmove:function(e){e=Hn(this.dom,e),uh(e),this.handler.processGesture(e,"change"),zn.mousemove.call(this,e)},touchend:function(e){e=Hn(this.dom,e),uh(e),this.handler.processGesture(e,"end"),zn.mouseup.call(this,e),+new Date-+this.__lastTouchMoment<wC&&zn.click.call(this,e)},pointerdown:function(e){zn.mousedown.call(this,e)},pointermove:function(e){Xd(e)||zn.mousemove.call(this,e)},pointerup:function(e){zn.mouseup.call(this,e)},pointerout:function(e){Xd(e)||zn.mouseout.call(this,e)}};ln(["click","dblclick","contextmenu"],function(e){zn[e]=function(t){t=Hn(this.dom,t),this.trigger(e,t)}});var qd={pointermove:function(e){Xd(e)||qd.mousemove.call(this,e)},pointerup:function(e){qd.mouseup.call(this,e)},mousemove:function(e){this.trigger("mousemove",e)},mouseup:function(e){var t=this.__pointerCapturing;this.__togglePointerCapture(!1),this.trigger("mouseup",e),t&&(e.zrEventControl="only_globalout",this.trigger("mouseout",e))}};function PC(e,t){var n=t.domHandlers;ge.pointerEventsSupported?ln(fh.pointer,function(i){Tc(t,i,function(r){n[i].call(e,r)})}):(ge.touchEventsSupported&&ln(fh.touch,function(i){Tc(t,i,function(r){n[i].call(e,r),AC(t)})}),ln(fh.mouse,function(i){Tc(t,i,function(r){r=Xp(r),t.touching||n[i].call(e,r)})}))}function LC(e,t){ge.pointerEventsSupported?ln(f_.pointer,n):ge.touchEventsSupported||ln(f_.mouse,n);function n(i){function r(s){s=Xp(s),ty(e,s.target)||(s=CC(e,s),t.domHandlers[i].call(e,s))}Tc(t,i,r,{capture:!0})}}function Tc(e,t,n,i){e.mounted[t]=n,e.listenerOpts[t]=i,zA(e.domTarget,t,n,i)}function hh(e){var t=e.mounted;for(var n in t)t.hasOwnProperty(n)&&VA(e.domTarget,n,t[n],e.listenerOpts[n]);e.mounted={}}var h_=function(){function e(t,n){this.mounted={},this.listenerOpts={},this.touching=!1,this.domTarget=t,this.domHandlers=n}return e}(),DC=function(e){ue(t,e);function t(n,i){var r=e.call(this)||this;return r.__pointerCapturing=!1,r.dom=n,r.painterRoot=i,r._localHandlerScope=new h_(n,zn),ch&&(r._globalHandlerScope=new h_(document,qd)),PC(r,r._localHandlerScope),r}return t.prototype.dispose=function(){hh(this._localHandlerScope),ch&&hh(this._globalHandlerScope)},t.prototype.setCursor=function(n){this.dom.style&&(this.dom.style.cursor=n||"default")},t.prototype.__togglePointerCapture=function(n){if(this.__mayPointerCapture=null,ch&&+this.__pointerCapturing^+n){this.__pointerCapturing=n;var i=this._globalHandlerScope;n?LC(this,i):hh(i)}},t}(Na),ey=1;ge.hasGlobalWindow&&(ey=Math.max(window.devicePixelRatio||window.screen&&window.screen.deviceXDPI/window.screen.logicalXDPI||1,1));var jc=ey,Yd=.4,$d="#333",Kd="#ccc",IC="#eee",d_=XA,p_=5e-5;function Gr(e){return e>p_||e<-p_}var kr=[],Us=[],dh=wo(),ph=Math.abs,ny=function(){function e(){}return e.prototype.getLocalTransform=function(t){return e.getLocalTransform(this,t)},e.prototype.setPosition=function(t){this.x=t[0],this.y=t[1]},e.prototype.setScale=function(t){this.scaleX=t[0],this.scaleY=t[1]},e.prototype.setSkew=function(t){this.skewX=t[0],this.skewY=t[1]},e.prototype.setOrigin=function(t){this.originX=t[0],this.originY=t[1]},e.prototype.needLocalTransform=function(){return Gr(this.rotation)||Gr(this.x)||Gr(this.y)||Gr(this.scaleX-1)||Gr(this.scaleY-1)||Gr(this.skewX)||Gr(this.skewY)},e.prototype.updateTransform=function(){var t=this.parent&&this.parent.transform,n=this.needLocalTransform(),i=this.transform;if(!(n||t)){i&&(d_(i),this.invTransform=null);return}i=i||wo(),n?this.getLocalTransform(i):d_(i),t&&(n?eh(i,t,i):qA(i,t)),this.transform=i,this._resolveGlobalScaleRatio(i)},e.prototype._resolveGlobalScaleRatio=function(t){var n=this.globalScaleRatio;if(n!=null&&n!==1){this.getGlobalScale(kr);var i=kr[0]<0?-1:1,r=kr[1]<0?-1:1,s=((kr[0]-i)*n+i)/kr[0]||0,a=((kr[1]-r)*n+r)/kr[1]||0;t[0]*=s,t[1]*=s,t[2]*=a,t[3]*=a}this.invTransform=this.invTransform||wo(),Hx(this.invTransform,t)},e.prototype.getComputedTransform=function(){for(var t=this,n=[];t;)n.push(t),t=t.parent;for(;t=n.pop();)t.updateTransform();return this.transform},e.prototype.setLocalTransform=function(t){if(t){var n=t[0]*t[0]+t[1]*t[1],i=t[2]*t[2]+t[3]*t[3],r=Math.atan2(t[1],t[0]),s=Math.PI/2+r-Math.atan2(t[3],t[2]);i=Math.sqrt(i)*Math.cos(s),n=Math.sqrt(n),this.skewX=s,this.skewY=0,this.rotation=-r,this.x=+t[4],this.y=+t[5],this.scaleX=n,this.scaleY=i,this.originX=0,this.originY=0}},e.prototype.decomposeTransform=function(){if(this.transform){var t=this.parent,n=this.transform;t&&t.transform&&(t.invTransform=t.invTransform||wo(),eh(Us,t.invTransform,n),n=Us);var i=this.originX,r=this.originY;(i||r)&&(dh[4]=i,dh[5]=r,eh(Us,n,dh),Us[4]-=i,Us[5]-=r,n=Us),this.setLocalTransform(n)}},e.prototype.getGlobalScale=function(t){var n=this.transform;return t=t||[],n?(t[0]=Math.sqrt(n[0]*n[0]+n[1]*n[1]),t[1]=Math.sqrt(n[2]*n[2]+n[3]*n[3]),n[0]<0&&(t[0]=-t[0]),n[3]<0&&(t[1]=-t[1]),t):(t[0]=1,t[1]=1,t)},e.prototype.transformCoordToLocal=function(t,n){var i=[t,n],r=this.invTransform;return r&&Eo(i,i,r),i},e.prototype.transformCoordToGlobal=function(t,n){var i=[t,n],r=this.transform;return r&&Eo(i,i,r),i},e.prototype.getLineScale=function(){var t=this.transform;return t&&ph(t[0]-1)>1e-10&&ph(t[3]-1)>1e-10?Math.sqrt(ph(t[0]*t[3]-t[2]*t[1])):1},e.prototype.copyTransform=function(t){NC(this,t)},e.getLocalTransform=function(t,n){n=n||[];var i=t.originX||0,r=t.originY||0,s=t.scaleX,a=t.scaleY,o=t.anchorX,l=t.anchorY,c=t.rotation||0,f=t.x,u=t.y,h=t.skewX?Math.tan(t.skewX):0,d=t.skewY?Math.tan(-t.skewY):0;if(i||r||o||l){var v=i+o,_=r+l;n[4]=-v*s-h*_*a,n[5]=-_*a-d*v*s}else n[4]=n[5]=0;return n[0]=s,n[3]=a,n[1]=d*s,n[2]=h*a,c&&YA(n,n,c),n[4]+=i+f,n[5]+=r+u,n},e.initDefaultProps=function(){var t=e.prototype;t.scaleX=t.scaleY=t.globalScaleRatio=1,t.x=t.y=t.originX=t.originY=t.skewX=t.skewY=t.rotation=t.anchorX=t.anchorY=0}(),e}(),Zo=["x","y","originX","originY","anchorX","anchorY","rotation","scaleX","scaleY","skewX","skewY"];function NC(e,t){for(var n=0;n<Zo.length;n++){var i=Zo[n];e[i]=t[i]}}function yi(e){Pl||(Pl=new $o(100)),e=e||Cr;var t=Pl.get(e);return t||(t={font:e,strWidthCache:new $o(500),asciiWidthMap:null,asciiWidthMapTried:!1,stWideCharWidth:Es.measureText("国",e).width,asciiCharWidth:Es.measureText("a",e).width},Pl.put(e,t)),t}var Pl;function FC(e){if(!(mh>=m_)){e=e||Cr;for(var t=[],n=+new Date,i=0;i<=127;i++)t[i]=Es.measureText(String.fromCharCode(i),e).width;var r=+new Date-n;return r>16?mh=m_:r>2&&mh++,t}}var mh=0,m_=5;function iy(e,t){return e.asciiWidthMapTried||(e.asciiWidthMap=FC(e.font),e.asciiWidthMapTried=!0),0<=t&&t<=127?e.asciiWidthMap!=null?e.asciiWidthMap[t]:e.asciiCharWidth:e.stWideCharWidth}function Si(e,t){var n=e.strWidthCache,i=n.get(t);return i==null&&(i=Es.measureText(t,e.font).width,n.put(t,i)),i}function v_(e,t,n,i){var r=Si(yi(t),e),s=pu(t),a=Ea(0,r,n),o=ys(0,s,i),l=new ce(a,o,r,s);return l}function kN(e,t,n,i){var r=((e||"")+"").split(`
`),s=r.length;if(s===1)return v_(r[0],t,n,i);for(var a=new ce(0,0,0,0),o=0;o<r.length;o++){var l=v_(r[o],t,n,i);o===0?a.copy(l):a.union(l)}return a}function Ea(e,t,n,i){return n==="right"?i?e+=t:e-=t:n==="center"&&(i?e+=t/2:e-=t/2),e}function ys(e,t,n,i){return n==="middle"?i?e+=t/2:e-=t/2:n==="bottom"&&(i?e+=t:e-=t),e}function pu(e){return yi(e).stWideCharWidth}function Jo(e,t){return typeof e=="string"?e.lastIndexOf("%")>=0?parseFloat(e)/100*t:parseFloat(e):e}function UC(e,t,n){var i=t.position||"inside",r=t.distance!=null?t.distance:5,s=n.height,a=n.width,o=s/2,l=n.x,c=n.y,f="left",u="top";if(i instanceof Array)l+=Jo(i[0],n.width),c+=Jo(i[1],n.height),f=null,u=null;else switch(i){case"left":l-=r,c+=o,f="right",u="middle";break;case"right":l+=r+a,c+=o,u="middle";break;case"top":l+=a/2,c-=r,f="center",u="bottom";break;case"bottom":l+=a/2,c+=s+r,f="center";break;case"inside":l+=a/2,c+=o,f="center",u="middle";break;case"insideLeft":l+=r,c+=o,u="middle";break;case"insideRight":l+=a-r,c+=o,f="right",u="middle";break;case"insideTop":l+=a/2,c+=r,f="center";break;case"insideBottom":l+=a/2,c+=s-r,f="center",u="bottom";break;case"insideTopLeft":l+=r,c+=r;break;case"insideTopRight":l+=a-r,c+=r,f="right";break;case"insideBottomLeft":l+=r,c+=s-r,u="bottom";break;case"insideBottomRight":l+=a-r,c+=s-r,f="right",u="bottom";break}return e=e||{},e.x=l,e.y=c,e.align=f,e.verticalAlign=u,e}var vh="__zr_normal__",_h=Zo.concat(["ignore"]),OC=uu(Zo,function(e,t){return e[t]=!0,e},{ignore:!1}),Os={},BC=new ce(0,0,0,0),Ll=[],mu=function(){function e(t){this.id=Dx(),this.animators=[],this.currentStates=[],this.states={},this._init(t)}return e.prototype._init=function(t){this.attr(t)},e.prototype.drift=function(t,n,i){switch(this.draggable){case"horizontal":n=0;break;case"vertical":t=0;break}var r=this.transform;r||(r=this.transform=[1,0,0,1,0,0]),r[4]+=t,r[5]+=n,this.decomposeTransform(),this.markRedraw()},e.prototype.beforeUpdate=function(){},e.prototype.afterUpdate=function(){},e.prototype.update=function(){this.updateTransform(),this.__dirty&&this.updateInnerText()},e.prototype.updateInnerText=function(t){var n=this._textContent;if(n&&(!n.ignore||t)){this.textConfig||(this.textConfig={});var i=this.textConfig,r=i.local,s=n.innerTransformable,a=void 0,o=void 0,l=!1;s.parent=r?this:null;var c=!1;s.copyTransform(n);var f=i.position!=null,u=i.autoOverflowArea,h=void 0;if((u||f)&&(h=BC,i.layoutRect?h.copy(i.layoutRect):h.copy(this.getBoundingRect()),r||h.applyTransform(this.transform)),f){this.calculateTextPosition?this.calculateTextPosition(Os,i,h):UC(Os,i,h),s.x=Os.x,s.y=Os.y,a=Os.align,o=Os.verticalAlign;var d=i.origin;if(d&&i.rotation!=null){var v=void 0,_=void 0;d==="center"?(v=h.width*.5,_=h.height*.5):(v=Jo(d[0],h.width),_=Jo(d[1],h.height)),c=!0,s.originX=-s.x+v+(r?0:h.x),s.originY=-s.y+_+(r?0:h.y)}}i.rotation!=null&&(s.rotation=i.rotation);var m=i.offset;m&&(s.x+=m[0],s.y+=m[1],c||(s.originX=-m[0],s.originY=-m[1]));var p=this._innerTextDefaultStyle||(this._innerTextDefaultStyle={});if(u){var g=p.overflowRect=p.overflowRect||new ce(0,0,0,0);s.getLocalTransform(Ll),Hx(Ll,Ll),ce.copy(g,h),g.applyTransform(Ll)}else p.overflowRect=null;var M=i.inside==null?typeof i.position=="string"&&i.position.indexOf("inside")>=0:i.inside,S=void 0,E=void 0,T=void 0;M&&this.canBeInsideText()?(S=i.insideFill,E=i.insideStroke,(S==null||S==="auto")&&(S=this.getInsideTextFill()),(E==null||E==="auto")&&(E=this.getInsideTextStroke(S),T=!0)):(S=i.outsideFill,E=i.outsideStroke,(S==null||S==="auto")&&(S=this.getOutsideFill()),(E==null||E==="auto")&&(E=this.getOutsideStroke(S),T=!0)),S=S||"#000",(S!==p.fill||E!==p.stroke||T!==p.autoStroke||a!==p.align||o!==p.verticalAlign)&&(l=!0,p.fill=S,p.stroke=E,p.autoStroke=T,p.align=a,p.verticalAlign=o,n.setDefaultTextStyle(p)),n.__dirty|=vn,l&&n.dirtyStyle(!0)}},e.prototype.canBeInsideText=function(){return!0},e.prototype.getInsideTextFill=function(){return"#fff"},e.prototype.getInsideTextStroke=function(t){return"#000"},e.prototype.getOutsideFill=function(){return this.__zr&&this.__zr.isDarkMode()?Kd:$d},e.prototype.getOutsideStroke=function(t){var n=this.__zr&&this.__zr.getBackgroundColor(),i=typeof n=="string"&&xi(n);i||(i=[255,255,255,1]);for(var r=i[3],s=this.__zr.isDarkMode(),a=0;a<3;a++)i[a]=i[a]*r+(s?0:255)*(1-r);return i[3]=1,ol(i,"rgba")},e.prototype.traverse=function(t,n){},e.prototype.attrKV=function(t,n){t==="textConfig"?this.setTextConfig(n):t==="textContent"?this.setTextContent(n):t==="clipPath"?this.setClipPath(n):t==="extra"?(this.extra=this.extra||{},_e(this.extra,n)):this[t]=n},e.prototype.hide=function(){this.ignore=!0,this.markRedraw()},e.prototype.show=function(){this.ignore=!1,this.markRedraw()},e.prototype.attr=function(t,n){if(typeof t=="string")this.attrKV(t,n);else if(gr(t))for(var i=t,r=xn(i),s=0;s<r.length;s++){var a=r[s];this.attrKV(a,t[a])}return this.markRedraw(),this},e.prototype.saveCurrentToNormalState=function(t){this._innerSaveToNormal(t);for(var n=this._normalState,i=0;i<this.animators.length;i++){var r=this.animators[i],s=r.__fromStateTransition;if(!(r.getLoop()||s&&s!==vh)){var a=r.targetName,o=a?n[a]:n;r.saveTo(o)}}},e.prototype._innerSaveToNormal=function(t){var n=this._normalState;n||(n=this._normalState={}),t.textConfig&&!n.textConfig&&(n.textConfig=this.textConfig),this._savePrimaryToNormal(t,n,_h)},e.prototype._savePrimaryToNormal=function(t,n,i){for(var r=0;r<i.length;r++){var s=i[r];t[s]!=null&&!(s in n)&&(n[s]=this[s])}},e.prototype.hasState=function(){return this.currentStates.length>0},e.prototype.getState=function(t){return this.states[t]},e.prototype.ensureState=function(t){var n=this.states;return n[t]||(n[t]={}),n[t]},e.prototype.clearStates=function(t){this.useState(vh,!1,t)},e.prototype.useState=function(t,n,i,r){var s=t===vh,a=this.hasState();if(!(!a&&s)){var o=this.currentStates,l=this.stateTransition;if(!(di(o,t)>=0&&(n||o.length===1))){var c;if(this.stateProxy&&!s&&(c=this.stateProxy(t)),c||(c=this.states&&this.states[t]),!c&&!s){Wp("State "+t+" not exists.");return}s||this.saveCurrentToNormalState(c);var f=!!(c&&c.hoverLayer||r);f&&this._toggleHoverLayerFlag(!0),this._applyStateObj(t,c,this._normalState,n,!i&&!this.__inHover&&l&&l.duration>0,l);var u=this._textContent,h=this._textGuide;return u&&u.useState(t,n,i,f),h&&h.useState(t,n,i,f),s?(this.currentStates=[],this._normalState={}):n?this.currentStates.push(t):this.currentStates=[t],this._updateAnimationTargets(),this.markRedraw(),!f&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~vn),c}}},e.prototype.useStates=function(t,n,i){if(!t.length)this.clearStates();else{var r=[],s=this.currentStates,a=t.length,o=a===s.length;if(o){for(var l=0;l<a;l++)if(t[l]!==s[l]){o=!1;break}}if(o)return;for(var l=0;l<a;l++){var c=t[l],f=void 0;this.stateProxy&&(f=this.stateProxy(c,t)),f||(f=this.states[c]),f&&r.push(f)}var u=r[a-1],h=!!(u&&u.hoverLayer||i);h&&this._toggleHoverLayerFlag(!0);var d=this._mergeStates(r),v=this.stateTransition;this.saveCurrentToNormalState(d),this._applyStateObj(t.join(","),d,this._normalState,!1,!n&&!this.__inHover&&v&&v.duration>0,v);var _=this._textContent,m=this._textGuide;_&&_.useStates(t,n,h),m&&m.useStates(t,n,h),this._updateAnimationTargets(),this.currentStates=t.slice(),this.markRedraw(),!h&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~vn)}},e.prototype.isSilent=function(){for(var t=this;t;){if(t.silent)return!0;var n=t.__hostTarget;t=n?t.ignoreHostSilent?null:n:t.parent}return!1},e.prototype._updateAnimationTargets=function(){for(var t=0;t<this.animators.length;t++){var n=this.animators[t];n.targetName&&n.changeTarget(this[n.targetName])}},e.prototype.removeState=function(t){var n=di(this.currentStates,t);if(n>=0){var i=this.currentStates.slice();i.splice(n,1),this.useStates(i)}},e.prototype.replaceState=function(t,n,i){var r=this.currentStates.slice(),s=di(r,t),a=di(r,n)>=0;s>=0?a?r.splice(s,1):r[s]=n:i&&!a&&r.push(n),this.useStates(r)},e.prototype.toggleState=function(t,n){n?this.useState(t,!0):this.removeState(t)},e.prototype._mergeStates=function(t){for(var n={},i,r=0;r<t.length;r++){var s=t[r];_e(n,s),s.textConfig&&(i=i||{},_e(i,s.textConfig))}return i&&(n.textConfig=i),n},e.prototype._applyStateObj=function(t,n,i,r,s,a){var o=!(n&&r);n&&n.textConfig?(this.textConfig=_e({},r?this.textConfig:i.textConfig),_e(this.textConfig,n.textConfig)):o&&i.textConfig&&(this.textConfig=i.textConfig);for(var l={},c=!1,f=0;f<_h.length;f++){var u=_h[f],h=s&&OC[u];n&&n[u]!=null?h?(c=!0,l[u]=n[u]):this[u]=n[u]:o&&i[u]!=null&&(h?(c=!0,l[u]=i[u]):this[u]=i[u])}if(!s)for(var f=0;f<this.animators.length;f++){var d=this.animators[f],v=d.targetName;d.getLoop()||d.__changeFinalValue(v?(n||i)[v]:n||i)}c&&this._transitionState(t,l,a)},e.prototype._attachComponent=function(t){if(!(t.__zr&&!t.__hostTarget)&&t!==this){var n=this.__zr;n&&t.addSelfToZr(n),t.__zr=n,t.__hostTarget=this}},e.prototype._detachComponent=function(t){t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__hostTarget=null},e.prototype.getClipPath=function(){return this._clipPath},e.prototype.setClipPath=function(t){this._clipPath&&this._clipPath!==t&&this.removeClipPath(),this._attachComponent(t),this._clipPath=t,this.markRedraw()},e.prototype.removeClipPath=function(){var t=this._clipPath;t&&(this._detachComponent(t),this._clipPath=null,this.markRedraw())},e.prototype.getTextContent=function(){return this._textContent},e.prototype.setTextContent=function(t){var n=this._textContent;n!==t&&(n&&n!==t&&this.removeTextContent(),t.innerTransformable=new ny,this._attachComponent(t),this._textContent=t,this.markRedraw())},e.prototype.setTextConfig=function(t){this.textConfig||(this.textConfig={}),_e(this.textConfig,t),this.markRedraw()},e.prototype.removeTextConfig=function(){this.textConfig=null,this.markRedraw()},e.prototype.removeTextContent=function(){var t=this._textContent;t&&(t.innerTransformable=null,this._detachComponent(t),this._textContent=null,this._innerTextDefaultStyle=null,this.markRedraw())},e.prototype.getTextGuideLine=function(){return this._textGuide},e.prototype.setTextGuideLine=function(t){this._textGuide&&this._textGuide!==t&&this.removeTextGuideLine(),this._attachComponent(t),this._textGuide=t,this.markRedraw()},e.prototype.removeTextGuideLine=function(){var t=this._textGuide;t&&(this._detachComponent(t),this._textGuide=null,this.markRedraw())},e.prototype.markRedraw=function(){this.__dirty|=vn;var t=this.__zr;t&&(this.__inHover?t.refreshHover():t.refresh()),this.__hostTarget&&this.__hostTarget.markRedraw()},e.prototype.dirty=function(){this.markRedraw()},e.prototype._toggleHoverLayerFlag=function(t){this.__inHover=t;var n=this._textContent,i=this._textGuide;n&&(n.__inHover=t),i&&(i.__inHover=t)},e.prototype.addSelfToZr=function(t){if(this.__zr!==t){this.__zr=t;var n=this.animators;if(n)for(var i=0;i<n.length;i++)t.animation.addAnimator(n[i]);this._clipPath&&this._clipPath.addSelfToZr(t),this._textContent&&this._textContent.addSelfToZr(t),this._textGuide&&this._textGuide.addSelfToZr(t)}},e.prototype.removeSelfFromZr=function(t){if(this.__zr){this.__zr=null;var n=this.animators;if(n)for(var i=0;i<n.length;i++)t.animation.removeAnimator(n[i]);this._clipPath&&this._clipPath.removeSelfFromZr(t),this._textContent&&this._textContent.removeSelfFromZr(t),this._textGuide&&this._textGuide.removeSelfFromZr(t)}},e.prototype.animate=function(t,n,i){var r=t?this[t]:this,s=new qp(r,n,i);return t&&(s.targetName=t),this.addAnimator(s,t),s},e.prototype.addAnimator=function(t,n){var i=this.__zr,r=this;t.during(function(){r.updateDuringAnimation(n)}).done(function(){var s=r.animators,a=di(s,t);a>=0&&s.splice(a,1)}),this.animators.push(t),i&&i.animation.addAnimator(t),i&&i.wakeUp()},e.prototype.updateDuringAnimation=function(t){this.markRedraw()},e.prototype.stopAnimation=function(t,n){for(var i=this.animators,r=i.length,s=[],a=0;a<r;a++){var o=i[a];!t||t===o.scope?o.stop(n):s.push(o)}return this.animators=s,this},e.prototype.animateTo=function(t,n,i){gh(this,t,n,i)},e.prototype.animateFrom=function(t,n,i){gh(this,t,n,i,!0)},e.prototype._transitionState=function(t,n,i,r){for(var s=gh(this,n,i,r),a=0;a<s.length;a++)s[a].__fromStateTransition=t},e.prototype.getBoundingRect=function(){return null},e.prototype.getPaintRect=function(){return null},e.initDefaultProps=function(){var t=e.prototype;t.type="element",t.name="",t.ignore=t.silent=t.ignoreHostSilent=t.isGroup=t.draggable=t.dragging=t.ignoreClip=t.__inHover=!1,t.__dirty=vn;function n(i,r,s,a){Object.defineProperty(t,i,{get:function(){if(!this[r]){var l=this[r]=[];o(this,l)}return this[r]},set:function(l){this[s]=l[0],this[a]=l[1],this[r]=l,o(this,l)}});function o(l,c){Object.defineProperty(c,0,{get:function(){return l[s]},set:function(f){l[s]=f}}),Object.defineProperty(c,1,{get:function(){return l[a]},set:function(f){l[a]=f}})}}Object.defineProperty&&(n("position","_legacyPos","x","y"),n("scale","_legacyScale","scaleX","scaleY"),n("origin","_legacyOrigin","originX","originY"))}(),e}();Ix(mu,Na);Ix(mu,ny);function gh(e,t,n,i,r){n=n||{};var s=[];ry(e,"",e,t,n,i,s,r);var a=s.length,o=!1,l=n.done,c=n.aborted,f=function(){o=!0,a--,a<=0&&(o?l&&l():c&&c())},u=function(){a--,a<=0&&(o?l&&l():c&&c())};a||l&&l(),s.length>0&&n.during&&s[0].during(function(v,_){n.during(_)});for(var h=0;h<s.length;h++){var d=s[h];f&&d.done(f),u&&d.aborted(u),n.force&&d.duration(n.duration),d.start(n.easing)}return s}function xh(e,t,n){for(var i=0;i<n;i++)e[i]=t[i]}function HC(e){return Ti(e[0])}function zC(e,t,n){if(Ti(t[n]))if(Ti(e[n])||(e[n]=[]),vA(t[n])){var i=t[n].length;e[n].length!==i&&(e[n]=new t[n].constructor(i),xh(e[n],t[n],i))}else{var r=t[n],s=e[n],a=r.length;if(HC(r))for(var o=r[0].length,l=0;l<a;l++)s[l]?xh(s[l],r[l],o):s[l]=Array.prototype.slice.call(r[l]);else xh(s,r,a);s.length=r.length}else e[n]=t[n]}function VC(e,t){return e===t||Ti(e)&&Ti(t)&&GC(e,t)}function GC(e,t){var n=e.length;if(n!==t.length)return!1;for(var i=0;i<n;i++)if(e[i]!==t[i])return!1;return!0}function ry(e,t,n,i,r,s,a,o){for(var l=xn(i),c=r.duration,f=r.delay,u=r.additive,h=r.setToFinal,d=!gr(s),v=e.animators,_=[],m=0;m<l.length;m++){var p=l[m],g=i[p];if(g!=null&&n[p]!=null&&(d||s[p]))if(gr(g)&&!Ti(g)&&!hu(g)){if(t){o||(n[p]=g,e.updateDuringAnimation(t));continue}ry(e,p,n[p],g,r,s&&s[p],a,o)}else _.push(p);else o||(n[p]=g,e.updateDuringAnimation(t),_.push(p))}var M=_.length;if(!u&&M)for(var S=0;S<v.length;S++){var E=v[S];if(E.targetName===t){var T=E.stopTracks(_);if(T){var C=di(v,E);v.splice(C,1)}}}if(r.force||(_=Vv(_,function(R){return!VC(i[R],n[R])}),M=_.length),M>0||r.force&&!a.length){var L=void 0,y=void 0,b=void 0;if(o){y={},h&&(L={});for(var S=0;S<M;S++){var p=_[S];y[p]=n[p],h?L[p]=i[p]:n[p]=i[p]}}else if(h){b={};for(var S=0;S<M;S++){var p=_[S];b[p]=Sc(n[p]),zC(n,i,p)}}var E=new qp(n,!1,!1,u?Vv(v,function(I){return I.targetName===t}):null);E.targetName=t,r.scope&&(E.scope=r.scope),h&&L&&E.whenWithKeys(0,L,_),b&&E.whenWithKeys(0,b,_),E.whenWithKeys(c==null?500:c,o?y:i,_).delay(f||0),e.addAnimator(E,t),a.push(E)}}var sy=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i.isGroup=!0,i._children=[],i.attr(n),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.children=function(){return this._children.slice()},t.prototype.childAt=function(n){return this._children[n]},t.prototype.childOfName=function(n){for(var i=this._children,r=0;r<i.length;r++)if(i[r].name===n)return i[r]},t.prototype.childCount=function(){return this._children.length},t.prototype.add=function(n){return n&&n!==this&&n.parent!==this&&(this._children.push(n),this._doAdd(n)),this},t.prototype.addBefore=function(n,i){if(n&&n!==this&&n.parent!==this&&i&&i.parent===this){var r=this._children,s=r.indexOf(i);s>=0&&(r.splice(s,0,n),this._doAdd(n))}return this},t.prototype.replace=function(n,i){var r=di(this._children,n);return r>=0&&this.replaceAt(i,r),this},t.prototype.replaceAt=function(n,i){var r=this._children,s=r[i];if(n&&n!==this&&n.parent!==this&&n!==s){r[i]=n,s.parent=null;var a=this.__zr;a&&s.removeSelfFromZr(a),this._doAdd(n)}return this},t.prototype._doAdd=function(n){n.parent&&n.parent.remove(n),n.parent=this;var i=this.__zr;i&&i!==n.__zr&&n.addSelfToZr(i),i&&i.refresh()},t.prototype.remove=function(n){var i=this.__zr,r=this._children,s=di(r,n);return s<0?this:(r.splice(s,1),n.parent=null,i&&n.removeSelfFromZr(i),i&&i.refresh(),this)},t.prototype.removeAll=function(){for(var n=this._children,i=this.__zr,r=0;r<n.length;r++){var s=n[r];i&&s.removeSelfFromZr(i),s.parent=null}return n.length=0,this},t.prototype.eachChild=function(n,i){for(var r=this._children,s=0;s<r.length;s++){var a=r[s];n.call(i,a,s)}return this},t.prototype.traverse=function(n,i){for(var r=0;r<this._children.length;r++){var s=this._children[r],a=n.call(i,s);s.isGroup&&!a&&s.traverse(n,i)}return this},t.prototype.addSelfToZr=function(n){e.prototype.addSelfToZr.call(this,n);for(var i=0;i<this._children.length;i++){var r=this._children[i];r.addSelfToZr(n)}},t.prototype.removeSelfFromZr=function(n){e.prototype.removeSelfFromZr.call(this,n);for(var i=0;i<this._children.length;i++){var r=this._children[i];r.removeSelfFromZr(n)}},t.prototype.getBoundingRect=function(n){for(var i=new ce(0,0,0,0),r=n||this._children,s=[],a=null,o=0;o<r.length;o++){var l=r[o];if(!(l.ignore||l.invisible)){var c=l.getBoundingRect(),f=l.getLocalTransform(s);f?(ce.applyTransform(i,c,f),a=a||i.clone(),a.union(i)):(a=a||c.clone(),a.union(c))}}return a||i},t}(mu);sy.prototype.type="group";/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/var Ec={},ay={};function kC(e){delete ay[e]}function WC(e){if(!e)return!1;if(typeof e=="string")return Jc(e,1)<Yd;if(e.colorStops){for(var t=e.colorStops,n=0,i=t.length,r=0;r<i;r++)n+=Jc(t[r].color,1);return n/=i,n<Yd}return!1}var XC=function(){function e(t,n,i){var r=this;this._sleepAfterStill=10,this._stillFrameAccum=0,this._needsRefresh=!0,this._needsRefreshHover=!0,this._darkMode=!1,i=i||{},this.dom=n,this.id=t;var s=new oC,a=i.renderer||"canvas";Ec[a]||(a=xn(Ec)[0]),i.useDirtyRect=i.useDirtyRect==null?!1:i.useDirtyRect;var o=new Ec[a](n,s,i,t),l=i.ssr||o.ssrOnly;this.storage=s,this.painter=o;var c=!ge.node&&!ge.worker&&!l?new DC(o.getViewportRoot(),o.root):null,f=i.useCoarsePointer,u=f==null||f==="auto"?ge.touchEventsSupported:!!f,h=44,d;u&&(d=Pn(i.pointerSize,h)),this.handler=new Gx(s,o,c,o.root,d),this.animation=new EC({stage:{update:l?null:function(){return r._flush(!0)}}}),l||this.animation.start()}return e.prototype.add=function(t){this._disposed||!t||(this.storage.addRoot(t),t.addSelfToZr(this),this.refresh())},e.prototype.remove=function(t){this._disposed||!t||(this.storage.delRoot(t),t.removeSelfFromZr(this),this.refresh())},e.prototype.configLayer=function(t,n){this._disposed||(this.painter.configLayer&&this.painter.configLayer(t,n),this.refresh())},e.prototype.setBackgroundColor=function(t){this._disposed||(this.painter.setBackgroundColor&&this.painter.setBackgroundColor(t),this.refresh(),this._backgroundColor=t,this._darkMode=WC(t))},e.prototype.getBackgroundColor=function(){return this._backgroundColor},e.prototype.setDarkMode=function(t){this._darkMode=t},e.prototype.isDarkMode=function(){return this._darkMode},e.prototype.refreshImmediately=function(t){this._disposed||(t||this.animation.update(!0),this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1)},e.prototype.refresh=function(){this._disposed||(this._needsRefresh=!0,this.animation.start())},e.prototype.flush=function(){this._disposed||this._flush(!1)},e.prototype._flush=function(t){var n,i=sa();this._needsRefresh&&(n=!0,this.refreshImmediately(t)),this._needsRefreshHover&&(n=!0,this.refreshHoverImmediately());var r=sa();n?(this._stillFrameAccum=0,this.trigger("rendered",{elapsedTime:r-i})):this._sleepAfterStill>0&&(this._stillFrameAccum++,this._stillFrameAccum>this._sleepAfterStill&&this.animation.stop())},e.prototype.setSleepAfterStill=function(t){this._sleepAfterStill=t},e.prototype.wakeUp=function(){this._disposed||(this.animation.start(),this._stillFrameAccum=0)},e.prototype.refreshHover=function(){this._needsRefreshHover=!0},e.prototype.refreshHoverImmediately=function(){this._disposed||(this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.getType()==="canvas"&&this.painter.refreshHover())},e.prototype.resize=function(t){this._disposed||(t=t||{},this.painter.resize(t.width,t.height),this.handler.resize())},e.prototype.clearAnimation=function(){this._disposed||this.animation.clear()},e.prototype.getWidth=function(){if(!this._disposed)return this.painter.getWidth()},e.prototype.getHeight=function(){if(!this._disposed)return this.painter.getHeight()},e.prototype.setCursorStyle=function(t){this._disposed||this.handler.setCursorStyle(t)},e.prototype.findHover=function(t,n){if(!this._disposed)return this.handler.findHover(t,n)},e.prototype.on=function(t,n,i){return this._disposed||this.handler.on(t,n,i),this},e.prototype.off=function(t,n){this._disposed||this.handler.off(t,n)},e.prototype.trigger=function(t,n){this._disposed||this.handler.trigger(t,n)},e.prototype.clear=function(){if(!this._disposed){for(var t=this.storage.getRoots(),n=0;n<t.length;n++)t[n]instanceof sy&&t[n].removeSelfFromZr(this);this.storage.delAllRoots(),this.painter.clear()}},e.prototype.dispose=function(){this._disposed||(this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,this._disposed=!0,kC(this.id))},e}();function WN(e,t){var n=new XC(Dx(),e,t);return ay[n.id]=n,n}function XN(e,t){Ec[e]=t}var Zd=new $o(50);function qC(e){if(typeof e=="string"){var t=Zd.get(e);return t&&t.image}else return e}function oy(e,t,n,i,r){if(e)if(typeof e=="string"){if(t&&t.__zrImageSrc===e||!n)return t;var s=Zd.get(e),a={hostEl:n,cb:i,cbPayload:r};return s?(t=s.image,!vu(t)&&s.pending.push(a)):(t=Es.loadImage(e,__,__),t.__zrImageSrc=e,Zd.put(e,t.__cachedImgObj={image:t,pending:[a]})),t}else return e;else return t}function __(){var e=this.__cachedImgObj;this.onload=this.onerror=this.__cachedImgObj=null;for(var t=0;t<e.pending.length;t++){var n=e.pending[t],i=n.cb;i&&i(this,n.cbPayload),n.hostEl.dirty()}e.pending.length=0}function vu(e){return e&&e.width&&e.height}var yh=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;function YC(e,t,n,i,r,s){if(!n){e.text="",e.isTruncated=!1;return}var a=(t+"").split(`
`);s=ly(n,i,r,s);for(var o=!1,l={},c=0,f=a.length;c<f;c++)cy(l,a[c],s),a[c]=l.textLine,o=o||l.isTruncated;e.text=a.join(`
`),e.isTruncated=o}function ly(e,t,n,i){i=i||{};var r=_e({},i);n=Pn(n,"..."),r.maxIterations=Pn(i.maxIterations,2);var s=r.minChar=Pn(i.minChar,0),a=r.fontMeasureInfo=yi(t),o=a.asciiCharWidth;r.placeholder=Pn(i.placeholder,"");for(var l=e=Math.max(0,e-1),c=0;c<s&&l>=o;c++)l-=o;var f=Si(a,n);return f>l&&(n="",f=0),l=e-f,r.ellipsis=n,r.ellipsisWidth=f,r.contentWidth=l,r.containerWidth=e,r}function cy(e,t,n){var i=n.containerWidth,r=n.contentWidth,s=n.fontMeasureInfo;if(!i){e.textLine="",e.isTruncated=!1;return}var a=Si(s,t);if(a<=i){e.textLine=t,e.isTruncated=!1;return}for(var o=0;;o++){if(a<=r||o>=n.maxIterations){t+=n.ellipsis;break}var l=o===0?$C(t,r,s):a>0?Math.floor(t.length*r/a):0;t=t.substr(0,l),a=Si(s,t)}t===""&&(t=n.placeholder),e.textLine=t,e.isTruncated=!0}function $C(e,t,n){for(var i=0,r=0,s=e.length;r<s&&i<t;r++)i+=iy(n,e.charCodeAt(r));return r}function KC(e,t,n,i){var r=Yp(e),s=t.overflow,a=t.padding,o=a?a[1]+a[3]:0,l=a?a[0]+a[2]:0,c=t.font,f=s==="truncate",u=pu(c),h=Pn(t.lineHeight,u),d=t.lineOverflow==="truncate",v=!1,_=t.width;_==null&&n!=null&&(_=n-o);var m=t.height;m==null&&i!=null&&(m=i-l);var p;_!=null&&(s==="break"||s==="breakAll")?p=r?fy(r,t.font,_,s==="breakAll",0).lines:[]:p=r?r.split(`
`):[];var g=p.length*h;if(m==null&&(m=g),g>m&&d){var M=Math.floor(m/h);v=v||p.length>M,p=p.slice(0,M),g=p.length*h}if(r&&f&&_!=null)for(var S=ly(_,c,t.ellipsis,{minChar:t.truncateMinChar,placeholder:t.placeholder}),E={},T=0;T<p.length;T++)cy(E,p[T],S),p[T]=E.textLine,v=v||E.isTruncated;for(var C=m,L=0,y=yi(c),T=0;T<p.length;T++)L=Math.max(Si(y,p[T]),L);_==null&&(_=L);var b=_;return C+=l,b+=o,{lines:p,height:m,outerWidth:b,outerHeight:C,lineHeight:h,calculatedLineHeight:u,contentWidth:L,contentHeight:g,width:_,isTruncated:v}}var ZC=function(){function e(){}return e}(),g_=function(){function e(t){this.tokens=[],t&&(this.tokens=t)}return e}(),JC=function(){function e(){this.width=0,this.height=0,this.contentWidth=0,this.contentHeight=0,this.outerWidth=0,this.outerHeight=0,this.lines=[],this.isTruncated=!1}return e}();function jC(e,t,n,i,r){var s=new JC,a=Yp(e);if(!a)return s;var o=t.padding,l=o?o[1]+o[3]:0,c=o?o[0]+o[2]:0,f=t.width;f==null&&n!=null&&(f=n-l);var u=t.height;u==null&&i!=null&&(u=i-c);for(var h=t.overflow,d=(h==="break"||h==="breakAll")&&f!=null?{width:f,accumWidth:0,breakAll:h==="breakAll"}:null,v=yh.lastIndex=0,_;(_=yh.exec(a))!=null;){var m=_.index;m>v&&Sh(s,a.substring(v,m),t,d),Sh(s,_[2],t,d,_[1]),v=yh.lastIndex}v<a.length&&Sh(s,a.substring(v,a.length),t,d);var p=[],g=0,M=0,S=h==="truncate",E=t.lineOverflow==="truncate",T={};function C(Q,it,Mt){Q.width=it,Q.lineHeight=Mt,g+=Mt,M=Math.max(M,it)}t:for(var L=0;L<s.lines.length;L++){for(var y=s.lines[L],b=0,R=0,I=0;I<y.tokens.length;I++){var F=y.tokens[I],O=F.styleName&&t.rich[F.styleName]||{},q=F.textPadding=O.padding,V=q?q[1]+q[3]:0,z=F.font=O.font||t.font;F.contentHeight=pu(z);var K=Pn(O.height,F.contentHeight);if(F.innerHeight=K,q&&(K+=q[0]+q[2]),F.height=K,F.lineHeight=yc(O.lineHeight,t.lineHeight,K),F.align=O&&O.align||r,F.verticalAlign=O&&O.verticalAlign||"middle",E&&u!=null&&g+F.lineHeight>u){var dt=s.lines.length;I>0?(y.tokens=y.tokens.slice(0,I),C(y,R,b),s.lines=s.lines.slice(0,L+1)):s.lines=s.lines.slice(0,L),s.isTruncated=s.isTruncated||s.lines.length<dt;break t}var ct=O.width,ht=ct==null||ct==="auto";if(typeof ct=="string"&&ct.charAt(ct.length-1)==="%")F.percentWidth=ct,p.push(F),F.contentWidth=Si(yi(z),F.text);else{if(ht){var Rt=O.backgroundColor,It=Rt&&Rt.image;It&&(It=qC(It),vu(It)&&(F.width=Math.max(F.width,It.width*K/It.height)))}var qt=S&&f!=null?f-R:null;qt!=null&&qt<F.width?!ht||qt<V?(F.text="",F.width=F.contentWidth=0):(YC(T,F.text,qt-V,z,t.ellipsis,{minChar:t.truncateMinChar}),F.text=T.text,s.isTruncated=s.isTruncated||T.isTruncated,F.width=F.contentWidth=Si(yi(z),F.text)):F.contentWidth=Si(yi(z),F.text)}F.width+=V,R+=F.width,O&&(b=Math.max(b,F.lineHeight))}C(y,R,b)}s.outerWidth=s.width=Pn(f,M),s.outerHeight=s.height=Pn(u,g),s.contentHeight=g,s.contentWidth=M,s.outerWidth+=l,s.outerHeight+=c;for(var L=0;L<p.length;L++){var F=p[L],Kt=F.percentWidth;F.width=parseInt(Kt,10)/100*s.width}return s}function Sh(e,t,n,i,r){var s=t==="",a=r&&n.rich[r]||{},o=e.lines,l=a.font||n.font,c=!1,f,u;if(i){var h=a.padding,d=h?h[1]+h[3]:0;if(a.width!=null&&a.width!=="auto"){var v=Jo(a.width,i.width)+d;o.length>0&&v+i.accumWidth>i.width&&(f=t.split(`
`),c=!0),i.accumWidth=v}else{var _=fy(t,l,i.width,i.breakAll,i.accumWidth);i.accumWidth=_.accumWidth+d,u=_.linesWidths,f=_.lines}}f||(f=t.split(`
`));for(var m=yi(l),p=0;p<f.length;p++){var g=f[p],M=new ZC;if(M.styleName=r,M.text=g,M.isLineHolder=!g&&!s,typeof a.width=="number"?M.width=a.width:M.width=u?u[p]:Si(m,g),!p&&!c){var S=(o[o.length-1]||(o[0]=new g_)).tokens,E=S.length;E===1&&S[0].isLineHolder?S[0]=M:(g||!E||s)&&S.push(M)}else o.push(new g_([M]))}}function QC(e){var t=e.charCodeAt(0);return t>=32&&t<=591||t>=880&&t<=4351||t>=4608&&t<=5119||t>=7680&&t<=8303}var tR=uu(",&?/;] ".split(""),function(e,t){return e[t]=!0,e},{});function eR(e){return QC(e)?!!tR[e]:!0}function fy(e,t,n,i,r){for(var s=[],a=[],o="",l="",c=0,f=0,u=yi(t),h=0;h<e.length;h++){var d=e.charAt(h);if(d===`
`){l&&(o+=l,f+=c),s.push(o),a.push(f),o="",l="",c=0,f=0;continue}var v=iy(u,d.charCodeAt(0)),_=i?!1:!eR(d);if(s.length?f+v>n:r+f+v>n){f?(o||l)&&(_?(o||(o=l,l="",c=0,f=c),s.push(o),a.push(f-c),l+=d,c+=v,o="",f=c):(l&&(o+=l,l="",c=0),s.push(o),a.push(f),o=d,f=v)):_?(s.push(l),a.push(c),l=d,c=v):(s.push(d),a.push(v));continue}f+=v,_?(l+=d,c+=v):(l&&(o+=l,l="",c=0),o+=d)}return l&&(o+=l),o&&(s.push(o),a.push(f)),s.length===1&&(f+=r),{accumWidth:f,lines:s,linesWidths:a}}function x_(e,t,n,i,r,s){if(e.baseX=n,e.baseY=i,e.outerWidth=e.outerHeight=null,!!t){var a=t.width*2,o=t.height*2;ce.set(y_,Ea(n,a,r),ys(i,o,s),a,o),ce.intersect(t,y_,null,S_);var l=S_.outIntersectRect;e.outerWidth=l.width,e.outerHeight=l.height,e.baseX=Ea(l.x,l.width,r,!0),e.baseY=ys(l.y,l.height,s,!0)}}var y_=new ce(0,0,0,0),S_={outIntersectRect:{},clamp:!0};function Yp(e){return e!=null?e+="":e=""}function nR(e){var t=Yp(e.text),n=e.font,i=Si(yi(n),t),r=pu(n);return Jd(e,i,r,null)}function Jd(e,t,n,i){var r=new ce(Ea(e.x||0,t,e.textAlign),ys(e.y||0,n,e.textBaseline),t,n),s=i!=null?i:uy(e)?e.lineWidth:0;return s>0&&(r.x-=s/2,r.y-=s/2,r.width+=s,r.height+=s),r}function uy(e){var t=e.stroke;return t!=null&&t!=="none"&&e.lineWidth>0}var jd="__zr_style_"+Math.round(Math.random()*10),Ss={shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,shadowColor:"#000",opacity:1,blend:"source-over"},_u={style:{shadowBlur:!0,shadowOffsetX:!0,shadowOffsetY:!0,shadowColor:!0,opacity:!0}};Ss[jd]=!0;var M_=["z","z2","invisible"],iR=["invisible"],ll=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype._init=function(n){for(var i=xn(n),r=0;r<i.length;r++){var s=i[r];s==="style"?this.useStyle(n[s]):e.prototype.attrKV.call(this,s,n[s])}this.style||this.useStyle({})},t.prototype.beforeBrush=function(){},t.prototype.afterBrush=function(){},t.prototype.innerBeforeBrush=function(){},t.prototype.innerAfterBrush=function(){},t.prototype.shouldBePainted=function(n,i,r,s){var a=this.transform;if(this.ignore||this.invisible||this.style.opacity===0||this.culling&&rR(this,n,i)||a&&!a[0]&&!a[3])return!1;if(r&&this.__clipPaths&&this.__clipPaths.length){for(var o=0;o<this.__clipPaths.length;++o)if(this.__clipPaths[o].isZeroArea())return!1}if(s&&this.parent)for(var l=this.parent;l;){if(l.ignore)return!1;l=l.parent}return!0},t.prototype.contain=function(n,i){return this.rectContain(n,i)},t.prototype.traverse=function(n,i){n.call(i,this)},t.prototype.rectContain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect();return s.contain(r[0],r[1])},t.prototype.getPaintRect=function(){var n=this._paintRect;if(!this._paintRect||this.__dirty){var i=this.transform,r=this.getBoundingRect(),s=this.style,a=s.shadowBlur||0,o=s.shadowOffsetX||0,l=s.shadowOffsetY||0;n=this._paintRect||(this._paintRect=new ce(0,0,0,0)),i?ce.applyTransform(n,r,i):n.copy(r),(a||o||l)&&(n.width+=a*2+Math.abs(o),n.height+=a*2+Math.abs(l),n.x=Math.min(n.x,n.x+o-a),n.y=Math.min(n.y,n.y+l-a));var c=this.dirtyRectTolerance;n.isZero()||(n.x=Math.floor(n.x-c),n.y=Math.floor(n.y-c),n.width=Math.ceil(n.width+1+c*2),n.height=Math.ceil(n.height+1+c*2))}return n},t.prototype.setPrevPaintRect=function(n){n?(this._prevPaintRect=this._prevPaintRect||new ce(0,0,0,0),this._prevPaintRect.copy(n)):this._prevPaintRect=null},t.prototype.getPrevPaintRect=function(){return this._prevPaintRect},t.prototype.animateStyle=function(n){return this.animate("style",n)},t.prototype.updateDuringAnimation=function(n){n==="style"?this.dirtyStyle():this.markRedraw()},t.prototype.attrKV=function(n,i){n!=="style"?e.prototype.attrKV.call(this,n,i):this.style?this.setStyle(i):this.useStyle(i)},t.prototype.setStyle=function(n,i){return typeof n=="string"?this.style[n]=i:_e(this.style,n),this.dirtyStyle(),this},t.prototype.dirtyStyle=function(n){n||this.markRedraw(),this.__dirty|=fo,this._rect&&(this._rect=null)},t.prototype.dirty=function(){this.dirtyStyle()},t.prototype.styleChanged=function(){return!!(this.__dirty&fo)},t.prototype.styleUpdated=function(){this.__dirty&=~fo},t.prototype.createStyle=function(n){return du(Ss,n)},t.prototype.useStyle=function(n){n[jd]||(n=this.createStyle(n)),this.__inHover?this.__hoverStyle=n:this.style=n,this.dirtyStyle()},t.prototype.isStyleObject=function(n){return n[jd]},t.prototype._innerSaveToNormal=function(n){e.prototype._innerSaveToNormal.call(this,n);var i=this._normalState;n.style&&!i.style&&(i.style=this._mergeStyle(this.createStyle(),this.style)),this._savePrimaryToNormal(n,i,M_)},t.prototype._applyStateObj=function(n,i,r,s,a,o){e.prototype._applyStateObj.call(this,n,i,r,s,a,o);var l=!(i&&s),c;if(i&&i.style?a?s?c=i.style:(c=this._mergeStyle(this.createStyle(),r.style),this._mergeStyle(c,i.style)):(c=this._mergeStyle(this.createStyle(),s?this.style:r.style),this._mergeStyle(c,i.style)):l&&(c=r.style),c)if(a){var f=this.style;if(this.style=this.createStyle(l?{}:f),l)for(var u=xn(f),h=0;h<u.length;h++){var d=u[h];d in c&&(c[d]=c[d],this.style[d]=f[d])}for(var v=xn(c),h=0;h<v.length;h++){var d=v[h];this.style[d]=this.style[d]}this._transitionState(n,{style:c},o,this.getAnimationStyleProps())}else this.useStyle(c);for(var _=this.__inHover?iR:M_,h=0;h<_.length;h++){var d=_[h];i&&i[d]!=null?this[d]=i[d]:l&&r[d]!=null&&(this[d]=r[d])}},t.prototype._mergeStates=function(n){for(var i=e.prototype._mergeStates.call(this,n),r,s=0;s<n.length;s++){var a=n[s];a.style&&(r=r||{},this._mergeStyle(r,a.style))}return r&&(i.style=r),i},t.prototype._mergeStyle=function(n,i){return _e(n,i),n},t.prototype.getAnimationStyleProps=function(){return _u},t.initDefaultProps=function(){var n=t.prototype;n.type="displayable",n.invisible=!1,n.z=0,n.z2=0,n.zlevel=0,n.culling=!1,n.cursor="pointer",n.rectHover=!1,n.incremental=!1,n._rect=null,n.dirtyRectTolerance=0,n.__dirty=vn|fo}(),t}(mu),Mh=new ce(0,0,0,0),bh=new ce(0,0,0,0);function rR(e,t,n){return Mh.copy(e.getBoundingRect()),e.transform&&Mh.applyTransform(e.transform),bh.width=t,bh.height=n,!Mh.intersect(bh)}var wn=Math.min,An=Math.max,Th=Math.sin,Eh=Math.cos,Wr=Math.PI*2,Dl=Ia(),Il=Ia(),Nl=Ia();function b_(e,t,n,i,r,s){r[0]=wn(e,n),r[1]=wn(t,i),s[0]=An(e,n),s[1]=An(t,i)}var T_=[],E_=[];function sR(e,t,n,i,r,s,a,o,l,c){var f=$x,u=Ke,h=f(e,n,r,a,T_);l[0]=1/0,l[1]=1/0,c[0]=-1/0,c[1]=-1/0;for(var d=0;d<h;d++){var v=u(e,n,r,a,T_[d]);l[0]=wn(v,l[0]),c[0]=An(v,c[0])}h=f(t,i,s,o,E_);for(var d=0;d<h;d++){var _=u(t,i,s,o,E_[d]);l[1]=wn(_,l[1]),c[1]=An(_,c[1])}l[0]=wn(e,l[0]),c[0]=An(e,c[0]),l[0]=wn(a,l[0]),c[0]=An(a,c[0]),l[1]=wn(t,l[1]),c[1]=An(t,c[1]),l[1]=wn(o,l[1]),c[1]=An(o,c[1])}function aR(e,t,n,i,r,s,a,o){var l=Kx,c=sn,f=An(wn(l(e,n,r),1),0),u=An(wn(l(t,i,s),1),0),h=c(e,n,r,f),d=c(t,i,s,u);a[0]=wn(e,r,h),a[1]=wn(t,s,d),o[0]=An(e,r,h),o[1]=An(t,s,d)}function oR(e,t,n,i,r,s,a,o,l){var c=na,f=ia,u=Math.abs(r-s);if(u%Wr<1e-4&&u>1e-4){o[0]=e-n,o[1]=t-i,l[0]=e+n,l[1]=t+i;return}if(Dl[0]=Eh(r)*n+e,Dl[1]=Th(r)*i+t,Il[0]=Eh(s)*n+e,Il[1]=Th(s)*i+t,c(o,Dl,Il),f(l,Dl,Il),r=r%Wr,r<0&&(r=r+Wr),s=s%Wr,s<0&&(s=s+Wr),r>s&&!a?s+=Wr:r<s&&a&&(r+=Wr),a){var h=s;s=r,r=h}for(var d=0;d<s;d+=Math.PI/2)d>r&&(Nl[0]=Eh(d)*n+e,Nl[1]=Th(d)*i+t,c(o,Nl,o),f(l,Nl,l))}var ee={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},Xr=[],qr=[],si=[],ir=[],ai=[],oi=[],wh=Math.min,Ah=Math.max,Yr=Math.cos,$r=Math.sin,Ui=Math.abs,Qd=Math.PI,ur=Qd*2,Ch=typeof Float32Array!="undefined",Ya=[];function Rh(e){var t=Math.round(e/Qd*1e8)/1e8;return t%2*Qd}function lR(e,t){var n=Rh(e[0]);n<0&&(n+=ur);var i=n-e[0],r=e[1];r+=i,!t&&r-n>=ur?r=n+ur:t&&n-r>=ur?r=n-ur:!t&&n>r?r=n+(ur-Rh(n-r)):t&&n<r&&(r=n-(ur-Rh(r-n))),e[0]=n,e[1]=r}var wa=function(){function e(t){this.dpr=1,this._xi=0,this._yi=0,this._x0=0,this._y0=0,this._len=0,t&&(this._saveData=!1),this._saveData&&(this.data=[])}return e.prototype.increaseVersion=function(){this._version++},e.prototype.getVersion=function(){return this._version},e.prototype.setScale=function(t,n,i){i=i||0,i>0&&(this._ux=Ui(i/jc/t)||0,this._uy=Ui(i/jc/n)||0)},e.prototype.setDPR=function(t){this.dpr=t},e.prototype.setContext=function(t){this._ctx=t},e.prototype.getContext=function(){return this._ctx},e.prototype.beginPath=function(){return this._ctx&&this._ctx.beginPath(),this.reset(),this},e.prototype.reset=function(){this._saveData&&(this._len=0),this._pathSegLen&&(this._pathSegLen=null,this._pathLen=0),this._version++},e.prototype.moveTo=function(t,n){return this._drawPendingPt(),this.addData(ee.M,t,n),this._ctx&&this._ctx.moveTo(t,n),this._x0=t,this._y0=n,this._xi=t,this._yi=n,this},e.prototype.lineTo=function(t,n){var i=Ui(t-this._xi),r=Ui(n-this._yi),s=i>this._ux||r>this._uy;if(this.addData(ee.L,t,n),this._ctx&&s&&this._ctx.lineTo(t,n),s)this._xi=t,this._yi=n,this._pendingPtDist=0;else{var a=i*i+r*r;a>this._pendingPtDist&&(this._pendingPtX=t,this._pendingPtY=n,this._pendingPtDist=a)}return this},e.prototype.bezierCurveTo=function(t,n,i,r,s,a){return this._drawPendingPt(),this.addData(ee.C,t,n,i,r,s,a),this._ctx&&this._ctx.bezierCurveTo(t,n,i,r,s,a),this._xi=s,this._yi=a,this},e.prototype.quadraticCurveTo=function(t,n,i,r){return this._drawPendingPt(),this.addData(ee.Q,t,n,i,r),this._ctx&&this._ctx.quadraticCurveTo(t,n,i,r),this._xi=i,this._yi=r,this},e.prototype.arc=function(t,n,i,r,s,a){this._drawPendingPt(),Ya[0]=r,Ya[1]=s,lR(Ya,a),r=Ya[0],s=Ya[1];var o=s-r;return this.addData(ee.A,t,n,i,i,r,o,0,a?0:1),this._ctx&&this._ctx.arc(t,n,i,r,s,a),this._xi=Yr(s)*i+t,this._yi=$r(s)*i+n,this},e.prototype.arcTo=function(t,n,i,r,s){return this._drawPendingPt(),this._ctx&&this._ctx.arcTo(t,n,i,r,s),this},e.prototype.rect=function(t,n,i,r){return this._drawPendingPt(),this._ctx&&this._ctx.rect(t,n,i,r),this.addData(ee.R,t,n,i,r),this},e.prototype.closePath=function(){this._drawPendingPt(),this.addData(ee.Z);var t=this._ctx,n=this._x0,i=this._y0;return t&&t.closePath(),this._xi=n,this._yi=i,this},e.prototype.fill=function(t){t&&t.fill(),this.toStatic()},e.prototype.stroke=function(t){t&&t.stroke(),this.toStatic()},e.prototype.len=function(){return this._len},e.prototype.setData=function(t){if(this._saveData){var n=t.length;!(this.data&&this.data.length===n)&&Ch&&(this.data=new Float32Array(n));for(var i=0;i<n;i++)this.data[i]=t[i];this._len=n}},e.prototype.appendPath=function(t){if(this._saveData){t instanceof Array||(t=[t]);for(var n=t.length,i=0,r=this._len,s=0;s<n;s++)i+=t[s].len();var a=this.data;if(Ch&&(a instanceof Float32Array||!a)&&(this.data=new Float32Array(r+i),r>0&&a))for(var o=0;o<r;o++)this.data[o]=a[o];for(var s=0;s<n;s++)for(var l=t[s].data,o=0;o<l.length;o++)this.data[r++]=l[o];this._len=r}},e.prototype.addData=function(t,n,i,r,s,a,o,l,c){if(this._saveData){var f=this.data;this._len+arguments.length>f.length&&(this._expandData(),f=this.data);for(var u=0;u<arguments.length;u++)f[this._len++]=arguments[u]}},e.prototype._drawPendingPt=function(){this._pendingPtDist>0&&(this._ctx&&this._ctx.lineTo(this._pendingPtX,this._pendingPtY),this._pendingPtDist=0)},e.prototype._expandData=function(){if(!(this.data instanceof Array)){for(var t=[],n=0;n<this._len;n++)t[n]=this.data[n];this.data=t}},e.prototype.toStatic=function(){if(this._saveData){this._drawPendingPt();var t=this.data;t instanceof Array&&(t.length=this._len,Ch&&this._len>11&&(this.data=new Float32Array(t)))}},e.prototype.getBoundingRect=function(){si[0]=si[1]=ai[0]=ai[1]=Number.MAX_VALUE,ir[0]=ir[1]=oi[0]=oi[1]=-Number.MAX_VALUE;var t=this.data,n=0,i=0,r=0,s=0,a;for(a=0;a<this._len;){var o=t[a++],l=a===1;switch(l&&(n=t[a],i=t[a+1],r=n,s=i),o){case ee.M:n=r=t[a++],i=s=t[a++],ai[0]=r,ai[1]=s,oi[0]=r,oi[1]=s;break;case ee.L:b_(n,i,t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.C:sR(n,i,t[a++],t[a++],t[a++],t[a++],t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.Q:aR(n,i,t[a++],t[a++],t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.A:var c=t[a++],f=t[a++],u=t[a++],h=t[a++],d=t[a++],v=t[a++]+d;a+=1;var _=!t[a++];l&&(r=Yr(d)*u+c,s=$r(d)*h+f),oR(c,f,u,h,d,v,_,ai,oi),n=Yr(v)*u+c,i=$r(v)*h+f;break;case ee.R:r=n=t[a++],s=i=t[a++];var m=t[a++],p=t[a++];b_(r,s,r+m,s+p,ai,oi);break;case ee.Z:n=r,i=s;break}na(si,si,ai),ia(ir,ir,oi)}return a===0&&(si[0]=si[1]=ir[0]=ir[1]=0),new ce(si[0],si[1],ir[0]-si[0],ir[1]-si[1])},e.prototype._calculateLength=function(){var t=this.data,n=this._len,i=this._ux,r=this._uy,s=0,a=0,o=0,l=0;this._pathSegLen||(this._pathSegLen=[]);for(var c=this._pathSegLen,f=0,u=0,h=0;h<n;){var d=t[h++],v=h===1;v&&(s=t[h],a=t[h+1],o=s,l=a);var _=-1;switch(d){case ee.M:s=o=t[h++],a=l=t[h++];break;case ee.L:{var m=t[h++],p=t[h++],g=m-s,M=p-a;(Ui(g)>i||Ui(M)>r||h===n-1)&&(_=Math.sqrt(g*g+M*M),s=m,a=p);break}case ee.C:{var S=t[h++],E=t[h++],m=t[h++],p=t[h++],T=t[h++],C=t[h++];_=cC(s,a,S,E,m,p,T,C,10),s=T,a=C;break}case ee.Q:{var S=t[h++],E=t[h++],m=t[h++],p=t[h++];_=hC(s,a,S,E,m,p,10),s=m,a=p;break}case ee.A:var L=t[h++],y=t[h++],b=t[h++],R=t[h++],I=t[h++],F=t[h++],O=F+I;h+=1,v&&(o=Yr(I)*b+L,l=$r(I)*R+y),_=Ah(b,R)*wh(ur,Math.abs(F)),s=Yr(O)*b+L,a=$r(O)*R+y;break;case ee.R:{o=s=t[h++],l=a=t[h++];var q=t[h++],V=t[h++];_=q*2+V*2;break}case ee.Z:{var g=o-s,M=l-a;_=Math.sqrt(g*g+M*M),s=o,a=l;break}}_>=0&&(c[u++]=_,f+=_)}return this._pathLen=f,f},e.prototype.rebuildPath=function(t,n){var i=this.data,r=this._ux,s=this._uy,a=this._len,o,l,c,f,u,h,d=n<1,v,_,m=0,p=0,g,M=0,S,E;if(!(d&&(this._pathSegLen||this._calculateLength(),v=this._pathSegLen,_=this._pathLen,g=n*_,!g)))t:for(var T=0;T<a;){var C=i[T++],L=T===1;switch(L&&(c=i[T],f=i[T+1],o=c,l=f),C!==ee.L&&M>0&&(t.lineTo(S,E),M=0),C){case ee.M:o=c=i[T++],l=f=i[T++],t.moveTo(c,f);break;case ee.L:{u=i[T++],h=i[T++];var y=Ui(u-c),b=Ui(h-f);if(y>r||b>s){if(d){var R=v[p++];if(m+R>g){var I=(g-m)/R;t.lineTo(c*(1-I)+u*I,f*(1-I)+h*I);break t}m+=R}t.lineTo(u,h),c=u,f=h,M=0}else{var F=y*y+b*b;F>M&&(S=u,E=h,M=F)}break}case ee.C:{var O=i[T++],q=i[T++],V=i[T++],z=i[T++],K=i[T++],dt=i[T++];if(d){var R=v[p++];if(m+R>g){var I=(g-m)/R;Kc(c,O,V,K,I,Xr),Kc(f,q,z,dt,I,qr),t.bezierCurveTo(Xr[1],qr[1],Xr[2],qr[2],Xr[3],qr[3]);break t}m+=R}t.bezierCurveTo(O,q,V,z,K,dt),c=K,f=dt;break}case ee.Q:{var O=i[T++],q=i[T++],V=i[T++],z=i[T++];if(d){var R=v[p++];if(m+R>g){var I=(g-m)/R;Zc(c,O,V,I,Xr),Zc(f,q,z,I,qr),t.quadraticCurveTo(Xr[1],qr[1],Xr[2],qr[2]);break t}m+=R}t.quadraticCurveTo(O,q,V,z),c=V,f=z;break}case ee.A:var ct=i[T++],ht=i[T++],Rt=i[T++],It=i[T++],qt=i[T++],Kt=i[T++],Q=i[T++],it=!i[T++],Mt=Rt>It?Rt:It,Ut=Ui(Rt-It)>.001,mt=qt+Kt,bt=!1;if(d){var R=v[p++];m+R>g&&(mt=qt+Kt*(g-m)/R,bt=!0),m+=R}if(Ut&&t.ellipse?t.ellipse(ct,ht,Rt,It,Q,qt,mt,it):t.arc(ct,ht,Mt,qt,mt,it),bt)break t;L&&(o=Yr(qt)*Rt+ct,l=$r(qt)*It+ht),c=Yr(mt)*Rt+ct,f=$r(mt)*It+ht;break;case ee.R:o=c=i[T],l=f=i[T+1],u=i[T++],h=i[T++];var D=i[T++],U=i[T++];if(d){var R=v[p++];if(m+R>g){var G=g-m;t.moveTo(u,h),t.lineTo(u+wh(G,D),h),G-=D,G>0&&t.lineTo(u+D,h+wh(G,U)),G-=U,G>0&&t.lineTo(u+Ah(D-G,0),h+U),G-=D,G>0&&t.lineTo(u,h+Ah(U-G,0));break t}m+=R}t.rect(u,h,D,U);break;case ee.Z:if(d){var R=v[p++];if(m+R>g){var I=(g-m)/R;t.lineTo(c*(1-I)+o*I,f*(1-I)+l*I);break t}m+=R}t.closePath(),c=o,f=l}}},e.prototype.clone=function(){var t=new e,n=this.data;return t.data=n.slice?n.slice():Array.prototype.slice.call(n),t._len=this._len,t},e.prototype.canSave=function(){return!!this._saveData},e.CMD=ee,e.initDefaultProps=function(){var t=e.prototype;t._saveData=!0,t._ux=0,t._uy=0,t._pendingPtDist=0,t._version=0}(),e}();function Bs(e,t,n,i,r,s,a){if(r===0)return!1;var o=r,l=0,c=e;if(a>t+o&&a>i+o||a<t-o&&a<i-o||s>e+o&&s>n+o||s<e-o&&s<n-o)return!1;if(e!==n)l=(t-i)/(e-n),c=(e*i-n*t)/(e-n);else return Math.abs(s-e)<=o/2;var f=l*s-a+c,u=f*f/(l*l+1);return u<=o/2*o/2}function cR(e,t,n,i,r,s,a,o,l,c,f){if(l===0)return!1;var u=l;if(f>t+u&&f>i+u&&f>s+u&&f>o+u||f<t-u&&f<i-u&&f<s-u&&f<o-u||c>e+u&&c>n+u&&c>r+u&&c>a+u||c<e-u&&c<n-u&&c<r-u&&c<a-u)return!1;var h=lC(e,t,n,i,r,s,a,o,c,f);return h<=u/2}function fR(e,t,n,i,r,s,a,o,l){if(a===0)return!1;var c=a;if(l>t+c&&l>i+c&&l>s+c||l<t-c&&l<i-c&&l<s-c||o>e+c&&o>n+c&&o>r+c||o<e-c&&o<n-c&&o<r-c)return!1;var f=uC(e,t,n,i,r,s,o,l);return f<=c/2}var w_=Math.PI*2;function Fl(e){return e%=w_,e<0&&(e+=w_),e}var $a=Math.PI*2;function uR(e,t,n,i,r,s,a,o,l){if(a===0)return!1;var c=a;o-=e,l-=t;var f=Math.sqrt(o*o+l*l);if(f-c>n||f+c<n)return!1;if(Math.abs(i-r)%$a<1e-4)return!0;if(s){var u=i;i=Fl(r),r=Fl(u)}else i=Fl(i),r=Fl(r);i>r&&(r+=$a);var h=Math.atan2(l,o);return h<0&&(h+=$a),h>=i&&h<=r||h+$a>=i&&h+$a<=r}function Kr(e,t,n,i,r,s){if(s>t&&s>i||s<t&&s<i||i===t)return 0;var a=(s-t)/(i-t),o=i<t?1:-1;(a===1||a===0)&&(o=i<t?.5:-.5);var l=a*(n-e)+e;return l===r?1/0:l>r?o:0}var rr=wa.CMD,Zr=Math.PI*2,hR=1e-4;function dR(e,t){return Math.abs(e-t)<hR}var Ye=[-1,-1,-1],Tn=[-1,-1];function pR(){var e=Tn[0];Tn[0]=Tn[1],Tn[1]=e}function mR(e,t,n,i,r,s,a,o,l,c){if(c>t&&c>i&&c>s&&c>o||c<t&&c<i&&c<s&&c<o)return 0;var f=Yx(t,i,s,o,c,Ye);if(f===0)return 0;for(var u=0,h=-1,d=void 0,v=void 0,_=0;_<f;_++){var m=Ye[_],p=m===0||m===1?.5:1,g=Ke(e,n,r,a,m);g<l||(h<0&&(h=$x(t,i,s,o,Tn),Tn[1]<Tn[0]&&h>1&&pR(),d=Ke(t,i,s,o,Tn[0]),h>1&&(v=Ke(t,i,s,o,Tn[1]))),h===2?m<Tn[0]?u+=d<t?p:-p:m<Tn[1]?u+=v<d?p:-p:u+=o<v?p:-p:m<Tn[0]?u+=d<t?p:-p:u+=o<d?p:-p)}return u}function vR(e,t,n,i,r,s,a,o){if(o>t&&o>i&&o>s||o<t&&o<i&&o<s)return 0;var l=fC(t,i,s,o,Ye);if(l===0)return 0;var c=Kx(t,i,s);if(c>=0&&c<=1){for(var f=0,u=sn(t,i,s,c),h=0;h<l;h++){var d=Ye[h]===0||Ye[h]===1?.5:1,v=sn(e,n,r,Ye[h]);v<a||(Ye[h]<c?f+=u<t?d:-d:f+=s<u?d:-d)}return f}else{var d=Ye[0]===0||Ye[0]===1?.5:1,v=sn(e,n,r,Ye[0]);return v<a?0:s<t?d:-d}}function _R(e,t,n,i,r,s,a,o){if(o-=t,o>n||o<-n)return 0;var l=Math.sqrt(n*n-o*o);Ye[0]=-l,Ye[1]=l;var c=Math.abs(i-r);if(c<1e-4)return 0;if(c>=Zr-1e-4){i=0,r=Zr;var f=s?1:-1;return a>=Ye[0]+e&&a<=Ye[1]+e?f:0}if(i>r){var u=i;i=r,r=u}i<0&&(i+=Zr,r+=Zr);for(var h=0,d=0;d<2;d++){var v=Ye[d];if(v+e>a){var _=Math.atan2(o,v),f=s?1:-1;_<0&&(_=Zr+_),(_>=i&&_<=r||_+Zr>=i&&_+Zr<=r)&&(_>Math.PI/2&&_<Math.PI*1.5&&(f=-f),h+=f)}}return h}function hy(e,t,n,i,r){for(var s=e.data,a=e.len(),o=0,l=0,c=0,f=0,u=0,h,d,v=0;v<a;){var _=s[v++],m=v===1;switch(_===rr.M&&v>1&&(n||(o+=Kr(l,c,f,u,i,r))),m&&(l=s[v],c=s[v+1],f=l,u=c),_){case rr.M:f=s[v++],u=s[v++],l=f,c=u;break;case rr.L:if(n){if(Bs(l,c,s[v],s[v+1],t,i,r))return!0}else o+=Kr(l,c,s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case rr.C:if(n){if(cR(l,c,s[v++],s[v++],s[v++],s[v++],s[v],s[v+1],t,i,r))return!0}else o+=mR(l,c,s[v++],s[v++],s[v++],s[v++],s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case rr.Q:if(n){if(fR(l,c,s[v++],s[v++],s[v],s[v+1],t,i,r))return!0}else o+=vR(l,c,s[v++],s[v++],s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case rr.A:var p=s[v++],g=s[v++],M=s[v++],S=s[v++],E=s[v++],T=s[v++];v+=1;var C=!!(1-s[v++]);h=Math.cos(E)*M+p,d=Math.sin(E)*S+g,m?(f=h,u=d):o+=Kr(l,c,h,d,i,r);var L=(i-p)*S/M+p;if(n){if(uR(p,g,S,E,E+T,C,t,L,r))return!0}else o+=_R(p,g,S,E,E+T,C,L,r);l=Math.cos(E+T)*M+p,c=Math.sin(E+T)*S+g;break;case rr.R:f=l=s[v++],u=c=s[v++];var y=s[v++],b=s[v++];if(h=f+y,d=u+b,n){if(Bs(f,u,h,u,t,i,r)||Bs(h,u,h,d,t,i,r)||Bs(h,d,f,d,t,i,r)||Bs(f,d,f,u,t,i,r))return!0}else o+=Kr(h,u,h,d,i,r),o+=Kr(f,d,f,u,i,r);break;case rr.Z:if(n){if(Bs(l,c,f,u,t,i,r))return!0}else o+=Kr(l,c,f,u,i,r);l=f,c=u;break}}return!n&&!dR(c,u)&&(o+=Kr(l,c,f,u,i,r)||0),o!==0}function gR(e,t,n){return hy(e,0,!1,t,n)}function xR(e,t,n,i){return hy(e,t,!0,n,i)}var dy=Ps({fill:"#000",stroke:null,strokePercent:1,fillOpacity:1,strokeOpacity:1,lineDashOffset:0,lineWidth:1,lineCap:"butt",miterLimit:10,strokeNoScale:!1,strokeFirst:!1},Ss),yR={style:Ps({fill:!0,stroke:!0,strokePercent:!0,fillOpacity:!0,strokeOpacity:!0,lineDashOffset:!0,lineWidth:!0,miterLimit:!0},_u.style)},Ph=Zo.concat(["invisible","culling","z","z2","zlevel","parent"]),Ge=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.update=function(){var n=this;e.prototype.update.call(this);var i=this.style;if(i.decal){var r=this._decalEl=this._decalEl||new t;r.buildPath===t.prototype.buildPath&&(r.buildPath=function(l){n.buildPath(l,n.shape)}),r.silent=!0;var s=r.style;for(var a in i)s[a]!==i[a]&&(s[a]=i[a]);s.fill=i.fill?i.decal:null,s.decal=null,s.shadowColor=null,i.strokeFirst&&(s.stroke=null);for(var o=0;o<Ph.length;++o)r[Ph[o]]=this[Ph[o]];r.__dirty|=vn}else this._decalEl&&(this._decalEl=null)},t.prototype.getDecalElement=function(){return this._decalEl},t.prototype._init=function(n){var i=xn(n);this.shape=this.getDefaultShape();var r=this.getDefaultStyle();r&&this.useStyle(r);for(var s=0;s<i.length;s++){var a=i[s],o=n[a];a==="style"?this.style?_e(this.style,o):this.useStyle(o):a==="shape"?_e(this.shape,o):e.prototype.attrKV.call(this,a,o)}this.style||this.useStyle({})},t.prototype.getDefaultStyle=function(){return null},t.prototype.getDefaultShape=function(){return{}},t.prototype.canBeInsideText=function(){return this.hasFill()},t.prototype.getInsideTextFill=function(){var n=this.style.fill;if(n!=="none"){if(Xc(n)){var i=Jc(n,0);return i>.5?$d:i>.2?IC:Kd}else if(n)return Kd}return $d},t.prototype.getInsideTextStroke=function(n){var i=this.style.fill;if(Xc(i)){var r=this.__zr,s=!!(r&&r.isDarkMode()),a=Jc(n,0)<Yd;if(s===a)return i}},t.prototype.buildPath=function(n,i,r){},t.prototype.pathUpdated=function(){this.__dirty&=~ea},t.prototype.getUpdatedPathProxy=function(n){return!this.path&&this.createPathProxy(),this.path.beginPath(),this.buildPath(this.path,this.shape,n),this.path},t.prototype.createPathProxy=function(){this.path=new wa(!1)},t.prototype.hasStroke=function(){var n=this.style,i=n.stroke;return!(i==null||i==="none"||!(n.lineWidth>0))},t.prototype.hasFill=function(){var n=this.style,i=n.fill;return i!=null&&i!=="none"},t.prototype.getBoundingRect=function(){var n=this._rect,i=this.style,r=!n;if(r){var s=!1;this.path||(s=!0,this.createPathProxy());var a=this.path;(s||this.__dirty&ea)&&(a.beginPath(),this.buildPath(a,this.shape,!1),this.pathUpdated()),n=a.getBoundingRect()}if(this._rect=n,this.hasStroke()&&this.path&&this.path.len()>0){var o=this._rectStroke||(this._rectStroke=n.clone());if(this.__dirty||r){o.copy(n);var l=i.strokeNoScale?this.getLineScale():1,c=i.lineWidth;if(!this.hasFill()){var f=this.strokeContainThreshold;c=Math.max(c,f==null?4:f)}l>1e-10&&(o.width+=c/l,o.height+=c/l,o.x-=c/l/2,o.y-=c/l/2)}return o}return n},t.prototype.contain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect(),a=this.style;if(n=r[0],i=r[1],s.contain(n,i)){var o=this.path;if(this.hasStroke()){var l=a.lineWidth,c=a.strokeNoScale?this.getLineScale():1;if(c>1e-10&&(this.hasFill()||(l=Math.max(l,this.strokeContainThreshold)),xR(o,l/c,n,i)))return!0}if(this.hasFill())return gR(o,n,i)}return!1},t.prototype.dirtyShape=function(){this.__dirty|=ea,this._rect&&(this._rect=null),this._decalEl&&this._decalEl.dirtyShape(),this.markRedraw()},t.prototype.dirty=function(){this.dirtyStyle(),this.dirtyShape()},t.prototype.animateShape=function(n){return this.animate("shape",n)},t.prototype.updateDuringAnimation=function(n){n==="style"?this.dirtyStyle():n==="shape"?this.dirtyShape():this.markRedraw()},t.prototype.attrKV=function(n,i){n==="shape"?this.setShape(i):e.prototype.attrKV.call(this,n,i)},t.prototype.setShape=function(n,i){var r=this.shape;return r||(r=this.shape={}),typeof n=="string"?r[n]=i:_e(r,n),this.dirtyShape(),this},t.prototype.shapeChanged=function(){return!!(this.__dirty&ea)},t.prototype.createStyle=function(n){return du(dy,n)},t.prototype._innerSaveToNormal=function(n){e.prototype._innerSaveToNormal.call(this,n);var i=this._normalState;n.shape&&!i.shape&&(i.shape=_e({},this.shape))},t.prototype._applyStateObj=function(n,i,r,s,a,o){e.prototype._applyStateObj.call(this,n,i,r,s,a,o);var l=!(i&&s),c;if(i&&i.shape?a?s?c=i.shape:(c=_e({},r.shape),_e(c,i.shape)):(c=_e({},s?this.shape:r.shape),_e(c,i.shape)):l&&(c=r.shape),c)if(a){this.shape=_e({},this.shape);for(var f={},u=xn(c),h=0;h<u.length;h++){var d=u[h];typeof c[d]=="object"?this.shape[d]=c[d]:f[d]=c[d]}this._transitionState(n,{shape:f},o)}else this.shape=c,this.dirtyShape()},t.prototype._mergeStates=function(n){for(var i=e.prototype._mergeStates.call(this,n),r,s=0;s<n.length;s++){var a=n[s];a.shape&&(r=r||{},this._mergeStyle(r,a.shape))}return r&&(i.shape=r),i},t.prototype.getAnimationStyleProps=function(){return yR},t.prototype.isZeroArea=function(){return!1},t.extend=function(n){var i=function(s){ue(a,s);function a(o){var l=s.call(this,o)||this;return n.init&&n.init.call(l,o),l}return a.prototype.getDefaultStyle=function(){return ba(n.style)},a.prototype.getDefaultShape=function(){return ba(n.shape)},a}(t);for(var r in n)typeof n[r]=="function"&&(i.prototype[r]=n[r]);return i},t.initDefaultProps=function(){var n=t.prototype;n.type="path",n.strokeContainThreshold=5,n.segmentIgnoreThreshold=0,n.subPixelOptimize=!1,n.autoBatch=!1,n.__dirty=vn|fo|ea}(),t}(ll),SR=Ps({strokeFirst:!0,font:Cr,x:0,y:0,textAlign:"left",textBaseline:"top",miterLimit:2},dy),Qc=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.hasStroke=function(){return uy(this.style)},t.prototype.hasFill=function(){var n=this.style,i=n.fill;return i!=null&&i!=="none"},t.prototype.createStyle=function(n){return du(SR,n)},t.prototype.setBoundingRect=function(n){this._rect=n},t.prototype.getBoundingRect=function(){return this._rect||(this._rect=nR(this.style)),this._rect},t.initDefaultProps=function(){var n=t.prototype;n.dirtyRectTolerance=10}(),t}(ll);Qc.prototype.type="tspan";var MR=Ps({x:0,y:0},Ss),bR={style:Ps({x:!0,y:!0,width:!0,height:!0,sx:!0,sy:!0,sWidth:!0,sHeight:!0},_u.style)};function TR(e){return!!(e&&typeof e!="string"&&e.width&&e.height)}var $p=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.createStyle=function(n){return du(MR,n)},t.prototype._getSize=function(n){var i=this.style,r=i[n];if(r!=null)return r;var s=TR(i.image)?i.image:this.__image;if(!s)return 0;var a=n==="width"?"height":"width",o=i[a];return o==null?s[n]:s[n]/s[a]*o},t.prototype.getWidth=function(){return this._getSize("width")},t.prototype.getHeight=function(){return this._getSize("height")},t.prototype.getAnimationStyleProps=function(){return bR},t.prototype.getBoundingRect=function(){var n=this.style;return this._rect||(this._rect=new ce(n.x||0,n.y||0,this.getWidth(),this.getHeight())),this._rect},t}(ll);$p.prototype.type="image";function ER(e,t){var n=t.x,i=t.y,r=t.width,s=t.height,a=t.r,o,l,c,f;r<0&&(n=n+r,r=-r),s<0&&(i=i+s,s=-s),typeof a=="number"?o=l=c=f=a:a instanceof Array?a.length===1?o=l=c=f=a[0]:a.length===2?(o=c=a[0],l=f=a[1]):a.length===3?(o=a[0],l=f=a[1],c=a[2]):(o=a[0],l=a[1],c=a[2],f=a[3]):o=l=c=f=0;var u;o+l>r&&(u=o+l,o*=r/u,l*=r/u),c+f>r&&(u=c+f,c*=r/u,f*=r/u),l+c>s&&(u=l+c,l*=s/u,c*=s/u),o+f>s&&(u=o+f,o*=s/u,f*=s/u),e.moveTo(n+o,i),e.lineTo(n+r-l,i),l!==0&&e.arc(n+r-l,i+l,l,-Math.PI/2,0),e.lineTo(n+r,i+s-c),c!==0&&e.arc(n+r-c,i+s-c,c,0,Math.PI/2),e.lineTo(n+f,i+s),f!==0&&e.arc(n+f,i+s-f,f,Math.PI/2,Math.PI),e.lineTo(n,i+o),o!==0&&e.arc(n+o,i+o,o,Math.PI,Math.PI*1.5)}var aa=Math.round;function wR(e,t,n){if(t){var i=t.x1,r=t.x2,s=t.y1,a=t.y2;e.x1=i,e.x2=r,e.y1=s,e.y2=a;var o=n&&n.lineWidth;return o&&(aa(i*2)===aa(r*2)&&(e.x1=e.x2=oa(i,o,!0)),aa(s*2)===aa(a*2)&&(e.y1=e.y2=oa(s,o,!0))),e}}function AR(e,t,n){if(t){var i=t.x,r=t.y,s=t.width,a=t.height;e.x=i,e.y=r,e.width=s,e.height=a;var o=n&&n.lineWidth;return o&&(e.x=oa(i,o,!0),e.y=oa(r,o,!0),e.width=Math.max(oa(i+s,o,!1)-e.x,s===0?0:1),e.height=Math.max(oa(r+a,o,!1)-e.y,a===0?0:1)),e}}function oa(e,t,n){if(!t)return e;var i=aa(e*2);return(i+aa(t))%2===0?i/2:(i+(n?1:-1))/2}var CR=function(){function e(){this.x=0,this.y=0,this.width=0,this.height=0}return e}(),RR={},py=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new CR},t.prototype.buildPath=function(n,i){var r,s,a,o;if(this.subPixelOptimize){var l=AR(RR,i,this.style);r=l.x,s=l.y,a=l.width,o=l.height,l.r=i.r,i=l}else r=i.x,s=i.y,a=i.width,o=i.height;i.r?ER(n,i):n.rect(r,s,a,o)},t.prototype.isZeroArea=function(){return!this.shape.width||!this.shape.height},t}(Ge);py.prototype.type="rect";var A_={fill:"#000"},C_=2,li={},PR={style:Ps({fill:!0,stroke:!0,fillOpacity:!0,strokeOpacity:!0,lineWidth:!0,fontSize:!0,lineHeight:!0,width:!0,height:!0,textShadowColor:!0,textShadowBlur:!0,textShadowOffsetX:!0,textShadowOffsetY:!0,backgroundColor:!0,padding:!0,borderColor:!0,borderWidth:!0,borderRadius:!0},_u.style)},LR=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i.type="text",i._children=[],i._defaultStyle=A_,i.attr(n),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.update=function(){e.prototype.update.call(this),this.styleChanged()&&this._updateSubTexts();for(var n=0;n<this._children.length;n++){var i=this._children[n];i.zlevel=this.zlevel,i.z=this.z,i.z2=this.z2,i.culling=this.culling,i.cursor=this.cursor,i.invisible=this.invisible}},t.prototype.updateTransform=function(){var n=this.innerTransformable;n?(n.updateTransform(),n.transform&&(this.transform=n.transform)):e.prototype.updateTransform.call(this)},t.prototype.getLocalTransform=function(n){var i=this.innerTransformable;return i?i.getLocalTransform(n):e.prototype.getLocalTransform.call(this,n)},t.prototype.getComputedTransform=function(){return this.__hostTarget&&(this.__hostTarget.getComputedTransform(),this.__hostTarget.updateInnerText(!0)),e.prototype.getComputedTransform.call(this)},t.prototype._updateSubTexts=function(){this._childCursor=0,UR(this.style),this.style.rich?this._updateRichTexts():this._updatePlainTexts(),this._children.length=this._childCursor,this.styleUpdated()},t.prototype.addSelfToZr=function(n){e.prototype.addSelfToZr.call(this,n);for(var i=0;i<this._children.length;i++)this._children[i].__zr=n},t.prototype.removeSelfFromZr=function(n){e.prototype.removeSelfFromZr.call(this,n);for(var i=0;i<this._children.length;i++)this._children[i].__zr=null},t.prototype.getBoundingRect=function(){if(this.styleChanged()&&this._updateSubTexts(),!this._rect){for(var n=new ce(0,0,0,0),i=this._children,r=[],s=null,a=0;a<i.length;a++){var o=i[a],l=o.getBoundingRect(),c=o.getLocalTransform(r);c?(n.copy(l),n.applyTransform(c),s=s||n.clone(),s.union(n)):(s=s||l.clone(),s.union(l))}this._rect=s||n}return this._rect},t.prototype.setDefaultTextStyle=function(n){this._defaultStyle=n||A_},t.prototype.setTextContent=function(n){},t.prototype._mergeStyle=function(n,i){if(!i)return n;var r=i.rich,s=n.rich||r&&{};return _e(n,i),r&&s?(this._mergeRich(s,r),n.rich=s):s&&(n.rich=s),n},t.prototype._mergeRich=function(n,i){for(var r=xn(i),s=0;s<r.length;s++){var a=r[s];n[a]=n[a]||{},_e(n[a],i[a])}},t.prototype.getAnimationStyleProps=function(){return PR},t.prototype._getOrCreateChild=function(n){var i=this._children[this._childCursor];return(!i||!(i instanceof n))&&(i=new n),this._children[this._childCursor++]=i,i.__zr=this.__zr,i.parent=this,i},t.prototype._updatePlainTexts=function(){var n=this.style,i=n.font||Cr,r=n.padding,s=this._defaultStyle,a=n.x||0,o=n.y||0,l=n.align||s.align||"left",c=n.verticalAlign||s.verticalAlign||"top";x_(li,s.overflowRect,a,o,l,c),a=li.baseX,o=li.baseY;var f=F_(n),u=KC(f,n,li.outerWidth,li.outerHeight),h=Lh(n),d=!!n.backgroundColor,v=u.outerHeight,_=u.outerWidth,m=u.lines,p=u.lineHeight;this.isTruncated=!!u.isTruncated;var g=a,M=ys(o,u.contentHeight,c);if(h||r){var S=Ea(a,_,l),E=ys(o,v,c);h&&this._renderBackground(n,n,S,E,_,v)}M+=p/2,r&&(g=N_(a,l,r),c==="top"?M+=r[0]:c==="bottom"&&(M-=r[2]));for(var T=0,C=!1,L=!1,y=I_("fill"in n?n.fill:(L=!0,s.fill)),b=D_("stroke"in n?n.stroke:!d&&(!s.autoStroke||L)?(T=C_,C=!0,s.stroke):null),R=n.textShadowBlur>0,I=0;I<m.length;I++){var F=this._getOrCreateChild(Qc),O=F.createStyle();F.useStyle(O),O.text=m[I],O.x=g,O.y=M,O.textAlign=l,O.textBaseline="middle",O.opacity=n.opacity,O.strokeFirst=!0,R&&(O.shadowBlur=n.textShadowBlur||0,O.shadowColor=n.textShadowColor||"transparent",O.shadowOffsetX=n.textShadowOffsetX||0,O.shadowOffsetY=n.textShadowOffsetY||0),O.stroke=b,O.fill=y,b&&(O.lineWidth=n.lineWidth||T,O.lineDash=n.lineDash,O.lineDashOffset=n.lineDashOffset||0),O.font=i,P_(O,n),M+=p,F.setBoundingRect(Jd(O,u.contentWidth,u.calculatedLineHeight,C?0:null))}},t.prototype._updateRichTexts=function(){var n=this.style,i=this._defaultStyle,r=n.align||i.align,s=n.verticalAlign||i.verticalAlign,a=n.x||0,o=n.y||0;x_(li,i.overflowRect,a,o,r,s),a=li.baseX,o=li.baseY;var l=F_(n),c=jC(l,n,li.outerWidth,li.outerHeight,r),f=c.width,u=c.outerWidth,h=c.outerHeight,d=n.padding;this.isTruncated=!!c.isTruncated;var v=Ea(a,u,r),_=ys(o,h,s),m=v,p=_;d&&(m+=d[3],p+=d[0]);var g=m+f;Lh(n)&&this._renderBackground(n,n,v,_,u,h);for(var M=!!n.backgroundColor,S=0;S<c.lines.length;S++){for(var E=c.lines[S],T=E.tokens,C=T.length,L=E.lineHeight,y=E.width,b=0,R=m,I=g,F=C-1,O=void 0;b<C&&(O=T[b],!O.align||O.align==="left");)this._placeToken(O,n,L,p,R,"left",M),y-=O.width,R+=O.width,b++;for(;F>=0&&(O=T[F],O.align==="right");)this._placeToken(O,n,L,p,I,"right",M),y-=O.width,I-=O.width,F--;for(R+=(f-(R-m)-(g-I)-y)/2;b<=F;)O=T[b],this._placeToken(O,n,L,p,R+O.width/2,"center",M),R+=O.width,b++;p+=L}},t.prototype._placeToken=function(n,i,r,s,a,o,l){var c=i.rich[n.styleName]||{};c.text=n.text;var f=n.verticalAlign,u=s+r/2;f==="top"?u=s+n.height/2:f==="bottom"&&(u=s+r-n.height/2);var h=!n.isLineHolder&&Lh(c);h&&this._renderBackground(c,i,o==="right"?a-n.width:o==="center"?a-n.width/2:a,u-n.height/2,n.width,n.height);var d=!!c.backgroundColor,v=n.textPadding;v&&(a=N_(a,o,v),u-=n.height/2-v[0]-n.innerHeight/2);var _=this._getOrCreateChild(Qc),m=_.createStyle();_.useStyle(m);var p=this._defaultStyle,g=!1,M=0,S=!1,E=I_("fill"in c?c.fill:"fill"in i?i.fill:(g=!0,p.fill)),T=D_("stroke"in c?c.stroke:"stroke"in i?i.stroke:!d&&!l&&(!p.autoStroke||g)?(M=C_,S=!0,p.stroke):null),C=c.textShadowBlur>0||i.textShadowBlur>0;m.text=n.text,m.x=a,m.y=u,C&&(m.shadowBlur=c.textShadowBlur||i.textShadowBlur||0,m.shadowColor=c.textShadowColor||i.textShadowColor||"transparent",m.shadowOffsetX=c.textShadowOffsetX||i.textShadowOffsetX||0,m.shadowOffsetY=c.textShadowOffsetY||i.textShadowOffsetY||0),m.textAlign=o,m.textBaseline="middle",m.font=n.font||Cr,m.opacity=yc(c.opacity,i.opacity,1),P_(m,c),T&&(m.lineWidth=yc(c.lineWidth,i.lineWidth,M),m.lineDash=Pn(c.lineDash,i.lineDash),m.lineDashOffset=i.lineDashOffset||0,m.stroke=T),E&&(m.fill=E),_.setBoundingRect(Jd(m,n.contentWidth,n.contentHeight,S?0:null))},t.prototype._renderBackground=function(n,i,r,s,a,o){var l=n.backgroundColor,c=n.borderWidth,f=n.borderColor,u=l&&l.image,h=l&&!u,d=n.borderRadius,v=this,_,m;if(h||n.lineHeight||c&&f){_=this._getOrCreateChild(py),_.useStyle(_.createStyle()),_.style.fill=null;var p=_.shape;p.x=r,p.y=s,p.width=a,p.height=o,p.r=d,_.dirtyShape()}if(h){var g=_.style;g.fill=l||null,g.fillOpacity=Pn(n.fillOpacity,1)}else if(u){m=this._getOrCreateChild($p),m.onload=function(){v.dirtyStyle()};var M=m.style;M.image=l.image,M.x=r,M.y=s,M.width=a,M.height=o}if(c&&f){var g=_.style;g.lineWidth=c,g.stroke=f,g.strokeOpacity=Pn(n.strokeOpacity,1),g.lineDash=n.borderDash,g.lineDashOffset=n.borderDashOffset||0,_.strokeContainThreshold=0,_.hasFill()&&_.hasStroke()&&(g.strokeFirst=!0,g.lineWidth*=2)}var S=(_||m).style;S.shadowBlur=n.shadowBlur||0,S.shadowColor=n.shadowColor||"transparent",S.shadowOffsetX=n.shadowOffsetX||0,S.shadowOffsetY=n.shadowOffsetY||0,S.opacity=yc(n.opacity,i.opacity,1)},t.makeFont=function(n){var i="";return FR(n)&&(i=[n.fontStyle,n.fontWeight,NR(n.fontSize),n.fontFamily||"sans-serif"].join(" ")),i&&lo(i)||n.textFont||n.font},t}(ll),DR={left:!0,right:1,center:1},IR={top:1,bottom:1,middle:1},R_=["fontStyle","fontWeight","fontSize","fontFamily"];function NR(e){return typeof e=="string"&&(e.indexOf("px")!==-1||e.indexOf("rem")!==-1||e.indexOf("em")!==-1)?e:isNaN(+e)?Vp+"px":e+"px"}function P_(e,t){for(var n=0;n<R_.length;n++){var i=R_[n],r=t[i];r!=null&&(e[i]=r)}}function FR(e){return e.fontSize!=null||e.fontFamily||e.fontWeight}function UR(e){return L_(e),ln(e.rich,L_),e}function L_(e){if(e){e.font=LR.makeFont(e);var t=e.align;t==="middle"&&(t="center"),e.align=t==null||DR[t]?t:"left";var n=e.verticalAlign;n==="center"&&(n="middle"),e.verticalAlign=n==null||IR[n]?n:"top";var i=e.padding;i&&(e.padding=xA(e.padding))}}function D_(e,t){return e==null||t<=0||e==="transparent"||e==="none"?null:e.image||e.colorStops?"#000":e}function I_(e){return e==null||e==="none"?null:e.image||e.colorStops?"#000":e}function N_(e,t,n){return t==="right"?e-n[1]:t==="center"?e+n[3]/2-n[1]/2:e+n[3]}function F_(e){var t=e.text;return t!=null&&(t+=""),t}function Lh(e){return!!(e.backgroundColor||e.lineHeight||e.borderWidth&&e.borderColor)}var Hs=wa.CMD,OR=[[],[],[]],U_=Math.sqrt,BR=Math.atan2;function HR(e,t){if(t){var n=e.data,i=e.len(),r,s,a,o,l,c,f=Hs.M,u=Hs.C,h=Hs.L,d=Hs.R,v=Hs.A,_=Hs.Q;for(a=0,o=0;a<i;){switch(r=n[a++],o=a,s=0,r){case f:s=1;break;case h:s=1;break;case u:s=3;break;case _:s=2;break;case v:var m=t[4],p=t[5],g=U_(t[0]*t[0]+t[1]*t[1]),M=U_(t[2]*t[2]+t[3]*t[3]),S=BR(-t[1]/M,t[0]/g);n[a]*=g,n[a++]+=m,n[a]*=M,n[a++]+=p,n[a++]*=g,n[a++]*=M,n[a++]+=S,n[a++]+=S,a+=2,o=a;break;case d:c[0]=n[a++],c[1]=n[a++],Eo(c,c,t),n[o++]=c[0],n[o++]=c[1],c[0]+=n[a++],c[1]+=n[a++],Eo(c,c,t),n[o++]=c[0],n[o++]=c[1]}for(l=0;l<s;l++){var E=OR[l];E[0]=n[a++],E[1]=n[a++],Eo(E,E,t),n[o++]=E[0],n[o++]=E[1]}}e.increaseVersion()}}var Dh=Math.sqrt,Ul=Math.sin,Ol=Math.cos,Ka=Math.PI;function O_(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1])}function tp(e,t){return(e[0]*t[0]+e[1]*t[1])/(O_(e)*O_(t))}function B_(e,t){return(e[0]*t[1]<e[1]*t[0]?-1:1)*Math.acos(tp(e,t))}function H_(e,t,n,i,r,s,a,o,l,c,f){var u=l*(Ka/180),h=Ol(u)*(e-n)/2+Ul(u)*(t-i)/2,d=-1*Ul(u)*(e-n)/2+Ol(u)*(t-i)/2,v=h*h/(a*a)+d*d/(o*o);v>1&&(a*=Dh(v),o*=Dh(v));var _=(r===s?-1:1)*Dh((a*a*(o*o)-a*a*(d*d)-o*o*(h*h))/(a*a*(d*d)+o*o*(h*h)))||0,m=_*a*d/o,p=_*-o*h/a,g=(e+n)/2+Ol(u)*m-Ul(u)*p,M=(t+i)/2+Ul(u)*m+Ol(u)*p,S=B_([1,0],[(h-m)/a,(d-p)/o]),E=[(h-m)/a,(d-p)/o],T=[(-1*h-m)/a,(-1*d-p)/o],C=B_(E,T);if(tp(E,T)<=-1&&(C=Ka),tp(E,T)>=1&&(C=0),C<0){var L=Math.round(C/Ka*1e6)/1e6;C=Ka*2+L%2*Ka}f.addData(c,g,M,a,o,S,C,u,s)}var zR=/([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig,VR=/-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;function GR(e){var t=new wa;if(!e)return t;var n=0,i=0,r=n,s=i,a,o=wa.CMD,l=e.match(zR);if(!l)return t;for(var c=0;c<l.length;c++){for(var f=l[c],u=f.charAt(0),h=void 0,d=f.match(VR)||[],v=d.length,_=0;_<v;_++)d[_]=parseFloat(d[_]);for(var m=0;m<v;){var p=void 0,g=void 0,M=void 0,S=void 0,E=void 0,T=void 0,C=void 0,L=n,y=i,b=void 0,R=void 0;switch(u){case"l":n+=d[m++],i+=d[m++],h=o.L,t.addData(h,n,i);break;case"L":n=d[m++],i=d[m++],h=o.L,t.addData(h,n,i);break;case"m":n+=d[m++],i+=d[m++],h=o.M,t.addData(h,n,i),r=n,s=i,u="l";break;case"M":n=d[m++],i=d[m++],h=o.M,t.addData(h,n,i),r=n,s=i,u="L";break;case"h":n+=d[m++],h=o.L,t.addData(h,n,i);break;case"H":n=d[m++],h=o.L,t.addData(h,n,i);break;case"v":i+=d[m++],h=o.L,t.addData(h,n,i);break;case"V":i=d[m++],h=o.L,t.addData(h,n,i);break;case"C":h=o.C,t.addData(h,d[m++],d[m++],d[m++],d[m++],d[m++],d[m++]),n=d[m-2],i=d[m-1];break;case"c":h=o.C,t.addData(h,d[m++]+n,d[m++]+i,d[m++]+n,d[m++]+i,d[m++]+n,d[m++]+i),n+=d[m-2],i+=d[m-1];break;case"S":p=n,g=i,b=t.len(),R=t.data,a===o.C&&(p+=n-R[b-4],g+=i-R[b-3]),h=o.C,L=d[m++],y=d[m++],n=d[m++],i=d[m++],t.addData(h,p,g,L,y,n,i);break;case"s":p=n,g=i,b=t.len(),R=t.data,a===o.C&&(p+=n-R[b-4],g+=i-R[b-3]),h=o.C,L=n+d[m++],y=i+d[m++],n+=d[m++],i+=d[m++],t.addData(h,p,g,L,y,n,i);break;case"Q":L=d[m++],y=d[m++],n=d[m++],i=d[m++],h=o.Q,t.addData(h,L,y,n,i);break;case"q":L=d[m++]+n,y=d[m++]+i,n+=d[m++],i+=d[m++],h=o.Q,t.addData(h,L,y,n,i);break;case"T":p=n,g=i,b=t.len(),R=t.data,a===o.Q&&(p+=n-R[b-4],g+=i-R[b-3]),n=d[m++],i=d[m++],h=o.Q,t.addData(h,p,g,n,i);break;case"t":p=n,g=i,b=t.len(),R=t.data,a===o.Q&&(p+=n-R[b-4],g+=i-R[b-3]),n+=d[m++],i+=d[m++],h=o.Q,t.addData(h,p,g,n,i);break;case"A":M=d[m++],S=d[m++],E=d[m++],T=d[m++],C=d[m++],L=n,y=i,n=d[m++],i=d[m++],h=o.A,H_(L,y,n,i,T,C,M,S,E,h,t);break;case"a":M=d[m++],S=d[m++],E=d[m++],T=d[m++],C=d[m++],L=n,y=i,n+=d[m++],i+=d[m++],h=o.A,H_(L,y,n,i,T,C,M,S,E,h,t);break}}(u==="z"||u==="Z")&&(h=o.Z,t.addData(h),n=r,i=s),a=h}return t.toStatic(),t}var my=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.applyTransform=function(n){},t}(Ge);function vy(e){return e.setData!=null}function _y(e,t){var n=GR(e),i=_e({},t);return i.buildPath=function(r){var s=vy(r);if(s&&r.canSave()){r.appendPath(n);var a=r.getContext();a&&r.rebuildPath(a,1)}else{var a=s?r.getContext():r;a&&n.rebuildPath(a,1)}},i.applyTransform=function(r){HR(n,r),this.dirtyShape()},i}function qN(e,t){return new my(_y(e,t))}function YN(e,t){var n=_y(e,t),i=function(r){ue(s,r);function s(a){var o=r.call(this,a)||this;return o.applyTransform=n.applyTransform,o.buildPath=n.buildPath,o}return s}(my);return i}function $N(e,t){for(var n=[],i=e.length,r=0;r<i;r++){var s=e[r];n.push(s.getUpdatedPathProxy(!0))}var a=new Ge(t);return a.createPathProxy(),a.buildPath=function(o){if(vy(o)){o.appendPath(n);var l=o.getContext();l&&o.rebuildPath(l,1)}},a}var kR=function(){function e(){this.cx=0,this.cy=0,this.r=0}return e}(),WR=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new kR},t.prototype.buildPath=function(n,i){n.moveTo(i.cx+i.r,i.cy),n.arc(i.cx,i.cy,i.r,0,Math.PI*2)},t}(Ge);WR.prototype.type="circle";var XR=function(){function e(){this.cx=0,this.cy=0,this.rx=0,this.ry=0}return e}(),qR=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new XR},t.prototype.buildPath=function(n,i){var r=.5522848,s=i.cx,a=i.cy,o=i.rx,l=i.ry,c=o*r,f=l*r;n.moveTo(s-o,a),n.bezierCurveTo(s-o,a-f,s-c,a-l,s,a-l),n.bezierCurveTo(s+c,a-l,s+o,a-f,s+o,a),n.bezierCurveTo(s+o,a+f,s+c,a+l,s,a+l),n.bezierCurveTo(s-c,a+l,s-o,a+f,s-o,a),n.closePath()},t}(Ge);qR.prototype.type="ellipse";var gy=Math.PI,Ih=gy*2,Jr=Math.sin,zs=Math.cos,YR=Math.acos,Ne=Math.atan2,z_=Math.abs,Ro=Math.sqrt,ho=Math.max,ci=Math.min,Bn=1e-4;function $R(e,t,n,i,r,s,a,o){var l=n-e,c=i-t,f=a-r,u=o-s,h=u*l-f*c;if(!(h*h<Bn))return h=(f*(t-s)-u*(e-r))/h,[e+h*l,t+h*c]}function Bl(e,t,n,i,r,s,a){var o=e-n,l=t-i,c=(a?s:-s)/Ro(o*o+l*l),f=c*l,u=-c*o,h=e+f,d=t+u,v=n+f,_=i+u,m=(h+v)/2,p=(d+_)/2,g=v-h,M=_-d,S=g*g+M*M,E=r-s,T=h*_-v*d,C=(M<0?-1:1)*Ro(ho(0,E*E*S-T*T)),L=(T*M-g*C)/S,y=(-T*g-M*C)/S,b=(T*M+g*C)/S,R=(-T*g+M*C)/S,I=L-m,F=y-p,O=b-m,q=R-p;return I*I+F*F>O*O+q*q&&(L=b,y=R),{cx:L,cy:y,x0:-f,y0:-u,x1:L*(r/E-1),y1:y*(r/E-1)}}function KR(e){var t;if(Yo(e)){var n=e.length;if(!n)return e;n===1?t=[e[0],e[0],0,0]:n===2?t=[e[0],e[0],e[1],e[1]]:n===3?t=e.concat(e[2]):t=e}else t=[e,e,e,e];return t}function ZR(e,t){var n,i=ho(t.r,0),r=ho(t.r0||0,0),s=i>0,a=r>0;if(!(!s&&!a)){if(s||(i=r,r=0),r>i){var o=i;i=r,r=o}var l=t.startAngle,c=t.endAngle;if(!(isNaN(l)||isNaN(c))){var f=t.cx,u=t.cy,h=!!t.clockwise,d=z_(c-l),v=d>Ih&&d%Ih;if(v>Bn&&(d=v),!(i>Bn))e.moveTo(f,u);else if(d>Ih-Bn)e.moveTo(f+i*zs(l),u+i*Jr(l)),e.arc(f,u,i,l,c,!h),r>Bn&&(e.moveTo(f+r*zs(c),u+r*Jr(c)),e.arc(f,u,r,c,l,h));else{var _=void 0,m=void 0,p=void 0,g=void 0,M=void 0,S=void 0,E=void 0,T=void 0,C=void 0,L=void 0,y=void 0,b=void 0,R=void 0,I=void 0,F=void 0,O=void 0,q=i*zs(l),V=i*Jr(l),z=r*zs(c),K=r*Jr(c),dt=d>Bn;if(dt){var ct=t.cornerRadius;ct&&(n=KR(ct),_=n[0],m=n[1],p=n[2],g=n[3]);var ht=z_(i-r)/2;if(M=ci(ht,p),S=ci(ht,g),E=ci(ht,_),T=ci(ht,m),y=C=ho(M,S),b=L=ho(E,T),(C>Bn||L>Bn)&&(R=i*zs(c),I=i*Jr(c),F=r*zs(l),O=r*Jr(l),d<gy)){var Rt=$R(q,V,F,O,R,I,z,K);if(Rt){var It=q-Rt[0],qt=V-Rt[1],Kt=R-Rt[0],Q=I-Rt[1],it=1/Jr(YR((It*Kt+qt*Q)/(Ro(It*It+qt*qt)*Ro(Kt*Kt+Q*Q)))/2),Mt=Ro(Rt[0]*Rt[0]+Rt[1]*Rt[1]);y=ci(C,(i-Mt)/(it+1)),b=ci(L,(r-Mt)/(it-1))}}}if(!dt)e.moveTo(f+q,u+V);else if(y>Bn){var Ut=ci(p,y),mt=ci(g,y),bt=Bl(F,O,q,V,i,Ut,h),D=Bl(R,I,z,K,i,mt,h);e.moveTo(f+bt.cx+bt.x0,u+bt.cy+bt.y0),y<C&&Ut===mt?e.arc(f+bt.cx,u+bt.cy,y,Ne(bt.y0,bt.x0),Ne(D.y0,D.x0),!h):(Ut>0&&e.arc(f+bt.cx,u+bt.cy,Ut,Ne(bt.y0,bt.x0),Ne(bt.y1,bt.x1),!h),e.arc(f,u,i,Ne(bt.cy+bt.y1,bt.cx+bt.x1),Ne(D.cy+D.y1,D.cx+D.x1),!h),mt>0&&e.arc(f+D.cx,u+D.cy,mt,Ne(D.y1,D.x1),Ne(D.y0,D.x0),!h))}else e.moveTo(f+q,u+V),e.arc(f,u,i,l,c,!h);if(!(r>Bn)||!dt)e.lineTo(f+z,u+K);else if(b>Bn){var Ut=ci(_,b),mt=ci(m,b),bt=Bl(z,K,R,I,r,-mt,h),D=Bl(q,V,F,O,r,-Ut,h);e.lineTo(f+bt.cx+bt.x0,u+bt.cy+bt.y0),b<L&&Ut===mt?e.arc(f+bt.cx,u+bt.cy,b,Ne(bt.y0,bt.x0),Ne(D.y0,D.x0),!h):(mt>0&&e.arc(f+bt.cx,u+bt.cy,mt,Ne(bt.y0,bt.x0),Ne(bt.y1,bt.x1),!h),e.arc(f,u,r,Ne(bt.cy+bt.y1,bt.cx+bt.x1),Ne(D.cy+D.y1,D.cx+D.x1),h),Ut>0&&e.arc(f+D.cx,u+D.cy,Ut,Ne(D.y1,D.x1),Ne(D.y0,D.x0),!h))}else e.lineTo(f+z,u+K),e.arc(f,u,r,c,l,h)}e.closePath()}}}var JR=function(){function e(){this.cx=0,this.cy=0,this.r0=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0,this.cornerRadius=0}return e}(),jR=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new JR},t.prototype.buildPath=function(n,i){ZR(n,i)},t.prototype.isZeroArea=function(){return this.shape.startAngle===this.shape.endAngle||this.shape.r===this.shape.r0},t}(Ge);jR.prototype.type="sector";var QR=function(){function e(){this.cx=0,this.cy=0,this.r=0,this.r0=0}return e}(),tP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new QR},t.prototype.buildPath=function(n,i){var r=i.cx,s=i.cy,a=Math.PI*2;n.moveTo(r+i.r,s),n.arc(r,s,i.r,0,a,!1),n.moveTo(r+i.r0,s),n.arc(r,s,i.r0,0,a,!0)},t}(Ge);tP.prototype.type="ring";function eP(e,t,n,i){var r=[],s=[],a=[],o=[],l,c,f,u;if(i){f=[1/0,1/0],u=[-1/0,-1/0];for(var h=0,d=e.length;h<d;h++)na(f,f,e[h]),ia(u,u,e[h]);na(f,f,i[0]),ia(u,u,i[1])}for(var h=0,d=e.length;h<d;h++){var v=e[h];if(n)l=e[h?h-1:d-1],c=e[(h+1)%d];else if(h===0||h===d-1){r.push(TA(e[h]));continue}else l=e[h-1],c=e[h+1];EA(s,c,l),Ju(s,s,t);var _=Nd(v,l),m=Nd(v,c),p=_+m;p!==0&&(_/=p,m/=p),Ju(a,s,-_),Ju(o,s,m);var g=kv([],v,a),M=kv([],v,o);i&&(ia(g,g,f),na(g,g,u),ia(M,M,f),na(M,M,u)),r.push(g),r.push(M)}return n&&r.push(r.shift()),r}function xy(e,t,n){var i=t.smooth,r=t.points;if(r&&r.length>=2){if(i){var s=eP(r,i,n,t.smoothConstraint);e.moveTo(r[0][0],r[0][1]);for(var a=r.length,o=0;o<(n?a:a-1);o++){var l=s[o*2],c=s[o*2+1],f=r[(o+1)%a];e.bezierCurveTo(l[0],l[1],c[0],c[1],f[0],f[1])}}else{e.moveTo(r[0][0],r[0][1]);for(var o=1,u=r.length;o<u;o++)e.lineTo(r[o][0],r[o][1])}n&&e.closePath()}}var nP=function(){function e(){this.points=null,this.smooth=0,this.smoothConstraint=null}return e}(),iP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new nP},t.prototype.buildPath=function(n,i){xy(n,i,!0)},t}(Ge);iP.prototype.type="polygon";var rP=function(){function e(){this.points=null,this.percent=1,this.smooth=0,this.smoothConstraint=null}return e}(),sP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new rP},t.prototype.buildPath=function(n,i){xy(n,i,!1)},t}(Ge);sP.prototype.type="polyline";var aP={},oP=function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.percent=1}return e}(),lP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new oP},t.prototype.buildPath=function(n,i){var r,s,a,o;if(this.subPixelOptimize){var l=wR(aP,i,this.style);r=l.x1,s=l.y1,a=l.x2,o=l.y2}else r=i.x1,s=i.y1,a=i.x2,o=i.y2;var c=i.percent;c!==0&&(n.moveTo(r,s),c<1&&(a=r*(1-c)+a*c,o=s*(1-c)+o*c),n.lineTo(a,o))},t.prototype.pointAt=function(n){var i=this.shape;return[i.x1*(1-n)+i.x2*n,i.y1*(1-n)+i.y2*n]},t}(Ge);lP.prototype.type="line";var tn=[],cP=function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.cpx1=0,this.cpy1=0,this.percent=1}return e}();function V_(e,t,n){var i=e.cpx2,r=e.cpy2;return i!=null||r!=null?[(n?n_:Ke)(e.x1,e.cpx1,e.cpx2,e.x2,t),(n?n_:Ke)(e.y1,e.cpy1,e.cpy2,e.y2,t)]:[(n?i_:sn)(e.x1,e.cpx1,e.x2,t),(n?i_:sn)(e.y1,e.cpy1,e.y2,t)]}var fP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new cP},t.prototype.buildPath=function(n,i){var r=i.x1,s=i.y1,a=i.x2,o=i.y2,l=i.cpx1,c=i.cpy1,f=i.cpx2,u=i.cpy2,h=i.percent;h!==0&&(n.moveTo(r,s),f==null||u==null?(h<1&&(Zc(r,l,a,h,tn),l=tn[1],a=tn[2],Zc(s,c,o,h,tn),c=tn[1],o=tn[2]),n.quadraticCurveTo(l,c,a,o)):(h<1&&(Kc(r,l,f,a,h,tn),l=tn[1],f=tn[2],a=tn[3],Kc(s,c,u,o,h,tn),c=tn[1],u=tn[2],o=tn[3]),n.bezierCurveTo(l,c,f,u,a,o)))},t.prototype.pointAt=function(n){return V_(this.shape,n,!1)},t.prototype.tangentAt=function(n){var i=V_(this.shape,n,!0);return CA(i,i)},t}(Ge);fP.prototype.type="bezier-curve";var uP=function(){function e(){this.cx=0,this.cy=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0}return e}(),hP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new uP},t.prototype.buildPath=function(n,i){var r=i.cx,s=i.cy,a=Math.max(i.r,0),o=i.startAngle,l=i.endAngle,c=i.clockwise,f=Math.cos(o),u=Math.sin(o);n.moveTo(f*a+r,u*a+s),n.arc(r,s,a,o,l,!c)},t}(Ge);hP.prototype.type="arc";var KN=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.type="compound",n}return t.prototype._updatePathDirty=function(){for(var n=this.shape.paths,i=this.shapeChanged(),r=0;r<n.length;r++)i=i||n[r].shapeChanged();i&&this.dirtyShape()},t.prototype.beforeBrush=function(){this._updatePathDirty();for(var n=this.shape.paths||[],i=this.getGlobalScale(),r=0;r<n.length;r++)n[r].path||n[r].createPathProxy(),n[r].path.setScale(i[0],i[1],n[r].segmentIgnoreThreshold)},t.prototype.buildPath=function(n,i){for(var r=i.paths||[],s=0;s<r.length;s++)r[s].buildPath(n,r[s].shape,!0)},t.prototype.afterBrush=function(){for(var n=this.shape.paths||[],i=0;i<n.length;i++)n[i].pathUpdated()},t.prototype.getBoundingRect=function(){return this._updatePathDirty.call(this),Ge.prototype.getBoundingRect.call(this)},t}(Ge),yy=function(){function e(t){this.colorStops=t||[]}return e.prototype.addColorStop=function(t,n){this.colorStops.push({offset:t,color:n})},e}(),ZN=function(e){ue(t,e);function t(n,i,r,s,a,o){var l=e.call(this,a)||this;return l.x=n==null?0:n,l.y=i==null?0:i,l.x2=r==null?1:r,l.y2=s==null?0:s,l.type="linear",l.global=o||!1,l}return t}(yy),JN=function(e){ue(t,e);function t(n,i,r,s,a){var o=e.call(this,s)||this;return o.x=n==null?.5:n,o.y=i==null?.5:i,o.r=r==null?.5:r,o.type="radial",o.global=a||!1,o}return t}(yy),Nh=Math.min,dP=Math.max,Hl=Math.abs,jr=[0,0],Qr=[0,0],Pe=zx(),zl=Pe.minTv,Vl=Pe.maxTv,jN=function(){function e(t,n){this._corners=[],this._axes=[],this._origin=[0,0];for(var i=0;i<4;i++)this._corners[i]=new be;for(var i=0;i<2;i++)this._axes[i]=new be;t&&this.fromBoundingRect(t,n)}return e.prototype.fromBoundingRect=function(t,n){var i=this._corners,r=this._axes,s=t.x,a=t.y,o=s+t.width,l=a+t.height;if(i[0].set(s,a),i[1].set(o,a),i[2].set(o,l),i[3].set(s,l),n)for(var c=0;c<4;c++)i[c].transform(n);be.sub(r[0],i[1],i[0]),be.sub(r[1],i[3],i[0]),r[0].normalize(),r[1].normalize();for(var c=0;c<2;c++)this._origin[c]=r[c].dot(i[0])},e.prototype.intersect=function(t,n,i){var r=!0,s=!n;return n&&be.set(n,0,0),Pe.reset(i,!s),!this._intersectCheckOneSide(this,t,s,1)&&(r=!1,s)||!this._intersectCheckOneSide(t,this,s,-1)&&(r=!1,s)||!s&&!Pe.negativeSize&&be.copy(n,r?Pe.useDir?Pe.dirMinTv:zl:Vl),r},e.prototype._intersectCheckOneSide=function(t,n,i,r){for(var s=!0,a=0;a<2;a++){var o=t._axes[a];if(t._getProjMinMaxOnAxis(a,t._corners,jr),t._getProjMinMaxOnAxis(a,n._corners,Qr),Pe.negativeSize||jr[1]<Qr[0]||jr[0]>Qr[1]){if(s=!1,Pe.negativeSize||i)return s;var l=Hl(Qr[0]-jr[1]),c=Hl(jr[0]-Qr[1]);Nh(l,c)>Vl.len()&&(l<c?be.scale(Vl,o,-l*r):be.scale(Vl,o,c*r))}else if(!i){var l=Hl(Qr[0]-jr[1]),c=Hl(jr[0]-Qr[1]);(Pe.useDir||Nh(l,c)<zl.len())&&((l<c||!Pe.bidirectional)&&(be.scale(zl,o,l*r),Pe.useDir&&Pe.calcDirMTV()),(l>=c||!Pe.bidirectional)&&(be.scale(zl,o,-c*r),Pe.useDir&&Pe.calcDirMTV()))}}return s},e.prototype._getProjMinMaxOnAxis=function(t,n,i){for(var r=this._axes[t],s=this._origin,a=n[0].dot(r)+s[t],o=a,l=a,c=1;c<n.length;c++){var f=n[c].dot(r)+s[t];o=Nh(f,o),l=dP(f,l)}i[0]=o+Pe.touchThreshold,i[1]=l-Pe.touchThreshold,Pe.negativeSize=i[1]<i[0]},e}(),pP=[],QN=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.notClear=!0,n.incremental=!0,n._displayables=[],n._temporaryDisplayables=[],n._cursor=0,n}return t.prototype.traverse=function(n,i){n.call(i,this)},t.prototype.useStyle=function(){this.style={}},t.prototype.getCursor=function(){return this._cursor},t.prototype.innerAfterBrush=function(){this._cursor=this._displayables.length},t.prototype.clearDisplaybles=function(){this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.markRedraw(),this.notClear=!1},t.prototype.clearTemporalDisplayables=function(){this._temporaryDisplayables=[]},t.prototype.addDisplayable=function(n,i){i?this._temporaryDisplayables.push(n):this._displayables.push(n),this.markRedraw()},t.prototype.addDisplayables=function(n,i){i=i||!1;for(var r=0;r<n.length;r++)this.addDisplayable(n[r],i)},t.prototype.getDisplayables=function(){return this._displayables},t.prototype.getTemporalDisplayables=function(){return this._temporaryDisplayables},t.prototype.eachPendingDisplayable=function(n){for(var i=this._cursor;i<this._displayables.length;i++)n&&n(this._displayables[i]);for(var i=0;i<this._temporaryDisplayables.length;i++)n&&n(this._temporaryDisplayables[i])},t.prototype.update=function(){this.updateTransform();for(var n=this._cursor;n<this._displayables.length;n++){var i=this._displayables[n];i.parent=this,i.update(),i.parent=null}for(var n=0;n<this._temporaryDisplayables.length;n++){var i=this._temporaryDisplayables[n];i.parent=this,i.update(),i.parent=null}},t.prototype.getBoundingRect=function(){if(!this._rect){for(var n=new ce(1/0,1/0,-1/0,-1/0),i=0;i<this._displayables.length;i++){var r=this._displayables[i],s=r.getBoundingRect().clone();r.needLocalTransform()&&s.applyTransform(r.getLocalTransform(pP)),n.union(s)}this._rect=n}return this._rect},t.prototype.contain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect();if(s.contain(r[0],r[1]))for(var a=0;a<this._displayables.length;a++){var o=this._displayables[a];if(o.contain(n,i))return!0}return!1},t}(ll),mP=Math.round(Math.random()*9),vP=typeof Object.defineProperty=="function",tF=function(){function e(){this._id="__ec_inner_"+mP++}return e.prototype.get=function(t){return this._guard(t)[this._id]},e.prototype.set=function(t,n){var i=this._guard(t);return vP?Object.defineProperty(i,this._id,{value:n,enumerable:!1,configurable:!0}):i[this._id]=n,this},e.prototype.delete=function(t){return this.has(t)?(delete this._guard(t)[this._id],!0):!1},e.prototype.has=function(t){return!!this._guard(t)[this._id]},e.prototype._guard=function(t){if(t!==Object(t))throw TypeError("Value of WeakMap is not a non-null object.");return t},e}();function ds(e){return isFinite(e)}function _P(e,t,n){var i=t.x==null?0:t.x,r=t.x2==null?1:t.x2,s=t.y==null?0:t.y,a=t.y2==null?0:t.y2;t.global||(i=i*n.width+n.x,r=r*n.width+n.x,s=s*n.height+n.y,a=a*n.height+n.y),i=ds(i)?i:0,r=ds(r)?r:1,s=ds(s)?s:0,a=ds(a)?a:0;var o=e.createLinearGradient(i,s,r,a);return o}function gP(e,t,n){var i=n.width,r=n.height,s=Math.min(i,r),a=t.x==null?.5:t.x,o=t.y==null?.5:t.y,l=t.r==null?.5:t.r;t.global||(a=a*i+n.x,o=o*r+n.y,l=l*s),a=ds(a)?a:.5,o=ds(o)?o:.5,l=l>=0&&ds(l)?l:.5;var c=e.createRadialGradient(a,o,0,a,o,l);return c}function ep(e,t,n){for(var i=t.type==="radial"?gP(e,t,n):_P(e,t,n),r=t.colorStops,s=0;s<r.length;s++)i.addColorStop(r[s].offset,r[s].color);return i}function xP(e,t){if(e===t||!e&&!t)return!1;if(!e||!t||e.length!==t.length)return!0;for(var n=0;n<e.length;n++)if(e[n]!==t[n])return!0;return!1}function Gl(e){return parseInt(e,10)}function kl(e,t,n){var i=["width","height"][t],r=["clientWidth","clientHeight"][t],s=["paddingLeft","paddingTop"][t],a=["paddingRight","paddingBottom"][t];if(n[i]!=null&&n[i]!=="auto")return parseFloat(n[i]);var o=document.defaultView.getComputedStyle(e);return(e[r]||Gl(o[i])||Gl(e.style[i]))-(Gl(o[s])||0)-(Gl(o[a])||0)|0}function yP(e,t){return!e||e==="solid"||!(t>0)?null:e==="dashed"?[4*t,2*t]:e==="dotted"?[t]:xc(e)?[e]:Yo(e)?e:null}function Sy(e){var t=e.style,n=t.lineDash&&t.lineWidth>0&&yP(t.lineDash,t.lineWidth),i=t.lineDashOffset;if(n){var r=t.strokeNoScale&&e.getLineScale?e.getLineScale():1;r&&r!==1&&(n=Ta(n,function(s){return s/r}),i/=r)}return[n,i]}var SP=new wa(!0);function tf(e){var t=e.stroke;return!(t==null||t==="none"||!(e.lineWidth>0))}function G_(e){return typeof e=="string"&&e!=="none"}function ef(e){var t=e.fill;return t!=null&&t!=="none"}function k_(e,t){if(t.fillOpacity!=null&&t.fillOpacity!==1){var n=e.globalAlpha;e.globalAlpha=t.fillOpacity*t.opacity,e.fill(),e.globalAlpha=n}else e.fill()}function W_(e,t){if(t.strokeOpacity!=null&&t.strokeOpacity!==1){var n=e.globalAlpha;e.globalAlpha=t.strokeOpacity*t.opacity,e.stroke(),e.globalAlpha=n}else e.stroke()}function np(e,t,n){var i=oy(t.image,t.__image,n);if(vu(i)){var r=e.createPattern(i,t.repeat||"repeat");if(typeof DOMMatrix=="function"&&r&&r.setTransform){var s=new DOMMatrix;s.translateSelf(t.x||0,t.y||0),s.rotateSelf(0,0,(t.rotation||0)*bA),s.scaleSelf(t.scaleX||1,t.scaleY||1),r.setTransform(s)}return r}}function MP(e,t,n,i){var r,s=tf(n),a=ef(n),o=n.strokePercent,l=o<1,c=!t.path;(!t.silent||l)&&c&&t.createPathProxy();var f=t.path||SP,u=t.__dirty;if(!i){var h=n.fill,d=n.stroke,v=a&&!!h.colorStops,_=s&&!!d.colorStops,m=a&&!!h.image,p=s&&!!d.image,g=void 0,M=void 0,S=void 0,E=void 0,T=void 0;(v||_)&&(T=t.getBoundingRect()),v&&(g=u?ep(e,h,T):t.__canvasFillGradient,t.__canvasFillGradient=g),_&&(M=u?ep(e,d,T):t.__canvasStrokeGradient,t.__canvasStrokeGradient=M),m&&(S=u||!t.__canvasFillPattern?np(e,h,t):t.__canvasFillPattern,t.__canvasFillPattern=S),p&&(E=u||!t.__canvasStrokePattern?np(e,d,t):t.__canvasStrokePattern,t.__canvasStrokePattern=E),v?e.fillStyle=g:m&&(S?e.fillStyle=S:a=!1),_?e.strokeStyle=M:p&&(E?e.strokeStyle=E:s=!1)}var C=t.getGlobalScale();f.setScale(C[0],C[1],t.segmentIgnoreThreshold);var L,y;e.setLineDash&&n.lineDash&&(r=Sy(t),L=r[0],y=r[1]);var b=!0;(c||u&ea)&&(f.setDPR(e.dpr),l?f.setContext(null):(f.setContext(e),b=!1),f.reset(),t.buildPath(f,t.shape,i),f.toStatic(),t.pathUpdated()),b&&f.rebuildPath(e,l?o:1),L&&(e.setLineDash(L),e.lineDashOffset=y),i||(n.strokeFirst?(s&&W_(e,n),a&&k_(e,n)):(a&&k_(e,n),s&&W_(e,n))),L&&e.setLineDash([])}function bP(e,t,n){var i=t.__image=oy(n.image,t.__image,t,t.onload);if(!(!i||!vu(i))){var r=n.x||0,s=n.y||0,a=t.getWidth(),o=t.getHeight(),l=i.width/i.height;if(a==null&&o!=null?a=o*l:o==null&&a!=null?o=a/l:a==null&&o==null&&(a=i.width,o=i.height),n.sWidth&&n.sHeight){var c=n.sx||0,f=n.sy||0;e.drawImage(i,c,f,n.sWidth,n.sHeight,r,s,a,o)}else if(n.sx&&n.sy){var c=n.sx,f=n.sy,u=a-c,h=o-f;e.drawImage(i,c,f,u,h,r,s,a,o)}else e.drawImage(i,r,s,a,o)}}function TP(e,t,n){var i,r=n.text;if(r!=null&&(r+=""),r){e.font=n.font||Cr,e.textAlign=n.textAlign,e.textBaseline=n.textBaseline;var s=void 0,a=void 0;e.setLineDash&&n.lineDash&&(i=Sy(t),s=i[0],a=i[1]),s&&(e.setLineDash(s),e.lineDashOffset=a),n.strokeFirst?(tf(n)&&e.strokeText(r,n.x,n.y),ef(n)&&e.fillText(r,n.x,n.y)):(ef(n)&&e.fillText(r,n.x,n.y),tf(n)&&e.strokeText(r,n.x,n.y)),s&&e.setLineDash([])}}var X_=["shadowBlur","shadowOffsetX","shadowOffsetY"],q_=[["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]];function My(e,t,n,i,r){var s=!1;if(!i&&(n=n||{},t===n))return!1;if(i||t.opacity!==n.opacity){an(e,r),s=!0;var a=Math.max(Math.min(t.opacity,1),0);e.globalAlpha=isNaN(a)?Ss.opacity:a}(i||t.blend!==n.blend)&&(s||(an(e,r),s=!0),e.globalCompositeOperation=t.blend||Ss.blend);for(var o=0;o<X_.length;o++){var l=X_[o];(i||t[l]!==n[l])&&(s||(an(e,r),s=!0),e[l]=e.dpr*(t[l]||0))}return(i||t.shadowColor!==n.shadowColor)&&(s||(an(e,r),s=!0),e.shadowColor=t.shadowColor||Ss.shadowColor),s}function Y_(e,t,n,i,r){var s=jo(t,r.inHover),a=i?null:n&&jo(n,r.inHover)||{};if(s===a)return!1;var o=My(e,s,a,i,r);if((i||s.fill!==a.fill)&&(o||(an(e,r),o=!0),G_(s.fill)&&(e.fillStyle=s.fill)),(i||s.stroke!==a.stroke)&&(o||(an(e,r),o=!0),G_(s.stroke)&&(e.strokeStyle=s.stroke)),(i||s.opacity!==a.opacity)&&(o||(an(e,r),o=!0),e.globalAlpha=s.opacity==null?1:s.opacity),t.hasStroke()){var l=s.lineWidth,c=l/(s.strokeNoScale&&t.getLineScale?t.getLineScale():1);e.lineWidth!==c&&(o||(an(e,r),o=!0),e.lineWidth=c)}for(var f=0;f<q_.length;f++){var u=q_[f],h=u[0];(i||s[h]!==a[h])&&(o||(an(e,r),o=!0),e[h]=s[h]||u[1])}return o}function EP(e,t,n,i,r){return My(e,jo(t,r.inHover),n&&jo(n,r.inHover),i,r)}function by(e,t){var n=t.transform,i=e.dpr||1;n?e.setTransform(i*n[0],i*n[1],i*n[2],i*n[3],i*n[4],i*n[5]):e.setTransform(i,0,0,i,0,0)}function wP(e,t,n){for(var i=!1,r=0;r<e.length;r++){var s=e[r];i=i||s.isZeroArea(),by(t,s),t.beginPath(),s.buildPath(t,s.shape),t.clip()}n.allClipped=i}function AP(e,t){return e&&t?e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]:!(!e&&!t)}var $_=1,K_=2,Z_=3,J_=4;function CP(e){var t=ef(e),n=tf(e);return!(e.lineDash||!(+t^+n)||t&&typeof e.fill!="string"||n&&typeof e.stroke!="string"||e.strokePercent<1||e.strokeOpacity<1||e.fillOpacity<1)}function an(e,t){t.batchFill&&e.fill(),t.batchStroke&&e.stroke(),t.batchFill="",t.batchStroke=""}function jo(e,t){return t&&e.__hoverStyle||e.style}function RP(e,t){ps(e,t,{inHover:!1,viewWidth:0,viewHeight:0},!0)}function ps(e,t,n,i){var r=t.transform;if(!t.shouldBePainted(n.viewWidth,n.viewHeight,!1,!1)){t.__dirty&=~vn,t.__isRendered=!1;return}var s=t.__clipPaths,a=n.prevElClipPaths,o=!1,l=!1;if((!a||xP(s,a))&&(a&&a.length&&(an(e,n),e.restore(),l=o=!0,n.prevElClipPaths=null,n.allClipped=!1,n.prevEl=null),s&&s.length&&(an(e,n),e.save(),wP(s,e,n),o=!0),n.prevElClipPaths=s),n.allClipped){t.__isRendered=!1;return}t.beforeBrush&&t.beforeBrush(),t.innerBeforeBrush();var c=n.prevEl;c||(l=o=!0);var f=t instanceof Ge&&t.autoBatch&&CP(t.style);o||AP(r,c.transform)?(an(e,n),by(e,t)):f||an(e,n);var u=jo(t,n.inHover);t instanceof Ge?(n.lastDrawType!==$_&&(l=!0,n.lastDrawType=$_),Y_(e,t,c,l,n),(!f||!n.batchFill&&!n.batchStroke)&&e.beginPath(),MP(e,t,u,f),f&&(n.batchFill=u.fill||"",n.batchStroke=u.stroke||"")):t instanceof Qc?(n.lastDrawType!==Z_&&(l=!0,n.lastDrawType=Z_),Y_(e,t,c,l,n),TP(e,t,u)):t instanceof $p?(n.lastDrawType!==K_&&(l=!0,n.lastDrawType=K_),EP(e,t,c,l,n),bP(e,t,u)):t.getTemporalDisplayables&&(n.lastDrawType!==J_&&(l=!0,n.lastDrawType=J_),PP(e,t,n)),f&&i&&an(e,n),t.innerAfterBrush(),t.afterBrush&&t.afterBrush(),n.prevEl=t,t.__dirty=0,t.__isRendered=!0}function PP(e,t,n){var i=t.getDisplayables(),r=t.getTemporalDisplayables();e.save();var s={prevElClipPaths:null,prevEl:null,allClipped:!1,viewWidth:n.viewWidth,viewHeight:n.viewHeight,inHover:n.inHover},a,o;for(a=t.getCursor(),o=i.length;a<o;a++){var l=i[a];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),ps(e,l,s,a===o-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),s.prevEl=l}for(var c=0,f=r.length;c<f;c++){var l=r[c];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),ps(e,l,s,c===f-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),s.prevEl=l}t.clearTemporalDisplayables(),t.notClear=!0,e.restore()}function j_(e,t,n){var i=Es.createCanvas(),r=t.getWidth(),s=t.getHeight(),a=i.style;return a&&(a.position="absolute",a.left="0",a.top="0",a.width=r+"px",a.height=s+"px",i.setAttribute("data-zr-dom-id",e)),i.width=r*n,i.height=s*n,i}var Fh=function(e){ue(t,e);function t(n,i,r){var s=e.call(this)||this;s.motionBlur=!1,s.lastFrameAlpha=.7,s.dpr=1,s.virtual=!1,s.config={},s.incremental=!1,s.zlevel=0,s.maxRepaintRectCount=5,s.__dirty=!0,s.__firstTimePaint=!0,s.__used=!1,s.__drawIndex=0,s.__startIndex=0,s.__endIndex=0,s.__prevStartIndex=null,s.__prevEndIndex=null;var a;r=r||jc,typeof n=="string"?a=j_(n,i,r):gr(n)&&(a=n,n=a.id),s.id=n,s.dom=a;var o=a.style;return o&&(Ox(a),a.onselectstart=function(){return!1},o.padding="0",o.margin="0",o.borderWidth="0"),s.painter=i,s.dpr=r,s}return t.prototype.getElementCount=function(){return this.__endIndex-this.__startIndex},t.prototype.afterBrush=function(){this.__prevStartIndex=this.__startIndex,this.__prevEndIndex=this.__endIndex},t.prototype.initContext=function(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr},t.prototype.setUnpainted=function(){this.__firstTimePaint=!0},t.prototype.createBackBuffer=function(){var n=this.dpr;this.domBack=j_("back-"+this.id,this.painter,n),this.ctxBack=this.domBack.getContext("2d"),n!==1&&this.ctxBack.scale(n,n)},t.prototype.createRepaintRects=function(n,i,r,s){if(this.__firstTimePaint)return this.__firstTimePaint=!1,null;var a=[],o=this.maxRepaintRectCount,l=!1,c=new ce(0,0,0,0);function f(g){if(!(!g.isFinite()||g.isZero()))if(a.length===0){var M=new ce(0,0,0,0);M.copy(g),a.push(M)}else{for(var S=!1,E=1/0,T=0,C=0;C<a.length;++C){var L=a[C];if(L.intersect(g)){var y=new ce(0,0,0,0);y.copy(L),y.union(g),a[C]=y,S=!0;break}else if(l){c.copy(g),c.union(L);var b=g.width*g.height,R=L.width*L.height,I=c.width*c.height,F=I-b-R;F<E&&(E=F,T=C)}}if(l&&(a[T].union(g),S=!0),!S){var M=new ce(0,0,0,0);M.copy(g),a.push(M)}l||(l=a.length>=o)}}for(var u=this.__startIndex;u<this.__endIndex;++u){var h=n[u];if(h){var d=h.shouldBePainted(r,s,!0,!0),v=h.__isRendered&&(h.__dirty&vn||!d)?h.getPrevPaintRect():null;v&&f(v);var _=d&&(h.__dirty&vn||!h.__isRendered)?h.getPaintRect():null;_&&f(_)}}for(var u=this.__prevStartIndex;u<this.__prevEndIndex;++u){var h=i[u],d=h&&h.shouldBePainted(r,s,!0,!0);if(h&&(!d||!h.__zr)&&h.__isRendered){var v=h.getPrevPaintRect();v&&f(v)}}var m;do{m=!1;for(var u=0;u<a.length;){if(a[u].isZero()){a.splice(u,1);continue}for(var p=u+1;p<a.length;)a[u].intersect(a[p])?(m=!0,a[u].union(a[p]),a.splice(p,1)):p++;u++}}while(m);return this._paintRects=a,a},t.prototype.debugGetPaintRects=function(){return(this._paintRects||[]).slice()},t.prototype.resize=function(n,i){var r=this.dpr,s=this.dom,a=s.style,o=this.domBack;a&&(a.width=n+"px",a.height=i+"px"),s.width=n*r,s.height=i*r,o&&(o.width=n*r,o.height=i*r,r!==1&&this.ctxBack.scale(r,r))},t.prototype.clear=function(n,i,r){var s=this.dom,a=this.ctx,o=s.width,l=s.height;i=i||this.clearColor;var c=this.motionBlur&&!n,f=this.lastFrameAlpha,u=this.dpr,h=this;c&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(s,0,0,o/u,l/u));var d=this.domBack;function v(_,m,p,g){if(a.clearRect(_,m,p,g),i&&i!=="transparent"){var M=void 0;if(hu(i)){var S=i.global||i.__width===p&&i.__height===g;M=S&&i.__canvasGradient||ep(a,i,{x:0,y:0,width:p,height:g}),i.__canvasGradient=M,i.__width=p,i.__height=g}else _A(i)&&(i.scaleX=i.scaleX||u,i.scaleY=i.scaleY||u,M=np(a,i,{dirty:function(){h.setUnpainted(),h.painter.refresh()}}));a.save(),a.fillStyle=M||i,a.fillRect(_,m,p,g),a.restore()}c&&(a.save(),a.globalAlpha=f,a.drawImage(d,_,m,p,g),a.restore())}!r||c?v(0,0,o,l):r.length&&ln(r,function(_){v(_.x*u,_.y*u,_.width*u,_.height*u)})},t}(Na),Q_=1e5,ts=314159,Wl=.01,LP=.001;function DP(e){return e?e.__builtin__?!0:!(typeof e.resize!="function"||typeof e.refresh!="function"):!1}function IP(e,t){var n=document.createElement("div");return n.style.cssText=["position:relative","width:"+e+"px","height:"+t+"px","padding:0","margin:0","border-width:0"].join(";")+";",n}var eF=function(){function e(t,n,i,r){this.type="canvas",this._zlevelList=[],this._prevDisplayList=[],this._layers={},this._layerConfig={},this._needsManuallyCompositing=!1,this.type="canvas";var s=!t.nodeName||t.nodeName.toUpperCase()==="CANVAS";this._opts=i=_e({},i||{}),this.dpr=i.devicePixelRatio||jc,this._singleCanvas=s,this.root=t;var a=t.style;a&&(Ox(t),t.innerHTML=""),this.storage=n;var o=this._zlevelList;this._prevDisplayList=[];var l=this._layers;if(s){var f=t,u=f.width,h=f.height;i.width!=null&&(u=i.width),i.height!=null&&(h=i.height),this.dpr=i.devicePixelRatio||1,f.width=u*this.dpr,f.height=h*this.dpr,this._width=u,this._height=h;var d=new Fh(f,this,this.dpr);d.__builtin__=!0,d.initContext(),l[ts]=d,d.zlevel=ts,o.push(ts),this._domRoot=t}else{this._width=kl(t,0,i),this._height=kl(t,1,i);var c=this._domRoot=IP(this._width,this._height);t.appendChild(c)}}return e.prototype.getType=function(){return"canvas"},e.prototype.isSingleCanvas=function(){return this._singleCanvas},e.prototype.getViewportRoot=function(){return this._domRoot},e.prototype.getViewportRootOffset=function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},e.prototype.refresh=function(t){var n=this.storage.getDisplayList(!0),i=this._prevDisplayList,r=this._zlevelList;this._redrawId=Math.random(),this._paintList(n,i,t,this._redrawId);for(var s=0;s<r.length;s++){var a=r[s],o=this._layers[a];if(!o.__builtin__&&o.refresh){var l=s===0?this._backgroundColor:null;o.refresh(l)}}return this._opts.useDirtyRect&&(this._prevDisplayList=n.slice()),this},e.prototype.refreshHover=function(){this._paintHoverList(this.storage.getDisplayList(!1))},e.prototype._paintHoverList=function(t){var n=t.length,i=this._hoverlayer;if(i&&i.clear(),!!n){for(var r={inHover:!0,viewWidth:this._width,viewHeight:this._height},s,a=0;a<n;a++){var o=t[a];o.__inHover&&(i||(i=this._hoverlayer=this.getLayer(Q_)),s||(s=i.ctx,s.save()),ps(s,o,r,a===n-1))}s&&s.restore()}},e.prototype.getHoverLayer=function(){return this.getLayer(Q_)},e.prototype.paintOne=function(t,n){RP(t,n)},e.prototype._paintList=function(t,n,i,r){if(this._redrawId===r){i=i||!1,this._updateLayerStatus(t);var s=this._doPaintList(t,n,i),a=s.finished,o=s.needsRefreshHover;if(this._needsManuallyCompositing&&this._compositeManually(),o&&this._paintHoverList(t),a)this.eachLayer(function(c){c.afterBrush&&c.afterBrush()});else{var l=this;Yc(function(){l._paintList(t,n,i,r)})}}},e.prototype._compositeManually=function(){var t=this.getLayer(ts).ctx,n=this._domRoot.width,i=this._domRoot.height;t.clearRect(0,0,n,i),this.eachBuiltinLayer(function(r){r.virtual&&t.drawImage(r.dom,0,0,n,i)})},e.prototype._doPaintList=function(t,n,i){for(var r=this,s=[],a=this._opts.useDirtyRect,o=0;o<this._zlevelList.length;o++){var l=this._zlevelList[o],c=this._layers[l];c.__builtin__&&c!==this._hoverlayer&&(c.__dirty||i)&&s.push(c)}for(var f=!0,u=!1,h=function(_){var m=s[_],p=m.ctx,g=a&&m.createRepaintRects(t,n,d._width,d._height),M=i?m.__startIndex:m.__drawIndex,S=!i&&m.incremental&&Date.now,E=S&&Date.now(),T=m.zlevel===d._zlevelList[0]?d._backgroundColor:null;if(m.__startIndex===m.__endIndex)m.clear(!1,T,g);else if(M===m.__startIndex){var C=t[M];(!C.incremental||!C.notClear||i)&&m.clear(!1,T,g)}M===-1&&(console.error("For some unknown reason. drawIndex is -1"),M=m.__startIndex);var L,y=function(F){var O={inHover:!1,allClipped:!1,prevEl:null,viewWidth:r._width,viewHeight:r._height};for(L=M;L<m.__endIndex;L++){var q=t[L];if(q.__inHover&&(u=!0),r._doPaintEl(q,m,a,F,O,L===m.__endIndex-1),S){var V=Date.now()-E;if(V>15)break}}O.prevElClipPaths&&p.restore()};if(g)if(g.length===0)L=m.__endIndex;else for(var b=d.dpr,R=0;R<g.length;++R){var I=g[R];p.save(),p.beginPath(),p.rect(I.x*b,I.y*b,I.width*b,I.height*b),p.clip(),y(I),p.restore()}else p.save(),y(),p.restore();m.__drawIndex=L,m.__drawIndex<m.__endIndex&&(f=!1)},d=this,v=0;v<s.length;v++)h(v);return ge.wxa&&ln(this._layers,function(_){_&&_.ctx&&_.ctx.draw&&_.ctx.draw()}),{finished:f,needsRefreshHover:u}},e.prototype._doPaintEl=function(t,n,i,r,s,a){var o=n.ctx;if(i){var l=t.getPaintRect();(!r||l&&l.intersect(r))&&(ps(o,t,s,a),t.setPrevPaintRect(l))}else ps(o,t,s,a)},e.prototype.getLayer=function(t,n){this._singleCanvas&&!this._needsManuallyCompositing&&(t=ts);var i=this._layers[t];return i||(i=new Fh("zr_"+t,this,this.dpr),i.zlevel=t,i.__builtin__=!0,this._layerConfig[t]?oo(i,this._layerConfig[t],!0):this._layerConfig[t-Wl]&&oo(i,this._layerConfig[t-Wl],!0),n&&(i.virtual=n),this.insertLayer(t,i),i.initContext()),i},e.prototype.insertLayer=function(t,n){var i=this._layers,r=this._zlevelList,s=r.length,a=this._domRoot,o=null,l=-1;if(!i[t]&&DP(n)){if(s>0&&t>r[0]){for(l=0;l<s-1&&!(r[l]<t&&r[l+1]>t);l++);o=i[r[l]]}if(r.splice(l+1,0,t),i[t]=n,!n.virtual)if(o){var c=o.dom;c.nextSibling?a.insertBefore(n.dom,c.nextSibling):a.appendChild(n.dom)}else a.firstChild?a.insertBefore(n.dom,a.firstChild):a.appendChild(n.dom);n.painter||(n.painter=this)}},e.prototype.eachLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r];t.call(n,this._layers[s],s)}},e.prototype.eachBuiltinLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r],a=this._layers[s];a.__builtin__&&t.call(n,a,s)}},e.prototype.eachOtherLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r],a=this._layers[s];a.__builtin__||t.call(n,a,s)}},e.prototype.getLayers=function(){return this._layers},e.prototype._updateLayerStatus=function(t){this.eachBuiltinLayer(function(u,h){u.__dirty=u.__used=!1});function n(u){s&&(s.__endIndex!==u&&(s.__dirty=!0),s.__endIndex=u)}if(this._singleCanvas)for(var i=1;i<t.length;i++){var r=t[i];if(r.zlevel!==t[i-1].zlevel||r.incremental){this._needsManuallyCompositing=!0;break}}var s=null,a=0,o,l;for(l=0;l<t.length;l++){var r=t[l],c=r.zlevel,f=void 0;o!==c&&(o=c,a=0),r.incremental?(f=this.getLayer(c+LP,this._needsManuallyCompositing),f.incremental=!0,a=1):f=this.getLayer(c+(a>0?Wl:0),this._needsManuallyCompositing),f.__builtin__||Wp("ZLevel "+c+" has been used by unkown layer "+f.id),f!==s&&(f.__used=!0,f.__startIndex!==l&&(f.__dirty=!0),f.__startIndex=l,f.incremental?f.__drawIndex=-1:f.__drawIndex=l,n(l),s=f),r.__dirty&vn&&!r.__inHover&&(f.__dirty=!0,f.incremental&&f.__drawIndex<0&&(f.__drawIndex=l))}n(l),this.eachBuiltinLayer(function(u,h){!u.__used&&u.getElementCount()>0&&(u.__dirty=!0,u.__startIndex=u.__endIndex=u.__drawIndex=0),u.__dirty&&u.__drawIndex<0&&(u.__drawIndex=u.__startIndex)})},e.prototype.clear=function(){return this.eachBuiltinLayer(this._clearLayer),this},e.prototype._clearLayer=function(t){t.clear()},e.prototype.setBackgroundColor=function(t){this._backgroundColor=t,ln(this._layers,function(n){n.setUnpainted()})},e.prototype.configLayer=function(t,n){if(n){var i=this._layerConfig;i[t]?oo(i[t],n,!0):i[t]=n;for(var r=0;r<this._zlevelList.length;r++){var s=this._zlevelList[r];if(s===t||s===t+Wl){var a=this._layers[s];oo(a,i[t],!0)}}}},e.prototype.delLayer=function(t){var n=this._layers,i=this._zlevelList,r=n[t];r&&(r.dom.parentNode.removeChild(r.dom),delete n[t],i.splice(di(i,t),1))},e.prototype.resize=function(t,n){if(this._domRoot.style){var i=this._domRoot;i.style.display="none";var r=this._opts,s=this.root;if(t!=null&&(r.width=t),n!=null&&(r.height=n),t=kl(s,0,r),n=kl(s,1,r),i.style.display="",this._width!==t||n!==this._height){i.style.width=t+"px",i.style.height=n+"px";for(var a in this._layers)this._layers.hasOwnProperty(a)&&this._layers[a].resize(t,n);this.refresh(!0)}this._width=t,this._height=n}else{if(t==null||n==null)return;this._width=t,this._height=n,this.getLayer(ts).resize(t,n)}return this},e.prototype.clearLayer=function(t){var n=this._layers[t];n&&n.clear()},e.prototype.dispose=function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},e.prototype.getRenderedCanvas=function(t){if(t=t||{},this._singleCanvas&&!this._compositeManually)return this._layers[ts].dom;var n=new Fh("image",this,t.pixelRatio||this.dpr);n.initContext(),n.clear(!1,t.backgroundColor||this._backgroundColor);var i=n.ctx;if(t.pixelRatio<=this.dpr){this.refresh();var r=n.dom.width,s=n.dom.height;this.eachLayer(function(u){u.__builtin__?i.drawImage(u.dom,0,0,r,s):u.renderToCanvas&&(i.save(),u.renderToCanvas(i),i.restore())})}else for(var a={inHover:!1,viewWidth:this._width,viewHeight:this._height},o=this.storage.getDisplayList(!0),l=0,c=o.length;l<c;l++){var f=o[l];ps(i,f,a,l===c-1)}return n.dom},e.prototype.getWidth=function(){return this._width},e.prototype.getHeight=function(){return this._height},e}();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const gu="182",Ty=0,ip=1,Ey=2,Po=1,wy=2,la=3,tr=0,Je=1,mi=2,Mi=0,Ms=1,rp=2,sp=3,ap=4,Ay=5,_r=100,Cy=101,Ry=102,Py=103,Ly=104,Dy=200,Iy=201,Ny=202,Fy=203,nf=204,rf=205,Uy=206,Oy=207,By=208,Hy=209,zy=210,Vy=211,Gy=212,ky=213,Wy=214,sf=0,af=1,of=2,ws=3,lf=4,cf=5,ff=6,uf=7,Kp=0,Xy=1,qy=2,Yn=0,Zp=1,Jp=2,jp=3,Qp=4,tm=5,em=6,nm=7,im=300,Rr=301,As=302,hf=303,df=304,cl=306,pf=1e3,vi=1001,mf=1002,Le=1003,Yy=1004,po=1005,Ie=1006,wc=1007,Sr=1008,_n=1009,rm=1010,sm=1011,Aa=1012,xu=1013,ti=1014,kn=1015,Ei=1016,yu=1017,Su=1018,Ca=1020,am=35902,om=35899,lm=1021,cm=1022,Ln=1023,wi=1026,Mr=1027,fm=1028,Mu=1029,Cs=1030,bu=1031,Tu=1033,Lo=33776,Do=33777,Io=33778,No=33779,vf=35840,_f=35841,gf=35842,xf=35843,yf=36196,Sf=37492,Mf=37496,bf=37488,Tf=37489,Ef=37490,wf=37491,Af=37808,Cf=37809,Rf=37810,Pf=37811,Lf=37812,Df=37813,If=37814,Nf=37815,Ff=37816,Uf=37817,Of=37818,Bf=37819,Hf=37820,zf=37821,Vf=36492,Gf=36494,kf=36495,Wf=36283,Xf=36284,qf=36285,Yf=36286,$y=3200,Ky=0,Zy=1,$i="",mn="srgb",Rs="srgb-linear",Qo="linear",ne="srgb",ls=7680,op=519,Jy=512,jy=513,Qy=514,Eu=515,tS=516,eS=517,wu=518,nS=519,lp=35044,cp="300 es",Wn=2e3,tl=2001;function iS(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function $f(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function rS(){const e=$f("canvas");return e.style.display="block",e}const tg={};function fp(...e){const t="THREE."+e.shift();console.log(t,...e)}function Vt(...e){const t="THREE."+e.shift();console.warn(t,...e)}function jt(...e){const t="THREE."+e.shift();console.error(t,...e)}function Ra(...e){const t=e.join(" ");t in tg||(tg[t]=!0,Vt(...e))}function NP(e,t,n){return new Promise(function(i,r){function s(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:r();break;case e.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}class Ls{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){const i=this._listeners;if(i===void 0)return;const r=i[t];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const n=this._listeners;if(n===void 0)return;const i=n[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Uh=Math.PI/180,up=180/Math.PI;function fl(){const e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fe[e&255]+Fe[e>>8&255]+Fe[e>>16&255]+Fe[e>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[n&63|128]+Fe[n>>8&255]+"-"+Fe[n>>16&255]+Fe[n>>24&255]+Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]).toLowerCase()}function Zt(e,t,n){return Math.max(t,Math.min(n,e))}function FP(e,t){return(e%t+t)%t}function Oh(e,t,n){return(1-n)*e+n*t}function Za(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function en(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}class oe{constructor(t=0,n=0){oe.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const n=this.x,i=this.y,r=t.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(t)/n;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*r+t.x,this.y=s*r+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fa{constructor(t=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=r}static slerpFlat(t,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],f=i[r+2],u=i[r+3],h=s[a+0],d=s[a+1],v=s[a+2],_=s[a+3];if(o<=0){t[n+0]=l,t[n+1]=c,t[n+2]=f,t[n+3]=u;return}if(o>=1){t[n+0]=h,t[n+1]=d,t[n+2]=v,t[n+3]=_;return}if(u!==_||l!==h||c!==d||f!==v){let m=l*h+c*d+f*v+u*_;m<0&&(h=-h,d=-d,v=-v,_=-_,m=-m);let p=1-o;if(m<.9995){const g=Math.acos(m),M=Math.sin(g);p=Math.sin(p*g)/M,o=Math.sin(o*g)/M,l=l*p+h*o,c=c*p+d*o,f=f*p+v*o,u=u*p+_*o}else{l=l*p+h*o,c=c*p+d*o,f=f*p+v*o,u=u*p+_*o;const g=1/Math.sqrt(l*l+c*c+f*f+u*u);l*=g,c*=g,f*=g,u*=g}}t[n]=l,t[n+1]=c,t[n+2]=f,t[n+3]=u}static multiplyQuaternionsFlat(t,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],f=i[r+3],u=s[a],h=s[a+1],d=s[a+2],v=s[a+3];return t[n]=o*v+f*u+l*d-c*h,t[n+1]=l*v+f*h+c*u-o*d,t[n+2]=c*v+f*d+o*h-l*u,t[n+3]=f*v-o*u-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,r){return this._x=t,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){const i=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(r/2),u=o(s/2),h=l(i/2),d=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=h*f*u+c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u-h*d*v;break;case"YXZ":this._x=h*f*u+c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u+h*d*v;break;case"ZXY":this._x=h*f*u-c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u-h*d*v;break;case"ZYX":this._x=h*f*u-c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u+h*d*v;break;case"YZX":this._x=h*f*u+c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u-h*d*v;break;case"XZY":this._x=h*f*u-c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u+h*d*v;break;default:Vt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){const i=n/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const n=t.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],f=n[6],u=n[10],h=i+o+u;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(f-l)*d,this._y=(s-c)*d,this._z=(a-r)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(f-l)/d,this._x=.25*d,this._y=(r+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(s-c)/d,this._x=(r+a)/d,this._y=.25*d,this._z=(l+f)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-r)/d,this._x=(s+c)/d,this._y=(l+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,n){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){const i=t._x,r=t._y,s=t._z,a=t._w,o=n._x,l=n._y,c=n._z,f=n._w;return this._x=i*f+a*o+r*c-s*l,this._y=r*f+a*l+s*o-i*c,this._z=s*f+a*c+i*l-r*o,this._w=a*f-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(t,n){if(n<=0)return this;if(n>=1)return this.copy(t);let i=t._x,r=t._y,s=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-n;if(o<.9995){const c=Math.acos(o),f=Math.sin(c);l=Math.sin(l*c)/f,n=Math.sin(n*c)/f,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){const t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(n),s*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(t=0,n=0,i=0){$.prototype.isVector3=!0,this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(eg.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(eg.setFromAxisAngle(t,n))}applyMatrix3(t){const n=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const n=this.x,i=this.y,r=this.z,s=t.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(t){const n=this.x,i=this.y,r=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*r-o*i),f=2*(o*n-s*r),u=2*(s*i-a*n);return this.x=n+l*c+a*u-o*f,this.y=i+l*f+o*c-s*u,this.z=r+l*u+s*f-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const n=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this.z=Zt(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this.z=Zt(this.z,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){const i=t.x,r=t.y,s=t.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(t){const n=t.lengthSq();if(n===0)return this.set(0,0,0);const i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Bh.copy(this).projectOnVector(t),this.sub(Bh)}reflect(t){return this.sub(Bh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(t)/n;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const n=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return n*n+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){const r=Math.sin(n)*t;return this.x=r*Math.sin(i),this.y=Math.cos(n)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){const n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){const n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Bh=new $,eg=new Fa;class Xt{constructor(t,n,i,r,s,a,o,l,c){Xt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,r,s,a,o,l,c)}set(t,n,i,r,s,a,o,l,c){const f=this.elements;return f[0]=t,f[1]=r,f[2]=o,f[3]=n,f[4]=s,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){const i=t.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],u=i[7],h=i[2],d=i[5],v=i[8],_=r[0],m=r[3],p=r[6],g=r[1],M=r[4],S=r[7],E=r[2],T=r[5],C=r[8];return s[0]=a*_+o*g+l*E,s[3]=a*m+o*M+l*T,s[6]=a*p+o*S+l*C,s[1]=c*_+f*g+u*E,s[4]=c*m+f*M+u*T,s[7]=c*p+f*S+u*C,s[2]=h*_+d*g+v*E,s[5]=h*m+d*M+v*T,s[8]=h*p+d*S+v*C,this}multiplyScalar(t){const n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8];return n*a*f-n*o*c-i*s*f+i*o*l+r*s*c-r*a*l}invert(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=f*a-o*c,h=o*l-f*s,d=c*s-a*l,v=n*u+i*h+r*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return t[0]=u*_,t[1]=(r*c-f*i)*_,t[2]=(o*i-r*a)*_,t[3]=h*_,t[4]=(f*n-r*l)*_,t[5]=(r*s-o*n)*_,t[6]=d*_,t[7]=(i*l-c*n)*_,t[8]=(a*n-i*s)*_,this}transpose(){let t;const n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(t,n){return this.premultiply(Hh.makeScale(t,n)),this}rotate(t){return this.premultiply(Hh.makeRotation(-t)),this}translate(t,n){return this.premultiply(Hh.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){const n=this.elements,i=t.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){const i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Hh=new Xt,ng=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ig=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function UP(){const e={enabled:!0,workingColorSpace:Rs,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ne&&(r.r=Ki(r.r),r.g=Ki(r.g),r.b=Ki(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(r.r=ga(r.r),r.g=ga(r.g),r.b=ga(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===$i?Qo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Ra("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Ra("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Rs]:{primaries:t,whitePoint:i,transfer:Qo,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:t,whitePoint:i,transfer:ne,toXYZ:ng,fromXYZ:ig,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}}),e}const Jt=UP();function Ki(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function ga(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}let Vs;class sS{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Vs===void 0&&(Vs=$f("canvas")),Vs.width=t.width,Vs.height=t.height;const r=Vs.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),i=Vs}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const n=$f("canvas");n.width=t.width,n.height=t.height;const i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Ki(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(t.data){const n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ki(n[i]/255)*255):n[i]=Ki(n[i]);return{data:n,width:t.width,height:t.height}}else return Vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let OP=0;class Au{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:OP++}),this.uuid=fl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const n=this.data;return typeof HTMLVideoElement!="undefined"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame!="undefined"&&n instanceof VideoFrame?t.set(n.displayHeight,n.displayWidth,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(zh(r[a].image)):s.push(zh(r[a]))}else s=zh(r);i.url=s}return n||(t.images[this.uuid]=i),i}}function zh(e){return typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap?sS.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Vt("Texture: Unable to serialize Texture."),{})}let BP=0;const Vh=new $;class Ve extends Ls{constructor(t=Ve.DEFAULT_IMAGE,n=Ve.DEFAULT_MAPPING,i=vi,r=vi,s=Ie,a=Sr,o=Ln,l=_n,c=Ve.DEFAULT_ANISOTROPY,f=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:BP++}),this.uuid=fl(),this.name="",this.source=new Au(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Vh).x}get height(){return this.source.getSize(Vh).y}get depth(){return this.source.getSize(Vh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const n in t){const i=t[n];if(i===void 0){Vt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Vt(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(t){const n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==im)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case pf:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case mf:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case pf:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case mf:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ve.DEFAULT_IMAGE=null;Ve.DEFAULT_MAPPING=im;Ve.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,n=0,i=0,r=1){Se.prototype.isVector4=!0,this.x=t,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,r){return this.x=t,this.y=n,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const n=this.x,i=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,r,s;const l=t.elements,c=l[0],f=l[4],u=l[8],h=l[1],d=l[5],v=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(f-h)<.01&&Math.abs(u-_)<.01&&Math.abs(v-m)<.01){if(Math.abs(f+h)<.1&&Math.abs(u+_)<.1&&Math.abs(v+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const M=(c+1)/2,S=(d+1)/2,E=(p+1)/2,T=(f+h)/4,C=(u+_)/4,L=(v+m)/4;return M>S&&M>E?M<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(M),r=T/i,s=C/i):S>E?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=T/r,s=L/r):E<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),i=C/s,r=L/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-v)*(m-v)+(u-_)*(u-_)+(h-f)*(h-f));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(u-_)/g,this.z=(h-f)/g,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this.z=Zt(this.z,t.z,n.z),this.w=Zt(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this.z=Zt(this.z,t,n),this.w=Zt(this.w,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class aS extends Ls{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ie,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new Se(0,0,t,n),this.scissorTest=!1,this.viewport=new Se(0,0,t,n);const r={width:t,height:n,depth:i.depth},s=new Ve(r);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const n={minFilter:Ie,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},t.textures[n].image);this.textures[n].source=new Au(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $n extends aS{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}}class um extends Ve{constructor(t=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:r},this.magFilter=Le,this.minFilter=Le,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class oS extends Ve{constructor(t=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:r},this.magFilter=Le,this.minFilter=Le,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ua{constructor(t=new $(1/0,1/0,1/0),n=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Fn.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Fn.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){const i=Fn.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Fn):Fn.fromBufferAttribute(s,a),Fn.applyMatrix4(t.matrixWorld),this.expandByPoint(Fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xl.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xl.copy(i.boundingBox)),Xl.applyMatrix4(t.matrixWorld),this.union(Xl)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fn),Fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ja),ql.subVectors(this.max,Ja),Gs.subVectors(t.a,Ja),ks.subVectors(t.b,Ja),Ws.subVectors(t.c,Ja),sr.subVectors(ks,Gs),ar.subVectors(Ws,ks),es.subVectors(Gs,Ws);let n=[0,-sr.z,sr.y,0,-ar.z,ar.y,0,-es.z,es.y,sr.z,0,-sr.x,ar.z,0,-ar.x,es.z,0,-es.x,-sr.y,sr.x,0,-ar.y,ar.x,0,-es.y,es.x,0];return!Gh(n,Gs,ks,Ws,ql)||(n=[1,0,0,0,1,0,0,0,1],!Gh(n,Gs,ks,Ws,ql))?!1:(Yl.crossVectors(sr,ar),n=[Yl.x,Yl.y,Yl.z],Gh(n,Gs,ks,Ws,ql))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Oi=[new $,new $,new $,new $,new $,new $,new $,new $],Fn=new $,Xl=new Ua,Gs=new $,ks=new $,Ws=new $,sr=new $,ar=new $,es=new $,Ja=new $,ql=new $,Yl=new $,ns=new $;function Gh(e,t,n,i,r){for(let s=0,a=e.length-3;s<=a;s+=3){ns.fromArray(e,s);const o=r.x*Math.abs(ns.x)+r.y*Math.abs(ns.y)+r.z*Math.abs(ns.z),l=t.dot(ns),c=n.dot(ns),f=i.dot(ns);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const HP=new Ua,ja=new $,kh=new $;class Cu{constructor(t=new $,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){const i=this.center;n!==void 0?i.copy(n):HP.setFromPoints(t).getCenter(i);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){const i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ja.subVectors(t,this.center);const n=ja.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ja,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(kh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ja.copy(t.center).add(kh)),this.expandByPoint(ja.copy(t.center).sub(kh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Bi=new $,Wh=new $,$l=new $,or=new $,Xh=new $,Kl=new $,qh=new $;class lS{constructor(t=new $,n=new $(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bi)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const n=Bi.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(Bi.copy(this.origin).addScaledVector(this.direction,n),Bi.distanceToSquared(t))}distanceSqToSegment(t,n,i,r){Wh.copy(t).add(n).multiplyScalar(.5),$l.copy(n).sub(t).normalize(),or.copy(this.origin).sub(Wh);const s=t.distanceTo(n)*.5,a=-this.direction.dot($l),o=or.dot(this.direction),l=-or.dot($l),c=or.lengthSq(),f=Math.abs(1-a*a);let u,h,d,v;if(f>0)if(u=a*l-o,h=a*o-l,v=s*f,u>=0)if(h>=-v)if(h<=v){const _=1/f;u*=_,h*=_,d=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h<=-v?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+h*(h+2*l)+c):h<=v?(u=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Wh).addScaledVector($l,h),d}intersectSphere(t,n){Bi.subVectors(t.center,this.origin);const i=Bi.dot(this.direction),r=Bi.dot(Bi)-i*i,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){const i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){const n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,r,s,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,r=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,r=(t.min.x-h.x)*c),f>=0?(s=(t.min.y-h.y)*f,a=(t.max.y-h.y)*f):(s=(t.max.y-h.y)*f,a=(t.min.y-h.y)*f),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-h.z)*u,l=(t.max.z-h.z)*u):(o=(t.max.z-h.z)*u,l=(t.min.z-h.z)*u),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(t){return this.intersectBox(t,Bi)!==null}intersectTriangle(t,n,i,r,s){Xh.subVectors(n,t),Kl.subVectors(i,t),qh.crossVectors(Xh,Kl);let a=this.direction.dot(qh),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;or.subVectors(this.origin,t);const l=o*this.direction.dot(Kl.crossVectors(or,Kl));if(l<0)return null;const c=o*this.direction.dot(Xh.cross(or));if(c<0||l+c>a)return null;const f=-o*or.dot(qh);return f<0?null:this.at(f/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Te{constructor(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m){Te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m)}set(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m){const p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=f,p[10]=u,p[14]=h,p[3]=d,p[7]=v,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(t){const n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){const n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){const n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinant()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const n=this.elements,i=t.elements,r=1/Xs.setFromMatrixColumn(t,0).length(),s=1/Xs.setFromMatrixColumn(t,1).length(),a=1/Xs.setFromMatrixColumn(t,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){const n=this.elements,i=t.x,r=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),f=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=a*f,d=a*u,v=o*f,_=o*u;n[0]=l*f,n[4]=-l*u,n[8]=c,n[1]=d+v*c,n[5]=h-_*c,n[9]=-o*l,n[2]=_-h*c,n[6]=v+d*c,n[10]=a*l}else if(t.order==="YXZ"){const h=l*f,d=l*u,v=c*f,_=c*u;n[0]=h+_*o,n[4]=v*o-d,n[8]=a*c,n[1]=a*u,n[5]=a*f,n[9]=-o,n[2]=d*o-v,n[6]=_+h*o,n[10]=a*l}else if(t.order==="ZXY"){const h=l*f,d=l*u,v=c*f,_=c*u;n[0]=h-_*o,n[4]=-a*u,n[8]=v+d*o,n[1]=d+v*o,n[5]=a*f,n[9]=_-h*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(t.order==="ZYX"){const h=a*f,d=a*u,v=o*f,_=o*u;n[0]=l*f,n[4]=v*c-d,n[8]=h*c+_,n[1]=l*u,n[5]=_*c+h,n[9]=d*c-v,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(t.order==="YZX"){const h=a*l,d=a*c,v=o*l,_=o*c;n[0]=l*f,n[4]=_-h*u,n[8]=v*u+d,n[1]=u,n[5]=a*f,n[9]=-o*f,n[2]=-c*f,n[6]=d*u+v,n[10]=h-_*u}else if(t.order==="XZY"){const h=a*l,d=a*c,v=o*l,_=o*c;n[0]=l*f,n[4]=-u,n[8]=c*f,n[1]=h*u+_,n[5]=a*f,n[9]=d*u-v,n[2]=v*u-d,n[6]=o*f,n[10]=_*u+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zP,t,VP)}lookAt(t,n,i){const r=this.elements;return hn.subVectors(t,n),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),lr.crossVectors(i,hn),lr.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),lr.crossVectors(i,hn)),lr.normalize(),Zl.crossVectors(hn,lr),r[0]=lr.x,r[4]=Zl.x,r[8]=hn.x,r[1]=lr.y,r[5]=Zl.y,r[9]=hn.y,r[2]=lr.z,r[6]=Zl.z,r[10]=hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){const i=t.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],u=i[5],h=i[9],d=i[13],v=i[2],_=i[6],m=i[10],p=i[14],g=i[3],M=i[7],S=i[11],E=i[15],T=r[0],C=r[4],L=r[8],y=r[12],b=r[1],R=r[5],I=r[9],F=r[13],O=r[2],q=r[6],V=r[10],z=r[14],K=r[3],dt=r[7],ct=r[11],ht=r[15];return s[0]=a*T+o*b+l*O+c*K,s[4]=a*C+o*R+l*q+c*dt,s[8]=a*L+o*I+l*V+c*ct,s[12]=a*y+o*F+l*z+c*ht,s[1]=f*T+u*b+h*O+d*K,s[5]=f*C+u*R+h*q+d*dt,s[9]=f*L+u*I+h*V+d*ct,s[13]=f*y+u*F+h*z+d*ht,s[2]=v*T+_*b+m*O+p*K,s[6]=v*C+_*R+m*q+p*dt,s[10]=v*L+_*I+m*V+p*ct,s[14]=v*y+_*F+m*z+p*ht,s[3]=g*T+M*b+S*O+E*K,s[7]=g*C+M*R+S*q+E*dt,s[11]=g*L+M*I+S*V+E*ct,s[15]=g*y+M*F+S*z+E*ht,this}multiplyScalar(t){const n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){const t=this.elements,n=t[0],i=t[4],r=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],f=t[2],u=t[6],h=t[10],d=t[14],v=t[3],_=t[7],m=t[11],p=t[15],g=l*d-c*h,M=o*d-c*u,S=o*h-l*u,E=a*d-c*f,T=a*h-l*f,C=a*u-o*f;return n*(_*g-m*M+p*S)-i*(v*g-m*E+p*T)+r*(v*M-_*E+p*C)-s*(v*S-_*T+m*C)}transpose(){const t=this.elements;let n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=n,r[14]=i),this}invert(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=t[9],h=t[10],d=t[11],v=t[12],_=t[13],m=t[14],p=t[15],g=u*m*c-_*h*c+_*l*d-o*m*d-u*l*p+o*h*p,M=v*h*c-f*m*c-v*l*d+a*m*d+f*l*p-a*h*p,S=f*_*c-v*u*c+v*o*d-a*_*d-f*o*p+a*u*p,E=v*u*l-f*_*l-v*o*h+a*_*h+f*o*m-a*u*m,T=n*g+i*M+r*S+s*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/T;return t[0]=g*C,t[1]=(_*h*s-u*m*s-_*r*d+i*m*d+u*r*p-i*h*p)*C,t[2]=(o*m*s-_*l*s+_*r*c-i*m*c-o*r*p+i*l*p)*C,t[3]=(u*l*s-o*h*s-u*r*c+i*h*c+o*r*d-i*l*d)*C,t[4]=M*C,t[5]=(f*m*s-v*h*s+v*r*d-n*m*d-f*r*p+n*h*p)*C,t[6]=(v*l*s-a*m*s-v*r*c+n*m*c+a*r*p-n*l*p)*C,t[7]=(a*h*s-f*l*s+f*r*c-n*h*c-a*r*d+n*l*d)*C,t[8]=S*C,t[9]=(v*u*s-f*_*s-v*i*d+n*_*d+f*i*p-n*u*p)*C,t[10]=(a*_*s-v*o*s+v*i*c-n*_*c-a*i*p+n*o*p)*C,t[11]=(f*o*s-a*u*s-f*i*c+n*u*c+a*i*d-n*o*d)*C,t[12]=E*C,t[13]=(f*_*r-v*u*r+v*i*h-n*_*h-f*i*m+n*u*m)*C,t[14]=(v*o*r-a*_*r-v*i*l+n*_*l+a*i*m-n*o*m)*C,t[15]=(a*u*r-f*o*r+f*i*l-n*u*l-a*i*h+n*o*h)*C,this}scale(t){const n=this.elements,i=t.x,r=t.y,s=t.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){const n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,f=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,f*o+i,f*l-r*a,0,c*l-r*o,f*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,r,s,a){return this.set(1,i,s,0,t,1,a,0,n,r,1,0,0,0,0,1),this}compose(t,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,f=a+a,u=o+o,h=s*c,d=s*f,v=s*u,_=a*f,m=a*u,p=o*u,g=l*c,M=l*f,S=l*u,E=i.x,T=i.y,C=i.z;return r[0]=(1-(_+p))*E,r[1]=(d+S)*E,r[2]=(v-M)*E,r[3]=0,r[4]=(d-S)*T,r[5]=(1-(h+p))*T,r[6]=(m+g)*T,r[7]=0,r[8]=(v+M)*C,r[9]=(m-g)*C,r[10]=(1-(h+_))*C,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,n,i){const r=this.elements;if(t.x=r[12],t.y=r[13],t.z=r[14],this.determinant()===0)return i.set(1,1,1),n.identity(),this;let s=Xs.set(r[0],r[1],r[2]).length();const a=Xs.set(r[4],r[5],r[6]).length(),o=Xs.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),Un.copy(this);const c=1/s,f=1/a,u=1/o;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=f,Un.elements[5]*=f,Un.elements[6]*=f,Un.elements[8]*=u,Un.elements[9]*=u,Un.elements[10]*=u,n.setFromRotationMatrix(Un),i.x=s,i.y=a,i.z=o,this}makePerspective(t,n,i,r,s,a,o=Wn,l=!1){const c=this.elements,f=2*s/(n-t),u=2*s/(i-r),h=(n+t)/(n-t),d=(i+r)/(i-r);let v,_;if(l)v=s/(a-s),_=a*s/(a-s);else if(o===Wn)v=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===tl)v=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,r,s,a,o=Wn,l=!1){const c=this.elements,f=2/(n-t),u=2/(i-r),h=-(n+t)/(n-t),d=-(i+r)/(i-r);let v,_;if(l)v=1/(a-s),_=a/(a-s);else if(o===Wn)v=-2/(a-s),_=-(a+s)/(a-s);else if(o===tl)v=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=v,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const n=this.elements,i=t.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){const i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}}const Xs=new $,Un=new Te,zP=new $(0,0,0),VP=new $(1,1,1),lr=new $,Zl=new $,hn=new $,rg=new Te,sg=new Fa;class Ai{constructor(t=0,n=0,i=0,r=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,r=this._order){return this._x=t,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],f=r[9],u=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-f,d),this._y=0);break;default:Vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return rg.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rg,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return sg.setFromEuler(this),this.setFromQuaternion(sg,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class hm{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let GP=0;const ag=new $,qs=new Fa,Hi=new Te,Jl=new $,Qa=new $,kP=new $,WP=new Fa,og=new $(1,0,0),lg=new $(0,1,0),cg=new $(0,0,1),fg={type:"added"},XP={type:"removed"},Ys={type:"childadded",child:null},Yh={type:"childremoved",child:null};class cn extends Ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:GP++}),this.uuid=fl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const t=new $,n=new Ai,i=new Fa,r=new $(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Te},normalMatrix:{value:new Xt}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return qs.setFromAxisAngle(t,n),this.quaternion.multiply(qs),this}rotateOnWorldAxis(t,n){return qs.setFromAxisAngle(t,n),this.quaternion.premultiply(qs),this}rotateX(t){return this.rotateOnAxis(og,t)}rotateY(t){return this.rotateOnAxis(lg,t)}rotateZ(t){return this.rotateOnAxis(cg,t)}translateOnAxis(t,n){return ag.copy(t).applyQuaternion(this.quaternion),this.position.add(ag.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(og,t)}translateY(t){return this.translateOnAxis(lg,t)}translateZ(t){return this.translateOnAxis(cg,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?Jl.copy(t):Jl.set(t,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Qa,Jl,this.up):Hi.lookAt(Jl,Qa,this.up),this.quaternion.setFromRotationMatrix(Hi),r&&(Hi.extractRotation(r.matrixWorld),qs.setFromRotationMatrix(Hi),this.quaternion.premultiply(qs.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(jt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(fg),Ys.child=t,this.dispatchEvent(Ys),Ys.child=null):jt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(XP),Yh.child=t,this.dispatchEvent(Yh),Yh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(fg),Ys.child=t,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(t,n);if(a!==void 0)return a}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qa,t,kP),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qa,WP,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(t)}traverseAncestors(t){const n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>Im(Nu({},o),{boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>Nu({},o)),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(t.animations,l))}}if(n){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),f=a(t.images),u=a(t.shapes),h=a(t.skeletons),d=a(t.animations),v=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}cn.DEFAULT_UP=new $(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new $,zi=new $,$h=new $,Vi=new $,$s=new $,Ks=new $,ug=new $,Kh=new $,Zh=new $,Jh=new $,jh=new Se,Qh=new Se,td=new Se;class Rn{constructor(t=new $,n=new $,i=new $){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,r){r.subVectors(i,n),On.subVectors(t,n),r.cross(On);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,n,i,r,s){On.subVectors(r,n),zi.subVectors(i,n),$h.subVectors(t,n);const a=On.dot(On),o=On.dot(zi),l=On.dot($h),c=zi.dot(zi),f=zi.dot($h),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const h=1/u,d=(c*l-o*f)*h,v=(a*f-o*l)*h;return s.set(1-d-v,v,d)}static containsPoint(t,n,i,r){return this.getBarycoord(t,n,i,r,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(t,n,i,r,s,a,o,l){return this.getBarycoord(t,n,i,r,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vi.x),l.addScaledVector(a,Vi.y),l.addScaledVector(o,Vi.z),l)}static getInterpolatedAttribute(t,n,i,r,s,a){return jh.setScalar(0),Qh.setScalar(0),td.setScalar(0),jh.fromBufferAttribute(t,n),Qh.fromBufferAttribute(t,i),td.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(jh,s.x),a.addScaledVector(Qh,s.y),a.addScaledVector(td,s.z),a}static isFrontFacing(t,n,i,r){return On.subVectors(i,n),zi.subVectors(t,n),On.cross(zi).dot(r)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,r){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,n,i,r){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),On.cross(zi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return Rn.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,r,s){return Rn.getInterpolation(t,this.a,this.b,this.c,n,i,r,s)}containsPoint(t){return Rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){const i=this.a,r=this.b,s=this.c;let a,o;$s.subVectors(r,i),Ks.subVectors(s,i),Kh.subVectors(t,i);const l=$s.dot(Kh),c=Ks.dot(Kh);if(l<=0&&c<=0)return n.copy(i);Zh.subVectors(t,r);const f=$s.dot(Zh),u=Ks.dot(Zh);if(f>=0&&u<=f)return n.copy(r);const h=l*u-f*c;if(h<=0&&l>=0&&f<=0)return a=l/(l-f),n.copy(i).addScaledVector($s,a);Jh.subVectors(t,s);const d=$s.dot(Jh),v=Ks.dot(Jh);if(v>=0&&d<=v)return n.copy(s);const _=d*c-l*v;if(_<=0&&c>=0&&v<=0)return o=c/(c-v),n.copy(i).addScaledVector(Ks,o);const m=f*v-d*u;if(m<=0&&u-f>=0&&d-v>=0)return ug.subVectors(s,r),o=(u-f)/(u-f+(d-v)),n.copy(r).addScaledVector(ug,o);const p=1/(m+_+h);return a=_*p,o=h*p,n.copy(i).addScaledVector($s,a).addScaledVector(Ks,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const cS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cr={h:0,s:0,l:0},jl={h:0,s:0,l:0};function ed(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}class ae{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=mn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,r=Jt.workingColorSpace){return this.r=t,this.g=n,this.b=i,Jt.colorSpaceToWorking(this,r),this}setHSL(t,n,i,r=Jt.workingColorSpace){if(t=FP(t,1),n=Zt(n,0,1),i=Zt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=ed(a,s,t+1/3),this.g=ed(a,s,t),this.b=ed(a,s,t-1/3)}return Jt.colorSpaceToWorking(this,r),this}setStyle(t,n=mn){function i(s){s!==void 0&&parseFloat(s)<1&&Vt("Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Vt("Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);Vt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=mn){const i=cS[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Vt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}copyLinearToSRGB(t){return this.r=ga(t.r),this.g=ga(t.g),this.b=ga(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mn){return Jt.workingToColorSpace(Ue.copy(this),t),Math.round(Zt(Ue.r*255,0,255))*65536+Math.round(Zt(Ue.g*255,0,255))*256+Math.round(Zt(Ue.b*255,0,255))}getHexString(t=mn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=Jt.workingColorSpace){Jt.workingToColorSpace(Ue.copy(this),n);const i=Ue.r,r=Ue.g,s=Ue.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=f<=.5?u/(a+o):u/(2-a-o),a){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=f,t}getRGB(t,n=Jt.workingColorSpace){return Jt.workingToColorSpace(Ue.copy(this),n),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=mn){Jt.workingToColorSpace(Ue.copy(this),t);const n=Ue.r,i=Ue.g,r=Ue.b;return t!==mn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,n,i){return this.getHSL(cr),this.setHSL(cr.h+t,cr.s+n,cr.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(cr),t.getHSL(jl);const i=Oh(cr.h,jl.h,n),r=Oh(cr.s,jl.s,n),s=Oh(cr.l,jl.l,n);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const n=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new ae;ae.NAMES=cS;let qP=0;class ul extends Ls{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qP++}),this.uuid=fl(),this.name="",this.type="Material",this.blending=Ms,this.side=tr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=nf,this.blendDst=rf,this.blendEquation=_r,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=op,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ls,this.stencilZFail=ls,this.stencilZPass=ls,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const n in t){const i=t[n];if(i===void 0){Vt(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Vt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(t){const n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(i.blending=this.blending),this.side!==tr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==nf&&(i.blendSrc=this.blendSrc),this.blendDst!==rf&&(i.blendDst=this.blendDst),this.blendEquation!==_r&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==op&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ls&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ls&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ls&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(t.textures),a=r(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const n=t.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class dm extends ul{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=Kp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new $,Ql=new oe;let YP=0;class Kn{constructor(t,n,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:YP++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=lp,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=n.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ql.fromBufferAttribute(this,n),Ql.applyMatrix3(t),this.setXY(n,Ql.x,Ql.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ee.fromBufferAttribute(this,n),Ee.applyMatrix3(t),this.setXYZ(n,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)Ee.fromBufferAttribute(this,n),Ee.applyMatrix4(t),this.setXYZ(n,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)Ee.fromBufferAttribute(this,n),Ee.applyNormalMatrix(t),this.setXYZ(n,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)Ee.fromBufferAttribute(this,n),Ee.transformDirection(t),this.setXYZ(n,Ee.x,Ee.y,Ee.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Za(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=en(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Za(n,this.array)),n}setX(t,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Za(n,this.array)),n}setY(t,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Za(n,this.array)),n}setZ(t,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Za(n,this.array)),n}setW(t,n){return this.normalized&&(n=en(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,r){return t*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array),r=en(r,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,n,i,r,s){return t*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array),r=en(r,this.array),s=en(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==lp&&(t.usage=this.usage),t}}class pm extends Kn{constructor(t,n,i){super(new Uint16Array(t),n,i)}}class mm extends Kn{constructor(t,n,i){super(new Uint32Array(t),n,i)}}class bi extends Kn{constructor(t,n,i){super(new Float32Array(t),n,i)}}let $P=0;const Mn=new Te,nd=new cn,Zs=new $,dn=new Ua,to=new Ua,Re=new $;class Pi extends Ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$P++}),this.uuid=fl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(iS(t)?mm:pm)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Xt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Mn.makeRotationFromQuaternion(t),this.applyMatrix4(Mn),this}rotateX(t){return Mn.makeRotationX(t),this.applyMatrix4(Mn),this}rotateY(t){return Mn.makeRotationY(t),this.applyMatrix4(Mn),this}rotateZ(t){return Mn.makeRotationZ(t),this.applyMatrix4(Mn),this}translate(t,n,i){return Mn.makeTranslation(t,n,i),this.applyMatrix4(Mn),this}scale(t,n,i){return Mn.makeScale(t,n,i),this.applyMatrix4(Mn),this}lookAt(t){return nd.lookAt(t),nd.updateMatrix(),this.applyMatrix4(nd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zs).negate(),this.translate(Zs.x,Zs.y,Zs.z),this}setFromPoints(t){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new bi(i,3))}else{const i=Math.min(t.length,n.count);for(let r=0;r<i;r++){const s=t[r];n.setXYZ(r,s.x,s.y,s.z||0)}t.length>n.count&&Vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ua);const t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&jt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cu);const t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){jt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(t){const i=this.boundingSphere.center;if(dn.setFromBufferAttribute(t),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];to.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(dn.min,to.min),dn.expandByPoint(Re),Re.addVectors(dn.max,to.max),dn.expandByPoint(Re)):(dn.expandByPoint(to.min),dn.expandByPoint(to.max))}dn.getCenter(i);let r=0;for(let s=0,a=t.count;s<a;s++)Re.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(Re));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)Re.fromBufferAttribute(o,c),l&&(Zs.fromBufferAttribute(t,c),Re.add(Zs)),r=Math.max(r,i.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&jt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){jt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new $,l[L]=new $;const c=new $,f=new $,u=new $,h=new oe,d=new oe,v=new oe,_=new $,m=new $;function p(L,y,b){c.fromBufferAttribute(i,L),f.fromBufferAttribute(i,y),u.fromBufferAttribute(i,b),h.fromBufferAttribute(s,L),d.fromBufferAttribute(s,y),v.fromBufferAttribute(s,b),f.sub(c),u.sub(c),d.sub(h),v.sub(h);const R=1/(d.x*v.y-v.x*d.y);isFinite(R)&&(_.copy(f).multiplyScalar(v.y).addScaledVector(u,-d.y).multiplyScalar(R),m.copy(u).multiplyScalar(d.x).addScaledVector(f,-v.x).multiplyScalar(R),o[L].add(_),o[y].add(_),o[b].add(_),l[L].add(m),l[y].add(m),l[b].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:t.count}]);for(let L=0,y=g.length;L<y;++L){const b=g[L],R=b.start,I=b.count;for(let F=R,O=R+I;F<O;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const M=new $,S=new $,E=new $,T=new $;function C(L){E.fromBufferAttribute(r,L),T.copy(E);const y=o[L];M.copy(y),M.sub(E.multiplyScalar(E.dot(y))).normalize(),S.crossVectors(T,y);const R=S.dot(l[L])<0?-1:1;a.setXYZW(L,M.x,M.y,M.z,R)}for(let L=0,y=g.length;L<y;++L){const b=g[L],R=b.start,I=b.count;for(let F=R,O=R+I;F<O;F+=3)C(t.getX(F+0)),C(t.getX(F+1)),C(t.getX(F+2))}}computeVertexNormals(){const t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const r=new $,s=new $,a=new $,o=new $,l=new $,c=new $,f=new $,u=new $;if(t)for(let h=0,d=t.count;h<d;h+=3){const v=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),f.subVectors(a,s),u.subVectors(r,s),f.cross(u),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(f),l.add(f),c.add(f),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),f.subVectors(a,s),u.subVectors(r,s),f.cross(u),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)Re.fromBufferAttribute(t,n),Re.normalize(),t.setXYZ(n,Re.x,Re.y,Re.z)}toNonIndexed(){function t(o,l){const c=o.array,f=o.itemSize,u=o.normalized,h=new c.constructor(l.length*f);let d=0,v=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*f;for(let p=0;p<f;p++)h[v++]=c[d++]}return new Kn(h,f,u)}if(this.index===null)return Vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Pi,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=t(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let f=0,u=c.length;f<u;f++){const h=c[f],d=t(h,i);l.push(d)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let u=0,h=c.length;u<h;u++){const d=c[u];f.push(d.toJSON(t.data))}f.length>0&&(r[l]=f,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const r=t.attributes;for(const c in r){const f=r[c];this.setAttribute(c,f.clone(n))}const s=t.morphAttributes;for(const c in s){const f=[],u=s[c];for(let h=0,d=u.length;h<d;h++)f.push(u[h].clone(n));this.morphAttributes[c]=f}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,f=a.length;c<f;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hg=new Te,is=new lS,tc=new Cu,dg=new $,ec=new $,nc=new $,ic=new $,id=new $,rc=new $,pg=new $,sc=new $;class Ci extends cn{constructor(t=new Pi,n=new dm){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){rc.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const f=o[l],u=s[l];f!==0&&(id.fromBufferAttribute(u,t),a?rc.addScaledVector(id,f):rc.addScaledVector(id.sub(n),f))}n.add(rc)}return n}raycast(t,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),tc.copy(i.boundingSphere),tc.applyMatrix4(s),is.copy(t.ray).recast(t.near),!(tc.containsPoint(is.origin)===!1&&(is.intersectSphere(tc,dg)===null||is.origin.distanceToSquared(dg)>Dm(t.far-t.near,2)))&&(hg.copy(s).invert(),is.copy(t.ray).applyMatrix4(hg),!(i.boundingBox!==null&&is.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,is)))}_computeIntersections(t,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,f=s.attributes.uv1,u=s.attributes.normal,h=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,_=h.length;v<_;v++){const m=h[v],p=a[m.materialIndex],g=Math.max(m.start,d.start),M=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let S=g,E=M;S<E;S+=3){const T=o.getX(S),C=o.getX(S+1),L=o.getX(S+2);r=ac(this,p,t,i,c,f,u,T,C,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=v,p=_;m<p;m+=3){const g=o.getX(m),M=o.getX(m+1),S=o.getX(m+2);r=ac(this,a,t,i,c,f,u,g,M,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,_=h.length;v<_;v++){const m=h[v],p=a[m.materialIndex],g=Math.max(m.start,d.start),M=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let S=g,E=M;S<E;S+=3){const T=S,C=S+1,L=S+2;r=ac(this,p,t,i,c,f,u,T,C,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=v,p=_;m<p;m+=3){const g=m,M=m+1,S=m+2;r=ac(this,a,t,i,c,f,u,g,M,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function KP(e,t,n,i,r,s,a,o){let l;if(t.side===Je?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,t.side===tr,o),l===null)return null;sc.copy(o),sc.applyMatrix4(e.matrixWorld);const c=n.ray.origin.distanceTo(sc);return c<n.near||c>n.far?null:{distance:c,point:sc.clone(),object:e}}function ac(e,t,n,i,r,s,a,o,l,c){e.getVertexPosition(o,ec),e.getVertexPosition(l,nc),e.getVertexPosition(c,ic);const f=KP(e,t,n,i,ec,nc,ic,pg);if(f){const u=new $;Rn.getBarycoord(pg,ec,nc,ic,u),r&&(f.uv=Rn.getInterpolatedAttribute(r,o,l,c,u,new oe)),s&&(f.uv1=Rn.getInterpolatedAttribute(s,o,l,c,u,new oe)),a&&(f.normal=Rn.getInterpolatedAttribute(a,o,l,c,u,new $),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new $,materialIndex:0};Rn.getNormal(ec,nc,ic,h.normal),f.face=h,f.barycoord=u}return f}class Oa extends Pi{constructor(t=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],f=[],u=[];let h=0,d=0;v("z","y","x",-1,-1,i,n,t,a,s,0),v("z","y","x",1,-1,i,n,-t,a,s,1),v("x","z","y",1,1,t,i,n,r,a,2),v("x","z","y",1,-1,t,i,-n,r,a,3),v("x","y","z",1,-1,t,n,i,r,s,4),v("x","y","z",-1,-1,t,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new bi(c,3)),this.setAttribute("normal",new bi(f,3)),this.setAttribute("uv",new bi(u,2));function v(_,m,p,g,M,S,E,T,C,L,y){const b=S/C,R=E/L,I=S/2,F=E/2,O=T/2,q=C+1,V=L+1;let z=0,K=0;const dt=new $;for(let ct=0;ct<V;ct++){const ht=ct*R-F;for(let Rt=0;Rt<q;Rt++){const It=Rt*b-I;dt[_]=It*g,dt[m]=ht*M,dt[p]=O,c.push(dt.x,dt.y,dt.z),dt[_]=0,dt[m]=0,dt[p]=T>0?1:-1,f.push(dt.x,dt.y,dt.z),u.push(Rt/C),u.push(1-ct/L),z+=1}}for(let ct=0;ct<L;ct++)for(let ht=0;ht<C;ht++){const Rt=h+ht+q*ct,It=h+ht+q*(ct+1),qt=h+(ht+1)+q*(ct+1),Kt=h+(ht+1)+q*ct;l.push(Rt,It,Kt),l.push(It,qt,Kt),K+=6}o.addGroup(d,K,y),d+=K,h+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oa(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Pa(e){const t={};for(const n in e){t[n]={};for(const i in e[n]){const r=e[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=r.clone():Array.isArray(r)?t[n][i]=r.slice():t[n][i]=r}}return t}function Xe(e){const t={};for(let n=0;n<e.length;n++){const i=Pa(e[n]);for(const r in i)t[r]=i[r]}return t}function ZP(e){const t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function fS(e){const t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const uS={clone:Pa,merge:Xe};var JP=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jP=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ei extends ul{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=JP,this.fragmentShader=jP,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Pa(t.uniforms),this.uniformsGroups=ZP(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class vm extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,n){super.updateWorldMatrix(t,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const fr=new $,mg=new oe,vg=new oe;class Cn extends vm{constructor(t=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const n=.5*this.getFilmHeight()/t;this.fov=up*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Uh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return up*2*Math.atan(Math.tan(Uh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){fr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fr.x,fr.y).multiplyScalar(-t/fr.z),fr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(fr.x,fr.y).multiplyScalar(-t/fr.z)}getViewSize(t,n){return this.getViewBounds(t,mg,vg),n.subVectors(vg,mg)}setViewOffset(t,n,i,r,s,a){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let n=t*Math.tan(Uh*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Js=-90,js=1;class hS extends cn{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Cn(Js,js,t,n);r.layers=this.layers,this.add(r);const s=new Cn(Js,js,t,n);s.layers=this.layers,this.add(s);const a=new Cn(Js,js,t,n);a.layers=this.layers,this.add(a);const o=new Cn(Js,js,t,n);o.layers=this.layers,this.add(o);const l=new Cn(Js,js,t,n);l.layers=this.layers,this.add(l);const c=new Cn(Js,js,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(t===Wn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===tl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,f]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(n,s),t.setRenderTarget(i,1,r),t.render(n,a),t.setRenderTarget(i,2,r),t.render(n,o),t.setRenderTarget(i,3,r),t.render(n,l),t.setRenderTarget(i,4,r),t.render(n,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,r),t.render(n,f),t.setRenderTarget(u,h,d),t.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class _m extends Ve{constructor(t=[],n=Rr,i,r,s,a,o,l,c,f){super(t,n,i,r,s,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gm extends $n{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new _m(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Oa(5,5,5),s=new ei({name:"CubemapFromEquirect",uniforms:Pa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Je,blending:Mi});s.uniforms.tEquirect.value=n;const a=new Ci(r,s),o=n.minFilter;return n.minFilter===Sr&&(n.minFilter=Ie),new hS(1,10,this).update(t,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,n=!0,i=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(n,i,r);t.setRenderTarget(s)}}class mo extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const QP={type:"move"};class Ac{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const n=this._hand;if(n)for(const i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=n.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const f=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=f.position.distanceTo(u.position),d=.02,v=.005;c.inputState.pinching&&h>d+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=n.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(QP)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){const i=new mo;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}}class t2 extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class dS extends Ve{constructor(t=null,n=1,i=1,r,s,a,o,l,c=Le,f=Le,u,h){super(null,a,o,l,c,f,r,s,u,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const rd=new $,e2=new $,n2=new Xt;class vr{constructor(t=new $(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,r){return this.normal.set(t,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){const r=rd.subVectors(i,n).cross(e2.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n){const i=t.delta(rd),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){const i=n||n2.getNormalMatrix(t),r=this.coplanarPoint(rd).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const rs=new Cu,i2=new oe(.5,.5),oc=new $;class xm{constructor(t=new vr,n=new vr,i=new vr,r=new vr,s=new vr,a=new vr){this.planes=[t,n,i,r,s,a]}set(t,n,i,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Wn,i=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],f=s[4],u=s[5],h=s[6],d=s[7],v=s[8],_=s[9],m=s[10],p=s[11],g=s[12],M=s[13],S=s[14],E=s[15];if(r[0].setComponents(c-a,d-f,p-v,E-g).normalize(),r[1].setComponents(c+a,d+f,p+v,E+g).normalize(),r[2].setComponents(c+o,d+u,p+_,E+M).normalize(),r[3].setComponents(c-o,d-u,p-_,E-M).normalize(),i)r[4].setComponents(l,h,m,S).normalize(),r[5].setComponents(c-l,d-h,p-m,E-S).normalize();else if(r[4].setComponents(c-l,d-h,p-m,E-S).normalize(),n===Wn)r[5].setComponents(c+l,d+h,p+m,E+S).normalize();else if(n===tl)r[5].setComponents(l,h,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),rs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),rs.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(rs)}intersectsSprite(t){rs.center.set(0,0,0);const n=i2.distanceTo(t.center);return rs.radius=.7071067811865476+n,rs.applyMatrix4(t.matrixWorld),this.intersectsSphere(rs)}intersectsSphere(t){const n=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(oc.x=r.normal.x>0?t.max.x:t.min.x,oc.y=r.normal.y>0?t.max.y:t.min.y,oc.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(oc)<0)return!1}return!0}containsPoint(t){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class La extends Ve{constructor(t,n,i=ti,r,s,a,o=Le,l=Le,c,f=wi,u=1){if(f!==wi&&f!==Mr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:n,depth:u};super(h,r,s,a,o,l,f,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Au(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const n=super.toJSON(t);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class pS extends La{constructor(t,n=ti,i=Rr,r,s,a=Le,o=Le,l,c=wi){const f={width:t,height:t,depth:1},u=[f,f,f,f,f,f];super(t,t,n,i,r,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class ym extends Ve{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class hl extends Pi{constructor(t=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:r};const s=t/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,f=l+1,u=t/o,h=n/l,d=[],v=[],_=[],m=[];for(let p=0;p<f;p++){const g=p*h-a;for(let M=0;M<c;M++){const S=M*u-s;v.push(S,-g,0),_.push(0,0,1),m.push(M/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let g=0;g<o;g++){const M=g+c*p,S=g+c*(p+1),E=g+1+c*(p+1),T=g+1+c*p;d.push(M,S,T),d.push(S,E,T)}this.setIndex(d),this.setAttribute("position",new bi(v,3)),this.setAttribute("normal",new bi(_,3)),this.setAttribute("uv",new bi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hl(t.width,t.height,t.widthSegments,t.heightSegments)}}class mS extends ei{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class vS extends ul{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$y,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _S extends ul{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Sm extends vm{constructor(t=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class gS extends Cn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function _g(e,t,n,i){const r=r2(i);switch(n){case lm:return e*t;case fm:return e*t/r.components*r.byteLength;case Mu:return e*t/r.components*r.byteLength;case Cs:return e*t*2/r.components*r.byteLength;case bu:return e*t*2/r.components*r.byteLength;case cm:return e*t*3/r.components*r.byteLength;case Ln:return e*t*4/r.components*r.byteLength;case Tu:return e*t*4/r.components*r.byteLength;case Lo:case Do:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Io:case No:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case _f:case xf:return Math.max(e,16)*Math.max(t,8)/4;case vf:case gf:return Math.max(e,8)*Math.max(t,8)/2;case yf:case Sf:case bf:case Tf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Mf:case Ef:case wf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Af:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Cf:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Rf:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Pf:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Lf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Df:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case If:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Nf:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ff:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Uf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Of:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Bf:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Hf:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case zf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Vf:case Gf:case kf:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Wf:case Xf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case qf:case Yf:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function r2(e){switch(e){case _n:case rm:return{byteLength:1,components:1};case Aa:case sm:case Ei:return{byteLength:2,components:1};case yu:case Su:return{byteLength:2,components:4};case ti:case xu:case kn:return{byteLength:4,components:1};case am:case om:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gu}}));typeof window!="undefined"&&(window.__THREE__?Vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gu);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function xS(){let e=null,t=!1,n=null,i=null;function r(s,a){n(s,a),i=e.requestAnimationFrame(r)}return{start:function(){t!==!0&&n!==null&&(i=e.requestAnimationFrame(r),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){n=s},setContext:function(s){e=s}}}function s2(e){const t=new WeakMap;function n(o,l){const c=o.array,f=o.usage,u=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,f),o.onUploadCallback();let d;if(c instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)d=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=e.SHORT;else if(c instanceof Uint32Array)d=e.UNSIGNED_INT;else if(c instanceof Int32Array)d=e.INT;else if(c instanceof Int8Array)d=e.BYTE;else if(c instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const f=l.array,u=l.updateRanges;if(e.bindBuffer(c,o),u.length===0)e.bufferSubData(c,0,f);else{u.sort((d,v)=>d.start-v.start);let h=0;for(let d=1;d<u.length;d++){const v=u[h],_=u[d];_.start<=v.start+v.count+1?v.count=Math.max(v.count,_.start+_.count-v.start):(++h,u[h]=_)}u.length=h+1;for(let d=0,v=u.length;d<v;d++){const _=u[d];e.bufferSubData(c,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=t.get(o);(!f||f.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var a2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,o2=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,l2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,c2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,f2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,u2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,h2=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,d2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p2=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,m2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,v2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,g2=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,x2=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,y2=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,S2=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,M2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,b2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,T2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,E2=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,w2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,A2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,C2=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,R2=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,P2=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,L2=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,D2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,I2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,N2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,F2=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,U2="gl_FragColor = linearToOutputTexel( gl_FragColor );",O2=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,B2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,H2=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,z2=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,V2=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,G2=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,k2=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W2=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X2=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q2=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y2=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,K2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Z2=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,J2=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,j2=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Q2=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tL=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eL=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nL=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,iL=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rL=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sL=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,aL=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,oL=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lL=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cL=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fL=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uL=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hL=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dL=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pL=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mL=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vL=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_L=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gL=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xL=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yL=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,SL=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ML=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bL=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,TL=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,EL=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wL=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,AL=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,CL=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,RL=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,PL=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,LL=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,DL=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,IL=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,NL=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,FL=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,UL=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,OL=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,BL=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,HL=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zL=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,VL=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,GL=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kL=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,WL=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,XL=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qL=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,YL=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$L=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,KL=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ZL=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,JL=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jL=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,QL=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tD=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,eD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,iD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,rD=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sD=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,aD=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lD=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fD=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uD=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,hD=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,dD=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,pD=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,mD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vD=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_D=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gD=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xD=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yD=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,SD=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,MD=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bD=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,TD=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ED=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,wD=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,AD=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CD=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RD=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,PD=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LD=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DD=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ID=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ND=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,FD=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UD=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,OD=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,BD=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:a2,alphahash_pars_fragment:o2,alphamap_fragment:l2,alphamap_pars_fragment:c2,alphatest_fragment:f2,alphatest_pars_fragment:u2,aomap_fragment:h2,aomap_pars_fragment:d2,batching_pars_vertex:p2,batching_vertex:m2,begin_vertex:v2,beginnormal_vertex:_2,bsdfs:g2,iridescence_fragment:x2,bumpmap_pars_fragment:y2,clipping_planes_fragment:S2,clipping_planes_pars_fragment:M2,clipping_planes_pars_vertex:b2,clipping_planes_vertex:T2,color_fragment:E2,color_pars_fragment:w2,color_pars_vertex:A2,color_vertex:C2,common:R2,cube_uv_reflection_fragment:P2,defaultnormal_vertex:L2,displacementmap_pars_vertex:D2,displacementmap_vertex:I2,emissivemap_fragment:N2,emissivemap_pars_fragment:F2,colorspace_fragment:U2,colorspace_pars_fragment:O2,envmap_fragment:B2,envmap_common_pars_fragment:H2,envmap_pars_fragment:z2,envmap_pars_vertex:V2,envmap_physical_pars_fragment:j2,envmap_vertex:G2,fog_vertex:k2,fog_pars_vertex:W2,fog_fragment:X2,fog_pars_fragment:q2,gradientmap_pars_fragment:Y2,lightmap_pars_fragment:$2,lights_lambert_fragment:K2,lights_lambert_pars_fragment:Z2,lights_pars_begin:J2,lights_toon_fragment:Q2,lights_toon_pars_fragment:tL,lights_phong_fragment:eL,lights_phong_pars_fragment:nL,lights_physical_fragment:iL,lights_physical_pars_fragment:rL,lights_fragment_begin:sL,lights_fragment_maps:aL,lights_fragment_end:oL,logdepthbuf_fragment:lL,logdepthbuf_pars_fragment:cL,logdepthbuf_pars_vertex:fL,logdepthbuf_vertex:uL,map_fragment:hL,map_pars_fragment:dL,map_particle_fragment:pL,map_particle_pars_fragment:mL,metalnessmap_fragment:vL,metalnessmap_pars_fragment:_L,morphinstance_vertex:gL,morphcolor_vertex:xL,morphnormal_vertex:yL,morphtarget_pars_vertex:SL,morphtarget_vertex:ML,normal_fragment_begin:bL,normal_fragment_maps:TL,normal_pars_fragment:EL,normal_pars_vertex:wL,normal_vertex:AL,normalmap_pars_fragment:CL,clearcoat_normal_fragment_begin:RL,clearcoat_normal_fragment_maps:PL,clearcoat_pars_fragment:LL,iridescence_pars_fragment:DL,opaque_fragment:IL,packing:NL,premultiplied_alpha_fragment:FL,project_vertex:UL,dithering_fragment:OL,dithering_pars_fragment:BL,roughnessmap_fragment:HL,roughnessmap_pars_fragment:zL,shadowmap_pars_fragment:VL,shadowmap_pars_vertex:GL,shadowmap_vertex:kL,shadowmask_pars_fragment:WL,skinbase_vertex:XL,skinning_pars_vertex:qL,skinning_vertex:YL,skinnormal_vertex:$L,specularmap_fragment:KL,specularmap_pars_fragment:ZL,tonemapping_fragment:JL,tonemapping_pars_fragment:jL,transmission_fragment:QL,transmission_pars_fragment:tD,uv_pars_fragment:eD,uv_pars_vertex:nD,uv_vertex:iD,worldpos_vertex:rD,background_vert:sD,background_frag:aD,backgroundCube_vert:oD,backgroundCube_frag:lD,cube_vert:cD,cube_frag:fD,depth_vert:uD,depth_frag:hD,distance_vert:dD,distance_frag:pD,equirect_vert:mD,equirect_frag:vD,linedashed_vert:_D,linedashed_frag:gD,meshbasic_vert:xD,meshbasic_frag:yD,meshlambert_vert:SD,meshlambert_frag:MD,meshmatcap_vert:bD,meshmatcap_frag:TD,meshnormal_vert:ED,meshnormal_frag:wD,meshphong_vert:AD,meshphong_frag:CD,meshphysical_vert:RD,meshphysical_frag:PD,meshtoon_vert:LD,meshtoon_frag:DD,points_vert:ID,points_frag:ND,shadow_vert:FD,shadow_frag:UD,sprite_vert:OD,sprite_frag:BD},St={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},Vn={basic:{uniforms:Xe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Xe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ae(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Xe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Xe([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Xe([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new ae(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Xe([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Xe([St.points,St.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Xe([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Xe([St.common,St.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Xe([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Xe([St.sprite,St.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distance:{uniforms:Xe([St.common,St.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distance_vert,fragmentShader:Yt.distance_frag},shadow:{uniforms:Xe([St.lights,St.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Vn.physical={uniforms:Xe([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const lc={r:0,b:0,g:0},ss=new Ai,HD=new Te;function zD(e,t,n,i,r,s,a){const o=new ae(0);let l=s===!0?0:1,c,f,u=null,h=0,d=null;function v(M){let S=M.isScene===!0?M.background:null;return S&&S.isTexture&&(S=(M.backgroundBlurriness>0?n:t).get(S)),S}function _(M){let S=!1;const E=v(M);E===null?p(o,l):E&&E.isColor&&(p(E,1),S=!0);const T=e.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(e.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(M,S){const E=v(S);E&&(E.isCubeTexture||E.mapping===cl)?(f===void 0&&(f=new Ci(new Oa(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:Pa(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(T,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),ss.copy(S.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),f.material.uniforms.envMap.value=E,f.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(HD.makeRotationFromEuler(ss)),f.material.toneMapped=Jt.getTransfer(E.colorSpace)!==ne,(u!==E||h!==E.version||d!==e.toneMapping)&&(f.material.needsUpdate=!0,u=E,h=E.version,d=e.toneMapping),f.layers.enableAll(),M.unshift(f,f.geometry,f.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new Ci(new hl(2,2),new ei({name:"BackgroundMaterial",uniforms:Pa(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:tr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Jt.getTransfer(E.colorSpace)!==ne,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||h!==E.version||d!==e.toneMapping)&&(c.material.needsUpdate=!0,u=E,h=E.version,d=e.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,S){M.getRGB(lc,fS(e)),i.buffers.color.setClear(lc.r,lc.g,lc.b,S,a)}function g(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,S=1){o.set(M),l=S,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,p(o,l)},render:_,addToRenderList:m,dispose:g}}function VD(e,t){const n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(b,R,I,F,O){let q=!1;const V=u(F,I,R);s!==V&&(s=V,c(s.object)),q=d(b,F,I,O),q&&v(b,F,I,O),O!==null&&t.update(O,e.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,S(b,R,I,F),O!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return e.createVertexArray()}function c(b){return e.bindVertexArray(b)}function f(b){return e.deleteVertexArray(b)}function u(b,R,I){const F=I.wireframe===!0;let O=i[b.id];O===void 0&&(O={},i[b.id]=O);let q=O[R.id];q===void 0&&(q={},O[R.id]=q);let V=q[F];return V===void 0&&(V=h(l()),q[F]=V),V}function h(b){const R=[],I=[],F=[];for(let O=0;O<n;O++)R[O]=0,I[O]=0,F[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:F,object:b,attributes:{},index:null}}function d(b,R,I,F){const O=s.attributes,q=R.attributes;let V=0;const z=I.getAttributes();for(const K in z)if(z[K].location>=0){const ct=O[K];let ht=q[K];if(ht===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(ht=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(ht=b.instanceColor)),ct===void 0||ct.attribute!==ht||ht&&ct.data!==ht.data)return!0;V++}return s.attributesNum!==V||s.index!==F}function v(b,R,I,F){const O={},q=R.attributes;let V=0;const z=I.getAttributes();for(const K in z)if(z[K].location>=0){let ct=q[K];ct===void 0&&(K==="instanceMatrix"&&b.instanceMatrix&&(ct=b.instanceMatrix),K==="instanceColor"&&b.instanceColor&&(ct=b.instanceColor));const ht={};ht.attribute=ct,ct&&ct.data&&(ht.data=ct.data),O[K]=ht,V++}s.attributes=O,s.attributesNum=V,s.index=F}function _(){const b=s.newAttributes;for(let R=0,I=b.length;R<I;R++)b[R]=0}function m(b){p(b,0)}function p(b,R){const I=s.newAttributes,F=s.enabledAttributes,O=s.attributeDivisors;I[b]=1,F[b]===0&&(e.enableVertexAttribArray(b),F[b]=1),O[b]!==R&&(e.vertexAttribDivisor(b,R),O[b]=R)}function g(){const b=s.newAttributes,R=s.enabledAttributes;for(let I=0,F=R.length;I<F;I++)R[I]!==b[I]&&(e.disableVertexAttribArray(I),R[I]=0)}function M(b,R,I,F,O,q,V){V===!0?e.vertexAttribIPointer(b,R,I,O,q):e.vertexAttribPointer(b,R,I,F,O,q)}function S(b,R,I,F){_();const O=F.attributes,q=I.getAttributes(),V=R.defaultAttributeValues;for(const z in q){const K=q[z];if(K.location>=0){let dt=O[z];if(dt===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(dt=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(dt=b.instanceColor)),dt!==void 0){const ct=dt.normalized,ht=dt.itemSize,Rt=t.get(dt);if(Rt===void 0)continue;const It=Rt.buffer,qt=Rt.type,Kt=Rt.bytesPerElement,Q=qt===e.INT||qt===e.UNSIGNED_INT||dt.gpuType===xu;if(dt.isInterleavedBufferAttribute){const it=dt.data,Mt=it.stride,Ut=dt.offset;if(it.isInstancedInterleavedBuffer){for(let mt=0;mt<K.locationSize;mt++)p(K.location+mt,it.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let mt=0;mt<K.locationSize;mt++)m(K.location+mt);e.bindBuffer(e.ARRAY_BUFFER,It);for(let mt=0;mt<K.locationSize;mt++)M(K.location+mt,ht/K.locationSize,qt,ct,Mt*Kt,(Ut+ht/K.locationSize*mt)*Kt,Q)}else{if(dt.isInstancedBufferAttribute){for(let it=0;it<K.locationSize;it++)p(K.location+it,dt.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let it=0;it<K.locationSize;it++)m(K.location+it);e.bindBuffer(e.ARRAY_BUFFER,It);for(let it=0;it<K.locationSize;it++)M(K.location+it,ht/K.locationSize,qt,ct,ht*Kt,ht/K.locationSize*it*Kt,Q)}}else if(V!==void 0){const ct=V[z];if(ct!==void 0)switch(ct.length){case 2:e.vertexAttrib2fv(K.location,ct);break;case 3:e.vertexAttrib3fv(K.location,ct);break;case 4:e.vertexAttrib4fv(K.location,ct);break;default:e.vertexAttrib1fv(K.location,ct)}}}}g()}function E(){L();for(const b in i){const R=i[b];for(const I in R){const F=R[I];for(const O in F)f(F[O].object),delete F[O];delete R[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const I in R){const F=R[I];for(const O in F)f(F[O].object),delete F[O];delete R[I]}delete i[b.id]}function C(b){for(const R in i){const I=i[R];if(I[b.id]===void 0)continue;const F=I[b.id];for(const O in F)f(F[O].object),delete F[O];delete I[b.id]}}function L(){y(),a=!0,s!==r&&(s=r,c(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:L,resetDefaultState:y,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:g}}function GD(e,t,n){let i;function r(c){i=c}function s(c,f){e.drawArrays(i,c,f),n.update(f,i,1)}function a(c,f,u){u!==0&&(e.drawArraysInstanced(i,c,f,u),n.update(f,i,u))}function o(c,f,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,f,0,u);let d=0;for(let v=0;v<u;v++)d+=f[v];n.update(d,i,1)}function l(c,f,u,h){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let v=0;v<c.length;v++)a(c[v],f[v],h[v]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,f,0,h,0,u);let v=0;for(let _=0;_<u;_++)v+=f[_]*h[_];n.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function kD(e,t,n,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");r=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Ln&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const L=C===Ei&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==_n&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==kn&&!L)}function l(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const f=l(c);f!==c&&(Vt("WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const u=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),v=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),S=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),E=e.getParameter(e.MAX_SAMPLES),T=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:v,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:g,maxVaryings:M,maxFragmentUniforms:S,maxSamples:E,samples:T}}function WD(e){const t=this;let n=null,i=0,r=!1,s=!1;const a=new vr,o=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const d=u.length!==0||h||i!==0||r;return r=h,i=u.length,d},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){n=f(u,h,0)},this.setState=function(u,h,d){const v=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=e.get(u);if(!r||v===null||v.length===0||s&&!m)s?f(null):c();else{const g=s?0:i,M=g*4;let S=p.clippingState||null;l.value=S,S=f(v,h,M,d);for(let E=0;E!==M;++E)S[E]=n[E];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function f(u,h,d,v){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,v!==!0||m===null){const p=d+_*4,g=h.matrixWorldInverse;o.getNormalMatrix(g),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,S=d;M!==_;++M,S+=4)a.copy(u[M]).applyMatrix4(g,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function XD(e){let t=new WeakMap;function n(a,o){return o===hf?a.mapping=Rr:o===df&&(a.mapping=As),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===hf||o===df)if(t.has(a)){const l=t.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new gm(l.height);return c.fromEquirectangularTexture(e,a),t.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const br=4,gg=[.125,.215,.35,.446,.526,.582],fs=20,qD=256,eo=new Sm,xg=new ae;let sd=null,ad=0,od=0,ld=!1;const YD=new $;class hp{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,r=100,s={}){const{size:a=256,position:o=YD}=s;sd=this._renderer.getRenderTarget(),ad=this._renderer.getActiveCubeFace(),od=this._renderer.getActiveMipmapLevel(),ld=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,r,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(sd,ad,od),this._renderer.xr.enabled=ld,t.scissorTest=!1,Qs(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Rr||t.mapping===As?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),sd=this._renderer.getRenderTarget(),ad=this._renderer.getActiveCubeFace(),od=this._renderer.getActiveMipmapLevel(),ld=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ie,minFilter:Ie,generateMipmaps:!1,type:Ei,format:Ln,colorSpace:Rs,depthBuffer:!1},r=yg(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yg(t,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=$D(s)),this._blurMaterial=ZD(s,t,n),this._ggxMaterial=KD(s,t,n)}return r}_compileMaterial(t){const n=new Ci(new Pi,t);this._renderer.compile(n,eo)}_sceneToCubeUV(t,n,i,r,s){const l=new Cn(90,1,n,i),c=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(xg),u.toneMapping=Yn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ci(new Oa,new dm({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const g=t.background;g?g.isColor&&(m.color.copy(g),t.background=null,p=!0):(m.color.copy(xg),p=!0);for(let M=0;M<6;M++){const S=M%3;S===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+f[M],s.y,s.z)):S===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+f[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+f[M]));const E=this._cubeSize;Qs(r,S*E,M>2?E:0,E,E),u.setRenderTarget(r),p&&u.render(_,l),u.render(t,l)}u.toneMapping=d,u.autoClear=h,t.background=g}_textureToCubeUV(t,n){const i=this._renderer,r=t.mapping===Rr||t.mapping===As;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mg()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sg());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;Qs(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,eo)}_applyPMREM(t){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(t,s-1,s);n.autoClear=i}_applyGGXFilter(t,n,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),f=n/(this._lodMeshes.length-1),u=Math.sqrt(c*c-f*f),h=0+c*1.25,d=u*h,{_lodMax:v}=this,_=this._sizeLods[i],m=3*_*(i>v-br?i-v+br:0),p=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=v-n,Qs(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(o,eo),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=v-i,Qs(t,m,p,3*_,2*_),r.setRenderTarget(t),r.render(o,eo)}_blur(t,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,n,i,r,"latitudinal",s),this._halfBlur(a,t,i,i,r,"longitudinal",s)}_halfBlur(t,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&jt("blur direction must be either latitudinal or longitudinal!");const f=3,u=this._lodMeshes[r];u.material=c;const h=c.uniforms,d=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*fs-1),_=s/v,m=isFinite(s)?1+Math.floor(f*_):fs;m>fs&&Vt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fs}`);const p=[];let g=0;for(let C=0;C<fs;++C){const L=C/_,y=Math.exp(-L*L/2);p.push(y),C===0?g+=y:C<m&&(g+=2*y)}for(let C=0;C<p.length;C++)p[C]=p[C]/g;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:M}=this;h.dTheta.value=v,h.mipInt.value=M-i;const S=this._sizeLods[r],E=3*S*(r>M-br?r-M+br:0),T=4*(this._cubeSize-S);Qs(n,E,T,3*S,2*S),l.setRenderTarget(n),l.render(u,eo)}}function $D(e){const t=[],n=[],i=[];let r=e;const s=e-br+1+gg.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>e-br?l=gg[a-e+br-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),f=-c,u=1+c,h=[f,f,u,f,u,u,f,f,u,u,f,u],d=6,v=6,_=3,m=2,p=1,g=new Float32Array(_*v*d),M=new Float32Array(m*v*d),S=new Float32Array(p*v*d);for(let T=0;T<d;T++){const C=T%3*2/3-1,L=T>2?0:-1,y=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];g.set(y,_*v*T),M.set(h,m*v*T);const b=[T,T,T,T,T,T];S.set(b,p*v*T)}const E=new Pi;E.setAttribute("position",new Kn(g,_)),E.setAttribute("uv",new Kn(M,m)),E.setAttribute("faceIndex",new Kn(S,p)),i.push(new Ci(E,null)),r>br&&r--}return{lodMeshes:i,sizeLods:t,sigmas:n}}function yg(e,t,n){const i=new $n(e,t,n);return i.texture.mapping=cl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qs(e,t,n,i,r){e.viewport.set(t,n,i,r),e.scissor.set(t,n,i,r)}function KD(e,t,n){return new ei({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:qD,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ru(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function ZD(e,t,n){const i=new Float32Array(fs),r=new $(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:fs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Sg(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Mg(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Ru(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function JD(e){let t=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===hf||l===df,f=l===Rr||l===As;if(c||f){let u=t.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new hp(e)),u=c?n.fromEquirectangular(o,u):n.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||f&&d&&r(d)?(n===null&&(n=new hp(e)),u=c?n.fromEquirectangular(o):n.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let l=0;const c=6;for(let f=0;f<c;f++)o[f]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function jD(e){const t={};function n(i){if(t[i]!==void 0)return t[i];const r=e.getExtension(i);return t[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Ra("WebGLRenderer: "+i+" extension not supported."),r}}}function QD(e,t,n,i){const r={},s=new WeakMap;function a(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const v in h.attributes)t.remove(h.attributes[v]);h.removeEventListener("dispose",a),delete r[h.id];const d=s.get(h);d&&(t.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(u,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(u){const h=u.attributes;for(const d in h)t.update(h[d],e.ARRAY_BUFFER)}function c(u){const h=[],d=u.index,v=u.attributes.position;let _=0;if(d!==null){const g=d.array;_=d.version;for(let M=0,S=g.length;M<S;M+=3){const E=g[M+0],T=g[M+1],C=g[M+2];h.push(E,T,T,C,C,E)}}else if(v!==void 0){const g=v.array;_=v.version;for(let M=0,S=g.length/3-1;M<S;M+=3){const E=M+0,T=M+1,C=M+2;h.push(E,T,T,C,C,E)}}else return;const m=new(iS(h)?mm:pm)(h,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function f(u){const h=s.get(u);if(h){const d=u.index;d!==null&&h.version<d.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:f}}function t3(e,t,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,d){e.drawElements(i,d,s,h*a),n.update(d,i,1)}function c(h,d,v){v!==0&&(e.drawElementsInstanced(i,d,s,h*a,v),n.update(d,i,v))}function f(h,d,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,v);let m=0;for(let p=0;p<v;p++)m+=d[p];n.update(m,i,1)}function u(h,d,v,_){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/a,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,s,h,0,_,0,v);let p=0;for(let g=0;g<v;g++)p+=d[g]*_[g];n.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f,this.renderMultiDrawInstances=u}function e3(e){const t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(s/3);break;case e.LINES:n.lines+=o*(s/2);break;case e.LINE_STRIP:n.lines+=o*(s-1);break;case e.LINE_LOOP:n.lines+=o*s;break;case e.POINTS:n.points+=o*s;break;default:jt("WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:r,update:i}}function n3(e,t,n){const i=new WeakMap,r=new Se;function s(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let y=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",y)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],g=o.morphAttributes.color||[];let M=0;d===!0&&(M=1),v===!0&&(M=2),_===!0&&(M=3);let S=o.attributes.position.count*M,E=1;S>t.maxTextureSize&&(E=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const T=new Float32Array(S*E*4*u),C=new um(T,S,E,u);C.type=kn,C.needsUpdate=!0;const L=M*4;for(let b=0;b<u;b++){const R=m[b],I=p[b],F=g[b],O=S*E*4*b;for(let q=0;q<R.count;q++){const V=q*L;d===!0&&(r.fromBufferAttribute(R,q),T[O+V+0]=r.x,T[O+V+1]=r.y,T[O+V+2]=r.z,T[O+V+3]=0),v===!0&&(r.fromBufferAttribute(I,q),T[O+V+4]=r.x,T[O+V+5]=r.y,T[O+V+6]=r.z,T[O+V+7]=0),_===!0&&(r.fromBufferAttribute(F,q),T[O+V+8]=r.x,T[O+V+9]=r.y,T[O+V+10]=r.z,T[O+V+11]=F.itemSize===4?r.w:1)}}h={count:u,texture:C,size:new oe(S,E)},i.set(o,h),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const v=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",v),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:s}}function i3(e,t,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,f=l.geometry,u=t.get(l,f);if(r.get(u)!==c&&(t.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,e.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,e.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return u}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}const r3={[Zp]:"LINEAR_TONE_MAPPING",[Jp]:"REINHARD_TONE_MAPPING",[jp]:"CINEON_TONE_MAPPING",[Qp]:"ACES_FILMIC_TONE_MAPPING",[em]:"AGX_TONE_MAPPING",[nm]:"NEUTRAL_TONE_MAPPING",[tm]:"CUSTOM_TONE_MAPPING"};function s3(e,t,n,i,r){const s=new $n(t,n,{type:e,depthBuffer:i,stencilBuffer:r}),a=new $n(t,n,{type:Ei,depthBuffer:!1,stencilBuffer:!1}),o=new Pi;o.setAttribute("position",new bi([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new bi([0,2,0,0,2,0],2));const l=new mS({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Ci(o,l),f=new Sm(-1,1,1,-1,0,1);let u=null,h=null,d=!1,v,_=null,m=[],p=!1;this.setSize=function(g,M){s.setSize(g,M),a.setSize(g,M);for(let S=0;S<m.length;S++){const E=m[S];E.setSize&&E.setSize(g,M)}},this.setEffects=function(g){m=g,p=m.length>0&&m[0].isRenderPass===!0;const M=s.width,S=s.height;for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(M,S)}},this.begin=function(g,M){if(d||g.toneMapping===Yn&&m.length===0)return!1;if(_=M,M!==null){const S=M.width,E=M.height;(s.width!==S||s.height!==E)&&this.setSize(S,E)}return p===!1&&g.setRenderTarget(s),v=g.toneMapping,g.toneMapping=Yn,!0},this.hasRenderPass=function(){return p},this.end=function(g,M){g.toneMapping=v,d=!0;let S=s,E=a;for(let T=0;T<m.length;T++){const C=m[T];if(C.enabled!==!1&&(C.render(g,E,S,M),C.needsSwap!==!1)){const L=S;S=E,E=L}}if(u!==g.outputColorSpace||h!==g.toneMapping){u=g.outputColorSpace,h=g.toneMapping,l.defines={},Jt.getTransfer(u)===ne&&(l.defines.SRGB_TRANSFER="");const T=r3[h];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,g.setRenderTarget(_),g.render(c,f),_=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),l.dispose()}}const yS=new Ve,dp=new La(1,1),SS=new um,MS=new oS,bS=new _m,bg=[],Tg=[],Eg=new Float32Array(16),wg=new Float32Array(9),Ag=new Float32Array(4);function Ba(e,t,n){const i=e[0];if(i<=0||i>0)return e;const r=t*n;let s=bg[r];if(s===void 0&&(s=new Float32Array(r),bg[r]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(s,o)}return s}function Ae(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function Ce(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Pu(e,t){let n=Tg[t];n===void 0&&(n=new Int32Array(t),Tg[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function a3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function o3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ae(n,t))return;e.uniform2fv(this.addr,t),Ce(n,t)}}function l3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ae(n,t))return;e.uniform3fv(this.addr,t),Ce(n,t)}}function c3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ae(n,t))return;e.uniform4fv(this.addr,t),Ce(n,t)}}function f3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ae(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ce(n,t)}else{if(Ae(n,i))return;Ag.set(i),e.uniformMatrix2fv(this.addr,!1,Ag),Ce(n,i)}}function u3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ae(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ce(n,t)}else{if(Ae(n,i))return;wg.set(i),e.uniformMatrix3fv(this.addr,!1,wg),Ce(n,i)}}function h3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ae(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ce(n,t)}else{if(Ae(n,i))return;Eg.set(i),e.uniformMatrix4fv(this.addr,!1,Eg),Ce(n,i)}}function d3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function p3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ae(n,t))return;e.uniform2iv(this.addr,t),Ce(n,t)}}function m3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ae(n,t))return;e.uniform3iv(this.addr,t),Ce(n,t)}}function v3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ae(n,t))return;e.uniform4iv(this.addr,t),Ce(n,t)}}function _3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function g3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ae(n,t))return;e.uniform2uiv(this.addr,t),Ce(n,t)}}function x3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ae(n,t))return;e.uniform3uiv(this.addr,t),Ce(n,t)}}function y3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ae(n,t))return;e.uniform4uiv(this.addr,t),Ce(n,t)}}function S3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r);let s;this.type===e.SAMPLER_2D_SHADOW?(dp.compareFunction=n.isReversedDepthBuffer()?wu:Eu,s=dp):s=yS,n.setTexture2D(t||s,r)}function M3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(t||MS,r)}function b3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(t||bS,r)}function T3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(t||SS,r)}function E3(e){switch(e){case 5126:return a3;case 35664:return o3;case 35665:return l3;case 35666:return c3;case 35674:return f3;case 35675:return u3;case 35676:return h3;case 5124:case 35670:return d3;case 35667:case 35671:return p3;case 35668:case 35672:return m3;case 35669:case 35673:return v3;case 5125:return _3;case 36294:return g3;case 36295:return x3;case 36296:return y3;case 35678:case 36198:case 36298:case 36306:case 35682:return S3;case 35679:case 36299:case 36307:return M3;case 35680:case 36300:case 36308:case 36293:return b3;case 36289:case 36303:case 36311:case 36292:return T3}}function w3(e,t){e.uniform1fv(this.addr,t)}function A3(e,t){const n=Ba(t,this.size,2);e.uniform2fv(this.addr,n)}function C3(e,t){const n=Ba(t,this.size,3);e.uniform3fv(this.addr,n)}function R3(e,t){const n=Ba(t,this.size,4);e.uniform4fv(this.addr,n)}function P3(e,t){const n=Ba(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function L3(e,t){const n=Ba(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function D3(e,t){const n=Ba(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function I3(e,t){e.uniform1iv(this.addr,t)}function N3(e,t){e.uniform2iv(this.addr,t)}function F3(e,t){e.uniform3iv(this.addr,t)}function U3(e,t){e.uniform4iv(this.addr,t)}function O3(e,t){e.uniform1uiv(this.addr,t)}function B3(e,t){e.uniform2uiv(this.addr,t)}function H3(e,t){e.uniform3uiv(this.addr,t)}function z3(e,t){e.uniform4uiv(this.addr,t)}function V3(e,t,n){const i=this.cache,r=t.length,s=Pu(n,r);Ae(i,s)||(e.uniform1iv(this.addr,s),Ce(i,s));let a;this.type===e.SAMPLER_2D_SHADOW?a=dp:a=yS;for(let o=0;o!==r;++o)n.setTexture2D(t[o]||a,s[o])}function G3(e,t,n){const i=this.cache,r=t.length,s=Pu(n,r);Ae(i,s)||(e.uniform1iv(this.addr,s),Ce(i,s));for(let a=0;a!==r;++a)n.setTexture3D(t[a]||MS,s[a])}function k3(e,t,n){const i=this.cache,r=t.length,s=Pu(n,r);Ae(i,s)||(e.uniform1iv(this.addr,s),Ce(i,s));for(let a=0;a!==r;++a)n.setTextureCube(t[a]||bS,s[a])}function W3(e,t,n){const i=this.cache,r=t.length,s=Pu(n,r);Ae(i,s)||(e.uniform1iv(this.addr,s),Ce(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(t[a]||SS,s[a])}function X3(e){switch(e){case 5126:return w3;case 35664:return A3;case 35665:return C3;case 35666:return R3;case 35674:return P3;case 35675:return L3;case 35676:return D3;case 5124:case 35670:return I3;case 35667:case 35671:return N3;case 35668:case 35672:return F3;case 35669:case 35673:return U3;case 5125:return O3;case 36294:return B3;case 36295:return H3;case 36296:return z3;case 35678:case 36198:case 36298:case 36306:case 35682:return V3;case 35679:case 36299:case 36307:return G3;case 35680:case 36300:case 36308:case 36293:return k3;case 36289:case 36303:case 36311:case 36292:return W3}}class q3{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=E3(n.type)}}class Y3{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=X3(n.type)}}class $3{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,n[o.id],i)}}}const cd=/(\w+)(\])?(\[|\.)?/g;function Cg(e,t){e.seq.push(t),e.map[t.id]=t}function K3(e,t,n){const i=e.name,r=i.length;for(cd.lastIndex=0;;){const s=cd.exec(i),a=cd.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Cg(n,c===void 0?new q3(o,e,t):new Y3(o,e,t));break}else{let u=n.map[o];u===void 0&&(u=new $3(o),Cg(n,u)),n=u}}}class Cc{constructor(t,n){this.seq=[],this.map={};const i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(n,a),l=t.getUniformLocation(n,o.name);K3(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(t,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(t,i,r)}setOptional(t,n,i){const r=n[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,n){const i=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in n&&i.push(a)}return i}}function Rg(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}const Z3=37297;let J3=0;function j3(e,t){const n=e.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Pg=new Xt;function Q3(e){Jt._getMatrix(Pg,Jt.workingColorSpace,e);const t=`mat3( ${Pg.elements.map(n=>n.toFixed(4))} )`;switch(Jt.getTransfer(e)){case Qo:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return Vt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Lg(e,t,n){const i=e.getShaderParameter(t,e.COMPILE_STATUS),s=(e.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+j3(e.getShaderSource(t),o)}else return s}function tI(e,t){const n=Q3(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const eI={[Zp]:"Linear",[Jp]:"Reinhard",[jp]:"Cineon",[Qp]:"ACESFilmic",[em]:"AgX",[nm]:"Neutral",[tm]:"Custom"};function nI(e,t){const n=eI[t];return n===void 0?(Vt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const cc=new $;function iI(){Jt.getLuminanceCoefficients(cc);const e=cc.x.toFixed(4),t=cc.y.toFixed(4),n=cc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rI(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vo).join(`
`)}function sI(e){const t=[];for(const n in e){const i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function aI(e,t){const n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=e.getActiveAttrib(t,r),a=s.name;let o=1;s.type===e.FLOAT_MAT2&&(o=2),s.type===e.FLOAT_MAT3&&(o=3),s.type===e.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function vo(e){return e!==""}function Dg(e,t){const n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ig(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const oI=/^[ \t]*#include +<([\w\d./]+)>/gm;function pp(e){return e.replace(oI,cI)}const lI=new Map;function cI(e,t){let n=Yt[t];if(n===void 0){const i=lI.get(t);if(i!==void 0)n=Yt[i],Vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return pp(n)}const fI=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ng(e){return e.replace(fI,uI)}function uI(e,t,n,i){let r="";for(let s=parseInt(t);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Fg(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const hI={[Po]:"SHADOWMAP_TYPE_PCF",[la]:"SHADOWMAP_TYPE_VSM"};function dI(e){return hI[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const pI={[Rr]:"ENVMAP_TYPE_CUBE",[As]:"ENVMAP_TYPE_CUBE",[cl]:"ENVMAP_TYPE_CUBE_UV"};function mI(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":pI[e.envMapMode]||"ENVMAP_TYPE_CUBE"}const vI={[As]:"ENVMAP_MODE_REFRACTION"};function _I(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":vI[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const gI={[Kp]:"ENVMAP_BLENDING_MULTIPLY",[Xy]:"ENVMAP_BLENDING_MIX",[qy]:"ENVMAP_BLENDING_ADD"};function xI(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":gI[e.combine]||"ENVMAP_BLENDING_NONE"}function yI(e){const t=e.envMapCubeUVHeight;if(t===null)return null;const n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function SI(e,t,n,i){const r=e.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=dI(n),c=mI(n),f=_I(n),u=xI(n),h=yI(n),d=rI(n),v=sI(s),_=r.createProgram();let m,p,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(vo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(vo).join(`
`),p.length>0&&(p+=`
`)):(m=[Fg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vo).join(`
`),p=[Fg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+f:"",n.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Yn?"#define TONE_MAPPING":"",n.toneMapping!==Yn?Yt.tonemapping_pars_fragment:"",n.toneMapping!==Yn?nI("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,tI("linearToOutputTexel",n.outputColorSpace),iI(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(vo).join(`
`)),a=pp(a),a=Dg(a,n),a=Ig(a,n),o=pp(o),o=Dg(o,n),o=Ig(o,n),a=Ng(a),o=Ng(o),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===cp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===cp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=g+m+a,S=g+p+o,E=Rg(r,r.VERTEX_SHADER,M),T=Rg(r,r.FRAGMENT_SHADER,S);r.attachShader(_,E),r.attachShader(_,T),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(R){if(e.debug.checkShaderErrors){const I=r.getProgramInfoLog(_)||"",F=r.getShaderInfoLog(E)||"",O=r.getShaderInfoLog(T)||"",q=I.trim(),V=F.trim(),z=O.trim();let K=!0,dt=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(K=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(r,_,E,T);else{const ct=Lg(r,E,"vertex"),ht=Lg(r,T,"fragment");jt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+q+`
`+ct+`
`+ht)}else q!==""?Vt("WebGLProgram: Program Info Log:",q):(V===""||z==="")&&(dt=!1);dt&&(R.diagnostics={runnable:K,programLog:q,vertexShader:{log:V,prefix:m},fragmentShader:{log:z,prefix:p}})}r.deleteShader(E),r.deleteShader(T),L=new Cc(r,_),y=aI(r,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let b=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(_,Z3)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=J3++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let MI=0;class bI{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const n=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const n=this.materialCache.get(t);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const n=this.materialCache;let i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){const n=this.shaderCache;let i=n.get(t);return i===void 0&&(i=new TI(t),n.set(t,i)),i}}class TI{constructor(t){this.id=MI++,this.code=t,this.usedTimes=0}}function EI(e,t,n,i,r,s,a){const o=new hm,l=new bI,c=new Set,f=[],u=new Map,h=r.logarithmicDepthBuffer;let d=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,b,R,I,F){const O=I.fog,q=F.geometry,V=y.isMeshStandardMaterial?I.environment:null,z=(y.isMeshStandardMaterial?n:t).get(y.envMap||V),K=z&&z.mapping===cl?z.image.height:null,dt=v[y.type];y.precision!==null&&(d=r.getMaxPrecision(y.precision),d!==y.precision&&Vt("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const ct=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ht=ct!==void 0?ct.length:0;let Rt=0;q.morphAttributes.position!==void 0&&(Rt=1),q.morphAttributes.normal!==void 0&&(Rt=2),q.morphAttributes.color!==void 0&&(Rt=3);let It,qt,Kt,Q;if(dt){const re=Vn[dt];It=re.vertexShader,qt=re.fragmentShader}else It=y.vertexShader,qt=y.fragmentShader,l.update(y),Kt=l.getVertexShaderID(y),Q=l.getFragmentShaderID(y);const it=e.getRenderTarget(),Mt=e.state.buffers.depth.getReversed(),Ut=F.isInstancedMesh===!0,mt=F.isBatchedMesh===!0,bt=!!y.map,D=!!y.matcap,U=!!z,G=!!y.aoMap,et=!!y.lightMap,J=!!y.bumpMap,nt=!!y.normalMap,P=!!y.displacementMap,ot=!!y.emissiveMap,rt=!!y.metalnessMap,tt=!!y.roughnessMap,st=y.anisotropy>0,w=y.clearcoat>0,x=y.dispersion>0,N=y.iridescence>0,X=y.sheen>0,j=y.transmission>0,W=st&&!!y.anisotropyMap,Tt=w&&!!y.clearcoatMap,ft=w&&!!y.clearcoatNormalMap,At=w&&!!y.clearcoatRoughnessMap,Nt=N&&!!y.iridescenceMap,lt=N&&!!y.iridescenceThicknessMap,_t=X&&!!y.sheenColorMap,xt=X&&!!y.sheenRoughnessMap,Ct=!!y.specularMap,vt=!!y.specularColorMap,Wt=!!y.specularIntensityMap,B=j&&!!y.transmissionMap,wt=j&&!!y.thicknessMap,pt=!!y.gradientMap,Pt=!!y.alphaMap,ut=y.alphaTest>0,at=!!y.alphaHash,gt=!!y.extensions;let Gt=Yn;y.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Gt=e.toneMapping);const pe={shaderID:dt,shaderType:y.type,shaderName:y.name,vertexShader:It,fragmentShader:qt,defines:y.defines,customVertexShaderID:Kt,customFragmentShaderID:Q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:mt,batchingColor:mt&&F._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&F.instanceColor!==null,instancingMorph:Ut&&F.morphTexture!==null,outputColorSpace:it===null?e.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Rs,alphaToCoverage:!!y.alphaToCoverage,map:bt,matcap:D,envMap:U,envMapMode:U&&z.mapping,envMapCubeUVHeight:K,aoMap:G,lightMap:et,bumpMap:J,normalMap:nt,displacementMap:P,emissiveMap:ot,normalMapObjectSpace:nt&&y.normalMapType===Zy,normalMapTangentSpace:nt&&y.normalMapType===Ky,metalnessMap:rt,roughnessMap:tt,anisotropy:st,anisotropyMap:W,clearcoat:w,clearcoatMap:Tt,clearcoatNormalMap:ft,clearcoatRoughnessMap:At,dispersion:x,iridescence:N,iridescenceMap:Nt,iridescenceThicknessMap:lt,sheen:X,sheenColorMap:_t,sheenRoughnessMap:xt,specularMap:Ct,specularColorMap:vt,specularIntensityMap:Wt,transmission:j,transmissionMap:B,thicknessMap:wt,gradientMap:pt,opaque:y.transparent===!1&&y.blending===Ms&&y.alphaToCoverage===!1,alphaMap:Pt,alphaTest:ut,alphaHash:at,combine:y.combine,mapUv:bt&&_(y.map.channel),aoMapUv:G&&_(y.aoMap.channel),lightMapUv:et&&_(y.lightMap.channel),bumpMapUv:J&&_(y.bumpMap.channel),normalMapUv:nt&&_(y.normalMap.channel),displacementMapUv:P&&_(y.displacementMap.channel),emissiveMapUv:ot&&_(y.emissiveMap.channel),metalnessMapUv:rt&&_(y.metalnessMap.channel),roughnessMapUv:tt&&_(y.roughnessMap.channel),anisotropyMapUv:W&&_(y.anisotropyMap.channel),clearcoatMapUv:Tt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:ft&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:lt&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(y.sheenRoughnessMap.channel),specularMapUv:Ct&&_(y.specularMap.channel),specularColorMapUv:vt&&_(y.specularColorMap.channel),specularIntensityMapUv:Wt&&_(y.specularIntensityMap.channel),transmissionMapUv:B&&_(y.transmissionMap.channel),thicknessMapUv:wt&&_(y.thicknessMap.channel),alphaMapUv:Pt&&_(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(nt||st),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(bt||Pt),fog:!!O,useFog:y.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Mt,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:Rt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:e.shadowMap.enabled&&R.length>0,shadowMapType:e.shadowMap.type,toneMapping:Gt,decodeVideoTexture:bt&&y.map.isVideoTexture===!0&&Jt.getTransfer(y.map.colorSpace)===ne,decodeVideoTextureEmissive:ot&&y.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(y.emissiveMap.colorSpace)===ne,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===mi,flipSided:y.side===Je,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:gt&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&y.extensions.multiDraw===!0||mt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function p(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)b.push(R),b.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(g(b,y),M(b,y),b.push(e.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function g(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function M(y,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),y.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),y.push(o.mask)}function S(y){const b=v[y.type];let R;if(b){const I=Vn[b];R=uS.clone(I.uniforms)}else R=y.uniforms;return R}function E(y,b){let R=u.get(b);return R!==void 0?++R.usedTimes:(R=new SI(e,b,y,s),f.push(R),u.set(b,R)),R}function T(y){if(--y.usedTimes===0){const b=f.indexOf(y);f[b]=f[f.length-1],f.pop(),u.delete(y.cacheKey),y.destroy()}}function C(y){l.remove(y)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:E,releaseProgram:T,releaseShaderCache:C,programs:f,dispose:L}}function wI(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);return o===void 0&&(o={},e.set(a,o)),o}function i(a){e.delete(a)}function r(a,o,l){e.get(a)[o]=l}function s(){e=new WeakMap}return{has:t,get:n,remove:i,update:r,dispose:s}}function AI(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function Ug(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Og(){const e=[];let t=0;const n=[],i=[],r=[];function s(){t=0,n.length=0,i.length=0,r.length=0}function a(u,h,d,v,_,m){let p=e[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:d,groupOrder:v,renderOrder:u.renderOrder,z:_,group:m},e[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=d,p.groupOrder=v,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,h,d,v,_,m){const p=a(u,h,d,v,_,m);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):n.push(p)}function l(u,h,d,v,_,m){const p=a(u,h,d,v,_,m);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):n.unshift(p)}function c(u,h){n.length>1&&n.sort(u||AI),i.length>1&&i.sort(h||Ug),r.length>1&&r.sort(h||Ug)}function f(){for(let u=t,h=e.length;u<h;u++){const d=e[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:f,sort:c}}function CI(){let e=new WeakMap;function t(i,r){const s=e.get(i);let a;return s===void 0?(a=new Og,e.set(i,[a])):r>=s.length?(a=new Og,s.push(a)):a=s[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function RI(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={direction:new $,color:new ae};break;case"SpotLight":n={position:new $,direction:new $,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new $,color:new ae,distance:0,decay:0};break;case"HemisphereLight":n={direction:new $,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":n={color:new ae,position:new $,halfWidth:new $,halfHeight:new $};break}return e[t.id]=n,n}}}function PI(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}let LI=0;function DI(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function II(e){const t=new RI,n=PI(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new $);const r=new $,s=new Te,a=new Te;function o(c){let f=0,u=0,h=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let d=0,v=0,_=0,m=0,p=0,g=0,M=0,S=0,E=0,T=0,C=0;c.sort(DI);for(let y=0,b=c.length;y<b;y++){const R=c[y],I=R.color,F=R.intensity,O=R.distance;let q=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Cs?q=R.shadow.map.texture:q=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)f+=I.r*F,u+=I.g*F,h+=I.b*F;else if(R.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(R.sh.coefficients[V],F);C++}else if(R.isDirectionalLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const z=R.shadow,K=n.get(R);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,i.directionalShadow[d]=K,i.directionalShadowMap[d]=q,i.directionalShadowMatrix[d]=R.shadow.matrix,g++}i.directional[d]=V,d++}else if(R.isSpotLight){const V=t.get(R);V.position.setFromMatrixPosition(R.matrixWorld),V.color.copy(I).multiplyScalar(F),V.distance=O,V.coneCos=Math.cos(R.angle),V.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),V.decay=R.decay,i.spot[_]=V;const z=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,z.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[_]=z.matrix,R.castShadow){const K=n.get(R);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,i.spotShadow[_]=K,i.spotShadowMap[_]=q,S++}_++}else if(R.isRectAreaLight){const V=t.get(R);V.color.copy(I).multiplyScalar(F),V.halfWidth.set(R.width*.5,0,0),V.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=V,m++}else if(R.isPointLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),V.distance=R.distance,V.decay=R.decay,R.castShadow){const z=R.shadow,K=n.get(R);K.shadowIntensity=z.intensity,K.shadowBias=z.bias,K.shadowNormalBias=z.normalBias,K.shadowRadius=z.radius,K.shadowMapSize=z.mapSize,K.shadowCameraNear=z.camera.near,K.shadowCameraFar=z.camera.far,i.pointShadow[v]=K,i.pointShadowMap[v]=q,i.pointShadowMatrix[v]=R.shadow.matrix,M++}i.point[v]=V,v++}else if(R.isHemisphereLight){const V=t.get(R);V.skyColor.copy(R.color).multiplyScalar(F),V.groundColor.copy(R.groundColor).multiplyScalar(F),i.hemi[p]=V,p++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=St.LTC_FLOAT_1,i.rectAreaLTC2=St.LTC_FLOAT_2):(i.rectAreaLTC1=St.LTC_HALF_1,i.rectAreaLTC2=St.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=u,i.ambient[2]=h;const L=i.hash;(L.directionalLength!==d||L.pointLength!==v||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==p||L.numDirectionalShadows!==g||L.numPointShadows!==M||L.numSpotShadows!==S||L.numSpotMaps!==E||L.numLightProbes!==C)&&(i.directional.length=d,i.spot.length=_,i.rectArea.length=m,i.point.length=v,i.hemi.length=p,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=S+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,L.directionalLength=d,L.pointLength=v,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=p,L.numDirectionalShadows=g,L.numPointShadows=M,L.numSpotShadows=S,L.numSpotMaps=E,L.numLightProbes=C,i.version=LI++)}function l(c,f){let u=0,h=0,d=0,v=0,_=0;const m=f.matrixWorldInverse;for(let p=0,g=c.length;p<g;p++){const M=c[p];if(M.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),u++}else if(M.isSpotLight){const S=i.spot[d];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(M.isRectAreaLight){const S=i.rectArea[v];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(m),a.identity(),s.copy(M.matrixWorld),s.premultiply(m),a.extractRotation(s),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(m),h++}else if(M.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function Bg(e){const t=new II(e),n=[],i=[];function r(f){c.camera=f,n.length=0,i.length=0}function s(f){n.push(f)}function a(f){i.push(f)}function o(){t.setup(n)}function l(f){t.setupView(n,f)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function NI(e){let t=new WeakMap;function n(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Bg(e),t.set(r,[o])):s>=a.length?(o=new Bg(e),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:n,dispose:i}}const FI=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,UI=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,OI=[new $(1,0,0),new $(-1,0,0),new $(0,1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1)],BI=[new $(0,-1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1),new $(0,-1,0),new $(0,-1,0)],Hg=new Te,no=new $,fd=new $;function HI(e,t,n){let i=new xm;const r=new oe,s=new oe,a=new Se,o=new vS,l=new _S,c={},f=n.maxTextureSize,u={[tr]:Je,[Je]:tr,[mi]:mi},h=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:FI,fragmentShader:UI}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const v=new Pi;v.setAttribute("position",new Kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ci(v,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Po;let p=this.type;this.render=function(T,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;T.type===wy&&(Vt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),T.type=Po);const y=e.getRenderTarget(),b=e.getActiveCubeFace(),R=e.getActiveMipmapLevel(),I=e.state;I.setBlending(Mi),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const F=p!==this.type;F&&C.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(q=>q.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,q=T.length;O<q;O++){const V=T[O],z=V.shadow;if(z===void 0){Vt("WebGLShadowMap:",V,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const K=z.getFrameExtents();if(r.multiply(K),s.copy(z.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/K.x),r.x=s.x*K.x,z.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/K.y),r.y=s.y*K.y,z.mapSize.y=s.y)),z.map===null||F===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===la){if(V.isPointLight){Vt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new $n(r.x,r.y,{format:Cs,type:Ei,minFilter:Ie,magFilter:Ie,generateMipmaps:!1}),z.map.texture.name=V.name+".shadowMap",z.map.depthTexture=new La(r.x,r.y,kn),z.map.depthTexture.name=V.name+".shadowMapDepth",z.map.depthTexture.format=wi,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Le,z.map.depthTexture.magFilter=Le}else{V.isPointLight?(z.map=new gm(r.x),z.map.depthTexture=new pS(r.x,ti)):(z.map=new $n(r.x,r.y),z.map.depthTexture=new La(r.x,r.y,ti)),z.map.depthTexture.name=V.name+".shadowMap",z.map.depthTexture.format=wi;const ct=e.state.buffers.depth.getReversed();this.type===Po?(z.map.depthTexture.compareFunction=ct?wu:Eu,z.map.depthTexture.minFilter=Ie,z.map.depthTexture.magFilter=Ie):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=Le,z.map.depthTexture.magFilter=Le)}z.camera.updateProjectionMatrix()}const dt=z.map.isWebGLCubeRenderTarget?6:1;for(let ct=0;ct<dt;ct++){if(z.map.isWebGLCubeRenderTarget)e.setRenderTarget(z.map,ct),e.clear();else{ct===0&&(e.setRenderTarget(z.map),e.clear());const ht=z.getViewport(ct);a.set(s.x*ht.x,s.y*ht.y,s.x*ht.z,s.y*ht.w),I.viewport(a)}if(V.isPointLight){const ht=z.camera,Rt=z.matrix,It=V.distance||ht.far;It!==ht.far&&(ht.far=It,ht.updateProjectionMatrix()),no.setFromMatrixPosition(V.matrixWorld),ht.position.copy(no),fd.copy(ht.position),fd.add(OI[ct]),ht.up.copy(BI[ct]),ht.lookAt(fd),ht.updateMatrixWorld(),Rt.makeTranslation(-no.x,-no.y,-no.z),Hg.multiplyMatrices(ht.projectionMatrix,ht.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Hg,ht.coordinateSystem,ht.reversedDepth)}else z.updateMatrices(V);i=z.getFrustum(),S(C,L,z.camera,V,this.type)}z.isPointLightShadow!==!0&&this.type===la&&g(z,L),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,e.setRenderTarget(y,b,R)};function g(T,C){const L=t.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new $n(r.x,r.y,{format:Cs,type:Ei})),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,e.setRenderTarget(T.mapPass),e.clear(),e.renderBufferDirect(C,null,L,h,_,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,e.setRenderTarget(T.map),e.clear(),e.renderBufferDirect(C,null,L,d,_,null)}function M(T,C,L,y){let b=null;const R=L.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)b=R;else if(b=L.isPointLight===!0?l:o,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const I=b.uuid,F=C.uuid;let O=c[I];O===void 0&&(O={},c[I]=O);let q=O[F];q===void 0&&(q=b.clone(),O[F]=q,C.addEventListener("dispose",E)),b=q}if(b.visible=C.visible,b.wireframe=C.wireframe,y===la?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,L.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=e.properties.get(b);I.light=L}return b}function S(T,C,L,y,b){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===la)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,T.matrixWorld);const F=t.update(T),O=T.material;if(Array.isArray(O)){const q=F.groups;for(let V=0,z=q.length;V<z;V++){const K=q[V],dt=O[K.materialIndex];if(dt&&dt.visible){const ct=M(T,dt,y,b);T.onBeforeShadow(e,T,C,L,F,ct,K),e.renderBufferDirect(L,null,F,ct,T,K),T.onAfterShadow(e,T,C,L,F,ct,K)}}}else if(O.visible){const q=M(T,O,y,b);T.onBeforeShadow(e,T,C,L,F,q,null),e.renderBufferDirect(L,null,F,q,T,null),T.onAfterShadow(e,T,C,L,F,q,null)}}const I=T.children;for(let F=0,O=I.length;F<O;F++)S(I[F],C,L,y,b)}function E(T){T.target.removeEventListener("dispose",E);for(const L in c){const y=c[L],b=T.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}const zI={[sf]:af,[of]:ff,[lf]:uf,[ws]:cf,[af]:sf,[ff]:of,[uf]:lf,[cf]:ws};function VI(e,t){function n(){let B=!1;const wt=new Se;let pt=null;const Pt=new Se(0,0,0,0);return{setMask:function(ut){pt!==ut&&!B&&(e.colorMask(ut,ut,ut,ut),pt=ut)},setLocked:function(ut){B=ut},setClear:function(ut,at,gt,Gt,pe){pe===!0&&(ut*=Gt,at*=Gt,gt*=Gt),wt.set(ut,at,gt,Gt),Pt.equals(wt)===!1&&(e.clearColor(ut,at,gt,Gt),Pt.copy(wt))},reset:function(){B=!1,pt=null,Pt.set(-1,0,0,0)}}}function i(){let B=!1,wt=!1,pt=null,Pt=null,ut=null;return{setReversed:function(at){if(wt!==at){const gt=t.get("EXT_clip_control");at?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),wt=at;const Gt=ut;ut=null,this.setClear(Gt)}},getReversed:function(){return wt},setTest:function(at){at?it(e.DEPTH_TEST):Mt(e.DEPTH_TEST)},setMask:function(at){pt!==at&&!B&&(e.depthMask(at),pt=at)},setFunc:function(at){if(wt&&(at=zI[at]),Pt!==at){switch(at){case sf:e.depthFunc(e.NEVER);break;case af:e.depthFunc(e.ALWAYS);break;case of:e.depthFunc(e.LESS);break;case ws:e.depthFunc(e.LEQUAL);break;case lf:e.depthFunc(e.EQUAL);break;case cf:e.depthFunc(e.GEQUAL);break;case ff:e.depthFunc(e.GREATER);break;case uf:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}Pt=at}},setLocked:function(at){B=at},setClear:function(at){ut!==at&&(wt&&(at=1-at),e.clearDepth(at),ut=at)},reset:function(){B=!1,pt=null,Pt=null,ut=null,wt=!1}}}function r(){let B=!1,wt=null,pt=null,Pt=null,ut=null,at=null,gt=null,Gt=null,pe=null;return{setTest:function(re){B||(re?it(e.STENCIL_TEST):Mt(e.STENCIL_TEST))},setMask:function(re){wt!==re&&!B&&(e.stencilMask(re),wt=re)},setFunc:function(re,ii,Li){(pt!==re||Pt!==ii||ut!==Li)&&(e.stencilFunc(re,ii,Li),pt=re,Pt=ii,ut=Li)},setOp:function(re,ii,Li){(at!==re||gt!==ii||Gt!==Li)&&(e.stencilOp(re,ii,Li),at=re,gt=ii,Gt=Li)},setLocked:function(re){B=re},setClear:function(re){pe!==re&&(e.clearStencil(re),pe=re)},reset:function(){B=!1,wt=null,pt=null,Pt=null,ut=null,at=null,gt=null,Gt=null,pe=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let f={},u={},h=new WeakMap,d=[],v=null,_=!1,m=null,p=null,g=null,M=null,S=null,E=null,T=null,C=new ae(0,0,0),L=0,y=!1,b=null,R=null,I=null,F=null,O=null;const q=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,z=0;const K=e.getParameter(e.VERSION);K.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(K)[1]),V=z>=1):K.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),V=z>=2);let dt=null,ct={};const ht=e.getParameter(e.SCISSOR_BOX),Rt=e.getParameter(e.VIEWPORT),It=new Se().fromArray(ht),qt=new Se().fromArray(Rt);function Kt(B,wt,pt,Pt){const ut=new Uint8Array(4),at=e.createTexture();e.bindTexture(B,at),e.texParameteri(B,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(B,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let gt=0;gt<pt;gt++)B===e.TEXTURE_3D||B===e.TEXTURE_2D_ARRAY?e.texImage3D(wt,0,e.RGBA,1,1,Pt,0,e.RGBA,e.UNSIGNED_BYTE,ut):e.texImage2D(wt+gt,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ut);return at}const Q={};Q[e.TEXTURE_2D]=Kt(e.TEXTURE_2D,e.TEXTURE_2D,1),Q[e.TEXTURE_CUBE_MAP]=Kt(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[e.TEXTURE_2D_ARRAY]=Kt(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Q[e.TEXTURE_3D]=Kt(e.TEXTURE_3D,e.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(e.DEPTH_TEST),a.setFunc(ws),J(!1),nt(ip),it(e.CULL_FACE),G(Mi);function it(B){f[B]!==!0&&(e.enable(B),f[B]=!0)}function Mt(B){f[B]!==!1&&(e.disable(B),f[B]=!1)}function Ut(B,wt){return u[B]!==wt?(e.bindFramebuffer(B,wt),u[B]=wt,B===e.DRAW_FRAMEBUFFER&&(u[e.FRAMEBUFFER]=wt),B===e.FRAMEBUFFER&&(u[e.DRAW_FRAMEBUFFER]=wt),!0):!1}function mt(B,wt){let pt=d,Pt=!1;if(B){pt=h.get(wt),pt===void 0&&(pt=[],h.set(wt,pt));const ut=B.textures;if(pt.length!==ut.length||pt[0]!==e.COLOR_ATTACHMENT0){for(let at=0,gt=ut.length;at<gt;at++)pt[at]=e.COLOR_ATTACHMENT0+at;pt.length=ut.length,Pt=!0}}else pt[0]!==e.BACK&&(pt[0]=e.BACK,Pt=!0);Pt&&e.drawBuffers(pt)}function bt(B){return v!==B?(e.useProgram(B),v=B,!0):!1}const D={[_r]:e.FUNC_ADD,[Cy]:e.FUNC_SUBTRACT,[Ry]:e.FUNC_REVERSE_SUBTRACT};D[Py]=e.MIN,D[Ly]=e.MAX;const U={[Dy]:e.ZERO,[Iy]:e.ONE,[Ny]:e.SRC_COLOR,[nf]:e.SRC_ALPHA,[zy]:e.SRC_ALPHA_SATURATE,[By]:e.DST_COLOR,[Uy]:e.DST_ALPHA,[Fy]:e.ONE_MINUS_SRC_COLOR,[rf]:e.ONE_MINUS_SRC_ALPHA,[Hy]:e.ONE_MINUS_DST_COLOR,[Oy]:e.ONE_MINUS_DST_ALPHA,[Vy]:e.CONSTANT_COLOR,[Gy]:e.ONE_MINUS_CONSTANT_COLOR,[ky]:e.CONSTANT_ALPHA,[Wy]:e.ONE_MINUS_CONSTANT_ALPHA};function G(B,wt,pt,Pt,ut,at,gt,Gt,pe,re){if(B===Mi){_===!0&&(Mt(e.BLEND),_=!1);return}if(_===!1&&(it(e.BLEND),_=!0),B!==Ay){if(B!==m||re!==y){if((p!==_r||S!==_r)&&(e.blendEquation(e.FUNC_ADD),p=_r,S=_r),re)switch(B){case Ms:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case rp:e.blendFunc(e.ONE,e.ONE);break;case sp:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ap:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:jt("WebGLState: Invalid blending: ",B);break}else switch(B){case Ms:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case rp:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case sp:jt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ap:jt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:jt("WebGLState: Invalid blending: ",B);break}g=null,M=null,E=null,T=null,C.set(0,0,0),L=0,m=B,y=re}return}ut=ut||wt,at=at||pt,gt=gt||Pt,(wt!==p||ut!==S)&&(e.blendEquationSeparate(D[wt],D[ut]),p=wt,S=ut),(pt!==g||Pt!==M||at!==E||gt!==T)&&(e.blendFuncSeparate(U[pt],U[Pt],U[at],U[gt]),g=pt,M=Pt,E=at,T=gt),(Gt.equals(C)===!1||pe!==L)&&(e.blendColor(Gt.r,Gt.g,Gt.b,pe),C.copy(Gt),L=pe),m=B,y=!1}function et(B,wt){B.side===mi?Mt(e.CULL_FACE):it(e.CULL_FACE);let pt=B.side===Je;wt&&(pt=!pt),J(pt),B.blending===Ms&&B.transparent===!1?G(Mi):G(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),s.setMask(B.colorWrite);const Pt=B.stencilWrite;o.setTest(Pt),Pt&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ot(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?it(e.SAMPLE_ALPHA_TO_COVERAGE):Mt(e.SAMPLE_ALPHA_TO_COVERAGE)}function J(B){b!==B&&(B?e.frontFace(e.CW):e.frontFace(e.CCW),b=B)}function nt(B){B!==Ty?(it(e.CULL_FACE),B!==R&&(B===ip?e.cullFace(e.BACK):B===Ey?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Mt(e.CULL_FACE),R=B}function P(B){B!==I&&(V&&e.lineWidth(B),I=B)}function ot(B,wt,pt){B?(it(e.POLYGON_OFFSET_FILL),(F!==wt||O!==pt)&&(e.polygonOffset(wt,pt),F=wt,O=pt)):Mt(e.POLYGON_OFFSET_FILL)}function rt(B){B?it(e.SCISSOR_TEST):Mt(e.SCISSOR_TEST)}function tt(B){B===void 0&&(B=e.TEXTURE0+q-1),dt!==B&&(e.activeTexture(B),dt=B)}function st(B,wt,pt){pt===void 0&&(dt===null?pt=e.TEXTURE0+q-1:pt=dt);let Pt=ct[pt];Pt===void 0&&(Pt={type:void 0,texture:void 0},ct[pt]=Pt),(Pt.type!==B||Pt.texture!==wt)&&(dt!==pt&&(e.activeTexture(pt),dt=pt),e.bindTexture(B,wt||Q[B]),Pt.type=B,Pt.texture=wt)}function w(){const B=ct[dt];B!==void 0&&B.type!==void 0&&(e.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function x(){try{e.compressedTexImage2D(...arguments)}catch(B){jt("WebGLState:",B)}}function N(){try{e.compressedTexImage3D(...arguments)}catch(B){jt("WebGLState:",B)}}function X(){try{e.texSubImage2D(...arguments)}catch(B){jt("WebGLState:",B)}}function j(){try{e.texSubImage3D(...arguments)}catch(B){jt("WebGLState:",B)}}function W(){try{e.compressedTexSubImage2D(...arguments)}catch(B){jt("WebGLState:",B)}}function Tt(){try{e.compressedTexSubImage3D(...arguments)}catch(B){jt("WebGLState:",B)}}function ft(){try{e.texStorage2D(...arguments)}catch(B){jt("WebGLState:",B)}}function At(){try{e.texStorage3D(...arguments)}catch(B){jt("WebGLState:",B)}}function Nt(){try{e.texImage2D(...arguments)}catch(B){jt("WebGLState:",B)}}function lt(){try{e.texImage3D(...arguments)}catch(B){jt("WebGLState:",B)}}function _t(B){It.equals(B)===!1&&(e.scissor(B.x,B.y,B.z,B.w),It.copy(B))}function xt(B){qt.equals(B)===!1&&(e.viewport(B.x,B.y,B.z,B.w),qt.copy(B))}function Ct(B,wt){let pt=c.get(wt);pt===void 0&&(pt=new WeakMap,c.set(wt,pt));let Pt=pt.get(B);Pt===void 0&&(Pt=e.getUniformBlockIndex(wt,B.name),pt.set(B,Pt))}function vt(B,wt){const Pt=c.get(wt).get(B);l.get(wt)!==Pt&&(e.uniformBlockBinding(wt,Pt,B.__bindingPointIndex),l.set(wt,Pt))}function Wt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),f={},dt=null,ct={},u={},h=new WeakMap,d=[],v=null,_=!1,m=null,p=null,g=null,M=null,S=null,E=null,T=null,C=new ae(0,0,0),L=0,y=!1,b=null,R=null,I=null,F=null,O=null,It.set(0,0,e.canvas.width,e.canvas.height),qt.set(0,0,e.canvas.width,e.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:it,disable:Mt,bindFramebuffer:Ut,drawBuffers:mt,useProgram:bt,setBlending:G,setMaterial:et,setFlipSided:J,setCullFace:nt,setLineWidth:P,setPolygonOffset:ot,setScissorTest:rt,activeTexture:tt,bindTexture:st,unbindTexture:w,compressedTexImage2D:x,compressedTexImage3D:N,texImage2D:Nt,texImage3D:lt,updateUBOMapping:Ct,uniformBlockBinding:vt,texStorage2D:ft,texStorage3D:At,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:Tt,scissor:_t,viewport:xt,reset:Wt}}function GI(e,t,n,i,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,f=new WeakMap;let u;const h=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(w){}function v(w,x){return d?new OffscreenCanvas(w,x):$f("canvas")}function _(w,x,N){let X=1;const j=st(w);if((j.width>N||j.height>N)&&(X=N/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&w instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&w instanceof ImageBitmap||typeof VideoFrame!="undefined"&&w instanceof VideoFrame){const W=Math.floor(X*j.width),Tt=Math.floor(X*j.height);u===void 0&&(u=v(W,Tt));const ft=x?v(W,Tt):u;return ft.width=W,ft.height=Tt,ft.getContext("2d").drawImage(w,0,0,W,Tt),Vt("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+Tt+")."),ft}else return"data"in w&&Vt("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){e.generateMipmap(w)}function g(w){return w.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?e.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function M(w,x,N,X,j=!1){if(w!==null){if(e[w]!==void 0)return e[w];Vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let W=x;if(x===e.RED&&(N===e.FLOAT&&(W=e.R32F),N===e.HALF_FLOAT&&(W=e.R16F),N===e.UNSIGNED_BYTE&&(W=e.R8)),x===e.RED_INTEGER&&(N===e.UNSIGNED_BYTE&&(W=e.R8UI),N===e.UNSIGNED_SHORT&&(W=e.R16UI),N===e.UNSIGNED_INT&&(W=e.R32UI),N===e.BYTE&&(W=e.R8I),N===e.SHORT&&(W=e.R16I),N===e.INT&&(W=e.R32I)),x===e.RG&&(N===e.FLOAT&&(W=e.RG32F),N===e.HALF_FLOAT&&(W=e.RG16F),N===e.UNSIGNED_BYTE&&(W=e.RG8)),x===e.RG_INTEGER&&(N===e.UNSIGNED_BYTE&&(W=e.RG8UI),N===e.UNSIGNED_SHORT&&(W=e.RG16UI),N===e.UNSIGNED_INT&&(W=e.RG32UI),N===e.BYTE&&(W=e.RG8I),N===e.SHORT&&(W=e.RG16I),N===e.INT&&(W=e.RG32I)),x===e.RGB_INTEGER&&(N===e.UNSIGNED_BYTE&&(W=e.RGB8UI),N===e.UNSIGNED_SHORT&&(W=e.RGB16UI),N===e.UNSIGNED_INT&&(W=e.RGB32UI),N===e.BYTE&&(W=e.RGB8I),N===e.SHORT&&(W=e.RGB16I),N===e.INT&&(W=e.RGB32I)),x===e.RGBA_INTEGER&&(N===e.UNSIGNED_BYTE&&(W=e.RGBA8UI),N===e.UNSIGNED_SHORT&&(W=e.RGBA16UI),N===e.UNSIGNED_INT&&(W=e.RGBA32UI),N===e.BYTE&&(W=e.RGBA8I),N===e.SHORT&&(W=e.RGBA16I),N===e.INT&&(W=e.RGBA32I)),x===e.RGB&&(N===e.UNSIGNED_INT_5_9_9_9_REV&&(W=e.RGB9_E5),N===e.UNSIGNED_INT_10F_11F_11F_REV&&(W=e.R11F_G11F_B10F)),x===e.RGBA){const Tt=j?Qo:Jt.getTransfer(X);N===e.FLOAT&&(W=e.RGBA32F),N===e.HALF_FLOAT&&(W=e.RGBA16F),N===e.UNSIGNED_BYTE&&(W=Tt===ne?e.SRGB8_ALPHA8:e.RGBA8),N===e.UNSIGNED_SHORT_4_4_4_4&&(W=e.RGBA4),N===e.UNSIGNED_SHORT_5_5_5_1&&(W=e.RGB5_A1)}return(W===e.R16F||W===e.R32F||W===e.RG16F||W===e.RG32F||W===e.RGBA16F||W===e.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function S(w,x){let N;return w?x===null||x===ti||x===Ca?N=e.DEPTH24_STENCIL8:x===kn?N=e.DEPTH32F_STENCIL8:x===Aa&&(N=e.DEPTH24_STENCIL8,Vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ti||x===Ca?N=e.DEPTH_COMPONENT24:x===kn?N=e.DEPTH_COMPONENT32F:x===Aa&&(N=e.DEPTH_COMPONENT16),N}function E(w,x){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Le&&w.minFilter!==Ie?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function T(w){const x=w.target;x.removeEventListener("dispose",T),L(x),x.isVideoTexture&&f.delete(x)}function C(w){const x=w.target;x.removeEventListener("dispose",C),b(x)}function L(w){const x=i.get(w);if(x.__webglInit===void 0)return;const N=w.source,X=h.get(N);if(X){const j=X[x.__cacheKey];j.usedTimes--,j.usedTimes===0&&y(w),Object.keys(X).length===0&&h.delete(N)}i.remove(w)}function y(w){const x=i.get(w);e.deleteTexture(x.__webglTexture);const N=w.source,X=h.get(N);delete X[x.__cacheKey],a.memory.textures--}function b(w){const x=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let j=0;j<x.__webglFramebuffer[X].length;j++)e.deleteFramebuffer(x.__webglFramebuffer[X][j]);else e.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)e.deleteFramebuffer(x.__webglFramebuffer[X]);else e.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&e.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&e.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&e.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=w.textures;for(let X=0,j=N.length;X<j;X++){const W=i.get(N[X]);W.__webglTexture&&(e.deleteTexture(W.__webglTexture),a.memory.textures--),i.remove(N[X])}i.remove(w)}let R=0;function I(){R=0}function F(){const w=R;return w>=r.maxTextures&&Vt("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),R+=1,w}function O(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function q(w,x){const N=i.get(w);if(w.isVideoTexture&&rt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&N.__version!==w.version){const X=w.image;if(X===null)Vt("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Vt("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(N,w,x);return}}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,N.__webglTexture,e.TEXTURE0+x)}function V(w,x){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){Q(N,w,x);return}else w.isExternalTexture&&(N.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,N.__webglTexture,e.TEXTURE0+x)}function z(w,x){const N=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){Q(N,w,x);return}n.bindTexture(e.TEXTURE_3D,N.__webglTexture,e.TEXTURE0+x)}function K(w,x){const N=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&N.__version!==w.version){it(N,w,x);return}n.bindTexture(e.TEXTURE_CUBE_MAP,N.__webglTexture,e.TEXTURE0+x)}const dt={[pf]:e.REPEAT,[vi]:e.CLAMP_TO_EDGE,[mf]:e.MIRRORED_REPEAT},ct={[Le]:e.NEAREST,[Yy]:e.NEAREST_MIPMAP_NEAREST,[po]:e.NEAREST_MIPMAP_LINEAR,[Ie]:e.LINEAR,[wc]:e.LINEAR_MIPMAP_NEAREST,[Sr]:e.LINEAR_MIPMAP_LINEAR},ht={[Jy]:e.NEVER,[nS]:e.ALWAYS,[jy]:e.LESS,[Eu]:e.LEQUAL,[Qy]:e.EQUAL,[wu]:e.GEQUAL,[tS]:e.GREATER,[eS]:e.NOTEQUAL};function Rt(w,x){if(x.type===kn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ie||x.magFilter===wc||x.magFilter===po||x.magFilter===Sr||x.minFilter===Ie||x.minFilter===wc||x.minFilter===po||x.minFilter===Sr)&&Vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(w,e.TEXTURE_WRAP_S,dt[x.wrapS]),e.texParameteri(w,e.TEXTURE_WRAP_T,dt[x.wrapT]),(w===e.TEXTURE_3D||w===e.TEXTURE_2D_ARRAY)&&e.texParameteri(w,e.TEXTURE_WRAP_R,dt[x.wrapR]),e.texParameteri(w,e.TEXTURE_MAG_FILTER,ct[x.magFilter]),e.texParameteri(w,e.TEXTURE_MIN_FILTER,ct[x.minFilter]),x.compareFunction&&(e.texParameteri(w,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(w,e.TEXTURE_COMPARE_FUNC,ht[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Le||x.minFilter!==po&&x.minFilter!==Sr||x.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");e.texParameterf(w,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function It(w,x){let N=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",T));const X=x.source;let j=h.get(X);j===void 0&&(j={},h.set(X,j));const W=O(x);if(W!==w.__cacheKey){j[W]===void 0&&(j[W]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,N=!0),j[W].usedTimes++;const Tt=j[w.__cacheKey];Tt!==void 0&&(j[w.__cacheKey].usedTimes--,Tt.usedTimes===0&&y(x)),w.__cacheKey=W,w.__webglTexture=j[W].texture}return N}function qt(w,x,N){return Math.floor(Math.floor(w/N)/x)}function Kt(w,x,N,X){const W=w.updateRanges;if(W.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,x.width,x.height,N,X,x.data);else{W.sort((lt,_t)=>lt.start-_t.start);let Tt=0;for(let lt=1;lt<W.length;lt++){const _t=W[Tt],xt=W[lt],Ct=_t.start+_t.count,vt=qt(xt.start,x.width,4),Wt=qt(_t.start,x.width,4);xt.start<=Ct+1&&vt===Wt&&qt(xt.start+xt.count-1,x.width,4)===vt?_t.count=Math.max(_t.count,xt.start+xt.count-_t.start):(++Tt,W[Tt]=xt)}W.length=Tt+1;const ft=e.getParameter(e.UNPACK_ROW_LENGTH),At=e.getParameter(e.UNPACK_SKIP_PIXELS),Nt=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,x.width);for(let lt=0,_t=W.length;lt<_t;lt++){const xt=W[lt],Ct=Math.floor(xt.start/4),vt=Math.ceil(xt.count/4),Wt=Ct%x.width,B=Math.floor(Ct/x.width),wt=vt,pt=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Wt),e.pixelStorei(e.UNPACK_SKIP_ROWS,B),n.texSubImage2D(e.TEXTURE_2D,0,Wt,B,wt,pt,N,X,x.data)}w.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ft),e.pixelStorei(e.UNPACK_SKIP_PIXELS,At),e.pixelStorei(e.UNPACK_SKIP_ROWS,Nt)}}function Q(w,x,N){let X=e.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=e.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=e.TEXTURE_3D);const j=It(w,x),W=x.source;n.bindTexture(X,w.__webglTexture,e.TEXTURE0+N);const Tt=i.get(W);if(W.version!==Tt.__version||j===!0){n.activeTexture(e.TEXTURE0+N);const ft=Jt.getPrimaries(Jt.workingColorSpace),At=x.colorSpace===$i?null:Jt.getPrimaries(x.colorSpace),Nt=x.colorSpace===$i||ft===At?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let lt=_(x.image,!1,r.maxTextureSize);lt=tt(x,lt);const _t=s.convert(x.format,x.colorSpace),xt=s.convert(x.type);let Ct=M(x.internalFormat,_t,xt,x.colorSpace,x.isVideoTexture);Rt(X,x);let vt;const Wt=x.mipmaps,B=x.isVideoTexture!==!0,wt=Tt.__version===void 0||j===!0,pt=W.dataReady,Pt=E(x,lt);if(x.isDepthTexture)Ct=S(x.format===Mr,x.type),wt&&(B?n.texStorage2D(e.TEXTURE_2D,1,Ct,lt.width,lt.height):n.texImage2D(e.TEXTURE_2D,0,Ct,lt.width,lt.height,0,_t,xt,null));else if(x.isDataTexture)if(Wt.length>0){B&&wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,Wt[0].width,Wt[0].height);for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,xt,vt.data):n.texImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,_t,xt,vt.data);x.generateMipmaps=!1}else B?(wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,lt.width,lt.height),pt&&Kt(x,lt,_t,xt)):n.texImage2D(e.TEXTURE_2D,0,Ct,lt.width,lt.height,0,_t,xt,lt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){B&&wt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,Pt,Ct,Wt[0].width,Wt[0].height,lt.depth);for(let ut=0,at=Wt.length;ut<at;ut++)if(vt=Wt[ut],x.format!==Ln)if(_t!==null)if(B){if(pt)if(x.layerUpdates.size>0){const gt=_g(vt.width,vt.height,x.format,x.type);for(const Gt of x.layerUpdates){const pe=vt.data.subarray(Gt*gt/vt.data.BYTES_PER_ELEMENT,(Gt+1)*gt/vt.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,Gt,vt.width,vt.height,1,_t,pe)}x.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,0,vt.width,vt.height,lt.depth,_t,vt.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,ut,Ct,vt.width,vt.height,lt.depth,0,vt.data,0,0);else Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?pt&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,0,vt.width,vt.height,lt.depth,_t,xt,vt.data):n.texImage3D(e.TEXTURE_2D_ARRAY,ut,Ct,vt.width,vt.height,lt.depth,0,_t,xt,vt.data)}else{B&&wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,Wt[0].width,Wt[0].height);for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],x.format!==Ln?_t!==null?B?pt&&n.compressedTexSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,vt.data):n.compressedTexImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,vt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,xt,vt.data):n.texImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,_t,xt,vt.data)}else if(x.isDataArrayTexture)if(B){if(wt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,Pt,Ct,lt.width,lt.height,lt.depth),pt)if(x.layerUpdates.size>0){const ut=_g(lt.width,lt.height,x.format,x.type);for(const at of x.layerUpdates){const gt=lt.data.subarray(at*ut/lt.data.BYTES_PER_ELEMENT,(at+1)*ut/lt.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,at,lt.width,lt.height,1,_t,xt,gt)}x.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,_t,xt,lt.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Ct,lt.width,lt.height,lt.depth,0,_t,xt,lt.data);else if(x.isData3DTexture)B?(wt&&n.texStorage3D(e.TEXTURE_3D,Pt,Ct,lt.width,lt.height,lt.depth),pt&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,_t,xt,lt.data)):n.texImage3D(e.TEXTURE_3D,0,Ct,lt.width,lt.height,lt.depth,0,_t,xt,lt.data);else if(x.isFramebufferTexture){if(wt)if(B)n.texStorage2D(e.TEXTURE_2D,Pt,Ct,lt.width,lt.height);else{let ut=lt.width,at=lt.height;for(let gt=0;gt<Pt;gt++)n.texImage2D(e.TEXTURE_2D,gt,Ct,ut,at,0,_t,xt,null),ut>>=1,at>>=1}}else if(Wt.length>0){if(B&&wt){const ut=st(Wt[0]);n.texStorage2D(e.TEXTURE_2D,Pt,Ct,ut.width,ut.height)}for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,_t,xt,vt):n.texImage2D(e.TEXTURE_2D,ut,Ct,_t,xt,vt);x.generateMipmaps=!1}else if(B){if(wt){const ut=st(lt);n.texStorage2D(e.TEXTURE_2D,Pt,Ct,ut.width,ut.height)}pt&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,_t,xt,lt)}else n.texImage2D(e.TEXTURE_2D,0,Ct,_t,xt,lt);m(x)&&p(X),Tt.__version=W.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function it(w,x,N){if(x.image.length!==6)return;const X=It(w,x),j=x.source;n.bindTexture(e.TEXTURE_CUBE_MAP,w.__webglTexture,e.TEXTURE0+N);const W=i.get(j);if(j.version!==W.__version||X===!0){n.activeTexture(e.TEXTURE0+N);const Tt=Jt.getPrimaries(Jt.workingColorSpace),ft=x.colorSpace===$i?null:Jt.getPrimaries(x.colorSpace),At=x.colorSpace===$i||Tt===ft?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Nt=x.isCompressedTexture||x.image[0].isCompressedTexture,lt=x.image[0]&&x.image[0].isDataTexture,_t=[];for(let at=0;at<6;at++)!Nt&&!lt?_t[at]=_(x.image[at],!0,r.maxCubemapSize):_t[at]=lt?x.image[at].image:x.image[at],_t[at]=tt(x,_t[at]);const xt=_t[0],Ct=s.convert(x.format,x.colorSpace),vt=s.convert(x.type),Wt=M(x.internalFormat,Ct,vt,x.colorSpace),B=x.isVideoTexture!==!0,wt=W.__version===void 0||X===!0,pt=j.dataReady;let Pt=E(x,xt);Rt(e.TEXTURE_CUBE_MAP,x);let ut;if(Nt){B&&wt&&n.texStorage2D(e.TEXTURE_CUBE_MAP,Pt,Wt,xt.width,xt.height);for(let at=0;at<6;at++){ut=_t[at].mipmaps;for(let gt=0;gt<ut.length;gt++){const Gt=ut[gt];x.format!==Ln?Ct!==null?B?pt&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,0,0,Gt.width,Gt.height,Ct,Gt.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,Wt,Gt.width,Gt.height,0,Gt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,0,0,Gt.width,Gt.height,Ct,vt,Gt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,Wt,Gt.width,Gt.height,0,Ct,vt,Gt.data)}}}else{if(ut=x.mipmaps,B&&wt){ut.length>0&&Pt++;const at=st(_t[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,Pt,Wt,at.width,at.height)}for(let at=0;at<6;at++)if(lt){B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,_t[at].width,_t[at].height,Ct,vt,_t[at].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,_t[at].width,_t[at].height,0,Ct,vt,_t[at].data);for(let gt=0;gt<ut.length;gt++){const pe=ut[gt].image[at].image;B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,0,0,pe.width,pe.height,Ct,vt,pe.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,Wt,pe.width,pe.height,0,Ct,vt,pe.data)}}else{B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ct,vt,_t[at]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,Ct,vt,_t[at]);for(let gt=0;gt<ut.length;gt++){const Gt=ut[gt];B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,0,0,Ct,vt,Gt.image[at]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,Wt,Ct,vt,Gt.image[at])}}}m(x)&&p(e.TEXTURE_CUBE_MAP),W.__version=j.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Mt(w,x,N,X,j,W){const Tt=s.convert(N.format,N.colorSpace),ft=s.convert(N.type),At=M(N.internalFormat,Tt,ft,N.colorSpace),Nt=i.get(x),lt=i.get(N);if(lt.__renderTarget=x,!Nt.__hasExternalTextures){const _t=Math.max(1,x.width>>W),xt=Math.max(1,x.height>>W);j===e.TEXTURE_3D||j===e.TEXTURE_2D_ARRAY?n.texImage3D(j,W,At,_t,xt,x.depth,0,Tt,ft,null):n.texImage2D(j,W,At,_t,xt,0,Tt,ft,null)}n.bindFramebuffer(e.FRAMEBUFFER,w),ot(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,X,j,lt.__webglTexture,0,P(x)):(j===e.TEXTURE_2D||j>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,X,j,lt.__webglTexture,W),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ut(w,x,N){if(e.bindRenderbuffer(e.RENDERBUFFER,w),x.depthBuffer){const X=x.depthTexture,j=X&&X.isDepthTexture?X.type:null,W=S(x.stencilBuffer,j),Tt=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ot(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,P(x),W,x.width,x.height):N?e.renderbufferStorageMultisample(e.RENDERBUFFER,P(x),W,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,W,x.width,x.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Tt,e.RENDERBUFFER,w)}else{const X=x.textures;for(let j=0;j<X.length;j++){const W=X[j],Tt=s.convert(W.format,W.colorSpace),ft=s.convert(W.type),At=M(W.internalFormat,Tt,ft,W.colorSpace);ot(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,P(x),At,x.width,x.height):N?e.renderbufferStorageMultisample(e.RENDERBUFFER,P(x),At,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,At,x.width,x.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function mt(w,x,N){const X=x.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(x.depthTexture);if(j.__renderTarget=x,(!j.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X){if(j.__webglInit===void 0&&(j.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),j.__webglTexture===void 0){j.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,j.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,x.depthTexture);const Nt=s.convert(x.depthTexture.format),lt=s.convert(x.depthTexture.type);let _t;x.depthTexture.format===wi?_t=e.DEPTH_COMPONENT24:x.depthTexture.format===Mr&&(_t=e.DEPTH24_STENCIL8);for(let xt=0;xt<6;xt++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,_t,x.width,x.height,0,Nt,lt,null)}}else q(x.depthTexture,0);const W=j.__webglTexture,Tt=P(x),ft=X?e.TEXTURE_CUBE_MAP_POSITIVE_X+N:e.TEXTURE_2D,At=x.depthTexture.format===Mr?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(x.depthTexture.format===wi)ot(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,At,ft,W,0,Tt):e.framebufferTexture2D(e.FRAMEBUFFER,At,ft,W,0);else if(x.depthTexture.format===Mr)ot(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,At,ft,W,0,Tt):e.framebufferTexture2D(e.FRAMEBUFFER,At,ft,W,0);else throw new Error("Unknown depthTexture format")}function bt(w){const x=i.get(w),N=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const X=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){const j=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),x.__depthDisposeCallback=j}x.__boundDepthTexture=X}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(N)for(let X=0;X<6;X++)mt(x.__webglFramebuffer[X],w,X);else{const X=w.texture.mipmaps;X&&X.length>0?mt(x.__webglFramebuffer[0],w,0):mt(x.__webglFramebuffer,w,0)}else if(N){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=e.createRenderbuffer(),Ut(x.__webglDepthbuffer[X],w,!1);else{const j=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer[X];e.bindRenderbuffer(e.RENDERBUFFER,W),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,W)}}else{const X=w.texture.mipmaps;if(X&&X.length>0?n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=e.createRenderbuffer(),Ut(x.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,W),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,W)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function D(w,x,N){const X=i.get(w);x!==void 0&&Mt(X.__webglFramebuffer,w,w.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),N!==void 0&&bt(w)}function U(w){const x=w.texture,N=i.get(w),X=i.get(x);w.addEventListener("dispose",C);const j=w.textures,W=w.isWebGLCubeRenderTarget===!0,Tt=j.length>1;if(Tt||(X.__webglTexture===void 0&&(X.__webglTexture=e.createTexture()),X.__version=x.version,a.memory.textures++),W){N.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[ft]=[];for(let At=0;At<x.mipmaps.length;At++)N.__webglFramebuffer[ft][At]=e.createFramebuffer()}else N.__webglFramebuffer[ft]=e.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let ft=0;ft<x.mipmaps.length;ft++)N.__webglFramebuffer[ft]=e.createFramebuffer()}else N.__webglFramebuffer=e.createFramebuffer();if(Tt)for(let ft=0,At=j.length;ft<At;ft++){const Nt=i.get(j[ft]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=e.createTexture(),a.memory.textures++)}if(w.samples>0&&ot(w)===!1){N.__webglMultisampledFramebuffer=e.createFramebuffer(),N.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ft=0;ft<j.length;ft++){const At=j[ft];N.__webglColorRenderbuffer[ft]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,N.__webglColorRenderbuffer[ft]);const Nt=s.convert(At.format,At.colorSpace),lt=s.convert(At.type),_t=M(At.internalFormat,Nt,lt,At.colorSpace,w.isXRRenderTarget===!0),xt=P(w);e.renderbufferStorageMultisample(e.RENDERBUFFER,xt,_t,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ft,e.RENDERBUFFER,N.__webglColorRenderbuffer[ft])}e.bindRenderbuffer(e.RENDERBUFFER,null),w.depthBuffer&&(N.__webglDepthRenderbuffer=e.createRenderbuffer(),Ut(N.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(W){n.bindTexture(e.TEXTURE_CUBE_MAP,X.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,x);for(let ft=0;ft<6;ft++)if(x.mipmaps&&x.mipmaps.length>0)for(let At=0;At<x.mipmaps.length;At++)Mt(N.__webglFramebuffer[ft][At],w,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ft,At);else Mt(N.__webglFramebuffer[ft],w,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(x)&&p(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Tt){for(let ft=0,At=j.length;ft<At;ft++){const Nt=j[ft],lt=i.get(Nt);let _t=e.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_t=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(_t,lt.__webglTexture),Rt(_t,Nt),Mt(N.__webglFramebuffer,w,Nt,e.COLOR_ATTACHMENT0+ft,_t,0),m(Nt)&&p(_t)}n.unbindTexture()}else{let ft=e.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ft=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ft,X.__webglTexture),Rt(ft,x),x.mipmaps&&x.mipmaps.length>0)for(let At=0;At<x.mipmaps.length;At++)Mt(N.__webglFramebuffer[At],w,x,e.COLOR_ATTACHMENT0,ft,At);else Mt(N.__webglFramebuffer,w,x,e.COLOR_ATTACHMENT0,ft,0);m(x)&&p(ft),n.unbindTexture()}w.depthBuffer&&bt(w)}function G(w){const x=w.textures;for(let N=0,X=x.length;N<X;N++){const j=x[N];if(m(j)){const W=g(w),Tt=i.get(j).__webglTexture;n.bindTexture(W,Tt),p(W),n.unbindTexture()}}}const et=[],J=[];function nt(w){if(w.samples>0){if(ot(w)===!1){const x=w.textures,N=w.width,X=w.height;let j=e.COLOR_BUFFER_BIT;const W=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Tt=i.get(w),ft=x.length>1;if(ft)for(let Nt=0;Nt<x.length;Nt++)n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer);const At=w.texture.mipmaps;At&&At.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let Nt=0;Nt<x.length;Nt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=e.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=e.STENCIL_BUFFER_BIT)),ft){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Tt.__webglColorRenderbuffer[Nt]);const lt=i.get(x[Nt]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,lt,0)}e.blitFramebuffer(0,0,N,X,0,0,N,X,j,e.NEAREST),l===!0&&(et.length=0,J.length=0,et.push(e.COLOR_ATTACHMENT0+Nt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(et.push(W),J.push(W),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,J)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,et))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ft)for(let Nt=0;Nt<x.length;Nt++){n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.RENDERBUFFER,Tt.__webglColorRenderbuffer[Nt]);const lt=i.get(x[Nt]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.TEXTURE_2D,lt,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const x=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[x])}}}function P(w){return Math.min(r.maxSamples,w.samples)}function ot(w){const x=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function rt(w){const x=a.render.frame;f.get(w)!==x&&(f.set(w,x),w.update())}function tt(w,x){const N=w.colorSpace,X=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||N!==Rs&&N!==$i&&(Jt.getTransfer(N)===ne?(X!==Ln||j!==_n)&&Vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):jt("WebGLTextures: Unsupported texture color space:",N)),x}function st(w){return typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame!="undefined"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=I,this.setTexture2D=q,this.setTexture2DArray=V,this.setTexture3D=z,this.setTextureCube=K,this.rebindTextures=D,this.setupRenderTarget=U,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=bt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=ot,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function TS(e,t){function n(i,r=$i){let s;const a=Jt.getTransfer(r);if(i===_n)return e.UNSIGNED_BYTE;if(i===yu)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Su)return e.UNSIGNED_SHORT_5_5_5_1;if(i===am)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===om)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===rm)return e.BYTE;if(i===sm)return e.SHORT;if(i===Aa)return e.UNSIGNED_SHORT;if(i===xu)return e.INT;if(i===ti)return e.UNSIGNED_INT;if(i===kn)return e.FLOAT;if(i===Ei)return e.HALF_FLOAT;if(i===lm)return e.ALPHA;if(i===cm)return e.RGB;if(i===Ln)return e.RGBA;if(i===wi)return e.DEPTH_COMPONENT;if(i===Mr)return e.DEPTH_STENCIL;if(i===fm)return e.RED;if(i===Mu)return e.RED_INTEGER;if(i===Cs)return e.RG;if(i===bu)return e.RG_INTEGER;if(i===Tu)return e.RGBA_INTEGER;if(i===Lo||i===Do||i===Io||i===No)if(a===ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Lo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Do)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Io)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===No)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Lo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Do)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Io)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===No)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vf||i===_f||i===gf||i===xf)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===vf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===_f)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===gf)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===xf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yf||i===Sf||i===Mf||i===bf||i===Tf||i===Ef||i===wf)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===yf||i===Sf)return a===ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Mf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===bf)return s.COMPRESSED_R11_EAC;if(i===Tf)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Ef)return s.COMPRESSED_RG11_EAC;if(i===wf)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Af||i===Cf||i===Rf||i===Pf||i===Lf||i===Df||i===If||i===Nf||i===Ff||i===Uf||i===Of||i===Bf||i===Hf||i===zf)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Af)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Lf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Df)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===If)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ff)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Uf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Of)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Hf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vf||i===Gf||i===kf)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Vf)return a===ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===kf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wf||i===Xf||i===qf||i===Yf)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Wf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Xf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qf)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Yf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ca?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}const kI=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,WI=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class XI{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){const i=new ym(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const n=t.cameras[0].viewport,i=new ei({vertexShader:kI,fragmentShader:WI,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ci(new hl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class qI extends Ls{constructor(t,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,f=null,u=null,h=null,d=null,v=null;const _=typeof XRWebGLBinding!="undefined",m=new XI,p={},g=n.getContextAttributes();let M=null,S=null;const E=[],T=[],C=new oe;let L=null;const y=new Cn;y.viewport=new Se;const b=new Cn;b.viewport=new Se;const R=[y,b],I=new gS;let F=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let it=E[Q];return it===void 0&&(it=new Ac,E[Q]=it),it.getTargetRaySpace()},this.getControllerGrip=function(Q){let it=E[Q];return it===void 0&&(it=new Ac,E[Q]=it),it.getGripSpace()},this.getHand=function(Q){let it=E[Q];return it===void 0&&(it=new Ac,E[Q]=it),it.getHandSpace()};function q(Q){const it=T.indexOf(Q.inputSource);if(it===-1)return;const Mt=E[it];Mt!==void 0&&(Mt.update(Q.inputSource,Q.frame,c||a),Mt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",z);for(let Q=0;Q<E.length;Q++){const it=T[Q];it!==null&&(T[Q]=null,E[Q].disconnect(it))}F=null,O=null,m.reset();for(const Q in p)delete p[Q];t.setRenderTarget(M),d=null,h=null,u=null,r=null,S=null,Kt.stop(),i.isPresenting=!1,t.setPixelRatio(L),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&Vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(r,n)),u},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=function(Q){return Fu(this,null,function*(){if(r=Q,r!==null){if(M=t.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",V),r.addEventListener("inputsourceschange",z),g.xrCompatible!==!0&&(yield n.makeXRCompatible()),L=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,Ut=null,mt=null;g.depth&&(mt=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Mt=g.stencil?Mr:wi,Ut=g.stencil?Ca:ti);const bt={colorFormat:n.RGBA8,depthFormat:mt,scaleFactor:s};u=this.getBinding(),h=u.createProjectionLayer(bt),r.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),S=new $n(h.textureWidth,h.textureHeight,{format:Ln,type:_n,depthTexture:new La(h.textureWidth,h.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Mt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Mt),r.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new $n(d.framebufferWidth,d.framebufferHeight,{format:Ln,type:_n,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=yield r.requestReferenceSpace(o),Kt.setContext(r),Kt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function z(Q){for(let it=0;it<Q.removed.length;it++){const Mt=Q.removed[it],Ut=T.indexOf(Mt);Ut>=0&&(T[Ut]=null,E[Ut].disconnect(Mt))}for(let it=0;it<Q.added.length;it++){const Mt=Q.added[it];let Ut=T.indexOf(Mt);if(Ut===-1){for(let bt=0;bt<E.length;bt++)if(bt>=T.length){T.push(Mt),Ut=bt;break}else if(T[bt]===null){T[bt]=Mt,Ut=bt;break}if(Ut===-1)break}const mt=E[Ut];mt&&mt.connect(Mt)}}const K=new $,dt=new $;function ct(Q,it,Mt){K.setFromMatrixPosition(it.matrixWorld),dt.setFromMatrixPosition(Mt.matrixWorld);const Ut=K.distanceTo(dt),mt=it.projectionMatrix.elements,bt=Mt.projectionMatrix.elements,D=mt[14]/(mt[10]-1),U=mt[14]/(mt[10]+1),G=(mt[9]+1)/mt[5],et=(mt[9]-1)/mt[5],J=(mt[8]-1)/mt[0],nt=(bt[8]+1)/bt[0],P=D*J,ot=D*nt,rt=Ut/(-J+nt),tt=rt*-J;if(it.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(tt),Q.translateZ(rt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),mt[10]===-1)Q.projectionMatrix.copy(it.projectionMatrix),Q.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const st=D+rt,w=U+rt,x=P-tt,N=ot+(Ut-tt),X=G*U/w*st,j=et*U/w*st;Q.projectionMatrix.makePerspective(x,N,X,j,st,w),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ht(Q,it){it===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(it.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let it=Q.near,Mt=Q.far;m.texture!==null&&(m.depthNear>0&&(it=m.depthNear),m.depthFar>0&&(Mt=m.depthFar)),I.near=b.near=y.near=it,I.far=b.far=y.far=Mt,(F!==I.near||O!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),F=I.near,O=I.far),I.layers.mask=Q.layers.mask|6,y.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const Ut=Q.parent,mt=I.cameras;ht(I,Ut);for(let bt=0;bt<mt.length;bt++)ht(mt[bt],Ut);mt.length===2?ct(I,y,b):I.projectionMatrix.copy(y.projectionMatrix),Rt(Q,I,Ut)};function Rt(Q,it,Mt){Mt===null?Q.matrix.copy(it.matrixWorld):(Q.matrix.copy(Mt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(it.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(it.projectionMatrix),Q.projectionMatrixInverse.copy(it.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=up*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Q){l=Q,h!==null&&(h.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Q){return p[Q]};let It=null;function qt(Q,it){if(f=it.getViewerPose(c||a),v=it,f!==null){const Mt=f.views;d!==null&&(t.setRenderTargetFramebuffer(S,d.framebuffer),t.setRenderTarget(S));let Ut=!1;Mt.length!==I.cameras.length&&(I.cameras.length=0,Ut=!0);for(let U=0;U<Mt.length;U++){const G=Mt[U];let et=null;if(d!==null)et=d.getViewport(G);else{const nt=u.getViewSubImage(h,G);et=nt.viewport,U===0&&(t.setRenderTargetTextures(S,nt.colorTexture,nt.depthStencilTexture),t.setRenderTarget(S))}let J=R[U];J===void 0&&(J=new Cn,J.layers.enable(U),J.viewport=new Se,R[U]=J),J.matrix.fromArray(G.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(G.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(et.x,et.y,et.width,et.height),U===0&&(I.matrix.copy(J.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ut===!0&&I.cameras.push(J)}const mt=r.enabledFeatures;if(mt&&mt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const U=u.getDepthInformation(Mt[0]);U&&U.isValid&&U.texture&&m.init(U,r.renderState)}if(mt&&mt.includes("camera-access")&&_){t.state.unbindTexture(),u=i.getBinding();for(let U=0;U<Mt.length;U++){const G=Mt[U].camera;if(G){let et=p[G];et||(et=new ym,p[G]=et);const J=u.getCameraImage(G);et.sourceTexture=J}}}}for(let Mt=0;Mt<E.length;Mt++){const Ut=T[Mt],mt=E[Mt];Ut!==null&&mt!==void 0&&mt.update(Ut,it,c||a)}It&&It(Q,it),it.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:it}),v=null}const Kt=new xS;Kt.setAnimationLoop(qt),this.setAnimationLoop=function(Q){It=Q},this.dispose=function(){}}}const as=new Ai,YI=new Te;function $I(e,t){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,fS(e)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,g,M,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),f(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),v(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,g,M):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const g=t.get(p),M=g.envMap,S=g.envMapRotation;M&&(m.envMap.value=M,as.copy(S),as.x*=-1,as.y*=-1,as.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(as.y*=-1,as.z*=-1),m.envMapRotation.value.setFromMatrix4(YI.makeRotationFromEuler(as)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,g,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*g,m.scale.value=M*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function f(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,g){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Je&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const g=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function KI(e,t,n,i){let r={},s={},a=[];const o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,M){const S=M.program;i.uniformBlockBinding(g,S)}function c(g,M){let S=r[g.id];S===void 0&&(v(g),S=f(g),r[g.id]=S,g.addEventListener("dispose",m));const E=M.program;i.updateUBOMapping(g,E);const T=t.render.frame;s[g.id]!==T&&(h(g),s[g.id]=T)}function f(g){const M=u();g.__bindingPointIndex=M;const S=e.createBuffer(),E=g.__size,T=g.usage;return e.bindBuffer(e.UNIFORM_BUFFER,S),e.bufferData(e.UNIFORM_BUFFER,E,T),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,S),S}function u(){for(let g=0;g<o;g++)if(a.indexOf(g)===-1)return a.push(g),g;return jt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(g){const M=r[g.id],S=g.uniforms,E=g.__cache;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let T=0,C=S.length;T<C;T++){const L=Array.isArray(S[T])?S[T]:[S[T]];for(let y=0,b=L.length;y<b;y++){const R=L[y];if(d(R,T,y,E)===!0){const I=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let O=0;for(let q=0;q<F.length;q++){const V=F[q],z=_(V);typeof V=="number"||typeof V=="boolean"?(R.__data[0]=V,e.bufferSubData(e.UNIFORM_BUFFER,I+O,R.__data)):V.isMatrix3?(R.__data[0]=V.elements[0],R.__data[1]=V.elements[1],R.__data[2]=V.elements[2],R.__data[3]=0,R.__data[4]=V.elements[3],R.__data[5]=V.elements[4],R.__data[6]=V.elements[5],R.__data[7]=0,R.__data[8]=V.elements[6],R.__data[9]=V.elements[7],R.__data[10]=V.elements[8],R.__data[11]=0):(V.toArray(R.__data,O),O+=z.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,I,R.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function d(g,M,S,E){const T=g.value,C=M+"_"+S;if(E[C]===void 0)return typeof T=="number"||typeof T=="boolean"?E[C]=T:E[C]=T.clone(),!0;{const L=E[C];if(typeof T=="number"||typeof T=="boolean"){if(L!==T)return E[C]=T,!0}else if(L.equals(T)===!1)return L.copy(T),!0}return!1}function v(g){const M=g.uniforms;let S=0;const E=16;for(let C=0,L=M.length;C<L;C++){const y=Array.isArray(M[C])?M[C]:[M[C]];for(let b=0,R=y.length;b<R;b++){const I=y[b],F=Array.isArray(I.value)?I.value:[I.value];for(let O=0,q=F.length;O<q;O++){const V=F[O],z=_(V),K=S%E,dt=K%z.boundary,ct=K+dt;S+=dt,ct!==0&&E-ct<z.storage&&(S+=E-ct),I.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=S,S+=z.storage}}}const T=S%E;return T>0&&(S+=E-T),g.__size=S,g.__cache={},this}function _(g){const M={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(M.boundary=4,M.storage=4):g.isVector2?(M.boundary=8,M.storage=8):g.isVector3||g.isColor?(M.boundary=16,M.storage=12):g.isVector4?(M.boundary=16,M.storage=16):g.isMatrix3?(M.boundary=48,M.storage=48):g.isMatrix4?(M.boundary=64,M.storage=64):g.isTexture?Vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Vt("WebGLRenderer: Unsupported uniform value type.",g),M}function m(g){const M=g.target;M.removeEventListener("dispose",m);const S=a.indexOf(M.__bindingPointIndex);a.splice(S,1),e.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function p(){for(const g in r)e.deleteBuffer(r[g]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}const ZI=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let fi=null;function JI(){return fi===null&&(fi=new dS(ZI,16,16,Cs,Ei),fi.name="DFG_LUT",fi.minFilter=Ie,fi.magFilter=Ie,fi.wrapS=vi,fi.wrapT=vi,fi.generateMipmaps=!1,fi.needsUpdate=!0),fi}class jI{constructor(t={}){const{canvas:n=rS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:d=_n}=t;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=a;const _=d,m=new Set([Tu,bu,Mu]),p=new Set([_n,ti,Aa,Ca,yu,Su]),g=new Uint32Array(4),M=new Int32Array(4);let S=null,E=null;const T=[],C=[];let L=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let b=!1;this._outputColorSpace=mn;let R=0,I=0,F=null,O=-1,q=null;const V=new Se,z=new Se;let K=null;const dt=new ae(0);let ct=0,ht=n.width,Rt=n.height,It=1,qt=null,Kt=null;const Q=new Se(0,0,ht,Rt),it=new Se(0,0,ht,Rt);let Mt=!1;const Ut=new xm;let mt=!1,bt=!1;const D=new Te,U=new $,G=new Se,et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function nt(){return F===null?It:1}let P=i;function ot(A,H){return n.getContext(A,H)}try{const A={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:u};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${gu}`),n.addEventListener("webglcontextlost",Gt,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",re,!1),P===null){const H="webgl2";if(P=ot(H,A),P===null)throw ot(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw jt("WebGLRenderer: "+A.message),A}let rt,tt,st,w,x,N,X,j,W,Tt,ft,At,Nt,lt,_t,xt,Ct,vt,Wt,B,wt,pt,Pt,ut;function at(){rt=new jD(P),rt.init(),pt=new TS(P,rt),tt=new kD(P,rt,t,pt),st=new VI(P,rt),tt.reversedDepthBuffer&&h&&st.buffers.depth.setReversed(!0),w=new e3(P),x=new wI,N=new GI(P,rt,st,x,tt,pt,w),X=new XD(y),j=new JD(y),W=new s2(P),Pt=new VD(P,W),Tt=new QD(P,W,w,Pt),ft=new i3(P,Tt,W,w),Wt=new n3(P,tt,N),xt=new WD(x),At=new EI(y,X,j,rt,tt,Pt,xt),Nt=new $I(y,x),lt=new CI,_t=new NI(rt),vt=new zD(y,X,j,st,ft,v,l),Ct=new HI(y,ft,tt),ut=new KI(P,w,tt,st),B=new GD(P,rt,w),wt=new t3(P,rt,w),w.programs=At.programs,y.capabilities=tt,y.extensions=rt,y.properties=x,y.renderLists=lt,y.shadowMap=Ct,y.state=st,y.info=w}at(),_!==_n&&(L=new s3(_,n.width,n.height,r,s));const gt=new qI(y,P);this.xr=gt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const A=rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return It},this.setPixelRatio=function(A){A!==void 0&&(It=A,this.setSize(ht,Rt,!1))},this.getSize=function(A){return A.set(ht,Rt)},this.setSize=function(A,H,Z=!0){if(gt.isPresenting){Vt("WebGLRenderer: Can't change size while VR device is presenting.");return}ht=A,Rt=H,n.width=Math.floor(A*It),n.height=Math.floor(H*It),Z===!0&&(n.style.width=A+"px",n.style.height=H+"px"),L!==null&&L.setSize(n.width,n.height),this.setViewport(0,0,A,H)},this.getDrawingBufferSize=function(A){return A.set(ht*It,Rt*It).floor()},this.setDrawingBufferSize=function(A,H,Z){ht=A,Rt=H,It=Z,n.width=Math.floor(A*Z),n.height=Math.floor(H*Z),this.setViewport(0,0,A,H)},this.setEffects=function(A){if(_===_n){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let H=0;H<A.length;H++)if(A[H].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(V)},this.getViewport=function(A){return A.copy(Q)},this.setViewport=function(A,H,Z,Y){A.isVector4?Q.set(A.x,A.y,A.z,A.w):Q.set(A,H,Z,Y),st.viewport(V.copy(Q).multiplyScalar(It).round())},this.getScissor=function(A){return A.copy(it)},this.setScissor=function(A,H,Z,Y){A.isVector4?it.set(A.x,A.y,A.z,A.w):it.set(A,H,Z,Y),st.scissor(z.copy(it).multiplyScalar(It).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(A){st.setScissorTest(Mt=A)},this.setOpaqueSort=function(A){qt=A},this.setTransparentSort=function(A){Kt=A},this.getClearColor=function(A){return A.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(A=!0,H=!0,Z=!0){let Y=0;if(A){let k=!1;if(F!==null){const yt=F.texture.format;k=m.has(yt)}if(k){const yt=F.texture.type,Lt=p.has(yt),Et=vt.getClearColor(),Dt=vt.getClearAlpha(),Ft=Et.r,zt=Et.g,Ot=Et.b;Lt?(g[0]=Ft,g[1]=zt,g[2]=Ot,g[3]=Dt,P.clearBufferuiv(P.COLOR,0,g)):(M[0]=Ft,M[1]=zt,M[2]=Ot,M[3]=Dt,P.clearBufferiv(P.COLOR,0,M))}else Y|=P.COLOR_BUFFER_BIT}H&&(Y|=P.DEPTH_BUFFER_BIT),Z&&(Y|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Gt,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",re,!1),vt.dispose(),lt.dispose(),_t.dispose(),x.dispose(),X.dispose(),j.dispose(),ft.dispose(),Pt.dispose(),ut.dispose(),At.dispose(),gt.dispose(),gt.removeEventListener("sessionstart",bm),gt.removeEventListener("sessionend",Tm),Lr.stop()};function Gt(A){A.preventDefault(),fp("WebGLRenderer: Context Lost."),b=!0}function pe(){fp("WebGLRenderer: Context Restored."),b=!1;const A=w.autoReset,H=Ct.enabled,Z=Ct.autoUpdate,Y=Ct.needsUpdate,k=Ct.type;at(),w.autoReset=A,Ct.enabled=H,Ct.autoUpdate=Z,Ct.needsUpdate=Y,Ct.type=k}function re(A){jt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ii(A){const H=A.target;H.removeEventListener("dispose",ii),Li(H)}function Li(A){ES(A),x.remove(A)}function ES(A){const H=x.get(A).programs;H!==void 0&&(H.forEach(function(Z){At.releaseProgram(Z)}),A.isShaderMaterial&&At.releaseShaderCache(A))}this.renderBufferDirect=function(A,H,Z,Y,k,yt){H===null&&(H=et);const Lt=k.isMesh&&k.matrixWorld.determinant()<0,Et=AS(A,H,Z,Y,k);st.setMaterial(Y,Lt);let Dt=Z.index,Ft=1;if(Y.wireframe===!0){if(Dt=Tt.getWireframeAttribute(Z),Dt===void 0)return;Ft=2}const zt=Z.drawRange,Ot=Z.attributes.position;let $t=zt.start*Ft,le=(zt.start+zt.count)*Ft;yt!==null&&($t=Math.max($t,yt.start*Ft),le=Math.min(le,(yt.start+yt.count)*Ft)),Dt!==null?($t=Math.max($t,0),le=Math.min(le,Dt.count)):Ot!=null&&($t=Math.max($t,0),le=Math.min(le,Ot.count));const xe=le-$t;if(xe<0||xe===1/0)return;Pt.setup(k,Y,Et,Z,Dt);let ye,he=B;if(Dt!==null&&(ye=W.get(Dt),he=wt,he.setIndex(ye)),k.isMesh)Y.wireframe===!0?(st.setLineWidth(Y.wireframeLinewidth*nt()),he.setMode(P.LINES)):he.setMode(P.TRIANGLES);else if(k.isLine){let Bt=Y.linewidth;Bt===void 0&&(Bt=1),st.setLineWidth(Bt*nt()),k.isLineSegments?he.setMode(P.LINES):k.isLineLoop?he.setMode(P.LINE_LOOP):he.setMode(P.LINE_STRIP)}else k.isPoints?he.setMode(P.POINTS):k.isSprite&&he.setMode(P.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ra("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),he.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))he.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Bt=k._multiDrawStarts,se=k._multiDrawCounts,Qt=k._multiDrawCount,fn=Dt?W.get(Dt).bytesPerElement:1,Ds=x.get(Y).currentProgram.getUniforms();for(let un=0;un<Qt;un++)Ds.setValue(P,"_gl_DrawID",un),he.render(Bt[un]/fn,se[un])}else if(k.isInstancedMesh)he.renderInstances($t,xe,k.count);else if(Z.isInstancedBufferGeometry){const Bt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,se=Math.min(Z.instanceCount,Bt);he.renderInstances($t,xe,se)}else he.render($t,xe)};function Mm(A,H,Z){A.transparent===!0&&A.side===mi&&A.forceSinglePass===!1?(A.side=Je,A.needsUpdate=!0,pl(A,H,Z),A.side=tr,A.needsUpdate=!0,pl(A,H,Z),A.side=mi):pl(A,H,Z)}this.compile=function(A,H,Z=null){Z===null&&(Z=A),E=_t.get(Z),E.init(H),C.push(E),Z.traverseVisible(function(k){k.isLight&&k.layers.test(H.layers)&&(E.pushLight(k),k.castShadow&&E.pushShadow(k))}),A!==Z&&A.traverseVisible(function(k){k.isLight&&k.layers.test(H.layers)&&(E.pushLight(k),k.castShadow&&E.pushShadow(k))}),E.setupLights();const Y=new Set;return A.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const yt=k.material;if(yt)if(Array.isArray(yt))for(let Lt=0;Lt<yt.length;Lt++){const Et=yt[Lt];Mm(Et,Z,k),Y.add(Et)}else Mm(yt,Z,k),Y.add(yt)}),E=C.pop(),Y},this.compileAsync=function(A,H,Z=null){const Y=this.compile(A,H,Z);return new Promise(k=>{function yt(){if(Y.forEach(function(Lt){x.get(Lt).currentProgram.isReady()&&Y.delete(Lt)}),Y.size===0){k(A);return}setTimeout(yt,10)}rt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let Lu=null;function wS(A){Lu&&Lu(A)}function bm(){Lr.stop()}function Tm(){Lr.start()}const Lr=new xS;Lr.setAnimationLoop(wS),typeof self!="undefined"&&Lr.setContext(self),this.setAnimationLoop=function(A){Lu=A,gt.setAnimationLoop(A),A===null?Lr.stop():Lr.start()},gt.addEventListener("sessionstart",bm),gt.addEventListener("sessionend",Tm),this.render=function(A,H){if(H!==void 0&&H.isCamera!==!0){jt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const Z=gt.enabled===!0&&gt.isPresenting===!0,Y=L!==null&&(F===null||Z)&&L.begin(y,F);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),gt.enabled===!0&&gt.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(gt.cameraAutoUpdate===!0&&gt.updateCamera(H),H=gt.getCamera()),A.isScene===!0&&A.onBeforeRender(y,A,H,F),E=_t.get(A,C.length),E.init(H),C.push(E),D.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Ut.setFromProjectionMatrix(D,Wn,H.reversedDepth),bt=this.localClippingEnabled,mt=xt.init(this.clippingPlanes,bt),S=lt.get(A,T.length),S.init(),T.push(S),gt.enabled===!0&&gt.isPresenting===!0){const Lt=y.xr.getDepthSensingMesh();Lt!==null&&Du(Lt,H,-1/0,y.sortObjects)}Du(A,H,0,y.sortObjects),S.finish(),y.sortObjects===!0&&S.sort(qt,Kt),J=gt.enabled===!1||gt.isPresenting===!1||gt.hasDepthSensing()===!1,J&&vt.addToRenderList(S,A),this.info.render.frame++,mt===!0&&xt.beginShadows();const k=E.state.shadowsArray;if(Ct.render(k,A,H),mt===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(Y&&L.hasRenderPass())===!1){const Lt=S.opaque,Et=S.transmissive;if(E.setupLights(),H.isArrayCamera){const Dt=H.cameras;if(Et.length>0)for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Ot=Dt[Ft];wm(Lt,Et,A,Ot)}J&&vt.render(A);for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Ot=Dt[Ft];Em(S,A,Ot,Ot.viewport)}}else Et.length>0&&wm(Lt,Et,A,H),J&&vt.render(A),Em(S,A,H)}F!==null&&I===0&&(N.updateMultisampleRenderTarget(F),N.updateRenderTargetMipmap(F)),Y&&L.end(y),A.isScene===!0&&A.onAfterRender(y,A,H),Pt.resetDefaultState(),O=-1,q=null,C.pop(),C.length>0?(E=C[C.length-1],mt===!0&&xt.setGlobalState(y.clippingPlanes,E.state.camera)):E=null,T.pop(),T.length>0?S=T[T.length-1]:S=null};function Du(A,H,Z,Y){if(A.visible===!1)return;if(A.layers.test(H.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(H);else if(A.isLight)E.pushLight(A),A.castShadow&&E.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Ut.intersectsSprite(A)){Y&&G.setFromMatrixPosition(A.matrixWorld).applyMatrix4(D);const Lt=ft.update(A),Et=A.material;Et.visible&&S.push(A,Lt,Et,Z,G.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Ut.intersectsObject(A))){const Lt=ft.update(A),Et=A.material;if(Y&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),G.copy(A.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),G.copy(Lt.boundingSphere.center)),G.applyMatrix4(A.matrixWorld).applyMatrix4(D)),Array.isArray(Et)){const Dt=Lt.groups;for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Ot=Dt[Ft],$t=Et[Ot.materialIndex];$t&&$t.visible&&S.push(A,Lt,$t,Z,G.z,Ot)}}else Et.visible&&S.push(A,Lt,Et,Z,G.z,null)}}const yt=A.children;for(let Lt=0,Et=yt.length;Lt<Et;Lt++)Du(yt[Lt],H,Z,Y)}function Em(A,H,Z,Y){const{opaque:k,transmissive:yt,transparent:Lt}=A;E.setupLightsView(Z),mt===!0&&xt.setGlobalState(y.clippingPlanes,Z),Y&&st.viewport(V.copy(Y)),k.length>0&&dl(k,H,Z),yt.length>0&&dl(yt,H,Z),Lt.length>0&&dl(Lt,H,Z),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function wm(A,H,Z,Y){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[Y.id]===void 0){const $t=rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[Y.id]=new $n(1,1,{generateMipmaps:!0,type:$t?Ei:_n,minFilter:Sr,samples:tt.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}const yt=E.state.transmissionRenderTarget[Y.id],Lt=Y.viewport||V;yt.setSize(Lt.z*y.transmissionResolutionScale,Lt.w*y.transmissionResolutionScale);const Et=y.getRenderTarget(),Dt=y.getActiveCubeFace(),Ft=y.getActiveMipmapLevel();y.setRenderTarget(yt),y.getClearColor(dt),ct=y.getClearAlpha(),ct<1&&y.setClearColor(16777215,.5),y.clear(),J&&vt.render(Z);const zt=y.toneMapping;y.toneMapping=Yn;const Ot=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),E.setupLightsView(Y),mt===!0&&xt.setGlobalState(y.clippingPlanes,Y),dl(A,Z,Y),N.updateMultisampleRenderTarget(yt),N.updateRenderTargetMipmap(yt),rt.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let le=0,xe=H.length;le<xe;le++){const ye=H[le],{object:he,geometry:Bt,material:se,group:Qt}=ye;if(se.side===mi&&he.layers.test(Y.layers)){const fn=se.side;se.side=Je,se.needsUpdate=!0,Am(he,Z,Y,Bt,se,Qt),se.side=fn,se.needsUpdate=!0,$t=!0}}$t===!0&&(N.updateMultisampleRenderTarget(yt),N.updateRenderTargetMipmap(yt))}y.setRenderTarget(Et,Dt,Ft),y.setClearColor(dt,ct),Ot!==void 0&&(Y.viewport=Ot),y.toneMapping=zt}function dl(A,H,Z){const Y=H.isScene===!0?H.overrideMaterial:null;for(let k=0,yt=A.length;k<yt;k++){const Lt=A[k],{object:Et,geometry:Dt,group:Ft}=Lt;let zt=Lt.material;zt.allowOverride===!0&&Y!==null&&(zt=Y),Et.layers.test(Z.layers)&&Am(Et,H,Z,Dt,zt,Ft)}}function Am(A,H,Z,Y,k,yt){A.onBeforeRender(y,H,Z,Y,k,yt),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(y,H,Z,Y,A,yt),k.transparent===!0&&k.side===mi&&k.forceSinglePass===!1?(k.side=Je,k.needsUpdate=!0,y.renderBufferDirect(Z,H,Y,k,A,yt),k.side=tr,k.needsUpdate=!0,y.renderBufferDirect(Z,H,Y,k,A,yt),k.side=mi):y.renderBufferDirect(Z,H,Y,k,A,yt),A.onAfterRender(y,H,Z,Y,k,yt)}function pl(A,H,Z){H.isScene!==!0&&(H=et);const Y=x.get(A),k=E.state.lights,yt=E.state.shadowsArray,Lt=k.state.version,Et=At.getParameters(A,k.state,yt,H,Z),Dt=At.getProgramCacheKey(Et);let Ft=Y.programs;Y.environment=A.isMeshStandardMaterial?H.environment:null,Y.fog=H.fog,Y.envMap=(A.isMeshStandardMaterial?j:X).get(A.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&A.envMap===null?H.environmentRotation:A.envMapRotation,Ft===void 0&&(A.addEventListener("dispose",ii),Ft=new Map,Y.programs=Ft);let zt=Ft.get(Dt);if(zt!==void 0){if(Y.currentProgram===zt&&Y.lightsStateVersion===Lt)return Rm(A,Et),zt}else Et.uniforms=At.getUniforms(A),A.onBeforeCompile(Et,y),zt=At.acquireProgram(Et,Dt),Ft.set(Dt,zt),Y.uniforms=Et.uniforms;const Ot=Y.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ot.clippingPlanes=xt.uniform),Rm(A,Et),Y.needsLights=RS(A),Y.lightsStateVersion=Lt,Y.needsLights&&(Ot.ambientLightColor.value=k.state.ambient,Ot.lightProbe.value=k.state.probe,Ot.directionalLights.value=k.state.directional,Ot.directionalLightShadows.value=k.state.directionalShadow,Ot.spotLights.value=k.state.spot,Ot.spotLightShadows.value=k.state.spotShadow,Ot.rectAreaLights.value=k.state.rectArea,Ot.ltc_1.value=k.state.rectAreaLTC1,Ot.ltc_2.value=k.state.rectAreaLTC2,Ot.pointLights.value=k.state.point,Ot.pointLightShadows.value=k.state.pointShadow,Ot.hemisphereLights.value=k.state.hemi,Ot.directionalShadowMap.value=k.state.directionalShadowMap,Ot.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ot.spotShadowMap.value=k.state.spotShadowMap,Ot.spotLightMatrix.value=k.state.spotLightMatrix,Ot.spotLightMap.value=k.state.spotLightMap,Ot.pointShadowMap.value=k.state.pointShadowMap,Ot.pointShadowMatrix.value=k.state.pointShadowMatrix),Y.currentProgram=zt,Y.uniformsList=null,zt}function Cm(A){if(A.uniformsList===null){const H=A.currentProgram.getUniforms();A.uniformsList=Cc.seqWithValue(H.seq,A.uniforms)}return A.uniformsList}function Rm(A,H){const Z=x.get(A);Z.outputColorSpace=H.outputColorSpace,Z.batching=H.batching,Z.batchingColor=H.batchingColor,Z.instancing=H.instancing,Z.instancingColor=H.instancingColor,Z.instancingMorph=H.instancingMorph,Z.skinning=H.skinning,Z.morphTargets=H.morphTargets,Z.morphNormals=H.morphNormals,Z.morphColors=H.morphColors,Z.morphTargetsCount=H.morphTargetsCount,Z.numClippingPlanes=H.numClippingPlanes,Z.numIntersection=H.numClipIntersection,Z.vertexAlphas=H.vertexAlphas,Z.vertexTangents=H.vertexTangents,Z.toneMapping=H.toneMapping}function AS(A,H,Z,Y,k){H.isScene!==!0&&(H=et),N.resetTextureUnits();const yt=H.fog,Lt=Y.isMeshStandardMaterial?H.environment:null,Et=F===null?y.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Rs,Dt=(Y.isMeshStandardMaterial?j:X).get(Y.envMap||Lt),Ft=Y.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,zt=!!Z.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ot=!!Z.morphAttributes.position,$t=!!Z.morphAttributes.normal,le=!!Z.morphAttributes.color;let xe=Yn;Y.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(xe=y.toneMapping);const ye=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,he=ye!==void 0?ye.length:0,Bt=x.get(Y),se=E.state.lights;if(mt===!0&&(bt===!0||A!==q)){const ke=A===q&&Y.id===O;xt.setState(Y,A,ke)}let Qt=!1;Y.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==se.state.version||Bt.outputColorSpace!==Et||k.isBatchedMesh&&Bt.batching===!1||!k.isBatchedMesh&&Bt.batching===!0||k.isBatchedMesh&&Bt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Bt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Bt.instancing===!1||!k.isInstancedMesh&&Bt.instancing===!0||k.isSkinnedMesh&&Bt.skinning===!1||!k.isSkinnedMesh&&Bt.skinning===!0||k.isInstancedMesh&&Bt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Bt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Bt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Bt.instancingMorph===!1&&k.morphTexture!==null||Bt.envMap!==Dt||Y.fog===!0&&Bt.fog!==yt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==xt.numPlanes||Bt.numIntersection!==xt.numIntersection)||Bt.vertexAlphas!==Ft||Bt.vertexTangents!==zt||Bt.morphTargets!==Ot||Bt.morphNormals!==$t||Bt.morphColors!==le||Bt.toneMapping!==xe||Bt.morphTargetsCount!==he)&&(Qt=!0):(Qt=!0,Bt.__version=Y.version);let fn=Bt.currentProgram;Qt===!0&&(fn=pl(Y,H,k));let Ds=!1,un=!1,Ha=!1;const me=fn.getUniforms(),je=Bt.uniforms;if(st.useProgram(fn.program)&&(Ds=!0,un=!0,Ha=!0),Y.id!==O&&(O=Y.id,un=!0),Ds||q!==A){st.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),me.setValue(P,"projectionMatrix",A.projectionMatrix),me.setValue(P,"viewMatrix",A.matrixWorldInverse);const Qe=me.map.cameraPosition;Qe!==void 0&&Qe.setValue(P,U.setFromMatrixPosition(A.matrixWorld)),tt.logarithmicDepthBuffer&&me.setValue(P,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&me.setValue(P,"isOrthographic",A.isOrthographicCamera===!0),q!==A&&(q=A,un=!0,Ha=!0)}if(Bt.needsLights&&(se.state.directionalShadowMap.length>0&&me.setValue(P,"directionalShadowMap",se.state.directionalShadowMap,N),se.state.spotShadowMap.length>0&&me.setValue(P,"spotShadowMap",se.state.spotShadowMap,N),se.state.pointShadowMap.length>0&&me.setValue(P,"pointShadowMap",se.state.pointShadowMap,N)),k.isSkinnedMesh){me.setOptional(P,k,"bindMatrix"),me.setOptional(P,k,"bindMatrixInverse");const ke=k.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),me.setValue(P,"boneTexture",ke.boneTexture,N))}k.isBatchedMesh&&(me.setOptional(P,k,"batchingTexture"),me.setValue(P,"batchingTexture",k._matricesTexture,N),me.setOptional(P,k,"batchingIdTexture"),me.setValue(P,"batchingIdTexture",k._indirectTexture,N),me.setOptional(P,k,"batchingColorTexture"),k._colorsTexture!==null&&me.setValue(P,"batchingColorTexture",k._colorsTexture,N));const yn=Z.morphAttributes;if((yn.position!==void 0||yn.normal!==void 0||yn.color!==void 0)&&Wt.update(k,Z,fn),(un||Bt.receiveShadow!==k.receiveShadow)&&(Bt.receiveShadow=k.receiveShadow,me.setValue(P,"receiveShadow",k.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(je.envMap.value=Dt,je.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&H.environment!==null&&(je.envMapIntensity.value=H.environmentIntensity),je.dfgLUT!==void 0&&(je.dfgLUT.value=JI()),un&&(me.setValue(P,"toneMappingExposure",y.toneMappingExposure),Bt.needsLights&&CS(je,Ha),yt&&Y.fog===!0&&Nt.refreshFogUniforms(je,yt),Nt.refreshMaterialUniforms(je,Y,It,Rt,E.state.transmissionRenderTarget[A.id]),Cc.upload(P,Cm(Bt),je,N)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Cc.upload(P,Cm(Bt),je,N),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&me.setValue(P,"center",k.center),me.setValue(P,"modelViewMatrix",k.modelViewMatrix),me.setValue(P,"normalMatrix",k.normalMatrix),me.setValue(P,"modelMatrix",k.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const ke=Y.uniformsGroups;for(let Qe=0,Iu=ke.length;Qe<Iu;Qe++){const Dr=ke[Qe];ut.update(Dr,fn),ut.bind(Dr,fn)}}return fn}function CS(A,H){A.ambientLightColor.needsUpdate=H,A.lightProbe.needsUpdate=H,A.directionalLights.needsUpdate=H,A.directionalLightShadows.needsUpdate=H,A.pointLights.needsUpdate=H,A.pointLightShadows.needsUpdate=H,A.spotLights.needsUpdate=H,A.spotLightShadows.needsUpdate=H,A.rectAreaLights.needsUpdate=H,A.hemisphereLights.needsUpdate=H}function RS(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(A,H,Z){const Y=x.get(A);Y.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),x.get(A.texture).__webglTexture=H,x.get(A.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:Z,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,H){const Z=x.get(A);Z.__webglFramebuffer=H,Z.__useDefaultFramebuffer=H===void 0};const PS=P.createFramebuffer();this.setRenderTarget=function(A,H=0,Z=0){F=A,R=H,I=Z;let Y=null,k=!1,yt=!1;if(A){const Et=x.get(A);if(Et.__useDefaultFramebuffer!==void 0){st.bindFramebuffer(P.FRAMEBUFFER,Et.__webglFramebuffer),V.copy(A.viewport),z.copy(A.scissor),K=A.scissorTest,st.viewport(V),st.scissor(z),st.setScissorTest(K),O=-1;return}else if(Et.__webglFramebuffer===void 0)N.setupRenderTarget(A);else if(Et.__hasExternalTextures)N.rebindTextures(A,x.get(A.texture).__webglTexture,x.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const zt=A.depthTexture;if(Et.__boundDepthTexture!==zt){if(zt!==null&&x.has(zt)&&(A.width!==zt.image.width||A.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(A)}}const Dt=A.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(yt=!0);const Ft=x.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ft[H])?Y=Ft[H][Z]:Y=Ft[H],k=!0):A.samples>0&&N.useMultisampledRTT(A)===!1?Y=x.get(A).__webglMultisampledFramebuffer:Array.isArray(Ft)?Y=Ft[Z]:Y=Ft,V.copy(A.viewport),z.copy(A.scissor),K=A.scissorTest}else V.copy(Q).multiplyScalar(It).floor(),z.copy(it).multiplyScalar(It).floor(),K=Mt;if(Z!==0&&(Y=PS),st.bindFramebuffer(P.FRAMEBUFFER,Y)&&st.drawBuffers(A,Y),st.viewport(V),st.scissor(z),st.setScissorTest(K),k){const Et=x.get(A.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+H,Et.__webglTexture,Z)}else if(yt){const Et=H;for(let Dt=0;Dt<A.textures.length;Dt++){const Ft=x.get(A.textures[Dt]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Dt,Ft.__webglTexture,Z,Et)}}else if(A!==null&&Z!==0){const Et=x.get(A.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Et.__webglTexture,Z)}O=-1},this.readRenderTargetPixels=function(A,H,Z,Y,k,yt,Lt,Et=0){if(!(A&&A.isWebGLRenderTarget)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=x.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt){st.bindFramebuffer(P.FRAMEBUFFER,Dt);try{const Ft=A.textures[Et],zt=Ft.format,Ot=Ft.type;if(!tt.textureFormatReadable(zt)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ot)){jt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=A.width-Y&&Z>=0&&Z<=A.height-k&&(A.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Et),P.readPixels(H,Z,Y,k,pt.convert(zt),pt.convert(Ot),yt))}finally{const Ft=F!==null?x.get(F).__webglFramebuffer:null;st.bindFramebuffer(P.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=function(A,H,Z,Y,k,yt,Lt,Et=0){return Fu(this,null,function*(){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=x.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt)if(H>=0&&H<=A.width-Y&&Z>=0&&Z<=A.height-k){st.bindFramebuffer(P.FRAMEBUFFER,Dt);const Ft=A.textures[Et],zt=Ft.format,Ot=Ft.type;if(!tt.textureFormatReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $t=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,$t),P.bufferData(P.PIXEL_PACK_BUFFER,yt.byteLength,P.STREAM_READ),A.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Et),P.readPixels(H,Z,Y,k,pt.convert(zt),pt.convert(Ot),0);const le=F!==null?x.get(F).__webglFramebuffer:null;st.bindFramebuffer(P.FRAMEBUFFER,le);const xe=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),yield NP(P,xe,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,$t),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,yt),P.deleteBuffer($t),P.deleteSync(xe),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")})},this.copyFramebufferToTexture=function(A,H=null,Z=0){const Y=Math.pow(2,-Z),k=Math.floor(A.image.width*Y),yt=Math.floor(A.image.height*Y),Lt=H!==null?H.x:0,Et=H!==null?H.y:0;N.setTexture2D(A,0),P.copyTexSubImage2D(P.TEXTURE_2D,Z,0,0,Lt,Et,k,yt),st.unbindTexture()};const LS=P.createFramebuffer(),DS=P.createFramebuffer();this.copyTextureToTexture=function(A,H,Z=null,Y=null,k=0,yt=null){yt===null&&(k!==0?(Ra("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),yt=k,k=0):yt=0);let Lt,Et,Dt,Ft,zt,Ot,$t,le,xe;const ye=A.isCompressedTexture?A.mipmaps[yt]:A.image;if(Z!==null)Lt=Z.max.x-Z.min.x,Et=Z.max.y-Z.min.y,Dt=Z.isBox3?Z.max.z-Z.min.z:1,Ft=Z.min.x,zt=Z.min.y,Ot=Z.isBox3?Z.min.z:0;else{const yn=Math.pow(2,-k);Lt=Math.floor(ye.width*yn),Et=Math.floor(ye.height*yn),A.isDataArrayTexture?Dt=ye.depth:A.isData3DTexture?Dt=Math.floor(ye.depth*yn):Dt=1,Ft=0,zt=0,Ot=0}Y!==null?($t=Y.x,le=Y.y,xe=Y.z):($t=0,le=0,xe=0);const he=pt.convert(H.format),Bt=pt.convert(H.type);let se;H.isData3DTexture?(N.setTexture3D(H,0),se=P.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(N.setTexture2DArray(H,0),se=P.TEXTURE_2D_ARRAY):(N.setTexture2D(H,0),se=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,H.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,H.unpackAlignment);const Qt=P.getParameter(P.UNPACK_ROW_LENGTH),fn=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Ds=P.getParameter(P.UNPACK_SKIP_PIXELS),un=P.getParameter(P.UNPACK_SKIP_ROWS),Ha=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ye.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ye.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ft),P.pixelStorei(P.UNPACK_SKIP_ROWS,zt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ot);const me=A.isDataArrayTexture||A.isData3DTexture,je=H.isDataArrayTexture||H.isData3DTexture;if(A.isDepthTexture){const yn=x.get(A),ke=x.get(H),Qe=x.get(yn.__renderTarget),Iu=x.get(ke.__renderTarget);st.bindFramebuffer(P.READ_FRAMEBUFFER,Qe.__webglFramebuffer),st.bindFramebuffer(P.DRAW_FRAMEBUFFER,Iu.__webglFramebuffer);for(let Dr=0;Dr<Dt;Dr++)me&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,x.get(A).__webglTexture,k,Ot+Dr),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,x.get(H).__webglTexture,yt,xe+Dr)),P.blitFramebuffer(Ft,zt,Lt,Et,$t,le,Lt,Et,P.DEPTH_BUFFER_BIT,P.NEAREST);st.bindFramebuffer(P.READ_FRAMEBUFFER,null),st.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(k!==0||A.isRenderTargetTexture||x.has(A)){const yn=x.get(A),ke=x.get(H);st.bindFramebuffer(P.READ_FRAMEBUFFER,LS),st.bindFramebuffer(P.DRAW_FRAMEBUFFER,DS);for(let Qe=0;Qe<Dt;Qe++)me?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,yn.__webglTexture,k,Ot+Qe):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,yn.__webglTexture,k),je?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,ke.__webglTexture,yt,xe+Qe):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ke.__webglTexture,yt),k!==0?P.blitFramebuffer(Ft,zt,Lt,Et,$t,le,Lt,Et,P.COLOR_BUFFER_BIT,P.NEAREST):je?P.copyTexSubImage3D(se,yt,$t,le,xe+Qe,Ft,zt,Lt,Et):P.copyTexSubImage2D(se,yt,$t,le,Ft,zt,Lt,Et);st.bindFramebuffer(P.READ_FRAMEBUFFER,null),st.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else je?A.isDataTexture||A.isData3DTexture?P.texSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,Bt,ye.data):H.isCompressedArrayTexture?P.compressedTexSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,ye.data):P.texSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,Bt,ye):A.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,yt,$t,le,Lt,Et,he,Bt,ye.data):A.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,yt,$t,le,ye.width,ye.height,he,ye.data):P.texSubImage2D(P.TEXTURE_2D,yt,$t,le,Lt,Et,he,Bt,ye);P.pixelStorei(P.UNPACK_ROW_LENGTH,Qt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,fn),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ds),P.pixelStorei(P.UNPACK_SKIP_ROWS,un),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ha),yt===0&&H.generateMipmaps&&P.generateMipmap(se),st.unbindTexture()},this.initRenderTarget=function(A){x.get(A).__webglFramebuffer===void 0&&N.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?N.setTextureCube(A,0):A.isData3DTexture?N.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?N.setTexture2DArray(A,0):N.setTexture2D(A,0),st.unbindTexture()},this.resetState=function(){R=0,I=0,F=null,st.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const n=this.getContext();n.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),n.unpackColorSpace=Jt._getUnpackColorSpace()}}const nF=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Qp,AddEquation:_r,AddOperation:qy,AdditiveBlending:rp,AgXToneMapping:em,AlphaFormat:lm,AlwaysCompare:nS,AlwaysDepth:af,AlwaysStencilFunc:op,ArrayCamera:gS,BackSide:Je,BasicDepthPacking:$y,Box3:Ua,BoxGeometry:Oa,BufferAttribute:Kn,BufferGeometry:Pi,ByteType:rm,Camera:vm,CineonToneMapping:jp,ClampToEdgeWrapping:vi,Color:ae,ColorManagement:Jt,ConstantAlphaFactor:ky,ConstantColorFactor:Vy,CubeCamera:hS,CubeDepthTexture:pS,CubeReflectionMapping:Rr,CubeRefractionMapping:As,CubeTexture:_m,CubeUVReflectionMapping:cl,CullFaceBack:ip,CullFaceFront:Ey,CullFaceNone:Ty,CustomBlending:Ay,CustomToneMapping:tm,Data3DTexture:oS,DataArrayTexture:um,DataTexture:dS,DepthFormat:wi,DepthStencilFormat:Mr,DepthTexture:La,DoubleSide:mi,DstAlphaFactor:Uy,DstColorFactor:By,EqualCompare:Qy,EqualDepth:lf,EquirectangularReflectionMapping:hf,EquirectangularRefractionMapping:df,Euler:Ai,EventDispatcher:Ls,ExternalTexture:ym,Float32BufferAttribute:bi,FloatType:kn,FrontSide:tr,Frustum:xm,GLSL3:cp,GreaterCompare:tS,GreaterDepth:ff,GreaterEqualCompare:wu,GreaterEqualDepth:cf,Group:mo,HalfFloatType:Ei,ImageUtils:sS,IntType:xu,KeepStencilOp:ls,Layers:hm,LessCompare:jy,LessDepth:of,LessEqualCompare:Eu,LessEqualDepth:ws,LinearFilter:Ie,LinearMipmapLinearFilter:Sr,LinearMipmapNearestFilter:wc,LinearSRGBColorSpace:Rs,LinearToneMapping:Zp,LinearTransfer:Qo,Material:ul,Matrix3:Xt,Matrix4:Te,MaxEquation:Ly,Mesh:Ci,MeshBasicMaterial:dm,MeshDepthMaterial:vS,MeshDistanceMaterial:_S,MinEquation:Py,MirroredRepeatWrapping:mf,MixOperation:Xy,MultiplyBlending:ap,MultiplyOperation:Kp,NearestFilter:Le,NearestMipmapLinearFilter:po,NearestMipmapNearestFilter:Yy,NeutralToneMapping:nm,NeverCompare:Jy,NeverDepth:sf,NoBlending:Mi,NoColorSpace:$i,NoToneMapping:Yn,NormalBlending:Ms,NotEqualCompare:eS,NotEqualDepth:uf,Object3D:cn,ObjectSpaceNormalMap:Zy,OneFactor:Iy,OneMinusConstantAlphaFactor:Wy,OneMinusConstantColorFactor:Gy,OneMinusDstAlphaFactor:Oy,OneMinusDstColorFactor:Hy,OneMinusSrcAlphaFactor:rf,OneMinusSrcColorFactor:Fy,OrthographicCamera:Sm,PCFShadowMap:Po,PCFSoftShadowMap:wy,PMREMGenerator:hp,PerspectiveCamera:Cn,Plane:vr,PlaneGeometry:hl,Quaternion:Fa,R11_EAC_Format:bf,RED_GREEN_RGTC2_Format:qf,RED_RGTC1_Format:Wf,REVISION:gu,RG11_EAC_Format:Ef,RGBAFormat:Ln,RGBAIntegerFormat:Tu,RGBA_ASTC_10x10_Format:Bf,RGBA_ASTC_10x5_Format:Ff,RGBA_ASTC_10x6_Format:Uf,RGBA_ASTC_10x8_Format:Of,RGBA_ASTC_12x10_Format:Hf,RGBA_ASTC_12x12_Format:zf,RGBA_ASTC_4x4_Format:Af,RGBA_ASTC_5x4_Format:Cf,RGBA_ASTC_5x5_Format:Rf,RGBA_ASTC_6x5_Format:Pf,RGBA_ASTC_6x6_Format:Lf,RGBA_ASTC_8x5_Format:Df,RGBA_ASTC_8x6_Format:If,RGBA_ASTC_8x8_Format:Nf,RGBA_BPTC_Format:Vf,RGBA_ETC2_EAC_Format:Mf,RGBA_PVRTC_2BPPV1_Format:xf,RGBA_PVRTC_4BPPV1_Format:gf,RGBA_S3TC_DXT1_Format:Do,RGBA_S3TC_DXT3_Format:Io,RGBA_S3TC_DXT5_Format:No,RGBFormat:cm,RGB_BPTC_SIGNED_Format:Gf,RGB_BPTC_UNSIGNED_Format:kf,RGB_ETC1_Format:yf,RGB_ETC2_Format:Sf,RGB_PVRTC_2BPPV1_Format:_f,RGB_PVRTC_4BPPV1_Format:vf,RGB_S3TC_DXT1_Format:Lo,RGFormat:Cs,RGIntegerFormat:bu,RawShaderMaterial:mS,Ray:lS,RedFormat:fm,RedIntegerFormat:Mu,ReinhardToneMapping:Jp,RenderTarget:aS,RepeatWrapping:pf,ReverseSubtractEquation:Ry,SIGNED_R11_EAC_Format:Tf,SIGNED_RED_GREEN_RGTC2_Format:Yf,SIGNED_RED_RGTC1_Format:Xf,SIGNED_RG11_EAC_Format:wf,SRGBColorSpace:mn,SRGBTransfer:ne,Scene:t2,ShaderChunk:Yt,ShaderLib:Vn,ShaderMaterial:ei,ShortType:sm,Source:Au,Sphere:Cu,SrcAlphaFactor:nf,SrcAlphaSaturateFactor:zy,SrcColorFactor:Ny,StaticDrawUsage:lp,SubtractEquation:Cy,SubtractiveBlending:sp,TangentSpaceNormalMap:Ky,Texture:Ve,Triangle:Rn,UVMapping:im,Uint16BufferAttribute:pm,Uint32BufferAttribute:mm,UniformsLib:St,UniformsUtils:uS,UnsignedByteType:_n,UnsignedInt101111Type:om,UnsignedInt248Type:Ca,UnsignedInt5999Type:am,UnsignedIntType:ti,UnsignedShort4444Type:yu,UnsignedShort5551Type:Su,UnsignedShortType:Aa,VSMShadowMap:la,Vector2:oe,Vector3:$,Vector4:Se,WebGLCoordinateSystem:Wn,WebGLCubeRenderTarget:gm,WebGLRenderTarget:$n,WebGLRenderer:jI,WebGLUtils:TS,WebGPUCoordinateSystem:tl,WebXRController:Ac,ZeroFactor:Dy,createCanvasElement:rS,error:jt,log:fp,warn:Vt,warnOnce:Ra},Symbol.toStringTag,{value:"Module"}));export{tP as $,Ti as A,xn as B,GN as C,Pn as D,qN as E,IN as F,Ps as G,Hx as H,Eo as I,XA as J,eh as K,$N as L,oa as M,ce as N,qA as O,Ge as P,wo as Q,wR as R,AR as S,ny as T,ba as U,YN as V,WR as W,qR as X,jR as Y,$p as Z,ue as _,eN as a,VN as a$,iP as a0,sP as a1,py as a2,lP as a3,fP as a4,hP as a5,KN as a6,sy as a7,QN as a8,ZN as a9,aC as aA,Nx as aB,Jo as aC,gA as aD,XN as aE,kN as aF,wa as aG,Yx as aH,Ke as aI,HN as aJ,YA as aK,CN as aL,NC as aM,TN as aN,GA as aO,Yv as aP,Id as aQ,Hn as aR,NN as aS,FN as aT,xi as aU,ol as aV,zA as aW,ON as aX,CA as aY,EA as aZ,BN as a_,jN as aa,be as ab,JN as ac,LR as ad,lo as ae,xA as af,yc as ag,oo as ah,Ix as ai,UN as aj,wN as ak,zN as al,vA as am,Vv as an,EN as ao,PN as ap,uu as aq,DN as ar,ma as as,UC as at,tF as au,$o as av,Es as aw,RP as ax,Na as ay,WN as az,tN as b,Zo as b0,Sc as b1,ll as b2,eF as b3,P0 as b4,Md as b5,bd as b6,Z0 as b7,lN as b8,aN as b9,MN as bA,SN as bB,Mb as bC,ze as bD,mN as bE,nF as bF,yp as ba,ZS as bb,rn as bc,iN as bd,J0 as be,R0 as bf,sN as bg,RM as bh,fN as bi,Ze as bj,xN as bk,L0 as bl,_N as bm,xp as bn,w1 as bo,oN as bp,cN as bq,nN as br,dN as bs,pN as bt,vN as bu,hN as bv,gN as bw,uN as bx,gM as by,yN as bz,O1 as c,rN as d,Xc as e,LN as f,ln as g,B1 as h,uc as i,di as j,gr as k,xc as l,AN as m,u0 as n,RN as o,PM as p,Yo as q,Ap as r,_M as s,Ta as t,yM as u,ge as v,Vu as w,bN as x,_e as y,gs as z};
