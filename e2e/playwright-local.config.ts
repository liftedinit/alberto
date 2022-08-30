import type { PlaywrightTestConfig } from "@playwright/test"
import { FIVE_MINUTES } from "./const"

const config: PlaywrightTestConfig = {
  // Use globalSetup & globalTearedown only if browserstack.local = true
  globalSetup: require.resolve("./global-setup"),
  globalTeardown: require.resolve("./global-teardown"),
  timeout: FIVE_MINUTES,
  use: {
    baseURL: "https://localhost:3000",
    ignoreHTTPSErrors: true,
    viewport: null,
  },
  projects: [
    {
      name: "chrome@latest:Windows 10@browserstack",
      use: {
        browserName: "chromium",
        channel: "chrome",
      },
    },
    {
      name: "chrome@latest-beta:OSX Big Sur@browserstack",
      use: {
        browserName: "chromium",
        channel: "chrome",
      },
    },
    {
      name: "edge@90:Windows 10@browserstack",
      use: {
        browserName: "chromium",
      },
    },
    {
      name: "playwright-firefox@latest:OSX Catalina@browserstack",
      use: {
        browserName: "firefox",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "playwright-webkit@latest:OSX Big Sur@browserstack",
      use: {
        browserName: "webkit",
      },
    },
  ],
}
export default config
