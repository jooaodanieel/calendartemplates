import { makeCreateTemplate, makeAvailableTemplates, makeUpdateTemplateAggregate, makeExportableTemplates, makeDeleteTemplate } from "./domain/template";
import { command, reactTo } from "./eventsourcing/broker";

export const useCases = {}
export const views = {}

export function scaffold(templateStore) {
  useCases["createTemplate"] = command(makeCreateTemplate(templateStore))
  useCases["deleteTemplate"] = command(makeDeleteTemplate(templateStore))

  views["availableTemplates"] = makeAvailableTemplates(templateStore)
  views["exportableTemplates"] = makeExportableTemplates(templateStore)

  reactTo("TEMPLATE_CREATED", "TEMPLATE_DELETED")
    .with(makeUpdateTemplateAggregate(templateStore))
}
