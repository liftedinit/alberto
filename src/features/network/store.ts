import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";
import { NetworkParams, NetworksState } from "./types";

const initialState = {
  activeId: 0,
  nextId: 1,
  byId: new Map([[0, { name: "Localhost", url: "/api" }]]),
};

export const useNetworkStore = create<NetworksState>(
  persist(
    (set) => ({
      ...initialState,
      createNetwork: (networkParams: NetworkParams) =>
        set((state) => {
          const id = state.nextId;
          return {
            nextId: id + 1,
            activeId: id,
            byId: new Map(state.byId).set(id, networkParams),
          };
        }),
    }),
    {
      name: "ALBERT.NETWORK",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: (state) => JSON.stringify(state, replacer),
      deserialize: (str) => JSON.parse(str, reviver),
    }
  )
);
