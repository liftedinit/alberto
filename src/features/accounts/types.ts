import {
  WebAuthnIdentity,
  Ed25519KeyPairIdentity,
  AnonymousIdentity,
  AccountRole,
  LedgerTransactionType,
} from "many-js"

export type AccountId = number
export interface Account {
  name: string
  address: string
  identity: WebAuthnIdentity | Ed25519KeyPairIdentity | AnonymousIdentity
}

export interface AccountsState {
  activeId: AccountId
  byId: Map<AccountId, Account>
  nextId: AccountId
}

export type Credential = {
  base64Id: string
  address: string
}

export enum RecoverOptions {
  "phrase" = "phrase",
  "address" = "address",
}

export type CredentialData = {
  base64CredentialId: string
  cosePublicKey: ArrayBuffer
}

export const submitterRoles = [
  AccountRole[AccountRole.canLedgerTransact],
  AccountRole[AccountRole.canMultisigSubmit],
  AccountRole[AccountRole.owner],
]

export const approverRoles = [
  AccountRole[AccountRole.canMultisigApprove],
  AccountRole[AccountRole.canMultisigSubmit],
  AccountRole[AccountRole.owner],
]

export const multisigTxnTypes = [
  LedgerTransactionType.accountMultisigApprove,
  LedgerTransactionType.accountMultisigSubmit,
  LedgerTransactionType.accountMultisigExecute,
  LedgerTransactionType.accountMultisigRevoke,
  LedgerTransactionType.accountMultisigWithdraw,
]
