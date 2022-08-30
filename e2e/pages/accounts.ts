import { Locator, Page, expect } from "@playwright/test"

type Roles =
  | "Multisig Submit"
  | "Multisig Approve"
  | "Owner"
  | "Ledger Transact"

export class AccountsPage {
  readonly url = ""
  readonly page: Page
  readonly activityTab: Locator
  readonly assetsTab: Locator
  readonly addAccountsBtn: Locator
  readonly createAccountTab: Locator
  readonly createAccountLedgerFeature: Locator
  readonly createAccountMultisigFeature: Locator
  readonly rolesList: Locator
  readonly hoursInput: Locator
  readonly minutesInput: Locator
  readonly secondsInput: Locator

  constructor(page: Page) {
    this.page = page
    this.activityTab = page.locator("text=activity")
    this.assetsTab = page.locator("text=assets")
    this.addAccountsBtn = page.locator("data-testid=add account btn")
    this.createAccountTab = page.locator("button", { hasText: "Create" })
    this.createAccountLedgerFeature = page.locator("text='Ledger'")
    this.createAccountMultisigFeature = page.locator("text='Multisig'")
    this.rolesList = page.locator("data-testid=roles list")
    this.hoursInput = page.locator('[placeholder="H"]')
    this.minutesInput = page.locator('[placeholder="M"]')
    this.secondsInput = page.locator('[placeholder="S"]')
  }

  async goto() {
    await this.page.goto(this.url + `/#/accounts`)
  }

  async createAccount(
    accountName: string = "account name",
    owners: { address: string; roles: Roles[] }[],
    approversCount: string = String(owners.length + 1),
  ): Promise<string> {
    await this.addAccountsBtn.click()
    await this.createAccountTab.click()
    await this.createAccountLedgerFeature.click()
    await this.createAccountMultisigFeature.click()
    const nextBtn = this.page.locator("button", { hasText: "Next" })
    await nextBtn.click()

    await this.page.locator("text=name").fill(accountName)

    const ownersCount = owners.length

    for (const [idx, owner] of owners.entries()) {
      const { address, roles } = owner
      await this.page.locator('text="Owner"').last().fill(address)
      await this.page.locator('[aria-label="select roles"]').last().click()
      for (const role of roles) {
        await this.rolesList.locator(`text="${role}"`).click()
      }
      await this.page.locator("text=done").click()
      if (idx < ownersCount - 1 && ownersCount > 1) {
        await this.page.locator("button", { hasText: "Add Owner" }).click()
      }
    }

    await nextBtn.click()
    await this.page
      .locator("text='Required Approvers'")
      .selectOption(String(approversCount))
    await this.page.locator('[placeholder="H"]').fill("1")
    await this.page.locator('[placeholder="M"]').fill("1")
    await this.page.locator('[placeholder="S"]').fill("1")
    await nextBtn.click()
    await this.page.locator("data-testid=create account btn").click()
    await this.page.waitForURL("**/accounts/**")
    const accountAddress = this.page.url().split("/accounts/")[1]
    expect(accountAddress).toHaveLength(55)
    return accountAddress
  }

  async submitTransaction({
    toAddress,
    amount = ".000000001",
    symbol = "MFX",
  }: {
    toAddress: string
    amount?: string
    symbol?: string
  }) {
    await this.page.locator("text=assets").click()
    await this.page.hover(`[aria-label="asset list item ${symbol}"]`)
    await this.page.locator("button", { hasText: "Send" }).click()

    await this.page.keyboard.type(toAddress)

    await this.page.locator("input[name=amount]").type(amount)

    await this.page.locator("text=Next").click()

    await this.page.locator("data-testid=approve-txn").click()

    await this.page.locator("data-testid=send-txn-btn").click()

    await this.page.locator("text=send asset").waitFor({ state: "hidden" })
    await this.page.locator("text=assets").click()
  }

  async openSendAssetModal(symbol: string = "MFX") {
    await this.page.locator("text=assets").click()
    const assetListItem = this.page.locator(
      `[aria-label="asset list item ${symbol}"]`,
    )
    await assetListItem.hover()
    const sendBtn = this.page.locator("button", { hasText: "Send" })
    expect(await sendBtn.isVisible()).toBe(true)
    await sendBtn.click()
    expect(await this.page.locator('text="Send Asset"').isVisible())
  }

  async fillSendAssetModalForm({
    to,
    amount,
    memo,
  }: {
    to: string
    amount: string
    memo?: string
  }) {
    await this.page.keyboard.type(to)
    await this.page.locator("input[name=amount]").type(amount)
    if (memo) {
      await this.page.locator("input[name=memo]").type(memo)
    }
  }
}
