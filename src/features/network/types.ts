export type NetworkId = number;

export interface NetworkParams {
  name: string;
  url: string;
}

export interface NetworksState {
  activeId: NetworkId;
  byId: Map<NetworkId, NetworkParams>;
  nextId: NetworkId;
}
