import { Account } from "features/accounts"
import { Address, ANON_IDENTITY } from "many-js"

const DEFAULT_MAX_DIGITS = 9

export const parseIdentity = (key: any): string => {
  if (key === undefined) {
    return ANON_IDENTITY
  }
  const identity = Address.fromPublicKey(key)

  return `${identity.toString()}`
}

export const getAddressFromHex = (hex: any): string => {
  const identity = Address.fromHex(hex)
  return identity.toString()
}

export const makeShortId = (idString: string): string =>
  `${idString.slice(0, 4)}...${idString.slice(-4)}`

export function displayId(account: Account): { full: string; short: string } {
  if (account?.identity) {
    const address = Address.fromPublicKey(account.identity.publicKey)
    const idString = address.toString()
    return { full: idString, short: makeShortId(idString) }
  }
  if (!account?.keys) {
    return { full: "", short: ANON_IDENTITY }
  }
  const identity = Address.fromPublicKey(account.keys.publicKey)
  const idString = identity.toString()
  return { full: idString, short: makeShortId(idString) }
}

export const parseNumberToBigInt = (
  v: number,
  maxDigits: number = DEFAULT_MAX_DIGITS,
) => BigInt(Math.round(v * 10 ** maxDigits))

export const amountFormatter = (
  amt: bigint,
  minDigits: number = 0,
  maxDigits: number = DEFAULT_MAX_DIGITS,
) => {
  const amount = parseFloat(amt.toString()) / 10 ** maxDigits
  const amountString = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(amount)

  return amountString
}
