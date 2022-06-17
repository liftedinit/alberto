import React from "react"
import { useQuery } from "react-query"
import { BoxProps, CopyToClipboard, HStack, Text } from "components"
import { Identity } from "many-js"
import { makeShortId } from "helper/common"

export function AddressText({
  addressText,
  isFullText = false,
  children,
  textProps,
  iconProps,
  ...props
}: React.PropsWithChildren<
  {
    addressText: string
    isFullText?: boolean
    textProps?: Record<string, any>
    iconProps?: Record<string, any>
  } & BoxProps
>) {
  return (
    <HStack
      bgColor="gray.100"
      rounded="md"
      px={2}
      py={1}
      fontSize="md"
      {...props}
    >
      <Text
        fontFamily="monospace"
        aria-label="public address"
        isTruncated
        title={addressText}
        onCopy={e => {
          e.clipboardData.setData("text/plain", addressText)
          e.preventDefault()
        }}
        {...textProps}
      >
        {children
          ? children
          : isFullText
          ? addressText
          : makeShortId(addressText)}
      </Text>
      <CopyToClipboard toCopy={addressText} iconProps={iconProps} />
    </HStack>
  )
}

export function useAddressText(i: Identity | string) {
  const q = useQuery({
    queryKey: ["address", i],
    queryFn: async () => {
      if (i instanceof Identity) {
        return (await i.getAddress()).toString()
      }
      return typeof i === "string" ? i : ""
    },
  })
  return q?.data ?? ""
}
