import React, { useCallback, useEffect, useMemo, useReducer } from "react"
import { Box, HStack, Spinner, useToast } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import { useCreateSendTxn, useTransactionsList } from "../../../transactions"
import {
  Event,
  EventType,
  ILLEGAL_IDENTITY,
  ListOrderType,
  MultisigSubmitEvent,
  SendEvent,
} from "@liftedinit/many-js"
import { useMultisigSubmit } from "../../../accounts"
import { processBlock } from "./utils"
import { SendFunctionType, StepNames, TokenMigrationFormData } from "./types"
import {
  reducer,
  initialState,
  setCurrentStep,
  setHeight,
  setEventNumber,
  setTxHash,
  setFilters,
  setFormData,
  setProcessingDone,
} from "./migration-form-actions"
import { useGetBlock } from "../../../network"
import { extractEventDetails } from "./utils/processEvents"

// Verify that the UUID matches the one in the event memo
// Verify that the other chain destination address matches the one in the event memo
// Verify the transaction destination address is the ILLEGAL address
const isMatchingEvent = (e: Event, p: { [key: string]: any }) => {
  if (
    (e.type === EventType.send || e.type === EventType.accountMultisigSubmit) &&
    "memo" in e &&
    e.memo?.[0] === p.memo &&
    e.memo?.[1] === p.destinationAddress
  ) {
    if (e.type === EventType.send) {
      const se = e as SendEvent
      return se.to === ILLEGAL_IDENTITY
    } else if (e.type === EventType.accountMultisigSubmit) {
      const ams = e as MultisigSubmitEvent
      if (ams.transaction?.type === EventType.send) {
        const se = ams.transaction as SendEvent
        return se.to === ILLEGAL_IDENTITY
      }
    }
  }
  return false
}

function createIsMatchingEvent(p: { [key: string]: any }) {
  return function (e: Event) {
    return isMatchingEvent(e, p)
  }
}

export const MigrationForm = () => {
  const toast = useToast()
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    currentStep,
    formData,
    filters,
    height,
    eventNumber,
    txHash,
    processingDone,
    memo,
  } = state

  const { mutateAsync: sendTokens } = useCreateSendTxn()
  const { mutateAsync: sendTokensMultisig } = useMultisigSubmit()
  const { data: events } = useTransactionsList({
    filters,
    predicate: createIsMatchingEvent({
      memo,
      destinationAddress: formData.destinationAddress,
    }),
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedEvents = useMemo(
    () => events.transactions,
    [events.transactions],
  )
  const { data: blocks } = useGetBlock(height)

  const nextStep = (nextStep: StepNames) => dispatch(setCurrentStep(nextStep))
  const prevStep = (prevStep: StepNames) => dispatch(setCurrentStep(prevStep))

  useEffect(() => {
    if (
      memoizedEvents &&
      memoizedEvents.length === 1 &&
      formData.destinationAddress !== "" &&
      memo !== "" &&
      txHash === ""
    ) {
      try {
        const { blockHeight, eventNumber } = extractEventDetails(
          memoizedEvents[0].id,
        )
        dispatch(setHeight(blockHeight))
        dispatch(setEventNumber(eventNumber))
      } catch (processError) {
        const err = processError as Error
        toast({
          status: "error",
          title: "Processing error",
          description: `Unable to process block events: ${err}`,
        })
      }
    }
  }, [formData.destinationAddress, memo, memoizedEvents, txHash, toast])

  useEffect(() => {
    if (blocks && eventNumber && eventNumber > 0 && txHash === "") {
      try {
        const hash = processBlock(blocks, eventNumber)
        dispatch(setTxHash(hash))
      } catch (hashError) {
        const err = hashError as Error
        toast({
          status: "error",
          title: "Processing error",
          description: `Unable to process block: ${err}`,
        })
      }
    }
  }, [blocks, eventNumber, toast, txHash])

  const getTokenPayload = useCallback(() => {
    return {
      from:
        formData.accountAddress !== ""
          ? formData.accountAddress
          : formData.userAddress,
      to: ILLEGAL_IDENTITY,
      amount: BigInt(formData.assetAmount.times(1e9).toString()), // TODO: Get the precision programmatically
      symbol: formData.assetSymbol,
      memo: [memo, formData.destinationAddress],
    }
  }, [formData, memo])

  const handleTokenTransaction = useCallback(
    async (sendFunction: SendFunctionType) => {
      try {
        await sendFunction(getTokenPayload(), {
          onSuccess: () => {
            dispatch(
              setFilters({
                accounts:
                  formData.accountAddress !== "" // TODO: Fix this
                    ? [formData.accountAddress]
                    : [formData.userAddress],
                order: ListOrderType.descending,
              }),
            ) // Accounts filtering in the backend is an OR, not an AND
          },
          onError: error => {
            toast({
              status: "error",
              title: "User transaction error",
              description: `Unable to send tokens: ${error.message}`,
            })
          },
        })
      } catch (error) {
        const err = error as Error
        toast({
          status: "error",
          title: "Transaction preparation error",
          description: `Unexpected error during token migration preparation: ${err.message}`,
        })
      }
    },
    [getTokenPayload, toast],
  )

  const handleFormData = (values: Partial<TokenMigrationFormData>) => {
    dispatch(setFormData(values))
  }

  const performSubmission = useCallback(async () => {
    const sendFunction = formData.accountAddress
      ? sendTokensMultisig
      : sendTokens
    await handleTokenTransaction(sendFunction)
  }, [
    formData.accountAddress,
    handleTokenTransaction,
    sendTokens,
    sendTokensMultisig,
  ])

  const handleSubmit = async () => {
    dispatch(setCurrentStep(StepNames.PROCESSING))
    await performSubmission()
    dispatch(setProcessingDone(true))
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case StepNames.ADDRESS:
        return (
          <AddressStep
            nextStep={nextStep}
            setFormData={handleFormData}
            initialValues={{ address: "" }}
          />
        )
      case StepNames.AMOUNT_ASSET:
        return (
          <AmountAssetStep
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            formData={formData}
            initialValues={formData}
          />
        )
      case StepNames.DESTINATION_ADDRESS:
        return (
          <DestinationAddressStep
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            initialValues={formData}
          />
        )
      case StepNames.USER_ADDRESS:
        return (
          <UserAddressStep
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            formData={formData}
            initialValues={formData}
          />
        )
      case StepNames.CONFIRMATION:
        return (
          <ConfirmationStep
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            setFormData={handleFormData}
            formData={formData}
          />
        )
      case StepNames.PROCESSING:
        return (
          <>
            {processingDone ? (
              <h1>Migration Done!</h1>
            ) : (
              <HStack>
                <h1>
                  Processing... The operation can take a couple of minutes. Do
                  not refresh or close this page.
                </h1>{" "}
                <Spinner />
              </HStack>
            )}
          </>
        )
      default:
        return <div>Unknown step</div>
    }
  }

  return <Box>{renderStep()}</Box>
}
