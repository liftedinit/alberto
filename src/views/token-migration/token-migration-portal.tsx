import { Box, Breadcrumb, Container, SlideFade } from "@liftedinit/ui"
import { Layout } from "views"
import { Outlet, useLocation, useParams } from "react-router-dom"
function BreadcrumbItem({
  path,
  label,
}: Readonly<{ path: string; label: string }>) {
  const location = useLocation()
  const startsWith = location.pathname.startsWith(path)
  const isCurrentPage = location.pathname === path

  // If there's no match, don't render anything
  if (!startsWith) {
    return null
  }

  return (
    <Breadcrumb.BreadcrumbItem key={path} isCurrentPage={isCurrentPage}>
      <Breadcrumb.BreadcrumbLink to={path}>{label}</Breadcrumb.BreadcrumbLink>
    </Breadcrumb.BreadcrumbItem>
  )
}

function TokenMigrationPortalHeader() {
  const { eventId } = useParams()

  const breadcrumbs = [
    { path: "/token-migration-portal", label: "Token Migration Portal" },
    {
      path: "/token-migration-portal/new-migration",
      label: "Create New Migration",
    },
    {
      path: "/token-migration-portal/migration-history",
      label: "Migration History",
    },
    {
      path: `/token-migration-portal/migration-history/${eventId}`,
      label: `${eventId}`,
    },
  ]

  return (
    <Breadcrumb my={4} data-testid={"token-migration-portal-header-breadcrumb"}>
      {breadcrumbs.map(({ path, label }) => BreadcrumbItem({ path, label }))}
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
