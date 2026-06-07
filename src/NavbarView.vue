<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-links">

<!--        logo esteso e nome da aggiungere-->

<!--        mappa sempre visibile-->
        <router-link to="/map" class="nav-btn">
          Mappa
        </router-link>
        <template v-if="isLoggedIn">
          <!-- loggato: e viewer solo stats-->
          <template v-if="isViewer">
            <router-link to="/stats" class="nav-btn">
              Statistiiche
            </router-link>
<!--            se è operatore può modificare i parcheggi-->
            <template v-if="isOperator">
              <router-link to="/parking" class="nav-btn">
                Aggiorna Parcheggi
              </router-link>
<!--              se admin ha una dasboard a parte-->
              <template v-if="isAdmin">
                <router-link to="/admin" class="nav-btn">
                  Dasboard Admin
                </router-link>
              </template>
            </template>
          </template>


<!--          in forse-->
          <span>
              Benvenuto, {{userEmail}}
          </span>

<!--          profilo-->
          <router-link to="/profilo" class="nav-btn">
            Profilo
          </router-link>

          <!--            logout visibile se loggati-->
          <button @click="logout" class="logout-btn">
            Logout
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-btn">
            Login
          </router-link>
          <router-link to="/signin" class="nav-btn">
            Sign In
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
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
      return true
      // return !!this.userData;
    },

    userEmail(){
      return this.userData?.email || '';
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
    logout(){
      fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: "include"
      }).finally(()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('userAuthority');
        localStorage.removeItem('token');

        this.$router.push('mappa');

        window.dispatchEvent(new CustomEvent('auth-logout'));
      });
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