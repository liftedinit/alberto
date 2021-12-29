import { Action } from "../store";
import { ServerId } from "./servers";

type SymbolId = string;

type Amount = bigint;

export type Balances = { [index: SymbolId]: Amount };

export interface BalancesState {
  byServer: Map<ServerId, Balances>;
  bySymbol: Map<SymbolId, Amount>;
  symbols: Set<SymbolId>;
}

export const initialBalancesState = {
  byServer: new Map<ServerId, Balances>(),
  bySymbol: new Map<SymbolId, Amount>(),
  symbols: new Set<SymbolId>(),
};

type BalancesPayload = {
  serverId: ServerId;
  balances: Balances;
};

export const balancesReducer = (
  state: BalancesState,
  { type, payload }: Action
) => {
  switch (type) {
    case "BALANCES.UPDATE": {
      const { serverId, balances }: BalancesPayload = payload;
      const byServer = new Map(state.byServer);
      byServer.set(serverId, balances);

      const symbolObj = Array.from(state.symbols.values()).reduce(
        (balances: Balances, symbol: SymbolId) => {
          const total = Array.from(byServer.values())
            .map((balance) => balance[symbol] || BigInt(0))
            .reduce((total, amount) => total + amount, BigInt(0));
          return { ...balances, [symbol]: total };
        },
        {}
      );
      const bySymbol = new Map(Object.entries(symbolObj));
      return { ...state, byServer, bySymbol };
    }
    case "BALANCES.SYMBOLS": {
      const symbols = new Set(state.symbols);
      payload.forEach((symbol: SymbolId) => symbols.add(symbol));
      return { ...state, symbols };
    }
    default:
      return state;
  }
};
