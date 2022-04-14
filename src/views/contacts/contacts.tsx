import { Box, Container, Heading, Layout, SlideFade } from "components"
import { ContactsManagement } from "features/contacts"

export function Contacts() {
  return (
    <Layout.Main>
      <SlideFade in={true}>
        <Container w={{ base: "full", md: "container.xl" }}>
          <Heading mb={3} size="lg">
            Contacts
          </Heading>
          <Box bgColor="white" p={6} rounded="md" shadow="md">
            <ContactsManagement />
          </Box>
        </Container>
      </SlideFade>
    </Layout.Main>
  )
}
