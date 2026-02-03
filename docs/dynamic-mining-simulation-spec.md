# MPI 动态开采模拟系统设计规范

**版本**: 1.0
**日期**: 2026-02-03
**状态**: 设计中

---

## 1. 系统概述

### 1.1 目标

在现有 MpiHeatmapPro 数值模拟系统基础上，增强为支持**方向控制和速度调节的动态开采模拟系统**，实现类似 UDEC 软件的动态视觉效果。

### 1.2 设计原则

- **渐进式增强**: 在现有代码基础上扩展，不破坏现有功能
- **性能优先**: 所有动画效果保持 60fps 流畅度
- **可扩展性**: 预留接口，未来可接入真实物理计算
- **学术风格**: 保持专业的数据可视化风格，避免过度装饰

---

## 2. 功能需求

### 2.1 核心功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| **推进方向控制** | 支持 0°-360° 任意角度的开采方向 | P0 |
| **播放速度调节** | 0.5x ~ 5x 播放速度，支持暂停/继续 | P0 |
| **进度拖动预览** | 拖动进度条时实时渲染对应状态 | P0 |
| **采空区动态渐变** | 根据开采进度展示塌陷程度变化 | P1 |
| **应力区脉动效果** | 前方应力区呼吸效果，表现压力集中 | P1 |
| **粒子流动效果** | 沿推进方向的微小粒子，表现应力传递 | P2 |
| **等值线动态变形** | 随开采进度产生的"挤压"效果 | P2 |

### 2.2 用户交互

```
┌─────────────────────────────────────────────────────────────┐
│  视图控制                                                    │
│  ├─ 煤层选择                                                 │
│  ├─ 网格精度                                                 │
│  └─ 图层叠加                                                 │
├─────────────────────────────────────────────────────────────┤
│  开采模拟控制 [新增]                                          │
│  ├─ 工作面选择                                               │
│  ├─ 推进方向: [0°] ━━━━━●━━━━━━ [360°]                    │
│  ├─ 推进距离: [50m] ━━━━━●━━━━━━ [500m]                   │
│  └─ 播放控制                                                 │
│      ├─ [⏮] [◀◀] [▶️/⏸] [▶▶] [⏭]                         │
│      ├─ 进度: [━━━━━━●━━━━━━] 45%                          │
│      └─ 速度: 0.5x | 1x | 2x | 5x                           │
├─────────────────────────────────────────────────────────────┤
│  实时数据面板                                                │
│  ├─ 当前推进距离: 225m                                       │
│  ├─ 采空区面积: 12,500 m²                                    │
│  ├─ 前方应力峰值: MPI 32.5 (高风险)                         │
│  └─ 预计剩余开采: 275m                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 技术架构

### 3.1 模块结构

```
frontend/src/
├── views/
│   └── MpiHeatmapPro.vue           # 主视图（扩展）
├── components/
│   ├── simulation/                 # [新增] 模拟组件目录
│   │   ├── MiningSimulator.vue    # 开采模拟核心组件
│   │   ├── DirectionControl.vue   # 方向控制组件
│   │   ├── PlaybackControls.vue   # 播放控制组件
│   │   ├── GoafRenderer.vue       # 采空区渲染器
│   │   ├── StressZoneRenderer.vue # 应力区渲染器
│   │   └── ParticleSystem.vue     # 粒子系统
│   └── ...
└── composables/
    ├── useMiningSimulation.js      # [新增] 模拟逻辑
    ├── useParticleSystem.js        # [新增] 粒子系统逻辑
    └── useAnimationLoop.js         # [新增] 动画循环
```

### 3.2 数据流

```
用户输入 → 状态管理 → 物理计算 → 渲染管线
    ↓           ↓           ↓           ↓
  方向角度   模拟状态    位置计算    Canvas绘制
  推进距离   播放状态    区域边界    粒子更新
  播放速度   时间步长    应力分布    等值线变形
```

---

## 4. 数据结构定义

### 4.1 模拟状态

```typescript
interface SimulationState {
  // 基础参数
  isPlaying: boolean          // 是否正在播放
  progress: number            // 当前进度 0-100
  direction: number           // 推进方向角度 0-360

  // 物理参数
  totalDistance: number       // 总推进距离 (m)
  currentDistance: number     // 当前已推进距离 (m)
  miningSpeed: number         // 开采速度 (m/day) - 预留

  // 动画参数
  playbackSpeed: number       // 播放速度倍率 0.5-5
  frameRate: number           // 目标帧率
  lastFrameTime: number       // 上一帧时间戳

  // 工作面
  activeWorkface: Workface | null
  workfaceBounds: Bounds      // 缓存的工作面边界

  // 计算缓存
  frontLine: LineSegment      // 当前工作面前线（线段）
  goafArea: Polygon           // 采空区多边形
  stressZone: Area            // 应力影响区
  reliefZone: Area            // 卸压区
}
```

### 4.2 几何类型

```typescript
interface Point {
  x: number
  y: number
}

interface LineSegment {
  start: Point
  end: Point
  angle: number    // 线段角度（弧度）
  length: number   // 线段长度
}

interface Polygon {
  points: Point[]  // 顶点列表，按顺序排列
}

interface Bounds {
  min_x: number
  max_x: number
  min_y: number
  max_y: number
}

interface Area {
  bounds: Bounds
  // 可扩展：强度分布、渐变参数等
}
```

### 4.3 粒子数据

```typescript
interface Particle {
  id: number
  x: number
  y: number
  vx: number        // 速度向量 X
  vy: number        // 速度向量 Y
  life: number      // 生命周期 0-1
  size: number      // 粒子大小
  type: 'stress' | 'relief' | 'deformation'
}
```

---

## 5. 核心算法

### 5.1 推进方向计算

```javascript
/**
 * 根据方向角度计算工作面前线位置
 * @param {Bounds} bounds - 工作面边界
 * @param {number} progress - 推进进度 0-100
 * @param {number} direction - 推进方向角度（度）
 * @returns {LineSegment} 当前工作面前线
 */
function calculateFrontLine(bounds, progress, direction) {
  const centerX = (bounds.min_x + bounds.max_x) / 2
  const centerY = (bounds.min_y + bounds.max_y) / 2
  const workfaceLength = bounds.max_y - bounds.min_y

  // 计算推进向量（角度转换为弧度）
  const angleRad = (direction - 90) * Math.PI / 180
  const distance = (bounds.max_x - bounds.min_x) * (progress / 100)

  // 前线中心点
  const frontCenterX = centerX + Math.cos(angleRad) * distance
  const frontCenterY = centerY + Math.sin(angleRad) * distance

  // 前线垂直于推进方向
  const perpAngle = angleRad + Math.PI / 2

  return {
    start: {
      x: frontCenterX - Math.cos(perpAngle) * (workfaceLength / 2),
      y: frontCenterY - Math.sin(perpAngle) * (workfaceLength / 2)
    },
    end: {
      x: frontCenterX + Math.cos(perpAngle) * (workfaceLength / 2),
      y: frontCenterY + Math.sin(perpAngle) * (workfaceLength / 2)
    },
    angle: perpAngle,
    length: workfaceLength
  }
}
```

### 5.2 采空区多边形计算

```javascript
/**
 * 计算采空区多边形
 * @param {Bounds} initialBounds - 初始工作面边界
 * @param {LineSegment} frontLine - 当前前线
 * @param {number} direction - 推进方向
 * @returns {Polygon} 采空区多边形
 */
function calculateGoafArea(initialBounds, frontLine, direction) {
  const angleRad = direction * Math.PI / 180

  // 采空区由以下点组成：
  // 1. 初始工作面后方边界
  // 2. 当前前线
  // 3. 两侧边界线

  const backLeft = rotatePoint(
    { x: initialBounds.min_x, y: initialBounds.max_y },
    { x: initialBounds.min_x, y: initialBounds.min_y },
    angleRad
  )

  // ... 完整的多边形计算逻辑

  return {
    points: [ /* 多边形顶点 */ ]
  }
}
```

### 5.3 动画循环

```javascript
/**
 * 主动画循环
 */
function animationLoop() {
  if (!state.isPlaying) return

  const now = performance.now()
  const deltaTime = now - state.lastFrameTime
  state.lastFrameTime = now

  // 根据播放速度计算进度增量
  const progressDelta = (deltaTime / 1000) * state.playbackSpeed * PROGRESS_PER_SECOND
  state.progress = Math.min(100, state.progress + progressDelta)

  // 更新所有计算
  updateSimulationState()

  // 渲染
  renderDynamicLayer()
  renderParticles()

  // 循环
  if (state.progress < 100) {
    requestAnimationFrame(animationLoop)
  } else {
    state.isPlaying = false
  }
}
```

---

## 6. 视觉效果规格

### 6.1 采空区效果

| 阶段 | 视觉表现 | 实现方式 |
|------|----------|----------|
| 初期采空 | 深灰色 rgba(40, 40, 40, 0.8) | 纯色填充 |
| 中期采空 | 灰色渐变 + 边缘模糊 | 径向渐变 |
| 大面积采空 | 渐变 + 纹理叠加 | 噪声纹理 |

```javascript
// 采空区渲染伪代码
function renderGoaf(ctx, goafArea, progress) {
  const gradient = ctx.createRadialGradient(
    goafCenter.x, goafCenter.y, 0,
    goafCenter.x, goafCenter.y, goafRadius
  )

  if (progress < 30) {
    gradient.addColorStop(0, 'rgba(40, 40, 40, 0.85)')
    gradient.addColorStop(1, 'rgba(40, 40, 40, 0.85)')
  } else if (progress < 70) {
    gradient.addColorStop(0, 'rgba(50, 50, 50, 0.8)')
    gradient.addColorStop(0.7, 'rgba(60, 60, 60, 0.75)')
    gradient.addColorStop(1, 'rgba(40, 40, 40, 0.85)')
  } else {
    // 大面积采空：添加塌陷纹理
    gradient.addColorStop(0, 'rgba(45, 45, 45, 0.75)')
    gradient.addColorStop(1, 'rgba(35, 35, 35, 0.85)')
    addCollapseTexture(ctx, goafArea)
  }

  ctx.fillStyle = gradient
  ctx.fill(goafArea)
}
```

### 6.2 应力区脉动效果

```javascript
// 呼吸效果：透明度周期变化
const pulsePhase = (Date.now() / 1000) % PULSE_PERIOD // 2秒周期
const pulseIntensity = 0.6 + 0.2 * Math.sin(pulsePhase * Math.PI * 2)

const stressGradient = ctx.createLinearGradient(...)
stressGradient.addColorStop(0, `rgba(239, 68, 68, ${pulseIntensity})`)
stressGradient.addColorStop(1, `rgba(239, 68, 68, 0)`)
```

### 6.3 粒子系统

**粒子类型**：
1. **应力粒子**: 红色，从工作面前沿向前方扩散
2. **卸压粒子**: 蓝色，从工作面向后方消散
3. **形变粒子**: 黄色小点，表现岩层微小变形

**粒子行为**：
- 产生速率：每帧 5-10 个粒子
- 生命周期：1-3 秒
- 运动方向：沿推进方向 ±30° 扇形
- 速度变化：逐渐减速

```javascript
function updateParticles(deltaTime) {
  particles.forEach(p => {
    if (p.type === 'stress') {
      // 应力粒子向前扩散并逐渐消失
      p.x += p.vx * deltaTime
      p.y += p.vy * deltaTime
      p.life -= deltaTime / PARTICLE_LIFETIME
    }
    // ... 其他类型粒子
  })

  // 移除死亡粒子
  particles = particles.filter(p => p.life > 0)
}
```

---

## 7. 组件设计

### 7.1 MiningSimulator.vue

核心模拟组件，整合所有模拟逻辑。

**Props**:
```typescript
{
  workface: Workface           // 活动工作面
  bounds: Bounds               // 数据边界
  gridSize: { width, height }  // 网格尺寸
}
```

**Emits**:
```typescript
{
  'progress-change': (progress: number) => void
  'state-change': (state: SimulationState) => void
}
```

**Slots**:
```vue
<template #default="{ state, controls }">
  <!-- 自定义渲染内容 -->
</template>
```

### 7.2 DirectionControl.vue

方向控制组件，圆形旋钮式交互。

**UI 设计**:
```
      0° (北)
       │
       │
270° ──●── 90°  (东)
       │
       │
     180° (南)
```

### 7.3 PlaybackControls.vue

播放控制组件，包含播放按钮和进度条。

**UI 设计**:
```
┌────────────────────────────────────────────────────┐
│  ⏮  │  ◀◀  │  ▶️/⏸  │  ▶▶  │  ⏭  │             │
├────────────────────────────────────────────────────┤
│  Progress:  ░░░░░░░░░░░░░░░░░░ 45%                 │
├────────────────────────────────────────────────────┤
│  Speed: [0.5x] [1x] [2x] [5x]                       │
└────────────────────────────────────────────────────┘
```

---

## 8. API 接口设计

### 8.1 未来扩展接口

```typescript
// 后端计算接口（预留）
interface MiningSimulationAPI {
  // 计算指定进度的应力分布
  calculateStressAtProgress(params: {
    seam: string
    workfaceId: string
    progress: number
    direction: number
  }): Promise<StressGrid>

  // 获取关键节点的预计算数据
  getKeyFrames(params: {
    seam: string
    workfaceId: string
    steps: number[]  // 如 [0, 25, 50, 75, 100]
  }): Promise<KeyFrameData[]>
}
```

### 8.2 前端状态管理

```typescript
// composable/useMiningSimulation.js
export function useMiningSimulation() {
  const state = reactive<SimulationState>({
    isPlaying: false,
    progress: 0,
    direction: 0,
    // ...
  })

  const controls = {
    play: () => { /* ... */ },
    pause: () => { /* ... */ },
    seek: (progress: number) => { /* ... */ },
    setDirection: (angle: number) => { /* ... */ },
    setSpeed: (speed: number) => { /* ... */ }
  }

  return { state, controls }
}
```

---

## 9. 开发计划

### Phase 1: 基础方向控制 (1-2天)
- [ ] 创建 simulation 组件目录
- [ ] 实现方向角度控制 UI
- [ ] 修改 `simulateMiningEffect` 支持方向参数
- [ ] 实现前线线段方向计算

### Phase 2: 播放控制增强 (1天)
- [ ] 重构播放/暂停逻辑
- [ ] 实现播放速度调节
- [ ] 优化进度拖动响应

### Phase 3: 视觉效果增强 (2-3天)
- [ ] 采空区渐变效果
- [ ] 应力区脉动效果
- [ ] 基础粒子系统

### Phase 4: 数据面板 (1天)
- [ ] 实时数据展示组件
- [ ] 计算并显示统计信息

### Phase 5: 优化与测试 (1天)
- [ ] 性能优化
- [ ] 兼容性测试
- [ ] 文档完善

---

## 10. 性能考虑

### 10.1 渲染优化

- 使用 **requestAnimationFrame** 控制动画帧率
- 粒子系统使用 **对象池** 减少垃圾回收
- 大量绘制时使用 **离屏 Canvas** 缓存

### 10.2 计算优化

- 几何计算结果缓存，避免重复计算
- 使用 **Web Worker** 进行复杂计算（未来扩展）

### 10.3 内存管理

```javascript
// 粒子对象池
const particlePool = []
const MAX_PARTICLES = 500

function acquireParticle() {
  return particlePool.pop() || createNewParticle()
}

function releaseParticle(p) {
  if (particlePool.length < MAX_PARTICLES) {
    particlePool.push(p)
  }
}
```

---

## 11. 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Canvas 2D | ✅ | ✅ | ✅ | ✅ |
| requestAnimationFrame | ✅ | ✅ | ✅ | ✅ |
| ES6+ | ✅ | ✅ | ✅ | ✅ |

最低要求：现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

---

## 12. 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| 1.0 | 2026-02-03 | 初始设计文档 | Claude |

---

## 附录 A: 参考资源

- UDEC 用户手册（数值模拟软件参考）
- D3.js 力导向图算法（应力传递可视化）
- Canvas 2D 最佳实践
- Vue 3 Composition API 指南

## 附录 B: 术语表

| 术语 | 英文 | 解释 |
|------|------|------|
| 采空区 | Goaf | 煤层开采后形成的空洞区域 |
| 工作面 | Workface/Face | 正在进行开采作业的场所 |
| 应力区 | Stress Zone | 工作面前方的应力集中区域 |
| 卸压区 | Relief Zone | 采空区后方压力释放的区域 |
| 推进度 | Advance | 工作面向前推进的距离 |
