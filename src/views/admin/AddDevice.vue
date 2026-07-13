<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">
      Aggiungi Parchimetro
    </h1>

    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div v-if="message" class="mb-6 p-4 rounded-lg" :class="typeof message === 'string' && message.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
        {{ typeof message === 'string' ? message : 'Errore sconosciuto' }}
      </div>

      <form @submit.prevent="aggiungiParchimetro">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nome</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Parcheggio</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ruolo</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="py-3 px-4">
                <input
                    type="text"
                    v-model="nome"
                    required
                    :disabled="loading"
                    placeholder="Nome del parchimetro"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
              </td>
              <td class="py-3 px-4">
                <select
                    id="lots"
                    v-model="selectedLotId"
                    required
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
              </td>
              <td class="py-3 px-4">
                <select
                    v-model="role"
                    required
                    :disabled="loading"
                    class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Seleziona un ruolo</option>
                  <option value="0">parchimetro</option>
                  <option value="1">Videocamera</option>
                  <option value="2">Schermo info-point</option>
                </select>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Creazione in corso...' : 'Aggiungi Parchimetro' }}
          </button>

          <button
              type="button"
              @click="resetForm"
              :disabled="loading"
              class="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
          >
            Resetta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/service/api'

export default {
  name: 'AddDevice',
  data() {
    return {
      nome: "",
      role: "",
      message: null,
      loading: false,
      lots: [],
      selectedLotId: '',
    }
  },
  mounted() {
    this.caricaParcheggi()
  },
  methods: {
    async caricaParcheggi() {
      try {
        this.lots = await get('/parking/lots')
      } catch (error) {
        console.error('Errore nel caricamento dei parcheggi:', error)
        this.message = 'Errore nel caricamento dei parcheggi'
        if (error.status === 401) {
          this.$emit('auth-error', error);
        }
      }
    },

    async aggiungiParchimetro() {
      this.message = null
      try {
        this.loading = true
        await post('/auth/device/register', {
          name: this.nome,
          parking_lots_id: this.selectedLotId,
          authority: this.role
        })
        this.message = 'Parchimetro creato con successo'
        this.resetForm()

        setTimeout(() => {
          this.message = null
        }, 5000)

      } catch (error) {
        console.error('Error occured', error)
        this.message = error.message || 'Errore durante la creazione'
        if (error.status === 401) {
          this.$emit('auth-error', error);
        }
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.nome = ''
      this.role = ''
      this.selectedLotId = ''
      this.message = null
    }
  }
}
</script>