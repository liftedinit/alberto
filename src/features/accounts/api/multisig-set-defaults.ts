import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

type MultisigDefaults = {
  threshold: number
  executeAutomatically: boolean
  expireInSecs: number
}
export function useMultisigSetDefaults(account: string) {
  const [, n] = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<undefined, Error, MultisigDefaults>(
    async ({
      threshold,
      executeAutomatically,
      expireInSecs,
    }: MultisigDefaults) => {
      const res = await n?.account.multisigSetDefaults({
        account,
        threshold,
        executeAutomatically,
        expireInSecs,
      })
      return res
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["accountinfo", account])
      },
    },
  )
}
