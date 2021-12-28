import { Action } from "../store";

export interface Server {
  name: string;
  url: string;
}

export interface ServersState {
  activeIds: Set<number>;
  nextId: number;
  servers: Map<number, Server>;
}

export const initialServersState = {
  activeIds: new Set([0]),
  nextId: 1,
  servers: new Map([[0, { name: "Localhost", url: "http://localhost:8000/" }]]),
};

export const serversReducer = (
  state: ServersState,
  { type, payload }: Action
) => {
  switch (type) {
    case "SERVERS.CREATE": {
      const id = state.nextId;
      const servers = new Map(state.servers);
      servers.set(id, payload as Server);
      const activeIds = new Set(state.activeIds);
      activeIds.add(id);
      return { ...state, servers, activeIds, nextId: id + 1 };
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
