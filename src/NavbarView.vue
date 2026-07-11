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
        } catch (e) {
          console.error('NavBar: Error parsing user data', e);
          this.clearUserData();
        }
      } else {
        console.log('NavBar: No user data found, clearing');
        this.clearUserData();
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
      // Aspetta il prossimo tick del ciclo di eventi
      this.$nextTick(() => {
        this.updateUserData();
      });
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