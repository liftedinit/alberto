import { SendEvent } from "@liftedinit/many-js"
import { BaseMigrationListItem } from "./base-migration-list-item"
import { SendOutlineIcon } from "@liftedinit/ui"
import { useLedgerInfo } from "../../../../network"

export function SendMigrationListItem({
  event,
}: Readonly<{ event: SendEvent }>) {
  if (event.memo && event.memo.length !== 2) {
    throw new Error("Invalid Send migration list item")
  }
  const { data } = useLedgerInfo({})
  const symbols = data!.symbols
  const uuid =
    event.memo && typeof event.memo[0] === "string" ? event.memo[0] : ""
  const destination =
    event.memo && typeof event.memo[1] === "string" ? event.memo[1] : ""
  return (
    <BaseMigrationListItem
      icon={<SendOutlineIcon />}
      type={event.type}
      time={event.time}
      from={event.from}
      to={destination}
      amount={event.amount}
      symbol={symbols.get(event.symbolAddress)}
      uuid={uuid}
    />
  )
}
