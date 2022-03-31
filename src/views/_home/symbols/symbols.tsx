import { Center, Circle, HStack, Spinner, Stack, Text } from "components"
import { Account } from "features/accounts"
import { useBalances } from "features/balances"
import { Network } from "many-js"

export function Symbols({
  network,
  account,
}: {
  network?: Network
  account?: Account
}) {
  const { data, isError, isFetching, errors } = useBalances({
    network,
    account,
  })

  if (isError) {
    return (
      <Center>
        {errors.length > 0 ? (
          errors.map((e, idx) => (
            <Text key={idx}>
              {typeof e === "string" ? e : JSON.stringify(e)}
            </Text>
          ))
        ) : (
          <Text>An unexpected error occurred.</Text>
        )}
      </Center>
    )
  }

  if (data.length === 0 && !isFetching) {
    return (
      <Center>
        <Text fontSize="lg">There are no tokens for this account.</Text>
      </Center>
    )
  }

  return (
    <>
      {isFetching ? (
        <Center position="absolute" left={0} right={0}>
          <Spinner />
        </Center>
      ) : null}

      <Stack spacing={3}>
        {data?.map(symbol => {
          return (
            <HStack
              shadow="base"
              px={3}
              py={3}
              bg="gray.50"
              key={symbol.name}
              rounded="md"
              borderWidth={1}
              spacing={4}
              overflow="hidden"
              alignItems="center"
            >
              <Circle size="8" borderWidth={1} borderColor="gray.400" />
              <HStack overflow="hidden" alignItems="center">
                <Text
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  fontSize="xl"
                  fontWeight="medium"
                >
                  {symbol.value.toLocaleString()}
                </Text>
                <Text fontSize="lg" casing="uppercase" lineHeight="normal">
                  {symbol.name}
                </Text>
              </HStack>
            </HStack>
          )
        })}
      </Stack>
    </>
  )
}
