<template>
  <div class="flex min-h-screen bg-gray-100 border-2 border-red-900 rounded-lg">
    <AdminSidebar />
    <div class="flex-1 p-8 overflow-y-auto">
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

