import React from "react"
import { WebAuthnIdentity } from "@liftedinit/many-js"
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
  [CreateSteps.second]: CreatePhrase,
  [CreateSteps.third]: Finished,
}

export function CreateFlow({ setAddMethod, onSuccess }: AddAccountMethodProps) {
  const [{ step }] = useCreateContext()
  const StepComponent = stepMap[step]

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
      console.error("authorize step", e)
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

function CreatePhrase() {
  const [{ identity }, setState] = useCreateContext()
  const { mutate: doSaveCredential, isLoading } = useSaveWebauthnCredential()
  const updateCredential = useCredentialsStore(s => s.updateCredential)
  const createAccount = useAccountsStore(s => s.createAccount)
  const toast = useToast()

  const nameInputRef = React.useRef<HTMLInputElement>(null)

  async function onNextClicked(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = nameInputRef?.current?.value?.trim()
    if (!name) {
      nameInputRef!.current!.value = ""
      return form.reportValidity()
    }
    const address = (await identity!.getAddress()).toString()
    doSaveCredential(
      {
        address,
        credentialId: identity!.rawId,
        cosePublicKey: identity!.cosePublicKey,
        identity: identity!,
      },
      {
        onSuccess(data) {
          if (data?.phrase) {
            updateCredential(
              data.phrase,
              arrayBufferToBase64(identity!.rawId),
              identity!.cosePublicKey,
              address,
            )
            createAccount({ name, identity: identity! })
            toast({
              status: "success",
              title: "Add Account",
              description: "Account was created",
            })
            setState({
              phrase: data.phrase,
              name,
              step: CreateSteps.third,
            })
          }
        },
        onError(err) {
          toast({
            status: "warning",
            title: "Add Account",
            description: err?.message
              ? err.message
              : "An unexpected error occurred",
          })
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

function Finished({ onSuccess }: AddAccountMethodProps) {
  const [{ phrase }] = useCreateContext()

  return (
    <CreateLayout footer={<Button onClick={onSuccess}>Done</Button>}>
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
            <Text>
              You can recover your account using this phrase or public address.
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
  onBackClick?: () => void
}>) {
  return (
    <>
      <Modal.Body>
        {onBackClick && (
          <Button
            variant="link"
            onClick={onBackClick}
            leftIcon={<ChevronLeftIcon />}
          >
            Back
          </Button>
        )}
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
