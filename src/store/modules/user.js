import {
  addUrlQueryParams,
  getUrlQueryParams,
  fetch
} from '../../utils'
import {ToastProgrammatic as Toast} from 'buefy'
import * as types from '../mutation-types'

// parse a JWT payload into a JSON object
function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null,
  adUser: null
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.SET_AD_USER] (state, data) {
    state.adUser = data
  }
}

const getters = {
  isAdmin: (state, getters) => {
    try {
      // const adminGroupDn = 'CN=test,CN=Users,DC=uk,DC=cms-dcloud,DC=com'
      // return getters.adUser.memberOf.includes(adminGroupDn)
      return getters.jwtUser.isAdmin
    } catch (e) {
      return false
    }
  },
  adUser: state => state.adUser,
  jwt: state => state.jwt,
  isLoggedIn: (state, getters) => {
    try {
      return getters.jwtUser.email.length > 0
    } catch (e) {
      return false
    }
  },
  jwtUser: state => {
    try {
      return parseJwt(state.jwt)
    } catch (e) {
      return null
    }
  },
  ssoRedirectUri: () => {
    // the URL the browser should return to once SSO is done
    return `${window.location.protocol}//${window.location.host}/`
  },
  ssoUrl: (state, getters) => {
    // the URL to send the user to for SSO login
    const endpoint = 'https://cloudsso.cisco.com/as/authorization.oauth2'
    const scopes = [
      'profile',
      'email',
      'openid'
    ]
    const params = {
      client_id: 'go-cms-login',
      response_type: 'code',
      redirect_uri: getters.ssoRedirectUri,
      scope: scopes.join(' '),
      state: 'go-cms-login'
    }
    return addUrlQueryParams(endpoint, params)
  }
}

const actions = {
  setJwt ({commit, dispatch}, jwt) {
    try {
      // test parse JWT to user JSON
      parseJwt(jwt)
      // put JWT in state
      commit(types.SET_JWT, jwt)
      // put JWT in localStorage
      window.localStorage.setItem('jwt', jwt)
    } catch (e) {
      // parseJwt failed - delete this invalid JWT
      dispatch('unsetJwt')
    }
  },
  unsetJwt ({commit}) {
    // remove JWT from state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
  },
  logout ({dispatch}) {
    dispatch('unsetJwt')
  },
  async disableAccount ({getters, dispatch}) {
    console.log('user.disableAccount action')
    dispatch('setWorking', {group: 'account', type: 'disable', value: true})
    const url = getters.endpoints.disableAccount
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await fetch(url, options)
      // success - refresh account data
      dispatch('getAccount')
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
      dispatch('setWorking', {group: 'account', type: 'disable', value: false})
    }
  },
  async enableAccount ({getters, dispatch}) {
    console.log('user.enableAccount action')
    dispatch('setWorking', {group: 'account', type: 'enable', value: true})
    const url = getters.endpoints.enableAccount
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await fetch(url, options)
      // success - refresh account data
      dispatch('getAccount')
      Toast.open({
        message: 'enable account success',
        duration: 10 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: `failed to enable account: ${e.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'account', type: 'enable', value: false})
    }
  },
  async createAccount ({dispatch, getters}, {dn, password, passcode}) {
    console.log('user.createAccount action')
    dispatch('setWorking', {group: 'account', type: 'create', value: true})

    const url = getters.endpoints.account
    const options = {
      method: 'POST',
      body: {dn, password, passcode},
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await fetch(url, options)
      dispatch('getAccount')
      Toast.open({
        message: 'create account success',
        duration: 10 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'account', type: 'create', value: false})
    }
  },
  async getAccount ({dispatch, getters}) {
    console.log('user.getAccount action')
    // check user active directory account exists
    dispatch('setLoading', {group: 'account', type: 'get', value: true})
    const url = getters.endpoints.account
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      const user = await fetch(url, options)
      console.log('getAccount user:', user)
      this.commit(types.SET_AD_USER, user)
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
      dispatch('setLoading', {group: 'account', type: 'get', value: false})
    }
  },
  async checkJwt ({dispatch, getters}) {
    // check jwt in browser local storage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null && jwt.length > 40) {
      console.log('found existing JWT in localStorage')
      // store JWT in state
      dispatch('setJwt', jwt)
    } else {
      // Toast.open({
      //   message: getters.ssoUrl,
      //   duration: 200000
      // })
      // get current URL query params
      const query = getUrlQueryParams()
      if (query.code) {
        // has SSO auth code - send to REST API to get JWT
        const url = getters.endpoints.sso
        // pass our current URL query params to REST API
        const options = {
          method: 'POST',
          body: query
        }
        dispatch('setWorking', {group: 'user', type: 'login', value: true})
        try {
          const response = await fetch(url, options)
          if (response.jwt) {
            dispatch('setJwt', response.jwt)
          }
        } catch (e) {
          const regex = /^Authorization code is invalid or expired/i
          if (e.status === 400 && e.text.match(regex)) {
            // expired SSO auth code - send user back to SSO login
            window.location = getters.ssoUrl
          } else {
            // unexpected SSO error - display to user
            Toast.open({
              message: e.message,
              duration: 10 * 1000,
              type: 'is-danger'
            })
          }
        } finally {
          dispatch('setWorking', {group: 'user', type: 'login', value: false})
        }
      } else {
        // no SSO auth code - send user to SSO login
        window.location = getters.ssoUrl
      }
    }
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}