import { expect, Page } from "@playwright/test"
import { HomePage } from "../pages/home"
import {
  mainWalletPem,
  wallet1Seed,
  wallet2Seed,
  destinationAddress,
} from "../const"
import { TokenMigration } from "../pages/token-migration"
import { test } from "../fixtures"
import { AccountsPage } from "../pages/accounts"

let wallet1Address: string = ""
let wallet2Address: string = ""
let mainAddress: string = ""
let accountAddress: string = ""

async function setup(page: Page) {
  const homePage = new HomePage(page)
  const tokenMigrationPage = new TokenMigration(page)
  const accountsPage = new AccountsPage(page)
  // const accountsPage = new AccountsPage(page)
  await homePage.goto()
  wallet1Address = await homePage.importWalletViaSeed({
    name: "wallet1",
    seedPhrase: wallet1Seed,
  })
  wallet2Address = await homePage.importWalletViaSeed({
    name: "wallet2",
    seedPhrase: wallet2Seed,
  })
  mainAddress = await homePage.importWalletViaPem({
    name: "main",
    pem: mainWalletPem,
  })
  await accountsPage.goto()
  accountAddress = await accountsPage.createAccount(
    "account name",
    [
      {
        address: wallet1Address,
        roles: ["Multisig Approve", "Multisig Submit"],
      },
      {
        address: wallet2Address,
        roles: ["Multisig Approve"],
      },
    ],
    "2",
  )
  await homePage.goto()
  await homePage.sendToken({
    toAddress: accountAddress,
    amount: "2",
    symbol: "MFX",
  })
  return { homePage, accountsPage, tokenMigrationPage }
}

test("migrate tokens from user", async ({ page }) => {
  const { homePage, tokenMigrationPage } = await setup(page)

  // Remove the /api/legacy network for this test as it is causing duplicate transactions listing
  await homePage.removeLegacyNetwork()

  // Create a regular "Send" migration
  const uuid = await tokenMigrationPage.createMigration(
    mainAddress,
    destinationAddress,
    "1",
    "MFX",
  )
  expect(uuid).toBeTruthy()
  await tokenMigrationPage.verifyMigrationInHistory(uuid!, mainAddress)
})

test("migrate tokens from multisig", async ({ page }) => {
  const { homePage, tokenMigrationPage } = await setup(page)

  // Remove the /api/legacy network for this test as it is causing duplicate transactions listing
  await homePage.removeLegacyNetwork()

  // Create a Multisig migration
  const uuid = await tokenMigrationPage.createMigration(
    accountAddress,
    destinationAddress,
    "1",
    "MFX",
    mainAddress,
  )
  expect(uuid).toBeTruthy()

  // At this point the migration is created, but it is not yet executed
  // We need to approve the migration
  await tokenMigrationPage.verifyMigrationInHistory(uuid!, accountAddress)

  // Switch to wallet1 and approve the migration
  await homePage.switchWallet("wallet1")
  await homePage.verifyActiveWallet("wallet1")

  // List account migration history
  await tokenMigrationPage.goto()
  await tokenMigrationPage.migrationHistoryButton.click()
  await tokenMigrationPage.sourceAddressSelect.selectOption({
    value: accountAddress,
  })

  // Open the multisig transaction details
  const viewTxnDetailsBtn = page
    .locator('[aria-label="view transaction details"]')
    .first()
  const txnDetails = 'text="Transaction Details"'

  // Approve the migration with wallet1
  await viewTxnDetailsBtn.click()
  await page.locator(txnDetails).waitFor()
  const approveBtn = page.locator("button", { hasText: "Approve" })
  await expect.poll(async () => await approveBtn.isVisible()).toBe(true)
  await approveBtn.click()
  await page.locator(txnDetails).waitFor({ state: "hidden" })

  // Switch to main wallet
  await homePage.switchWallet("main")
  await homePage.verifyActiveWallet("main")

  // Open the multisig transaction details
  await viewTxnDetailsBtn.click()
  await page.locator(txnDetails).waitFor()

  // Execute the migration with main wallet
  const executeBtn = page.locator("button", { hasText: "Execute" })
  await expect.poll(async () => await executeBtn.isVisible()).toBe(true)
  await executeBtn.click()

  // Verify the migration was executed
  await page.locator(txnDetails).waitFor({ state: "hidden" })
  await page.locator("text=executed manually").waitFor()

  await tokenMigrationPage.verifyExecutedMultiSigMigrationInHistory(
    uuid!,
    accountAddress,
  )
})
