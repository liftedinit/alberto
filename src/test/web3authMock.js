jest.mock("@web3auth/base", () => ({
  CHAIN_NAMESPACES: { OTHER: "other" },
  WALLET_ADAPTERS: { AUTH: "auth" },
}))

jest.mock("@web3auth/modal", () => ({
  Web3Auth: class MockWeb3Auth {
    constructor() {}
    async init() {}
    configureAdapter() {}
    async connectTo() {
      return {
        request: async () => "mocked_private_key",
      }
    }
    async getUserInfo() {
      return { name: "Test User", typeOfLogin: "google" }
    }
    async logout() {}
  },
}))

jest.mock("@web3auth/base-provider", () => ({
  CommonPrivateKeyProvider: class MockProvider {
    constructor() {}
  },
}))

jest.mock("@web3auth/auth-adapter", () => ({
  AuthAdapter: class MockAuthAdapter {
    constructor() {}
  },
}))
