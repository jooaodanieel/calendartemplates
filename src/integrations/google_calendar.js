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

export const googleEventColors = [
  { name: 'Pavone', id: '1', hex: '#a4bdfc' },
  { name: 'Salvia', id: '2', hex: '#7ae28c' },
  { name: 'Uva', id: '3', hex: '#dbadff' },
  { name: 'Fenicottero', id: '4', hex: '#ff887c' },
  { name: 'Banana', id: '5', hex: '#fbd75b' },
  { name: 'Mandarino', id: '6', hex: '#ffb878' },
  { name: 'Lavanda', id: '7', hex: '#46d6db' },
  { name: 'Grafite', id: '8', hex: '#e1e1e1' },
  { name: 'Mirtillo', id: '9', hex: '#5484ed' },
  { name: 'Basilico', id: '10', hex: '#51b749' },
  { name: 'Pomodoro', id: '11', hex: '#dc2127' },
];

export const colorById = {
  1: '#a4bdfc',
  2: '#7ae28c',
  3: '#dbadff',
  4: '#ff887c',
  5: '#fbd75b',
  6: '#ffb878',
  7: '#46d6db',
  8: '#e1e1e1',
  9: '#5484ed',
  10: '#51b749',
  11: '#dc2127',
};

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

export const smartEventToGoogleEvent = (smartEvent) => {
  const { label, isBusy } = smartEvent;

  const CAL_TEMP_TAG = '\n\n---\n#caltemp';

  return {
    summary: label,
    transparency: isBusy ? 'opaque' : 'transparent',
    description: CAL_TEMP_TAG,
    colorId: smartEvent.colorId,
    start: {
      dateTime: smartEvent.startDateToISO(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: smartEvent.endDateToISO(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
};
