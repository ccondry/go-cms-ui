<template>
  <div
  class="container is-fluid is-marginless app-content"
  style="padding: 0;"
  >
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
import router from './router'

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn'
    ])
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
        // check if they have an active AD account
        this.getAccount()
      }
    }
  },

  async mounted () {
    // try to find and validate user's JWT from localStorage,
    // or start the SSO login process to get one
    this.checkJwt()
  },

  methods: {
    ...mapActions([
      'checkJwt',
      'getAccount'
    ])
  }
}
</script>

<style lang="scss">
// hide scroll bar
html, body {
  overflow: hidden;
}

// make container fill viewport
.container {
  height: 100vh;
  width: 100vh;
}
.signin {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(./assets/images/sign_in_background.jpg);
  background-position: 0 0;
  background-size:cover
}
</style>
