import React, { ChangeEvent, useRef } from "react"
import {
  AddressBookIcon,
  Button,
  Center,
  HStack,
  IconButton,
  Input,
  InputLeftElement,
  PlusIcon,
  SearchIcon,
  Text,
  VStack,
  useDebounce,
  Divider,
  InputGroup,
  useToast,
} from "@liftedinit/ui"
import {
  UpdateContact,
  ContactsList,
  useContactsList,
  Contact,
  useContactsStore,
} from "features/contacts"

export function ContactsManagement({
  onContactClicked,
}: {
  onContactClicked?: (c: Contact) => void
}) {
  const [searchName, setSearchName] = React.useState("")
  const debouncedSearchName = useDebounce(searchName)
  const { contacts, total } = useContactsList(debouncedSearchName)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const toast = useToast()

  const { updateContact } = useContactsStore()
  const importContacts = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = onLoadEvent => {
      let imported = 0
      let failed = 0
      const contacts: Contact[] = JSON.parse(
        onLoadEvent.target?.result as string,
      )
      contacts.forEach(contact => {
        if (contact.address && contact.name) {
          updateContact(contact.address, contact)
          imported++
        } else {
          failed++
        }
      })
      if (!failed) {
        toast({
          status: "success",
          title: "Import Contacts",
          description: `${imported} contact${imported > 1 ? "s" : ""} imported`,
        })
      } else {
        toast({
          status: "warning",
          title: "Import Contacts",
          description: `
            ${imported} contact${imported > 1 ? "s" : ""} imported,
            ${failed} contact${failed > 1 ? "s" : ""} failed to import
          `,
        })
      }
    }

    changeEvent.target.files && reader.readAsText(changeEvent.target.files?.[0])
  }

  const exportContacts = () => {
    const flat = contacts.map(group => group.children).flat()
    const a = document.createElement("a")
    const file = new Blob([JSON.stringify(flat)], { type: "text/plain" })
    const date = new Date().toISOString().split("T")[0]
    a.href = URL.createObjectURL(file)
    a.download = `contacts_${date}.json`
    a.click()
  }

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
      <Divider my={6} />
      <HStack>
        <InputGroup onClick={() => inputRef.current?.click()}>
          <input onChange={importContacts} type="file" ref={inputRef} hidden />
          <Button variant="outline">Import Contacts</Button>
        </InputGroup>
        <InputGroup onClick={exportContacts}>
          <Button variant="outline" disabled={!total}>
            Export Contacts
          </Button>
        </InputGroup>
      </HStack>
    </>
  )
}
