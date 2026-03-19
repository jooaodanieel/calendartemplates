export class SmartEvent {
  constructor(label, day, time, endDay, endTime) {
    this.label = label;
    this.day = day;
    this.time = time;
    this.endDay = endDay;
    this.endTime = endTime;
  }

  startDateToISO() {
    const [d, m, y] = this.day.split('/').map(Number);
    const [h, min] = this.time.split('.').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
  }

  endDateToISO() {
    const [d, m, y] = this.endDay.split('/').map(Number);
    const [h, min] = this.endTime.split('.').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
  }
}
