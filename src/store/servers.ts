import { Action } from "../store";

export type ServerId = number;

export interface Server {
  name: string;
  url: string;
}

export interface ServersState {
  activeId: ServerId;
  byId: Map<ServerId, Server>;
  nextId: ServerId;
}

export const initialServersState = {
  activeId: 0,
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
      return { ...state, byId, activeId: id, nextId: id + 1 };
    }
    case "SERVERS.TOGGLE":
      return { ...state, activeId: payload };
    default:
      return state;
  }
};
