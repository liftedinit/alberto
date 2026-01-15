import { theme, ThemeProvider } from "@liftedinit/ui"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Web3authProvider } from "../features/accounts"
import { MemoryRouter } from "react-router-dom"
import { render } from "@testing-library/react"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

let activeQueryClient: QueryClient | null = null

export const renderChildren = (
  children: JSX.Element,
  initialEntries?: string[],
) => {
  // Clean up previous client if exists
  if (activeQueryClient) {
    activeQueryClient.clear()
  }
  activeQueryClient = createTestQueryClient()
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={activeQueryClient}>
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

// Export for cleanup in tests
export const cleanupQueryClient = () => {
  if (activeQueryClient) {
    activeQueryClient.clear()
    activeQueryClient = null
  }
}
