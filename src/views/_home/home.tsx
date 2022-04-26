import React from "react"
import {
  Box,
  Button,
  Container,
  Heading,
  Layout,
  SlideFade,
  Tab,
  Tabs,
  TabList,
} from "components"
import { useIsBaseBreakpoint } from "hooks"
import { useFetchLedgerInfo, useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { Symbols } from "./symbols"
import { AssetDetails } from "./asset-details"

import { displayId } from "helper/common"
import { Asset } from "features/balances"
import { TxnList } from "features/transactions"
import { arrayBufferToBase64 } from "helper/convert"

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

  const { mutate } = useFetchLedgerInfo({ network })

  React.useEffect(() => {
    return () => {
      setActiveTab(TabNames.assets)
      setAsset(undefined)
    }
  }, [account, network])

  // async function sign() {
  //   const res = await account?.identity?.sign(new ArrayBuffer(32))
  //   console.log({ res })
  // }
  // console.log(
  //   "rawId base64",
  //   // @ts-ignore
  //   account?.identity?.rawId
  //     ? // @ts-ignore
  //       arrayBufferToBase64(account.identity.rawId)
  //     : null,
  // )
  // console.log({ identity: account?.identity })

  // console.log({ accountPublicKey })

  return (
    <Layout.Main>
      <SlideFade in>
        <Container maxW={{ base: "full", md: "container.sm" }}>
          <Heading size="lg" mb={3}>
            Wallet
          </Heading>
          <Box
            rounded="md"
            shadow="md"
            bgColor="white"
            position="relative"
            p={{ base: 2, md: 4 }}
          >
            <Button
              onClick={() =>
                mutate(undefined, {
                  onSuccess: data => {
                    console.log("DATA >>>>>", data)
                  },
                  onError: err => {
                    console.log("ERROR >>>>>>.", err)
                  },
                })
              }
            >
              fetch
            </Button>
            {asset ? (
              <Box>
                <SlideFade in>
                  <AssetDetails
                    network={network}
                    asset={asset}
                    setAsset={setAsset}
                    accountPublicKey={accountPublicKey}
                  />
                </SlideFade>
              </Box>
            ) : (
              <SlideFade in>
                <Tabs
                  isFitted={isBase ? true : false}
                  colorScheme="brand.teal"
                  index={isTabActive(TabNames.assets) ? 0 : 1}
                  mb={3}
                  onChange={index =>
                    setActiveTab(
                      index === 0 ? TabNames.assets : TabNames.activity,
                    )
                  }
                >
                  <TabList>
                    <Tab fontWeight="medium">Assets</Tab>
                    <Tab fontWeight="medium">Activity</Tab>
                  </TabList>
                </Tabs>

                {isTabActive(TabNames.assets) && (
                  <SlideFade in>
                    {/* <Symbols
                      onAssetClicked={onAssetClicked}
                      network={network}
                      accountPublicKey={accountPublicKey}
                    /> */}
                  </SlideFade>
                )}
                {isTabActive(TabNames.activity) && (
                  <SlideFade in>
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
      </SlideFade>
    </Layout.Main>
  )
}
