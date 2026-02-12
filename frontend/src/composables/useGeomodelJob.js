import { onUnmounted, ref } from 'vue'
import { createGeomodelJob, getGeomodelJob, listGeomodelArtifacts } from '../api'

const TERMINAL_STATUS = new Set(['completed', 'failed'])

export const useGeomodelJob = () => {
  const jobId = ref('')
  const job = ref(null)
  const artifacts = ref([])
  const loading = ref(false)
  const polling = ref(false)
  const error = ref('')

  let pollTimer = null

  const stopPolling = () => {
    polling.value = false
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  const refresh = async () => {
    if (!jobId.value) return null
    const { data } = await getGeomodelJob(jobId.value)
    job.value = data
    if (TERMINAL_STATUS.has(data.status)) {
      stopPolling()
      if (data.status === 'completed') {
        const artResp = await listGeomodelArtifacts(jobId.value)
        artifacts.value = artResp.data?.artifacts || []
      }
    }
    return data
  }

  const startPolling = (intervalMs = 1200) => {
    stopPolling()
    polling.value = true
    pollTimer = setInterval(async () => {
      try {
        await refresh()
      } catch (err) {
        error.value = err?.response?.data?.detail || err?.message || '轮询失败'
        stopPolling()
      }
    }, intervalMs)
  }

  const submit = async (payload) => {
    loading.value = true
    error.value = ''
    artifacts.value = []
    try {
      const { data } = await createGeomodelJob(payload)
      jobId.value = data.job_id
      job.value = data
      startPolling()
      return data
    } catch (err) {
      error.value = err?.response?.data?.detail || err?.message || '提交任务失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    stopPolling()
    jobId.value = ''
    job.value = null
    artifacts.value = []
    loading.value = false
    error.value = ''
  }

  onUnmounted(() => stopPolling())

  return {
    jobId,
    job,
    artifacts,
    loading,
    polling,
    error,
    submit,
    refresh,
    clear,
    stopPolling
  }
}
