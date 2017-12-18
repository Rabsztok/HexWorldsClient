import axios from "axios"
// require('axios-debug')(axios)
import assign from "lodash/assign"
import cookie from "js-cookie"
import param from "jquery-param"

class Api {
  errors = {
    UNAUTHENTICATED: { type: "unauthenticated" },
    WRONG_CREDENTIALS: { type: "wrong_credentials" }
  }

  paths = {
    oauthTokenPath: "/oauth/token",
    signOutPath: "/sign_out"
  }

  constructor({ access_token, refresh_token, paths = {} }) {
    this.apiUrl = process.env.REACT_APP_API_URL
    this.access_token = access_token || cookie.get("access_token") || null
    this.refresh_token = refresh_token || cookie.get("refresh_token") || null

    Object.assign(this.paths, paths)
  }

  ready() {
    return this.access_token !== null
  }

  setCredentials({ access_token, refresh_token }) {
    if (typeof access_token !== "undefined") {
      this.access_token = access_token
      if (access_token === null) {
        cookie.remove("access_token")
      } else {
        cookie.set("access_token", access_token, { path: "/" })
      }
    }

    if (typeof refresh_token !== "undefined") {
      this.refresh_token = refresh_token
      if (access_token === null) {
        cookie.remove("refresh_token")
      } else {
        cookie.set("refresh_token", refresh_token, { path: "/" })
      }
    }
  }

  resetCredentials() {
    return this.setCredentials({ access_token: null, refresh_token: null })
  }

  rollbackSession() {
    this.setCredentials({
      access_token: cookie.get("rollback_access_token"),
      refresh_token: cookie.get("rollback_refresh_token")
    })

    cookie.remove("rollback_access_token")
    cookie.remove("rollback_refresh_token")
  }

  async get(endpoint, params = {}, opts = {}) {
    return await this.send(
      assign({ method: "get", endpoint: endpoint, params: params }, opts)
    )
  }

  async post(endpoint, payload = {}, opts = {}) {
    return await this.send(
      assign({ method: "post", endpoint: endpoint, payload: payload }, opts)
    )
  }

  async put(endpoint, payload = {}, opts = {}) {
    return await this.send(
      assign({ method: "put", endpoint: endpoint, payload: payload }, opts)
    )
  }

  async patch(endpoint, payload = {}, opts = {}) {
    return await this.send(
      assign({ method: "patch", endpoint: endpoint, payload: payload }, opts)
    )
  }
  async delete(endpoint, payload = {}, opts = {}) {
    return await this.send(
      assign({ method: "delete", endpoint: endpoint, payload: payload }, opts)
    )
  }

  async send(request) {
    const {
      method = "get",
      endpoint,
      payload = {},
      authentication = !!this.access_token,
      headers = {},
      refresh_authentication = true,
      params
    } = request

    // if (authentication && !this.access_token) {
    //   throw this.errors.UNAUTHENTICATED
    // }

    if (authentication) {
      headers["Authorization"] = `bearer ${this.access_token}`
    }

    const url =
      endpoint[0] === "/"
        ? this.apiUrl + endpoint
        : this.apiUrl + "/" + endpoint

    try {
      const response = await axios({
        method,
        url,
        headers,
        params,
        paramsSerializer: params => param(params),
        data: payload,
        responseType: "json"
      })

      const result = response.data

      return result
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        refresh_authentication
      ) {
        try {
          await this.refreshOauthToken()
          return this.send(request) // retry
        } catch (e) {
          throw this.errors.UNAUTHENTICATED
        }
      } else {
        throw error
      }
    }
  }

  async requestOauthToken(email, password) {
    try {
      const request = await axios.post(
        this.apiUrl + this.paths.oauthTokenPath,
        {
          grant_type: "password",
          email: email,
          password: password
        }
      )

      this.setCredentials(request.data)
    } catch (error) {
      if (error.response && Number(error.response.status) === 401) {
        throw this.errors.WRONG_CREDENTIALS
      } else {
        throw error
      }
    }
  }

  async refreshOauthToken() {
    try {
      const request = await axios.post(
        this.apiUrl + this.paths.oauthTokenPath,
        {
          grant_type: "refresh_token",
          refresh_token: this.refresh_token
        }
      )

      this.setCredentials(request.data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.clearSession()
        throw this.errors.WRONG_CREDENTIALS
      } else {
        throw error
      }
    }
  }

  clearSession() {
    this.resetCredentials()
    if (cookie.get("rollback_access_token")) this.rollbackSession()

    return true
  }

  errorResponse(error) {
    return (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errors
    )
  }
}

const apiClient = new Api({})
export {apiClient}
export default Api
