import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/data'
  },
  {
    path: '/data',
    name: 'DataImport',
    component: () => import('../views/DataImport.vue'),
    meta: { title: '数据导入', icon: '📁' }
  },
  {
    path: '/interpolation',
    name: 'Interpolation',
    component: () => import('../views/Interpolation.vue'),
    meta: { title: '插值分析', icon: '📊' }
  },
  {
    path: '/pressure',
    name: 'PressureIndex',
    component: () => import('../views/PressureIndex.vue'),
    meta: { title: '矿压指标', icon: '📈' }
  },
  {
    path: '/mpi-heatmap',
    name: 'MpiHeatmap',
    component: () => import('../views/MpiHeatmap.vue'),
    meta: { title: 'MPI热力图', icon: '🔥' }
  },
  {
    path: '/mpi-heatmap-pro',
    name: 'MpiHeatmapPro',
    component: () => import('../views/MpiHeatmapPro.vue'),
    meta: { title: 'MPI数值模拟', icon: '⚡' }
  },
  {
    path: '/mpi-algorithm',
    name: 'MpiAlgorithm',
    component: () => import('../views/MpiAlgorithm.vue'),
    meta: { title: 'MPI算法原理', icon: '🧠' }
  },
  {
    path: '/academic-algorithm',
    name: 'AcademicAlgorithm',
    component: () => import('../views/AcademicAlgorithm.vue'),
    meta: { title: '学术算法展示', icon: '🔬' }
  },
  {
    path: '/algorithm-validation',
    name: 'AlgorithmValidation',
    component: () => import('../views/AlgorithmValidation.vue'),
    meta: { title: '新算法实证', icon: '🧪' }
  },
  {
    path: '/steps',
    name: 'Steps',
    component: () => import('../views/Steps.vue'),
    meta: { title: '来压步距', icon: '📐' }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    meta: { title: '结果报告', icon: '📑' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
