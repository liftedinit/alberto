vi.mock("@web3auth/modal", () => ({
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
