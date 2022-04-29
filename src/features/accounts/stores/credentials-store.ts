import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "helper/json"

interface CredentialsStoreActions {
  updateCredential(
    address: string,
    base64CredId: string,
    cosePublicKey: ArrayBuffer,
  ): void
}

const initialState: {
  byAddress: Map<string, { base64CredId: string; cosePublicKey: ArrayBuffer }>
} = {
  byAddress: new Map(),
}

export const useCredentialsStore = create<
  typeof initialState & CredentialsStoreActions
>(
  persist(
    set => ({
      ...initialState,
      updateCredential: (
        address: string,
        base64CredId: string,
        cosePublicKey: ArrayBuffer,
      ) =>
        set(state => ({
          byAddress: state.byAddress.set(address, {
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
