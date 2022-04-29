import { GrFormPrevious } from "react-icons/gr"
import {
  Button,
  CopyToClipboard,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "components"
import { TxnList } from "features/transactions"
import cubeImg from "assets/cube.png"
import { Asset } from "features/balances"
import { amountFormatter, makeShortId } from "helper/common"

type Props = {
  asset: Asset
  setAsset: React.Dispatch<Asset | undefined>
  accountPublicKey: string
}

export function AssetDetails({ asset, setAsset, accountPublicKey }: Props) {
  return (
    <>
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
          {amountFormatter(asset.balance)} {asset.symbol}
        </Heading>
        <Flex alignItems="center" gap={1}>
          <Text>{makeShortId(asset.identity)}</Text>
          <CopyToClipboard toCopy={asset.identity} />
        </Flex>
      </VStack>
      <Heading size="md" mb={3}>
        Activity
      </Heading>
      <TxnList
        filter={{
          symbols: asset.identity,
        }}
        accountPublicKey={accountPublicKey}
      />
    </>
  )
}
