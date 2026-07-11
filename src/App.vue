<template>
  <div id="app">
    <NavBar ref="navbar" />
    <main>
      <router-view @auth-error="handleAuthError" />
    </main>
  </div>
</template>

<script>
import NavBar from './NavbarView.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  methods: {
    refreshNavbar() {
      console.log('App: Refresh Navbar');
      if (this.$refs.navbar) {
        this.$refs.navbar.forceRefresh();
      }
    },

    handleAuthError(error) {
      console.log('App: Errore di autenticazione ricevuto', error);
      if (error && error.response && error.response.status === 401) {
        this.refreshNavbar();
      }
    }
  },
  mounted() {
    // Ascolta gli eventi di login/logout
    window.addEventListener('auth-login', this.refreshNavbar);
    window.addEventListener('auth-logout', this.refreshNavbar);

    // Ascolta cambiamenti localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('App: Storage cambiato, refresh Navbar');
        this.refreshNavbar();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('auth-login', this.refreshNavbar);
    window.removeEventListener('auth-logout', this.refreshNavbar);
  }
}
</script>