<template>
  <nav class="flex bg-white border border-blue-900 rounded-xl mx-4 my-3 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0">
          <img src="../public/logo-esteso.png" alt="logo" class="h-10 w-auto object-contain" />
        </div>

        <!-- Benvenuto (solo desktop) -->
        <div v-if="isLoggedIn" class="hidden md:flex items-start gap-3">
          <span class="text-blue-950 text-base font-medium font-['Comic_Sans_MS'] italic border-l-2 border-gray-300 pl-4">
            Benvenuto, {{ userEmail }}
          </span>
        </div>

        <!-- Sezione destra - Desktop -->
        <div class="hidden md:flex items-start gap-4 flex-wrap">
          <!-- Profilo -->
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

          <!-- Link di navigazione desktop -->
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

        <!-- Menu Hamburger per Mobile -->
        <div class="md:hidden flex items-center gap-2">
          <!-- Versione mobile del benvenuto (semplificata) -->
          <span v-if="isLoggedIn" class="text-blue-950 text-sm font-medium truncate max-w-[120px]">
            {{ userEmail }}
          </span>

          <button
              @click="toggleMobileMenu"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle menu"
          >
            <svg
                class="w-6 h-6 text-blue-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu Mobile a tendina -->
      <div
          v-if="mobileMenuOpen"
          class="md:hidden py-4 border-t border-gray-200 space-y-2"
      >
        <!-- Link di navigazione mobile -->
        <router-link
            to="/map"
            class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
            active-class="bg-red-100"
            @click="closeMobileMenu"
        >
          Mappa
        </router-link>

        <template v-if="isLoggedIn">
          <router-link
              to="/profilo"
              class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
              active-class="bg-red-100"
              @click="closeMobileMenu"
          >
            Profilo
          </router-link>

          <template v-if="isViewer">
            <router-link
                to="/stats"
                class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
                active-class="bg-red-100"
                @click="closeMobileMenu"
            >
              Statistiche
            </router-link>

            <template v-if="isOperator">
              <router-link
                  to="/parking"
                  class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
                  active-class="bg-red-100"
                  @click="closeMobileMenu"
              >
                Aggiorna Parcheggi
              </router-link>

              <template v-if="isAdmin">
                <router-link
                    to="/admin"
                    class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    active-class="bg-red-100"
                    @click="closeMobileMenu"
                >
                  Dashboard Admin
                </router-link>
              </template>
            </template>
          </template>

          <!-- Logout mobile -->
          <button
              @click="handleMobileLogout"
              class="block w-full text-left px-4 py-2 text-white bg-blue-800 rounded-lg hover:bg-blue-950 transition-all duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </template>

        <!-- Login/Signin per non loggati (mobile) -->
        <template v-else>
          <router-link
              to="/login"
              class="block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 transition-all duration-200 text-sm font-medium text-center"
              active-class="bg-blue-700"
              @click="closeMobileMenu"
          >
            Login
          </router-link>
          <router-link
              to="/signin"
              class="block px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium text-center"
              active-class="bg-red-700"
              @click="closeMobileMenu"
          >
            Sign In
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import {post, get} from "@/service/api.js";

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
      isAdmin: false,
      mobileMenuOpen: false
    }
  },

  methods:{
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
    },

    handleMobileLogout() {
      this.closeMobileMenu();
      this.logout();
    },

    updateUserData() {
      console.log('NavBar: updateUserData called');

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
      this.closeMobileMenu();
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
        const response = await get('/auth/checkSession', {});
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
        localStorage.removeItem('user');
        localStorage.removeItem('userAuthority');
        localStorage.removeItem('token');

        this.clearUserData();

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

      const updated = this.updateUserData();

      if (!updated && event.detail && event.detail.user) {
        console.log('NavBar: Uso i dati dall\'evento per aggiornare');
        const userData = event.detail.user;
        const authority = userData.authority || 0;

        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('NavBar: Token non trovato!');
          return;
        }

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
    this.$nextTick(() => {
      this.updateUserData();
    });

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