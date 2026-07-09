<template>
  <div id="app">
    <NavBar :key="navbarKey" />
    <main>
      <router-view />
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
  mounted() {
    // Ascolta gli eventi di login/logout
    window.addEventListener('auth-login', () => {
      console.log('App: Evento auth-login ricevuto, refresh Navbar');
      this.navbarKey++;
    });

    window.addEventListener('auth-logout', () => {
      console.log(' App: Evento auth-logout ricevuto, refresh Navbar');
      this.navbarKey++;
    });

    // Ascolta anche i cambiamenti del localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'user') {
        console.log(' App: Storage user cambiato, refresh Navbar');
        this.navbarKey++;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('auth-login', () => {});
    window.removeEventListener('auth-logout', () => {});
    window.removeEventListener('storage', () => {});
  }
}
</script>