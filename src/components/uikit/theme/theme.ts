import { extendTheme } from "@chakra-ui/react"
import { Button, Heading, Text } from "./components"

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgColor: "brand.white",
        color: "brand.black",
      },
    },
  },
  fonts: {
    heading: "Rubik, sans-serif",
    body: "Rubik, sans-serif",
  },
  components: {
    Button,
    Heading,
    Text,
  },
  colors: {
    "brand.black": "#452E33",
    "brand.white": "#FAF0EA",
  },
})
