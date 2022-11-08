import { SendEvent } from "@liftedinit/many-js"
import { Flex, Text } from "shared/components"
import { useSendTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"

export function SendTxnListItem({
  txn,
  address,
}: {
  txn: SendEvent
  address: string
}) {
  const time = txn.time
  const {
    TxnIcon,
    iconColor,
    title,
    toOrFromLabel,
    contactName,
    toOrFromAddress,
    displayAmount,
    symbol,
  } = useSendTxn({
    address,
    txn: txn as SendEvent,
  })

  return (
    <BaseTxnListItem
      icon={<TxnIcon />}
      txnTypeName={title}
      txnTime={time}
      actionLabel={toOrFromLabel}
      actorName={contactName}
      actorAddress={toOrFromAddress}
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
