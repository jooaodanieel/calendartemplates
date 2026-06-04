/**
 * Returns a calTime object from an HTML input:time tag
 * 
 * @param { String } inputTime 
 * @returns { calTime } - { time: "HH:MM"}
 */
export function calTimeFromHtmlInput(inputTime) {
  return { time: inputTime }
}

/**
 * Returns a calDate object from an HTML input:date tag
 * 
 * @param { String } inputDate - "YYYY-MM-DD"
 * @returns { calDate } - { date: "DD/MM/YYYY"}
 */
export function calDateFromHtmlInput(inputDate) {
  const parsed = new Date(inputDate)

  const d = String(parsed.getDate()).padStart(2, '0')
  const mo = String(parsed.getMonth() + 1).padStart(2, '0')
  const y = parsed.getFullYear()

  const date = `${d}/${mo}/${y}`
  
  return { day: date }
}

export function calDateTimeFromHtmlInputs(inputDate, inputTime) {
  const d = calDateFromHtmlInput(inputDate)
  const t = calTimeFromHtmlInput(inputTime)

  return { ...d, ...t }
}

export function calDateTime(day, time) {
  return { day, time }
}

export function fromDate(date) {
  const d = String(date.getDate()).padStart(2, '0')
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()

  const h = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')

  return calDateTime(`${d}/${mo}/${y}`, `${h}:${mi}`)
}

export function now() {
  return fromDate(new Date())
}

export function toString({ day, time }) {
  return `${day}_${time}`
}

export function toISO({ day, time }) {
  const [d, m, y]   = day.split('/').map(Number)
  const [h, min]    = time.split(':').map(Number)
  const date        = new Date(y, m - 1, d, h, min, 0)
  const offsetMin   = -date.getTimezoneOffset()
  const sign        = offsetMin >= 0 ? '+' : '-'
  const absMin      = Math.abs(offsetMin)
  const oh          = String(Math.floor(absMin / 60)).padStart(2, '0')
  const om          = String(absMin % 60).padStart(2, '0')
  const pad = (n) => String(n).padStart(2, '0')
  return `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:00${sign}${oh}:${om}`
}

export function toHtmlInputDate({ day }) {
  const [d, m, y] = day.split('/')
  return `${y}-${m}-${d}`
}

export function fromHtmlInputs(inputDate, inputTime) {
  const [y, m, d] = inputDate.split('-')
  return { day: `${d}/${m}/${y}`, time: inputTime }
}

export function minutesAfter({ day, time }, deltaMinutes) {
  const [d, m, y] = day.split('/').map(Number)
  const [h, mi]   = time.split(':').map(Number)
  const date      = new Date(y, m - 1, d, h, mi + deltaMinutes, 0)
  return fromDate(date)
}

export function minutesBefore(calDateTime, deltaMinutes) {
  return minutesAfter(calDateTime, -deltaMinutes)
}

function _toEpochMillis({ day, time }) {
  const [d, m, y] = day.split('/').map(Number)
  const [h, mi]   = time.split(':').map(Number)
  return new Date(y, m - 1, d, h, mi, 0).getTime()
}

export function compare(a, b) {
  return _toEpochMillis(a) - _toEpochMillis(b)
}

export function sortByTime(events) {
  return [...events].sort((a, b) => compare(a, b))
}
