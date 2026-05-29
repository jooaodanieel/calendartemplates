import { TimeCalculations } from "../../utils/time_calculations"
import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

export function makeApplyTemplateTo() {

  function generateAnchorEvent(label, day, time, template) {
    const endDay = TimeCalculations.dayAfterMinutes(
      day,
      time,
      template.durationInMinutes
    )
    const endTime = TimeCalculations.timeAfterMinutes(
      time, template.durationInMinutes
    )

    return {
      label,
      day,
      time,
      endDay,
      endTime,
      isBusy: template.isBusy,
      colorId: template.colorId
    }
  }

  function generatePreEvent(refDay, refTime, preEventTemplate, colorId) {
    const startDay = TimeCalculations.dayBeforeMinutes(
      refDay,
      refTime,
      preEventTemplate.durationInMinutes
    );
    const startTime = TimeCalculations.timeBeforeMinutes(
      refTime,
      preEventTemplate.durationInMinutes
    );

    return {
      label: preEventTemplate.name,
      day: startDay,
      time: startTime,
      endDay: refDay,
      endTime: refTime,
      isBusy: preEventTemplate.isBusy,
      colorId
    }
  }

  function generatePostEvent(refDay, refTime, postEventTemplate, colorId) {
    const endDay = TimeCalculations.dayAfterMinutes(
      refDay,
      refTime,
      postEventTemplate.durationInMinutes
    );
    const endTime = TimeCalculations.timeAfterMinutes(
      refTime,
      postEventTemplate.durationInMinutes
    );

    return {
      label: postEventTemplate.name,
      day: refDay,
      time: refTime,
      endDay,
      endTime,
      isBusy: postEventTemplate.isBusy,
      colorId
    }
  }
  
  return ({ template, label, day, time }) => {
    const anchorEvent = generateAnchorEvent(label, day, time, template)

    let refDay = day
    let refTime = time

    const wrappingEvents = []

    for (const preTemplate of template.before) {
      const preEvent = generatePreEvent(refDay, refTime, preTemplate, template.colorId)
      wrappingEvents.unshift(preEvent)
      refDay = preEvent.day
      refTime = preEvent.time
    }

    refDay = TimeCalculations.dayAfterMinutes(
      day,
      time,
      template.durationInMinutes
    );
    refTime = TimeCalculations.timeAfterMinutes(
      time,
      template.durationInMinutes
    );

    for (const postEventTemplate of template.after) {
      const postEvent = generatePostEvent(
        refDay,
        refTime,
        postEventTemplate,
        template.colorId
      );
      wrappingEvents.push(postEvent);
      refDay = postEvent.endDay;
      refTime = postEvent.endTime;
    }

    return Event("TEMPLATE_APPLIED", "v1")
      .addPayload({ label, day, time })
      .addPayload({ anchorEvent })
      .addPayload({ wrappingEvents })
      .build()
  }
}

export function makePreview(previewStore) {
  di.ensure(previewStore, "previewStore")
    .hasFunction("findBy")

  return async (label, day, time) => {
    let res = await previewStore.findBy(label, day, time)

    if (res === undefined) return []
    
    const toSort = [res.anchorEvent, ...res.wrappingEvents]

    return TimeCalculations.sortEvents(toSort);
  }
}

export function makeUpdatePreviewAggregate(previewStore) {
  di.ensure(previewStore, "previewStore")
    .hasFunction("save")
  
  return async ({ payload }) => {
    await previewStore.save(payload)
  }
}
