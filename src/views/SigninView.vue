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
      if (this.password !== this.confirmPassword) {
        this.message='le password non coincidono';
        return
      }
      if (this.password.length < 8) {
        this.message = 'La password deve avere almeno 8 caratteri';
        return;
      }

      if (!this.targa || this.targa.length < 2) {
        this.message = 'Inserisci una targa valida';
        return;
      }

      this.loading=true;

      try{

        const data = await post('/auth/signin', {email: this.email, password: this.password, targa:this.targa});

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