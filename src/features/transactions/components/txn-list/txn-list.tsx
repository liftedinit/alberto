import { ListFilterArgs, Event } from "@liftedinit/many-js"
import {
  Button,
  ChevronRightIcon,
  ChevronLeftIcon,
  Center,
  Flex,
  Spinner,
  Table,
  Tbody,
  TableContainer,
  Text,
} from "@liftedinit/ui"
import { useTransactionsList } from "features/transactions/queries"
import { TxnListItem } from "./txn-list-item"

export function TxnList({
  address,
  filter = {},
}: {
  address: string
  filter?: Omit<ListFilterArgs, "txnIdRange">
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
        <Text fontSize="lg">{error}</Text>
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
          <Spinner size="lg" />
        </Center>
      ) : null}
      <TableContainer>
        <Table size="sm">
          <Tbody>
            {transactions.map((t: Event & { _id: string }) => {
              return (
                <TxnListItem
                  transaction={t}
                  key={t._id + t.time}
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
    </>
  )
}
