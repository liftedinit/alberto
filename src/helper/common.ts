import { Identity, ANON_IDENTITY } from "many-js"
import { Account } from "../store/accounts"

export const parseIdentity = (key: any): string => {
  if (key === undefined) {
    return ANON_IDENTITY
  }
  const identity = Identity.fromPublicKey(key)

  return `${identity.toString()}`
}

export const getAddressFromHex = (hex: any): string => {
  const identity = Identity.fromHex(hex)
  return identity.toString()
}

export const makeShortId = (idString: string): string =>
  `${idString.slice(0, 4)}...${idString.slice(-4)}`

export function displayId(account: Account): { full: string; short: string } {
  if (!account?.keys) {
    return { full: "", short: ANON_IDENTITY }
  }
  const identity = Identity.fromPublicKey(account.keys.publicKey)
  const idString = identity.toString()
  return { full: idString, short: makeShortId(idString) }
}

export const parseNumberToBigInt = (v: number) =>
  BigInt(Math.round(v * 10 ** 9))

export const amountFormatter = (amt: bigint, min?: number, max?: number) => {
  const amount = parseFloat(amt.toString()) / 10 ** 9
  const amountString = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: min ?? 0,
    maximumFractionDigits: max ?? 9,
  }).format(amount)

  return amountString
}
