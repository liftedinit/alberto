import { useToast as actualUseToast, UseToastOptions } from "@chakra-ui/react"
const FIVE_SECONDS = 5000

const defaultUseToastOptions: UseToastOptions = {
  duration: FIVE_SECONDS,
  variant: "subtle",
  isClosable: true,
  position: "top",
}

export function useToast() {
  return actualUseToast({
    ...defaultUseToastOptions,
  })
}
