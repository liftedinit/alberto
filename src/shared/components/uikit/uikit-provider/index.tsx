import "@fontsource/roboto/100.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "@fontsource/roboto/900.css"
import { ChakraProvider, ChakraProviderProps } from "@chakra-ui/react"
import { theme } from "../theme"

export function UiKitProvder({ children }: ChakraProviderProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  )
}
