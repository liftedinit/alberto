import React from "react"
import { WebAuthnIdentity } from "many-js"
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
import { arrayBufferToBase64, base64ToArrayBuffer } from "helper/convert"
import { RecoverOptions } from "features/accounts/types"

export function ImportFlow({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const toast = useToast()

  const { mutate: doGetWebauthnCredential, isLoading } =
    useGetWebauthnCredential()

  const byId = useCredentialsStore(s => s.byId)

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

  async function onImportClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = nameInputRef?.current?.value?.trim()
    const phraseOrAddress = phraseOrAddressInputRef?.current?.value?.trim()
    if (!name || !phraseOrAddress) {
      if (!name) nameInputRef!.current!.value = ""
      if (!phraseOrAddress) phraseOrAddressInputRef!.current!.value = ""
      return form.reportValidity()
    }
    doGetWebauthnCredential(
      { getFrom: importMethod, value: phraseOrAddress },
      {
        onSuccess: async ({ credentialId }) => {
          // prompt user to authenticate
          // get public key and check if account already exists
          const credential = await WebAuthnIdentity.getCredential(credentialId)

          const cosePublicKey = WebAuthnIdentity.getCosePublicKey(credential)
          const identity = new WebAuthnIdentity(cosePublicKey, credential.rawId)
          const accountExists = await doesAccountExist(
            identity.publicKey,
            accounts,
          )
          if (accountExists) {
            return toast({
              status: "warning",
              title: "Add Account",
              description: "Account already exists",
            })
          }
          createAccount({
            name,
            identity,
          })
          toast({
            status: "success",
            title: "Add Account",
            description: "Account was imported",
          })
          onSuccess()
        },
        onError: () => {},
      },
    )
    // const credentialExists = byId.get(phraseOrAddress)
    // if (!credentialExists) {
    //   return toast({
    //     title: "Add Account",
    //     description: "Credential does not exists",
    //     status: "warning",
    //   })
    // }
    // const { base64CredId, cosePublicKey } = credentialExists
    // const rawId = base64ToArrayBuffer(base64CredId)
    // const webAuthnIdentity = new WebAuthnIdentity(cosePublicKey, rawId)
    // const accountExists = await doesAccountExist(
    //   webAuthnIdentity.publicKey,
    //   accounts,
    // )
    // if (accountExists) {
    //   return toast({
    //     status: "warning",
    //     title: "Add Account",
    //     description: "Account already exists",
    //   })
    // }
    // await WebAuthnIdentity.getCredential(Buffer.from(base64CredId, "base64"))
    // createAccount({
    //   name,
    //   identity: webAuthnIdentity,
    // })
    // toast({
    //   status: "success",
    //   title: "Add Account",
    //   description: "Account was imported",
    // })
    // onSuccess()
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
              console.log("nextVal", nextVal)
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
          >
            Import
          </Button>
        </Container>
      </Modal.Footer>
    </>
  )
}
