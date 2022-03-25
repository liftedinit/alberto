export type AccountId = number
export type Identity = { publicKey: Uint8Array; privateKey: Uint8Array } | null

export interface Account {
  keys?: { publicKey: Uint8Array; privateKey: Uint8Array }
  name: string
}

export interface AccountsState {
  activeId: AccountId
  byId: Map<AccountId, Account>
  nextId: AccountId
}
