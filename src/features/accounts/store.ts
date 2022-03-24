import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";

export type AccountId = number;
export type Identity = { publicKey: Uint8Array; privateKey: Uint8Array } | null;

export interface Account {
  keys?: { publicKey: Uint8Array; privateKey: Uint8Array };
  name: string;
}

export interface AccountsState {
  activeId: AccountId;
  byId: Map<AccountId, Account>;
  nextId: AccountId;
}

export const initialState = {
  activeId: 0,
  byId: new Map([[0, { name: "Anonymous" }]]),
  nextId: 1,
};

export const useAccountsStore = create<AccountsState>(
  persist(
    (set) => ({
      ...initialState,
      createAccount: (account: Account) =>
        set((state) => {
          const id = state.nextId;
          return {
            nextId: id + 1,
            activeId: id,
            byId: new Map(state.byId).set(id, account),
          };
        }),
    }),
    {
      name: "ALBERT.ACCOUNT",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: (state) => JSON.stringify(state, replacer),
      deserialize: (str) => JSON.parse(str, reviver),
    }
  )
);
