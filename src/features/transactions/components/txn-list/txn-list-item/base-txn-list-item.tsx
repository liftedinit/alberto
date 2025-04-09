import React from "react"
import { AddressText, HStack, Td, Tr, Text, VStack } from "@liftedinit/ui"

export function BaseTxnListItem({
  icon,
  txnTypeName,
  txnTime,
  actionLabel,
  actorName,
  actorAddress,
  txnDetails,
}: Readonly<{
  icon: React.ReactNode
  txnTypeName: string
  txnTime: number
  actionLabel?: string
  actorName?: string
  actorAddress?: string
  txnDetails?: React.ReactNode
}>) {
  return (
    <TxnItemRow
      first={
        <TxnFirstCol icon={icon} txnTime={txnTime} txnTypeName={txnTypeName} />
      }
      second={
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
      }
      third={txnDetails}
    />
  )
}

export function TxnFirstCol({
  icon,
  txnTypeName,
  txnTime,
}: Readonly<{
  icon: React.ReactNode
  txnTypeName: string
  txnTime: number
}>) {
  return (
    <HStack>
      {icon}
      <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
        <TxnTypeName name={txnTypeName} />
        <TxnTime txnTime={txnTime} />
      </VStack>
    </HStack>
  )
}
function TxnTime({ txnTime }: Readonly<{ txnTime: number }>) {
  return <Text fontSize="xs">{new Date(txnTime)?.toLocaleString()}</Text>
}

function TxnTypeName({ name }: Readonly<{ name: string }>) {
  return (
    <Text lineHeight="normal" casing="capitalize">
      {name}
    </Text>
  )
}

export function TxnItemRow({
  first,
  second,
  secondProps = {},
  third,
  rowProps,
}: Readonly<{
  first: React.ReactNode
  second?: React.ReactNode
  secondProps?: Record<string, unknown>
  rowProps?: Record<string, unknown>
  third?: React.ReactNode
}>) {
  return (
    <Tr aria-label="transaction list item" {...rowProps}>
      <Td>{first}</Td>
      {second && <Td {...secondProps}>{second}</Td>}
      {third && <Td>{third}</Td>}
    </Tr>
  )
}
