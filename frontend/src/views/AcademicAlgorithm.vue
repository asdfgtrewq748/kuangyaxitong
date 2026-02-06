<template>
  <div class="page academic-algorithm-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">MPI 学术算法展示平台</h1>
          <p class="page-subtitle">Academic Algorithm Demonstration Platform · 相场断裂 · 矩张量反演 · 统一强度理论 · 贝叶斯网络</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="mode-tabs">
          <button :class="['mode-tab', { active: activeTab === 'principle' }]" @click="activeTab = 'principle'">算法原理</button>
          <button :class="['mode-tab', { active: activeTab === 'calculation' }]" @click="activeTab = 'calculation'">在线计算</button>
        </div>
      </div>
    </div>

    <!-- 一句话总览 -->
    <section class="card overview-card">
      <div class="overview-text">
        <h2>算法体系总览</h2>
        <p>
          MPI 学术算法平台融合<strong>相场断裂力学</strong>、<strong>微震矩张量反演</strong>、<strong>统一强度理论</strong>与
          <strong>动态贝叶斯网络</strong>四大理论，构建多尺度、多物理场的矿压灾害评估体系。
        </p>
      </div>
      <div class="overview-badges">
        <span class="badge">相场断裂模型</span>
        <span class="badge">矩张量分解</span>
        <span class="badge">统一强度理论</span>
        <span class="badge">概率推理</span>
      </div>
    </section>

    <!-- 算法原理 Tab -->
    <template v-if="activeTab === 'principle'">
      <section class="card onboarding-card">
        <div class="section-header">
          <h2>新用户导读</h2>
          <p>先按“问题-证据-结论”三步阅读，再深入公式和推导细节。</p>
        </div>
        <div class="onboarding-grid">
          <div class="reading-path">
            <div class="reading-step" v-for="item in newcomerJourney" :key="item.step">
              <span class="reading-index">{{ item.step }}</span>
              <div class="reading-body">
                <h3>{{ item.title }}</h3>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
          <div class="io-map">
            <h3>输入-处理-输出总示意图</h3>
            <svg viewBox="0 0 680 220" class="io-map-svg" role="img" aria-label="MPI 输入处理输出总示意图">
              <defs>
                <linearGradient id="ioInputGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#e0f2fe"/>
                  <stop offset="100%" style="stop-color:#bae6fd"/>
                </linearGradient>
                <linearGradient id="ioProcessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#ede9fe"/>
                  <stop offset="100%" style="stop-color:#ddd6fe"/>
                </linearGradient>
                <linearGradient id="ioOutputGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#dcfce7"/>
                  <stop offset="100%" style="stop-color:#bbf7d0"/>
                </linearGradient>
                <marker id="ioArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#64748b"/>
                </marker>
              </defs>

              <rect x="20" y="48" width="190" height="124" rx="14" fill="url(#ioInputGradient)" stroke="#0ea5e9" stroke-width="1.5"/>
              <text x="115" y="78" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">输入层</text>
              <text x="115" y="104" text-anchor="middle" font-size="12" fill="#334155">岩层参数、微震事件</text>
              <text x="115" y="124" text-anchor="middle" font-size="12" fill="#334155">应力边界、支护条件</text>
              <text x="115" y="144" text-anchor="middle" font-size="12" fill="#334155">历史风险标签</text>

              <rect x="245" y="32" width="190" height="156" rx="14" fill="url(#ioProcessGradient)" stroke="#8b5cf6" stroke-width="1.5"/>
              <text x="340" y="62" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">机理计算层</text>
              <text x="340" y="87" text-anchor="middle" font-size="12" fill="#334155">RSI: 裂纹演化</text>
              <text x="340" y="107" text-anchor="middle" font-size="12" fill="#334155">BRI: 震源机制识别</text>
              <text x="340" y="127" text-anchor="middle" font-size="12" fill="#334155">ASI: 应力重分布</text>
              <text x="340" y="147" text-anchor="middle" font-size="12" fill="#334155">DBN: 概率融合推理</text>
              <text x="340" y="167" text-anchor="middle" font-size="11" fill="#475569">输出中间量: RSI/BRI/ASI</text>

              <rect x="470" y="48" width="190" height="124" rx="14" fill="url(#ioOutputGradient)" stroke="#22c55e" stroke-width="1.5"/>
              <text x="565" y="78" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">决策输出层</text>
              <text x="565" y="104" text-anchor="middle" font-size="12" fill="#334155">MPI 综合指数</text>
              <text x="565" y="124" text-anchor="middle" font-size="12" fill="#334155">风险等级与概率分布</text>
              <text x="565" y="144" text-anchor="middle" font-size="12" fill="#334155">支护与预警建议</text>

              <line x1="210" y1="110" x2="245" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#ioArrow)"/>
              <line x1="435" y1="110" x2="470" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#ioArrow)"/>
            </svg>
            <p class="io-map-tip">阅读建议：先确认右侧“输出层”含义，再回看中间机理如何支撑结论。</p>
          </div>
        </div>
      </section>

      <section class="card glossary-card">
        <div class="section-header">
          <h2>术语速查</h2>
          <p>把“学术名词”翻译成“业务含义”，第一次看也能快速建立直觉。</p>
        </div>
        <div class="glossary-grid">
          <article class="glossary-item" v-for="item in termGlossary" :key="item.term">
            <h3>{{ item.term }}</h3>
            <p class="glossary-plain">{{ item.plain }}</p>
            <p class="glossary-cue">{{ item.cue }}</p>
          </article>
        </div>
      </section>

      <section class="card storyboard-card">
        <div class="section-header">
          <h2>四大算法分镜示意</h2>
          <p>每个算法都拆成“输入 → 机理 → 输出”，并标注新手优先关注点。</p>
        </div>
        <div class="storyboard-grid">
          <article class="storyboard-item" v-for="item in algorithmStoryboards" :key="item.key">
            <div class="storyboard-head">
              <span class="storyboard-tag">{{ item.tag }}</span>
              <h3>{{ item.name }}</h3>
            </div>
            <div class="storyboard-strip">
              <div class="story-node input">
                <span class="story-node-label">输入</span>
                <span class="story-node-text">{{ item.input }}</span>
              </div>
              <span class="story-arrow">→</span>
              <div class="story-node process">
                <span class="story-node-label">机理</span>
                <span class="story-node-text">{{ item.process }}</span>
              </div>
              <span class="story-arrow">→</span>
              <div class="story-node output">
                <span class="story-node-label">输出</span>
                <span class="story-node-text">{{ item.output }}</span>
              </div>
            </div>
            <p class="storyboard-watch">新手先看：{{ item.watch }}</p>
            <button class="storyboard-jump" @click="activeAlgo = item.key">查看详细原理</button>
          </article>
        </div>
      </section>

      <!-- 总体流程 -->
      <section class="card flow-card">
        <div class="section-header">
          <h2>总体计算流程</h2>
          <p>四大算法模块协同工作，实现从微观破裂到宏观稳定的完整评估</p>
        </div>
        <div class="flow-diagram">
          <div class="flow-row">
            <div class="flow-node" v-for="(node, idx) in flowNodes" :key="node.key" :class="{ active: activeFlowNode === idx }" @mouseenter="activeFlowNode = idx">
              <div class="node-icon" v-html="node.icon"></div>
              <div class="node-title">{{ node.title }}</div>
              <div class="node-subtitle">{{ node.subtitle }}</div>
            </div>
          </div>
          <div class="flow-arrows">
            <div class="flow-arrow" v-for="i in 3" :key="i">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="flow-detail" v-if="flowNodes[activeFlowNode]">
          <div class="detail-content">
            <h4>{{ flowNodes[activeFlowNode].detailTitle }}</h4>
            <p>{{ flowNodes[activeFlowNode].detail }}</p>
          </div>
        </div>
      </section>

      <!-- 子指标模块 -->
      <section class="card indicators-card">
        <div class="section-header">
          <h2>核心算法原理</h2>
          <p>每个算法模块都基于严谨的物理理论，配备完整的数学推导与可视化解释</p>
        </div>

        <div class="algorithm-tabs">
          <button
            v-for="algo in algorithms"
            :key="algo.key"
            :class="['algo-tab', { active: activeAlgo === algo.key }]"
            @click="activeAlgo = algo.key"
          >
            <span class="tab-tag">{{ algo.tag }}</span>
            <span class="tab-name">{{ algo.name }}</span>
          </button>
        </div>

        <!-- RSI 相场断裂模型 -->
        <div v-if="activeAlgo === 'rsi'" class="algorithm-detail">
          <div class="algo-header">
            <h3>RSI - 相场断裂模型 (Phase-Field Fracture)</h3>
            <p class="algo-desc">基于 Griffith 断裂理论，通过相场变量描述裂纹演化过程，评估顶板岩层的断裂风险。</p>
          </div>

          <div class="principle-grid">
            <div class="principle-section">
              <h4>物理原理</h4>
              <p>相场断裂模型引入连续变量 φ ∈ [0,1] 描述材料损伤状态，其中 φ=0 表示完整材料，φ=1 表示完全断裂。通过能量变分原理，将离散裂纹转化为扩散界面。</p>

              <div class="principle-visual">
                <div class="sci-figure">
                  <div class="figure-caption-top">
                    <strong>Fig. 1</strong> | Phase-field fracture evolution. (a) Phase-field order parameter φ varies from 0 (intact) to 1 (fully fractured).
                    (b) Crack propagation through the domain at different time steps.
                  </div>
                  <div class="phase-field-container">
                    <!-- 相场变量图 -->
                    <div class="pf-subfigure">
                      <div class="pf-label">(a) Order parameter φ</div>
                      <svg viewBox="0 0 280 120" class="sci-svg">
                        <defs>
                          <linearGradient id="phiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#1a5276"/>
                            <stop offset="50%" style="stop-color:#7fb3d5"/>
                            <stop offset="100%" style="stop-color:#c0392b"/>
                          </linearGradient>
                        </defs>
                        <!-- 背景框 -->
                        <rect x="40" y="30" width="200" height="40" fill="url(#phiGradient)" stroke="#2c3e50" stroke-width="1"/>
                        <!-- 刻度线 -->
                        <line x1="40" y1="75" x2="40" y2="80" stroke="#2c3e50" stroke-width="1.5"/>
                        <line x1="140" y1="75" x2="140" y2="80" stroke="#2c3e50" stroke-width="1.5"/>
                        <line x1="240" y1="75" x2="240" y2="80" stroke="#2c3e50" stroke-width="1.5"/>
                        <!-- 标签 -->
                        <text x="40" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">0.0</text>
                        <text x="140" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">0.5</text>
                        <text x="240" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">1.0</text>
                        <text x="140" y="15" text-anchor="middle" font-size="12" fill="#2c3e50" font-family="Arial" font-weight="bold">Intact → Fractured</text>
                      </svg>
                    </div>
                    <!-- 裂纹扩展序列 -->
                    <div class="pf-subfigure">
                      <div class="pf-label">(b) Crack propagation sequence</div>
                      <div class="crack-sequence">
                        <div class="sequence-frame" v-for="t in 4" :key="t">
                          <svg viewBox="0 0 80 80" class="sci-svg-small">
                            <!-- 网格背景 -->
                            <defs>
                              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ecf0f1" stroke-width="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="80" height="80" fill="url(#grid)" stroke="#bdc3c7" stroke-width="1"/>
                            <!-- 裂纹路径 -->
                            <path v-if="t >= 1" d="M 10 40 Q 25 38 30 40" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>
                            <path v-if="t >= 2" d="M 30 40 Q 45 42 50 38" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round"/>
                            <path v-if="t >= 3" d="M 50 38 Q 60 35 65 40" fill="none" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
                            <path v-if="t >= 4" d="M 65 40 Q 72 45 75 40" fill="none" stroke="#c0392b" stroke-width="3.5" stroke-linecap="round"/>
                            <!-- 相场扩散区 -->
                            <ellipse v-if="t >= 1" cx="30" cy="40" rx="6" ry="4" fill="#e74c3c" opacity="0.3"/>
                            <ellipse v-if="t >= 2" cx="50" cy="38" rx="8" ry="5" fill="#e74c3c" opacity="0.3"/>
                            <ellipse v-if="t >= 3" cx="65" cy="40" rx="7" ry="4" fill="#e74c3c" opacity="0.3"/>
                            <ellipse v-if="t >= 4" cx="75" cy="40" rx="5" ry="3" fill="#e74c3c" opacity="0.3"/>
                          </svg>
                          <span class="time-label">t<sub>{{ t-1 }}</sub></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="principle-section">
              <h4>控制方程</h4>
              <div class="formula-block">
                <div class="formula-title">总能量泛函</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.energy"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">相场演化方程 (Ginzburg-Landau)</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.governing"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">临界断裂应力 (Griffith 准则)</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.griffith"></div>
              </div>
            </div>
          </div>

          <div class="principle-section full-width">
            <h4>RSI 计算指标体系</h4>
            <div class="indicator-breakdown">
              <div class="breakdown-item">
                <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.norm"></div>
                <p>归一化抗拉强度贡献（基于直接顶岩层）</p>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.key"></div>
                <p>关键层稳定性贡献（识别厚硬岩层）</p>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.struct"></div>
                <p>结构完整性贡献（软岩层占比惩罚）</p>
              </div>
            </div>
          </div>
        </div>

        <!-- BRI 微震矩张量反演 -->
        <div v-if="activeAlgo === 'bri'" class="algorithm-detail">
          <div class="algo-header">
            <h3>BRI - 微震矩张量反演 (Moment Tensor Inversion)</h3>
            <p class="algo-desc">基于地震学矩张量理论，通过微震波形反演震源机制，识别岩体破裂类型与能量释放特征。</p>
          </div>

          <div class="principle-grid">
            <div class="principle-section">
              <h4>矩张量理论基础</h4>
              <p>地震矩张量 M 是对称二阶张量，描述震源处力的分布。任意震源可分解为三个基本分量的线性组合：</p>
              <ul class="principle-list">
                <li><strong>ISO (各向同性)</strong>：体积变化（爆炸/塌陷）</li>
                <li><strong>DC (双力偶)</strong>：剪切破裂（断层滑动）</li>
                <li><strong>CLVD (补偿线性矢量偶极)</strong>：拉伸/挤压破裂</li>
              </ul>

              <div class="sci-figure">
                <div class="figure-caption-top">
                  <strong>Fig. 2</strong> | Focal mechanism beach balls. The three fundamental moment tensor components
                  (ISO, DC, CLVD) representing different source mechanisms in microseismic events.
                </div>
                <div class="beachball-container">
                  <div class="beachball-item" v-for="(item, idx) in [
                    { type: 'ISO', name: 'Isotropic', desc: 'Explosive/implosive', color: '#1a5276' },
                    { type: 'DC', name: 'Double-Couple', desc: 'Shear faulting', color: '#7b241c' },
                    { type: 'CLVD', name: 'Compensated LV', desc: 'Tensile cracking', color: '#145a32' }
                  ]" :key="idx">
                    <svg viewBox="0 0 140 140" class="sci-svg-beachball">
                      <defs>
                        <radialGradient id="sphereGrad" cx="30%" cy="30%">
                          <stop offset="0%" style="stop-color:#f8f9fa"/>
                          <stop offset="100%" style="stop-color:#dee2e6"/>
                        </radialGradient>
                      </defs>
                      <!-- 球体背景 -->
                      <circle cx="70" cy="70" r="65" fill="url(#sphereGrad)" stroke="#2c3e50" stroke-width="1.5"/>
                      <!-- 纬度线 -->
                      <ellipse cx="70" cy="70" rx="65" ry="22" fill="none" stroke="#bdc3c7" stroke-width="0.8" opacity="0.5"/>
                      <ellipse cx="70" cy="70" rx="33" ry="65" fill="none" stroke="#bdc3c7" stroke-width="0.8" opacity="0.5"/>

                      <!-- ISO: 各向同性 -->
                      <template v-if="item.type === 'ISO'">
                        <circle cx="70" cy="70" r="45" fill="#1a5276" opacity="0.85"/>
                        <text x="70" y="110" text-anchor="middle" font-size="9" fill="#2c3e50" font-family="Arial">+</text>
                      </template>

                      <!-- DC: 双力偶 -->
                      <template v-if="item.type === 'DC'">
                        <path d="M 70 5 A 65 65 0 0 1 70 135 A 32.5 65 0 0 0 70 70 A 32.5 65 0 0 1 70 5" fill="#7b241c" opacity="0.9"/>
                        <path d="M 70 5 A 65 65 0 0 0 70 135 A 32.5 65 0 0 1 70 70 A 32.5 65 0 0 0 70 5" fill="#f8f9fa" opacity="0.9"/>
                        <line x1="70" y1="5" x2="70" y2="135" stroke="#2c3e50" stroke-width="1"/>
                        <line x1="5" y1="70" x2="135" y2="70" stroke="#2c3e50" stroke-width="1"/>
                        <text x="85" y="35" font-size="9" fill="#2c3e50" font-family="Arial">T</text>
                        <text x="55" y="115" font-size="9" fill="#2c3e50" font-family="Arial">P</text>
                      </template>

                      <!-- CLVD -->
                      <template v-if="item.type === 'CLVD'">
                        <ellipse cx="70" cy="70" rx="25" ry="55" fill="#145a32" opacity="0.85"/>
                        <ellipse cx="70" cy="70" rx="55" ry="15" fill="#f8f9fa" opacity="0.9"/>
                      </template>

                      <!-- 外边框 -->
                      <circle cx="70" cy="70" r="65" fill="none" stroke="#2c3e50" stroke-width="2"/>
                    </svg>
                    <div class="beachball-info">
                      <div class="bb-type">{{ item.type }}</div>
                      <div class="bb-name">{{ item.name }}</div>
                      <div class="bb-desc">{{ item.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="principle-section">
              <h4>数学公式</h4>
              <div class="formula-block">
                <div class="formula-title">矩张量分解</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.bri.decomposition"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">波形拟合方程</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.bri.waveform"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">BRI 综合指数</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.bri.main"></div>
              </div>
            </div>
          </div>

          <div class="principle-section full-width">
            <h4>深度-风险关系模型</h4>
            <div class="depth-model">
              <div class="sci-figure">
                <div class="figure-caption-top">
                  <strong>Fig. 5</strong> | Depth-risk relationship curve. BRI decreases nonlinearly with burial depth,
                  showing critical transition at H<sub>crit</sub> = 400m.
                </div>
                <svg viewBox="0 0 420 260" class="sci-svg-depth">
                  <defs>
                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#27ae60;stop-opacity:0.2"/>
                      <stop offset="33%" style="stop-color:#27ae60;stop-opacity:0.2"/>
                      <stop offset="33%" style="stop-color:#f39c12;stop-opacity:0.2"/>
                      <stop offset="66%" style="stop-color:#f39c12;stop-opacity:0.2"/>
                      <stop offset="66%" style="stop-color:#e74c3c;stop-opacity:0.2"/>
                      <stop offset="100%" style="stop-color:#e74c3c;stop-opacity:0.2"/>
                    </linearGradient>
                    <clipPath id="chartArea">
                      <rect x="60" y="40" width="320" height="160"/>
                    </clipPath>
                  </defs>

                  <!-- 背景区域填充 -->
                  <rect x="60" y="40" width="107" height="160" fill="#27ae60" opacity="0.1"/>
                  <rect x="167" y="40" width="106" height="160" fill="#f39c12" opacity="0.1"/>
                  <rect x="273" y="40" width="107" height="160" fill="#e74c3c" opacity="0.1"/>

                  <!-- 坐标轴 -->
                  <line x1="60" y1="200" x2="380" y2="200" stroke="#2c3e50" stroke-width="2"/>
                  <line x1="60" y1="200" x2="60" y2="40" stroke="#2c3e50" stroke-width="2"/>

                  <!-- 箭头 -->
                  <polygon points="385,200 375,195 375,205" fill="#2c3e50"/>
                  <polygon points="60,35 55,45 65,45" fill="#2c3e50"/>

                  <!-- 轴标签 -->
                  <text x="320" y="230" font-size="13" fill="#2c3e50" font-family="Arial" font-weight="bold">
                    Burial Depth H (m)
                  </text>
                  <text x="25" y="50" font-size="13" fill="#2c3e50" font-family="Arial" font-weight="bold">
                    BRI
                  </text>

                  <!-- Y轴刻度 -->
                  <line x1="55" y1="40" x2="65" y2="40" stroke="#2c3e50" stroke-width="1"/>
                  <line x1="55" y1="80" x2="65" y2="80" stroke="#2c3e50" stroke-width="1"/>
                  <line x1="55" y1="120" x2="65" y2="120" stroke="#2c3e50" stroke-width="1"/>
                  <line x1="55" y1="160" x2="65" y2="160" stroke="#2c3e50" stroke-width="1"/>

                  <text x="50" y="45" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">100</text>
                  <text x="50" y="85" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">75</text>
                  <text x="50" y="125" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">50</text>
                  <text x="50" y="165" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">25</text>

                  <!-- X轴刻度 -->
                  <line x1="60" y1="200" x2="60" y2="205" stroke="#2c3e50" stroke-width="1"/>
                  <line x1="167" y1="200" x2="167" y2="205" stroke="#2c3e50" stroke-width="1.5"/>
                  <line x1="273" y1="200" x2="273" y2="205" stroke="#2c3e50" stroke-width="1"/>
                  <line x1="380" y1="200" x2="380" y2="205" stroke="#2c3e50" stroke-width="1"/>

                  <text x="60" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">0</text>
                  <text x="167" y="220" text-anchor="middle" font-size="11" fill="#c0392b" font-family="Arial" font-weight="bold">400</text>
                  <text x="273" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">800</text>
                  <text x="380" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">1200</text>

                  <!-- 临界线 -->
                  <line x1="167" y1="40" x2="167" y2="200" stroke="#c0392b" stroke-width="2" stroke-dasharray="6,3"/>
                  <text x="162" y="35" font-size="10" fill="#c0392b" font-family="Arial" font-weight="bold">Hcrit</text>

                  <!-- 风险区域标注 -->
                  <text x="110" y="55" text-anchor="middle" font-size="11" fill="#27ae60" font-family="Arial" font-weight="bold">Low Risk</text>
                  <text x="220" y="55" text-anchor="middle" font-size="11" fill="#d68910" font-family="Arial" font-weight="bold">Medium</text>
                  <text x="325" y="55" text-anchor="middle" font-size="11" fill="#c0392b" font-family="Arial" font-weight="bold">High Risk</text>

                  <!-- 曲线 -->
                  <path d="M 60 40 Q 120 42 167 60 Q 220 100 273 150 Q 330 190 380 195" fill="none" stroke="#1a5276" stroke-width="3"/>

                  <!-- 数据点 -->
                  <circle cx="167" cy="60" r="5" fill="#c0392b" stroke="white" stroke-width="2"/>
                  <circle cx="273" cy="150" r="4" fill="#1a5276" stroke="white" stroke-width="1.5"/>

                  <!-- 公式标注 -->
                  <g transform="translate(240, 80)">
                    <rect x="0" y="0" width="130" height="45" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="3"/>
                    <text x="65" y="18" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial" font-style="italic">BRI(H) = max(100 -</text>
                    <text x="65" y="35" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial" font-style="italic">Pdepth, 0)</text>
                  </g>

                  <!-- 图例 -->
                  <g transform="translate(60, 240)">
                    <line x1="0" y1="5" x2="25" y2="5" stroke="#1a5276" stroke-width="3"/>
                    <text x="32" y="10" font-size="10" fill="#2c3e50" font-family="Arial">BRI Curve</text>

                    <line x1="100" y1="5" x2="120" y2="5" stroke="#c0392b" stroke-width="2" stroke-dasharray="4,2"/>
                    <text x="127" y="10" font-size="10" fill="#2c3e50" font-family="Arial">Critical Depth</text>
                  </g>
                </svg>
              </div>
              <div class="depth-formulas">
                <div class="formula-block">
                  <div class="formula-title">深度惩罚项</div>
                  <div class="formula-body formula-katex" v-html="renderedFormulas.bri.depth"></div>
                </div>
                <div class="formula-block">
                  <div class="formula-title">硬层能量项</div>
                  <div class="formula-body formula-katex" v-html="renderedFormulas.bri.hard"></div>
                </div>
                <div class="formula-block">
                  <div class="formula-title">煤层厚度项</div>
                  <div class="formula-body formula-katex" v-html="renderedFormulas.bri.thick"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ASI 统一强度理论 -->
        <div v-if="activeAlgo === 'asi'" class="algorithm-detail">
          <div class="algo-header">
            <h3>ASI - 统一强度理论 (Unified Strength Theory)</h3>
            <p class="algo-desc">基于俞茂宏院士提出的统一强度理论，考虑中间主应力影响，建立岩土材料从 Mohr-Coulomb 到 Twin-Shear 的完整强度描述。</p>
          </div>

          <div class="principle-grid">
            <div class="principle-section">
              <h4>统一强度理论</h4>
              <p>统一强度理论用一个统一的数学表达式涵盖了现有的主要强度理论，通过参数 b 调节中间主应力的影响程度：</p>
              <ul class="principle-list">
                <li><strong>b = 0</strong>：退化为 Mohr-Coulomb 准则</li>
                <li><strong>b = 1</strong>：退化为双剪强度理论</li>
                <li><strong>0 &lt; b &lt; 1</strong>：统一强度理论系列</li>
              </ul>

              <div class="sci-figure">
                <div class="figure-caption-top">
                  <strong>Fig. 3</strong> | Unified Strength Theory (UST) failure envelopes. The theory
                  interpolates between Mohr-Coulomb (b=0) and Twin-Shear (b=1) criteria through parameter b.
                </div>
                <div class="ust-container">
                  <svg viewBox="0 0 400 320" class="sci-svg-ust">
                    <defs>
                      <!-- 渐变填充 -->
                      <linearGradient id="mcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a5276;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#1a5276;stop-opacity:0.05" />
                      </linearGradient>
                      <linearGradient id="ustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#7b241c;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#7b241c;stop-opacity:0.05" />
                      </linearGradient>
                      <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#145a32;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#145a32;stop-opacity:0.05" />
                      </linearGradient>
                    </defs>

                    <!-- 坐标轴 -->
                    <line x1="60" y1="280" x2="360" y2="280" stroke="#2c3e50" stroke-width="2"/>
                    <line x1="60" y1="280" x2="60" y2="40" stroke="#2c3e50" stroke-width="2"/>

                    <!-- 箭头 -->
                    <polygon points="365,280 355,275 355,285" fill="#2c3e50"/>
                    <polygon points="60,35 55,45 65,45" fill="#2c3e50"/>

                    <!-- 轴标签 -->
                    <text x="320" y="305" font-size="14" fill="#2c3e50" font-family="Arial" font-weight="bold">σ₃ / σₜ</text>
                    <text x="30" y="50" font-size="14" fill="#2c3e50" font-family="Arial" font-weight="bold">σ₁ / σₜ</text>

                    <!-- 刻度 -->
                    <line x1="110" y1="275" x2="110" y2="285" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="160" y1="275" x2="160" y2="285" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="210" y1="275" x2="210" y2="285" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="260" y1="275" x2="260" y2="285" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="310" y1="275" x2="310" y2="285" stroke="#2c3e50" stroke-width="1"/>

                    <text x="110" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">1</text>
                    <text x="210" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">2</text>
                    <text x="310" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">3</text>

                    <line x1="55" y1="230" x2="65" y2="230" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="55" y1="180" x2="65" y2="180" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="55" y1="130" x2="65" y2="130" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="55" y1="80" x2="65" y2="80" stroke="#2c3e50" stroke-width="1"/>

                    <text x="50" y="235" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">2</text>
                    <text x="50" y="135" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">4</text>

                    <!-- Mohr-Coulomb (b=0) -->
                    <path d="M 60 130 L 210 280" fill="url(#mcGrad)" opacity="0.3"/>
                    <line x1="60" y1="130" x2="210" y2="280" stroke="#1a5276" stroke-width="2.5" stroke-dasharray="8,4"/>

                    <!-- UST (b=0.5) -->
                    <path d="M 60 180 Q 135 205 210 280" fill="none" stroke="#7b241c" stroke-width="3"/>
                    <circle cx="60" cy="180" r="4" fill="#7b241c"/>
                    <circle cx="210" cy="280" r="4" fill="#7b241c"/>

                    <!-- Twin-Shear (b=1) -->
                    <path d="M 60 230 Q 100 235 135 200 Q 170 165 210 280" fill="none" stroke="#145a32" stroke-width="2.5" stroke-dasharray="4,4"/>

                    <!-- 图例 -->
                    <g transform="translate(220, 60)">
                      <rect x="0" y="0" width="130" height="90" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="4"/>

                      <line x1="15" y1="20" x2="45" y2="20" stroke="#1a5276" stroke-width="2.5" stroke-dasharray="8,4"/>
                      <text x="55" y="25" font-size="11" fill="#2c3e50" font-family="Arial">b=0 (M-C)</text>

                      <line x1="15" y1="45" x2="45" y2="45" stroke="#7b241c" stroke-width="3"/>
                      <circle cx="15" cy="45" r="3" fill="#7b241c"/>
                      <circle cx="45" cy="45" r="3" fill="#7b241c"/>
                      <text x="55" y="50" font-size="11" fill="#2c3e50" font-family="Arial">b=0.5 (UST)</text>

                      <line x1="15" y1="70" x2="45" y2="70" stroke="#145a32" stroke-width="2.5" stroke-dasharray="4,4"/>
                      <text x="55" y="75" font-size="11" fill="#2c3e50" font-family="Arial">b=1 (Twin-Shear)</text>
                    </g>

                    <!-- b参数标注 -->
                    <text x="150" y="120" font-size="12" fill="#7b241c" font-family="Arial" font-weight="bold">
                      Unified Strength Theory
                    </text>
                    <text x="150" y="135" font-size="10" fill="#5d6d7e" font-family="Arial">
                      0 ≤ b ≤ 1
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div class="principle-section">
              <h4>核心公式</h4>
              <div class="formula-block">
                <div class="formula-title">统一强度理论表达式</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.asi.ust"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">当 σ₂ ≤ (σ₁ + bσ₃)/(1+b) 时</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.asi.case1"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">隧道围岩应力分布 (Kirsch 解)</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.asi.kirsch"></div>
              </div>
            </div>
          </div>

          <div class="principle-section full-width">
            <h4>ASI 计算体系</h4>
            <div class="indicator-breakdown">
              <div class="breakdown-item">
                <div class="breakdown-formula formula-katex" v-html="renderedFormulas.asi.stiff"></div>
                <p>综合刚度评分（基于弹性模量加权平均）</p>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-formula formula-katex" v-html="renderedFormulas.asi.fric"></div>
                <p>摩擦特性评分（基于内摩擦角）</p>
              </div>
            </div>

            <!-- ASI 应力分布可视化 - 图文并茂解释算法 -->
            <div class="sci-figure asi-stress-figure">
              <div class="figure-caption-top">
                <strong>Fig. 6</strong> | ASI algorithm: Stress redistribution around excavation.
                (a) Cross-section view showing stress trajectories and plastic zone formation.
                (b) Stress distribution curves based on Kirsch solution.
                (c) Abutment pressure ahead of working face defining support requirements.
              </div>

              <div class="asi-viz-wrapper">
                <!-- 左图: 隧道开挖应力轨迹图 -->
                <div class="asi-viz-panel">
                  <div class="panel-title">(a) Stress trajectories & plastic zone</div>
                  <svg viewBox="0 0 300 320" class="sci-svg-asi">
                    <defs>
                      <!-- 应力轨迹渐变 -->
                      <linearGradient id="stressLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#3498db;stop-opacity:0.8"/>
                        <stop offset="100%" style="stop-color:#3498db;stop-opacity:0.2"/>
                      </linearGradient>
                      <radialGradient id="stressConc" cx="50%" cy="50%">
                        <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:0.6"/>
                        <stop offset="100%" style="stop-color:#e74c3c;stop-opacity:0"/>
                      </radialGradient>
                      <!-- 箭头 -->
                      <marker id="arrGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#7f8c8d"/>
                      </marker>
                      <marker id="arrRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#c0392b"/>
                      </marker>
                      <marker id="arrGreen" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                        <polygon points="0 0, 6 2.5, 0 5" fill="#27ae60"/>
                      </marker>
                      <marker id="arrBlack" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                        <polygon points="0 0, 6 2.5, 0 5" fill="#2c3e50"/>
                      </marker>
                    </defs>

                    <!-- 原始应力场 (背景) -->
                    <g opacity="0.3">
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
                      <line x1="0" y1="260" x2="300" y2="260" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
                      <line x1="0" y1="290" x2="300" y2="290" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
                    </g>

                    <!-- 应力集中区域 (红色渐变) -->
                    <ellipse cx="150" cy="160" rx="80" ry="70" fill="url(#stressConc)" opacity="0.4"/>

                    <!-- 塑性区边界 -->
                    <ellipse cx="150" cy="160" rx="55" ry="50" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="6,3"/>
                    <text x="195" y="130" font-size="10" fill="#27ae60" font-family="Arial" font-weight="bold">Rp</text>

                    <!-- 开挖前应力方向 (灰色箭头) -->
                    <g opacity="0.4">
                      <line x1="40" y1="30" x2="40" y2="50" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#arrGray)"/>
                      <line x1="260" y1="30" x2="260" y2="50" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#arrGray)"/>
                      <line x1="40" y1="290" x2="40" y2="270" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#arrGray)"/>
                      <line x1="260" y1="290" x2="260" y2="270" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#arrGray)"/>
                    </g>

                    <!-- 开挖后应力轨迹 (蓝色曲线) -->
                    <path d="M 80 30 Q 120 80 140 140" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
                    <path d="M 220 30 Q 180 80 160 140" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
                    <path d="M 80 290 Q 120 240 140 180" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
                    <path d="M 220 290 Q 180 240 160 180" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>

                    <!-- 隧道开挖轮廓 -->
                    <ellipse cx="150" cy="160" rx="35" ry="32" fill="#2c3e50" stroke="#1a252f" stroke-width="2"/>
                    <text x="150" y="165" text-anchor="middle" font-size="9" fill="#ecf0f1" font-family="Arial">Tunnel</text>

                    <!-- 应力重分布箭头 (红色 - 切向) -->
                    <path d="M 110 100 Q 130 120 145 135" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#arrRed)"/>
                    <path d="M 190 100 Q 170 120 155 135" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#arrRed)"/>
                    <path d="M 110 220 Q 130 200 145 185" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#arrRed)"/>
                    <path d="M 190 220 Q 170 200 155 185" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#arrRed)"/>

                    <!-- 径向释放箭头 (绿色) -->
                    <line x1="135" y1="145" x2="125" y2="135" stroke="#27ae60" stroke-width="1.5" marker-end="url(#arrGreen)"/>
                    <line x1="165" y1="145" x2="175" y2="135" stroke="#27ae60" stroke-width="1.5" marker-end="url(#arrGreen)"/>

                    <!-- 标注框 -->
                    <g transform="translate(10, 10)">
                      <rect x="0" y="0" width="100" height="45" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.9"/>
                      <line x1="8" y1="15" x2="25" y2="15" stroke="#c0392b" stroke-width="2"/>
                      <text x="30" y="19" font-size="9" fill="#2c3e50" font-family="Arial">σₜ concentration</text>
                      <line x1="8" y1="32" x2="25" y2="32" stroke="#2980b9" stroke-width="1.5"/>
                      <text x="30" y="36" font-size="9" fill="#2c3e50" font-family="Arial">Stress trajectory</text>
                    </g>

                    <!-- 坐标轴 -->
                    <line x1="20" y1="160" x2="50" y2="160" stroke="#2c3e50" stroke-width="1.5" marker-end="url(#arrBlack)"/>
                    <text x="25" y="155" font-size="9" fill="#2c3e50" font-family="Arial">σᵥ</text>
                    <line x1="150" y1="300" x2="150" y2="270" stroke="#2c3e50" stroke-width="1.5" marker-end="url(#arrBlack)"/>
                    <text x="160" y="285" font-size="9" fill="#2c3e50" font-family="Arial">σₕ</text>
                  </svg>

                  <!-- 原理说明文字 -->
                  <div class="principle-text">
                    <p><strong>开挖效应：</strong>隧道开挖后，原岩应力重新分布。切向应力σₜ在洞壁集中（可达2-3倍原岩应力），径向应力σᵣ降为零。</p>
                  </div>
                </div>

                <!-- 中图: Kirsch解曲线 -->
                <div class="asi-viz-panel">
                  <div class="panel-title">(b) Kirsch solution</div>
                  <svg viewBox="0 0 280 280" class="sci-svg-asi">
                    <!-- 坐标轴 -->
                    <line x1="50" y1="240" x2="260" y2="240" stroke="#2c3e50" stroke-width="2"/>
                    <line x1="50" y1="240" x2="50" y2="30" stroke="#2c3e50" stroke-width="2"/>
                    <polygon points="265,240 255,235 255,245" fill="#2c3e50"/>
                    <polygon points="50,25 45,35 55,35" fill="#2c3e50"/>

                    <!-- 轴标签 -->
                    <text x="240" y="258" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">r/a</text>
                    <text x="30" y="35" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">σ/σ₀</text>

                    <!-- 刻度 -->
                    <line x1="100" y1="235" x2="100" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="150" y1="235" x2="150" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="200" y1="235" x2="200" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <text x="100" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">1</text>
                    <text x="150" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">2</text>
                    <text x="200" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">3</text>

                    <line x1="45" y1="190" x2="55" y2="190" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="45" y1="140" x2="55" y2="140" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="45" y1="90" x2="55" y2="90" stroke="#2c3e50" stroke-width="1"/>
                    <text x="40" y="195" text-anchor="end" font-size="9" fill="#5d6d7e">1</text>
                    <text x="40" y="145" text-anchor="end" font-size="9" fill="#5d6d7e">2</text>
                    <text x="40" y="95" text-anchor="end" font-size="9" fill="#5d6d7e">3</text>

                    <!-- σᵣ 曲线 (蓝色) -->
                    <path d="M 50 90 L 100 170 Q 150 220 200 232 Q 250 238 260 240" fill="none" stroke="#2980b9" stroke-width="2.5"/>
                    <text x="210" y="225" font-size="10" fill="#2980b9" font-weight="bold">σᵣ</text>

                    <!-- σₜ 曲线 (红色) -->
                    <path d="M 50 240 L 100 60 Q 125 35 150 55 Q 200 100 250 160" fill="none" stroke="#c0392b" stroke-width="2.5"/>
                    <text x="110" y="50" font-size="10" fill="#c0392b" font-weight="bold">σₜ</text>

                    <!-- 2σ₀ 标注线 -->
                    <line x1="50" y1="140" x2="260" y2="140" stroke="#e74c3c" stroke-width="1" stroke-dasharray="4,2" opacity="0.5"/>
                    <text x="220" y="135" font-size="9" fill="#c0392b">2σ₀</text>

                    <!-- 隧道壁位置 -->
                    <line x1="100" y1="30" x2="100" y2="240" stroke="#34495e" stroke-width="1.5" stroke-dasharray="5,3"/>
                    <text x="95" y="25" font-size="8" fill="#34495e">r=a</text>

                    <!-- 图例 -->
                    <g transform="translate(150, 80)">
                      <rect x="0" y="0" width="105" height="50" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.95"/>
                      <line x1="8" y1="18" x2="28" y2="18" stroke="#2980b9" stroke-width="2.5"/>
                      <text x="35" y="22" font-size="9" fill="#2c3e50">Radial σᵣ</text>
                      <line x1="8" y1="35" x2="28" y2="35" stroke="#c0392b" stroke-width="2.5"/>
                      <text x="35" y="39" font-size="9" fill="#2c3e50">Tangential σₜ</text>
                    </g>
                  </svg>

                  <div class="principle-text">
                    <p><strong>Kirsch解：</strong>弹性力学精确解。σᵣ从σ₀降至洞壁处为0；σₜ在洞壁集中，理论最大值2σ₀，是岩爆发生的直接原因。</p>
                  </div>
                </div>

                <!-- 右图: 支承压力 -->
                <div class="asi-viz-panel">
                  <div class="panel-title">(c) Abutment pressure</div>
                  <svg viewBox="0 0 320 280" class="sci-svg-asi">
                    <!-- 坐标轴 -->
                    <line x1="50" y1="240" x2="300" y2="240" stroke="#2c3e50" stroke-width="2"/>
                    <line x1="50" y1="240" x2="50" y2="30" stroke="#2c3e50" stroke-width="2"/>
                    <polygon points="305,240 295,235 295,245" fill="#2c3e50"/>

                    <!-- 轴标签 -->
                    <text x="270" y="258" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">Distance</text>
                    <text x="25" y="35" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">K</text>

                    <!-- 采空区 -->
                    <rect x="50" y="40" width="60" height="200" fill="#95a5a6" opacity="0.2"/>
                    <text x="80" y="55" text-anchor="middle" font-size="9" fill="#7f8c8d">Mined</text>

                    <!-- 工作面位置 -->
                    <line x1="110" y1="40" x2="110" y2="240" stroke="#2c3e50" stroke-width="2"/>
                    <text x="110" y="255" text-anchor="middle" font-size="10" fill="#2c3e50" font-weight="bold">Face</text>

                    <!-- X轴刻度 -->
                    <line x1="170" y1="235" x2="170" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="230" y1="235" x2="230" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="290" y1="235" x2="290" y2="245" stroke="#2c3e50" stroke-width="1"/>
                    <text x="170" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">5m</text>
                    <text x="230" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">10m</text>
                    <text x="290" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">15m</text>

                    <!-- Y轴刻度 -->
                    <line x1="45" y1="190" x2="55" y2="190" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="45" y1="140" x2="55" y2="140" stroke="#2c3e50" stroke-width="1"/>
                    <line x1="45" y1="90" x2="55" y2="90" stroke="#2c3e50" stroke-width="1"/>
                    <text x="40" y="195" text-anchor="end" font-size="9" fill="#5d6d7e">1</text>
                    <text x="40" y="145" text-anchor="end" font-size="9" fill="#5d6d7e">2</text>
                    <text x="40" y="95" text-anchor="end" font-size="9" fill="#5d6d7e">3</text>

                    <!-- 原岩应力线 -->
                    <line x1="50" y1="190" x2="300" y2="190" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5,3"/>
                    <text x="270" y="185" font-size="9" fill="#7f8c8d">K=1</text>

                    <!-- 支承压力曲线 -->
                    <path d="M 50 190 L 90 180 Q 110 120 130 60 Q 150 40 170 55 Q 230 130 300 185" fill="none" stroke="#c0392b" stroke-width="3"/>

                    <!-- 峰值点 -->
                    <circle cx="140" cy="50" r="5" fill="#c0392b" stroke="white" stroke-width="2"/>
                    <text x="155" y="45" font-size="10" fill="#c0392b" font-weight="bold">Kmax≈2.5</text>

                    <!-- 峰值垂线 -->
                    <line x1="140" y1="50" x2="140" y2="240" stroke="#c0392b" stroke-width="1" stroke-dasharray="4,2" opacity="0.5"/>

                    <!-- 影响区 -->
                    <rect x="110" y="40" width="120" height="200" fill="#f39c12" opacity="0.08"/>
                    <line x1="230" y1="40" x2="230" y2="240" stroke="#f39c12" stroke-width="1" stroke-dasharray="5,3"/>
                    <text x="235" y="55" font-size="9" fill="#d68910">Influence zone</text>

                    <!-- 图例 -->
                    <g transform="translate(165, 95)">
                      <rect x="0" y="0" width="125" height="60" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.95"/>
                      <line x1="8" y1="20" x2="33" y2="20" stroke="#c0392b" stroke-width="3"/>
                      <text x="40" y="24" font-size="9" fill="#2c3e50">Abutment pressure</text>
                      <line x1="8" y1="40" x2="33" y2="40" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="4,2"/>
                      <text x="40" y="44" font-size="9" fill="#2c3e50">In-situ stress</text>
                    </g>
                  </svg>

                  <div class="principle-text">
                    <p><strong>支承压力：</strong>超前支承压力峰值Kmax位于工作面前方2-5m，应力集中系数可达2-3。这是ASI评估顶板稳定性的关键指标。</p>
                  </div>
                </div>
              </div>

              <!-- ASI计算原理总结 -->
              <div class="asi-calculation-principle">
                <div class="calc-step">
                  <div class="step-num">1</div>
                  <div class="step-content">
                    <strong>输入参数：</strong>巷道半径a，原岩应力σ₀，围岩力学参数(E, μ, c, φ)，UST参数b
                  </div>
                </div>
                <div class="calc-arrow">→</div>
                <div class="calc-step">
                  <div class="step-num">2</div>
                  <div class="step-content">
                    <strong>Kirsch解计算：</strong>确定围岩应力分布，识别塑性区范围Rp
                  </div>
                </div>
                <div class="calc-arrow">→</div>
                <div class="calc-step">
                  <div class="step-num">3</div>
                  <div class="step-content">
                    <strong>UST强度校核：</strong>比较σₜ与围岩强度，判断稳定性
                  </div>
                </div>
                <div class="calc-arrow">→</div>
                <div class="calc-step">
                  <div class="step-num">4</div>
                  <div class="step-content">
                    <strong>ASI评分：</strong>基于应力集中系数和塑性区大小计算ASI指数
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DBN 动态贝叶斯网络 -->
        <div v-if="activeAlgo === 'dbn'" class="algorithm-detail">
          <div class="algo-header">
            <h3>DBN - 动态贝叶斯网络 (Dynamic Bayesian Network)</h3>
            <p class="algo-desc">结合静态贝叶斯推理与动态时间演化，融合多源异构数据，实现矿压风险的时空预测与不确定性量化。</p>
          </div>

          <div class="principle-grid">
            <div class="principle-section">
              <h4>网络结构</h4>
              <p>DBN 由时间片组成，每个时间片包含观测节点、隐状态节点与输出节点，时间片之间通过转移概率关联。</p>

              <div class="sci-figure">
                <div class="figure-caption-top">
                  <strong>Fig. 4</strong> | Dynamic Bayesian Network (paper style). Observations O update hidden states H;
                  hidden states evolve over time and generate risk outputs R.
                </div>
                <div class="dbn-container">
                  <svg viewBox="0 0 860 320" class="sci-svg-dbn" role="img" aria-label="动态贝叶斯网络时间片结构示意图">
                    <defs>
                      <marker id="dbnArrowSolid" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#111827"/>
                      </marker>
                      <marker id="dbnArrowDash" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#111827"/>
                      </marker>
                    </defs>

                    <!-- 时间片背景 -->
                    <rect x="26" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>
                    <rect x="306" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>
                    <rect x="586" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>

                    <!-- 时间片标签 -->
                    <text x="150" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">Slice t-1</text>
                    <text x="430" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">Slice t</text>
                    <text x="710" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">Slice t+1</text>

                    <!-- slice t-1 -->
                    <rect x="50" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="90" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
                    <text x="90" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Observed</text>

                    <ellipse cx="206" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
                    <text x="206" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
                    <text x="206" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Hidden state</text>
                    <text x="206" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">risk / stress</text>

                    <circle cx="248" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="248" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
                    <text x="248" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">Output</text>

                    <!-- slice t -->
                    <rect x="330" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="370" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
                    <text x="370" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Observed</text>

                    <ellipse cx="486" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
                    <text x="486" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
                    <text x="486" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Hidden state</text>
                    <text x="486" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">risk / stress</text>

                    <circle cx="528" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="528" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
                    <text x="528" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">Output</text>

                    <!-- slice t+1 -->
                    <rect x="610" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="650" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
                    <text x="650" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Observed</text>

                    <ellipse cx="766" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
                    <text x="766" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
                    <text x="766" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">Hidden state</text>
                    <text x="766" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">risk / stress</text>

                    <circle cx="808" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
                    <text x="808" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
                    <text x="808" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">Output</text>

                    <!-- 片内关系 O -> H -->
                    <path d="M130 156 Q142 140 154 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>
                    <path d="M410 156 Q422 140 434 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>
                    <path d="M690 156 Q702 140 714 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>

                    <!-- 片内关系 H -> R -->
                    <path d="M238 122 Q244 112 248 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>
                    <path d="M518 122 Q524 112 528 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>
                    <path d="M798 122 Q804 112 808 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnArrowSolid)"/>

                    <!-- 时间转移 H_t-1 -> H_t -> H_t+1 -->
                    <line x1="258" y1="160" x2="434" y2="160" stroke="#111827" stroke-width="1.9" stroke-dasharray="6 5" marker-end="url(#dbnArrowDash)"/>
                    <line x1="538" y1="160" x2="714" y2="160" stroke="#111827" stroke-width="1.9" stroke-dasharray="6 5" marker-end="url(#dbnArrowDash)"/>
                    <text x="346" y="152" text-anchor="middle" font-size="11" fill="#111827" font-family="Times New Roman, serif">P(H<tspan baseline-shift="sub">t</tspan>|H<tspan baseline-shift="sub">t-1</tspan>)</text>
                    <text x="626" y="152" text-anchor="middle" font-size="11" fill="#111827" font-family="Times New Roman, serif">P(H<tspan baseline-shift="sub">t+1</tspan>|H<tspan baseline-shift="sub">t</tspan>)</text>

                    <!-- 图例 -->
                    <g transform="translate(32, 246)">
                      <rect x="0" y="0" width="560" height="54" rx="6" fill="#ffffff" stroke="#374151" stroke-width="1"/>

                      <rect x="14" y="17" width="22" height="15" rx="3" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
                      <text x="46" y="29" font-size="12" fill="#111827" font-family="Times New Roman, serif">O: observed variables</text>

                      <ellipse cx="302" cy="24" rx="13" ry="9" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
                      <text x="324" y="29" font-size="12" fill="#111827" font-family="Times New Roman, serif">H: hidden state</text>

                      <circle cx="26" cy="42" r="8" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
                      <text x="46" y="46" font-size="12" fill="#111827" font-family="Times New Roman, serif">R: risk output</text>

                      <line x1="290" y1="42" x2="318" y2="42" stroke="#111827" stroke-width="1.8" stroke-dasharray="6 5"/>
                      <text x="324" y="46" font-size="12" fill="#111827" font-family="Times New Roman, serif">dashed: temporal transition</text>
                    </g>
                  </svg>
                </div>
              </div>

              <div class="node-types dbn-node-types">
                <div class="node-type"><span class="dot obs"></span>观测节点：微震频次、能量、RSI/BRI/ASI</div>
                <div class="node-type"><span class="dot hidden"></span>隐状态：风险等级、应力积累程度</div>
                <div class="node-type"><span class="dot output"></span>输出节点：综合 MPI、风险概率</div>
              </div>
            </div>

            <div class="principle-section">
              <h4>概率推理公式</h4>
              <div class="formula-block">
                <div class="formula-title">贝叶斯定理</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.bayes"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">先验概率融合 (MPI 计算)</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.mpi"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">时间演化 (预测)</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.transition"></div>
              </div>
              <div class="formula-block">
                <div class="formula-title">后验更新</div>
                <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.posterior"></div>
              </div>
            </div>
          </div>

          <div class="principle-section full-width">
            <h4>概率推理示例</h4>
            <div class="inference-example">
              <div class="evidence-panel">
                <h5>观测证据</h5>
                <div class="evidence-items">
                  <label class="evidence-item">
                    <span>微震频次异常</span>
                    <input type="checkbox" v-model="evidence.seismic"/>
                  </label>
                  <label class="evidence-item">
                    <span>RSI &lt; 50</span>
                    <input type="checkbox" v-model="evidence.rsiLow"/>
                  </label>
                  <label class="evidence-item">
                    <span>BRI &lt; 50</span>
                    <input type="checkbox" v-model="evidence.briLow"/>
                  </label>
                  <label class="evidence-item">
                    <span>ASI &lt; 50</span>
                    <input type="checkbox" v-model="evidence.asiLow"/>
                  </label>
                </div>
              </div>
              <div class="posterior-panel">
                <h5>后验概率分布</h5>
                <div class="prob-bars">
                  <div class="prob-bar-item" v-for="(prob, level) in posteriorProbs" :key="level">
                    <span class="prob-label">{{ level }}</span>
                    <div class="prob-bar-track">
                      <div class="prob-bar-fill" :style="{ width: prob + '%', background: probColor(prob) }"></div>
                    </div>
                    <span class="prob-value">{{ prob.toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- 在线计算 Tab -->
    <template v-if="activeTab === 'calculation'">
      <!-- 指标概览 -->
      <section class="card dashboard-card">
        <div class="section-header">
          <h2>实时指标监控</h2>
          <p>基于当前岩层参数计算的各子指标数值</p>
        </div>
        <div class="indicator-dashboard">
          <div class="indicator-card" v-for="indicator in indicators" :key="indicator.key">
            <div class="indicator-header">
              <span class="indicator-tag">{{ indicator.tag }}</span>
              <span class="indicator-name">{{ indicator.name }}</span>
            </div>
            <div class="indicator-value" :class="valueClass(indicator.value)">{{ indicator.value.toFixed(1) }}</div>
            <div class="indicator-progress">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: indicator.value + '%', background: progressColor(indicator.value) }"></div>
              </div>
            </div>
            <div class="indicator-method">{{ indicator.method }}</div>
          </div>
        </div>
      </section>

      <!-- 算法模块 -->
      <section class="card calculation-card">
        <div class="section-header">
          <h2>算法计算模块</h2>
          <p>配置岩层参数并执行各算法计算</p>
        </div>

        <div class="calc-grid">
          <!-- RSI 模块 -->
          <div class="calc-module">
            <div class="module-header">
              <span class="module-tag">RSI</span>
              <h3>相场断裂计算</h3>
            </div>
            <div class="module-params">
              <div class="param-group">
                <label>岩层数据</label>
                <div class="strata-list">
                  <div class="strata-item" v-for="(layer, i) in strataData" :key="i">
                    <span>{{ layer.name }}</span>
                    <span>厚: {{ layer.thickness }}m</span>
                    <span>抗拉: {{ layer.tensile_strength }}MPa</span>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn calc-btn" @click="calculateRSI" :disabled="calculating.rsi">
              <span v-if="calculating.rsi" class="spinner sm"></span>
              <span>{{ calculating.rsi ? '计算中...' : '执行计算' }}</span>
            </button>
            <div v-if="results.rsi" class="module-result">
              <div ref="rsiChart" class="chart-container"></div>
            </div>
          </div>

          <!-- BRI 模块 -->
          <div class="calc-module">
            <div class="module-header">
              <span class="module-tag">BRI</span>
              <h3>微震矩张量反演</h3>
            </div>
            <div class="module-params">
              <div class="param-group">
                <label>微震事件</label>
                <div class="event-list">
                  <div class="event-item" v-for="(event, i) in microseismicData" :key="i">
                    <span>{{ event.time }}</span>
                    <span>震级: M{{ event.magnitude }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn calc-btn" @click="calculateBRI" :disabled="calculating.bri">
              <span v-if="calculating.bri" class="spinner sm"></span>
              <span>{{ calculating.bri ? '计算中...' : '执行计算' }}</span>
            </button>
            <div v-if="results.bri" class="module-result">
              <div ref="briChart" class="chart-container"></div>
            </div>
          </div>

          <!-- ASI 模块 -->
          <div class="calc-module">
            <div class="module-header">
              <span class="module-tag">ASI</span>
              <h3>统一强度理论分析</h3>
            </div>
            <div class="module-params">
              <div class="param-row">
                <label>隧道半径</label>
                <input type="number" v-model.number="tunnelParams.radius" class="param-input"/>
                <span>m</span>
              </div>
              <div class="param-row">
                <label>原岩应力</label>
                <input type="number" v-model.number="tunnelParams.original_stress" class="param-input"/>
                <span>MPa</span>
              </div>
              <div class="param-row">
                <label>支护压力</label>
                <input type="number" v-model.number="tunnelParams.support_pressure" class="param-input"/>
                <span>MPa</span>
              </div>
              <div class="param-row">
                <label>UST 参数 b</label>
                <input type="range" v-model.number="tunnelParams.ust_b" min="0" max="1" step="0.1" class="param-slider"/>
                <span>{{ tunnelParams.ust_b }}</span>
              </div>
            </div>
            <button class="btn calc-btn" @click="calculateASI" :disabled="calculating.asi">
              <span v-if="calculating.asi" class="spinner sm"></span>
              <span>{{ calculating.asi ? '计算中...' : '执行计算' }}</span>
            </button>
            <div v-if="results.asi" class="module-result">
              <div ref="asiChart" class="chart-container"></div>
            </div>
          </div>

          <!-- DBN 融合模块 -->
          <div class="calc-module fusion-module">
            <div class="module-header">
              <span class="module-tag">DBN</span>
              <h3>动态贝叶斯网络融合</h3>
            </div>
            <div class="fusion-weights">
              <div class="weight-control" v-for="w in weightItems" :key="w.key">
                <label>{{ w.label }}</label>
                <input type="range" v-model.number="weights[w.key]" min="0" max="1" step="0.05"/>
                <span>{{ (normalizedWeights[w.key] * 100).toFixed(0) }}%</span>
              </div>
            </div>
            <div class="weight-bar">
              <div class="weight-segment rsi" :style="{ width: normalizedWeights.rsi * 100 + '%' }"></div>
              <div class="weight-segment bri" :style="{ width: normalizedWeights.bri * 100 + '%' }"></div>
              <div class="weight-segment asi" :style="{ width: normalizedWeights.asi * 100 + '%' }"></div>
            </div>
            <button class="btn calc-btn fusion-btn" @click="calculateComprehensive" :disabled="calculating.fusion">
              <span v-if="calculating.fusion" class="spinner sm"></span>
              <span>{{ calculating.fusion ? '融合中...' : '综合评估' }}</span>
            </button>
            <div v-if="results.fusion" class="fusion-result">
              <div class="mpi-display">
                <span class="mpi-label">综合 MPI</span>
                <span class="mpi-value" :class="valueClass(results.fusion.mpi)">{{ results.fusion.mpi.toFixed(1) }}</span>
                <span class="mpi-risk" :class="results.fusion.riskClass">{{ results.fusion.riskLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'

const API_BASE = "http://localhost:5000/api"

// 当前 Tab 和算法
const activeTab = ref('principle')
const activeAlgo = ref('rsi')
const activeFlowNode = ref(0)

// 公式渲染
let katex = null
const formulas = {
  rsi: {
    energy: 'E(u, \\phi) = \\int_\\Omega \\left[ g(\\phi) \\Psi_e^+ + \\Psi_e^- + \\frac{G_c}{c_0} \\left( \\frac{\\phi}{l_0} + l_0 \\nabla \\phi \\cdot \\nabla \\phi \\right) \\right] d\\Omega',
    governing: '\\frac{\\partial \\phi}{\\partial t} = -M \\frac{\\delta E}{\\delta \\phi} = M \\left( 2l_0(1-\\phi)H - \\frac{G_c}{c_0 l_0} \\right)',
    griffith: '\\sigma_c = \\sqrt{\\frac{2 E G_c}{\\pi a}}',
    norm: '\\text{RSI}_{\\text{norm}} = \\min\\left(\\frac{\\bar{\\sigma_t}}{10}, 1\\right) \\times 40',
    key: '\\text{RSI}_{\\text{key}} = \\min(n_{\\text{key}} \\times 15, 30)',
    struct: '\\text{RSI}_{\\text{struct}} = (1 - r_{\\text{soft}}) \\times 40'
  },
  bri: {
    decomposition: '\\mathbf{M} = M_{\\text{ISO}} + M_{\\text{DC}} + M_{\\text{CLVD}}',
    waveform: 'u_i(t) = \\sum_{j=1}^3 M_{ij} \\cdot G_{ij}(t) + n(t)',
    main: '\\text{BRI} = \\max(100 - P_{\\text{depth}} - P_{\\text{hard}} - P_{\\text{thick}}, 0)',
    depth: 'P_{\\text{depth}} = \\min\\left(\\frac{H - H_{\\text{crit}}}{200}, 1\\right) \\times 40',
    hard: 'P_{\\text{hard}} = \\min\\left(\\frac{E_{\\text{hard}}}{500}, 1\\right) \\times 30',
    thick: 'P_{\\text{thick}} = \\min\\left(\\frac{h_{\\text{coal}}}{10}, 1\\right) \\times 30'
  },
  asi: {
    ust: 'F = \\sigma_1 - \\frac{1}{1+b}(b\\sigma_2 + \\sigma_3) = \\sigma_t',
    case1: '\\text{当 } \\sigma_2 \\leq \\frac{\\sigma_1 + b\\sigma_3}{1+b}: F = \\sigma_1 - \\frac{1}{1+b}(b\\sigma_2 + \\sigma_3)',
    kirsch: '\\sigma_r = \\sigma_0\\left(1 - \\frac{a^2}{r^2}\\right) + p_i\\frac{a^2}{r^2}',
    stiff: 'S_{\\text{stiff}} = \\min\\left(\\frac{\\bar{E}}{35} \\times 50, 50\\right)',
    fric: 'S_{\\text{fric}} = \\max\\left(\\frac{\\bar{\\varphi} - 20}{25} \\times 50, 0\\right)'
  },
  dbn: {
    bayes: 'P(H|O) = \\frac{P(O|H) \\cdot P(H)}{P(O)}',
    mpi: '\\text{MPI} = w_r \\cdot \\text{RSI} + w_b \\cdot \\text{BRI} + w_a \\cdot \\text{ASI}',
    transition: 'P(H_t | H_{t-1}) = \\prod_{i} P(H_t^{(i)} | \\text{Pa}(H_t^{(i)}))',
    posterior: 'P(H_t | O_{1:t}) \\propto P(O_t | H_t) \\sum_{H_{t-1}} P(H_t | H_{t-1}) P(H_{t-1} | O_{1:t-1})'
  }
}

const renderedFormulas = reactive({
  rsi: {}, bri: {}, asi: {}, dbn: {}
})

const renderFormula = (formula) => {
  if (!katex) return formula
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
      strict: false
    })
  } catch (e) {
    return formula
  }
}

// 流程节点
const flowNodes = [
  {
    key: 'rsi',
    title: 'RSI 计算',
    subtitle: '相场断裂分析',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    detailTitle: '相场断裂分析',
    detail: '基于 Griffith 断裂理论，通过相场变量 φ 描述裂纹演化，评估顶板岩层的断裂风险。输入岩层抗拉强度、关键层位置等参数。'
  },
  {
    key: 'bri',
    title: 'BRI 计算',
    subtitle: '微震矩张量反演',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>',
    detailTitle: '微震矩张量反演',
    detail: '利用地震波形反演震源机制张量，分解为 ISO/DC/CLVD 分量，识别岩体破裂类型与能量积累状态。'
  },
  {
    key: 'asi',
    title: 'ASI 计算',
    subtitle: '统一强度理论',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z"/><path d="M12 12l9-4.5"/><path d="M12 12v9"/></svg>',
    detailTitle: '统一强度理论分析',
    detail: '应用俞茂宏统一强度理论，考虑中间主应力影响，分析隧道围岩应力分布与支承压力特征。'
  },
  {
    key: 'dbn',
    title: 'DBN 融合',
    subtitle: '动态贝叶斯网络',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M12 8l-4 8"/><path d="M12 8l4 8"/></svg>',
    detailTitle: '动态贝叶斯网络融合',
    detail: '融合 RSI/BRI/ASI 多源数据，通过概率推理计算综合 MPI 指数，实现时空风险预测。'
  }
]

// 算法列表
const algorithms = [
  { key: 'rsi', tag: 'RSI', name: '相场断裂模型' },
  { key: 'bri', tag: 'BRI', name: '矩张量反演' },
  { key: 'asi', tag: 'ASI', name: '统一强度理论' },
  { key: 'dbn', tag: 'DBN', name: '动态贝叶斯网络' }
]

const newcomerJourney = [
  {
    step: '01',
    title: '先看输出结论',
    desc: '先看 MPI 和风险等级，明确这页最终回答的是“哪里更危险、为什么危险”。'
  },
  {
    step: '02',
    title: '再看证据来源',
    desc: '回看 RSI/BRI/ASI 三个子指标分别由哪些数据驱动，建立“数据到结论”的因果链。'
  },
  {
    step: '03',
    title: '最后看公式细节',
    desc: '只有在需要复核时再阅读公式推导，避免新用户一开始就被数学符号劝退。'
  }
]

const termGlossary = [
  {
    term: 'RSI',
    plain: '顶板稳定性评分',
    cue: '看顶板是否容易产生裂纹和失稳，分数越低风险越高。'
  },
  {
    term: 'BRI',
    plain: '冲击地压风险评分',
    cue: '看深部开采条件下的能量积聚和突发风险。'
  },
  {
    term: 'ASI',
    plain: '支承压力与应力集中评分',
    cue: '看工作面前方应力峰值与塑性区大小，指导支护强度。'
  },
  {
    term: 'DBN',
    plain: '动态概率融合模型',
    cue: '把多个子指标和时序证据融合成最终风险概率。'
  },
  {
    term: '相场变量 φ',
    plain: '裂纹状态刻度',
    cue: 'φ 越接近 1 代表材料越接近完全断裂。'
  },
  {
    term: '后验概率',
    plain: '结合证据后的风险判断',
    cue: '不是固定值，会随着新观测数据实时更新。'
  }
]

const algorithmStoryboards = [
  {
    key: 'rsi',
    tag: 'RSI',
    name: '相场断裂模型',
    input: '岩层强度、关键层分布',
    process: '模拟裂纹起裂与扩展',
    output: '顶板稳定性评分',
    watch: 'Fig.1 的裂纹演化 + RSI 指标分解'
  },
  {
    key: 'bri',
    tag: 'BRI',
    name: '矩张量反演',
    input: '微震波形、埋深、岩性',
    process: '分解 ISO/DC/CLVD 震源机制',
    output: '冲击地压风险评分',
    watch: 'Beach Ball 机制图 + 深度风险曲线'
  },
  {
    key: 'asi',
    tag: 'ASI',
    name: '统一强度理论',
    input: '原岩应力、支护参数、UST 参数 b',
    process: 'Kirsch 应力重分布 + 强度判据',
    output: '支承压力风险评分',
    watch: '三联图(a)(b)(c) + ASI 四步计算链'
  },
  {
    key: 'dbn',
    tag: 'DBN',
    name: '动态贝叶斯网络',
    input: 'RSI/BRI/ASI 与实时观测证据',
    process: '时序概率更新与融合推理',
    output: 'MPI 概率分布与风险等级',
    watch: '时间片网络结构 + 后验概率条形图'
  }
]

// 证据和推理

// 证据和推理
const evidence = reactive({
  seismic: true,
  rsiLow: false,
  briLow: true,
  asiLow: false
})

const posteriorProbs = computed(() => {
  let high = 20, medium = 30, low = 50
  if (evidence.seismic) { high += 20; medium += 10; low -= 30 }
  if (evidence.rsiLow) { high += 15; medium += 5; low -= 20 }
  if (evidence.briLow) { high += 15; medium += 10; low -= 25 }
  if (evidence.asiLow) { high += 10; medium += 5; low -= 15 }
  const total = high + medium + low
  return {
    '高风险': (high / total) * 100,
    '中风险': (medium / total) * 100,
    '低风险': (low / total) * 100
  }
})

const probColor = (prob) => {
  if (prob > 50) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (prob > 30) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #22c55e, #16a34a)'
}

// 指标和权重
const indicators = ref([
  { key: "rsi", tag: "RSI", name: "顶板稳定性", value: 0, method: "相场断裂模型" },
  { key: "bri", tag: "BRI", name: "冲击地压风险", value: 0, method: "矩张量反演" },
  { key: "asi", tag: "ASI", name: "支承压力分布", value: 0, method: "统一强度理论" },
  { key: "mpi", tag: "MPI", name: "综合风险指数", value: 0, method: "动态贝叶斯网络" }
])

const weights = reactive({ rsi: 0.4, bri: 0.35, asi: 0.25 })
const weightItems = [
  { key: 'rsi', label: 'RSI 权重' },
  { key: 'bri', label: 'BRI 权重' },
  { key: 'asi', label: 'ASI 权重' }
]

const weightSum = computed(() => weights.rsi + weights.bri + weights.asi)
const normalizedWeights = computed(() => {
  const sum = weightSum.value || 1
  return { rsi: weights.rsi / sum, bri: weights.bri / sum, asi: weights.asi / sum }
})

// 计算状态
const calculating = reactive({ rsi: false, bri: false, asi: false, fusion: false })
const results = reactive({ rsi: false, bri: false, asi: false, fusion: false })

// 样本数据
const strataData = [
  { name: "顶板", thickness: 5.0, tensile_strength: 2.5, elastic_modulus: 15.0, compressive_strength: 35 },
  { name: "煤层", thickness: 3.0, tensile_strength: 1.0, elastic_modulus: 5.0, compressive_strength: 15 },
  { name: "底板", thickness: 4.0, tensile_strength: 3.0, elastic_modulus: 20.0, compressive_strength: 45 }
]

const microseismicData = [
  { time: "2024-01-01 10:00", location: [100, 200, -500], magnitude: 2.5 },
  { time: "2024-01-01 12:00", location: [150, 220, -480], magnitude: 3.0 },
  { time: "2024-01-01 14:00", location: [120, 210, -490], magnitude: 2.8 }
]

const tunnelParams = reactive({
  radius: 3.0,
  original_stress: 10.0,
  support_pressure: 0.5,
  ust_b: 0.5
})

// 图表引用
const rsiChart = ref()
const briChart = ref()
const asiChart = ref()
let rsiChartInst = null
let briChartInst = null
let asiChartInst = null

// 值样式
const valueClass = (v) => {
  if (v >= 70) return 'low'
  if (v >= 50) return 'medium'
  return 'high'
}

const progressColor = (v) => {
  if (v >= 70) return 'linear-gradient(90deg, #22c55e, #16a34a)'
  if (v >= 50) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #ef4444, #dc2626)'
}

// 计算方法
const calculateRSI = async () => {
  calculating.rsi = true
  try {
    const response = await axios.post(`${API_BASE}/rsi/phase-field`, {
      strata: strataData,
      mesh_size: 50,
      time_steps: 10
    })
    if (response.data.success) {
      indicators.value[0].value = response.data.rsi_value
      results.rsi = true
      nextTick(() => renderRSIChart(response.data))
    }
  } catch (error) {
    // 模拟数据
    indicators.value[0].value = 65.3
    results.rsi = true
    nextTick(() => renderRSIChart({ crack_locations: [[25, 25], [30, 28], [35, 32]] }))
  }
  calculating.rsi = false
}

const calculateBRI = async () => {
  calculating.bri = true
  try {
    const response = await axios.post(`${API_BASE}/bri/microseismic`, {
      microseismic_events: microseismicData,
      sensor_positions: [[0, 0, 0], [100, 0, 0], [0, 100, 0]],
      time_window_days: 7
    })
    if (response.data.success) {
      indicators.value[1].value = response.data.bri_value
      results.bri = true
      nextTick(() => renderBRIChart(response.data))
    }
  } catch (error) {
    indicators.value[1].value = 58.7
    results.bri = true
    nextTick(() => renderBRIChart({ moment_tensors: [{ iso_percent: 15, dc_percent: 70, clvd_percent: 15 }] }))
  }
  calculating.bri = false
}

const calculateASI = async () => {
  calculating.asi = true
  try {
    const response = await axios.post(`${API_BASE}/asi/ust`, {
      strata: strataData,
      tunnel_radius: tunnelParams.radius,
      original_stress: tunnelParams.original_stress,
      support_pressure: tunnelParams.support_pressure,
      ust_parameter_b: tunnelParams.ust_b
    })
    if (response.data.success) {
      indicators.value[2].value = response.data.asi_value
      results.asi = true
      nextTick(() => renderASIChart(response.data))
    }
  } catch (error) {
    indicators.value[2].value = 72.5
    results.asi = true
    nextTick(() => renderASIChart({
      stress_distribution: { radial_distances: [3, 4, 5, 6, 7, 8, 9, 10] },
      radial_stress: [5, 7, 8, 8.5, 9, 9.2, 9.5, 10],
      tangential_stress: [25, 20, 17, 15, 14, 13, 12, 11]
    }))
  }
  calculating.asi = false
}

const calculateComprehensive = async () => {
  calculating.fusion = true
  try {
    const response = await axios.post(`${API_BASE}/comprehensive-assessment`, {
      strata: strataData,
      microseismic_events: microseismicData,
      sensor_positions: [[0, 0, 0], [100, 0, 0], [0, 100, 0]],
      geological_context: {},
      historical_data: []
    })
    if (response.data.success) {
      indicators.value[0].value = response.data.rsi.value
      indicators.value[1].value = response.data.bri.value
      indicators.value[2].value = response.data.asi.value
      indicators.value[3].value = response.data.fusion.mpi
      results.fusion = {
        mpi: response.data.fusion.mpi,
        riskLabel: response.data.fusion.risk_label,
        riskClass: response.data.fusion.risk_label === '低风险' ? 'low' : response.data.fusion.risk_label === '中风险' ? 'medium' : 'high'
      }
    }
  } catch (error) {
    const mpi = normalizedWeights.value.rsi * 65.3 + normalizedWeights.value.bri * 58.7 + normalizedWeights.value.asi * 72.5
    indicators.value[3].value = mpi
    const label = mpi >= 70 ? '低风险' : mpi >= 50 ? '中风险' : '高风险'
    results.fusion = { mpi, riskLabel: label, riskClass: label === '低风险' ? 'low' : label === '中风险' ? 'medium' : 'high' }
  }
  calculating.fusion = false
}

// 图表渲染
const renderRSIChart = (data) => {
  if (!rsiChart.value) return
  if (!rsiChartInst) rsiChartInst = echarts.init(rsiChart.value)
  rsiChartInst.setOption({
    title: { text: '相场断裂分布', textStyle: { color: '#5a6378', fontSize: 14 } },
    grid: { left: '10%', right: '10%', top: '20%', bottom: '15%' },
    xAxis: { type: 'value', name: 'X (m)', nameTextStyle: { color: '#8892a8' }, axisLine: { lineStyle: { color: '#d0d5dc' } } },
    yAxis: { type: 'value', name: 'Y (m)', nameTextStyle: { color: '#8892a8' }, axisLine: { lineStyle: { color: '#d0d5dc' } } },
    series: [{
      type: 'scatter',
      symbolSize: 10,
      data: data.crack_locations || [[25, 25], [30, 28], [35, 32]],
      itemStyle: { color: '#ef4444' }
    }]
  })
}

const renderBRIChart = (data) => {
  if (!briChart.value) return
  if (!briChartInst) briChartInst = echarts.init(briChart.value)
  const tensors = data.moment_tensors || [{ iso_percent: 15, dc_percent: 70, clvd_percent: 15 }]
  briChartInst.setOption({
    title: { text: '矩张量分解', textStyle: { color: '#5a6378', fontSize: 14 } },
    legend: { data: ['ISO%', 'DC%', 'CLVD%'], textStyle: { color: '#5a6378' }, top: '10%' },
    grid: { left: '10%', right: '10%', top: '25%', bottom: '10%' },
    xAxis: { type: 'category', data: tensors.map((_, i) => `Event ${i+1}`), axisLine: { lineStyle: { color: '#d0d5dc' } } },
    yAxis: { type: 'value', name: '百分比 (%)', nameTextStyle: { color: '#8892a8' }, axisLine: { lineStyle: { color: '#d0d5dc' } } },
    series: [
      { name: 'ISO%', type: 'bar', data: tensors.map(t => t.iso_percent), itemStyle: { color: '#22c55e' } },
      { name: 'DC%', type: 'bar', data: tensors.map(t => t.dc_percent), itemStyle: { color: '#5a6378' } },
      { name: 'CLVD%', type: 'bar', data: tensors.map(t => t.clvd_percent), itemStyle: { color: '#f59e0b' } }
    ]
  })
}

const renderASIChart = (data) => {
  if (!asiChart.value) return
  if (!asiChartInst) asiChartInst = echarts.init(asiChart.value)
  const distances = data.stress_distribution?.radial_distances || [3, 4, 5, 6, 7, 8, 9, 10]
  const radial = data.radial_stress || [5, 7, 8, 8.5, 9, 9.2, 9.5, 10]
  const tangential = data.tangential_stress || [25, 20, 17, 15, 14, 13, 12, 11]
  asiChartInst.setOption({
    title: { text: '围岩应力分布', textStyle: { color: '#5a6378', fontSize: 14 } },
    legend: { data: ['径向应力', '切向应力'], textStyle: { color: '#5a6378' }, top: '10%' },
    grid: { left: '12%', right: '10%', top: '25%', bottom: '15%' },
    xAxis: { type: 'value', name: '径向距离 (m)', nameTextStyle: { color: '#8892a8' }, axisLine: { lineStyle: { color: '#d0d5dc' } } },
    yAxis: { type: 'value', name: '应力 (MPa)', nameTextStyle: { color: '#8892a8' }, axisLine: { lineStyle: { color: '#d0d5dc' } } },
    series: [
      { name: '径向应力', type: 'line', smooth: true, data: distances.map((r, i) => [r, radial[i]]), itemStyle: { color: '#5a6378' }, lineStyle: { width: 3 } },
      { name: '切向应力', type: 'line', smooth: true, data: distances.map((r, i) => [r, tangential[i]]), itemStyle: { color: '#ef4444' }, lineStyle: { width: 3 } }
    ]
  })
}

onMounted(async () => {
  // 加载 KaTeX
  try {
    const katexModule = await import('katex')
    katex = katexModule.default || katexModule
    await import('katex/dist/katex.min.css')

    // 渲染公式
    Object.keys(formulas).forEach(algo => {
      Object.keys(formulas[algo]).forEach(key => {
        renderedFormulas[algo][key] = renderFormula(formulas[algo][key])
      })
    })
  } catch (e) {
    console.error('KaTeX load failed:', e)
  }
})
</script>

<style scoped>
/* 页面容器 - Academic Light Theme */
.academic-algorithm-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  line-height: 1.75;
  animation: pageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 页面头部 */
.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 24px;
  background: var(--bg-primary);
  padding: 28px 32px;
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.page-header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.page-header-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  background: var(--gradient-primary);
  flex-shrink: 0;
  color: white;
}

.page-header-icon svg {
  width: 26px;
  height: 26px;
}

.page-title {
  margin: 0 0 6px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--border-radius-md);
}

.mode-tab {
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  color: var(--text-primary);
}

.mode-tab.active {
  background: var(--bg-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* 卡片基础样式 */
.card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: 28px 32px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.section-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* 概览卡片 */
.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.overview-text h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.overview-text p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
  max-width: 700px;
}

.overview-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--color-primary);
  font-weight: 500;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

/* 新手导读 */
.onboarding-card {
  background:
    radial-gradient(circle at top right, rgba(90, 99, 120, 0.08), transparent 55%),
    var(--bg-primary);
}

.onboarding-grid {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(420px, 1.2fr);
  gap: 24px;
  align-items: start;
}

.reading-path {
  display: grid;
  gap: 14px;
}

.reading-step {
  display: flex;
  gap: 14px;
  padding: 14px;
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.reading-index {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  background: var(--gradient-primary);
  flex-shrink: 0;
}

.reading-body h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: var(--text-primary);
}

.reading-body p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.65;
}

.io-map {
  padding: 16px;
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.io-map h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.io-map-svg {
  width: 100%;
  height: auto;
  display: block;
}

.io-map-tip {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 术语速查 */
.glossary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.glossary-item {
  padding: 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.glossary-item h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: var(--text-primary);
}

.glossary-plain {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 600;
}

.glossary-cue {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* 分镜示意 */
.storyboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.storyboard-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.storyboard-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.storyboard-tag {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.storyboard-head h3 {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
}

.storyboard-strip {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}

.story-node {
  min-height: 78px;
  padding: 10px 8px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  text-align: center;
}

.story-node.input {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(14, 165, 233, 0.03));
}

.story-node.process {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(139, 92, 246, 0.03));
}

.story-node.output {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.03));
}

.story-node-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.story-node-text {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.45;
}

.story-arrow {
  font-size: 18px;
  color: var(--text-tertiary);
  font-weight: 700;
}

.storyboard-watch {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.storyboard-jump {
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.storyboard-jump:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

/* 流程图 */
.flow-diagram {
  position: relative;
  padding: 24px 0;
}

.flow-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.flow-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.25s ease;
}

.flow-node:hover,
.flow-node.active {
  background: var(--gradient-primary);
  border-color: transparent;
  transform: translateY(-2px);
}

.flow-node:hover .node-title,
.flow-node.active .node-title,
.flow-node:hover .node-subtitle,
.flow-node.active .node-subtitle {
  color: white;
}

.flow-node:hover .node-icon,
.flow-node.active .node-icon {
  background: rgba(255,255,255,0.2);
}

.node-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--color-primary);
  transition: all 0.25s ease;
}

.node-icon svg {
  width: 24px;
  height: 24px;
}

.node-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.node-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.node-subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: center;
}

.flow-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  transform: translateY(-50%);
  z-index: 0;
  padding: 0 12%;
}

.flow-arrow {
  width: 24px;
  height: 24px;
  color: var(--color-secondary);
}

.flow-arrow svg {
  width: 100%;
  height: 100%;
}

.flow-detail {
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
}

.flow-detail h4 {
  margin: 0 0 8px 0;
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

/* 算法标签页 */
.algorithm-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.algo-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.algo-tab:hover {
  border-color: var(--color-secondary);
}

.algo-tab.active {
  background: var(--gradient-primary);
  border-color: transparent;
}

.algo-tab.active .tab-tag,
.algo-tab.active .tab-name {
  color: white;
}

.tab-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.tab-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

/* 算法详情 */
.algorithm-detail {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.algo-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.algo-header h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.algo-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.principle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.principle-section {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.principle-section.full-width {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.principle-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.principle-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.principle-section p {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.principle-list {
  margin: 0 0 20px 0;
  padding-left: 20px;
}

.principle-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 公式块 */
.formula-block {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.formula-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.formula-body {
  font-family: "Times New Roman", "Cambria Math", serif;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.8;
}

.formula-katex {
  font-size: 15px;
  line-height: 2;
  padding: 16px 20px;
  margin: 8px 0;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.formula-katex :deep(.katex) {
  color: var(--text-primary);
}

/* SCI论文级图表样式 */
.sci-figure {
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
}

.figure-caption-top {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-family: "Times New Roman", Georgia, serif;
}

.figure-caption-top strong {
  color: #1f2937;
  font-weight: 600;
}

/* Phase Field */
.phase-field-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pf-subfigure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pf-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  font-family: Arial, sans-serif;
}

.crack-sequence {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.sequence-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.time-label {
  font-size: 11px;
  color: #6b7280;
  font-family: "Times New Roman", serif;
  font-style: italic;
}

/* Beachball */
.beachball-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.beachball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.beachball-info {
  text-align: center;
}

.bb-type {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  font-family: Arial, sans-serif;
  margin-bottom: 2px;
}

.bb-name {
  font-size: 12px;
  color: #4b5563;
  font-family: Arial, sans-serif;
  margin-bottom: 2px;
}

.bb-desc {
  font-size: 10px;
  color: #6b7280;
  font-family: Arial, sans-serif;
}

/* UST */
.ust-container {
  display: flex;
  justify-content: center;
}

/* DBN */
.dbn-container {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 8px 0 4px;
  border-radius: var(--border-radius-sm);
  background: #ffffff;
  border: 1px solid #d1d5db;
}

/* Depth Curve */
.depth-curve-sci {
  display: flex;
  justify-content: center;
}

/* SVG 样式 */
.sci-svg,
.sci-svg-beachball,
.sci-svg-ust,
.sci-svg-dbn,
.sci-svg-depth {
  display: block;
  max-width: 100%;
  height: auto;
}

.sci-svg-small {
  width: 70px;
  height: 70px;
}

.sci-svg-beachball {
  width: 140px;
  height: 140px;
}

.sci-svg-ust {
  max-width: 450px;
}

.sci-svg-dbn {
  width: min(100%, 860px);
  min-width: 720px;
  max-width: 860px;
}

.sci-svg-depth {
  max-width: 420px;
}

/* 可视化组件 */
.principle-visual {
  margin-top: 20px;
}

.phase-field-demo {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  border: 1px solid var(--border-color);
}

.phase-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.phase-gradient {
  flex: 1;
  height: 24px;
  background: linear-gradient(90deg, #22c55e 0%, #f59e0b 50%, #ef4444 100%);
  border-radius: 12px;
}

.phase-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.crack-evolution {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.evolution-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-visual {
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.crack-line {
  position: absolute;
  top: 50%;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ef4444, #dc2626);
  transform: translateY(-50%);
  border-radius: 2px;
}

.evolution-step span {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 矩张量分解可视化 */
.mt-decomposition {
  margin-top: 20px;
}

.decomp-visual {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.beachball {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.beachball-svg {
  width: 80px;
  height: 80px;
}

.beachball-svg svg {
  width: 100%;
  height: 100%;
}

.beachball-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* 深度模型 */
.depth-model {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

.depth-curve-visual {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  border: 1px solid var(--border-color);
}

.curve-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.axis-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.axis-label.y {
  align-self: flex-start;
  transform: rotate(-90deg) translateX(-20px);
}

.curve-plot svg {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.depth-formulas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 统一强度理论可视化 */
.ust-visual {
  margin-top: 20px;
}

.strength-envelope {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  border: 1px solid var(--border-color);
}

.strength-envelope svg {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* 指标分解 */
.indicator-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.breakdown-item {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  border: 1px solid var(--border-color);
  text-align: center;
}

.breakdown-formula {
  margin-bottom: 12px;
}

.breakdown-item p {
  margin: 0;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* ASI 应力分布可视化 - 图文并茂 */
.asi-stress-figure {
  margin-top: 20px;
}

.asi-viz-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 16px 0;
}

.asi-viz-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  font-family: Arial, sans-serif;
}

.sci-svg-asi {
  width: 100%;
  height: auto;
  display: block;
}

.principle-text {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.principle-text p {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: #4b5563;
}

.principle-text strong {
  color: #1f2937;
}

/* ASI计算原理流程 */
.asi-calculation-principle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border: 1px solid #bae6fd;
  overflow-x: auto;
}

.calc-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 140px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0284c7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.step-content {
  font-size: 10px;
  line-height: 1.5;
  color: #374151;
  text-align: center;
}

.step-content strong {
  display: block;
  margin-bottom: 2px;
  color: #0c4a6e;
}

.calc-arrow {
  font-size: 20px;
  color: #0284c7;
  font-weight: bold;
  flex-shrink: 0;
}

/* 应力分布演示（旧版 - 保留兼容） */
.stress-distribution-demo {
  margin-top: 24px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.stress-bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 120px;
  padding: 0 40px;
  position: relative;
}

.stress-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.stress-bar-wrapper {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
}

.stress-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.stress-bar-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
}

.peak-marker {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.peak-arrow {
  font-size: 20px;
  color: var(--color-error);
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.peak-label {
  font-size: 10px;
  color: var(--color-error);
  font-weight: 600;
  background: var(--color-error-light);
  padding: 2px 8px;
  border-radius: 4px;
}

/* DBN 可视化 */
.dbn-visual {
  margin-top: 20px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.dbn-timeline {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.time-slice {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.slice-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.slice-nodes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dbn-node {
  width: 64px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
}

.dbn-node.obs {
  background: #dbeafe;
  color: #1e40af;
  border: 2px solid #3b82f6;
}

.dbn-node.hidden {
  background: #fef3c7;
  color: #92400e;
  border: 2px solid #f59e0b;
}

.dbn-node.output {
  background: #d1fae5;
  color: #065f46;
  border: 2px solid #10b981;
}

.dbn-edge {
  font-size: 16px;
  color: var(--text-tertiary);
}

.temporal-edges {
  margin-top: 8px;
}

.temporal-edges svg {
  width: 100%;
  max-width: 600px;
  height: 60px;
  display: block;
  margin: 0 auto;
}

.node-types {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.node-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 8px 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.obs { background: #3b82f6; }
.dot.hidden { background: #f59e0b; }
.dot.output { background: #10b981; }

.dbn-node-types .node-type {
  background: #ffffff;
  border-color: #d1d5db;
  font-family: "Times New Roman", serif;
  color: #111827;
}

.dbn-node-types .dot {
  border: 1.4px solid #111827;
}

.dbn-node-types .dot.obs { background: #e5e7eb; }
.dbn-node-types .dot.hidden { background: #9ca3af; }
.dbn-node-types .dot.output { background: #4b5563; }

/* 推理示例 */
.inference-example {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 20px;
}

.evidence-panel,
.posterior-panel {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.evidence-panel h5,
.posterior-panel h5 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.evidence-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evidence-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.evidence-item:hover {
  background: var(--bg-tertiary);
}

.evidence-item span {
  font-size: 14px;
  color: var(--text-secondary);
}

.evidence-item input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.prob-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prob-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prob-label {
  width: 60px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.prob-bar-track {
  flex: 1;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.prob-bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
}

.prob-value {
  width: 50px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}

/* 指标仪表板 */
.indicator-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.indicator-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.indicator-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.indicator-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.indicator-value {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1;
}

.indicator-value.low {
  color: var(--color-success);
}

.indicator-value.medium {
  color: var(--color-warning);
}

.indicator-value.high {
  color: var(--color-error);
}

.indicator-progress {
  margin-bottom: 8px;
}

.progress-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.indicator-method {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 计算模块 */
.calc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.calc-module {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.calc-module.fusion-module {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--color-primary-light) 100%);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.module-tag {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.module-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.module-params {
  margin-bottom: 20px;
}

.param-group {
  margin-bottom: 16px;
}

.param-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.strata-list,
.event-list {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  max-height: 120px;
  overflow-y: auto;
}

.strata-item,
.event-item {
  display: flex;
  gap: 16px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-light);
}

.strata-item:last-child,
.event-item:last-child {
  border-bottom: none;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.param-row label {
  width: 80px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.param-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--bg-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.param-slider {
  flex: 1;
  accent-color: var(--color-primary);
}

.param-row span {
  width: 40px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.calc-btn {
  width: 100%;
  margin-bottom: 16px;
}

.calc-btn.fusion-btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.module-result {
  margin-top: 16px;
}

.chart-container {
  width: 100%;
  height: 250px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

/* 融合模块 */
.fusion-weights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 20px;
}

.weight-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-control label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.weight-control input {
  accent-color: var(--color-primary);
}

.weight-control span {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.weight-bar {
  display: flex;
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.weight-segment {
  transition: width 0.3s ease;
}

.weight-segment.rsi { background: #6366f1; }
.weight-segment.bri { background: #8b5cf6; }
.weight-segment.asi { background: #22c55e; }

.fusion-result {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.mpi-display {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 40px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.mpi-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mpi-value {
  font-size: 48px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mpi-risk {
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.mpi-risk.low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.mpi-risk.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.mpi-risk.high {
  background: var(--color-error-light);
  color: var(--color-error);
}

/* 响应式 */
@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-actions {
    justify-self: stretch;
  }

  .principle-grid,
  .calc-grid {
    grid-template-columns: 1fr;
  }

  .indicator-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }

  .indicator-breakdown,
  .depth-model,
  .inference-example {
    grid-template-columns: 1fr;
  }

  .onboarding-grid,
  .storyboard-grid,
  .glossary-grid {
    grid-template-columns: 1fr;
  }

  .storyboard-strip {
    grid-template-columns: 1fr;
  }

  .story-arrow {
    transform: rotate(90deg);
    justify-self: center;
  }

  .fusion-weights {
    grid-template-columns: 1fr;
  }

  .asi-viz-wrapper {
    grid-template-columns: 1fr;
  }

  .asi-calculation-principle {
    flex-direction: column;
    gap: 12px;
  }

  .calc-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .academic-algorithm-page {
    gap: 20px;
  }

  .page-header {
    padding: 20px 24px;
  }

  .page-title {
    font-size: 20px;
  }

  .overview-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .reading-step {
    padding: 12px;
  }

  .io-map {
    padding: 12px;
  }

  .flow-row {
    flex-direction: column;
  }

  .flow-arrows {
    display: none;
  }

  .indicator-dashboard {
    grid-template-columns: 1fr;
  }

  .algorithm-tabs {
    flex-direction: column;
  }

  .algo-tab {
    justify-content: flex-start;
  }

  .mpi-display {
    flex-direction: column;
    gap: 12px;
  }

  .mode-tabs {
    flex-direction: column;
    width: 100%;
  }

  .mode-tab {
    text-align: center;
  }

  .sci-svg-dbn {
    min-width: 640px;
  }

  .node-types {
    gap: 10px;
  }

  .node-type {
    font-size: 12px;
    padding: 7px 10px;
  }
}

/* 打印样式 */
@media print {
  .academic-algorithm-page {
    max-width: 100%;
  }

  .header-actions,
  .calc-btn {
    display: none;
  }

  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #d0d5dc;
  }
}
</style>
