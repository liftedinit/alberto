import React from "react"
import { Box, Button, Text } from "@chakra-ui/react"

interface Step3Props {
  prevStep: () => void
  handleSubmit: () => void
  formData: {
    userAddress: string
    assetAmount: number
    assetType: string
    destinationAddress: string
  }
}

export const Step3 = ({ prevStep, handleSubmit, formData }: Step3Props) => {
  return (
    <Box p={4}>
      <Text mb={2}>Confirmation</Text>
      <Text mb={2}>User Address: {formData.userAddress}</Text>
      <Text mb={2}>Asset Amount: {formData.assetAmount}</Text>
      <Text mb={2}>Asset Type: {formData.assetType}</Text>
      <Text mb={2}>Destination Address: {formData.destinationAddress}</Text>

      <Button mt={4} colorScheme="blue" onClick={prevStep}>
        Back
      </Button>
      <Button mt={4} ml={2} colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  )
}
