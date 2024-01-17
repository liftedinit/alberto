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
import { IdentitiesAndAccounts, IdTypes, StepNames } from "./migration-form"
import { useEffect, useMemo, useState } from "react"
import { Account, useAccountsStore, useAccountStore } from "../../../accounts"
import { useGetAccountsInfo } from "../../../accounts/api/get-account-info"

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

const getUpdatedAccountsAndIdentities = (
  identityById: Map<number, Account>,
  accountById: Map<string, string>,
) => {
  const updatedAccountsAndIdentities = new Map()
  identityById.forEach((identity, id) => {
    const address = identity.address
    if (address.length === 50) {
      updatedAccountsAndIdentities.set(address, {
        idType: IdTypes.USER,
        address,
        id,
        name: identity.name,
      })
    }
  })

  accountById.forEach((info, account) => {
    updatedAccountsAndIdentities.set(account, {
      idType: IdTypes.ACCOUNT,
      address: account,
      name: info,
    })
  })

  return updatedAccountsAndIdentities
}

const getCombinedData = (info: any[], accountKeys: string[]) => {
  const combinedData = new Map()
  info.forEach((infoData, index) => {
    const accountId = accountKeys[index]
    combinedData.set(accountId, infoData.accountInfo.description)
  })
  return combinedData
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
  const [accountsAndIdentities, setAccountsAndIdentities] = useState<
    Map<string, IdentitiesAndAccounts>
  >(new Map())
  const [isLoaded, setIsLoaded] = useState(false)
  const identityById = useAccountsStore(s => s.byId)
  const accountById = useAccountStore(s => s.byId)
  const accountKeys = useMemo(
    () => Array.from(accountById.keys()),
    [accountById],
  )

  const allAccountInfos = useGetAccountsInfo(accountKeys)
  const allQueriesCompleted = allAccountInfos.every(
    queryResult => queryResult.isSuccess,
  )
  const info = useMemo(() => {
    return allQueriesCompleted
      ? allAccountInfos.map(queryResult => queryResult.data)
      : []
  }, [allAccountInfos, allQueriesCompleted])
  const combinedData = useMemo(() => {
    return getCombinedData(info, accountKeys)
  }, [allQueriesCompleted]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const updatedAccountsAndIdentities = getUpdatedAccountsAndIdentities(
      identityById,
      combinedData,
    )
    setAccountsAndIdentities(updatedAccountsAndIdentities)
    setIsLoaded(true)
  }, [identityById, combinedData])

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
              <strong>Note:</strong> TODO
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
                placeholder="Select Account/User"
              >
                {isLoaded
                  ? Array.from(accountsAndIdentities.values()).map(
                      ({ idType, address, name }) => (
                        <option key={address} value={address}>
                          {idType === IdTypes.USER ? "User" : "Account"}:{" "}
                          {address} {name ? `(${name})` : null}
                        </option>
                      ),
                    )
                  : null}
              </Field>
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
