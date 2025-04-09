import { useQueries } from "react-query"
import env from "@beam-australia/react-env"

const TALIB_ROOT_URL = env("TALIB_ROOT_URL")

// Separate fetch function for reusability
const fetchMigrationWhitelist = async (address: string) => {
  const response = await fetch(
    `${TALIB_ROOT_URL}migrations-whitelist/${address}`,
  )
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

export function useMigrationWhitelist(addresses: string[]) {
  // The ordering is guaranteed to be the same as the order of the addresses
  // results[i] is the result of the query for addresses[i]
  const results = useQueries({
    queries: addresses.map(address => ({
      queryKey: ["migration-whitelist", address],
      queryFn: () => fetchMigrationWhitelist(address),
    })),
  })

  const isLoading = results.some(result => result.isLoading)
  const error = results.find(result => result.isError)?.error
  const data = addresses.filter(
    (_, index) => !results[index].isLoading && results[index].data === true,
  )

  return { data, isLoading, error }
}
