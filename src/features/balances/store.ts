import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";
import { NetworkId } from "features/network";
import { Amount, Balances, SymbolId } from "./types";

interface BalancesState {
  byNetwork: Map<NetworkId, Balances>;
  bySymbol: Map<SymbolId, Amount>;
  symbols: Set<SymbolId>;
}

const initialState = {
  byNetwork: new Map<NetworkId, Balances>(),
  bySymbol: new Map<SymbolId, Amount>(),
  symbols: new Set<SymbolId>(),
};

type BalancesPayload = {
  networkId: NetworkId;
  balances: Balances;
};

export const useBalancesStore = create<BalancesState>(
  // persist(
  set => ({
    ...initialState,
    updateBalances: (payload: BalancesPayload) =>
      set(state => {
        const { networkId, balances } = payload
        const byNetwork = new Map(state.byNetwork)
        byNetwork.set(networkId, balances)
        const symbolObj = Array.from(state.symbols.values()).reduce(
          (balances: Balances, symbol: SymbolId) => {
            const total = Array.from(byNetwork.values())
              .map(balance => balance[symbol] || BigInt(0))
              .reduce((total, amount) => total + amount, BigInt(0))
            return { ...balances, [symbol]: total }
          },
          {},
        )
        const bySymbol = new Map(Object.entries(symbolObj))
        return {
          ...state,
          byNetwork,
          bySymbol,
        }
      }),
    updateSymbols: (payload: Set<SymbolId>) =>
      set(state => ({
        ...state,
        symbols: payload,
      })),
  }),
  //   {
  //     name: "ALBERT.BALANCES",
  //     // @ts-ignore
  //     getStorage: () => localforage,
  //     serialize: (state) => JSON.stringify(state, replacer),
  //     deserialize: (str) => JSON.parse(str, reviver),
  //   }
  // )
)
