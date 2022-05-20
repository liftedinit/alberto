import { ListFilterArgs, TransactionType } from "many-js"
import { FiChevronRight, FiChevronLeft } from "react-icons/fi"
import type { Transaction } from "many-js"
import {
  Button,
  Center,
  Flex,
  ReceiveIcon,
  SendOutlineIcon,
  Spinner,
  Table,
  Td,
  Tr,
  Tbody,
  TableContainer,
  Text,
  VStack,
  AddressText,
} from "components"
import { useTransactionsList } from "features/transactions/queries"
import { amountFormatter } from "helper/common"
import { useContactsStore } from "features/contacts"
import { useAccountsStore } from "features/accounts"

export function TxnList({
  address,
  filter = {},
}: {
  address: string
  filter?: ListFilterArgs
}) {
  const queryData = useTransactionsList({
    address,
    filter,
  })
  const {
    data,
    isLoading,
    isError,
    error,
    nextBtnProps,
    prevBtnProps,
    hasNextPage,
    currPageCount,
  } = queryData

  const { count, transactions } = data

  if (isError && error) {
    return (
      <Center>
        <Text colorScheme="red" fontSize="lg">
          {JSON.stringify(error)}
        </Text>
      </Center>
    )
  }

  if (!isLoading && (count === 0 || transactions.length === 0)) {
    return (
      <Center>
        <Text fontSize="lg">There are no transactions.</Text>
      </Center>
    )
  }

  return (
    <>
      {isLoading ? (
        <Center position="absolute" left={0} right={0}>
          <Spinner />
        </Center>
      ) : null}
      <TableContainer>
        <Table size="sm">
          <Tbody>
            {transactions.map((t: Transaction) => {
              return (
                <TxnListItem
                  transaction={t}
                  key={t.time.getTime()}
                  address={address}
                />
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {(currPageCount > 0 || hasNextPage) && (
        <Flex mt={2} gap={2} justifyContent="flex-end">
          <Button
            leftIcon={<FiChevronLeft />}
            lineHeight="normal"
            size="sm"
            w={{ base: "full", md: "auto" }}
            {...prevBtnProps}
          >
            Prev
          </Button>
          <Button
            rightIcon={<FiChevronRight />}
            lineHeight="normal"
            size="sm"
            w={{ base: "full", md: "auto" }}
            {...nextBtnProps}
          >
            Next
          </Button>
        </Flex>
      )}
    </>
  )
}

function TxnListItem({
  transaction,
  address,
}: {
  transaction: Transaction
  address: string
}) {
  if (transaction.type === TransactionType.send) {
    const isSender = address === transaction.from
    return <SendTxnListItem transaction={transaction} isSender={isSender} />
  }
  return null
}

function SendTxnListItem({
  transaction,
  isSender,
}: {
  transaction: Transaction
  isSender: boolean
}) {
  const contacts = useContactsStore(s => s.byId)
  const accounts = useAccountsStore(s => Array.from(s.byId).map(a => a[1]))
  const { to, from, amount, symbol, time } = transaction
  const TxnIcon = isSender ? SendOutlineIcon : ReceiveIcon
  const title = isSender ? "send" : "receive"

  const displayAmount = `${isSender ? "-" : "+"}${amountFormatter(amount)}`
  const address = isSender ? to! : from!
  const contactName =
    contacts.get(address)?.name ??
    accounts.find(acc => acc.address === address)?.name

  return (
    <Tr aria-label="transaction list item">
      <Td>
        <TxnIcon />
      </Td>
      <Td>
        <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
          <Text lineHeight="normal" casing="capitalize">
            {title}
          </Text>
          <Text fontSize="xs">{time?.toLocaleString()}</Text>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="sm" pb={1}>
            {isSender ? "To:" : "From:"}{" "}
          </Text>
          {contactName && <Text fontWeight="medium">{contactName}</Text>}
          <AddressText
            identity={address}
            bgColor={undefined}
            px={0}
            py={0}
            fontSize="md"
          />
        </VStack>
      </Td>
      <Td>
        <Flex gap={2} justifyContent="flex-end">
          <Text
            fontWeight="medium"
            color={isSender ? "red" : "green"}
            justifySelf="flex-end"
          >
            {displayAmount}
          </Text>
          <Text>{symbol}</Text>
        </Flex>
      </Td>
    </Tr>
  )
}
