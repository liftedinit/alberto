import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "helper/json"

interface CredentialsStoreActions {
  updateCredential(
    id: string,
    base64CredId: string,
    cosePublicKey: ArrayBuffer,
  ): void
}

const initialState: {
  byId: Map<string, { base64CredId: string; cosePublicKey: ArrayBuffer }>
} = {
  byId: new Map(),
}

export const useCredentialsStore = create<
  typeof initialState & CredentialsStoreActions
>(
  persist(
    set => ({
      ...initialState,
      updateCredential: (
        id: string,
        base64CredId: string,
        cosePublicKey: ArrayBuffer,
      ) =>
        set(state => ({
          byId: state.byId.set(id, {
            base64CredId,
            cosePublicKey,
          }),
        })),
    }),
    {
      name: "ALBERT.CREDENTIALS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)
