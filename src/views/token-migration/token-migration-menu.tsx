import { Box, Button, HStack, Text } from "@liftedinit/ui"
import { Link } from "react-router-dom"

export function TokenMigrationMenu() {
  return (
    <Box p={4}>
      <Text mb={4}>
        Migrating your tokens to the MANIFEST chain is easy. What would you like
        to do?
      </Text>
      <HStack
        justifyContent={"center"}
        spacing={8}
        data-testid="token-migration-menu"
      >
        <Button
          as={Link}
          to={"new-migration"}
          aria-label={"create-new-migration-btn"}
          size={"lg"}
          colorScheme="brand.teal"
        >
          I want to migrate my tokens
        </Button>
        <Button
          as={Link}
          to={"migration-history"}
          aria-label={"view-migration-history-btn"}
          size={"lg"}
          colorScheme="brand.teal"
        >
          I want to view my migration history
        </Button>
      </HStack>
    </Box>
  )
}
