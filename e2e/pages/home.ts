import { expect, Locator, Page } from "@playwright/test"

export class HomePage {
  readonly url = "/#/"
  readonly page: Page
  readonly walletMenuTrigger: Locator
  readonly networkMenuTrigger: Locator
  readonly addWalletButton: Locator
  readonly addNetworkButton: Locator
  readonly walletMenuList: Locator
  readonly importTab: Locator
  readonly updateAccountForm: Locator
  readonly removeAccountForm: Locator
  readonly activeWalletAddress: Locator

  constructor(page: Page) {
    this.page = page
    this.walletMenuTrigger = this.page.locator(
      '[aria-label="active account menu trigger"]',
    )
    this.addWalletButton = this.page.locator("data-testid=add wallet btn")
    this.addNetworkButton = this.page.locator("text=Add Network")
    this.networkMenuTrigger = this.page.locator(
      '[aria-label="active network menu trigger"]',
    )
    this.walletMenuList = this.page.locator("data-testid=wallet menu list")
    this.importTab = this.page.locator("text=import")
    this.updateAccountForm = this.page.locator(
      "data-testid=update-account-form",
    )
    this.removeAccountForm = this.page.locator(
      "data-testid=remove-account-form",
    )
    this.activeWalletAddress = this.page.locator(
      '[aria-label="active wallet address"]',
    )
  }

  async goto() {
    await this.page.goto(this.url)
  }

  async createWalletViaSeed(name: string): Promise<string> {
    await this.openWalletMenu()
    await this.addWalletButton.click()
    await this.page.locator("text=Seed Phrase").click()
    await this.page.locator('input[name="name"]').fill(name)
    await this.page.locator("button", { hasText: "Save" }).click()
    await this.verifyActiveWallet(name)
    return this.getActiveWalletAddress()
  }

  async importWalletViaPem({
    name,
    pem,
  }: {
    name: string
    pem: string
  }): Promise<string> {
    await this.openWalletMenu()
    await this.addWalletButton.click()
    await this.importTab.click()
    await this.page.locator("text=PEM File").click()
    await this.page.locator('input[name="name"]').fill(name)
    await this.page.locator('textarea[name="pem"]').fill(pem)
    await this.page.locator("text=Save").click()
    await this.verifyActiveWallet(name)
    return this.getActiveWalletAddress()
  }

  async importWalletViaSeed({
    name,
    seedPhrase,
  }: {
    name: string
    seedPhrase: string
  }): Promise<string> {
    await this.openWalletMenu()
    await this.addWalletButton.click()
    await this.importTab.click()

    const pemFileOption = this.page.locator("text=Seed Phrase")
    await pemFileOption.click()

    const nameInput = this.page.locator('input[name="name"]')
    await nameInput.click()
    await nameInput.fill(name)

    const seedPhraseInput = this.page.locator('text="Seed Words"')
    await seedPhraseInput.fill(seedPhrase)

    const saveBtn = this.page.locator("text=Save")
    await saveBtn.click()
    await this.verifyActiveWallet(name)
    return this.getActiveWalletAddress()
  }

  async switchWallet(name: string) {
    await this.openWalletMenu()
    let walletItem = this.walletMenuList.locator("button", { hasText: name })
    await walletItem.waitFor()
    await walletItem.click()
    await walletItem.waitFor({ state: "hidden" })
    let activeWallet = await this.walletMenuTrigger.textContent()

    await expect
      .poll(async () => {
        if (!activeWallet?.includes(name)) {
          await this.openWalletMenu()
          await walletItem.waitFor()
          await walletItem.click()
          await walletItem.waitFor({ state: "hidden" })
          activeWallet = await this.walletMenuTrigger.textContent()
          return false
        }
        return true
      })
      .toBe(true)
  }

  async sendToken({
    toAddress,
    amount,
    symbol,
  }: {
    toAddress: string
    amount: string
    symbol: string
  }) {
    await this.page.locator("text=assets").click()
    await this.page.hover(`[aria-label="asset list item ${symbol}"]`)
    await this.page.locator("button", { hasText: "Send" }).click()
    await this.page.keyboard.type(toAddress)
    await this.page.locator("input[name=amount]").type(amount)
    await this.page.locator("text=Next").click()
    await this.page.locator("data-testid=approve-txn").click()
    await this.page.locator("data-testid=send-txn-btn").click()
    await this.page.locator('text="Send Asset"').waitFor({ state: "hidden" })
    await this.page.locator("text=assets").click()
  }

  async openWalletMenu() {
    await this.walletMenuTrigger.click()
    await this.walletMenuList.waitFor()
  }

  async openNetworkMenu() {
    await this.networkMenuTrigger.click()
  }

  async verifyActiveWallet(name: string) {
    await expect
      .poll(async () => await this.walletMenuTrigger.textContent())
      .toContain(name)
  }

  async getActiveWalletAddress(): Promise<string> {
    const title = await this.activeWalletAddress.getAttribute("title")
    expect(title).not.toBe(null)
    return title as string
  }
}
