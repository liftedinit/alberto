import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  within,
} from "test/test-utils"
import { NetworkMenu } from "../network-menu"

jest.setTimeout(20 * 1000)

describe("NetworkMenu", () => {
  afterEach(cleanup)

  it("should render with default manifest network", () => {
    render(<NetworkMenu />)
    expect(screen.getAllByText(/manifest/i).length).toBe(3)
  })

  it("should create a new network", async () => {
    const activeNetwork = setupNetworkMenu()
    await createNetwork("test-network", "test-network/api")
    expect(within(activeNetwork).getByText("test-network")).toBeInTheDocument()
  })

  it("should remove a network", async () => {
    setupNetworkMenu()

    // Create and remove a new network
    await createNetwork("test-network", "test-network/api")
    await removeNetwork("test-network/api")
    expect(screen.queryByText(/test-network/i)).not.toBeInTheDocument()
  })

  it("should edit a network", async () => {
    const activeNetwork = setupNetworkMenu()

    // Create a new network
    await createNetwork("test-network", "test-network/api")

    // Edit network
    await editNetwork("-edited", "-edited")
    expect(
      within(activeNetwork).getByText(/test-network-edited/i),
    ).toBeInTheDocument()
  })
})

function setupNetworkMenu() {
  render(<NetworkMenu />)
  const activeNetwork = screen.getByLabelText("active network menu trigger")
  userEvent.click(activeNetwork)
  return activeNetwork
}

async function createNetwork(name: string, url: string) {
  const addNewBtn = await screen.findAllByRole("button", {
    name: /add network/i,
  })
  userEvent.click(addNewBtn[0])

  const { saveBtn, nameInput, urlInput } = getFormElements()

  userEvent.type(nameInput, name)
  userEvent.type(urlInput, url)
  userEvent.click(saveBtn)
}

function getFormElements() {
  const modal = screen.getByTestId("network-create-update-contents")
  const saveBtn = within(modal).getByText(/save/i)
  const form = within(modal).getByTestId("create-update-network-form")

  const nameInput = within(form).getByLabelText(/name/i)
  const urlInput = within(form).getByLabelText(/url/i)

  return { saveBtn, nameInput, urlInput }
}

async function getEditButton() {
  return (await screen.findAllByRole("button", { name: /edit network/i }))[0]
}

async function removeNetwork(removeInputValue: string) {
  const editBtn = await getEditButton()
  fireEvent.click(editBtn)
  const removeInput = screen.getByLabelText(/remove network/i)
  const removeBtn = screen.getByTestId("remove network button")
  userEvent.type(removeInput, removeInputValue)
  userEvent.click(removeBtn)
}

async function editNetwork(newName: string, newUrl: string) {
  const editBtn = await getEditButton()
  fireEvent.click(editBtn)
  const newNameInput = screen.getByLabelText(/name/i)
  const newUrlInput = screen.getByLabelText(/url/i)
  const newSaveBtn = screen.getByRole("button", { name: /save/i })
  userEvent.type(newNameInput, newName)
  userEvent.type(newUrlInput, newUrl)
  userEvent.click(newSaveBtn)
}
