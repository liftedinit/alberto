import "@fontsource/rubik/300.css"
import "@fontsource/rubik/400.css"
import "@fontsource/rubik/500.css"
import "@fontsource/rubik/600.css"
import "@fontsource/rubik/700.css"
import "@fontsource/rubik/800.css"
import { ChakraProvider, ChakraProviderProps } from "@chakra-ui/react"
import { theme } from "../theme"

export function UiKitProvder({ children }: ChakraProviderProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
