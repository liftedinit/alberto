import React from "react"
import { Link as RouterLink } from "react-router-dom"
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
  useBreakpointValue,
} from "components"
import { Asset, useBalances } from "features/balances"
import cubeImg from "assets/cube.png"
import { amountFormatter } from "helper/common"

export function Symbols({
  address,
  onAssetClicked,
}: {
  address: string
  onAssetClicked: (asset: Asset) => void
}) {
  const { data, isError, isLoading, errors } = useBalances({
    address,
  })

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
        <Text fontSize="lg">There are no tokens for this account.</Text>
      </Center>
    )
  }

  return (
    <>
      {isLoading ? (
        <Center position="absolute" left={0} right={0}>
          <Spinner />
        </Center>
      ) : null}

      <Stack spacing={0} divider={<StackDivider />}>
        {data.ownedAssetsWithBalance.map(asset => {
          return (
            <AssetLlistItem
              key={asset.identity}
              asset={asset}
              onAssetClicked={onAssetClicked}
            />
          )
        })}
      </Stack>
    </>
  )
}

function AssetLlistItem({
  asset,
  onAssetClicked,
}: {
  asset: Asset
  onAssetClicked: (asset: Asset) => void
}) {
  const [showActions, setShowActions] = React.useState(false)
  const toggleShowSend = useBreakpointValue({
    base: undefined,
    md: () => setShowActions(s => !s),
  })

  console.log({ asset })
  return (
    <HStack
      spacing={4}
      overflow="hidden"
      alignItems="center"
      onMouseEnter={toggleShowSend}
      onMouseLeave={toggleShowSend}
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
        as={RouterLink}
        to="send"
        justifySelf="flex-end"
        onClick={e => e.stopPropagation()}
        state={{ assetIdentity: asset.identity }}
      >
        Send
      </Button>
    </HStack>
  )
}
