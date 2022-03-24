import { useBreakpointValue } from "components";

export function useIsBaseBreakpoint() {
  return useBreakpointValue({ base: true, md: false });
}
