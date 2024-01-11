import React, { useEffect, useState } from "react"
import { Box, Progress } from "@liftedinit/ui"
import { AddressStep } from "./address-step"
import { AmountAssetStep } from "./amount-asset-step"
import { DestinationAddressStep } from "./destination-address-step"
import { UserAddressStep } from "./user-address-step"
import { ConfirmationStep } from "./confirmation-step"

export enum StepNames {
  ADDRESS,
  USER_ADDRESS,
  AMOUNT_ASSET,
  DESTINATION_ADDRESS,
  CONFIRMATION,
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface FormData {
  assetAmount: number
  assetType: string
  destinationAddress: string
  userAddress: string
  accountAddress: string
}

function defaultValues(): FormData {
  return {
    assetAmount: 0,
    assetType: "",
    destinationAddress: "",
    userAddress: "",
    accountAddress: "",
  }
}

export const MigrationForm = () => {
  const [currentStep, setCurrentStep] = useState(StepNames.ADDRESS)
  const [formData, setFormData] = useState<FormData>(defaultValues())
  const [submissionStatus, setSubmissionStatus] = useState<string[]>([
    "Preparing migration...",
  ])

  const nextStep = (nextStep: StepNames) => setCurrentStep(nextStep)
  const prevStep = (prevStep: StepNames) => setCurrentStep(prevStep)

  const handleFormData = (values: Partial<FormData>) => {
    setFormData({ ...formData, ...values })
  }

  const performSubmission = async () => {
    // Your submission logic here
    // Update `setSubmissionStatus` as the submission progresses
    setSubmissionStatus(prevStatus => [...prevStatus, "Migrating tokens..."])
    await sleep(1000)
    setSubmissionStatus(prevStatus => [
      ...prevStatus,
      "Waiting for confirmation...",
    ])
    await sleep(1000)
    setSubmissionStatus(prevStatus => [
      ...prevStatus,
      "Waiting for confirmation...",
    ])
    await sleep(1000)
    setSubmissionStatus(prevStatus => [
      ...prevStatus,
      "Migration confirmed! Transaction hash: 0x1234567890abcdef",
    ])
    await sleep(1000)
    setSubmissionStatus(prevStatus => [...prevStatus, "Migration complete!"])
  }

  const handleSubmit = async () => {
    console.log("Final Submission Data:", formData)
    // setCurrentStep(4) // Move to the submission tracking step
    await performSubmission() // Function that performs the submission and updates status
    // Handle the final submission logic here
  }

  useEffect(() => {
    console.log(StepNames[currentStep], formData)
  }, [currentStep])

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
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <Box>
      {/*<Progress value={(currentStep / 3) * 100} mb={4} />*/}
      {renderStep()}
    </Box>
  )
}
