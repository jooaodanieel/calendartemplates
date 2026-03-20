import Dexie from 'dexie';
import { Template } from '../models/template';

export const db = new Dexie('calendar-templates');

db.version(1).stores({
  templates: '++id, name',
});

export const allTemplates = async function () {
  const all = await db.templates.toArray();

  return all.map(Template.hydrate);
};

export const storeTemplate = async function (template) {
  await db.templates.add({ ...template });
};
