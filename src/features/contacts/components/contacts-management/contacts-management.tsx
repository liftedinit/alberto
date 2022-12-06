import React from "react"
import {
  AddressBookIcon,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  PlusIcon,
  SearchIcon,
  Text,
  VStack,
  useDebounce,
} from "@liftedinit/ui"
import {
  UpdateContact,
  ContactsList,
  useContactsList,
  Contact,
} from "features/contacts"

export function ContactsManagement({
  onContactClicked,
}: {
  onContactClicked?: (c: Contact) => void
}) {
  const [searchName, setSearchName] = React.useState("")
  const debouncedSearchName = useDebounce(searchName)
  const { contacts, total } = useContactsList(debouncedSearchName)

  return (
    <>
      {!total && (
        <Center>
          <VStack>
            <AddressBookIcon color="gray.300" boxSize="16" />
            <Text fontWeight="medium">No contacts found</Text>
            <UpdateContact header="Create Contact">
              {onOpen => (
                <Button onClick={onOpen} variant="link">
                  Add contacts
                </Button>
              )}
            </UpdateContact>
          </VStack>
        </Center>
      )}
      {Boolean(total) && (
        <>
          <HStack mb={3} mt={1}>
            <InputGroup>
              <InputLeftElement children={<SearchIcon />} zIndex={0} />
              <Input
                name="name"
                autoFocus
                placeholder="Search name"
                onChange={e => setSearchName(e.target.value)}
              />
            </InputGroup>
            <UpdateContact header="Create Contact">
              {onOpen => {
                return (
                  <IconButton
                    rounded="full"
                    size="sm"
                    aria-label="import account"
                    icon={<PlusIcon boxSize={6} />}
                    onClick={onOpen}
                  />
                )
              }}
            </UpdateContact>
          </HStack>
          <ContactsList
            onContactClicked={onContactClicked}
            contacts={contacts}
          />
        </>
      )}
    </>
  )
}
