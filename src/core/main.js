import { scaffold as scaffoldCreateTemplate } from "../slices/createTemplate/main"
import { scaffold as scaffoldScheduleEvent } from "../slices/scheduleEvent/main"

import { queues } from "./eventsourcing/broker";

export const useCases = {}
export const views = {}

export function scaffold(templateStore, brokerStore, previewStore, googleClient) {
  queues.setStore(brokerStore)

  scaffoldCreateTemplate({ templateStore, googleClient })
  scaffoldScheduleEvent({ templateStore, previewStore })
}
