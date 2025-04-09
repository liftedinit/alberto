import {
  Event,
  EventType,
  MultisigSubmitEvent,
  SendEvent,
} from "@liftedinit/many-js"
import validator from "validator"
import { DestinationAddressRegex } from "./destination-address"

export type ValidMigrationEventType = SendEvent | MultisigSubmitEvent

export const validateEventType = (e: Event) => {
  return e.type === EventType.send || e.type === EventType.accountMultisigSubmit
}

export const validateMemoType = (e: Event) => {
  return (
    "memo" in e &&
    e.memo?.length === 2 &&
    typeof e.memo[0] === "string" &&
    validator.isUUID(e.memo[0]) &&
    typeof e.memo[1] === "string" &&
    DestinationAddressRegex.test(e.memo[1])
  )
}

const validateMemo = (e: SendEvent | MultisigSubmitEvent, memo: string) => {
  return e.memo?.[0] === memo
}

const validateDestinationAddress = (
  e: SendEvent | MultisigSubmitEvent,
  destinationAddress: string,
) => {
  return e.memo?.[1] === destinationAddress
}

const validateFrom = (e: Event, from: string) => {
  if (e.type === EventType.send) {
    const se = e as SendEvent
    return se.from === from
  } else if (e.type === EventType.accountMultisigSubmit) {
    const ams = e as MultisigSubmitEvent
    if (ams.transaction?.type === EventType.send) {
      const se = ams.transaction as SendEvent
      return se.from === from
    }
  }
  return false
}

const validateTo = (e: Event, to: string) => {
  if (e.type === EventType.send) {
    const se = e as SendEvent
    return se.to === to
  } else if (e.type === EventType.accountMultisigSubmit) {
    const ams = e as MultisigSubmitEvent
    if (ams.transaction?.type === EventType.send) {
      const se = ams.transaction as SendEvent
      return se.to === to
    }
  }
  return false
}

const isMatchingEvent = (e: Event, p?: { [key: string]: any }) => {
  let result = true

  result = result && validateEventType(e)
  result = result && validateMemoType(e as ValidMigrationEventType)
  result =
    result && p && "memo" in p
      ? validateMemo(e as ValidMigrationEventType, p.memo)
      : result
  result =
    result && p && "destinationAddress" in p
      ? validateDestinationAddress(
          e as ValidMigrationEventType,
          p.destinationAddress,
        )
      : result
  result = result && p && "from" in p ? validateFrom(e, p.from) : result
  result = result && p && "to" in p ? validateTo(e, p.to) : result

  return result
}

export function createIsMatchingEvent(p: { [key: string]: any } = {}) {
  return function (e: Event) {
    return isMatchingEvent(e, p)
  }
}
