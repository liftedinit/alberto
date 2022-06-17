import React from "react"
import { AddressText, HStack, Td, Tr, Text, VStack } from "components"

export function BaseTxnListItem({
  icon,
  txnTypeName,
  txnTime,
  actionLabel,
  actorName,
  actorAddress,
  txnDetails,
}: {
  icon: React.ReactNode
  txnTypeName: string
  txnTime: string
  actionLabel?: string
  actorName?: string
  actorAddress?: string
  txnDetails?: React.ReactNode
}) {
  return (
    <TxnItemRow
      first={
        <HStack>
          {icon}
          <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
            <Text lineHeight="normal" casing="capitalize">
              {txnTypeName}
            </Text>
            <Text fontSize="xs">{txnTime}</Text>
          </VStack>
        </HStack>
      }
      second={
        <>
          <VStack alignItems="flex-start" spacing={0}>
            {actionLabel && <Text fontSize="xs">{actionLabel}</Text>}
            {actorName && <Text fontWeight="medium">{actorName}</Text>}
            {actorAddress && (
              <AddressText
                addressText={actorAddress}
                iconProps={{ boxSize: 4 }}
                bgColor={undefined}
                px={0}
                py={0}
                fontSize="sm"
              />
            )}
          </VStack>
        </>
      }
      third={txnDetails}
    />
  )
}

function TxnItemRow({
  first,
  second,
  third,
  rowProps,
}: {
  first: React.ReactNode
  second: React.ReactNode
  rowProps?: Record<string, unknown>
  third: React.ReactNode
}) {
  return (
    <Tr aria-label="transaction list item" {...rowProps}>
      <Td>{first}</Td>
      <Td>{second}</Td>
      <Td>{third}</Td>
    </Tr>
  )
}
