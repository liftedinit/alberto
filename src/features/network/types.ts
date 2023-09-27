export type NetworkId = number

export interface NetworkInfo {
  name: string
  url: string
  filter?: string
  parent?: string
}

export interface NetworksState {
  networks: Map<NetworkId, NetworkInfo>
  activeId: NetworkId
  nextId: NetworkId
}
