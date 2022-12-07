import React from "react"
import { useForm } from "react-hook-form"
import {
  AlertDialog,
  Button,
  ButtonGroup,
  FieldWrapper,
  Input,
  Modal,
  Text,
  useToast,
  useDisclosure,
  validateAddress,
  VStack,
} from "@liftedinit/ui"
import { useContactsStore } from "features/contacts/store"
import { Contact } from "features/contacts/types"

export function UpdateContact({
  header,
  contact,
  children,
}: {
  header?: string
  contact?: Contact
  children: (onOpen: () => void) => void
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { byId, updateContact, deleteContact } = useContactsStore(
    ({ byId, updateContact, deleteContact }) => ({
      byId,
      updateContact,
      deleteContact,
    }),
  )

  function onSubmit(c: Contact) {
    if (contact) {
      if (c.address !== contact.address) {
        if (byId.has(c.address)) {
          return toast({
            status: "warning",
            title: "Contact",
            description: "Contact with this address already exists",
          })
        }
        deleteContact(contact.address)
      }
      updateContact(c.address, c)
      toast({
        status: "success",
        title: "Contact",
        description: "Contact was updated",
      })
      return onClose()
    }
    if (byId.has(c.address)) {
      return toast({
        status: "warning",
        title: "Create Contact",
        description: "Address already exists",
      })
    }
    updateContact(c.address, c)
    toast({
      status: "success",
      title: "Contact",
      description: "Contact was created",
    })
    onClose()
  }

  return (
    <>
      {children(onOpen)}
      <ContactFormModal
        header={header}
        contact={contact}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}

const defaultValues = {
  name: "",
  address: "",
}
export function ContactFormModal({
  isOpen,
  onClose,
  contact,
  header,
  footer,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  header?: string
  footer?: React.ReactNode
  contact?: Contact
  onSubmit: (c: Contact) => void
}) {
  const form = useForm({ defaultValues })

  React.useEffect(() => {
    if (isOpen && !!contact) {
      form.reset({ name: contact.name, address: contact.address })
    }
    !isOpen && form.reset(defaultValues)
  }, [isOpen, contact, form])

  return (
    <Modal
      header={header ?? "Contact"}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        footer ?? (
          <Button
            w={{ base: "full", md: "auto" }}
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        )
      }
    >
      <Modal.Body>
        <VStack>
          <FieldWrapper
            isRequired
            label="Name"
            error={form?.formState?.errors?.name?.message}
          >
            <Input
              {...form.register("name", {
                required: "Name is required",
                maxLength: {
                  value: 128,
                  message: "Maximum of 128 characters allowed",
                },
              })}
            />
          </FieldWrapper>
          <FieldWrapper
            isRequired
            label="Address"
            error={form?.formState?.errors?.address?.message}
          >
            <Input
              isTruncated
              fontFamily="monospace"
              {...form.register("address", {
                required: "Address is required",
                validate: {
                  validateAddress,
                },
              })}
            />
          </FieldWrapper>
        </VStack>
      </Modal.Body>
    </Modal>
  )
}

export function RemoveContactDialog({
  contact,
  children,
}: {
  contact: Contact
  children: (onOpen: () => void) => void
}) {
  const toast = useToast()
  const deleteContact = useContactsStore(s => s.deleteContact)
  const cancelRef = React.useRef(null)
  const { onOpen, isOpen, onClose } = useDisclosure()

  function onRemove(e: React.FormEvent<HTMLButtonElement>) {
    e.stopPropagation()
    deleteContact(contact!.address)
    toast({
      status: "success",
      title: "Contact",
      description: "Contact was removed",
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
          <Text>Remove this contact?</Text>
          <Text fontSize="lg" fontWeight="medium">
            {contact!.name}
          </Text>
          <Text fontSize="md" fontFamily="monospace">
            {contact!.address}
          </Text>
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
