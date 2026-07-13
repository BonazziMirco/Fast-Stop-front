<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestione Parchimetri</h1>
      <span class="text-sm text-gray-500">{{ filteredDevices.length }} parchimetri</span>
    </div>

    <!-- Pulsante Filtra -->
    <div class="mb-4">
      <button
          @click="filterOpen"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtra
      </button>
    </div>

    <!-- Popup Filtri -->
    <div v-if="showFilterPopUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtra Parchimetri</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
                type="text"
                v-model="filters.name"
                placeholder="Cerca per nome..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
            <select
                v-model="filters.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Tutti</option>
              <option value="0">Operatore (0)</option>
              <option value="1">Supervisore (1)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parcheggio</label>
            <select
                v-model="filters.parkingLot"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Tutti</option>
              <option
                  v-for="lot in parkingLots"
                  :key="lot.id"
                  :value="lot.id"
              >
                {{ lot.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
              @click="filterApply"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Applica filtri
          </button>
          <button
              @click="filterReset"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Resetta
          </button>
          <button
              @click="filterClose"
              class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>

    <!-- Tabella -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nome</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Parcheggio</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ruolo</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Azioni</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="device in filteredDevices"
              :key="device.id"
              class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 text-sm text-gray-700">{{ device.name }}</td>
            <td class="py-3 px-4 text-sm text-gray-700">{{ getParkingLotName(device.parking_lot_id) }}</td>
            <td class="py-3 px-4">
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getRoleClass(device.authority)">
                {{ getRoleName(device.authority) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <button
                  @click="elimina(device)"
                  :disabled="loading"
                  class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Elimina
              </button>
            </td>
          </tr>
          <tr v-if="filteredDevices.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-500">
              Nessun parchimetro trovato
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Messaggio -->
    <div v-if="message" class="mt-4 p-4 rounded-lg" :class="message.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
      {{ message }}
    </div>

    <!-- Popup Conferma Eliminazione -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Conferma Eliminazione</h3>
        <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
        <div class="flex gap-3">
          <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Elimina
          </button>
          <button
              @click="cancelDelete"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, del } from '@/service/api.js'

export default {
  name: "ManageDevices",
  data() {
    return {
      devices: [],
      parkingLots: [],
      selectedDevice: null,
      loading: false,
      message: '',
      messageTimer: null,

      // Popup conferma eliminazione
      showConfirm: false,
      confirmMessage: '',
      deviceToDelete: null,

      // Popup filtro
      showFilterPopUp: false,
      filters: {
        role: '',
        name: '',
        parkingLot: '',
      },

      fetchTimeout: null,
      retryCount: 0,
    }
  },

  computed: {
    filteredDevices() {
      let result = [...this.devices]

      if (this.filters.role !== '') {
        result = result.filter(device => String(device.authority) === String(this.filters.role))
      }

      if (this.filters.parkingLot !== '') {
        result = result.filter(device => String(device.parking_lot_id) === String(this.filters.parkingLot))
      }

      if (this.filters.name && this.filters.name.trim()) {
        const searchTerm = this.filters.name.toLowerCase().trim()
        result = result.filter(device =>
            device.name && device.name.toLowerCase().includes(searchTerm)
        )
      }

      return result
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      await Promise.all([
        this.loadDevices(),
        this.loadParkingLots()
      ])
    },

    async loadDevices() {
      if (this.fetchTimeout) {
        clearTimeout(this.fetchTimeout)
        this.fetchTimeout = null
      }

      this.loading = true
      this.message = null

      try {
        const data = await get('/userManagement/devices')
        this.devices = data || []
        this.retryCount = 0
      } catch (error) {
        console.error('Errore nel caricamento dei dispositivi:', error)
        this.handleApiError(error)
      } finally {
        this.loading = false
        this.fetchTimeout = null
      }
    },

    async loadParkingLots() {
      try {
        const data = await get('/parking/lots')
        this.parkingLots = data || []
      } catch (error) {
        console.error('Errore nel caricamento dei parcheggi:', error)
        // Non mostriamo errore all'utente per questo, è secondario
      }
    },

    handleApiError(error) {
      console.error('API Error:', error)

      if (error.status === 429) {
        if (this.retryCount >= 3) {
          this.message = 'Troppe richieste al server. Riprova più tardi.'
          this.retryCount = 0
          return
        }

        this.retryCount++
        const delay = Math.min(3000 * this.retryCount, 10000)
        this.message = `Troppe richieste. Nuovo tentativo tra ${delay/1000} secondi...`

        setTimeout(() => {
          this.loadDevices()
        }, delay)

      } else if (error.status === 401) {
        this.$emit('auth-error', error);


      } else if (error.status === 404) {
        this.message = 'Risorsa non trovata.'

      } else if (error.status === 500) {
        this.message = 'Errore del server. Riprova più tardi.'

      } else {
        this.message = error?.message || 'Errore durante il caricamento'
      }

      if (error.status !== 429) {
        this.clearMessageAfterDelay()
      }
    },

    clearMessageAfterDelay() {
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
        this.messageTimer = null
      }
      this.messageTimer = setTimeout(() => {
        this.message = null
      }, 5000)
    },

    getParkingLotName(parkingLotId) {
      if (!parkingLotId) return 'N/A'
      const lot = this.parkingLots.find(l => String(l.id) === String(parkingLotId))
      return lot ? lot.name : 'Parcheggio non trovato'
    },

    getRoleName(authority) {
      const roles = {
        0: 'Operatore',
        1: 'Supervisore'
      }
      return roles[authority] || `Ruolo ${authority}`
    },

    getRoleClass(authority) {
      const classes = {
        0: 'bg-blue-100 text-blue-700',
        1: 'bg-purple-100 text-purple-700'
      }
      return classes[authority] || 'bg-gray-100 text-gray-700'
    },

    elimina(device) {
      this.deviceToDelete = device
      this.confirmMessage = `Eliminare definitivamente il parchimetro "${device.name}"? Questa azione è irreversibile.`
      this.showConfirm = true
    },

    async confirmDelete() {
      if (!this.deviceToDelete) return

      this.showConfirm = false
      this.loading = true

      try {
        // Elimina il dispositivo
        await del(`/userManagement/devices/${this.deviceToDelete.id}`)

        this.message = `Parchimetro "${this.deviceToDelete.name}" eliminato con successo!`

        this.deviceToDelete = null

        await this.refreshData()

        this.clearMessageAfterDelay()

      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error)
        this.handleApiError(error)
      } finally {
        this.loading = false
      }

    },

    cancelDelete() {
      this.showConfirm = false
      this.deviceToDelete = null
    },

    filterOpen() {
      this.showFilterPopUp = true
    },

    filterClose() {
      this.showFilterPopUp = false
    },

    filterApply() {
      this.showFilterPopUp = false
    },

    filterReset() {
      this.filters = {
        role: '',
        name: '',
        parkingLot: '',
      }
    },

    // Ricarica i dati
    refreshData() {
      this.loadData()
    }
  },

  beforeDestroy() {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout)
      this.fetchTimeout = null
    }
    if (this.messageTimer) {
      clearTimeout(this.messageTimer)
      this.messageTimer = null
    }
  }
}
</script>