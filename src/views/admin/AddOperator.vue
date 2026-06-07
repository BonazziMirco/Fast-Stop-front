
<template>
    <h1>Aggiungi Utente</h1>
  <br>
  <div>
    <table>
      <thead>
      <tr>
        <th>Email</th>
        <th>password</th>
        <th>conferma Password</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <input type="text" id="email" placeholder="Email" required v-model="email" :disabled="loading"/>
        </td>
        <td>
          <input type="text" id="password" placeholder="Password" required v-model="password" :disabled="loading"/>
        </td>
        <td>
          <input type="password" id="checkPassword" placeholder="Conferma Password" required v-model="checkPassword" :disabled="loading"/>
        </td>

      </tr>
      </tbody>
    </table>
    <br>
    <div v-if="message">
      {{message}}
    </div>
    <br>
    <button @click="aggiungiOperatore" :disabled="loading">Aggiungi</button>
  </div>
</template>
<script>

import {post} from '@/service/api'

export default {
  name: 'addOperator',
  data() {
    return {
      email: "",
      checkPassword: "",
      password: "",
      message: null,
      loading: false,
    }
  },
  methods: {
    async aggiungiOperatore() {
      this.loading = true
      this.message=null
      if (this.checkPassword()){
        return
      }
      try{
        await post('/register',{
          email: this.email,
          password: this.password,
        })
            console.log("creazione riuscita")
        this.message='operatore creato con successo'
        this.resetForm()
      }catch(error){
        console.error('Error occured',error)
        this.message=error||'errore durante la creazione'
      }finally{
        this.loading = false
      }
    },

    checkPassword() {
      if (this.checkPassword !== this.password) {
        console.error('le password non coincidono')
        this.message= 'le password non coincidono'
        return false
      }
    },

    resetForm(){
      this.email = ''
      this.password = ''
      this.checkPassword = ''
    }
  }
}
</script>