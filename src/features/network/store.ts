import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";
import { NetworkId, NetworkParams, NetworksState } from "./types"

const initialState = {
  activeId: 0,
  nextId: 1,
  byId: new Map([[0, { name: "Localhost", url: "/api" }]]),
}

interface NetworkMutations {
  createNetwork: (n: NetworkParams) => void
  setActiveId: (id: NetworkId) => void
  updateNetwork: (id: NetworkId, n: NetworkParams) => void
}

export const useNetworkStore = create<NetworksState & NetworkMutations>(
  persist(
    set => ({
      ...initialState,
      createNetwork: (networkParams: NetworkParams) =>
        set(state => {
          const id = state.nextId
          return {
            nextId: id + 1,
            activeId: id,
            byId: new Map(state.byId).set(id, networkParams),
          }
        }),
      updateNetwork: (id: NetworkId, networkParams: NetworkParams) =>
        set(state => {
          const newById = new Map(state.byId)
          newById.set(id, networkParams)
          return {
            ...state,
            byId: newById,
          }
        }),
      setActiveId: (id: NetworkId) =>
        set(state => {
          return {
            ...state,
            activeId: id,
          }
        }),
    }),
    {
      name: "ALBERT.NETWORK",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)
