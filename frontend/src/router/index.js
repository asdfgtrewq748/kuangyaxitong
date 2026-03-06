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
    meta: { title: '数据导入', titleKey: 'nav.dataImport', icon: 'upload', navOrder: 10, flowOrder: 10 }
  },
  {
    path: '/interpolation',
    name: 'Interpolation',
    component: () => import('../views/Interpolation.vue'),
    meta: { title: '插值分析', titleKey: 'nav.interpolation', icon: 'chart', navOrder: 20, flowOrder: 20 }
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
    meta: { title: '新算法实证', titleKey: 'nav.algorithmValidation', icon: 'flask', navOrder: 40, flowOrder: 40 }
  },
  {
    path: '/algorithm-validation/figures',
    name: 'AlgorithmValidationFigures',
    component: () => import('../views/AlgorithmValidationFigures.vue'),
    meta: { title: '科研图子页面', nav: false, workflow: false }
  },
  {
    path: '/fusion-preview',
    alias: ['/geomodel-fusion'],
    name: 'FusionPreview',
    component: () => import('../views/FusionPreview.vue'),
    meta: { title: '三维融合预览', titleKey: 'nav.fusionPreview', icon: 'cube', navOrder: 45, workflow: false }
  },
  {
    path: '/pressure-analysis',
    name: 'PressureAnalysis',
    component: () => import('../views/PressureAnalysisUltra.vue'),
    meta: { title: '矿压数据分析', titleKey: 'nav.pressureAnalysis', icon: 'chart', navOrder: 50, flowOrder: 50 }
  },
  {
    path: '/uncertainty-analysis',
    name: 'UncertaintyAnalysis',
    component: () => import('../views/UncertaintyAnalysis.vue'),
    meta: { title: '不确定性分析', titleKey: 'nav.uncertaintyAnalysis', icon: 'report', navOrder: 55, workflow: false }
  },
  {
    path: '/pressure-analysis/charts',
    name: 'PressureAnalysisCharts',
    component: () => import('../views/PressureAnalysisCharts.vue'),
    meta: { title: '矿压图表中心', nav: false, workflow: false }
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
