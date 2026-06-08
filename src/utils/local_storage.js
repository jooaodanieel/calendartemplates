const ls = window.localStorage;

const TOKEN_KEY = 'gsi_token';
const USER_KEY = 'gsi_user';
const VISITING_META_KEY = "is_old_visitor"

export const localStorage = {
  setToken: (token) => ls.setItem(TOKEN_KEY, token),
  getToken: () => ls.getItem(TOKEN_KEY),
  deleteToken: () => ls.removeItem(TOKEN_KEY),

  setUser: (user) => ls.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => JSON.parse(ls.getItem(USER_KEY)),
  deleteUser: () => ls.removeItem(USER_KEY),

  hasVisited: () => !!ls.getItem(VISITING_META_KEY),
  markVisited: () => ls.setItem(VISITING_META_KEY, true),
  markUnvisited: () => ls.setItem(VISITING_META_KEY, false)
};
