import React from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  SlideFade,
  Tabs,
  TabList,
  Tab,
  usePageContainerProvider,
} from "components"
import { Assets } from "views/home/assets"
import { TxnList } from "features/transactions"
import { AccountInfo, useGetAccountInfo } from "features/accounts"
import { MultisigSettings } from "../multisig-settings/multisig-settings"

enum TabNames {
  assets = "assets",
  activity = "activity",
  multisigSettings = "multisig settings",
  accountSettings = "account settings",
}
const tabs = Object.values(TabNames)

export function AccountDetails() {
  const { accountAddress } = useParams()

  const [activeTabIdx, setActiveTabIdx] = React.useState(0)
  const activeTabName = tabs[activeTabIdx]
  const [, setContainerProps] = usePageContainerProvider()
  const { data } = useGetAccountInfo(accountAddress)

  React.useLayoutEffect(() => {
    setContainerProps({
      w: { base: "full" },
    })
  }, [setContainerProps])

  return (
    <Box pb={4} w="full">
      <Tabs mb={3} index={activeTabIdx} onChange={setActiveTabIdx}>
        <TabList>
          {tabs.map(tab => {
            return <Tab key={tab}>{tab}</Tab>
          })}
        </TabList>
      </Tabs>
      <Box position="relative">
        <SlideFade in key={activeTabName}>
          {activeTabName === TabNames.assets && (
            <Assets
              address={accountAddress as string}
              accountAddress={accountAddress}
            />
          )}
          {activeTabName === TabNames.activity && (
            <TxnList address={accountAddress as string} />
          )}

          {activeTabName === TabNames.multisigSettings && (
            <MultisigSettings accountAddress={accountAddress} />
          )}
          {activeTabName === TabNames.accountSettings && (
            <Box mt={4}>
              <AccountInfo
                accountInfo={data?.accountInfo}
                address={accountAddress}
              />
            </Box>
          )}
        </SlideFade>
      </Box>
    </Box>
  )
}
