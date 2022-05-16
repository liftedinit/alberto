import React from "react"
import { WebAuthnIdentity } from "many-js"
import { generateSlug } from "random-word-slugs"
import {
  Alert,
  Button,
  Box,
  CopyToClipboard,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
  UsbIcon,
  ChevronLeftIcon,
} from "components"
import { AddAccountMethodProps } from "../add-account-modal"
import {
  useAccountsStore,
  useCredentialsStore,
  useSaveWebauthnCredential,
} from "features/accounts"
import { arrayBufferToBase64 } from "helper/convert"

const enum CreateSteps {
  first,
  second,
  third,
}

const stepMap = {
  [CreateSteps.first]: Authorize,
  [CreateSteps.second]: StorePhrase,
  [CreateSteps.third]: PersistCredential,
}

export function CreateFlow({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const [{ step }] = useCreateContext()
  const StepComponent = stepMap[step]
  console.log({ step, StepComponent })

  return (
    <>
      <Modal.Header>Create From Hardware Authenticator</Modal.Header>
      <StepComponent setAddMethod={setAddMethod} onSuccess={onSuccess} />
    </>
  )
}

function Authorize({ setAddMethod }: AddAccountMethodProps) {
  const [, setState] = useCreateContext()

  async function onAuthorizeClicked(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    try {
      const identity = await WebAuthnIdentity.create()
      setState({
        identity,
        step: CreateSteps.second,
      })
    } catch (e) {
      console.error("webauthn", e)
    }
  }

  return (
    <CreateLayout
      onBackClick={() => setAddMethod("")}
      footer={<Button onClick={onAuthorizeClicked}>Authorize</Button>}
    >
      <Alert status="info" variant="left-accent">
        <HStack spacing={4}>
          <Box>
            <UsbIcon boxSize={10} />
          </Box>
          <VStack alignItems="flex-start">
            <Text>
              Connect your hardware security module and authorize it to create a
              new credential.
            </Text>
            <Text>
              Click "Authorize" below and follow the instructions on the screen
            </Text>
          </VStack>
        </HStack>
      </Alert>
    </CreateLayout>
  )
}

function StorePhrase() {
  const [{ identity }, setState] = useCreateContext()
  const { mutate: doSaveCredential, isLoading } = useSaveWebauthnCredential()

  const nameInputRef = React.useRef<HTMLInputElement>(null)

  async function onNextClicked(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = nameInputRef?.current?.value?.trim()
    if (!name) {
      nameInputRef!.current!.value = ""
      return form.reportValidity()
    }
    const cred = await WebAuthnIdentity.getCredential(identity?.rawId!)
    doSaveCredential(
      { webauthnIdentity: identity! },
      {
        onSuccess: data => {
          console.log("onSuccess data >>>>>>>>>>", data)
          // setState({
          //   phrase: data.phrase ?? "some phrase",
          //   name,
          //   step: CreateSteps.third,
          // })
        },
      },
    )
  }

  return (
    <CreateLayout
      onBackClick={() => setState({ step: CreateSteps.first })}
      footer={
        <Button type="submit" form="account-name-form" isLoading={isLoading}>
          Next
        </Button>
      }
    >
      <Alert status="info" variant="left-accent" mb={4}>
        <VStack alignItems="flex-start">
          <Text>Enter an account name and click "Next".</Text>
          <Text>
            You will be prompted by your security device to authorize storing of
            your credentials.
          </Text>
          <Text>
            A recovery phrase will be provided in case you need to recover your
            account.
          </Text>
        </VStack>
      </Alert>
      <form id="account-name-form" onSubmit={onNextClicked}>
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor="name">Account Name</FormLabel>
          <Input autoFocus id="name" maxLength={64} ref={nameInputRef} />
        </FormControl>
      </form>
    </CreateLayout>
  )
}

function PersistCredential({ onSuccess }: AddAccountMethodProps) {
  const toast = useToast()
  const byId = useCredentialsStore(s => s.byId)
  const [phrase, setPhrase] = React.useState("")
  const [{ name, identity }, setState] = useCreateContext()

  const updateCredential = useCredentialsStore(s => s.updateCredential)

  const createAccount = useAccountsStore(s => s.createAccount)

  function onSaveClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    const base64CredId = arrayBufferToBase64(identity!.rawId)
    console.log({ phrase, name, identity })
    updateCredential(phrase!, base64CredId, identity!.cosePublicKey)
    createAccount({ name: name!, identity: identity! })
    onSuccess()
    toast({
      status: "success",
      title: "Add Account",
      description: "Account was created",
    })
  }
  React.useEffect(() => {
    setPhrase(makePhrase())
    function makePhrase(): string {
      const slug = generateSlug(2, { format: "lower" })
      if (byId.has(slug)) {
        return makePhrase()
      }
      return slug
    }
  }, [])

  return (
    <CreateLayout
      onBackClick={() => setState({ step: CreateSteps.second })}
      footer={<Button onClick={onSaveClick}>Done</Button>}
    >
      <Stack
        spacing={{ base: 0, md: 2 }}
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        mb={{ base: 4, md: 0 }}
      >
        <Box fontSize="6xl">🎉</Box>
        <Text fontSize={{ base: "2xl", md: "3xl" }}>
          Your credential was saved!
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 8 }}>
        <Box>
          <Flex
            border="2px solid"
            borderColor="gray.300"
            alignItems="center"
            justifyContent="center"
            rounded="md"
            p={{ base: 4, md: 6 }}
            position="relative"
          >
            <Box position="absolute" top={1} right={1}>
              <CopyToClipboard toCopy={phrase!} />
            </Box>
            <Text textAlign="center" fontSize={{ base: "3xl", md: "2xl" }}>
              {phrase}
            </Text>
          </Flex>
        </Box>
        <Box>
          <Box>
            <Text>You will need this phrase to access your account.</Text>

            <Text mt={4}>
              If you lose this phrase, there's no way to recover your account so
              put it somewhere safe.
            </Text>
          </Box>
        </Box>
      </SimpleGrid>
    </CreateLayout>
  )
}

type CreateCtxState = {
  name?: string
  identity?: WebAuthnIdentity
  phrase?: string
  step: CreateSteps
}

type CreateCtx = [
  state: CreateCtxState,
  setState: React.Dispatch<CreateCtxState>,
]

const CreateContext = React.createContext<CreateCtx>([
  {
    name: "",
    identity: undefined,
    phrase: "",
    step: CreateSteps.first,
  },
  s => ({ ...s }),
])

function useCreateContext() {
  return React.useContext(CreateContext)
}

export function CreateContextProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const ctx = React.useReducer(
    (state: any, payload: Record<string, any>) => {
      return { ...state, ...payload }
    },
    { identity: undefined, phrase: undefined, step: CreateSteps.first },
  )

  return <CreateContext.Provider value={ctx}>{children}</CreateContext.Provider>
}

function CreateLayout({
  footer,
  onBackClick,
  children,
}: React.PropsWithChildren<{
  footer: React.ReactNode
  onBackClick: () => void
}>) {
  return (
    <>
      <Modal.Body>
        <Button
          variant="link"
          onClick={onBackClick}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Container>{children}</Container>
      </Modal.Body>
      <Modal.Footer>
        <Container display="flex" justifyContent="flex-end">
          {footer}
        </Container>
      </Modal.Footer>
    </>
  )
}
