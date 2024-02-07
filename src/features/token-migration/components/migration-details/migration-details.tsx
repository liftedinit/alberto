import { useParams } from "react-router-dom"
import {
  Center,
  Spinner,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
} from "@liftedinit/ui"
import { useEffect, useState } from "react"
import { Thead } from "@chakra-ui/react"
import { useSingleTransactionList } from "features/transactions/queries"
import { ShareLocationButton } from "features/utils/share-button"
import { extractTransactionHash } from "features/token-migration/block-utils"
import { useGetBlock } from "features/network/queries"
import {
  extractEventDetails,
  extractEventMemo,
} from "features/token-migration/event-details"

export function MigrationDetails() {
  const { eventId } = useParams()
  const [txId, setTxId] = useState<ArrayBuffer | undefined>(undefined)
  const {
    data: events,
    isLoading: isTxLoading,
    isError: isTxError,
    error: transactionError,
  } = useSingleTransactionList({ txId })
  const [blockHeight, setBlockHeight] = useState<number | undefined>(undefined)
  const [eventNumber, setEventNumber] = useState<number | undefined>(undefined)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [uuid, setUuid] = useState<string | undefined>(undefined)
  const [destinationAddress, setDestinationAddress] = useState<
    string | undefined
  >(undefined)
  // TODO: Use setNewChainConfirmation to show the confirmation of the new chain
  // eslint-disable-next-line
  const [newChainConfirmation, setNewChainConfirmation] = useState(false)
  const { data: blocks } = useGetBlock(blockHeight)

  useEffect(() => {
    if (eventId !== undefined) {
      const buf = Buffer.from(eventId, "hex")
      const eventIdBuffer = buf.buffer.slice(
        buf.byteOffset,
        buf.byteOffset + buf.byteLength,
      )
      if (eventIdBuffer.byteLength < 6) {
        setError(new Error("Invalid event id"))
      }
      setTxId(eventIdBuffer)
    }
  }, [eventId])

  useEffect(() => {
    if (
      !isTxLoading &&
      !isTxError &&
      error === undefined &&
      events.transactions.length === 1 &&
      txId !== undefined &&
      eventId !== undefined &&
      Buffer.from(events.transactions[0].id).toString("hex") === eventId
    ) {
      try {
        const event = events.transactions[0]
        const { blockHeight, eventNumber } = extractEventDetails(
          txId,
          event.type,
        )
        const memo = extractEventMemo(event)
        setUuid(memo[0])
        setDestinationAddress(memo[1])
        setBlockHeight(blockHeight)
        setEventNumber(eventNumber)
      } catch (e) {
        setError(e as Error)
      }
    } else if (isTxError) {
      setError(new Error(`Unable to fetch transaction: ${transactionError}`))
    }
    // eslint-disable-next-line
  }, [eventId, events, isTxError, isTxLoading, transactionError, txId])

  useEffect(() => {
    if (
      blocks !== undefined &&
      eventNumber !== undefined &&
      error === undefined
    ) {
      try {
        const hash = extractTransactionHash(blocks, eventNumber)
        setTxHash(hash)
      } catch (e) {
        setError(e as Error)
      }
    }
    // eslint-disable-next-line
  }, [blocks, eventNumber])

  return (
    <>
      <VStack spacing={5} align="stretch" data-testid={"migration-details"}>
        {error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Unexpected Error!</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        <Table variant="unstyled">
          {!error && (
            <Thead>
              <Tr>
                <Th>
                  <Text fontSize={"xl"}>MANY Chain</Text>
                </Th>
              </Tr>
            </Thead>
          )}
          {!error && txHash && (
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Transaction ID:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{eventId}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    UUID:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl" aria-label={"uuid"}>
                    {uuid}
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Destination address:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{destinationAddress}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Block Height:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{blockHeight}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Transaction Number:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{eventNumber}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Transaction Hash:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{txHash}</Text>
                </Td>
              </Tr>
            </Tbody>
          )}
        </Table>

        {!error && !txHash && (
          <Center py={6}>
            <VStack>
              <Text mb={3}>
                Waiting migration confirmation from the MANY chain...
              </Text>
              <Spinner color="blue.500" size={"xl"} />
            </VStack>
          </Center>
        )}

        <Table variant="unstyled">
          {!error && (
            <Thead>
              <Tr>
                <Th>
                  <Text fontSize={"xl"}>New Chain</Text>
                </Th>
              </Tr>
            </Thead>
          )}
        </Table>
        {!error && !newChainConfirmation && (
          <Center py={6}>
            <VStack>
              <Text mb={3}>
                Waiting migration confirmation from the new chain...
              </Text>
              <Spinner color="blue.500" size={"xl"} />
            </VStack>
          </Center>
        )}
      </VStack>
      {eventId !== undefined && (
        <ShareLocationButton
          path={`/#/token-migration-portal/migration-history/${eventId}`}
          label={"Share this migration details"}
          mt={6}
        />
      )}
    </>
  )
}
