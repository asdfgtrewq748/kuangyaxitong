<!--
  ColorLegend - 颜色图例组件

  用于展示热力图等可视化组件的颜色图例

  特性：
  - 支持渐变色条
  - 支持离散颜色块
  - 支持垂直/水平方向
  - 支持自定义标签
-->

<template>
  <div class="color-legend" :class="[`direction-${direction}`, `type-${type}`]">
    <!-- 标题 -->
    <div v-if="title" class="legend-title">{{ title }}</div>

    <!-- 图例主体 -->
    <div class="legend-body">
      <!-- 渐变类型 -->
      <template v-if="type === 'gradient'">
        <div class="legend-gradient" :style="gradientStyle">
          <span
            v-for="(label, index) in labels"
            :key="index"
            class="legend-label"
            :style="labelStyle(index)"
          >
            {{ label }}
          </span>
        </div>
      </template>

      <!-- 离散类型 -->
      <template v-else-if="type === 'discrete'">
        <div class="legend-discrete">
          <div
            v-for="(item, index) in discreteItems"
            :key="index"
            class="legend-item"
          >
            <div
              class="legend-color"
              :style="{ background: item.color }"
            ></div>
            <span class="legend-label">{{ item.label }}</span>
          </div>
        </div>
      </template>

      <!-- 分级类型 -->
      <template v-else-if="type === 'classes'">
        <div class="legend-classes">
          <div
            v-for="(item, index) in classItems"
            :key="index"
            class="legend-class"
            :style="{ background: item.color }"
          >
            <span class="class-label">{{ item.label }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 单位 -->
    <div v-if="unit" class="legend-unit">{{ unit }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 类型：gradient | discrete | classes
  type: {
    type: String,
    default: 'gradient',
    validator: (v) => ['gradient', 'discrete', 'classes'].includes(v)
  },

  // 方向：horizontal | vertical
  direction: {
    type: String,
    default: 'horizontal',
    validator: (v) => ['horizontal', 'vertical'].includes(v)
  },

  // 标题
  title: String,

  // 单位
  unit: String,

  // 渐变色彩（gradient 类型）
  gradient: {
    type: String,
    default: 'linear-gradient(90deg, #0e7490, #14b8a6, #84cc16, #facc15, #fb923c, #dc2626)'
  },

  // 标签（gradient 类型）
  labels: {
    type: Array,
    default: () => ['低', '', '', '', '', '高']
  },

  // 离散项（discrete 类型）
  discreteItems: {
    type: Array,
    default: () => []
  },

  // 分级项（classes 类型）
  classItems: {
    type: Array,
    default: () => []
  }
})

// 渐变样式
const gradientStyle = computed(() => {
  if (props.direction === 'horizontal') {
    return { background: props.gradient }
  }
  return {
    background: props.gradient.replace('90deg', '180deg')
  }
})

// 标签位置
function labelStyle(index) {
  const total = props.labels.length - 1
  const position = (index / total) * 100

  if (props.direction === 'horizontal') {
    return {
      left: `${position}%`,
      transform: 'translateX(-50%)'
    }
  }
  return {
    top: `${position}%`,
    transform: 'translateY(-50%)'
  }
}
</script>

<style scoped>
.color-legend {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.legend-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.legend-body {
  position: relative;
}

/* 水平方向 */
.direction-horizontal {
  /* 默认 */
}

.direction-horizontal .legend-gradient {
  height: 24px;
  position: relative;
  border-radius: var(--radius-sm);
}

.direction-horizontal .legend-label {
  position: absolute;
  top: 100%;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* 垂直方向 */
.direction-vertical {
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-3);
}

.direction-vertical .legend-gradient {
  width: 24px;
  height: 200px;
  position: relative;
  border-radius: var(--radius-sm);
}

.direction-vertical .legend-label {
  position: absolute;
  right: 100%;
  margin-right: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* Discrete 类型 */
.legend-discrete {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.direction-horizontal .legend-discrete {
  flex-direction: row;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.legend-item .legend-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

/* Classes 类型 */
.legend-classes {
  display: flex;
  flex-direction: column;
}

.direction-horizontal .legend-classes {
  flex-direction: row;
}

.legend-class {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: white;
  font-weight: var(--font-weight-medium);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.direction-horizontal .legend-class {
  flex: 1;
}

.class-label {
  position: relative;
  z-index: 1;
}

/* 单位 */
.legend-unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: right;
}
</style>
