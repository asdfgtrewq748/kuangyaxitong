<template>
  <div class="loading-overlay">
    <span class="spinner" :class="{ sm: small }"></span>
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '加载中...' },
  small: { type: Boolean, default: false }
})
</script>
