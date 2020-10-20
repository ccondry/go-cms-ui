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
    state.users = data
  },
  [types.UPDATE_USERS] (state, data) {
    for (const user of data) {
      const index = state.users.findIndex(v => v.username === user.username)
      if (index >= 0) {
        state.users.splice(index, 1, user)
      } else {
        state.users.push(user)
      }
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
      this.commit(types.UPDATE_USERS, [user])
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
  // get AD users list
  async getUsers ({commit, dispatch, getters}) {
    console.log('admin.getUsers action')
    // check user active directory account exists
    dispatch('setLoading', {group: 'user', type: 'list', value: true})
    const url = getters.endpoints.users
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
  async disableUser ({getters, dispatch}, user) {
    console.log('admin.disableUser action')
    dispatch('setWorking', {group: 'user', type: 'disable', value: true})
    const url = getters.endpoints.disableUser
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      },
      body: {
        username: user.username
      }
    }
    try {
      await fetch(url, options)
      // success - refresh account data
      dispatch('getUser')
      Toast.open({
        message: 'disable account success',
        duration: 10 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: `failed to disable account: ${e.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: 'disable', value: false})
    }
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
