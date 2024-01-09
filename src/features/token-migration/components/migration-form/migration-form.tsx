import React, { useState } from "react"
import { Box, Progress } from "@liftedinit/ui"
import { Step1 } from "./step1"
import { Step2 } from "./step2"
import { Step3 } from "./step3"
import { Step4 } from "./step4" // Import your Step1 component

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface FormData {
  assetAmount: number
  assetType: string
  destinationAddress: string
  userAddress: string
}

export const MigrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    assetAmount: 0,
    assetType: "",
    destinationAddress: "",
    userAddress: "mafxfifpnhkgdm3er55tlqnbvlvhr777w5heyxu77rgih5fart", // TODO: Fetch this programmatically
  })
  const [submissionStatus, setSubmissionStatus] = useState<string[]>([
    "Preparing migration...",
  ])

  // Go to the next step
  const nextStep = () => setCurrentStep(currentStep + 1)

  // Go to the previous step
  const prevStep = () => setCurrentStep(currentStep - 1)

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
    setCurrentStep(4) // Move to the submission tracking step
    await performSubmission() // Function that performs the submission and updates status
    // Handle the final submission logic here
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            nextStep={nextStep}
            setFormData={handleFormData}
            initialValues={formData}
          />
        )
      case 2:
        return (
          <Step2
            nextStep={nextStep}
            prevStep={prevStep}
            setFormData={handleFormData}
            initialValues={formData}
          />
        )
      case 3:
        return (
          <Step3
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            formData={formData}
          />
        )
      case 4:
        return <Step4 submissionStatus={submissionStatus} />
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <Box>
      <Progress value={(currentStep / 3) * 100} mb={4} />
      {renderStep()}
      {/* Render navigation buttons if needed */}
    </Box>
  )
}
