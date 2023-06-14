import {ToastProgrammatic as Toast} from 'buefy'
import * as types from 'src/store/mutation-types'

const state = {
  users: []
}

const getters = {
  users: state => state.users
}

const mutations = {
  [types.SET_USERS] (state, data) {
    // replace all users state data with new data
    state.users = data
  },
  [types.UPSERT_USERS] (state, data) {
    console.log('UPSERT_USERS', data)
    // update users in state
    for (const user of data) {
      const index = state.users.findIndex(v => v.sAMAccountName === user.sAMAccountName)
      if (index >= 0) {
        state.users.splice(index, 1, user)
      } else {
        state.users.push(user)
      }
    }
  },
  [types.REMOVE_USER] (state, username) {
    // remove one user from state
    const index = state.users.findIndex(v => v.sAMAccountName === username)
    if (index >= 0) {
      console.log('REMOVE_USER', index)
      state.users.splice(index, 1)
    }
  }
}

const actions = {
  async setUserPassword ({dispatch, getters}, {username, password}) {
    // reset user password in ldap
    await dispatch('fetch', {
      group: 'user',
      type: username,
      message: 'set user password',
      url: getters.endpoints.user + '/' + username + '/password',
      options: {
        method: 'POST',
        body: {username, password}
      }
    })
    await dispatch('getUser', username)
    // this user setting their own password?
    if (getters.user.sAMAccountName === username) {
      Toast.open({
        message: 'Your password has been changed.',
        type: 'is-success'
      })
    } else {
      // admin setting user password
      Toast.open({
        message: 'Successfully changed user password.',
        type: 'is-success'
      })
    }
  },
  // get single AD user
  async getUser ({commit, dispatch, getters}, username) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: username,
      message: 'get user information',
      url: getters.endpoints.user + '/' + username,
    })
    // if response success and has data
    if (!(response instanceof Error) && response) {
      // upsert user in state
      commit(types.UPSERT_USERS, [response])
    }
  },
  async setUserExpiration ({getters, dispatch}, {username, hour = 12}) {
    // extend accountExpires by specified ms (default to 12 hours)
    await dispatch('fetch', {
      group: 'user',
      type: username,
      message: 'get user information',
      url: getters.endpoints.user + '/' + username + '/extend',
      options: {method: 'POST', body: {hour}}
    })
    // success - refresh user data
    await dispatch('getUser', username)
    // notify user success
    if (getters.user.sAMAccountName === username) {
      // this user
      Toast.open({
        message: `Your account expiration has been reset to ${hour} hours.`,
        duration: 4 * 1000,
        type: 'is-success'
      })
    } else {
      // admin for another user
      Toast.open({
        message: `${username} account expiration set to ${hour} hours`,
        duration: 4 * 1000,
        type: 'is-success'
      })
    }
  },
  // delete AD user
  async deleteUser ({commit, dispatch, getters}, username) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: username,
      message: 'get user information',
      url: getters.endpoints.user + '/' + username,
      options: {method: 'DELETE'},
      showNotification: true
    })
    // if succeess
    if (!(response instanceof Error)) { 
      // remove user from state
      commit(types.REMOVE_USER, username)
    }
  },
  // get AD users list
  async getUsers ({dispatch, getters}) {
    await dispatch('fetch', {
      group: 'ldap',
      type: 'user',
      message: 'get users list',
      url: getters.endpoints.user,
      showNotification: true,
      mutation: types.SET_USERS
    })
  },
  async createUser ({dispatch, getters}, {dn, password}) {
    const response = await dispatch('fetch', {
      group: 'user',
      type: getters.user.sAMAccountName,
      message: 'create user',
      url: getters.endpoints.user,
      showNotification: true,
      options: {
        method: 'POST',
        body: {dn, password},
      }
    })
    // if successful
    if (!(response instanceof Error)) {
      // get new user data
      await dispatch('getUser', getters.user.sAMAccountName)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}