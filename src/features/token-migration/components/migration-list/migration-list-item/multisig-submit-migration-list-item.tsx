import { EventType, MultisigSubmitEvent, SendEvent } from "@liftedinit/many-js"
import { BaseMigrationListItem } from "./base-migration-list-item"
import { Flex, PendingIcon, Text } from "@liftedinit/ui"
import { useGetMultisigTxnInfo } from "../../../../accounts"
import { getTxnStateText, MultisigTxnDetails } from "../../../../transactions"
import { useLedgerInfo } from "../../../../network"

export function MultisigSubmitMigrationListItem({
  event,
}: Readonly<{ event: MultisigSubmitEvent }>) {
  if (event.memo && event.memo.length !== 2) {
    throw new Error("Invalid MultisigSubmit migration list item")
  }
  const { data } = useLedgerInfo({})
  const symbols = data!.symbols
  const token = event.token

  const { data: maybeMultisigTxnInfoData } = useGetMultisigTxnInfo(token)
  const { info: multisigTxnInfoData } = maybeMultisigTxnInfoData ?? {}
  let states = new Set(multisigTxnInfoData?.map(item => item.info?.state))
  let state = states.size === 1 ? [...states][0] : undefined // FIXME: State can be different
  const stateText = getTxnStateText(state)

  const uuid =
    event.memo && typeof event.memo[0] === "string" ? event.memo[0] : ""
  const destination =
    event.memo && typeof event.memo[1] === "string" ? event.memo[1] : ""
  const internalTx = event.transaction
  if (internalTx?.type !== EventType.send) {
    throw new Error("Invalid MultigigSubmit internal transaction type")
  }
  const internalSend = internalTx as SendEvent
  const details = (
    <Flex justifyContent="flex-end" alignItems="center" gap={2}>
      {stateText ? (
        <Text
          casing="capitalize"
          fontSize="xs"
          wordBreak="break-word"
          whiteSpace="pre-wrap"
        >
          {stateText}
        </Text>
      ) : null}
      <MultisigTxnDetails multisigTxn={event} />
    </Flex>
  )
  return (
    <BaseMigrationListItem
      icon={<PendingIcon />}
      eventId={event.id}
      type={event.type}
      time={event.time}
      from={internalSend.from}
      to={destination}
      uuid={uuid}
      amount={internalSend.amount}
      symbol={symbols.get(internalSend.symbolAddress)}
      details={details}
    />
  )
}
