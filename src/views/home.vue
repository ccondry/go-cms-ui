<template>
  <section class="main">
    <!-- users<pre>{{users}}</pre>
    adUser<pre>{{adUser}}</pre> -->
    <!-- main content -->
    <div class="is-parent">
      <!-- logged in -->
      <article
      v-if="isLoggedIn && !isLoading"
      class="tile is-child is-white flex-container box"
      style="box-shadow: 0 2rem 1rem rgba(0,0,0,.2); border: 1px solid rgb(204, 204, 204);"
      > 
        <!-- title -->
        <p class="title">
          Welcome {{ user.first_name }}!
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
            @keydown.enter.native="clickCreate"
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
            @keydown.enter.native="clickCreate"
            />
          </b-field>
          <div style="padding-top: 1rem;">
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
        </div>

        <!-- user has AD account -->
        <div v-if="adUser">
          <!-- show CMS cospace info if user not expired -->
          <user-space v-if="!expired" class="content" :user="adUser" />
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
              @click="clickSetUserPassword"
              >
                Reset My Password
              </b-button>
            </b-field>
          </div>

          <!-- copyright and version -->
          <app-footer />
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
import UserSpace from 'src/components/space.vue'
import AppFooter from 'src/components/app-footer.vue'

export default {
  components: {
    UserSpace,
    AppFooter
  },

  data () {
    return {
      password: '',
      dn: '',
      moment
    }
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'user',
      'loading',
      'working',
      'isAdmin',
      'users',
      'adUser'
    ]),
    expires () {
      try {
        return (this.adUser.accountExpires - 116444736000000000) / 10000
      } catch (e) {
        return 0
      }
    },
    expiresFromNow () {
      return moment(this.expires).fromNow()
    },
    expired () {
      return this.expires <= Date.now()
    },
    isLoading () {
      return this.loading.user[this.user.sAMAccountName]
    },
    isWorking () {
      return this.working.user[this.user.sAMAccountName]
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
      if (this.password.length && this.dn.length) {
        this.createUser({
          password: this.password,
          dn: this.dn
        })
      }
    },
    clickAdmin () {
      this.$router.push({name: 'Admin'}).catch(e => {})
    },
    clickLogout () {
      this.logout()
    },
    clickExtend () {
      try {
        this.setUserExpiration({username: this.adUser.sAMAccountName, hour: 12})
      } catch (e) {
        console.log(e)
      }
    },
    clickSetUserPassword () {
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
            username: this.user.sAMAccountName,
            password
          })
        },
        type: 'is-success'
      })
    }
  }
}
</script>
