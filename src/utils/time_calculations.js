export class TimeCalculations {
  // returns the day before 'deltaInMinutes' of the current moment expressed by "day" and "time"
  // example: dayBeforeMinutes("18/03/2026", "7.10", 15) => "18/03/2026"
  // example: dayBeforeMinutes("18/03/2026", "0.10", 30) => "17/03/2026"
  static dayBeforeMinutes(day, time, deltaInMinutes) {
    const [hours, minutes] = time.split('.').map(Number);
    const totalMinutes = hours * 60 + minutes - deltaInMinutes;

    if (totalMinutes >= 0) return day;

    const [d, m, y] = day.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(
      date.getDate() + Math.ceil(Math.abs(totalMinutes) / 1440) * -1
    );
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }

  // returns the time before 'deltaInMinutes' of the current moment expressed by "time"
  // example: timeBeforeMinutes("7.10", 50) => "6.20"
  // example: timeBeforeMinutes("00.10", 20) => "23.50"
  static timeBeforeMinutes(time, deltaInMinutes) {
    const [hours, minutes] = time.split('.').map(Number);
    let totalMinutes = hours * 60 + minutes - deltaInMinutes;

    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}.${String(m).padStart(2, '0')}`;
  }

  // returns the day after 'deltaInMinutes' have passed from the current moment expressed by "day" and "time"
  // example: dayAfterMinutes("18/03/2026", "7.10", 50) => "18/03/2026"
  // example: dayAfterMinutes("18/03/2026", "23.40", 30) => "19/03/2026"
  static dayAfterMinutes(day, time, deltaInMinutes) {
    const [hours, minutes] = time.split('.').map(Number);
    const totalMinutes = hours * 60 + minutes + deltaInMinutes;

    if (totalMinutes < 1440) return day;

    const [d, m, y] = day.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + Math.floor(totalMinutes / 1440));
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }

  // returns the time after 'deltaInMinutes' have passed from the current moment expressed by "time"
  // example: timeAfterMinutes("7.10", 50) => "8.00"
  // example: timeAfterMinutes("23.10", 90) => "0.40"
  static timeAfterMinutes(time, deltaInMinutes) {
    const [hours, minutes] = time.split('.').map(Number);
    let totalMinutes = hours * 60 + minutes + deltaInMinutes;

    totalMinutes = totalMinutes % 1440;

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}.${String(m).padStart(2, '0')}`;
  }

  static sortEvents(events) {
    return [...events].sort((a, b) => {
      if (a.day !== b.day) {
        const [dA, mA, yA] = a.day.split('/').map(Number);
        const [dB, mB, yB] = b.day.split('/').map(Number);
        const dateA = new Date(yA, mA - 1, dA);
        const dateB = new Date(yB, mB - 1, dB);
        return dateA - dateB;
      }

      const [hA, minA] = a.time.split('.').map(Number);
      const [hB, minB] = b.time.split('.').map(Number);

      return hA * 60 + minA - (hB * 60 + minB);
    });
  }
}
