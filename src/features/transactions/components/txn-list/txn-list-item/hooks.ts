import React from "react"
import {
  AccountRole,
  EventType,
  MultisigSubmitEvent,
  MultisigApproveEvent,
  SendEvent,
  MultisigEvent,
  MultisigRevokeEvent,
  MultisigExecuteEvent,
  MultisigWithdrawEvent,
  MultisigSetDefaultsEvent,
  BurnEvent,
  MintEvent,
  MultisigTransactionInfo,
  TokenCreateEvent,
} from "@liftedinit/many-js"
import {
  CheckCircleIcon,
  LightningIcon,
  PendingIcon,
  ReceiveIcon,
  SendOutlineIcon,
  UndoIcon,
  SettingsOutlineIcon,
  amountFormatter,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@liftedinit/ui"
import {
  approverRoles,
  useGetAccountInfo,
  useGetMultisigTxnInfo,
  useMultisigApprove,
  useMultisigExecute,
  useMultisigRevoke,
  useMultisigWithdraw,
} from "features/accounts"
import { useLedgerInfo } from "features/network"
import { useGetContactName } from "features/contacts/hooks"

export function useSendTxn({
  address,
  txn,
}: {
  address: string
  txn: SendEvent
}) {
  const { data } = useLedgerInfo({ address })
  const symbols = data!.symbols

  const isSender = address === txn.from
  const { to, from, amount, symbolAddress } = txn as SendEvent
  const TxnIcon = isSender ? SendOutlineIcon : ReceiveIcon
  const iconColor = isSender ? "red" : "green.500"
  const title = isSender ? "send" : "receive"

  const displayAmount = `${isSender ? "-" : "+"}${amountFormatter(amount)}`
  const toOrFromAddress = isSender ? to! : from!
  const getContactName = useGetContactName()
  const contactName = getContactName(toOrFromAddress)

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

export function useTokenCreateTxn({
  address,
  txn,
}: {
  address: string
  txn: TokenCreateEvent
}) {
  const { summary } = txn
  const TxnIcon = PlusCircleIcon
  const title = "create token"

  const name = summary.name
  const symbol = summary.symbol

  return {
    title,
    TxnIcon,
    name,
    symbol,
  }
}

export function useMintBurnTxn({
  address,
  txn,
}: {
  address: string
  txn: MintEvent | BurnEvent
}) {
  const { data } = useLedgerInfo({ address })
  const symbols = data!.symbols

  const isMint = txn.type === EventType.mint
  const { amounts, symbolAddress } = txn as MintEvent

  // Try getting the amount for the current address. If it doesn't exist, then
  // it means that the address initiated the mint/burn but was not the recipient
  const maybeAmount = amounts[address]
  let displayAmount: string
  let amount: bigint
  if (maybeAmount !== undefined) {
    amount = BigInt(amounts[address])
  } else {
    // If the address is not a recipient, then we need to sum up all the amounts
    amount = Object.values(amounts).reduce(
      (acc, amount) => acc + BigInt(amount),
      BigInt(0),
    )
  }
  displayAmount = `${isMint ? "+" : "-"}${amountFormatter(amount)}`
  const TxnIcon = isMint ? PlusCircleIcon : MinusCircleIcon
  const iconColor = isMint ? "green.500" : "red"
  const title = isMint ? "mint" : "burn"

  return {
    title,
    TxnIcon,
    iconColor,
    displayAmount,
    symbol: symbols.get(symbolAddress),
  }
}

export function useMultisigTxn(txn: MultisigEvent) {
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
    TxnIcon: () => null,
    iconProps: {},
  }
  switch (txn.type) {
    case EventType.accountMultisigApprove:
      data = {
        actionLabel: "Approved By:",
        actorAddress: (txn as MultisigApproveEvent).approver,
        txnLabel: "Multisig - Approve",
        TxnIcon: CheckCircleIcon,
        iconProps: {
          color: "green.500",
        },
      }
      break
    case EventType.accountMultisigExecute:
      data = {
        actionLabel: (txn as MultisigExecuteEvent).executor
          ? "Executed By:"
          : "Executed Automatically",
        actorAddress: (txn as MultisigExecuteEvent).executor,
        txnLabel: "Multisig - Execute",
        TxnIcon: LightningIcon,
      }
      break
    case EventType.accountMultisigRevoke:
      data = {
        actionLabel: "Revoked By:",
        actorAddress: (txn as MultisigRevokeEvent).revoker,
        txnLabel: "Multisig - Revoke",
        TxnIcon: UndoIcon,
      }
      break
    case EventType.accountMultisigSubmit:
      data = {
        actionLabel: "Submitted By:",
        actorAddress: (txn as MultisigSubmitEvent).submitter,
        txnLabel: "Multisig - Submit",
        TxnIcon: PendingIcon,
        iconProps: { color: "orange" },
      }
      break
    case EventType.accountMultisigWithdraw:
      data = {
        actionLabel: "Withdrawn By:",
        actorAddress: (txn as MultisigWithdrawEvent).withdrawer,
        txnLabel: "Multisig - Withdraw",
        TxnIcon: MinusCircleIcon,
      }
      break
    case EventType.accountMultisigSetDefaults:
      data = {
        actionLabel: "Submitted By:",
        actorAddress: (txn as MultisigSetDefaultsEvent).submitter,
        txnLabel: "Multisig - Set Defaults",
        TxnIcon: SettingsOutlineIcon,
      }
      break
    default:
      break
  }
  return data
}

export function useMultisigActions({
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

  const { data: maybeMultisigTxnInfoData } = useGetMultisigTxnInfo(txnToken)
  const { isLegacyOnly, info: multisigTxnInfoData } =
    maybeMultisigTxnInfoData ?? {}

  // Get the first result and compare it to the rest of the array, if any
  const maybeFirst =
    multisigTxnInfoData?.[0]?.info ?? ({} as MultisigTransactionInfo)

  const approvers = maybeFirst.approvers ?? new Map<string, boolean>()
  const isApprover = rolesForIdentity?.some(r => approverRoles.includes(r))
  const isSubmitter = maybeFirst.submitter === identityAddress
  const state = maybeFirst.state

  const isOwner = !!accountInfoData?.accountInfo?.roles
    ?.get(identityAddress)
    ?.includes(AccountRole[AccountRole.owner])

  const isThresholdReached =
    Array.from(approvers).reduce(
      (acc, [, hasApproved]) => acc + (hasApproved ? 1 : 0),
      0,
    ) >= (maybeFirst.threshold ?? Infinity)

  // Are all the results the same?
  const isSame = multisigTxnInfoData?.every(({ info }) => info === maybeFirst)
  if (isSame === false) {
    throw new Error(
      "Discrepancy of the Multisig Transaction Info between networks.",
    )
  }

  const createMutateHook = (hook: any) => {
    const { reset, mutate, isLoading, error } = hook(txnToken)
    return {
      reset,
      mutate,
      isLoading,
      error,
    }
  }

  const {
    reset: resetWithdraw,
    mutate: doWithdraw,
    isLoading: isWithdrawLoading,
    error: withdrawError,
  } = createMutateHook(useMultisigWithdraw)
  const {
    reset: resetApprove,
    mutate: doApprove,
    isLoading: isApproveLoading,
    error: approveError,
  } = createMutateHook(useMultisigApprove)
  const {
    reset: resetRevoke,
    mutate: doRevoke,
    isLoading: isRevokeLoading,
    error: revokeError,
  } = createMutateHook(useMultisigRevoke)
  const {
    reset: resetExecute,
    mutate: doExecute,
    isLoading: isExecuteLoading,
    error: executeError,
  } = createMutateHook(useMultisigExecute)

  const txIsPending = state === "pending" // TODO: Use MultisigTransactionState enum from many-js

  const canWithdraw = (isSubmitter || isOwner) && !isLegacyOnly && txIsPending
  const canApprove =
    !approvers?.get(identityAddress) &&
    isApprover &&
    !isLegacyOnly &&
    txIsPending
  const canRevoke =
    isApprover &&
    (!approvers.has(identityAddress) ||
      approvers.get(identityAddress) === true) &&
    !isLegacyOnly &&
    txIsPending
  const canExecute =
    isThresholdReached &&
    (isSubmitter || isOwner) &&
    !isLegacyOnly &&
    txIsPending

  const isLoading =
    isApproveLoading || isRevokeLoading || isWithdrawLoading || isExecuteLoading
  const error = (withdrawError || approveError || revokeError || executeError)
    ?.message

  function resetErrors() {
    resetApprove()
    resetExecute()
    resetRevoke()
    resetWithdraw()
  }

  return {
    error,
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
    resetErrors,
  }
}
