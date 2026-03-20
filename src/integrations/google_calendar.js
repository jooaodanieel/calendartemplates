import { ref } from 'vue';
import { httpClient as http } from '../utils/http_client';
import { localStorage as ls } from '../utils/local_storage';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES =
  'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

export const USER_INFO_API_URL =
  'https://www.googleapis.com/oauth2/v3/userinfo';
export const EVENT_API_URL =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

let tokenClient = null;
export const accessToken = ref(null);
export const userInfo = ref(null);

export const initGoogleAuth = function () {
  if (!window.google) {
    console.error('Google Identity Services non ancora caricato');
    return;
  }

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: () => {},
  });

  const token = ls.getToken();
  const user = ls.getUser();

  if (token) {
    accessToken.value = token;
    userInfo.value = user;
  }
};

export const signIn = function () {
  return new Promise((resolve, reject) => {
    tokenClient.callback = async (response) => {
      if (response.error) {
        reject(response.error);
        return;
      }
      accessToken.value = response.access_token;

      userInfo.value = await http.getUserInfo(accessToken.value);

      ls.setToken(accessToken.value);
      ls.setUser(userInfo.value);

      resolve();
    };
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  });
};

export const isSignedIn = function () {
  return accessToken.value !== null;
};

export const flushToGoogleCalendar = async function (smartEvents) {
  if (!isSignedIn()) await signIn();

  const flush = async function (evt) {
    return await http.postEvent(accessToken.value, evt);
  };

  for (const event of smartEvents) {
    const response = await flush(event);

    const retryAfterReLoggingIn = async () => {
      ls.deleteToken();
      ls.deleteUser();

      accessToken.value = null;
      userInfo.value = null;

      await signIn();
      await flush(event);
    };

    switch (response.status) {
      case 401:
        await retryAfterReLoggingIn();
    }
  }
};
