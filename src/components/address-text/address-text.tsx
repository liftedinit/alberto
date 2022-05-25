import React from "react"
import { useQuery } from "react-query"
import { BoxProps, CopyToClipboard, HStack, Text } from "components"
import { Identity } from "many-js"
import { makeShortId } from "helper/common"

export function AddressText({
  identity,
  addressText,
  isFull = false,
  children,
  ...props
}: React.PropsWithChildren<
  {
    addressText?: string
    isFull?: boolean
    identity: Identity | string
  } & BoxProps
>) {
  const text = useAddressText(identity)

  return (
    <HStack
      bgColor="gray.100"
      rounded="md"
      px={2}
      py={1}
      fontFamily="monospace"
      fontSize="md"
      {...props}
    >
      <Text
        aria-label="public address"
        isTruncated
        onCopy={e => {
          e.clipboardData.setData("text/plain", text)
          e.preventDefault()
        }}
      >
        {children ? children : isFull ? text : makeShortId(text)}
      </Text>
      <CopyToClipboard toCopy={text} />
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
