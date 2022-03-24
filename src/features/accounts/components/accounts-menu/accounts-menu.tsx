import { FiChevronDown } from "react-icons/fi"
import { AiOutlineUser } from "react-icons/ai"
import { useAccountsStore } from "features/accounts"
import {
  Box,
  Button,
  Circle,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useDisclosure,
} from "components"
import { AddAccountModal } from "./add-account-modal"

export function AccountsMenu() {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const { activeAccount, accounts, activeId } = useAccountsStore(s => ({
    accounts: Array.from(s.byId),
    activeAccount: s.byId.get(s.activeId),
    activeId: s.activeId,
  }))

  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
          <HStack alignItems="center">
            <Icon as={AiOutlineUser} w={5} h={5} />
            <Text fontSize="sm" casing="uppercase" fontWeight="medium">
              {activeAccount?.name}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList>
          {activeAccount ? (
            <Box overflow="auto" maxHeight="40vh">
              <MenuItem>
                <HStack>
                  <Circle bg="green.400" size="10px" />
                  <Text lineHeight="normal" casing="uppercase">
                    {activeAccount?.name}
                  </Text>
                </HStack>
              </MenuItem>
            </Box>
          ) : null}
          {accounts.map(([id, account]) =>
            id === activeId ? null : (
              <MenuItem key={id}>
                <Text casing="uppercase">{account?.name}</Text>
              </MenuItem>
            ),
          )}
          <MenuDivider mt={0} />
          <MenuItem
            pt={3}
            as={Box}
            display="flex"
            alignItems="center"
            _hover={{ backgroundColor: "transparent" }}
            borderTopWidth={1}
          >
            <Button isFullWidth onClick={onToggle}>
              Add Account
            </Button>
          </MenuItem>
        </MenuList>
        <AddAccountModal isOpen={isOpen} onClose={onClose} />
      </Menu>
    </Box>
  )
}
