import { useQuery } from "react-query"
import { useNetworkContext } from "features/network"
import { MultisigInfoResponse } from "@liftedinit/many-js"

const transactionNotFound = new Error("The transaction cannot be found.")
type ResponseOrError = MultisigInfoResponse | Error
type MultisigInfoFromNetworks = {
  isLegacyOnly: boolean
  info: MultisigInfoResponse[]
}

export function useGetMultisigTxnInfo(token?: ArrayBuffer) {
  const { query: n, legacy: l } = useNetworkContext()
  // Create a network list from n and l, excluding undefined values and empty arrays
  // `n` is the active network
  // `l` is the legacy network list
  const networkList = [...(n ? [n] : []), ...(l || [])]

  return useQuery<MultisigInfoFromNetworks, Error>({
    queryKey: ["multisigTxnInfo", token],
    queryFn: async () => {
      if (networkList.length === 0) {
        throw new Error("Network context is empty")
      }

      // Try to find the transaction on the active network
      const resActive: ResponseOrError = await n?.account
        .multisigInfo(token)
        .catch((err: Error) => {
          if (err.message === transactionNotFound.message) {
            return transactionNotFound
          }
          return err
        })

      // Try to find the transaction on the legacy networks
      let resLegacy = await Promise.all(
        (l || []).map(item =>
          item.account.multisigInfo(token).catch((err: Error) => {
            if (err.message === transactionNotFound.message) {
              return transactionNotFound
            }
            return err
          }),
        ),
      )

      // Remove the transactionNotFound errors from the result
      resLegacy = resLegacy.filter(
        item =>
          !(
            item instanceof Error &&
            item.message === transactionNotFound.message
          ),
      )

      // Initialize the result with the active network result if it is not an error, else initialize it with an empty array
      let res: MultisigInfoResponse[] = !(resActive instanceof Error)
        ? [resActive]
        : []

      // Add the legacy network results to the result
      if (resLegacy.length > 0) {
        res = [...res, ...resLegacy]
      }

      // Check if the result comes from legacy networks only
      let legacyOnly = res.length > 0 && resActive instanceof Error

      // If the result is empty, then the transaction really is not found on any network
      if (res.length === 0) {
        throw transactionNotFound
      }

      return { isLegacyOnly: legacyOnly, info: res }
    },
    enabled: !!token,
  })
}
