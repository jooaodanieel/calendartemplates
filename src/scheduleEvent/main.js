import { command, reactTo } from "@/eventsourcing/broker"
import { makeApplyTemplateTo, makeConfirmPreview, makePreview, makeUpdatePreviewAggregate } from "./core/event"
import { makeAvailableTemplates } from "./core/template"

export const useCases = {}
export const views = {}

export function scaffold({ templateStore, previewStore }) {
  reactTo("TEMPLATE_APPLIED", "PREVIEW_CONFIRMED")
    .with(makeUpdatePreviewAggregate(previewStore))

  useCases["applyTemplateTo"] = command(makeApplyTemplateTo())
  useCases["confirmPreview"] = command(makeConfirmPreview(previewStore))

  views["availableTemplates"] = makeAvailableTemplates(templateStore)
  views["preview"] = makePreview(previewStore)
}