import { useMemo } from "react"
import { useGetAccountsInfo } from "./api/get-account-info"
import { Account } from "./types"
import { IdTypes } from "../token-migration/components/migration-form/types"
import { useAccountsStore, useAccountStore } from "./stores"

const getUpdatedAccountsAndIdentities = (
  identityById: Map<number, Account>,
  accountById: Map<string, string>,
) => {
  const updatedAccountsAndIdentities = new Map()
  identityById.forEach((identity, id) => {
    const address = identity.address
    if (address.length === 50) {
      updatedAccountsAndIdentities.set(address, {
        idType: IdTypes.USER,
        address,
        id,
        name: identity.name,
      })
    }
  })

  accountById.forEach((info, account) => {
    updatedAccountsAndIdentities.set(account, {
      idType: IdTypes.ACCOUNT,
      address: account,
      name: info,
    })
  })

  return updatedAccountsAndIdentities
}
const getCombinedData = (info: any[], accountKeys: string[]) => {
  const combinedData = new Map()
  info.forEach((infoData, index) => {
    const accountId = accountKeys[index]
    combinedData.set(accountId, infoData.accountInfo.description)
  })
  return combinedData
}

export function useCombinedAccountInfo() {
  const identityById = useAccountsStore(s => s.byId)
  const accountById = useAccountStore(s => s.byId)
  const accountKeys = useMemo(
    () => Array.from(accountById.keys()),
    [accountById],
  )
  const allAccountInfos = useGetAccountsInfo(accountKeys)
  const allQueriesCompleted = allAccountInfos.every(
    queryResult => queryResult.isSuccess,
  )
  const info = useMemo(() => {
    return allQueriesCompleted
      ? allAccountInfos.map(queryResult => queryResult.data)
      : []
    // eslint-disable-next-line
  }, [allQueriesCompleted])
  const combinedData = useMemo(() => {
    return getCombinedData(info, accountKeys)
  }, [info, accountKeys])
  return useMemo(() => {
    return getUpdatedAccountsAndIdentities(identityById, combinedData)
  }, [identityById, combinedData])
}
