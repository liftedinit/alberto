import React from "react"
import { Box, Button, Text } from "@chakra-ui/react"
import { FormData, StepNames } from "./migration-form"

interface ConfirmationStepProps {
  prevStep: (prevStep: StepNames) => void
  handleSubmit: () => void
  setFormData: (values: any) => void
  formData: FormData
}

export const ConfirmationStep = ({
  prevStep,
  handleSubmit,
  setFormData,
  formData,
}: ConfirmationStepProps) => {
  return (
    <Box p={4}>
      <Text mb={2}>Confirmation</Text>
      {formData.accountAddress !== "" ? (
        <Text mb={2}>Account Address: {formData.accountAddress}</Text>
      ) : null}
      <Text mb={2}>User Address: {formData.userAddress}</Text>
      <Text mb={2}>Asset Amount: {formData.assetAmount}</Text>
      <Text mb={2}>Asset Type: {formData.assetType}</Text>
      <Text mb={2}>Destination Address: {formData.destinationAddress}</Text>

      <Button
        mt={4}
        colorScheme="blue"
        onClick={() => {
          setFormData({ destinationAddress: "" })
          prevStep(StepNames.DESTINATION_ADDRESS)
        }}
      >
        Back
      </Button>
      <Button mt={4} ml={2} colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  )
}
