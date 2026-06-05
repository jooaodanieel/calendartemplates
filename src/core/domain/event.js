import { minutesAfter, minutesBefore, sortByTime, toISO } from "../../utils/datetime"
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

  function makeGenerateDynamic(calDT, colorId) {
    return (block) => {
      const endCalDT = minutesAfter(calDT, block.scheduling.duration)

      return {
        label: block.title,
        day: calDT.day,
        time: calDT.time,
        endDay: endCalDT.day,
        endTime: endCalDT.time,
        isBusy: block.isBusy,
        colorId
      }
    }
  }

  function makeGenerateCalculated(calDT, colorId, blocks) {
    const generate = (block) => {
      
      const genDynamic = makeGenerateDynamic(calDT, colorId)
      const genFixed = makeGenerateFixed(calDT.day, colorId)

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

      const startCalDT = minutesBefore(refEvent, dur)

      const startDay = isAfterRef
        ? refEvent.endDay
        : startCalDT.day
      
      const startTime = isAfterRef
        ? refEvent.endTime
        : startCalDT.time
      
      const endCalDT = minutesAfter({ day: startDay, time: startTime }, dur)
      
      return {
        label: block.title,
        day: startDay,
        time: startTime,
        endDay: endCalDT.day,
        endTime: endCalDT.time,
        isBusy: block.isBusy,
        colorId
      }
    }

    return generate
  }
  
  return ({ template, label, calDT }) => {
    const colorId = template.colorId

    const fixed = template.blocks
      .filter(block => block.scheduling.type === "fixed")
      .map(makeGenerateFixed(calDT.day, colorId))

    const dynamic = template.blocks
      .filter(block => block.scheduling.type === "dynamic")
      .map(makeGenerateDynamic(calDT, colorId))
    
    const calculated = template.blocks
      .filter(block => block.scheduling.type === "calculated")
      .map(makeGenerateCalculated(calDT, colorId, template.blocks))
    
    const tasks = template.tasks
      .map(({ label, list }) => ({
        label,
        list,
        day: calDT.day
      }))

    return Event("TEMPLATE_APPLIED", "v1")
      .addPayload({ label, calDateTime: calDT })
      .addPayload({ events: [...fixed, ...dynamic, ...calculated] })
      .addPayload({ tasks })
      .build()
  }
}

export function makePreview(previewStore) {
  di.ensure(previewStore, "previewStore")
    .hasFunction("findBy")

  return async (label, calDT) => {
    let res = await previewStore.findBy(label, calDT)

    if (res === undefined) return []

    return sortByTime(res.events)
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
        const { label, calDateTime } = meta.key
        await previewStore.delete(label, calDateTime)
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
  
  return async ({ label, calDateTime }) => {
    const preview = await previewStore.findBy(label, calDateTime)

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const events = preview.events
      .map((evt) => ({
        summary: evt.label,
        transparency: evt.isBusy ? "opaque" : "transparent",
        description: CAL_TEMP_TAG,
        colorId: evt.colorId,
        start: {
          dateTime: toISO({day: evt.day, time: evt.time}),
          timeZone,
        },
        end: {
          dateTime: toISO({ day: evt.endDay, time: evt.endTime}),
          timeZone,
        },
      }))
    
    const tasks = preview.tasks
      .map(t => ({
        title: t.label,
        notes: CAL_TEMP_TAG,
        status: "needsAction",
        due: toISO({ day: t.day, time: "12:00" }),
        listId: t.list.id
      }))

    return Event("PREVIEW_CONFIRMED", "v1")
      .addPayload({ events })
      .addPayload({ tasks })
      .addHeader({ key: { label, calDateTime } })
      .build()
  }
}
