<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Benvenuto</h2>
        <p class="mt-2 text-sm text-gray-600">Accedi al tuo account per continuare</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <!-- Messaggio di errore -->
        <div v-if="error" class="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
          {{ error }}
        </div>

        <!-- Messaggio di successo -->
        <div v-if="success" class="mb-4 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-2">
          Login effettuato con successo! Reindirizzamento...
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
                type="email"
                id="email"
                v-model="email"
                required
                :disabled="loading"
                placeholder="es. utente@email.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  required
                  :disabled="loading"
                  placeholder="ABCDEFG"
                  class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
              <button
                  type="button"
                  @click="togglePasswordVisibility"
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
          </div>

          <button
              type="submit"
              :disabled="loading"
              class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Accesso in corso...' : 'Accedi' }}
          </button>
        </form>

        <!-- Link per registrazione -->
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-600">Non hai un account?</span>
          <router-link
              to="/signin"
              class="ml-1 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
          >
            Registrati qui
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from "@/service/api.js";

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: null,
      success: false,
      showPassword: false,
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async handleLogin() {
      this.error = null;
      this.success = false;
      this.loading = true;

      if (!this.email || !this.password) {
        this.error = ' Inserisci email e password';
        this.loading = false;
        return;
      }

      console.log('Tentativo login per:', this.email);

      try {
        const data = await post('/auth/login', {
          email: this.email,
          password: this.password
        });

        console.log(' RISPOSTA COMPLETA:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log(' Token salvato:', data.token);
        } else {
          console.error('Nessun token ricevuto!');
        }

        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          authority: data.user.authority,
          car_plate: data.user.car_plate || data.user.targa || ''
        }));

        console.log(' User salvato:', localStorage.getItem('user'));
        console.log(' Token presente:', !!localStorage.getItem('token'));

        window.dispatchEvent(new CustomEvent('auth-login', {
          detail: { user: data.user }
        }));

        this.success = true;
        console.log('Login riuscito:', data.user.authority);

        this.$router.push('/map');

      } catch (err) {
        switch(err.status) {
          case 400:
            this.error = ' Email o password non corretti. Riprova.';
            break;
          case 403:
            this.error = ' Account disabilitato, contatta l\'amministratore.';
            break;
          case 401:
            this.error = ' Sessione scaduta. Effettua nuovamente il login.';
            break;
          case 500:
            this.error = ' Errore nel server. Riprova più tardi.';
            break;
          default:
            this.error = err.message || 'Errore durante il login. Riprova più tardi.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
