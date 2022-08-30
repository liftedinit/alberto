import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import { EventType } from "@liftedinit/many-js"

type SubmitData = {
  from: string
  to: string
  amount: bigint
  symbol: string
  memo?: string
  threshold?: number
  executeAutomatically?: boolean
  expireInSecs?: number
}
export function useMultisigSubmit() {
  const [, n] = useNetworkContext()
  return useMutation<undefined, Error, SubmitData>(async vars => {
    const res = await n?.account.submitMultisigTxn(EventType.send, vars)
    return res
  })
}
