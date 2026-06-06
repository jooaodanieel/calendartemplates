import { command, reactTo } from "../../core/eventsourcing/broker";
import { makeListTaskLists } from "./core/task";
import { makeCreateTemplate, makeDeleteTemplate, makeExportableTemplates, makeImportTemplate, makeUpdateTemplateAggregate } from "./core/template";

export const useCases = {}
export const views = {}

export function scaffold({ templateStore, googleClient }) {
  reactTo("TEMPLATE_CREATED", "TEMPLATE_DELETED", "TEMPLATED_IMPORTED")
    .with(makeUpdateTemplateAggregate(templateStore))
  
  useCases["createTemplate"] = command(makeCreateTemplate(templateStore))
  useCases["importTemplate"] = command(makeImportTemplate(templateStore))
  useCases["deleteTemplate"] = command(makeDeleteTemplate(templateStore))

  views["exportableTemplates"] = makeExportableTemplates(templateStore)
  views["listTaskLists"] = makeListTaskLists(googleClient)
}