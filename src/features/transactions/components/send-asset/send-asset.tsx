import React from "react"
import {
  AddressText,
  Alert,
  AlertDialog,
  AlertDialogProps,
  AssetSelector,
  Button,
  ButtonGroup,
  Box,
  Checkbox,
  ChevronDownIcon,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  Text,
  useToast,
  useDisclosure,
  VStack,
} from "components"
import cubeImg from "assets/cube.png"
import {
  useAccountsStore,
} from "features/accounts"
import { useBalances } from "features/balances"
import { useCreateSendTxn } from "features/transactions"
import { Contact, ContactSelector } from "features/contacts"
import { Asset } from "features/balances"
import { amountFormatter, parseNumberToBigInt } from "helper/common"
import { useMultisigSubmit } from "features/accounts"
import { ANON_IDENTITY } from "many-js"

const defaultFormState: {
  to: string
  amount: undefined | string
  asset: Asset | undefined
  memo: string | undefined
} = {
  to: "",
  amount: undefined,
  asset: undefined,
  memo: "",
}

export function SendAssetModal({
  isOpen,
  onClose,
  address,
  assetAddress,
  onSuccess,
  accountAddress,
}: {
  isOpen: boolean
  onClose: () => void
  address: string
  assetAddress: string
  onSuccess?: () => void
  accountAddress?: string
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Send Asset"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      footer={<></>}
    >
      <Modal.Body>
        <EligibleIdentityWarning accountAddress={accountAddress} />
        <SendAssetForm
          address={address}
          assetAddress={assetAddress}
          accountAddress={accountAddress}
          onSuccess={onSuccess}
        />
      </Modal.Body>
    </Modal>
  )
}

export function SendAssetForm({
  address,
  assetAddress,
  accountAddress,
  formId = "send-asset-form",
  onSuccess,
}: {
  address: string
  assetAddress: string
  accountAddress?: string
  formId?: string
  onSuccess?: () => void
}) {
  const toast = useToast()
  const {
    isOpen: isShowConfirmDialog,
    onOpen: onShowConfirmAlert,
    onClose: onCloseConfirmDialog,
  } = useDisclosure()

  const balances = useBalances({ address })

  const [formValues, setFormValues] = React.useState<typeof defaultFormState>(
    () => ({
      ...defaultFormState,
      asset: assetAddress
        ? balances.data.allAssetsWithBalance.find(
            asset => asset.identity === assetAddress,
          )
        : undefined,
    }),
  )
  const asset = formValues.asset

  const [contact, setContact] = React.useState<Contact | undefined>()

  const { mutate: doCreateSendTxn, isLoading } = useCreateSendTxn()
  const {
    mutate: doCreateMultisigSubmitTxn,
    isLoading: isCreateMultisigSubmitTxnLoading,
  } = useMultisigSubmit()

  function onSendSuccess() {
    setFormValues({ ...defaultFormState })
    contact && setContact(undefined)
    onSuccess?.()
    onCloseConfirmDialog()
    toast({
      status: "success",
      title: "Send",
      description: "Transaction was sent",
    })
  }

  async function onSendTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const bigIntAmount = parseNumberToBigInt(parseFloat(formValues.amount!))
    if (accountAddress) {
      doCreateMultisigSubmitTxn(
        {
          from: address,
          to: formValues.to,
          amount: bigIntAmount,
          symbol: formValues.asset!.identity,
          memo: formValues?.memo?.trim(),
        },
        {
          onSuccess: () => {
            onSendSuccess()
          },
          onError: err => {
            toast({
              status: "warning",
              title: "Send",
              //@ts-ignore
              description: err?.message ?? "An unexpected error occurred",
            })
          },
        },
      )
      return
    }
    doCreateSendTxn(
      {
        to: formValues.to,
        amount: bigIntAmount,
        symbol: formValues.asset!.identity,
      },
      {
        onSuccess: () => {
          onSendSuccess()
        },
        onError: e => {
          toast({
            status: "warning",
            title: "Send",
            description: e?.message ?? String(e),
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

  return (
    <>
      <form onSubmit={onNext} aria-label="send form" id={formId}>
        <FormControl isRequired mb={4}>
          <HStack justifyContent="space-between" alignItems="stretch">
            <FormLabel htmlFor="to">To</FormLabel>
            <Box>
              <ContactSelector
                onContactClicked={(onClose, c) => {
                  setFormValues(s => ({ ...s, to: c.address }))
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
              minLength={1}
              fontFamily="monospace"
              isTruncated
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
            />
            <VStack alignItems="flex-end" spacing={0}>
              {asset ? (
                <>
                  <HStack spacing={1}>
                    <Image src={cubeImg} borderRadius="full" boxSize={9} />
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
        {accountAddress && (
          <FormControl mt={4}>
            <FormLabel htmlFor="memo">Memo</FormLabel>
            <Input
              variant="filled"
              id="memo"
              name="memo"
              placeholder="Add a short memo"
              value={formValues.memo ?? ""}
              onChange={onChange}
            />
          </FormControl>
        )}
        <Flex justifyContent="flex-end" w="full" mt={4}>
          <Button
            width={{ base: "full", md: "auto" }}
            isLoading={isLoading || isCreateMultisigSubmitTxnLoading}
            colorScheme="brand.teal"
            disabled={!asset || !formValues.amount || !formValues.to}
            type="submit"
          >
            Next
          </Button>
        </Flex>
      </form>
      <ConfirmTxnDialog
        isOpen={isShowConfirmDialog}
        onClose={onCloseConfirmDialog}
        onSendTxn={onSendTxn}
        txnDetails={formValues}
        isLoading={isLoading || isCreateMultisigSubmitTxnLoading}
        contact={contact}
      />
    </>
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
            disabled={isLoading}
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
              <AddressText addressText={txnDetails.to} isFullText />
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

function EligibleIdentityWarning({
  accountAddress,
}: {
  accountAddress?: string
}) {
  const activeIdentity = useAccountsStore(s => s.byId.get(s.activeId))

  if (!activeIdentity || !accountAddress) return null

  return (
    <Alert status="warning" mb={6} rounded="md">
      <Box fontSize="sm" textAlign="center" w="full">
        You are submitting a transaction as:
        <Text fontWeight="medium" as="div">
          {activeIdentity.name}&nbsp;
          {activeIdentity.address !== ANON_IDENTITY && (
            <Text as="span">
              (
              <AddressText
                display="inline-flex"
                addressText={activeIdentity.address}
                fontFamily="monospace"
                as="span"
                p={0}
                bgColor={undefined}
                textProps={{ fontWeight: "semibold", fontSize: "sm" }}
                iconProps={{ boxSize: 4 }}
              />
              )
            </Text>
          )}
        </Text>
        <Text>If this is not intended, please switch Identities.</Text>
      </Box>
    </Alert>
  )
}