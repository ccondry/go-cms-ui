<template>
  <section class="main">
    <div class="is-parent">
      <b-loading :active="isLoading || isWorking" />
      <!-- logged in -->
      <article
      v-if="isLoggedIn && !isLoading"
      class="tile is-child is-white flex-container box"
      > 
        <b-table
        ref="table"
        :data="users"
        :paginated="users.length > 20"
        per-page="20"
        detailed
        :loading="isLoading"
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
            <div class="content">
              <pre>{{ props.row }}</pre>

              <div class="buttons" style="float: right;">
                <!-- disable -->
                <b-button
                v-if="props.row.enabled"
                type="is-warning"
                @click="clickDisableUser(props.row)"
                >
                  Disable
                </b-button>

                <!-- enable -->
                <b-button
                v-if="!props.row.enabled"
                type="is-success"
                @click="clickEnableUser(props.row)"
                >
                  Enable
                </b-button>

                <!-- delete -->
                <b-button
                type="is-danger"
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
  computed: {
    ...mapGetters([
      'users',
      'isLoggedIn',
      'loading',
      'working'
    ]),
    isLoading () {
      return this.loading.user.list
    },
    isWorking () {
      return this.working.user.delete ||
      this.working.user.enable ||
      this.working.user.disable
    }
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
      'deleteUser'
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
    }
  }
}
</script>
