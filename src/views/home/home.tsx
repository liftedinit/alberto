import React from "react"
import {
  Box,
  Breadcrumb,
  Container,
  Layout,
  SlideFade,
  Tab,
  Tabs,
  TabList,
  useAddressText,
} from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Assets } from "./assets"
import { TxnList } from "features/transactions"

enum TabNames {
  assets = "assets",
  activity = "activity",
}

export function Home() {
  const isBase = useIsBaseBreakpoint()
  const [network] = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const address = useAddressText(account?.identity!)
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  React.useEffect(() => {
    return () => {
      setActiveTab(TabNames.assets)
    }
  }, [account, network])

  return (
    <Layout.Main>
      <SlideFade in>
        <Container maxW={{ base: "auto", md: "container.sm" }}>
          <Breadcrumb my={4}>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink to="/" isCurrentPage={true}>
                Wallet
              </Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb>
          <Box
            rounded="md"
            shadow="md"
            bgColor="white"
            position="relative"
            p={{ base: 2, md: 4 }}
          >
            <Tabs
              isFitted={isBase ? true : false}
              index={isTabActive(TabNames.assets) ? 0 : 1}
              mb={3}
              onChange={index =>
                setActiveTab(index === 0 ? TabNames.assets : TabNames.activity)
              }
            >
              <TabList>
                <Tab>{TabNames.assets}</Tab>
                <Tab>{TabNames.activity}</Tab>
              </TabList>
            </Tabs>

            {isTabActive(TabNames.assets) && <Assets address={address} />}
            {isTabActive(TabNames.activity) && (
              <SlideFade in>
                <TxnList address={address} />
              </SlideFade>
            )}
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
