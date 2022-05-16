import { useMutation } from "react-query"
import { Network, WebAuthnIdentity } from "many-js"
import { useNetworkContext } from "features/network"

/**
 * save webauthn account data to k-v store during creation
 */
export function useSaveWebauthnCredential() {
  const [currentNetwork] = useNetworkContext()
  return useMutation(
    async (variables: { webauthnIdentity: WebAuthnIdentity }) => {
      const { webauthnIdentity } = variables
      const network = new Network(currentNetwork?.url ?? "", webauthnIdentity)
      return new Promise(resolve => {
        setTimeout(() => resolve({ phrase: "some phrase" }), 3000)
      })
    },
  )
}
