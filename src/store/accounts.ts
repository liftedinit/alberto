import { Action } from "../store";

export interface Account {
  name: string;
  identity: { publicKey: Uint8Array; privateKey: Uint8Array } | null;
}

export type AccountsState = Account[];

export const initialAccounts = [{ name: "Anonymous", identity: null }];

export const accountsReducer = (
  state: AccountsState,
  { type, payload }: Action
) => {
  switch (type) {
    case "ACCOUNTS.CREATE":
      return payload ? [...state, payload as Account] : state;
    default:
      return state;
  }
};
