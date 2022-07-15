import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import {
  AccountFeatureTypes,
  AccountMultisigArgument,
  CreateAccountResponse,
} from "many-js"
import { accountLedgerFeature, accountMultisigFeature } from "../types"

export type CreateAccountFormData = {
  accountSettings: {
    name: string
    owners: { address: string; roles: string[] }[]
  }
  features: { [k: string]: boolean }
  featureSettings: {
    [k: string]: unknown
  }
}

export function useCreateAccount() {
  const [, n] = useNetworkContext()
  return useMutation<CreateAccountResponse, Error, CreateAccountFormData>(
    async (vars: CreateAccountFormData) => {
      const accountName = vars.accountSettings.name
      const roles = vars.accountSettings.owners.reduce(
        (
          acc: Map<string, string[]>,
          owner: { address: string; roles: string[] },
        ) => {
          acc.set(owner.address, owner.roles)
          return acc
        },
        new Map(),
      )
      const features = makeFeatures(vars.features, vars.featureSettings)
      const res = await n?.account.create({
        account: accountName,
        roles,
        features,
      })
      return res
    },
  )
}

function makeFeatures(
  features: CreateAccountFormData["features"],
  featureSettings: CreateAccountFormData["featureSettings"],
) {
  const result = []
  if (features[accountLedgerFeature]) {
    result.push(AccountFeatureTypes.accountLedger)
  }
  const multisigSettings = features[accountMultisigFeature]
    ? featureSettings[accountMultisigFeature]
    : null
  if (multisigSettings) {
    const { threshold, expireInSecs, executeAutomatically } =
      multisigSettings as {
        threshold: number
        expireInSecs: number
        executeAutomatically: "0" | "1"
      }
    const multisigArguments = [
      AccountFeatureTypes.accountMultisig,
      new Map()
        .set(AccountMultisigArgument.threshold, threshold)
        .set(AccountMultisigArgument.expireInSecs, expireInSecs)
        .set(
          AccountMultisigArgument.executeAutomatically,
          executeAutomatically === "1",
        ),
    ]
    result.push(multisigArguments)
  }
  return result
}
