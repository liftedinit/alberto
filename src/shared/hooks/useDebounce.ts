import React from "react"

export function useDebounce<T>(value: T, delay: number = 200) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(id)
    }
  }, [value, delay])
  return debouncedValue
}
