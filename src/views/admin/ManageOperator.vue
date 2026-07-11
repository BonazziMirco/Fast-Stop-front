<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestione Utenti</h1>
      <span class="text-sm text-gray-500">{{ filteredUsers.length }} operatori</span>
    </div>

    <!-- Pulsante Filtra -->
    <div class="mb-4">
      <button
          @click="filterOpen"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtra
      </button>
    </div>

    <!-- Popup Filtri -->
    <div v-if="showFilterPopUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtra Operatori</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
                type="text"
                v-model="filters.email"
                placeholder="Cerca per email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
            <select
                v-model="filters.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Tutti</option>
              <option value="user">Utenti</option>
              <option value="viewer">Osservatori</option>
              <option value="operator">Operatori</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
                v-model="filters.state"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Tutti</option>
              <option value="attivo">Attivo</option>
              <option value="sospeso">Sospeso</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
              @click="filterApply"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Applica filtri
          </button>
          <button
              @click="filterReset"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Resetta
          </button>
          <button
              @click="filterClose"
              class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>

    <!-- Tabella -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ruolo</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stato</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="user in filteredUsers"
              :key="user.id"
              @click="selectUser(user)"
              class="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              :class="{'bg-blue-50': selectedUser && selectedUser.id === user.id}"
          >
            <td class="py-3 px-4 text-sm text-gray-700">{{ user.email }}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getRoleClass(user.authority)">
                  {{ getRoleName(user.authority) }}
                </span>
            </td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="user.is_active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                  {{ user.is_active ? 'Sospeso' : 'Attivo' }}
                </span>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="3" class="py-8 text-center text-gray-500">
              Nessun operatore trovato
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pulsanti azioni -->
    <div class="flex flex-wrap gap-3 mt-6">
      <button
          @click="sospendi"
          :disabled="!selectedUser || loading || selectedUser.sospeso"
          class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sospendi
      </button>
      <button
          @click="riattiva"
          :disabled="!selectedUser || loading || !selectedUser.sospeso"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Riattiva
      </button>
      <button
          @click="elimina"
          :disabled="!selectedUser || loading"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Elimina
      </button>
    </div>

    <!-- Messaggio -->
    <div v-if="message" class="mt-4 p-4 rounded-lg" :class="message.includes('successo') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
      {{ message }}
    </div>

    <!-- Popup Conferma -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Conferma Azione</h3>
        <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
        <div class="flex gap-3">
          <button
              @click="confirm"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Conferma
          </button>
          <button
              @click="back"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, patch, del } from '@/service/api.js'

export default {
  name: "manageOperator",
  data() {
    return {
      users: [],
      selectedUser: null,
      loading: false,
      message: '',
      messageTimer: null,

      // Popup conferma
      showConfirm: false,
      confirmMessage: '',
      pendingAction: null,

      // Popup filtro
      showFilterPopUp: false,
      filters: {
        role: '',
        state: '',
        email: '',
      },

      fetchTimeout: null,
      retryCount: 0,
    }
  },

  computed: {
    filteredUsers() {
      let result = [...this.users]

      if (this.filters.role) {
        result = result.filter(user => user.authority === this.filters.role)
      }

      if (this.filters.state === 'attivo') {
        result = result.filter(user => user.is_active==='true')
      } else if (this.filters.state === 'sospeso') {
        result = result.filter(user => user.is_active==='false')
      }

      if (this.filters.email && this.filters.email.trim()) {
        const searchTerm = this.filters.email.toLowerCase().trim()
        result = result.filter(user => user.email.toLowerCase().includes(searchTerm))
      }

      return result
    }
  },

  mounted() {
    this.createTable()
  },

  methods: {
    async createTable() {
      if (this.fetchTimeout) {
        clearTimeout(this.fetchTimeout);
        this.fetchTimeout = null;
      }

      return new Promise((resolve, reject) => {
        this.fetchTimeout = setTimeout(async () => {
          this.loading = true;
          this.message = null;

          try {
            const data = await get('/userManagement/users');
            this.users = data
                .filter(user => user.authority !== 3)
                .map(user => ({
                  ...user,
                  is_active: user.is_active,
                  sospeso: !user.is_active
                }));

            this.retryCount = 0;
            resolve(data);

          } catch (error) {
            console.error('Errore nel caricamento:', error);
            this.handleApiError(error);
            reject(error);
          } finally {
            this.loading = false;
            this.fetchTimeout = null;
          }
        }, 300);
      });
    },

    handleApiError(error) {
      console.error('API Error:', error);

      if (error.status === 429) {
        if (this.retryCount >= 3) {
          this.message = 'Troppe richieste al server. Riprova più tardi.';
          this.retryCount = 0;
          return;
        }

        this.retryCount++;
        const delay = Math.min(3000 * this.retryCount, 10000); // 3s, 6s, 9s
        this.message = `Troppe richieste. Nuovo tentativo tra ${delay/1000} secondi...`;

        setTimeout(() => {
          this.createTable();
        }, delay);

      } else if (error.status === 401) {
        this.message = 'Sessione scaduta. Riaccedi.';
        localStorage.removeItem('user');
        localStorage.removeItem('authority');
        localStorage.removeItem('token');
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);

      } else if (error.status === 404) {
        this.message = 'Risorsa non trovata.';

      } else if (error.status === 500) {
        this.message = 'Errore del server. Riprova più tardi.';

      } else {
        this.message = error?.message || 'Errore durante il caricamento';
      }

      //  Auto-cancella il messaggio dopo 5 secondi (se non è un retry)
      if (error.status !== 429) {
        this.clearMessageAfterDelay();
      }
    },

    // per cancellare il messaggio dopo un delay
    clearMessageAfterDelay() {
      if (this.messageTimer) {
        clearTimeout(this.messageTimer);
        this.messageTimer = null;
      }
      this.messageTimer = setTimeout(() => {
        this.message = null;
      }, 5000);
    },

    selectUser(user) {
      if (this.selectedUser && this.selectedUser.id === user.id) {
        this.selectedUser = null;
      } else {
        this.selectedUser = user;
      }
    },

    sospendi() {
      if (!this.selectedUser) return;
      this.confirmMessage = `Sospendere ${this.selectedUser.email}?`;
      this.pendingAction = 'suspend';
      this.showConfirm = true;
    },

    riattiva() {
      if (!this.selectedUser) return;
      this.confirmMessage = `Riattivare ${this.selectedUser.email}?`;
      this.pendingAction = 'activate';
      this.showConfirm = true;
    },

    elimina() {
      if (!this.selectedUser) return;
      this.confirmMessage = `Eliminare definitivamente ${this.selectedUser.email}? Questa azione è irreversibile.`;
      this.pendingAction = 'delete';
      this.showConfirm = true;
    },

    async confirm() {
      this.showConfirm = false;
      this.loading = true;
      let operationMessage = '';

      try {
        switch (this.pendingAction) {
          case 'suspend':
            await patch(`/users/${this.selectedUser.id}/suspend`, { is_active: false });
            operationMessage = `${this.selectedUser.email} sospeso con successo!`;
            break;
          case 'activate':
            await patch(`/users/${this.selectedUser.id}/suspend`, { is_active: true });
            operationMessage = `${this.selectedUser.email} riattivato con successo!`;
            break;
          case 'delete':
            await del(`/users/${this.selectedUser.id}`);
            operationMessage = ` ${this.selectedUser.email} eliminato con successo!`;
            this.selectedUser = null;
            break;
        }

        this.message = operationMessage;

        // Aspetta 1 secondo prima di ricaricare
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Ricarica la tabella
        await this.createTable();

        // Cancella il messaggio dopo 5 secondi
        this.clearMessageAfterDelay();

      } catch (error) {
        console.error('Errore durante l\'operazione:', error);
        this.handleApiError(error);
      } finally {
        this.loading = false;
        this.pendingAction = null;
      }
    },

    back() {
      this.showConfirm = false;
      this.pendingAction = null;
    },

    getRoleName(role) {
      const roles = {
        0: 'User',
        1: 'Viewer',
        2: 'Operator',
        3: 'Admin'
      };
      return roles[role] || role;
    },

    getRoleClass(role) {
      const classes = {
        0: 'bg-gray-100 text-gray-700',
        1: 'bg-blue-100 text-blue-700',
        2: 'bg-purple-100 text-purple-700',
        3: 'bg-red-100 text-red-700'
      };
      return classes[role] || 'bg-gray-100 text-gray-700';
    },

    filterOpen() {
      this.showFilterPopUp = true;
    },

    filterClose() {
      this.showFilterPopUp = false;
    },

    filterApply() {
      this.showFilterPopUp = false;
    },

    filterReset() {
      this.filters = {
        role: '',
        state: '',
        email: '',
      };
    },
  },

  beforeDestroy() {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
      this.fetchTimeout = null;
    }
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
  }
}
</script>