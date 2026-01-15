import React from "react"

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
  WALLET_CONNECTORS: {
    AUTH: "auth",
  },
}))

// Mock Web3authProvider to avoid react-query context issues
vi.mock("../features/accounts/components/social-login/social-login", () => ({
  Web3authProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  SocialLogin: () => null,
  LOGIN_PROVIDER: {
    GOOGLE: "google",
    GITHUB: "github",
    TWITTER: "twitter",
    EMAIL_PASSWORDLESS: "email_passwordless",
  },
}))
