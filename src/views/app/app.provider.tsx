import { HashRouter } from "react-router-dom"
import {
  QueryClientProvider,
  ThemeProvider,
  queryClient,
  theme,
} from "@liftedinit/ui"
import { NetworkProvider } from "features/network"
import { Web3authProvider } from "features/accounts"

type AppProviderProps = {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Web3authProvider>
          <NetworkProvider>
            <HashRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              {children}
            </HashRouter>
          </NetworkProvider>
        </Web3authProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
