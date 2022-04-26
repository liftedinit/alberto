import React from "react"
import { ANON_IDENTITY, WebAuthnIdentity } from "many-js"
import { useAccountsStore } from "features/accounts"
import {
  Box,
  Button,
  Circle,
  ChevronDownIcon,
  Code,
  CopyToClipboard,
  EditIcon,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuDivider,
  SimpleGrid,
  Text,
  useDisclosure,
  UserIcon,
  VStack,
  UsbIcon,
} from "components"
import { AddAccountModal } from "./add-account-modal"
import { EditAccountModal } from "./edit-account-modal"
import { displayId } from "helper/common"
import { Account, AccountId } from "../../types"
import { IdentityText } from "components/uikit/identity-text"

export type AccountItemWithIdDisplayStrings = [
  AccountId,
  Account & { idDisplayStrings: { full?: string; short?: string } },
]

export function AccountsMenu() {
  const {
    isOpen: isAddModalOpen,
    onClose: onAddModalClose,
    onOpen: onAddModalOpen,
  } = useDisclosure()

  const {
    isOpen: isEditModalOpen,
    onClose: onEditModalClose,
    onOpen: onEditModalOpen,
  } = useDisclosure()

  const { activeAccount, accounts, activeId, setActiveId } = useAccountsStore(
    s => ({
      accounts: Array.from(s.byId).sort((a, b) => {
        const [, { name: nameA }] = a
        const [, { name: nameB }] = b
        const nameALower = nameA.toLocaleLowerCase()
        const nameBLower = nameB.toLocaleLowerCase()
        return nameALower === nameBLower ? 0 : nameALower < nameBLower ? -1 : 1
      }),
      activeAccount: s.byId.get(s.activeId),
      activeId: s.activeId,
      setActiveId: s.setActiveId,
    }),
  )

  const [editAccount, setEditAccount] = React.useState<
    AccountItemWithIdDisplayStrings | undefined
  >()

  function onEditClick(acct: AccountItemWithIdDisplayStrings) {
    setEditAccount(acct)
    onEditModalOpen()
  }

  const accountsWithIdDisplayStrings: AccountItemWithIdDisplayStrings[] =
    React.useMemo(() => {
      return accounts.map(item => {
        const [id, account] = item
        const idDisplayStrings = displayId(account)
        const accountWithIdDisplayStrings = {
          ...account,
          idDisplayStrings,
        }
        return [id, accountWithIdDisplayStrings]
      })
    }, [accounts])

  const idStrs = displayId(activeAccount!)

  return (
    <Flex alignItems="center" minWidth="100px" mr={2}>
      <Menu autoSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<Icon as={UserIcon} w={5} h={5} />}
          aria-label="active account menu trigger"
        >
          <Text
            casing="uppercase"
            fontWeight="semibold"
            isTruncated
            lineHeight="normal"
          >
            {activeAccount?.name}
          </Text>
        </MenuButton>
        <MenuList maxW="100vw" zIndex={2}>
          <MenuOptionGroup title="Accounts" />
          <Box overflow="auto" maxHeight="40vh">
            {activeAccount ? (
              <Box overflow="auto" maxHeight="40vh">
                <AccountMenuItem
                  activeId={activeId}
                  account={[
                    activeId,
                    { ...activeAccount, idDisplayStrings: idStrs! },
                  ]}
                  setActiveId={id => setActiveId(id)}
                  onEditClick={onEditClick}
                />
              </Box>
            ) : null}

            {accountsWithIdDisplayStrings.map(
              (acc: AccountItemWithIdDisplayStrings) =>
                acc[0] === activeId ? null : (
                  <AccountMenuItem
                    key={String(acc[0])}
                    activeId={activeId}
                    account={acc}
                    onEditClick={onEditClick}
                    setActiveId={setActiveId}
                  />
                ),
            )}
          </Box>
          <MenuDivider mt={0} />
          <MenuItem
            as={Box}
            display="flex"
            alignItems="center"
            _hover={{ backgroundColor: "transparent" }}
          >
            <Button isFullWidth onClick={onAddModalOpen}>
              Add Account
            </Button>
          </MenuItem>
        </MenuList>
      </Menu>
      {idStrs && idStrs.short !== ANON_IDENTITY && (
        <HStack
          display={{ base: "none", md: "inline-flex" }}
          bgColor="gray.100"
          ml={2}
          px={2}
          py={1}
          rounded="md"
        >
          <Code fontWeight="md">
            <IdentityText fullIdentity={idStrs.full} />
          </Code>
          <CopyToClipboard toCopy={idStrs.full as string} />
        </HStack>
      )}
      <AddAccountModal isOpen={isAddModalOpen} onClose={onAddModalClose} />
      <EditAccountModal
        account={editAccount!}
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
      />
    </Flex>
  )
}

function AccountMenuItem({
  activeId,
  account,
  setActiveId,
  onEditClick,
}: {
  activeId: AccountId
  account: AccountItemWithIdDisplayStrings
  setActiveId: (id: number) => void
  onEditClick: (a: AccountItemWithIdDisplayStrings) => void
}) {
  const id = account[0]
  const accountData = account[1]
  const isWebAuthnIdentity = accountData.identity instanceof WebAuthnIdentity
  return (
    <MenuItem as={SimpleGrid} columns={3} borderTopWidth={1} spacing={4} py={4}>
      {activeId === id && <Circle bg="green.400" size="10px" />}
      <VStack align="flex-start" spacing={1} flexGrow={1}>
        <HStack>
          {activeId === id ? (
            <HStack>
              <Text fontSize={{ base: "xl", md: "md" }} casing="uppercase">
                {accountData.name}
              </Text>
              {isWebAuthnIdentity && <UsbIcon boxSize={5} />}
            </HStack>
          ) : (
            <Button
              variant="link"
              onClick={() => setActiveId?.(id)}
              rightIcon={
                isWebAuthnIdentity ? <UsbIcon boxSize={5} /> : undefined
              }
            >
              <Text fontSize={{ base: "xl", md: "md" }} casing="uppercase">
                {accountData.name}
              </Text>
            </Button>
          )}
        </HStack>
        {accountData.idDisplayStrings.full && (
          <HStack bgColor="gray.100" rounded="md" px={2} py={1}>
            <Code fontSize={{ base: "sm", md: "xs" }}>
              {accountData.idDisplayStrings.short}
            </Code>
            <CopyToClipboard
              toCopy={accountData.idDisplayStrings.full as string}
            />
          </HStack>
        )}
      </VStack>
      {activeId !== id && (
        <IconButton
          variant="ghost"
          aria-label="edit account"
          icon={<EditIcon boxSize={5} />}
          onClick={() => onEditClick(account)}
        />
      )}
    </MenuItem>
  )
}