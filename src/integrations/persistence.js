import Dexie from 'dexie';
import { Template } from '../models/template';

export const db = new Dexie('calendar-templates');

db.version(1).stores({
  templates: '++id, name',
});

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

  static async findByName(name) {
    const record = await db.templates.where('name').equals(name).first();
    return new TemplateDAO(...record);
  }

  static async create(template) {
    await db.templates.add({ ...template });
  }

  async delete() {
    await db.templates.delete(this.id);
  }
}
