import { TokenCreateEvent } from "@liftedinit/many-js"
import { Flex, Text } from "@liftedinit/ui"
import { useTokenCreateTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"

export function TokenCreateTxnListItem({
  txn,
  address,
}: {
  txn: TokenCreateEvent
  address: string
}) {
  const time = txn.time
  const { TxnIcon, title, symbol } = useTokenCreateTxn({
    address,
    txn: txn as TokenCreateEvent,
  })

  return (
    <BaseTxnListItem
      icon={<TxnIcon />}
      txnTypeName={title}
      txnTime={time}
      txnDetails={
        <Flex gap={2} justifyContent="flex-end">
          <Text fontWeight="medium" justifySelf="flex-end">
            {symbol}
          </Text>
        </Flex>
      }
    />
  )
}
