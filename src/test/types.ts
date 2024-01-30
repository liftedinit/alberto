import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"

export class MockEd25519KeyPairIdentity extends Ed25519KeyPairIdentity {
  constructor(publicKey: ArrayBuffer, privateKey: ArrayBuffer) {
    super(publicKey, privateKey)
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
}
export interface MockAccount {
  name: string
  address: string
  identity: MockEd25519KeyPairIdentity
}
