import { Account } from "./types"

export async function doesAccountExist(
  targetPublicKey: Uint8Array | ArrayBuffer,
  accounts: [id: number, account: Account][],
): Promise<boolean> {
  return accounts.some(a => {
    const [, { identity }] = a
    if (identity && "publicKey" in identity) {
      return (
        Buffer.compare(
          Buffer.from(identity.publicKey),
          Buffer.from(targetPublicKey),
        ) === 0
      )
    }
    return false
  })
}
