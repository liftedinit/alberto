import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { IdStore, Network, WebAuthnIdentity } from "many-js"

export function useSaveWebauthnCredential() {
  const [network] = useNetworkContext()
  return useMutation(
    async ({
      address,
      credentialId,
      cosePublicKey,
      identity,
    }: {
      address: string
      credentialId: ArrayBuffer
      cosePublicKey: ArrayBuffer
      identity: WebAuthnIdentity
    }) => {
      const n = new Network(network?.url ?? "", identity)
      n.apply([IdStore])
      const res = await n?.idStore.store(address, credentialId, cosePublicKey)
      return res
    },
  )
}
