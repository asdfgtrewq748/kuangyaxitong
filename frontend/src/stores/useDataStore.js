/**
 * Data State Store
 *
 * 管理跨页面的数据状态：
 * - 当前选中的煤层
 * - 当前地质模型任务
 * - 当前实验
 * - 煤层列表、任务列表、实验列表
 * - 数据缓存
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCoalSeams, getGeomodelIntegrationJobs } from '../api'

export const useDataStore = defineStore('data', () => {
  // State
  const currentSeam = ref('')
  const currentJobId = ref('')
  const currentExperimentId = ref('')

  const seams = ref([])
  const jobs = ref([])
  const experiments = ref([])

  // 数据加载状态
  const seamsLoading = ref(false)
  const jobsLoading = ref(false)
  const experimentsLoading = ref(false)

  // 数据缓存
  const seamDataCache = ref(new Map()) // 煤层数据缓存
  const jobDataCache = ref(new Map())  // 任务数据缓存

  // Computed
  const hasSeam = computed(() => !!currentSeam.value)
  const hasJob = computed(() => !!currentJobId.value)
  const hasExperiment = computed(() => !!currentExperimentId.value)

  const currentSeamData = computed(() => {
    if (!currentSeam.value) return null
    return seamDataCache.value.get(currentSeam.value) || null
  })

  const currentJobData = computed(() => {
    if (!currentJobId.value) return null
    return jobDataCache.value.get(currentJobId.value) || null
  })

  // Actions
  async function loadSeams() {
    if (seamsLoading.value) return

    seamsLoading.value = true
    try {
      const response = await getCoalSeams()
      const seamList = response.data?.seams || []

      // 标准化数据格式
      seams.value = seamList.map((item) =>
        typeof item === 'string' ? { name: item, id: item } : item
      )

      // 自动选择第一个煤层（如果尚未选择）
      if (!currentSeam.value && seams.value.length > 0) {
        currentSeam.value = seams.value[0].name || seams.value[0].id
      }

      return seams.value
    } catch (error) {
      console.error('加载煤层列表失败:', error)
      throw error
    } finally {
      seamsLoading.value = false
    }
  }

  async function loadJobs(seamId) {
    if (!seamId) seamId = currentSeam.value
    if (!seamId) return

    jobsLoading.value = true
    try {
      const response = await getGeomodelIntegrationJobs()
      const jobList = response.data || []

      jobs.value = jobList

      // 如果有当前任务，验证它是否还在列表中
      if (currentJobId.value) {
        const exists = jobList.some((job) => job.job_id === currentJobId.value)
        if (!exists) {
          currentJobId.value = ''
        }
      }

      return jobList
    } catch (error) {
      console.error('加载任务列表失败:', error)
      throw error
    } finally {
      jobsLoading.value = false
    }
  }

  function setCurrentSeam(seamId) {
    currentSeam.value = seamId
    // 清空依赖数据
    currentJobId.value = ''
    // 同步到 URL
    syncToUrl()
  }

  function setCurrentJob(jobId) {
    currentJobId.value = jobId
    // 同步到 URL
    syncToUrl()
  }

  function setCurrentExperiment(expId) {
    currentExperimentId.value = expId
    // 同步到 URL
    syncToUrl()
  }

  function cacheSeamData(seamId, data) {
    seamDataCache.value.set(seamId, data)
  }

  function cacheJobData(jobId, data) {
    jobDataCache.value.set(jobId, data)
  }

  function clearCache() {
    seamDataCache.value.clear()
    jobDataCache.value.clear()
  }

  function clearSeamCache(seamId) {
    seamDataCache.value.delete(seamId)
  }

  function clearJobCache(jobId) {
    jobDataCache.value.delete(jobId)
  }

  // URL 同步
  function syncToUrl() {
    const params = new URLSearchParams()
    if (currentSeam.value) params.set('seam', currentSeam.value)
    if (currentJobId.value) params.set('job', currentJobId.value)
    if (currentExperimentId.value) params.set('exp', currentExperimentId.value)

    const query = params.toString()
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname

    // 使用 replaceState 避免创建历史记录
    window.history.replaceState({}, '', newUrl)
  }

  function loadFromUrl(urlParams) {
    if (urlParams.seam) currentSeam.value = urlParams.seam
    if (urlParams.job) currentJobId.value = urlParams.job
    if (urlParams.exp) currentExperimentId.value = urlParams.exp
  }

  // 重置
  function reset() {
    currentSeam.value = ''
    currentJobId.value = ''
    currentExperimentId.value = ''
    clearCache()
  }

  return {
    // State
    currentSeam,
    currentJobId,
    currentExperimentId,
    seams,
    jobs,
    experiments,
    seamsLoading,
    jobsLoading,
    experimentsLoading,
    seamDataCache,
    jobDataCache,

    // Computed
    hasSeam,
    hasJob,
    hasExperiment,
    currentSeamData,
    currentJobData,

    // Actions
    loadSeams,
    loadJobs,
    setCurrentSeam,
    setCurrentJob,
    setCurrentExperiment,
    cacheSeamData,
    cacheJobData,
    clearCache,
    clearSeamCache,
    clearJobCache,
    syncToUrl,
    loadFromUrl,
    reset
  }
})
