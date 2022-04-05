import { Link as RouterLink } from "react-router-dom"

import { GrSend } from "react-icons/gr"
import { Network } from "many-js"
import {
  Button,
  Center,
  HStack,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "components"
import { Account } from "features/accounts"
import { useBalances } from "features/balances"
import cubeImg from "assets/cube.png"

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
      <Stack flexDir="column">
        {errors.length > 0 ? (
          errors.map((e, idx) => (
            <Text key={idx} wordBreak="break-word">
              {typeof e === "string"
                ? e
                : JSON.stringify(e, Object.getOwnPropertyNames(e))}
            </Text>
          ))
        ) : (
          <Text>An unexpected error occurred.</Text>
        )}
      </Stack>
    )
  }

  if (data.ownedAssetsWithBalance.length === 0 && !isFetching) {
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
        {data.ownedAssetsWithBalance.map(asset => {
          return (
            <HStack
              shadow="base"
              px={3}
              py={2}
              bg="gray.50"
              key={asset.identity}
              rounded="md"
              borderWidth={1}
              spacing={4}
              overflow="hidden"
              alignItems="center"
            >
              <Image src={cubeImg} boxSize={10} />
              <HStack overflow="hidden" alignItems="center" flexGrow={1}>
                <Text
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  fontSize="xl"
                  fontWeight="medium"
                >
                  {asset.balance.toLocaleString()}
                </Text>
                <Text fontSize="lg" casing="uppercase" lineHeight="normal">
                  {asset.symbol}
                </Text>
              </HStack>
              <Button
                leftIcon={<Icon as={GrSend} />}
                variant="link"
                as={RouterLink}
                to="send"
                justifySelf="flex-end"
                state={{ assetIdentity: asset.identity }}
              >
                Send
              </Button>
            </HStack>
          )
        })}
      </Stack>
    </>
  )
}
