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
  address: string
}

interface AddressStepProps {
  nextStep: (nextStep: StepNames) => void
  setFormData: (values: any) => void
  initialValues: FormValues
}

const AddressStepValidationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(/^m[a-zA-Z0-9]{49,54}$/, "Invalid address format")
    .required("Required"),
})

const detectAddressType = (address: string) => {
  return address.length === 50 ? "userAddress" : "accountAddress"
}

export const AddressStep = ({
  nextStep,
  setFormData,
  initialValues,
}: AddressStepProps) => {
  const nextStepLookup = {
    userAddress: () => nextStep(StepNames.AMOUNT_ASSET),
    accountAddress: () => nextStep(StepNames.USER_ADDRESS),
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddressStepValidationSchema}
      onSubmit={values => {
        const addressType = detectAddressType(values.address)
        if (addressType) {
          setFormData({
            [addressType]: values.address,
          })
        }
        nextStepLookup[addressType]?.()
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <FormControl isInvalid={!!(errors.address && touched.address)}>
              <FormLabel htmlFor="address">
                User/Account Address
                <Tooltip
                  label="This is the MANY address to migrate the token from. It can either be a user address or an account address."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field as={Input} id="address" name="address" />
              {errors.address && touched.address ? (
                <Text color="red.500">{errors.address}</Text>
              ) : null}
            </FormControl>

            <Button mt={4} colorScheme="blue" type="submit">
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
