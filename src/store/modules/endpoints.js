const getters = {
  endpoints: (state, getters) => {
    const urlBase = getters.isProduction ? '/api/v1' : 'http://localhost:4000/api/v1'
    return {
      sso: `${urlBase}/sso`,
      account: `${urlBase}/account`
    }
  },
  defaultRestOptions: (state, getters) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    return options
  }
}

export default {
  getters
}