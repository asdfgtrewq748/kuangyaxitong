<template>
  <div class="app-layout">
    <!-- Compact Icon-Only Sidebar -->
    <aside class="sidebar">
      <!-- Logo Area -->
      <div class="sidebar-logo">
        <svg viewBox="0 0 32 32" class="logo-icon">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1"/>
              <stop offset="100%" style="stop-color:#8b5cf6"/>
            </linearGradient>
          </defs>
          <path d="M6 26 L6 12 L12 8 L18 12 L18 22 L24 18 L24 6 L18 2 L6 8 Z" fill="url(#logoGrad)" opacity="0.9"/>
          <path d="M12 8 L12 18 M18 12 L18 22" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="6" cy="12" r="2" fill="#fbbf24"/>
          <circle cx="24" cy="6" r="2" fill="#f472b6"/>
        </svg>
      </div>

      <!-- Navigation with Icons -->
      <nav class="sidebar-nav">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="nav-item"
          active-class="active"
        >
          <component :is="getIcon(route.name)" class="nav-icon" />
          <span class="nav-tooltip">{{ route.meta.title }}</span>
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="footer-dot"></div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'

const router = useRouter()
const toast = ref(null)
const routes = computed(() => router.getRoutes().filter(r => r.meta?.title))

// Premium SVG Icons - lucide-style refined paths
const icons = {
  DataImport: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '17 8 12 3 7 8' }),
    h('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
  ]),

  Interpolation: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M3 3v18h18' }),
    h('path', { d: 'M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' })
  ]),

  PressureIndex: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M12 20V10' }),
    h('path', { d: 'M18 20V4' }),
    h('path', { d: 'M6 20v-4' }),
    h('path', { d: 'M3 20h18' })
  ]),

  MpiHeatmap: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M12 2c0 3-2 5-5 5s-5 2-5 5 2 5 5 5 5-2 5-5 2-5 5-5-2-5-5-5z' }),
    h('path', { d: 'M12 22v-8' }),
    h('path', { d: 'M22 12h-8' }),
    h('circle', { cx: '12', cy: '12', r: '2' })
  ]),

  MpiHeatmapPro: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' }),
    h('path', { d: 'M13 2l3 4' }),
    h('path', { d: 'M21 10l-3 4' })
  ]),

  MpiAlgorithm: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
    h('polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }),
    h('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
  ]),

  Steps: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M3 6h18' }),
    h('path', { d: 'M3 12h18' }),
    h('path', { d: 'M3 18h18' }),
    h('path', { d: 'M6 6v12' }),
    h('path', { d: 'M12 6v12' }),
    h('path', { d: 'M18 6v12' })
  ]),

  Report: () => h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [
    h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    h('polyline', { points: '14 2 14 8 20 8' }),
    h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
    h('polyline', { points: '10 9 9 9 8 9' })
  ])
}

const getIcon = (name) => icons[name] || icons.DataImport

onMounted(() => {
  window.toastRef = toast
})
</script>

<style scoped>
/* ==================== App Layout ==================== */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%);
}

/* ==================== Compact Sidebar ==================== */
.sidebar {
  width: 68px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  border-right: 1px solid rgba(99, 102, 241, 0.12);
  box-shadow: 4px 0 24px rgba(99, 102, 241, 0.08), 0 0 60px rgba(99, 102, 241, 0.04);
}

/* Subtle animated border glow */
.sidebar::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg,
    transparent 0%,
    rgba(99, 102, 241, 0.4) 50%,
    transparent 100%);
  animation: borderPulse 4s ease-in-out infinite;
}

@keyframes borderPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ==================== Logo Area ==================== */
.sidebar-logo {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
}

.logo-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3)); }
  50% { filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.4)); }
}

/* ==================== Navigation ==================== */
.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.nav-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;
}

/* Icon styling */
.nav-item .nav-icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.75;
  transition: all 0.3s ease;
}

/* Tooltip */
.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  margin-left: 12px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(99, 102, 241, 0.2);
}

.nav-tooltip::before {
  content: "";
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #312e81;
}

/* Hover state */
.nav-item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%);
  color: #1e293b;
  transform: translateX(2px);
}

.nav-item:hover .nav-icon {
  stroke-width: 2.25;
  filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3));
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

/* Active state */
.nav-item.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.1);
  transform: translateX(2px);
}

.nav-item.active .nav-icon {
  stroke-width: 2.25;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.nav-item.active .nav-tooltip {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.nav-item.active .nav-tooltip::before {
  border-right-color: #7c3aed;
}

/* Active indicator glow */
.nav-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%);
  border-radius: 0 3px 3px 0;
}

/* ==================== Sidebar Footer ==================== */
.sidebar-footer {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(99, 102, 241, 0.12);
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.02) 0%, transparent 100%);
}

.footer-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* ==================== Main Content ==================== */
.main-content {
  margin-left: 68px;
  flex: 1;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #fafbff 50%, #f0fdf9 100%);
  position: relative;
}

/* Ambient background effects */
.main-content::before {
  content: "";
  position: fixed;
  top: 0;
  left: 68px;
  right: 0;
  height: 100vh;
  background:
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  padding: 32px;
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
}

/* ==================== Page Styles ==================== */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .sidebar {
    width: 56px;
  }

  .main-content {
    margin-left: 56px;
  }

  .main-content::before {
    left: 56px;
  }

  .nav-item {
    width: 42px;
    height: 42px;
  }

  .nav-item .nav-icon {
    width: 20px;
    height: 20px;
  }

  .content-wrapper {
    padding: 20px;
  }

  .nav-tooltip {
    display: none;
  }
}
</style>
