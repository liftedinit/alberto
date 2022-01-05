import { Action } from "../store";

export type ServerId = number;

export interface Server {
  name: string;
  url: string;
}

export interface ServersState {
  activeIds: Set<ServerId>;
  byId: Map<ServerId, Server>;
  nextId: ServerId;
}

export const initialServersState = {
  activeIds: new Set([0]),
  byId: new Map([[0, { name: "Localhost", url: "/api" }]]),
  nextId: 1,
};

export const serversReducer = (
  state: ServersState,
  { type, payload }: Action
) => {
  switch (type) {
    case "SERVERS.CREATE": {
      const id = state.nextId;

      const byId = new Map(state.byId);
      byId.set(id, payload as Server);

      const activeIds = new Set(state.activeIds);
      activeIds.add(id);

      return { ...state, byId, activeIds, nextId: id + 1 };
    }
    case "SERVERS.TOGGLE": {
      const activeIds = new Set(state.activeIds);
      if (activeIds.has(payload)) {
        activeIds.delete(payload);
      } else {
        activeIds.add(payload);
      }
      return { ...state, activeIds };
    }
    default:
      return state;
  }
};
