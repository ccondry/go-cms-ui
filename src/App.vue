<template>
  <div
  id="main-container"
  class="container is-fluid is-marginless app-content"
  >
    <!-- top-right buttons -->
    <div
    class="buttons"
    style="float: right; position: absolute; right: 10px; top: 10px;"
    >
      <!-- admin panel button -->
      <b-button
      v-if="isAdmin && atHome"
      type="is-info"
      rounded
      @click="clickAdmin"
      >
        Admin
      </b-button>

      <!-- home button -->
      <b-button
      v-if="atAdmin"
      type="is-info"
      rounded
      @click="clickHome"
      >
        Home
      </b-button>

      <!-- logout button -->
      <b-button
      v-if="isLoggedIn"
      type="is-info"
      rounded
      @click="clickLogout"
      >
        Logout
      </b-button>

      <!-- logout -->
      <!-- <b-button
      v-if="isLoggedIn"
      type="is-primary"
      rounded
      @click="clickLogout"
      >
        Log Out
      </b-button> -->
    </div>

    <!-- vue-router container -->
    <transition
    mode="out-in"
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
    appear
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'isAdmin',
      'user'
    ]),
    atHome () {
      try {
        return this.$route.name === 'Home'
      } catch (e) {
        return false
      }
    },
    atAdmin () {
      try {
        return this.$route.name === 'Admin'
      } catch (e) {
        return false
      }
    }
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
        // check if they have an active AD account
        this.getUser(this.user.sAMAccountName)
      } else if (!val && oldVal) {
        // user just logged out
        // redirect them to SSO
        this.login()
      }
    }
  },

  mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkLogin()
    // get environment info
    this.getDemoEnvironment()
  },

  methods: {
    ...mapActions([
      'checkLogin',
      'getDemoEnvironment',
      'login',
      'logout',
      'getUser'
    ]),
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clickLogout () {
      this.logout()
    },
    clickHome () {
      this.$router.push({name: 'Home'}).catch(e => {})
    }
  }
}
</script>

<style lang="scss">
// hide scroll bar
html, body {
  overflow-y: auto !important;
  background-image: url(assets/images/sign_in_background.jpg);
  // background-position: 0 0;
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

// make container fill viewport
#main-container {
  height: 100vh;
  padding-top: 1rem;
  padding-left: 0;
  padding-right: 0;
}

// route content class - centered
section.main {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
