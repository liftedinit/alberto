import { QueryClientProvider } from "react-query"
import { HashRouter } from "react-router-dom"
import { NetworkProvider } from "features/network"
import { UiKitProvder } from "components"
import { queryClient } from "lib/react-query"

type AppProviderProps = {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <UiKitProvder>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          <HashRouter>{children}</HashRouter>
        </NetworkProvider>
      </QueryClientProvider>
    </UiKitProvder>
  )
}