import { makeCreateTemplate, makeAvailableTemplates, makeUpdateTemplateAggregate } from "./domain/template";
import { command, reactTo } from "./eventsourcing/broker";

export const useCases = {}
export const views = {}

export function scaffold(templateStore) {
  useCases["createTemplate"] = command(makeCreateTemplate(templateStore))
  views["availableTemplates"] = makeAvailableTemplates(templateStore)

  reactTo("TEMPLATE_CREATED")
    .with(makeUpdateTemplateAggregate(templateStore))
}
