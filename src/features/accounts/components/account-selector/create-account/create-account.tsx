import React from "react"
import { useNavigate } from "react-router-dom"
import {
  FormProvider,
  useForm,
  useFormContext,
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
  Flex,
  Heading,
  Input,
  OptionCard,
  PlusIcon,
  Step,
  Steps,
  StepsProvider,
  Text,
  useSteps,
  useStepsContext,
  useBreakpointValue,
  VStack,
  FieldWrapper,
  DataField,
  TxnExpireText,
  useToast,
} from "components"
import { AccountFeatureTypes, NetworkAttributes } from "many-js"
import { MultisigSettingsFields } from "../../multisig-settings-fields"
import { AccountInfo } from "../../account-info"
import {
  AccountOwnerField,
  accountLedgerFeature,
  accountMultisigFeature,
  CreateAccountFormData,
  useCreateAccount,
  useAccountsStore,
  useAccountStore,
  getRolesList,
} from "features/accounts"
import { useNetworkStatus } from "features/network"

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
          executeAutomatically: false,
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
  const { register, watch } = useFormContext()

  const { getAttribute, getFeatures } = useNetworkStatus()
  const accountAttribute = getAttribute(NetworkAttributes.account)
  const {
    [AccountFeatureTypes.accountLedger]: hasLedger,
    [AccountFeatureTypes.accountMultisig]: hasMultisig,
  } = getFeatures(accountAttribute, [
    AccountFeatureTypes.accountLedger,
    AccountFeatureTypes.accountMultisig,
  ])
  const watchFeatures = watch("features")
  const hasFeature = Object.values(watchFeatures).some(v => !!v)

  const featureOptions = []
  hasLedger &&
    featureOptions.push({
      label: "Ledger",
      description:
        'Allows any identity with the "canLedgerTransact" role perform regular ledger transactions.',
      name: `features.${accountLedgerFeature}`,
      ariaLabel: "account ledger feature",
    })

  hasMultisig &&
    featureOptions.push({
      label: "Multisig",
      description: "Enables transactions requiring multiple signatures.",
      name: `features.${accountMultisigFeature}`,
      ariaLabel: "account multisig feature",
    })

  return (
    <>
      {featureOptions.length === 0 && (
        <Alert status="info" rounded="md">
          <AlertIcon />
          <Text>There are no account features</Text>
        </Alert>
      )}
      <VStack alignItems="flex-start">
        {featureOptions.map(opt => {
          return (
            <OptionCard
              key={opt.label}
              label={opt.label}
              description={opt.description}
            >
              <Checkbox
                colorScheme="brand.teal"
                aria-label="account ledger feature"
                {...register(opt.name)}
              />
            </OptionCard>
          )
        })}
      </VStack>
      <Button
        size="sm"
        colorScheme="brand.teal"
        mt={8}
        onClick={nextStep}
        isDisabled={!hasFeature}
      >
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
    setFocus,
    getValues,
    formState: { errors },
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: "accountSettings.owners",
  })

  const hasMultisigFeature = getValues(`features.${accountMultisigFeature}`)
  const hasLedgerFeature = getValues(`features.${accountLedgerFeature}`)

  const roles = getRolesList({ hasLedgerFeature, hasMultisigFeature })
  const owners = getValues("accountSettings.owners")

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

      <FieldWrapper label="Roles" labelProps={{ fontSize: inputSize }}>
        <VStack alignItems="flex-start" w="full" spacing={4}>
          {fields.map((field, idx) => {
            return (
              <Box w="full" key={field.id}>
                <AccountOwnerField
                  onRemoveClick={() => remove(idx)}
                  addressFieldName={`accountSettings.owners.${idx}.address`}
                  rolesFieldName={`accountSettings.owners.${idx}.roles`}
                  isLedgerTransactEnabled={hasLedgerFeature}
                  isMultisigEnabled={hasMultisigFeature}
                  owners={owners}
                  roles={roles}
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
      {showMultisigSettings ? (
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
      ) : (
        <Alert status="info" rounded="md">
          <AlertIcon />
          <Text>Features that require configuration were not selected.</Text>
        </Alert>
      )}
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

function Review() {
  const toast = useToast()
  const update = useAccountStore(s => s.update)
  const navigate = useNavigate()
  const { handleSubmit, getValues } = useFormContext()
  const { prevStep } = useStepsContext()

  const { mutate, error, isLoading } = useCreateAccount()

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
                .executeAutomatically
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
        <Button size="sm" onClick={prevStep} isDisabled={isLoading}>
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
