import {
  Event,
  EventType,
  MultisigSubmitEvent,
  SendEvent,
} from "@liftedinit/many-js"
import { SendMigrationListItem } from "./send-migration-list-item"
import { MultisigSubmitMigrationListItem } from "./multisig-submit-migration-list-item"

export function MigrationListItem({
  transaction,
}: Readonly<{ transaction: Event }>) {
  const type = transaction.type
  if (type === EventType.send) {
    return <SendMigrationListItem event={transaction as SendEvent} />
  } else if (type === EventType.accountMultisigSubmit) {
    return (
      <MultisigSubmitMigrationListItem
        event={transaction as MultisigSubmitEvent}
      />
    )
  }

  console.error("migration list item not implemented", type, transaction)

  return null
}
