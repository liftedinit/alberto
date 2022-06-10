import create from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"
import { replacer, reviver } from "helper/json"
import { CredentialData } from "../types"

interface CredentialsStoreActions {
  getCredential(phraseOrAddress: string): CredentialData | undefined
  updateCredential(
    id: string,
    base64CredentialId: string,
    cosePublicKey: ArrayBuffer,
    address: string,
  ): void
}

const initialState: {
  byId: Map<string, CredentialData | string>
} = {
  byId: new Map(),
}

export const useCredentialsStore = create<
  typeof initialState & CredentialsStoreActions
>(
  persist(
    (set, get) => ({
      ...initialState,
      getCredential(phraseOrAddress: string): CredentialData | undefined {
        const { byId } = get()
        let phraseOrCredData = byId.get(phraseOrAddress)
        if (phraseOrCredData && typeof phraseOrCredData === "string") {
          phraseOrCredData = byId.get(phraseOrCredData)
        }
        return phraseOrCredData as CredentialData | undefined
      },
      updateCredential: (
        id: string,
        base64CredentialId: string,
        cosePublicKey: ArrayBuffer,
        address?: string,
      ) =>
        set(({ byId }) => {
          byId.set(id, {
            base64CredentialId,
            cosePublicKey,
          })
          address && byId.set(address, id)
          return {
            byId,
          }
        }),
    }),
    {
      name: "ALBERTO.CREDENTIALS",
      // @ts-ignore
      getStorage: () => localforage,
      serialize: state => JSON.stringify(state, replacer),
      deserialize: str => JSON.parse(str, reviver),
    },
  ),
)