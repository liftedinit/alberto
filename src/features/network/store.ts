import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "shared"
import { NetworkId, NetworkParams, NetworksState } from "./types"

const devDomains = ["localhost", "liftedinit.tech"]

const initialState = {
  activeId: 0,
  nextId: 4,
  byId: new Map([
    [0, { name: "Manifest Ledger", url: "/api", filter: "alberto" }],
    [1, { name: "Dummy", url: "/dummy", filter: "dummy" }],
    [2, { name: "END Ledger", url: "/api-end", filter: "end-labs" }],
    [
      3,
      { name: "Legacy Manifest Ledger", url: "/api/legacy", filter: "legacy" },
    ], // Hidden from UI
  ]),
}

interface NetworkActions {
  getNetworks: () => NetworkParams[]
  getActiveNetwork: () => NetworkParams | undefined
  getLegacyNetworks: () => NetworkParams[]
  createNetwork: (n: NetworkParams) => void
  setActiveId: (id: NetworkId) => void
  updateNetwork: (id: NetworkId, n: NetworkParams) => void
  deleteNetwork: (id: NetworkId) => void
}

export const useNetworkStore = create<NetworksState & NetworkActions>(
  persist(
    (set, get) => ({
      ...initialState,
      getNetworks: () => {
        const hostname = window.location.hostname
        const networks = Array.from(get().byId)
          .map(([id, network]) => ({ id, ...network }))
          .sort(({ name: a }, { name: b }) =>
            a.toLowerCase() < b.toLowerCase() ? -1 : 1,
          )
          .filter(
            ({ filter }) =>
              !filter ||
              hostname.includes(filter) ||
              devDomains.some(domain => hostname.includes(domain)),
          )
        return networks
      },
      getLegacyNetworks: () => {
        return Array.from(get().byId)
          .map(([id, network]) => ({ id, ...network }))
          .filter(({ filter }) => filter === "legacy")
      },
      getActiveNetwork: () => {
        const networks = get().getNetworks()
        const activeNetwork = networks.find(({ id }) => id === get().activeId)
        return activeNetwork ?? networks[0]
      },
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
      name: "ALBERTO.NETWORKS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)
