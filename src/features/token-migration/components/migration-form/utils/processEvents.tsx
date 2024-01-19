import { Event, EventType } from "@liftedinit/many-js"
import { bufferToNumber } from "./bufferToNumber"

// Extract block height and event number from the event ID
const extractEventDetails = (eventId: ArrayBuffer) => {
  const bufferLength = eventId.byteLength
  if (bufferLength < 4) {
    throw new Error("Event ID buffer length too short!")
  }
  const eventHeightBuf = eventId.slice(0, bufferLength - 4)
  const eventNumberBuf = eventId.slice(bufferLength - 4)

  const blockHeight = bufferToNumber(new Uint8Array(eventHeightBuf)) + 2
  let eventNumber = bufferToNumber(new Uint8Array(eventNumberBuf))

  return { blockHeight, eventNumber }
}

// Find the event with the matching memo and destination address
// Return the block height and event number of the event with the matching memo and destination address
// Throw an error if the event is not found
export const processEvents = (
  events: Event[],
  memo: string,
  destinationAddress: string,
) => {
  const event = events.find((e: Event) => {
    return (
      (e.type === EventType.send ||
        e.type === EventType.accountMultisigSubmit) &&
      "memo" in e &&
      e.memo?.[0] === memo &&
      e.memo?.[1] === destinationAddress
    )
  })

  if (!event) {
    throw new Error("Transaction event not found!")
  }

  let { blockHeight, eventNumber } = extractEventDetails(event.id)

  if (event.type === EventType.accountMultisigSubmit) {
    eventNumber = eventNumber - 1
  }

  return { blockHeight, eventNumber }
}
