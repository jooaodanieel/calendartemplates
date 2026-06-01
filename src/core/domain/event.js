import { TimeCalculations } from "../../utils/time_calculations"
import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

export function makeApplyTemplateTo() {
  function makeGenerateFixed(day, colorId) {
    return (block) => ({
      label: block.title,
      day,
      time: block.scheduling.start,
      endDay: day,
      endTime: block.scheduling.end,
      isBusy: block.isBusy,
      colorId
    })
  }

  function makeGenerateDynamic(day, time, colorId) {
    return (block) => ({
      label: block.title,
      day,
      time,
      endDay: TimeCalculations.dayAfterMinutes(day, time, block.scheduling.duration),
      endTime: TimeCalculations.timeAfterMinutes(time, block.scheduling.duration),
      isBusy: block.isBusy,
      colorId
    })
  }

  function makeGenerateCalculated(day, time, colorId, blocks) {
    const generate = (block) => {
      
      const genDynamic = makeGenerateDynamic(day, time, colorId)
      const genFixed = makeGenerateFixed(day, colorId)

      const refBlock = blocks.find((b) => b.title === block.scheduling.reference)

      const isAfterRef = block.scheduling.diffRef === "after"
      const dur = block.scheduling.duration

      let refEvent

      switch (refBlock.scheduling.type) {
        case "calculated":
          refEvent = generate(refBlock)
          break;
        
        case "dynamic":
          refEvent = genDynamic(refBlock)
          break
        
        default:
          refEvent = genFixed(refBlock)
          break;
      }

      const startDay = isAfterRef
        ? refEvent.endDay
        : TimeCalculations.dayBeforeMinutes(refEvent.day, refEvent.time, dur)
      
      const startTime = isAfterRef
        ? refEvent.endTime
        : TimeCalculations.timeBeforeMinutes(refEvent.time, dur)

      console.log(startDay, startTime)
      
      return {
        label: block.title,
        day: startDay,
        time: startTime,
        endDay: TimeCalculations.dayAfterMinutes(startDay, startTime, block.scheduling.duration),
        endTime: TimeCalculations.timeAfterMinutes(startTime, block.scheduling.duration),
        isBusy: block.isBusy,
        colorId
      }
    }

    return generate
  }
  
  return ({ template, label, day, time }) => {
    const colorId = template.colorId

    const fixed = template.blocks
      .filter(block => block.scheduling.type === "fixed")
      .map(makeGenerateFixed(day, colorId))

    const dynamic = template.blocks
      .filter(block => block.scheduling.type === "dynamic")
      .map(makeGenerateDynamic(day, time, colorId))
    
    const calculated = template.blocks
      .filter(block => block.scheduling.type === "calculated")
      .map(makeGenerateCalculated(day, time, colorId, template.blocks))

    return Event("TEMPLATE_APPLIED", "v1")
      .addPayload({ label, day, time })
      .addPayload({ events: [...fixed, ...dynamic, ...calculated] })
      .build()
  }
}

export function makePreview(previewStore) {
  di.ensure(previewStore, "previewStore")
    .hasFunction("findBy")

  return async (label, day, time) => {
    let res = await previewStore.findBy(label, day, time)

    if (res === undefined) return []

    return TimeCalculations.sortEvents(res.events);
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

    const events = preview.events
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
