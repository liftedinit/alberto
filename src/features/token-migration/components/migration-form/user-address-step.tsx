import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@liftedinit/ui"
import { Account, useAccountsStore, useGetAccountInfo } from "features/accounts"
import { useEffect, useMemo, useState } from "react"
import { StepNames, TokenMigrationFormData } from "./types"

interface FormValues {
  userAddress: string
}

interface UserAddressStepProps {
  nextStep: (nextStep: StepNames) => void
  prevStep: (prevStep: StepNames) => void
  setFormData: (values: any) => void
  formData: TokenMigrationFormData
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
  formData,
  initialValues,
}: UserAddressStepProps) => {
  const [commonAddresses, setCommonAddresses] = useState<Account[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { data: accountInfo, isSuccess } = useGetAccountInfo(
    formData.accountAddress,
  )
  const accountUsers = isSuccess
    ? [...(accountInfo?.accountInfo?.roles?.keys() ?? [])]
    : []
  // eslint-disable-next-line
  const memoizedAccountUsers = useMemo(() => accountUsers, [])
  const accStore = useAccountsStore()
  const identityById = accStore.byId

  useEffect(() => {
    const matchingAccounts = Array.from(identityById.values()).filter(
      identity => memoizedAccountUsers.includes(identity.address),
    )
    if (matchingAccounts.length > 0) {
      setCommonAddresses(matchingAccounts)
    }
    setIsLoaded(true)
  }, [isSuccess, identityById, memoizedAccountUsers])

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
            <Text mb={4}>
              Select the user address associated to the account.
            </Text>
            <Text mb={4}>
              <strong>Note:</strong> TODO
            </Text>
            <FormControl
              isInvalid={!!(errors.userAddress && touched.userAddress)}
            >
              <FormLabel htmlFor="userAddress">
                User address associated to the account
              </FormLabel>
              <Field
                as={Select}
                id="userAddress"
                name="userAddress"
                data-testid="userAddress"
                placeholder="Select user"
              >
                {isLoaded
                  ? commonAddresses.map(account => (
                      <option
                        key={account.address}
                        value={account.address}
                        data-testid="user-option"
                      >
                        User: {account.address} ({account.name})
                      </option>
                    ))
                  : null}
              </Field>
              {errors.userAddress && touched.userAddress ? (
                <Text color="red.500">{errors.userAddress}</Text>
              ) : null}
            </FormControl>
            <Button
              data-testid="back-btn"
              mt={4}
              colorScheme="blue"
              onClick={() => {
                setFormData({
                  accountAddress: "",
                  userAddress: "",
                }) // TODO: Refactor this
                prevStep(StepNames.ADDRESS)
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
