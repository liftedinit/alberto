import React from "react"
import { Alert, AlertIcon, AlertDescription, Button, VStack } from "components"
import {
  MultisigSettingsFields,
  useMultisigSetDefaults,
} from "features/accounts"

export function MultisigSettings({
  accountAddress,
}: {
  accountAddress: string | undefined
}) {
  const formRef = React.useRef<HTMLFormElement>(null)

  const {
    mutate: doSetMultisigDefaults,
    isLoading: isSaving,
    isSuccess,
    error,
  } = useMultisigSetDefaults(accountAddress!)

  function onSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const threshold = Number(formData.get("threshold"))
    const executeAutomatically = formData.get("executeAutomatically") === "1"
    const expireInSecs = Number(formData.get("expireInSecs"))

    doSetMultisigDefaults({
      expireInSecs,
      threshold,
      executeAutomatically,
    })
  }

  return (
    <form onSubmit={onSave} ref={formRef}>
      <VStack alignItems="flex-start" spacing={6}>
        <MultisigSettingsFields accountAddress={accountAddress!} />

        {error?.message ? (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}
        {isSuccess && (
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            <AlertDescription>Settings saved</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          colorScheme="brand.teal"
          isLoading={isSaving}
          loadingText="Saving"
          w={{ base: "full", md: "auto" }}
        >
          Save
        </Button>
      </VStack>
    </form>
  )
}
