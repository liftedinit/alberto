import { useMutation } from "react-query"
import { useNetworkContext } from "features/network"
import {
  AccountFeatureTypes,
  AccountMultisigArgument,
  CreateAccountResponse,
} from "@liftedinit/many-js"
import { accountLedgerFeature, accountMultisigFeature } from "../types"

export type CreateAccountTokenMigrationFormData = {
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
  const { command: n } = useNetworkContext()
  return useMutation<
    CreateAccountResponse,
    Error,
    CreateAccountTokenMigrationFormData
  >(async (vars: CreateAccountTokenMigrationFormData) => {
    const name = vars.accountSettings.name
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
    return await n?.account.create({ name, roles, features })
  })
}

function makeFeatures(
  features: CreateAccountTokenMigrationFormData["features"],
  featureSettings: CreateAccountTokenMigrationFormData["featureSettings"],
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
        executeAutomatically: boolean
      }
    const multisigArguments = [
      AccountFeatureTypes.accountMultisig,
      new Map()
        .set(AccountMultisigArgument.threshold, threshold)
        .set(AccountMultisigArgument.expireInSecs, expireInSecs)
        .set(
          AccountMultisigArgument.executeAutomatically,
          executeAutomatically,
        ),
    ]
    result.push(multisigArguments)
  }
  return result
}
