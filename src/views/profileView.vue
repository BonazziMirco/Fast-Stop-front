<template xmlns="http://www.w3.org/1999/html">

<!-- immagine profio cazzata pensata, email, cambia password, targa e cambia targa-->
  <div class="container">
    <h1>Profilo</h1>
  </div>
  <h6>immagine</h6>

  <div class="email">
    <label>E-mail:</label>
    <p>{{userEmail}}</p>
    <!-- modifica email -->
  </div>

  <div class="password">
    <button v-if="popUpPassword" @click="mostraPassword" class="btn">
      cambia password
    </button>
    <div v-else>
      <label for="oldPassword">Vecchia Password:</label>
      <input
          type="password"
          id="oldPassword"
          v-model="oldPassword"
          required
          :disabled="loading"
      >
      <br>
      <label for="newPassword">Nuova Password:</label>
      <input
          type="password"
          id="newPassword"
          v-model="newPassword"
          required
          :disabled="loading"
      >
      <br>
      <label for="checkPassword">Conferma Password:</label>
      <input
          type="password"
          id="checkPassword"
          v-model ="checkPassword"
          required
          :disabled="loading"
      >
      <br>
      <div v-if="passwordMsg">
        <p> {{ passwordMsg }} </p>
      </div>
      <br>
      <button @click="confermaCambioPassword" class="btn">
        conferma
      </button>
    </div>
  </div>

  <div class="targa">
    <label>Targa:</label>
    <p>{{userTarga}}</p>
    <button v-if="popUpTarga" @click="mostraTarga" class="btn">
      cambia targa
    </button>
    <div v-else>
      <label for="passwordTarga">Password:</label>
      <input
        type="password"
        id="passwordTarga"
        v-model="passwordTarga"
        required
        :disabled="loading"
      >
      <br>
      <label for="newTarga">Nuova Targa:</label>
      <input
        type="text"
        id="newTarga"
        v-model="newTarga"
        required
        :disabled="loading"
      >
      <br>
      <div v-if="targaMsg">
        <p> {{ targaMsg }} </p>
      </div>

      <button @click="cambioTarga">
        conferma
      </button>
    </div>

  </div>

</template>
<script >

import {get, patch} from '../service/api'
export default {
  name: 'profileView',
  data() {
    return {
      userEmail: '',
      userTarga: '',
      userRole: '',
      loading: false,

      //password
      popUpPassword: true,
      passwordMsg: null,
      oldPassword: '',
      newPassword: '',
      checkPassword: '',

      //targa
      newTarga: '',
      popUpTarga: true,
      targaMsg: null,
      passwordTarga: '',


    }
  },

  mounted() {
    this.caricaProfilo()
  },

  methods: {
    async caricaProfilo() {
      this.loading = true
      try {
        const data = await get('/profile')
        this.userEmail = data.email
        this.userTarga = data.targa
        this.userRole = data.role
      }catch(error) {
        console.error('errore caricamento profilo:',error)
        if (error.status === 401) {
        alert('sessione scaduta. riaccedi')
        //reindirizza
        this.$router.push('/login')
        }
        else{
          alert(error.message || 'errore nel caricamento del profilo')
        }
      } finally {

        this.loading = false
      }
    },

    mostraPassword() {
      this.popUpPassword = false;
      this.popUpTarga = true
    },

    async confermaCambioPassword() {
      if (!this.oldPassword || !this.newPassword || !this.checkPassword) {
        this.passwordMsg = 'Compila tutti i campi'
        return
      }
      if(this.newPassword !== this.checkPassword){
        this.passwordMsg = "le password non coincidono"
        return;
      }
      if (this.newPassword.length < 6) {
        this.passwordMsg = "La password deve essere di almeno 6 caratteri"
        return
      }

      this.loading = true
      this.passwordMsg = null

        try{
          await patch('http://localhost:3000/profile/password',{
              oldPassword: this.oldPassword,
              newPassword: this.newPassword
          })

          console.log("cambio riuscito")

          this.$router.push('/login');
        }
        catch(error) {
          this.passwordMsg = error||'errore nel cambio password'
          console.error('errore nel cambio password:',error)
        }
        finally{
          this.loading = false
        }

    },

    mostraTarga() {
      this.popUpTarga = false;
      this.popUpPassword = true;
    },

    async cambioTarga() {
      if (!this.newTarga || this.newTarga.length < 2) {
        this.targaMsg = 'Inserisci una targa valida';
        return;
      }

      this.loading = true
      this.targaMsg = null

      try{
         await patch('http://localhost:3000/profile/car-plate',{
            password: this.passwordTarga,
            car_plate: this.newTarga.toUpperCase().trim(),
         })
        console.log("cambio riuscito")
        // aggiorna targa
      }
      catch(error) {
        this.targaMsg = error||'errore nel cambio password'
        console.error('errore nel cambio password:',error)
      }
      finally{
        this.loading = false
      }


    }
  },

}
</script>