import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  return Cookies.get('userName')
}

export function setName(name) {
  return Cookies.set('userName', name)
}

export function removeName() {
  return Cookies.remove('userName')
}
