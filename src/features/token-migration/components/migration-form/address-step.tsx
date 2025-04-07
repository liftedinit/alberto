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
import { useEffect, useMemo, useState } from "react"
import { IdentitiesAndAccounts, IdTypes, StepNames } from "./types"
import { useCombinedAccountInfo } from "features/accounts/queries"
import { useMigrationWhitelist } from "../../queries"

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
  // The next step to go to based on the address type
  const nextStepLookup = {
    userAddress: () => nextStep(StepNames.AMOUNT_ASSET),
    accountAddress: () => nextStep(StepNames.USER_ADDRESS),
  }
  const [accountsAndIdentities, setAccountsAndIdentities] = useState<
    Map<string, IdentitiesAndAccounts>
  >(new Map())
  const [isLoaded, setIsLoaded] = useState(false)
  const combinedAccountAndIdentities = useCombinedAccountInfo()
  const memoizedCombinedAccountAndIdentities = useMemo(
    () => combinedAccountAndIdentities,
    [combinedAccountAndIdentities],
  )
  const { whitelist, isLoading } = useMigrationWhitelist()

  useEffect(() => {
    if (isLoading) {
      return
    }
    setAccountsAndIdentities(memoizedCombinedAccountAndIdentities)
    setIsLoaded(true)
  }, [memoizedCombinedAccountAndIdentities, isLoading])

  const handleSubmit = (values: FormValues) => {
    const addressType = detectAddressType(values.address)
    if (addressType) {
      setFormData({ [addressType]: values.address })
    }
    nextStepLookup[addressType]?.()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddressStepValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Box p={4}>
            <Text mb={4}>
              Select the MANY account or the MANY user address to use for the
              migration.
            </Text>
            <Text mb={4}>
              It is advised to migrate a small amount of tokens first to ensure
              the destination address is correct and avoid any potential loss of
              tokens.
            </Text>
            <FormControl isInvalid={!!(errors.address && touched.address)}>
              <FormLabel htmlFor="address">User/Account Address</FormLabel>
              <Field
                bgColor="gray.100"
                borderColor={errors?.address ? "red.500" : undefined}
                borderWidth={errors?.address ? "2px" : undefined}
                fontFamily="monospace"
                fontSize="md"
                rounded="md"
                as={Select}
                id="address"
                name="address"
                data-testid="address"
                aria-label={"user-account-address"}
                placeholder="Select Account/User"
              >
                {isLoaded
                  ? Array.from(accountsAndIdentities.values()).map(
                      ({ idType, address, name }) => {
                        const isWhitelisted =
                          !isLoading && whitelist?.includes(address)
                        return (
                          <option
                            key={address}
                            value={address}
                            data-testid="form-option"
                            disabled={!isWhitelisted}
                          >
                            {idType === IdTypes.USER ? "User" : "Account"}:{" "}
                            {address} {name ? `(${name})` : null}
                            {isWhitelisted ? null : (
                              <Text color="red.500" fontSize="sm">
                                (Not whitelisted)
                              </Text>
                            )}
                          </option>
                        )
                      },
                    )
                  : null}
              </Field>
              {errors.address && touched.address ? (
                <Text color="red.500" data-testid="error-address">
                  {errors.address}
                </Text>
              ) : null}
            </FormControl>

            <Button
              mt={4}
              type="submit"
              data-testid="next-btn"
              colorScheme="brand.teal"
            >
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
