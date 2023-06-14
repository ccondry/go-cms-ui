import * as types from 'src/store/mutation-types'

const state = {
  user: {}
}

const getters = {
  isAdmin: (state, getters) => {
    try {
      return getters.user.isAdmin
    } catch (e) {
      return false
    }
  },
  user: state => state.user,
  isQa: state => {
    try {
      return state.user.groups.includes('QA')
    } catch (e) {
      return false
    }
  },
  adUser: (state, getters) => {
    try {
      // find the user in the users list
      return getters.users.find(v => {
        try {
          return v.sAMAccountName === getters.user.sAMAccountName
        } catch (e) {
          return false
        }
      })
    } catch (e) {
      return null
    }
  },
}

const mutations = {
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
