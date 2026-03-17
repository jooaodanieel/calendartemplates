import { TimeCalculations } from "../utils/time_calculations";
import { SmartEvent } from "./smart_event";

export class Template {
    static builder() {
        return new TemplateBuilder();
    }

    constructor(name, durationInMinutes, before, after) {
        this.name = name;
        this.durationInMinutes = durationInMinutes;
        this.before = before;
        this.after = after;
    }

    applyTo(label, day, time) {
        const anchorEvent = this.generateAnchorEvent(label, day, time);
        const wrappingEvents = this.generateWrappingEvents(day, time);

        return [anchorEvent, ...wrappingEvents];
    }

    generateAnchorEvent(label, day, time) {
        const entDay = TimeCalculations.dayAfterMinutes(day, time, this.durationInMinutes);
        const endTime = TimeCalculations.timeAfterMinutes(time, this.durationInMinutes);
        
        return new SmartEvent(label, day, time, entDay, endTime);
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

        refDay = TimeCalculations.dayAfterMinutes(day, time, this.durationInMinutes);
        refTime = TimeCalculations.timeAfterMinutes(time, this.durationInMinutes);

        for (const postEventTemplate of this.after) {
            const postEvent = this.generatePostEvent(refDay, refTime, postEventTemplate);
            wrappingEvents.push(postEvent);
            refDay = postEvent.endDay;
            refTime = postEvent.endTime;
        }

        return wrappingEvents;
    }

    generatePreEvent(refDay, refTime, preEventTemplate) {
        const startDay = TimeCalculations.dayBeforeMinutes(refDay, refTime, preEventTemplate.durationInMinutes);
        const startTime = TimeCalculations.timeBeforeMinutes(refTime, preEventTemplate.durationInMinutes);

        return new SmartEvent(preEventTemplate.name, startDay, startTime, refDay, refTime);
    }

    generatePostEvent(refDay, refTime, postEventTemplate) {
        const endDay = TimeCalculations.dayAfterMinutes(refDay, refTime, postEventTemplate.durationInMinutes);
        const endTime = TimeCalculations.timeAfterMinutes(refTime, postEventTemplate.durationInMinutes);

        return new SmartEvent(postEventTemplate.name, refDay, refTime, endDay, endTime);
    }
}

export class TemplateBuilder {

    constructor() {
        this.name = null;
        this.durationInMinutes = null;
        this.before = [];
        this.after = [];
    }

    for(name) {
        this.name = name;

        return this;
    }

    withDurationMinutes(durationInMinutes) {
        this.durationInMinutes = durationInMinutes

        return this;
    }
    
    precededBy(subTemplateBuilder) {
        const subTemplate = subTemplateBuilder.build();

        this.before.unshift(subTemplate)

        return this;
    }
    
    followedBy(subTemplateBuilder) {
        const subTemplate = subTemplateBuilder.build();

        this.after.push(subTemplate)

        return this;
    }
    
    build() {
        return new Template(
            this.name,
            this.durationInMinutes,
            this.before,
            this.after
        );
    }
}
