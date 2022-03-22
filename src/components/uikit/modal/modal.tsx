import {
  Modal as BaseModal,
  ModalProps,
  ModalOverlay as BaseModalOverlay,
  ModalContent as BaseModalContent,
  ModalHeader as BaseModalHeader,
  ModalFooter as BaseModalFooter,
  ModalBody as BaseModalBody,
  ModalCloseButton as BaseModalCloseButton,
} from "@chakra-ui/react"
import React from "react"

export function Modal({
  header,
  footer,
  children,
  ...props
}: ModalProps & { header?: string; footer?: React.ReactNode }) {
  return (
    <BaseModal {...props}>
      <BaseModalOverlay />
      <BaseModalContent>
        {header && <BaseModalHeader>{header}</BaseModalHeader>}
        <BaseModalCloseButton />
        <BaseModalBody>{children}</BaseModalBody>
        {footer && <BaseModalFooter>{footer}</BaseModalFooter>}
      </BaseModalContent>
    </BaseModal>
  )
}

Modal.Modal = BaseModal
Modal.Overlay = BaseModalOverlay
Modal.Content = BaseModalContent
Modal.Header = BaseModalHeader
Modal.Footer = BaseModalFooter
Modal.Body = BaseModalBody
Modal.CloseButton = BaseModalCloseButton
