import { Action } from "../store";

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

export const initialNetworksState = {
  activeId: 0,
  byId: new Map([[0, { name: "Localhost", url: "/api" }]]),
  nextId: 1,
};

export const networksReducer = (
  state: NetworksState,
  { type, payload }: Action
) => {
  switch (type) {
    case "NETWORKS.CREATE": {
      const id = state.nextId;
      const byId = new Map(state.byId);
      byId.set(id, payload as NetworkParams);
      return { ...state, byId, activeId: id, nextId: id + 1 };
    }
    case "NETWORKS.SELECT":
      return { ...state, activeId: payload };
    default:
      return state;
  }
};
