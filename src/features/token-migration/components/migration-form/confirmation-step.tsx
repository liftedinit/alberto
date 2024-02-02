import React from "react"
import { Box, Button, Text } from "@chakra-ui/react"
import { StepNames, TokenMigrationFormData } from "./types"

interface ConfirmationStepProps {
  prevStep: (prevStep: StepNames) => void
  handleSubmit: () => void
  setFormData: (values: any) => void
  formData: TokenMigrationFormData
}

export const ConfirmationStep = ({
  prevStep,
  handleSubmit,
  setFormData,
  formData,
}: ConfirmationStepProps) => {
  return (
    <Box p={4} data-testid="confirmation-box">
      <Text mb={2}>Confirmation</Text>
      {formData.accountAddress !== "" ? (
        <Text mb={2}>
          <strong>Account Address:</strong> {formData.accountAddress}
        </Text>
      ) : null}
      <Text mb={2}>
        <strong>User Address:</strong> {formData.userAddress}
      </Text>
      <Text mb={2}>
        <strong>Asset Amount:</strong> {formData.assetAmount.toString()}
      </Text>
      <Text mb={2}>
        <strong>Asset Type:</strong> {formData.assetTicker}
      </Text>
      <Text mb={2}>
        <strong>Destination Address:</strong> {formData.destinationAddress}
      </Text>

      <Button
        data-testid="back-btn"
        mt={4}
        colorScheme="blue"
        onClick={() => {
          setFormData({ destinationAddress: "" })
          prevStep(StepNames.DESTINATION_ADDRESS)
        }}
      >
        Back
      </Button>
      <Button
        mt={4}
        ml={2}
        colorScheme="blue"
        onClick={handleSubmit}
        data-testid="next-btn"
      >
        Submit
      </Button>
    </Box>
  )
}
