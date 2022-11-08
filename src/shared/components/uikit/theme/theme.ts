import { extendTheme } from "@chakra-ui/react"
import { Button, Heading, Text, Textarea, Tabs, Input } from "./components"

export const theme = extendTheme({
  styles: {
    global: {
      "html,body,#root": {
        bgColor: "brand.merlot.50",
        color: "brand.black",
        height: "100%",
      },
    },
  },
  fonts: {
    heading: "Roboto, sans-serif",
    body: "Roboto, sans-serif",
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
      "50": "#F0F9F8",
      "100": "#D2EEEB",
      "200": "#96D8D1",
      "300": "#4BBCB0",
      "400": "#1EAB9C",
      "500": "#00A08F",
      "600": "#007165",
      "700": "#005E54",
      "800": "#004B43",
      "900": "#003832",
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
    "brand.merlot": {
      "50": "#F5F2F3",
      "100": "#E0DADC",
      "200": "#C1B5B8",
      "300": "#A29095",
      "400": "#8D777E",
      "500": "#785E66",
      "600": "#64464F",
      "700": "#593943",
      "800": "#4F2D37",
      "900": "#3C222A",
    },
  },
})
