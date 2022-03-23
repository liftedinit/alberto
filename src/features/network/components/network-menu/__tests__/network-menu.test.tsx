import {
  render,
  screen,
  fireEvent,
  within,
  waitForElementToBeRemoved,
} from "test/test-utils"
import { NetworkMenu } from "../network-menu"

describe("NetworkMenu", () => {
  it("should render with default localhost network", () => {
    render(<NetworkMenu />)
    // network shows in the menu trigger and the all networks menu
    expect(screen.getAllByText(/localhost/i).length).toBe(2)
  })
  it("should create a new network", async () => {
    render(<NetworkMenu />)
    const activeNetwork = screen.getByTestId("active-network-menu-trigger")
    const addNewBtn = screen.getByText(/add network/i)
    fireEvent.click(addNewBtn)

    // modal with form and save btn should exist
    const modal = screen.getByTestId("network-create-update-contents")
    const saveBtn = within(modal).getByText(/save/i)
    const form = within(modal).getByTestId("create-update-network-form")
    expect(modal).toBeInTheDocument()
    expect(form).toBeInTheDocument()
    expect(saveBtn).toBeInTheDocument()

    // name and url input fields should exist
    const nameInput = within(form).getByLabelText(/name/i)
    const urlInput = within(form).getByLabelText(/url/i)
    expect(nameInput).toBeInTheDocument()
    expect(urlInput).toBeInTheDocument()

    // set network name and url and click save to create new
    fireEvent.change(nameInput, { target: { value: "test-network" } })
    fireEvent.change(urlInput, { target: { value: "test-network/api" } })
    fireEvent.click(saveBtn)
    await waitForElementToBeRemoved(modal)
    // modal should be gone and new active network is visible
    expect(modal).not.toBeInTheDocument()
    expect(within(activeNetwork).getByText("test-network")).toBeInTheDocument()
  })
  it("should remove a network", async () => {
    render(<NetworkMenu />)
    const editBtn = screen.getByText(/edit/i)
    fireEvent.click(editBtn)
    const modal = screen.getByTestId("network-create-update-contents")
    // we are now updating the network
    expect(within(modal).getByText(/update network/i)).toBeInTheDocument()
    expect(modal).toBeInTheDocument()

    // remove network button and input should exist
    const removeInput = within(modal).getByLabelText(/remove network/i)
    const removeBtn = within(modal).getByTestId("remove-network-btn")
    expect(removeInput).toBeInTheDocument()
    expect(removeBtn).toBeInTheDocument()
    // button is disabled first
    expect(removeBtn).toHaveAttribute("disabled")

    // populate the input with the correct URL
    fireEvent.change(removeInput, { target: { value: "/api" } })
    expect(removeBtn).not.toHaveAttribute("disabled")
    fireEvent.click(removeBtn)
    await waitForElementToBeRemoved(modal)
    expect(screen.queryByText(/localhost/i)).not.toBeInTheDocument()
    // we've removed all the networks
    expect(screen.getByText(/no network selected/i)).toBeInTheDocument()
  })
})
