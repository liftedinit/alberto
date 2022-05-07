import React from "react"
import { WebAuthnIdentity } from "many-js"
import { generateSlug } from "random-word-slugs"
import {
  Alert,
  Button,
  Box,
  Checkbox,
  CopyToClipboard,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  SimpleGrid,
  Text,
  useToast,
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
  phrase: HTMLInputElement
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
  const { byId, updateCredential } = useCredentialsStore(
    ({ byId, updateCredential }) => ({ byId, updateCredential }),
  )
  const toast = useToast()
  const [phrase, setPhrase] = React.useState("")
  const [webAuthnIdentity, setWebAuthnIdentity] = React.useState<
    WebAuthnIdentity | undefined
  >(undefined)
  const [isPhraseConfirmed, setPhraseConfirmed] = React.useState(false)

  function makePhrase(): string {
    const slug = generateSlug(2, { format: "lower" })
    const joined = slug.replaceAll(" ", "")
    if (byId.has(joined)) {
      return makePhrase()
    }
    return slug
  }

  function onMakePhrase() {
    const phrase = makePhrase()
    setPhrase(phrase)
  }

  const { accounts, createAccount } = useAccountsStore(
    ({ createAccount, byId }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )

  const isCreate = addMethod === AddAccountMethodTypes.createAuthenticator

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phrase) {
      return onDone(e)
    }
    try {
      const identity = await WebAuthnIdentity.create()
      setWebAuthnIdentity(identity)
      onMakePhrase()
    } catch (e) {
      console.error("webauthn", e)
    }
  }

  async function onDone(e: React.FormEvent<HTMLFormElement>) {
    if (webAuthnIdentity === undefined) return
    const form = e.target as HTMLFormElement
    const { name: nameInput } = (e.target as HTMLFormElement)
      .elements as FormElements
    const name = nameInput.value.trim()
    if (!name) {
      nameInput.value = ""
      return form.reportValiditiy()
    }
    const base64CredId = arrayBufferToBase64(webAuthnIdentity.rawId)
    updateCredential(phrase, base64CredId, webAuthnIdentity.cosePublicKey)
    createAccount({ name, identity: webAuthnIdentity })
    onSuccess()
  }

  async function onImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const { name: nameInput, phrase: phraseInput } = (
      e.target as HTMLFormElement
    ).elements as FormElements

    const name = nameInput.value.trim()
    const phraseText = phraseInput.value.trim()

    if (!name || !phraseText) {
      if (!name) nameInput.value = ""
      if (!phraseText) phraseInput.value = ""
      return form.reportValidity()
    }

    try {
      // todo: call api when k-v store is ready
      const saved = byId.get(phraseText)
      if (!saved) {
        return toast({
          status: "warning",
          title: "Add Account",
          description: "No account found with this phrase.",
        })
      }
      const { base64CredId, cosePublicKey } = saved
      const rawId = base64ToArrayBuffer(base64CredId)
      const webAuthnIdentity = new WebAuthnIdentity(cosePublicKey, rawId)
      const accountExists = doesAccountExist(
        webAuthnIdentity.publicKey,
        accounts,
      )
      if (accountExists) {
        return toast({
          status: "warning",
          title: "Add Account",
          description: "Account already exists",
        })
      }
      await WebAuthnIdentity.getCredential(Buffer.from(base64CredId, "base64"))
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
    return () => {
      setShowDefaultFooter(true)
    }
  }, [])

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
            {isCreate ? (
              <Create phrase={phrase} setPhraseConfirmed={setPhraseConfirmed} />
            ) : (
              <Import />
            )}
          </form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            form="add-account-form"
            disabled={!!phrase && !isPhraseConfirmed}
          >
            {phrase ? "Done" : isCreate ? "Authorize" : "Import"}
          </Button>
        </Container>
      </Modal.Footer>
    </>
  )
}

function Create({
  phrase,
  setPhraseConfirmed,
}: {
  phrase: string
  setPhraseConfirmed: (b: boolean) => void
}) {
  return (
    <>
      {!phrase && (
        <InfoAlert>
          <Text>
            Connect your hardware security module and authorize it to create a
            new account.
          </Text>
          <Text mt={4}>
            Click "Authorize" below and follow the instructions on the screen
          </Text>
        </InfoAlert>
      )}
      {phrase && (
        <>
          <FormControl mb={4} isRequired>
            <FormLabel htmlFor="name">Account Name</FormLabel>
            <Input autoFocus id="name" maxLength={64} />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            <Box>
              <Flex
                border="2px solid"
                borderColor="gray.300"
                alignItems="center"
                justifyContent="center"
                rounded="md"
                p={6}
                position="relative"
              >
                <Box position="absolute" top={1} right={1}>
                  <CopyToClipboard toCopy={phrase} />
                </Box>
                <Text textAlign="center" fontSize="2xl">
                  {phrase}
                </Text>
              </Flex>
            </Box>
            <Box>
              <Box>
                <Text>You will need this prase to access your account.</Text>

                <Text mt={4}>
                  If you lose this phrase, there's no way to recover your
                  account so put it somewhere safe.
                </Text>
                <Checkbox
                  mt={4}
                  justifyContent="flex-end"
                  colorScheme="brand.teal"
                  aria-label="confirm phrase saved"
                  onChange={e => setPhraseConfirmed(e.target.checked)}
                >
                  I have stored the phrase
                </Checkbox>
              </Box>
            </Box>
          </SimpleGrid>
        </>
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
        <FormLabel htmlFor="name">Account Name</FormLabel>
        <Input autoFocus id="name" variant="filled" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="phrase">Phrase</FormLabel>
        <Input
          autoCapitalize="none"
          id="phrase"
          variant="filled"
          maxLength={50}
        />
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
