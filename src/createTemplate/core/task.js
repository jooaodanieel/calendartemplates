import { ensure } from "../../eventsourcing/dependencyInjection"

export function makeListTaskLists(googleClient) {
  ensure(googleClient, "googleClient")
    .hasFunction("fetchTaskLists")
  
  return async () => {
    return await googleClient.fetchTaskLists()
  }
} 