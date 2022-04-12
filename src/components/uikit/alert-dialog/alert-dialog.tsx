import React from "react"
import {
  AlertDialog as BaseDialog,
  AlertDialogProps,
  AlertDialogBody as BaseBody,
  AlertDialogFooter as BaseFooter,
  AlertDialogHeader as BaseHeader,
  AlertDialogContent as BaseContent,
  AlertDialogOverlay as BaseOverlay,
} from "@chakra-ui/react"

export function AlertDialog({
  isOpen,
  leastDestructiveRef,
  onClose,
  footer,
  header,
  children,
}: AlertDialogProps & { header: React.ReactNode; footer: React.ReactNode }) {
  return (
    <BaseDialog
      isOpen={isOpen}
      leastDestructiveRef={leastDestructiveRef}
      onClose={onClose}
    >
      <BaseOverlay>
        <BaseContent>
          {header ? (
            <BaseHeader fontSize="lg" fontWeight="bold">
              {header}
            </BaseHeader>
          ) : null}

          <BaseBody>{children}</BaseBody>

          {footer ? <BaseFooter>{footer}</BaseFooter> : null}
        </BaseContent>
      </BaseOverlay>
    </BaseDialog>
  )
}

AlertDialog.BaseAlertDialog = BaseDialog
AlertDialog.Overlay = BaseOverlay
AlertDialog.Content = BaseContent
AlertDialog.Header = BaseHeader
AlertDialog.Body = BaseBody
AlertDialog.Footer = BaseFooter
