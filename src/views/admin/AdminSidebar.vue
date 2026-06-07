
<template>
    <div class="admin-sidebar">
      <nav>
        <router-link to="/admin/add-operator" class="nav--link">
          Aggiungi Operatore
        </router-link>
        <br>
        <router-link to="/admin/manage-operator" class="nav--link">
          Gestisci Operatori
        </router-link>

      </nav>
    </div>
</template>

<script >
export default {
  name: 'AdminSidebar',
}
</script>