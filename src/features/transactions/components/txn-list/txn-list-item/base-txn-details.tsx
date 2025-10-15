import React from "react"
import {
  ChevronRightIcon,
  Flex,
  IconButton,
  useDisclosure,
} from "@liftedinit/ui"

type RenderDetails = (args: {
  isOpen: boolean
  onClose: () => void
}) => React.ReactNode

type BaseTxnDetailsProps = {
  children: React.ReactNode | RenderDetails
}

function isRenderDetails(
  child: BaseTxnDetailsProps["children"],
): child is RenderDetails {
  return typeof child === "function"
}

export function BaseTxnDetails({ children }: BaseTxnDetailsProps) {
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
        (isRenderDetails(children) ? children({ isOpen, onClose }) : children)}
    </Flex>
  )
}
