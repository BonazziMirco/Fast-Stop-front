<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <div class="w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-blue-950 ring-2"

           :class="avatarRing">
        <img :src="avatarImage" :alt="getRoleName(user?.authority)" class="w-full rounded-full object-cover">
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Il mio Profilo</h1>
        <p class="text-gray-500 text-sm">{{ user?.email }}</p>
      </div>
    </div>

    <!-- Card principale -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <!-- Email -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div>
          <label class="text-sm font-medium text-gray-500">Email</label>
          <p class="text-gray-800 font-medium">{{ user?.email || 'Non impostata' }}</p>
        </div>
        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verificata</span>
      </div>

      <!-- Targa -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div>
          <label class="text-sm font-medium text-gray-500">Targa</label>
          <p class="text-gray-800 font-medium">{{ user?.car_plate || user?.targa || 'Non impostata' }}</p>
        </div>
        <button
            @click="mostraTarga"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
        >
          Cambia Targa
        </button>
      </div>

      <!-- Ruolo -->
      <div class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div>
          <label class="text-sm font-medium text-gray-500">Ruolo</label>
          <p class="text-gray-800 font-medium">
            <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getRoleClass(user?.authority)">
              {{ getRoleName(user?.authority) }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Sezione Cambio Password -->
    <div class="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800"> Password</h3>
        <button
            v-if="popUpPassword"
            @click="mostraPassword"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Cambia Password
        </button>
        <button
            v-else
            @click="annullaCambioPassword"
            class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annulla
        </button>
      </div>

      <div v-if="!popUpPassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vecchia Password</label>
          <div class="relative">
            <input
                :type="showOldPassword ? 'text' : 'password'"
                v-model="oldPassword"
                required
                :disabled="loading"
                placeholder="Inserisci la password attuale"
                class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
            <button
                type="button"
                @click="showOldPassword = !showOldPassword"
                :disabled="loading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="showOldPassword ? 'Nascondi password' : 'Mostra password'"
            >
              <svg v-if="!showOldPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
          <div class="relative">
            <input
                :type="showNewPassword ? 'text' : 'password'"
                v-model="newPassword"
                required
                :disabled="loading"
                placeholder="Inserisci la nuova password"
                class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
            <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                :disabled="loading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="showNewPassword ? 'Nascondi password' : 'Mostra password'"
            >
              <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Conferma Password</label>
          <div class="relative">
            <input
                :type="showCheckPassword ? 'text' : 'password'"
                v-model="checkPassword"
                required
                :disabled="loading"
                placeholder="Conferma la nuova password"
                class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
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
        </div>

        <div v-if="passwordMsg" class="p-3 rounded-lg" :class="passwordMsg.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
          {{ passwordMsg }}
        </div>

        <button
            @click="confermaCambioPassword"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Aggiornamento...' : 'Conferma Cambio Password' }}
        </button>
      </div>
    </div>

    <!-- Sezione Cambio Targa -->
    <div class="mt-6 bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800"> Targa</h3>
        <button
            v-if="popUpTarga"
            @click="mostraTarga"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Cambia Targa
        </button>
        <button
            v-else
            @click="annullaCambioTarga"
            class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annulla
        </button>
      </div>

      <div v-if="!popUpTarga" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
                :type="showPasswordTarga ? 'text' : 'password'"
                v-model="passwordTarga"
                required
                :disabled="loading"
                placeholder="Inserisci la password per confermare"
                class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            >
            <button
                type="button"
                @click="showPasswordTarga = !showPasswordTarga"
                :disabled="loading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :aria-label="showPasswordTarga ? 'Nascondi password' : 'Mostra password'"
            >
              <svg v-if="!showPasswordTarga" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nuova Targa</label>
          <input
              type="text"
              v-model="newTarga"
              required
              :disabled="loading"
              placeholder="es. AB123CD"
              maxlength="7"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 uppercase"
          >
        </div>

        <div v-if="targaMsg" class="p-3 rounded-lg" :class="targaMsg.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
          {{ targaMsg }}
        </div>

        <button
            @click="cambioTarga"
            :disabled="loading"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ loading ? 'Aggiornamento...' : 'Conferma Cambio Targa' }}
        </button>
      </div>
    </div>

    <!-- Pulsante Logout -->
    <div class="mt-6">
      <button
          @click="logout"
          class="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import {get, patch, post} from '../service/api'
import crown from '@/assets/crown.png'
import settings from '@/assets/settings.png'
import viewer from '@/assets/viewer.png'
import user from '@/assets/user.png'

export default {
  name: 'profileView',
  data() {
    return {
      user: null,
      loading: false,

      popUpPassword: true,
      passwordMsg: null,
      oldPassword: '',
      newPassword: '',
      checkPassword: '',
      showOldPassword: false,
      showNewPassword: false,
      showCheckPassword: false,

      newTarga: '',
      popUpTarga: true,
      targaMsg: null,
      passwordTarga: '',
      showPasswordTarga: false,
    }
  },

  computed: {
    userInitial() {
      if (!this.user?.email) return '?'
      return this.user.email.charAt(0).toUpperCase()
    },
    avatarImage: function () {
      const role = this.user?.authority
      const images = {
        3: crown, //admin
        2: settings,  //operator
        1: viewer,  //viewer
        0: user //user
      }
      return images[role] || user
    },

    avatarRing(){
      const role= this.user?.authority
      const classes = {
        3:'ring-blue-950',
        2:'ring-red-700',
        1:'ring-red-500',
        0:'ring-gray-500'
      }
      return classes[role] || 'ring-gray-500'
    },
  },



  mounted() {
    this.caricaProfilo()
    const role = this.user?.authority
    console.log('Ruolo:', role)
  },

  methods: {

    async caricaProfilo() {
      this.loading = true

      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        this.user = JSON.parse(savedUser)
        console.log('Dati utente caricati da localStorage:', this.user)
      }

      try {
        const data = await get('/profile')
        this.user = {
          ...this.user,
          email: data.email,
          car_plate: data.targa || data.car_plate,
          authority: data.role || data.authority,
          id: data.id
        }

        localStorage.setItem('user', JSON.stringify(this.user))
        console.log('Dati aggiornati', this.user)

      } catch (error) {
        console.error('Errore caricamento profilo:', error)
        if (error.status === 401) {
          this.$emit('auth-error', error);

        } else {
          alert(error.message || 'Errore nel caricamento del profilo')
        }
      } finally {
        this.loading = false
      }
    },

    mostraPassword() {
      this.popUpPassword = false
      this.popUpTarga = true
      this.passwordMsg = null
    },

    annullaCambioPassword() {
      this.popUpPassword = true
      this.passwordMsg = null
      this.oldPassword = ''
      this.newPassword = ''
      this.checkPassword = ''
      this.showOldPassword = false
      this.showNewPassword = false
      this.showCheckPassword = false
    },

    async confermaCambioPassword() {
      if (!this.oldPassword || !this.newPassword || !this.checkPassword) {
        this.passwordMsg = ' Compila tutti i campi'
        return
      }
      if (this.newPassword !== this.checkPassword) {
        this.passwordMsg = ' Le password non coincidono'
        return
      }
      if (this.newPassword.length < 8) {
        this.passwordMsg = ' La password deve essere di almeno 8 caratteri'
        return
      }

      this.loading = true
      this.passwordMsg = null

      try {
        await patch('/profile/password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })

        this.passwordMsg = ' Password cambiata con successo!'
        console.log('Cambio password riuscito')

        setTimeout(() => {
          this.annullaCambioPassword()
          this.passwordMsg = null
        }, 3000)

      } catch (error) {
        this.passwordMsg = error?.message || ' Errore nel cambio password'
        console.error('Errore nel cambio password:', error)
      } finally {
        this.loading = false
      }
    },

    mostraTarga() {
      this.popUpTarga = false
      this.popUpPassword = true
      this.targaMsg = null
    },

    annullaCambioTarga() {
      this.popUpTarga = true
      this.targaMsg = null
      this.newTarga = ''
      this.passwordTarga = ''
      this.showPasswordTarga = false
    },

    async cambioTarga() {
      if (!this.newTarga || this.newTarga.length < 2) {
        this.targaMsg = ' Inserisci una targa valida'
        return
      }

      if (!this.passwordTarga) {
        this.targaMsg = ' Inserisci la password per confermare'
        return
      }

      this.loading = true
      this.targaMsg = null

      try {
        const data = await patch('/profile/car-plate', {
          password: this.passwordTarga,
          car_plate: this.newTarga.toUpperCase().trim(),
        })

        console.log('Cambio targa riuscito')

        this.user.car_plate = this.newTarga.toUpperCase().trim()
        localStorage.setItem('user', JSON.stringify(this.user))

        this.targaMsg = ' Targa cambiata con successo!'

        setTimeout(() => {
          this.annullaCambioTarga()
          this.targaMsg = null
        }, 3000)

      } catch (error) {
        this.targaMsg = error?.message || ' Errore nel cambio targa'
        console.error('Errore nel cambio targa:', error)
      } finally {
        this.loading = false
      }
    },

    getRoleName(role) {
      const roles = {
        0: 'User',
        1: 'Viewer',
        2: 'Operator',
        3: 'Admin'
      }
      return roles[role] || 'Ospite'
    },

    getRoleClass(role) {
      const classes = {
        0: 'bg-gray-100 text-gray-700',
        1: 'bg-blue-100 text-blue-700',
        2: 'bg-purple-100 text-purple-700',
        3: 'bg-red-100 text-red-700'
      }
      return classes[role] || 'bg-gray-100 text-gray-700'
    },

    async logout() {
      try {
        await post('/auth/logout')
      }catch(error) {
        console.log('errore durante il logout', error)
      }finally {
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        window.dispatchEvent(new CustomEvent('auth-logout'))

        this.$router.push('/login')
      }


    }
  }
}
</script>