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
            <input
                type="password"
                id="password"
                v-model="password"
                required
                :disabled="loading"
                placeholder="ABCDEFG"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
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
    }
  },
  methods: {
    async handleLogin() {
      // Reset stati
      this.error = null;
      this.success = false;
      this.loading = true;

      // Validazione base
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

        // Salva dati utente
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          authority: data.user.authority,
          car_plate: data.user.car_plate || data.user.targa || ''
        }));

        console.log(' User salvato:', localStorage.getItem('user'));
        console.log(' Token presente:', !!localStorage.getItem('token'));

        // EMETTI L'EVENTO DI LOGIN
        window.dispatchEvent(new CustomEvent('auth-login', {
          detail: { user: data.user }
        }));

        // Login riuscito
        this.success = true;
        console.log('Login riuscito:', data.user.authority);

        // Reindirizza
        this.$router.push('/map');

      } catch (err) {
        // Gestione errori
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
