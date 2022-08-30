import React from "react"
import { WebAuthnIdentity } from "@liftedinit/many-js"
import {
  Alert,
  Button,
  Box,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  RadioGroup,
  Radio,
  Text,
  useToast,
  UsbIcon,
  ChevronLeftIcon,
} from "components"
import { AddAccountMethodProps } from "../add-account-modal"
import {
  useAccountsStore,
  useCredentialsStore,
  useGetWebauthnCredential,
} from "features/accounts"
import { doesAccountExist } from "features/accounts/utils"
import { base64ToArrayBuffer } from "helper/convert"
import { RecoverOptions } from "features/accounts/types"
import { LedgerSafariWarning } from "./ledger-safari-warning"

export function ImportFlow({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const toast = useToast()

  const { mutateAsync: doGetWebauthnCredential, isLoading } =
    useGetWebauthnCredential()

  const getCredential = useCredentialsStore(s => s.getCredential)

  const { accounts, createAccount } = useAccountsStore(
    ({ createAccount, byId }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const phraseOrAddressInputRef = React.useRef<HTMLInputElement>(null)
  const [importMethod, setImportMethod] = React.useState<RecoverOptions>(
    RecoverOptions.phrase,
  )

  async function fetchCredentialData(phraseOrAddress: string) {
    const credLocalStorage = getCredential(phraseOrAddress)
    if (credLocalStorage) {
      return {
        credentialId: base64ToArrayBuffer(credLocalStorage.base64CredentialId),
        cosePublicKey: credLocalStorage.cosePublicKey,
      }
    }
    return await doGetWebauthnCredential({
      getFrom: importMethod,
      value: phraseOrAddress,
    })
  }

  async function onImportClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = nameInputRef?.current?.value?.trim()

    let phraseOrAddress = phraseOrAddressInputRef?.current?.value?.trim()

    if (!name || !phraseOrAddress) {
      if (!name) nameInputRef!.current!.value = ""
      if (!phraseOrAddress) phraseOrAddressInputRef!.current!.value = ""
      return form.reportValidity()
    }

    try {
      const credentialData = await fetchCredentialData(phraseOrAddress)
      if (!credentialData?.cosePublicKey && !credentialData?.credentialId) {
        throw new Error("An unexpected error occurred")
      }
      const { cosePublicKey, credentialId } = credentialData
      const webAuthnIdentity = new WebAuthnIdentity(cosePublicKey, credentialId)
      const address = (await webAuthnIdentity.getAddress()).toString()
      const accountExists = await doesAccountExist(address, accounts)
      if (accountExists) {
        return toast({
          status: "warning",
          title: "Add Account",
          description: "Account already exists",
        })
      }
      await WebAuthnIdentity.getCredential(credentialId)
      createAccount({
        name,
        identity: webAuthnIdentity,
      })
      toast({
        status: "success",
        title: "Add Account",
        description: "Account was imported",
      })
      onSuccess()
    } catch (err) {
      toast({
        status: "warning",
        title: "Add Account",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      })
    }
  }

  return (
    <>
      <Modal.Header>Import From Hardware Authenticator</Modal.Header>
      <Modal.Body>
        <Button
          variant="link"
          onClick={() => setAddMethod("")}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Container>
          <LedgerSafariWarning mb={3} />
          <Alert status="info" variant="left-accent" mb={8}>
            <HStack spacing={4}>
              <Box>
                <UsbIcon boxSize={10} />
              </Box>
              <Box>
                <Text>
                  You will need the same hardware authenticator you used to
                  create your account.
                </Text>
              </Box>
            </HStack>
          </Alert>
          <RadioGroup
            onChange={nextVal => {
              setImportMethod(nextVal as unknown as RecoverOptions)
            }}
            value={importMethod}
            colorScheme="brand.teal"
          >
            <HStack>
              <Radio value={RecoverOptions.phrase}>Phrase</Radio>
              <Radio value={RecoverOptions.address}>Public Address</Radio>
            </HStack>
          </RadioGroup>
          <form id="import-form" onSubmit={onImportClick}>
            <FormControl isRequired mb={3} mt={4}>
              <FormLabel htmlFor="name">Account Name</FormLabel>
              <Input autoFocus id="name" variant="filled" ref={nameInputRef} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="phraseOrAddress">
                {importMethod === RecoverOptions.phrase
                  ? "Phrase"
                  : "Public Address"}
              </FormLabel>
              <Input
                flexGrow={1}
                autoCapitalize="none"
                id="phraseOrAddress"
                variant="filled"
                maxLength={50}
                ref={phraseOrAddressInputRef}
              />
            </FormControl>
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            form="import-form"
            w={{ base: "full", md: "auto" }}
            isLoading={isLoading}
          >
            Import
          </Button>
        </Container>
      </Modal.Footer>
    </>
  )
}
