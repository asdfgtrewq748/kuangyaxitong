import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/algorithm-validation'
  },
  {
    path: '/data',
    name: 'DataImport',
    component: () => import('../views/DataImport.vue'),
    meta: { title: '数据导入', icon: 'upload', navOrder: 10, flowOrder: 10 }
  },
  {
    path: '/interpolation',
    name: 'Interpolation',
    component: () => import('../views/Interpolation.vue'),
    meta: { title: '插值分析', icon: 'chart', navOrder: 20, flowOrder: 20 }
  },
  {
    path: '/pressure',
    name: 'PressureIndex',
    component: () => import('../views/PressureIndex.vue'),
    meta: { title: '矿压指标', icon: 'bar', nav: false, legacy: true }
  },
  {
    path: '/mpi-heatmap',
    name: 'MpiHeatmap',
    component: () => import('../views/MpiHeatmap.vue'),
    meta: { title: 'MPI 热力图（旧版）', icon: 'legacy', nav: false, legacy: true }
  },
  {
    path: '/mpi-heatmap-pro',
    name: 'MpiHeatmapPro',
    component: () => import('../views/MpiHeatmapPro.vue'),
    meta: { title: 'MPI 数值模拟', icon: 'bolt', navOrder: 40 }
  },
  {
    path: '/mpi-algorithm',
    name: 'MpiAlgorithm',
    component: () => import('../views/MpiAlgorithm.vue'),
    meta: { title: 'MPI 算法原理', icon: 'box', nav: false, legacy: true }
  },
  {
    path: '/academic-algorithm',
    name: 'AcademicAlgorithm',
    component: () => import('../views/AcademicAlgorithm.vue'),
    meta: { title: '新算法原理', icon: 'book', navOrder: 30, flowOrder: 30 }
  },
  {
    path: '/algorithm-validation',
    name: 'AlgorithmValidation',
    component: () => import('../views/AlgorithmValidation.vue'),
    meta: { title: '新算法实证', icon: 'flask', navOrder: 50, flowOrder: 40 }
  },
  {
    path: '/steps',
    name: 'Steps',
    component: () => import('../views/Steps.vue'),
    meta: { title: '来压步距', icon: 'grid', navOrder: 60 }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    meta: { title: '结果报告', icon: 'report', navOrder: 70, flowOrder: 50 }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

