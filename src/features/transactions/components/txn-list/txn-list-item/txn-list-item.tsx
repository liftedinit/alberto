import {
  LedgerTransactionType,
  MultisigSubmitTransaction,
  SendTransaction,
  AccountRole,
} from "many-js"
import type { Transaction, MultisigApproveTransaction } from "many-js"
import {
  AddressText,
  Button,
  Box,
  ChevronRightIcon,
  CheckCircleIcon,
  Flex,
  Heading,
  HStack,
  Modal,
  MinusCircleIcon,
  PendingIcon,
  ReceiveIcon,
  SendOutlineIcon,
  SimpleGrid,
  Td,
  Tr,
  TimesCircleIcon,
  Text,
  UndoIcon,
  useToast,
  useDisclosure,
  VStack,
  ExecuteIcon,
} from "components"
import { amountFormatter } from "helper/common"
import { useContactsStore } from "features/contacts"
import {
  approverRoles,
  multisigTxnTypes,
  useAccountsStore,
  useAccountStore,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
  useMultisigApprove,
  useMultisigExecute,
  useMultisigRevoke,
  useMultisigWithdraw,
} from "features/accounts"
import React from "react"
import {
  MultisigTransaction,
  MultisigRevokeTransaction,
  MultisigExecuteTransaction,
  MultisigWithdrawTransaction,
} from "many-js/dist/network/modules/ledger/ledger"
import { useLedgerInfo } from "features/network"

export function TxnListItem({
  transaction,
  address,
}: {
  transaction: Transaction
  address: string
}) {
  const txnTypeName = transaction.type as LedgerTransactionType
  if (txnTypeName === LedgerTransactionType.send) {
    return (
      <SendTxnListItem txn={transaction as SendTransaction} address={address} />
    )
  } else if (isMultisigTxnType(transaction.type)) {
    return <MultisigTxnListItem txn={transaction as MultisigTransaction} />
  }
  return null
}

function SendTxnListItem({
  txn,
  address,
}: {
  txn: SendTransaction
  address: string
}) {
  const time = txn.time
  const {
    TxnIcon,
    iconColor,
    title,
    toOrFromLabel,
    contactName,
    toOrFromAddress,
    displayAmount,
    symbol,
  } = useSendTxn({
    address,
    txn: txn as SendTransaction,
  })
  return (
    <TxnItemRow
      first={
        <HStack>
          <TxnIcon />
          <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
            <Text lineHeight="normal" casing="capitalize">
              {title}
            </Text>
            <Text fontSize="xs">{time?.toLocaleString()}</Text>
          </VStack>
        </HStack>
      }
      second={
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="sm" pb={1}>
            {toOrFromLabel}
          </Text>
          {contactName && <Text fontWeight="medium">{contactName}</Text>}
          <AddressText
            addressText={toOrFromAddress}
            bgColor={undefined}
            px={0}
            py={0}
            fontSize="sm"
          />
        </VStack>
      }
      third={
        <Flex gap={2} justifyContent="flex-end">
          <Text fontWeight="medium" color={iconColor} justifySelf="flex-end">
            {displayAmount}
          </Text>
          <Text>{symbol}</Text>
        </Flex>
      }
    />
  )
}

function MultisigTxnListItem({ txn }: { txn: MultisigTransaction }) {
  const { time, token } = txn
  const { actionLabel, actorAddress, txnLabel, TxnIcon, iconProps } =
    useMultisigTxn(txn)

  const contactName = useContactName(actorAddress)

  return (
    <TxnItemRow
      first={
        <HStack>
          <TxnIcon {...iconProps} />
          <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
            <Text lineHeight="normal" casing="capitalize">
              {txnLabel}
            </Text>
            <Text fontSize="xs">{time?.toLocaleString()}</Text>
          </VStack>
        </HStack>
      }
      second={
        <>
          <VStack alignItems="flex-start" spacing={0}>
            <Text fontSize="sm" pb={1}>
              {actionLabel}
            </Text>
            {contactName && <Text fontWeight="medium">{contactName}</Text>}
            <AddressText
              addressText={actorAddress}
              bgColor={undefined}
              px={0}
              py={0}
              fontSize="sm"
            />
          </VStack>
        </>
      }
      third={
        token ? (
          <Flex justifyContent="flex-end">
            <MultisigTxnDetails multisigTxn={txn} />
          </Flex>
        ) : null
      }
    />
  )
}

function useMultisigTxn(txn: MultisigTransaction) {
  let data: {
    actionLabel: string
    actorAddress: string
    txnLabel: string
    TxnIcon: React.FunctionComponent
    iconProps?: Record<string, unknown>
  } = {
    actionLabel: "",
    actorAddress: "",
    txnLabel: "",
    TxnIcon: () => <></>,
    iconProps: {},
  }
  switch (txn.type) {
    case LedgerTransactionType.accountMultisigApprove:
      data = {
        actionLabel: "Approved By:",
        actorAddress: (txn as MultisigApproveTransaction).approver,
        txnLabel: "Multisig - Approve",
        TxnIcon: CheckCircleIcon,
        iconProps: {
          color: "green.500",
        },
      }
      break
    case LedgerTransactionType.accountMultisigExecute:
      data = {
        actionLabel: "Executed By:",
        actorAddress: (txn as MultisigExecuteTransaction).executor,
        txnLabel: "Multisig - Execute",
        TxnIcon: ExecuteIcon,
      }
      break
    case LedgerTransactionType.accountMultisigRevoke:
      data = {
        actionLabel: "Revoked By:",
        actorAddress: (txn as MultisigRevokeTransaction).revoker,
        txnLabel: "Multisig - Revoke",
        TxnIcon: UndoIcon,
      }
      break
    case LedgerTransactionType.accountMultisigSubmit:
      data = {
        actionLabel: "Submitted By:",
        actorAddress: (txn as MultisigSubmitTransaction).submitter,
        txnLabel: "Multisig - Submit",
        TxnIcon: PendingIcon,
        iconProps: { color: "orange" },
      }
      break
    case LedgerTransactionType.accountMultisigWithdraw:
      data = {
        actionLabel: "Withdrawn By:",
        actorAddress: (txn as MultisigWithdrawTransaction).withdrawer,
        txnLabel: "Multisig - Withdraw",
        TxnIcon: MinusCircleIcon,
      }
      break
    default:
      break
  }
  return data
}

function useContactName(address: string) {
  const contacts = useContactsStore(s => s.byId)
  const identities = useAccountsStore(s => Array.from(s.byId).map(a => a[1]))
  const accounts = useAccountStore(s => s.byId)
  const contactName =
    contacts.get(address)?.name ??
    (accounts.get(address)?.name as string) ??
    identities.find(acc => acc.address === address)?.name

  return contactName
}

function useSendTxn({
  address,
  txn,
}: {
  address: string
  txn: SendTransaction
}) {
  const { data } = useLedgerInfo({ address })
  const symbols = data!.symbols

  const isSender = address === txn.from
  const { to, from, amount, symbolAddress } = txn as SendTransaction
  const TxnIcon = isSender ? SendOutlineIcon : ReceiveIcon
  const iconColor = isSender ? "red" : "green.500"
  const title = isSender ? "send" : "receive"

  const displayAmount = `${isSender ? "-" : "+"}${amountFormatter(amount)}`
  const toOrFromAddress = isSender ? to! : from!
  const contactName = useContactName(toOrFromAddress)

  return {
    title,
    TxnIcon,
    iconColor,
    toOrFromLabel: isSender ? "To:" : "From:",
    displayAmount,
    toOrFromAddress,
    contactName,
    symbol: symbols.get(symbolAddress),
  }
}

function useMultisigActions({
  identityAddress,
  accountAddress,
  txnToken,
}: {
  identityAddress: string
  accountAddress: string
  txnToken: ArrayBuffer
}) {
  const { data: accountInfoData } = useGetAccountInfo(accountAddress)

  const rolesForIdentity =
    accountInfoData?.accountInfo?.roles?.get(identityAddress)

  const { data: multisigTxnInfoData } = useGetMultisigTxnInfo(txnToken)

  const approvers = multisigTxnInfoData?.info?.approvers ?? new Map()

  const isApprover = rolesForIdentity?.some(r => approverRoles.includes(r))

  const isSubmitter = multisigTxnInfoData?.info?.submitter === identityAddress

  const isOwner = !!accountInfoData?.accountInfo?.roles
    ?.get(identityAddress)
    ?.includes(AccountRole[AccountRole.owner])

  const isThresholdReached =
    Array.from(multisigTxnInfoData?.info?.approvers ?? new Map()).reduce(
      (acc, approver) => {
        const [, hasApproved] = approver
        if (hasApproved) acc += 1
        return acc
      },
      0,
    ) >= (multisigTxnInfoData?.info?.threshold ?? Infinity)

  const { mutate: doWithdraw, isLoading: isWithdrawLoading } =
    useMultisigWithdraw(txnToken)
  const canWithdraw = isSubmitter || isOwner

  const { mutate: doApprove, isLoading: isApproveLoading } =
    useMultisigApprove(txnToken)
  const canApprove = approvers?.get(identityAddress)
    ? false
    : !!rolesForIdentity?.some(r => approverRoles.includes(r))

  const { mutate: doRevoke, isLoading: isRevokeLoading } =
    useMultisigRevoke(txnToken)
  const canRevoke =
    isApprover &&
    (!approvers.has(identityAddress) || approvers.get(identityAddress) === true)

  const { mutate: doExecute, isLoading: isExecuteLoading } =
    useMultisigExecute(txnToken)
  const canExecute = isThresholdReached && (isSubmitter || isOwner)

  const isLoading =
    isApproveLoading || isRevokeLoading || isWithdrawLoading || isExecuteLoading

  return {
    canWithdraw,
    doWithdraw,
    isWithdrawLoading,
    canApprove,
    doApprove,
    isApproveLoading,
    doRevoke,
    isRevokeLoading,
    canRevoke,
    canExecute,
    doExecute,
    isExecuteLoading,
    isLoading,
  }
}

function MultisigTxnDetailsModal({
  multisigTxn,
  isOpen,
  onClose,
}: {
  multisigTxn: MultisigTransaction
  isOpen: boolean
  onClose: () => void
}) {
  const toast = useToast()
  const activeIdentityAddress = useAccountsStore(s =>
    s.byId.get(s.activeId),
  )?.address

  const { data: accountInfoData } = useGetAccountInfo(multisigTxn.account)

  const { token, time } = multisigTxn

  const { data: multisigTxnInfoData } = useGetMultisigTxnInfo(token)

  const { memo, execute_automatically, threshold, transaction, submitter } =
    (multisigTxnInfoData?.info ?? {}) as MultisigSubmitTransaction

  const approvers = React.useMemo(() => {
    const accountRoles = accountInfoData?.accountInfo?.roles ?? new Map()

    return Array.from(accountRoles).reduce((acc, roleData) => {
      const [address, roleList] = roleData as [string, string[]]

      const hasApproverRole = approverRoles.some(r => roleList.includes(r))

      if (!hasApproverRole) {
        return acc
      }

      acc.push({
        address,
        hasApproved: multisigTxnInfoData?.info?.approvers?.get(address),
      })

      return acc
    }, [] as { address: string; hasApproved: boolean | undefined }[])
  }, [accountInfoData, multisigTxnInfoData])

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
    txnToken: token,
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
        <Heading size="sm" mb={1} opacity={0.6}>
          Date
        </Heading>
        <Text mb={4} fontWeight="medium">
          {new Date(time).toLocaleString()}
        </Text>

        <Heading size="sm" mb={1} opacity={0.6}>
          Expire
        </Heading>
        <Text mb={4} fontWeight="medium">
          {multisigTxnInfoData?.info?.timeout
            ? new Date(multisigTxnInfoData?.info.timeout).toLocaleString()
            : ""}
        </Text>

        <Heading size="sm" mb={1} opacity={0.6}>
          Submitter
        </Heading>
        <AddressText
          addressText={submitter ?? ""}
          mb={4}
          bgColor={undefined}
          p={0}
          textProps={{ fontWeight: "semibold" }}
        />

        <Heading size="sm" mb={1} opacity={0.6}>
          Approvers
        </Heading>
        <Box mb={4}>
          <ApproversList approvers={approvers} />
        </Box>

        <Heading size="sm" mb={1} opacity={0.6}>
          Required Approvers
        </Heading>
        <Text mb={4} fontWeight="medium">
          {threshold}
        </Text>

        <Heading size="sm" mb={1} opacity={0.6}>
          Memo
        </Heading>
        <Text mb={4} fontWeight="medium">
          {memo}
        </Text>

        <Heading size="sm" mb={1} opacity={0.6}>
          Execute Automatically
        </Heading>
        <Text fontWeight="medium">
          {execute_automatically === true ? "Yes" : "No"}
        </Text>
      </Modal.Body>
    </Modal>
  )
}

function MultisigTxnDetails({
  multisigTxn,
}: {
  multisigTxn: MultisigTransaction
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ChevronRightIcon cursor="pointer" onClick={onOpen} />
      {isOpen && (
        <MultisigTxnDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          multisigTxn={multisigTxn}
        />
      )}
    </>
  )
}

function SubmittedTxnData({
  address,
  transaction,
}: {
  address: string
  transaction: Omit<Transaction, "id" | "time"> | undefined
}) {
  if (transaction?.type === LedgerTransactionType.send) {
    return (
      <SubmittedSendTxn
        address={address}
        transaction={transaction as SendTransaction}
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
  transaction: SendTransaction
}) {
  const { title, TxnIcon, displayAmount, symbol, iconColor, toOrFromAddress } =
    useSendTxn({
      address: address,
      txn: transaction,
    })

  return (
    <>
      <HStack alignItems="center" mb={4}>
        <TxnIcon boxSize={8} />
        <Text casing="capitalize">{title}</Text>
      </HStack>
      <Heading size="sm" mb={1} opacity={0.6}>
        Amount
      </Heading>
      <Flex mb={4}>
        <Text color={iconColor}>{displayAmount}</Text>&nbsp;
        <Text>{symbol}</Text>
      </Flex>
      <Heading size="sm" mb={1} opacity={0.6}>
        To
      </Heading>
      <AddressText
        mb={4}
        bgColor={undefined}
        p={0}
        textProps={{ fontWeight: "semibold" }}
        addressText={toOrFromAddress}
      />
    </>
  )
}

function ApproversList({
  approvers,
}: {
  approvers: { address: string; hasApproved: boolean | undefined }[]
}) {
  return (
    <>
      {approvers?.map(({ address, hasApproved }) => {
        return (
          <SimpleGrid key={address} templateColumns="30px 1fr" mb={2}>
            <Flex alignItems="center">
              {hasApproved === false && (
                <TimesCircleIcon boxSize={5} color="red.500" />
              )}
              {hasApproved === true && (
                <CheckCircleIcon boxSize={5} color="green.500" />
              )}
            </Flex>
            <Box overflow="hidden">
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

function TxnItemRow({
  first,
  second,
  third,
  rowProps,
}: {
  first: React.ReactNode
  second: React.ReactNode
  rowProps?: Record<string, unknown>
  third: React.ReactNode
}) {
  return (
    <Tr aria-label="transaction list item" {...rowProps}>
      <Td>{first}</Td>
      <Td>{second}</Td>
      <Td>{third}</Td>
    </Tr>
  )
}

function isMultisigTxnType(type: LedgerTransactionType) {
  return multisigTxnTypes.some(t => t === type)
}
