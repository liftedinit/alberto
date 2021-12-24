import { Action } from "../store";

export interface Server {
  name: string;
  url: string;
}

export type ServersState = Server[];

export const initialServers = [
  { name: "Localhost", url: "http://localhost:8000/" },
];

export const serversReducer = (
  state: ServersState,
  { type, payload }: Action
) => {
  switch (type) {
    case "SERVERS.CREATE":
      return payload ? [...state, payload as Server] : state;
    default:
      return state;
  }
};
