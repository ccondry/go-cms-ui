<template>
  <section class="signin">
    <div class="is-parent">
      <!-- logged in -->
      <article
      v-if="isLoggedIn && !isLoading"
      class="tile is-child is-white flex-container box"
      > 
        <!-- title -->
        <p class="title flex-item">
          Welcome {{ jwtUser.given_name }}!
        </p>

        <!-- user does not have AD account -->
        <div v-if="!adUser" class="content">
          <b-field label="New Password">
            <b-input v-model="password" />
          </b-field>
          <b-field label="Call ID">
            <b-input v-model="callId" />
          </b-field>
          <b-field label="Meeting Passcode">
            <b-input v-model="passcode" />
          </b-field>
        </div>

        <!-- user has AD account -->
        <div v-if="adUser">
          <!-- enabled AD account -->
          <div v-if="adUser.enabled">
            Your account is created and enabled
            <br>
            Active Directory User
            <pre>{{ adUser }}</pre>
            <b-button
            type="is-danger"
            @click="clickDisable"
            >
              Disable My Account
            </b-button>
          </div>

          <!-- disabled AD account -->
          <div v-if="!adUser.enabled">
            Your account is disabled
            <br>
            <b-button
            type="is-success"
            @click="clickEnable"
            >
              Enable My Account
            </b-button>
          </div>
        </div>
      </article>

      <!-- loading -->
      <b-loading :active="!isLoggedIn || isLoading || isWorking" />
    </div>

    <!-- admin panel button -->
    <b-button
    v-if="isAdmin"
    style="float: right; position: absolute; right: 10px; top: 10px;"
    type="is-primary"
    rounded
    @click="clickAdmin"
    >
      Admin
    </b-button>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      password: '',
      passcode: '',
      callId: ''
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'adUser',
      'loading',
      'working',
      'isAdmin'
    ]),
    isLoading () {
      return this.loading.account.get
    },
    isWorking () {
      return this.working.user.login ||
      this.working.account.enable ||
      this.working.account.create ||
      this.working.account.disable
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'getAccount',
      'createAccount',
      'enableAccount',
      'disableAccount'
    ]),
    clickDisable () {
      this.disableAccount()
    },
    clickEnable () {
      this.enableAccount()
    },
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    }
    // clickLogout () {
    //   this.logout()
    // },
    // clickgetAccount () {
    //   this.getAccount()
    // },
    // clickCreateAccount () {
    //   this.createAccount()
    // }
  }
}
</script>
