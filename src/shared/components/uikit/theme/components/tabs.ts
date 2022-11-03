import { tabsAnatomy as parts } from "@chakra-ui/anatomy"

export const Tabs = {
  parts: parts.keys,
  baseStyle: {
    tab: {
      fontWeight: "normal",
      _selected: {
        fontWeight: "medium",
      },
    },
  },
  defaultProps: {
    colorScheme: "brand.teal",
  },
}
