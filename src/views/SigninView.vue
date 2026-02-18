<template>
  <div class="view-container">
    <h2>Registrazione</h2>
    <form @submit.prevent="handleSignin" class="auth-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required :disabled="loading||success">

      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            required
            :disabled="loading||success"
            minlength="8"
        >
        <small class="hint">minimo 8 caratteri</small>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Conferma Password:</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            :disabled="loading||success"
        >
      </div>
      <div class="form-group">
        <label for="name">Targa:</label>
        <input
            type="text"
            id="targa"
            v-model="targa"
            required
            :disabled="loading||success"
            placeholder="es.AB123CD"
            maxlength="7"
        >
      </div>
      <button type="submit" class="submit-btn" :disabled="loading||success">
        {{ loading ? 'Registrazione in corso...' : 'Registrati' }}
      </button>
      <!-- Messaggio di errore -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Messaggio di successo -->
      <div v-if="success" class="success-message">
        Registrazione effettuata con successo! Reindirizzamento al login...
      </div>

      <!-- Messaggio informativo (es. password non coincidono) -->
      <div v-if="message" class="info-message">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
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
      if (this.password !== this.confirmPassword) {
        this.message='le password non coincidono';
        return
      }
      if (this.password.length < 6) {
        this.message = 'La password deve avere almeno 8 caratteri';
        return;
      }

      if (!this.targa || this.targa.length < 2) {
        this.message = 'Inserisci una targa valida';
        return;
      }

      this.loading=true;

      try{
        const response = await fetch('http://localhost:3000/auth/signin', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            car_plate: this.targa
          })
        });

        const data = await response.json();

        if (!response.ok) {
          this.error = (data.message||'errore durante la registrazione');
          return;
        }

        this.success=true;
        console.log('Registrazione riuscita:', data);


        setTimeout(() => {
          // Reindirizzamento al login
          this.$router.push('/login');
        }, 1500);
      }
      catch(error){
        this.error = error.message||'errore di connessione al server';
        console.error('Errore signin:', error);
      }
      finally {
        this.loading=false;
      }
    }
  }
}
</script>