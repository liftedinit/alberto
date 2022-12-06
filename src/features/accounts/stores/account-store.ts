import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "@liftedinit/ui"

interface Actions {
  update: (address: string, a: Record<string, unknown>) => void
  delete: (address: string) => void
}

const initialState: { byId: Map<string, Record<string, unknown>> } = {
  byId: new Map(),
}

export const useAccountStore = create<
  { byId: Map<string, Record<string, unknown>> } & Actions
>(
  persist(
    set => ({
      ...initialState,
      update: (address: string, account: Record<string, unknown>) =>
        set(s => ({
          byId: new Map(s.byId).set(address, {
            ...s.byId.get(address),
            ...account,
          }),
        })),
      delete: (address: string) => {
        set(s => {
          const byId = new Map(s.byId)
          byId.delete(address)
          return {
            byId,
          }
        })
      },
    }),
    {
      name: "ALBERTO.ACCOUNTS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)
