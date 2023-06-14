const getters = {
  endpoints: (state, getters) => {
    let urlBase
    if (getters.isProduction) {
      urlBase = '/api/v1'
    } else {
      urlBase = 'http://localhost:4000/api/v1'
      // urlBase = 'http://198.19.201.120:4000/api/v1'
    }
    return {
      sso: `${urlBase}/sso`,
      users: `${urlBase}/users`,
      user: `${urlBase}/user`,
      demo: `${urlBase}/demo`,
      validLogin: `${urlBase}/valid`,
      logout: `${urlBase}/logout`,
      serverVersion: `${urlBase}/version`,
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}