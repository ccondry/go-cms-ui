<template>
  <section class="signin">
    <div class="is-parent">
      <!-- logged in -->
      <article
      v-if="isLoggedIn"
      class="tile is-child is-white flex-container box"
      > 
        <!-- title -->
        <p class="title flex-item">
          Welcome {{ jwtUser.given_name }}!
        </p>

        <p class="content">
          <pre>{{ jwtUser }}</pre>
          <b-button @click="clickLogout">
            Log Out
          </b-button>
          <b-button @click="clickCheckAccount">
            Check Account
          </b-button>
        </p>
      </article>

      <!-- not logged in -->
      <b-loading :active="!isLoggedIn" />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser'
    ])
  },

  methods: {
    ...mapActions([
      'logout',
      'checkAccount'
    ]),
    clickLogout () {
      this.logout()
    },
    clickCheckAccount () {
      this.checkAccount()
    }
  }
}
</script>

<style lang="scss">
.signin {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../assets/images/sign_in_background.jpg);
  background-position: 0 0;
  background-size:cover
}
</style>