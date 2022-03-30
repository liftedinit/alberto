import React from "react";
import { ContainerWrapper, Layout, Tab, Tabs, TabList } from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Symbols } from "./symbols"

enum TabNames {
  assets = "assets",
  transactions = "transactions",
}

export function Home() {
  const isBase = useIsBaseBreakpoint()
  const network = useNetworkContext()
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)
  const account = useAccountsStore(s => s.byId.get(s.activeId))

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  function getTabStyles(tab: TabNames) {
    return {
      fontWeight: "medium",
      opacity: tab === activeTab ? 1 : 0.4,
    }
  }

  return (
    <>
      <Layout.Main py={2} px={{ base: 4, md: 0 }}>
        <ContainerWrapper position="relative">
          <Tabs
            isFitted={isBase ? true : false}
            colorScheme="brand.teal"
            index={isTabActive(TabNames.assets) ? 0 : 1}
            onChange={index =>
              setActiveTab(
                index === 0 ? TabNames.assets : TabNames.transactions,
              )
            }
            mb={4}
          >
            <TabList>
              <Tab {...getTabStyles(TabNames.assets)}>Assets</Tab>
              <Tab {...getTabStyles(TabNames.transactions)}>Transactions</Tab>
            </TabList>
          </Tabs>

          {isTabActive(TabNames.assets) && (
            <Symbols network={network} account={account} />
          )}
          {isTabActive(TabNames.transactions) && "history goes here"}
        </ContainerWrapper>
      </Layout.Main>
    </>
  )
}
