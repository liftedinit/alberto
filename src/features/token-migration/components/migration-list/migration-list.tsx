import React, { useEffect, useMemo, useState } from "react"
import { IdentitiesAndAccounts, IdTypes } from "../migration-form/types"
import { useCombinedAccountInfo } from "../../../accounts/queries"
import {
  Box,
  Button,
  Center,
  ChevronLeftIcon,
  ChevronRightIcon,
  Flex,
  HStack,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
} from "@liftedinit/ui"
import {
  Event,
  EventType,
  ILLEGAL_IDENTITY,
  ListOrderType,
  MultisigSubmitEvent,
  SendEvent,
} from "@liftedinit/many-js"
import validator from "validator"
import { DestinationAddressRegex } from "../migration-form/utils/destinationAddress"
import { MigrationListItem } from "./migration-list-item"
import { useTransactionsList } from "../../../transactions"

export const MigrationList: React.FC = () => {
  const [accountsAndIdentities, setAccountsAndIdentities] = useState<
    Map<string, IdentitiesAndAccounts>
  >(new Map())
  const [isAccountAndIdentitiesLoaded, setIsAccountAndIdentitiesLoaded] =
    useState(false)
  const combinedAccountAndIdentities = useCombinedAccountInfo()
  const memoizedCombinedAccountAndIdentities = useMemo(
    () => combinedAccountAndIdentities,
    [combinedAccountAndIdentities],
  )
  const [currentSelection, setCurrentSelection] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})

  const isMatchingEvent = (e: Event) => {
    if (
      (e.type === EventType.send ||
        e.type === EventType.accountMultisigSubmit) &&
      "memo" in e &&
      e.memo?.length === 2 &&
      typeof e.memo[0] === "string" &&
      validator.isUUID(e.memo[0]) &&
      typeof e.memo[1] === "string" &&
      DestinationAddressRegex.test(e.memo[1])
    ) {
      if (e.type === EventType.send) {
        const se = e as SendEvent
        return se.from === currentSelection && se.to === ILLEGAL_IDENTITY
      } else if (e.type === EventType.accountMultisigSubmit) {
        const ams = e as MultisigSubmitEvent
        if (ams.transaction?.type === EventType.send) {
          const se = ams.transaction as SendEvent
          return se.from === currentSelection && se.to === ILLEGAL_IDENTITY
        }
      }
    }
    return false
  }
  const {
    data: events,
    currPageCount,
    hasNextPage,
    nextBtnProps,
    prevBtnProps,
  } = useTransactionsList({ filters, predicate: isMatchingEvent })
  const eventsMemo = useMemo(() => events.transactions, [events.transactions])

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrentSelection(event.target.value)
    if (event.target.value !== "") {
      setFilters({
        accounts: [event.target.value],
        order: ListOrderType.descending,
      }) // Accounts filtering in the backend is an OR, not an AND
    }
  }

  useEffect(() => {
    setAccountsAndIdentities(memoizedCombinedAccountAndIdentities)
    setIsAccountAndIdentitiesLoaded(true)
  }, [memoizedCombinedAccountAndIdentities])

  return (
    <Box p={4}>
      <Text mb={4}>
        Select the MANY account or the MANY user address you wish to view the
        migration history of.
      </Text>
      <Select
        bgColor="gray.100"
        fontFamily="monospace"
        fontSize="md"
        rounded="md"
        placeholder="Select Account/User"
        value={currentSelection}
        onChange={handleSelectionChange}
      >
        {isAccountAndIdentitiesLoaded
          ? Array.from(accountsAndIdentities.values()).map(
              ({ idType, address, name }) => (
                <option key={address} value={address}>
                  {idType === IdTypes.USER ? "User" : "Account"}: {address}{" "}
                  {name ? `(${name})` : null}
                </option>
              ),
            )
          : null}
      </Select>
      {currentSelection !== "" && eventsMemo.length === 0 ? (
        <Box pt={4}>
          <Center>
            <HStack>
              <Text>Loading...</Text>
              {eventsMemo.length === 0 && <Spinner size="lg" />}
            </HStack>
          </Center>
        </Box>
      ) : null}
      {currentSelection !== "" && eventsMemo.length > 0 ? (
        <TableContainer p={4}>
          <Table size="sm">
            <Tbody>
              {eventsMemo?.map((event, index) => (
                <MigrationListItem key={index} transaction={event} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
      {currentSelection !== "" && (currPageCount > 0 || hasNextPage) && (
        <Flex gap={2} justifyContent="flex-end">
          <Button
            leftIcon={<ChevronLeftIcon boxSize={5} />}
            lineHeight="normal"
            size="sm"
            w={{ base: "full", md: "auto" }}
            {...prevBtnProps}
          >
            Prev
          </Button>
          <Button
            rightIcon={<ChevronRightIcon boxSize={5} />}
            lineHeight="normal"
            size="sm"
            w={{ base: "full", md: "auto" }}
            {...nextBtnProps}
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  )
}
