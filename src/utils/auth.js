import Cookies from 'js-cookie'

const TokenKey = 'vue_admin__token'
const UidKey = 'vue_admin__uid'

export function getToken() {
  const token = Cookies.get(TokenKey)
  if(token){
    return token ;
  }
  return null;
}
export function getUid() {
  const uid = Cookies.get(UidKey)
  if(uid) return uid;
  return 0 ;
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setUid(uid) {
  return Cookies.set(UidKey, uid)
}


export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeUid() {
  return Cookies.remove(UidKey)
}
