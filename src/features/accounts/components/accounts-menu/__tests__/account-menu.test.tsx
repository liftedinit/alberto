import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from "test/test-utils"
import { toast } from "components"
import { useAddressText } from "components/address-text"
import { AnonymousIdentity, Ed25519KeyPairIdentity } from "many-js"
import { AccountsMenu } from "../accounts-menu"
import { useAccountsStore } from "features/accounts"

jest.mock("many-js")

jest.mock("components/address-text", () => {
  return {
    ...jest.requireActual("components/address-text"),
    useAddressText: jest.fn(),
  }
})

describe("AccountsMenu", () => {
  beforeEach(async () => {
    toast.closeAll()
    const toasts = screen.queryAllByRole("listitem")
    await Promise.all(toasts.map(toasts => waitForElementToBeRemoved(toasts)))

    useAddressText.mockImplementation(val => {
      return typeof val === "string" ? val : "m111"
    })

    Ed25519KeyPairIdentity.getMnemonic.mockImplementation(
      () => "one two three four five six seven eight nine ten eleven twelve",
    )
    Ed25519KeyPairIdentity.fromMnemonic.mockImplementation(() => {
      return new Ed25519KeyPairIdentity(new ArrayBuffer(0), new ArrayBuffer(0))
    })
    Ed25519KeyPairIdentity.fromPem.mockImplementation(() => {
      return new Ed25519KeyPairIdentity(new ArrayBuffer(0), new ArrayBuffer(0))
    })
  })

  it("should render with an active account as anonymous", async function () {
    renderAccountsMenu()
    const activeAccountMenuTriggerBtn = screen.getByRole("button", {
      name: /active account menu trigger/i,
    })
    expect(
      within(activeAccountMenuTriggerBtn).getByText(/anonymous/i),
    ).toBeInTheDocument()
  })

  it("should add an account via a new seed phrase", async function () {
    const { activeAccountMenuTriggerBtn, formContainer } =
      await setupAddAccount()
    const withinForm = within(formContainer)
    const btn = withinForm.getByRole("button", { name: /create seed phrase/i })
    fireEvent.click(btn)

    const saveBtn = screen.getByRole("button", { name: /save/i })
    expect(screen.getAllByLabelText("seed-word")).toHaveLength(12)
    const nameInput = screen.getByLabelText(/name/i)
    userEvent.type(nameInput, "new-account")
    fireEvent.click(saveBtn)
    await waitFor(() => {
      expect(
        within(activeAccountMenuTriggerBtn).getByText("new-account"),
      ).toBeInTheDocument()
    })
  })

  it("should add an account via importing with existing seed phrase", async function () {
    const seedPhrase = `
        fault
        light
        floor
        lumber
        outer
        image
        puppy
        merge
        payment
        ritual
        basic
        permit
      `
    const { activeAccountMenuTriggerBtn, formContainer, tabs } =
      await setupAddAccount()
    const importTab = within(tabs).getByText(/import/i)
    userEvent.click(importTab)
    const withinForm = within(formContainer)
    const importSeedWordsBtn = screen.getByRole("button", {
      name: /import seed phrase/i,
    })

    fireEvent.click(importSeedWordsBtn)
    const nameInput = screen.getByLabelText(/name/i)
    const seedPhraseInput = withinForm.getByLabelText(/seed words/i)
    userEvent.type(nameInput, "seed-account")
    userEvent.type(seedPhraseInput, seedPhrase)
    const saveBtn = screen.getByRole("button", { name: /save/i })
    fireEvent.click(saveBtn)
    await waitFor(() => {
      expect(
        within(activeAccountMenuTriggerBtn).getByText(/seed-account/i),
      ).toBeInTheDocument()
    })
  })

  it("should add an account via importing a PEM file", async () => {
    const pemFile = `
        -----BEGIN PRIVATE KEY-----
        MC4CAQAwBQYDK2VwBCIEIAGY5ZRRzlH/9MbLVyaGP/bWQsVUbFoubQ/yuLvswWul
        -----END PRIVATE KEY-----`

    const { activeAccountMenuTriggerBtn, formContainer, tabs } =
      await setupAddAccount()
    userEvent.click(within(tabs).getByText(/import/i))
    const withinForm = within(formContainer)

    const importPemBtn = screen.getByRole("button", { name: /import pem/i })
    fireEvent.click(importPemBtn)
    const saveBtn = screen.getByRole("button", { name: /save/i })
    const nameInput = screen.getByLabelText(/name/i)
    const pemInput = withinForm.getByLabelText(/pem file/i)
    userEvent.type(nameInput, "pem-account")
    userEvent.type(pemInput, pemFile)
    fireEvent.click(saveBtn)
    await waitFor(() => {
      expect(
        within(activeAccountMenuTriggerBtn).getByText(/pem-account/i),
      ).toBeInTheDocument()
    })
  })

  it("should remove an account", async function () {
    await setupEditAccount("to-be-removed")
    const container = screen.getByTestId("update-account-container")
    const addressToCopy =
      within(container).getByLabelText(/public address/i).textContent
    const removeBtn = screen.getByRole("button", { name: /remove account/i })
    const addressInput = within(container).getByRole("textbox", {
      name: /remove account/i,
    })
    expect(removeBtn).toBeDisabled()
    userEvent.type(addressInput, addressToCopy as string)
    expect(removeBtn).not.toBeDisabled()
    userEvent.click(removeBtn)
    expect(screen.queryByText(/to-be-removed/i)).not.toBeInTheDocument()
  })

  it("should edit account name", async () => {
    await setupEditAccount("to-be-renamed")
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
    nameInput.setSelectionRange(0, nameInput.value.length)
    userEvent.type(nameInput, "{backspace}is-renamed")
    expect(nameInput).toHaveValue("is-renamed")
    const saveBtn = screen.getByRole("button", { name: /save/i })
    userEvent.click(saveBtn)
    expect(screen.queryByText("to-be-renamed")).not.toBeInTheDocument()
    expect(screen.getByText("is-renamed")).toBeInTheDocument()
  })
})

function renderAccountsMenu() {
  render(<AccountsMenu />)
}

function openAccountsMenu() {
  const activeAccountMenuTriggerBtn = screen.getByRole("button", {
    name: /active account menu trigger/i,
  })
  fireEvent.click(activeAccountMenuTriggerBtn)
  return activeAccountMenuTriggerBtn
}

async function setupAddAccount() {
  renderAccountsMenu()
  const activeAccountMenuTriggerBtn = openAccountsMenu()
  const addAccountBtn = await screen.findByText(/add account/i)
  fireEvent.click(addAccountBtn)
  const formContainer = screen.getByTestId("add-account-form-container")
  const tabs = within(formContainer).getByRole("tablist")
  return {
    tabs,
    formContainer,
    activeAccountMenuTriggerBtn: activeAccountMenuTriggerBtn,
  }
}

async function setupEditAccount(accountName: string) {
  renderAccountsMenu()
  act(() =>
    useAccountsStore.setState(s => {
      return {
        ...s,
        activeId: 0,
        nextId: 1,
        byId: new Map([
          [0, { name: "Anonymous", identity: new AnonymousIdentity() }],
          [
            1,
            {
              name: accountName,
              identity: new Ed25519KeyPairIdentity(
                new ArrayBuffer(0),
                new ArrayBuffer(0),
              ),
            },
          ],
        ]),
      }
    }),
  )
  expect(screen.getByText(accountName)).toBeInTheDocument()
  openAccountsMenu()
  const editBtn = await screen.findAllByRole("button", {
    name: /edit account/i,
  })
  userEvent.click(editBtn[1])
}
