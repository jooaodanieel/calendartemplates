import di from "../eventsourcing/dependencyInjection"

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
      return {
        event: "TEMPLATE_CREATION_FAILED",
        timestamp: (new Date()).getTime(),
        payload: {
          error: `name '${name}' already in use`
        }
      }

    const lastsMoreThanZero = durationInMinutes > 0
    if (!lastsMoreThanZero)
      return {
        event: "TEMPLATE_CREATION_FAILED",
        timestamp: (new Date()).getTime(),
        payload: {
          error: "duration must be greater than 0"
        }
      }
    
    return null
  }

  return async (createTemplateForm) => {
    return (await validate(createTemplateForm)) || {
      event: "TEMPLATE_CREATED",
      timestamp: (new Date()).getTime(),
      meta: { schemaVersion: "v1" },
      payload: {
        id: templateStore.nextId(),
        name:               createTemplateForm.name,
        durationInMinutes:  createTemplateForm.durationInMinutes,
        before:             createTemplateForm.before,
        after:              createTemplateForm.after,
        isBusy:             createTemplateForm.isBusy,
        colorId:            createTemplateForm.colorId,
        tasks:              createTemplateForm.tasks
      }
    }
  }
}

export function makeUpdateTemplateAggregate(templateStore) {
  di.ensure(templateStore, "templateStore")
    .hasFunction("save")
  
  return async ({ payload }) => {
    console.log(payload)
    await templateStore.save(payload)
  }
}