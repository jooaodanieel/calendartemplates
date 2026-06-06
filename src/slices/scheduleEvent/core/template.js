import { ensure } from "../../../core/eventsourcing/dependencyInjection"

export function makeAvailableTemplates(templateStore) {
  ensure(templateStore, "templateStore")
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