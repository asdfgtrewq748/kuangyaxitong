<template>
  <div class="page mpi-algorithm-page">
    <PageHeader
      class="main-header"
      title="MPI 鐭垮帇褰卞搷鎸囨爣绠楁硶鍘熺悊"
      description="浠庡博灞傚弬鏁板埌绌洪棿鍒嗗竷鐨勫彲瑙ｉ噴鎸囨暟锛?-5 鍒嗛挓蹇€熺悊瑙?
    >
      <template #actions>
        <div class="header-actions">
          <div class="export-controls">
            <select v-model="exportScope" class="param-select export-select">
              <option value="sub">瀵煎嚭褰撳墠瀛愬浘</option>
              <option value="all">瀵煎嚭鍏ㄩ儴鍥撅紙鎵归噺锛?/option>
            </select>
            <select v-model="exportFormat" class="param-select export-select">
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
            </select>
            <select v-model="exportVariant" class="param-select export-select">
              <option value="current">褰撳墠閰嶈壊</option>
              <option value="both">褰╄壊+榛戠櫧</option>
            </select>
            <label class="export-toggle">
              <input type="checkbox" v-model="exportAsZip" />
              鎵撳寘ZIP
            </label>
            <button class="btn ghost" :disabled="exportBusy" @click="downloadFigure">
              {{ exportBusy ? '瀵煎嚭涓?..' : '寮€濮嬪鍑? }}
            </button>
            <button class="btn ghost" :class="{ highlight: exportDone }" @click="openDownloads">鎵撳紑涓嬭浇璁板綍</button>
          </div>
          <div v-if="exportStatus" class="export-status">{{ exportStatus }}</div>
          <div v-if="exportDone" class="export-done">瀵煎嚭瀹屾垚锛屽彲鏌ョ湅涓嬭浇璁板綍銆?/div>
          <div v-if="exportError" class="export-error">{{ exportError }}</div>
          <div v-if="exportBusy" class="export-progress">
            <div class="export-progress-bar" :style="{ width: `${exportProgress}%` }"></div>
          </div>
        </div>
      </template>
    </PageHeader>

    <section class="card overview-card">
      <div class="overview-text">
        <h2>涓€鍙ヨ瘽鎬昏</h2>
        <p>
          MPI 灏?strong>宀╁眰鍙傛暟</strong>杞寲涓?RSI / BRI / ASI 涓変釜瀛愭寚鏍囷紝
          閫氳繃鏉冮噸铻嶅悎寰楀埌缁煎悎鎸囨暟锛屽苟鏄犲皠涓?strong>绌洪棿椋庨櫓绛夌骇</strong>鐑姏鍥俱€?
        </p>
      </div>
      <div class="overview-badges">
        <span class="badge">鍙В閲?/span>
        <span class="badge">鍙拷韪?/span>
        <span class="badge">鍙獙璇?/span>
      </div>
    </section>

    <section class="card flow-card">
      <div class="section-header flow-header">
        <div>
          <h2>鎬讳綋娴佺▼鍥?/h2>
          <p>鎮仠鏌ョ湅姣忎竴姝ユ暟鎹惈涔変笌杈撳嚭璇存槑</p>
        </div>
        <div class="mode-tabs">
          <button :class="['mode-tab', { active: !useBwFigures }]" @click="useBwFigures = false">褰╄壊</button>
          <button :class="['mode-tab', { active: useBwFigures }]" @click="useBwFigures = true">榛戠櫧</button>
        </div>
      </div>
      <div class="flow-figure">
        <img :src="useBwFigures ? '/mpi-algorithm/flow_overview_bw.svg' : '/mpi-algorithm/flow_overview.svg'" alt="MPI娴佺▼鍥? class="flow-image" loading="lazy" decoding="async" />
        <p class="figure-caption">鍥? | MPI 璁＄畻娴佺▼绀烘剰</p>
      </div>
      <div class="flow-steps">
        <div
          v-for="(step, idx) in flowSteps"
          :key="step.key"
          class="flow-step"
          :class="{ active: activeStep === idx }"
          @mouseenter="activeStep = idx"
        >
          <div class="step-index">{{ idx + 1 }}</div>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="card indicators-card">
      <div class="section-header">
        <h2>瀛愭寚鏍囨ā鍧?/h2>
        <p>姣忎釜瀛愭寚鏍囬兘瀵瑰簲鏄庣‘鐨勮緭鍏ュ弬鏁颁笌鐗╃悊鍚箟</p>
      </div>
      <div class="indicator-grid">
        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">RSI</span>
            <h3>椤舵澘绋冲畾鎬?/h3>
          </div>
          <ul>
            <li>杈撳叆锛氭姉鎷夊己搴︺€佸叧閿眰鏁伴噺銆佸博灞傜粨鏋?/li>
            <li>鍚箟锛氭弿杩伴《鏉跨牬鍧忔晱鎰熸€?/li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/rsi_stability_bw.svg' : '/mpi-algorithm/rsi_stability.svg'" alt="RSI椤舵澘绋冲畾鎬хず鎰? loading="lazy" decoding="async" />
            <span>鍥? | 椤舵澘绋冲畾鎬ф瀯鎴?/span>
          </div>
          <div class="formula">
            <div class="formula-title">璁＄畻鍏紡</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.norm"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.key"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.struct"></div>
          </div>
          <div class="indicator-visual">
            <div class="visual-bar">
              <span>绋冲畾鎬?鈫?/span>
              <div class="bar-track"><div class="bar-fill" style="width:72%"></div></div>
            </div>
          </div>
        </div>

        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">BRI</span>
            <h3>鍐插嚮鍦板帇椋庨櫓</h3>
          </div>
          <ul>
            <li>杈撳叆锛氶噰娣便€佺‖鍘氬博灞傘€佺叅灞傚帤搴?/li>
            <li>鍚箟锛氭弿杩版繁搴︿笌纭眰甯︽潵鐨勮兘閲忕Н绱?/li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/bri_depth_curve_bw.svg' : '/mpi-algorithm/bri_depth_curve.svg'" alt="BRI閲囨繁褰卞搷鏇茬嚎" loading="lazy" decoding="async" />
            <span>鍥? | 閲囨繁褰卞搷鏇茬嚎</span>
          </div>

          <!-- 娣卞害浜や簰婊戝潡 -->
          <div class="interactive-control">
            <div class="control-header">
              <span class="control-label">閲囨繁妯℃嫙</span>
              <span class="control-value" :class="briRiskClass">{{ briSimDepth }}m ({{ briSimLabel }})</span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              step="10"
              v-model.number="briSimDepth"
              class="depth-slider"
            />
            <div class="depth-labels">
              <span>0m</span>
              <span>400m</span>
              <span>800m</span>
              <span>1200m</span>
            </div>
            <div class="bri-sim-result">
              <div class="bri-value-bar">
                <div class="bri-bar-track">
                  <div class="bri-bar-fill" :style="{ width: briSimValue + '%', background: briBarColor }"></div>
                </div>
                <span class="bri-value">BRI = {{ briSimValue.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <div class="formula">
            <div class="formula-title">璁＄畻鍏紡</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.depth"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.hard"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.thick"></div>
          </div>
          <div class="indicator-visual">
            <div class="visual-line">
              <span>娣卞害 鈫?椋庨櫓 鈫?/span>
              <div class="line-track"></div>
            </div>
          </div>
        </div>

        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">ASI</span>
            <h3>鏀壙鍘嬪姏鍒嗗竷</h3>
          </div>
          <ul>
            <li>杈撳叆锛氱患鍚堝垰搴︺€佸唴鎽╂摝瑙?/li>
            <li>鍚箟锛氭弿杩板簲鍔涗紶閫掍笌闆嗕腑绋嬪害</li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/asi_stress_profile_bw.svg' : '/mpi-algorithm/asi_stress_profile.svg'" alt="ASI搴斿姏浼犻€掔ず鎰? loading="lazy" decoding="async" />
            <span>鍥? | 搴斿姏浼犻€掑墫闈?/span>
          </div>
          <div class="formula">
            <div class="formula-title">璁＄畻鍏紡</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.stiff"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.fric"></div>
          </div>
          <!-- ASI搴斿姏浼犻€掑姩鐢?-->
          <div class="asi-animation-container">
            <div class="asi-label">搴斿姏浼犻€掓ā鎷?/div>
            <div class="stress-bars">
              <div
                v-for="(bar, idx) in stressBars"
                :key="idx"
                class="stress-bar"
                :style="{
                  height: bar.height + '%',
                  background: bar.color,
                  animationDelay: bar.delay + 's'
                }"
              ></div>
            </div>
            <div class="stress-labels">
              <span>閲囩┖鍖?/span>
              <span>鐓ゅ</span>
              <span>鍓嶆柟</span>
            </div>
            <div class="peak-indicator" :style="{ left: peakPosition + '%' }">
              <div class="peak-arrow">鈫?/div>
              <div class="peak-label">宄板€?/div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card weight-card">
      <div class="section-header">
        <h2>鏉冮噸瑙ｉ噴鍖?/h2>
        <p>鎷栧姩婊戝潡妯℃嫙鏉冮噸鍙樺寲瀵?MPI 鐨勫奖鍝?/p>
      </div>
      <div class="weight-grid">
        <div class="weight-controls">
          <div class="weight-item" v-for="item in weightItems" :key="item.key">
            <div class="weight-label">
              <span>{{ item.label }}</span>
              <span class="weight-value">{{ (normalizedWeights[item.key] * 100).toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="weights[item.key]"
            />
            <div class="weight-hint">榛樿锛歿{ item.default }}</div>
          </div>
        </div>
        <div class="weight-preview">
          <div class="stack-bar">
            <div class="stack-segment rsi" :style="{ width: normalizedWeights.rsi * 100 + '%' }"></div>
            <div class="stack-segment bri" :style="{ width: normalizedWeights.bri * 100 + '%' }"></div>
            <div class="stack-segment asi" :style="{ width: normalizedWeights.asi * 100 + '%' }"></div>
          </div>
          <div class="stack-legend">
            <span><i class="dot rsi"></i>RSI</span>
            <span><i class="dot bri"></i>BRI</span>
            <span><i class="dot asi"></i>ASI</span>
          </div>
          <div class="weight-note">
            榛樿鏉冮噸鏉ユ簮浜庝笓瀹剁粡楠屼笌鍘嗗彶鏍锋湰鎷熷悎锛屽彲鍦ㄥ悗缁増鏈腑寮€鏀捐嚜瀹氫箟绛栫暐銆?
          </div>
          <!-- MPI铻嶅悎鍏紡 -->
          <div class="formula formula-inline">
            <div class="formula-title">MPI铻嶅悎鍏紡</div>
            <div class="formula-body formula-katex" v-html="renderInlineFormula(formulas.mpi)"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="card risk-card">
      <div class="section-header">
        <h2>椋庨櫓绛夌骇涓庡喅绛栬В閲?/h2>
        <p>MPI 鍊艰秺楂樿〃绀虹ǔ瀹氭€ц秺濂斤紝椋庨櫓瓒婁綆</p>
      </div>
      <div class="risk-grid">
        <div class="risk-level">
          <span class="level high">楂橀闄?/span>
          <p>MPI &lt; 50锛屽缓璁姞寮烘敮鎶や笌鐩戞祴</p>
        </div>
        <div class="risk-level">
          <span class="level medium">涓闄?/span>
          <p>50 鈮?MPI &lt; 70锛屽缓璁€傚害浼樺寲鏂藉伐鍙傛暟</p>
        </div>
        <div class="risk-level">
          <span class="level low">浣庨闄?/span>
          <p>MPI 鈮?70锛屾柦宸ユ潯浠剁浉瀵圭ǔ瀹?/p>
        </div>
      </div>
    </section>

    <section class="card example-card">
      <div class="section-header">
        <h2>绀轰緥婕旂畻</h2>
        <p>閫夋嫨鐪熷疄鏍风偣鍋氬彲杩借釜婕旂畻锛屽寮哄彲淇″害</p>
      </div>
      <div class="example-grid">
        <div class="example-table">
          <div class="sample-selector">
            <button
              v-for="item in samplePoints"
              :key="item.id"
              :class="['sample-btn', { active: activeSampleId === item.id }]"
              @click="activeSampleId = item.id"
            >
              {{ item.name }}
            </button>
          </div>
          <div class="table-row header">
            <span>鍙傛暟</span>
            <span>绀轰緥鍊?/span>
          </div>
          <div class="table-row" v-for="row in sampleRows" :key="row.label">
            <span>{{ row.label }}</span>
            <span>{{ row.value }}</span>
          </div>
        </div>
        <div class="example-result">
          <div class="result-title">缁煎悎 MPI</div>
          <div class="result-value">{{ sampleResult.mpi.toFixed(2) }}</div>
          <div class="result-level" :class="sampleRisk.class">{{ sampleRisk.label }}</div>
          <div class="result-breakdown">
            <span>RSI: {{ sampleResult.breakdown.rsi.toFixed(2) }}</span>
            <span>BRI: {{ sampleResult.breakdown.bri.toFixed(2) }}</span>
            <span>ASI: {{ sampleResult.breakdown.asi.toFixed(2) }}</span>
          </div>
          <div class="result-desc">鍩轰簬 MPI 璁捐鏂囨。鍏紡鐨勫疄鏃舵紨绠?/div>
        </div>
      </div>
    </section>

    <section class="card output-card">
      <div class="section-header">
        <h2>鍥惧儚鐢熸垚閫昏緫</h2>
        <p>璇存槑 MPI 缃戞牸涓庡彲瑙嗗寲鏄犲皠娴佺▼</p>
      </div>

      <div class="output-steps">
        <div class="output-step" v-for="item in outputSteps" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
      <div class="output-note">
        棰滆壊鏄犲皠閲囩敤 ODI 鑹插甫鏍囧噯锛屾敮鎸?SVG + PNG 楂樺垎杈ㄧ巼杈撳嚭銆?
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { PageHeader } from '../components/library'
// Lazy load KaTeX - only loads formulas when component is mounted
let katex = null
let jsZipCtor = null
const { markStepDone } = useWorkspaceFlow()

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || window.JSZip || null
  if (!jsZipCtor) throw new Error('JSZip 鍔犺浇澶辫触')
  return jsZipCtor
}

// KaTeX娓叉煋鍑芥暟 - handles lazy loaded KaTeX
const renderFormula = (formula) => {
  if (!katex) return formula // Return plain text if KaTeX not loaded yet
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
      strict: false
    })
  } catch (e) {
    console.error('KaTeX render error:', e)
    return formula
  }
}

// 瀹氫箟鍏紡鐨凩aTeX琛ㄨ揪寮?
const formulas = {
  rsi: {
    main: '\\text{RSI} = \\min(\\text{RSI}_{\\text{norm}} + \\text{RSI}_{\\text{key}} + \\text{RSI}_{\\text{struct}}, 0, 100)',
    norm: '\\text{RSI}_{\\text{norm}} = \\min\\left(\\frac{\\bar{\\sigma_t}}{10}, 1\\right) \\times 40',
    key: '\\text{RSI}_{\\text{key}} = \\min(n_{\\text{key}} \\times 15, 30)',
    struct: '\\text{RSI}_{\\text{struct}} = (1 - r_{\\text{soft}}) \\times 40'
  },
  bri: {
    main: '\\text{BRI} = \\max(100 - P_{\\text{depth}} - P_{\\text{hard}} - P_{\\text{thick}}, 0)',
    depth: 'P_{\\text{depth}} = \\min\\left(\\frac{H - H_{\\text{crit}}}{200}, 1\\right) \\times 40',
    hard: 'P_{\\text{hard}} = \\min\\left(\\frac{E_{\\text{hard}}}{500}, 1\\right) \\times 30',
    thick: 'P_{\\text{thick}} = \\min\\left(\\frac{h_{\\text{coal}}}{10}, 1\\right) \\times 30'
  },
  asi: {
    main: '\\text{ASI} = S_{\\text{stiff}} + S_{\\text{fric}}',
    stiff: 'S_{\\text{stiff}} = \\min\\left(\\frac{\\bar{E}}{35} \\times 50, 50\\right)',
    fric: 'S_{\\text{fric}} = \\max\\left(\\frac{\\bar{\\varphi} - 20}{25} \\times 50, 0\\right)'
  },
  mpi: '\\text{MPI} = w_r \\cdot \\text{RSI} + w_b \\cdot \\text{BRI} + w_a \\cdot \\text{ASI}'
}

// 娓叉煋鍚庣殑鍏紡HTML
const renderedFormulas = reactive({
  rsi: { main: '', norm: '', key: '', struct: '' },
  bri: { main: '', depth: '', hard: '', thick: '' },
  asi: { main: '', stiff: '', fric: '' }
})

onMounted(async () => {
  markStepDone('MpiAlgorithm')
  // Lazy load KaTeX only when this component mounts
  try {
    const katexModule = await import('katex')
    katex = katexModule.default || katexModule
    await import('katex/dist/katex.min.css')

    // 娓叉煋RSI鍏紡
    renderedFormulas.rsi.main = renderFormula(formulas.rsi.main)
    renderedFormulas.rsi.norm = renderFormula(formulas.rsi.norm)
    renderedFormulas.rsi.key = renderFormula(formulas.rsi.key)
    renderedFormulas.rsi.struct = renderFormula(formulas.rsi.struct)

    // 娓叉煋BRI鍏紡
    renderedFormulas.bri.main = renderFormula(formulas.bri.main)
    renderedFormulas.bri.depth = renderFormula(formulas.bri.depth)
    renderedFormulas.bri.hard = renderFormula(formulas.bri.hard)
    renderedFormulas.bri.thick = renderFormula(formulas.bri.thick)

    // 娓叉煋ASI鍏紡
    renderedFormulas.asi.main = renderFormula(formulas.asi.main)
    renderedFormulas.asi.stiff = renderFormula(formulas.asi.stiff)
    renderedFormulas.asi.fric = renderFormula(formulas.asi.fric)
  } catch (e) {
    console.error('Failed to load KaTeX:', e)
    // Fallback to plain text formulas
    Object.keys(formulas).forEach(key => {
      if (typeof formulas[key] === 'string') {
        // Single formula
      } else if (typeof formulas[key] === 'object') {
        // Multiple formulas
        Object.keys(formulas[key]).forEach(subKey => {
          renderedFormulas[key][subKey] = formulas[key][subKey]
        })
      }
    })
  }
})

// 鍐呰仈娓叉煋鍑芥暟 (鐢ㄤ簬鍗曡鍏紡)
const renderInlineFormula = (formula) => {
  if (!katex) return formula
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: false,
      output: 'html',
      strict: false
    })
  } catch (e) {
    console.error('KaTeX render error:', e)
    return formula
  }
}

const flowSteps = [
  {
    key: 'input',
    title: '鏁版嵁杈撳叆',
    subtitle: '宀╁眰鍙傛暟 / 鍦拌川淇℃伅',
    detailTitle: '杈撳叆鏁版嵁鏉ユ簮',
    detail: '鍖呮嫭閽诲瓟宀╂€с€佺叅灞傚帤搴︺€佹姉鎷夊己搴︺€侀噰娣辩瓑锛屾墍鏈夊弬鏁板彲杩借釜鍒板師濮嬭〃鏍笺€?
  },
  {
    key: 'sub',
    title: '瀛愭寚鏍囪绠?,
    subtitle: 'RSI / BRI / ASI',
    detailTitle: '瀛愭寚鏍囪緭鍑?,
    detail: '鍒嗗埆鎻忚堪椤舵澘绋冲畾鎬с€佸啿鍑婚闄╀笌鏀壙鍘嬪姏鍒嗗竷锛屼究浜庤В閲婁笌璇婃柇銆?
  },
  {
    key: 'fusion',
    title: '鏉冮噸铻嶅悎',
    subtitle: '榛樿 0.4 / 0.35 / 0.25',
    detailTitle: '鏉冮噸铻嶅悎閫昏緫',
    detail: '閫氳繃鏉冮噸鍔犳潈寰楀埌缁煎悎 MPI锛屽彲鏍规嵁鐭垮尯缁忛獙杩涜寰皟骞惰褰曘€?
  },
  {
    key: 'risk',
    title: '椋庨櫓绛夌骇',
    subtitle: '浣?/ 涓?/ 楂?,
    detailTitle: '椋庨櫓鏄犲皠',
    detail: '灏?MPI 鏁板€煎垝鍒嗕负椋庨櫓绛夌骇锛屾敮鎾戞柦宸ュ喅绛栦笌棰勮銆?
  },
  {
    key: 'output',
    title: '鍥惧儚杈撳嚭',
    subtitle: '鐑姏鍥?/ 绛夊€肩嚎',
    detailTitle: '鍙鍖栬緭鍑?,
    detail: '鐢熸垚楂樺垎杈ㄧ巼鐑姏鍥句笌绛夊€肩嚎锛屾敮鎸佹姤鍛婄骇瀵煎嚭銆?
  }
]

const activeStep = ref(0)

const useBwFigures = ref(false)
const exportScope = ref('sub')
const exportFormat = ref('svg')
const exportVariant = ref('current')
const exportAsZip = ref(false)
const exportBusy = ref(false)
const exportProgress = ref(0)
const exportStatus = ref('')
const exportError = ref('')
const exportDone = ref(false)

const weights = reactive({
  rsi: 0.4,
  bri: 0.35,
  asi: 0.25
})

// BRI娣卞害妯℃嫙
const briSimDepth = ref(600)
const briSimValue = computed(() => {
  const depth = briSimDepth.value
  const criticalDepth = 400
  const depthPenalty = depth > criticalDepth
    ? Math.min((depth - criticalDepth) / 200, 1) * 40
    : 0
  // 鍋囪涓瓑纭眰鍜岀叅灞傚帤搴?
  const hardPenalty = 15
  const thicknessPenalty = 15
  return Math.min(Math.max(100 - depthPenalty - hardPenalty - thicknessPenalty, 0), 100)
})
const briRiskClass = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return 'low'
  if (v >= 50) return 'medium'
  return 'high'
})
const briSimLabel = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return '浣庨闄?
  if (v >= 50) return '涓闄?
  return '楂橀闄?
})
const briBarColor = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return 'linear-gradient(90deg, #22c55e, #16a34a)'
  if (v >= 50) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #ef4444, #dc2626)'
})

// ASI搴斿姏鍔ㄧ敾
const stressBars = computed(() => {
  // 妯℃嫙鏀壙鍘嬪姏鍒嗗竷鏇茬嚎锛氶噰绌哄尯浣?-> 鐓ゅ宄板€?-> 鍓嶆柟琛板噺
  const bars = []
  for (let i = 0; i < 20; i++) {
    const x = i / 19 // 0 鍒?1
    // 搴斿姏鍒嗗竷鍑芥暟锛氬乏浣?-> 涓嘲 -> 鍙宠“鍑?
    let stress
    if (x < 0.4) {
      // 閲囩┖鍖猴細杈冧綆搴斿姏
      stress = 30 + Math.random() * 10
    } else if (x < 0.6) {
      // 鐓ゅ闄勮繎锛氬簲鍔涢泦涓嘲鍊?
      const peak = 1 - Math.abs(x - 0.5) / 0.1
      stress = 30 + peak * 60 + Math.random() * 5
    } else {
      // 鍓嶆柟锛氳“鍑忚嚦鍘熷博搴斿姏
      const decay = Math.exp(-(x - 0.6) * 3)
      stress = 30 + decay * 30 + Math.random() * 10
    }
    bars.push({
      height: Math.min(Math.max(stress, 10), 95),
      color: stress > 70 ? 'linear-gradient(180deg, #ef4444, #dc2626)' :
             stress > 50 ? 'linear-gradient(180deg, #f59e0b, #d97706)' :
             'linear-gradient(180deg, #22c55e, #16a34a)',
      delay: i * 0.05
    })
  }
  return bars
})

const peakPosition = computed(() => 50) // 宄板€煎湪鐓ゅ浣嶇疆

const weightItems = [
  { key: 'rsi', label: 'RSI 鏉冮噸', default: '0.40' },
  { key: 'bri', label: 'BRI 鏉冮噸', default: '0.35' },
  { key: 'asi', label: 'ASI 鏉冮噸', default: '0.25' }
]

const weightSum = computed(() => weights.rsi + weights.bri + weights.asi)
const normalizedWeights = computed(() => {
  const sum = weightSum.value || 1
  return {
    rsi: weights.rsi / sum,
    bri: weights.bri / sum,
    asi: weights.asi / sum
  }
})

const samplePoints = [
  {
    id: 'a',
    name: '鏍蜂緥鐐?A锛堟眹鎬昏〃娴呭煁锛?,
    point: { burial_depth: 86.0, thickness: 6.0 },
    strata: [
      { name: '宀╁眰1', thickness: 6.0, tensile_strength: 2.3, compressive_strength: 20.51, elastic_modulus: 3.0, friction_angle: 28.0 },
      { name: '宀╁眰2', thickness: 1.5, tensile_strength: 1.2, compressive_strength: 14.32, elastic_modulus: 9.8, friction_angle: 17.5 },
      { name: '宀╁眰3', thickness: 8.0, tensile_strength: 4.5, compressive_strength: 26.93, elastic_modulus: 17.0, friction_angle: 22.3 },
      { name: '宀╁眰4', thickness: 12.5, tensile_strength: 10.5, compressive_strength: 35.36, elastic_modulus: 28.0, friction_angle: 20.0 },
      { name: '宀╁眰5', thickness: 7.0, tensile_strength: 3.6, compressive_strength: 33.93, elastic_modulus: 25.0, friction_angle: 28.0 }
    ]
  },
  {
    id: 'b',
    name: '鏍蜂緥鐐?B锛堟眹鎬昏〃娣卞煁锛?,
    point: { burial_depth: 967.7, thickness: 5.9 },
    strata: [
      { name: '宀╁眰1', thickness: 5.9, tensile_strength: 2.4, compressive_strength: 27.0, elastic_modulus: 0.5, friction_angle: 42.6 },
      { name: '宀╁眰2', thickness: 1.5, tensile_strength: 4.7, compressive_strength: 38.3, elastic_modulus: 10.8, friction_angle: 36.0 },
      { name: '宀╁眰3', thickness: 15.7, tensile_strength: 3.1, compressive_strength: 32.8, elastic_modulus: 9.3, friction_angle: 38.8 },
      { name: '宀╁眰4', thickness: 20.0, tensile_strength: 2.1, compressive_strength: 27.0, elastic_modulus: 8.34, friction_angle: 37.8 },
      { name: '宀╁眰5', thickness: 46.0, tensile_strength: 3.1, compressive_strength: 27.0, elastic_modulus: 9.3, friction_angle: 38.8 }
    ]
  }
]

const activeSampleId = ref(samplePoints[0].id)

const activeSample = computed(() => samplePoints.find(item => item.id === activeSampleId.value) || samplePoints[0])

const identifyKeyLayers = (strata) => {
  const referenceModulus = 35
  return strata.filter(layer =>
    layer.compressive_strength > 60 &&
    layer.thickness > 5 &&
    layer.elastic_modulus / referenceModulus > 0.8
  )
}

const calcRsi = (strata) => {
  const immediate = strata.slice(0, 2)
  const totalImmediate = immediate.reduce((sum, layer) => sum + layer.thickness, 0)
  const rsiImmediate = totalImmediate > 0
    ? immediate.reduce((sum, layer) => sum + layer.thickness * layer.tensile_strength, 0) / totalImmediate
    : 0

  const keyLayers = identifyKeyLayers(strata)
  const rsiKey = Math.min(keyLayers.length * 15, 30)

  const totalStrata = strata.reduce((sum, layer) => sum + layer.thickness, 0)
  const softRatio = totalStrata > 0
    ? strata.filter(layer => layer.compressive_strength < 30).reduce((sum, layer) => sum + layer.thickness, 0) / totalStrata
    : 0
  const rsiStructure = (1 - softRatio) * 40

  const rsiNorm = Math.min(rsiImmediate / 10, 1) * 40
  return Math.min(Math.max(rsiNorm + rsiKey + rsiStructure, 0), 100)
}

const calcBri = (point, strata) => {
  const depth = point.burial_depth || 0
  const coalThickness = point.thickness || 0
  const criticalDepth = 400
  const depthPenalty = depth > criticalDepth
    ? Math.min((depth - criticalDepth) / 200, 1) * 40
    : 0

  const hardEnergy = strata
    .filter(layer => layer.compressive_strength > 60)
    .reduce((sum, layer) => sum + layer.thickness * layer.elastic_modulus, 0)
  const hardPenalty = Math.min(hardEnergy / 500, 1) * 30
  const thicknessPenalty = Math.min(coalThickness / 10, 1) * 30
  return Math.min(Math.max(100 - depthPenalty - hardPenalty - thicknessPenalty, 0), 100)
}

const calcAsi = (strata) => {
  const total = strata.reduce((sum, layer) => sum + layer.thickness, 0)
  if (total === 0) return 50

  const avgStiffness = strata.reduce((sum, layer) => sum + layer.elastic_modulus * layer.thickness, 0) / total
  const stiffnessScore = Math.min(avgStiffness / 35 * 50, 50)

  const avgFriction = strata.reduce((sum, layer) => sum + layer.friction_angle * layer.thickness, 0) / total
  const frictionScore = Math.max(Math.min((avgFriction - 20) / 25 * 50, 50), 0)

  return Math.min(Math.max(stiffnessScore + frictionScore, 0), 100)
}

const sampleResult = computed(() => {
  const { point, strata } = activeSample.value
  const rsi = calcRsi(strata)
  const bri = calcBri(point, strata)
  const asi = calcAsi(strata)
  const mpi = (
    normalizedWeights.value.rsi * rsi +
    normalizedWeights.value.bri * bri +
    normalizedWeights.value.asi * asi
  )
  return {
    mpi,
    breakdown: { rsi, bri, asi }
  }
})

const sampleRisk = computed(() => {
  const value = sampleResult.value.mpi
  if (value >= 70) {
    return { label: '浣庨闄?, class: 'low' }
  }
  if (value >= 50) {
    return { label: '涓闄?, class: 'medium' }
  }
  return { label: '楂橀闄?, class: 'high' }
})

const sampleRows = computed(() => [
  { label: '鍩嬫繁 (m)', value: activeSample.value.point.burial_depth.toFixed(1) },
  { label: '鐓ゅ眰鍘氬害 (m)', value: activeSample.value.point.thickness.toFixed(1) },
  { label: '鍏抽敭灞傛暟閲?, value: identifyKeyLayers(activeSample.value.strata).length },
  { label: 'RSI', value: sampleResult.value.breakdown.rsi.toFixed(2) },
  { label: 'BRI', value: sampleResult.value.breakdown.bri.toFixed(2) },
  { label: 'ASI', value: sampleResult.value.breakdown.asi.toFixed(2) },
  { label: '鏉冮噸 (RSI/BRI/ASI)', value: `${normalizedWeights.value.rsi.toFixed(2)} / ${normalizedWeights.value.bri.toFixed(2)} / ${normalizedWeights.value.asi.toFixed(2)}` },
  { label: 'MPI', value: sampleResult.value.mpi.toFixed(2) }
])

const outputSteps = [
  { title: '1. 缃戞牸鍖?, desc: '灏嗛噰闆嗙偣杞崲涓鸿鍒欑綉鏍硷紝淇濋殰绌洪棿鍒嗚鲸鐜囦竴鑷淬€? },
  { title: '2. 鎻掑€?, desc: '閲囩敤 IDW/Linear/Nearest 绛夋柟娉曞～琛ョ┖缂哄尯鍩熴€? },
  { title: '3. 棰滆壊鏄犲皠', desc: '鎸夌収椋庨櫓绛夌骇涓?ODI 鑹插甫鏄犲皠棰滆壊銆? },
  { title: '4. 鍙犲姞鏍囨敞', desc: '鍙犲姞绛夊€肩嚎銆佸潗鏍囪酱涓庡叧閿偣娉ㄨ銆? }
]

const downloadFiles = (files) => {
  files.forEach((fileName, idx) => {
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = `/mpi-algorithm/${fileName}`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, idx * 200)
  })
}

const buildFileList = (variant) => {
  const format = exportFormat.value
  const isBw = variant === 'bw'
  const suffix = isBw ? '_bw' : ''

  if (exportScope.value === 'sub') {
    return [
      `flow_overview${suffix}.${format}`,
      `rsi_stability${suffix}.${format}`,
      `bri_depth_curve${suffix}.${format}`,
      `asi_stress_profile${suffix}.${format}`,
      `mpi_colorbar${suffix}.${format}`
    ]
  }

  return [
    `flow_overview${suffix}.${format}`,
    `rsi_stability${suffix}.${format}`,
    `bri_depth_curve${suffix}.${format}`,
    `asi_stress_profile${suffix}.${format}`,
    `mpi_colorbar${suffix}.${format}`
  ]
}

const buildZipName = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  return `kuangyaxitong-mpi-${exportScope.value}-${exportFormat.value}-${date}.zip`
}

const downloadZip = async (files) => {
  const JSZip = await getJSZipCtor()
  const zip = new JSZip()
  const folder = zip.folder('mpi-figures')
  let completed = 0

  for (const fileName of files) {
    const res = await fetch(`/mpi-algorithm/${fileName}`)
    const blob = await res.blob()
    folder.file(fileName, blob)
    completed += 1
    exportProgress.value = Math.round((completed / files.length) * 80)
    exportStatus.value = `姝ｅ湪鎵撳寘锛?{completed}/${files.length}`
  }

  exportStatus.value = '姝ｅ湪鐢熸垚ZIP...'
  const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    exportProgress.value = 80 + Math.round(metadata.percent * 0.2)
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(zipBlob)
  link.download = buildZipName()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const downloadFigure = async () => {
  exportBusy.value = true
  exportProgress.value = 0
  exportStatus.value = '鍑嗗瀵煎嚭...'
  exportError.value = ''
  exportDone.value = false
  try {
    const variants = exportVariant.value === 'both'
      ? ['color', 'bw']
      : [useBwFigures.value ? 'bw' : 'color']

    const files = variants.flatMap(variant => buildFileList(variant))

    if (exportAsZip.value) {
      await downloadZip(files)
    } else {
      exportStatus.value = `鍑嗗涓嬭浇 ${files.length} 涓枃浠?..`
      downloadFiles(files)
      exportProgress.value = 100
    }
    exportStatus.value = '瀵煎嚭瀹屾垚'
    exportDone.value = true
  } catch (error) {
    exportStatus.value = '瀵煎嚭澶辫触'
    exportError.value = `閿欒鍘熷洜锛?{error?.message || '鏈煡閿欒'}`
  } finally {
    setTimeout(() => {
      exportBusy.value = false
      exportStatus.value = ''
      exportError.value = ''
      exportProgress.value = 0
      exportDone.value = false
    }, 1200)
  }
}

const openDownloads = () => {
  const targets = ['chrome://downloads/', 'edge://downloads/all', 'about:downloads']
  let opened = false
  for (const url of targets) {
    const win = window.open(url, '_blank')
    if (win) {
      opened = true
      break
    }
  }
  if (!opened) {
    exportStatus.value = '娴忚鍣ㄩ檺鍒舵墦寮€涓嬭浇椤碉紝鍙敤蹇嵎閿?Ctrl+J 鏌ョ湅涓嬭浇璁板綍銆?
  }
}
</script>

<style scoped>
/* Page Container - Optimized max-width and spacing */
.mpi-algorithm-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 1400px;
  margin: 0 auto;
  line-height: 1.75;
}

/* Page Header - Improved proportions and spacing - Academic Light Style */
.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 28px;
  background: var(--bg-primary);
  padding: var(--spacing-6) var(--spacing-8);
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
  color: #fff;
}

.page-title {
  margin: 0 0 var(--spacing-1) 0;
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

/* Header Actions - Optimized width and spacing */
.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 300px;
}

.export-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
  background: var(--bg-primary);
  padding: var(--spacing-3);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.export-controls .export-select:nth-child(1),
.export-controls .export-select:nth-child(2) {
  grid-column: span 1;
}

.export-controls .export-select:nth-child(3) {
  grid-column: span 2;
}

.export-status {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.export-done {
  font-size: 12px;
  color: var(--color-success);
  text-align: right;
}

.export-error {
  font-size: 12px;
  color: var(--color-error);
  text-align: right;
}

.export-progress {
  width: 100%;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.export-progress-bar {
  height: 100%;
  background: var(--color-primary);
  width: 0;
  transition: width 0.2s ease;
}

.export-select {
  width: 100%;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  padding: 0 var(--spacing-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-select:hover {
  border-color: var(--color-secondary);
  background: var(--bg-elevated);
}

.export-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.export-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  height: 40px;
  padding: 0 var(--spacing-4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-toggle:hover {
  border-color: var(--color-secondary);
  background: var(--bg-tertiary);
}

.export-toggle input {
  accent-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

/* Ghost Button Style */
.btn.ghost {
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-primary);
  border: 2px solid rgba(15, 118, 110, 0.28);
  padding: var(--spacing-3) var(--spacing-5);
  font-size: 13px;
  font-weight: 700;
}

.btn.ghost:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 116, 144, 0.35);
}

.export-toggle input {
  accent-color: var(--color-primary);
}

.btn.highlight {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.7);
  animation: pulseGlow 1.2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.9);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.6);
  }
}

@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-actions {
    justify-self: stretch;
  }
}

/* Card Improvements - Visual Hierarchy - Academic Light */
.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: var(--spacing-6) var(--spacing-8);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.overview-text h2 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.overview-text p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
}

.overview-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--color-primary);
  font-weight: 500;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

/* Section Headers - Better Typography */
.section-header {
  margin-bottom: 20px;
}

.flow-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.section-header h2 {
  margin: 0 0 var(--spacing-2) 0;
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

/* Flow Steps - Redesigned for better visual appeal */
.flow-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: var(--spacing-6) 0;
  justify-content: center;
}

.flow-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  width: 100%;
}

.flow-figure img {
  width: 100%;
  max-width: 1100px;
  height: auto;
  object-fit: contain;
  border-radius: 16px;
  background: #fff;
  padding: var(--spacing-3);
  border: 1px solid #e2e8f0;
  box-shadow: var(--shadow-md);
}

.figure-caption {
  font-size: 12px;
  color: #64748b;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: var(--spacing-4) var(--spacing-5);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  min-width: calc(20% - 10px);
  flex: 1;
  max-width: calc(20% - 10px);
}

.flow-step.active {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.flow-step.active .step-content h3,
.flow-step.active .step-content p {
  color: #ffffff;
}

.step-index {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.step-content p {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 1.4;
}

/* Indicator Cards - Optimized spacing */
.indicator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.indicator-card {
  padding: var(--spacing-5);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.indicator-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.indicator-tag {
  padding: var(--spacing-1) var(--spacing-4);
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

.indicator-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.indicator-card ul {
  margin: 0 0 var(--spacing-4) var(--spacing-5);
  padding: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.figure-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.figure-block img {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: var(--spacing-2);
}

.figure-block span {
  font-size: 11px;
  color: #64748b;
}

/* Formula - Better Readability - Academic */
.formula {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-4) var(--spacing-5);
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}

.formula-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.formula-body {
  font-family: "Times New Roman", "Cambria Math", serif;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.8;
  padding-left: 12px;
  border-left: 3px solid var(--color-primary);
}

/* KaTeX鍏紡鏍峰紡 - 瀛︽湳椋庢牸 */
.formula-katex {
  font-size: 15px;
  line-height: 2;
  padding: var(--spacing-4) var(--spacing-5);
  margin: var(--spacing-2) 0;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.formula-inline {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.formula-inline .formula-title {
  margin-bottom: var(--spacing-sm);
}

.formula-inline .formula-body {
  padding: 0;
  border-left: none;
  font-size: 16px;
}

.formula-inline .formula-katex {
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
}

.formula-katex :deep(.katex) {
  color: var(--text-primary);
}

.formula-katex :deep(.katex .mord) {
  color: var(--text-primary);
}

.formula-katex :deep(.katex .mrel) {
  color: var(--color-primary);
}

.formula-katex :deep(.katex .mbin) {
  color: var(--color-primary);
}

.formula-katex :deep(.katex .mop) {
  color: var(--text-secondary);
}

.formula-katex :deep(.katex .minner) {
  color: var(--text-secondary);
}

.formula-katex :deep(.katex .vlist-t) {
  color: var(--text-primary);
}

/* 娴佺▼鍥炬牱寮忎紭鍖?*/
.flow-figure {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.flow-image {
  width: 100%;
  max-width: 1100px;
  height: auto;
  border-radius: var(--border-radius-sm);
}

.indicator-visual {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visual-bar span,
.visual-line span {
  font-size: 12px;
  color: var(--text-tertiary);
}

.bar-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: var(--border-color);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--gradient-success);
}

.line-track {
  flex: 1;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 999px;
}

/* Weight Controls - Better Spacing - Academic */
.weight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.weight-item {
  margin-bottom: 20px;
  padding: var(--spacing-4);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.weight-label {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text-primary);
}

.weight-value {
  color: var(--color-primary);
  font-weight: 600;
}

.weight-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.weight-controls input[type='range'] {
  width: 100%;
}

.stack-bar {
  display: flex;
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  margin-bottom: 12px;
}

.stack-segment.rsi {
  background: #0f766e;
}

.stack-segment.bri {
  background: #0e7490;
}

.stack-segment.asi {
  background: #22c55e;
}

.stack-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.rsi { background: #0f766e; }
.dot.bri { background: #0e7490; }
.dot.asi { background: #15803d; }

/* BRI娣卞害浜や簰鎺т欢 */
.interactive-control {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-4);
  margin: var(--spacing-4) 0;
  border: 1px solid var(--border-color);
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.control-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.control-value {
  font-size: 13px;
  font-weight: 600;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 999px;
}

.control-value.low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.control-value.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.control-value.high {
  background: var(--color-error-light);
  color: var(--color-error);
}

.depth-slider {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e 0%, #22c55e 33%, #f59e0b 33%, #f59e0b 66%, #ef4444 66%, #ef4444 100%);
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.depth-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.depth-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.depth-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
}

.depth-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 6px;
  margin-bottom: 12px;
}

.bri-sim-result {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.bri-value-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bri-bar-track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: var(--bg-tertiary);
  overflow: hidden;
}

.bri-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease, background 0.3s ease;
}

.bri-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
  text-align: right;
}

.weight-note {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ASI搴斿姏浼犻€掑姩鐢?*/
.asi-animation-container {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-4);
  margin: var(--spacing-4) 0;
  border: 1px solid var(--border-color);
  position: relative;
}

.asi-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.stress-bars {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-1);
  height: 80px;
  padding: 0 var(--spacing-10);
  position: relative;
}

.stress-bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
  min-width: 4px;
  transition: height 0.5s ease;
  animation: stressPulse 2s ease-in-out infinite;
}

@keyframes stressPulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.stress-labels {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-10) 0;
  font-size: 11px;
  color: var(--text-tertiary);
}

.peak-indicator {
  position: absolute;
  top: 16px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.5s ease;
}

.peak-arrow {
  font-size: 16px;
  color: var(--color-error);
  font-weight: bold;
  animation: arrowBounce 1s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.peak-label {
  font-size: 10px;
  color: var(--color-error);
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  padding: var(--spacing-1) var(--spacing-1);
  border-radius: 4px;
  margin-top: 2px;
}

/* Risk Levels - Optimized proportions - Academic */
.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.risk-level {
  padding: var(--spacing-5);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
}

.risk-level:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.risk-level p {
  margin: var(--spacing-3) 0 0 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.level {
  display: inline-flex;
  padding: var(--spacing-1) var(--spacing-4);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.level.high {
  background: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--border-color);
}

.level.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid var(--border-color);
}

.level.low {
  background: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--border-color);
}

/* Example Section - Better Layout - Academic */
.example-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.sample-selector {
  display: flex;
  gap: 10px;
  padding: var(--spacing-4) var(--spacing-4);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.sample-btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.sample-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.sample-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}

.example-table {
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.table-row.header {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row:last-child {
  border-bottom: none;
}

.example-result {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-6);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.result-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  width: 100%;
  padding: var(--spacing-3);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
}

.result-title {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 36px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.result-level {
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.result-level.low {
  background: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--border-color);
}

.result-level.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid var(--border-color);
}

.result-level.high {
  background: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--border-color);
}

/* Output Steps - Optimized spacing - Academic */
.output-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.output-step {
  padding: var(--spacing-5);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
}

.output-step:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.output-step h3 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.output-step p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.output-note {
  margin-top: 20px;
  padding: var(--spacing-4);
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--color-primary);
  line-height: 1.75;
}

/* Responsive Design - Professional Breakpoints */
@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .header-actions {
    min-width: 100%;
  }

  .export-controls {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .mpi-algorithm-page {
    gap: 24px;
    padding: 0;
  }

  .page-header {
    padding: var(--spacing-6);
  }

  .page-title {
    font-size: 24px;
  }

  .overview-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: var(--spacing-5);
  }

  .overview-badges {
    width: 100%;
  }

  .weight-grid,
  .example-grid,
  .indicator-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .flow-steps {
    grid-template-columns: 1fr;
  }

  .export-controls {
    grid-template-columns: 1fr;
  }

  .export-controls .export-select:nth-child(3) {
    grid-column: span 1;
  }
}

@media (max-width: 600px) {
  .mpi-algorithm-page {
    gap: 20px;
  }

  .page-header {
    padding: var(--spacing-5);
    border-radius: 16px;
  }

  .page-header-content {
    flex-direction: column;
    gap: 12px;
  }

  .page-header-icon {
    width: 48px;
    height: 48px;
  }

  .page-header-icon svg {
    width: 24px;
    height: 24px;
  }

  .page-title {
    font-size: 22px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .export-controls {
    padding: var(--spacing-3);
    gap: var(--spacing-2);
  }

  .section-header h2 {
    font-size: 20px;
  }

  .overview-text h2 {
    font-size: 18px;
  }

  .indicator-card {
    padding: var(--spacing-5);
  }

  .risk-grid {
    grid-template-columns: 1fr;
  }
}

/* Print Styles */
@media print {
  .mpi-algorithm-page {
    max-width: 100%;
  }

  .header-actions,
  .export-controls {
    display: none;
  }

  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid var(--border-color);
  }

  .flow-figure img,
  .figure-block img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
</style>

