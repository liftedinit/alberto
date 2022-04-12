import React from "react"
import {
  Box,
  Container,
  Layout,
  SlideFade,
  Tab,
  Tabs,
  TabList,
} from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Symbols } from "./symbols"
import { AssetDetails } from "./asset-details"

import { displayId } from "helper/common"
import { Asset } from "features/balances"
import { TxnList } from "features/transactions"

enum TabNames {
  assets = "assets",
  activity = "activity",
}

export function Home() {
  const isBase = useIsBaseBreakpoint()
  const network = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const { full: accountPublicKey } = displayId(account!)
  const [asset, setAsset] = React.useState<Asset | undefined>(undefined)
  function onAssetClicked(asset: Asset) {
    setAsset(asset)
  }
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)

  function isTabActive(tab: TabNames) {
    return tab === activeTab
  }

  React.useEffect(() => {
    return () => {
      setActiveTab(TabNames.assets)
      setAsset(undefined)
    }
  }, [account, network])

  return (
    <>
      <Layout.Main py={2}>
        <Container
          maxW={{ base: "full", md: "container.sm" }}
          p={{ base: 0, md: 4 }}
        >
          <Box
            rounded="md"
            shadow="base"
            p={{ base: 2, md: 6 }}
            bgColor="white"
            position="relative"
          >
            {asset ? (
              <AssetDetails
                network={network}
                asset={asset}
                setAsset={setAsset}
                accountPublicKey={accountPublicKey}
              />
            ) : (
              <SlideFade in={true}>
                <Tabs
                  isFitted={isBase ? true : false}
                  colorScheme="brand.teal"
                  index={isTabActive(TabNames.assets) ? 0 : 1}
                  onChange={index =>
                    setActiveTab(
                      index === 0 ? TabNames.assets : TabNames.activity,
                    )
                  }
                  mb={3}
                >
                  <TabList>
                    <Tab fontWeight="medium">Assets</Tab>
                    <Tab fontWeight="medium">Activity</Tab>
                  </TabList>
                </Tabs>

                {isTabActive(TabNames.assets) && (
                  <SlideFade in={true}>
                    <Symbols
                      onAssetClicked={onAssetClicked}
                      network={network}
                      accountPublicKey={accountPublicKey}
                    />
                  </SlideFade>
                )}
                {isTabActive(TabNames.activity) && (
                  <SlideFade in={true}>
                    <TxnList
                      accountPublicKey={accountPublicKey}
                      network={network}
                    />
                  </SlideFade>
                )}
              </SlideFade>
            )}
          </Box>
        </Container>
      </Layout.Main>
    </>
  )
}
