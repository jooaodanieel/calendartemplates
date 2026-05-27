import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

export function makeCreateTemplate(templateStore) {
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")

  ensureTemplateStore.hasFunction("nextId")
  ensureTemplateStore.hasFunction("hasName")

  async function validate({
    name,
    durationInMinutes
  }) {
    const isNameUsed = await templateStore.hasName(name)
    if (isNameUsed)
      return Event("TEMPLATE_CREATION_FAILED", "v1")
        .addPayload({ error: `name '${name}' already in use` })
        .build()

    const lastsMoreThanZero = durationInMinutes > 0
    if (!lastsMoreThanZero)
      return Event("TEMPLATE_CREATION_FAILED", "v1")
        .addPayload({ error: "duration must be greater than 0" })
        .build()
    
    return null
  }

  return async (createTemplateForm) => {
    return (await validate(createTemplateForm)) || Event("TEMPLATE_CREATED", "v1")
      .addPayload({ id: templateStore.nextId() })
      .addPayload({ name: createTemplateForm.name })
      .addPayload({ durationInMinutes: createTemplateForm.durationInMinutes })
      .addPayload({ before: createTemplateForm.before })
      .addPayload({ after: createTemplateForm.after })
      .addPayload({ isBusy: createTemplateForm.isBusy })
      .addPayload({ colorId: createTemplateForm.colorId })
      .addPayload({ tasks: createTemplateForm.tasks })
      .build()
    
  }
}

export function makeUpdateTemplateAggregate(templateStore) {
  di.ensure(templateStore, "templateStore")
    .hasFunction("save")
  
  return async ({ payload }) => {
    await templateStore.save(payload)
  }
}