import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { AccountInfoData } from "many-js"
import {
  AddressText,
  AlertDialog,
  AccountsIcon,
  Box,
  Button,
  ButtonGroup,
  ChevronRightIcon,
  Center,
  CloseIcon,
  Divider,
  FormControl,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  useToast,
  useDisclosure,
  usePageContainerProvider,
  useBreakpointValue,
  VStack,
} from "components"
import {
  AccountInfo,
  AccountSelector,
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
              onAccountSelected={(address: string) => {
                update(address, {})
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
          onAccountSelected={(address: string) => {
            update(address, {})
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

function AccountList({ searchTerm }: { searchTerm: string }) {
  const accounts = useAccountStore(s => Array.from(s.byId))
  return (
    <VStack alignItems="flex-start" divider={<Divider />} spacing={0}>
      {accounts.map(acc => {
        const [address] = acc
        return (
          <AccountListItem
            searchTerm={searchTerm}
            key={address}
            address={address}
          />
        )
      })}
    </VStack>
  )
}

function AccountListItem({
  address,
  searchTerm,
}: {
  address: string
  searchTerm?: string
}) {
  const { data } = useGetAccountInfo(address)
  const description = data?.accountInfo?.description
  const [showActions, setShowActions] = React.useState(false)
  const isBase = useBreakpointValue({ base: true, md: false })

  React.useEffect(() => {
    if (isBase) setShowActions(true)
    else setShowActions(false)
  }, [isBase])

  if (
    !searchTerm ||
    (searchTerm &&
      (description as string)
        ?.toLocaleLowerCase()
        ?.includes(searchTerm.toLocaleLowerCase()))
  ) {
    return (
      <Flex
        alignItems="center"
        justifyContent="space-between"
        w="full"
        gap={2}
        py={4}
        px={3}
        onMouseEnter={isBase ? undefined : () => setShowActions(true)}
        onMouseLeave={isBase ? undefined : () => setShowActions(false)}
        _hover={{ bgColor: "gray.50" }}
      >
        <Box w="full" overflow="hidden">
          <Text as={RouterLink} to={address} fontWeight="medium" isTruncated>
            {description}
          </Text>
          <AddressText
            bgColor={undefined}
            p={0}
            addressText={address}
            iconProps={{ boxSize: 4 }}
          />
        </Box>
        {showActions && (
          <>
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
            <IconButton
              as={RouterLink}
              to={address}
              size="sm"
              rounded="full"
              aria-label="view account"
              icon={<ChevronRightIcon />}
            />
          </>
        )}
      </Flex>
    )
  }
  return null
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
