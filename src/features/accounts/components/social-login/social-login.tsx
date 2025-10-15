import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  FieldWrapper,
  GithubIcon,
  GoogleIcon,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  TwitterIcon,
  useToast,
} from "@liftedinit/ui"
import { doesAccountExist, useAccountsStore } from "features/accounts"
import React from "react"
import { get, useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"

import { Ed25519KeyPairIdentity } from "@liftedinit/many-js"
import {
  UserInfo,
  Web3Auth,
  Web3AuthOptions,
  WALLET_CONNECTORS,
} from "@web3auth/modal"

const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENTID
const WEB3AUTH_NETWORK =
  import.meta.env.VITE_WEB3AUTH_NETWORK ?? ("testnet" as "testnet" | "cyan")

export const LOGIN_PROVIDER = {
  GOOGLE: "google",
  GITHUB: "github",
  TWITTER: "twitter",
  EMAIL_PASSWORDLESS: "email_passwordless",
} as const

export function SocialLogin({ onSuccess }: { onSuccess: () => void }) {
  const toast = useToast()
  const { createAccount, accounts } = useAccountsStore(
    ({ byId, createAccount }) => ({
      createAccount,
      accounts: Array.from(byId),
    }),
  )
  const { query, mutation } = useWeb3authProvider()

  const { isFetching: isWeb3authLoading, error: web3authError } = query
  const { mutateAsync: doConnectTo, isLoading: isConnecting } = mutation

  const form = useForm({
    defaultValues: { email: "" },
  })
  const { formState, register } = form
  const { errors } = formState

  async function doLogin(loginProvider: string) {
    const isEmailPasswordless =
      loginProvider === LOGIN_PROVIDER.EMAIL_PASSWORDLESS
    try {
      const { privateKey, userInfo } = await doConnectTo({
        loginProvider,
        loginHint: form.getValues("email"),
        isEmailPasswordless,
      })

      const identity = Ed25519KeyPairIdentity.fromHex(
        Uint8Array.fromHex(privateKey),
      )
      const address = (await identity.getAddress()).toString()

      const accountExists = await doesAccountExist(address, accounts)
      if (accountExists) {
        return toast({
          status: "warning",
          title: "Add Account",
          description: "Account already exists",
        })
      }

      const loginType = isEmailPasswordless ? "email" : userInfo?.authConnection

      await createAccount({
        name: `${userInfo?.name} (${loginType})`,
        identity,
      })
      toast({
        status: "success",
        title: "Add Account",
        description: "Account was added",
      })
      onSuccess()
    } catch (e) {
      console.error("connectTo error", e)
      return
    }
  }

  async function doEmailLogin({ email }: { email: string }) {
    await doLogin(LOGIN_PROVIDER.EMAIL_PASSWORDLESS)
  }

  if (web3authError)
    return (
      <Alert status="warning" mb={4}>
        <AlertIcon />
        <AlertDescription>Web3auth: {web3authError.message}</AlertDescription>
      </Alert>
    )

  if (isWeb3authLoading)
    return (
      <Center>
        <Spinner size="md" />
      </Center>
    )
  return (
    <>
      <Box alignItems="flex-start" mb={8}>
        <HStack mb={6}>
          <Text color="gray.500">Continue with</Text>
          {isConnecting ? <Spinner size="sm" /> : null}
        </HStack>
        <HStack spacing={6}>
          <IconButton
            aria-label={LOGIN_PROVIDER.GOOGLE}
            icon={<GoogleIcon />}
            rounded="full"
            bgColor="white"
            shadow="md"
            isDisabled={isConnecting}
            onClick={() => doLogin(LOGIN_PROVIDER.GOOGLE)}
          />
          <IconButton
            aria-label={LOGIN_PROVIDER.GITHUB}
            icon={<GithubIcon />}
            rounded="full"
            bgColor="white"
            shadow="md"
            isDisabled={isConnecting}
            onClick={() => doLogin(LOGIN_PROVIDER.GITHUB)}
          />
          <IconButton
            aria-label={LOGIN_PROVIDER.TWITTER}
            icon={<TwitterIcon />}
            rounded="full"
            bgColor="white"
            shadow="md"
            isDisabled={isConnecting}
            onClick={() => doLogin(LOGIN_PROVIDER.TWITTER)}
          />
        </HStack>
      </Box>
      <Box mb={6}>
        <FieldWrapper
          label="Email"
          labelProps={{
            color: "gray.500",
            fontWeight: "normal",
          }}
          error={get(errors, "email.message")}
          mb={3}
          isDisabled={isConnecting}
        >
          <Input
            {...register("email", {
              required: "Enter a valid email",
              pattern: {
                value: new RegExp(/^.+@.+$/),
                message: "Email format is invalid",
              },
            })}
            variant="outline"
          />
        </FieldWrapper>
        <Button
          colorScheme="brand.teal"
          w="full"
          isDisabled={isConnecting}
          onClick={form.handleSubmit(doEmailLogin)}
        >
          Continue with Email
        </Button>
      </Box>
    </>
  )
}

function useWeb3auth() {
  const web3authRef = React.useRef<Web3Auth | undefined>()
  const query = useQuery<Web3Auth, Error>({
    queryKey: ["web3authcore"],
    queryFn: async () => {
      if (web3authRef.current) {
        return web3authRef.current
      }
      try {
        const web3AuthOptions: Web3AuthOptions = {
          clientId: WEB3AUTH_CLIENT_ID,
          web3AuthNetwork: WEB3AUTH_NETWORK,
        }

        const web3authCore = new Web3Auth(web3AuthOptions)

        await web3authCore.init()
        web3authRef.current = web3authCore
        return web3authRef.current
      } catch (e) {
        throw e
      }
    },
    refetchOnWindowFocus: false,
  })

  const { data: web3auth } = query

  const mutation = useMutation<
    {
      privateKey: string
      userInfo?: Partial<UserInfo>
    },
    Error,
    { loginProvider: string; loginHint?: string; isEmailPasswordless: boolean }
  >(
    async ({
      loginProvider,
      loginHint,
    }: {
      loginProvider: string
      loginHint?: string
    }) => {
      const web3authProvider = await web3auth?.connectTo(
        WALLET_CONNECTORS.AUTH,
        {
          authConnection: loginProvider,
          loginHint: loginHint,
        },
      )
      if (web3authProvider === null) throw new Error("web3auth connect error")
      const privateKey = (await web3authProvider?.request({
        method: "private_key",
      })) as string

      if (!privateKey) throw new Error("private key is required")

      const userInfo = await web3auth?.getUserInfo()

      return { privateKey, userInfo }
    },
    {
      onSettled: async () => {
        await web3auth?.logout()
      },
    },
  )
  return { query, mutation }
}

const Web3authContext = React.createContext<ReturnType<
  typeof useWeb3auth
> | null>(null)

export function Web3authProvider({ children }: React.PropsWithChildren<{}>) {
  const { query, mutation } = useWeb3auth()

  const value = React.useMemo(() => {
    return {
      query,
      mutation,
    }
  }, [query, mutation])

  return (
    <Web3authContext.Provider value={value}>
      {children}
    </Web3authContext.Provider>
  )
}

function useWeb3authProvider() {
  const ctx = React.useContext(Web3authContext)
  if (!ctx) throw new Error("Web3authContext not found")
  return ctx
}
