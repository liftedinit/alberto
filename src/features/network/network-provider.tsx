import React from "react";
import { Network } from "many-js";
import { useNetworkStore } from "./store";
import { useAccountsStore } from "features/accounts";

const NetworkContext = React.createContext<Network | undefined>(undefined);

export function NetworkProvider({ children }: React.PropsWithChildren<{}>) {
  const activeNetwork = useNetworkStore((state) =>
    state.byId.get(state.activeId)
  );
  const activeAccount = useAccountsStore(state =>
    state.byId.get(state.activeId),
  )

  const network = React.useMemo(() => {
    return new Network(
      activeNetwork?.url || "",
      activeAccount?.keys || undefined,
    )
  }, [activeNetwork, activeAccount])
  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  return React.useContext(NetworkContext);
}
