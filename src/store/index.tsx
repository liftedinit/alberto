import React, { createContext, useReducer, Dispatch } from "react";

import {
  accountsReducer,
  initialAccountsState,
  AccountsState,
} from "./accounts";
import {
  networksReducer,
  initialNetworksState,
  NetworksState,
} from "./networks";
import {
  balancesReducer,
  initialBalancesState,
  BalancesState,
} from "./balances";
import {
  transactionReducer,
  initialTransactionState,
  TransactionState,
} from "./transactions";
import {
  receiversReducer,
  initialReceiversState,
  ReceiversState,
} from "./receivers";

export interface Action {
  type: string;
  payload?: any;
}

interface State {
  accounts: AccountsState;
  balances: BalancesState;
  networks: NetworksState;
  transactions: TransactionState;
  receivers: ReceiversState;
}

const initialState = {
  accounts: initialAccountsState,
  balances: initialBalancesState,
  networks: initialNetworksState,
  transactions: initialTransactionState,
  receivers: initialReceiversState,
};

const rootReducer = (state: State, action: Action) => {
  console.log("[ACTION]", action);
  switch (action.type) {
    case "APP.RESTORE":
      console.log("[RESTORE]", action.payload);
      return { ...action.payload };
    default: {
      const newState = {
        accounts: accountsReducer(state.accounts, action),
        balances: balancesReducer(state.balances, action),
        networks: networksReducer(state.networks, action),
        transactions: transactionReducer(state.transactions, action),
        receivers: receiversReducer(state.receivers, action),
      };
      console.log("[STATE]", newState);
      return newState;
    }
  }
};

export const StoreContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
  // @ts-ignore
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
