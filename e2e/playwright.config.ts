import { devices } from "@playwright/test"
import type { PlaywrightTestConfig } from "@playwright/test"
import { FIVE_MINUTES } from "./const"

const config: PlaywrightTestConfig = {
  timeout: FIVE_MINUTES,
  maxFailures: 1,
  use: {
    baseURL: "https://localhost:3000",
    viewport: null,
    ignoreHTTPSErrors: true,
  },

  projects: [
    // {
    //   name: "chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    // },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "iphone12-promax",
    //   use: {
    //     ...devices["iPhone 12 Pro Max"],
    //   },
    // },
    // {
    //   name: "pixel-5",
    //   use: {
    //     ...devices["Pixel 5"],
    //   },
    // },
  ],
}
export default config
