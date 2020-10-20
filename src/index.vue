<template>
  <div
  class="container is-fluid is-marginless app-content"
  style="padding: 0;"
  >
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
      'isLoggedIn'
    ])
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        // user just logged in
        // check if they have an active AD account
        this.checkAccount()
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
      'checkAccount'
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
</style>
