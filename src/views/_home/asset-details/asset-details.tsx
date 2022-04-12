import { GrFormPrevious } from "react-icons/gr"
import {
  Box,
  Button,
  CopyToClipboard,
  Flex,
  Heading,
  Image,
  SlideFade,
  Text,
  VStack,
} from "components"
import { TxnList } from "features/transactions"
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
          <TxnList
            network={network}
            filter={{
              symbols: asset.identity,
            }}
            accountPublicKey={accountPublicKey}
          />
        </Box>
      </Box>
    </SlideFade>
  )
}
