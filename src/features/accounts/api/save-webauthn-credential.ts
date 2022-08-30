import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { IdStore, Network, WebAuthnIdentity } from "@liftedinit/many-js"

export function useSaveWebauthnCredential() {
  const [network] = useNetworkContext()
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
    const n = new Network(network?.url ?? "", identity)
    n.apply([IdStore])
    const res = await n?.idStore.store(address, credentialId, cosePublicKey)
    return res
  })
}
