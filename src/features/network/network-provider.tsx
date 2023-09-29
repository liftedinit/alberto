import React, { createContext, ReactNode, useContext, useMemo } from "react"
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
}

export const NetworkContext = createContext<INetworkContext>({})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const network = useNetworkStore().getActiveNetwork()
  const legacy_networks = useNetworkStore().getLegacyNetworks()
  const account = useAccountsStore(s => s.byId.get(s.activeId))

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

    return { query, command, legacy }
  }, [account, url, legacy_urls])

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetworkContext = () => useContext(NetworkContext)
