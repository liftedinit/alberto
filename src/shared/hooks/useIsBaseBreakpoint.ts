import { useBreakpointValue } from "shared/components"

export function useIsBaseBreakpoint() {
  return useBreakpointValue({ base: true, md: false })
}
