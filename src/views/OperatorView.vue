<template>

  <div class="parking-list">
    <table>
      <thead>
      <tr>
        <td>Parcheggio</td>
        <td>Zona</td>
        <td>Posti</td>
        <td>Stato</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="lot in lots"
          :key="lot.id"
          @click="selectLot(lot)"
          :class="{selected: selectedLot && selectedLotId===lot.id}"
          class="lot-row"
          >
        <td>{{lot.name}}</td>
        <td>{{lot.zone}}</td>
        <td>{{lot.spots}}</td>
        <td>{{lot.state=== 1? 'Aperto': 'Chiuso'}}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <div class="button-action">
    <button v-if="modify" @click="showForm">Modifica</button>
    <form v-else @submit.prevent="submitForm">
      <label>Nome parcheggio:</label>
      <input v-model="formData.name"
             type="text"
             :disabled="loading"
             required
      />
      <label>Zona:</label>
      <select v-model="formData.zone"
              :disabled="loading">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <label>Posti:</label>
      <input type="number"
             v-model="formData.spots"
             :disabled="loading"
             min="0"
             required
      >
      <label>Stato:</label>
      <select v-model="formData.state"
              :disabled="loading"
      >
        <option value="0">chiuso</option>
        <option value="1">aperto</option>
      </select>
      <button type="submit" :disabled="loading">Conferma Modifiche</button>
      <button type="button" @click="resetForm" :disabled="loading">Ripristina</button>

    </form>
  </div>


</template>

<script >
import {get, patch} from '@/service/api.js'

export default {
  name: 'OperatorView',
  data() {
    return {
      loading:false,
      saving:false,
      formData:{
        name:'',
        zone:'',
        spots:'',
        state:'',
      },
      lots:[],
      modify:true,
      selectedLotId:null,
      selectedLot:null, //parcheggio selezionato(oggetto)
      originalData:{}, //copia dei dati originali
    }
  },

  mounted(){
    this.uploadParking()
  },

  methods: {
    async uploadParking() {
      this.loading = true
      this.lots = []
      try {
        for (let zoneId = 0; zoneId <= 2; zoneId++) {
          try {
            const data = await get(`/zones/${zoneId}/lots`)
            const parkings = data.lots || data

            if (Array.isArray(parkings)) {
              parkings.forEach(parking => {
                parking.zone = zoneId
              })
              this.lots.push(...parkings)
            }
          } catch (error) {
            console.log(error)
          }
        }

        console.log('parcheggi caricati')

      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    selectLot(lot){
      if(this.selectedLot && this.selectedLotId===lot.id) {
        this.selectedLot = null //deseleziona
        this.selectedLotId = null
      }else{
        this.selectedLot = lot //seleziona
        this.selectedLotId = lot.id
      }
    },

    showForm(){
      if (!this.selectedLot){
        alert('Seleziona parcheggio')
        return
      }
      //form compilato
      this.formData={
        name: this.selectedLot.name || '',
        zone: this.selectedLot.zone || '',//forse da tostringare
        spots: this.selectedLot.spots,
        state: this.selectedLot.state !== undefined ? this.selectedLot.state : 1,
      }

      //salva originale
      this.originalData = {...this.formData}

      this.modify = false
    },

    async submitForm(){
      if(!this.selectedLot){
        alert('Seleziona parcheggio')
        return
      }
      const hasChanges = JSON.stringify(this.formData) !== JSON.stringify(this.originalData)
      if(!hasChanges){
        alert('nessuna modifica')
        return
      }
      this.saving = true
      this.loading = true

      try {
        const updates  = {}
        if (this.formData.name !== this.originalData.name) {
        updates.name = this.formData.name
        }
        if(this.formData.spots!==this.originalData.spots){
          updates.spots = this.formData.spots
        }
        if(this.formData.state !== this.originalData.state){
          updates.state = this.formData.state
        }
        if(this.formData.zone !== this.originalData.zone){
          updates.zone = this.formData.zone
        }

        await patch(`/parkings/${this.selectedLot.id}`, updates)
        alert('parcheggio modificato con successo')
        await this.uploadParking()

        //reset
        this.resetForm()
        this.modify = true
        this.selectedLotId = null
      }catch(error){
        console.log(error)
      }finally{
        this.loading = false
        this.saving = false
      }
    },

    resetForm(){
      this.formData = {
        name:'',
        zone:'',
        spots:'',
        state:'',
      }
      this.originalData = {}
      this.modify = true
    }
  }


}
</script>