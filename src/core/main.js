import { makeCreateTemplate, makeUpdateTemplateAggregate } from "./domain/template";
import { command, reactTo } from "./eventsourcing/broker";

export const useCases = {}

export function scaffold(templateStore) {
  useCases["createTemplate"] = command(makeCreateTemplate(templateStore))

  reactTo("TEMPLATE_CREATED")
    .with(makeUpdateTemplateAggregate(templateStore))
}
