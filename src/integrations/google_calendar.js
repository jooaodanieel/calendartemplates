import { ref } from 'vue';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES =
  'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

let tokenClient = null;
export const accessToken = ref(null);
export const userInfo = ref(null);

const LS_TOKEN = 'gsi_token';
const LS_USER = 'gsi_user';

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

  const token = window.localStorage.getItem(LS_TOKEN);
  const user = window.localStorage.getItem(LS_USER);

  if (token) {
    accessToken.value = token;
    userInfo.value = JSON.parse(user);
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
      const resp = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken.value}` },
        }
      );
      userInfo.value = await resp.json();

      window.localStorage.setItem(LS_TOKEN, accessToken.value);
      window.localStorage.setItem(LS_USER, JSON.stringify(userInfo.value));

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
    return await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: evt.label,
          start: {
            dateTime: evt.startDateToISO(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: evt.endDateToISO(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      }
    );
  };

  for (const event of smartEvents) {
    const response = await flush(event);

    const retryAfterReLoggingIn = async () => {
      window.localStorage.removeItem(LS_TOKEN);
      window.localStorage.removeItem(LS_USER);

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
