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
        <p class="title">
          Welcome {{ jwtUser.given_name }}!
        </p>

        <p v-if="adUser" class="subtitle">
          <span v-if="expired">
            Your account has expired.
          </span>
          <span v-else>
            Your account will expire {{ expiresFromNow }}.
          </span>
        </p>

        <!-- user does not have AD account -->
        <div v-if="!adUser" class="content">
          <p>
            Fill out this form to create your GoCMS user account. 
          </p>
          <b-field label="New Password" label-position="on-border">
            <b-input
            v-model="password"
            type="password"
            :required="true"
            placeholder="A new password, only for GoCMS"
            aria-placeholder="A new password, only for GoCMS"
            />
          </b-field>
          <b-field
          label="Call ID"
          label-position="on-border"
          >
            <b-input
            v-model="dn"
            placeholder="Your Phone Number"
            aria-placeholder="Your Phone Number"
            :required="true"
            />
          </b-field>
          <!-- <b-field
          label="Meeting Passcode"
          label-position="on-border"
          >
            <b-input
            v-model="passcode"
            placeholder="Optional"
            aria-placeholder="Optional"
            />
          </b-field> -->
          <b-button
          type="is-success"
          rounded
          expanded
          :disabled="!dn.length || !password.length"
          @click="clickCreate"
          >
            Create GoCMS User
          </b-button>
        </div>

        <!-- user has AD account -->
        <div v-if="adUser">
          <!-- show CMS cospace info if user not expired -->
          <user-space v-if="!expired" class="content" />
          <div class="content">
            <!-- buttons -->
            <b-field>
              <b-button
              v-if="expired"
              type="is-success"
              rounded
              expanded
              @click="clickExtend"
              >
                Enable My Account
              </b-button>
            </b-field>

            <b-field>
              <b-button
              v-if="!expired"
              type="is-primary"
              rounded
              expanded
              @click="clickExtend"
              >
                Extend My Account
              </b-button>
            </b-field>

            <b-field>
              <b-button
              v-if="!expired"
              type="is-info"
              rounded
              expanded
              @click="clicksetUserPassword"
              >
                Reset My Password
              </b-button>
            </b-field>
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
import UserSpace from '../components/space'

export default {
  components: {
    UserSpace
  },

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
      'users',
      'adUser'
    ]),
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
      'createUser',
      'setUserExpiration',
      'setUserPassword'
    ]),
    clickCreate () {
      this.createUser({
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
    },
    clicksetUserPassword () {
      this.$buefy.dialog.prompt({
        title: 'Reset Password',
        message: 'Choose your new password',
        inputAttrs: {
          type: 'password',
          placeholder: 'Your New Password',
          'aria-placeholder': 'Your New Password'
        },
        confirmText: 'Submit',
        rounded: true,
        onConfirm: (password) => {
          this.setUserPassword({
            username: this.jwtUser.sub,
            password
          })
        },
        type: 'is-success'
      })
    }
  }
}
</script>
