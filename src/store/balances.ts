import { Action } from "../store";
import { NetworkId } from "./networks";

export type SymbolId = string;

export type Amount = bigint;

export type Balances = { [index: SymbolId]: Amount };

export interface BalancesState {
  byNetwork: Map<NetworkId, Balances>;
  bySymbol: Map<SymbolId, Amount>;
  symbols: Set<SymbolId>;
}

export const initialBalancesState = {
  byNetwork: new Map<NetworkId, Balances>(),
  bySymbol: new Map<SymbolId, Amount>(),
  symbols: new Set<SymbolId>(),
};

type BalancesPayload = {
  networkId: NetworkId;
  balances: Balances;
};

export const balancesReducer = (
  state: BalancesState,
  { type, payload }: Action
) => {
  switch (type) {
    case "BALANCES.UPDATE": {
      const { networkId, balances }: BalancesPayload = payload;
      const byNetwork = new Map(state.byNetwork);
      byNetwork.set(networkId, balances);

      const symbolObj = Array.from(state.symbols.values()).reduce(
        (balances: Balances, symbol: SymbolId) => {
          const total = Array.from(byNetwork.values())
            .map((balance) => balance[symbol] || BigInt(0))
            .reduce((total, amount) => total + amount, BigInt(0));
          return { ...balances, [symbol]: total };
        },
        {}
      );
      const bySymbol = new Map(Object.entries(symbolObj));
      return { ...state, byNetwork, bySymbol };
    }
    case "BALANCES.SYMBOLS":
      return { ...state, symbols: payload };
    default:
      return state;
  }
};
