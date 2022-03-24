import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";
import { Account, AccountsState } from "./types"

interface AccountMethods {
  createAccount: (a: Account) => void
}

export const initialState: AccountsState = {
  activeId: 0,
  byId: new Map([[0, { name: "Anonymous" }]]),
  nextId: 1,
}

export const useAccountsStore = create<AccountsState & AccountMethods>(
  persist(
    set => ({
      ...initialState,
      createAccount: (account: Account) =>
        set(state => {
          const id = state.nextId
          return {
            nextId: id + 1,
            activeId: id,
            byId: new Map(state.byId).set(id, account),
          }
        }),
    }),
    {
      name: "ALBERT.ACCOUNT",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)
