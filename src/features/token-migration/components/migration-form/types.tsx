import { Big } from "big.js"

export enum StepNames {
  ADDRESS,
  USER_ADDRESS,
  AMOUNT_ASSET,
  DESTINATION_ADDRESS,
  CONFIRMATION,
  LOG,
  PROCESSING,
}

export interface TokenMigrationFormData {
  assetAmount: Big
  assetSymbol: string
  assetTicker: string
  destinationAddress: string
  userAddress: string
  accountAddress: string
}

export function defaultValues(): TokenMigrationFormData {
  return {
    assetAmount: Big(0),
    assetSymbol: "",
    assetTicker: "",
    destinationAddress: "",
    userAddress: "",
    accountAddress: "",
  }
}

export enum IdTypes {
  USER,
  ACCOUNT,
}

export interface IdentitiesAndAccounts {
  idType: IdTypes
  address: string
  name?: string
  id?: number
}
