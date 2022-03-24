import { QueryClient, DefaultOptions } from "react-query"

const queryConfig: DefaultOptions = {
  queries: {
    retry: false,
  },
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })
