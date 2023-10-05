import { useMutation, useQueryClient } from "react-query"
import { useNetworkContext } from "features/network"

type MultisigDefaults = {
  threshold: number
  executeAutomatically: boolean
  expireInSecs: number
}
export function useMultisigSetDefaults(account: string) {
  const { command: n } = useNetworkContext()
  const queryClient = useQueryClient()
  return useMutation<undefined, Error, MultisigDefaults>(
    async ({
      threshold,
      executeAutomatically,
      expireInSecs,
    }: MultisigDefaults) => {
      return await n?.account.multisigSetDefaults({
        account,
        threshold,
        executeAutomatically,
        expireInSecs,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["accountinfo", account])
      },
    },
  )
}
