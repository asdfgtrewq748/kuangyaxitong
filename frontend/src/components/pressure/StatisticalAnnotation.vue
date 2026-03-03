<template>
  <div class="statistical-annotation">
    <!-- 显著性标注层 -->
    <svg 
      v-if="annotations.length"
      class="annotation-layer"
      :width="width"
      :height="height"
      :style="{ left: margin.left + 'px', top: margin.top + 'px' }"
    >
      <!-- 连接线 -->
      <g v-for="(anno, i) in annotations" :key="`line-${i}`">
        <line
          :x1="anno.x1"
          :y1="anno.y"
          :x2="anno.x2"
          :y2="anno.y"
          stroke="#333"
          stroke-width="1"
        />
        <!-- 竖线 -->
        <line
          v-for="x in [anno.x1, anno.x2]"
          :key="x"
          :x1="x"
          :y1="anno.y"
          :x2="x"
          :y2="anno.y + 5"
          stroke="#333"
          stroke-width="1"
        />
      </g>
      
      <!-- 显著性标记 -->
      <text
        v-for="(anno, i) in annotations"
        :key="`text-${i}`"
        :x="(anno.x1 + anno.x2) / 2"
        :y="anno.y - 2"
        text-anchor="middle"
        font-size="12"
        fill="#333"
      >{{ anno.symbol }}</text>
    </svg>
    
    <!-- 统计信息面板 -->
    <div v-if="showPanel" class="stats-panel">
      <h4>统计检验结果</h4>
      <div v-for="(result, i) in testResults" :key="i" class="test-result">
        <div class="test-name">{{ result.name }}</div>
        <div class="test-value">
          <span :class="{ significant: result.significant }">
            p = {{ result.pValue.toExponential(2) }}
          </span>
          <span v-if="result.significant" class="sig-marker">*</span>
        </div>
        <div v-if="result.effectSize" class="effect-size">
          效应量: {{ result.effectSize.toFixed(3) }}
        </div>
      </div>
      <div class="sig-legend">
        <span>* p &lt; 0.05</span>
        <span>** p &lt; 0.01</span>
        <span>*** p &lt; 0.001</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 测试数据组 [{ name: string, values: number[] }]
  groups: {
    type: Array,
    required: true
  },
  // 图表尺寸
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 400
  },
  margin: {
    type: Object,
    default: () => ({ top: 20, right: 20, bottom: 40, left: 60 })
  },
  // 数据到坐标的转换函数
  xScale: {
    type: Function,
    required: true
  },
  yScale: {
    type: Function,
    required: true
  },
  // 组位置（柱状图中心x坐标）
  groupPositions: {
    type: Array,
    default: () => []
  },
  showPanel: {
    type: Boolean,
    default: true
  }
})

// 执行统计检验
const testResults = computed(() => {
  const results = []
  
  if (props.groups.length >= 2) {
    // 两两t检验
    for (let i = 0; i < props.groups.length; i++) {
      for (let j = i + 1; j < props.groups.length; j++) {
        const result = performTTest(props.groups[i].values, props.groups[j].values)
        results.push({
          name: `${props.groups[i].name} vs ${props.groups[j].name}`,
          groups: [i, j],
          ...result
        })
      }
    }
  }
  
  return results
})

// 生成显著性标注
const annotations = computed(() => {
  const annos = []
  const baseY = Math.min(...props.groups.map(g => 
    Math.min(...g.values)
  ))
  const yOffset = props.yScale(baseY) - 20
  
  let currentY = yOffset
  
  for (const result of testResults.value) {
    if (result.significant) {
      const [i, j] = result.groups
      const x1 = props.xScale(props.groupPositions[i] || i)
      const x2 = props.xScale(props.groupPositions[j] || j)
      
      annos.push({
        x1: x1 - 15,
        x2: x2 + 15,
        y: currentY,
        symbol: getSignificanceSymbol(result.pValue),
        pValue: result.pValue
      })
      
      currentY -= 20 // 下一个标注向上偏移
    }
  }
  
  return annos
})

function getSignificanceSymbol(p) {
  if (p < 0.001) return '***'
  if (p < 0.01) return '**'
  if (p < 0.05) return '*'
  return 'ns'
}

// 简化的t检验实现
function performTTest(sample1, sample2) {
  const n1 = sample1.length
  const n2 = sample2.length
  
  const mean1 = sample1.reduce((a, b) => a + b, 0) / n1
  const mean2 = sample2.reduce((a, b) => a + b, 0) / n2
  
  const var1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1)
  const var2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1)
  
  const pooledSD = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2))
  const se = pooledSD * Math.sqrt(1/n1 + 1/n2)
  const t = (mean1 - mean2) / se
  
  // 简化的p值计算（使用正态近似）
  const df = n1 + n2 - 2
  const pValue = 2 * (1 - normalCDF(Math.abs(t) * Math.sqrt(df / (df + t * t))))
  
  // Cohen's d
  const effectSize = (mean1 - mean2) / pooledSD
  
  return {
    t,
    df,
    pValue,
    significant: pValue < 0.05,
    effectSize: Math.abs(effectSize)
  }
}

function normalCDF(x) {
  return 0.5 * (1 + Math.erf(x / Math.sqrt(2)))
}
</script>

<style scoped>
.statistical-annotation {
  position: relative;
}

.annotation-layer {
  position: absolute;
  pointer-events: none;
}

.stats-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  max-width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-panel h4 {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
}

.test-result {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.test-result:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.test-name {
  font-weight: 500;
  color: #555;
  margin-bottom: 2px;
}

.test-value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.significant {
  color: #d32f2f;
  font-weight: 600;
}

.sig-marker {
  color: #d32f2f;
  font-weight: bold;
}

.effect-size {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.sig-legend {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #666;
}
</style>
