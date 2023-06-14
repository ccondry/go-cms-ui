import * as types from 'src/store/mutation-types'
// import {ToastProgrammatic as Toast} from 'buefy'
import {addUrlQueryParams, sleep, parseJwt} from 'src/utils'
import router from 'src/router'

const state = {
  jwt: null,
  forwardTo: null,
  serverVersion: null,
  ssoInfo: null,
  oauth2Info: null,
  isLoggingIn: false,
}

const getters = {
  jwt: state => state.jwt,
  isLoggedIn: state => state.jwt !== null,
  isLoggingIn: state => state.isLoggingIn,
  forwardTo: state => state.forwardTo,
  serverVersion: state => state.serverVersion,
  oauth2Info: state => state.oauth2Info,
  ssoInfo: state => state.ssoInfo,
  ssoLoginUrl (state, getters) {
    try {
      const params = {
        client_id: getters.ssoInfo.clientId,
        // client_id: 'your-client-id',
        response_type: 'code',
        // where SSO should redirect back to when finished
        redirect_uri: getters.ciscoRedirectUri,
        scope: getters.ssoInfo.scopes.join(' '),
        // scope: ['profile', 'email', 'openid'].join(' '),
        // what to do with the user when they finish SSO login
        state: getters.ssoUrlState,
      }
      return addUrlQueryParams(getters.oauth2Info.authorization_endpoint, params)
    } catch (e) {
      return null
    }
  },
  ssoUrlState () {
    const defaultState = 'login:' + window.location
    try {
      // try to return current state
      const route = router.app._route
      return JSON.parse(JSON.stringify(route.query)).state || defaultState
    } catch (e) {
      // return the default state
      return defaultState
    }
  },
  ciscoRedirectUri () {
    // the URL to return to after completing SSO login
    return `${window.location.protocol}//${window.location.host}/`
  },
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.FORWARD_TO] (state, data) {
    state.forwardTo = data
  },
  [types.SET_OAUTH2_INFO] (state, data) {
    state.oauth2Info = data
  },
  [types.SET_SERVER_VERSION] (state, data) {
    state.serverVersion = data
  },
  [types.SET_SSO_INFO] (state, data) {
    state.ssoInfo = data
  },
  [types.SET_IS_LOGGING_IN] (state, data) {
    state.isLoggingIn = data
  },
}

const actions = {
  setForwardTo ({commit}, data) {
    commit(types.FORWARD_TO, data)
  },
  setJwt ({commit}, data) {
    commit(types.SET_JWT, data)
    // set authToken in localStorage also
    window.localStorage.setItem('jwt', data)
    // decode jwt and store as user data
    commit(types.SET_USER, parseJwt(data))
  },
  unsetJwt ({commit}) {
    // unset JWT in state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
    // unset user in state
    commit(types.SET_USER, null)
  },
  async getServerVersion ({getters, dispatch}) {
    // get OAUTH2 and other info about the API server
    return await dispatch('fetch', {
      group: 'app',
      type: 'serverVersion',
      message: 'get server version',
      value: true,
      url: getters.endpoints.serverVersion,
      mutation: types.SET_SERVER_VERSION,
      silent: true
    })
  },
  async getSsoInfo ({getters, dispatch}) {
    // get OAUTH2 and other info about the API server
    return await dispatch('fetch', {
      group: 'app',
      type: 'ssoInfo',
      message: 'get OAUTH2 server information',
      url: getters.endpoints.sso,
      mutation: types.SET_SSO_INFO,
      silent: true
    })
  },
  async getOauth2Info ({getters, dispatch}) {
    await dispatch('getSsoInfo')
    // wait for OAUTH2 info URL to exist
    while (!getters.ssoInfo || !getters.ssoInfo.infoUrl) {
      console.log('waiting for SSO info...')
      await sleep(50)
    }
    // get OAUTH2 server info so we can continue login
    return await dispatch('fetch', {
      group: 'app',
      type: 'oauth2Info',
      message: 'Get OAUTH2 server information',
      url: getters.ssoInfo.infoUrl,
      showNotification: false,
      mutation: types.SET_OAUTH2_INFO,
    })
  },
  async logout ({dispatch}) {
    console.log('logging out user')
    dispatch('unsetJwt')
  },
  async doSsoLogin ({commit, dispatch, getters}, query) {
    // don't run this more than once concurrently
    if (getters.isLoggingIn) {
      return
    }
    commit(types.SET_IS_LOGGING_IN, true)
    // complete the SSO login on the server
    const response = await dispatch('fetch', {
      group: 'user',
      type: 'login',
      message: 'Complete SSO login',
      url: getters.endpoints.sso,
      options: {
        method: 'POST',
        // pass our current URL query params to REST API
        body: query
      },
      showNotification: true
    })
    // remove SSO code and state from the current URL query parameters
    delete query.code
    delete query.state
    router.push({query})
    // if successful
    if (!(response instanceof Error)) {
      await dispatch('setJwt', response.jwt)
    }
    commit(types.SET_IS_LOGGING_IN, false)
  },
  async checkLogin ({dispatch, getters}) {
    console.log('checking localstorage for JWT login token')
    // dispatch('setWorking', {group: 'app', type: 'checkLogin', value: true})
    // const query = router.app._route.query
    const route = router.app._route
    // copy query object
    const query = JSON.parse(JSON.stringify(route.query))
    // is user completing SSO login right now?
    if (query && query.state && query.state.startsWith('login') && query.code) {
      await dispatch('doSsoLogin', query)
      return
    }
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt === null) {
      console.log('JWT not found in localstorage.')
      // forward user to login page
      dispatch('login')
      return
    }
    console.log('JWT login token found in localStorage')
    console.log('saving JWT in state')
    await dispatch('setJwt', jwt)
    console.log(getters.user.exp, (new Date().getTime() / 1000))
    if (getters.user.exp <= (new Date().getTime() / 1000)) {
      // JWT expired
      dispatch('unsetJwt')
    }
    // dispatch('setWorking', {group: 'app', type: 'checkLogin', value: false})
  },
  async login ({dispatch, getters}) {
    await dispatch('getOauth2Info')
    // wait for SSO login URL to exist
    while (!getters.ssoLoginUrl) {
      console.log('waiting for SSO login URL...')
      await sleep(50)
    }
    // forward browser to the SSO login URL
    window.location = getters.ssoLoginUrl
  },
  // getUser ({getters, dispatch}) {
  //   // get user info for this user
  //   if (!email || !email.length) {
  //     // throw new Error('email required for getUser action')
  //     return
  //   }
  //   return dispatch('fetch', {
  //     group: 'user',
  //     type: 'profile',
  //     message: 'Get user profile',
  //     url: getters.endpoints.user,
  //     mutation: types.SET_USER
  //   })
  // },
}

export default {
  state,
  mutations,
  actions,
  getters
}
