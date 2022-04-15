import React from "react"
import { useLocation } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogProps,
  Button,
  ButtonGroup,
  Box,
  Checkbox,
  ChevronDownIcon,
  Container,
  Grid,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Flex,
  HStack,
  Image,
  Input,
  Layout,
  SlideFade,
  Text,
  useToast,
  useDisclosure,
  VStack,
} from "components"
import { AssetSelector } from "./asset-selector"
import cubeImg from "assets/cube.png"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { useBalances } from "features/balances"
import { useSendToken } from "features/transactions"
import { Contact, ContactSelector } from "features/contacts"
import { Asset } from "features/balances"
import { amountFormatter, displayId, parseNumberToBigInt } from "helper/common"
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

  const [contact, setContact] = React.useState<Contact | undefined>()

  const { sendToken, isLoading } = useSendToken({ network })

  async function onSendTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const bigIntAmount = parseNumberToBigInt(parseFloat(formValues.amount!))
    sendToken(
      {
        to: formValues.to,
        amount: bigIntAmount,
        symbol: formValues.asset!.identity,
      },
      {
        onSuccess: () => {
          setFormValues({ ...defaultFormState })
          contact && setContact(undefined)
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
    name === "to" && contact && setContact(undefined)
    setFormValues(s => ({ ...s, [name]: value }))
  }

  React.useEffect(() => {
    return () => {
      setFormValues({ ...defaultFormState })
    }
  }, [network, accountPublicKey])

  return (
    <Layout.Main>
      <SlideFade in>
        <Container w={{ base: "full", md: "md" }}>
          <Heading size="lg" mb={3}>
            Send
          </Heading>
          <Box shadow="base" rounded="md" py={8} px={6} bgColor="white">
            <form onSubmit={onNext} aria-label="send form">
              <FormControl isRequired mb={4}>
                <HStack justifyContent="space-between" alignItems="stretch">
                  <FormLabel htmlFor="to">To</FormLabel>
                  <Box>
                    <ContactSelector
                      onContactClicked={(onClose, c) => {
                        setFormValues(s => ({ ...s, to: c.identity }))
                        setContact(c)
                        onClose()
                      }}
                    >
                      {onOpen => {
                        return (
                          <Button
                            size="sm"
                            variant="link"
                            rightIcon={<ChevronDownIcon boxSize={4} />}
                            onClick={onOpen}
                          >
                            Select a contact
                          </Button>
                        )
                      }}
                    </ContactSelector>
                  </Box>
                </HStack>
                <VStack
                  bgColor="gray.100"
                  px={4}
                  py={2}
                  rounded="md"
                  spacing={0}
                  alignItems="flex-start"
                >
                  {contact ? <Text fontSize="lg">{contact.name}</Text> : null}
                  <Input
                    autoFocus
                    name="to"
                    id="to"
                    variant="unstyled"
                    onChange={onChange}
                    value={formValues.to}
                    placeholder="maffbahksdwaqeenayy..."
                    pattern="^[a-z0-9]*$"
                    minLength={50}
                    maxLength={50}
                    fontFamily="monospace"
                    isTruncated
                    size="lg"
                  />
                </VStack>
              </FormControl>
              <FormControl isRequired>
                <Flex alignItems="stretch" justifyContent="space-between">
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <Box>
                    <AssetSelector
                      ownedAssets={balances.data.ownedAssetsWithBalance}
                      allAssets={balances.data.allAssetsWithBalance}
                      onAssetClicked={asset => {
                        setFormValues(s => ({
                          ...s,
                          asset,
                        }))
                      }}
                    >
                      {onOpen => (
                        <Button
                          size="sm"
                          rightIcon={<ChevronDownIcon boxSize={4} />}
                          aria-label="select token"
                          onClick={onOpen}
                          variant="link"
                        >
                          Select an asset
                        </Button>
                      )}
                    </AssetSelector>
                  </Box>
                </Flex>
                <HStack bgColor="gray.100" px={4} py={2} rounded="md">
                  <Input
                    alignSelf="flex-start"
                    name="amount"
                    id="amount"
                    variant="unstyled"
                    onChange={onChange}
                    value={formValues.amount ?? ""}
                    placeholder="0.0"
                    required
                    pattern="^(\d?)+(?:\.\d{1,9})?$"
                    title="Number with up to 9 decimal places"
                    fontFamily="monospace"
                    size="lg"
                  />
                  <VStack alignItems="flex-end" spacing={0}>
                    {asset ? (
                      <>
                        <HStack spacing={1}>
                          <Image
                            src={cubeImg}
                            borderRadius="full"
                            boxSize={9}
                          />
                          <Text fontSize="xl">{asset.symbol}</Text>
                        </HStack>
                        <HStack>
                          <Text whiteSpace="nowrap" fontSize="xs">
                            Balance: {amountFormatter(asset.balance)}
                          </Text>
                          <Button
                            variant="link"
                            colorScheme="red"
                            size="xs"
                            onClick={() => {
                              setFormValues(s => ({
                                ...s,
                                amount: amountFormatter(asset.balance),
                              }))
                            }}
                          >
                            Max
                          </Button>
                        </HStack>
                      </>
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
      </SlideFade>
      <ConfirmTxnDialog
        isOpen={isShowConfirmDialog}
        onClose={onCloseConfirmDialog}
        onSendTxn={onSendTxn}
        txnDetails={formValues}
        isLoading={isLoading}
        contact={contact}
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
  contact,
}: Omit<AlertDialogProps, "children" | "leastDestructiveRef"> & {
  onSendTxn: (e: React.FormEvent<HTMLFormElement>) => void
  txnDetails: typeof defaultFormState
  isLoading: boolean
  contact?: Contact
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
      size="xl"
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
      <AlertDialog.Body>
        <form id="confirm-txn-form" onSubmit={onSendTxn}>
          <Grid
            templateColumns={{ base: "1fr", md: "auto 1fr" }}
            gap={{ base: 0, md: 4 }}
          >
            <GridItem>
              <FormLabel m={0}>To</FormLabel>
            </GridItem>
            <GridItem overflow="hidden" paddingInlineStart={{ base: 4, md: 0 }}>
              {contact ? <Text fontSize="lg">{contact.name}</Text> : null}
              <IdentityText
                fullIdentity={txnDetails.to}
                isTruncated
                fontSize="lg"
                title={txnDetails.to}
                fontFamily="monospace"
                whiteSpace="normal"
              >
                {txnDetails.to}
              </IdentityText>
            </GridItem>
            <GridItem mt={{ base: 6, md: 0 }}>
              <FormLabel m={0}>Amount</FormLabel>
            </GridItem>
            <GridItem overflow="hidden" paddingInlineStart={{ base: 4, md: 0 }}>
              <HStack spacing={1}>
                <Image src={cubeImg} borderRadius="full" boxSize={9} />
                <Text fontSize="lg" isTruncated>
                  {txnDetails.amount}
                </Text>
                <Text fontSize="lg">{txnDetails.asset?.symbol}</Text>
              </HStack>
            </GridItem>
          </Grid>

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
      </AlertDialog.Body>
    </AlertDialog>
  )
}