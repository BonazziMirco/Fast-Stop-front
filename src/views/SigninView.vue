<template>
  <div class="view-container">
    <h2>Registrazione</h2>
    <form @submit.prevent="handleSignin" class="auth-form">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Conferma Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit" class="submit-btn">Registrati</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SigninView',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    handleSignin() {
      if (this.password !== this.confirmPassword) {
        alert('Le password non coincidono')
        return
      }
      console.log('Registrazione con:', this.name, this.email)
      // Qui andrà la logica di registrazione
    }
  }
}
</script>