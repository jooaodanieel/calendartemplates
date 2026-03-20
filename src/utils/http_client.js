import {
  EVENT_API_URL,
  USER_INFO_API_URL,
} from '../integrations/google_calendar';

export const httpClient = {
  getUserInfo: async function (token) {
    const response = await fetch(USER_INFO_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  },

  postEvent: async function (token, evt) {
    return await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: evt.label,
        start: {
          dateTime: evt.startDateToISO(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: evt.startDateToISO(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
    });
  },
};
