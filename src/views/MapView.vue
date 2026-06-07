<template>
  <div class="view-container">
    <h2>Mappa dei Parcheggi</h2>
    <div class="map-placeholder">
      <!-- Qui andrà la mappa interattiva -->
      <p>Mappa dei parcheggi disponibili</p>
      <div class="buttons">
        Seleziona Zona:
        <select id="zones" v-model="selectedZoneId" :disabled="loading" @change="onZoneChange">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <select v-if="selectedZoneId && lots.length>0" id="lots" v-model="selectedLotId" :disabled="loading">
          <option value=""> Tutte</option>
          <option v-for="lot in lots"
                  :value="lot.id"
                  :key="lot.id"
                  >
            {{ lot.name }}
          </option>
        </select>
      </div>
      <button @click="selectionConfirm" :disabled="loading">
        Conferma
      </button>
<!--      <div>mappa</div>-->
    </div>
    <div v-if="selectedLot">
      <p>Posti Liberi: {{freeSpot}}</p>
      <p>Posti Totali: {{totalSpot}}</p>
    </div>
  </div>
</template>

<script>
import {get} from '@/service/api.js'
export default {
  name: 'MapView',
  data(){
    return {
      lots:[],
      selectedLot: null,
      selectedLotId:'',
      loading:false,
      freeSpot:'',
      totalSpot:'',
      selectedZoneId:'',}
  },

  watch: {

    selectedLotId(newId) {
      if (newId) {
        this.selectedLot = this.lots.find(lot => lot.id === newId)
        if(this.selectedLot){
          this.freeSpot = this.selectedLot.freeSpot
          this.totalSpot = this.selectedLot.totalSpot
        }
      } else {
        this.selectedLot = null
      }
    }

  },

  methods:{
    async loadLots(){
      this.loading = true
      try{
        const data = await get(`/zones/${this.selectedZoneId}/lots`)
        this.lots = data.lots ||data

        if (this.lots.length > 0){
          this.selectedLotId = this.lots[0].id
        } else {
          this.selectedLotId =''
          this.selectedLot=null
        }
      }catch(error){
        console.log(error)
        this.lots=[]
      }finally {
        this.loading = false
      }
    },

    async onZoneChange(){
      if(!this.selectedZoneId){
        this.lots=[]
        this.selectedLotId = ''
        this.selectedLot =null
        return;
      }

      await this.loadLots()
    },

    selectionConfirm(){
      if (!this.selectedZoneId){
        alert('Seleziona parcheggio')
        return
      }

      if (!this.selectedLotId && this.lots.length > 0){
        alert('seleziona parcheggio')
        return
      }
      console.log('confermato',{
        zona: this.selectedZoneId, parcheggio: this.selectedLot
      })

      this.updateMap()
    },
    updateMap(){
      console.log('aggiorna mappa')
    }
  }
}
</script>