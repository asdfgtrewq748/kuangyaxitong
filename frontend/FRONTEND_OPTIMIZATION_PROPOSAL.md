# 鐭垮帇绯荤粺鍓嶇娣卞害浼樺寲鎻愭

> **椤圭洰**锛氱熆灞卞帇鍔涜瘎浼扮郴缁燂紙Mining Pressure Index锛? 
> **鐗堟湰**锛歷1.0  
> **缂栧埗鏃ユ湡**锛?026-02-25  
> **鎶€鏈爤**锛歏ue 3 + Vite + Pinia + ECharts + D3.js + Three.js  
> **椤甸潰鎬绘暟**锛?6 涓鍥?+ 30+ 缁勪欢  

---

## 鐩綍

- [涓€銆佺幇鐘跺璁℃憳瑕乚(#涓€鐜扮姸瀹¤鎽樿)
- [浜屻€佷紭鍖栦换鍔℃€昏〃](#浜屼紭鍖栦换鍔℃€昏〃)
- [涓夈€佷换鍔¤缁嗘柟妗圿(#涓変换鍔¤缁嗘柟妗?
  - [P0 鈥?绱ф€ヤ慨澶峕(#p0--绱ф€ヤ慨澶?
  - [P1 鈥?閰嶈壊浣撶郴閲嶆瀯锛堥粦鐧界伆锛塢(#p1--閰嶈壊浣撶郴閲嶆瀯榛戠櫧鐏?
  - [P2 鈥?鍏ㄧ珯涓枃鍖?+ 涓嫳鏂囧垏鎹(#p2--鍏ㄧ珯涓枃鍖?-涓嫳鏂囧垏鎹?
  - [P3 鈥?甯冨眬涓庢帓鐗堜紭鍖朷(#p3--甯冨眬涓庢帓鐗堜紭鍖?
  - [P4 鈥?缁勪欢璐ㄩ噺鎻愬崌](#p4--缁勪欢璐ㄩ噺鎻愬崌)
  - [P5 鈥?鎬ц兘浼樺寲](#p5--鎬ц兘浼樺寲)
  - [P6 鈥?鍙闂€т笌鍝嶅簲寮廬(#p6--鍙闂€т笌鍝嶅簲寮?
- [鍥涖€佸疄鏂借矾绾垮浘](#鍥涘疄鏂借矾绾垮浘)
- [浜斻€侀闄╀笌渚濊禆](#浜旈闄╀笌渚濊禆)

---

## 杩涘害蹇収锛堟洿鏂颁簬 2026-02-28锛?

| 浠诲姟 | 鐘舵€?| 璇存槑 |
|------|------|------|
| T20 绌虹姸鎬佺粍浠?| 閮ㄥ垎瀹屾垚 | 宸插湪 `ResearchPortal.vue`銆乣GeoMpiStudio.vue`銆乣Scene3DPage.vue`銆乣ResearchWorkbench.vue`銆乣Report.vue` 鎺ュ叆锛屼粛闇€鍏ㄧ珯鏀跺彛 |
| T21 楠ㄦ灦灞忓姞杞芥€?| 閮ㄥ垎瀹屾垚 | 宸插湪 `ResearchPortal.vue`銆乣AcademicAlgorithm.vue`銆乣GeoMpiStudio.vue`銆乣Scene3DPage.vue`銆乣ResearchWorkbench.vue`銆乣Report.vue` 鎺ュ叆 |
| T22 AiSearchBar 浜嬩欢娉勬紡 | 宸插畬鎴?| `addEventListener` / `removeEventListener` 宸叉垚瀵瑰鐞?|
| T23 缂撳瓨澶у皬闄愬埗锛圠RU锛?| 宸插畬鎴?| 鐩稿叧缂撳瓨宸插垏鎹?LRU 骞堕檺鍒跺閲?|
| T24 璺敱绾т唬鐮佸垎鍓?| 宸插畬鎴?| 璺敱 chunk 鍛藉悕涓?`manualChunks` 宸茬敓鏁堬紝鏋勫缓杈撳嚭宸查獙璇?|
| T25 澶у瀷鍥捐〃鎳掑姞杞?| 宸插畬鎴?| `AcademicAlgorithm` 閲囩敤 `defineAsyncComponent + Suspense` |
| T26 铏氭嫙鍒楄〃闃堝€艰皟浼?| 宸插畬鎴?| 铏氭嫙鍒楄〃闃堝€煎凡璋冩暣鍒?`>=50`锛屽苟浼樺寲婊氬姩娓叉煋 |
| T27 鍝嶅簲寮忔柇鐐硅ˉ鍏?| 宸插畬鎴?| 宸插畬鎴?12 璺敱 脳 5 鏂偣鑷姩鍖栧璁★紝鏈彂鐜版按骞虫孩鍑猴紙瑙?`data/research/stage_e/ui_accessibility/20260228T144805/`锛?|
| T28 键盘导航与 ARIA | 已完成 | 已完成 `axe-core` 自动扫描收敛（critical=0, serious=0），见 `data/research/stage_e/ui_accessibility/20260228T153205/` |
| T29 瑙︽帶鎵嬪娍鏀寔 | 宸插畬鎴?| `AlgorithmValidation`銆乣MpiHeatmapPro`銆乣InterpolationMap/BoreholeMap` 宸叉敮鎸佽Е鎺ф嫋鎷戒笌缂╂斁 |

---

## 涓€銆佺幇鐘跺璁℃憳瑕?

### 1.1 閰嶈壊鐜扮姸

| 闂 | 涓ラ噸绋嬪害 | 璇存槑 |
|------|---------|------|
| CSS 鍙橀噺鍙岄噸瀹氫箟 | 馃敶 涓ラ噸 | `style.css` 涓?`design-tokens.css` 瀵?`--color-primary`銆乣--color-success` 绛夊畾涔変簡**涓嶅悓鐨勫€?*锛屽鑷存牱寮忚涓轰笉鍙娴?|
| 澶ч噺褰╄壊涓婚鑹?| 馃敶 涓ラ噸 | 褰撳墠涓昏壊涓?Teal锛坄#0f766e`锛夛紝杈呬互钃濄€佺豢銆佹銆佺传銆佺矇鍏寮鸿皟鑹诧紝涓庣鐮旈粦鐧界伆瀹氫綅涓嶇 |
| 纭紪鐮侀鑹叉硾婊?| 馃敶 涓ラ噸 | 鍏ㄧ珯瓒呰繃 **150+ 澶?*纭紪鐮佺殑鍗佸叚杩涘埗/RGB 棰滆壊鍊肩粫杩?CSS 鍙橀噺绯荤粺锛屽垎甯冨湪 AlgorithmValidation锛?0+锛夈€丄cademicAlgorithm锛?0+锛夈€丷esearchPortal锛?1锛夈€丮piAlgorithm锛?0+锛夌瓑鏂囦欢涓?|
| 娓愬彉鑹茶繃澶?| 鈿?涓瓑 | `--gradient-primary`銆乣--gradient-header`銆乣--gradient-card` 绛夋笎鍙樿壊涓嶇鍚堥粦鐧界伆瀛︽湳椋庢牸 |
| 闃村奖甯﹁壊鍋?| 鈿?涓瓑 | 闃村奖浣跨敤 `rgba(15, 118, 110, ...)` 甯︽湁缁胯壊鑹插亸锛屽簲浣跨敤绾伆鑹查槾褰?|

### 1.2 涓嫳鏂囩幇鐘?

| 闂 | 涓ラ噸绋嬪害 | 娑夊強鏂囦欢 |
|------|---------|---------|
| GeoMpiStudio.vue 鍏ㄨ嫳鏂?| 馃敶 涓ラ噸 | 鏍囬銆佹爣绛俱€佹寜閽€佹弿杩般€佹彁绀哄叏閮ㄤ负鑻辨枃 |
| ResearchPortal.vue 澶ч噺鑻辨枃 | 馃敶 涓ラ噸 | 椤甸潰鏍囬銆佺粺璁″崱鐗囥€佽〃澶淬€佺姸鎬佹爣绛惧潎涓鸿嫳鏂?|
| ResearchWorkbench.vue 鑻辨枃琛ㄥ崟 | 馃煛 涓瓑 | 琛ㄥ崟瀛楁鍚嶏紙dataset_id銆乻plit_id 绛夛級銆佽〃澶淬€佹爣绛句负鑻辨枃 |
| AcademicAlgorithm.vue 鑻辨枃鍥炬敞 | 馃煛 涓瓑 | 绉戝鍥剧殑 Figure 鏍囬銆佸潗鏍囪酱鏍囩涓鸿嫳鏂?|
| AlgorithmValidation.vue 閮ㄥ垎鑻辨枃 | 馃煛 涓瓑 | "Geology-aware 瀵圭収"銆丄UC/PR-AUC 绛変笓涓氭湳璇?|
| Report.vue 閮ㄥ垎鑻辨枃 | 馃煝 杞诲井 | Min/Max/Std/P50/AUC/Brier 绛夌粺璁℃寚鏍囧悕 |
| AppLayout.vue 涔辩爜 | 馃敶 涓ラ噸 | tooltip/aria-label 鍑虹幇缂栫爜鎹熷潖鐨勪贡鐮侊紙濡?`濞翠胶鈻兼潻娑樺`锛?|

### 1.3 甯冨眬涓庢帓鐗堢幇鐘?

| 闂 | 娑夊強鑼冨洿 |
|------|---------|
| AcademicAlgorithm.vue 3715 琛屽法鍨嬪崟鏂囦欢 | 涓ラ噸褰卞搷缁存姢鎬?|
| 鍚勯〉闈㈠崱鐗囨牱寮忎笉缁熶竴 | 閮ㄥ垎鐢?`.card` 鍏ㄥ眬绫伙紝閮ㄥ垎鑷畾涔?scoped 鏍峰紡 |
| 琛ㄦ牸鏍峰紡纰庣墖鍖?| 鑷冲皯 3 绉嶄笉鍚岀殑琛ㄦ牸瀹炵幇鏂瑰紡 |
| 椤甸潰闂磋窛/鍐呰竟璺濅笉涓€鑷?| 鏈夌殑鐢?`--spacing-*` 鍙橀噺锛屾湁鐨勭洿鎺ュ啓 `16px`銆乣24px` |
| 椤甸潰鏍囬缁撴瀯涓嶇粺涓€ | header 鍖哄煙鏈?5 绉嶄互涓婁笉鍚岀殑鎺掔増鏂瑰紡 |

### 1.4 缁勪欢璐ㄩ噺鐜扮姸

| 闂 | 璇存槑 |
|------|------|
| HealthCheck.vue 缂栬瘧澶辫触 | HTML 宓屽閿欒銆佹湭瀵煎叆 `useRouter`/`onBeforeUnmount`銆乣useHead` 涓嶅瓨鍦?|
| Toast 缁勪欢閲嶅瀹炵幇 | `components/Toast.vue` 涓?`components/library/feedback/Toast.vue` 涓ゅ |
| 绌虹姸鎬佺己澶?| GeoMpiStudio銆丼cene3DPage銆丷esearchWorkbench 绛夊椤甸潰鏃犳暟鎹椂鏃犲紩瀵?|
| 鍐呭瓨娉勬紡椋庨櫓 | AlgorithmValidation 鐨?`spatialCache`銆丮piHeatmapPro 鐨?`colorCache` 鏃犲ぇ灏忛檺鍒?|
| AiSearchBar 浜嬩欢娉勬紡 | `onMounted` 娉ㄥ唽鐨?`window.addEventListener` 鏈湪鍗歌浇鏃剁Щ闄?|

---

## 浜屻€佷紭鍖栦换鍔℃€昏〃

| 缂栧彿 | 浼樺厛绾?| 浠诲姟鍚嶇О | 棰勪及宸ユ椂 | 娑夊強鏂囦欢鏁?|
|------|-------|---------|---------|-----------|
| T01 | P0 | 淇 HealthCheck.vue 缂栬瘧閿欒 | 2h | 1 |
| T02 | P0 | 淇 AppLayout.vue 涔辩爜鏂囨湰 | 1h | 1 |
| T03 | P0 | 缁熶竴 CSS 鍙橀噺瀹氫箟锛屾秷闄ゅ弻閲嶅啿绐?| 3h | 2 |
| T04 | P1 | 璁捐绯荤粺閲嶆瀯锛氶粦鐧界伆閰嶈壊浣撶郴 | 6h | 2 |
| T05 | P1 | 鍏ㄧ珯纭紪鐮侀鑹叉浛鎹负 CSS 鍙橀噺 | 12h | 15+ |
| T06 | P1 | 闃村奖涓庢笎鍙樺幓鑹诧細鏀逛负绾伆鑹?| 3h | 5+ |
| T07 | P2 | 鏋勫缓 i18n 鍥介檯鍖栧熀纭€鏋舵瀯 | 6h | 5 |
| T08 | P2 | GeoMpiStudio.vue 鍏ㄦ枃涓枃鍖?| 3h | 1 |
| T09 | P2 | ResearchPortal.vue 鍏ㄦ枃涓枃鍖?| 3h | 1 |
| T10 | P2 | ResearchWorkbench.vue 涓枃鍖?| 4h | 1 |
| T11 | P2 | AcademicAlgorithm.vue 涓枃鍖?| 4h | 1 |
| T12 | P2 | 鍏朵粬椤甸潰闆舵暎鑻辨枃涓枃鍖?| 4h | 8+ |
| T13 | P2 | 涓嫳鏂囧垏鎹㈠姛鑳藉疄鐜?| 4h | 5+ |
| T14 | P3 | 缁熶竴椤甸潰鏍囬/Header 缁撴瀯 | 4h | 10+ |
| T15 | P3 | 缁熶竴鍗＄墖涓庨潰鏉挎牱寮?| 4h | 10+ |
| T16 | P3 | 缁熶竴琛ㄦ牸鏍峰紡涓庝氦浜?| 4h | 8+ |
| T17 | P3 | 缁熶竴闂磋窛涓庡唴杈硅窛绯荤粺 | 3h | 15+ |
| T18 | P3 | AcademicAlgorithm.vue 缁勪欢鎷嗗垎 | 8h | 1鈫?+ |
| T19 | P4 | 娑堥櫎 Toast 缁勪欢閲嶅瀹炵幇 | 2h | 4 |
| T20 | P4 | 娣诲姞鍏ㄥ眬绌虹姸鎬佺粍浠?| 3h | 8+ |
| T21 | P4 | 娣诲姞楠ㄦ灦灞?Loading 鐘舵€?| 4h | 6+ |
| T22 | P4 | 淇 AiSearchBar 浜嬩欢娉勬紡 | 1h | 1 |
| T23 | P4 | 缂撳瓨澶у皬闄愬埗锛圠RU锛?| 2h | 2 |
| T24 | P5 | 璺敱绾т唬鐮佸垎鍓蹭紭鍖?| 2h | 1 |
| T25 | P5 | 澶у瀷 SVG 鍥捐〃鎳掑姞杞?| 3h | 3 |
| T26 | P5 | 铏氭嫙鍒楄〃闃堝€艰皟浼?| 1h | 2 |
| T27 | P6 | 鍝嶅簲寮忔柇鐐硅ˉ鍏?| 6h | 8+ |
| T28 | P6 | 键盘导航与 ARIA 标签修复 | 4h | 10+ |
| T29 | P6 | 瑙︽帶鎵嬪娍鏀寔 | 4h | 3 |

**鎬昏锛氱害 110 宸ユ椂锛堢害 14 涓伐浣滄棩锛?*

---

## 涓夈€佷换鍔¤缁嗘柟妗?

### P0 鈥?绱ф€ヤ慨澶?

---

#### T01锛氫慨澶?HealthCheck.vue 缂栬瘧閿欒

**闂鎻忚堪**  
`HealthCheck.vue` 瀛樺湪澶氫釜鑷村懡缂栬瘧閿欒锛岄〉闈㈡棤娉曟甯告覆鏌擄細
- HTML 鏍囩宓屽閿欒锛堝浣欑殑 `</div>` 闂悎鏍囩锛?
- `useRouter()`銆乣useRoute()` 浣跨敤浣嗘湭浠?`vue-router` 瀵煎叆
- `onBeforeUnmount` 浣跨敤浣嗘湭浠?Vue 瀵煎叆
- `useHead` 浠?`vue-router` 瀵煎叆锛堣瀵煎嚭涓嶅瓨鍦級
- SVG path 灞炴€ц娉曢敊璇?

**淇敼鏂规**  
1. 鍒犻櫎涓嶅瓨鍦ㄧ殑 `useHead` 瀵煎叆鍙婅皟鐢?
2. 琛ュ厖缂哄け鐨?Vue/vue-router 瀵煎叆锛歚import { useRouter, useRoute } from 'vue-router'`銆乣import { onBeforeUnmount } from 'vue'`
3. 淇 HTML 鏍囩宓屽锛屽垹闄ゅ浣欑殑闂悎鏍囩
4. 淇 SVG path 鐨?`d` 灞炴€у€?

**楠屾敹鏍囧噯**  
- [ ] `HealthCheck.vue` 鑳介€氳繃 Vite 缂栬瘧锛屾棤鎺у埗鍙版姤閿?
- [ ] 椤甸潰鍙甯稿姞杞藉苟灞曠ず鍋ュ悍妫€鏌ヤ俊鎭?
- [ ] 瀵艰埅鏍忓彲姝ｅ父璺宠浆鍒拌椤甸潰

---

#### T02锛氫慨澶?AppLayout.vue 涔辩爜鏂囨湰

**闂鎻忚堪**  
`AppLayout.vue` 涓澶?`title`銆乣aria-label` 灞炴€у嚭鐜?UTF-8 缂栫爜鎹熷潖鐨勪贡鐮佸瓧绗︿覆锛屼緥濡傦細
- `濞翠胶鈻兼潻娑樺` 鈫?搴斾负"娴佺▼杩涘害"
- `瑜版挸澧犻悡銈呯湴` 鈫?搴斾负"褰撳墠鐓ゅ眰"
- `閸撳秴绶歚 鈫?搴斾负"鍓嶅線"
- `闁插秶鐤嗗ù浣衡柤` 鈫?搴斾负"閲嶇疆娴佺▼"
- `閸撳秴绶氶崜宥囩枂濮濄儵` 鈫?搴斾负"鍓嶅線鍓嶇疆姝ラ"

**淇敼鏂规**  
閫愪竴鏇挎崲鎵€鏈変贡鐮佸瓧绗︿覆涓烘纭殑涓枃鏂囨湰锛?

| 涔辩爜 | 姝ｇ‘鏂囨湰 |
|------|---------|
| `濞翠胶鈻兼潻娑樺` | 娴佺▼杩涘害 |
| `瑜版挸澧犻悡銈呯湴` | 褰撳墠鐓ゅ眰 |
| `閸撳秴绶歚 | 鍓嶅線 |
| `闁插秶鐤嗗ù浣衡柤` | 閲嶇疆娴佺▼ |
| `閸撳秴绶氶幒銊ㄥ礃濮濄儵` | 鍓嶅線鎺ㄨ崘姝ラ |
| `閸撳秴绶氶崜宥囩枂濮濄儵` | 鍓嶅線鍓嶇疆姝ラ |
| `濮濄儵` | 姝ラ |

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈?tooltip銆乤ria-label 鏄剧ず姝ｇ‘鐨勪腑鏂囨枃鏈?
- [ ] 榧犳爣鎮仠鍦ㄥ鑸」鍜屽伐浣滄祦姝ラ涓婃椂鏄剧ず姝ｇ‘涓枃鎻愮ず
- [ ] 鏃犱换浣曚贡鐮佹畫鐣?

---

#### T03锛氱粺涓€ CSS 鍙橀噺瀹氫箟锛屾秷闄ゅ弻閲嶅啿绐?

**闂鎻忚堪**  
`style.css` 鍜?`design-tokens.css` 瀵瑰悓鍚?CSS 鍙橀噺瀹氫箟浜嗕笉鍚屽€硷細

| 鍙橀噺鍚?| `style.css` 鍊?| `design-tokens.css` 鍊?|
|--------|---------------|----------------------|
| `--color-primary-hover` | `#0d5f59` | `#0e6f68` |
| `--color-primary-light` | `#ccfbf1` | `rgba(15, 118, 110, 0.1)` |
| `--color-success` | `#15803d` | `#22c55e` |
| `--color-error` | `#b91c1c` | `#ef4444` |
| `--color-warning` | `#b45309` | `#f59e0b` |
| `--color-info` | `#0e7490` | `#3b82f6` |
| `--bg-secondary` | `#f3f6f5` | `#f8fafc` |
| `--text-primary` | `#2c3545` | `#0f172a` |

**淇敼鏂规**  
1. 灏?`design-tokens.css` 浣滀负**鍞竴鐨勫彉閲忓畾涔夋簮**锛圫ingle Source of Truth锛?
2. 鍒犻櫎 `style.css` 涓墍鏈?`:root` 鍙橀噺瀹氫箟锛堢害 60 琛岋級
3. 鍦?`style.css` 椤堕儴娣诲姞 `@import './styles/design-tokens.css';`
4. 楠岃瘉 `main.js` 鐨勫鍏ラ『搴忕‘淇?`design-tokens.css` 鍏堝姞杞?

**楠屾敹鏍囧噯**  
- [ ] 鍏ㄧ珯 CSS 鍙橀噺鍙湪 `design-tokens.css` 涓畾涔?
- [ ] `style.css` 涓嶅啀鍖呭惈浠讳綍 `:root` 涓殑棰滆壊/闂磋窛鍙橀噺瀹氫箟
- [ ] 鎵€鏈夐〉闈㈣瑙夎〃鐜颁竴鑷达紝鏃犳牱寮忛棯鐑佹垨閿欎綅

---

### P1 鈥?閰嶈壊浣撶郴閲嶆瀯锛堥粦鐧界伆锛?

---

#### T04锛氳璁＄郴缁熼噸鏋?鈥?榛戠櫧鐏伴厤鑹蹭綋绯?

**闂鎻忚堪**  
褰撳墠绯荤粺閲囩敤 Teal/Cyan 涓轰富鑹茶皟鐨勫僵鑹茶璁★紝涓嶇鍚堢鐮斿鏈綉绔欑殑瀹氫綅銆傞渶瑕佸叏闈㈤噸鏋勪负榛戠櫧鐏颁笁鑹蹭綋绯汇€?

**淇敼鏂规**  
閲嶆柊瀹氫箟 `design-tokens.css` 涓殑鎵€鏈夐鑹插彉閲忥紝寤虹珛濡備笅浣撶郴锛?

```css
:root {
  /* ===== 涓昏壊锛氱函榛?===== */
  --color-primary: #1a1a1a;
  --color-primary-hover: #333333;
  --color-primary-light: rgba(26, 26, 26, 0.08);
  --color-primary-lighter: rgba(26, 26, 26, 0.04);
  --color-primary-dark: #000000;

  /* ===== 涓€х伆闃讹紙10 绾э級 ===== */
  --color-gray-50:  #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;

  /* ===== 鏂囧瓧棰滆壊 ===== */
  --text-primary:   #171717;
  --text-secondary:  #525252;
  --text-tertiary:   #737373;
  --text-muted:      #a3a3a3;
  --text-inverted:   #ffffff;

  /* ===== 鑳屾櫙棰滆壊 ===== */
  --bg-primary:   #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary:  #f5f5f5;

  /* ===== 杈规棰滆壊 ===== */
  --border-color:       #e5e5e5;
  --border-color-light: #f0f0f0;
  --border-color-dark:  #d4d4d4;

  /* ===== 璇箟鑹诧紙淇濈暀浣嗛檷浣庨ケ鍜屽害锛?===== */
  --color-success:    #16a34a;
  --color-success-bg: #f0fdf4;
  --color-warning:    #ca8a04;
  --color-warning-bg: #fefce8;
  --color-error:      #dc2626;
  --color-error-bg:   #fef2f2;
  --color-info:       #525252;   /* 鐢ㄧ伆鑹蹭唬鏇胯摑鑹?*/
  --color-info-bg:    #f5f5f5;

  /* ===== 娓愬彉锛氭敼涓虹伆搴?===== */
  --gradient-primary: linear-gradient(135deg, #1a1a1a 0%, #404040 100%);
  --gradient-card:    none;   /* 鍘绘帀鍗＄墖娓愬彉锛岀敤绾櫧 */
  --gradient-header:  linear-gradient(135deg, #1a1a1a 0%, #262626 45%, #333333 100%);

  /* ===== 闃村奖锛氱函鐏拌壊 ===== */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 48px rgba(0, 0, 0, 0.12);
}
```

**璁捐瑙勮寖**  
| 鍏冪礌 | 棰滆壊瑙勫垯 |
|------|---------|
| 椤甸潰鑳屾櫙 | `#ffffff` 鎴?`#fafafa` |
| 鍗＄墖/闈㈡澘 | 绾櫧 `#ffffff`锛?px `#e5e5e5` 杈规 |
| 椤甸潰鏍囬 | `#171717`锛?00 瀛楅噸 |
| 姝ｆ枃鏂囧瓧 | `#525252`锛?00 瀛楅噸 |
| 杈呭姪鏂囧瓧 | `#737373` 鎴?`#a3a3a3` |
| 涓绘寜閽?| 榛戝簳鐧藉瓧 `#1a1a1a` / `#ffffff` |
| 娆¤鎸夐挳 | 鐏拌壊杈规 `#e5e5e5`锛岀伆鑹叉枃瀛?`#525252` |
| 閾炬帴/寮鸿皟 | `#1a1a1a` 鍔犱笅鍒掔嚎 |
| 鍒嗛殧绾?| `#e5e5e5` |
| 鍥剧墖/鍥捐〃鍐呯殑棰滆壊 | 淇濇寔鍘熸湁鑹插僵涓嶅彉锛堢儹鍔涘浘鑹查樁銆?D 妯″瀷棰滆壊銆丒Charts 鏁版嵁閰嶈壊绛夛級 |

**楠屾敹鏍囧噯**  
- [ ] `design-tokens.css` 涓墍鏈夐潪璇箟鑹插彉閲忓潎涓洪粦/鐧?鐏拌壊鍊?
- [ ] 椤甸潰鏁翠綋瑙嗚鍙憟鐜伴粦鐧界伆涓夎壊锛岄櫎鍥捐〃/鐑姏鍥?3D妯″瀷澶栨棤褰╄壊鍏冪礌
- [ ] 璇箟鑹诧紙鎴愬姛缁裤€佽鍛婇粍銆侀敊璇孩锛変繚鐣欎絾浠呯敤浜庣姸鎬佸弽棣?

---

#### T05锛氬叏绔欑‖缂栫爜棰滆壊鏇挎崲涓?CSS 鍙橀噺

**闂鎻忚堪**  
鍏ㄧ珯瓒呰繃 150 澶勭‖缂栫爜棰滆壊鍊兼暎甯冨湪 scoped style 鍜屽唴鑱旀牱寮忎腑锛屽繀椤荤粺涓€浣跨敤 CSS 鍙橀噺銆?

**娑夊強鏂囦欢娓呭崟**  

| 鏂囦欢 | 纭紪鐮侀鑹叉暟閲?| 鏀瑰姩閲?|
|------|-------------|-------|
| `views/AlgorithmValidation.vue` | 60+ | 澶?|
| `views/AcademicAlgorithm.vue` | 50+ | 澶?|
| `views/MpiAlgorithm.vue` | 40+ | 澶?|
| `views/ResearchPortal.vue` | 31 | 涓?|
| `views/MpiHeatmapPro.vue` | 20+ | 涓?|
| `views/GeoMpiStudio.vue` | 15+ | 涓?|
| `components/Scene3DViewer.vue` | 20+ | 涓?|
| `components/InteractiveHeatmap.vue` | 15+ | 涓?|
| `components/MpiHeatmapViewer.vue` | 15+ | 涓?|
| `components/LithologyColumnChart.vue` | 9 | 灏?|
| `style.css` | 30+ | 涓?|
| `layouts/AppLayout.vue` | 15+ | 涓?|
| 鍏朵粬缁勪欢 | ~20 | 灏?|

**淇敼鏂规**  
1. 寤虹珛棰滆壊鍊?鈫?CSS 鍙橀噺鐨?*鏄犲皠瀵圭収琛?*
2. 浣跨敤鍏ㄥ眬鎼滅储鏇挎崲锛屾寜鏂囦欢閫愪竴澶勭悊
3. **渚嬪瑙勫垯**锛氫互涓嬮鑹插厑璁镐繚鐣欑‖缂栫爜鍊硷細
   - 鐑姏鍥捐壊闃舵暟缁勶紙`odiPalette`銆乣viridis` 绛夊嚱鏁板紡棰滆壊锛屽湪 JS 杩愯鏃朵娇鐢級
   - ECharts 閰嶇疆涓殑鏁版嵁棰滆壊
   - Canvas 缁戝畾鐨勯鑹诧紙濡?`ctx.fillStyle`锛?
   - 宀╂€у浘渚嬪浐瀹氳壊锛坄LithologyColumnChart.vue` 鐨勫博鎬ц瘑鍒壊锛?
4. CSS 涓殑棰滆壊**鍏ㄩ儴鏇挎崲**涓哄彉閲忓紩鐢?

**鏄犲皠瑙勫垯绀轰緥**  

| 纭紪鐮佸€?| 鏇挎崲涓?|
|---------|--------|
| `#ffffff` / `#fff` | `var(--bg-primary)` |
| `#f8fafc` / `#fafafa` | `var(--bg-secondary)` |
| `#f1f5f9` / `#f5f5f5` | `var(--bg-tertiary)` |
| `#0f172a` / `#171717` | `var(--text-primary)` |
| `#475569` / `#525252` | `var(--text-secondary)` |
| `#64748b` / `#737373` | `var(--text-tertiary)` |
| `#e2e8f0` / `#e5e5e5` | `var(--border-color)` |
| `#cbd5e1` / `#d4d4d4` | `var(--border-color-dark)` |
| `#0f766e` (鏃т富鑹? | `var(--color-primary)` |

**楠屾敹鏍囧噯**  
- [ ] 鍏ㄧ珯 CSS/scoped style 涓笉鍐嶅嚭鐜伴潪鐧藉悕鍗曠殑纭紪鐮侀鑹插€?
- [ ] `grep -rn "#[0-9a-fA-F]" --include="*.vue" --include="*.css"` 杈撳嚭涓紝闄ょ櫧鍚嶅崟鏂囦欢/琛屽鏃犲尮閰?
- [ ] 淇敼 `design-tokens.css` 涓殑涓昏壊鍙橀噺鍚庯紝鍏ㄧ珯棰滆壊鍚屾鍙樺寲

---

#### T06锛氶槾褰变笌娓愬彉鍘昏壊

**闂鎻忚堪**  
褰撳墠闃村奖甯︽湁缁胯壊鑹插亸 `rgba(15, 118, 110, ...)`锛屾笎鍙樹娇鐢?Teal-Cyan 褰╄壊锛屼笌榛戠櫧鐏颁富棰樹笉绗︺€?

**淇敼鏂规**  

1. **闃村奖**锛歚style.css` 涓墍鏈夐槾褰辨敼涓虹函鐏拌壊
   ```css
   /* Before */
   --shadow-sm: 0 1px 3px rgba(15, 118, 110, 0.08);
   /* After */
   --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
   ```

2. **娓愬彉**锛氬幓闄ゆ墍鏈夊僵鑹叉笎鍙?
   ```css
   /* Before */
   --gradient-card: linear-gradient(145deg, #ffffff 0%, #f3f7f6 100%);
   /* After - 鍘婚櫎娓愬彉鎴栨敼涓虹函鐏?*/
   --gradient-card: none;
   ```

3. **Hover 鍏夋檿**锛歚--shadow-glow`銆乣--shadow-glow-sm` 鏀逛负鏃犺壊鎴栧垹闄?

4. **AppLayout 鑳屾櫙娓愬彉**锛?
   ```css
   /* Before */
   background: radial-gradient(circle at 18% 12%, rgba(15, 118, 110, 0.12) ...);
   /* After */
   background: #fafafa;
   ```

5. **婊氬姩鏉?hover 鑹?*锛?
   ```css
   /* Before */
   *::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #0f766e ...); }
   /* After */
   *::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
   ```

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈夐槾褰变负绾伆鑹诧紙`rgba(0,0,0,...)` 鎴?`rgba(23,23,23,...)`锛?
- [ ] 椤甸潰鑳屾櫙銆佸崱鐗囪儗鏅棤褰╄壊娓愬彉
- [ ] 婊氬姩鏉?hover 鏃朵负鐏拌壊

---

### P2 鈥?鍏ㄧ珯涓枃鍖?+ 涓嫳鏂囧垏鎹?

---

#### T07锛氭瀯寤?i18n 鍥介檯鍖栧熀纭€鏋舵瀯

**闂鎻忚堪**  
褰撳墠鏃犲浗闄呭寲鏈哄埗锛屼腑鑻辨枃鏂囨湰鐩存帴纭紪鐮佸湪妯℃澘涓€傞渶瑕佸缓绔嬭交閲忓寲 i18n 鏋舵瀯浠ユ敮鎸佷腑鑻辨枃鍒囨崲銆?

**淇敼鏂规**  

**鏂规閫夊瀷**锛氫笉寮曞叆 `vue-i18n` 閲嶅瀷搴擄紝鑷爺鍩轰簬 Pinia 鐨勮交閲忔柟妗堬紙椤圭洰鍙渶涓嫳鍙岃锛岄伩鍏嶅紩鍏ラ澶栦緷璧栵級銆?

1. **鍒涘缓璇█鍖呯洰褰?*锛?
   ```
   src/
     locales/
       zh-CN.js    鈫?涓枃璇█鍖咃紙榛樿锛?
       en-US.js    鈫?鑻辨枃璇█鍖?
       index.js    鈫?瀵煎嚭涓庡伐鍏峰嚱鏁?
   ```

2. **鍒涘缓璇█ Store**锛歚src/stores/useLocaleStore.js`
   ```javascript
   // 瀛樺偍褰撳墠璇█鍋忓ソ锛屾寔涔呭寲鍒?localStorage
   export const useLocaleStore = defineStore('locale', {
     state: () => ({
       locale: localStorage.getItem('locale') || 'zh-CN'
     }),
     actions: {
       setLocale(lang) {
         this.locale = lang
         localStorage.setItem('locale', lang)
       }
     }
   })
   ```

3. **鍒涘缓 `useI18n` composable**锛?
   ```javascript
   export function useI18n() {
     const localeStore = useLocaleStore()
     const t = (key) => {
       const messages = localeStore.locale === 'zh-CN' ? zhCN : enUS
       return getNestedValue(messages, key) || key
     }
     return { t, locale: computed(() => localeStore.locale) }
   }
   ```

4. **璇█鍖呯粨鏋勭ず渚?*锛?
   ```javascript
   // zh-CN.js
   export default {
     common: {
       loading: '鍔犺浇涓?..',
       save: '淇濆瓨',
       cancel: '鍙栨秷',
       confirm: '纭',
       export: '瀵煎嚭',
       reset: '閲嶇疆',
       search: '鎼滅储',
       noData: '鏆傛棤鏁版嵁',
     },
     nav: {
       dataImport: '鏁版嵁瀵煎叆',
       interpolation: '鎻掑€煎垎鏋?,
       mpiHeatmap: 'MPI 鏁板€兼ā鎷?,
       academicAlgorithm: '鏂扮畻娉曞師鐞?,
       algorithmValidation: '鏂扮畻娉曞疄璇?,
       researchWorkbench: '绉戠爺宸ヤ綔鍙?,
       geoMpiStudio: '绌洪棿瀹為獙瀹?,
       steps: '鏉ュ帇姝ヨ窛',
       report: '缁撴灉鎶ュ憡',
     },
     geoMpiStudio: {
       title: '鍦拌川-MPI 绌洪棿瀹為獙瀹?,
       subtitle: '鍦拌川妯″瀷涓?MPI 绌洪棿鑱斿姩鍒嗘瀽',
       description: '涓€灞忚仈鍔ㄥ湴璐ㄦā鍨嬨€丮PI 鍙婁笁澶у瓙鎸囨爣锛圧SI/BRI/ASI锛夛紝鏀寔鍩虹嚎銆佸湴璐ㄦ劅鐭ャ€佸樊寮傚姣斾笁绉嶆ā寮忋€?,
       controlPanel: '鎺у埗闈㈡澘',
       seam: '鐓ゅ眰',
       geomodelJobId: '鍦拌川寤烘ā浠诲姟 ID',
       resolution: '鍒嗚鲸鐜?,
       method: '鎻掑€兼柟娉?,
       mode: '鍒嗘瀽妯″紡',
       baseline: '鍩虹嚎妯″紡',
       geoAware: '鍦拌川鎰熺煡',
       delta: '宸紓瀵规瘮',
       runAnalysis: '杩愯绌洪棿鍒嗘瀽',
       refreshing: '鍒嗘瀽涓?..',
       exportSnapshot: '瀵煎嚭蹇収',
       metricMatrix: '2脳2 鎸囨爣鐭╅樀',
       linkage3d: '涓夌淮鑱斿姩涓庡彲瑙ｉ噴鎬?,
     },
     // ... 鍏朵綑椤甸潰
   }
   ```

5. **鍦?AppLayout 娣诲姞璇█鍒囨崲鎸夐挳**锛氫晶杈规爮搴曢儴鏀剧疆涓?EN 鍒囨崲鎸夐挳

**楠屾敹鏍囧噯**  
- [ ] `src/locales/` 涓嬫湁瀹屾暣鐨?`zh-CN.js` 鍜?`en-US.js` 璇█鍖?
- [ ] `useI18n()` composable 鍙湪浠绘剰缁勪欢涓娇鐢?
- [ ] 璇█鍋忓ソ鎸佷箙鍖栧埌 `localStorage`
- [ ] 璇█鍒囨崲鎸夐挳鍦ㄤ晶杈规爮搴曢儴鍙骞跺彲鎿嶄綔

---

#### T08锛欸eoMpiStudio.vue 鍏ㄦ枃涓枃鍖?

**闂鎻忚堪**  
`GeoMpiStudio.vue` 鏄叏鑻辨枃椤甸潰锛屽寘鎷爣棰橈紙"Geo-MPI Studio"锛夈€佹弿杩版枃鏈€佹帶鍒堕潰鏉挎爣绛撅紙Seam銆丮ethod銆丮ode銆丷esolution 绛夛級銆佹寜閽紙Run Spatial Analysis銆丒xport Snapshot锛夈€佹爣绛鹃〉锛圔aseline銆丟eo-aware銆丏elta锛夌瓑銆?

**淇敼鏂规**  
1. 灏嗘墍鏈夋ā鏉夸腑鐨勮嫳鏂囧瓧闈㈤噺鏇挎崲涓?`{{ t('geoMpiStudio.xxx') }}`
2. 鍦?`zh-CN.js` 鍜?`en-US.js` 涓坊鍔犲搴旂炕璇戦敭鍊?
3. 鎶€鏈笓鏈夊悕璇嶄繚鐣欒嫳鏂囩缉鍐欎絾闄勫姞涓枃瑙ｉ噴锛氬 `IDW锛堝弽璺濈鍔犳潈锛塦

**瀹屾暣缈昏瘧瀵圭収琛?*  

| 鑻辨枃鍘熸枃 | 涓枃缈昏瘧 |
|---------|---------|
| Geo-MPI Studio | 鍦拌川-MPI 绌洪棿瀹為獙瀹?|
| Geology and MPI Spatial Studio | 鍦拌川妯″瀷涓?MPI 绌洪棿鑱斿姩鍒嗘瀽骞冲彴 |
| One-screen linkage for Geomodel, MPI... | 涓€灞忚仈鍔ㄥ湴璐ㄦā鍨嬨€丮PI 鍙婁笁澶у瓙鎸囨爣... |
| Run Spatial Analysis | 杩愯绌洪棿鍒嗘瀽 |
| Refreshing... | 鍒嗘瀽涓?.. |
| Export Snapshot | 瀵煎嚭蹇収 |
| Control Panel | 鎺у埗闈㈡澘 |
| Seam | 鐓ゅ眰 |
| Geomodel Job ID | 鍦拌川寤烘ā浠诲姟 ID |
| e.g. gm_20260212_xxx | 濡傦細gm_20260212_xxx |
| Resolution | 鍒嗚鲸鐜?|
| Method | 鎻掑€兼柟娉?|
| IDW / Linear / Nearest | 鍙嶈窛绂诲姞鏉?/ 绾挎€?/ 鏈€杩戦偦 |
| Mode | 鍒嗘瀽妯″紡 |
| Baseline | 鍩虹嚎妯″紡 |
| Geo-aware | 鍦拌川鎰熺煡 |
| Delta | 宸紓瀵规瘮 |
| 2 x 2 Metric Matrix | 2脳2 鎸囨爣鐭╅樀 |
| MPI / RSI / BRI / ASI | MPI / RSI / BRI / ASI锛堜繚鐣欑缉鍐欙級 |
| 3D Linkage and Explainability | 涓夌淮鑱斿姩涓庡彲瑙ｉ噴鎬у垎鏋?|

**楠屾敹鏍囧噯**  
- [ ] 榛樿璇█锛堜腑鏂囷級涓嬶紝椤甸潰鏃犺嫳鏂?UI 鏂囨湰锛堜笓涓氱缉鍐欓櫎澶栵級
- [ ] 鍒囨崲鑻辨枃鍚庯紝椤甸潰姝ｇ‘鏄剧ず鑻辨枃
- [ ] 鎵€鏈?placeholder銆乼ooltip銆佹寜閽枃瀛楀潎宸插浗闄呭寲

---

#### T09锛歊esearchPortal.vue 鍏ㄦ枃涓枃鍖?

**闂鎻忚堪**  
`ResearchPortal.vue` 椤甸潰鏍囬銆佺粺璁″崱鐗囥€佽〃澶淬€佺姸鎬佹爣绛剧瓑澶ч噺鑻辨枃銆?

**瀹屾暣缈昏瘧瀵圭収琛?*  

| 鑻辨枃鍘熸枃 | 涓枃缈昏瘧 |
|---------|---------|
| RESEARCH FRONTEND | 绉戠爺鍓嶇 |
| MPI Research Portal | MPI 绉戠爺闂ㄦ埛 |
| Paper Drafts | 璁烘枃鑽夌 |
| Gate Pass | 璐ㄩ噺鍏冲崱 |
| Last Sync | 鏈€鍚庡悓姝?|
| Quick Actions | 蹇嵎鎿嶄綔 |
| 12-Month Track | 12 涓湀杩借釜 |
| Experiment Leaderboard | 瀹為獙鎺掕姒?|
| Top Runs | 鏈€浣宠繍琛?|
| exp_id / model / value / action | 瀹為獙 ID / 妯″瀷 / 鏁板€?/ 鎿嶄綔 |
| Model Summary | 妯″瀷姹囨€?|
| count / datasets / mean / best | 娆℃暟 / 鏁版嵁闆?/ 鍧囧€?/ 鏈€浼?|
| Manuscripts & Gate Reports | 璁烘枃涓庤川閲忓叧鍗℃姤鍛?|
| Gates PASS / Gates BLOCKED | 宸查€氳繃 / 鏈€氳繃 |
| Asset / Status / Updated / Action | 璧勬簮 / 鐘舵€?/ 鏇存柊鏃堕棿 / 鎿嶄綔 |
| ready / missing | 灏辩华 / 缂哄け |

**楠屾敹鏍囧噯**  
- [ ] 榛樿璇█涓嬮〉闈㈡棤鑻辨枃 UI  
- [ ] 琛ㄥご銆佺姸鎬佹爣绛俱€佺粺璁″崱鐗囧叏閮ㄤ腑鏂囧寲
- [ ] i18n 閿€煎畬鏁达紝鑻辨枃鍖呭搴旀纭?

---

#### T10锛歊esearchWorkbench.vue 涓枃鍖?

**闂鎻忚堪**  
`ResearchWorkbench.vue` 鐨勮〃鍗曟爣绛撅紙dataset_id銆乻plit_id 绛夛級銆佽〃澶淬€佸尯鍧楁爣棰樹娇鐢ㄨ嫳鏂囦笅鍒掔嚎鍛藉悕銆?

**淇敼鏂规**  
1. 琛ㄥ崟鏍囩锛坄dataset_id` 鈫?`鏁版嵁闆?ID`銆乣label_column` 鈫?`鏍囩鍒梎銆乣train_ratio` 鈫?`璁粌闆嗘瘮渚媊 绛夛級
2. 琛ㄥご锛坄experiment_name` 鈫?`瀹為獙鍚嶇О`銆乣model_type` 鈫?`妯″瀷绫诲瀷` 绛夛級
3. 鍖哄潡鏍囬锛坄Traceability` 鈫?`鍙拷婧€銆乣Artifacts` 鈫?`浜х墿鏂囦欢` 绛夛級
4. 淇濈暀 API 瀛楁鍚嶄笉鍙橈紙浠?UI 鏄剧ず鏂囨湰鍋氱炕璇戯級

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈夎〃鍗?label 鏄剧ず涓枃
- [ ] 鎵€鏈夎〃澶存樉绀轰腑鏂?
- [ ] API 璇锋眰鍙傛暟鍚嶄笉鍙楀奖鍝?

---

#### T11锛欰cademicAlgorithm.vue 涓枃鍖?

**闂鎻忚堪**  
绉戝鍥?Figure 鏍囬銆佸潗鏍囪酱鏍囩銆佸浘渚嬩负鑻辨枃銆傞儴鍒嗗鏈湳璇渶涓嫳瀵圭収澶勭悊銆?

**淇敼鏂规**  
1. Figure 鏍囬鏀逛负涓枃锛歚Fig. 1 | Phase-field fracture evolution` 鈫?`鍥?1 | 鐩稿満鏂婕斿寲杩囩▼`
2. 鍧愭爣杞存爣绛撅細`Burial Depth H (m)` 鈫?`鍩嬫繁 H (m)`銆乣BRI` 淇濈暀缂╁啓
3. 鍥句緥鏂囧瓧锛歚Low Risk` 鈫?`浣庨闄ー銆乣High Risk` 鈫?`楂橀闄ー
4. 鏈哄埗鍚嶇О涓嫳瀵圭収锛歚Isotropic锛堝悇鍚戝悓鎬э級`銆乣Double-Couple锛堝弻鍔涘伓锛塦
5. 涓绘爣棰橈細`Academic Algorithm Demonstration Platform` 鈫?`瀛︽湳绠楁硶婕旂ず骞冲彴`

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈?Figure 鏍囬浣跨敤涓枃锛堝鏈缉鍐欎繚鐣欒嫳鏂囬檮鍔犱腑鏂囷級
- [ ] 鍧愭爣杞存爣绛句腑鏂囧寲锛堝崟浣嶄繚鐣欒嫳鏂囧 m銆丮Pa锛?
- [ ] 鍥句緥鍙垏鎹腑鑻辨枃

---

#### T12锛氬叾浠栭〉闈㈤浂鏁ｈ嫳鏂囦腑鏂囧寲

**娑夊強鏂囦欢涓庝慨鏀归」**  

| 鏂囦欢 | 鑻辨枃鍐呭 | 涓枃鏇挎崲 |
|------|---------|---------|
| `AlgorithmValidation.vue` | "Geology-aware 瀵圭収" | "鍦拌川鎰熺煡瀵圭収" |
| `AlgorithmValidation.vue` | SVG 鍐?`鍩虹嚎 MPI`锛堝凡涓枃锛屼繚鐣欙級 | 鈥?|
| `Report.vue` | Min / Max / Std / P50 | 鏈€灏忓€?/ 鏈€澶у€?/ 鏍囧噯宸?/ 涓綅鏁?|
| `Report.vue` | Best AUC / Best Brier | 鏈€浣?AUC / 鏈€浣?Brier |
| `Scene3DPage.vue` | "3D Workspace" | "涓夌淮宸ヤ綔绌洪棿" |
| `GeomodelVisualization.vue` | "Geological Modeling & Visualization" | "鍦拌川寤烘ā涓庡彲瑙嗗寲" |
| `Steps.vue` | IDW / Linear / Nearest | 鍙嶈窛绂诲姞鏉?/ 绾挎€?/ 鏈€杩戦偦 |
| `PressureIndex.vue` | Kriging / IDW / Linear / Nearest | 鍏嬮噷閲?/ 鍙嶈窛绂诲姞鏉?/ 绾挎€?/ 鏈€杩戦偦 |
| `MpiHeatmap.vue` | IDW / Linear / Nearest / "Canvas" | 鍙嶈窛绂诲姞鏉?/ 绾挎€?/ 鏈€杩戦偦 / 鐢诲竷妯″紡 |
| `DataImport.vue` | 妫€鏌ユ槸鍚︽湁鑻辨枃娈嬬暀 | 鍏ㄩ儴涓枃鍖?|

**楠屾敹鏍囧噯**  
- [ ] 浠ヤ笂鎵€鏈夋枃浠剁殑 UI 鏂囨湰榛樿涓轰腑鏂?
- [ ] 涓撲笟鏈缁熶竴鏍煎紡锛歚鍏嬮噷閲戯紙Kriging锛塦
- [ ] `grep -rn "TODO\|FIXME" --include="*.vue"` 鏃犻仐鐣欑炕璇戞爣璁?

---

#### T13锛氫腑鑻辨枃鍒囨崲鍔熻兘瀹炵幇

**闂鎻忚堪**  
鐢ㄦ埛闇€瑕佷竴涓叏灞€涓嫳鏂囧垏鎹㈤€夐」锛岄粯璁や腑鏂囷紝鍙垏鎹负鑻辨枃銆?

**淇敼鏂规**  

1. **鍒囨崲鍏ュ彛 UI**锛氬湪 `AppLayout.vue` 渚ц竟鏍忓簳閮ㄦ坊鍔犺瑷€鍒囨崲鎸夐挳
   ```html
   <button class="lang-switch" @click="toggleLocale">
     {{ locale === 'zh-CN' ? 'EN' : '涓? }}
   </button>
   ```

2. **瀹炵幇閫昏緫**锛?
   - 浣跨敤 `useLocaleStore` 绠＄悊璇█鐘舵€?
   - 鍒囨崲鏃惰嚜鍔ㄦ洿鏂?`document.documentElement.lang` 灞炴€?
   - 璺敱 `meta.title` 鏀寔瀵硅薄鏍煎紡 `{ 'zh-CN': '鏁版嵁瀵煎叆', 'en-US': 'Data Import' }`

3. **鍒囨崲鑼冨洿**锛?
   - 瀵艰埅鏍囬 鉁?
   - 椤甸潰鏍囬涓庢弿杩?鉁?
   - 琛ㄥ崟鏍囩/placeholder 鉁?
   - 鎸夐挳鏂囧瓧 鉁?
   - 鐘舵€佹秷鎭?Toast 鉁?
   - 琛ㄥご 鉁?
   - 閿欒鎻愮ず 鉁?
   - 绉戝鍥句腑鐨?Figure 鏍囬 鉁咃紙鍧愭爣杞村崟浣嶄繚鎸佽嫳鏂囨棤闇€鍒囨崲锛?

4. **涓嶅垏鎹㈢殑鍐呭**锛?
   - API 瀛楁鍚?
   - URL 璺緞
   - 涓撲笟缂╁啓锛圡PI銆丷SI銆丅RI銆丄SI銆丄UC 绛夛級
   - 鍥捐〃鏁版嵁鏍囩涓殑鏁板€?

**楠屾敹鏍囧噯**  
- [ ] 渚ц竟鏍忓簳閮ㄦ湁娓呮櫚鐨?涓?EN 鍒囨崲鎸夐挳
- [ ] 鐐瑰嚮鍚庡叏绔欐枃鏈湪 200ms 鍐呭垏鎹紝鏃犻〉闈㈠埛鏂?
- [ ] 鍒锋柊椤甸潰鍚庤瑷€鍋忓ソ淇濇寔涓嶅彉锛坙ocalStorage 鎸佷箙鍖栵級
- [ ] 涓枃鍜岃嫳鏂囦笅椤甸潰鎺掔増鍧囨棤婧㈠嚭鎴栭敊浣?

---

### P3 鈥?甯冨眬涓庢帓鐗堜紭鍖?

---

#### T14锛氱粺涓€椤甸潰鏍囬/Header 缁撴瀯

**闂鎻忚堪**  
鍚勯〉闈?header 鍖哄煙鑷冲皯鏈?5 绉嶄笉鍚岀殑瀹炵幇鏂瑰紡锛屽鑷磋瑙変笉缁熶竴銆?

**淇敼鏂规**  
1. **瀹氫箟鏍囧噯 Header 缁勪欢**锛歚components/library/layout/PageHeader.vue`
   ```vue
   <template>
     <header class="page-header">
       <div class="page-header-content">
         <h1 class="page-title">{{ title }}</h1>
         <p v-if="description" class="page-description">{{ description }}</p>
       </div>
       <div v-if="$slots.actions" class="page-header-actions">
         <slot name="actions" />
       </div>
     </header>
   </template>
   ```

2. **缁熶竴 Header 鏍峰紡瑙勫垯**锛?
   - 鏍囬锛?4px銆?00 瀛楅噸銆乣--text-primary`
   - 鎻忚堪锛?4px銆?00 瀛楅噸銆乣--text-tertiary`
   - 鑳屾櫙锛氬幓闄ゆ笎鍙橈紝浣跨敤 `--bg-primary` + 搴曢儴 1px 鍒嗛殧绾?
   - 鍙充晶鎿嶄綔鍖猴細flex 甯冨眬锛実ap 12px
   - 鍐呰竟璺濓細`24px 0`锛屾棤渚ц竟 padding锛堢敱澶栧眰瀹瑰櫒鎺у埗锛?

3. **閫愰〉鏇挎崲**锛氬皢鎵€鏈夐〉闈㈢殑鑷畾涔?header 鏇挎崲涓?`<PageHeader>` 缁勪欢

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈夐〉闈娇鐢ㄧ粺涓€鐨?`<PageHeader>` 缁勪欢
- [ ] Header 瑙嗚椋庢牸涓€鑷达細鏃犳笎鍙樸€佹棤褰╄壊瑁呴グ
- [ ] 鏍囬/鎻忚堪棰滆壊浣跨敤 CSS 鍙橀噺

---

#### T15锛氱粺涓€鍗＄墖涓庨潰鏉挎牱寮?

**闂鎻忚堪**  
閮ㄥ垎椤甸潰浣跨敤鍏ㄥ眬 `.card` 绫伙紝閮ㄥ垎鑷畾涔?scoped 鏍峰紡锛岄儴鍒嗙洿鎺ュ啓鍐呰仈鏍峰紡锛屽鑷村崱鐗囧渾瑙掋€侀槾褰便€佸唴杈硅窛涓嶇粺涓€銆?

**淇敼鏂规**  
1. **瀹氫箟鏍囧噯鍗＄墖缁勪欢**锛歚components/library/layout/Card.vue`
   ```vue
   <template>
     <div class="card" :class="{ 'card--bordered': bordered, 'card--flat': flat }">
       <div v-if="title || $slots.header" class="card-header">
         <h3 v-if="title" class="card-title">{{ title }}</h3>
         <slot name="header" />
       </div>
       <div class="card-body">
         <slot />
       </div>
       <div v-if="$slots.footer" class="card-footer">
         <slot name="footer" />
       </div>
     </div>
   </template>
   ```

2. **缁熶竴瑙勫垯**锛?
   - 鍦嗚锛?px锛坄--radius-md`锛?
   - 杈规锛?px solid `var(--border-color)`
   - 闃村奖锛歚var(--shadow-sm)`锛宧over 鏃?`var(--shadow-md)`
   - 鍐呰竟璺濓細`20px 24px`
   - 鑳屾櫙锛氱函鐧?`var(--bg-primary)`锛屽幓闄ゆ笎鍙樺拰 `::before`/`::after` 浼厓绱犺楗?
   - 鍘绘帀 hover 涓婃诞鍔ㄧ敾锛堢鐮旂郴缁熶笉闇€瑕佸崱鐗囨偓娴晥鏋滐級

3. **淇敼 `style.css` 涓?`.card` 鍏ㄥ眬绫?*锛氬幓闄ゆ笎鍙樸€佷吉鍏冪礌銆乭over 涓婃诞鍔ㄦ晥鏋?

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈夊崱鐗囪瑙変竴鑷达細绾櫧鑳屾櫙銆佺伆鑹茶竟妗嗐€佺伆鑹查槾褰?
- [ ] 鏃?hover 涓婃诞/棰滆壊鍙樺寲鏁堟灉
- [ ] 鍗＄墖鍐呰竟璺濈粺涓€

---

#### T16锛氱粺涓€琛ㄦ牸鏍峰紡涓庝氦浜?

**闂鎻忚堪**  
鍏ㄧ珯鑷冲皯鏈?3 绉嶄笉鍚岃〃鏍煎疄鐜帮細鍏ㄥ眬 `.table` 绫汇€佺粍浠?scoped 琛ㄦ牸銆丏ataTable 缁勪欢锛屾牱寮忎笉缁熶竴銆?

**淇敼鏂规**  
1. **缁熶竴琛ㄦ牸瑙勮寖**锛?
   - 琛ㄥご锛歚--bg-tertiary`锛?f5f5f5锛夎儗鏅紝`--text-secondary` 鏂囧瓧锛?2px 瀛楀彿锛屽ぇ鍐欏幓鎺?
   - 鍗曞厓鏍硷細14px 瀛楀彿锛宍--text-primary` 鏂囧瓧
   - 琛岄珮浜細hover 鏃?`--bg-secondary`锛堜笉浣跨敤褰╄壊娓愬彉锛?
   - 琛ㄦ牸杈规锛氫粎姘村钩鍒嗛殧绾?`1px solid var(--border-color)`
   - 鍘婚櫎琛ㄥご `text-transform: uppercase`锛堜腑鏂囦笉搴斿ぇ鍐欙級
   - 鍘婚櫎 hover 鏃剁殑 `transform: scale(1.01)` 鏁堟灉

2. **淇敼鍏ㄥ眬 `.table` 鏍峰紡**锛?
   ```css
   .table th {
     background: var(--bg-tertiary);
     border-bottom: 1px solid var(--border-color);
     font-weight: 600;
     color: var(--text-secondary);
     font-size: 13px;
     letter-spacing: 0;
     text-transform: none;
   }
   .table tbody tr:hover {
     background: var(--bg-secondary);
     transform: none;
     box-shadow: none;
   }
   ```

3. **鎺ㄥ箍 `DataTable.vue` 缁勪欢**锛岄€愭鏇挎崲鍚勯〉闈㈣嚜瀹氫箟琛ㄦ牸

**楠屾敹鏍囧噯**  
- [ ] 鍏ㄥ眬琛ㄦ牸娌℃湁 `text-transform: uppercase`
- [ ] 琛ㄦ牸 hover 鏃犵缉鏀炬晥鏋?
- [ ] 琛ㄥご鑳屾櫙涓虹函鐏拌壊

---

#### T17锛氱粺涓€闂磋窛涓庡唴杈硅窛绯荤粺

**闂鎻忚堪**  
閮ㄥ垎鏂囦欢浣跨敤 `--spacing-*` CSS 鍙橀噺锛岄儴鍒嗙洿鎺ュ啓 `16px`銆乣24px` 绛夌‖缂栫爜鍊硷紝闂磋窛涓嶇粺涓€銆?

**淇敼鏂规**  
1. **缁熶竴浣跨敤 `design-tokens.css` 涓畾涔夌殑闂磋窛鍙橀噺**
2. **寤虹珛闂磋窛浣跨敤瑙勮寖**锛?
   - 椤甸潰瀹瑰櫒鍐呰竟璺濓細`--spacing-6`锛?4px锛?
   - 鍗＄墖闂磋窛锛歚--spacing-4`锛?6px锛?
   - 鍗＄墖鍐呰竟璺濓細`--spacing-5`锛?0px锛塦--spacing-6`锛?4px锛?
   - 琛ㄥ崟椤归棿璺濓細`--spacing-4`锛?6px锛?
   - 鏍囬涓庡唴瀹归棿璺濓細`--spacing-3`锛?2px锛?
   - 绱у噾闂磋窛锛堟寜閽粍绛夛級锛歚--spacing-2`锛?px锛?
3. **鍏ㄥ眬鎼滅储骞舵浛鎹㈢‖缂栫爜闂磋窛鍊?*

**楠屾敹鏍囧噯**  
- [ ] 鐙珛妫€鏌ワ細鎵€鏈?scoped style 涓殑 padding/margin 浣跨敤 `var(--spacing-*)` 鍙橀噺
- [ ] 椤甸潰闂磋瑙夐棿璺濅竴鑷?

---

#### T18锛欰cademicAlgorithm.vue 缁勪欢鎷嗗垎

**闂鎻忚堪**  
`AcademicAlgorithm.vue` 杈?3715 琛岋紝鍖呭惈澶氫釜 SVG 绉戝鍥俱€佸叕寮忔覆鏌撱€佷氦浜掓帶浠讹紝涓ラ噸褰卞搷鍙淮鎶ゆ€у拰缂栬瘧鎬ц兘銆?

**淇敼鏂规**  
灏嗗叾鎷嗗垎涓轰互涓嬪瓙缁勪欢锛?

| 鏂扮粍浠?| 鑱岃矗 | 棰勪及琛屾暟 |
|--------|------|---------|
| `AcademicAlgorithm.vue`锛堜富椤甸潰锛?| 甯冨眬缂栨帓銆乀ab 鍒囨崲 | ~200 |
| `PhaseFieldFracture.vue` | 鐩稿満鏂婕斿寲 SVG 鍥?| ~400 |
| `MomentTensorInversion.vue` | 鐭╁紶閲忓弽婕旈渿鐞?SVG | ~400 |
| `UnifiedStrengthTheory.vue` | 缁熶竴寮哄害鐞嗚鍖呯粶绾?SVG | ~400 |
| `DepthRiskCurve.vue` | 鍩嬫繁-椋庨櫓鍏崇郴鏇茬嚎 | ~300 |
| `AlgorithmFormula.vue` | 鍏紡娓叉煋鍖哄煙锛圞aTeX锛?| ~300 |
| `AlgorithmInteraction.vue` | 鍙傛暟婊戝潡涓庝氦浜掓帶浠?| ~200 |

**鎷嗗垎鍘熷垯**  
- 姣忎釜 SVG 绉戝鍥剧嫭绔嬩负涓€涓粍浠讹紝閫氳繃 props 浼犲叆鏁版嵁
- 浜や簰閫昏緫锛堟粦鍧椼€佸弬鏁拌皟鑺傦級闆嗕腑鍒颁氦浜掔粍浠?
- 涓婚〉闈粎璐熻矗 Tab 鍒囨崲鍜屾暣浣撳竷灞€

**楠屾敹鏍囧噯**  
- [ ] 涓绘枃浠惰鏁?鈮?300 琛?
- [ ] 姣忎釜瀛愮粍浠惰鏁?鈮?500 琛?
- [ ] 椤甸潰鍔熻兘涓庢媶鍒嗗墠瀹屽叏涓€鑷?
- [ ] 瀛愮粍浠堕€氳繃 props/emits 閫氫俊锛屾棤鐩存帴 DOM 鎿嶄綔

---

### P4 鈥?缁勪欢璐ㄩ噺鎻愬崌

---

#### T19锛氭秷闄?Toast 缁勪欢閲嶅瀹炵幇

**闂鎻忚堪**  
`components/Toast.vue` 鍜?`components/library/feedback/Toast.vue` 涓ゅ Toast 瀹炵幇鍏卞瓨銆?

**淇敼鏂规**  
1. 淇濈暀 `library/feedback/Toast.vue`锛堟洿鏍囧噯鍖栫殑瀹炵幇锛?
2. 灏?`components/Toast.vue` 鐨勮寮曠敤澶勫叏閮ㄦ浛鎹负 library 鐗堟湰
3. 鍒犻櫎 `components/Toast.vue`
4. 缁熶竴 Toast API锛歚toast.add(message, type, duration)`

**楠屾敹鏍囧噯**  
- [ ] 鍏ㄧ珯鍙湁涓€涓?Toast 瀹炵幇锛歚components/library/feedback/Toast.vue`
- [ ] 鎵€鏈夊紩鐢ㄥ锛圓ppLayout.vue 绛夛級宸叉洿鏂?
- [ ] Toast 鍔熻兘姝ｅ父锛屾敮鎸?success/error/warning/info 鍥涚绫诲瀷

---

#### T20锛氭坊鍔犲叏灞€绌虹姸鎬佺粍浠?

**闂鎻忚堪**  
澶氫釜椤甸潰鍦ㄦ棤鏁版嵁鏃剁洿鎺ユ樉绀虹┖鐧芥垨瀹屽叏闅愯棌鍖哄煙锛岀己灏戝紩瀵兼€х┖鐘舵€併€?

**淇敼鏂规**  
1. **鍒涘缓 `EmptyState.vue` 缁勪欢**锛?
   ```vue
   <template>
     <div class="empty-state">
       <div class="empty-state-icon">
         <slot name="icon">
           <svg><!-- 榛樿绌烘暟鎹浘鏍?--></svg>
         </slot>
       </div>
       <h3 class="empty-state-title">{{ title || '鏆傛棤鏁版嵁' }}</h3>
       <p v-if="description" class="empty-state-desc">{{ description }}</p>
       <div v-if="$slots.action" class="empty-state-action">
         <slot name="action" />
       </div>
     </div>
   </template>
   ```

2. **瑕嗙洊椤甸潰**锛?
   - GeoMpiStudio锛氭棤鐓ゅ眰鏁版嵁鏃?鈫?寮曞鐢ㄦ埛鍏堝鍏ユ暟鎹?
   - Scene3DPage锛氬彸渚х粺璁℃棤鏁版嵁鏃?鈫?鏄剧ず绌虹姸鎬佽€岄潪闅愯棌
   - ResearchWorkbench锛氬疄楠屽垪琛ㄤ负绌烘椂 鈫?寮曞鍒涘缓鏂板疄楠?
   - Report锛氭棤鎶ュ憡鏃?鈫?寮曞瀹屾垚鍓嶇疆姝ラ

**楠屾敹鏍囧噯**  
- [ ] 鎵€鏈夊垪琛?琛ㄦ牸/闈㈡澘鍦ㄦ暟鎹负绌烘椂鏄剧ず `EmptyState` 缁勪欢
- [ ] 绌虹姸鎬佸寘鍚爣棰樸€佹弿杩般€佹搷浣滄寜閽紙鍙€夛級
- [ ] 绌虹姸鎬侀鏍肩鍚堥粦鐧界伆涓婚

**褰撳墠杩涘害锛?026-02-28锛?*  
- 宸插畬鎴愮粍浠跺垱寤轰笌瀵煎嚭锛坄EmptyState.vue`銆乣components/library/index.js`锛夈€?
- 宸插湪 `ResearchPortal.vue` 鎺ュ叆銆?
- 鍏朵綑椤甸潰鎺ュ叆寰呯户缁帹杩涖€?

---

#### T21锛氭坊鍔犻鏋跺睆 Loading 鐘舵€?

**闂鎻忚堪**  
鏁版嵁鍔犺浇鏈熼棿浠呮樉绀虹畝鍗?spinner锛岀敤鎴锋棤娉曟劅鐭ラ〉闈㈠嵆灏嗗憟鐜扮殑甯冨眬銆?

**淇敼鏂规**  
1. **鍒涘缓 `SkeletonLoader.vue` 缁勪欢**锛氭敮鎸?text/card/table/chart 鍥涚楠ㄦ灦绫诲瀷
2. **搴旂敤鍒版墍鏈夊紓姝ユ暟鎹姞杞藉満鏅?*锛?
   - ResearchPortal锛歭eaderboard 鍜?papers 鍔犺浇鏃舵樉绀鸿〃鏍奸鏋?
   - GeomodelVisualization锛?D 妯″瀷鍔犺浇鏃舵樉绀哄叏灞忛鏋?
   - AlgorithmValidation锛氳绠楃粨鏋滃姞杞芥椂鏄剧ず鍗＄墖楠ㄦ灦
   - Report锛氭姤鍛婃暟鎹姞杞芥椂鏄剧ず澶氭楠ㄦ灦
3. **楠ㄦ灦棰滆壊**锛氫娇鐢?`--bg-tertiary` 鍒?`--bg-secondary` 鐨勮剦鍐插姩鐢?

**楠屾敹鏍囧噯**  
- [ ] 浣跨敤娴忚鍣?Network 闄愰€燂紙Slow 3G锛変笅锛屾墍鏈夐〉闈㈠姞杞芥湡闂存樉绀洪鏋跺睆
- [ ] 楠ㄦ灦灞忓竷灞€涓庡疄闄呭唴瀹瑰竷灞€鍩烘湰鍖归厤
- [ ] 楠ㄦ灦灞忛鑹蹭负鐏拌壊绯伙紝鏃犲僵鑹?

**褰撳墠杩涘害锛?026-02-28锛?*  
- 宸插畬鎴愮粍浠跺垱寤轰笌瀵煎嚭锛坄SkeletonPanel.vue`銆乣components/library/index.js`锛夈€?
- 宸插湪 `ResearchPortal.vue` 涓?`AcademicAlgorithm.vue` 鎺ュ叆銆?
- 鍏ㄩ〉闈㈣鐩栦笌鎱㈢綉浜哄伐楠屾敹寰呰ˉ銆?

---

#### T22锛氫慨澶?AiSearchBar 浜嬩欢娉勬紡

**闂鎻忚堪**  
`AiSearchBar.vue` 鍦?`onMounted` 涓敞鍐屼簡 `window.addEventListener`锛堝閿洏蹇嵎閿洃鍚級锛屼絾鏈湪 `onBeforeUnmount` 涓Щ闄わ紝瀵艰嚧缁勪欢鍗歌浇鍚庝簨浠朵粛鐒惰Е鍙戙€?

**淇敼鏂规**  
```javascript
// Before
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// After
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
```

**楠屾敹鏍囧噯**  
- [x] `onMounted` 涓殑姣忎釜 `addEventListener` 閮芥湁瀵瑰簲鐨?`removeEventListener`
- [x] 澶氭鍒囨崲椤甸潰鍚庢棤鍐呭瓨娉勬紡锛圕hrome DevTools Memory panel 鏃犲闀胯秼鍔匡級

---

#### T23锛氱紦瀛樺ぇ灏忛檺鍒?

**闂鎻忚堪**  
`AlgorithmValidation.vue` 鐨?`spatialCache`锛圡ap锛夊拰 `MpiHeatmapPro.vue` 鐨?`colorCache`锛圡ap锛夋棤澶у皬涓婇檺锛岄暱鏃堕棿杩愯浼氭寔缁闀裤€?

**淇敼鏂规**  
瀹炵幇 LRU 缂撳瓨鏇夸唬鏅€?Map锛?
```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.cache = new Map()
  }
  get(key) {
    if (!this.cache.has(key)) return undefined
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }
  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.maxSize) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
```

**楠屾敹鏍囧噯**  
- [x] `spatialCache` 鍜?`colorCache` 浣跨敤 LRU 缂撳瓨锛屾渶澶у閲?200 鏉?
- [x] 缂撳瓨婧㈠嚭鏃惰嚜鍔ㄦ窐姹版渶鏃ф潯鐩?

---

### P5 鈥?鎬ц兘浼樺寲

---

#### T24锛氳矾鐢辩骇浠ｇ爜鍒嗗壊浼樺寲

**闂鎻忚堪**  
褰撳墠璺敱宸蹭娇鐢?`() => import(...)` 鎳掑姞杞斤紝浣嗙己灏戦鍔犺浇鎻愮ず鍜?chunk 鍛藉悕銆?

**淇敼鏂规**  
1. **娣诲姞 webpack magic comment**锛圴ite 涔熸敮鎸侊級鐢ㄤ簬 chunk 鍛藉悕锛?
   ```javascript
   component: () => import(/* webpackChunkName: "data-import" */ '../views/DataImport.vue')
   ```
2. **娣诲姞璺敱棰勫姞杞?*锛氶紶鏍囨偓娴鑸」鏃堕鍔犺浇鐩爣璺敱缁勪欢
3. **鍦?`vite.config.js` 涓厤缃?`build.rollupOptions.output.manualChunks`**锛氬皢 echarts銆乼hree.js銆乨3 绛夊ぇ鍨嬪簱鍒嗙涓虹嫭绔?chunk

**楠屾敹鏍囧噯**  
- [x] `npm run build` 杈撳嚭涓瘡涓矾鐢卞搴旂嫭绔?chunk锛屽懡鍚嶆竻鏅?
- [x] echarts銆乼hree.js銆乨3 鍚勮嚜涓虹嫭绔?chunk
- [x] 棣栨鍔犺浇鍙姹傚綋鍓嶈矾鐢辩殑 chunk

---

#### T25锛氬ぇ鍨?SVG 鍥捐〃鎳掑姞杞?

**闂鎻忚堪**  
`AcademicAlgorithm.vue`锛堟媶鍒嗗悗鐨勫瓙缁勪欢锛夊寘鍚涓鏉?SVG 绉戝鍥撅紝涓€娆℃€у姞杞藉奖鍝嶉灞忔€ц兘銆?

**淇敼鏂规**  
1. 浣跨敤 `defineAsyncComponent` + `Suspense` 鎳掑姞杞芥媶鍒嗗悗鐨?SVG 鍥剧粍浠?
2. 涓嶅湪瑙嗙獥鍐呯殑 Tab 鍐呭寤惰繜娓叉煋锛堜娇鐢?`v-if` 鏇夸唬 `v-show`锛?
3. SVG 闈欐€侀儴鍒嗘彁鍙栦负鐙珛 `.svg` 鏂囦欢锛岄€氳繃 `<img>` 鎴?Vite svg 鎻掍欢鍔犺浇

**楠屾敹鏍囧噯**  
- [x] 闈炲綋鍓?Tab 鐨?SVG 缁勪欢涓嶆覆鏌?
- [x] 鍒囨崲 Tab 鏃剁粍浠跺姞杞藉欢杩?< 200ms

---

#### T26锛氳櫄鎷熷垪琛ㄩ槇鍊艰皟浼?

**闂鎻忚堪**  
`DataImport.vue` 涓櫄鎷熷垪琛ㄩ槇鍊?>100 琛屾墠鍚敤锛?0-100 琛岀殑闀垮垪琛ㄤ粛浣跨敤鏅€?DOM 娓叉煋銆?

**淇敼鏂规**  
灏嗚櫄鎷熷垪琛ㄥ惎鐢ㄩ槇鍊间粠 100 闄嶄綆鍒?50銆?

**楠屾敹鏍囧噯**  
- [x] 鈮?50 琛屾暟鎹椂鑷姩鍚敤铏氭嫙鍒楄〃
- [x] 婊氬姩娴佺晠搴︿笉浣庝簬 60fps

---

### P6 鈥?鍙闂€т笌鍝嶅簲寮?

---

#### T27锛氬搷搴斿紡鏂偣琛ュ叏

**闂鎻忚堪**  
澶氫釜椤甸潰缂哄皯涓棿鏂偣鎴栧畬鍏ㄦ病鏈夊搷搴斿紡澶勭悊銆?

**淇敼鏂规**  

| 椤甸潰 | 鐜扮姸 | 鐩爣鏂偣 |
|------|------|---------|
| GeoMpiStudio | 1280px, 768px | 澧炲姞 1024px锛堝弻鍒楀竷灞€锛?|
| ResearchPortal | 浠?1080px | 澧炲姞 768px, 1280px |
| Scene3DPage | 鏃犲搷搴斿紡 | 澧炲姞 1024px锛堥潰鏉挎姌鍙狅級, 768px |
| GeomodelVisualization | 渚ц竟闈㈡澘 320px 鍥哄畾 | 768px 涓嬮潰鏉挎敹璧蜂负鎶藉眽 |
| MpiHeatmapPro | 鏃犲搷搴斿紡 | 搴曢儴鎺у埗鏉¤嚜閫傚簲锛?68px 涓嬬畝鍖栦氦浜?|
| AcademicAlgorithm | 鏃犲搷搴斿紡 | SVG 浣跨敤 viewBox 鑷€傚簲锛屾枃瀛楀ぇ灏忚皟鏁?|
| AlgorithmValidation | 缂╃暐鍥鹃潰鏉垮浐瀹氬畾浣?| 768px 涓嬫敼涓哄簳閮ㄦ娊灞?|

**楠屾敹鏍囧噯**  
- [x] 鎵€鏈夐〉闈㈠湪 1920px / 1440px / 1024px / 768px / 375px 浜斾釜瀹藉害涓嬪竷灞€鍚堢悊
- [x] 鏃犳按骞虫孩鍑?
- [x] 鏂囧瓧澶у皬鍙锛堟渶灏?12px锛?

**褰撳墠杩涘害锛?026-02-28锛?*  
- 宸插畬鎴愬叏璺敱鑷姩鍖栬蛋鏌ワ細12 涓矾鐢?脳 5 涓柇鐐癸紙1920/1440/1024/768/375锛夈€?- 鏈彂鐜版按骞虫孩鍑猴紱瀹¤鎶ュ憡宸插綊妗ｏ細`data/research/stage_e/ui_accessibility/20260228T153205/report.{json,md}`銆?
---

#### T28锛氶敭鐩樺鑸笌 ARIA 鏍囩淇

**闂鎻忚堪**  
- AppLayout.vue 涓?ARIA 鏍囩涓轰贡鐮?
- 澶氫釜浜や簰鍏冪礌缂哄皯 `role`銆乣aria-label`
- Tab 閿鑸『搴忎笉鍚堢悊

**淇敼鏂规**  
1. 淇鎵€鏈?ARIA 鏍囩涔辩爜锛堝凡鍦?T02 涓鐩栵級
2. 鎵€鏈夊彲浜や簰鍏冪礌娣诲姞 `role` 灞炴€?
3. 渚ц竟鏍忔坊鍔?`role="navigation"` 鍜?`aria-label="涓诲鑸?`
4. 涓诲唴瀹瑰尯娣诲姞 `role="main"`
5. 妯℃€佹/瀵硅瘽妗嗘坊鍔?`role="dialog"` 鍜岀劍鐐规崟鑾?
6. 鎵€鏈夊浘鏍囨寜閽坊鍔?`aria-label`
7. `tabindex` 浼樺寲锛氱‘淇?Tab 椤哄簭绗﹀悎瑙嗚娴?

**楠屾敹鏍囧噯**  
- [x] 浣跨敤 Tab 閿彲閬嶅巻鎵€鏈変氦浜掑厓绱?
- [x] 灞忓箷闃呰鍣ㄥ彲姝ｇ‘鏈楄鎵€鏈夋寜閽?閾炬帴/瀵艰埅椤?
- [x] `axe-core` 自动化检测 0 个 critical/serious 级别问题

**褰撳墠杩涘害锛?026-02-28锛?*  
- 已完成 `AppLayout.vue`、`AiChatSidebar.vue`、`MpiHeatmapPro.vue`、`ResearchWorkbench.vue`、`Report.vue`、`Steps.vue` 等关键页面/组件的 ARIA 与可访问性收敛。
- 已执行 `axe-core` 自动扫描并归档：`data/research/stage_e/ui_accessibility/20260228T153205/report.{json,md}`。
- 当前统计：`axeCriticalTotal=0`、`axeSeriousTotal=0`，已达到验收门槛。
---

#### T29锛氳Е鎺ф墜鍔挎敮鎸?

**闂鎻忚堪**  
Canvas 浜や簰锛堟嫋鎷?缂╂斁锛夋湭閫傞厤瑙︽帶璁惧銆?

**淇敼鏂规**  
1. `AlgorithmValidation.vue`锛欳anvas 娣诲姞 `touch-action: none`锛屼娇鐢?pointer events 鏇夸唬 mouse events
2. `MpiHeatmapPro.vue`锛氱儹鍔涘浘鏀寔鍙屾寚缂╂斁銆佸崟鎸囨嫋鎷?
3. `Interpolation.vue`锛氬墫闈㈢嚎缁樺埗娣诲姞 touch 鏀寔

**楠屾敹鏍囧噯**  
- [x] iPad/骞虫澘涓婂彲鎷栨嫿鍜岀缉鏀?Canvas 鍐呭
- [x] 鍙屾寚缂╂斁鎵嬪娍娴佺晠
- [x] 涓嶄笌椤甸潰婊氬姩鍐茬獊

---

## 鍥涖€佸疄鏂借矾绾垮浘

### 绗竴闃舵锛氬熀纭€淇锛堢 1-2 澶╋級

| 浠诲姟 | 浼樺厛绾?| 宸ユ椂 |
|------|-------|------|
| T01 淇 HealthCheck 缂栬瘧 | P0 | 2h |
| T02 淇 AppLayout 涔辩爜 | P0 | 1h |
| T03 缁熶竴 CSS 鍙橀噺瀹氫箟 | P0 | 3h |
| T22 淇浜嬩欢娉勬紡 | P4 | 1h |

### 绗簩闃舵锛氶厤鑹查噸鏋勶紙绗?3-5 澶╋級

| 浠诲姟 | 浼樺厛绾?| 宸ユ椂 |
|------|-------|------|
| T04 榛戠櫧鐏拌璁＄郴缁?| P1 | 6h |
| T05 纭紪鐮侀鑹叉浛鎹?| P1 | 12h |
| T06 闃村奖涓庢笎鍙樺幓鑹?| P1 | 3h |

### 绗笁闃舵锛氬浗闄呭寲锛堢 6-9 澶╋級

| 浠诲姟 | 浼樺厛绾?| 宸ユ椂 |
|------|-------|------|
| T07 i18n 鏋舵瀯鎼缓 | P2 | 6h |
| T08-T12 鍚勯〉闈腑鏂囧寲 | P2 | 18h |
| T13 涓嫳鏂囧垏鎹㈠疄鐜?| P2 | 4h |

### 绗洓闃舵锛氬竷灞€浼樺寲锛堢 10-12 澶╋級

| 浠诲姟 | 浼樺厛绾?| 宸ユ椂 |
|------|-------|------|
| T14-T17 缁熶竴椤甸潰鍏冪礌 | P3 | 15h |
| T18 AcademicAlgorithm 鎷嗗垎 | P3 | 8h |

### 绗簲闃舵锛氳川閲忎笌鎬ц兘锛堢 13-14 澶╋級

| 浠诲姟 | 浼樺厛绾?| 宸ユ椂 |
|------|-------|------|
| T19-T23 缁勪欢璐ㄩ噺淇 | P4 | 12h |
| T24-T26 鎬ц兘浼樺寲 | P5 | 6h |
| T27-T29 鍝嶅簲寮忎笌鍙闂€?| P6 | 14h |

---

## 浜斻€侀闄╀笌渚濊禆

### 5.1 椋庨櫓

| 椋庨櫓 | 褰卞搷 | 缂撹В鎺柦 |
|------|------|---------|
| 棰滆壊鏇挎崲閬楁紡 | 閮ㄥ垎鍏冪礌淇濇寔鏃ц璁?| 鐢?`grep` 鍏ㄦ枃鎼滅储楠岃瘉锛屽缓绔嬬櫧鍚嶅崟娓呭崟 |
| SVG 鍥句腑鏂囧寲褰卞搷甯冨眬 | 涓枃瀛楃瀹藉害涓嶅悓 | 棰勭暀瓒冲鏂囧瓧绌洪棿锛屼娇鐢?`text-anchor` 灞呬腑 |
| i18n 閿悕鎷煎啓閿欒 | 椤甸潰鏄剧ず鍘熷 key | 寮€鍙戠幆澧冩坊鍔犵己澶辩炕璇戦敭璀﹀憡 |
| 缁勪欢鎷嗗垎寮曞叆鏂?Bug | 娓叉煋鎴栦氦浜掑紓甯?| 鎷嗗垎鍓嶅悗鎴浘瀵规瘮楠岃瘉 |
| 鍝嶅簲寮忔敼鍔ㄥ奖鍝嶆闈㈢ | 妗岄潰绔竷灞€鍙樺寲 | 浣跨敤 min-width media query锛屾闈㈢浼樺厛 |

### 5.2 渚濊禆椤?

| 渚濊禆 | 璇存槑 |
|------|------|
| 涓嶆柊澧炲閮ㄤ緷璧?| i18n 鏂规鑷爺锛屼笉寮曞叆 vue-i18n |
| 鐜版湁 API 涓嶅彉 | 鎵€鏈変紭鍖栦粎娑夊強鍓嶇 UI锛屼笉淇敼 API 鎺ュ彛 |
| 娴忚鍣ㄥ吋瀹规€?| 鏈€浣庢敮鎸?Chrome 90+銆丒dge 90+銆丗irefox 90+ |

### 5.3 楠屾敹鎬绘爣鍑?

- [ ] 鍏ㄧ珯鎵€鏈夐〉闈㈤粯璁ゆ樉绀轰腑鏂囷紝鍙竴閿垏鎹㈣嫳鏂?
- [ ] 閰嶈壊浠呭惈榛戠櫧鐏颁笁绉嶉鑹诧紙璇箟鑹插強鍥捐〃/鍥剧墖闄ゅ锛?
- [ ] 椤甸潰闂磋瑙夐鏍肩粺涓€锛堟爣棰樸€佸崱鐗囥€佽〃鏍笺€侀棿璺濓級
- [x] 鏃犵紪璇戦敊璇€佹棤鎺у埗鍙版姤閿?
- [ ] 鎵€鏈夐〉闈㈠湪 1920px 鍜?768px 瀹藉害涓嬪竷灞€鍚堢悊
- [ ] Lighthouse Performance 鍒嗘暟 鈮?80
- [x] 鐜版湁娴嬭瘯鐢ㄤ緥鍏ㄩ儴閫氳繃

---

> **鏂囨。缁存姢**锛氶殢鐫€寮€鍙戞帹杩涳紝鍚勪换鍔″畬鎴愬悗鍦ㄥ搴旈獙鏀舵爣鍑嗗墠鎵撳嬀 `[x]`锛屽苟鍦ㄦ彁浜や俊鎭腑鍏宠仈浠诲姟缂栧彿锛堝 `fix: T02 淇 AppLayout 涔辩爜鏂囨湰`锛夈€?

