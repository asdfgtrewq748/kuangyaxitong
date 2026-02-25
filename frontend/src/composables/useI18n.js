import { computed } from 'vue'
import { useAppStore } from '../stores'
import messages, { DEFAULT_LOCALE } from '../locales'

const FALLBACK_LOCALE = 'en-US'
const SUPPORTED_LOCALES = Object.keys(messages)

const resolveKey = (locale, key) => {
  return key.split('.').reduce((current, part) => current?.[part], messages[locale])
}

const interpolate = (template, params) => {
  if (!params || typeof template !== 'string') return template
  return template.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? `{${token}}`))
}

const normalizeLocale = (locale) => {
  if (SUPPORTED_LOCALES.includes(locale)) return locale
  return DEFAULT_LOCALE
}

export function useI18n() {
  const appStore = useAppStore()

  const locale = computed(() => normalizeLocale(appStore.language))

  const t = (key, params) => {
    const message =
      resolveKey(locale.value, key) ??
      resolveKey(DEFAULT_LOCALE, key) ??
      resolveKey(FALLBACK_LOCALE, key) ??
      key

    return interpolate(message, params)
  }

  const setLanguage = (nextLocale) => {
    appStore.setLanguage(normalizeLocale(nextLocale))
  }

  const toggleLanguage = () => {
    setLanguage(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  return {
    locale,
    t,
    setLanguage,
    toggleLanguage,
    supportedLocales: SUPPORTED_LOCALES
  }
}
