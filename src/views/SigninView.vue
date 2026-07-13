<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">

      <!--      Header-->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Benvenuto</h2>
        <p class="mt-2 text-sm text-gray-600">Crea il tuo account se non ne hai già uno</p>
      </div>

      <!--      Card-->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <!-- Messaggio di errore -->
        <div v-if="error" class="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
          {{ error }}
        </div>

        <!-- Messaggio di successo -->
        <div v-if="success" class="mb-4 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-2">
          Registrazione effettuata con successo! Reindirizzamento al login...
        </div>

        <!-- Messaggio informativo (es. password non coincidono) -->
        <div v-if="message" class="mb-4 p-4 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center gap-2">
          {{ message }}
        </div>

        <!--        Form-->
        <form @submit.prevent="handleSignin" class="space-y-6">
          <div class="form-group">
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email:<span class="text-red-500">*</span></label>
            <input
                type="email"
                id="email"
                v-model="email"
                required
                :disabled="loading||success"
                placeholder="es. utente@email.com"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>

          <div class="form-group">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password: <span class="text-red-500">*</span> </label>
            <div class="relative">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  required
                  :disabled="loading||success"
                  minlength="8"
                  placeholder="es. ABCDEFGH"
                  class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="loading||success"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  :aria-label="showPassword ? 'Nascondi password' : 'Mostra password'"
              >
                <!-- Icona occhio chiuso (password nascosta) -->
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <!-- Icona occhio aperto (password visibile) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <small class="hint text-gray-500 text-xs mt-1 block">minimo 8 caratteri</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Conferma Password: <span class="text-red-500">*</span> </label>
            <div class="relative">
              <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  :disabled="loading||success"
                  placeholder="es. ABCDEFGH"
                  class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
              <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="loading||success"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  :aria-label="showConfirmPassword ? 'Nascondi password' : 'Mostra password'"
              >
                <!-- Icona occhio chiuso (password nascosta) -->
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <!-- Icona occhio aperto (password visibile) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="targa" class="block text-sm font-medium text-gray-700">
              Targa: <span class="text-red-500">*</span> </label>
            <input
                type="text"
                id="targa"
                v-model="targa"
                required
                :disabled="loading||success"
                placeholder="es. AB123CD"
                maxlength="7"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>

          <button
              type="submit"
              class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              :disabled="loading||success">
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'registrazione in corso...' : 'registrati' }}
          </button>

          <div class="mt-6 text-center text-sm">
            <span class="text-gray-600">Hai già un account?</span>
            <router-link
                to="/login"
                class="ml-1 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
            >
              Accedi qui
            </router-link>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {post} from '../service/api';

export default {
  name: 'SigninView',
  data() {
    return {
      targa: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: null,
      error: null,
      success: false,
      loading: false,
      showPassword: false,        // Per il campo password
      showConfirmPassword: false  // Per il campo conferma password
    }
  },
  methods: {
    async handleSignin() {
      //reset stati
      this.message = null;
      this.error = null;
      this.success = false;
      this.loading = true;

      if (this.password !== this.confirmPassword) {
        this.message = 'le password non coincidono';
        this.loading = false;
        return
      }
      if (this.password.length < 8) {
        this.message = 'La password deve avere almeno 8 caratteri';
        this.loading = false;
        return;
      }

      if (!this.targa || this.targa.length < 2) {
        this.message = 'Inserisci una targa valida';
        this.loading = false;
        return;
      }

      try {
        const data = await post('/auth/register', {
          email: this.email,
          password: this.password,
          targa: this.targa.toUpperCase().trim()
        });

        this.success = true;
        console.log('Registrazione riuscita:', data);

        setTimeout(() => {
          // Reindirizzamento al login
          this.$router.push('/login');
        }, 1500);
      } catch(err) {
        switch (err.status) {
          case 400:
            this.error = 'email già registrata o dati non validi. Riprova';
            break;
          case 409:
            this.error = 'Questa mail è già registrata. Effettua il login.';
            break;
          case 500:
            this.error = 'errore nel server';
            break;
          default:
            this.error = err.message || 'errore durante la registrazione. Riprova più tardi';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>