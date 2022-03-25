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
}: ModalProps & {
  header?: string
  footer?: React.ReactNode
  "data-testid"?: string
}) {
  return (
    <BaseModal {...props}>
      <BaseModalOverlay />
      <BaseModalContent
        {...(props["data-testid"]
          ? { "data-testid": props["data-testid"] }
          : {})}
      >
        {header && <BaseModalHeader>{header}</BaseModalHeader>}
        <BaseModalCloseButton />
        {children}
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
