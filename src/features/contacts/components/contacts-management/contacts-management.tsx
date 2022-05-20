import React from "react"
import {
  AddressBookIcon,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SearchIcon,
  Text,
  VStack,
} from "components"
import {
  UpdateContact,
  ContactsList,
  useContactsList,
  Contact,
} from "features/contacts"
import { useDebounce } from "hooks"

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
                return <Button onClick={onOpen}>Add</Button>
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
