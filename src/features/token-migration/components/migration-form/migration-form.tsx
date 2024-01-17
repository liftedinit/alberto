import React, { useEffect, useState } from "react"
import { Box } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"
import { LogConsole } from "../log-console"
import {
  useCreateSendTxn,
  useGetBlock,
  useGetEvents,
} from "../../../transactions"
import {
  EventType,
  ILLEGAL_IDENTITY,
  SendEvent,
  Event,
  BlockchainTransaction,
} from "@liftedinit/many-js"
import { Big } from "big.js"

export enum StepNames {
  ADDRESS,
  USER_ADDRESS,
  AMOUNT_ASSET,
  DESTINATION_ADDRESS,
  CONFIRMATION,
  LOG,
}

export interface FormData {
  assetAmount: Big
  assetSymbol: string
  assetTicker: string
  destinationAddress: string
  userAddress: string
  accountAddress: string
}

function defaultValues(): FormData {
  return {
    assetAmount: Big(0),
    assetSymbol: "",
    assetTicker: "",
    destinationAddress: "",
    userAddress: "",
    accountAddress: "",
  }
}

export enum IdTypes {
  USER,
  ACCOUNT,
}

export interface IdentitiesAndAccounts {
  idType: IdTypes
  address: string
  name?: string
  id?: number
}
function bufferToNumber(buffer: Uint8Array): number {
  if (buffer.length > 8) {
    throw new Error(
      "Buffer length must not exceed 8 bytes for a 64-bit integer",
    )
  }

  const fullBuffer = new Uint8Array(8)
  fullBuffer.set(buffer, 8 - buffer.length) // This will right-align the original buffer in the fullBuffer

  let number = 0

  for (const element of fullBuffer) {
    number = number * 256 + element
  }

  return number
}

export const MigrationForm = () => {
  const [currentStep, setCurrentStep] = useState(StepNames.ADDRESS)
  const [formData, setFormData] = useState<FormData>(defaultValues())
  const [submissionStatus, setSubmissionStatus] = useState<string[]>([
    "Preparing migration...",
  ])
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [eventNumber, setEventNumber] = useState<number | undefined>(undefined)
  // eslint-disable-next-line
  const [memo, setMemo] = useState<string>(crypto.randomUUID())
  const [txHash, setTxHash] = useState<string>("")

  const { mutateAsync: sendTokens } = useCreateSendTxn()
  const { data: events } = useGetEvents(filters)
  const { data: blocks } = useGetBlock(height)

  const nextStep = (nextStep: StepNames) => setCurrentStep(nextStep)
  const prevStep = (prevStep: StepNames) => setCurrentStep(prevStep)

  const addSubmissionStatus = (message: string) => {
    setSubmissionStatus(prevStatus => [...prevStatus, message])
  }

  useEffect(() => {
    if (
      events &&
      events.events.length > 0 &&
      memo !== "" &&
      formData.destinationAddress !== "" &&
      txHash === ""
    ) {
      addSubmissionStatus("- Processing transaction log...")
      const { blockHeight, eventNumber } = processEvents(
        events,
        memo,
        formData.destinationAddress,
      )
      addSubmissionStatus("- Transaction log processed!")
      addSubmissionStatus(`- Transaction block height: ${blockHeight}`)
      addSubmissionStatus(`- Transaction number: ${eventNumber}`)
      setHeight(blockHeight)
      setEventNumber(eventNumber)
    }
    // eslint-disable-next-line
  }, [events, memo])

  useEffect(() => {
    if (blocks && eventNumber && eventNumber > 0 && txHash === "") {
      addSubmissionStatus("- Processing transaction hash...")
      const hash = getTransactionHash(blocks.transactions, eventNumber)
      setTxHash(hash)
      addSubmissionStatus("- Transaction hash processed!")
      addSubmissionStatus(`- Transaction hash: ${hash}`)
    }
    // eslint-disable-next-line
  }, [blocks])

  useEffect(() => {
    if (txHash !== "") {
      addSubmissionStatus("- MANY migration complete!")
      addSubmissionStatus(
        "Waiting for transaction to be confirmed on the new chain...",
      )
    }
  }, [txHash])

  const handleTokenSending = async () => {
    try {
      await sendTokens(getTokenPayload(), {
        onSuccess: async () => {
          const accounts =
            formData.accountAddress !== ""
              ? [
                  formData.accountAddress,
                  formData.userAddress,
                  ILLEGAL_IDENTITY,
                ]
              : [formData.userAddress, ILLEGAL_IDENTITY]
          setFilters({ accounts })
        },
        // await handleTokenSendSuccess(memo, destinationAddress),
        onError: () => addSubmissionStatus("Error sending tokens!"),
      })
    } catch (sendError) {
      addSubmissionStatus(`Error sending tokens!. Error: ${sendError}`)
    }
  }

  const handleMultisigTokenSending = async () => {}

  const getTokenPayload = () => ({
    from: formData.userAddress,
    to: ILLEGAL_IDENTITY,
    amount: BigInt(formData.assetAmount.times(1e9).toString()), // TODO: Get the precision programmatically
    symbol: formData.assetSymbol,
    memo: [memo, formData.destinationAddress],
  })

  const processEvents = (
    events: { events: Event[] },
    memo: string,
    destinationAddress: string,
  ) => {
    let blockHeight = 0
    let eventNumber = 0

    events.events.forEach((event: Event) => {
      if (event.type === EventType.send) {
        const sendEvent = event as SendEvent
        if (
          sendEvent.memo &&
          sendEvent.memo[0] === memo &&
          sendEvent.memo[1] === destinationAddress
        ) {
          ;({ blockHeight, eventNumber } = processSendEvent(sendEvent))
        }
      }
    })

    if (blockHeight === 0 || eventNumber === 0) {
      throw new Error("Transaction event not found!")
    }

    return { blockHeight, eventNumber }
  }

  const getTransactionHash = (
    transactions: BlockchainTransaction[],
    eventNumber: number,
  ) => {
    const transaction = transactions[eventNumber - 1]
    return Buffer.from(transaction.transactionIdentifier.hash).toString("hex")
  }

  const processSendEvent = (sendEvent: SendEvent) => {
    const eventId = sendEvent.id
    const bufferLength = eventId.byteLength
    if (bufferLength < 4) {
      throw new Error("Event ID buffer length too short!")
    }
    const eventHeightBuf = eventId.slice(0, bufferLength - 4)
    const eventNumberBuf = eventId.slice(bufferLength - 4)

    // Not sure why but browser thinks the buffer is a Uint8Array while the IDE/compiler thinks it's an ArrayBuffer
    const blockHeight = bufferToNumber(new Uint8Array(eventHeightBuf)) + 2 // The right height is the reported height + 2
    const eventNumber = bufferToNumber(new Uint8Array(eventNumberBuf))

    return { blockHeight, eventNumber }
  }

  const handleFormData = (values: Partial<FormData>) => {
    setFormData({ ...formData, ...values })
  }

  const performSubmission = async () => {
    addSubmissionStatus("Processing migration on the MANY chain...")

    if (!formData.accountAddress) {
      await handleTokenSending()
    } else {
      await handleMultisigTokenSending()
    }
  }

  const handleSubmit = async () => {
    setCurrentStep(StepNames.LOG)
    await performSubmission()
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
      case StepNames.LOG:
        return <LogConsole logs={submissionStatus} />
      default:
        return <div>Unknown step</div>
    }
  }

  return <Box>{renderStep()}</Box>
}
