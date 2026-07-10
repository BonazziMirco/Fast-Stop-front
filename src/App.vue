<template>
  <div id="app">
    <NavBar :key="navbarKey" />
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
  data() {
    return {
      navbarKey: 0
    }
  },
  methods: {
    refreshNavbar() {
      console.log('App: Refresh Navbar');
      this.navbarKey++;
    },

    handleAuthError(error) {
      console.log('App: Errore di autenticazione ricevuto', error);
      if (error && error.response && error.response.status === 401) {
        // Forza il refresh della navbar
        this.refreshNavbar();
      }
    }
  },
  mounted() {
    // Ascolta gli eventi di login/logout
    window.addEventListener('auth-login', () => {
      console.log('App: Evento auth-login ricevuto');
      this.refreshNavbar();
    });

    window.addEventListener('auth-logout', () => {
      console.log('App: Evento auth-logout ricevuto');
      this.refreshNavbar();
    });

    // Ascolta anche i cambiamenti del localStorage
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
    window.removeEventListener('storage', this.refreshNavbar);
  }
}
</script>