import {
  EventType,
  SendEvent,
  Event,
  MultisigEvent,
  MultisigSetDefaultsEvent,
  MultisigTransactionInfo,
  MultisigTransactionState,
} from "@liftedinit/many-js"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AddressText,
  Button,
  Box,
  CheckCircleIcon,
  DataField,
  Flex,
  HStack,
  Modal,
  SettingsOutlineIcon,
  SimpleGrid,
  Spinner,
  Text,
  TimesCircleIcon,
  TxnExpireText,
  useToast,
  VStack,
  arrayBufferToBase64Url,
  getHoursMinutesSecondsFromSeconds,
} from "@liftedinit/ui"
import { useGetContactName } from "features/contacts"
import {
  approverRoles,
  useAccountsStore,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
} from "features/accounts"
import { useMultisigActions, useMultisigTxn, useSendTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { ShareLocationButton } from "features/utils/share-button"

export function MultisigTxnListItem({ txn }: Readonly<{ txn: MultisigEvent }>) {
  const { time, token } = txn
  const { actionLabel, actorAddress, txnLabel, TxnIcon, iconProps } =
    useMultisigTxn(txn)

  const { data: maybeMultisigTxnInfoData } = useGetMultisigTxnInfo(token)
  const { info: multisigTxnInfoData } = maybeMultisigTxnInfoData ?? {}
  let states = new Set(multisigTxnInfoData?.map(item => item.info?.state))
  let state = states.size === 1 ? [...states][0] : undefined // FIXME: State can be different
  const stateText = getTxnStateText(state)

  const getContactName = useGetContactName()
  const contactName = getContactName(actorAddress)

  return (
    <BaseTxnListItem
      icon={<TxnIcon {...iconProps} />}
      txnTypeName={txnLabel}
      txnTime={time}
      actionLabel={actionLabel}
      actorName={contactName}
      actorAddress={actorAddress}
      txnDetails={
        token || txn.type === EventType.accountMultisigSetDefaults ? (
          <Flex justifyContent="flex-end" alignItems="center" gap={2}>
            {stateText && txn.type === EventType.accountMultisigSubmit ? (
              <Text
                casing="capitalize"
                fontSize="xs"
                wordBreak="break-word"
                whiteSpace="pre-wrap"
              >
                {stateText}
              </Text>
            ) : null}
            <MultisigTxnDetails multisigTxn={txn} />
          </Flex>
        ) : null
      }
    />
  )
}

export function MultisigTxnDetails({
  multisigTxn,
}: Readonly<{
  multisigTxn: MultisigEvent
}>) {
  if (multisigTxn.type === EventType.accountMultisigSetDefaults) {
    return (
      <BaseTxnDetails>
        {({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
          <MultisigSetDefaultsTxnDetailsModal
            isOpen={isOpen}
            onClose={onClose}
            multisigTxn={multisigTxn as MultisigSetDefaultsEvent}
          />
        )}
      </BaseTxnDetails>
    )
  }
  return (
    <BaseTxnDetails>
      {({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
        <MultisigTxnDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          multisigTxn={multisigTxn}
        />
      )}
    </BaseTxnDetails>
  )
}

function MultisigSetDefaultsTxnDetailsModal({
  multisigTxn,
  isOpen,
  onClose,
}: Readonly<{
  multisigTxn: MultisigSetDefaultsEvent
  isOpen: boolean
  onClose: () => void
}>) {
  const { hours, minutes, seconds } = getHoursMinutesSecondsFromSeconds(
    multisigTxn.expireInSecs,
  )
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Transaction Details"
      footer={<></>}
    >
      <Modal.Body>
        <HStack alignItems="center" mb={4}>
          <SettingsOutlineIcon boxSize={8} />
          <Text casing="capitalize">Multisig - Set Defaults</Text>
        </HStack>
        <DataField label="Required Approvers" value={multisigTxn.threshold} />
        <DataField label="Expire">
          <TxnExpireText hours={hours} minutes={minutes} seconds={seconds} />
        </DataField>
        <DataField
          label="Execute Automatically"
          value={multisigTxn.executeAutomatically ? "Yes" : "No"}
        />
      </Modal.Body>
    </Modal>
  )
}

function MultisigTxnDetailsModal({
  multisigTxn,
  isOpen,
  onClose,
}: Readonly<{
  multisigTxn: MultisigEvent
  isOpen: boolean
  onClose: () => void
}>) {
  const { token, account } = multisigTxn

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Transaction Details"
      footer={
        <Box w="full">
          <MultisigActions
            onActionDone={status => status === "success" && onClose()}
            accountAddress={account}
            txnToken={token!}
          />
        </Box>
      }
    >
      <Modal.Body>
        <SubmittedMultisigTxnDetails multisigTxn={multisigTxn} />
      </Modal.Body>
    </Modal>
  )
}
export function SubmittedMultisigTxnDetails({
  multisigTxn,
}: Readonly<{
  multisigTxn: MultisigEvent
}>) {
  const { token, time, id, account } = multisigTxn

  const base64TxnId = id ? encodeURIComponent(arrayBufferToBase64Url(id)) : null

  const getContactName = useGetContactName()

  const { data: accountInfoData, error: getAccountInfoError } =
    useGetAccountInfo(multisigTxn.account)

  const {
    data: maybeMultisigTxnInfoData,
    isLoading: isMultisigTxnInfoLoading,
    error: multisigTxnInfoError,
  } = useGetMultisigTxnInfo(token)
  const multisigTxnInfoData = maybeMultisigTxnInfoData?.info || []

  // Get the first result and compare it to the rest of the array, if any
  const maybeFirst =
    multisigTxnInfoData?.[0]?.info ?? ({} as MultisigTransactionInfo)

  // Are all the results the same?
  const isSame = multisigTxnInfoData?.every(({ info }) => info === maybeFirst)

  // If not, throw an error
  const maybeError = isSame
    ? undefined
    : new Error(
        "Discrepancy of the Multisig Transaction Info between networks.",
      )

  // Get the first result as the MultisigTransactionInfo
  // The destructured elements will be undefined if the map is empty
  const {
    memo,
    executeAutomatically,
    threshold,
    transaction,
    submitter,
    expireDate,
  } = maybeFirst

  const memoStr = memo && typeof memo[0] === "string" ? memo[0] : ""

  const submitterContactName = getContactName(submitter)

  const approvers = makeApproversMap(
    accountInfoData?.accountInfo?.roles,
    maybeFirst.approvers,
    getContactName,
  )

  const hasError = getAccountInfoError || multisigTxnInfoError || maybeError
  const isExpireDateExist = maybeFirst.expireDate

  if (hasError) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          <Text>
            {getAccountInfoError?.message ??
              multisigTxnInfoError?.message ??
              maybeError?.message}
          </Text>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      {isMultisigTxnInfoLoading ? (
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <Spinner size="lg" />
        </Box>
      ) : null}
      <SubmittedTxnData address={account} transaction={transaction} />

      <DataField label="Date" value={new Date(time).toLocaleString()} />

      <DataField
        label="Expire"
        value={
          isExpireDateExist
            ? new Date(expireDate * 1000).toLocaleString() // Date expects milliseconds
            : ""
        }
      />

      <DataField label="Submitted By">
        {submitterContactName && (
          <Text fontWeight="medium">{submitterContactName}</Text>
        )}
        <AddressText
          addressText={submitter ?? ""}
          bgColor={undefined}
          p={0}
          textProps={{ fontWeight: "medium" }}
        />
      </DataField>

      <DataField label="Approvers">
        <ApproversList approvers={approvers} />
      </DataField>

      <DataField label="Required Approvers" value={threshold} />

      <DataField label="Memo" value={memoStr} />

      <DataField
        label="Execute Automatically"
        value={executeAutomatically ? "Yes" : "No"}
      />

      {base64TxnId ? (
        <ShareLocationButton
          path={`/#/transactions/${base64TxnId}`}
          label={"Share this transaction"}
          mt={6}
        />
      ) : null}
    </>
  )
}

export function SubmittedTxnData({
  address,
  transaction,
}: Readonly<{
  address: string
  transaction: Omit<Event, "id" | "time"> | undefined
}>) {
  if (transaction?.type === EventType.send) {
    return (
      <SubmittedSendTxn
        address={address}
        transaction={transaction as SendEvent}
      />
    )
  }
  return null
}

function SubmittedSendTxn({
  address,
  transaction,
}: Readonly<{
  address: string
  transaction: SendEvent
}>) {
  const {
    title,
    TxnIcon,
    displayAmount,
    symbol,
    iconColor,
    toOrFromAddress,
    contactName,
  } = useSendTxn({
    address: address,
    txn: transaction,
  })

  return (
    <>
      <HStack alignItems="center" mb={4} justifyContent="space-between">
        <Flex alignItems="center" gap={4}>
          <TxnIcon boxSize={8} />
          <Text fontSize="lg" casing="capitalize">
            {title}
          </Text>
        </Flex>
      </HStack>
      <DataField label="Amount">
        <Flex mb={4}>
          <Text fontWeight="medium" color={iconColor}>
            {displayAmount}
          </Text>
          &nbsp;
          <Text>{symbol}</Text>
        </Flex>
      </DataField>

      <DataField label="To">
        {contactName && <Text fontWeight="medium">{contactName}</Text>}
        <AddressText
          mb={4}
          bgColor={undefined}
          p={0}
          textProps={{ fontWeight: "medium" }}
          addressText={toOrFromAddress}
        />
      </DataField>
    </>
  )
}

export function ApproversList({
  approvers,
}: Readonly<{
  approvers: {
    address: string
    hasApproved: boolean | undefined
    contactName?: string
  }[]
}>) {
  return (
    <>
      {approvers?.map(({ address, hasApproved, contactName }) => {
        return (
          <SimpleGrid key={address} templateColumns="30px 1fr" mb={3}>
            <Flex alignItems="center">
              {hasApproved === false && (
                <TimesCircleIcon boxSize={5} color="red.500" />
              )}
              {hasApproved === true && (
                <CheckCircleIcon boxSize={5} color="green.500" />
              )}
            </Flex>
            <Box overflow="hidden">
              {contactName && (
                <Text casing="capitalize" fontWeight="medium">
                  {contactName}
                </Text>
              )}
              <AddressText
                bgColor={undefined}
                p={0}
                addressText={address}
                textProps={{ fontWeight: "medium" }}
              />
            </Box>
          </SimpleGrid>
        )
      })}
    </>
  )
}

export function MultisigActions({
  accountAddress,
  txnToken,
  onActionDone: onDone,
}: Readonly<{
  accountAddress: string
  txnToken: ArrayBuffer
  onActionDone?: (status: "success" | "warning") => void
}>) {
  const toast = useToast()
  const activeIdentityAddress = useAccountsStore(s =>
    s.byId.get(s.activeId),
  )?.address

  const {
    doApprove,
    isApproveLoading,
    canApprove,
    canRevoke,
    doRevoke,
    isRevokeLoading,
    doWithdraw,
    canWithdraw,
    isWithdrawLoading,
    canExecute,
    doExecute,
    isExecuteLoading,
    isLoading,
    error,
    resetErrors,
  } = useMultisigActions({
    identityAddress: activeIdentityAddress!,
    accountAddress,
    txnToken,
  })

  function onActionDone(
    status: "success" | "warning",
    title: string,
    description: string,
  ) {
    if (status === "success") {
      toast({
        status,
        title,
        description,
      })
    }
    onDone?.(status)
  }

  return (
    <>
      {error ? (
        <Alert status="warning" rounded="md" mb={4}>
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <VStack alignItems="flex-start" w="full" spacing={8}>
        <VStack alignItems="flex-start" w="full">
          {canApprove && (
            <Button
              variant="outline"
              colorScheme="brand.teal"
              isFullWidth
              isLoading={isApproveLoading}
              disabled={isLoading}
              onClick={e => {
                e.preventDefault()
                resetErrors()
                const title = "Approve"
                doApprove(undefined, {
                  onSuccess: () => {
                    onActionDone("success", title, "Transaction was approved")
                  },
                  onError: (err: { message: string }) => {
                    onActionDone("warning", title, err?.message)
                  },
                })
              }}
            >
              Approve
            </Button>
          )}

          {canRevoke && (
            <Button
              disabled={isLoading}
              variant="outline"
              colorScheme="brand.teal"
              isFullWidth
              isLoading={isRevokeLoading}
              onClick={e => {
                e.preventDefault()
                resetErrors()
                const title = "Revoke"
                doRevoke(undefined, {
                  onSuccess: () => {
                    onActionDone("success", title, "Transaction was revoked")
                  },
                  onError: (err: { message: string }) => {
                    onActionDone("warning", title, err?.message)
                  },
                })
              }}
            >
              Revoke
            </Button>
          )}
          {canWithdraw && (
            <Button
              disabled={isLoading}
              variant="outline"
              colorScheme="brand.teal"
              isFullWidth
              isLoading={isWithdrawLoading}
              onClick={e => {
                e.preventDefault()
                resetErrors()
                const title = "Withdraw"
                doWithdraw(undefined, {
                  onSuccess: () => {
                    onActionDone("success", title, "Transaction was withdrawn")
                  },
                  onError: (err: { message: string }) => {
                    onActionDone("warning", title, err?.message)
                  },
                })
              }}
            >
              Withdraw
            </Button>
          )}
        </VStack>
        {canExecute && (
          <Button
            disabled={isLoading}
            isLoading={isExecuteLoading}
            colorScheme="brand.teal"
            isFullWidth
            onClick={e => {
              e.preventDefault()
              resetErrors()
              const title = "Execute"
              doExecute(undefined, {
                onSuccess: () => {
                  onActionDone("success", title, "Transaction was executed")
                },
                onError: (err: { message: string }) => {
                  onActionDone("warning", title, err?.message)
                },
              })
            }}
          >
            Execute
          </Button>
        )}
      </VStack>
    </>
  )
}

export function makeApproversMap(
  currRoles: Map<string, string[]> = new Map(),
  approvers: Map<string, boolean> = new Map(),
  getContactName: (s: string) => string,
) {
  return Array.from(currRoles).reduce(
    (acc, roleData) => {
      const [address, roleList] = roleData as [string, string[]]

      const hasApproverRole = approverRoles.some(r => roleList.includes(r))

      if (!hasApproverRole) {
        return acc
      }

      acc.push({
        address,
        hasApproved: approvers?.get(address),
        contactName: getContactName(address),
      })

      return acc
    },
    [] as {
      address: string
      hasApproved: boolean | undefined
      contactName?: string
    }[],
  )
}

export function getTxnStateText(state?: string) {
  return state ? txnStateText[state] : ""
}

const txnStateText = {
  [MultisigTransactionState[MultisigTransactionState.pending]]: "pending",
  [MultisigTransactionState[MultisigTransactionState.executedAutomatically]]:
    "executed automatically",
  [MultisigTransactionState[MultisigTransactionState.executedManually]]:
    "executed manually",
  [MultisigTransactionState[MultisigTransactionState.expired]]: "expired",
  [MultisigTransactionState[MultisigTransactionState.withdrawn]]: "withdrawn",
}
