import React from "react"
import { useLocation } from "react-router-dom"
import { FiChevronDown } from "react-icons/fi"
import {
  Button,
  ButtonProps,
  Box,
  Checkbox,
  ContainerWrapper,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  Flex,
  HStack,
  Image,
  Input,
  Layout,
  List,
  ListItem,
  Modal,
  Text,
  useToast,
  useDisclosure,
  VStack,
} from "components"
import cubeImg from "assets/cube.png"
import { useNetworkContext } from "features/network"
import { useAccountsStore } from "features/accounts"
import { useBalances } from "features/balances"
import { useDebounce } from "hooks"

import { useSendToken } from "features/transactions"
import { Asset } from "features/balances/queries"

enum ConfirmState {
  requireConfirmation = "requireConfirmation",
  confirmed = "confirmed",
}

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
  const network = useNetworkContext()
  const account = useAccountsStore(s => s.byId.get(s.activeId))
  const balances = useBalances({ network, account })

  const [confirmState, setConfirmState] = React.useState<
    ConfirmState | undefined
  >(undefined)

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

  const { sendToken, isLoading } = useSendToken({
    network,
    account,
  })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!confirmState) {
      setConfirmState(ConfirmState.requireConfirmation)
    } else if (confirmState === ConfirmState.confirmed) {
      if (!formValues.amount || !formValues.to || !formValues.asset?.identity)
        return
      sendToken(
        {
          to: formValues.to,
          amount: BigInt(formValues.amount!),
          symbol: formValues.asset.identity,
        },
        {
          onSuccess: () => {
            setFormValues({ to: "", amount: undefined, asset: undefined })
            setConfirmState(undefined)
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
  }, [network, account])

  return (
    <Layout.Main px={{ base: 4, md: 0 }} py={2}>
      <ContainerWrapper maxW="md">
        <Heading size="lg" mb={3}>
          Send
        </Heading>
        <Box shadow="base" rounded="md" p={8} bgColor="white">
          <form onSubmit={onSubmit} aria-label="send form">
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
              <Box bgColor="gray.100" px={4} py={2} rounded="md" display="flex">
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
                <VStack alignItems="flex-end">
                  <AssetSelector
                    assets={balances.data.ownedAssetsWithBalance}
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
                    {asset?.symbol || "Select a token"}
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
              </Box>
            </FormControl>
            {confirmState ? (
              <Flex flexDir="row-reverse">
                <Checkbox
                  mt={2}
                  justifyContent="flex-end"
                  colorScheme="brand.teal"
                  aria-label="confirm transaction"
                  onChange={e =>
                    setConfirmState(s =>
                      e.target.checked
                        ? ConfirmState.confirmed
                        : ConfirmState.requireConfirmation,
                    )
                  }
                >
                  Confirm this transaction
                </Checkbox>
              </Flex>
            ) : null}
            <Flex justifyContent="flex-end" w="full" mt={4}>
              {confirmState ? (
                <Button
                  mr={2}
                  width={{ base: "full", md: "auto" }}
                  autoFocus
                  onClick={() => setConfirmState(undefined)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              ) : null}
              <Button
                width={{ base: "full", md: "auto" }}
                isLoading={isLoading}
                colorScheme="brand.teal"
                disabled={
                  isLoading ||
                  !asset ||
                  (confirmState && confirmState !== ConfirmState.confirmed)
                }
                type="submit"
              >
                {confirmState ? "Send" : "Next"}
              </Button>
            </Flex>
          </form>
        </Box>
      </ContainerWrapper>
    </Layout.Main>
  )
}

function AssetSelector({
  assets,
  onChange,
  children,
  ...props
}: Omit<ButtonProps, "onChange"> & {
  onChange: (asset: Asset) => void
  assets: { identity: string; balance: bigint; symbol: string }[]
}) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearchTerm = useDebounce(searchTerm)

  const visibleAssets = React.useMemo(() => {
    return assets.filter(a =>
      debouncedSearchTerm
        ? a.symbol
            .toLocaleLowerCase()
            .startsWith(debouncedSearchTerm.toLocaleLowerCase())
        : true,
    )
  }, [debouncedSearchTerm, assets])

  return (
    <>
      <Button
        rightIcon={<FiChevronDown />}
        aria-label="select token"
        onClick={onToggle}
        lineHeight="normal"
        px={2}
        bgColor="white"
        shadow="base"
        fontSize="lg"
        {...props}
      >
        {children}
      </Button>
      <Modal
        header="Select a token"
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        scrollBehavior="inside"
      >
        <Modal.Body>
          <Box>
            <Input
              name="assetNameFilter"
              id="assetNameFilter"
              variant="filled"
              placeholder="Search name"
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Box>
          <Divider my={3} />
          <List spacing={3} mb={1}>
            {visibleAssets?.map(asset => {
              return (
                <ListItem
                  key={asset.identity}
                  as={Button}
                  isFullWidth
                  variant="ghost"
                  justifyContent="flex-start"
                  aria-label="select asset"
                  h="auto"
                  p={2}
                  onClick={() => {
                    onChange(asset)
                    onClose()
                  }}
                >
                  <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    w="full"
                  >
                    <HStack>
                      <Image src={cubeImg} borderRadius="full" boxSize={9} />
                      <VStack alignItems="flex-start" spacing={0}>
                        <Text fontSize="lg" lineHeight="normal">
                          {asset.symbol}
                        </Text>
                        <Text
                          fontSize="xs"
                          lineHeight="normal"
                          fontWeight="light"
                        >
                          Asset Full Name
                        </Text>
                      </VStack>
                    </HStack>
                    <Text whiteSpace="nowrap" overflow="hidden" isTruncated>
                      {asset.balance?.toLocaleString() || "0"}
                    </Text>
                  </HStack>
                </ListItem>
              )
            })}
          </List>
        </Modal.Body>
      </Modal>
    </>
  )
}
