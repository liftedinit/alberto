import { QueryClientProvider } from "react-query"
import { HashRouter } from "react-router-dom"
import { NetworkProvider } from "features/network"
import { UiKitProvder } from "components"
import { queryClient } from "lib/react-query"
import { Web3authProvider } from "features/accounts"

type AppProviderProps = {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <UiKitProvder>
      <QueryClientProvider client={queryClient}>
        <Web3authProvider>
          <NetworkProvider>
            <HashRouter>{children}</HashRouter>
          </NetworkProvider>
        </Web3authProvider>
      </QueryClientProvider>
    </UiKitProvder>
  )
}
