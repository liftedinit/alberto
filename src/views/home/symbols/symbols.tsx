import React from "react"
import {
  Button,
  Center,
  HStack,
  Icon,
  Image,
  SendOutlineIcon,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  useBreakpointValue,
} from "components"
import { Asset, useBalances } from "features/balances"
import { SendAssetModal } from "features/transactions"
import cubeImg from "assets/cube.png"
import { amountFormatter } from "helper/common"

export function Symbols({
  address,
  onAssetClicked,
  accountAddress,
  renderAssetListItem,
}: {
  address: string
  onAssetClicked: (asset: Asset) => void
  accountAddress?: string
  renderAssetListItem?: () => React.ReactNode
}) {
  const { isOpen: isSendAssetModalOpen, onOpen, onClose } = useDisclosure()
  const { data, isError, isLoading, errors } = useBalances({
    address,
  })
  const [assetAddress, setAssetAddress] = React.useState("")

  React.useEffect(() => {
    !isSendAssetModalOpen && setAssetAddress("")
  }, [isSendAssetModalOpen])

  if (isError) {
    return (
      <Stack flexDir="column">
        {errors.length > 0 ? (
          errors.map((e, idx) => (
            <Text key={idx} wordBreak="break-word">
              {typeof e === "string"
                ? e
                : JSON.stringify(e, Object.getOwnPropertyNames(e))}
            </Text>
          ))
        ) : (
          <Text>An unexpected error occurred.</Text>
        )}
      </Stack>
    )
  }

  if (data.ownedAssetsWithBalance.length === 0 && !isLoading) {
    return (
      <Center>
        <Text fontSize="lg">There are no assets available.</Text>
      </Center>
    )
  }

  return (
    <>
      {isLoading ? (
        <Center position="absolute" left={0} right={0}>
          <Spinner size="lg" />
        </Center>
      ) : null}

      <Stack spacing={0} divider={<StackDivider />}>
        {data.ownedAssetsWithBalance.map(asset => {
          return renderAssetListItem ? (
            renderAssetListItem()
          ) : (
            <AssetListItem
              key={asset.identity}
              asset={asset}
              address={address}
              onAssetClicked={onAssetClicked}
              onSendClicked={(address: string) => {
                setAssetAddress(address)
                onOpen()
              }}
            />
          )
        })}
      </Stack>
      {isSendAssetModalOpen && (
        <SendAssetModal
          isOpen={isSendAssetModalOpen}
          onClose={onClose}
          address={address}
          assetAddress={assetAddress}
          accountAddress={accountAddress}
          onSuccess={onClose}
        />
      )}
    </>
  )
}

function AssetListItem({
  asset,
  onAssetClicked,
  onSendClicked,
}: {
  asset: Asset
  address: string
  onAssetClicked: (asset: Asset) => void
  onSendClicked?: (assetAddress: string) => void
}) {
  const [showActions, setShowActions] = React.useState(false)
  const toggleShowSend = useBreakpointValue({
    base: undefined,
    md: (show: boolean) => setShowActions(show),
  })

  return (
    <HStack
      spacing={4}
      overflow="hidden"
      alignItems="center"
      onMouseEnter={() => toggleShowSend?.(true)}
      onMouseLeave={() => toggleShowSend?.(false)}
      cursor="pointer"
      aria-label="asset list item"
      onClick={() => onAssetClicked(asset)}
      py={1}
      px={3}
      _hover={{
        bgColor: "gray.50",
      }}
    >
      <Image src={cubeImg} boxSize={10} />
      <HStack overflow="hidden" alignItems="center" flexGrow={1}>
        <Text
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          fontSize="xl"
          fontWeight="medium"
        >
          {amountFormatter(asset.balance)}
        </Text>
        <Text fontSize="lg" casing="uppercase" lineHeight="normal">
          {asset.symbol}
        </Text>
      </HStack>
      <Button
        leftIcon={<Icon as={SendOutlineIcon} />}
        display={{
          base: "flex",
          md: showActions ? "flex" : "none",
        }}
        variant="link"
        justifySelf="flex-end"
        onClick={e => {
          e.stopPropagation()
          onSendClicked?.(asset.identity)
        }}
      >
        Send
      </Button>
    </HStack>
  )
}
