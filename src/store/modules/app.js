import {version} from '../../../package.json'
// import {ToastProgrammatic as Toast} from 'buefy'
import * as types from 'src/store/mutation-types'

const state = {
  isProduction: process.env.NODE_ENV === 'production',
  uiVersion: version,
  demoEnvironment: null
}

const getters = {
  isProduction: state => state.isProduction,
  uiVersion: state => state.uiVersion,
  demoEnvironment: state => state.demoEnvironment,
  apiVersion: state => {
    try {
      return state.demoEnvironment.version
    } catch (e) {
      return 'Loading...'
    }
  }
}

const mutations = {
  [types.SET_ENVIRONMENT] (state, data) {
    state.demoEnvironment = data
  }
}

const actions = {
  async getDemoEnvironment ({dispatch, getters}) {
    // get system environment info
    return await dispatch('fetch', {
      group: 'app',
      type: 'demo',
      message: 'load demo environment',
      url: getters.endpoints.demo,
      mutation: types.SET_ENVIRONMENT
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
