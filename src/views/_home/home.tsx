import React from "react";
import {
  AppMenu,
  Button,
  ContainerWrapper,
  Center,
  HStack,
  Layout,
  Spinner,
  Text,
  Tab,
  Tabs,
  TabList,
} from "components";
import { useIsBaseBreakpoint } from "hooks";
import { useNetworkContext } from "features/network";
import { Symbols } from "./symbols";
import { useLedgerInfo } from "features/network";
import { useBalances } from "features/balances";

enum TabNames {
  symbols = "symbols",
  history = "history",
}

export function Home() {
  const isBase = useIsBaseBreakpoint();
  const network = useNetworkContext();
  const [activeTab, setActiveTab] = React.useState<TabNames>(TabNames.symbols);
  console.log({ isBase, activeTab });

  const ledgerInfoQuery = useLedgerInfo(network);
  const { data: symbolsData, isFetching } = ledgerInfoQuery;

  const symbolsArr = symbolsData?.symbols
    ? Array.from(symbolsData?.symbols?.entries())
    : null;

  const onlySymbolNames = symbolsArr
    ? symbolsArr.map(([, symbolName]) => symbolName)
    : undefined;

  console.log({ onlySymbolNames });

  const balancesQuery = useBalances(onlySymbolNames);
  console.log({ balancesQuery });

  function isTabActive(tab: TabNames) {
    return tab === activeTab;
  }

  function getButtonStyles(tab: TabNames) {
    const isActive = isTabActive(tab);
    return {
      h: "100%",
      isFullWidth: true,
      rounded: 0,
      onClick: () => setActiveTab(tab),
      opacity: isActive ? 1 : 0.4,
      colorScheme: isActive ? "green" : "gray",
    };
  }

  const symbolsWithBalance = onlySymbolNames?.map((symbolName) => {
    return {
      name: symbolName,
      balance: "0",
    };
  });

  return (
    <Layout withMenu={false}>
      <Layout.Main py={4} px={8}>
        <ContainerWrapper>
          {isFetching && (
            <Center left={0} right={0} position="absolute">
              <Spinner />
            </Center>
          )}

          {!isBase && (
            <Tabs
              colorScheme="green"
              index={isTabActive(TabNames.symbols) ? 0 : 1}
              onChange={(index) =>
                setActiveTab(index === 0 ? TabNames.symbols : TabNames.history)
              }
              mb={4}
            >
              <TabList>
                <Tab
                  fontWeight={isTabActive(TabNames.symbols) ? "bold" : "normal"}
                >
                  Symbols
                </Tab>
                <Tab
                  fontWeight={isTabActive(TabNames.history) ? "bold" : "normal"}
                >
                  History
                </Tab>
              </TabList>
            </Tabs>
          )}

          {isTabActive(TabNames.symbols) && (
            <Symbols symbolsWithBalance={symbolsWithBalance} />
          )}
          {isTabActive(TabNames.history) && "history goes here"}
        </ContainerWrapper>
      </Layout.Main>

      <Layout.Menu>
        {isBase && (
          <HStack justify="space-evenly" spacing={0} h="48px">
            <Button {...getButtonStyles(TabNames.symbols)}>
              <Text fontWeight="semibold" casing="uppercase" fontSize="lg">
                symbols
              </Text>
            </Button>
            <Button {...getButtonStyles(TabNames.history)}>
              <Text fontWeight="semibold" casing="uppercase" fontSize="lg">
                history
              </Text>
            </Button>
          </HStack>
        )}
        <AppMenu />
      </Layout.Menu>
    </Layout>
  );
}
