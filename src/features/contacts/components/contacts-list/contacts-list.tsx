import {
  Box,
  CloseIcon,
  EditIcon,
  HStack,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
  StackDivider,
  UserIcon,
  VStack,
  AddressText,
} from "components"
import { Contact } from "../../types"
import { RemoveContactDialog, UpdateContact } from "../update-contact"

type Props = {
  contacts: { name: string; children: Contact[] }[]
  onContactClicked?: (c: Contact) => void
}

export function ContactsList({ contacts, onContactClicked }: Props) {
  return (
    <List spacing={2} position="relative">
      {contacts.map(group => {
        return (
          <ListItem key={group.name} role="group">
            <Box
              bgColor="gray.50"
              px={4}
              position="sticky"
              top={0}
              py={1}
              zIndex={1}
            >
              <Heading
                color="blackAlpha.600"
                textTransform="uppercase"
                size="md"
                lineHeight="normal"
              >
                {group.name}
              </Heading>
            </Box>
            <VStack spacing={0} divider={<StackDivider />}>
              {group.children.map(c => {
                return (
                  <ContactListItem
                    onClick={onContactClicked}
                    key={c.address}
                    contact={c}
                  />
                )
              })}
            </VStack>
          </ListItem>
        )
      })}
    </List>
  )
}

function ContactListItem({
  contact,
  onClick,
}: {
  contact: Contact
  onClick?: (c: Contact) => void
}) {
  return (
    <HStack
      aria-label="contact list item"
      w="full"
      px={4}
      py={3}
      onClick={() => onClick?.(contact)}
      cursor={onClick ? "pointer" : "inherit"}
      _hover={{ bgColor: "gray.50" }}
    >
      <UserIcon boxSize={7} color="blackAlpha.400" />
      <VStack alignItems="flex-start" spacing={0} flexGrow={1}>
        <Text fontWeight="medium" wordBreak="break-word">
          {contact.name}
        </Text>
        <AddressText
          addressText={contact?.address}
          bgColor={undefined}
          px={0}
          py={0}
          fontFamily="monospace"
          fontSize="md"
        />
      </VStack>
      <HStack>
        <UpdateContact contact={contact} header="Update Contact">
          {onOpen => {
            return (
              <IconButton
                size="sm"
                aria-label="edit contact"
                onClick={e => {
                  e.stopPropagation()
                  onOpen()
                }}
                rounded="full"
                icon={<EditIcon boxSize={5} />}
              />
            )
          }}
        </UpdateContact>
        <RemoveContactDialog contact={contact}>
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
        </RemoveContactDialog>
      </HStack>
    </HStack>
  )
}
