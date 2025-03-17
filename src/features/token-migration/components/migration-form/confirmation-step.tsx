import React, { useState } from "react"
import { Box, Button, Link, Text } from "@chakra-ui/react"
import { StepNames, TokenMigrationFormData } from "./types"
import {
  Checkbox,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@liftedinit/ui"
import { TokenMigrationTermsAndConditions } from "./terms-and-conditions"

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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const openTermsModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsTermsModalOpen(true)
  }

  const closeTermsModal = () => {
    setIsTermsModalOpen(false)
  }

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
        By initiating the Token Migration, you are agreeing to the MFX Token
        Migration{" "}
        <Link color="brand.teal.500" href="#" onClick={openTermsModal}>
          Terms and Conditions
        </Link>
      </Checkbox>

      <Modal isOpen={isTermsModalOpen} onClose={closeTermsModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>MFX Token Migration Terms and Conditions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TokenMigrationTermsAndConditions />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand.teal" onClick={closeTermsModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
