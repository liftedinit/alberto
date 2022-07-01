import React from "react"
import { ANON_IDENTITY } from "many-js"
import {
  AddressText,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertDialog,
  AlertDialogProps,
  AssetSelector,
  Button,
  Box,
  Checkbox,
  ChevronDownIcon,
  ChevronUpIcon,
  Collapse,
  DataField,
  FormControl,
  FormLabel,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  Text,
  TxnExpireText,
  useToast,
  useDisclosure,
  VStack,
} from "components"
import cubeImg from "assets/cube.png"
import {
  MultisigSettingsFields,
  useAccountsStore,
  useGetAccountInfo,
} from "features/accounts"
import { useBalances } from "features/balances"
import { useCreateSendTxn } from "features/transactions"
import { Contact, ContactSelector } from "features/contacts"
import { Asset } from "features/balances"
import { amountFormatter, parseNumberToBigInt } from "helper/common"
import { useMultisigSubmit } from "features/accounts"
import { getHoursMinutesSecondsFromSeconds } from "helper/convert"

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
  const sendAssetState = useSendAssetForm({
    address,
    assetAddress,
    accountAddress,
    onSuccess,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Send Asset"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      footer={
        <Flex justifyContent="flex-end" w="full">
          <Button
            width={{ base: "full", md: "auto" }}
            colorScheme="brand.teal"
            type="submit"
            form="send-asset-form"
          >
            Next
          </Button>
        </Flex>
      }
    >
      <Modal.Body>
        <EligibleIdentityWarning accountAddress={accountAddress} />
        <SendAssetForm
          showNextBtn={false}
          accountAddress={accountAddress}
          onSuccess={onSuccess}
          sendAssetState={sendAssetState}
        />
      </Modal.Body>
    </Modal>
  )
}

export function useSendAssetForm({
  address,
  assetAddress,
  onSuccess,
  accountAddress,
}: {
  address: string
  accountAddress?: string
  onSuccess?: () => void
  assetAddress?: string
}) {
  const toast = useToast()

  const {
    onToggle: onToggleShowMultisigSettings,
    isOpen: isMultisigSettingsExpanded,
  } = useDisclosure()

  const sendFormRef = React.useRef<HTMLFormElement>(null)

  const { data: accountInfoData } = useGetAccountInfo(accountAddress)
  const showMultisigSettings = !!accountInfoData?.hasMultisigFeature
  const canEditMultisigSettings = !!(
    showMultisigSettings && accountInfoData?.isOwner
  )

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

  const {
    mutate: doCreateSendTxn,
    isLoading: isCreateSendTxnLoading,
    error: createSendTxnError,
  } = useCreateSendTxn()
  const {
    mutate: doCreateMultisigSubmitTxn,
    isLoading: isCreateMultisigSubmitTxnLoading,
    error: createMultisigSubmitTxnError,
  } = useMultisigSubmit()

  function onSendSuccess() {
    setFormValues({ ...defaultFormState })
    contact && setContact(undefined)
    toast({
      status: "success",
      title: "Send",
      description: "Transaction was sent",
    })
    onCloseConfirmDialog()
  }

  async function onSendTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const bigIntAmount = parseNumberToBigInt(parseFloat(formValues.amount!))
    if (accountAddress) {
      const sendForm = sendFormRef.current!
      const formData = new FormData(sendForm)
      const threshold = Number(formData.get("threshold"))
      const executeAutomatically = formData.get("executeAutomatically") === "1"
      const expireInSecs = Number(formData.get("expireInSecs"))
      doCreateMultisigSubmitTxn(
        {
          from: address,
          to: formValues.to,
          amount: bigIntAmount,
          symbol: formValues.asset!.identity,
          memo: formValues?.memo?.trim(),
          expireInSecs,
          executeAutomatically,
          threshold,
        },
        {
          onSuccess: () => {
            onSendSuccess()
            onSuccess?.()
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
          onSuccess?.()
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

  return {
    balances,
    contact,
    setContact,
    onChange,
    onNext,
    onSendTxn,
    doCreateMultisigSubmitTxn,
    error: createMultisigSubmitTxnError?.message || createSendTxnError?.message,
    isCreateMultisigSubmitTxnLoading,
    doCreateSendTxn,
    isCreateSendTxnLoading,
    asset,
    isShowConfirmDialog,
    formValues,
    setFormValues,
    onCloseConfirmDialog,
    sendFormRef,
    showMultisigSettings,
    canEditMultisigSettings,
    onToggleShowMultisigSettings,
    isMultisigSettingsExpanded,
  }
}

export function SendAssetForm({
  accountAddress,
  formId = "send-asset-form",
  sendAssetState,
  showNextBtn = true,
}: {
  accountAddress?: string
  sendAssetState: ReturnType<typeof useSendAssetForm>
  formId?: string
  onSuccess?: () => void
  showNextBtn?: boolean
}) {
  const {
    balances,
    contact,
    setContact,
    onChange,
    onNext,
    onSendTxn,
    isCreateMultisigSubmitTxnLoading,
    isCreateSendTxnLoading,
    asset,
    isShowConfirmDialog,
    formValues,
    setFormValues,
    onCloseConfirmDialog,
    error,
    sendFormRef,
    showMultisigSettings,
    canEditMultisigSettings,
    onToggleShowMultisigSettings,
    isMultisigSettingsExpanded,
  } = sendAssetState

  const formData = sendFormRef?.current
    ? new FormData(sendFormRef.current)
    : new Map()
  const { hours, minutes, seconds } = formData
    ? getHoursMinutesSecondsFromSeconds(Number(formData.get("expireInSecs")))
    : { hours: 0, minutes: 0, seconds: 0 }

  return (
    <>
      <form
        onSubmit={onNext}
        aria-label="send form"
        id={formId}
        ref={sendFormRef}
      >
        <VStack alignItems="flex-start" spacing={5}>
          <FormControl isRequired>
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
            <FormControl>
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
          {showMultisigSettings ? (
            <Box>
              <Button
                size="sm"
                rightIcon={
                  isMultisigSettingsExpanded ? (
                    <ChevronUpIcon boxSize={4} />
                  ) : (
                    <ChevronDownIcon boxSize={4} />
                  )
                }
                variant="link"
                onClick={onToggleShowMultisigSettings}
              >
                Multisig Settings
              </Button>
              <Collapse in={isMultisigSettingsExpanded} animateOpacity>
                <VStack alignItems="flex-start" spacing={5} mt={2}>
                  <MultisigSettingsFields
                    accountAddress={accountAddress!}
                    canEdit={canEditMultisigSettings}
                  />
                </VStack>
              </Collapse>
            </Box>
          ) : null}
          {showNextBtn && (
            <Flex justifyContent="flex-end" w="full">
              <Button
                width={{ base: "full", md: "auto" }}
                colorScheme="brand.teal"
                type="submit"
              >
                Next
              </Button>
            </Flex>
          )}
        </VStack>
      </form>
      <ConfirmTxnDialog
        isOpen={isShowConfirmDialog}
        onClose={onCloseConfirmDialog}
        onSendTxn={onSendTxn}
        txnDetails={formValues}
        isLoading={isCreateSendTxnLoading || isCreateMultisigSubmitTxnLoading}
        error={error}
        contact={contact}
        expireHours={hours}
        expireMinutes={minutes}
        expireSeconds={seconds}
        executeAutomatically={formData.get("executeAutomatically") === "1"}
        threshold={formData.get("threshold")}
        showMultisigSettings={showMultisigSettings}
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
  error,
  showMultisigSettings,
  expireHours,
  expireMinutes,
  expireSeconds,
  threshold,
  executeAutomatically,
}: Omit<AlertDialogProps, "children" | "leastDestructiveRef"> & {
  onSendTxn: (e: React.FormEvent<HTMLFormElement>) => void
  txnDetails: typeof defaultFormState
  isLoading: boolean
  contact?: Contact
  error?: string
  showMultisigSettings: boolean
  expireHours?: number
  expireMinutes?: number
  expireSeconds?: number
  threshold?: number
  executeAutomatically?: boolean
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
      size="md"
      footer={
        <Flex
          flexDir={{ base: "column", md: "row" }}
          justifyContent="flex-end"
          gap={2}
          w="full"
        >
          <Button
            width={{ base: "full", md: "auto" }}
            disabled={isLoading}
            onClick={onClose}
            ref={cancelTxnRef}
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
        </Flex>
      }
    >
      <AlertDialog.Body>
        <form id="confirm-txn-form" onSubmit={onSendTxn}>
          <DataField label="To">
            {contact ? (
              <Text fontWeight="medium" fontSize="lg">
                {contact.name}
              </Text>
            ) : null}
            <AddressText addressText={txnDetails.to} isFullText />
          </DataField>
          <DataField label="Amount">
            <HStack spacing={1}>
              <Image src={cubeImg} borderRadius="full" boxSize={9} />
              <Text fontSize="lg" isTruncated fontWeight="medium">
                {txnDetails.amount}
              </Text>
              <Text fontSize="lg">{txnDetails.asset?.symbol}</Text>
            </HStack>
          </DataField>
          {showMultisigSettings ? (
            <>
              <DataField label="Required Approvers" value={threshold} />
              <DataField label="Transaction Expiration">
                <TxnExpireText
                  hours={expireHours}
                  minutes={expireMinutes}
                  seconds={expireSeconds}
                />
              </DataField>
              <DataField
                label="Execute Automatically"
                value={executeAutomatically ? "Yes" : "No"}
              />
            </>
          ) : null}

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
          {error && (
            <Alert status="warning" variant="left-accent" mt={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
