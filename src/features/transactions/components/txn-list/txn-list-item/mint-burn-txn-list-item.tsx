import { BurnEvent, MintEvent } from "@liftedinit/many-js"
import { amountFormatter, Box, Flex, Text } from "@liftedinit/ui"
import { useMintBurnTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"

export function MintBurnTxnListItem({
  txn,
  address,
  balance,
}: {
  txn: MintEvent | BurnEvent
  address: string
  balance?: bigint
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
