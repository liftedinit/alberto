import { SendEvent } from "@liftedinit/many-js"
import { amountFormatter, Box, Flex, Text } from "@liftedinit/ui"
import { useSendTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"

export function SendTxnListItem({
  txn,
  address,
  balance,
}: {
  txn: SendEvent
  address: string
  balance?: bigint
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
        <Box>
          <Flex gap={2} justifyContent="flex-end">
            <Text fontWeight="medium" color={iconColor} justifySelf="flex-end">
              {displayAmount}
            </Text>
            <Text>{symbol}</Text>
          </Flex>
          {balance && (
            <Flex gap={2} justifyContent="flex-end">
              <Text fontWeight="light" color="gray.300" justifySelf="flex-end">
                {amountFormatter(balance)}
              </Text>
              <Text color="gray.300">{symbol}</Text>
            </Flex>
          )}
        </Box>
      }
    />
  )
}
