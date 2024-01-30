import { queryClient, QueryClientProvider } from "@liftedinit/ui"
import { Web3authProvider } from "../features/accounts"
import { MemoryRouter } from "react-router-dom"
import { render } from "@testing-library/react"

export const renderChildren = (children: JSX.Element) => {
  render(
    <QueryClientProvider client={queryClient}>
      <Web3authProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </Web3authProvider>
    </QueryClientProvider>,
  )
}
