<template>
  <aside
      :class="[
      'flex-shrink-0 bg-gradient-to-b from-blue-900 to-gray-800 text-white',
      'transition-all duration-300 ease-in-out',
      isMobile ? 'fixed top-0 left-0 z-50 h-screen w-64 mt-16' : 'relative w-64 min-h-screen top-0 h-screen',
      isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
    ]"
      class="shadow-xl rounded-l-lg overflow-y-auto"
  >
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 class="text-xl font-bold text-white">Dashboard</h2>
      <button
          v-if="isMobile && !isOpen"
          @click="toggleSidebar"
          class="fixed z-50 p-2 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
          :class="isMobile ? 'top-16 left-4' : 'top-4 left-4'"
          aria-label="Apri menu"
      >
        ☰
      </button>
    </div>

    <nav class="flex flex-col p-3 space-y-1">
      <router-link
          to="/admin/add-operator"
          class="flex items-center px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30"
          @click="closeOnMobile"
      >
        Aggiungi Operatore
      </router-link>

      <router-link
          to="/admin/manage-operator"
          class="flex items-center px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30"
          @click="closeOnMobile"
      >
        Gestisci Operatori
      </router-link>

      <router-link
          to="/admin/add-device"
          class="flex items-center px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30"
          @click="closeOnMobile"
      >
        Aggiungi Dispositivi
      </router-link>

      <router-link
          to="/admin/manage-device"
          class="flex items-center px-4 py-2.5 font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          active-class="bg-gray-700 text-white shadow-lg ring-1 ring-blue-500/30"
          @click="closeOnMobile"
      >
        Modifica Dispositivi
      </router-link>
    </nav>
  </aside>

  <div
      v-if="isMobile && isOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      aria-hidden="true"
  ></div>

  <button
      v-if="isMobile && !isOpen"
      @click="toggleSidebar"
      class="fixed top-16 left-4 z-50 p-2 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-blue-800 transition-colors"
      aria-label="Apri menu"
  >
    ☰
  </button>
</template>

<script>
export default {
  name: 'AdminSidebar',
  data() {
    return {
      isOpen: false,
      isMobile: false
    };
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;

      if (wasMobile && !this.isMobile) {
        this.isOpen = true;
      }
      if (!wasMobile && this.isMobile) {
        this.isOpen = false;
      }
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen;
      if (this.isMobile) {
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
      }
    },
    closeOnMobile() {
      if (this.isMobile) {
        this.isOpen = false;
        document.body.style.overflow = '';
      }
    }
  }
};
</script>

<style scoped>
button {
  transition: transform 0.2s ease-in-out;
}

button:active {
  transform: scale(0.95);
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

aside {
  transition: transform 0.3s ease-in-out;
}

@media (max-width: 768px) {
  aside {
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

@media (min-width: 769px) {
  aside {
    position: sticky;
    top: 0;
    height: 100vh;
  }
}
</style>