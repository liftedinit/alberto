import React from "react"
import { Formik, Form, Field, FormikProps } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Icon,
  Tooltip,
} from "@liftedinit/ui"
import { FaInfoCircle } from "react-icons/fa"

interface Step2Props {
  nextStep: () => void
  prevStep: () => void
  setFormData: (values: any) => void // Adjust the type to match your form data structure
  initialValues: any // Use the appropriate type for your initial form values
}

const Step2ValidationSchema = Yup.object().shape({
  destinationAddress: Yup.string()
    .matches(/^manifest[a-zA-Z0-9]{39}$/, "Invalid address format")
    .required("Required"),
})

export const Step2 = ({
  nextStep,
  prevStep,
  setFormData,
  initialValues,
}: Step2Props) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Step2ValidationSchema}
      onSubmit={values => {
        setFormData(values)
        nextStep()
      }}
    >
      {(
        { errors, touched }: FormikProps<any>, // Use the appropriate type for FormikProps
      ) => (
        <Form>
          <Box p={4}>
            <FormControl
              isInvalid={
                !!(errors.destinationAddress && touched.destinationAddress)
              }
            >
              <FormLabel htmlFor="destinationAddress">
                Destination Address
                <Tooltip
                  label="This is your address on the new chain where to migrate the tokens to."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field
                as={Input}
                id="destinationAddress"
                name="destinationAddress"
              />
              {errors.destinationAddress && touched.destinationAddress && (
                <Text color="red.500">{errors.destinationAddress}</Text>
              )}
            </FormControl>

            <Button mt={4} colorScheme="blue" onClick={prevStep}>
              Back
            </Button>
            <Button mt={4} ml={2} colorScheme="blue" type="submit">
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
