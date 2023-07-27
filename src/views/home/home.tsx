import {
  Box,
  Breadcrumb,
  Button,
  Container,
  PlusIcon,
  SlideFade,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  useIsBaseBreakpoint,
} from "@liftedinit/ui"
import { Layout } from "views"
import { useAccountsStore } from "features/accounts"
import { useNetworkContext } from "features/network"
import { TxnList } from "features/transactions"
import React from "react"

import { AnonymousIdentity } from "@liftedinit/many-js"

import { Assets } from "./assets"
import { UseDisclosureProps } from "@chakra-ui/hooks/src/use-disclosure"

enum TabNames {
  assets = "Assets",
  activity = "Activity",
}

export function Home(props: { modalDisclosure?: UseDisclosureProps }) {
  const onOpenAddAccount = props.modalDisclosure?.onOpen || (() => {})
  const isBase = useIsBaseBreakpoint()
  const [network] = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const address = account?.address ?? ""
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.assets)
  const isAnonymous = account?.identity instanceof AnonymousIdentity

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
              isFitted={isBase}
              index={isTabActive(TabNames.assets) ? 0 : 1}
              mb={3}
              onChange={index =>
                setActiveTab(index === 0 ? TabNames.assets : TabNames.activity)
              }
            >
              <TabList>
                <Tab isDisabled={isAnonymous}>{TabNames.assets}</Tab>
                <Tab isDisabled={isAnonymous}>{TabNames.activity}</Tab>
              </TabList>
            </Tabs>

            {isAnonymous ? (
              <>
                <VStack flexDir="column" my={10} spacing={4}>
                  <Text fontWeight="medium">
                    Create or add your account to begin.
                  </Text>

                  <Button
                    onClick={onOpenAddAccount}
                    leftIcon={<PlusIcon />}
                    colorScheme="brand.teal"
                  >
                    Add Account
                  </Button>
                </VStack>
              </>
            ) : (
              <SlideFade in key={activeTab}>
                {isTabActive(TabNames.assets) && <Assets address={address} />}
                {isTabActive(TabNames.activity) && (
                  <TxnList address={address} />
                )}
              </SlideFade>
            )}
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
