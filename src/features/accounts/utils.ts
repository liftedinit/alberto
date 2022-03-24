import { Account } from "./types"

export function doesAccountExist(
  targetPublicKey: Uint8Array,
  accounts: [id: number, account: Account][],
): boolean {
  return accounts.some(a => {
    const [, { keys }] = a
    return keys
      ? Buffer.compare(
          Buffer.from(keys!.publicKey),
          Buffer.from(targetPublicKey),
        ) === 0
      : false
  })
}
