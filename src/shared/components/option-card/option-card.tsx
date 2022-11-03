import React from "react"
import { Box, Flex, Text } from "shared/components"

export function OptionCard({
  children,
  label,
  description,
  onClick,
}: React.PropsWithChildren<{
  label: string
  description?: string
  onClick?: (e: React.SyntheticEvent) => void
}>) {
  return (
    <Flex
      py={3}
      px={4}
      rounded="md"
      shadow="md"
      gap={4}
      w="full"
      alignItems="center"
      _hover={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
      <Flex flexDir="column" gap={1}>
        <Box>
          <Text fontWeight="medium">{label}</Text>
        </Box>
        {description ? <Box>{description}</Box> : null}
      </Flex>
    </Flex>
  )
}
