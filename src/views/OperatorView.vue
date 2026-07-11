<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestione Parcheggi</h1>
      <span class="text-sm text-gray-500">{{ lots.length }} parcheggi</span>
    </div>

    <!-- Tabella -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Parcheggio</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Zona</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Posti</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stato</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="lot in lots"
              :key="lot.id"
              @click="selectLot(lot)"
              class="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              :class="{'bg-blue-50': selectedLot && selectedLot.id === lot.id}"
          >
            <td class="py-3 px-4 text-sm text-gray-700 font-medium">{{ lot.name }}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getZoneClass(lot.zoneId)">
                  {{ lot.zoneId }}
                </span>
            </td>
            <td class="py-3 px-4 text-sm text-gray-700">{{ lot.availableSpots }}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="!lot.state === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ lot.state === 1 ? 'Chiuso' : 'Aperto' }}
                </span>
            </td>
          </tr>
          <tr v-if="lots.length === 0 && !loading">
            <td colspan="4" class="py-8 text-center text-gray-500">
              Nessun parcheggio trovato
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="4" class="py-8 text-center text-gray-500">
              <span class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
              Caricamento parcheggi...
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pulsanti azioni -->
    <div class="flex flex-wrap gap-3 mt-6">
      <button
          @click="showForm"
          :disabled="!selectedLot || loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Modifica
      </button>
      <button
          @click="resetForm"
          :disabled="loading"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
      >
        Annulla
      </button>
      <button
          @click="uploadParking"
          :disabled="loading"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ loading ? 'Caricamento...' : 'Ricarica' }}
      </button>
    </div>

    <!-- Form di modifica -->
    <div v-if="!modify" class="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Modifica Parcheggio</h3>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome parcheggio</label>
            <input
                v-model="formData.name"
                type="text"
                :disabled="loading"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
          </div>

          <!-- Zona -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Zona</label>
            <select
                v-model="formData.zone"
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
              <option value="Centro_Storico"> Centro Storico</option>
              <option value="Zona_Piedicastello">Piedicastello</option>
              <option value="Zona_Albere">Albere</option>
              <option value="Bolghera">Bolghera</option>
              <option value="Trento_Nord">Trento Nord</option>
              <option value="San_Bartolomeo">San Bartolomeo</option>
            </select>
          </div>

          <!-- Posti -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Posti</label>
            <input
                type="number"
                v-model="formData.spots"
                :disabled="loading"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
          </div>

          <!-- Stato -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
                v-model="formData.state"
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
              <option :value="0">Chiuso</option>
              <option :value="1">Aperto</option>
            </select>
          </div>
        </div>

        <!-- Pulsanti form -->
        <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button
              type="submit"
              :disabled="loading || saving"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ saving ? 'Salvataggio...' : 'Conferma Modifiche' }}
          </button>
          <button
              type="button"
              @click="resetForm"
              :disabled="loading"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Ripristina
          </button>
        </div>
      </form>
    </div>

    <!-- Messaggio -->
    <div v-if="message" class="mt-4 p-4 rounded-lg" :class="message.includes('successo') || message.includes('caricati') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { get, patch } from '@/service/api.js'

export default {
  name: 'OperatorView',
  data() {
    return {
      loading: false,
      saving: false,
      message: '',

      // Dati parcheggi
      lots: [],
      selectedLot: null,

      // Form
      modify: true,
      formData: {
        name: '',
        zone: '',
        spots: '',
        state: '',
      },
      originalData: {},
    }
  },

  mounted() {
    this.uploadParking()
  },

  methods: {
    async uploadParking() {
      this.loading = true
      this.message = null
      this.lots = []

      try {
        const data = await get('/parking/lots')

        if (Array.isArray(data)) {
          this.lots = data
        } else if (data && Array.isArray(data.lots)) {
          this.lots = data.lots
        } else {
          console.error('Formato dati inaspettato:', data)
          this.lots = []
          this.message = 'Formato dati non valido'
          return
        }

        console.log('Parcheggi caricati:', this.lots.length)

      } catch (error) {
        console.error('Errore nel caricamento dei parcheggi:', error)

        if (error.status === 401) {
          alert('Sessione scaduta. Riaccedi.')
          localStorage.removeItem('user')
          localStorage.removeItem('authority')
          localStorage.removeItem('token')
          this.$router.push('/login')
        } else {
          this.message = 'Errore nel caricamento dei parcheggi: ' + (error.message || '')
        }
      } finally {
        this.loading = false
      }
    },

    selectLot(lot) {
      if (this.selectedLot && this.selectedLot.id === lot.id) {
        this.selectedLot = null
      } else {
        this.selectedLot = lot
        this.modify= true
      }
    },

    showForm() {
      if (!this.selectedLot) {
        this.message = 'Seleziona un parcheggio da modificare'
        setTimeout(() => { this.message = null }, 3000)
        return
      }

      // Compila il form con i dati del parcheggio selezionato
      this.formData = {
        name: this.selectedLot.name || '',
        zone: this.selectedLot.zoneId !== undefined ? String(this.selectedLot.zoneId) : '',
        spots: this.selectedLot.availableSpots || 0,
        state: this.selectedLot.state !== undefined ? this.selectedLot.state : 1,
      }

      // Salva copia originale per il confronto
      this.originalData = { ...this.formData }
      this.modify = false
      this.message = null
    },

    async submitForm() {
      if (!this.selectedLot) {
        this.message = 'Seleziona un parcheggio'
        return
      }

      // Controlla se ci sono modifiche
      const hasChanges = JSON.stringify(this.formData) !== JSON.stringify(this.originalData)
      if (!hasChanges) {
        this.message = 'Nessuna modifica da salvare'
        setTimeout(() => { this.message = null }, 3000)
        return
      }

      this.saving = true
      this.loading = true
      this.message = null

      try {
        // Costruisci oggetto con solo i campi modificati
        const updates = {}
        if (this.formData.name !== this.originalData.name) {
          updates.name = this.formData.name
        }
        if (Number(this.formData.availableSpots) !== Number(this.originalData.availableSpots)) {
          updates.spots = Number(this.formData.availableSpots)
        }
        if (Number(this.formData.state) !== Number(this.originalData.state)) {
          updates.state = Number(this.formData.state)
        }
        if (Number(this.formData.zoneId) !== Number(this.originalData.zoneId)) {
          updates.zone = Number(this.formData.zoneId)
        }

        await patch(`/parking/${this.selectedLot.id}`, updates)

        this.message = 'Parcheggio modificato con successo!'
        await this.uploadParking()

        // Reset
        this.resetForm()
        this.selectedLot = null

        setTimeout(() => {
          this.message = null
        }, 5000)

      } catch (error) {
        console.error(error)
        this.message = error?.message || 'Errore durante la modifica del parcheggio'
      } finally {
        this.loading = false
        this.saving = false
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        zone: '',
        spots: '',
        state: '',
      }
      this.originalData = {}
      this.modify = true
      this.message = null
    },

    getZoneClass(zone) {
      const classes = {
        0: 'bg-gray-100 text-gray-700',
        1: 'bg-blue-100 text-blue-700',
        2: 'bg-purple-100 text-purple-700'
      }
      return classes[zone] || 'bg-gray-100 text-gray-700'
    }
  }
}
</script>