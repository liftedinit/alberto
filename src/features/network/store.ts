import create from "zustand"
import { NetworkId, NetworkInfo, NetworksState } from "./types"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "shared"

interface NetworksActions {
  setActiveId: (id: NetworkId) => void
  getActiveNetwork: () => NetworkInfo
  getLegacyNetworks: () => NetworkInfo[]
  getNetworks: () => Map<NetworkId, NetworkInfo>
  createNetwork: (n: NetworkInfo) => void
  updateNetwork: (id: NetworkId, n: NetworkInfo) => void
  deleteNetwork: (id: NetworkId) => void
}

const initialNetworks: NetworkInfo[] = [
  {
    name: "Manifest Ledger",
    url: "https://alberto.app/api",
    filter: "alberto",
  },
  {
    name: "Manifest Ledger (Alpha 1)",
    url: "https://alberto.app/api/legacy",
    filter: "legacy",
    parent: "Manifest Ledger", // The parent network of the legacy network
  },
]

const networksMap: Map<NetworkId, NetworkInfo> = new Map(
  initialNetworks.map((network, index) => [index, network]),
)

const devDomains = ["localhost", "liftedinit.tech"]

export const useNetworkStore = create<NetworksState & NetworksActions>(
  persist(
    (set, get) => ({
      networks: networksMap,
      activeId: 0,
      nextId: initialNetworks.length,
      setActiveId: (id: NetworkId) =>
        set(state => ({
          ...state,
          activeId: id,
        })),
      getActiveNetwork: () => {
        const s = get()
        return s.networks.get(s.activeId)!
      },
      getLegacyNetworks: () => {
        const activeNetwork = get().getActiveNetwork()
        return Array.from(get().networks.values()).filter(
          ({ filter, parent }) =>
            filter === "legacy" && parent?.includes(activeNetwork.name),
        )
      },
      getNetworks: () => {
        const hostname = window.location.hostname
        const filteredMap: Map<NetworkId, NetworkInfo> = new Map()
        get().networks.forEach((network, id) => {
          if (
            !network.filter ||
            hostname.includes(network.filter) ||
            devDomains.some(domain => hostname.includes(domain))
          ) {
            filteredMap.set(id, network)
          }
        })
        return filteredMap
      },
      createNetwork: (n: NetworkInfo) => {
        set(s => {
          const networks = s.networks
          networks.set(s.nextId, n)
          return {
            ...s,
            activeId: s.nextId,
            nextId: s.nextId + 1,
            networks,
          }
        })
      },
      updateNetwork: (id: NetworkId, n: NetworkInfo) => {
        set(s => {
          const networks = s.networks
          networks.set(id, n)
          return {
            ...s,
            networks,
          }
        })
      },
      deleteNetwork: (id: NetworkId) => {
        set(s => {
          const networks = s.networks
          networks.delete(id)
          return {
            ...s,
            activeId: s.activeId === id ? 0 : s.activeId,
            networks,
          }
        })
      },
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
