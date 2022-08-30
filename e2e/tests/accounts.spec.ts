import { expect, Page } from "@playwright/test"
import { test } from "../fixtures"
import { AccountsPage } from "../pages/accounts"
import { HomePage } from "../pages/home"
import { mainWalletPem, wallet1Seed, wallet2Seed, wallet3Seed } from "../const"

let wallet1Address: string = ""
let wallet2Address: string = ""
let wallet3Address: string = ""

async function setup(page: Page) {
  const homePage = new HomePage(page)
  const accountsPage = new AccountsPage(page)
  await homePage.goto()
  wallet1Address = await homePage.importWalletViaSeed({
    name: "wallet1",
    seedPhrase: wallet1Seed,
  })
  wallet2Address = await homePage.importWalletViaSeed({
    name: "wallet2",
    seedPhrase: wallet2Seed,
  })
  wallet3Address = await homePage.importWalletViaSeed({
    name: "wallet3",
    seedPhrase: wallet3Seed,
  })
  await homePage.importWalletViaPem({ name: "main", pem: mainWalletPem })
  await accountsPage.goto()
  const accountAddress = await accountsPage.createAccount(
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
    amount: ".000000001",
    symbol: "MFX",
  })
  return { homePage, accountsPage }
}

test("submit, approve, revoke, and execute a multisig transaction", async ({
  page,
}) => {
  const { homePage, accountsPage } = await setup(page)
  await homePage.switchWallet("wallet1")
  await accountsPage.goto()
  await page.locator("text=account name").click()
  await accountsPage.submitTransaction({ toAddress: wallet1Address })

  await accountsPage.activityTab.click()
  const viewTxnDetailsBtn = page
    .locator('[aria-label="view transaction details"]')
    .first()

  const txnDetails = 'text="Transaction Details"'

  await homePage.switchWallet("wallet2")
  await viewTxnDetailsBtn.click()
  await page.locator(txnDetails).waitFor()

  const revokeBtn = page.locator("button", { hasText: "Revoke" })
  await expect.poll(async () => await revokeBtn.isVisible()).toBe(true)
  await revokeBtn.click()
  await page.locator(txnDetails).waitFor({ state: "hidden" })

  await homePage.switchWallet("main")
  await viewTxnDetailsBtn.click()
  await page.locator(txnDetails).waitFor()

  const approveBtn = page.locator("button", { hasText: "Approve" })
  await expect.poll(async () => await approveBtn.isVisible()).toBe(true)
  await approveBtn.click()
  await page.locator(txnDetails).waitFor({ state: "hidden" })

  await homePage.switchWallet("wallet1")
  await viewTxnDetailsBtn.click()
  await page.locator(txnDetails).waitFor()

  const executeBtn = page.locator("button", { hasText: "Execute" })
  await expect.poll(async () => await executeBtn.isVisible()).toBe(true)
  await executeBtn.click()

  await page.locator(txnDetails).waitFor({ state: "hidden" })
  await page.locator("text=executed manually").waitFor()
})

test("cannot modify multisig settings per transaction", async ({ page }) => {
  const { homePage, accountsPage } = await setup(page)
  await homePage.switchWallet("wallet1")
  await accountsPage.goto()
  await page.locator("text=account name").click()
  await accountsPage.openSendAssetModal()
  await accountsPage.fillSendAssetModalForm({
    to: wallet1Address,
    amount: ".000000001",
    memo: "this is a memo",
  })

  const sendForm = page.locator('[aria-label="send form"]')
  await sendForm.locator("button", { hasText: "Multisig Settings" }).click()
  const requiredApproversDroddown = sendForm.locator(
    "data-testid=required approvers dropdown",
  )

  const executeAutomaticallyRadios = await page
    .locator('input[type="radio"]')
    .elementHandles()
  expect(executeAutomaticallyRadios).toHaveLength(2)
  for (const elem of executeAutomaticallyRadios) {
    const isEditable = await elem.isEditable()
    expect(isEditable).toBe(false)
  }
  const isRequiredApproversDropdownEditable =
    await requiredApproversDroddown.isEditable()
  const isHoursEditable = await accountsPage.hoursInput.isEditable()
  const isMinutesEditable = await accountsPage.minutesInput.isEditable()
  const isSecondsEditable = await accountsPage.secondsInput.isEditable()
  expect(isRequiredApproversDropdownEditable).toBe(false)
  expect(isHoursEditable).toBe(false)
  expect(isMinutesEditable).toBe(false)
  expect(isSecondsEditable).toBe(false)
})

test("disallow submitting multisig transaction", async ({ page }) => {
  const { homePage, accountsPage } = await setup(page)
  await accountsPage.goto()
  await homePage.switchWallet("wallet2")
  await page.locator("text=account name").click()
  await accountsPage.openSendAssetModal()
  await accountsPage.fillSendAssetModalForm({
    to: wallet1Address,
    amount: ".000000001",
    memo: "this is a memo",
  })
  await page.locator("text=Next").click()
  await page.locator("data-testid=approve-txn").click()
  await page.locator("data-testid=send-txn-btn").click()
  await page
    .locator(
      "text=Sender needs role 'canMultisigSubmit' to perform this operation",
    )
    .waitFor()
})

test("modify multisig settings", async ({ page }) => {
  const { accountsPage } = await setup(page)
  await accountsPage.goto()
  await page.locator("text=account name").click()
  await page.locator("button", { hasText: "Multisig Settings" }).click()

  const requiredApproversDroddown = page.locator(
    "data-testid=required approvers dropdown",
  )

  await requiredApproversDroddown.selectOption("1")

  await accountsPage.hoursInput.fill("2")
  await accountsPage.minutesInput.fill("3")
  await accountsPage.secondsInput.fill("4")

  await page.locator("text=Yes").check()

  await page.locator("button", { hasText: "Save" }).click()
  expect(await page.locator("text=settings saved").waitFor()).not.toBeNull()
})

test("add and remove owner", async ({ page }) => {
  const { accountsPage } = await setup(page)
  await accountsPage.goto()
  await page.locator("text=account name").click()
  await page.locator("button", { hasText: "Account Settings" }).click()
  await page.locator("button", { hasText: "Add Owner" }).click()
  await page.locator('text="Owner"').last().fill(wallet3Address)
  await page.locator('[aria-label="select roles"]').last().click()
  const ownerWallet2 = page.locator(`[aria-label="owner ${wallet2Address}"]`)
  await accountsPage.rolesList.locator(`text="Multisig Submit"`).click()
  await accountsPage.rolesList.locator(`text="Multisig Approve"`).click()
  await page.locator("button", { hasText: "Done" }).click()
  await ownerWallet2.locator('[aria-label="remove owner"]').click()
  await page.locator("button", { hasText: "Save" }).last().click()
  await page.locator('text="Roles saved"').waitFor()
})
