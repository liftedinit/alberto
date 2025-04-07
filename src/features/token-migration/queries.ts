import { useState, useEffect, useCallback } from "react"
import env from "@beam-australia/react-env"

const TALIB_URL = env("TALIB_URL")
const MAX_RETRIES = 3

export function useMigrationWhitelist() {
  const [whitelist, setWhitelist] = useState<null | string[]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchWhitelist = useCallback(async () => {
    try {
      const url = new URL("migrations-whitelist", TALIB_URL)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        setWhitelist(data)
        setError(null)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Unable to fetch migration whitelist:", error)

      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount, 30000) // Exponential backoff
        console.log(
          `Retrying in ${delay}ms (attempt ${
            retryCount + 1
          } of ${MAX_RETRIES})`,
        )

        setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, delay)

        return
      }

      setError((error as Error).message)
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setIsLoading(false)
      }
    }
  }, [retryCount])

  useEffect(() => {
    fetchWhitelist()
  }, [fetchWhitelist])

  return { whitelist, isLoading, error }
}
