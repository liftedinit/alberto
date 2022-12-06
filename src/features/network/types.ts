export type NetworkId = number

export interface NetworkParams {
  id?: NetworkId
  name: string
  url: string
  filter?: string
}

export interface NetworksState {
  activeId?: NetworkId
  byId: Map<NetworkId, NetworkParams>
  nextId: NetworkId
}
