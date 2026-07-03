<template>
  <div class="view-container">
    <h2>Login</h2>

    <!-- Messaggio di errore -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Messaggio di successo -->
    <div v-if="success" class="success-message">
      Login effettuato con successo! Reindirizzamento...
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
            type="email"
            id="email"
            v-model="email"
            required
            :disabled="loading"
        >
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            required
            :disabled="loading"
        >
      </div>

      <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
      >
        {{ loading ? 'Accesso in corso...' : 'Accedi' }}
      </button>
    </form>
  </div>
</template>

<script>
import {post} from "@/service/api.js";

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

      try {
        // Chiamata API al backend
        const data = await post('@/service/api/login', {email: this.email, password: this.password});

        // Salva dati utente
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          authority: data.user.authority
        }));

        // if (data.token) {
        //   localStorage.setItem('token', data.token);
        // }

        // Login riuscito
        this.success = true;
        console.log('Login riuscito:', data.user.authority);//per il debugging


        // Reindirizza dopo 1.5 secondi
        setTimeout(() => {
          // Reindirizzamento alla home o dashboard
          this.$router.push('/'); // o '/dashboard'
        }, 1500);

      } catch (err) {
        // Gestione errori
        switch(err.status){
          case 400:
            this.error = 'email o password non corretti. riprova';
            break;
          case 403:
            this.error = 'account disabilitato, contatta l\'amministratore';
            break;
          case 401:
            this.error= 'sessione scaduta. effettua nuovamente il login.';
            break;
          case 500:
            this.error='errore nel server. riprova più tardi.';
            break;
            default:
              this.error = err.message || 'errore durante il login. rirpova più tardi.'
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>