import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { GrSend } from "react-icons/gr"
import { Network } from "many-js"
import {
  Button,
  Center,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
} from "components"
import { Asset, useBalances } from "features/balances"
import cubeImg from "assets/cube.png"

export function Symbols({
  network,
  accountPublicKey,
  onAssetClicked,
}: {
  network?: Network
  accountPublicKey: string
  onAssetClicked: (asset: Asset) => void
}) {
  const { data, isError, isLoading, errors } = useBalances({
    network,
    accountPublicKey,
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
          {asset.balance.toLocaleString()}
        </Text>
        <Text fontSize="lg" casing="uppercase" lineHeight="normal">
          {asset.symbol}
        </Text>
      </HStack>
      <Button
        leftIcon={<Icon as={GrSend} />}
        display={{
          base: "inline-flex",
          md: showActions ? "inline-block" : "none",
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
