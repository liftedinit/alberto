import { Box, Breadcrumb, Container, SlideFade } from "@liftedinit/ui"
import { Layout } from "views"
import { MigrationForm } from "../../features/token-migration"

export function TokenMigration() {
  return (
    <Layout.Main>
      <SlideFade in>
        <Container
          maxW={{
            base: "auto",
            md: "container.sm",
            lg: "container.md",
            xl: "container.lg",
          }}
        >
          <Breadcrumb my={4}>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink
                to="/token-migration"
                isCurrentPage={!true}
              >
                Token Migration
              </Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb>
          <Box shadow="md" rounded="md" py={8} px={6} bgColor="white">
            <MigrationForm />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
