const getters = {
  endpoints: (state, getters) => {
    const urlBase = getters.isProduction ? '/api/v1' : 'http://localhost:4000/api/v1'
    return {
      sso: `${urlBase}/sso`,
      account: `${urlBase}/account`,
      enableAccount: `${urlBase}/account/enable`,
      disableAccount: `${urlBase}/account/disable`,
      users: `${urlBase}/users`,
      user: `${urlBase}/user`
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