import React from "react"
import { FiChevronDown } from "react-icons/fi"
import {
  Button,
  ButtonProps,
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
} from "components"
import cubeImg from "assets/cube.png"
import { useDebounce } from "hooks"
import { Asset } from "features/balances"

export function AssetSelector({
  ownedAssets,
  allAssets,
  onChange,
  children,
  ...props
}: Omit<ButtonProps, "onChange"> & {
  ownedAssets: { identity: string; balance: bigint; symbol: string }[]
  allAssets: { identity: string; balance: bigint; symbol: string }[]
  onChange: (asset: Asset) => void
}) {
  const { isOpen, onClose, onToggle } = useDisclosure()
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
                onChange(asset)
                onClose()
              }}
            >
              <HStack
                alignItems="center"
                justifyContent="space-between"
                w="full"
              >
                <HStack>
                  <Image src={cubeImg} borderRadius="full" boxSize={9} />
                  <VStack alignItems="flex-start" spacing={0}>
                    <Text fontSize="lg" lineHeight="normal">
                      {asset.symbol}
                    </Text>
                    <Text fontSize="xs" lineHeight="normal" fontWeight="light">
                      Asset Full Name
                    </Text>
                  </VStack>
                </HStack>
                <Text whiteSpace="nowrap" overflow="hidden" isTruncated>
                  {asset.balance?.toLocaleString() || "0"}
                </Text>
              </HStack>
            </ListItem>
          )
        })}
      </List>
    )
  }, [visibleAssets])

  return (
    <>
      <Button
        rightIcon={<FiChevronDown />}
        aria-label="select token"
        onClick={onToggle}
        lineHeight="normal"
        px={2}
        bgColor="white"
        shadow="base"
        fontSize="lg"
        {...props}
      >
        {children}
      </Button>
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
          <Tabs
            colorScheme="brand.teal"
            isFitted
            onChange={idx => setTabIdx(idx)}
            index={tabIdx}
          >
            <TabList mb={3}>
              <Tab fontWeight="medium">Owned Assets</Tab>
              <Tab fontWeight="medium">All Assets</Tab>
            </TabList>
            {AssetsList}
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  )
}
