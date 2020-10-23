import * as types from '../mutation-types'
import Vue from 'vue'
import {ToastProgrammatic as Toast} from 'buefy/src'
import {fetch} from '../../utils'

const state = {
  loading: {
    app: {},
    user: {},
    users: {},
    ldap: {}
  },
  working: {
    app: {},
    user: {},
    users: {},
    ldap: {}
  },
  isProduction: process.env.NODE_ENV === 'production',
  demoEnvironment: {}
}

const getters = {
  isProduction: state => state.isProduction,
  loading: state => state.loading,
  working: state => state.working,
  demoEnvironment: state => state.demoEnvironment
}

const mutations = {
  [types.SET_WORKING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.working[data.group]) {
      Vue.set(state.working, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.working[data.group][data.type]) {
      Vue.set(state.working[data.group], data.type, data.value)
    } else {
      state.working[data.group][data.type] = data.value
    }
  },
  [types.SET_LOADING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.loading[data.group]) {
      Vue.set(state.loading, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.loading[data.group][data.type]) {
      Vue.set(state.loading[data.group], data.type, data.value)
    } else {
      state.loading[data.group][data.type] = data.value
    }
  },
  [types.SET_ENVIRONMENT] (state, data) {
    state.demoEnvironment = data
  }
}

const actions = {
  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },
  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  },
  async getDemoEnvironment ({commit, dispatch, getters}) {
    console.log('get demo environment...')
    // get system environment info
    dispatch('setLoading', {group: 'app', type: 'demo', value: true})
    try {
      const url = getters.endpoints.demo
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        }
      }
      const environment = await fetch(url, options)
      commit(types.SET_ENVIRONMENT, environment)
    } catch (e) {
      Toast.open({
        message: 'Failed to load demo environment information: ' + e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'app', type: 'demo', value: false})
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
