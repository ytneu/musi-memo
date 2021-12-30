import Cookies from 'universal-cookie';

export const cookies = new Cookies();

export function getUser() {
  return sessionStorage.getItem('username');
}

export function setUserData(username) {
  sessionStorage.setItem('username', username);
}

export function deleteUserData() {
  if (getUser) {
    sessionStorage.removeItem('username');
  }
}

export function getSpotiToken() {
  return sessionStorage.getItem('spoti_token');
}

export function setSpotiToken(spoti_token) {
  sessionStorage.setItem('spoti_token', spoti_token);
}

export function deleteSpotiToken() {
  if (getSpotiToken) {
    sessionStorage.removeItem('spoti_token');
  }
}
