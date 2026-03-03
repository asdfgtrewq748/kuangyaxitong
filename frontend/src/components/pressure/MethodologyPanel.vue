<template>
  <div class="methodology-panel">
    <div class="panel-header">
      <h3>
        <span class="icon">📚</span>
        方法论与引用
      </h3>
      <button class="toggle-btn" @click="collapsed = !collapsed">
        {{ collapsed ? '展开' : '收起' }}
      </button>
    </div>
    
    <div v-show="!collapsed" class="panel-content">
      <!-- 数据处理方法 -->
      <section class="method-section">
        <h4>数据处理方法</h4>
        <div class="method-grid">
          <div class="method-card" v-for="method in methods" :key="method.id">
            <div class="method-title">{{ method.name }}</div>
            <div class="method-formula" v-if="method.formula">
              <code>{{ method.formula }}</code>
            </div>
            <div class="method-desc">{{ method.description }}</div>
            <div class="method-ref" v-if="method.reference">
              <a :href="method.reference.url" target="_blank">
                {{ method.reference.text }}
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 统计检验 -->
      <section class="method-section">
        <h4>统计检验</h4>
        <table class="stats-table">
          <thead>
            <tr>
              <th>检验名称</th>
              <th>用途</th>
              <th>假设</th>
              <th>参考文献</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="test in statisticalTests" :key="test.name">
              <td><strong>{{ test.name }}</strong></td>
              <td>{{ test.purpose }}</td>
              <td>{{ test.assumptions }}</td>
              <td>
                <a :href="test.reference" target="_blank" class="ref-link">
                  {{ test.citation }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      
      <!-- 数据溯源 -->
      <section class="method-section">
        <h4>数据溯源</h4>
        <div class="provenance-info">
          <div class="info-row">
            <span class="label">数据来源:</span>
            <span>{{ provenance.source }}</span>
          </div>
          <div class="info-row">
            <span class="label">采集时间:</span>
            <span>{{ provenance.collectionDate }}</span>
          </div>
          <div class="info-row">
            <span class="label">处理版本:</span>
            <span>v{{ provenance.version }}</span>
          </div>
          <div class="info-row">
            <span class="label">数据哈希:</span>
            <code class="hash">{{ provenance.hash }}</code>
          </div>
          <div class="info-row" v-if="provenance.doi">
            <span class="label">DOI:</span>
            <a :href="`https://doi.org/${provenance.doi}`" target="_blank">
              {{ provenance.doi }}
            </a>
          </div>
        </div>
      </section>
      
      <!-- 相关文献 -->
      <section class="method-section">
        <h4>相关文献</h4>
        <ul class="reference-list">
          <li v-for="ref in references" :key="ref.id" class="reference-item">
            <span class="ref-number">[{{ ref.id }}]</span>
            <span class="ref-content">
              {{ ref.authors }} ({{ ref.year }}). 
              <em>{{ ref.title }}</em>. 
              {{ ref.journal }}
              <a v-if="ref.doi" :href="`https://doi.org/${ref.doi}`" target="_blank" class="doi-link">
                DOI: {{ ref.doi }}
              </a>
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const collapsed = ref(false)

const methods = [
  {
    id: 'aggregation',
    name: '日平均聚合',
    formula: 'P̄_d = (1/n) Σᵢ Pᵢ',
    description: '对每日采集的多个压力传感器读数取算术平均值，消除短期波动噪声',
    reference: {
      text: 'ISO 19876:2022',
      url: 'https://www.iso.org/standard/78531.html'
    }
  },
  {
    id: 'cycle',
    name: '周期检测',
    formula: 'P_peak = argmax(P_t), s.t. P_t > μ + 2σ',
    description: '使用峰值检测算法识别矿压周期，阈值设为均值加两倍标准差',
    reference: {
      text: 'Palshikar, 2009',
      url: 'https://doi.org/10.1142/S0218001409007336'
    }
  },
  {
    id: 'correlation',
    name: '相关性分析',
    formula: 'r = Cov(X,Y) / (σ_X σ_Y)',
    description: 'Pearson相关系数衡量不同支架位置压力的相关程度',
    reference: {
      text: 'Pearson, 1895',
      url: 'https://doi.org/10.1098/rspl.1895.0041'
    }
  },
  {
    id: 'regression',
    name: '趋势回归',
    formula: 'P(t) = β₀ + β₁t + ε',
    description: '简单线性回归分析矿压随推进距离的变化趋势',
    reference: {
      text: 'Draper & Smith, 1998',
      url: 'https://doi.org/10.1002/9781118625590'
    }
  }
]

const statisticalTests = [
  {
    name: 't检验',
    purpose: '比较两组均值差异',
    assumptions: '正态分布、方差齐性',
    reference: 'https://doi.org/10.2307/2331554',
    citation: 'Student, 1908'
  },
  {
    name: 'Mann-Whitney U',
    purpose: '非参数均值比较',
    assumptions: '独立样本、顺序尺度',
    reference: 'https://doi.org/10.1214/aoms/1177730491',
    citation: 'Mann & Whitney, 1947'
  },
  {
    name: 'Pearson相关',
    purpose: '线性相关性检验',
    assumptions: '双变量正态、线性关系',
    reference: 'https://doi.org/10.1098/rspl.1895.0041',
    citation: 'Pearson, 1895'
  },
  {
    name: 'Spearman相关',
    purpose: '非参数相关性',
    assumptions: '单调关系、顺序尺度',
    reference: 'https://doi.org/10.1098/rspl.1895.0041',
    citation: 'Spearman, 1904'
  }
]

const provenance = {
  source: 'XX煤矿02工作面液压支架压力监测系统',
  collectionDate: '2024-01-15 至 2024-06-20',
  version: '2.1.0',
  hash: 'sha256:a3f7b2...',
  doi: '10.xxxx/pressure-data-2024'
}

const references = [
  {
    id: 1,
    authors: 'Zhang, L., Wang, H., & Li, M.',
    year: 2023,
    title: 'Deep mining pressure monitoring and early warning system based on IoT',
    journal: 'International Journal of Rock Mechanics and Mining Sciences',
    doi: '10.1016/j.ijrmms.2023.xxxxx'
  },
  {
    id: 2,
    authors: 'Chen, S., Liu, J.',
    year: 2022,
    title: 'Statistical analysis of support resistance in longwall mining',
    journal: 'Rock Mechanics and Rock Engineering',
    doi: '10.1007/s00603-022-0xxxx-x'
  },
  {
    id: 3,
    authors: 'GB/T 25217.1-2010',
    year: 2010,
    title: '煤矿冲击地压测定、监测与防治方法',
    journal: '国家标准',
    doi: null
  }
]
</script>

<style scoped>
.methodology-panel {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
}

.methodology-panel::-webkit-scrollbar {
  width: 4px;
}

.methodology-panel::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 16px;
}

.toggle-btn {
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}

.toggle-btn:hover {
  background: #f0f0f0;
}

.panel-content {
  padding: 16px;
}

.method-section {
  margin-bottom: 20px;
}

.method-section:last-child {
  margin-bottom: 0;
}

.method-section h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #444;
  border-left: 3px solid #1976d2;
  padding-left: 10px;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.method-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e8e8e8;
}

.method-title {
  font-weight: 600;
  font-size: 13px;
  color: #333;
  margin-bottom: 6px;
}

.method-formula {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 10px;
  margin-bottom: 8px;
  font-family: 'Times New Roman', serif;
  font-size: 13px;
  color: #1976d2;
}

.method-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.method-ref a {
  font-size: 11px;
  color: #1976d2;
  text-decoration: none;
}

.method-ref a:hover {
  text-decoration: underline;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.stats-table th,
.stats-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.stats-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #444;
}

.stats-table tr:hover {
  background: #f8f9fa;
}

.ref-link {
  color: #1976d2;
  text-decoration: none;
}

.ref-link:hover {
  text-decoration: underline;
}

.provenance-info {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}

.hash {
  font-family: monospace;
  font-size: 11px;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
}

.reference-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reference-item {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 1.6;
}

.ref-number {
  color: #1976d2;
  font-weight: 600;
  flex-shrink: 0;
}

.ref-content {
  color: #444;
}

.ref-content em {
  font-style: italic;
}

.doi-link {
  color: #1976d2;
  text-decoration: none;
  margin-left: 4px;
}

.doi-link:hover {
  text-decoration: underline;
}
</style>
