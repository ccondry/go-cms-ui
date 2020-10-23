<template>
  <section class="main">
    <div class="is-parent">
      <b-loading :active="loading.ldap.user" />
      <!-- logged in -->
      <article
      v-if="isLoggedIn && !loading.ldap.user"
      class="tile is-child is-white flex-container box"
      > 
        <b-table
        ref="table"
        :data="users"
        :paginated="users.length > 20"
        per-page="20"
        detailed
        :loading="loading.ldap.user"
        detail-key="sAMAccountName"
        :show-detail-icon="true"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        >
          <b-table-column
          v-slot="props"
          field="fullName"
          label="Name"
          sortable
          searchable
          >
            <a @click="toggle(props.row)">
              {{ props.row.fullName }}
            </a>
          </b-table-column>

          <!-- username -->
          <b-table-column
          v-slot="props"
          field="sAMAccountName"
          label="Username"
          sortable
          searchable
          >
            <a @click="toggle(props.row)">
              {{ props.row.sAMAccountName }}
            </a>
          </b-table-column>

          <!-- call ID -->
          <b-table-column
          v-slot="props"
          field="telephoneNumber"
          label="Call ID"
          sortable
          searchable
          >
            {{ props.row.telephoneNumber }}
          </b-table-column>

          <!-- enabled -->
          <b-table-column
          v-slot="props"
          field="enabled"
          label="Enabled"
          sortable
          >
            {{ props.row.enabled }}
          </b-table-column>

          <!-- admin -->
          <!-- <b-table-column
          v-slot="props"
          field="admin"
          label="Admin"
          sortable
          >
            {{ props.row.admin }}
          </b-table-column> -->

          <b-table-column
          v-slot="props"
          field="accountExpires"
          label="Expires"
          sortable
          >
            {{ expires(props.row) }}
          </b-table-column>

          <b-table-column
          v-slot="props"
          field="whenCreated"
          label="Created"
          sortable
          >
            {{ convertLdapDate(props.row.whenCreated) }}
          </b-table-column>

          <b-table-column
          v-slot="props"
          field="whenChanged"
          label="Modified"
          sortable
          >
            {{ convertLdapDate(props.row.whenChanged) }}
          </b-table-column>

          <template slot="detail" slot-scope="props">
            <div class="content" style="position: relative;">
              <b-loading
              :active="loading.user[props.row.sAMAccountName] || working.user[props.row.sAMAccountName]"
              :is-full-page="false"
              />

              <pre>{{ props.row }}</pre>

              <b-field label="Expires">
                <p class="control">
                  {{ expires(props.row) }}
                </p>
              </b-field>

              <div class="buttons" style="float: right;">
                <!-- extend -->
                <b-button
                v-if="props.row.enabled"
                type="is-success"
                rounded
                :disabled="working.user[props.row.sAMAccountName]"
                @click="clickExtendUser(props.row)"
                >
                  Extend Expiration
                </b-button>

                <!-- expire -->
                <b-button
                v-if="props.row.enabled"
                type="is-warning"
                rounded
                :disabled="working.user[props.row.sAMAccountName]"
                @click="clickExpireUser(props.row)"
                >
                  Expire Now
                </b-button>

                <!-- disable -->
                <b-button
                v-if="props.row.enabled"
                type="is-warning"
                rounded
                :disabled="working.user[props.row.sAMAccountName]"
                @click="clickDisableUser(props.row)"
                >
                  Disable
                </b-button>

                <!-- enable -->
                <b-button
                v-if="!props.row.enabled"
                type="is-success"
                rounded
                :disabled="working.user[props.row.sAMAccountName]"
                @click="clickEnableUser(props.row)"
                >
                  Enable
                </b-button>

                <!-- delete -->
                <b-button
                type="is-danger"
                rounded
                :disabled="working.user[props.row.sAMAccountName]"
                @click="clickDeleteUser(props.row)"
                >
                  Delete
                </b-button>
              </div>
            </div>
          </template>
        </b-table>
      </article>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'isLoggedIn',
      'loading',
      'working'
    ])
  },

  watch: {
    isLoggedIn (val, oldVal) {
      if (val && !oldVal) {
        this.getUsers()
      }
    }
  },

  mounted () {
    if (this.isLoggedIn) {
      this.getUsers()
    }
  },

  methods: {
    ...mapActions([
      'getUsers',
      'disableUser',
      'enableUser',
      'deleteUser',
      'extendUser'
    ]),
    clickDisableUser (user) {
      this.disableUser(user.sAMAccountName)
    },
    clickEnableUser (user) {
      this.enableUser(user.sAMAccountName)
    },
    clickDeleteUser (user) {
      console.log(user)
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to <strong>delete ${user.sAMAccountName}</strong>?`,
        type: 'is-danger',
        // cancelText: 'Disagree',
        confirmText: 'Delete',
        rounded: true,
        onConfirm: () => {
          this.deleteUser(user.sAMAccountName)
        }
      })
    },
    clickHome () {
      this.$router.push({name: 'Home'}).catch(e => {})
    },
    toggle (row) {
      // expand details for table row
      this.$refs.table.toggleDetails(row)
    },
    expires (adUser) {
      return moment((adUser.accountExpires - 116444736000000000) / 10000).fromNow()
    },
    convertLdapDate (date) {
      // 2020 10 20 20 25 23.0Z
      const d = new Date()
      d.setUTCFullYear(date.slice(0, 4))
      d.setUTCMonth(parseInt(date.slice(4, 6)) - 1)
      d.setUTCDate(date.slice(6, 8))
      d.setUTCHours(date.slice(8, 10))
      d.setUTCMinutes(date.slice(10, 12))
      d.setUTCSeconds(date.slice(12, 14))
      // return d
      return moment(d).fromNow()
    },
    clickExtendUser (adUser) {
      this.extendUser({
        username: adUser.sAMAccountName,
        hour: 12
      })
    },
    clickExpireUser (adUser) {
      this.extendUser({
        username: adUser.sAMAccountName,
        hour: 0
      })
    }
  }
}
</script>
