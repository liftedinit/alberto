import React from "react"
import {
  ChevronRightIcon,
  Flex,
  IconButton,
  useDisclosure,
} from "shared/components"

export function BaseTxnDetails({ children }: React.PropsWithChildren<{}>) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex justifyContent="flex-end">
      <IconButton
        aria-label="view transaction details"
        onClick={onOpen}
        variant="link"
        size="sm"
        icon={<ChevronRightIcon />}
      />
      {isOpen &&
        typeof children === "function" &&
        children({ isOpen, onClose })}
    </Flex>
  )
}
