import React, { Dispatch } from "react"
import { Grid, GridItem, GridItemProps, useBreakpointValue } from "components"
import { AppNav } from "./app-nav"
import { AppMenu } from "./app-menu"

type LayoutState = {
  hideNav?: boolean
  hideMenu?: boolean
}

type LayoutContextState = [state: LayoutState, setState: Dispatch<LayoutState>]

const LayoutContext = React.createContext<LayoutContextState>([
  { hideNav: false, hideMenu: false },
  s => ({ ...s }),
])

export function Layout({ children }: React.PropsWithChildren<{}>) {
  const layoutContext = React.useReducer(
    (state: LayoutState, payload: { [k in keyof LayoutState]: boolean }) => {
      return { ...state, ...payload }
    },
    { hideNav: false, hideMenu: false },
  )
  const { hideNav, hideMenu } = layoutContext[0]

  const templateGridArea = useBreakpointValue({
    base: `'nav' 'main' 'menu'`,
    md: `
    'menu nav'
    'menu main'
    'menu main'`,
  })
  const templateRows = useBreakpointValue({
    base: `minmax(auto, 36px) 1fr auto`,
    md: `minmax(auto, 48px) auto 1fr`,
  })
  const templateColumns = useBreakpointValue({
    base: `1fr`,
    md: `100px 1fr`,
  })

  return (
    <LayoutContext.Provider value={layoutContext}>
      <Grid
        templateRows={templateRows}
        templateColumns={templateColumns}
        templateAreas={templateGridArea}
        height="100vh"
      >
        {!hideNav && (
          <GridItem
            gridArea="nav"
            shadow="md"
            py={4}
            px={4}
            display="flex"
            alignItems="center"
          >
            <AppNav />
          </GridItem>
        )}
        {children}
        {!hideMenu && (
          <GridItem gridArea="menu">
            <AppMenu />
          </GridItem>
        )}
      </Grid>
    </LayoutContext.Provider>
  )
}

Layout.Main = makeLayoutGridItem({ gridArea: "main", overflow: "auto" })
Layout.Menu = makeLayoutGridItem({ gridArea: "menu" })
Layout.Nav = makeLayoutGridItem({
  gridArea: "nav",
  shadow: "md",
  p: 2,
  display: "flex",
  alignItems: "center",
})

function makeLayoutGridItem(defaultGridItemProps: GridItemProps) {
  return function ({ children, ...props }: GridItemProps) {
    return typeof children === "function" ? (
      children({ gridItemprops: defaultGridItemProps })
    ) : (
      <GridItem {...defaultGridItemProps} {...props}>
        {children}
      </GridItem>
    )
  }
}

export function useLayoutContext() {
  return React.useContext(LayoutContext)
}
