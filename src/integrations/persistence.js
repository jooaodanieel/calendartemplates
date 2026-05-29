import { v7 as uuid } from "uuid"
import Dexie from 'dexie';
import { Template } from '../models/template';

export const db = new Dexie('calendar-templates');

db.version(1).stores({
  templates: '++id, &name',
  events: '++id',
  previews: '++id, &[label+day+time]'
});

export const previewStore = {
  save: async (preview) => {
    await db.previews.add(preview)
  },

  findBy: async (label, day, time) => {
    return await db.previews
      .where({ label, day, time })
      .first()
  },

  delete: async (label, day, time) => {
    await db.previews
      .where({ label, day, time })
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
  }
}

export class TemplateDAO {
  constructor(id, name, durationInMinutes, before, after, isBusy, colorId) {
    this.id = id;
    this.name = name;
    this.durationInMinutes = durationInMinutes;
    this.before = before;
    this.after = after;
    this.isBusy = isBusy;
    this.colorId = colorId;
  }

  static async all() {
    const records = await db.templates.toArray();
    return records.map(Template.hydrate);
  }

  static async isEmpty() {
    const n = await db.templates.count();
    return n === 0;
  }

  static async findByName(queryName) {
    const { id, name, durationInMinutes, before, after, isBusy, colorId } =
      await db.templates.where('name').equals(queryName).first();
    return new TemplateDAO(
      id,
      name,
      durationInMinutes,
      before,
      after,
      isBusy,
      colorId
    );
  }

  static async create(template) {
    await db.templates.add(template);
  }

  async delete() {
    await db.templates.delete(this.id);
  }
}
