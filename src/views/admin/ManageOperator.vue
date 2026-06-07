
<template>

  <div class="filter-button">
    <button @click="filterOpen" :disabled="loading">
      Filtra
    </button>
  </div>

  <div class="filter-popUp" v-if="showFilterPopUp">
    <h3>Filtra Operatori</h3>

    <div>
      <label>Email:</label>
      <input type="text" v-model="filters.email" placeholder="Email">
    </div>

    <div>
      <label>Ruolo:</label>
      <select v-model="filters.role">
        <option value="">tutti</option>
        <option value="user">Utenti</option>
        <option value="viewer">Osservatori</option>
        <option value="operator">Operatori</option>
      </select>
    </div>

    <div>
      <label>Stato:</label>
      <select v-model="filters.state">
        <option value="">tutti</option>
        <option value="attivo">Attivo</option>
        <option value="sospeso">Sospeso</option>
      </select>
    </div>

    <div class="button-popUp">
      <button @click="filterApply">Applica filtri</button>
      <button @click="filterReset">Resetta</button>
      <button @click="filterClose">Annulla</button>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
      <tr>
        <th>email</th>
        <th>ruolo</th>
        <th>stato</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="user in users"
        :key='user.id'
        @click="selectUser(user)"
        :class="{selected: selectedUser && selectedUser.id === users.id}"
        class="user-row"
        >
        <td>{{user.email}}</td>
        <td>
          <span>{{user.role}}</span>
        </td>
        <td>
          <span>{{user.sospeso ? 'sospeso' : 'attivo'}}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div class="buttons">
    <button
      @click="sospendi"
      :disabled="!selectedUser||!loading||!selectedUser.sospeso"
      >
      Sospendi
    </button>
    <button
    @click="riattiva"
    :disabled="!selectedUser||!loading||selectedUser.sospeso"
    >
      riattiva
    </button>
    <button
        @click="elimina"
        :disabled="!selectedUser||!loading"
    >
      elimina
    </button>

  </div>

  <div v-if="showConfirm">
    <div class="popup-content">
      <h3>Conferma Azione</h3>
      <p>{{confirmMessage}}</p>
      <div class="buttons">
        <button @click="confirm">Conferma</button>
        <button @click="back">Annulla</button>
      </div>
    </div>
  </div>

  <div v-if="message">message</div>

</template>

<script>
import {get,patch,del} from '@/service/api.js'

export default {
  name: "manageOperator",
  data() {
    return {
      users: [],
      selectedUser: null,
      loading:false,
      message:'',

      //popup
      showConfirm: false,
      confirmMessage: "",
      pendingAction: null,

      //popup filtro
      showFilterPopUp: false,
      filters: {
        role:'',
        state:'',
        email:'',
      },
      originalUsers:[],
    }
  },

  computed: {
    filteredUsers(){
      let result = [...this.users]

      //ruolo
      if(this.filters.role){
        result = result.filter(user=>user.role===this.filters.role)
      }
      //stato
      if(this.filters.state){
        if (this.filters.state==='attivo' ) {
          result=result.filter(user=>!user.sospeso)
        }
        else if(this.filters.state==='sospeso' ) {
          result=result.filter(user=>user.sospeso)
        }
      }
      //email
      if(this.filters.email&&this.filters.email.trim()){
        const searchTerm=this.filters.email.toLowerCase().trim()
        result = result.filter(user=>user.email.toLowerCase().includes(searchTerm))
      }
      return result
    }
  },
  mounted() {
    this.createTable()
  },

  methods: {
    async createTable() {
      this.loading = true
      this.message=null
      try{
      const data = await get('/users')
        //filter
        this.users = data
            //vedere se role è string o numero (admin = 3)
            .filter(user => user.role !== 3)
            .map(user => ({
              ...user,
              sospeso: user.sospeso||false
            }))
        this.originalUsers = [...this.users];
      }catch(error){
        console.error(error)
        this.message=error||'errore durante la creazione'
      }finally{
        this.loading = false
      }
    },

    selectUser(user){
      if(this.selectedUser && this.selectedUser.id === user.id){
        this.selectedUser = null
      }else{
        this.selectedUser = user
      }
    },
    //sospendi
    sospendi(){
      if(!this.selectedUser) return

      this.confirmMessage= `Sospendere ${this.selectedUser.email}?`
      this.pendingAction = 'suspend'
      this.showConfirm = true
    },
    riattiva(){
      if(!this.selectedUser) return

      this.confirmMessage= `Riattivare ${this.selectedUser.email}?`
      this.pendingAction = 'activate'
      this.showConfirm = true
    },


    elimina() {
      if (!this.selectedUser) return
      this.confirmMessage= `Eliminare definitivamente ${this.selectedUser.email}? Questa azione è irreversibile.`
      this.pendingAction = 'delete'
      this.showConfirm = true
    },

    async confirm(){
      this.showConfirm=false
      this.loading = true

      try{
        switch(this.pendingAction){
          case 'suspend':
            await patch(`/users/${this.selectedUser.id}/suspend`, {sospeso:true})
                alert(`${this.selectedUser.email} sospeso!`)
                break
          case 'activate':
            await patch(`/users/${this.selectedUser.id}/suspend`, {sospeso:false})
            alert(`${this.selectedUser.email} riattivato!`)
            break
          case 'delete':
            await del(`/users/${this.selectedUser.id}`)
                alert(`${this.selectedUser.email} eliminato!`)
                this.selectedUser = null
                break
        }
        await this.createTable()
      }catch(error){
        console.error(error)
        this.message=error||'errore durante il caricamento'
      }finally {
        this.loading = false
        this.pendingAction = null
      }
    },

    back(){
      this.showConfirm=false
      this.pendingAction = null
    },

    // getRoleName(role){
    //   const roles = {
    //     0:'User'
    //     1:'Viewer',
    //     2:'Operator',
    //     3:'Admin'
    //   }
    //   return roles[role]||role
    // }

    //filtroooo
    filterOpen(){
      this.showFilterPopUp=true
    },
    filterClose(){
      this.showFilterPopUp=false
    },
    filterApply(){
      this.showFilterPopUp=false
    },
    filterReset(){
      this.filters={
        role:'',
        state:'',
        email:'',
      }
    },

  }


}
</script>

