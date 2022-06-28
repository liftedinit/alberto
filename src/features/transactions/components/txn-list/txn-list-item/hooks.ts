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
} from "many-js"
import {
  CheckCircleIcon,
  MinusCircleIcon,
  PendingIcon,
  ReceiveIcon,
  SendOutlineIcon,
  UndoIcon,
  ExecuteIcon,
  SettingsOutlineIcon,
} from "components"
import { amountFormatter } from "helper/common"
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
        TxnIcon: ExecuteIcon,
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
