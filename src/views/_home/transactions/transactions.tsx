import { Network } from "many-js"
import { Center, Spinner, Text } from "components"
import { useTransactionsList, TxnList } from "features/transactions"

export function Transactions({
  network,
  accountPublicKey,
}: {
  network?: Network
  accountPublicKey: string
}) {
  const { data, isLoading, isError, error } = useTransactionsList({
    network,
    accountPublicKey,
  })
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

  if (count === 0) {
    return (
      <Center>
        <Text fontSize="lg">There are no transactions for this account.</Text>
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
      <TxnList
        transactions={transactions}
        accountPublicKey={accountPublicKey}
      />
    </>
  )
}
