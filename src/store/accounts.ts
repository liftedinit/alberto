import { Action } from "../store";

export interface Account {
  name: string;
  identity: { publicKey: Uint8Array; privateKey: Uint8Array } | null;
}

export interface AccountsState {
  accounts: Map<number, Account>;
  activeIds: Set<number>;
  nextId: number;
}

export const initialAccountsState = {
  accounts: new Map([[0, { name: "Anonymous", identity: null }]]),
  activeIds: new Set([0]),
  nextId: 1,
};

export const accountsReducer = (
  state: AccountsState,
  { type, payload }: Action
) => {
  switch (type) {
    case "ACCOUNTS.CREATE": {
      const id = state.nextId;
      const accounts = new Map(state.accounts);
      accounts.set(id, payload as Account);
      const activeIds = new Set(state.activeIds);
      activeIds.add(id);
      return { ...state, accounts, activeIds, nextId: id + 1 };
    }
    case "ACCOUNTS.TOGGLE": {
      const activeIds = new Set(state.activeIds);
      if (activeIds.has(payload)) {
        activeIds.delete(payload);
      } else {
        activeIds.add(payload);
      }
      return { ...state, activeIds };
    }
    default:
      return state;
  }
};
