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
    meta: { title: '数据导入', titleKey: 'nav.dataImport', icon: 'upload', navOrder: 10, flowOrder: 10 }
  },
  {
    path: '/interpolation',
    name: 'Interpolation',
    component: () => import('../views/Interpolation.vue'),
    meta: { title: '插值分析', titleKey: 'nav.interpolation', icon: 'chart', navOrder: 20, flowOrder: 20 }
  },
  {
    path: '/mpi-heatmap-pro',
    alias: ['/mpi-heatmap'],
    name: 'MpiHeatmapPro',
    component: () => import('../views/MpiHeatmapPro.vue'),
    meta: { title: 'MPI 数值模拟', titleKey: 'nav.mpiHeatmapPro', icon: 'bolt', navOrder: 40 }
  },
  {
    path: '/academic-algorithm',
    alias: ['/mpi-algorithm'],
    name: 'AcademicAlgorithm',
    component: () => import('../views/AcademicAlgorithm.vue'),
    meta: { title: '新算法原理', titleKey: 'nav.academicAlgorithm', icon: 'book', navOrder: 30, flowOrder: 30 }
  },
  {
    path: '/algorithm-validation',
    alias: ['/pressure'],
    name: 'AlgorithmValidation',
    component: () => import('../views/AlgorithmValidation.vue'),
    meta: { title: '新算法实证', titleKey: 'nav.algorithmValidation', icon: 'flask', navOrder: 35, flowOrder: 40 }
  },
  {
    path: '/research-workbench',
    alias: ['/research-portal'],
    name: 'ResearchWorkbench',
    component: () => import('../views/ResearchWorkbench.vue'),
    meta: { title: '科研工作台', titleKey: 'nav.researchWorkbench', icon: 'book', navOrder: 55 }
  },
  {
    path: '/geo-mpi-studio',
    name: 'GeoMpiStudio',
    component: () => import('../views/GeoMpiStudio.vue'),
    meta: { title: '空间实验室', titleKey: 'nav.geoMpiStudio', icon: 'chart', navOrder: 56, workflow: false }
  },
  {
    path: '/steps',
    name: 'Steps',
    component: () => import('../views/Steps.vue'),
    meta: { title: '来压步距', titleKey: 'nav.steps', icon: 'grid', navOrder: 60 }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    meta: { title: '结果报告', titleKey: 'nav.report', icon: 'report', navOrder: 70, flowOrder: 50 }
  },
  {
    path: '/geomodel-viz',
    name: 'GeomodelVisualization',
    component: () => import('../views/GeomodelVisualization.vue'),
    meta: { title: '地质建模可视化', titleKey: 'nav.geomodelVisualization', icon: 'chart', navOrder: 57 }
  },
  {
    path: '/scene3d',
    name: 'Scene3D',
    component: () => import('../views/Scene3DPage.vue'),
    meta: { title: '三维指标可视化', titleKey: 'nav.scene3d', icon: 'chart', navOrder: 58 }
  },
  {
    path: '/pressure-analysis',
    name: 'PressureAnalysis',
    component: () => import('../views/PressureAnalysis.vue'),
    meta: { title: '矿压数据分析', titleKey: 'nav.pressureAnalysis', icon: 'chart', navOrder: 59 }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫：同步 URL 参数到全局状态
router.beforeEach((to, from, next) => {
  // 从 URL 查询参数中提取状态
  const { seam, job, exp } = to.query

  // 延迟加载 store（避免循环依赖）
  if (seam || job || exp) {
    import('../stores').then(({ useDataStore }) => {
      const dataStore = useDataStore()
      if (seam) dataStore.setCurrentSeam(seam)
      if (job) dataStore.setCurrentJob(job)
      if (exp) dataStore.setCurrentExperiment(exp)
    })
  }

  next()
})

export default router
