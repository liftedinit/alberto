import { HStack, Text } from "components"

export function TxnExpireText({
  hours,
  minutes,
  seconds,
}: {
  hours?: number | string
  minutes?: number | string
  seconds?: number | string
}) {
  return (
    <HStack>
      {hours ? (
        <Text as="span" fontWeight="medium">
          {hours}h
        </Text>
      ) : null}
      {minutes ? (
        <Text as="span" fontWeight="medium">
          {minutes}m
        </Text>
      ) : null}
      {seconds ? (
        <Text as="span" fontWeight="medium">
          {seconds}s
        </Text>
      ) : null}
    </HStack>
  )
}
