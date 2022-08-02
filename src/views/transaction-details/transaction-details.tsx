import { useParams } from "react-router-dom"
import {
  Box,
  Breadcrumb,
  Container,
  Spinner,
  Text,
  Alert,
  AlertDescription,
  AlertIcon,
  DataField,
  AddressText,
} from "components"
import { useGetAccountInfo, useGetMultisigTxnInfo } from "features/accounts"
import { base64ToArrayBuffer } from "helper/convert"
import {
  ApproversList,
  getTxnStateText,
  makeApproversMap,
  MultisigActions,
  ShareTxnButton,
  SubmittedTxnData,
  useTransactionsList,
} from "features/transactions"
import {
  BoundType,
  MultisigSubmitEvent,
  MultisigTransactionState,
} from "many-js"
import { useGetContactName } from "features/contacts"

export function TransactionDetails() {
  return (
    <Container mt={4} maxW="md">
      <Box mb={4}>
        <Breadcrumb>
          <Breadcrumb.BreadcrumbItem>
            <Breadcrumb.BreadcrumbLink to="">
              Transaction Details
            </Breadcrumb.BreadcrumbLink>
          </Breadcrumb.BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box bgColor="white" rounded="md" shadow="md" position="relative" p={4}>
        <TxnDetails />
      </Box>
    </Container>
  )
}

function TxnDetails() {
  const { txnId } = useParams()

  const base64TxnId = txnId ? encodeURIComponent(txnId) : ""

  const txnIdBytes = txnId
    ? base64ToArrayBuffer(decodeURIComponent(txnId))
    : undefined

  const getContactName = useGetContactName()

  const {
    data,
    isLoading,
    error: txnListError,
  } = useTransactionsList({
    filter: {
      ...(txnIdBytes
        ? {
            txnIdRange: [
              {
                boundType: BoundType.inclusive,
                value: txnIdBytes,
              },
              {
                boundType: BoundType.inclusive,
                value: txnIdBytes,
              },
            ],
          }
        : {}),
    },
  })
  const txn = data?.transactions?.[0] as MultisigSubmitEvent
  const {
    data: accountInfoData,
    error: getAccountInfoError,
    isLoading: isGetAccountInfoLoading,
  } = useGetAccountInfo(txn?.account)

  const {
    data: multisigTxnInfoData,
    isLoading: isMultisigTxnInfoLoading,
    error: multisigTxnInfoError,
  } = useGetMultisigTxnInfo(txn?.token)

  const {
    transaction,
    threshold,
    memo,
    executeAutomatically,
    submitter,
    approvers,
    state,
  } = multisigTxnInfoData?.info ?? {}
  const stateText = getTxnStateText(state)
  const isPending =
    state === MultisigTransactionState[MultisigTransactionState.pending]

  const submitterContactName = getContactName(submitter)

  const approversList = makeApproversMap(
    accountInfoData?.accountInfo?.roles,
    approvers,
    getContactName,
  )

  if (txnListError || getAccountInfoError || multisigTxnInfoError) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          {txnListError ??
            getAccountInfoError?.message ??
            multisigTxnInfoError?.message}
        </AlertDescription>
      </Alert>
    )
  }
  if (!isLoading && !txn) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          <Text>Transaction not found.</Text>
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <>
      {isLoading || isMultisigTxnInfoLoading || isGetAccountInfoLoading ? (
        <Box
          position={txn ? "absolute" : "relative"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="full"
        >
          <Spinner size="lg" />
        </Box>
      ) : null}

      {txn ? (
        <>
          <SubmittedTxnData address={txn?.account} transaction={transaction} />

          <DataField label="Status">
            <Text fontWeight="medium" casing="capitalize">
              {stateText}
            </Text>
          </DataField>

          <DataField
            label="Date"
            value={txn?.time ? new Date(txn?.time).toLocaleString() : ""}
          />

          <DataField
            label="Expire"
            value={
              multisigTxnInfoData?.info?.expireDate
                ? new Date(
                    multisigTxnInfoData?.info.expireDate,
                  ).toLocaleString()
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
            <ApproversList approvers={approversList} />
          </DataField>

          <DataField label="Required Approvers" value={threshold} />

          <DataField label="Memo" value={memo} />

          <DataField
            label="Execute Automatically"
            value={executeAutomatically ? "Yes" : "No"}
          />

          {base64TxnId ? (
            <ShareTxnButton base64TxnId={base64TxnId} mt={4} mb={8} />
          ) : null}

          {isPending ? (
            <MultisigActions
              accountAddress={txn?.account}
              onActionDone={undefined}
              txnToken={txn?.token}
            />
          ) : null}
        </>
      ) : null}
    </>
  )
}
