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

enum TabNames {
  assets = "assets",
  activity = "activity",
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
      {activeTabName === TabNames.assets && (
        <Assets
          address={accountAddress as string}
          accountAddress={accountAddress}
        />
      )}
      {activeTabName === TabNames.activity && (
        <SlideFade in>
          <TxnList address={accountAddress as string} />
        </SlideFade>
      )}
      {activeTabName === TabNames.accountSettings && (
        <SlideFade in>
          <AccountInfo
            accountInfo={data?.accountInfo}
            address={accountAddress}
          />
        </SlideFade>
      )}
    </Box>
  )
}
