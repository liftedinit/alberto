import { useToast as actualUseToast, UseToastOptions } from "@chakra-ui/react"
const THREE_SECONDS = 3000

const defaultUseToastOptions: UseToastOptions = {
  duration: THREE_SECONDS,
  variant: "left-accent",
  isClosable: true,
  position: "top",
}

export function useToast() {
  return actualUseToast({
    ...defaultUseToastOptions,
  })
}
