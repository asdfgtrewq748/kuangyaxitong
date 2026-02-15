var jS=Object.defineProperty,QS=Object.defineProperties;var tM=Object.getOwnPropertyDescriptors;var zm=Object.getOwnPropertySymbols;var eM=Object.prototype.hasOwnProperty,nM=Object.prototype.propertyIsEnumerable;var Gm=Math.pow,Vm=(e,t,n)=>t in e?jS(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,ku=(e,t)=>{for(var n in t||(t={}))eM.call(t,n)&&Vm(e,n,t[n]);if(zm)for(var n of zm(t))nM.call(t,n)&&Vm(e,n,t[n]);return e},km=(e,t)=>QS(e,tM(t));var Wu=(e,t,n)=>new Promise((i,r)=>{var s=l=>{try{o(n.next(l))}catch(c){r(c)}},a=l=>{try{o(n.throw(l))}catch(c){r(c)}},o=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,a);o((n=n.apply(e,t)).next())});/**
* @vue/shared v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Ep(e){const t=Object.create(null);for(const n of e.split(","))t[n]=1;return n=>n in t}const de={},ha=[],_i=()=>{},jg=()=>!1,tu=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),wp=e=>e.startsWith("onUpdate:"),Ae=Object.assign,Ap=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},iM=Object.prototype.hasOwnProperty,ie=(e,t)=>iM.call(e,t),Ot=Array.isArray,da=e=>sl(e)==="[object Map]",Na=e=>sl(e)==="[object Set]",Wm=e=>sl(e)==="[object Date]",kt=e=>typeof e=="function",be=e=>typeof e=="string",Zn=e=>typeof e=="symbol",fe=e=>e!==null&&typeof e=="object",Qg=e=>(fe(e)||kt(e))&&kt(e.then)&&kt(e.catch),t0=Object.prototype.toString,sl=e=>t0.call(e),rM=e=>sl(e).slice(8,-1),e0=e=>sl(e)==="[object Object]",eu=e=>be(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,xo=Ep(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),nu=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},sM=/-\w/g,Nn=nu(e=>e.replace(sM,t=>t.slice(1).toUpperCase())),aM=/\B([A-Z])/g,Dr=nu(e=>e.replace(aM,"-$1").toLowerCase()),iu=nu(e=>e.charAt(0).toUpperCase()+e.slice(1)),Xu=nu(e=>e?`on${iu(e)}`:""),wr=(e,t)=>!Object.is(e,t),pc=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},n0=(e,t,n,i=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:i,value:n})},ru=e=>{const t=parseFloat(e);return isNaN(t)?e:t},oM=e=>{const t=be(e)?Number(e):NaN;return isNaN(t)?e:t};let Xm;const su=()=>Xm||(Xm=typeof globalThis!="undefined"?globalThis:typeof self!="undefined"?self:typeof window!="undefined"?window:typeof global!="undefined"?global:{});function Cp(e){if(Ot(e)){const t={};for(let n=0;n<e.length;n++){const i=e[n],r=be(i)?uM(i):Cp(i);if(r)for(const s in r)t[s]=r[s]}return t}else if(be(e)||fe(e))return e}const lM=/;(?![^(]*\))/g,cM=/:([^]+)/,fM=/\/\*[^]*?\*\//g;function uM(e){const t={};return e.replace(fM,"").split(lM).forEach(n=>{if(n){const i=n.split(cM);i.length>1&&(t[i[0].trim()]=i[1].trim())}}),t}function Rp(e){let t="";if(be(e))t=e;else if(Ot(e))for(let n=0;n<e.length;n++){const i=Rp(e[n]);i&&(t+=i+" ")}else if(fe(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const hM="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",dM=Ep(hM);function i0(e){return!!e||e===""}function pM(e,t){if(e.length!==t.length)return!1;let n=!0;for(let i=0;n&&i<e.length;i++)n=Es(e[i],t[i]);return n}function Es(e,t){if(e===t)return!0;let n=Wm(e),i=Wm(t);if(n||i)return n&&i?e.getTime()===t.getTime():!1;if(n=Zn(e),i=Zn(t),n||i)return e===t;if(n=Ot(e),i=Ot(t),n||i)return n&&i?pM(e,t):!1;if(n=fe(e),i=fe(t),n||i){if(!n||!i)return!1;const r=Object.keys(e).length,s=Object.keys(t).length;if(r!==s)return!1;for(const a in e){const o=e.hasOwnProperty(a),l=t.hasOwnProperty(a);if(o&&!l||!o&&l||!Es(e[a],t[a]))return!1}}return String(e)===String(t)}function Pp(e,t){return e.findIndex(n=>Es(n,t))}const r0=e=>!!(e&&e.__v_isRef===!0),mM=e=>be(e)?e:e==null?"":Ot(e)||fe(e)&&(e.toString===t0||!kt(e.toString))?r0(e)?mM(e.value):JSON.stringify(e,s0,2):String(e),s0=(e,t)=>r0(t)?s0(e,t.value):da(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[i,r],s)=>(n[qu(i,s)+" =>"]=r,n),{})}:Na(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>qu(n))}:Zn(t)?qu(t):fe(t)&&!Ot(t)&&!e0(t)?String(t):t,qu=(e,t="")=>{var n;return Zn(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Be;class a0{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Be,!t&&Be&&(this.index=(Be.scopes||(Be.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].pause();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes)for(t=0,n=this.scopes.length;t<n;t++)this.scopes[t].resume();for(t=0,n=this.effects.length;t<n;t++)this.effects[t].resume()}}run(t){if(this._active){const n=Be;try{return Be=this,t()}finally{Be=n}}}on(){++this._on===1&&(this.prevScope=Be,Be=this)}off(){this._on>0&&--this._on===0&&(Be=this.prevScope,this.prevScope=void 0)}stop(t){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function o0(e){return new a0(e)}function l0(){return Be}function vM(e,t=!1){Be&&Be.cleanups.push(e)}let ve;const Yu=new WeakSet;class c0{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Be&&Be.active&&Be.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Yu.has(this)&&(Yu.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||u0(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,qm(this),h0(this);const t=ve,n=Xn;ve=this,Xn=!0;try{return this.fn()}finally{d0(this),ve=t,Xn=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)Ip(t);this.deps=this.depsTail=void 0,qm(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Yu.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){yd(this)&&this.run()}get dirty(){return yd(this)}}let f0=0,yo,So;function u0(e,t=!1){if(e.flags|=8,t){e.next=So,So=e;return}e.next=yo,yo=e}function Lp(){f0++}function Dp(){if(--f0>0)return;if(So){let t=So;for(So=void 0;t;){const n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;yo;){let t=yo;for(yo=void 0;t;){const n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(i){e||(e=i)}t=n}}if(e)throw e}function h0(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function d0(e){let t,n=e.depsTail,i=n;for(;i;){const r=i.prevDep;i.version===-1?(i===n&&(n=r),Ip(i),_M(i)):t=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}e.deps=t,e.depsTail=n}function yd(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(p0(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function p0(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ho)||(e.globalVersion=Ho,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!yd(e))))return;e.flags|=2;const t=e.dep,n=ve,i=Xn;ve=e,Xn=!0;try{h0(e);const r=e.fn(e._value);(t.version===0||wr(r,e._value))&&(e.flags|=128,e._value=r,t.version++)}catch(r){throw t.version++,r}finally{ve=n,Xn=i,d0(e),e.flags&=-3}}function Ip(e,t=!1){const{dep:n,prevSub:i,nextSub:r}=e;if(i&&(i.nextSub=r,e.prevSub=void 0),r&&(r.prevSub=i,e.nextSub=void 0),n.subs===e&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let s=n.computed.deps;s;s=s.nextDep)Ip(s,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function _M(e){const{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}let Xn=!0;const m0=[];function Ji(){m0.push(Xn),Xn=!1}function ji(){const e=m0.pop();Xn=e===void 0?!0:e}function qm(e){const{cleanup:t}=e;if(e.cleanup=void 0,t){const n=ve;ve=void 0;try{t()}finally{ve=n}}}let Ho=0;class gM{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Np{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!ve||!Xn||ve===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==ve)n=this.activeLink=new gM(ve,this),ve.deps?(n.prevDep=ve.depsTail,ve.depsTail.nextDep=n,ve.depsTail=n):ve.deps=ve.depsTail=n,v0(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=ve.depsTail,n.nextDep=void 0,ve.depsTail.nextDep=n,ve.depsTail=n,ve.deps===n&&(ve.deps=i)}return n}trigger(t){this.version++,Ho++,this.notify(t)}notify(t){Lp();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Dp()}}}function v0(e){if(e.dep.sc++,e.sub.flags&4){const t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let i=t.deps;i;i=i.nextDep)v0(i)}const n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}const Ic=new WeakMap,_s=Symbol(""),Sd=Symbol(""),zo=Symbol("");function He(e,t,n){if(Xn&&ve){let i=Ic.get(e);i||Ic.set(e,i=new Map);let r=i.get(n);r||(i.set(n,r=new Np),r.map=i,r.key=n),r.track()}}function Xi(e,t,n,i,r,s){const a=Ic.get(e);if(!a){Ho++;return}const o=l=>{l&&l.trigger()};if(Lp(),t==="clear")a.forEach(o);else{const l=Ot(e),c=l&&eu(n);if(l&&n==="length"){const f=Number(i);a.forEach((u,h)=>{(h==="length"||h===zo||!Zn(h)&&h>=f)&&o(u)})}else switch((n!==void 0||a.has(void 0))&&o(a.get(n)),c&&o(a.get(zo)),t){case"add":l?c&&o(a.get("length")):(o(a.get(_s)),da(e)&&o(a.get(Sd)));break;case"delete":l||(o(a.get(_s)),da(e)&&o(a.get(Sd)));break;case"set":da(e)&&o(a.get(_s));break}}Dp()}function xM(e,t){const n=Ic.get(e);return n&&n.get(t)}function Fs(e){const t=jt(e);return t===e?t:(He(t,"iterate",zo),xn(e)?t:t.map(Jn))}function au(e){return He(e=jt(e),"iterate",zo),e}function pr(e,t){return Qi(e)?Sa(Ki(e)?Jn(t):t):Jn(t)}const yM={__proto__:null,[Symbol.iterator](){return $u(this,Symbol.iterator,e=>pr(this,e))},concat(...e){return Fs(this).concat(...e.map(t=>Ot(t)?Fs(t):t))},entries(){return $u(this,"entries",e=>(e[1]=pr(this,e[1]),e))},every(e,t){return Di(this,"every",e,t,void 0,arguments)},filter(e,t){return Di(this,"filter",e,t,n=>n.map(i=>pr(this,i)),arguments)},find(e,t){return Di(this,"find",e,t,n=>pr(this,n),arguments)},findIndex(e,t){return Di(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return Di(this,"findLast",e,t,n=>pr(this,n),arguments)},findLastIndex(e,t){return Di(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return Di(this,"forEach",e,t,void 0,arguments)},includes(...e){return Ku(this,"includes",e)},indexOf(...e){return Ku(this,"indexOf",e)},join(e){return Fs(this).join(e)},lastIndexOf(...e){return Ku(this,"lastIndexOf",e)},map(e,t){return Di(this,"map",e,t,void 0,arguments)},pop(){return Ga(this,"pop")},push(...e){return Ga(this,"push",e)},reduce(e,...t){return Ym(this,"reduce",e,t)},reduceRight(e,...t){return Ym(this,"reduceRight",e,t)},shift(){return Ga(this,"shift")},some(e,t){return Di(this,"some",e,t,void 0,arguments)},splice(...e){return Ga(this,"splice",e)},toReversed(){return Fs(this).toReversed()},toSorted(e){return Fs(this).toSorted(e)},toSpliced(...e){return Fs(this).toSpliced(...e)},unshift(...e){return Ga(this,"unshift",e)},values(){return $u(this,"values",e=>pr(this,e))}};function $u(e,t,n){const i=au(e),r=i[t]();return i!==e&&!xn(e)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=n(s.value)),s}),r}const SM=Array.prototype;function Di(e,t,n,i,r,s){const a=au(e),o=a!==e&&!xn(e),l=a[t];if(l!==SM[t]){const u=l.apply(e,s);return o?Jn(u):u}let c=n;a!==e&&(o?c=function(u,h){return n.call(this,pr(e,u),h,e)}:n.length>2&&(c=function(u,h){return n.call(this,u,h,e)}));const f=l.call(a,c,i);return o&&r?r(f):f}function Ym(e,t,n,i){const r=au(e);let s=n;return r!==e&&(xn(e)?n.length>3&&(s=function(a,o,l){return n.call(this,a,o,l,e)}):s=function(a,o,l){return n.call(this,a,pr(e,o),l,e)}),r[t](s,...i)}function Ku(e,t,n){const i=jt(e);He(i,"iterate",zo);const r=i[t](...n);return(r===-1||r===!1)&&lu(n[0])?(n[0]=jt(n[0]),i[t](...n)):r}function Ga(e,t,n=[]){Ji(),Lp();const i=jt(e)[t].apply(e,n);return Dp(),ji(),i}const MM=Ep("__proto__,__v_isRef,__isVue"),_0=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Zn));function bM(e){Zn(e)||(e=String(e));const t=jt(this);return He(t,"has",e),t.hasOwnProperty(e)}class g0{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,i){if(n==="__v_skip")return t.__v_skip;const r=this._isReadonly,s=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return s;if(n==="__v_raw")return i===(r?s?IM:M0:s?S0:y0).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(i)?t:void 0;const a=Ot(t);if(!r){let l;if(a&&(l=yM[n]))return l;if(n==="hasOwnProperty")return bM}const o=Reflect.get(t,n,Me(t)?t:i);if((Zn(n)?_0.has(n):MM(n))||(r||He(t,"get",n),s))return o;if(Me(o)){const l=a&&eu(n)?o:o.value;return r&&fe(l)?bd(l):l}return fe(o)?r?bd(o):ou(o):o}}class x0 extends g0{constructor(t=!1){super(!1,t)}set(t,n,i,r){let s=t[n];const a=Ot(t)&&eu(n);if(!this._isShallow){const c=Qi(s);if(!xn(i)&&!Qi(i)&&(s=jt(s),i=jt(i)),!a&&Me(s)&&!Me(i))return c||(s.value=i),!0}const o=a?Number(n)<t.length:ie(t,n),l=Reflect.set(t,n,i,Me(t)?t:r);return t===jt(r)&&(o?wr(i,s)&&Xi(t,"set",n,i):Xi(t,"add",n,i)),l}deleteProperty(t,n){const i=ie(t,n);t[n];const r=Reflect.deleteProperty(t,n);return r&&i&&Xi(t,"delete",n,void 0),r}has(t,n){const i=Reflect.has(t,n);return(!Zn(n)||!_0.has(n))&&He(t,"has",n),i}ownKeys(t){return He(t,"iterate",Ot(t)?"length":_s),Reflect.ownKeys(t)}}class TM extends g0{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const EM=new x0,wM=new TM,AM=new x0(!0);const Md=e=>e,xl=e=>Reflect.getPrototypeOf(e);function CM(e,t,n){return function(...i){const r=this.__v_raw,s=jt(r),a=da(s),o=e==="entries"||e===Symbol.iterator&&a,l=e==="keys"&&a,c=r[e](...i),f=n?Md:t?Sa:Jn;return!t&&He(s,"iterate",l?Sd:_s),Ae(Object.create(c),{next(){const{value:u,done:h}=c.next();return h?{value:u,done:h}:{value:o?[f(u[0]),f(u[1])]:f(u),done:h}}})}}function yl(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function RM(e,t){const n={get(r){const s=this.__v_raw,a=jt(s),o=jt(r);e||(wr(r,o)&&He(a,"get",r),He(a,"get",o));const{has:l}=xl(a),c=t?Md:e?Sa:Jn;if(l.call(a,r))return c(s.get(r));if(l.call(a,o))return c(s.get(o));s!==a&&s.get(r)},get size(){const r=this.__v_raw;return!e&&He(jt(r),"iterate",_s),r.size},has(r){const s=this.__v_raw,a=jt(s),o=jt(r);return e||(wr(r,o)&&He(a,"has",r),He(a,"has",o)),r===o?s.has(r):s.has(r)||s.has(o)},forEach(r,s){const a=this,o=a.__v_raw,l=jt(o),c=t?Md:e?Sa:Jn;return!e&&He(l,"iterate",_s),o.forEach((f,u)=>r.call(s,c(f),c(u),a))}};return Ae(n,e?{add:yl("add"),set:yl("set"),delete:yl("delete"),clear:yl("clear")}:{add(r){!t&&!xn(r)&&!Qi(r)&&(r=jt(r));const s=jt(this);return xl(s).has.call(s,r)||(s.add(r),Xi(s,"add",r,r)),this},set(r,s){!t&&!xn(s)&&!Qi(s)&&(s=jt(s));const a=jt(this),{has:o,get:l}=xl(a);let c=o.call(a,r);c||(r=jt(r),c=o.call(a,r));const f=l.call(a,r);return a.set(r,s),c?wr(s,f)&&Xi(a,"set",r,s):Xi(a,"add",r,s),this},delete(r){const s=jt(this),{has:a,get:o}=xl(s);let l=a.call(s,r);l||(r=jt(r),l=a.call(s,r)),o&&o.call(s,r);const c=s.delete(r);return l&&Xi(s,"delete",r,void 0),c},clear(){const r=jt(this),s=r.size!==0,a=r.clear();return s&&Xi(r,"clear",void 0,void 0),a}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=CM(r,e,t)}),n}function Fp(e,t){const n=RM(e,t);return(i,r,s)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_raw"?i:Reflect.get(ie(n,r)&&r in i?n:i,r,s)}const PM={get:Fp(!1,!1)},LM={get:Fp(!1,!0)},DM={get:Fp(!0,!1)};const y0=new WeakMap,S0=new WeakMap,M0=new WeakMap,IM=new WeakMap;function NM(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function FM(e){return e.__v_skip||!Object.isExtensible(e)?0:NM(rM(e))}function ou(e){return Qi(e)?e:Up(e,!1,EM,PM,y0)}function UM(e){return Up(e,!1,AM,LM,S0)}function bd(e){return Up(e,!0,wM,DM,M0)}function Up(e,t,n,i,r){if(!fe(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const s=FM(e);if(s===0)return e;const a=r.get(e);if(a)return a;const o=new Proxy(e,s===2?i:n);return r.set(e,o),o}function Ki(e){return Qi(e)?Ki(e.__v_raw):!!(e&&e.__v_isReactive)}function Qi(e){return!!(e&&e.__v_isReadonly)}function xn(e){return!!(e&&e.__v_isShallow)}function lu(e){return e?!!e.__v_raw:!1}function jt(e){const t=e&&e.__v_raw;return t?jt(t):e}function Op(e){return!ie(e,"__v_skip")&&Object.isExtensible(e)&&n0(e,"__v_skip",!0),e}const Jn=e=>fe(e)?ou(e):e,Sa=e=>fe(e)?bd(e):e;function Me(e){return e?e.__v_isRef===!0:!1}function OM(e){return b0(e,!1)}function wN(e){return b0(e,!0)}function b0(e,t){return Me(e)?e:new BM(e,t)}class BM{constructor(t,n){this.dep=new Np,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:jt(t),this._value=n?t:Jn(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){const n=this._rawValue,i=this.__v_isShallow||xn(t)||Qi(t);t=i?t:jt(t),wr(t,n)&&(this._rawValue=t,this._value=i?t:Jn(t),this.dep.trigger())}}function T0(e){return Me(e)?e.value:e}const HM={get:(e,t,n)=>t==="__v_raw"?e:T0(Reflect.get(e,t,n)),set:(e,t,n,i)=>{const r=e[t];return Me(r)&&!Me(n)?(r.value=n,!0):Reflect.set(e,t,n,i)}};function E0(e){return Ki(e)?e:new Proxy(e,HM)}function zM(e){const t=Ot(e)?new Array(e.length):{};for(const n in e)t[n]=GM(e,n);return t}class VM{constructor(t,n,i){this._object=t,this._key=n,this._defaultValue=i,this.__v_isRef=!0,this._value=void 0,this._raw=jt(t);let r=!0,s=t;if(!Ot(t)||!eu(String(n)))do r=!lu(s)||xn(s);while(r&&(s=s.__v_raw));this._shallow=r}get value(){let t=this._object[this._key];return this._shallow&&(t=T0(t)),this._value=t===void 0?this._defaultValue:t}set value(t){if(this._shallow&&Me(this._raw[this._key])){const n=this._object[this._key];if(Me(n)){n.value=t;return}}this._object[this._key]=t}get dep(){return xM(this._raw,this._key)}}function GM(e,t,n){return new VM(e,t,n)}class kM{constructor(t,n,i){this.fn=t,this.setter=n,this._value=void 0,this.dep=new Np(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ho-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&ve!==this)return u0(this,!0),!0}get value(){const t=this.dep.track();return p0(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}}function WM(e,t,n=!1){let i,r;return kt(e)?i=e:(i=e.get,r=e.set),new kM(i,r,n)}const Sl={},Nc=new WeakMap;let cs;function XM(e,t=!1,n=cs){if(n){let i=Nc.get(n);i||Nc.set(n,i=[]),i.push(e)}}function qM(e,t,n=de){const{immediate:i,deep:r,once:s,scheduler:a,augmentJob:o,call:l}=n,c=S=>r?S:xn(S)||r===!1||r===0?qi(S,1):qi(S);let f,u,h,d,v=!1,_=!1;if(Me(e)?(u=()=>e.value,v=xn(e)):Ki(e)?(u=()=>c(e),v=!0):Ot(e)?(_=!0,v=e.some(S=>Ki(S)||xn(S)),u=()=>e.map(S=>{if(Me(S))return S.value;if(Ki(S))return c(S);if(kt(S))return l?l(S,2):S()})):kt(e)?t?u=l?()=>l(e,2):e:u=()=>{if(h){Ji();try{h()}finally{ji()}}const S=cs;cs=f;try{return l?l(e,3,[d]):e(d)}finally{cs=S}}:u=_i,t&&r){const S=u,T=r===!0?1/0:r;u=()=>qi(S(),T)}const m=l0(),p=()=>{f.stop(),m&&m.active&&Ap(m.effects,f)};if(s&&t){const S=t;t=(...T)=>{S(...T),p()}}let x=_?new Array(e.length).fill(Sl):Sl;const b=S=>{if(!(!(f.flags&1)||!f.dirty&&!S))if(t){const T=f.run();if(r||v||(_?T.some((E,C)=>wr(E,x[C])):wr(T,x))){h&&h();const E=cs;cs=f;try{const C=[T,x===Sl?void 0:_&&x[0]===Sl?[]:x,d];x=T,l?l(t,3,C):t(...C)}finally{cs=E}}}else f.run()};return o&&o(b),f=new c0(u),f.scheduler=a?()=>a(b,!1):b,d=S=>XM(S,!1,f),h=f.onStop=()=>{const S=Nc.get(f);if(S){if(l)l(S,4);else for(const T of S)T();Nc.delete(f)}},t?i?b(!0):x=f.run():a?a(b.bind(null,!0),!0):f.run(),p.pause=f.pause.bind(f),p.resume=f.resume.bind(f),p.stop=p,p}function qi(e,t=1/0,n){if(t<=0||!fe(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,Me(e))qi(e.value,t,n);else if(Ot(e))for(let i=0;i<e.length;i++)qi(e[i],t,n);else if(Na(e)||da(e))e.forEach(i=>{qi(i,t,n)});else if(e0(e)){for(const i in e)qi(e[i],t,n);for(const i of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,i)&&qi(e[i],t,n)}return e}/**
* @vue/runtime-core v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function al(e,t,n,i){try{return i?e(...i):e()}catch(r){cu(r,t,n)}}function jn(e,t,n,i){if(kt(e)){const r=al(e,t,n,i);return r&&Qg(r)&&r.catch(s=>{cu(s,t,n)}),r}if(Ot(e)){const r=[];for(let s=0;s<e.length;s++)r.push(jn(e[s],t,n,i));return r}}function cu(e,t,n,i=!0){const r=t?t.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:a}=t&&t.appContext.config||de;if(t){let o=t.parent;const l=t.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;o;){const f=o.ec;if(f){for(let u=0;u<f.length;u++)if(f[u](e,l,c)===!1)return}o=o.parent}if(s){Ji(),al(s,null,10,[e,l,c]),ji();return}}YM(e,n,r,i,a)}function YM(e,t,n,i=!0,r=!1){if(r)throw e;console.error(e)}const Ke=[];let ui=-1;const pa=[];let mr=null,ia=0;const w0=Promise.resolve();let Fc=null;function Bp(e){const t=Fc||w0;return e?t.then(this?e.bind(this):e):t}function $M(e){let t=ui+1,n=Ke.length;for(;t<n;){const i=t+n>>>1,r=Ke[i],s=Vo(r);s<e||s===e&&r.flags&2?t=i+1:n=i}return t}function Hp(e){if(!(e.flags&1)){const t=Vo(e),n=Ke[Ke.length-1];!n||!(e.flags&2)&&t>=Vo(n)?Ke.push(e):Ke.splice($M(t),0,e),e.flags|=1,A0()}}function A0(){Fc||(Fc=w0.then(R0))}function KM(e){Ot(e)?pa.push(...e):mr&&e.id===-1?mr.splice(ia+1,0,e):e.flags&1||(pa.push(e),e.flags|=1),A0()}function $m(e,t,n=ui+1){for(;n<Ke.length;n++){const i=Ke[n];if(i&&i.flags&2){if(e&&i.id!==e.uid)continue;Ke.splice(n,1),n--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function C0(e){if(pa.length){const t=[...new Set(pa)].sort((n,i)=>Vo(n)-Vo(i));if(pa.length=0,mr){mr.push(...t);return}for(mr=t,ia=0;ia<mr.length;ia++){const n=mr[ia];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}mr=null,ia=0}}const Vo=e=>e.id==null?e.flags&2?-1:1/0:e.id;function R0(e){try{for(ui=0;ui<Ke.length;ui++){const t=Ke[ui];t&&!(t.flags&8)&&(t.flags&4&&(t.flags&=-2),al(t,t.i,t.i?15:14),t.flags&4||(t.flags&=-2))}}finally{for(;ui<Ke.length;ui++){const t=Ke[ui];t&&(t.flags&=-2)}ui=-1,Ke.length=0,C0(),Fc=null,(Ke.length||pa.length)&&R0()}}let Ie=null,P0=null;function Uc(e){const t=Ie;return Ie=e,P0=e&&e.type.__scopeId||null,t}function ZM(e,t=Ie,n){if(!t||e._n)return e;const i=(...r)=>{i._d&&Hc(-1);const s=Uc(t);let a;try{a=e(...r)}finally{Uc(s),i._d&&Hc(1)}return a};return i._n=!0,i._c=!0,i._d=!0,i}function AN(e,t){if(Ie===null)return e;const n=pu(Ie),i=e.dirs||(e.dirs=[]);for(let r=0;r<t.length;r++){let[s,a,o,l=de]=t[r];s&&(kt(s)&&(s={mounted:s,updated:s}),s.deep&&qi(a),i.push({dir:s,instance:n,value:a,oldValue:void 0,arg:o,modifiers:l}))}return e}function Fr(e,t,n,i){const r=e.dirs,s=t&&t.dirs;for(let a=0;a<r.length;a++){const o=r[a];s&&(o.oldValue=s[a].value);let l=o.dir[i];l&&(Ji(),jn(l,n,8,[e.el,o,e,t]),ji())}}function JM(e,t){if(Ve){let n=Ve.provides;const i=Ve.parent&&Ve.parent.provides;i===n&&(n=Ve.provides=Object.create(i)),n[e]=t}}function Mo(e,t,n=!1){const i=Wp();if(i||gs){let r=gs?gs._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&e in r)return r[e];if(arguments.length>1)return n&&kt(t)?t.call(i&&i.proxy):t}}function jM(){return!!(Wp()||gs)}const QM=Symbol.for("v-scx"),t1=()=>Mo(QM);function mc(e,t,n){return L0(e,t,n)}function L0(e,t,n=de){const{immediate:i,deep:r,flush:s,once:a}=n,o=Ae({},n),l=t&&i||!t&&s!=="post";let c;if(Xo){if(s==="sync"){const d=t1();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=_i,d.resume=_i,d.pause=_i,d}}const f=Ve;o.call=(d,v,_)=>jn(d,f,v,_);let u=!1;s==="post"?o.scheduler=d=>{Ye(d,f&&f.suspense)}:s!=="sync"&&(u=!0,o.scheduler=(d,v)=>{v?d():Hp(d)}),o.augmentJob=d=>{t&&(d.flags|=4),u&&(d.flags|=2,f&&(d.id=f.uid,d.i=f))};const h=qM(e,t,o);return Xo&&(c?c.push(h):l&&h()),h}function e1(e,t,n){const i=this.proxy,r=be(e)?e.includes(".")?D0(i,e):()=>i[e]:e.bind(i,i);let s;kt(t)?s=t:(s=t.handler,n=t);const a=ol(this),o=L0(r,s.bind(i),n);return a(),o}function D0(e,t){const n=t.split(".");return()=>{let i=e;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}const I0=Symbol("_vte"),N0=e=>e.__isTeleport,bo=e=>e&&(e.disabled||e.disabled===""),Km=e=>e&&(e.defer||e.defer===""),Zm=e=>typeof SVGElement!="undefined"&&e instanceof SVGElement,Jm=e=>typeof MathMLElement=="function"&&e instanceof MathMLElement,Td=(e,t)=>{const n=e&&e.to;return be(n)?t?t(n):null:n},F0={name:"Teleport",__isTeleport:!0,process(e,t,n,i,r,s,a,o,l,c){const{mc:f,pc:u,pbc:h,o:{insert:d,querySelector:v,createText:_,createComment:m}}=c,p=bo(t.props);let{shapeFlag:x,children:b,dynamicChildren:S}=t;if(e==null){const T=t.el=_(""),E=t.anchor=_("");d(T,n,i),d(E,n,i);const C=(g,M)=>{x&16&&f(b,g,M,r,s,a,o,l)},R=()=>{const g=t.target=Td(t.props,v),M=U0(g,t,_,d);g&&(a!=="svg"&&Zm(g)?a="svg":a!=="mathml"&&Jm(g)&&(a="mathml"),r&&r.isCE&&(r.ce._teleportTargets||(r.ce._teleportTargets=new Set)).add(g),p||(C(g,M),vc(t,!1)))};p&&(C(n,E),vc(t,!0)),Km(t.props)?(t.el.__isMounted=!1,Ye(()=>{R(),delete t.el.__isMounted},s)):R()}else{if(Km(t.props)&&e.el.__isMounted===!1){Ye(()=>{F0.process(e,t,n,i,r,s,a,o,l,c)},s);return}t.el=e.el,t.targetStart=e.targetStart;const T=t.anchor=e.anchor,E=t.target=e.target,C=t.targetAnchor=e.targetAnchor,R=bo(e.props),g=R?n:E,M=R?T:C;if(a==="svg"||Zm(E)?a="svg":(a==="mathml"||Jm(E))&&(a="mathml"),S?(h(e.dynamicChildren,S,g,r,s,a,o),Gp(e,t,!0)):l||u(e,t,g,M,r,s,a,o,!1),p)R?t.props&&e.props&&t.props.to!==e.props.to&&(t.props.to=e.props.to):Ml(t,n,T,c,1);else if((t.props&&t.props.to)!==(e.props&&e.props.to)){const P=t.target=Td(t.props,v);P&&Ml(t,P,null,c,0)}else R&&Ml(t,E,C,c,1);vc(t,p)}},remove(e,t,n,{um:i,o:{remove:r}},s){const{shapeFlag:a,children:o,anchor:l,targetStart:c,targetAnchor:f,target:u,props:h}=e;if(u&&(r(c),r(f)),s&&r(l),a&16){const d=s||!bo(h);for(let v=0;v<o.length;v++){const _=o[v];i(_,t,n,d,!!_.dynamicChildren)}}},move:Ml,hydrate:n1};function Ml(e,t,n,{o:{insert:i},m:r},s=2){s===0&&i(e.targetAnchor,t,n);const{el:a,anchor:o,shapeFlag:l,children:c,props:f}=e,u=s===2;if(u&&i(a,t,n),(!u||bo(f))&&l&16)for(let h=0;h<c.length;h++)r(c[h],t,n,2);u&&i(o,t,n)}function n1(e,t,n,i,r,s,{o:{nextSibling:a,parentNode:o,querySelector:l,insert:c,createText:f}},u){function h(_,m,p,x){m.anchor=u(a(_),m,o(_),n,i,r,s),m.targetStart=p,m.targetAnchor=x}const d=t.target=Td(t.props,l),v=bo(t.props);if(d){const _=d._lpa||d.firstChild;if(t.shapeFlag&16)if(v)h(e,t,_,_&&a(_));else{t.anchor=a(e);let m=_;for(;m;){if(m&&m.nodeType===8){if(m.data==="teleport start anchor")t.targetStart=m;else if(m.data==="teleport anchor"){t.targetAnchor=m,d._lpa=t.targetAnchor&&a(t.targetAnchor);break}}m=a(m)}t.targetAnchor||U0(d,t,f,c),u(_&&a(_),t,d,n,i,r,s)}vc(t,v)}else v&&t.shapeFlag&16&&h(e,t,e,a(e));return t.anchor&&a(t.anchor)}const CN=F0;function vc(e,t){const n=e.ctx;if(n&&n.ut){let i,r;for(t?(i=e.el,r=e.anchor):(i=e.targetStart,r=e.targetAnchor);i&&i!==r;)i.nodeType===1&&i.setAttribute("data-v-owner",n.uid),i=i.nextSibling;n.ut()}}function U0(e,t,n,i){const r=t.targetStart=n(""),s=t.targetAnchor=n("");return r[I0]=s,e&&(i(r,e),i(s,e)),s}const Wi=Symbol("_leaveCb"),bl=Symbol("_enterCb");function i1(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return W0(()=>{e.isMounted=!0}),X0(()=>{e.isUnmounting=!0}),e}const Mn=[Function,Array],O0={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:Mn,onEnter:Mn,onAfterEnter:Mn,onEnterCancelled:Mn,onBeforeLeave:Mn,onLeave:Mn,onAfterLeave:Mn,onLeaveCancelled:Mn,onBeforeAppear:Mn,onAppear:Mn,onAfterAppear:Mn,onAppearCancelled:Mn},B0=e=>{const t=e.subTree;return t.component?B0(t.component):t},r1={name:"BaseTransition",props:O0,setup(e,{slots:t}){const n=Wp(),i=i1();return()=>{const r=t.default&&V0(t.default(),!0);if(!r||!r.length)return;const s=H0(r),a=jt(e),{mode:o}=a;if(i.isLeaving)return Zu(s);const l=jm(s);if(!l)return Zu(s);let c=Ed(l,a,i,n,u=>c=u);l.type!==ze&&Go(l,c);let f=n.subTree&&jm(n.subTree);if(f&&f.type!==ze&&!us(f,l)&&B0(n).type!==ze){let u=Ed(f,a,i,n);if(Go(f,u),o==="out-in"&&l.type!==ze)return i.isLeaving=!0,u.afterLeave=()=>{i.isLeaving=!1,n.job.flags&8||n.update(),delete u.afterLeave,f=void 0},Zu(s);o==="in-out"&&l.type!==ze?u.delayLeave=(h,d,v)=>{const _=z0(i,f);_[String(f.key)]=f,h[Wi]=()=>{d(),h[Wi]=void 0,delete c.delayedLeave,f=void 0},c.delayedLeave=()=>{v(),delete c.delayedLeave,f=void 0}}:f=void 0}else f&&(f=void 0);return s}}};function H0(e){let t=e[0];if(e.length>1){for(const n of e)if(n.type!==ze){t=n;break}}return t}const s1=r1;function z0(e,t){const{leavingVNodes:n}=e;let i=n.get(t.type);return i||(i=Object.create(null),n.set(t.type,i)),i}function Ed(e,t,n,i,r){const{appear:s,mode:a,persisted:o=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:f,onEnterCancelled:u,onBeforeLeave:h,onLeave:d,onAfterLeave:v,onLeaveCancelled:_,onBeforeAppear:m,onAppear:p,onAfterAppear:x,onAppearCancelled:b}=t,S=String(e.key),T=z0(n,e),E=(g,M)=>{g&&jn(g,i,9,M)},C=(g,M)=>{const P=M[1];E(g,M),Ot(g)?g.every(I=>I.length<=1)&&P():g.length<=1&&P()},R={mode:a,persisted:o,beforeEnter(g){let M=l;if(!n.isMounted)if(s)M=m||l;else return;g[Wi]&&g[Wi](!0);const P=T[S];P&&us(e,P)&&P.el[Wi]&&P.el[Wi](),E(M,[g])},enter(g){let M=c,P=f,I=u;if(!n.isMounted)if(s)M=p||c,P=x||f,I=b||u;else return;let N=!1;const O=g[bl]=q=>{N||(N=!0,q?E(I,[g]):E(P,[g]),R.delayedLeave&&R.delayedLeave(),g[bl]=void 0)};M?C(M,[g,O]):O()},leave(g,M){const P=String(e.key);if(g[bl]&&g[bl](!0),n.isUnmounting)return M();E(h,[g]);let I=!1;const N=g[Wi]=O=>{I||(I=!0,M(),O?E(_,[g]):E(v,[g]),g[Wi]=void 0,T[P]===e&&delete T[P])};T[P]=e,d?C(d,[g,N]):N()},clone(g){const M=Ed(g,t,n,i,r);return r&&r(M),M}};return R}function Zu(e){if(fu(e))return e=Cr(e),e.children=null,e}function jm(e){if(!fu(e))return N0(e.type)&&e.children?H0(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&kt(n.default))return n.default()}}function Go(e,t){e.shapeFlag&6&&e.component?(e.transition=t,Go(e.component.subTree,t)):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function V0(e,t=!1,n){let i=[],r=0;for(let s=0;s<e.length;s++){let a=e[s];const o=n==null?a.key:String(n)+String(a.key!=null?a.key:s);a.type===rn?(a.patchFlag&128&&r++,i=i.concat(V0(a.children,t,o))):(t||a.type!==ze)&&i.push(o!=null?Cr(a,{key:o}):a)}if(r>1)for(let s=0;s<i.length;s++)i[s].patchFlag=-2;return i}function RN(e,t){return kt(e)?Ae({name:e.name},t,{setup:e}):e}function G0(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}const Oc=new WeakMap;function To(e,t,n,i,r=!1){if(Ot(e)){e.forEach((v,_)=>To(v,t&&(Ot(t)?t[_]:t),n,i,r));return}if(ma(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&To(e,t,n,i.component.subTree);return}const s=i.shapeFlag&4?pu(i.component):i.el,a=r?null:s,{i:o,r:l}=e,c=t&&t.r,f=o.refs===de?o.refs={}:o.refs,u=o.setupState,h=jt(u),d=u===de?jg:v=>ie(h,v);if(c!=null&&c!==l){if(Qm(t),be(c))f[c]=null,d(c)&&(u[c]=null);else if(Me(c)){c.value=null;const v=t;v.k&&(f[v.k]=null)}}if(kt(l))al(l,o,12,[a,f]);else{const v=be(l),_=Me(l);if(v||_){const m=()=>{if(e.f){const p=v?d(l)?u[l]:f[l]:l.value;if(r)Ot(p)&&Ap(p,s);else if(Ot(p))p.includes(s)||p.push(s);else if(v)f[l]=[s],d(l)&&(u[l]=f[l]);else{const x=[s];l.value=x,e.k&&(f[e.k]=x)}}else v?(f[l]=a,d(l)&&(u[l]=a)):_&&(l.value=a,e.k&&(f[e.k]=a))};if(a){const p=()=>{m(),Oc.delete(e)};p.id=-1,Oc.set(e,p),Ye(p,n)}else Qm(e),m()}}}function Qm(e){const t=Oc.get(e);t&&(t.flags|=8,Oc.delete(e))}su().requestIdleCallback;su().cancelIdleCallback;const ma=e=>!!e.type.__asyncLoader,fu=e=>e.type.__isKeepAlive;function a1(e,t){k0(e,"a",t)}function o1(e,t){k0(e,"da",t)}function k0(e,t,n=Ve){const i=e.__wdc||(e.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return e()});if(uu(t,i,n),n){let r=n.parent;for(;r&&r.parent;)fu(r.parent.vnode)&&l1(i,t,n,r),r=r.parent}}function l1(e,t,n,i){const r=uu(t,e,i,!0);q0(()=>{Ap(i[t],r)},n)}function uu(e,t,n=Ve,i=!1){if(n){const r=n[e]||(n[e]=[]),s=t.__weh||(t.__weh=(...a)=>{Ji();const o=ol(n),l=jn(t,n,e,a);return o(),ji(),l});return i?r.unshift(s):r.push(s),s}}const nr=e=>(t,n=Ve)=>{(!Xo||e==="sp")&&uu(e,(...i)=>t(...i),n)},c1=nr("bm"),W0=nr("m"),f1=nr("bu"),u1=nr("u"),X0=nr("bum"),q0=nr("um"),h1=nr("sp"),d1=nr("rtg"),p1=nr("rtc");function m1(e,t=Ve){uu("ec",e,t)}const v1="components";function PN(e,t){return g1(v1,e,!0,t)||e}const _1=Symbol.for("v-ndc");function g1(e,t,n=!0,i=!1){const r=Ie||Ve;if(r){const s=r.type;{const o=ib(s,!1);if(o&&(o===t||o===Nn(t)||o===iu(Nn(t))))return s}const a=tv(r[e]||s[e],t)||tv(r.appContext[e],t);return!a&&i?s:a}}function tv(e,t){return e&&(e[t]||e[Nn(t)]||e[iu(Nn(t))])}function LN(e,t,n,i){let r;const s=n,a=Ot(e);if(a||be(e)){const o=a&&Ki(e);let l=!1,c=!1;o&&(l=!xn(e),c=Qi(e),e=au(e)),r=new Array(e.length);for(let f=0,u=e.length;f<u;f++)r[f]=t(l?c?Sa(Jn(e[f])):Jn(e[f]):e[f],f,void 0,s)}else if(typeof e=="number"){r=new Array(e);for(let o=0;o<e;o++)r[o]=t(o+1,o,void 0,s)}else if(fe(e))if(e[Symbol.iterator])r=Array.from(e,(o,l)=>t(o,l,void 0,s));else{const o=Object.keys(e);r=new Array(o.length);for(let l=0,c=o.length;l<c;l++){const f=o[l];r[l]=t(e[f],f,l,s)}}else r=[];return r}function DN(e,t,n={},i,r){if(Ie.ce||Ie.parent&&ma(Ie.parent)&&Ie.parent.ce){const c=Object.keys(n).length>0;return t!=="default"&&(n.name=t),Pd(),Ld(rn,null,[Je("slot",n,i&&i())],c?-2:64)}let s=e[t];s&&s._c&&(s._d=!1),Pd();const a=s&&Y0(s(n)),o=n.key||a&&a.key,l=Ld(rn,{key:(o&&!Zn(o)?o:`_${t}`)+(!a&&i?"_fb":"")},a||(i?i():[]),a&&e._===1?64:-2);return s&&s._c&&(s._d=!0),l}function Y0(e){return e.some(t=>Wo(t)?!(t.type===ze||t.type===rn&&!Y0(t.children)):!0)?e:null}const wd=e=>e?hx(e)?pu(e):wd(e.parent):null,Eo=Ae(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>wd(e.parent),$root:e=>wd(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>K0(e),$forceUpdate:e=>e.f||(e.f=()=>{Hp(e.update)}),$nextTick:e=>e.n||(e.n=Bp.bind(e.proxy)),$watch:e=>e1.bind(e)}),Ju=(e,t)=>e!==de&&!e.__isScriptSetup&&ie(e,t),x1={get({_:e},t){if(t==="__v_skip")return!0;const{ctx:n,setupState:i,data:r,props:s,accessCache:a,type:o,appContext:l}=e;if(t[0]!=="$"){const h=a[t];if(h!==void 0)switch(h){case 1:return i[t];case 2:return r[t];case 4:return n[t];case 3:return s[t]}else{if(Ju(i,t))return a[t]=1,i[t];if(r!==de&&ie(r,t))return a[t]=2,r[t];if(ie(s,t))return a[t]=3,s[t];if(n!==de&&ie(n,t))return a[t]=4,n[t];Ad&&(a[t]=0)}}const c=Eo[t];let f,u;if(c)return t==="$attrs"&&He(e.attrs,"get",""),c(e);if((f=o.__cssModules)&&(f=f[t]))return f;if(n!==de&&ie(n,t))return a[t]=4,n[t];if(u=l.config.globalProperties,ie(u,t))return u[t]},set({_:e},t,n){const{data:i,setupState:r,ctx:s}=e;return Ju(r,t)?(r[t]=n,!0):i!==de&&ie(i,t)?(i[t]=n,!0):ie(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(s[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:i,appContext:r,props:s,type:a}},o){let l;return!!(n[o]||e!==de&&o[0]!=="$"&&ie(e,o)||Ju(t,o)||ie(s,o)||ie(i,o)||ie(Eo,o)||ie(r.config.globalProperties,o)||(l=a.__cssModules)&&l[o])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:ie(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function ev(e){return Ot(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let Ad=!0;function y1(e){const t=K0(e),n=e.proxy,i=e.ctx;Ad=!1,t.beforeCreate&&nv(t.beforeCreate,e,"bc");const{data:r,computed:s,methods:a,watch:o,provide:l,inject:c,created:f,beforeMount:u,mounted:h,beforeUpdate:d,updated:v,activated:_,deactivated:m,beforeDestroy:p,beforeUnmount:x,destroyed:b,unmounted:S,render:T,renderTracked:E,renderTriggered:C,errorCaptured:R,serverPrefetch:g,expose:M,inheritAttrs:P,components:I,directives:N,filters:O}=t;if(c&&S1(c,i,null),a)for(const H in a){const K=a[H];kt(K)&&(i[H]=K.bind(n))}if(r){const H=r.call(n,n);fe(H)&&(e.data=ou(H))}if(Ad=!0,s)for(const H in s){const K=s[H],dt=kt(K)?K.bind(n,n):kt(K.get)?K.get.bind(n,n):_i,ct=!kt(K)&&kt(K.set)?K.set.bind(n):_i,ht=px({get:dt,set:ct});Object.defineProperty(i,H,{enumerable:!0,configurable:!0,get:()=>ht.value,set:Rt=>ht.value=Rt})}if(o)for(const H in o)$0(o[H],i,n,H);if(l){const H=kt(l)?l.call(n):l;Reflect.ownKeys(H).forEach(K=>{JM(K,H[K])})}f&&nv(f,e,"c");function V(H,K){Ot(K)?K.forEach(dt=>H(dt.bind(n))):K&&H(K.bind(n))}if(V(c1,u),V(W0,h),V(f1,d),V(u1,v),V(a1,_),V(o1,m),V(m1,R),V(p1,E),V(d1,C),V(X0,x),V(q0,S),V(h1,g),Ot(M))if(M.length){const H=e.exposed||(e.exposed={});M.forEach(K=>{Object.defineProperty(H,K,{get:()=>n[K],set:dt=>n[K]=dt,enumerable:!0})})}else e.exposed||(e.exposed={});T&&e.render===_i&&(e.render=T),P!=null&&(e.inheritAttrs=P),I&&(e.components=I),N&&(e.directives=N),g&&G0(e)}function S1(e,t,n=_i){Ot(e)&&(e=Cd(e));for(const i in e){const r=e[i];let s;fe(r)?"default"in r?s=Mo(r.from||i,r.default,!0):s=Mo(r.from||i):s=Mo(r),Me(s)?Object.defineProperty(t,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:a=>s.value=a}):t[i]=s}}function nv(e,t,n){jn(Ot(e)?e.map(i=>i.bind(t.proxy)):e.bind(t.proxy),t,n)}function $0(e,t,n,i){let r=i.includes(".")?D0(n,i):()=>n[i];if(be(e)){const s=t[e];kt(s)&&mc(r,s)}else if(kt(e))mc(r,e.bind(n));else if(fe(e))if(Ot(e))e.forEach(s=>$0(s,t,n,i));else{const s=kt(e.handler)?e.handler.bind(n):t[e.handler];kt(s)&&mc(r,s,e)}}function K0(e){const t=e.type,{mixins:n,extends:i}=t,{mixins:r,optionsCache:s,config:{optionMergeStrategies:a}}=e.appContext,o=s.get(t);let l;return o?l=o:!r.length&&!n&&!i?l=t:(l={},r.length&&r.forEach(c=>Bc(l,c,a,!0)),Bc(l,t,a)),fe(t)&&s.set(t,l),l}function Bc(e,t,n,i=!1){const{mixins:r,extends:s}=t;s&&Bc(e,s,n,!0),r&&r.forEach(a=>Bc(e,a,n,!0));for(const a in t)if(!(i&&a==="expose")){const o=M1[a]||n&&n[a];e[a]=o?o(e[a],t[a]):t[a]}return e}const M1={data:iv,props:rv,emits:rv,methods:so,computed:so,beforeCreate:Xe,created:Xe,beforeMount:Xe,mounted:Xe,beforeUpdate:Xe,updated:Xe,beforeDestroy:Xe,beforeUnmount:Xe,destroyed:Xe,unmounted:Xe,activated:Xe,deactivated:Xe,errorCaptured:Xe,serverPrefetch:Xe,components:so,directives:so,watch:T1,provide:iv,inject:b1};function iv(e,t){return t?e?function(){return Ae(kt(e)?e.call(this,this):e,kt(t)?t.call(this,this):t)}:t:e}function b1(e,t){return so(Cd(e),Cd(t))}function Cd(e){if(Ot(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Xe(e,t){return e?[...new Set([].concat(e,t))]:t}function so(e,t){return e?Ae(Object.create(null),e,t):t}function rv(e,t){return e?Ot(e)&&Ot(t)?[...new Set([...e,...t])]:Ae(Object.create(null),ev(e),ev(t!=null?t:{})):t}function T1(e,t){if(!e)return t;if(!t)return e;const n=Ae(Object.create(null),e);for(const i in t)n[i]=Xe(e[i],t[i]);return n}function Z0(){return{app:null,config:{isNativeTag:jg,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let E1=0;function w1(e,t){return function(i,r=null){kt(i)||(i=Ae({},i)),r!=null&&!fe(r)&&(r=null);const s=Z0(),a=new WeakSet,o=[];let l=!1;const c=s.app={_uid:E1++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:ab,get config(){return s.config},set config(f){},use(f,...u){return a.has(f)||(f&&kt(f.install)?(a.add(f),f.install(c,...u)):kt(f)&&(a.add(f),f(c,...u))),c},mixin(f){return s.mixins.includes(f)||s.mixins.push(f),c},component(f,u){return u?(s.components[f]=u,c):s.components[f]},directive(f,u){return u?(s.directives[f]=u,c):s.directives[f]},mount(f,u,h){if(!l){const d=c._ceVNode||Je(i,r);return d.appContext=s,h===!0?h="svg":h===!1&&(h=void 0),e(d,f,h),l=!0,c._container=f,f.__vue_app__=c,pu(d.component)}},onUnmount(f){o.push(f)},unmount(){l&&(jn(o,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(f,u){return s.provides[f]=u,c},runWithContext(f){const u=gs;gs=c;try{return f()}finally{gs=u}}};return c}}let gs=null;const A1=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${Nn(t)}Modifiers`]||e[`${Dr(t)}Modifiers`];function C1(e,t,...n){if(e.isUnmounted)return;const i=e.vnode.props||de;let r=n;const s=t.startsWith("update:"),a=s&&A1(i,t.slice(7));a&&(a.trim&&(r=n.map(f=>be(f)?f.trim():f)),a.number&&(r=n.map(ru)));let o,l=i[o=Xu(t)]||i[o=Xu(Nn(t))];!l&&s&&(l=i[o=Xu(Dr(t))]),l&&jn(l,e,6,r);const c=i[o+"Once"];if(c){if(!e.emitted)e.emitted={};else if(e.emitted[o])return;e.emitted[o]=!0,jn(c,e,6,r)}}const R1=new WeakMap;function J0(e,t,n=!1){const i=n?R1:t.emitsCache,r=i.get(e);if(r!==void 0)return r;const s=e.emits;let a={},o=!1;if(!kt(e)){const l=c=>{const f=J0(c,t,!0);f&&(o=!0,Ae(a,f))};!n&&t.mixins.length&&t.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!s&&!o?(fe(e)&&i.set(e,null),null):(Ot(s)?s.forEach(l=>a[l]=null):Ae(a,s),fe(e)&&i.set(e,a),a)}function hu(e,t){return!e||!tu(t)?!1:(t=t.slice(2).replace(/Once$/,""),ie(e,t[0].toLowerCase()+t.slice(1))||ie(e,Dr(t))||ie(e,t))}function sv(e){const{type:t,vnode:n,proxy:i,withProxy:r,propsOptions:[s],slots:a,attrs:o,emit:l,render:c,renderCache:f,props:u,data:h,setupState:d,ctx:v,inheritAttrs:_}=e,m=Uc(e);let p,x;try{if(n.shapeFlag&4){const S=r||i,T=S;p=hi(c.call(T,S,f,u,d,h,v)),x=o}else{const S=t;p=hi(S.length>1?S(u,{attrs:o,slots:a,emit:l}):S(u,null)),x=t.props?o:P1(o)}}catch(S){wo.length=0,cu(S,e,1),p=Je(ze)}let b=p;if(x&&_!==!1){const S=Object.keys(x),{shapeFlag:T}=b;S.length&&T&7&&(s&&S.some(wp)&&(x=L1(x,s)),b=Cr(b,x,!1,!0))}return n.dirs&&(b=Cr(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Go(b,n.transition),p=b,Uc(m),p}const P1=e=>{let t;for(const n in e)(n==="class"||n==="style"||tu(n))&&((t||(t={}))[n]=e[n]);return t},L1=(e,t)=>{const n={};for(const i in e)(!wp(i)||!(i.slice(9)in t))&&(n[i]=e[i]);return n};function D1(e,t,n){const{props:i,children:r,component:s}=e,{props:a,children:o,patchFlag:l}=t,c=s.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?av(i,a,c):!!a;if(l&8){const f=t.dynamicProps;for(let u=0;u<f.length;u++){const h=f[u];if(a[h]!==i[h]&&!hu(c,h))return!0}}}else return(r||o)&&(!o||!o.$stable)?!0:i===a?!1:i?a?av(i,a,c):!0:!!a;return!1}function av(e,t,n){const i=Object.keys(t);if(i.length!==Object.keys(e).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(t[s]!==e[s]&&!hu(n,s))return!0}return!1}function I1({vnode:e,parent:t},n){for(;t;){const i=t.subTree;if(i.suspense&&i.suspense.activeBranch===e&&(i.el=e.el),i===e)(e=t.vnode).el=n,t=t.parent;else break}}const j0={},Q0=()=>Object.create(j0),tx=e=>Object.getPrototypeOf(e)===j0;function N1(e,t,n,i=!1){const r={},s=Q0();e.propsDefaults=Object.create(null),ex(e,t,r,s);for(const a in e.propsOptions[0])a in r||(r[a]=void 0);n?e.props=i?r:UM(r):e.type.props?e.props=r:e.props=s,e.attrs=s}function F1(e,t,n,i){const{props:r,attrs:s,vnode:{patchFlag:a}}=e,o=jt(r),[l]=e.propsOptions;let c=!1;if((i||a>0)&&!(a&16)){if(a&8){const f=e.vnode.dynamicProps;for(let u=0;u<f.length;u++){let h=f[u];if(hu(e.emitsOptions,h))continue;const d=t[h];if(l)if(ie(s,h))d!==s[h]&&(s[h]=d,c=!0);else{const v=Nn(h);r[v]=Rd(l,o,v,d,e,!1)}else d!==s[h]&&(s[h]=d,c=!0)}}}else{ex(e,t,r,s)&&(c=!0);let f;for(const u in o)(!t||!ie(t,u)&&((f=Dr(u))===u||!ie(t,f)))&&(l?n&&(n[u]!==void 0||n[f]!==void 0)&&(r[u]=Rd(l,o,u,void 0,e,!0)):delete r[u]);if(s!==o)for(const u in s)(!t||!ie(t,u))&&(delete s[u],c=!0)}c&&Xi(e.attrs,"set","")}function ex(e,t,n,i){const[r,s]=e.propsOptions;let a=!1,o;if(t)for(let l in t){if(xo(l))continue;const c=t[l];let f;r&&ie(r,f=Nn(l))?!s||!s.includes(f)?n[f]=c:(o||(o={}))[f]=c:hu(e.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,a=!0)}if(s){const l=jt(n),c=o||de;for(let f=0;f<s.length;f++){const u=s[f];n[u]=Rd(r,l,u,c[u],e,!ie(c,u))}}return a}function Rd(e,t,n,i,r,s){const a=e[n];if(a!=null){const o=ie(a,"default");if(o&&i===void 0){const l=a.default;if(a.type!==Function&&!a.skipFactory&&kt(l)){const{propsDefaults:c}=r;if(n in c)i=c[n];else{const f=ol(r);i=c[n]=l.call(null,t),f()}}else i=l;r.ce&&r.ce._setProp(n,i)}a[0]&&(s&&!o?i=!1:a[1]&&(i===""||i===Dr(n))&&(i=!0))}return i}const U1=new WeakMap;function nx(e,t,n=!1){const i=n?U1:t.propsCache,r=i.get(e);if(r)return r;const s=e.props,a={},o=[];let l=!1;if(!kt(e)){const f=u=>{l=!0;const[h,d]=nx(u,t,!0);Ae(a,h),d&&o.push(...d)};!n&&t.mixins.length&&t.mixins.forEach(f),e.extends&&f(e.extends),e.mixins&&e.mixins.forEach(f)}if(!s&&!l)return fe(e)&&i.set(e,ha),ha;if(Ot(s))for(let f=0;f<s.length;f++){const u=Nn(s[f]);ov(u)&&(a[u]=de)}else if(s)for(const f in s){const u=Nn(f);if(ov(u)){const h=s[f],d=a[u]=Ot(h)||kt(h)?{type:h}:Ae({},h),v=d.type;let _=!1,m=!0;if(Ot(v))for(let p=0;p<v.length;++p){const x=v[p],b=kt(x)&&x.name;if(b==="Boolean"){_=!0;break}else b==="String"&&(m=!1)}else _=kt(v)&&v.name==="Boolean";d[0]=_,d[1]=m,(_||ie(d,"default"))&&o.push(u)}}const c=[a,o];return fe(e)&&i.set(e,c),c}function ov(e){return e[0]!=="$"&&!xo(e)}const zp=e=>e==="_"||e==="_ctx"||e==="$stable",Vp=e=>Ot(e)?e.map(hi):[hi(e)],O1=(e,t,n)=>{if(t._n)return t;const i=ZM((...r)=>Vp(t(...r)),n);return i._c=!1,i},ix=(e,t,n)=>{const i=e._ctx;for(const r in e){if(zp(r))continue;const s=e[r];if(kt(s))t[r]=O1(r,s,i);else if(s!=null){const a=Vp(s);t[r]=()=>a}}},rx=(e,t)=>{const n=Vp(t);e.slots.default=()=>n},sx=(e,t,n)=>{for(const i in t)(n||!zp(i))&&(e[i]=t[i])},B1=(e,t,n)=>{const i=e.slots=Q0();if(e.vnode.shapeFlag&32){const r=t._;r?(sx(i,t,n),n&&n0(i,"_",r,!0)):ix(t,i)}else t&&rx(e,t)},H1=(e,t,n)=>{const{vnode:i,slots:r}=e;let s=!0,a=de;if(i.shapeFlag&32){const o=t._;o?n&&o===1?s=!1:sx(r,t,n):(s=!t.$stable,ix(t,r)),a=t}else t&&(rx(e,t),a={default:1});if(s)for(const o in r)!zp(o)&&a[o]==null&&delete r[o]},Ye=W1;function z1(e){return V1(e)}function V1(e,t){const n=su();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:a,createText:o,createComment:l,setText:c,setElementText:f,parentNode:u,nextSibling:h,setScopeId:d=_i,insertStaticContent:v}=e,_=(D,U,G,et=null,J=null,nt=null,L=void 0,ot=null,rt=!!U.dynamicChildren)=>{if(D===U)return;D&&!us(D,U)&&(et=it(D),Rt(D,J,nt,!0),D=null),U.patchFlag===-2&&(rt=!1,U.dynamicChildren=null);const{type:tt,ref:st,shapeFlag:w}=U;switch(tt){case du:m(D,U,G,et);break;case ze:p(D,U,G,et);break;case _c:D==null&&x(U,G,et,L);break;case rn:I(D,U,G,et,J,nt,L,ot,rt);break;default:w&1?T(D,U,G,et,J,nt,L,ot,rt):w&6?N(D,U,G,et,J,nt,L,ot,rt):(w&64||w&128)&&tt.process(D,U,G,et,J,nt,L,ot,rt,mt)}st!=null&&J?To(st,D&&D.ref,nt,U||D,!U):st==null&&D&&D.ref!=null&&To(D.ref,null,nt,D,!0)},m=(D,U,G,et)=>{if(D==null)i(U.el=o(U.children),G,et);else{const J=U.el=D.el;U.children!==D.children&&c(J,U.children)}},p=(D,U,G,et)=>{D==null?i(U.el=l(U.children||""),G,et):U.el=D.el},x=(D,U,G,et)=>{[D.el,D.anchor]=v(D.children,U,G,et,D.el,D.anchor)},b=({el:D,anchor:U},G,et)=>{let J;for(;D&&D!==U;)J=h(D),i(D,G,et),D=J;i(U,G,et)},S=({el:D,anchor:U})=>{let G;for(;D&&D!==U;)G=h(D),r(D),D=G;r(U)},T=(D,U,G,et,J,nt,L,ot,rt)=>{if(U.type==="svg"?L="svg":U.type==="math"&&(L="mathml"),D==null)E(U,G,et,J,nt,L,ot,rt);else{const tt=D.el&&D.el._isVueCE?D.el:null;try{tt&&tt._beginPatch(),g(D,U,J,nt,L,ot,rt)}finally{tt&&tt._endPatch()}}},E=(D,U,G,et,J,nt,L,ot)=>{let rt,tt;const{props:st,shapeFlag:w,transition:y,dirs:F}=D;if(rt=D.el=a(D.type,nt,st&&st.is,st),w&8?f(rt,D.children):w&16&&R(D.children,rt,null,et,J,ju(D,nt),L,ot),F&&Fr(D,null,et,"created"),C(rt,D,D.scopeId,L,et),st){for(const j in st)j!=="value"&&!xo(j)&&s(rt,j,null,st[j],nt,et);"value"in st&&s(rt,"value",null,st.value,nt),(tt=st.onVnodeBeforeMount)&&ri(tt,et,D)}F&&Fr(D,null,et,"beforeMount");const X=G1(J,y);X&&y.beforeEnter(rt),i(rt,U,G),((tt=st&&st.onVnodeMounted)||X||F)&&Ye(()=>{tt&&ri(tt,et,D),X&&y.enter(rt),F&&Fr(D,null,et,"mounted")},J)},C=(D,U,G,et,J)=>{if(G&&d(D,G),et)for(let nt=0;nt<et.length;nt++)d(D,et[nt]);if(J){let nt=J.subTree;if(U===nt||lx(nt.type)&&(nt.ssContent===U||nt.ssFallback===U)){const L=J.vnode;C(D,L,L.scopeId,L.slotScopeIds,J.parent)}}},R=(D,U,G,et,J,nt,L,ot,rt=0)=>{for(let tt=rt;tt<D.length;tt++){const st=D[tt]=ot?vr(D[tt]):hi(D[tt]);_(null,st,U,G,et,J,nt,L,ot)}},g=(D,U,G,et,J,nt,L)=>{const ot=U.el=D.el;let{patchFlag:rt,dynamicChildren:tt,dirs:st}=U;rt|=D.patchFlag&16;const w=D.props||de,y=U.props||de;let F;if(G&&Ur(G,!1),(F=y.onVnodeBeforeUpdate)&&ri(F,G,U,D),st&&Fr(U,D,G,"beforeUpdate"),G&&Ur(G,!0),(w.innerHTML&&y.innerHTML==null||w.textContent&&y.textContent==null)&&f(ot,""),tt?M(D.dynamicChildren,tt,ot,G,et,ju(U,J),nt):L||K(D,U,ot,null,G,et,ju(U,J),nt,!1),rt>0){if(rt&16)P(ot,w,y,G,J);else if(rt&2&&w.class!==y.class&&s(ot,"class",null,y.class,J),rt&4&&s(ot,"style",w.style,y.style,J),rt&8){const X=U.dynamicProps;for(let j=0;j<X.length;j++){const W=X[j],Tt=w[W],ft=y[W];(ft!==Tt||W==="value")&&s(ot,W,Tt,ft,J,G)}}rt&1&&D.children!==U.children&&f(ot,U.children)}else!L&&tt==null&&P(ot,w,y,G,J);((F=y.onVnodeUpdated)||st)&&Ye(()=>{F&&ri(F,G,U,D),st&&Fr(U,D,G,"updated")},et)},M=(D,U,G,et,J,nt,L)=>{for(let ot=0;ot<U.length;ot++){const rt=D[ot],tt=U[ot],st=rt.el&&(rt.type===rn||!us(rt,tt)||rt.shapeFlag&198)?u(rt.el):G;_(rt,tt,st,null,et,J,nt,L,!0)}},P=(D,U,G,et,J)=>{if(U!==G){if(U!==de)for(const nt in U)!xo(nt)&&!(nt in G)&&s(D,nt,U[nt],null,J,et);for(const nt in G){if(xo(nt))continue;const L=G[nt],ot=U[nt];L!==ot&&nt!=="value"&&s(D,nt,ot,L,J,et)}"value"in G&&s(D,"value",U.value,G.value,J)}},I=(D,U,G,et,J,nt,L,ot,rt)=>{const tt=U.el=D?D.el:o(""),st=U.anchor=D?D.anchor:o("");let{patchFlag:w,dynamicChildren:y,slotScopeIds:F}=U;F&&(ot=ot?ot.concat(F):F),D==null?(i(tt,G,et),i(st,G,et),R(U.children||[],G,st,J,nt,L,ot,rt)):w>0&&w&64&&y&&D.dynamicChildren&&D.dynamicChildren.length===y.length?(M(D.dynamicChildren,y,G,J,nt,L,ot),(U.key!=null||J&&U===J.subTree)&&Gp(D,U,!0)):K(D,U,G,st,J,nt,L,ot,rt)},N=(D,U,G,et,J,nt,L,ot,rt)=>{U.slotScopeIds=ot,D==null?U.shapeFlag&512?J.ctx.activate(U,G,et,L,rt):O(U,G,et,J,nt,L,rt):q(D,U,rt)},O=(D,U,G,et,J,nt,L)=>{const ot=D.component=j1(D,et,J);if(fu(D)&&(ot.ctx.renderer=mt),Q1(ot,!1,L),ot.asyncDep){if(J&&J.registerDep(ot,V,L),!D.el){const rt=ot.subTree=Je(ze);p(null,rt,U,G),D.placeholder=rt.el}}else V(ot,D,U,G,J,nt,L)},q=(D,U,G)=>{const et=U.component=D.component;if(D1(D,U,G))if(et.asyncDep&&!et.asyncResolved){H(et,U,G);return}else et.next=U,et.update();else U.el=D.el,et.vnode=U},V=(D,U,G,et,J,nt,L)=>{const ot=()=>{if(D.isMounted){let{next:w,bu:y,u:F,parent:X,vnode:j}=D;{const Nt=ax(D);if(Nt){w&&(w.el=j.el,H(D,w,L)),Nt.asyncDep.then(()=>{D.isUnmounted||ot()});return}}let W=w,Tt;Ur(D,!1),w?(w.el=j.el,H(D,w,L)):w=j,y&&pc(y),(Tt=w.props&&w.props.onVnodeBeforeUpdate)&&ri(Tt,X,w,j),Ur(D,!0);const ft=sv(D),At=D.subTree;D.subTree=ft,_(At,ft,u(At.el),it(At),D,J,nt),w.el=ft.el,W===null&&I1(D,ft.el),F&&Ye(F,J),(Tt=w.props&&w.props.onVnodeUpdated)&&Ye(()=>ri(Tt,X,w,j),J)}else{let w;const{el:y,props:F}=U,{bm:X,m:j,parent:W,root:Tt,type:ft}=D,At=ma(U);Ur(D,!1),X&&pc(X),!At&&(w=F&&F.onVnodeBeforeMount)&&ri(w,W,U),Ur(D,!0);{Tt.ce&&Tt.ce._def.shadowRoot!==!1&&Tt.ce._injectChildStyle(ft);const Nt=D.subTree=sv(D);_(null,Nt,G,et,D,J,nt),U.el=Nt.el}if(j&&Ye(j,J),!At&&(w=F&&F.onVnodeMounted)){const Nt=U;Ye(()=>ri(w,W,Nt),J)}(U.shapeFlag&256||W&&ma(W.vnode)&&W.vnode.shapeFlag&256)&&D.a&&Ye(D.a,J),D.isMounted=!0,U=G=et=null}};D.scope.on();const rt=D.effect=new c0(ot);D.scope.off();const tt=D.update=rt.run.bind(rt),st=D.job=rt.runIfDirty.bind(rt);st.i=D,st.id=D.uid,rt.scheduler=()=>Hp(st),Ur(D,!0),tt()},H=(D,U,G)=>{U.component=D;const et=D.vnode.props;D.vnode=U,D.next=null,F1(D,U.props,et,G),H1(D,U.children,G),Ji(),$m(D),ji()},K=(D,U,G,et,J,nt,L,ot,rt=!1)=>{const tt=D&&D.children,st=D?D.shapeFlag:0,w=U.children,{patchFlag:y,shapeFlag:F}=U;if(y>0){if(y&128){ct(tt,w,G,et,J,nt,L,ot,rt);return}else if(y&256){dt(tt,w,G,et,J,nt,L,ot,rt);return}}F&8?(st&16&&Q(tt,J,nt),w!==tt&&f(G,w)):st&16?F&16?ct(tt,w,G,et,J,nt,L,ot,rt):Q(tt,J,nt,!0):(st&8&&f(G,""),F&16&&R(w,G,et,J,nt,L,ot,rt))},dt=(D,U,G,et,J,nt,L,ot,rt)=>{D=D||ha,U=U||ha;const tt=D.length,st=U.length,w=Math.min(tt,st);let y;for(y=0;y<w;y++){const F=U[y]=rt?vr(U[y]):hi(U[y]);_(D[y],F,G,null,J,nt,L,ot,rt)}tt>st?Q(D,J,nt,!0,!1,w):R(U,G,et,J,nt,L,ot,rt,w)},ct=(D,U,G,et,J,nt,L,ot,rt)=>{let tt=0;const st=U.length;let w=D.length-1,y=st-1;for(;tt<=w&&tt<=y;){const F=D[tt],X=U[tt]=rt?vr(U[tt]):hi(U[tt]);if(us(F,X))_(F,X,G,null,J,nt,L,ot,rt);else break;tt++}for(;tt<=w&&tt<=y;){const F=D[w],X=U[y]=rt?vr(U[y]):hi(U[y]);if(us(F,X))_(F,X,G,null,J,nt,L,ot,rt);else break;w--,y--}if(tt>w){if(tt<=y){const F=y+1,X=F<st?U[F].el:et;for(;tt<=y;)_(null,U[tt]=rt?vr(U[tt]):hi(U[tt]),G,X,J,nt,L,ot,rt),tt++}}else if(tt>y)for(;tt<=w;)Rt(D[tt],J,nt,!0),tt++;else{const F=tt,X=tt,j=new Map;for(tt=X;tt<=y;tt++){const xt=U[tt]=rt?vr(U[tt]):hi(U[tt]);xt.key!=null&&j.set(xt.key,tt)}let W,Tt=0;const ft=y-X+1;let At=!1,Nt=0;const lt=new Array(ft);for(tt=0;tt<ft;tt++)lt[tt]=0;for(tt=F;tt<=w;tt++){const xt=D[tt];if(Tt>=ft){Rt(xt,J,nt,!0);continue}let Ct;if(xt.key!=null)Ct=j.get(xt.key);else for(W=X;W<=y;W++)if(lt[W-X]===0&&us(xt,U[W])){Ct=W;break}Ct===void 0?Rt(xt,J,nt,!0):(lt[Ct-X]=tt+1,Ct>=Nt?Nt=Ct:At=!0,_(xt,U[Ct],G,null,J,nt,L,ot,rt),Tt++)}const _t=At?k1(lt):ha;for(W=_t.length-1,tt=ft-1;tt>=0;tt--){const xt=X+tt,Ct=U[xt],vt=U[xt+1],Wt=xt+1<st?vt.el||ox(vt):et;lt[tt]===0?_(null,Ct,G,Wt,J,nt,L,ot,rt):At&&(W<0||tt!==_t[W]?ht(Ct,G,Wt,2):W--)}}},ht=(D,U,G,et,J=null)=>{const{el:nt,type:L,transition:ot,children:rt,shapeFlag:tt}=D;if(tt&6){ht(D.component.subTree,U,G,et);return}if(tt&128){D.suspense.move(U,G,et);return}if(tt&64){L.move(D,U,G,mt);return}if(L===rn){i(nt,U,G);for(let w=0;w<rt.length;w++)ht(rt[w],U,G,et);i(D.anchor,U,G);return}if(L===_c){b(D,U,G);return}if(et!==2&&tt&1&&ot)if(et===0)ot.beforeEnter(nt),i(nt,U,G),Ye(()=>ot.enter(nt),J);else{const{leave:w,delayLeave:y,afterLeave:F}=ot,X=()=>{D.ctx.isUnmounted?r(nt):i(nt,U,G)},j=()=>{nt._isLeaving&&nt[Wi](!0),w(nt,()=>{X(),F&&F()})};y?y(nt,X,j):j()}else i(nt,U,G)},Rt=(D,U,G,et=!1,J=!1)=>{const{type:nt,props:L,ref:ot,children:rt,dynamicChildren:tt,shapeFlag:st,patchFlag:w,dirs:y,cacheIndex:F}=D;if(w===-2&&(J=!1),ot!=null&&(Ji(),To(ot,null,G,D,!0),ji()),F!=null&&(U.renderCache[F]=void 0),st&256){U.ctx.deactivate(D);return}const X=st&1&&y,j=!ma(D);let W;if(j&&(W=L&&L.onVnodeBeforeUnmount)&&ri(W,U,D),st&6)Kt(D.component,G,et);else{if(st&128){D.suspense.unmount(G,et);return}X&&Fr(D,null,U,"beforeUnmount"),st&64?D.type.remove(D,U,G,mt,et):tt&&!tt.hasOnce&&(nt!==rn||w>0&&w&64)?Q(tt,U,G,!1,!0):(nt===rn&&w&384||!J&&st&16)&&Q(rt,U,G),et&&It(D)}(j&&(W=L&&L.onVnodeUnmounted)||X)&&Ye(()=>{W&&ri(W,U,D),X&&Fr(D,null,U,"unmounted")},G)},It=D=>{const{type:U,el:G,anchor:et,transition:J}=D;if(U===rn){qt(G,et);return}if(U===_c){S(D);return}const nt=()=>{r(G),J&&!J.persisted&&J.afterLeave&&J.afterLeave()};if(D.shapeFlag&1&&J&&!J.persisted){const{leave:L,delayLeave:ot}=J,rt=()=>L(G,nt);ot?ot(D.el,nt,rt):rt()}else nt()},qt=(D,U)=>{let G;for(;D!==U;)G=h(D),r(D),D=G;r(U)},Kt=(D,U,G)=>{const{bum:et,scope:J,job:nt,subTree:L,um:ot,m:rt,a:tt}=D;lv(rt),lv(tt),et&&pc(et),J.stop(),nt&&(nt.flags|=8,Rt(L,D,U,G)),ot&&Ye(ot,U),Ye(()=>{D.isUnmounted=!0},U)},Q=(D,U,G,et=!1,J=!1,nt=0)=>{for(let L=nt;L<D.length;L++)Rt(D[L],U,G,et,J)},it=D=>{if(D.shapeFlag&6)return it(D.component.subTree);if(D.shapeFlag&128)return D.suspense.next();const U=h(D.anchor||D.el),G=U&&U[I0];return G?h(G):U};let Mt=!1;const Ut=(D,U,G)=>{let et;D==null?U._vnode&&(Rt(U._vnode,null,null,!0),et=U._vnode.component):_(U._vnode||null,D,U,null,null,null,G),U._vnode=D,Mt||(Mt=!0,$m(et),C0(),Mt=!1)},mt={p:_,um:Rt,m:ht,r:It,mt:O,mc:R,pc:K,pbc:M,n:it,o:e};return{render:Ut,hydrate:void 0,createApp:w1(Ut)}}function ju({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Ur({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function G1(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Gp(e,t,n=!1){const i=e.children,r=t.children;if(Ot(i)&&Ot(r))for(let s=0;s<i.length;s++){const a=i[s];let o=r[s];o.shapeFlag&1&&!o.dynamicChildren&&((o.patchFlag<=0||o.patchFlag===32)&&(o=r[s]=vr(r[s]),o.el=a.el),!n&&o.patchFlag!==-2&&Gp(a,o)),o.type===du&&(o.patchFlag!==-1?o.el=a.el:o.__elIndex=s+(e.type===rn?1:0)),o.type===ze&&!o.el&&(o.el=a.el)}}function k1(e){const t=e.slice(),n=[0];let i,r,s,a,o;const l=e.length;for(i=0;i<l;i++){const c=e[i];if(c!==0){if(r=n[n.length-1],e[r]<c){t[i]=r,n.push(i);continue}for(s=0,a=n.length-1;s<a;)o=s+a>>1,e[n[o]]<c?s=o+1:a=o;c<e[n[s]]&&(s>0&&(t[i]=n[s-1]),n[s]=i)}}for(s=n.length,a=n[s-1];s-- >0;)n[s]=a,a=t[a];return n}function ax(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:ax(t)}function lv(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function ox(e){if(e.placeholder)return e.placeholder;const t=e.component;return t?ox(t.subTree):null}const lx=e=>e.__isSuspense;function W1(e,t){t&&t.pendingBranch?Ot(e)?t.effects.push(...e):t.effects.push(e):KM(e)}const rn=Symbol.for("v-fgt"),du=Symbol.for("v-txt"),ze=Symbol.for("v-cmt"),_c=Symbol.for("v-stc"),wo=[];let gn=null;function Pd(e=!1){wo.push(gn=e?null:[])}function X1(){wo.pop(),gn=wo[wo.length-1]||null}let ko=1;function Hc(e,t=!1){ko+=e,e<0&&gn&&t&&(gn.hasOnce=!0)}function cx(e){return e.dynamicChildren=ko>0?gn||ha:null,X1(),ko>0&&gn&&gn.push(e),e}function IN(e,t,n,i,r,s){return cx(ux(e,t,n,i,r,s,!0))}function Ld(e,t,n,i,r){return cx(Je(e,t,n,i,r,!0))}function Wo(e){return e?e.__v_isVNode===!0:!1}function us(e,t){return e.type===t.type&&e.key===t.key}const fx=({key:e})=>e!=null?e:null,gc=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?be(e)||Me(e)||kt(e)?{i:Ie,r:e,k:t,f:!!n}:e:null);function ux(e,t=null,n=null,i=0,r=null,s=e===rn?0:1,a=!1,o=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&fx(t),ref:t&&gc(t),scopeId:P0,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Ie};return o?(kp(l,n),s&128&&e.normalize(l)):n&&(l.shapeFlag|=be(n)?8:16),ko>0&&!a&&gn&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&gn.push(l),l}const Je=q1;function q1(e,t=null,n=null,i=0,r=null,s=!1){if((!e||e===_1)&&(e=ze),Wo(e)){const o=Cr(e,t,!0);return n&&kp(o,n),ko>0&&!s&&gn&&(o.shapeFlag&6?gn[gn.indexOf(e)]=o:gn.push(o)),o.patchFlag=-2,o}if(rb(e)&&(e=e.__vccOpts),t){t=Y1(t);let{class:o,style:l}=t;o&&!be(o)&&(t.class=Rp(o)),fe(l)&&(lu(l)&&!Ot(l)&&(l=Ae({},l)),t.style=Cp(l))}const a=be(e)?1:lx(e)?128:N0(e)?64:fe(e)?4:kt(e)?2:0;return ux(e,t,n,i,r,a,s,!0)}function Y1(e){return e?lu(e)||tx(e)?Ae({},e):e:null}function Cr(e,t,n=!1,i=!1){const{props:r,ref:s,patchFlag:a,children:o,transition:l}=e,c=t?K1(r||{},t):r,f={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&fx(c),ref:t&&t.ref?n&&s?Ot(s)?s.concat(gc(t)):[s,gc(t)]:gc(t):s,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:o,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==rn?a===-1?16:a|16:a,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Cr(e.ssContent),ssFallback:e.ssFallback&&Cr(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return l&&i&&Go(f,l.clone(f)),f}function $1(e=" ",t=0){return Je(du,null,e,t)}function NN(e,t){const n=Je(_c,null,e);return n.staticCount=t,n}function FN(e="",t=!1){return t?(Pd(),Ld(ze,null,e)):Je(ze,null,e)}function hi(e){return e==null||typeof e=="boolean"?Je(ze):Ot(e)?Je(rn,null,e.slice()):Wo(e)?vr(e):Je(du,null,String(e))}function vr(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Cr(e)}function kp(e,t){let n=0;const{shapeFlag:i}=e;if(t==null)t=null;else if(Ot(t))n=16;else if(typeof t=="object")if(i&65){const r=t.default;r&&(r._c&&(r._d=!1),kp(e,r()),r._c&&(r._d=!0));return}else{n=32;const r=t._;!r&&!tx(t)?t._ctx=Ie:r===3&&Ie&&(Ie.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else kt(t)?(t={default:t,_ctx:Ie},n=32):(t=String(t),i&64?(n=16,t=[$1(t)]):n=8);e.children=t,e.shapeFlag|=n}function K1(...e){const t={};for(let n=0;n<e.length;n++){const i=e[n];for(const r in i)if(r==="class")t.class!==i.class&&(t.class=Rp([t.class,i.class]));else if(r==="style")t.style=Cp([t.style,i.style]);else if(tu(r)){const s=t[r],a=i[r];a&&s!==a&&!(Ot(s)&&s.includes(a))&&(t[r]=s?[].concat(s,a):a)}else r!==""&&(t[r]=i[r])}return t}function ri(e,t,n,i=null){jn(e,t,7,[n,i])}const Z1=Z0();let J1=0;function j1(e,t,n){const i=e.type,r=(t?t.appContext:e.appContext)||Z1,s={uid:J1++,vnode:e,type:i,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new a0(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:nx(i,r),emitsOptions:J0(i,r),emit:null,emitted:null,propsDefaults:de,inheritAttrs:i.inheritAttrs,ctx:de,data:de,props:de,attrs:de,slots:de,refs:de,setupState:de,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=t?t.root:s,s.emit=C1.bind(null,s),e.ce&&e.ce(s),s}let Ve=null;const Wp=()=>Ve||Ie;let zc,Dd;{const e=su(),t=(n,i)=>{let r;return(r=e[n])||(r=e[n]=[]),r.push(i),s=>{r.length>1?r.forEach(a=>a(s)):r[0](s)}};zc=t("__VUE_INSTANCE_SETTERS__",n=>Ve=n),Dd=t("__VUE_SSR_SETTERS__",n=>Xo=n)}const ol=e=>{const t=Ve;return zc(e),e.scope.on(),()=>{e.scope.off(),zc(t)}},cv=()=>{Ve&&Ve.scope.off(),zc(null)};function hx(e){return e.vnode.shapeFlag&4}let Xo=!1;function Q1(e,t=!1,n=!1){t&&Dd(t);const{props:i,children:r}=e.vnode,s=hx(e);N1(e,i,s,t),B1(e,r,n||t);const a=s?tb(e,t):void 0;return t&&Dd(!1),a}function tb(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,x1);const{setup:i}=n;if(i){Ji();const r=e.setupContext=i.length>1?nb(e):null,s=ol(e),a=al(i,e,0,[e.props,r]),o=Qg(a);if(ji(),s(),(o||e.sp)&&!ma(e)&&G0(e),o){if(a.then(cv,cv),t)return a.then(l=>{fv(e,l)}).catch(l=>{cu(l,e,0)});e.asyncDep=a}else fv(e,a)}else dx(e)}function fv(e,t,n){kt(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:fe(t)&&(e.setupState=E0(t)),dx(e)}function dx(e,t,n){const i=e.type;e.render||(e.render=i.render||_i);{const r=ol(e);Ji();try{y1(e)}finally{ji(),r()}}}const eb={get(e,t){return He(e,"get",""),e[t]}};function nb(e){const t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,eb),slots:e.slots,emit:e.emit,expose:t}}function pu(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(E0(Op(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Eo)return Eo[n](e)},has(t,n){return n in t||n in Eo}})):e.proxy}function ib(e,t=!0){return kt(e)?e.displayName||e.name:e.name||t&&e.__name}function rb(e){return kt(e)&&"__vccOpts"in e}const px=(e,t)=>WM(e,t,Xo);function sb(e,t,n){try{Hc(-1);const i=arguments.length;return i===2?fe(t)&&!Ot(t)?Wo(t)?Je(e,null,[t]):Je(e,t):Je(e,null,t):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&Wo(n)&&(n=[n]),Je(e,t,n))}finally{Hc(1)}}const ab="3.5.27";/**
* @vue/runtime-dom v3.5.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Id;const uv=typeof window!="undefined"&&window.trustedTypes;if(uv)try{Id=uv.createPolicy("vue",{createHTML:e=>e})}catch(e){}const mx=Id?e=>Id.createHTML(e):e=>e,ob="http://www.w3.org/2000/svg",lb="http://www.w3.org/1998/Math/MathML",Gi=typeof document!="undefined"?document:null,hv=Gi&&Gi.createElement("template"),cb={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,i)=>{const r=t==="svg"?Gi.createElementNS(ob,e):t==="mathml"?Gi.createElementNS(lb,e):n?Gi.createElement(e,{is:n}):Gi.createElement(e);return e==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:e=>Gi.createTextNode(e),createComment:e=>Gi.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Gi.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,i,r,s){const a=n?n.previousSibling:t.lastChild;if(r&&(r===s||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{hv.innerHTML=mx(i==="svg"?`<svg>${e}</svg>`:i==="mathml"?`<math>${e}</math>`:e);const o=hv.content;if(i==="svg"||i==="mathml"){const l=o.firstChild;for(;l.firstChild;)o.appendChild(l.firstChild);o.removeChild(l)}t.insertBefore(o,n)}return[a?a.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},ir="transition",ka="animation",qo=Symbol("_vtc"),vx={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},fb=Ae({},O0,vx),ub=e=>(e.displayName="Transition",e.props=fb,e),UN=ub((e,{slots:t})=>sb(s1,hb(e),t)),Or=(e,t=[])=>{Ot(e)?e.forEach(n=>n(...t)):e&&e(...t)},dv=e=>e?Ot(e)?e.some(t=>t.length>1):e.length>1:!1;function hb(e){const t={};for(const I in e)I in vx||(t[I]=e[I]);if(e.css===!1)return t;const{name:n="v",type:i,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:a=`${n}-enter-active`,enterToClass:o=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:c=a,appearToClass:f=o,leaveFromClass:u=`${n}-leave-from`,leaveActiveClass:h=`${n}-leave-active`,leaveToClass:d=`${n}-leave-to`}=e,v=db(r),_=v&&v[0],m=v&&v[1],{onBeforeEnter:p,onEnter:x,onEnterCancelled:b,onLeave:S,onLeaveCancelled:T,onBeforeAppear:E=p,onAppear:C=x,onAppearCancelled:R=b}=t,g=(I,N,O,q)=>{I._enterCancelled=q,Br(I,N?f:o),Br(I,N?c:a),O&&O()},M=(I,N)=>{I._isLeaving=!1,Br(I,u),Br(I,d),Br(I,h),N&&N()},P=I=>(N,O)=>{const q=I?C:x,V=()=>g(N,I,O);Or(q,[N,V]),pv(()=>{Br(N,I?l:s),Ii(N,I?f:o),dv(q)||mv(N,i,_,V)})};return Ae(t,{onBeforeEnter(I){Or(p,[I]),Ii(I,s),Ii(I,a)},onBeforeAppear(I){Or(E,[I]),Ii(I,l),Ii(I,c)},onEnter:P(!1),onAppear:P(!0),onLeave(I,N){I._isLeaving=!0;const O=()=>M(I,N);Ii(I,u),I._enterCancelled?(Ii(I,h),gv(I)):(gv(I),Ii(I,h)),pv(()=>{I._isLeaving&&(Br(I,u),Ii(I,d),dv(S)||mv(I,i,m,O))}),Or(S,[I,O])},onEnterCancelled(I){g(I,!1,void 0,!0),Or(b,[I])},onAppearCancelled(I){g(I,!0,void 0,!0),Or(R,[I])},onLeaveCancelled(I){M(I),Or(T,[I])}})}function db(e){if(e==null)return null;if(fe(e))return[Qu(e.enter),Qu(e.leave)];{const t=Qu(e);return[t,t]}}function Qu(e){return oM(e)}function Ii(e,t){t.split(/\s+/).forEach(n=>n&&e.classList.add(n)),(e[qo]||(e[qo]=new Set)).add(t)}function Br(e,t){t.split(/\s+/).forEach(i=>i&&e.classList.remove(i));const n=e[qo];n&&(n.delete(t),n.size||(e[qo]=void 0))}function pv(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let pb=0;function mv(e,t,n,i){const r=e._endId=++pb,s=()=>{r===e._endId&&i()};if(n!=null)return setTimeout(s,n);const{type:a,timeout:o,propCount:l}=mb(e,t);if(!a)return i();const c=a+"end";let f=0;const u=()=>{e.removeEventListener(c,h),s()},h=d=>{d.target===e&&++f>=l&&u()};setTimeout(()=>{f<l&&u()},o+1),e.addEventListener(c,h)}function mb(e,t){const n=window.getComputedStyle(e),i=v=>(n[v]||"").split(", "),r=i(`${ir}Delay`),s=i(`${ir}Duration`),a=vv(r,s),o=i(`${ka}Delay`),l=i(`${ka}Duration`),c=vv(o,l);let f=null,u=0,h=0;t===ir?a>0&&(f=ir,u=a,h=s.length):t===ka?c>0&&(f=ka,u=c,h=l.length):(u=Math.max(a,c),f=u>0?a>c?ir:ka:null,h=f?f===ir?s.length:l.length:0);const d=f===ir&&/\b(?:transform|all)(?:,|$)/.test(i(`${ir}Property`).toString());return{type:f,timeout:u,propCount:h,hasTransform:d}}function vv(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((n,i)=>_v(n)+_v(e[i])))}function _v(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function gv(e){return(e?e.ownerDocument:document).body.offsetHeight}function vb(e,t,n){const i=e[qo];i&&(t=(t?[t,...i]:[...i]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const Vc=Symbol("_vod"),_x=Symbol("_vsh"),ON={name:"show",beforeMount(e,{value:t},{transition:n}){e[Vc]=e.style.display==="none"?"":e.style.display,n&&t?n.beforeEnter(e):Wa(e,t)},mounted(e,{value:t},{transition:n}){n&&t&&n.enter(e)},updated(e,{value:t,oldValue:n},{transition:i}){!t!=!n&&(i?t?(i.beforeEnter(e),Wa(e,!0),i.enter(e)):i.leave(e,()=>{Wa(e,!1)}):Wa(e,t))},beforeUnmount(e,{value:t}){Wa(e,t)}};function Wa(e,t){e.style.display=t?e[Vc]:"none",e[_x]=!t}const _b=Symbol(""),gb=/(?:^|;)\s*display\s*:/;function xb(e,t,n){const i=e.style,r=be(n);let s=!1;if(n&&!r){if(t)if(be(t))for(const a of t.split(";")){const o=a.slice(0,a.indexOf(":")).trim();n[o]==null&&xc(i,o,"")}else for(const a in t)n[a]==null&&xc(i,a,"");for(const a in n)a==="display"&&(s=!0),xc(i,a,n[a])}else if(r){if(t!==n){const a=i[_b];a&&(n+=";"+a),i.cssText=n,s=gb.test(n)}}else t&&e.removeAttribute("style");Vc in e&&(e[Vc]=s?i.display:"",e[_x]&&(i.display="none"))}const xv=/\s*!important$/;function xc(e,t,n){if(Ot(n))n.forEach(i=>xc(e,t,i));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const i=yb(e,t);xv.test(n)?e.setProperty(Dr(i),n.replace(xv,""),"important"):e[i]=n}}const yv=["Webkit","Moz","ms"],th={};function yb(e,t){const n=th[t];if(n)return n;let i=Nn(t);if(i!=="filter"&&i in e)return th[t]=i;i=iu(i);for(let r=0;r<yv.length;r++){const s=yv[r]+i;if(s in e)return th[t]=s}return t}const Sv="http://www.w3.org/1999/xlink";function Mv(e,t,n,i,r,s=dM(t)){i&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(Sv,t.slice(6,t.length)):e.setAttributeNS(Sv,t,n):n==null||s&&!i0(n)?e.removeAttribute(t):e.setAttribute(t,s?"":Zn(n)?String(n):n)}function bv(e,t,n,i,r){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?mx(n):n);return}const s=e.tagName;if(t==="value"&&s!=="PROGRESS"&&!s.includes("-")){const o=s==="OPTION"?e.getAttribute("value")||"":e.value,l=n==null?e.type==="checkbox"?"on":"":String(n);(o!==l||!("_value"in e))&&(e.value=l),n==null&&e.removeAttribute(t),e._value=n;return}let a=!1;if(n===""||n==null){const o=typeof e[t];o==="boolean"?n=i0(n):n==null&&o==="string"?(n="",a=!0):o==="number"&&(n=0,a=!0)}try{e[t]=n}catch(o){}a&&e.removeAttribute(r||t)}function Yi(e,t,n,i){e.addEventListener(t,n,i)}function Sb(e,t,n,i){e.removeEventListener(t,n,i)}const Tv=Symbol("_vei");function Mb(e,t,n,i,r=null){const s=e[Tv]||(e[Tv]={}),a=s[t];if(i&&a)a.value=i;else{const[o,l]=bb(t);if(i){const c=s[t]=wb(i,r);Yi(e,o,c,l)}else a&&(Sb(e,o,a,l),s[t]=void 0)}}const Ev=/(?:Once|Passive|Capture)$/;function bb(e){let t;if(Ev.test(e)){t={};let i;for(;i=e.match(Ev);)e=e.slice(0,e.length-i[0].length),t[i[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):Dr(e.slice(2)),t]}let eh=0;const Tb=Promise.resolve(),Eb=()=>eh||(Tb.then(()=>eh=0),eh=Date.now());function wb(e,t){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;jn(Ab(i,n.value),t,5,[i])};return n.value=e,n.attached=Eb(),n}function Ab(e,t){if(Ot(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(i=>r=>!r._stopped&&i&&i(r))}else return t}const wv=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Cb=(e,t,n,i,r,s)=>{const a=r==="svg";t==="class"?vb(e,i,a):t==="style"?xb(e,n,i):tu(t)?wp(t)||Mb(e,t,n,i,s):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Rb(e,t,i,a))?(bv(e,t,i),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Mv(e,t,i,a,s,t!=="value")):e._isVueCE&&(/[A-Z]/.test(t)||!be(i))?bv(e,Nn(t),i,s,t):(t==="true-value"?e._trueValue=i:t==="false-value"&&(e._falseValue=i),Mv(e,t,i,a))};function Rb(e,t,n,i){if(i)return!!(t==="innerHTML"||t==="textContent"||t in e&&wv(t)&&kt(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const r=e.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return wv(t)&&be(n)?!1:t in e}const Rr=e=>{const t=e.props["onUpdate:modelValue"]||!1;return Ot(t)?n=>pc(t,n):t};function Pb(e){e.target.composing=!0}function Av(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const In=Symbol("_assign");function Cv(e,t,n){return t&&(e=e.trim()),n&&(e=ru(e)),e}const BN={created(e,{modifiers:{lazy:t,trim:n,number:i}},r){e[In]=Rr(r);const s=i||r.props&&r.props.type==="number";Yi(e,t?"change":"input",a=>{a.target.composing||e[In](Cv(e.value,n,s))}),(n||s)&&Yi(e,"change",()=>{e.value=Cv(e.value,n,s)}),t||(Yi(e,"compositionstart",Pb),Yi(e,"compositionend",Av),Yi(e,"change",Av))},mounted(e,{value:t}){e.value=t==null?"":t},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:i,trim:r,number:s}},a){if(e[In]=Rr(a),e.composing)return;const o=(s||e.type==="number")&&!/^0\d/.test(e.value)?ru(e.value):e.value,l=t==null?"":t;o!==l&&(document.activeElement===e&&e.type!=="range"&&(i&&t===n||r&&e.value.trim()===l)||(e.value=l))}},HN={deep:!0,created(e,t,n){e[In]=Rr(n),Yi(e,"change",()=>{const i=e._modelValue,r=Ma(e),s=e.checked,a=e[In];if(Ot(i)){const o=Pp(i,r),l=o!==-1;if(s&&!l)a(i.concat(r));else if(!s&&l){const c=[...i];c.splice(o,1),a(c)}}else if(Na(i)){const o=new Set(i);s?o.add(r):o.delete(r),a(o)}else a(gx(e,s))})},mounted:Rv,beforeUpdate(e,t,n){e[In]=Rr(n),Rv(e,t,n)}};function Rv(e,{value:t,oldValue:n},i){e._modelValue=t;let r;if(Ot(t))r=Pp(t,i.props.value)>-1;else if(Na(t))r=t.has(i.props.value);else{if(t===n)return;r=Es(t,gx(e,!0))}e.checked!==r&&(e.checked=r)}const zN={created(e,{value:t},n){e.checked=Es(t,n.props.value),e[In]=Rr(n),Yi(e,"change",()=>{e[In](Ma(e))})},beforeUpdate(e,{value:t,oldValue:n},i){e[In]=Rr(i),t!==n&&(e.checked=Es(t,i.props.value))}},VN={deep:!0,created(e,{value:t,modifiers:{number:n}},i){const r=Na(t);Yi(e,"change",()=>{const s=Array.prototype.filter.call(e.options,a=>a.selected).map(a=>n?ru(Ma(a)):Ma(a));e[In](e.multiple?r?new Set(s):s:s[0]),e._assigning=!0,Bp(()=>{e._assigning=!1})}),e[In]=Rr(i)},mounted(e,{value:t}){Pv(e,t)},beforeUpdate(e,t,n){e[In]=Rr(n)},updated(e,{value:t}){e._assigning||Pv(e,t)}};function Pv(e,t){const n=e.multiple,i=Ot(t);if(!(n&&!i&&!Na(t))){for(let r=0,s=e.options.length;r<s;r++){const a=e.options[r],o=Ma(a);if(n)if(i){const l=typeof o;l==="string"||l==="number"?a.selected=t.some(c=>String(c)===String(o)):a.selected=Pp(t,o)>-1}else a.selected=t.has(o);else if(Es(Ma(a),t)){e.selectedIndex!==r&&(e.selectedIndex=r);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Ma(e){return"_value"in e?e._value:e.value}function gx(e,t){const n=t?"_trueValue":"_falseValue";return n in e?e[n]:t}const Lb=["ctrl","shift","alt","meta"],Db={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,t)=>Lb.some(n=>e[`${n}Key`]&&!t.includes(n))},GN=(e,t)=>{const n=e._withMods||(e._withMods={}),i=t.join(".");return n[i]||(n[i]=(r,...s)=>{for(let a=0;a<t.length;a++){const o=Db[t[a]];if(o&&o(r,t))return}return e(r,...s)})},Ib={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},kN=(e,t)=>{const n=e._withKeys||(e._withKeys={}),i=t.join(".");return n[i]||(n[i]=r=>{if(!("key"in r))return;const s=Dr(r.key);if(t.some(a=>a===s||Ib[a]===s))return e(r)})},Nb=Ae({patchProp:Cb},cb);let Lv;function Fb(){return Lv||(Lv=z1(Nb))}const WN=(...e)=>{const t=Fb().createApp(...e),{mount:n}=t;return t.mount=i=>{const r=Ob(i);if(!r)return;const s=t._component;!kt(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const a=n(r,!1,Ub(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),a},t};function Ub(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Ob(e){return be(e)?document.querySelector(e):e}/*!
 * pinia v3.0.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let xx;const mu=e=>xx=e,yx=Symbol();function Nd(e){return e&&typeof e=="object"&&Object.prototype.toString.call(e)==="[object Object]"&&typeof e.toJSON!="function"}var Ao;(function(e){e.direct="direct",e.patchObject="patch object",e.patchFunction="patch function"})(Ao||(Ao={}));function XN(){const e=o0(!0),t=e.run(()=>OM({}));let n=[],i=[];const r=Op({install(s){mu(r),r._a=s,s.provide(yx,r),s.config.globalProperties.$pinia=r,i.forEach(a=>n.push(a)),i=[]},use(s){return this._a?n.push(s):i.push(s),this},_p:n,_a:null,_e:e,_s:new Map,state:t});return r}const Sx=()=>{};function Dv(e,t,n,i=Sx){e.add(t);const r=()=>{e.delete(t)&&i()};return!n&&l0()&&vM(r),r}function Us(e,...t){e.forEach(n=>{n(...t)})}const Bb=e=>e(),Iv=Symbol(),nh=Symbol();function Fd(e,t){e instanceof Map&&t instanceof Map?t.forEach((n,i)=>e.set(i,n)):e instanceof Set&&t instanceof Set&&t.forEach(e.add,e);for(const n in t){if(!t.hasOwnProperty(n))continue;const i=t[n],r=e[n];Nd(r)&&Nd(i)&&e.hasOwnProperty(n)&&!Me(i)&&!Ki(i)?e[n]=Fd(r,i):e[n]=i}return e}const Hb=Symbol();function zb(e){return!Nd(e)||!Object.prototype.hasOwnProperty.call(e,Hb)}const{assign:hr}=Object;function Vb(e){return!!(Me(e)&&e.effect)}function Gb(e,t,n,i){const{state:r,actions:s,getters:a}=t,o=n.state.value[e];let l;function c(){o||(n.state.value[e]=r?r():{});const f=zM(n.state.value[e]);return hr(f,s,Object.keys(a||{}).reduce((u,h)=>(u[h]=Op(px(()=>{mu(n);const d=n._s.get(e);return a[h].call(d,d)})),u),{}))}return l=Mx(e,c,t,n,i,!0),l}function Mx(e,t,n={},i,r,s){let a;const o=hr({actions:{}},n),l={deep:!0};let c,f,u=new Set,h=new Set,d;const v=i.state.value[e];!s&&!v&&(i.state.value[e]={});let _;function m(R){let g;c=f=!1,typeof R=="function"?(R(i.state.value[e]),g={type:Ao.patchFunction,storeId:e,events:d}):(Fd(i.state.value[e],R),g={type:Ao.patchObject,payload:R,storeId:e,events:d});const M=_=Symbol();Bp().then(()=>{_===M&&(c=!0)}),f=!0,Us(u,g,i.state.value[e])}const p=s?function(){const{state:g}=n,M=g?g():{};this.$patch(P=>{hr(P,M)})}:Sx;function x(){a.stop(),u.clear(),h.clear(),i._s.delete(e)}const b=(R,g="")=>{if(Iv in R)return R[nh]=g,R;const M=function(){mu(i);const P=Array.from(arguments),I=new Set,N=new Set;function O(H){I.add(H)}function q(H){N.add(H)}Us(h,{args:P,name:M[nh],store:T,after:O,onError:q});let V;try{V=R.apply(this&&this.$id===e?this:T,P)}catch(H){throw Us(N,H),H}return V instanceof Promise?V.then(H=>(Us(I,H),H)).catch(H=>(Us(N,H),Promise.reject(H))):(Us(I,V),V)};return M[Iv]=!0,M[nh]=g,M},S={_p:i,$id:e,$onAction:Dv.bind(null,h),$patch:m,$reset:p,$subscribe(R,g={}){const M=Dv(u,R,g.detached,()=>P()),P=a.run(()=>mc(()=>i.state.value[e],I=>{(g.flush==="sync"?f:c)&&R({storeId:e,type:Ao.direct,events:d},I)},hr({},l,g)));return M},$dispose:x},T=ou(S);i._s.set(e,T);const C=(i._a&&i._a.runWithContext||Bb)(()=>i._e.run(()=>(a=o0()).run(()=>t({action:b}))));for(const R in C){const g=C[R];if(Me(g)&&!Vb(g)||Ki(g))s||(v&&zb(g)&&(Me(g)?g.value=v[R]:Fd(g,v[R])),i.state.value[e][R]=g);else if(typeof g=="function"){const M=b(g,R);C[R]=M,o.actions[R]=g}}return hr(T,C),hr(jt(T),C),Object.defineProperty(T,"$state",{get:()=>i.state.value[e],set:R=>{m(g=>{hr(g,R)})}}),i._p.forEach(R=>{hr(T,a.run(()=>R({store:T,app:i._a,pinia:i,options:o})))}),v&&s&&n.hydrate&&n.hydrate(T.$state,v),c=!0,f=!0,T}/*! #__NO_SIDE_EFFECTS__ */function qN(e,t,n){let i;const r=typeof t=="function";i=r?n:t;function s(a,o){const l=jM();return a=a||(l?Mo(yx,null):null),a&&mu(a),a=xx,a._s.has(e)||(r?Mx(e,t,i,a):Gb(e,i,a)),a._s.get(e)}return s.$id=e,s}function kb(e,t){let n=0;for(let i of e)i!=null&&(i=+i)>=i&&++n;return n}function Wb(e,t){let n,i;if(t===void 0)for(const r of e)r!=null&&(n===void 0?r>=r&&(n=i=r):(n>r&&(n=r),i<r&&(i=r)));else{let r=-1;for(let s of e)(s=t(s,++r,e))!=null&&(n===void 0?s>=s&&(n=i=s):(n>s&&(n=s),i<s&&(i=s)))}return[n,i]}const Xb=Math.sqrt(50),qb=Math.sqrt(10),Yb=Math.sqrt(2);function Gc(e,t,n){const i=(t-e)/Math.max(0,n),r=Math.floor(Math.log10(i)),s=i/Math.pow(10,r),a=s>=Xb?10:s>=qb?5:s>=Yb?2:1;let o,l,c;return r<0?(c=Math.pow(10,-r)/a,o=Math.round(e*c),l=Math.round(t*c),o/c<e&&++o,l/c>t&&--l,c=-c):(c=Math.pow(10,r)*a,o=Math.round(e/c),l=Math.round(t/c),o*c<e&&++o,l*c>t&&--l),l<o&&.5<=n&&n<2?Gc(e,t,n*2):[o,l,c]}function $b(e,t,n){if(t=+t,e=+e,n=+n,!(n>0))return[];if(e===t)return[e];const i=t<e,[r,s,a]=i?Gc(t,e,n):Gc(e,t,n);if(!(s>=r))return[];const o=s-r+1,l=new Array(o);if(i)if(a<0)for(let c=0;c<o;++c)l[c]=(s-c)/-a;else for(let c=0;c<o;++c)l[c]=(s-c)*a;else if(a<0)for(let c=0;c<o;++c)l[c]=(r+c)/-a;else for(let c=0;c<o;++c)l[c]=(r+c)*a;return l}function Kb(e,t,n){return t=+t,e=+e,n=+n,Gc(e,t,n)[2]}function Zb(e,t,n){let i;for(;;){const r=Kb(e,t,n);if(r===i||r===0||!isFinite(r))return[e,t];r>0?(e=Math.floor(e/r)*r,t=Math.ceil(t/r)*r):r<0&&(e=Math.ceil(e*r)/r,t=Math.floor(t*r)/r),i=r}}function Jb(e){return Math.max(1,Math.ceil(Math.log(kb(e))/Math.LN2)+1)}function YN(e,t,n){e=+e,t=+t,n=(r=arguments.length)<2?(t=e,e=0,1):r<3?1:+n;for(var i=-1,r=Math.max(0,Math.ceil((t-e)/n))|0,s=new Array(r);++i<r;)s[i]=e+i*n;return s}var jb={value:()=>{}};function bx(){for(var e=0,t=arguments.length,n={},i;e<t;++e){if(!(i=arguments[e]+"")||i in n||/[\s.]/.test(i))throw new Error("illegal type: "+i);n[i]=[]}return new yc(n)}function yc(e){this._=e}function Qb(e,t){return e.trim().split(/^|\s+/).map(function(n){var i="",r=n.indexOf(".");if(r>=0&&(i=n.slice(r+1),n=n.slice(0,r)),n&&!t.hasOwnProperty(n))throw new Error("unknown type: "+n);return{type:n,name:i}})}yc.prototype=bx.prototype={constructor:yc,on:function(e,t){var n=this._,i=Qb(e+"",n),r,s=-1,a=i.length;if(arguments.length<2){for(;++s<a;)if((r=(e=i[s]).type)&&(r=tT(n[r],e.name)))return r;return}if(t!=null&&typeof t!="function")throw new Error("invalid callback: "+t);for(;++s<a;)if(r=(e=i[s]).type)n[r]=Nv(n[r],e.name,t);else if(t==null)for(r in n)n[r]=Nv(n[r],e.name,null);return this},copy:function(){var e={},t=this._;for(var n in t)e[n]=t[n].slice();return new yc(e)},call:function(e,t){if((r=arguments.length-2)>0)for(var n=new Array(r),i=0,r,s;i<r;++i)n[i]=arguments[i+2];if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(s=this._[e],i=0,r=s.length;i<r;++i)s[i].value.apply(t,n)},apply:function(e,t,n){if(!this._.hasOwnProperty(e))throw new Error("unknown type: "+e);for(var i=this._[e],r=0,s=i.length;r<s;++r)i[r].value.apply(t,n)}};function tT(e,t){for(var n=0,i=e.length,r;n<i;++n)if((r=e[n]).name===t)return r.value}function Nv(e,t,n){for(var i=0,r=e.length;i<r;++i)if(e[i].name===t){e[i]=jb,e=e.slice(0,i).concat(e.slice(i+1));break}return n!=null&&e.push({name:t,value:n}),e}var Ud="http://www.w3.org/1999/xhtml";const Fv={svg:"http://www.w3.org/2000/svg",xhtml:Ud,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function vu(e){var t=e+="",n=t.indexOf(":");return n>=0&&(t=e.slice(0,n))!=="xmlns"&&(e=e.slice(n+1)),Fv.hasOwnProperty(t)?{space:Fv[t],local:e}:e}function eT(e){return function(){var t=this.ownerDocument,n=this.namespaceURI;return n===Ud&&t.documentElement.namespaceURI===Ud?t.createElement(e):t.createElementNS(n,e)}}function nT(e){return function(){return this.ownerDocument.createElementNS(e.space,e.local)}}function Tx(e){var t=vu(e);return(t.local?nT:eT)(t)}function iT(){}function Xp(e){return e==null?iT:function(){return this.querySelector(e)}}function rT(e){typeof e!="function"&&(e=Xp(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=new Array(a),l,c,f=0;f<a;++f)(l=s[f])&&(c=e.call(l,l.__data__,f,s))&&("__data__"in l&&(c.__data__=l.__data__),o[f]=c);return new Qn(i,this._parents)}function sT(e){return e==null?[]:Array.isArray(e)?e:Array.from(e)}function aT(){return[]}function Ex(e){return e==null?aT:function(){return this.querySelectorAll(e)}}function oT(e){return function(){return sT(e.apply(this,arguments))}}function lT(e){typeof e=="function"?e=oT(e):e=Ex(e);for(var t=this._groups,n=t.length,i=[],r=[],s=0;s<n;++s)for(var a=t[s],o=a.length,l,c=0;c<o;++c)(l=a[c])&&(i.push(e.call(l,l.__data__,c,a)),r.push(l));return new Qn(i,r)}function Ax(e){return function(){return this.matches(e)}}function Cx(e){return function(t){return t.matches(e)}}var cT=Array.prototype.find;function fT(e){return function(){return cT.call(this.children,e)}}function uT(){return this.firstElementChild}function hT(e){return this.select(e==null?uT:fT(typeof e=="function"?e:Cx(e)))}var dT=Array.prototype.filter;function pT(){return Array.from(this.children)}function mT(e){return function(){return dT.call(this.children,e)}}function vT(e){return this.selectAll(e==null?pT:mT(typeof e=="function"?e:Cx(e)))}function _T(e){typeof e!="function"&&(e=Ax(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=[],l,c=0;c<a;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&o.push(l);return new Qn(i,this._parents)}function Rx(e){return new Array(e.length)}function gT(){return new Qn(this._enter||this._groups.map(Rx),this._parents)}function kc(e,t){this.ownerDocument=e.ownerDocument,this.namespaceURI=e.namespaceURI,this._next=null,this._parent=e,this.__data__=t}kc.prototype={constructor:kc,appendChild:function(e){return this._parent.insertBefore(e,this._next)},insertBefore:function(e,t){return this._parent.insertBefore(e,t)},querySelector:function(e){return this._parent.querySelector(e)},querySelectorAll:function(e){return this._parent.querySelectorAll(e)}};function xT(e){return function(){return e}}function yT(e,t,n,i,r,s){for(var a=0,o,l=t.length,c=s.length;a<c;++a)(o=t[a])?(o.__data__=s[a],i[a]=o):n[a]=new kc(e,s[a]);for(;a<l;++a)(o=t[a])&&(r[a]=o)}function ST(e,t,n,i,r,s,a){var o,l,c=new Map,f=t.length,u=s.length,h=new Array(f),d;for(o=0;o<f;++o)(l=t[o])&&(h[o]=d=a.call(l,l.__data__,o,t)+"",c.has(d)?r[o]=l:c.set(d,l));for(o=0;o<u;++o)d=a.call(e,s[o],o,s)+"",(l=c.get(d))?(i[o]=l,l.__data__=s[o],c.delete(d)):n[o]=new kc(e,s[o]);for(o=0;o<f;++o)(l=t[o])&&c.get(h[o])===l&&(r[o]=l)}function MT(e){return e.__data__}function bT(e,t){if(!arguments.length)return Array.from(this,MT);var n=t?ST:yT,i=this._parents,r=this._groups;typeof e!="function"&&(e=xT(e));for(var s=r.length,a=new Array(s),o=new Array(s),l=new Array(s),c=0;c<s;++c){var f=i[c],u=r[c],h=u.length,d=TT(e.call(f,f&&f.__data__,c,i)),v=d.length,_=o[c]=new Array(v),m=a[c]=new Array(v),p=l[c]=new Array(h);n(f,u,_,m,p,d,t);for(var x=0,b=0,S,T;x<v;++x)if(S=_[x]){for(x>=b&&(b=x+1);!(T=m[b])&&++b<v;);S._next=T||null}}return a=new Qn(a,i),a._enter=o,a._exit=l,a}function TT(e){return typeof e=="object"&&"length"in e?e:Array.from(e)}function ET(){return new Qn(this._exit||this._groups.map(Rx),this._parents)}function wT(e,t,n){var i=this.enter(),r=this,s=this.exit();return typeof e=="function"?(i=e(i),i&&(i=i.selection())):i=i.append(e+""),t!=null&&(r=t(r),r&&(r=r.selection())),n==null?s.remove():n(s),i&&r?i.merge(r).order():r}function AT(e){for(var t=e.selection?e.selection():e,n=this._groups,i=t._groups,r=n.length,s=i.length,a=Math.min(r,s),o=new Array(r),l=0;l<a;++l)for(var c=n[l],f=i[l],u=c.length,h=o[l]=new Array(u),d,v=0;v<u;++v)(d=c[v]||f[v])&&(h[v]=d);for(;l<r;++l)o[l]=n[l];return new Qn(o,this._parents)}function CT(){for(var e=this._groups,t=-1,n=e.length;++t<n;)for(var i=e[t],r=i.length-1,s=i[r],a;--r>=0;)(a=i[r])&&(s&&a.compareDocumentPosition(s)^4&&s.parentNode.insertBefore(a,s),s=a);return this}function RT(e){e||(e=PT);function t(u,h){return u&&h?e(u.__data__,h.__data__):!u-!h}for(var n=this._groups,i=n.length,r=new Array(i),s=0;s<i;++s){for(var a=n[s],o=a.length,l=r[s]=new Array(o),c,f=0;f<o;++f)(c=a[f])&&(l[f]=c);l.sort(t)}return new Qn(r,this._parents).order()}function PT(e,t){return e<t?-1:e>t?1:e>=t?0:NaN}function LT(){var e=arguments[0];return arguments[0]=this,e.apply(null,arguments),this}function DT(){return Array.from(this)}function IT(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var i=e[t],r=0,s=i.length;r<s;++r){var a=i[r];if(a)return a}return null}function NT(){let e=0;for(const t of this)++e;return e}function FT(){return!this.node()}function UT(e){for(var t=this._groups,n=0,i=t.length;n<i;++n)for(var r=t[n],s=0,a=r.length,o;s<a;++s)(o=r[s])&&e.call(o,o.__data__,s,r);return this}function OT(e){return function(){this.removeAttribute(e)}}function BT(e){return function(){this.removeAttributeNS(e.space,e.local)}}function HT(e,t){return function(){this.setAttribute(e,t)}}function zT(e,t){return function(){this.setAttributeNS(e.space,e.local,t)}}function VT(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttribute(e):this.setAttribute(e,n)}}function GT(e,t){return function(){var n=t.apply(this,arguments);n==null?this.removeAttributeNS(e.space,e.local):this.setAttributeNS(e.space,e.local,n)}}function kT(e,t){var n=vu(e);if(arguments.length<2){var i=this.node();return n.local?i.getAttributeNS(n.space,n.local):i.getAttribute(n)}return this.each((t==null?n.local?BT:OT:typeof t=="function"?n.local?GT:VT:n.local?zT:HT)(n,t))}function Px(e){return e.ownerDocument&&e.ownerDocument.defaultView||e.document&&e||e.defaultView}function WT(e){return function(){this.style.removeProperty(e)}}function XT(e,t,n){return function(){this.style.setProperty(e,t,n)}}function qT(e,t,n){return function(){var i=t.apply(this,arguments);i==null?this.style.removeProperty(e):this.style.setProperty(e,i,n)}}function YT(e,t,n){return arguments.length>1?this.each((t==null?WT:typeof t=="function"?qT:XT)(e,t,n==null?"":n)):ba(this.node(),e)}function ba(e,t){return e.style.getPropertyValue(t)||Px(e).getComputedStyle(e,null).getPropertyValue(t)}function $T(e){return function(){delete this[e]}}function KT(e,t){return function(){this[e]=t}}function ZT(e,t){return function(){var n=t.apply(this,arguments);n==null?delete this[e]:this[e]=n}}function JT(e,t){return arguments.length>1?this.each((t==null?$T:typeof t=="function"?ZT:KT)(e,t)):this.node()[e]}function Lx(e){return e.trim().split(/^|\s+/)}function qp(e){return e.classList||new Dx(e)}function Dx(e){this._node=e,this._names=Lx(e.getAttribute("class")||"")}Dx.prototype={add:function(e){var t=this._names.indexOf(e);t<0&&(this._names.push(e),this._node.setAttribute("class",this._names.join(" ")))},remove:function(e){var t=this._names.indexOf(e);t>=0&&(this._names.splice(t,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(e){return this._names.indexOf(e)>=0}};function Ix(e,t){for(var n=qp(e),i=-1,r=t.length;++i<r;)n.add(t[i])}function Nx(e,t){for(var n=qp(e),i=-1,r=t.length;++i<r;)n.remove(t[i])}function jT(e){return function(){Ix(this,e)}}function QT(e){return function(){Nx(this,e)}}function tE(e,t){return function(){(t.apply(this,arguments)?Ix:Nx)(this,e)}}function eE(e,t){var n=Lx(e+"");if(arguments.length<2){for(var i=qp(this.node()),r=-1,s=n.length;++r<s;)if(!i.contains(n[r]))return!1;return!0}return this.each((typeof t=="function"?tE:t?jT:QT)(n,t))}function nE(){this.textContent=""}function iE(e){return function(){this.textContent=e}}function rE(e){return function(){var t=e.apply(this,arguments);this.textContent=t==null?"":t}}function sE(e){return arguments.length?this.each(e==null?nE:(typeof e=="function"?rE:iE)(e)):this.node().textContent}function aE(){this.innerHTML=""}function oE(e){return function(){this.innerHTML=e}}function lE(e){return function(){var t=e.apply(this,arguments);this.innerHTML=t==null?"":t}}function cE(e){return arguments.length?this.each(e==null?aE:(typeof e=="function"?lE:oE)(e)):this.node().innerHTML}function fE(){this.nextSibling&&this.parentNode.appendChild(this)}function uE(){return this.each(fE)}function hE(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function dE(){return this.each(hE)}function pE(e){var t=typeof e=="function"?e:Tx(e);return this.select(function(){return this.appendChild(t.apply(this,arguments))})}function mE(){return null}function vE(e,t){var n=typeof e=="function"?e:Tx(e),i=t==null?mE:typeof t=="function"?t:Xp(t);return this.select(function(){return this.insertBefore(n.apply(this,arguments),i.apply(this,arguments)||null)})}function _E(){var e=this.parentNode;e&&e.removeChild(this)}function gE(){return this.each(_E)}function xE(){var e=this.cloneNode(!1),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function yE(){var e=this.cloneNode(!0),t=this.parentNode;return t?t.insertBefore(e,this.nextSibling):e}function SE(e){return this.select(e?yE:xE)}function ME(e){return arguments.length?this.property("__data__",e):this.node().__data__}function bE(e){return function(t){e.call(this,t,this.__data__)}}function TE(e){return e.trim().split(/^|\s+/).map(function(t){var n="",i=t.indexOf(".");return i>=0&&(n=t.slice(i+1),t=t.slice(0,i)),{type:t,name:n}})}function EE(e){return function(){var t=this.__on;if(t){for(var n=0,i=-1,r=t.length,s;n<r;++n)s=t[n],(!e.type||s.type===e.type)&&s.name===e.name?this.removeEventListener(s.type,s.listener,s.options):t[++i]=s;++i?t.length=i:delete this.__on}}}function wE(e,t,n){return function(){var i=this.__on,r,s=bE(t);if(i){for(var a=0,o=i.length;a<o;++a)if((r=i[a]).type===e.type&&r.name===e.name){this.removeEventListener(r.type,r.listener,r.options),this.addEventListener(r.type,r.listener=s,r.options=n),r.value=t;return}}this.addEventListener(e.type,s,n),r={type:e.type,name:e.name,value:t,listener:s,options:n},i?i.push(r):this.__on=[r]}}function AE(e,t,n){var i=TE(e+""),r,s=i.length,a;if(arguments.length<2){var o=this.node().__on;if(o){for(var l=0,c=o.length,f;l<c;++l)for(r=0,f=o[l];r<s;++r)if((a=i[r]).type===f.type&&a.name===f.name)return f.value}return}for(o=t?wE:EE,r=0;r<s;++r)this.each(o(i[r],t,n));return this}function Fx(e,t,n){var i=Px(e),r=i.CustomEvent;typeof r=="function"?r=new r(t,n):(r=i.document.createEvent("Event"),n?(r.initEvent(t,n.bubbles,n.cancelable),r.detail=n.detail):r.initEvent(t,!1,!1)),e.dispatchEvent(r)}function CE(e,t){return function(){return Fx(this,e,t)}}function RE(e,t){return function(){return Fx(this,e,t.apply(this,arguments))}}function PE(e,t){return this.each((typeof t=="function"?RE:CE)(e,t))}function*LE(){for(var e=this._groups,t=0,n=e.length;t<n;++t)for(var i=e[t],r=0,s=i.length,a;r<s;++r)(a=i[r])&&(yield a)}var DE=[null];function Qn(e,t){this._groups=e,this._parents=t}function ll(){return new Qn([[document.documentElement]],DE)}function IE(){return this}Qn.prototype=ll.prototype={constructor:Qn,select:rT,selectAll:lT,selectChild:hT,selectChildren:vT,filter:_T,data:bT,enter:gT,exit:ET,join:wT,merge:AT,selection:IE,order:CT,sort:RT,call:LT,nodes:DT,node:IT,size:NT,empty:FT,each:UT,attr:kT,style:YT,property:JT,classed:eE,text:sE,html:cE,raise:uE,lower:dE,append:pE,insert:vE,remove:gE,clone:SE,datum:ME,on:AE,dispatch:PE,[Symbol.iterator]:LE};function Yp(e,t,n){e.prototype=t.prototype=n,n.constructor=e}function Ux(e,t){var n=Object.create(e.prototype);for(var i in t)n[i]=t[i];return n}function cl(){}var Yo=.7,Wc=1/Yo,va="\\s*([+-]?\\d+)\\s*",$o="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",gi="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",NE=/^#([0-9a-f]{3,8})$/,FE=new RegExp(`^rgb\\(${va},${va},${va}\\)$`),UE=new RegExp(`^rgb\\(${gi},${gi},${gi}\\)$`),OE=new RegExp(`^rgba\\(${va},${va},${va},${$o}\\)$`),BE=new RegExp(`^rgba\\(${gi},${gi},${gi},${$o}\\)$`),HE=new RegExp(`^hsl\\(${$o},${gi},${gi}\\)$`),zE=new RegExp(`^hsla\\(${$o},${gi},${gi},${$o}\\)$`),Uv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Yp(cl,Ko,{copy(e){return Object.assign(new this.constructor,this,e)},displayable(){return this.rgb().displayable()},hex:Ov,formatHex:Ov,formatHex8:VE,formatHsl:GE,formatRgb:Bv,toString:Bv});function Ov(){return this.rgb().formatHex()}function VE(){return this.rgb().formatHex8()}function GE(){return Ox(this).formatHsl()}function Bv(){return this.rgb().formatRgb()}function Ko(e){var t,n;return e=(e+"").trim().toLowerCase(),(t=NE.exec(e))?(n=t[1].length,t=parseInt(t[1],16),n===6?Hv(t):n===3?new on(t>>8&15|t>>4&240,t>>4&15|t&240,(t&15)<<4|t&15,1):n===8?Tl(t>>24&255,t>>16&255,t>>8&255,(t&255)/255):n===4?Tl(t>>12&15|t>>8&240,t>>8&15|t>>4&240,t>>4&15|t&240,((t&15)<<4|t&15)/255):null):(t=FE.exec(e))?new on(t[1],t[2],t[3],1):(t=UE.exec(e))?new on(t[1]*255/100,t[2]*255/100,t[3]*255/100,1):(t=OE.exec(e))?Tl(t[1],t[2],t[3],t[4]):(t=BE.exec(e))?Tl(t[1]*255/100,t[2]*255/100,t[3]*255/100,t[4]):(t=HE.exec(e))?Gv(t[1],t[2]/100,t[3]/100,1):(t=zE.exec(e))?Gv(t[1],t[2]/100,t[3]/100,t[4]):Uv.hasOwnProperty(e)?Hv(Uv[e]):e==="transparent"?new on(NaN,NaN,NaN,0):null}function Hv(e){return new on(e>>16&255,e>>8&255,e&255,1)}function Tl(e,t,n,i){return i<=0&&(e=t=n=NaN),new on(e,t,n,i)}function kE(e){return e instanceof cl||(e=Ko(e)),e?(e=e.rgb(),new on(e.r,e.g,e.b,e.opacity)):new on}function Xc(e,t,n,i){return arguments.length===1?kE(e):new on(e,t,n,i==null?1:i)}function on(e,t,n,i){this.r=+e,this.g=+t,this.b=+n,this.opacity=+i}Yp(on,Xc,Ux(cl,{brighter(e){return e=e==null?Wc:Math.pow(Wc,e),new on(this.r*e,this.g*e,this.b*e,this.opacity)},darker(e){return e=e==null?Yo:Math.pow(Yo,e),new on(this.r*e,this.g*e,this.b*e,this.opacity)},rgb(){return this},clamp(){return new on(xs(this.r),xs(this.g),xs(this.b),qc(this.opacity))},displayable(){return-.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:zv,formatHex:zv,formatHex8:WE,formatRgb:Vv,toString:Vv}));function zv(){return`#${ds(this.r)}${ds(this.g)}${ds(this.b)}`}function WE(){return`#${ds(this.r)}${ds(this.g)}${ds(this.b)}${ds((isNaN(this.opacity)?1:this.opacity)*255)}`}function Vv(){const e=qc(this.opacity);return`${e===1?"rgb(":"rgba("}${xs(this.r)}, ${xs(this.g)}, ${xs(this.b)}${e===1?")":`, ${e})`}`}function qc(e){return isNaN(e)?1:Math.max(0,Math.min(1,e))}function xs(e){return Math.max(0,Math.min(255,Math.round(e)||0))}function ds(e){return e=xs(e),(e<16?"0":"")+e.toString(16)}function Gv(e,t,n,i){return i<=0?e=t=n=NaN:n<=0||n>=1?e=t=NaN:t<=0&&(e=NaN),new Gn(e,t,n,i)}function Ox(e){if(e instanceof Gn)return new Gn(e.h,e.s,e.l,e.opacity);if(e instanceof cl||(e=Ko(e)),!e)return new Gn;if(e instanceof Gn)return e;e=e.rgb();var t=e.r/255,n=e.g/255,i=e.b/255,r=Math.min(t,n,i),s=Math.max(t,n,i),a=NaN,o=s-r,l=(s+r)/2;return o?(t===s?a=(n-i)/o+(n<i)*6:n===s?a=(i-t)/o+2:a=(t-n)/o+4,o/=l<.5?s+r:2-s-r,a*=60):o=l>0&&l<1?0:a,new Gn(a,o,l,e.opacity)}function XE(e,t,n,i){return arguments.length===1?Ox(e):new Gn(e,t,n,i==null?1:i)}function Gn(e,t,n,i){this.h=+e,this.s=+t,this.l=+n,this.opacity=+i}Yp(Gn,XE,Ux(cl,{brighter(e){return e=e==null?Wc:Math.pow(Wc,e),new Gn(this.h,this.s,this.l*e,this.opacity)},darker(e){return e=e==null?Yo:Math.pow(Yo,e),new Gn(this.h,this.s,this.l*e,this.opacity)},rgb(){var e=this.h%360+(this.h<0)*360,t=isNaN(e)||isNaN(this.s)?0:this.s,n=this.l,i=n+(n<.5?n:1-n)*t,r=2*n-i;return new on(ih(e>=240?e-240:e+120,r,i),ih(e,r,i),ih(e<120?e+240:e-120,r,i),this.opacity)},clamp(){return new Gn(kv(this.h),El(this.s),El(this.l),qc(this.opacity))},displayable(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const e=qc(this.opacity);return`${e===1?"hsl(":"hsla("}${kv(this.h)}, ${El(this.s)*100}%, ${El(this.l)*100}%${e===1?")":`, ${e})`}`}}));function kv(e){return e=(e||0)%360,e<0?e+360:e}function El(e){return Math.max(0,Math.min(1,e||0))}function ih(e,t,n){return(e<60?t+(n-t)*e/60:e<180?n:e<240?t+(n-t)*(240-e)/60:t)*255}function qE(e,t,n,i,r){var s=e*e,a=s*e;return((1-3*e+3*s-a)*t+(4-6*s+3*a)*n+(1+3*e+3*s-3*a)*i+a*r)/6}function YE(e){var t=e.length-1;return function(n){var i=n<=0?n=0:n>=1?(n=1,t-1):Math.floor(n*t),r=e[i],s=e[i+1],a=i>0?e[i-1]:2*r-s,o=i<t-1?e[i+2]:2*s-r;return qE((n-i/t)*t,a,r,s,o)}}const Bx=e=>()=>e;function $E(e,t){return function(n){return e+n*t}}function KE(e,t,n){return e=Math.pow(e,n),t=Math.pow(t,n)-e,n=1/n,function(i){return Math.pow(e+i*t,n)}}function ZE(e){return(e=+e)==1?Hx:function(t,n){return n-t?KE(t,n,e):Bx(isNaN(t)?n:t)}}function Hx(e,t){var n=t-e;return n?$E(e,n):Bx(isNaN(e)?t:e)}const Wv=function e(t){var n=ZE(t);function i(r,s){var a=n((r=Xc(r)).r,(s=Xc(s)).r),o=n(r.g,s.g),l=n(r.b,s.b),c=Hx(r.opacity,s.opacity);return function(f){return r.r=a(f),r.g=o(f),r.b=l(f),r.opacity=c(f),r+""}}return i.gamma=e,i}(1);function JE(e){return function(t){var n=t.length,i=new Array(n),r=new Array(n),s=new Array(n),a,o;for(a=0;a<n;++a)o=Xc(t[a]),i[a]=o.r||0,r[a]=o.g||0,s[a]=o.b||0;return i=e(i),r=e(r),s=e(s),o.opacity=1,function(l){return o.r=i(l),o.g=r(l),o.b=s(l),o+""}}}var $N=JE(YE);function _r(e,t){return e=+e,t=+t,function(n){return e*(1-n)+t*n}}var Od=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,rh=new RegExp(Od.source,"g");function jE(e){return function(){return e}}function QE(e){return function(t){return e(t)+""}}function tw(e,t){var n=Od.lastIndex=rh.lastIndex=0,i,r,s,a=-1,o=[],l=[];for(e=e+"",t=t+"";(i=Od.exec(e))&&(r=rh.exec(t));)(s=r.index)>n&&(s=t.slice(n,s),o[a]?o[a]+=s:o[++a]=s),(i=i[0])===(r=r[0])?o[a]?o[a]+=r:o[++a]=r:(o[++a]=null,l.push({i:a,x:_r(i,r)})),n=rh.lastIndex;return n<t.length&&(s=t.slice(n),o[a]?o[a]+=s:o[++a]=s),o.length<2?l[0]?QE(l[0].x):jE(t):(t=l.length,function(c){for(var f=0,u;f<t;++f)o[(u=l[f]).i]=u.x(c);return o.join("")})}var Xv=180/Math.PI,Bd={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function zx(e,t,n,i,r,s){var a,o,l;return(a=Math.sqrt(e*e+t*t))&&(e/=a,t/=a),(l=e*n+t*i)&&(n-=e*l,i-=t*l),(o=Math.sqrt(n*n+i*i))&&(n/=o,i/=o,l/=o),e*i<t*n&&(e=-e,t=-t,l=-l,a=-a),{translateX:r,translateY:s,rotate:Math.atan2(t,e)*Xv,skewX:Math.atan(l)*Xv,scaleX:a,scaleY:o}}var wl;function ew(e){const t=new(typeof DOMMatrix=="function"?DOMMatrix:WebKitCSSMatrix)(e+"");return t.isIdentity?Bd:zx(t.a,t.b,t.c,t.d,t.e,t.f)}function nw(e){return e==null||(wl||(wl=document.createElementNS("http://www.w3.org/2000/svg","g")),wl.setAttribute("transform",e),!(e=wl.transform.baseVal.consolidate()))?Bd:(e=e.matrix,zx(e.a,e.b,e.c,e.d,e.e,e.f))}function Vx(e,t,n,i){function r(c){return c.length?c.pop()+" ":""}function s(c,f,u,h,d,v){if(c!==u||f!==h){var _=d.push("translate(",null,t,null,n);v.push({i:_-4,x:_r(c,u)},{i:_-2,x:_r(f,h)})}else(u||h)&&d.push("translate("+u+t+h+n)}function a(c,f,u,h){c!==f?(c-f>180?f+=360:f-c>180&&(c+=360),h.push({i:u.push(r(u)+"rotate(",null,i)-2,x:_r(c,f)})):f&&u.push(r(u)+"rotate("+f+i)}function o(c,f,u,h){c!==f?h.push({i:u.push(r(u)+"skewX(",null,i)-2,x:_r(c,f)}):f&&u.push(r(u)+"skewX("+f+i)}function l(c,f,u,h,d,v){if(c!==u||f!==h){var _=d.push(r(d)+"scale(",null,",",null,")");v.push({i:_-4,x:_r(c,u)},{i:_-2,x:_r(f,h)})}else(u!==1||h!==1)&&d.push(r(d)+"scale("+u+","+h+")")}return function(c,f){var u=[],h=[];return c=e(c),f=e(f),s(c.translateX,c.translateY,f.translateX,f.translateY,u,h),a(c.rotate,f.rotate,u,h),o(c.skewX,f.skewX,u,h),l(c.scaleX,c.scaleY,f.scaleX,f.scaleY,u,h),c=f=null,function(d){for(var v=-1,_=h.length,m;++v<_;)u[(m=h[v]).i]=m.x(d);return u.join("")}}}var iw=Vx(ew,"px, ","px)","deg)"),rw=Vx(nw,", ",")",")"),Ta=0,ao=0,Xa=0,Gx=1e3,Yc,oo,$c=0,ws=0,_u=0,Zo=typeof performance=="object"&&performance.now?performance:Date,kx=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(e){setTimeout(e,17)};function $p(){return ws||(kx(sw),ws=Zo.now()+_u)}function sw(){ws=0}function Kc(){this._call=this._time=this._next=null}Kc.prototype=Wx.prototype={constructor:Kc,restart:function(e,t,n){if(typeof e!="function")throw new TypeError("callback is not a function");n=(n==null?$p():+n)+(t==null?0:+t),!this._next&&oo!==this&&(oo?oo._next=this:Yc=this,oo=this),this._call=e,this._time=n,Hd()},stop:function(){this._call&&(this._call=null,this._time=1/0,Hd())}};function Wx(e,t,n){var i=new Kc;return i.restart(e,t,n),i}function aw(){$p(),++Ta;for(var e=Yc,t;e;)(t=ws-e._time)>=0&&e._call.call(void 0,t),e=e._next;--Ta}function qv(){ws=($c=Zo.now())+_u,Ta=ao=0;try{aw()}finally{Ta=0,lw(),ws=0}}function ow(){var e=Zo.now(),t=e-$c;t>Gx&&(_u-=t,$c=e)}function lw(){for(var e,t=Yc,n,i=1/0;t;)t._call?(i>t._time&&(i=t._time),e=t,t=t._next):(n=t._next,t._next=null,t=e?e._next=n:Yc=n);oo=e,Hd(i)}function Hd(e){if(!Ta){ao&&(ao=clearTimeout(ao));var t=e-ws;t>24?(e<1/0&&(ao=setTimeout(qv,e-Zo.now()-_u)),Xa&&(Xa=clearInterval(Xa))):(Xa||($c=Zo.now(),Xa=setInterval(ow,Gx)),Ta=1,kx(qv))}}function Yv(e,t,n){var i=new Kc;return t=t==null?0:+t,i.restart(r=>{i.stop(),e(r+t)},t,n),i}var cw=bx("start","end","cancel","interrupt"),fw=[],Xx=0,$v=1,zd=2,Sc=3,Kv=4,Vd=5,Mc=6;function gu(e,t,n,i,r,s){var a=e.__transition;if(!a)e.__transition={};else if(n in a)return;uw(e,n,{name:t,index:i,group:r,on:cw,tween:fw,time:s.time,delay:s.delay,duration:s.duration,ease:s.ease,timer:null,state:Xx})}function Kp(e,t){var n=ni(e,t);if(n.state>Xx)throw new Error("too late; already scheduled");return n}function Ri(e,t){var n=ni(e,t);if(n.state>Sc)throw new Error("too late; already running");return n}function ni(e,t){var n=e.__transition;if(!n||!(n=n[t]))throw new Error("transition not found");return n}function uw(e,t,n){var i=e.__transition,r;i[t]=n,n.timer=Wx(s,0,n.time);function s(c){n.state=$v,n.timer.restart(a,n.delay,n.time),n.delay<=c&&a(c-n.delay)}function a(c){var f,u,h,d;if(n.state!==$v)return l();for(f in i)if(d=i[f],d.name===n.name){if(d.state===Sc)return Yv(a);d.state===Kv?(d.state=Mc,d.timer.stop(),d.on.call("interrupt",e,e.__data__,d.index,d.group),delete i[f]):+f<t&&(d.state=Mc,d.timer.stop(),d.on.call("cancel",e,e.__data__,d.index,d.group),delete i[f])}if(Yv(function(){n.state===Sc&&(n.state=Kv,n.timer.restart(o,n.delay,n.time),o(c))}),n.state=zd,n.on.call("start",e,e.__data__,n.index,n.group),n.state===zd){for(n.state=Sc,r=new Array(h=n.tween.length),f=0,u=-1;f<h;++f)(d=n.tween[f].value.call(e,e.__data__,n.index,n.group))&&(r[++u]=d);r.length=u+1}}function o(c){for(var f=c<n.duration?n.ease.call(null,c/n.duration):(n.timer.restart(l),n.state=Vd,1),u=-1,h=r.length;++u<h;)r[u].call(e,f);n.state===Vd&&(n.on.call("end",e,e.__data__,n.index,n.group),l())}function l(){n.state=Mc,n.timer.stop(),delete i[t];for(var c in i)return;delete e.__transition}}function hw(e,t){var n=e.__transition,i,r,s=!0,a;if(n){t=t==null?null:t+"";for(a in n){if((i=n[a]).name!==t){s=!1;continue}r=i.state>zd&&i.state<Vd,i.state=Mc,i.timer.stop(),i.on.call(r?"interrupt":"cancel",e,e.__data__,i.index,i.group),delete n[a]}s&&delete e.__transition}}function dw(e){return this.each(function(){hw(this,e)})}function pw(e,t){var n,i;return function(){var r=Ri(this,e),s=r.tween;if(s!==n){i=n=s;for(var a=0,o=i.length;a<o;++a)if(i[a].name===t){i=i.slice(),i.splice(a,1);break}}r.tween=i}}function mw(e,t,n){var i,r;if(typeof n!="function")throw new Error;return function(){var s=Ri(this,e),a=s.tween;if(a!==i){r=(i=a).slice();for(var o={name:t,value:n},l=0,c=r.length;l<c;++l)if(r[l].name===t){r[l]=o;break}l===c&&r.push(o)}s.tween=r}}function vw(e,t){var n=this._id;if(e+="",arguments.length<2){for(var i=ni(this.node(),n).tween,r=0,s=i.length,a;r<s;++r)if((a=i[r]).name===e)return a.value;return null}return this.each((t==null?pw:mw)(n,e,t))}function Zp(e,t,n){var i=e._id;return e.each(function(){var r=Ri(this,i);(r.value||(r.value={}))[t]=n.apply(this,arguments)}),function(r){return ni(r,i).value[t]}}function qx(e,t){var n;return(typeof t=="number"?_r:t instanceof Ko?Wv:(n=Ko(t))?(t=n,Wv):tw)(e,t)}function _w(e){return function(){this.removeAttribute(e)}}function gw(e){return function(){this.removeAttributeNS(e.space,e.local)}}function xw(e,t,n){var i,r=n+"",s;return function(){var a=this.getAttribute(e);return a===r?null:a===i?s:s=t(i=a,n)}}function yw(e,t,n){var i,r=n+"",s;return function(){var a=this.getAttributeNS(e.space,e.local);return a===r?null:a===i?s:s=t(i=a,n)}}function Sw(e,t,n){var i,r,s;return function(){var a,o=n(this),l;return o==null?void this.removeAttribute(e):(a=this.getAttribute(e),l=o+"",a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o)))}}function Mw(e,t,n){var i,r,s;return function(){var a,o=n(this),l;return o==null?void this.removeAttributeNS(e.space,e.local):(a=this.getAttributeNS(e.space,e.local),l=o+"",a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o)))}}function bw(e,t){var n=vu(e),i=n==="transform"?rw:qx;return this.attrTween(e,typeof t=="function"?(n.local?Mw:Sw)(n,i,Zp(this,"attr."+e,t)):t==null?(n.local?gw:_w)(n):(n.local?yw:xw)(n,i,t))}function Tw(e,t){return function(n){this.setAttribute(e,t.call(this,n))}}function Ew(e,t){return function(n){this.setAttributeNS(e.space,e.local,t.call(this,n))}}function ww(e,t){var n,i;function r(){var s=t.apply(this,arguments);return s!==i&&(n=(i=s)&&Ew(e,s)),n}return r._value=t,r}function Aw(e,t){var n,i;function r(){var s=t.apply(this,arguments);return s!==i&&(n=(i=s)&&Tw(e,s)),n}return r._value=t,r}function Cw(e,t){var n="attr."+e;if(arguments.length<2)return(n=this.tween(n))&&n._value;if(t==null)return this.tween(n,null);if(typeof t!="function")throw new Error;var i=vu(e);return this.tween(n,(i.local?ww:Aw)(i,t))}function Rw(e,t){return function(){Kp(this,e).delay=+t.apply(this,arguments)}}function Pw(e,t){return t=+t,function(){Kp(this,e).delay=t}}function Lw(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?Rw:Pw)(t,e)):ni(this.node(),t).delay}function Dw(e,t){return function(){Ri(this,e).duration=+t.apply(this,arguments)}}function Iw(e,t){return t=+t,function(){Ri(this,e).duration=t}}function Nw(e){var t=this._id;return arguments.length?this.each((typeof e=="function"?Dw:Iw)(t,e)):ni(this.node(),t).duration}function Fw(e,t){if(typeof t!="function")throw new Error;return function(){Ri(this,e).ease=t}}function Uw(e){var t=this._id;return arguments.length?this.each(Fw(t,e)):ni(this.node(),t).ease}function Ow(e,t){return function(){var n=t.apply(this,arguments);if(typeof n!="function")throw new Error;Ri(this,e).ease=n}}function Bw(e){if(typeof e!="function")throw new Error;return this.each(Ow(this._id,e))}function Hw(e){typeof e!="function"&&(e=Ax(e));for(var t=this._groups,n=t.length,i=new Array(n),r=0;r<n;++r)for(var s=t[r],a=s.length,o=i[r]=[],l,c=0;c<a;++c)(l=s[c])&&e.call(l,l.__data__,c,s)&&o.push(l);return new tr(i,this._parents,this._name,this._id)}function zw(e){if(e._id!==this._id)throw new Error;for(var t=this._groups,n=e._groups,i=t.length,r=n.length,s=Math.min(i,r),a=new Array(i),o=0;o<s;++o)for(var l=t[o],c=n[o],f=l.length,u=a[o]=new Array(f),h,d=0;d<f;++d)(h=l[d]||c[d])&&(u[d]=h);for(;o<i;++o)a[o]=t[o];return new tr(a,this._parents,this._name,this._id)}function Vw(e){return(e+"").trim().split(/^|\s+/).every(function(t){var n=t.indexOf(".");return n>=0&&(t=t.slice(0,n)),!t||t==="start"})}function Gw(e,t,n){var i,r,s=Vw(t)?Kp:Ri;return function(){var a=s(this,e),o=a.on;o!==i&&(r=(i=o).copy()).on(t,n),a.on=r}}function kw(e,t){var n=this._id;return arguments.length<2?ni(this.node(),n).on.on(e):this.each(Gw(n,e,t))}function Ww(e){return function(){var t=this.parentNode;for(var n in this.__transition)if(+n!==e)return;t&&t.removeChild(this)}}function Xw(){return this.on("end.remove",Ww(this._id))}function qw(e){var t=this._name,n=this._id;typeof e!="function"&&(e=Xp(e));for(var i=this._groups,r=i.length,s=new Array(r),a=0;a<r;++a)for(var o=i[a],l=o.length,c=s[a]=new Array(l),f,u,h=0;h<l;++h)(f=o[h])&&(u=e.call(f,f.__data__,h,o))&&("__data__"in f&&(u.__data__=f.__data__),c[h]=u,gu(c[h],t,n,h,c,ni(f,n)));return new tr(s,this._parents,t,n)}function Yw(e){var t=this._name,n=this._id;typeof e!="function"&&(e=Ex(e));for(var i=this._groups,r=i.length,s=[],a=[],o=0;o<r;++o)for(var l=i[o],c=l.length,f,u=0;u<c;++u)if(f=l[u]){for(var h=e.call(f,f.__data__,u,l),d,v=ni(f,n),_=0,m=h.length;_<m;++_)(d=h[_])&&gu(d,t,n,_,h,v);s.push(h),a.push(f)}return new tr(s,a,t,n)}var $w=ll.prototype.constructor;function Kw(){return new $w(this._groups,this._parents)}function Zw(e,t){var n,i,r;return function(){var s=ba(this,e),a=(this.style.removeProperty(e),ba(this,e));return s===a?null:s===n&&a===i?r:r=t(n=s,i=a)}}function Yx(e){return function(){this.style.removeProperty(e)}}function Jw(e,t,n){var i,r=n+"",s;return function(){var a=ba(this,e);return a===r?null:a===i?s:s=t(i=a,n)}}function jw(e,t,n){var i,r,s;return function(){var a=ba(this,e),o=n(this),l=o+"";return o==null&&(l=o=(this.style.removeProperty(e),ba(this,e))),a===l?null:a===i&&l===r?s:(r=l,s=t(i=a,o))}}function Qw(e,t){var n,i,r,s="style."+t,a="end."+s,o;return function(){var l=Ri(this,e),c=l.on,f=l.value[s]==null?o||(o=Yx(t)):void 0;(c!==n||r!==f)&&(i=(n=c).copy()).on(a,r=f),l.on=i}}function tA(e,t,n){var i=(e+="")=="transform"?iw:qx;return t==null?this.styleTween(e,Zw(e,i)).on("end.style."+e,Yx(e)):typeof t=="function"?this.styleTween(e,jw(e,i,Zp(this,"style."+e,t))).each(Qw(this._id,e)):this.styleTween(e,Jw(e,i,t),n).on("end.style."+e,null)}function eA(e,t,n){return function(i){this.style.setProperty(e,t.call(this,i),n)}}function nA(e,t,n){var i,r;function s(){var a=t.apply(this,arguments);return a!==r&&(i=(r=a)&&eA(e,a,n)),i}return s._value=t,s}function iA(e,t,n){var i="style."+(e+="");if(arguments.length<2)return(i=this.tween(i))&&i._value;if(t==null)return this.tween(i,null);if(typeof t!="function")throw new Error;return this.tween(i,nA(e,t,n==null?"":n))}function rA(e){return function(){this.textContent=e}}function sA(e){return function(){var t=e(this);this.textContent=t==null?"":t}}function aA(e){return this.tween("text",typeof e=="function"?sA(Zp(this,"text",e)):rA(e==null?"":e+""))}function oA(e){return function(t){this.textContent=e.call(this,t)}}function lA(e){var t,n;function i(){var r=e.apply(this,arguments);return r!==n&&(t=(n=r)&&oA(r)),t}return i._value=e,i}function cA(e){var t="text";if(arguments.length<1)return(t=this.tween(t))&&t._value;if(e==null)return this.tween(t,null);if(typeof e!="function")throw new Error;return this.tween(t,lA(e))}function fA(){for(var e=this._name,t=this._id,n=$x(),i=this._groups,r=i.length,s=0;s<r;++s)for(var a=i[s],o=a.length,l,c=0;c<o;++c)if(l=a[c]){var f=ni(l,t);gu(l,e,n,c,a,{time:f.time+f.delay+f.duration,delay:0,duration:f.duration,ease:f.ease})}return new tr(i,this._parents,e,n)}function uA(){var e,t,n=this,i=n._id,r=n.size();return new Promise(function(s,a){var o={value:a},l={value:function(){--r===0&&s()}};n.each(function(){var c=Ri(this,i),f=c.on;f!==e&&(t=(e=f).copy(),t._.cancel.push(o),t._.interrupt.push(o),t._.end.push(l)),c.on=t}),r===0&&s()})}var hA=0;function tr(e,t,n,i){this._groups=e,this._parents=t,this._name=n,this._id=i}function $x(){return++hA}var Ni=ll.prototype;tr.prototype={constructor:tr,select:qw,selectAll:Yw,selectChild:Ni.selectChild,selectChildren:Ni.selectChildren,filter:Hw,merge:zw,selection:Kw,transition:fA,call:Ni.call,nodes:Ni.nodes,node:Ni.node,size:Ni.size,empty:Ni.empty,each:Ni.each,on:kw,attr:bw,attrTween:Cw,style:tA,styleTween:iA,text:aA,textTween:cA,remove:Xw,tween:vw,delay:Lw,duration:Nw,ease:Uw,easeVarying:Bw,end:uA,[Symbol.iterator]:Ni[Symbol.iterator]};function dA(e){return((e*=2)<=1?e*e*e:(e-=2)*e*e+2)/2}var pA={time:null,delay:0,duration:250,ease:dA};function mA(e,t){for(var n;!(n=e.__transition)||!(n=n[t]);)if(!(e=e.parentNode))throw new Error(`transition ${t} not found`);return n}function vA(e){var t,n;e instanceof tr?(t=e._id,e=e._name):(t=$x(),(n=pA).time=$p(),e=e==null?null:e+"");for(var i=this._groups,r=i.length,s=0;s<r;++s)for(var a=i[s],o=a.length,l,c=0;c<o;++c)(l=a[c])&&gu(l,e,t,c,a,n||mA(l,t));return new tr(i,this._parents,e,t)}ll.prototype.interrupt=dw;ll.prototype.transition=vA;var _A=Array.prototype,gA=_A.slice;function xA(e,t){return e-t}function yA(e){for(var t=0,n=e.length,i=e[n-1][1]*e[0][0]-e[n-1][0]*e[0][1];++t<n;)i+=e[t-1][1]*e[t][0]-e[t-1][0]*e[t][1];return i}const Zv=e=>()=>e;function SA(e,t){for(var n=-1,i=t.length,r;++n<i;)if(r=MA(e,t[n]))return r;return 0}function MA(e,t){for(var n=t[0],i=t[1],r=-1,s=0,a=e.length,o=a-1;s<a;o=s++){var l=e[s],c=l[0],f=l[1],u=e[o],h=u[0],d=u[1];if(bA(l,u,t))return 0;f>i!=d>i&&n<(h-c)*(i-f)/(d-f)+c&&(r=-r)}return r}function bA(e,t,n){var i;return TA(e,t,n)&&EA(e[i=+(e[0]===t[0])],n[i],t[i])}function TA(e,t,n){return(t[0]-e[0])*(n[1]-e[1])===(n[0]-e[0])*(t[1]-e[1])}function EA(e,t,n){return e<=t&&t<=n||n<=t&&t<=e}function wA(){}var Fi=[[],[[[1,1.5],[.5,1]]],[[[1.5,1],[1,1.5]]],[[[1.5,1],[.5,1]]],[[[1,.5],[1.5,1]]],[[[1,1.5],[.5,1]],[[1,.5],[1.5,1]]],[[[1,.5],[1,1.5]]],[[[1,.5],[.5,1]]],[[[.5,1],[1,.5]]],[[[1,1.5],[1,.5]]],[[[.5,1],[1,.5]],[[1.5,1],[1,1.5]]],[[[1.5,1],[1,.5]]],[[[.5,1],[1.5,1]]],[[[1,1.5],[1.5,1]]],[[[.5,1],[1,1.5]]],[]];function KN(){var e=1,t=1,n=Jb,i=l;function r(c){var f=n(c);if(Array.isArray(f))f=f.slice().sort(xA);else{const u=Wb(c,AA);for(f=$b(...Zb(u[0],u[1],f),f);f[f.length-1]>=u[1];)f.pop();for(;f[1]<u[0];)f.shift()}return f.map(u=>s(c,u))}function s(c,f){const u=f==null?NaN:+f;if(isNaN(u))throw new Error(`invalid value: ${f}`);var h=[],d=[];return a(c,u,function(v){i(v,c,u),yA(v)>0?h.push([v]):d.push(v)}),d.forEach(function(v){for(var _=0,m=h.length,p;_<m;++_)if(SA((p=h[_])[0],v)!==-1){p.push(v);return}}),{type:"MultiPolygon",value:f,coordinates:h}}function a(c,f,u){var h=new Array,d=new Array,v,_,m,p,x,b;for(v=_=-1,p=Hr(c[0],f),Fi[p<<1].forEach(S);++v<e-1;)m=p,p=Hr(c[v+1],f),Fi[m|p<<1].forEach(S);for(Fi[p<<0].forEach(S);++_<t-1;){for(v=-1,p=Hr(c[_*e+e],f),x=Hr(c[_*e],f),Fi[p<<1|x<<2].forEach(S);++v<e-1;)m=p,p=Hr(c[_*e+e+v+1],f),b=x,x=Hr(c[_*e+v+1],f),Fi[m|p<<1|x<<2|b<<3].forEach(S);Fi[p|x<<3].forEach(S)}for(v=-1,x=c[_*e]>=f,Fi[x<<2].forEach(S);++v<e-1;)b=x,x=Hr(c[_*e+v+1],f),Fi[x<<2|b<<3].forEach(S);Fi[x<<3].forEach(S);function S(T){var E=[T[0][0]+v,T[0][1]+_],C=[T[1][0]+v,T[1][1]+_],R=o(E),g=o(C),M,P;(M=d[R])?(P=h[g])?(delete d[M.end],delete h[P.start],M===P?(M.ring.push(C),u(M.ring)):h[M.start]=d[P.end]={start:M.start,end:P.end,ring:M.ring.concat(P.ring)}):(delete d[M.end],M.ring.push(C),d[M.end=g]=M):(M=h[g])?(P=d[R])?(delete h[M.start],delete d[P.end],M===P?(M.ring.push(C),u(M.ring)):h[P.start]=d[M.end]={start:P.start,end:M.end,ring:P.ring.concat(M.ring)}):(delete h[M.start],M.ring.unshift(E),h[M.start=R]=M):h[R]=d[g]={start:R,end:g,ring:[E,C]}}}function o(c){return c[0]*2+c[1]*(e+1)*4}function l(c,f,u){c.forEach(function(h){var d=h[0],v=h[1],_=d|0,m=v|0,p=sh(f[m*e+_]);d>0&&d<e&&_===d&&(h[0]=Jv(d,sh(f[m*e+_-1]),p,u)),v>0&&v<t&&m===v&&(h[1]=Jv(v,sh(f[(m-1)*e+_]),p,u))})}return r.contour=s,r.size=function(c){if(!arguments.length)return[e,t];var f=Math.floor(c[0]),u=Math.floor(c[1]);if(!(f>=0&&u>=0))throw new Error("invalid size");return e=f,t=u,r},r.thresholds=function(c){return arguments.length?(n=typeof c=="function"?c:Array.isArray(c)?Zv(gA.call(c)):Zv(c),r):n},r.smooth=function(c){return arguments.length?(i=c?l:wA,r):i===l},r}function AA(e){return isFinite(e)?e:NaN}function Hr(e,t){return e==null?!1:+e>=t}function sh(e){return e==null||isNaN(e=+e)?-1/0:e}function Jv(e,t,n,i){const r=i-t,s=n-t,a=isFinite(r)||isFinite(s)?r/s:Math.sign(r)/Math.sign(s);return isNaN(a)?e:e+a-.5}function lo(e,t,n){this.k=e,this.x=t,this.y=n}lo.prototype={constructor:lo,scale:function(e){return e===1?this:new lo(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new lo(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};lo.prototype;/*! *****************************************************************************
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
***************************************************************************** */var Gd=function(e,t){return Gd=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,i){n.__proto__=i}||function(n,i){for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(n[r]=i[r])},Gd(e,t)};function ue(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Gd(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var CA=function(){function e(){this.firefox=!1,this.ie=!1,this.edge=!1,this.newEdge=!1,this.weChat=!1}return e}(),RA=function(){function e(){this.browser=new CA,this.node=!1,this.wxa=!1,this.worker=!1,this.svgSupported=!1,this.touchEventsSupported=!1,this.pointerEventsSupported=!1,this.domSupported=!1,this.transformSupported=!1,this.transform3dSupported=!1,this.hasGlobalWindow=typeof window!="undefined"}return e}(),ge=new RA;typeof wx=="object"&&typeof wx.getSystemInfoSync=="function"?(ge.wxa=!0,ge.touchEventsSupported=!0):typeof document=="undefined"&&typeof self!="undefined"?ge.worker=!0:!ge.hasGlobalWindow||"Deno"in window||typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Node.js")>-1?(ge.node=!0,ge.svgSupported=!0):PA(navigator.userAgent,ge);function PA(e,t){var n=t.browser,i=e.match(/Firefox\/([\d.]+)/),r=e.match(/MSIE\s([\d.]+)/)||e.match(/Trident\/.+?rv:(([\d.]+))/),s=e.match(/Edge?\/([\d.]+)/),a=/micromessenger/i.test(e);i&&(n.firefox=!0,n.version=i[1]),r&&(n.ie=!0,n.version=r[1]),s&&(n.edge=!0,n.version=s[1],n.newEdge=+s[1].split(".")[0]>18),a&&(n.weChat=!0),t.svgSupported=typeof SVGRect!="undefined",t.touchEventsSupported="ontouchstart"in window&&!n.ie&&!n.edge,t.pointerEventsSupported="onpointerdown"in window&&(n.edge||n.ie&&+n.version>=11);var o=t.domSupported=typeof document!="undefined";if(o){var l=document.documentElement.style;t.transform3dSupported=(n.ie&&"transition"in l||n.edge||"WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix||"MozPerspective"in l)&&!("OTransition"in l),t.transformSupported=t.transform3dSupported||n.ie&&+n.version>=9}}var Jp=12,LA="sans-serif",Pr=Jp+"px "+LA,DA=20,IA=100,NA="007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";function FA(e){var t={};if(typeof JSON=="undefined")return t;for(var n=0;n<e.length;n++){var i=String.fromCharCode(n+32),r=(e.charCodeAt(n)-DA)/IA;t[i]=r}return t}var UA=FA(NA),As={createCanvas:function(){return typeof document!="undefined"&&document.createElement("canvas")},measureText:function(){var e,t;return function(n,i){if(!e){var r=As.createCanvas();e=r&&r.getContext("2d")}if(e)return t!==i&&(t=e.font=i||Pr),e.measureText(n);n=n||"",i=i||Pr;var s=/((?:\d+)?\.?\d*)px/.exec(i),a=s&&+s[1]||Jp,o=0;if(i.indexOf("mono")>=0)o=a*n.length;else for(var l=0;l<n.length;l++){var c=UA[n[l]];o+=c==null?a:c*a}return{width:o}}}(),loadImage:function(e,t,n){var i=new Image;return i.onload=t,i.onerror=n,i.src=e,i}},Kx=yu(["Function","RegExp","Date","Error","CanvasGradient","CanvasPattern","Image","Canvas"],function(e,t){return e["[object "+t+"]"]=!0,e},{}),Zx=yu(["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64"],function(e,t){return e["[object "+t+"Array]"]=!0,e},{}),fl=Object.prototype.toString,xu=Array.prototype,OA=xu.forEach,BA=xu.filter,jp=xu.slice,HA=xu.map,jv=function(){}.constructor,Al=jv?jv.prototype:null,Qp="__proto__",zA=2311;function Jx(){return zA++}function tm(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];typeof console!="undefined"&&console.error.apply(console,e)}function Ea(e){if(e==null||typeof e!="object")return e;var t=e,n=fl.call(e);if(n==="[object Array]"){if(!Co(e)){t=[];for(var i=0,r=e.length;i<r;i++)t[i]=Ea(e[i])}}else if(Zx[n]){if(!Co(e)){var s=e.constructor;if(s.from)t=s.from(e);else{t=new s(e.length);for(var i=0,r=e.length;i<r;i++)t[i]=e[i]}}}else if(!Kx[n]&&!Co(e)&&!kd(e)){t={};for(var a in e)e.hasOwnProperty(a)&&a!==Qp&&(t[a]=Ea(e[a]))}return t}function co(e,t,n){if(!yr(t)||!yr(e))return n?Ea(t):e;for(var i in t)if(t.hasOwnProperty(i)&&i!==Qp){var r=e[i],s=t[i];yr(s)&&yr(r)&&!Jo(s)&&!Jo(r)&&!kd(s)&&!kd(r)&&!t_(s)&&!t_(r)&&!Co(s)&&!Co(r)?co(r,s,n):(n||!(i in e))&&(e[i]=Ea(t[i]))}return e}function _e(e,t){if(Object.assign)Object.assign(e,t);else for(var n in t)t.hasOwnProperty(n)&&n!==Qp&&(e[n]=t[n]);return e}function Ds(e,t,n){for(var i=yn(t),r=0,s=i.length;r<s;r++){var a=i[r];e[a]==null&&(e[a]=t[a])}return e}function di(e,t){if(e){if(e.indexOf)return e.indexOf(t);for(var n=0,i=e.length;n<i;n++)if(e[n]===t)return n}return-1}function ZN(e,t){var n=e.prototype;function i(){}i.prototype=t.prototype,e.prototype=new i;for(var r in n)n.hasOwnProperty(r)&&(e.prototype[r]=n[r]);e.prototype.constructor=e,e.superClass=t}function jx(e,t,n){if(e="prototype"in e?e.prototype:e,t="prototype"in t?t.prototype:t,Object.getOwnPropertyNames)for(var i=Object.getOwnPropertyNames(t),r=0;r<i.length;r++){var s=i[r];s!=="constructor"&&e[s]==null&&(e[s]=t[s])}else Ds(e,t)}function Ti(e){return!e||typeof e=="string"?!1:typeof e.length=="number"}function ln(e,t,n){if(e&&t)if(e.forEach&&e.forEach===OA)e.forEach(t,n);else if(e.length===+e.length)for(var i=0,r=e.length;i<r;i++)t.call(n,e[i],i,e);else for(var s in e)e.hasOwnProperty(s)&&t.call(n,e[s],s,e)}function wa(e,t,n){if(!e)return[];if(!t)return Qx(e);if(e.map&&e.map===HA)return e.map(t,n);for(var i=[],r=0,s=e.length;r<s;r++)i.push(t.call(n,e[r],r,e));return i}function yu(e,t,n,i){if(e&&t){for(var r=0,s=e.length;r<s;r++)n=t.call(i,n,e[r],r,e);return n}}function Qv(e,t,n){if(!e)return[];if(!t)return Qx(e);if(e.filter&&e.filter===BA)return e.filter(t,n);for(var i=[],r=0,s=e.length;r<s;r++)t.call(n,e[r],r,e)&&i.push(e[r]);return i}function JN(e,t,n){if(e&&t){for(var i=0,r=e.length;i<r;i++)if(t.call(n,e[i],i,e))return e[i]}}function yn(e){if(!e)return[];if(Object.keys)return Object.keys(e);var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t}function VA(e,t){for(var n=[],i=2;i<arguments.length;i++)n[i-2]=arguments[i];return function(){return e.apply(t,n.concat(jp.call(arguments)))}}var jN=Al&&ys(Al.bind)?Al.call.bind(Al.bind):VA;function QN(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return function(){return e.apply(this,t.concat(jp.call(arguments)))}}function Jo(e){return Array.isArray?Array.isArray(e):fl.call(e)==="[object Array]"}function ys(e){return typeof e=="function"}function Zc(e){return typeof e=="string"}function tF(e){return fl.call(e)==="[object String]"}function bc(e){return typeof e=="number"}function yr(e){var t=typeof e;return t==="function"||!!e&&t==="object"}function t_(e){return!!Kx[fl.call(e)]}function GA(e){return!!Zx[fl.call(e)]}function kd(e){return typeof e=="object"&&typeof e.nodeType=="number"&&typeof e.ownerDocument=="object"}function Su(e){return e.colorStops!=null}function kA(e){return e.image!=null}function WA(e){return e!==e}function eF(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var n=0,i=e.length;n<i;n++)if(e[n]!=null)return e[n]}function Ln(e,t){return e!=null?e:t}function Tc(e,t,n){return e!=null?e:t!=null?t:n}function Qx(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return jp.apply(e,t)}function XA(e){if(typeof e=="number")return[e,e,e,e];var t=e.length;return t===2?[e[0],e[1],e[0],e[1]]:t===3?[e[0],e[1],e[2],e[1]]:e}function nF(e,t){if(!e)throw new Error(t)}function fo(e){return e==null?null:typeof e.trim=="function"?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}var ty="__ec_primitive__";function iF(e){e[ty]=!0}function Co(e){return e[ty]}var qA=function(){function e(){this.data={}}return e.prototype.delete=function(t){var n=this.has(t);return n&&delete this.data[t],n},e.prototype.has=function(t){return this.data.hasOwnProperty(t)},e.prototype.get=function(t){return this.data[t]},e.prototype.set=function(t,n){return this.data[t]=n,this},e.prototype.keys=function(){return yn(this.data)},e.prototype.forEach=function(t){var n=this.data;for(var i in n)n.hasOwnProperty(i)&&t(n[i],i)},e}(),ey=typeof Map=="function";function YA(){return ey?new Map:new qA}var $A=function(){function e(t){var n=Jo(t);this.data=YA();var i=this;t instanceof e?t.each(r):t&&ln(t,r);function r(s,a){n?i.set(s,a):i.set(a,s)}}return e.prototype.hasKey=function(t){return this.data.has(t)},e.prototype.get=function(t){return this.data.get(t)},e.prototype.set=function(t,n){return this.data.set(t,n),n},e.prototype.each=function(t,n){this.data.forEach(function(i,r){t.call(n,i,r)})},e.prototype.keys=function(){var t=this.data.keys();return ey?Array.from(t):t},e.prototype.removeKey=function(t){this.data.delete(t)},e}();function rF(e){return new $A(e)}function sF(e,t){for(var n=new e.constructor(e.length+t.length),i=0;i<e.length;i++)n[i]=e[i];for(var r=e.length,i=0;i<t.length;i++)n[i+r]=t[i];return n}function Mu(e,t){var n;if(Object.create)n=Object.create(e);else{var i=function(){};i.prototype=e,n=new i}return t&&_e(n,t),n}function ny(e){var t=e.style;t.webkitUserSelect="none",t.userSelect="none",t.webkitTapHighlightColor="rgba(0,0,0,0)",t["-webkit-touch-callout"]="none"}function aF(e,t){return e.hasOwnProperty(t)}function _a(){}var KA=180/Math.PI;function Fa(e,t){return e==null&&(e=0),t==null&&(t=0),[e,t]}function ZA(e){return[e[0],e[1]]}function e_(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}function JA(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e}function jA(e){return Math.sqrt(QA(e))}function QA(e){return e[0]*e[0]+e[1]*e[1]}function ah(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e}function tC(e,t){var n=jA(t);return n===0?(e[0]=0,e[1]=0):(e[0]=t[0]/n,e[1]=t[1]/n),e}function Wd(e,t){return Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1]))}var eC=Wd;function nC(e,t){return(e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])}var ga=nC;function Ro(e,t,n){var i=t[0],r=t[1];return e[0]=n[0]*i+n[2]*r+n[4],e[1]=n[1]*i+n[3]*r+n[5],e}function sa(e,t,n){return e[0]=Math.min(t[0],n[0]),e[1]=Math.min(t[1],n[1]),e}function aa(e,t,n){return e[0]=Math.max(t[0],n[0]),e[1]=Math.max(t[1],n[1]),e}var Os=function(){function e(t,n){this.target=t,this.topTarget=n&&n.topTarget}return e}(),iC=function(){function e(t){this.handler=t,t.on("mousedown",this._dragStart,this),t.on("mousemove",this._drag,this),t.on("mouseup",this._dragEnd,this)}return e.prototype._dragStart=function(t){for(var n=t.target;n&&!n.draggable;)n=n.parent||n.__hostTarget;n&&(this._draggingTarget=n,n.dragging=!0,this._x=t.offsetX,this._y=t.offsetY,this.handler.dispatchToElement(new Os(n,t),"dragstart",t.event))},e.prototype._drag=function(t){var n=this._draggingTarget;if(n){var i=t.offsetX,r=t.offsetY,s=i-this._x,a=r-this._y;this._x=i,this._y=r,n.drift(s,a,t),this.handler.dispatchToElement(new Os(n,t),"drag",t.event);var o=this.handler.findHover(i,r,n).target,l=this._dropTarget;this._dropTarget=o,n!==o&&(l&&o!==l&&this.handler.dispatchToElement(new Os(l,t),"dragleave",t.event),o&&o!==l&&this.handler.dispatchToElement(new Os(o,t),"dragenter",t.event))}},e.prototype._dragEnd=function(t){var n=this._draggingTarget;n&&(n.dragging=!1),this.handler.dispatchToElement(new Os(n,t),"dragend",t.event),this._dropTarget&&this.handler.dispatchToElement(new Os(this._dropTarget,t),"drop",t.event),this._draggingTarget=null,this._dropTarget=null},e}(),Ua=function(){function e(t){t&&(this._$eventProcessor=t)}return e.prototype.on=function(t,n,i,r){this._$handlers||(this._$handlers={});var s=this._$handlers;if(typeof n=="function"&&(r=i,i=n,n=null),!i||!t)return this;var a=this._$eventProcessor;n!=null&&a&&a.normalizeQuery&&(n=a.normalizeQuery(n)),s[t]||(s[t]=[]);for(var o=0;o<s[t].length;o++)if(s[t][o].h===i)return this;var l={h:i,query:n,ctx:r||this,callAtLast:i.zrEventfulCallAtLast},c=s[t].length-1,f=s[t][c];return f&&f.callAtLast?s[t].splice(c,0,l):s[t].push(l),this},e.prototype.isSilent=function(t){var n=this._$handlers;return!n||!n[t]||!n[t].length},e.prototype.off=function(t,n){var i=this._$handlers;if(!i)return this;if(!t)return this._$handlers={},this;if(n){if(i[t]){for(var r=[],s=0,a=i[t].length;s<a;s++)i[t][s].h!==n&&r.push(i[t][s]);i[t]=r}i[t]&&i[t].length===0&&delete i[t]}else delete i[t];return this},e.prototype.trigger=function(t){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];if(!this._$handlers)return this;var r=this._$handlers[t],s=this._$eventProcessor;if(r)for(var a=n.length,o=r.length,l=0;l<o;l++){var c=r[l];if(!(s&&s.filter&&c.query!=null&&!s.filter(t,c.query)))switch(a){case 0:c.h.call(c.ctx);break;case 1:c.h.call(c.ctx,n[0]);break;case 2:c.h.call(c.ctx,n[0],n[1]);break;default:c.h.apply(c.ctx,n);break}}return s&&s.afterTrigger&&s.afterTrigger(t),this},e.prototype.triggerWithContext=function(t){for(var n=[],i=1;i<arguments.length;i++)n[i-1]=arguments[i];if(!this._$handlers)return this;var r=this._$handlers[t],s=this._$eventProcessor;if(r)for(var a=n.length,o=n[a-1],l=r.length,c=0;c<l;c++){var f=r[c];if(!(s&&s.filter&&f.query!=null&&!s.filter(t,f.query)))switch(a){case 0:f.h.call(o);break;case 1:f.h.call(o,n[0]);break;case 2:f.h.call(o,n[0],n[1]);break;default:f.h.apply(o,n.slice(1,a-1));break}}return s&&s.afterTrigger&&s.afterTrigger(t),this},e}(),rC=Math.log(2);function Xd(e,t,n,i,r,s){var a=i+"-"+r,o=e.length;if(s.hasOwnProperty(a))return s[a];if(t===1){var l=Math.round(Math.log((1<<o)-1&~r)/rC);return e[n][l]}for(var c=i|1<<n,f=n+1;i&1<<f;)f++;for(var u=0,h=0,d=0;h<o;h++){var v=1<<h;v&r||(u+=(d%2?-1:1)*e[n][h]*Xd(e,t-1,f,c,r|v,s),d++)}return s[a]=u,u}function n_(e,t){var n=[[e[0],e[1],1,0,0,0,-t[0]*e[0],-t[0]*e[1]],[0,0,0,e[0],e[1],1,-t[1]*e[0],-t[1]*e[1]],[e[2],e[3],1,0,0,0,-t[2]*e[2],-t[2]*e[3]],[0,0,0,e[2],e[3],1,-t[3]*e[2],-t[3]*e[3]],[e[4],e[5],1,0,0,0,-t[4]*e[4],-t[4]*e[5]],[0,0,0,e[4],e[5],1,-t[5]*e[4],-t[5]*e[5]],[e[6],e[7],1,0,0,0,-t[6]*e[6],-t[6]*e[7]],[0,0,0,e[6],e[7],1,-t[7]*e[6],-t[7]*e[7]]],i={},r=Xd(n,8,0,0,0,i);if(r!==0){for(var s=[],a=0;a<8;a++)for(var o=0;o<8;o++)s[o]==null&&(s[o]=0),s[o]+=((a+o)%2?-1:1)*Xd(n,7,a===0?1:0,1<<a,1<<o,i)/r*t[a];return function(l,c,f){var u=c*s[6]+f*s[7]+1;l[0]=(c*s[0]+f*s[1]+s[2])/u,l[1]=(c*s[3]+f*s[4]+s[5])/u}}}var Jc="___zrEVENTSAVED",oh=[];function oF(e,t,n,i,r){return qd(oh,t,i,r,!0)&&qd(e,n,oh[0],oh[1])}function lF(e,t){e&&n(e),t&&n(t);function n(i){var r=i[Jc];r&&(r.clearMarkers&&r.clearMarkers(),delete i[Jc])}}function qd(e,t,n,i,r){if(t.getBoundingClientRect&&ge.domSupported&&!iy(t)){var s=t[Jc]||(t[Jc]={}),a=sC(t,s),o=aC(a,s,r);if(o)return o(e,n,i),!0}return!1}function sC(e,t){var n=t.markers;if(n)return n;n=t.markers=[];for(var i=["left","right"],r=["top","bottom"],s=0;s<4;s++){var a=document.createElement("div"),o=a.style,l=s%2,c=(s>>1)%2;o.cssText=["position: absolute","visibility: hidden","padding: 0","margin: 0","border-width: 0","user-select: none","width:0","height:0",i[l]+":0",r[c]+":0",i[1-l]+":auto",r[1-c]+":auto",""].join("!important;"),e.appendChild(a),n.push(a)}return t.clearMarkers=function(){ln(n,function(f){f.parentNode&&f.parentNode.removeChild(f)})},n}function aC(e,t,n){for(var i=n?"invTrans":"trans",r=t[i],s=t.srcCoords,a=[],o=[],l=!0,c=0;c<4;c++){var f=e[c].getBoundingClientRect(),u=2*c,h=f.left,d=f.top;a.push(h,d),l=l&&s&&h===s[u]&&d===s[u+1],o.push(e[c].offsetLeft,e[c].offsetTop)}return l&&r?r:(t.srcCoords=a,t[i]=n?n_(o,a):n_(a,o))}function iy(e){return e.nodeName.toUpperCase()==="CANVAS"}var oC=/([&<>"'])/g,lC={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function cF(e){return e==null?"":(e+"").replace(oC,function(t,n){return lC[n]})}var cC=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,lh=[],fC=ge.browser.firefox&&+ge.browser.version.split(".")[0]<39;function Yd(e,t,n,i){return n=n||{},i?i_(e,t,n):fC&&t.layerX!=null&&t.layerX!==t.offsetX?(n.zrX=t.layerX,n.zrY=t.layerY):t.offsetX!=null?(n.zrX=t.offsetX,n.zrY=t.offsetY):i_(e,t,n),n}function i_(e,t,n){if(ge.domSupported&&e.getBoundingClientRect){var i=t.clientX,r=t.clientY;if(iy(e)){var s=e.getBoundingClientRect();n.zrX=i-s.left,n.zrY=r-s.top;return}else if(qd(lh,e,i,r)){n.zrX=lh[0],n.zrY=lh[1];return}}n.zrX=n.zrY=0}function em(e){return e||window.event}function Hn(e,t,n){if(t=em(t),t.zrX!=null)return t;var i=t.type,r=i&&i.indexOf("touch")>=0;if(r){var a=i!=="touchend"?t.targetTouches[0]:t.changedTouches[0];a&&Yd(e,a,t,n)}else{Yd(e,t,t,n);var s=uC(t);t.zrDelta=s?s/120:-(t.detail||0)/3}var o=t.button;return t.which==null&&o!==void 0&&cC.test(t.type)&&(t.which=o&1?1:o&2?3:o&4?2:0),t}function uC(e){var t=e.wheelDelta;if(t)return t;var n=e.deltaX,i=e.deltaY;if(n==null||i==null)return t;var r=Math.abs(i!==0?i:n),s=i>0?-1:i<0?1:n>0?-1:1;return 3*r*s}function hC(e,t,n,i){e.addEventListener(t,n,i)}function dC(e,t,n,i){e.removeEventListener(t,n,i)}var pC=function(e){e.preventDefault(),e.stopPropagation(),e.cancelBubble=!0};function fF(e){return e.which===2||e.which===3}var mC=function(){function e(){this._track=[]}return e.prototype.recognize=function(t,n,i){return this._doTrack(t,n,i),this._recognize(t)},e.prototype.clear=function(){return this._track.length=0,this},e.prototype._doTrack=function(t,n,i){var r=t.touches;if(r){for(var s={points:[],touches:[],target:n,event:t},a=0,o=r.length;a<o;a++){var l=r[a],c=Yd(i,l,{});s.points.push([c.zrX,c.zrY]),s.touches.push(l)}this._track.push(s)}},e.prototype._recognize=function(t){for(var n in ch)if(ch.hasOwnProperty(n)){var i=ch[n](this._track,t);if(i)return i}},e}();function r_(e){var t=e[1][0]-e[0][0],n=e[1][1]-e[0][1];return Math.sqrt(t*t+n*n)}function vC(e){return[(e[0][0]+e[1][0])/2,(e[0][1]+e[1][1])/2]}var ch={pinch:function(e,t){var n=e.length;if(n){var i=(e[n-1]||{}).points,r=(e[n-2]||{}).points||i;if(r&&r.length>1&&i&&i.length>1){var s=r_(i)/r_(r);!isFinite(s)&&(s=1),t.pinchScale=s;var a=vC(i);return t.pinchX=a[0],t.pinchY=a[1],{type:"pinch",target:e[0].target,event:t}}}}};function Po(){return[1,0,0,1,0,0]}function _C(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e}function gC(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function fh(e,t,n){var i=t[0]*n[0]+t[2]*n[1],r=t[1]*n[0]+t[3]*n[1],s=t[0]*n[2]+t[2]*n[3],a=t[1]*n[2]+t[3]*n[3],o=t[0]*n[4]+t[2]*n[5]+t[4],l=t[1]*n[4]+t[3]*n[5]+t[5];return e[0]=i,e[1]=r,e[2]=s,e[3]=a,e[4]=o,e[5]=l,e}function s_(e,t,n){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4]+n[0],e[5]=t[5]+n[1],e}function xC(e,t,n,i){i===void 0&&(i=[0,0]);var r=t[0],s=t[2],a=t[4],o=t[1],l=t[3],c=t[5],f=Math.sin(n),u=Math.cos(n);return e[0]=r*u+o*f,e[1]=-r*f+o*u,e[2]=s*u+l*f,e[3]=-s*f+u*l,e[4]=u*(a-i[0])+f*(c-i[1])+i[0],e[5]=u*(c-i[1])-f*(a-i[0])+i[1],e}function yC(e,t,n){var i=n[0],r=n[1];return e[0]=t[0]*i,e[1]=t[1]*r,e[2]=t[2]*i,e[3]=t[3]*r,e[4]=t[4]*i,e[5]=t[5]*r,e}function ry(e,t){var n=t[0],i=t[2],r=t[4],s=t[1],a=t[3],o=t[5],l=n*a-s*i;return l?(l=1/l,e[0]=a*l,e[1]=-s*l,e[2]=-i*l,e[3]=n*l,e[4]=(i*o-a*r)*l,e[5]=(s*r-n*o)*l,e):null}var Te=function(){function e(t,n){this.x=t||0,this.y=n||0}return e.prototype.copy=function(t){return this.x=t.x,this.y=t.y,this},e.prototype.clone=function(){return new e(this.x,this.y)},e.prototype.set=function(t,n){return this.x=t,this.y=n,this},e.prototype.equal=function(t){return t.x===this.x&&t.y===this.y},e.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},e.prototype.scale=function(t){this.x*=t,this.y*=t},e.prototype.scaleAndAdd=function(t,n){this.x+=t.x*n,this.y+=t.y*n},e.prototype.sub=function(t){return this.x-=t.x,this.y-=t.y,this},e.prototype.dot=function(t){return this.x*t.x+this.y*t.y},e.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},e.prototype.lenSquare=function(){return this.x*this.x+this.y*this.y},e.prototype.normalize=function(){var t=this.len();return this.x/=t,this.y/=t,this},e.prototype.distance=function(t){var n=this.x-t.x,i=this.y-t.y;return Math.sqrt(n*n+i*i)},e.prototype.distanceSquare=function(t){var n=this.x-t.x,i=this.y-t.y;return n*n+i*i},e.prototype.negate=function(){return this.x=-this.x,this.y=-this.y,this},e.prototype.transform=function(t){if(t){var n=this.x,i=this.y;return this.x=t[0]*n+t[2]*i+t[4],this.y=t[1]*n+t[3]*i+t[5],this}},e.prototype.toArray=function(t){return t[0]=this.x,t[1]=this.y,t},e.prototype.fromArray=function(t){this.x=t[0],this.y=t[1]},e.set=function(t,n,i){t.x=n,t.y=i},e.copy=function(t,n){t.x=n.x,t.y=n.y},e.len=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},e.lenSquare=function(t){return t.x*t.x+t.y*t.y},e.dot=function(t,n){return t.x*n.x+t.y*n.y},e.add=function(t,n,i){t.x=n.x+i.x,t.y=n.y+i.y},e.sub=function(t,n,i){t.x=n.x-i.x,t.y=n.y-i.y},e.scale=function(t,n,i){t.x=n.x*i,t.y=n.y*i},e.scaleAndAdd=function(t,n,i,r){t.x=n.x+i.x*r,t.y=n.y+i.y*r},e.lerp=function(t,n,i,r){var s=1-r;t.x=s*n.x+r*i.x,t.y=s*n.y+r*i.y},e}(),ps=Math.min,oa=Math.max,$d=Math.abs,a_=["x","y"],SC=["width","height"],zr=new Te,Vr=new Te,Gr=new Te,kr=new Te,pn=sy(),uo=pn.minTv,Kd=pn.maxTv,Lo=[0,0],ce=function(){function e(t,n,i,r){e.set(this,t,n,i,r)}return e.set=function(t,n,i,r,s){return r<0&&(n=n+r,r=-r),s<0&&(i=i+s,s=-s),t.x=n,t.y=i,t.width=r,t.height=s,t},e.prototype.union=function(t){var n=ps(t.x,this.x),i=ps(t.y,this.y);isFinite(this.x)&&isFinite(this.width)?this.width=oa(t.x+t.width,this.x+this.width)-n:this.width=t.width,isFinite(this.y)&&isFinite(this.height)?this.height=oa(t.y+t.height,this.y+this.height)-i:this.height=t.height,this.x=n,this.y=i},e.prototype.applyTransform=function(t){e.applyTransform(this,this,t)},e.prototype.calculateTransform=function(t){var n=this,i=t.width/n.width,r=t.height/n.height,s=Po();return s_(s,s,[-n.x,-n.y]),yC(s,s,[i,r]),s_(s,s,[t.x,t.y]),s},e.prototype.intersect=function(t,n,i){return e.intersect(this,t,n,i)},e.intersect=function(t,n,i,r){i&&Te.set(i,0,0);var s=r&&r.outIntersectRect||null,a=r&&r.clamp;if(s&&(s.x=s.y=s.width=s.height=NaN),!t||!n)return!1;t instanceof e||(t=e.set(MC,t.x,t.y,t.width,t.height)),n instanceof e||(n=e.set(bC,n.x,n.y,n.width,n.height));var o=!!i;pn.reset(r,o);var l=pn.touchThreshold,c=t.x+l,f=t.x+t.width-l,u=t.y+l,h=t.y+t.height-l,d=n.x+l,v=n.x+n.width-l,_=n.y+l,m=n.y+n.height-l;if(c>f||u>h||d>v||_>m)return!1;var p=!(f<d||v<c||h<_||m<u);return(o||s)&&(Lo[0]=1/0,Lo[1]=0,o_(c,f,d,v,0,o,s,a),o_(u,h,_,m,1,o,s,a),o&&Te.copy(i,p?pn.useDir?pn.dirMinTv:uo:Kd)),p},e.contain=function(t,n,i){return n>=t.x&&n<=t.x+t.width&&i>=t.y&&i<=t.y+t.height},e.prototype.contain=function(t,n){return e.contain(this,t,n)},e.prototype.clone=function(){return new e(this.x,this.y,this.width,this.height)},e.prototype.copy=function(t){e.copy(this,t)},e.prototype.plain=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},e.prototype.isFinite=function(){return isFinite(this.x)&&isFinite(this.y)&&isFinite(this.width)&&isFinite(this.height)},e.prototype.isZero=function(){return this.width===0||this.height===0},e.create=function(t){return new e(t.x,t.y,t.width,t.height)},e.copy=function(t,n){return t.x=n.x,t.y=n.y,t.width=n.width,t.height=n.height,t},e.applyTransform=function(t,n,i){if(!i){t!==n&&e.copy(t,n);return}if(i[1]<1e-5&&i[1]>-1e-5&&i[2]<1e-5&&i[2]>-1e-5){var r=i[0],s=i[3],a=i[4],o=i[5];t.x=n.x*r+a,t.y=n.y*s+o,t.width=n.width*r,t.height=n.height*s,t.width<0&&(t.x+=t.width,t.width=-t.width),t.height<0&&(t.y+=t.height,t.height=-t.height);return}zr.x=Gr.x=n.x,zr.y=kr.y=n.y,Vr.x=kr.x=n.x+n.width,Vr.y=Gr.y=n.y+n.height,zr.transform(i),kr.transform(i),Vr.transform(i),Gr.transform(i),t.x=ps(zr.x,Vr.x,Gr.x,kr.x),t.y=ps(zr.y,Vr.y,Gr.y,kr.y);var l=oa(zr.x,Vr.x,Gr.x,kr.x),c=oa(zr.y,Vr.y,Gr.y,kr.y);t.width=l-t.x,t.height=c-t.y},e}(),MC=new ce(0,0,0,0),bC=new ce(0,0,0,0);function o_(e,t,n,i,r,s,a,o){var l=$d(t-n),c=$d(i-e),f=ps(l,c),u=a_[r],h=a_[1-r],d=SC[r];t<n||i<e?l<c?(s&&(Kd[u]=-l),o&&(a[u]=t,a[d]=0)):(s&&(Kd[u]=c),o&&(a[u]=e,a[d]=0)):(a&&(a[u]=oa(e,n),a[d]=ps(t,i)-a[u]),s&&(f<Lo[0]||pn.useDir)&&(Lo[0]=ps(f,Lo[0]),(l<c||!pn.bidirectional)&&(uo[u]=l,uo[h]=0,pn.useDir&&pn.calcDirMTV()),(l>=c||!pn.bidirectional)&&(uo[u]=-c,uo[h]=0,pn.useDir&&pn.calcDirMTV())))}function sy(){var e=0,t=new Te,n=new Te,i={minTv:new Te,maxTv:new Te,useDir:!1,dirMinTv:new Te,touchThreshold:0,bidirectional:!0,negativeSize:!1,reset:function(s,a){i.touchThreshold=0,s&&s.touchThreshold!=null&&(i.touchThreshold=oa(0,s.touchThreshold)),i.negativeSize=!1,a&&(i.minTv.set(1/0,1/0),i.maxTv.set(0,0),i.useDir=!1,s&&s.direction!=null&&(i.useDir=!0,i.dirMinTv.copy(i.minTv),n.copy(i.minTv),e=s.direction,i.bidirectional=s.bidirectional==null||!!s.bidirectional,i.bidirectional||t.set(Math.cos(e),Math.sin(e))))},calcDirMTV:function(){var s=i.minTv,a=i.dirMinTv,o=s.y*s.y+s.x*s.x,l=Math.sin(e),c=Math.cos(e),f=l*s.y+c*s.x;if(r(f)){r(s.x)&&r(s.y)&&a.set(0,0);return}if(n.x=o*c/f,n.y=o*l/f,r(n.x)&&r(n.y)){a.set(0,0);return}(i.bidirectional||t.dot(n)>0)&&n.len()<a.len()&&a.copy(n)}};function r(s){return $d(s)<1e-10}return i}var ay="silent";function TC(e,t,n){return{type:e,event:n,target:t.target,topTarget:t.topTarget,cancelBubble:!1,offsetX:n.zrX,offsetY:n.zrY,gestureEvent:n.gestureEvent,pinchX:n.pinchX,pinchY:n.pinchY,pinchScale:n.pinchScale,wheelDelta:n.zrDelta,zrByTouch:n.zrByTouch,which:n.which,stop:EC}}function EC(){pC(this.event)}var wC=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.handler=null,n}return t.prototype.dispose=function(){},t.prototype.setCursor=function(){},t}(Ua),qa=function(){function e(t,n){this.x=t,this.y=n}return e}(),AC=["click","dblclick","mousewheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],uh=new ce(0,0,0,0),oy=function(e){ue(t,e);function t(n,i,r,s,a){var o=e.call(this)||this;return o._hovered=new qa(0,0),o.storage=n,o.painter=i,o.painterRoot=s,o._pointerSize=a,r=r||new wC,o.proxy=null,o.setHandlerProxy(r),o._draggingMgr=new iC(o),o}return t.prototype.setHandlerProxy=function(n){this.proxy&&this.proxy.dispose(),n&&(ln(AC,function(i){n.on&&n.on(i,this[i],this)},this),n.handler=this),this.proxy=n},t.prototype.mousemove=function(n){var i=n.zrX,r=n.zrY,s=ly(this,i,r),a=this._hovered,o=a.target;o&&!o.__zr&&(a=this.findHover(a.x,a.y),o=a.target);var l=this._hovered=s?new qa(i,r):this.findHover(i,r),c=l.target,f=this.proxy;f.setCursor&&f.setCursor(c?c.cursor:"default"),o&&c!==o&&this.dispatchToElement(a,"mouseout",n),this.dispatchToElement(l,"mousemove",n),c&&c!==o&&this.dispatchToElement(l,"mouseover",n)},t.prototype.mouseout=function(n){var i=n.zrEventControl;i!=="only_globalout"&&this.dispatchToElement(this._hovered,"mouseout",n),i!=="no_globalout"&&this.trigger("globalout",{type:"globalout",event:n})},t.prototype.resize=function(){this._hovered=new qa(0,0)},t.prototype.dispatch=function(n,i){var r=this[n];r&&r.call(this,i)},t.prototype.dispose=function(){this.proxy.dispose(),this.storage=null,this.proxy=null,this.painter=null},t.prototype.setCursorStyle=function(n){var i=this.proxy;i.setCursor&&i.setCursor(n)},t.prototype.dispatchToElement=function(n,i,r){n=n||{};var s=n.target;if(!(s&&s.silent)){for(var a="on"+i,o=TC(i,n,r);s&&(s[a]&&(o.cancelBubble=!!s[a].call(s,o)),s.trigger(i,o),s=s.__hostTarget?s.__hostTarget:s.parent,!o.cancelBubble););o.cancelBubble||(this.trigger(i,o),this.painter&&this.painter.eachOtherLayer&&this.painter.eachOtherLayer(function(l){typeof l[a]=="function"&&l[a].call(l,o),l.trigger&&l.trigger(i,o)}))}},t.prototype.findHover=function(n,i,r){var s=this.storage.getDisplayList(),a=new qa(n,i);if(l_(s,a,n,i,r),this._pointerSize&&!a.target){for(var o=[],l=this._pointerSize,c=l/2,f=new ce(n-c,i-c,l,l),u=s.length-1;u>=0;u--){var h=s[u];h!==r&&!h.ignore&&!h.ignoreCoarsePointer&&(!h.parent||!h.parent.ignoreCoarsePointer)&&(uh.copy(h.getBoundingRect()),h.transform&&uh.applyTransform(h.transform),uh.intersect(f)&&o.push(h))}if(o.length)for(var d=4,v=Math.PI/12,_=Math.PI*2,m=0;m<c;m+=d)for(var p=0;p<_;p+=v){var x=n+m*Math.cos(p),b=i+m*Math.sin(p);if(l_(o,a,x,b,r),a.target)return a}}return a},t.prototype.processGesture=function(n,i){this._gestureMgr||(this._gestureMgr=new mC);var r=this._gestureMgr;i==="start"&&r.clear();var s=r.recognize(n,this.findHover(n.zrX,n.zrY,null).target,this.proxy.dom);if(i==="end"&&r.clear(),s){var a=s.type;n.gestureEvent=a;var o=new qa;o.target=s.target,this.dispatchToElement(o,a,s.event)}},t}(Ua);ln(["click","mousedown","mouseup","mousewheel","dblclick","contextmenu"],function(e){oy.prototype[e]=function(t){var n=t.zrX,i=t.zrY,r=ly(this,n,i),s,a;if((e!=="mouseup"||!r)&&(s=this.findHover(n,i),a=s.target),e==="mousedown")this._downEl=a,this._downPoint=[t.zrX,t.zrY],this._upEl=a;else if(e==="mouseup")this._upEl=a;else if(e==="click"){if(this._downEl!==this._upEl||!this._downPoint||eC(this._downPoint,[t.zrX,t.zrY])>4)return;this._downPoint=null}this.dispatchToElement(s,e,t)}});function CC(e,t,n){if(e[e.rectHover?"rectContain":"contain"](t,n)){for(var i=e,r=void 0,s=!1;i;){if(i.ignoreClip&&(s=!0),!s){var a=i.getClipPath();if(a&&!a.contain(t,n))return!1}i.silent&&(r=!0);var o=i.__hostTarget;i=o?i.ignoreHostSilent?null:o:i.parent}return r?ay:!0}return!1}function l_(e,t,n,i,r){for(var s=e.length-1;s>=0;s--){var a=e[s],o=void 0;if(a!==r&&!a.ignore&&(o=CC(a,n,i))&&(!t.topTarget&&(t.topTarget=a),o!==ay)){t.target=a;break}}}function ly(e,t,n){var i=e.painter;return t<0||t>i.getWidth()||n<0||n>i.getHeight()}var cy=32,Ya=7;function RC(e){for(var t=0;e>=cy;)t|=e&1,e>>=1;return e+t}function c_(e,t,n,i){var r=t+1;if(r===n)return 1;if(i(e[r++],e[t])<0){for(;r<n&&i(e[r],e[r-1])<0;)r++;PC(e,t,r)}else for(;r<n&&i(e[r],e[r-1])>=0;)r++;return r-t}function PC(e,t,n){for(n--;t<n;){var i=e[t];e[t++]=e[n],e[n--]=i}}function f_(e,t,n,i,r){for(i===t&&i++;i<n;i++){for(var s=e[i],a=t,o=i,l;a<o;)l=a+o>>>1,r(s,e[l])<0?o=l:a=l+1;var c=i-a;switch(c){case 3:e[a+3]=e[a+2];case 2:e[a+2]=e[a+1];case 1:e[a+1]=e[a];break;default:for(;c>0;)e[a+c]=e[a+c-1],c--}e[a]=s}}function hh(e,t,n,i,r,s){var a=0,o=0,l=1;if(s(e,t[n+r])>0){for(o=i-r;l<o&&s(e,t[n+r+l])>0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o),a+=r,l+=r}else{for(o=r+1;l<o&&s(e,t[n+r-l])<=0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o);var c=a;a=r-l,l=r-c}for(a++;a<l;){var f=a+(l-a>>>1);s(e,t[n+f])>0?a=f+1:l=f}return l}function dh(e,t,n,i,r,s){var a=0,o=0,l=1;if(s(e,t[n+r])<0){for(o=r+1;l<o&&s(e,t[n+r-l])<0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o);var c=a;a=r-l,l=r-c}else{for(o=i-r;l<o&&s(e,t[n+r+l])>=0;)a=l,l=(l<<1)+1,l<=0&&(l=o);l>o&&(l=o),a+=r,l+=r}for(a++;a<l;){var f=a+(l-a>>>1);s(e,t[n+f])<0?l=f:a=f+1}return l}function LC(e,t){var n=Ya,i,r,s=0,a=[];i=[],r=[];function o(d,v){i[s]=d,r[s]=v,s+=1}function l(){for(;s>1;){var d=s-2;if(d>=1&&r[d-1]<=r[d]+r[d+1]||d>=2&&r[d-2]<=r[d]+r[d-1])r[d-1]<r[d+1]&&d--;else if(r[d]>r[d+1])break;f(d)}}function c(){for(;s>1;){var d=s-2;d>0&&r[d-1]<r[d+1]&&d--,f(d)}}function f(d){var v=i[d],_=r[d],m=i[d+1],p=r[d+1];r[d]=_+p,d===s-3&&(i[d+1]=i[d+2],r[d+1]=r[d+2]),s--;var x=dh(e[m],e,v,_,0,t);v+=x,_-=x,_!==0&&(p=hh(e[v+_-1],e,m,p,p-1,t),p!==0&&(_<=p?u(v,_,m,p):h(v,_,m,p)))}function u(d,v,_,m){var p=0;for(p=0;p<v;p++)a[p]=e[d+p];var x=0,b=_,S=d;if(e[S++]=e[b++],--m===0){for(p=0;p<v;p++)e[S+p]=a[x+p];return}if(v===1){for(p=0;p<m;p++)e[S+p]=e[b+p];e[S+m]=a[x];return}for(var T=n,E,C,R;;){E=0,C=0,R=!1;do if(t(e[b],a[x])<0){if(e[S++]=e[b++],C++,E=0,--m===0){R=!0;break}}else if(e[S++]=a[x++],E++,C=0,--v===1){R=!0;break}while((E|C)<T);if(R)break;do{if(E=dh(e[b],a,x,v,0,t),E!==0){for(p=0;p<E;p++)e[S+p]=a[x+p];if(S+=E,x+=E,v-=E,v<=1){R=!0;break}}if(e[S++]=e[b++],--m===0){R=!0;break}if(C=hh(a[x],e,b,m,0,t),C!==0){for(p=0;p<C;p++)e[S+p]=e[b+p];if(S+=C,b+=C,m-=C,m===0){R=!0;break}}if(e[S++]=a[x++],--v===1){R=!0;break}T--}while(E>=Ya||C>=Ya);if(R)break;T<0&&(T=0),T+=2}if(n=T,n<1&&(n=1),v===1){for(p=0;p<m;p++)e[S+p]=e[b+p];e[S+m]=a[x]}else{if(v===0)throw new Error;for(p=0;p<v;p++)e[S+p]=a[x+p]}}function h(d,v,_,m){var p=0;for(p=0;p<m;p++)a[p]=e[_+p];var x=d+v-1,b=m-1,S=_+m-1,T=0,E=0;if(e[S--]=e[x--],--v===0){for(T=S-(m-1),p=0;p<m;p++)e[T+p]=a[p];return}if(m===1){for(S-=v,x-=v,E=S+1,T=x+1,p=v-1;p>=0;p--)e[E+p]=e[T+p];e[S]=a[b];return}for(var C=n;;){var R=0,g=0,M=!1;do if(t(a[b],e[x])<0){if(e[S--]=e[x--],R++,g=0,--v===0){M=!0;break}}else if(e[S--]=a[b--],g++,R=0,--m===1){M=!0;break}while((R|g)<C);if(M)break;do{if(R=v-dh(a[b],e,d,v,v-1,t),R!==0){for(S-=R,x-=R,v-=R,E=S+1,T=x+1,p=R-1;p>=0;p--)e[E+p]=e[T+p];if(v===0){M=!0;break}}if(e[S--]=a[b--],--m===1){M=!0;break}if(g=m-hh(e[x],a,0,m,m-1,t),g!==0){for(S-=g,b-=g,m-=g,E=S+1,T=b+1,p=0;p<g;p++)e[E+p]=a[T+p];if(m<=1){M=!0;break}}if(e[S--]=e[x--],--v===0){M=!0;break}C--}while(R>=Ya||g>=Ya);if(M)break;C<0&&(C=0),C+=2}if(n=C,n<1&&(n=1),m===1){for(S-=v,x-=v,E=S+1,T=x+1,p=v-1;p>=0;p--)e[E+p]=e[T+p];e[S]=a[b]}else{if(m===0)throw new Error;for(T=S-(m-1),p=0;p<m;p++)e[T+p]=a[p]}}return{mergeRuns:l,forceMergeRuns:c,pushRun:o}}function DC(e,t,n,i){n||(n=0),i||(i=e.length);var r=i-n;if(!(r<2)){var s=0;if(r<cy){s=c_(e,n,i,t),f_(e,n,i,n+s,t);return}var a=LC(e,t),o=RC(r);do{if(s=c_(e,n,i,t),s<o){var l=r;l>o&&(l=o),f_(e,n,n+l,n+s,t),s=l}a.pushRun(n,s),a.mergeRuns(),r-=s,n+=s}while(r!==0);a.forceMergeRuns()}}var vn=1,ho=2,ra=4,u_=!1;function ph(){u_||(u_=!0,console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"))}function h_(e,t){return e.zlevel===t.zlevel?e.z===t.z?e.z2-t.z2:e.z-t.z:e.zlevel-t.zlevel}var IC=function(){function e(){this._roots=[],this._displayList=[],this._displayListLen=0,this.displayableSortFunc=h_}return e.prototype.traverse=function(t,n){for(var i=0;i<this._roots.length;i++)this._roots[i].traverse(t,n)},e.prototype.getDisplayList=function(t,n){n=n||!1;var i=this._displayList;return(t||!i.length)&&this.updateDisplayList(n),i},e.prototype.updateDisplayList=function(t){this._displayListLen=0;for(var n=this._roots,i=this._displayList,r=0,s=n.length;r<s;r++)this._updateAndAddDisplayable(n[r],null,t);i.length=this._displayListLen,DC(i,h_)},e.prototype._updateAndAddDisplayable=function(t,n,i){if(!(t.ignore&&!i)){t.beforeUpdate(),t.update(),t.afterUpdate();var r=t.getClipPath(),s=n&&n.length,a=0,o=t.__clipPaths;if(!t.ignoreClip&&(s||r)){if(o||(o=t.__clipPaths=[]),s)for(var l=0;l<n.length;l++)o[a++]=n[l];for(var c=r,f=t;c;)c.parent=f,c.updateTransform(),o[a++]=c,f=c,c=c.getClipPath()}if(o&&(o.length=a),t.childrenRef){for(var u=t.childrenRef(),h=0;h<u.length;h++){var d=u[h];t.__dirty&&(d.__dirty|=vn),this._updateAndAddDisplayable(d,o,i)}t.__dirty=0}else{var v=t;isNaN(v.z)&&(ph(),v.z=0),isNaN(v.z2)&&(ph(),v.z2=0),isNaN(v.zlevel)&&(ph(),v.zlevel=0),this._displayList[this._displayListLen++]=v}var _=t.getDecalElement&&t.getDecalElement();_&&this._updateAndAddDisplayable(_,o,i);var m=t.getTextGuideLine();m&&this._updateAndAddDisplayable(m,o,i);var p=t.getTextContent();p&&this._updateAndAddDisplayable(p,o,i)}},e.prototype.addRoot=function(t){t.__zr&&t.__zr.storage===this||this._roots.push(t)},e.prototype.delRoot=function(t){if(t instanceof Array){for(var n=0,i=t.length;n<i;n++)this.delRoot(t[n]);return}var r=di(this._roots,t);r>=0&&this._roots.splice(r,1)},e.prototype.delAllRoots=function(){this._roots=[],this._displayList=[],this._displayListLen=0},e.prototype.getRoots=function(){return this._roots},e.prototype.dispose=function(){this._displayList=null,this._roots=null},e}(),jc;jc=ge.hasGlobalWindow&&(window.requestAnimationFrame&&window.requestAnimationFrame.bind(window)||window.msRequestAnimationFrame&&window.msRequestAnimationFrame.bind(window)||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(e){return setTimeout(e,16)};var Do={linear:function(e){return e},quadraticIn:function(e){return e*e},quadraticOut:function(e){return e*(2-e)},quadraticInOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)},cubicIn:function(e){return e*e*e},cubicOut:function(e){return--e*e*e+1},cubicInOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)},quarticIn:function(e){return e*e*e*e},quarticOut:function(e){return 1- --e*e*e*e},quarticInOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)},quinticIn:function(e){return e*e*e*e*e},quinticOut:function(e){return--e*e*e*e*e+1},quinticInOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)},sinusoidalIn:function(e){return 1-Math.cos(e*Math.PI/2)},sinusoidalOut:function(e){return Math.sin(e*Math.PI/2)},sinusoidalInOut:function(e){return .5*(1-Math.cos(Math.PI*e))},exponentialIn:function(e){return e===0?0:Math.pow(1024,e-1)},exponentialOut:function(e){return e===1?1:1-Math.pow(2,-10*e)},exponentialInOut:function(e){return e===0?0:e===1?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(-Math.pow(2,-10*(e-1))+2)},circularIn:function(e){return 1-Math.sqrt(1-e*e)},circularOut:function(e){return Math.sqrt(1- --e*e)},circularInOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)},elasticIn:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),-(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)))},elasticOut:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),n*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/i)+1)},elasticInOut:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),(e*=2)<1?-.5*(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)):n*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)*.5+1)},backIn:function(e){var t=1.70158;return e*e*((t+1)*e-t)},backOut:function(e){var t=1.70158;return--e*e*((t+1)*e+t)+1},backInOut:function(e){var t=2.5949095;return(e*=2)<1?.5*(e*e*((t+1)*e-t)):.5*((e-=2)*e*((t+1)*e+t)+2)},bounceIn:function(e){return 1-Do.bounceOut(1-e)},bounceOut:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},bounceInOut:function(e){return e<.5?Do.bounceIn(e*2)*.5:Do.bounceOut(e*2-1)*.5+.5}},Cl=Math.pow,Ar=Math.sqrt,Qc=1e-8,fy=1e-4,d_=Ar(3),Rl=1/3,pi=Fa(),wn=Fa(),xa=Fa();function Sr(e){return e>-Qc&&e<Qc}function uy(e){return e>Qc||e<-Qc}function Ze(e,t,n,i,r){var s=1-r;return s*s*(s*e+3*r*t)+r*r*(r*i+3*s*n)}function p_(e,t,n,i,r){var s=1-r;return 3*(((t-e)*s+2*(n-t)*r)*s+(i-n)*r*r)}function hy(e,t,n,i,r,s){var a=i+3*(t-n)-e,o=3*(n-t*2+e),l=3*(t-e),c=e-r,f=o*o-3*a*l,u=o*l-9*a*c,h=l*l-3*o*c,d=0;if(Sr(f)&&Sr(u))if(Sr(o))s[0]=0;else{var v=-l/o;v>=0&&v<=1&&(s[d++]=v)}else{var _=u*u-4*f*h;if(Sr(_)){var m=u/f,v=-o/a+m,p=-m/2;v>=0&&v<=1&&(s[d++]=v),p>=0&&p<=1&&(s[d++]=p)}else if(_>0){var x=Ar(_),b=f*o+1.5*a*(-u+x),S=f*o+1.5*a*(-u-x);b<0?b=-Cl(-b,Rl):b=Cl(b,Rl),S<0?S=-Cl(-S,Rl):S=Cl(S,Rl);var v=(-o-(b+S))/(3*a);v>=0&&v<=1&&(s[d++]=v)}else{var T=(2*f*o-3*a*u)/(2*Ar(f*f*f)),E=Math.acos(T)/3,C=Ar(f),R=Math.cos(E),v=(-o-2*C*R)/(3*a),p=(-o+C*(R+d_*Math.sin(E)))/(3*a),g=(-o+C*(R-d_*Math.sin(E)))/(3*a);v>=0&&v<=1&&(s[d++]=v),p>=0&&p<=1&&(s[d++]=p),g>=0&&g<=1&&(s[d++]=g)}}return d}function dy(e,t,n,i,r){var s=6*n-12*t+6*e,a=9*t+3*i-3*e-9*n,o=3*t-3*e,l=0;if(Sr(a)){if(uy(s)){var c=-o/s;c>=0&&c<=1&&(r[l++]=c)}}else{var f=s*s-4*a*o;if(Sr(f))r[0]=-s/(2*a);else if(f>0){var u=Ar(f),c=(-s+u)/(2*a),h=(-s-u)/(2*a);c>=0&&c<=1&&(r[l++]=c),h>=0&&h<=1&&(r[l++]=h)}}return l}function tf(e,t,n,i,r,s){var a=(t-e)*r+e,o=(n-t)*r+t,l=(i-n)*r+n,c=(o-a)*r+a,f=(l-o)*r+o,u=(f-c)*r+c;s[0]=e,s[1]=a,s[2]=c,s[3]=u,s[4]=u,s[5]=f,s[6]=l,s[7]=i}function NC(e,t,n,i,r,s,a,o,l,c,f){var u,h=.005,d=1/0,v,_,m,p;pi[0]=l,pi[1]=c;for(var x=0;x<1;x+=.05)wn[0]=Ze(e,n,r,a,x),wn[1]=Ze(t,i,s,o,x),m=ga(pi,wn),m<d&&(u=x,d=m);d=1/0;for(var b=0;b<32&&!(h<fy);b++)v=u-h,_=u+h,wn[0]=Ze(e,n,r,a,v),wn[1]=Ze(t,i,s,o,v),m=ga(wn,pi),v>=0&&m<d?(u=v,d=m):(xa[0]=Ze(e,n,r,a,_),xa[1]=Ze(t,i,s,o,_),p=ga(xa,pi),_<=1&&p<d?(u=_,d=p):h*=.5);return Ar(d)}function FC(e,t,n,i,r,s,a,o,l){for(var c=e,f=t,u=0,h=1/l,d=1;d<=l;d++){var v=d*h,_=Ze(e,n,r,a,v),m=Ze(t,i,s,o,v),p=_-c,x=m-f;u+=Math.sqrt(p*p+x*x),c=_,f=m}return u}function sn(e,t,n,i){var r=1-i;return r*(r*e+2*i*t)+i*i*n}function m_(e,t,n,i){return 2*((1-i)*(t-e)+i*(n-t))}function UC(e,t,n,i,r){var s=e-2*t+n,a=2*(t-e),o=e-i,l=0;if(Sr(s)){if(uy(a)){var c=-o/a;c>=0&&c<=1&&(r[l++]=c)}}else{var f=a*a-4*s*o;if(Sr(f)){var c=-a/(2*s);c>=0&&c<=1&&(r[l++]=c)}else if(f>0){var u=Ar(f),c=(-a+u)/(2*s),h=(-a-u)/(2*s);c>=0&&c<=1&&(r[l++]=c),h>=0&&h<=1&&(r[l++]=h)}}return l}function py(e,t,n){var i=e+n-2*t;return i===0?.5:(e-t)/i}function ef(e,t,n,i,r){var s=(t-e)*i+e,a=(n-t)*i+t,o=(a-s)*i+s;r[0]=e,r[1]=s,r[2]=o,r[3]=o,r[4]=a,r[5]=n}function OC(e,t,n,i,r,s,a,o,l){var c,f=.005,u=1/0;pi[0]=a,pi[1]=o;for(var h=0;h<1;h+=.05){wn[0]=sn(e,n,r,h),wn[1]=sn(t,i,s,h);var d=ga(pi,wn);d<u&&(c=h,u=d)}u=1/0;for(var v=0;v<32&&!(f<fy);v++){var _=c-f,m=c+f;wn[0]=sn(e,n,r,_),wn[1]=sn(t,i,s,_);var d=ga(wn,pi);if(_>=0&&d<u)c=_,u=d;else{xa[0]=sn(e,n,r,m),xa[1]=sn(t,i,s,m);var p=ga(xa,pi);m<=1&&p<u?(c=m,u=p):f*=.5}}return Ar(u)}function BC(e,t,n,i,r,s,a){for(var o=e,l=t,c=0,f=1/a,u=1;u<=a;u++){var h=u*f,d=sn(e,n,r,h),v=sn(t,i,s,h),_=d-o,m=v-l;c+=Math.sqrt(_*_+m*m),o=d,l=v}return c}var HC=/cubic-bezier\(([0-9,\.e ]+)\)/;function my(e){var t=e&&HC.exec(e);if(t){var n=t[1].split(","),i=+fo(n[0]),r=+fo(n[1]),s=+fo(n[2]),a=+fo(n[3]);if(isNaN(i+r+s+a))return;var o=[];return function(l){return l<=0?0:l>=1?1:hy(0,i,s,1,l,o)&&Ze(0,r,a,1,o[0])}}}var zC=function(){function e(t){this._inited=!1,this._startTime=0,this._pausedTime=0,this._paused=!1,this._life=t.life||1e3,this._delay=t.delay||0,this.loop=t.loop||!1,this.onframe=t.onframe||_a,this.ondestroy=t.ondestroy||_a,this.onrestart=t.onrestart||_a,t.easing&&this.setEasing(t.easing)}return e.prototype.step=function(t,n){if(this._inited||(this._startTime=t+this._delay,this._inited=!0),this._paused){this._pausedTime+=n;return}var i=this._life,r=t-this._startTime-this._pausedTime,s=r/i;s<0&&(s=0),s=Math.min(s,1);var a=this.easingFunc,o=a?a(s):s;if(this.onframe(o),s===1)if(this.loop){var l=r%i;this._startTime=t-l,this._pausedTime=0,this.onrestart()}else return!0;return!1},e.prototype.pause=function(){this._paused=!0},e.prototype.resume=function(){this._paused=!1},e.prototype.setEasing=function(t){this.easing=t,this.easingFunc=ys(t)?t:Do[t]||my(t)},e}(),vy=function(){function e(t){this.value=t}return e}(),VC=function(){function e(){this._len=0}return e.prototype.insert=function(t){var n=new vy(t);return this.insertEntry(n),n},e.prototype.insertEntry=function(t){this.head?(this.tail.next=t,t.prev=this.tail,t.next=null,this.tail=t):this.head=this.tail=t,this._len++},e.prototype.remove=function(t){var n=t.prev,i=t.next;n?n.next=i:this.head=i,i?i.prev=n:this.tail=n,t.next=t.prev=null,this._len--},e.prototype.len=function(){return this._len},e.prototype.clear=function(){this.head=this.tail=null,this._len=0},e}(),jo=function(){function e(t){this._list=new VC,this._maxSize=10,this._map={},this._maxSize=t}return e.prototype.put=function(t,n){var i=this._list,r=this._map,s=null;if(r[t]==null){var a=i.len(),o=this._lastRemovedEntry;if(a>=this._maxSize&&a>0){var l=i.head;i.remove(l),delete r[l.key],s=l.value,this._lastRemovedEntry=l}o?o.value=n:o=new vy(n),o.key=t,i.insertEntry(o),r[t]=o}return s},e.prototype.get=function(t){var n=this._map[t],i=this._list;if(n!=null)return n!==i.tail&&(i.remove(n),i.insertEntry(n)),n.value},e.prototype.clear=function(){this._list.clear(),this._map={}},e.prototype.len=function(){return this._list.len()},e}(),v_={transparent:[0,0,0,0],aliceblue:[240,248,255,1],antiquewhite:[250,235,215,1],aqua:[0,255,255,1],aquamarine:[127,255,212,1],azure:[240,255,255,1],beige:[245,245,220,1],bisque:[255,228,196,1],black:[0,0,0,1],blanchedalmond:[255,235,205,1],blue:[0,0,255,1],blueviolet:[138,43,226,1],brown:[165,42,42,1],burlywood:[222,184,135,1],cadetblue:[95,158,160,1],chartreuse:[127,255,0,1],chocolate:[210,105,30,1],coral:[255,127,80,1],cornflowerblue:[100,149,237,1],cornsilk:[255,248,220,1],crimson:[220,20,60,1],cyan:[0,255,255,1],darkblue:[0,0,139,1],darkcyan:[0,139,139,1],darkgoldenrod:[184,134,11,1],darkgray:[169,169,169,1],darkgreen:[0,100,0,1],darkgrey:[169,169,169,1],darkkhaki:[189,183,107,1],darkmagenta:[139,0,139,1],darkolivegreen:[85,107,47,1],darkorange:[255,140,0,1],darkorchid:[153,50,204,1],darkred:[139,0,0,1],darksalmon:[233,150,122,1],darkseagreen:[143,188,143,1],darkslateblue:[72,61,139,1],darkslategray:[47,79,79,1],darkslategrey:[47,79,79,1],darkturquoise:[0,206,209,1],darkviolet:[148,0,211,1],deeppink:[255,20,147,1],deepskyblue:[0,191,255,1],dimgray:[105,105,105,1],dimgrey:[105,105,105,1],dodgerblue:[30,144,255,1],firebrick:[178,34,34,1],floralwhite:[255,250,240,1],forestgreen:[34,139,34,1],fuchsia:[255,0,255,1],gainsboro:[220,220,220,1],ghostwhite:[248,248,255,1],gold:[255,215,0,1],goldenrod:[218,165,32,1],gray:[128,128,128,1],green:[0,128,0,1],greenyellow:[173,255,47,1],grey:[128,128,128,1],honeydew:[240,255,240,1],hotpink:[255,105,180,1],indianred:[205,92,92,1],indigo:[75,0,130,1],ivory:[255,255,240,1],khaki:[240,230,140,1],lavender:[230,230,250,1],lavenderblush:[255,240,245,1],lawngreen:[124,252,0,1],lemonchiffon:[255,250,205,1],lightblue:[173,216,230,1],lightcoral:[240,128,128,1],lightcyan:[224,255,255,1],lightgoldenrodyellow:[250,250,210,1],lightgray:[211,211,211,1],lightgreen:[144,238,144,1],lightgrey:[211,211,211,1],lightpink:[255,182,193,1],lightsalmon:[255,160,122,1],lightseagreen:[32,178,170,1],lightskyblue:[135,206,250,1],lightslategray:[119,136,153,1],lightslategrey:[119,136,153,1],lightsteelblue:[176,196,222,1],lightyellow:[255,255,224,1],lime:[0,255,0,1],limegreen:[50,205,50,1],linen:[250,240,230,1],magenta:[255,0,255,1],maroon:[128,0,0,1],mediumaquamarine:[102,205,170,1],mediumblue:[0,0,205,1],mediumorchid:[186,85,211,1],mediumpurple:[147,112,219,1],mediumseagreen:[60,179,113,1],mediumslateblue:[123,104,238,1],mediumspringgreen:[0,250,154,1],mediumturquoise:[72,209,204,1],mediumvioletred:[199,21,133,1],midnightblue:[25,25,112,1],mintcream:[245,255,250,1],mistyrose:[255,228,225,1],moccasin:[255,228,181,1],navajowhite:[255,222,173,1],navy:[0,0,128,1],oldlace:[253,245,230,1],olive:[128,128,0,1],olivedrab:[107,142,35,1],orange:[255,165,0,1],orangered:[255,69,0,1],orchid:[218,112,214,1],palegoldenrod:[238,232,170,1],palegreen:[152,251,152,1],paleturquoise:[175,238,238,1],palevioletred:[219,112,147,1],papayawhip:[255,239,213,1],peachpuff:[255,218,185,1],peru:[205,133,63,1],pink:[255,192,203,1],plum:[221,160,221,1],powderblue:[176,224,230,1],purple:[128,0,128,1],red:[255,0,0,1],rosybrown:[188,143,143,1],royalblue:[65,105,225,1],saddlebrown:[139,69,19,1],salmon:[250,128,114,1],sandybrown:[244,164,96,1],seagreen:[46,139,87,1],seashell:[255,245,238,1],sienna:[160,82,45,1],silver:[192,192,192,1],skyblue:[135,206,235,1],slateblue:[106,90,205,1],slategray:[112,128,144,1],slategrey:[112,128,144,1],snow:[255,250,250,1],springgreen:[0,255,127,1],steelblue:[70,130,180,1],tan:[210,180,140,1],teal:[0,128,128,1],thistle:[216,191,216,1],tomato:[255,99,71,1],turquoise:[64,224,208,1],violet:[238,130,238,1],wheat:[245,222,179,1],white:[255,255,255,1],whitesmoke:[245,245,245,1],yellow:[255,255,0,1],yellowgreen:[154,205,50,1]};function qn(e){return e=Math.round(e),e<0?0:e>255?255:e}function GC(e){return e=Math.round(e),e<0?0:e>360?360:e}function Qo(e){return e<0?0:e>1?1:e}function mh(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?qn(parseFloat(t)/100*255):qn(parseInt(t,10))}function Ss(e){var t=e;return t.length&&t.charAt(t.length-1)==="%"?Qo(parseFloat(t)/100):Qo(parseFloat(t))}function vh(e,t,n){return n<0?n+=1:n>1&&(n-=1),n*6<1?e+(t-e)*n*6:n*2<1?t:n*3<2?e+(t-e)*(2/3-n)*6:e}function Mr(e,t,n){return e+(t-e)*n}function Tn(e,t,n,i,r){return e[0]=t,e[1]=n,e[2]=i,e[3]=r,e}function Zd(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}var _y=new jo(20),Pl=null;function Bs(e,t){Pl&&Zd(Pl,t),Pl=_y.put(e,Pl||t.slice())}function xi(e,t){if(e){t=t||[];var n=_y.get(e);if(n)return Zd(t,n);e=e+"";var i=e.replace(/ /g,"").toLowerCase();if(i in v_)return Zd(t,v_[i]),Bs(e,t),t;var r=i.length;if(i.charAt(0)==="#"){if(r===4||r===5){var s=parseInt(i.slice(1,4),16);if(!(s>=0&&s<=4095)){Tn(t,0,0,0,1);return}return Tn(t,(s&3840)>>4|(s&3840)>>8,s&240|(s&240)>>4,s&15|(s&15)<<4,r===5?parseInt(i.slice(4),16)/15:1),Bs(e,t),t}else if(r===7||r===9){var s=parseInt(i.slice(1,7),16);if(!(s>=0&&s<=16777215)){Tn(t,0,0,0,1);return}return Tn(t,(s&16711680)>>16,(s&65280)>>8,s&255,r===9?parseInt(i.slice(7),16)/255:1),Bs(e,t),t}return}var a=i.indexOf("("),o=i.indexOf(")");if(a!==-1&&o+1===r){var l=i.substr(0,a),c=i.substr(a+1,o-(a+1)).split(","),f=1;switch(l){case"rgba":if(c.length!==4)return c.length===3?Tn(t,+c[0],+c[1],+c[2],1):Tn(t,0,0,0,1);f=Ss(c.pop());case"rgb":if(c.length>=3)return Tn(t,mh(c[0]),mh(c[1]),mh(c[2]),c.length===3?f:Ss(c[3])),Bs(e,t),t;Tn(t,0,0,0,1);return;case"hsla":if(c.length!==4){Tn(t,0,0,0,1);return}return c[3]=Ss(c[3]),Jd(c,t),Bs(e,t),t;case"hsl":if(c.length!==3){Tn(t,0,0,0,1);return}return Jd(c,t),Bs(e,t),t;default:return}}Tn(t,0,0,0,1)}}function Jd(e,t){var n=(parseFloat(e[0])%360+360)%360/360,i=Ss(e[1]),r=Ss(e[2]),s=r<=.5?r*(i+1):r+i-r*i,a=r*2-s;return t=t||[],Tn(t,qn(vh(a,s,n+1/3)*255),qn(vh(a,s,n)*255),qn(vh(a,s,n-1/3)*255),1),e.length===4&&(t[3]=e[3]),t}function kC(e){if(e){var t=e[0]/255,n=e[1]/255,i=e[2]/255,r=Math.min(t,n,i),s=Math.max(t,n,i),a=s-r,o=(s+r)/2,l,c;if(a===0)l=0,c=0;else{o<.5?c=a/(s+r):c=a/(2-s-r);var f=((s-t)/6+a/2)/a,u=((s-n)/6+a/2)/a,h=((s-i)/6+a/2)/a;t===s?l=h-u:n===s?l=1/3+f-h:i===s&&(l=2/3+u-f),l<0&&(l+=1),l>1&&(l-=1)}var d=[l*360,c,o];return e[3]!=null&&d.push(e[3]),d}}function __(e,t){var n=xi(e);if(n){for(var i=0;i<3;i++)n[i]=n[i]*(1-t)|0,n[i]>255?n[i]=255:n[i]<0&&(n[i]=0);return ul(n,n.length===4?"rgba":"rgb")}}function uF(e,t,n){if(!(!(t&&t.length)||!(e>=0&&e<=1))){n=n||[];var i=e*(t.length-1),r=Math.floor(i),s=Math.ceil(i),a=t[r],o=t[s],l=i-r;return n[0]=qn(Mr(a[0],o[0],l)),n[1]=qn(Mr(a[1],o[1],l)),n[2]=qn(Mr(a[2],o[2],l)),n[3]=Qo(Mr(a[3],o[3],l)),n}}function hF(e,t,n){if(!(!(t&&t.length)||!(e>=0&&e<=1))){var i=e*(t.length-1),r=Math.floor(i),s=Math.ceil(i),a=xi(t[r]),o=xi(t[s]),l=i-r,c=ul([qn(Mr(a[0],o[0],l)),qn(Mr(a[1],o[1],l)),qn(Mr(a[2],o[2],l)),Qo(Mr(a[3],o[3],l))],"rgba");return n?{color:c,leftIndex:r,rightIndex:s,value:i}:c}}function dF(e,t,n,i){var r=xi(e);if(e)return r=kC(r),t!=null&&(r[0]=GC(ys(t)?t(r[0]):t)),n!=null&&(r[1]=Ss(ys(n)?n(r[1]):n)),i!=null&&(r[2]=Ss(ys(i)?i(r[2]):i)),ul(Jd(r),"rgba")}function pF(e,t){var n=xi(e);if(n&&t!=null)return n[3]=Qo(t),ul(n,"rgba")}function ul(e,t){if(!(!e||!e.length)){var n=e[0]+","+e[1]+","+e[2];return(t==="rgba"||t==="hsva"||t==="hsla")&&(n+=","+e[3]),t+"("+n+")"}}function nf(e,t){var n=xi(e);return n?(.299*n[0]+.587*n[1]+.114*n[2])*n[3]/255+(1-n[3])*t:0}var g_=new jo(100);function mF(e){if(Zc(e)){var t=g_.get(e);return t||(t=__(e,-.1),g_.put(e,t)),t}else if(Su(e)){var n=_e({},e);return n.colorStops=wa(e.colorStops,function(i){return{offset:i.offset,color:__(i.color,-.1)}}),n}return e}function WC(e){return e.type==="linear"}function XC(e){return e.type==="radial"}(function(){return ge.hasGlobalWindow&&ys(window.btoa)?function(e){return window.btoa(unescape(encodeURIComponent(e)))}:typeof Buffer!="undefined"?function(e){return Buffer.from(e).toString("base64")}:function(e){return null}})();var jd=Array.prototype.slice;function ki(e,t,n){return(t-e)*n+e}function _h(e,t,n,i){for(var r=t.length,s=0;s<r;s++)e[s]=ki(t[s],n[s],i);return e}function qC(e,t,n,i){for(var r=t.length,s=r&&t[0].length,a=0;a<r;a++){e[a]||(e[a]=[]);for(var o=0;o<s;o++)e[a][o]=ki(t[a][o],n[a][o],i)}return e}function Ll(e,t,n,i){for(var r=t.length,s=0;s<r;s++)e[s]=t[s]+n[s]*i;return e}function x_(e,t,n,i){for(var r=t.length,s=r&&t[0].length,a=0;a<r;a++){e[a]||(e[a]=[]);for(var o=0;o<s;o++)e[a][o]=t[a][o]+n[a][o]*i}return e}function YC(e,t){for(var n=e.length,i=t.length,r=n>i?t:e,s=Math.min(n,i),a=r[s-1]||{color:[0,0,0,0],offset:0},o=s;o<Math.max(n,i);o++)r.push({offset:a.offset,color:a.color.slice()})}function $C(e,t,n){var i=e,r=t;if(!(!i.push||!r.push)){var s=i.length,a=r.length;if(s!==a){var o=s>a;if(o)i.length=a;else for(var l=s;l<a;l++)i.push(n===1?r[l]:jd.call(r[l]))}for(var c=i[0]&&i[0].length,l=0;l<i.length;l++)if(n===1)isNaN(i[l])&&(i[l]=r[l]);else for(var f=0;f<c;f++)isNaN(i[l][f])&&(i[l][f]=r[l][f])}}function Ec(e){if(Ti(e)){var t=e.length;if(Ti(e[0])){for(var n=[],i=0;i<t;i++)n.push(jd.call(e[i]));return n}return jd.call(e)}return e}function wc(e){return e[0]=Math.floor(e[0])||0,e[1]=Math.floor(e[1])||0,e[2]=Math.floor(e[2])||0,e[3]=e[3]==null?1:e[3],"rgba("+e.join(",")+")"}function KC(e){return Ti(e&&e[0])?2:1}var Dl=0,Ac=1,gy=2,po=3,Qd=4,tp=5,y_=6;function S_(e){return e===Qd||e===tp}function Il(e){return e===Ac||e===gy}var $a=[0,0,0,0],ZC=function(){function e(t){this.keyframes=[],this.discrete=!1,this._invalid=!1,this._needsSort=!1,this._lastFr=0,this._lastFrP=0,this.propName=t}return e.prototype.isFinished=function(){return this._finished},e.prototype.setFinished=function(){this._finished=!0,this._additiveTrack&&this._additiveTrack.setFinished()},e.prototype.needsAnimate=function(){return this.keyframes.length>=1},e.prototype.getAdditiveTrack=function(){return this._additiveTrack},e.prototype.addKeyframe=function(t,n,i){this._needsSort=!0;var r=this.keyframes,s=r.length,a=!1,o=y_,l=n;if(Ti(n)){var c=KC(n);o=c,(c===1&&!bc(n[0])||c===2&&!bc(n[0][0]))&&(a=!0)}else if(bc(n)&&!WA(n))o=Dl;else if(Zc(n))if(!isNaN(+n))o=Dl;else{var f=xi(n);f&&(l=f,o=po)}else if(Su(n)){var u=_e({},l);u.colorStops=wa(n.colorStops,function(d){return{offset:d.offset,color:xi(d.color)}}),WC(n)?o=Qd:XC(n)&&(o=tp),l=u}s===0?this.valType=o:(o!==this.valType||o===y_)&&(a=!0),this.discrete=this.discrete||a;var h={time:t,value:l,rawValue:n,percent:0};return i&&(h.easing=i,h.easingFunc=ys(i)?i:Do[i]||my(i)),r.push(h),h},e.prototype.prepare=function(t,n){var i=this.keyframes;this._needsSort&&i.sort(function(_,m){return _.time-m.time});for(var r=this.valType,s=i.length,a=i[s-1],o=this.discrete,l=Il(r),c=S_(r),f=0;f<s;f++){var u=i[f],h=u.value,d=a.value;u.percent=u.time/t,o||(l&&f!==s-1?$C(h,d,r):c&&YC(h.colorStops,d.colorStops))}if(!o&&r!==tp&&n&&this.needsAnimate()&&n.needsAnimate()&&r===n.valType&&!n._finished){this._additiveTrack=n;for(var v=i[0].value,f=0;f<s;f++)r===Dl?i[f].additiveValue=i[f].value-v:r===po?i[f].additiveValue=Ll([],i[f].value,v,-1):Il(r)&&(i[f].additiveValue=r===Ac?Ll([],i[f].value,v,-1):x_([],i[f].value,v,-1))}},e.prototype.step=function(t,n){if(!this._finished){this._additiveTrack&&this._additiveTrack._finished&&(this._additiveTrack=null);var i=this._additiveTrack!=null,r=i?"additiveValue":"value",s=this.valType,a=this.keyframes,o=a.length,l=this.propName,c=s===po,f,u=this._lastFr,h=Math.min,d,v;if(o===1)d=v=a[0];else{if(n<0)f=0;else if(n<this._lastFrP){var _=h(u+1,o-1);for(f=_;f>=0&&!(a[f].percent<=n);f--);f=h(f,o-2)}else{for(f=u;f<o&&!(a[f].percent>n);f++);f=h(f-1,o-2)}v=a[f+1],d=a[f]}if(d&&v){this._lastFr=f,this._lastFrP=n;var m=v.percent-d.percent,p=m===0?1:h((n-d.percent)/m,1);v.easingFunc&&(p=v.easingFunc(p));var x=i?this._additiveValue:c?$a:t[l];if((Il(s)||c)&&!x&&(x=this._additiveValue=[]),this.discrete)t[l]=p<1?d.rawValue:v.rawValue;else if(Il(s))s===Ac?_h(x,d[r],v[r],p):qC(x,d[r],v[r],p);else if(S_(s)){var b=d[r],S=v[r],T=s===Qd;t[l]={type:T?"linear":"radial",x:ki(b.x,S.x,p),y:ki(b.y,S.y,p),colorStops:wa(b.colorStops,function(C,R){var g=S.colorStops[R];return{offset:ki(C.offset,g.offset,p),color:wc(_h([],C.color,g.color,p))}}),global:S.global},T?(t[l].x2=ki(b.x2,S.x2,p),t[l].y2=ki(b.y2,S.y2,p)):t[l].r=ki(b.r,S.r,p)}else if(c)_h(x,d[r],v[r],p),i||(t[l]=wc(x));else{var E=ki(d[r],v[r],p);i?this._additiveValue=E:t[l]=E}i&&this._addToTarget(t)}}},e.prototype._addToTarget=function(t){var n=this.valType,i=this.propName,r=this._additiveValue;n===Dl?t[i]=t[i]+r:n===po?(xi(t[i],$a),Ll($a,$a,r,1),t[i]=wc($a)):n===Ac?Ll(t[i],t[i],r,1):n===gy&&x_(t[i],t[i],r,1)},e}(),nm=function(){function e(t,n,i,r){if(this._tracks={},this._trackKeys=[],this._maxTime=0,this._started=0,this._clip=null,this._target=t,this._loop=n,n&&r){tm("Can' use additive animation on looped animation.");return}this._additiveAnimators=r,this._allowDiscrete=i}return e.prototype.getMaxTime=function(){return this._maxTime},e.prototype.getDelay=function(){return this._delay},e.prototype.getLoop=function(){return this._loop},e.prototype.getTarget=function(){return this._target},e.prototype.changeTarget=function(t){this._target=t},e.prototype.when=function(t,n,i){return this.whenWithKeys(t,n,yn(n),i)},e.prototype.whenWithKeys=function(t,n,i,r){for(var s=this._tracks,a=0;a<i.length;a++){var o=i[a],l=s[o];if(!l){l=s[o]=new ZC(o);var c=void 0,f=this._getAdditiveTrack(o);if(f){var u=f.keyframes,h=u[u.length-1];c=h&&h.value,f.valType===po&&c&&(c=wc(c))}else c=this._target[o];if(c==null)continue;t>0&&l.addKeyframe(0,Ec(c),r),this._trackKeys.push(o)}l.addKeyframe(t,Ec(n[o]),r)}return this._maxTime=Math.max(this._maxTime,t),this},e.prototype.pause=function(){this._clip.pause(),this._paused=!0},e.prototype.resume=function(){this._clip.resume(),this._paused=!1},e.prototype.isPaused=function(){return!!this._paused},e.prototype.duration=function(t){return this._maxTime=t,this._force=!0,this},e.prototype._doneCallback=function(){this._setTracksFinished(),this._clip=null;var t=this._doneCbs;if(t)for(var n=t.length,i=0;i<n;i++)t[i].call(this)},e.prototype._abortedCallback=function(){this._setTracksFinished();var t=this.animation,n=this._abortedCbs;if(t&&t.removeClip(this._clip),this._clip=null,n)for(var i=0;i<n.length;i++)n[i].call(this)},e.prototype._setTracksFinished=function(){for(var t=this._tracks,n=this._trackKeys,i=0;i<n.length;i++)t[n[i]].setFinished()},e.prototype._getAdditiveTrack=function(t){var n,i=this._additiveAnimators;if(i)for(var r=0;r<i.length;r++){var s=i[r].getTrack(t);s&&(n=s)}return n},e.prototype.start=function(t){if(!(this._started>0)){this._started=1;for(var n=this,i=[],r=this._maxTime||0,s=0;s<this._trackKeys.length;s++){var a=this._trackKeys[s],o=this._tracks[a],l=this._getAdditiveTrack(a),c=o.keyframes,f=c.length;if(o.prepare(r,l),o.needsAnimate())if(!this._allowDiscrete&&o.discrete){var u=c[f-1];u&&(n._target[o.propName]=u.rawValue),o.setFinished()}else i.push(o)}if(i.length||this._force){var h=new zC({life:r,loop:this._loop,delay:this._delay||0,onframe:function(d){n._started=2;var v=n._additiveAnimators;if(v){for(var _=!1,m=0;m<v.length;m++)if(v[m]._clip){_=!0;break}_||(n._additiveAnimators=null)}for(var m=0;m<i.length;m++)i[m].step(n._target,d);var p=n._onframeCbs;if(p)for(var m=0;m<p.length;m++)p[m](n._target,d)},ondestroy:function(){n._doneCallback()}});this._clip=h,this.animation&&this.animation.addClip(h),t&&h.setEasing(t)}else this._doneCallback();return this}},e.prototype.stop=function(t){if(this._clip){var n=this._clip;t&&n.onframe(1),this._abortedCallback()}},e.prototype.delay=function(t){return this._delay=t,this},e.prototype.during=function(t){return t&&(this._onframeCbs||(this._onframeCbs=[]),this._onframeCbs.push(t)),this},e.prototype.done=function(t){return t&&(this._doneCbs||(this._doneCbs=[]),this._doneCbs.push(t)),this},e.prototype.aborted=function(t){return t&&(this._abortedCbs||(this._abortedCbs=[]),this._abortedCbs.push(t)),this},e.prototype.getClip=function(){return this._clip},e.prototype.getTrack=function(t){return this._tracks[t]},e.prototype.getTracks=function(){var t=this;return wa(this._trackKeys,function(n){return t._tracks[n]})},e.prototype.stopTracks=function(t,n){if(!t.length||!this._clip)return!0;for(var i=this._tracks,r=this._trackKeys,s=0;s<t.length;s++){var a=i[t[s]];a&&!a.isFinished()&&(n?a.step(this._target,1):this._started===1&&a.step(this._target,0),a.setFinished())}for(var o=!0,s=0;s<r.length;s++)if(!i[r[s]].isFinished()){o=!1;break}return o&&this._abortedCallback(),o},e.prototype.saveTo=function(t,n,i){if(t){n=n||this._trackKeys;for(var r=0;r<n.length;r++){var s=n[r],a=this._tracks[s];if(!(!a||a.isFinished())){var o=a.keyframes,l=o[i?0:o.length-1];l&&(t[s]=Ec(l.rawValue))}}}},e.prototype.__changeFinalValue=function(t,n){n=n||yn(t);for(var i=0;i<n.length;i++){var r=n[i],s=this._tracks[r];if(s){var a=s.keyframes;if(a.length>1){var o=a.pop();s.addKeyframe(o.time,t[r]),s.prepare(this._maxTime,s.getAdditiveTrack())}}}},e}();function la(){return new Date().getTime()}var JC=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i._running=!1,i._time=0,i._pausedTime=0,i._pauseStart=0,i._paused=!1,n=n||{},i.stage=n.stage||{},i}return t.prototype.addClip=function(n){n.animation&&this.removeClip(n),this._head?(this._tail.next=n,n.prev=this._tail,n.next=null,this._tail=n):this._head=this._tail=n,n.animation=this},t.prototype.addAnimator=function(n){n.animation=this;var i=n.getClip();i&&this.addClip(i)},t.prototype.removeClip=function(n){if(n.animation){var i=n.prev,r=n.next;i?i.next=r:this._head=r,r?r.prev=i:this._tail=i,n.next=n.prev=n.animation=null}},t.prototype.removeAnimator=function(n){var i=n.getClip();i&&this.removeClip(i),n.animation=null},t.prototype.update=function(n){for(var i=la()-this._pausedTime,r=i-this._time,s=this._head;s;){var a=s.next,o=s.step(i,r);o&&(s.ondestroy(),this.removeClip(s)),s=a}this._time=i,n||(this.trigger("frame",r),this.stage.update&&this.stage.update())},t.prototype._startLoop=function(){var n=this;this._running=!0;function i(){n._running&&(jc(i),!n._paused&&n.update())}jc(i)},t.prototype.start=function(){this._running||(this._time=la(),this._pausedTime=0,this._startLoop())},t.prototype.stop=function(){this._running=!1},t.prototype.pause=function(){this._paused||(this._pauseStart=la(),this._paused=!0)},t.prototype.resume=function(){this._paused&&(this._pausedTime+=la()-this._pauseStart,this._paused=!1)},t.prototype.clear=function(){for(var n=this._head;n;){var i=n.next;n.prev=n.next=n.animation=null,n=i}this._head=this._tail=null},t.prototype.isFinished=function(){return this._head==null},t.prototype.animate=function(n,i){i=i||{},this.start();var r=new nm(n,i.loop);return this.addAnimator(r),r},t}(Ua),jC=300,gh=ge.domSupported,xh=function(){var e=["click","dblclick","mousewheel","wheel","mouseout","mouseup","mousedown","mousemove","contextmenu"],t=["touchstart","touchend","touchmove"],n={pointerdown:1,pointerup:1,pointermove:1,pointerout:1},i=wa(e,function(r){var s=r.replace("mouse","pointer");return n.hasOwnProperty(s)?s:r});return{mouse:e,touch:t,pointer:i}}(),M_={mouse:["mousemove","mouseup"],pointer:["pointermove","pointerup"]},b_=!1;function ep(e){var t=e.pointerType;return t==="pen"||t==="touch"}function QC(e){e.touching=!0,e.touchTimer!=null&&(clearTimeout(e.touchTimer),e.touchTimer=null),e.touchTimer=setTimeout(function(){e.touching=!1,e.touchTimer=null},700)}function yh(e){e&&(e.zrByTouch=!0)}function tR(e,t){return Hn(e.dom,new eR(e,t),!0)}function xy(e,t){for(var n=t,i=!1;n&&n.nodeType!==9&&!(i=n.domBelongToZr||n!==t&&n===e.painterRoot);)n=n.parentNode;return i}var eR=function(){function e(t,n){this.stopPropagation=_a,this.stopImmediatePropagation=_a,this.preventDefault=_a,this.type=n.type,this.target=this.currentTarget=t.dom,this.pointerType=n.pointerType,this.clientX=n.clientX,this.clientY=n.clientY}return e}(),zn={mousedown:function(e){e=Hn(this.dom,e),this.__mayPointerCapture=[e.zrX,e.zrY],this.trigger("mousedown",e)},mousemove:function(e){e=Hn(this.dom,e);var t=this.__mayPointerCapture;t&&(e.zrX!==t[0]||e.zrY!==t[1])&&this.__togglePointerCapture(!0),this.trigger("mousemove",e)},mouseup:function(e){e=Hn(this.dom,e),this.__togglePointerCapture(!1),this.trigger("mouseup",e)},mouseout:function(e){e=Hn(this.dom,e);var t=e.toElement||e.relatedTarget;xy(this,t)||(this.__pointerCapturing&&(e.zrEventControl="no_globalout"),this.trigger("mouseout",e))},wheel:function(e){b_=!0,e=Hn(this.dom,e),this.trigger("mousewheel",e)},mousewheel:function(e){b_||(e=Hn(this.dom,e),this.trigger("mousewheel",e))},touchstart:function(e){e=Hn(this.dom,e),yh(e),this.__lastTouchMoment=new Date,this.handler.processGesture(e,"start"),zn.mousemove.call(this,e),zn.mousedown.call(this,e)},touchmove:function(e){e=Hn(this.dom,e),yh(e),this.handler.processGesture(e,"change"),zn.mousemove.call(this,e)},touchend:function(e){e=Hn(this.dom,e),yh(e),this.handler.processGesture(e,"end"),zn.mouseup.call(this,e),+new Date-+this.__lastTouchMoment<jC&&zn.click.call(this,e)},pointerdown:function(e){zn.mousedown.call(this,e)},pointermove:function(e){ep(e)||zn.mousemove.call(this,e)},pointerup:function(e){zn.mouseup.call(this,e)},pointerout:function(e){ep(e)||zn.mouseout.call(this,e)}};ln(["click","dblclick","contextmenu"],function(e){zn[e]=function(t){t=Hn(this.dom,t),this.trigger(e,t)}});var np={pointermove:function(e){ep(e)||np.mousemove.call(this,e)},pointerup:function(e){np.mouseup.call(this,e)},mousemove:function(e){this.trigger("mousemove",e)},mouseup:function(e){var t=this.__pointerCapturing;this.__togglePointerCapture(!1),this.trigger("mouseup",e),t&&(e.zrEventControl="only_globalout",this.trigger("mouseout",e))}};function nR(e,t){var n=t.domHandlers;ge.pointerEventsSupported?ln(xh.pointer,function(i){Cc(t,i,function(r){n[i].call(e,r)})}):(ge.touchEventsSupported&&ln(xh.touch,function(i){Cc(t,i,function(r){n[i].call(e,r),QC(t)})}),ln(xh.mouse,function(i){Cc(t,i,function(r){r=em(r),t.touching||n[i].call(e,r)})}))}function iR(e,t){ge.pointerEventsSupported?ln(M_.pointer,n):ge.touchEventsSupported||ln(M_.mouse,n);function n(i){function r(s){s=em(s),xy(e,s.target)||(s=tR(e,s),t.domHandlers[i].call(e,s))}Cc(t,i,r,{capture:!0})}}function Cc(e,t,n,i){e.mounted[t]=n,e.listenerOpts[t]=i,hC(e.domTarget,t,n,i)}function Sh(e){var t=e.mounted;for(var n in t)t.hasOwnProperty(n)&&dC(e.domTarget,n,t[n],e.listenerOpts[n]);e.mounted={}}var T_=function(){function e(t,n){this.mounted={},this.listenerOpts={},this.touching=!1,this.domTarget=t,this.domHandlers=n}return e}(),rR=function(e){ue(t,e);function t(n,i){var r=e.call(this)||this;return r.__pointerCapturing=!1,r.dom=n,r.painterRoot=i,r._localHandlerScope=new T_(n,zn),gh&&(r._globalHandlerScope=new T_(document,np)),nR(r,r._localHandlerScope),r}return t.prototype.dispose=function(){Sh(this._localHandlerScope),gh&&Sh(this._globalHandlerScope)},t.prototype.setCursor=function(n){this.dom.style&&(this.dom.style.cursor=n||"default")},t.prototype.__togglePointerCapture=function(n){if(this.__mayPointerCapture=null,gh&&+this.__pointerCapturing^+n){this.__pointerCapturing=n;var i=this._globalHandlerScope;n?iR(this,i):Sh(i)}},t}(Ua),yy=1;ge.hasGlobalWindow&&(yy=Math.max(window.devicePixelRatio||window.screen&&window.screen.deviceXDPI/window.screen.logicalXDPI||1,1));var rf=yy,ip=.4,rp="#333",sp="#ccc",sR="#eee",E_=_C,w_=5e-5;function Wr(e){return e>w_||e<-w_}var Xr=[],Hs=[],Mh=Po(),bh=Math.abs,Sy=function(){function e(){}return e.prototype.getLocalTransform=function(t){return e.getLocalTransform(this,t)},e.prototype.setPosition=function(t){this.x=t[0],this.y=t[1]},e.prototype.setScale=function(t){this.scaleX=t[0],this.scaleY=t[1]},e.prototype.setSkew=function(t){this.skewX=t[0],this.skewY=t[1]},e.prototype.setOrigin=function(t){this.originX=t[0],this.originY=t[1]},e.prototype.needLocalTransform=function(){return Wr(this.rotation)||Wr(this.x)||Wr(this.y)||Wr(this.scaleX-1)||Wr(this.scaleY-1)||Wr(this.skewX)||Wr(this.skewY)},e.prototype.updateTransform=function(){var t=this.parent&&this.parent.transform,n=this.needLocalTransform(),i=this.transform;if(!(n||t)){i&&(E_(i),this.invTransform=null);return}i=i||Po(),n?this.getLocalTransform(i):E_(i),t&&(n?fh(i,t,i):gC(i,t)),this.transform=i,this._resolveGlobalScaleRatio(i)},e.prototype._resolveGlobalScaleRatio=function(t){var n=this.globalScaleRatio;if(n!=null&&n!==1){this.getGlobalScale(Xr);var i=Xr[0]<0?-1:1,r=Xr[1]<0?-1:1,s=((Xr[0]-i)*n+i)/Xr[0]||0,a=((Xr[1]-r)*n+r)/Xr[1]||0;t[0]*=s,t[1]*=s,t[2]*=a,t[3]*=a}this.invTransform=this.invTransform||Po(),ry(this.invTransform,t)},e.prototype.getComputedTransform=function(){for(var t=this,n=[];t;)n.push(t),t=t.parent;for(;t=n.pop();)t.updateTransform();return this.transform},e.prototype.setLocalTransform=function(t){if(t){var n=t[0]*t[0]+t[1]*t[1],i=t[2]*t[2]+t[3]*t[3],r=Math.atan2(t[1],t[0]),s=Math.PI/2+r-Math.atan2(t[3],t[2]);i=Math.sqrt(i)*Math.cos(s),n=Math.sqrt(n),this.skewX=s,this.skewY=0,this.rotation=-r,this.x=+t[4],this.y=+t[5],this.scaleX=n,this.scaleY=i,this.originX=0,this.originY=0}},e.prototype.decomposeTransform=function(){if(this.transform){var t=this.parent,n=this.transform;t&&t.transform&&(t.invTransform=t.invTransform||Po(),fh(Hs,t.invTransform,n),n=Hs);var i=this.originX,r=this.originY;(i||r)&&(Mh[4]=i,Mh[5]=r,fh(Hs,n,Mh),Hs[4]-=i,Hs[5]-=r,n=Hs),this.setLocalTransform(n)}},e.prototype.getGlobalScale=function(t){var n=this.transform;return t=t||[],n?(t[0]=Math.sqrt(n[0]*n[0]+n[1]*n[1]),t[1]=Math.sqrt(n[2]*n[2]+n[3]*n[3]),n[0]<0&&(t[0]=-t[0]),n[3]<0&&(t[1]=-t[1]),t):(t[0]=1,t[1]=1,t)},e.prototype.transformCoordToLocal=function(t,n){var i=[t,n],r=this.invTransform;return r&&Ro(i,i,r),i},e.prototype.transformCoordToGlobal=function(t,n){var i=[t,n],r=this.transform;return r&&Ro(i,i,r),i},e.prototype.getLineScale=function(){var t=this.transform;return t&&bh(t[0]-1)>1e-10&&bh(t[3]-1)>1e-10?Math.sqrt(bh(t[0]*t[3]-t[2]*t[1])):1},e.prototype.copyTransform=function(t){aR(this,t)},e.getLocalTransform=function(t,n){n=n||[];var i=t.originX||0,r=t.originY||0,s=t.scaleX,a=t.scaleY,o=t.anchorX,l=t.anchorY,c=t.rotation||0,f=t.x,u=t.y,h=t.skewX?Math.tan(t.skewX):0,d=t.skewY?Math.tan(-t.skewY):0;if(i||r||o||l){var v=i+o,_=r+l;n[4]=-v*s-h*_*a,n[5]=-_*a-d*v*s}else n[4]=n[5]=0;return n[0]=s,n[3]=a,n[1]=d*s,n[2]=h*a,c&&xC(n,n,c),n[4]+=i+f,n[5]+=r+u,n},e.initDefaultProps=function(){var t=e.prototype;t.scaleX=t.scaleY=t.globalScaleRatio=1,t.x=t.y=t.originX=t.originY=t.skewX=t.skewY=t.rotation=t.anchorX=t.anchorY=0}(),e}(),tl=["x","y","originX","originY","anchorX","anchorY","rotation","scaleX","scaleY","skewX","skewY"];function aR(e,t){for(var n=0;n<tl.length;n++){var i=tl[n];e[i]=t[i]}}function yi(e){Nl||(Nl=new jo(100)),e=e||Pr;var t=Nl.get(e);return t||(t={font:e,strWidthCache:new jo(500),asciiWidthMap:null,asciiWidthMapTried:!1,stWideCharWidth:As.measureText("国",e).width,asciiCharWidth:As.measureText("a",e).width},Nl.put(e,t)),t}var Nl;function oR(e){if(!(Th>=A_)){e=e||Pr;for(var t=[],n=+new Date,i=0;i<=127;i++)t[i]=As.measureText(String.fromCharCode(i),e).width;var r=+new Date-n;return r>16?Th=A_:r>2&&Th++,t}}var Th=0,A_=5;function My(e,t){return e.asciiWidthMapTried||(e.asciiWidthMap=oR(e.font),e.asciiWidthMapTried=!0),0<=t&&t<=127?e.asciiWidthMap!=null?e.asciiWidthMap[t]:e.asciiCharWidth:e.stWideCharWidth}function Si(e,t){var n=e.strWidthCache,i=n.get(t);return i==null&&(i=As.measureText(t,e.font).width,n.put(t,i)),i}function C_(e,t,n,i){var r=Si(yi(t),e),s=bu(t),a=Aa(0,r,n),o=Ms(0,s,i),l=new ce(a,o,r,s);return l}function vF(e,t,n,i){var r=((e||"")+"").split(`
`),s=r.length;if(s===1)return C_(r[0],t,n,i);for(var a=new ce(0,0,0,0),o=0;o<r.length;o++){var l=C_(r[o],t,n,i);o===0?a.copy(l):a.union(l)}return a}function Aa(e,t,n,i){return n==="right"?i?e+=t:e-=t:n==="center"&&(i?e+=t/2:e-=t/2),e}function Ms(e,t,n,i){return n==="middle"?i?e+=t/2:e-=t/2:n==="bottom"&&(i?e+=t:e-=t),e}function bu(e){return yi(e).stWideCharWidth}function el(e,t){return typeof e=="string"?e.lastIndexOf("%")>=0?parseFloat(e)/100*t:parseFloat(e):e}function lR(e,t,n){var i=t.position||"inside",r=t.distance!=null?t.distance:5,s=n.height,a=n.width,o=s/2,l=n.x,c=n.y,f="left",u="top";if(i instanceof Array)l+=el(i[0],n.width),c+=el(i[1],n.height),f=null,u=null;else switch(i){case"left":l-=r,c+=o,f="right",u="middle";break;case"right":l+=r+a,c+=o,u="middle";break;case"top":l+=a/2,c-=r,f="center",u="bottom";break;case"bottom":l+=a/2,c+=s+r,f="center";break;case"inside":l+=a/2,c+=o,f="center",u="middle";break;case"insideLeft":l+=r,c+=o,u="middle";break;case"insideRight":l+=a-r,c+=o,f="right",u="middle";break;case"insideTop":l+=a/2,c+=r,f="center";break;case"insideBottom":l+=a/2,c+=s-r,f="center",u="bottom";break;case"insideTopLeft":l+=r,c+=r;break;case"insideTopRight":l+=a-r,c+=r,f="right";break;case"insideBottomLeft":l+=r,c+=s-r,u="bottom";break;case"insideBottomRight":l+=a-r,c+=s-r,f="right",u="bottom";break}return e=e||{},e.x=l,e.y=c,e.align=f,e.verticalAlign=u,e}var Eh="__zr_normal__",wh=tl.concat(["ignore"]),cR=yu(tl,function(e,t){return e[t]=!0,e},{ignore:!1}),zs={},fR=new ce(0,0,0,0),Fl=[],Tu=function(){function e(t){this.id=Jx(),this.animators=[],this.currentStates=[],this.states={},this._init(t)}return e.prototype._init=function(t){this.attr(t)},e.prototype.drift=function(t,n,i){switch(this.draggable){case"horizontal":n=0;break;case"vertical":t=0;break}var r=this.transform;r||(r=this.transform=[1,0,0,1,0,0]),r[4]+=t,r[5]+=n,this.decomposeTransform(),this.markRedraw()},e.prototype.beforeUpdate=function(){},e.prototype.afterUpdate=function(){},e.prototype.update=function(){this.updateTransform(),this.__dirty&&this.updateInnerText()},e.prototype.updateInnerText=function(t){var n=this._textContent;if(n&&(!n.ignore||t)){this.textConfig||(this.textConfig={});var i=this.textConfig,r=i.local,s=n.innerTransformable,a=void 0,o=void 0,l=!1;s.parent=r?this:null;var c=!1;s.copyTransform(n);var f=i.position!=null,u=i.autoOverflowArea,h=void 0;if((u||f)&&(h=fR,i.layoutRect?h.copy(i.layoutRect):h.copy(this.getBoundingRect()),r||h.applyTransform(this.transform)),f){this.calculateTextPosition?this.calculateTextPosition(zs,i,h):lR(zs,i,h),s.x=zs.x,s.y=zs.y,a=zs.align,o=zs.verticalAlign;var d=i.origin;if(d&&i.rotation!=null){var v=void 0,_=void 0;d==="center"?(v=h.width*.5,_=h.height*.5):(v=el(d[0],h.width),_=el(d[1],h.height)),c=!0,s.originX=-s.x+v+(r?0:h.x),s.originY=-s.y+_+(r?0:h.y)}}i.rotation!=null&&(s.rotation=i.rotation);var m=i.offset;m&&(s.x+=m[0],s.y+=m[1],c||(s.originX=-m[0],s.originY=-m[1]));var p=this._innerTextDefaultStyle||(this._innerTextDefaultStyle={});if(u){var x=p.overflowRect=p.overflowRect||new ce(0,0,0,0);s.getLocalTransform(Fl),ry(Fl,Fl),ce.copy(x,h),x.applyTransform(Fl)}else p.overflowRect=null;var b=i.inside==null?typeof i.position=="string"&&i.position.indexOf("inside")>=0:i.inside,S=void 0,T=void 0,E=void 0;b&&this.canBeInsideText()?(S=i.insideFill,T=i.insideStroke,(S==null||S==="auto")&&(S=this.getInsideTextFill()),(T==null||T==="auto")&&(T=this.getInsideTextStroke(S),E=!0)):(S=i.outsideFill,T=i.outsideStroke,(S==null||S==="auto")&&(S=this.getOutsideFill()),(T==null||T==="auto")&&(T=this.getOutsideStroke(S),E=!0)),S=S||"#000",(S!==p.fill||T!==p.stroke||E!==p.autoStroke||a!==p.align||o!==p.verticalAlign)&&(l=!0,p.fill=S,p.stroke=T,p.autoStroke=E,p.align=a,p.verticalAlign=o,n.setDefaultTextStyle(p)),n.__dirty|=vn,l&&n.dirtyStyle(!0)}},e.prototype.canBeInsideText=function(){return!0},e.prototype.getInsideTextFill=function(){return"#fff"},e.prototype.getInsideTextStroke=function(t){return"#000"},e.prototype.getOutsideFill=function(){return this.__zr&&this.__zr.isDarkMode()?sp:rp},e.prototype.getOutsideStroke=function(t){var n=this.__zr&&this.__zr.getBackgroundColor(),i=typeof n=="string"&&xi(n);i||(i=[255,255,255,1]);for(var r=i[3],s=this.__zr.isDarkMode(),a=0;a<3;a++)i[a]=i[a]*r+(s?0:255)*(1-r);return i[3]=1,ul(i,"rgba")},e.prototype.traverse=function(t,n){},e.prototype.attrKV=function(t,n){t==="textConfig"?this.setTextConfig(n):t==="textContent"?this.setTextContent(n):t==="clipPath"?this.setClipPath(n):t==="extra"?(this.extra=this.extra||{},_e(this.extra,n)):this[t]=n},e.prototype.hide=function(){this.ignore=!0,this.markRedraw()},e.prototype.show=function(){this.ignore=!1,this.markRedraw()},e.prototype.attr=function(t,n){if(typeof t=="string")this.attrKV(t,n);else if(yr(t))for(var i=t,r=yn(i),s=0;s<r.length;s++){var a=r[s];this.attrKV(a,t[a])}return this.markRedraw(),this},e.prototype.saveCurrentToNormalState=function(t){this._innerSaveToNormal(t);for(var n=this._normalState,i=0;i<this.animators.length;i++){var r=this.animators[i],s=r.__fromStateTransition;if(!(r.getLoop()||s&&s!==Eh)){var a=r.targetName,o=a?n[a]:n;r.saveTo(o)}}},e.prototype._innerSaveToNormal=function(t){var n=this._normalState;n||(n=this._normalState={}),t.textConfig&&!n.textConfig&&(n.textConfig=this.textConfig),this._savePrimaryToNormal(t,n,wh)},e.prototype._savePrimaryToNormal=function(t,n,i){for(var r=0;r<i.length;r++){var s=i[r];t[s]!=null&&!(s in n)&&(n[s]=this[s])}},e.prototype.hasState=function(){return this.currentStates.length>0},e.prototype.getState=function(t){return this.states[t]},e.prototype.ensureState=function(t){var n=this.states;return n[t]||(n[t]={}),n[t]},e.prototype.clearStates=function(t){this.useState(Eh,!1,t)},e.prototype.useState=function(t,n,i,r){var s=t===Eh,a=this.hasState();if(!(!a&&s)){var o=this.currentStates,l=this.stateTransition;if(!(di(o,t)>=0&&(n||o.length===1))){var c;if(this.stateProxy&&!s&&(c=this.stateProxy(t)),c||(c=this.states&&this.states[t]),!c&&!s){tm("State "+t+" not exists.");return}s||this.saveCurrentToNormalState(c);var f=!!(c&&c.hoverLayer||r);f&&this._toggleHoverLayerFlag(!0),this._applyStateObj(t,c,this._normalState,n,!i&&!this.__inHover&&l&&l.duration>0,l);var u=this._textContent,h=this._textGuide;return u&&u.useState(t,n,i,f),h&&h.useState(t,n,i,f),s?(this.currentStates=[],this._normalState={}):n?this.currentStates.push(t):this.currentStates=[t],this._updateAnimationTargets(),this.markRedraw(),!f&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~vn),c}}},e.prototype.useStates=function(t,n,i){if(!t.length)this.clearStates();else{var r=[],s=this.currentStates,a=t.length,o=a===s.length;if(o){for(var l=0;l<a;l++)if(t[l]!==s[l]){o=!1;break}}if(o)return;for(var l=0;l<a;l++){var c=t[l],f=void 0;this.stateProxy&&(f=this.stateProxy(c,t)),f||(f=this.states[c]),f&&r.push(f)}var u=r[a-1],h=!!(u&&u.hoverLayer||i);h&&this._toggleHoverLayerFlag(!0);var d=this._mergeStates(r),v=this.stateTransition;this.saveCurrentToNormalState(d),this._applyStateObj(t.join(","),d,this._normalState,!1,!n&&!this.__inHover&&v&&v.duration>0,v);var _=this._textContent,m=this._textGuide;_&&_.useStates(t,n,h),m&&m.useStates(t,n,h),this._updateAnimationTargets(),this.currentStates=t.slice(),this.markRedraw(),!h&&this.__inHover&&(this._toggleHoverLayerFlag(!1),this.__dirty&=~vn)}},e.prototype.isSilent=function(){for(var t=this;t;){if(t.silent)return!0;var n=t.__hostTarget;t=n?t.ignoreHostSilent?null:n:t.parent}return!1},e.prototype._updateAnimationTargets=function(){for(var t=0;t<this.animators.length;t++){var n=this.animators[t];n.targetName&&n.changeTarget(this[n.targetName])}},e.prototype.removeState=function(t){var n=di(this.currentStates,t);if(n>=0){var i=this.currentStates.slice();i.splice(n,1),this.useStates(i)}},e.prototype.replaceState=function(t,n,i){var r=this.currentStates.slice(),s=di(r,t),a=di(r,n)>=0;s>=0?a?r.splice(s,1):r[s]=n:i&&!a&&r.push(n),this.useStates(r)},e.prototype.toggleState=function(t,n){n?this.useState(t,!0):this.removeState(t)},e.prototype._mergeStates=function(t){for(var n={},i,r=0;r<t.length;r++){var s=t[r];_e(n,s),s.textConfig&&(i=i||{},_e(i,s.textConfig))}return i&&(n.textConfig=i),n},e.prototype._applyStateObj=function(t,n,i,r,s,a){var o=!(n&&r);n&&n.textConfig?(this.textConfig=_e({},r?this.textConfig:i.textConfig),_e(this.textConfig,n.textConfig)):o&&i.textConfig&&(this.textConfig=i.textConfig);for(var l={},c=!1,f=0;f<wh.length;f++){var u=wh[f],h=s&&cR[u];n&&n[u]!=null?h?(c=!0,l[u]=n[u]):this[u]=n[u]:o&&i[u]!=null&&(h?(c=!0,l[u]=i[u]):this[u]=i[u])}if(!s)for(var f=0;f<this.animators.length;f++){var d=this.animators[f],v=d.targetName;d.getLoop()||d.__changeFinalValue(v?(n||i)[v]:n||i)}c&&this._transitionState(t,l,a)},e.prototype._attachComponent=function(t){if(!(t.__zr&&!t.__hostTarget)&&t!==this){var n=this.__zr;n&&t.addSelfToZr(n),t.__zr=n,t.__hostTarget=this}},e.prototype._detachComponent=function(t){t.__zr&&t.removeSelfFromZr(t.__zr),t.__zr=null,t.__hostTarget=null},e.prototype.getClipPath=function(){return this._clipPath},e.prototype.setClipPath=function(t){this._clipPath&&this._clipPath!==t&&this.removeClipPath(),this._attachComponent(t),this._clipPath=t,this.markRedraw()},e.prototype.removeClipPath=function(){var t=this._clipPath;t&&(this._detachComponent(t),this._clipPath=null,this.markRedraw())},e.prototype.getTextContent=function(){return this._textContent},e.prototype.setTextContent=function(t){var n=this._textContent;n!==t&&(n&&n!==t&&this.removeTextContent(),t.innerTransformable=new Sy,this._attachComponent(t),this._textContent=t,this.markRedraw())},e.prototype.setTextConfig=function(t){this.textConfig||(this.textConfig={}),_e(this.textConfig,t),this.markRedraw()},e.prototype.removeTextConfig=function(){this.textConfig=null,this.markRedraw()},e.prototype.removeTextContent=function(){var t=this._textContent;t&&(t.innerTransformable=null,this._detachComponent(t),this._textContent=null,this._innerTextDefaultStyle=null,this.markRedraw())},e.prototype.getTextGuideLine=function(){return this._textGuide},e.prototype.setTextGuideLine=function(t){this._textGuide&&this._textGuide!==t&&this.removeTextGuideLine(),this._attachComponent(t),this._textGuide=t,this.markRedraw()},e.prototype.removeTextGuideLine=function(){var t=this._textGuide;t&&(this._detachComponent(t),this._textGuide=null,this.markRedraw())},e.prototype.markRedraw=function(){this.__dirty|=vn;var t=this.__zr;t&&(this.__inHover?t.refreshHover():t.refresh()),this.__hostTarget&&this.__hostTarget.markRedraw()},e.prototype.dirty=function(){this.markRedraw()},e.prototype._toggleHoverLayerFlag=function(t){this.__inHover=t;var n=this._textContent,i=this._textGuide;n&&(n.__inHover=t),i&&(i.__inHover=t)},e.prototype.addSelfToZr=function(t){if(this.__zr!==t){this.__zr=t;var n=this.animators;if(n)for(var i=0;i<n.length;i++)t.animation.addAnimator(n[i]);this._clipPath&&this._clipPath.addSelfToZr(t),this._textContent&&this._textContent.addSelfToZr(t),this._textGuide&&this._textGuide.addSelfToZr(t)}},e.prototype.removeSelfFromZr=function(t){if(this.__zr){this.__zr=null;var n=this.animators;if(n)for(var i=0;i<n.length;i++)t.animation.removeAnimator(n[i]);this._clipPath&&this._clipPath.removeSelfFromZr(t),this._textContent&&this._textContent.removeSelfFromZr(t),this._textGuide&&this._textGuide.removeSelfFromZr(t)}},e.prototype.animate=function(t,n,i){var r=t?this[t]:this,s=new nm(r,n,i);return t&&(s.targetName=t),this.addAnimator(s,t),s},e.prototype.addAnimator=function(t,n){var i=this.__zr,r=this;t.during(function(){r.updateDuringAnimation(n)}).done(function(){var s=r.animators,a=di(s,t);a>=0&&s.splice(a,1)}),this.animators.push(t),i&&i.animation.addAnimator(t),i&&i.wakeUp()},e.prototype.updateDuringAnimation=function(t){this.markRedraw()},e.prototype.stopAnimation=function(t,n){for(var i=this.animators,r=i.length,s=[],a=0;a<r;a++){var o=i[a];!t||t===o.scope?o.stop(n):s.push(o)}return this.animators=s,this},e.prototype.animateTo=function(t,n,i){Ah(this,t,n,i)},e.prototype.animateFrom=function(t,n,i){Ah(this,t,n,i,!0)},e.prototype._transitionState=function(t,n,i,r){for(var s=Ah(this,n,i,r),a=0;a<s.length;a++)s[a].__fromStateTransition=t},e.prototype.getBoundingRect=function(){return null},e.prototype.getPaintRect=function(){return null},e.initDefaultProps=function(){var t=e.prototype;t.type="element",t.name="",t.ignore=t.silent=t.ignoreHostSilent=t.isGroup=t.draggable=t.dragging=t.ignoreClip=t.__inHover=!1,t.__dirty=vn;function n(i,r,s,a){Object.defineProperty(t,i,{get:function(){if(!this[r]){var l=this[r]=[];o(this,l)}return this[r]},set:function(l){this[s]=l[0],this[a]=l[1],this[r]=l,o(this,l)}});function o(l,c){Object.defineProperty(c,0,{get:function(){return l[s]},set:function(f){l[s]=f}}),Object.defineProperty(c,1,{get:function(){return l[a]},set:function(f){l[a]=f}})}}Object.defineProperty&&(n("position","_legacyPos","x","y"),n("scale","_legacyScale","scaleX","scaleY"),n("origin","_legacyOrigin","originX","originY"))}(),e}();jx(Tu,Ua);jx(Tu,Sy);function Ah(e,t,n,i,r){n=n||{};var s=[];by(e,"",e,t,n,i,s,r);var a=s.length,o=!1,l=n.done,c=n.aborted,f=function(){o=!0,a--,a<=0&&(o?l&&l():c&&c())},u=function(){a--,a<=0&&(o?l&&l():c&&c())};a||l&&l(),s.length>0&&n.during&&s[0].during(function(v,_){n.during(_)});for(var h=0;h<s.length;h++){var d=s[h];f&&d.done(f),u&&d.aborted(u),n.force&&d.duration(n.duration),d.start(n.easing)}return s}function Ch(e,t,n){for(var i=0;i<n;i++)e[i]=t[i]}function uR(e){return Ti(e[0])}function hR(e,t,n){if(Ti(t[n]))if(Ti(e[n])||(e[n]=[]),GA(t[n])){var i=t[n].length;e[n].length!==i&&(e[n]=new t[n].constructor(i),Ch(e[n],t[n],i))}else{var r=t[n],s=e[n],a=r.length;if(uR(r))for(var o=r[0].length,l=0;l<a;l++)s[l]?Ch(s[l],r[l],o):s[l]=Array.prototype.slice.call(r[l]);else Ch(s,r,a);s.length=r.length}else e[n]=t[n]}function dR(e,t){return e===t||Ti(e)&&Ti(t)&&pR(e,t)}function pR(e,t){var n=e.length;if(n!==t.length)return!1;for(var i=0;i<n;i++)if(e[i]!==t[i])return!1;return!0}function by(e,t,n,i,r,s,a,o){for(var l=yn(i),c=r.duration,f=r.delay,u=r.additive,h=r.setToFinal,d=!yr(s),v=e.animators,_=[],m=0;m<l.length;m++){var p=l[m],x=i[p];if(x!=null&&n[p]!=null&&(d||s[p]))if(yr(x)&&!Ti(x)&&!Su(x)){if(t){o||(n[p]=x,e.updateDuringAnimation(t));continue}by(e,p,n[p],x,r,s&&s[p],a,o)}else _.push(p);else o||(n[p]=x,e.updateDuringAnimation(t),_.push(p))}var b=_.length;if(!u&&b)for(var S=0;S<v.length;S++){var T=v[S];if(T.targetName===t){var E=T.stopTracks(_);if(E){var C=di(v,T);v.splice(C,1)}}}if(r.force||(_=Qv(_,function(P){return!dR(i[P],n[P])}),b=_.length),b>0||r.force&&!a.length){var R=void 0,g=void 0,M=void 0;if(o){g={},h&&(R={});for(var S=0;S<b;S++){var p=_[S];g[p]=n[p],h?R[p]=i[p]:n[p]=i[p]}}else if(h){M={};for(var S=0;S<b;S++){var p=_[S];M[p]=Ec(n[p]),hR(n,i,p)}}var T=new nm(n,!1,!1,u?Qv(v,function(I){return I.targetName===t}):null);T.targetName=t,r.scope&&(T.scope=r.scope),h&&R&&T.whenWithKeys(0,R,_),M&&T.whenWithKeys(0,M,_),T.whenWithKeys(c==null?500:c,o?g:i,_).delay(f||0),e.addAnimator(T,t),a.push(T)}}var Ty=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i.isGroup=!0,i._children=[],i.attr(n),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.children=function(){return this._children.slice()},t.prototype.childAt=function(n){return this._children[n]},t.prototype.childOfName=function(n){for(var i=this._children,r=0;r<i.length;r++)if(i[r].name===n)return i[r]},t.prototype.childCount=function(){return this._children.length},t.prototype.add=function(n){return n&&n!==this&&n.parent!==this&&(this._children.push(n),this._doAdd(n)),this},t.prototype.addBefore=function(n,i){if(n&&n!==this&&n.parent!==this&&i&&i.parent===this){var r=this._children,s=r.indexOf(i);s>=0&&(r.splice(s,0,n),this._doAdd(n))}return this},t.prototype.replace=function(n,i){var r=di(this._children,n);return r>=0&&this.replaceAt(i,r),this},t.prototype.replaceAt=function(n,i){var r=this._children,s=r[i];if(n&&n!==this&&n.parent!==this&&n!==s){r[i]=n,s.parent=null;var a=this.__zr;a&&s.removeSelfFromZr(a),this._doAdd(n)}return this},t.prototype._doAdd=function(n){n.parent&&n.parent.remove(n),n.parent=this;var i=this.__zr;i&&i!==n.__zr&&n.addSelfToZr(i),i&&i.refresh()},t.prototype.remove=function(n){var i=this.__zr,r=this._children,s=di(r,n);return s<0?this:(r.splice(s,1),n.parent=null,i&&n.removeSelfFromZr(i),i&&i.refresh(),this)},t.prototype.removeAll=function(){for(var n=this._children,i=this.__zr,r=0;r<n.length;r++){var s=n[r];i&&s.removeSelfFromZr(i),s.parent=null}return n.length=0,this},t.prototype.eachChild=function(n,i){for(var r=this._children,s=0;s<r.length;s++){var a=r[s];n.call(i,a,s)}return this},t.prototype.traverse=function(n,i){for(var r=0;r<this._children.length;r++){var s=this._children[r],a=n.call(i,s);s.isGroup&&!a&&s.traverse(n,i)}return this},t.prototype.addSelfToZr=function(n){e.prototype.addSelfToZr.call(this,n);for(var i=0;i<this._children.length;i++){var r=this._children[i];r.addSelfToZr(n)}},t.prototype.removeSelfFromZr=function(n){e.prototype.removeSelfFromZr.call(this,n);for(var i=0;i<this._children.length;i++){var r=this._children[i];r.removeSelfFromZr(n)}},t.prototype.getBoundingRect=function(n){for(var i=new ce(0,0,0,0),r=n||this._children,s=[],a=null,o=0;o<r.length;o++){var l=r[o];if(!(l.ignore||l.invisible)){var c=l.getBoundingRect(),f=l.getLocalTransform(s);f?(ce.applyTransform(i,c,f),a=a||i.clone(),a.union(i)):(a=a||c.clone(),a.union(c))}}return a||i},t}(Tu);Ty.prototype.type="group";/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/var Rc={},Ey={};function mR(e){delete Ey[e]}function vR(e){if(!e)return!1;if(typeof e=="string")return nf(e,1)<ip;if(e.colorStops){for(var t=e.colorStops,n=0,i=t.length,r=0;r<i;r++)n+=nf(t[r].color,1);return n/=i,n<ip}return!1}var _R=function(){function e(t,n,i){var r=this;this._sleepAfterStill=10,this._stillFrameAccum=0,this._needsRefresh=!0,this._needsRefreshHover=!0,this._darkMode=!1,i=i||{},this.dom=n,this.id=t;var s=new IC,a=i.renderer||"canvas";Rc[a]||(a=yn(Rc)[0]),i.useDirtyRect=i.useDirtyRect==null?!1:i.useDirtyRect;var o=new Rc[a](n,s,i,t),l=i.ssr||o.ssrOnly;this.storage=s,this.painter=o;var c=!ge.node&&!ge.worker&&!l?new rR(o.getViewportRoot(),o.root):null,f=i.useCoarsePointer,u=f==null||f==="auto"?ge.touchEventsSupported:!!f,h=44,d;u&&(d=Ln(i.pointerSize,h)),this.handler=new oy(s,o,c,o.root,d),this.animation=new JC({stage:{update:l?null:function(){return r._flush(!0)}}}),l||this.animation.start()}return e.prototype.add=function(t){this._disposed||!t||(this.storage.addRoot(t),t.addSelfToZr(this),this.refresh())},e.prototype.remove=function(t){this._disposed||!t||(this.storage.delRoot(t),t.removeSelfFromZr(this),this.refresh())},e.prototype.configLayer=function(t,n){this._disposed||(this.painter.configLayer&&this.painter.configLayer(t,n),this.refresh())},e.prototype.setBackgroundColor=function(t){this._disposed||(this.painter.setBackgroundColor&&this.painter.setBackgroundColor(t),this.refresh(),this._backgroundColor=t,this._darkMode=vR(t))},e.prototype.getBackgroundColor=function(){return this._backgroundColor},e.prototype.setDarkMode=function(t){this._darkMode=t},e.prototype.isDarkMode=function(){return this._darkMode},e.prototype.refreshImmediately=function(t){this._disposed||(t||this.animation.update(!0),this._needsRefresh=!1,this.painter.refresh(),this._needsRefresh=!1)},e.prototype.refresh=function(){this._disposed||(this._needsRefresh=!0,this.animation.start())},e.prototype.flush=function(){this._disposed||this._flush(!1)},e.prototype._flush=function(t){var n,i=la();this._needsRefresh&&(n=!0,this.refreshImmediately(t)),this._needsRefreshHover&&(n=!0,this.refreshHoverImmediately());var r=la();n?(this._stillFrameAccum=0,this.trigger("rendered",{elapsedTime:r-i})):this._sleepAfterStill>0&&(this._stillFrameAccum++,this._stillFrameAccum>this._sleepAfterStill&&this.animation.stop())},e.prototype.setSleepAfterStill=function(t){this._sleepAfterStill=t},e.prototype.wakeUp=function(){this._disposed||(this.animation.start(),this._stillFrameAccum=0)},e.prototype.refreshHover=function(){this._needsRefreshHover=!0},e.prototype.refreshHoverImmediately=function(){this._disposed||(this._needsRefreshHover=!1,this.painter.refreshHover&&this.painter.getType()==="canvas"&&this.painter.refreshHover())},e.prototype.resize=function(t){this._disposed||(t=t||{},this.painter.resize(t.width,t.height),this.handler.resize())},e.prototype.clearAnimation=function(){this._disposed||this.animation.clear()},e.prototype.getWidth=function(){if(!this._disposed)return this.painter.getWidth()},e.prototype.getHeight=function(){if(!this._disposed)return this.painter.getHeight()},e.prototype.setCursorStyle=function(t){this._disposed||this.handler.setCursorStyle(t)},e.prototype.findHover=function(t,n){if(!this._disposed)return this.handler.findHover(t,n)},e.prototype.on=function(t,n,i){return this._disposed||this.handler.on(t,n,i),this},e.prototype.off=function(t,n){this._disposed||this.handler.off(t,n)},e.prototype.trigger=function(t,n){this._disposed||this.handler.trigger(t,n)},e.prototype.clear=function(){if(!this._disposed){for(var t=this.storage.getRoots(),n=0;n<t.length;n++)t[n]instanceof Ty&&t[n].removeSelfFromZr(this);this.storage.delAllRoots(),this.painter.clear()}},e.prototype.dispose=function(){this._disposed||(this.animation.stop(),this.clear(),this.storage.dispose(),this.painter.dispose(),this.handler.dispose(),this.animation=this.storage=this.painter=this.handler=null,this._disposed=!0,mR(this.id))},e}();function _F(e,t){var n=new _R(Jx(),e,t);return Ey[n.id]=n,n}function gF(e,t){Rc[e]=t}var ap=new jo(50);function gR(e){if(typeof e=="string"){var t=ap.get(e);return t&&t.image}else return e}function wy(e,t,n,i,r){if(e)if(typeof e=="string"){if(t&&t.__zrImageSrc===e||!n)return t;var s=ap.get(e),a={hostEl:n,cb:i,cbPayload:r};return s?(t=s.image,!Eu(t)&&s.pending.push(a)):(t=As.loadImage(e,R_,R_),t.__zrImageSrc=e,ap.put(e,t.__cachedImgObj={image:t,pending:[a]})),t}else return e;else return t}function R_(){var e=this.__cachedImgObj;this.onload=this.onerror=this.__cachedImgObj=null;for(var t=0;t<e.pending.length;t++){var n=e.pending[t],i=n.cb;i&&i(this,n.cbPayload),n.hostEl.dirty()}e.pending.length=0}function Eu(e){return e&&e.width&&e.height}var Rh=/\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;function xR(e,t,n,i,r,s){if(!n){e.text="",e.isTruncated=!1;return}var a=(t+"").split(`
`);s=Ay(n,i,r,s);for(var o=!1,l={},c=0,f=a.length;c<f;c++)Cy(l,a[c],s),a[c]=l.textLine,o=o||l.isTruncated;e.text=a.join(`
`),e.isTruncated=o}function Ay(e,t,n,i){i=i||{};var r=_e({},i);n=Ln(n,"..."),r.maxIterations=Ln(i.maxIterations,2);var s=r.minChar=Ln(i.minChar,0),a=r.fontMeasureInfo=yi(t),o=a.asciiCharWidth;r.placeholder=Ln(i.placeholder,"");for(var l=e=Math.max(0,e-1),c=0;c<s&&l>=o;c++)l-=o;var f=Si(a,n);return f>l&&(n="",f=0),l=e-f,r.ellipsis=n,r.ellipsisWidth=f,r.contentWidth=l,r.containerWidth=e,r}function Cy(e,t,n){var i=n.containerWidth,r=n.contentWidth,s=n.fontMeasureInfo;if(!i){e.textLine="",e.isTruncated=!1;return}var a=Si(s,t);if(a<=i){e.textLine=t,e.isTruncated=!1;return}for(var o=0;;o++){if(a<=r||o>=n.maxIterations){t+=n.ellipsis;break}var l=o===0?yR(t,r,s):a>0?Math.floor(t.length*r/a):0;t=t.substr(0,l),a=Si(s,t)}t===""&&(t=n.placeholder),e.textLine=t,e.isTruncated=!0}function yR(e,t,n){for(var i=0,r=0,s=e.length;r<s&&i<t;r++)i+=My(n,e.charCodeAt(r));return r}function SR(e,t,n,i){var r=im(e),s=t.overflow,a=t.padding,o=a?a[1]+a[3]:0,l=a?a[0]+a[2]:0,c=t.font,f=s==="truncate",u=bu(c),h=Ln(t.lineHeight,u),d=t.lineOverflow==="truncate",v=!1,_=t.width;_==null&&n!=null&&(_=n-o);var m=t.height;m==null&&i!=null&&(m=i-l);var p;_!=null&&(s==="break"||s==="breakAll")?p=r?Ry(r,t.font,_,s==="breakAll",0).lines:[]:p=r?r.split(`
`):[];var x=p.length*h;if(m==null&&(m=x),x>m&&d){var b=Math.floor(m/h);v=v||p.length>b,p=p.slice(0,b),x=p.length*h}if(r&&f&&_!=null)for(var S=Ay(_,c,t.ellipsis,{minChar:t.truncateMinChar,placeholder:t.placeholder}),T={},E=0;E<p.length;E++)Cy(T,p[E],S),p[E]=T.textLine,v=v||T.isTruncated;for(var C=m,R=0,g=yi(c),E=0;E<p.length;E++)R=Math.max(Si(g,p[E]),R);_==null&&(_=R);var M=_;return C+=l,M+=o,{lines:p,height:m,outerWidth:M,outerHeight:C,lineHeight:h,calculatedLineHeight:u,contentWidth:R,contentHeight:x,width:_,isTruncated:v}}var MR=function(){function e(){}return e}(),P_=function(){function e(t){this.tokens=[],t&&(this.tokens=t)}return e}(),bR=function(){function e(){this.width=0,this.height=0,this.contentWidth=0,this.contentHeight=0,this.outerWidth=0,this.outerHeight=0,this.lines=[],this.isTruncated=!1}return e}();function TR(e,t,n,i,r){var s=new bR,a=im(e);if(!a)return s;var o=t.padding,l=o?o[1]+o[3]:0,c=o?o[0]+o[2]:0,f=t.width;f==null&&n!=null&&(f=n-l);var u=t.height;u==null&&i!=null&&(u=i-c);for(var h=t.overflow,d=(h==="break"||h==="breakAll")&&f!=null?{width:f,accumWidth:0,breakAll:h==="breakAll"}:null,v=Rh.lastIndex=0,_;(_=Rh.exec(a))!=null;){var m=_.index;m>v&&Ph(s,a.substring(v,m),t,d),Ph(s,_[2],t,d,_[1]),v=Rh.lastIndex}v<a.length&&Ph(s,a.substring(v,a.length),t,d);var p=[],x=0,b=0,S=h==="truncate",T=t.lineOverflow==="truncate",E={};function C(Q,it,Mt){Q.width=it,Q.lineHeight=Mt,x+=Mt,b=Math.max(b,it)}t:for(var R=0;R<s.lines.length;R++){for(var g=s.lines[R],M=0,P=0,I=0;I<g.tokens.length;I++){var N=g.tokens[I],O=N.styleName&&t.rich[N.styleName]||{},q=N.textPadding=O.padding,V=q?q[1]+q[3]:0,H=N.font=O.font||t.font;N.contentHeight=bu(H);var K=Ln(O.height,N.contentHeight);if(N.innerHeight=K,q&&(K+=q[0]+q[2]),N.height=K,N.lineHeight=Tc(O.lineHeight,t.lineHeight,K),N.align=O&&O.align||r,N.verticalAlign=O&&O.verticalAlign||"middle",T&&u!=null&&x+N.lineHeight>u){var dt=s.lines.length;I>0?(g.tokens=g.tokens.slice(0,I),C(g,P,M),s.lines=s.lines.slice(0,R+1)):s.lines=s.lines.slice(0,R),s.isTruncated=s.isTruncated||s.lines.length<dt;break t}var ct=O.width,ht=ct==null||ct==="auto";if(typeof ct=="string"&&ct.charAt(ct.length-1)==="%")N.percentWidth=ct,p.push(N),N.contentWidth=Si(yi(H),N.text);else{if(ht){var Rt=O.backgroundColor,It=Rt&&Rt.image;It&&(It=gR(It),Eu(It)&&(N.width=Math.max(N.width,It.width*K/It.height)))}var qt=S&&f!=null?f-P:null;qt!=null&&qt<N.width?!ht||qt<V?(N.text="",N.width=N.contentWidth=0):(xR(E,N.text,qt-V,H,t.ellipsis,{minChar:t.truncateMinChar}),N.text=E.text,s.isTruncated=s.isTruncated||E.isTruncated,N.width=N.contentWidth=Si(yi(H),N.text)):N.contentWidth=Si(yi(H),N.text)}N.width+=V,P+=N.width,O&&(M=Math.max(M,N.lineHeight))}C(g,P,M)}s.outerWidth=s.width=Ln(f,b),s.outerHeight=s.height=Ln(u,x),s.contentHeight=x,s.contentWidth=b,s.outerWidth+=l,s.outerHeight+=c;for(var R=0;R<p.length;R++){var N=p[R],Kt=N.percentWidth;N.width=parseInt(Kt,10)/100*s.width}return s}function Ph(e,t,n,i,r){var s=t==="",a=r&&n.rich[r]||{},o=e.lines,l=a.font||n.font,c=!1,f,u;if(i){var h=a.padding,d=h?h[1]+h[3]:0;if(a.width!=null&&a.width!=="auto"){var v=el(a.width,i.width)+d;o.length>0&&v+i.accumWidth>i.width&&(f=t.split(`
`),c=!0),i.accumWidth=v}else{var _=Ry(t,l,i.width,i.breakAll,i.accumWidth);i.accumWidth=_.accumWidth+d,u=_.linesWidths,f=_.lines}}f||(f=t.split(`
`));for(var m=yi(l),p=0;p<f.length;p++){var x=f[p],b=new MR;if(b.styleName=r,b.text=x,b.isLineHolder=!x&&!s,typeof a.width=="number"?b.width=a.width:b.width=u?u[p]:Si(m,x),!p&&!c){var S=(o[o.length-1]||(o[0]=new P_)).tokens,T=S.length;T===1&&S[0].isLineHolder?S[0]=b:(x||!T||s)&&S.push(b)}else o.push(new P_([b]))}}function ER(e){var t=e.charCodeAt(0);return t>=32&&t<=591||t>=880&&t<=4351||t>=4608&&t<=5119||t>=7680&&t<=8303}var wR=yu(",&?/;] ".split(""),function(e,t){return e[t]=!0,e},{});function AR(e){return ER(e)?!!wR[e]:!0}function Ry(e,t,n,i,r){for(var s=[],a=[],o="",l="",c=0,f=0,u=yi(t),h=0;h<e.length;h++){var d=e.charAt(h);if(d===`
`){l&&(o+=l,f+=c),s.push(o),a.push(f),o="",l="",c=0,f=0;continue}var v=My(u,d.charCodeAt(0)),_=i?!1:!AR(d);if(s.length?f+v>n:r+f+v>n){f?(o||l)&&(_?(o||(o=l,l="",c=0,f=c),s.push(o),a.push(f-c),l+=d,c+=v,o="",f=c):(l&&(o+=l,l="",c=0),s.push(o),a.push(f),o=d,f=v)):_?(s.push(l),a.push(c),l=d,c=v):(s.push(d),a.push(v));continue}f+=v,_?(l+=d,c+=v):(l&&(o+=l,l="",c=0),o+=d)}return l&&(o+=l),o&&(s.push(o),a.push(f)),s.length===1&&(f+=r),{accumWidth:f,lines:s,linesWidths:a}}function L_(e,t,n,i,r,s){if(e.baseX=n,e.baseY=i,e.outerWidth=e.outerHeight=null,!!t){var a=t.width*2,o=t.height*2;ce.set(D_,Aa(n,a,r),Ms(i,o,s),a,o),ce.intersect(t,D_,null,I_);var l=I_.outIntersectRect;e.outerWidth=l.width,e.outerHeight=l.height,e.baseX=Aa(l.x,l.width,r,!0),e.baseY=Ms(l.y,l.height,s,!0)}}var D_=new ce(0,0,0,0),I_={outIntersectRect:{},clamp:!0};function im(e){return e!=null?e+="":e=""}function CR(e){var t=im(e.text),n=e.font,i=Si(yi(n),t),r=bu(n);return op(e,i,r,null)}function op(e,t,n,i){var r=new ce(Aa(e.x||0,t,e.textAlign),Ms(e.y||0,n,e.textBaseline),t,n),s=i!=null?i:Py(e)?e.lineWidth:0;return s>0&&(r.x-=s/2,r.y-=s/2,r.width+=s,r.height+=s),r}function Py(e){var t=e.stroke;return t!=null&&t!=="none"&&e.lineWidth>0}var lp="__zr_style_"+Math.round(Math.random()*10),bs={shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,shadowColor:"#000",opacity:1,blend:"source-over"},wu={style:{shadowBlur:!0,shadowOffsetX:!0,shadowOffsetY:!0,shadowColor:!0,opacity:!0}};bs[lp]=!0;var N_=["z","z2","invisible"],RR=["invisible"],hl=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype._init=function(n){for(var i=yn(n),r=0;r<i.length;r++){var s=i[r];s==="style"?this.useStyle(n[s]):e.prototype.attrKV.call(this,s,n[s])}this.style||this.useStyle({})},t.prototype.beforeBrush=function(){},t.prototype.afterBrush=function(){},t.prototype.innerBeforeBrush=function(){},t.prototype.innerAfterBrush=function(){},t.prototype.shouldBePainted=function(n,i,r,s){var a=this.transform;if(this.ignore||this.invisible||this.style.opacity===0||this.culling&&PR(this,n,i)||a&&!a[0]&&!a[3])return!1;if(r&&this.__clipPaths&&this.__clipPaths.length){for(var o=0;o<this.__clipPaths.length;++o)if(this.__clipPaths[o].isZeroArea())return!1}if(s&&this.parent)for(var l=this.parent;l;){if(l.ignore)return!1;l=l.parent}return!0},t.prototype.contain=function(n,i){return this.rectContain(n,i)},t.prototype.traverse=function(n,i){n.call(i,this)},t.prototype.rectContain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect();return s.contain(r[0],r[1])},t.prototype.getPaintRect=function(){var n=this._paintRect;if(!this._paintRect||this.__dirty){var i=this.transform,r=this.getBoundingRect(),s=this.style,a=s.shadowBlur||0,o=s.shadowOffsetX||0,l=s.shadowOffsetY||0;n=this._paintRect||(this._paintRect=new ce(0,0,0,0)),i?ce.applyTransform(n,r,i):n.copy(r),(a||o||l)&&(n.width+=a*2+Math.abs(o),n.height+=a*2+Math.abs(l),n.x=Math.min(n.x,n.x+o-a),n.y=Math.min(n.y,n.y+l-a));var c=this.dirtyRectTolerance;n.isZero()||(n.x=Math.floor(n.x-c),n.y=Math.floor(n.y-c),n.width=Math.ceil(n.width+1+c*2),n.height=Math.ceil(n.height+1+c*2))}return n},t.prototype.setPrevPaintRect=function(n){n?(this._prevPaintRect=this._prevPaintRect||new ce(0,0,0,0),this._prevPaintRect.copy(n)):this._prevPaintRect=null},t.prototype.getPrevPaintRect=function(){return this._prevPaintRect},t.prototype.animateStyle=function(n){return this.animate("style",n)},t.prototype.updateDuringAnimation=function(n){n==="style"?this.dirtyStyle():this.markRedraw()},t.prototype.attrKV=function(n,i){n!=="style"?e.prototype.attrKV.call(this,n,i):this.style?this.setStyle(i):this.useStyle(i)},t.prototype.setStyle=function(n,i){return typeof n=="string"?this.style[n]=i:_e(this.style,n),this.dirtyStyle(),this},t.prototype.dirtyStyle=function(n){n||this.markRedraw(),this.__dirty|=ho,this._rect&&(this._rect=null)},t.prototype.dirty=function(){this.dirtyStyle()},t.prototype.styleChanged=function(){return!!(this.__dirty&ho)},t.prototype.styleUpdated=function(){this.__dirty&=~ho},t.prototype.createStyle=function(n){return Mu(bs,n)},t.prototype.useStyle=function(n){n[lp]||(n=this.createStyle(n)),this.__inHover?this.__hoverStyle=n:this.style=n,this.dirtyStyle()},t.prototype.isStyleObject=function(n){return n[lp]},t.prototype._innerSaveToNormal=function(n){e.prototype._innerSaveToNormal.call(this,n);var i=this._normalState;n.style&&!i.style&&(i.style=this._mergeStyle(this.createStyle(),this.style)),this._savePrimaryToNormal(n,i,N_)},t.prototype._applyStateObj=function(n,i,r,s,a,o){e.prototype._applyStateObj.call(this,n,i,r,s,a,o);var l=!(i&&s),c;if(i&&i.style?a?s?c=i.style:(c=this._mergeStyle(this.createStyle(),r.style),this._mergeStyle(c,i.style)):(c=this._mergeStyle(this.createStyle(),s?this.style:r.style),this._mergeStyle(c,i.style)):l&&(c=r.style),c)if(a){var f=this.style;if(this.style=this.createStyle(l?{}:f),l)for(var u=yn(f),h=0;h<u.length;h++){var d=u[h];d in c&&(c[d]=c[d],this.style[d]=f[d])}for(var v=yn(c),h=0;h<v.length;h++){var d=v[h];this.style[d]=this.style[d]}this._transitionState(n,{style:c},o,this.getAnimationStyleProps())}else this.useStyle(c);for(var _=this.__inHover?RR:N_,h=0;h<_.length;h++){var d=_[h];i&&i[d]!=null?this[d]=i[d]:l&&r[d]!=null&&(this[d]=r[d])}},t.prototype._mergeStates=function(n){for(var i=e.prototype._mergeStates.call(this,n),r,s=0;s<n.length;s++){var a=n[s];a.style&&(r=r||{},this._mergeStyle(r,a.style))}return r&&(i.style=r),i},t.prototype._mergeStyle=function(n,i){return _e(n,i),n},t.prototype.getAnimationStyleProps=function(){return wu},t.initDefaultProps=function(){var n=t.prototype;n.type="displayable",n.invisible=!1,n.z=0,n.z2=0,n.zlevel=0,n.culling=!1,n.cursor="pointer",n.rectHover=!1,n.incremental=!1,n._rect=null,n.dirtyRectTolerance=0,n.__dirty=vn|ho}(),t}(Tu),Lh=new ce(0,0,0,0),Dh=new ce(0,0,0,0);function PR(e,t,n){return Lh.copy(e.getBoundingRect()),e.transform&&Lh.applyTransform(e.transform),Dh.width=t,Dh.height=n,!Lh.intersect(Dh)}var An=Math.min,Cn=Math.max,Ih=Math.sin,Nh=Math.cos,qr=Math.PI*2,Ul=Fa(),Ol=Fa(),Bl=Fa();function F_(e,t,n,i,r,s){r[0]=An(e,n),r[1]=An(t,i),s[0]=Cn(e,n),s[1]=Cn(t,i)}var U_=[],O_=[];function LR(e,t,n,i,r,s,a,o,l,c){var f=dy,u=Ze,h=f(e,n,r,a,U_);l[0]=1/0,l[1]=1/0,c[0]=-1/0,c[1]=-1/0;for(var d=0;d<h;d++){var v=u(e,n,r,a,U_[d]);l[0]=An(v,l[0]),c[0]=Cn(v,c[0])}h=f(t,i,s,o,O_);for(var d=0;d<h;d++){var _=u(t,i,s,o,O_[d]);l[1]=An(_,l[1]),c[1]=Cn(_,c[1])}l[0]=An(e,l[0]),c[0]=Cn(e,c[0]),l[0]=An(a,l[0]),c[0]=Cn(a,c[0]),l[1]=An(t,l[1]),c[1]=Cn(t,c[1]),l[1]=An(o,l[1]),c[1]=Cn(o,c[1])}function DR(e,t,n,i,r,s,a,o){var l=py,c=sn,f=Cn(An(l(e,n,r),1),0),u=Cn(An(l(t,i,s),1),0),h=c(e,n,r,f),d=c(t,i,s,u);a[0]=An(e,r,h),a[1]=An(t,s,d),o[0]=Cn(e,r,h),o[1]=Cn(t,s,d)}function IR(e,t,n,i,r,s,a,o,l){var c=sa,f=aa,u=Math.abs(r-s);if(u%qr<1e-4&&u>1e-4){o[0]=e-n,o[1]=t-i,l[0]=e+n,l[1]=t+i;return}if(Ul[0]=Nh(r)*n+e,Ul[1]=Ih(r)*i+t,Ol[0]=Nh(s)*n+e,Ol[1]=Ih(s)*i+t,c(o,Ul,Ol),f(l,Ul,Ol),r=r%qr,r<0&&(r=r+qr),s=s%qr,s<0&&(s=s+qr),r>s&&!a?s+=qr:r<s&&a&&(r+=qr),a){var h=s;s=r,r=h}for(var d=0;d<s;d+=Math.PI/2)d>r&&(Bl[0]=Nh(d)*n+e,Bl[1]=Ih(d)*i+t,c(o,Bl,o),f(l,Bl,l))}var ee={M:1,L:2,C:3,Q:4,A:5,Z:6,R:7},Yr=[],$r=[],si=[],rr=[],ai=[],oi=[],Fh=Math.min,Uh=Math.max,Kr=Math.cos,Zr=Math.sin,Ui=Math.abs,cp=Math.PI,dr=cp*2,Oh=typeof Float32Array!="undefined",Ka=[];function Bh(e){var t=Math.round(e/cp*1e8)/1e8;return t%2*cp}function NR(e,t){var n=Bh(e[0]);n<0&&(n+=dr);var i=n-e[0],r=e[1];r+=i,!t&&r-n>=dr?r=n+dr:t&&n-r>=dr?r=n-dr:!t&&n>r?r=n+(dr-Bh(n-r)):t&&n<r&&(r=n-(dr-Bh(r-n))),e[0]=n,e[1]=r}var Ca=function(){function e(t){this.dpr=1,this._xi=0,this._yi=0,this._x0=0,this._y0=0,this._len=0,t&&(this._saveData=!1),this._saveData&&(this.data=[])}return e.prototype.increaseVersion=function(){this._version++},e.prototype.getVersion=function(){return this._version},e.prototype.setScale=function(t,n,i){i=i||0,i>0&&(this._ux=Ui(i/rf/t)||0,this._uy=Ui(i/rf/n)||0)},e.prototype.setDPR=function(t){this.dpr=t},e.prototype.setContext=function(t){this._ctx=t},e.prototype.getContext=function(){return this._ctx},e.prototype.beginPath=function(){return this._ctx&&this._ctx.beginPath(),this.reset(),this},e.prototype.reset=function(){this._saveData&&(this._len=0),this._pathSegLen&&(this._pathSegLen=null,this._pathLen=0),this._version++},e.prototype.moveTo=function(t,n){return this._drawPendingPt(),this.addData(ee.M,t,n),this._ctx&&this._ctx.moveTo(t,n),this._x0=t,this._y0=n,this._xi=t,this._yi=n,this},e.prototype.lineTo=function(t,n){var i=Ui(t-this._xi),r=Ui(n-this._yi),s=i>this._ux||r>this._uy;if(this.addData(ee.L,t,n),this._ctx&&s&&this._ctx.lineTo(t,n),s)this._xi=t,this._yi=n,this._pendingPtDist=0;else{var a=i*i+r*r;a>this._pendingPtDist&&(this._pendingPtX=t,this._pendingPtY=n,this._pendingPtDist=a)}return this},e.prototype.bezierCurveTo=function(t,n,i,r,s,a){return this._drawPendingPt(),this.addData(ee.C,t,n,i,r,s,a),this._ctx&&this._ctx.bezierCurveTo(t,n,i,r,s,a),this._xi=s,this._yi=a,this},e.prototype.quadraticCurveTo=function(t,n,i,r){return this._drawPendingPt(),this.addData(ee.Q,t,n,i,r),this._ctx&&this._ctx.quadraticCurveTo(t,n,i,r),this._xi=i,this._yi=r,this},e.prototype.arc=function(t,n,i,r,s,a){this._drawPendingPt(),Ka[0]=r,Ka[1]=s,NR(Ka,a),r=Ka[0],s=Ka[1];var o=s-r;return this.addData(ee.A,t,n,i,i,r,o,0,a?0:1),this._ctx&&this._ctx.arc(t,n,i,r,s,a),this._xi=Kr(s)*i+t,this._yi=Zr(s)*i+n,this},e.prototype.arcTo=function(t,n,i,r,s){return this._drawPendingPt(),this._ctx&&this._ctx.arcTo(t,n,i,r,s),this},e.prototype.rect=function(t,n,i,r){return this._drawPendingPt(),this._ctx&&this._ctx.rect(t,n,i,r),this.addData(ee.R,t,n,i,r),this},e.prototype.closePath=function(){this._drawPendingPt(),this.addData(ee.Z);var t=this._ctx,n=this._x0,i=this._y0;return t&&t.closePath(),this._xi=n,this._yi=i,this},e.prototype.fill=function(t){t&&t.fill(),this.toStatic()},e.prototype.stroke=function(t){t&&t.stroke(),this.toStatic()},e.prototype.len=function(){return this._len},e.prototype.setData=function(t){if(this._saveData){var n=t.length;!(this.data&&this.data.length===n)&&Oh&&(this.data=new Float32Array(n));for(var i=0;i<n;i++)this.data[i]=t[i];this._len=n}},e.prototype.appendPath=function(t){if(this._saveData){t instanceof Array||(t=[t]);for(var n=t.length,i=0,r=this._len,s=0;s<n;s++)i+=t[s].len();var a=this.data;if(Oh&&(a instanceof Float32Array||!a)&&(this.data=new Float32Array(r+i),r>0&&a))for(var o=0;o<r;o++)this.data[o]=a[o];for(var s=0;s<n;s++)for(var l=t[s].data,o=0;o<l.length;o++)this.data[r++]=l[o];this._len=r}},e.prototype.addData=function(t,n,i,r,s,a,o,l,c){if(this._saveData){var f=this.data;this._len+arguments.length>f.length&&(this._expandData(),f=this.data);for(var u=0;u<arguments.length;u++)f[this._len++]=arguments[u]}},e.prototype._drawPendingPt=function(){this._pendingPtDist>0&&(this._ctx&&this._ctx.lineTo(this._pendingPtX,this._pendingPtY),this._pendingPtDist=0)},e.prototype._expandData=function(){if(!(this.data instanceof Array)){for(var t=[],n=0;n<this._len;n++)t[n]=this.data[n];this.data=t}},e.prototype.toStatic=function(){if(this._saveData){this._drawPendingPt();var t=this.data;t instanceof Array&&(t.length=this._len,Oh&&this._len>11&&(this.data=new Float32Array(t)))}},e.prototype.getBoundingRect=function(){si[0]=si[1]=ai[0]=ai[1]=Number.MAX_VALUE,rr[0]=rr[1]=oi[0]=oi[1]=-Number.MAX_VALUE;var t=this.data,n=0,i=0,r=0,s=0,a;for(a=0;a<this._len;){var o=t[a++],l=a===1;switch(l&&(n=t[a],i=t[a+1],r=n,s=i),o){case ee.M:n=r=t[a++],i=s=t[a++],ai[0]=r,ai[1]=s,oi[0]=r,oi[1]=s;break;case ee.L:F_(n,i,t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.C:LR(n,i,t[a++],t[a++],t[a++],t[a++],t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.Q:DR(n,i,t[a++],t[a++],t[a],t[a+1],ai,oi),n=t[a++],i=t[a++];break;case ee.A:var c=t[a++],f=t[a++],u=t[a++],h=t[a++],d=t[a++],v=t[a++]+d;a+=1;var _=!t[a++];l&&(r=Kr(d)*u+c,s=Zr(d)*h+f),IR(c,f,u,h,d,v,_,ai,oi),n=Kr(v)*u+c,i=Zr(v)*h+f;break;case ee.R:r=n=t[a++],s=i=t[a++];var m=t[a++],p=t[a++];F_(r,s,r+m,s+p,ai,oi);break;case ee.Z:n=r,i=s;break}sa(si,si,ai),aa(rr,rr,oi)}return a===0&&(si[0]=si[1]=rr[0]=rr[1]=0),new ce(si[0],si[1],rr[0]-si[0],rr[1]-si[1])},e.prototype._calculateLength=function(){var t=this.data,n=this._len,i=this._ux,r=this._uy,s=0,a=0,o=0,l=0;this._pathSegLen||(this._pathSegLen=[]);for(var c=this._pathSegLen,f=0,u=0,h=0;h<n;){var d=t[h++],v=h===1;v&&(s=t[h],a=t[h+1],o=s,l=a);var _=-1;switch(d){case ee.M:s=o=t[h++],a=l=t[h++];break;case ee.L:{var m=t[h++],p=t[h++],x=m-s,b=p-a;(Ui(x)>i||Ui(b)>r||h===n-1)&&(_=Math.sqrt(x*x+b*b),s=m,a=p);break}case ee.C:{var S=t[h++],T=t[h++],m=t[h++],p=t[h++],E=t[h++],C=t[h++];_=FC(s,a,S,T,m,p,E,C,10),s=E,a=C;break}case ee.Q:{var S=t[h++],T=t[h++],m=t[h++],p=t[h++];_=BC(s,a,S,T,m,p,10),s=m,a=p;break}case ee.A:var R=t[h++],g=t[h++],M=t[h++],P=t[h++],I=t[h++],N=t[h++],O=N+I;h+=1,v&&(o=Kr(I)*M+R,l=Zr(I)*P+g),_=Uh(M,P)*Fh(dr,Math.abs(N)),s=Kr(O)*M+R,a=Zr(O)*P+g;break;case ee.R:{o=s=t[h++],l=a=t[h++];var q=t[h++],V=t[h++];_=q*2+V*2;break}case ee.Z:{var x=o-s,b=l-a;_=Math.sqrt(x*x+b*b),s=o,a=l;break}}_>=0&&(c[u++]=_,f+=_)}return this._pathLen=f,f},e.prototype.rebuildPath=function(t,n){var i=this.data,r=this._ux,s=this._uy,a=this._len,o,l,c,f,u,h,d=n<1,v,_,m=0,p=0,x,b=0,S,T;if(!(d&&(this._pathSegLen||this._calculateLength(),v=this._pathSegLen,_=this._pathLen,x=n*_,!x)))t:for(var E=0;E<a;){var C=i[E++],R=E===1;switch(R&&(c=i[E],f=i[E+1],o=c,l=f),C!==ee.L&&b>0&&(t.lineTo(S,T),b=0),C){case ee.M:o=c=i[E++],l=f=i[E++],t.moveTo(c,f);break;case ee.L:{u=i[E++],h=i[E++];var g=Ui(u-c),M=Ui(h-f);if(g>r||M>s){if(d){var P=v[p++];if(m+P>x){var I=(x-m)/P;t.lineTo(c*(1-I)+u*I,f*(1-I)+h*I);break t}m+=P}t.lineTo(u,h),c=u,f=h,b=0}else{var N=g*g+M*M;N>b&&(S=u,T=h,b=N)}break}case ee.C:{var O=i[E++],q=i[E++],V=i[E++],H=i[E++],K=i[E++],dt=i[E++];if(d){var P=v[p++];if(m+P>x){var I=(x-m)/P;tf(c,O,V,K,I,Yr),tf(f,q,H,dt,I,$r),t.bezierCurveTo(Yr[1],$r[1],Yr[2],$r[2],Yr[3],$r[3]);break t}m+=P}t.bezierCurveTo(O,q,V,H,K,dt),c=K,f=dt;break}case ee.Q:{var O=i[E++],q=i[E++],V=i[E++],H=i[E++];if(d){var P=v[p++];if(m+P>x){var I=(x-m)/P;ef(c,O,V,I,Yr),ef(f,q,H,I,$r),t.quadraticCurveTo(Yr[1],$r[1],Yr[2],$r[2]);break t}m+=P}t.quadraticCurveTo(O,q,V,H),c=V,f=H;break}case ee.A:var ct=i[E++],ht=i[E++],Rt=i[E++],It=i[E++],qt=i[E++],Kt=i[E++],Q=i[E++],it=!i[E++],Mt=Rt>It?Rt:It,Ut=Ui(Rt-It)>.001,mt=qt+Kt,bt=!1;if(d){var P=v[p++];m+P>x&&(mt=qt+Kt*(x-m)/P,bt=!0),m+=P}if(Ut&&t.ellipse?t.ellipse(ct,ht,Rt,It,Q,qt,mt,it):t.arc(ct,ht,Mt,qt,mt,it),bt)break t;R&&(o=Kr(qt)*Rt+ct,l=Zr(qt)*It+ht),c=Kr(mt)*Rt+ct,f=Zr(mt)*It+ht;break;case ee.R:o=c=i[E],l=f=i[E+1],u=i[E++],h=i[E++];var D=i[E++],U=i[E++];if(d){var P=v[p++];if(m+P>x){var G=x-m;t.moveTo(u,h),t.lineTo(u+Fh(G,D),h),G-=D,G>0&&t.lineTo(u+D,h+Fh(G,U)),G-=U,G>0&&t.lineTo(u+Uh(D-G,0),h+U),G-=D,G>0&&t.lineTo(u,h+Uh(U-G,0));break t}m+=P}t.rect(u,h,D,U);break;case ee.Z:if(d){var P=v[p++];if(m+P>x){var I=(x-m)/P;t.lineTo(c*(1-I)+o*I,f*(1-I)+l*I);break t}m+=P}t.closePath(),c=o,f=l}}},e.prototype.clone=function(){var t=new e,n=this.data;return t.data=n.slice?n.slice():Array.prototype.slice.call(n),t._len=this._len,t},e.prototype.canSave=function(){return!!this._saveData},e.CMD=ee,e.initDefaultProps=function(){var t=e.prototype;t._saveData=!0,t._ux=0,t._uy=0,t._pendingPtDist=0,t._version=0}(),e}();function Vs(e,t,n,i,r,s,a){if(r===0)return!1;var o=r,l=0,c=e;if(a>t+o&&a>i+o||a<t-o&&a<i-o||s>e+o&&s>n+o||s<e-o&&s<n-o)return!1;if(e!==n)l=(t-i)/(e-n),c=(e*i-n*t)/(e-n);else return Math.abs(s-e)<=o/2;var f=l*s-a+c,u=f*f/(l*l+1);return u<=o/2*o/2}function FR(e,t,n,i,r,s,a,o,l,c,f){if(l===0)return!1;var u=l;if(f>t+u&&f>i+u&&f>s+u&&f>o+u||f<t-u&&f<i-u&&f<s-u&&f<o-u||c>e+u&&c>n+u&&c>r+u&&c>a+u||c<e-u&&c<n-u&&c<r-u&&c<a-u)return!1;var h=NC(e,t,n,i,r,s,a,o,c,f);return h<=u/2}function UR(e,t,n,i,r,s,a,o,l){if(a===0)return!1;var c=a;if(l>t+c&&l>i+c&&l>s+c||l<t-c&&l<i-c&&l<s-c||o>e+c&&o>n+c&&o>r+c||o<e-c&&o<n-c&&o<r-c)return!1;var f=OC(e,t,n,i,r,s,o,l);return f<=c/2}var B_=Math.PI*2;function Hl(e){return e%=B_,e<0&&(e+=B_),e}var Za=Math.PI*2;function OR(e,t,n,i,r,s,a,o,l){if(a===0)return!1;var c=a;o-=e,l-=t;var f=Math.sqrt(o*o+l*l);if(f-c>n||f+c<n)return!1;if(Math.abs(i-r)%Za<1e-4)return!0;if(s){var u=i;i=Hl(r),r=Hl(u)}else i=Hl(i),r=Hl(r);i>r&&(r+=Za);var h=Math.atan2(l,o);return h<0&&(h+=Za),h>=i&&h<=r||h+Za>=i&&h+Za<=r}function Jr(e,t,n,i,r,s){if(s>t&&s>i||s<t&&s<i||i===t)return 0;var a=(s-t)/(i-t),o=i<t?1:-1;(a===1||a===0)&&(o=i<t?.5:-.5);var l=a*(n-e)+e;return l===r?1/0:l>r?o:0}var sr=Ca.CMD,jr=Math.PI*2,BR=1e-4;function HR(e,t){return Math.abs(e-t)<BR}var $e=[-1,-1,-1],En=[-1,-1];function zR(){var e=En[0];En[0]=En[1],En[1]=e}function VR(e,t,n,i,r,s,a,o,l,c){if(c>t&&c>i&&c>s&&c>o||c<t&&c<i&&c<s&&c<o)return 0;var f=hy(t,i,s,o,c,$e);if(f===0)return 0;for(var u=0,h=-1,d=void 0,v=void 0,_=0;_<f;_++){var m=$e[_],p=m===0||m===1?.5:1,x=Ze(e,n,r,a,m);x<l||(h<0&&(h=dy(t,i,s,o,En),En[1]<En[0]&&h>1&&zR(),d=Ze(t,i,s,o,En[0]),h>1&&(v=Ze(t,i,s,o,En[1]))),h===2?m<En[0]?u+=d<t?p:-p:m<En[1]?u+=v<d?p:-p:u+=o<v?p:-p:m<En[0]?u+=d<t?p:-p:u+=o<d?p:-p)}return u}function GR(e,t,n,i,r,s,a,o){if(o>t&&o>i&&o>s||o<t&&o<i&&o<s)return 0;var l=UC(t,i,s,o,$e);if(l===0)return 0;var c=py(t,i,s);if(c>=0&&c<=1){for(var f=0,u=sn(t,i,s,c),h=0;h<l;h++){var d=$e[h]===0||$e[h]===1?.5:1,v=sn(e,n,r,$e[h]);v<a||($e[h]<c?f+=u<t?d:-d:f+=s<u?d:-d)}return f}else{var d=$e[0]===0||$e[0]===1?.5:1,v=sn(e,n,r,$e[0]);return v<a?0:s<t?d:-d}}function kR(e,t,n,i,r,s,a,o){if(o-=t,o>n||o<-n)return 0;var l=Math.sqrt(n*n-o*o);$e[0]=-l,$e[1]=l;var c=Math.abs(i-r);if(c<1e-4)return 0;if(c>=jr-1e-4){i=0,r=jr;var f=s?1:-1;return a>=$e[0]+e&&a<=$e[1]+e?f:0}if(i>r){var u=i;i=r,r=u}i<0&&(i+=jr,r+=jr);for(var h=0,d=0;d<2;d++){var v=$e[d];if(v+e>a){var _=Math.atan2(o,v),f=s?1:-1;_<0&&(_=jr+_),(_>=i&&_<=r||_+jr>=i&&_+jr<=r)&&(_>Math.PI/2&&_<Math.PI*1.5&&(f=-f),h+=f)}}return h}function Ly(e,t,n,i,r){for(var s=e.data,a=e.len(),o=0,l=0,c=0,f=0,u=0,h,d,v=0;v<a;){var _=s[v++],m=v===1;switch(_===sr.M&&v>1&&(n||(o+=Jr(l,c,f,u,i,r))),m&&(l=s[v],c=s[v+1],f=l,u=c),_){case sr.M:f=s[v++],u=s[v++],l=f,c=u;break;case sr.L:if(n){if(Vs(l,c,s[v],s[v+1],t,i,r))return!0}else o+=Jr(l,c,s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case sr.C:if(n){if(FR(l,c,s[v++],s[v++],s[v++],s[v++],s[v],s[v+1],t,i,r))return!0}else o+=VR(l,c,s[v++],s[v++],s[v++],s[v++],s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case sr.Q:if(n){if(UR(l,c,s[v++],s[v++],s[v],s[v+1],t,i,r))return!0}else o+=GR(l,c,s[v++],s[v++],s[v],s[v+1],i,r)||0;l=s[v++],c=s[v++];break;case sr.A:var p=s[v++],x=s[v++],b=s[v++],S=s[v++],T=s[v++],E=s[v++];v+=1;var C=!!(1-s[v++]);h=Math.cos(T)*b+p,d=Math.sin(T)*S+x,m?(f=h,u=d):o+=Jr(l,c,h,d,i,r);var R=(i-p)*S/b+p;if(n){if(OR(p,x,S,T,T+E,C,t,R,r))return!0}else o+=kR(p,x,S,T,T+E,C,R,r);l=Math.cos(T+E)*b+p,c=Math.sin(T+E)*S+x;break;case sr.R:f=l=s[v++],u=c=s[v++];var g=s[v++],M=s[v++];if(h=f+g,d=u+M,n){if(Vs(f,u,h,u,t,i,r)||Vs(h,u,h,d,t,i,r)||Vs(h,d,f,d,t,i,r)||Vs(f,d,f,u,t,i,r))return!0}else o+=Jr(h,u,h,d,i,r),o+=Jr(f,d,f,u,i,r);break;case sr.Z:if(n){if(Vs(l,c,f,u,t,i,r))return!0}else o+=Jr(l,c,f,u,i,r);l=f,c=u;break}}return!n&&!HR(c,u)&&(o+=Jr(l,c,f,u,i,r)||0),o!==0}function WR(e,t,n){return Ly(e,0,!1,t,n)}function XR(e,t,n,i){return Ly(e,t,!0,n,i)}var Dy=Ds({fill:"#000",stroke:null,strokePercent:1,fillOpacity:1,strokeOpacity:1,lineDashOffset:0,lineWidth:1,lineCap:"butt",miterLimit:10,strokeNoScale:!1,strokeFirst:!1},bs),qR={style:Ds({fill:!0,stroke:!0,strokePercent:!0,fillOpacity:!0,strokeOpacity:!0,lineDashOffset:!0,lineWidth:!0,miterLimit:!0},wu.style)},Hh=tl.concat(["invisible","culling","z","z2","zlevel","parent"]),ke=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.update=function(){var n=this;e.prototype.update.call(this);var i=this.style;if(i.decal){var r=this._decalEl=this._decalEl||new t;r.buildPath===t.prototype.buildPath&&(r.buildPath=function(l){n.buildPath(l,n.shape)}),r.silent=!0;var s=r.style;for(var a in i)s[a]!==i[a]&&(s[a]=i[a]);s.fill=i.fill?i.decal:null,s.decal=null,s.shadowColor=null,i.strokeFirst&&(s.stroke=null);for(var o=0;o<Hh.length;++o)r[Hh[o]]=this[Hh[o]];r.__dirty|=vn}else this._decalEl&&(this._decalEl=null)},t.prototype.getDecalElement=function(){return this._decalEl},t.prototype._init=function(n){var i=yn(n);this.shape=this.getDefaultShape();var r=this.getDefaultStyle();r&&this.useStyle(r);for(var s=0;s<i.length;s++){var a=i[s],o=n[a];a==="style"?this.style?_e(this.style,o):this.useStyle(o):a==="shape"?_e(this.shape,o):e.prototype.attrKV.call(this,a,o)}this.style||this.useStyle({})},t.prototype.getDefaultStyle=function(){return null},t.prototype.getDefaultShape=function(){return{}},t.prototype.canBeInsideText=function(){return this.hasFill()},t.prototype.getInsideTextFill=function(){var n=this.style.fill;if(n!=="none"){if(Zc(n)){var i=nf(n,0);return i>.5?rp:i>.2?sR:sp}else if(n)return sp}return rp},t.prototype.getInsideTextStroke=function(n){var i=this.style.fill;if(Zc(i)){var r=this.__zr,s=!!(r&&r.isDarkMode()),a=nf(n,0)<ip;if(s===a)return i}},t.prototype.buildPath=function(n,i,r){},t.prototype.pathUpdated=function(){this.__dirty&=~ra},t.prototype.getUpdatedPathProxy=function(n){return!this.path&&this.createPathProxy(),this.path.beginPath(),this.buildPath(this.path,this.shape,n),this.path},t.prototype.createPathProxy=function(){this.path=new Ca(!1)},t.prototype.hasStroke=function(){var n=this.style,i=n.stroke;return!(i==null||i==="none"||!(n.lineWidth>0))},t.prototype.hasFill=function(){var n=this.style,i=n.fill;return i!=null&&i!=="none"},t.prototype.getBoundingRect=function(){var n=this._rect,i=this.style,r=!n;if(r){var s=!1;this.path||(s=!0,this.createPathProxy());var a=this.path;(s||this.__dirty&ra)&&(a.beginPath(),this.buildPath(a,this.shape,!1),this.pathUpdated()),n=a.getBoundingRect()}if(this._rect=n,this.hasStroke()&&this.path&&this.path.len()>0){var o=this._rectStroke||(this._rectStroke=n.clone());if(this.__dirty||r){o.copy(n);var l=i.strokeNoScale?this.getLineScale():1,c=i.lineWidth;if(!this.hasFill()){var f=this.strokeContainThreshold;c=Math.max(c,f==null?4:f)}l>1e-10&&(o.width+=c/l,o.height+=c/l,o.x-=c/l/2,o.y-=c/l/2)}return o}return n},t.prototype.contain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect(),a=this.style;if(n=r[0],i=r[1],s.contain(n,i)){var o=this.path;if(this.hasStroke()){var l=a.lineWidth,c=a.strokeNoScale?this.getLineScale():1;if(c>1e-10&&(this.hasFill()||(l=Math.max(l,this.strokeContainThreshold)),XR(o,l/c,n,i)))return!0}if(this.hasFill())return WR(o,n,i)}return!1},t.prototype.dirtyShape=function(){this.__dirty|=ra,this._rect&&(this._rect=null),this._decalEl&&this._decalEl.dirtyShape(),this.markRedraw()},t.prototype.dirty=function(){this.dirtyStyle(),this.dirtyShape()},t.prototype.animateShape=function(n){return this.animate("shape",n)},t.prototype.updateDuringAnimation=function(n){n==="style"?this.dirtyStyle():n==="shape"?this.dirtyShape():this.markRedraw()},t.prototype.attrKV=function(n,i){n==="shape"?this.setShape(i):e.prototype.attrKV.call(this,n,i)},t.prototype.setShape=function(n,i){var r=this.shape;return r||(r=this.shape={}),typeof n=="string"?r[n]=i:_e(r,n),this.dirtyShape(),this},t.prototype.shapeChanged=function(){return!!(this.__dirty&ra)},t.prototype.createStyle=function(n){return Mu(Dy,n)},t.prototype._innerSaveToNormal=function(n){e.prototype._innerSaveToNormal.call(this,n);var i=this._normalState;n.shape&&!i.shape&&(i.shape=_e({},this.shape))},t.prototype._applyStateObj=function(n,i,r,s,a,o){e.prototype._applyStateObj.call(this,n,i,r,s,a,o);var l=!(i&&s),c;if(i&&i.shape?a?s?c=i.shape:(c=_e({},r.shape),_e(c,i.shape)):(c=_e({},s?this.shape:r.shape),_e(c,i.shape)):l&&(c=r.shape),c)if(a){this.shape=_e({},this.shape);for(var f={},u=yn(c),h=0;h<u.length;h++){var d=u[h];typeof c[d]=="object"?this.shape[d]=c[d]:f[d]=c[d]}this._transitionState(n,{shape:f},o)}else this.shape=c,this.dirtyShape()},t.prototype._mergeStates=function(n){for(var i=e.prototype._mergeStates.call(this,n),r,s=0;s<n.length;s++){var a=n[s];a.shape&&(r=r||{},this._mergeStyle(r,a.shape))}return r&&(i.shape=r),i},t.prototype.getAnimationStyleProps=function(){return qR},t.prototype.isZeroArea=function(){return!1},t.extend=function(n){var i=function(s){ue(a,s);function a(o){var l=s.call(this,o)||this;return n.init&&n.init.call(l,o),l}return a.prototype.getDefaultStyle=function(){return Ea(n.style)},a.prototype.getDefaultShape=function(){return Ea(n.shape)},a}(t);for(var r in n)typeof n[r]=="function"&&(i.prototype[r]=n[r]);return i},t.initDefaultProps=function(){var n=t.prototype;n.type="path",n.strokeContainThreshold=5,n.segmentIgnoreThreshold=0,n.subPixelOptimize=!1,n.autoBatch=!1,n.__dirty=vn|ho|ra}(),t}(hl),YR=Ds({strokeFirst:!0,font:Pr,x:0,y:0,textAlign:"left",textBaseline:"top",miterLimit:2},Dy),sf=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.hasStroke=function(){return Py(this.style)},t.prototype.hasFill=function(){var n=this.style,i=n.fill;return i!=null&&i!=="none"},t.prototype.createStyle=function(n){return Mu(YR,n)},t.prototype.setBoundingRect=function(n){this._rect=n},t.prototype.getBoundingRect=function(){return this._rect||(this._rect=CR(this.style)),this._rect},t.initDefaultProps=function(){var n=t.prototype;n.dirtyRectTolerance=10}(),t}(hl);sf.prototype.type="tspan";var $R=Ds({x:0,y:0},bs),KR={style:Ds({x:!0,y:!0,width:!0,height:!0,sx:!0,sy:!0,sWidth:!0,sHeight:!0},wu.style)};function ZR(e){return!!(e&&typeof e!="string"&&e.width&&e.height)}var rm=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.createStyle=function(n){return Mu($R,n)},t.prototype._getSize=function(n){var i=this.style,r=i[n];if(r!=null)return r;var s=ZR(i.image)?i.image:this.__image;if(!s)return 0;var a=n==="width"?"height":"width",o=i[a];return o==null?s[n]:s[n]/s[a]*o},t.prototype.getWidth=function(){return this._getSize("width")},t.prototype.getHeight=function(){return this._getSize("height")},t.prototype.getAnimationStyleProps=function(){return KR},t.prototype.getBoundingRect=function(){var n=this.style;return this._rect||(this._rect=new ce(n.x||0,n.y||0,this.getWidth(),this.getHeight())),this._rect},t}(hl);rm.prototype.type="image";function JR(e,t){var n=t.x,i=t.y,r=t.width,s=t.height,a=t.r,o,l,c,f;r<0&&(n=n+r,r=-r),s<0&&(i=i+s,s=-s),typeof a=="number"?o=l=c=f=a:a instanceof Array?a.length===1?o=l=c=f=a[0]:a.length===2?(o=c=a[0],l=f=a[1]):a.length===3?(o=a[0],l=f=a[1],c=a[2]):(o=a[0],l=a[1],c=a[2],f=a[3]):o=l=c=f=0;var u;o+l>r&&(u=o+l,o*=r/u,l*=r/u),c+f>r&&(u=c+f,c*=r/u,f*=r/u),l+c>s&&(u=l+c,l*=s/u,c*=s/u),o+f>s&&(u=o+f,o*=s/u,f*=s/u),e.moveTo(n+o,i),e.lineTo(n+r-l,i),l!==0&&e.arc(n+r-l,i+l,l,-Math.PI/2,0),e.lineTo(n+r,i+s-c),c!==0&&e.arc(n+r-c,i+s-c,c,0,Math.PI/2),e.lineTo(n+f,i+s),f!==0&&e.arc(n+f,i+s-f,f,Math.PI/2,Math.PI),e.lineTo(n,i+o),o!==0&&e.arc(n+o,i+o,o,Math.PI,Math.PI*1.5)}var ca=Math.round;function jR(e,t,n){if(t){var i=t.x1,r=t.x2,s=t.y1,a=t.y2;e.x1=i,e.x2=r,e.y1=s,e.y2=a;var o=n&&n.lineWidth;return o&&(ca(i*2)===ca(r*2)&&(e.x1=e.x2=fa(i,o,!0)),ca(s*2)===ca(a*2)&&(e.y1=e.y2=fa(s,o,!0))),e}}function QR(e,t,n){if(t){var i=t.x,r=t.y,s=t.width,a=t.height;e.x=i,e.y=r,e.width=s,e.height=a;var o=n&&n.lineWidth;return o&&(e.x=fa(i,o,!0),e.y=fa(r,o,!0),e.width=Math.max(fa(i+s,o,!1)-e.x,s===0?0:1),e.height=Math.max(fa(r+a,o,!1)-e.y,a===0?0:1)),e}}function fa(e,t,n){if(!t)return e;var i=ca(e*2);return(i+ca(t))%2===0?i/2:(i+(n?1:-1))/2}var tP=function(){function e(){this.x=0,this.y=0,this.width=0,this.height=0}return e}(),eP={},Iy=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new tP},t.prototype.buildPath=function(n,i){var r,s,a,o;if(this.subPixelOptimize){var l=QR(eP,i,this.style);r=l.x,s=l.y,a=l.width,o=l.height,l.r=i.r,i=l}else r=i.x,s=i.y,a=i.width,o=i.height;i.r?JR(n,i):n.rect(r,s,a,o)},t.prototype.isZeroArea=function(){return!this.shape.width||!this.shape.height},t}(ke);Iy.prototype.type="rect";var H_={fill:"#000"},z_=2,li={},nP={style:Ds({fill:!0,stroke:!0,fillOpacity:!0,strokeOpacity:!0,lineWidth:!0,fontSize:!0,lineHeight:!0,width:!0,height:!0,textShadowColor:!0,textShadowBlur:!0,textShadowOffsetX:!0,textShadowOffsetY:!0,backgroundColor:!0,padding:!0,borderColor:!0,borderWidth:!0,borderRadius:!0},wu.style)},iP=function(e){ue(t,e);function t(n){var i=e.call(this)||this;return i.type="text",i._children=[],i._defaultStyle=H_,i.attr(n),i}return t.prototype.childrenRef=function(){return this._children},t.prototype.update=function(){e.prototype.update.call(this),this.styleChanged()&&this._updateSubTexts();for(var n=0;n<this._children.length;n++){var i=this._children[n];i.zlevel=this.zlevel,i.z=this.z,i.z2=this.z2,i.culling=this.culling,i.cursor=this.cursor,i.invisible=this.invisible}},t.prototype.updateTransform=function(){var n=this.innerTransformable;n?(n.updateTransform(),n.transform&&(this.transform=n.transform)):e.prototype.updateTransform.call(this)},t.prototype.getLocalTransform=function(n){var i=this.innerTransformable;return i?i.getLocalTransform(n):e.prototype.getLocalTransform.call(this,n)},t.prototype.getComputedTransform=function(){return this.__hostTarget&&(this.__hostTarget.getComputedTransform(),this.__hostTarget.updateInnerText(!0)),e.prototype.getComputedTransform.call(this)},t.prototype._updateSubTexts=function(){this._childCursor=0,lP(this.style),this.style.rich?this._updateRichTexts():this._updatePlainTexts(),this._children.length=this._childCursor,this.styleUpdated()},t.prototype.addSelfToZr=function(n){e.prototype.addSelfToZr.call(this,n);for(var i=0;i<this._children.length;i++)this._children[i].__zr=n},t.prototype.removeSelfFromZr=function(n){e.prototype.removeSelfFromZr.call(this,n);for(var i=0;i<this._children.length;i++)this._children[i].__zr=null},t.prototype.getBoundingRect=function(){if(this.styleChanged()&&this._updateSubTexts(),!this._rect){for(var n=new ce(0,0,0,0),i=this._children,r=[],s=null,a=0;a<i.length;a++){var o=i[a],l=o.getBoundingRect(),c=o.getLocalTransform(r);c?(n.copy(l),n.applyTransform(c),s=s||n.clone(),s.union(n)):(s=s||l.clone(),s.union(l))}this._rect=s||n}return this._rect},t.prototype.setDefaultTextStyle=function(n){this._defaultStyle=n||H_},t.prototype.setTextContent=function(n){},t.prototype._mergeStyle=function(n,i){if(!i)return n;var r=i.rich,s=n.rich||r&&{};return _e(n,i),r&&s?(this._mergeRich(s,r),n.rich=s):s&&(n.rich=s),n},t.prototype._mergeRich=function(n,i){for(var r=yn(i),s=0;s<r.length;s++){var a=r[s];n[a]=n[a]||{},_e(n[a],i[a])}},t.prototype.getAnimationStyleProps=function(){return nP},t.prototype._getOrCreateChild=function(n){var i=this._children[this._childCursor];return(!i||!(i instanceof n))&&(i=new n),this._children[this._childCursor++]=i,i.__zr=this.__zr,i.parent=this,i},t.prototype._updatePlainTexts=function(){var n=this.style,i=n.font||Pr,r=n.padding,s=this._defaultStyle,a=n.x||0,o=n.y||0,l=n.align||s.align||"left",c=n.verticalAlign||s.verticalAlign||"top";L_(li,s.overflowRect,a,o,l,c),a=li.baseX,o=li.baseY;var f=Y_(n),u=SR(f,n,li.outerWidth,li.outerHeight),h=zh(n),d=!!n.backgroundColor,v=u.outerHeight,_=u.outerWidth,m=u.lines,p=u.lineHeight;this.isTruncated=!!u.isTruncated;var x=a,b=Ms(o,u.contentHeight,c);if(h||r){var S=Aa(a,_,l),T=Ms(o,v,c);h&&this._renderBackground(n,n,S,T,_,v)}b+=p/2,r&&(x=q_(a,l,r),c==="top"?b+=r[0]:c==="bottom"&&(b-=r[2]));for(var E=0,C=!1,R=!1,g=X_("fill"in n?n.fill:(R=!0,s.fill)),M=W_("stroke"in n?n.stroke:!d&&(!s.autoStroke||R)?(E=z_,C=!0,s.stroke):null),P=n.textShadowBlur>0,I=0;I<m.length;I++){var N=this._getOrCreateChild(sf),O=N.createStyle();N.useStyle(O),O.text=m[I],O.x=x,O.y=b,O.textAlign=l,O.textBaseline="middle",O.opacity=n.opacity,O.strokeFirst=!0,P&&(O.shadowBlur=n.textShadowBlur||0,O.shadowColor=n.textShadowColor||"transparent",O.shadowOffsetX=n.textShadowOffsetX||0,O.shadowOffsetY=n.textShadowOffsetY||0),O.stroke=M,O.fill=g,M&&(O.lineWidth=n.lineWidth||E,O.lineDash=n.lineDash,O.lineDashOffset=n.lineDashOffset||0),O.font=i,G_(O,n),b+=p,N.setBoundingRect(op(O,u.contentWidth,u.calculatedLineHeight,C?0:null))}},t.prototype._updateRichTexts=function(){var n=this.style,i=this._defaultStyle,r=n.align||i.align,s=n.verticalAlign||i.verticalAlign,a=n.x||0,o=n.y||0;L_(li,i.overflowRect,a,o,r,s),a=li.baseX,o=li.baseY;var l=Y_(n),c=TR(l,n,li.outerWidth,li.outerHeight,r),f=c.width,u=c.outerWidth,h=c.outerHeight,d=n.padding;this.isTruncated=!!c.isTruncated;var v=Aa(a,u,r),_=Ms(o,h,s),m=v,p=_;d&&(m+=d[3],p+=d[0]);var x=m+f;zh(n)&&this._renderBackground(n,n,v,_,u,h);for(var b=!!n.backgroundColor,S=0;S<c.lines.length;S++){for(var T=c.lines[S],E=T.tokens,C=E.length,R=T.lineHeight,g=T.width,M=0,P=m,I=x,N=C-1,O=void 0;M<C&&(O=E[M],!O.align||O.align==="left");)this._placeToken(O,n,R,p,P,"left",b),g-=O.width,P+=O.width,M++;for(;N>=0&&(O=E[N],O.align==="right");)this._placeToken(O,n,R,p,I,"right",b),g-=O.width,I-=O.width,N--;for(P+=(f-(P-m)-(x-I)-g)/2;M<=N;)O=E[M],this._placeToken(O,n,R,p,P+O.width/2,"center",b),P+=O.width,M++;p+=R}},t.prototype._placeToken=function(n,i,r,s,a,o,l){var c=i.rich[n.styleName]||{};c.text=n.text;var f=n.verticalAlign,u=s+r/2;f==="top"?u=s+n.height/2:f==="bottom"&&(u=s+r-n.height/2);var h=!n.isLineHolder&&zh(c);h&&this._renderBackground(c,i,o==="right"?a-n.width:o==="center"?a-n.width/2:a,u-n.height/2,n.width,n.height);var d=!!c.backgroundColor,v=n.textPadding;v&&(a=q_(a,o,v),u-=n.height/2-v[0]-n.innerHeight/2);var _=this._getOrCreateChild(sf),m=_.createStyle();_.useStyle(m);var p=this._defaultStyle,x=!1,b=0,S=!1,T=X_("fill"in c?c.fill:"fill"in i?i.fill:(x=!0,p.fill)),E=W_("stroke"in c?c.stroke:"stroke"in i?i.stroke:!d&&!l&&(!p.autoStroke||x)?(b=z_,S=!0,p.stroke):null),C=c.textShadowBlur>0||i.textShadowBlur>0;m.text=n.text,m.x=a,m.y=u,C&&(m.shadowBlur=c.textShadowBlur||i.textShadowBlur||0,m.shadowColor=c.textShadowColor||i.textShadowColor||"transparent",m.shadowOffsetX=c.textShadowOffsetX||i.textShadowOffsetX||0,m.shadowOffsetY=c.textShadowOffsetY||i.textShadowOffsetY||0),m.textAlign=o,m.textBaseline="middle",m.font=n.font||Pr,m.opacity=Tc(c.opacity,i.opacity,1),G_(m,c),E&&(m.lineWidth=Tc(c.lineWidth,i.lineWidth,b),m.lineDash=Ln(c.lineDash,i.lineDash),m.lineDashOffset=i.lineDashOffset||0,m.stroke=E),T&&(m.fill=T),_.setBoundingRect(op(m,n.contentWidth,n.contentHeight,S?0:null))},t.prototype._renderBackground=function(n,i,r,s,a,o){var l=n.backgroundColor,c=n.borderWidth,f=n.borderColor,u=l&&l.image,h=l&&!u,d=n.borderRadius,v=this,_,m;if(h||n.lineHeight||c&&f){_=this._getOrCreateChild(Iy),_.useStyle(_.createStyle()),_.style.fill=null;var p=_.shape;p.x=r,p.y=s,p.width=a,p.height=o,p.r=d,_.dirtyShape()}if(h){var x=_.style;x.fill=l||null,x.fillOpacity=Ln(n.fillOpacity,1)}else if(u){m=this._getOrCreateChild(rm),m.onload=function(){v.dirtyStyle()};var b=m.style;b.image=l.image,b.x=r,b.y=s,b.width=a,b.height=o}if(c&&f){var x=_.style;x.lineWidth=c,x.stroke=f,x.strokeOpacity=Ln(n.strokeOpacity,1),x.lineDash=n.borderDash,x.lineDashOffset=n.borderDashOffset||0,_.strokeContainThreshold=0,_.hasFill()&&_.hasStroke()&&(x.strokeFirst=!0,x.lineWidth*=2)}var S=(_||m).style;S.shadowBlur=n.shadowBlur||0,S.shadowColor=n.shadowColor||"transparent",S.shadowOffsetX=n.shadowOffsetX||0,S.shadowOffsetY=n.shadowOffsetY||0,S.opacity=Tc(n.opacity,i.opacity,1)},t.makeFont=function(n){var i="";return oP(n)&&(i=[n.fontStyle,n.fontWeight,aP(n.fontSize),n.fontFamily||"sans-serif"].join(" ")),i&&fo(i)||n.textFont||n.font},t}(hl),rP={left:!0,right:1,center:1},sP={top:1,bottom:1,middle:1},V_=["fontStyle","fontWeight","fontSize","fontFamily"];function aP(e){return typeof e=="string"&&(e.indexOf("px")!==-1||e.indexOf("rem")!==-1||e.indexOf("em")!==-1)?e:isNaN(+e)?Jp+"px":e+"px"}function G_(e,t){for(var n=0;n<V_.length;n++){var i=V_[n],r=t[i];r!=null&&(e[i]=r)}}function oP(e){return e.fontSize!=null||e.fontFamily||e.fontWeight}function lP(e){return k_(e),ln(e.rich,k_),e}function k_(e){if(e){e.font=iP.makeFont(e);var t=e.align;t==="middle"&&(t="center"),e.align=t==null||rP[t]?t:"left";var n=e.verticalAlign;n==="center"&&(n="middle"),e.verticalAlign=n==null||sP[n]?n:"top";var i=e.padding;i&&(e.padding=XA(e.padding))}}function W_(e,t){return e==null||t<=0||e==="transparent"||e==="none"?null:e.image||e.colorStops?"#000":e}function X_(e){return e==null||e==="none"?null:e.image||e.colorStops?"#000":e}function q_(e,t,n){return t==="right"?e-n[1]:t==="center"?e+n[3]/2-n[1]/2:e+n[3]}function Y_(e){var t=e.text;return t!=null&&(t+=""),t}function zh(e){return!!(e.backgroundColor||e.lineHeight||e.borderWidth&&e.borderColor)}var Gs=Ca.CMD,cP=[[],[],[]],$_=Math.sqrt,fP=Math.atan2;function uP(e,t){if(t){var n=e.data,i=e.len(),r,s,a,o,l,c,f=Gs.M,u=Gs.C,h=Gs.L,d=Gs.R,v=Gs.A,_=Gs.Q;for(a=0,o=0;a<i;){switch(r=n[a++],o=a,s=0,r){case f:s=1;break;case h:s=1;break;case u:s=3;break;case _:s=2;break;case v:var m=t[4],p=t[5],x=$_(t[0]*t[0]+t[1]*t[1]),b=$_(t[2]*t[2]+t[3]*t[3]),S=fP(-t[1]/b,t[0]/x);n[a]*=x,n[a++]+=m,n[a]*=b,n[a++]+=p,n[a++]*=x,n[a++]*=b,n[a++]+=S,n[a++]+=S,a+=2,o=a;break;case d:c[0]=n[a++],c[1]=n[a++],Ro(c,c,t),n[o++]=c[0],n[o++]=c[1],c[0]+=n[a++],c[1]+=n[a++],Ro(c,c,t),n[o++]=c[0],n[o++]=c[1]}for(l=0;l<s;l++){var T=cP[l];T[0]=n[a++],T[1]=n[a++],Ro(T,T,t),n[o++]=T[0],n[o++]=T[1]}}e.increaseVersion()}}var Vh=Math.sqrt,zl=Math.sin,Vl=Math.cos,Ja=Math.PI;function K_(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1])}function fp(e,t){return(e[0]*t[0]+e[1]*t[1])/(K_(e)*K_(t))}function Z_(e,t){return(e[0]*t[1]<e[1]*t[0]?-1:1)*Math.acos(fp(e,t))}function J_(e,t,n,i,r,s,a,o,l,c,f){var u=l*(Ja/180),h=Vl(u)*(e-n)/2+zl(u)*(t-i)/2,d=-1*zl(u)*(e-n)/2+Vl(u)*(t-i)/2,v=h*h/(a*a)+d*d/(o*o);v>1&&(a*=Vh(v),o*=Vh(v));var _=(r===s?-1:1)*Vh((a*a*(o*o)-a*a*(d*d)-o*o*(h*h))/(a*a*(d*d)+o*o*(h*h)))||0,m=_*a*d/o,p=_*-o*h/a,x=(e+n)/2+Vl(u)*m-zl(u)*p,b=(t+i)/2+zl(u)*m+Vl(u)*p,S=Z_([1,0],[(h-m)/a,(d-p)/o]),T=[(h-m)/a,(d-p)/o],E=[(-1*h-m)/a,(-1*d-p)/o],C=Z_(T,E);if(fp(T,E)<=-1&&(C=Ja),fp(T,E)>=1&&(C=0),C<0){var R=Math.round(C/Ja*1e6)/1e6;C=Ja*2+R%2*Ja}f.addData(c,x,b,a,o,S,C,u,s)}var hP=/([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig,dP=/-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;function pP(e){var t=new Ca;if(!e)return t;var n=0,i=0,r=n,s=i,a,o=Ca.CMD,l=e.match(hP);if(!l)return t;for(var c=0;c<l.length;c++){for(var f=l[c],u=f.charAt(0),h=void 0,d=f.match(dP)||[],v=d.length,_=0;_<v;_++)d[_]=parseFloat(d[_]);for(var m=0;m<v;){var p=void 0,x=void 0,b=void 0,S=void 0,T=void 0,E=void 0,C=void 0,R=n,g=i,M=void 0,P=void 0;switch(u){case"l":n+=d[m++],i+=d[m++],h=o.L,t.addData(h,n,i);break;case"L":n=d[m++],i=d[m++],h=o.L,t.addData(h,n,i);break;case"m":n+=d[m++],i+=d[m++],h=o.M,t.addData(h,n,i),r=n,s=i,u="l";break;case"M":n=d[m++],i=d[m++],h=o.M,t.addData(h,n,i),r=n,s=i,u="L";break;case"h":n+=d[m++],h=o.L,t.addData(h,n,i);break;case"H":n=d[m++],h=o.L,t.addData(h,n,i);break;case"v":i+=d[m++],h=o.L,t.addData(h,n,i);break;case"V":i=d[m++],h=o.L,t.addData(h,n,i);break;case"C":h=o.C,t.addData(h,d[m++],d[m++],d[m++],d[m++],d[m++],d[m++]),n=d[m-2],i=d[m-1];break;case"c":h=o.C,t.addData(h,d[m++]+n,d[m++]+i,d[m++]+n,d[m++]+i,d[m++]+n,d[m++]+i),n+=d[m-2],i+=d[m-1];break;case"S":p=n,x=i,M=t.len(),P=t.data,a===o.C&&(p+=n-P[M-4],x+=i-P[M-3]),h=o.C,R=d[m++],g=d[m++],n=d[m++],i=d[m++],t.addData(h,p,x,R,g,n,i);break;case"s":p=n,x=i,M=t.len(),P=t.data,a===o.C&&(p+=n-P[M-4],x+=i-P[M-3]),h=o.C,R=n+d[m++],g=i+d[m++],n+=d[m++],i+=d[m++],t.addData(h,p,x,R,g,n,i);break;case"Q":R=d[m++],g=d[m++],n=d[m++],i=d[m++],h=o.Q,t.addData(h,R,g,n,i);break;case"q":R=d[m++]+n,g=d[m++]+i,n+=d[m++],i+=d[m++],h=o.Q,t.addData(h,R,g,n,i);break;case"T":p=n,x=i,M=t.len(),P=t.data,a===o.Q&&(p+=n-P[M-4],x+=i-P[M-3]),n=d[m++],i=d[m++],h=o.Q,t.addData(h,p,x,n,i);break;case"t":p=n,x=i,M=t.len(),P=t.data,a===o.Q&&(p+=n-P[M-4],x+=i-P[M-3]),n+=d[m++],i+=d[m++],h=o.Q,t.addData(h,p,x,n,i);break;case"A":b=d[m++],S=d[m++],T=d[m++],E=d[m++],C=d[m++],R=n,g=i,n=d[m++],i=d[m++],h=o.A,J_(R,g,n,i,E,C,b,S,T,h,t);break;case"a":b=d[m++],S=d[m++],T=d[m++],E=d[m++],C=d[m++],R=n,g=i,n+=d[m++],i+=d[m++],h=o.A,J_(R,g,n,i,E,C,b,S,T,h,t);break}}(u==="z"||u==="Z")&&(h=o.Z,t.addData(h),n=r,i=s),a=h}return t.toStatic(),t}var Ny=function(e){ue(t,e);function t(){return e!==null&&e.apply(this,arguments)||this}return t.prototype.applyTransform=function(n){},t}(ke);function Fy(e){return e.setData!=null}function Uy(e,t){var n=pP(e),i=_e({},t);return i.buildPath=function(r){var s=Fy(r);if(s&&r.canSave()){r.appendPath(n);var a=r.getContext();a&&r.rebuildPath(a,1)}else{var a=s?r.getContext():r;a&&n.rebuildPath(a,1)}},i.applyTransform=function(r){uP(n,r),this.dirtyShape()},i}function xF(e,t){return new Ny(Uy(e,t))}function yF(e,t){var n=Uy(e,t),i=function(r){ue(s,r);function s(a){var o=r.call(this,a)||this;return o.applyTransform=n.applyTransform,o.buildPath=n.buildPath,o}return s}(Ny);return i}function SF(e,t){for(var n=[],i=e.length,r=0;r<i;r++){var s=e[r];n.push(s.getUpdatedPathProxy(!0))}var a=new ke(t);return a.createPathProxy(),a.buildPath=function(o){if(Fy(o)){o.appendPath(n);var l=o.getContext();l&&o.rebuildPath(l,1)}},a}var mP=function(){function e(){this.cx=0,this.cy=0,this.r=0}return e}(),vP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new mP},t.prototype.buildPath=function(n,i){n.moveTo(i.cx+i.r,i.cy),n.arc(i.cx,i.cy,i.r,0,Math.PI*2)},t}(ke);vP.prototype.type="circle";var _P=function(){function e(){this.cx=0,this.cy=0,this.rx=0,this.ry=0}return e}(),gP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new _P},t.prototype.buildPath=function(n,i){var r=.5522848,s=i.cx,a=i.cy,o=i.rx,l=i.ry,c=o*r,f=l*r;n.moveTo(s-o,a),n.bezierCurveTo(s-o,a-f,s-c,a-l,s,a-l),n.bezierCurveTo(s+c,a-l,s+o,a-f,s+o,a),n.bezierCurveTo(s+o,a+f,s+c,a+l,s,a+l),n.bezierCurveTo(s-c,a+l,s-o,a+f,s-o,a),n.closePath()},t}(ke);gP.prototype.type="ellipse";var Oy=Math.PI,Gh=Oy*2,Qr=Math.sin,ks=Math.cos,xP=Math.acos,Fe=Math.atan2,j_=Math.abs,Io=Math.sqrt,mo=Math.max,ci=Math.min,Bn=1e-4;function yP(e,t,n,i,r,s,a,o){var l=n-e,c=i-t,f=a-r,u=o-s,h=u*l-f*c;if(!(h*h<Bn))return h=(f*(t-s)-u*(e-r))/h,[e+h*l,t+h*c]}function Gl(e,t,n,i,r,s,a){var o=e-n,l=t-i,c=(a?s:-s)/Io(o*o+l*l),f=c*l,u=-c*o,h=e+f,d=t+u,v=n+f,_=i+u,m=(h+v)/2,p=(d+_)/2,x=v-h,b=_-d,S=x*x+b*b,T=r-s,E=h*_-v*d,C=(b<0?-1:1)*Io(mo(0,T*T*S-E*E)),R=(E*b-x*C)/S,g=(-E*x-b*C)/S,M=(E*b+x*C)/S,P=(-E*x+b*C)/S,I=R-m,N=g-p,O=M-m,q=P-p;return I*I+N*N>O*O+q*q&&(R=M,g=P),{cx:R,cy:g,x0:-f,y0:-u,x1:R*(r/T-1),y1:g*(r/T-1)}}function SP(e){var t;if(Jo(e)){var n=e.length;if(!n)return e;n===1?t=[e[0],e[0],0,0]:n===2?t=[e[0],e[0],e[1],e[1]]:n===3?t=e.concat(e[2]):t=e}else t=[e,e,e,e];return t}function MP(e,t){var n,i=mo(t.r,0),r=mo(t.r0||0,0),s=i>0,a=r>0;if(!(!s&&!a)){if(s||(i=r,r=0),r>i){var o=i;i=r,r=o}var l=t.startAngle,c=t.endAngle;if(!(isNaN(l)||isNaN(c))){var f=t.cx,u=t.cy,h=!!t.clockwise,d=j_(c-l),v=d>Gh&&d%Gh;if(v>Bn&&(d=v),!(i>Bn))e.moveTo(f,u);else if(d>Gh-Bn)e.moveTo(f+i*ks(l),u+i*Qr(l)),e.arc(f,u,i,l,c,!h),r>Bn&&(e.moveTo(f+r*ks(c),u+r*Qr(c)),e.arc(f,u,r,c,l,h));else{var _=void 0,m=void 0,p=void 0,x=void 0,b=void 0,S=void 0,T=void 0,E=void 0,C=void 0,R=void 0,g=void 0,M=void 0,P=void 0,I=void 0,N=void 0,O=void 0,q=i*ks(l),V=i*Qr(l),H=r*ks(c),K=r*Qr(c),dt=d>Bn;if(dt){var ct=t.cornerRadius;ct&&(n=SP(ct),_=n[0],m=n[1],p=n[2],x=n[3]);var ht=j_(i-r)/2;if(b=ci(ht,p),S=ci(ht,x),T=ci(ht,_),E=ci(ht,m),g=C=mo(b,S),M=R=mo(T,E),(C>Bn||R>Bn)&&(P=i*ks(c),I=i*Qr(c),N=r*ks(l),O=r*Qr(l),d<Oy)){var Rt=yP(q,V,N,O,P,I,H,K);if(Rt){var It=q-Rt[0],qt=V-Rt[1],Kt=P-Rt[0],Q=I-Rt[1],it=1/Qr(xP((It*Kt+qt*Q)/(Io(It*It+qt*qt)*Io(Kt*Kt+Q*Q)))/2),Mt=Io(Rt[0]*Rt[0]+Rt[1]*Rt[1]);g=ci(C,(i-Mt)/(it+1)),M=ci(R,(r-Mt)/(it-1))}}}if(!dt)e.moveTo(f+q,u+V);else if(g>Bn){var Ut=ci(p,g),mt=ci(x,g),bt=Gl(N,O,q,V,i,Ut,h),D=Gl(P,I,H,K,i,mt,h);e.moveTo(f+bt.cx+bt.x0,u+bt.cy+bt.y0),g<C&&Ut===mt?e.arc(f+bt.cx,u+bt.cy,g,Fe(bt.y0,bt.x0),Fe(D.y0,D.x0),!h):(Ut>0&&e.arc(f+bt.cx,u+bt.cy,Ut,Fe(bt.y0,bt.x0),Fe(bt.y1,bt.x1),!h),e.arc(f,u,i,Fe(bt.cy+bt.y1,bt.cx+bt.x1),Fe(D.cy+D.y1,D.cx+D.x1),!h),mt>0&&e.arc(f+D.cx,u+D.cy,mt,Fe(D.y1,D.x1),Fe(D.y0,D.x0),!h))}else e.moveTo(f+q,u+V),e.arc(f,u,i,l,c,!h);if(!(r>Bn)||!dt)e.lineTo(f+H,u+K);else if(M>Bn){var Ut=ci(_,M),mt=ci(m,M),bt=Gl(H,K,P,I,r,-mt,h),D=Gl(q,V,N,O,r,-Ut,h);e.lineTo(f+bt.cx+bt.x0,u+bt.cy+bt.y0),M<R&&Ut===mt?e.arc(f+bt.cx,u+bt.cy,M,Fe(bt.y0,bt.x0),Fe(D.y0,D.x0),!h):(mt>0&&e.arc(f+bt.cx,u+bt.cy,mt,Fe(bt.y0,bt.x0),Fe(bt.y1,bt.x1),!h),e.arc(f,u,r,Fe(bt.cy+bt.y1,bt.cx+bt.x1),Fe(D.cy+D.y1,D.cx+D.x1),h),Ut>0&&e.arc(f+D.cx,u+D.cy,Ut,Fe(D.y1,D.x1),Fe(D.y0,D.x0),!h))}else e.lineTo(f+H,u+K),e.arc(f,u,r,c,l,h)}e.closePath()}}}var bP=function(){function e(){this.cx=0,this.cy=0,this.r0=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0,this.cornerRadius=0}return e}(),TP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new bP},t.prototype.buildPath=function(n,i){MP(n,i)},t.prototype.isZeroArea=function(){return this.shape.startAngle===this.shape.endAngle||this.shape.r===this.shape.r0},t}(ke);TP.prototype.type="sector";var EP=function(){function e(){this.cx=0,this.cy=0,this.r=0,this.r0=0}return e}(),wP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new EP},t.prototype.buildPath=function(n,i){var r=i.cx,s=i.cy,a=Math.PI*2;n.moveTo(r+i.r,s),n.arc(r,s,i.r,0,a,!1),n.moveTo(r+i.r0,s),n.arc(r,s,i.r0,0,a,!0)},t}(ke);wP.prototype.type="ring";function AP(e,t,n,i){var r=[],s=[],a=[],o=[],l,c,f,u;if(i){f=[1/0,1/0],u=[-1/0,-1/0];for(var h=0,d=e.length;h<d;h++)sa(f,f,e[h]),aa(u,u,e[h]);sa(f,f,i[0]),aa(u,u,i[1])}for(var h=0,d=e.length;h<d;h++){var v=e[h];if(n)l=e[h?h-1:d-1],c=e[(h+1)%d];else if(h===0||h===d-1){r.push(ZA(e[h]));continue}else l=e[h-1],c=e[h+1];JA(s,c,l),ah(s,s,t);var _=Wd(v,l),m=Wd(v,c),p=_+m;p!==0&&(_/=p,m/=p),ah(a,s,-_),ah(o,s,m);var x=e_([],v,a),b=e_([],v,o);i&&(aa(x,x,f),sa(x,x,u),aa(b,b,f),sa(b,b,u)),r.push(x),r.push(b)}return n&&r.push(r.shift()),r}function By(e,t,n){var i=t.smooth,r=t.points;if(r&&r.length>=2){if(i){var s=AP(r,i,n,t.smoothConstraint);e.moveTo(r[0][0],r[0][1]);for(var a=r.length,o=0;o<(n?a:a-1);o++){var l=s[o*2],c=s[o*2+1],f=r[(o+1)%a];e.bezierCurveTo(l[0],l[1],c[0],c[1],f[0],f[1])}}else{e.moveTo(r[0][0],r[0][1]);for(var o=1,u=r.length;o<u;o++)e.lineTo(r[o][0],r[o][1])}n&&e.closePath()}}var CP=function(){function e(){this.points=null,this.smooth=0,this.smoothConstraint=null}return e}(),RP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultShape=function(){return new CP},t.prototype.buildPath=function(n,i){By(n,i,!0)},t}(ke);RP.prototype.type="polygon";var PP=function(){function e(){this.points=null,this.percent=1,this.smooth=0,this.smoothConstraint=null}return e}(),LP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new PP},t.prototype.buildPath=function(n,i){By(n,i,!1)},t}(ke);LP.prototype.type="polyline";var DP={},IP=function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.percent=1}return e}(),NP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new IP},t.prototype.buildPath=function(n,i){var r,s,a,o;if(this.subPixelOptimize){var l=jR(DP,i,this.style);r=l.x1,s=l.y1,a=l.x2,o=l.y2}else r=i.x1,s=i.y1,a=i.x2,o=i.y2;var c=i.percent;c!==0&&(n.moveTo(r,s),c<1&&(a=r*(1-c)+a*c,o=s*(1-c)+o*c),n.lineTo(a,o))},t.prototype.pointAt=function(n){var i=this.shape;return[i.x1*(1-n)+i.x2*n,i.y1*(1-n)+i.y2*n]},t}(ke);NP.prototype.type="line";var en=[],FP=function(){function e(){this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.cpx1=0,this.cpy1=0,this.percent=1}return e}();function Q_(e,t,n){var i=e.cpx2,r=e.cpy2;return i!=null||r!=null?[(n?p_:Ze)(e.x1,e.cpx1,e.cpx2,e.x2,t),(n?p_:Ze)(e.y1,e.cpy1,e.cpy2,e.y2,t)]:[(n?m_:sn)(e.x1,e.cpx1,e.x2,t),(n?m_:sn)(e.y1,e.cpy1,e.y2,t)]}var UP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new FP},t.prototype.buildPath=function(n,i){var r=i.x1,s=i.y1,a=i.x2,o=i.y2,l=i.cpx1,c=i.cpy1,f=i.cpx2,u=i.cpy2,h=i.percent;h!==0&&(n.moveTo(r,s),f==null||u==null?(h<1&&(ef(r,l,a,h,en),l=en[1],a=en[2],ef(s,c,o,h,en),c=en[1],o=en[2]),n.quadraticCurveTo(l,c,a,o)):(h<1&&(tf(r,l,f,a,h,en),l=en[1],f=en[2],a=en[3],tf(s,c,u,o,h,en),c=en[1],u=en[2],o=en[3]),n.bezierCurveTo(l,c,f,u,a,o)))},t.prototype.pointAt=function(n){return Q_(this.shape,n,!1)},t.prototype.tangentAt=function(n){var i=Q_(this.shape,n,!0);return tC(i,i)},t}(ke);UP.prototype.type="bezier-curve";var OP=function(){function e(){this.cx=0,this.cy=0,this.r=0,this.startAngle=0,this.endAngle=Math.PI*2,this.clockwise=!0}return e}(),BP=function(e){ue(t,e);function t(n){return e.call(this,n)||this}return t.prototype.getDefaultStyle=function(){return{stroke:"#000",fill:null}},t.prototype.getDefaultShape=function(){return new OP},t.prototype.buildPath=function(n,i){var r=i.cx,s=i.cy,a=Math.max(i.r,0),o=i.startAngle,l=i.endAngle,c=i.clockwise,f=Math.cos(o),u=Math.sin(o);n.moveTo(f*a+r,u*a+s),n.arc(r,s,a,o,l,!c)},t}(ke);BP.prototype.type="arc";var MF=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.type="compound",n}return t.prototype._updatePathDirty=function(){for(var n=this.shape.paths,i=this.shapeChanged(),r=0;r<n.length;r++)i=i||n[r].shapeChanged();i&&this.dirtyShape()},t.prototype.beforeBrush=function(){this._updatePathDirty();for(var n=this.shape.paths||[],i=this.getGlobalScale(),r=0;r<n.length;r++)n[r].path||n[r].createPathProxy(),n[r].path.setScale(i[0],i[1],n[r].segmentIgnoreThreshold)},t.prototype.buildPath=function(n,i){for(var r=i.paths||[],s=0;s<r.length;s++)r[s].buildPath(n,r[s].shape,!0)},t.prototype.afterBrush=function(){for(var n=this.shape.paths||[],i=0;i<n.length;i++)n[i].pathUpdated()},t.prototype.getBoundingRect=function(){return this._updatePathDirty.call(this),ke.prototype.getBoundingRect.call(this)},t}(ke),Hy=function(){function e(t){this.colorStops=t||[]}return e.prototype.addColorStop=function(t,n){this.colorStops.push({offset:t,color:n})},e}(),bF=function(e){ue(t,e);function t(n,i,r,s,a,o){var l=e.call(this,a)||this;return l.x=n==null?0:n,l.y=i==null?0:i,l.x2=r==null?1:r,l.y2=s==null?0:s,l.type="linear",l.global=o||!1,l}return t}(Hy),TF=function(e){ue(t,e);function t(n,i,r,s,a){var o=e.call(this,s)||this;return o.x=n==null?.5:n,o.y=i==null?.5:i,o.r=r==null?.5:r,o.type="radial",o.global=a||!1,o}return t}(Hy),kh=Math.min,HP=Math.max,kl=Math.abs,ts=[0,0],es=[0,0],Le=sy(),Wl=Le.minTv,Xl=Le.maxTv,EF=function(){function e(t,n){this._corners=[],this._axes=[],this._origin=[0,0];for(var i=0;i<4;i++)this._corners[i]=new Te;for(var i=0;i<2;i++)this._axes[i]=new Te;t&&this.fromBoundingRect(t,n)}return e.prototype.fromBoundingRect=function(t,n){var i=this._corners,r=this._axes,s=t.x,a=t.y,o=s+t.width,l=a+t.height;if(i[0].set(s,a),i[1].set(o,a),i[2].set(o,l),i[3].set(s,l),n)for(var c=0;c<4;c++)i[c].transform(n);Te.sub(r[0],i[1],i[0]),Te.sub(r[1],i[3],i[0]),r[0].normalize(),r[1].normalize();for(var c=0;c<2;c++)this._origin[c]=r[c].dot(i[0])},e.prototype.intersect=function(t,n,i){var r=!0,s=!n;return n&&Te.set(n,0,0),Le.reset(i,!s),!this._intersectCheckOneSide(this,t,s,1)&&(r=!1,s)||!this._intersectCheckOneSide(t,this,s,-1)&&(r=!1,s)||!s&&!Le.negativeSize&&Te.copy(n,r?Le.useDir?Le.dirMinTv:Wl:Xl),r},e.prototype._intersectCheckOneSide=function(t,n,i,r){for(var s=!0,a=0;a<2;a++){var o=t._axes[a];if(t._getProjMinMaxOnAxis(a,t._corners,ts),t._getProjMinMaxOnAxis(a,n._corners,es),Le.negativeSize||ts[1]<es[0]||ts[0]>es[1]){if(s=!1,Le.negativeSize||i)return s;var l=kl(es[0]-ts[1]),c=kl(ts[0]-es[1]);kh(l,c)>Xl.len()&&(l<c?Te.scale(Xl,o,-l*r):Te.scale(Xl,o,c*r))}else if(!i){var l=kl(es[0]-ts[1]),c=kl(ts[0]-es[1]);(Le.useDir||kh(l,c)<Wl.len())&&((l<c||!Le.bidirectional)&&(Te.scale(Wl,o,l*r),Le.useDir&&Le.calcDirMTV()),(l>=c||!Le.bidirectional)&&(Te.scale(Wl,o,-c*r),Le.useDir&&Le.calcDirMTV()))}}return s},e.prototype._getProjMinMaxOnAxis=function(t,n,i){for(var r=this._axes[t],s=this._origin,a=n[0].dot(r)+s[t],o=a,l=a,c=1;c<n.length;c++){var f=n[c].dot(r)+s[t];o=kh(f,o),l=HP(f,l)}i[0]=o+Le.touchThreshold,i[1]=l-Le.touchThreshold,Le.negativeSize=i[1]<i[0]},e}(),zP=[],wF=function(e){ue(t,e);function t(){var n=e!==null&&e.apply(this,arguments)||this;return n.notClear=!0,n.incremental=!0,n._displayables=[],n._temporaryDisplayables=[],n._cursor=0,n}return t.prototype.traverse=function(n,i){n.call(i,this)},t.prototype.useStyle=function(){this.style={}},t.prototype.getCursor=function(){return this._cursor},t.prototype.innerAfterBrush=function(){this._cursor=this._displayables.length},t.prototype.clearDisplaybles=function(){this._displayables=[],this._temporaryDisplayables=[],this._cursor=0,this.markRedraw(),this.notClear=!1},t.prototype.clearTemporalDisplayables=function(){this._temporaryDisplayables=[]},t.prototype.addDisplayable=function(n,i){i?this._temporaryDisplayables.push(n):this._displayables.push(n),this.markRedraw()},t.prototype.addDisplayables=function(n,i){i=i||!1;for(var r=0;r<n.length;r++)this.addDisplayable(n[r],i)},t.prototype.getDisplayables=function(){return this._displayables},t.prototype.getTemporalDisplayables=function(){return this._temporaryDisplayables},t.prototype.eachPendingDisplayable=function(n){for(var i=this._cursor;i<this._displayables.length;i++)n&&n(this._displayables[i]);for(var i=0;i<this._temporaryDisplayables.length;i++)n&&n(this._temporaryDisplayables[i])},t.prototype.update=function(){this.updateTransform();for(var n=this._cursor;n<this._displayables.length;n++){var i=this._displayables[n];i.parent=this,i.update(),i.parent=null}for(var n=0;n<this._temporaryDisplayables.length;n++){var i=this._temporaryDisplayables[n];i.parent=this,i.update(),i.parent=null}},t.prototype.getBoundingRect=function(){if(!this._rect){for(var n=new ce(1/0,1/0,-1/0,-1/0),i=0;i<this._displayables.length;i++){var r=this._displayables[i],s=r.getBoundingRect().clone();r.needLocalTransform()&&s.applyTransform(r.getLocalTransform(zP)),n.union(s)}this._rect=n}return this._rect},t.prototype.contain=function(n,i){var r=this.transformCoordToLocal(n,i),s=this.getBoundingRect();if(s.contain(r[0],r[1]))for(var a=0;a<this._displayables.length;a++){var o=this._displayables[a];if(o.contain(n,i))return!0}return!1},t}(hl),VP=Math.round(Math.random()*9),GP=typeof Object.defineProperty=="function",AF=function(){function e(){this._id="__ec_inner_"+VP++}return e.prototype.get=function(t){return this._guard(t)[this._id]},e.prototype.set=function(t,n){var i=this._guard(t);return GP?Object.defineProperty(i,this._id,{value:n,enumerable:!1,configurable:!0}):i[this._id]=n,this},e.prototype.delete=function(t){return this.has(t)?(delete this._guard(t)[this._id],!0):!1},e.prototype.has=function(t){return!!this._guard(t)[this._id]},e.prototype._guard=function(t){if(t!==Object(t))throw TypeError("Value of WeakMap is not a non-null object.");return t},e}();function ms(e){return isFinite(e)}function kP(e,t,n){var i=t.x==null?0:t.x,r=t.x2==null?1:t.x2,s=t.y==null?0:t.y,a=t.y2==null?0:t.y2;t.global||(i=i*n.width+n.x,r=r*n.width+n.x,s=s*n.height+n.y,a=a*n.height+n.y),i=ms(i)?i:0,r=ms(r)?r:1,s=ms(s)?s:0,a=ms(a)?a:0;var o=e.createLinearGradient(i,s,r,a);return o}function WP(e,t,n){var i=n.width,r=n.height,s=Math.min(i,r),a=t.x==null?.5:t.x,o=t.y==null?.5:t.y,l=t.r==null?.5:t.r;t.global||(a=a*i+n.x,o=o*r+n.y,l=l*s),a=ms(a)?a:.5,o=ms(o)?o:.5,l=l>=0&&ms(l)?l:.5;var c=e.createRadialGradient(a,o,0,a,o,l);return c}function up(e,t,n){for(var i=t.type==="radial"?WP(e,t,n):kP(e,t,n),r=t.colorStops,s=0;s<r.length;s++)i.addColorStop(r[s].offset,r[s].color);return i}function XP(e,t){if(e===t||!e&&!t)return!1;if(!e||!t||e.length!==t.length)return!0;for(var n=0;n<e.length;n++)if(e[n]!==t[n])return!0;return!1}function ql(e){return parseInt(e,10)}function Yl(e,t,n){var i=["width","height"][t],r=["clientWidth","clientHeight"][t],s=["paddingLeft","paddingTop"][t],a=["paddingRight","paddingBottom"][t];if(n[i]!=null&&n[i]!=="auto")return parseFloat(n[i]);var o=document.defaultView.getComputedStyle(e);return(e[r]||ql(o[i])||ql(e.style[i]))-(ql(o[s])||0)-(ql(o[a])||0)|0}function qP(e,t){return!e||e==="solid"||!(t>0)?null:e==="dashed"?[4*t,2*t]:e==="dotted"?[t]:bc(e)?[e]:Jo(e)?e:null}function zy(e){var t=e.style,n=t.lineDash&&t.lineWidth>0&&qP(t.lineDash,t.lineWidth),i=t.lineDashOffset;if(n){var r=t.strokeNoScale&&e.getLineScale?e.getLineScale():1;r&&r!==1&&(n=wa(n,function(s){return s/r}),i/=r)}return[n,i]}var YP=new Ca(!0);function af(e){var t=e.stroke;return!(t==null||t==="none"||!(e.lineWidth>0))}function tg(e){return typeof e=="string"&&e!=="none"}function of(e){var t=e.fill;return t!=null&&t!=="none"}function eg(e,t){if(t.fillOpacity!=null&&t.fillOpacity!==1){var n=e.globalAlpha;e.globalAlpha=t.fillOpacity*t.opacity,e.fill(),e.globalAlpha=n}else e.fill()}function ng(e,t){if(t.strokeOpacity!=null&&t.strokeOpacity!==1){var n=e.globalAlpha;e.globalAlpha=t.strokeOpacity*t.opacity,e.stroke(),e.globalAlpha=n}else e.stroke()}function hp(e,t,n){var i=wy(t.image,t.__image,n);if(Eu(i)){var r=e.createPattern(i,t.repeat||"repeat");if(typeof DOMMatrix=="function"&&r&&r.setTransform){var s=new DOMMatrix;s.translateSelf(t.x||0,t.y||0),s.rotateSelf(0,0,(t.rotation||0)*KA),s.scaleSelf(t.scaleX||1,t.scaleY||1),r.setTransform(s)}return r}}function $P(e,t,n,i){var r,s=af(n),a=of(n),o=n.strokePercent,l=o<1,c=!t.path;(!t.silent||l)&&c&&t.createPathProxy();var f=t.path||YP,u=t.__dirty;if(!i){var h=n.fill,d=n.stroke,v=a&&!!h.colorStops,_=s&&!!d.colorStops,m=a&&!!h.image,p=s&&!!d.image,x=void 0,b=void 0,S=void 0,T=void 0,E=void 0;(v||_)&&(E=t.getBoundingRect()),v&&(x=u?up(e,h,E):t.__canvasFillGradient,t.__canvasFillGradient=x),_&&(b=u?up(e,d,E):t.__canvasStrokeGradient,t.__canvasStrokeGradient=b),m&&(S=u||!t.__canvasFillPattern?hp(e,h,t):t.__canvasFillPattern,t.__canvasFillPattern=S),p&&(T=u||!t.__canvasStrokePattern?hp(e,d,t):t.__canvasStrokePattern,t.__canvasStrokePattern=T),v?e.fillStyle=x:m&&(S?e.fillStyle=S:a=!1),_?e.strokeStyle=b:p&&(T?e.strokeStyle=T:s=!1)}var C=t.getGlobalScale();f.setScale(C[0],C[1],t.segmentIgnoreThreshold);var R,g;e.setLineDash&&n.lineDash&&(r=zy(t),R=r[0],g=r[1]);var M=!0;(c||u&ra)&&(f.setDPR(e.dpr),l?f.setContext(null):(f.setContext(e),M=!1),f.reset(),t.buildPath(f,t.shape,i),f.toStatic(),t.pathUpdated()),M&&f.rebuildPath(e,l?o:1),R&&(e.setLineDash(R),e.lineDashOffset=g),i||(n.strokeFirst?(s&&ng(e,n),a&&eg(e,n)):(a&&eg(e,n),s&&ng(e,n))),R&&e.setLineDash([])}function KP(e,t,n){var i=t.__image=wy(n.image,t.__image,t,t.onload);if(!(!i||!Eu(i))){var r=n.x||0,s=n.y||0,a=t.getWidth(),o=t.getHeight(),l=i.width/i.height;if(a==null&&o!=null?a=o*l:o==null&&a!=null?o=a/l:a==null&&o==null&&(a=i.width,o=i.height),n.sWidth&&n.sHeight){var c=n.sx||0,f=n.sy||0;e.drawImage(i,c,f,n.sWidth,n.sHeight,r,s,a,o)}else if(n.sx&&n.sy){var c=n.sx,f=n.sy,u=a-c,h=o-f;e.drawImage(i,c,f,u,h,r,s,a,o)}else e.drawImage(i,r,s,a,o)}}function ZP(e,t,n){var i,r=n.text;if(r!=null&&(r+=""),r){e.font=n.font||Pr,e.textAlign=n.textAlign,e.textBaseline=n.textBaseline;var s=void 0,a=void 0;e.setLineDash&&n.lineDash&&(i=zy(t),s=i[0],a=i[1]),s&&(e.setLineDash(s),e.lineDashOffset=a),n.strokeFirst?(af(n)&&e.strokeText(r,n.x,n.y),of(n)&&e.fillText(r,n.x,n.y)):(of(n)&&e.fillText(r,n.x,n.y),af(n)&&e.strokeText(r,n.x,n.y)),s&&e.setLineDash([])}}var ig=["shadowBlur","shadowOffsetX","shadowOffsetY"],rg=[["lineCap","butt"],["lineJoin","miter"],["miterLimit",10]];function Vy(e,t,n,i,r){var s=!1;if(!i&&(n=n||{},t===n))return!1;if(i||t.opacity!==n.opacity){an(e,r),s=!0;var a=Math.max(Math.min(t.opacity,1),0);e.globalAlpha=isNaN(a)?bs.opacity:a}(i||t.blend!==n.blend)&&(s||(an(e,r),s=!0),e.globalCompositeOperation=t.blend||bs.blend);for(var o=0;o<ig.length;o++){var l=ig[o];(i||t[l]!==n[l])&&(s||(an(e,r),s=!0),e[l]=e.dpr*(t[l]||0))}return(i||t.shadowColor!==n.shadowColor)&&(s||(an(e,r),s=!0),e.shadowColor=t.shadowColor||bs.shadowColor),s}function sg(e,t,n,i,r){var s=nl(t,r.inHover),a=i?null:n&&nl(n,r.inHover)||{};if(s===a)return!1;var o=Vy(e,s,a,i,r);if((i||s.fill!==a.fill)&&(o||(an(e,r),o=!0),tg(s.fill)&&(e.fillStyle=s.fill)),(i||s.stroke!==a.stroke)&&(o||(an(e,r),o=!0),tg(s.stroke)&&(e.strokeStyle=s.stroke)),(i||s.opacity!==a.opacity)&&(o||(an(e,r),o=!0),e.globalAlpha=s.opacity==null?1:s.opacity),t.hasStroke()){var l=s.lineWidth,c=l/(s.strokeNoScale&&t.getLineScale?t.getLineScale():1);e.lineWidth!==c&&(o||(an(e,r),o=!0),e.lineWidth=c)}for(var f=0;f<rg.length;f++){var u=rg[f],h=u[0];(i||s[h]!==a[h])&&(o||(an(e,r),o=!0),e[h]=s[h]||u[1])}return o}function JP(e,t,n,i,r){return Vy(e,nl(t,r.inHover),n&&nl(n,r.inHover),i,r)}function Gy(e,t){var n=t.transform,i=e.dpr||1;n?e.setTransform(i*n[0],i*n[1],i*n[2],i*n[3],i*n[4],i*n[5]):e.setTransform(i,0,0,i,0,0)}function jP(e,t,n){for(var i=!1,r=0;r<e.length;r++){var s=e[r];i=i||s.isZeroArea(),Gy(t,s),t.beginPath(),s.buildPath(t,s.shape),t.clip()}n.allClipped=i}function QP(e,t){return e&&t?e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]:!(!e&&!t)}var ag=1,og=2,lg=3,cg=4;function t2(e){var t=of(e),n=af(e);return!(e.lineDash||!(+t^+n)||t&&typeof e.fill!="string"||n&&typeof e.stroke!="string"||e.strokePercent<1||e.strokeOpacity<1||e.fillOpacity<1)}function an(e,t){t.batchFill&&e.fill(),t.batchStroke&&e.stroke(),t.batchFill="",t.batchStroke=""}function nl(e,t){return t&&e.__hoverStyle||e.style}function e2(e,t){vs(e,t,{inHover:!1,viewWidth:0,viewHeight:0},!0)}function vs(e,t,n,i){var r=t.transform;if(!t.shouldBePainted(n.viewWidth,n.viewHeight,!1,!1)){t.__dirty&=~vn,t.__isRendered=!1;return}var s=t.__clipPaths,a=n.prevElClipPaths,o=!1,l=!1;if((!a||XP(s,a))&&(a&&a.length&&(an(e,n),e.restore(),l=o=!0,n.prevElClipPaths=null,n.allClipped=!1,n.prevEl=null),s&&s.length&&(an(e,n),e.save(),jP(s,e,n),o=!0),n.prevElClipPaths=s),n.allClipped){t.__isRendered=!1;return}t.beforeBrush&&t.beforeBrush(),t.innerBeforeBrush();var c=n.prevEl;c||(l=o=!0);var f=t instanceof ke&&t.autoBatch&&t2(t.style);o||QP(r,c.transform)?(an(e,n),Gy(e,t)):f||an(e,n);var u=nl(t,n.inHover);t instanceof ke?(n.lastDrawType!==ag&&(l=!0,n.lastDrawType=ag),sg(e,t,c,l,n),(!f||!n.batchFill&&!n.batchStroke)&&e.beginPath(),$P(e,t,u,f),f&&(n.batchFill=u.fill||"",n.batchStroke=u.stroke||"")):t instanceof sf?(n.lastDrawType!==lg&&(l=!0,n.lastDrawType=lg),sg(e,t,c,l,n),ZP(e,t,u)):t instanceof rm?(n.lastDrawType!==og&&(l=!0,n.lastDrawType=og),JP(e,t,c,l,n),KP(e,t,u)):t.getTemporalDisplayables&&(n.lastDrawType!==cg&&(l=!0,n.lastDrawType=cg),n2(e,t,n)),f&&i&&an(e,n),t.innerAfterBrush(),t.afterBrush&&t.afterBrush(),n.prevEl=t,t.__dirty=0,t.__isRendered=!0}function n2(e,t,n){var i=t.getDisplayables(),r=t.getTemporalDisplayables();e.save();var s={prevElClipPaths:null,prevEl:null,allClipped:!1,viewWidth:n.viewWidth,viewHeight:n.viewHeight,inHover:n.inHover},a,o;for(a=t.getCursor(),o=i.length;a<o;a++){var l=i[a];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),vs(e,l,s,a===o-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),s.prevEl=l}for(var c=0,f=r.length;c<f;c++){var l=r[c];l.beforeBrush&&l.beforeBrush(),l.innerBeforeBrush(),vs(e,l,s,c===f-1),l.innerAfterBrush(),l.afterBrush&&l.afterBrush(),s.prevEl=l}t.clearTemporalDisplayables(),t.notClear=!0,e.restore()}function fg(e,t,n){var i=As.createCanvas(),r=t.getWidth(),s=t.getHeight(),a=i.style;return a&&(a.position="absolute",a.left="0",a.top="0",a.width=r+"px",a.height=s+"px",i.setAttribute("data-zr-dom-id",e)),i.width=r*n,i.height=s*n,i}var Wh=function(e){ue(t,e);function t(n,i,r){var s=e.call(this)||this;s.motionBlur=!1,s.lastFrameAlpha=.7,s.dpr=1,s.virtual=!1,s.config={},s.incremental=!1,s.zlevel=0,s.maxRepaintRectCount=5,s.__dirty=!0,s.__firstTimePaint=!0,s.__used=!1,s.__drawIndex=0,s.__startIndex=0,s.__endIndex=0,s.__prevStartIndex=null,s.__prevEndIndex=null;var a;r=r||rf,typeof n=="string"?a=fg(n,i,r):yr(n)&&(a=n,n=a.id),s.id=n,s.dom=a;var o=a.style;return o&&(ny(a),a.onselectstart=function(){return!1},o.padding="0",o.margin="0",o.borderWidth="0"),s.painter=i,s.dpr=r,s}return t.prototype.getElementCount=function(){return this.__endIndex-this.__startIndex},t.prototype.afterBrush=function(){this.__prevStartIndex=this.__startIndex,this.__prevEndIndex=this.__endIndex},t.prototype.initContext=function(){this.ctx=this.dom.getContext("2d"),this.ctx.dpr=this.dpr},t.prototype.setUnpainted=function(){this.__firstTimePaint=!0},t.prototype.createBackBuffer=function(){var n=this.dpr;this.domBack=fg("back-"+this.id,this.painter,n),this.ctxBack=this.domBack.getContext("2d"),n!==1&&this.ctxBack.scale(n,n)},t.prototype.createRepaintRects=function(n,i,r,s){if(this.__firstTimePaint)return this.__firstTimePaint=!1,null;var a=[],o=this.maxRepaintRectCount,l=!1,c=new ce(0,0,0,0);function f(x){if(!(!x.isFinite()||x.isZero()))if(a.length===0){var b=new ce(0,0,0,0);b.copy(x),a.push(b)}else{for(var S=!1,T=1/0,E=0,C=0;C<a.length;++C){var R=a[C];if(R.intersect(x)){var g=new ce(0,0,0,0);g.copy(R),g.union(x),a[C]=g,S=!0;break}else if(l){c.copy(x),c.union(R);var M=x.width*x.height,P=R.width*R.height,I=c.width*c.height,N=I-M-P;N<T&&(T=N,E=C)}}if(l&&(a[E].union(x),S=!0),!S){var b=new ce(0,0,0,0);b.copy(x),a.push(b)}l||(l=a.length>=o)}}for(var u=this.__startIndex;u<this.__endIndex;++u){var h=n[u];if(h){var d=h.shouldBePainted(r,s,!0,!0),v=h.__isRendered&&(h.__dirty&vn||!d)?h.getPrevPaintRect():null;v&&f(v);var _=d&&(h.__dirty&vn||!h.__isRendered)?h.getPaintRect():null;_&&f(_)}}for(var u=this.__prevStartIndex;u<this.__prevEndIndex;++u){var h=i[u],d=h&&h.shouldBePainted(r,s,!0,!0);if(h&&(!d||!h.__zr)&&h.__isRendered){var v=h.getPrevPaintRect();v&&f(v)}}var m;do{m=!1;for(var u=0;u<a.length;){if(a[u].isZero()){a.splice(u,1);continue}for(var p=u+1;p<a.length;)a[u].intersect(a[p])?(m=!0,a[u].union(a[p]),a.splice(p,1)):p++;u++}}while(m);return this._paintRects=a,a},t.prototype.debugGetPaintRects=function(){return(this._paintRects||[]).slice()},t.prototype.resize=function(n,i){var r=this.dpr,s=this.dom,a=s.style,o=this.domBack;a&&(a.width=n+"px",a.height=i+"px"),s.width=n*r,s.height=i*r,o&&(o.width=n*r,o.height=i*r,r!==1&&this.ctxBack.scale(r,r))},t.prototype.clear=function(n,i,r){var s=this.dom,a=this.ctx,o=s.width,l=s.height;i=i||this.clearColor;var c=this.motionBlur&&!n,f=this.lastFrameAlpha,u=this.dpr,h=this;c&&(this.domBack||this.createBackBuffer(),this.ctxBack.globalCompositeOperation="copy",this.ctxBack.drawImage(s,0,0,o/u,l/u));var d=this.domBack;function v(_,m,p,x){if(a.clearRect(_,m,p,x),i&&i!=="transparent"){var b=void 0;if(Su(i)){var S=i.global||i.__width===p&&i.__height===x;b=S&&i.__canvasGradient||up(a,i,{x:0,y:0,width:p,height:x}),i.__canvasGradient=b,i.__width=p,i.__height=x}else kA(i)&&(i.scaleX=i.scaleX||u,i.scaleY=i.scaleY||u,b=hp(a,i,{dirty:function(){h.setUnpainted(),h.painter.refresh()}}));a.save(),a.fillStyle=b||i,a.fillRect(_,m,p,x),a.restore()}c&&(a.save(),a.globalAlpha=f,a.drawImage(d,_,m,p,x),a.restore())}!r||c?v(0,0,o,l):r.length&&ln(r,function(_){v(_.x*u,_.y*u,_.width*u,_.height*u)})},t}(Ua),ug=1e5,ns=314159,$l=.01,i2=.001;function r2(e){return e?e.__builtin__?!0:!(typeof e.resize!="function"||typeof e.refresh!="function"):!1}function s2(e,t){var n=document.createElement("div");return n.style.cssText=["position:relative","width:"+e+"px","height:"+t+"px","padding:0","margin:0","border-width:0"].join(";")+";",n}var CF=function(){function e(t,n,i,r){this.type="canvas",this._zlevelList=[],this._prevDisplayList=[],this._layers={},this._layerConfig={},this._needsManuallyCompositing=!1,this.type="canvas";var s=!t.nodeName||t.nodeName.toUpperCase()==="CANVAS";this._opts=i=_e({},i||{}),this.dpr=i.devicePixelRatio||rf,this._singleCanvas=s,this.root=t;var a=t.style;a&&(ny(t),t.innerHTML=""),this.storage=n;var o=this._zlevelList;this._prevDisplayList=[];var l=this._layers;if(s){var f=t,u=f.width,h=f.height;i.width!=null&&(u=i.width),i.height!=null&&(h=i.height),this.dpr=i.devicePixelRatio||1,f.width=u*this.dpr,f.height=h*this.dpr,this._width=u,this._height=h;var d=new Wh(f,this,this.dpr);d.__builtin__=!0,d.initContext(),l[ns]=d,d.zlevel=ns,o.push(ns),this._domRoot=t}else{this._width=Yl(t,0,i),this._height=Yl(t,1,i);var c=this._domRoot=s2(this._width,this._height);t.appendChild(c)}}return e.prototype.getType=function(){return"canvas"},e.prototype.isSingleCanvas=function(){return this._singleCanvas},e.prototype.getViewportRoot=function(){return this._domRoot},e.prototype.getViewportRootOffset=function(){var t=this.getViewportRoot();if(t)return{offsetLeft:t.offsetLeft||0,offsetTop:t.offsetTop||0}},e.prototype.refresh=function(t){var n=this.storage.getDisplayList(!0),i=this._prevDisplayList,r=this._zlevelList;this._redrawId=Math.random(),this._paintList(n,i,t,this._redrawId);for(var s=0;s<r.length;s++){var a=r[s],o=this._layers[a];if(!o.__builtin__&&o.refresh){var l=s===0?this._backgroundColor:null;o.refresh(l)}}return this._opts.useDirtyRect&&(this._prevDisplayList=n.slice()),this},e.prototype.refreshHover=function(){this._paintHoverList(this.storage.getDisplayList(!1))},e.prototype._paintHoverList=function(t){var n=t.length,i=this._hoverlayer;if(i&&i.clear(),!!n){for(var r={inHover:!0,viewWidth:this._width,viewHeight:this._height},s,a=0;a<n;a++){var o=t[a];o.__inHover&&(i||(i=this._hoverlayer=this.getLayer(ug)),s||(s=i.ctx,s.save()),vs(s,o,r,a===n-1))}s&&s.restore()}},e.prototype.getHoverLayer=function(){return this.getLayer(ug)},e.prototype.paintOne=function(t,n){e2(t,n)},e.prototype._paintList=function(t,n,i,r){if(this._redrawId===r){i=i||!1,this._updateLayerStatus(t);var s=this._doPaintList(t,n,i),a=s.finished,o=s.needsRefreshHover;if(this._needsManuallyCompositing&&this._compositeManually(),o&&this._paintHoverList(t),a)this.eachLayer(function(c){c.afterBrush&&c.afterBrush()});else{var l=this;jc(function(){l._paintList(t,n,i,r)})}}},e.prototype._compositeManually=function(){var t=this.getLayer(ns).ctx,n=this._domRoot.width,i=this._domRoot.height;t.clearRect(0,0,n,i),this.eachBuiltinLayer(function(r){r.virtual&&t.drawImage(r.dom,0,0,n,i)})},e.prototype._doPaintList=function(t,n,i){for(var r=this,s=[],a=this._opts.useDirtyRect,o=0;o<this._zlevelList.length;o++){var l=this._zlevelList[o],c=this._layers[l];c.__builtin__&&c!==this._hoverlayer&&(c.__dirty||i)&&s.push(c)}for(var f=!0,u=!1,h=function(_){var m=s[_],p=m.ctx,x=a&&m.createRepaintRects(t,n,d._width,d._height),b=i?m.__startIndex:m.__drawIndex,S=!i&&m.incremental&&Date.now,T=S&&Date.now(),E=m.zlevel===d._zlevelList[0]?d._backgroundColor:null;if(m.__startIndex===m.__endIndex)m.clear(!1,E,x);else if(b===m.__startIndex){var C=t[b];(!C.incremental||!C.notClear||i)&&m.clear(!1,E,x)}b===-1&&(console.error("For some unknown reason. drawIndex is -1"),b=m.__startIndex);var R,g=function(N){var O={inHover:!1,allClipped:!1,prevEl:null,viewWidth:r._width,viewHeight:r._height};for(R=b;R<m.__endIndex;R++){var q=t[R];if(q.__inHover&&(u=!0),r._doPaintEl(q,m,a,N,O,R===m.__endIndex-1),S){var V=Date.now()-T;if(V>15)break}}O.prevElClipPaths&&p.restore()};if(x)if(x.length===0)R=m.__endIndex;else for(var M=d.dpr,P=0;P<x.length;++P){var I=x[P];p.save(),p.beginPath(),p.rect(I.x*M,I.y*M,I.width*M,I.height*M),p.clip(),g(I),p.restore()}else p.save(),g(),p.restore();m.__drawIndex=R,m.__drawIndex<m.__endIndex&&(f=!1)},d=this,v=0;v<s.length;v++)h(v);return ge.wxa&&ln(this._layers,function(_){_&&_.ctx&&_.ctx.draw&&_.ctx.draw()}),{finished:f,needsRefreshHover:u}},e.prototype._doPaintEl=function(t,n,i,r,s,a){var o=n.ctx;if(i){var l=t.getPaintRect();(!r||l&&l.intersect(r))&&(vs(o,t,s,a),t.setPrevPaintRect(l))}else vs(o,t,s,a)},e.prototype.getLayer=function(t,n){this._singleCanvas&&!this._needsManuallyCompositing&&(t=ns);var i=this._layers[t];return i||(i=new Wh("zr_"+t,this,this.dpr),i.zlevel=t,i.__builtin__=!0,this._layerConfig[t]?co(i,this._layerConfig[t],!0):this._layerConfig[t-$l]&&co(i,this._layerConfig[t-$l],!0),n&&(i.virtual=n),this.insertLayer(t,i),i.initContext()),i},e.prototype.insertLayer=function(t,n){var i=this._layers,r=this._zlevelList,s=r.length,a=this._domRoot,o=null,l=-1;if(!i[t]&&r2(n)){if(s>0&&t>r[0]){for(l=0;l<s-1&&!(r[l]<t&&r[l+1]>t);l++);o=i[r[l]]}if(r.splice(l+1,0,t),i[t]=n,!n.virtual)if(o){var c=o.dom;c.nextSibling?a.insertBefore(n.dom,c.nextSibling):a.appendChild(n.dom)}else a.firstChild?a.insertBefore(n.dom,a.firstChild):a.appendChild(n.dom);n.painter||(n.painter=this)}},e.prototype.eachLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r];t.call(n,this._layers[s],s)}},e.prototype.eachBuiltinLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r],a=this._layers[s];a.__builtin__&&t.call(n,a,s)}},e.prototype.eachOtherLayer=function(t,n){for(var i=this._zlevelList,r=0;r<i.length;r++){var s=i[r],a=this._layers[s];a.__builtin__||t.call(n,a,s)}},e.prototype.getLayers=function(){return this._layers},e.prototype._updateLayerStatus=function(t){this.eachBuiltinLayer(function(u,h){u.__dirty=u.__used=!1});function n(u){s&&(s.__endIndex!==u&&(s.__dirty=!0),s.__endIndex=u)}if(this._singleCanvas)for(var i=1;i<t.length;i++){var r=t[i];if(r.zlevel!==t[i-1].zlevel||r.incremental){this._needsManuallyCompositing=!0;break}}var s=null,a=0,o,l;for(l=0;l<t.length;l++){var r=t[l],c=r.zlevel,f=void 0;o!==c&&(o=c,a=0),r.incremental?(f=this.getLayer(c+i2,this._needsManuallyCompositing),f.incremental=!0,a=1):f=this.getLayer(c+(a>0?$l:0),this._needsManuallyCompositing),f.__builtin__||tm("ZLevel "+c+" has been used by unkown layer "+f.id),f!==s&&(f.__used=!0,f.__startIndex!==l&&(f.__dirty=!0),f.__startIndex=l,f.incremental?f.__drawIndex=-1:f.__drawIndex=l,n(l),s=f),r.__dirty&vn&&!r.__inHover&&(f.__dirty=!0,f.incremental&&f.__drawIndex<0&&(f.__drawIndex=l))}n(l),this.eachBuiltinLayer(function(u,h){!u.__used&&u.getElementCount()>0&&(u.__dirty=!0,u.__startIndex=u.__endIndex=u.__drawIndex=0),u.__dirty&&u.__drawIndex<0&&(u.__drawIndex=u.__startIndex)})},e.prototype.clear=function(){return this.eachBuiltinLayer(this._clearLayer),this},e.prototype._clearLayer=function(t){t.clear()},e.prototype.setBackgroundColor=function(t){this._backgroundColor=t,ln(this._layers,function(n){n.setUnpainted()})},e.prototype.configLayer=function(t,n){if(n){var i=this._layerConfig;i[t]?co(i[t],n,!0):i[t]=n;for(var r=0;r<this._zlevelList.length;r++){var s=this._zlevelList[r];if(s===t||s===t+$l){var a=this._layers[s];co(a,i[t],!0)}}}},e.prototype.delLayer=function(t){var n=this._layers,i=this._zlevelList,r=n[t];r&&(r.dom.parentNode.removeChild(r.dom),delete n[t],i.splice(di(i,t),1))},e.prototype.resize=function(t,n){if(this._domRoot.style){var i=this._domRoot;i.style.display="none";var r=this._opts,s=this.root;if(t!=null&&(r.width=t),n!=null&&(r.height=n),t=Yl(s,0,r),n=Yl(s,1,r),i.style.display="",this._width!==t||n!==this._height){i.style.width=t+"px",i.style.height=n+"px";for(var a in this._layers)this._layers.hasOwnProperty(a)&&this._layers[a].resize(t,n);this.refresh(!0)}this._width=t,this._height=n}else{if(t==null||n==null)return;this._width=t,this._height=n,this.getLayer(ns).resize(t,n)}return this},e.prototype.clearLayer=function(t){var n=this._layers[t];n&&n.clear()},e.prototype.dispose=function(){this.root.innerHTML="",this.root=this.storage=this._domRoot=this._layers=null},e.prototype.getRenderedCanvas=function(t){if(t=t||{},this._singleCanvas&&!this._compositeManually)return this._layers[ns].dom;var n=new Wh("image",this,t.pixelRatio||this.dpr);n.initContext(),n.clear(!1,t.backgroundColor||this._backgroundColor);var i=n.ctx;if(t.pixelRatio<=this.dpr){this.refresh();var r=n.dom.width,s=n.dom.height;this.eachLayer(function(u){u.__builtin__?i.drawImage(u.dom,0,0,r,s):u.renderToCanvas&&(i.save(),u.renderToCanvas(i),i.restore())})}else for(var a={inHover:!1,viewWidth:this._width,viewHeight:this._height},o=this.storage.getDisplayList(!0),l=0,c=o.length;l<c;l++){var f=o[l];vs(i,f,a,l===c-1)}return n.dom},e.prototype.getWidth=function(){return this._width},e.prototype.getHeight=function(){return this._height},e}();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Au="182",ky=0,dp=1,Wy=2,No=1,Xy=2,ua=3,er=0,je=1,mi=2,Mi=0,Ts=1,pp=2,mp=3,vp=4,qy=5,xr=100,Yy=101,$y=102,Ky=103,Zy=104,Jy=200,jy=201,Qy=202,tS=203,lf=204,cf=205,eS=206,nS=207,iS=208,rS=209,sS=210,aS=211,oS=212,lS=213,cS=214,ff=0,uf=1,hf=2,Cs=3,df=4,pf=5,mf=6,vf=7,sm=0,fS=1,uS=2,Yn=0,am=1,om=2,lm=3,cm=4,fm=5,um=6,hm=7,dm=300,Lr=301,Rs=302,_f=303,gf=304,dl=306,xf=1e3,vi=1001,yf=1002,De=1003,hS=1004,vo=1005,Ne=1006,Pc=1007,br=1008,_n=1009,pm=1010,mm=1011,Ra=1012,Cu=1013,ti=1014,kn=1015,Ei=1016,Ru=1017,Pu=1018,Pa=1020,vm=35902,_m=35899,gm=1021,xm=1022,Dn=1023,wi=1026,Tr=1027,ym=1028,Lu=1029,Ps=1030,Du=1031,Iu=1033,Fo=33776,Uo=33777,Oo=33778,Bo=33779,Sf=35840,Mf=35841,bf=35842,Tf=35843,Ef=36196,wf=37492,Af=37496,Cf=37488,Rf=37489,Pf=37490,Lf=37491,Df=37808,If=37809,Nf=37810,Ff=37811,Uf=37812,Of=37813,Bf=37814,Hf=37815,zf=37816,Vf=37817,Gf=37818,kf=37819,Wf=37820,Xf=37821,qf=36492,Yf=36494,$f=36495,Kf=36283,Zf=36284,Jf=36285,jf=36286,dS=3200,pS=0,mS=1,$i="",mn="srgb",Ls="srgb-linear",il="linear",ne="srgb",fs=7680,_p=519,vS=512,_S=513,gS=514,Nu=515,xS=516,yS=517,Fu=518,SS=519,gp=35044,xp="300 es",Wn=2e3,rl=2001;function MS(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Qf(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function bS(){const e=Qf("canvas");return e.style.display="block",e}const hg={};function yp(...e){const t="THREE."+e.shift();console.log(t,...e)}function Vt(...e){const t="THREE."+e.shift();console.warn(t,...e)}function Qt(...e){const t="THREE."+e.shift();console.error(t,...e)}function La(...e){const t=e.join(" ");t in hg||(hg[t]=!0,Vt(...e))}function a2(e,t,n){return new Promise(function(i,r){function s(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:r();break;case e.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}class Is{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){const i=this._listeners;if(i===void 0)return;const r=i[t];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const n=this._listeners;if(n===void 0)return;const i=n[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xh=Math.PI/180,Sp=180/Math.PI;function pl(){const e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ue[e&255]+Ue[e>>8&255]+Ue[e>>16&255]+Ue[e>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[n&63|128]+Ue[n>>8&255]+"-"+Ue[n>>16&255]+Ue[n>>24&255]+Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]).toLowerCase()}function Zt(e,t,n){return Math.max(t,Math.min(n,e))}function o2(e,t){return(e%t+t)%t}function qh(e,t,n){return(1-n)*e+n*t}function ja(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function nn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}class oe{constructor(t=0,n=0){oe.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const n=this.x,i=this.y,r=t.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(t)/n;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*r+t.x,this.y=s*r+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Oa{constructor(t=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=r}static slerpFlat(t,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],f=i[r+2],u=i[r+3],h=s[a+0],d=s[a+1],v=s[a+2],_=s[a+3];if(o<=0){t[n+0]=l,t[n+1]=c,t[n+2]=f,t[n+3]=u;return}if(o>=1){t[n+0]=h,t[n+1]=d,t[n+2]=v,t[n+3]=_;return}if(u!==_||l!==h||c!==d||f!==v){let m=l*h+c*d+f*v+u*_;m<0&&(h=-h,d=-d,v=-v,_=-_,m=-m);let p=1-o;if(m<.9995){const x=Math.acos(m),b=Math.sin(x);p=Math.sin(p*x)/b,o=Math.sin(o*x)/b,l=l*p+h*o,c=c*p+d*o,f=f*p+v*o,u=u*p+_*o}else{l=l*p+h*o,c=c*p+d*o,f=f*p+v*o,u=u*p+_*o;const x=1/Math.sqrt(l*l+c*c+f*f+u*u);l*=x,c*=x,f*=x,u*=x}}t[n]=l,t[n+1]=c,t[n+2]=f,t[n+3]=u}static multiplyQuaternionsFlat(t,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],f=i[r+3],u=s[a],h=s[a+1],d=s[a+2],v=s[a+3];return t[n]=o*v+f*u+l*d-c*h,t[n+1]=l*v+f*h+c*u-o*d,t[n+2]=c*v+f*d+o*h-l*u,t[n+3]=f*v-o*u-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,r){return this._x=t,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){const i=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(r/2),u=o(s/2),h=l(i/2),d=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=h*f*u+c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u-h*d*v;break;case"YXZ":this._x=h*f*u+c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u+h*d*v;break;case"ZXY":this._x=h*f*u-c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u-h*d*v;break;case"ZYX":this._x=h*f*u-c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u+h*d*v;break;case"YZX":this._x=h*f*u+c*d*v,this._y=c*d*u+h*f*v,this._z=c*f*v-h*d*u,this._w=c*f*u-h*d*v;break;case"XZY":this._x=h*f*u-c*d*v,this._y=c*d*u-h*f*v,this._z=c*f*v+h*d*u,this._w=c*f*u+h*d*v;break;default:Vt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){const i=n/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const n=t.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],f=n[6],u=n[10],h=i+o+u;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(f-l)*d,this._y=(s-c)*d,this._z=(a-r)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(f-l)/d,this._x=.25*d,this._y=(r+a)/d,this._z=(s+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(s-c)/d,this._x=(r+a)/d,this._y=.25*d,this._z=(l+f)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-r)/d,this._x=(s+c)/d,this._y=(l+f)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,n){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){const i=t._x,r=t._y,s=t._z,a=t._w,o=n._x,l=n._y,c=n._z,f=n._w;return this._x=i*f+a*o+r*c-s*l,this._y=r*f+a*l+s*o-i*c,this._z=s*f+a*c+i*l-r*o,this._w=a*f-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(t,n){if(n<=0)return this;if(n>=1)return this.copy(t);let i=t._x,r=t._y,s=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-n;if(o<.9995){const c=Math.acos(o),f=Math.sin(c);l=Math.sin(l*c)/f,n=Math.sin(n*c)/f,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this.normalize();return this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){const t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(n),s*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(t=0,n=0,i=0){$.prototype.isVector3=!0,this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(dg.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(dg.setFromAxisAngle(t,n))}applyMatrix3(t){const n=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const n=this.x,i=this.y,r=this.z,s=t.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(t){const n=this.x,i=this.y,r=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*r-o*i),f=2*(o*n-s*r),u=2*(s*i-a*n);return this.x=n+l*c+a*u-o*f,this.y=i+l*f+o*c-s*u,this.z=r+l*u+s*f-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const n=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this.z=Zt(this.z,t.z,n.z),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this.z=Zt(this.z,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){const i=t.x,r=t.y,s=t.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(t){const n=t.lengthSq();if(n===0)return this.set(0,0,0);const i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Yh.copy(this).projectOnVector(t),this.sub(Yh)}reflect(t){return this.sub(Yh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(t)/n;return Math.acos(Zt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const n=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return n*n+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){const r=Math.sin(n)*t;return this.x=r*Math.sin(i),this.y=Math.cos(n)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){const n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){const n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Yh=new $,dg=new Oa;class Xt{constructor(t,n,i,r,s,a,o,l,c){Xt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,r,s,a,o,l,c)}set(t,n,i,r,s,a,o,l,c){const f=this.elements;return f[0]=t,f[1]=r,f[2]=o,f[3]=n,f[4]=s,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){const i=t.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],u=i[7],h=i[2],d=i[5],v=i[8],_=r[0],m=r[3],p=r[6],x=r[1],b=r[4],S=r[7],T=r[2],E=r[5],C=r[8];return s[0]=a*_+o*x+l*T,s[3]=a*m+o*b+l*E,s[6]=a*p+o*S+l*C,s[1]=c*_+f*x+u*T,s[4]=c*m+f*b+u*E,s[7]=c*p+f*S+u*C,s[2]=h*_+d*x+v*T,s[5]=h*m+d*b+v*E,s[8]=h*p+d*S+v*C,this}multiplyScalar(t){const n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8];return n*a*f-n*o*c-i*s*f+i*o*l+r*s*c-r*a*l}invert(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=f*a-o*c,h=o*l-f*s,d=c*s-a*l,v=n*u+i*h+r*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/v;return t[0]=u*_,t[1]=(r*c-f*i)*_,t[2]=(o*i-r*a)*_,t[3]=h*_,t[4]=(f*n-r*l)*_,t[5]=(r*s-o*n)*_,t[6]=d*_,t[7]=(i*l-c*n)*_,t[8]=(a*n-i*s)*_,this}transpose(){let t;const n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(t,n){return this.premultiply($h.makeScale(t,n)),this}rotate(t){return this.premultiply($h.makeRotation(-t)),this}translate(t,n){return this.premultiply($h.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){const n=this.elements,i=t.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){const i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const $h=new Xt,pg=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mg=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function l2(){const e={enabled:!0,workingColorSpace:Ls,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ne&&(r.r=Zi(r.r),r.g=Zi(r.g),r.b=Zi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(r.r=ya(r.r),r.g=ya(r.g),r.b=ya(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===$i?il:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return La("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return La("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return e.define({[Ls]:{primaries:t,whitePoint:i,transfer:il,toXYZ:pg,fromXYZ:mg,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:t,whitePoint:i,transfer:ne,toXYZ:pg,fromXYZ:mg,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}}),e}const Jt=l2();function Zi(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function ya(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}let Ws;class TS{static getDataURL(t,n="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ws===void 0&&(Ws=Qf("canvas")),Ws.width=t.width,Ws.height=t.height;const r=Ws.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),i=Ws}return i.toDataURL(n)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){const n=Qf("canvas");n.width=t.width,n.height=t.height;const i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Zi(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(t.data){const n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Zi(n[i]/255)*255):n[i]=Zi(n[i]);return{data:n,width:t.width,height:t.height}}else return Vt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let c2=0;class Uu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:c2++}),this.uuid=pl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const n=this.data;return typeof HTMLVideoElement!="undefined"&&n instanceof HTMLVideoElement?t.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame!="undefined"&&n instanceof VideoFrame?t.set(n.displayHeight,n.displayWidth,0):n!==null?t.set(n.width,n.height,n.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Kh(r[a].image)):s.push(Kh(r[a]))}else s=Kh(r);i.url=s}return n||(t.images[this.uuid]=i),i}}function Kh(e){return typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap?TS.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Vt("Texture: Unable to serialize Texture."),{})}let f2=0;const Zh=new $;class Ge extends Is{constructor(t=Ge.DEFAULT_IMAGE,n=Ge.DEFAULT_MAPPING,i=vi,r=vi,s=Ne,a=br,o=Dn,l=_n,c=Ge.DEFAULT_ANISOTROPY,f=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:f2++}),this.uuid=pl(),this.name="",this.source=new Uu(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Zh).x}get height(){return this.source.getSize(Zh).y}get depth(){return this.source.getSize(Zh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const n in t){const i=t[n];if(i===void 0){Vt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Vt(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(t){const n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dm)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xf:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case yf:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xf:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case yf:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=dm;Ge.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,n=0,i=0,r=1){Se.prototype.isVector4=!0,this.x=t,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,r){return this.x=t,this.y=n,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const n=this.x,i=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,r,s;const l=t.elements,c=l[0],f=l[4],u=l[8],h=l[1],d=l[5],v=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(f-h)<.01&&Math.abs(u-_)<.01&&Math.abs(v-m)<.01){if(Math.abs(f+h)<.1&&Math.abs(u+_)<.1&&Math.abs(v+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const b=(c+1)/2,S=(d+1)/2,T=(p+1)/2,E=(f+h)/4,C=(u+_)/4,R=(v+m)/4;return b>S&&b>T?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=E/i,s=C/i):S>T?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=E/r,s=R/r):T<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),i=C/s,r=R/s),this.set(i,r,s,n),this}let x=Math.sqrt((m-v)*(m-v)+(u-_)*(u-_)+(h-f)*(h-f));return Math.abs(x)<.001&&(x=1),this.x=(m-v)/x,this.y=(u-_)/x,this.z=(h-f)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Zt(this.x,t.x,n.x),this.y=Zt(this.y,t.y,n.y),this.z=Zt(this.z,t.z,n.z),this.w=Zt(this.w,t.w,n.w),this}clampScalar(t,n){return this.x=Zt(this.x,t,n),this.y=Zt(this.y,t,n),this.z=Zt(this.z,t,n),this.w=Zt(this.w,t,n),this}clampLength(t,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Zt(i,t,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ES extends Is{constructor(t=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=i.depth,this.scissor=new Se(0,0,t,n),this.scissorTest=!1,this.viewport=new Se(0,0,t,n);const r={width:t,height:n,depth:i.depth},s=new Ge(r);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const n={minFilter:Ne,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(n.mapping=t.mapping),t.wrapS!==void 0&&(n.wrapS=t.wrapS),t.wrapT!==void 0&&(n.wrapT=t.wrapT),t.wrapR!==void 0&&(n.wrapR=t.wrapR),t.magFilter!==void 0&&(n.magFilter=t.magFilter),t.minFilter!==void 0&&(n.minFilter=t.minFilter),t.format!==void 0&&(n.format=t.format),t.type!==void 0&&(n.type=t.type),t.anisotropy!==void 0&&(n.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(n.colorSpace=t.colorSpace),t.flipY!==void 0&&(n.flipY=t.flipY),t.generateMipmaps!==void 0&&(n.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(n.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++){this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},t.textures[n].image);this.textures[n].source=new Uu(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $n extends ES{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}}class Sm extends Ge{constructor(t=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:r},this.magFilter=De,this.minFilter=De,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class wS extends Ge{constructor(t=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:r},this.magFilter=De,this.minFilter=De,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ba{constructor(t=new $(1/0,1/0,1/0),n=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Fn.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Fn.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){const i=Fn.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Fn):Fn.fromBufferAttribute(s,a),Fn.applyMatrix4(t.matrixWorld),this.expandByPoint(Fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Kl.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Kl.copy(i.boundingBox)),Kl.applyMatrix4(t.matrixWorld),this.union(Kl)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Fn),Fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qa),Zl.subVectors(this.max,Qa),Xs.subVectors(t.a,Qa),qs.subVectors(t.b,Qa),Ys.subVectors(t.c,Qa),ar.subVectors(qs,Xs),or.subVectors(Ys,qs),is.subVectors(Xs,Ys);let n=[0,-ar.z,ar.y,0,-or.z,or.y,0,-is.z,is.y,ar.z,0,-ar.x,or.z,0,-or.x,is.z,0,-is.x,-ar.y,ar.x,0,-or.y,or.x,0,-is.y,is.x,0];return!Jh(n,Xs,qs,Ys,Zl)||(n=[1,0,0,0,1,0,0,0,1],!Jh(n,Xs,qs,Ys,Zl))?!1:(Jl.crossVectors(ar,or),n=[Jl.x,Jl.y,Jl.z],Jh(n,Xs,qs,Ys,Zl))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Oi=[new $,new $,new $,new $,new $,new $,new $,new $],Fn=new $,Kl=new Ba,Xs=new $,qs=new $,Ys=new $,ar=new $,or=new $,is=new $,Qa=new $,Zl=new $,Jl=new $,rs=new $;function Jh(e,t,n,i,r){for(let s=0,a=e.length-3;s<=a;s+=3){rs.fromArray(e,s);const o=r.x*Math.abs(rs.x)+r.y*Math.abs(rs.y)+r.z*Math.abs(rs.z),l=t.dot(rs),c=n.dot(rs),f=i.dot(rs);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const u2=new Ba,to=new $,jh=new $;class Ou{constructor(t=new $,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){const i=this.center;n!==void 0?i.copy(n):u2.setFromPoints(t).getCenter(i);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){const i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;to.subVectors(t,this.center);const n=to.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(to,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(jh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(to.copy(t.center).add(jh)),this.expandByPoint(to.copy(t.center).sub(jh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Bi=new $,Qh=new $,jl=new $,lr=new $,td=new $,Ql=new $,ed=new $;class AS{constructor(t=new $,n=new $(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Bi)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const n=Bi.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(Bi.copy(this.origin).addScaledVector(this.direction,n),Bi.distanceToSquared(t))}distanceSqToSegment(t,n,i,r){Qh.copy(t).add(n).multiplyScalar(.5),jl.copy(n).sub(t).normalize(),lr.copy(this.origin).sub(Qh);const s=t.distanceTo(n)*.5,a=-this.direction.dot(jl),o=lr.dot(this.direction),l=-lr.dot(jl),c=lr.lengthSq(),f=Math.abs(1-a*a);let u,h,d,v;if(f>0)if(u=a*l-o,h=a*o-l,v=s*f,u>=0)if(h>=-v)if(h<=v){const _=1/f;u*=_,h*=_,d=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;else h<=-v?(u=Math.max(0,-(-a*s+o)),h=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+h*(h+2*l)+c):h<=v?(u=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(u=Math.max(0,-(a*s+o)),h=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+h*(h+2*l)+c);else h=a>0?-s:s,u=Math.max(0,-(a*h+o)),d=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Qh).addScaledVector(jl,h),d}intersectSphere(t,n){Bi.subVectors(t.center,this.origin);const i=Bi.dot(this.direction),r=Bi.dot(Bi)-i*i,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){const i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){const n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,r,s,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,r=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,r=(t.min.x-h.x)*c),f>=0?(s=(t.min.y-h.y)*f,a=(t.max.y-h.y)*f):(s=(t.max.y-h.y)*f,a=(t.min.y-h.y)*f),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(t.min.z-h.z)*u,l=(t.max.z-h.z)*u):(o=(t.max.z-h.z)*u,l=(t.min.z-h.z)*u),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(t){return this.intersectBox(t,Bi)!==null}intersectTriangle(t,n,i,r,s){td.subVectors(n,t),Ql.subVectors(i,t),ed.crossVectors(td,Ql);let a=this.direction.dot(ed),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;lr.subVectors(this.origin,t);const l=o*this.direction.dot(Ql.crossVectors(lr,Ql));if(l<0)return null;const c=o*this.direction.dot(td.cross(lr));if(c<0||l+c>a)return null;const f=-o*lr.dot(ed);return f<0?null:this.at(f/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m)}set(t,n,i,r,s,a,o,l,c,f,u,h,d,v,_,m){const p=this.elements;return p[0]=t,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=f,p[10]=u,p[14]=h,p[3]=d,p[7]=v,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){const n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){const n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return this.determinant()===0?(t.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const n=this.elements,i=t.elements,r=1/$s.setFromMatrixColumn(t,0).length(),s=1/$s.setFromMatrixColumn(t,1).length(),a=1/$s.setFromMatrixColumn(t,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){const n=this.elements,i=t.x,r=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),f=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=a*f,d=a*u,v=o*f,_=o*u;n[0]=l*f,n[4]=-l*u,n[8]=c,n[1]=d+v*c,n[5]=h-_*c,n[9]=-o*l,n[2]=_-h*c,n[6]=v+d*c,n[10]=a*l}else if(t.order==="YXZ"){const h=l*f,d=l*u,v=c*f,_=c*u;n[0]=h+_*o,n[4]=v*o-d,n[8]=a*c,n[1]=a*u,n[5]=a*f,n[9]=-o,n[2]=d*o-v,n[6]=_+h*o,n[10]=a*l}else if(t.order==="ZXY"){const h=l*f,d=l*u,v=c*f,_=c*u;n[0]=h-_*o,n[4]=-a*u,n[8]=v+d*o,n[1]=d+v*o,n[5]=a*f,n[9]=_-h*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(t.order==="ZYX"){const h=a*f,d=a*u,v=o*f,_=o*u;n[0]=l*f,n[4]=v*c-d,n[8]=h*c+_,n[1]=l*u,n[5]=_*c+h,n[9]=d*c-v,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(t.order==="YZX"){const h=a*l,d=a*c,v=o*l,_=o*c;n[0]=l*f,n[4]=_-h*u,n[8]=v*u+d,n[1]=u,n[5]=a*f,n[9]=-o*f,n[2]=-c*f,n[6]=d*u+v,n[10]=h-_*u}else if(t.order==="XZY"){const h=a*l,d=a*c,v=o*l,_=o*c;n[0]=l*f,n[4]=-u,n[8]=c*f,n[1]=h*u+_,n[5]=a*f,n[9]=d*u-v,n[2]=v*u-d,n[6]=o*f,n[10]=_*u+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose(h2,t,d2)}lookAt(t,n,i){const r=this.elements;return hn.subVectors(t,n),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),cr.crossVectors(i,hn),cr.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),cr.crossVectors(i,hn)),cr.normalize(),tc.crossVectors(hn,cr),r[0]=cr.x,r[4]=tc.x,r[8]=hn.x,r[1]=cr.y,r[5]=tc.y,r[9]=hn.y,r[2]=cr.z,r[6]=tc.z,r[10]=hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){const i=t.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],u=i[5],h=i[9],d=i[13],v=i[2],_=i[6],m=i[10],p=i[14],x=i[3],b=i[7],S=i[11],T=i[15],E=r[0],C=r[4],R=r[8],g=r[12],M=r[1],P=r[5],I=r[9],N=r[13],O=r[2],q=r[6],V=r[10],H=r[14],K=r[3],dt=r[7],ct=r[11],ht=r[15];return s[0]=a*E+o*M+l*O+c*K,s[4]=a*C+o*P+l*q+c*dt,s[8]=a*R+o*I+l*V+c*ct,s[12]=a*g+o*N+l*H+c*ht,s[1]=f*E+u*M+h*O+d*K,s[5]=f*C+u*P+h*q+d*dt,s[9]=f*R+u*I+h*V+d*ct,s[13]=f*g+u*N+h*H+d*ht,s[2]=v*E+_*M+m*O+p*K,s[6]=v*C+_*P+m*q+p*dt,s[10]=v*R+_*I+m*V+p*ct,s[14]=v*g+_*N+m*H+p*ht,s[3]=x*E+b*M+S*O+T*K,s[7]=x*C+b*P+S*q+T*dt,s[11]=x*R+b*I+S*V+T*ct,s[15]=x*g+b*N+S*H+T*ht,this}multiplyScalar(t){const n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){const t=this.elements,n=t[0],i=t[4],r=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],f=t[2],u=t[6],h=t[10],d=t[14],v=t[3],_=t[7],m=t[11],p=t[15],x=l*d-c*h,b=o*d-c*u,S=o*h-l*u,T=a*d-c*f,E=a*h-l*f,C=a*u-o*f;return n*(_*x-m*b+p*S)-i*(v*x-m*T+p*E)+r*(v*b-_*T+p*C)-s*(v*S-_*E+m*C)}transpose(){const t=this.elements;let n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=n,r[14]=i),this}invert(){const t=this.elements,n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],f=t[8],u=t[9],h=t[10],d=t[11],v=t[12],_=t[13],m=t[14],p=t[15],x=u*m*c-_*h*c+_*l*d-o*m*d-u*l*p+o*h*p,b=v*h*c-f*m*c-v*l*d+a*m*d+f*l*p-a*h*p,S=f*_*c-v*u*c+v*o*d-a*_*d-f*o*p+a*u*p,T=v*u*l-f*_*l-v*o*h+a*_*h+f*o*m-a*u*m,E=n*x+i*b+r*S+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/E;return t[0]=x*C,t[1]=(_*h*s-u*m*s-_*r*d+i*m*d+u*r*p-i*h*p)*C,t[2]=(o*m*s-_*l*s+_*r*c-i*m*c-o*r*p+i*l*p)*C,t[3]=(u*l*s-o*h*s-u*r*c+i*h*c+o*r*d-i*l*d)*C,t[4]=b*C,t[5]=(f*m*s-v*h*s+v*r*d-n*m*d-f*r*p+n*h*p)*C,t[6]=(v*l*s-a*m*s-v*r*c+n*m*c+a*r*p-n*l*p)*C,t[7]=(a*h*s-f*l*s+f*r*c-n*h*c-a*r*d+n*l*d)*C,t[8]=S*C,t[9]=(v*u*s-f*_*s-v*i*d+n*_*d+f*i*p-n*u*p)*C,t[10]=(a*_*s-v*o*s+v*i*c-n*_*c-a*i*p+n*o*p)*C,t[11]=(f*o*s-a*u*s-f*i*c+n*u*c+a*i*d-n*o*d)*C,t[12]=T*C,t[13]=(f*_*r-v*u*r+v*i*h-n*_*h-f*i*m+n*u*m)*C,t[14]=(v*o*r-a*_*r-v*i*l+n*_*l+a*i*m-n*o*m)*C,t[15]=(a*u*r-f*o*r+f*i*l-n*u*l-a*i*h+n*o*h)*C,this}scale(t){const n=this.elements,i=t.x,r=t.y,s=t.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){const n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){const n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,f=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,f*o+i,f*l-r*a,0,c*l-r*o,f*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,r,s,a){return this.set(1,i,s,0,t,1,a,0,n,r,1,0,0,0,0,1),this}compose(t,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,f=a+a,u=o+o,h=s*c,d=s*f,v=s*u,_=a*f,m=a*u,p=o*u,x=l*c,b=l*f,S=l*u,T=i.x,E=i.y,C=i.z;return r[0]=(1-(_+p))*T,r[1]=(d+S)*T,r[2]=(v-b)*T,r[3]=0,r[4]=(d-S)*E,r[5]=(1-(h+p))*E,r[6]=(m+x)*E,r[7]=0,r[8]=(v+b)*C,r[9]=(m-x)*C,r[10]=(1-(h+_))*C,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,n,i){const r=this.elements;if(t.x=r[12],t.y=r[13],t.z=r[14],this.determinant()===0)return i.set(1,1,1),n.identity(),this;let s=$s.set(r[0],r[1],r[2]).length();const a=$s.set(r[4],r[5],r[6]).length(),o=$s.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),Un.copy(this);const c=1/s,f=1/a,u=1/o;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=f,Un.elements[5]*=f,Un.elements[6]*=f,Un.elements[8]*=u,Un.elements[9]*=u,Un.elements[10]*=u,n.setFromRotationMatrix(Un),i.x=s,i.y=a,i.z=o,this}makePerspective(t,n,i,r,s,a,o=Wn,l=!1){const c=this.elements,f=2*s/(n-t),u=2*s/(i-r),h=(n+t)/(n-t),d=(i+r)/(i-r);let v,_;if(l)v=s/(a-s),_=a*s/(a-s);else if(o===Wn)v=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===rl)v=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,n,i,r,s,a,o=Wn,l=!1){const c=this.elements,f=2/(n-t),u=2/(i-r),h=-(n+t)/(n-t),d=-(i+r)/(i-r);let v,_;if(l)v=1/(a-s),_=a/(a-s);else if(o===Wn)v=-2/(a-s),_=-(a+s)/(a-s);else if(o===rl)v=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=f,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=v,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const n=this.elements,i=t.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){const i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}}const $s=new $,Un=new Ee,h2=new $(0,0,0),d2=new $(1,1,1),cr=new $,tc=new $,hn=new $,vg=new Ee,_g=new Oa;class Ai{constructor(t=0,n=0,i=0,r=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,r=this._order){return this._x=t,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],f=r[9],u=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-f,d),this._y=0);break;default:Vt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return vg.makeRotationFromQuaternion(t),this.setFromRotationMatrix(vg,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return _g.setFromEuler(this),this.setFromQuaternion(_g,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class Mm{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let p2=0;const gg=new $,Ks=new Oa,Hi=new Ee,ec=new $,eo=new $,m2=new $,v2=new Oa,xg=new $(1,0,0),yg=new $(0,1,0),Sg=new $(0,0,1),Mg={type:"added"},_2={type:"removed"},Zs={type:"childadded",child:null},nd={type:"childremoved",child:null};class cn extends Is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:p2++}),this.uuid=pl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const t=new $,n=new Ai,i=new Oa,r=new $(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ee},normalMatrix:{value:new Xt}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return Ks.setFromAxisAngle(t,n),this.quaternion.multiply(Ks),this}rotateOnWorldAxis(t,n){return Ks.setFromAxisAngle(t,n),this.quaternion.premultiply(Ks),this}rotateX(t){return this.rotateOnAxis(xg,t)}rotateY(t){return this.rotateOnAxis(yg,t)}rotateZ(t){return this.rotateOnAxis(Sg,t)}translateOnAxis(t,n){return gg.copy(t).applyQuaternion(this.quaternion),this.position.add(gg.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(xg,t)}translateY(t){return this.translateOnAxis(yg,t)}translateZ(t){return this.translateOnAxis(Sg,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?ec.copy(t):ec.set(t,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),eo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(eo,ec,this.up):Hi.lookAt(ec,eo,this.up),this.quaternion.setFromRotationMatrix(Hi),r&&(Hi.extractRotation(r.matrixWorld),Ks.setFromRotationMatrix(Hi),this.quaternion.premultiply(Ks.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(Qt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Mg),Zs.child=t,this.dispatchEvent(Zs),Zs.child=null):Qt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(_2),nd.child=t,this.dispatchEvent(nd),nd.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Mg),Zs.child=t,this.dispatchEvent(Zs),Zs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(t,n);if(a!==void 0)return a}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eo,t,m2),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eo,v2,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(t)}traverseAncestors(t){const n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>km(ku({},o),{boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>ku({},o)),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(t.animations,l))}}if(n){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),f=a(t.images),u=a(t.shapes),h=a(t.skeletons),d=a(t.animations),v=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}cn.DEFAULT_UP=new $(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new $,zi=new $,id=new $,Vi=new $,Js=new $,js=new $,bg=new $,rd=new $,sd=new $,ad=new $,od=new Se,ld=new Se,cd=new Se;class Pn{constructor(t=new $,n=new $,i=new $){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,r){r.subVectors(i,n),On.subVectors(t,n),r.cross(On);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,n,i,r,s){On.subVectors(r,n),zi.subVectors(i,n),id.subVectors(t,n);const a=On.dot(On),o=On.dot(zi),l=On.dot(id),c=zi.dot(zi),f=zi.dot(id),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const h=1/u,d=(c*l-o*f)*h,v=(a*f-o*l)*h;return s.set(1-d-v,v,d)}static containsPoint(t,n,i,r){return this.getBarycoord(t,n,i,r,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(t,n,i,r,s,a,o,l){return this.getBarycoord(t,n,i,r,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vi.x),l.addScaledVector(a,Vi.y),l.addScaledVector(o,Vi.z),l)}static getInterpolatedAttribute(t,n,i,r,s,a){return od.setScalar(0),ld.setScalar(0),cd.setScalar(0),od.fromBufferAttribute(t,n),ld.fromBufferAttribute(t,i),cd.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(od,s.x),a.addScaledVector(ld,s.y),a.addScaledVector(cd,s.z),a}static isFrontFacing(t,n,i,r){return On.subVectors(i,n),zi.subVectors(t,n),On.cross(zi).dot(r)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,r){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,n,i,r){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),On.cross(zi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Pn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return Pn.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,r,s){return Pn.getInterpolation(t,this.a,this.b,this.c,n,i,r,s)}containsPoint(t){return Pn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Pn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){const i=this.a,r=this.b,s=this.c;let a,o;Js.subVectors(r,i),js.subVectors(s,i),rd.subVectors(t,i);const l=Js.dot(rd),c=js.dot(rd);if(l<=0&&c<=0)return n.copy(i);sd.subVectors(t,r);const f=Js.dot(sd),u=js.dot(sd);if(f>=0&&u<=f)return n.copy(r);const h=l*u-f*c;if(h<=0&&l>=0&&f<=0)return a=l/(l-f),n.copy(i).addScaledVector(Js,a);ad.subVectors(t,s);const d=Js.dot(ad),v=js.dot(ad);if(v>=0&&d<=v)return n.copy(s);const _=d*c-l*v;if(_<=0&&c>=0&&v<=0)return o=c/(c-v),n.copy(i).addScaledVector(js,o);const m=f*v-d*u;if(m<=0&&u-f>=0&&d-v>=0)return bg.subVectors(s,r),o=(u-f)/(u-f+(d-v)),n.copy(r).addScaledVector(bg,o);const p=1/(m+_+h);return a=_*p,o=h*p,n.copy(i).addScaledVector(Js,a).addScaledVector(js,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const CS={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fr={h:0,s:0,l:0},nc={h:0,s:0,l:0};function fd(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}class ae{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=mn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Jt.colorSpaceToWorking(this,n),this}setRGB(t,n,i,r=Jt.workingColorSpace){return this.r=t,this.g=n,this.b=i,Jt.colorSpaceToWorking(this,r),this}setHSL(t,n,i,r=Jt.workingColorSpace){if(t=o2(t,1),n=Zt(n,0,1),i=Zt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=fd(a,s,t+1/3),this.g=fd(a,s,t),this.b=fd(a,s,t-1/3)}return Jt.colorSpaceToWorking(this,r),this}setStyle(t,n=mn){function i(s){s!==void 0&&parseFloat(s)<1&&Vt("Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Vt("Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);Vt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=mn){const i=CS[t.toLowerCase()];return i!==void 0?this.setHex(i,n):Vt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}copyLinearToSRGB(t){return this.r=ya(t.r),this.g=ya(t.g),this.b=ya(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mn){return Jt.workingToColorSpace(Oe.copy(this),t),Math.round(Zt(Oe.r*255,0,255))*65536+Math.round(Zt(Oe.g*255,0,255))*256+Math.round(Zt(Oe.b*255,0,255))}getHexString(t=mn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=Jt.workingColorSpace){Jt.workingToColorSpace(Oe.copy(this),n);const i=Oe.r,r=Oe.g,s=Oe.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=f<=.5?u/(a+o):u/(2-a-o),a){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=f,t}getRGB(t,n=Jt.workingColorSpace){return Jt.workingToColorSpace(Oe.copy(this),n),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=mn){Jt.workingToColorSpace(Oe.copy(this),t);const n=Oe.r,i=Oe.g,r=Oe.b;return t!==mn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,n,i){return this.getHSL(fr),this.setHSL(fr.h+t,fr.s+n,fr.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(fr),t.getHSL(nc);const i=qh(fr.h,nc.h,n),r=qh(fr.s,nc.s,n),s=qh(fr.l,nc.l,n);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const n=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new ae;ae.NAMES=CS;let g2=0;class ml extends Is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:g2++}),this.uuid=pl(),this.name="",this.type="Material",this.blending=Ts,this.side=er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lf,this.blendDst=cf,this.blendEquation=xr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=Cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_p,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const n in t){const i=t[n];if(i===void 0){Vt(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Vt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(t){const n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(i.blending=this.blending),this.side!==er&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==lf&&(i.blendSrc=this.blendSrc),this.blendDst!==cf&&(i.blendDst=this.blendDst),this.blendEquation!==xr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Cs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_p&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(t.textures),a=r(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const n=t.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class bm extends ml{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=sm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new $,ic=new oe;let x2=0;class Kn{constructor(t,n,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:x2++}),this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=gp,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=n.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ic.fromBufferAttribute(this,n),ic.applyMatrix3(t),this.setXY(n,ic.x,ic.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)we.fromBufferAttribute(this,n),we.applyMatrix3(t),this.setXYZ(n,we.x,we.y,we.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)we.fromBufferAttribute(this,n),we.applyMatrix4(t),this.setXYZ(n,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)we.fromBufferAttribute(this,n),we.applyNormalMatrix(t),this.setXYZ(n,we.x,we.y,we.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)we.fromBufferAttribute(this,n),we.transformDirection(t),this.setXYZ(n,we.x,we.y,we.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=ja(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=nn(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=ja(n,this.array)),n}setX(t,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=ja(n,this.array)),n}setY(t,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=ja(n,this.array)),n}setZ(t,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=ja(n,this.array)),n}setW(t,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,r){return t*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,n,i,r,s){return t*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array),s=nn(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gp&&(t.usage=this.usage),t}}class Tm extends Kn{constructor(t,n,i){super(new Uint16Array(t),n,i)}}class Em extends Kn{constructor(t,n,i){super(new Uint32Array(t),n,i)}}class bi extends Kn{constructor(t,n,i){super(new Float32Array(t),n,i)}}let y2=0;const bn=new Ee,ud=new cn,Qs=new $,dn=new Ba,no=new Ba,Pe=new $;class Pi extends Is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:y2++}),this.uuid=pl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(MS(t)?Em:Tm)(t,1):this.index=t,this}setIndirect(t,n=0){return this.indirect=t,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Xt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return bn.makeRotationFromQuaternion(t),this.applyMatrix4(bn),this}rotateX(t){return bn.makeRotationX(t),this.applyMatrix4(bn),this}rotateY(t){return bn.makeRotationY(t),this.applyMatrix4(bn),this}rotateZ(t){return bn.makeRotationZ(t),this.applyMatrix4(bn),this}translate(t,n,i){return bn.makeTranslation(t,n,i),this.applyMatrix4(bn),this}scale(t,n,i){return bn.makeScale(t,n,i),this.applyMatrix4(bn),this}lookAt(t){return ud.lookAt(t),ud.updateMatrix(),this.applyMatrix4(ud.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qs).negate(),this.translate(Qs.x,Qs.y,Qs.z),this}setFromPoints(t){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new bi(i,3))}else{const i=Math.min(t.length,n.count);for(let r=0;r<i;r++){const s=t[r];n.setXYZ(r,s.x,s.y,s.z||0)}t.length>n.count&&Vt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ba);const t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Qt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ou);const t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Qt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(t){const i=this.boundingSphere.center;if(dn.setFromBufferAttribute(t),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];no.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(dn.min,no.min),dn.expandByPoint(Pe),Pe.addVectors(dn.max,no.max),dn.expandByPoint(Pe)):(dn.expandByPoint(no.min),dn.expandByPoint(no.max))}dn.getCenter(i);let r=0;for(let s=0,a=t.count;s<a;s++)Pe.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(Pe));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)Pe.fromBufferAttribute(o,c),l&&(Qs.fromBufferAttribute(t,c),Pe.add(Qs)),r=Math.max(r,i.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Qt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Qt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new $,l[R]=new $;const c=new $,f=new $,u=new $,h=new oe,d=new oe,v=new oe,_=new $,m=new $;function p(R,g,M){c.fromBufferAttribute(i,R),f.fromBufferAttribute(i,g),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),d.fromBufferAttribute(s,g),v.fromBufferAttribute(s,M),f.sub(c),u.sub(c),d.sub(h),v.sub(h);const P=1/(d.x*v.y-v.x*d.y);isFinite(P)&&(_.copy(f).multiplyScalar(v.y).addScaledVector(u,-d.y).multiplyScalar(P),m.copy(u).multiplyScalar(d.x).addScaledVector(f,-v.x).multiplyScalar(P),o[R].add(_),o[g].add(_),o[M].add(_),l[R].add(m),l[g].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let R=0,g=x.length;R<g;++R){const M=x[R],P=M.start,I=M.count;for(let N=P,O=P+I;N<O;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const b=new $,S=new $,T=new $,E=new $;function C(R){T.fromBufferAttribute(r,R),E.copy(T);const g=o[R];b.copy(g),b.sub(T.multiplyScalar(T.dot(g))).normalize(),S.crossVectors(E,g);const P=S.dot(l[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,g=x.length;R<g;++R){const M=x[R],P=M.start,I=M.count;for(let N=P,O=P+I;N<O;N+=3)C(t.getX(N+0)),C(t.getX(N+1)),C(t.getX(N+2))}}computeVertexNormals(){const t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const r=new $,s=new $,a=new $,o=new $,l=new $,c=new $,f=new $,u=new $;if(t)for(let h=0,d=t.count;h<d;h+=3){const v=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),f.subVectors(a,s),u.subVectors(r,s),f.cross(u),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(f),l.add(f),c.add(f),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),f.subVectors(a,s),u.subVectors(r,s),f.cross(u),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)Pe.fromBufferAttribute(t,n),Pe.normalize(),t.setXYZ(n,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,f=o.itemSize,u=o.normalized,h=new c.constructor(l.length*f);let d=0,v=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*f;for(let p=0;p<f;p++)h[v++]=c[d++]}return new Kn(h,f,u)}if(this.index===null)return Vt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Pi,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=t(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let f=0,u=c.length;f<u;f++){const h=c[f],d=t(h,i);l.push(d)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let u=0,h=c.length;u<h;u++){const d=c[u];f.push(d.toJSON(t.data))}f.length>0&&(r[l]=f,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const r=t.attributes;for(const c in r){const f=r[c];this.setAttribute(c,f.clone(n))}const s=t.morphAttributes;for(const c in s){const f=[],u=s[c];for(let h=0,d=u.length;h<d;h++)f.push(u[h].clone(n));this.morphAttributes[c]=f}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,f=a.length;c<f;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Tg=new Ee,ss=new AS,rc=new Ou,Eg=new $,sc=new $,ac=new $,oc=new $,hd=new $,lc=new $,wg=new $,cc=new $;class Ci extends cn{constructor(t=new Pi,n=new bm){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){lc.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const f=o[l],u=s[l];f!==0&&(hd.fromBufferAttribute(u,t),a?lc.addScaledVector(hd,f):lc.addScaledVector(hd.sub(n),f))}n.add(lc)}return n}raycast(t,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),rc.copy(i.boundingSphere),rc.applyMatrix4(s),ss.copy(t.ray).recast(t.near),!(rc.containsPoint(ss.origin)===!1&&(ss.intersectSphere(rc,Eg)===null||ss.origin.distanceToSquared(Eg)>Gm(t.far-t.near,2)))&&(Tg.copy(s).invert(),ss.copy(t.ray).applyMatrix4(Tg),!(i.boundingBox!==null&&ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,ss)))}_computeIntersections(t,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,f=s.attributes.uv1,u=s.attributes.normal,h=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,_=h.length;v<_;v++){const m=h[v],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let S=x,T=b;S<T;S+=3){const E=o.getX(S),C=o.getX(S+1),R=o.getX(S+2);r=fc(this,p,t,i,c,f,u,E,C,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=v,p=_;m<p;m+=3){const x=o.getX(m),b=o.getX(m+1),S=o.getX(m+2);r=fc(this,a,t,i,c,f,u,x,b,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,_=h.length;v<_;v++){const m=h[v],p=a[m.materialIndex],x=Math.max(m.start,d.start),b=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let S=x,T=b;S<T;S+=3){const E=S,C=S+1,R=S+2;r=fc(this,p,t,i,c,f,u,E,C,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=v,p=_;m<p;m+=3){const x=m,b=m+1,S=m+2;r=fc(this,a,t,i,c,f,u,x,b,S),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function S2(e,t,n,i,r,s,a,o){let l;if(t.side===je?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,t.side===er,o),l===null)return null;cc.copy(o),cc.applyMatrix4(e.matrixWorld);const c=n.ray.origin.distanceTo(cc);return c<n.near||c>n.far?null:{distance:c,point:cc.clone(),object:e}}function fc(e,t,n,i,r,s,a,o,l,c){e.getVertexPosition(o,sc),e.getVertexPosition(l,ac),e.getVertexPosition(c,oc);const f=S2(e,t,n,i,sc,ac,oc,wg);if(f){const u=new $;Pn.getBarycoord(wg,sc,ac,oc,u),r&&(f.uv=Pn.getInterpolatedAttribute(r,o,l,c,u,new oe)),s&&(f.uv1=Pn.getInterpolatedAttribute(s,o,l,c,u,new oe)),a&&(f.normal=Pn.getInterpolatedAttribute(a,o,l,c,u,new $),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new $,materialIndex:0};Pn.getNormal(sc,ac,oc,h.normal),f.face=h,f.barycoord=u}return f}class Ha extends Pi{constructor(t=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],f=[],u=[];let h=0,d=0;v("z","y","x",-1,-1,i,n,t,a,s,0),v("z","y","x",1,-1,i,n,-t,a,s,1),v("x","z","y",1,1,t,i,n,r,a,2),v("x","z","y",1,-1,t,i,-n,r,a,3),v("x","y","z",1,-1,t,n,i,r,s,4),v("x","y","z",-1,-1,t,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new bi(c,3)),this.setAttribute("normal",new bi(f,3)),this.setAttribute("uv",new bi(u,2));function v(_,m,p,x,b,S,T,E,C,R,g){const M=S/C,P=T/R,I=S/2,N=T/2,O=E/2,q=C+1,V=R+1;let H=0,K=0;const dt=new $;for(let ct=0;ct<V;ct++){const ht=ct*P-N;for(let Rt=0;Rt<q;Rt++){const It=Rt*M-I;dt[_]=It*x,dt[m]=ht*b,dt[p]=O,c.push(dt.x,dt.y,dt.z),dt[_]=0,dt[m]=0,dt[p]=E>0?1:-1,f.push(dt.x,dt.y,dt.z),u.push(Rt/C),u.push(1-ct/R),H+=1}}for(let ct=0;ct<R;ct++)for(let ht=0;ht<C;ht++){const Rt=h+ht+q*ct,It=h+ht+q*(ct+1),qt=h+(ht+1)+q*(ct+1),Kt=h+(ht+1)+q*ct;l.push(Rt,It,Kt),l.push(It,qt,Kt),K+=6}o.addGroup(d,K,g),d+=K,h+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ha(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Da(e){const t={};for(const n in e){t[n]={};for(const i in e[n]){const r=e[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Vt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=r.clone():Array.isArray(r)?t[n][i]=r.slice():t[n][i]=r}}return t}function qe(e){const t={};for(let n=0;n<e.length;n++){const i=Da(e[n]);for(const r in i)t[r]=i[r]}return t}function M2(e){const t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function RS(e){const t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Jt.workingColorSpace}const PS={clone:Da,merge:qe};var b2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,T2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ei extends ml{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=b2,this.fragmentShader=T2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Da(t.uniforms),this.uniformsGroups=M2(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class wm extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,n){super.updateWorldMatrix(t,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ur=new $,Ag=new oe,Cg=new oe;class Rn extends wm{constructor(t=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const n=.5*this.getFilmHeight()/t;this.fov=Sp*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Xh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Sp*2*Math.atan(Math.tan(Xh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){ur.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ur.x,ur.y).multiplyScalar(-t/ur.z),ur.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ur.x,ur.y).multiplyScalar(-t/ur.z)}getViewSize(t,n){return this.getViewBounds(t,Ag,Cg),n.subVectors(Cg,Ag)}setViewOffset(t,n,i,r,s,a){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let n=t*Math.tan(Xh*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const ta=-90,ea=1;class LS extends cn{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Rn(ta,ea,t,n);r.layers=this.layers,this.add(r);const s=new Rn(ta,ea,t,n);s.layers=this.layers,this.add(s);const a=new Rn(ta,ea,t,n);a.layers=this.layers,this.add(a);const o=new Rn(ta,ea,t,n);o.layers=this.layers,this.add(o);const l=new Rn(ta,ea,t,n);l.layers=this.layers,this.add(l);const c=new Rn(ta,ea,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(t===Wn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===rl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,f]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(n,s),t.setRenderTarget(i,1,r),t.render(n,a),t.setRenderTarget(i,2,r),t.render(n,o),t.setRenderTarget(i,3,r),t.render(n,l),t.setRenderTarget(i,4,r),t.render(n,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,r),t.render(n,f),t.setRenderTarget(u,h,d),t.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Am extends Ge{constructor(t=[],n=Lr,i,r,s,a,o,l,c,f){super(t,n,i,r,s,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Cm extends $n{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new Am(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ha(5,5,5),s=new ei({name:"CubemapFromEquirect",uniforms:Da(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:je,blending:Mi});s.uniforms.tEquirect.value=n;const a=new Ci(r,s),o=n.minFilter;return n.minFilter===br&&(n.minFilter=Ne),new LS(1,10,this).update(t,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,n=!0,i=!0,r=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(n,i,r);t.setRenderTarget(s)}}class _o extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const E2={type:"move"};class Lc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _o,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _o,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _o,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const n=this._hand;if(n)for(const i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=n.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const f=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=f.position.distanceTo(u.position),d=.02,v=.005;c.inputState.pinching&&h>d+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=n.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(E2)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){const i=new _o;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}}class w2 extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class DS extends Ge{constructor(t=null,n=1,i=1,r,s,a,o,l,c=De,f=De,u,h){super(null,a,o,l,c,f,r,s,u,h),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const dd=new $,A2=new $,C2=new Xt;class gr{constructor(t=new $(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,r){return this.normal.set(t,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){const r=dd.subVectors(i,n).cross(A2.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n){const i=t.delta(dd),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){const i=n||C2.getNormalMatrix(t),r=this.coplanarPoint(dd).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const as=new Ou,R2=new oe(.5,.5),uc=new $;class Rm{constructor(t=new gr,n=new gr,i=new gr,r=new gr,s=new gr,a=new gr){this.planes=[t,n,i,r,s,a]}set(t,n,i,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Wn,i=!1){const r=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],f=s[4],u=s[5],h=s[6],d=s[7],v=s[8],_=s[9],m=s[10],p=s[11],x=s[12],b=s[13],S=s[14],T=s[15];if(r[0].setComponents(c-a,d-f,p-v,T-x).normalize(),r[1].setComponents(c+a,d+f,p+v,T+x).normalize(),r[2].setComponents(c+o,d+u,p+_,T+b).normalize(),r[3].setComponents(c-o,d-u,p-_,T-b).normalize(),i)r[4].setComponents(l,h,m,S).normalize(),r[5].setComponents(c-l,d-h,p-m,T-S).normalize();else if(r[4].setComponents(c-l,d-h,p-m,T-S).normalize(),n===Wn)r[5].setComponents(c+l,d+h,p+m,T+S).normalize();else if(n===rl)r[5].setComponents(l,h,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),as.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),as.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(as)}intersectsSprite(t){as.center.set(0,0,0);const n=R2.distanceTo(t.center);return as.radius=.7071067811865476+n,as.applyMatrix4(t.matrixWorld),this.intersectsSphere(as)}intersectsSphere(t){const n=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(uc.x=r.normal.x>0?t.max.x:t.min.x,uc.y=r.normal.y>0?t.max.y:t.min.y,uc.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(uc)<0)return!1}return!0}containsPoint(t){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ia extends Ge{constructor(t,n,i=ti,r,s,a,o=De,l=De,c,f=wi,u=1){if(f!==wi&&f!==Tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:n,depth:u};super(h,r,s,a,o,l,f,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Uu(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const n=super.toJSON(t);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class IS extends Ia{constructor(t,n=ti,i=Lr,r,s,a=De,o=De,l,c=wi){const f={width:t,height:t,depth:1},u=[f,f,f,f,f,f];super(t,t,n,i,r,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Pm extends Ge{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class vl extends Pi{constructor(t=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:r};const s=t/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,f=l+1,u=t/o,h=n/l,d=[],v=[],_=[],m=[];for(let p=0;p<f;p++){const x=p*h-a;for(let b=0;b<c;b++){const S=b*u-s;v.push(S,-x,0),_.push(0,0,1),m.push(b/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const b=x+c*p,S=x+c*(p+1),T=x+1+c*(p+1),E=x+1+c*p;d.push(b,S,E),d.push(S,T,E)}this.setIndex(d),this.setAttribute("position",new bi(v,3)),this.setAttribute("normal",new bi(_,3)),this.setAttribute("uv",new bi(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vl(t.width,t.height,t.widthSegments,t.heightSegments)}}class NS extends ei{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class FS extends ml{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class US extends ml{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Lm extends wm{constructor(t=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class OS extends Rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Rg(e,t,n,i){const r=P2(i);switch(n){case gm:return e*t;case ym:return e*t/r.components*r.byteLength;case Lu:return e*t/r.components*r.byteLength;case Ps:return e*t*2/r.components*r.byteLength;case Du:return e*t*2/r.components*r.byteLength;case xm:return e*t*3/r.components*r.byteLength;case Dn:return e*t*4/r.components*r.byteLength;case Iu:return e*t*4/r.components*r.byteLength;case Fo:case Uo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Oo:case Bo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Mf:case Tf:return Math.max(e,16)*Math.max(t,8)/4;case Sf:case bf:return Math.max(e,8)*Math.max(t,8)/2;case Ef:case wf:case Cf:case Rf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Af:case Pf:case Lf:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Df:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case If:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Nf:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ff:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Uf:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Of:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Bf:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Hf:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case zf:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Vf:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Gf:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case kf:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Wf:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Xf:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case qf:case Yf:case $f:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Kf:case Zf:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Jf:case jf:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function P2(e){switch(e){case _n:case pm:return{byteLength:1,components:1};case Ra:case mm:case Ei:return{byteLength:2,components:1};case Ru:case Pu:return{byteLength:2,components:4};case ti:case Cu:case kn:return{byteLength:4,components:1};case vm:case _m:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Au}}));typeof window!="undefined"&&(window.__THREE__?Vt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Au);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function BS(){let e=null,t=!1,n=null,i=null;function r(s,a){n(s,a),i=e.requestAnimationFrame(r)}return{start:function(){t!==!0&&n!==null&&(i=e.requestAnimationFrame(r),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){n=s},setContext:function(s){e=s}}}function L2(e){const t=new WeakMap;function n(o,l){const c=o.array,f=o.usage,u=c.byteLength,h=e.createBuffer();e.bindBuffer(l,h),e.bufferData(l,c,f),o.onUploadCallback();let d;if(c instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)d=e.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=e.HALF_FLOAT:d=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=e.SHORT;else if(c instanceof Uint32Array)d=e.UNSIGNED_INT;else if(c instanceof Int32Array)d=e.INT;else if(c instanceof Int8Array)d=e.BYTE;else if(c instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const f=l.array,u=l.updateRanges;if(e.bindBuffer(c,o),u.length===0)e.bufferSubData(c,0,f);else{u.sort((d,v)=>d.start-v.start);let h=0;for(let d=1;d<u.length;d++){const v=u[h],_=u[d];_.start<=v.start+v.count+1?v.count=Math.max(v.count,_.start+_.count-v.start):(++h,u[h]=_)}u.length=h+1;for(let d=0,v=u.length;d<v;d++){const _=u[d];e.bufferSubData(c,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=t.get(o);(!f||f.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var D2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,I2=`#ifdef USE_ALPHAHASH
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
#endif`,N2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,F2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,U2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,O2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,B2=`#ifdef USE_AOMAP
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
#endif`,H2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,z2=`#ifdef USE_BATCHING
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
#endif`,V2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,G2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,k2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,W2=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,X2=`#ifdef USE_IRIDESCENCE
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
#endif`,q2=`#ifdef USE_BUMPMAP
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
#endif`,Y2=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,K2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Z2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,J2=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,j2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Q2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,tL=`#if defined( USE_COLOR_ALPHA )
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
#endif`,eL=`#define PI 3.141592653589793
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
} // validated`,nL=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,iL=`vec3 transformedNormal = objectNormal;
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
#endif`,rL=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sL=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,aL=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,oL=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lL="gl_FragColor = linearToOutputTexel( gl_FragColor );",cL=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fL=`#ifdef USE_ENVMAP
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
#endif`,uL=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hL=`#ifdef USE_ENVMAP
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
#endif`,dL=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pL=`#ifdef USE_ENVMAP
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
#endif`,mL=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vL=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_L=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gL=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xL=`#ifdef USE_GRADIENTMAP
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
}`,yL=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,SL=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ML=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bL=`uniform bool receiveShadow;
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
#endif`,TL=`#ifdef USE_ENVMAP
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
#endif`,EL=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wL=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,AL=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,CL=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,RL=`PhysicalMaterial material;
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
#endif`,PL=`uniform sampler2D dfgLUT;
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
}`,LL=`
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
#endif`,DL=`#if defined( RE_IndirectDiffuse )
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
#endif`,IL=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,NL=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,FL=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,UL=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,OL=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,BL=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,HL=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zL=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,VL=`#if defined( USE_POINTS_UV )
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
#endif`,GL=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kL=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,WL=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,XL=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qL=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,YL=`#ifdef USE_MORPHTARGETS
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
#endif`,$L=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,KL=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ZL=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,JL=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jL=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,QL=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tD=`#ifdef USE_NORMALMAP
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
#endif`,eD=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nD=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,iD=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rD=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sD=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,aD=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,oD=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lD=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cD=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fD=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,uD=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hD=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dD=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pD=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mD=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vD=`float getShadowMask() {
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
}`,_D=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gD=`#ifdef USE_SKINNING
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
#endif`,xD=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yD=`#ifdef USE_SKINNING
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
#endif`,SD=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,MD=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bD=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,TD=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ED=`#ifdef USE_TRANSMISSION
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
#endif`,wD=`#ifdef USE_TRANSMISSION
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
#endif`,AD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RD=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,PD=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const LD=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,DD=`uniform sampler2D t2D;
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
}`,ID=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ND=`#ifdef ENVMAP_TYPE_CUBE
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
}`,FD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,UD=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OD=`#include <common>
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
}`,BD=`#if DEPTH_PACKING == 3200
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
}`,HD=`#define DISTANCE
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
}`,zD=`#define DISTANCE
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
}`,VD=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,GD=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kD=`uniform float scale;
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
}`,WD=`uniform vec3 diffuse;
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
}`,XD=`#include <common>
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
}`,qD=`uniform vec3 diffuse;
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
}`,YD=`#define LAMBERT
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
}`,$D=`#define LAMBERT
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
}`,KD=`#define MATCAP
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
}`,ZD=`#define MATCAP
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
}`,JD=`#define NORMAL
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
}`,jD=`#define NORMAL
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
}`,QD=`#define PHONG
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
}`,t3=`#define PHONG
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
}`,e3=`#define STANDARD
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
}`,n3=`#define STANDARD
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
}`,i3=`#define TOON
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
}`,r3=`#define TOON
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
}`,s3=`uniform float size;
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
}`,a3=`uniform vec3 diffuse;
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
}`,o3=`#include <common>
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
}`,l3=`uniform vec3 color;
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
}`,c3=`uniform float rotation;
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
}`,f3=`uniform vec3 diffuse;
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
}`,Yt={alphahash_fragment:D2,alphahash_pars_fragment:I2,alphamap_fragment:N2,alphamap_pars_fragment:F2,alphatest_fragment:U2,alphatest_pars_fragment:O2,aomap_fragment:B2,aomap_pars_fragment:H2,batching_pars_vertex:z2,batching_vertex:V2,begin_vertex:G2,beginnormal_vertex:k2,bsdfs:W2,iridescence_fragment:X2,bumpmap_pars_fragment:q2,clipping_planes_fragment:Y2,clipping_planes_pars_fragment:$2,clipping_planes_pars_vertex:K2,clipping_planes_vertex:Z2,color_fragment:J2,color_pars_fragment:j2,color_pars_vertex:Q2,color_vertex:tL,common:eL,cube_uv_reflection_fragment:nL,defaultnormal_vertex:iL,displacementmap_pars_vertex:rL,displacementmap_vertex:sL,emissivemap_fragment:aL,emissivemap_pars_fragment:oL,colorspace_fragment:lL,colorspace_pars_fragment:cL,envmap_fragment:fL,envmap_common_pars_fragment:uL,envmap_pars_fragment:hL,envmap_pars_vertex:dL,envmap_physical_pars_fragment:TL,envmap_vertex:pL,fog_vertex:mL,fog_pars_vertex:vL,fog_fragment:_L,fog_pars_fragment:gL,gradientmap_pars_fragment:xL,lightmap_pars_fragment:yL,lights_lambert_fragment:SL,lights_lambert_pars_fragment:ML,lights_pars_begin:bL,lights_toon_fragment:EL,lights_toon_pars_fragment:wL,lights_phong_fragment:AL,lights_phong_pars_fragment:CL,lights_physical_fragment:RL,lights_physical_pars_fragment:PL,lights_fragment_begin:LL,lights_fragment_maps:DL,lights_fragment_end:IL,logdepthbuf_fragment:NL,logdepthbuf_pars_fragment:FL,logdepthbuf_pars_vertex:UL,logdepthbuf_vertex:OL,map_fragment:BL,map_pars_fragment:HL,map_particle_fragment:zL,map_particle_pars_fragment:VL,metalnessmap_fragment:GL,metalnessmap_pars_fragment:kL,morphinstance_vertex:WL,morphcolor_vertex:XL,morphnormal_vertex:qL,morphtarget_pars_vertex:YL,morphtarget_vertex:$L,normal_fragment_begin:KL,normal_fragment_maps:ZL,normal_pars_fragment:JL,normal_pars_vertex:jL,normal_vertex:QL,normalmap_pars_fragment:tD,clearcoat_normal_fragment_begin:eD,clearcoat_normal_fragment_maps:nD,clearcoat_pars_fragment:iD,iridescence_pars_fragment:rD,opaque_fragment:sD,packing:aD,premultiplied_alpha_fragment:oD,project_vertex:lD,dithering_fragment:cD,dithering_pars_fragment:fD,roughnessmap_fragment:uD,roughnessmap_pars_fragment:hD,shadowmap_pars_fragment:dD,shadowmap_pars_vertex:pD,shadowmap_vertex:mD,shadowmask_pars_fragment:vD,skinbase_vertex:_D,skinning_pars_vertex:gD,skinning_vertex:xD,skinnormal_vertex:yD,specularmap_fragment:SD,specularmap_pars_fragment:MD,tonemapping_fragment:bD,tonemapping_pars_fragment:TD,transmission_fragment:ED,transmission_pars_fragment:wD,uv_pars_fragment:AD,uv_pars_vertex:CD,uv_vertex:RD,worldpos_vertex:PD,background_vert:LD,background_frag:DD,backgroundCube_vert:ID,backgroundCube_frag:ND,cube_vert:FD,cube_frag:UD,depth_vert:OD,depth_frag:BD,distance_vert:HD,distance_frag:zD,equirect_vert:VD,equirect_frag:GD,linedashed_vert:kD,linedashed_frag:WD,meshbasic_vert:XD,meshbasic_frag:qD,meshlambert_vert:YD,meshlambert_frag:$D,meshmatcap_vert:KD,meshmatcap_frag:ZD,meshnormal_vert:JD,meshnormal_frag:jD,meshphong_vert:QD,meshphong_frag:t3,meshphysical_vert:e3,meshphysical_frag:n3,meshtoon_vert:i3,meshtoon_frag:r3,points_vert:s3,points_frag:a3,shadow_vert:o3,shadow_frag:l3,sprite_vert:c3,sprite_frag:f3},St={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},Vn={basic:{uniforms:qe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:qe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ae(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:qe([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:qe([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:qe([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new ae(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:qe([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:qe([St.points,St.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:qe([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:qe([St.common,St.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:qe([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:qe([St.sprite,St.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distance:{uniforms:qe([St.common,St.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distance_vert,fragmentShader:Yt.distance_frag},shadow:{uniforms:qe([St.lights,St.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Vn.physical={uniforms:qe([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const hc={r:0,b:0,g:0},os=new Ai,u3=new Ee;function h3(e,t,n,i,r,s,a){const o=new ae(0);let l=s===!0?0:1,c,f,u=null,h=0,d=null;function v(b){let S=b.isScene===!0?b.background:null;return S&&S.isTexture&&(S=(b.backgroundBlurriness>0?n:t).get(S)),S}function _(b){let S=!1;const T=v(b);T===null?p(o,l):T&&T.isColor&&(p(T,1),S=!0);const E=e.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(e.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(b,S){const T=v(S);T&&(T.isCubeTexture||T.mapping===dl)?(f===void 0&&(f=new Ci(new Ha(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:Da(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(E,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),os.copy(S.backgroundRotation),os.x*=-1,os.y*=-1,os.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),f.material.uniforms.envMap.value=T,f.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(u3.makeRotationFromEuler(os)),f.material.toneMapped=Jt.getTransfer(T.colorSpace)!==ne,(u!==T||h!==T.version||d!==e.toneMapping)&&(f.material.needsUpdate=!0,u=T,h=T.version,d=e.toneMapping),f.layers.enableAll(),b.unshift(f,f.geometry,f.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Ci(new vl(2,2),new ei({name:"BackgroundMaterial",uniforms:Da(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:er,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Jt.getTransfer(T.colorSpace)!==ne,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||h!==T.version||d!==e.toneMapping)&&(c.material.needsUpdate=!0,u=T,h=T.version,d=e.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,S){b.getRGB(hc,RS(e)),i.buffers.color.setClear(hc.r,hc.g,hc.b,S,a)}function x(){f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,S=1){o.set(b),l=S,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(o,l)},render:_,addToRenderList:m,dispose:x}}function d3(e,t){const n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(M,P,I,N,O){let q=!1;const V=u(N,I,P);s!==V&&(s=V,c(s.object)),q=d(M,N,I,O),q&&v(M,N,I,O),O!==null&&t.update(O,e.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,S(M,P,I,N),O!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return e.createVertexArray()}function c(M){return e.bindVertexArray(M)}function f(M){return e.deleteVertexArray(M)}function u(M,P,I){const N=I.wireframe===!0;let O=i[M.id];O===void 0&&(O={},i[M.id]=O);let q=O[P.id];q===void 0&&(q={},O[P.id]=q);let V=q[N];return V===void 0&&(V=h(l()),q[N]=V),V}function h(M){const P=[],I=[],N=[];for(let O=0;O<n;O++)P[O]=0,I[O]=0,N[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:I,attributeDivisors:N,object:M,attributes:{},index:null}}function d(M,P,I,N){const O=s.attributes,q=P.attributes;let V=0;const H=I.getAttributes();for(const K in H)if(H[K].location>=0){const ct=O[K];let ht=q[K];if(ht===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(ht=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(ht=M.instanceColor)),ct===void 0||ct.attribute!==ht||ht&&ct.data!==ht.data)return!0;V++}return s.attributesNum!==V||s.index!==N}function v(M,P,I,N){const O={},q=P.attributes;let V=0;const H=I.getAttributes();for(const K in H)if(H[K].location>=0){let ct=q[K];ct===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(ct=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(ct=M.instanceColor));const ht={};ht.attribute=ct,ct&&ct.data&&(ht.data=ct.data),O[K]=ht,V++}s.attributes=O,s.attributesNum=V,s.index=N}function _(){const M=s.newAttributes;for(let P=0,I=M.length;P<I;P++)M[P]=0}function m(M){p(M,0)}function p(M,P){const I=s.newAttributes,N=s.enabledAttributes,O=s.attributeDivisors;I[M]=1,N[M]===0&&(e.enableVertexAttribArray(M),N[M]=1),O[M]!==P&&(e.vertexAttribDivisor(M,P),O[M]=P)}function x(){const M=s.newAttributes,P=s.enabledAttributes;for(let I=0,N=P.length;I<N;I++)P[I]!==M[I]&&(e.disableVertexAttribArray(I),P[I]=0)}function b(M,P,I,N,O,q,V){V===!0?e.vertexAttribIPointer(M,P,I,O,q):e.vertexAttribPointer(M,P,I,N,O,q)}function S(M,P,I,N){_();const O=N.attributes,q=I.getAttributes(),V=P.defaultAttributeValues;for(const H in q){const K=q[H];if(K.location>=0){let dt=O[H];if(dt===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(dt=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(dt=M.instanceColor)),dt!==void 0){const ct=dt.normalized,ht=dt.itemSize,Rt=t.get(dt);if(Rt===void 0)continue;const It=Rt.buffer,qt=Rt.type,Kt=Rt.bytesPerElement,Q=qt===e.INT||qt===e.UNSIGNED_INT||dt.gpuType===Cu;if(dt.isInterleavedBufferAttribute){const it=dt.data,Mt=it.stride,Ut=dt.offset;if(it.isInstancedInterleavedBuffer){for(let mt=0;mt<K.locationSize;mt++)p(K.location+mt,it.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let mt=0;mt<K.locationSize;mt++)m(K.location+mt);e.bindBuffer(e.ARRAY_BUFFER,It);for(let mt=0;mt<K.locationSize;mt++)b(K.location+mt,ht/K.locationSize,qt,ct,Mt*Kt,(Ut+ht/K.locationSize*mt)*Kt,Q)}else{if(dt.isInstancedBufferAttribute){for(let it=0;it<K.locationSize;it++)p(K.location+it,dt.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let it=0;it<K.locationSize;it++)m(K.location+it);e.bindBuffer(e.ARRAY_BUFFER,It);for(let it=0;it<K.locationSize;it++)b(K.location+it,ht/K.locationSize,qt,ct,ht*Kt,ht/K.locationSize*it*Kt,Q)}}else if(V!==void 0){const ct=V[H];if(ct!==void 0)switch(ct.length){case 2:e.vertexAttrib2fv(K.location,ct);break;case 3:e.vertexAttrib3fv(K.location,ct);break;case 4:e.vertexAttrib4fv(K.location,ct);break;default:e.vertexAttrib1fv(K.location,ct)}}}}x()}function T(){R();for(const M in i){const P=i[M];for(const I in P){const N=P[I];for(const O in N)f(N[O].object),delete N[O];delete P[I]}delete i[M]}}function E(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const I in P){const N=P[I];for(const O in N)f(N[O].object),delete N[O];delete P[I]}delete i[M.id]}function C(M){for(const P in i){const I=i[P];if(I[M.id]===void 0)continue;const N=I[M.id];for(const O in N)f(N[O].object),delete N[O];delete I[M.id]}}function R(){g(),a=!0,s!==r&&(s=r,c(s.object))}function g(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:g,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function p3(e,t,n){let i;function r(c){i=c}function s(c,f){e.drawArrays(i,c,f),n.update(f,i,1)}function a(c,f,u){u!==0&&(e.drawArraysInstanced(i,c,f,u),n.update(f,i,u))}function o(c,f,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,f,0,u);let d=0;for(let v=0;v<u;v++)d+=f[v];n.update(d,i,1)}function l(c,f,u,h){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let v=0;v<c.length;v++)a(c[v],f[v],h[v]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,f,0,h,0,u);let v=0;for(let _=0;_<u;_++)v+=f[_]*h[_];n.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function m3(e,t,n,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");r=e.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Dn&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const R=C===Ei&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==_n&&i.convert(C)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==kn&&!R)}function l(C){if(C==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const f=l(c);f!==c&&(Vt("WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const u=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),v=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),x=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),S=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=e.getParameter(e.MAX_SAMPLES),E=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:v,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:b,maxFragmentUniforms:S,maxSamples:T,samples:E}}function v3(e){const t=this;let n=null,i=0,r=!1,s=!1;const a=new gr,o=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const d=u.length!==0||h||i!==0||r;return r=h,i=u.length,d},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){n=f(u,h,0)},this.setState=function(u,h,d){const v=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=e.get(u);if(!r||v===null||v.length===0||s&&!m)s?f(null):c();else{const x=s?0:i,b=x*4;let S=p.clippingState||null;l.value=S,S=f(v,h,b,d);for(let T=0;T!==b;++T)S[T]=n[T];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function f(u,h,d,v){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,v!==!0||m===null){const p=d+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,S=d;b!==_;++b,S+=4)a.copy(u[b]).applyMatrix4(x,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function _3(e){let t=new WeakMap;function n(a,o){return o===_f?a.mapping=Lr:o===gf&&(a.mapping=Rs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===_f||o===gf)if(t.has(a)){const l=t.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Cm(l.height);return c.fromEquirectangularTexture(e,a),t.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const Er=4,Pg=[.125,.215,.35,.446,.526,.582],hs=20,g3=256,io=new Lm,Lg=new ae;let pd=null,md=0,vd=0,_d=!1;const x3=new $;class Mp{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,n=0,i=.1,r=100,s={}){const{size:a=256,position:o=x3}=s;pd=this._renderer.getRenderTarget(),md=this._renderer.getActiveCubeFace(),vd=this._renderer.getActiveMipmapLevel(),_d=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,r,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ng(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(pd,md,vd),this._renderer.xr.enabled=_d,t.scissorTest=!1,na(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Lr||t.mapping===Rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pd=this._renderer.getRenderTarget(),md=this._renderer.getActiveCubeFace(),vd=this._renderer.getActiveMipmapLevel(),_d=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Ei,format:Dn,colorSpace:Ls,depthBuffer:!1},r=Dg(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dg(t,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=y3(s)),this._blurMaterial=M3(s,t,n),this._ggxMaterial=S3(s,t,n)}return r}_compileMaterial(t){const n=new Ci(new Pi,t);this._renderer.compile(n,io)}_sceneToCubeUV(t,n,i,r,s){const l=new Rn(90,1,n,i),c=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(Lg),u.toneMapping=Yn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ci(new Ha,new bm({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,p=!0):(m.color.copy(Lg),p=!0);for(let b=0;b<6;b++){const S=b%3;S===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+f[b],s.y,s.z)):S===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+f[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+f[b]));const T=this._cubeSize;na(r,S*T,b>2?T:0,T,T),u.setRenderTarget(r),p&&u.render(_,l),u.render(t,l)}u.toneMapping=d,u.autoClear=h,t.background=x}_textureToCubeUV(t,n){const i=this._renderer,r=t.mapping===Lr||t.mapping===Rs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ng()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ig());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;na(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,io)}_applyPMREM(t){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(t,s-1,s);n.autoClear=i}_applyGGXFilter(t,n,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),f=n/(this._lodMeshes.length-1),u=Math.sqrt(c*c-f*f),h=0+c*1.25,d=u*h,{_lodMax:v}=this,_=this._sizeLods[i],m=3*_*(i>v-Er?i-v+Er:0),p=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=v-n,na(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(o,io),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=v-i,na(t,m,p,3*_,2*_),r.setRenderTarget(t),r.render(o,io)}_blur(t,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,n,i,r,"latitudinal",s),this._halfBlur(a,t,i,i,r,"longitudinal",s)}_halfBlur(t,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Qt("blur direction must be either latitudinal or longitudinal!");const f=3,u=this._lodMeshes[r];u.material=c;const h=c.uniforms,d=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*hs-1),_=s/v,m=isFinite(s)?1+Math.floor(f*_):hs;m>hs&&Vt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hs}`);const p=[];let x=0;for(let C=0;C<hs;++C){const R=C/_,g=Math.exp(-R*R/2);p.push(g),C===0?x+=g:C<m&&(x+=2*g)}for(let C=0;C<p.length;C++)p[C]=p[C]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:b}=this;h.dTheta.value=v,h.mipInt.value=b-i;const S=this._sizeLods[r],T=3*S*(r>b-Er?r-b+Er:0),E=4*(this._cubeSize-S);na(n,T,E,3*S,2*S),l.setRenderTarget(n),l.render(u,io)}}function y3(e){const t=[],n=[],i=[];let r=e;const s=e-Er+1+Pg.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>e-Er?l=Pg[a-e+Er-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),f=-c,u=1+c,h=[f,f,u,f,u,u,f,f,u,u,f,u],d=6,v=6,_=3,m=2,p=1,x=new Float32Array(_*v*d),b=new Float32Array(m*v*d),S=new Float32Array(p*v*d);for(let E=0;E<d;E++){const C=E%3*2/3-1,R=E>2?0:-1,g=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];x.set(g,_*v*E),b.set(h,m*v*E);const M=[E,E,E,E,E,E];S.set(M,p*v*E)}const T=new Pi;T.setAttribute("position",new Kn(x,_)),T.setAttribute("uv",new Kn(b,m)),T.setAttribute("faceIndex",new Kn(S,p)),i.push(new Ci(T,null)),r>Er&&r--}return{lodMeshes:i,sizeLods:t,sigmas:n}}function Dg(e,t,n){const i=new $n(e,t,n);return i.texture.mapping=dl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function na(e,t,n,i,r){e.viewport.set(t,n,i,r),e.scissor.set(t,n,i,r)}function S3(e,t,n){return new ei({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:g3,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Bu(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function M3(e,t,n){const i=new Float32Array(hs),r=new $(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Bu(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Ig(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bu(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Ng(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Bu(){return`

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
	`}function b3(e){let t=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===_f||l===gf,f=l===Lr||l===Rs;if(c||f){let u=t.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new Mp(e)),u=c?n.fromEquirectangular(o,u):n.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return c&&d&&d.height>0||f&&d&&r(d)?(n===null&&(n=new Mp(e)),u=c?n.fromEquirectangular(o):n.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",s),u.texture):null}}}return o}function r(o){let l=0;const c=6;for(let f=0;f<c;f++)o[f]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function T3(e){const t={};function n(i){if(t[i]!==void 0)return t[i];const r=e.getExtension(i);return t[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&La("WebGLRenderer: "+i+" extension not supported."),r}}}function E3(e,t,n,i){const r={},s=new WeakMap;function a(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const v in h.attributes)t.remove(h.attributes[v]);h.removeEventListener("dispose",a),delete r[h.id];const d=s.get(h);d&&(t.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(u,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(u){const h=u.attributes;for(const d in h)t.update(h[d],e.ARRAY_BUFFER)}function c(u){const h=[],d=u.index,v=u.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let b=0,S=x.length;b<S;b+=3){const T=x[b+0],E=x[b+1],C=x[b+2];h.push(T,E,E,C,C,T)}}else if(v!==void 0){const x=v.array;_=v.version;for(let b=0,S=x.length/3-1;b<S;b+=3){const T=b+0,E=b+1,C=b+2;h.push(T,E,E,C,C,T)}}else return;const m=new(MS(h)?Em:Tm)(h,1);m.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,m)}function f(u){const h=s.get(u);if(h){const d=u.index;d!==null&&h.version<d.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:f}}function w3(e,t,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,d){e.drawElements(i,d,s,h*a),n.update(d,i,1)}function c(h,d,v){v!==0&&(e.drawElementsInstanced(i,d,s,h*a,v),n.update(d,i,v))}function f(h,d,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,v);let m=0;for(let p=0;p<v;p++)m+=d[p];n.update(m,i,1)}function u(h,d,v,_){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/a,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,s,h,0,_,0,v);let p=0;for(let x=0;x<v;x++)p+=d[x]*_[x];n.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f,this.renderMultiDrawInstances=u}function A3(e){const t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(s/3);break;case e.LINES:n.lines+=o*(s/2);break;case e.LINE_STRIP:n.lines+=o*(s-1);break;case e.LINE_LOOP:n.lines+=o*s;break;case e.POINTS:n.points+=o*s;break;default:Qt("WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:r,update:i}}function C3(e,t,n){const i=new WeakMap,r=new Se;function s(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let g=function(){C.dispose(),i.delete(o),o.removeEventListener("dispose",g)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let b=0;d===!0&&(b=1),v===!0&&(b=2),_===!0&&(b=3);let S=o.attributes.position.count*b,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*T*4*u),C=new Sm(E,S,T,u);C.type=kn,C.needsUpdate=!0;const R=b*4;for(let M=0;M<u;M++){const P=m[M],I=p[M],N=x[M],O=S*T*4*M;for(let q=0;q<P.count;q++){const V=q*R;d===!0&&(r.fromBufferAttribute(P,q),E[O+V+0]=r.x,E[O+V+1]=r.y,E[O+V+2]=r.z,E[O+V+3]=0),v===!0&&(r.fromBufferAttribute(I,q),E[O+V+4]=r.x,E[O+V+5]=r.y,E[O+V+6]=r.z,E[O+V+7]=0),_===!0&&(r.fromBufferAttribute(N,q),E[O+V+8]=r.x,E[O+V+9]=r.y,E[O+V+10]=r.z,E[O+V+11]=N.itemSize===4?r.w:1)}}h={count:u,texture:C,size:new oe(S,T)},i.set(o,h),o.addEventListener("dispose",g)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const v=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",v),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",h.size)}return{update:s}}function R3(e,t,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,f=l.geometry,u=t.get(l,f);if(r.get(u)!==c&&(t.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,e.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,e.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return u}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}const P3={[am]:"LINEAR_TONE_MAPPING",[om]:"REINHARD_TONE_MAPPING",[lm]:"CINEON_TONE_MAPPING",[cm]:"ACES_FILMIC_TONE_MAPPING",[um]:"AGX_TONE_MAPPING",[hm]:"NEUTRAL_TONE_MAPPING",[fm]:"CUSTOM_TONE_MAPPING"};function L3(e,t,n,i,r){const s=new $n(t,n,{type:e,depthBuffer:i,stencilBuffer:r}),a=new $n(t,n,{type:Ei,depthBuffer:!1,stencilBuffer:!1}),o=new Pi;o.setAttribute("position",new bi([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new bi([0,2,0,0,2,0],2));const l=new NS({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new Ci(o,l),f=new Lm(-1,1,1,-1,0,1);let u=null,h=null,d=!1,v,_=null,m=[],p=!1;this.setSize=function(x,b){s.setSize(x,b),a.setSize(x,b);for(let S=0;S<m.length;S++){const T=m[S];T.setSize&&T.setSize(x,b)}},this.setEffects=function(x){m=x,p=m.length>0&&m[0].isRenderPass===!0;const b=s.width,S=s.height;for(let T=0;T<m.length;T++){const E=m[T];E.setSize&&E.setSize(b,S)}},this.begin=function(x,b){if(d||x.toneMapping===Yn&&m.length===0)return!1;if(_=b,b!==null){const S=b.width,T=b.height;(s.width!==S||s.height!==T)&&this.setSize(S,T)}return p===!1&&x.setRenderTarget(s),v=x.toneMapping,x.toneMapping=Yn,!0},this.hasRenderPass=function(){return p},this.end=function(x,b){x.toneMapping=v,d=!0;let S=s,T=a;for(let E=0;E<m.length;E++){const C=m[E];if(C.enabled!==!1&&(C.render(x,T,S,b),C.needsSwap!==!1)){const R=S;S=T,T=R}}if(u!==x.outputColorSpace||h!==x.toneMapping){u=x.outputColorSpace,h=x.toneMapping,l.defines={},Jt.getTransfer(u)===ne&&(l.defines.SRGB_TRANSFER="");const E=P3[h];E&&(l.defines[E]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,x.setRenderTarget(_),x.render(c,f),_=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),l.dispose()}}const HS=new Ge,bp=new Ia(1,1),zS=new Sm,VS=new wS,GS=new Am,Fg=[],Ug=[],Og=new Float32Array(16),Bg=new Float32Array(9),Hg=new Float32Array(4);function za(e,t,n){const i=e[0];if(i<=0||i>0)return e;const r=t*n;let s=Fg[r];if(s===void 0&&(s=new Float32Array(r),Fg[r]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(s,o)}return s}function Ce(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function Re(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Hu(e,t){let n=Ug[t];n===void 0&&(n=new Int32Array(t),Ug[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function D3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function I3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ce(n,t))return;e.uniform2fv(this.addr,t),Re(n,t)}}function N3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ce(n,t))return;e.uniform3fv(this.addr,t),Re(n,t)}}function F3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ce(n,t))return;e.uniform4fv(this.addr,t),Re(n,t)}}function U3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ce(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Re(n,t)}else{if(Ce(n,i))return;Hg.set(i),e.uniformMatrix2fv(this.addr,!1,Hg),Re(n,i)}}function O3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ce(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Re(n,t)}else{if(Ce(n,i))return;Bg.set(i),e.uniformMatrix3fv(this.addr,!1,Bg),Re(n,i)}}function B3(e,t){const n=this.cache,i=t.elements;if(i===void 0){if(Ce(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Re(n,t)}else{if(Ce(n,i))return;Og.set(i),e.uniformMatrix4fv(this.addr,!1,Og),Re(n,i)}}function H3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function z3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ce(n,t))return;e.uniform2iv(this.addr,t),Re(n,t)}}function V3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ce(n,t))return;e.uniform3iv(this.addr,t),Re(n,t)}}function G3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ce(n,t))return;e.uniform4iv(this.addr,t),Re(n,t)}}function k3(e,t){const n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function W3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ce(n,t))return;e.uniform2uiv(this.addr,t),Re(n,t)}}function X3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ce(n,t))return;e.uniform3uiv(this.addr,t),Re(n,t)}}function q3(e,t){const n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ce(n,t))return;e.uniform4uiv(this.addr,t),Re(n,t)}}function Y3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r);let s;this.type===e.SAMPLER_2D_SHADOW?(bp.compareFunction=n.isReversedDepthBuffer()?Fu:Nu,s=bp):s=HS,n.setTexture2D(t||s,r)}function $3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(t||VS,r)}function K3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(t||GS,r)}function Z3(e,t,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(t||zS,r)}function J3(e){switch(e){case 5126:return D3;case 35664:return I3;case 35665:return N3;case 35666:return F3;case 35674:return U3;case 35675:return O3;case 35676:return B3;case 5124:case 35670:return H3;case 35667:case 35671:return z3;case 35668:case 35672:return V3;case 35669:case 35673:return G3;case 5125:return k3;case 36294:return W3;case 36295:return X3;case 36296:return q3;case 35678:case 36198:case 36298:case 36306:case 35682:return Y3;case 35679:case 36299:case 36307:return $3;case 35680:case 36300:case 36308:case 36293:return K3;case 36289:case 36303:case 36311:case 36292:return Z3}}function j3(e,t){e.uniform1fv(this.addr,t)}function Q3(e,t){const n=za(t,this.size,2);e.uniform2fv(this.addr,n)}function tI(e,t){const n=za(t,this.size,3);e.uniform3fv(this.addr,n)}function eI(e,t){const n=za(t,this.size,4);e.uniform4fv(this.addr,n)}function nI(e,t){const n=za(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function iI(e,t){const n=za(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function rI(e,t){const n=za(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function sI(e,t){e.uniform1iv(this.addr,t)}function aI(e,t){e.uniform2iv(this.addr,t)}function oI(e,t){e.uniform3iv(this.addr,t)}function lI(e,t){e.uniform4iv(this.addr,t)}function cI(e,t){e.uniform1uiv(this.addr,t)}function fI(e,t){e.uniform2uiv(this.addr,t)}function uI(e,t){e.uniform3uiv(this.addr,t)}function hI(e,t){e.uniform4uiv(this.addr,t)}function dI(e,t,n){const i=this.cache,r=t.length,s=Hu(n,r);Ce(i,s)||(e.uniform1iv(this.addr,s),Re(i,s));let a;this.type===e.SAMPLER_2D_SHADOW?a=bp:a=HS;for(let o=0;o!==r;++o)n.setTexture2D(t[o]||a,s[o])}function pI(e,t,n){const i=this.cache,r=t.length,s=Hu(n,r);Ce(i,s)||(e.uniform1iv(this.addr,s),Re(i,s));for(let a=0;a!==r;++a)n.setTexture3D(t[a]||VS,s[a])}function mI(e,t,n){const i=this.cache,r=t.length,s=Hu(n,r);Ce(i,s)||(e.uniform1iv(this.addr,s),Re(i,s));for(let a=0;a!==r;++a)n.setTextureCube(t[a]||GS,s[a])}function vI(e,t,n){const i=this.cache,r=t.length,s=Hu(n,r);Ce(i,s)||(e.uniform1iv(this.addr,s),Re(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(t[a]||zS,s[a])}function _I(e){switch(e){case 5126:return j3;case 35664:return Q3;case 35665:return tI;case 35666:return eI;case 35674:return nI;case 35675:return iI;case 35676:return rI;case 5124:case 35670:return sI;case 35667:case 35671:return aI;case 35668:case 35672:return oI;case 35669:case 35673:return lI;case 5125:return cI;case 36294:return fI;case 36295:return uI;case 36296:return hI;case 35678:case 36198:case 36298:case 36306:case 35682:return dI;case 35679:case 36299:case 36307:return pI;case 35680:case 36300:case 36308:case 36293:return mI;case 36289:case 36303:case 36311:case 36292:return vI}}class gI{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=J3(n.type)}}class xI{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=_I(n.type)}}class yI{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,n[o.id],i)}}}const gd=/(\w+)(\])?(\[|\.)?/g;function zg(e,t){e.seq.push(t),e.map[t.id]=t}function SI(e,t,n){const i=e.name,r=i.length;for(gd.lastIndex=0;;){const s=gd.exec(i),a=gd.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){zg(n,c===void 0?new gI(o,e,t):new xI(o,e,t));break}else{let u=n.map[o];u===void 0&&(u=new yI(o),zg(n,u)),n=u}}}class Dc{constructor(t,n){this.seq=[],this.map={};const i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(n,a),l=t.getUniformLocation(n,o.name);SI(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(t,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(t,i,r)}setOptional(t,n,i){const r=n[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,n){const i=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in n&&i.push(a)}return i}}function Vg(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}const MI=37297;let bI=0;function TI(e,t){const n=e.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Gg=new Xt;function EI(e){Jt._getMatrix(Gg,Jt.workingColorSpace,e);const t=`mat3( ${Gg.elements.map(n=>n.toFixed(4))} )`;switch(Jt.getTransfer(e)){case il:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return Vt("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function kg(e,t,n){const i=e.getShaderParameter(t,e.COMPILE_STATUS),s=(e.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+TI(e.getShaderSource(t),o)}else return s}function wI(e,t){const n=EI(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const AI={[am]:"Linear",[om]:"Reinhard",[lm]:"Cineon",[cm]:"ACESFilmic",[um]:"AgX",[hm]:"Neutral",[fm]:"Custom"};function CI(e,t){const n=AI[t];return n===void 0?(Vt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const dc=new $;function RI(){Jt.getLuminanceCoefficients(dc);const e=dc.x.toFixed(4),t=dc.y.toFixed(4),n=dc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function PI(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(go).join(`
`)}function LI(e){const t=[];for(const n in e){const i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function DI(e,t){const n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=e.getActiveAttrib(t,r),a=s.name;let o=1;s.type===e.FLOAT_MAT2&&(o=2),s.type===e.FLOAT_MAT3&&(o=3),s.type===e.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function go(e){return e!==""}function Wg(e,t){const n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Xg(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const II=/^[ \t]*#include +<([\w\d./]+)>/gm;function Tp(e){return e.replace(II,FI)}const NI=new Map;function FI(e,t){let n=Yt[t];if(n===void 0){const i=NI.get(t);if(i!==void 0)n=Yt[i],Vt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Tp(n)}const UI=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qg(e){return e.replace(UI,OI)}function OI(e,t,n,i){let r="";for(let s=parseInt(t);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Yg(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}const BI={[No]:"SHADOWMAP_TYPE_PCF",[ua]:"SHADOWMAP_TYPE_VSM"};function HI(e){return BI[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const zI={[Lr]:"ENVMAP_TYPE_CUBE",[Rs]:"ENVMAP_TYPE_CUBE",[dl]:"ENVMAP_TYPE_CUBE_UV"};function VI(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":zI[e.envMapMode]||"ENVMAP_TYPE_CUBE"}const GI={[Rs]:"ENVMAP_MODE_REFRACTION"};function kI(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":GI[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const WI={[sm]:"ENVMAP_BLENDING_MULTIPLY",[fS]:"ENVMAP_BLENDING_MIX",[uS]:"ENVMAP_BLENDING_ADD"};function XI(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":WI[e.combine]||"ENVMAP_BLENDING_NONE"}function qI(e){const t=e.envMapCubeUVHeight;if(t===null)return null;const n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function YI(e,t,n,i){const r=e.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=HI(n),c=VI(n),f=kI(n),u=XI(n),h=qI(n),d=PI(n),v=LI(s),_=r.createProgram();let m,p,x=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(go).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(go).join(`
`),p.length>0&&(p+=`
`)):(m=[Yg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(go).join(`
`),p=[Yg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+f:"",n.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Yn?"#define TONE_MAPPING":"",n.toneMapping!==Yn?Yt.tonemapping_pars_fragment:"",n.toneMapping!==Yn?CI("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,wI("linearToOutputTexel",n.outputColorSpace),RI(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(go).join(`
`)),a=Tp(a),a=Wg(a,n),a=Xg(a,n),o=Tp(o),o=Wg(o,n),o=Xg(o,n),a=qg(a),o=qg(o),n.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===xp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===xp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=x+m+a,S=x+p+o,T=Vg(r,r.VERTEX_SHADER,b),E=Vg(r,r.FRAGMENT_SHADER,S);r.attachShader(_,T),r.attachShader(_,E),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(P){if(e.debug.checkShaderErrors){const I=r.getProgramInfoLog(_)||"",N=r.getShaderInfoLog(T)||"",O=r.getShaderInfoLog(E)||"",q=I.trim(),V=N.trim(),H=O.trim();let K=!0,dt=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(K=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(r,_,T,E);else{const ct=kg(r,T,"vertex"),ht=kg(r,E,"fragment");Qt("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+q+`
`+ct+`
`+ht)}else q!==""?Vt("WebGLProgram: Program Info Log:",q):(V===""||H==="")&&(dt=!1);dt&&(P.diagnostics={runnable:K,programLog:q,vertexShader:{log:V,prefix:m},fragmentShader:{log:H,prefix:p}})}r.deleteShader(T),r.deleteShader(E),R=new Dc(r,_),g=DI(r,_)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let g;this.getAttributes=function(){return g===void 0&&C(this),g};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,MI)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=bI++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}let $I=0;class KI{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const n=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const n=this.materialCache.get(t);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const n=this.materialCache;let i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){const n=this.shaderCache;let i=n.get(t);return i===void 0&&(i=new ZI(t),n.set(t,i)),i}}class ZI{constructor(t){this.id=$I++,this.code=t,this.usedTimes=0}}function JI(e,t,n,i,r,s,a){const o=new Mm,l=new KI,c=new Set,f=[],u=new Map,h=r.logarithmicDepthBuffer;let d=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(g){return c.add(g),g===0?"uv":`uv${g}`}function m(g,M,P,I,N){const O=I.fog,q=N.geometry,V=g.isMeshStandardMaterial?I.environment:null,H=(g.isMeshStandardMaterial?n:t).get(g.envMap||V),K=H&&H.mapping===dl?H.image.height:null,dt=v[g.type];g.precision!==null&&(d=r.getMaxPrecision(g.precision),d!==g.precision&&Vt("WebGLProgram.getParameters:",g.precision,"not supported, using",d,"instead."));const ct=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ht=ct!==void 0?ct.length:0;let Rt=0;q.morphAttributes.position!==void 0&&(Rt=1),q.morphAttributes.normal!==void 0&&(Rt=2),q.morphAttributes.color!==void 0&&(Rt=3);let It,qt,Kt,Q;if(dt){const re=Vn[dt];It=re.vertexShader,qt=re.fragmentShader}else It=g.vertexShader,qt=g.fragmentShader,l.update(g),Kt=l.getVertexShaderID(g),Q=l.getFragmentShaderID(g);const it=e.getRenderTarget(),Mt=e.state.buffers.depth.getReversed(),Ut=N.isInstancedMesh===!0,mt=N.isBatchedMesh===!0,bt=!!g.map,D=!!g.matcap,U=!!H,G=!!g.aoMap,et=!!g.lightMap,J=!!g.bumpMap,nt=!!g.normalMap,L=!!g.displacementMap,ot=!!g.emissiveMap,rt=!!g.metalnessMap,tt=!!g.roughnessMap,st=g.anisotropy>0,w=g.clearcoat>0,y=g.dispersion>0,F=g.iridescence>0,X=g.sheen>0,j=g.transmission>0,W=st&&!!g.anisotropyMap,Tt=w&&!!g.clearcoatMap,ft=w&&!!g.clearcoatNormalMap,At=w&&!!g.clearcoatRoughnessMap,Nt=F&&!!g.iridescenceMap,lt=F&&!!g.iridescenceThicknessMap,_t=X&&!!g.sheenColorMap,xt=X&&!!g.sheenRoughnessMap,Ct=!!g.specularMap,vt=!!g.specularColorMap,Wt=!!g.specularIntensityMap,B=j&&!!g.transmissionMap,wt=j&&!!g.thicknessMap,pt=!!g.gradientMap,Pt=!!g.alphaMap,ut=g.alphaTest>0,at=!!g.alphaHash,gt=!!g.extensions;let Gt=Yn;g.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Gt=e.toneMapping);const pe={shaderID:dt,shaderType:g.type,shaderName:g.name,vertexShader:It,fragmentShader:qt,defines:g.defines,customVertexShaderID:Kt,customFragmentShaderID:Q,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:d,batching:mt,batchingColor:mt&&N._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&N.instanceColor!==null,instancingMorph:Ut&&N.morphTexture!==null,outputColorSpace:it===null?e.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:Ls,alphaToCoverage:!!g.alphaToCoverage,map:bt,matcap:D,envMap:U,envMapMode:U&&H.mapping,envMapCubeUVHeight:K,aoMap:G,lightMap:et,bumpMap:J,normalMap:nt,displacementMap:L,emissiveMap:ot,normalMapObjectSpace:nt&&g.normalMapType===mS,normalMapTangentSpace:nt&&g.normalMapType===pS,metalnessMap:rt,roughnessMap:tt,anisotropy:st,anisotropyMap:W,clearcoat:w,clearcoatMap:Tt,clearcoatNormalMap:ft,clearcoatRoughnessMap:At,dispersion:y,iridescence:F,iridescenceMap:Nt,iridescenceThicknessMap:lt,sheen:X,sheenColorMap:_t,sheenRoughnessMap:xt,specularMap:Ct,specularColorMap:vt,specularIntensityMap:Wt,transmission:j,transmissionMap:B,thicknessMap:wt,gradientMap:pt,opaque:g.transparent===!1&&g.blending===Ts&&g.alphaToCoverage===!1,alphaMap:Pt,alphaTest:ut,alphaHash:at,combine:g.combine,mapUv:bt&&_(g.map.channel),aoMapUv:G&&_(g.aoMap.channel),lightMapUv:et&&_(g.lightMap.channel),bumpMapUv:J&&_(g.bumpMap.channel),normalMapUv:nt&&_(g.normalMap.channel),displacementMapUv:L&&_(g.displacementMap.channel),emissiveMapUv:ot&&_(g.emissiveMap.channel),metalnessMapUv:rt&&_(g.metalnessMap.channel),roughnessMapUv:tt&&_(g.roughnessMap.channel),anisotropyMapUv:W&&_(g.anisotropyMap.channel),clearcoatMapUv:Tt&&_(g.clearcoatMap.channel),clearcoatNormalMapUv:ft&&_(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&_(g.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&_(g.iridescenceMap.channel),iridescenceThicknessMapUv:lt&&_(g.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&_(g.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(g.sheenRoughnessMap.channel),specularMapUv:Ct&&_(g.specularMap.channel),specularColorMapUv:vt&&_(g.specularColorMap.channel),specularIntensityMapUv:Wt&&_(g.specularIntensityMap.channel),transmissionMapUv:B&&_(g.transmissionMap.channel),thicknessMapUv:wt&&_(g.thicknessMap.channel),alphaMapUv:Pt&&_(g.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(nt||st),vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!q.attributes.uv&&(bt||Pt),fog:!!O,useFog:g.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:g.flatShading===!0&&g.wireframe===!1,sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Mt,skinning:N.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:Rt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:e.shadowMap.enabled&&P.length>0,shadowMapType:e.shadowMap.type,toneMapping:Gt,decodeVideoTexture:bt&&g.map.isVideoTexture===!0&&Jt.getTransfer(g.map.colorSpace)===ne,decodeVideoTextureEmissive:ot&&g.emissiveMap.isVideoTexture===!0&&Jt.getTransfer(g.emissiveMap.colorSpace)===ne,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===mi,flipSided:g.side===je,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:gt&&g.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&g.extensions.multiDraw===!0||mt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function p(g){const M=[];if(g.shaderID?M.push(g.shaderID):(M.push(g.customVertexShaderID),M.push(g.customFragmentShaderID)),g.defines!==void 0)for(const P in g.defines)M.push(P),M.push(g.defines[P]);return g.isRawShaderMaterial===!1&&(x(M,g),b(M,g),M.push(e.outputColorSpace)),M.push(g.customProgramCacheKey),M.join()}function x(g,M){g.push(M.precision),g.push(M.outputColorSpace),g.push(M.envMapMode),g.push(M.envMapCubeUVHeight),g.push(M.mapUv),g.push(M.alphaMapUv),g.push(M.lightMapUv),g.push(M.aoMapUv),g.push(M.bumpMapUv),g.push(M.normalMapUv),g.push(M.displacementMapUv),g.push(M.emissiveMapUv),g.push(M.metalnessMapUv),g.push(M.roughnessMapUv),g.push(M.anisotropyMapUv),g.push(M.clearcoatMapUv),g.push(M.clearcoatNormalMapUv),g.push(M.clearcoatRoughnessMapUv),g.push(M.iridescenceMapUv),g.push(M.iridescenceThicknessMapUv),g.push(M.sheenColorMapUv),g.push(M.sheenRoughnessMapUv),g.push(M.specularMapUv),g.push(M.specularColorMapUv),g.push(M.specularIntensityMapUv),g.push(M.transmissionMapUv),g.push(M.thicknessMapUv),g.push(M.combine),g.push(M.fogExp2),g.push(M.sizeAttenuation),g.push(M.morphTargetsCount),g.push(M.morphAttributeCount),g.push(M.numDirLights),g.push(M.numPointLights),g.push(M.numSpotLights),g.push(M.numSpotLightMaps),g.push(M.numHemiLights),g.push(M.numRectAreaLights),g.push(M.numDirLightShadows),g.push(M.numPointLightShadows),g.push(M.numSpotLightShadows),g.push(M.numSpotLightShadowsWithMaps),g.push(M.numLightProbes),g.push(M.shadowMapType),g.push(M.toneMapping),g.push(M.numClippingPlanes),g.push(M.numClipIntersection),g.push(M.depthPacking)}function b(g,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),g.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),g.push(o.mask)}function S(g){const M=v[g.type];let P;if(M){const I=Vn[M];P=PS.clone(I.uniforms)}else P=g.uniforms;return P}function T(g,M){let P=u.get(M);return P!==void 0?++P.usedTimes:(P=new YI(e,M,g,s),f.push(P),u.set(M,P)),P}function E(g){if(--g.usedTimes===0){const M=f.indexOf(g);f[M]=f[f.length-1],f.pop(),u.delete(g.cacheKey),g.destroy()}}function C(g){l.remove(g)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:T,releaseProgram:E,releaseShaderCache:C,programs:f,dispose:R}}function jI(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);return o===void 0&&(o={},e.set(a,o)),o}function i(a){e.delete(a)}function r(a,o,l){e.get(a)[o]=l}function s(){e=new WeakMap}return{has:t,get:n,remove:i,update:r,dispose:s}}function QI(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function $g(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function Kg(){const e=[];let t=0;const n=[],i=[],r=[];function s(){t=0,n.length=0,i.length=0,r.length=0}function a(u,h,d,v,_,m){let p=e[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:d,groupOrder:v,renderOrder:u.renderOrder,z:_,group:m},e[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=d,p.groupOrder=v,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,h,d,v,_,m){const p=a(u,h,d,v,_,m);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):n.push(p)}function l(u,h,d,v,_,m){const p=a(u,h,d,v,_,m);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):n.unshift(p)}function c(u,h){n.length>1&&n.sort(u||QI),i.length>1&&i.sort(h||$g),r.length>1&&r.sort(h||$g)}function f(){for(let u=t,h=e.length;u<h;u++){const d=e[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:f,sort:c}}function tN(){let e=new WeakMap;function t(i,r){const s=e.get(i);let a;return s===void 0?(a=new Kg,e.set(i,[a])):r>=s.length?(a=new Kg,s.push(a)):a=s[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function eN(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={direction:new $,color:new ae};break;case"SpotLight":n={position:new $,direction:new $,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new $,color:new ae,distance:0,decay:0};break;case"HemisphereLight":n={direction:new $,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":n={color:new ae,position:new $,halfWidth:new $,halfHeight:new $};break}return e[t.id]=n,n}}}function nN(){const e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}let iN=0;function rN(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function sN(e){const t=new eN,n=nN(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new $);const r=new $,s=new Ee,a=new Ee;function o(c){let f=0,u=0,h=0;for(let g=0;g<9;g++)i.probe[g].set(0,0,0);let d=0,v=0,_=0,m=0,p=0,x=0,b=0,S=0,T=0,E=0,C=0;c.sort(rN);for(let g=0,M=c.length;g<M;g++){const P=c[g],I=P.color,N=P.intensity,O=P.distance;let q=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Ps?q=P.shadow.map.texture:q=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)f+=I.r*N,u+=I.g*N,h+=I.b*N;else if(P.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(P.sh.coefficients[V],N);C++}else if(P.isDirectionalLight){const V=t.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,K=n.get(P);K.shadowIntensity=H.intensity,K.shadowBias=H.bias,K.shadowNormalBias=H.normalBias,K.shadowRadius=H.radius,K.shadowMapSize=H.mapSize,i.directionalShadow[d]=K,i.directionalShadowMap[d]=q,i.directionalShadowMatrix[d]=P.shadow.matrix,x++}i.directional[d]=V,d++}else if(P.isSpotLight){const V=t.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(I).multiplyScalar(N),V.distance=O,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,i.spot[_]=V;const H=P.shadow;if(P.map&&(i.spotLightMap[T]=P.map,T++,H.updateMatrices(P),P.castShadow&&E++),i.spotLightMatrix[_]=H.matrix,P.castShadow){const K=n.get(P);K.shadowIntensity=H.intensity,K.shadowBias=H.bias,K.shadowNormalBias=H.normalBias,K.shadowRadius=H.radius,K.shadowMapSize=H.mapSize,i.spotShadow[_]=K,i.spotShadowMap[_]=q,S++}_++}else if(P.isRectAreaLight){const V=t.get(P);V.color.copy(I).multiplyScalar(N),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=V,m++}else if(P.isPointLight){const V=t.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){const H=P.shadow,K=n.get(P);K.shadowIntensity=H.intensity,K.shadowBias=H.bias,K.shadowNormalBias=H.normalBias,K.shadowRadius=H.radius,K.shadowMapSize=H.mapSize,K.shadowCameraNear=H.camera.near,K.shadowCameraFar=H.camera.far,i.pointShadow[v]=K,i.pointShadowMap[v]=q,i.pointShadowMatrix[v]=P.shadow.matrix,b++}i.point[v]=V,v++}else if(P.isHemisphereLight){const V=t.get(P);V.skyColor.copy(P.color).multiplyScalar(N),V.groundColor.copy(P.groundColor).multiplyScalar(N),i.hemi[p]=V,p++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=St.LTC_FLOAT_1,i.rectAreaLTC2=St.LTC_FLOAT_2):(i.rectAreaLTC1=St.LTC_HALF_1,i.rectAreaLTC2=St.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=u,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==d||R.pointLength!==v||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==x||R.numPointShadows!==b||R.numSpotShadows!==S||R.numSpotMaps!==T||R.numLightProbes!==C)&&(i.directional.length=d,i.spot.length=_,i.rectArea.length=m,i.point.length=v,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=S+T-E,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=C,R.directionalLength=d,R.pointLength=v,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=x,R.numPointShadows=b,R.numSpotShadows=S,R.numSpotMaps=T,R.numLightProbes=C,i.version=iN++)}function l(c,f){let u=0,h=0,d=0,v=0,_=0;const m=f.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const b=c[p];if(b.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),u++}else if(b.isSpotLight){const S=i.spot[d];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(b.isRectAreaLight){const S=i.rectArea[v];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),a.identity(),s.copy(b.matrixWorld),s.premultiply(m),a.extractRotation(s),S.halfWidth.set(b.width*.5,0,0),S.halfHeight.set(0,b.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),v++}else if(b.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(m),h++}else if(b.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function Zg(e){const t=new sN(e),n=[],i=[];function r(f){c.camera=f,n.length=0,i.length=0}function s(f){n.push(f)}function a(f){i.push(f)}function o(){t.setup(n)}function l(f){t.setupView(n,f)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function aN(e){let t=new WeakMap;function n(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Zg(e),t.set(r,[o])):s>=a.length?(o=new Zg(e),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:n,dispose:i}}const oN=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lN=`uniform sampler2D shadow_pass;
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
}`,cN=[new $(1,0,0),new $(-1,0,0),new $(0,1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1)],fN=[new $(0,-1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1),new $(0,-1,0),new $(0,-1,0)],Jg=new Ee,ro=new $,xd=new $;function uN(e,t,n){let i=new Rm;const r=new oe,s=new oe,a=new Se,o=new FS,l=new US,c={},f=n.maxTextureSize,u={[er]:je,[je]:er,[mi]:mi},h=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:oN,fragmentShader:lN}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const v=new Pi;v.setAttribute("position",new Kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ci(v,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=No;let p=this.type;this.render=function(E,C,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;E.type===Xy&&(Vt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),E.type=No);const g=e.getRenderTarget(),M=e.getActiveCubeFace(),P=e.getActiveMipmapLevel(),I=e.state;I.setBlending(Mi),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const N=p!==this.type;N&&C.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(q=>q.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,q=E.length;O<q;O++){const V=E[O],H=V.shadow;if(H===void 0){Vt("WebGLShadowMap:",V,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;r.copy(H.mapSize);const K=H.getFrameExtents();if(r.multiply(K),s.copy(H.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/K.x),r.x=s.x*K.x,H.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/K.y),r.y=s.y*K.y,H.mapSize.y=s.y)),H.map===null||N===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===ua){if(V.isPointLight){Vt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new $n(r.x,r.y,{format:Ps,type:Ei,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),H.map.texture.name=V.name+".shadowMap",H.map.depthTexture=new Ia(r.x,r.y,kn),H.map.depthTexture.name=V.name+".shadowMapDepth",H.map.depthTexture.format=wi,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=De,H.map.depthTexture.magFilter=De}else{V.isPointLight?(H.map=new Cm(r.x),H.map.depthTexture=new IS(r.x,ti)):(H.map=new $n(r.x,r.y),H.map.depthTexture=new Ia(r.x,r.y,ti)),H.map.depthTexture.name=V.name+".shadowMap",H.map.depthTexture.format=wi;const ct=e.state.buffers.depth.getReversed();this.type===No?(H.map.depthTexture.compareFunction=ct?Fu:Nu,H.map.depthTexture.minFilter=Ne,H.map.depthTexture.magFilter=Ne):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=De,H.map.depthTexture.magFilter=De)}H.camera.updateProjectionMatrix()}const dt=H.map.isWebGLCubeRenderTarget?6:1;for(let ct=0;ct<dt;ct++){if(H.map.isWebGLCubeRenderTarget)e.setRenderTarget(H.map,ct),e.clear();else{ct===0&&(e.setRenderTarget(H.map),e.clear());const ht=H.getViewport(ct);a.set(s.x*ht.x,s.y*ht.y,s.x*ht.z,s.y*ht.w),I.viewport(a)}if(V.isPointLight){const ht=H.camera,Rt=H.matrix,It=V.distance||ht.far;It!==ht.far&&(ht.far=It,ht.updateProjectionMatrix()),ro.setFromMatrixPosition(V.matrixWorld),ht.position.copy(ro),xd.copy(ht.position),xd.add(cN[ct]),ht.up.copy(fN[ct]),ht.lookAt(xd),ht.updateMatrixWorld(),Rt.makeTranslation(-ro.x,-ro.y,-ro.z),Jg.multiplyMatrices(ht.projectionMatrix,ht.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Jg,ht.coordinateSystem,ht.reversedDepth)}else H.updateMatrices(V);i=H.getFrustum(),S(C,R,H.camera,V,this.type)}H.isPointLightShadow!==!0&&this.type===ua&&x(H,R),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,e.setRenderTarget(g,M,P)};function x(E,C){const R=t.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new $n(r.x,r.y,{format:Ps,type:Ei})),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(C,null,R,h,_,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(C,null,R,d,_,null)}function b(E,C,R,g){let M=null;const P=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?l:o,e.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const I=M.uuid,N=C.uuid;let O=c[I];O===void 0&&(O={},c[I]=O);let q=O[N];q===void 0&&(q=M.clone(),O[N]=q,C.addEventListener("dispose",T)),M=q}if(M.visible=C.visible,M.wireframe=C.wireframe,g===ua?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:u[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=e.properties.get(M);I.light=R}return M}function S(E,C,R,g,M){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===ua)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);const N=t.update(E),O=E.material;if(Array.isArray(O)){const q=N.groups;for(let V=0,H=q.length;V<H;V++){const K=q[V],dt=O[K.materialIndex];if(dt&&dt.visible){const ct=b(E,dt,g,M);E.onBeforeShadow(e,E,C,R,N,ct,K),e.renderBufferDirect(R,null,N,ct,E,K),E.onAfterShadow(e,E,C,R,N,ct,K)}}}else if(O.visible){const q=b(E,O,g,M);E.onBeforeShadow(e,E,C,R,N,q,null),e.renderBufferDirect(R,null,N,q,E,null),E.onAfterShadow(e,E,C,R,N,q,null)}}const I=E.children;for(let N=0,O=I.length;N<O;N++)S(I[N],C,R,g,M)}function T(E){E.target.removeEventListener("dispose",T);for(const R in c){const g=c[R],M=E.target.uuid;M in g&&(g[M].dispose(),delete g[M])}}}const hN={[ff]:uf,[hf]:mf,[df]:vf,[Cs]:pf,[uf]:ff,[mf]:hf,[vf]:df,[pf]:Cs};function dN(e,t){function n(){let B=!1;const wt=new Se;let pt=null;const Pt=new Se(0,0,0,0);return{setMask:function(ut){pt!==ut&&!B&&(e.colorMask(ut,ut,ut,ut),pt=ut)},setLocked:function(ut){B=ut},setClear:function(ut,at,gt,Gt,pe){pe===!0&&(ut*=Gt,at*=Gt,gt*=Gt),wt.set(ut,at,gt,Gt),Pt.equals(wt)===!1&&(e.clearColor(ut,at,gt,Gt),Pt.copy(wt))},reset:function(){B=!1,pt=null,Pt.set(-1,0,0,0)}}}function i(){let B=!1,wt=!1,pt=null,Pt=null,ut=null;return{setReversed:function(at){if(wt!==at){const gt=t.get("EXT_clip_control");at?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),wt=at;const Gt=ut;ut=null,this.setClear(Gt)}},getReversed:function(){return wt},setTest:function(at){at?it(e.DEPTH_TEST):Mt(e.DEPTH_TEST)},setMask:function(at){pt!==at&&!B&&(e.depthMask(at),pt=at)},setFunc:function(at){if(wt&&(at=hN[at]),Pt!==at){switch(at){case ff:e.depthFunc(e.NEVER);break;case uf:e.depthFunc(e.ALWAYS);break;case hf:e.depthFunc(e.LESS);break;case Cs:e.depthFunc(e.LEQUAL);break;case df:e.depthFunc(e.EQUAL);break;case pf:e.depthFunc(e.GEQUAL);break;case mf:e.depthFunc(e.GREATER);break;case vf:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}Pt=at}},setLocked:function(at){B=at},setClear:function(at){ut!==at&&(wt&&(at=1-at),e.clearDepth(at),ut=at)},reset:function(){B=!1,pt=null,Pt=null,ut=null,wt=!1}}}function r(){let B=!1,wt=null,pt=null,Pt=null,ut=null,at=null,gt=null,Gt=null,pe=null;return{setTest:function(re){B||(re?it(e.STENCIL_TEST):Mt(e.STENCIL_TEST))},setMask:function(re){wt!==re&&!B&&(e.stencilMask(re),wt=re)},setFunc:function(re,ii,Li){(pt!==re||Pt!==ii||ut!==Li)&&(e.stencilFunc(re,ii,Li),pt=re,Pt=ii,ut=Li)},setOp:function(re,ii,Li){(at!==re||gt!==ii||Gt!==Li)&&(e.stencilOp(re,ii,Li),at=re,gt=ii,Gt=Li)},setLocked:function(re){B=re},setClear:function(re){pe!==re&&(e.clearStencil(re),pe=re)},reset:function(){B=!1,wt=null,pt=null,Pt=null,ut=null,at=null,gt=null,Gt=null,pe=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let f={},u={},h=new WeakMap,d=[],v=null,_=!1,m=null,p=null,x=null,b=null,S=null,T=null,E=null,C=new ae(0,0,0),R=0,g=!1,M=null,P=null,I=null,N=null,O=null;const q=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,H=0;const K=e.getParameter(e.VERSION);K.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(K)[1]),V=H>=1):K.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),V=H>=2);let dt=null,ct={};const ht=e.getParameter(e.SCISSOR_BOX),Rt=e.getParameter(e.VIEWPORT),It=new Se().fromArray(ht),qt=new Se().fromArray(Rt);function Kt(B,wt,pt,Pt){const ut=new Uint8Array(4),at=e.createTexture();e.bindTexture(B,at),e.texParameteri(B,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(B,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let gt=0;gt<pt;gt++)B===e.TEXTURE_3D||B===e.TEXTURE_2D_ARRAY?e.texImage3D(wt,0,e.RGBA,1,1,Pt,0,e.RGBA,e.UNSIGNED_BYTE,ut):e.texImage2D(wt+gt,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ut);return at}const Q={};Q[e.TEXTURE_2D]=Kt(e.TEXTURE_2D,e.TEXTURE_2D,1),Q[e.TEXTURE_CUBE_MAP]=Kt(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[e.TEXTURE_2D_ARRAY]=Kt(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Q[e.TEXTURE_3D]=Kt(e.TEXTURE_3D,e.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(e.DEPTH_TEST),a.setFunc(Cs),J(!1),nt(dp),it(e.CULL_FACE),G(Mi);function it(B){f[B]!==!0&&(e.enable(B),f[B]=!0)}function Mt(B){f[B]!==!1&&(e.disable(B),f[B]=!1)}function Ut(B,wt){return u[B]!==wt?(e.bindFramebuffer(B,wt),u[B]=wt,B===e.DRAW_FRAMEBUFFER&&(u[e.FRAMEBUFFER]=wt),B===e.FRAMEBUFFER&&(u[e.DRAW_FRAMEBUFFER]=wt),!0):!1}function mt(B,wt){let pt=d,Pt=!1;if(B){pt=h.get(wt),pt===void 0&&(pt=[],h.set(wt,pt));const ut=B.textures;if(pt.length!==ut.length||pt[0]!==e.COLOR_ATTACHMENT0){for(let at=0,gt=ut.length;at<gt;at++)pt[at]=e.COLOR_ATTACHMENT0+at;pt.length=ut.length,Pt=!0}}else pt[0]!==e.BACK&&(pt[0]=e.BACK,Pt=!0);Pt&&e.drawBuffers(pt)}function bt(B){return v!==B?(e.useProgram(B),v=B,!0):!1}const D={[xr]:e.FUNC_ADD,[Yy]:e.FUNC_SUBTRACT,[$y]:e.FUNC_REVERSE_SUBTRACT};D[Ky]=e.MIN,D[Zy]=e.MAX;const U={[Jy]:e.ZERO,[jy]:e.ONE,[Qy]:e.SRC_COLOR,[lf]:e.SRC_ALPHA,[sS]:e.SRC_ALPHA_SATURATE,[iS]:e.DST_COLOR,[eS]:e.DST_ALPHA,[tS]:e.ONE_MINUS_SRC_COLOR,[cf]:e.ONE_MINUS_SRC_ALPHA,[rS]:e.ONE_MINUS_DST_COLOR,[nS]:e.ONE_MINUS_DST_ALPHA,[aS]:e.CONSTANT_COLOR,[oS]:e.ONE_MINUS_CONSTANT_COLOR,[lS]:e.CONSTANT_ALPHA,[cS]:e.ONE_MINUS_CONSTANT_ALPHA};function G(B,wt,pt,Pt,ut,at,gt,Gt,pe,re){if(B===Mi){_===!0&&(Mt(e.BLEND),_=!1);return}if(_===!1&&(it(e.BLEND),_=!0),B!==qy){if(B!==m||re!==g){if((p!==xr||S!==xr)&&(e.blendEquation(e.FUNC_ADD),p=xr,S=xr),re)switch(B){case Ts:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case pp:e.blendFunc(e.ONE,e.ONE);break;case mp:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case vp:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Qt("WebGLState: Invalid blending: ",B);break}else switch(B){case Ts:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case pp:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case mp:Qt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vp:Qt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qt("WebGLState: Invalid blending: ",B);break}x=null,b=null,T=null,E=null,C.set(0,0,0),R=0,m=B,g=re}return}ut=ut||wt,at=at||pt,gt=gt||Pt,(wt!==p||ut!==S)&&(e.blendEquationSeparate(D[wt],D[ut]),p=wt,S=ut),(pt!==x||Pt!==b||at!==T||gt!==E)&&(e.blendFuncSeparate(U[pt],U[Pt],U[at],U[gt]),x=pt,b=Pt,T=at,E=gt),(Gt.equals(C)===!1||pe!==R)&&(e.blendColor(Gt.r,Gt.g,Gt.b,pe),C.copy(Gt),R=pe),m=B,g=!1}function et(B,wt){B.side===mi?Mt(e.CULL_FACE):it(e.CULL_FACE);let pt=B.side===je;wt&&(pt=!pt),J(pt),B.blending===Ts&&B.transparent===!1?G(Mi):G(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),s.setMask(B.colorWrite);const Pt=B.stencilWrite;o.setTest(Pt),Pt&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ot(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?it(e.SAMPLE_ALPHA_TO_COVERAGE):Mt(e.SAMPLE_ALPHA_TO_COVERAGE)}function J(B){M!==B&&(B?e.frontFace(e.CW):e.frontFace(e.CCW),M=B)}function nt(B){B!==ky?(it(e.CULL_FACE),B!==P&&(B===dp?e.cullFace(e.BACK):B===Wy?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Mt(e.CULL_FACE),P=B}function L(B){B!==I&&(V&&e.lineWidth(B),I=B)}function ot(B,wt,pt){B?(it(e.POLYGON_OFFSET_FILL),(N!==wt||O!==pt)&&(e.polygonOffset(wt,pt),N=wt,O=pt)):Mt(e.POLYGON_OFFSET_FILL)}function rt(B){B?it(e.SCISSOR_TEST):Mt(e.SCISSOR_TEST)}function tt(B){B===void 0&&(B=e.TEXTURE0+q-1),dt!==B&&(e.activeTexture(B),dt=B)}function st(B,wt,pt){pt===void 0&&(dt===null?pt=e.TEXTURE0+q-1:pt=dt);let Pt=ct[pt];Pt===void 0&&(Pt={type:void 0,texture:void 0},ct[pt]=Pt),(Pt.type!==B||Pt.texture!==wt)&&(dt!==pt&&(e.activeTexture(pt),dt=pt),e.bindTexture(B,wt||Q[B]),Pt.type=B,Pt.texture=wt)}function w(){const B=ct[dt];B!==void 0&&B.type!==void 0&&(e.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function y(){try{e.compressedTexImage2D(...arguments)}catch(B){Qt("WebGLState:",B)}}function F(){try{e.compressedTexImage3D(...arguments)}catch(B){Qt("WebGLState:",B)}}function X(){try{e.texSubImage2D(...arguments)}catch(B){Qt("WebGLState:",B)}}function j(){try{e.texSubImage3D(...arguments)}catch(B){Qt("WebGLState:",B)}}function W(){try{e.compressedTexSubImage2D(...arguments)}catch(B){Qt("WebGLState:",B)}}function Tt(){try{e.compressedTexSubImage3D(...arguments)}catch(B){Qt("WebGLState:",B)}}function ft(){try{e.texStorage2D(...arguments)}catch(B){Qt("WebGLState:",B)}}function At(){try{e.texStorage3D(...arguments)}catch(B){Qt("WebGLState:",B)}}function Nt(){try{e.texImage2D(...arguments)}catch(B){Qt("WebGLState:",B)}}function lt(){try{e.texImage3D(...arguments)}catch(B){Qt("WebGLState:",B)}}function _t(B){It.equals(B)===!1&&(e.scissor(B.x,B.y,B.z,B.w),It.copy(B))}function xt(B){qt.equals(B)===!1&&(e.viewport(B.x,B.y,B.z,B.w),qt.copy(B))}function Ct(B,wt){let pt=c.get(wt);pt===void 0&&(pt=new WeakMap,c.set(wt,pt));let Pt=pt.get(B);Pt===void 0&&(Pt=e.getUniformBlockIndex(wt,B.name),pt.set(B,Pt))}function vt(B,wt){const Pt=c.get(wt).get(B);l.get(wt)!==Pt&&(e.uniformBlockBinding(wt,Pt,B.__bindingPointIndex),l.set(wt,Pt))}function Wt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),f={},dt=null,ct={},u={},h=new WeakMap,d=[],v=null,_=!1,m=null,p=null,x=null,b=null,S=null,T=null,E=null,C=new ae(0,0,0),R=0,g=!1,M=null,P=null,I=null,N=null,O=null,It.set(0,0,e.canvas.width,e.canvas.height),qt.set(0,0,e.canvas.width,e.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:it,disable:Mt,bindFramebuffer:Ut,drawBuffers:mt,useProgram:bt,setBlending:G,setMaterial:et,setFlipSided:J,setCullFace:nt,setLineWidth:L,setPolygonOffset:ot,setScissorTest:rt,activeTexture:tt,bindTexture:st,unbindTexture:w,compressedTexImage2D:y,compressedTexImage3D:F,texImage2D:Nt,texImage3D:lt,updateUBOMapping:Ct,uniformBlockBinding:vt,texStorage2D:ft,texStorage3D:At,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:Tt,scissor:_t,viewport:xt,reset:Wt}}function pN(e,t,n,i,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,f=new WeakMap;let u;const h=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(w){}function v(w,y){return d?new OffscreenCanvas(w,y):Qf("canvas")}function _(w,y,F){let X=1;const j=st(w);if((j.width>F||j.height>F)&&(X=F/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&w instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&w instanceof ImageBitmap||typeof VideoFrame!="undefined"&&w instanceof VideoFrame){const W=Math.floor(X*j.width),Tt=Math.floor(X*j.height);u===void 0&&(u=v(W,Tt));const ft=y?v(W,Tt):u;return ft.width=W,ft.height=Tt,ft.getContext("2d").drawImage(w,0,0,W,Tt),Vt("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+Tt+")."),ft}else return"data"in w&&Vt("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){e.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?e.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(w,y,F,X,j=!1){if(w!==null){if(e[w]!==void 0)return e[w];Vt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let W=y;if(y===e.RED&&(F===e.FLOAT&&(W=e.R32F),F===e.HALF_FLOAT&&(W=e.R16F),F===e.UNSIGNED_BYTE&&(W=e.R8)),y===e.RED_INTEGER&&(F===e.UNSIGNED_BYTE&&(W=e.R8UI),F===e.UNSIGNED_SHORT&&(W=e.R16UI),F===e.UNSIGNED_INT&&(W=e.R32UI),F===e.BYTE&&(W=e.R8I),F===e.SHORT&&(W=e.R16I),F===e.INT&&(W=e.R32I)),y===e.RG&&(F===e.FLOAT&&(W=e.RG32F),F===e.HALF_FLOAT&&(W=e.RG16F),F===e.UNSIGNED_BYTE&&(W=e.RG8)),y===e.RG_INTEGER&&(F===e.UNSIGNED_BYTE&&(W=e.RG8UI),F===e.UNSIGNED_SHORT&&(W=e.RG16UI),F===e.UNSIGNED_INT&&(W=e.RG32UI),F===e.BYTE&&(W=e.RG8I),F===e.SHORT&&(W=e.RG16I),F===e.INT&&(W=e.RG32I)),y===e.RGB_INTEGER&&(F===e.UNSIGNED_BYTE&&(W=e.RGB8UI),F===e.UNSIGNED_SHORT&&(W=e.RGB16UI),F===e.UNSIGNED_INT&&(W=e.RGB32UI),F===e.BYTE&&(W=e.RGB8I),F===e.SHORT&&(W=e.RGB16I),F===e.INT&&(W=e.RGB32I)),y===e.RGBA_INTEGER&&(F===e.UNSIGNED_BYTE&&(W=e.RGBA8UI),F===e.UNSIGNED_SHORT&&(W=e.RGBA16UI),F===e.UNSIGNED_INT&&(W=e.RGBA32UI),F===e.BYTE&&(W=e.RGBA8I),F===e.SHORT&&(W=e.RGBA16I),F===e.INT&&(W=e.RGBA32I)),y===e.RGB&&(F===e.UNSIGNED_INT_5_9_9_9_REV&&(W=e.RGB9_E5),F===e.UNSIGNED_INT_10F_11F_11F_REV&&(W=e.R11F_G11F_B10F)),y===e.RGBA){const Tt=j?il:Jt.getTransfer(X);F===e.FLOAT&&(W=e.RGBA32F),F===e.HALF_FLOAT&&(W=e.RGBA16F),F===e.UNSIGNED_BYTE&&(W=Tt===ne?e.SRGB8_ALPHA8:e.RGBA8),F===e.UNSIGNED_SHORT_4_4_4_4&&(W=e.RGBA4),F===e.UNSIGNED_SHORT_5_5_5_1&&(W=e.RGB5_A1)}return(W===e.R16F||W===e.R32F||W===e.RG16F||W===e.RG32F||W===e.RGBA16F||W===e.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function S(w,y){let F;return w?y===null||y===ti||y===Pa?F=e.DEPTH24_STENCIL8:y===kn?F=e.DEPTH32F_STENCIL8:y===Ra&&(F=e.DEPTH24_STENCIL8,Vt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===ti||y===Pa?F=e.DEPTH_COMPONENT24:y===kn?F=e.DEPTH_COMPONENT32F:y===Ra&&(F=e.DEPTH_COMPONENT16),F}function T(w,y){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==De&&w.minFilter!==Ne?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function E(w){const y=w.target;y.removeEventListener("dispose",E),R(y),y.isVideoTexture&&f.delete(y)}function C(w){const y=w.target;y.removeEventListener("dispose",C),M(y)}function R(w){const y=i.get(w);if(y.__webglInit===void 0)return;const F=w.source,X=h.get(F);if(X){const j=X[y.__cacheKey];j.usedTimes--,j.usedTimes===0&&g(w),Object.keys(X).length===0&&h.delete(F)}i.remove(w)}function g(w){const y=i.get(w);e.deleteTexture(y.__webglTexture);const F=w.source,X=h.get(F);delete X[y.__cacheKey],a.memory.textures--}function M(w){const y=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let j=0;j<y.__webglFramebuffer[X].length;j++)e.deleteFramebuffer(y.__webglFramebuffer[X][j]);else e.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&e.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)e.deleteFramebuffer(y.__webglFramebuffer[X]);else e.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&e.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&e.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&e.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&e.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const F=w.textures;for(let X=0,j=F.length;X<j;X++){const W=i.get(F[X]);W.__webglTexture&&(e.deleteTexture(W.__webglTexture),a.memory.textures--),i.remove(F[X])}i.remove(w)}let P=0;function I(){P=0}function N(){const w=P;return w>=r.maxTextures&&Vt("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),P+=1,w}function O(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function q(w,y){const F=i.get(w);if(w.isVideoTexture&&rt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&F.__version!==w.version){const X=w.image;if(X===null)Vt("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Vt("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(F,w,y);return}}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,F.__webglTexture,e.TEXTURE0+y)}function V(w,y){const F=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Q(F,w,y);return}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);n.bindTexture(e.TEXTURE_2D_ARRAY,F.__webglTexture,e.TEXTURE0+y)}function H(w,y){const F=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Q(F,w,y);return}n.bindTexture(e.TEXTURE_3D,F.__webglTexture,e.TEXTURE0+y)}function K(w,y){const F=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&F.__version!==w.version){it(F,w,y);return}n.bindTexture(e.TEXTURE_CUBE_MAP,F.__webglTexture,e.TEXTURE0+y)}const dt={[xf]:e.REPEAT,[vi]:e.CLAMP_TO_EDGE,[yf]:e.MIRRORED_REPEAT},ct={[De]:e.NEAREST,[hS]:e.NEAREST_MIPMAP_NEAREST,[vo]:e.NEAREST_MIPMAP_LINEAR,[Ne]:e.LINEAR,[Pc]:e.LINEAR_MIPMAP_NEAREST,[br]:e.LINEAR_MIPMAP_LINEAR},ht={[vS]:e.NEVER,[SS]:e.ALWAYS,[_S]:e.LESS,[Nu]:e.LEQUAL,[gS]:e.EQUAL,[Fu]:e.GEQUAL,[xS]:e.GREATER,[yS]:e.NOTEQUAL};function Rt(w,y){if(y.type===kn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Ne||y.magFilter===Pc||y.magFilter===vo||y.magFilter===br||y.minFilter===Ne||y.minFilter===Pc||y.minFilter===vo||y.minFilter===br)&&Vt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(w,e.TEXTURE_WRAP_S,dt[y.wrapS]),e.texParameteri(w,e.TEXTURE_WRAP_T,dt[y.wrapT]),(w===e.TEXTURE_3D||w===e.TEXTURE_2D_ARRAY)&&e.texParameteri(w,e.TEXTURE_WRAP_R,dt[y.wrapR]),e.texParameteri(w,e.TEXTURE_MAG_FILTER,ct[y.magFilter]),e.texParameteri(w,e.TEXTURE_MIN_FILTER,ct[y.minFilter]),y.compareFunction&&(e.texParameteri(w,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(w,e.TEXTURE_COMPARE_FUNC,ht[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===De||y.minFilter!==vo&&y.minFilter!==br||y.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");e.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function It(w,y){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",E));const X=y.source;let j=h.get(X);j===void 0&&(j={},h.set(X,j));const W=O(y);if(W!==w.__cacheKey){j[W]===void 0&&(j[W]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,F=!0),j[W].usedTimes++;const Tt=j[w.__cacheKey];Tt!==void 0&&(j[w.__cacheKey].usedTimes--,Tt.usedTimes===0&&g(y)),w.__cacheKey=W,w.__webglTexture=j[W].texture}return F}function qt(w,y,F){return Math.floor(Math.floor(w/F)/y)}function Kt(w,y,F,X){const W=w.updateRanges;if(W.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,y.width,y.height,F,X,y.data);else{W.sort((lt,_t)=>lt.start-_t.start);let Tt=0;for(let lt=1;lt<W.length;lt++){const _t=W[Tt],xt=W[lt],Ct=_t.start+_t.count,vt=qt(xt.start,y.width,4),Wt=qt(_t.start,y.width,4);xt.start<=Ct+1&&vt===Wt&&qt(xt.start+xt.count-1,y.width,4)===vt?_t.count=Math.max(_t.count,xt.start+xt.count-_t.start):(++Tt,W[Tt]=xt)}W.length=Tt+1;const ft=e.getParameter(e.UNPACK_ROW_LENGTH),At=e.getParameter(e.UNPACK_SKIP_PIXELS),Nt=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,y.width);for(let lt=0,_t=W.length;lt<_t;lt++){const xt=W[lt],Ct=Math.floor(xt.start/4),vt=Math.ceil(xt.count/4),Wt=Ct%y.width,B=Math.floor(Ct/y.width),wt=vt,pt=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,Wt),e.pixelStorei(e.UNPACK_SKIP_ROWS,B),n.texSubImage2D(e.TEXTURE_2D,0,Wt,B,wt,pt,F,X,y.data)}w.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ft),e.pixelStorei(e.UNPACK_SKIP_PIXELS,At),e.pixelStorei(e.UNPACK_SKIP_ROWS,Nt)}}function Q(w,y,F){let X=e.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=e.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=e.TEXTURE_3D);const j=It(w,y),W=y.source;n.bindTexture(X,w.__webglTexture,e.TEXTURE0+F);const Tt=i.get(W);if(W.version!==Tt.__version||j===!0){n.activeTexture(e.TEXTURE0+F);const ft=Jt.getPrimaries(Jt.workingColorSpace),At=y.colorSpace===$i?null:Jt.getPrimaries(y.colorSpace),Nt=y.colorSpace===$i||ft===At?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let lt=_(y.image,!1,r.maxTextureSize);lt=tt(y,lt);const _t=s.convert(y.format,y.colorSpace),xt=s.convert(y.type);let Ct=b(y.internalFormat,_t,xt,y.colorSpace,y.isVideoTexture);Rt(X,y);let vt;const Wt=y.mipmaps,B=y.isVideoTexture!==!0,wt=Tt.__version===void 0||j===!0,pt=W.dataReady,Pt=T(y,lt);if(y.isDepthTexture)Ct=S(y.format===Tr,y.type),wt&&(B?n.texStorage2D(e.TEXTURE_2D,1,Ct,lt.width,lt.height):n.texImage2D(e.TEXTURE_2D,0,Ct,lt.width,lt.height,0,_t,xt,null));else if(y.isDataTexture)if(Wt.length>0){B&&wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,Wt[0].width,Wt[0].height);for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,xt,vt.data):n.texImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,_t,xt,vt.data);y.generateMipmaps=!1}else B?(wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,lt.width,lt.height),pt&&Kt(y,lt,_t,xt)):n.texImage2D(e.TEXTURE_2D,0,Ct,lt.width,lt.height,0,_t,xt,lt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){B&&wt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,Pt,Ct,Wt[0].width,Wt[0].height,lt.depth);for(let ut=0,at=Wt.length;ut<at;ut++)if(vt=Wt[ut],y.format!==Dn)if(_t!==null)if(B){if(pt)if(y.layerUpdates.size>0){const gt=Rg(vt.width,vt.height,y.format,y.type);for(const Gt of y.layerUpdates){const pe=vt.data.subarray(Gt*gt/vt.data.BYTES_PER_ELEMENT,(Gt+1)*gt/vt.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,Gt,vt.width,vt.height,1,_t,pe)}y.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,0,vt.width,vt.height,lt.depth,_t,vt.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,ut,Ct,vt.width,vt.height,lt.depth,0,vt.data,0,0);else Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?pt&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,ut,0,0,0,vt.width,vt.height,lt.depth,_t,xt,vt.data):n.texImage3D(e.TEXTURE_2D_ARRAY,ut,Ct,vt.width,vt.height,lt.depth,0,_t,xt,vt.data)}else{B&&wt&&n.texStorage2D(e.TEXTURE_2D,Pt,Ct,Wt[0].width,Wt[0].height);for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],y.format!==Dn?_t!==null?B?pt&&n.compressedTexSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,vt.data):n.compressedTexImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,vt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,vt.width,vt.height,_t,xt,vt.data):n.texImage2D(e.TEXTURE_2D,ut,Ct,vt.width,vt.height,0,_t,xt,vt.data)}else if(y.isDataArrayTexture)if(B){if(wt&&n.texStorage3D(e.TEXTURE_2D_ARRAY,Pt,Ct,lt.width,lt.height,lt.depth),pt)if(y.layerUpdates.size>0){const ut=Rg(lt.width,lt.height,y.format,y.type);for(const at of y.layerUpdates){const gt=lt.data.subarray(at*ut/lt.data.BYTES_PER_ELEMENT,(at+1)*ut/lt.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,at,lt.width,lt.height,1,_t,xt,gt)}y.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,_t,xt,lt.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Ct,lt.width,lt.height,lt.depth,0,_t,xt,lt.data);else if(y.isData3DTexture)B?(wt&&n.texStorage3D(e.TEXTURE_3D,Pt,Ct,lt.width,lt.height,lt.depth),pt&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,_t,xt,lt.data)):n.texImage3D(e.TEXTURE_3D,0,Ct,lt.width,lt.height,lt.depth,0,_t,xt,lt.data);else if(y.isFramebufferTexture){if(wt)if(B)n.texStorage2D(e.TEXTURE_2D,Pt,Ct,lt.width,lt.height);else{let ut=lt.width,at=lt.height;for(let gt=0;gt<Pt;gt++)n.texImage2D(e.TEXTURE_2D,gt,Ct,ut,at,0,_t,xt,null),ut>>=1,at>>=1}}else if(Wt.length>0){if(B&&wt){const ut=st(Wt[0]);n.texStorage2D(e.TEXTURE_2D,Pt,Ct,ut.width,ut.height)}for(let ut=0,at=Wt.length;ut<at;ut++)vt=Wt[ut],B?pt&&n.texSubImage2D(e.TEXTURE_2D,ut,0,0,_t,xt,vt):n.texImage2D(e.TEXTURE_2D,ut,Ct,_t,xt,vt);y.generateMipmaps=!1}else if(B){if(wt){const ut=st(lt);n.texStorage2D(e.TEXTURE_2D,Pt,Ct,ut.width,ut.height)}pt&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,_t,xt,lt)}else n.texImage2D(e.TEXTURE_2D,0,Ct,_t,xt,lt);m(y)&&p(X),Tt.__version=W.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function it(w,y,F){if(y.image.length!==6)return;const X=It(w,y),j=y.source;n.bindTexture(e.TEXTURE_CUBE_MAP,w.__webglTexture,e.TEXTURE0+F);const W=i.get(j);if(j.version!==W.__version||X===!0){n.activeTexture(e.TEXTURE0+F);const Tt=Jt.getPrimaries(Jt.workingColorSpace),ft=y.colorSpace===$i?null:Jt.getPrimaries(y.colorSpace),At=y.colorSpace===$i||Tt===ft?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Nt=y.isCompressedTexture||y.image[0].isCompressedTexture,lt=y.image[0]&&y.image[0].isDataTexture,_t=[];for(let at=0;at<6;at++)!Nt&&!lt?_t[at]=_(y.image[at],!0,r.maxCubemapSize):_t[at]=lt?y.image[at].image:y.image[at],_t[at]=tt(y,_t[at]);const xt=_t[0],Ct=s.convert(y.format,y.colorSpace),vt=s.convert(y.type),Wt=b(y.internalFormat,Ct,vt,y.colorSpace),B=y.isVideoTexture!==!0,wt=W.__version===void 0||X===!0,pt=j.dataReady;let Pt=T(y,xt);Rt(e.TEXTURE_CUBE_MAP,y);let ut;if(Nt){B&&wt&&n.texStorage2D(e.TEXTURE_CUBE_MAP,Pt,Wt,xt.width,xt.height);for(let at=0;at<6;at++){ut=_t[at].mipmaps;for(let gt=0;gt<ut.length;gt++){const Gt=ut[gt];y.format!==Dn?Ct!==null?B?pt&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,0,0,Gt.width,Gt.height,Ct,Gt.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,Wt,Gt.width,Gt.height,0,Gt.data):Vt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,0,0,Gt.width,Gt.height,Ct,vt,Gt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt,Wt,Gt.width,Gt.height,0,Ct,vt,Gt.data)}}}else{if(ut=y.mipmaps,B&&wt){ut.length>0&&Pt++;const at=st(_t[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,Pt,Wt,at.width,at.height)}for(let at=0;at<6;at++)if(lt){B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,_t[at].width,_t[at].height,Ct,vt,_t[at].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,_t[at].width,_t[at].height,0,Ct,vt,_t[at].data);for(let gt=0;gt<ut.length;gt++){const pe=ut[gt].image[at].image;B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,0,0,pe.width,pe.height,Ct,vt,pe.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,Wt,pe.width,pe.height,0,Ct,vt,pe.data)}}else{B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ct,vt,_t[at]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Wt,Ct,vt,_t[at]);for(let gt=0;gt<ut.length;gt++){const Gt=ut[gt];B?pt&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,0,0,Ct,vt,Gt.image[at]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+at,gt+1,Wt,Ct,vt,Gt.image[at])}}}m(y)&&p(e.TEXTURE_CUBE_MAP),W.__version=j.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Mt(w,y,F,X,j,W){const Tt=s.convert(F.format,F.colorSpace),ft=s.convert(F.type),At=b(F.internalFormat,Tt,ft,F.colorSpace),Nt=i.get(y),lt=i.get(F);if(lt.__renderTarget=y,!Nt.__hasExternalTextures){const _t=Math.max(1,y.width>>W),xt=Math.max(1,y.height>>W);j===e.TEXTURE_3D||j===e.TEXTURE_2D_ARRAY?n.texImage3D(j,W,At,_t,xt,y.depth,0,Tt,ft,null):n.texImage2D(j,W,At,_t,xt,0,Tt,ft,null)}n.bindFramebuffer(e.FRAMEBUFFER,w),ot(y)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,X,j,lt.__webglTexture,0,L(y)):(j===e.TEXTURE_2D||j>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,X,j,lt.__webglTexture,W),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ut(w,y,F){if(e.bindRenderbuffer(e.RENDERBUFFER,w),y.depthBuffer){const X=y.depthTexture,j=X&&X.isDepthTexture?X.type:null,W=S(y.stencilBuffer,j),Tt=y.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ot(y)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,L(y),W,y.width,y.height):F?e.renderbufferStorageMultisample(e.RENDERBUFFER,L(y),W,y.width,y.height):e.renderbufferStorage(e.RENDERBUFFER,W,y.width,y.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Tt,e.RENDERBUFFER,w)}else{const X=y.textures;for(let j=0;j<X.length;j++){const W=X[j],Tt=s.convert(W.format,W.colorSpace),ft=s.convert(W.type),At=b(W.internalFormat,Tt,ft,W.colorSpace);ot(y)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,L(y),At,y.width,y.height):F?e.renderbufferStorageMultisample(e.RENDERBUFFER,L(y),At,y.width,y.height):e.renderbufferStorage(e.RENDERBUFFER,At,y.width,y.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function mt(w,y,F){const X=y.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(y.depthTexture);if(j.__renderTarget=y,(!j.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),X){if(j.__webglInit===void 0&&(j.__webglInit=!0,y.depthTexture.addEventListener("dispose",E)),j.__webglTexture===void 0){j.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,j.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,y.depthTexture);const Nt=s.convert(y.depthTexture.format),lt=s.convert(y.depthTexture.type);let _t;y.depthTexture.format===wi?_t=e.DEPTH_COMPONENT24:y.depthTexture.format===Tr&&(_t=e.DEPTH24_STENCIL8);for(let xt=0;xt<6;xt++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,_t,y.width,y.height,0,Nt,lt,null)}}else q(y.depthTexture,0);const W=j.__webglTexture,Tt=L(y),ft=X?e.TEXTURE_CUBE_MAP_POSITIVE_X+F:e.TEXTURE_2D,At=y.depthTexture.format===Tr?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(y.depthTexture.format===wi)ot(y)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,At,ft,W,0,Tt):e.framebufferTexture2D(e.FRAMEBUFFER,At,ft,W,0);else if(y.depthTexture.format===Tr)ot(y)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,At,ft,W,0,Tt):e.framebufferTexture2D(e.FRAMEBUFFER,At,ft,W,0);else throw new Error("Unknown depthTexture format")}function bt(w){const y=i.get(w),F=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const X=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){const j=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),y.__depthDisposeCallback=j}y.__boundDepthTexture=X}if(w.depthTexture&&!y.__autoAllocateDepthBuffer)if(F)for(let X=0;X<6;X++)mt(y.__webglFramebuffer[X],w,X);else{const X=w.texture.mipmaps;X&&X.length>0?mt(y.__webglFramebuffer[0],w,0):mt(y.__webglFramebuffer,w,0)}else if(F){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(n.bindFramebuffer(e.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=e.createRenderbuffer(),Ut(y.__webglDepthbuffer[X],w,!1);else{const j=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer[X];e.bindRenderbuffer(e.RENDERBUFFER,W),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,W)}}else{const X=w.texture.mipmaps;if(X&&X.length>0?n.bindFramebuffer(e.FRAMEBUFFER,y.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=e.createRenderbuffer(),Ut(y.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,W),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,W)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function D(w,y,F){const X=i.get(w);y!==void 0&&Mt(X.__webglFramebuffer,w,w.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),F!==void 0&&bt(w)}function U(w){const y=w.texture,F=i.get(w),X=i.get(y);w.addEventListener("dispose",C);const j=w.textures,W=w.isWebGLCubeRenderTarget===!0,Tt=j.length>1;if(Tt||(X.__webglTexture===void 0&&(X.__webglTexture=e.createTexture()),X.__version=y.version,a.memory.textures++),W){F.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer[ft]=[];for(let At=0;At<y.mipmaps.length;At++)F.__webglFramebuffer[ft][At]=e.createFramebuffer()}else F.__webglFramebuffer[ft]=e.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer=[];for(let ft=0;ft<y.mipmaps.length;ft++)F.__webglFramebuffer[ft]=e.createFramebuffer()}else F.__webglFramebuffer=e.createFramebuffer();if(Tt)for(let ft=0,At=j.length;ft<At;ft++){const Nt=i.get(j[ft]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=e.createTexture(),a.memory.textures++)}if(w.samples>0&&ot(w)===!1){F.__webglMultisampledFramebuffer=e.createFramebuffer(),F.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ft=0;ft<j.length;ft++){const At=j[ft];F.__webglColorRenderbuffer[ft]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,F.__webglColorRenderbuffer[ft]);const Nt=s.convert(At.format,At.colorSpace),lt=s.convert(At.type),_t=b(At.internalFormat,Nt,lt,At.colorSpace,w.isXRRenderTarget===!0),xt=L(w);e.renderbufferStorageMultisample(e.RENDERBUFFER,xt,_t,w.width,w.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ft,e.RENDERBUFFER,F.__webglColorRenderbuffer[ft])}e.bindRenderbuffer(e.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=e.createRenderbuffer(),Ut(F.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(W){n.bindTexture(e.TEXTURE_CUBE_MAP,X.__webglTexture),Rt(e.TEXTURE_CUBE_MAP,y);for(let ft=0;ft<6;ft++)if(y.mipmaps&&y.mipmaps.length>0)for(let At=0;At<y.mipmaps.length;At++)Mt(F.__webglFramebuffer[ft][At],w,y,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ft,At);else Mt(F.__webglFramebuffer[ft],w,y,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);m(y)&&p(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Tt){for(let ft=0,At=j.length;ft<At;ft++){const Nt=j[ft],lt=i.get(Nt);let _t=e.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_t=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(_t,lt.__webglTexture),Rt(_t,Nt),Mt(F.__webglFramebuffer,w,Nt,e.COLOR_ATTACHMENT0+ft,_t,0),m(Nt)&&p(_t)}n.unbindTexture()}else{let ft=e.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ft=w.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(ft,X.__webglTexture),Rt(ft,y),y.mipmaps&&y.mipmaps.length>0)for(let At=0;At<y.mipmaps.length;At++)Mt(F.__webglFramebuffer[At],w,y,e.COLOR_ATTACHMENT0,ft,At);else Mt(F.__webglFramebuffer,w,y,e.COLOR_ATTACHMENT0,ft,0);m(y)&&p(ft),n.unbindTexture()}w.depthBuffer&&bt(w)}function G(w){const y=w.textures;for(let F=0,X=y.length;F<X;F++){const j=y[F];if(m(j)){const W=x(w),Tt=i.get(j).__webglTexture;n.bindTexture(W,Tt),p(W),n.unbindTexture()}}}const et=[],J=[];function nt(w){if(w.samples>0){if(ot(w)===!1){const y=w.textures,F=w.width,X=w.height;let j=e.COLOR_BUFFER_BIT;const W=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Tt=i.get(w),ft=y.length>1;if(ft)for(let Nt=0;Nt<y.length;Nt++)n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer);const At=w.texture.mipmaps;At&&At.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let Nt=0;Nt<y.length;Nt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(j|=e.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(j|=e.STENCIL_BUFFER_BIT)),ft){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Tt.__webglColorRenderbuffer[Nt]);const lt=i.get(y[Nt]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,lt,0)}e.blitFramebuffer(0,0,F,X,0,0,F,X,j,e.NEAREST),l===!0&&(et.length=0,J.length=0,et.push(e.COLOR_ATTACHMENT0+Nt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(et.push(W),J.push(W),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,J)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,et))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ft)for(let Nt=0;Nt<y.length;Nt++){n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.RENDERBUFFER,Tt.__webglColorRenderbuffer[Nt]);const lt=i.get(y[Nt]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,Tt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Nt,e.TEXTURE_2D,lt,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const y=w.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[y])}}}function L(w){return Math.min(r.maxSamples,w.samples)}function ot(w){const y=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function rt(w){const y=a.render.frame;f.get(w)!==y&&(f.set(w,y),w.update())}function tt(w,y){const F=w.colorSpace,X=w.format,j=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==Ls&&F!==$i&&(Jt.getTransfer(F)===ne?(X!==Dn||j!==_n)&&Vt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qt("WebGLTextures: Unsupported texture color space:",F)),y}function st(w){return typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame!="undefined"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=I,this.setTexture2D=q,this.setTexture2DArray=V,this.setTexture3D=H,this.setTextureCube=K,this.rebindTextures=D,this.setupRenderTarget=U,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=bt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=ot,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function kS(e,t){function n(i,r=$i){let s;const a=Jt.getTransfer(r);if(i===_n)return e.UNSIGNED_BYTE;if(i===Ru)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Pu)return e.UNSIGNED_SHORT_5_5_5_1;if(i===vm)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===_m)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===pm)return e.BYTE;if(i===mm)return e.SHORT;if(i===Ra)return e.UNSIGNED_SHORT;if(i===Cu)return e.INT;if(i===ti)return e.UNSIGNED_INT;if(i===kn)return e.FLOAT;if(i===Ei)return e.HALF_FLOAT;if(i===gm)return e.ALPHA;if(i===xm)return e.RGB;if(i===Dn)return e.RGBA;if(i===wi)return e.DEPTH_COMPONENT;if(i===Tr)return e.DEPTH_STENCIL;if(i===ym)return e.RED;if(i===Lu)return e.RED_INTEGER;if(i===Ps)return e.RG;if(i===Du)return e.RG_INTEGER;if(i===Iu)return e.RGBA_INTEGER;if(i===Fo||i===Uo||i===Oo||i===Bo)if(a===ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Fo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Uo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Oo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Bo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Fo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Uo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Oo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Bo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Sf||i===Mf||i===bf||i===Tf)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Sf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Mf)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===bf)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Tf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ef||i===wf||i===Af||i===Cf||i===Rf||i===Pf||i===Lf)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ef||i===wf)return a===ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Af)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Cf)return s.COMPRESSED_R11_EAC;if(i===Rf)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Pf)return s.COMPRESSED_RG11_EAC;if(i===Lf)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Df||i===If||i===Nf||i===Ff||i===Uf||i===Of||i===Bf||i===Hf||i===zf||i===Vf||i===Gf||i===kf||i===Wf||i===Xf)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Df)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===If)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Nf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ff)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Uf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Of)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Bf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Hf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===zf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Vf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Gf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===kf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Wf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xf)return a===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===qf||i===Yf||i===$f)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===qf)return a===ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Yf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$f)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Kf||i===Zf||i===Jf||i===jf)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Kf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Zf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Jf)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===jf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Pa?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}const mN=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vN=`
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

}`;class _N{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n){if(this.texture===null){const i=new Pm(t.texture);(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const n=t.cameras[0].viewport,i=new ei({vertexShader:mN,fragmentShader:vN,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Ci(new vl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gN extends Is{constructor(t,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,f=null,u=null,h=null,d=null,v=null;const _=typeof XRWebGLBinding!="undefined",m=new _N,p={},x=n.getContextAttributes();let b=null,S=null;const T=[],E=[],C=new oe;let R=null;const g=new Rn;g.viewport=new Se;const M=new Rn;M.viewport=new Se;const P=[g,M],I=new OS;let N=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let it=T[Q];return it===void 0&&(it=new Lc,T[Q]=it),it.getTargetRaySpace()},this.getControllerGrip=function(Q){let it=T[Q];return it===void 0&&(it=new Lc,T[Q]=it),it.getGripSpace()},this.getHand=function(Q){let it=T[Q];return it===void 0&&(it=new Lc,T[Q]=it),it.getHandSpace()};function q(Q){const it=E.indexOf(Q.inputSource);if(it===-1)return;const Mt=T[it];Mt!==void 0&&(Mt.update(Q.inputSource,Q.frame,c||a),Mt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",H);for(let Q=0;Q<T.length;Q++){const it=E[Q];it!==null&&(E[Q]=null,T[Q].disconnect(it))}N=null,O=null,m.reset();for(const Q in p)delete p[Q];t.setRenderTarget(b),d=null,h=null,u=null,r=null,S=null,Kt.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&Vt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Vt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(r,n)),u},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=function(Q){return Wu(this,null,function*(){if(r=Q,r!==null){if(b=t.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",V),r.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&(yield n.makeXRCompatible()),R=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,Ut=null,mt=null;x.depth&&(mt=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Mt=x.stencil?Tr:wi,Ut=x.stencil?Pa:ti);const bt={colorFormat:n.RGBA8,depthFormat:mt,scaleFactor:s};u=this.getBinding(),h=u.createProjectionLayer(bt),r.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),S=new $n(h.textureWidth,h.textureHeight,{format:Dn,type:_n,depthTexture:new Ia(h.textureWidth,h.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Mt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Mt),r.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new $n(d.framebufferWidth,d.framebufferHeight,{format:Dn,type:_n,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=yield r.requestReferenceSpace(o),Kt.setContext(r),Kt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H(Q){for(let it=0;it<Q.removed.length;it++){const Mt=Q.removed[it],Ut=E.indexOf(Mt);Ut>=0&&(E[Ut]=null,T[Ut].disconnect(Mt))}for(let it=0;it<Q.added.length;it++){const Mt=Q.added[it];let Ut=E.indexOf(Mt);if(Ut===-1){for(let bt=0;bt<T.length;bt++)if(bt>=E.length){E.push(Mt),Ut=bt;break}else if(E[bt]===null){E[bt]=Mt,Ut=bt;break}if(Ut===-1)break}const mt=T[Ut];mt&&mt.connect(Mt)}}const K=new $,dt=new $;function ct(Q,it,Mt){K.setFromMatrixPosition(it.matrixWorld),dt.setFromMatrixPosition(Mt.matrixWorld);const Ut=K.distanceTo(dt),mt=it.projectionMatrix.elements,bt=Mt.projectionMatrix.elements,D=mt[14]/(mt[10]-1),U=mt[14]/(mt[10]+1),G=(mt[9]+1)/mt[5],et=(mt[9]-1)/mt[5],J=(mt[8]-1)/mt[0],nt=(bt[8]+1)/bt[0],L=D*J,ot=D*nt,rt=Ut/(-J+nt),tt=rt*-J;if(it.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(tt),Q.translateZ(rt),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),mt[10]===-1)Q.projectionMatrix.copy(it.projectionMatrix),Q.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const st=D+rt,w=U+rt,y=L-tt,F=ot+(Ut-tt),X=G*U/w*st,j=et*U/w*st;Q.projectionMatrix.makePerspective(y,F,X,j,st,w),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ht(Q,it){it===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(it.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let it=Q.near,Mt=Q.far;m.texture!==null&&(m.depthNear>0&&(it=m.depthNear),m.depthFar>0&&(Mt=m.depthFar)),I.near=M.near=g.near=it,I.far=M.far=g.far=Mt,(N!==I.near||O!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),N=I.near,O=I.far),I.layers.mask=Q.layers.mask|6,g.layers.mask=I.layers.mask&3,M.layers.mask=I.layers.mask&5;const Ut=Q.parent,mt=I.cameras;ht(I,Ut);for(let bt=0;bt<mt.length;bt++)ht(mt[bt],Ut);mt.length===2?ct(I,g,M):I.projectionMatrix.copy(g.projectionMatrix),Rt(Q,I,Ut)};function Rt(Q,it,Mt){Mt===null?Q.matrix.copy(it.matrixWorld):(Q.matrix.copy(Mt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(it.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(it.projectionMatrix),Q.projectionMatrixInverse.copy(it.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Sp*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Q){l=Q,h!==null&&(h.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Q){return p[Q]};let It=null;function qt(Q,it){if(f=it.getViewerPose(c||a),v=it,f!==null){const Mt=f.views;d!==null&&(t.setRenderTargetFramebuffer(S,d.framebuffer),t.setRenderTarget(S));let Ut=!1;Mt.length!==I.cameras.length&&(I.cameras.length=0,Ut=!0);for(let U=0;U<Mt.length;U++){const G=Mt[U];let et=null;if(d!==null)et=d.getViewport(G);else{const nt=u.getViewSubImage(h,G);et=nt.viewport,U===0&&(t.setRenderTargetTextures(S,nt.colorTexture,nt.depthStencilTexture),t.setRenderTarget(S))}let J=P[U];J===void 0&&(J=new Rn,J.layers.enable(U),J.viewport=new Se,P[U]=J),J.matrix.fromArray(G.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(G.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(et.x,et.y,et.width,et.height),U===0&&(I.matrix.copy(J.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ut===!0&&I.cameras.push(J)}const mt=r.enabledFeatures;if(mt&&mt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const U=u.getDepthInformation(Mt[0]);U&&U.isValid&&U.texture&&m.init(U,r.renderState)}if(mt&&mt.includes("camera-access")&&_){t.state.unbindTexture(),u=i.getBinding();for(let U=0;U<Mt.length;U++){const G=Mt[U].camera;if(G){let et=p[G];et||(et=new Pm,p[G]=et);const J=u.getCameraImage(G);et.sourceTexture=J}}}}for(let Mt=0;Mt<T.length;Mt++){const Ut=E[Mt],mt=T[Mt];Ut!==null&&mt!==void 0&&mt.update(Ut,it,c||a)}It&&It(Q,it),it.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:it}),v=null}const Kt=new BS;Kt.setAnimationLoop(qt),this.setAnimationLoop=function(Q){It=Q},this.dispose=function(){}}}const ls=new Ai,xN=new Ee;function yN(e,t){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,RS(e)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,x,b,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),u(m,p)):p.isMeshPhongMaterial?(s(m,p),f(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),v(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,x,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),b=x.envMap,S=x.envMapRotation;b&&(m.envMap.value=b,ls.copy(S),ls.x*=-1,ls.y*=-1,ls.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ls.y*=-1,ls.z*=-1),m.envMapRotation.value.setFromMatrix4(xN.makeRotationFromEuler(ls)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=b*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function f(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===je&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function SN(e,t,n,i){let r={},s={},a=[];const o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,b){const S=b.program;i.uniformBlockBinding(x,S)}function c(x,b){let S=r[x.id];S===void 0&&(v(x),S=f(x),r[x.id]=S,x.addEventListener("dispose",m));const T=b.program;i.updateUBOMapping(x,T);const E=t.render.frame;s[x.id]!==E&&(h(x),s[x.id]=E)}function f(x){const b=u();x.__bindingPointIndex=b;const S=e.createBuffer(),T=x.__size,E=x.usage;return e.bindBuffer(e.UNIFORM_BUFFER,S),e.bufferData(e.UNIFORM_BUFFER,T,E),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,b,S),S}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Qt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const b=r[x.id],S=x.uniforms,T=x.__cache;e.bindBuffer(e.UNIFORM_BUFFER,b);for(let E=0,C=S.length;E<C;E++){const R=Array.isArray(S[E])?S[E]:[S[E]];for(let g=0,M=R.length;g<M;g++){const P=R[g];if(d(P,E,g,T)===!0){const I=P.__offset,N=Array.isArray(P.value)?P.value:[P.value];let O=0;for(let q=0;q<N.length;q++){const V=N[q],H=_(V);typeof V=="number"||typeof V=="boolean"?(P.__data[0]=V,e.bufferSubData(e.UNIFORM_BUFFER,I+O,P.__data)):V.isMatrix3?(P.__data[0]=V.elements[0],P.__data[1]=V.elements[1],P.__data[2]=V.elements[2],P.__data[3]=0,P.__data[4]=V.elements[3],P.__data[5]=V.elements[4],P.__data[6]=V.elements[5],P.__data[7]=0,P.__data[8]=V.elements[6],P.__data[9]=V.elements[7],P.__data[10]=V.elements[8],P.__data[11]=0):(V.toArray(P.__data,O),O+=H.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,I,P.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function d(x,b,S,T){const E=x.value,C=b+"_"+S;if(T[C]===void 0)return typeof E=="number"||typeof E=="boolean"?T[C]=E:T[C]=E.clone(),!0;{const R=T[C];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return T[C]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function v(x){const b=x.uniforms;let S=0;const T=16;for(let C=0,R=b.length;C<R;C++){const g=Array.isArray(b[C])?b[C]:[b[C]];for(let M=0,P=g.length;M<P;M++){const I=g[M],N=Array.isArray(I.value)?I.value:[I.value];for(let O=0,q=N.length;O<q;O++){const V=N[O],H=_(V),K=S%T,dt=K%H.boundary,ct=K+dt;S+=dt,ct!==0&&T-ct<H.storage&&(S+=T-ct),I.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=S,S+=H.storage}}}const E=S%T;return E>0&&(S+=T-E),x.__size=S,x.__cache={},this}function _(x){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=48,b.storage=48):x.isMatrix4?(b.boundary=64,b.storage=64):x.isTexture?Vt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Vt("WebGLRenderer: Unsupported uniform value type.",x),b}function m(x){const b=x.target;b.removeEventListener("dispose",m);const S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),e.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function p(){for(const x in r)e.deleteBuffer(r[x]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}const MN=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let fi=null;function bN(){return fi===null&&(fi=new DS(MN,16,16,Ps,Ei),fi.name="DFG_LUT",fi.minFilter=Ne,fi.magFilter=Ne,fi.wrapS=vi,fi.wrapT=vi,fi.generateMipmaps=!1,fi.needsUpdate=!0),fi}class TN{constructor(t={}){const{canvas:n=bS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:d=_n}=t;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=a;const _=d,m=new Set([Iu,Du,Lu]),p=new Set([_n,ti,Ra,Pa,Ru,Pu]),x=new Uint32Array(4),b=new Int32Array(4);let S=null,T=null;const E=[],C=[];let R=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let M=!1;this._outputColorSpace=mn;let P=0,I=0,N=null,O=-1,q=null;const V=new Se,H=new Se;let K=null;const dt=new ae(0);let ct=0,ht=n.width,Rt=n.height,It=1,qt=null,Kt=null;const Q=new Se(0,0,ht,Rt),it=new Se(0,0,ht,Rt);let Mt=!1;const Ut=new Rm;let mt=!1,bt=!1;const D=new Ee,U=new $,G=new Se,et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function nt(){return N===null?It:1}let L=i;function ot(A,z){return n.getContext(A,z)}try{const A={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:u};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Au}`),n.addEventListener("webglcontextlost",Gt,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",re,!1),L===null){const z="webgl2";if(L=ot(z,A),L===null)throw ot(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw Qt("WebGLRenderer: "+A.message),A}let rt,tt,st,w,y,F,X,j,W,Tt,ft,At,Nt,lt,_t,xt,Ct,vt,Wt,B,wt,pt,Pt,ut;function at(){rt=new T3(L),rt.init(),pt=new kS(L,rt),tt=new m3(L,rt,t,pt),st=new dN(L,rt),tt.reversedDepthBuffer&&h&&st.buffers.depth.setReversed(!0),w=new A3(L),y=new jI,F=new pN(L,rt,st,y,tt,pt,w),X=new _3(g),j=new b3(g),W=new L2(L),Pt=new d3(L,W),Tt=new E3(L,W,w,Pt),ft=new R3(L,Tt,W,w),Wt=new C3(L,tt,F),xt=new v3(y),At=new JI(g,X,j,rt,tt,Pt,xt),Nt=new yN(g,y),lt=new tN,_t=new aN(rt),vt=new h3(g,X,j,st,ft,v,l),Ct=new uN(g,ft,tt),ut=new SN(L,w,tt,st),B=new p3(L,rt,w),wt=new w3(L,rt,w),w.programs=At.programs,g.capabilities=tt,g.extensions=rt,g.properties=y,g.renderLists=lt,g.shadowMap=Ct,g.state=st,g.info=w}at(),_!==_n&&(R=new L3(_,n.width,n.height,r,s));const gt=new gN(g,L);this.xr=gt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const A=rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return It},this.setPixelRatio=function(A){A!==void 0&&(It=A,this.setSize(ht,Rt,!1))},this.getSize=function(A){return A.set(ht,Rt)},this.setSize=function(A,z,Z=!0){if(gt.isPresenting){Vt("WebGLRenderer: Can't change size while VR device is presenting.");return}ht=A,Rt=z,n.width=Math.floor(A*It),n.height=Math.floor(z*It),Z===!0&&(n.style.width=A+"px",n.style.height=z+"px"),R!==null&&R.setSize(n.width,n.height),this.setViewport(0,0,A,z)},this.getDrawingBufferSize=function(A){return A.set(ht*It,Rt*It).floor()},this.setDrawingBufferSize=function(A,z,Z){ht=A,Rt=z,It=Z,n.width=Math.floor(A*Z),n.height=Math.floor(z*Z),this.setViewport(0,0,A,z)},this.setEffects=function(A){if(_===_n){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let z=0;z<A.length;z++)if(A[z].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(V)},this.getViewport=function(A){return A.copy(Q)},this.setViewport=function(A,z,Z,Y){A.isVector4?Q.set(A.x,A.y,A.z,A.w):Q.set(A,z,Z,Y),st.viewport(V.copy(Q).multiplyScalar(It).round())},this.getScissor=function(A){return A.copy(it)},this.setScissor=function(A,z,Z,Y){A.isVector4?it.set(A.x,A.y,A.z,A.w):it.set(A,z,Z,Y),st.scissor(H.copy(it).multiplyScalar(It).round())},this.getScissorTest=function(){return Mt},this.setScissorTest=function(A){st.setScissorTest(Mt=A)},this.setOpaqueSort=function(A){qt=A},this.setTransparentSort=function(A){Kt=A},this.getClearColor=function(A){return A.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(A=!0,z=!0,Z=!0){let Y=0;if(A){let k=!1;if(N!==null){const yt=N.texture.format;k=m.has(yt)}if(k){const yt=N.texture.type,Lt=p.has(yt),Et=vt.getClearColor(),Dt=vt.getClearAlpha(),Ft=Et.r,zt=Et.g,Bt=Et.b;Lt?(x[0]=Ft,x[1]=zt,x[2]=Bt,x[3]=Dt,L.clearBufferuiv(L.COLOR,0,x)):(b[0]=Ft,b[1]=zt,b[2]=Bt,b[3]=Dt,L.clearBufferiv(L.COLOR,0,b))}else Y|=L.COLOR_BUFFER_BIT}z&&(Y|=L.DEPTH_BUFFER_BIT),Z&&(Y|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Gt,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",re,!1),vt.dispose(),lt.dispose(),_t.dispose(),y.dispose(),X.dispose(),j.dispose(),ft.dispose(),Pt.dispose(),ut.dispose(),At.dispose(),gt.dispose(),gt.removeEventListener("sessionstart",Im),gt.removeEventListener("sessionend",Nm),Ir.stop()};function Gt(A){A.preventDefault(),yp("WebGLRenderer: Context Lost."),M=!0}function pe(){yp("WebGLRenderer: Context Restored."),M=!1;const A=w.autoReset,z=Ct.enabled,Z=Ct.autoUpdate,Y=Ct.needsUpdate,k=Ct.type;at(),w.autoReset=A,Ct.enabled=z,Ct.autoUpdate=Z,Ct.needsUpdate=Y,Ct.type=k}function re(A){Qt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ii(A){const z=A.target;z.removeEventListener("dispose",ii),Li(z)}function Li(A){WS(A),y.remove(A)}function WS(A){const z=y.get(A).programs;z!==void 0&&(z.forEach(function(Z){At.releaseProgram(Z)}),A.isShaderMaterial&&At.releaseShaderCache(A))}this.renderBufferDirect=function(A,z,Z,Y,k,yt){z===null&&(z=et);const Lt=k.isMesh&&k.matrixWorld.determinant()<0,Et=qS(A,z,Z,Y,k);st.setMaterial(Y,Lt);let Dt=Z.index,Ft=1;if(Y.wireframe===!0){if(Dt=Tt.getWireframeAttribute(Z),Dt===void 0)return;Ft=2}const zt=Z.drawRange,Bt=Z.attributes.position;let $t=zt.start*Ft,le=(zt.start+zt.count)*Ft;yt!==null&&($t=Math.max($t,yt.start*Ft),le=Math.min(le,(yt.start+yt.count)*Ft)),Dt!==null?($t=Math.max($t,0),le=Math.min(le,Dt.count)):Bt!=null&&($t=Math.max($t,0),le=Math.min(le,Bt.count));const xe=le-$t;if(xe<0||xe===1/0)return;Pt.setup(k,Y,Et,Z,Dt);let ye,he=B;if(Dt!==null&&(ye=W.get(Dt),he=wt,he.setIndex(ye)),k.isMesh)Y.wireframe===!0?(st.setLineWidth(Y.wireframeLinewidth*nt()),he.setMode(L.LINES)):he.setMode(L.TRIANGLES);else if(k.isLine){let Ht=Y.linewidth;Ht===void 0&&(Ht=1),st.setLineWidth(Ht*nt()),k.isLineSegments?he.setMode(L.LINES):k.isLineLoop?he.setMode(L.LINE_LOOP):he.setMode(L.LINE_STRIP)}else k.isPoints?he.setMode(L.POINTS):k.isSprite&&he.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)La("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),he.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))he.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ht=k._multiDrawStarts,se=k._multiDrawCounts,te=k._multiDrawCount,fn=Dt?W.get(Dt).bytesPerElement:1,Ns=y.get(Y).currentProgram.getUniforms();for(let un=0;un<te;un++)Ns.setValue(L,"_gl_DrawID",un),he.render(Ht[un]/fn,se[un])}else if(k.isInstancedMesh)he.renderInstances($t,xe,k.count);else if(Z.isInstancedBufferGeometry){const Ht=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,se=Math.min(Z.instanceCount,Ht);he.renderInstances($t,xe,se)}else he.render($t,xe)};function Dm(A,z,Z){A.transparent===!0&&A.side===mi&&A.forceSinglePass===!1?(A.side=je,A.needsUpdate=!0,gl(A,z,Z),A.side=er,A.needsUpdate=!0,gl(A,z,Z),A.side=mi):gl(A,z,Z)}this.compile=function(A,z,Z=null){Z===null&&(Z=A),T=_t.get(Z),T.init(z),C.push(T),Z.traverseVisible(function(k){k.isLight&&k.layers.test(z.layers)&&(T.pushLight(k),k.castShadow&&T.pushShadow(k))}),A!==Z&&A.traverseVisible(function(k){k.isLight&&k.layers.test(z.layers)&&(T.pushLight(k),k.castShadow&&T.pushShadow(k))}),T.setupLights();const Y=new Set;return A.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const yt=k.material;if(yt)if(Array.isArray(yt))for(let Lt=0;Lt<yt.length;Lt++){const Et=yt[Lt];Dm(Et,Z,k),Y.add(Et)}else Dm(yt,Z,k),Y.add(yt)}),T=C.pop(),Y},this.compileAsync=function(A,z,Z=null){const Y=this.compile(A,z,Z);return new Promise(k=>{function yt(){if(Y.forEach(function(Lt){y.get(Lt).currentProgram.isReady()&&Y.delete(Lt)}),Y.size===0){k(A);return}setTimeout(yt,10)}rt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let zu=null;function XS(A){zu&&zu(A)}function Im(){Ir.stop()}function Nm(){Ir.start()}const Ir=new BS;Ir.setAnimationLoop(XS),typeof self!="undefined"&&Ir.setContext(self),this.setAnimationLoop=function(A){zu=A,gt.setAnimationLoop(A),A===null?Ir.stop():Ir.start()},gt.addEventListener("sessionstart",Im),gt.addEventListener("sessionend",Nm),this.render=function(A,z){if(z!==void 0&&z.isCamera!==!0){Qt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;const Z=gt.enabled===!0&&gt.isPresenting===!0,Y=R!==null&&(N===null||Z)&&R.begin(g,N);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),gt.enabled===!0&&gt.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(gt.cameraAutoUpdate===!0&&gt.updateCamera(z),z=gt.getCamera()),A.isScene===!0&&A.onBeforeRender(g,A,z,N),T=_t.get(A,C.length),T.init(z),C.push(T),D.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Ut.setFromProjectionMatrix(D,Wn,z.reversedDepth),bt=this.localClippingEnabled,mt=xt.init(this.clippingPlanes,bt),S=lt.get(A,E.length),S.init(),E.push(S),gt.enabled===!0&&gt.isPresenting===!0){const Lt=g.xr.getDepthSensingMesh();Lt!==null&&Vu(Lt,z,-1/0,g.sortObjects)}Vu(A,z,0,g.sortObjects),S.finish(),g.sortObjects===!0&&S.sort(qt,Kt),J=gt.enabled===!1||gt.isPresenting===!1||gt.hasDepthSensing()===!1,J&&vt.addToRenderList(S,A),this.info.render.frame++,mt===!0&&xt.beginShadows();const k=T.state.shadowsArray;if(Ct.render(k,A,z),mt===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(Y&&R.hasRenderPass())===!1){const Lt=S.opaque,Et=S.transmissive;if(T.setupLights(),z.isArrayCamera){const Dt=z.cameras;if(Et.length>0)for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Bt=Dt[Ft];Um(Lt,Et,A,Bt)}J&&vt.render(A);for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Bt=Dt[Ft];Fm(S,A,Bt,Bt.viewport)}}else Et.length>0&&Um(Lt,Et,A,z),J&&vt.render(A),Fm(S,A,z)}N!==null&&I===0&&(F.updateMultisampleRenderTarget(N),F.updateRenderTargetMipmap(N)),Y&&R.end(g),A.isScene===!0&&A.onAfterRender(g,A,z),Pt.resetDefaultState(),O=-1,q=null,C.pop(),C.length>0?(T=C[C.length-1],mt===!0&&xt.setGlobalState(g.clippingPlanes,T.state.camera)):T=null,E.pop(),E.length>0?S=E[E.length-1]:S=null};function Vu(A,z,Z,Y){if(A.visible===!1)return;if(A.layers.test(z.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(z);else if(A.isLight)T.pushLight(A),A.castShadow&&T.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Ut.intersectsSprite(A)){Y&&G.setFromMatrixPosition(A.matrixWorld).applyMatrix4(D);const Lt=ft.update(A),Et=A.material;Et.visible&&S.push(A,Lt,Et,Z,G.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Ut.intersectsObject(A))){const Lt=ft.update(A),Et=A.material;if(Y&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),G.copy(A.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),G.copy(Lt.boundingSphere.center)),G.applyMatrix4(A.matrixWorld).applyMatrix4(D)),Array.isArray(Et)){const Dt=Lt.groups;for(let Ft=0,zt=Dt.length;Ft<zt;Ft++){const Bt=Dt[Ft],$t=Et[Bt.materialIndex];$t&&$t.visible&&S.push(A,Lt,$t,Z,G.z,Bt)}}else Et.visible&&S.push(A,Lt,Et,Z,G.z,null)}}const yt=A.children;for(let Lt=0,Et=yt.length;Lt<Et;Lt++)Vu(yt[Lt],z,Z,Y)}function Fm(A,z,Z,Y){const{opaque:k,transmissive:yt,transparent:Lt}=A;T.setupLightsView(Z),mt===!0&&xt.setGlobalState(g.clippingPlanes,Z),Y&&st.viewport(V.copy(Y)),k.length>0&&_l(k,z,Z),yt.length>0&&_l(yt,z,Z),Lt.length>0&&_l(Lt,z,Z),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Um(A,z,Z,Y){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[Y.id]===void 0){const $t=rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[Y.id]=new $n(1,1,{generateMipmaps:!0,type:$t?Ei:_n,minFilter:br,samples:tt.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Jt.workingColorSpace})}const yt=T.state.transmissionRenderTarget[Y.id],Lt=Y.viewport||V;yt.setSize(Lt.z*g.transmissionResolutionScale,Lt.w*g.transmissionResolutionScale);const Et=g.getRenderTarget(),Dt=g.getActiveCubeFace(),Ft=g.getActiveMipmapLevel();g.setRenderTarget(yt),g.getClearColor(dt),ct=g.getClearAlpha(),ct<1&&g.setClearColor(16777215,.5),g.clear(),J&&vt.render(Z);const zt=g.toneMapping;g.toneMapping=Yn;const Bt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),T.setupLightsView(Y),mt===!0&&xt.setGlobalState(g.clippingPlanes,Y),_l(A,Z,Y),F.updateMultisampleRenderTarget(yt),F.updateRenderTargetMipmap(yt),rt.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let le=0,xe=z.length;le<xe;le++){const ye=z[le],{object:he,geometry:Ht,material:se,group:te}=ye;if(se.side===mi&&he.layers.test(Y.layers)){const fn=se.side;se.side=je,se.needsUpdate=!0,Om(he,Z,Y,Ht,se,te),se.side=fn,se.needsUpdate=!0,$t=!0}}$t===!0&&(F.updateMultisampleRenderTarget(yt),F.updateRenderTargetMipmap(yt))}g.setRenderTarget(Et,Dt,Ft),g.setClearColor(dt,ct),Bt!==void 0&&(Y.viewport=Bt),g.toneMapping=zt}function _l(A,z,Z){const Y=z.isScene===!0?z.overrideMaterial:null;for(let k=0,yt=A.length;k<yt;k++){const Lt=A[k],{object:Et,geometry:Dt,group:Ft}=Lt;let zt=Lt.material;zt.allowOverride===!0&&Y!==null&&(zt=Y),Et.layers.test(Z.layers)&&Om(Et,z,Z,Dt,zt,Ft)}}function Om(A,z,Z,Y,k,yt){A.onBeforeRender(g,z,Z,Y,k,yt),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),k.onBeforeRender(g,z,Z,Y,A,yt),k.transparent===!0&&k.side===mi&&k.forceSinglePass===!1?(k.side=je,k.needsUpdate=!0,g.renderBufferDirect(Z,z,Y,k,A,yt),k.side=er,k.needsUpdate=!0,g.renderBufferDirect(Z,z,Y,k,A,yt),k.side=mi):g.renderBufferDirect(Z,z,Y,k,A,yt),A.onAfterRender(g,z,Z,Y,k,yt)}function gl(A,z,Z){z.isScene!==!0&&(z=et);const Y=y.get(A),k=T.state.lights,yt=T.state.shadowsArray,Lt=k.state.version,Et=At.getParameters(A,k.state,yt,z,Z),Dt=At.getProgramCacheKey(Et);let Ft=Y.programs;Y.environment=A.isMeshStandardMaterial?z.environment:null,Y.fog=z.fog,Y.envMap=(A.isMeshStandardMaterial?j:X).get(A.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&A.envMap===null?z.environmentRotation:A.envMapRotation,Ft===void 0&&(A.addEventListener("dispose",ii),Ft=new Map,Y.programs=Ft);let zt=Ft.get(Dt);if(zt!==void 0){if(Y.currentProgram===zt&&Y.lightsStateVersion===Lt)return Hm(A,Et),zt}else Et.uniforms=At.getUniforms(A),A.onBeforeCompile(Et,g),zt=At.acquireProgram(Et,Dt),Ft.set(Dt,zt),Y.uniforms=Et.uniforms;const Bt=Y.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Bt.clippingPlanes=xt.uniform),Hm(A,Et),Y.needsLights=$S(A),Y.lightsStateVersion=Lt,Y.needsLights&&(Bt.ambientLightColor.value=k.state.ambient,Bt.lightProbe.value=k.state.probe,Bt.directionalLights.value=k.state.directional,Bt.directionalLightShadows.value=k.state.directionalShadow,Bt.spotLights.value=k.state.spot,Bt.spotLightShadows.value=k.state.spotShadow,Bt.rectAreaLights.value=k.state.rectArea,Bt.ltc_1.value=k.state.rectAreaLTC1,Bt.ltc_2.value=k.state.rectAreaLTC2,Bt.pointLights.value=k.state.point,Bt.pointLightShadows.value=k.state.pointShadow,Bt.hemisphereLights.value=k.state.hemi,Bt.directionalShadowMap.value=k.state.directionalShadowMap,Bt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Bt.spotShadowMap.value=k.state.spotShadowMap,Bt.spotLightMatrix.value=k.state.spotLightMatrix,Bt.spotLightMap.value=k.state.spotLightMap,Bt.pointShadowMap.value=k.state.pointShadowMap,Bt.pointShadowMatrix.value=k.state.pointShadowMatrix),Y.currentProgram=zt,Y.uniformsList=null,zt}function Bm(A){if(A.uniformsList===null){const z=A.currentProgram.getUniforms();A.uniformsList=Dc.seqWithValue(z.seq,A.uniforms)}return A.uniformsList}function Hm(A,z){const Z=y.get(A);Z.outputColorSpace=z.outputColorSpace,Z.batching=z.batching,Z.batchingColor=z.batchingColor,Z.instancing=z.instancing,Z.instancingColor=z.instancingColor,Z.instancingMorph=z.instancingMorph,Z.skinning=z.skinning,Z.morphTargets=z.morphTargets,Z.morphNormals=z.morphNormals,Z.morphColors=z.morphColors,Z.morphTargetsCount=z.morphTargetsCount,Z.numClippingPlanes=z.numClippingPlanes,Z.numIntersection=z.numClipIntersection,Z.vertexAlphas=z.vertexAlphas,Z.vertexTangents=z.vertexTangents,Z.toneMapping=z.toneMapping}function qS(A,z,Z,Y,k){z.isScene!==!0&&(z=et),F.resetTextureUnits();const yt=z.fog,Lt=Y.isMeshStandardMaterial?z.environment:null,Et=N===null?g.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Ls,Dt=(Y.isMeshStandardMaterial?j:X).get(Y.envMap||Lt),Ft=Y.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,zt=!!Z.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Bt=!!Z.morphAttributes.position,$t=!!Z.morphAttributes.normal,le=!!Z.morphAttributes.color;let xe=Yn;Y.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(xe=g.toneMapping);const ye=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,he=ye!==void 0?ye.length:0,Ht=y.get(Y),se=T.state.lights;if(mt===!0&&(bt===!0||A!==q)){const We=A===q&&Y.id===O;xt.setState(Y,A,We)}let te=!1;Y.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==se.state.version||Ht.outputColorSpace!==Et||k.isBatchedMesh&&Ht.batching===!1||!k.isBatchedMesh&&Ht.batching===!0||k.isBatchedMesh&&Ht.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ht.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ht.instancing===!1||!k.isInstancedMesh&&Ht.instancing===!0||k.isSkinnedMesh&&Ht.skinning===!1||!k.isSkinnedMesh&&Ht.skinning===!0||k.isInstancedMesh&&Ht.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ht.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ht.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ht.instancingMorph===!1&&k.morphTexture!==null||Ht.envMap!==Dt||Y.fog===!0&&Ht.fog!==yt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==xt.numPlanes||Ht.numIntersection!==xt.numIntersection)||Ht.vertexAlphas!==Ft||Ht.vertexTangents!==zt||Ht.morphTargets!==Bt||Ht.morphNormals!==$t||Ht.morphColors!==le||Ht.toneMapping!==xe||Ht.morphTargetsCount!==he)&&(te=!0):(te=!0,Ht.__version=Y.version);let fn=Ht.currentProgram;te===!0&&(fn=gl(Y,z,k));let Ns=!1,un=!1,Va=!1;const me=fn.getUniforms(),Qe=Ht.uniforms;if(st.useProgram(fn.program)&&(Ns=!0,un=!0,Va=!0),Y.id!==O&&(O=Y.id,un=!0),Ns||q!==A){st.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),me.setValue(L,"projectionMatrix",A.projectionMatrix),me.setValue(L,"viewMatrix",A.matrixWorldInverse);const tn=me.map.cameraPosition;tn!==void 0&&tn.setValue(L,U.setFromMatrixPosition(A.matrixWorld)),tt.logarithmicDepthBuffer&&me.setValue(L,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&me.setValue(L,"isOrthographic",A.isOrthographicCamera===!0),q!==A&&(q=A,un=!0,Va=!0)}if(Ht.needsLights&&(se.state.directionalShadowMap.length>0&&me.setValue(L,"directionalShadowMap",se.state.directionalShadowMap,F),se.state.spotShadowMap.length>0&&me.setValue(L,"spotShadowMap",se.state.spotShadowMap,F),se.state.pointShadowMap.length>0&&me.setValue(L,"pointShadowMap",se.state.pointShadowMap,F)),k.isSkinnedMesh){me.setOptional(L,k,"bindMatrix"),me.setOptional(L,k,"bindMatrixInverse");const We=k.skeleton;We&&(We.boneTexture===null&&We.computeBoneTexture(),me.setValue(L,"boneTexture",We.boneTexture,F))}k.isBatchedMesh&&(me.setOptional(L,k,"batchingTexture"),me.setValue(L,"batchingTexture",k._matricesTexture,F),me.setOptional(L,k,"batchingIdTexture"),me.setValue(L,"batchingIdTexture",k._indirectTexture,F),me.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&me.setValue(L,"batchingColorTexture",k._colorsTexture,F));const Sn=Z.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&Wt.update(k,Z,fn),(un||Ht.receiveShadow!==k.receiveShadow)&&(Ht.receiveShadow=k.receiveShadow,me.setValue(L,"receiveShadow",k.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Qe.envMap.value=Dt,Qe.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&z.environment!==null&&(Qe.envMapIntensity.value=z.environmentIntensity),Qe.dfgLUT!==void 0&&(Qe.dfgLUT.value=bN()),un&&(me.setValue(L,"toneMappingExposure",g.toneMappingExposure),Ht.needsLights&&YS(Qe,Va),yt&&Y.fog===!0&&Nt.refreshFogUniforms(Qe,yt),Nt.refreshMaterialUniforms(Qe,Y,It,Rt,T.state.transmissionRenderTarget[A.id]),Dc.upload(L,Bm(Ht),Qe,F)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Dc.upload(L,Bm(Ht),Qe,F),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&me.setValue(L,"center",k.center),me.setValue(L,"modelViewMatrix",k.modelViewMatrix),me.setValue(L,"normalMatrix",k.normalMatrix),me.setValue(L,"modelMatrix",k.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const We=Y.uniformsGroups;for(let tn=0,Gu=We.length;tn<Gu;tn++){const Nr=We[tn];ut.update(Nr,fn),ut.bind(Nr,fn)}}return fn}function YS(A,z){A.ambientLightColor.needsUpdate=z,A.lightProbe.needsUpdate=z,A.directionalLights.needsUpdate=z,A.directionalLightShadows.needsUpdate=z,A.pointLights.needsUpdate=z,A.pointLightShadows.needsUpdate=z,A.spotLights.needsUpdate=z,A.spotLightShadows.needsUpdate=z,A.rectAreaLights.needsUpdate=z,A.hemisphereLights.needsUpdate=z}function $S(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(A,z,Z){const Y=y.get(A);Y.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),y.get(A.texture).__webglTexture=z,y.get(A.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:Z,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,z){const Z=y.get(A);Z.__webglFramebuffer=z,Z.__useDefaultFramebuffer=z===void 0};const KS=L.createFramebuffer();this.setRenderTarget=function(A,z=0,Z=0){N=A,P=z,I=Z;let Y=null,k=!1,yt=!1;if(A){const Et=y.get(A);if(Et.__useDefaultFramebuffer!==void 0){st.bindFramebuffer(L.FRAMEBUFFER,Et.__webglFramebuffer),V.copy(A.viewport),H.copy(A.scissor),K=A.scissorTest,st.viewport(V),st.scissor(H),st.setScissorTest(K),O=-1;return}else if(Et.__webglFramebuffer===void 0)F.setupRenderTarget(A);else if(Et.__hasExternalTextures)F.rebindTextures(A,y.get(A.texture).__webglTexture,y.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const zt=A.depthTexture;if(Et.__boundDepthTexture!==zt){if(zt!==null&&y.has(zt)&&(A.width!==zt.image.width||A.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(A)}}const Dt=A.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(yt=!0);const Ft=y.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ft[z])?Y=Ft[z][Z]:Y=Ft[z],k=!0):A.samples>0&&F.useMultisampledRTT(A)===!1?Y=y.get(A).__webglMultisampledFramebuffer:Array.isArray(Ft)?Y=Ft[Z]:Y=Ft,V.copy(A.viewport),H.copy(A.scissor),K=A.scissorTest}else V.copy(Q).multiplyScalar(It).floor(),H.copy(it).multiplyScalar(It).floor(),K=Mt;if(Z!==0&&(Y=KS),st.bindFramebuffer(L.FRAMEBUFFER,Y)&&st.drawBuffers(A,Y),st.viewport(V),st.scissor(H),st.setScissorTest(K),k){const Et=y.get(A.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+z,Et.__webglTexture,Z)}else if(yt){const Et=z;for(let Dt=0;Dt<A.textures.length;Dt++){const Ft=y.get(A.textures[Dt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Dt,Ft.__webglTexture,Z,Et)}}else if(A!==null&&Z!==0){const Et=y.get(A.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Et.__webglTexture,Z)}O=-1},this.readRenderTargetPixels=function(A,z,Z,Y,k,yt,Lt,Et=0){if(!(A&&A.isWebGLRenderTarget)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=y.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt){st.bindFramebuffer(L.FRAMEBUFFER,Dt);try{const Ft=A.textures[Et],zt=Ft.format,Bt=Ft.type;if(!tt.textureFormatReadable(zt)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Bt)){Qt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=A.width-Y&&Z>=0&&Z<=A.height-k&&(A.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Et),L.readPixels(z,Z,Y,k,pt.convert(zt),pt.convert(Bt),yt))}finally{const Ft=N!==null?y.get(N).__webglFramebuffer:null;st.bindFramebuffer(L.FRAMEBUFFER,Ft)}}},this.readRenderTargetPixelsAsync=function(A,z,Z,Y,k,yt,Lt,Et=0){return Wu(this,null,function*(){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=y.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(Dt=Dt[Lt]),Dt)if(z>=0&&z<=A.width-Y&&Z>=0&&Z<=A.height-k){st.bindFramebuffer(L.FRAMEBUFFER,Dt);const Ft=A.textures[Et],zt=Ft.format,Bt=Ft.type;if(!tt.textureFormatReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $t=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,$t),L.bufferData(L.PIXEL_PACK_BUFFER,yt.byteLength,L.STREAM_READ),A.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Et),L.readPixels(z,Z,Y,k,pt.convert(zt),pt.convert(Bt),0);const le=N!==null?y.get(N).__webglFramebuffer:null;st.bindFramebuffer(L.FRAMEBUFFER,le);const xe=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),yield a2(L,xe,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,$t),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,yt),L.deleteBuffer($t),L.deleteSync(xe),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")})},this.copyFramebufferToTexture=function(A,z=null,Z=0){const Y=Math.pow(2,-Z),k=Math.floor(A.image.width*Y),yt=Math.floor(A.image.height*Y),Lt=z!==null?z.x:0,Et=z!==null?z.y:0;F.setTexture2D(A,0),L.copyTexSubImage2D(L.TEXTURE_2D,Z,0,0,Lt,Et,k,yt),st.unbindTexture()};const ZS=L.createFramebuffer(),JS=L.createFramebuffer();this.copyTextureToTexture=function(A,z,Z=null,Y=null,k=0,yt=null){yt===null&&(k!==0?(La("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),yt=k,k=0):yt=0);let Lt,Et,Dt,Ft,zt,Bt,$t,le,xe;const ye=A.isCompressedTexture?A.mipmaps[yt]:A.image;if(Z!==null)Lt=Z.max.x-Z.min.x,Et=Z.max.y-Z.min.y,Dt=Z.isBox3?Z.max.z-Z.min.z:1,Ft=Z.min.x,zt=Z.min.y,Bt=Z.isBox3?Z.min.z:0;else{const Sn=Math.pow(2,-k);Lt=Math.floor(ye.width*Sn),Et=Math.floor(ye.height*Sn),A.isDataArrayTexture?Dt=ye.depth:A.isData3DTexture?Dt=Math.floor(ye.depth*Sn):Dt=1,Ft=0,zt=0,Bt=0}Y!==null?($t=Y.x,le=Y.y,xe=Y.z):($t=0,le=0,xe=0);const he=pt.convert(z.format),Ht=pt.convert(z.type);let se;z.isData3DTexture?(F.setTexture3D(z,0),se=L.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(F.setTexture2DArray(z,0),se=L.TEXTURE_2D_ARRAY):(F.setTexture2D(z,0),se=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,z.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,z.unpackAlignment);const te=L.getParameter(L.UNPACK_ROW_LENGTH),fn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ns=L.getParameter(L.UNPACK_SKIP_PIXELS),un=L.getParameter(L.UNPACK_SKIP_ROWS),Va=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,ye.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ye.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ft),L.pixelStorei(L.UNPACK_SKIP_ROWS,zt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Bt);const me=A.isDataArrayTexture||A.isData3DTexture,Qe=z.isDataArrayTexture||z.isData3DTexture;if(A.isDepthTexture){const Sn=y.get(A),We=y.get(z),tn=y.get(Sn.__renderTarget),Gu=y.get(We.__renderTarget);st.bindFramebuffer(L.READ_FRAMEBUFFER,tn.__webglFramebuffer),st.bindFramebuffer(L.DRAW_FRAMEBUFFER,Gu.__webglFramebuffer);for(let Nr=0;Nr<Dt;Nr++)me&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,y.get(A).__webglTexture,k,Bt+Nr),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,y.get(z).__webglTexture,yt,xe+Nr)),L.blitFramebuffer(Ft,zt,Lt,Et,$t,le,Lt,Et,L.DEPTH_BUFFER_BIT,L.NEAREST);st.bindFramebuffer(L.READ_FRAMEBUFFER,null),st.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(k!==0||A.isRenderTargetTexture||y.has(A)){const Sn=y.get(A),We=y.get(z);st.bindFramebuffer(L.READ_FRAMEBUFFER,ZS),st.bindFramebuffer(L.DRAW_FRAMEBUFFER,JS);for(let tn=0;tn<Dt;tn++)me?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Sn.__webglTexture,k,Bt+tn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Sn.__webglTexture,k),Qe?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,We.__webglTexture,yt,xe+tn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,We.__webglTexture,yt),k!==0?L.blitFramebuffer(Ft,zt,Lt,Et,$t,le,Lt,Et,L.COLOR_BUFFER_BIT,L.NEAREST):Qe?L.copyTexSubImage3D(se,yt,$t,le,xe+tn,Ft,zt,Lt,Et):L.copyTexSubImage2D(se,yt,$t,le,Ft,zt,Lt,Et);st.bindFramebuffer(L.READ_FRAMEBUFFER,null),st.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Qe?A.isDataTexture||A.isData3DTexture?L.texSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,Ht,ye.data):z.isCompressedArrayTexture?L.compressedTexSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,ye.data):L.texSubImage3D(se,yt,$t,le,xe,Lt,Et,Dt,he,Ht,ye):A.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,yt,$t,le,Lt,Et,he,Ht,ye.data):A.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,yt,$t,le,ye.width,ye.height,he,ye.data):L.texSubImage2D(L.TEXTURE_2D,yt,$t,le,Lt,Et,he,Ht,ye);L.pixelStorei(L.UNPACK_ROW_LENGTH,te),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,fn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ns),L.pixelStorei(L.UNPACK_SKIP_ROWS,un),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Va),yt===0&&z.generateMipmaps&&L.generateMipmap(se),st.unbindTexture()},this.initRenderTarget=function(A){y.get(A).__webglFramebuffer===void 0&&F.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?F.setTextureCube(A,0):A.isData3DTexture?F.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?F.setTexture2DArray(A,0):F.setTexture2D(A,0),st.unbindTexture()},this.resetState=function(){P=0,I=0,N=null,st.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const n=this.getContext();n.drawingBufferColorSpace=Jt._getDrawingBufferColorSpace(t),n.unpackColorSpace=Jt._getUnpackColorSpace()}}const RF=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:cm,AddEquation:xr,AddOperation:uS,AdditiveBlending:pp,AgXToneMapping:um,AlphaFormat:gm,AlwaysCompare:SS,AlwaysDepth:uf,AlwaysStencilFunc:_p,ArrayCamera:OS,BackSide:je,BasicDepthPacking:dS,Box3:Ba,BoxGeometry:Ha,BufferAttribute:Kn,BufferGeometry:Pi,ByteType:pm,Camera:wm,CineonToneMapping:lm,ClampToEdgeWrapping:vi,Color:ae,ColorManagement:Jt,ConstantAlphaFactor:lS,ConstantColorFactor:aS,CubeCamera:LS,CubeDepthTexture:IS,CubeReflectionMapping:Lr,CubeRefractionMapping:Rs,CubeTexture:Am,CubeUVReflectionMapping:dl,CullFaceBack:dp,CullFaceFront:Wy,CullFaceNone:ky,CustomBlending:qy,CustomToneMapping:fm,Data3DTexture:wS,DataArrayTexture:Sm,DataTexture:DS,DepthFormat:wi,DepthStencilFormat:Tr,DepthTexture:Ia,DoubleSide:mi,DstAlphaFactor:eS,DstColorFactor:iS,EqualCompare:gS,EqualDepth:df,EquirectangularReflectionMapping:_f,EquirectangularRefractionMapping:gf,Euler:Ai,EventDispatcher:Is,ExternalTexture:Pm,Float32BufferAttribute:bi,FloatType:kn,FrontSide:er,Frustum:Rm,GLSL3:xp,GreaterCompare:xS,GreaterDepth:mf,GreaterEqualCompare:Fu,GreaterEqualDepth:pf,Group:_o,HalfFloatType:Ei,ImageUtils:TS,IntType:Cu,KeepStencilOp:fs,Layers:Mm,LessCompare:_S,LessDepth:hf,LessEqualCompare:Nu,LessEqualDepth:Cs,LinearFilter:Ne,LinearMipmapLinearFilter:br,LinearMipmapNearestFilter:Pc,LinearSRGBColorSpace:Ls,LinearToneMapping:am,LinearTransfer:il,Material:ml,Matrix3:Xt,Matrix4:Ee,MaxEquation:Zy,Mesh:Ci,MeshBasicMaterial:bm,MeshDepthMaterial:FS,MeshDistanceMaterial:US,MinEquation:Ky,MirroredRepeatWrapping:yf,MixOperation:fS,MultiplyBlending:vp,MultiplyOperation:sm,NearestFilter:De,NearestMipmapLinearFilter:vo,NearestMipmapNearestFilter:hS,NeutralToneMapping:hm,NeverCompare:vS,NeverDepth:ff,NoBlending:Mi,NoColorSpace:$i,NoToneMapping:Yn,NormalBlending:Ts,NotEqualCompare:yS,NotEqualDepth:vf,Object3D:cn,ObjectSpaceNormalMap:mS,OneFactor:jy,OneMinusConstantAlphaFactor:cS,OneMinusConstantColorFactor:oS,OneMinusDstAlphaFactor:nS,OneMinusDstColorFactor:rS,OneMinusSrcAlphaFactor:cf,OneMinusSrcColorFactor:tS,OrthographicCamera:Lm,PCFShadowMap:No,PCFSoftShadowMap:Xy,PMREMGenerator:Mp,PerspectiveCamera:Rn,Plane:gr,PlaneGeometry:vl,Quaternion:Oa,R11_EAC_Format:Cf,RED_GREEN_RGTC2_Format:Jf,RED_RGTC1_Format:Kf,REVISION:Au,RG11_EAC_Format:Pf,RGBAFormat:Dn,RGBAIntegerFormat:Iu,RGBA_ASTC_10x10_Format:kf,RGBA_ASTC_10x5_Format:zf,RGBA_ASTC_10x6_Format:Vf,RGBA_ASTC_10x8_Format:Gf,RGBA_ASTC_12x10_Format:Wf,RGBA_ASTC_12x12_Format:Xf,RGBA_ASTC_4x4_Format:Df,RGBA_ASTC_5x4_Format:If,RGBA_ASTC_5x5_Format:Nf,RGBA_ASTC_6x5_Format:Ff,RGBA_ASTC_6x6_Format:Uf,RGBA_ASTC_8x5_Format:Of,RGBA_ASTC_8x6_Format:Bf,RGBA_ASTC_8x8_Format:Hf,RGBA_BPTC_Format:qf,RGBA_ETC2_EAC_Format:Af,RGBA_PVRTC_2BPPV1_Format:Tf,RGBA_PVRTC_4BPPV1_Format:bf,RGBA_S3TC_DXT1_Format:Uo,RGBA_S3TC_DXT3_Format:Oo,RGBA_S3TC_DXT5_Format:Bo,RGBFormat:xm,RGB_BPTC_SIGNED_Format:Yf,RGB_BPTC_UNSIGNED_Format:$f,RGB_ETC1_Format:Ef,RGB_ETC2_Format:wf,RGB_PVRTC_2BPPV1_Format:Mf,RGB_PVRTC_4BPPV1_Format:Sf,RGB_S3TC_DXT1_Format:Fo,RGFormat:Ps,RGIntegerFormat:Du,RawShaderMaterial:NS,Ray:AS,RedFormat:ym,RedIntegerFormat:Lu,ReinhardToneMapping:om,RenderTarget:ES,RepeatWrapping:xf,ReverseSubtractEquation:$y,SIGNED_R11_EAC_Format:Rf,SIGNED_RED_GREEN_RGTC2_Format:jf,SIGNED_RED_RGTC1_Format:Zf,SIGNED_RG11_EAC_Format:Lf,SRGBColorSpace:mn,SRGBTransfer:ne,Scene:w2,ShaderChunk:Yt,ShaderLib:Vn,ShaderMaterial:ei,ShortType:mm,Source:Uu,Sphere:Ou,SrcAlphaFactor:lf,SrcAlphaSaturateFactor:sS,SrcColorFactor:Qy,StaticDrawUsage:gp,SubtractEquation:Yy,SubtractiveBlending:mp,TangentSpaceNormalMap:pS,Texture:Ge,Triangle:Pn,UVMapping:dm,Uint16BufferAttribute:Tm,Uint32BufferAttribute:Em,UniformsLib:St,UniformsUtils:PS,UnsignedByteType:_n,UnsignedInt101111Type:_m,UnsignedInt248Type:Pa,UnsignedInt5999Type:vm,UnsignedIntType:ti,UnsignedShort4444Type:Ru,UnsignedShort5551Type:Pu,UnsignedShortType:Ra,VSMShadowMap:ua,Vector2:oe,Vector3:$,Vector4:Se,WebGLCoordinateSystem:Wn,WebGLCubeRenderTarget:Cm,WebGLRenderTarget:$n,WebGLRenderer:TN,WebGLUtils:kS,WebGPUCoordinateSystem:rl,WebXRController:Lc,ZeroFactor:Jy,createCanvasElement:bS,error:Qt,log:yp,warn:Vt,warnOnce:La},Symbol.toStringTag,{value:"Module"}));export{wP as $,Ti as A,yn as B,mF as C,Ln as D,xF as E,aF as F,Ds as G,ry as H,Ro as I,_C as J,fh as K,SF as L,fa as M,ce as N,gC as O,ke as P,Po as Q,jR as R,QR as S,Sy as T,Ea as U,yF as V,vP as W,gP as X,TP as Y,rm as Z,ue as _,wN as a,pF as a$,RP as a0,LP as a1,Iy as a2,NP as a3,UP as a4,BP as a5,MF as a6,Ty as a7,wF as a8,bF as a9,DC as aA,Qx as aB,el as aC,WA as aD,gF as aE,vF as aF,Ca as aG,hy as aH,Ze as aI,hF as aJ,xC as aK,eF as aL,aR as aM,JN as aN,pC as aO,s_ as aP,kd as aQ,Hn as aR,oF as aS,lF as aT,xi as aU,ul as aV,hC as aW,fF as aX,tC as aY,JA as aZ,uF as a_,EF as aa,Te as ab,TF as ac,iP as ad,fo as ae,XA as af,Tc as ag,co as ah,jx as ai,cF as aj,QN as ak,dF as al,GA as am,Qv as an,jN as ao,iF as ap,yu as aq,sF as ar,_a as as,lR as at,AF as au,jo as av,As as aw,e2 as ax,Ua as ay,_F as az,OM as b,tl as b0,Ec as b1,hl as b2,CF as b3,qN as b4,W0 as b5,IN as b6,ux as b7,rn as b8,LN as b9,$N as bA,$b as bB,Me as bC,CN as bD,Wp as bE,WN as bF,XN as bG,RF as bH,AN as ba,ON as bb,BN as bc,mM as bd,VN as be,FN as bf,$1 as bg,Je as bh,NN as bi,Rp as bj,Pd as bk,HN as bl,Cp as bm,ZM as bn,Ld as bo,X0 as bp,kN as bq,UN as br,GN as bs,zN as bt,q0 as bu,DN as bv,Op as bw,YN as bx,KN as by,PN as bz,px as c,RN as d,Zc as e,rF as f,ln as g,sb as h,Mo as i,di as j,yr as k,bc as l,tF as m,Bp as n,nF as o,JM as p,Jo as q,ou as r,UM as s,wa as t,T0 as u,ge as v,mc as w,ZN as x,_e as y,ys as z};
