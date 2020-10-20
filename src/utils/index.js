// sleep / noop
export const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// convert camelCase string to Title Case
export const camelToTitle = function (text) {
  try {
    const result = text.replace( /([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
  } catch (e) {
    // return original string if we failed to do character replacements
    return text
  }  
}

// helper function to append query parameters to a URL for fetch
export const addUrlQueryParams = function (endpoint, params) {
  let url = endpoint
  if (typeof params === 'object') {
    // append URL query paramenters
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = keys[key]
      if (i === 0) {
        url += '?'
      } else {
        url += '&'
      }
      url += encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  }
  return url
}

export const fetch = async function (url, options = {}) {
  if (!url) {
    throw Error('url is a required parameter for fetch')
  }
  // set content type to JSON by default
  options.headers = options.headers || {}
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
  
  // add query parameters to URL
  try {
    console.log('url', url)
    const endpoint = addUrlQueryParams(url, options.query)
    console.log('endpoint', endpoint)
    const response = await window.fetch(endpoint, options)
    const text = await response.text()
    if (response.ok) {
      try {
        return JSON.parse(text)
      } catch (e) {
        return text
      }
    } else {
      let m = text
      try {
        m = JSON.parse(text).message
      } catch (e) {
      }
      console.log('bad response', m)
      const error = Error(`${response.status} ${response.statusText} - ${m}`)
      error.status = response.status
      error.statusText = response.statusText
      error.text = m
      throw error
    }
  } catch (e) {
    // just rethrow any other errors, like connection timeouts
    throw e
  }
}
