import { renderChildren } from "../../../../../test/render"
import { NetworkMenu } from "../network-menu"
import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"

jest.mock("@liftedinit/ui", () => {
  const originalModule = jest.requireActual("@liftedinit/ui")
  return {
    ...originalModule,
    toast: jest.fn(),
  }
})

const clickButton = async (buttonName: string) => {
  const button = await screen.findAllByRole("button", {
    name: new RegExp(buttonName, "i"),
  })
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => await userEvent.click(button[0]))
}

const typeInput = async (label: string, value: string) => {
  const input = screen.getByLabelText(new RegExp(label, "i"))
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => await userEvent.type(input, value))
}

const createNetwork = async (name: string, url: string) => {
  await clickButton("active network menu trigger")
  await clickButton("add network")
  await typeInput("name", name)
  await typeInput("url", url)
  await clickButton("save")
  return screen.getByLabelText("active network menu trigger")
}

const editNetwork = async (newName: string, newUrl: string) => {
  await clickButton("active network menu trigger")
  await clickButton("edit network")
  await typeInput("name", newName)
  await typeInput("url", newUrl)
  await clickButton("save")
}

const removeNetwork = async (removeInputValue: string) => {
  await clickButton("active network menu trigger")
  await clickButton("edit network")
  await typeInput("remove network", removeInputValue)
  await clickButton("remove")
}

describe("NetworkMenu", () => {
  // afterEach(cleanup)
  it("should render with default manifest network", () => {
    renderChildren(<NetworkMenu />)
    expect(screen.getAllByText(/manifest/i).length).toBe(3)
  })
  it("should create a new network", async () => {
    renderChildren(<NetworkMenu />)
    const activeNetwork = await createNetwork(
      "test-network",
      "test-network/api",
    )
    expect(within(activeNetwork).getByText("test-network")).toBeInTheDocument()
  })
  it("should edit a network", async () => {
    renderChildren(<NetworkMenu />)
    const activeNetwork = await createNetwork(
      "test-network-2",
      "test-network-2/api",
    )
    await editNetwork("-edited", "-edited")
    expect(
      within(activeNetwork).getByText(/test-network-2-edited/i),
    ).toBeInTheDocument()
  })
  it("should remove a network", async () => {
    renderChildren(<NetworkMenu />)
    const activeNetwork = await createNetwork(
      "test-network-3",
      "test-network-3/api",
    )
    await removeNetwork("test-network-3/api")
    expect(
      within(activeNetwork).queryByText(/test-network-3/i),
    ).not.toBeInTheDocument()
  })
})
