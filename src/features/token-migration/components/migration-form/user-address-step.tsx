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
import { StepNames } from "./migration-form"

interface FormValues {
  userAddress: string
}

interface UserAddressStepProps {
  nextStep: (nextStep: StepNames) => void
  prevStep: (prevStep: StepNames) => void
  setFormData: (values: any) => void
  initialValues: FormValues
}

const UserAddressStepValidationSchema = Yup.object().shape({
  userAddress: Yup.string()
    .matches(/^m[a-zA-Z0-9]{49}$/, "Invalid address format")
    .required("Required"),
})

export const UserAddressStep = ({
  nextStep,
  prevStep,
  setFormData,
  initialValues,
}: UserAddressStepProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UserAddressStepValidationSchema}
      onSubmit={values => {
        setFormData(values)
        prevStep(StepNames.ADDRESS)
        nextStep(StepNames.AMOUNT_ASSET)
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <FormControl
              isInvalid={!!(errors.userAddress && touched.userAddress)}
            >
              <FormLabel htmlFor="userAddress">
                User address associated to the account
                <Tooltip
                  label="The user address associated to the account."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field as={Input} id="userAddress" name="userAddress" />
              {errors.userAddress && touched.userAddress ? (
                <Text color="red.500">{errors.userAddress}</Text>
              ) : null}
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => {
                setFormData({ accountAddress: "", userAddress: "" }) // TODO: Refactor this
                prevStep(StepNames.ADDRESS)
              }}
            >
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
