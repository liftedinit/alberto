import React, { useCallback, useEffect, useMemo, useReducer } from "react"
import { Box, HStack, Spinner, useToast } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import { useCreateSendTxn, useTransactionsList } from "../../../transactions"
import { EventType, ILLEGAL_IDENTITY, ListOrderType } from "@liftedinit/many-js"
import { useAccountsStore, useMultisigSubmit } from "../../../accounts"
import { processBlock } from "./utils"
import { SendFunctionType, StepNames, TokenMigrationFormData } from "./types"
import {
  initialState,
  reducer,
  setCurrentStep,
  setEventId,
  setEventNumber,
  setFilters,
  setFormData,
  setHeight,
  setMemo,
  setProcessingDone,
  setTxHash,
} from "./migration-form-actions"
import { useGetBlock } from "../../../network"
import {
  createIsMatchingEvent,
  extractEventDetails,
} from "./utils/processEvents"
import { useNavigate } from "react-router-dom"

export const MigrationForm = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const identityStore = useAccountsStore()
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    currentStep,
    formData,
    filters,
    height,
    eventNumber,
    eventId,
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
    if (processingDone && eventId !== undefined) {
      navigate(
        `/token-migration-portal/migration-details/${Buffer.from(
          eventId,
        ).toString("hex")}`,
      )
    }
  }, [processingDone, navigate, eventId])

  useEffect(() => {
    if (
      memoizedEvents &&
      memoizedEvents.length === 1 &&
      formData.destinationAddress !== "" &&
      memo !== "" &&
      txHash === ""
    ) {
      try {
        const e = memoizedEvents[0]
        let { blockHeight, eventNumber } = extractEventDetails(e.id)
        if (e.type === EventType.accountMultisigSubmit) {
          eventNumber = eventNumber - 1
        }
        dispatch(setEventId(e.id))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.destinationAddress, memo, memoizedEvents, txHash])

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
                  formData.accountAddress !== ""
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getTokenPayload],
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

  useEffect(() => {
    if (memo !== "" && currentStep === StepNames.PROCESSING) {
      performSubmission().then(() => {
        dispatch(setProcessingDone(true))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memo, currentStep])

  const handleSubmit = () => {
    // Set the current store user to the user address so the selected user can sign the transaction
    const userId = identityStore.getId(formData.userAddress)
    if (userId !== undefined) {
      identityStore.setActiveId(userId)
    } else {
      toast({
        status: "error",
        title: "User address not found",
        description: `Unable to find user address ${formData.userAddress} in the store.`,
      })
      return
    }

    dispatch(setMemo(crypto.randomUUID()))
    dispatch(setCurrentStep(StepNames.PROCESSING))
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
            {!processingDone && (
              <HStack>
                <h1>
                  Processing... The operation can take a couple of seconds.
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
