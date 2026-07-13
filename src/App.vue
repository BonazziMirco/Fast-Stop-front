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
      this.$nextTick(() => {
        if (this.$refs.navbar) {
          this.$refs.navbar.forceRefresh();
        }
      });
    },

    handleAuthError(error) {
      console.log('App: Errore di autenticazione ricevuto', error);

      const status = error?.response?.status || error?.status;

      if (status === 401) {
        console.log('App: Sessione scaduta - eseguo logout globale');

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userAuthority');

        window.dispatchEvent(new CustomEvent('auth-logout', {
          detail: { sessionExpired: true }
        }));

        this.refreshNavbar();

        if (this.$route.path !== '/login' && this.$route.path !== '/signin') {
          this.$router.push('/login');
        }
      }
    },

    handleWindowAuthError(event) {
      this.handleAuthError(event.detail);
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('auth-login', this.refreshNavbar);
      window.addEventListener('auth-logout', this.refreshNavbar);
      window.addEventListener('auth-error', this.handleWindowAuthError);

      window.addEventListener('storage', (e) => {
        if (e.key === 'user' || e.key === 'token') {
          console.log('App: Storage cambiato, refresh Navbar');
          this.refreshNavbar();
        }
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener('auth-login', this.refreshNavbar);
    window.removeEventListener('auth-logout', this.refreshNavbar);
    window.removeEventListener('auth-error', this.handleWindowAuthError);
  }
}
</script>