import React from "react"
import { Address, WebAuthnIdentity } from "many-js"
import {
  Alert,
  AlertIcon,
  Button,
  Box,
  CopyToClipboard,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  ListItem,
  Modal,
  Text,
  useToast,
  UnorderedList,
  UsbIcon,
} from "components"
import {
  AddAccountMethodProps,
  AddAccountMethodTypes,
} from "./add-account-modal"
import { useAccountsStore, useCredentialsStore } from "features/accounts"
import { doesAccountExist } from "features/accounts/utils"
import { arrayBufferToBase64, base64ToArrayBuffer } from "helper/convert"

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
  publicKey: HTMLInputElement
}

export function HardwareAuthenticator({
  addMethod,
  setAddMethod,
  setShowDefaultFooter,
  onSuccess,
}: AddAccountMethodProps & {
  addMethod: AddAccountMethodTypes
  setShowDefaultFooter: (show: boolean) => void
}) {
  const toast = useToast()

  const { accounts, createAccount } = useAccountsStore(
    ({ createAccount, byId }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )

  const { byAddress, updateCredential } = useCredentialsStore(
    ({ byAddress, updateCredential }) => ({ byAddress, updateCredential }),
  )
  const isCreate = addMethod === AddAccountMethodTypes.createAuthenticator

  const [publicAddress, setPublicAddress] = React.useState("")

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    if (publicAddress) {
      return onSuccess()
    }
    const { name: nameInput } = (e.target as HTMLFormElement)
      .elements as FormElements
    const name = nameInput.value.trim()
    if (!name) {
      nameInput.value = ""
      return form.reportValiditiy()
    }
    try {
      const identity = await WebAuthnIdentity.create()
      const base64CredId = arrayBufferToBase64(identity.rawId)
      const publicKeyStr = Address.fromPublicKey(identity.publicKey).toString()
      const publicKeyBase64 = arrayBufferToBase64(identity.publicKey)

      setPublicAddress(publicKeyStr)
      updateCredential(publicKeyStr, base64CredId, publicKeyBase64)
      createAccount({ name, identity })
    } catch (e) {
      console.error("webauthn", e)
    }
  }

  async function onImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const { name: nameInput, publicKey: publicKeyInput } = (
      e.target as HTMLFormElement
    ).elements as FormElements

    const name = nameInput.value.trim()
    const publicKey = publicKeyInput.value.trim()

    if (!name || !publicKey) {
      if (!name) nameInput.value = ""
      if (!publicKey) publicKeyInput.value = ""
      return form.reportValidity()
    }

    try {
      // todo: call api when k-v store is ready
      const saved = byAddress.get(publicKey)
      if (!saved) {
        return console.error("credential not found")
      }
      const { base64CredId, publicKeyBase64 } = saved
      const publicKeyBytes = base64ToArrayBuffer(publicKeyBase64)
      const accountExists = doesAccountExist(publicKeyBytes, accounts)
      if (accountExists) {
        return toast({
          status: "warning",
          title: "Add Account",
          description: "Account already exists",
        })
      }
      const authenticated = await WebAuthnIdentity.getCredential(
        Buffer.from(base64CredId, "base64"),
      )
      createAccount({
        name,
        identity: new WebAuthnIdentity(
          Buffer.from(publicKeyBytes),
          authenticated.rawId,
        ),
      })
      toast({
        status: "success",
        title: "Add Account",
        description: "Account was imported",
      })
      onSuccess()
    } catch (e) {
      console.error("webauthn", e)
      toast({
        status: "warning",
        title: "Add Account",
        description: (e as Error)?.message ?? "An unexpected error occurred.",
      })
    }
  }

  React.useEffect(() => {
    setShowDefaultFooter(false)
  }, [setShowDefaultFooter])

  return (
    <>
      <Modal.Header>{`${
        isCreate ? "Create" : "Import"
      } From Hardware Authenticator`}</Modal.Header>
      <Modal.Body>
        <Button variant="link" onClick={() => setAddMethod("")}>
          Back
        </Button>
        <Container>
          <form id="add-account-form" onSubmit={isCreate ? onCreate : onImport}>
            {isCreate ? <Create publicAddress={publicAddress} /> : <Import />}
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container display="flex" justifyContent="flex-end">
          <Button type="submit" form="add-account-form">
            {publicAddress ? "Done" : isCreate ? "Create" : "Import"}
          </Button>
        </Container>
      </Modal.Footer>
    </>
  )
}

function Create({ publicAddress }: { publicAddress?: string }) {
  return (
    <>
      {!publicAddress && (
        <>
          <InfoAlert>
            <UnorderedList>
              <ListItem>
                You must have a hardware authenticator available.
              </ListItem>
              <ListItem>
                Enter a name and click the Create button to initiate the account
                creation process.
              </ListItem>
            </UnorderedList>
          </InfoAlert>
          <FormControl mt={3} isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input autoFocus id="name" maxLength={64} />
          </FormControl>
        </>
      )}
      {publicAddress && (
        <Alert status="success" variant="left-accent" mb={3}>
          <AlertIcon />
          Keep a copy of your public key to recover/import it later.
        </Alert>
      )}
      {publicAddress && (
        <Box mb={3}>
          <FormLabel>Public Key</FormLabel>
          <Flex
            bgColor="gray.100"
            p={2}
            w="auto"
            display="inline-flex"
            gap={2}
            alignItems="center"
            rounded="md"
          >
            <Text display="inline-flex">{publicAddress}</Text>
            <CopyToClipboard toCopy={publicAddress} />
          </Flex>
        </Box>
      )}
    </>
  )
}

function Import() {
  return (
    <>
      <InfoAlert>
        You will need the same hardware authenticator you used to create your
        account.
      </InfoAlert>
      <FormControl isRequired mb={3} mt={4}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input autoFocus id="name" variant="filled" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="publicKey">Public Key</FormLabel>
        <Input id="publicKey" variant="filled" maxLength={50} />
      </FormControl>
    </>
  )
}

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert status="info" variant="left-accent">
      <HStack spacing={4}>
        <Box>
          <UsbIcon boxSize={10} />
        </Box>
        <Box>{children}</Box>
      </HStack>
    </Alert>
  )
}
