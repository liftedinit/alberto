import { LedgerTransactionType, SendTransaction } from "many-js"
import type { Transaction, CreateAccountTransaction } from "many-js"
import { multisigTxnTypes } from "features/accounts"
import { MultisigTransaction } from "many-js/dist/network/modules/ledger/ledger"
import { MultisigTxnListItem } from "./multisig-txn-list-item"
import { CreateAccountTxnListItem } from "./create-account-txn-list-item"
import { SendTxnListItem } from "./send-txn-list-item"

export function TxnListItem({
  transaction,
  address,
}: {
  transaction: Transaction
  address: string
}) {
  const txnTypeName = transaction.type as LedgerTransactionType
  if (txnTypeName === LedgerTransactionType.send) {
    return (
      <SendTxnListItem txn={transaction as SendTransaction} address={address} />
    )
  } else if (txnTypeName === LedgerTransactionType.accountCreate) {
    return (
      <CreateAccountTxnListItem
        txnData={transaction as CreateAccountTransaction}
      />
    )
  } else if (isMultisigTxnType(transaction.type)) {
    return <MultisigTxnListItem txn={transaction as MultisigTransaction} />
  }
  console.error("txn list item not implemented:", transaction.type)
  return null
}

function isMultisigTxnType(type: LedgerTransactionType) {
  return multisigTxnTypes.some(t => t === type)
}
