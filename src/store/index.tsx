import React, { createContext, useReducer, Dispatch } from "react";
import {
  accountsReducer,
  initialAccountsState,
  AccountsState,
} from "./accounts";
import { serversReducer, initialServersState, ServersState } from "./servers";

export interface Action {
  type: string;
  payload?: any;
}

interface State {
  accounts: AccountsState;
  servers: ServersState;
}

const initialState = {
  accounts: initialAccountsState,
  servers: initialServersState,
};

const rootReducer = (state: State, action: Action) => {
  console.log(action);
  const newState = {
    accounts: accountsReducer(state.accounts, action),
    servers: serversReducer(state.servers, action),
  };
  console.log(newState);
  return newState;
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
