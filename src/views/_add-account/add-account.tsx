import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Box,
  ContainerWrapper,
  Flex,
  Grid,
  GridItem,
  GridItemProps,
  HStack,
  Heading,
  Layout,
  SimpleGrid,
  Text,
} from "components"
import { useIsBaseBreakpoint } from "hooks"
import React from "react"

export function AddAccount() {
  const isBase = useIsBaseBreakpoint()
  console.log({ isBase })

  return (
    <Layout>
      <Layout.Main py={4} px={isBase ? 4 : 0}>
        <ContainerWrapper {...(isBase ? {} : { maxW: "container.lg" })}>
          <Button as={RouterLink} to="/accounts" variant="link" mb={4}>
            <Text>Back</Text>
          </Button>
          <Heading size="lg" mb={2}>
            Add an account
          </Heading>
          <SimpleGrid columns={isBase ? 1 : 3} spacing={4}>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md">
                Create A New Account
              </Heading>
              <Text mb={8}>Some description of how this works maybe?</Text>
              <Button colorScheme="green" isFullWidth>
                CREATE NEW
              </Button>
            </Box>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md">
                Import Seed Words
              </Heading>
              <Text mb={8}>Some description of how this works maybe?</Text>
              <Button colorScheme="green" isFullWidth>
                IMPORT
              </Button>
            </Box>
            <Box shadow="md" p={4}>
              <Heading mb={3} size="md">
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
  )
}
