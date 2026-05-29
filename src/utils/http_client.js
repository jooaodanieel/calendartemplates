import {
  EVENT_API_URL,
  smartEventToGoogleEvent,
  USER_INFO_API_URL,
  taskApiURlForList,
  TASK_LISTS_URL,
  smartTaskToGoogleTask,
} from '../integrations/google_calendar';

export const httpClient = {
  getUserInfo: async function (token) {
    const response = await fetch(USER_INFO_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  },

  postEvent: async function (token, evt, parse = false) {
    const googleEvent = parse ? smartEventToGoogleEvent(evt) : evt;

    return await fetch(EVENT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleEvent),
    });
  },

  getTaskLists: async function (token) {
    const resp = await fetch(TASK_LISTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status < 200 || resp.status >= 300) return resp;

    return await resp.json();
  },

  postTask: async function (token, smartTask) {
    const resp = await httpClient.getTaskLists(token);
    
    if (resp.status < 200 || resp.status >= 300) return resp;

    const { id } = resp.items.find((list) =>
      list.title.match(smartTask.listName)
    );
    const url = taskApiURlForList(id);

    const googleTask = smartTaskToGoogleTask(smartTask);

    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleTask),
    });
  },
};
