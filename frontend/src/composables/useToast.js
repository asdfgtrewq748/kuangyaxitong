import { ref, inject } from 'vue'

const toastKey = Symbol('toast')

export function provideToast(app) {
  const toastRef = ref(null)
  app.provide(toastKey, toastRef)
  return toastRef
}

export function useToast() {
  const toastRef = inject(toastKey, ref(null))

  const add = (message, type = 'info', duration = 3000) => {
    toastRef.value?.add(message, type, duration)
  }

  const success = (message) => add(message, 'success')
  const error = (message) => add(message, 'error')
  const warning = (message) => add(message, 'warning')
  const info = (message) => add(message, 'info')

  return { add, success, error, warning, info }
}
