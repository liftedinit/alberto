import {
  AddressText,
  amountFormatter,
  HStack,
  Icon,
  Link,
  Td,
  Text,
  Tr,
  VStack,
} from "@liftedinit/ui"
import React from "react"
import { useGetContactName } from "../../../../contacts"
import { HiDotsHorizontal } from "react-icons/hi" // TODO: This should be in @liftedinit/ui
import { IconProps } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

interface BaseMigrationListItemProps {
  icon: React.ReactNode
  type: string
  eventId: ArrayBuffer
  time: number
  from: string
  to: string
  uuid: string
  amount: bigint
  symbol?: string
  details?: React.ReactNode
}

// TODO: This should be in @liftedinit/ui
export function DotsIcon(props: Readonly<IconProps>) {
  return <Icon as={HiDotsHorizontal} {...props} />
}

export function BaseMigrationListItem(
  props: Readonly<BaseMigrationListItemProps>,
) {
  const { icon, type, eventId, time, from, to, uuid, details, amount, symbol } =
    props
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
        <Text fontSize={"xs"} aria-label={`${uuid}`}>
          {uuid}
        </Text>
      </Td>
      <Td>
        <Text>{amountFormatter(amount)}</Text>
        {symbol && <Text>{symbol}</Text>}
      </Td>
      <Td>{details ? details : null}</Td>
      <Td>
        <Link
          as={RouterLink}
          to={`/token-migration-portal/migration-history/${Buffer.from(
            eventId,
          ).toString("hex")}`}
        >
          <DotsIcon />
        </Link>
      </Td>
    </Tr>
  )
}
