import { Link as RouterLink } from "react-router-dom"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Link,
} from "@liftedinit/ui"

export function MigrationBanner() {
  return (
    <Alert
      status="error"
      maxW={1300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <AlertIcon />
      <AlertTitle>Migrate your tokens today!</AlertTitle>
      <AlertDescription>
        The Lifted Initiative is migrating to a new ledger chain. Please migrate
        your tokens to the new chain{" "}
        <Link
          as={RouterLink}
          to="/token-migration-portal"
          color={"blue.600"}
          fontWeight={"medium"}
        >
          HERE
        </Link>
        .
      </AlertDescription>
    </Alert>
  )
}
