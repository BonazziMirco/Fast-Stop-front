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
      sessionCheckInterval: null
    }
  },

  computed:{


    userData(){
      const userData = localStorage.getItem('user');
      return userData?JSON.parse(userData):null;
    },

    //codice momentaneo per testare

    isLoggedIn(){
      return !!this.userData && !!localStorage.getItem('token');
    },

    //testing
    userEmail(){
      return this.userData?.email ;
    },

    userAuthority(){
      return this.userData?.authority ;
    },

    isViewer(){
      return this.isLoggedIn && this.userAuthority >=1;
    },

    isOperator(){
      return this.isLoggedIn && this.userAuthority >=2;
    },

    isAdmin(){
      return this.isLoggedIn && this.userAuthority >=3;
    }


  },

  methods:{
    //logout
    async logout() {
      await this.performLogout(false);
    },

    async checkSessionValidity() {
      if (!this.isLoggedIn) return;

      try {
        const response = await post('/auth/check-session', {});

      }catch (error) {
        console.error('Errore durante il check della sessione:', error);
        // Se c'è un errore (es. 401), considera la sessione scaduta
        if (error.response && error.response.status === 401) {
          this.handleSessionExpired();
        }
      }

    },

    handleSessionExpired() {
      console.log('Sessione scaduta - eseguo logout automatico');
      this.performLogout(true); // true = sessione scaduta
    },

    //  Metodo unificato per il logout
    async performLogout(isSessionExpired = false) {
      try {
        // Se non è una sessione scaduta, chiama il backend
        if (!isSessionExpired) {
          await post('/auth/logout');
          console.log('Logout effettuato con successo');
        }
      } catch (error) {
        console.error('Errore durante il logout:', error);
      } finally {
        // Pulisci i dati locali in ogni caso
        localStorage.removeItem('user');
        localStorage.removeItem('userAuthority');
        localStorage.removeItem('token');

        this.user = null;

        // Notifica gli altri componenti del logout
        window.dispatchEvent(new CustomEvent('auth-logout', {
          detail: { sessionExpired: isSessionExpired }
        }));

        // Se la sessione è scaduta, mostra un messaggio all'utente
        if (isSessionExpired) {
          alert('La tua sessione è scaduta. Effettua nuovamente il login.');
        }

        // Reindirizza alla mappa se non è già sulla pagina di login
        if (this.$route.path !== '/login' && this.$route.path !== '/signin') {
          this.$router.push('/map');
        }
      }
    },

    //  Avvia il controllo periodico della sessione
    startSessionCheck() {

      if(!this.isLoggedIn){
        return;
      }
      this.stopSessionCheck(); // Pulisci eventuali interval precedenti

      // Controlla ogni 30 secondi se la sessione è ancora valida
      this.sessionCheckInterval = setInterval(() => {
        this.checkSessionValidity();
      }, 30000); // 30 secondi
    },

    //  Ferma il controllo periodico della sessione
    stopSessionCheck() {
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }
    },

    //  Forza un controllo immediato della sessione
    forceSessionCheck() {
      this.checkSessionValidity();
    },

    //  Aggiorna handleLogin
    handleLogin(event) {
      console.log('NavBar: Evento auth-login ricevuto', event.detail);
      this.user = this.userData;
      // Riavvia il check della sessione
      this.startSessionCheck();
    },

    // Aggiorna handleLogout
    handleLogout() {
      console.log('NavBar: Evento auth-logout ricevuto');
      this.user = null;
      // Ferma il check della sessione
      this.stopSessionCheck();
    },


    getUserRoleName() {
      const authority = this.userAuthority;
      if (authority >= 3) return 'Admin';
      if (authority >= 2) return 'Operator';
      if (authority >= 1) return 'Viewer';
      if (authority >= 0) return 'User';
      return 'Ospite'
    },



  },

  created(){
    console.log('NavBar created');

    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData):null;

    // Registra gli event listener
    window.addEventListener('auth-login', this.handleLogin);
    window.addEventListener('auth-logout', this.handleLogout);

    if (this.isLoggedIn) {
      this.startSessionCheck();

      this.checkSessionValidity();
    }
  },

  //  AGGIUNTO: Cleanup degli event listener
  beforeDestroy() {
    console.log('NavBar beforeDestroy - Cleanup');
    window.removeEventListener('auth-login', this.handleLogin);
    window.removeEventListener('auth-logout', this.handleLogout);

    this.stopSessionCheck();
  }

}
</script>