import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

export function makeImportTemplate(templateStore) {
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")

  ensureTemplateStore.hasFunction("nextId")
  ensureTemplateStore.hasFunction("hasName")

  async function validate({ name }) {
    const isNameUsed = await templateStore.hasName(name)

    if (!isNameUsed)
      return { valid: true }

    return { valid: false, error: `name '${name}' already in use` }
  }

  return async (templateJson) => {
    try {
      const createTemplateForm = JSON.parse(templateJson)
      const { valid, error } = await validate(createTemplateForm)
      
      if (!valid)
        return Event("TEMPLATE_IMPORTING_FAILED", "v1")
        .addPayload({ error })
        .build()

      return Event("TEMPLATE_IMPORTED", "v1")
        .addPayload({ id: templateStore.nextId() })
        .addPayload({ name: createTemplateForm.name })
        .addPayload({ colorId: createTemplateForm.colorId })
        .addPayload({ blocks: createTemplateForm.blocks })
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

  async function validate({ name }) {
    const isNameUsed = await templateStore.hasName(name)
    if (isNameUsed)
      return {
        hasError: true,
        error: `name '${name}' already in use`
      }
    
    return { hasError: false }
  }

  return async (createTemplateForm) => {
    const { hasError, error } = await validate(createTemplateForm)

    return hasError
      ? Event("TEMPLATE_CREATION_FAILED", "v1")
          .addPayload({ error })
          .build()
      : Event("TEMPLATE_CREATED", "v1")
          .addPayload({ id: templateStore.nextId() })
          .addPayload({ name: createTemplateForm.name })
          .addPayload({ colorId: createTemplateForm.colorId })
          .addPayload({ blocks: createTemplateForm.blocks })
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

    return all.map(({ id, ...withoutId }) => ({ ...withoutId }))
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
      return Event("TEMPLATE_DELETION_FAILED", "v1")
        .addPayload({ error: `template named '${name}' doesn't exist` })
        .addPayload({ template })
        .build()
    
    const found = await templateStore.findByName(name)
    
    return Event("TEMPLATE_DELETED", "v1")
      .addPayload({ ...found })
      .build()
  }
}
