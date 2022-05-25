import create from "zustand"
import { Account, AccountId, AccountsState } from "../types"
import { AnonymousIdentity } from "many-js"

interface AccountMethods {
  createAccount: (a: Account) => void
  deleteAccount: (id: AccountId) => void
  updateAccount: (id: AccountId, a: Account) => void
  setActiveId: (id: AccountId) => void
}

export const initialState: AccountsState = {
  activeId: 0,
  byId: new Map([
    [0, { name: "Anonymous", identity: new AnonymousIdentity() }],
  ]),
  nextId: 1,
}

export const useAccountsStore = create<AccountsState & AccountMethods>(set => ({
  ...initialState,
  createAccount: async (account: Account) => {
    try {
      const address = (await account.identity.getAddress()).toString()
      account.address = address
    } catch (error) {
      console.error("createAccount", error)
    }
    set(state => {
      const id = state.nextId
      return {
        nextId: id + 1,
        activeId: id,
        byId: new Map(state.byId).set(id, account),
      }
    })
  },
  updateAccount: (id: AccountId, account: Account) =>
    set(s => ({
      byId: new Map(s.byId).set(id, { ...s.byId.get(id), ...account }),
    })),
  deleteAccount: (id: AccountId) =>
    set(s => {
      s.byId.delete(id)
      return {
        byId: s.byId,
      }
    }),
  setActiveId: (id: AccountId) =>
    set({
      activeId: id,
    }),
}))
