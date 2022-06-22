import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { EventType } from "many-js"

export function useMultisigSubmit() {
  const [, n] = useNetworkContext()
  return useMutation<
    undefined,
    Error,
    {
      from: string
      to: string
      amount: bigint
      symbol: string
      memo?: string
    }
  >(
    async (vars: {
      from: string
      to: string
      amount: bigint
      symbol: string
      memo?: string
    }) => {
      const res = await n?.account.submitMultisigTxn(EventType.send, vars)
      return res
    },
  )
}
