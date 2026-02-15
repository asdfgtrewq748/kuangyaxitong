# 3D 交互功能技术方案

**项目**: 地质建模系统 - 3D 交互功能
**日期**: 2026-02-15
**状态**: 设计阶段

---

## 1. 功能概述

为地质建模可视化页面添加专业的 3D 交互功能，提升科研人员的分析能力。

### 核心功能

#### 1.1 视角控制
- **自由视角**: 六自由度相机（旋转、缩放、平移）
- **预设视角**: 俯视、前视、侧视、等轴视图
- **视角切换**: 平滑过渡动画

#### 1.2 测量工具
- **距离测量**: 测量两点之间的 3D 距离
- **面积测量**: 测量多边形面积
- **角度测量**: 测量三点角度
- **体积测量**: 测量封闭区域的体积

#### 1.3 剖切工具
- **X/Y/Z 轴剖切**: 沿三个轴向剖切模型
- **动态剖切**: 实时调整剖切位置
- **显示剖切面**: 高亮显示剖切面

#### 1.4 标注系统
- **文字标注**: 添加文字标签
- **标记点**: 添加位置标记
- **箭头**: 添加指向箭头
- **标注管理**: 查看、编辑、删除标注

#### 1.5 快照与对比
- **场景快照**: 保存当前视角和状态
- **快照对比**: 并排对比多个快照
- **导出功能**: 导出截图和数据

---

## 2. 技术实现

### 2.1 组件架构

```
GeomodelVisualization (页面)
├── Viewer3DToolbar (工具栏)
│   ├── 视角控制
│   ├── 测量工具
│   ├── 剖切工具
│   ├── 标注工具
│   └── 导出功能
│
└── GeomodelViewer (3D 查看器)
    ├── Three.js 场景
    ├── 相机控制
    ├── 渲染循环
    └── 交互处理
```

### 2.2 Viewer3DToolbar 组件

**已完成**: UI 层实现

**文件**: `frontend/src/components/library/controls/Viewer3DToolbar.vue`

**功能**:
- ✅ 视角切换按钮（俯视、前视、侧视、等轴）
- ✅ 测量工具按钮（距离、面积、角度）
- ✅ 剖切工具（X/Y/Z 轴）
- ✅ 标注工具（文字、标记、箭头）
- ✅ 快照和导出功能
- ✅ 清除按钮（测量、标注）

**使用示例**:
```vue
<Viewer3DToolbar
  @tool-change="handleToolChange"
  @preset-view="setPresetView"
  @clipping-change="handleClippingChange"
  @snapshot="captureSnapshot"
  @export-model="exportModel"
  @reset-view="resetView"
/>
```

### 2.3 Three.js 深度实现（待开发）

#### 2.3.1 相机控制增强

**当前状态**: 基础 OrbitControls

**目标**: 六自由度相机

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 10
controls.maxDistance = 500
controls.maxPolarAngle = Math.PI / 2
```

#### 2.3.2 剖切平面实现

**技术方案**: Three.js ClippingPlane

```javascript
import { clippingPlanes, GlobalClippingPlane } from 'three'

// 创建剖切平面
const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)

// 应用到渲染器
renderer.localClippingEnabled = true
renderer.clippingPlanes = [clipPlane]

// 在材质中启用剖切
material.clippingPlanes = [clipPlane]
```

**剖切控件**:
```javascript
function updateClipping(axis, value) {
  // value: 0-100 → 映射到模型边界
  const normal = new THREE.Vector3()
  const constant = 0

  if (axis === 'x') {
    normal.set(1, 0, 0)
    const min = bounds.min.x
    const max = bounds.max.x
    constant = min + (max - min) * (value / 100)
  }

  clipPlane.normal = normal
  clipPlane.constant = -constant
}
```

#### 2.3.3 测量工具实现

**距离测量**:
```javascript
class DistanceTool {
  constructor(scene) {
    this.scene = scene
    this.points = []
    this.line = null
    this.label = null
  }

  addPoint(point) {
    this.points.push(point.clone())

    if (this.points.length === 1) {
      // 第一个点，创建起始标记
      this.createMarker(point)
    } else if (this.points.length === 2) {
      // 第二个点，完成测量
      this.createLine()
      this.updateLabel()
    }
  }

  createMarker(point) {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const marker = new THREE.Mesh(geometry, material)
    marker.position.copy(point)
    this.scene.add(marker)
  }

  createLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points)
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
    this.line = new THREE.Line(geometry, material)
    this.scene.add(this.line)
  }

  updateLabel() {
    const distance = this.points[0].distanceTo(this.points[1])
    this.label = createLabel(`距离: ${distance.toFixed(2)}m`, this.points[1])
  }

  clear() {
    // 清除所有标记和线条
    this.points = []
    this.line && this.scene.remove(this.line)
    this.label && this.scene.remove(this.label)
  }
}
```

**Raycaster 点击拾取**:
```javascript
import { Raycaster } from 'three'

const raycaster = new Raycaster()
const mouse = new THREE.Vector2()

canvas.addEventListener('click', (event) => {
  // 转换鼠标坐标
  mouse.x = (event.clientX / canvas.width) * 2 - 1
  mouse.y = -(event.clientY / canvas.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  // 拾取模型表面点
  const intersects = raycaster.intersectObject(model, true)
  if (intersects.length > 0) {
    const point = intersects[0].point
    currentTool.addPoint(point)
  }
})
```

#### 2.3.4 标注系统实现

**CSS2DRenderer** (用于标注):

```javascript
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(container.offsetWidth, container.offsetHeight)
container.appendChild(labelRenderer.domElement)

// 创建 HTML 标注
function createAnnotation(text, position) {
  const div = document.createElement('div')
  div.className = 'annotation'
  div.textContent = text
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  div.style.padding = '8px 12px'
  div.style.borderRadius = '4px'
  div.style.color = 'white'

  const label = new CSS2DObject(div)
  label.position.copy(position)
  labelRenderer.add(label)

  return label
}
```

#### 2.3.5 快照功能实现

```javascript
function captureSnapshot() {
  // 1. 捕获当前状态
  const snapshot = {
    camera: camera.toJSON(),
    controls: {
      target: controls.target.clone(),
      position: controls.object.position.clone()
    },
    visibleLayers: Array.from(visibleLayers),
    annotations: annotations.map(a => ({
      position: a.position,
      text: a.element.textContent
    })),
    timestamp: Date.now()
  }

  // 2. 截图
  renderer.render(scene, camera)
  const dataURL = renderer.domElement.toDataURL('image/png')

  // 3. 保存
  snapshots.value.push({
    ...snapshot,
    screenshot: dataURL
  })

  return snapshot
}
```

---

## 3. 性能优化

### 3.1 LOD (Level of Detail)

```javascript
import { LOD } from 'three/examples/jsm/objects/LOD'

function createLODGeometry(geometry) {
  const high = geometry.clone()
  const medium = geometry.clone().scale(0.5)
  const low = geometry.clone().scale(0.25)

  const lod = new LOD(geometry, 10, 50, 200)
  lod.addLevel(high, 0)
  lod.addLevel(medium, 50)
  lod.addLevel(low, 150)

  return lod
}
```

### 3.2 视锥体裁剪

```javascript
scene.traverse((object) => {
  if (object.isMesh) {
    object.frustumCulled = true
  }
})
```

### 3.3 实例化渲染

```javascript
import { InstancedMesh } from 'three'

const geometry = new THREE.SphereGeometry(0.5, 16, 16)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const instancedMesh = new InstancedMesh(
  geometry,
  material,
  boreholes.length
)

// 设置每个实例的位置
boreholes.forEach((bh, index) => {
  const matrix = new THREE.Matrix4()
  matrix.setPosition(bh.x, bh.y, bh.z)
  instancedMesh.setMatrixAt(index, matrix)
})

scene.add(instancedMesh)
```

---

## 4. 实施优先级

### 阶段 1: UI 层（已完成 ✅）
- ✅ Viewer3DToolbar 组件
- ✅ 按钮布局和样式
- ✅ 事件接口定义

### 阶段 2: 基础 3D 交互（1-2 周）
- ⏳ 预设视角切换
- ⏳ 视角重置
- ⏳ 截屏功能

### 阶段 3: 测量工具（2-3 周）
- ⏳ 距离测量
- ⏳ Raycaster 点击拾取
- ⏳ 标注显示

### 阶段 4: 高级功能（3-4 周）
- ⏳ 剖切工具
- ⏳ 面积/体积测量
- ⏳ 标注管理
- ⏳ 快照对比

### 阶段 5: 性能优化（1 周）
- ⏳ LOD
- ⏳ 视锥体裁剪
- ⏳ 实例化渲染

---

## 5. 代码示例

### 5.1 集成 Viewer3DToolbar 到页面

```vue
<template>
  <div class="model-viewer-container">
    <!-- 3D 工具栏 -->
    <Viewer3DToolbar
      ref="toolbarRef"
      @tool-change="handleToolChange"
      @preset-view="setPresetView"
      @clipping-change="handleClippingChange"
      @snapshot="captureSnapshot"
      @export-model="exportModel"
      @reset-view="resetView"
    />

    <!-- 3D 画布 -->
    <GeomodelViewer
      ref="viewerRef"
      :modelData="modelData"
      :layers="layers"
      :boreholes="boreholes"
      :activeTool="activeTool"
      :clipping="clippingConfig"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Viewer3DToolbar } from '@/components/library'
import GeomodelViewer from '@/components/GeomodelViewer.vue'

const toolbarRef = ref(null)
const viewerRef = ref(null)
const activeTool = ref(null)
const clippingConfig = ref({
  enabled: false,
  axis: null,
  value: 50
})

function handleToolChange(tool) {
  activeTool.value = tool
}

function setPresetView(view) {
  viewerRef.value?.setPresetView(view)
}

function handleClippingChange(config) {
  clippingConfig.value = config
  viewerRef.value?.setClipping(config)
}
</script>
```

### 5.2 距离测量实现

```javascript
// 在 GeomodelViewer 组件中
import { Raycaster } from 'three'

const distanceTool = {
  points: [],
  line: null,
  markers: [],

  addPoint(point) {
    this.points.push(point)

    // 创建标记
    const marker = createMarker(point)
    this.markers.push(marker)
    scene.add(marker)

    // 如果有两个点，创建线条
    if (this.points.length === 2) {
      this.createLine()
      this.showDistance()
    }
  },

  createLine() {
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(this.points)

    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 2
    })

    this.line = new THREE.Line(geometry, material)
    scene.add(this.line)
  },

  showDistance() {
    const distance = this.points[0].distanceTo(this.points[1])
    console.log(`距离: ${distance.toFixed(2)}m`)
  },

  clear() {
    // 清除所有
    this.markers.forEach(m => scene.remove(m))
    if (this.line) scene.remove(this.line)
    this.points = []
    this.markers = []
    this.line = null
  }
}
```

---

## 6. 测试计划

### 6.1 单元测试
- 工具栏按钮事件触发
- 视角切换正确性
- 剖切位置计算

### 6.2 集成测试
- 工具栏与查看器通信
- 测量数据准确性
- 标注显示正确

### 6.3 性能测试
- 60fps 渲染帧率
- 大模型加载时间
- 内存占用

---

## 7. 参考资料

- Three.js 官方文档: https://threejs.org/docs/
- Three.js Examples: https://threejs.org/examples/
- OrbitControls: https://github.com mrdoob/three.js/blob/dev/examples/jsm/controls/OrbitControls.js
- CSS2DRenderer: https://github.com/mrdoob/three.js/blob/dev/examples/jsm/renderers/CSS2DRenderer.js

---

**下一步**: 开始实施阶段 2（基础 3D 交互）
