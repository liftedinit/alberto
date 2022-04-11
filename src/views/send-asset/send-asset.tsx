import React from "react"
import { useLocation } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogProps,
  Button,
  ButtonGroup,
  Box,
  Checkbox,
  Code,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Flex,
  HStack,
  Image,
  Input,
  Layout,
  Text,
  useToast,
  useDisclosure,
  VStack,
  CopyToClipboard,
} from "components"
import { AssetSelector } from "./asset-selector"
import cubeImg from "assets/cube.png"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { useBalances } from "features/balances"
import { useSendToken } from "features/transactions"
import { Asset } from "features/balances"
import { displayId } from "helper/common"
import { IdentityText } from "components/uikit/identity-text"

const defaultFormState: {
  to: string
  amount: undefined | string
  asset: Asset | undefined
} = {
  to: "",
  amount: undefined,
  asset: undefined,
}

export function SendAsset() {
  const location = useLocation()
  const routeState = location?.state as Record<string, string>
  const toast = useToast()
  const {
    isOpen: isShowConfirmDialog,
    onOpen: onShowConfirmAlert,
    onClose: onCloseConfirmDialog,
  } = useDisclosure()
  const network = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const { full: accountPublicKey } = displayId(account!)
  const balances = useBalances({ network, accountPublicKey })

  const [formValues, setFormValues] = React.useState<typeof defaultFormState>(
    () => ({
      ...defaultFormState,
      asset: routeState?.assetIdentity
        ? balances.data.ownedAssetsWithBalance.find(
            asset => asset.identity === routeState.assetIdentity,
          )
        : undefined,
    }),
  )
  const asset = formValues.asset

  const { sendToken, isLoading } = useSendToken({ network })

  async function onSendTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    sendToken(
      {
        to: formValues.to,
        amount: BigInt(formValues.amount!),
        symbol: formValues.asset!.identity,
      },
      {
        onSuccess: () => {
          setFormValues({ ...defaultFormState })
          onCloseConfirmDialog()
          toast({
            status: "success",
            title: "Send",
            description: "Transaction sent.",
          })
        },
        onError: e => {
          toast({
            status: "warning",
            title: "Send",
            description: String(e),
          })
        },
      },
    )
  }

  async function onNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onShowConfirmAlert()
    return
  }

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    e.preventDefault()
    const { name, value } = e.target
    setFormValues(s => ({ ...s, [name]: value }))
  }

  React.useEffect(() => {
    return () => {
      setFormValues({ ...defaultFormState })
    }
  }, [network, accountPublicKey])

  return (
    <Layout.Main py={2}>
      <Container w={{ base: "full", md: "md" }}>
        <Heading size="lg" mb={3}>
          Send
        </Heading>
        <Box shadow="base" rounded="md" py={8} px={6} bgColor="white">
          <form onSubmit={onNext} aria-label="send form">
            <FormControl isRequired mb={4}>
              <FormLabel htmlFor="to">To</FormLabel>
              <Input
                autoFocus
                name="to"
                id="to"
                variant="filled"
                onChange={onChange}
                value={formValues.to}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <HStack
                bgColor="gray.100"
                px={4}
                py={2}
                rounded="md"
                display="flex"
              >
                <Input
                  alignSelf="flex-start"
                  name="amount"
                  id="amount"
                  variant="unstyled"
                  onChange={onChange}
                  value={formValues.amount ?? ""}
                  placeholder="0.0"
                  required
                  pattern="^[0-9]*[.,]?[0-9]*$"
                />
                <VStack alignItems="flex-end" w="full">
                  <AssetSelector
                    ownedAssets={balances.data.ownedAssetsWithBalance}
                    allAssets={balances.data.allAssetsWithBalance}
                    fontWeight={asset ? "medium" : "normal"}
                    leftIcon={
                      asset ? (
                        <Image src={cubeImg} borderRadius="full" boxSize={9} />
                      ) : undefined
                    }
                    onChange={asset => {
                      setFormValues(s => ({
                        ...s,
                        asset,
                      }))
                    }}
                  >
                    {asset?.symbol || "Select an asset"}
                  </AssetSelector>
                  {asset ? (
                    <HStack>
                      <Text whiteSpace="nowrap" fontSize="xs">
                        Balance: {asset.balance.toLocaleString()}
                      </Text>
                      <Button
                        variant="link"
                        colorScheme="red"
                        size="xs"
                        onClick={() => {
                          setFormValues(s => ({
                            ...s,
                            amount: asset.balance.toString(),
                          }))
                        }}
                      >
                        Max
                      </Button>
                    </HStack>
                  ) : null}
                </VStack>
              </HStack>
            </FormControl>
            <Flex justifyContent="flex-end" w="full" mt={4}>
              <Button
                width={{ base: "full", md: "auto" }}
                isLoading={isLoading}
                colorScheme="brand.teal"
                disabled={!asset || !formValues.amount || !formValues.to}
                type="submit"
              >
                Next
              </Button>
            </Flex>
          </form>
        </Box>
      </Container>
      <ConfirmTxnDialog
        isOpen={isShowConfirmDialog}
        onClose={onCloseConfirmDialog}
        onSendTxn={onSendTxn}
        txnDetails={formValues}
        isLoading={isLoading}
      />
    </Layout.Main>
  )
}

function ConfirmTxnDialog({
  isOpen,
  onClose,
  onSendTxn,
  txnDetails,
  isLoading,
}: Omit<AlertDialogProps, "children" | "leastDestructiveRef"> & {
  onSendTxn: (e: React.FormEvent<HTMLFormElement>) => void
  txnDetails: typeof defaultFormState
  isLoading: boolean
}) {
  const cancelTxnRef = React.useRef(null)
  const [isConfirmed, setIsConfirmed] = React.useState(false)
  React.useEffect(() => () => setIsConfirmed(false), [isOpen])
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelTxnRef}
      header="Confirm"
      footer={
        <ButtonGroup w="full" justifyContent="flex-end">
          <Button
            width={{ base: "full", md: "auto" }}
            onClick={onClose}
            ref={cancelTxnRef}
            type="submit"
          >
            Cancel
          </Button>
          <Button
            width={{ base: "full", md: "auto" }}
            isLoading={isLoading}
            colorScheme="brand.teal"
            disabled={!isConfirmed || isLoading}
            form="confirm-txn-form"
            type="submit"
          >
            Send
          </Button>
        </ButtonGroup>
      }
    >
      <form id="confirm-txn-form" onSubmit={onSendTxn}>
        <VStack alignItems="flex-start" spacing={4}>
          <Box width="full">
            <FormLabel color="gray.500">To</FormLabel>
            <Flex as={Code} px={2} py={1} rounded="md" alignItems="center">
              <IdentityText
                fullIdentity={txnDetails.to}
                isTruncated
                fontSize="xl"
              >
                {txnDetails.to}
              </IdentityText>
              <CopyToClipboard toCopy={txnDetails.to} />
            </Flex>
          </Box>
          <Box>
            <FormLabel color="gray.500">Amount</FormLabel>
            <HStack>
              <Image src={cubeImg} borderRadius="full" boxSize={9} />
              <Text fontWeight="medium" fontSize="2xl" isTruncated>
                {txnDetails.amount}
              </Text>
              <Text fontSize="xl">{txnDetails.asset?.symbol}</Text>
            </HStack>
          </Box>
        </VStack>

        <Checkbox
          mt={2}
          w="full"
          justifyContent="flex-end"
          colorScheme="brand.teal"
          aria-label="confirm transaction"
          onChange={e => setIsConfirmed(e.target.checked)}
        >
          Approve this transaction
        </Checkbox>
      </form>
    </AlertDialog>
  )
}