<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminSidebar,
  }
}
</script>

