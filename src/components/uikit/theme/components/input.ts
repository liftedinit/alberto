import { inputAnatomy as parts } from "@chakra-ui/anatomy"

const defaultProps = {
  variant: "filled",
  rounded: "md",
  focusBorderColor: "teal.300",
}

export const Input = {
  parts: parts.keys,
  defaultProps,
}
