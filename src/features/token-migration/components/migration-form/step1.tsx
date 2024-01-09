import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Text,
  Tooltip,
} from "@liftedinit/ui"
import { FaInfoCircle } from "react-icons/fa"

// Mock fetching functions
const fetchUserAssetAmount = () => 1000 // Mock maximum amount

// Assuming these are the types for your form values
interface FormValues {
  assetAmount: number
  assetType: string
  userAddress: string
}

// Props type for Step1 component
interface Step1Props {
  nextStep: () => void
  setFormData: (values: any) => void
  initialValues: FormValues
}

// Step 1 Validation Schema
const Step1ValidationSchema = Yup.object().shape({
  assetAmount: Yup.number()
    .positive("Amount must be positive")
    .max(fetchUserAssetAmount(), "Amount exceeds your holdings")
    .required("Required"),
  assetType: Yup.string().required("Required"),
  userAddress: Yup.string().required("Required"),
})

export const Step1 = ({ nextStep, setFormData, initialValues }: Step1Props) => {
  const [assetTypes, setAssetTypes] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Replace these with actual async calls
      setAssetTypes(["MFX", "GRAY", "BITCH"])
    }
    fetchData()
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Step1ValidationSchema}
      onSubmit={values => {
        setFormData(values)
        nextStep()
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <FormControl
              isInvalid={!!(errors.userAddress && touched.userAddress)}
            >
              <FormLabel htmlFor="userAddress">
                User Address
                <Tooltip
                  label="This is the MANY address to migrate the token from."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field
                as={Input}
                id="userAddress"
                name="userAddress"
                disabled={true}
              />
              {errors.userAddress && touched.userAddress ? (
                <Text color="red.500">{errors.userAddress}</Text>
              ) : null}
            </FormControl>

            <FormControl
              isInvalid={!!(errors.assetAmount && touched.assetAmount)}
            >
              <FormLabel htmlFor="assetAmount">
                Asset Amount
                <Tooltip
                  label="This is the amount of tokens to transfer to the new chain."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field as={Input} id="assetAmount" name="assetAmount" />
              {errors.assetAmount && touched.assetAmount ? (
                <Text color="red.500">{errors.assetAmount}</Text>
              ) : null}
            </FormControl>

            <FormControl isInvalid={!!(errors.assetType && touched.assetType)}>
              <FormLabel htmlFor="assetType">
                Asset Type
                <Tooltip
                  label="This is the MANY asset type to transfer to the new chain."
                  fontSize="md"
                >
                  <span>
                    <Icon as={FaInfoCircle} ml={2} w={4} h={4} />
                  </span>
                </Tooltip>
              </FormLabel>
              <Field
                as={Select}
                id="assetType"
                name="assetType"
                placeholder="Select asset type"
              >
                {assetTypes.map((type, index) => (
                  <option key={index} value={type} disabled={type !== "MFX"}>
                    {type}
                  </option>
                ))}
              </Field>
              {errors.assetType && touched.assetType ? (
                <Text color="red.500">{errors.assetType}</Text>
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
