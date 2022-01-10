import { Action } from "../store";

export type AccountId = number;
export type Identity = { publicKey: Uint8Array; privateKey: Uint8Array } | null;

export interface Account {
  identity: { publicKey: Uint8Array; privateKey: Uint8Array } | null;
  name: string;
}

export interface AccountsState {
  activeIds: Set<AccountId>;
  byId: Map<AccountId, Account>;
  nextId: AccountId;
}

export const initialAccountsState = {
  activeIds: new Set([0]),
  byId: new Map([[0, { name: "Anonymous", identity: null }]]),
  nextId: 1,
};

export const accountsReducer = (
  state: AccountsState,
  { type, payload }: Action
) => {
  switch (type) {
    case "ACCOUNTS.CREATE": {
      const id = state.nextId;

      const byId = new Map(state.byId);
      byId.set(id, payload as Account);

      const activeIds = new Set(state.activeIds);
      activeIds.add(id);

      return { ...state, byId, activeIds, nextId: id + 1 };
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
