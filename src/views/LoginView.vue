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
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // IMPORTANTE: per inviare/ricevere cookie
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();
        // data.token

        if (!response.ok) {
          // Gestione errori dal backend
          this.error=(data.message || 'Errore durante il login');
          return;
        }

        // Salva dati utente
        localStorage.setItem('user', JSON.stringify({
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
        this.error = err.message || 'Errore di connessione al server';
        console.error('Errore login:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>