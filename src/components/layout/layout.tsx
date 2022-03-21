import React from "react";
import { Grid, GridItem, useBreakpointValue } from "components";
import { AppNav } from "./app-nav";
import { AppMenu } from "./app-menu";
import { GridItemProps } from "@chakra-ui/react";

type LayoutProps = {
  withNav?: boolean;
  withMenu?: boolean;
};

export function Layout({
  withNav = true,
  withMenu = true,
  children,
}: React.PropsWithChildren<LayoutProps>) {
  const templateGridArea = useBreakpointValue({
    base: `'nav' 'main' 'menu'`,
    md: `
    'menu nav'
    'menu main'
    'menu main'`,
  });
  const templateRows = useBreakpointValue({
    base: `minmax(auto, 36px) 1fr auto`,
    md: `minmax(auto, 48px) auto 1fr`,
  });
  const templateColumns = useBreakpointValue({
    base: `1fr`,
    md: `100px 1fr`,
  });
  return (
    <Grid
      templateRows={templateRows}
      templateColumns={templateColumns}
      templateAreas={templateGridArea}
      height="100vh"
    >
      {withNav && (
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
      {React.Children.count(children) === 1 ? (
        <GridItem overflow="auto" gridArea="main" position="relative">
          {children}
        </GridItem>
      ) : (
        children
      )}
      {withMenu && (
        <GridItem gridArea="menu">
          <AppMenu />
        </GridItem>
      )}
    </Grid>
  );
}

Layout.Main = makeLayoutGridItem({ gridArea: "main", overflow: "auto" });
Layout.Menu = makeLayoutGridItem({ gridArea: "menu" });
Layout.Nav = makeLayoutGridItem({ gridArea: "nav", shadow: "md", p: 2 });

function makeLayoutGridItem(defaultGridItemProps: GridItemProps) {
  return function ({ children, ...props }: GridItemProps) {
    return typeof children === "function" ? (
      children({ gridItemprops: defaultGridItemProps })
    ) : (
      <GridItem {...defaultGridItemProps} {...props}>
        {children}
      </GridItem>
    );
  };
}
