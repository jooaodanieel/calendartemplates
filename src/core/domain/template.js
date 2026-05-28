import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

export function makeImportTemplate(templateStore) {
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")

  ensureTemplateStore.hasFunction("nextId")
  ensureTemplateStore.hasFunction("hasName")

  async function validate({
    name,
    durationInMinutes
  }) {
    const isNameUsed = await templateStore.hasName(name)
    if (isNameUsed)
      return Event("TEMPLATE_IMPORTING_FAILED", "v1")
        .addPayload({ error: `name '${name}' already in use` })
        .build()

    const lastsMoreThanZero = durationInMinutes > 0
    if (!lastsMoreThanZero)
      return Event("TEMPLATE_IMPORTING_FAILED", "v1")
        .addPayload({ error: "duration must be greater than 0" })
        .build()
    
    return null
  }

  return async (templateJson) => {
    try {
      const createTemplateForm = JSON.parse(templateJson)

      return (await validate(createTemplateForm)) || Event("TEMPLATE_IMPORTED", "v1")
      .addPayload({ id: templateStore.nextId() })
      .addPayload({ name: createTemplateForm.name })
      .addPayload({ durationInMinutes: createTemplateForm.durationInMinutes })
      .addPayload({ before: createTemplateForm.before })
      .addPayload({ after: createTemplateForm.after })
      .addPayload({ isBusy: createTemplateForm.isBusy })
      .addPayload({ colorId: createTemplateForm.colorId })
      .addPayload({ tasks: createTemplateForm.tasks })
      .build()
    } catch (error) {
      return Event("TEMPLATE_IMPORTING_FAILED", "v1")
        .addPayload({ error: error.message })
        .build()
    }
  }
}

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
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")

  ensureTemplateStore.hasFunction("save")
  ensureTemplateStore.hasFunction("delete")
  
  return async ({ event, payload }) => {
    switch (event) {
      case "TEMPLATE_CREATED":
      case "TEMPLATE_IMPORTED":
        await templateStore.save(payload)
        break;
      
      case "TEMPLATE_DELETED":
        await templateStore.delete(payload)
        break;
    
      default:
        break;
    }

    
  }
}

export function makeAvailableTemplates(templateStore) {
  di.ensure(templateStore, "templateStore")
    .hasFunction("all")
  
  return async () => {
    const templates = await templateStore.all()

    return templates.reduce((indexedByName, currentTemplate) => {
      const current = {}
      current[currentTemplate.name] = currentTemplate
      return { ...indexedByName, ...current}
    }, {})
  }
}

export function makeExportableTemplates(templateStore) {
  di.ensure(templateStore, "templateStore")
    .hasFunction("all")
  
  return async () => {
    const all = await templateStore.all()

    return all.map(({ id, ...withoutId }) => ({
      ...withoutId,
      displayString: function (attr) {
        const listAttrs = ['before', 'after'];
        if (listAttrs.includes(attr)) {
          return this[attr]
            .map((sub) => `${sub.name} (${sub.durationInMinutes} min)`)
            .join(', ');
        }

        return this[attr];
      }
    }))
  }
}

export function makeDeleteTemplate(templateStore) {
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")
    
  ensureTemplateStore.hasFunction("hasName")
  ensureTemplateStore.hasFunction("findByName")
  
  return async (template) => {
    const { name } = template
    const hasName = await templateStore.hasName(name)

    if (!hasName)
      return Event("TEMPLATE_DELETION_ERROR", "v1")
        .addPayload({ error: `template named '${name}' doesn't exist` })
        .addPayload({ template })
        .build()
    
    const found = await templateStore.findByName(name)
    
    return Event("TEMPLATE_DELETED", "v1")
      .addPayload({ ...found })
      .build()
  }
}
