import React from "react"
import {
  Button,
  Box,
  Divider,
  HStack,
  Image,
  Input,
  List,
  ListItem,
  Modal,
  Tab,
  Tabs,
  TabList,
  Text,
  useDisclosure,
  VStack,
  cubePng,
  useDebounce,
  amountFormatter,
} from "@liftedinit/ui"
import { Asset } from "features/balances"

export function AssetSelector({
  ownedAssets,
  allAssets,
  onAssetClicked,
  children,
}: {
  ownedAssets: { identity: string; balance: bigint; symbol: string }[]
  allAssets: { identity: string; balance: bigint; symbol: string }[]
  children: (onOpen: () => void) => React.ReactNode
  onAssetClicked: (asset: Asset) => void
}) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [tabIdx, setTabIdx] = React.useState(0)
  const debouncedSearchTerm = useDebounce(searchTerm)

  const visibleAssets = React.useMemo(() => {
    const assets = tabIdx === 0 ? ownedAssets : allAssets
    return assets.filter(a =>
      debouncedSearchTerm
        ? a.symbol
            .toLocaleLowerCase()
            .startsWith(debouncedSearchTerm.toLocaleLowerCase())
        : true,
    )
  }, [debouncedSearchTerm, ownedAssets, allAssets, tabIdx])

  const AssetsList = React.useMemo(() => {
    return (
      <List spacing={3} mb={1}>
        {visibleAssets?.map(asset => {
          return (
            <ListItem
              key={asset.identity}
              as={Button}
              isFullWidth
              variant="ghost"
              justifyContent="flex-start"
              aria-label="select asset"
              h="auto"
              p={2}
              onClick={() => {
                onAssetClicked(asset)
                onClose()
              }}
            >
              <HStack
                alignItems="center"
                justifyContent="space-between"
                w="full"
              >
                <HStack>
                  <Image src={cubePng} borderRadius="full" boxSize={9} />
                  <VStack alignItems="flex-start" spacing={0}>
                    <Text fontSize="lg" lineHeight="normal">
                      {asset.symbol}
                    </Text>
                  </VStack>
                </HStack>
                <Text whiteSpace="nowrap" overflow="hidden" isTruncated>
                  {amountFormatter(asset.balance)}
                </Text>
              </HStack>
            </ListItem>
          )
        })}
      </List>
    )
  }, [visibleAssets, onAssetClicked, onClose])

  return (
    <>
      {children(onOpen)}
      <Modal
        header="Select an asset"
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        scrollBehavior="inside"
      >
        <Modal.Body>
          <Box>
            <Input
              name="assetNameFilter"
              id="assetNameFilter"
              variant="filled"
              placeholder="Search name"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Box>
          <Divider mt={4} mb={3} />
          <Tabs isFitted onChange={idx => setTabIdx(idx)} index={tabIdx}>
            <TabList mb={3}>
              {ownedAssets && <Tab>Owned Assets</Tab>}
              {allAssets && <Tab>All Assets</Tab>}
            </TabList>
            {AssetsList}
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  )
}
