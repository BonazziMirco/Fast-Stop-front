<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header con mappa -->
    <div class="flex justify-center mb-8">
      <div class="relative group">
        <img
            src="/mappa-zone.jpg"
            alt="Mappa delle zone"
            class="w-auto h-70 object-contain rounded-xl shadow-lg border-2 border-gray-200 "
        >
        <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl transition-all text-xs shadow-md"></div>
      </div>
    </div>

    <!-- Selettori -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Select Zona -->
        <div>
          <label for="zones" class="block text-sm font-semibold text-gray-700 mb-2">
            <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>
            Seleziona Zona
          </label>
          <select
              id="zones"
              v-model="selectedZoneId"
              :disabled="loading"
              @change="onZoneChange"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Scegli una zona</option>
            <option value="Centro_Storico"> Centro Storico</option>
            <option value="Zona_Piedicastello">Piedicastello</option>
            <option value="Zona_Albere">Albere</option>
            <option value="Bolghera">Bolghera</option>
            <option value="Trento_Nord">Trento Nord</option>
            <option value="San_Bartolomeo">San Bartolomeo</option>
          </select>
        </div>

        <!-- Select Parcheggio -->
        <div v-if="selectedZoneId && lots.length > 0">
          <label for="lots" class="block text-sm font-semibold text-gray-700 mb-2">
            <i class="fas fa-parking text-blue-500 mr-1"></i>
            Seleziona Parcheggio
          </label>
          <select
              id="lots"
              v-model="selectedLotId"
              :disabled="loading"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Seleziona un parcheggio</option>
            <option
                v-for="lot in lots"
                :value="lot.id"
                :key="lot.id"
            >
              {{ lot.name }}
            </option>
          </select>
        </div>

        <!-- Messaggio quando non ci sono parcheggi -->
        <div v-else-if="selectedZoneId && lots.length === 0 && !loading" class="col-span-full">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Nessun parcheggio disponibile in questa zona
          </div>
        </div>
      </div>
    </div>

    <!-- Pulsante Conferma -->
    <div class="flex justify-center mb-6">
      <button
          @click="selectionConfirm"
          :disabled="loading || !selectedZoneId"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
      >
        <span v-if="loading">
          <i class="fas fa-spinner fa-spin mr-2"></i>
          Caricamento...
        </span>
        <span v-else>
          <i class="fas fa-check-circle mr-2"></i>
          Conferma Selezione
        </span>
      </button>
    </div>

    <!-- Dettagli Parcheggio -->
    <div v-if="selectedLot" class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <h3 class="text-lg font-bold text-gray-800 mb-3">
        <i class="fas fa-info-circle text-blue-500 mr-2"></i>
        Dettagli Parcheggio: {{ selectedLot.name }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Posti Liberi -->
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-green-800">
              <i class="fas fa-check-circle text-green-600 mr-2"></i>
              Posti Liberi
            </span>
            <span class="text-2xl font-bold text-green-600">{{ freeSpot || 0 }}</span>
          </div>
        </div>

        <!-- Posti Totali -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-blue-800">
              <i class="fas fa-total text-blue-600 mr-2"></i>
              Posti Totali
            </span>
            <span class="text-2xl font-bold text-blue-600">{{ totalSpot || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Barra di occupazione -->
      <div class="mt-4">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Occupazione</span>
          <span>{{ totalSpot > 0 ? Math.round(((totalSpot - freeSpot) / totalSpot) * 100) : 0 }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
              class="h-2.5 rounded-full transition-all duration-500"
              :class="{
              'bg-green-500': totalSpot > 0 && ((totalSpot - freeSpot) / totalSpot) < 0.5,
              'bg-yellow-500': totalSpot > 0 && ((totalSpot - freeSpot) / totalSpot) >= 0.5 && ((totalSpot - freeSpot) / totalSpot) < 0.8,
              'bg-red-500': totalSpot > 0 && ((totalSpot - freeSpot) / totalSpot) >= 0.8
            }"
              :style="{ width: totalSpot > 0 ? ((totalSpot - freeSpot) / totalSpot) * 100 + '%' : '0%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Messaggio quando nessun parcheggio è selezionato -->
    <div v-else-if="selectedZoneId && lots.length > 0" class="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border-2 border-dashed border-gray-300">
      <i class="fas fa-parking text-4xl text-gray-400 mb-3"></i>
      <p class="text-lg">Seleziona un parcheggio per vedere i dettagli</p>
    </div>
  </div>
</template>

<script>
import { get } from '@/service/api.js'

export default {
  name: 'MapView',
  data() {
    return {
      lots: [],
      selectedLot: null,
      selectedLotId: '',
      loading: false,
      freeSpot: '',
      totalSpot: '',
      selectedZoneId: '',
    }
  },

  watch: {
    selectedLotId(newId) {
      if (newId) {
        this.selectedLot = this.lots.find(lot => lot.id === newId)
        if (this.selectedLot) {
          this.freeSpot = this.selectedLot.freeSpot
          this.totalSpot = this.selectedLot.totalSpot
        }
      } else {
        this.selectedLot = null
        // Mostra la somma di tutti i parcheggi quando è selezionato "Tutti"
        if (this.lots.length > 0) {
          this.freeSpot = this.lots.reduce((sum, lot) => sum + lot.freeSpot, 0)
          this.totalSpot = this.lots.reduce((sum, lot) => sum + lot.totalSpot, 0)
        }
      }
    }
  },

  methods: {
    async loadLots() {
      this.loading = true
      try {
        const data = await get(`/parking/zones/${this.selectedZoneId}/lots`)
        this.lots = data.lots || data

        if (this.lots.length > 0) {
          // Seleziona il primo parcheggio di default
          this.selectedLotId = this.lots[0].id
        } else {
          this.selectedLotId = ''
          this.selectedLot = null
          this.freeSpot = 0
          this.totalSpot = 0
        }
      } catch (error) {
        console.error('Errore nel caricamento dei parcheggi:', error)
        if (error.status === 401 ) {
          alert('Sessione scaduta. Riaccedi.')
          localStorage.removeItem('user')
          localStorage.removeItem('authority')
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
        this.lots = []
        this.selectedLotId = ''
        this.selectedLot = null
      } finally {
        this.loading = false
      }
    },

    async onZoneChange() {
      if (!this.selectedZoneId) {
        this.lots = []
        this.selectedLotId = ''
        this.selectedLot = null
        this.freeSpot = 0
        this.totalSpot = 0
        return
      }
      await this.loadLots()
    },

    selectionConfirm() {
      if (!this.selectedZoneId) {
        alert(' Seleziona una zona prima di continuare')
        return
      }

      if (!this.selectedLotId && this.lots.length > 0) {
        alert('Seleziona un parcheggio specifico o scegli "Tutti"')
        return
      }

      console.log('Confermato:', {
        zona: this.selectedZoneId,
        parcheggio: this.selectedLot || 'Tutti'
      })

      this.updateMap()
    },

    updateMap() {
      console.log('Aggiornamento mappa in corso...')
      // Qui puoi implementare la logica per aggiornare la mappa
      // Esempio: this.$emit('update-map', { zone: this.selectedZoneId, lot: this.selectedLot })
    }
  }
}
</script>

<style scoped>
/* Animazioni aggiuntive */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Personalizzazione scrollbar per i select */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
}

/* Transizioni per i dettagli */
.details-enter-active,
.details-leave-active {
  transition: all 0.3s ease;
}

.details-enter-from,
.details-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>