import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  Tooltip,
} from "@liftedinit/ui"
import { FaInfoCircle } from "react-icons/fa"
import React from "react"
import { StepNames } from "./types"
import { DestinationAddressRegex } from "../../destination-address"

interface FormValues {
  destinationAddress: string
}

interface DestinationAddressStepProps {
  nextStep: (nextStep: StepNames) => void
  prevStep: (prevStep: StepNames) => void
  setFormData: (values: any) => void
  initialValues: FormValues
}

const DestinationAddressStepValidationSchema = Yup.object().shape({
  destinationAddress: Yup.string()
    .matches(DestinationAddressRegex, "Invalid address format")
    .required("Required"),
})

export const DestinationAddressStep = ({
  nextStep,
  prevStep,
  setFormData,
  initialValues,
}: DestinationAddressStepProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={DestinationAddressStepValidationSchema}
      onSubmit={values => {
        setFormData(values)
        nextStep(StepNames.CONFIRMATION)
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <Text mb={4}>
              Enter the destination address on the new chain, e.g.,{" "}
              <em>manifest1abcqj48...f34qabc.</em>
            </Text>
            <FormControl
              isInvalid={
                !!(errors.destinationAddress && touched.destinationAddress)
              }
            >
              <FormLabel htmlFor="destinationAddress">
                Destination Address
                <Tooltip
                  label="This is the destination address to migrate the token to."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field
                bgColor="gray.100"
                fontFamily="monospace"
                fontSize="md"
                rounded="md"
                as={Input}
                id="destinationAddress"
                name="destinationAddress"
                aria-label={"destination-address"}
                data-testid="destinationAddress"
              />
              {errors.destinationAddress && touched.destinationAddress ? (
                <Text
                  color="red.500"
                  fontSize="sm"
                  data-testid="error-destinationAddress"
                >
                  {errors.destinationAddress}
                </Text>
              ) : null}
            </FormControl>
            <Button
              data-testid="back-btn"
              mt={4}
              colorScheme="blue"
              onClick={() => {
                setFormData({ assetAmount: 0, assetType: "" }) // TODO: Refactor this
                prevStep(StepNames.AMOUNT_ASSET)
              }}
            >
              Back
            </Button>
            <Button
              mt={4}
              ml={2}
              colorScheme="blue"
              type="submit"
              data-testid="next-btn"
            >
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
