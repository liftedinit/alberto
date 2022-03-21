import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Box,
  ContainerWrapper,
  Flex,
  Heading,
  Layout,
  SimpleGrid,
  Text,
} from "components";
import { useIsBaseBreakpoint } from "hooks";

export function AddAccount() {
  const isBase = useIsBaseBreakpoint();
  console.log({ isBase });

  return (
    <Layout withNav={false}>
      <Layout.Nav>
        <Flex justify="flex-end">
          <Button variant="link" as={RouterLink} to="/accounts">
            <Text>Back</Text>
          </Button>
        </Flex>
      </Layout.Nav>
      <Layout.Main py={4} px={isBase ? 4 : 0}>
        <ContainerWrapper {...(isBase ? {} : { maxW: "container.lg" })}>
          <Heading fontWeight="semibold" mb={4} size="lg">
            Add an account
          </Heading>
          <SimpleGrid columns={isBase ? 1 : 3} spacing={4}>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md" fontWeight="semibold">
                Create A New Account
              </Heading>
              <Text mb={8}>Some description of how this works maybe?</Text>
              <Button colorScheme="green" isFullWidth>
                CREATE NEW
              </Button>
            </Box>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md" fontWeight="semibold">
                Import Seed Words
              </Heading>
              <Text mb={8}>Some description of how this works maybe?</Text>
              <Button colorScheme="green" isFullWidth>
                IMPORT
              </Button>
            </Box>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md" fontWeight="semibold">
                Import PEM File
              </Heading>
              <Text mb={8}>Some description of how this works maybe?</Text>
              <Button colorScheme="green" isFullWidth>
                IMPORT
              </Button>
            </Box>
          </SimpleGrid>
        </ContainerWrapper>
      </Layout.Main>
    </Layout>
  );
}
