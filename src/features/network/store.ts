import create from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { replacer, reviver } from "helper/json";
import { NetworkId, NetworkParams, NetworksState } from "./types"

const initialState = {
  activeId: 0,
  nextId: 1,
  byId: new Map([[0, { name: "Manifest", url: "/api" }]]),
}

interface NetworkActions {
  createNetwork: (n: NetworkParams) => void
  setActiveId: (id: NetworkId) => void
  updateNetwork: (id: NetworkId, n: NetworkParams) => void
  deleteNetwork: (id: NetworkId) => void
}

export const useNetworkStore = create<NetworksState & NetworkActions>(
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
      deleteNetwork: (id: NetworkId) =>
        // @ts-ignore
        set(state => {
          const byId = new Map(state.byId)
          byId.delete(id)
          return {
            ...state,
            activeId: state.activeId === id ? undefined : state.activeId,
            byId,
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
