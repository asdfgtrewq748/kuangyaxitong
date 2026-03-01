<template>
  <figure class="atlas" role="img" :aria-label="aa(`atlas.${mode}.aria`)">
    <figcaption><strong>{{ aa(`atlas.${mode}.figureTag`) }}</strong>{{ aa(`atlas.${mode}.caption`) }}</figcaption>
    <div class="grid">
      <article class="p"><header><b>A</b><h5>{{ aa(`atlas.${mode}.p1Title`) }}</h5></header>
        <svg viewBox="0 0 360 198" class="s">
          <defs><marker :id="ids.arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" :fill="c.ink"/></marker></defs>
          <rect x="10" y="12" width="340" height="172" class="bg"/>
          <g v-if="mode==='rsi'"><rect x="22" y="28" width="92" height="76" rx="8" class="blk"/><text x="68" y="45" text-anchor="middle" class="t">Input</text><text x="30" y="62" class="u">E,ν,Gc</text><text x="30" y="76" class="u">σt,l0</text><rect x="126" y="22" width="126" height="86" rx="8" class="blk"/><text x="189" y="42" text-anchor="middle" class="t">Phase-Field</text><path d="M140 90 C158 60,178 78,196 54 C214 33,226 61,240 46" class="m"/><path d="M140 78 C153 70,168 89,182 80 C198 71,212 92,227 83" class="a"/><rect x="262" y="28" width="78" height="76" rx="8" class="blk"/><text x="301" y="45" text-anchor="middle" class="t">Output</text><text x="270" y="62" class="u">φ(x,t)</text><text x="270" y="76" class="u">RSI</text></g>
          <g v-else-if="mode==='bri'"><rect x="22" y="24" width="114" height="82" rx="8" class="blk"/><text x="79" y="42" text-anchor="middle" class="t">Waveform</text><path d="M34 64 L46 64 L53 54 L60 78 L70 60 L80 67 L88 50 L98 74 L108 62 L126 62" class="m"/><line x1="56" y1="48" x2="56" y2="84" class="d"/><line x1="92" y1="48" x2="92" y2="84" class="d"/><text x="50" y="46" class="u">P</text><text x="86" y="46" class="u">S</text><circle cx="186" cy="67" r="36" class="bb"/><path d="M150 67 A36 36 0 0 1 222 67" class="m"/><text x="186" y="118" text-anchor="middle" class="u">ISO/DC/CLVD</text><rect x="250" y="24" width="90" height="82" rx="8" class="blk"/><text x="295" y="42" text-anchor="middle" class="t">Tensor Mix</text><rect x="262" y="58" width="14" height="36" class="bar"/><rect x="282" y="50" width="14" height="44" class="bar"/><rect x="302" y="64" width="14" height="30" class="bar"/></g>
          <g v-else-if="mode==='asi'"><rect x="20" y="24" width="100" height="84" rx="8" class="blk"/><text x="70" y="42" text-anchor="middle" class="t">Boundary</text><text x="30" y="60" class="u">σ0,p,a,b</text><text x="30" y="74" class="u">c,φ</text><rect x="128" y="20" width="136" height="90" rx="8" class="blk"/><circle cx="196" cy="66" r="22" class="r"/><circle cx="196" cy="66" r="14" class="rc"/><line x1="196" y1="18" x2="196" y2="38" class="a"/><line x1="196" y1="94" x2="196" y2="114" class="a"/><line x1="149" y1="66" x2="171" y2="66" class="a"/><line x1="221" y1="66" x2="243" y2="66" class="a"/><text x="196" y="118" text-anchor="middle" class="u">Kirsch+UST</text><rect x="272" y="24" width="68" height="84" rx="8" class="blk"/><text x="306" y="42" text-anchor="middle" class="t">Decision</text><text x="278" y="60" class="u">Kmax</text><text x="278" y="74" class="u">ASI</text></g>
          <g v-else><text x="180" y="24" text-anchor="middle" class="t">DBN Time Slices</text><g v-for="(x,i) in [64,178,292]" :key="i"><rect :x="x-38" y="34" width="76" height="98" rx="8" class="blk"/><text :x="x" y="48" text-anchor="middle" class="u">t{{ i===0?'-1':i===1?'':'+1' }}</text><circle :cx="x" cy="66" r="10" class="n1"/><circle :cx="x" cy="92" r="11" class="n2"/><circle :cx="x" cy="118" r="10" class="n3"/><text :x="x" y="69" text-anchor="middle" class="u">O</text><text :x="x" y="95" text-anchor="middle" class="u">H</text><text :x="x" y="121" text-anchor="middle" class="u">R</text></g><line x1="74" y1="92" x2="168" y2="92" class="d" :marker-end="`url(#${ids.arr})`"/><line x1="188" y1="92" x2="282" y2="92" class="d" :marker-end="`url(#${ids.arr})`"/></g>
          <line x1="116" y1="68" x2="126" y2="68" class="e" :marker-end="`url(#${ids.arr})`"/><line x1="252" y1="68" x2="262" y2="68" class="e" :marker-end="`url(#${ids.arr})`"/>
          <rect x="244" y="150" width="94" height="20" rx="10" class="pill"/><text x="291" y="164" text-anchor="middle" class="u">{{ aa(`atlas.${mode}.p1Badge`) }}</text>
        </svg></article>

      <article class="p"><header><b>B</b><h5>{{ aa(`atlas.${mode}.p2Title`) }}</h5></header>
        <svg viewBox="0 0 360 198" class="s"><rect x="10" y="12" width="340" height="172" class="bg"/>
          <line v-for="(y,i) in yTicks" :key="'y'+i" :x1="A.x" :x2="A.x+A.w" :y1="y" :y2="y" class="g"/>
          <line v-for="(x,i) in xTicks" :key="'x'+i" :x1="x" :x2="x" :y1="A.y" :y2="A.y+A.h" class="gv"/>
          <line :x1="A.x" :x2="A.x+A.w" :y1="A.y+A.h" :y2="A.y+A.h" class="ax"/><line :x1="A.x" :x2="A.x" :y1="A.y" :y2="A.y+A.h" class="ax"/>
          <path :d="bandPath" :fill="rgba(c.primary,.16)" v-if="bandPath"/><path :d="mainPath" class="m"/><path :d="auxPath" class="a" v-if="auxPath"/><path :d="thirdPath" class="k" v-if="thirdPath"/>
          <line v-if="mode==='rsi' || mode==='asi'" :x1="vLine" :x2="vLine" :y1="A.y" :y2="A.y+A.h" class="d"/>
          <text :x="A.x+A.w-2" :y="A.y+A.h+19" text-anchor="end" class="l">{{ aa(`atlas.${mode}.p2X`) }}</text><text :x="A.x-8" :y="A.y-6" class="l">{{ aa(`atlas.${mode}.p2Y`) }}</text>
          <rect x="246" y="24" width="94" height="34" rx="6" class="lg"/><line x1="256" y1="36" x2="274" y2="36" class="m"/><text x="278" y="39" class="u">{{ aa(`atlas.${mode}.p2LegendLine`) }}</text><rect x="256" y="44" width="14" height="8" rx="2" :fill="rgba(c.primary,.2)" class="lb"/><text x="278" y="51" class="u">{{ aa(`atlas.${mode}.p2LegendBand`) }}</text>
        </svg></article>

      <article class="p"><header><b>C</b><h5>{{ aa(`atlas.${mode}.p3Title`) }}</h5></header>
        <svg viewBox="0 0 360 198" class="s"><defs><linearGradient :id="ids.cb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" :stop-color="c.heat[0]"/><stop offset=".25" :stop-color="c.heat[1]"/><stop offset=".5" :stop-color="c.heat[2]"/><stop offset=".75" :stop-color="c.heat[3]"/><stop offset="1" :stop-color="c.heat[4]"/></linearGradient></defs><rect x="10" y="12" width="340" height="172" class="bg"/>
          <g v-if="mode==='rsi'"><rect v-for="(z,i) in zR" :key="i" :x="z.x" :y="z.y" :width="z.w" :height="z.h" :fill="z.f" class="hc"/><path d="M36 132 C78 118,120 93,156 88 C192 84,226 90,262 73 C286 63,304 53,318 41" class="m"/><path d="M34 152 C68 148,108 132,150 127 C196 122,238 120,284 101" class="a"/></g>
          <g v-else-if="mode==='bri'"><rect x="24" y="24" width="286" height="126" class="blk"/><path d="M24 136 C79 118,139 124,195 106 C239 92,271 96,310 78" class="a"/><circle v-for="(e,i) in ev" :key="i" :cx="e.x" :cy="e.y" :r="e.r" :fill="e.f" class="ev"/></g>
          <g v-else-if="mode==='asi'"><rect x="24" y="24" width="286" height="126" class="blk"/><circle cx="166" cy="87" r="54" class="a"/><circle cx="166" cy="87" r="40" class="m"/><circle cx="166" cy="87" r="26" class="m"/><circle cx="166" cy="87" r="14" class="rc"/></g>
          <g v-else><rect v-for="(z,i) in zD" :key="i" :x="z.x" :y="z.y" :width="z.w" :height="z.h" :fill="z.f" class="hc"/></g>
          <rect x="318" y="26" width="12" height="114" rx="4" :fill="`url(#${ids.cb})`" class="cb"/><text x="336" y="18" text-anchor="middle" class="l">{{ aa(`atlas.${mode}.p3Legend`) }}</text><text x="164" y="168" text-anchor="middle" class="l">{{ aa(`atlas.${mode}.p3X`) }}</text><text x="18" y="94" text-anchor="middle" transform="rotate(-90 18 94)" class="l">{{ aa(`atlas.${mode}.p3Y`) }}</text>
        </svg></article>

      <article class="p"><header><b>D</b><h5>{{ aa(`atlas.${mode}.p4Title`) }}</h5></header>
        <svg viewBox="0 0 360 198" class="s"><rect x="10" y="12" width="340" height="172" class="bg"/>
          <line :x1="B.x" :x2="B.x+B.w" :y1="B.y+B.h" :y2="B.y+B.h" class="ax"/><line :x1="B.x" :x2="B.x" :y1="B.y" :y2="B.y+B.h" class="ax"/>
          <g v-if="mode!=='bri' && mode!=='dbn'"><g v-for="(b,i) in bars" :key="i"><rect :x="b.x-24" :y="b.y" width="48" :height="b.h" rx="4" class="bar" :style="{opacity:(.6+i*.15)}"/><text :x="b.x" :y="B.y+B.h+16" text-anchor="middle" class="l">{{ labels[i] }}</text></g><path :d="dPath" class="a"/></g>
          <g v-else-if="mode==='bri'"><line x1="178" y1="30" x2="178" y2="152" class="ax"/><g v-for="(t,i) in tor" :key="i"><rect :x="t.x" :y="t.y" :width="t.w" height="16" class="bar"/><text x="176" :y="t.y+12" text-anchor="end" class="l">{{ labels[i] }}</text></g></g>
          <g v-else><line x1="38" y1="150" x2="162" y2="150" class="ax"/><line x1="38" y1="36" x2="38" y2="150" class="ax"/><path :d="ent" class="m"/><rect x="196" y="36" width="132" height="116" rx="6" class="lg"/><g v-for="(q,i) in cal" :key="i"><rect :x="q.x" :y="q.y" width="24" :height="q.h" class="bar" :style="{opacity:.45+i*.18}"/><text :x="q.x+12" y="145" text-anchor="middle" class="u">{{ q.t }}</text></g></g>
          <rect x="246" y="24" width="94" height="34" rx="6" class="lg"/><line x1="256" y1="36" x2="274" y2="36" class="a"/><text x="278" y="39" class="u">{{ aa(`atlas.${mode}.p4LegendTrend`) }}</text><rect x="256" y="44" width="14" height="8" rx="2" class="bar"/><text x="278" y="51" class="u">{{ aa(`atlas.${mode}.p4LegendBar`) }}</text><text :x="B.x-26" :y="B.y+4" class="l" transform="rotate(-90 14 34)">{{ aa(`atlas.${mode}.p4Y`) }}</text>
        </svg></article>
    </div>
  </figure>
</template>

<script setup>
import { computed } from 'vue'
const props=defineProps({aa:{type:Function,required:true},mode:{type:String,required:true}})
const A={x:42,y:24,w:286,h:126},B={x:42,y:30,w:250,h:116}
const P={rsi:{primary:'#1f77b4',secondary:'#ff7f0e',third:'#2ca02c',ink:'#1f2937',heat:['#f5f8fc','#dbe6f3','#b4cbe3','#7ea7cf','#3f78af']},bri:{primary:'#3557b7',secondary:'#8c564b',third:'#9467bd',ink:'#1f2937',heat:['#f8f6fb','#e3daf3','#c4b0df','#9a81c7','#6f57ab']},asi:{primary:'#0f766e',secondary:'#e67e22',third:'#2f9e44',ink:'#1f2937',heat:['#eff9f6','#cdece3','#9ad8c8','#58b9a4','#1e8a78']},dbn:{primary:'#3b5cbe',secondary:'#c26d2f',third:'#7e57c2',ink:'#1f2937',heat:['#f4f5fc','#dde2f8','#bdc8ef','#8fa3df','#5d7ac8']}}
const c=computed(()=>P[props.mode]||P.rsi)
const ids=computed(()=>({arr:`arr-${props.mode}`,cb:`cb-${props.mode}`}))
const d=computed(()=>props.mode==='rsi'?{m:[.08,.16,.31,.47,.6,.71,.8,.86],a:[.72,.69,.64,.57,.48,.37,.27,.19],u:[.14,.22,.39,.56,.69,.79,.88,.94],l:[.02,.08,.23,.38,.5,.63,.72,.78],x:['1','2','3','4','5','6','7','8'],min:0,max:1,v:4}:props.mode==='bri'?{m:[.28,.32,.29,.24,.2,.18,.22,.26],a:[.46,.43,.41,.45,.5,.52,.47,.42],k:[.26,.25,.3,.31,.3,.3,.31,.32],x:['1','2','3','4','5','6','7','8'],min:0,max:.65}:props.mode==='asi'?{m:[2.6,2.3,1.95,1.62,1.35,1.18,1.09,1.02],a:[.18,.36,.52,.66,.76,.83,.89,.93],x:['1.0','1.2','1.4','1.6','1.8','2.0','2.2','2.4'],min:0,max:2.8,v:5}:{m:[.2,.26,.34,.43,.49,.56,.63,.68],a:[.34,.36,.35,.33,.31,.28,.24,.22],k:[.46,.38,.31,.24,.2,.16,.13,.1],u:[.26,.33,.42,.52,.58,.65,.72,.78],l:[.14,.2,.27,.34,.4,.46,.53,.58],x:['t1','t2','t3','t4','t5','t6','t7','t8'],min:0,max:.8})
const xTicks=computed(()=>d.value.x.map((_,i)=>X(i,d.value.x.length,A))),yTicks=computed(()=>[0,1,2,3,4].map(i=>A.y+A.h-i*A.h/4))
const mainPath=computed(()=>L(d.value.m,A,d.value.min,d.value.max)),auxPath=computed(()=>d.value.a?L(d.value.a,A,d.value.min,d.value.max):''),thirdPath=computed(()=>d.value.k?L(d.value.k,A,d.value.min,d.value.max):''),bandPath=computed(()=>d.value.u&&d.value.l?W(d.value.u,d.value.l,A,d.value.min,d.value.max):''),vLine=computed(()=>X(d.value.v||4,d.value.x.length,A))
const zR=computed(()=>M([[.1,.17,.23,.32,.45,.57,.68,.78,.86],[.09,.18,.27,.38,.52,.64,.75,.85,.93],[.12,.21,.33,.45,.59,.71,.82,.91,.97],[.16,.25,.36,.49,.63,.74,.83,.9,.95],[.19,.3,.41,.55,.67,.76,.83,.88,.92]],{x:24,y:24,w:286,h:126},c.value.heat))
const zD=computed(()=>M([[.82,.42,.18],[.36,.68,.31],[.14,.33,.76]],{x:58,y:32,w:220,h:104},c.value.heat))
const ev=computed(()=>[{x:52,y:118,r:8,f:rgba(c.value.primary,.32)},{x:86,y:106,r:6,f:rgba(c.value.secondary,.34)},{x:116,y:95,r:7,f:rgba(c.value.third,.34)},{x:150,y:89,r:10,f:rgba(c.value.primary,.32)},{x:178,y:83,r:7,f:rgba(c.value.secondary,.34)},{x:206,y:75,r:11,f:rgba(c.value.third,.34)},{x:236,y:71,r:9,f:rgba(c.value.primary,.32)},{x:266,y:64,r:7,f:rgba(c.value.secondary,.34)},{x:294,y:57,r:10,f:rgba(c.value.third,.34)}])
const s=computed(()=>props.mode==='rsi'?{b:[.82,.61,.45],e:[.08,.06,.07],t:[.36,.69,.94],min:0,max:1}:props.mode==='bri'?{b:[-.21,.34,.18],min:-.4,max:.4}:props.mode==='asi'?{b:[1.22,.94,1.68],t:[.3,.5,.9],min:0,max:2}:{b:[.34,.57,.79],ent:[.92,.74,.58,.44,.33,.25,.19,.14],min:0,max:1})
const bars=computed(()=> (s.value.b||[]).map((v,i)=>{const x=B.x+((i+.5)/(s.value.b.length||1))*B.w,y=Y(v,B,s.value.min,s.value.max),base=Y(s.value.min,B,s.value.min,s.value.max);return{x,y,h:Math.max(0,base-y)}})),dPath=computed(()=>L(s.value.t||[],B,s.value.min,s.value.max))
const labels=computed(()=>[props.aa(`atlas.${props.mode}.p4L1`),props.aa(`atlas.${props.mode}.p4L2`),props.aa(`atlas.${props.mode}.p4L3`)])
const tor=computed(()=>{const c0=178;return (s.value.b||[]).map((v,i)=>{const w=Math.abs(v)*250;return{x:v>=0?c0:c0-w,y:56+i*28,w}})})
const ent=computed(()=>L(s.value.ent||[],{x:38,y:36,w:124,h:114},0,1)),cal=computed(()=> (s.value.b||[]).map((v,i)=>{const x=214+i*34,y=140-v*80;return{x,y,h:140-y,t:['low','mid','high'][i]}}))
function X(i,n,a){return n<=1?a.x:a.x+i*(a.w/(n-1))}function Y(v,a,min,max){const d=Math.max(1e-9,max-min);return a.y+a.h-((v-min)/d)*a.h}
function L(arr,a,min,max){if(!arr?.length)return'';return arr.map((v,i)=>`${i?'L':'M'}${X(i,arr.length,a)} ${Y(v,a,min,max)}`).join(' ')}
function W(u,l,a,min,max){if(!u?.length||!l?.length)return'';const t=u.map((v,i)=>`${i?'L':'M'}${X(i,u.length,a)} ${Y(v,a,min,max)}`).join(' '),b=l.slice().reverse().map((v,i)=>{const r=l.length-1-i;return`L${X(r,l.length,a)} ${Y(v,a,min,max)}`}).join(' ');return`${t} ${b} Z`}
function M(m,a,h){const r=m.length,c=m[0]?.length||0,w=a.w/c,hh=a.h/r;return m.flatMap((row,ri)=>row.map((v,ci)=>({x:a.x+ci*w,y:a.y+ri*hh,w,h:hh,f:H(v,h)})))}
function H(v,h){const i=Math.floor(Math.max(0,Math.min(.9999,v))*h.length);return h[i]}function rgba(hex,al){const t=hex.replace('#',''),n=Number.parseInt(t,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return`rgba(${r}, ${g}, ${b}, ${al})`}
</script>
<style scoped>
.atlas{margin:0 0 22px;padding:14px;border:1.2px solid #64748b;border-radius:12px;background:linear-gradient(180deg,#fff,#fcfdff);box-shadow:0 8px 24px rgba(15,23,42,.08)}
figcaption{margin:0 0 12px;padding-bottom:10px;border-bottom:1px solid #d1d5db;font:500 12px/1.6 'Times New Roman',Georgia,'Noto Serif SC',serif;color:#334155}
figcaption strong{margin-right:6px;color:#0f172a;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.p{border:1px solid #b8c5d8;border-radius:10px;background:linear-gradient(180deg,#fff,#f9fbff);padding:8px 8px 6px}
header{display:flex;align-items:center;gap:8px;margin-bottom:6px}header b{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid #64748b;background:#f1f5f9;font:700 11px/1 'Times New Roman',serif;color:#0f172a}
header h5{margin:0;font:700 12px/1.3 'Noto Serif SC','STSong','Times New Roman',serif;color:#0f172a}
.s{width:100%;height:auto;display:block;border:1px solid #e2e8f0;border-radius:8px;background:#fff}
.bg{fill:#fff;stroke:#d8e0ec;stroke-width:.9}
.ax{stroke:#334155;stroke-width:1.1}.g{stroke:#e8edf4;stroke-width:.8}.gv{stroke:#e8edf4;stroke-width:.8;stroke-dasharray:3 4}
.l{font:600 9px 'Noto Sans SC','Microsoft YaHei',Arial,sans-serif;fill:#0f172a}
.u{font:500 8.2px 'Times New Roman','Noto Serif SC',serif;fill:#475569}.t{font:700 9.4px 'Noto Sans SC','Microsoft YaHei',Arial,sans-serif;fill:#0f172a}
.blk,.lg{fill:#fbfdff;stroke:#94a3b8;stroke-width:.9}.pill{fill:#f1f5f9;stroke:#94a3b8;stroke-width:.9}
.e{stroke:#334155;stroke-width:1.2}.d{stroke:#475569;stroke-width:1.1;stroke-dasharray:5 4}
.m{fill:none;stroke:#1f77b4;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.a{fill:none;stroke:#ff7f0e;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.k{fill:none;stroke:#2ca02c;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.bb{fill:#fff;stroke:#334155;stroke-width:1}.bar{fill:#3b5cbe;stroke:none}.lb{stroke:#94a3b8;stroke-width:.7}.hc{stroke:#d8e0ec;stroke-width:.6}.cb{stroke:#94a3b8;stroke-width:.8}.ev{stroke:#475569;stroke-width:.8}
.r{fill:none;stroke:#0f766e;stroke-width:1.4}.rc{fill:#e2f5f1;stroke:#0f766e;stroke-width:1}.n1{fill:#dbe6f6;stroke:#476aab;stroke-width:.9}.n2{fill:#f9e8d9;stroke:#b26a34;stroke-width:.9}.n3{fill:#ece4f8;stroke:#7e57c2;stroke-width:.9}
@media (max-width:960px){.grid{grid-template-columns:1fr}}
</style>
