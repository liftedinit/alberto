import { extendTheme } from "@chakra-ui/react"
import { Button, Heading, Text, Textarea, Tabs, Input } from "./components"

export const theme = extendTheme({
  styles: {
    global: {
      "html,body,#root": {
        bgColor: "brand.white",
        color: "brand.black",
        height: "100%",
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
    Input,
    Text,
    Textarea,
    Tabs,
  },
  colors: {
    "brand.black": "#452E33",
    "brand.white": "#FAF0EA",
    "brand.teal": {
      "50": "#EBF9F7",
      "100": "#C7EFEA",
      "200": "#A3E5DC",
      "300": "#80DBCF",
      "400": "#5CD1C1",
      "500": "#38C7B4",
      "600": "#2D9F90",
      "700": "#22776C",
      "800": "#165048",
      "900": "#0B2824",
    },
    "brand.brown": {
      "50": "#ffeeea",
      "100": "#e4d5ce",
      "200": "#cdbab1",
      "300": "#b89e94",
      "400": "#a28376",
      "500": "#89695d",
      "600": "#6b5247",
      "700": "#4e3a32",
      "800": "#31221d",
      "900": "#160a00",
    },
  },
})
