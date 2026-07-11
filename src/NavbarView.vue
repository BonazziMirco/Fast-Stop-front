<template>
  <nav class="flex bg-white border border-blue-900 rounded-xl mx-4 my-3 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0">
          <img src="../public/logo-esteso.png" alt="logo" class="h-10 w-auto object-contain" />
        </div>

        <div v-if="isLoggedIn" class="flex items-start gap-3">
            <span class="text-blue-950 text-base font-medium font-['Comic_Sans_MS'] italic border-l-2 border-gray-300 pl-4">
              Benvenuto, {{ userEmail }}
            </span>
        </div>


        <!-- Sezione destra -->
        <div class="flex items-start gap-4 flex-wrap">
          <!-- Benvenuto e Profilo -->
          <div v-if="isLoggedIn" class="flex items-center gap-3">
            <router-link
                to="/profilo"
                class="px-4 py-2 text-red-600 rounded-lg hover:bg-red-200 hover:border-red-300 transition-all duration-200 text-sm font-medium"
                active-class="bg-red-100 border border-red-300"
            >
              Profilo
            </router-link>
          </div>

          <div class="w-px h-8 bg-gray-200"></div>

          <!-- Link di navigazione -->
          <div class="flex items-center gap-2 flex-wrap">
            <router-link
                to="/map"
                class="px-4 py-2 text-red-600 hover:bg-red-200 hover:border-red-300 border border-transparent rounded-lg transition-all duration-200 text-sm font-medium"
                active-class="bg-red-100 border border-red-300"
            >
              Mappa
            </router-link>

            <template v-if="isLoggedIn">
              <template v-if="isViewer">
                <router-link
                    to="/stats"
                    class="px-4 py-2 text-red-600 hover:bg-red-200 hover:border-red-300 border border-transparent rounded-lg transition-all duration-200 text-sm font-medium"
                    active-class="bg-red-100 border border-red-300"
                >
                  Statistiche
                </router-link>

                <template v-if="isOperator">
                  <router-link
                      to="/parking"
                      class="px-4 py-2 text-red-600 hover:bg-red-200 hover:border-red-300 border border-transparent rounded-lg transition-all duration-200 text-sm font-medium"
                      active-class="bg-red-100 border border-red-300"
                  >
                    Aggiorna Parcheggi
                  </router-link>

                  <template v-if="isAdmin">
                    <router-link
                        to="/admin"
                        class="px-4 py-2 text-red-600 hover:bg-red-200 hover:border-red-300 border border-transparent rounded-lg transition-all duration-200 text-sm font-medium"
                        active-class="bg-red-100 border-red-300"
                    >
                      Dashboard Admin
                    </router-link>
                  </template>
                </template>
              </template>

              <!-- Logout -->
              <button
                  @click="logout"
                  class="px-4 py-2 text-white bg-blue-800 border border-blue-300 rounded-lg hover:bg-blue-950 hover:border-blue-400 transition-all duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </template>

            <!-- Login/Signin per non loggati -->



            <template v-else>
              <router-link
                  to="/login"
                  class="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-800 hover:border-blue-800 transition-all duration-200 text-sm font-medium"
                  active-class="bg-blue-700 border-blue-700"
              >
                Login
              </router-link>
              <router-link
                  to="/signin"
                  class="px-4 py-2 text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 hover:border-red-700 transition-all duration-200 text-sm font-medium"
                  active-class="bg-red-700 border-red-700"
              >
                Sign In
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {post} from "@/service/api.js";

export default {
  name: 'NavBar',

  data(){
    return {
      user: null,
      sessionCheckInterval: null,
      isLoggedIn: false,
      userEmail: '',
      userAuthority: 0,
      isViewer: false,
      isOperator: false,
      isAdmin: false
    }
  },

  methods:{
    updateUserData() {
      console.log('NavBar: updateUserData called');

      // Leggi direttamente dal localStorage
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('user');

      console.log('NavBar: localStorage check:', {
        token: token ? 'presente' : 'assente',
        userData: userDataStr ? 'presente' : 'assente'
      });

      if (userDataStr && token) {
        try {
          const userData = JSON.parse(userDataStr);
          const authority = userData.authority || 0;

          this.user = userData;
          this.isLoggedIn = true;
          this.userEmail = userData.email || '';
          this.userAuthority = authority;
          this.isViewer = authority >= 1;
          this.isOperator = authority >= 2;
          this.isAdmin = authority >= 3;

          console.log('NavBar: User data updated', {
            email: this.userEmail,
            authority: this.userAuthority
          });

          // Avvia il controllo sessione
          this.startSessionCheck();
          return true;
        } catch (e) {
          console.error('NavBar: Error parsing user data', e);
          this.clearUserData();
          return false;
        }
      } else {
        console.log('NavBar: No user data found, clearing');
        this.clearUserData();
        return false;
      }
    },

    clearUserData() {
      this.user = null;
      this.isLoggedIn = false;
      this.userEmail = '';
      this.userAuthority = 0;
      this.isViewer = false;
      this.isOperator = false;
      this.isAdmin = false;
      this.stopSessionCheck();
      console.log('NavBar: User data cleared');
    },

    forceRefresh() {
      console.log('NavBar: Force refresh');
      this.updateUserData();
    },

    async logout() {
      await this.performLogout(false);
    },

    async checkSessionValidity() {
      if (!this.isLoggedIn) return;

      try {
        const response = await post('/auth/check-session', {});
        console.log('Session check response:', response);
      } catch (error) {
        console.error('Errore durante il check della sessione:', error);
        if (error.response && error.response.status === 401) {
          this.handleSessionExpired();
        }
      }
    },

    handleSessionExpired() {
      console.log('Sessione scaduta - eseguo logout automatico');
      this.performLogout(true);
    },

    async performLogout(isSessionExpired = false) {
      try {
        if (!isSessionExpired) {
          await post('/auth/logout');
          console.log('Logout effettuato con successo');
        }
      } catch (error) {
        console.error('Errore durante il logout:', error);
      } finally {
        // Pulisci i dati locali
        localStorage.removeItem('user');
        localStorage.removeItem('userAuthority');
        localStorage.removeItem('token');

        // Pulisci i dati del componente
        this.clearUserData();

        // Notifica il logout
        window.dispatchEvent(new CustomEvent('auth-logout', {
          detail: { sessionExpired: isSessionExpired }
        }));

        if (isSessionExpired) {
          alert('La tua sessione è scaduta. Effettua nuovamente il login.');
        }

        if (this.$route.path !== '/login' && this.$route.path !== '/signin') {
          this.$router.push('/map');
        }
      }
    },

    startSessionCheck() {
      if (!this.isLoggedIn) {
        return;
      }
      this.stopSessionCheck();
      console.log('NavBar: Avvio controllo sessione ogni 30 secondi');
      this.sessionCheckInterval = setInterval(() => {
        this.checkSessionValidity();
      }, 30000);
    },

    stopSessionCheck() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
        console.log('NavBar: Controllo sessione fermato');
      }
    },

    forceSessionCheck() {
      this.checkSessionValidity();
    },

    handleLogin(event) {
      console.log('NavBar: Evento auth-login ricevuto', event.detail);

      // Prima prova a leggere dal localStorage
      const updated = this.updateUserData();

      // Se non trova i dati, usa quelli dall'evento
      if (!updated && event.detail && event.detail.user) {
        console.log('NavBar: Uso i dati dall\'evento per aggiornare');
        const userData = event.detail.user;
        const authority = userData.authority || 0;

        // Verifica se il token è presente
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('NavBar: Token non trovato!');
          return;
        }
        // Aggiorna i dati del componente
        this.user = userData;
        this.isLoggedIn = true;
        this.userEmail = userData.email || '';
        this.userAuthority = authority;
        this.isViewer = authority >= 1;
        this.isOperator = authority >= 2;
        this.isAdmin = authority >= 3;

        console.log('NavBar: User data updated from event ');
        this.startSessionCheck();
      }
    },

    handleLogout() {
      console.log('NavBar: Evento auth-logout ricevuto');
      this.clearUserData();
    },

    handleStorageChange(event) {
      if (event.key === 'user' || event.key === 'token') {
        console.log('NavBar: Storage changed:', event.key);
        this.updateUserData();
      }
    },

    getUserRoleName() {
      const authority = this.userAuthority;
      if (authority >= 3) return 'Admin';
      if (authority >= 2) return 'Operator';
      if (authority >= 1) return 'Viewer';
      if (authority >= 0) return 'User';
      return 'Ospite';
    },
  },

  created(){
    console.log('NavBar created');
    // Aspetta che il componente sia montato prima di leggere i dati
    this.$nextTick(() => {
      this.updateUserData();
    });

    // Registra gli event listener
    window.addEventListener('auth-login', this.handleLogin);
    window.addEventListener('auth-logout', this.handleLogout);
    window.addEventListener('storage', this.handleStorageChange);
  },

  beforeDestroy() {
    console.log('NavBar beforeDestroy - Cleanup');
    window.removeEventListener('auth-login', this.handleLogin);
    window.removeEventListener('auth-logout', this.handleLogout);
    window.removeEventListener('storage', this.handleStorageChange);
    this.stopSessionCheck();
  }
}
</script>