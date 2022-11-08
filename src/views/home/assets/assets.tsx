import React from "react"
import { SlideFade } from "shared/components"
import { Asset } from "features/balances"
import { Symbols } from "../symbols"
import { AssetDetails } from "../asset-details"

export function Assets({
  address,
  accountAddress,
}: {
  address: string
  accountAddress?: string
}) {
  const [asset, setAsset] = React.useState<Asset | undefined>(undefined)

  return (
    <SlideFade in key={String(!!asset)}>
      {asset ? (
        <AssetDetails address={address} asset={asset} setAsset={setAsset} />
      ) : (
        <Symbols
          address={address}
          onAssetClicked={a => setAsset(a)}
          accountAddress={accountAddress}
        />
      )}
    </SlideFade>
  )
}
