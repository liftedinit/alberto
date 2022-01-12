import { Action } from "../store";

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

export const initialAccountsState = {
  activeId: 0,
  byId: new Map([[0, { name: "Anonymous" }]]),
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
      return { ...state, byId, activeId: id, nextId: id + 1 };
    }
    case "ACCOUNTS.TOGGLE":
      return { ...state, activeId: payload };
    default:
      return state;
  }
};
