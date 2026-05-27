import { Queues } from "./queues";

const queues = new Queues()

const broker = {
  publish: (event) => {
    queues.append(event)
  },
  
  subscribe: (subscriber, eventType) => {
    queues.registerCallback(subscriber, eventType)
  }
}

export function command(protoCommand) {
  return async (args) => {
    const event = await protoCommand(args);
    broker.publish(event)
  }
}

export function reactTo(...eventTypes) {
  return {
    with: (...protoHandlers) => {
      for (const eventType of eventTypes) {
        for (const protoHandler of protoHandlers) {
          broker.subscribe(protoHandler, eventType)
        }
      }
    }
  }
}