import React from "react";
import { ContainerWrapper, Layout, Tab, Tabs, TabList } from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Symbols } from "./symbols"

enum TabNames {
  balance = "balance",
  history = "history",
}

export function Home() {
  const isBase = useIsBaseBreakpoint()
  const network = useNetworkContext()
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.balance)
  const account = useAccountsStore(s => s.byId.get(s.activeId))

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  return (
    <>
      <Layout.Main py={2} px={{ base: 4, md: 0 }}>
        <ContainerWrapper position="relative">
          <Tabs
            isFitted={isBase ? true : false}
            colorScheme="brand.teal"
            variant={isBase ? "enclosed" : "line"}
            index={isTabActive(TabNames.balance) ? 0 : 1}
            onChange={index =>
              setActiveTab(index === 0 ? TabNames.balance : TabNames.history)
            }
            mb={4}
          >
            <TabList>
              <Tab
                fontWeight={isTabActive(TabNames.balance) ? "bold" : "normal"}
              >
                Balance
              </Tab>
              <Tab
                fontWeight={isTabActive(TabNames.history) ? "bold" : "normal"}
              >
                History
              </Tab>
            </TabList>
          </Tabs>

          {isTabActive(TabNames.balance) && (
            <Symbols network={network} account={account} />
          )}
          {isTabActive(TabNames.history) && "history goes here"}
        </ContainerWrapper>
      </Layout.Main>
    </>
  )
}
