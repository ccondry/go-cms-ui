import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy'
import {fetch} from '../../utils'

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
    // update users in state
    for (const user of data) {
      const index = state.users.findIndex(v => v.username === user.username)
      if (index >= 0) {
        state.users.splice(index, 1, user)
      } else {
        state.users.push(user)
      }
    }
  },
  [types.REMOVE_USER] (state, username) {
    // remove one user from state
    const index = state.users.findIndex(v => v.username === username)
    if (index >= 0) {
      state.users.splice(index, 1)
    }
  }
}

const actions = {
  // get single AD user
  async getUser ({commit, dispatch, getters}, username) {
    console.log('admin.getUser action')
    dispatch('setLoading', {group: 'user', type: 'get', value: true})
    const url = getters.endpoints.user + '/' + username
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      const user = await fetch(url, options)
      console.log('getUser:', user)
      this.commit(types.UPSERT_USERS, [user])
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'user', type: 'get', value: false})
    }
  },
  // delete AD user
  async deleteUser ({dispatch, getters}, username) {
    console.log('admin.deleteUser action')
    dispatch('setLoading', {group: 'user', type: 'delete', value: true})
    const url = getters.endpoints.user + '/' + username
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      // remove user from AD
      await fetch(url, options)
      // remove user from state
      this.commit(types.REMOVE_USER, username)
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'user', type: 'delete', value: false})
    }
  },
  // get AD users list
  async getUsers ({dispatch, getters}) {
    console.log('admin.getUsers action')
    // check user active directory user exists
    dispatch('setLoading', {group: 'user', type: 'list', value: true})
    const url = getters.endpoints.user
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      const users = await fetch(url, options)
      console.log('getUsers:', users)
      this.commit(types.SET_USERS, users)
      // Toast.open({
      //   message: user,
      //   duration: 10 * 1000,
      //   type: 'is-success'
      // })
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'user', type: 'list', value: false})
    }
  },
  async disableUser ({getters, dispatch}, username) {
    console.log('admin.disableUser action')
    dispatch('setWorking', {group: 'user', type: 'disable', value: true})
    const url = getters.endpoints.user + '/' + username + '/disable'
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await fetch(url, options)
      // success - refresh user data
      dispatch('getUser')
      Toast.open({
        message: 'disable user success',
        duration: 10 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: `failed to disable user: ${e.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: 'disable', value: false})
    }
  },
  async enableUser ({getters, dispatch}, username) {
    console.log('admin.enableUser action')
    dispatch('setWorking', {group: 'user', type: 'enable', value: true})
    const url = getters.endpoints.user + '/' + username + '/enable'
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await fetch(url, options)
      // success - refresh user data
      dispatch('getUser')
      Toast.open({
        message: 'enable user success',
        duration: 10 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: `failed to enable user: ${e.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: 'enable', value: false})
    }
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
