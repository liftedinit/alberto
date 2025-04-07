import { useQuery } from "react-query"
import env from "@beam-australia/react-env"

const TALIB_URL = env("TALIB_URL")

// Separate fetch function for reusability
const fetchMigrationWhitelist = async () => {
  const url = new URL("migrations-whitelist", TALIB_URL)
  console.log(`Fetching migration whitelist from ${url}`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}

export function useMigrationWhitelist() {
  const {
    data: whitelist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["migrationWhitelist"],
    queryFn: fetchMigrationWhitelist,
  })

  return { whitelist, isLoading, error }
}
