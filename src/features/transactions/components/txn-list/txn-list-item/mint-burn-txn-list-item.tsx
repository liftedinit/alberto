import { BurnEvent, MintEvent } from "@liftedinit/many-js"
import { Flex, Text } from "@liftedinit/ui"
import { useMintBurnTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"

export function MintBurnTxnListItem({
  txn,
  address,
}: {
  txn: MintEvent | BurnEvent
  address: string
}) {
  const time = txn.time
  const { TxnIcon, iconColor, title, displayAmount, symbol } = useMintBurnTxn({
    address,
    txn,
  })

  return (
    <BaseTxnListItem
      icon={<TxnIcon />}
      txnTypeName={title}
      txnTime={time}
      txnDetails={
        <Flex gap={2} justifyContent="flex-end">
          <Text fontWeight="medium" color={iconColor} justifySelf="flex-end">
            {displayAmount}
          </Text>
          <Text>{symbol}</Text>
        </Flex>
      }
    />
  )
}
