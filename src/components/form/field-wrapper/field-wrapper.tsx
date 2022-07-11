import React from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "components"

export type FieldWrapperProps = {
  label?: React.ReactNode
  children: React.ReactNode
  error?: string | undefined
  description?: string
}

export function FieldWrapper(
  props: FieldWrapperProps & Omit<FormControlProps, "label">,
) {
  const { label, description, error, children, ...restProps } = props

  return (
    <FormControl isInvalid={Boolean(error)} {...restProps}>
      {label &&
        (typeof label === "function" ? (
          label()
        ) : (
          <FormLabel>{label}</FormLabel>
        ))}
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {description && <FormHelperText>{description}</FormHelperText>}
    </FormControl>
  )
}
