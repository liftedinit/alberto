import React from "react"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FieldWrapper,
  Flex,
  Heading,
  Input,
  PlusIcon,
  VStack,
} from "components"
import {
  AccountOwnerField,
  getRolesList,
  useGetAccountInfo,
  useAddRoles,
  useRemoveRoles,
  useSetDescription,
} from "features/accounts"

type RolesForm = {
  owners: { address: string; roles: string[] }[]
}
type DescriptionForm = {
  description: string
}

export function AccountSettings({
  accountAddress,
}: {
  accountAddress?: string
}) {
  const {
    mutateAsync: doAddRoles,
    isLoading: isAddingRoles,
    isSuccess: isAddRolesSuccess,
    error: addRolesError,
  } = useAddRoles(accountAddress!)
  const {
    mutate: doRemoveRoles,
    isLoading: isRemovingRoles,
    isSuccess: isRemoveRolesSuccess,
    error: removeRolesError,
  } = useRemoveRoles(accountAddress!)

  const {
    mutate: doSetDescription,
    isLoading: isSetDescriptionLoading,
    error: setDescriptionError,
    isSuccess: isSetDescriptionSuccess,
  } = useSetDescription(accountAddress!)

  const descriptionFormMethods = useForm<DescriptionForm>({
    defaultValues: { description: "" },
  })

  const rolesFormMethods = useForm<RolesForm>({
    defaultValues: {
      owners: [{ address: "", roles: [] }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: rolesFormMethods.control,
    name: "owners",
  })

  const { data: accountInfoData } = useGetAccountInfo(accountAddress)

  async function onSaveDescription({ description }: DescriptionForm) {
    doSetDescription({ description })
  }

  async function onSaveRoles({ owners }: RolesForm) {
    if (!Array.isArray(owners)) return
    const oldOwners = accountInfoData?.accountInfo?.roles ?? new Map()

    const addRolesPayload = owners.reduce((acc, owner) => {
      const { address, roles } = owner

      const isNew = !oldOwners?.has(address)
      if (isNew) {
        acc.set(address, roles)
      } else {
        const oldRoles = oldOwners?.get(address)
        const newRolesToSave = roles.filter(r => !oldRoles?.includes(r))
        if (newRolesToSave.length) {
          acc.set(address, newRolesToSave)
        }
      }
      return acc
    }, new Map() as Map<string, string[]>)

    const removeRolesPayload = Array.from(oldOwners).reduce((acc, entry) => {
      const [address, roles] = entry
      const found = owners.find(o => o.address === address)
      if (!found) {
        acc.set(address, roles)
      } else {
        const rolesToRemove = roles.filter(
          (r: string) => !found.roles.includes(r),
        )
        if (rolesToRemove.length) {
          acc.set(address, rolesToRemove)
        }
      }
      return acc
    }, new Map() as Map<string, string[]>)

    try {
      if (addRolesPayload.size) {
        await doAddRoles({ roles: addRolesPayload })
      }
      if (removeRolesPayload.size) {
        doRemoveRoles({ roles: removeRolesPayload })
      }
    } catch (e) {}
  }

  const isInitRef = React.useRef(false)
  React.useEffect(() => {
    if (accountInfoData?.accountInfo && !isInitRef.current) {
      isInitRef.current = true
      descriptionFormMethods.setValue(
        "description",
        accountInfoData.accountInfo.description,
      )

      const ownersAndRoles = Array.from(
        accountInfoData.accountInfo!.roles!,
      ).map(entry => {
        const [address, roles] = entry
        return { address, roles }
      })
      rolesFormMethods.setValue("owners", ownersAndRoles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountInfoData?.accountInfo])

  const owners = rolesFormMethods.getValues("owners")
  const hasLedgerFeature = Boolean(accountInfoData?.hasLedgerFeature)
  const hasMultisigFeature = Boolean(accountInfoData?.hasMultisigFeature)

  const roles = getRolesList({ hasLedgerFeature, hasMultisigFeature })

  return (
    <>
      <FieldWrapper
        label="Name"
        isRequired
        error={descriptionFormMethods.formState.errors.description?.message}
      >
        <Input
          {...descriptionFormMethods.register("description", {
            required: "Account name is required",
          })}
        />
      </FieldWrapper>
      {isSetDescriptionSuccess || setDescriptionError ? (
        <Alert
          rounded="md"
          mt={2}
          status={isSetDescriptionSuccess ? "success" : "warning"}
        >
          <AlertIcon />
          <AlertDescription>
            {isSetDescriptionSuccess
              ? "Account name saved"
              : setDescriptionError?.message}
          </AlertDescription>
        </Alert>
      ) : null}
      <Flex justifyContent="flex-end" mt={2} mb={6}>
        <Button
          colorScheme="brand.teal"
          onClick={descriptionFormMethods.handleSubmit(onSaveDescription)}
          size="sm"
          loadingText="Saving"
          isLoading={isSetDescriptionLoading}
        >
          Save
        </Button>
      </Flex>
      <FormProvider {...rolesFormMethods}>
        <Heading size="md" mb={2}>
          Roles
        </Heading>
        <VStack alignItems="flex-start" w="full" spacing={4}>
          {fields.map((field, idx) => {
            return (
              <Box w="full" key={field.id}>
                <AccountOwnerField
                  onRemoveClick={() => remove(idx)}
                  addressFieldName={`owners.${idx}.address`}
                  rolesFieldName={`owners.${idx}.roles`}
                  isLedgerTransactEnabled={hasLedgerFeature}
                  isMultisigEnabled={hasMultisigFeature}
                  owners={owners}
                  roles={roles}
                />
              </Box>
            )
          })}
        </VStack>
      </FormProvider>
      <Button
        size="sm"
        mt={2}
        colorScheme="brand.teal"
        variant="ghost"
        leftIcon={<PlusIcon boxSize={5} />}
        onClick={() => append({ address: "", roles: [] })}
      >
        Add Owner
      </Button>
      {addRolesError ||
      removeRolesError ||
      isAddRolesSuccess ||
      isRemoveRolesSuccess ? (
        <Alert
          rounded="md"
          mt={2}
          status={
            isAddRolesSuccess || isRemoveRolesSuccess ? "success" : "warning"
          }
        >
          <AlertIcon />
          <AlertDescription>
            {isAddRolesSuccess || isRemoveRolesSuccess
              ? "Roles saved"
              : addRolesError?.message ?? removeRolesError?.message}
          </AlertDescription>
        </Alert>
      ) : null}
      <Flex justifyContent="flex-end" mt={2} mb={6}>
        <Button
          onClick={rolesFormMethods.handleSubmit(onSaveRoles)}
          colorScheme="brand.teal"
          isLoading={isAddingRoles || isRemovingRoles}
          loadingText="Saving"
          size="sm"
        >
          Save
        </Button>
      </Flex>
    </>
  )
}
