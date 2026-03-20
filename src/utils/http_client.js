import {
  EVENT_API_URL,
  smartEventToGoogleEvent,
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
    const googleEvent = smartEventToGoogleEvent(evt);

    return await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEvent),
    });
  },
};
