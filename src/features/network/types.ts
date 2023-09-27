export type NetworkId = number

export interface NetworkInfo {
  name: string
  url: string
  filter?: string
}

export interface NetworksState {
  networks: Map<NetworkId, NetworkInfo>
  activeId: NetworkId
  nextId: NetworkId
}
