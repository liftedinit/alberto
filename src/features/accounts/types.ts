import { Identity, KeyPair } from "many-js"

export type AccountId = number
export interface Account {
  keys?: KeyPair | { publicKey: Uint8Array; privateKey: Uint8Array }
  name: string
  identity?: Identity
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
