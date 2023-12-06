import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  Network,
  Ledger,
  AnonymousIdentity,
  IdStore,
  Account,
  Base,
  Events,
} from "@liftedinit/many-js"
import { useNetworkStore } from "./store"
import { useAccountsStore } from "features/accounts"

export interface INetworkContext {
  query?: Network
  command?: Network
  legacy?: Network[] // Legacy networks are past networks that are no longer active. They are used to query for past events.
  services: Set<string>
}

export const NetworkContext = createContext<INetworkContext>({
  services: new Set(),
})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const network = useNetworkStore().getActiveNetwork()
  const legacy_networks = useNetworkStore().getLegacyNetworks()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const [services, setServices] = useState<Set<string>>(new Set())

  const url = network.url
  const legacy_urls = legacy_networks?.map(n => n.url)

  const context = useMemo(() => {
    const anonymous = new AnonymousIdentity()
    const identity = account?.identity ?? anonymous

    const query = new Network(url, anonymous)
    query.apply([Ledger, IdStore, Account, Events, Base])

    const legacy = legacy_urls?.map(url => {
      const n = new Network(url, anonymous)
      n.apply([Account, Events])
      return n
    })

    const command = new Network(url, identity)
    command.apply([Ledger, IdStore, Account])

    return { query, command, legacy, services }
  }, [account, url, legacy_urls, services])

  useEffect(() => {
    async function updateServices() {
      if (!context.query || !context.query.base) {
        return
      }
      const updated = new Set<string>()
      try {
        const { endpoints } = await context.query.base.endpoints()
        endpoints
          .map((endpoint: string) => endpoint.split(".")[0])
          .forEach((service: string) => updated.add(service))
      } catch (error) {
        console.error(`Couldn't update services: ${(error as Error).message}`)
      }
      setServices(updated)
    }
    updateServices()
    // eslint-disable-next-line
  }, [url])

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetworkContext = () => useContext(NetworkContext)
