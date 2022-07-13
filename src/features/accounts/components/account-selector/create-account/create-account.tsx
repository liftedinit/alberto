import React from "react"
import { useNavigate } from "react-router-dom"
import {
  FormProvider,
  useForm,
  useFormContext,
  useController,
  useFieldArray,
  get,
} from "react-hook-form"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  Box,
  Checkbox,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  OptionCard,
  PlusIcon,
  Role,
  RolesSelector,
  Step,
  Steps,
  StepsProvider,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  useSteps,
  useStepsContext,
  useBreakpointValue,
  VStack,
  FieldWrapper,
  DataField,
  TxnExpireText,
  MinusIcon,
  AddressBookIcon,
  useToast,
} from "components"
import { AccountRole } from "many-js"
import { ContactSelector, useGetContactName } from "features/contacts"
import { MultisigSettingsFields } from "../../multisig-settings-fields"
import { AccountInfo } from "../../account-info"
import {
  accountLedgerFeature,
  accountMultisigFeature,
  CreateAccountFormData,
  useCreateAccount,
  useAccountsStore,
  useAccountStore,
} from "features/accounts"

const steps = [
  { label: "Select Features", content: SelectFeatures },
  { label: "Account Settings", content: AccountSettings },
  { label: "Feature Settings", content: FeatureSettings },
  { label: "Review", content: Review },
]

export function CreateAccount() {
  const useStepsState = useSteps({ initialStep: 0 })
  const formMethods = useForm<CreateAccountFormData>({
    defaultValues: {
      features: {
        [accountLedgerFeature]: false,
        [accountMultisigFeature]: false,
      },
      accountSettings: {
        name: "",
        owners: [{ address: "", roles: [] }],
      },
      featureSettings: {
        [accountMultisigFeature]: {
          threshold: 0,
          expireInSecs: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          executeAutomatically: "0",
        },
      },
    },
  })
  return (
    <>
      <FormProvider {...formMethods}>
        <StepsProvider value={useStepsState}>
          <Steps>
            {steps.map((step, idx) => {
              return (
                <Step key={step.label} label={step.label}>
                  <Box paddingInlineStart={14}>
                    {idx === useStepsState.activeStep ? <step.content /> : null}
                  </Box>
                </Step>
              )
            })}
          </Steps>
        </StepsProvider>
      </FormProvider>
    </>
  )
}

function SelectFeatures() {
  const { nextStep } = useStepsContext()
  const { register } = useFormContext()

  return (
    <>
      <VStack alignItems="flex-start">
        <OptionCard
          label="Ledger"
          description="Adds “canLedgerTransact” role for selection which allows any identity with this role to perform regular ledger transactions."
        >
          <Checkbox
            colorScheme="brand.teal"
            aria-label="account ledger feature"
            {...register(`features.${accountLedgerFeature}`)}
          />
        </OptionCard>
        <OptionCard
          label="Multisig"
          description="Enables transactions using multiple signatures."
        >
          <Checkbox
            colorScheme="brand.teal"
            aria-label="account multisig feature"
            {...register(`features.${accountMultisigFeature}`)}
          />
        </OptionCard>
      </VStack>
      <Button size="sm" colorScheme="brand.teal" mt={4} onClick={nextStep}>
        Next
      </Button>
    </>
  )
}

function AccountSettings() {
  const inputSize = useBreakpointValue({ base: "sm", md: "md" })
  const { nextStep, prevStep } = useStepsContext()

  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: "accountSettings.owners",
  })

  React.useEffect(() => {
    setFocus("accountSettings.name")
  }, [setFocus])

  return (
    <>
      <FieldWrapper
        label="Name"
        error={get(errors, "accountSettings.name.message")}
        isRequired
        labelProps={{
          fontSize: inputSize,
        }}
        mb={4}
      >
        <Input
          size={inputSize}
          placeholder="account name..."
          {...register("accountSettings.name", {
            required: "This field is required",
          })}
          variant="filled"
        />
      </FieldWrapper>

      <FieldWrapper
        label="Owners And Roles"
        labelProps={{ fontSize: inputSize }}
      >
        <VStack alignItems="flex-start" w="full" divider={<Divider />}>
          {fields.map((field, idx) => {
            return (
              <Box w="full" key={field.id}>
                <AccountOwnerField
                  onRemoveClick={() => remove(idx)}
                  addressFieldName={`accountSettings.owners.${idx}.address`}
                  rolesFieldName={`accountSettings.owners.${idx}.roles`}
                />
              </Box>
            )
          })}
        </VStack>
      </FieldWrapper>

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
      <Flex gap={2} mt={8}>
        <Button size="sm" onClick={prevStep}>
          Prev
        </Button>
        <Button
          size="sm"
          colorScheme="brand.teal"
          onClick={handleSubmit(nextStep)}
        >
          Next
        </Button>
      </Flex>
    </>
  )
}

function AccountOwnerField({
  addressFieldName,
  rolesFieldName,
  onRemoveClick,
}: {
  addressFieldName: string
  rolesFieldName: string
  onRemoveClick: () => void
}) {
  const inputSize = useBreakpointValue({ base: "sm", md: "md" })
  const tagSize = useBreakpointValue({ base: "sm", md: "md" })
  const { getValues, watch } = useFormContext()
  const getContactName = useGetContactName()

  const owners = watch("accountSettings.owners")

  const isLedgerTransactEnabled = getValues(`features.${accountLedgerFeature}`)

  const {
    field: addressField,
    fieldState: { error },
  } = useController({
    name: addressFieldName,
    rules: {
      required: "Owner address is required",
      validate: {
        noDuplicates: val => {
          const count = owners.reduce(
            (acc: number, owner: { address: string }) => {
              return owner.address === val ? acc + 1 : acc
            },
            0,
          )
          return count >= 2 ? "Duplicate owners not allowed" : true
        },
      },
    },
  })
  const contactName = getContactName(addressField.value)

  const {
    field: { onChange: onRolesChange, value: rolesValue },
    fieldState: { error: rolesError },
  } = useController({
    name: rolesFieldName,
    rules: {
      required: "Roles is required",
    },
  })

  const rolesValueRef = React.useRef(rolesValue)
  rolesValueRef.current = rolesValue
  const isRemovedRef = React.useRef(false)
  React.useEffect(() => {
    if (!isLedgerTransactEnabled && !isRemovedRef.current) {
      isRemovedRef.current = true
      onRolesChange(
        rolesValueRef.current.filter(
          (r: string) => r !== AccountRole[AccountRole.canLedgerTransact],
        ),
      )
    }
  }, [isLedgerTransactEnabled, rolesValue, onRolesChange])

  const roles: Role[] = [
    {
      label: "Owner",
      description: "Can perform regular ledger transactions.",
      value: AccountRole[AccountRole.owner],
    },
    {
      label: "Multisig Submit",
      description:
        "Can submit new transactions and withdraw own submitted transactions.",
      value: AccountRole[AccountRole.canMultisigSubmit],
    },
    {
      label: "Multisig Approve",
      description: "Can approve transactions and revoke their own approvals.",
      value: AccountRole[AccountRole.canMultisigApprove],
    },
  ]

  if (isLedgerTransactEnabled) {
    roles.push({
      label: "Ledger Transact",
      description:
        "Can perform regular transactions that would be possible from their identities, from this account.",
      value: AccountRole[AccountRole.canLedgerTransact],
    })
  }

  return (
    <Box bgColor="gray.100" p={3} rounded="md">
      <FieldWrapper
        error={error?.message}
        label="Owner"
        labelProps={{ fontSize: inputSize }}
      >
        <Flex gap={2} alignItems="center" rounded="sm" p={2} bgColor="white">
          <VStack spacing={0} w="full" alignItems="flex-start">
            {contactName ? (
              <Text
                as="span"
                fontSize={inputSize}
                fontWeight="semibold"
                casing="capitalize"
              >
                {contactName}
              </Text>
            ) : null}
            <Input
              placeholder="mahrdiqb7h7agbx..."
              variant="unstyled"
              bgColor="white !important"
              size={inputSize}
              {...addressField}
            />
          </VStack>
          <ContactSelector
            onContactClicked={(onClose, c) => {
              addressField.onChange(c.address)
              onClose()
            }}
          >
            {onOpen => {
              return (
                <IconButton
                  aria-label="select contact"
                  icon={<AddressBookIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="brand.teal"
                  onClick={onOpen}
                />
              )
            }}
          </ContactSelector>
        </Flex>
      </FieldWrapper>
      <FieldWrapper
        error={rolesError?.message}
        label="Roles"
        mt={4}
        labelProps={{ fontSize: inputSize }}
      >
        <Flex
          gap={1}
          flexWrap="wrap"
          flexGrow={1}
          alignItems="center"
          p={2}
          bgColor="white"
          rounded="sm"
        >
          {rolesValue.map((roleName: string, idx: number, arr: string[]) => {
            return (
              <Tag
                key={roleName}
                size={tagSize}
                variant="solid"
                colorScheme="brand.teal"
              >
                <TagLabel fontSize={inputSize} fontWeight="medium">
                  {roleName}
                </TagLabel>
                <TagCloseButton
                  onClick={() => {
                    const filtered = rolesValue.filter(
                      (r: string) => r !== roleName,
                    )
                    onRolesChange(filtered)
                  }}
                />
              </Tag>
            )
          })}
          <RolesSelector
            rolesList={roles}
            selectedRoles={rolesValue}
            onRoleClicked={(_, roles) => {
              onRolesChange(roles)
            }}
          >
            {onOpen => {
              return (
                <IconButton
                  aria-label="select roles"
                  size="xs"
                  variant="ghost"
                  icon={<PlusIcon />}
                  colorScheme="brand.teal"
                  onClick={onOpen}
                />
              )
            }}
          </RolesSelector>
        </Flex>
      </FieldWrapper>
      <Flex justifyContent="flex-end" mt={2}>
        <IconButton
          size="xs"
          title="remove owner"
          aria-label="remove owner"
          colorScheme="red"
          onClick={onRemoveClick}
          icon={<MinusIcon boxSize={3} />}
        />
      </Flex>
    </Box>
  )
}

function FeatureSettings() {
  const { nextStep, prevStep } = useStepsContext()
  const identityAddress = useAccountsStore(s => s.byId.get(s.activeId))?.address
  const { getValues, handleSubmit } = useFormContext()
  const showMultisigSettings = getValues(`features.${accountMultisigFeature}`)
  const owners = getValues("accountSettings.owners")
  const isIdentityInOwners = owners.find(
    (o: { address: string }) => o.address === identityAddress,
  )
  const ownersCount = isIdentityInOwners ? owners.length : owners.length + 1
  return (
    <>
      {showMultisigSettings && (
        <>
          <Heading size="md" mb={2}>
            Multisig Settings
          </Heading>
          <VStack alignItems="flex-start" spacing={4}>
            <MultisigSettingsFields
              maxApprovers={ownersCount}
              name={`featureSettings.${accountMultisigFeature}.`}
            />
          </VStack>
        </>
      )}
      <Flex gap={2} mt={4}>
        <Button size="sm" onClick={prevStep}>
          Prev
        </Button>
        <Button
          size="sm"
          colorScheme="brand.teal"
          onClick={handleSubmit(nextStep)}
        >
          Next
        </Button>
      </Flex>
    </>
  )
}

function Review() {
  const toast = useToast()
  const update = useAccountStore(s => s.update)
  const navigate = useNavigate()
  const { handleSubmit, getValues } = useFormContext()
  const { prevStep } = useStepsContext()

  const { mutate, error, data, isLoading } = useCreateAccount()

  function onCreateClick(formData: unknown) {
    mutate(formData as CreateAccountFormData, {
      onSuccess: res => {
        toast({
          status: "success",
          title: "Create Account",
          description: "Account was created",
        })
        update(res.address, {})
        navigate(res.address)
      },
    })
  }

  const showMultisigSettings = getValues(`features.${accountMultisigFeature}`)

  const values = getValues()

  return (
    <>
      <Heading size="md" mb={2}>
        Account Settings
      </Heading>
      <AccountInfo
        accountInfo={{
          description: values.accountSettings.name,
          roles: (values?.accountSettings?.owners ?? []).reduce(
            (
              acc: Map<string, string[]>,
              r: { address: string; roles: string[] },
            ) => {
              acc.set(r.address, r.roles)
              return acc
            },
            new Map(),
          ),
          features: new Map(),
        }}
      />
      {showMultisigSettings ? (
        <>
          <Heading size="md" mb={2} mt={4}>
            Multisig Settings
          </Heading>
          <DataField
            label="Required Approvers"
            value={values.featureSettings[accountMultisigFeature].threshold}
          />
          <DataField label="Transaction Expiration">
            <TxnExpireText
              hours={values.featureSettings[accountMultisigFeature].hours}
              minutes={values.featureSettings[accountMultisigFeature].minutes}
              seconds={values.featureSettings[accountMultisigFeature].seconds}
            />
          </DataField>
          <DataField
            label="Execute Automatically"
            value={
              values.featureSettings[accountMultisigFeature]
                .executeAutomatically === "1"
                ? "Yes"
                : "No"
            }
          />
        </>
      ) : null}
      {error?.message ? (
        <Alert status="warning" variant="left-accent">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}
      <Flex gap={2} mt={8}>
        <Button size="sm" onClick={prevStep}>
          Prev
        </Button>
        <Button
          size="sm"
          colorScheme="brand.teal"
          onClick={handleSubmit(onCreateClick)}
          isLoading={isLoading}
          loadingText="Creating"
        >
          Create
        </Button>
      </Flex>
    </>
  )
}
