import { GrFormPrevious } from "react-icons/gr"
import {
  AddressText,
  Button,
  Heading,
  Image,
  VStack,
  amountFormatter,
  cubePng,
} from "@liftedinit/ui"
import { TxnList } from "features/transactions"
import { Asset } from "features/balances"

type Props = {
  asset: Asset
  setAsset: React.Dispatch<Asset | undefined>
  address: string
}

export function AssetDetails({ asset, setAsset, address }: Props) {
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
        <Image src={cubePng} boxSize="14" />
        <Heading size="lg" fontWeight="normal">
          {amountFormatter(asset.balance)} {asset.symbol}
        </Heading>
        <AddressText bgColor={undefined} addressText={asset.identity} />
      </VStack>
      <Heading size="md" mb={3}>
        Activity
      </Heading>
      <TxnList
        filter={{
          symbols: asset.identity,
        }}
        address={address}
      />
    </>
  )
}
