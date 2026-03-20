import Dexie from 'dexie';

export const db = new Dexie('calendar-templates');

db.version(1).stores({
  templates: '++id, name',
});

export const storeTemplate = async function (template) {
  await db.templates.add({...template});
};
