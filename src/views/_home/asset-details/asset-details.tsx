import { GrFormPrevious } from "react-icons/gr"
import {
  Box,
  Button,
  Center,
  CopyToClipboard,
  Flex,
  Heading,
  Image,
  SlideFade,
  Spinner,
  Text,
  VStack,
} from "components"
import { TxnList, useTransactionsList } from "features/transactions"
import cubeImg from "assets/cube.png"
import { Asset } from "features/balances"
import { Network } from "many-js"
import { makeShortId } from "helper/common"

type Props = {
  asset: Asset
  setAsset: React.Dispatch<Asset | undefined>
  network?: Network
  accountPublicKey: string
}

// @ts-ignore
export function AssetDetails({
  asset,
  setAsset,
  network,
  accountPublicKey,
}: Props) {
  return (
    <SlideFade in={true}>
      <Button
        leftIcon={<GrFormPrevious />}
        variant="link"
        onClick={() => setAsset(undefined)}
      >
        Back
      </Button>
      <VStack>
        <Image src={cubeImg} boxSize="14" />
        <Heading size="lg" fontWeight="normal">
          {asset.balance.toLocaleString() || "0"} {asset.symbol}
        </Heading>
        <Flex alignItems="center" gap={1}>
          <Text>{makeShortId(asset.identity)}</Text>
          <CopyToClipboard toCopy={asset.identity} />
        </Flex>
      </VStack>
      <Box px={3} mt={4}>
        <Heading size="md" mb={3}>
          Activity
        </Heading>
        <Box pos="relative">
          <AssetTransactions
            network={network}
            assetIdentity={asset.identity}
            accountPublicKey={accountPublicKey}
          />
        </Box>
      </Box>
    </SlideFade>
  )
}

function AssetTransactions({
  network,
  accountPublicKey,
  assetIdentity,
}: {
  network?: Network
  accountPublicKey: string
  assetIdentity: string
}) {
  const { data, isLoading } = useTransactionsList({
    network,
    accountPublicKey,
    filter: {
      symbols: assetIdentity,
    },
  })
  const { count, transactions } = data

  if (count === 0) {
    return (
      <Center>
        <Text fontSize="lg">There are no transactions for this asset.</Text>
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
      <TxnList
        transactions={transactions}
        accountPublicKey={accountPublicKey}
      />
    </>
  )
}