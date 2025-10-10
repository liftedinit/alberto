import {
  queryClient,
  QueryClientProvider,
  theme,
  ThemeProvider,
} from "@liftedinit/ui"
import { Web3authProvider } from "../features/accounts"
import { MemoryRouter } from "react-router-dom"
import { render } from "@testing-library/react"

export const renderChildren = (
  children: JSX.Element,
  initialEntries?: string[],
) => {
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Web3authProvider>
          <MemoryRouter
            initialEntries={initialEntries}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {children}
          </MemoryRouter>
        </Web3authProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}
