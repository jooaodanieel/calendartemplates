export class Queues {
  queues = {}
  callbacks = {}

  constructor() {
    this.queues = {}
    this.callbacks = {}
  }

  append(event) {
    const type = event.event;
    this._ensureQueue(type)
    this.queues[type].push(event)
    this.callbacks[type].forEach(cb => cb(event))
  }

  registerCallback(callback, type) {
    this._ensureQueue(type)
    this.callbacks[type].push(callback)
  }

  _ensureQueue(type) {
    if (this.queues[type] === undefined) {
      this.queues[type] = []
      this.callbacks[type] = []
    }
  }
}