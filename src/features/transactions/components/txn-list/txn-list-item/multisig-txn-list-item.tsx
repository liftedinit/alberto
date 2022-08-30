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
  ButtonProps,
  Box,
  CheckCircleIcon,
  CopyToClipboard,
  DataField,
  Flex,
  HStack,
  LinkIcon,
  Modal,
  SettingsOutlineIcon,
  SimpleGrid,
  Spinner,
  Text,
  TimesCircleIcon,
  TxnExpireText,
  useToast,
  VStack,
} from "components"
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
import {
  arrayBufferToBase64,
  getHoursMinutesSecondsFromSeconds,
} from "helper/convert"

export function MultisigTxnListItem({ txn }: { txn: MultisigEvent }) {
  const { time, token } = txn
  const { actionLabel, actorAddress, txnLabel, TxnIcon, iconProps } =
    useMultisigTxn(txn)

  const { data: multisigTxnInfoData } = useGetMultisigTxnInfo(token)
  const { state } = multisigTxnInfoData?.info ?? {}
  const stateText = getTxnStateText(state)

  const getContactName = useGetContactName()
  const contactName = getContactName(actorAddress)

  return (
    <BaseTxnListItem
      icon={<TxnIcon {...iconProps} />}
      txnTypeName={txnLabel}
      txnTime={time?.toLocaleString()}
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

function MultisigTxnDetails({ multisigTxn }: { multisigTxn: MultisigEvent }) {
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
}: {
  multisigTxn: MultisigSetDefaultsEvent
  isOpen: boolean
  onClose: () => void
}) {
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
}: {
  multisigTxn: MultisigEvent
  isOpen: boolean
  onClose: () => void
}) {
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
}: {
  multisigTxn: MultisigEvent
}) {
  const { token, time, id, account } = multisigTxn

  const base64TxnId = id ? encodeURIComponent(arrayBufferToBase64(id)) : null

  const getContactName = useGetContactName()

  const { data: accountInfoData, error: getAccountInfoError } =
    useGetAccountInfo(multisigTxn.account)

  const {
    data: multisigTxnInfoData,
    isLoading: isMultisigTxnInfoLoading,
    error: multisigTxnInfoError,
  } = useGetMultisigTxnInfo(token)

  const { memo, executeAutomatically, threshold, transaction, submitter } =
    (multisigTxnInfoData?.info ?? {}) as MultisigTransactionInfo

  const submitterContactName = getContactName(submitter)

  const approvers = makeApproversMap(
    accountInfoData?.accountInfo?.roles,
    multisigTxnInfoData?.info?.approvers,
    getContactName,
  )

  if (getAccountInfoError || multisigTxnInfoError) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          <Text>
            {getAccountInfoError?.message ?? multisigTxnInfoError?.message}
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
          multisigTxnInfoData?.info?.expireDate
            ? new Date(multisigTxnInfoData?.info.expireDate).toLocaleString()
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
          textProps={{ fontWeight: "semibold" }}
        />
      </DataField>

      <DataField label="Approvers">
        <ApproversList approvers={approvers} />
      </DataField>

      <DataField label="Required Approvers" value={threshold} />

      <DataField label="Memo" value={memo} />

      <DataField
        label="Execute Automatically"
        value={executeAutomatically ? "Yes" : "No"}
      />

      {base64TxnId ? <ShareTxnButton base64TxnId={base64TxnId} mt={6} /> : null}
    </>
  )
}

export function SubmittedTxnData({
  address,
  transaction,
}: {
  address: string
  transaction: Omit<Event, "id" | "time"> | undefined
}) {
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
}: {
  address: string
  transaction: SendEvent
}) {
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
          textProps={{ fontWeight: "semibold" }}
          addressText={toOrFromAddress}
        />
      </DataField>
    </>
  )
}

export function ApproversList({
  approvers,
}: {
  approvers: {
    address: string
    hasApproved: boolean | undefined
    contactName?: string
  }[]
}) {
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
                textProps={{ fontWeight: "semibold" }}
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
}: {
  accountAddress: string
  txnToken: ArrayBuffer
  onActionDone?: (status: "success" | "warning") => void
}) {
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
                  onError: err => {
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
                  onError: err => {
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
                  onError: err => {
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
                onError: err => {
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

export function ShareTxnButton({
  base64TxnId,
  ...props
}: ButtonProps & {
  base64TxnId: string
}) {
  return (
    <CopyToClipboard
      msg="Link copied!"
      toCopy={window.location.origin + `/#/transactions/${base64TxnId}`}
    >
      {({ onCopy }) => (
        <Button
          size="sm"
          variant="link"
          onClick={onCopy}
          leftIcon={<LinkIcon boxSize={4} />}
          {...props}
        >
          Share this transaction
        </Button>
      )}
    </CopyToClipboard>
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
