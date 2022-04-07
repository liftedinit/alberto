import { GrUpload, GrDownload } from "react-icons/gr"
import { TransactionType } from "many-js"
import type { Transaction } from "many-js"
import {
  CopyToClipboard,
  Flex,
  Icon,
  Table,
  Td,
  Tr,
  Tbody,
  TableContainer,
  Text,
  VStack,
} from "components"
import { makeShortId } from "helper/common"

export function TxnList({
  transactions,
  accountPublicKey,
}: {
  transactions: Transaction[]
  accountPublicKey: string
}) {
  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          {transactions.map((t: Transaction) => {
            return (
              <TxnListItem
                transaction={t}
                key={t.time.getTime()}
                accountPublicKey={accountPublicKey}
              />
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

function TxnListItem({
  transaction,
  accountPublicKey,
}: {
  transaction: Transaction
  accountPublicKey: string
}) {
  if (transaction.type === TransactionType.send) {
    const isSender = accountPublicKey === transaction.from
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
  const { to, from, amount, symbol, time } = transaction
  const icon = isSender ? GrUpload : GrDownload
  const title = isSender ? "send" : "receive"

  const displayAmount = `${isSender ? "-" : "+"}${amount}`
  const description = `${isSender ? "To:" : "From:"} ${
    isSender ? makeShortId(to!) : makeShortId(from!)
  }`

  return (
    <Tr>
      <Td>
        <Icon as={icon} w={5} h={5} />
      </Td>
      <Td>
        <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
          <Text lineHeight="normal" textTransform="capitalize">
            {title}
          </Text>
          <Text fontSize="xs">{time?.toLocaleString()}</Text>
        </VStack>
      </Td>
      <Td>
        <Flex gap={1} alignItems="center">
          <Text fontSize="sm">{description} </Text>
          <CopyToClipboard
            iconProps={{ "data-testid": "copy-to-clipboard-btn" }}
            toCopy={isSender ? to! : from!}
          />
        </Flex>
      </Td>
      <Td>
        <Flex gap={2}>
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
