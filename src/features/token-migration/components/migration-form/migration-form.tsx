import React, { useCallback, useEffect, useReducer } from "react"
import { Box, HStack, Spinner, useToast } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import {
  useCreateSendTxn,
  useGetBlock,
  useGetEvents,
} from "../../../transactions"
import { ILLEGAL_IDENTITY } from "@liftedinit/many-js"
import { useMultisigSubmit } from "../../../accounts"
import { processEvents, processBlock } from "./utils"
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
  const { data: events } = useGetEvents(filters)
  const { data: blocks } = useGetBlock(height)

  const nextStep = (nextStep: StepNames) => dispatch(setCurrentStep(nextStep))
  const prevStep = (prevStep: StepNames) => dispatch(setCurrentStep(prevStep))

  useEffect(() => {
    const isReady =
      events && formData.destinationAddress !== "" && txHash === ""
    if (isReady) {
      try {
        const { blockHeight, eventNumber } = processEvents(
          events.events,
          memo,
          formData.destinationAddress,
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
  }, [events, formData.destinationAddress, memo, toast, txHash])

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
            const accounts =
              formData.accountAddress !== ""
                ? [
                    formData.accountAddress,
                    formData.userAddress,
                    ILLEGAL_IDENTITY,
                  ]
                : [formData.userAddress, ILLEGAL_IDENTITY]
            dispatch(setFilters({ accounts }))
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
    [formData.accountAddress, formData.userAddress, getTokenPayload, toast],
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
                <h1>Processing...</h1> <Spinner />
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
