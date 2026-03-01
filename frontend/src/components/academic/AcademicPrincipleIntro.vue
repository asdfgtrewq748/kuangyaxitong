<template>
  <section class="card flow-card">
    <div class="section-header">
      <div>
        <h2>{{ aa('flowTitle') }}</h2>
        <p>{{ aa('flowDesc') }}</p>
      </div>
      <span class="figure-tag">{{ aa('flowFigureTag') }}</span>
    </div>

    <figure class="paper-overview" role="img" :aria-label="aa('flowPaperAria')">
      <svg class="paper-overview-svg" viewBox="0 0 1360 920" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <marker id="paperArrow" markerWidth="7" markerHeight="7" refX="6.2" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#0f172a" />
          </marker>
          <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.5" flood-color="#94a3b8" flood-opacity="0.55" />
          </filter>
          <linearGradient id="thumbBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#eff6ff" />
            <stop offset="100%" stop-color="#dbeafe" />
          </linearGradient>
          <linearGradient id="thumbGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ecfeff" />
            <stop offset="100%" stop-color="#d1fae5" />
          </linearGradient>
          <linearGradient id="thumbPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f3e8ff" />
            <stop offset="100%" stop-color="#e0e7ff" />
          </linearGradient>
          <linearGradient id="thumbAmber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff7ed" />
            <stop offset="100%" stop-color="#fef3c7" />
          </linearGradient>
          <symbol id="ico-xrd-real" viewBox="0 0 24 24">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2.2" ry="2.2" fill="#ffffff" stroke="#64748b" stroke-width="1.1" />
            <path d="M5 17.4h14M5 17.4V7" stroke="#64748b" stroke-width="1" fill="none" />
            <path d="M6 16.6l1.8-4 1.3 3.2 1.9-6.1 1.3 4.4 2.2-3.6 1.8 4.3 1.7-2.5" stroke="#b91c1c" stroke-width="1.15" fill="none" />
          </symbol>
          <symbol id="ico-sem-real" viewBox="0 0 24 24">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2.2" ry="2.2" fill="#f8fafc" stroke="#64748b" stroke-width="1.1" />
            <circle cx="8" cy="9.2" r="2.4" fill="#94a3b8" />
            <circle cx="12.6" cy="8.4" r="1.9" fill="#cbd5e1" />
            <circle cx="16.2" cy="10.6" r="2.7" fill="#64748b" />
            <circle cx="9.6" cy="14.8" r="2.2" fill="#cbd5e1" />
            <circle cx="14.8" cy="15.2" r="2.4" fill="#94a3b8" />
          </symbol>
          <symbol id="ico-xps-real" viewBox="0 0 24 24">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2.2" ry="2.2" fill="#ffffff" stroke="#64748b" stroke-width="1.1" />
            <path d="M5 17.4h14M5 17.4V7" stroke="#64748b" stroke-width="1" fill="none" />
            <rect x="7" y="13.8" width="2.3" height="3.6" fill="#64748b" />
            <rect x="10.3" y="11.8" width="2.3" height="5.6" fill="#475569" />
            <rect x="13.6" y="9.8" width="2.3" height="7.6" fill="#334155" />
            <rect x="16.9" y="12.6" width="2.3" height="4.8" fill="#64748b" />
          </symbol>
          <symbol id="ico-uv-real" viewBox="0 0 24 24">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2.2" ry="2.2" fill="#ffffff" stroke="#64748b" stroke-width="1.1" />
            <path d="M5 17.4h14M5 17.4V7" stroke="#64748b" stroke-width="1" fill="none" />
            <path d="M6 15.5c1.8-5.2 4.2-6.8 7.2-3.6 2 2.1 3.3 2.3 4.8.8" stroke="#1d4ed8" stroke-width="1.15" fill="none" />
            <path d="M6 13.6c2.2-3.2 5.2-3.3 8 0 1.5 1.7 2.8 1.9 4.2.7" stroke="#7c3aed" stroke-width="1" fill="none" />
          </symbol>
          <symbol id="ico-pl-real" viewBox="0 0 24 24">
            <rect x="2.5" y="3.5" width="19" height="17" rx="2.2" ry="2.2" fill="#ffffff" stroke="#64748b" stroke-width="1.1" />
            <path d="M5 17.4h14M5 17.4V7" stroke="#64748b" stroke-width="1" fill="none" />
            <path d="M6 16.8c1.9-6 4.4-6 6.3 0" stroke="#0ea5e9" stroke-width="1.2" fill="none" />
            <path d="M11.2 16.8c2-6.7 4.5-6.7 6.4 0" stroke="#ec4899" stroke-width="1.2" fill="none" />
          </symbol>
          <symbol id="ico-xrd" viewBox="0 0 24 24">
            <path d="M3 18.5H21M4 18.5V6.5" />
            <path d="M6 16l2.2-3 1.6 2.4 2.6-5.1 1.9 3.3 1.8-2.7 2.5 3.4" />
          </symbol>
          <symbol id="ico-sem" viewBox="0 0 24 24">
            <path d="M6 20.5h12M9 20.5v-2.8M15 20.5v-2.8" />
            <path d="M8.2 7.4l4.8 4.9M13.5 7.8l3.7 3.7M11.4 12.2l-2.8 2.8" />
            <circle cx="9.4" cy="6.2" r="2" />
          </symbol>
          <symbol id="ico-xps" viewBox="0 0 24 24">
            <rect x="4" y="5" width="16" height="14" rx="2" ry="2" />
            <path d="M7 15.5h10M7 12.5h6M7 9.5h4" />
            <circle cx="17.5" cy="9.2" r="1.1" />
          </symbol>
          <symbol id="ico-uv" viewBox="0 0 24 24">
            <circle cx="6.2" cy="7.1" r="1.6" />
            <path d="M9.2 8.2c1.9-1.7 4.2-1.7 6.2 0 1.5 1.3 3 1.3 4.4.2" />
            <path d="M4 18.5h16M5 18.5V11.5" />
            <path d="M7.5 15.8c2.1-2.9 4.8-2.9 7 0 1 .9 1.9 1.1 3.2.4" />
          </symbol>
          <symbol id="ico-pl" viewBox="0 0 24 24">
            <path d="M4 18.5h16M5 18.5V8.5" />
            <path d="M6 17c2.1-5.6 4.1-6.8 5.8-.2 1.6-5.3 3.9-5.3 6.2.3" />
            <circle cx="9.2" cy="11.4" r="1" />
            <circle cx="14.6" cy="11.3" r="1" />
          </symbol>
          <symbol id="ico-gridmap" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
            <path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16" />
            <rect x="9.3" y="9.3" width="5.4" height="5.4" />
          </symbol>
          <symbol id="ico-zoning" viewBox="0 0 24 24">
            <path d="M4 18.5h16M5 18.5V6.2" />
            <path d="M7 16.6l3-5.4 2.4 3.2 2.8-4.6 2.8 6" />
            <path d="M8.8 7.6h8.7M8.8 10.1h8.7" />
          </symbol>
          <symbol id="ico-trend" viewBox="0 0 24 24">
            <path d="M4 18.5h16M5 18.5V6.5" />
            <path d="M6.2 16.2l3.2-2.8 2.2 1.2 3.1-3.8 3.1.8" />
            <path d="M16.8 8.6h2.7v2.7" />
          </symbol>
          <symbol id="ico-metrics" viewBox="0 0 24 24">
            <path d="M4 18.5h16M5 18.5V7.5" />
            <rect x="7" y="13" width="2.6" height="5.5" />
            <rect x="11" y="10.8" width="2.6" height="7.7" />
            <rect x="15" y="8.7" width="2.6" height="9.8" />
            <path d="M16.5 6.7l1.8 1.8 2.4-2.4" />
          </symbol>
          <symbol id="ico-shield" viewBox="0 0 24 24">
            <path d="M12 4.6l6 2.2v4.9c0 3.7-2.4 6.8-6 7.7-3.6-.9-6-4-6-7.7V6.8z" />
            <path d="M8.4 12.1l2.2 2.2 5-5" />
          </symbol>
          <symbol id="ico-gear" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2.6" />
            <path d="M12 4.3v2.1M12 17.6v2.1M4.3 12h2.1M17.6 12h2.1M6.6 6.6l1.5 1.5M15.9 15.9l1.5 1.5M6.6 17.4l1.5-1.5M15.9 8.1l1.5-1.5" />
            <circle cx="12" cy="12" r="5.3" />
          </symbol>
          <symbol id="ico-flow" viewBox="0 0 24 24">
            <rect x="4.5" y="5" width="6.6" height="4.6" rx="1" ry="1" />
            <rect x="12.9" y="14.4" width="6.6" height="4.6" rx="1" ry="1" />
            <rect x="4.5" y="14.4" width="6.6" height="4.6" rx="1" ry="1" />
            <path d="M11.1 7.3h3.6M14.7 7.3v5.1M14.7 12.4h-3.6M14.7 12.4h3.6" />
          </symbol>
          <symbol id="ico-input" viewBox="0 0 24 24">
            <rect x="4" y="5" width="8" height="6" rx="1.2" ry="1.2" />
            <rect x="4" y="13" width="8" height="6" rx="1.2" ry="1.2" />
            <path d="M12 8h7M12 16h7M16 8l2 2-2 2M16 16l2 2-2 2" />
          </symbol>
          <symbol id="ico-filter" viewBox="0 0 24 24">
            <path d="M4 6h16l-6.2 6.5v4.8l-3.6 1.8v-6.6z" />
            <path d="M9 6h6" />
          </symbol>
          <symbol id="ico-field" viewBox="0 0 24 24">
            <path d="M4 12c1.6-3.7 3.2-3.7 4.8 0 1.6 3.7 3.2 3.7 4.8 0 1.6-3.7 3.2-3.7 4.8 0" />
            <path d="M4 18h16M4 6h16" />
          </symbol>
        </defs>
        <g transform="translate(58 34) scale(0.9)">
          <rect class="frame" x="14" y="14" width="1332" height="892" rx="10" ry="10" />
          <rect class="zone zone-a" x="36" y="92" width="1288" height="304" rx="14" ry="14" />
          <rect class="zone zone-b" x="36" y="404" width="1288" height="214" rx="14" ry="14" />
          <rect class="zone zone-c" x="36" y="626" width="1288" height="252" rx="14" ry="14" />

          <rect class="zone-tag zone-tag-a" x="52" y="102" width="32" height="28" rx="7" ry="7" />
          <text class="zone-letter" x="68" y="121" text-anchor="middle">A</text>
          <text class="zone-title" x="98" y="124">数据准备与机理分支</text>
          <path class="zone-header-rule" d="M52,146 L1308,146" />

          <rect class="zone-tag zone-tag-b" x="52" y="414" width="32" height="28" rx="7" ry="7" />
          <text class="zone-letter" x="68" y="433" text-anchor="middle">B</text>
          <text class="zone-title" x="98" y="433">风险评估执行流程</text>
          <text class="zone-subtitle" x="98" y="450">Risk-evaluation execution pipeline</text>
          <path class="zone-header-rule" d="M52,458 L1308,458" />

          <rect class="zone-tag zone-tag-c" x="52" y="636" width="32" height="28" rx="7" ry="7" />
          <text class="zone-letter" x="68" y="655" text-anchor="middle">C</text>
          <text class="zone-title" x="98" y="655">结果分析与决策支持</text>
          <text class="zone-subtitle" x="98" y="672">Result analysis &amp; decision support</text>

          <path class="zone-divider" d="M684,120 L684,384" />

          <rect class="title" x="430" y="30" width="500" height="64" rx="8" ry="8" />
          <text class="txt-head" x="680" y="56" text-anchor="middle">MPI 新算法总体流程图</text>
          <text class="txt-main-en" x="680" y="76" text-anchor="middle">Master Workflow for MPI-based Risk Inference</text>

          <rect class="title" x="120" y="164" width="460" height="36" rx="8" ry="8" />
          <text class="txt-sub" x="350" y="186" text-anchor="middle">步骤1：数据与物理场准备</text>

          <rect class="title" x="735" y="164" width="460" height="36" rx="8" ry="8" />
          <text class="txt-sub" x="965" y="186" text-anchor="middle">步骤2：机理分支计算与表征</text>

          <rect class="panel" x="80" y="220" width="240" height="144" rx="8" ry="8" />
          <use class="panel-icon" href="#ico-input" x="96" y="230" width="18" height="18" />
          <text class="txt-sub" x="200" y="248" text-anchor="middle">输入数据</text>
          <text class="txt-body" x="102" y="278">- 地层与岩性参数</text>
          <text class="txt-body" x="102" y="302">- 微震事件与波形</text>
          <text class="txt-body" x="102" y="326">- 支护与应力边界</text>

          <rect class="panel" x="350" y="220" width="250" height="144" rx="8" ry="8" />
          <use class="panel-icon" href="#ico-filter" x="364" y="230" width="18" height="18" />
          <text class="txt-sub" x="475" y="248" text-anchor="middle">预处理</text>
          <text class="txt-body" x="372" y="278">- 清洗与插值</text>
          <text class="txt-body" x="372" y="302">- 归一化与尺度统一</text>
          <text class="txt-body" x="372" y="326">- 特征编码</text>

          <rect class="panel" x="80" y="468" width="250" height="118" rx="8" ry="8" />
          <use class="panel-icon" href="#ico-field" x="96" y="478" width="18" height="18" />
          <text class="txt-sub" x="205" y="496" text-anchor="middle">派生场变量</text>
          <text class="txt-body" x="102" y="522">- 应力场 sigma(x,t)</text>
          <text class="txt-body" x="102" y="546">- 相场变量 phi(x,t)</text>
          <text class="txt-body" x="102" y="568">- 先验风险证据</text>

          <rect class="panel" x="710" y="204" width="510" height="198" rx="8" ry="8" />
          <text class="txt-small" x="724" y="220">表征证据</text>
          <rect class="mini-band" x="724" y="226" width="482" height="34" rx="6" ry="6" />
          <rect class="mini-card" x="735" y="230" width="86" height="26" rx="4" ry="4" />
          <rect class="mini-thumb mini-thumb-blue" x="740" y="234" width="12" height="12" rx="2.5" ry="2.5" />
          <use class="mini-real-icon" href="#ico-xrd-real" x="739.5" y="233.5" width="13" height="13" />
          <text class="mini-label mini-label-left" x="756" y="242">XRD</text>
          <rect class="mini-card" x="829" y="230" width="86" height="26" rx="4" ry="4" />
          <rect class="mini-thumb mini-thumb-green" x="834" y="234" width="12" height="12" rx="2.5" ry="2.5" />
          <use class="mini-real-icon" href="#ico-sem-real" x="833.5" y="233.5" width="13" height="13" />
          <text class="mini-label mini-label-left" x="850" y="242">SEM/TEM</text>
          <rect class="mini-card" x="923" y="230" width="86" height="26" rx="4" ry="4" />
          <rect class="mini-thumb mini-thumb-purple" x="928" y="234" width="12" height="12" rx="2.5" ry="2.5" />
          <use class="mini-real-icon" href="#ico-xps-real" x="927.5" y="233.5" width="13" height="13" />
          <text class="mini-label mini-label-left" x="944" y="242">XPS</text>
          <rect class="mini-card" x="1017" y="230" width="86" height="26" rx="4" ry="4" />
          <rect class="mini-thumb mini-thumb-blue" x="1022" y="234" width="12" height="12" rx="2.5" ry="2.5" />
          <use class="mini-real-icon" href="#ico-uv-real" x="1021.5" y="233.5" width="13" height="13" />
          <text class="mini-label mini-label-left" x="1038" y="242">UV-Vis</text>
          <rect class="mini-card" x="1111" y="230" width="86" height="26" rx="4" ry="4" />
          <rect class="mini-thumb mini-thumb-amber" x="1116" y="234" width="12" height="12" rx="2.5" ry="2.5" />
          <use class="mini-real-icon" href="#ico-pl-real" x="1115.5" y="233.5" width="13" height="13" />
          <text class="mini-label mini-label-left" x="1132" y="242">PL</text>

          <rect class="chip" x="732" y="284" width="230" height="42" rx="6" ry="6" />
          <text class="txt-sub txt-branch" x="847" y="304" text-anchor="middle">RSI 分支</text>
          <text class="txt-small txt-branch-sub" x="847" y="320" text-anchor="middle">相场断裂响应</text>

          <rect class="chip" x="970" y="284" width="230" height="42" rx="6" ry="6" />
          <text class="txt-sub txt-branch" x="1085" y="304" text-anchor="middle">BRI 分支</text>
          <text class="txt-small txt-branch-sub" x="1085" y="320" text-anchor="middle">矩张量反演</text>

          <rect class="chip" x="732" y="336" width="230" height="42" rx="6" ry="6" />
          <text class="txt-sub txt-branch" x="847" y="356" text-anchor="middle">ASI 分支</text>
          <text class="txt-small txt-branch-sub" x="847" y="372" text-anchor="middle">应力重分布模型</text>

          <rect class="chip" x="970" y="336" width="230" height="42" rx="6" ry="6" />
          <text class="txt-sub txt-branch" x="1085" y="356" text-anchor="middle">DBN 融合</text>
          <text class="txt-small txt-branch-sub" x="1085" y="372" text-anchor="middle">后验概率更新</text>

          <rect class="title" x="650" y="410" width="620" height="44" rx="8" ry="8" />
          <text class="txt-sub" x="960" y="438" text-anchor="middle">应用：MPI 风险评估</text>

          <rect class="panel" x="668" y="470" width="278" height="126" rx="8" ry="8" />
          <use class="panel-icon" href="#ico-gear" x="684" y="480" width="18" height="18" />
          <text class="txt-sub" x="807" y="498" text-anchor="middle">设置</text>
          <text class="txt-body" x="690" y="526">- 空间网格与边界设置</text>
          <text class="txt-body" x="690" y="550">- 先验证据初始化</text>
          <text class="txt-body" x="690" y="574">- 权重向量 (wr, wb, wa)</text>

          <rect class="panel" x="968" y="470" width="278" height="126" rx="8" ry="8" />
          <use class="panel-icon" href="#ico-flow" x="984" y="480" width="18" height="18" />
          <text class="txt-sub" x="1107" y="498" text-anchor="middle">流程</text>
          <text class="txt-body" x="990" y="526">- 分支并行计算</text>
          <text class="txt-body" x="990" y="550">- 动态贝叶斯推理</text>
          <text class="txt-body" x="990" y="574">- MPI 图谱与预警输出</text>

          <rect class="title" x="430" y="626" width="500" height="48" rx="8" ry="8" />
          <text class="txt-head" x="680" y="658" text-anchor="middle">结果与分析</text>

          <rect class="panel" x="37" y="706" width="246" height="148" rx="8" ry="8" />
          <text class="txt-sub" x="160" y="734" text-anchor="middle">MPI 空间图</text>
          <text class="txt-body" x="59" y="764">- 综合指数分布</text>
          <text class="txt-body" x="59" y="788">- 高/中/低风险区域</text>
          <rect class="mini-chart" x="73" y="806" width="70" height="38" rx="4" ry="4" />
          <rect class="chart-thumb chart-thumb-blue" x="94" y="815" width="28" height="28" rx="4" ry="4" />
          <use class="chart-icon" href="#ico-gridmap" x="94" y="815" width="28" height="28" />

          <rect class="panel" x="297" y="706" width="246" height="148" rx="8" ry="8" />
          <text class="txt-sub" x="420" y="734" text-anchor="middle">风险分区</text>
          <text class="txt-body" x="319" y="764">- 概率分区</text>
          <text class="txt-body" x="319" y="788">- 风险边界提取</text>
          <rect class="mini-chart" x="333" y="806" width="70" height="38" rx="4" ry="4" />
          <rect class="chart-thumb chart-thumb-green" x="354" y="815" width="28" height="28" rx="4" ry="4" />
          <use class="chart-icon" href="#ico-zoning" x="354" y="815" width="28" height="28" />

          <rect class="panel" x="557" y="706" width="246" height="148" rx="8" ry="8" />
          <text class="txt-sub" x="680" y="734" text-anchor="middle">时序趋势</text>
          <text class="txt-body" x="579" y="764">- 时间片后验跟踪</text>
          <text class="txt-body" x="579" y="788">- 趋势突变识别</text>
          <rect class="mini-chart" x="593" y="806" width="70" height="38" rx="4" ry="4" />
          <rect class="chart-thumb chart-thumb-purple" x="614" y="815" width="28" height="28" rx="4" ry="4" />
          <use class="chart-icon" href="#ico-trend" x="614" y="815" width="28" height="28" />

          <rect class="panel" x="817" y="706" width="246" height="148" rx="8" ry="8" />
          <text class="txt-sub" x="940" y="734" text-anchor="middle">验证指标</text>
          <text class="txt-body" x="839" y="764">- AUC、F1、Brier、不确定性</text>
          <text class="txt-body" x="839" y="788">- 基线算法 vs 新算法</text>
          <rect class="mini-chart" x="853" y="806" width="70" height="38" rx="4" ry="4" />
          <rect class="chart-thumb chart-thumb-blue" x="874" y="815" width="28" height="28" rx="4" ry="4" />
          <use class="chart-icon" href="#ico-metrics" x="874" y="815" width="28" height="28" />

          <rect class="panel" x="1077" y="706" width="246" height="148" rx="8" ry="8" />
          <text class="txt-sub" x="1200" y="734" text-anchor="middle">决策策略</text>
          <text class="txt-body" x="1099" y="764">- 支护优化</text>
          <text class="txt-body" x="1099" y="788">- 监测与预警</text>
          <rect class="mini-chart" x="1113" y="806" width="70" height="38" rx="4" ry="4" />
          <rect class="chart-thumb chart-thumb-amber" x="1134" y="815" width="28" height="28" rx="4" ry="4" />
          <use class="chart-icon" href="#ico-shield" x="1134" y="815" width="28" height="28" />

          <path class="line-plain" d="M680,94 L680,106" />
          <path class="line-plain" d="M350,106 L965,106" />
          <path class="line" d="M350,106 L350,164" />
          <path class="line" d="M965,106 L965,164" />
          <path class="line" d="M350,200 L350,220" />
          <path class="line" d="M965,200 L965,220" />

          <path class="line" d="M320,276 L350,276" />
          <path class="line" d="M600,276 L710,276" />
          <path class="line" d="M475,364 L475,527 L330,527" />
          <path class="line" d="M330,527 L490,527 L490,432 L650,432" />
          <path class="line" d="M965,402 L965,410" />
          <path class="line" d="M807,454 L807,470" />
          <path class="line" d="M1107,454 L1107,470" />
          <path class="line" d="M946,533 L968,533" />
          <path class="line" d="M960,596 L960,626" />

          <path class="line" d="M680,674 L680,690" />
          <path class="line-plain" d="M160,690 L1200,690" />
          <path class="line" d="M160,690 L160,706" />
          <path class="line" d="M420,690 L420,706" />
          <path class="line" d="M680,690 L680,706" />
          <path class="line" d="M940,690 L940,706" />
          <path class="line" d="M1200,690 L1200,706" />

          <path class="line-dash" d="M940,706 C920,640 960,600 1085,360" />
          <text class="txt-foot" x="950" y="615">反馈回路</text>

          <rect class="legend-box" x="1086" y="862" width="236" height="30" rx="6" ry="6" />
          <line class="legend-line" x1="1100" y1="876" x2="1126" y2="876" />
          <text class="legend-text" x="1132" y="880">主流程</text>
          <line class="legend-dash" x1="1186" y1="876" x2="1212" y2="876" />
          <text class="legend-text" x="1218" y="880">反馈更新</text>
        </g>
      </svg>
      <figcaption>{{ aa('flowPaperCaption') }}</figcaption>
    </figure>

    <div class="interactive-head">
      <h3>{{ aa('flowInteractiveTitle') }}</h3>
      <p>{{ aa('flowInteractiveDesc') }}</p>
    </div>

    <div class="sci-flow" role="group" :aria-label="aa('flowFigureAria')">
      <div class="flow-grid">
        <article class="stage stage-input">
          <div class="stage-head">
            <span class="stage-index">I</span>
            <div>
              <h3>{{ aa('flowStages.input.title') }}</h3>
              <p>{{ aa('flowStages.input.subtitle') }}</p>
            </div>
          </div>
          <ul class="stage-list">
            <li>{{ aa('flowStages.input.item1') }}</li>
            <li>{{ aa('flowStages.input.item2') }}</li>
            <li>{{ aa('flowStages.input.item3') }}</li>
          </ul>
        </article>

        <div class="stage-arrow">
          <span class="arrow-text">{{ aa('flowStages.toMechanism') }}</span>
        </div>

        <article class="stage stage-mechanism">
          <div class="stage-head">
            <span class="stage-index">II</span>
            <div>
              <h3>{{ aa('flowStages.mechanism.title') }}</h3>
              <p>{{ aa('flowStages.mechanism.subtitle') }}</p>
            </div>
          </div>
          <div class="mechanism-grid">
            <button
              v-for="(node, idx) in mechanismNodes"
              :key="node.key"
              class="algo-node"
              :class="{ active: activeFlowNode === idx, visited: visitedNodes.has(idx) }"
              @click="setFlowNode(idx)"
              @mouseenter="setFlowNode(idx)"
            >
              <span class="algo-order">S{{ idx + 1 }}</span>
              <span class="algo-title">{{ aa(node.titleKey) }}</span>
              <span class="algo-subtitle">{{ aa(node.subtitleKey) }}</span>
            </button>
          </div>
          <p class="stage-note">{{ aa('flowStages.mechanism.note') }}</p>
        </article>

        <div class="stage-arrow">
          <span class="arrow-text">{{ aa('flowStages.toFusion') }}</span>
        </div>

        <article class="stage stage-fusion">
          <div class="stage-head">
            <span class="stage-index">III</span>
            <div>
              <h3>{{ aa('flowStages.fusion.title') }}</h3>
              <p>{{ aa('flowStages.fusion.subtitle') }}</p>
            </div>
          </div>
          <button
            v-if="fusionNode"
            class="fusion-node"
            :class="{ active: activeFlowNode === 3, visited: visitedNodes.has(3) }"
            @click="setFlowNode(3)"
            @mouseenter="setFlowNode(3)"
          >
            <span class="algo-order">S4</span>
            <span class="algo-title">{{ aa(fusionNode.titleKey) }}</span>
            <span class="algo-subtitle">{{ aa(fusionNode.subtitleKey) }}</span>
          </button>
          <p class="equation-line">MPI = w_r * RSI + w_b * BRI + w_a * ASI</p>
          <p class="stage-note">{{ aa('flowStages.fusion.note') }}</p>
        </article>

        <div class="stage-arrow">
          <span class="arrow-text">{{ aa('flowStages.toOutput') }}</span>
        </div>

        <article class="stage stage-output">
          <div class="stage-head">
            <span class="stage-index">IV</span>
            <div>
              <h3>{{ aa('flowStages.output.title') }}</h3>
              <p>{{ aa('flowStages.output.subtitle') }}</p>
            </div>
          </div>
          <ul class="stage-list">
            <li>{{ aa('flowStages.output.item1') }}</li>
            <li>{{ aa('flowStages.output.item2') }}</li>
            <li>{{ aa('flowStages.output.item3') }}</li>
          </ul>
        </article>
      </div>

      <div class="feedback-loop">
        <span>{{ aa('flowFeedback') }}</span>
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="activeNode" :key="activeFlowNode" class="flow-detail">
        <div class="detail-header">
          <span class="detail-badge">{{ aa('flowStep') }} {{ activeFlowNode + 1 }}</span>
          <h4>{{ aa(activeNode.detailTitleKey) }}</h4>
        </div>
        <p>{{ aa(activeNode.detailKey) }}</p>
        <div class="detail-actions">
          <button
            v-if="activeFlowNode > 0"
            class="btn-link"
            type="button"
            @click="setFlowNode(activeFlowNode - 1)"
          >
            {{ aa('flowPrev') }}
          </button>
          <button
            v-if="activeFlowNode < flowNodes.length - 1"
            class="btn-link primary"
            type="button"
            @click="setFlowNode(activeFlowNode + 1)"
          >
            {{ aa('flowNext') }}
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['update:active-flow-node', 'update:active-algo'])

const props = defineProps({
  aa: {
    type: Function,
    required: true
  },
  newcomerJourney: {
    type: Array,
    required: true
  },
  flowNodes: {
    type: Array,
    required: true
  },
  activeFlowNode: {
    type: Number,
    required: true
  }
})

const visitedNodes = ref(new Set([0]))

const activeNode = computed(() => props.flowNodes[props.activeFlowNode] ?? null)
const mechanismNodes = computed(() => props.flowNodes.slice(0, 3))
const fusionNode = computed(() => props.flowNodes[3] ?? null)

const markVisited = (idx) => {
  const nextVisited = new Set(visitedNodes.value)
  nextVisited.add(idx)
  visitedNodes.value = nextVisited
}

const setFlowNode = (idx) => {
  if (idx < 0 || idx >= props.flowNodes.length) return
  emit('update:active-flow-node', idx)
  emit('update:active-algo', props.flowNodes[idx]?.key || 'rsi')
  markVisited(idx)
}

watch(
  () => props.activeFlowNode,
  (newIdx) => {
    if (!Number.isInteger(newIdx) || newIdx < 0) return
    markVisited(newIdx)
    if (props.flowNodes[newIdx]?.key) {
      emit('update:active-algo', props.flowNodes[newIdx].key)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.section-header {
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.figure-tag {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid #94a3b8;
  color: #0f172a;
  background: #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.paper-overview {
  width: min(97%, 1480px);
  margin: 0 auto 16px;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.08);
}

.paper-overview-svg {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  background: #f8fafc;
  shape-rendering: geometricPrecision;
  text-rendering: optimizeLegibility;
}

.paper-overview-svg .frame {
  fill: #fcfdff;
  stroke: #334155;
  stroke-width: 1.7;
}

.paper-overview-svg .zone {
  stroke-width: 1.4;
}

.paper-overview-svg .zone-a {
  fill: #edf7f5;
  stroke: #7ba8a2;
}

.paper-overview-svg .zone-b {
  fill: #eef3fb;
  stroke: #7c90b5;
}

.paper-overview-svg .zone-c {
  fill: #f8f2ea;
  stroke: #b69874;
}

.paper-overview-svg .zone-tag {
  stroke-width: 1.2;
}

.paper-overview-svg .zone-tag-a {
  fill: #dbeeea;
  stroke: #5f8f88;
}

.paper-overview-svg .zone-tag-b {
  fill: #dde7f7;
  stroke: #5f769e;
}

.paper-overview-svg .zone-tag-c {
  fill: #eee2d3;
  stroke: #927452;
}

.paper-overview-svg .zone-letter {
  font: 700 16px "Times New Roman", Georgia, "Noto Serif SC", "Songti SC", serif;
  fill: #111827;
}

.paper-overview-svg .zone-title {
  font: 700 14px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #0f172a;
}

.paper-overview-svg .zone-subtitle {
  font: 500 11px "Times New Roman", Georgia, serif;
  letter-spacing: 0.01em;
  fill: #475569;
}

.paper-overview-svg .zone-divider {
  fill: none;
  stroke: #9ca3af;
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.paper-overview-svg .zone-header-rule {
  fill: none;
  stroke: #94a3b8;
  stroke-width: 1;
}

.paper-overview-svg .title {
  fill: #dbe7f6;
  stroke: #425a7a;
  stroke-width: 1.6;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.965);
}

.paper-overview-svg .panel {
  fill: #fefefe;
  stroke: #51637e;
  stroke-width: 1.3;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.965);
}

.paper-overview-svg .chip {
  fill: #f4f8fd;
  stroke: #7a8fab;
  stroke-width: 1;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.955);
}

.paper-overview-svg .mini-band {
  fill: #f1f5f9;
  stroke: #94a3b8;
  stroke-width: 1;
}

.paper-overview-svg .mini-card,
.paper-overview-svg .mini-chart {
  fill: #ffffff;
  stroke: #94a3b8;
  stroke-width: 0.9;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.94);
}

.paper-overview-svg .mini-label {
  font: 700 9px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #0f172a;
}

.paper-overview-svg .mini-label-left {
  text-anchor: start;
  letter-spacing: 0.01em;
}

.paper-overview-svg .mini-thumb {
  stroke: #93a4bb;
  stroke-width: 0.8;
}

.paper-overview-svg .mini-thumb-blue {
  fill: url(#thumbBlue);
}

.paper-overview-svg .mini-thumb-green {
  fill: url(#thumbGreen);
}

.paper-overview-svg .mini-thumb-purple {
  fill: url(#thumbPurple);
}

.paper-overview-svg .mini-thumb-amber {
  fill: url(#thumbAmber);
}

.paper-overview-svg .mini-real-icon {
  filter: url(#iconShadow);
}

.paper-overview-svg .mini-icon,
.paper-overview-svg .chart-icon,
.paper-overview-svg .panel-icon {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.paper-overview-svg .mini-icon {
  color: #334155;
  stroke-width: 1.35;
}

.paper-overview-svg .chart-icon {
  color: #334155;
  stroke-width: 1.45;
}

.paper-overview-svg .panel-icon {
  color: #64748b;
  stroke-width: 1.35;
}

.paper-overview-svg .chart-thumb {
  stroke: #a3b1c5;
  stroke-width: 0.85;
}

.paper-overview-svg .chart-thumb-blue {
  fill: url(#thumbBlue);
}

.paper-overview-svg .chart-thumb-green {
  fill: url(#thumbGreen);
}

.paper-overview-svg .chart-thumb-purple {
  fill: url(#thumbPurple);
}

.paper-overview-svg .chart-thumb-amber {
  fill: url(#thumbAmber);
}

.paper-overview-svg .mini-line {
  fill: none;
  stroke: #334155;
  stroke-width: 1.1;
}

.paper-overview-svg .mini-dot {
  fill: #475569;
}

.paper-overview-svg .mini-bar {
  fill: #64748b;
}

.paper-overview-svg .mini-cell {
  fill: #cbd5e1;
}

.paper-overview-svg .mini-link {
  fill: none;
  stroke: #334155;
  stroke-width: 1.1;
}

.paper-overview-svg .line {
  stroke: #0f172a;
  stroke-width: 1.7;
  fill: none;
  marker-end: url(#paperArrow);
}

.paper-overview-svg .line-plain {
  stroke: #0f172a;
  stroke-width: 1.7;
  fill: none;
}

.paper-overview-svg .line-dash {
  stroke: #0f172a;
  stroke-width: 1.35;
  fill: none;
  stroke-dasharray: 8 6;
  marker-end: url(#paperArrow);
}

.paper-overview-svg .legend-box {
  fill: #ffffff;
  stroke: #94a3b8;
  stroke-width: 1;
}

.paper-overview-svg .legend-line {
  stroke: #0f172a;
  stroke-width: 1.4;
}

.paper-overview-svg .legend-dash {
  stroke: #0f172a;
  stroke-width: 1.25;
  stroke-dasharray: 6 4;
}

.paper-overview-svg .legend-text {
  font: 500 11px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #334155;
}

.paper-overview-svg .txt-head {
  font: 700 17px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #0f172a;
}

.paper-overview-svg .txt-sub {
  font: 700 15px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #0f172a;
}

.paper-overview-svg .txt-main-en {
  font: 500 11px "Times New Roman", Georgia, serif;
  letter-spacing: 0.015em;
  fill: #334155;
}

.paper-overview-svg .txt-body {
  font: 500 13px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #1e293b;
}

.paper-overview-svg .txt-small {
  font: 500 12px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #334155;
}

.paper-overview-svg .txt-branch {
  font-size: 13px;
}

.paper-overview-svg .txt-branch-sub {
  font-size: 11px;
}

.paper-overview-svg .txt-foot {
  font: 600 13px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", Arial, Helvetica, sans-serif;
  fill: #334155;
}

.paper-overview figcaption {
  margin-top: 10px;
  font-size: 13px;
  color: #334155;
  text-align: center;
  line-height: 1.6;
}

.interactive-head {
  margin-bottom: 10px;
}

.interactive-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.interactive-head p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
}

.sci-flow {
  position: relative;
  border: 1.5px solid #334155;
  border-radius: 14px;
  padding: 16px;
  background: #f8fafc;
  overflow: hidden;
}

.flow-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 68px minmax(350px, 1.35fr) 68px minmax(220px, 1fr) 68px minmax(230px, 1fr);
  align-items: stretch;
  gap: 10px;
}

.stage {
  position: relative;
  background: #ffffff;
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 14px 14px 12px;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
}

.stage::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 12px 0 0 12px;
  background: var(--stage-accent);
}

.stage-input {
  --stage-accent: #1d4ed8;
}

.stage-mechanism {
  --stage-accent: #7c3aed;
}

.stage-fusion {
  --stage-accent: #0f766e;
}

.stage-output {
  --stage-accent: #c2410c;
}

.stage-head {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.stage-index {
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: var(--stage-accent);
}

.stage-head h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.stage-head p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.stage-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.stage-arrow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-arrow::before {
  content: "";
  position: absolute;
  left: 6px;
  right: 18px;
  height: 2px;
  background: linear-gradient(90deg, #64748b 0%, #0f172a 100%);
}

.stage-arrow::after {
  content: "";
  position: absolute;
  right: 6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #334155;
}

.arrow-text {
  position: relative;
  z-index: 1;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid #94a3b8;
  background: #ffffff;
  color: #0f172a;
  font-size: 11px;
  font-weight: 700;
}

.mechanism-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.algo-node,
.fusion-node {
  border: 1px solid #64748b;
  border-radius: 10px;
  background: #ffffff;
  padding: 9px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.algo-node:hover,
.fusion-node:hover {
  border-color: #0284c7;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.14);
  transform: translateY(-2px);
}

.algo-node.active,
.fusion-node.active {
  border-color: #0284c7;
  background: linear-gradient(135deg, rgba(186, 230, 253, 0.45) 0%, rgba(255, 255, 255, 0.96) 100%);
}

.algo-node.visited:not(.active),
.fusion-node.visited:not(.active) {
  border-color: #38bdf8;
}

.algo-order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 34px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  background: #dbeafe;
}

.algo-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.algo-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.equation-line {
  margin: 10px 0 6px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px dashed #64748b;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 13px;
  font-family: "Times New Roman", serif;
}

.stage-note {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.feedback-loop {
  position: absolute;
  right: 116px;
  top: 2px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px dashed #475569;
  background: #ffffff;
  color: #0f172a;
  font-size: 11px;
  font-weight: 700;
}

.flow-detail {
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 12px;
  border-left: 4px solid #0284c7;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(248, 250, 252, 0.92) 100%);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.detail-badge {
  padding: 4px 10px;
  border-radius: 999px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  background: #0284c7;
}

.flow-detail h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.flow-detail p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.detail-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.btn-link {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-link:hover {
  background: rgba(148, 163, 184, 0.15);
  color: var(--text-primary);
}

.btn-link.primary {
  color: #0284c7;
  border-color: rgba(2, 132, 199, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 1360px) {
  .flow-grid {
    grid-template-columns: 1fr;
  }

  .stage-arrow {
    min-height: 34px;
  }

  .stage-arrow::before {
    left: 50%;
    right: auto;
    top: 4px;
    bottom: 8px;
    width: 2px;
    height: auto;
    transform: translateX(-50%);
  }

  .stage-arrow::after {
    right: auto;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top: 10px solid #334155;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: none;
  }

  .arrow-text {
    margin-top: 4px;
  }

  .feedback-loop {
    position: static;
    margin-top: 12px;
    display: inline-flex;
  }
}

@media (max-width: 960px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .paper-overview {
    padding: 8px;
  }

  .mechanism-grid {
    grid-template-columns: 1fr;
  }

  .flow-detail {
    padding: 14px 14px;
  }
}
</style>


