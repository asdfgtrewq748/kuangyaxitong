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
