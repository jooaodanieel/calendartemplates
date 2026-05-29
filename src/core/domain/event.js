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
  const ensurePreviewStore = di.ensure(previewStore, "previewStore")
  
  ensurePreviewStore.hasFunction("save")
  ensurePreviewStore.hasFunction("delete")
  
  return async ({ event, payload, meta }) => {
    switch (event) {
      case "TEMPLATE_APPLIED":
        await previewStore.save(payload)
        break;
      
      case "PREVIEW_CONFIRMED":
        const { label, day, time } = meta.key
        await previewStore.delete(label, day, time)
        break
    
      default:
        break;
    }
    
  }
}

export function makeConfirmPreview(previewStore) {
  const CAL_TEMP_TAG = '\n\n---\n#caltemp';

  di.ensure(previewStore, "previewStore")
    .hasFunction("findBy")

  function dateToISO(day, time) {
    const [d, m, y] = day.split('/').map(Number);
    const [h, min] = time.split('.').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`;
  }
  
  return async ({ label, day, time }) => {
    const preview = await previewStore.findBy(label, day, time)

    const events = [preview.anchorEvent, ...preview.wrappingEvents]
      .map((evt) => ({
        summary: evt.label,
        transparency: evt.isBusy ? "opaque" : "transparent",
        description: CAL_TEMP_TAG,
        colorId: evt.colorId,
        start: {
          dateTime: dateToISO(evt.day, evt.time),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: dateToISO(evt.endDay, evt.endTime),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }))

    return Event("PREVIEW_CONFIRMED", "v1")
      .addPayload({ events })
      .addHeader({ key: { label, day, time } })
      .build()
  }
}
