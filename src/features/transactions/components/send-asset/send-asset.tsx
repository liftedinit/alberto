import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { ANON_IDENTITY } from "@liftedinit/many-js"
import {
  AddressText,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertDialog,
  AlertDialogProps,
  Button,
  Box,
  Checkbox,
  ChevronDownIcon,
  ChevronUpIcon,
  Collapse,
  DataField,
  FieldWrapper,
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
  cubePng,
  amountFormatter,
  parseNumberToBigInt,
} from "@liftedinit/ui"
import {
  accountMultisigFeature,
  MultisigSettingsFields,
  useAccountsStore,
  useGetAccountInfo,
} from "features/accounts"
import { useBalances, AssetSelector } from "features/balances"
import { useCreateSendTxn } from "features/transactions"
import { ContactSelector, useGetContactName } from "features/contacts"
import { useMultisigSubmit } from "features/accounts"

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
            disabled={sendAssetState.isNextDisabled}
            onClick={sendAssetState.formMethods.handleSubmit(
              sendAssetState.onNext,
            )}
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
  const balances = useBalances({ address })
  const [asset, setAsset] = React.useState(() =>
    assetAddress
      ? balances?.data?.allAssetsWithBalance?.find(
          asset => asset.identity === assetAddress,
        )
      : undefined,
  )
  const toast = useToast()

  const defaultValues = {
    to: "",
    amount: "",
    memo: "",
    multisigSettings: {
      threshold: 1,
      expireInSecs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      executeAutomatically: false,
    },
  }

  const formMethods = useForm({
    defaultValues,
  })
  const { getValues } = formMethods

  const {
    onToggle: onToggleShowMultisigSettings,
    isOpen: isMultisigSettingsExpanded,
  } = useDisclosure()

  const { data: accountInfoData } = useGetAccountInfo(accountAddress)
  const showMultisigSettings = !!accountInfoData?.hasMultisigFeature
  const canEditMultisigSettings = !!(
    showMultisigSettings && accountInfoData?.isOwner
  )
  const multisigSettings = accountInfoData?.accountInfo?.features?.get(
    accountMultisigFeature,
  )

  const {
    isOpen: isShowConfirmDialog,
    onOpen: onShowConfirmAlert,
    onClose: onCloseConfirmDialog,
  } = useDisclosure()

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
    formMethods.reset(defaultValues)
    setAsset(undefined)
    toast({
      status: "success",
      title: "Send",
      description: "Transaction was sent",
    })
    onCloseConfirmDialog()
  }

  function getNewMultisigSettings(
    oldSettings: Map<string, unknown>,
    newSettings: { [k: string]: unknown },
  ): { [k: string]: unknown } {
    const result: { [k: string]: unknown } = {}
    if (oldSettings && newSettings) {
      Object.keys(newSettings).forEach(k => {
        const newValue = newSettings[k]
        if (oldSettings?.has(k) && oldSettings?.get(k) !== newValue) {
          result[k] = newValue
        }
      })
    }

    return result
  }

  async function onSendTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formValues = getValues()
    const bigIntAmount = parseNumberToBigInt(parseFloat(formValues.amount))
    if (accountAddress) {
      const newMultisigSettings = getNewMultisigSettings(
        multisigSettings as Map<string, unknown>,
        formValues.multisigSettings,
      )
      doCreateMultisigSubmitTxn(
        {
          from: address,
          to: formValues.to,
          amount: bigIntAmount,
          symbol: asset!.identity,
          memo: formValues?.memo?.trim(),
          ...newMultisigSettings,
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
        symbol: asset!.identity,
      },
      {
        onSuccess: () => {
          onSendSuccess()
          onSuccess?.()
        },
      },
    )
  }

  async function onNext() {
    onShowConfirmAlert()
    return
  }

  const [watchTo, watchAmount] = formMethods.watch(["to", "amount"])

  return {
    balances,
    onNext,
    isNextDisabled: !watchTo || !watchAmount || !asset,
    onSendTxn,
    doCreateMultisigSubmitTxn,
    error: createMultisigSubmitTxnError?.message || createSendTxnError?.message,
    isCreateMultisigSubmitTxnLoading,
    doCreateSendTxn,
    isCreateSendTxnLoading,
    asset,
    setAsset,
    isShowConfirmDialog,
    onCloseConfirmDialog,
    showMultisigSettings,
    canEditMultisigSettings,
    onToggleShowMultisigSettings,
    isMultisigSettingsExpanded,
    formMethods,
  }
}

export function SendAssetForm({
  accountAddress,
  sendAssetState,
  showNextBtn = true,
}: {
  accountAddress?: string
  sendAssetState: ReturnType<typeof useSendAssetForm>
  onSuccess?: () => void
  showNextBtn?: boolean
}) {
  const getContactName = useGetContactName()
  const {
    balances,
    onNext,
    isNextDisabled,
    onSendTxn,
    isCreateMultisigSubmitTxnLoading,
    isCreateSendTxnLoading,
    asset,
    setAsset,
    isShowConfirmDialog,
    onCloseConfirmDialog,
    error,
    showMultisigSettings,
    canEditMultisigSettings,
    onToggleShowMultisigSettings,
    isMultisigSettingsExpanded,
    formMethods,
  } = sendAssetState

  const {
    formState: { errors },
  } = formMethods

  const {
    to,
    amount,
    memo,
    multisigSettings: {
      hours,
      minutes,
      seconds,
      executeAutomatically,
      threshold,
    },
  } = formMethods.getValues()

  const contactName = getContactName(to)

  return (
    <FormProvider {...formMethods}>
      <div aria-label="send form">
        <VStack alignItems="flex-start" spacing={5}>
          <FieldWrapper
            isRequired
            error={errors?.to?.message}
            label={() => {
              return (
                <HStack justifyContent="space-between" alignItems="stretch">
                  <FormLabel htmlFor="to">To</FormLabel>
                  <Box>
                    <ContactSelector
                      onContactClicked={(onClose, c) => {
                        formMethods.setValue("to", c.address)
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
              )
            }}
          >
            <VStack
              bgColor="gray.100"
              px={4}
              py={2}
              rounded="md"
              spacing={0}
              alignItems="flex-start"
              borderColor={errors?.to ? "red.500" : undefined}
              borderWidth={errors?.to ? "2px" : undefined}
            >
              {contactName ? (
                <Text fontWeight="medium" fontSize="lg">
                  {contactName}
                </Text>
              ) : null}
              <Input
                autoFocus
                variant="unstyled"
                placeholder="maffbahksdwaqeenayy..."
                fontFamily="monospace"
                id="to"
                isTruncated
                {...formMethods.register("to", {
                  required: "This field is required",
                  pattern: {
                    value: /^[a-z0-9]*$/,
                    message: "Only a-z and 0-9 characters are allowed",
                  },
                })}
              />
            </VStack>
          </FieldWrapper>

          <FieldWrapper
            isRequired
            error={errors?.amount?.message}
            label={() => {
              return (
                <Flex alignItems="stretch" justifyContent="space-between">
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <Box>
                    <AssetSelector
                      ownedAssets={balances.data.ownedAssetsWithBalance}
                      allAssets={balances.data.allAssetsWithBalance}
                      onAssetClicked={asset => {
                        setAsset(asset)
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
              )
            }}
          >
            <HStack
              bgColor="gray.100"
              px={4}
              py={2}
              rounded="md"
              borderColor={errors?.amount ? "red.500" : undefined}
              borderWidth={errors?.amount ? "2px" : undefined}
            >
              <Input
                alignSelf="flex-start"
                variant="unstyled"
                placeholder="0.0"
                id="amount"
                fontFamily="monospace"
                {...formMethods.register("amount", {
                  required: "This field is required",
                  pattern: {
                    value: /^(\d?)+(?:\.\d{1,9})?$/,
                    message: "Number with up to 9 decimal places",
                  },
                })}
              />
              <VStack alignItems="flex-end" spacing={0}>
                {asset ? (
                  <>
                    <HStack spacing={1}>
                      <Image src={cubePng} borderRadius="full" boxSize={9} />
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
                          formMethods.setValue(
                            "amount",
                            amountFormatter(asset.balance),
                          )
                        }}
                      >
                        Max
                      </Button>
                    </HStack>
                  </>
                ) : null}
              </VStack>
            </HStack>
          </FieldWrapper>
          {accountAddress && (
            <FieldWrapper
              label="Memo"
              description="Add a short memo"
              error={errors?.memo?.message}
            >
              <Input
                {...formMethods.register("memo", {
                  maxLength: {
                    value: 512,
                    message: "Max 512 characters allowed",
                  },
                })}
              />
            </FieldWrapper>
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
                <VStack alignItems="flex-start" spacing={4} mt={2}>
                  <MultisigSettingsFields
                    accountAddress={accountAddress!}
                    canEdit={canEditMultisigSettings}
                    name="multisigSettings."
                  />
                </VStack>
              </Collapse>
            </Box>
          ) : null}
          {showNextBtn && (
            <Flex justifyContent="flex-end" w="full">
              <Button
                width={{ base: "full", md: "auto" }}
                disabled={isNextDisabled}
                colorScheme="brand.teal"
                onClick={formMethods.handleSubmit(onNext)}
              >
                Next
              </Button>
            </Flex>
          )}
        </VStack>
      </div>
      <ConfirmTxnDialog
        isOpen={isShowConfirmDialog}
        onClose={onCloseConfirmDialog}
        onSendTxn={onSendTxn}
        to={to}
        assetSymbol={asset?.symbol}
        amount={amount}
        memo={memo}
        isLoading={isCreateSendTxnLoading || isCreateMultisigSubmitTxnLoading}
        error={error}
        contactName={contactName}
        expireHours={hours}
        expireMinutes={minutes}
        expireSeconds={seconds}
        executeAutomatically={executeAutomatically}
        threshold={threshold}
        showMultisigSettings={showMultisigSettings}
      />
    </FormProvider>
  )
}

function ConfirmTxnDialog({
  isOpen,
  onClose,
  onSendTxn,
  to,
  amount,
  assetSymbol,
  isLoading,
  contactName,
  error,
  showMultisigSettings,
  expireHours,
  expireMinutes,
  expireSeconds,
  threshold,
  memo,
  executeAutomatically,
}: Omit<AlertDialogProps, "children" | "leastDestructiveRef"> & {
  onSendTxn: (e: React.FormEvent<HTMLFormElement>) => void
  to: string
  amount: string
  assetSymbol?: string
  isLoading: boolean
  contactName?: string
  error?: string
  showMultisigSettings: boolean
  expireHours?: number
  expireMinutes?: number
  expireSeconds?: number
  threshold?: number
  memo?: string
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
            data-testid="send-txn-btn"
          >
            Send
          </Button>
        </Flex>
      }
    >
      <AlertDialog.Body>
        <form id="confirm-txn-form" onSubmit={onSendTxn}>
          <DataField label="To">
            {contactName ? (
              <Text fontWeight="medium" fontSize="lg">
                {contactName}
              </Text>
            ) : null}
            <AddressText addressText={to} isFullText />
          </DataField>
          <DataField label="Amount">
            <HStack spacing={1}>
              <Image src={cubePng} borderRadius="full" boxSize={9} />
              <Text fontSize="lg" isTruncated fontWeight="medium">
                {amount}
              </Text>
              <Text fontSize="lg">{assetSymbol}</Text>
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
              <DataField label="Memo" value={memo} />
            </>
          ) : null}

          <Checkbox
            mt={2}
            w="full"
            justifyContent="flex-end"
            colorScheme="brand.teal"
            aria-label="confirm transaction"
            onChange={e => setIsConfirmed(e.target.checked)}
            data-testid="approve-txn"
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
