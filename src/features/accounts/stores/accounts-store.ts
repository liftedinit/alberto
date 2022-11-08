import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import {
  AnonymousIdentity,
  ANON_IDENTITY,
  Ed25519KeyPairIdentity,
} from "@liftedinit/many-js"
import { replacer, reviver } from "shared/helpers"
import { Account, AccountId, AccountsState } from "../types"

interface AccountMethods {
  createAccount: (a: Partial<Account>) => Promise<void>
  deleteAccount: (id: AccountId) => void
  updateAccount: (id: AccountId, a: Partial<Account>) => void
  setActiveId: (id: AccountId) => void
}

const initialState: AccountsState = {
  activeId: 0,
  byId: new Map([
    [
      0,
      {
        name: "Anonymous",
        identity: new AnonymousIdentity(),
        address: ANON_IDENTITY,
      },
    ],
  ]),
  nextId: 1,
}

export const useAccountsStore = create<AccountsState & AccountMethods>(
  persist(
    set => ({
      ...initialState,
      createAccount: async (account: Partial<Account>) => {
        try {
          if (account?.identity) {
            const address = (await account.identity.getAddress()).toString()
            account.address = address
          }
        } catch (error) {
          console.error("createAccount error getting address", error)
        }
        set(state => {
          const id = state.nextId
          return {
            nextId: id + 1,
            activeId: id,
            byId: new Map(state.byId).set(id, account as Account),
          }
        })
      },
      updateAccount: (id: AccountId, account: Partial<Account>) =>
        set(s => ({
          byId: new Map(s.byId).set(id, {
            ...s.byId.get(id),
            ...account,
          } as Account),
        })),
      deleteAccount: (id: AccountId) =>
        set(s => {
          s.byId.delete(id)
          return {
            activeId: s.activeId === id ? 0 : s.activeId,
            byId: s.byId,
          }
        }),
      setActiveId: (id: AccountId) =>
        set({
          activeId: id,
        }),
    }),
    {
      name: "ALBERTO.IDENTITIES",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state =>
        JSON.stringify(removeEd25519KeyPairIdentities(state), replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)

// @ts-ignore
function removeEd25519KeyPairIdentities(state) {
  const byId = new Map(state.state.byId)
  for (let k of byId.keys()) {
    let acct = byId.get(k)
    //@ts-ignore
    const identity = acct?.identity
    if (identity instanceof Ed25519KeyPairIdentity) {
      byId.delete(k)
    }
  }
  if (!byId.has(state.state.activeId)) {
    state.state.activeId = 0
  }
  state.state.byId = byId
  return state
}
