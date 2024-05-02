import React, { useState } from "react"
import { Box, Button, Text } from "@chakra-ui/react"
import { StepNames, TokenMigrationFormData } from "./types"
import { Checkbox, HStack } from "@liftedinit/ui"

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
  const [isChecked, setIsChecked] = useState(false)

  return (
    <Box p={4} data-testid="confirmation-box">
      <Text mb={4}>Confirm that the following information are correct.</Text>
      {formData.accountAddress !== "" ? (
        <Text mb={2} data-testid="account-info">
          <strong>MANY Account Address:</strong> {formData.accountAddress}
        </Text>
      ) : null}
      <Text mb={2}>
        <strong>MANY User Address:</strong> {formData.userAddress}
      </Text>
      <Text mb={2}>
        <strong>MANY Asset Amount:</strong> {formData.assetAmount.toString()}
      </Text>
      <Text mb={2}>
        <strong>MANY Asset Type:</strong> {formData.assetTicker}
      </Text>
      <Text mb={2}>
        <strong>MANIFEST Destination Address:</strong>{" "}
        {formData.destinationAddress}
      </Text>

      <Checkbox
        isChecked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        colorScheme="brand.teal"
        mt={4}
      >
        I agree that the provided information is correct and acknowledge that
        The Lifted Initiative is not responsible for any loss of tokens due to
        incorrect or invalid information
      </Checkbox>

      <HStack mt={4}>
        <Button
          data-testid="back-btn"
          colorScheme="brand.teal"
          onClick={() => {
            setFormData({ destinationAddress: "" })
            prevStep(StepNames.DESTINATION_ADDRESS)
          }}
        >
          Back
        </Button>
        <Button
          ml={2}
          colorScheme="brand.teal"
          onClick={handleSubmit}
          data-testid="next-btn"
          disabled={!isChecked}
        >
          Submit
        </Button>
      </HStack>
    </Box>
  )
}
