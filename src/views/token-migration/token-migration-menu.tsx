import { Button, VStack } from "@liftedinit/ui"
import { Link } from "react-router-dom"

export function TokenMigrationMenu() {
  return (
    <VStack data-testid="token-migration-menu">
      <Button
        as={Link}
        to={"new-migration"}
        aria-label={"create-new-migration-btn"}
      >
        Create new migration
      </Button>
      <Button
        as={Link}
        to={"migration-history"}
        aria-label={"view-migration-history-btn"}
      >
        View migration history
      </Button>
    </VStack>
  )
}
