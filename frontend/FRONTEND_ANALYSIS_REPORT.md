# 鍓嶇浠ｇ爜鍏ㄩ潰鍒嗘瀽鎶ュ憡

> 鐢熸垚鏃堕棿锛?025 骞?7 鏈? 
> 鑼冨洿锛歚frontend/src/` 鍏ㄩ儴 `.vue`銆乣.js`銆乣.css` 鏂囦欢

---

## 鐩綍

0. [褰撳墠鎵ц杩涘害锛?026-02-28锛塢(#0-褰撳墠鎵ц杩涘害2026-02-28)
1. [椤圭洰姒傝](#1-椤圭洰姒傝)
2. [璇█闂锛堜腑鑻辨枃娣风敤锛塢(#2-璇█闂涓嫳鏂囨贩鐢?
3. [棰滆壊浣撶郴涓庨厤鑹查棶棰榏(#3-棰滆壊浣撶郴涓庨厤鑹查棶棰?
4. [甯冨眬涓庢牱寮忔灦鏋刔(#4-甯冨眬涓庢牱寮忔灦鏋?
5. [UI/UX 闂](#5-uiux-闂)
6. [缁勪欢璐ㄩ噺涓庢灦鏋刔(#6-缁勪欢璐ㄩ噺涓庢灦鏋?
7. [绗笁鏂逛緷璧栧垎鏋怾(#7-绗笁鏂逛緷璧栧垎鏋?
8. [鍙闂€э紙Accessibility锛夐棶棰榏(#8-鍙闂€ccessibility闂)
9. [鍝嶅簲寮忚璁(#9-鍝嶅簲寮忚璁?
10. [涓ラ噸 BUG 娓呭崟](#10-涓ラ噸-bug-娓呭崟)
11. [浼樺寲寤鸿姹囨€籡(#11-浼樺寲寤鸿姹囨€?

---

## 0. 褰撳墠鎵ц杩涘害锛?026-02-28锛?

| 浠诲姟 | 鐘舵€?| 澶囨敞 |
|---|---|---|
| T20 鍏ㄥ眬绌虹姸鎬佺粍浠?| 閮ㄥ垎瀹屾垚 | 宸插湪 `ResearchPortal.vue`銆乣GeoMpiStudio.vue`銆乣Scene3DPage.vue`銆乣ResearchWorkbench.vue`銆乣Report.vue` 鎺ュ叆 |
| T21 楠ㄦ灦灞?Loading | 閮ㄥ垎瀹屾垚 | 宸插湪 `ResearchPortal.vue`銆乣AcademicAlgorithm.vue`銆乣GeoMpiStudio.vue`銆乣Scene3DPage.vue`銆乣ResearchWorkbench.vue`銆乣Report.vue` 鎺ュ叆 |
| T22 AiSearchBar 浜嬩欢娉勬紡 | 宸插畬鎴?| 浜嬩欢鐩戝惉宸叉垚瀵规竻鐞?|
| T23 LRU 缂撳瓨闄愬埗 | 宸插畬鎴?| 澶氬缂撳瓨宸插垏鎹负 LRU 骞惰缃閲忎笂闄?|
| T24 璺敱绾т唬鐮佸垎鍓?| 宸插畬鎴?| 璺敱 chunk 鍛藉悕涓庢墜鍔ㄥ垎鍖呯敓鏁?|
| T25 澶у瀷鍥捐〃鎳掑姞杞?| 宸插畬鎴?| `AcademicAlgorithm` 宸插紓姝ユ媶鍒嗗姞杞?|
| T26 铏氭嫙鍒楄〃闃堝€艰皟浼?| 宸插畬鎴?| 鍚敤闃堝€煎凡璋冧负 `>= 50` |
| T27 鍝嶅簲寮忔柇鐐硅ˉ鍏?| 宸插畬鎴?| 宸插畬鎴?12 璺敱 脳 5 鏂偣鑷姩鍖栧璁★紙鏃犳按骞虫孩鍑猴級 |
| T28 键盘导航与 ARIA | 已完成 | `axe-core` 自动审计通过（critical=0, serious=0），归档 `data/research/stage_e/ui_accessibility/20260228T153205/` |
| T29 瑙︽帶鎵嬪娍鏀寔 | 宸插畬鎴?| 鏍稿績鐢诲竷宸叉敮鎸佹嫋鎷姐€佺缉鏀惧強闃叉粴鍔ㄥ啿绐?|

---

## 1. 椤圭洰姒傝

| 缁村害 | 璇︽儏 |
|---|---|
| 妗嗘灦 | Vue 3.4.34 + Composition API (`<script setup>`) |
| 鐘舵€佺鐞?| Pinia 3.0.4锛? 涓?store锛?|
| 璺敱 | Vue Router 4.6.4锛?2 鏉¤矾鐢憋紝鍏ㄩ儴鎳掑姞杞斤級 |
| 鏋勫缓宸ュ叿 | Vite 5.4.2 |
| UI 妗嗘灦 | **鏃?*锛堢函鎵嬪啓 CSS锛屾棤 Tailwind / Element UI / Vuetify锛?|
| 鍙鍖?| d3銆丒Charts 6.0銆乀hree.js 0.182 |
| 鍏朵粬渚濊禆 | axios銆並aTeX銆丣SZip |
| 璇█鏍囪 | `<html lang="zh-CN">`锛岄」鐩悕 `mining-pressure-frontend` |

### 鏂囦欢娓呭崟

| 绫诲瀷 | 鏁伴噺 | 璇存槑 |
|---|---|---|
| 瑙嗗浘锛圴iews锛?| 16 | 鏈€澶ф枃浠?AcademicAlgorithm.vue = 3715 琛?|
| 缁勪欢锛圕omponents锛?| 43 | 鍚?library/銆乻imulation/銆乿alidation/ 瀛愮洰褰?|
| 缁勫悎寮忓嚱鏁帮紙Composables锛?| 9 | useToast銆乽seViewport銆乽seParticles 绛?|
| Store | 4 | useAppStore銆乽seDataStore銆乽seUIStore銆乽seCacheStore |
| 鍏ㄥ眬鏍峰紡 | 2 | style.css (689琛?銆乨esign-tokens.css (312琛? |
| API 灞?| 1 | api.js (369琛岋紝鍚嚜瀹氫箟 LRU 缂撳瓨) |

---

## 2. 璇█闂锛堜腑鑻辨枃娣风敤锛?

### 2.1 涔辩爜锛圡ojibake锛夆€?馃敶 涓ラ噸

`AppLayout.vue` 涓瓨鍦ㄥぇ閲?**UTF-8 缂栫爜閿欒**锛圙B2312/GBK 琚敊璇В鐮佷负 UTF-8锛夛紝瀵艰嚧 `title` 鍜?`aria-label` 灞炴€ф樉绀轰贡鐮侊細

| 琛屽彿 | 涔辩爜鏂囨湰 | 鎺ㄦ祴鏈剰 |
|---|---|---|
| `layouts/AppLayout.vue` L30 | `濞翠胶鈻兼潻娑樺` | "娴佺▼杩涘害" |
| `layouts/AppLayout.vue` L36-37 | `瑜版挸澧犻悡銈呯湴` | "褰撳墠鐓ゅ眰" |
| `layouts/AppLayout.vue` L46-47 | `閸撳秴绶歚 | "鍓嶅線" |
| `layouts/AppLayout.vue` L54 | `閸撳秴绶氶幒銊ㄥ礃濮濄儵` | "鍓嶅線鎺ㄨ崘姝ラ" |
| `layouts/AppLayout.vue` L59-60 | `闁插秶鐤嗗ù浣衡柤` | "閲嶇疆娴佺▼" |
| `layouts/AppLayout.vue` L67 | `闁插秶鐤嗗ù浣衡柤` | "閲嶇疆娴佺▼" |
| `layouts/AppLayout.vue` L83-84 | `濮濄儵 ${index + 1}` | "姝ラ ${index + 1}" |
| `layouts/AppLayout.vue` L108-109 | `閸撳秴绶氶崜宥囩枂濮濄儵` | "鍓嶅線鍓嶇疆姝ラ" |

**褰卞搷**锛氱敤鎴峰湪 tooltip 鍜屽睆骞曢槄璇诲櫒涓湅鍒扮殑鍏ㄦ槸涔辩爜銆?

### 2.2 瀹屽叏鑻辨枃鐨勯〉闈?鈥?鈿狅笍 涓嶄竴鑷?

浠ヤ笅椤甸潰 UI 鏂囨湰鍑犱箮 **鍏ㄩ儴涓鸿嫳鏂?*锛屼笌鍏朵綑涓枃椤甸潰椋庢牸鍓茶锛?

| 鏂囦欢 | 鑻辨枃绀轰緥 |
|---|---|
| `views/GeoMpiStudio.vue` | "Geology and MPI Spatial Studio"銆?Control Panel"銆?Run Spatial Analysis"銆?Export Snapshot"銆?Baseline"銆?Geo-aware"銆?Delta" |
| `views/ResearchPortal.vue` | "RESEARCH FRONTEND"銆?MPI Research Portal"銆?Quick Actions"銆?Experiment Leaderboard"銆?Manuscripts & Gate Reports"銆?Gates PASS/BLOCKED" |
| `views/Scene3DPage.vue` | "3D Workspace" 鐪夋爣涓鸿嫳鏂?|
| `views/GeomodelVisualization.vue` | "Geological Modeling & Visualization" |

### 2.3 涓嫳娣锋潅鐨勯〉闈?

| 鏂囦欢 | 鍏蜂綋浣嶇疆 | 鑻辨枃鍐呭 |
|---|---|---|
| `views/AcademicAlgorithm.vue` | SVG 鏍囩銆佸壇鏍囬 | "Academic Algorithm Demonstration Platform"銆?Intact 鈫?Fractured"銆?Burial Depth H (m)"銆?Low Risk / Medium / High Risk"銆?Phase-Field Fracture"銆?Moment Tensor Inversion" |
| `views/AlgorithmValidation.vue` | 鎸囨爣鏍囩銆乼rust chip | "AUC"銆?PR-AUC"銆?F1"銆?Brier"銆?ECE"銆?Geology-aware 瀵圭収"銆?TP 鐪熼槼鎬? |
| `views/Interpolation.vue` | 鎻掑€兼柟娉曚笅鎷?| "Kriging"銆?IDW"銆?Linear"銆?Nearest" |
| `views/ResearchWorkbench.vue` | 琛ㄥ崟鏍囩銆佺姸鎬佹爣绛?| "dataset_id"銆?label_column"銆乻tatus pills 涓鸿嫳鏂?|

### 2.4 寤鸿

1. **绔嬪嵆淇** AppLayout.vue 涔辩爜锛氶噸鏂拌緭鍏ユ纭殑涓枃瀛楃涓层€?
2. **缁熶竴璇█**锛氭墍鏈夐潰鍚戠敤鎴风殑鏂囨湰浣跨敤涓枃锛堟垨寮曞叆 vue-i18n 鍋氬弻璇敮鎸侊級锛屾妧鏈湳璇 "Kriging"銆?AUC" 鍙繚鐣欒嫳鏂囦絾鍔犱腑鏂囨敞閲娿€?
3. GeoMpiStudio銆丷esearchPortal 闇€涓枃鍖栫炕璇戙€?

---

## 3. 棰滆壊浣撶郴涓庨厤鑹查棶棰?

### 3.1 鍙岄噸 CSS 鍙橀噺瀹氫箟 鈥?馃敶 涓ラ噸鍐茬獊

`style.css` 鍜?`design-tokens.css` **鍚屾椂瀹氫箟浜嗗悓鍚嶅彉閲忎絾鍊间笉鍚?*锛?

| 鍙橀噺鍚?| style.css 鍊?| design-tokens.css 鍊?|
|---|---|---|
| `--color-primary` | `#0d9488` | `#0f766e` |
| `--color-success` | `#15803d` | `#22c55e` |
| `--bg-primary` | `#ffffff` | `#f8fafc` |
| `--text-primary` | `#1e293b` | `#0f172a` |
| `--text-secondary` | `#64748b` | `#475569` |
| `--border-color` | `#e2e8f0` | / |
| `--shadow-sm` | 涓嶅悓鍊?| 涓嶅悓鍊?|

**鍚庢灉**锛欳SS 鍙橀噺鏈€缁堝€煎彇鍐充簬鏍峰紡琛ㄥ姞杞介『搴忥紝瀵艰嚧鍏ㄧ珯棰滆壊涓嶄竴鑷淬€俙main.js` 涓厛瀵煎叆 `style.css` 鍐嶅鍏?`design-tokens.css`锛屾墍浠?`design-tokens.css` 浼氳鐩?`style.css`锛屼絾涓よ€呬腑鍚勬湁鐙湁鍙橀噺锛屽舰鎴愪氦鍙変緷璧栥€?

### 3.2 纭紪鐮侀鑹?鈥?鈿狅笍 澶ч噺鍒嗘暎

浠ヤ笅鏂囦欢澶ч噺浣跨敤 **鍐呰仈纭紪鐮佸崄鍏繘鍒堕鑹插€?* 鑰屼笉浣跨敤 CSS 鍙橀噺锛?

| 鏂囦欢 | 纭紪鐮侀鑹叉暟閲?| 鍏稿瀷绀轰緥 |
|---|---|---|
| `views/MpiAlgorithm.vue` | 30+ | `#22c55e`銆乣#f59e0b`銆乣#ef4444`銆乣#0f766e`銆乣#e2e8f0`銆乣#64748b`銆乣#fff` |
| `views/AlgorithmValidation.vue` | 60+ | `#0f172a`銆乣#1f2937`銆乣#f8fafc`銆乣#065f46`銆乣#ecfdf5`銆乣#a7f3d0`銆乣#fca5a5`銆乣#991b1b`... |
| `views/AcademicAlgorithm.vue` | 澶?| SVG fill 鍜屽唴鑱?style 涓ぇ閲忛鑹?|
| `components/AiSearchBar.vue` | 15+ | `#e0e0e0`銆乣#667eea`銆乣#f8f8ff`銆乣#333` |

### 3.3 閰嶈壊鏂规鎬荤粨

椤圭洰鏁翠綋閲囩敤 **闈掔豢鑹?Teal)** 涓轰富鑹茶皟锛?

- 涓昏壊锛歚#0f766e` (Teal 700)
- 杈呰壊锛歚#0e7490` (Cyan 700)
- 鎴愬姛锛歚#22c55e` (Green 500) / `#15803d` (Green 700)
- 璀﹀憡锛歚#f59e0b` (Amber 500)
- 鍗遍櫓锛歚#ef4444` (Red 500) / `#b91c1c` (Red 700)
- 涓€х伆锛歋late 绯诲垪 (`#0f172a` ~ `#f8fafc`)

棰滆壊閫夋嫨鍩烘湰閬靛惊 Tailwind CSS 鑹叉澘瑙勮寖锛屼絾鐢变簬缁曡繃浜?Tailwind 鐩存帴纭紪鐮侊紝瀵艰嚧鍚屼竴璇箟棰滆壊鍦ㄤ笉鍚屾枃浠朵腑鏈?**寰鍙樹綋**锛堝 success 鍦ㄤ笉鍚屽湴鏂规槸 `#15803d` 鎴?`#22c55e`锛夈€?

### 3.4 鏆楄壊妯″紡

`design-tokens.css` 涓€氳繃 `@media (prefers-color-scheme: dark)` 瀹氫箟浜嗘殫鑹叉ā寮忓彉閲忥紝浣嗭細
- 澶ч噺缁勪欢浣跨敤纭紪鐮侀鑹?`#fff`銆乣#f8fafc`锛屾殫鑹叉ā寮忎笅鏃犳硶鐢熸晥銆?
- 鏆楄壊鍒囨崲閫昏緫鍦?`useAppStore.js` 涓紙鏀寔 light/dark/system锛夛紝浣嗙粍浠剁骇鏈粺涓€浣跨敤 CSS 鍙橀噺銆?

---

## 4. 甯冨眬涓庢牱寮忔灦鏋?

### 4.1 鍏ㄥ眬甯冨眬

- **AppLayout.vue** (670琛?锛氬浐瀹?88px 瀹戒晶杈规爮锛堝浘鏍囧鑸級+ 椤堕儴娴佺▼杩涘害鏉?+ 鍐呭鍖?
- 渚ц竟鏍忎娇鐢?`position: fixed`锛屽唴瀹瑰尯閫氳繃 `margin-left: 88px` 鍋忕Щ
- 娴佺▼鏉★紙workflow strip锛夋樉绀?5 涓楠ゆ寜閽?+ 杩涘害鐧惧垎姣?
- AI 鎼滅储鏍忓浐瀹氬湪鍙充笅瑙掞紙`position: fixed; bottom: 24px; right: 24px`锛?

### 4.2 鏍峰紡缁勭粐鏂瑰紡

| 鏂瑰紡 | 浣跨敤鎯呭喌 |
|---|---|
| CSS 鍙橀噺 | `design-tokens.css` 瀹氫箟浜嗗畬鏁寸殑 token 浣撶郴锛堥鑹层€侀棿璺濄€佸瓧浣撱€侀槾褰便€亃-index銆佽繃娓★級 |
| `<style scoped>` | 鎵€鏈?`.vue` 鏂囦欢閮戒娇鐢?scoped 鏍峰紡 |
| 鍏ㄥ眬鏍峰紡 | `style.css` 瀹氫箟浜嗗熀纭€缁勪欢鏍峰紡锛?card銆?btn銆?table銆乼oast銆乥adge銆乬rid锛?|
| 鍐呰仈 style | 澶ч噺 JS 璁＄畻鏍峰紡閫氳繃 `:style` 缁戝畾锛圕anvas 缁樺浘銆佸姩鎬佸畾浣嶃€佹笎鍙樿壊锛?|

### 4.3 CSS 璁捐绯荤粺

`design-tokens.css` 璁捐浜嗕竴濂楄緝瀹屾暣鐨?token 绯荤粺锛?
- 5 绾ч棿璺濓紙xs=4px ~ xl=32px锛?
- 4 绾у渾瑙掞紙sm=6px ~ full=9999px锛?
- 4 绾ч槾褰?
- 4 绾?z-index锛坉ropdown=1000 鈫?tooltip=3000锛?
- 3 绾ц繃娓℃椂闂?
- 鐑姏鍥捐壊闃讹紙7 绾ф笎鍙橈級

浣?**瀹為檯浣跨敤鐜囦笉楂?*锛屽ぇ閲忕粍浠剁洿鎺ュ啓鍍忕礌鍊煎拰棰滆壊鍊笺€?

### 4.4 瀛椾綋

```css
font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
```

- 涓枃浼樺厛瀛椾綋閫夋嫨鍚堢悊
- 閮ㄥ垎缁勪欢棰濆浣跨敤 `'JetBrains Mono', monospace`锛堟暟鎹睍绀猴級鍜?`'Times New Roman', serif`锛堝鏈暟鍊硷級
- 鈿狅笍 鏈紩鍏?Web Font锛屼緷璧栫郴缁熷瓧浣?

---

## 5. UI/UX 闂

### 5.1 鍗曟枃浠惰繃澶?鈥?馃敶

| 鏂囦欢 | 琛屾暟 | 闂 |
|---|---|---|
| `AcademicAlgorithm.vue` | 3715 | 鏋佸叾搴炲ぇ锛屽簲鎷嗗垎涓哄涓瓙缁勪欢 |
| `MpiHeatmapPro.vue` | 2426 | 鍖呭惈绮掑瓙鍔ㄧ敾銆佹挱鏀炬帶鍒躲€佹暟鎹潰鏉?|
| `Interpolation.vue` | 2276 | 鍖呭惈绛夊€肩嚎鍥俱€佺洿鏂瑰浘銆佹煴鐘跺浘銆佹埅闈㈠浘銆佷笉纭畾鎬у浘 |
| `MpiAlgorithm.vue` | 2168 | 绠楁硶鍘熺悊灞曠ず |
| `ResearchWorkbench.vue` | 1860 | 鏁版嵁闆嗙鐞?+ 瀹為獙绠＄悊 |

**寤鸿**锛氳秴杩?500 琛岀殑 Vue 鏂囦欢搴旀媶鍒嗐€傚凡鏈夌殑 `validation/` 瀛愮洰褰曟ā寮忥紙7 涓瓙缁勪欢锛夋槸鑹ソ瀹炶返锛屽簲鎺ㄥ箍鍒板叾浠栧ぇ鏂囦欢銆?

### 5.2 Toast 缁勪欢閲嶅

瀛樺湪 **涓や釜** Toast 瀹炵幇锛?
- `src/components/Toast.vue` 鈥?鍏ㄥ眬浣跨敤锛圓ppLayout 涓紩鐢級
- `src/components/library/feedback/Toast.vue` 鈥?缁勪欢搴撶増鏈?

**寤鸿**锛氱粺涓€涓轰竴涓疄鐜般€?

### 5.3 API 缂撳瓨閲嶅

- `api.js` 涓嚜瀹氫箟浜?`ApiCache` 绫伙紙LRU锛屽閲?100锛?
- `useCacheStore.js` 涓篃瀹炵幇浜嗗甫 TTL 鐨勭紦瀛?store

涓ゅ缂撳瓨閫昏緫鐙珛杩愯锛屽彲鑳藉鑷村唴瀛樻氮璐瑰拰鏁版嵁涓嶄竴鑷淬€?

### 5.4 SVG 璺緞閿欒

`HealthCheck.vue` 涓殑 SVG 璺緞鏄庢樉涓嶅悎娉曪細
```html
<path d="M16 8v-4h4a1 1 4-4h4a1 1 4-4h4" />
<path d="M21 12 12l-6a1 1 4-4h4a1 1 4-4" />
```
杩欎簺璺緞璇硶閿欒锛屼笉浼氭覆鏌撳嚭浠讳綍鏈夋剰涔夌殑鍥惧舰銆?

### 5.5 浜嬩欢鐩戝惉鍣ㄦ湭娓呯悊

`AiSearchBar.vue` 鍦?`onMounted` 涓坊鍔犱簡 `window.addEventListener('ai-search', ...)` 浣?**娌℃湁鍦?`onUnmounted` 涓Щ闄?*锛岄€犳垚鍐呭瓨娉勬紡銆?

---

## 6. 缁勪欢璐ㄩ噺涓庢灦鏋?

### 6.1 缁勪欢搴撹璁★紙鑹ソ瀹炶返 鉁咃級

`src/components/library/` 鍏锋湁娓呮櫚鐨勫垎灞傜粨鏋勶細

```
library/
鈹溾攢鈹€ controls/     鈫?Toolbar, FilterPanel, Viewer3DToolbar
鈹溾攢鈹€ data/         鈫?DataTable, StatCard
鈹溾攢鈹€ feedback/     鈫?LoadingState, Toast, ConfirmDialog
鈹溾攢鈹€ layout/       鈫?SidePanel, FormPanel
鈹斺攢鈹€ visualization/ 鈫?ColorLegend, ChartContainer
```

閫氳繃 `index.js` 缁熶竴瀵煎嚭锛屼娇鐢ㄦ柟寮忚鑼冦€?

### 6.2 Composable 璁捐锛堣壇濂藉疄璺?鉁咃級

9 涓粍鍚堝紡鍑芥暟鑱岃矗娓呮櫚锛?
- `useToast` 鈥?鍏ㄥ眬 Toast 閫氱煡锛坧rovide/inject 妯″紡锛?
- `useViewport` 鈥?2D 鐢诲竷瑙嗗彛鎺у埗锛堢缉鏀俱€佸钩绉伙級
- `useWorkspaceFlow` 鈥?宸ヤ綔娴佺姸鎬佹寔涔呭寲锛坙ocalStorage + debounce锛?
- `useMiningSimulation` 鈥?妯℃嫙鏁版嵁鍜屽姩鐢?
- `useParticles` 鈥?绮掑瓙鏁堟灉
- `useIndicatorCanvas` 鈥?Canvas 缁樺浘閫昏緫
- `useGeomodelJob` 鈥?鍦拌川寤烘ā浠诲姟绠＄悊
- `useGeoMpiData` 鈥?绌洪棿鏁版嵁鑾峰彇
- `useGeoMpiStudioState` 鈥?Studio 椤甸潰鐘舵€?

### 6.3 Store 鏋舵瀯锛堝熀鏈悎鐞?鉁咃級

| Store | 鑱岃矗 | 鎸佷箙鍖?|
|---|---|---|
| `useAppStore` | 涓婚銆佽瑷€銆佺敤鎴蜂俊鎭€佸叏灞€ loading | localStorage |
| `useDataStore` | 褰撳墠鐓ゅ眰/浠诲姟/瀹為獙閫夋嫨銆佺叅灞傚垪琛ㄣ€佹暟鎹紦瀛?| 鏃?|
| `useUIStore` | 渚ц竟鏍忕姸鎬併€佹帶鍒堕潰鏉裤€佹ā鎬佹銆乀oast銆佸伐鍏锋爮 | 鏃?|
| `useCacheStore` | 閫氱敤 TTL 缂撳瓨 + 娓呯悊 + 缁熻 | 鏃?|

### 6.4 TypeScript 浣跨敤涓嶄竴鑷?

- 浠?2 涓枃浠朵娇鐢?`<script setup lang="ts">`锛歚AiChatSidebar.vue`銆乣AiSearchBar.vue`
- 鍏朵綑 **鎵€鏈?40+ 涓?.vue 鏂囦欢鍜?.js 鏂囦欢** 浣跨敤绾?JavaScript
- **寤鸿**锛氱粺涓€杩佺Щ鍒?TypeScript 鎴栫粺涓€鍥為€€鍒?JS锛屼笉瑕佹贩鐢?

---

## 7. 绗笁鏂逛緷璧栧垎鏋?

| 渚濊禆 | 鐗堟湰 | 鐢ㄩ€?| 璇勪及 |
|---|---|---|---|
| vue | 3.4.34 | 鏍稿績妗嗘灦 | 鉁?褰撳墠绋冲畾鐗?|
| pinia | 3.0.4 | 鐘舵€佺鐞?| 鉁?瀹樻柟鎺ㄨ崘 |
| vue-router | 4.6.4 | 璺敱 | 鉁?|
| axios | 1.8.4 | HTTP 璇锋眰 | 鉁?|
| d3 | 7.9.0 | 鏁版嵁鍙鍖?| 鈿狅笍 鍏ㄩ噺寮曞叆锛宐undle 杈冨ぇ |
| echarts | 6.0.0 | 鍥捐〃 | 鈿狅笍 鏈寜闇€寮曞叆 |
| three | 0.182.0 | 3D 娓叉煋 | 鈿狅笍 杈冨ぇ渚濊禆锛屼粎 2 涓〉闈娇鐢?|
| katex | 0.16.22 | 鏁板鍏紡 | 鉁?瀛︽湳鍦烘櫙闇€瑕?|
| jszip | 3.10.1 | ZIP 鎵撳寘 | 鉁?|

**鍖呬綋绉闄?*锛歞3 + echarts + three.js 涓夎€?**鍚堣绾?2~3 MB**锛堟湭鍘嬬缉锛夛紝瀵归灞忓姞杞藉奖鍝嶆樉钁椼€傝矾鐢卞凡鍋氭噿鍔犺浇锛屼絾杩欎簺澶т緷璧栧鏋滃湪澶氫釜 chunk 涓寮曠敤锛宼ree-shaking 鏁堟灉鏈夐檺銆?

**鏃?UI 妗嗘灦**锛氶」鐩€夋嫨瀹屽叏鎵嬪啓 CSS锛屼紭鐐规槸鏃犻澶栦緷璧栵紝缂虹偣鏄己涔忎竴鑷寸殑璁捐璇█鍜岀粍浠惰鑼冿紝寮€鍙戞晥鐜囪緝浣庛€?

---

## 8. 鍙闂€э紙Accessibility锛夐棶棰?

### 8.1 涔辩爜 aria-label 鈥?馃敶 鑷村懡

濡?搂2.1 鎵€杩帮紝`AppLayout.vue` 涓墍鏈?`aria-label` 灞炴€у€煎潎涓轰贡鐮侊紝灞忓箷闃呰鍣ㄧ敤鎴峰畬鍏ㄦ棤娉曚娇鐢ㄥ伐浣滄祦瀵艰埅銆?

### 8.2 棰滆壊瀵规瘮搴︿笉瓒?

澶氬娴呰壊鏂囨湰鍦ㄦ祬鑹茶儗鏅笂瀵规瘮搴︿笉瓒筹細
- `#64748b` (Slate 500) 鍦?`#fff` 鑳屾櫙涓婄殑瀵规瘮搴︾害 4.6:1锛屽浜庡皬鍙锋枃瀛楋紙12px锛夋湭杈惧埌 WCAG AA 鏍囧噯鐨?4.5:1 鏈€灏忚姹傦紙姝ｆ枃闇€ 7:1 绾у埆鎵嶈兘淇濊瘉鍙鎬э級
- `#475569` (Slate 600) 鍦?`#f8fafc` 鑳屾櫙涓婄殑瀵规瘮搴︾害 7:1锛岄€氳繃

### 8.3 缂哄皯 ARIA 瑙掕壊鍜屾爣绛?

- 澶氭暟浜や簰寮忓厓绱犵己灏?`role` 灞炴€?
- Canvas 缁樺埗鐨勭儹鍔涘浘銆佺瓑鍊肩嚎鍥俱€佹贩娣嗙煩闃电瓑 **瀹屽叏涓嶅彲璁块棶**锛堟棤 alt text銆佹棤 aria 鎻忚堪锛?
- 鑷畾涔変笅鎷夐€夋嫨鍣ㄦ湭瀹炵幇閿洏瀵艰埅

### 8.4 鐒︾偣绠＄悊

- 妯℃€佹锛圓I 鑱婂ぉ渚ц竟鏍忥級鎵撳紑鏃舵湭 trap focus
- Tab 閿鑸『搴忓湪鏌愪簺椤甸潰涓嶅悎鐞嗭紙鍥哄畾瀹氫綅鍏冪礌骞叉壈锛?

---

## 9. 鍝嶅簲寮忚璁?

### 9.1 鏂偣瀹氫箟

`AppLayout.vue` 涓畾涔変簡涓や釜涓昏鏂偣锛?
- `@media (max-width: 768px)`锛氫晶杈规爮闅愯棌锛屽唴瀹瑰尯鍏ㄥ
- `@media (max-width: 1100px)`锛氶儴鍒嗗竷灞€璋冩暣

### 9.2 瀛樺湪鐨勯棶棰?

| 闂 | 鏂囦欢 | 璇存槑 |
|---|---|---|
| 鍥哄畾瀹藉害 | `AppLayout.vue` | 渚ц竟鏍忓浐瀹?88px锛屽皬灞忎笅鍙€氳繃 `showSidebar` 鎺у埗闅愯棌 |
| Canvas 涓嶈嚜閫傚簲 | 澶氫釜瑙嗗浘 | `HeatmapCanvas`銆乣AlgorithmValidation` 涓?Canvas 浣跨敤鍥哄畾灏哄鎴?JS 璁＄畻灏哄锛屼絾鏈洃鍚?`resize` 浜嬩欢 |
| 澶嶆潅甯冨眬鏂 | `AlgorithmValidation.vue` | 澶氶潰鏉垮竷灞€鍦ㄧ獎灞忎笅鏈彁渚涙浛浠ｆ帓鍒楁柟妗?|
| 缁濆瀹氫綅鍏冪礌 | `AlgorithmValidation.vue` L1329 | `.floating-panel` 浣跨敤 `position: absolute; right: 16px; width: 360px`锛岀獎灞忎笅鍙兘婧㈠嚭 |
| Grid 甯冨眬 | `style.css` | 瀹氫箟浜?`.cols-2`/`.cols-3` 绛?grid 绫伙紝浣跨敤浜?`minmax(0, 1fr)` 鍚堢悊锛屼絾澶ч儴鍒嗚鍥炬湭浣跨敤鍏ㄥ眬 grid 绫?|

### 9.3 绉诲姩绔敮鎸?

椤圭洰涓昏闈㈠悜 **妗岄潰绔?*锛堢熆鍘嬭瘎浠风郴缁熺殑涓撲笟宸ュ叿锛夛紝绉诲姩绔€傞厤涓烘瑕侀渶姹傘€傚綋鍓嶅熀鏈彲鐢ㄤ絾闈炰紭鍏堢骇銆?

---

## 10. 涓ラ噸 BUG 娓呭崟

### BUG-1锛欻ealthCheck.vue 澶氬璇硶閿欒 馃敶

**鏂囦欢**锛歚views/HealthCheck.vue`

| 琛屽彿 | 閿欒 | 璇存槑 |
|---|---|---|
| L10 | `</header>` 澶氫簡涓€涓?`</div>` 鍓嶇殑闂悎 | `</div></header>` 瀵艰嚧 DOM 缁撴瀯閿欒 |
| L28 | 澶氫綑鐨?`</div>` | error-state div 鍙岄噸鍏抽棴 |
| L42 | 澶氫綑鐨?`</div>` | success-state div 鍙岄噸鍏抽棴 |
| L49 | `import { useHead } from 'vue-router'` | `useHead` 涓嶆槸 `vue-router` 鐨勫鍑猴紝搴旀潵鑷?`@vueuse/head` 鎴?`unhead` |
| L51 | `const router = useRouter()` | `useRouter` 鏈鍏?|
| L52 | `const route = useRoute()` | `useRoute` 鏈鍏?|
| L90 | `onBeforeUnmount` | 鏈鍏ワ紝涓旂己灏戦棴鍚堢殑 `})` 鍜?`</script>` 鏍囩鐨勫畬鏁撮棴鍚?|
| 鍏ㄦ枃 | SVG path 璇硶閿欒 | 澶氫釜 `<path d="...">` 涓嶅悎娉?|

**璇ユ枃浠跺綋鍓嶆棤娉曟甯哥紪璇戣繍琛屻€?*

### BUG-2锛欰ppLayout.vue 涔辩爜 馃敶

濡?搂2.1 璇﹁堪锛屾墍鏈?`title` 鍜?`aria-label` 灞炴€ф樉绀?mojibake銆?

### BUG-3锛欰iSearchBar.vue 浜嬩欢鐩戝惉娉勬紡 鈿狅笍

`onMounted` 涓敞鍐屼簡 `window.addEventListener('ai-search', handleSearchFromChat)` 浣嗙粍浠舵病鏈夊湪 `onUnmounted` 涓Щ闄よ鐩戝惉鍣ㄣ€?

### BUG-4锛欳SS 鍙橀噺鍐茬獊 鈿狅笍

`style.css` 鍜?`design-tokens.css` 瀹氫箟浜嗗悓鍚嶄絾涓嶅悓鍊肩殑 CSS 鍙橀噺锛堣 搂3.1锛夛紝瀹為檯鍝釜鐢熸晥鍙栧喅浜庡姞杞介『搴忥紝鍙兘瀵艰嚧瑙嗚涓嶄竴鑷淬€?

---

## 11. 浼樺寲寤鸿姹囨€?

### 楂樹紭鍏堢骇锛堢珛鍗充慨澶嶏級

| # | 寤鸿 | 褰卞搷鑼冨洿 |
|---|---|---|
| 1 | **淇 HealthCheck.vue 璇硶閿欒**锛氫慨姝?HTML 缁撴瀯銆佽ˉ鍏?import銆佷慨澶?SVG path | 椤甸潰鏃犳硶娓叉煋 |
| 2 | **淇 AppLayout.vue 涔辩爜**锛氬皢鎵€鏈変贡鐮佸瓧绗︿覆鏇挎崲涓烘纭腑鏂?| 鍏ㄥ眬瀵艰埅涓嶅彲璇?|
| 3 | **鍚堝苟 CSS 鍙橀噺绯荤粺**锛氱粺涓€ style.css 鍜?design-tokens.css锛屾秷闄ら噸澶嶅畾涔?| 鍏ㄧ珯棰滆壊涓€鑷存€?|
| 4 | **淇 AiSearchBar.vue 浜嬩欢娉勬紡**锛氭坊鍔?`onUnmounted` 绉婚櫎浜嬩欢鐩戝惉鍣?| 鍐呭瓨娉勬紡 |

### 涓紭鍏堢骇锛堣繎鏈熶紭鍖栵級

| # | 寤鸿 | 褰卞搷鑼冨洿 |
|---|---|---|
| 5 | **缁熶竴 UI 璇█**锛欸eoMpiStudio銆丷esearchPortal 绛夐〉闈㈢炕璇戜负涓枃锛屾垨寮曞叆 vue-i18n | 鐢ㄦ埛浣撻獙涓€鑷存€?|
| 6 | **鎷嗗垎澶ф枃浠?*锛欰cademicAlgorithm (3715琛?銆丮piHeatmapPro (2426琛? 绛夋媶鍒嗕负瀛愮粍浠?| 鍙淮鎶ゆ€?|
| 7 | **娑堥櫎纭紪鐮侀鑹?*锛氭彁鍙栨墍鏈夊唴鑱?`#hex` 鍊间负 CSS 鍙橀噺 | 涓婚涓€鑷存€?& 鏆楄壊妯″紡鏀寔 |
| 8 | **缁熶竴 Toast 瀹炵幇**锛氬悎骞朵袱涓?Toast 缁勪欢 | 浠ｇ爜閲嶅 |
| 9 | **鍚堝苟缂撳瓨閫昏緫**锛氱粺涓€ ApiCache 鍜?useCacheStore | 鏋舵瀯娓呮櫚搴?|

### 浣庝紭鍏堢骇锛堥暱鏈熸敼杩涳級

| # | 寤鸿 | 褰卞搷鑼冨洿 |
|---|---|---|
| 10 | **缁熶竴 TypeScript/JavaScript**锛氳涔堝叏闈㈣縼绉?TS锛岃涔堢Щ闄?2 涓?TS 鏂囦欢涓殑绫诲瀷娉ㄨВ | 浠ｇ爜涓€鑷存€?|
| 11 | **鎸夐渶寮曞叆 d3/echarts**锛氫娇鐢?tree-shaking 鍙嬪ソ鐨勫鍏ユ柟寮忓噺灏?bundle | 鎬ц兘 |
| 12 | **瀹屽杽 Canvas 鍙闂€?*锛氫负鐑姏鍥俱€佺瓑鍊肩嚎鍥剧瓑娣诲姞 aria 鎻忚堪 | 鏃犻殰纰嶈闂?|
| 13 | **鏀瑰杽鍝嶅簲寮?*锛氫负澶嶆潅闈㈡澘甯冨眬娣诲姞绉诲姩绔€傞厤鏂规 | 璺ㄨ澶囦綋楠?|
| 14 | **寮曞叆 ESLint + Prettier**锛氱粺涓€浠ｇ爜椋庢牸 | 鍥㈤槦鍗忎綔 |
| 15 | **鑰冭檻寮曞叆 UI 妗嗘灦**锛堝 Naive UI / Element Plus锛夋垨 Tailwind CSS锛屽噺灏戞墜鍐?CSS 閲?| 寮€鍙戞晥鐜?|

---

## 闄勫綍锛氭枃浠惰鏁版瑙?

| 鏂囦欢 | 琛屾暟 |
|---|---|
| `views/AcademicAlgorithm.vue` | 3715 |
| `views/MpiHeatmapPro.vue` | 2426 |
| `views/Interpolation.vue` | 2276 |
| `views/MpiAlgorithm.vue` | 2168 |
| `views/ResearchWorkbench.vue` | 1860 |
| `views/DataImport.vue` | 1516 |
| `views/AlgorithmValidation.vue` | 1380 |
| `views/GeomodelVisualization.vue` | 1342 |
| `views/PressureIndex.vue` | 1214 |
| `views/MpiHeatmap.vue` | 1192 |
| `views/Report.vue` | 1165 |
| `views/Steps.vue` | 1078 |
| `layouts/AppLayout.vue` | 670 |
| `views/ResearchPortal.vue` | 618 |
| `views/Scene3DPage.vue` | 402 |
| `views/GeoMpiStudio.vue` | 341 |
| `views/HealthCheck.vue` | ~200 |
| `style.css` | 689 |
| `api.js` | 369 |
| `design-tokens.css` | 312 |

