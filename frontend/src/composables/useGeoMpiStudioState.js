import { computed, ref } from 'vue'

export const useGeoMpiStudioState = () => {
  const seamOptions = ref([])
  const seamName = ref('')
  const geomodelJobId = ref('')
  const resolution = ref(80)
  const method = ref('idw')
  const mode = ref('baseline')

  const setSeamOptions = (items) => {
    seamOptions.value = Array.isArray(items) ? items : []
    if (!seamName.value && seamOptions.value.length > 0) {
      seamName.value = seamOptions.value[0]
    }
    if (seamName.value && !seamOptions.value.includes(seamName.value)) {
      seamName.value = seamOptions.value[0] || ''
    }
  }

  const requestParams = computed(() => ({
    seam: seamName.value,
    geomodel_job_id: geomodelJobId.value || null,
    resolution: Number(resolution.value),
    method: method.value,
    mode: mode.value,
  }))

  return {
    seamOptions,
    seamName,
    geomodelJobId,
    resolution,
    method,
    mode,
    requestParams,
    setSeamOptions,
  }
}
