import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { AccountInfoData } from "many-js"
import {
  AddressText,
  AlertDialog,
  Box,
  Button,
  ButtonGroup,
  Center,
  CloseIcon,
  Divider,
  FormControl,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  PlusIcon,
  Spinner,
  Tab,
  Tabs,
  TabList,
  Text,
  useToast,
  useDisclosure,
  usePageContainerProvider,
  VStack,
  AccountsIcon,
} from "components"
import {
  AccountInfo,
  useAccountStore,
  useGetAccountInfo,
} from "features/accounts"
import { useDebounce } from "hooks"

export function AccountsList() {
  const [, setContainerProps] = usePageContainerProvider()
  const [name, setName] = React.useState("")
  const debouncedName = useDebounce(name)
  const { update, count: accountCount } = useAccountStore(s => ({
    update: s.update,
    count: s.byId.size,
  }))

  React.useLayoutEffect(() => {
    setContainerProps({
      w: { base: "auto", md: "md" },
    })
  }, [setContainerProps])

  if (!accountCount) return <NoAccountsPrompt />
  return (
    <>
      <FormControl isRequired>
        <HStack>
          <Input
            name="account"
            id="account"
            size="sm"
            onChange={e => setName(e.target.value)}
            maxLength={75}
            placeholder="Filter by name..."
          />
          <Flex>
            <AccountSelector
              onAccountSelected={(
                address: string,
                accountInfo: AccountInfoData,
              ) => {
                update(address, accountInfo)
              }}
            />
          </Flex>
        </HStack>
      </FormControl>
      <Box mt={6}>
        <AccountList searchTerm={debouncedName} />
      </Box>
    </>
  )
}

function NoAccountsPrompt() {
  const { update } = useAccountStore(s => ({
    update: s.update,
    count: s.byId.size,
  }))
  return (
    <Center>
      <VStack>
        <AccountsIcon color="gray.300" boxSize="16" />
        <Text fontWeight="medium">No accounts found</Text>
        <AccountSelector
          onAccountSelected={(
            address: string,
            accountInfo: AccountInfoData,
          ) => {
            update(address, accountInfo)
          }}
        >
          {({ onOpen }: { onOpen: () => void }) => (
            <Button onClick={onOpen} variant="link">
              Add account
            </Button>
          )}
        </AccountSelector>
      </VStack>
    </Center>
  )
}

function AccountSelector({
  onAccountSelected,
  children,
}: React.PropsWithChildren<{
  onAccountSelected: (address: string, acctInfo: AccountInfoData) => void
}>) {
  const { onClose, isOpen, onOpen } = useDisclosure()

  return (
    <>
      {typeof children === "function" ? (
        children({ onOpen, onClose, isOpen })
      ) : (
        <IconButton
          rounded="full"
          size="sm"
          aria-label="import account"
          icon={<PlusIcon boxSize={6} />}
          onClick={onOpen}
        />
      )}
      <AddAccountModal
        onClose={onClose}
        isOpen={isOpen}
        onAccountSelected={onAccountSelected}
      />
    </>
  )
}

function AddAccountModal({
  onClose,
  isOpen,
  onAccountSelected,
}: {
  onClose: () => void
  isOpen: boolean
  onAccountSelected: (address: string, acctInfo: AccountInfoData) => void
}) {
  const [accountAddress, setAccountAddress] = React.useState("")
  const debouncedAcctAddress = useDebounce(accountAddress)
  const { data, isLoading, isFetching } =
    useGetAccountInfo(debouncedAcctAddress)

  function onImportClick() {
    data?.accountInfo &&
      onAccountSelected(debouncedAcctAddress, data.accountInfo)
    onClose()
  }

  React.useEffect(() => {
    !isOpen && setAccountAddress("")
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Add Account"
      scrollBehavior="inside"
      footer={
        data?.accountInfo ? (
          <Button size="sm" colorScheme="brand.teal" onClick={onImportClick}>
            Import
          </Button>
        ) : (
          <></>
        )
      }
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        <Tabs mb={4}>
          <TabList>
            <Tab>Search</Tab>
          </TabList>
        </Tabs>
        <FormControl isRequired>
          <Input
            name="account"
            id="account"
            size="sm"
            variant="filled"
            maxLength={100}
            minLength={50}
            onChange={e => setAccountAddress(e.target.value.trim())}
            placeholder="Account address"
          />
        </FormControl>
        {isFetching && (
          <Center mt={4}>
            <Spinner size="lg" justifySelf="center" alignSelf="center" />
          </Center>
        )}
        {!isFetching && !isLoading && !data && (
          <Center mt={4}>
            <Text>No account was found.</Text>
          </Center>
        )}
        <AccountInfo accountInfo={data?.accountInfo} />
      </Modal.Body>
    </Modal>
  )
}

function AccountList({ searchTerm }: { searchTerm: string }) {
  const accounts = useAccountStore(s => Array.from(s.byId))
  return (
    <VStack alignItems="flex-start" divider={<Divider />} spacing={4}>
      {accounts.map(acc => {
        const [address, { description }] = acc
        if (
          !searchTerm ||
          (searchTerm &&
            (description as string)
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase()))
        )
          return (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              key={address}
              w="full"
              gap={4}
            >
              <Box w="full" overflow="hidden">
                <RouterLink to={address}>
                  <Text fontWeight="medium" isTruncated>
                    {description as string}
                  </Text>
                </RouterLink>
                <AddressText bgColor={undefined} p={0} addressText={address} />
              </Box>
              <RemoveAccountDialog address={address}>
                {onOpen => (
                  <IconButton
                    size="sm"
                    rounded="full"
                    aria-label="remove contact"
                    onClick={e => {
                      e.stopPropagation()
                      onOpen()
                    }}
                    icon={<CloseIcon color="red" boxSize={5} />}
                  />
                )}
              </RemoveAccountDialog>
            </Flex>
          )
        return null
      })}
    </VStack>
  )
}

function RemoveAccountDialog({
  address,
  children,
}: {
  address: string
  children: (onOpen: () => void) => void
}) {
  const toast = useToast()
  const deleteAccount = useAccountStore(s => s.delete)
  const cancelRef = React.useRef(null)
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { data } = useGetAccountInfo(address)

  function onRemove(e: React.FormEvent<HTMLButtonElement>) {
    e.stopPropagation()
    deleteAccount(address)
    toast({
      status: "success",
      title: "Account",
      description: "Account was removed",
    })
  }

  return (
    <>
      {children(onOpen)}
      <AlertDialog
        header="Confirm"
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialog.Body>
          <Text>Remove this account?</Text>
          <AccountInfo accountInfo={data?.accountInfo} />
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <ButtonGroup w="full" justifyContent="flex-end">
            <Button
              width={{ base: "full", md: "auto" }}
              onClick={onClose}
              ref={cancelRef}
              type="submit"
            >
              Cancel
            </Button>
            <Button
              width={{ base: "full", md: "auto" }}
              colorScheme="red"
              onClick={onRemove}
            >
              Remove
            </Button>
          </ButtonGroup>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  )
}
