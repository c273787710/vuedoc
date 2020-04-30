import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken,removeUid, setUid } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),

    adminInfo : {} ,
    isLogin : false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ADMIN_INFO : (state,data) => {
    state.adminInfo = data
    state.isLogin = true
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_ADMIN_INFO', data)
        setToken(data.token)
        setUid(data.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_ADMIN_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登陆
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((res) => {
        Message({
          message: res.msg ,
          type: 'success',
          duration: 5 * 1000
        })
        removeToken() // must remove  token  first
        removeUid()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUid()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

