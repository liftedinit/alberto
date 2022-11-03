import React from "react"
import {
  AnonymousIdentity,
  ANON_IDENTITY,
  WebAuthnIdentity,
} from "@liftedinit/many-js"
import { useAccountsStore } from "features/accounts"
import {
  AddressText,
  Box,
  Button,
  Circle,
  ChevronDownIcon,
  EditIcon,
  Flex,
  HStack,
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
  VStack,
  UsbIcon,
} from "shared/components"
import { AddAccountModal } from "./add-account-modal"
import { EditAccountModal } from "./edit-account-modal"
import { Account, AccountId } from "../../types"

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
    [number, Account] | undefined
  >()

  function onEditClick(acct: [number, Account]) {
    setEditAccount(acct)
    onEditModalOpen()
  }

  const isAnonymous = activeAccount?.address === ANON_IDENTITY

  return (
    <Flex alignItems="center" minWidth="100px" mr={2}>
      <Menu autoSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          aria-label="active account menu trigger"
          bgColor="white"
          shadow="md"
        >
          <Text isTruncated>{activeAccount?.name}</Text>
        </MenuButton>
        <MenuList maxW="100vw" zIndex={2}>
          <MenuOptionGroup title="Accounts" />
          <Box overflow="auto" maxHeight="40vh" data-testid="wallet menu list">
            {activeAccount ? (
              <Box overflow="auto" maxHeight="40vh">
                <AccountMenuItem
                  activeId={activeId}
                  account={[activeId, activeAccount]}
                  setActiveId={id => setActiveId(id)}
                  onEditClick={onEditClick}
                />
              </Box>
            ) : null}

            {accounts.map(acc =>
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
            <Button
              data-testid="add wallet btn"
              isFullWidth
              onClick={onAddModalOpen}
            >
              Add Account
            </Button>
          </MenuItem>
        </MenuList>
      </Menu>
      {!isAnonymous && !!activeAccount && (
        <AddressText
          addressText={activeAccount.address!}
          display={{ base: "none", md: "inline-flex" }}
          ms={2}
          textProps={{
            "aria-label": "active wallet address",
          }}
        />
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
  account: [number, Account]
  setActiveId: (id: number) => void
  onEditClick: (a: [number, Account]) => void
}) {
  const id = account[0]
  const isActive = activeId === id
  const accountData = account[1]
  const isWebAuthnIdentity = accountData?.identity instanceof WebAuthnIdentity
  const isAnonymous = accountData?.identity instanceof AnonymousIdentity
  return (
    <MenuItem as={SimpleGrid} columns={3} borderTopWidth={1} spacing={4} py={4}>
      {isActive && <Circle bg="green.400" size="10px" />}
      <VStack align="flex-start" spacing={1} flexGrow={1}>
        <HStack>
          {isActive ? (
            <HStack>
              <Text fontSize={{ base: "xl", md: "md" }}>
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
              <Text
                wordBreak="break-word"
                whiteSpace="pre-wrap"
                fontSize={{ base: "xl", md: "md" }}
                textAlign="left"
              >
                {accountData.name}
              </Text>
            </Button>
          )}
        </HStack>
        {!isAnonymous && (
          <AddressText
            addressText={accountData.address!}
            bgColor={undefined}
            p={0}
          />
        )}
      </VStack>
      {
        <IconButton
          variant="ghost"
          aria-label={`edit account ${accountData.name}`}
          icon={<EditIcon boxSize={5} />}
          onClick={() => onEditClick(account)}
        />
      }
    </MenuItem>
  )
}
