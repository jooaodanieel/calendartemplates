import { makeApplyTemplateTo, makePreview, makeUpdatePreviewAggregate } from "./domain/event";
import { makeCreateTemplate, makeAvailableTemplates, makeUpdateTemplateAggregate, makeExportableTemplates, makeDeleteTemplate, makeImportTemplate } from "./domain/template";
import { command, queues, reactTo } from "./eventsourcing/broker";

export const useCases = {}
export const views = {}

export function scaffold(templateStore, brokerStore, previewStore) {
  queues.setStore(brokerStore)

  useCases["createTemplate"] = command(makeCreateTemplate(templateStore))
  useCases["deleteTemplate"] = command(makeDeleteTemplate(templateStore))
  useCases["importTemplate"] = command(makeImportTemplate(templateStore))

  views["availableTemplates"] = makeAvailableTemplates(templateStore)
  views["exportableTemplates"] = makeExportableTemplates(templateStore)

  reactTo("TEMPLATE_CREATED", "TEMPLATE_DELETED", "TEMPLATE_IMPORTED")
    .with(makeUpdateTemplateAggregate(templateStore))
  
  
  useCases["applyTemplateTo"] = command(makeApplyTemplateTo())

  views["preview"] = makePreview(previewStore)

  reactTo("TEMPLATE_APPLIED")
    .with(makeUpdatePreviewAggregate(previewStore))
}
