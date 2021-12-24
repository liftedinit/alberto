import React, { createContext, useReducer, Dispatch } from "react";
import { accountsReducer, initialAccounts, AccountsState } from "./accounts";
import { serversReducer, initialServers, ServersState } from "./servers";

export interface Action {
  type: string;
  payload?: {};
}

interface State {
  accounts: AccountsState;
  servers: ServersState;
}

const initialState = {
  accounts: initialAccounts,
  servers: initialServers,
};

const rootReducer = (state: State, action: Action) => {
  return {
    accounts: accountsReducer(state.accounts, action),
    servers: serversReducer(state.servers, action),
  };
};

export const StoreContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

interface StoreProviderProps {
  children?: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}
