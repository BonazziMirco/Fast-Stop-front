
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
                <input
                    type="password"
                    v-model="password"
                    required
                    :disabled="loading"
                    placeholder="Password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
              </td>
              <td class="py-3 px-4">
                <input
                    type="password"
                    v-model="checkPassword"
                    required
                    :disabled="loading"
                    placeholder="Conferma Password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
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
      message: null,
      loading: false,
    }
  },
  methods: {
    async aggiungiOperatore() {
      this.message=null
      if (!this.validatePassword()){
        return
      }
      try{
        this.loading = true
        await post('/auth/register',{
          email: this.email,
          password: this.password,
        })
            console.log("creazione riuscita")
        this.message='operatore creato con successo'
        this.resetForm()

        setTimeout(() => {
          this.message = null
        }, 5000)

      }catch(error){
        console.error('Error occured',error)
        this.message=error||'errore durante la creazione'
        if (error.status === 401) {
          this.$emit('auth-error', error);
        }
      }finally{
        this.loading = false
      }
    },

    validatePassword() {
      if (this.password !== this.checkPassword) {
        console.error('le password non coincidono')
        this.message= 'le password non coincidono'
        return false
      }
      return true
    },

    resetForm(){
      this.email = ''
      this.password = ''
      this.checkPassword = ''
    }
  }
}
</script>