import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { IdStore, Network, WebAuthnIdentity } from "@liftedinit/many-js"

export function useSaveWebauthnCredential() {
  const { command } = useNetworkContext()
  return useMutation<
    { phrase: string },
    Error,
    {
      address: string
      credentialId: ArrayBuffer
      cosePublicKey: ArrayBuffer
      identity: WebAuthnIdentity
    }
  >(async ({ address, credentialId, cosePublicKey, identity }) => {
    // This is required because at this point the Webauthn identity is not yet stored in the store.
    const n = new Network(command?.url ?? "", identity)
    n.apply([IdStore])
    return await n?.idStore.store(address, credentialId, cosePublicKey)
  })
}
