import { useForm, FormProvider } from "react-hook-form"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  VStack,
} from "shared/components"
import {
  MultisigSettingsFields,
  useMultisigSetDefaults,
  useAddFeatures,
  useGetAccountInfo,
} from "features/accounts"
import {
  AccountFeatureTypes,
  AccountMultisigArgument,
} from "@liftedinit/many-js"

export function MultisigSettings({
  accountAddress,
}: {
  accountAddress: string | undefined
}) {
  const { data: accountInfoData } = useGetAccountInfo(accountAddress)
  const hasMultisigFeature = accountInfoData?.hasMultisigFeature

  const formMethods = useForm({
    defaultValues: {
      threshold: 0,
      expireInSecs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      executeAutomatically: false,
    },
  })

  const {
    mutate: doAddFeatures,
    isLoading: isAddingFeatures,
    isSuccess: isAddFeaturesSuccess,
    error: addFeaturesError,
  } = useAddFeatures(accountAddress)

  const {
    mutate: doSetMultisigDefaults,
    isLoading: isSettingDefaults,
    isSuccess: isSetDefaultsSuccess,
    error,
  } = useMultisigSetDefaults(accountAddress!)

  function onSave({
    expireInSecs,
    threshold,
    executeAutomatically,
  }: {
    expireInSecs: number
    threshold: number
    executeAutomatically: boolean
  }) {
    if (!hasMultisigFeature) {
      doAddFeatures({
        features: [
          [
            AccountFeatureTypes.accountMultisig,
            new Map()
              .set(AccountMultisigArgument.threshold, threshold)
              .set(AccountMultisigArgument.expireInSecs, expireInSecs)
              .set(
                AccountMultisigArgument.executeAutomatically,
                executeAutomatically,
              ),
          ],
        ],
      })
    } else {
      doSetMultisigDefaults({
        expireInSecs,
        threshold,
        executeAutomatically,
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSave)}>
        <VStack alignItems="flex-start" spacing={6}>
          <MultisigSettingsFields accountAddress={accountAddress!} />

          {addFeaturesError?.message || error?.message ? (
            <Alert status="warning" variant="left-accent">
              <AlertIcon />
              <AlertDescription>
                {addFeaturesError?.message ?? error?.message}
              </AlertDescription>
            </Alert>
          ) : null}
          {isSetDefaultsSuccess || isAddFeaturesSuccess ? (
            <Alert status="success" variant="left-accent">
              <AlertIcon />
              <AlertDescription>Settings saved</AlertDescription>
            </Alert>
          ) : null}
          <Button
            type="submit"
            colorScheme="brand.teal"
            isLoading={isSettingDefaults || isAddingFeatures}
            loadingText="Saving"
            w={{ base: "full", md: "auto" }}
          >
            Save
          </Button>
        </VStack>
      </form>
    </FormProvider>
  )
}
