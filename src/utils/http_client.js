import {
  EVENT_API_URL,
  smartEventToGoogleEvent,
  USER_INFO_API_URL,
  taskApiURlForList,
  TASK_LISTS_URL,
  signIn,
} from '@/integrations/google_calendar';

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
    const runFetch = async () => await fetch(TASK_LISTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let resp = await runFetch()

    if (resp.status == 401) {
      await signIn()
      resp = await runFetch()
    }

    return await resp.json();
  },

  postTask: async function (token, task) {  
    const id = task.listId
    const url = taskApiURlForList(id);

    const { listId, ...noListId } = task

    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noListId),
    });
  },
};
