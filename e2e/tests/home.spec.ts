import { expect, Page } from "@playwright/test"
import { test } from "../fixtures"
import { mainWalletPem, /* wallet1Address, */ wallet1Seed } from "../const"
import { HomePage } from "../pages/home"

let wallet1Address: string = ""
async function setup(page: Page) {
  const homePage = new HomePage(page)
  await homePage.goto()
  wallet1Address = await homePage.importWalletViaSeed({
    name: "wallet1",
    seedPhrase: wallet1Seed,
  })
  await homePage.createWalletViaSeed("wallet2")
  await homePage.importWalletViaPem({ name: "main", pem: mainWalletPem })
  return { homePage }
}

test("send tokens", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.verifyActiveWallet("main")
  const symbol = "MFX"
  let startAmount = await page
    .locator(`[aria-label="${symbol} amount"]`)
    .textContent()
  startAmount = (startAmount as string).replace(/,/g, "")
  await homePage.sendToken({
    toAddress: wallet1Address,
    symbol,
    amount: ".000000001",
  })
  await page.waitForLoadState("networkidle")

  await expect
    .poll(async () => {
      const endAmount = await page
        .locator(`[aria-label="${symbol} amount"]`)
        .textContent()
      return parseFloat(endAmount as string)
    })
    .toBeLessThan(parseFloat(startAmount as string))
})

test("edit wallet name", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.openWalletMenu()
  await page.locator('[aria-label="edit account main"]').click()
  const nameInput = page.locator('input[name="name"]')
  await nameInput.click()
  const newName = "main-renamed"
  await nameInput.fill(newName)
  await page.locator("text=Save").click()
  expect(await homePage.walletMenuTrigger.textContent()).toContain(newName)
})

test("remove wallet", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.openWalletMenu()
  await page.locator('[aria-label="edit account wallet1"]').click()
  const address = (await homePage.updateAccountForm
    .locator("[aria-label='public address']")
    .getAttribute("title")) as string
  const removeBtn = homePage.removeAccountForm.locator("button", {
    hasText: "Remove",
  })
  expect(await removeBtn.isDisabled()).toBe(true)
  await page.locator('text="Remove Account"').fill(address)
  expect(await removeBtn.isDisabled()).toBe(false)
  await removeBtn.click()
  await page.locator("text=account was removed").waitFor()
})

test("add a network", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.openNetworkMenu()
  await homePage.addNetworkButton.click()
  await page.locator('input[name="name"]').fill("new-network")
  await page.locator('input[name="url"]').fill("/new-api")
  await page.locator("text=save").click()
  const networkName = await homePage.networkMenuTrigger.textContent()
  expect(networkName).toBe("new-network")
})

test("edit a network", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.openNetworkMenu()
  await homePage.addNetworkButton.click()
  await page.locator('input[name="name"]').fill("new-network")
  await page.locator('input[name="url"]').fill("/new-api")
  await page.locator("text=save").click()
  const networkName = await homePage.networkMenuTrigger.textContent()
  expect(networkName).toBe("new-network")

  await homePage.openNetworkMenu()
  await page.locator('[aria-label="edit network"]').first().click()
  await page.locator('input[name="name"]').fill("new-network2")
  await page.locator("text=save").click()
  const networkName2 = await homePage.networkMenuTrigger.textContent()
  expect(networkName2).toBe("new-network2")
})

test("remove a network", async ({ page }) => {
  const { homePage } = await setup(page)
  await homePage.openNetworkMenu()
  await homePage.addNetworkButton.click()
  await page.locator('input[name="name"]').fill("new-network")
  await page.locator('input[name="url"]').fill("/new-api")
  await page.locator("text=save").click()
  const networkName = await homePage.networkMenuTrigger.textContent()
  expect(networkName).toBe("new-network")

  await homePage.openNetworkMenu()
  await page.locator('[aria-label="edit network"]').first().click()
  const removeBtn = page.locator("data-testid=remove network button")
  expect(removeBtn).toBeDisabled()
  const name = await page.locator('input[name="name"]').inputValue()
  const url = await page.locator('input[name="url"]').inputValue()
  await page.locator('input[name="deleteUrl"]').fill(url as string)
  expect(removeBtn).not.toBeDisabled()
  await removeBtn.click()
  const networkName2 = await homePage.networkMenuTrigger.textContent()
  expect(networkName2).not.toBe(name)
})
