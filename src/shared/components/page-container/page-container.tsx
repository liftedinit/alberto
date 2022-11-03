import { ContainerProps, Container } from "shared/components"
import React from "react"

export function PageContainer({
  children,
}: React.PropsWithChildren<ContainerProps>) {
  const [containerProps] = usePageContainerProvider()
  return <Container {...containerProps}>{children}</Container>
}

const PageContainerContext = React.createContext<
  [state: ContainerProps, setState: React.Dispatch<ContainerProps>]
>([{}, s => ({ ...s })])

export function usePageContainerProvider() {
  return React.useContext(PageContainerContext)
}

export function PageContainerProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const ctx = React.useReducer(
    (state: ContainerProps, payload: ContainerProps) => {
      return {
        ...state,
        ...payload,
      }
    },
    {},
  )
  return (
    <PageContainerContext.Provider value={ctx}>
      {children}
    </PageContainerContext.Provider>
  )
}
