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

export const getTemplateIdByName = async function (name) {
  const { id } = await db.templates.where('name').equals(name).first();
  return id;
};

export const deleteTemplate = async function (id) {
  await db.templates.delete(id);
};

export const storeTemplate = async function (template) {
  await db.templates.add({ ...template });
};
