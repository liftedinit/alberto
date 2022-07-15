import { Box, Flex, Text } from "components"

export function OptionCard({
  children,
  label,
  description,
}: React.PropsWithChildren<{ label: string; description?: string }>) {
  return (
    <Flex
      py={3}
      px={4}
      rounded="md"
      shadow="md"
      gap={4}
      w="full"
      alignItems="center"
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
