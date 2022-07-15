import {
  WebAuthnIdentity,
  Ed25519KeyPairIdentity,
  AnonymousIdentity,
  AccountRole,
  EventType,
  AccountFeatureTypes,
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

export const accountMultisigFeature =
  AccountFeatureTypes[AccountFeatureTypes.accountMultisig]
export const accountLedgerFeature =
  AccountFeatureTypes[AccountFeatureTypes.accountLedger]

export const approverRoles = [
  AccountRole[AccountRole.canMultisigApprove],
  AccountRole[AccountRole.canMultisigSubmit],
  AccountRole[AccountRole.owner],
]

export const multisigTxnTypes = [
  EventType.accountMultisigApprove,
  EventType.accountMultisigSubmit,
  EventType.accountMultisigExecute,
  EventType.accountMultisigRevoke,
  EventType.accountMultisigWithdraw,
  EventType.accountMultisigSetDefaults,
]
