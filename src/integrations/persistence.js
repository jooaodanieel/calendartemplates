import { v7 as uuid } from "uuid"
import Dexie from 'dexie';
import { toString } from "@/utils/datetime";

export const db = new Dexie('calendar-templates');

db.version(1).stores({
  templates: '++id, &name',
  events: '++id',
  previews: '++id, &[label+cdt]'
});

export const previewStore = {
  save: async (preview) => {
    const { calDateTime, ...rest } = preview
    await db.previews.add({ ...rest, cdt: toString(calDateTime)})
  },

  findBy: async (label, calDateTime) => {
    return await db.previews
      .get({ label, cdt: toString(calDateTime) })
  },

  delete: async (label, calDateTime) => {
    await db.previews
      .where({ label, cdt: toString(calDateTime) })
      .delete()
  }
}

export const brokerStore = {
  put: async (event) => {
    await db.events.add(event)
  }
}

export const templateStore = {
  nextId: () => { 
    const id = uuid()
    return `tpl-${id}`
  },

  hasName: async (name) => {
    const count = await db.templates
      .where("name")
      .equals(name)
      .count()
    
    return count > 0
  },

  findByName: async (name) => {
    return await db.templates
      .where("name")
      .equals(name)
      .first()
  },

  save: async (template) => {
    await db.templates.add(template)
  },

  delete: async (template) => {
    await db.templates.delete(template.id)
  },

  all: async () => {
    return await db.templates.toArray()
  },

  isEmpty: async () => {
    return await db.templates.count() === 0
  }
}
