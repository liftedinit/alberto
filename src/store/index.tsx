import React, { createContext, useReducer, Dispatch } from "react";
import {
  accountsReducer,
  initialAccountsState,
  AccountsState,
} from "./accounts";
import { serversReducer, initialServersState, ServersState } from "./servers";
import {
  balancesReducer,
  initialBalancesState,
  BalancesState,
} from "./balances";

import { transactionReducer, initialTransactionState, TransactionState} from "./transactions";

export interface Action {
  type: string;
  payload?: any;
}

interface State {
  accounts: AccountsState;
  balances: BalancesState;
  servers: ServersState;
  transactions: TransactionState;
}

const initialState = {
  accounts: initialAccountsState,
  balances: initialBalancesState,
  servers: initialServersState,
  transactions: initialTransactionState,
};

const rootReducer = (state: State, action: Action) => {
  console.log("[ACTION]", action);
  const newState = {
    accounts: accountsReducer(state.accounts, action),
    balances: balancesReducer(state.balances, action),
    servers: serversReducer(state.servers, action),
    transactions: transactionReducer(state.transactions, action),
  };
  console.log("[STATE]", newState);
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
