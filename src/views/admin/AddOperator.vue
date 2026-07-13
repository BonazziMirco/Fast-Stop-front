<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">
      Aggiungi Operatore
    </h1>

    <!--    aggiungere la possibilità di mettere un ruolo-->

    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div v-if="message" class="mb-6 p-4 rounded-lg" :class="typeof message === 'string' && message.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
        {{ typeof message === 'string' ? message : 'Errore sconosciuto' }}
      </div>

      <form @submit.prevent="aggiungiOperatore">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Password</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Conferma Password</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="py-3 px-4">
                <input
                    type="email"
                    v-model="email"
                    required
                    :disabled="loading"
                    placeholder="es. operatore@email.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
              </td>
              <td class="py-3 px-4">
                <div class="relative">
                  <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      required
                      :disabled="loading"
                      placeholder="Password"
                      class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                  >
                  <button
                      type="button"
                      @click="showPassword = !showPassword"
                      :disabled="loading"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      :aria-label="showPassword ? 'Nascondi password' : 'Mostra password'"
                  >
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="relative">
                  <input
                      :type="showCheckPassword ? 'text' : 'password'"
                      v-model="checkPassword"
                      required
                      :disabled="loading"
                      placeholder="Conferma Password"
                      class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                  >
                  <button
                      type="button"
                      @click="showCheckPassword = !showCheckPassword"
                      :disabled="loading"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      :aria-label="showCheckPassword ? 'Nascondi password' : 'Mostra password'"
                  >
                    <svg v-if="!showCheckPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="py-3 px-4">
                <select id="role"
                        v-model="role"
                        :disabled="loading"
                        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">Seleziona un ruolo</option>
                  <option value="0">User</option>
                  <option value="1">Viewer</option>
                  <option value="2">Operator</option>
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
            {{ loading ? 'Creazione in corso...' : 'Aggiungi Operatore' }}
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
import {post} from '@/service/api'

export default {
  name: 'addOperator',
  data() {
    return {
      email: "",
      checkPassword: "",
      password: "",
      role: 0,
      message: null,
      loading: false,
      showPassword: false,
      showCheckPassword: false,
    }
  },
  methods: {
    async aggiungiOperatore() {
      this.message = null
      if (!this.validatePassword()) {
        return
      }
      try {
        this.loading = true
        await post('/auth/register', {
          email: this.email,
          password: this.password,
          authority: this.role,
        })
        console.log("creazione riuscita")
        this.message = 'operatore creato con successo'
        this.resetForm()

        setTimeout(() => {
          this.message = null
        }, 5000)

      } catch (error) {
        console.error('Error occured', error)
        this.message = error || 'errore durante la creazione'
        if (error.status === 401) {
          this.$emit('auth-error', error)
        }
      } finally {
        this.loading = false
      }
    },

    validatePassword() {
      if (this.password !== this.checkPassword) {
        console.error('le password non coincidono')
        this.message = 'le password non coincidono'
        return false
      }
      return true
    },

    resetForm() {
      this.email = ''
      this.password = ''
      this.checkPassword = ''
      this.role = 0
      this.showPassword = false
      this.showCheckPassword = false
    }
  }
}
</script>