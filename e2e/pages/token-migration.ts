import { Locator, Page, expect } from "@playwright/test"

export class TokenMigration {
  readonly page: Page
  readonly url = "/#/token-migration-portal"
  readonly createNewMigrationButton: Locator
  readonly migrationHistoryButton: Locator
  readonly sourceAddressSelect: Locator
  readonly userAddressSelect: Locator // Only used in the Account use-case
  readonly destinationAddressInput: Locator
  readonly amountInput: Locator
  readonly amountType: Locator
  readonly nextButton: Locator

  constructor(page: Page) {
    this.page = page
    this.createNewMigrationButton = this.page.locator(
      '[aria-label="create-new-migration-btn"]',
    )
    this.migrationHistoryButton = this.page.locator(
      '[aria-label="view-migration-history-btn"]',
    )
    this.sourceAddressSelect = this.page.locator(
      '[aria-label="user-account-address"]',
    )
    this.userAddressSelect = this.page.locator('[aria-label="user-address"]')
    this.destinationAddressInput = this.page.locator(
      '[aria-label="destination-address"]',
    )
    this.amountType = this.page.locator('[aria-label="select-asset-type"]')
    this.amountInput = this.page.locator('[aria-label="select-asset-amount"]')
    this.nextButton = this.page.locator('[data-testid="next-btn"]')
  }

  async goto() {
    await this.page.goto(this.url)
  }

  async createMigration(
    from: string,
    destination: string,
    amount: string,
    denom: string,
    maybeUserAddress?: string,
  ) {
    await this.goto()
    await this.createNewMigrationButton.click()
    await this.sourceAddressSelect.selectOption({
      value: from,
    })
    await this.nextButton.click()

    // Account use-case
    if (from.length === 55 && maybeUserAddress !== undefined) {
      await this.userAddressSelect.selectOption({
        value: maybeUserAddress,
      })
      await this.nextButton.click()
    }

    await this.amountType.selectOption({ label: denom })
    await this.amountInput.fill(amount)
    await this.nextButton.click()

    await this.destinationAddressInput.fill(destination)
    await this.nextButton.click()

    await this.page.waitForSelector('[data-testid="confirmation-box"]')
    await this.nextButton.click()

    await this.page.waitForURL("/#/token-migration-portal/migration-history/*")

    return await this.page.locator('[aria-label="uuid"]').textContent()
  }

  async verifyMigrationInHistory(uuid: string, address: string) {
    await this.goto()
    await this.migrationHistoryButton.click()
    await this.sourceAddressSelect.selectOption({
      value: address,
    })
    await this.page.waitForSelector(`[aria-label="${uuid}"]`)
    const uuidElement = await this.page
      .locator(`[aria-label="${uuid}"]`)
      .textContent()
    expect(uuidElement).toBe(uuid)
  }

  async verifyExecutedMultiSigMigrationInHistory(
    uuid: string,
    address: string,
  ) {
    await this.goto()
    await this.migrationHistoryButton.click()
    await this.sourceAddressSelect.selectOption({
      value: address,
    })
    const elements = await this.page.$$(`[aria-label="${uuid}"]`)
    expect(elements.length).toBe(2)
  }
}
