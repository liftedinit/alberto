import React from "react"
import { Modal, useDisclosure } from "components"
import { ContactsManagement } from "../contacts-management"
import { Contact } from "../../types"

type Props = {
  onContactClicked: (onClose: () => void, c: Contact) => void
  children: (onOpen: () => void) => void
}

export function ContactSelector({ onContactClicked, children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {children(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        footer={<></>}
        header="Contacts"
        scrollBehavior="inside"
      >
        <Modal.Body pt={0}>
          <ContactsManagement
            onContactClicked={(c: Contact) => {
              onContactClicked(onClose, c)
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}
