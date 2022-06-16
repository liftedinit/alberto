import React from "react"
import { ChevronRightIcon, Flex, useDisclosure } from "components"

export function BaseTxnDetails({ children }: React.PropsWithChildren<{}>) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex justifyContent="flex-end">
      <ChevronRightIcon cursor="pointer" onClick={onOpen} />
      {isOpen &&
        typeof children === "function" &&
        children({ isOpen, onClose })}
    </Flex>
  )
}
