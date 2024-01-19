import { Big } from "big.js"
import { UseMutateAsyncFunction } from "@tanstack/react-query"
import { Memo } from "../../../../../../many-js/src"

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

export type SendFunction = UseMutateAsyncFunction<
  unknown,
  Error,
  {
    from?: string
    to: string
    amount: bigint
    symbol: string
    memo?: Memo
  }
>
export type MultiSigSendFunction = UseMutateAsyncFunction<
  undefined,
  Error,
  {
    from: string
    to: string
    amount: bigint
    symbol: string
    memo?: Memo
    threshold?: number
    executeAutomatically?: boolean
    expireInSecs?: number
  }
>
export type SendFunctionType = SendFunction | MultiSigSendFunction
