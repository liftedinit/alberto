import {
  EventType,
  MultisigSubmitEvent,
  SendEvent,
  Event,
  MultisigEvent,
  MultisigSetDefaultsEvent,
} from "many-js"
import {
  AddressText,
  Button,
  Box,
  CheckCircleIcon,
  DataField,
  Flex,
  HStack,
  Modal,
  SimpleGrid,
  TimesCircleIcon,
  Text,
  useToast,
  VStack,
  SettingsOutlineIcon,
  TxnExpireText,
} from "components"
import { useGetContactName } from "features/contacts"
import {
  approverRoles,
  useAccountsStore,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
} from "features/accounts"
import React from "react"
import { useMultisigActions, useMultisigTxn, useSendTxn } from "./hooks"
import { BaseTxnListItem } from "./base-txn-list-item"
import { BaseTxnDetails } from "./base-txn-details"
import { getHoursMinutesSecondsFromSeconds } from "helper/convert"

export function MultisigTxnListItem({ txn }: { txn: MultisigEvent }) {
  const { time, token } = txn
  const { actionLabel, actorAddress, txnLabel, TxnIcon, iconProps } =
    useMultisigTxn(txn)

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
          <Flex justifyContent="flex-end">
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
  const toast = useToast()
  const activeIdentityAddress = useAccountsStore(s =>
    s.byId.get(s.activeId),
  )?.address

  const getContactName = useGetContactName()

  const { data: accountInfoData } = useGetAccountInfo(multisigTxn.account)

  const { token, time } = multisigTxn

  const { data: multisigTxnInfoData } = useGetMultisigTxnInfo(token)

  const { memo, executeAutomatically, threshold, transaction, submitter } =
    (multisigTxnInfoData?.info ?? {}) as MultisigSubmitEvent

  const submitterContactName = getContactName(submitter)

  const approvers = React.useMemo(() => {
    const accountRoles = accountInfoData?.accountInfo?.roles ?? new Map()

    return Array.from(accountRoles).reduce(
      (
        acc: {
          address: string
          hasApproved: boolean | undefined
          contactName?: string
        }[],
        roleData,
      ) => {
        const [address, roleList] = roleData as [string, string[]]

        const hasApproverRole = approverRoles.some(r => roleList.includes(r))

        if (!hasApproverRole) {
          return acc
        }

        acc.push({
          address,
          hasApproved: multisigTxnInfoData?.info?.approvers?.get(address),
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
  }, [accountInfoData, multisigTxnInfoData, getContactName])

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
  } = useMultisigActions({
    identityAddress: activeIdentityAddress!,
    accountAddress: multisigTxn.account,
    txnToken: token!,
  })

  function onActionDone(
    status: "success" | "warning",
    title: string,
    description: string,
  ) {
    toast({
      status,
      title,
      description,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Transaction Details"
      footer={
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
                  const title = "Withdraw"
                  doWithdraw(undefined, {
                    onSuccess: () => {
                      onActionDone(
                        "success",
                        title,
                        "Transaction was withdrawn",
                      )
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
      }
    >
      <Modal.Body>
        <SubmittedTxnData
          address={multisigTxn.account}
          transaction={transaction}
        />

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
      </Modal.Body>
    </Modal>
  )
}

function SubmittedTxnData({
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
      <HStack alignItems="center" mb={4}>
        <TxnIcon boxSize={8} />
        <Text casing="capitalize">{title}</Text>
      </HStack>
      <DataField label="Amount">
        <Flex mb={4}>
          <Text fontWeight="medium" color={iconColor}>
            {displayAmount}
          </Text>
          &nbsp;
          <Text fontWeight="medium">{symbol}</Text>
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

function ApproversList({
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
