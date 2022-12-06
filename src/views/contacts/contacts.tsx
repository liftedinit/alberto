import { Box, Breadcrumb, Container, SlideFade } from "@liftedinit/ui"
import { Layout } from "views"
import { ContactsManagement } from "features/contacts"

export function Contacts() {
  return (
    <Layout.Main>
      <SlideFade in={true}>
        <Container w={{ base: "full", md: "md" }}>
          <Breadcrumb my={4}>
            <Breadcrumb.BreadcrumbItem>
              <Breadcrumb.BreadcrumbLink to="/send" isCurrentPage={!true}>
                Contacts
              </Breadcrumb.BreadcrumbLink>
            </Breadcrumb.BreadcrumbItem>
          </Breadcrumb>
          <Box bgColor="white" p={6} rounded="md" shadow="md">
            <ContactsManagement />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
