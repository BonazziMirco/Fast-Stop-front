<template>
  <nav class="bg-white border border-blue-900 rounded-xl mx-4 my-3 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center flex-shrink-0">
x          <img src="../public/logo-esteso.png" alt="logo" class="h-10 w-auto object-contain" />
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
      user: null
    }
  },
  computed:{

    userData(){
      const user = localStorage.getItem('user');
      return user?JSON.parse(user):null;
    },

    //codice momentaneo per testare

    isLoggedIn(){
      return false
      // return !!this.userData;
    },

    //testing
    userEmail(){
      return this.userData?.email || 'riccardo04naps@gmail.com';
    },

    userAuthority(){
      return this.userData?.authority || 0;
    },

    isViewer(){
      return true
      // return this.isLoggedIn && this.userAuthority >=1;
    },

    isOperator(){
      return true
      // return this.isLoggedIn && this.userAuthority >=2;
    },

    isAdmin(){
      return true
      // return this.isLoggedIn && this.userAuthority >=3;
    }


  },
  methods:{
    //logout
    async logout() {
      try {
        // Chiamata al backend usando la funzione post
        await post('/auth/logout')
        console.log('Logout effettuato con successo')
      } catch (error) {
        console.error('Errore durante il logout:', error)
        // Anche se c'è un errore, procedi comunque con il logout locale
      } finally {
        // Pulisci i dati locali in ogni caso
        localStorage.removeItem('user')
        localStorage.removeItem('userAuthority')
        localStorage.removeItem('token')

        // Reindirizza alla mappa
        this.$router.push('/map')

        // Notifica gli altri componenti del logout
        window.dispatchEvent(new CustomEvent('auth-logout'))
      }
    },

    getUserRoleName() {
      const authority = this.userAuthority;
      if (authority >= 3) return 'Admin';
      if (authority >= 2) return 'Operator';
      if (authority >= 1) return 'Viewer';
      if (authority >= 0) return 'User';
      return 'Ospite'
    },

    created(){
      window.addEventListener('auth.login', ()=>{
        this.user = this.userData;
      });

      window.addEventListener('auth-logout', ()=>{
        this.user = null;
      })
    }
  }
}
</script>