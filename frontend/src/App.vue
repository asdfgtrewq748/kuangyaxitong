<template>
  <AppLayout />
</template>

<script setup>
import AppLayout from './layouts/AppLayout.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Make toast ref available globally
  window.toastRef = null
})
</script>

<style>
/* Global styles are in style.css */
</style>
