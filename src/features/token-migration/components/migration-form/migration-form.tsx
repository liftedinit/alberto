import React, { useCallback, useEffect, useMemo } from "react"
import { Box, HStack, Spinner, useToast } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import { useCreateSendTxn, useTransactionsList } from "features/transactions"
import { ILLEGAL_IDENTITY, ListOrderType } from "@liftedinit/many-js"
import { useAccountsStore, useMultisigSubmit } from "features/accounts"
import { defaultValues, StepNames, TokenMigrationFormData } from "./types"
import { useGetBlock } from "features/network/queries"
import { extractEventDetails } from "features/token-migration/event-details"
import { useNavigate } from "react-router-dom"
import { createIsMatchingEvent } from "features/token-migration/event-validation"
import { extractTransactionHash } from "features/token-migration/block-utils"
import { v4 as uuidv4 } from "uuid"

export const MigrationForm = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const identityStore = useAccountsStore()
  const [myCurrentStep, setMyCurrentStep] = React.useState<StepNames>(
    StepNames.ADDRESS,
  )
  const [myFormData, setMyFormData] = React.useState<TokenMigrationFormData>(
    defaultValues(),
  )
  const [myFilters, setMyFilters] = React.useState<Record<string, any>>({})
  const [myHeight, setMyHeight] = React.useState<number | undefined>(undefined)
  const [myEventNumber, setMyEventNumber] = React.useState<number | undefined>(
    undefined,
  )
  const [myEventId, setMyEventId] = React.useState<ArrayBuffer | undefined>(
    undefined,
  )
  const [myTxHash, setMyTxHash] = React.useState<string>("")
  const [myProcessingDone, setMyProcessingDone] = React.useState<boolean>(false)
  const [myMemo, setMyMemo] = React.useState<string>("")
  const [error, setError] = React.useState<Error | undefined>(undefined)

  const { mutate: sendTokens } = useCreateSendTxn()
  const { mutate: sendTokensMultisig } = useMultisigSubmit()

  const memoizedMatchingEvent = useMemo(() => {
    if (myMemo !== "" && myFormData.destinationAddress !== "") {
      return createIsMatchingEvent({
        memo: myMemo,
        destinationAddress: myFormData.destinationAddress,
        to: ILLEGAL_IDENTITY,
      })
    } else {
      return () => false
    }
  }, [myMemo, myFormData.destinationAddress])
  const memoizedFilters = useMemo(() => myFilters, [myFilters])
  const { data: events } = useTransactionsList({
    filters: memoizedFilters,
    predicate: memoizedMatchingEvent,
    keymod: myMemo,
  })
  const memoizedEvents = useMemo(
    () => events.transactions,
    [events.transactions],
  )
  const { data: blocks } = useGetBlock(myHeight)

  const memoizedBlock = useMemo(() => blocks, [blocks])

  // // Handle the form next and previous steps
  const nextStep = (nextStep: StepNames) => setMyCurrentStep(nextStep)
  const prevStep = (prevStep: StepNames) => setMyCurrentStep(prevStep)

  useEffect(() => {
    if (error) {
      toast({
        status: "error",
        title: "Processing error",
        description: `Unable to process transaction: ${error}`,
      })
    }
    // eslint-disable-next-line
  }, [error])

  // Extract the event details from the event log
  useEffect(() => {
    if (memoizedEvents.length === 1) {
      try {
        const e = memoizedEvents[0]
        const { blockHeight, eventNumber } = extractEventDetails(e.id, e.type)
        setMyEventId(e.id)
        setMyHeight(blockHeight)
        setMyEventNumber(eventNumber)
      } catch (processError) {
        console.error(processError as Error)
        setError(processError as Error)
      }
    }
  }, [memoizedEvents])

  useEffect(() => {
    if (memoizedBlock && myEventNumber)
      try {
        setMyTxHash(extractTransactionHash(memoizedBlock, myEventNumber))
        setMyProcessingDone(true)
      } catch (hashError) {
        console.error(hashError as Error)
        setError(hashError as Error)
      }
  }, [memoizedBlock, myEventNumber])

  // // Redirect the user to the migration detail when the transaction is completed
  useEffect(() => {
    if (myProcessingDone && myEventId && myTxHash !== "") {
      const id = Buffer.from(myEventId).toString("hex")
      navigate(`/token-migration-portal/migration-history/${id}`)
    }
    // eslint-disable-next-line
  }, [myProcessingDone, myTxHash, myEventId])

  // // Modify the form data
  const handleFormData = (values: Partial<TokenMigrationFormData>) => {
    setMyFormData(prevState => ({ ...prevState, ...values }))
  }

  // Determine the send function to use based on the form data and perform the token transaction
  const performSubmission = useCallback(() => {
    const from =
      myFormData.accountAddress !== ""
        ? myFormData.accountAddress
        : myFormData.userAddress
    const filter = { accounts: [from], order: ListOrderType.descending }
    const payload = {
      from,
      to: ILLEGAL_IDENTITY,
      amount: BigInt(myFormData.assetAmount.times("1e9").toFixed()), // All tokens on the current MANY chain have a 1e9 decimal precision
      symbol: myFormData.assetSymbol,
      memo: [myMemo, myFormData.destinationAddress],
    }

    myFormData.accountAddress
      ? sendTokensMultisig(payload, {
          onSuccess: () => setMyFilters(filter),
          onError: error => {
            console.error(error)
            setError(error)
          },
        })
      : sendTokens(payload, {
          onSuccess: () => setMyFilters(filter),
          onError: error => {
            console.error(error)
            setError(error)
          },
        })
    // eslint-disable-next-line
  }, [myFormData, myMemo])

  // Set a flag when all the processing is done
  useEffect(() => {
    if (myMemo !== "" && myCurrentStep === StepNames.PROCESSING) {
      performSubmission()
    }
    // eslint-disable-next-line
  }, [myMemo, myCurrentStep])

  // Handle the form submission
  // Set the current store user to the user address so the selected user can sign the transaction
  const handleSubmit = () => {
    const userId = identityStore.getId(myFormData.userAddress)
    if (userId !== undefined) {
      identityStore.setActiveId(userId)
    } else {
      setError(
        new Error(
          `Unable to find user address ${myFormData.userAddress} in the store`,
        ),
      )
      return
    }

    setMyMemo(uuidv4()) // Each migration is assigned a UUID for traceability purposes
    setMyCurrentStep(StepNames.PROCESSING)
  }

  // Render the current step
  const renderStep = () => {
    switch (myCurrentStep) {
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
            formData={myFormData}
            initialValues={myFormData}
          />
        )
      case StepNames.DESTINATION_ADDRESS:
        return (
          <DestinationAddressStep
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            initialValues={myFormData}
          />
        )
      case StepNames.USER_ADDRESS:
        return (
          <UserAddressStep
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            formData={myFormData}
            initialValues={myFormData}
          />
        )
      case StepNames.CONFIRMATION:
        return (
          <ConfirmationStep
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            setFormData={handleFormData}
            formData={myFormData}
          />
        )
      case StepNames.PROCESSING:
        return (
          <>
            {!myProcessingDone && (
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
