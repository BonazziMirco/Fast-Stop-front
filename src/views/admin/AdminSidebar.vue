
<template>
<aside class="w-64 min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white flex-shrink-0
sticky top-0 h-screen overflow-y-auto shadow-x1 rounded-l-lg">
      <nav class="flex flex-col p-3 space-y-1">
        <router-link to="/admin/add-operator" class="flex items-center gap-3
px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
        active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30">
          Aggiungi Operatore
        </router-link>
        <br>
        <router-link to="/admin/manage-operator" class="flex items-center gap-3
px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                     active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30">
          Gestisci Operatori
        </router-link>
        <br>
        <router-link to="/admin/add-device" class="flex items-center gap-3
px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                     active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30">
          Aggiungi parchimetro
        </router-link>
        <br>
        <router-link to="/admin/manage-device" class="flex items-center gap-3
px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                     active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30">
          Modifica parchimetri
        </router-link>

      </nav>
</aside>
</template>

<script >
export default {
  name: 'AdminSidebar',
}
</script>