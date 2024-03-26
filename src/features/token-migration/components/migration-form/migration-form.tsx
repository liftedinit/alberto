import React, { useCallback, useEffect, useMemo, useReducer } from "react"
import { Box, HStack, Spinner, useToast } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import { useCreateSendTxn, useTransactionsList } from "features/transactions"
import { ILLEGAL_IDENTITY, ListOrderType } from "@liftedinit/many-js"
import { useAccountsStore, useMultisigSubmit } from "features/accounts"
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
import { useGetBlock } from "features/network/queries"
import { extractEventDetails } from "features/token-migration/event-details"
import { useNavigate } from "react-router-dom"
import { createIsMatchingEvent } from "features/token-migration/event-validation"
import { extractTransactionHash } from "features/token-migration/block-utils"
import { v4 as uuidv4 } from "uuid"

// Token migration form component
// The flow is as follows:
// 1. User enters the account/user address
// 2. User enters the account user address (optional, only if account address is entered in 1.)
// 3. User enters the amount and the asset symbol
// 4. User enters the destination address
// 5. User confirms the transaction
// 6. The transaction is processed
//   6.1 The transaction is sent to the backend
//   6.2 The transaction is sent to the blockchain
//   6.3 The transaction log (event) is retrieved
//   6.4 The transaction block height and event number are retrieved from the (event) log
//   6.5 The block containing the transaction is retrieved from the blockchain
//   6.6 The transaction hash is retrieved from the block
// 7. The transaction is completed and the user is redirected to the migration detail page
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
  const [error, setError] = React.useState<Error | undefined>(undefined)

  const { mutateAsync: sendTokens } = useCreateSendTxn()
  const { mutateAsync: sendTokensMultisig } = useMultisigSubmit()
  const { data: events } = useTransactionsList({
    filters,
    predicate: createIsMatchingEvent({
      memo,
      destinationAddress: formData.destinationAddress,
      to: ILLEGAL_IDENTITY,
    }),
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedEvents = useMemo(
    () => events.transactions,
    [events.transactions],
  )
  const { data: blocks } = useGetBlock(height)

  // Handle the form next and previous steps
  const nextStep = (nextStep: StepNames) => dispatch(setCurrentStep(nextStep))
  const prevStep = (prevStep: StepNames) => dispatch(setCurrentStep(prevStep))

  useEffect(() => {
    if (error) {
      toast({
        status: "error",
        title: "Processing error",
        description: `Unable to process transaction: ${error}`,
      })
    }
  }, [error, toast])

  // Redirect the user to the migration detail when the transaction is completed
  useEffect(() => {
    if (processingDone && eventId !== undefined) {
      navigate(
        `/token-migration-portal/migration-history/${Buffer.from(
          eventId,
        ).toString("hex")}`,
      )
    }
  }, [processingDone, navigate, eventId])

  // Process the transaction details when the transaction log is available
  // We need the transaction ID, the block height and the event number to get the transaction hash
  useEffect(() => {
    if (
      eventId === undefined &&
      height === undefined &&
      eventNumber === undefined &&
      memoizedEvents &&
      memoizedEvents.length === 1 &&
      formData.destinationAddress !== "" &&
      memo !== "" &&
      txHash === ""
    ) {
      try {
        const e = memoizedEvents[0]
        let { blockHeight, eventNumber } = extractEventDetails(e.id, e.type)
        dispatch(setEventId(e.id))
        dispatch(setHeight(blockHeight))
        dispatch(setEventNumber(eventNumber))
      } catch (processError) {
        console.error(processError as Error)
        setError(processError as Error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.destinationAddress, memo, memoizedEvents, txHash])

  // Extract the transaction hash from the block as soon as the block is available
  useEffect(() => {
    if (
      blocks !== undefined &&
      eventNumber &&
      eventNumber > 0 &&
      txHash === ""
    ) {
      try {
        dispatch(setTxHash(extractTransactionHash(blocks, eventNumber)))
      } catch (hashError) {
        console.error(hashError as Error)
        setError(hashError as Error)
      }
    }
  }, [blocks, eventNumber, toast, txHash])

  // The migration payload
  // The payload is the same for both send and multisig submit
  const getTokenPayload = useCallback(() => {
    return {
      from:
        formData.accountAddress !== ""
          ? formData.accountAddress
          : formData.userAddress,
      to: ILLEGAL_IDENTITY,
      amount: BigInt(formData.assetAmount.times("1e9").toFixed()), // TODO: Get the precision programmatically
      symbol: formData.assetSymbol,
      memo: [memo, formData.destinationAddress],
    }
  }, [formData, memo])

  // Perform the token transaction on the MANY chain
  // The send function is either sendTokens or sendTokensMultisig depending on the form data
  const handleTokenTransaction = useCallback(
    async (sendFunction: SendFunctionType) => {
      try {
        await sendFunction(getTokenPayload(), {
          onSuccess: () => {
            // We want to retrieve the transaction log as soon as the transaction is completed
            // We need to set the log filters to the user address or the account address
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
            console.error(error)
            setError(error)
          },
        })
      } catch (error) {
        console.error(error as Error)
        setError(error as Error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getTokenPayload],
  )

  // Modify the form data
  const handleFormData = (values: Partial<TokenMigrationFormData>) => {
    dispatch(setFormData(values))
  }

  // Determine the send function to use based on the form data and perform the token transaction
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

  // Set a flag when all the processing is done
  useEffect(() => {
    if (memo !== "" && currentStep === StepNames.PROCESSING) {
      performSubmission().then(() => {
        dispatch(setProcessingDone(true))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memo, currentStep])

  // Handle the form submission
  // Set the current store user to the user address so the selected user can sign the transaction
  const handleSubmit = () => {
    const userId = identityStore.getId(formData.userAddress)
    if (userId !== undefined) {
      identityStore.setActiveId(userId)
    } else {
      setError(
        new Error(
          `Unable to find user address ${formData.userAddress} in the store`,
        ),
      )
      return
    }

    dispatch(setMemo(uuidv4())) // Each migration is assigned a UUID for traceability purposes
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
