import { TimeCalculations } from '../utils/time_calculations';
import { SmartEvent } from './smart_event';

export class Template {
  static builder() {
    return new TemplateBuilder();
  }

  static hydrate(dbRecord) {
    const { name, durationInMinutes, before, after, isBusy, colorId } =
      dbRecord;

    return new Template(
      name,
      durationInMinutes,
      before,
      after,
      isBusy,
      colorId
    );
  }

  constructor(name, durationInMinutes, before, after, isBusy, colorId) {
    this.name = name;
    this.durationInMinutes = durationInMinutes;
    this.before = before;
    this.after = after;
    this.isBusy = isBusy;
    this.colorId = colorId;
  }

  displayString(attr) {
    const listAttrs = ['before', 'after'];
    if (listAttrs.includes(attr)) {
      return this[attr]
        .map((sub) => `${sub.name} (${sub.durationInMinutes} min)`)
        .join(', ');
    }

    return this[attr];
  }

  applyTo(label, day, time) {
    const anchorEvent = this.generateAnchorEvent(label, day, time);
    const wrappingEvents = this.generateWrappingEvents(day, time);

    return [anchorEvent, ...wrappingEvents];
  }

  generateAnchorEvent(label, day, time) {
    const entDay = TimeCalculations.dayAfterMinutes(
      day,
      time,
      this.durationInMinutes
    );
    const endTime = TimeCalculations.timeAfterMinutes(
      time,
      this.durationInMinutes
    );

    return new SmartEvent(
      label,
      day,
      time,
      entDay,
      endTime,
      this.isBusy,
      this.colorId
    );
  }

  generateWrappingEvents(day, time) {
    let refDay = day;
    let refTime = time;
    const wrappingEvents = [];

    for (const preEventTemplate of this.before) {
      const preEvent = this.generatePreEvent(refDay, refTime, preEventTemplate);
      wrappingEvents.unshift(preEvent);
      refDay = preEvent.day;
      refTime = preEvent.time;
    }

    refDay = TimeCalculations.dayAfterMinutes(
      day,
      time,
      this.durationInMinutes
    );
    refTime = TimeCalculations.timeAfterMinutes(time, this.durationInMinutes);

    for (const postEventTemplate of this.after) {
      const postEvent = this.generatePostEvent(
        refDay,
        refTime,
        postEventTemplate
      );
      wrappingEvents.push(postEvent);
      refDay = postEvent.endDay;
      refTime = postEvent.endTime;
    }

    return wrappingEvents;
  }

  generatePreEvent(refDay, refTime, preEventTemplate) {
    const startDay = TimeCalculations.dayBeforeMinutes(
      refDay,
      refTime,
      preEventTemplate.durationInMinutes
    );
    const startTime = TimeCalculations.timeBeforeMinutes(
      refTime,
      preEventTemplate.durationInMinutes
    );

    return new SmartEvent(
      preEventTemplate.name,
      startDay,
      startTime,
      refDay,
      refTime,
      preEventTemplate.isBusy,
      this.colorId
    );
  }

  generatePostEvent(refDay, refTime, postEventTemplate) {
    const endDay = TimeCalculations.dayAfterMinutes(
      refDay,
      refTime,
      postEventTemplate.durationInMinutes
    );
    const endTime = TimeCalculations.timeAfterMinutes(
      refTime,
      postEventTemplate.durationInMinutes
    );

    return new SmartEvent(
      postEventTemplate.name,
      refDay,
      refTime,
      endDay,
      endTime,
      postEventTemplate.isBusy,
      this.colorId
    );
  }
}

export class TemplateBuilder {
  constructor() {
    this.name = null;
    this.durationInMinutes = null;
    this.before = [];
    this.after = [];
    this.isBusy = true;
    this.colorId = 11;
  }

  for(name) {
    this.name = name;

    return this;
  }

  markAsBusy(check) {
    this.isBusy = check;

    return this;
  }

  coloredWith({ id }) {
    this.colorId = id;
    return this;
  }

  withDurationMinutes(durationInMinutes) {
    this.durationInMinutes = durationInMinutes;

    return this;
  }

  precededBy(subTemplateBuilder) {
    const subTemplate = subTemplateBuilder.build();

    this.before.unshift(subTemplate);

    return this;
  }

  followedBy(subTemplateBuilder) {
    const subTemplate = subTemplateBuilder.build();

    this.after.push(subTemplate);

    return this;
  }

  build() {
    return new Template(
      this.name,
      this.durationInMinutes,
      this.before,
      this.after,
      this.isBusy,
      this.colorId
    );
  }
}
