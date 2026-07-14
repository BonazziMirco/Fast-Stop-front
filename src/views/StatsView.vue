<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Statistiche Parcheggi</h1>
        <p class="mt-2 text-sm text-gray-600">Analizza le prenotazioni dei tuoi parcheggi</p>
      </div>

      <!-- Card Filtri -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Select Parcheggio -->
          <div>
            <label for="parkingLot" class="block text-sm font-medium text-gray-700 mb-1">
              Parcheggio
            </label>
            <select
                id="parkingLot"
                v-model="selectedLotId"
                @change="onLotChange"
                :disabled="loading"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
            >
              <option value="">seleziona parcheggio</option>
              <option
                  v-for="lot in lots"
                  :value="lot.id"
                  :key="lot.id"
              >
                {{ lot.name }}
              </option>
            </select>
          </div>

          <!-- Data Inizio -->
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
              Data Inizio
            </label>
            <input
                type="date"
                id="startDate"
                v-model="startDate"
                :disabled="loading || !selectedLotId"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>

          <!-- Data Fine -->
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
              Data Fine
            </label>
            <input
                type="date"
                id="endDate"
                v-model="endDate"
                :disabled="loading || !selectedLotId"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>

          <!-- Pulsante -->
          <div class="flex items-end">
            <button
                @click="loadAllStats"
                :disabled="loading || !selectedLotId"
                class="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ loading ? 'Caricamento...' : 'Aggiorna' }}
            </button>
          </div>
        </div>

        <!-- Messaggio di errore -->
        <div v-if="error" class="mt-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
          {{ error }}
        </div>
      </div>

      <!-- Messaggio seleziona parcheggio -->
      <div v-if="!loading && !error && !selectedLotId" class="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-600 text-lg font-medium">Seleziona un parcheggio per visualizzare le statistiche</p>
          <p class="text-gray-400 text-sm mt-1">Scegli un parcheggio dal menu a tendina sopra</p>
        </div>
      </div>

      <!-- Messaggio nessun dato -->
      <div v-if="!loading && !error && selectedLotId && hasNoData" class="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-600 text-lg font-medium">
            Nessuna informazione relativa a "{{ getLotName(selectedLotId) }}"
          </p>
          <p class="text-gray-400 text-sm mt-1">Prova a selezionare un periodo diverso o un altro parcheggio</p>
        </div>
      </div>

      <!-- Grafico Giornaliero -->
      <div v-if="dailyStats.length > 0" class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Statistiche Giornaliere</h2>
        <div class="h-80">
          <canvas ref="dailyChart"></canvas>
        </div>
      </div>

      <!-- Tabella Settimanale -->
      <div v-if="weeklyStats.length > 0" class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Statistiche Settimanali</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settimana</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcheggio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totale Prenotazioni</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media Giornaliera</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giorno di Picco</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giorno di Calo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ora di Picco</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(stat, index) in weeklyStats" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(stat.week) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getLotName(stat.parking_lot_id) }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-blue-600">{{ stat.total_reservations || 0 }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatStatValue(stat.avg_daily_reservations, 1) }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {{ formatDate(stat.peak_day_date) }} ({{ stat.peak_daily_count || 0 }})
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {{ formatDate(stat.low_day_date) }} ({{ stat.low_daily_count || 0 }})
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-purple-600">{{ stat.peak_hour || 0 }}:00</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabella Mensile -->
      <div v-if="monthlyStats.length > 0" class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Statistiche Mensili</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mese</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcheggio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totale Prenotazioni</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media Giornaliera</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Picco Giornaliero</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calo Giornaliero</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giorno più Frequente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deviazione Std</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(stat, index) in monthlyStats" :key="index" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatMonth(stat.month) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ getLotName(stat.parking_lot_id) }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-blue-600">{{ stat.total_reservations || 0 }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatStatValue(stat.avg_daily_reservations, 1) }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {{ stat.peak_daily_reservations || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {{ stat.low_daily_reservations || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {{ getDayName(stat.most_common_peak_dow) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatStatValue(stat.daily_stddev, 2) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/service/api.js'
import Chart from 'chart.js/auto'

export default {
  name: 'StatsView',
  data() {
    return {
      loading: false,
      error: null,

      lots: [],
      selectedLotId: '',
      startDate: this.getDefaultStartDate(),
      endDate: this.getDefaultEndDate(),

      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],

      dailyChartInstance: null,

      lotMap: {}
    }
  },

  computed: {
    chartData() {
      if (!this.dailyStats.length) return null

      const grouped = {}
      this.dailyStats.forEach(stat => {
        const key = stat.date
        if (!grouped[key]) grouped[key] = 0
        grouped[key] += parseFloat(stat.total_reservations) || 0
      })

      const dates = Object.keys(grouped).sort()
      const values = dates.map(date => grouped[date])

      return {
        labels: dates.map(d => this.formatDate(d)),
        datasets: [
          {
            label: 'Prenotazioni Giornaliere',
            data: values,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }
        ]
      }
    },

    hasNoData() {
      return this.dailyStats.length === 0 &&
          this.weeklyStats.length === 0 &&
          this.monthlyStats.length === 0
    }
  },

  watch: {
    chartData: {
      handler() {
        this.renderChart()
      },
      deep: true
    }
  },

  methods: {
    // Funzione di formattazione globale per i valori statistici
    formatStatValue(value, decimals = 1) {
      if (value === null || value === undefined || value === '') return '0'
      const num = typeof value === 'number' ? value : parseFloat(value)
      return isNaN(num) ? '0' : num.toFixed(decimals)
    },

    getDefaultStartDate() {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      return date.toISOString().split('T')[0]
    },

    getDefaultEndDate() {
      return new Date().toISOString().split('T')[0]
    },

    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    formatMonth(dateStr) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric'
      })
    },

    getDayName(dayNumber) {
      const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
      return days[dayNumber] || 'N/A'
    },

    getLotName(lotId) {
      return this.lotMap[lotId] || `Parcheggio ${lotId}`
    },

    async onLotChange() {
      if (this.selectedLotId) {
        await this.loadAllStats()
      } else {
        this.dailyStats = []
        this.weeklyStats = []
        this.monthlyStats = []
        this.error = null
        if (this.dailyChartInstance) {
          this.dailyChartInstance.destroy()
          this.dailyChartInstance = null
        }
      }
    },

    async loadAllStats() {
      if (!this.selectedLotId) {
        this.dailyStats = []
        this.weeklyStats = []
        this.monthlyStats = []
        return
      }

      this.error = null
      this.loading = true

      try {
        await Promise.all([
          this.loadDailyStats(),
          this.loadWeeklyStats(),
          this.loadMonthlyStats()
        ])

        // Forza il rendering del grafico
        await this.$nextTick(() => {
          this.renderChart()
        })
      } catch (error) {
        console.error('Errore nel caricamento delle statistiche:', error)

        if (error.status === 401) {
          this.error = 'Sessione scaduta. Effettua nuovamente il login.'
          this.$emit('auth-error', error)
        } else {
          this.error = 'Errore nel caricamento dei dati. Riprova più tardi.'
        }
      } finally {
        this.loading = false
      }
    },

    async loadLots() {
      try {
        const data = await get('/parking/lots')
        this.lots = data.lots || data || []
        this.lotMap = this.lots.reduce((map, lot) => {
          map[lot.id] = lot.name
          return map
        }, {})
      } catch (error) {
        console.error('Errore nel caricamento dei parcheggi:', error)
        this.lots = []

        if (error.status === 401) {
          this.error = 'Sessione scaduta. Effettua nuovamente il login.'
        } else {
          this.error = 'Impossibile caricare la lista dei parcheggi'
        }

        throw error
      }
    },

    async loadDailyStats() {
      try {
        const params = this.getReportParams()
        const data = await get(`/reports/daily?${params}`)
        this.dailyStats = data || []
      } catch (error) {
        console.error('Errore nel caricamento statistiche giornaliere:', error)
        this.dailyStats = []
        throw error
      }
    },

    async loadWeeklyStats() {
      try {
        const params = this.getReportParams()
        const data = await get(`/reports/weekly?${params}`)
        this.weeklyStats = data || []
      } catch (error) {
        console.error('Errore nel caricamento statistiche settimanali:', error)
        this.weeklyStats = []
        throw error
      }
    },

    async loadMonthlyStats() {
      try {
        const params = this.getReportParams()
        const data = await get(`/reports/monthly?${params}`)
        this.monthlyStats = data || []
      } catch (error) {
        console.error('Errore nel caricamento statistiche mensili:', error)
        this.monthlyStats = []
        throw error
      }
    },

    getReportParams() {
      return new URLSearchParams({
        lotId: this.selectedLotId,
        startDate: this.startDate,
        endDate: this.endDate
      }).toString()
    },

    renderChart() {
      const canvas = this.$refs.dailyChart
      if (!canvas) return

      if (this.dailyChartInstance) {
        this.dailyChartInstance.destroy()
        this.dailyChartInstance = null
      }

      const ctx = canvas.getContext('2d')

      if (this.chartData && this.chartData.labels.length > 0) {
        // Assicuriamoci che i dati siano numerici
        const chartData = {
          ...this.chartData,
          datasets: this.chartData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(val => parseFloat(val) || 0)
          }))
        }

        this.dailyChartInstance = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y} prenotazioni`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        })
      }
    }
  },

  async created() {
    await this.loadLots()
  },

  beforeDestroy() {
    if (this.dailyChartInstance) {
      this.dailyChartInstance.destroy()
      this.dailyChartInstance = null
    }
  }
}
</script>