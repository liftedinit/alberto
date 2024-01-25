import {
  Event,
  EventType,
  ILLEGAL_IDENTITY,
  MultisigSubmitEvent,
  SendEvent,
} from "@liftedinit/many-js"
import { bufferToNumber } from "./bufferToNumber"

// Extract block height and event number from the event ID
export const extractEventDetails = (
  eventId: ArrayBuffer,
  eventType: EventType,
) => {
  const bufferLength = eventId.byteLength
  if (bufferLength < 4) {
    throw new Error("Event ID buffer length too short!")
  }
  const eventHeightBuf = eventId.slice(0, bufferLength - 4)
  const eventNumberBuf = eventId.slice(bufferLength - 4)

  const blockHeight = bufferToNumber(new Uint8Array(eventHeightBuf)) + 2
  let eventNumber = bufferToNumber(new Uint8Array(eventNumberBuf))

  if (eventType === EventType.accountMultisigSubmit) {
    eventNumber = eventNumber - 1
  }

  return { blockHeight, eventNumber }
}

// Verify that the UUID matches the one in the event memo
// Verify that the other chain destination address matches the one in the event memo
// Verify the transaction destination address is the ILLEGAL address
const isMatchingEvent = (e: Event, p: { [key: string]: any }) => {
  if (
    (e.type === EventType.send || e.type === EventType.accountMultisigSubmit) &&
    "memo" in e &&
    e.memo?.[0] === p.memo &&
    e.memo?.[1] === p.destinationAddress
  ) {
    if (e.type === EventType.send) {
      const se = e as SendEvent
      return se.to === ILLEGAL_IDENTITY
    } else if (e.type === EventType.accountMultisigSubmit) {
      const ams = e as MultisigSubmitEvent
      if (ams.transaction?.type === EventType.send) {
        const se = ams.transaction as SendEvent
        return se.to === ILLEGAL_IDENTITY
      }
    }
  }
  return false
}

export function createIsMatchingEvent(p: { [key: string]: any }) {
  return function (e: Event) {
    return isMatchingEvent(e, p)
  }
}
