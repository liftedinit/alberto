import {
  AddressText,
  amountFormatter,
  HStack,
  Td,
  Text,
  Tr,
  VStack,
} from "@liftedinit/ui"
import React from "react"
import { useGetContactName } from "../../../../contacts"

interface BaseMigrationListItemProps {
  icon: React.ReactNode
  type: string
  time: number
  from: string
  to: string
  uuid: string
  amount: bigint
  symbol?: string
  details?: React.ReactNode
}
export function BaseMigrationListItem(
  props: Readonly<BaseMigrationListItemProps>,
) {
  const { icon, type, time, from, to, uuid, details, amount, symbol } = props
  const getContactName = useGetContactName()
  const fromName = getContactName(from)

  return (
    <Tr aria-label="migration list item">
      <Td>
        <HStack>
          {icon}
          <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
            <Text lineHeight="normal" casing="capitalize">
              {type}
            </Text>
            <Text fontSize="xs">{new Date(time)?.toLocaleString()}</Text>
          </VStack>
        </HStack>
      </Td>
      <Td>
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="xs">From:</Text>
          {fromName !== "" && <Text fontWeight="medium">{fromName}</Text>}

          <AddressText
            addressText={from}
            iconProps={{ boxSize: 4 }}
            bgColor={undefined}
            px={0}
            py={0}
            fontSize="sm"
          />
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="xs">Destination:</Text>
          <AddressText
            addressText={to}
            iconProps={{ boxSize: 4 }}
            bgColor={undefined}
            px={0}
            py={0}
            fontSize="sm"
          />
        </VStack>
      </Td>
      <Td>
        <Text fontSize="xs">UUID:</Text>
        <Text fontSize={"xs"}>{uuid}</Text>
      </Td>
      <Td>
        <Text>{amountFormatter(amount)}</Text>
        {symbol && <Text>{symbol}</Text>}
      </Td>
      {details && <Td>{details}</Td>}
    </Tr>
  )
}
