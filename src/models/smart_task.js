export class SmartTask {
  constructor(label, day, listName, description) {
    this.label = label;
    this.day = day;
    this.listName = listName;
    this.description = description;
  }

  dateToISO() {
    const [d, m, y] = this.day.split('/').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`;
  }
}
