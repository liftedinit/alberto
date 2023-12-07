import { Event } from "@liftedinit/many-js"
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
import {
  calculateBalances,
  useAllTransactionsList,
  useTransactionsList,
} from "features/transactions/queries"
import { TxnListItem } from "./txn-list-item"
import { TxnExport } from "./txn-export"
import { useBalances } from "features/balances"

export function TxnList({
  address,
  symbol,
}: {
  address: string
  symbol?: string
}) {
  const accounts = symbol ? [address, symbol] : [address]
  const queryData = useTransactionsList({
    accounts,
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
  const { data: allTxns } = useAllTransactionsList({ accounts })
  const { data: balances } = useBalances({ address })

  let txnBalances = new Map()
  if (allTxns && balances) {
    txnBalances = calculateBalances(
      allTxns.transactions,
      balances.ownedAssetsWithBalance,
      address,
    )
  }

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
      ) : (
        <TableContainer>
          <Table size="sm">
            <Tbody>
              {transactions.map((t: Event & { _id: string }) => {
                return (
                  <TxnListItem
                    transaction={t}
                    key={t._id + t.time}
                    address={address}
                    balance={txnBalances.get(t._id)}
                  />
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {(transactions.length !== 0 || currPageCount > 0 || hasNextPage) && (
        <Flex
          mt={2}
          gap={2}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          {transactions.length !== 0 && (
            <TxnExport address={address} symbol={symbol} />
          )}

          {(currPageCount > 0 || hasNextPage) && (
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
        </Flex>
      )}
    </>
  )
}
