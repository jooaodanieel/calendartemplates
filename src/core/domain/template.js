import di from "../eventsourcing/dependencyInjection"
import { Event } from "../eventsourcing/event"

async function validateTemplateForm({ name, blocks, tasks }, templateStore) {
  const isNameUsed = await templateStore.hasName(name)
  if (isNameUsed)
    return {
      isValid: false,
      error: `name '${name}' already in use`
    }
  
  const allBlocksAreNamed = blocks.every(({ title }) => title.length > 0)
  if (!allBlocksAreNamed)
    return {
      isValid: false,
      error: `Template has block(s) with empty name`
    }
  
  const blocksWithNonPositiveDuration = blocks
    .filter(({ scheduling }) => {
      return scheduling.type != "fixed" && scheduling.duration <= 0
    })
  const irregularNames = blocksWithNonPositiveDuration
    .map(({ title }) => title)
    .join(", ")
  const hasIrregularDuration = blocksWithNonPositiveDuration.length > 0
  if (hasIrregularDuration)
    return {
      isValid: false,
      error: `Blocks ${irregularNames} have irregular duration`
    }
  
  const moreThanOneDynamic = blocks
    .filter(({ scheduling }) => scheduling.type === "dynamic")
    .length > 1
  if (moreThanOneDynamic)
    return {
      isValid: false,
      error: `Templates can have at most 1 dynamic block`
    }
  
  return { isValid: true }
}

export function makeImportTemplate(templateStore) {
  const ensureTemplateStore = di.ensure(templateStore, "templateStore")

  ensureTemplateStore.hasFunction("nextId")
  ensureTemplateStore.hasFunction("hasName")

  return async (templateJson) => {
    try {
      const createTemplateForm = JSON.parse(templateJson)
      const { isValid, error } = await validateTemplateForm(createTemplateForm, templateStore)
      
      if (!isValid)
        return Event("TEMPLATE_IMPORTING_FAILED", "v1")
        .addPayload({ error })
        .build()

      return Event("TEMPLATE_IMPORTED", "v1")
        .addPayload({ id: templateStore.nextId() })
        .addPayload({ name: createTemplateForm.name })
        .addPayload({ colorId: createTemplateForm.colorId })
        .addPayload({ blocks: createTemplateForm.blocks })
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

  return async (createTemplateForm) => {
    const { isValid, error } = await validateTemplateForm(createTemplateForm, templateStore)

    return !isValid
      ? Event("TEMPLATE_CREATION_FAILED", "v1")
          .addPayload({ error })
          .build()
      : Event("TEMPLATE_CREATED", "v1")
          .addPayload({ id: templateStore.nextId() })
          .addPayload({ name: createTemplateForm.name })
          .addPayload({ colorId: createTemplateForm.colorId })
          .addPayload({ blocks: createTemplateForm.blocks })
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
