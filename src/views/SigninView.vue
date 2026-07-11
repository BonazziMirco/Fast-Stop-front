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
        <div v-if="error" class="mb-4 p-4 rounded-lg bg-green-50 text-red-700 border border-red-200 flex items-center gap-2">
          {{ error }}
        </div>

        <!-- Messaggio di successo -->
        <div v-if="success" class="mb-4 p-4 rounded-lg bg-red-50 text-green-700 border border-green-200 flex items-center gap-2">
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
            <input
                type="password"
                id="password"
                v-model="password"
                required
                :disabled="loading||success"
                minlength="8"
                placeholder="es. ABCDEFGH"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"

            >
            <small class="hint">minimo 8 caratteri</small>
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Conferma Password: <span class="text-red-500">*</span> </label>
            <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                :disabled="loading||success"
                placeholder="es. ABCDEFGH"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
          </div>
          <div class="form-group">
            <label for="name" class="block text-sm font-mmedium text-gray-700">
              Targa: <span class="text-red-500">*</span> </label>
            <input
                type="text"
                id="targa"
                v-model="targa"
                required
                :disabled="loading||success"
                placeholder="es.AB123CD"
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
      message:null,
      error:null,
      success:false,
      loading:false
    }
  },
  methods: {
    async handleSignin() {
      //reset stati
      this.message=null;
      this.error=null;
      this.success = false;
      this.loading=true;
      if (this.password !== this.confirmPassword) {
        this.message='le password non coincidono';
        this.loading=false;
        return
      }
      if (this.password.length < 8) {
        this.message = 'La password deve avere almeno 8 caratteri';
        this.loading=false;
        return;
      }

      if (!this.targa || this.targa.length < 2) {
        this.message = 'Inserisci una targa valida';
        this.loading=false;
        return;
      }


      try{

        const data = await post('/auth/register', {email: this.email, password: this.password, targa:this.targa.toUpperCase().trim()});

        this.success=true;
        console.log('Registrazione riuscita:', data);


        setTimeout(() => {
          // Reindirizzamento al login
          this.$router.push('/login');
        }, 1500);
      }
      catch(err){
        switch (err.status){
          case 400:
            this.error = 'email già registrata o dati non validi. Riprova';
            break;
          case 409:
            this.error = 'Questa mail è già registrata. Effettua il login.'
                break;
          case 500:
            this.error = 'errore nel server';
            break;
            default:
              this.error = err.message || 'errore durante la registrazione. Riprova più tardi';
        }
      }
      finally {
        this.loading=false;
      }
    }
  }
}
</script>