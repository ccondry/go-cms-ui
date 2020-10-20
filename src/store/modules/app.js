import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  loading: {
    app: {},
    user: {},
    users: {},
    account: {}
  },
  working: {
    app: {},
    user: {},
    users: {},
    account: {}
  },
  isProduction: process.env.NODE_ENV === 'production'
}

const getters = {
  isProduction: (state) => state.isProduction,
  loading: (state) => state.loading,
  working: (state) => state.working
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
  }
}

const actions = {
  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },
  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
