import {
  EventType,
  Event,
  CreateAccountEvent,
  MultisigEvent,
  SendEvent,
} from "many-js"
import { multisigTxnTypes } from "features/accounts"
import { MultisigTxnListItem } from "./multisig-txn-list-item"
import { CreateAccountTxnListItem } from "./create-account-txn-list-item"
import { SendTxnListItem } from "./send-txn-list-item"

export function TxnListItem({
  transaction,
  address,
}: {
  transaction: Event
  address: string
}) {
  const txnTypeName = transaction.type as EventType
  if (txnTypeName === EventType.send) {
    return <SendTxnListItem txn={transaction as SendEvent} address={address} />
  } else if (txnTypeName === EventType.accountCreate) {
    return (
      <CreateAccountTxnListItem txnData={transaction as CreateAccountEvent} />
    )
  } else if (isMultisigTxnType(transaction.type)) {
    return <MultisigTxnListItem txn={transaction as MultisigEvent} />
  }
  console.error("txn list item not implemented:", transaction.type)
  return null
}

function isMultisigTxnType(type: EventType) {
  return multisigTxnTypes.some(t => t === type)
}
