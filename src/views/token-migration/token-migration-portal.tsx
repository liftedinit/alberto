import { Box, Breadcrumb, Container, SlideFade } from "@liftedinit/ui"
import { Layout } from "views"
import { Outlet, useLocation } from "react-router-dom"

function TokenMigrationPortalHeader() {
  const location = useLocation()
  const path = location.pathname.split("/")
  const isNewMigration = path.includes("new-migration")
  const isMigrationHistory = path.includes("migration-history")

  return (
    <Breadcrumb my={4}>
      <Breadcrumb.BreadcrumbItem>
        <Breadcrumb.BreadcrumbLink
          to="/token-migration-portal"
          isCurrentPage={!isNewMigration}
        >
          Token Migration Portal
        </Breadcrumb.BreadcrumbLink>
      </Breadcrumb.BreadcrumbItem>
      {isNewMigration && (
        <Breadcrumb.BreadcrumbItem isCurrentPage>
          <Breadcrumb.BreadcrumbLink to="/token-migration-portal/new-migration">
            Create New Migration
          </Breadcrumb.BreadcrumbLink>
        </Breadcrumb.BreadcrumbItem>
      )}
      {isMigrationHistory && (
        <Breadcrumb.BreadcrumbItem isCurrentPage>
          <Breadcrumb.BreadcrumbLink to="/token-migration-portal/migration-history">
            Migration History
          </Breadcrumb.BreadcrumbLink>
        </Breadcrumb.BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}

export function TokenMigrationPortal() {
  return (
    <Layout.Main>
      <SlideFade in>
        <Container
          maxW={{
            base: "auto",
            sm: "container.sm",
            md: "container.md",
            lg: "container.lg",
            xl: "container.xl",
          }}
        >
          <Box my={4}>
            <TokenMigrationPortalHeader />
          </Box>
          <Box rounded="md" shadow="md" bgColor="white" p={4}>
            <Outlet />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
