<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>矿压评价系统</h2>
        <p class="sidebar-subtitle">Mining Pressure Evaluation</p>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
          class="nav-item"
          active-class="active"
        >
          <span class="nav-icon">{{ route.meta.icon }}</span>
          <span class="nav-text">{{ route.meta.title }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <p class="footer-text">© 2024 矿压评价系统</p>
      </div>
    </aside>
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'

const router = useRouter()
const toast = ref(null)
const routes = computed(() => router.getRoutes().filter(r => r.meta?.title))

onMounted(() => {
  // Make toast globally accessible
  window.toastRef = toast
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.2), 0 0 60px rgba(99, 102, 241, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  border-right: 1px solid rgba(99, 102, 241, 0.2);
}

.sidebar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.sidebar-header {
  padding: 28px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-subtitle {
  margin: 4px 0 0 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 3px 3px 0;
  transition: height 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateX(4px);
}

.nav-item:hover::before {
  height: 60%;
}

.nav-item.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.nav-item.active::before {
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

/* Main Content */
.main-content {
  margin-left: 260px;
  flex: 1;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #fafbff 50%, #f0fdf9 100%);
  position: relative;
}

.main-content::before {
  content: "";
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 100vh;
  background: radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
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

.content {
  flex: 1;
  margin-left: 240px;
  padding: 24px;
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
    padding: 16px;
  }

  .sidebar-header h2 {
    font-size: 16px;
  }

  .nav-text {
    font-size: 13px;
  }
}
</style>
