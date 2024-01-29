import {
  screen,
  within,
  fireEvent,
  waitFor,
  render,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import {
  ANON_IDENTITY,
  AnonymousIdentity,
  Ed25519KeyPairIdentity,
} from "@liftedinit/many-js"
import userEvent from "@testing-library/user-event"
import { useAccountsStore } from "../../../stores"
import { act } from "react-dom/test-utils"
import { queryClient, QueryClientProvider, toast } from "@liftedinit/ui"
import { Web3authProvider } from "../../social-login"
import { AccountsMenu } from "../accounts-menu"

export const renderAccountMenu = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Web3authProvider>
        <AccountsMenu />
      </Web3authProvider>
    </QueryClientProvider>,
  )
}

export const openAddAccountModal = () => {
  // Get and click the account menu button
  const activeAccountButton = screen.getByTestId("accounts-menu-button")
  fireEvent.click(activeAccountButton)

  // Get and click the add account button
  const addAccountButton = screen.getByTestId("add wallet btn")
  fireEvent.click(addAccountButton)

  return activeAccountButton
}

class MockEd25519KeyPairIdentity extends Ed25519KeyPairIdentity {
  constructor(publicKey: ArrayBuffer, privateKey: ArrayBuffer) {
    super(publicKey, privateKey)
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
}

const setupMnemonicMock = () => {
  jest
    .spyOn(Ed25519KeyPairIdentity, "getMnemonic")
    .mockReturnValue(
      "one two three four five six seven eight nine ten eleven twelve",
    )

  jest.spyOn(Ed25519KeyPairIdentity, "fromMnemonic").mockImplementation(() => {
    const mockPublicKey = Buffer.from("mocked public key").buffer
    const mockPrivateKey = Buffer.from("mocked private key").buffer
    const mockIdentity = new MockEd25519KeyPairIdentity(
      mockPublicKey,
      mockPrivateKey,
    )

    mockIdentity.getAddress = jest.fn().mockReturnValue("mocked address")
    mockIdentity.sign = jest.fn()
    mockIdentity.verify = jest.fn()
    mockIdentity.toJSON = jest.fn()
    mockIdentity.getProtectedHeader = jest.fn()
    mockIdentity.getUnprotectedHeader = jest.fn()
    mockIdentity.getCoseKey = jest.fn()

    return mockIdentity
  })
}

const saveSeedPhraseAccount = async (name: string) => {
  // Get and click the create new seed phrase button
  const createNewSeedPhraseButton = screen.getByTitle("create new seed phrase")
  userEvent.click(createNewSeedPhraseButton)

  // Wait for the seed phrase to be displayed
  await waitFor(() => {
    expect(screen.getAllByLabelText("seed-word")).toHaveLength(12)
  })

  // Enter the account name
  const nameInput = screen.getByLabelText(/name/i)
  await userEvent.type(nameInput, name)

  // Click save button
  const saveBtn = screen.getByRole("button", { name: /save/i })
  userEvent.click(saveBtn)
}

const openImportTab = async () => {
  const formContainer = screen.getByTestId("add-account-form-container")
  const tabs = within(formContainer).getByRole("tablist")
  const importTab = within(tabs).getByText(/import/i)
  userEvent.click(importTab)

  return formContainer
}
const importSeedPhraseAccount = async () => {
  const formContainer = await openImportTab()

  await waitFor(() => {
    expect(
      within(formContainer).getByTitle(/import with seed phrase/i),
    ).toBeInTheDocument()
  })

  const importSeedWordsBtn = within(formContainer).getByTitle(
    /import with seed phrase/i,
  )
  userEvent.click(importSeedWordsBtn)

  await waitFor(() => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })
}

const importPemAccount = async () => {
  const formContainer = await openImportTab()

  await waitFor(() => {
    expect(
      within(formContainer).getByTitle(/import with pem file/i),
    ).toBeInTheDocument()
  })

  const importPemBtn = within(formContainer).getByTitle(/import with pem file/i)
  userEvent.click(importPemBtn)

  await waitFor(() => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })
}

function addMockAccountToStore(name: string, address: string) {
  act(() =>
    useAccountsStore.setState(s => {
      return {
        ...s,
        activeId: 0,
        nextId: 2,
        byId: new Map([
          [
            0,
            {
              address: ANON_IDENTITY,
              name: "Anonymous",
              identity: new AnonymousIdentity(),
            },
          ],
          [
            1,
            {
              address,
              name,
              identity: new MockEd25519KeyPairIdentity(
                new ArrayBuffer(0),
                new ArrayBuffer(0),
              ),
            },
          ],
        ]),
      }
    }),
  )
}

const removeAccount = async (name: string, address: string) => {
  const editAccountButton = screen.getByTestId(`edit-account-${name}`)
  fireEvent.click(editAccountButton)

  const removeAccountButton = screen.getByTestId("remove-account-btn")
  await waitFor(() => {
    expect(screen.getByTestId("update-account-container")).toBeInTheDocument()
  })
  expect(removeAccountButton).toBeDisabled()

  const removeInput = screen.getByTestId("remove-account-input")
  await userEvent.type(removeInput, address)
  expect(removeAccountButton).toBeEnabled()
  await userEvent.click(removeAccountButton)
}

const editAccountName = async (name: string, modifier: string) => {
  const editAccountButton = screen.getByTestId(`edit-account-${name}`)
  fireEvent.click(editAccountButton)

  const nameInput = screen.getByTestId("update-account-name-input")
  expect(nameInput).toHaveValue(name)
  await userEvent.type(nameInput, modifier)
  expect(nameInput).toHaveValue(name + modifier)

  const saveBtn = screen.getByRole("button", { name: /save/i })
  await userEvent.click(saveBtn)
}

describe("AccountsMenu Tests", () => {
  beforeEach(async () => {
    toast.closeAll()
    const toasts = screen.queryAllByRole("listitem")
    await Promise.all(toasts.map(toasts => waitForElementToBeRemoved(toasts)))

    jest.resetModules()
    jest.clearAllMocks()
  })

  it("should render the account menu", () => {
    renderAccountMenu()
    expect(screen.getByTestId("accounts-menu-button")).toBeInTheDocument()
    expect(screen.getByTestId("accounts-menu-list")).toBeInTheDocument()
  })

  it("should render the account menu with Anonymous active account", () => {
    renderAccountMenu()
    const activeAccountButton = screen.getByTestId("accounts-menu-button")
    expect(
      within(activeAccountButton).getByText(/anonymous/i),
    ).toBeInTheDocument()
  })

  it("should add a new seed phase account", async () => {
    setupMnemonicMock()
    renderAccountMenu()
    const activeAccountButton = openAddAccountModal()
    const name = "new-account"

    await saveSeedPhraseAccount(name)

    await waitFor(() => {
      expect(within(activeAccountButton).getByText(name)).toBeInTheDocument()
    })
  })

  it("should import a seed phrase account", async () => {
    renderAccountMenu()
    openAddAccountModal()

    await importSeedPhraseAccount()

    expect(screen.getByTestId("seed-words-name-input")).not.toBe(null)
    expect(screen.getByTestId("seed-words-input")).not.toBe(null)
    expect(screen.getByRole("button", { name: /save/i })).not.toBe(null)
  })

  it("should import a pem file account", async () => {
    renderAccountMenu()
    openAddAccountModal()

    await importPemAccount()

    expect(screen.getByTestId("pem-name-input")).not.toBe(null)
    expect(screen.getByTestId("pem-input")).not.toBe(null)
    expect(screen.getByRole("button", { name: /save/i })).not.toBe(null)
  })

  it("should remove an account", async () => {
    const name = "mocked_account_1"
    const address = "mocked_address_1"
    renderAccountMenu()
    addMockAccountToStore(name, address)
    expect(screen.getByText(name)).toBeInTheDocument()
    const activeAccountButton = openAddAccountModal()

    await removeAccount(name, address)

    await waitFor(() =>
      expect(
        within(activeAccountButton).queryByText(name),
      ).not.toBeInTheDocument(),
    )
  })

  it("should edit account name", async () => {
    const name = "mocked_account_1"
    const modifier = "-foobar"
    const modifiedName = name + modifier
    const address = "mocked_address_1"
    renderAccountMenu()
    addMockAccountToStore(name, address)
    expect(screen.getByText(name)).toBeInTheDocument()
    openAddAccountModal()

    await editAccountName(name, modifier)

    expect(screen.queryByText(name)).not.toBeInTheDocument()
    expect(screen.getByText(modifiedName)).toBeInTheDocument()
  })
})
