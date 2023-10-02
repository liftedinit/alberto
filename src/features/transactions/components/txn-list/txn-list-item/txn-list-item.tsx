import {
  EventType,
  Event,
  CreateAccountEvent,
  MultisigEvent,
  SendEvent,
  AddFeaturesEvent,
  SetDescriptionEvent,
  AddRolesEvent,
  RemoveRolesEvent,
  MintEvent,
  TokenCreateEvent,
} from "@liftedinit/many-js"
import { multisigTxnTypes } from "features/accounts"
import { MultisigTxnListItem } from "./multisig-txn-list-item"
import { CreateAccountTxnListItem } from "./create-account-txn-list-item"
import { SendTxnListItem } from "./send-txn-list-item"
import { AddFeaturesTxnListItem } from "./add-features-txn-list-item"
import { SetDescriptionTxnListItem } from "./set-description-txn-list-item"
import { EditRolesTxnListItem } from "./edit-roles-txn-list-item"
import { MintBurnTxnListItem } from "./mint-burn-txn-list-item"
import { TokenCreateTxnListItem } from "./token-create-txn-list-item"

type EditRolesEvent = AddRolesEvent | RemoveRolesEvent

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
    return <CreateAccountTxnListItem txn={transaction as CreateAccountEvent} />
  } else if (txnTypeName === EventType.accountAddFeatures) {
    return <AddFeaturesTxnListItem txn={transaction as AddFeaturesEvent} />
  } else if (txnTypeName === EventType.accountSetDescription) {
    return (
      <SetDescriptionTxnListItem txn={transaction as SetDescriptionEvent} />
    )
  } else if (
    txnTypeName === EventType.accountAddRoles ||
    txnTypeName === EventType.accountRemoveRoles
  ) {
    return <EditRolesTxnListItem txn={transaction as EditRolesEvent} />
  } else if (txnTypeName === EventType.mint || txnTypeName === EventType.burn) {
    return (
      <MintBurnTxnListItem txn={transaction as MintEvent} address={address} />
    )
  } else if (isMultisigTxnType(transaction.type)) {
    return <MultisigTxnListItem txn={transaction as MultisigEvent} />
  } else if (txnTypeName === EventType.tokenCreate) {
    return (
      <TokenCreateTxnListItem
        address={address}
        txn={transaction as TokenCreateEvent}
      />
    )
  }

  console.error("txn list item not implemented:", transaction.type, transaction)
  return null
}

function isMultisigTxnType(type: EventType) {
  return multisigTxnTypes.some(t => t === type)
}
