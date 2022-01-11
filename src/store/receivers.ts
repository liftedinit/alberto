import { Action } from "../store";
export type ReceiverId = number;

export interface Receiver {
  publicKey?: Buffer | null;
  name: string;
  address: string;
}

export interface ReceiversState {
  activeIds: Set<ReceiverId>;
  byId: Map<ReceiverId, Receiver>;
  nextId: ReceiverId;
}

export const initialReceiversState = {
  activeIds: new Set([0]),
  byId: new Map<ReceiverId, Receiver>(),
  nextId: 1,
}

export const receiversReducer = (
  state: ReceiversState,
  { type, payload }: Action
) => {
  switch (type) {
    case "RECEIVER.CREATE": {
      const id = state.nextId;
      const byId = new Map(state.byId);
      byId.set(id, payload as Receiver);

      const activeIds = new Set(state.activeIds);
      activeIds.add(id);      
      return { ...state, byId, activeIds, nextId: id + 1 };
    }
    default:
      return state;
  }
}