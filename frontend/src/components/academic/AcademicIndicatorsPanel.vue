<template>
<section class="card indicators-card">
  <div class="section-header">
    <h2>{{ aa('coreTitle') }}</h2>
    <p>{{ aa('coreDesc') }}</p>
  </div>

  <div class="algorithm-tabs">
    <button
      v-for="algo in algorithms"
      :key="algo.key"
      :class="['algo-tab', { active: activeAlgo === algo.key }]"
      @click="emit('update:active-algo', algo.key)"
    >
      <span class="tab-tag">{{ algo.tag }}</span>
      <span class="tab-name">{{ aa(algo.nameKey) }}</span>
    </button>
  </div>

  <!-- RSI 闂傚倸鍊搁崐鎼佸磹閹间礁纾归柣鎴ｅГ閸ゅ嫰鏌涢锝嗙缁炬儳娼￠弻锝夊閵忊晝鍔搁梺姹囧€楅崑鎾舵崲濠靛顥堟繛鎴濆船閸擃剟姊洪柅鐐茶嫰婢у墽绱掗悩铏碍闁伙絿鍏橀幃鈩冩償濡粯鏉搁梻浣告啞閸斿繘寮插鍫濇辈濠电姴娲﹂埛鎺戙€掑锝呬壕闂侀€炲苯澧伴柛瀣洴閹崇喖顢涘☉娆愮彿闂佸湱铏庨崰妤呮偂濞戞埃鍋撻崗澶婁壕闁诲函缍嗛崜娑㈡儊閸儲鍊甸悷娆忓缁€鍐偨椤栨澧插ǎ鍥э躬瀹曞ジ寮撮悙鑼崺婵＄偑鍊栭幐鐐叏閹绢喖绠洪悗锝庝簴閺€浠嬫煥濞戞ê顏╁ù婊冦偢閺屾稒绻濋崘銊т紝閻庤娲樺ú鐔风暦閿熺姵鍊剁紓浣股戦妵婵嗏攽閳ュ磭鍩ｇ€规洖銈搁敐鐐侯敇閳ュ磭鍔甸梻鍌氬€搁崐鎼佸磹閻戣姤鍤勯柛顐ｆ礀绾惧鏌曟繛鐐珔缁炬儳娼″鍫曞醇濮橆厽鐝斿銈冨劜绾板秹濡甸崟顖氱闁告鍋熸禒濂告⒑?-->
  <div v-if="activeAlgo === 'rsi'" class="algorithm-detail">
    <div class="algo-header">
      <h3>{{ aa('rsiTitle') }}</h3>
      <p class="algo-desc">{{ aa('rsiDesc') }}</p>
    </div>

    <div class="principle-grid">
      <div class="principle-section">
        <h4>{{ aa('rsiPhysicalTitle') }}</h4>
        <p>{{ aa('rsiPhysicalDesc') }}</p>

        <div class="principle-visual">
          <PhaseFieldFracture :aa="aa" />
        </div>
      </div>

      <div class="principle-section">
        <h4>{{ aa('rsiEquationTitle') }}</h4>
        <div class="formula-block">
          <div class="formula-title">{{ aa('rsiFormulaEnergy') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.energy"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('rsiFormulaEvolution') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.governing"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('rsiFormulaGriffith') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.griffith"></div>
        </div>
      </div>
    </div>

    <div class="principle-section full-width">
      <h4>{{ aa('rsiIndicatorTitle') }}</h4>
      <div class="indicator-breakdown">
        <div class="breakdown-item">
          <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.norm"></div>
          <p>{{ aa('rsiIndicatorNormDesc') }}</p>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.key"></div>
          <p>{{ aa('rsiIndicatorKeyDesc') }}</p>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-formula formula-katex" v-html="renderedFormulas.rsi.struct"></div>
          <p>{{ aa('rsiIndicatorStructDesc') }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- BRI 闂傚倸鍊搁崐宄懊归崶顒夋晪鐟滃秹婀侀梺缁樺灱濡嫰寮告担绯曟斀闁绘ê鐤囨竟妯肩棯閹规劦鍤欓柍瑙勫灴閹晠宕ｆ径瀣€烽梻鍌氬€搁崑鍡涘垂閸洖钃熼柕濞垮劗閺€浠嬫煕閳╁厾顏勨枍閿熺姵鈷戦梺顐ゅ仜閼活垱鏅堕鐐村仺妞ゆ牗銇涢崑鎾崇暦閸ャ劍顔曠紓鍌欑椤戝牓顢氶幎钘夌睄闁逞屽墴楠炲繘宕ㄩ婊呯厯闂佸壊鐓堥崳顔嘉涘Δ鍛拻闁稿本鑹鹃埀顒勵棑缁牊绗熼埀顒勫箖閸ф鐐婄憸婊兠归弽顓熺厪濠电偟鍋撳▍鍡涙煕閵堝懎顏柡灞剧洴椤㈡洟鏁愰崱娆樻О闂備胶顭堥敃銈夊床閺屻儱鐓橀柟杈鹃檮閸嬫劙鏌涘▎蹇ｆЦ妞わ腹鏅犲娲箮閼恒儲鏆犻梺鎼炲妼濞尖€愁嚕婵犳碍鍋勯柧蹇撴贡閿涙粌鈹戦埥鍡楃仴婵炲拑缍侀、鏍磼濠婂懐锛濇繛杈剧到閹碱偅鐗庡┑鐘灮閹虫挸螞濠靛鏄ラ柍褜鍓氶妵鍕箳瀹ュ洩绐楅梺鍝ュ枎缁绘﹢寮诲☉銏″亹鐎规洖娲犲Σ鍫ユ煣閼姐倕浠遍柡灞剧洴瀵挳濡搁妷褌绮撮梻?-->
  <div v-if="activeAlgo === 'bri'" class="algorithm-detail">
    <div class="algo-header">
      <h3>{{ aa('briTitle') }}</h3>
      <p class="algo-desc">{{ aa('briDesc') }}</p>
    </div>

    <div class="principle-grid">
      <div class="principle-section">
        <h4>{{ aa('briTheoryTitle') }}</h4>
        <p>{{ aa('briTheoryDesc') }}</p>
        <ul class="principle-list">
          <li>{{ aa('briIso') }}</li>
          <li>{{ aa('briDc') }}</li>
          <li>{{ aa('briClvd') }}</li>
        </ul>

        <MomentTensorInversion :aa="aa" />
      </div>

      <div class="principle-section">
        <h4>{{ aa('briMathTitle') }}</h4>
        <div class="formula-block">
          <div class="formula-title">{{ aa('briFormulaDecomposition') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.bri.decomposition"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('briFormulaWaveform') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.bri.waveform"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('briFormulaMain') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.bri.main"></div>
        </div>
      </div>
    </div>

    <div class="principle-section full-width">
      <h4>{{ aa('briDepthTitle') }}</h4>
      <div class="depth-model">
        <DepthRiskCurve :aa="aa" />
        <div class="depth-formulas">
          <div class="formula-block">
            <div class="formula-title">{{ aa('briDepthPenalty') }}</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.depth"></div>
          </div>
          <div class="formula-block">
            <div class="formula-title">{{ aa('briHardLayer') }}</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.hard"></div>
          </div>
          <div class="formula-block">
            <div class="formula-title">{{ aa('briCoalThickness') }}</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.thick"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ASI 缂傚倸鍊搁崐鎼佸磹閹间礁纾归柟闂寸绾惧綊鏌熼梻瀵割槮缁炬儳缍婇弻锝夊箣閿濆憛鎾绘煕閵堝懎顏柡灞剧洴椤㈡洟鏁愰崱娆樻К缂傚倷鐒﹂崝鏍€冮崼銉ョ劦妞ゆ巻鍋撶紒鐘茬Ч瀹曟洟宕￠悘缁樻そ婵℃悂鍩℃担渚敤婵犳鍠楅…鍫ュ春閺嶎厽鍋傛繛鎴烇供閻斿棝鎮规潪鎷岊劅闁稿骸绻橀弻锝夊箳濡ゅ啰鏆梺鍝勬湰閻╊垱淇婇崼鏇炲耿婵☆垳鈷堝Σ褰掓⒒娴ｅ憡鎯堥柡鍫墰缁瑩骞嬮敃鈧悡姗€鏌熸潏鍓х暠妤犵偑鍨烘穱濠囧Χ閸滃啯顣奸梺璇″櫙缁茬偓绌辨繝鍥ㄥ€锋い蹇撳閸嬫捇寮介鐐舵憰闂侀潧艌閺呮粓寮插┑鍥ヤ簻闊洦鎸炬晶鏇㈡煢閸愵亜鏋涢柡灞诲妼閳规垿宕遍埡鍌傃囨⒑缁嬪尅鍔熼柛蹇旓耿瀵鈽夊Ο閿嬬€婚棅顐㈡祫缁查箖鍩㈤幘鏂ユ斀闁宠棄妫楁禍鏍煕鎼淬劋鎲鹃柍?-->
  <div v-if="activeAlgo === 'asi'" class="algorithm-detail">
    <div class="algo-header">
      <h3>{{ aa('asiTitle') }}</h3>
      <p class="algo-desc">{{ aa('asiDesc') }}</p>
    </div>

    <div class="principle-grid">
      <div class="principle-section">
        <h4>{{ aa('asiTheoryTitle') }}</h4>
        <p>{{ aa('asiTheoryDesc') }}</p>
        <ul class="principle-list">
          <li>{{ aa('asiTheoryCase0') }}</li>
          <li>{{ aa('asiTheoryCase1') }}</li>
          <li>{{ aa('asiTheoryCaseBetween') }}</li>
        </ul>
        <UnifiedStrengthTheory :aa="aa" />
      </div>

      <div class="principle-section">
        <h4>{{ aa('asiCoreFormulaTitle') }}</h4>
        <div class="formula-block">
          <div class="formula-title">{{ aa('asiFormulaUst') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.asi.ust"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('asiFormulaCase1') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.asi.case1"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('asiFormulaKirsch') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.asi.kirsch"></div>
        </div>
      </div>
    </div>

    <div class="principle-section full-width">
      <h4>{{ aa('asiCalcTitle') }}</h4>
      <div class="indicator-breakdown">
        <div class="breakdown-item">
          <div class="breakdown-formula formula-katex" v-html="renderedFormulas.asi.stiff"></div>
          <p>{{ aa('asiCalcStiffDesc') }}</p>
        </div>
        <div class="breakdown-item">
          <div class="breakdown-formula formula-katex" v-html="renderedFormulas.asi.fric"></div>
          <p>{{ aa('asiCalcFricDesc') }}</p>
        </div>
      </div>

      <!-- ASI 闂傚倸鍊搁崐鎼佸磹妞嬪海鐭嗗ù锝夋交閼板潡姊洪鈧粔鎾磼閵娧勫枑闁哄啫鐗嗙粻鏍ㄧ箾瀹割喕绨婚幆鐔兼⒑鐎圭姵銆冩繛鏉戞喘楠炴寮撮姀鈾€鎷洪梻鍌氱墛娓氭鎮￠銏♀拻闁告洦鍋勯顓犫偓瑙勬穿缂嶁偓缂佺姵绋戦埥澶婎潩椤掆偓缁插ジ姊绘担瑙勫仩闁稿寒鍨跺畷婵囨償閵娿儳鍙€婵犮垼娉涢惉鑲╁婵傚憡鐓冪憸婊堝礈閻旈鏆﹂柛妤冨亹濡插牊绻涢崱妯虹仴妤犵偛鐗撳缁樻媴鐟欏嫮浼囬梺鍝勬噺閻╊垰鐣烽弶娆炬僵妞ゆ垼濮ら悘浣糕攽閳藉棗鐏￠柣顏囶潐缁傚秴顭ㄩ崼銏犲絼闂佹悶鍎崝宥夊煕閹扮増鍊堕煫鍥ュ劤閻ｇ敻鏌″畝瀣？濞寸媴绠撳畷婊嗩槷婵℃彃鐗撳铏光偓鍦閸ゆ瑥螖閻樺磭鎽冮柣蹇斿浮濮婃椽骞嗚缁犲鏌嶈閸撴氨绮欓幒鎳崇喐绻濋崒妤佹杸闂佹寧绋戠€氼剚绂嶆總鍛婄厱濠电偛鐏濋埀顒佺箓閻ｇ兘骞嬮敃鈧粈瀣亜閺嶇數绋婚柡鍛仦缁绘繈濮€閿濆棛銆愰梺鎸庢穿缁犳挸顕?- 闂傚倸鍊搁崐鎼佸磹閹间礁纾归柣鎴ｅГ閸婂潡鏌ㄩ弴鐐测偓鍝ョ不閺嶎厽鐓曟い鎰剁稻缁€鈧紒鐐劤濞硷繝寮婚悢鐓庣畾闁绘鐗滃Λ鍕磼閻愵剙鍔ゆい顓犲厴瀵鎮㈤悡搴ｎ唹闂侀€涘嵆濞佳冣枔椤撱垺鈷戦柛娑橈工閻忊晛鈹戦悙鈺佷壕闂備礁鎼張顒勬儎椤栫偟宓侀柛銉墯椤ュ牊绻涢幋鐐垫噮濞存粓绠栭弻锝嗘償閵堝孩缍堥梺瑙勬倐椤ユ挸鈻庨姀鐙€娼╅悹娲細閹芥洟姊虹紒妯烩拻闁冲嘲鐗撳顐㈩吋閸℃瑧顔曢梺鐟邦嚟閸嬬喖骞婇崨瀛樼厱闁规惌鍨崇弧鈧┑顔硷功閸庛倗鈧數鍘ч埢搴ょ疀閺囩啘鎺楁⒒娴ｈ鍋犻柛鏂跨焸閹儲绺介崫銉ョウ闂佸憡鍔戦崝搴ㄥ汲鐎ｎ喗鐓欏ù锝呭暞閻濐亪鏌ｆ惔銈庡殭闁宠鍨块幃娆撳矗婢舵ɑ锛侀梻浣规偠閸斿酣銆佹繝鍥х劵闁汇垹鎲￠埛鎺楁煕鐏炲墽鎳呯紒鎰⒐缁绘盯鎳濋弶鍨優閻庡灚婢橀敃銉х矉閹烘柡鍋撻敐鍛粵闁哄拋浜滈—鍐Χ閸℃ê鏆楁繝娈垮枟閹稿啿鐣烽悷鎵虫斀閻庯綆鍋勬禒顖炴⒑閹肩偛鍔€闁告劏鏅╁Λ鐔兼⒒娴ｅ憡鎯堥柛鐔哄█瀹曟垿骞樼紒妯煎幍閻庣懓瀚晶妤呭吹閸ヮ煈娈介柣鎰缁愭梹顨ラ悙鏉戞诞鐎规洖宕—鍐箚瑜滃Λ?-->
      <AsiStressDistribution :aa="aa" />
    </div>
  </div>

  <!-- DBN 闂傚倸鍊搁崐鎼佸磹閹间礁纾瑰瀣捣閻棗銆掑锝呬壕濡ょ姷鍋涢ˇ鐢稿极閹剧粯鍋愰柤鑹板煐閹蹭即姊绘担鐟邦嚋缂佽鍊胯棟妞ゆ牗绮庨惌鍡楊熆鐠哄搫顦柛瀣崌閻涱噣宕归鐓庮潛婵＄偑鍊х€靛矂宕归崼鏇炵畺闁绘劕鎼崹鍌涖亜閹邦喖小缂併劌顭峰娲偡闁箑娈堕梺绋款儐閻╊垶銆佸顒夌叆闁告侗鍨抽敍婊勭箾鏉堝墽鎮奸柟铏崌钘熼悗锝庡墰绾惧ジ寮堕崼娑樺婵炴惌鍣ｉ弻娑㈠煘閹傚濠碉紕鍋戦崐鏍暜婵犲嫮鐭嗗ù锝囧劋椤愪粙鏌ｉ幇顔煎妺闁绘挻鐟╁娲敇閵娧呮殸婵犫拃鍌氬祮闁哄矉缍侀獮姗€寮堕幋鐘辩礉婵犳鍠栭敃銉ヮ渻娴犲绠犻柡宥庡幖閻撴稑鈹戦悩鎻掝仼濠殿喖銈稿缁樻媴缁涘娈紓浣虹帛閸ㄧ敻鎮惧┑瀣濞达絽鎽滈悾娲⒑缂佹ê濮囬柣蹇旇壘閻ｉ攱寰勯幇顓犲帾婵犵數鍊崘鈺佺彅缂備浇椴告繛濠傤潖缂佹ɑ濯撮柛娑橈工閺嗗牓姊洪崨濠冪叆缂佺粯锚椤曪綁骞撻幒鍡橆潔闂侀潧绻嗛埀顒佹灱閸嬫捇宕奸弴鐔哄帗闂佸憡绻傜€氼剟寮抽悢铏规／?-->
  <div v-if="activeAlgo === 'dbn'" class="algorithm-detail">
    <div class="algo-header">
      <h3>{{ aa('dbnTitle') }}</h3>
      <p class="algo-desc">{{ aa('dbnDesc') }}</p>
    </div>

    <div class="principle-grid">
      <div class="principle-section">
        <h4>{{ aa('dbnNetworkTitle') }}</h4>
        <p>{{ aa('dbnNetworkDesc') }}</p>

        <DbnNetworkFigure :aa="aa" />
      </div>

      <div class="principle-section">
        <h4>{{ aa('dbnFormulaTitle') }}</h4>
        <div class="formula-block">
          <div class="formula-title">{{ aa('dbnFormulaBayes') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.bayes"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('dbnFormulaPriorFusion') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.mpi"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('dbnFormulaTransition') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.transition"></div>
        </div>
        <div class="formula-block">
          <div class="formula-title">{{ aa('dbnFormulaPosterior') }}</div>
          <div class="formula-body formula-katex" v-html="renderedFormulas.dbn.posterior"></div>
        </div>
      </div>
    </div>

    <div class="principle-section full-width">
      <h4>{{ aa('inferenceTitle') }}</h4>
      <DbnInferenceExample
        :aa="aa"
        :model-value="evidence"
        :posterior-probs="posteriorProbs"
        :prob-color="probColor"
        @update:model-value="onUpdateEvidence"
      />
    </div>
  </div>
</section>

</template>

<script setup>
import PhaseFieldFracture from './PhaseFieldFracture.vue'
import MomentTensorInversion from './MomentTensorInversion.vue'
import UnifiedStrengthTheory from './UnifiedStrengthTheory.vue'
import DepthRiskCurve from './DepthRiskCurve.vue'
import AsiStressDistribution from './AsiStressDistribution.vue'
import DbnNetworkFigure from './DbnNetworkFigure.vue'
import DbnInferenceExample from './DbnInferenceExample.vue'

const emit = defineEmits(['update:active-algo', 'update:evidence'])

defineProps({
  aa: {
    type: Function,
    required: true
  },
  algorithms: {
    type: Array,
    required: true
  },
  activeAlgo: {
    type: String,
    required: true
  },
  renderedFormulas: {
    type: Object,
    required: true
  },
  evidence: {
    type: Object,
    required: true
  },
  posteriorProbs: {
    type: Object,
    required: true
  },
  probColor: {
    type: Function,
    required: true
  }
})

const onUpdateEvidence = (nextEvidence) => {
  emit('update:evidence', nextEvidence)
}
</script>

<style scoped>
.section-header {
  margin-bottom: 24px;
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
  padding: var(--spacing-3) var(--spacing-5);
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
  padding: var(--spacing-1) var(--spacing-3);
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
  margin: 0 0 var(--spacing-3) 0;
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
  padding: var(--spacing-6);
  border: 1px solid var(--border-color);
}

.principle-section.full-width {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.principle-section h4 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.principle-section h5 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.principle-section p {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.principle-list {
  margin: 0 0 var(--spacing-5) 0;
  padding-left: 20px;
}

.principle-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.formula-block {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-4);
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
  padding: var(--spacing-4) var(--spacing-5);
  margin: var(--spacing-2) 0;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.formula-katex :deep(.katex) {
  color: var(--text-primary);
}

.sci-figure {
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: var(--spacing-5);
  margin: var(--spacing-5) 0;
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
.principle-visual {
  margin-top: 20px;
}

.depth-model {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

.depth-formulas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ust-visual {
  margin-top: 20px;
}

.strength-envelope {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-5);
  border: 1px solid var(--border-color);
}

.strength-envelope svg {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.indicator-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.breakdown-item {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-5);
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

@media (max-width: 1100px) {
  .principle-grid {
    grid-template-columns: 1fr;
  }

  .indicator-breakdown,
  .depth-model {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .algorithm-tabs {
    flex-direction: column;
  }

  .algo-tab {
    justify-content: flex-start;
  }
}
</style>
