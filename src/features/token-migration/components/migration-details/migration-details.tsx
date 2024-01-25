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
  Box,
  Table,
  Tbody,
  Tr,
  Td,
} from "@liftedinit/ui"
import { extractEventDetails } from "../migration-form/utils/processEvents"
import { useGetBlock } from "../../../network"
import { useEffect, useState } from "react"
import { processBlock } from "../migration-form/utils"

export function MigrationDetails() {
  const { eventId } = useParams()
  const [blockHeight, setBlockHeight] = useState<number | undefined>(undefined)
  const [eventNumber, setEventNumber] = useState<number | undefined>(undefined)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  // TODO: Use setNewChainConfirmation to show the confirmation of the new chain
  // eslint-disable-next-line
  const [newChainConfirmation, setNewChainConfirmation] = useState(false)
  const { data: blocks } = useGetBlock(blockHeight)

  useEffect(() => {
    if (eventId) {
      const bufEventId = Buffer.from(eventId, "hex")
      try {
        const { blockHeight, eventNumber } = extractEventDetails(bufEventId)
        setBlockHeight(blockHeight)
        setEventNumber(eventNumber)
      } catch (e) {
        setError(e as Error)
      }
    }
  }, [eventId])

  useEffect(() => {
    if (blocks && eventNumber) {
      try {
        const hash = processBlock(blocks, eventNumber)
        setTxHash(hash)
      } catch (e) {
        setError(e as Error)
      }
    }
  }, [blocks, eventNumber])

  return (
    <VStack spacing={5} align="stretch">
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Unexpected Error!</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        <Table variant="unstyled">
          <Tbody>
            <Tr>
              <Td>
                <Text fontSize="lg" fontWeight="bold" color="gray.600">
                  Event ID:
                </Text>
              </Td>
              <Td>
                <Text fontSize="xl">{eventId}</Text>
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
                  Event Number:
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
        </Table>
      )}

      {!error && !newChainConfirmation ? (
        <Center py={6}>
          <Box>
            <Text mb={3}>
              Waiting migration confirmation from the new chain...
            </Text>
            <Spinner color="blue.500" />
          </Box>
        </Center>
      ) : null}
    </VStack>
  )
}
