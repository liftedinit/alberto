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
import env from "@beam-australia/react-env"

const TALIB_URL = env("TALIB_URL")
const statusMapping: { [key: number]: string } = {
  1: "Created",
  2: "Claimed",
  3: "Migrating",
  4: "Completed",
  5: "Failed",
}

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
  const [newChainConfirmation, setNewChainConfirmation] = useState(false)
  const [manifestHash, setManifestHash] = useState<string | undefined>(
    undefined,
  )
  const [manifestAddress, setManifestAddress] = useState<string | undefined>(
    undefined,
  )
  const [manifestDatetime, setManifestDatetime] = useState<string | undefined>(
    undefined,
  )
  const [manifestError, setManifestError] = useState<string | undefined>(
    undefined,
  )
  const [manifestStatus, setManifestStatus] = useState<number | undefined>(
    undefined,
  )
  const [manifestUuid, setManifestUuid] = useState<string | undefined>(
    undefined,
  )
  const { data: blocks } = useGetBlock(blockHeight)

  const pollNewChainConfirmation = async (
    url: string,
    interval = 1000, // 1 second
    timeout = 120000, // 2 minutes
  ) => {
    const endTime = Number(new Date()) + timeout

    const checkCondition = (
      resolve: (value: any) => void,
      reject: (reason: Error) => void,
    ) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              // For a 404, throw an error that will be caught by the catch block
              throw new Error("404")
            } else {
              // For other errors, throw a more generic error or handle differently
              throw new Error("Request failed with status " + response.status)
            }
          }
          return response.json()
        })
        .then(data => {
          // Check the data for the value
          if (data) {
            const {
              status,
              uuid,
              manifestAddress,
              manifestDatetime,
              manifestHash,
              error,
            } = data

            setManifestAddress(manifestAddress)
            setManifestError(error)
            setManifestStatus(status)
            setManifestUuid(uuid)

            if (
              statusMapping[status] === "Completed" ||
              statusMapping[status] === "Failed"
            ) {
              setManifestDatetime(manifestDatetime)
              setManifestHash(manifestHash)
              setNewChainConfirmation(true)
              resolve(data)
            } else {
              // Continue polling if the condition isn't met
              setTimeout(checkCondition, interval, resolve, reject)
            }
          } else if (Number(new Date()) < endTime) {
            // If the condition isn't met but the timeout hasn't elapsed, go again
            setTimeout(checkCondition, interval, resolve, reject)
          } else {
            // Didn't match and too much time, reject!
            reject(new Error("timed out"))
          }
        })
        .catch(error => {
          if (error.message === "404") {
            setTimeout(checkCondition, interval, resolve, reject)
          } else {
            reject(error)
          }
        })
    }

    return new Promise(checkCondition)
  }

  useEffect(() => {
    if (eventId !== undefined) {
      const buf = Buffer.from(eventId, "hex")
      const eventIdBuffer = buf.buffer.slice(
        buf.byteOffset,
        buf.byteOffset + buf.byteLength,
      )
      if (eventIdBuffer.byteLength < 5) {
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

  useEffect(() => {
    if (txHash !== undefined && uuid !== undefined && !newChainConfirmation) {
      const url = new URL(`migrations/${uuid}`, TALIB_URL)
      pollNewChainConfirmation(url.toString()).catch(() => {
        setError(new Error("Failed to poll new chain confirmation"))
      })
    }
  }, [txHash, uuid, newChainConfirmation])

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
                  <Text fontSize={"xl"}>MANIFEST Chain</Text>
                </Th>
              </Tr>
            </Thead>
          )}
        </Table>
        {!error && !manifestStatus && (
          <Center py={6}>
            <VStack>
              <Text mb={3}>
                Waiting migration confirmation from the MANIFEST chain...
              </Text>
              <Spinner color="blue.500" size={"xl"} />
            </VStack>
          </Center>
        )}
        {!error && !manifestError && manifestStatus && (
          <Table variant="unstyled">
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Manifest Status:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{statusMapping[manifestStatus]}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Manifest UUID:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{manifestUuid}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Manifest Address:
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="xl">{manifestAddress}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Manifest Hash:
                  </Text>
                </Td>
                <Td>
                  {manifestHash === undefined ? (
                    <Spinner />
                  ) : (
                    <Text fontSize="xl">{manifestHash}</Text>
                  )}
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600">
                    Manifest Datetime:
                  </Text>
                </Td>
                <Td>
                  {manifestDatetime === undefined ? (
                    <Spinner />
                  ) : (
                    <Text fontSize="xl">{manifestDatetime}</Text>
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
        {!error && manifestError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{manifestError}</AlertDescription>
          </Alert>
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
