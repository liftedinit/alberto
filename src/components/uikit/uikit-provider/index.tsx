import { ChakraProvider, ChakraProviderProps } from "@chakra-ui/react";
export function UiKitProvder({ children }: ChakraProviderProps) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
