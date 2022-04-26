import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "helper/json"

interface CredentialsStoreActions {
  updateCredential(a: string, b: string, c: string): void
}

const initialState: {
  byAddress: Map<string, { base64CredId: string; publicKeyBase64: string }>
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
        publicKeyBase64: string,
      ) =>
        set(state => ({
          byAddress: state.byAddress.set(address, {
            base64CredId,
            publicKeyBase64,
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
