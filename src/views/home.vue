<template>
  <section class="main">
    <!-- main content -->
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
          <p>
            Fill out this form to create your GoCMS user account. 
          </p>
          <b-field label="New Password" label-position="on-border">
            <b-input v-model="password" />
          </b-field>
          <b-field label="Call ID" label-position="on-border">
            <b-input v-model="dn" />
          </b-field>
          <b-field label="Meeting Passcode" label-position="on-border">
            <b-input v-model="passcode" />
          </b-field>
          <b-button
          type="is-success"
          rounded
          expanded
          @click="clickCreate"
          >
            Create GoCMS User
          </b-button>
        </div>

        <!-- user has AD account -->
        <div v-if="adUser">
          <!-- enabled but expired AD account -->
          <div
          v-if="expired"
          style="display: flex;justify-content: center;align-items: center;"
          >
            Your account has expired.
          </div>

          <!-- enabled and not expired AD account -->
          <div v-if="!expired">
            Your account will expire {{ expiresFromNow }}
            <!-- JWT user -->
            <b-collapse
            class="card"
            animation="slide"
            aria-id="jwt-user"
            :open="false"
            >
              <div
              slot="trigger" 
              slot-scope="props"
              class="card-header"
              role="button"
              aria-controls="jwt-user"
              >
                <p class="card-header-title">
                  JWT User
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-up' : 'menu-down'" />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <pre>{{ jwtUser }}</pre>
                </div>
              </div>
            </b-collapse>

            <!-- AD user -->
            <b-collapse
            class="card"
            animation="slide"
            aria-id="jwt-user"
            :open="false"
            >
              <div
              slot="trigger" 
              slot-scope="props"
              class="card-header"
              role="button"
              aria-controls="jwt-user"
              >
                <p class="card-header-title">
                  Active Directory User
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-up' : 'menu-down'" />
                </a>
              </div>
              <div class="card-content">
                <div class="content">
                  <pre>{{ adUser }}</pre>
                </div>
              </div>
            </b-collapse>
          </div>
          <!-- buttons -->
          <div class="card-content">
            <b-button
            v-if="expired"
            type="is-success"
            rounded
            expanded
            @click="clickExtend"
            >
              Enable My Account
            </b-button>

            <b-button
            v-if="!expired"
            type="is-primary"
            rounded
            expanded
            @click="clickExtend"
            >
              Extend My Account
            </b-button>
          </div>
        </div>
      </article>

      <!-- loading -->
      <b-loading :active="!isLoggedIn || isLoading || isWorking" />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      password: '',
      passcode: '',
      dn: '',
      moment
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'jwtUser',
      'loading',
      'working',
      'isAdmin',
      'users'
    ]),
    adUser () {
      // match AD user to JWT sub (username)
      try {
        return this.users.find(v => v.sAMAccountName === this.jwtUser.sub)
      } catch (e) {
        return null
      }
    },
    expires () {
      return (this.adUser.accountExpires - 116444736000000000) / 10000
    },
    expiresFromNow () {
      return moment(this.expires).fromNow()
    },
    expired () {
      return this.expires <= Date.now()
    },
    isLoading () {
      return this.loading.user[this.jwtUser.sub]
    },
    isWorking () {
      return this.working.user[this.jwtUser.sub]
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'createAccount',
      'setUserExpiration'
    ]),
    clickCreate () {
      this.createAccount({
        password: this.password,
        passcode: this.passcode,
        dn: this.dn
      })
    },
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clickLogout () {
      this.logout()
    },
    clickExtend () {
      this.setUserExpiration({username: this.adUser.sAMAccountName, hour: 12})
    }
  }
}
</script>
