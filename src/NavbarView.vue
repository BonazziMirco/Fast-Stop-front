<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-links">
        <router-link to="/map" class="nav-btn" active-class="active">
          Mappa
        </router-link>
        <router-link to="/login" class="nav-btn" active-class="active">
          Login
        </router-link>
        <router-link to="/signin" class="nav-btn" active-class="active">
          Sign In
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>