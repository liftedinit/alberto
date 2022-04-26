import { Account } from "./types"

export function doesAccountExist(
  targetPublicKey: Uint8Array | ArrayBuffer,
  accounts: [id: number, account: Account][],
): boolean {
  return accounts.some(a => {
    const [, { keys, identity }] = a
    if (keys) {
      return (
        Buffer.compare(
          Buffer.from(keys.publicKey),
          Buffer.from(targetPublicKey),
        ) === 0
      )
    } else if (identity) {
      return (
        Buffer.compare(
          Buffer.from(identity?.publicKey),
          Buffer.from(targetPublicKey),
        ) === 0
      )
    }
    return false
  })
}
