import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { WebAuthnIdentity } from "@liftedinit/many-js"

export function useSaveWebauthnCredential() {
  const { command: n } = useNetworkContext()
  return useMutation<
    { phrase: string },
    Error,
    {
      address: string
      credentialId: ArrayBuffer
      cosePublicKey: ArrayBuffer
      identity: WebAuthnIdentity
    }
  >(async ({ address, credentialId, cosePublicKey }) => {
    return await n?.idStore.store(address, credentialId, cosePublicKey)
  })
}
