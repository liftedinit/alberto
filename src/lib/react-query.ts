import { QueryClient, DefaultOptions } from "react-query"

const queryConfig: DefaultOptions = {
  queries: {
    // useErrorBoundary: true,
    retry: false,
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })
